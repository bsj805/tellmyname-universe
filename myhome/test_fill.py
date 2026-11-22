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
    
    # Fill prompt
    editor = page.locator(".ql-editor")
    editor.click()
    editor.fill("a cute small red house in the woods")
    time.sleep(1)
    
    # Now check buttons again
    buttons = page.locator("button").all()
    print("Buttons after filling:")
    for b in buttons:
        aria = b.get_attribute("aria-label") or ""
        txt = b.inner_text().strip() or ""
        if aria or txt:
            print(f"Btn -> aria: '{aria}', text: '{txt}'")
            
    context.close()
