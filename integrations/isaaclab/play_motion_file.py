# Copyright (c) 2022-2026, The Isaac Lab Project Developers (https://github.com/isaac-sim/IsaacLab/blob/main/CONTRIBUTORS.md).
# All rights reserved.
#
# SPDX-License-Identifier: BSD-3-Clause

"""Replay a named G1 motion and its paired terrain with Isaac Lab/Newton.

Run with the Isaac Lab interpreter, adding video dependencies through uv:

.. code-block:: bash

    uv run --no-project --python /path/to/IsaacLab/.venv/bin/python \
        --with imageio --with imageio-ffmpeg python integrations/isaaclab/play_motion_file.py \
        --motion_file data/parc/jump_005/motion.npz

The robot asset is selected from NPZ metadata. Terrain accepts canonical
``terrain_position``, ``terrain_dimension``, and ``terrain_quat`` keys as well
as the legacy box fields. Positions are meters in the motion reference frame;
box dimensions are full sizes and box quaternions are xyzw. Mesh vertices and
faces can be supplied alongside boxes. ``ground_height`` explicitly sets ground Z.

Interactive playback follows the source FPS and holds the final pose. ``--loop``
repeats without blending the last-to-first transition. Add ``--video --headless``
to record a full clip without wall-clock pacing. This is kinematic replay, not a
tracking-policy rollout. See integrations/isaaclab/README.md for requirements.
"""

from __future__ import annotations

import argparse
import os
import time
from typing import Literal

import numpy as np

from isaaclab.app import add_launcher_args, launch_simulation

parser = argparse.ArgumentParser(description="Replay a WBC npz motion with Newton MJWarp and OpenGL.")
parser.add_argument("--motion_file", "-f", type=str, required=True, help="Path to the motion npz file.")
parser.add_argument(
    "--quaternion_order",
    choices=("wxyz", "xyzw"),
    default="wxyz",
    help="Order for untagged motion files; NPZ quaternion_order metadata takes precedence.",
)
parser.add_argument(
    "--root_body_index",
    type=int,
    default=0,
    help="Body index in body_pos_w/body_quat_w to use as the articulation root pose.",
)
parser.add_argument("--loop", action="store_true", help="Repeat instead of holding the final pose.")
parser.add_argument("--camera_distance", type=float, default=1.5, help="Camera distance from the robot.")
parser.add_argument(
    "--camera_offset",
    type=float,
    nargs=3,
    help="World XYZ offset in meters from the robot root; overrides camera_distance.",
)
parser.add_argument("--video", action="store_true", default=False, help="Record a video of the replay.")
parser.add_argument(
    "--video_length",
    type=int,
    default=0,
    help="Length of the recorded video (in frames). Defaults to one full pass of the motion.",
)
parser.add_argument("--video_folder", type=str, default="logs/mimic", help="Directory to write the recorded video to.")
parser.add_argument(
    "--video_resolution", type=int, nargs=2, default=(1280, 720), help="Width and height of the recorded video."
)

add_launcher_args(parser)
parser.add_argument("--headless", action="store_true", help="Render offscreen with Newton GL.")
parser.set_defaults(visualizer=["newton_gl"])
args_cli = parser.parse_args()

import imageio.v2 as imageio
import torch
from isaaclab_newton.physics import MJWarpSolverCfg, NewtonCfg
from isaaclab_visualizers.newton import NewtonGLVisualizerCfg

import isaaclab.sim as sim_utils
from isaaclab.assets import ArticulationCfg, AssetBaseCfg, RigidObjectCfg
from isaaclab.scene import InteractiveScene, InteractiveSceneCfg
from isaaclab.sim import SimulationContext
from isaaclab.utils.configclass import configclass
from isaaclab.utils.math import convert_quat
from isaaclab.visualizers import WindowCfg

from isaaclab_assets.robots.unitree import (
    UNITREE_G1_29DOF_BALL_HAND_CFG,
    UNITREE_G1_29DOF_BOX_FOOT_CFG,
    UNITREE_G1_29DOF_CFG,
)


@configclass
class ReplayNpzSceneCfg(InteractiveSceneCfg):
    """Scene used to view a saved WBC npz motion."""

    ground = AssetBaseCfg(prim_path="/World/defaultGroundPlane", spawn=sim_utils.GroundPlaneCfg())

    robot: ArticulationCfg = UNITREE_G1_29DOF_CFG.replace(prim_path="{ENV_REGEX_NS}/Robot")


