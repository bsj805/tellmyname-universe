import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "browser_profile")

with sync_playwright() as p:
    args = [
        "--disable-blink-features=AutomationControlled",
        "--no-first-run",
        "--no-default-browser-check"
    ]
    context = p.chromium.launch_persistent_context(
        user_data_dir=USER_DATA_DIR,
        channel="chrome",
        headless=False,
        args=args,
        viewport={"width": 1280, "height": 900}
    )
    page = context.pages[0] if context.pages else context.new_page()
    page.goto("https://gemini.google.com/images", wait_until="networkidle")
    time.sleep(2)
    
    # Check buttons
    buttons = page.locator("button").all()
    print(f"Total buttons: {len(buttons)}")
    for b in buttons:
        aria = b.get_attribute("aria-label") or ""
        txt = b.inner_text() or ""
        cls = b.get_attribute("class") or ""
        if any(k in aria.lower() or k in txt.lower() or k in cls.lower() for k in ["send", "전송", "submit", "generate"]):
            print(f"Candidate button -> aria: '{aria}', text: '{txt}', class: '{cls[:30]}'")
            
    context.close()
