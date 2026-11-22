// scripts/shards/generate_shard_7.mjs
// Shard 7 Agent: Levels 14000 .. 15999 (Tiers 15 & 16, Chunks 14 & 15)
// Pipeline for Gemini 3.8 Flash artwork & multimodal appraisal metadata synthesis

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const SHARD_ID = 7;
const MIN_LEVEL = 14000;
const MAX_LEVEL = 15999;
const TIERS = [15, 16];
const CHUNK_FILES = ['houses-chunk-14.json', 'houses-chunk-15.json'];

const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging', `shard_${SHARD_ID}`);
const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');

// Key showcase levels across Shard 7 (Tiers 15 & 16)
const SHOWCASE_LEVELS = [
  14000, 14001, 14100, 14250, 14400,
  14401, 14500, 14750, 14800, 14999,
  15000, 15001, 15200, 15394, 15400,
  15401, 15555, 15777, 15800, 15999
];

async function main() {
  const isFull = process.argv.includes('--full');
  console.log(`=== [Shard ${SHARD_ID} Generation: Levels ${MIN_LEVEL} .. ${MAX_LEVEL}] ===`);
  console.log(`Model: ${GEMINI_MODEL_ID} | Mode: ${isFull ? 'FULL (2000 items)' : 'SHOWCASE (20 items)'}`);

  // 1. Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich chunk 14 (14000..14999) and chunk 15 (15000..15999)
  console.log('\n--- Enriching Chunk Files ---');
  for (const chunkFile of CHUNK_FILES) {
    const chunkPath = path.join(CHUNKS_DIR, chunkFile);
    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Chunk file not found: ${chunkPath}`);
    }

    const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
    let enrichedCount = 0;

    for (const item of chunkData) {
      if (item.level < MIN_LEVEL || item.level > MAX_LEVEL) {
        continue;
      }
      const paddedLevel = String(item.level).padStart(5, '0');
      item.r2Key = `houses/${paddedLevel}.webp`;
      item.imageUrl = `/r2/houses/${paddedLevel}.webp`;
      item.ogImageUrl = `https://myhome.tellmyname.app/r2/houses/${paddedLevel}.webp`;
      item.aiModel = GEMINI_MODEL_ID;
      enrichedCount++;
    }

    fs.writeFileSync(chunkPath, JSON.stringify(chunkData, null, 2) + '\n', 'utf-8');
    console.log(`✔ Enriched ${enrichedCount} items in ${chunkFile}`);
  }

  // 3. Determine target levels for artwork generation
  let targetLevels;
  if (isFull) {
    targetLevels = [];
    for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
      targetLevels.push(lv);
    }
  } else {
    targetLevels = [...SHOWCASE_LEVELS];
  }

  console.log(`\n--- Generating Artworks (${targetLevels.length} files) ---`);
  const manifestArtworks = [];

  for (const level of targetLevels) {
    const concept = getHouseConceptByLevel(level);
    const paddedLevel = String(level).padStart(5, '0');
    const svgFilename = `houses_${paddedLevel}.svg`;
    const svgPath = path.join(STAGING_DIR, svgFilename);

    const svgContent = renderHouseArtworkSvg(concept);
    fs.writeFileSync(svgPath, svgContent, 'utf-8');

    manifestArtworks.push({
      level,
      paddedLevel,
      filename: svgFilename,
      r2Key: `houses/${paddedLevel}.webp`,
      title: concept.title,
      tier: concept.tier,
      tierName: concept.tierName,
      zone: concept.zone,
      realityType: concept.realityType,
      category: concept.category,
      categoryLabel: concept.categoryLabel,
      aiModel: GEMINI_MODEL_ID
    });
  }
  console.log(`✔ Generated ${manifestArtworks.length} SVG artworks in ${STAGING_DIR}`);

  // 4. Write manifest.json
  const manifest = {
    shard: SHARD_ID,
    shardName: `shard_${SHARD_ID}`,
    levelRange: {
      min: MIN_LEVEL,
      max: MAX_LEVEL,
      total: MAX_LEVEL - MIN_LEVEL + 1
    },
    tiers: TIERS,
    chunks: CHUNK_FILES,
    aiModel: GEMINI_MODEL_ID,
    generatedAt: new Date().toISOString(),
    mode: isFull ? 'full' : 'showcase',
    artworkCount: manifestArtworks.length,
    showcaseLevels: isFull ? SHOWCASE_LEVELS : targetLevels,
    artworks: manifestArtworks
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(`✔ Manifest written to ${manifestPath}`);
  console.log(`=== Shard ${SHARD_ID} Generation Complete ===\n`);
}

main().catch(err => {
  console.error(`Error in Shard ${SHARD_ID} generation:`, err);
  process.exit(1);
});