# Legacy NPZ files store joints in PhysX articulation order.
LEGACY_JOINT_NAMES = (
    "left_hip_pitch_joint",
    "right_hip_pitch_joint",
    "waist_yaw_joint",
    "left_hip_roll_joint",
    "right_hip_roll_joint",
    "waist_roll_joint",
    "left_hip_yaw_joint",
    "right_hip_yaw_joint",
    "waist_pitch_joint",
    "left_knee_joint",
    "right_knee_joint",
    "left_shoulder_pitch_joint",
    "right_shoulder_pitch_joint",
    "left_ankle_pitch_joint",
    "right_ankle_pitch_joint",
    "left_shoulder_roll_joint",
    "right_shoulder_roll_joint",
    "left_ankle_roll_joint",
    "right_ankle_roll_joint",
    "left_shoulder_yaw_joint",
    "right_shoulder_yaw_joint",
    "left_elbow_joint",
    "right_elbow_joint",
    "left_wrist_roll_joint",
    "right_wrist_roll_joint",
    "left_wrist_pitch_joint",
    "right_wrist_pitch_joint",
    "left_wrist_yaw_joint",
    "right_wrist_yaw_joint",
)


class NpzMotion:
    """Small loader for the npz files consumed by the WBC motion command."""

    def __init__(self, motion_file: str, device: str, quaternion_order: Literal["wxyz", "xyzw"] = "wxyz"):
        data = np.load(motion_file, allow_pickle=False)
        required_keys = ("fps", "joint_pos", "joint_vel", "body_pos_w", "body_quat_w")
        missing_keys = [key for key in required_keys if key not in data]
        if missing_keys:
            raise KeyError(f"Motion file is missing required keys: {missing_keys}")

        self.joint_names = list(data["joint_names"]) if "joint_names" in data else list(LEGACY_JOINT_NAMES)
        self.motion_file = motion_file
        self.fps = float(np.asarray(data["fps"]).reshape(-1)[0])
        if not np.isfinite(self.fps) or self.fps <= 0:
            data.close()
            raise ValueError("Motion FPS must be finite and positive.")
        self.joint_pos = torch.tensor(data["joint_pos"], dtype=torch.float32, device=device)
        self.joint_vel = torch.tensor(data["joint_vel"], dtype=torch.float32, device=device)
        self.body_pos_w = torch.tensor(data["body_pos_w"], dtype=torch.float32, device=device)
        self.body_quat_w = torch.tensor(data["body_quat_w"], dtype=torch.float32, device=device)
        if "quaternion_order" in data:
            quaternion_order = str(np.asarray(data["quaternion_order"]).item())
        if quaternion_order not in ("wxyz", "xyzw"):
            data.close()
            raise ValueError(f"Unsupported motion quaternion order: {quaternion_order!r}")
        if quaternion_order == "wxyz":
            self.body_quat_w = convert_quat(self.body_quat_w, to="xyzw")
        self.object_pose = None
        if "object_pos_w" in data:
            if quaternion_order != "xyzw":
                raise ValueError("Moving-object references require explicit xyzw quaternions.")
            self.object_pose = torch.tensor(
                np.concatenate((data["object_pos_w"], data["object_quat_w"]), axis=1),
                dtype=torch.float32,
                device=device,
            )
            if self.object_pose.shape != (len(self.joint_pos), 7):
                raise ValueError("Object and robot trajectories must have matching frame counts.")
        self.object_part_poses = None
        if "object_part_names" in data:
            self.object_part_poses = torch.tensor(
                np.concatenate((data["object_part_pos_w"], data["object_part_quat_w"]), axis=-1),
                dtype=torch.float32,
                device=device,
            )
            if self.object_part_poses.shape != (len(self.joint_pos), len(data["object_part_names"]), 7):
                raise ValueError("Object part and robot trajectories must have matching frame counts.")
        data.close()
        self.num_frames = self.joint_pos.shape[0]
        if not self.num_frames:
            raise ValueError("Motion must contain at least one frame.")
        self.current_idx = 0

        print(f"[INFO]: Motion loaded: {motion_file}")
        print(f"[INFO]: fps={self.fps}, frames={self.num_frames}, duration={(self.num_frames - 1) / self.fps:.3f}s")

    def next_frame(self, *, loop: bool = False) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor]:
        frame = (
            self.joint_pos[self.current_idx],
            self.joint_vel[self.current_idx],
            self.body_pos_w[self.current_idx],
            self.body_quat_w[self.current_idx],
        )
        self.current_idx = (
            (self.current_idx + 1) % self.num_frames if loop else min(self.current_idx + 1, self.num_frames - 1)
        )
        return frame


