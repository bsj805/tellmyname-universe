// scripts/shards/generate_shard_6.mjs — Shard 6 Artwork & Multimodal Appraisal Pipeline (Lv. 12000 ~ 13999)
// Tiers 13 & 14, Chunks 12 & 13 | Feature #3 (Gemini 3.8 Flash)

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
const STAGING_DIR = path.join(DATA_DIR, 'r2_staging', 'shard_6');

const SHARD_ID = 6;
const START_LEVEL = 12000;
const END_LEVEL = 13999;
const TOTAL_LEVELS = END_LEVEL - START_LEVEL + 1; // 2,000

// 20 Showcase Key Levels spanning Tier 13 (12000..12999) and Tier 14 (13000..13999)
export const SHOWCASE_LEVELS = [
  12000, 12001, 12100, 12200, 12400,
  12401, 12600, 12800, 12900, 12999,
  13000, 13001, 13131, 13200, 13400,
  13401, 13500, 13700, 13800, 13999
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
export async function runShard6() {
  const isFull = process.argv.includes('--full');
  console.log(`=== [Shard 6 Pipeline: Levels ${START_LEVEL}..${END_LEVEL} (Model: ${GEMINI_MODEL_ID})] ===`);
  console.log(`Mode: ${isFull ? 'FULL (2,000 artworks)' : `SHOWCASE (${SHOWCASE_LEVELS.length} artworks)`}`);

  // 1. Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich houses-chunk-12.json (Levels 12000..12999, Tier 13)
  const chunk12Path = path.join(CHUNKS_DIR, 'houses-chunk-12.json');
  if (fs.existsSync(chunk12Path)) {
    console.log(`Enriching chunk 12: ${chunk12Path}`);
    const chunk12Raw = JSON.parse(fs.readFileSync(chunk12Path, 'utf-8'));
    const enriched12 = enrichChunkItems(chunk12Raw);
    fs.writeFileSync(chunk12Path, JSON.stringify(enriched12, null, 2), 'utf-8');
    console.log(`  ✔ Chunk 12 enriched: ${enriched12.length} items (Lv. 12000..12999)`);
  } else {
    console.warn(`  ⚠ Warning: Chunk 12 not found at ${chunk12Path}`);
  }

  // 3. Enrich houses-chunk-13.json (Levels 13000..13999, Tier 14)
  const chunk13Path = path.join(CHUNKS_DIR, 'houses-chunk-13.json');
  if (fs.existsSync(chunk13Path)) {
    console.log(`Enriching chunk 13: ${chunk13Path}`);
    const chunk13Raw = JSON.parse(fs.readFileSync(chunk13Path, 'utf-8'));
    const enriched13 = enrichChunkItems(chunk13Raw);
    fs.writeFileSync(chunk13Path, JSON.stringify(enriched13, null, 2), 'utf-8');
    console.log(`  ✔ Chunk 13 enriched: ${enriched13.length} items (Lv. 13000..13999)`);
  } else {
    console.warn(`  ⚠ Warning: Chunk 13 not found at ${chunk13Path}`);
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
    shardName: 'shard_6',
    levelRange: {
      start: START_LEVEL,
      end: END_LEVEL,
      total: TOTAL_LEVELS
    },
    tiers: [13, 14],
    chunks: ['houses-chunk-12.json', 'houses-chunk-13.json'],
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

  console.log(`=== [Shard 6 Pipeline Complete: ${renderedFiles.length} artworks generated, 2 chunks enriched] ===`);
  return { manifest, renderedCount: renderedFiles.length };
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runShard6().catch(err => {
    console.error('Fatal error in Shard 6 pipeline:', err);
    process.exit(1);
  });
}
