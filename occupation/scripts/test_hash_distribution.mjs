// scripts/test_hash_distribution.mjs
// 0 ~ 1000 단계 (총 1,001개 슬롯, 20 Tiers) JSA-Hash-1001 매핑 및 50,000 시드 확률분포 검증 스크립트
// job.tellmyname.app

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  decomposeHangul,
  getNameStrokeInfo,
  mapNameToJobLevelFull,
  mapNameToJobLevel,
  analyzeNameToJob
} from '../src/lib/hash.js';

import {
  TOTAL_LEVELS,
  MIN_LEVEL,
  MAX_LEVEL,
  GOOD_JOB_THRESHOLD,
  GOOD_HOUSE_THRESHOLD,
  ACTIVE_SLOTS_PER_TIER
} from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export {
  decomposeHangul,
  getNameStrokeInfo,
  mapNameToJobLevelFull,
  mapNameToJobLevel,
  analyzeNameToJob,
  TOTAL_LEVELS,
  MIN_LEVEL,
  MAX_LEVEL
};

export const mapNameToHouseLevelFull = mapNameToJobLevelFull;
export const mapNameToHouseLevel = mapNameToJobLevel;
export const analyzeNameToHouse = analyzeNameToJob;

// 1. 50,000개 다국어 시드 데이터 로드 (없을 경우 name_teller / myhome 기반 자동 생성)
const SEED_FILE = path.join(ROOT_DIR, 'data/seed_names_50k.json');
const MYHOME_SEED_FILE = 'C:/Users/USER/Documents/projects/myhome/data/seed_names_50k.json';
const NAME_TELLER_DIR = 'C:/Users/USER/Documents/projects/name_teller';

let seed50k = [];

if (fs.existsSync(SEED_FILE)) {
  seed50k = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
} else if (fs.existsSync(MYHOME_SEED_FILE)) {
  seed50k = JSON.parse(fs.readFileSync(MYHOME_SEED_FILE, 'utf8'));
  fs.mkdirSync(path.dirname(SEED_FILE), { recursive: true });
  fs.writeFileSync(SEED_FILE, JSON.stringify(seed50k, null, 2), 'utf8');
} else {
  // Fallback to name_teller if seed file missing
  const namesRaw = JSON.parse(fs.readFileSync(path.join(NAME_TELLER_DIR, 'data/compact_serving_names.json'), 'utf8'));
  const surnamesRaw = JSON.parse(fs.readFileSync(path.join(NAME_TELLER_DIR, 'data/korean_surnames_all.json'), 'utf8'));
  const topSurnames = surnamesRaw.slice(0, 30).map(s => s.surname);
  const givenNames = namesRaw.map(x => x[0]);
  const seen = new Set();

  const mandatoryNames = [
    '김서윤', '이민준', '홍길동', '박대기', '선우용녀', 'Steve', 'Emma', '서윤', '이지안'
  ];
  for (const m of mandatoryNames) {
    if (!seen.has(m)) { seen.add(m); seed50k.push(m); }
  }

  for (const g of givenNames) {
    if (!seen.has(g)) { seen.add(g); seed50k.push(g); }
    if (seed50k.length >= 10000) break;
  }
  for (const g of givenNames) {
    for (const s of topSurnames) {
      const full = s + g;
      if (!seen.has(full)) { seen.add(full); seed50k.push(full); }
      if (seed50k.length >= 50000) break;
    }
    if (seed50k.length >= 50000) break;
  }

  fs.mkdirSync(path.dirname(SEED_FILE), { recursive: true });
  fs.writeFileSync(SEED_FILE, JSON.stringify(seed50k, null, 2), 'utf8');
}

// 2. 비교용 4대 해시 알고리즘
function hashStrokeSum(name) {
  let sum = 0;
  for (const ch of name) sum += decomposeHangul(ch).totalStroke;
  return sum % TOTAL_LEVELS;
}

function hashStrokePoly(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    const d = decomposeHangul(name[i]);
    h = (h * 131 + d.totalStroke * 17 + d.sCho * 7 + d.sJung * 3 + d.sJong) % TOTAL_LEVELS;
  }
  return h;
}

function hashDjb2(name) {
  let h = 5381;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) + h) ^ name.charCodeAt(i);
  }
  return (h >>> 0) % TOTAL_LEVELS;
}

