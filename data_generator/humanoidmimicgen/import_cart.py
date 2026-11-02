# Copyright (c) 2026, Motion Library contributors.
# SPDX-License-Identifier: BSD-3-Clause
"""Import a recorded G1 cart push, preserving the cart, casters and payload poses."""

import argparse
import copy
import hashlib
import json
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

import h5py
import mujoco
import numpy as np
import trimesh
from huggingface_hub import hf_hub_download
from scipy.spatial.transform import Rotation

REPOSITORY = "linkenv/humanoidmimicgen-g1-source-demo-replay"
REVISION = "8553b2736497f41562bdf2476348b815fef68950"
ASSET_REVISION = "cb314ae44dbf67ef92feb88aee9d1c0fb93246e4"
SOURCE_FILE = "datasets/04_push_shelf_forward/demo.hdf5"
RAW_URL = f"https://raw.githubusercontent.com/NVlabs/humanoidmimicgen/{ASSET_REVISION}/"


def kinematic_model(root):
    """Compile the source joint tree without loading unrelated factory assets."""
    model = ET.Element("mujoco")
    ET.SubElement(model, "compiler", angle="radian")
    world = ET.SubElement(model, "worldbody")

    def body_tree(source):
        body = ET.Element("body", {k: v for k, v in source.attrib.items() if k in ("name", "pos", "quat")})
        for child in source:
            if child.tag in ("joint", "freejoint", "inertial"):
                body.append(copy.deepcopy(child))
            elif child.tag == "body":
                body.append(body_tree(child))
        if any(c.tag in ("joint", "freejoint") for c in body) and body.find("inertial") is None:
            # Only FK is evaluated; these dummy inertias do not define a simulation.
            ET.SubElement(body, "inertial", pos="0 0 0", mass="1", diaginertia=".01 .01 .01")
        return body

    for body in root.find("worldbody").findall("body"):
        if body.get("name") in ("robot0_base", "shelf_main", "box_main"):
            world.append(body_tree(body))
    return mujoco.MjModel.from_xml_string(ET.tostring(model, encoding="unicode"))


