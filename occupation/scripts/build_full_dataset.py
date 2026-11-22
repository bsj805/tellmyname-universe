# -*- coding: utf-8 -*-
"""
scripts/build_full_dataset.py
Assembles all 20 tiers into 1,001 unique occupation items (levels 0 to 1000).
Validates zero duplicates, strict even=REAL / odd=FICTION, and writes data/jobs_master_full.json.
"""

import sys
import os
import json

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.data_tier_1_2 import TIER_1_REAL, TIER_1_FICTION, TIER_2_REAL, TIER_2_FICTION
from scripts.data_tier_3_5 import TIER_3_REAL, TIER_3_FICTION, TIER_4_REAL, TIER_4_FICTION, TIER_5_REAL, TIER_5_FICTION
from scripts.data_tier_6_10 import (
    TIER_6_REAL, TIER_6_FICTION,
    TIER_7_REAL, TIER_7_FICTION,
    TIER_8_REAL, TIER_8_FICTION,
    TIER_9_REAL, TIER_9_FICTION,
    TIER_10_REAL, TIER_10_FICTION
)
from scripts.data_tier_11_15 import (
    TIER_11_REAL, TIER_11_FICTION,
    TIER_12_REAL, TIER_12_FICTION,
    TIER_13_REAL, TIER_13_FICTION,
    TIER_14_REAL, TIER_14_FICTION,
    TIER_15_REAL, TIER_15_FICTION
)
from scripts.data_tier_16_20 import (
    TIER_16_REAL, TIER_16_FICTION,
    TIER_17_REAL, TIER_17_FICTION,
    TIER_18_REAL, TIER_18_FICTION,
    TIER_19_REAL, TIER_19_FICTION,
    TIER_20_REAL, TIER_20_FICTION
)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT_JSON = os.path.join(DATA_DIR, "jobs_master_full.json")

TIERS_CONFIG = [
    {"tier": 1, "name": "태초의 밑바닥·지옥 노역", "range": (0, 49), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "💀",
     "cat_real": "HISTORICAL_EXTREME", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 2, "name": "고대·중세 오물·극한 잡역", "range": (50, 99), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🪣",
     "cat_real": "HISTORICAL_EXTREME", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 3, "name": "방구석 골방백수·잉여 인간", "range": (100, 149), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🛌",
     "cat_real": "BACKSU_NEETS", "cat_fict": "BACKSU_NEETS"},
    {"tier": 4, "name": "기괴한 실험체·인간 샌드백", "range": (150, 199), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🧪",
     "cat_real": "BIZARRE_REAL_JOB", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 5, "name": "판타지·애니 속 최하층 잡졸", "range": (200, 249), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "👾",
     "cat_real": "BIZARRE_REAL_JOB", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 6, "name": "극한 기상·재난 현장 중계", "range": (250, 299), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🎙️",
     "cat_real": "EXTREME_JOURNALISM", "cat_fict": "EXTREME_JOURNALISM"},
    {"tier": 7, "name": "황당한 길거리 장사·무모한 상인", "range": (300, 349), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🛒",
     "cat_real": "WEIRD_BIZ_TRADE", "cat_fict": "WEIRD_BIZ_TRADE"},
    {"tier": 8, "name": "영혼 갈리는 블랙기업·야근 지옥", "range": (350, 399), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "💼",
     "cat_real": "BIZARRE_REAL_JOB", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 9, "name": "아찔한 고소작업·극한 수리공", "range": (400, 449), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🧗",
     "cat_real": "BIZARRE_REAL_JOB", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 10, "name": "폭망의 끝자락·아슬아슬 생계형", "range": (450, 499), "zone": "BAD", "zoneLabel": "폭망 직업", "emoji": "🦀",
     "cat_real": "WEIRD_BIZ_TRADE", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 11, "name": "세상에 이런 꿀직업이·이색 억대 호사", "range": (500, 549), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🏖️",
     "cat_real": "BIZARRE_REAL_JOB", "cat_fict": "TOURISM_EVENT"},
    {"tier": 12, "name": "대박 장사꾼·미식·럭셔리 투어리스트", "range": (550, 599), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🍷",
     "cat_real": "TOURISM_EVENT", "cat_fict": "TYCOON_LUXURY"},
    {"tier": 13, "name": "괴짜 천재·크립토·실리콘밸리 승부사", "range": (600, 649), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "💻",
     "cat_real": "HACKER_UNDERGROUND", "cat_fict": "HACKER_UNDERGROUND"},
    {"tier": 14, "name": "월드클래스 스타·저작권 연금·스포츠 제왕", "range": (650, 699), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "👑",
     "cat_real": "TYCOON_LUXURY", "cat_fict": "FANTASY_MEDIA_JOB"},
    {"tier": 15, "name": "초호화 슈퍼리치·억만장자 VIP 전담 디렉터", "range": (700, 749), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "💎",
     "cat_real": "TYCOON_LUXURY", "cat_fict": "TYCOON_LUXURY"},
    {"tier": 16, "name": "월스트리트·빅테크·명품 제국 최고 권력자", "range": (750, 799), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🏛️",
     "cat_real": "TYCOON_LUXURY", "cat_fict": "EARTH_MEGAPROJECT"},
    {"tier": 17, "name": "글로벌 카르텔·다이아몬드·석유·카지노 대부", "range": (800, 849), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🛢️",
     "cat_real": "TYCOON_LUXURY", "cat_fict": "WEIRD_BIZ_TRADE"},
    {"tier": 18, "name": "국가급 랜드마크·세계 경제를 쥐락펴락하는 거물", "range": (850, 899), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🌍",
     "cat_real": "EARTH_MEGAPROJECT", "cat_fict": "EARTH_MEGAPROJECT"},
    {"tier": 19, "name": "지구 최정상 부호·인류 미래 기술 독점 제왕", "range": (900, 949), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "⚡",
     "cat_real": "EARTH_MEGAPROJECT", "cat_fict": "TYCOON_LUXURY"},
    {"tier": 20, "name": "우주 개척·은하계·다중우주 시공간 창조 아키텍트", "range": (950, 1000), "zone": "GOOD", "zoneLabel": "대박 직업", "emoji": "🌌",
     "cat_real": "SPACE_SCIFI_JOB", "cat_fict": "MULTIVERSE_GOD"}
]

