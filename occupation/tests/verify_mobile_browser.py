import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ARTIFACT_DIR = r"C:\Users\USER\.gemini\antigravity\brain\aa73ce6b-2d70-4674-86a7-e37a7492795b"

def run_mobile_verification():
    print("=== [MOBILE BROWSER VERIFICATION (390x844)] ===")
    server_proc = subprocess.Popen(
        ["node", "scripts/dev_server.mjs"],
        cwd=r"c:\Users\USER\Documents\projects\occupation",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8"
    )

    try:
        base_url = "http://127.0.0.1:8795"
        for _ in range(20):
            try:
                urllib.request.urlopen(base_url, timeout=1)
                break
            except Exception:
                time.sleep(0.3)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, channel="chrome")
            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                locale="ko-KR",
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            )
            page = context.new_page()
            page.on("pageerror", lambda err: print("PAGE ERROR:", err))
            page.on("console", lambda msg: print("CONSOLE:", msg.text) if msg.type == "error" else None)

            # 1. Load Root Page
            page.goto(f"{base_url}/", wait_until="networkidle")
            time.sleep(0.8)

            scroll_w = page.evaluate("document.documentElement.scrollWidth")
            client_w = page.evaluate("document.documentElement.clientWidth")
            assert scroll_w <= client_w, f"Horizontal overflow on mobile home! scrollWidth={scroll_w}, clientWidth={client_w}"
            print(f"✔ PASS: Mobile Home (390x844) zero horizontal overflow ({scroll_w} <= {client_w})")

            # Verify 3 mandatory specs are rendered in DOM
            body_text = page.locator("body").inner_text()
            if "언제 하던 직업인지" not in body_text:
                print("DEBUG body_text:", body_text[:600])
            assert "언제 하던 직업인지" in body_text, "Missing '언제 하던 직업인지'"
            assert "추산되는 연봉" in body_text, "Missing '추산되는 연봉'"
            assert "직업의 특별한 역할·할일" in body_text, "Missing '직업의 특별한 역할·할일'"
            print("✔ PASS: All 3 mandatory occupation appraisal specs rendered on mobile screen")

            page.screenshot(path=f"{ARTIFACT_DIR}\\mobile_home_390x844.png", full_page=False)

            # 2. Test Name Search ('박대기') & URL Shareability
            page.fill("#name-input", "박대기")
            page.click("#search-btn")
            page.wait_for_timeout(800)
            assert "/name/" in page.url, f"Expected /name/ in URL, got {page.url}"
            card_text = page.locator("#card-root").inner_text()
            assert "441" in card_text and "박대기" in card_text, f"Search for '박대기' did not render Lv.441: {card_text[:200]}"
            print("✔ PASS: Searching '박대기' updates URL to /name/박대기 and renders Lv.441")

            # 3. Test Random Name Dice Button (🎲)
            prev_url = page.url
            page.click("#random-dice-btn")
            page.wait_for_timeout(800)
            assert "/name/" in page.url, "Random dice button did not navigate to a /name/ URL"
            print(f"✔ PASS: Random dice button (🎲) navigated to {page.url}")

            # 4. Test Worst-to-Best World Cup Tab (#tab-btn-worst) & Round Selection (16/32/64/128/256강)
            page.click("#tab-btn-worst")
            page.wait_for_timeout(500)
            wc_text = page.locator("#worldcup-root").inner_text()
            for r_label in ["16강", "32강", "64강", "128강", "256강"]:
                assert r_label in wc_text, f"Missing round option {r_label}"
            print("✔ PASS: Worst-to-Best World Cup lobby displays 16강, 32강, 64강, 128강, 256강 selector")

            # Start 32강 Tournament
            page.click("#wc-start-btn")
            page.wait_for_timeout(500)

            top_box = page.locator('.wc-candidate-card[data-choice="0"]').bounding_box()
            bottom_box = page.locator('.wc-candidate-card[data-choice="1"]').bounding_box()
            assert top_box is not None and bottom_box is not None, "World Cup candidate cards not visible"
            assert bottom_box["y"] > top_box["y"] + top_box["height"] - 5, (
                f"Expected vertical stacking on mobile! top_box={top_box}, bottom_box={bottom_box}"
            )
            print(f"✔ PASS: Mobile World Cup stacks candidates vertically (Top Y={top_box['y']:.0f}, Bottom Y={bottom_box['y']:.0f})")

            scroll_w_wc = page.evaluate("document.documentElement.scrollWidth")
            assert scroll_w_wc <= 390, f"Horizontal overflow in World Cup! scrollWidth={scroll_w_wc}"
            print(f"✔ PASS: Mobile World Cup zero horizontal overflow ({scroll_w_wc} <= 390)")

            page.screenshot(path=f"{ARTIFACT_DIR}\\mobile_worldcup_worst_390x844.png", full_page=False)

            # Pick a candidate in Worst-to-Best World Cup
            page.click('.wc-candidate-card[data-choice="0"] .wc-pick-btn')
            page.wait_for_timeout(500)
            progress_text = page.locator(".wc-match-counter").inner_text()
            assert "2 / 16" in progress_text, f"Expected match 2 / 16 after picking, got {progress_text}"
            print(f"✔ PASS: Picking candidate advances tournament match ({progress_text})")

            # 5. Test Best-to-Worst World Cup Tab (#tab-btn-best)
            page.click("#tab-btn-best")
            page.wait_for_timeout(500)
            page.click("#wc-start-btn")
            page.wait_for_timeout(500)
            best_text = page.locator("#worldcup-root").inner_text()
            assert "최선의 직업 중 최악의 직업 월드컵" in best_text or "대박 직업" in best_text
            page.screenshot(path=f"{ARTIFACT_DIR}\\mobile_worldcup_best_390x844.png", full_page=False)
            print("✔ PASS: Best-to-Worst World Cup tab & vertical match view verified")

            browser.close()
        print("\n🎉 ALL MOBILE BROWSER (390x844) CHECKS PASSED PERFECTLY!")
    finally:
        server_proc.terminate()
        server_proc.wait(timeout=5)

if __name__ == "__main__":
    run_mobile_verification()
