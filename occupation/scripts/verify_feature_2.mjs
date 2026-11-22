// scripts/verify_feature_2.mjs
// Comprehensive Verification for Feature #2: Master Dataset, Taxonomy, Prompts & Scripts

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

import {
  MASTER_TIERS_1001,
  MASTER_TIERS_500,
  MASTER_JOBS,
  MASTER_HOUSES,
  lookupJobByLevel
} from '../src/lib/master_dataset.js';

import {
  getJobConceptByLevel,
  getHouseConceptByLevel,
  renderJobArtworkSvg,
  getJobArtworkSvgDataUri
} from '../src/lib/taxonomy.js';

import { JOB_CATEGORIES } from '../src/lib/constants.js';

console.log('===============================================================');
console.log(' [VERIFY] Feature #2 Master Dataset, Taxonomy & Generator Audit');
console.log('===============================================================');

const VALID_CATEGORIES = new Set(JOB_CATEGORIES.map(c => c.id));
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✔ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Array length and aliases
assert(MASTER_JOBS.length === 1001, `MASTER_JOBS has 1001 items (got ${MASTER_JOBS.length})`);
assert(MASTER_HOUSES === MASTER_JOBS, 'MASTER_HOUSES is alias to MASTER_JOBS');
assert(MASTER_TIERS_1001.length === 20, `MASTER_TIERS_1001 has 20 tiers (got ${MASTER_TIERS_1001.length})`);
assert(MASTER_TIERS_500 === MASTER_TIERS_1001, 'MASTER_TIERS_500 is alias to MASTER_TIERS_1001');

// 2. Titles uniqueness
const titleSet = new Set();
const duplicateTitles = [];
for (const j of MASTER_JOBS) {
  if (titleSet.has(j.title)) duplicateTitles.push(j.title);
  titleSet.add(j.title);
}
assert(titleSet.size === 1001 && duplicateTitles.length === 0, `All 1001 titles are 100% unique (duplicates: ${duplicateTitles.length})`);

// 3. Real vs Fiction 50:50 alternation
let realCount = 0;
let fictCount = 0;
let altViolations = 0;

for (let i = 0; i < MASTER_JOBS.length; i++) {
  const j = MASTER_JOBS[i];
  assert(j.level === i, `Level matches array index for level ${i}`);
  const isEven = i % 2 === 0;

  if (isEven) {
    realCount++;
    if (j.realityType !== 'REAL' || !j.realityLabel.includes('실제')) altViolations++;
  } else {
    fictCount++;
    if (j.realityType !== 'FICTION' || !j.realityLabel.includes('허구')) altViolations++;
  }
}

assert(realCount === 501, `Even levels = REAL (501 items, got ${realCount})`);
assert(fictCount === 500, `Odd levels = FICTION (500 items, got ${fictCount})`);
assert(altViolations === 0, `Strict 50:50 Real vs Fiction alternating violations: ${altViolations}`);

// 4. Zone checks (0..499 BAD, 500..1000 GOOD)
let badCount = 0;
let goodCount = 0;
let zoneViolations = 0;

for (const j of MASTER_JOBS) {
  if (j.level < 500) {
    badCount++;
    if (j.zone !== 'BAD' || j.zoneLabel !== '폭망 직업') zoneViolations++;
  } else {
    goodCount++;
    if (j.zone !== 'GOOD' || j.zoneLabel !== '대박 직업') zoneViolations++;
  }
}

assert(badCount === 500, `BAD Zone (0..499) has 500 items (got ${badCount})`);
assert(goodCount === 501, `GOOD Zone (500..1000) has 501 items (got ${goodCount})`);
assert(zoneViolations === 0, `Zone classification violations: ${zoneViolations}`);

// 5. Required fields audit
let fieldErrors = 0;
for (const j of MASTER_JOBS) {
  if (!j.title || typeof j.title !== 'string') fieldErrors++;
  if (!VALID_CATEGORIES.has(j.category)) fieldErrors++;
  if (!j.categoryLabel || !j.categoryEmoji) fieldErrors++;
  if (j.tier < 1 || j.tier > 20 || !j.tierName) fieldErrors++;
  if (!j.era || !j.estimatedSalary || !j.specialDuty || !j.aiVerdict) fieldErrors++;
  // Backward compatibility aliases
  if (j.builtYear !== j.era || j.estimatedValue !== j.estimatedSalary || j.specialFeature !== j.specialDuty) fieldErrors++;
  if (!j.imagePrompt || !j.geminiImagePrompt) fieldErrors++;
  if (!j.imageUrl.startsWith('/r2/jobs/') || !j.ogImageUrl.startsWith('https://job.tellmyname.app/r2/jobs/')) fieldErrors++;
  if (!j.en || !j.en.title || !j.en.era || !j.en.estimatedSalary || !j.en.specialDuty || !j.en.aiVerdict) fieldErrors++;
}
assert(fieldErrors === 0, `All required fields, aliases, and English translations present (errors: ${fieldErrors})`);

