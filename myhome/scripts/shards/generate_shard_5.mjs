// scripts/shards/generate_shard_5.mjs — Shard 5 (Levels 10000..11999, Tiers 11 & 12, Chunks 10 & 11)
// Pipeline for Feature #3: Gemini 3.8 Flash artwork & multimodal appraisal pipeline

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const SHARD_ID = 5;
const MIN_LEVEL = 10000;
const MAX_LEVEL = 11999;
const CHUNK_10_PATH = path.join(ROOT_DIR, 'data', 'chunks', 'houses-chunk-10.json');
const CHUNK_11_PATH = path.join(ROOT_DIR, 'data', 'chunks', 'houses-chunk-11.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging', 'shard_5');

// 20 Showcase Key Levels (Tier 11: 10000..10999, Tier 12: 11000..11999)
export const SHOWCASE_LEVELS = [
  10000, 10001, 10100, 10250, 10400, 10401, 10555, 10701, 10800, 10999,
  11000, 11001, 11111, 11222, 11400, 11401, 11424, 11500, 11800, 11999
];

export async function generateShard5(options = {}) {
  const isFull = options.full || process.argv.includes('--full');
  console.log(`=== [Shard 5 Generator: Lv. ${MIN_LEVEL} .. ${MAX_LEVEL} (Tiers 11 & 12)] ===`);
  console.log(`Model: ${GEMINI_MODEL_ID}`);
  console.log(`Mode: ${isFull ? 'FULL (2,000 artworks)' : 'SHOWCASE (20 artworks)'}`);

  // 1. Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich houses-chunk-10.json (10000..10999)
  console.log(`Enriching chunk 10: ${CHUNK_10_PATH}...`);
  const rawChunk10 = fs.existsSync(CHUNK_10_PATH)
    ? JSON.parse(fs.readFileSync(CHUNK_10_PATH, 'utf-8'))
    : Array.from({ length: 1000 }, (_, i) => getHouseConceptByLevel(10000 + i));

  const enrichedChunk10 = rawChunk10.map(item => {
    const padded = String(item.level).padStart(5, '0');
    return {
      ...item,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    };
  });
  fs.writeFileSync(CHUNK_10_PATH, JSON.stringify(enrichedChunk10, null, 2), 'utf-8');
  console.log(`  ✔ Chunk 10 enriched (${enrichedChunk10.length} items, Lv. 10000..10999)`);

  // 3. Enrich houses-chunk-11.json (11000..11999)
  console.log(`Enriching chunk 11: ${CHUNK_11_PATH}...`);
  const rawChunk11 = fs.existsSync(CHUNK_11_PATH)
    ? JSON.parse(fs.readFileSync(CHUNK_11_PATH, 'utf-8'))
    : Array.from({ length: 1000 }, (_, i) => getHouseConceptByLevel(11000 + i));

  const enrichedChunk11 = rawChunk11.map(item => {
    const padded = String(item.level).padStart(5, '0');
    return {
      ...item,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      aiModel: GEMINI_MODEL_ID
    };
  });
  fs.writeFileSync(CHUNK_11_PATH, JSON.stringify(enrichedChunk11, null, 2), 'utf-8');
  console.log(`  ✔ Chunk 11 enriched (${enrichedChunk11.length} items, Lv. 11000..11999)`);

  // 4. Generate artwork files
  const targetLevels = isFull
    ? Array.from({ length: 2000 }, (_, i) => MIN_LEVEL + i)
    : SHOWCASE_LEVELS;

  console.log(`Generating ${targetLevels.length} artwork SVG files into ${STAGING_DIR}...`);
  const artworksManifest = [];

  for (const lv of targetLevels) {
    const concept = getHouseConceptByLevel(lv);
    const svg = renderHouseArtworkSvg(concept);
    const padded = String(lv).padStart(5, '0');
    const svgFileName = `houses_${padded}.svg`;
    const svgPath = path.join(STAGING_DIR, svgFileName);
    fs.writeFileSync(svgPath, svg, 'utf-8');

    artworksManifest.push({
      level: lv,
      svgFile: svgFileName,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      title: concept.title,
      tier: concept.tier,
      tierName: concept.tierName,
      zone: concept.zone,
      realityType: concept.realityType,
      category: concept.category,
      categoryLabel: concept.categoryLabel
    });
  }

  // 5. Write manifest.json
  const manifest = {
    shard: SHARD_ID,
    shardRange: `${MIN_LEVEL}..${MAX_LEVEL}`,
    minLevel: MIN_LEVEL,
    maxLevel: MAX_LEVEL,
    totalLevels: 2000,
    tiers: [11, 12],
    chunks: ['houses-chunk-10.json', 'houses-chunk-11.json'],
    aiModel: GEMINI_MODEL_ID,
    generatedAt: new Date().toISOString(),
    isFull,
    showcaseCount: targetLevels.length,
    showcaseLevels: targetLevels,
    artworks: artworksManifest
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`  ✔ manifest.json written (${artworksManifest.length} items)`);
  console.log(`=== [Shard 5 Completed Successfully] ===`);
}

// Run directly when executed from CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  generateShard5().catch(err => {
    console.error('Shard 5 generation failed:', err);
    process.exit(1);
  });
}
