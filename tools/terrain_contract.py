"""Require actual scene geometry and reviewed final files in the active dataset."""

import hashlib
import json

import numpy as np


def require_scene(data, path):
    """Return the scene type; a ground-height scalar alone is not terrain geometry."""
    boxes = "terrain_position" in data and len(data["terrain_position"]) > 0
    mesh = "terrain_vertices" in data and len(data["terrain_vertices"]) > 0
    if not boxes and not mesh:
        raise ValueError(f"No box or mesh terrain: {path}")
    if boxes:
        pos, dim = data["terrain_position"], data["terrain_dimension"]
        # Existing axis-aligned datasets omit quaternion arrays (identity).
        quat = data["terrain_quat"] if "terrain_quat" in data else np.tile([0, 0, 0, 1], (len(pos), 1))
        if pos.ndim != 2 or pos.shape[1] != 3 or dim.shape != pos.shape or quat.shape != (len(pos), 4):
            raise ValueError(f"Invalid canonical terrain shapes: {path}")
        if not all(np.isfinite(v).all() for v in (pos, dim, quat)) or not (dim > 0).all():
            raise ValueError(f"Invalid terrain values: {path}")
        if not np.allclose(np.linalg.norm(quat, axis=-1), 1, atol=1e-4):
            raise ValueError(f"Invalid terrain quaternion: {path}")
    if mesh:
        vertices, faces = data["terrain_vertices"], data["terrain_faces"]
        if vertices.ndim != 2 or vertices.shape[1] != 3 or not np.isfinite(vertices).all():
            raise ValueError(f"Invalid terrain vertices: {path}")
        if faces.ndim != 2 or faces.shape[1] != 3 or not len(faces) or not np.issubdtype(faces.dtype, np.integer):
            raise ValueError(f"Invalid terrain faces: {path}")
        if faces.min() < 0 or faces.max() >= len(vertices):
            raise ValueError(f"Invalid terrain face indices: {path}")
    return "mesh" if mesh else "boxes"


def require_object(data, path):
    """Validate the optional single moving-object reference and its source contact labels."""
    required = {
        "object_name",
        "object_pos_w",
        "object_quat_w",
        "object_lin_vel_w",
        "object_ang_vel_w",
        "object_vertices",
        "object_faces",
    }
    if not any(key in data for key in required):
        return
    if not required.issubset(data):
        raise ValueError(f"Incomplete moving object: {path}")
    n = len(data["joint_pos"])
    if np.asarray(data["object_name"]).shape != () or not str(data["object_name"].item()):
        raise ValueError(f"Invalid object name: {path}")
    for key, width in [("object_pos_w", 3), ("object_quat_w", 4), ("object_lin_vel_w", 3), ("object_ang_vel_w", 3)]:
        if data[key].shape != (n, width) or not np.isfinite(data[key]).all():
            raise ValueError(f"Object timestamps/values do not match the robot: {key}: {path}")
    if not np.allclose(np.linalg.norm(data["object_quat_w"], axis=-1), 1, atol=1e-4):
        raise ValueError(f"Invalid object quaternion: {path}")
    vertices, faces = data["object_vertices"], data["object_faces"]
    if vertices.ndim != 2 or vertices.shape[1] != 3 or not len(vertices) or not np.isfinite(vertices).all():
        raise ValueError(f"Invalid object mesh vertices: {path}")
    if faces.ndim != 2 or faces.shape[1] != 3 or not len(faces) or not np.issubdtype(faces.dtype, np.integer):
        raise ValueError(f"Invalid object mesh faces: {path}")
    if faces.min() < 0 or faces.max() >= len(vertices):
        raise ValueError(f"Invalid object triangle indices: {path}")
    contact_keys = {"source_contact_link_names", "source_object_contact_flags", "source_contact_points_object"}
    if any(key in data for key in contact_keys):
        if not contact_keys.issubset(data):
            raise ValueError(f"Incomplete source contact annotations: {path}")
        names, flags, points = (
            data[key]
            for key in ("source_contact_link_names", "source_object_contact_flags", "source_contact_points_object")
        )
        if len(set(names)) != len(names) or flags.shape != (n, len(names)) or flags.dtype != np.bool_:
            raise ValueError(f"Invalid source contact flags/names: {path}")
        if points.shape != (n, len(names), 3) or not np.isfinite(points[flags]).all() or np.isinf(points).any():
            raise ValueError(f"Invalid active contact points (NaN is allowed only for inactive links): {path}")
    if "object_ground_contact" in data and (
        data["object_ground_contact"].shape != (n,) or data["object_ground_contact"].dtype != np.bool_
    ):
        raise ValueError(f"Invalid object-ground contact flags: {path}")


def require_active_dataset(root):
    """Reject intermediates, missing terrain, and restored rejected candidates."""
    record = root / "data/curation.json"
    curation = json.loads(record.read_text()) if record.exists() else {}
    rejected = {c["id"] for c in curation.get("removed_clips", [])}
    restored = {c["id"]: c["motion_sha256"] for c in curation.get("restored_clips", [])}
    for path in (root / "data").rglob("*.npz"):
        if path.name != "motion.npz":
            raise ValueError(f"Intermediate or obsolete variant in active data/: {path}")
        clip_id = str(path.parent.relative_to(root / "data"))
        if clip_id in rejected:
            raise ValueError(f"Rejected clip restored without review: {clip_id}")
        with np.load(path, allow_pickle=False) as data:
            require_scene(data, path)
            require_object(data, path)
        if clip_id.startswith("hoi_retarget/"):
            report = json.loads((path.parent / "quality_review.json").read_text())
            if (
                report["status"] != "retained_kinematic_candidate"
                or report["motion_sha256"] != hashlib.sha256(path.read_bytes()).hexdigest()
            ):
                raise ValueError(f"Pushing geometry review does not match the current motion: {path}")
        if clip_id.startswith("mixamo/"):
            report = json.loads((path.parent / "quality_review.json").read_text())
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            reviewed = report["status"] == "retained_kinematic_candidate"
            requested = report["status"] == "published_for_inspection" and restored.get(clip_id) == digest
            if not (reviewed or requested) or report["motion_sha256"] != digest:
                raise ValueError(f"Mixamo quality review does not match the current motion: {path}")
    for path in (root / "docs/previews").glob("*/clip.json"):
        clip = json.loads(path.read_text())
        if clip["id"] in rejected:
            raise ValueError(f"Rejected preview restored without review: {clip['id']}")
        for variant in clip["variants"]:
            if variant.get("terrain") not in ("boxes", "mesh"):
                raise ValueError(f"Preview has no scene geometry: {path}")
