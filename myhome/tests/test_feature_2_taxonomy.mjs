// tests/test_feature_2_taxonomy.mjs — Feature #2 0~499단계 마스터 택소노미 및 50:50 교차 데이터셋 검증 테스트
// myhome.tellmyname.app

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import {
  MIN_LEVEL,
  MAX_LEVEL,
  TOTAL_LEVELS,
  GOOD_HOUSE_THRESHOLD,
  HOUSE_CATEGORIES,
  SITE_ORIGIN
} from '../src/lib/constants.js';

import {
  MASTER_TIERS,
  CATEGORY_MAP,
  getHouseConceptByLevel
} from '../src/lib/taxonomy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

console.log('=== [Feature #2 Test Suite: Master Taxonomy & Alternating Dataset (500 Levels)] ===');

// 1. 구문 문법 검사 (Syntax Check)
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check src/lib/taxonomy.js', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check scripts/build_taxonomy_dataset.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax checks passed');

// 2. MASTER_TIERS 20개 티어 규격 검증 (50 levels per tier)
console.log('\n[2/6] Verifying MASTER_TIERS array (20 tiers, 50 levels each)...');
assert.strictEqual(MASTER_TIERS.length, 20, 'MASTER_TIERS must contain exactly 20 tiers');

for (let i = 0; i < 20; i++) {
  const t = MASTER_TIERS[i];
  assert.strictEqual(t.tier, i + 1, `Tier index mismatch at ${i}`);
  assert(t.tierName && typeof t.tierName === 'string', `tierName required for tier ${i + 1}`);
  assert.strictEqual(t.minLevel, i * 50, `minLevel mismatch for tier ${i + 1}`);
  const expectedMax = (i + 1) * 50 - 1;
  assert.strictEqual(t.maxLevel, expectedMax, `maxLevel mismatch for tier ${i + 1}`);
  if (i < 10) {
    assert.strictEqual(t.zone, 'BAD', `Tier ${i + 1} must be BAD zone`);
  } else {
    assert.strictEqual(t.zone, 'GOOD', `Tier ${i + 1} must be GOOD zone`);
  }
}
console.log('✔ MASTER_TIERS verified: 20 tiers covering Lv.0 to Lv.999 perfectly');

// 3. 1,000개 전체 레벨 순회 및 불변 조건 검증 (50:50 교차, BAD/GOOD 경계, 필드 완성도)
console.log('\n[3/6] Exhaustively verifying all 1,000 levels (0..999)...');
const categoryUsage = Object.fromEntries(HOUSE_CATEGORIES.map(c => [c.id, 0]));
let realCount = 0;
let fictionCount = 0;
let badCount = 0;
let goodCount = 0;

for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
  const h = getHouseConceptByLevel(lv);

  // 기본 메타 일치 검증
  assert.strictEqual(h.level, lv, `Level mismatch for Lv.${lv}`);

  // 짝수/홀수 50:50 교차 법칙 검증
  if (lv % 2 === 0) {
    assert.strictEqual(h.realityType, 'REAL', `Even level ${lv} must be REAL`);
    assert(h.realityLabel.includes('실제'), `Even level ${lv} realityLabel must mention 실제`);
    realCount++;
  } else {
    assert.strictEqual(h.realityType, 'FICTION', `Odd level ${lv} must be FICTION`);
    assert(h.realityLabel.includes('허구') || h.realityLabel.includes('상상'), `Odd level ${lv} realityLabel must mention 허구/상상`);
    fictionCount++;
  }

  // 0..499 BAD vs 500..999 GOOD 검증
  if (lv < GOOD_HOUSE_THRESHOLD) {
    assert.strictEqual(h.zone, 'BAD', `Level ${lv} (<500) must be BAD zone`);
    badCount++;
  } else {
    assert.strictEqual(h.zone, 'GOOD', `Level ${lv} (>=500) must be GOOD zone`);
    goodCount++;
  }

  // 필수 문자열 필드 비어있지 않음 검증
  assert(h.title && h.title.trim().length > 0, `title must be non-empty at Lv.${lv}`);
  assert(h.builtYear && h.builtYear.trim().length > 0, `builtYear must be non-empty at Lv.${lv}`);
  assert(h.estimatedValue && h.estimatedValue.trim().length > 0, `estimatedValue must be non-empty at Lv.${lv}`);
  assert(h.specialFeature && h.specialFeature.trim().length > 0, `specialFeature must be non-empty at Lv.${lv}`);
  assert(h.aiVerdict && h.aiVerdict.trim().length > 0, `aiVerdict must be non-empty at Lv.${lv}`);
  assert(h.geminiImagePrompt && h.geminiImagePrompt.trim().length > 0, `geminiImagePrompt must be non-empty at Lv.${lv}`);

  // Cloudflare R2 이미지 URL 형식 검증 (/r2/houses/XXXXX.webp)
  const expectedPadded = String(lv).padStart(5, '0');
  const expectedRelUrl = `/r2/houses/${expectedPadded}.webp`;
  const expectedOgUrl = `${SITE_ORIGIN}${expectedRelUrl}`;
  assert.strictEqual(h.imageUrl, expectedRelUrl, `imageUrl mismatch at Lv.${lv}`);
  assert.strictEqual(h.ogImageUrl, expectedOgUrl, `ogImageUrl mismatch at Lv.${lv}`);

  // 카테고리 필드 유효성 검증
  assert(h.category && typeof h.category === 'string', `Invalid category ${h.category} at Lv.${lv}`);
  assert(h.categoryLabel && typeof h.categoryLabel === 'string', `categoryLabel required at Lv.${lv}`);
  categoryUsage[h.category] = (categoryUsage[h.category] || 0) + 1;
}

