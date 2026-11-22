# -*- coding: utf-8 -*-
"""
Tiers 1 and 2 (Levels 0 to 99, 100 items)
Tier 1: 태초의 밑바닥·지옥 노역 (0..49)
Tier 2: 고대·중세 오물·극한 잡역 (50..99)
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.tiers_data_part1 import TIER_1_REAL, TIER_1_FICTION
from scripts.build_all_jobs import TIER_THEMES

TIER_2_REAL = TIER_THEMES[2]["real"]
TIER_2_FICTION = TIER_THEMES[2]["fiction"]

if __name__ == "__main__":
    print(f"Tier 1 Real: {len(TIER_1_REAL)}, Fiction: {len(TIER_1_FICTION)}")
    print(f"Tier 2 Real: {len(TIER_2_REAL)}, Fiction: {len(TIER_2_FICTION)}")
