# Cloudflare Workers & Static Assets 배포 가이드 (Cloudflare Workers & Pages)

> **최신 클라우드플레어 공식 권장 규격**: 2024~2026년 기준 기존의 독립형 **Cloudflare Pages(Legacy)** 방식은 단계적으로 축소되고 있으며, 정적 웹 애셋과 풀스택 서버리스 연산을 하나로 통합한 **Cloudflare Workers with Static Assets (Workers & Pages)** 가 공식 표준입니다.
> 본 문서는 `myhome` 서비스(`myhome.tellmyname.app`)를 Cloudflare Workers & Static Assets 환경에 무장애로 배포하고, Cloudflare R2 스토리지와 연동하는 방법을 상세히 안내합니다.

---

## 1. 아키텍처 개요 (Workers with Static Assets)

```
[사용자 브라우저 / 검색 엔진 크롤러 (Yeti, Googlebot)]
                    │
                    ▼
     [Cloudflare Edge Worker (worker.js)]
       ├── 14개 다국어 Edge Dynamic SSR (Programmatic SEO)
       ├── 동일 도메인 R2 CDN 라우터 (/r2/houses/*.webp, *.png)
       └── REST API 엔드포인트 (/api/house, /api/name, /api/level-name)
          ├── [정적 자산 요청 (/css, /js, index.html)] ➔ env.ASSETS (dist/)
          └── [고화질 주택 이미지 요청] ➔ env.MYHOME_R2 (Cloudflare R2 Bucket)
```

- **Zero-File-Explosion 아키텍처**: 50,000명 이름 및 500개 주택 레벨 페이지를 정적 HTML 파일 50,000개로 사전 생성하지 않고, `worker.js`가 엣지에서 실시간 동적 SSR로 렌더링합니다. 빌드 디렉토리(`dist/`) 내 총 파일 수는 45개로 엄격히 유지됩니다.
- **동일 도메인 R2 CDN**: 별도의 외부 R2 서브도메인을 거치지 않고, `https://myhome.tellmyname.app/r2/houses/00074.webp` 형태로 동일 도메인에서 브라우저 캐싱(`Cache-Control: public, max-age=31536000, immutable`)을 보장합니다.

---

## 2. Cloudflare 대시보드 설정 (Dashboard Settings)

Cloudflare 대시보드 로그인 후 **Workers & Pages** 메뉴로 이동합니다.

### 2.1 애플리케이션 생성
1. **Workers & Pages** -> **Create application** 클릭
2. **Workers** 탭 선택 (Pages 탭 대신 Workers 탭을 선택합니다)
3. 서비스 이름을 `myhome`으로 설정

### 2.2 빌드 & 배포 설정 (CI/CD Git 연동 시)
GitHub 저장소 연동 시 아래 필드를 그대로 입력합니다:

| 설정 항목 (Field) | 권장 입력값 (Value) | 설명 |
| :--- | :--- | :--- |
| **Framework preset** | `None` (Custom) | 프레임워크 프리셋 없음 |
| **Root directory** | `/` | 프로젝트 최상위 루트 디렉토리 |
| **Build command** | `npm run build` | `node scripts/generate_static_site.mjs` 실행 |
| **Deploy command** | `npx wrangler deploy` | Worker 및 정적 자산 일괄 배포 |
| **Build output directory** | *(비워두거나 `./dist`)* | `wrangler.toml`의 `[assets] directory = "./dist"`가 자동 우선 적용 |

---

## 3. `wrangler.toml` 설정 규격

프로젝트 루트의 `wrangler.toml` 파일에 정적 자산 바인딩과 R2 버킷 바인딩이 정의되어 있습니다.

```toml
name = "myhome"
main = "worker.js"
compatibility_date = "2026-10-01"

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "single-page-application"
html_handling = "auto-trailing-slash"
run_worker_first = true

[[r2_buckets]]
binding = "MYHOME_R2"
bucket_name = "myhome-houses-r2"
```

- `run_worker_first = true`: 모든 HTTP 요청이 먼저 `worker.js`를 거칩니다. 이를 통해 `/name/:name` 및 `/level/:level`에 대한 실시간 동적 14개 국어 SSR 및 검색엔진 메타태그 주입이 완벽하게 동작합니다.
- `binding = "ASSETS"`: `dist/` 내의 정적 파일(CSS, JS 번들, 청크 데이터, robots.txt, sitemap*.xml, ads.txt)을 워커 내부에서 `env.ASSETS.fetch(request)`로 고속 서빙합니다.
- `binding = "MYHOME_R2"`: Cloudflare R2 버킷 `myhome-houses-r2`를 바인딩하여 고화질 대표 실사 주택 이미지를 제공합니다.

