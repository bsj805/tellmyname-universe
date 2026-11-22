# Workspace Rule: 한국어 AI 문체 검증 (`korean-humanizer`) & 완성 소프트웨어 웹 QA 검수 (`web-qa-inspector`)

1. **한국어 게시 전 필수 AI 문체 교정·검증 (`korean-humanizer`)**
   - 본 프로젝트에서 한국어 텍스트(`web/*.html`, `public/*.html`, `data/chunks/*.json`, `src/lib/i18n.js`, `README.md` 등)를 생성·수정하거나 배포하기 전에는 반드시 `korean-humanizer` 스킬(`C:\Users\USER\.gemini\config\skills\korean-humanizer\SKILL.md`)을 통해 윤문하고 아래 검증 스크립트로 **Grade A 또는 B (S1 = 0건)**를 통과해야 합니다:
     ```powershell
     python "C:\Users\USER\.gemini\config\skills\korean-humanizer\scripts\verify_korean.py" "<파일_또는_폴더_경로>"
     ```

2. **완성된 웹 소프트웨어 납품·배포 전 필수 QA 검수 (`web-qa-inspector`)**
   - UI, 다국어(`i18n`), 데이터셋, 레이아웃을 수정한 뒤에는 반드시 `web-qa-inspector` 스킬(`.agents/skills/web-qa-inspector/SKILL.md` 또는 `C:\Users\USER\.gemini\config\skills\web-qa-inspector\SKILL.md`)에 따라 정적·다국어 감사 스크립트를 실행하고, 로컬 브라우저에서 **데스크톱(`1280×800`)과 모바일(`390×844`) 뷰포트**, **한국어(`?lang=ko`)와 외국어(`?lang=en` 등, 화면 내 한글 잔존 0건)** 스크린샷을 직접 `read_file`로 육안 검수해야 합니다:
     ```powershell
     python "C:\Users\USER\.gemini\config\skills\web-qa-inspector\scripts\audit_web_qa.py" "c:\Users\USER\Documents\projects"
     ```