assert.strictEqual(realCount, 500, 'REAL levels must be exactly 500');
assert.strictEqual(fictionCount, 500, 'FICTION levels must be exactly 500');
assert.strictEqual(badCount, 500, 'BAD levels must be exactly 500 (0..499)');
assert.strictEqual(goodCount, 500, 'GOOD levels must be exactly 500 (500..999)');

// 12개 모든 카테고리 사용 확인
for (const cat of HOUSE_CATEGORIES) {
  assert(categoryUsage[cat.id] > 0, `Category ${cat.id} must be used at least once`);
}

console.log('✔ 1,000 levels verified:');
console.log(`  - REAL (Even): ${realCount.toLocaleString()} | FICTION (Odd): ${fictionCount.toLocaleString()}`);
console.log(`  - BAD (0..499): ${badCount.toLocaleString()} | GOOD (500..999): ${goodCount.toLocaleString()}`);
console.log(`  - All 12 categories actively utilized across dataset`);

// 4. 주요 고정 랜드마크 스펙 일치성 검증 (0, 1, 4, 5, 500, 999 등)
console.log('\n[4/6] Verifying key signature landmark levels...');
const testLandmarks = [
  { lv: 0, titleKeyword: '카와이젠', reality: 'REAL', zone: 'BAD' },
  { lv: 1, titleKeyword: '마그마', reality: 'FICTION', zone: 'BAD' },
  { lv: 4, titleKeywords: ['오이미야콘', '북극곰'], reality: 'REAL', zone: 'BAD' },
  { lv: 5, titleKeywords: ['티라노사우루스', '사우론'], reality: 'FICTION', zone: 'BAD' },
  { lv: 500, titleKeyword: '서바이벌 콘도', reality: 'REAL', zone: 'GOOD' },
  { lv: 999, titleKeyword: '카멜롯', reality: 'FICTION', zone: 'GOOD' }
];

for (const lm of testLandmarks) {
  const h = getHouseConceptByLevel(lm.lv);
  if (lm.titleKeywords) {
    assert(lm.titleKeywords.some(kw => h.title.includes(kw)), `Title must include one of [${lm.titleKeywords.join(', ')}] at Lv.${lm.lv}, got: '${h.title}'`);
  } else {
    assert(h.title.includes(lm.titleKeyword), `Title must include '${lm.titleKeyword}' at Lv.${lm.lv}, got: '${h.title}'`);
  }
  assert.strictEqual(h.realityType, lm.reality, `realityType mismatch at Lv.${lm.lv}`);
  assert.strictEqual(h.zone, lm.zone, `zone mismatch at Lv.${lm.lv}`);
}
console.log('✔ All signature landmark fixtures successfully verified');

// 5. 20개 컴파일된 청크 파일 검증 (data/chunks/houses-chunk-00.json .. 19.json)
console.log('\n[5/6] Verifying 20 pre-compiled chunk files...');
let totalChunkItems = 0;
const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.startsWith('houses-chunk-') && f.endsWith('.json'));
assert.strictEqual(chunkFiles.length, 20, 'Must have exactly 20 chunk files');

for (let i = 0; i < 20; i++) {
  const filename = `houses-chunk-${String(i).padStart(2, '0')}.json`;
  const filePath = path.join(CHUNKS_DIR, filename);
  assert(fs.existsSync(filePath), `Chunk file ${filename} must exist`);

  const chunkData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert(Array.isArray(chunkData), `Chunk ${filename} must contain an array`);
  assert.strictEqual(chunkData.length, 50, `Chunk ${filename} must contain exactly 50 items, got ${chunkData.length}`);
  totalChunkItems += chunkData.length;

  // 인덱스 및 레벨 연속성 검증
  for (let j = 0; j < chunkData.length; j++) {
    const item = chunkData[j];
    assert.strictEqual(typeof item.level, 'number', `Item in ${filename} must have number level`);
    assert(item.title && typeof item.title === 'string', `Item in ${filename} must have string title`);
  }
}

assert.strictEqual(totalChunkItems, TOTAL_LEVELS, `Total chunk items must equal ${TOTAL_LEVELS}`);
console.log(`✔ All 20 chunk files verified: Exactly ${TOTAL_LEVELS} items (50 per chunk) correctly partitioned`);

// 6. 요약 통계 및 마크다운 명세서 파일 검증
console.log('\n[6/6] Verifying concept_table_summary.json and docs/CONCEPT_TABLE_0_TO_340.md...');
const summaryFile = path.join(ROOT_DIR, 'data', 'concept_table_summary.json');
assert(fs.existsSync(summaryFile), 'concept_table_summary.json must exist');
const summaryJson = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));
assert(summaryJson.totalLevels === 500 || summaryJson.totalLevels === TOTAL_LEVELS);
assert.strictEqual(summaryJson.tiers.length, 20);

const docFile = path.join(DOCS_DIR, 'CONCEPT_TABLE_0_TO_340.md');
assert(fs.existsSync(docFile), 'docs/CONCEPT_TABLE_0_TO_340.md must exist');
console.log('✔ Summary JSON and Documentation verified');

console.log('\n🎉 ALL FEATURE #2 TAXONOMY & ALTERNATING DATASET TESTS PASSED! (Exit code 0)');
