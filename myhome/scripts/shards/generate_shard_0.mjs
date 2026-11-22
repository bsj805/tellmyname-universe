// scripts/shards/generate_shard_0.mjs — Shard 0 Artwork & Multimodal Appraisal Pipeline (Lv. 0 ~ 1999)
// Tiers 1 & 2, Chunks 00 & 01 | Feature #3 (Gemini 3.8 Flash)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CHUNKS_DIR = path.join(DATA_DIR, 'chunks');
const STAGING_DIR = path.join(DATA_DIR, 'r2_staging', 'shard_0');

const SHARD_ID = 0;
const START_LEVEL = 0;
const END_LEVEL = 1999;
const TOTAL_LEVELS = END_LEVEL - START_LEVEL + 1; // 2,000

// 20 Showcase Key Levels spanning Tier 1 (0..999) and Tier 2 (1000..1999)
export const SHOWCASE_LEVELS = [
  0, 1, 2, 3, 4, 5,
  42, 309, 500, 777, 999,
  1000, 1001, 1111, 1200, 1201,
  1500, 1554, 1800, 1999
];

/**
 * Enriches a chunk array with r2Key, imageUrl, ogImageUrl, and aiModel
 */
function enrichChunkItems(items) {
  return items.map(item => {
    const padded = String(item.level).padStart(5, '0');
    return {
      ...item,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    };
  });
}

/**
 * Main execution function
 */
export async function runShard0() {
  const isFull = process.argv.includes('--full');
  console.log(`=== [Shard 0 Pipeline: Levels ${START_LEVEL}..${END_LEVEL} (Model: ${GEMINI_MODEL_ID})] ===`);
  console.log(`Mode: ${isFull ? 'FULL (2,000 artworks)' : `SHOWCASE (${SHOWCASE_LEVELS.length} artworks)`}`);

  // 1. Ensure output directories exist
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich houses-chunk-00.json (Levels 0..999, Tier 1)
  const chunk00Path = path.join(CHUNKS_DIR, 'houses-chunk-00.json');
  if (fs.existsSync(chunk00Path)) {
    console.log(`Enriching chunk 00: ${chunk00Path}`);
    const chunk00Raw = JSON.parse(fs.readFileSync(chunk00Path, 'utf-8'));
    const enriched00 = enrichChunkItems(chunk00Raw);
    fs.writeFileSync(chunk00Path, JSON.stringify(enriched00, null, 2), 'utf-8');
    console.log(`  ✔ Chunk 00 enriched: ${enriched00.length} items (Lv. 0..999)`);
  } else {
    console.warn(`  ⚠ Warning: Chunk 00 not found at ${chunk00Path}`);
  }

  // 3. Enrich houses-chunk-01.json (Levels 1000..1999, Tier 2)
  const chunk01Path = path.join(CHUNKS_DIR, 'houses-chunk-01.json');
  if (fs.existsSync(chunk01Path)) {
    console.log(`Enriching chunk 01: ${chunk01Path}`);
    const chunk01Raw = JSON.parse(fs.readFileSync(chunk01Path, 'utf-8'));
    const enriched01 = enrichChunkItems(chunk01Raw);
    fs.writeFileSync(chunk01Path, JSON.stringify(enriched01, null, 2), 'utf-8');
    console.log(`  ✔ Chunk 01 enriched: ${enriched01.length} items (Lv. 1000..1999)`);
  } else {
    console.warn(`  ⚠ Warning: Chunk 01 not found at ${chunk01Path}`);
  }

  // 4. Render Artwork SVGs
  const levelsToRender = isFull
    ? Array.from({ length: TOTAL_LEVELS }, (_, i) => START_LEVEL + i)
    : SHOWCASE_LEVELS;

  console.log(`Rendering ${levelsToRender.length} artwork SVG files to ${STAGING_DIR}...`);
  const renderedFiles = [];

  for (const level of levelsToRender) {
    const concept = getHouseConceptByLevel(level);
    const svgContent = renderHouseArtworkSvg(concept);
    const padded = String(level).padStart(5, '0');
    const filename = `houses_${padded}.svg`;
    const filePath = path.join(STAGING_DIR, filename);

    fs.writeFileSync(filePath, svgContent, 'utf-8');
    renderedFiles.push({
      level,
      tier: concept.tier,
      title: concept.title,
      category: concept.category,
      realityType: concept.realityType,
      filename,
      r2Key: `houses/${padded}.webp`,
      sizeBytes: Buffer.byteLength(svgContent, 'utf-8')
    });
  }

  console.log(`  ✔ Successfully rendered ${renderedFiles.length} artwork SVGs.`);

  // 5. Generate and write manifest.json
  const manifest = {
    shardId: SHARD_ID,
    shardName: 'shard_0',
    levelRange: {
      start: START_LEVEL,
      end: END_LEVEL,
      total: TOTAL_LEVELS
    },
    tiers: [1, 2],
    chunks: ['houses-chunk-00.json', 'houses-chunk-01.json'],
    aiModel: GEMINI_MODEL_ID,
    generatedAt: new Date().toISOString(),
    isFullRun: isFull,
    showcaseLevels: SHOWCASE_LEVELS,
    artworkCount: renderedFiles.length,
    renderedFiles: renderedFiles.map(f => f.filename),
    sampleArtworks: renderedFiles.slice(0, 5)
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`  ✔ Manifest written to: ${manifestPath}`);

  console.log(`=== [Shard 0 Pipeline Complete: ${renderedFiles.length} artworks generated, 2 chunks enriched] ===`);
  return { manifest, renderedCount: renderedFiles.length };
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runShard0().catch(err => {
    console.error('Fatal error in Shard 0 pipeline:', err);
    process.exit(1);
  });
}
