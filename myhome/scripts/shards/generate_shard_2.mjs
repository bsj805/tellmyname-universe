// scripts/shards/generate_shard_2.mjs — Shard 2 Image Generation & Chunk Enrichment (Levels 4000..5999, Tiers 5 & 6)
// Gemini 3.8 Flash Multimodal & Artwork Pipeline

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const SHARD_ID = 2;
const START_LEVEL = 4000;
const END_LEVEL = 5999;
const TIERS = [5, 6];
const CHUNK_FILES = [
  { index: 4, file: 'houses-chunk-04.json', start: 4000, end: 4999 },
  { index: 5, file: 'houses-chunk-05.json', start: 5000, end: 5999 }
];

const SHOWCASE_LEVELS = [
  4000, 4001, 4200, 4400, 4401, 4478, 4600, 4800, 4936, 4999,
  5000, 5001, 5200, 5400, 5401, 5555, 5700, 5800, 5900, 5999
];

const DATA_DIR = path.join(ROOT_DIR, 'data');
const CHUNKS_DIR = path.join(DATA_DIR, 'chunks');
const STAGING_DIR = path.join(DATA_DIR, 'r2_staging', `shard_${SHARD_ID}`);

async function main() {
  console.log(`=== [Shard ${SHARD_ID} — Image Generation & Chunk Enrichment (Lv.${START_LEVEL}..${END_LEVEL})] ===`);
  const isFull = process.argv.includes('--full');
  console.log(`Model: ${GEMINI_MODEL_ID} | Mode: ${isFull ? 'FULL (2000 items)' : `SHOWCASE (${SHOWCASE_LEVELS.length} items)`}`);

  // Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 1. Enrich data/chunks/houses-chunk-04.json and houses-chunk-05.json
  console.log('\n--- 1. Enriching Chunks 04 and 05 ---');
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
      chunkData = [];
      for (let lv = chunkInfo.start; lv <= chunkInfo.end; lv++) {
        chunkData.push(getHouseConceptByLevel(lv));
      }
    }

    // Enrich each item in the chunk
    for (const item of chunkData) {
      const padded = String(item.level).padStart(5, '0');
      item.r2Key = `houses/${padded}.webp`;
      item.imageUrl = `/r2/houses/${padded}.webp`;
      item.ogImageUrl = `https://myhome.tellmyname.app/r2/houses/${padded}.webp`;
      item.aiModel = GEMINI_MODEL_ID;
    }

    fs.writeFileSync(chunkPath, JSON.stringify(chunkData, null, 2), 'utf-8');
    console.log(`✔ Enriched ${chunkInfo.file} (${chunkData.length} items: Lv.${chunkData[0].level}..${chunkData[chunkData.length - 1].level})`);
  }

  // 2. Generate Artwork files
  console.log('\n--- 2. Generating Artwork Files ---');
  const targetLevels = isFull
    ? Array.from({ length: END_LEVEL - START_LEVEL + 1 }, (_, i) => START_LEVEL + i)
    : SHOWCASE_LEVELS;

  const manifestFiles = [];

  for (const lv of targetLevels) {
    const concept = getHouseConceptByLevel(lv);
    const padded = String(lv).padStart(5, '0');
    const svgFileName = `houses_${padded}.svg`;
    const svgFilePath = path.join(STAGING_DIR, svgFileName);

    const svgContent = renderHouseArtworkSvg(concept);
    fs.writeFileSync(svgFilePath, svgContent, 'utf-8');

    manifestFiles.push({
      level: lv,
      filename: svgFileName,
      r2Key: `houses/${padded}.webp`,
      title: concept.title,
      tier: concept.tier,
      tierName: concept.tierName,
      category: concept.category,
      categoryLabel: concept.categoryLabel,
      realityType: concept.realityType,
      zone: concept.zone,
      estimatedValue: concept.estimatedValue,
      fileSize: Buffer.byteLength(svgContent, 'utf-8')
    });
  }

  console.log(`✔ Generated ${manifestFiles.length} SVG artwork files in ${STAGING_DIR}`);

  // 3. Write manifest.json
  console.log('\n--- 3. Writing Shard Manifest ---');
  const manifest = {
    shard: SHARD_ID,
    range: {
      start: START_LEVEL,
      end: END_LEVEL,
      totalLevels: END_LEVEL - START_LEVEL + 1
    },
    tiers: TIERS,
    chunks: CHUNK_FILES.map(c => c.file),
    aiModel: GEMINI_MODEL_ID,
    mode: isFull ? 'full' : 'showcase',
    generatedAt: new Date().toISOString(),
    filesCount: manifestFiles.length,
    showcaseLevels: SHOWCASE_LEVELS,
    files: manifestFiles
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✔ Manifest written to ${manifestPath}`);
  console.log(`\n=== Shard ${SHARD_ID} complete! ===\n`);
}

main().catch(err => {
  console.error('Fatal error in generate_shard_2:', err);
  process.exit(1);
});
