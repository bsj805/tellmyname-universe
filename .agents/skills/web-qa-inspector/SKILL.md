---
name: web-qa-inspector
description: >-
  완성된 웹 소프트웨어의 배포·납품 전 필수 종합 QA 검수 스킬. 모바일(390x844)·데스크톱(1280x800) 반응형 레이아웃 깨짐/가로 넘침/버튼 잘림/헤더 겹침 검사, 14개 다국어 전환 시 미번역 한글([가-힣]) 잔존 0건 전수 검사, 다국어 데이터셋(en 등) 중복·문법 오류 검사, CSS 스타일 누락 및 깨진 이미지(naturalWidth=0) 검사, JS 콘솔 에러 0건 및 실제 브라우저 스크린샷 육안 검수 절차를 수행한다. 웹 기능 개발이나 UI 수정 후 반드시 활성화한다.
---

# Web Release & Visual/Multilingual QA Inspector (`web-qa-inspector`)

웹 애플리케이션이나 UI/다국어/데이터셋 작업을 마친 뒤 사용자에게 완료 보고를 하거나 배포하기 전에 **반드시 수행해야 하는 7단계 종합 QA 검수 절차**입니다.

> **핵심 원칙**: 코드가 빌드되었다고 해서 UI가 정상인 것은 아닙니다. 반드시 **자동 정적·다국어 검수 스크립트(`audit_web_qa.py`)**와 **실제 브라우저(모바일 `390×844` + 데스크톱 `1280×800`, 한국어 `?lang=ko` + 외국어 `?lang=en` 등) 스크린샷 육안 검수(`read_file`)**를 모두 통과해야 합니다.

---

## 1. 빠른 실행 (Automated Static & Multilingual Dataset QA)

작업 완료 후 가장 먼저 아래 정적·데이터셋·다국어 QA 스크립트를 실행합니다:

```powershell
python "C:\Users\USER\.gemini\config\skills\web-qa-inspector\scripts\audit_web_qa.py" "<프로젝트_또는_모노레포_경로>"
```

이 스크립트는 다음 항목을 자동으로 전수 검사합니다:
1. **JS ES Module 참조 무결성**: `app.js` 등에서 호출하는 렌더 함수(`renderCrossLevelSectionHtml` 등)의 `import` 누락 여부
2. **다국어 데이터셋(`ko`, `en`, `i18n/*.json`) 중복 0건 & 문법 오염 검사**:
   - 한국어뿐 아니라 영문(`en.aiVerdict`, `en.era`, `en.estimatedValue`, `en.specialFeature`) 및 14개 언어 JSON의 템플릿 반복 문구(Duplicate = 0) 검사
   - 기계적 문자열 결합 오류(영문 고유명사 소문자화, 한글 `[직업명]로서 직업명로서` 중복, 어간 절단 `~는,` 등) 탐지
3. **HTML/CSS 필수 레이아웃 안전성 검사**:
   - 동적 주입 컴포넌트(`.cross-level-section`, `.inline-step-nav-bar`, `#photodiary-promo-section` 등)의 CSS 규칙 존재 여부
   - 빈 애드센스 슬롯 노출 여부 및 `sitemap*.xml` 내 `/name/` 도어웨이 URL 혼입 여부
4. **한국어 AI 문체 검증(`korean-humanizer` 연동)**:
   - 모든 한국어 HTML/JSON/MD 파일이 `Grade A` 또는 `Grade B` (`S1 = 0`)인지 확인

---

## 2. 브라우저 라이브 DOM & 모바일/다국어 시각 검수 절차 (7-Stage Live QA)

로컬 서버를 띄운 뒤 `browser` 서브에이전트를 통해 아래 **4가지 조합(2개 뷰포트 × 2개 이상 언어)**을 실제로 열고, [`browser_dom_probe.js`](./scripts/browser_dom_probe.js)의 검수 로직과 스크린샷(`read_file`)으로 직접 눈으로 확인합니다.

### 필수 테스트 매트릭스
| 뷰포트 | 해상도 | 언어 1 (한국어) | 언어 2 (외국어: 영어/일본어 등) |
| :--- | :--- | :--- | :--- |
| **Desktop** | `1280 × 800` | `http://localhost:PORT/?lang=ko` | `http://localhost:PORT/?lang=en` |
| **Mobile (iPhone 14/15)** | `390 × 844` | `http://localhost:PORT/?lang=ko` | `http://localhost:PORT/?lang=en` |

### 7대 필수 체크리스트

