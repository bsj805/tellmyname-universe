// scripts/build_taxonomy_dataset.mjs — 500종 건물 마스터 데이터셋 및 20개 청크 분할 빌더
// myhome.tellmyname.app

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  MIN_LEVEL,
  MAX_LEVEL,
  TOTAL_LEVELS,
  GOOD_HOUSE_THRESHOLD,
  HOUSE_CATEGORIES
} from '../src/lib/constants.js';
import {
  MASTER_TIERS,
  CATEGORY_MAP,
  getHouseConceptByLevel
} from '../src/lib/taxonomy.js';
import { analyzeNameToHouse } from '../src/lib/hash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CHUNKS_DIR = path.join(DATA_DIR, 'chunks');

console.log('=== [Building 0~499 Taxonomy Dataset & 20 Chunks] ===');

if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
}

// 1. 500개 전체 레벨 생성 및 20개 티어 청크 분할 (청크당 25개)
const NUM_CHUNKS = 20;
const chunks = Array.from({ length: NUM_CHUNKS }, () => []);
const allHouses = [];

const categoryStats = Object.fromEntries(HOUSE_CATEGORIES.map(c => [c.id, 0]));
let realCount = 0;
let fictionCount = 0;
let badCount = 0;
let goodCount = 0;

console.log(`Generating ${TOTAL_LEVELS} house concepts (Lv. ${MIN_LEVEL} .. Lv. ${MAX_LEVEL})...`);

for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
  const house = getHouseConceptByLevel(lv);
  allHouses.push(house);

  const chunkIndex = Math.min(NUM_CHUNKS - 1, Math.floor(lv / 50));
  chunks[chunkIndex].push(house);

  categoryStats[house.category] = (categoryStats[house.category] || 0) + 1;
  if (house.realityType === 'REAL') realCount++;
  else fictionCount++;
  if (house.zone === 'BAD') badCount++;
  else goodCount++;
}

// 2. 20개 청크 파일 저장 (houses-chunk-00.json .. houses-chunk-19.json)
console.log('Writing 20 chunk files to data/chunks/...');
for (let i = 0; i < NUM_CHUNKS; i++) {
  const paddedIndex = String(i).padStart(2, '0');
  const chunkFileName = `houses-chunk-${paddedIndex}.json`;
  const chunkPath = path.join(CHUNKS_DIR, chunkFileName);
  fs.writeFileSync(chunkPath, JSON.stringify(chunks[i], null, 2), 'utf-8');
  console.log(`  ✔ ${chunkFileName}: ${chunks[i].length} items (Lv. ${chunks[i][0].level} ~ Lv. ${chunks[i][chunks[i].length - 1].level})`);
}

// 3. 요약 통계 JSON 파일 저장 (data/concept_table_summary.json)
const summaryData = {
  totalLevels: TOTAL_LEVELS,
  minLevel: MIN_LEVEL,
  maxLevel: MAX_LEVEL,
  badCount,
  goodCount,
  realCount,
  fictionCount,
  categoryStats,
  tiers: MASTER_TIERS.map(t => ({
    tier: t.tier,
    tierName: t.tierName,
    minLevel: t.minLevel,
    maxLevel: t.maxLevel,
    zone: t.zone,
    zoneLabel: t.zone === 'GOOD' ? '대박 하우스' : '폭망 하우스',
    theme: t.desc || t.theme
  })),
  showcaseSamples: [
    0, 1, 2, 3, 4, 5,
    248, 249, 250, 251,
    497, 498, 499
  ].map(lv => getHouseConceptByLevel(lv))
};

const summaryPath = path.join(DATA_DIR, 'concept_table_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2), 'utf-8');
console.log(`✔ Summary JSON saved to: ${summaryPath}`);

console.log('\n=== Dataset Generation Completed Successfully! ===');
