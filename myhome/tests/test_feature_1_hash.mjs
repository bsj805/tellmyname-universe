// tests/test_feature_1_hash.mjs
// Feature #1 검증 테스트: JSA-Hash-500 매핑 엔진 및 5만 개 다국어 시드 확률분포 검증 (0..499 레벨)

import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  CHOSUNG,
  JUNGSUNG,
  JONGSUNG,
  STROKES,
  decomposeHangul,
  getNameStrokeInfo,
  mapNameToHouseLevelFull,
  mapNameToHouseLevel,
  analyzeNameToHouse,
  fmix32
} from '../src/lib/hash.js';
import { TOTAL_LEVELS, MIN_LEVEL, MAX_LEVEL, GOOD_HOUSE_THRESHOLD, ACTIVE_SLOTS_PER_TIER, normalizeToActiveLevel } from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== [Feature #1 Test Suite: JSA-Hash-500 & 50,000 Seed Distribution] ===');

// 1. 문법 검사 (Syntax Check)
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check src/lib/hash.js', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check scripts/build_seed_50k_names.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check scripts/test_hash_distribution.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax checks passed');

// 2. decomposeHangul, getNameStrokeInfo, analyzeNameToHouse 단위 테스트
console.log('\n[2/6] Testing decomposeHangul & getNameStrokeInfo unit functions...');

// 한글 '김' 분해 검증 (ㄱ, ㅣ, ㅁ)
const decompKim = decomposeHangul('김');
assert.strictEqual(decompKim.choChar, 'ㄱ');
assert.strictEqual(decompKim.jungChar, 'ㅣ');
assert.strictEqual(decompKim.jongChar, 'ㅁ');
assert.strictEqual(decompKim.sCho, 2);
assert.strictEqual(decompKim.sJung, 1);
assert.strictEqual(decompKim.sJong, 4);
assert.strictEqual(decompKim.totalStroke, 7);

// 비한글 분해 폴백 검증
const decompAscii = decomposeHangul('A');
assert.strictEqual(decompAscii.code, 65);
assert.strictEqual(decompAscii.choChar, '');
assert.strictEqual(decompAscii.totalStroke, (65 % 9) + 1);

// getNameStrokeInfo 검증
const strokeInfo = getNameStrokeInfo(' 김서윤 ');
assert.strictEqual(strokeInfo.cleanName, '김서윤');
assert.strictEqual(strokeInfo.charCount, 3);
assert.deepStrictEqual(strokeInfo.strokes, [7, 4, 6]);
assert.strictEqual(strokeInfo.totalStrokes, 17);
assert(Array.isArray(strokeInfo.steps), 'steps should be an array');
assert(strokeInfo.steps.length >= 2, 'steps should reduce pairwise');
// steps: row 0: [7, 4, 6], row 1: [(7+4)%10, (4+6)%10] = [1, 0], row 2: [(1+0)%10] = [1]
assert.deepStrictEqual(strokeInfo.steps[0], [7, 4, 6]);
assert.deepStrictEqual(strokeInfo.steps[1], [1, 0]);
assert.deepStrictEqual(strokeInfo.steps[2], [1]);

// analyzeNameToHouse 검증 (1,000 레벨 체계)
const analysis = analyzeNameToHouse('김서윤');
const expectedKimActive = 512;
const expectedKimPadded = String(expectedKimActive).padStart(5, '0');
assert.strictEqual(analysis.cleanName, '김서윤');
assert.strictEqual(analysis.charCount, 3);
assert.deepStrictEqual(analysis.strokes, [7, 4, 6]);
assert.strictEqual(analysis.totalStrokes, 17);
assert.strictEqual(analysis.fullLevel, 512);
assert.strictEqual(analysis.level, expectedKimActive);
assert.strictEqual(analysis.zone, 'GOOD');
assert.strictEqual(analysis.zoneLabel, '대박 하우스');
assert.strictEqual(analysis.realityType, 'REAL');
assert.strictEqual(analysis.tier, 11);
assert.strictEqual(analysis.imageUrl, `/r2/houses/${expectedKimPadded}.webp`);
assert.strictEqual(analysis.ogImageUrl, `https://myhome.tellmyname.app/r2/houses/${expectedKimPadded}.webp`);
console.log('✔ Unit functions passed');

