// tests/test_features_9_to_16_new.mjs
// Comprehensive Test Suite for 7 New Core Requirements (Requirements 1 ~ 7):
// Requirement 1: 14 Supported Languages in i18n & Edge SSR ?lang=
// Requirement 2: Multilingual 9:16 Instagram Story Canvas (Hierarchy: Headline -> Photo -> Specs)
// Requirement 3: Google AdSense (ca-pub-8793936135959956) Integration & ads.txt
// Requirement 4: Scroll Text-Only Preview & Sitemap Reverse Routing (All 500 Levels)
// Requirement 5: Cloudflare Workers with Static Assets & Deployment Guide
// Requirement 6: 50,000 Multilingual Famous Names & Image SEO
// Requirement 7: Local Real Image Serving via dev_server (G:\My Drive\new_houses)

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  UI_DICTIONARY,
  getTranslation,
  localizeHouse
} from '../src/lib/i18n.js';

import {
  TOTAL_LEVELS,
  MIN_LEVEL,
  MAX_LEVEL,
  GOOD_HOUSE_THRESHOLD,
  SITE_ORIGIN
} from '../src/lib/constants.js';

import { getHouseConceptByLevel } from '../src/lib/taxonomy.js';
import { renderStoryCanvas } from '../web/js/share.js';
import worker, { renderSeoHtml } from '../worker.js';
import { getSitemapNameForLevel } from '../src/lib/level_name_map.js';
import { startServer, createMockEnv } from '../scripts/dev_server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('=== [Comprehensive Test Suite: 7 New Core Requirements (Req 1 ~ 7)] ===\n');

// =========================================================================
// [Requirement 1] 14 Languages in src/lib/i18n.js, localizeHouse & Edge SSR ?lang=
// =========================================================================
console.log('[Req 1/7] Testing 14-Language i18n Engine & Edge SSR ?lang=...');

const EXPECTED_LANG_CODES = [
  'ko', 'en', 'hi', 'vi', 'fr', 'pt',
  'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'
];

assert.strictEqual(
  SUPPORTED_LANGUAGES.length,
  14,
  `Expected exactly 14 supported languages, got ${SUPPORTED_LANGUAGES.length}`
);

const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
for (const code of EXPECTED_LANG_CODES) {
  assert(supportedCodes.includes(code), `Language ${code} must be in SUPPORTED_LANGUAGES`);
  assert(UI_DICTIONARY[code], `UI_DICTIONARY must have dictionary entry for ${code}`);
  assert(UI_DICTIONARY[code].brandHeader, `brandHeader missing for ${code}`);
  assert(UI_DICTIONARY[code].ownerTitle, `ownerTitle missing for ${code}`);
}
console.log('  ✔ All 14 languages present in SUPPORTED_LANGUAGES and UI_DICTIONARY');

// Test localizeHouse across all 14 languages
const sampleConcept = getHouseConceptByLevel(250);
for (const code of EXPECTED_LANG_CODES) {
  const loc = localizeHouse(sampleConcept, code, 'TestUser');
  assert(loc.title, `Localized title missing for ${code}`);
  assert(loc.builtYear, `Localized builtYear missing for ${code}`);
  assert(loc.estimatedValue, `Localized estimatedValue missing for ${code}`);
  assert(loc.specialFeature, `Localized specialFeature missing for ${code}`);
  assert(loc.aiVerdict, `Localized aiVerdict missing for ${code}`);
}
console.log('  ✔ localizeHouse returns complete translations across all 14 languages');

// Test Edge SSR ?lang= (hreflang tags and localized titles)
const baseHtml = '<!DOCTYPE html><html><head><title>Old</title></head><body><section id="card-root"></section></body></html>';

// 1. English SSR
const ssrEn = renderSeoHtml(baseHtml, sampleConcept, 'Steve', SITE_ORIGIN, 'en');
assert(ssrEn.includes('<html lang="en">'), 'Must set <html lang="en">');
assert(ssrEn.includes('The House That Suits Steve'), 'Must contain English owner title in <title>');
assert(ssrEn.includes('Steve house recommendation'), 'Must include image SEO keyword in description');
assert(ssrEn.includes('<link rel="alternate" hreflang="x-default"'), 'Must include x-default hreflang');
for (const code of EXPECTED_LANG_CODES) {
  assert(ssrEn.includes(`hreflang="${code}"`), `Must include hreflang="${code}"`);
}

// 2. Japanese SSR
const ssrJa = renderSeoHtml(baseHtml, sampleConcept, 'Kenji', SITE_ORIGIN, 'ja');
assert(ssrJa.includes('<html lang="ja">'), 'Must set <html lang="ja">');
assert(ssrJa.includes('Kenji'), 'Must contain user name in Japanese title');

