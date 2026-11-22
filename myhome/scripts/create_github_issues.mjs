// scripts/create_github_issues.mjs
// https://github.com/bsj805/myhome 기능별 구현 이슈 자동 등록 스크립트

import { execSync } from 'child_process';

const repo = 'bsj805/myhome';

const ISSUES = [
  {
    title: '[Feature #1] 한글 자모·획수 기반 0~20,000 균등 해시 매핑 엔진(JSA-Hash-20001) 및 name_teller 5만 개 시드 확률분포 검증',
    body: `### 📌 배경 및 목적
- 한국어 이름(주로 2글자, 3글자, 복성 4글자)을 입력받았을 때 \`0\`부터 \`20,000\` 사이의 집 단계(총 20,001개 슬롯)로 결정론적(Deterministic)이고 균등하게 매핑해야 합니다.
- \`name_teller\` 프로젝트의 한글 자모 획수 합산 철학을 계승하되, 단순 획수 합산 시 \`6 ~ 50\` 구간에만 100% 몰리는 문제를 해결하여 **검색하는 모든 사용자가 거의 서로 다른 집 사진을 볼 수 있도록** 아발란체 하이브리드 해시를 구현합니다.

### 🛠️ 상세 구현 사항
1. **\`name_teller\` 한글 자모 획수 테이블 연동 (\`src/lib/hash.js\`)**
   - 초성(19개)·중성(21개)·종성(28개) 분해 및 자모별 획수(\`STROKES\`) 추출
   - 인접 글자 획수 조화값(\`(stroke[i] + stroke[i+1]) % 10\`, \`name_teller\` 이름점 방식) 반영
2. **\`JSA-Hash-20001\` (Jamo-Stroke Avalanche Hybrid Hash) 구현**
   - 글자 수(2자/3자/4자) 및 총 획수 시드 믹싱 + 음절 좌표/획수 32비트 레인 패킹 + Murmur3 \`fmix32\` 아발란체 종결자 적용
   - 입력 이름 정규화(NFC, 공백 제거) 및 \`0 ~ 20,000\` 정수 반환
3. **\`name_teller\` 50,000개 시드 이름 확률분포 테스트 (\`scripts/test_hash_distribution.mjs\`)**
   - \`C:\\Users\\USER\\Documents\\projects\\name_teller\\data\\compact_serving_names.json\`(25,150개) + \`korean_surnames_all.json\`(300개 성씨) 조합 50,000개 시드 검증

### 📊 사전 검증된 확률분포 벤치마크 결과 (\`N = 50,000\`)
- **점유 단계 수**: \`18,409 / 20,001 (92.04%)\` (이론적 포아송 균등 한계치 \`91.79%\` 달성)
- **카이제곱 균등성($\\chi^2$)**: \`19,873.1\` ($df = 20,000$, 이상적 균등분포 일치)
- **폭망집(\`0~9,999\`) : 대박집(\`10,000~20,000\`) 비율**: \`49.83% (24,916명) : 50.17% (25,084명)\`
- **짝수(실제 건축물) : 홀수(허구 건축물) 비율**: \`49.97% (24,986명) : 50.03% (25,014명)\`
- **글자 수별 균형**: 2글자 평균 \`9,911.0\`, 3글자 평균 \`10,068.6\` (10개 구간 모두 \`9.78% ~ 10.20%\` 균등 분포)

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 동일한 이름 입력 시 브라우저·서버(Worker) 어디서든 100% 동일한 \`0 ~ 20,000\` 값 반환
- [ ] 2글자/3글자/4글자 이름 간 구간 편향 없음 (폭망/대박 및 홀/짝 50:50 유지)
- [ ] \`scripts/test_hash_distribution.mjs\` 및 \`data/hash_distribution_report.json\` 검증 통과`
  },
  {
    title: '[Feature #2] 0~20,000단계(20,001종) 극단적 건물 마스터 택소노미 및 짝수(실제)/홀수(허구) 50:50 교차 데이터셋 설계',
    body: `### 📌 배경 및 목적
- 평범한 아파트나 일반 주택은 절대 나오지 않도록 배제하고, 사용자가 봤을 때 **황당하고 웃기게 만드는 극단적 컨셉트**로 \`0단계\`부터 \`20,000단계\`까지 마스터 기획 및 프롬프트 시드 테이블을 구축합니다.

### 🛠️ 상세 구현 사항
1. **구간별 극단적 가치/상태 분리 (1.1)**
   - **\`0 ~ 9,999단계 (10,000종)\`**: 극단적으로 안 좋은 집 (폭망 하우스 — 내핵 옆 마그마 반지하, 비 맞은 택배 상자, 푸세식 화장실, 개집, 아즈카반 독방, 구룡성채 등)
   - **\`10,000 ~ 20,000단계 (10,001종)\`**: 극단적으로 좋은 집 (대박 하우스 — 핵미사일 사일로 럭셔리 벙커, 하울의 움직이는 성, 아이언맨 말리부 저택, 부르즈 할리파 첨탑, 국제우주정거장 ISS, 다이슨 스피어, 다중우주 창조주 펜트하우스)
2. **짝수(실제 건축물) / 홀수(허구 건축물) 1단계 교차 배치 (1.0)**
   - **짝수 단계 (\`level % 2 === 0\`, 10,001종)**: 실제 존재하는(또는 역사상 실존했던) 기이한 건축물·사물·장소
   - **홀수 단계 (\`level % 2 === 1\`, 10,000종)**: 허구(상상·SF·판타지·영화/소설/애니·병맛 초현실)의 건축물·사물·장소
   - 1단계 올리면 허구, 거기서 1단계 올리면 실제 건축물이 나오도록 엄격히 교차 구성
3. **비(非)주택 12대 괴짜 카테고리 반영 (1.3, 1.4)**
   - 세계의 신기한 화장실, 옷장, 개집, 종이상자, 자동차/탈것, 우주선, 상상 속의 도시, 신기한 실제 건축물, 영화/소설 속 공간, 이색 박물관, 극한 자연물, 초차원 신전 등 12대 카테고리 매트릭스화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 평범한 아파트/일반 빌라/표준 주택 0건 보장
- [ ] 모든 \`0 ~ 20,000\` 단계에서 \`level % 2 === 0\`(실제) / \`level % 2 === 1\`(허구) 규칙 100% 준수
- [ ] \`0 ~ 9,999\`(안 좋은 집)와 \`10,000 ~ 20,000\`(좋은 집)의 건축 연도·추산 가치 스펙트럼 일관성 확보`
  },
  {
    title: '[Feature #3] Gemini 3.8 Flash 기반 20,001종 아트워크 생성 및 AI 병맛 감정서(건축연도·추산가치·특수기능) 파이프라인',
    body: `### 📌 배경 및 목적
- 실제 건축물 사진을 무단 수집하지 않고 **Gemini 3.8 Flash**를 통해 \`0 ~ 20,000\` 단계의 모든 집/사물/건물을 고유의 위트 있는 고화질 이미지로 생성합니다.
- 사진을 보여줄 때 **'언제 지어진 집인지'**, **'추산되는 가치는 얼마인지'**, **'집의 특별한 기능은 뭔지'**를 AI가 사진을 보고 황당하고 웃기게 지어내어 답변하도록 구축합니다.

### 🛠️ 상세 구현 사항
1. **Gemini 3.8 Flash 이미지 생성 파이프라인 (\`scripts/generate_houses_dataset.mjs\`)**
   - 짝수 단계(실제 건축물 모티프) 및 홀수 단계(허구 컨셉트)에 맞춘 프롬프트 템플릿 구성
   - WebP 포맷 고효율 압축 (\`1024×1024\` 본문용 및 OG 공유 대응)
2. **AI 멀티모달 감정평가서 생성 (비전 분석 → 병맛 텍스트 생성)**
   - \`builtYear\` (언제 지어진 집인지: 예 \`기원전 1만 년\`, \`2024년 화요일 장마철\`, \`서기 45,000년\`)
   - \`estimatedValue\` (추산 가치: 예 \`-999억 원(원상복구 벌금)\`, \`고물상 폐지 시세 430원\`, \`은하계 담보대출 9,999해 원\`)
   - \`specialFeature\` (집의 특별한 기능: 사진을 보고 AI가 지어낸 황당하고 웃긴 특수 기능 2~3문장)
   - \`aiVerdict\` (AI 감정평가사의 한 줄 총평)
3. **체크포인트 및 배치 재개(Resume) 지원**
   - 대량 생성 중 중단되더라도 이어서 생성할 수 있는 상태 관리 큐 구현

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] Gemini 3.8 Flash API 연동 및 이미지 + 메타데이터(\`builtYear\`, \`estimatedValue\`, \`specialFeature\`) 스키마 검증 완료
- [ ] 모든 단계 데이터에 결측값 없이 유머러스한 한국어 텍스트 생성 보장`
  },
  {
    title: '[Feature #4] Cloudflare R2 오브젝트 스토리지 구축 및 20,001종 이미지/메타데이터 초경량 청크 서빙 연동',
    body: `### 📌 배경 및 목적
- 20,001장의 집 이미지를 정적 호스팅(\`dist/\`) 내부에 넣으면 용량 및 파일 개수 제한을 초과하므로, **Cloudflare R2 오브젝트 스토리지**에 이미지를 저장하고 글로벌 CDN 캐시로 서빙합니다.

### 🛠️ 상세 구현 사항
1. **Cloudflare R2 버킷 설계 및 업로드 스크립트 (\`scripts/upload_r2_images.mjs\`)**
   - 버킷명: \`myhome-houses-r2\` (커스텀 도메인 \`img.myhome.tellmyname.app\` 또는 Worker R2 바인딩 \`/r2/houses/{level}.webp\`)
   - 객체 키 규격: \`houses/00000.webp\` ~ \`houses/20000.webp\`
   - \`Cache-Control: public, max-age=31536000, immutable\` 헤더 적용으로 R2 Class B 요청 및 대역폭 비용 최소화
2. **메타데이터 20개 청크 분할 압축 서빙 (\`dist/data/houses-chunk-00.json\` ~ \`19.json\`)**
   - 20,001개 집의 텍스트 메타데이터(제목, 건축연도, 추산가치, 특수기능)를 1,000단계 단위 20개 JSON 파일로 분할하여, 필요한 청크만 지연 로드(Lazy Fetch)하도록 최적화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`wrangler.toml\` 내 R2 버킷 바인딩(\`MYHOME_R2\`) 및 이미지 업로드/조회 유틸리티 완성
- [ ] 이미지 로딩 실패 시 재시도 및 우아한 폴백(Placeholder) 처리`
  },
  {
    title: '[Feature #5] 파일 개수를 늘리지 않는 Cloudflare 정적 호스팅 및 엣지 동적 SSR 라우터(myhome.tellmyname.app) 구현',
    body: `### 📌 배경 및 목적
- Cloudflare 정적 호스팅(Pages / Workers Assets)의 **파일 개수 제한(20,000개)**을 침범하지 않으면서도, 50,000개 이상의 이름 URL(\`https://myhome.tellmyname.app/name/{이름}\`)과 20,001개 단계 URL을 완벽한 SEO 문서로 응답해야 합니다.

### 🛠️ 상세 구현 사항
1. **무파일 증식(Zero-File-Explosion) 빌드 구조**
   - \`dist/\` 폴더 내 물리적 파일 개수를 **총 30개 이내**(\`index.html\`, JS/CSS 번들, 20개 메타 청크 JSON, \`sitemap*.xml\`, \`robots.txt\`, \`rss.xml\`)로 엄격히 제한
2. **Cloudflare Worker 엣지 동적 SSR 라우터 (\`worker.js\`)**
   - \`GET /name/:name\` 또는 \`GET /:name\` 요청 수신 시:
     1. \`JSA-Hash-20001(name)\`으로 즉시 집 단계(\`0 ~ 20,000\`) 계산
     2. 해당 단계의 집 메타데이터(제목, 건축연도, 추산가치, 특수기능, R2 이미지 URL) 조회
     3. 기본 \`index.html\` 템플릿에 \`<title>\`, \`<meta name="description">\`, \`<meta property="og:title">\`, \`<meta property="og:description">\`, \`<meta property="og:image">\`, \`<link rel="canonical">\`, \`JSON-LD\`, 그리고 크롤러용 \`<article id="seo-house-card">\` 본문 HTML을 실시간 주입하여 반환
3. **커스텀 도메인 설정 (\`myhome.tellmyname.app\`)**
   - \`wrangler.toml\` 및 Canonical Origin을 \`https://myhome.tellmyname.app\`으로 일원화

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`dist/\` 내 총 파일 개수 50개 미만 유지 (Cloudflare 정적 호스팅 즉시 배포 가능)
- [ ] \`curl https://myhome.tellmyname.app/name/김서윤\` 요청 시 JS 실행 없이도 완성된 OG 태그와 본문 HTML이 응답됨`
  },
  {
    title: '[Feature #6] name_teller 50,000개 시드 이름 분할 Sitemap 자동 생성 및 네이버(Yeti)·구글 Programmatic SEO 구축',
    body: `### 📌 배경 및 목적
- 검색 노출을 극대화하기 위해 \`C:\\Users\\USER\\Documents\\projects\\name_teller\`의 이름 데이터에서 추출한 **50,000개 이름**을 Sitemap에 등록하고, **네이버 검색(Yeti)**과 **구글 검색(Googlebot)**에 완벽히 색인되도록 구현합니다.

### 🛠️ 상세 구현 사항
1. **50,000개 이름 Sitemap 자동 빌더 (\`scripts/generate_static_site.mjs\`)**
   - \`name_teller\`의 순수 이름 15,000개 + 주요 성씨 결합 이름 35,000개 = **총 50,000개 이름 URL** 생성
   - XML Sitemap 표준에 맞춰 25,000개씩 \`sitemap-names-1.xml\`, \`sitemap-names-2.xml\`로 분할하고, 루트 \`sitemap.xml\`(Sitemap Index)에서 통합 연결
2. **네이버 서치어드바이저(Yeti) & 구글 서치콘솔 친화형 설정**
   - \`robots.txt\`: \`User-agent: Yeti\`, \`User-agent: Googlebot\` 전면 \`Allow: /\` 및 사이트맵·RSS 경로 명시
   - \`rss.xml\`: 네이버 서치어드바이저 RSS 제출 규격에 맞춘 최신/인기 이름 집 감정 피드 자동 생성
   - 네이버 소유권 확인 메타태그 및 한국어 키워드 최적화(\`"{이름}에게 어울리는 집", "{이름} 미래 집 감정", "나에게 어울리는 집"\`)
   - \`Schema.org\` (\`WebPage\`, \`FAQPage\`, \`Residence\`) 구조화 데이터 삽입

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] \`sitemap-names-1.xml\`(25,000개) + \`sitemap-names-2.xml\`(25,000개) = 총 50,000개 유효 URL 생성 검증
- [ ] \`robots.txt\` 및 \`rss.xml\` 유효성 검증 통과`
  },
  {
    title: '[Feature #7] 프론트엔드 UI/UX — 이름 검색, 부동산 감정평가서 카드 및 [이전 단계 / 다음 단계 / 랜덤 집 보기] 탐색기 구현',
    body: `### 📌 배경 및 목적
- 사용자가 이름을 입력하면 황당하고 웃긴 부동산 감정평가서/등기권리증 컨셉으로 집 이미지와 상세 스펙을 보여주고, **다음 단계 집 보기 / 이전 단계 집 보기 / 랜덤 집 보기**를 누르며 끝없이 탐색할 수 있는 인터랙티브 웹앱을 구현합니다.

### 🛠️ 상세 구현 사항
1. **이름 검색바 & 감정 도장 애니메이션**
   - 한글/영문 이름 입력 및 엔터/버튼 클릭 시 \`/name/{이름}\`으로 History API 라우팅
2. **『다중우주 부동산 감정평가서』 결과 카드 UI**
   - **단계 및 속성 배지**: \`Lv. 0 ~ 20,000\` | \`💀 폭망 하우스 (0~9999)\` vs \`🌟 대박 하우스 (10000~20000)\` | \`🏛️ 실제 존재하는 건축물 (짝수)\` vs \`🦄 허구 건축물 (홀수)\`
   - **3대 필수 정보 영역**:
     1. 📅 **언제 지어진 집인지 (\`builtYear\`)**
     2. 💰 **추산되는 가치는 얼마인지 (\`estimatedValue\`)**
     3. ⚡ **집의 특별한 기능은 뭔지 (\`specialFeature\` — AI 병맛 해설)**
3. **3버튼 탐색 컨트롤러 (요구사항 4)**
   - **\`[◀ 이전 단계 집 보기 (Lv. N-1)]\`**: 1단계 아래 집 로드 (실제 ↔ 허구 교차 확인)
   - **\`[🎲 랜덤 집 보기]\`**: \`0 ~ 20,000\` 중 무작위 단계 집 로드
   - **\`[다음 단계 집 보기 (Lv. N+1) ▶]\`**: 1단계 위 집 로드
   - 탐색 중 언제든 원래 검색한 내 이름의 집으로 돌아오는 \`[🏠 내 집(이름)으로 복귀]\` 버튼 제공

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 모바일/데스크톱 반응형 UI 및 R2 이미지 프리로딩(인접 \`N-1\`, \`N+1\` 단계 사전 프리패치) 적용
- [ ] 이전/다음/랜덤 버튼 클릭 시 끊김 없는 즉각 전환 및 키보드 방향키(\`←\`, \`→\`, \`Space\`) 단축키 지원`
  },
  {
    title: '[Feature #8] 이름 고정 URL(myhome.tellmyname.app/name/{이름}) 기반 인스타그램 스토리(9:16 캔버스)·카카오톡 공유 기능 구현',
    body: `### 📌 배경 및 목적
- 이름이 URL에 포함되어 해당 이름으로 요청하면 항상 같은 페이지가 열리도록 하고(\`https://myhome.tellmyname.app/name/{이름}\`), 이를 통해 인스타그램 스토리, 카카오톡 등으로 손쉽게 공유할 수 있게 합니다.

### 🛠️ 상세 구현 사항
1. **이름 영구 URL 라우팅 & 클립보드 공유**
   - \`https://myhome.tellmyname.app/name/{이름}\` 고정 URL 생성 및 원클릭 링크 복사 토스트 알림
2. **카카오톡 공유 & 동적 OG 미리보기 연동**
   - 카카오톡 채팅방에 링크 공유 시 \`[김서윤님에게 어울리는 집: Lv.4,478]\`, 추산 가치, R2 집 이미지가 즉시 카드 형태로 렌더링되도록 OG 태그 및 Web Share API 연동
3. **인스타그램 스토리 전용 9:16(\`1080×1920\`) 캔버스 이미지 렌더러**
   - 집 이미지 + \`{이름}님의 미래 집 등기권리증\` + \`Lv. {단계}\` + 건축연도 + 추산가치 + AI 특수기능 + \`myhome.tellmyname.app\` 워터마크가 합성된 고해상도 PNG 카드 다운로드 및 모바일 즉시 공유 지원

### ✅ 완료 조건 (Acceptance Criteria)
- [ ] 공유된 \`https://myhome.tellmyname.app/name/{이름}\` 접속 시 언제나 100% 동일한 집과 감정 결과 표시
- [ ] 인스타그램 9:16 스토리 이미지 저장 및 모바일 네이티브 공유(Web Share API) 정상 작동`
  }
];

for (let i = 0; i < ISSUES.length; i++) {
  const issue = ISSUES[i];
  const tmpFile = `data/tmp_issue_${i + 1}.md`;
  await import('fs').then(fs => fs.writeFileSync(tmpFile, issue.body, 'utf8'));
  const out = execSync(
    `gh issue create --repo ${repo} --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tmpFile}"`,
    { encoding: 'utf8' }
  );
  await import('fs').then(fs => fs.unlinkSync(tmpFile));
  console.log(`Created: ${out.trim()}`);
}
