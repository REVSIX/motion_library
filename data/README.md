# Dataset contract

Each active motion directory contains one `motion.npz` and its matching
`motion.mp4`, with nonempty box or triangle-mesh terrain in the NPZ. Raw retargeting
exports and old before-refinement variants are not active dataset files.
`ground_height` alone does not count as terrain geometry.

Catalog building and validation reject missing/empty terrain, intermediate NPZs,
and clips listed as removed in `curation.json`. Mixamo references also require a
quality review tied to the current NPZ hash. Removed terrain-free files are listed
in `terrain_free_removal.json`; recoverable terrain-bearing rejects are outside
`data/`, under `outputs/quarantine/2026-10-26/`.

All bundled final references use 50 FPS, 29 named joints, and 35 body frames for
the ball-hand G1. Duration in the gallery is frame count / FPS; the last sample
time is (frame count − 1) / FPS. Body quaternions are xyzw. Positions are meters;
joint angles are radians; velocities are per second.

| Key | Shape / meaning |
| --- | --- |
| `fps` | Scalar sampling frequency |
| `joint_names`, `body_names` | Column labels |
| `joint_pos`, `joint_vel` | `(T, 29)` |
| `body_pos_w`, `body_lin_vel_w`, `body_ang_vel_w` | `(T, 35, 3)`; link origins in the reference frame |
| `body_quat_w` | `(T, 35, 4)` |
| `terrain_position` | `(N, 3)` box centers in the same reference frame |
| `terrain_dimension` | `(N, 3)` full local-axis box sizes |
| `terrain_quat` | `(N, 4)` box orientations, xyzw; optional identity |
| `terrain_vertices`, `terrain_faces` | Triangle mesh vertices and indices |
| `ground_height` | Optional ground top Z in the reference frame |
| `robot_asset` | Required asset choice for these exports |

Ground height is explicit so a global plane does not fill a jump gap. New clips
must keep terrain and motion in the same coordinate frame. Training translates
both by the same terrain-patch offset. Do not independently randomize reference
XY/yaw while leaving terrain fixed.

See the [catalog](catalog.json), [extraction manifest](import_manifest.json), and
per-clip provenance. Catalog checksums apply to the current canonical NPZ, not
the original upstream file. The metadata normalization does not change motion
arrays. Videos are kinematic visualization, not evidence of stable control.

## Moving-object references

Object-pushing clips preserve the same robot and static-terrain fields above, and
add **one moving rigid object**. Its mesh is separate from `terrain_*`; it must not
be fused into static terrain. Robot, object, and floor share the same reference frame.

| Key | Shape / meaning |
| --- | --- |
| `object_name` | Scalar string |
| `object_pos_w`, `object_lin_vel_w`, `object_ang_vel_w` | `(T, 3)`; world position and velocities |
| `object_quat_w` | `(T, 4)`, xyzw |
| `object_vertices`, `object_faces` | `(V, 3)` local mesh vertices in meters; `(F, 3)` triangle indices |
| `source_contact_link_names` | `(K,)`; link names from the upstream retargeting model |
| `source_object_contact_flags` | `(T, K)`, Boolean source annotations |
| `source_contact_points_object` | `(T, K, 3)`; source targets in the scaled object's local frame; NaN allowed for inactive contacts |
| `object_ground_contact` | `(T,)`, Boolean source annotations |

The source palm pads differ from our spherical hands. Source annotations are
preserved separately from measured robot contacts; geometric alignment is reported
in each clip's `quality_review.json`. Object meshes are already scaled: do not
apply the source scale again. The player animates them from the same frame index
as the robot. The static-terrain training integration does not yet train pushing.

### Articulated object parts

The optional `object_part_*` arrays preserve cart casters and a separately moving
payload. They accompany the existing main `object_*` body; all trajectories share
robot timestamps and use world coordinates and `xyzw` quaternions.

- `object_part_names`: K unique body names.
- `object_part_pos_w`, `object_part_quat_w`: `(T,K,3)` and `(T,K,4)`.
- `object_part_lin_vel_w`, `object_part_ang_vel_w`: `(T,K,3)`.
- `object_part_vertices`, `object_part_faces`: concatenated independent meshes.
- `object_part_vertex_counts`, `object_part_face_counts`: K positive counts delimiting each mesh.

Each mesh uses vertices in its own body frame and **local** triangle indices
starting at zero. The player creates a separate body for each part and writes its
recorded world pose each frame. These parts are moving objects, not static terrain.
The format specifies reference geometry and motion, not mass, friction or force targets.
The library viewer supports these arrays; loading the NPZ in a robot-only mimic
trainer does not automatically create a pushing task or its moving objects.
