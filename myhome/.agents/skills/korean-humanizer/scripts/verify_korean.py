#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_korean.py — Korean Humanizer Pre-Publish Automated Verifier
Scans Korean text in .txt, .md, .html, or .json files for S1 (Critical) and S2 (Strong) AI writing tells,
and outputs a diagnostic report with a Grade (A / B / C / D).
"""

import sys
import os
import re
import json
import argparse
from pathlib import Path

# S1: Single occurrence is a critical AI tell (or strict threshold cluster)
S1_PATTERNS = [
    ("A-8 이중 피동", re.compile(r"(되어지|보여지|쓰여지|여겨지|생각되어지|요구되어지|기대되어지|제공되어지)[다기며고는니]")),
    ("A-3 번역투 전치사(~에 있어서)", re.compile(r"(함에\s*있어서|에\s*있어서|에\s*다름\s*아니)")),
    ("A-7 가지다(have) 직역", re.compile(r"(의미를|중요성을|영향력을|가치를|가능성을|특징을)\s*가지(고|며|는|다)")),
    ("E-1 산문 내 줄표(—/–)", re.compile(r"[가-힣0-9\)]\s*[—–]\s*[가-힣0-9\(]")),
    ("C-3/C-4 AI 상투 결산어", re.compile(r"(결론적으로\s*말씀드리면|결론적으로,|시사하는\s*바가\s*크|귀추가\s*주목|앞으로의\s*행보가\s*기대|새로운\s*지평을\s*열|중요한\s*이정표를\s*세)")),
    ("C-7 무생물 행위주", re.compile(r"(데이터가\s*말해주|수치가\s*보여주|시장이\s*원하|기술이\s*요구하|시대가\s*부른)")),
    ("D-8/E-6 챗봇 잔재·예고 멘트", re.compile(r"(도움이\s*되셨길\s*바랍|도움이\s*되었으면\s*좋겠|좋은\s*질문입|지금부터\s+[^\.\n]{1,30}알아보겠습|본격적으로\s*들어가기에\s*앞서|하나씩\s*짚어보겠습)")),
    ("I-1 형식명사 권위 결말", re.compile(r"(인\s*것이다\.|한\s*것이다\.|인\s*것입니다\.|한\s*것입니다\.)")),
]

# Density-based S1/S2 patterns
RE_COMMA_AFTER_CONNECTIVE = re.compile(r"[가-힣]+(고|며|지만|면서|아서|어서),\s+[가-힣]")
RE_HYPE_WORDS = re.compile(r"(다채로운|혁신적인|독보적인|획기적인|압도적인|자리매김|발돋움|방증하|선사하|선사합|아우르|녹여내|향연|극대화)")
RE_TRANSLATION_THROUGH = re.compile(r"(을\s*통해|를\s*통해|에\s*의해|에\s*대해|와\s*관련하여|에\s*기반하여)")
RE_DOUBLE_PARTICLE = re.compile(r"[가-힣]+(에서의|으로의|로부터의)\s")
RE_NOUNIFICATION_VERB = re.compile(r"(을|를)\s*(진행하|수행하|실시하|도모하)")
RE_NEGATIVE_PARALLEL = re.compile(r"(단순한\s+[^\.]{1,25}아니라|그저\s+[^\.]{1,25}아닌|단순히\s+[^\.]{1,25}넘어)")
RE_INIT_CONJUNCTION = re.compile(r"(?:^|[\.\!\?]\s+)(또한|게다가|나아가|아울러|더불어|이처럼|따라서|즉),?\s+")
RE_PLURAL_DEUL = re.compile(r"[가-힣]{2,}들이\s+[^\.\n]{0,20}[가-힣]{2,}들을")
RE_JEOK_SUFFIX = re.compile(r"[가-힣]{2,}적(인|으로|이고|이며)?")


def extract_text_blocks(file_path: Path):
    """Extract Korean text blocks from HTML, JSON, MD, or TXT."""
    raw = file_path.read_text(encoding="utf-8", errors="replace")
    suffix = file_path.suffix.lower()

    if suffix == ".html":
        # Remove script and style blocks
        cleaned = re.sub(r"<(script|style)\b[^>]*>[\s\S]*?</\1>", " ", raw, flags=re.I)
        # Remove HTML comments
        cleaned = re.sub(r"<!--[\s\S]*?-->", " ", cleaned)
        # Replace tags with newlines
        cleaned = re.sub(r"<[^>]+>", "\n", cleaned)
        lines = [line.strip() for line in cleaned.splitlines() if re.search(r"[가-힣]", line)]
        return [("HTML 본문", "\n".join(lines), [])]

    if suffix == ".json":
        try:
            data = json.loads(raw)
        except Exception:
            return [("JSON Raw", raw, [])]
        blocks = []

        def walk(obj, path="root"):
            if isinstance(obj, dict):
                # Skip English/non-Korean sub-objects and redundant alias keys on the same item
                skip_keys = {
                    "en", "ja", "zh", "es", "fr", "de", "pt", "ru", "id", "vi", "hi", "it", "ms",
                    "geminiImagePrompt", "imagePrompt", "illustrationPrompt", "poolsByMeal",
                    "tierName", "categoryLabel", "realityLabel", "zoneLabel", "originLabel", "originBadge"
                }
                if "specialFeature" in obj and "specialDuty" in obj:
                    skip_keys.add("specialDuty")
                if "builtYear" in obj and "era" in obj:
                    skip_keys.add("era")
                if "estimatedValue" in obj:
                    skip_keys.update({"estimatedPrice", "estimatedSalary"})
                for k, v in obj.items():
                    if k in skip_keys:
                        continue
                    walk(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for idx, item in enumerate(obj):
                    walk(item, f"{path}[{idx}]")
            elif isinstance(obj, str) and re.search(r"[가-힣]", obj):
                blocks.append((path, obj))

        walk(data)
        # Check for duplicate sentences/fields inside JSON arrays
        from collections import Counter
        counts = Counter(text.strip() for path, text in blocks if len(text.strip()) >= 25)
        dups = [(txt, cnt) for txt, cnt in counts.items() if cnt >= 2]
        combined = "\n".join(text for _, text in blocks)
        return [("JSON 한국어 필드 통합", combined, dups)]

    return [("텍스트 본문", raw, [])]


def analyze_text(text: str, dups=None):
    """Analyze Korean text and return S1 findings, S2 findings, and Grade."""
    s1_findings = []
    s2_findings = []

    if dups:
        sample = "; ".join(f"'{txt[:28]}...'({cnt}회)" for txt, cnt in dups[:3])
        s1_findings.append(f"[S1] D-10 동일 문장 템플릿 복붙(Low-Value 중복): {len(dups)}종 ({sample})")

    # 1. Direct S1 regex checks
    for label, pattern in S1_PATTERNS:
        matches = [m.group(0) for m in pattern.finditer(text)]
        if matches:
            sample = ", ".join(sorted(set(matches))[:5])
            s1_findings.append(f"[S1] {label}: {len(matches)}건 ({sample})")

    # 2. Comma after connective check
    comma_matches = [m.group(0) for m in RE_COMMA_AFTER_CONNECTIVE.finditer(text)]
    if len(comma_matches) >= 6:
        sample = ", ".join(comma_matches[:5])
        s1_findings.append(f"[S1] E-2 연결어미 직후 쉼표 과다: {len(comma_matches)}건 ({sample})")
    elif len(comma_matches) >= 3:
        sample = ", ".join(comma_matches[:4])
        s2_findings.append(f"[S2] E-2 연결어미 직후 쉼표 주의: {len(comma_matches)}건 ({sample})")

    # 3. AI Hype words check
    hype_matches = [m.group(0) for m in RE_HYPE_WORDS.finditer(text)]
    char_len = max(1, len(text))
    hype_per_1000 = (len(hype_matches) / char_len) * 1000
    if len(hype_matches) >= 3 and hype_per_1000 >= 2.5:
        sample = ", ".join(sorted(set(hype_matches))[:6])
        s1_findings.append(f"[S1] C-1 AI 과장/홍보(Hype) 어휘 군집: {len(hype_matches)}건 (1,000자당 {hype_per_1000:.1f}건: {sample})")
    elif len(hype_matches) >= 2:
        sample = ", ".join(sorted(set(hype_matches))[:5])
        s2_findings.append(f"[S2] C-1 AI 과장/홍보(Hype) 어휘: {len(hype_matches)}건 ({sample})")

    # 4. S2 checks
    trans_matches = [m.group(0) for m in RE_TRANSLATION_THROUGH.finditer(text)]
    trans_per_1000 = (len(trans_matches) / char_len) * 1000
    if len(trans_matches) >= 3 and trans_per_1000 >= 2.0:
        sample = ", ".join(sorted(set(trans_matches))[:5])
        s2_findings.append(f"[S2] A-1/A-2/A-9 번역투 조사(~를 통해/~에 의해/~에 대해): {len(trans_matches)}건 ({sample})")

    dp_matches = [m.group(0).strip() for m in RE_DOUBLE_PARTICLE.finditer(text)]
    if dp_matches:
        s2_findings.append(f"[S2] A-17 이중 조사(~에서의/~으로의): {len(dp_matches)}건 ({', '.join(sorted(set(dp_matches))[:5])})")

    nv_matches = [m.group(0) for m in RE_NOUNIFICATION_VERB.finditer(text)]
    if len(nv_matches) >= 2:
        s2_findings.append(f"[S2] A-6 명사화+진행/수행/도모: {len(nv_matches)}건 ({', '.join(sorted(set(nv_matches))[:5])})")

    neg_matches = [m.group(0) for m in RE_NEGATIVE_PARALLEL.finditer(text)]
    if len(neg_matches) >= 2:
        s2_findings.append(f"[S2] D-1 부정 병렬(단순한 X가 아니라 Y): {len(neg_matches)}건 ({', '.join(neg_matches[:3])})")

    conj_matches = [m.group(1) for m in RE_INIT_CONJUNCTION.finditer(text)]
    if len(conj_matches) >= 4:
        s2_findings.append(f"[S2] E-3 문두 접속사 반복: {len(conj_matches)}건 ({', '.join(conj_matches[:5])})")

    plural_matches = [m.group(0) for m in RE_PLURAL_DEUL.finditer(text)]
    if plural_matches:
        s2_findings.append(f"[S2] A-15 복수 접미사 '~들' 중복: {len(plural_matches)}건 ({', '.join(plural_matches[:3])})")

    # Sentence-level '~적' density (3+ in one sentence)
    sentences = re.split(r"[\.\!\?\n]+", text)
    jeok_heavy_sentences = []
    for s in sentences:
        j_matches = RE_JEOK_SUFFIX.findall(s)
        if len(j_matches) >= 3:
            jeok_heavy_sentences.append(s.strip()[:60])
    if jeok_heavy_sentences:
        s2_findings.append(f"[S2] F-5 한 문장 내 '~적' 접미사 3회 이상 과밀: {len(jeok_heavy_sentences)}문장 (예: {jeok_heavy_sentences[0]}...)")

    # Determine Grade
    s1_count = len(s1_findings)
    s2_count = len(s2_findings)
    if s1_count == 0 and s2_count <= 2:
        grade = "A"
    elif s1_count == 0 and s2_count <= 4:
        grade = "B"
    elif s1_count <= 2:
        grade = "C"
    else:
        grade = "D"

    return {
        "char_count_with_spaces": len(text),
        "char_count_no_spaces": len(re.sub(r"\s+", "", text)),
        "s1_findings": s1_findings,
        "s2_findings": s2_findings,
        "grade": grade,
    }


def main():
    parser = argparse.ArgumentParser(description="Korean Humanizer Pre-Publish Verifier")
    parser.add_argument("targets", nargs="+", help="Files or directories to verify")
    args = parser.parse_args()

    files_to_check = []
    for t in args.targets:
        p = Path(t)
        if p.is_dir():
            for ext in ("*.html", "*.md", "*.txt", "*.json"):
                files_to_check.extend(p.rglob(ext))
        elif p.is_file():
            files_to_check.append(p)

    if not files_to_check:
        print("검사할 파일이 없습니다.")
        sys.exit(0)

    overall_pass = True
    for f in sorted(set(files_to_check)):
        blocks = extract_text_blocks(f)
        for block_name, text, dups in blocks:
            if not text.strip():
                continue
            res = analyze_text(text, dups=dups)
            status = "PASS (게시 가능)" if res["grade"] in ("A", "B") else "FAIL (교정 필수)"
            if res["grade"] not in ("A", "B"):
                overall_pass = False
            print(f"============================================================")
            print(f"📄 파일: {f} [{block_name}]")
            print(f"📊 글자수: 공백 포함 {res['char_count_with_spaces']:,}자 / 공백 제외 {res['char_count_no_spaces']:,}자")
            print(f"🏆 등급: Grade {res['grade']} — {status}")
            if res["s1_findings"]:
                print("🚨 [S1 결정적 AI 흔적 (즉시 제거 필수)]:")
                for item in res["s1_findings"]:
                    print(f"   - {item}")
            if res["s2_findings"]:
                print("⚠️ [S2 강한 AI 흔적 (밀도 완화 권장)]:")
                for item in res["s2_findings"]:
                    print(f"   - {item}")
            if not res["s1_findings"] and not res["s2_findings"]:
                print("✅ 탐지된 AI 번역투/상투어 흔적이 없습니다.")

    sys.exit(0 if overall_pass else 1)


if __name__ == "__main__":
    main()
