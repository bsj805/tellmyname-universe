# [Issue #1] 한글 자모·획수 + 날짜(`YYYY-MM-DD`) + 끼니 슬롯 결합 아발란체 해시 엔진(`JSA-FoodHash-Date`) 구현 및 확률분포 검증

## 1. 개요 및 목적
- `C:\Users\USER\Documents\projects\myhome`의 `JSA-Hash` 한글 자모·획수 아발란체 하이브리드 해시 알고리즘을 계승한다.
- 단, `myhome`과 달리 **매일 다른 음식을 추천받되 하루 동안은 동일한 음식 메뉴가 유지**되어야 하므로, 접속자의 타임존 기준 현지 날짜(`YYYY-MM-DD`)와 5대 끼니 카테고리(`breakfast`, `lunch`, `snack`, `dinner`, `night`)를 해시 연산 과정에 직접 통합한다.

## 2. 핵심 요구사항
1. **한글 자모 및 획수 테이블 계승 (`src/lib/hash.js`)**
   - 초성(19개), 중성(21개), 종성(28개) 분해 (`decomposeHangul`)
   - 자모별 획수(`STROKES`) 합산 및 인접 글자 획수 조화값(`strokeHarmony`) 산출
   - 다국어(영문/일문/한자/이모지 등) 입력 시에도 유니코드 코드포인트 비트 레인 폴백으로 결정론적 해시 보장
2. **날짜(`YYYY-MM-DD`) 및 끼니(`mealKey`) 시드 결합**
   - `formatDateByTimezone(date, timeZone)` 함수를 통해 접속 국가 타임존 기준 `YYYY-MM-DD` 문자열 산출 (예: `2026-11-08`)
   - 이름 해시(`hName`) + 날짜 해시(`hDate`) + 끼니별 고유 솔트(`MEAL_SALTS[mealKey]`)를 32비트 Murmur3 회전 및 `fmix32` 아발란체 믹서로 결합
3. **일일 5끼 중복 방지(De-duplication)**
   - 만약 한 음식이 `점심`과 `저녁` 후보 풀에 동시에 속해 있더라도, 한 사람의 하루 5끼 식단표 안에서 동일한 메뉴가 2번 나오지 않도록 충돌 시 `(hash + retry * 0x9E3779B9)` 재탐색으로 5끼 모두 서로 다른 고유 음식이 배정되게 한다.
4. **확률분포 검증 스크립트 (`scripts/test_hash_distribution.mjs`)**
   - 다양한 한국어 이름(2~4글자) 및 연속된 30일 날짜에 대해:
     - 동일 날짜 + 동일 이름 = 100% 동일 결과 검증
     - 익일(`+1일`) 변경 시 5끼 메뉴 변동률 검증
     - 카테고리 내 모든 음식 슬롯 균등 분포($\chi^2$ 균등성) 리포트(`data/hash_distribution_report.json`) 생성

## 3. 구현 대상 파일
- `src/lib/constants.js`
- `src/lib/hash.js`
- `scripts/test_hash_distribution.mjs`
- `tests/test_issue_1_hash.mjs`