CATEGORIES_META = {
    'BACKSU_NEETS': {'label': '골방백수·방구석 잉여·기괴한 무직', 'emoji': '🛌'},
    'HISTORICAL_EXTREME': {'label': '고대·중세·근대 극한 역사 직업', 'emoji': '🪣'},
    'EXTREME_JOURNALISM': {'label': '극한 현장·방송·기상천외 취재', 'emoji': '🎙️'},
    'WEIRD_BIZ_TRADE': {'label': '세계의 황당한 장사·이색 상인', 'emoji': '🛒'},
    'TOURISM_EVENT': {'label': '기상천외 관광거리·특별 이벤트 요원', 'emoji': '🎢'},
    'BIZARRE_REAL_JOB': {'label': '실제로 존재하는 신기한 이색 직업', 'emoji': '🐼'},
    'FANTASY_MEDIA_JOB': {'label': '판타지·영화·애니·소설 속 일자리', 'emoji': '🧙'},
    'HACKER_UNDERGROUND': {'label': '천재 해커·어둠의 일거리·크립토 괴짜', 'emoji': '💻'},
    'TYCOON_LUXURY': {'label': '억만장자·초호화 꿀직업·재벌 특권직', 'emoji': '💎'},
    'EARTH_MEGAPROJECT': {'label': '범지구 프로젝트·인류 구원 사령관', 'emoji': '🌍'},
    'SPACE_SCIFI_JOB': {'label': '공상과학(SF)·우주 개척·외계 교섭직', 'emoji': '🚀'},
    'MULTIVERSE_GOD': {'label': '초미래·다중우주·시공간 창조 아키텍트', 'emoji': '🌌'}
}

