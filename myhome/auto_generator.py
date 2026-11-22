import os
import sys
import time
import base64
import re
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# 대상 디렉토리 결정 (명령행 인자 우선, 기본값: G:\My Drive\new_houses)
if len(sys.argv) > 1 and sys.argv[1].strip():
    HOUSES_DIR = sys.argv[1].strip().strip('"').strip("'")
else:
    HOUSES_DIR = r"G:\My Drive\new_houses"

USER_DATA_DIR = os.path.join(os.environ.get("USERPROFILE", "."), ".gemini", "gemini_chrome_profile")
FAILED_LOG_PATH = os.path.join(HOUSES_DIR, "failed_images.log")
os.makedirs(USER_DATA_DIR, exist_ok=True)

# 텍스트 답변이 끝났는지(생성 버튼이 복귀하거나 입력창이 활성화되었는지) 확인하는 헬퍼
def is_generation_finished(page):
    """
    Gemini 응답 생성이 완료되었는지 감지:
    1. 전송/중지 버튼 상태: '중지'/'Stop' 버튼이 없고 전송 버튼이 활성화되어 있는지
    2. 입력창(.ql-editor)이 활성화되어 있는지
    """
    try:
        # 중지 버튼(Stop streaming)이 떠있으면 아직 생성 중
        stop_btn = page.locator("button[aria-label*='Stop'], button[aria-label*='중지'], button.stop-button")
        for btn in stop_btn.all():
            if btn.is_visible():
                return False
    except Exception:
        pass

    try:
        # 전송 버튼이 보이고 클릭 가능한 상태이거나 입력창이 비활성화 상태가 아니면 완료
        editor = page.locator(".ql-editor").last
        if editor.is_visible():
            return True
    except Exception:
        pass

    return True

def natural_sort_key(filename):
    """숫자 기준 자연스러운 순차 정렬 (00049 -> 00050)"""
    nums = re.findall(r'\d+', filename)
    return int(nums[0]) if nums else filename

def get_missing_txt_files(failed_set):
    if not os.path.exists(HOUSES_DIR):
        print(f"오류: 폴더를 찾을 수 없습니다: {HOUSES_DIR}")
        return []
    
    files = set(os.listdir(HOUSES_DIR))
    txts = sorted([f for f in files if f.lower().endswith('.txt')], key=natural_sort_key)
    missing = []
    for t in txts:
        base = os.path.splitext(t)[0]
        png_name = base + ".png"
        if png_name not in files and t not in failed_set:
            missing.append(t)
    return missing

def parse_reset_time_to_seconds(text):
    now = datetime.now()
    
    rel_m = re.search(r'(\d+)\s*시간(?:\s*(\d+)\s*분)?', text)
    if rel_m:
        hours = int(rel_m.group(1))
        mins = int(rel_m.group(2)) if rel_m.group(2) else 0
        return hours * 3600 + mins * 60
        
    rel_min_only = re.search(r'(\d+)\s*분\s*(?:후에|남음)', text)
    if rel_min_only:
        return int(rel_min_only.group(1)) * 60

    rel_en = re.search(r'(\d+)\s*(?:hours?|h)(?:\s*(?:and\s*)?(\d+)\s*(?:minutes?|mins?|m))?', text, re.IGNORECASE)
    if rel_en:
        hours = int(rel_en.group(1))
        mins = int(rel_en.group(2)) if rel_en.group(2) else 0
        return hours * 3600 + mins * 60

    ko_time = re.search(r'(오전|오후)\s*(\d{1,2})(?:[:시]\s*(\d{1,2}))?', text)
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

    en_time = re.search(r'(\d{1,2}):(\d{2})\s*(AM|PM)', text, re.IGNORECASE)
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

    h24_time = re.search(r'\b([01]?\d|2[0-3]):([0-5]\d)\b', text)
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
        return True
    except Exception as e:
        print(f"Usage 확인 오류: {e}. 5분 후 재시도합니다.")
        time.sleep(300)
        return False

