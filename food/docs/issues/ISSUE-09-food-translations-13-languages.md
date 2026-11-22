# ISSUE-09: 401개 음식 13개 언어 번역 데이터

상위 기획: [PLANNING_SPEC_V2 §3.2](../PLANNING_SPEC_V2_MOBILE_I18N_SEO.md#32-9-음식-번역-401--13-언어)

## 대상 언어 (13)
`en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms` (ko는 원본)

## 입력 / 출력
- 입력: `data/i18n/foods_source_ko.json` — `[{code, name, englishName, tagline}]` × 401
- 출력: `data/i18n/foods/{lang}.json` — `{ "00001": {"name","tagline"}, ... "00401": {...} }`

## 번역 규칙
1. 메뉴판처럼 자연스러운 현지어 음식명. 한국 고유 음식은 음차 + 짧은 설명 (`Tteokbokki (Spicy Rice Cakes)`).
2. 영화/드라마 제목은 현지 개봉명 (Oldboy, Parasite, Iron Man …).
3. `[미슐랭 N스타]` → `[Michelin N★]`, `[빕 구르망]` → `[Bib Gourmand]` (언어별 일관).
4. `tagline` 1문장, 의미 보존, ≤ ~120자.
5. 한글 잔존 0, 언어 내 이름 중복 0.

## 분할 / 담당
언어 1개당 Flash 서브에이전트 1명 (총 13명 병렬). 소유 파일은 자기 언어 JSON 1개뿐.

## 수용 기준
- [ ] `node scripts/validate_food_translations.mjs` → 13개 언어 모두 PASS (401/401, errors=0)
- [ ] 무작위 20개 샘플 메인 에이전트 육안 검수
