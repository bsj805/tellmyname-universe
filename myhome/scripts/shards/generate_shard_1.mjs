// scripts/shards/generate_shard_1.mjs — Shard 1 Image Generation & Metadata Pipeline
// Levels 2000 .. 3999 (Tiers 3 & 4, Chunks 02 & 03)
// Gemini 3.8 Flash Multimodal & Artwork Pipeline for MyHome (myhome.tellmyname.app)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const SHARD_ID = 1;
export const START_LEVEL = 2000;
export const END_LEVEL = 3999;
export const TOTAL_LEVELS = END_LEVEL - START_LEVEL + 1; // 2,000

export const CHUNK_02_PATH = path.join(ROOT_DIR, 'data', 'chunks', 'houses-chunk-02.json');
export const CHUNK_03_PATH = path.join(ROOT_DIR, 'data', 'chunks', 'houses-chunk-03.json');
export const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging', 'shard_1');

// 20 representative showcase levels across Tier 3 & Tier 4
export const SHOWCASE_LEVELS = [
  2000, 2001, 2200, 2201, 2400, 2401, 2600, 2601, 2800, 2801,
  2999, 3000, 3001, 3200, 3203, 3400, 3401, 3600, 3800, 3999
];

/**
 * Executes Shard 1 generation pipeline:
 * 1. Enriches chunk 02 (2000..2999) & chunk 03 (3000..3999) with r2Key, imageUrl, ogImageUrl, aiModel
 * 2. Generates SVG artworks into data/r2_staging/shard_1/ (20 showcase files or all 2000 if --full)
 * 3. Writes data/r2_staging/shard_1/manifest.json
 */
export async function generateShard1(options = {}) {
  const isFull = options.full ?? process.argv.includes('--full');

  console.log('====================================================');
  console.log(`[Shard 1] Gemini 3.8 Flash Artwork & Dataset Pipeline`);
  console.log(`Levels: ${START_LEVEL} .. ${END_LEVEL} (Tiers 3 & 4)`);
  console.log(`Model: ${GEMINI_MODEL_ID}`);
  console.log(`Mode: ${isFull ? 'FULL (All 2,000 levels)' : `SHOWCASE (${SHOWCASE_LEVELS.length} key levels)`}`);
  console.log('====================================================');

  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // --- Step 1: Enrich houses-chunk-02.json (Lv. 2000 .. 2999) ---
  console.log(`\n[1/3] Enriching chunk 02: ${CHUNK_02_PATH}...`);
  let chunk02 = [];
  if (fs.existsSync(CHUNK_02_PATH)) {
    try {
      chunk02 = JSON.parse(fs.readFileSync(CHUNK_02_PATH, 'utf-8'));
    } catch (e) {
      console.warn('  Warning: Could not parse existing chunk-02, regenerating from taxonomy.');
    }
  }

  const enrichedChunk02 = [];
  for (let lv = 2000; lv <= 2999; lv++) {
    const existing = chunk02.find(item => item.level === lv);
    const base = existing || getHouseConceptByLevel(lv);
    const padded = String(lv).padStart(5, '0');
    enrichedChunk02.push({
      ...base,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    });
  }
  fs.writeFileSync(CHUNK_02_PATH, JSON.stringify(enrichedChunk02, null, 2) + '\n', 'utf-8');
  console.log(`  ✔ Successfully enriched houses-chunk-02.json (${enrichedChunk02.length} items)`);

  // --- Step 2: Enrich houses-chunk-03.json (Lv. 3000 .. 3999) ---
  console.log(`\n[2/3] Enriching chunk 03: ${CHUNK_03_PATH}...`);
  let chunk03 = [];
  if (fs.existsSync(CHUNK_03_PATH)) {
    try {
      chunk03 = JSON.parse(fs.readFileSync(CHUNK_03_PATH, 'utf-8'));
    } catch (e) {
      console.warn('  Warning: Could not parse existing chunk-03, regenerating from taxonomy.');
    }
  }

  const enrichedChunk03 = [];
  for (let lv = 3000; lv <= 3999; lv++) {
    const existing = chunk03.find(item => item.level === lv);
    const base = existing || getHouseConceptByLevel(lv);
    const padded = String(lv).padStart(5, '0');
    enrichedChunk03.push({
      ...base,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    });
  }
  fs.writeFileSync(CHUNK_03_PATH, JSON.stringify(enrichedChunk03, null, 2) + '\n', 'utf-8');
  console.log(`  ✔ Successfully enriched houses-chunk-03.json (${enrichedChunk03.length} items)`);

  // --- Step 3: Render Artwork SVGs & Build Manifest ---
  const levelsToRender = isFull
    ? Array.from({ length: TOTAL_LEVELS }, (_, i) => START_LEVEL + i)
    : SHOWCASE_LEVELS;

  console.log(`\n[3/3] Generating ${levelsToRender.length} artwork SVGs in ${STAGING_DIR}...`);
  const manifestArtworks = [];

  for (const lv of levelsToRender) {
    const concept = getHouseConceptByLevel(lv);
    const padded = String(lv).padStart(5, '0');
    const fileName = `houses_${padded}.svg`;
    const svgPath = path.join(STAGING_DIR, fileName);

    const svgContent = renderHouseArtworkSvg(concept);
    fs.writeFileSync(svgPath, svgContent, 'utf-8');

    manifestArtworks.push({
      level: lv,
      paddedLevel: padded,
      fileName,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      title: concept.title,
      tier: concept.tier,
      tierName: concept.tierName,
      category: concept.category,
      categoryLabel: concept.categoryLabel,
      realityType: concept.realityType,
      zone: concept.zone,
      fileSizeBytes: Buffer.byteLength(svgContent, 'utf-8')
    });
  }

  const manifest = {
    shard: SHARD_ID,
    shardName: 'shard_1',
    levelRange: [START_LEVEL, END_LEVEL],
    totalShardLevels: TOTAL_LEVELS,
    tiers: [3, 4],
    chunks: [
      'data/chunks/houses-chunk-02.json',
      'data/chunks/houses-chunk-03.json'
    ],
    aiModel: GEMINI_MODEL_ID,
    isFull,
    artworksCount: manifestArtworks.length,
    showcaseLevels: SHOWCASE_LEVELS,
    generatedAt: new Date().toISOString(),
    artworks: manifestArtworks
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(`  ✔ Manifest written to ${manifestPath} (${manifestArtworks.length} items recorded)`);

  console.log('\n✔ Shard 1 Generation Pipeline Completed Successfully!\n');
  return manifest;
}

// CLI execution trigger
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === __filename.toLowerCase() ||
  process.argv[1].includes('generate_shard_1')
);

if (isDirectExecution) {
  generateShard1().catch(err => {
    console.error('Shard 1 execution failed with error:', err);
    process.exit(1);
  });
}
