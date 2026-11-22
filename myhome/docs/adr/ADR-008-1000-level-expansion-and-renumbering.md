# ADR-008: 500 to 1,000 Level Multiverse House Expansion and Zero-Collision Parity-Preserving Renumbering

## Status
`Accepted` (Targeting `data/chunks/houses-chunk-00.json` ~ `houses-chunk-19.json`, `src/lib/constants.js`, and `G:\My Drive\new_houses`)

## Context & Problem Statement
`myhome` 프로젝트는 사용자 이름 해시를 기반으로 `Lv.0 ~ Lv.499` 총 500종의 유머러스하고 기상천외한 거주 공간을 추천하는 바이럴 웹 애플리케이션입니다.
초기 500단계 체제는 높은 완성도를 보였으나, 글로벌 14개 언어권 50,000개 인명 데이터셋 구축(Issue #15) 및 체류 시간 증대를 위해 다음과 같은 추가 확장이 요구되었습니다:
1. **소재의 다양성과 글로벌 오지·기이건축 심화**: 유튜브 인기 여행/건축 채널(빠니보틀, 곽튜브, 진용진, Drew Binsky, Architectural Digest 등)에서 다룬 전 세계의 극한 오지, 기괴한 슬럼가, 초호화 기이 맨션, SF 랜드마크 등 500종의 신규 주택을 추가하여 총 1,000단계(`Lv.0 ~ Lv.999`)로 확장 필요.
2. **50:50 황금 밸런스 및 짝수/홀수 패리티 불변 보존**:
   - 폭망(BAD: Lv.0~499, 500종)과 대박(GOOD: Lv.500~999, 500종) 균형 유지.
   - 짝수(Even: REAL 500종 - 실존 건축물/위키미디어 실사) vs 홀수(Odd: FICTION 500종 - 상상/미디어/AI 일러스트) 원칙 100% 보존.
3. **기존 수집 자산(`G:\My Drive\new_houses`) 안전 마이그레이션**:
   - 이미 수집된 기존 500개 이미지 및 프롬프트 파일(`00000.png` ~ `00499.png`, `.txt`)의 순서가 흐트러지거나, 리넘버링 과정에서 기존 파일이 덮어씌워져 유실되는 문제를 원천 차단하는 안전 알고리즘 필수.

---

## Decision Drivers
- **20개 티어 일관성 유지**: 20개 티어(`Tier 01 ~ Tier 20`) 구조를 그대로 유지하되, 티어당 레벨 수를 기존 25개에서 **50개**로 균등 확장 (`houses-chunk-00.json` ~ `houses-chunk-19.json`).
- **수학적 페어 보존 리넘버링**: 기존의 `(REAL, FICTION)` 페어 관계를 유지하면서, 각 페어 사이에 신규 확장 슬롯을 균등하게 배치하는 폐쇄형(Closed-form) 사상 함수 설계.
- **최상위 엔드포인트(Lv.999) 불변**: 기존 최정점이었던 `Lv.499 (다중우주 창조주의 펜트하우스)`가 신규 체제에서도 궁극의 최고 레벨인 `Lv.999`를 차지하도록 엔드포인트 핀 고정.
- **역순(Descending) 무충돌 단일 패스 파일 리네임**: `newLv >= oldLv` 특성을 활용하여, 임시 파일이나 추가 스토리지 없이 내림차순(499 -> 0)으로 단 한 번의 패스로 안전하게 파일명을 변경하는 알고리즘 적용.

---

## Architecture & Implementation Details

### 1. 1,000단계 티어 및 구역 매핑 규격
- **총 레벨**: `TOTAL_LEVELS = 1000` (`Lv.0 ~ Lv.999`)
- **폭망 구역 (BAD Zone)**: `Lv.0 ~ Lv.499` (티어 1~10, 총 500개)
- **대박 구역 (GOOD Zone)**: `Lv.500 ~ Lv.999` (티어 11~20, 총 500개)
- **티어별 슬롯 수**: `ACTIVE_SLOTS_PER_TIER = 50`

```
Tier 01: Lv.000 ~ Lv.049 (Chunk 00, BAD)  │ Tier 11: Lv.500 ~ Lv.549 (Chunk 10, GOOD)
Tier 02: Lv.050 ~ Lv.099 (Chunk 01, BAD)  │ Tier 12: Lv.550 ~ Lv.599 (Chunk 11, GOOD)
Tier 03: Lv.100 ~ Lv.149 (Chunk 02, BAD)  │ Tier 13: Lv.600 ~ Lv.649 (Chunk 12, GOOD)
Tier 04: Lv.150 ~ Lv.199 (Chunk 03, BAD)  │ Tier 14: Lv.650 ~ Lv.699 (Chunk 13, GOOD)
Tier 05: Lv.200 ~ Lv.249 (Chunk 04, BAD)  │ Tier 15: Lv.700 ~ Lv.749 (Chunk 14, GOOD)
Tier 06: Lv.250 ~ Lv.299 (Chunk 05, BAD)  │ Tier 16: Lv.750 ~ Lv.799 (Chunk 15, GOOD)
Tier 07: Lv.300 ~ Lv.349 (Chunk 06, BAD)  │ Tier 17: Lv.800 ~ Lv.849 (Chunk 16, GOOD)
Tier 08: Lv.350 ~ Lv.399 (Chunk 07, BAD)  │ Tier 18: Lv.850 ~ Lv.899 (Chunk 17, GOOD)
Tier 09: Lv.400 ~ Lv.449 (Chunk 08, BAD)  │ Tier 19: Lv.900 ~ Lv.949 (Chunk 18, GOOD)
Tier 10: Lv.450 ~ Lv.499 (Chunk 09, BAD)  │ Tier 20: Lv.950 ~ Lv.999 (Chunk 19, GOOD)
```

### 2. 페어 보존 리넘버링 사상 함수 (Pairwise Mapping Formula)
기존 500개 레벨은 250개 페어 $p = \lfloor \text{oldLv} / 2 \rfloor \in [0, 249]$ 로 분할됩니다:

1. **표준 페어 ($p = 0 \dots 248$, 즉 $\text{oldLv} = 0 \dots 497$)**:
   $$\text{newLv}(\text{oldEven}) = 4p \quad (\text{REAL})$$
   $$\text{newLv}(\text{oldOdd}) = 4p + 1 \quad (\text{FICTION})$$
   - 신규 확장 슬롯: $4p + 2$ (REAL), $4p + 3$ (FICTION)
2. **최종 정점 페어 ($p = 249$, 즉 $\text{oldLv} = 498, 499$)**:
   $$\text{newLv}(498) = 996 \quad (\text{REAL})$$
   - 신규 확장 슬롯: $997$ (FICTION), $998$ (REAL)
   $$\text{newLv}(499) = 999 \quad (\text{FICTION, 다중우주 창조주의 펜트하우스})$$

### 3. 역순 무충돌 단일 패스 파일 리네임 알고리즘 (Zero-Collision Rename)
$\text{newLv}(k) \ge k$ 특성에 따라, $k = 499$에서 $0$으로 역순 순회 시 대상 위치는 언제나 빈 공간이거나 이미 비워진 슬롯입니다.

```javascript
// Step 2.1 파일명 변경 의사코드 (안전 역순)
for (let oldLv = 499; oldLv >= 0; oldLv--) {
  const newLv = calculateNewLevel(oldLv);
  if (oldLv === newLv) continue; // Lv.0, Lv.1은 이동 없음

  const oldPadded = String(oldLv).padStart(5, '0');
  const newPadded = String(newLv).padStart(5, '0');

  // PNG 및 TXT 파일 안전 이동 (타깃 파일은 절대 미존재 보장)
  renameFile(`G:/My Drive/new_houses/${oldPadded}.png`, `G:/My Drive/new_houses/${newPadded}.png`);
  renameFile(`G:/My Drive/new_houses/${oldPadded}.txt`, `G:/My Drive/new_houses/${newPadded}.txt`);
}
```

### 4. 신규 프롬프트 텍스트 주입 파이프라인 (Step 2.2)
리네임 직후 비어 있는 500개 슬롯에 대하여:
- 청크 파일(`data/chunks/houses-chunk-*.json`) 내 신규 생성된 아이템의 `geminiImagePrompt`를 추출하여 `G:\My Drive\new_houses/{padded}.txt`로 즉시 기록.
- 이후 이미지 생성 엔진이 해당 텍스트를 읽어 PNG를 차례로 수집할 수 있도록 완벽한 인터페이스 제공.

---

## Consequences

### Positive
- **풍부한 콘텐츠**: 기존 대비 2배로 확장된 1,000단계의 스케일로, 사용자 간 집 결과 공유 및 재방문율 대폭 상승.
- **수학적 무결성**: 짝수=실존, 홀수=허구 규칙과 50:50 폭망/대박 비율이 1,000단계 전체에 걸쳐 100% 무결하게 유지됨.
- **자산 손실 위험 제로**: 역순 리네임 알고리즘을 통해 구글 드라이브 내 기존 500개 이미지/텍스트 자산의 손실 및 덮어쓰기 위험 원천 차단.

### Verification Plan
1. 청크 파일 검증: 20개 청크 파일 각각이 50개 아이템을 보유하고 있는지 (`20 * 50 = 1000`) 검증 스크립트 구동.
2. 패리티 검증: 모든 짝수 레벨의 `realityType`이 `"REAL"`, 홀수 레벨이 `"FICTION"`인지 전수 검사.
3. 파일 카운트 검증: Step 2.1 및 2.2 수행 후 `G:\My Drive\new_houses` 내 1,000개의 텍스트 파일이 정확히 존재하는지 확인.
