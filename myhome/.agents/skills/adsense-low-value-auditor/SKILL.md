---
name: adsense-low-value-auditor
description: Google AdSense "Low Value Content(가치가 낮은 콘텐츠)" 거절 원인을 사전 진단·수정하고, 컨텍스트 없는 독립 브라우저 서브에이전트(Neon)로 라이브 사이트를 반복 감사하는 종합 AdSense 품질 점검 스킬. 애드센스 승인·재심사 준비, Thin/Template 콘텐츠 감사, 단일 도메인 통합 라우팅 및 모바일/데스크톱 UX 점검 시 활성화한다.
---

# AdSense Low Value Content Auditor

Google AdSense의 **Low Value Content(가치가 낮은 콘텐츠)**, **Thin Content**, **Site Behavior: Navigation**, **Shocking Content** 거절 요인을 코드·데이터·라이브 브라우저 3단계로 전수 점검하고, **컨텍스트가 전혀 없는 독립 브라우저 서브에이전트**의 객관적 심사를 반복 통과할 때까지 개선하는 표준 절차입니다.

---

## 1. 핵심 점검 체크리스트 (7대 영역)

### A. 도메인 구조 및 탐색 일관성 (Navigation & Architecture)
- [ ] **브리지(Bridge/Portal) 페이지 제거**: 루트 도메인(`/`)이 단순 외부 링크 목록이 아니라 실질적인 핵심 콘텐츠·도구·가이드를 즉시 제공하는지 확인.
- [ ] **단일 도메인 내부 경로 통합**: 형제 서비스를 외부 서브도메인(`a.domain.com`, `b.domain.com`)으로 흩어 보내지 않고, 루트 도메인 하위 내부 경로(`/food`, `/job`, `/car`)로 묶어 체류 시간과 내부 링크를 집중시켰는지 확인.
- [ ] **서브패스 프리픽스 보존**: 내부 라우팅된 서브 앱(`/job`, `/car`, `/food`)에서 이전/다음/랜덤/월드컵/푸터 링크가 루트(`/level/*`)로 이탈하지 않고 자신의 프리픽스(`/job/level/*`, `/car/level/*`)를 유지하는지 확인.
- [ ] **에셋 경로 및 MIME 무결성**: 서브패스 하위의 JS 모듈(`/src/lib/*`, `/js/*`), 이미지(`/images/web/*`, `/r2/*`)가 SPA HTML fallback(`text/html`)으로 떨어지지 않고 정상 MIME 타입과 `HTTP 200`을 반환하는지 확인.

### B. 콘텐츠 고유성 및 템플릿성(Thin/Programmatic) 배제
- [ ] **데이터셋 중복 0건**: 한국어·영문 타이틀, 설명, 연대, 가격, 평가 필드에 반복 복붙 문자열이나 기계적 일련번호(`#512`, `제331구역`, `Vault #NNN`)가 없는지 확인.
- [ ] **카테고리/문맥 불일치 제거**: 실존 건축물에 차량 카테고리가 붙거나, 무관한 직업 설명에 같은 문구가 복붙되는 오류를 전수 교정.
- [ ] **에디토리얼 가이드(Whitepaper) 확보**: 단순 인터랙티브 카드 1장만 있는 얇은 페이지가 되지 않도록, 루트 및 주요 서브 라우트에 독창적인 서비스 원리·카테고리 해설·FAQ 섹션을 제공.
- [ ] **도어웨이 URL 금지**: `sitemap.xml`에 `/name/*` 같은 무한 조합 URL을 넣지 않고 고유 콘텐츠 URL(`/level/*`, `/food/*`, `/gallery`, `/worldcup*`)만 등록.

### C. 정책 안전성 (Google Publisher Policies)
- [ ] **기본 랜딩 콘텐츠 안전성**: 한국어(`?lang=ko`)뿐 아니라 **영문(`?lang=en`, 미국 심사 봇 기본 환경)** 첫 화면(Above the Fold)의 기본 샘플 결과가 폭력·고문·유혈·혐오·선정적 묘사를 포함하지 않는지 확인.
- [ ] **SEO 키워드 스터핑 금지**: 이미지 `alt`, `<meta name="description">`, `<meta name="keywords">`에 `"{name} car recommendation, {name} vehicle image"` 같은 기계적 영문 키워드 나열이 없는지 확인.

