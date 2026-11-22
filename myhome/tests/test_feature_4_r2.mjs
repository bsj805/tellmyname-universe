// tests/test_feature_4_r2.mjs
// Feature #4 Test Suite: Cloudflare R2 Object Storage & Metadata Serving Architecture (500 Levels)
// Validates:
// 1. Syntax check on src/lib/r2_storage.js & scripts/upload_r2_images.mjs
// 2. parseLevelFromR2Path path resolution & boundary conditions (0..499)
// 3. getR2ObjectKey naming specification (houses/XXXXX.webp)
// 4. getChunkIndexForLevel and 20-chunk metadata division (25 items per chunk)
// 5. serveR2HouseImage (R2 bucket cache hit vs Dynamic Edge SVG artwork renderer fallback)
// 6. scripts/upload_r2_images.mjs CLI staging & dry-run execution manifest

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { MIN_LEVEL, MAX_LEVEL } from '../src/lib/constants.js';
import {
  R2_BUCKET_NAME,
  R2_CACHE_CONTROL,
  parseLevelFromR2Path,
  getR2ObjectKey,
  getChunkIndexForLevel,
  getChunkFilename,
  serveR2HouseImage,
  createR2ImageResponse
} from '../src/lib/r2_storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
const SUMMARY_FILE = path.join(ROOT_DIR, 'data', 'r2_upload_summary.json');

console.log('=== [Feature #4 Test Suite: Cloudflare R2 Storage & Ultra-light Chunk Serving (500 Levels)] ===');

// 1. Syntax checks (node --check)
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check src/lib/r2_storage.js', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check scripts/upload_r2_images.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax checks passed cleanly');

// 2. R2 Configuration Constants
console.log('\n[2/6] Verifying R2 storage configuration constants...');
assert.strictEqual(R2_BUCKET_NAME, 'myhome-houses-r2', 'R2_BUCKET_NAME must be "myhome-houses-r2"');
assert.strictEqual(
  R2_CACHE_CONTROL,
  'public, max-age=31536000, immutable',
  'R2_CACHE_CONTROL must specify 1-year immutable caching'
);
console.log(`✔ Bucket: ${R2_BUCKET_NAME}`);
console.log(`✔ Cache-Control: ${R2_CACHE_CONTROL}`);

// 3. parseLevelFromR2Path & getR2ObjectKey
console.log('\n[3/6] Testing parseLevelFromR2Path and getR2ObjectKey...');
const pathTestCases = [
  { input: '/r2/houses/00074.webp', expected: 74 },
  { input: '/r2/houses/74.svg', expected: 74 },
  { input: '/r2/houses/00000.webp', expected: 0 },
  { input: '/r2/houses/00250.webp', expected: 250 },
  { input: '/r2/houses/00499.webp', expected: 499 },
  { input: '/r2/houses/00500.webp', expected: 500 },
  { input: '/r2/houses/00999.webp', expected: 999 },
  { input: 'r2/houses/00123.webp', expected: 123 },
  { input: 'https://myhome.tellmyname.app/r2/houses/00074.webp', expected: 74 },
  { input: '/r2/houses/01000.webp', expected: null }, // Out of range (> 999)
  { input: '/r2/houses/-1.webp', expected: null },     // Negative
  { input: '/r2/houses/abc.webp', expected: null },    // Non-numeric
  { input: '/api/v1/houses/00074.webp', expected: null },
  { input: '', expected: null },
  { input: null, expected: null },
  { input: undefined, expected: null }
];

for (const tc of pathTestCases) {
  const result = parseLevelFromR2Path(tc.input);
  assert.strictEqual(
    result,
    tc.expected,
    `parseLevelFromR2Path("${tc.input}") expected ${tc.expected}, got ${result}`
  );
}

// Object Key verification
assert.strictEqual(getR2ObjectKey(0), 'houses/00000.webp');
assert.strictEqual(getR2ObjectKey(7), 'houses/00007.webp');
assert.strictEqual(getR2ObjectKey(42), 'houses/00042.webp');
assert.strictEqual(getR2ObjectKey(250), 'houses/00250.webp');
assert.strictEqual(getR2ObjectKey(500), 'houses/00500.webp');
assert.strictEqual(getR2ObjectKey(999), 'houses/00999.webp');
console.log('✔ parseLevelFromR2Path & getR2ObjectKey validated across test cases');

