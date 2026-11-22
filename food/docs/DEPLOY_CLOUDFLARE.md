# Cloudflare Workers + Static Assets 배포 가이드 (food.tellmyname.app)

오늘 뭐 먹지? (Mukbang) 서비스는 **Cloudflare Workers + Static Assets** 단일 아키텍처로 운영됩니다. Edge Worker에서 동적 SSR 및 14개 언어 다국어 SEO 메타데이터와 XML 사이트맵을 서빙하고, 401개 고화질 웹 일러스트(WebP & JPG) 및 i18n 번들을 Cloudflare 전세계 엣지 CDN에서 초고속으로 캐싱 서빙합니다.

---

## 1. 아키텍처 개요

- **Edge Worker (`worker.js`)**:
  - 실시간 JSA-FoodHash 결정론적 추천 (`/`, `/name/:name`, `/api/recommend`)
  - 401개 음식 상세 SSR (`/food/{code}?lang={lang}`)
  - 일러스트 도감 SSR (`/gallery?lang={lang}`)
  - 동적 XML 사이트맵 인덱스 & 하위 사이트맵 4종 (`/sitemap.xml`, `/sitemap-pages.xml`, `/sitemap-foods.xml` 5,614개 URL, `/sitemap-images.xml`, `/sitemap-names.xml`)
  - 크롤러 지원 파일 (`/robots.txt`, `/{INDEXNOW_KEY}.txt`)
- **Static Assets (`dist/`)**:
  - `dist/index.html`, `dist/css/*`, `dist/js/*`
  - `dist/images/web/*.webp` (768px 화면/도감용) & `*.jpg` (1200×630 OG/소셜 공유용)
  - `dist/i18n/foods/*.json` (14개 언어 음식 번역 번들)
  - 총 정적 빌드 용량: **약 105MB** (Cloudflare Workers 150MB 한도 내 안전)

---

## 2. Cloudflare 대시보드 자동 배포 (Git 연동)

Cloudflare 대시보드에서 GitHub 저장소를 연결하여 푸시 시마다 자동 빌드 및 배포할 수 있습니다.

### 단계별 설정:
1. **Cloudflare 대시보드 로그인**:
   - [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인합니다.
2. **Workers & Pages 이동**:
   - 좌측 메뉴에서 **Compute (Workers) -> Workers & Pages**를 선택합니다.
3. **애플리케이션 생성**:
   - **Create** 버튼을 클릭하고 **Import from Git** 탭을 선택합니다.
   - GitHub 계정을 인증하고 저장소 `bsj805/food`를 선택합니다.
4. **빌드 및 배포 설정 입력**:
   - **Project Name**: `mukbang`
   - **Production Branch**: `main`
   - **Framework Preset**: `None`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Deploy Command**:
     ```bash
     npx wrangler deploy
     ```
   - **Root Directory**: `/` (기본값)
5. **저장 및 배포 (Save and Deploy)** 클릭:
   - 빌드가 완료되면 Cloudflare 엣지에 즉시 배포됩니다.

---

## 3. 커스텀 도메인 설정 (`food.tellmyname.app`)

1. Cloudflare Workers 대시보드에서 `mukbang` Worker를 클릭합니다.
2. **Settings** -> **Domains & Routes** 탭으로 이동합니다.
3. **Custom Domains** 영역에서 **Add Custom Domain** 버튼을 클릭합니다.
4. 도메인 입력:
   - `food.tellmyname.app`
5. **Add Domain** 클릭:
   - Cloudflare DNS에 CNAME 레코드와 전세계 SSL/TLS 인증서가 자동 프로비저닝됩니다.

---

## 4. 로컬 CLI 직접 배포 (npx wrangler deploy)

로컬 터미널에서 즉시 배포할 수도 있습니다.

### 1) 사전 준비 및 검증
```powershell
# 1. 의존성 및 정적 빌드
npm run build

# 2. 테스트 스위트 전체 검증
npm test
```

### 2) 드라이 런 (Dry Run) 검증
```powershell
npx wrangler deploy --dry-run --outdir .wrangler-dry
```

### 3) 프로덕션 배포
```powershell
npm run deploy
# 또는
npx wrangler deploy
```

배포 완료 시 터미널에 다음과 같이 출력됩니다:
```
Uploaded mukbang (assets: 845 files, total: 104.97 MB)
Deployment complete!
https://food.tellmyname.app
```

---

## 5. R2 에셋 동기화 (선택 사항)

Cloudflare R2 버킷에 고화질 원본 이미지들을 별도로 백업하거나 CDN 오리진으로 사용하려면 제공된 동기화 스크립트를 사용합니다.

```powershell
# 1. 드라이 런 테스트 (파일 5개 모의 업로드)
node scripts/upload_to_r2.mjs --dry-run --limit=5

# 2. 전체 802개 WebP/JPG 이미지 R2 동기화
node scripts/upload_to_r2.mjs
```

- **R2 Endpoint**: `https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com`
- **Bucket**: `mukbang-foods`

---

## 6. 배포 후 검증 체크리스트

- [ ] 메인 홈 접속: `https://food.tellmyname.app/`
- [ ] 다국어 홈 접속: `https://food.tellmyname.app/?lang=ja`
- [ ] 음식 상세 SSR: `https://food.tellmyname.app/food/00116?lang=ja`
  - `<title>`에 일본어 번역명, 영어명, 한국어 원명 포함 여부
  - `hreflang` 15개 태그 정상 렌더링
  - Schema.org Recipe JSON-LD 구조화 데이터 확인
- [ ] 일러스트 도감 SSR: `https://food.tellmyname.app/gallery`
- [ ] 사이트맵 인덱스: `https://food.tellmyname.app/sitemap.xml`
- [ ] 음식 사이트맵 (5,614 URL): `https://food.tellmyname.app/sitemap-foods.xml`
- [ ] 이미지 사이트맵 (401 URL): `https://food.tellmyname.app/sitemap-images.xml`
- [ ] 크롤러 규약: `https://food.tellmyname.app/robots.txt`
