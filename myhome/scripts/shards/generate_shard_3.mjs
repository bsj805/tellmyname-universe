// scripts/shards/generate_shard_3.mjs — Shard 3 Image Generation & Chunk Enrichment (Levels 6000..7999, Tiers 7 & 8)
// Feature #3 (Gemini 3.8 Flash Multimodal & Artwork Pipeline)

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
const STAGING_DIR = path.join(DATA_DIR, 'r2_staging', 'shard_3');

const SHARD_ID = 3;
const START_LEVEL = 6000;
const END_LEVEL = 7999;
const TOTAL_LEVELS = END_LEVEL - START_LEVEL + 1; // 2,000

export const SHOWCASE_LEVELS = [
  6000, 6001, 6200, 6400, 6401,
  6500, 6578, 6600, 6800, 6999,
  7000, 7001, 7200, 7400, 7401,
  7500, 7523, 7525, 7800, 7999
];

const CHUNK_FILES = [
  { index: 6, file: 'houses-chunk-06.json', start: 6000, end: 6999, tier: 7 },
  { index: 7, file: 'houses-chunk-07.json', start: 7000, end: 7999, tier: 8 }
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
 * Main execution function for Shard 3
 */
export async function runShard3() {
  const isFull = process.argv.includes('--full');
  console.log(`=== [Shard 3 Pipeline: Levels ${START_LEVEL}..${END_LEVEL} (Model: ${GEMINI_MODEL_ID})] ===`);
  console.log(`Mode: ${isFull ? 'FULL (2,000 artworks)' : `SHOWCASE (${SHOWCASE_LEVELS.length} artworks)`}`);

  // 1. Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich houses-chunk-06.json (Levels 6000..6999, Tier 7) and houses-chunk-07.json (Levels 7000..7999, Tier 8)
  console.log('\n--- 1. Enriching Chunks 06 and 07 ---');
  for (const chunkInfo of CHUNK_FILES) {
    const chunkPath = path.join(CHUNKS_DIR, chunkInfo.file);
    let chunkData;
    if (fs.existsSync(chunkPath)) {
      try {
        chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
      } catch (err) {
        console.warn(`Could not parse ${chunkInfo.file}, regenerating from taxonomy:`, err.message);
        chunkData = null;
      }
    }

    if (!Array.isArray(chunkData) || chunkData.length === 0) {
      console.log(`  Regenerating ${chunkInfo.file} from master taxonomy...`);
      chunkData = [];
      for (let lv = chunkInfo.start; lv <= chunkInfo.end; lv++) {
        chunkData.push(getHouseConceptByLevel(lv));
      }
    }

    const enriched = enrichChunkItems(chunkData);
    fs.writeFileSync(chunkPath, JSON.stringify(enriched, null, 2), 'utf-8');
    console.log(`  ✔ Chunk ${String(chunkInfo.index).padStart(2, '0')} enriched: ${enriched.length} items (Lv. ${chunkInfo.start}..${chunkInfo.end}, Tier ${chunkInfo.tier})`);
  }

  // 3. Render Artwork SVGs
  console.log('\n--- 2. Rendering Artwork SVGs ---');
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

  // 4. Generate and write manifest.json
  console.log('\n--- 3. Generating Shard 3 Manifest ---');
  const manifest = {
    shardId: SHARD_ID,
    shardName: 'shard_3',
    levelRange: {
      start: START_LEVEL,
      end: END_LEVEL,
      total: TOTAL_LEVELS
    },
    tiers: [7, 8],
    chunks: ['houses-chunk-06.json', 'houses-chunk-07.json'],
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

  console.log(`\n=== [Shard 3 Pipeline Complete: ${renderedFiles.length} artworks generated, 2 chunks enriched] ===`);
  return { manifest, renderedCount: renderedFiles.length };
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runShard3().catch(err => {
    console.error('Fatal error in Shard 3 pipeline:', err);
    process.exit(1);
  });
}
