import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
os.makedirs(USER_DATA_DIR, exist_ok=True)

def main():
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
        page.goto("https://gemini.google.com/app")
        
        print("READY_FOR_LOGIN: Please log in with your Google account in the opened window.")
        
        while True:
            time.sleep(3)
            try:
                # Check if logged in: look for user account avatar or my-account links
                account_elem = page.locator("a[href*='accounts.google.com/SignOutOptions'], a[aria-label*='Google Account'], a[aria-label*='Google 계정']")
                if account_elem.count() > 0:
                    print("SUCCESS_LOGGED_IN: User profile detected! Session is saved.")
                    break
            except Exception:
                pass
                
        # Wait 5 seconds after login to persist cookies
        time.sleep(5)
        print("LOGIN_COMPLETED_AND_SAVED")
        context.close()

if __name__ == "__main__":
    main()
