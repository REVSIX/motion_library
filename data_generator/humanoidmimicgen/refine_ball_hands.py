# Copyright (c) 2026, Motion Library contributors.
# SPDX-License-Identifier: BSD-3-Clause
"""Fit spherical hands to nearby cart surfaces, retaining root, legs and object poses.

Contact intervals are inferred from geometric proximity, not source force labels.
This is an arm-only kinematic adaptation, not a physically validated pushing policy.
"""

import argparse
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path

import h5py
import mujoco
import numpy as np
from huggingface_hub import hf_hub_download
from scipy.ndimage import gaussian_filter1d
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from data_generator.humanoidmimicgen.import_cart import REPOSITORY, REVISION, SOURCE_FILE


def cart_boxes():
    source = hf_hub_download(REPOSITORY, SOURCE_FILE, repo_type="dataset", revision=REVISION)
    with h5py.File(source) as file:
        root = ET.fromstring(file["data/demo_1"].attrs["model_file"])
    boxes = []
    for geom in root.find(".//body[@name='shelf_main']").findall("geom"):
        if geom.get("type") == "box":
            boxes.append(
                (
                    np.fromstring(geom.get("pos", "0 0 0"), sep=" "),
                    Rotation.from_quat(np.fromstring(geom.get("quat", "1 0 0 0"), sep=" ")[[1, 2, 3, 0]]),
                    np.fromstring(geom.get("size"), sep=" "),
                )
            )
    return boxes


def closest_box(points, boxes):
    targets, distances = [], []
    for center, rotation, half_size in boxes:
        local = rotation.inv().apply(points - center)
        clamped = np.clip(local, -half_size, half_size)
        inside = (np.abs(local) <= half_size).all(axis=1)
        # Inside points project to the nearest face, not to themselves.
        for index in np.flatnonzero(inside):
            axis = np.argmin(half_size - np.abs(local[index]))
            clamped[index, axis] = half_size[axis] * (1 if local[index, axis] >= 0 else -1)
        targets.append(rotation.apply(clamped) + center)
        delta = np.abs(local) - half_size
        distances.append(np.linalg.norm(np.maximum(delta, 0), axis=1) + np.minimum(delta.max(axis=1), 0))
    distances, targets = np.stack(distances, axis=1), np.stack(targets, axis=1)
    ids = distances.argmin(axis=1)
    return targets[np.arange(len(points)), ids], distances[np.arange(len(points)), ids]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--robot_mjcf", type=Path, required=True)
    args = parser.parse_args()
    with np.load(args.input, allow_pickle=False) as source:
        values = dict(source)
    spec = mujoco.MjSpec.from_file(str(args.robot_mjcf))
    spec.worldbody.add_geom(name="floor", type=mujoco.mjtGeom.mjGEOM_PLANE, size=[10, 10, 0.1])
    model, boxes = spec.compile(), cart_boxes()
    data = mujoco.MjData(model)
    names = values["joint_names"].tolist()
    addresses = [int(model.joint(name).qposadr[0]) for name in names]
    source_qpos = values["qpos"].copy()
    cart_rot = Rotation.from_quat(values["object_quat_w"])
    cart_pos = values["object_pos_w"]
    centers = np.empty((len(source_qpos), 2, 3))
    orientations = np.empty((len(source_qpos), 2, 3, 3))
    geom_ids = [model.geom(side + "_ball_pad").id for side in ("left", "right")]
    for frame, q in enumerate(source_qpos):
        data.qpos[:7] = np.r_[q[:3], q[6], q[3:6]]
        data.qpos[addresses] = q[7:]
        mujoco.mj_forward(model, data)
        centers[frame] = data.geom_xpos[geom_ids]
        orientations[frame] = data.geom_xmat[geom_ids].reshape(2, 3, 3)
    maximum_delta, errors, flags = [], [], []
    for side_index, side in enumerate(("left", "right")):
        local = cart_rot.inv().apply(centers[:, side_index] - cart_pos)
        surface, distance = closest_box(local, boxes)
        radius = model.geom_size[geom_ids[side_index], 0]
        direction = local - surface
        direction /= np.linalg.norm(direction, axis=1, keepdims=True)
        desired = cart_rot.apply(surface + radius * direction) + cart_pos
        gap = distance - radius
        # Full correction within 6 cm; fade to no correction by 10 cm.
        blend = np.clip((0.10 - gap) / 0.04, 0, 1)
        blend = blend * blend * (3 - 2 * blend)
        blend = gaussian_filter1d(blend, sigma=float(values["fps"]) * 0.10)
        desired = centers[:, side_index] + blend[:, None] * (desired - centers[:, side_index])
        active = blend > 0.995
        flags.append(active)
        indices = [
            i
            for i, name in enumerate(names)
            if name.startswith(side) and any(part in name for part in ("shoulder", "elbow", "wrist"))
        ]
        adr = np.asarray(addresses)[indices]
        limits = np.array([model.joint(names[i]).range for i in indices])
        previous_delta = np.zeros(len(indices))
        for frame, q in enumerate(source_qpos):
            data.qpos[:7] = np.r_[q[:3], q[6], q[3:6]]
            data.qpos[addresses] = values["qpos"][frame, 7:]
            initial = q[7:][indices]
            target_rotation = Rotation.from_matrix(orientations[frame, side_index])

            def residual(joints):
                data.qpos[adr] = joints
                mujoco.mj_forward(model, data)
                rotation = Rotation.from_matrix(data.geom_xmat[geom_ids[side_index]].reshape(3, 3))
                return np.r_[
                    20 * (data.geom_xpos[geom_ids[side_index]] - desired[frame]),
                    0.1 * (rotation * target_rotation.inv()).as_rotvec(),
                    0.03 * (joints - initial),
                    0.03 * (joints - initial - previous_delta),
                ]

            result = least_squares(
                residual,
                np.clip(initial + previous_delta, limits[:, 0], limits[:, 1]),
                bounds=(limits[:, 0], limits[:, 1]),
                max_nfev=35,
                ftol=1e-7,
                xtol=1e-7,
            )
            values["qpos"][frame, 7 + np.asarray(indices)] = result.x
            previous_delta = result.x - initial
            maximum_delta.append(float(np.abs(previous_delta).max()))
            residual(result.x)
            if active[frame]:
                errors.append(float(np.linalg.norm(data.geom_xpos[geom_ids[side_index]] - desired[frame])))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(args.output, **values)
    report = {
        "method": "Arm-only bounded IK to nearest original cart collision-box surface; smooth proximity gating",
        "contact_interpretation": "Geometrically inferred intervals, not measured contact or source contact labels",
        "full_correction_surface_gap_threshold_m": 0.06,
        "no_correction_surface_gap_threshold_m": 0.10,
        "blend_smoothing_s": 0.10,
        "maximum_joint_correction_rad": max(maximum_delta),
        "active_target_position_error_max_m": max(errors),
        "active_frame_count_per_hand": [int(f.sum()) for f in flags],
        "robot_root_modified": False,
        "legs_modified": False,
        "object_trajectory_modified": False,
        "source_qpos_sha256": hashlib.sha256(args.input.read_bytes()).hexdigest(),
        "target_mjcf_sha256": hashlib.sha256(args.robot_mjcf.read_bytes()).hexdigest(),
    }
    (args.output.parent / "hand_refinement.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