#### ① 다국어 전환 시 한글(`[가-힣]`) 잔존 0건 검사 (Zero Hangul Leak on Non-Korean Views)
- `?lang=en`, `?lang=ja`, `?lang=zh`, `?lang=es` 등 한국어가 아닌 언어로 화면을 띄웠을 때:
  - 언어 선택 드롭다운의 `<option value="ko">한국어</option>`과 사용자가 직접 입력한 한글 검색어를 제외한 **화면의 모든 보이는 텍스트 노드(`innerText`)에 한글(`[가-힣]`)이 단 1글자도 남아 있으면 안 됩니다.**
  - 특히 자주 누락되는 영역을 집중 점검합니다:
    - 카드 상단 배지/필(`.card-pill`, `.zone-badge`, `.reality-badge`)
    - 카드 내부 체크리스트(`<li>✔ ...</li>`)
    - 스펙 라벨(`시대·연도`, `추산 가치`, `핵심 특징`)
    - 하단 가이드/백서의 마지막 문단(`#wp-art4-title`, `#wp-art4-p1`, `#wp-art4-p2`, `.editorial-box`)
    - 타 앱 상호참조 카드(`.cross-level-section`) 및 하단 홍보 카드(`#photodiary-promo-section`)
    - 상단 패밀리 내비게이션 및 하단 푸터 링크
  - **타 앱 링크 언어 유지**: 외국어 상태에서 다른 앱 카드나 내비게이션 링크를 클릭할 때 `?lang=en` 파라미터가 모든 외부/상호참조 링크에 유지되어야 합니다.

#### ② 모바일(`390×844`) 화면 맞춤 & 가로 스크롤/잘림 0건 검사
- **가로 스크롤바 금지**: 모바일(`390×844`)에서 `document.documentElement.scrollWidth <= window.innerWidth`여야 합니다. 긴 영문 제목이나 URL, 고정 너비 테이블/카드가 화면 밖으로 삐져나가면 안 됩니다.
- **버튼·텍스트 하단 잘림(Clipping) 금지**:
  - 다국어 번역문(영문·러시아어·독일어·인도네시아어 등)은 한국어보다 길이가 1.5~2배 길어져 버튼이 2줄로 줄바꿈됩니다.
  - 버튼에 고정 `height`를 주거나 부모 컨테이너에 `overflow: hidden`과 부족한 패딩을 주면 2번째 줄 글자 아랫부분이 잘립니다. 모든 CTA 버튼은 `height: auto`, 충분한 `line-height: 1.35~1.4`, 부모 `overflow: visible`을 유지해야 합니다.
- **헤더 타이틀과 우측 액션(언어 선택기) 겹침 금지**:
  - `.app-header`에 고정 `height: 56px`와 `white-space: nowrap`을 동시에 쓰면 영문 타이틀이 우측 언어 선택기(`English ▼`)와 겹칩니다. `height: auto; min-height: 56px; flex-wrap: wrap;`으로 줄바꿈을 허용해야 합니다.
- **하단 고정 바(Sticky/Fixed Dock) 콘텐츠 가림 금지**:
  - `position: fixed; bottom: 0` 요소가 본문 버튼이나 하단 홍보 카드를 가리지 않는지 확인합니다.

#### ③ CSS 스타일 누락(Raw Unstyled HTML) 검사
- 동적으로 렌더링되는 섹션(`.cross-level-section`, `.inline-step-nav-bar`, 월드컵 대진표, 모달 등)이 CSS 클래스 불일치나 `<style>` 누락으로 인해 브라우저 기본 파란색 밑줄 링크(`rgb(0, 0, 238)`)나 테두리 없는 평문 `<dl><dt><dd>`로 깨져 나오지 않는지 확인합니다.

#### ④ 이미지 & 캔버스 100% 로딩 무결성 검사
- 페이지 내 모든 보이는 `<img>` 태그에 대해 `img.complete === true && img.naturalWidth > 0`인지 확인합니다.
- 아직 배포되지 않은 외부 도메인 이미지나 네트워크 실패 시에도 빈 박스나 깨진 이미지 아이콘이 뜨지 않도록 로컬 R2 미러링 또는 `onerror` SVG 일러스트 폴백이 즉시 작동해야 합니다.

#### ⑤ JS 콘솔 & 네트워크 에러 0건 검사
- 페이지 진입, 이름 검색, 이전/다음 단계 이동, 언어 변경, 월드컵 탭 전환 시 `console.error` 및 `pageerror`(`Uncaught ReferenceError` 등)가 **0건**이어야 합니다.

#### ⑥ 스크린샷 육안 확인 (`read_file` 필수)
- `browser` 서브에이전트가 찍은 스크린샷(`.png`)을 에이전트가 직접 `read_file` 도구로 열어서 상단 헤더, 메인 카드, 중간 상호참조 섹션, 하단 홍보 카드 및 푸터의 정렬 상태를 눈으로 확인한 뒤에만 최종 완료 보고를 합니다.
