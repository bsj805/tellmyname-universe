// tests/test_feature_7_ui.mjs
// Feature #7 Verification Test Suite: Frontend UI/UX, Name Search, Appraisal Card, and 3-Button Explorer Dock (500 Levels)

import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { analyzeNameToHouse, mapNameToHouseLevel } from '../src/lib/hash.js';
import { getHouseConceptByLevel } from '../src/lib/taxonomy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== [Feature #7 Test Suite: Frontend UI/UX & Explorer Dock (500 Levels)] ===');

// --------------------------------------------------------------------------
// 1. JavaScript Syntax Verification (node --check)
// --------------------------------------------------------------------------
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check web/js/app.js', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ node --check web/js/app.js passed cleanly');

// --------------------------------------------------------------------------
// 2. HTML Contract & Structure Verification (web/index.html)
// --------------------------------------------------------------------------
console.log('\n[2/6] Verifying web/index.html structure and contracts...');
const htmlPath = path.join(ROOT_DIR, 'web', 'index.html');
assert(fs.existsSync(htmlPath), 'web/index.html must exist');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// (a) Exact SSR Regex Match Contract: <section id="card-root"></section>
assert(
  htmlContent.includes('<section id="card-root"></section>'),
  'web/index.html must contain exact string <section id="card-root"></section> for worker.js SSR'
);

// (b) Explorer Dock Buttons
assert(htmlContent.includes('id="btn-prev-level"'), 'Must contain #btn-prev-level');
assert(htmlContent.includes('id="btn-random-level"'), 'Must contain #btn-random-level');
assert(htmlContent.includes('id="btn-next-level"'), 'Must contain #btn-next-level');

// (c) Search Bar, Return Banner, Scroll Preview, Language Select
assert(htmlContent.includes('id="name-input"'), 'Must contain #name-input');
assert(htmlContent.includes('id="search-btn"'), 'Must contain #search-btn');
assert(htmlContent.includes('id="return-my-house-bar"'), 'Must contain #return-my-house-bar');
assert(htmlContent.includes('id="sample-chips"'), 'Must contain #sample-chips');
assert(htmlContent.includes('id="scroll-preview-section"'), 'Must contain #scroll-preview-section');
assert(htmlContent.includes('id="lang-select"'), 'Must contain #lang-select');

// (d) Feature #8 Shared Interface
assert(htmlContent.includes('<link rel="stylesheet" href="/css/style.css" />'), 'Must link /css/style.css');
assert(htmlContent.includes('<link rel="stylesheet" href="/css/share.css" />'), 'Must link /css/share.css');
assert(htmlContent.includes('<div id="share-modal-root"></div>'), 'Must contain #share-modal-root');
assert(htmlContent.includes('<script type="module" src="/js/app.js"></script>'), 'Must load /js/app.js module');

// (e) Typography & Meta tags
assert(htmlContent.includes('Pretendard'), 'Must include Pretendard font');
assert(htmlContent.includes('Noto+Serif+KR'), 'Must include Noto Serif KR font');
assert(htmlContent.includes('naver-site-verification'), 'Must include naver-site-verification meta tag');
assert(htmlContent.includes('og:title'), 'Must include OpenGraph tags');
assert(htmlContent.includes('twitter:card'), 'Must include Twitter Card meta tags');

// (f) Sample Names
assert(htmlContent.includes('data-name="김서윤"'), 'Sample chips must include 김서윤');
assert(htmlContent.includes('data-name="이민준"'), 'Sample chips must include 이민준');
assert(htmlContent.includes('data-name="홍길동"'), 'Sample chips must include 홍길동');
assert(htmlContent.includes('data-name="박서윤"'), 'Sample chips must include 박서윤');
assert(htmlContent.includes('data-name="선우용녀"'), 'Sample chips must include 선우용녀');

console.log('✔ web/index.html structure verified successfully');

// --------------------------------------------------------------------------
// 3. CSS Stylesheet Verification (web/css/style.css)
// --------------------------------------------------------------------------
console.log('\n[3/6] Verifying web/css/style.css exists and has required rules...');
const cssPath = path.join(ROOT_DIR, 'web', 'css', 'style.css');
assert(fs.existsSync(cssPath), 'web/css/style.css must exist');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.length > 500, 'web/css/style.css must be non-empty and comprehensive');

// Key selectors and aura tokens
const requiredCssTokens = [
  '#card-root',
  '.appraisal-card',
  'zone-bad',
  'zone-good',
  'reality-real',
  'reality-fiction',
  '.appraisal-spec-grid',
  '.spec-built-year',
  '.spec-estimated-value',
  '.spec-special-feature',
  '.ai-verdict-section',
  '.official-watermark-stamp',
  '.return-my-house-bar',
  '.explorer-dock',
  '#btn-prev-level',
  '#btn-random-level',
  '#btn-next-level',
  '@media'
];

for (const token of requiredCssTokens) {
  assert(cssContent.includes(token), `web/css/style.css must include rule for "${token}"`);
}
console.log('✔ web/css/style.css verified with BAD/GOOD aura, spec boxes, and explorer dock');