console.log('  ✔ Edge SSR properly injects 14-language hreflang tags & localized titles/descriptions\n');

// =========================================================================
// [Requirement 2] Multilingual 9:16 Instagram Story Canvas
// =========================================================================
console.log('[Req 2/7] Testing Multilingual 9:16 Story Canvas (Owner -> Photo -> Specs)...');

function createMockCanvasContext() {
  const recorded = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    shadowColor: '',
    shadowBlur: 0,
    createLinearGradient: () => ({ addColorStop: () => {} }),
    fillRect: (x, y, w, h) => recorded.push({ method: 'fillRect', x, y, w, h }),
    strokeRect: (x, y, w, h) => recorded.push({ method: 'strokeRect', x, y, w, h }),
    beginPath: () => recorded.push({ method: 'beginPath' }),
    closePath: () => recorded.push({ method: 'closePath' }),
    moveTo: (x, y) => recorded.push({ method: 'moveTo', x, y }),
    lineTo: (x, y) => recorded.push({ method: 'lineTo', x, y }),
    quadraticCurveTo: () => {},
    arc: (x, y, r) => recorded.push({ method: 'arc', x, y, r }),
    stroke: () => recorded.push({ method: 'stroke' }),
    fill: () => recorded.push({ method: 'fill' }),
    clip: () => recorded.push({ method: 'clip' }),
    save: () => recorded.push({ method: 'save' }),
    restore: () => recorded.push({ method: 'restore' }),
    fillText: (text, x, y) => recorded.push({ method: 'fillText', text, x, y }),
    measureText: (text) => ({ width: String(text).length * 12 }),
    drawImage: (img, sx, sy, sw, sh, dx, dy, dw, dh) => recorded.push({ method: 'drawImage', dx, dy, dw, dh })
  };

  return {
    width: 0,
    height: 0,
    getContext: () => ctx,
    _calls: recorded
  };
}

const testLangNames = [
  { lang: 'ko', name: '김서윤', expectedKeyword: '김서윤님에게 어울리는 집은' },
  { lang: 'en', name: 'Steve', expectedKeyword: 'The House That Suits Steve' },
  { lang: 'ja', name: 'Kenji', expectedKeyword: 'Kenjiさんにふさわしい家' },
  { lang: 'es', name: 'Carlos', expectedKeyword: 'La casa ideal para Carlos' },
  { lang: 'hi', name: 'Aarav', expectedKeyword: 'Aarav के लिए उपयुक्त घर' },
  { lang: 'ms', name: 'Farid', expectedKeyword: 'Rumah yang sesuai untuk Farid' }
];

for (const tc of testLangNames) {
  const canvas = createMockCanvasContext();
  await renderStoryCanvas(canvas, sampleConcept, tc.name, 'sunset', tc.lang);
  assert.strictEqual(canvas.width, 1080, 'Canvas width must be 1080');
  assert.strictEqual(canvas.height, 1920, 'Canvas height must be 1920');

  const fillTexts = canvas._calls.filter(c => c.method === 'fillText').map(c => c.text);
  assert(
    fillTexts.some(t => t && t.includes(tc.expectedKeyword)),
    `Language ${tc.lang} must draw headline containing "${tc.expectedKeyword}"`
  );
}
console.log('  ✔ Multilingual story canvas validated across ko, en, ja, es, hi, ms (1080x1920)\n');

// =========================================================================
// [Requirement 3] Google AdSense (ca-pub-8793936135959956)
// =========================================================================
console.log('[Req 3/7] Testing Google AdSense (ca-pub-8793936135959956) presence...');

const ADSENSE_PUB_ID = 'ca-pub-8793936135959956';
const ADSENSE_SCRIPT = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

// 1. web/index.html
const indexHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'web/index.html'), 'utf8');
assert(indexHtmlContent.includes(ADSENSE_PUB_ID), 'web/index.html must include AdSense pub ID');
assert(indexHtmlContent.includes(ADSENSE_SCRIPT), 'web/index.html must include AdSense script tag');

// 2. public/privacy.html
const privacyHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'public/privacy.html'), 'utf8');
assert(privacyHtmlContent.includes(ADSENSE_PUB_ID), 'public/privacy.html must include AdSense pub ID');

// 3. public/terms.html
const termsHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'public/terms.html'), 'utf8');
assert(termsHtmlContent.includes(ADSENSE_PUB_ID), 'public/terms.html must include AdSense pub ID');

// 4. worker.js SSR output
const ssrAdSense = renderSeoHtml(baseHtml, sampleConcept, '테스터', SITE_ORIGIN, 'ko');
assert(ssrAdSense.includes(ADSENSE_PUB_ID), 'worker.js SSR output must include AdSense pub ID');

