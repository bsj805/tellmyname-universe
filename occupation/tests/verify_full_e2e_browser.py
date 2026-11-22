"""
tests/verify_full_e2e_browser.py
Comprehensive Playwright E2E browser verification script for MyJob (https://job.tellmyname.app).
Tests:
  1. All Pages & Legal Routes (/, /name/박대기, /level/1000, /worldcup/worst-to-best, /worldcup/best-to-worst,
     /about, /privacy, /terms, /contact, /sitemap.xml, /robots.txt, /ads.txt)
  2. All Buttons on Main Page (Search, Dice, Image Load, Share Modal with Themes/Copy/Close, Family Top Nav)
  3. Full Ideal-Type World Cup End-to-End to Champion (16강 -> 15 matches -> Champion Card -> Same-Condition Replay -> Best-to-Worst)
  4. All 14 Languages (ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms) with zero undefined/NaN
"""

import os
import sys
import time
import subprocess
import urllib.request
import urllib.parse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8795"
PROJECT_DIR = r"c:\Users\USER\Documents\projects\occupation"

def ensure_server_running():
    try:
        req = urllib.request.Request(f"{BASE_URL}/", headers={"User-Agent": "HealthCheck"})
        with urllib.request.urlopen(req, timeout=1.5) as res:
            if res.status == 200:
                print(f"ℹ Existing dev server detected on {BASE_URL}")
                return None
    except Exception:
        pass

    print(f"ℹ Spawning local dev server on port 8795...")
    env = os.environ.copy()
    env["PORT"] = "8795"
    proc = subprocess.Popen(
        ["node", "scripts/dev_server.mjs"],
        cwd=PROJECT_DIR,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8"
    )

    for i in range(30):
        try:
            req = urllib.request.Request(f"{BASE_URL}/", headers={"User-Agent": "HealthCheck"})
            with urllib.request.urlopen(req, timeout=1.0) as res:
                if res.status == 200:
                    print(f"✔ Dev server is ready on {BASE_URL} (took {(i+1)*0.3:.1f}s)")
                    return proc
        except Exception:
            time.sleep(0.3)

    stdout, stderr = proc.communicate(timeout=2)
    raise RuntimeError(f"Dev server failed to start on {BASE_URL}!\nstdout: {stdout}\nstderr: {stderr}")


