# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Check sparse stair guide poses with the supplied robot's actual foot contacts.

Writes IK keyframes, not generated motion or Kimodo constraints. Kinematic results
apply only to the supplied MJCF and sampled frames; dynamics are not simulated.
"""

import argparse
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path

import mujoco
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation


def sole_center(model, body):
    """Read a flat sole reference from sphere contacts or a single unrotated box."""
    geoms = [
        i
        for i in range(model.ngeom)
        if model.geom_bodyid[i] == body and (model.geom_contype[i] or model.geom_conaffinity[i])
    ]
    if not geoms:
        raise ValueError("Foot has no collision geometry.")
    if all(model.geom_type[i] == mujoco.mjtGeom.mjGEOM_SPHERE for i in geoms):
        positions = model.geom_pos[geoms]
        bottoms = positions[:, 2] - model.geom_size[geoms, 0]
        if not np.allclose(bottoms, bottoms[0]):
            raise ValueError("Foot sphere contacts do not define a horizontal sole.")
        return np.r_[(positions[:, :2].min(axis=0) + positions[:, :2].max(axis=0)) / 2, bottoms[0]]
    if len(geoms) == 1 and model.geom_type[geoms[0]] == mujoco.mjtGeom.mjGEOM_BOX:
        i = geoms[0]
        if np.allclose(model.geom_quat[i], [1, 0, 0, 0]):
            return model.geom_pos[i] - [0, 0, model.geom_size[i, 2]]
    raise ValueError("Unsupported foot contacts; provide an explicit robot-specific sole adapter.")


class StairKinematics:
    """Use named G1 joints and compiled collision geometry, without editing source assets."""

    def __init__(self, mjcf, scene):
        mjcf = Path(mjcf).resolve()
        root = ET.parse(mjcf).getroot()
        compiler = root.find("compiler")
        if compiler is None:
            compiler = ET.SubElement(root, "compiler")
        compiler.set("meshdir", str((mjcf.parent / compiler.get("meshdir", ".")).resolve()))
        world = root.find("worldbody")
        ET.SubElement(world, "geom", name="guide_floor", type="plane", size="0 0 0.1")
        for i, (box, quat) in enumerate(zip(scene["terrain_boxes"], scene["terrain_box_quat"], strict=True)):
            ET.SubElement(
                world,
                "geom",
                name=f"guide_stair_{i}",
                type="box",
                pos=" ".join(map(str, box[:3])),
                size=" ".join(map(str, np.array(box[3:]) / 2)),
                quat=" ".join(map(str, np.array(quat)[[3, 0, 1, 2]])),
            )
        self.model = mujoco.MjModel.from_xml_string(ET.tostring(root, encoding="unicode"))
        self.data = mujoco.MjData(self.model)
        self.joints = [i for i in range(self.model.njnt) if self.model.jnt_type[i] == mujoco.mjtJoint.mjJNT_HINGE]
        if self.model.nq != 36 or len(self.joints) != 29 or self.model.jnt_type[0] != mujoco.mjtJoint.mjJNT_FREE:
            raise ValueError("Expected a floating-base G1 with 29 hinge joints.")
        self.names = [self.model.joint(i).name for i in self.joints]
        self.addresses = self.model.jnt_qposadr[self.joints]
        self.feet = [self.model.body(f"{side}_ankle_roll_link").id for side in ("left", "right")]
        self.soles = np.array([sole_center(self.model, body) for body in self.feet])
        self.leg_joints = [
            i for i in self.joints if any(part in self.model.joint(i).name for part in ("hip", "knee", "ankle"))
        ]
        self.variables = np.r_[[0, 1, 2], self.model.jnt_qposadr[self.leg_joints]]
        self.bounds = self.model.jnt_range[self.leg_joints]
        self.robot_geoms = [
            i
            for i in range(self.model.ngeom)
            if self.model.geom_bodyid[i] != 0 and (self.model.geom_contype[i] or self.model.geom_conaffinity[i])
        ]
        self.terrain_geoms = [self.model.geom("guide_floor").id] + [
            self.model.geom(f"guide_stair_{i}").id for i in range(len(scene["terrain_boxes"]))
        ]

    def forward(self, qpos):
        self.data.qpos[:] = qpos
        mujoco.mj_kinematics(self.model, self.data)
        matrices = self.data.xmat[self.feet].reshape(2, 3, 3)
        return self.data.xpos[self.feet] + np.einsum("bij,bj->bi", matrices, self.soles), matrices

    def solve(self, seed, targets):
        qpos = seed.copy()
        lower = np.r_[targets[:, 0].min() - 1, -1, targets[:, 2].min() + 0.25, self.bounds[:, 0]]
        upper = np.r_[targets[:, 0].max() + 1, 1, targets[:, 2].max() + 1.1, self.bounds[:, 1]]
        original = np.clip(qpos[self.variables], lower, upper)

        def residual(values):
            qpos[self.variables] = values
            positions, rotations = self.forward(qpos)
            return np.r_[
                200 * (positions - targets).ravel(),
                20 * Rotation.from_matrix(rotations).as_rotvec().ravel(),
                0.02 * (values - original),
            ]

        result = least_squares(residual, original, bounds=(lower, upper), max_nfev=100, ftol=1e-6, xtol=1e-6, gtol=1e-4)
        qpos[self.variables] = result.x
        positions, rotations = self.forward(qpos)
        distances = [
            mujoco.mj_geomDistance(self.model, self.data, robot, terrain, 0.1, None)
            for robot in self.robot_geoms
            for terrain in self.terrain_geoms
        ]
        return qpos.copy(), {
            "max_sole_error_m": float(np.linalg.norm(positions - targets, axis=-1).max()),
            "max_foot_rotation_error_rad": float(
                np.linalg.norm(Rotation.from_matrix(rotations).as_rotvec(), axis=-1).max()
            ),
            "max_robot_terrain_penetration_m": float(max(0, -min(distances))),
            "solver_converged": bool(result.success),
            "solver_evaluations": int(result.nfev),
            "solver_status": int(result.status),
        }


def check_plan(mjcf, plan_dir, seed_motion, output, samples=32):
    """Solve sampled guide frames and retain actual errors, including failed candidates."""
    if type(samples) is not int or samples < 2:
        raise ValueError("Use at least two samples.")
    plan_dir, mjcf, seed_motion, output = Path(plan_dir), Path(mjcf), Path(seed_motion), Path(output)
    if output.exists():
        raise FileExistsError(output)
    scene = json.loads((plan_dir / "terrain.json").read_text(encoding="utf-8"))
    boxes = np.asarray(scene["terrain_boxes"], dtype=float)
    quats = np.asarray(scene["terrain_box_quat"], dtype=float)
    if (
        boxes.ndim != 2
        or boxes.shape[1] != 6
        or not len(boxes)
        or not np.isfinite(boxes).all()
        or (boxes[:, 3:] <= 0).any()
    ):
        raise ValueError("Expected finite terrain boxes with positive full dimensions.")
    if quats.shape != (len(boxes), 4) or not np.allclose(quats, [0, 0, 0, 1]):
        raise ValueError("Expected identity xyzw terrain rotations from the stair planner.")
    with np.load(plan_dir / "contact_plan.npz", allow_pickle=False) as data:
        targets, times = data["sole_center_targets"], data["times"]
    if (
        times.ndim != 1
        or len(times) < 2
        or not np.isfinite(times).all()
        or times[0] < 0
        or not (np.diff(times) > 0).all()
    ):
        raise ValueError("Guide times must be finite, nonnegative and strictly increasing.")
    if targets.shape != (len(times), 2, 3) or not np.isfinite(targets).all():
        raise ValueError("Expected finite sole_center_targets with shape (frames, 2, 3).")
    with np.load(seed_motion, allow_pickle=False) as data:
        names, joints = data["joint_names"], data["joint_pos"]
        if names.shape != (29,) or names.dtype.kind not in "US" or len(set(names.tolist())) != 29:
            raise ValueError("Expected 29 unique seed joint names.")
        if joints.ndim != 2 or joints.shape[1] != 29 or not len(joints) or not np.isfinite(joints).all():
            raise ValueError("Expected finite seed joint_pos with shape (frames, 29).")
        source_names = names.tolist()
        source_joints = joints[0].copy()
        source_asset = str(data["robot_asset"].item())
    robot = StairKinematics(mjcf, scene)
    if set(source_names) != set(robot.names):
        raise ValueError("Seed and target robot joint names differ.")
    seed = robot.model.qpos0.copy()
    seed[robot.addresses] = source_joints[[source_names.index(name) for name in robot.names]]
    limits = robot.model.jnt_range[robot.joints]
    seed[robot.addresses] = np.clip(seed[robot.addresses], limits[:, 0], limits[:, 1])
    positions, _ = robot.forward(seed)
    seed[:3] += (targets[0] - positions).mean(axis=0)
    indices = np.unique(np.linspace(0, len(times) - 1, min(samples, len(times))).round().astype(int))
    frames, metrics = [], []
    previous = seed.copy()
    for index in indices:
        previous[:3] = seed[:3] + (targets[index] - targets[0]).mean(axis=0)
        qpos, error = robot.solve(previous, targets[index])
        frames.append(qpos)
        metrics.append(dict(frame=int(index), time_s=float(times[index]), **error))
        previous = qpos
    maxima = {
        key: max(frame[key] for frame in metrics)
        for key in ("max_sole_error_m", "max_foot_rotation_error_rad", "max_robot_terrain_penetration_m")
    }
    joint_positions = np.array(frames)[:, robot.addresses]
    max_joint_violation = float(
        np.maximum(np.maximum(limits[:, 0] - joint_positions, joint_positions - limits[:, 1]), 0).max()
    )
    report = {
        "target_robot_mjcf": str(mjcf.resolve()),
        "target_robot_sha256": hashlib.sha256(mjcf.read_bytes()).hexdigest(),
        "seed_motion_sha256": hashlib.sha256(seed_motion.read_bytes()).hexdigest(),
        "terrain_sha256": hashlib.sha256((plan_dir / "terrain.json").read_bytes()).hexdigest(),
        "contact_plan_sha256": hashlib.sha256((plan_dir / "contact_plan.npz").read_bytes()).hexdigest(),
        "seed_robot_asset": source_asset,
        "seed_usage": "Initial joint posture only; target FK/collisions use the supplied MJCF.",
        "sole_centers_local_m": robot.soles.tolist(),
        "sampled_frames": len(indices),
        "total_guide_frames": len(times),
        "maxima": maxima,
        "max_joint_limit_violation_rad": max_joint_violation,
        "frames": metrics,
        "passes_sampled_pose_checks": maxima["max_sole_error_m"] <= 0.005
        and maxima["max_foot_rotation_error_rad"] <= np.deg2rad(2)
        and maxima["max_robot_terrain_penetration_m"] <= 0.005
        and max_joint_violation <= 1e-9,
        "seed_target_geometry_equivalence_verified": False,
        "all_solver_calls_converged": all(frame["solver_converged"] for frame in metrics),
        "pose_check_basis": "Measured residuals, joint limits and terrain gaps of the final iterates; optimizer status is reported separately.",
        "thresholds": {"sole_error_m": 0.005, "foot_rotation_error_degrees": 2, "penetration_m": 0.005},
        "self_collision_checked": False,
        "dynamic_tracking_validated": False,
        "mujoco_version": mujoco.__version__,
        "solver_settings": {"max_nfev": 100, "ftol": 1e-6, "xtol": 1e-6, "gtol": 1e-4},
    }
    output.mkdir(parents=True, exist_ok=False)
    (output / "ik_report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    np.savez_compressed(
        output / "ik_keyframes.npz",
        qpos=np.array(frames),
        frame_indices=indices,
        times=times[indices],
        joint_names=robot.names,
        quaternion_order="wxyz",
    )
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mjcf", type=Path, required=True)
    parser.add_argument("--plan-dir", type=Path, required=True)
    parser.add_argument("--seed-motion", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--samples", type=int, default=32)
    args = vars(parser.parse_args())
    print(json.dumps(check_plan(**args)["maxima"], indent=2))
