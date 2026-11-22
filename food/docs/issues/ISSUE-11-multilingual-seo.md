# ISSUE-11: 다국어 SEO (hreflang · 음식 상세 페이지 · 사이트맵 · JSON-LD)

상위 기획: [PLANNING_SPEC_V2 §3.4](../PLANNING_SPEC_V2_MOBILE_I18N_SEO.md#34-11-다국어-seo)

## 구현 범위
- `worker.js`
  - 신규 라우트 `/food/{code}?lang=` (401 × 14) SSR: 번역 이름/한줄평, 이미지, 끼니, 출처
  - 모든 SSR 페이지: `<html lang>`, title/description(언어별), canonical, `hreflang` 14 + `x-default`, `og:locale(+alternate)`
  - JSON-LD: 홈 `WebSite`+`SearchAction`, 음식 `Recipe`+`BreadcrumbList`, 이름 결과 `ItemList`
  - 동적 `/sitemap*.xml`, `/robots.txt`
- `scripts/dev_server.mjs`: 위 라우트 로컬 동작
- `scripts/generate_static_site.mjs`: `sitemap.xml`(index), `sitemap-pages.xml`, `sitemap-foods.xml`, `sitemap-images.xml`, `sitemap-names.xml`, robots.txt, IndexNow 키 파일, `web/i18n` 복사
- `scripts/submit_indexnow.mjs` (myhome에서 이식)
- `tests/test_seo.mjs` (신규)

## 수용 기준
- [ ] `/food/00116?lang=ja` → 일본어 title, hreflang 15개, Recipe JSON-LD
- [ ] `sitemap-foods.xml` URL 5,614개, XML 파싱 성공
- [ ] `?lang=ko` vs `?lang=fr` 동일 이름/날짜 → 음식 code 동일
- [ ] `tests/test_seo.mjs`, `tests/test_all_features.mjs` 통과