// 6. Landmark jobs verification
const lv0 = getJobConceptByLevel(0);
const lv100 = getJobConceptByLevel(100);
const lv186 = getJobConceptByLevel(186);
const lv250 = getJobConceptByLevel(250);
const lv331 = getJobConceptByLevel(331);
const lv335 = getJobConceptByLevel(335);
const lv441 = getJobConceptByLevel(441);
const lv600 = getJobConceptByLevel(600);
const lv628 = getJobConceptByLevel(628);
const lv999 = getJobConceptByLevel(999);
const lv1000 = getJobConceptByLevel(1000);

assert(lv0.title.includes('콜로세움') && lv0.realityType === 'REAL', `Lv.0 iconic job: ${lv0.title}`);
assert(lv100.title.includes('발가락 리모컨') && lv100.realityType === 'REAL', `Lv.100 iconic job: ${lv100.title}`);
assert(lv186.title.includes('방수 시계') && lv186.realityType === 'REAL', `Lv.186 iconic job: ${lv186.title}`);
assert(lv250.title.includes('박대기') && lv250.realityType === 'REAL', `Lv.250 iconic job: ${lv250.title}`);
assert(lv331.title.includes('유령의 집 귀마개') && lv331.realityType === 'FICTION', `Lv.331 iconic job: ${lv331.title}`);
assert(lv335.title.includes('스폰지밥') && lv335.realityType === 'FICTION', `Lv.335 iconic job: ${lv335.title}`);
assert(lv441.title.includes('고질라') && lv441.realityType === 'FICTION', `Lv.441 iconic job: ${lv441.title}`);
assert(lv600.title.includes('비트코인 8조') && lv600.realityType === 'REAL', `Lv.600 iconic job: ${lv600.title}`);
assert(lv628.title.includes('코드 3줄') && lv628.realityType === 'REAL', `Lv.628 iconic job: ${lv628.title}`);
assert(lv999.title.includes('빅뱅 스위치') && lv999.realityType === 'FICTION', `Lv.999 iconic job: ${lv999.title}`);
assert(lv1000.title.includes('오메가 포인트') && lv1000.realityType === 'REAL', `Lv.1000 iconic job: ${lv1000.title}`);

// 6.1 Strict Space Rule: NO space/cosmic keywords before Lv.950!
const FORBIDDEN_SPACE_KEYWORDS = ['우주', '은하', '행성', '화성', '목성', '토성', '달 남극', '달 뒷면', '소행성', '외계', '성간', '안드로메다', '궤도', '워프', '다이슨 스피어', '콜로니'];
const spaceViolationsBefore950 = [];

for (let i = 0; i < 950; i++) {
  const j = MASTER_JOBS[i];
  for (const kw of FORBIDDEN_SPACE_KEYWORDS) {
    if (j.title.includes(kw) || j.specialDuty.includes(kw) || j.aiVerdict.includes(kw)) {
      spaceViolationsBefore950.push({ level: j.level, title: j.title, keyword: kw });
    }
  }
}

assert(spaceViolationsBefore950.length === 0, `ZERO space keywords in Lv.0 ~ 949 (violations: ${spaceViolationsBefore950.length})`);

// 6.2 Tier 20 Space & Multiverse Theme Audit
const tier20Items = MASTER_JOBS.slice(950);
const COSMIC_KEYWORDS = [...FORBIDDEN_SPACE_KEYWORDS, '빅뱅', '다중우주', '시공간'];
let tier20CosmicCount = 0;
for (const j of tier20Items) {
  if (COSMIC_KEYWORDS.some(kw => j.title.includes(kw) || j.specialDuty.includes(kw))) {
    tier20CosmicCount++;
  }
}
assert(tier20CosmicCount >= 50, `Tier 20 (Lv.950..1000) is cosmic/space/multiverse themed (count: ${tier20CosmicCount}/51)`);

