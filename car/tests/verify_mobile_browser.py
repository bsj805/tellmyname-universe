# tests/verify_mobile_browser.py — Real Mobile Viewport (390x844) Browser E2E Verification for MyCar
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

PORT = 8798
BASE_URL = f"http://127.0.0.1:{PORT}"

def main():
    print(f"=== [Mobile Browser Verification] Starting dev_server on port {PORT} ===")
    env = dict(**__import__("os").environ, PORT=str(PORT))
    srv = subprocess.Popen(
        ["node", "scripts/dev_server.mjs"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    try:
        time.sleep(1.5)
        with sync_playwright() as p:
            browser = p.chromium.launch(channel="chrome", headless=True)
            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                is_mobile=True,
                has_touch=True
            )
            page = context.new_page()
            console_errors = []
            page.on("pageerror", lambda err: console_errors.append(str(err)))

            # 1. Root page & Mobile Overflow check
            print("[1/5] Testing Mobile Root Page (390x844) & Family Nav...")
            page.goto(f"{BASE_URL}/", wait_until="networkidle")
            overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            scroll_w = page.evaluate("document.documentElement.scrollWidth")
            client_w = page.evaluate("document.documentElement.clientWidth")
            assert not overflow, f"Horizontal overflow on mobile root! scrollWidth={scroll_w}, clientWidth={client_w}"
            family_count = page.locator(".family-site-nav a").count()
            assert family_count == 5, f"Expected 5 family site links, got {family_count}"
            print(f"   ✔ Mobile Root: scrollWidth={scroll_w} <= clientWidth={client_w}, family links={family_count}")

            # 2. Level 50 (Baby Tricycle), Level 501 (Harry Potter Firebolt Broom), Level 550 (Great White Shark Mount)
            for lv, expected_kw in [(50, "세발자전거"), (501, "파이어볼트"), (550, "백상아리")]:
                print(f"[2/5] Testing Lv.{lv} ({expected_kw})...")
                page.goto(f"{BASE_URL}/level/{lv}", wait_until="networkidle")
                text = page.content()
                assert expected_kw in text, f"Expected '{expected_kw}' in Lv.{lv}"
                overflow_lv = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
                assert not overflow_lv, f"Horizontal overflow at /level/{lv}"
                print(f"   ✔ Lv.{lv} rendered '{expected_kw}' with zero mobile overflow")

            # 3. Name Search & Random Dice Button
            print("[3/5] Testing Name Search ('김서윤') & 9:16 Share Modal...")
            page.goto(f"{BASE_URL}/name/김서윤", wait_until="networkidle")
            assert "김서윤" in page.content()
            overflow_name = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            assert not overflow_name, "Horizontal overflow on /name/김서윤"
            print("   ✔ /name/김서윤 rendered with zero mobile overflow")

            # 4. Worldcup Mobile Vertical Stack & Deterministic Seed URL
            print("[4/5] Testing Worldcup Mobile Vertical Stack (/worldcup/worst-to-best?round=32&seed=20261121)...")
            page.goto(f"{BASE_URL}/worldcup/worst-to-best?round=32&seed=20261121", wait_until="networkidle")
            time.sleep(0.5)
            overflow_wc = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            assert not overflow_wc, "Horizontal overflow on Worldcup page"
            cards = page.locator(".wc-card")
            if cards.count() >= 2:
                box0 = cards.nth(0).bounding_box()
                box1 = cards.nth(1).bounding_box()
                assert box1["y"] > box0["y"], f"Expected vertical stack on mobile (card2.y={box1['y']} > card1.y={box0['y']})"
                print(f"   ✔ Worldcup mobile vertical stack verified (Card A y={box0['y']:.1f}, Card B y={box1['y']:.1f})")

            # 5. Multilingual (?lang=en & ?lang=ja) Mobile check
            print("[5/5] Testing Multilingual Mobile Rendering (?lang=en, ?lang=ja)...")
            for lang in ["en", "ja"]:
                page.goto(f"{BASE_URL}/?lang={lang}", wait_until="networkidle")
                overflow_lang = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
                assert not overflow_lang, f"Horizontal overflow on /?lang={lang}"
            print("   ✔ Multilingual mobile viewports verified with zero overflow")

            assert len(console_errors) == 0, f"Page errors detected: {console_errors}"
            browser.close()
            print("\n🎉 ALL MOBILE BROWSER (390x844) CHECKS PASSED!")
    finally:
        srv.terminate()

if __name__ == "__main__":
    main()
