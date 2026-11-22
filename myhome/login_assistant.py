import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
os.makedirs(USER_DATA_DIR, exist_ok=True)

def main():
    print(f"Using persistent profile at: {USER_DATA_DIR}")
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
        print("Opening https://gemini.google.com/app ...")
        page.goto("https://gemini.google.com/app")
        
        print("\n=======================================================")
        print("브라우저 창이 열렸습니다!")
        print("열린 창의 우측 상단 'Sign in' (로그인) 버튼을 눌러")
        print("Google 계정으로 로그인을 완료해주세요.")
        print("로그인이 감지되면 자동으로 다음 단계로 넘어갑니다.")
        print("=======================================================\n")
        
        # Poll until user signs in (Sign in button disappears and user avatar appears)
        start_time = time.time()
        logged_in = False
        while time.time() - start_time < 300: # 5 minutes
            time.sleep(3)
            try:
                # Check if we are on Google sign in page or Gemini app
                if "accounts.google.com" in page.url:
                    continue
                
                # Check for sign in buttons
                signin_btns = page.locator("text='Sign in', text='로그인'").count()
                # Check for google account avatar or profile button
                profile_btn = page.locator("a[aria-label*='Google Account'], a[aria-label*='Google 계정'], button[aria-label*='Google Account']").count()
                
                if profile_btn > 0 or (signin_btns == 0 and "gemini.google.com" in page.url):
                    print("\n>>> 구글 로그인 성공 확인! 세션이 안전하게 저장되었습니다. <<<")
                    logged_in = True
                    break
            except Exception as e:
                pass
                
        if not logged_in:
            print("로그인 대기 시간(5분)이 초과되었습니다.")
            
        time.sleep(3)
        context.close()

if __name__ == "__main__":
    main()
