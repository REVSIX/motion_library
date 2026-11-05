# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Author sole-center targets on fixed stair geometry without a motion model.

These are geometric guides, not humanoid motions or Kimodo constraint files.
Robot-specific IK must convert them into reachable poses. Timing and clearance
are configurable candidate-generation settings, not training requirements.
"""

import argparse
import hashlib
import inspect
import json
from pathlib import Path

import numpy as np


def contact_plan(
    scene,
    *,
    fps=50,
    swing_time=0.7,
    support_time=0.2,
    hold_time=0.5,
    clearance=0.05,
    stance_half_width=0.1,
    leading="left",
):
    """Return alternating-foot guides in world XYZ, Z-up, using full-size solid boxes.

    Each swing lifts vertically, crosses at clearance above the destination,
    then lowers. The final trailing-foot step brings both feet to the top.
    Contacts are prescribed schedule labels, not simulated contact measurements.
    """
    values = [fps, swing_time, support_time, hold_time, clearance, stance_half_width]
    if not np.isfinite(values).all() or min(values) <= 0 or int(fps) != fps:
        raise ValueError("FPS must be a positive integer; timing, clearance and stance width must be positive.")
    if leading not in ("left", "right"):
        raise ValueError("Leading foot must be left or right.")
    boxes = np.asarray(scene["terrain_boxes"], dtype=float)
    quats = np.asarray(scene["terrain_box_quat"], dtype=float)
    if boxes.ndim != 2 or boxes.shape[1] != 6 or not len(boxes):
        raise ValueError("Expected nonempty terrain boxes with XYZ centers and full dimensions.")
    if not np.isfinite(boxes).all() or not (boxes[:, 3:] > 0).all():
        raise ValueError("Terrain boxes must be finite with positive full dimensions.")
    if quats.shape != (len(boxes), 4) or not np.allclose(quats, [0, 0, 0, 1]):
        raise ValueError("Only axis-aligned ascending stairs with identity xyzw rotations are supported.")
    edges = boxes[:, 0] - boxes[:, 3] / 2
    boxes = boxes[np.argsort(edges)]
    fronts, rears = boxes[:, 0] - boxes[:, 3] / 2, boxes[:, 0] + boxes[:, 3] / 2
    tops = boxes[:, 2] + boxes[:, 5] / 2
    if not (np.diff(fronts) > 0).all() or not (np.diff(tops) > 0).all():
        raise ValueError("Stair fronts and tops must strictly ascend.")
    if not np.allclose(rears, rears[0]) or not np.allclose(boxes[:, 2] - boxes[:, 5] / 2, 0):
        raise ValueError("Expected nested solid boxes with floor-level bottoms and a common rear edge.")
    if not np.allclose(boxes[:, 1], 0) or stance_half_width >= boxes[:, 4].min() / 2:
        raise ValueError("Stairs must be centered on Y=0 and contain both sole-center targets.")
    tread = float(scene["tread_depth_m"])
    if not np.isfinite(tread) or tread <= 0:
        raise ValueError("Tread depth must be finite and positive.")
    depths = np.diff(np.r_[fronts, rears[-1]])
    if not np.allclose(depths[:-1], tread) or depths[-1] < tread:
        raise ValueError("Scene tread depth does not agree with the supplied box geometry.")
    first = 0 if leading == "left" else 1
    feet = np.array([[fronts[0] - tread, stance_half_width, 0], [fronts[0] - tread, -stance_half_width, 0]])
    events = []
    time = hold_time
    for event, level in enumerate([*range(len(boxes)), len(boxes) - 1]):
        side = (first + event) % 2
        target = np.array([fronts[level] + tread / 2, feet[side, 1], tops[level]])
        events.append(
            {
                "foot": side,
                "start": time + support_time,
                "end": time + support_time + swing_time,
                "from": feet[side].tolist(),
                "to": target.tolist(),
                "stair_level": level + 1,
            }
        )
        feet[side] = target
        time += support_time + swing_time
    times = np.arange(int(np.ceil((time + hold_time) * fps)) + 1) / fps
    positions = np.zeros((len(times), 2, 3))
    positions[:] = [[fronts[0] - tread, stance_half_width, 0], [fronts[0] - tread, -stance_half_width, 0]]
    contacts = np.ones((len(times), 2), dtype=bool)

    def smooth(u):
        u = np.clip(u, 0, 1)
        return u * u * (3 - 2 * u)

    for event in events:
        side = event["foot"]
        start, end = event["start"], event["end"]
        old, target = np.array(event["from"]), np.array(event["to"])
        active = times > start
        u = np.clip((times[active] - start) / (end - start), 0, 1)
        high = max(old[2], target[2]) + clearance
        positions[active, side] = old + smooth((u - 0.25) / 0.5)[:, None] * (target - old)
        positions[active, side, 2] = (
            old[2] + (high - old[2]) * smooth(u / 0.25) - (high - target[2]) * smooth((u - 0.75) / 0.25)
        )
        contacts[(times > start) & (times < end), side] = False
    return {"times": times, "sole_center_targets": positions, "prescribed_contacts": contacts}, events


def prepare_plans(requests_dir, output, **settings):
    """Write one paired scene and contact guide per request; preserve existing output."""
    bound = inspect.signature(contact_plan).bind(None, **settings)
    bound.apply_defaults()
    settings = {key: value for key, value in bound.arguments.items() if key != "scene"}
    paths = sorted(Path(requests_dir).rglob("terrain.json"))
    if not paths:
        raise ValueError("No terrain.json requests found.")
    # Validate all inputs before creating output, so bad geometry does not leave a partial batch.
    plans = []
    for path in paths:
        scene = json.loads(path.read_text(encoding="utf-8"))
        arrays, events = contact_plan(scene, **settings)
        plans.append((path, arrays, events))
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    for path, arrays, events in plans:
        dest = output / path.relative_to(requests_dir).parent
        dest.mkdir(parents=True)
        (dest / "terrain.json").write_bytes(path.read_bytes())
        np.savez_compressed(dest / "contact_plan.npz", **arrays)
        report = {
            "status": "geometric_guides_only",
            "terrain_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "coordinate_system": "world XYZ, Z-up, meters",
            "target_reference": "sole centers; not ankle/body origins",
            "settings": settings,
            "events": events,
            "contact_source": "prescribed schedule; not simulated measurements",
            "robot_reachability_validated": False,
            "dynamic_tracking_validated": False,
            "next_stage": "Exact-robot IK, then Kimodo skeleton conversion and constraint loading.",
        }
        (dest / "plan.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return len(plans)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--requests-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--fps", type=int, default=50)
    parser.add_argument("--swing-time", type=float, default=0.7)
    parser.add_argument("--support-time", type=float, default=0.2)
    parser.add_argument("--hold-time", type=float, default=0.5)
    parser.add_argument("--clearance", type=float, default=0.05)
    parser.add_argument("--stance-half-width", type=float, default=0.1)
    parser.add_argument("--leading", choices=("left", "right"), default="left")
    args = vars(parser.parse_args())
    print(f"Prepared {prepare_plans(args.pop('requests_dir'), args.pop('output'), **args)} geometric guides.")
