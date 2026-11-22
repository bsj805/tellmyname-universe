# [Issue #6] `"일러스트풍으로 {음식이름}그려줘"` 프롬프트 시드 생성기 및 `Gemini_foods_이미지자동생성.bat` (`images/` 폴더 자동 저장)

## 1. 개요 및 목적
- `C:\Users\USER\Desktop\Gemini_houses_이미지자동생성.bat` 및 `myhome/auto_generator.py`의 무인 이미지 생성 메커니즘을 음식 프로젝트(`C:\Users\USER\Documents\projects\food`)에 맞게 구축한다.
- 모든 음식에 대해 **`"일러스트풍으로 {음식이름}그려줘"`** 프롬프트가 담긴 `.txt` 파일을 `images/` 폴더에 생성하고, 배치 파일 실행 시 `images/` 폴더 안에 해당 음식의 `.png` 이미지가 자동으로 차곡차곡 쌓이도록 구현한다.

## 2. 핵심 요구사항
1. **프롬프트 TXT 시드 자동 생성 스크립트 (`scripts/generate_prompt_txt_files.mjs`)**
   - `data/foods_master.json`의 모든 음식 항목(`00001` ~ `00NNN`)에 대해 `images/{5자리번호}.txt` (예: `images/00001.txt`)를 생성한다.
   - 파일 내용 규격: 정확히 **`일러스트풍으로 {음식이름}그려줘`** (예: `일러스트풍으로 흙 털어낸 유기농 생당근그려줘`, `일러스트풍으로 미슐랭 3스타 한우 우니 타르타르그려줘`, `일러스트풍으로 급식 피카츄돈까스그려줘`)
2. **Gemini 웹 무인 이미지 자동 생성기 (`auto_generator.py`)**
   - 기본 타겟 디렉토리: `C:\Users\USER\Documents\projects\food\images` (명령줄 인자로 변경 가능)
   - `images/` 폴더 내 `.txt` 파일 중 매칭되는 `.png` 이미지가 아직 없는 항목을 숫자 순서대로 스캔
   - Chrome 영구 프로필(`~/.gemini/gemini_chrome_profile`)로 `https://gemini.google.com/images` 접속
   - `"일러스트풍으로 {음식이름}그려줘"` 프롬프트 자동 입력 및 생성 이미지 추출(`images/00001.png`)
   - 쿼터 한도 도달 시 `/usage` 리셋 대기 및 이미지 미생성 시 우회 재시도(`저작권 걸리지 않는 선에서 포인트만 잡아서 귀여운 일러스트풍으로 그려줘: ...`) 지원
3. **실행용 배치 파일 생성**
   - 프로젝트 루트: `C:\Users\USER\Documents\projects\food\Gemini_foods_이미지자동생성.bat`
   - 바탕화면 바로가기용 동일 스크립트: `C:\Users\USER\Desktop\Gemini_foods_이미지자동생성.bat`
   - 실행 시 엔터만 치면 기본 경로(`C:\Users\USER\Documents\projects\food\images`)로 즉시 동작하여 `images/` 폴더에 이미지가 쌓인다.

## 3. 구현 대상 파일
- `scripts/generate_prompt_txt_files.mjs`
- `auto_generator.py`
- `Gemini_foods_이미지자동생성.bat`
- `C:\Users\USER\Desktop\Gemini_foods_이미지자동생성.bat`
- `tests/test_issue_6_image_generator.mjs`
