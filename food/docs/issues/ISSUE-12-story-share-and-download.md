# ISSUE-12: 인스타그램 스토리 / 카카오톡 공유 / 이미지 다운로드 (다국어)

상위 기획: [PLANNING_SPEC_V2 부록 A.1](../PLANNING_SPEC_V2_MOBILE_I18N_SEO.md#a1-12-인스타그램-스토리--카카오톡-공유--이미지-다운로드-다국어)

- `web/js/share_core.js` 공용 모듈: `renderStoryCanvas`, `canvasToBlob`, `shareImage`(Web Share API Level 2 files → 다운로드 폴백), `downloadImage`, `shareKakaoText`
- 공유 모달 4버튼: 📸 인스타 스토리 · 💬 카카오톡 · ⬇️ 이미지 저장 · 🔗 링크 복사
- 모든 텍스트/캔버스 문구 14개 언어, 언어별 폰트 폴백

## 수용 기준
- [ ] 파일 공유 미지원 브라우저 → PNG 다운로드 폴백
- [ ] `tests/test_share_core.mjs` 통과
- [ ] ko/en/ja 캔버스 PNG 육안 검수
