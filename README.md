# G1 motion library

Motion references, terrain, and moving objects for the 29-DoF Unitree G1 with spherical hand pads.
Includes source importers, Kimodo generation tools, corrected PARC retargeting,
and a video gallery. These are kinematic references, not trained-policy rollouts.

**[Open the gallery](https://jnskkmhr.github.io/motion_library/)** ·
[Dataset format](data/README.md) · [Isaac Lab integration](integrations/isaaclab/README.md)

```text
data_generator/
  kimodo/                 # Generation, constraints, contact refinement
  claw/                   # Import released G1 trajectories
  omniretarget/           # Import G1 motions and supplied terrain
  humanoidmimicgen/       # Import large cart push with articulated wheels and payload
  hoi_retarget/           # Import G1 pushing with moving-object meshes and contacts
  lafan/                  # Download/import public G1 retargets for local use
  mixamo/                 # Import local FBX with Blender + G1 IK
  parc/                   # Human-to-G1 IK with corrected arm mapping
  deep_wholebody_parkour/  # Import released G1 motion and scanned terrain
  shared/                 # USD export, terrain fitting, hand asset conversion
data/
  kimodo/                 # Experimental candidates, including failed geometry checks
  claw/
  omniretarget/
  parc/
  deep_wholebody_parkour/
docs/                     # Static video gallery
integrations/isaaclab/     # Playback and runtime terrain integration reference
tools/                    # Catalog generation and data validation
```

## Setup with uv

```bash
uv sync --locked
uv run python tools/build_catalog.py
uv run python tools/validate_library.py
uv run python -m http.server 8000 --bind 127.0.0.1
```

The validation command also needs FFmpeg (`ffprobe`) installed on the host.
Open <http://localhost:8000/docs/>. Select a source and motion, use the previous/next
buttons or arrow keys, and switch between refined/generated motion where available.
Every active reference, including the 12 published Mixamo clips, links to its
NPZ on GitHub and provides a direct download. Use the
Motion type filter for stairs, ladders, crawling, vaults, and other navigation skills.
Opening `docs/index.html` directly also works; its catalog is loaded as a script.

Default dependencies support dataset inspection, import, MuJoCo retargeting, and
terrain constraints. To install the pinned Kimodo source and its model dependencies:

```bash
uv sync --locked --extra kimodo
uv run hf auth login
```

Model generation requires upstream Hugging Face access and suitable GPU resources.
Credentials and model weights are not included. See [Kimodo commands](data_generator/kimodo/README.md).
`uv.lock` locks both the base dependencies and the optional Kimodo dependencies.

The exact-asset USD exporter, USD passage fitter, and Isaac Lab viewer run with a
separate Isaac Lab Python environment. Isaac Lab, its robot assets, and NVIDIA
drivers are not pip dependencies of this standalone library. See the
[shared tools](data_generator/shared/README.md) for commands and the tested checkout.

## Data and provenance

The active catalog contains 80 clips: 46 non-Kimodo references, 22 experimental
Kimodo references, and 12 Mixamo candidates, including five restored ladder clips. Public Mixamo entries
include videos, paired NPZs with terrain, and provenance/review reports. Every active
NPZ contains box or mesh terrain, and every clip has one current video variant.
The [large cart push](data_generator/humanoidmimicgen/README.md) includes a 25.7-second
G1 demonstration with original cart geometry, rotating wheels, and a moving box payload.
Four HOI-Retarget/OMOMO pushing references include their moving objects, source contact labels,
and exact-asset replay videos; see [pushing import](data_generator/hoi_retarget/README.md).
Terrain-free LAFAN and early Kimodo references and poor Mixamo pairings have been
removed. See [ACP source additions](data_generator/ACP_SOURCES.md) for provenance
and [the curation record](data/curation.json) for exclusions.

Each clip keeps its source provenance and available geometry/contact reports.
`data/import_manifest.json` records extraction locations; those historical paths
are not required to browse or inspect this repository. `data/catalog.json` records
portable paths, frame rates, frame counts, variants, and SHA-256 checksums.

Known issues include terrain intersections after changing the hand geometry,
foot-contact errors, and wrist limits in the CLAW elbow crawl. A successful loader
check does not establish that a tracking policy can execute the motion. Consult
per-clip reports before selecting training references.

Code attribution and upstream data terms are recorded in [NOTICE.md](NOTICE.md).
The code license does not relicense motion data, model weights, or robot assets.

## Update the gallery

Put a new clip in `data/<source>/<clip>/` with `motion.npz` and `motion.mp4`, then run:

```bash
uv run python tools/build_catalog.py
uv run python tools/validate_library.py
```

Optional `motion_generated.npz` and `motion_generated.mp4` provide a second view.
The GitHub repository and branch are configured in `docs/config.js`. The Pages
workflow publishes the gallery and its data files together, preserving relative
links. No video transcoding or JavaScript build system is needed.

## Active dataset quality

The gallery contains only final references with nonempty box or mesh terrain.
Raw exports and old before-refinement comparisons have been removed from `data/`.
Seven Mixamo candidates passed the obstacle/support-gap screening. Five additional
ladder clips were restored at the user’s request with their original quality issues
recorded; publication does not mean those issues are fixed. Terrain-free LAFAN and early Kimodo clips, plus five Kimodo
references that failed their existing geometry checks, are excluded. See
[`data/curation.json`](data/curation.json) for the removal record. Original source
assets remain available to the generators; rejected terrain-bearing derivatives
are recoverable locally under `outputs/quarantine/2026-10-26/`.
