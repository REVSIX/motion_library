# Copyright (c) 2026, Motion Library contributors.
# SPDX-License-Identifier: BSD-3-Clause
"""Screen exported pushing references against target geometry; no dynamics claims."""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from scipy.spatial.transform import Rotation

from tools.terrain_contract import require_object, require_scene


def review(path):
    with np.load(path, allow_pickle=False) as d:
        require_scene(d, path)
        require_object(d, path)
        n = len(d["joint_pos"])
        names = d["source_contact_link_names"].tolist()
        ids = [names.index(side + "_palm_pad") for side in ("left", "right")]
        flags, points = d["source_object_contact_flags"][:, ids], d["source_contact_points_object"][:, ids]
        rotation = Rotation.from_quat(d["object_quat_w"])
        world = np.stack([rotation.apply(points[:, i]) for i in range(2)], axis=1) + d["object_pos_w"][:, None]
        # Distance from the recorded target point to the target robot's ball surface.
        # This is not a measurement of all hand-object or body-object intersections.
        radial_error = np.abs(np.linalg.norm(d["hand_sphere_centers_w"] - world, axis=-1) - d["hand_sphere_radii"])
        radial_error = radial_error[flags]
        floor_z = float((d["terrain_position"][:, 2] + d["terrain_dimension"][:, 2] / 2).max())
        object_lowest = (
            np.array(
                [
                    (rot.apply(d["object_vertices"])[:, 2] + pos[2]).min()
                    for rot, pos in zip(rotation, d["object_pos_w"])
                ]
            )
            - floor_z
        )
        foot_min = float(d["foot_box_corners_w"][..., 2].min() - floor_z)
        excess = float(
            max(0, np.maximum(d["joint_limits"][:, 0] - d["joint_pos"], d["joint_pos"] - d["joint_limits"][:, 1]).max())
        )
        report = {
            "motion_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "frames": n,
            "fps": float(d["fps"]),
            "duration_s": n / float(d["fps"]),
            "max_joint_limit_excess_rad": excess,
            "min_foot_corner_height_above_floor_m": foot_min,
            "min_object_vertex_height_above_floor_m": float(object_lowest.min()),
            "median_object_lowest_height_above_floor_m": float(np.median(object_lowest)),
            "source_contact_target_to_ball_surface_error_m": {
                "median": float(np.median(radial_error)),
                "p95": float(np.quantile(radial_error, 0.95)),
                "max": float(radial_error.max()),
            },
            "object_displacement_xy_m": float(np.linalg.norm(d["object_pos_w"][-1, :2] - d["object_pos_w"][0, :2])),
            "dynamic_tracking_validated": False,
            "full_body_collision_validated": False,
            "note": "Contact errors use source-labeled palm targets and the exported G1 ball surfaces. Negative floor heights indicate geometric penetration. Source labels are not newly measured robot contacts.",
        }
        passed = (
            excess < 1e-4
            and foot_min >= -0.025
            and object_lowest.min() >= -0.025
            and np.quantile(radial_error, 0.95) <= 0.025
        )
        report["status"] = "retained_kinematic_candidate" if passed else "rejected_geometry"
        report["screening_thresholds"] = {
            "max_joint_limit_excess_rad": 0.0001,
            "max_floor_penetration_m": 0.025,
            "max_contact_error_p95_m": 0.025,
        }
        return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("motion", type=Path)
    args = parser.parse_args()
    report = review(args.motion)
    (args.motion.parent / "quality_review.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if report["status"] != "retained_kinematic_candidate":
        raise SystemExit("Geometry review failed; keep this candidate outside active data/.")


if __name__ == "__main__":
    main()
