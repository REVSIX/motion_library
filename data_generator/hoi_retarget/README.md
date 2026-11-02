# HOI-Retarget pushing references

Four public G1 references from [HOI-Retarget](https://huggingface.co/datasets/leggedrobotics/hoi-retarget),
pinned to revision `b5ac8125e497e6735d6314e63a0e1eedf6229336`.
These use **OMOMO** human motion, **InterAct** contact annotations, and the source's
released G1 retargeting. No motion generation or new human-to-robot retargeting is performed.

| Local clip | Source subject | Motion |
| --- | --- | --- |
| `box_push` | `sub12_largebox_009` | Two-hand box push |
| `table_push` | `sub5_largetable_034` | Two-hand table push |
| `plastic_box_push` | `sub12_plasticbox_005` | Low plastic-box push |
| `suitcase_push` | `sub4_suitcase_001` | Two-hand suitcase push |

Selection checked forward object movement while both palms and the object were
labeled in contact, source quality flags, target joint limits, foot-floor geometry,
and ball-hand alignment. `sub5_plasticbox_005` was rejected after exact-asset export
because a foot corner penetrated the floor by 4.4 cm. Its replacement is listed above.

The source's OMOMO meshes are included under MIT. The IMHD² suitcase meshes require
separate access; those clips were not imported and their geometry was not substituted.
The source scales object geometry to 0.83 for G1; its object poses are already scaled.
The importer applies mesh scale once and preserves the supplied object coordinate frame.
A finite floor slab represents the source's flat floor at world Z=0.

## Reproduce

```bash
uv sync --locked
uv run python data_generator/hoi_retarget/import_hoi.py

# Use the existing Isaac Lab environment with the ball-hand USD asset.
ISAACLAB_PYTHON=/path/to/IsaacLab/.venv/bin/python
clip=box_push
uv run --no-project --python "$ISAACLAB_PYTHON" python data_generator/shared/export_mimic.py \
  --input "outputs/hoi_retarget/$clip/g1_qpos.npz" \
  --output "outputs/hoi_retarget/$clip/motion.npz" \
  --robot_asset UNITREE_G1_29DOF_BALL_HAND_CFG

# Choose a new output directory; the normalizer refuses to overwrite existing data.
uv run python tools/normalize_terrain.py \
  --input "outputs/hoi_retarget/$clip/motion.npz" \
  --output "outputs/review/$clip/motion.npz"
uv run python data_generator/hoi_retarget/review_motion.py "outputs/review/$clip/motion.npz"
uv run --no-project --python "$ISAACLAB_PYTHON" --with imageio --with imageio-ffmpeg \
  python integrations/isaaclab/play_motion_file.py \
  --motion_file "outputs/review/$clip/motion.npz" --headless --video \
  --video_folder "outputs/review/$clip" --camera_offset 1.6 1.6 0.7
```

Repeat the export/review/record steps for the other selected clips. Published videos use
the per-clip side-view `camera_offset` saved in `render.json`; pass those three numbers
to reproduce their viewing angle. The importer
accepts `--clips box_push table_push` to select a subset. Copy only reviewed final
`motion.npz`, its matching video, provenance, review, and poster into `data/hoi_retarget/`;
then rebuild the catalog and validate the library as described in the root README.

The exporter uses the existing ball-hand G1 USD and computes all 35 body frames.
Robot and object share the same 50 Hz timestamps. Object translations use PCHIP,
orientations use SLERP, and object-contact annotations use the preceding source frame.
Contact flags retain the **source palm-pad link names**; they are not relabeled as
measured ball-hand contacts. Inactive contact points may be NaN, as in the source.

## Quality and use

Per-clip `quality_review.json` records the actual NPZ hash and geometric errors.
The screen allows at most 2.5 cm foot/object floor penetration, 2.5 cm 95th-percentile
source-contact-target distance from the ball surface, and 0.0001 rad joint-limit excess.
These are screening tolerances, not claims of collision-free motion. Review the
videos as well; full-body intersections, forces, friction, and dynamic tracking are unvalidated.

The updated Isaac Lab **player** replays the moving mesh. Existing mimic training
terrain utilities still handle static terrain only: training object pushing also
requires a dynamic object, matching resets, and object/contact objectives.
The player assigns a dummy 1 kg mass with collision disabled for visual replay;
this is not an estimated object mass or a dynamics model for training.

Motion references, contact annotations, and derived videos: **CC BY-NC-SA 4.0**.
Object mesh geometry: **MIT**. See [source attribution](../../data/hoi_retarget/NOTICE.md)
and [mesh license](../../data/hoi_retarget/LICENSE-OBJECTS). Cite Shin et al.,
*HOI-Retarget* (2026), Li et al., *Object Motion Guided Human Motion Synthesis*
(2023), and Xu et al., *InterAct* (2025).
