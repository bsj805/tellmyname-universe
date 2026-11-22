import os
import sys
import time
import base64
import re
import shutil
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright
from PIL import Image

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Determine target images directory
# Priority: CLI argument without '--' -> default: C:\Users\USER\Documents\projects\occupation\images
JOBS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
MAX_GENERATE_COUNT = None

# Check environment variable
if os.environ.get("MAX_GENERATE_COUNT"):
    try:
        MAX_GENERATE_COUNT = int(os.environ["MAX_GENERATE_COUNT"])
    except ValueError:
        pass

# Parse CLI arguments
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
    elif not arg_clean.startswith("--") and os.path.isabs(arg_clean) or os.path.exists(arg_clean):
        JOBS_DIR = arg_clean

USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
FAILED_LOG_PATH = os.path.join(JOBS_DIR, "failed_images.log")
os.makedirs(USER_DATA_DIR, exist_ok=True)
os.makedirs(JOBS_DIR, exist_ok=True)

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
    """
    Gemini 응답 생성이 완료되었는지 감지:
    1. 전송/중지 버튼 상태: '중지'/'Stop' 버튼이 없고 전송 버튼이 활성화되어 있는지
    2. 입력창(.ql-editor)이 활성화되어 있는지
    """
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
    """숫자 기준 자연스러운 순차 정렬 (00000.txt -> 00001.txt ... 01000.txt)"""
    nums = re.findall(r'\d+', filename)
    return (0, int(nums[0]), filename) if nums else (1, 0, filename)

def get_missing_txt_files(failed_set):
    """
    미생성된 이미지 번호 탐색:
    00000.txt ~ 01000.txt (5자리 0-패딩 단일 규격) 기준,
    대응하는 00000.png ~ 01000.png가 아직 생성되지 않은 대상 추출
    """
    if not os.path.exists(JOBS_DIR):
        print(f"오류: 폴더를 찾을 수 없습니다: {JOBS_DIR}")
        return []

    files = set(os.listdir(JOBS_DIR))

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

    # 1. 'Current usage' 또는 '현재 사용량' 영역 우선 스코프 설정
    cur_match = re.search(r'(?:Current usage|현재\s*사용량)[\s\S]*?(?:Resets\s*at|리셋|재설정)\s*(?:at\s*)?([^\n\r]+)', text, re.IGNORECASE)
    search_scope = cur_match.group(1) if cur_match else text

    # 상대 시간 (한국어: "X시간 Y분", "X분 후에")
    rel_m = re.search(r'(\d+)\s*시간(?:\s*(\d+)\s*분)?', search_scope)
    if rel_m:
        hours = int(rel_m.group(1))
        mins = int(rel_m.group(2)) if rel_m.group(2) else 0
        return hours * 3600 + mins * 60

    rel_min_only = re.search(r'(\d+)\s*분\s*(?:후에|남음)', search_scope)
    if rel_min_only:
        return int(rel_min_only.group(1)) * 60

    # 상대 시간 (영어: "X hours Y mins", "X h Y m")
    rel_en = re.search(r'(\d+)\s*(?:hours?|h)(?:\s*(?:and\s*)?(\d+)\s*(?:minutes?|mins?|m))?', search_scope, re.IGNORECASE)
    if rel_en:
        hours = int(rel_en.group(1))
        mins = int(rel_en.group(2)) if rel_en.group(2) else 0
        return hours * 3600 + mins * 60

    # 한국어 절대 시간: "오전/오후 H:M"
    ko_time = re.search(r'(오전|오후)\s*(\d{1,2})(?:[:시]\s*(\d{1,2}))?', search_scope)
    if ko_time:
        ampm = ko_time.group(1)
        h = int(ko_time.group(2))
        m = int(ko_time.group(3)) if ko_time.group(3) else 0
        if ampm == "오후" and h < 12:
            h += 12
        elif ampm == "오전" and h == 12:
            h = 0
        target = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        diff = (target - now).total_seconds()
        return int(diff)

    # 영어 12시간제: "5:18 PM", "5:18PM", "05:18 AM"
    en_time = re.search(r'(\d{1,2}):(\d{2})\s*(AM|PM)', search_scope, re.IGNORECASE)
    if en_time:
        h = int(en_time.group(1))
        m = int(en_time.group(2))
        ampm = en_time.group(3).upper()
        if ampm == "PM" and h < 12:
            h += 12
        elif ampm == "AM" and h == 12:
            h = 0
        target = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        diff = (target - now).total_seconds()
        return int(diff)

    # 24시간제: "17:18"
    h24_time = re.search(r'\b([01]?\d|2[0-3]):([0-5]\d)\b', search_scope)
    if h24_time:
        h = int(h24_time.group(1))
        m = int(h24_time.group(2))
        target = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        diff = (target - now).total_seconds()
        return int(diff)

    return None