class ViewportRecorder:
    """Record RGB frames from the Newton GL visualizer."""

    def __init__(self, sim: SimulationContext, video_path: str, fps: int):
        self.visualizer = next(viz for viz in sim.visualizers if viz.cfg.visualizer_type == "newton_gl")
        os.makedirs(os.path.dirname(video_path) or ".", exist_ok=True)
        self.video_path = video_path
        self.writer = imageio.get_writer(video_path, fps=fps, macro_block_size=16)
        self.num_frames = 0

    def capture(self) -> bool:
        """Append the current RGB frame, returning whether capture succeeded."""
        rgb = self.visualizer.render_rgb_array()
        if rgb is None or rgb.size == 0:
            return False
        self.writer.append_data(rgb[:, :, :3])
        self.num_frames += 1
        return True

    def close(self):
        self.writer.close()
        print(f"[INFO]: Saved {self.num_frames} frames to {os.path.abspath(self.video_path)}")


def run_simulator(sim: SimulationContext, scene: InteractiveScene):
    """Stream the saved motion state into the robot and render it."""

    motion = NpzMotion(args_cli.motion_file, sim.device, args_cli.quaternion_order)
    robot = scene["robot"]

    print("[INFO]: Isaac Lab articulation joint index order:")
    for index, name in enumerate(robot.joint_names):
        print(f"  joint_pos[{index:02d}] = {name}")

    print("[INFO]: Isaac Lab articulation body index order:")
    for index, name in enumerate(robot.body_names):
        print(f"  body_pos_w[{index:02d}] = {name}")

    if motion.joint_pos.shape[1] != robot.num_joints:
        raise ValueError(
            f"Motion has {motion.joint_pos.shape[1]} joints, but robot has {robot.num_joints}. "
            "This viewer expects npz joint_pos/joint_vel in the robot joint order."
        )

    if args_cli.root_body_index >= motion.body_pos_w.shape[1]:
        raise ValueError(
            f"root_body_index={args_cli.root_body_index} is out of range for {motion.body_pos_w.shape[1]} saved bodies."
        )

    joint_indices = [motion.joint_names.index(name) for name in robot.joint_names]

    recorder = None
    if args_cli.video:
        video_length = args_cli.video_length if args_cli.video_length > 0 else motion.num_frames
        video_name = os.path.splitext(os.path.basename(args_cli.motion_file))[0] + ".mp4"
        recorder = ViewportRecorder(sim, os.path.join(args_cli.video_folder, video_name), motion.fps)
        print(f"[INFO]: Recording {video_length} frames at {motion.fps} fps.")

    last_render_time = None
    try:
        while sim.is_running():
            frame_index = motion.current_idx
            joint_pos_frame, joint_vel_frame, body_pos_frame, body_quat_frame = motion.next_frame(loop=args_cli.loop)

            root_states = robot.data.default_root_pose.torch.clone()
            root_states[:, :3] = body_pos_frame[args_cli.root_body_index]
            root_states[:, :2] += scene.env_origins[:, :2]
            root_states[:, 3:7] = body_quat_frame[args_cli.root_body_index]
            robot.write_root_pose_to_sim_index(root_pose=root_states[:, :7])
            robot.write_root_velocity_to_sim_index(root_velocity=robot.data.default_root_vel.torch)

            joint_pos = robot.data.default_joint_pos.torch.clone()
            joint_vel = robot.data.default_joint_vel.torch.clone()
            joint_pos[:] = joint_pos_frame[joint_indices]
            joint_vel[:] = joint_vel_frame[joint_indices]
            robot.write_joint_position_to_sim_index(position=joint_pos)
            robot.write_joint_velocity_to_sim_index(velocity=joint_vel)

            if motion.object_pose is not None:
                object_pose = motion.object_pose[frame_index : frame_index + 1].clone()
                object_pose[:, :2] += scene.env_origins[:, :2]
                scene["reference_object"].write_root_pose_to_sim_index(root_pose=object_pose)

            if motion.object_part_poses is not None:
                for index in range(motion.object_part_poses.shape[1]):
                    pose = motion.object_part_poses[frame_index : frame_index + 1, index].clone()
                    pose[:, :2] += scene.env_origins[:, :2]
                    scene[f"reference_part_{index}"].write_root_pose_to_sim_index(root_pose=pose)

            # aim the camera before rendering so the captured frame matches the pose being shown
            pos_lookat = root_states[0, :3].cpu().numpy()
            if motion.object_pose is not None:
                pos_lookat = (pos_lookat + object_pose[0, :3].cpu().numpy()) / 2
            camera_offset = np.array(
                args_cli.camera_offset
                if args_cli.camera_offset is not None
                else [args_cli.camera_distance, args_cli.camera_distance, 0.2]
            )
            sim.set_camera_view(pos_lookat + camera_offset, pos_lookat)

            if not args_cli.headless:
                if last_render_time is not None:
                    delay = last_render_time + 1.0 / motion.fps - time.perf_counter()
                    if delay > 0:
                        time.sleep(delay)
                last_render_time = time.perf_counter()
            sim.render()
            scene.update(sim.get_physics_dt())

            if recorder is not None:
                if not recorder.capture():
                    # renderer not ready yet, so replay this frame again rather than dropping it
                    motion.current_idx = frame_index
                elif recorder.num_frames >= video_length:
                    return
    finally:
        if recorder is not None:
            recorder.close()


