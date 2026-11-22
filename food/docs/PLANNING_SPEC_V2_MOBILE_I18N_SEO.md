# 기획서 v2: 모바일 원스크린 · 14개 언어 글로벌화 · SEO 최적화

> 대상: `food.tellmyname.app` (`c:\Users\USER\Documents\projects\food`)
> 선행 문서: [PLANNING_SPEC.md](./PLANNING_SPEC.md) (v1: 해시 엔진/5끼/공유/이미지 파이프라인)
> 참조 구현: `myhome` 프로젝트 ADR-005 (14개 언어 + hreflang + 이미지 SEO)

---

## 0. 현황 진단 (2026-11-09 로컬 실측, 390×844 iPhone 14 뷰포트)

| 항목 | 측정값 | 문제 |
|---|---|---|
| 첫 화면(Above the fold) | 헤더 + 이름 입력 + **시뮬레이터 패널**만 보임 | **추천 음식이 첫 화면에 하나도 안 보임** (핵심 가치 미노출) |
| 가로 스크롤 | `scrollWidth 435px > 390px` | "추천받기" 버튼이 화면 밖으로 잘림 |
| 타임존 라벨 | "접/속/타/임/존" 세로 1글자 줄바꿈 | flex 축소로 라벨 폭 붕괴 |
| 페이지 길이 | 4,604px (≈5.5 화면) | 시뮬레이터(개발자용)가 상단 1/3 차지 |
| 언어 | 한국어 단일 | 해외 유입 불가 |
| SEO | `/`, `/name/{name}` SSR 메타만 존재 | hreflang, 음식 상세 페이지, 이미지 사이트맵, JSON-LD 없음 |

---

## 1. 목표 (Goals)

1. **모바일 원스크린**: 390×844에서 스크롤 없이 *이름 입력 → 지금 끼니 추천(이미지+이름+한줄평) → 공유 버튼*이 한 화면에 모두 보인다. 가로 스크롤 0px.
2. **14개 언어**: `ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms` (myhome과 동일 매트릭스). UI 문자열 + **401개 음식 이름/한줄평 전부 번역**.
3. **글로벌 SEO**: 언어별 URL, `hreflang` 교차 링크, 음식별 상세 페이지 401개 × 14개 언어, 이미지 사이트맵, Schema.org 구조화 데이터, IndexNow.

## 비목표 (Non-goals)
- 해시 알고리즘 변경 금지 (언어가 바뀌어도 **같은 이름+날짜 = 같은 음식 코드**). 언어는 표시만 바꾼다.
- 음식 데이터셋 추가/삭제 없음 (401개 고정).
- `funComment`, `pairingTip` 번역은 v2 범위 외 (비-ko 언어에서는 숨김 처리).

---

## 2. 기능 요구사항 → 이슈 매핑

| 이슈 | 제목 | 담당 | 소유 파일 (배타적) | 의존 |
|---|---|---|---|---|
| **#8** | 모바일 원스크린 레이아웃 | Flash 서브에이전트 A | `web/css/style.css`, `web/index.html`(레이아웃 마크업), `web/js/app.js`(DOM 순서/접기 로직) | 없음 |
| **#9** | 401개 음식 13개 언어 번역 | Flash 서브에이전트 ×13 (언어별 1명) | `data/i18n/foods/{lang}.json` (각자 1개 파일) | 없음 (#8과 병렬) |
| **#10** | i18n 엔진 + UI 다국어화 + 언어 전환 | Flash 서브에이전트 B | `src/lib/i18n.js`(신규), `web/index.html`, `web/js/app.js`, `web/js/share.js`, `scripts/build_i18n_bundles.mjs`(신규) | #8, #9 완료 후 |
| **#11** | 다국어 SEO (hreflang/음식 상세/사이트맵/JSON-LD) | Flash 서브에이전트 C | `worker.js`, `scripts/dev_server.mjs`, `scripts/generate_static_site.mjs`, `tests/test_seo.mjs`(신규) | #10 완료 후 |

