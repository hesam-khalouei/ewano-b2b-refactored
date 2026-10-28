#!/usr/bin/env python3
"""Check local assets referenced from HTML and CSS without external dependencies."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = r"(?:svg|png|jpe?g|webp|woff2?|ttf|json|html)"
missing = set()

for source in [*ROOT.rglob("*.html"), *ROOT.rglob("*.css")]:
    text = source.read_text(encoding="utf-8")
    patterns = [
        rf"""(?:src|href)=["']([^"']+\.{EXTENSIONS})["']""",
        rf"""url\(["']?([^)"']+\.{EXTENSIONS})["']?\)""",
    ]
    for pattern in patterns:
        for ref in re.findall(pattern, text, re.I):
            if ref.startswith(("http://", "https://", "data:", "#")):
                continue
            target = (source.parent / ref.split("?")[0].split("#")[0]).resolve()
            if not target.exists():
                missing.add((source.relative_to(ROOT).as_posix(), ref))

if missing:
    print(f"Missing local references: {len(missing)}")
    for source, ref in sorted(missing):
        print(f"{source}: {ref}")
    raise SystemExit(1)
print("All local references resolved.")
