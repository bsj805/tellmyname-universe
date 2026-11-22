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
    
    editor = page.locator(".ql-editor")
    editor.click()
    editor.fill("Generate an image of a red apple on a wooden table")
    time.sleep(1)
    
    send_btn = page.locator("button[aria-label='Send message']")
    send_btn.click()
    print("Clicked send message!")
    
    # Wait 10 seconds and see what happens
    time.sleep(10)
    page.screenshot(path=os.path.join(USER_DATA_DIR, "after_send.png"))
    print("Screenshot saved to after_send.png")
    print("Current URL:", page.url)
    
    # Check for sign in dialog or generated content
    signin = page.locator("text='Sign in'").count()
    print(f"'Sign in' count: {signin}")
    
    context.close()