// 4. getChunkIndexForLevel & getChunkFilename (50 items per chunk)
console.log('\n[4/6] Testing chunk index calculation & 20-chunk file mapping...');
const chunkTestCases = [
  { level: 0, expectedIdx: 0, expectedFile: 'houses-chunk-00.json' },
  { level: 49, expectedIdx: 0, expectedFile: 'houses-chunk-00.json' },
  { level: 50, expectedIdx: 1, expectedFile: 'houses-chunk-01.json' },
  { level: 99, expectedIdx: 1, expectedFile: 'houses-chunk-01.json' },
  { level: 100, expectedIdx: 2, expectedFile: 'houses-chunk-02.json' },
  { level: 250, expectedIdx: 5, expectedFile: 'houses-chunk-05.json' },
  { level: 499, expectedIdx: 9, expectedFile: 'houses-chunk-09.json' },
  { level: 500, expectedIdx: 10, expectedFile: 'houses-chunk-10.json' },
  { level: 949, expectedIdx: 18, expectedFile: 'houses-chunk-18.json' },
  { level: 950, expectedIdx: 19, expectedFile: 'houses-chunk-19.json' },
  { level: 999, expectedIdx: 19, expectedFile: 'houses-chunk-19.json' }
];

for (const tc of chunkTestCases) {
  const idx = getChunkIndexForLevel(tc.level);
  const file = getChunkFilename(tc.level);
  assert.strictEqual(idx, tc.expectedIdx, `Chunk index mismatch for level ${tc.level}`);
  assert.strictEqual(file, tc.expectedFile, `Chunk filename mismatch for level ${tc.level}`);
}

// Verify that all 20 chunk files exist on disk in data/chunks/ and contain 50 items each
assert(fs.existsSync(CHUNKS_DIR), 'data/chunks directory must exist');
for (let c = 0; c < 20; c++) {
  const chunkFileName = `houses-chunk-${String(c).padStart(2, '0')}.json`;
  const chunkPath = path.join(CHUNKS_DIR, chunkFileName);
  assert(fs.existsSync(chunkPath), `Chunk file ${chunkFileName} must exist on disk`);
  const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
  assert(Array.isArray(chunkData), `Chunk file ${chunkFileName} must contain a JSON array`);
  const expectedCount = 50;
  assert.strictEqual(
    chunkData.length,
    expectedCount,
    `Chunk ${c} item count mismatch: expected ${expectedCount}, got ${chunkData.length}`
  );
}
console.log('✔ All 20 metadata chunk files (00..19) verified on disk (total 1000 items, 50 each)');

// 5. serveR2HouseImage (Mock R2 Hit vs EDGE_RENDERER Fallback)
console.log('\n[5/6] Testing serveR2HouseImage serving logic...');

// Test 5A: R2 Bucket Cache Hit
const requestedR2Keys = [];
const mockR2Env = {
  MYHOME_R2: {
    get: async (key) => {
      requestedR2Keys.push(key);
      return {
        body: 'MOCK_R2_WEBP_STREAM',
        httpMetadata: {
          contentType: 'image/webp'
        }
      };
    }
  }
};

const hitResult = await serveR2HouseImage(74, mockR2Env);
assert.strictEqual(requestedR2Keys.length, 1);
assert.strictEqual(requestedR2Keys[0], 'houses/00074.webp');
assert.strictEqual(hitResult.source, 'R2_BUCKET', 'Hit result must be from R2_BUCKET');
assert.strictEqual(hitResult.contentType, 'image/webp');
assert.strictEqual(hitResult.headers['Cache-Control'], R2_CACHE_CONTROL);
assert.strictEqual(hitResult.headers['Access-Control-Allow-Origin'], '*');
assert.strictEqual(hitResult.body, 'MOCK_R2_WEBP_STREAM');
console.log('✔ [5A] R2_BUCKET hit serving verified');

// Test 5B: R2 Bucket Miss -> Dynamic Edge SVG Fallback
const mockR2MissEnv = {
  MYHOME_R2: {
    get: async () => null // Object not in R2
  }
};

