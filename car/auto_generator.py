import os
import sys
import time
import base64
import re
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright
from PIL import Image

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Determine target images directory
# Priority: CLI argument without '--' -> default: C:\Users\USER\Documents\projects\car\images
CARS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
MAX_GENERATE_COUNT = None

if os.environ.get("MAX_GENERATE_COUNT"):
    try:
        MAX_GENERATE_COUNT = int(os.environ["MAX_GENERATE_COUNT"])
    except ValueError:
        pass

for arg in sys.argv[1:]:
    arg_clean = arg.strip().strip('"').strip("'")
    if arg_clean.startswith("--max-count="):
        try:
            MAX_GENERATE_COUNT = int(arg_clean.split("=")[1])
        except ValueError:
            pass
    elif arg_clean.startswith("--max="):
        try:
            MAX_GENERATE_COUNT = int(arg_clean.split("=")[1])
        except ValueError:
            pass
    elif not arg_clean.startswith("--") and (os.path.isabs(arg_clean) or os.path.exists(arg_clean)):
        CARS_DIR = arg_clean

USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
FAILED_LOG_PATH = os.path.join(CARS_DIR, "failed_images.log")
os.makedirs(USER_DATA_DIR, exist_ok=True)
os.makedirs(CARS_DIR, exist_ok=True)

RATE_LIMIT_KEYWORDS = [
    "한도가 재설정",
    "이미지를 더 생성할 수 있습니다",
    "설정에서 사용량을 확인",
    "한도에 도달",
    "사용량 한도",
    "한도 초과",
    "너무 많은 요청",
    "잠시 후 다시",
    "더 이상 이미지를 생성할 수",
    "quota exceeded",
    "usage limit",
    "limit resets",
    "generate more images",
    "check your usage"
]


def is_generation_finished(page):
    """Gemini 응답 생성 완료 여부 확인"""
    try:
        stop_btn = page.locator("button[aria-label*='Stop'], button[aria-label*='중지'], button.stop-button")
        for btn in stop_btn.all():
            if btn.is_visible():
                return False
    except Exception:
        pass

    try:
        editor = page.locator(".ql-editor").last
        if editor.is_visible():
            return True
    except Exception:
        pass

    return True


def natural_sort_key(filename):
    nums = re.findall(r'\d+', filename)
    return (0, int(nums[0]), filename) if nums else (1, 0, filename)


def get_missing_txt_files(failed_set):
    """
    미생성된 이미지 번호 탐색:
    00000.txt ~ 01000.txt (5자리 0-패딩 기준) 중
    대응하는 00000.png ~ 01000.png가 아직 생성되지 않은 대상 추출
    """
    if not os.path.exists(CARS_DIR):
        print(f"오류: 폴더를 찾을 수 없습니다: {CARS_DIR}")
        return []

    files = set(os.listdir(CARS_DIR))
    missing = []
    for lv in range(0, 1001):
        padded_base = str(lv).zfill(5)
        padded_txt = f"{padded_base}.txt"
        padded_png = f"{padded_base}.png"
        if padded_txt in files and padded_png not in files:
            if padded_txt not in failed_set:
                missing.append(padded_txt)
    return missing


