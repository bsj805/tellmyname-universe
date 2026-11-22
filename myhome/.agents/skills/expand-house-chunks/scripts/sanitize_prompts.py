#!/usr/bin/env python3
"""
.agents/skills/expand-house-chunks/scripts/sanitize_prompts.py

Enforces the two mandatory prompt rules across all data/chunks/houses-chunk-*.json
and G:\\My Drive\\new_houses\\*.txt files:
1. Strips any `(Lv.XX)` or `Lv.XX` level number tokens so image models never render
   level numbers on signs, walls, or HUD banners.
2. Appends the mandatory copyright-avoidance instruction to every prompt:
   "I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements."
"""

import glob
import json
import os
import re
import sys

COPYRIGHT_SUFFIX = (
    "I am not asking for an exact replica. Please first define the key elements "
    "to avoid copyright infringement, and then implement those elements."
)
LV_PATTERN = re.compile(r"\s*\(?Lv\.\s*\d+\)?", re.IGNORECASE)


def sanitize_prompt(prompt: str) -> str:
    if not prompt:
        return ""
    cleaned = LV_PATTERN.sub("", prompt)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    if not cleaned.endswith(COPYRIGHT_SUFFIX):
        cleaned = f"{cleaned} {COPYRIGHT_SUFFIX}"
    return cleaned


def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    chunks_pattern = os.path.join(root_dir, "data", "chunks", "houses-chunk-*.json")
    gdrive_dir = os.environ.get("NEW_HOUSES_DIR", r"G:\My Drive\new_houses")

    chunk_files = sorted(glob.glob(chunks_pattern))
    updated_chunk_items = 0
    for cf in chunk_files:
        with open(cf, "r", encoding="utf-8") as f:
            items = json.load(f)
        changed = False
        for item in items:
            orig = item.get("geminiImagePrompt", "")
            sanitized = sanitize_prompt(orig)
            if sanitized != orig:
                item["geminiImagePrompt"] = sanitized
                updated_chunk_items += 1
                changed = True
        if changed:
            with open(cf, "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)

    updated_txt_files = 0
    txt_files = sorted(glob.glob(os.path.join(gdrive_dir, "*.txt"))) if os.path.exists(gdrive_dir) else []
    for tf in txt_files:
        with open(tf, "r", encoding="utf-8") as f:
            orig = f.read()
        sanitized = sanitize_prompt(orig)
        if sanitized != orig:
            with open(tf, "w", encoding="utf-8") as f:
                f.write(sanitized)
            updated_txt_files += 1

    print(
        f"[sanitize_prompts] Checked {len(chunk_files)} chunk files (updated {updated_chunk_items} items) "
        f"and {len(txt_files)} .txt files (updated {updated_txt_files} files)."
    )


if __name__ == "__main__":
    main()