def main():
    with launch_simulation(cfg=NewtonCfg(solver_cfg=MJWarpSolverCfg()), launcher_args=args_cli) as physics_cfg:
        motion_fps = NpzMotion(args_cli.motion_file, "cpu", args_cli.quaternion_order).fps
        sim_cfg = sim_utils.SimulationCfg(
            device=args_cli.device,
            physics=physics_cfg,
            dt=1.0 / motion_fps,
            visualizer_cfgs=[
                NewtonGLVisualizerCfg(
                    window=WindowCfg(size=tuple(args_cli.video_resolution), fps=motion_fps),
                    headless=args_cli.headless,
                )
            ],
        )
        sim = SimulationContext(sim_cfg)
        scene_cfg = ReplayNpzSceneCfg(num_envs=1, env_spacing=2.0)
        with np.load(args_cli.motion_file, allow_pickle=False) as archive:
            data = dict(archive)
            if "terrain_position" in data:
                data["terrain_boxes"] = np.concatenate((data["terrain_position"], data["terrain_dimension"]), axis=1)
            if "terrain_quat" in data:
                data["terrain_box_quat"] = data["terrain_quat"]
            if "ground_height" not in data and any(key in data for key in ("terrain_boxes", "terrain_vertices")):
                scene_cfg.ground = None
            if "ground_height" in data:
                height = float(data["ground_height"])
                if not np.isfinite(height):
                    raise ValueError("ground_height must be finite.")
                scene_cfg.ground.init_state.pos = (0.0, 0.0, height)
            if "terrain_vertices" in data or "terrain_faces" in data:
                import trimesh

                from isaaclab.terrains.utils import create_prim_from_mesh

                vertices, faces = data["terrain_vertices"], data["terrain_faces"]
                if vertices.ndim != 2 or vertices.shape[1] != 3 or not np.isfinite(vertices).all():
                    raise ValueError("terrain_vertices must contain finite world XYZ rows.")
                if (
                    faces.ndim != 2
                    or faces.shape[1] != 3
                    or not np.issubdtype(faces.dtype, np.integer)
                    or len(faces) == 0
                    or faces.min() < 0
                    or faces.max() >= len(vertices)
                ):
                    raise ValueError("terrain_faces must contain valid vertex-index triangles.")
                create_prim_from_mesh(
                    "/World/TerrainMesh",
                    trimesh.Trimesh(vertices=vertices, faces=faces, process=False),
                    visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=(0.35, 0.45, 0.55)),
                )
                scene_cfg.terrain_mesh = AssetBaseCfg(prim_path="/World/TerrainMesh")
            if "object_pos_w" in data:
                scene_cfg.reference_object = RigidObjectCfg(
                    prim_path="/World/ReferenceObject",
                    spawn=sim_utils.MeshFileCfg(
                        mesh=sim_utils.MeshFileCfg.TriangleMeshCfg(
                            vertices=data["object_vertices"], faces=data["object_faces"]
                        ),
                        rigid_props=sim_utils.RigidBodyPropertiesCfg(disable_gravity=True),
                        mass_props=sim_utils.MassPropertiesCfg(mass=1.0),
                        collision_props=None,  # Prescribed kinematic replay; this is not a dynamics experiment.
                        visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=(0.65, 0.38, 0.15)),
                    ),
                    init_state=RigidObjectCfg.InitialStateCfg(
                        pos=tuple(data["object_pos_w"][0]),
                        rot=tuple(data["object_quat_w"][0]),
                    ),
                )
            if "object_part_names" in data:
                vertex_start, face_start = 0, 0
                for index, name in enumerate(data["object_part_names"]):
                    vertex_end = vertex_start + int(data["object_part_vertex_counts"][index])
                    face_end = face_start + int(data["object_part_face_counts"][index])
                    color = (0.65, 0.45, 0.25) if name == "box_main" else (0.2, 0.22, 0.25)
                    setattr(
                        scene_cfg,
                        f"reference_part_{index}",
                        RigidObjectCfg(
                            prim_path=f"/World/ReferencePart{index}",
                            spawn=sim_utils.MeshFileCfg(
                                mesh=sim_utils.MeshFileCfg.TriangleMeshCfg(
                                    vertices=data["object_part_vertices"][vertex_start:vertex_end],
                                    faces=data["object_part_faces"][face_start:face_end],
                                ),
                                rigid_props=sim_utils.RigidBodyPropertiesCfg(disable_gravity=True),
                                mass_props=sim_utils.MassPropertiesCfg(mass=1.0),
                                collision_props=None,
                                visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=color),
                            ),
                            init_state=RigidObjectCfg.InitialStateCfg(
                                pos=tuple(data["object_part_pos_w"][0, index]),
                                rot=tuple(data["object_part_quat_w"][0, index]),
                            ),
                        ),
                    )
                    vertex_start, face_start = vertex_end, face_end
            if "robot_asset" in data:
                asset_name = str(data["robot_asset"].item())
                assets = {
                    "UNITREE_G1_29DOF_BOX_FOOT_CFG": UNITREE_G1_29DOF_BOX_FOOT_CFG,
                    "UNITREE_G1_29DOF_BALL_HAND_CFG": UNITREE_G1_29DOF_BALL_HAND_CFG,
                }
                if asset_name not in assets:
                    raise ValueError(f"Unsupported motion robot_asset: {asset_name!r}")
                scene_cfg.robot = assets[asset_name].replace(prim_path="{ENV_REGEX_NS}/Robot")
            if "terrain_boxes" in data:
                boxes = data["terrain_boxes"]
                if boxes.ndim != 2 or boxes.shape[1] != 6 or not np.isfinite(boxes).all():
                    raise ValueError("terrain_boxes must contain finite [center xyz, size xyz] rows.")
                if np.any(boxes[:, 3:] <= 0):
                    raise ValueError("Terrain box sizes must be positive.")
                box_quats = (
                    data["terrain_box_quat"]
                    if "terrain_box_quat" in data
                    else np.tile([0.0, 0.0, 0.0, 1.0], (len(boxes), 1))
                )
                if box_quats.shape != (len(boxes), 4) or not np.allclose(
                    np.linalg.norm(box_quats, axis=-1), 1.0, atol=1e-5
                ):
                    raise ValueError("terrain_box_quat must contain one normalized xyzw quaternion per box.")
                for index, box in enumerate(boxes):
                    setattr(
                        scene_cfg,
                        f"terrain_box_{index}",
                        AssetBaseCfg(
                            prim_path=f"/World/TerrainBox_{index}",
                            spawn=sim_utils.CuboidCfg(
                                size=tuple(float(value) for value in box[3:]),
                                collision_props=sim_utils.CollisionPropertiesCfg(),
                                visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=(0.35, 0.45, 0.55)),
                            ),
                            init_state=AssetBaseCfg.InitialStateCfg(
                                pos=tuple(float(value) for value in box[:3]),
                                rot=tuple(float(value) for value in box_quats[index]),
                            ),
                        ),
                    )
        scene = InteractiveScene(scene_cfg)
        sim.reset()
        print("[INFO]: Setup complete.")
        run_simulator(sim, scene)


if __name__ == "__main__":
    main()
