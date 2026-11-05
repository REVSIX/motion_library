# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Prepare fixed stair scenes and held-out geometry requests for motion generation.

This writes scene requests, not new motions. The current Kimodo terrain batch
does not support stairs; stair contact constraints must be implemented before
these requests can be generated and refined. Never resize terrain under an
unchanged motion and describe the result as a new climbing reference.
"""

import argparse
import hashlib
import itertools
import json
from pathlib import Path

import numpy as np


def prepare(source: Path, output: Path, *, preset: Path | None = None):
    """Inspect a supplied G1 clip, then author the preset's stair scenes in meters."""
    preset = Path(preset) if preset else Path(__file__).with_name("stair_sweep_preset.json")
    settings = json.loads(preset.read_text(encoding="utf-8"))
    axes = []
    for key in ("riser_heights_m", "tread_depths_m", "stair_widths_m"):
        values = np.asarray(settings[key], dtype=float)
        if values.ndim != 1 or not len(values) or not np.isfinite(values).all() or (values <= 0).any():
            raise ValueError(f"{key} must contain finite positive dimensions.")
        if len(np.unique(values)) != len(values):
            raise ValueError(f"{key} contains duplicate dimensions.")
        axes.append(values.tolist())
    count = settings["step_count"]
    if type(count) is not int or count < 1:
        raise ValueError("step_count must be a positive integer.")
    if not np.isfinite([settings["start_x_m"], settings["landing_depth_m"]]).all() or settings["landing_depth_m"] <= 0:
        raise ValueError("Start must be finite and landing depth must be positive.")
    seeds = settings["motion_seeds"]
    if not seeds or any(type(seed) is not int or seed < 0 for seed in seeds) or len(set(seeds)) != len(seeds):
        raise ValueError("motion_seeds must be distinct nonnegative integers.")
    if type(settings["split_seed"]) is not int or settings["split_seed"] < 0:
        raise ValueError("split_seed must be a nonnegative integer.")
    counts = settings["split_counts"]
    if set(counts) != {"train", "validation", "test"} or any(type(n) is not int or n < 0 for n in counts.values()):
        raise ValueError("split_counts must provide nonnegative train, validation and test counts.")
    combinations = list(itertools.product(*axes))
    if sum(counts.values()) != len(combinations):
        raise ValueError("split_counts must add up to the number of geometry combinations.")
    # Keep readable default case names while rejecting names that would alias distinct geometries.
    names = [f"stairs_h{rise * 100:02g}_d{tread * 100:02g}_w{width * 100:03g}" for rise, tread, width in combinations]
    if len(set(names)) != len(names):
        raise ValueError("Geometry names collide; use dimensions distinguishable at six significant figures.")
    with np.load(source, allow_pickle=False) as data:
        required = {
            "fps",
            "joint_pos",
            "joint_limits",
            "body_quat_w",
            "quaternion_order",
            "robot_asset",
            "terrain_position",
            "terrain_dimension",
            "ground_height",
        }
        if required - set(data.files):
            raise ValueError(f"Missing source arrays: {sorted(required - set(data.files))}")
        fps = data["fps"]
        joints, limits, quats = data["joint_pos"], data["joint_limits"], data["body_quat_w"]
        if fps.ndim != 0 or not np.isfinite(fps) or fps <= 0 or float(fps) != int(fps):
            raise ValueError("Source fps must be a positive integer scalar.")
        if joints.ndim != 2 or joints.shape[1] != 29 or not len(joints):
            raise ValueError("Expected a nonempty (frames, 29) joint_pos array.")
        if limits.shape != (29, 2) or (limits[:, 0] > limits[:, 1]).any():
            raise ValueError("Expected ordered joint_limits with shape (29, 2).")
        if quats.ndim != 3 or quats.shape[0] != len(joints) or quats.shape[1] < 1 or quats.shape[2] != 4:
            raise ValueError("Expected body_quat_w with shape (frames, bodies, 4).")
        positions, dimensions = data["terrain_position"], data["terrain_dimension"]
        if positions.ndim != 2 or positions.shape[1] != 3 or not len(positions) or dimensions.shape != positions.shape:
            raise ValueError("Expected nonempty paired (boxes, 3) terrain arrays.")
        if (dimensions <= 0).any() or data["ground_height"].ndim != 0:
            raise ValueError("Terrain dimensions must be positive and ground_height must be scalar.")
        if "terrain_quat" in data:
            rotations = data["terrain_quat"]
            if rotations.shape != (len(positions), 4) or not np.allclose(np.abs(rotations), [0, 0, 0, 1]):
                raise ValueError("Source stair inspection supports axis-aligned boxes only.")
        report = {
            "source": str(source.resolve()),
            "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "arrays": {key: {"shape": list(data[key].shape), "dtype": str(data[key].dtype)} for key in data.files},
            "fps": int(data["fps"]),
            "frames": len(data["joint_pos"]),
            "robot_asset": str(data["robot_asset"].item()),
            "quaternion_order": str(data["quaternion_order"].item()),
            "finite_numeric_arrays": all(
                np.isfinite(data[key]).all() for key in data.files if data[key].dtype.kind in "fc"
            ),
        }
        if not report["finite_numeric_arrays"]:
            raise ValueError("Source contains nonfinite numeric data")
        if data["joint_pos"].shape[1] != 29 or report["quaternion_order"] != "xyzw":
            raise ValueError("Expected a 29-joint G1 reference with xyzw quaternions")
        limits = data["joint_limits"]
        report["max_joint_limit_violation_rad"] = float(
            np.maximum(np.maximum(limits[:, 0] - data["joint_pos"], data["joint_pos"] - limits[:, 1]), 0).max()
        )
        report["max_quaternion_norm_error"] = float(np.abs(np.linalg.norm(data["body_quat_w"], axis=-1) - 1).max())
        report["dynamic_tracking_validated"] = False
        # These are nested solid boxes; their top heights and leading edges define the steps.
        boxes = np.c_[data["terrain_position"], data["terrain_dimension"]]
        edges = boxes[:, 0] - boxes[:, 3] / 2
        tops = boxes[:, 2] + boxes[:, 5] / 2
        order = np.argsort(edges)
        report["source_stairs"] = {
            "leading_edges_x_m": edges[order].tolist(),
            "top_heights_m": tops[order].tolist(),
            "riser_heights_m": np.diff(np.r_[float(data["ground_height"]), tops[order]]).tolist(),
            "tread_depths_m": np.diff(edges[order]).tolist(),
            "widths_m": boxes[:, 4].tolist(),
        }
    output.mkdir(parents=True, exist_ok=False)
    (output / "source_report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    (output / "preset.json").write_text(json.dumps(settings, indent=2) + "\n", encoding="utf-8")
    # Split by geometry, not by random motion seed. No identical staircase crosses splits.
    permutation = np.random.default_rng(settings["split_seed"]).permutation(len(combinations))
    splits, offset = {}, 0
    for split in ("train", "validation", "test"):
        splits[split] = permutation[offset : offset + counts[split]]
        offset += counts[split]
    for split, indices in splits.items():
        requests = []
        for index in indices:
            rise, tread, width = combinations[index]
            case = names[index]
            # Nested boxes share a back edge, forming solid ascending steps.
            start, landing = settings["start_x_m"], settings["landing_depth_m"]
            end = start + count * tread + landing
            boxes = []
            for step in range(count):
                front, top = start + step * tread, (step + 1) * rise
                boxes.append([(front + end) / 2, 0, top / 2, end - front, width, top])
            scene = {
                "name": case,
                "scenario": "stairs",
                "step_height_m": rise,
                "tread_depth_m": tread,
                "stair_width_m": width,
                "step_count": count,
                "terrain_boxes": boxes,
                "terrain_box_quat": [[0, 0, 0, 1]] * count,
                "support_surface_indices": list(range(count + 1)),
                "coordinate_system": "Z-up, X-forward, meters; box dimensions are full sizes",
                "geometry_source": "specified_before_generation",
                "reference_robot_asset": report["robot_asset"],
                "prompt": f"A person walks forward up {count} stairs, placing each foot on the treads, then stops on the top landing.",
                "seeds": seeds,
                "status": "needs_stair_constraints_and_generation",
                "dynamic_tracking_validated": False,
            }
            dest = output / split / case
            dest.mkdir(parents=True)
            (dest / "terrain.json").write_text(json.dumps(scene, indent=2) + "\n", encoding="utf-8")
            requests.append(scene)
        (output / f"{split}_requests.json").write_text(json.dumps(requests, indent=2) + "\n", encoding="utf-8")
    (output / "README.txt").write_text(
        f"{len(combinations)} authored geometries: {counts}; {len(seeds)} requested seeds each.\n"
        "Requests only. No new motion NPZs have been generated.\n"
        "Pilot dimensions: assess kinematic reachability and dynamic tracking before training selection.\n"
        "The existing Kimodo terrain_batch.py has no stairs scenario. Implement terrain-derived foot constraints,\n"
        "then generate, refine, exact-asset export, render, and validate each paired motion and terrain.\n"
        "Keep failed candidates separate. Do not alter the supplied motion's terrain in place.\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--preset", type=Path, help="Geometry ranges, step count, motion seeds and split settings JSON."
    )
    args = parser.parse_args()
    prepare(args.source, args.output, preset=args.preset)
