# Kimodo generation

This directory contains our Kimodo integration, not a copy of the upstream model.
The root `pyproject.toml` pins [Kimodo](https://github.com/nv-tlabs/kimodo) to commit
`e1c219c99b4b94ba48be1fb6a1cbc64ecee4c954`; `uv.lock` records its dependencies.

```bash
uv sync --locked --extra kimodo
uv run hf auth login
uv run python data_generator/kimodo/generate.py \
  --prompt "A person walks forward." --duration 5 --seed 44 \
  --output outputs/kimodo/walk_seed44
```

This uses `Kimodo-G1-RP-v1` directly, not SOMA/GMR retargeting. Generation needs
access to Kimodo's upstream model dependencies, including its gated Llama text
encoder. The original run used an approved Hugging Face account. No credentials
or weights are stored here.

`generate.py` writes raw Kimodo output, G1 qpos, and provenance. For a supplied
Kimodo G1 example, use `--example /path/to/motion.npz` instead of `--prompt`.
This imports a sample; it does not generate a new motion.

## Export and record

Set `ISAACLAB_PYTHON` to an existing Isaac Lab interpreter with the ball-hand G1
asset configuration. This is separate from the uv environment containing Kimodo.

```bash
ISAACLAB_PYTHON=/path/to/IsaacLab/.venv/bin/python
uv run python data_generator/kimodo/run_pipeline.py \
  --kimodo_python "$PWD/.venv/bin/python" --isaaclab_python "$ISAACLAB_PYTHON" \
  --prompt "A person walks forward." --duration 5 --seed 44 \
  --output outputs/kimodo/walk_seed44 --video --dry_run
```

Remove `--dry_run` to execute. Use a new output directory for each run.
Optional `--terrain stairs` fits ascending stair boxes; `--terrain overhead`
fits a low passage. Neither is a general motion/terrain optimizer.

For terrain authored before generation, use `--platform --robot_mjcf /path/to/g1.xml`
instead of `--prompt`. `--platform_height 0.15` creates a 15 cm high platform.
The sparse constraints and contact refinement use that same fixed geometry.

## Batch candidates

```bash
uv run python data_generator/kimodo/generate_batch.py --output outputs/kimodo/raw --dry_run
uv run python data_generator/kimodo/run_terrain_batch.py \
  --kimodo_python "$PWD/.venv/bin/python" --isaaclab_python "$ISAACLAB_PYTHON" \
  --mjcf /path/to/newton-assets/unitree_g1/mjcf/g1_29dof_rev_1_0_box_foot_ball_hand.xml \
  --output outputs/kimodo/terrain_batch --workers 2 --video
```

The default manifest requests crouch, crawl, ramp, bear walk, and gap-jump motions.
`--manifest data_generator/kimodo/long_jump_batch.json` requests 1.4 m gap examples.
`--process_existing` resumes the same saved requests, not a changed configuration.

`motion_generated` is the generated motion with authored terrain. `motion` applies
contact refinement. Both are G1 exports, not raw human mocap. Validation measures
sampled geometry and joint limits; it does not prove dynamic trackability.

Existing candidates are in [`data/kimodo`](../../data/kimodo). They remain
**experimental**: the user judged their naturalness worse than the public mocap
references. Keep failed candidates labeled and separate from training selections.
The supplied stair sample is under `supplied_stairs`; it was imported, not generated.

## Stair scene and contact-guide tooling

Prepare geometry requests from a supplied final G1 NPZ, then produce sole-center
guides without loading Kimodo or starting a simulator:

```powershell
.venv/Scripts/python.exe tools/prepare_stair_sweep.py --source /path/to/motion.npz --output outputs/stair_requests
.venv/Scripts/python.exe -m data_generator.kimodo.stair_plan --requests-dir outputs/stair_requests --output outputs/stair_plans
```

The default [`stair_sweep_preset.json`](../../tools/stair_sweep_preset.json) requests
24 shapes: risers of 8/12/16/20 cm, treads of 20/25/30 cm, and widths of 0.8/1.2 m.
Each has six steps and three requested motion seeds (72 future motion requests).
The split is 16 train / 4 validation / 4 test **geometries**. These are editable
pilot choices, not validated robot limits or RL configuration. Pass `--preset
/path/to/custom.json` to change dimensions, step count, landing, seeds or split
counts; counts must add up to the number of geometry combinations. The resolved
preset is saved with the requests. The supplied motion is inspected and hashed;
it is not resized or relabeled as new motion.

Each plan copies its fixed terrain and records its hash, prescribed
contact schedule, sole-center targets and configurable timing/clearance settings.
The planner supports ascending, axis-aligned nested boxes. It lifts each sole before
crossing a riser, alternates feet, and brings both feet onto the final step.

Planner flags (seconds and meters): `--fps 50`, `--swing-time 0.7`,
`--support-time 0.2`, `--hold-time 0.5`, `--clearance 0.05`,
`--stance-half-width 0.1`, `--leading left`. Support time is the pause before
each swing; hold time applies at the start and end. Stance half-width places the
left/right sole centers at Y=+/-0.1 m. All effective settings, including defaults,
are saved in `plan.json`.

`contact_plan.npz` contains geometric guides, not generated humanoid motion. These
point trajectories do not validate foot volume, joint reachability, balance or tracking.
The exact robot MJCF is required to convert sole targets into poses with IK.

The pinned upstream `kimodo/constraints.py` loads foot constraints from full local
joint rotations and root positions, reconstructing them with skeleton FK. The guide
is therefore not written as a purported Kimodo constraints file. Remaining stages
are exact-robot IK, skeleton conversion, actual constraint loading, generation,
contact refinement, exact-asset export and matching replay/validation. No plans are
added to training selections or the published gallery automatically.

## Robot-specific stair pose checks

`stair_ik.py` reads the target MJCF's foot contacts rather than assuming named box
feet. It supports planar sphere contacts (including the official Unitree G1) and
a single unrotated box per foot. Unsupported contact geometry is rejected.

```powershell
.venv/Scripts/python.exe -m data_generator.kimodo.stair_ik --mjcf /path/to/unitree_mujoco/unitree_robots/g1/g1_29dof.xml --plan-dir outputs/stair_plans/train/CASE --seed-motion /path/to/motion.npz --output outputs/stair_ik/CASE --samples 16
```

The tool maps the seed's joint posture by name and computes new poses and terrain
distances using the supplied target robot. It does not claim that the seed's named
asset is geometrically equivalent to that robot. The official G1 at Unitree commit
`1eb6642e3f3fdfb7fb13a9794fd6a2dd93ea0e7d` has matching 29 joint names but uses four
small sphere contacts per foot; the supplied example names a box-foot/ball-hand variant.

Outputs are `ik_keyframes.npz` (sparse poses with wxyz root quaternions) and
`ik_report.json`, including input hashes, target model identity, joint-limit errors,
foot-target errors, terrain penetration, solver termination and configurable sample
count. The reported pose screen uses 5 mm sole error, 2 degrees foot rotation, and
5 mm terrain penetration thresholds. These are candidate-screening settings, not
dynamic feasibility limits. Solver termination is reported separately from the
measured feasibility of its final pose. Some calls may hit their iteration limit.

Only sampled poses are checked: intermediate frames, self-collision, balance,
actuator feasibility and dynamic tracking remain unvalidated. Failed candidates
are saved for inspection. Sparse IK poses are not Kimodo-generated motion clips,
and nothing is added to training or the published gallery automatically.
