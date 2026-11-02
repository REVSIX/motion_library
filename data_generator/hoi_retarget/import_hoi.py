# Copyright (c) 2026, Motion Library contributors.
# SPDX-License-Identifier: BSD-3-Clause
"""Import selected public G1 pushing references with their original object meshes.

The source is kinematic retargeting, not measured robot execution. Object geometry
and trajectories are already scaled independently by the source; do not scale poses again.
"""

import argparse
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath

import numpy as np
import pyarrow.parquet as pq
import trimesh
from huggingface_hub import hf_hub_download
from scipy.spatial.transform import Rotation

REPOSITORY = "leggedrobotics/hoi-retarget"
REVISION = "b5ac8125e497e6735d6314e63a0e1eedf6229336"
SELECTION = {
    "box_push": ("sub12_largebox_009", "Two-hand box push"),
    "table_push": ("sub5_largetable_034", "Two-hand table push"),
    "plastic_box_push": ("sub12_plasticbox_005", "Low box push"),
    "suitcase_push": ("sub4_suitcase_001", "Two-hand suitcase push"),
}


def download(name):
    return Path(hf_hub_download(REPOSITORY, name, repo_type="dataset", revision=REVISION))


def object_mesh(row):
    """Load the supplied OMOMO visual mesh in the exact object-pose frame."""
    if row["dataset"] != "omomo":
        raise ValueError("Only OMOMO meshes are included in this public source release.")
    name = f"assets/objects/{row['object']}.urdf"
    urdf_path = download(name)
    meshes, sources = [], [name]
    for visual in ET.parse(urdf_path).findall("link/visual"):
        node = visual.find("geometry/mesh")
        mesh_name = str(PurePosixPath(name).parent / node.attrib["filename"])
        mesh = trimesh.load(download(mesh_name), force="mesh", process=False)
        mesh.vertices *= np.fromstring(node.get("scale", "1 1 1"), sep=" ")
        origin = visual.find("origin")
        if origin is not None:
            rotation = Rotation.from_euler("xyz", np.fromstring(origin.get("rpy", "0 0 0"), sep=" "))
            mesh.vertices = rotation.apply(mesh.vertices) + np.fromstring(origin.get("xyz", "0 0 0"), sep=" ")
        meshes.append(mesh)
        sources.append(mesh_name)
    mesh = trimesh.util.concatenate(meshes)
    scale = float(row["object_scale"]) * float(row["object_aug_scale"]) if row["scale_object_mesh"] else 1.0
    mesh.vertices *= scale
    return mesh, sources, scale


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("outputs/hoi_retarget"))
    parser.add_argument("--clips", nargs="+", choices=list(SELECTION), default=list(SELECTION))
    args = parser.parse_args()
    source_path = download("data/omomo/unitree_g1/train-00000-of-00001.parquet")
    ids = ["omomo/unitree_g1/" + SELECTION[key][0] for key in args.clips]
    rows = pq.read_table(source_path, filters=[("clip_id", "in", ids)]).to_pylist()
    rows = {r["clip_id"]: r for r in rows}
    for key in args.clips:
        subject, label = SELECTION[key]
        row = rows["omomo/unitree_g1/" + subject]
        if not row["qc_pass"] or row["robot"] != "unitree_g1" or len(row["dof_names"]) != 29:
            raise ValueError(f"Unreviewed or incompatible source row: {row['clip_id']}")
        folder = args.output / key
        folder.mkdir(parents=True, exist_ok=True)
        mesh, mesh_sources, scale = object_mesh(row)
        root, obj = np.array(row["root_pos"]), np.array(row["object_pos"])
        # Source quaternions are wxyz; the canonical motion library is xyzw.
        qpos = np.c_[root, np.array(row["root_rot"])[:, [1, 2, 3, 0]], row["dof_pos"]]
        obj_quat = np.array(row["object_rot"])[:, [1, 2, 3, 0]]
        # A finite representation of the source's z=0 floor, covering the whole motion.
        scene_points = np.r_[root[:, :2], obj[:, :2]]
        lower, upper = scene_points.min(axis=0) - 1.5, scene_points.max(axis=0) + 1.5
        floor = np.r_[(lower + upper) / 2, -0.05, upper - lower, 0.1][None]
        contacts = np.asarray(row["per_link_contact_flags"], dtype=bool)
        np.savez_compressed(
            folder / "g1_qpos.npz",
            qpos=qpos,
            fps=row["fps"],
            joint_names=row["dof_names"],
            quaternion_order="xyzw",
            terrain_boxes=floor,
            terrain_box_quat=[[0, 0, 0, 1]],
            object_name=row["object"],
            object_pos_w=obj,
            object_quat_w=obj_quat,
            object_vertices=np.asarray(mesh.vertices, dtype=np.float32),
            object_faces=np.asarray(mesh.faces, dtype=np.int32),
            source_contact_link_names=row["contact_link_names"],
            source_object_contact_flags=contacts,
            source_contact_points_object=np.asarray(row["fixed_contact_points_per_frame_in_object_frame"], dtype=float),
            object_ground_contact=np.asarray(row["object_ground_contact_sequence"], dtype=bool).reshape(-1),
            foot_contacts=np.asarray(row["robot_foot_ground_contact_flags"], dtype=bool),
        )
        if row.get("video", {}).get("bytes"):
            (folder / "source_preview.mp4").write_bytes(row["video"]["bytes"])
        provenance = {
            "display_name": label,
            "category": "Object pushing",
            "description": "G1 reference with a moving object mesh and floor. Source hand-contact labels are retained; ball-hand contact and dynamic tracking require validation.",
            "source_url": "https://huggingface.co/datasets/" + REPOSITORY,
            "source_dataset": REPOSITORY,
            "source_revision": REVISION,
            "source_clip_id": row["clip_id"],
            "source_motion_capture": "OMOMO",
            "source_contact_annotations": "InterAct",
            "license": "CC-BY-NC-SA-4.0",
            "object_mesh_license": "MIT",
            "object_mesh_sources": mesh_sources,
            "object_mesh_scale": scale,
            "source_fps": row["fps"],
            "source_frames": row["n_frames"],
            "source_qc_pass": row["qc_pass"],
            "source_joint_step_max_deg": row["dj_max_deg"],
            "source_object_displacement_xy_m": float(np.linalg.norm(obj[-1, :2] - obj[0, :2])),
            "source_two_hand_contact_fraction": float(contacts[:, :2].all(axis=1).mean()),
            "source_quaternion_order": "wxyz",
            "output_quaternion_order": "xyzw",
            "floor": "Source z=0 floor represented by a finite 0.1 m thick slab; top surface remains z=0.",
            "object_trajectory_modified": False,
            "dynamic_tracking_validated": False,
            "import_sha256": hashlib.sha256((folder / "g1_qpos.npz").read_bytes()).hexdigest(),
        }
        (folder / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
        print(f"Imported {key}: {row['n_frames']} frames, {len(mesh.vertices)} object vertices")
    for name in ["NOTICE.md", "assets/objects/LICENSE-OBJECTS"]:
        destination = args.output / Path(name).name
        destination.write_bytes(download(name).read_bytes())


if __name__ == "__main__":
    main()