def extract_image_base64_from_page(page):
    js_extract = """
    () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        for (let i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            const w = img.naturalWidth || img.width || 0;
            const h = img.naturalHeight || img.height || 0;
            const src = img.src || '';
            
            if (src.includes('googlelogo') || src.includes('photo.jpg') || src.includes('avatar')) {
                continue;
            }
            
            if (w >= 200 && h >= 200) {
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

def send_prompt(page, prompt_text):
    """프롬프트를 확실하게 입력하고 전송 버튼 또는 Enter를 눌러 전송 보장"""
    editor = page.locator(".ql-editor").last
    editor.wait_for(state="visible", timeout=10000)
    editor.click()
    time.sleep(0.2)
    
    # 텍스트 입력 및 변경 이벤트 유도
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

def wait_and_save_image(page, dst_png, max_wait=50):
    """
    이미지 생성을 기다리고 저장.
    개선 핵심:
    1. 이미지가 나오면 즉시 SAVED 반환.
    2. 쿼터 한도 초과 시 RATE_LIMIT 반환.
    3. [핵심] '저작권' 키워드 여부와 상관없이,
       모델의 답변(텍스트)이 출력되었고 + 출력이 끝났는데(스트리밍 종료) + 이미지가 없다면 ➜ 'NO_IMAGE_FINISHED' 즉시 반환!
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
            download_btns = page.locator("button[aria-label*='다운로드'], button[aria-label*='Download'], a[aria-label*='다운로드'], a[aria-label*='Download']").all()
            for btn in download_btns:
                if btn.is_visible():
                    try:
                        with page.expect_download(timeout=4000) as download_info:
                            btn.click()
                        download = download_info.value
                        download.save_as(dst_png)
                        print(f"✔ [다운로드 버튼 성공] 저장 완료: {dst_png}")
                        return "SAVED"
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
                print(f"✔ [캔버스 추출 성공] 저장 완료: {dst_png}")
                return "SAVED"
            elif res_data.startswith("SRC:"):
                img_url = res_data[4:]
                try:
                    resp = page.request.get(img_url)
                    if resp.status == 200:
                        with open(dst_png, "wb") as f:
                            f.write(resp.body())
                        print(f"✔ [URL 직접 추출 성공] 저장 완료: {dst_png}")
                        return "SAVED"
                except Exception:
                    pass
                    
        # 2. 사용량 한도(Rate limit) 감지
        try:
            body_text = page.inner_text("body")
            if any(k in body_text for k in ["한도에 도달", "너무 많은 요청", "잠시 후 다시", "quota exceeded", "usage limit"]):
                return "RATE_LIMIT"
        except Exception:
            pass

        # 3. [요청 반영 핵심] 답변이 나왔고 생성이 끝났는데 이미지가 없는 경우 감지
        try:
            responses = page.locator("model-response").all()
            if responses:
                last_resp = responses[-1]
                last_response_text = last_resp.inner_text().strip()
                
                # 최소 10글자 이상의 답변 텍스트가 존재하고, 스트리밍이 완료되었는지 확인
                if len(last_response_text) > 10 and is_generation_finished(page):
                    # 3-1초 정도 재확인 (이미지 렌더링 딜레이 방지)
                    time.sleep(2)
                    res_data_check = extract_image_base64_from_page(page)
                    if not res_data_check:
                        summary_txt = last_response_text.replace("\n", " ")[:60]
                        print(f"\n  [답변 완료 감지되었으나 이미지 없음]: \"{summary_txt}...\"")
                        return "NO_IMAGE_FINISHED"
        except Exception:
            pass

    return "TIMEOUT"

def run_automation():
    failed_set = set()
    
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
    print(f" [Gemini Houses 무인 이미지 자동 생성기 v3.2]")
    print(f" - 대상 폴더: {HOUSES_DIR}")
    print(f" - 실패 스킵: {len(failed_set)}개 제외 중")
    print(f" - 스마트 쿼터: 한도 도달 시 /usage 자동 대기")
    print(f" - 스마트 우회: 답변 완료 후 이미지 미생성 시 즉시 2차 우회 프롬프트 자동 전환")
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
            if account_elem.count() > 0:
                print(">>> 구글 로그인 확인 완료! 무인 생성을 시작합니다. <<<\n")
                break
            print("[로그인 대기] 브라우저 우측 상단 'Sign in'으로 Google 로그인을 완료해주세요...")
            time.sleep(3)

        success_count = 0
        idx = 0
        
        while True:
            missing_files = get_missing_txt_files(failed_set)
            if not missing_files:
                print("\n모든 TXT 파일의 이미지 생성이 완료되었습니다 (또는 남은 파일이 모두 완료/처리됨)!")
                break
                
            txt_file = missing_files[0]
            txt_path = os.path.join(HOUSES_DIR, txt_file)
            base_name = os.path.splitext(txt_file)[0]
            dst_png = os.path.join(HOUSES_DIR, base_name + ".png")
            idx += 1
            
            with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
                original_prompt = f.read().strip()
                
            print("-" * 60)
            print(f"[진행 {idx} / 남은 {len(missing_files)}개] {txt_file} ➡️ {base_name}.png")
            print(f"프롬프트: {original_prompt[:90]}...")
            
            try:
                page.goto("https://gemini.google.com/images", wait_until="domcontentloaded")
                time.sleep(2)
            except Exception:
                pass
                
            # 1차 시도 (원문 프롬프트)
            try:
                send_prompt(page, original_prompt)
                print("1차 프롬프트 전송 완료. 응답 및 이미지 생성 대기 중...")
            except Exception as e:
                print(f"입력 전송 오류 ({txt_file}): {e}")
                time.sleep(2)
                continue
                
            status = wait_and_save_image(page, dst_png, max_wait=45)
            
            if status == "RATE_LIMIT":
                check_and_wait_usage_limit(page)
                continue
                
            # [핵심 로직 변경]: 특정 거절 단어가 아니더라도, 답변이 완료되었는데 이미지가 생성되지 않은 경우 (또는 타임아웃/지연)
            if status in ["NO_IMAGE_FINISHED", "TIMEOUT"]:
                print(f"\n💡 [답변 완료 후 이미지 미생성 감지] 기존 프롬프트를 덧붙여 2차 우회 요청을 전송합니다...")
                retry_prompt = f"저작권 걸리지 않는 선에서 포인트만 잡아서 비슷한 이미지로 만들어줘: {original_prompt}"
                try:
                    send_prompt(page, retry_prompt)
                    print(f"2차 우회 프롬프트 전송 완료 (기존 내용 포함): '{retry_prompt[:90]}...'")
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
                print(f"  -> 파일 크기: {sz:,} bytes (성공! 구글 드라이브 동기화 진행)\n")
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