TIERS_DATA = {
    1: (TIER_1_REAL, TIER_1_FICTION),
    2: (TIER_2_REAL, TIER_2_FICTION),
    3: (TIER_3_REAL, TIER_3_FICTION),
    4: (TIER_4_REAL, TIER_4_FICTION),
    5: (TIER_5_REAL, TIER_5_FICTION),
    6: (TIER_6_REAL, TIER_6_FICTION),
    7: (TIER_7_REAL, TIER_7_FICTION),
    8: (TIER_8_REAL, TIER_8_FICTION),
    9: (TIER_9_REAL, TIER_9_FICTION),
    10: (TIER_10_REAL, TIER_10_FICTION),
    11: (TIER_11_REAL, TIER_11_FICTION),
    12: (TIER_12_REAL, TIER_12_FICTION),
    13: (TIER_13_REAL, TIER_13_FICTION),
    14: (TIER_14_REAL, TIER_14_FICTION),
    15: (TIER_15_REAL, TIER_15_FICTION),
    16: (TIER_16_REAL, TIER_16_FICTION),
    17: (TIER_17_REAL, TIER_17_FICTION),
    18: (TIER_18_REAL, TIER_18_FICTION),
    19: (TIER_19_REAL, TIER_19_FICTION),
    20: (TIER_20_REAL, TIER_20_FICTION),
}

all_items = []
seen_titles = set()

for cfg in TIERS_CONFIG:
    t_num = cfg["tier"]
    t_name = cfg["name"]
    t_zone = cfg["zone"]
    t_zone_label = cfg["zoneLabel"]
    start_lv, end_lv = cfg["range"]
    cat_real = cfg["cat_real"]
    cat_fict = cfg["cat_fict"]

    real_list, fict_list = TIERS_DATA[t_num]

    real_idx = 0
    fict_idx = 0

    for lv in range(start_lv, end_lv + 1):
        is_even = (lv % 2 == 0)
        if is_even:
            item_tuple = real_list[real_idx]
            real_idx += 1
            category_id = cat_real
            reality_type = "REAL"
            reality_label = "실제·역사 속 실존 직업·일거리"
        else:
            item_tuple = fict_list[fict_idx]
            fict_idx += 1
            category_id = cat_fict
            reality_type = "FICTION"
            reality_label = "허구·상상·SF·판타지 속 일자리"

        (t_ko, t_en, era_ko, era_en, sal_ko, sal_en, duty_ko, duty_en, verd_ko, verd_en) = item_tuple

        # Uniqueness check
        if t_ko in seen_titles:
            raise ValueError(f"Duplicate title found: '{t_ko}' at level {lv}")
        seen_titles.add(t_ko)

        padded_lv = str(lv).zfill(5)
        cat_meta = CATEGORIES_META[category_id]

        prompt_str = f"일러스트풍으로 {t_ko} 직업을 가진 사람의 모습을 재미있고 생동감 넘치게 그려줘. I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements."

        item_obj = {
            "level": lv,
            "title": t_ko,
            "category": category_id,
            "categoryLabel": cat_meta["label"],
            "categoryEmoji": cat_meta["emoji"],
            "realityType": reality_type,
            "realityLabel": reality_label,
            "zone": t_zone,
            "zoneLabel": t_zone_label,
            "tier": t_num,
            "tierName": t_name,
            "era": era_ko,
            "estimatedSalary": sal_ko,
            "specialDuty": duty_ko,
            "builtYear": era_ko,           # alias for backward compatibility
            "estimatedValue": sal_ko,       # alias for backward compatibility
            "specialFeature": duty_ko,      # alias for backward compatibility
            "aiVerdict": verd_ko,
            "imagePrompt": prompt_str,
            "geminiImagePrompt": prompt_str,
            "imageUrl": f"/r2/jobs/{padded_lv}.webp",
            "ogImageUrl": f"https://job.tellmyname.app/r2/jobs/{padded_lv}.webp",
            "en": {
                "title": t_en,
                "era": era_en,
                "estimatedSalary": sal_en,
                "specialDuty": duty_en,
                "builtYear": era_en,
                "estimatedValue": sal_en,
                "specialFeature": duty_en,
                "aiVerdict": verd_en
            }
        }
        all_items.append(item_obj)

print("=" * 60)
print(f"Total Generated Items: {len(all_items)} (Expected: 1001)")
print(f"Unique Titles: {len(seen_titles)}")
print(f"Level Range: {all_items[0]['level']} .. {all_items[-1]['level']}")

