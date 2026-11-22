// scripts/shards/generate_shard_4.mjs
// Shard 4: Levels 8000 .. 9999 (Tiers 9 & 10, Chunks 08 & 09)
// Feature #3: Gemini 3.8 Flash Artwork & Multimodal Appraisal Pipeline

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const SHARD_ID = 4;
export const START_LEVEL = 8000;
export const END_LEVEL = 9999;
export const TOTAL_LEVELS = END_LEVEL - START_LEVEL + 1; // 2000 levels

export const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
export const CHUNK_08_FILE = path.join(CHUNKS_DIR, 'houses-chunk-08.json');
export const CHUNK_09_FILE = path.join(CHUNKS_DIR, 'houses-chunk-09.json');

export const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging', 'shard_4');
export const MANIFEST_FILE = path.join(STAGING_DIR, 'manifest.json');

// Exactly 20 showcase artwork levels covering key real/fiction items in Tiers 9 & 10
export const SHOWCASE_LEVELS = [
  8000, 8001, 8200, 8384, 8400, 8401, 8600, 8800, 8879, 8999,
  9000, 9001, 9025, 9200, 9400, 9401, 9685, 9800, 9998, 9999
];

/**
 * Enriches a chunk file with r2Key, imageUrl, ogImageUrl, and aiModel
 */
export function enrichChunkFile(filePath, startLv, endLv) {
  let existingItems = [];
  if (fs.existsSync(filePath)) {
    try {
      existingItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      existingItems = [];
    }
  }

  const existingMap = new Map(existingItems.map(item => [item.level, item]));
  const enriched = [];

  for (let lv = startLv; lv <= endLv; lv++) {
    const base = existingMap.get(lv) || getHouseConceptByLevel(lv);
    const padded = String(lv).padStart(5, '0');
    enriched.push({
      ...base,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    });
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2), 'utf-8');
  return enriched;
}

/**
 * Runs Shard 4 processing: chunk enrichment and showcase/full SVG artwork rendering
 */
export async function runShard4(options = {}) {
  const isFull = options.full || process.argv.includes('--full');
  console.log(`=== [Shard 4] Levels ${START_LEVEL} .. ${END_LEVEL} (Tiers 9 & 10) ===`);
  console.log(`Mode: ${isFull ? 'FULL (2,000 artworks)' : 'SHOWCASE (20 artworks)'}`);
  console.log(`AI Model: ${GEMINI_MODEL_ID}`);

  // 1. Enrich Chunk 08 (8000 .. 8999) and Chunk 09 (9000 .. 9999)
  console.log('\n[1/3] Enriching chunk files...');
  const chunk08 = enrichChunkFile(CHUNK_08_FILE, 8000, 8999);
  console.log(`  ✔ Chunk 08 enriched: ${chunk08.length} items (Lv. 8000 ~ 8999)`);

  const chunk09 = enrichChunkFile(CHUNK_09_FILE, 9000, 9999);
  console.log(`  ✔ Chunk 09 enriched: ${chunk09.length} items (Lv. 9000 ~ 9999)`);

  // 2. Prepare staging directory
  console.log('\n[2/3] Preparing R2 staging directory...');
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const targetLevels = isFull
    ? Array.from({ length: TOTAL_LEVELS }, (_, i) => START_LEVEL + i)
    : SHOWCASE_LEVELS;

  console.log(`Generating ${targetLevels.length} artwork SVG files in ${STAGING_DIR}...`);

  const generatedFiles = [];
  for (const lv of targetLevels) {
    const padded = String(lv).padStart(5, '0');
    const concept = getHouseConceptByLevel(lv);
    const svgContent = renderHouseArtworkSvg(concept);
    const fileName = `houses_${padded}.svg`;
    const destPath = path.join(STAGING_DIR, fileName);

    fs.writeFileSync(destPath, svgContent, 'utf-8');
    generatedFiles.push({
      level: lv,
      tier: concept.tier,
      realityType: concept.realityType,
      fileName,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      title: concept.title,
      aiModel: GEMINI_MODEL_ID
    });
  }
  console.log(`  ✔ Created ${generatedFiles.length} SVG artwork files`);

  // 3. Write manifest.json
  console.log('\n[3/3] Writing manifest.json...');
  const manifest = {
    shard: SHARD_ID,
    shardName: 'shard_4',
    levelRange: {
      start: START_LEVEL,
      end: END_LEVEL,
      total: TOTAL_LEVELS
    },
    tiers: [9, 10],
    chunks: [
      'data/chunks/houses-chunk-08.json',
      'data/chunks/houses-chunk-09.json'
    ],
    aiModel: GEMINI_MODEL_ID,
    mode: isFull ? 'full' : 'showcase',
    generatedCount: generatedFiles.length,
    generatedAt: new Date().toISOString(),
    artworks: generatedFiles
  };

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`  ✔ Manifest written to ${MANIFEST_FILE}`);
  console.log('\n=== [Shard 4] Complete ===\n');

  return { chunk08, chunk09, manifest };
}

// Direct execution
const currentPath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === currentPath) {
  runShard4().catch(err => {
    console.error('Shard 4 generation failed:', err);
    process.exit(1);
  });
}