### D. 다국어·`<title>`·메타 정합성
- [ ] **`<title>` 동기화**: 언어 전환(`?lang=en` 등)과 탭/상세 페이지 이동 시 `<title>`이 현재 언어·화면과 일치하며 Raw i18n 키(`brandName`, `navGallery`, `origin_MICHELIN`)나 중복 문자열이 노출되지 않는지 확인.
- [ ] **한글(`[가-힣]`) 누출 0건**: 외국어 모드(`?lang=en`)에서 가시 본문, 플로팅 바, 푸터, 통화 단위(`원`/`₩`), 샘플 칩, `aria-label`에 미번역 한글이 남지 않았는지 확인.

### E. E-E-A-T 및 법적 문서 투명성
- [ ] **필수 법적 페이지 `HTTP 200`**: `/about.html`, `/privacy.html`, `/terms.html`, `/contact.html`이 리다이렉트 루프나 404 없이 `200 OK`로 서빙되는지 확인 (`wrangler.toml`에서 `html_handling = "none"` 권장).
- [ ] **통합 범위 및 Zero-Storage 일관성**: `about.html`과 `privacy.html`이 현재 도메인에서 제공하는 **모든 서브 서비스**를 정확히 명시하고, 운영자·연락처·Zero-Storage 원칙·Google AdSense 쿠키·GDPR/CMP 고지 및 **영문 요약(English Summary)** 을 포함하는지 확인.

### F. 모바일(`390×844`) & 데스크톱(`1280×800`) UI/UX 품질
- [ ] **가로 오버플로우 0건**: 모든 주요 라우트에서 `document.documentElement.scrollWidth <= window.innerWidth` 확인.
- [ ] **헤더 경량화**: 상단에 중복 패밀리 링크 바를 제거해 첫 화면에서 핵심 콘텐츠가 바로 보이도록 구성.
- [ ] **버튼 겹침·잘림·고아 줄바꿈 0건**: 모바일 공유 버튼 겹침, 드롭다운 이중 화살표(`▼ ▾`), 태그라인 하단 잘림, 데스크톱 버튼 마지막 한 글자 줄바꿈 제거.
- [ ] **깨진 이미지 0건**: `img.naturalWidth === 0` 또는 빈 `src=""` 이미지 0건, 콘솔 에러 0건, 네트워크 404 0건.

### G. 배포 캐시 검증
- [ ] **엣지 캐시 TTL 및 캐시 버스터**: HTML 응답의 과도한 `s-maxage=86400`을 `s-maxage=60` 수준으로 관리하고, 주요 JS/CSS 변경 시 `?v=YYYYMMDD` 쿼리 버스터를 갱신해 재방문 브라우저에서도 즉시 최신 코드가 반영되도록 보장.

---

## 2. 실행 절차 (3-Step Audit Loop)

### Step 1: 정적·라이브 HTTP 1차 점검
1. 한국어 문체 검증 및 정적 QA 스크립트 실행:
   ```powershell
   python "C:\Users\USER\.gemini\config\skills\korean-humanizer\scripts\verify_korean.py" "<수정된_한국어_경로>"
   python "C:\Users\USER\.gemini\config\skills\web-qa-inspector\scripts\audit_web_qa.py" "<프로젝트_루트>"
   ```
2. 라이브 HTML/JS 응답 직접 확인 스크립트 실행:
   ```powershell
   python "C:\Users\USER\.gemini\config\skills\adsense-low-value-auditor\scripts\check_adsense_live.py" "https://tellmyname.app"
   ```

### Step 2: 컨텍스트 없는 독립 Neon 브라우저 감사 (핵심)
작업 맥락을 전혀 모르는 **새 `browser` 서브에이전트(`Model: "inherit"`)** 를 호출해 실제 데스크톱(`1280×800`)과 모바일(`390×844`) 화면을 심사관 관점에서 평가받습니다.
- **프롬프트 필수 규칙**:
  - 작업 이력이나 방금 고친 내용을 절대 알려주지 말 것 (Zero-Context 유지).
  - 점검 대상 URL 목록(루트, `?lang=en`, 각 서브 라우트, `/about.html`, `/privacy.html`)을 명시할 것.
  - 요구 출력 형식: **AdSense 승인 준비도 점수(0~100)**, **P0 블로커(근거 URL·DOM 텍스트·콘솔 에러)**, **P1/P2 개선 사항**, **뷰포트별 요약표**.

### Step 3: 반복 개선 및 최종 푸시
- P0 블로커가 1건이라도 남아 있으면 수정 → 재배포 → 새 제로-컨텍스트 서브에이전트 재감사 순으로 반복합니다.
- 모든 P0가 해소되고 라이브 응답과 브라우저 검증이 일치할 때 최종 커밋 및 `git push`를 수행합니다.