def run_full_e2e():
    print("===================================================================")
    print(" [BROWSER E2E TEST SUITE] MyJob (https://job.tellmyname.app)")
    print("===================================================================")

    server_proc = ensure_server_running()

    try:
        with sync_playwright() as p:
            print("\n[Browser Setup] Launching Chromium (channel=chrome, headless=True)...")
            browser = p.chromium.launch(headless=True, channel="chrome")
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                locale="ko-KR",
                permissions=["clipboard-read", "clipboard-write"]
            )
            page = context.new_page()

            page_errors = []
            console_errors = []

            page.on("pageerror", lambda err: page_errors.append(str(err)))
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            # -------------------------------------------------------------
            # 1. All Pages & Legal Routes
            # -------------------------------------------------------------
            print("\n[1/4] Testing All Pages & Legal Routes...")

            routes = [
                ("/", 200, "text/html"),
                (f"/name/{urllib.parse.quote('박대기')}", 200, "text/html"),
                ("/level/1000", 200, "text/html"),
                ("/worldcup/worst-to-best", 200, "text/html"),
                ("/worldcup/best-to-worst", 200, "text/html"),
                ("/about", 200, "text/html"),
                ("/privacy", 200, "text/html"),
                ("/terms", 200, "text/html"),
                ("/contact", 200, "text/html"),
                ("/sitemap.xml", 200, "xml"),
                ("/robots.txt", 200, "text/plain"),
                ("/ads.txt", 200, "text/plain")
            ]

            for path, expected_status, content_type_substr in routes:
                url = f"{BASE_URL}{path}"
                res = page.goto(url, wait_until="domcontentloaded")
                status = res.status if res else 0
                assert status == expected_status, f"Route {path} returned status {status}, expected {expected_status}"

                content_type = res.headers.get("content-type", "")
                assert content_type_substr in content_type, f"Route {path} content-type {content_type} missing {content_type_substr}"

                if content_type_substr == "text/html":
                    # verify zero unhandled page errors
                    assert len(page_errors) == 0, f"Page error on {path}: {page_errors}"

                print(f"  ✔ PASS: {path} returned {status} ({content_type.split(';')[0]})")

            # -------------------------------------------------------------
            # 2. All Buttons on Main Page
            # -------------------------------------------------------------
            print("\n[2/4] Testing All Buttons on Main Page...")
            page.goto(f"{BASE_URL}/", wait_until="networkidle")

            # 2-A. Name input & search button ('박대기' -> Lv.441)
            page.fill("#name-input", "박대기")
            page.click("#search-btn")

            # Wait for appraisal card to render and image to be loaded
            page.wait_for_function("""
                () => {
                    const card = document.getElementById('card-root');
                    const img = card ? card.querySelector('img') : null;
                    return card && card.innerText.includes('441') && img && img.complete && img.naturalWidth > 0;
                }
            """, timeout=10000)

            curr_url = page.url
            assert "/name/" in curr_url, f"Expected URL to contain /name/, got {curr_url}"
            card_text = page.locator("#card-root").inner_text()
            assert "441" in card_text and "박대기" in card_text, f"Appraisal card missing Lv.441 / 박대기: {card_text[:160]}"
            print("  ✔ PASS: Name input & search for '박대기' renders Lv.441 appraisal card")

            # Verify image loaded (naturalWidth > 0)
            img_natural_w = page.evaluate("""
                () => {
                    const img = document.querySelector('#card-root img');
                    return img ? img.naturalWidth : 0;
                }
            """)
            assert img_natural_w > 0, f"Appraisal card image failed to load (naturalWidth={img_natural_w})"
            print(f"  ✔ PASS: Appraisal card artwork image loaded cleanly (naturalWidth={img_natural_w}px)")

            # 2-B. Random dice button (🎲)
            prev_url = page.url
            page.click("#random-dice-btn")

            page.wait_for_function("""
                (prev) => {
                    const card = document.getElementById('card-root');
                    const img = card ? card.querySelector('img') : null;
                    return window.location.href !== prev && img && img.complete && img.naturalWidth > 0;
                }
            """, arg=prev_url, timeout=10000)

            dice_url = page.url
            assert dice_url != prev_url and "/name/" in dice_url, f"Random dice button did not navigate to new /name/ URL: {dice_url}"
            dice_img_w = page.evaluate("""
                () => {
                    const img = document.querySelector('#card-root img');
                    return img ? img.naturalWidth : 0;
                }
            """)
            assert dice_img_w > 0, f"Random dice job image failed to load (naturalWidth={dice_img_w})"
            print(f"  ✔ PASS: Random dice button navigated to {urllib.parse.unquote(dice_url)} with valid image")

            # 2-C. Share modal open button -> themes -> copy url -> close modal
            page.click("#btn-open-share")
            page.wait_for_selector(".share-modal-body", timeout=5000)
            print("  ✔ PASS: Share modal opened (#btn-open-share)")

            # Click theme buttons
            themes = ["sunset", "cert", "cyber"]
            for theme in themes:
                pill = page.locator(f".theme-pill[data-theme='{theme}']")
                assert pill.is_visible(), f"Theme pill for {theme} not visible"
                pill.click()
                page.wait_for_timeout(200)
                assert "active" in (pill.get_attribute("class") or ""), f"Theme pill {theme} should be active"
                print(f"    ✔ Clicked theme pill: {theme}")

            # Click copy URL button inside modal
            copy_btn = page.locator("#share-url-copy-button")
            if not copy_btn.is_visible():
                copy_btn = page.locator("#share-action-copy-url")
            assert copy_btn.is_visible(), "Share URL copy button not visible in modal"
            copy_btn.click()
            page.wait_for_timeout(300)
            toast_loc = page.locator("#share-toast-notification")
            toast_text = toast_loc.first.inner_text() if toast_loc.count() > 0 else ""
            print(f"    ✔ Clicked share URL copy button (Toast: {toast_text.strip() or 'Copied'})")

            # Close share modal
            close_btn = page.locator("#share-modal-close-btn")
            assert close_btn.is_visible(), "Share modal close button not visible"
            close_btn.click()
            page.wait_for_timeout(300)
            modal_body_count = page.locator(".share-modal-body").count()
            assert modal_body_count == 0, "Share modal failed to close"
            print("  ✔ PASS: Share modal closed cleanly")

            # 2-D. Family top nav links
            family_links = [
                ("#family-link-job", "job.tellmyname.app"),
                ("#family-link-myhome", "myhome.tellmyname.app"),
                ("#family-link-food", "food.tellmyname.app"),
                ("#family-link-photodiary", "photodiary.tellmyname.app")
            ]
            for selector, expected_domain in family_links:
                link = page.locator(selector)
                assert link.is_visible(), f"Family nav link {selector} is not visible"
                href = link.get_attribute("href") or ""
                assert expected_domain in href, f"Family nav link {selector} href '{href}' does not contain '{expected_domain}'"
                print(f"  ✔ PASS: Family nav link {selector} verified ({href})")

            # -------------------------------------------------------------
            # 3. Full Ideal-Type World Cup End-to-End to Champion
            # -------------------------------------------------------------
            print("\n[3/4] Testing Full Ideal-Type World Cup End-to-End to Champion...")

            # 3-A. Worst-to-Best 16강 Tournament
            page.click("#tab-btn-worst")
            page.wait_for_selector(".wc-round-btn[data-round='16']", timeout=5000)
            page.click(".wc-round-btn[data-round='16']")
            page.wait_for_timeout(200)

            # Start tournament
            page.click("#wc-start-btn")
            page.wait_for_selector(".wc-candidate-card", timeout=5000)
            print("  ✔ Started Worst-to-Best World Cup (16강)")

            # Click through 15 matches to champion
            match_count = 0
            max_clicks = 40
            for _ in range(max_clicks):
                if page.locator(".wc-champion-card").is_visible():
                    break

                # Candidate cards must be ready (not currently transitioning)
                candidate = page.locator('.wc-candidate-card[data-choice="0"]:not(.wc-selected)')
                if candidate.is_visible():
                    match_count += 1
                    candidate.click()
                    # Wait for 220ms JS timeout + DOM update
                    page.wait_for_timeout(320)
                else:
                    page.wait_for_timeout(100)

            assert page.locator(".wc-champion-card").is_visible(), f"Champion screen not visible after {match_count} matches!"
            assert match_count == 15, f"Expected exactly 15 matches for 16강 (8+4+2+1), got {match_count}"
            print(f"  ✔ PASS: Played all {match_count} matches through to Champion Screen (16강 -> 8강 -> 4강 -> 결승)")

            # Verify Champion Card stats & image
            champ_title = page.locator(".wc-champion-house-name").inner_text().strip()
            assert len(champ_title) > 0, "Champion card missing job title"
            champ_img_w = page.evaluate("""
                () => {
                    const img = document.querySelector('.wc-champion-img');
                    return img ? img.naturalWidth : 0;
                }
            """)
            assert champ_img_w > 0, f"Champion image failed to load (naturalWidth={champ_img_w})"
            print(f"  ✔ PASS: Champion Card renders cleanly: '{champ_title}' (Image naturalWidth={champ_img_w}px)")

            # Test same-condition replay button (#wc-replay-same-btn)
            same_replay_btn = page.locator("#wc-replay-same-btn")
            assert same_replay_btn.is_visible(), "#wc-replay-same-btn is not visible on champion screen"
            same_replay_btn.click()
            page.wait_for_selector(".wc-candidate-card", timeout=5000)

            restarted_counter = page.locator(".wc-match-counter").inner_text()
            assert "1 / 8" in restarted_counter or "1 / 16" in restarted_counter or "1/" in restarted_counter, (
                f"Expected match 1 counter after same-condition replay, got: {restarted_counter}"
            )
            print(f"  ✔ PASS: Replay Same Bracket restarted Match 1 ({restarted_counter.strip()})")

            # 3-B. Best-to-Worst World Cup Tab
            page.click("#tab-btn-best")
            page.wait_for_selector(".wc-round-btn[data-round='16']", timeout=5000)
            page.click("#wc-start-btn")
            page.wait_for_selector(".wc-candidate-card", timeout=5000)
            best_counter = page.locator(".wc-match-counter").inner_text()
            print(f"  ✔ PASS: Best-to-Worst World Cup tournament active ({best_counter.strip()})")

            # -------------------------------------------------------------
            # 4. All 14 Languages (ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms)
            # -------------------------------------------------------------
            print("\n[4/4] Testing All 14 Languages UI Updates & Absence of undefined/NaN...")

            # Return to main search mode
            page.click("#tab-btn-search")
            page.wait_for_selector("#lang-select", timeout=5000)

            all_14_langs = ["ko", "en", "hi", "vi", "fr", "pt", "es", "id", "ru", "de", "it", "ja", "zh", "ms"]

            for lang_code in all_14_langs:
                page.select_option("#lang-select", lang_code)
                page.wait_for_timeout(350)

                # Verify texts
                brand_text = page.locator("#header-brand-text").inner_text().strip()
                owner_headline = page.locator("#card-root .owner-headline-label").inner_text().strip()
                tab_worst = page.locator("#tab-btn-worst").inner_text().strip()
                family_job = page.locator("#family-label-job").inner_text().strip()
                family_myhome = page.locator("#family-label-myhome").inner_text().strip()
                family_food = page.locator("#family-label-food").inner_text().strip()
                family_photo = page.locator("#family-label-photodiary").inner_text().strip()

                for label_name, text_val in [
                    ("brand_text", brand_text),
                    ("owner_headline", owner_headline),
                    ("tab_worst", tab_worst),
                    ("family_job", family_job),
                    ("family_myhome", family_myhome),
                    ("family_food", family_food),
                    ("family_photo", family_photo)
                ]:
                    assert text_val, f"[{lang_code}] Empty string for {label_name}"
                    assert "undefined" not in text_val.lower(), f"[{lang_code}] Found 'undefined' in {label_name}: '{text_val}'"
                    assert "NaN" not in text_val, f"[{lang_code}] Found 'NaN' in {label_name}: '{text_val}'"
                    assert "null" not in text_val.lower().split(), f"[{lang_code}] Found standalone 'null' in {label_name}: '{text_val}'"
                    assert "{name}" not in text_val, f"[{lang_code}] Unreplaced '{{name}}' in {label_name}: '{text_val}'"

                print(f"  ✔ PASS: [{lang_code.upper()}] Brand: '{brand_text[:20]}...' | Headline: '{owner_headline[:25]}...' | Job: '{family_job}'")

            assert len(page_errors) == 0, f"Page errors encountered during full E2E run: {page_errors}"
            browser.close()

        print("\n===================================================================")
        print(" 🎉 ALL PLAYWRIGHT E2E BROWSER TESTS PASSED 100% PERFECTLY!")
        print("===================================================================")

    finally:
        if server_proc:
            print("ℹ Terminating spawned dev server...")
            server_proc.terminate()
            try:
                server_proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_proc.kill()


if __name__ == "__main__":
    run_full_e2e()
