import os
import sys
import time
from playwright.sync_api import sync_playwright

USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "browser_profile")
os.makedirs(USER_DATA_DIR, exist_ok=True)

def main():
    print(f"Browser profile directory: {USER_DATA_DIR}")
    with sync_playwright() as p:
        args = [
            "--disable-blink-features=AutomationControlled",
            "--no-first-run",
            "--no-default-browser-check"
        ]
        
        # Launch Chrome with persistent context
        try:
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                channel="chrome",
                headless=False,
                args=args,
                viewport={"width": 1280, "height": 900}
            )
        except Exception as e:
            print(f"Failed to launch Chrome with channel='chrome': {e}")
            print("Falling back to bundled chromium...")
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                headless=False,
                args=args,
                viewport={"width": 1280, "height": 900}
            )
            
        page = context.pages[0] if context.pages else context.new_page()
        
        print("Navigating to https://gemini.google.com/app ...")
        page.goto("https://gemini.google.com/app", wait_until="domcontentloaded")
        
        print("Please check the opened Chrome browser window.")
        print("If you are not logged in, please log in with your Google account in that window.")
        print("Waiting up to 120 seconds for login / main interface to appear...")
        
        # Check if login or prompt box is visible
        start_time = time.time()
        logged_in = False
        while time.time() - start_time < 120:
            # Look for common prompt textarea or input box in Gemini web app
            # rich-textarea, textarea, [contenteditable="true"], etc.
            content = page.content()
            if "accounts.google.com" in page.url:
                time.sleep(2)
                continue
            
            # Check for input area
            try:
                input_elem = page.query_selector("rich-textarea, [contenteditable='true'], textarea")
                if input_elem:
                    logged_in = True
                    print("Login detected successfully! Prompt input is available.")
                    break
            except Exception:
                pass
            time.sleep(2)
            
        if not logged_in:
            print("Login timeout or prompt area not found yet. Current URL:", page.url)
        else:
            print("Session successfully established!")
            
        time.sleep(3)
        context.close()

if __name__ == "__main__":
    main()
