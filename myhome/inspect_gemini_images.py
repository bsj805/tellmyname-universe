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
    
    print("Navigating to https://gemini.google.com/images ...")
    page.goto("https://gemini.google.com/images", wait_until="networkidle")
    time.sleep(3)
    
    screenshot_path = os.path.join(USER_DATA_DIR, "images_page.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to: {screenshot_path}")
    
    # Check input box selectors
    selectors = [
        "rich-textarea",
        "[contenteditable='true']",
        "textarea",
        "input[type='text']",
        ".ql-editor"
    ]
    for s in selectors:
        count = page.locator(s).count()
        print(f"Selector '{s}': count={count}")
        
    context.close()