def check_and_wait_usage_limit(page):
    print("\n" + "=" * 60)
    print(" [사용량 한도 감지] https://gemini.google.com/usage 페이지로 이동합니다...")
    print("=" * 60)

    try:
        page.goto("https://gemini.google.com/usage", wait_until="domcontentloaded")
        time.sleep(3)
        body_text = page.inner_text("body")

        # 1. 현재 사용량 백분율(%) 확인 (예: 0% used, 100% used)
        cur_usage_m = re.search(r'(?:Current usage|현재\s*사용량)[\s\S]*?(\d+)%\s*(?:used|사용)', body_text, re.IGNORECASE)
        if cur_usage_m:
            used_pct = int(cur_usage_m.group(1))
            print(f"[사용량 분석] Current usage: {used_pct}% used")
            if used_pct < 95:
                print(f"✔ [사용량 확인] 현재 사용량 {used_pct}% (한도 미도달). 10초 후 즉시 생성을 재개합니다.\n")
                time.sleep(10)
                page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
                time.sleep(2)
                select_hydrogen_model(page)
                return True

        wait_seconds = parse_reset_time_to_seconds(body_text)

        if wait_seconds is None or wait_seconds <= 0:
            print("[알림] 구체적인 리셋 시간을 찾지 못했습니다. 10분 대기 후 재확인합니다.")
            wait_seconds = 600
        else:
            wait_seconds += 60  # +1분 마진

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
            r_h = remaining // 3600
            r_m = (remaining % 3600) // 60
            r_s = remaining % 60
            if r_h > 0:
                print(f"[쿼터 대기 중] 리셋까지 남은 시간: {r_h}시간 {r_m}분 {r_s}초 (목표: {target_str})", flush=True)
            else:
                print(f"[쿼터 대기 중] 리셋까지 남은 시간: {r_m}분 {r_s}초 (목표: {target_str})", flush=True)

        print("\n" + "=" * 60)
        print(">>> 쿼터 리셋 +1분 경과 완료! 생성을 재개합니다. <<<")
        print("=" * 60 + "\n")

        page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
        time.sleep(3)
        select_hydrogen_model(page)
        return True
    except Exception as e:
        print(f"Usage 확인 오류: {e}. 5분 후 재시도합니다.")
        time.sleep(300)
        return False

