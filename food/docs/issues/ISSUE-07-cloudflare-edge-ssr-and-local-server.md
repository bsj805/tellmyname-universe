# [Issue #7] `food.tellmyname.app` Cloudflare Edge SSR 라우터, 로컬 `images/` · R2 이미지 서빙 연동 및 일일 재방문 유도 기능 구현

## 1. 개요 및 목적
- 도메인 `https://food.tellmyname.app` 기준으로 동작하는 Cloudflare Worker Edge SSR(`worker.js`) 및 로컬 개발 서버(`scripts/dev_server.mjs`), 정적 빌드 파이프라인(`scripts/generate_static_site.mjs`)을 구축한다.
- `images/` 폴더에 쌓인 실제 일러스트 `.png`/`.webp` 이미지를 최우선으로 서빙하고, 아직 생성 전인 음식 번호는 음식 카테고리·컬러·아이콘이 반영된 고품질 일러스트풍 SVG 아트워크를 즉시 렌더링하여 빈 이미지(Broken Image)가 절대 발생하지 않도록 보장한다.
- 사용자가 매일 들어오게 만드는 **자정 리셋 실시간 카운트다운 타이머("내일의 새 메뉴 공개까지 HH:MM:SS")** 및 **날짜 이동/내일 미리보기 잠금·공유** 기능을 통합한다.

## 2. 핵심 요구사항
1. **Cloudflare Worker Edge SSR 라우터 (`worker.js` & `wrangler.toml`)**
   - 도메인: `https://food.tellmyname.app`
   - 라우트:
     - `GET /` : 메인 화면 (타임존 감지 및 이름 검색)
     - `GET /name/:name` : 해당 이름의 오늘(접속 타임존 또는 `?date=YYYY-MM-DD`, `?tz=Asia/Seoul`) 5끼 추천 결과 동적 SSR 메타태그(`<title>`, `og:title`, `og:description`, `og:image`, `JSON-LD`) 주입
     - `GET /api/recommend?name=...&date=...&tz=...&hour=...` : 이름 + 날짜 + 타임존 기준 현재 추천 끼니 및 하루 5끼 전체 JSON 응답
     - `GET /api/foods` : 카테고리별 음식 통계 및 전체 목록 조회 API
     - `GET /images/:filename` 및 `GET /r2/foods/:filename` : 로컬 `images/` 폴더(또는 R2 버킷)의 `.png`/`.webp` 서빙 + 미생성 시 일러스트 SVG 자동 생성 응답
2. **로컬 Dev Server (`scripts/dev_server.mjs`)**
   - `C:\Users\USER\Documents\projects\food\images` 내의 `.png`/`.webp` 파일을 실시간 감지하여 서빙
   - `npm run dev` 실행 시 로컬에서 Worker SSR + API + 정적 에셋 100% 에뮬레이션

## 3. 구현 대상 파일
- `worker.js`
- `wrangler.toml`
- `src/lib/illustration_svg.js`
- `scripts/dev_server.mjs`
- `scripts/generate_static_site.mjs`
- `tests/test_issue_7_worker_ssr.mjs`
