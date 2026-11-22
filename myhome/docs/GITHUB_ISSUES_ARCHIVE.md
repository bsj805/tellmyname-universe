# 📋 MyHome GitHub Issues Archive (#1 ~ #17)

> **Repository**: [bsj805/myhome](https://github.com/bsj805/myhome)  
> **Last Updated**: 2026-11-02T03:01:00.000Z  
> **Total Tracked Issues**: 17 (Closed: 8, Open: 9)

본 문서는 `myhome` 프로젝트의 과거 및 신규 구현 기능 이슈(#1 ~ #17)의 전체 내역을 영구 보존하고, 프로젝트 아키텍처 의사결정 기록(ADR)과 상호 참조하기 위한 공식 아카이브 문서입니다.

## 📑 Issues Summary Table

| # | 상태 (State) | 제목 (Title) | 등록 일시 (Created At) | 링크 (Link) |
| :---: | :---: | :--- | :---: | :---: |
| #1 | 🟣 CLOSED | [[Feature #1] 한글 자모·획수 기반 0~20,000 균등 해시 매핑 엔진(JSA-Hash-20001) 및 name_teller 5만 개 시드 확률분포 검증](#issue-1) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/1) |
| #2 | 🟣 CLOSED | [[Feature #2] 0~20,000단계(20,001종) 극단적 건물 마스터 택소노미 및 짝수(실제)/홀수(허구) 50:50 교차 데이터셋 설계](#issue-2) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/2) |
| #3 | 🟣 CLOSED | [[Feature #3] Gemini 3.8 Flash 기반 20,001종 아트워크 생성 및 AI 병맛 감정서(건축연도·추산가치·특수기능) 파이프라인](#issue-3) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/3) |
| #4 | 🟣 CLOSED | [[Feature #4] Cloudflare R2 오브젝트 스토리지 구축 및 20,001종 이미지/메타데이터 초경량 청크 서빙 연동](#issue-4) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/4) |
| #5 | 🟣 CLOSED | [[Feature #5] 파일 개수를 늘리지 않는 Cloudflare 정적 호스팅 및 엣지 동적 SSR 라우터(myhome.tellmyname.app) 구현](#issue-5) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/5) |
| #6 | 🟣 CLOSED | [[Feature #6] name_teller 50,000개 시드 이름 분할 Sitemap 자동 생성 및 네이버(Yeti)·구글 Programmatic SEO 구축](#issue-6) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/6) |
| #7 | 🟣 CLOSED | [[Feature #7] 프론트엔드 UI/UX — 이름 검색, 부동산 감정평가서 카드 및 [이전 단계 / 다음 단계 / 랜덤 집 보기] 탐색기 구현](#issue-7) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/7) |
| #8 | 🟣 CLOSED | [[Feature #8] 이름 고정 URL(myhome.tellmyname.app/name/{이름}) 기반 인스타그램 스토리(9:16 캔버스)·카카오톡 공유 기능 구현](#issue-8) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/8) |
| #9 | 🟢 OPEN | [[Feature #9] Phase별(티어당 50장) 점진적 이미지 생성 파이프라인 & 폴더 경로 기반 미생성 PNG 자동 생성기](#issue-9) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/9) |
| #10 | 🟢 OPEN | [[Feature #10] 14개 다국어(ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms) 글로벌 확장 및 다국어 SEO (hreflang / Edge SSR) 구축](#issue-10) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/10) |
| #11 | 🟢 OPEN | [[Feature #11] 다국어 인스타그램 스토리(9:16 캔버스) & 카카오톡 공유 고도화 ('{이름}님에게 어울리는 집은 → 사진 → 사진 설명' 3단 레이아웃 및 다국어 다운로드/공유)](#issue-11) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/11) |
| #12 | 🟢 OPEN | [[Feature #12] Google AdSense 공식 스크립트(ca-pub-8793936135959956) 탑재 및 ads.txt 퍼블리셔 인증 연동](#issue-12) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/12) |
| #13 | 🟢 OPEN | [[Feature #13] 단계별 탐색기 고도화 — 스크롤 텍스트 전용 프리뷰(이미지 블러/잠금), 페이지 진입 시 이미지 공개, Sitemap 등록 이름 역매핑 자동 라우팅(/name/{이름})](#issue-13) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/13) |
| #14 | 🟢 OPEN | [[Feature #14] Cloudflare Workers & Assets (신규 정적 호스팅 아키텍처) 배포 파이프라인 및 npx wrangler deploy 가이드 구축](#issue-14) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/14) |
| #15 | 🟢 OPEN | [[Feature #15] 14개 언어별 유명 이름 50,000개 균등 Sitemap 구축 및 글로벌 이미지 검색 SEO ("{name} house recommendation", "{name} house image")](#issue-15) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/15) |
| #16 | 🟢 OPEN | [[Feature #16] 0~499단계(500종) 마스터 데이터셋 통합 및 G:\My Drive\new_houses 로컬 이미지 즉시 서빙 연동](#issue-16) | 2026-11-01 | [View on GitHub](https://github.com/bsj805/myhome/issues/16) |
| #17 | 🟢 OPEN | [[Feature #17] 500 -> 1,000단계 다중우주 하우스 확장 (폭망 +250 / 대박 +250) 및 유튜브/구글 오지·기이건축 키워드 전략 & 리넘버링 설계](#issue-17) | 2026-11-02 | [View on GitHub](https://github.com/bsj805/myhome/issues/17) |

---

## 📝 Detailed Issues Archive

### <a id="issue-1"></a>#1: [Feature #1] 한글 자모·획수 기반 0~20,000 균등 해시 매핑 엔진(JSA-Hash-20001) 및 name_teller 5만 개 시드 확률분포 검증

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:35Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/1](https://github.com/bsj805/myhome/issues/1)

#### 본문 (Description)

### 📌 배경 및 목적
- 한국어 이름(주로 2글자, 3글자, 복성 4글자)을 입력받았을 때 `0`부터 `20,000` 사이의 집 단계(총 20,001개 슬롯)로 결정론적(Deterministic)이고 균등하게 매핑해야 합니다.
- `name_teller` 프로젝트의 한글 자모 획수 합산 철학을 계승하되, 단순 획수 합산 시 `6 ~ 50` 구간에만 100% 몰리는 문제를 해결하여 **검색하는 모든 사용자가 거의 서로 다른 집 사진을 볼 수 있도록** 아발란체 하이브리드 해시를 구현합니다.

### 🛠️ 상세 구현 사항
1. **`name_teller` 한글 자모 획수 테이블 연동 (`src/lib/hash.js`)**
   - 초성(19개)·중성(21개)·종성(28개) 분해 및 자모별 획수(`STROKES`) 추출
   - 인접 글자 획수 조화값(`(stroke[i] + stroke[i+1]) % 10`, `name_teller` 이름점 방식) 반영
2. **`JSA-Hash-20001` (Jamo-Stroke Avalanche Hybrid Hash) 구현**
   - 글자 수(2자/3자/4자) 및 총 획수 시드 믹싱 + 음절 좌표/획수 32비트 레인 패킹 + Murmur3 `fmix32` 아발란체 종결자 적용
   - 입력 이름 정규화(NFC, 공백 제거) 및 `0 ~ 20,000` 정수 반환
3. **`name_teller` 50,000개 시드 이름 확률분포 테스트 (`scripts/test_hash_distribution.mjs`)**
   - `C:\Users\USER\Documents\projects\name_teller\data\compact_serving_names.json`(25,150개) + `korean_surnames_all.json`(300개 성씨) 조합 50,000개 시드 검증

### 📊 사전 검증된 확률분포 벤치마크 결과 (`N = 50,000`)
- **점유 단계 수**: `18,409 / 20,001 (92.04%)` (이론적 포아송 균등 한계치 `91.79%` 달성)
- **카이제곱 균등성($\chi^2$)**: `19,873.1` ($df = 20,000$, 이상적 균등분포 일치)
- **폭망집(`0~9,999`) : 대박집(`10,000~20,000`) 비율**: `49.83% (24,916명) : 50.17% (25,084명)`
- **짝수(실제 건축물) : 홀수(허구 건축물) 비율**: `49.97% (24,986명) : 50.03% (25,014명)`
- **글자 수별 균형**: 2글자 평균 `9,911.0`, 3글자 평균 `10,068.6` (10개 구간 모두 `9.78% ~ 10.20%` 균등 분포)

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 동일한 이름 입력 시 브라우저·서버(Worker) 어디서든 100% 동일한 `0 ~ 20,000` 값 반환
- [ ] 2글자/3글자/4글자 이름 간 구간 편향 없음 (폭망/대박 및 홀/짝 50:50 유지)
- [ ] `scripts/test_hash_distribution.mjs` 및 `data/hash_distribution_report.json` 검증 통과

---

### <a id="issue-2"></a>#2: [Feature #2] 0~20,000단계(20,001종) 극단적 건물 마스터 택소노미 및 짝수(실제)/홀수(허구) 50:50 교차 데이터셋 설계

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:36Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/2](https://github.com/bsj805/myhome/issues/2)

#### 본문 (Description)

### 📌 배경 및 목적
- 평범한 아파트나 일반 주택은 절대 나오지 않도록 배제하고, 사용자가 봤을 때 **황당하고 웃기게 만드는 극단적 컨셉트**로 `0단계`부터 `20,000단계`까지 마스터 기획 및 프롬프트 시드 테이블을 구축합니다.

### 🛠️ 상세 구현 사항
1. **구간별 극단적 가치/상태 분리 (1.1)**
   - **`0 ~ 9,999단계 (10,000종)`**: 극단적으로 안 좋은 집 (폭망 하우스 — 내핵 옆 마그마 반지하, 비 맞은 택배 상자, 푸세식 화장실, 개집, 아즈카반 독방, 구룡성채 등)
   - **`10,000 ~ 20,000단계 (10,001종)`**: 극단적으로 좋은 집 (대박 하우스 — 핵미사일 사일로 럭셔리 벙커, 하울의 움직이는 성, 아이언맨 말리부 저택, 부르즈 할리파 첨탑, 국제우주정거장 ISS, 다이슨 스피어, 다중우주 창조주 펜트하우스)
2. **짝수(실제 건축물) / 홀수(허구 건축물) 1단계 교차 배치 (1.0)**
   - **짝수 단계 (`level % 2 === 0`, 10,001종)**: 실제 존재하는(또는 역사상 실존했던) 기이한 건축물·사물·장소
   - **홀수 단계 (`level % 2 === 1`, 10,000종)**: 허구(상상·SF·판타지·영화/소설/애니·병맛 초현실)의 건축물·사물·장소
   - 1단계 올리면 허구, 거기서 1단계 올리면 실제 건축물이 나오도록 엄격히 교차 구성
3. **비(非)주택 12대 괴짜 카테고리 반영 (1.3, 1.4)**
   - 세계의 신기한 화장실, 옷장, 개집, 종이상자, 자동차/탈것, 우주선, 상상 속의 도시, 신기한 실제 건축물, 영화/소설 속 공간, 이색 박물관, 극한 자연물, 초차원 신전 등 12대 카테고리 매트릭스화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 평범한 아파트/일반 빌라/표준 주택 0건 보장
- [ ] 모든 `0 ~ 20,000` 단계에서 `level % 2 === 0`(실제) / `level % 2 === 1`(허구) 규칙 100% 준수
- [ ] `0 ~ 9,999`(안 좋은 집)와 `10,000 ~ 20,000`(좋은 집)의 건축 연도·추산 가치 스펙트럼 일관성 확보

---

### <a id="issue-3"></a>#3: [Feature #3] Gemini 3.8 Flash 기반 20,001종 아트워크 생성 및 AI 병맛 감정서(건축연도·추산가치·특수기능) 파이프라인

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:37Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/3](https://github.com/bsj805/myhome/issues/3)

#### 본문 (Description)

### 📌 배경 및 목적
- 실제 건축물 사진을 무단 수집하지 않고 **Gemini 3.8 Flash**를 통해 `0 ~ 20,000` 단계의 모든 집/사물/건물을 고유의 위트 있는 고화질 이미지로 생성합니다.
- 사진을 보여줄 때 **'언제 지어진 집인지'**, **'추산되는 가치는 얼마인지'**, **'집의 특별한 기능은 뭔지'**를 AI가 사진을 보고 황당하고 웃기게 지어내어 답변하도록 구축합니다.

### 🛠️ 상세 구현 사항
1. **Gemini 3.8 Flash 이미지 생성 파이프라인 (`scripts/generate_houses_dataset.mjs`)**
   - 짝수 단계(실제 건축물 모티프) 및 홀수 단계(허구 컨셉트)에 맞춘 프롬프트 템플릿 구성
   - WebP 포맷 고효율 압축 (`1024×1024` 본문용 및 OG 공유 대응)
2. **AI 멀티모달 감정평가서 생성 (비전 분석 → 병맛 텍스트 생성)**
   - `builtYear` (언제 지어진 집인지: 예 `기원전 1만 년`, `2024년 화요일 장마철`, `서기 45,000년`)
   - `estimatedValue` (추산 가치: 예 `-999억 원(원상복구 벌금)`, `고물상 폐지 시세 430원`, `은하계 담보대출 9,999해 원`)
   - `specialFeature` (집의 특별한 기능: 사진을 보고 AI가 지어낸 황당하고 웃긴 특수 기능 2~3문장)
   - `aiVerdict` (AI 감정평가사의 한 줄 총평)
3. **체크포인트 및 배치 재개(Resume) 지원**
   - 대량 생성 중 중단되더라도 이어서 생성할 수 있는 상태 관리 큐 구현

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] Gemini 3.8 Flash API 연동 및 이미지 + 메타데이터(`builtYear`, `estimatedValue`, `specialFeature`) 스키마 검증 완료
- [ ] 모든 단계 데이터에 결측값 없이 유머러스한 한국어 텍스트 생성 보장

---

### <a id="issue-4"></a>#4: [Feature #4] Cloudflare R2 오브젝트 스토리지 구축 및 20,001종 이미지/메타데이터 초경량 청크 서빙 연동

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:38Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/4](https://github.com/bsj805/myhome/issues/4)

#### 본문 (Description)

### 📌 배경 및 목적
- 20,001장의 집 이미지를 정적 호스팅(`dist/`) 내부에 넣으면 용량 및 파일 개수 제한을 초과하므로, **Cloudflare R2 오브젝트 스토리지**에 이미지를 저장하고 글로벌 CDN 캐시로 서빙합니다.

### 🛠️ 상세 구현 사항
1. **Cloudflare R2 버킷 설계 및 업로드 스크립트 (`scripts/upload_r2_images.mjs`)**
   - 버킷명: `myhome-houses-r2` (커스텀 도메인 `img.myhome.tellmyname.app` 또는 Worker R2 바인딩 `/r2/houses/{level}.webp`)
   - 객체 키 규격: `houses/00000.webp` ~ `houses/20000.webp`
   - `Cache-Control: public, max-age=31536000, immutable` 헤더 적용으로 R2 Class B 요청 및 대역폭 비용 최소화
2. **메타데이터 20개 청크 분할 압축 서빙 (`dist/data/houses-chunk-00.json` ~ `19.json`)**
   - 20,001개 집의 텍스트 메타데이터(제목, 건축연도, 추산가치, 특수기능)를 1,000단계 단위 20개 JSON 파일로 분할하여, 필요한 청크만 지연 로드(Lazy Fetch)하도록 최적화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `wrangler.toml` 내 R2 버킷 바인딩(`MYHOME_R2`) 및 이미지 업로드/조회 유틸리티 완성
- [ ] 이미지 로딩 실패 시 재시도 및 우아한 폴백(Placeholder) 처리

---

### <a id="issue-5"></a>#5: [Feature #5] 파일 개수를 늘리지 않는 Cloudflare 정적 호스팅 및 엣지 동적 SSR 라우터(myhome.tellmyname.app) 구현

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:39Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/5](https://github.com/bsj805/myhome/issues/5)

#### 본문 (Description)

### 📌 배경 및 목적
- Cloudflare 정적 호스팅(Pages / Workers Assets)의 **파일 개수 제한(20,000개)**을 침범하지 않으면서도, 50,000개 이상의 이름 URL(`https://myhome.tellmyname.app/name/{이름}`)과 20,001개 단계 URL을 완벽한 SEO 문서로 응답해야 합니다.

### 🛠️ 상세 구현 사항
1. **무파일 증식(Zero-File-Explosion) 빌드 구조**
   - `dist/` 폴더 내 물리적 파일 개수를 **총 30개 이내**(`index.html`, JS/CSS 번들, 20개 메타 청크 JSON, `sitemap*.xml`, `robots.txt`, `rss.xml`)로 엄격히 제한
2. **Cloudflare Worker 엣지 동적 SSR 라우터 (`worker.js`)**
   - `GET /name/:name` 또는 `GET /:name` 요청 수신 시:
     1. `JSA-Hash-20001(name)`으로 즉시 집 단계(`0 ~ 20,000`) 계산
     2. 해당 단계의 집 메타데이터(제목, 건축연도, 추산가치, 특수기능, R2 이미지 URL) 조회
     3. 기본 `index.html` 템플릿에 `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<link rel="canonical">`, `JSON-LD`, 그리고 크롤러용 `<article id="seo-house-card">` 본문 HTML을 실시간 주입하여 반환
3. **커스텀 도메인 설정 (`myhome.tellmyname.app`)**
   - `wrangler.toml` 및 Canonical Origin을 `https://myhome.tellmyname.app`으로 일원화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `dist/` 내 총 파일 개수 50개 미만 유지 (Cloudflare 정적 호스팅 즉시 배포 가능)
- [ ] `curl https://myhome.tellmyname.app/name/김서윤` 요청 시 JS 실행 없이도 완성된 OG 태그와 본문 HTML이 응답됨

---

### <a id="issue-6"></a>#6: [Feature #6] name_teller 50,000개 시드 이름 분할 Sitemap 자동 생성 및 네이버(Yeti)·구글 Programmatic SEO 구축

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:40Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/6](https://github.com/bsj805/myhome/issues/6)

#### 본문 (Description)

### 📌 배경 및 목적
- 검색 노출을 극대화하기 위해 `C:\Users\USER\Documents\projects\name_teller`의 이름 데이터에서 추출한 **50,000개 이름**을 Sitemap에 등록하고, **네이버 검색(Yeti)**과 **구글 검색(Googlebot)**에 완벽히 색인되도록 구현합니다.

### 🛠️ 상세 구현 사항
1. **50,000개 이름 Sitemap 자동 빌더 (`scripts/generate_static_site.mjs`)**
   - `name_teller`의 순수 이름 15,000개 + 주요 성씨 결합 이름 35,000개 = **총 50,000개 이름 URL** 생성
   - XML Sitemap 표준에 맞춰 25,000개씩 `sitemap-names-1.xml`, `sitemap-names-2.xml`로 분할하고, 루트 `sitemap.xml`(Sitemap Index)에서 통합 연결
2. **네이버 서치어드바이저(Yeti) & 구글 서치콘솔 친화형 설정**
   - `robots.txt`: `User-agent: Yeti`, `User-agent: Googlebot` 전면 `Allow: /` 및 사이트맵·RSS 경로 명시
   - `rss.xml`: 네이버 서치어드바이저 RSS 제출 규격에 맞춘 최신/인기 이름 집 감정 피드 자동 생성
   - 네이버 소유권 확인 메타태그 및 한국어 키워드 최적화(`"{이름}에게 어울리는 집", "{이름} 미래 집 감정", "나에게 어울리는 집"`)
   - `Schema.org` (`WebPage`, `FAQPage`, `Residence`) 구조화 데이터 삽입

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `sitemap-names-1.xml`(25,000개) + `sitemap-names-2.xml`(25,000개) = 총 50,000개 유효 URL 생성 검증
- [ ] `robots.txt` 및 `rss.xml` 유효성 검증 통과

---

### <a id="issue-7"></a>#7: [Feature #7] 프론트엔드 UI/UX — 이름 검색, 부동산 감정평가서 카드 및 [이전 단계 / 다음 단계 / 랜덤 집 보기] 탐색기 구현

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:41Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/7](https://github.com/bsj805/myhome/issues/7)

#### 본문 (Description)

### 📌 배경 및 목적
- 사용자가 이름을 입력하면 황당하고 웃긴 부동산 감정평가서/등기권리증 컨셉으로 집 이미지와 상세 스펙을 보여주고, **다음 단계 집 보기 / 이전 단계 집 보기 / 랜덤 집 보기**를 누르며 끝없이 탐색할 수 있는 인터랙티브 웹앱을 구현합니다.

### 🛠️ 상세 구현 사항
1. **이름 검색바 & 감정 도장 애니메이션**
   - 한글/영문 이름 입력 및 엔터/버튼 클릭 시 `/name/{이름}`으로 History API 라우팅
2. **『다중우주 부동산 감정평가서』 결과 카드 UI**
   - **단계 및 속성 배지**: `Lv. 0 ~ 20,000` | `💀 폭망 하우스 (0~9999)` vs `🌟 대박 하우스 (10000~20000)` | `🏛️ 실제 존재하는 건축물 (짝수)` vs `🦄 허구 건축물 (홀수)`
   - **3대 필수 정보 영역**:
     1. 📅 **언제 지어진 집인지 (`builtYear`)**
     2. 💰 **추산되는 가치는 얼마인지 (`estimatedValue`)**
     3. ⚡ **집의 특별한 기능은 뭔지 (`specialFeature` — AI 병맛 해설)**
3. **3버튼 탐색 컨트롤러 (요구사항 4)**
   - **`[◀ 이전 단계 집 보기 (Lv. N-1)]`**: 1단계 아래 집 로드 (실제 ↔ 허구 교차 확인)
   - **`[🎲 랜덤 집 보기]`**: `0 ~ 20,000` 중 무작위 단계 집 로드
   - **`[다음 단계 집 보기 (Lv. N+1) ▶]`**: 1단계 위 집 로드
   - 탐색 중 언제든 원래 검색한 내 이름의 집으로 돌아오는 `[🏠 내 집(이름)으로 복귀]` 버튼 제공

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 모바일/데스크톱 반응형 UI 및 R2 이미지 프리로딩(인접 `N-1`, `N+1` 단계 사전 프리패치) 적용
- [ ] 이전/다음/랜덤 버튼 클릭 시 끊김 없는 즉각 전환 및 키보드 방향키(`←`, `→`, `Space`) 단축키 지원

---

### <a id="issue-8"></a>#8: [Feature #8] 이름 고정 URL(myhome.tellmyname.app/name/{이름}) 기반 인스타그램 스토리(9:16 캔버스)·카카오톡 공유 기능 구현

- **상태**: 🟣 CLOSED
- **생성 일시**: `2026-11-01T03:27:42Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/8](https://github.com/bsj805/myhome/issues/8)

#### 본문 (Description)

### 📌 배경 및 목적
- 이름이 URL에 포함되어 해당 이름으로 요청하면 항상 같은 페이지가 열리도록 하고(`https://myhome.tellmyname.app/name/{이름}`), 이를 통해 인스타그램 스토리, 카카오톡 등으로 손쉽게 공유할 수 있게 합니다.

### 🛠️ 상세 구현 사항
1. **이름 영구 URL 라우팅 & 클립보드 공유**
   - `https://myhome.tellmyname.app/name/{이름}` 고정 URL 생성 및 원클릭 링크 복사 토스트 알림
2. **카카오톡 공유 & 동적 OG 미리보기 연동**
   - 카카오톡 채팅방에 링크 공유 시 `[김서윤님에게 어울리는 집: Lv.4,478]`, 추산 가치, R2 집 이미지가 즉시 카드 형태로 렌더링되도록 OG 태그 및 Web Share API 연동
3. **인스타그램 스토리 전용 9:16(`1080×1920`) 캔버스 이미지 렌더러**
   - 집 이미지 + `{이름}님의 미래 집 등기권리증` + `Lv. {단계}` + 건축연도 + 추산가치 + AI 특수기능 + `myhome.tellmyname.app` 워터마크가 합성된 고해상도 PNG 카드 다운로드 및 모바일 즉시 공유 지원

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 공유된 `https://myhome.tellmyname.app/name/{이름}` 접속 시 언제나 100% 동일한 집과 감정 결과 표시
- [ ] 인스타그램 9:16 스토리 이미지 저장 및 모바일 네이티브 공유(Web Share API) 정상 작동

---

### <a id="issue-9"></a>#9: [Feature #9] Phase별(티어당 50장) 점진적 이미지 생성 파이프라인 & 폴더 경로 기반 미생성 PNG 자동 생성기

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T07:09:56Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/9](https://github.com/bsj805/myhome/issues/9)

#### 본문 (Description)

## 개요 (Overview)
20,001장(`Lv.0 ~ Lv.20000`)의 고해상도 순수 일러스트 PNG 이미지를 한 번에 생성할 때 발생하는 시간 병목을 해결하기 위해, **20개 티어(Tier 1~20)별로 50장씩 총 20개 Phase(`Phase 1 ~ Phase 20`)로 점진적 확장**하는 파이프라인과 **폴더 경로 기반 미생성 PNG 차집합 자동 생성기**를 구현합니다.

---

## 1. 티어별 50장씩 Phase 분할 구조 (`G:\My Drive\houses`)
각 티어(`T = 0..19`, `T*1000 + 000..999`)의 고유 번호 체계는 비워둔 채 그대로 유지하며, `.txt` 프롬프트 파일을 50장 단위로 분리 저장합니다.

| Phase | 경로 | 티어당 슬롯 범위 (`T = 0..19`) | `.txt` 파일 수 | 누적 활성 이미지 수 | `ACTIVE_SLOTS_PER_TIER` 설정값 |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Phase 1 (현재)** | `G:\My Drive\houses\` | `T*1000 + 000 ~ 049` (+ `20000.txt`) | **1,001개** | **1,001장** | `50` |
| **Phase 2** | `G:\My Drive\houses\future_work\phase2\` | `T*1000 + 050 ~ 099` | **1,000개** | **2,001장** | `100` |
| **Phase 3** | `G:\My Drive\houses\future_work\phase3\` | `T*1000 + 100 ~ 149` | **1,000개** | **3,001장** | `150` |
| **Phase 4** | `G:\My Drive\houses\future_work\phase4\` | `T*1000 + 150 ~ 199` | **1,000개** | **4,001장** | `200` |
| **...** | `...` | 티어당 50장씩 순차 할당 | 각 **1,000개** | ... | `+50`씩 증가 |
| **Phase 20 (최종)** | `G:\My Drive\houses\future_work\phase20\` | `T*1000 + 950 ~ 999` | **1,000개** | **20,001장** | `1000` |

### Phase 관리 스크립트 (`scripts/organize_gdrive_phases.mjs`)
- 초기 분할 및 상태 점검:
  ```powershell
  node scripts/organize_gdrive_phases.mjs
  ```
- 특정 Phase를 루트(`G:\My Drive\houses\`)로 활성화하여 추가 생성할 때:
  ```powershell
  node scripts/organize_gdrive_phases.mjs --activate=phase2
  ```

---

## 2. Phase-Aware 해시 매핑 및 탐색 연동 (`src/lib/constants.js`, `src/lib/hash.js`, `web/js/app.js`)
- **`ACTIVE_SLOTS_PER_TIER`** (`src/lib/constants.js`): 현재 생성된 티어당 슬롯 개수(기본 `50`)를 지정합니다.
- **`normalizeToActiveLevel(rawLevel, slotsPerTier)`**:
  - 원시 해시값(`0 ~ 20000`)의 **티어 번호(`Tier 1~20`)**, **폭망(`0~9999`)/대박(`10000~20000`) 구역**, **짝수(실제 건축물 `REAL`)/홀수(허구 건축물 `FICTION`) 홀짝성**을 100% 보존하면서 각 티어의 활성 슬롯(`000 ~ 049`)으로 매핑합니다.
  - 50,000개 시드 이름 테스트 시 1,001개 활성 슬롯 100% 점유 및 `50:50` 폭망/대박, `50:50` 실제/허구 비율 완벽 유지.
- **비어 있는 번호를 건너뛰는 탐색 도크 (`getNextActiveLevel`, `getPrevActiveLevel`, `getRandomActiveLevel`)**:
  - `[다음 단계 집 보기 ▶]` 클릭 시 `00049`(홀수·허구) 다음에는 비어 있는 `00050~00999`를 건너뛰고 `01000`(짝수·실제)으로 이동하여 홀짝 교차 법칙을 유지합니다.

---

## 3. 경로 입력 기반 `.txt` vs `.png` 비교 자동 생성기 (`Gemini_houses_이미지자동생성.bat` & `auto_generator.py`)
- 실행 시 작업할 폴더 경로를 CLI 인자 또는 프롬프트(`set /p`)로 입력받습니다 (그냥 Enter 입력 시 기본값 `G:\My Drive\houses`).
  - 예: `G:\My Drive\houses` 또는 `G:\My Drive\houses\future_work\phase2`
- 지정된 폴더 내의 `.txt` 파일 목록과 `.png` 파일 목록(파일 크기 `> 0` 검증 포함)을 비교(`scan_directory_status`)하여, **아직 `.png`가 생성되지 않은 `.txt` 파일에 대해서만 순차적으로 이미지를 생성하고 동일 폴더에 `.png`로 저장**합니다.
- 사용량 한도 도달 시 `https://gemini.google.com/usage` 리셋 시각을 파싱하여 `[리셋 시각 + 1분]` 대기 후 자동 재개합니다.

---

## 완료 기준 (Acceptance Criteria)
- [x] `G:\My Drive\houses` 루트에 Phase 1 대상 `1,001개` `.txt`만 남기고 `future_work/phase2 ~ phase20`에 각 `1,000개`(티어별 50장)씩 분할 완료
- [x] `ACTIVE_SLOTS_PER_TIER` 기반 해시 정규화 및 이전/다음/랜덤 탐색 연동 완료 (`npm test` 전체 통과)
- [x] `C:\Users\USER\Desktop\Gemini_houses_이미지자동생성.bat` 및 `auto_generator.py`에서 시작 시 폴더 경로를 입력받아 `.txt`와 `.png`를 비교 후 미생성 `.png`만 생성하도록 설정 완료

---

### <a id="issue-10"></a>#10: [Feature #10] 14개 다국어(ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms) 글로벌 확장 및 다국어 SEO (hreflang / Edge SSR) 구축

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:50Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/10](https://github.com/bsj805/myhome/issues/10)

#### 본문 (Description)

### 📌 배경 및 목적
- 국내(한국어) 타깃을 넘어 전 세계 사용자 유입 및 글로벌 바이럴을 달성하기 위해, 인터넷 사용 인구가 가장 많은 14개 주요 언어(한국어, 영어, 힌디어, 베트남어, 프랑스어, 포르투갈어, 스페인어, 인도네시아어, 러시아어, 독일어, 이탈리아어, 일본어, 중국어, 말레이어)로 서비스 UI와 메타데이터를 전면 로컬라이즈합니다.
- 각 언어별로 독립적인 URL 파라미터/경로 및 검색엔진(Google, Yandex, Yahoo Japan, Baidu 등) 맞춤 `hreflang` 태그, 동적 OpenGraph 및 Schema.org 다국어 구조화 데이터를 구축합니다.

### 🛠️ 상세 구현 사항
1. **14개 언어 정의 및 사전 체계 (`src/lib/i18n.js`)**
   - 지원 언어 코드: `ko`(한국어), `en`(영어), `hi`(힌디어), `vi`(베트남어), `fr`(프랑스어), `pt`(포르투갈어), `es`(스페인어), `id`(인도네시아어), `ru`(러시아어), `de`(독일어), `it`(이탈리아어), `ja`(일본어), `zh`(중국어 간체), `ms`(말레이어)
   - 공통 UI 사전: 서비스 타이틀, 검색창 플레이스홀더, 버튼 라벨("내 집 찾기", "이전/다음/랜덤 집", "내 이름으로 복귀"), 감정평가서 항목명("건축 연도", "추산 가치", "특별한 기능", "AI 총평"), 소셜 공유 문구("○○님에게 어울리는 집") 등 14개 언어 번역 매트릭스 제공
   - 언어 감지 우선순위: `URL 파라미터(?lang=xx)` > `경로(/lang/)` > `로컬스토리지` > `Accept-Language` 헤더 > 기본값(`ko` or `en`)
2. **반응형 다국어 셀렉터 UI (`web/index.html`, `web/js/app.js`)**
   - 헤더 영역에 국기/언어명 드롭다운 셀렉터 컴포넌트 추가
   - 언어 변경 시 즉각 클라이언트 텍스트 리렌더링 및 로컬스토리지 동기화
3. **Cloudflare Worker Edge SSR 다국어 태그 동적 주입 (`worker.js`)**
   - `<html lang="{lang}">` 동적 설정
   - 다국어 교차 참조 태그 주입:
     ```html
     <link rel="alternate" hreflang="x-default" href="https://myhome.tellmyname.app/" />
     <link rel="alternate" hreflang="ko" href="https://myhome.tellmyname.app/?lang=ko" />
     <link rel="alternate" hreflang="en" href="https://myhome.tellmyname.app/?lang=en" />
     <!-- 14개 언어 hreflang 전개 -->
     ```
   - 언어별 로컬라이즈된 OpenGraph (`og:title`, `og:description`, `og:locale`) 및 Schema.org (`inLanguage`, `WebPage`, `Residence`) 생성

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 14개 언어에 대한 `i18n.js` 사전 데이터 완성 및 단위 테스트 통과
- [ ] 웹 화면 상단 다국어 셀렉터를 통해 14개 언어 UI 실시간 전환 정상 작동
- [ ] Edge SSR 시 언어 감지에 따른 `<html lang="...">`, `hreflang` 태그 및 `og:*` 메타데이터 실시간 주입 검증

---

### <a id="issue-11"></a>#11: [Feature #11] 다국어 인스타그램 스토리(9:16 캔버스) & 카카오톡 공유 고도화 ('{이름}님에게 어울리는 집은 → 사진 → 사진 설명' 3단 레이아웃 및 다국어 다운로드/공유)

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:51Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/11](https://github.com/bsj805/myhome/issues/11)

#### 본문 (Description)

### 📌 배경 및 목적
- SNS 공유 시 직관적인 시각적 몰입도와 바이럴 확산력을 극대화하기 위해, 인스타그램 스토리 전용 9:16(`1080×1920`) 고해상도 캔버스 카드 레이아웃을 **'{이름}님에게 어울리는 집은' 상단 헤더 → '고화질 집 사진' 중앙 배치 → '건축연도·추산가치·특수기능' 하단 스펙 요약**의 3단 수직 구조로 전면 업그레이드합니다.
- 14개 다국어 지원에 맞추어 언어별 카드 번역 및 네이티브 모바일 공유(`navigator.share`)를 연동합니다.

### 🛠️ 상세 구현 사항
1. **3단 수직 카드 레이아웃 (`web/js/share.js`)**
   - **상단 섹션 (Header)**:
     - 한국어: `"{이름}님에게 어울리는 집은"` + 단계 배지 (`Lv. {level} · {TierName}`)
     - 영어: `"The House That Suits {Name}"`
     - 14개 다국어 템플릿에 맞춰 감각적인 그라데이션 타이포그래피 렌더링
   - **중앙 섹션 (Hero Image)**:
     - 9:16 카드 프레임에 최적화된 고화질 집 사진 렌더링 (그림자 및 테두리 라운딩 효과)
   - **하단 섹션 (Appraisal Specs & AI Verdict)**:
     - 📅 건축 연도 (`Built Year`)
     - 💰 추산 가치 (`Estimated Value`)
     - ⚡ 특별한 기능 (`Special Feature`)
     - 🤖 AI 총평 (`AI Verdict`)
     - 하단 워터마크 & 도메인: `myhome.tellmyname.app`
2. **14개 다국어 카드 렌더링 & 고해상도 PNG 출력**
   - 현재 선택된 언어에 맞춰 캔버스 폰트 및 라벨 자동 변환
   - `HTMLCanvasElement.toBlob` 고품질 PNG 내보내기 (다운로드 지원)
3. **모바일 네이티브 공유 및 카카오톡 연동**
   - 모바일 환경(`navigator.canShare({ files })`): 인스타그램 스토리 / 카카오톡 등으로 이미지 파일 즉시 공유
   - 데스크톱 환경: 즉시 이미지 파일 저장 및 클립보드 URL 복사 토스트 팝업

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 1080×1920 캔버스 3단 구조(타이틀 헤더 → 사진 → 상세 스펙) 정확한 좌표 렌더링
- [ ] 14개 언어별 카드 타이틀 및 스펙 라벨 번역 정상 적용
- [ ] 모바일 기기에서 인스타그램 스토리 및 카카오톡 이미지 파일 공유 정상 작동

---

### <a id="issue-12"></a>#12: [Feature #12] Google AdSense 공식 스크립트(ca-pub-8793936135959956) 탑재 및 ads.txt 퍼블리셔 인증 연동

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:52Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/12](https://github.com/bsj805/myhome/issues/12)

#### 본문 (Description)

### 📌 배경 및 목적
- 글로벌 및 국내 트래픽 유입에 대응하여 안정적인 수익화(Monetization) 기반을 마련하기 위해 공식 구글 애드센스 퍼블리셔 코드(`ca-pub-8793936135959956`)를 탑재하고, `ads.txt` 퍼블리셔 인증 규격을 준수합니다.
- 광고 로드로 인한 레이아웃 이동(CLS: Cumulative Layout Shift)을 0으로 유지하여 Core Web Vitals 점수를 방어합니다.

### 🛠️ 상세 구현 사항
1. **Google AdSense SDK 태그 주입**
   - 대상 파일: `web/index.html`, `public/privacy.html`, `public/terms.html`
   - 스크립트:
     ```html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>
     ```
2. **공식 `ads.txt` 레코드 배포 (`dist/ads.txt`)**
   - 내용: `google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0`
   - 루트 도메인(`https://myhome.tellmyname.app/ads.txt`) 및 정적 파일 빌드 파이프라인(`scripts/generate_static_site.mjs`)에 누락 없이 복사되도록 구성
3. **CLS=0 반응형 광고 슬롯 레이아웃 설계**
   - 집 감정 카드 상단/하단 영역에 사전 높이(예: `min-height: 90px;` or `min-height: 250px;`)가 확보된 반응형 광고 컨테이너(`adsbygoogle`) 배치
   - 비동기 로딩 시 콘텐츠 밀림 현상 방지

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `web/index.html`, `privacy.html`, `terms.html` 내 애드센스 공식 스크립트 탑재 확인
- [ ] `curl https://myhome.tellmyname.app/ads.txt` 요청 시 정확한 퍼블리셔 ID 및 인증 해시 반환 확인
- [ ] 광고 슬롯의 고정 높이 지정으로 광고 노출 전후 CLS 발생 방지

---

### <a id="issue-13"></a>#13: [Feature #13] 단계별 탐색기 고도화 — 스크롤 텍스트 전용 프리뷰(이미지 블러/잠금), 페이지 진입 시 이미지 공개, Sitemap 등록 이름 역매핑 자동 라우팅(/name/{이름})

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:53Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/13](https://github.com/bsj805/myhome/issues/13)

#### 본문 (Description)

### 📌 배경 및 목적
- 이전/다음/랜덤 단계 탐색 시 호기심과 도파민을 자극하는 UX를 구축합니다.
- 스크롤 가능한 단계별 프리뷰 목록에서는 **집의 황당한 설명과 스펙만 먼저 텍스트로 노출하고 이미지는 잠금(블러 처리/실루엣)** 상태로 유지하여 사용자의 클릭을 유도하고, 상세 페이지로 진입하는 순간 고화질 집 사진이 언락(공개)되도록 구현합니다.
- 또한 검색엔진 Sitemap에 등록된 50,000개 대표 시드 이름과 각 단계를 역매핑(`levelToNameMap`)하여, 단계 번호(`/level/N`)로 접근하더라도 해당 단계에 매핑된 대표 이름이 있으면 자동으로 `/name/{이름}` 경로로 URL을 리라이트/리다이렉트하여 SEO 및 공유 효율을 극대화합니다.

### 🛠️ 상세 구현 사항
1. **스크롤 텍스트 전용 프리뷰 모달 / 사이드 패널 (`web/js/app.js`, `web/css/style.css`)**
   - 인접 및 전체 단계의 텍스트 목록(단계 번호, 티어, 집 이름, 건축연도, 추산가치 요약) 스크롤 UI
   - 이미지 영역: 자물쇠 아이콘 + "페이지 진입 시 사진 공개" 문구 및 스포일러 방지 블러/플레이스홀더 적용
2. **페이지 진입 시 사진 언락 애니메이션**
   - 해당 단계 클릭 또는 이전/다음 버튼을 통해 페이지 진입 시, 화려한 도장 날인/언락 애니메이션과 함께 고화질 집 사진 노출
3. **Sitemap 등록 이름 역매핑 자동 라우팅 (`levelToNameMap`)**
   - 50,000개 시드 이름 빌드 시 각 레벨(`0 ~ 499`)을 대표하는 최적의 시드 이름을 사전 역매핑 인덱스로 생성
   - `/level/{level}` 진입 시, 해당 레벨에 등록된 시드 이름이 존재하면 브라우저 History 및 Edge SSR에서 자동으로 `/name/{대표이름}`으로 canonical 라우팅

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 텍스트 전용 단계 프리뷰 리스트 렌더링 및 이미지 블러/잠금 상태 유지 확인
- [ ] 프리뷰 항목 클릭 또는 이전/다음 탐색 시 상세 화면에서 고화질 사진 정상 언락
- [ ] `/level/N` 접속 시 `levelToNameMap`에 따라 `/name/{이름}`으로 매끄러운 자동 라우팅 검증

---

### <a id="issue-14"></a>#14: [Feature #14] Cloudflare Workers & Assets (신규 정적 호스팅 아키텍처) 배포 파이프라인 및 npx wrangler deploy 가이드 구축

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:54Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/14](https://github.com/bsj805/myhome/issues/14)

#### 본문 (Description)

### 📌 배경 및 목적
- 레거시 Cloudflare Pages 방식(정적 호스팅과 Functions 분리 구조)에서 최신 통합 아키텍처인 **Cloudflare Workers with Static Assets** (`[assets]` 바인딩)로 마이그레이션합니다.
- 단 한 번의 `npx wrangler deploy` 명령어로 정적 자산(`dist/`) 서빙과 엣지 SSR 라우팅(`worker.js`)을 무중단 배포할 수 있는 단일화된 파이프라인 및 공식 가이드 문서를 구축합니다.

### 🛠️ 상세 구현 사항
1. **`wrangler.toml` 신규 Assets 스펙 구성**
   - 레거시 호스팅 설정 제거 및 Workers Assets 블록 구성:
     ```toml
     name = "myhome"
     main = "worker.js"
     compatibility_date = "2024-11-01"
     compatibility_flags = ["nodejs_compat"]

     [assets]
     directory = "./dist"
     binding = "ASSETS"
     run_worker_first = true
     ```
   - `run_worker_first = true`를 통해 엣지 SSR 라우터(`worker.js`)가 먼저 요청을 가로채 `/name/:name`, `/level/:level` 동적 SEO를 처리하고 정적 자산(CSS/JS/이미지)은 `env.ASSETS.fetch(request)`로 초고속 위임
2. **통합 빌드 & 배포 커맨드 표준화**
   - `npm run build`: `node scripts/generate_static_site.mjs` 실행을 통해 `dist/` 내 번들, 인덱스 파일, 사이트맵 생성
   - `npm run deploy`: `npx wrangler deploy` 실행으로 즉시 글로벌 엣지 네트워크 배포
3. **배포 가이드 문서 작성 (`docs/CLOUDFLARE_DEPLOY_GUIDE.md` 및 ADR)**
   - 사전 요구사항(Cloudflare 계정, Wrangler 인증, R2 바인딩)
   - 빌드 및 배포 순서, 환경 변수 설정, 커스텀 도메인(`myhome.tellmyname.app`) 연결 절차 문서화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `wrangler.toml`의 `[assets]` 설정 및 Worker 연동 구문 검증
- [ ] `npm run build && npx wrangler deploy` 단일 파이프라인 구축 완료
- [ ] `docs/CLOUDFLARE_DEPLOY_GUIDE.md` 및 배포 가이드 문서 작성 완료

---

### <a id="issue-15"></a>#15: [Feature #15] 14개 언어별 유명 이름 50,000개 균등 Sitemap 구축 및 글로벌 이미지 검색 SEO ("{name} house recommendation", "{name} house image")

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:55Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/15](https://github.com/bsj805/myhome/issues/15)

#### 본문 (Description)

### 📌 배경 및 목적
- 글로벌 14개 언어권(한국어, 영어, 힌디어, 베트남어, 프랑스어, 포르투갈어, 스페인어, 인도네시아어, 러시아어, 독일어, 이탈리아어, 일본어, 중국어, 말레이어)의 검색 유입을 균등하게 확보하기 위해, 각 언어별 약 3,571개씩 총 **50,000개의 글로벌 유명 인명 데이터셋**을 구축합니다.
- 특히 Google 이미지 검색에서 `"{name} house recommendation"`, `"{name} house image"`, `"{name}님에게 어울리는 집` 등의 검색 쿼리를 선점할 수 있도록 Image SEO 구조화 및 이미지 전용 사이트맵(`/sitemap-images.xml`)을 배포합니다.

### 🛠️ 상세 구현 사항
1. **14개 언어권 50,000개 인명 데이터셋 생성 (`scripts/build_seed_50k_names.mjs`)**
   - 언어별 약 3,571개 (14 × 3,571 ≈ 50,000개) 대표 인명 및 유명인 이름 수집
   - 영어(`Steve`, `Emma`, `Liam`), 스페인어(`Carlos`, `Sofia`), 일본어(`Kenji`, `Yuki`), 프랑스어, 힌디어, 중국어 등 전 세계 주요 언어권 포함
2. **다국어 분할 사이트맵 & 이미지 사이트맵 자동 생성 (`scripts/generate_static_site.mjs`)**
   - `dist/sitemap-names-1.xml` (25,000개)
   - `dist/sitemap-names-2.xml` (25,000개)
   - `dist/sitemap-images.xml`: 각 이름 페이지의 대표 집 이미지 URL, `<image:loc>`, `<image:title>`, `<image:caption>` 메타태그 등록
   - `dist/sitemap.xml`: 사이트맵 인덱스로 위 파일들 총괄 참조
3. **프로그래매틱 이미지 검색 SEO 최적화**
   - Edge SSR 렌더링 시 `<img>` 태그에 언어별 검색 키워드가 반영된 `alt`, `title` 속성 주입
   - Google `Schema.org/ImageObject` 구조화 데이터 연동

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 14개 언어권 50,000개 인명 데이터셋 무결성 검증 및 균등 분배 확인
- [ ] `sitemap-names-1.xml`, `sitemap-names-2.xml`, `sitemap-images.xml`, `sitemap.xml` 생성 완료
- [ ] Googlebot 이미지 검색 크롤러 규격(`image:image`, `image:loc`, `image:caption`) 충족 확인

---

### <a id="issue-16"></a>#16: [Feature #16] 0~499단계(500종) 마스터 데이터셋 통합 및 G:\My Drive\new_houses 로컬 이미지 즉시 서빙 연동

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-01T15:47:56Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/16](https://github.com/bsj805/myhome/issues/16)

#### 본문 (Description)

### 📌 배경 및 목적
- 기 구축된 20개 티어 × 티어당 25개 레벨 = 총 500종(`Lv.0 ~ Lv.499`)의 완성형 마스터 데이터셋을 프로젝트 전반(`constants.js`, `master_dataset.js`, `taxonomy.js`, `r2_storage.js`, `worker.js`, `dev_server.mjs`)에 단일 표준으로 통합합니다.
- 로컬 개발 환경(`scripts/dev_server.mjs`) 및 R2 서빙 라우터에서 로컬 `G:\My Drive\new_houses` 디렉터리에 새로 수집·생성된 고화질 실사/일러스트 이미지(`.png`, `.webp`, `.json`)를 최우선 즉시 서빙하도록 파이프라인을 연결합니다.

### 🛠️ 상세 구현 사항
1. **500종(`Lv.0 ~ Lv.499`) 마스터 데이터셋 통일**
   - `src/lib/constants.js`: `TOTAL_LEVELS = 500`, `TIERS = 20`, 티어당 25개 레벨 매핑
   - `src/lib/master_dataset.js` 및 `data/master_dataset_500.json` 일원화:
     - 짝수 단계(250종): 위키미디어/Flickr 공용 라이선스 기반 실존 이색 건축물 대표 실사 사진 및 출처 메타데이터
     - 홀수 단계(250종): Gemini 고화질 병맛/SF/판타지/초현실 일러스트
   - 폭망(0~249, 10개 티어) vs 대박(250~499, 10개 티어) 50:50 황금 밸런스 유지
2. **`G:\My Drive\new_houses` 로컬 우선 스트리밍 서빙**
   - `scripts/dev_server.mjs`에 미들웨어 추가:
     - `/r2/houses/{padded}.png` 또는 `.webp` 요청 시:
       1순위: `G:\My Drive\new_houses\{padded}.png` (또는 `.webp`) 존재 시 즉시 로컬 파일 스트리밍
       2순위: `G:\My Drive\houses\{padded}.png` 기존 아카이브 폴백
       3순위: Cloudflare R2 원격 버킷
       4순위: 동적 엣지 SVG 플레이스홀더
     - 라이선스 및 상세 정보 JSON 파일(`G:\My Drive\new_houses\{padded}.json`) 동시 서빙
3. **프로덕션 R2 동기화 스크릴트 대응 (`scripts/upload_r2_images.mjs`)**
   - `G:\My Drive\new_houses` 내 500종 이미지 및 메타데이터를 일괄 WebP 압축 및 R2 버킷 동기화 기능 지원

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] `TOTAL_LEVELS = 500` 및 20개 티어 구조로 전체 모듈(해시, SSR, 정적 빌더, 프론트엔드) 동기화
- [ ] 로컬 개발 서버 구동 시 `G:\My Drive\new_houses` 경로의 이미지가 즉시 브라우저에 표시됨 확인
- [ ] 500개 전 레벨에 대한 데이터 누락 없음 검증

