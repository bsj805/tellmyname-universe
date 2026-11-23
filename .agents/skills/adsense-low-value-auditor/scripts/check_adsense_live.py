#!/usr/bin/env python3
"""
Quick live HTTP AdSense & Routing integrity checker for unified TellMyName-style sites.
Usage: python check_adsense_live.py https://tellmyname.app
"""
import sys
import re
import urllib.request
import urllib.error

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://tellmyname.app").rstrip("/")

CHECKS = [
    ("Root (KO)", f"{BASE}/"),
    ("Root (EN)", f"{BASE}/?lang=en"),
    ("Food (EN)", f"{BASE}/food?lang=en"),
    ("Food Gallery (EN)", f"{BASE}/food/gallery?lang=en"),
    ("Job", f"{BASE}/job"),
    ("Car", f"{BASE}/car"),
    ("About", f"{BASE}/about.html"),
    ("Privacy", f"{BASE}/privacy.html"),
]

BAD_TOKENS = [
    "job recommendation",
    "car recommendation",
    "vehicle image",
    "occupation image",
    "Zurich Sovereign Vault",
    "panda kindergarten",
    "origin_MICHELIN",
    "| brandName",
    "navGallery |",
]

failures = 0
print(f"=== Live AdSense Integrity Check: {BASE} ===")
for label, url in CHECKS:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 AdSenseAuditor/1.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            status = res.status
            body = res.read().decode("utf-8", "ignore")
        titles = re.findall(r"<title>(.*?)</title>", body, re.S)
        title = titles[0].strip() if titles else "(no title)"
        hits = [tok for tok in BAD_TOKENS if tok.lower() in body.lower()]
        flag = "PASS" if (status == 200 and not hits) else "WARN"
        if flag != "PASS":
            failures += 1
        print(f"[{flag}] {label:18s} HTTP {status} | {len(body):6d}B | title={title[:65]}")
        if hits:
            print(f"       -> Bad tokens found: {hits}")
    except Exception as e:
        failures += 1
        print(f"[FAIL] {label:18s} ERROR: {e}")

sys.exit(1 if failures else 0)
