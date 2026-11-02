"""Build portable dataset and browser catalogs from the motion folders."""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np

from tools.terrain_contract import require_active_dataset

ROOT = Path(__file__).resolve().parents[1]
LABELS = {
    "claw": "CLAW",
    "hoi_retarget": "HOI-Retarget",
    "humanoidmimicgen": "HumanoidMimicGen",
    "omniretarget": "OmniRetarget",
    "parc": "PARC",
    "deep_wholebody_parkour": "Deep Whole-body Parkour",
    "kimodo": "Kimodo",
    "lafan": "LAFAN",
    "mixamo": "Mixamo",
}
NAMES = {
    "00452_crouch": "Crouched walking",
    "00543_hand_crawl": "Hand crawl",
    "02067_elbow_crawl": "Elbow crawl",
    "jump_001": "Running jump 01",
    "jump_002": "Running jumps 02",
    "jump_003": "Running jumps 03",
    "jump_004": "Turning jumps 04",
    "jump_005": "Running jumps 05",
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument(
        "--include-local",
        action="store_true",
        help="Build a separate gallery including local-only LAFAN exports",
    )
    args = parser.parse_args()
    root = args.root.resolve()
    require_active_dataset(root)
    clips = []
    for source, label in LABELS.items():
        if source == "lafan" and not args.include_local:
            continue
        for path in sorted((root / "data" / source).rglob("motion.npz")):
            folder = path.parent
            relative = folder.relative_to(root / "data" / source)
            name = NAMES.get(str(relative), str(relative).replace("_", " ").replace("/", " / ").capitalize())
            variants = []
            for stem, variant_name in [("motion", "Reference"), ("motion_generated", "Before contact refinement")]:
                npz, video = folder / f"{stem}.npz", folder / f"{stem}.mp4"
                if not npz.is_file():
                    continue
                if not video.is_file():
                    raise FileNotFoundError(f"Missing paired video: {video}")
                with np.load(npz, allow_pickle=False) as data:
                    fps = float(np.asarray(data["fps"]).item())
                    frames = len(data["joint_pos"])
                    object_name = str(data["object_name"].item()) if "object_name" in data else None
                    asset = str(data["robot_asset"].item()) if "robot_asset" in data else "unspecified"
                    terrain = (
                        "mesh"
                        if "terrain_vertices" in data
                        else "boxes"
                        if "terrain_position" in data or "terrain_boxes" in data
                        else "ground"
                    )
                variants.append(
                    {
                        "name": variant_name,
                        "npz": str(npz.relative_to(root)),
                        "video": str(video.relative_to(root)),
                        "fps": fps,
                        "frames": frames,
                        "duration": frames / fps,
                        "last_sample_time": (frames - 1) / fps,
                        "sha256": hashlib.sha256(npz.read_bytes()).hexdigest(),
                        "asset": asset,
                        "terrain": terrain,
                        **({"object": object_name} if object_name else {}),
                    }
                )
            reports = {p.stem: str(p.relative_to(root)) for p in folder.glob("*.json")}
            poster = folder / "preview.jpg"
            provenance = (
                json.loads((folder / "provenance.json").read_text()) if (folder / "provenance.json").is_file() else {}
            )
            category = provenance.get("category", "")
            if not category:
                category = {"omniretarget": "Climb and slope", "parc": "Jump and landing"}.get(source, "")
                if source == "claw":
                    category = "Crouch and duck" if "crouch" in str(relative) else "Crawl and hand support"
                if source == "deep_wholebody_parkour":
                    category = {
                        "dive_roll": "Recovery and roll",
                        "jump_sit": "Sit and stand",
                        "kneel_climb": "Climb and slope",
                        "roll_vault": "Vault",
                    }.get(str(relative), "")
            if provenance.get("terrain_missing"):
                for variant in variants:
                    variant["terrain"] = "missing"
            clips.append(
                {
                    "id": str(folder.relative_to(root / "data")),
                    "source": source,
                    "source_name": label,
                    "name": provenance.get("display_name", name),
                    "category": category,
                    "description": provenance.get("description", ""),
                    "experimental": source in ("kimodo", "mixamo"),
                    "local_only": source == "lafan",
                    "source_url": provenance.get("source_url"),
                    "variants": variants,
                    "reports": reports,
                    "poster": str(poster.relative_to(root)) if poster.is_file() else None,
                }
            )
    # Rendered samples may be public even when the underlying animation stays local.
    for preview in sorted((root / "docs/previews").glob("*/clip.json")):
        clip = json.loads(preview.read_text())
        if not any(existing["id"] == clip["id"] for existing in clips):
            clips.append(clip)
    catalog = {"schema_version": 1, "clips": clips}
    encoded = json.dumps(catalog, indent=2, ensure_ascii=False) + "\n"
    catalog_path = root / ("data/catalog.local.json" if args.include_local else "data/catalog.json")
    script_path = root / ("docs/local-catalog.js" if args.include_local else "docs/catalog.js")
    catalog_path.write_text(encoded)
    script_path.write_text("window.MOTION_CATALOG = " + encoded.rstrip() + ";\n")
    if args.include_local:
        page = (root / "docs/index.html").read_text().replace('src="catalog.js', 'src="local-catalog.js')
        page = page.replace("<title>G1 Motion Library</title>", "<title>G1 Motion Library — local previews</title>")
        (root / "docs/local.html").write_text(page)
    print(f"Catalog: {len(clips)} clips; {sum(len(c['variants']) for c in clips)} variants")


if __name__ == "__main__":
    main()
