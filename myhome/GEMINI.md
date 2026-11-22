# Workspace Rule: 한국어 게시 전 필수 AI 문체 교정·검증 (Korean Humanizer Gate)

- 본 프로젝트(`myhome`)에서 한국어 텍스트(`web/*.html`, `public/*.html`, `data/chunks/*.json`, `src/lib/i18n.js` 등)를 생성·수정하거나 배포하기 전에는 반드시 `korean-humanizer` 스킬(`.agents/skills/korean-humanizer/SKILL.md` 또는 `C:\Users\USER\.gemini\config\skills\korean-humanizer\SKILL.md`)을 통해 윤문하고, 아래 검증 스크립트로 **Grade A 또는 B (S1 = 0건)**를 통과해야 합니다:
  ```powershell
  python "C:\Users\USER\.gemini\config\skills\korean-humanizer\scripts\verify_korean.py" "<파일_또는_폴더_경로>"
  ```