---

### <a id="issue-17"></a>#17: [Feature #17] 500 -> 1,000단계 다중우주 하우스 확장 (폭망 +250 / 대박 +250) 및 유튜브/구글 오지·기이건축 키워드 전략 & 리넘버링 설계

- **상태**: 🟢 OPEN
- **생성 일시**: `2026-11-02T03:00:52Z`
- **GitHub URL**: [https://github.com/bsj805/myhome/issues/17](https://github.com/bsj805/myhome/issues/17)

#### 본문 (Description)

### 📌 배경 및 목적
- 사용자 이름 해시 기반 집 감정 서비스(`myhome`)의 콘텐츠 깊이와 글로벌 체류 시간을 극대화하기 위해, 기존 500단계(`Lv.0 ~ Lv.499`) 체제를 **총 1,000단계(`Lv.0 ~ Lv.999`)** 로 전면 확장합니다.
- 폭망 하우스 구역(250 -> 500개, `Lv.0 ~ Lv.499`)과 대박 하우스 구역(250 -> 500개, `Lv.500 ~ Lv.999`)의 50:50 황금 균형을 완벽히 유지합니다.
- 짝수 레벨(REAL: 실존 건축물·장소 500종)과 홀수 레벨(FICTION: 영화·애니·SF·가상 500종)의 패리티 규칙을 100% 엄격하게 보존합니다.
- 전 세계 유튜브 채널(빠니보틀, 곽튜브, 진용진, Drew Binsky, Architectural Digest, Enes Yilmazer 등)에서 화제가 된 극한의 오지, 기괴한 슬럼가, 초호화 기이 맨션, 우주 랜드마크 소재를 12개 카테고리별로 체계적으로 발굴합니다.

### 🛠️ 상세 구현 및 설계 명세
1. **20개 티어 × 티어당 50레벨 규격 통일**
   - `houses-chunk-00.json` ~ `houses-chunk-19.json` 각 파일이 25개에서 **50개**로 확장 (총 1,000개).
   - Tier 01 ~ Tier 10: 폭망 하우스 (`Lv.000 ~ Lv.499`, 500개)
   - Tier 11 ~ Tier 20: 대박 하우스 (`Lv.500 ~ Lv.999`, 500개)
2. **12대 카테고리별 유튜브 & 구글 검색 키워드 공략 전략**
   - `EXTREME_NATURE`: 시베리아 오이먀콘 영하 60도 텐트 vs 몰디브 무라카 해저 럭셔리 빌라
   - `WEIRD_ARCH`: 폴란드 케렛 하우스 92cm 틈새 집, 구룡성채 닭장방 vs 피에르 가르뎅 버블 팰리스, 네옴시티 더 라인
   - `MUSEUM_PUBLIC`: 러시아 흑돌고래 교도소 독방, 볼리비아 산페드로 교도소 vs 루브르 박물관 모나리자 VIP 살롱
   - `TOILET`: 인도 열차 낙하식 변소, 시베리아 얼어붙은 푸세식 변소 vs 홍콩 24K 순금 변기 스위트
   - `CLOSET`: 도쿄 0.5평 코인락커 거주지 vs 킹스맨 테일러샵 비밀 무기고, 나니아 옷장
   - `DOGHOUSE`: 시골 농가 녹슨 뜬장 vs 파리스 힐튼 2층 에어컨 애견 맨션, 황제펭귄 극지 생태 돔
   - `BOX`: 비에 젖은 라면 박스 은신처 vs 애플 스타일 360도 무이음 통유리 큐브 펜트하우스
   - `VEHICLE`: 폐차장 침수 티코 운전석, 인도 열차 지붕 vs 1조원 슈퍼요트 아잠, 오리엔트 익스프레스 스위트
   - `SPACESHIP`: ISS 고장난 화장실 모듈, 타버린 소유즈 캡슐 vs 보이저 스테이션 5성급 궤도 호텔
   - `FICTION_MEDIA`: 기생충 반지하 역류 변기, 설국열차 꼬리칸 vs 토니 스타크 말리부 맨션, 호빗골 백엔드
   - `IMAGINARY_CITY`: 메트로 2033 폐쇄역, 사이버펑크 파시피카 쓰레기장 vs 천공의 성 라퓨타, 솔라펑크 유토피아
   - `MULTIVERSE`: 블랙홀 사건의 지평선 찌그러진 4차원 틈새 vs 옴니버스 창조주 궁극의 펜트하우스 (`Lv.999`)
3. **페어 보존 리넘버링 사상 수식 (Pairwise Mapping Formula)**
   기존 500개 레벨의 $p = \lfloor \text{oldLv} / 2 \rfloor$ ($p = 0 \dots 249$)에 대하여:
   - 일반 페어 ($p = 0 \dots 248$):
     - $\text{oldEven} = 2p \longrightarrow \mathbf{\text{newLv} = 4p}$ (REAL)
     - $\text{oldOdd} = 2p + 1 \longrightarrow \mathbf{\text{newLv} = 4p + 1}$ (FICTION)
     - $\mathbf{\text{newLv} = 4p + 2}$ (신규 확장 REAL 하우스)
     - $\mathbf{\text{newLv} = 4p + 3}$ (신규 확장 FICTION 하우스)
   - 최상위 엔드포인트 ($p = 249$):
     - $\text{oldLv} = 498 \longrightarrow \mathbf{\text{newLv} = 996}$ (REAL)
     - $\mathbf{\text{newLv} = 997}$ (신규 확장 FICTION 하우스)
     - $\mathbf{\text{newLv} = 998}$ (신규 확장 REAL 하우스)
     - $\text{oldLv} = 499 \longrightarrow \mathbf{\text{newLv} = 999}$ (다중우주 창조주 펜트하우스 최종 정점 유지)
4. **`G:\My Drive\new_houses` 안전 역순(Descending) 파일명 변경 & 프롬프트 생성 파이프라인**
   - **Step 2.1 (파일명 변경)**:
     - $\text{newLv}(k) \ge k$ 이므로 $k = 499$에서 $0$으로 역순(Descending) 변경 시 타깃 파일 존재 충돌 0% 보장.
     - 별도 임시 파일 생성이나 이중 복사 없이 원자적 단일 패스 리네임 수행.
   - **Step 2.2 (신규 500개 프롬프트 파일 생성)**:
     - 비어 있는 500개 신규 슬롯에 대해 청크 데이터셋의 `geminiImagePrompt`를 추출하여 `{padded}.txt` UTF-8 생성.
     - `00000.txt` ~ `00999.txt` 총 1,000개 파일 완전성 검증.

### ✅ 완료 조건 (Acceptance Criteria)
- [x] `docs/EXPANSION_1000_STRATEGY_AND_KEYWORDS.md` 전략 및 가이드북 작성 완료
- [x] `docs/adr/ADR-008-1000-level-expansion-and-renumbering.md` 의사결정 문서 작성 완료
- [ ] 20개 청크 파일(`data/chunks/houses-chunk-*.json`) 1,000단계 확장 및 스키마 검증
- [ ] 사용자 승인 후 `Step 2.1` (`G:\My Drive\new_houses` 역순 리네임) 실행
- [ ] `Step 2.2` (신규 500개 프롬프트 텍스트 파일 생성) 실행 및 1,000개 무결성 검증

---


