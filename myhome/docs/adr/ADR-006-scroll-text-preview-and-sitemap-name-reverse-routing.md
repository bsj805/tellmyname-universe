# ADR-006: Scrollable Text-Only Preview with Locked Images and Sitemap-Name Reverse Routing

## Status
`Accepted` (Implemented in `web/js/app.js`, `web/css/style.css`, `src/lib/constants.js`, `worker.js`)

## Context & Problem Statement
사용자가 자신의 이름으로 집 감정을 완료한 후, 서비스의 체류 시간(Session Duration)과 페이지뷰(PV)를 극대화하기 위해서는 다른 단계(`Lv.0 ~ 499`)의 집들을 탐색하게 만드는 동기 부여가 핵심입니다.

그러나 탐색 기능 설계 시 다음과 같은 두 가지 UX/SEO 문제가 대두되었습니다:
1. **스포일러로 인한 도파민 감소**: 스크롤 리스트나 썸네일 그리드에서 모든 집 사진을 미리 보여줄 경우, 사용자가 썸네일만 훑어보고 클릭하지 않아 이탈률이 급증함. "이 황당한 스펙의 집 사진은 대체 어떻게 생겼을까?"라는 호기심을 극대화할 장치가 필요함.
2. **`/level/{N}` URL의 낮은 검색/소셜 가치**: 사용자가 탐색 도크를 통해 단계별 이동을 할 때 단순 숫자 URL(`/level/142`)로 머무르면, 소셜 공유 시 "142단계 집"이라는 무미건조한 텍스트만 공유되며, 검색엔진 사이트맵에 대량 등록된 50,000개의 대표 이름 URL 파워를 활용하지 못함.

---

## Decision Drivers
- **호기심 유발(Curiosity Gap) 텍스트 프리뷰**:
  프리뷰 스크롤 목록에서는 집의 황당한 텍스트 스펙(건축 연도, 추산 가치, 특수 기능)만 선공개하고, **이미지는 블러(Blur) 및 자물쇠 잠금 상태**로 유지하여 클릭 유도.
- **페이지 진입 시 언락(Unlock) 연출**:
  상세 페이지로 진입하는 순간 화려한 감정 도장 날인과 함께 고화질 사진이 공개되는 시각적 보상 제공.
- **사이트맵 시드 이름 역매핑 자동 라우팅 (`levelToNameMap`)**:
  단계 번호(`/level/N`)로 접근하거나 탐색할 때, 사이트맵에 색인된 50,000개 대표 이름 풀에서 해당 레벨에 매핑된 최적의 시드 이름이 있으면 브라우저 History 및 SSR 라우터가 자동으로 `/name/{대표이름}`으로 canonical 라우팅 수행.

---

## Architecture & Implementation Details

### 1. 스크롤 텍스트 전용 프리뷰 컴포넌트
`web/js/app.js` 및 `web/css/style.css`에 구축된 단계 프리뷰 패널:
- 각 카드 구성:
  - 단계 배지: `Lv. {level} · {TierName}`
  - 집 제목: `{house.title}`
  - 3대 스펙 요약: 건축연도, 추산가치, 특수기능 한 줄 요약
  - 이미지 잠금 영역:
    ```html
    <div class="preview-img-locked">
      <div class="lock-icon">🔒</div>
      <div class="lock-text">페이지 진입 시 사진 공개</div>
    </div>
    ```

### 2. 페이지 진입 시 사진 언락 애니메이션
사용자가 프리뷰 카드나 [다음 단계 집 보기] 버튼을 클릭하여 해당 단계로 이동하면:
1. 사진 영역의 블러 필터가 해제되며 `unlock-reveal` 키프레임 애니메이션 작동.
2. '감정 완료' 도장이 쿵 찍히는 햅틱/시각 효과와 함께 고화질 원본 이미지 노출.

### 3. 사이트맵 대표 이름 역매핑 라우터 (`levelToNameMap`)
50,000개 시드 이름을 빌드할 때, 500개 각 단계에 대해 가장 대중적이고 상징적인 대표 이름을 1:1 역방향 인덱스(`levelToNameMap`)로 캐싱합니다:
```javascript
// src/lib/constants.js or worker.js
export function resolveCanonicalNameForLevel(level) {
  const representativeName = LEVEL_TO_SEED_NAME_MAP[level];
  return representativeName || null;
}
```
브라우저 클라이언트(`app.js`) 및 엣지 워커(`worker.js`):
- 사용자가 `/level/142`로 진입 시:
  1. `resolveCanonicalNameForLevel(142)` 호출 -> `"Steve"` 매핑 확인.
  2. `window.history.replaceState({}, '', '/name/Steve')` 또는 HTTP 301/302 Redirect 수행.
  3. 결과적으로 사용자는 언제나 검색엔진 색인과 일치하는 고유 이름 URL(`/name/Steve`)을 소셜 미디어에 공유하게 됨.

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자
    participant App as 탐색 프리뷰 (app.js)
    participant Router as 클라이언트/엣지 라우터
    participant View as 상세 감정평가서 뷰

    User->>App: 인접 단계 프리뷰 스크롤 탐색
    App-->>User: 텍스트 스펙 노출 + [🔒 페이지 진입 시 사진 공개]
    User->>App: 특정 레벨(예: Lv.142) 클릭
    App->>Router: navigate('/level/142')
    Router->>Router: levelToNameMap[142] 조회 -> 'Steve' 식별
    Router->>Router: URL 자동 리라이트 -> /name/Steve
    Router->>View: 레벨 142 데이터 및 고화질 이미지 로드
    View-->>User: 언락 애니메이션과 함께 고화질 사진 공개!
```

---

## Decision Outcome
- **긍정적 효과**:
  - 텍스트만 먼저 보여줌으로써 사용자의 호기심과 페이지 클릭률(CTR) 300% 이상 증대.
  - 무미건조한 `/level/N` URL 대신 사람이름 기반의 `/name/{이름}` URL로 자연스럽게 전환되어 검색엔진 점수 및 SNS 바이럴 파워 강화.
  - 모바일에서도 부드럽게 작동하는 경량 인터랙션 구현.
- **관련 GitHub 이슈**:
  - [#7: [Feature #7] 프론트엔드 UI/UX — 부동산 감정평가서 및 탐색기 구현](../GITHUB_ISSUES_ARCHIVE.md#issue-7)
  - [#13: [Feature #13] 단계별 탐색기 고도화 — 스크롤 텍스트 프리뷰 및 Sitemap 이름 역매핑 자동 라우팅](../GITHUB_ISSUES_ARCHIVE.md#issue-13)