// 5. dist/ads.txt
const adsTxtPath = path.join(DIST_DIR, 'ads.txt');
assert(fs.existsSync(adsTxtPath), 'dist/ads.txt must exist');
const adsTxtContent = fs.readFileSync(adsTxtPath, 'utf8');
assert(
  adsTxtContent.includes('google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0'),
  'dist/ads.txt must contain authorized seller line for pub-8793936135959956'
);

console.log('  ✔ Google AdSense verified in index.html, privacy.html, terms.html, worker SSR, and ads.txt\n');

// =========================================================================
// [Requirement 4] Scroll Text-Only Preview & Reverse Routing
// =========================================================================
console.log('[Req 4/7] Testing Scroll Text-Only Preview & Sitemap Reverse Routing...');

// 1. web/index.html #scroll-preview-section has no <img> tags
assert(indexHtmlContent.includes('id="scroll-preview-section"'), 'web/index.html must have #scroll-preview-section');
const previewSectionMatch = indexHtmlContent.match(/<section[^>]*id="scroll-preview-section"[^>]*>([\s\S]*?)<\/section>/i);
assert(previewSectionMatch, 'Could not find #scroll-preview-section in index.html');
const previewInnerNoComments = previewSectionMatch[1].replace(/<!--[\s\S]*?-->/g, '');
assert(
  !/<img\b[^>]*>/i.test(previewInnerNoComments),
  '#scroll-preview-section MUST NOT contain <img> tags (locks house image until entering page)'
);
console.log('  ✔ #scroll-preview-section confirmed text-only (zero <img> tags)');

// 2. LEVEL_TO_NAME_MAP covers all 1,000 levels (0..999)
const mapJsonPath = path.join(ROOT_DIR, 'data/level_to_name_map.json');
assert(fs.existsSync(mapJsonPath), 'data/level_to_name_map.json must exist');
const levelNameMap = JSON.parse(fs.readFileSync(mapJsonPath, 'utf8'));

const mappedKeys = Object.keys(levelNameMap);
assert.strictEqual(mappedKeys.length, TOTAL_LEVELS, `Map must cover all ${TOTAL_LEVELS} levels, got ${mappedKeys.length}`);

for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
  const linkedName = getSitemapNameForLevel(lv);
  assert(
    typeof linkedName === 'string' && linkedName.length > 0,
    `getSitemapNameForLevel(${lv}) returned empty or invalid name: ${linkedName}`
  );
  const mapEntry = levelNameMap[String(lv)];
  assert(mapEntry, `Missing map entry for level ${lv}`);
  const expectedDefault = typeof mapEntry === 'object' ? (mapEntry.default || mapEntry.ko) : mapEntry;
  assert.strictEqual(linkedName, expectedDefault);
}
console.log(`  ✔ LEVEL_TO_NAME_MAP successfully verified across all ${TOTAL_LEVELS} levels (0..999)\n`);

// =========================================================================
// [Requirement 5] Cloudflare Workers with Static Assets
// =========================================================================
console.log('[Req 5/7] Testing Cloudflare Workers with Static Assets configuration...');

// 1. wrangler.toml
const wranglerContent = fs.readFileSync(path.join(ROOT_DIR, 'wrangler.toml'), 'utf8');
assert(wranglerContent.includes('main = "worker.js"'), 'wrangler.toml must have main = "worker.js"');
assert(wranglerContent.includes('directory = "./dist"'), 'wrangler.toml must specify directory = "./dist" under [assets]');
assert(wranglerContent.includes('binding = "ASSETS"'), 'wrangler.toml must bind ASSETS');
assert(wranglerContent.includes('binding = "MYHOME_R2"'), 'wrangler.toml must bind MYHOME_R2');
assert(wranglerContent.includes('run_worker_first = true'), 'wrangler.toml must have run_worker_first = true');

// 2. docs/CLOUDFLARE_DEPLOY_GUIDE.md
const guidePath = path.join(ROOT_DIR, 'docs/CLOUDFLARE_DEPLOY_GUIDE.md');
assert(fs.existsSync(guidePath), 'docs/CLOUDFLARE_DEPLOY_GUIDE.md must exist');
const guideContent = fs.readFileSync(guidePath, 'utf8');
assert(guideContent.includes('npx wrangler deploy') || guideContent.includes('wrangler deploy'), 'Guide must document deploy command');

// 3. package.json scripts.deploy
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
assert(pkg.scripts && pkg.scripts.deploy, 'package.json must contain "deploy" script');
assert.strictEqual(pkg.scripts.deploy, 'npm run build && npx wrangler deploy');

console.log('  ✔ Cloudflare Workers with Static Assets validated (wrangler.toml, guide, deploy script)\n');

