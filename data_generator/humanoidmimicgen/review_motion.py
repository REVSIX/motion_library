# Copyright (c) 2026, Motion Library contributors.
# SPDX-License-Identifier: BSD-3-Clause
"""Check cart-reference geometry, source preservation and arm continuity."""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.spatial.transform import Rotation

from data_generator.humanoidmimicgen.refine_ball_hands import cart_boxes, closest_box
from tools.terrain_contract import require_object, require_scene


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("motion", type=Path)
    parser.add_argument("--unrefined", type=Path, required=True)
    args = parser.parse_args()
    with np.load(args.motion, allow_pickle=False) as f:
        data = dict(f)
    with np.load(args.unrefined, allow_pickle=False) as f:
        original = dict(f)
    require_scene(data, args.motion)
    require_object(data, args.motion)
    boxes = cart_boxes()
    rotation = Rotation.from_quat(data["object_quat_w"])
    active_errors, all_gaps = [], []
    for side in range(2):
        before = rotation.inv().apply(original["hand_sphere_centers_w"][:, side] - data["object_pos_w"])
        _, old_distances = closest_box(before, boxes)
        gap = old_distances - data["hand_sphere_radii"][side]
        blend = np.clip((0.10 - gap) / 0.04, 0, 1)
        blend = gaussian_filter1d(blend * blend * (3 - 2 * blend), sigma=float(data["fps"]) * 0.10)
        active = blend > 0.995
        local = rotation.inv().apply(data["hand_sphere_centers_w"][:, side] - data["object_pos_w"])
        _, distances = closest_box(local, boxes)
        new_gap = distances - data["hand_sphere_radii"][side]
        active_errors.extend(np.abs(new_gap[active]))
        all_gaps.extend(new_gap)
    foot_min = float(data["foot_box_corners_w"][..., 2].min())
    excess = float(
        max(
            0,
            np.maximum(
                data["joint_limits"][:, 0] - data["joint_pos"], data["joint_pos"] - data["joint_limits"][:, 1]
            ).max(),
        )
    )
    step = float(np.abs(np.diff(data["joint_pos"], axis=0)).max())
    for key in ("object_pos_w", "object_quat_w", "object_part_pos_w", "object_part_quat_w"):
        if not np.array_equal(data[key], original[key]):
            raise ValueError(f"Source object trajectory changed: {key}")
    lower_ids = [
        i
        for i, name in enumerate(data["joint_names"])
        if any(part in name for part in ("hip", "knee", "ankle", "waist"))
    ]
    if not np.array_equal(data["joint_pos"][:, lower_ids], original["joint_pos"][:, lower_ids]):
        raise ValueError("Lower-body source motion changed.")
    if not np.array_equal(data["body_pos_w"][:, 0], original["body_pos_w"][:, 0]):
        raise ValueError("Root position changed.")
    passed = (
        excess < 1e-4 and foot_min >= -0.025 and np.max(active_errors) < 0.01 and min(all_gaps) >= -0.01 and step < 0.15
    )
    report = {
        "status": "retained_kinematic_candidate" if passed else "rejected_geometry",
        "motion_sha256": hashlib.sha256(args.motion.read_bytes()).hexdigest(),
        "frames": len(data["joint_pos"]),
        "fps": float(data["fps"]),
        "last_sample_time_s": (len(data["joint_pos"]) - 1) / float(data["fps"]),
        "max_joint_limit_excess_rad": excess,
        "max_joint_step_rad": step,
        "min_foot_corner_height_above_floor_m": foot_min,
        "min_ball_surface_gap_to_cart_collision_boxes_m": float(min(all_gaps)),
        "inferred_contact_surface_error_m": {
            "median": float(np.median(active_errors)),
            "p95": float(np.quantile(active_errors, 0.95)),
            "max": float(np.max(active_errors)),
        },
        "cart_displacement_xy_m": float(np.linalg.norm(data["object_pos_w"][-1, :2] - data["object_pos_w"][0, :2])),
        "root_lower_body_and_object_trajectories_unchanged": True,
        "object_part_count": len(data["object_part_names"]),
        "dynamic_tracking_validated": False,
        "full_body_collision_validated": False,
        "source_contact_labels_available": False,
        "note": "Contact intervals are inferred from source-pose proximity to original cart collision boxes, not measured force. Negative gaps indicate penetration. Arm IK changes the source motion to accommodate ball pads. Wheels and payload retain their recorded world trajectories.",
        "screening_thresholds": {
            "max_joint_limit_excess_rad": 0.0001,
            "max_floor_penetration_m": 0.025,
            "max_active_contact_error_m": 0.01,
            "max_ball_penetration_m": 0.01,
            "max_joint_step_rad": 0.15,
        },
    }
    (args.motion.parent / "quality_review.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if not passed:
        raise SystemExit("Cart geometry review failed.")


if __name__ == "__main__":
    main()