---

## 4. 로컬 개발 환경 실행 (Local Dev Server)

로컬 개발 환경에서는 Cloudflare 계정 로그인이나 인터넷 연결 없이도 로컬 파일 시스템에서 즉시 이미지를 로드하여 100% 동일하게 시뮬레이션할 수 있습니다.

```bash
# 정적 사이트 빌드 (dist/ 생성)
npm run build

# 로컬 Dev Server 실행 (포트 8788)
npm run dev
# 또는
node scripts/dev_server.mjs
```

### 로컬 이미지 우선 탐색 순서
`scripts/dev_server.mjs`는 로컬 구동 시 이미지를 다음 순서로 탐색하여 서빙합니다:
1. `G:\My Drive\new_houses\{padded}.png` (최우선)
2. `G:\My Drive\new_houses\{padded}.webp`
3. `G:\My Drive\houses\{padded}.png`
4. `G:\My Drive\houses\{padded}.webp`
5. `dist/` 및 `data/` 로컬 폴더
6. R2 및 로컬에 이미지가 없는 경우 Edge SVG 렌더러로 자동 폴백

---

## 5. Cloudflare R2 주택 이미지 대량 업로드 가이드

`G:\My Drive\new_houses`에 수집된 실사 주택 이미지들을 Cloudflare R2 버킷(`myhome-houses-r2`)으로 업로드하는 방법입니다.

### 5.1 사전 준비: Cloudflare API 토큰 설정
터미널에서 Cloudflare API Token을 환경변수로 설정하거나 Wrangler로 로그인합니다:
```bash
# Wrangler CLI 로그인
npx wrangler login

# 또는 API Token 환경변수 주입 (Windows PowerShell)
$env:CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
```

### 5.2 업로드 시뮬레이션 (Dry-Run)
실제 네트워크 업로드 전, 10개 샤드(0..9) 분할 및 명령어 생성을 검증합니다:
```bash
node scripts/upload_r2_images.mjs --source=gdrive --dry-run
```
출력 결과는 `data/r2_upload_summary.json`에 기록됩니다.

### 5.3 실제 R2 업로드 실행 (Live Upload)
```bash
node scripts/upload_r2_images.mjs --source=gdrive --upload
```
특정 샤드 또는 레벨 범위만 분할 업로드할 수도 있습니다:
```bash
# 0번 샤드 (0~49레벨)만 업로드
node scripts/upload_r2_images.mjs --source=gdrive --shard=0 --upload

# 특정 레벨 범위 지정 업로드 (예: 100~200)
node scripts/upload_r2_images.mjs --source=gdrive --start=100 --end=200 --upload
```

---

## 6. 프로덕션 배포 명령 (Deploy Command)

빌드 후 단 한 줄의 명령어로 Cloudflare Workers에 배포할 수 있습니다:

```bash
# 1. 정적 사이트 빌드
node scripts/generate_static_site.mjs

# 2. Cloudflare Workers with Static Assets 배포
npx wrangler deploy
```

배포 완료 시 배포 URL(`https://myhome.<your-subdomain>.workers.dev` 또는 커스텀 도메인 `https://myhome.tellmyname.app`)로 즉시 전 세계 엣지 네트워크에 배포됩니다.

---

## 7. 배포 후 SEO 및 애드센스 검증 체크리스트

1. **Google AdSense 승인용 `ads.txt` 확인**:
   - `https://myhome.tellmyname.app/ads.txt` 접속 시 아래 내용이 반환되는지 확인:
     ```
     google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0
     ```
2. **Google Image Sitemap 및 사이트맵 확인**:
   - `https://myhome.tellmyname.app/sitemap.xml` 접속 -> `sitemap-main.xml`, `sitemap-images.xml`, `sitemap-names-1.xml`, `sitemap-names-2.xml` 인덱싱 확인
   - `https://myhome.tellmyname.app/sitemap-images.xml`에서 500개 레벨 주택 이미지 태그(`image:image`, `image:loc`, `image:title`, `image:caption`) 확인
3. **14개 언어 동적 SSR 메타태그 및 hreflang 확인**:
   - `https://myhome.tellmyname.app/level/170?lang=en` 접속 시 영어 `<title>`, `<html lang="en">`, hreflang 14종, AdSense 스크립트 주입 확인
4. **이미지 SEO 인덱싱 확인**:
   - SSR 마크업 내 `<figure class="seo-house-figure">`의 `<img>` 태그에 `{name} house recommendation`, `{name} house image` alt 및 title 속성 적용 여부 확인
