# 정적 호스팅 및 SEO 가이드 (Static Hosting and SEO Guide)

이 문서는 `name_teller` 프로젝트를 **$0의 서버 비용(Serverless / Static Hosting)**으로 Cloudflare Pages 및 GitHub Pages에 배포하고, 구글/네이버 검색 엔진 최적화(SEO)와 GitHub Actions 자동화를 구축한 방법을 설명합니다.

---

## 1. 정적 호스팅 플랫폼 선택 및 아키텍처 ($0 서버 비용)

`name_teller`는 대규모 데이터베이스(7,232개의 시집·문학 시어 및 한자 이름)와 인스타그램 릴스형 스크롤 UI, 365일 채팅형 익명편지함 기능을 **정적 HTML/JS 단일 웹앱(SPA)**과 **개별 SEO 랜딩 페이지(`dist/name/[이름]/index.html`)**로 빌드합니다.

### 추천 플랫폼
1. **Cloudflare Pages / Netlify (강력 추천)**
   - **장점**: 글로벌 CDN 무상 제공, HTTPS 자동 적용, 고속 라우팅.
   - **`_redirects` 파일 활용**: `/dist/_redirects` 파일에 `/name/* /index.html 200` 규칙을 설정하여, 1~5글자의 새로운 이름 검색 URL(`/name/[이름]`)으로 유저가 바로 접속해도 404 에러 없이 싱글 페이지 앱(SPA)이 즉시 로드되어 해당 이름과 익명편지함으로 연결됩니다.
2. **GitHub Pages**
   - **장점**: 무료 GitHub 리포지토리 호스팅과 완벽 연동.
   - **`404.html` SPA Fallback**: GitHub Pages는 동적 라우팅을 지원하지 않으므로, 커스텀 `404.html`에서 `window.location.pathname`을 파싱하여 `/name/([^/]+)` 패턴을 감지한 뒤 `/?name=` + 인코딩된 이름으로 자동 리다이렉트(`window.location.replace`)하여 404 에러를 방지합니다.

---

## 2. 검색 엔진 최적화 (SEO) 및 검색어 등록 가이드

### 생성되는 SEO 자산 (`dist/`)
- **개별 이름 랜딩 페이지 (`/name/[이름]/index.html`)**:
  - **`<title>`**: `[이름] 이름 뜻 확인하기 ("[6~7자 뜻]...") | 이쁜 아기 이름 추천 · 익명편지함`
  - **`<meta name="description">`**: 6~7글자 요약 티저(`...`)와 키워드 (`이쁜 아기 이름 추천, 이름 뜻 확인하기, 익명편지함`) 포함.
  - **Structured Data (JSON-LD)**: `DefinedTerm` 및 `FAQPage` 스키마 적용으로 구글 검색 결과 리치 스니펫 노출 극대화.
- **사이트맵 및 RSS**:
  - `sitemap.xml`: 7,232개의 모든 이름 URL 및 메인 페이지 수록.
  - `rss.xml`: 네이버 서치어드바이저 및 구글 서치콘솔 빠른 수집(Ping)용 최신 피드.
  - `robots.txt`: 검색봇 허용 및 sitemap 경로 안내.

### 검색 엔진 등록 방법
1. **Google Search Console**:
   - 사이트 소유권 확인 후 `sitemap.xml` 제출.
   - 개별 `/name/[이름]/` URL 색인 생성 요청 (URL 검사 도구 활용).
2. **Naver Search Advisor**:
   - 사이트 등록 및 `rss.xml`, `sitemap.xml` 제출.
   - 웹 마스터 도구를 통해 수집 현황 및 로봇 룰 점검.

---

## 3. GitHub Actions 일일 배치 자동화 (`.github/workflows/daily_batch_deploy.yml`)

프로젝트는 매일 12:00 KST(또는 수동 트리거)에 작동하는 GitHub Actions 자동화 워크플로우를 통해 GitHub Issue #7에 접수된 사용자 의견, 새로 검색된 1~5글자 이름, 그리고 365일 보관되는 익명 채팅 메시지를 수집·반영하여 정적 사이트를 재빌드하고 배포합니다.

- **데이터 수집 및 동기화**: 이슈 댓글 및 사용자 상호작용 데이터를 반영하여 `serving_names_db.json` 및 편지함 데이터를 갱신합니다.
- **자동 빌드 & 배포**: `npm run generate` 및 `npm run build`를 실행하여 `dist/` 내의 SEO 페이지와 리다이렉트 설정을 갱신하고 호스팅에 자동 반영합니다.