def body_mesh(root, body, cache):
    """Original visual triangles, scaled and placed in the source body's frame."""
    pieces, paths = [], []
    for geom in body.findall("geom"):
        if geom.get("group") != "1" or geom.get("type") != "mesh":
            continue
        asset = root.find(f"asset/mesh[@name='{geom.get('mesh')}']")
        relative = "humanoidmimicgen/locomanipulation/models/assets/" + asset.get("file").split("/assets/")[1]
        path = cache / relative
        if not path.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(RAW_URL + relative, path)
        mesh = trimesh.load(path, force="mesh", process=False, skip_materials=True)
        mesh.vertices *= np.fromstring(asset.get("scale", "1 1 1"), sep=" ")
        rotation = Rotation.from_quat(np.fromstring(geom.get("quat", "1 0 0 0"), sep=" ")[[1, 2, 3, 0]])
        mesh.vertices = rotation.apply(mesh.vertices) + np.fromstring(geom.get("pos", "0 0 0"), sep=" ")
        pieces.append(mesh)
        paths.append(relative)
    if not pieces:
        raise ValueError(f"No visual mesh for {body.get('name')}")
    return trimesh.util.concatenate(pieces), paths


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("outputs/humanoidmimicgen/large_cart_push"))
    parser.add_argument("--cache", type=Path, default=Path("outputs/humanoidmimicgen/assets"))
    args = parser.parse_args()
    source = Path(hf_hub_download(REPOSITORY, SOURCE_FILE, repo_type="dataset", revision=REVISION))
    with h5py.File(source) as f:
        states = f["data/demo_1/states"][:]
        root = ET.fromstring(f["data/demo_1"].attrs["model_file"])
    model = kinematic_model(root)
    if states.shape[1] != 1 + model.nq + model.nv:
        raise ValueError("Recorded states do not match the source joint tree.")
    dt = np.diff(states[:, 0])
    if not np.allclose(dt, dt[0], atol=1e-8):
        raise ValueError("Nonuniform source timestamps require explicit resampling.")
    fps = round(1 / dt[0])
    names = [
        model.joint(i).name.removeprefix("robot0_")
        for i in range(model.njnt)
        if model.joint(i).name.startswith("robot0_") and model.jnt_type[i] != mujoco.mjtJoint.mjJNT_FREE
    ]
    if len(names) != 29:
        raise ValueError(f"Expected 29 body joints, got {len(names)}.")
    qpos = states[:, 1 : 1 + model.nq]
    joint_indices = [int(model.joint("robot0_" + name).qposadr[0]) for name in names]
    robot_qpos = np.c_[qpos[:, :3], qpos[:, [4, 5, 6, 3]], qpos[:, joint_indices]]
    shelf = root.find(".//body[@name='shelf_main']")
    main_mesh, paths = body_mesh(root, shelf, args.cache)
    parts = list(shelf.findall(".//body")) + [root.find(".//body[@name='box_main']")]
    part_names, part_meshes = [], []
    for body in parts:
        mesh, sources = body_mesh(root, body, args.cache)
        part_names.append(body.get("name"))
        part_meshes.append(mesh)
        paths.extend(sources)
    tracked = ["shelf_main", *part_names]
    positions, quaternions = [], []
    data = mujoco.MjData(model)
    ids = [model.body(name).id for name in tracked]
    for frame in qpos:
        data.qpos[:] = frame
        mujoco.mj_forward(model, data)
        positions.append(data.xpos[ids].copy())
        quaternions.append(data.xquat[ids][:, [1, 2, 3, 0]].copy())
    positions, quaternions = np.array(positions), np.array(quaternions)
    # Source geometry uses a floor at z=0. Keep its coordinates and actual cart scale.
    points = np.r_[robot_qpos[:, :2], positions[:, 0, :2]]
    lower, upper = points.min(axis=0) - 1.5, points.max(axis=0) + 1.5
    floor = np.r_[(lower + upper) / 2, -0.05, upper - lower, 0.1][None]
    args.output.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output / "g1_qpos.npz",
        qpos=robot_qpos,
        joint_names=names,
        fps=fps,
        quaternion_order="xyzw",
        terrain_boxes=floor,
        terrain_box_quat=[[0, 0, 0, 1]],
        object_name="large_shelving_cart",
        object_pos_w=positions[:, 0],
        object_quat_w=quaternions[:, 0],
        object_vertices=np.asarray(main_mesh.vertices, dtype=np.float32),
        object_faces=main_mesh.faces.astype(np.int32),
        object_part_names=part_names,
        object_part_pos_w=positions[:, 1:],
        object_part_quat_w=quaternions[:, 1:],
        object_part_vertices=np.concatenate([m.vertices for m in part_meshes]).astype(np.float32),
        # Faces use per-part local indices; counts delimit each independent mesh.
        object_part_faces=np.concatenate([m.faces for m in part_meshes]).astype(np.int32),
        object_part_vertex_counts=[len(m.vertices) for m in part_meshes],
        object_part_face_counts=[len(m.faces) for m in part_meshes],
    )
    provenance = {
        "display_name": "Large wheeled cart push",
        "category": "Object pushing",
        "description": "25.7 s G1 demonstration pushing a 1.44 m tall shelving cart by 2.39 m. Original cart, rotating casters and moving box are included. Ball-hand kinematic conversion; no payload-force validation.",
        "source_url": "https://huggingface.co/datasets/" + REPOSITORY,
        "source_dataset": REPOSITORY,
        "source_revision": REVISION,
        "source_file": SOURCE_FILE,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "source_task": "LMPushShelfForward",
        "source_episode": "demo_1",
        "source_fps": fps,
        "source_frames": len(states),
        "source_last_sample_time_s": float(states[-1, 0]),
        "source_type": "Human-operated G1 simulation demonstration; recorded state replay",
        "source_quaternion_order": "wxyz",
        "output_quaternion_order": "xyzw",
        "asset_repository": "NVlabs/humanoidmimicgen",
        "asset_revision": ASSET_REVISION,
        "object_mesh_sources": sorted(set(paths)),
        "object_mesh_license": "MIT (RoboCasa-derived assets)",
        "dataset_license": "Not specified in the source dataset card; the code Apache-2.0 license is not a dataset license.",
        "cart_body_mesh_dimensions_m": main_mesh.extents.tolist(),
        "cart_displacement_xy_m": float(np.linalg.norm(positions[-1, 0, :2] - positions[0, 0, :2])),
        "object_trajectory_modified": False,
        "articulated_object_parts": part_names,
        "object_appearance": "Original visual triangles, uniform materials; original textures are omitted.",
        "scene_scope": "Robot, cart, casters, box payload and z=0 floor. Unrelated factory scenery is omitted.",
        "source_contact_labels_available": False,
        "dynamic_tracking_validated": False,
        "paper_relationship": "Comparable large-object push, not data from arXiv:2606.05687 or a reproduction of its payload forces.",
    }
    (args.output / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
    print(
        json.dumps(
            {
                k: provenance[k]
                for k in ["source_frames", "source_fps", "cart_body_mesh_dimensions_m", "cart_displacement_xy_m"]
            }
        )
    )


if __name__ == "__main__":
    main()
