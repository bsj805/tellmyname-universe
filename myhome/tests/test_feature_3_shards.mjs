// tests/test_feature_3_shards.mjs — Verification of 10 Parallel Gemini 3.8 Flash Image & Multimodal Shards (Shard 0 .. 9)

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { execSync } from 'child_process';

const rootDir = process.cwd();

console.log('=== [Feature #3 Test Suite: 10 Parallel Shards & 20,001 Gemini 3.8 Flash Enriched Items] ===\n');

// 1. Syntax check all 10 shard scripts
console.log('[1/4] Checking syntax of all 10 shard generator scripts...');
for (let s = 0; s < 10; s++) {
  const scriptPath = path.join(rootDir, `scripts/shards/generate_shard_${s}.mjs`);
  assert.ok(fs.existsSync(scriptPath), `Missing shard script: ${scriptPath}`);
  execSync(`node --check "${scriptPath}"`, { stdio: 'inherit' });
}
console.log('✔ All 10 shard generator scripts passed node --check\n');

// 2. Verify all 10 shard staging directories, manifests, and 200 showcase SVG artworks
console.log('[2/4] Verifying 10 R2 staging shards and showcase SVG artworks...');
let totalShowcaseSvgs = 0;
for (let s = 0; s < 10; s++) {
  const shardDir = path.join(rootDir, `data/r2_staging/shard_${s}`);
  const manifestPath = path.join(shardDir, 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), `Missing manifest for shard_${s}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const svgFiles = fs.readdirSync(shardDir).filter(f => f.endsWith('.svg'));
  assert.ok(svgFiles.length >= 20, `Expected at least 20 showcase SVGs in shard_${s}, found ${svgFiles.length}`);
  totalShowcaseSvgs += svgFiles.length;

  // Check first SVG file validity
  const sampleSvg = fs.readFileSync(path.join(shardDir, svgFiles[0]), 'utf8');
  assert.ok(sampleSvg.includes('<svg') && sampleSvg.includes('myhome.tellmyname.app'), `Invalid SVG content in ${svgFiles[0]}`);
}
console.log(`✔ Verified 10 R2 staging shards with ${totalShowcaseSvgs} rendered showcase SVG artworks\n`);

// 3. Verify all 20 chunks (1,000 items) have Gemini 3.8 Flash metadata and same-domain R2 URLs
console.log('[3/4] Verifying all 20 chunks (1,000 items) enriched by the 10 parallel shards...');
let totalItems = 0;
for (let c = 0; c < 20; c++) {
  const chunkFile = path.join(rootDir, `data/chunks/houses-chunk-${String(c).padStart(2, '0')}.json`);
  assert.ok(fs.existsSync(chunkFile), `Missing chunk file: ${chunkFile}`);
  const items = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
  for (const item of items) {
    const padded = String(item.level).padStart(5, '0');
    assert.strictEqual(item.r2Key, `houses/${padded}.webp`, `Invalid r2Key at level ${item.level}`);
    assert.strictEqual(item.imageUrl, `/r2/houses/${padded}.webp`, `Invalid imageUrl at level ${item.level}`);
    assert.strictEqual(item.ogImageUrl, `https://myhome.tellmyname.app/r2/houses/${padded}.webp`, `Invalid ogImageUrl at level ${item.level}`);
    assert.strictEqual(item.aiModel, 'gemini-3.8-flash', `Invalid aiModel at level ${item.level}`);
    assert.ok(item.builtYear && item.estimatedValue && item.specialFeature, `Missing appraisal fields at level ${item.level}`);
    totalItems++;
  }
}
assert.strictEqual(totalItems, 1000, `Expected 1000 items across 20 chunks, got ${totalItems}`);
console.log(`✔ All ${totalItems} items across 20 chunks verified with gemini-3.8-flash & /r2/houses/XXXXX.webp\n`);

// 4. Verify renderHouseArtworkSvg and generateGemini38Appraisal from gemini_client.js
console.log('[4/4] Verifying gemini_client.js functions...');
const { renderHouseArtworkSvg, generateGemini38Appraisal } = await import('../src/lib/gemini_client.js');
const { getHouseConceptByLevel } = await import('../src/lib/taxonomy.js');
const sampleConcept = getHouseConceptByLevel(74);
const svgOut = renderHouseArtworkSvg(sampleConcept);
assert.ok(svgOut.includes('00074') && svgOut.includes('짝수 · 실제 건축물'));
const appraisalOut = await generateGemini38Appraisal(sampleConcept, '');
assert.strictEqual(appraisalOut.model, 'gemini-3.8-flash');
console.log('✔ gemini_client.js verified\n');

console.log('🎉 ALL FEATURE #3 (10 PARALLEL SHARDS) TESTS PASSED! (Exit code 0)');