const missResult = await serveR2HouseImage(74, mockR2MissEnv);
assert.strictEqual(missResult.source, 'EDGE_RENDERER', 'Miss result must fallback to EDGE_RENDERER');
assert.strictEqual(missResult.contentType, 'image/svg+xml; charset=utf-8');
assert.strictEqual(missResult.headers['Cache-Control'], R2_CACHE_CONTROL);
assert.strictEqual(missResult.headers['Access-Control-Allow-Origin'], '*');
assert(typeof missResult.body === 'string', 'SVG body must be a string');
assert(missResult.body.includes('<svg'), 'SVG body must contain <svg');
assert(missResult.body.endsWith('</svg>'), 'SVG body must end with </svg>');
console.log('✔ [5B] EDGE_RENDERER dynamic fallback verified for R2 miss');

// Test 5C: No env supplied -> Immediate Dynamic Edge SVG
const noEnvResult = await serveR2HouseImage(0);
assert.strictEqual(noEnvResult.source, 'EDGE_RENDERER');
assert(noEnvResult.body.includes('<svg'));
console.log('✔ [5C] EDGE_RENDERER fallback verified when env is absent (level 0)');

// Test 5D: Peak level 999 Edge SVG
const peakResult = await serveR2HouseImage(999);
assert.strictEqual(peakResult.source, 'EDGE_RENDERER');
assert(peakResult.body.includes('<svg'));
console.log('✔ [5D] EDGE_RENDERER fallback verified for Level 999 (Tier 20)');

// Test 5E: Web Response helper (createR2ImageResponse)
const responseObj = createR2ImageResponse(missResult);
assert(responseObj instanceof Response, 'createR2ImageResponse must return a Web standard Response');
assert.strictEqual(responseObj.headers.get('Content-Type'), 'image/svg+xml; charset=utf-8');
assert.strictEqual(responseObj.headers.get('Cache-Control'), R2_CACHE_CONTROL);
assert.strictEqual(responseObj.headers.get('X-Image-Source'), 'EDGE_RENDERER');
console.log('✔ [5E] Web Response creation helper verified');

// 6. scripts/upload_r2_images.mjs CLI & Manifest
console.log('\n[6/6] Testing scripts/upload_r2_images.mjs CLI staging and dry-run...');

// Execute dry-run with default staging
execSync('node scripts/upload_r2_images.mjs --dry-run', { cwd: ROOT_DIR, stdio: 'inherit' });

assert(fs.existsSync(SUMMARY_FILE), 'data/r2_upload_summary.json must exist');
const summary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf-8'));

assert.strictEqual(summary.bucket, 'myhome-houses-r2', 'Summary bucket mismatch');
assert.strictEqual(summary.dryRun, true, 'Summary dryRun must be true');
assert(summary.totalObjects > 0, 'totalObjects must be > 0');
assert(Array.isArray(summary.sampleCommands), 'sampleCommands must be an array');
assert(summary.sampleCommands.length > 0, 'sampleCommands must contain entries');

const firstCmd = summary.sampleCommands[0];
assert(
  firstCmd.startsWith('wrangler r2 object put myhome-houses-r2/houses/'),
  `Command does not match expected wrangler syntax: ${firstCmd}`
);
assert(
  firstCmd.includes('--content-type="image/'),
  `Command must specify --content-type: ${firstCmd}`
);
console.log('✔ Default dry-run manifest validated');

// Execute dry-run with custom range (--start=100 --end=120)
console.log('\nTesting custom range staging (--start=100 --end=120)...');
execSync('node scripts/upload_r2_images.mjs --start=100 --end=120 --dry-run', { cwd: ROOT_DIR, stdio: 'inherit' });
const rangeSummary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf-8'));
assert.strictEqual(rangeSummary.startLevel, 100);
assert.strictEqual(rangeSummary.endLevel, 120);
assert.strictEqual(rangeSummary.totalObjects, 21);
console.log('✔ Custom range staging and manifest verified');

console.log('\n================================================================');
console.log('🎉 ALL FEATURE #4 CLOUDFLARE R2 & CHUNK SERVING TESTS PASSED! 🎉');
console.log('================================================================');