// 3. 결정론(Determinism) 및 정규화(NFC/공백) 불변성 검증 (다국어 포함)
console.log('\n[3/6] Testing determinism and NFC normalization invariance...');
const knownFixtures = [
  ['서윤', 262, 'BAD', 'REAL'],
  ['김서윤', 512, 'GOOD', 'REAL'],
  ['이서윤', 704, 'GOOD', 'REAL'],
  ['박서윤', 343, 'BAD', 'FICTION'],
  ['김민준', 876, 'GOOD', 'REAL'],
  ['이민준', 390, 'BAD', 'REAL'],
  ['홍길동', 540, 'GOOD', 'REAL'],
  ['선우용녀', 66, 'BAD', 'REAL'],
  ['Steve', 183, 'BAD', 'FICTION'],
  ['Emma', 99, 'BAD', 'FICTION']
];

for (const [name, expectedFullLevel, expectedZone, expectedReality] of knownFixtures) {
  const expectedActiveLevel = normalizeToActiveLevel(expectedFullLevel, ACTIVE_SLOTS_PER_TIER);
  const fullLv = mapNameToHouseLevelFull(name);
  assert.strictEqual(fullLv, expectedFullLevel, `Full level check failed for ${name}: expected ${expectedFullLevel}, got ${fullLv}`);

  const lv1 = mapNameToHouseLevel(name);
  const lv2 = mapNameToHouseLevel(name);
  assert.strictEqual(lv1, expectedActiveLevel, `Determinism check failed for ${name}: expected ${expectedActiveLevel}, got ${lv1}`);
  assert.strictEqual(lv1, lv2, `Idempotency check failed for ${name}`);

  // NFC vs NFD 불변성 검증 (맥OS 자모 분리 저장 형태 대응)
  const nfdName = name.normalize('NFD');
  const lvNfd = mapNameToHouseLevel(nfdName);
  assert.strictEqual(lvNfd, expectedActiveLevel, `NFD normalization check failed for ${name}`);

  // 앞뒤 공백 및 줄바꿈 불변성 검증
  const paddedName = `  \n\t${name}\r\n  `;
  const lvPadded = mapNameToHouseLevel(paddedName);
  assert.strictEqual(lvPadded, expectedActiveLevel, `Trim check failed for padded ${name}`);

  // analyzeNameToHouse 연동 속성 검증
  const a = analyzeNameToHouse(name);
  assert.strictEqual(a.fullLevel, expectedFullLevel);
  assert.strictEqual(a.level, expectedActiveLevel);
  assert.strictEqual(a.zone, expectedZone);
  assert.strictEqual(a.realityType, expectedReality);
}
console.log('✔ Determinism and NFC normalization invariance passed');

// 4. 동일 도메인 R2 이미지 경로 포맷 검증
console.log('\n[4/6] Testing R2 imageUrl format (/r2/houses/XXXXX.webp)...');
const imageRegex = /^\/r2\/houses\/\d{5}\.webp$/;
const ogImageRegex = /^https:\/\/myhome\.tellmyname\.app\/r2\/houses\/\d{5}\.webp$/;

const testLevels = [0, 1, 99, 500, 998, 999];
for (const lv of testLevels) {
  const info = analyzeNameToHouse('테스트' + lv);
  assert(imageRegex.test(info.imageUrl), `Invalid imageUrl format: ${info.imageUrl}`);
  assert(ogImageRegex.test(info.ogImageUrl), `Invalid ogImageUrl format: ${info.ogImageUrl}`);
}
assert.strictEqual(analyzeNameToHouse('김서윤').imageUrl, `/r2/houses/${expectedKimPadded}.webp`);
console.log('✔ R2 image url format passed');

// 5. 50,000개 시드 데이터셋 파일 검증
console.log('\n[5/6] Validating data/seed_names_50k.json dataset...');
const seedPath = path.join(ROOT_DIR, 'data/seed_names_50k.json');
assert(fs.existsSync(seedPath), `Seed file not found: ${seedPath}`);

const seedNames = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
assert.strictEqual(Array.isArray(seedNames), true, 'Seed data must be an array');
assert.strictEqual(seedNames.length, 50000, `Expected 50,000 names, got ${seedNames.length}`);

const uniqueSet = new Set(seedNames);
assert.strictEqual(uniqueSet.size, 50000, `Expected 50,000 unique names, got ${uniqueSet.size}`);

