---
name: collect-real-houses
description: >-
  C:\Users\USER\Documents\projects\myhome\data\chunks 데이터 중 realityType이 "REAL"인 실존 건축물·장소만 골라,
  위키미디어 공용/Flickr에서 저작권(CC/Public Domain)을 준수하는 고화질 대표 실사 사진을 자동 검색하고,
  신문/문서 스캔본을 배제하여 G:\My Drive\houses에 {padded}.png와 {padded}.json(라이선스 메타데이터)으로 수집합니다.
---

# Real Houses Photo Collection Skill

이 스킬은 `myhome` 프로젝트 전용 스킬로, 0~20,000단계 하우스 중 **`realityType: "REAL"` (짝수 레벨 실존 건축물/장소)**에 대해 합법적인 상업용 실제 사진을 수집하고 라이선스 메타데이터를 저장하는 표준 워크플로우를 제공합니다.

---

## 📌 주요 특징 및 원칙

1. **REAL 항목만 선별**: `realityType === 'REAL'` 항목만 타깃팅하여 처리합니다.
2. **신문/문서/인물 스캔본 원천 차단**:
   - `times`, `magazine`, `newspaper`, `journal`, `archive`, `scan`, `page`, `pdf`, `djvu` 및 스포츠/인물 사진 키워드에 **강력 감점(-1,000점)**을 적용하여 순수 장소 전경 실사만 선정합니다.
3. **API Rate Limit 및 차단 방지**:
   - User-Agent 공식 지정 및 요청 간 700ms 딜레이 보장
   - `429 Too Many Requests` 감지 시 `Retry-After` 헤더 기반 자동 대기 및 지수 백오프(Exponential Backoff) 재시도
4. **저장 표준 규격**:
   - **이미지**: `G:\My Drive\houses\{padded}.png` (표준 PNG 변환 저장)
   - **라이선스 JSON**: `G:\My Drive\houses\{padded}.json` (저작자, 라이선스, 원본 URL 보관)
   - **중복 방지**: 이미 파일이 존재하는 경우 자동으로 건너뜁니다(`[SKIP]`).
5. **웹 UI 연동**:
   - 웹 프론트엔드(`web/js/app.js`)는 `REAL` 카드를 렌더링할 때 동일 폴더의 `/r2/houses/${padded}.json`을 비동기 조회하여 `📷 Photo: {license} · {artist}`를 웹페이지에 자동 표기합니다.

---

## 🚀 실행 방법

### 1. 단일 청크 실행 (기본)
```powershell
# houses-chunk-00.json 처리
node scripts/collect_real_photos.cjs houses-chunk-00.json

# 특정 개수만 테스트 실행 (예: 20개)
node scripts/collect_real_photos.cjs houses-chunk-00.json 20
```

### 2. 전체 청크 순차 일괄 실행
모든 청크(`houses-chunk-00.json` ~ `houses-chunk-19.json`)를 순서대로 순회하며 미수집된 REAL 항목들을 수집합니다:

```powershell
node .agents/skills/collect-real-houses/scripts/run_all_chunks.cjs
```

---

## 🛠️ 핵심 스크립트 위치
- 메인 수집 파이프라인: `scripts/collect_real_photos.cjs`
- 전 청크 순회 실행기: `.agents/skills/collect-real-houses/scripts/run_all_chunks.cjs`