def is_valid_saved_image(dst_png):
    """
    저장된 파일이 유효한 고해상도 직업 일러스트 이미지인지 철저히 검증:
    1. 파일 존재 여부 및 파일 크기 >= 50,000 bytes (50KB) 확인 (1KB~2KB 코드 블록 다운로드 방지)
    2. PIL(Pillow)로 이미지 포맷 및 손상 여부 검증
    3. 가로/세로 해상도 >= 400x400 확인
    """
    try:
        if not os.path.exists(dst_png):
            return False
        sz = os.path.getsize(dst_png)
        if sz < 50000:
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
        if (!imgs.length) {
            imgs = Array.from(document.querySelectorAll('img'));
        }
        for (let i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            const w = img.naturalWidth || img.width || 0;
            const h = img.naturalHeight || img.height || 0;
            const src = img.src || '';

            if (src.includes('googlelogo') || src.includes('photo.jpg') || src.includes('avatar') || src.includes('favicon')) {
                continue;
            }

            if (w >= 400 && h >= 400) {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    if (dataUrl && dataUrl.startsWith('data:image/png;base64,')) {
                        return dataUrl;
                    }
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
    """
    Gemini 모델 선택기에서 'Hydrogen' 모델을 확인 및 선택 보장:
    1. 현재 선택된 모델이 이미 Hydrogen인 경우 즉시 통과
    2. 다른 모델이거나 미선택 시 드롭다운 메뉴를 열어 'Hydrogen' 옵션 확인
    3. Hydrogen 옵션이 비활성화(한도 초과: aria-disabled=true 등) 상태인 경우 "RATE_LIMIT" 반환
    4. 활성 상태인 경우 클릭 후 선택 완료
    """
    try:
        # 1. 모델 선택 버튼 찾기
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
            btn = page.query_selector('button:has-text("Hydrogen"), button:has-text("Flash"), button:has-text("Pro"), button:has-text("Argon")')

        if not btn:
            print("  ⚠️ [모델 확인] 모델 선택기 버튼을 찾을 수 없어 건너뜁니다.")
            return False

        btn_text = (btn.inner_text() or "").strip()
        aria_label = btn.get_attribute("aria-label") or ""

        # 이미 Hydrogen인 경우 즉각 통과
        if "hydrogen" in btn_text.lower() or "hydrogen" in aria_label.lower():
            print(f"  ✔ [모델 확인] 이미 Hydrogen 모델이 선택되어 있습니다. ({btn_text})")
            return True

        print(f"  🔄 [모델 전환] 현재 모델 '{btn_text}' -> Hydrogen 모델로 전환을 시작합니다...")
        btn.click()
        time.sleep(0.8)

        # 메뉴에서 Hydrogen 옵션 찾기
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
            is_disabled = aria_disabled or not target_opt.is_enabled() or any(k in opt_text.lower() for k in ["limit resets", "한도", "resets"])

            if is_disabled:
                print(f"  ⚠️ [모델 한도 감지] Hydrogen 모델 옵션이 비활성화(한도 초과) 상태입니다. (메뉴 텍스트: {opt_text})")
                page.keyboard.press("Escape")
                time.sleep(0.3)
                return "RATE_LIMIT"

            try:
                target_opt.click(timeout=3000)
            except Exception as click_err:
                print(f"  ⚠️ [모델 클릭 타임아웃] Hydrogen 옵션 클릭 실패 (비활성화 가능성): {click_err}")
                page.keyboard.press("Escape")
                time.sleep(0.3)
                return "RATE_LIMIT"

            time.sleep(1.0)

            # 전환 결과 확인
            btn_after = None
            for sel in selectors:
                el = page.query_selector(sel)
                if el and el.is_visible():
                    btn_after = el
                    break

            after_text = (btn_after.inner_text() or "").strip() if btn_after else ""
            after_aria = btn_after.get_attribute("aria-label") or "" if btn_after else ""

            if "hydrogen" in after_text.lower() or "hydrogen" in after_aria.lower():
                print(f"  ✔ [모델 전환 완료] Hydrogen 모델이 성공적으로 선택되었습니다. ({after_text})")
                return True
            else:
                print(f"  ⚠️ [모델 전환 알림] 전환 후 표시 텍스트: '{after_text}' (계속 진행)")
                return True
        else:
            print("  ⚠️ [모델 전환 실패] 드롭다운에서 Hydrogen 옵션을 찾지 못했습니다. (메뉴 닫기)")
            page.keyboard.press("Escape")
            time.sleep(0.3)
            return False
    except Exception as e:
        print(f"  ⚠️ [모델 선택 예외] {e}")
        return False

def send_prompt(page, prompt_text):
    """프롬프트를 확실하게 입력하고 전송 버튼 또는 Enter를 눌러 전송 보장 (Hydrogen 모델 선택 보장)"""
    # 전송 직전 Hydrogen 모델 선택 상태 확인 및 보장
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
        else:
            page.keyboard.press("Enter")
            time.sleep(0.5)
            txt_in_editor = editor.inner_text().strip()
            if not txt_in_editor or txt_in_editor != prompt_text:
                sent = True
                break
        time.sleep(0.5)

    if not sent:
        editor.click()
        page.keyboard.press("Enter")

    time.sleep(1)
    return "SENT"

def wait_and_save_image(page, dst_png, max_wait=50):
    """
    이미지 생성을 기다리고 저장.
    1. 이미지가 나오면 즉시 SAVED 반환.
    2. 쿼터 한도 초과 시 RATE_LIMIT 반환.
    3. 모델의 답변(텍스트)이 출력되었고 + 출력이 끝났는데 이미지가 없다면 ➜ 'NO_IMAGE_FINISHED' 즉시 반환
    """
    start_wait = time.time()

    while time.time() - start_wait < max_wait:
        time.sleep(2.5)
        try:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        except Exception:
            pass

        # 1. 이미지 감지 및 저장 시도 (다운로드 버튼 또는 캔버스/URL)
        try:
            download_btns = page.locator("model-response button[aria-label*='다운로드'], model-response button[aria-label*='Download'], button[aria-label*='이미지 다운로드'], button[aria-label*='Download image'], button[aria-label*='다운로드'], button[aria-label*='Download'], a[aria-label*='다운로드'], a[aria-label*='Download']").all()
            for btn in download_btns:
                if btn.is_visible():
                    try:
                        with page.expect_download(timeout=4000) as download_info:
                            btn.click()
                        download = download_info.value
                        download.save_as(dst_png)
                        if is_valid_saved_image(dst_png):
                            print(f"✔ [다운로드 버튼 성공] 저장 완료: {dst_png}")
                            return "SAVED"
                        else:
                            print(f"⚠️ [무효 이미지 무시] 다운로드된 파일이 유효한 이미지가 아닙니다 (코드 블록 등): {dst_png}")
                            if os.path.exists(dst_png):
                                try:
                                    os.remove(dst_png)
                                except Exception:
                                    pass
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
                else:
                    print(f"⚠️ [무효 이미지 무시] 추출된 파일이 유효한 이미지가 아닙니다: {dst_png}")
                    if os.path.exists(dst_png):
                        try:
                            os.remove(dst_png)
                        except Exception:
                            pass
            elif res_data.startswith("SRC:"):
                img_url = res_data[4:]
                try:
                    resp = page.request.get(img_url)
                    if resp.status == 200:
                        with open(dst_png, "wb") as f:
                            f.write(resp.body())
                        if is_valid_saved_image(dst_png):
                            print(f"✔ [URL 직접 추출 성공] 저장 완료: {dst_png}")
                            return "SAVED"
                        else:
                            print(f"⚠️ [무효 이미지 무시] 추출된 파일이 유효한 이미지가 아닙니다: {dst_png}")
                            if os.path.exists(dst_png):
                                try:
                                    os.remove(dst_png)
                                except Exception:
                                    pass
                except Exception:
                    pass

        # 2. 사용량 한도(Rate limit) 감지 (알림 배너/토스트 전용 - 사이드바 채팅 히스토리 제외)
        try:
            alerts = page.locator("mat-snack-bar-container, [role='alert'], .boqOnegoogleliteNotification, .toast, .banner-message").all()
            for al in alerts:
                if al.is_visible():
                    al_text = al.inner_text().strip()
                    if any(k in al_text for k in RATE_LIMIT_KEYWORDS):
                        print(f"\n  ⚠️ [한도 초과 감지] 알림 배너에서 한도 도달 문구가 확인되었습니다: \"{al_text[:80]}...\"")
                        return "RATE_LIMIT"
        except Exception:
            pass

        # 3. 답변이 나왔고 생성이 끝났는데 이미지가 없는 경우 감지
        try:
            responses = page.locator("model-response").all()
            if responses:
                last_resp = responses[-1]
                last_response_text = last_resp.inner_text().strip()

                # 모델의 마지막 답변 내 한도 도달/재설정 안내 문구 확인
                if any(k in last_response_text for k in RATE_LIMIT_KEYWORDS):
                    summary_txt = last_response_text.replace("\n", " ")[:80]
                    print(f"\n  ⚠️ [한도 초과 감지] 모델 응답에서 한도 도달 문구가 확인되었습니다: \"{summary_txt}...\"")
                    return "RATE_LIMIT"

                if len(last_response_text) > 10 and is_generation_finished(page):
                    time.sleep(2)
                    res_data_check = extract_image_base64_from_page(page)
                    if not res_data_check:
                        # 2차 확인: res_data_check 직후 응답 텍스트에 한도 문구가 추가되었는지 확인
                        refreshed_resp_text = last_resp.inner_text().strip()
                        if any(k in refreshed_resp_text for k in RATE_LIMIT_KEYWORDS):
                            summary_txt = refreshed_resp_text.replace("\n", " ")[:80]
                            print(f"\n  ⚠️ [한도 초과 감지] 모델 응답에서 한도 도달 문구가 확인되었습니다: \"{summary_txt}...\"")
                            return "RATE_LIMIT"

                        summary_txt = last_response_text.replace("\n", " ")[:60]
                        print(f"\n  [답변 완료 감지되었으나 이미지 없음]: \"{summary_txt}...\"")
                        return "NO_IMAGE_FINISHED"
        except Exception:
            pass

    return "TIMEOUT"

def format_job_prompt(raw_text):
    """
    프롬프트 정규화:
    이미 완성형 프롬프트인 경우 그대로 사용, 단어만 있는 경우 보정.
    """
    text = raw_text.strip()
    if text.startswith("일러스트풍으로"):
        return text

    return f"일러스트풍으로 {text} 직업을 가진 사람의 모습을 재미있고 생동감 넘치게 그려줘. I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements."

def cleanup_unpadded_duplicates(target_dir):
    """
    혹시 남아있거나 생성된 미패딩 파일(0.txt, 1.png 등)을 제거하여 중복 생성 방지
    5자리 0-패딩 규격(00000.txt ~ 01000.txt / 00000.png ~ 01000.png)만 엄격히 유지
    """
    try:
        if not os.path.exists(target_dir):
            return
        for f in os.listdir(target_dir):
            if re.match(r'^\d{1,4}\.(txt|png)$', f):
                p = os.path.join(target_dir, f)
                try:
                    os.remove(p)
                    print(f"  🧹 [중복 방지 삭제] {f} 제거 완료")
                except Exception:
                    pass
    except Exception as e:
        print(f"  [경고] 미패딩 중복 파일 정리 중 오류: {e}")

def run_automation():
    failed_set = set()

    # 작업 시작 전 미패딩 파일 중복 청소
    cleanup_unpadded_duplicates(JOBS_DIR)

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
    print(" [Gemini Jobs 0~1000 무인 직업 이미지 자동 생성기 v1.0]")
    print(f" - 대상 폴더: {JOBS_DIR}")
    print(f" - 실패 스킵: {len(failed_set)}개 제외 중")
    print(f" - 최대 생성 한도: {MAX_GENERATE_COUNT if MAX_GENERATE_COUNT is not None else '무제한 (모든 미생성 이미지)'}")
    print(" - 단일 규격 보장: 00000.png ~ 01000.png (5자리 0-패딩 단일 규격, 중복 생성 완전 차단)")
    print(" - 모델 자동 선택: 매 페이지 로드 및 검색 시 Hydrogen 모델 자동 선택 보장")
    print(" - 스마트 쿼터: 한도 도달 시 /usage 자동 대기")
    print(" - 스마트 우회: 미생성 시 저작권 포인트 우회 2차 프롬프트 재시도")
    print("=" * 60 + "\n")

    with sync_playwright() as p:
        args = [
            "--disable-blink-features=AutomationControlled",
            "--no-first-run",
            "--no-default-browser-check"
        ]

        print("Chrome 브라우저를 시작합니다...")
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
                print(">>> 구글 로그인 확인 완료! 무인 직업 이미지 생성을 시작합니다. <<<\n")
                time.sleep(1)
                m_stat = select_hydrogen_model(page)
                if m_stat == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                break
            print("[로그인 대기] 브라우저 우측 상단 'Sign in'으로 Google 로그인을 완료해주세요...")
            time.sleep(3)

        success_count = 0
        idx = 0

        while True:
            if MAX_GENERATE_COUNT is not None and success_count >= MAX_GENERATE_COUNT:
                print(f"\n[안내] 설정된 최대 생성 수({MAX_GENERATE_COUNT}개)에 도달하여 작업을 정상 종료합니다.")
                break

            missing_files = get_missing_txt_files(failed_set)
            if not missing_files:
                print("\n모든 TXT 파일의 이미지 생성이 완료되었습니다 (또는 남은 파일이 모두 처리됨)!")
                break

            txt_file = missing_files[0]
            txt_path = os.path.join(JOBS_DIR, txt_file)
            base_name = os.path.splitext(txt_file)[0]
            dst_png = os.path.join(JOBS_DIR, base_name + ".png")
            idx += 1

            with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
                raw_prompt = f.read().strip()
                original_prompt = format_job_prompt(raw_prompt)

            print("-" * 60)
            print(f"[진행 {idx} / 남은 {len(missing_files)}개] {txt_file} ➡️ {base_name}.png")
            print(f"프롬프트: {original_prompt[:90]}...")

            try:
                page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
                time.sleep(2)
                m_stat = select_hydrogen_model(page)
                if m_stat == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                    continue
            except Exception:
                pass

            # 1차 시도 (원문 프롬프트)
            try:
                send_stat = send_prompt(page, original_prompt)
                if send_stat == "RATE_LIMIT":
                    check_and_wait_usage_limit(page)
                    continue
                print("1차 프롬프트 전송 완료. 응답 및 이미지 생성 대기 중...")
            except Exception as e:
                print(f"입력 전송 오류 ({txt_file}): {e}")
                time.sleep(2)
                continue

            status = wait_and_save_image(page, dst_png, max_wait=45)

            if status == "RATE_LIMIT":
                check_and_wait_usage_limit(page)
                continue

            # 2차 시도: 답변 완료 후 이미지 미생성 또는 타임아웃 감지 시 우회 프롬프트
            if status in ["NO_IMAGE_FINISHED", "TIMEOUT"]:
                print(f"\n💡 [답변 완료 후 이미지 미생성 감지 ({status})] 2차 우회 요청을 전송합니다...")
                retry_prompt = f"저작권 걸리지 않는 선에서 직업의 핵심 포인트만 잡아서 재미있고 생동감 넘치는 일러스트풍 그림으로 그려줘: {original_prompt}"
                try:
                    send_stat2 = send_prompt(page, retry_prompt)
                    if send_stat2 == "RATE_LIMIT":
                        check_and_wait_usage_limit(page)
                        continue
                    print(f"2차 우회 프롬프트 전송 완료: '{retry_prompt[:90]}...'")
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
                sz = os.path.getsize(dst_png) if os.path.exists(dst_png) else 0
                print(f"  -> 파일 크기: {sz:,} bytes (생성 성공: {dst_png})\n")
            else:
                print(f"❌ {txt_file} 생성 최종 실패 (1차 및 2차 우회 모두 미생성). 다음 파일로 스킵합니다.\n")
                failed_set.add(txt_file)
                try:
                    with open(FAILED_LOG_PATH, "a", encoding="utf-8") as f:
                        f.write(f"{txt_file}\t{datetime.now().isoformat()}\n")
                except Exception:
                    pass

            time.sleep(2)

        print("\n" + "=" * 60)
        print(f"모든 작업이 종료되었습니다! 총 성공: {success_count}개 / 스킵된 실패: {len(failed_set)}개")
        print("=" * 60)
        context.close()

if __name__ == "__main__":
    run_automation()
