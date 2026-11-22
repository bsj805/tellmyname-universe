# [Issue #3] 5대 끼니 카테고리(아침·점심·간식/디저트·저녁·야식) 분류 체계 및 카테고리별 최대 음식 수 제한(Cap) 제어기 구현

## 1. 개요 및 목적
- Issue #2에서 수집된 전체 음식 데이터(`data/raw_foods_collected.json`)를 **아침(`breakfast`) · 점심(`lunch`) · 간식/디저트(`snack`) · 저녁(`dinner`) · 야식(`night`)** 5대 카테고리로 분류한다.
- 특히 사용자 요구사항인 **"한번 데이터 모아놓은 다음에 최대 몇 개 음식에 대해서 각 카테고리별로 제한을 걸지 판단할게"**를 완벽히 지원하기 위해, 각 카테고리별 수집 현황 리포트를 출력하고 설정값(`CATEGORY_CAPS`) 하나로 카테고리별 최대 활성 음식 개수를 즉시 제어할 수 있는 빌더를 구현한다.

## 2. 핵심 요구사항
1. **5대 끼니 카테고리 정의 (`MEAL_CATEGORIES`)**
   - `breakfast` (🌅 아침 — `05:00 ~ 09:59`): 가벼운 자연식/과일, 국밥/해장, 브런치, 급식 아침형 메뉴, 모닝빵/토스트 등
   - `lunch` (☀️ 점심 — `10:00 ~ 13:59`): 초·중·고 급식 메뉴, 빕 구르망 면/국밥, 대중 백반/분식, 미슐랭 런치, 특이 외식 메뉴 등
   - `snack` (🍰 간식/디저트 — `14:00 ~ 16:59`): 과일/생당근/토마토, 학교 앞 분식/피카츄돈까스/회오리감자, 카페 디저트, 이색 빙수/두바이초콜릿 붕어빵 등
   - `dinner` (🌙 저녁 — `17:00 ~ 20:59`): 미슐랭 1·2·3스타 파인다이닝, 삼겹살/전골/스테이크, 빕 구르망 정찬, 이색 레스토랑 특선, 다이어트 저녁 자연식 등
   - `night` (🦉 야식 — `21:00 ~ 04:59`): 치킨/족발/곱창, 편의점 꿀조합, 라면, 죄책감 없는 야식용 생당근/오이/방울토마토, 심야 우동/포차 메뉴 등
2. **카테고리별 최대 음식 수 제한(Cap) 컨트롤러 (`src/lib/constants.js` & `scripts/build_food_dataset.mjs`)**
   - `DEFAULT_CATEGORY_CAP` 및 카테고리별 개별 Cap 설정 객체(`CATEGORY_MAX_LIMITS`) 제공 (기본값: 제한 없음 또는 설정된 N개, CLI 인자 `--cap=30` 등으로 언제든 재빌드 및 시뮬레이션 가능)
   - 제한(Cap) 적용 시에도 **8대 출처(`SCHOOL_LUNCH`, `MICHELIN_STAR`, `BIB_GOURMAND`, `RAW_NATURAL`, `UNIQUE_RESTAURANT`, `KOREAN_FAVORITE`, `GLOBAL_DINING`, `NIGHT_SNACK_CAFE`)가 특정 종류에 치우치지 않고 골고루 포함**되도록 라운드로빈(Stratified Sampling) 정렬 후 상위 Cap개를 활성화한다.
3. **데이터셋 통계 리포트 자동 생성 (`data/category_stats_report.json`)**
   - 전체 수집 음식 수, 카테고리별 할당 음식 수, 출처 그룹별 비중을 한눈에 볼 수 있는 JSON 및 마크다운 요약표를 생성한다.

## 3. 구현 대상 파일
- `src/lib/food_dataset.js`
- `scripts/build_food_dataset.mjs`
- `data/foods_master.json`
- `data/category_stats_report.json`
- `tests/test_issue_3_taxonomy.mjs`