// 외국어 이름 포함 여부 확인
assert(uniqueSet.has('Steve'), 'Seed dataset must include Steve');
assert(uniqueSet.has('Emma'), 'Seed dataset must include Emma');
console.log(`✔ Seed dataset contains exactly ${seedNames.length} unique names (including Steve, Emma)`);

// 6. 50,000개 시드 이름 대규모 확률분포 시뮬레이션 검증 (500개 전 슬롯 100% 점유 & 균형 비율)
console.log('\n[6/6] Running full 50,000 seed distribution benchmark for 500 levels...');
const levelCounts = new Int32Array(TOTAL_LEVELS);
const activeLevelCounts = new Int32Array(TOTAL_LEVELS);
let badCount = 0;
let goodCount = 0;
let evenRealCount = 0;
let oddFictionCount = 0;

for (let i = 0; i < seedNames.length; i++) {
  const name = seedNames[i];
  const fullLv = mapNameToHouseLevelFull(name);
  const activeLv = mapNameToHouseLevel(name);

  // 0 <= level <= 499 범위 엄격 검증
  assert(Number.isInteger(fullLv), `Full level must be an integer, got ${fullLv}`);
  assert(fullLv >= MIN_LEVEL && fullLv <= MAX_LEVEL, `Full level out of bounds [${MIN_LEVEL}, ${MAX_LEVEL}]: ${fullLv}`);
  assert(Number.isInteger(activeLv), `Active level must be an integer, got ${activeLv}`);

  levelCounts[fullLv]++;
  activeLevelCounts[activeLv]++;
  if (activeLv < GOOD_HOUSE_THRESHOLD) badCount++; else goodCount++;
  if (activeLv % 2 === 0) evenRealCount++; else oddFictionCount++;
}

let occupiedCount = 0;
let maxCollision = 0;
for (let i = 0; i < TOTAL_LEVELS; i++) {
  const c = levelCounts[i];
  if (c > 0) occupiedCount++;
  if (c > maxCollision) maxCollision = c;
}

const occupiedPercent = (occupiedCount / TOTAL_LEVELS) * 100;
const badPercent = (badCount / seedNames.length) * 100;
const goodPercent = (goodCount / seedNames.length) * 100;
const evenRealPercent = (evenRealCount / seedNames.length) * 100;
const oddFictionPercent = (oddFictionCount / seedNames.length) * 100;

console.log(`- Total names: ${seedNames.length}`);
console.log(`- Occupied levels: ${occupiedCount} / ${TOTAL_LEVELS} (${occupiedPercent.toFixed(2)}%)`);
console.log(`- Max collision on single level: ${maxCollision}`);
console.log(`- Bad Zone (0~249): ${badCount} (${badPercent.toFixed(2)}%)`);
console.log(`- Good Zone (250~499): ${goodCount} (${goodPercent.toFixed(2)}%)`);
console.log(`- Even (Real): ${evenRealCount} (${evenRealPercent.toFixed(2)}%)`);
console.log(`- Odd (Fiction): ${oddFictionCount} (${oddFictionPercent.toFixed(2)}%)`);

// Acceptance Criteria 검증
// 1) 500개 전 단계 100% 점유 검증
assert.strictEqual(
  occupiedCount,
  TOTAL_LEVELS,
  `All ${TOTAL_LEVELS} levels must be 100% occupied`
);

// 2) 폭망/대박 비율 49.0% ~ 51.0% 범위 내
assert(
  badPercent >= 49.0 && badPercent <= 51.0,
  `Bad zone percent (${badPercent.toFixed(2)}%) must be within 49.0% ~ 51.0%`
);
assert(
  goodPercent >= 49.0 && goodPercent <= 51.0,
  `Good zone percent (${goodPercent.toFixed(2)}%) must be within 49.0% ~ 51.0%`
);

// 3) 짝수(실제)/홀수(허구) 비율 49.0% ~ 51.0% 범위 내
assert(
  evenRealPercent >= 49.0 && evenRealPercent <= 51.0,
  `Even (Real) percent (${evenRealPercent.toFixed(2)}%) must be within 49.0% ~ 51.0%`
);
assert(
  oddFictionPercent >= 49.0 && oddFictionPercent <= 51.0,
  `Odd (Fiction) percent (${oddFictionPercent.toFixed(2)}%) must be within 49.0% ~ 51.0%`
);

console.log('\n🎉 ALL FEATURE #1 TESTS PASSED SUCCESSFULLY! (Exit code 0)');