// 7. Taxonomy SVG rendering
const svg0 = renderJobArtworkSvg(lv0);
const svg250 = renderJobArtworkSvg(lv250);
const svg1000 = renderJobArtworkSvg(lv1000);
assert(svg0.includes('<svg') && svg0.includes('LV. 00000 / 01000') && svg0.includes('폭망 직업'), 'Lv.0 SVG renders properly');
assert(svg250.includes('<svg') && svg250.includes('박대기') && svg250.includes('LV. 00250 / 01000'), 'Lv.250 SVG renders properly');
assert(svg1000.includes('<svg') && svg1000.includes('LV. 01000 / 01000') && svg1000.includes('대박 직업'), 'Lv.1000 SVG renders properly');

const dataUri = getJobArtworkSvgDataUri(lv250);
assert(dataUri.startsWith('data:image/svg+xml;base64,'), 'getJobArtworkSvgDataUri returns valid base64 data URI');

// 8. Chunks validation (20 chunks in data/chunks/)
let chunkErrors = 0;
for (let c = 0; c < 20; c++) {
  const pad = String(c).padStart(2, '0');
  const jobChunk = path.join(ROOT_DIR, 'data', 'chunks', `jobs-chunk-${pad}.json`);
  const houseChunk = path.join(ROOT_DIR, 'data', 'chunks', `houses-chunk-${pad}.json`);

  if (!fs.existsSync(jobChunk) || !fs.existsSync(houseChunk)) {
    chunkErrors++;
    continue;
  }

  const items = JSON.parse(fs.readFileSync(jobChunk, 'utf8'));
  const expectedCount = (c === 19) ? 51 : 50;
  if (items.length !== expectedCount) {
    chunkErrors++;
  }
}
assert(chunkErrors === 0, `All 20 chunk files exist and have exact item counts (chunk 19 has 51 items)`);

// 9. Prompt txt files validation (images/00000.txt .. images/01000.txt)
let txtErrors = 0;
for (let lv = 0; lv <= 1000; lv++) {
  const padded = path.join(ROOT_DIR, 'images', `${String(lv).padStart(5, '0')}.txt`);
  if (!fs.existsSync(padded)) {
    txtErrors++;
  }
}
assert(txtErrors === 0, `All 1,001 prompt txt files exist in images/ (00000.txt .. 01000.txt)`);

// Check that NO unpadded files exist (e.g. 0.txt, 1.txt, 1.png) to prevent duplicate image generation
const imagesDir = path.join(ROOT_DIR, 'images');
const imagesEntries = fs.readdirSync(imagesDir);
const txtFiles = imagesEntries.filter(f => f.endsWith('.txt'));
const unpaddedFiles = imagesEntries.filter(f => /^\d{1,4}\.(txt|png)$/.test(f));

assert(txtFiles.length === 1001, `images/ has exactly 1001 .txt files (got ${txtFiles.length})`);
assert(unpaddedFiles.length === 0, `images/ has 0 unpadded files to prevent double generation (got ${unpaddedFiles.length}: ${unpaddedFiles.slice(0, 5).join(', ')})`);

const manifestPath = path.join(ROOT_DIR, 'images', 'manifest.json');
assert(fs.existsSync(manifestPath), 'images/manifest.json exists');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(Object.keys(manifest).length === 1001, `manifest.json contains 1001 entries (got ${Object.keys(manifest).length})`);
}

// 10. Batch scripts verification
const repoBat = path.join(ROOT_DIR, 'Gemini_jobs_이미지자동생성.bat');
const desktopBat = 'C:\\Users\\USER\\Desktop\\Gemini_jobs_이미지자동생성.bat';
assert(fs.existsSync(repoBat), 'Gemini_jobs_이미지자동생성.bat exists in repo root');
assert(fs.existsSync(desktopBat), 'Gemini_jobs_이미지자동생성.bat exists on Desktop');

// 11. auto_generator.py verification
const pyScript = path.join(ROOT_DIR, 'auto_generator.py');
assert(fs.existsSync(pyScript), 'auto_generator.py exists in repo root');

console.log('===============================================================');
console.log(` [VERIFICATION SUMMARY] PASS: ${passCount} | FAIL: ${failCount}`);
if (failCount === 0) {
  console.log('🎉 ALL FEATURE #2 AUDIT TESTS PASSED WITH 100% SUCCESS!');
} else {
  console.error(`❌ Found ${failCount} issues to fix.`);
  process.exit(1);
}
console.log('===============================================================');
