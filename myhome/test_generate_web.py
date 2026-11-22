import os
import sys
import time
import requests
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
HOUSES_DIR = r"G:\My Drive\houses"

def test_single_generation():
    txt_path = os.path.join(HOUSES_DIR, "00007.txt")
    with open(txt_path, "r", encoding="utf-8") as f:
        prompt = f.read().strip()
        
    print(f"Loaded prompt for 00007.txt:\n{prompt}\n")
    
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
        
        # Check editor
        editor = page.locator(".ql-editor")
        editor.click()
        editor.fill(prompt)
        time.sleep(1)
        
        # Send
        send_btn = page.locator("button[aria-label='Send message'], button[aria-label='메시지 보내기']")
        if send_btn.count() > 0:
            send_btn.first.click()
        else:
            page.keyboard.press("Enter")
        print("Prompt sent! Waiting for image to generate...")
        
        # Wait for generated image (Gemini image generation usually takes 10~30s)
        # Look for images inside the response area or specific generated image selectors
        found_img_url = None
        start_wait = time.time()
        while time.time() - start_wait < 60:
            time.sleep(3)
            # Find all images in the page
            imgs = page.locator("img").all()
            for img in imgs:
                src = img.get_attribute("src") or ""
                # Generated images often have lh3.googleusercontent.com or blob: or data:image
                if "googleusercontent.com" in src and ("=s" in src or "=w" in src or len(src) > 50):
                    # Check dimensions or attributes
                    box = img.bounding_box()
                    if box and box["width"] > 200 and box["height"] > 200:
                        found_img_url = src
                        print(f"Found generated image: {src[:80]}... size: {box['width']}x{box['height']}")
                        break
            if found_img_url:
                break
                
        if found_img_url:
            print("Downloading generated image...")
            # If the URL has size restrictions like =w...-h..., strip or adjust to get full resolution
            # In Googleusercontent URLs, =s0 or =s2048 gives high resolution
            clean_url = found_img_url
            if "=" in clean_url:
                base_url = clean_url.split("=")[0]
                high_res_url = base_url + "=s2048"
            else:
                high_res_url = clean_url
                
            res = requests.get(high_res_url)
            if res.status_code == 200:
                dst_png = os.path.join(HOUSES_DIR, "00007.png")
                # Save as PNG
                from PIL import Image
                import io
                image = Image.open(io.BytesIO(res.content))
                image.save(dst_png, format="PNG")
                print(f"Successfully saved 00007.png to {dst_png}! Size: {image.size}")
            else:
                print(f"Failed to download high res: {res.status_code}, trying original URL...")
                res = requests.get(found_img_url)
                image = Image.open(io.BytesIO(res.content))
                image.save(os.path.join(HOUSES_DIR, "00007.png"), format="PNG")
                print(f"Saved with original URL! Size: {image.size}")
        else:
            print("No image found within 60s. Taking screenshot for diagnosis...")
            diag_path = os.path.join(USER_DATA_DIR, "diag_00007.png")
            page.screenshot(path=diag_path)
            print(f"Diagnosis screenshot saved to {diag_path}")
            
        time.sleep(3)
        context.close()

if __name__ == "__main__":
    test_single_generation()
