# Attribution and data terms

The copied Isaac Lab integration/generation code retains its original SPDX
headers. `LICENSE` contains the Isaac Lab BSD-3-Clause code license. This license
applies to code; it does not grant a new license for datasets, model weights,
robot assets, or their derived motion files.

Upstream sources are recorded in each clip's provenance:

- Kimodo: https://github.com/nv-tlabs/kimodo (pinned revision in pyproject.toml).
  Model/text-encoder access and usage follow their respective upstream terms.
- CLAW: https://huggingface.co/datasets/JianuoCao/CLAW . The original downloaded
  card did not specify a dataset license; no new data license is asserted here.
- OmniRetarget: https://huggingface.co/datasets/omniretarget/OmniRetarget_Dataset .
  The source dataset card recorded MIT.
- PARC: https://huggingface.co/datasets/mxucg/PARC . Retain upstream data terms
  and attribution for the original motion/terrain pairs.
- Deep Whole-body Parkour: https://project-instinct.github.io/deep-whole-body-parkour/ .
  The released references and terrain retain their upstream terms.
- LAFAN: https://github.com/ubisoft/ubisoft-laforge-animation-dataset and
  https://huggingface.co/datasets/lvhaidong/LAFAN1_Retargeting_Dataset . Source
  terms are CC BY-NC-ND 4.0; converted outputs are kept local and ignored by Git.
- Mixamo: https://www.mixamo.com/ . The navigation previews use selected animations
  from https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters at the
  revision recorded in data_generator/mixamo/navigation_manifest.json. Credit:
  Adobe Mixamo and the Linzhan Mou / UniMate dataset release. Adobe terms apply.
  Public files contain 12 converted G1 motion/terrain NPZs, matching videos,
  and provenance. Source FBXs are not bundled. The repository code license does
  not relicense these derivatives or supersede the upstream data terms.
- G1 robot geometry: Unitree assets and the local newton-assets hand-pad variant.
  Robot meshes, model weights, and credentials are not bundled here.

Provenance, geometric reports, and conversion metadata are retained alongside
motion/video exports. No dynamic tracking success or training readiness is implied.

## HOI-Retarget / OMOMO pushing

`data/hoi_retarget/` contains adapted G1 motion references from leggedrobotics/hoi-retarget
(revision b5ac8125e497e6735d6314e63a0e1eedf6229336), using OMOMO mocap and InterAct contacts.
Motion references, contact annotations, and derived previews are CC BY-NC-SA 4.0.
Object meshes are MIT; upstream notices are retained in that data directory.
The repository code license does not replace these data licenses.