def parse_reset_time_to_seconds(text):
    now = datetime.now()
    cur_match = re.search(
        r'(?:Current usage|현재\s*사용량)[\s\S]*?(?:Resets\s*at|리셋|재설정)\s*(?:at\s*)?([^\n\r]+)',
        text, re.IGNORECASE
    )
    search_scope = cur_match.group(1) if cur_match else text

    rel_m = re.search(r'(\d+)\s*시간(?:\s*(\d+)\s*분)?', search_scope)
    if rel_m:
        return int(rel_m.group(1)) * 3600 + (int(rel_m.group(2)) if rel_m.group(2) else 0) * 60

    rel_min_only = re.search(r'(\d+)\s*분\s*(?:후에|남음)', search_scope)
    if rel_min_only:
        return int(rel_min_only.group(1)) * 60

    rel_en = re.search(r'(\d+)\s*(?:hours?|h)(?:\s*(?:and\s*)?(\d+)\s*(?:minutes?|mins?|m))?', search_scope, re.IGNORECASE)
    if rel_en:
        return int(rel_en.group(1)) * 3600 + (int(rel_en.group(2)) if rel_en.group(2) else 0) * 60

    ko_time = re.search(r'(오전|오후)\s*(\d{1,2})(?:[:시]\s*(\d{1,2}))?', search_scope)
    if ko_time:
        ampm, h = ko_time.group(1), int(ko_time.group(2))
        m = int(ko_time.group(3)) if ko_time.group(3) else 0
        if ampm == "오후" and h < 12:
            h += 12
        elif ampm == "오전" and h == 12:
            h = 0
        target = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        return int((target - now).total_seconds())

    en_time = re.search(r'(\d{1,2}):(\d{2})\s*(AM|PM)', search_scope, re.IGNORECASE)
    if en_time:
        h, m, ampm = int(en_time.group(1)), int(en_time.group(2)), en_time.group(3).upper()
        if ampm == "PM" and h < 12:
            h += 12
        elif ampm == "AM" and h == 12:
            h = 0
        target = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        return int((target - now).total_seconds())

    h24_time = re.search(r'\b([01]?\d|2[0-3]):([0-5]\d)\b', search_scope)
    if h24_time:
        target = now.replace(hour=int(h24_time.group(1)), minute=int(h24_time.group(2)), second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        return int((target - now).total_seconds())

    return None


def check_and_wait_usage_limit(page):
    print("\n" + "=" * 60)
    print(" [사용량 한도 감지] https://gemini.google.com/usage 페이지로 이동합니다...")
    print("=" * 60)

    try:
        page.goto("https://gemini.google.com/usage", wait_until="domcontentloaded")
        time.sleep(3)
        body_text = page.inner_text("body")

        cur_usage_m = re.search(r'(?:Current usage|현재\s*사용량)[\s\S]*?(\d+)%\s*(?:used|사용)', body_text, re.IGNORECASE)
        if cur_usage_m:
            used_pct = int(cur_usage_m.group(1))
            print(f"[사용량 분석] Current usage: {used_pct}% used")
            if used_pct < 95:
                print(f"✔ [사용량 확인] 현재 사용량 {used_pct}% (한도 미도달). 10초 후 생성을 재개합니다.\n")
                time.sleep(10)
                page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
                time.sleep(2)
                select_hydrogen_model(page)
                return True

        wait_seconds = parse_reset_time_to_seconds(body_text)
        wait_seconds = 600 if (wait_seconds is None or wait_seconds <= 0) else (wait_seconds + 60)

        target_dt = datetime.now() + timedelta(seconds=wait_seconds)
        target_str = target_dt.strftime('%H:%M:%S')
        hours = wait_seconds // 3600
        mins = (wait_seconds % 3600) // 60
        secs = wait_seconds % 60
        print(f"\n>>> [스마트 대기] 총 대기: {hours}시간 {mins}분 {secs}초 (재개 예정: {target_str}) <<<\n")

        remaining = wait_seconds
        while remaining > 0:
            step = min(remaining, 60)
            time.sleep(step)
            remaining -= step
            r_h, r_m, r_s = remaining // 3600, (remaining % 3600) // 60, remaining % 60
            print(f"[쿼터 대기 중] 남음: {r_h}시간 {r_m}분 {r_s}초 (목표: {target_str})", flush=True)

        page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
        time.sleep(3)
        select_hydrogen_model(page)
        return True
    except Exception as e:
        print(f"Usage 확인 오류: {e}. 5분 후 재시도합니다.")
        time.sleep(300)
        return False


def is_valid_saved_image(dst_png):
    """저장된 파일이 유효한 고해상도 탈것 일러스트 이미지인지 검증 (>=50KB, >=400x400)"""
    try:
        if not os.path.exists(dst_png) or os.path.getsize(dst_png) < 50000:
            return False
        with Image.open(dst_png) as img:
            img.verify()
        with Image.open(dst_png) as img:
            w, h = img.size
            if w < 400 or h < 400:
                return False
        return True
    except Exception:
        return False


def extract_image_base64_from_page(page):
    js_extract = """
    () => {
        let imgs = Array.from(document.querySelectorAll('model-response img'));
        if (!imgs.length) imgs = Array.from(document.querySelectorAll('img'));
        for (let i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            const w = img.naturalWidth || img.width || 0;
            const h = img.naturalHeight || img.height || 0;
            const src = img.src || '';
            if (src.includes('googlelogo') || src.includes('photo.jpg') || src.includes('avatar') || src.includes('favicon')) continue;
            if (w >= 400 && h >= 400) {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    if (dataUrl && dataUrl.startsWith('data:image/png;base64,')) return dataUrl;
                } catch (e) {
                    return 'SRC:' + src;
                }
            }
        }
        return null;
    }
    """
    try:
        return page.evaluate(js_extract)
    except Exception:
        return None


def select_hydrogen_model(page):
    """Gemini 모델 선택기에서 'Hydrogen' 모델 확인 및 선택 보장"""
    try:
        btn = None
        selectors = [
            'button[data-test-id="bard-mode-menu-button"]',
            'bard-mode-switcher button',
            'bard-mode-switcher [role="button"]',
            'button[aria-label*="mode picker"]',
            'button[aria-label*="mode switcher"]',
            'button[aria-label*="모델 선택"]',
            'bard-mode-switcher'
        ]
        for sel in selectors:
            el = page.query_selector(sel)
            if el and el.is_visible():
                btn = el
                break

        if not btn:
            btn = page.query_selector('button:has-text("Hydrogen"), button:has-text("Flash"), button:has-text("Pro")')
        if not btn:
            return False

        btn_text = (btn.inner_text() or "").strip()
        aria_label = btn.get_attribute("aria-label") or ""
        if "hydrogen" in btn_text.lower() or "hydrogen" in aria_label.lower():
            return True

        btn.click()
        time.sleep(0.8)

        options = page.query_selector_all('gem-menu-item, [role="menuitemradio"], [role="menuitem"], [data-test-id*="bard-mode-option"]')
        target_opt = None
        for opt in options:
            t = (opt.inner_text() or "").lower()
            mode_id = opt.get_attribute("data-mode-id") or ""
            if "hydrogen" in t or "56fdd199312815e2" in mode_id or "everyday help" in t:
                target_opt = opt
                break

        if not target_opt:
            target_opt = page.query_selector('[data-test-id*="bard-mode-option"][data-mode-id="56fdd199312815e2"], gem-menu-item:has-text("Hydrogen")')

        if target_opt:
            opt_text = (target_opt.inner_text() or "").strip()
            aria_disabled = (target_opt.get_attribute("aria-disabled") or "").lower() == "true"
            if aria_disabled or not target_opt.is_enabled() or any(k in opt_text.lower() for k in ["limit resets", "한도", "resets"]):
                page.keyboard.press("Escape")
                time.sleep(0.3)
                return "RATE_LIMIT"
            try:
                target_opt.click(timeout=3000)
            except Exception:
                page.keyboard.press("Escape")
                time.sleep(0.3)
                return "RATE_LIMIT"
            time.sleep(1.0)
            return True
        else:
            page.keyboard.press("Escape")
            time.sleep(0.3)
            return False
    except Exception:
        return False


def send_prompt(page, prompt_text):
    m_stat = select_hydrogen_model(page)
    if m_stat == "RATE_LIMIT":
        return "RATE_LIMIT"

    editor = page.locator(".ql-editor").last
    editor.wait_for(state="visible", timeout=10000)
    editor.click()
    time.sleep(0.2)

    page.keyboard.press("Control+A")
    page.keyboard.press("Backspace")
    time.sleep(0.2)

    editor.fill(prompt_text)
    time.sleep(0.5)
    page.keyboard.press("Space")
    time.sleep(0.3)
    page.keyboard.press("Backspace")
    time.sleep(0.5)

    send_btn = page.locator("button[aria-label*='Send'], button[aria-label*='보내기'], button[aria-label*='전송'], button.send-button").last
    sent = False
    for _ in range(3):
        if send_btn.count() > 0 and send_btn.is_enabled():
            send_btn.click()
            sent = True
            break
        page.keyboard.press("Enter")
        time.sleep(0.5)
        if not editor.inner_text().strip() or editor.inner_text().strip() != prompt_text:
            sent = True
            break
        time.sleep(0.5)

    if not sent:
        editor.click()
        page.keyboard.press("Enter")

    time.sleep(1)
    return "SENT"


def wait_and_save_image(page, dst_png, max_wait=50):
    start_wait = time.time()
    while time.time() - start_wait < max_wait:
        time.sleep(2.5)
        try:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        except Exception:
            pass

        try:
            download_btns = page.locator(
                "model-response button[aria-label*='다운로드'], model-response button[aria-label*='Download'], "
                "button[aria-label*='이미지 다운로드'], button[aria-label*='Download image'], "
                "button[aria-label*='다운로드'], button[aria-label*='Download']"
            ).all()
            for btn in download_btns:
                if btn.is_visible():
                    try:
                        with page.expect_download(timeout=4000) as download_info:
                            btn.click()
                        download_info.value.save_as(dst_png)
                        if is_valid_saved_image(dst_png):
                            print(f"✔ [다운로드 버튼 성공] 저장 완료: {dst_png}")
                            return "SAVED"
                        if os.path.exists(dst_png):
                            os.remove(dst_png)
                    except Exception:
                        pass
        except Exception:
            pass

        res_data = extract_image_base64_from_page(page)
        if res_data:
            if res_data.startswith("data:image/png;base64,"):
                b64_str = res_data.split("data:image/png;base64,")[1]
                with open(dst_png, "wb") as f:
                    f.write(base64.b64decode(b64_str))
                if is_valid_saved_image(dst_png):
                    print(f"✔ [캔버스 추출 성공] 저장 완료: {dst_png}")
                    return "SAVED"
                if os.path.exists(dst_png):
                    os.remove(dst_png)
            elif res_data.startswith("SRC:"):
                try:
                    resp = page.request.get(res_data[4:])
                    if resp.status == 200:
                        with open(dst_png, "wb") as f:
                            f.write(resp.body())
                        if is_valid_saved_image(dst_png):
                            print(f"✔ [URL 직접 추출 성공] 저장 완료: {dst_png}")
                            return "SAVED"
                        if os.path.exists(dst_png):
                            os.remove(dst_png)
                except Exception:
                    pass

        try:
            alerts = page.locator("mat-snack-bar-container, [role='alert'], .boqOnegoogleliteNotification, .toast, .banner-message").all()
            for al in alerts:
                if al.is_visible() and any(k in al.inner_text().strip() for k in RATE_LIMIT_KEYWORDS):
                    return "RATE_LIMIT"
        except Exception:
            pass

        try:
            responses = page.locator("model-response").all()
            if responses:
                last_resp = responses[-1]
                last_response_text = last_resp.inner_text().strip()
                if any(k in last_response_text for k in RATE_LIMIT_KEYWORDS):
                    return "RATE_LIMIT"
                if len(last_response_text) > 10 and is_generation_finished(page):
                    time.sleep(2)
                    if not extract_image_base64_from_page(page):
                        if any(k in last_resp.inner_text().strip() for k in RATE_LIMIT_KEYWORDS):
                            return "RATE_LIMIT"
                        return "NO_IMAGE_FINISHED"
        except Exception:
            pass

    return "TIMEOUT"


def format_car_prompt(raw_text):
    """이미 완성된 영문/국문 프롬프트면 그대로 사용하고, 짧은 제목만 있을 때 보정"""
    text = raw_text.strip()
    if len(text) > 40 or "illustration" in text.lower() or text.startswith("일러스트풍으로"):
        return text
    return (
        f"Vibrant stylized digital illustration of {text}, comedic dynamic angle, rich vivid colors, "
        f"strictly no text, no letters, no words, no watermarks in the image."
    )


def cleanup_unpadded_png_duplicates(target_dir):
    """미패딩 PNG(0.png 등) 중복 제거 (0.txt..1000.txt는 스펙 요구사항으로 보존)"""
    try:
        if not os.path.exists(target_dir):
            return
        for f in os.listdir(target_dir):
            if re.match(r'^\d{1,4}\.png$', f):
                try:
                    os.remove(os.path.join(target_dir, f))
                except Exception:
                    pass
    except Exception:
        pass


def run_automation():
    failed_set = set()
    cleanup_unpadded_png_duplicates(CARS_DIR)

    if os.path.exists(FAILED_LOG_PATH):
        try:
            with open(FAILED_LOG_PATH, "r", encoding="utf-8") as f:
                for line in f:
                    fn = line.strip().split("\t")[0]
                    if fn:
                        failed_set.add(fn)
        except Exception:
            pass

    print("=" * 60)
    print(" [Gemini Cars 0~1000 무인 자동차·탈것 이미지 자동 생성기 v1.0]")
    print(f" - 대상 폴더: {CARS_DIR}")
    print(f" - 실패 스킵: {len(failed_set)}개 제외 중")
    print(f" - 최대 생성 한도: {MAX_GENERATE_COUNT if MAX_GENERATE_COUNT is not None else '무제한'}")
    print(" - 저장 규격: 00000.png ~ 01000.png (5자리 0-패딩)")
    print("=" * 60 + "\n")

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
            viewport={"width": 1360, "height": 950}
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
        time.sleep(2)

        while True:
            account_elem = page.locator("a[href*='accounts.google.com/SignOutOptions'], a[aria-label*='Google Account'], a[aria-label*='Google 계정']")
            editor_elem = page.locator(".ql-editor")
            if account_elem.count() > 0 or editor_elem.count() > 0:
                print(">>> 구글 로그인 확인 완료! 무인 탈것 이미지 생성을 시작합니다. <<<\n")
                time.sleep(1)
                if select_hydrogen_model(page) == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                break
            print("[로그인 대기] 브라우저에서 Google 로그인을 완료해주세요...")
            time.sleep(3)

        success_count = 0
        idx = 0

        while True:
            if MAX_GENERATE_COUNT is not None and success_count >= MAX_GENERATE_COUNT:
                print(f"\n[안내] 설정된 최대 생성 수({MAX_GENERATE_COUNT}개) 도달로 종료합니다.")
                break

            missing_files = get_missing_txt_files(failed_set)
            if not missing_files:
                print("\n모든 00000~01000 탈것 이미지 생성이 완료되었습니다!")
                break

            txt_file = missing_files[0]
            txt_path = os.path.join(CARS_DIR, txt_file)
            base_name = os.path.splitext(txt_file)[0]
            dst_png = os.path.join(CARS_DIR, base_name + ".png")
            idx += 1

            with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
                original_prompt = format_car_prompt(f.read().strip())

            print("-" * 60)
            print(f"[진행 {idx} / 남은 {len(missing_files)}개] {txt_file} -> {base_name}.png")
            print(f"프롬프트: {original_prompt[:90]}...")

            try:
                page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
                time.sleep(2)
                if select_hydrogen_model(page) == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                    continue
            except Exception:
                pass

            try:
                if send_prompt(page, original_prompt) == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                    continue
            except Exception as e:
                print(f"입력 전송 오류 ({txt_file}): {e}")
                time.sleep(2)
                continue

            status = wait_and_save_image(page, dst_png, max_wait=45)
            if status == "RATE_LIMIT":
                check_and_wait_usage_limit(page)
                continue

            if status in ["NO_IMAGE_FINISHED", "TIMEOUT"]:
                retry_prompt = (
                    "Create a completely original, stylized humorous concept art illustration capturing the essence of this ride "
                    "(without any copyrighted logos or text): " + original_prompt
                )
                try:
                    if send_prompt(page, retry_prompt) == "RATE_LIMIT":
                        check_and_wait_usage_limit(page)
                        continue
                    status2 = wait_and_save_image(page, dst_png, max_wait=50)
                    if status2 == "SAVED":
                        status = "SAVED"
                    elif status2 == "RATE_LIMIT":
                        check_and_wait_usage_limit(page)
                        continue
                except Exception as e:
                    print(f"2차 전송 오류: {e}")

            if status == "SAVED":
                success_count += 1
            else:
                failed_set.add(txt_file)
                try:
                    with open(FAILED_LOG_PATH, "a", encoding="utf-8") as f:
                        f.write(f"{txt_file}\t{datetime.now().isoformat()}\n")
                except Exception:
                    pass

            time.sleep(2)

        print(f"\n작업 종료! 총 성공: {success_count}개 / 스킵: {len(failed_set)}개")
        context.close()


if __name__ == "__main__":
    run_automation()