// --------------------------------------------------------------------------
// 4. JS Module Content & Contract Verification (web/js/app.js)
// --------------------------------------------------------------------------
console.log('\n[4/6] Verifying web/js/app.js module imports and logic...');
const appJsPath = path.join(ROOT_DIR, 'web', 'js', 'app.js');
assert(fs.existsSync(appJsPath), 'web/js/app.js must exist');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Imports verification
assert(
  appJsContent.includes("import { analyzeNameToHouse } from './lib/hash.js'"),
  'Must import analyzeNameToHouse from ./lib/hash.js'
);
assert(
  appJsContent.includes("import { getHouseConceptByLevel } from './lib/taxonomy.js'"),
  'Must import getHouseConceptByLevel from ./lib/taxonomy.js'
);
assert(
  appJsContent.includes("import { openShareModal, copyShareUrl } from './share.js'"),
  'Must import openShareModal, copyShareUrl from ./share.js'
);

// Mandatory 3 Appraisal Specs check in JS code
assert(appJsContent.includes('builtYear'), 'app.js must handle builtYear (건축 연도)');
assert(appJsContent.includes('estimatedValue'), 'app.js must handle estimatedValue (추산 가치)');
assert(appJsContent.includes('specialFeature'), 'app.js must handle specialFeature (특별한 기능)');
assert(appJsContent.includes('aiVerdict'), 'app.js must handle aiVerdict (AI 감정평가사 총평)');

// Navigation and keyboard shortcuts check
assert(appJsContent.includes('ArrowLeft'), 'app.js must handle ArrowLeft keyboard shortcut');
assert(appJsContent.includes('ArrowRight'), 'app.js must handle ArrowRight keyboard shortcut');
assert(appJsContent.includes('Space'), 'app.js must handle Space keyboard shortcut');
assert(appJsContent.includes('preloadAdjacentImages'), 'app.js must preload adjacent level images');
assert(appJsContent.includes('new Image()'), 'app.js must use new Image() for preloading');

console.log('✔ web/js/app.js module structure verified');

// --------------------------------------------------------------------------
// 5. Hash & Taxonomy Integration Logic Verification (1,000 Levels)
// --------------------------------------------------------------------------
console.log('\n[5/6] Verifying sample name mappings and taxonomy generation for 1,000 levels...');
const testCases = [
  { name: '김서윤', expectedFullLevel: 512, expectedLevel: 512, expectedZone: 'GOOD', isReal: true },
  { name: '이민준', expectedFullLevel: 390, expectedLevel: 390, expectedZone: 'BAD', isReal: true },
  { name: '홍길동', expectedFullLevel: 540, expectedLevel: 540, expectedZone: 'GOOD', isReal: true },
  { name: '박서윤', expectedFullLevel: 343, expectedLevel: 343, expectedZone: 'BAD', isReal: false },
  { name: '선우용녀', expectedFullLevel: 66, expectedLevel: 66, expectedZone: 'BAD', isReal: true }
];

for (const tc of testCases) {
  const analyzed = analyzeNameToHouse(tc.name);
  assert.strictEqual(analyzed.fullLevel, tc.expectedFullLevel, `Full mapping level mismatch for ${tc.name}`);
  assert.strictEqual(analyzed.level, tc.expectedLevel, `Active mapping level mismatch for ${tc.name}`);
  assert.strictEqual(analyzed.zone, tc.expectedZone, `Zone mismatch for ${tc.name}`);
  assert.strictEqual(analyzed.realityType === 'REAL', tc.isReal, `Reality type mismatch for ${tc.name}`);

  // Taxonomy concept generation
  const concept = getHouseConceptByLevel(analyzed.level);
  assert(concept.title && concept.title.length > 0, `Title missing for Lv.${analyzed.level}`);
  assert(concept.builtYear && concept.builtYear.length > 0, `builtYear missing for Lv.${analyzed.level}`);
  assert(concept.estimatedValue && concept.estimatedValue.length > 0, `estimatedValue missing for Lv.${analyzed.level}`);
  assert(concept.specialFeature && concept.specialFeature.length > 0, `specialFeature missing for Lv.${analyzed.level}`);
  assert(concept.aiVerdict && concept.aiVerdict.length > 0, `aiVerdict missing for Lv.${analyzed.level}`);
  assert.strictEqual(concept.imageUrl, `/r2/houses/${String(analyzed.level).padStart(5, '0')}.webp`);

  console.log(`  ✔ [${tc.name}] -> Lv.${analyzed.level} [${analyzed.zone} / ${concept.realityLabel}]: ${concept.title}`);
}

// --------------------------------------------------------------------------
// 6. Navigation Boundary & Step Alternation Test (1,000 Levels: 0..999)
// --------------------------------------------------------------------------
console.log('\n[6/6] Verifying step alternation (Even=Real 50% vs Odd=Fiction 50%) & boundaries...');
const lv74 = getHouseConceptByLevel(74);
assert.strictEqual(lv74.realityType, 'REAL', '74 should be REAL');
const lv75 = getHouseConceptByLevel(75);
assert.strictEqual(lv75.realityType, 'FICTION', '75 should be FICTION');
const lv73 = getHouseConceptByLevel(73);
assert.strictEqual(lv73.realityType, 'FICTION', '73 should be FICTION');

// Extreme boundary check
const lv0 = getHouseConceptByLevel(0);
assert.strictEqual(lv0.level, 0);
assert.strictEqual(lv0.zone, 'BAD');
assert.strictEqual(lv0.realityType, 'REAL');

const lv999 = getHouseConceptByLevel(999);
assert.strictEqual(lv999.level, 999);
assert.strictEqual(lv999.zone, 'GOOD');
assert.strictEqual(lv999.realityType, 'FICTION');

console.log('✔ Step alternation and boundaries verified (Lv.0 and Lv.999)');

console.log('\n======================================================');
console.log('🎉 ALL FEATURE #7 TESTS PASSED SUCCESSFULLY! (EXIT 0)');
console.log('======================================================');
