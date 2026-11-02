# Large wheeled cart push

The gallery's **Large wheeled cart push** is a 25.7-second G1 demonstration from
[HumanoidMimicGen's public source-demo replay dataset](https://huggingface.co/datasets/linkenv/humanoidmimicgen-g1-source-demo-replay),
task `LMPushShelfForward`, episode `demo_1`. The cart travels 2.39 m. Its frame is
about 1.05 m long, 0.51 m wide and 1.44 m above the floor.

This is a human-operated **robot simulation demonstration**, not human mocap.
It provides a large-object pushing reference comparable in task type to
[arXiv:2606.05687](https://arxiv.org/abs/2606.05687), but is not that paper's data
and does not reproduce its heavy payload or pushing force.

## Included data

- 1,286 samples at the recorded **50 Hz**, without time scaling. The HDF5's
  `data_collection_frequency` metadata says 20 Hz, but its stored state timestamps
  advance by 0.02 s; the importer checks and uses these timestamps.
- All 29 G1 body joints, converted with the exact Isaac Lab ball-hand USD asset.
- The original moving cart mesh, eight caster bodies and a separately moving box.
  All nine additional bodies retain their recorded world poses. No cart scaling
  or terrain fitting is applied. Original textures and unrelated factory scenery
  are omitted; the video uses uniform materials.
- A finite slab representing the source floor, with its top at world z=0.
- Arm-only IK adapting the source fingered hands to spherical pads. Root, waist,
  legs and object trajectories are unchanged. Contact intervals are inferred from
  geometric proximity, not source contact-force labels.

`quality_review.json` checks named arrays, geometry, joint limits and continuity,
ball-to-cart separation during inferred contact, and preservation of the source
root/lower-body/object paths. It is **not** a dynamic tracking or full-body collision test.
The rendered video writes the recorded poses directly; object masses in the viewer
are placeholders. The existing robot-only mimic trainer still needs moving-object
scene creation and a pushing objective before this can be used as a pushing task.

## Reproduce

Run from the library root. The importer pins the dataset and asset revisions and
caches source meshes under ignored `outputs/`. It does not require the full
HumanoidMimicGen simulator or its policy weights.

```bash
uv sync --locked
uv run python data_generator/humanoidmimicgen/import_cart.py

# Set these to your local Isaac Lab environment and exact ball-hand MJCF.
export ISAACLAB_PYTHON=/path/to/IsaacLab/.venv/bin/python
export G1_BALL_MJCF=/path/to/newton-assets/unitree_g1/mjcf/g1_29dof_rev_1_0_box_foot_ball_hand.xml

uv run python -m data_generator.humanoidmimicgen.refine_ball_hands \
  --input outputs/humanoidmimicgen/large_cart_push/g1_qpos.npz \
  --output outputs/humanoidmimicgen/large_cart_push/g1_ball_hands.npz \
  --robot_mjcf "$G1_BALL_MJCF"

uv run --no-project --python "$ISAACLAB_PYTHON" python data_generator/shared/export_mimic.py \
  --input outputs/humanoidmimicgen/large_cart_push/g1_qpos.npz \
  --output outputs/humanoidmimicgen/large_cart_push/motion.npz \
  --robot_asset UNITREE_G1_29DOF_BALL_HAND_CFG
uv run --no-project --python "$ISAACLAB_PYTHON" python data_generator/shared/export_mimic.py \
  --input outputs/humanoidmimicgen/large_cart_push/g1_ball_hands.npz \
  --output outputs/humanoidmimicgen/large_cart_push/motion_refined.npz \
  --robot_asset UNITREE_G1_29DOF_BALL_HAND_CFG

# Choose a new output path if the published file already exists.
uv run python tools/normalize_terrain.py \
  --input outputs/humanoidmimicgen/large_cart_push/motion_refined.npz \
  --output outputs/humanoidmimicgen/review/motion.npz
uv run python -m data_generator.humanoidmimicgen.review_motion \
  outputs/humanoidmimicgen/review/motion.npz \
  --unrefined outputs/humanoidmimicgen/large_cart_push/motion.npz

uv run --no-project --python "$ISAACLAB_PYTHON" --with imageio --with imageio-ffmpeg \
  python integrations/isaaclab/play_motion_file.py \
  --motion_file outputs/humanoidmimicgen/review/motion.npz \
  --video --headless --video_folder outputs/humanoidmimicgen/review \
  --camera_offset -1.3 -2.0 1.1
```

## Attribution

Source demonstration: HumanoidMimicGen / NVIDIA and the linkenv public replay
release, dataset revision `8553b2736497f41562bdf2476348b815fef68950`.
The source dataset card does not specify a data license. The upstream Apache-2.0
code license must not be read as a license for the dataset.

Original cart, wheel and box assets: NVlabs/humanoidmimicgen,
revision `cb314ae44dbf67ef92feb88aee9d1c0fb93246e4`. These RoboCasa-derived assets
retain their MIT notice in `data/humanoidmimicgen/LICENSE-ASSETS.txt`.
