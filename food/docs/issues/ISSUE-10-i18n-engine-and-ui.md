# ISSUE-10: i18n 엔진 + UI 14개 언어 + 언어 전환

상위 기획: [PLANNING_SPEC_V2 §3.3](../PLANNING_SPEC_V2_MOBILE_I18N_SEO.md#33-10-i18n-엔진--ui)

## 구현 범위
- `src/lib/i18n.js` (신규, fs 의존 0, 브라우저/Worker 공용)
  - `SUPPORTED_LANGUAGES` (code/native/flag/locale/sampleNames) × 14
  - `UI_STRINGS[lang]` 전체 UI 문구, 끼니 5종 라벨, 출처 배지 9종, 공유 문구, SEO title/description 템플릿
  - `detectLanguage()`, `t()`, `localizeFood()`, `normalizeLang()`
- `scripts/build_i18n_bundles.mjs` (신규): `data/i18n/foods/*.json` → `web/i18n/foods/{lang}.json`
- `web/index.html`: 하드코딩 한국어 → `data-i18n` 키, 헤더 `#langSlot`에 언어 선택
- `web/js/app.js`: 언어 감지/전환(`?lang=` + 쿠키 `mk_lang`), 번역 번들 lazy fetch, 음식 이름/한줄평/배지 현지화, `Intl` 날짜 표기, 언어별 샘플 이름
- `web/js/share.js`: 카톡 텍스트/스토리 캔버스 현재 언어 적용
- 비-ko 언어에서 `funComment`, `pairingTip` 숨김

## 불변 조건
- 언어 전환 시 해시 결과(음식 code 5개) 불변

## 수용 기준
- [ ] `?lang=en|ja|hi|ru|ar(미지원→ko 폴백)` 렌더 정상
- [ ] 언어 드롭다운 전환 시 새로고침 없이 재렌더 + URL/쿠키 갱신
- [ ] 모바일 원스크린(#8) 기준 유지 (de/ru 긴 이름 포함)
- [ ] `node --check` 전 파일, `tests/test_all_features.mjs` 통과