실행 순서: **[#8 ∥ #9] → #10 → #11 → 메인 에이전트 통합 검증 & 커밋**

---

## 3. 상세 설계

### 3.1 #8 모바일 원스크린 (390×844 기준)

**새 정보 구조 (위→아래)**
```
┌───────────────────────── 390px ─┐
│ 🍽 오늘 뭐 먹지?        [🌐 KO ▾] │  ← 헤더 56px (1줄, 부제 제거)
│ [✍ 이름 입력........] [추천 ▶]   │  ← 입력 52px (버튼 포함 100% 폭 내)
│ ┌─────────────────────────────┐ │
│ │  ☀️ 지금은 점심 · 11:24      │ │
│ │  [  음식 일러스트 1:1 ~240px ] │ │  ← HERO: 현재 끼니
│ │  🌍 세계 레스토랑 미식         │ │
│ │  음식 이름 (2줄 clamp)        │ │
│ │  한줄평 (2줄 clamp)           │ │
│ │  [💬 카톡] [📸 스토리] [🔗]   │ │
│ └─────────────────────────────┘ │
│ 🌅 🍱 🍰 🌙 🦉  ← 5끼 미니 칩 탭  │  ← 탭 누르면 hero 교체
│ ⏳ 다음 메뉴까지 16:35:12         │
└───────────────────────────────── ┘  ≤ 844px
   ↓ 스크롤 시: 아침→점심→간식→저녁→야식 타임라인 카드 (기존 유지)
   ↓ 최하단: <details> "⚙️ 시간대 체험 (시뮬레이터)" — 기본 접힘
```

**수용 기준 (Acceptance Criteria)**
- AC1: 390×844, 360×740(Galaxy S), 375×667(iPhone SE) 모두 `scrollWidth === innerWidth`.
- AC2: 390×844에서 hero 공유 버튼 하단 `getBoundingClientRect().bottom ≤ 844`.
- AC3: 360×740에서도 hero 음식 이미지와 이름은 첫 화면에 보임 (공유 버튼은 허용 오차).
- AC4: 시뮬레이터(타임존 선택/시간 슬라이더/샘플 시간 칩)는 `<details>` 안으로 이동, 기본 닫힘. 기능은 그대로 동작.
- AC5: 추천 이름 칩 8개 → 가로 스크롤 1줄(`overflow-x:auto`)로 축소, 또는 입력창 포커스 시에만 노출.
- AC6: 데스크톱(≥900px)에서는 기존 2단 레이아웃 유지 가능.
- AC7: 5끼 순서(아침→점심→간식→저녁→야식) 스크롤 타임라인은 hero 아래 그대로 유지 (v1 요구사항).

**검증 도구**: `scratch/mobile_shot.py` (Playwright, 3개 뷰포트 스크린샷 + scrollWidth 출력)

### 3.2 #9 음식 번역 (401 × 13 언어)

- **원본**: `data/i18n/foods_source_ko.json` (`code, name, englishName, tagline`)
- **산출물 계약**: `data/i18n/foods/{lang}.json`
  ```json
  { "00001": { "name": "Wednesday Special Tomato Meat Sauce Spaghetti", "tagline": "..." }, ... }
  ```
- **번역 규칙**
  1. `name`: 그 언어권 사람이 메뉴판에서 읽는 자연스러운 음식명. 고유명사(김치찌개, 떡볶이, 비빔밥 등 한국 고유 음식)는 **현지 표기 음차 + 짧은 설명**(예: en `Tteokbokki (Spicy Rice Cakes)`, ja `トッポッキ`). `englishName`을 의미 참고용으로 활용.
  2. 영화/드라마 연관 메뉴는 현지 개봉 제목 사용 (예: 올드보이 → en *Oldboy*, ja *オールド・ボーイ*, 기생충 → fr *Parasite*).
  3. 미슐랭 접두어 `[미슐랭 3스타]` → `[Michelin 3★]` 형태로 언어별 일관 표기. `[빕 구르망]` → `[Bib Gourmand]`.
  4. `tagline`: 1문장, 원문 의미 유지, 최대 ~120자. 원화 가격 언급은 생략 가능.
  5. **한글 잔존 0**, **언어 내 이름 중복 0** (`scripts/validate_food_translations.mjs`로 강제).
- **분할**: 언어 1개 = 서브에이전트 1명 (13명 병렬). 각자 100개씩 4회로 나눠 작성 후 병합 가능.
- **검증**: `node scripts/validate_food_translations.mjs {lang}` → PASS 필수.

### 3.3 #10 i18n 엔진 & UI

- `src/lib/i18n.js` (브라우저/Worker 공용, `fs` 의존 0):
  - `SUPPORTED_LANGUAGES` 14개: `code, native, flag, locale, dir`
  - `UI_STRINGS[lang]`: 헤더, 입력 placeholder, 버튼, 끼니 라벨(아침/점심/간식/저녁/야식), 카운트다운, 공유 문구, 출처 배지(origin group 9종), SEO title/description 템플릿
  - `detectLanguage({ urlLang, cookie, acceptLanguage, navigatorLanguages })` → 우선순위: `?lang=` > 쿠키 `mk_lang` > `Accept-Language` > `ko`
  - `t(lang, key, vars)` 플레이스홀더 치환 (`{name}`, `{meal}`)
  - `localizeFood(food, lang, dict)` → `{...food, name, tagline}` (ko는 원본, 번역 누락 시 `englishName` → 원본 폴백)
- **번역 번들 배포**: `scripts/build_i18n_bundles.mjs` → `web/i18n/foods/{lang}.json` (+ `dist/`로 복사). 브라우저는 현재 언어 1개만 `fetch` (lazy, ~40KB/언어).
- **UI**: 헤더 우측 🌐 언어 선택 드롭다운 (14개 native 이름). 선택 시 `?lang=` 갱신 + 쿠키 저장 + 재렌더 (해시 결과 불변).
- **샘플 이름 칩**: 언어별 대표 이름 5~8개 (myhome `sampleNames` 참고).
- **공유**: 카카오/스토리 캔버스 텍스트도 현재 언어로. `funComment/pairingTip`은 ko에서만 노출.
- **날짜/시간 표기**: `Intl.DateTimeFormat(locale)`.

### 3.4 #11 다국어 SEO

**URL 설계**
| 페이지 | URL | 설명 |
|---|---|---|
| 홈 | `/?lang={lang}` | 언어별 홈 |
| 이름 결과 | `/name/{name}?lang={lang}` | 기존 SSR 유지 + 언어 메타 |
| **음식 상세 (신규)** | `/food/{code}?lang={lang}` | 401개 × 14 = 5,614 URL. 이미지/이름/한줄평/끼니/출처 + "이 음식이 오늘 추천된 이름 예시" |

**SSR 주입 (worker.js `renderMukbangSeoHtml`)**
- `<html lang>` 교체, `<title>`, `meta description`, `og:locale`, `og:locale:alternate`
- `<link rel="alternate" hreflang="{14개}">` + `x-default`(=ko 버전, 쿼리 없음)
- `<link rel="canonical">` = 현재 언어 URL
- JSON-LD: 홈 `WebSite` + `SearchAction`(`/name/{name}`), 음식 상세 `Recipe`(name, image, description, recipeCategory=끼니, recipeCuisine, nutrition.calories) + `BreadcrumbList`, 이름 결과 `ItemList`(5끼)
- 음식 이미지 `alt` = 번역된 음식 이름

**사이트맵 (generate_static_site.mjs + worker 동적 라우트)**
- `/sitemap.xml` = Sitemap Index
  - `/sitemap-pages.xml` (홈 × 14 언어, xhtml:link hreflang 포함)
  - `/sitemap-foods.xml` (음식 상세 401 × 14 = 5,614 URL, hreflang 교차)
  - `/sitemap-images.xml` (401 이미지, 언어별 `image:title`/`image:caption`)
  - `/sitemap-names.xml` (기존 이름 URL 유지)
- `robots.txt`: 모든 사이트맵 명시, `/api/` disallow
- IndexNow 키 파일 + 제출 스크립트 (myhome `.agents/skills/seo-optimizer/scripts/submit_indexnow.mjs` 이식)

**수용 기준**
- AC1: `/food/00116?lang=ja` SSR HTML에 일본어 title, `hreflang` 15개(14+x-default), `Recipe` JSON-LD 존재.
- AC2: 사이트맵 XML 유효(파싱 성공), 음식 URL 5,614개.
- AC3: `tests/test_seo.mjs` 전체 통과, 기존 `tests/test_all_features.mjs` 회귀 없음.
- AC4: 동일 이름+날짜에 대해 `?lang=ko`와 `?lang=fr`의 음식 `code` 5개가 동일.

---

## 4. 품질 게이트 (메인 에이전트 검수)

1. 각 서브에이전트 완료 후 `git diff --stat`으로 소유 파일 외 수정 여부 확인
2. `node --check` 전 JS 파일
3. `node scripts/validate_food_translations.mjs` 13개 언어 PASS
4. `node tests/test_all_features.mjs`, `node scripts/test_hash_distribution.mjs`, `node tests/test_seo.mjs`
5. Playwright 모바일 3뷰포트 스크린샷 육안 검수 (ko / en / ja / hi 4개 언어)
6. `node scripts/generate_static_site.mjs` 빌드 성공
7. 커밋 & 푸시, GitHub 이슈 #8~#11 종료

## 5. 리스크

| 리스크 | 대응 |
|---|---|
| 서브에이전트 번역 품질 편차 / 한글 잔존 | 계약 검증기로 자동 차단, FAIL 시 해당 언어 에이전트에 에러 목록 회신 |
| 긴 번역 음식명(de/ru)이 hero 레이아웃 깨뜨림 | 이름 2줄 `line-clamp`, 폰트 `clamp()` |
| hi/ja/zh 폰트 미지원 | `font-family`에 `Noto Sans Devanagari/JP/SC` 시스템 폴백 |
| 5,614 URL 크롤 예산 | 사이트맵 우선순위 홈 1.0 > 음식 0.7 > 이름 0.5 |


---

# 부록 A (2026-11-09 추가 요구사항): 공유/다운로드 · 일러스트 도감 탭 · 음식명 검색 SEO · Cloudflare 배포

## A.0 실행 순서 변경

| 단계 | 이슈 | 담당 | 소유 파일 (배타적) |
|---|---|---|---|
| ✅ 1 | #8 모바일 원스크린 | Flash A (완료) | — |
| ⏳ 1 | #9 음식 번역 13개 언어 | Flash ×13 (진행 중) | `data/i18n/foods/{lang}.json`, `data/i18n/foods/parts/{lang}_*.json` |
| 2 | #10 i18n 엔진 + UI | Flash B | `src/lib/i18n.js`, `scripts/build_i18n_bundles.mjs`, `web/index.html`, `web/js/app.js`, `web/js/share.js`(문자열만), `web/css/style.css` |
| 3 | **#12 인스타 스토리/다운로드 공유** + **#14 일러스트 도감 탭** | Flash C | `web/js/share.js`, `web/css/share.css`, `web/js/share_core.js`(신규), `web/js/gallery.js`(신규), `web/css/gallery.css`(신규), `web/index.html`, `web/js/app.js`(탭 라우팅만), `src/lib/i18n.js`(신규 키 추가만) |
| 4 | #11 다국어 SEO + **#13 Cloudflare Workers 배포** | Flash D | `worker.js`, `scripts/dev_server.mjs`, `scripts/generate_static_site.mjs`, `scripts/optimize_images.py`(신규), `scripts/submit_indexnow.mjs`(신규), `wrangler.toml`, `package.json`, `tests/test_seo.mjs`(신규), `images/web/*`(신규 산출물) |
| 5 | 통합 검증 · 커밋 · 이슈 종료 | 메인 에이전트 | — |

## A.1 #12 인스타그램 스토리 / 카카오톡 공유 / 이미지 다운로드 (다국어)

**목표**: 공유 버튼을 누르면 (1) 지원 기기에서는 OS 공유 시트로 **이미지 파일 자체**를 보내 인스타 스토리/카톡에 바로 올릴 수 있고, (2) 미지원 환경에서는 **PNG 다운로드**로 폴백한다.

- `web/js/share_core.js` (신규, 공용 모듈 — #14도 사용)
  - `renderStoryCanvas({ mode, lang, items, name, dateText, siteUrl })` → 1080×1920 `<canvas>` (mode: `daily`=5끼 보드, `single`=선택 끼니, `food`=도감 단일 음식 확대카드)
  - `canvasToBlob(canvas)` → PNG Blob
  - `shareImage({ blob, filename, title, text, url })`:
    1. `navigator.canShare({ files:[file] })` → `navigator.share({ files, title, text })` (iOS Safari/Android Chrome → 공유 시트에서 Instagram "스토리", KakaoTalk 선택 가능)
    2. 실패/미지원 → `<a download>`로 PNG 저장 + 토스트 "이미지를 저장했어요. 인스타그램 스토리에서 불러오세요" (다국어)
  - `downloadImage(blob, filename)`
  - `shareKakaoText({ text, url })`: 카카오 SDK 키가 없으므로 Web Share API(text+url) → 실패 시 클립보드 복사
- 공유 모달 버튼 4개: **📸 인스타 스토리로 보내기** · **💬 카카오톡** · **⬇️ 이미지 저장** · **🔗 링크 복사**
- 모든 버튼 라벨/토스트/캔버스 내 텍스트(끼니명, "오늘의 식단", 날짜, 사이트 URL 문구)는 `i18n.js` 키로, 음식명/한줄평은 번역 번들 사용. 캔버스 폰트는 언어별 폴백(`Noto Sans JP/SC/Devanagari` 등 시스템 폰트) 지정.
- 파일명: `mukbang-{name}-{YYYY-MM-DD}.png`, 도감: `mukbang-food-{code}-{slug}.png`
- 이미지 CORS: 같은 도메인 `/images/...` 사용으로 캔버스 tainted 방지.

**수용 기준**
- [ ] Chrome 데스크톱(파일 공유 미지원) → 다운로드 폴백 동작
- [ ] `navigator.share` mock 테스트로 files 전달 확인 (`tests/test_share_core.mjs`, jsdom 없이 순수 함수 위주)
- [ ] ko/en/ja 캔버스 결과 PNG 육안 검수 (글자 깨짐/넘침 없음)

## A.2 #14 일러스트 도감 탭 (Food Gallery) + 단일 음식 확대 공유

**목표**: 이름 입력 없이 401개 음식 일러스트만 둘러보고, 카테고리를 골라 **랜덤 추천**받고, 한 음식을 **확대 + 설명**과 함께 공유한다. 음식 이름 검색 유입의 랜딩 페이지 역할.

- 탭 구조 (헤더 아래 세그먼트): **[🍽 오늘의 식단]** `/` · **[🖼 일러스트 도감]** `/gallery`
- `/gallery?lang=xx&cat=xx`
  - 카테고리 칩: 끼니 5종(아침/점심/간식/저녁/야식) + 출처 9종(급식/미슐랭/빕구르망/자연식/이색/한국인기/세계미식…) + 배달 카테고리(치킨/피자·버거/중식/일식/분식/카페·디저트/편의점 …)
  - **🎲 랜덤 추천** 버튼: 선택 카테고리 안에서 무작위 1개 → 확대 뷰 오픈 (해시 아님, `Math.random`)
  - 그리드: 2열(모바일) / 4~5열(데스크톱), `loading="lazy"` 썸네일(WebP), 이름 번역 표시, 검색창(현재 언어 + 한국어 + 영어 이름 부분일치)
- `/food/{code}?lang=xx` = 확대 뷰 (SSR 지원 → SEO 랜딩)
  - 큰 이미지, 번역 이름, 영어 이름, 한국어 원명, 한줄평, 끼니/출처/배달 카테고리 배지, 칼로리, (ko는 funComment/pairingTip)
  - 버튼: 📸 인스타 스토리 · 💬 카톡 · ⬇️ 저장 · 🔗 링크 · 🎲 같은 카테고리 다른 음식 · ← 도감으로
  - 공유 이미지는 `share_core.renderStoryCanvas({ mode:'food' })`: **음식 일러스트를 크게(1080 폭 가득)** + 음식명 + 한줄평 + 배지 + 사이트 URL. (이름 기반 하루 식단 카드와 다른 레이아웃)
- 클라이언트 라우팅: `history.pushState`로 `/`, `/gallery`, `/food/{code}` 전환 (worker가 3개 경로 모두 index.html + SSR 메타 반환)

**수용 기준**
- [ ] `/gallery` 모바일 390×844 가로 스크롤 0, 첫 화면에 카테고리 칩 + 랜덤 버튼 + 그리드 일부 노출
- [ ] 카테고리 선택 후 랜덤 → 해당 카테고리 음식만 나옴 (100회 테스트)
- [ ] `/food/00116` 직접 진입 시 확대 뷰 바로 표시
- [ ] 도감 공유 PNG가 하루 식단 카드와 다른 단일 음식 확대 레이아웃

## A.3 #11 보강: 음식 이름(한국어·영어·13개 언어) 검색 노출

- 음식 상세 `/food/{code}?lang=` 5,614 URL을 `sitemap-foods.xml`에 `xhtml:link hreflang` 교차 포함
- `<title>` 패턴: `{번역 음식명} 일러스트 · {englishName} | 오늘 뭐 먹지?` (언어별 템플릿, en은 `{englishName} Illustration & Recipe Idea | Mukbang`)
- `meta description`: 한줄평 + 끼니 + 출처
- `meta keywords` 대신 본문 텍스트에 한국어 원명 + 영어명 + 번역명을 모두 노출 (SSR HTML 본문 `<h1>`, `<p>`에 포함 — JS 미실행 크롤러 대응)
- `sitemap-images.xml`: 이미지마다 `image:title` = 번역명, `image:caption` = 한줄평 (언어별 URL 단위)
- JSON-LD `Recipe` + `ImageObject`(`contentUrl`, `caption`, `name`)
- `/gallery?lang=xx` 14 URL도 sitemap-pages에 포함
- Google/Naver/Bing 웹마스터 제출용 안내 문서 `docs/SEO_SUBMISSION_GUIDE.md`

## A.4 #13 Cloudflare Workers 정적 호스팅 (Workers & Pages → Workers + Static Assets)

**결정**: Pages(legacy) 대신 **Workers + Static Assets** (`wrangler.toml [assets]`) 단일 Worker로 배포. `npx wrangler deploy`.

- `wrangler.toml`
  - `main = "worker.js"`, `[assets] directory="./dist", binding="ASSETS", run_worker_first=true`
  - **R2 바인딩 제거**(버킷 미생성 시 배포 실패 원인). 이미지는 정적 에셋으로 서빙.
  - `[[routes]] pattern="food.tellmyname.app", custom_domain=true`
- 이미지 최적화 (`scripts/optimize_images.py`, Pillow): `images/*.png`(약 1.5~2.5MB × 401 ≈ 800MB) →
  - `images/web/{code}.webp` (768px, q80, ≈80~150KB) — 화면/도감/사이트맵용
  - `images/web/{code}.jpg` (1200×630 레터박스 or 800px, q82) — OG/카카오 미리보기용
  - 산출물은 git 커밋 (CI에서 Pillow 불필요). `dist/`에는 web 버전만 복사 → 배포 용량 ≈ 80MB
- `package.json`: `"build": "node scripts/build_i18n_bundles.mjs && node scripts/generate_static_site.mjs"`, `"deploy": "npx wrangler deploy"`, devDependency `wrangler`
- **Cloudflare 대시보드 (Workers & Pages → Create → Import a repository → bsj805/food)**
  - Build command: `npm run build`
  - Deploy command: `npx wrangler deploy`
  - (Non-production branch deploy command: `npx wrangler versions upload`)
  - Root directory: `/`
  - 환경변수 불필요

**수용 기준**
- [ ] `npm run build` 성공, `dist/` 용량 < 150MB, 파일 수 < 20,000, 단일 파일 < 25MiB
- [ ] `npx wrangler deploy --dry-run --outdir .wrangler-dry` 성공
- [ ] `docs/DEPLOY_CLOUDFLARE.md` 작성