real_count = sum(1 for it in all_items if it["realityType"] == "REAL")
fict_count = sum(1 for it in all_items if it["realityType"] == "FICTION")
print(f"Real Items (Even): {real_count} (Expected: 501)")
print(f"Fiction Items (Odd): {fict_count} (Expected: 500)")

bad_count = sum(1 for it in all_items if it["zone"] == "BAD")
good_count = sum(1 for it in all_items if it["zone"] == "GOOD")
print(f"BAD Zone (0..499): {bad_count} (Expected: 500)")
print(f"GOOD Zone (500..1000): {good_count} (Expected: 501)")

# Verify Landmark Items
assert all_items[0]["title"] == "고대 로마 콜로세움 맹수 우리 맨손 배설물 청소부", f"Lv.0 mismatch: {all_items[0]['title']}"
assert all_items[100]["title"] == "10년 차 골방 이불 속 발가락 리모컨 조작 장인", f"Lv.100 mismatch: {all_items[100]['title']}"
assert all_items[186]["title"] == "방수 시계 수심 50m 잠수 인체 수압 테스터", f"Lv.186 mismatch: {all_items[186]['title']}"
assert all_items[250]["title"] == "대설특보 광화문에서 머리 위 눈이 30cm 쌓인 채 생방송 인터뷰하는 박대기 기자", f"Lv.250 mismatch: {all_items[250]['title']}"
assert all_items[331]["title"] == "유령의 집 귀마개 및 심장마비 방지 부적 판매상", f"Lv.331 mismatch: {all_items[331]['title']}"
assert all_items[335]["title"] == "스폰지밥 비키니시티 건조 오징어포 수중 포장마차", f"Lv.335 mismatch: {all_items[335]['title']}"
assert all_items[441]["title"] == "고질라 가슴 흉터 사이 메카고질라 미사일 불발탄 캐내는 폭파병", f"Lv.441 mismatch: {all_items[441]['title']}"
assert all_items[600]["title"] == "비트코인 8조 원을 해킹해 남태평양 무인도 해변에서 코코넛 마시는 전설의 유령 개발자", f"Lv.600 mismatch: {all_items[600]['title']}"
assert all_items[628]["title"] == "실리콘밸리 AI 유니콘 스타트업 코드 3줄 짜주고 지분 30% 챙긴 천재", f"Lv.628 mismatch: {all_items[628]['title']}"
assert all_items[999]["title"] == "100조 개의 평행우주 시나리오를 집필하고 빅뱅 스위치를 누르는 다중우주 총감독", f"Lv.999 mismatch: {all_items[999]['title']}"
assert all_items[1000]["title"] == "다중우주 빅뱅 시뮬레이션 및 오메가 포인트 영생 클라우드 총괄 창조 아키텍트", f"Lv.1000 mismatch: {all_items[1000]['title']}"

# Strict Space Rule Verification: ZERO space keywords in Lv.0 ~ 949!
SPACE_KEYWORDS = ['우주', '은하', '행성', '화성', '목성', '토성', '달 남극', '달 뒷면', '소행성', '외계', '성간', '안드로메다', '궤도', '워프', '다이슨 스피어', '콜로니']
space_violations_under_950 = []
for it in all_items[:950]:
    for kw in SPACE_KEYWORDS:
        if kw in it["title"] or kw in it["specialDuty"] or kw in it["aiVerdict"]:
            space_violations_under_950.append((it["level"], it["title"], kw))

assert len(space_violations_under_950) == 0, f"Space violations in Lv.0~949: {space_violations_under_950}"
print("✔ ZERO space keywords in Lv.0 ~ 949 verified!")

# Verify Tier 20 (Lv.950 ~ 1000) contains cosmic/space concepts
tier_20_space_count = sum(
    1 for it in all_items[950:]
    if any(kw in it["title"] or kw in it["specialDuty"] for kw in SPACE_KEYWORDS + ['빅뱅', '다중우주', '시공간'])
)
assert tier_20_space_count >= 50, f"Tier 20 space count: {tier_20_space_count}/51"
print(f"✔ Tier 20 cosmic/space/multiverse coverage verified ({tier_20_space_count}/51 items)!")

print("All landmark assertions passed successfully!")

os.makedirs(DATA_DIR, exist_ok=True)
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(all_items, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(all_items)} jobs to {OUTPUT_JSON}!")
print("=" * 60)
