---
name: expand-house-chunks
description: >-
  Standard methodology and automation skill for creating or expanding MyHome house chunks
  (e.g., 500 -> 1,000 -> 2,000 levels), enforcing the mandatory copyright-avoidance prompt
  suffix ("I am not asking for an exact replica. Please first define the key elements to avoid
  copyright infringement, and then implement those elements."), stripping (Lv.XX) tags,
  performing pairwise tier-preserving level migration (4p, 4p+1, 4p+2, 4p+3), collision-free
  descending file renaming in G:\My Drive\new_houses, and parallel Gemini Flash visual QA.
---

# House Chunks Creation & Pairwise Expansion Skill (`expand-house-chunks`)

`myhome` 프로젝트에서 새로운 하우스 이미지 청크(`data/chunks/houses-chunk-*.json`) 및 프롬프트(`.txt`)를 생성하거나, 기존 $N$단계 데이터셋을 $2N$단계(예: $500 \to 1,000 \to 2,000$)로 확장·마이그레이션할 때 반드시 준수해야 하는 표준 방법론 스킬입니다.

---

## 1. 프롬프트 작성 및 정제 절대 원칙 (Prompt Rules)

새로운 이미지 청크나 `.txt` 프롬프트를 생성할 때 **모든 프롬프트(`geminiImagePrompt` 및 `{padded}.txt`)**에 아래 두 가지 규칙을 100% 적용합니다:

### 규칙 A: 저작권 회피 필수 접미사 (Mandatory Copyright-Avoidance Suffix)
모든 프롬프트 문장 끝에 반드시 아래 영문 지시문을 공백 1칸 뒤 그대로 부착합니다:
```text
I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements.
```
- **목적**: 애니메이션·영화·게임 IP(지브리, 디즈니, 픽사, 마블 등) 및 랜드마크 콘셉트 아트 생성 시 안전 필터 차단(`no image generated`)이나 엉뚱한 실사 사진(거리, 카페, 콘서트장 등)으로 폴백(Fallback)되는 현상을 원천 방지합니다.

### 규칙 B: 프롬프트 내 `(Lv.XX)` 레벨 텍스트 완전 배제
프롬프트 내부에 `(Lv.5)`, `Lv.10020` 등의 레벨 표기 문자열을 절대 포함하지 않으며, 정규식으로 전량 제거합니다:
```python
re.sub(r'\s*\(?Lv\.\s*\d+\)?', '', prompt, flags=re.IGNORECASE)
```
- **목적**: 이미지 생성 모델이 프롬프트의 `(Lv.XX)`를 간판, 벽면 낙서, 매트리스 스텐실, 게임 HUD 배너로 이미지 안에 직접 그려 넣는(`LV_TEXT` 결함) 현상을 차단합니다.

### 원클릭 프롬프트 정제 및 접미사 일괄 적용 스크립트
청크 생성 또는 수정 직후 아래 헬퍼 스크립트를 실행하여 `data/chunks/houses-chunk-*.json`과 `G:\My Drive\new_houses\*.txt`를 자동 검증·정제합니다:
```powershell
uv run python ".agents/skills/expand-house-chunks/scripts/sanitize_prompts.py"
```

---

## 2. 단계 2배 확장 방법론 (Pairwise Tier-Preserving Expansion: $N \to 2N$)

기존 $N$개 레벨(`0 .. N-1`)에 이미 생성된 `.png` 이미지들을 100% 보존하면서, 티어 순서·짝홀수 패리티·폭망/대박 경계를 깨뜨리지 않고 $2N$개 레벨(`0 .. 2N-1`)로 확장하는 검증된 5단계 알고리즘입니다.

### Step 1: 4분면(4-Quadrant) 신규 데이터 큐레이션
새로 추가할 $N$개의 하우스 데이터를 4개 분면으로 정확히 $N/4$개씩 나누어 병렬 구축합니다:
1. **`new_real_bad` ($N/4$개)**: 폭망 구간의 짝수 레벨용 **실존(REAL)** 극한/기괴 장소 (`scripts/data_new_real_bad.mjs`)
2. **`new_fic_bad` ($N/4$개)**: 폭망 구간의 홀수 레벨용 **허구(FICTION)** 최악의 거처 (`scripts/data_new_fic_bad.mjs`)
3. **`new_real_good` ($N/4$개)**: 대박 구간의 짝수 레벨용 **실존(REAL)** 초호화/비경 건축물 (`scripts/data_new_real_good.mjs`)
4. **`new_fic_good` ($N/4$개)**: 대박 구간의 홀수 레벨용 **허구(FICTION)** 판타지/SF 궁전 (`scripts/data_new_fic_good.mjs`)

> **불변식(Invariants)**:
> - 기존 $N$개 + 신규 $N$개 = 총 $2N$개의 `title`(주택명)은 **중복 0% (100% 고유)**여야 합니다.
> - 모든 신규 항목의 `geminiImagePrompt`에는 `(Lv.XX)`가 없어야 하며, **저작권 회피 필수 접미사**가 포함되어야 합니다.

---

### Step 2: 짝수·홀수 패리티 및 티어 보존 매핑 공식 (`4p, 4p+1, 4p+2, 4p+3`)
기존 $N$개 레벨을 2개씩 묶은 $N/2$개의 페어 $p \in \{0, 1, \dots, N/2 - 1\}$에 대해:

1. **일반 페어 ($0 \le p < N/2 - 1$)**:
   - `newLv = 4p` (**짝수, REAL**): 기존 `oldLv = 2p` (REAL) 배치
   - `newLv = 4p + 1` (**홀수, FICTION**): 기존 `oldLv = 2p + 1` (FICTION) 배치
   - `newLv = 4p + 2` (**짝수, REAL**): 신규 큐레이션 REAL 항목 (`p < N/4`이면 `new_real_bad[p]`, 아니면 `new_real_good[p - N/4]`) 삽입
   - `newLv = 4p + 3` (**홀수, FICTION**): 신규 큐레이션 FICTION 항목 (`p < N/4`이면 `new_fic_bad[p]`, 아니면 `new_fic_good[p - N/4]`) 삽입

2. **최종 정점 페어 ($p = N/2 - 1$, 최고 레벨 앵커 보존)**:
   - `newLv = 2N - 4` (**짝수, REAL**): 기존 `oldLv = N - 2` (REAL) 배치
   - `newLv = 2N - 3` (**홀수, FICTION**): 신규 큐레이션 FICTION 마지막 항목 배치
   - `newLv = 2N - 2` (**짝수, REAL**): 신규 큐레이션 REAL 마지막 항목 배치
   - `newLv = 2N - 1` (**홀수, FICTION**): 기존 최고봉 `oldLv = N - 1` (우주 창조주 펜트하우스) 고정 배치!

이 공식을 통해:
- `Lv.0`(최하위 앵커)과 `Lv.2N-1`(최상위 앵커)이 그대로 유지됩니다.
- 모든 레벨에서 **짝수 = REAL, 홀수 = FICTION** 규칙이 100% 유지됩니다.
- 모든 기존 아이템의 상대적 서열과 20개 티어(`Tier 01` ~ `Tier 20`) 분포가 정확히 2배로 스케일링됩니다.

---

### Step 3: 충돌 없는 내림차순 파일 리네이밍 (Collision-Free Descending Rename)
모든 기존 아이템에 대해 항상 `newLevel >= oldLevel`이 성립합니다.
따라서 `G:\My Drive\new_houses` 폴더의 기존 `.png` 및 `.txt` 파일을 리네이밍할 때:
1. **`oldLevel` 기준 내림차순(`N - 1`부터 `0`까지 역순)**으로 정렬합니다 (`renameOps.sort((a, b) => b.oldLevel - a.oldLevel)`).
2. 역순으로 `{oldPadded}.png -> {newPadded}.png`, `{oldPadded}.txt -> {newPadded}.txt`를 이동하면 임시 폴더 없이도 **덮어쓰기 충돌이 0건**으로 보장됩니다 (`scripts/apply_new_houses_migration.mjs`).
3. 리네이밍 직후, 새로 삽입된 $N$개 슬롯(`4p+2`, `4p+3`)의 `.txt` 프롬프트 파일을 생성합니다.

---

### Step 4: 런타임 데이터셋·해시·다국어·정적 빌드 동기화
청크 확장 후 아래 파이프라인을 순서대로 실행하여 웹 앱과 정적 빌드를 동기화합니다:
1. `src/lib/constants.js` 및 `web/js/lib/constants.js`: `MAX_LEVEL`, `TOTAL_LEVELS`, `GOOD_HOUSE_THRESHOLD` 업데이트
2. `src/lib/master_dataset.js` 및 `src/lib/i18n.js`: 20개 청크 기반 마스터 데이터셋 및 14개 언어 번역 사전 재빌드
3. `node scripts/build_seed_50k_names.mjs`: 50,000개 시드 이름 해시 역라우팅 맵(`src/lib/level_name_map.js`) 재생성
4. `node scripts/generate_static_site.mjs`: `src/lib/* -> dist/js/lib/*` 및 `data/chunks/* -> dist/data/chunks/*` 번들링

---

### Step 5: Gemini Flash 멀티에이전트 전수 시각 검수 (Parallel Visual QA)
생성 또는 마이그레이션된 `.png` 파일들을 50개씩 분할(`batch_01.json` ~ `batch_XX.json`)한 뒤, `invoke_subagent`(`Model: "flash"`)를 병렬 호출하여 `read_file`로 모든 이미지를 직접 육안 검수합니다:
- **`MISMATCH`**: 프롬프트 피사체와 무관한 폴백 실사 이미지(거리, 카페, 식사 장면 등) 검출 및 즉시 재생성
- **`LV_TEXT`**: 이미지 내 `Lv.XX` 스텐실/간판 검출
- **`SPLIT_IMAGE`**: 2분할(Diptych) 구도 결함 검출
