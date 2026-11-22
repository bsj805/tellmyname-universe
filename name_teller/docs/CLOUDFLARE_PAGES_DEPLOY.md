# Cloudflare Pages 배포 및 운영 가이드

본 문서는 **「이름을 설명해드립니다」** 서비스를 Cloudflare Pages의 글로벌 엣지 네트워크를 통해 $0의 무서버(Serverless) 비용으로 배포하고 운영하는 전체 절차를 안내합니다.

---

## 1. Cloudflare Pages 연동 절차

### 1) GitHub 레포지토리 연결
1. [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인합니다.
2. 좌측 메뉴에서 **Workers & Pages** → **Create application**을 선택합니다.
3. 상단 탭에서 **Pages**를 클릭하고 **Connect to Git** 버튼을 누릅니다.
4. 비공개(Private) 저장소 `name_teller` (또는 해당 GitHub 계정의 저장소)를 선택합니다.

### 2) 빌드 설정 (Build settings)
| 항목 | 설정값 |
| :--- | :--- |
| **Framework preset** | `None` |
| **Build command** | `node scripts/generate_static_site.mjs` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (기본값) |

> Cloudflare Pages는 `wrangler.toml`의 `pages_build_output_dir = "dist"` 설정을 자동으로 인식합니다.

### 3) 환경 변수 설정 (Environment variables)
**Settings** → **Environment variables** 메뉴에서 프로덕션(Production) 및 프리뷰(Preview) 환경 변수를 등록합니다:

| 변수명 | 설명 | 예시값 |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | GitHub Fine-grained Personal Access Token (Issues: Read and write 권한 필요) | `github_pat_...` |
| `GITHUB_REPO` | 익명편지 및 검색 큐를 보관할 GitHub 레포지토리 | `bsj805/name_teller` |
| `QUEUE_ISSUE_NUMBER` | 대기열 이슈 번호 | `7` |
| `SITE_ORIGIN` | 정적 사이트 기본 URL (캐노니컬, sitemap 생성용) | `https://name-teller.pages.dev` 또는 커스텀 도메인 |

> **GitHub Fine-grained Token 발급 팁**:  
> GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token  
> - Repository access: `Only select repositories` → `name_teller` 선택  
> - Permissions: **Issues** → `Access: Read and write` 선택

---

## 2. Functions 및 라우팅 아키텍처

- **정적 자산 배포 (`dist/`)**:
  - `dist/index.html`: 메인 단일 페이지 웹앱 (SPA)
  - `dist/name/{name}/index.html`: 상위 300개 인기 이름의 초경량 pSEO 랜딩 페이지
  - `dist/_redirects`: `/name/* /index.html 200` (존재하지 않는 이름 URL 접속 시에도 SPA 200 Fallback)
  - `dist/_headers`: 데이터 캐싱 (`/data/*` 3600초) 및 HTML 최신 보장, 보안 헤더 적용
- **Pages Functions (`functions/api/`)**:
  - `POST /api/letters`: 익명 편지 유효성 검사, URL 자동 제거, IP 레이트 리밋 후 GitHub Issue 댓글로 적재
  - `POST /api/search`: 신규 검색 이름 유효성 검사 및 GitHub Issue 댓글 대기열 등록

---

## 3. 커스텀 도메인 연결 (Custom Domain)

1. Cloudflare Pages 프로젝트 대시보드에서 **Custom domains** 탭을 클릭합니다.
2. **Set up a custom domain**을 누르고 보유한 도메인(예: `nameteller.kr`)을 입력합니다.
3. DNS 레코드가 자동으로 등록되며 무상 SSL/TLS 인증서가 즉시 발급됩니다.
4. 커스텀 도메인 연결 후 환경 변수의 `SITE_ORIGIN` 값을 실제 서비스 도메인(예: `https://nameteller.kr`)으로 변경하고 재배포합니다.

---

## 4. 검색 엔진 등록 (Google Search Console & Naver Search Advisor)

빌드 파이프라인(`node scripts/generate_static_site.mjs`)이 아래 SEO 자산을 자동 생성합니다:
- `sitemap.xml`: 메인 페이지, 이용약관/개인정보처리방침, 전체 이름 색인
- `sitemap-surnames.xml`: 주요 성씨 23종 × 인기 이름 100종 결합 색인
- `robots.txt`: 검색 봇 수집 규칙 및 sitemap 위치 공지
- `rss.xml`: 최신 이름 피드

### 등록 방법:
1. **Google Search Console**:
   - 도메인 또는 URL 접두사 등록 후 소유권 확인
   - **Sitemaps** 메뉴에 `sitemap.xml` 및 `sitemap-surnames.xml` 제출
2. **Naver Search Advisor (네이버 서치어드바이저)**:
   - 사이트 등록 후 소유권 확인
   - **요청** → **사이트맵 제출**: `sitemap.xml` 제출
   - **요청** → **RSS 제출**: `rss.xml` 제출

---

## 5. 일일 자동 배치 (GitHub Actions)

`.github/workflows/daily_batch_deploy.yml` 워크플로우가 매일 한국시간 자정(00:00 KST, UTC 15:00)에 실행됩니다:
1. Issue #7에 접수된 익명 편지 및 검색 큐 수집
2. `data/messages/YYYY-MM-DD.json` 기록 및 365일 롤링 보관 적용
3. `data/searched_names_queue.json`에 미등록 검색 이름 큐잉
4. 변경된 `data/` 디렉토리를 `main` 브랜치에 자동 커밋 & 푸시
5. Cloudflare Pages의 Git 통합에 의해 최신 데이터로 자동 빌드 및 배포 완료
