# Global & Workspace Rules: 한국어 게시 전 필수 AI 문체 교정·검증 (Korean Humanizer Gate)

1. **한국어 콘텐츠 작성 및 게시 전 필수 검증 (`korean-humanizer` 스킬 강제 적용)**
   - 한국어가 포함된 웹페이지(`.html`), 데이터 청크(`.json`), UI 다국어 사전(`i18n.js`), 블로그/가이드 문서(`.md`), 메타 태그 등을 작성·수정하거나 배포(게시)하기 전에는 **반드시 `korean-humanizer` 스킬**(`C:\Users\USER\.gemini\config\skills\korean-humanizer\SKILL.md`)의 지침을 적용해야 합니다.
   - 게시·커밋 전에 반드시 자동 검증 스크립트를 실행하여 **Grade A 또는 B (S1 결정적 AI 흔적 0건)** 판정을 확인해야 합니다:
     ```powershell
     python "C:\Users\USER\.gemini\config\skills\korean-humanizer\scripts\verify_korean.py" "<대상_파일_경로>"
     ```
2. **절대 금지 한국어 AI 패턴 (S1 Zero-Tolerance)**
   - 이중 피동 (`~되어지다`, `~보여지다`, `~쓰여지다`, `~여겨지다`)
   - 영문 `have` 직역 (`의미를 가지다`, `중요성을 가지고 있다`) 및 번역투 전치사 (`~함에 있어서`, `~에 있어서`, 비교 대상 없는 `보다 ~한`)
   - 산문 내 긴 줄표(`—`, `–`) 남용 및 연결어미(`-고,`, `-며,`, `-지만,`, `-면서,`) 직후의 기계적 쉼표 도배
   - AI 상투 결산어 및 Hype 어휘 군집 (`결론적으로`, `시사하는 바가 크다`, `다채로운`, `혁신적인`, `독보적인`, `자리매김하다`, `방증하다`, `~의 향연`, `~인 것이다`)
