// scripts/create_github_issues_v2.mjs
// https://github.com/bsj805/myhome 신규 기능 구현 이슈(#10 ~ #16) 자동 등록 스크립트

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const repo = 'bsj805/myhome';

const NEW_ISSUES = [
  {
    number: 10,
    title: '[Feature #10] 14개 다국어(ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms) 글로벌 확장 및 다국어 SEO (hreflang / Edge SSR) 구축',
    body: `### 📌 배경 및 목적
- 국내(한국어) 타깃을 넘어 전 세계 사용자 유입 및 글로벌 바이럴을 달성하기 위해, 인터넷 사용 인구가 가장 많은 14개 주요 언어(한국어, 영어, 힌디어, 베트남어, 프랑스어, 포르투갈어, 스페인어, 인도네시아어, 러시아어, 독일어, 이탈리아어, 일본어, 중국어, 말레이어)로 서비스 UI와 메타데이터를 전면 로컬라이즈합니다.
- 각 언어별로 독립적인 URL 파라미터/경로 및 검색엔진(Google, Yandex, Yahoo Japan, Baidu 등) 맞춤 \`hreflang\` 태그, 동적 OpenGraph 및 Schema.org 다국어 구조화 데이터를 구축합니다.

### 🛠️ 상세 구현 사항
1. **14개 언어 정의 및 사전 체계 (\`src/lib/i18n.js\`)**
   - 지원 언어 코드: \`ko\`(한국어), \`en\`(영어), \`hi\`(힌디어), \`vi\`(베트남어), \`fr\`(프랑스어), \`pt\`(포르투갈어), \`es\`(스페인어), \`id\`(인도네시아어), \`ru\`(러시아어), \`de\`(독일어), \`it\`(이탈리아어), \`ja\`(일본어), \`zh\`(중국어 간체), \`ms\`(말레이어)
   - 공통 UI 사전: 서비스 타이틀, 검색창 플레이스홀더, 버튼 라벨("내 집 찾기", "이전/다음/랜덤 집", "내 이름으로 복귀"), 감정평가서 항목명("건축 연도", "추산 가치", "특별한 기능", "AI 총평"), 소셜 공유 문구("○○님에게 어울리는 집") 등 14개 언어 번역 매트릭스 제공
   - 언어 감지 우선순위: \`URL 파라미터(?lang=xx)\` > \`경로(/lang/)\` > \`로컬스토리지\` > \`Accept-Language\` 헤더 > 기본값(\`ko\` or \`en\`)
2. **반응형 다국어 셀렉터 UI (\`web/index.html\`, \`web/js/app.js\`)**
   - 헤더 영역에 국기/언어명 드롭다운 셀렉터 컴포넌트 추가
   - 언어 변경 시 즉각 클라이언트 텍스트 리렌더링 및 로컬스토리지 동기화
3. **Cloudflare Worker Edge SSR 다국어 태그 동적 주입 (\`worker.js\`)**
   - \`<html lang="{lang}">\` 동적 설정
   - 다국어 교차 참조 태그 주입:
     \`\`\`html
     <link rel="alternate" hreflang="x-default" href="https://myhome.tellmyname.app/" />
     <link rel="alternate" hreflang="ko" href="https://myhome.tellmyname.app/?lang=ko" />
     <link rel="alternate" hreflang="en" href="https://myhome.tellmyname.app/?lang=en" />
     <!-- 14개 언어 hreflang 전개 -->
     \`\`\`
   - 언어별 로컬라이즈된 OpenGraph (\`og:title\`, \`og:description\`, \`og:locale\`) 및 Schema.org (\`inLanguage\`, \`WebPage\`, \`Residence\`) 생성

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 14개 언어에 대한 \`i18n.js\` 사전 데이터 완성 및 단위 테스트 통과
- [ ] 웹 화면 상단 다국어 셀렉터를 통해 14개 언어 UI 실시간 전환 정상 작동
- [ ] Edge SSR 시 언어 감지에 따른 \`<html lang="...">\`, \`hreflang\` 태그 및 \`og:*\` 메타데이터 실시간 주입 검증`
  },
  {
    number: 11,
    title: `[Feature #11] 다국어 인스타그램 스토리(9:16 캔버스) & 카카오톡 공유 고도화 ('{이름}님에게 어울리는 집은 → 사진 → 사진 설명' 3단 레이아웃 및 다국어 다운로드/공유)`,
    body: `### 📌 배경 및 목적
- SNS 공유 시 직관적인 시각적 몰입도와 바이럴 확산력을 극대화하기 위해, 인스타그램 스토리 전용 9:16(\`1080×1920\`) 고해상도 캔버스 카드 레이아웃을 **'{이름}님에게 어울리는 집은' 상단 헤더 → '고화질 집 사진' 중앙 배치 → '건축연도·추산가치·특수기능' 하단 스펙 요약**의 3단 수직 구조로 전면 업그레이드합니다.
- 14개 다국어 지원에 맞추어 언어별 카드 번역 및 네이티브 모바일 공유(\`navigator.share\`)를 연동합니다.

### 🛠️ 상세 구현 사항
1. **3단 수직 카드 레이아웃 (\`web/js/share.js\`)**
   - **상단 섹션 (Header)**:
     - 한국어: \`"{이름}님에게 어울리는 집은"\` + 단계 배지 (\`Lv. {level} · {TierName}\`)
     - 영어: \`"The House That Suits {Name}"\`
     - 14개 다국어 템플릿에 맞춰 감각적인 그라데이션 타이포그래피 렌더링
   - **중앙 섹션 (Hero Image)**:
     - 9:16 카드 프레임에 최적화된 고화질 집 사진 렌더링 (그림자 및 테두리 라운딩 효과)
   - **하단 섹션 (Appraisal Specs & AI Verdict)**:
     - 📅 건축 연도 (\`Built Year\`)
     - 💰 추산 가치 (\`Estimated Value\`)
     - ⚡ 특별한 기능 (\`Special Feature\`)
     - 🤖 AI 총평 (\`AI Verdict\`)
     - 하단 워터마크 & 도메인: \`myhome.tellmyname.app\`
2. **14개 다국어 카드 렌더링 & 고해상도 PNG 출력**
   - 현재 선택된 언어에 맞춰 캔버스 폰트 및 라벨 자동 변환
   - \`HTMLCanvasElement.toBlob\` 고품질 PNG 내보내기 (다운로드 지원)
3. **모바일 네이티브 공유 및 카카오톡 연동**
   - 모바일 환경(\`navigator.canShare({ files })\`): 인스타그램 스토리 / 카카오톡 등으로 이미지 파일 즉시 공유
   - 데스크톱 환경: 즉시 이미지 파일 저장 및 클립보드 URL 복사 토스트 팝업

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 1080×1920 캔버스 3단 구조(타이틀 헤더 → 사진 → 상세 스펙) 정확한 좌표 렌더링
- [ ] 14개 언어별 카드 타이틀 및 스펙 라벨 번역 정상 적용
- [ ] 모바일 기기에서 인스타그램 스토리 및 카카오톡 이미지 파일 공유 정상 작동`
  },
  {
    number: 12,
    title: '[Feature #12] Google AdSense 공식 스크립트(ca-pub-8793936135959956) 탑재 및 ads.txt 퍼블리셔 인증 연동',
    body: `### 📌 배경 및 목적
- 글로벌 및 국내 트래픽 유입에 대응하여 안정적인 수익화(Monetization) 기반을 마련하기 위해 공식 구글 애드센스 퍼블리셔 코드(\`ca-pub-8793936135959956\`)를 탑재하고, \`ads.txt\` 퍼블리셔 인증 규격을 준수합니다.
- 광고 로드로 인한 레이아웃 이동(CLS: Cumulative Layout Shift)을 0으로 유지하여 Core Web Vitals 점수를 방어합니다.

### 🛠️ 상세 구현 사항
1. **Google AdSense SDK 태그 주입**
   - 대상 파일: \`web/index.html\`, \`public/privacy.html\`, \`public/terms.html\`
   - 스크립트:
     \`\`\`html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>
     \`\`\`
2. **공식 \`ads.txt\` 레코드 배포 (\`dist/ads.txt\`)**
   - 내용: \`google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\`
   - 루트 도메인(\`https://myhome.tellmyname.app/ads.txt\`) 및 정적 파일 빌드 파이프라인(\`scripts/generate_static_site.mjs\`)에 누락 없이 복사되도록 구성
3. **CLS=0 반응형 광고 슬롯 레이아웃 설계**
   - 집 감정 카드 상단/하단 영역에 사전 높이(예: \`min-height: 90px;\` or \`min-height: 250px;\`)가 확보된 반응형 광고 컨테이너(\`adsbygoogle\`) 배치
   - 비동기 로딩 시 콘텐츠 밀림 현상 방지

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`web/index.html\`, \`privacy.html\`, \`terms.html\` 내 애드센스 공식 스크립트 탑재 확인
- [ ] \`curl https://myhome.tellmyname.app/ads.txt\` 요청 시 정확한 퍼블리셔 ID 및 인증 해시 반환 확인
- [ ] 광고 슬롯의 고정 높이 지정으로 광고 노출 전후 CLS 발생 방지`
  },
  {
    number: 13,
    title: '[Feature #13] 단계별 탐색기 고도화 — 스크롤 텍스트 전용 프리뷰(이미지 블러/잠금), 페이지 진입 시 이미지 공개, Sitemap 등록 이름 역매핑 자동 라우팅(/name/{이름})',
    body: `### 📌 배경 및 목적
- 이전/다음/랜덤 단계 탐색 시 호기심과 도파민을 자극하는 UX를 구축합니다.
- 스크롤 가능한 단계별 프리뷰 목록에서는 **집의 황당한 설명과 스펙만 먼저 텍스트로 노출하고 이미지는 잠금(블러 처리/실루엣)** 상태로 유지하여 사용자의 클릭을 유도하고, 상세 페이지로 진입하는 순간 고화질 집 사진이 언락(공개)되도록 구현합니다.
- 또한 검색엔진 Sitemap에 등록된 50,000개 대표 시드 이름과 각 단계를 역매핑(\`levelToNameMap\`)하여, 단계 번호(\`/level/N\`)로 접근하더라도 해당 단계에 매핑된 대표 이름이 있으면 자동으로 \`/name/{이름}\` 경로로 URL을 리라이트/리다이렉트하여 SEO 및 공유 효율을 극대화합니다.

### 🛠️ 상세 구현 사항
1. **스크롤 텍스트 전용 프리뷰 모달 / 사이드 패널 (\`web/js/app.js\`, \`web/css/style.css\`)**
   - 인접 및 전체 단계의 텍스트 목록(단계 번호, 티어, 집 이름, 건축연도, 추산가치 요약) 스크롤 UI
   - 이미지 영역: 자물쇠 아이콘 + "페이지 진입 시 사진 공개" 문구 및 스포일러 방지 블러/플레이스홀더 적용
2. **페이지 진입 시 사진 언락 애니메이션**
   - 해당 단계 클릭 또는 이전/다음 버튼을 통해 페이지 진입 시, 화려한 도장 날인/언락 애니메이션과 함께 고화질 집 사진 노출
3. **Sitemap 등록 이름 역매핑 자동 라우팅 (\`levelToNameMap\`)**
   - 50,000개 시드 이름 빌드 시 각 레벨(\`0 ~ 499\`)을 대표하는 최적의 시드 이름을 사전 역매핑 인덱스로 생성
   - \`/level/{level}\` 진입 시, 해당 레벨에 등록된 시드 이름이 존재하면 브라우저 History 및 Edge SSR에서 자동으로 \`/name/{대표이름}\`으로 canonical 라우팅

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 텍스트 전용 단계 프리뷰 리스트 렌더링 및 이미지 블러/잠금 상태 유지 확인
- [ ] 프리뷰 항목 클릭 또는 이전/다음 탐색 시 상세 화면에서 고화질 사진 정상 언락
- [ ] \`/level/N\` 접속 시 \`levelToNameMap\`에 따라 \`/name/{이름}\`으로 매끄러운 자동 라우팅 검증`
  },
  {
    number: 14,
    title: '[Feature #14] Cloudflare Workers & Assets (신규 정적 호스팅 아키텍처) 배포 파이프라인 및 npx wrangler deploy 가이드 구축',
    body: `### 📌 배경 및 목적
- 레거시 Cloudflare Pages 방식(정적 호스팅과 Functions 분리 구조)에서 최신 통합 아키텍처인 **Cloudflare Workers with Static Assets** (\`[assets]\` 바인딩)로 마이그레이션합니다.
- 단 한 번의 \`npx wrangler deploy\` 명령어로 정적 자산(\`dist/\`) 서빙과 엣지 SSR 라우팅(\`worker.js\`)을 무중단 배포할 수 있는 단일화된 파이프라인 및 공식 가이드 문서를 구축합니다.

### 🛠️ 상세 구현 사항
1. **\`wrangler.toml\` 신규 Assets 스펙 구성**
   - 레거시 호스팅 설정 제거 및 Workers Assets 블록 구성:
     \`\`\`toml
     name = "myhome"
     main = "worker.js"
     compatibility_date = "2024-11-01"
     compatibility_flags = ["nodejs_compat"]

     [assets]
     directory = "./dist"
     binding = "ASSETS"
     run_worker_first = true
     \`\`\`
   - \`run_worker_first = true\`를 통해 엣지 SSR 라우터(\`worker.js\`)가 먼저 요청을 가로채 \`/name/:name\`, \`/level/:level\` 동적 SEO를 처리하고 정적 자산(CSS/JS/이미지)은 \`env.ASSETS.fetch(request)\`로 초고속 위임
2. **통합 빌드 & 배포 커맨드 표준화**
   - \`npm run build\`: \`node scripts/generate_static_site.mjs\` 실행을 통해 \`dist/\` 내 번들, 인덱스 파일, 사이트맵 생성
   - \`npm run deploy\`: \`npx wrangler deploy\` 실행으로 즉시 글로벌 엣지 네트워크 배포
3. **배포 가이드 문서 작성 (\`docs/CLOUDFLARE_DEPLOY_GUIDE.md\` 및 ADR)**
   - 사전 요구사항(Cloudflare 계정, Wrangler 인증, R2 바인딩)
   - 빌드 및 배포 순서, 환경 변수 설정, 커스텀 도메인(\`myhome.tellmyname.app\`) 연결 절차 문서화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`wrangler.toml\`의 \`[assets]\` 설정 및 Worker 연동 구문 검증
- [ ] \`npm run build && npx wrangler deploy\` 단일 파이프라인 구축 완료
- [ ] \`docs/CLOUDFLARE_DEPLOY_GUIDE.md\` 및 배포 가이드 문서 작성 완료`
  },
  {
    number: 15,
    title: '[Feature #15] 14개 언어별 유명 이름 50,000개 균등 Sitemap 구축 및 글로벌 이미지 검색 SEO ("{name} house recommendation", "{name} house image")',
    body: `### 📌 배경 및 목적
- 글로벌 14개 언어권(한국어, 영어, 힌디어, 베트남어, 프랑스어, 포르투갈어, 스페인어, 인도네시아어, 러시아어, 독일어, 이탈리아어, 일본어, 중국어, 말레이어)의 검색 유입을 균등하게 확보하기 위해, 각 언어별 약 3,571개씩 총 **50,000개의 글로벌 유명 인명 데이터셋**을 구축합니다.
- 특히 Google 이미지 검색에서 \`"{name} house recommendation"\`, \`"{name} house image"\`, \`"{name}님에게 어울리는 집\` 등의 검색 쿼리를 선점할 수 있도록 Image SEO 구조화 및 이미지 전용 사이트맵(\`/sitemap-images.xml\`)을 배포합니다.

### 🛠️ 상세 구현 사항
1. **14개 언어권 50,000개 인명 데이터셋 생성 (\`scripts/build_seed_50k_names.mjs\`)**
   - 언어별 약 3,571개 (14 × 3,571 ≈ 50,000개) 대표 인명 및 유명인 이름 수집
   - 영어(\`Steve\`, \`Emma\`, \`Liam\`), 스페인어(\`Carlos\`, \`Sofia\`), 일본어(\`Kenji\`, \`Yuki\`), 프랑스어, 힌디어, 중국어 등 전 세계 주요 언어권 포함
2. **다국어 분할 사이트맵 & 이미지 사이트맵 자동 생성 (\`scripts/generate_static_site.mjs\`)**
   - \`dist/sitemap-names-1.xml\` (25,000개)
   - \`dist/sitemap-names-2.xml\` (25,000개)
   - \`dist/sitemap-images.xml\`: 각 이름 페이지의 대표 집 이미지 URL, \`<image:loc>\`, \`<image:title>\`, \`<image:caption>\` 메타태그 등록
   - \`dist/sitemap.xml\`: 사이트맵 인덱스로 위 파일들 총괄 참조
3. **프로그래매틱 이미지 검색 SEO 최적화**
   - Edge SSR 렌더링 시 \`<img>\` 태그에 언어별 검색 키워드가 반영된 \`alt\`, \`title\` 속성 주입
   - Google \`Schema.org/ImageObject\` 구조화 데이터 연동

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 14개 언어권 50,000개 인명 데이터셋 무결성 검증 및 균등 분배 확인
- [ ] \`sitemap-names-1.xml\`, \`sitemap-names-2.xml\`, \`sitemap-images.xml\`, \`sitemap.xml\` 생성 완료
- [ ] Googlebot 이미지 검색 크롤러 규격(\`image:image\`, \`image:loc\`, \`image:caption\`) 충족 확인`
  },
  {
    number: 16,
    title: '  [Feature #16] 0~499단계(500종) 마스터 데이터셋 통합 및 G:\\My Drive\\new_houses 로컬 이미지 즉시 서빙 연동'.trim(),
    body: `### 📌 배경 및 목적
- 기 구축된 20개 티어 × 티어당 25개 레벨 = 총 500종(\`Lv.0 ~ Lv.499\`)의 완성형 마스터 데이터셋을 프로젝트 전반(\`constants.js\`, \`master_dataset.js\`, \`taxonomy.js\`, \`r2_storage.js\`, \`worker.js\`, \`dev_server.mjs\`)에 단일 표준으로 통합합니다.
- 로컬 개발 환경(\`scripts/dev_server.mjs\`) 및 R2 서빙 라우터에서 로컬 \`G:\\My Drive\\new_houses\` 디렉터리에 새로 수집·생성된 고화질 실사/일러스트 이미지(\`.png\`, \`.webp\`, \`.json\`)를 최우선 즉시 서빙하도록 파이프라인을 연결합니다.

### 🛠️ 상세 구현 사항
1. **500종(\`Lv.0 ~ Lv.499\`) 마스터 데이터셋 통일**
   - \`src/lib/constants.js\`: \`TOTAL_LEVELS = 500\`, \`TIERS = 20\`, 티어당 25개 레벨 매핑
   - \`src/lib/master_dataset.js\` 및 \`data/master_dataset_500.json\` 일원화:
     - 짝수 단계(250종): 위키미디어/Flickr 공용 라이선스 기반 실존 이색 건축물 대표 실사 사진 및 출처 메타데이터
     - 홀수 단계(250종): Gemini 고화질 병맛/SF/판타지/초현실 일러스트
   - 폭망(0~249, 10개 티어) vs 대박(250~499, 10개 티어) 50:50 황금 밸런스 유지
2. **\`G:\\My Drive\\new_houses\` 로컬 우선 스트리밍 서빙**
   - \`scripts/dev_server.mjs\`에 미들웨어 추가:
     - \`/r2/houses/{padded}.png\` 또는 \`.webp\` 요청 시:
       1순위: \`G:\\My Drive\\new_houses\\{padded}.png\` (또는 \`.webp\`) 존재 시 즉시 로컬 파일 스트리밍
       2순위: \`G:\\My Drive\\houses\\{padded}.png\` 기존 아카이브 폴백
       3순위: Cloudflare R2 원격 버킷
       4순위: 동적 엣지 SVG 플레이스홀더
     - 라이선스 및 상세 정보 JSON 파일(\`G:\\My Drive\\new_houses\\{padded}.json\`) 동시 서빙
3. **프로덕션 R2 동기화 스크릴트 대응 (\`scripts/upload_r2_images.mjs\`)**
   - \`G:\\My Drive\\new_houses\` 내 500종 이미지 및 메타데이터를 일괄 WebP 압축 및 R2 버킷 동기화 기능 지원

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`TOTAL_LEVELS = 500\` 및 20개 티어 구조로 전체 모듈(해시, SSR, 정적 빌더, 프론트엔드) 동기화
- [ ] 로컬 개발 서버 구동 시 \`G:\\My Drive\\new_houses\` 경로의 이미지가 즉시 브라우저에 표시됨 확인
- [ ] 500개 전 레벨에 대한 데이터 누락 없음 검증`
  }
];

const tmpDir = path.resolve('C:/Users/USER/.gemini/antigravity/brain/14f0a6be-08a5-44b3-b34a-da8236e5aabc/scratch');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log(`Starting creation of GitHub issues #10 ~ #16 for ${repo}...`);

for (const issue of NEW_ISSUES) {
  const tmpFile = path.join(tmpDir, `tmp_issue_${issue.number}.md`);
  fs.writeFileSync(tmpFile, issue.body, 'utf8');

  try {
    const cmd = `gh issue create --repo ${repo} --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tmpFile}"`;
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(`[Success] Created Issue #${issue.number}: ${out.trim()}`);
  } catch (err) {
    console.error(`[Error] Failed to create Issue #${issue.number}:`, err.message);
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

console.log('Finished creating GitHub issues!');
