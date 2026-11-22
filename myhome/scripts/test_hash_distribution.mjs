// scripts/test_hash_distribution.mjs
// 0 ~ 499 단계 (총 500개 슬롯, 20 Tiers × 25 Levels) 해시 매핑 및 50,000 시드 확률분포 검증 스크립트
// myhome.tellmyname.app

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  decomposeHangul,
  getNameStrokeInfo,
  mapNameToHouseLevelFull,
  mapNameToHouseLevel,
  analyzeNameToHouse
} from '../src/lib/hash.js';

import {
  TOTAL_LEVELS,
  MIN_LEVEL,
  MAX_LEVEL,
  GOOD_HOUSE_THRESHOLD,
  ACTIVE_SLOTS_PER_TIER
} from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export { decomposeHangul, mapNameToHouseLevel, TOTAL_LEVELS, MAX_LEVEL };

// 1. 50,000개 다국어 시드 데이터 로드
const SEED_FILE = path.join(ROOT_DIR, 'data/seed_names_50k.json');
let seed50k = [];

if (fs.existsSync(SEED_FILE)) {
  seed50k = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
} else {
  // Fallback to name_teller if seed file missing
  const NAME_TELLER_DIR = 'C:/Users/USER/Documents/projects/name_teller';
  const namesRaw = JSON.parse(fs.readFileSync(path.join(NAME_TELLER_DIR, 'data/compact_serving_names.json'), 'utf8'));
  const top20Surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
  const givenNames = namesRaw.map(x => x[0]);
  const seen = new Set();

  for (const g of givenNames) {
    if (!seen.has(g)) { seen.add(g); seed50k.push(g); }
    if (seed50k.length >= 15000) break;
  }
  for (const g of givenNames) {
    for (const s of top20Surnames) {
      const full = s + g;
      if (!seen.has(full)) { seen.add(full); seed50k.push(full); }
      if (seed50k.length >= 50000) break;
    }
    if (seed50k.length >= 50000) break;
  }
}

// 2. 비교용 알고리즘들
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
    if (lv < GOOD_HOUSE_THRESHOLD) badZone++; else goodZone++;
    if (lv % 2 === 0) evenReal++; else oddFiction++;

    if (name.length === 2) {
      sum2 += lv; cnt2++;
      if (lv < GOOD_HOUSE_THRESHOLD) bad2++;
    } else if (name.length === 3) {
      sum3 += lv; cnt3++;
      if (lv < GOOD_HOUSE_THRESHOLD) bad3++;
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
  '서윤', '김서윤', '이서윤', '박서윤', '김민준', '이민준',
  '홍길동', '선우용녀', 'Steve', 'Emma'
];

const report = {
  generatedAt: new Date().toISOString(),
  totalLevels: TOTAL_LEVELS,
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
    analyze('4. JSA-Hash-500 (자모·획수 아발란체 하이브리드 - 50,000개 전체)', mapNameToHouseLevel, seed50k)
  ],
  sampleMappings: sampleNames.map(name => {
    const analysis = analyzeNameToHouse(name);
    return {
      name,
      length: name.length,
      level: analysis.level,
      zone: analysis.zone,
      zoneLabel: analysis.zoneLabel,
      realityType: analysis.realityType,
      realityLabel: analysis.realityLabel,
      tier: analysis.tier,
      imageUrl: analysis.imageUrl
    };
  })
};

const outDir = path.join(ROOT_DIR, 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'hash_distribution_report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Saved report to data/hash_distribution_report.json');
console.log(JSON.stringify(report.benchmarks[3], null, 2));
