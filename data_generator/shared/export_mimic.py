# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Export G1 joint trajectories using the mimic task's exact USD asset and Newton FK.

This is kinematic conversion, not a physics rollout or a tracking-policy evaluation.
Run with the Isaac Lab uv environment, separately from the Kimodo environment.
"""

from __future__ import annotations

import argparse
import itertools
from pathlib import Path

import numpy as np
from scipy.interpolate import CubicSpline, PchipInterpolator
from scipy.spatial.transform import Rotation, Slerp

from isaaclab.app import add_launcher_args, launch_simulation

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument(
    "--input", type=Path, required=True, help="g1_qpos.npz from a motion importer or kimodo/generate.py"
)
parser.add_argument("--output", type=Path, required=True)
parser.add_argument("--fps", type=int, default=50)
parser.add_argument(
    "--robot_asset",
    choices=("UNITREE_G1_29DOF_BOX_FOOT_CFG", "UNITREE_G1_29DOF_BALL_HAND_CFG"),
    default="UNITREE_G1_29DOF_BOX_FOOT_CFG",
)
add_launcher_args(parser)
args_cli = parser.parse_args()

import torch
from isaaclab_newton.physics import MJWarpSolverCfg, NewtonCfg

from pxr import Gf, Usd, UsdGeom

import isaaclab.sim as sim_utils
from isaaclab.assets import ArticulationCfg
from isaaclab.scene import InteractiveScene, InteractiveSceneCfg
from isaaclab.sim import SimulationContext
from isaaclab.utils import configclass

from isaaclab_assets import UNITREE_G1_29DOF_BALL_HAND_CFG, UNITREE_G1_29DOF_BOX_FOOT_CFG

ROBOT_CFG = {
    "UNITREE_G1_29DOF_BOX_FOOT_CFG": UNITREE_G1_29DOF_BOX_FOOT_CFG,
    "UNITREE_G1_29DOF_BALL_HAND_CFG": UNITREE_G1_29DOF_BALL_HAND_CFG,
}[args_cli.robot_asset]


@configclass
class ExportSceneCfg(InteractiveSceneCfg):
    """The same robot asset as the G1 29DOF mimic task."""

    robot: ArticulationCfg = ROBOT_CFG.replace(prim_path="{ENV_REGEX_NS}/Robot")


def foot_box_corners() -> np.ndarray:
    """Read eight collision-box corners in each ankle link frame from the USD."""
    stage = Usd.Stage.Open(ROBOT_CFG.spawn.usd_path)
    corners = []
    for side in ("left", "right"):
        prim = next(p for p in stage.Traverse() if str(p.GetPath()).endswith(f"/{side}_ankle_roll_link/box"))
        cube = UsdGeom.Cube(prim)
        half = cube.GetSizeAttr().Get() / 2
        transform = UsdGeom.Xformable(prim).GetLocalTransformation()
        corners.append([transform.Transform(Gf.Vec3d(*p)) for p in itertools.product((-half, half), repeat=3)])
    return np.asarray(corners)


def export(sim: SimulationContext, scene: InteractiveScene):
    with np.load(args_cli.input, allow_pickle=False) as source:
        qpos, source_fps = source["qpos"], float(source["fps"])
        source_names = source["joint_names"].tolist()
        contacts = source.get("foot_contacts")
        object_data = {
            key: source[key]
            for key in (
                "object_name",
                "object_pos_w",
                "object_quat_w",
                "object_vertices",
                "object_faces",
                "source_contact_link_names",
                "source_object_contact_flags",
                "source_contact_points_object",
                "object_ground_contact",
            )
            if key in source
        }
        object_data.update({key: source[key] for key in source.files if key.startswith("object_part_")})
        terrain = {
            key: source[key]
            for key in ("terrain_boxes", "terrain_box_quat", "terrain_vertices", "terrain_faces", "ground_height")
            if key in source
        }
        if str(source["quaternion_order"].item()) != "xyzw":
            raise ValueError("Input qpos must explicitly use xyzw quaternions.")
    if qpos.ndim != 2 or qpos.shape[1] != 36 or len(qpos) < 3 or not np.isfinite(qpos).all():
        raise ValueError("Expected at least three finite [root xyz, root xyzw, 29 joints] frames.")
    if source_fps <= 0 or args_cli.fps <= 0:
        raise ValueError("Frame rates must be positive.")
    robot = scene["robot"]
    if len(source_names) != 29 or len(set(source_names)) != 29 or set(source_names) != set(robot.joint_names):
        raise ValueError("Source and asset joint names must uniquely cover the same 29 joints.")
    source_times = np.arange(len(qpos)) / source_fps
    times = np.arange(int(np.floor(source_times[-1] * args_cli.fps)) + 1) / args_cli.fps
    root_pos = CubicSpline(source_times, qpos[:, :3])(times)
    root_quat = Slerp(source_times, Rotation.from_quat(qpos[:, 3:7]))(times).as_quat()
    joint_order = [source_names.index(name) for name in robot.joint_names]
    # Preserve each joint's source range; cubic splines can overshoot joint limits.
    joint_pos = PchipInterpolator(source_times, qpos[:, 7:][:, joint_order])(times)
    joint_vel = np.gradient(joint_pos, 1 / args_cli.fps, axis=0, edge_order=2)
    poses = []
    for position, quaternion, joints in zip(root_pos, root_quat, joint_pos):
        robot.write_root_pose_to_sim_index(
            root_pose=torch.tensor(np.r_[position, quaternion][None], dtype=torch.float32, device=sim.device)
        )
        robot.write_joint_position_to_sim_index(
            position=torch.tensor(joints[None], dtype=torch.float32, device=sim.device)
        )
        sim.forward()
        scene.update(sim.get_physics_dt())
        poses.append(robot.data.body_link_pose_w.torch[0].cpu().numpy().copy())
    poses = np.asarray(poses)
    body_pos, body_quat = poses[..., :3], poses[..., 3:]
    body_lin_vel = np.gradient(body_pos, 1 / args_cli.fps, axis=0, edge_order=2)
    # R(t+dt) R(t)^-1 gives angular velocity in the world frame.
    angular_segments = (
        Rotation.from_quat(body_quat[1:].reshape(-1, 4)) * Rotation.from_quat(body_quat[:-1].reshape(-1, 4)).inv()
    ).as_rotvec().reshape(len(times) - 1, robot.num_bodies, 3) * args_cli.fps
    body_ang_vel = np.concatenate(
        (angular_segments[:1], 0.5 * (angular_segments[:-1] + angular_segments[1:]), angular_segments[-1:])
    )
    foot_indices = [robot.body_names.index(f"{side}_ankle_roll_link") for side in ("left", "right")]
    local_corners = foot_box_corners()
    foot_rotations = Rotation.from_quat(body_quat[:, foot_indices].reshape(-1, 4)).as_matrix().reshape(-1, 2, 3, 3)
    corners_w = np.einsum("tfij,fcj->tfci", foot_rotations, local_corners) + body_pos[:, foot_indices, None, :]
    if args_cli.robot_asset == "UNITREE_G1_29DOF_BALL_HAND_CFG":
        stage = Usd.Stage.Open(ROBOT_CFG.spawn.usd_path)
        hand_centers, hand_radii = [], []
        for side in ("left", "right"):
            hand_index = robot.body_names.index(f"{side}_rubber_hand")
            pad = next(p for p in stage.Traverse() if str(p.GetPath()).endswith(f"/{side}_rubber_hand/ball_pad"))
            center = np.asarray(UsdGeom.Xformable(pad).GetLocalTransformation().ExtractTranslation())
            hand_centers.append(Rotation.from_quat(body_quat[:, hand_index]).apply(center) + body_pos[:, hand_index])
            hand_radii.append(UsdGeom.Sphere(pad).GetRadiusAttr().Get())
        terrain["hand_sphere_centers_w"] = np.stack(hand_centers, axis=1)
        terrain["hand_sphere_radii"] = np.asarray(hand_radii)
    if contacts is not None:
        nearest = np.minimum(np.rint(times * source_fps).astype(int), len(contacts) - 1)
        terrain["foot_contacts"] = contacts[nearest]
    if object_data:
        required = {"object_name", "object_pos_w", "object_quat_w", "object_vertices", "object_faces"}
        if not required.issubset(object_data):
            raise ValueError(f"Incomplete moving-object reference: {required - object_data.keys()}")
        if object_data["object_pos_w"].shape != (len(qpos), 3) or object_data["object_quat_w"].shape != (len(qpos), 4):
            raise ValueError("Object and robot trajectories must share source timestamps.")
        object_data["object_pos_w"] = PchipInterpolator(source_times, object_data["object_pos_w"])(times)
        object_data["object_quat_w"] = Slerp(source_times, Rotation.from_quat(object_data["object_quat_w"]))(
            times
        ).as_quat()
        object_data["object_lin_vel_w"] = np.gradient(
            object_data["object_pos_w"], 1 / args_cli.fps, axis=0, edge_order=2
        )
        rotations = Rotation.from_quat(object_data["object_quat_w"])
        segments = (rotations[1:] * rotations[:-1].inv()).as_rotvec() * args_cli.fps
        object_data["object_ang_vel_w"] = np.concatenate(
            (segments[:1], (segments[:-1] + segments[1:]) / 2, segments[-1:])
        )
        if "object_part_names" in object_data:
            part_positions, part_quats = [], []
            for index in range(len(object_data["object_part_names"])):
                part_positions.append(
                    PchipInterpolator(source_times, object_data["object_part_pos_w"][:, index])(times)
                )
                part_quats.append(
                    Slerp(source_times, Rotation.from_quat(object_data["object_part_quat_w"][:, index]))(
                        times
                    ).as_quat()
                )
            object_data["object_part_pos_w"] = np.stack(part_positions, axis=1)
            object_data["object_part_quat_w"] = np.stack(part_quats, axis=1)
            object_data["object_part_lin_vel_w"] = np.gradient(
                object_data["object_part_pos_w"], 1 / args_cli.fps, axis=0, edge_order=2
            )
            part_velocities = []
            for quats in part_quats:
                rotations = Rotation.from_quat(quats)
                segments = (rotations[1:] * rotations[:-1].inv()).as_rotvec() * args_cli.fps
                part_velocities.append(
                    np.concatenate((segments[:1], (segments[:-1] + segments[1:]) / 2, segments[-1:]))
                )
            object_data["object_part_ang_vel_w"] = np.stack(part_velocities, axis=1)
        previous = np.minimum(np.floor(times * source_fps + 1e-8).astype(int), len(qpos) - 1)
        for key in ("source_object_contact_flags", "source_contact_points_object", "object_ground_contact"):
            if key in object_data:
                object_data[key] = object_data[key][previous]
        terrain.update(object_data)
    args_cli.output.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args_cli.output,
        fps=args_cli.fps,
        joint_pos=joint_pos.astype(np.float32),
        joint_vel=joint_vel.astype(np.float32),
        body_pos_w=body_pos,
        body_quat_w=body_quat,
        body_lin_vel_w=body_lin_vel,
        body_ang_vel_w=body_ang_vel.astype(np.float32),
        joint_names=robot.joint_names,
        body_names=robot.body_names,
        quaternion_order="xyzw",
        joint_interpolation="pchip",
        robot_asset=args_cli.robot_asset,
        foot_box_corners_w=corners_w,
        joint_limits=robot.data.joint_pos_limits.torch[0].cpu().numpy(),
        **terrain,
    )
    print(f"Saved mimic dataset: {args_cli.output} ({len(times)} frames, {robot.num_bodies} bodies)")


def main():
    with launch_simulation(cfg=NewtonCfg(solver_cfg=MJWarpSolverCfg()), launcher_args=args_cli) as physics_cfg:
        sim = SimulationContext(sim_utils.SimulationCfg(device=args_cli.device, physics=physics_cfg, dt=0.02))
        scene = InteractiveScene(ExportSceneCfg(num_envs=1, env_spacing=2.0))
        sim.reset()
        export(sim, scene)


if __name__ == "__main__":
    main()