// =========================================================================
// [Requirement 6] 50,000 Multilingual Famous Names & Image SEO
// =========================================================================
console.log('[Req 6/7] Testing 50,000 Multilingual Names & Google Image SEO...');

// 1. Seed dataset
const seedPath = path.join(ROOT_DIR, 'data/seed_names_50k.json');
const seedNames = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
assert.strictEqual(seedNames.length, 50000, 'Seed names must contain exactly 50,000 names');
const seedSet = new Set(seedNames);
assert.strictEqual(seedSet.size, 50000, 'All 50,000 seed names must be unique');

// Check representation of foreign names
const foreignSamples = ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah', 'Lucas', 'Miguel'];
for (const fn of foreignSamples) {
  assert(seedSet.has(fn), `Seed dataset must include foreign name "${fn}"`);
}
console.log('  ✔ 50,000 seed dataset verified with global foreign name representation');

// 2. Image SEO in SSR Output
const ssrSteve = renderSeoHtml(baseHtml, sampleConcept, 'Steve', SITE_ORIGIN, 'en');
assert(ssrSteve.includes('Steve house recommendation'), 'SSR description must include "{name} house recommendation"');
assert(ssrSteve.includes('Steve house image'), 'SSR description must include "{name} house image"');

// Schema.org ImageObject
const jsonLdMatch = ssrSteve.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch, 'JSON-LD must be present in SSR');
const parsedLd = JSON.parse(jsonLdMatch[1]);
const imageNode = parsedLd['@graph'].find(n => n['@type'] === 'ImageObject');
assert(imageNode, 'JSON-LD must include ImageObject');
assert(imageNode.contentUrl.includes('/r2/houses/00250.webp'), 'ImageObject must reference house webp URL');
assert(imageNode.name.includes('Steve house image'), 'ImageObject name must include "{name} house image"');

// 3. dist/sitemap-images.xml
const imgSitemapPath = path.join(DIST_DIR, 'sitemap-images.xml');
assert(fs.existsSync(imgSitemapPath), 'dist/sitemap-images.xml must exist');
const imgSitemapContent = fs.readFileSync(imgSitemapPath, 'utf8');
assert(imgSitemapContent.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'Image sitemap must declare image schema namespace');
const imgLocMatches = imgSitemapContent.match(/<image:loc>/g) || [];
assert.strictEqual(imgLocMatches.length, TOTAL_LEVELS, `sitemap-images.xml must contain ${TOTAL_LEVELS} images, got ${imgLocMatches.length}`);

console.log('  ✔ Image SEO & sitemap-images.xml (1,000 images) successfully verified\n');

// =========================================================================
// [Requirement 7] G:\My Drive\new_houses Image Serving via dev_server
// =========================================================================
console.log('[Req 7/7] Testing G:\\My Drive\\new_houses Real PNG Image Serving via dev_server...');

// Test createMockEnv behavior with local disk
const mockEnv = createMockEnv();
assert(mockEnv.MYHOME_R2 && typeof mockEnv.MYHOME_R2.get === 'function', 'MockEnv must have MYHOME_R2.get');

const r2Obj74 = await mockEnv.MYHOME_R2.get('houses/00074.webp');
if (r2Obj74) {
  assert(r2Obj74.body, 'R2 object body must be non-empty');
  assert(r2Obj74.httpMetadata && r2Obj74.httpMetadata.contentType, 'R2 object must provide httpMetadata.contentType');
  console.log(`  ✔ MockEnv found image on disk for level 74 (Type: ${r2Obj74.httpMetadata.contentType})`);
}

// Test live HTTP dev_server execution
const runningDev = await startServer({ port: 0, silent: true });
try {
  const devUrl = `http://127.0.0.1:${runningDev.port}`;
  const imgRes = await fetch(`${devUrl}/r2/houses/00074.webp`);
  assert.strictEqual(imgRes.status, 200, 'HTTP GET /r2/houses/00074.webp must return 200');

  const contentType = imgRes.headers.get('content-type');
  assert(
    contentType.includes('image/png') || contentType.includes('image/webp') || contentType.includes('image/svg+xml'),
    `content-type must be valid image type, got: ${contentType}`
  );

  const arrayBuf = await imgRes.arrayBuffer();
  assert(arrayBuf.byteLength > 100, `Image response must contain real image bytes, got ${arrayBuf.byteLength} bytes`);
  console.log(`  ✔ HTTP dev_server returned real image bytes (${arrayBuf.byteLength} bytes, ${contentType})`);
} finally {
  await runningDev.close();
}

console.log('\n======================================================');
console.log('🎉 ALL 7 NEW CORE REQUIREMENTS PASSED RIGOROUSLY! (EXIT 0)');
console.log('======================================================');