function analyze(label, fn, dataset) {
  const counts = new Int32Array(TOTAL_LEVELS);
  const bins10 = new Int32Array(10);
  let badZone = 0, goodZone = 0;
  let evenReal = 0, oddFiction = 0;
  let sum2 = 0, cnt2 = 0, bad2 = 0;
  let sum3 = 0, cnt3 = 0, bad3 = 0;

  for (const name of dataset) {
    const lv = fn(name);
    counts[lv]++;
    const bin = Math.min(9, Math.floor(lv / (TOTAL_LEVELS / 10)));
    bins10[bin]++;
    if (lv < GOOD_JOB_THRESHOLD) badZone++; else goodZone++;
    if (lv % 2 === 0) evenReal++; else oddFiction++;

    if (name.length === 2) {
      sum2 += lv; cnt2++;
      if (lv < GOOD_JOB_THRESHOLD) bad2++;
    } else if (name.length === 3) {
      sum3 += lv; cnt3++;
      if (lv < GOOD_JOB_THRESHOLD) bad3++;
    }
  }

  let occupied = 0, maxCollision = 0;
  const freqHist = {};
  const expected = dataset.length / TOTAL_LEVELS;
  let chiSq = 0;

  for (let i = 0; i < TOTAL_LEVELS; i++) {
    const c = counts[i];
    if (c > 0) occupied++;
    if (c > maxCollision) maxCollision = c;
    freqHist[c] = (freqHist[c] || 0) + 1;
    const diff = c - expected;
    chiSq += (diff * diff) / expected;
  }

  const theoreticalOccupied = Math.round(TOTAL_LEVELS * (1 - Math.exp(-dataset.length / TOTAL_LEVELS)));

  return {
    label,
    totalNames: dataset.length,
    occupiedLevels: occupied,
    occupiedPercent: Number((occupied / TOTAL_LEVELS * 100).toFixed(2)),
    theoreticalOccupied,
    theoreticalPercent: Number((theoreticalOccupied / TOTAL_LEVELS * 100).toFixed(2)),
    maxCollision,
    chiSquare: Number(chiSq.toFixed(1)),
    badZoneCount: badZone,
    badZonePercent: Number((badZone / dataset.length * 100).toFixed(2)),
    goodZoneCount: goodZone,
    goodZonePercent: Number((goodZone / dataset.length * 100).toFixed(2)),
    evenRealCount: evenReal,
    evenRealPercent: Number((evenReal / dataset.length * 100).toFixed(2)),
    oddFictionCount: oddFiction,
    oddFictionPercent: Number((oddFiction / dataset.length * 100).toFixed(2)),
    len2Mean: cnt2 > 0 ? Number((sum2 / cnt2).toFixed(1)) : 0,
    len2BadPercent: cnt2 > 0 ? Number((bad2 / cnt2 * 100).toFixed(2)) : 0,
    len3Mean: cnt3 > 0 ? Number((sum3 / cnt3).toFixed(1)) : 0,
    len3BadPercent: cnt3 > 0 ? Number((bad3 / cnt3 * 100).toFixed(2)) : 0,
    bins10Percent: Array.from(bins10).map(x => Number((x / dataset.length * 100).toFixed(2))),
    collisionHistogram: freqHist
  };
}

const sampleNames = [
  '김서윤', '이민준', '홍길동', '박대기', '선우용녀', 'Steve', 'Emma', '서윤', '이지안'
];

const benchmarkJsa = analyze('4. JSA-Hash-1001 (자모·획수 아발란체 하이브리드 - 50,000개 전체)', mapNameToJobLevel, seed50k);

const report = {
  generatedAt: new Date().toISOString(),
  totalLevels: TOTAL_LEVELS,
  goodJobThreshold: GOOD_JOB_THRESHOLD,
  goodHouseThreshold: GOOD_HOUSE_THRESHOLD,
  seedSource: 'data/seed_names_50k.json (50,000 Multilingual Seed Names)',
  datasetComposition: {
    total: seed50k.length,
    len2Count: seed50k.filter(n => n.length === 2).length,
    len3Count: seed50k.filter(n => n.length === 3).length,
    len4PlusCount: seed50k.filter(n => n.length >= 4).length
  },
  benchmarks: [
    analyze('1. 단순 획수 합산 (Naive Stroke Sum)', hashStrokeSum, seed50k),
    analyze('2. 획수 다항 롤링 해시 (Stroke Polynomial)', hashStrokePoly, seed50k),
    analyze('3. 단순 UTF-16 DJB2 해시', hashDjb2, seed50k),
    benchmarkJsa
  ],
  sampleMappings: sampleNames.map(name => {
    const analysis = analyzeNameToJob(name);
    return {
      name,
      length: name.length,
      level: analysis.level,
      zone: analysis.zone,
      zoneLabel: analysis.zoneLabel,
      realityType: analysis.realityType,
      realityLabel: analysis.realityLabel,
      tier: analysis.tier,
      imageUrl: analysis.imageUrl,
      ogImageUrl: analysis.ogImageUrl
    };
  })
};

// 3. 검증 (Assertion)
if (benchmarkJsa.occupiedLevels !== TOTAL_LEVELS) {
  console.error(`❌ Validation Failed: Expected 100% occupation (${TOTAL_LEVELS} levels), but got ${benchmarkJsa.occupiedLevels}`);
  process.exit(1);
}

if (Math.abs(benchmarkJsa.badZonePercent - 50.0) > 3.0) {
  console.error(`❌ Validation Failed: BAD zone (${benchmarkJsa.badZonePercent}%) is skewed! Expected ~50%`);
  process.exit(1);
}

if (Math.abs(benchmarkJsa.evenRealPercent - 50.0) > 3.0) {
  console.error(`❌ Validation Failed: REAL (even) zone (${benchmarkJsa.evenRealPercent}%) is skewed! Expected ~50%`);
  process.exit(1);
}

const outDir = path.join(ROOT_DIR, 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'hash_distribution_report.json'), JSON.stringify(report, null, 2), 'utf8');

console.log('✅ 50,000 Seed Names JSA-Hash-1001 Benchmark PASSED:');
console.log(`   - Total Levels: ${TOTAL_LEVELS} (0 ~ 1000)`);
console.log(`   - Occupied Levels: ${benchmarkJsa.occupiedLevels} / ${TOTAL_LEVELS} (${benchmarkJsa.occupiedPercent}%)`);
console.log(`   - BAD vs GOOD: ${benchmarkJsa.badZonePercent}% vs ${benchmarkJsa.goodZonePercent}%`);
console.log(`   - REAL(Even) vs FICTION(Odd): ${benchmarkJsa.evenRealPercent}% vs ${benchmarkJsa.oddFictionPercent}%`);
console.log(`   - Chi-Square: ${benchmarkJsa.chiSquare} (Max collision: ${benchmarkJsa.maxCollision})`);
console.log('✔ Saved report to data/hash_distribution_report.json');
console.log('✔ Sample Mappings:');
report.sampleMappings.forEach(s => {
  console.log(`   [Lv.${String(s.level).padStart(4, ' ')}] ${s.name} -> ${s.zoneLabel} | ${s.realityLabel} (Tier ${s.tier})`);
});
