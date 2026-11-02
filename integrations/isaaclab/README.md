# Isaac Lab integration

The standalone library does not install Isaac Lab. Use an existing checkout and
its uv-managed Python interpreter. The exact-asset generation environment is
`~/isaac/skill_chaining/IsaacLab`; ongoing tracker development moved to
`~/isaac/tmp/isaac_PR/IsaacLab`, branch `dokyun/multi-mimic`.

## Reference playback

This copy of `play_motion_file.py` selects the robot from NPZ metadata, loads
boxes/meshes, supports both terrain schemas, and preserves the real-time playback
fix. It requires `UNITREE_G1_29DOF_BALL_HAND_CFG` in `isaaclab_assets`.

```bash
ISAACLAB_PYTHON=/path/to/IsaacLab/.venv/bin/python
uv run --no-project --python "$ISAACLAB_PYTHON" --with imageio --with imageio-ffmpeg \
  python integrations/isaaclab/play_motion_file.py \
  --motion_file data/parc/jump_005/motion.npz
```

Use `--video --headless --video_folder outputs/replay` to record. Interactive
playback uses the file FPS and holds the final pose; `--loop` repeats without
blending the last-to-first transition. This script sets poses; it does not run a policy.

## Tracker training

`mimic_utils/` preserves the runtime terrain utilities from the mimic development
checkout as an integration reference. It is not an automatically installed plugin.
The live tracker also needs the matching `MotionCommand` terrain-origin assignment,
`MotionCommandCfg.terrain_mode`, and `MotionTrackingEnv` task registrations. Use the
already integrated mimic branch rather than copying these files into an arbitrary
Isaac Lab release. See `mimic_utils/README.md` for the mechanism and `CONTEXT.md` for
the dated handoff; historical paths there are not runtime dependencies here.

In the integrated tracker checkout, point the command at an absolute path in this
repository and set `env.commands.motion.terrain_mode=motion`. With decimation 4,
these 50 Hz clips require `env.sim.dt=0.005`. Select the matching ball-hand robot
asset explicitly; joint count alone does not establish contact-geometry agreement.

Distinct terrain geometries are built once as shared static patches. On reset,
a sampled motion selects its paired patch translation for that robot environment.
Terrain is not rebuilt per reset. The current integration supplies reference data
and geometry; contact-rich tracking rewards and successful training remain to be
validated.

## Pushing references

The player also reads the optional moving-object fields in the [NPZ contract](../../data/README.md#moving-object-references).
It replays the actual mesh and object pose alongside the ball-hand G1 at the same frame index.
For example, set `--motion_file data/hoi_retarget/box_push/motion.npz`.
This is visual replay with prescribed object motion, not dynamic pushing.
The training terrain importer remains static-only: pushing training additionally requires
spawning a dynamic object, paired resets, and object/contact rewards.
