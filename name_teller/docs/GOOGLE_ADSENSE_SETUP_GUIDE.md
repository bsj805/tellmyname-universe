# 구글 애드센스 연동 및 설정 가이드 (Google AdSense Setup Guide)

이 문서는 `name_teller` 프로젝트에 **구글 애드센스(Google AdSense)**를 연동하고, 심사 승인을 통과하기 위한 필수 요건(애드센스 설정, `ads.txt`, 법적 페이지, CLI 설정 도구)을 설명합니다.

---

## 1. Google AdSense 연동 원리 (`ca-pub-...` 및 Slot ID)
- 애드센스는 유료 API Key 방식이 아니라, **Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)**와 각 광고 유닛별 **Slot ID**를 웹페이지 HTML 태그(`script` 및 `<ins class="adsbygoogle">`)에 삽입하여 작동합니다.
- `config/adsense.config.json`에서 전역 Publisher ID와 광고 슬롯 ID들을 일괄 관리하며, 정적 빌드 시 모든 랜딩 페이지와 웹앱에 자동 반영됩니다.

---

## 2. 주요 설정 파일 및 도구

1. **설정 파일 (`config/adsense.config.json`)**:
   - `publisherId`: 구글 애드센스 퍼블리셔 ID (`ca-pub-...`)
   - `slots`: 상단 배너, 본문, 채팅 인피드, 릴스 인피드, 멀티플렉스 광고 슬롯 ID 매핑.
   - `contactEmail`: 운영자 연락처.

2. **CLI 설정 도구 (`scripts/configure_adsense.mjs`)**:
   - 터미널에서 아래 명령어를 실행하여 퍼블리셔 ID와 광고 슬롯 ID를 손쉽게 업데이트할 수 있습니다:
     ```powershell
     npm run adsense:set -- ca-pub-XXXXXXXXXXXXXXXX 1000000001 1000000002 1000000003 1000000004
     ```
   - 이 명령어는 자동으로 `config/adsense.config.json`과 `public/ads.txt`(`dist/ads.txt`)를 업데이트합니다.

3. **승인 심사 필수 법적 페이지 (`public/privacy.html`, `public/terms.html`)**:
   - **개인정보처리방침 (`/privacy.html`)**:
     - Google 및 제3자 광고 공급업체가 쿠키(DoubleClick DART 쿠키 등)를 사용하여 사용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 게재한다는 공지.
     - 사용자가 [Google 광고 설정](https://www.google.com/settings/ads) 및 [www.aboutads.info](https://www.aboutads.info)에서 맞춤형 광고를 해제(Opt-out)할 수 있다는 안내.
     - 익명편지함 365일 보관 주기 및 자동 파기 정책 명시.
     - 운영자 이메일 (`bsj805@users.noreply.github.com`).
   - **서비스 이용약관 (`/terms.html`)**:
     - 서비스 이용조건, 익명편지함 건전 이용 수칙, 면책조항.

4. **정적 빌드 (`scripts/generate_static_site.mjs`)**:
   - `npm run generate` 실행 시 `config/adsense.config.json`을 읽어:
     - `dist/ads.txt` 생성
     - `dist/privacy.html`, `dist/terms.html` 복사
     - 모든 `/name/[이름]/index.html`에 `<meta name="google-adsense-account" content="...">`, 애드센스 자바스크립트 SDK, `<ins class="adsbygoogle">` 광고 유닛, 그리고 하단 법적 페이지 푸터 링크를 자동 삽입합니다.
