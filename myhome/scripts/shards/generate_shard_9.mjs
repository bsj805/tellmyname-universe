// scripts/shards/generate_shard_9.mjs — Image Generation Shard 9 (Levels 18000..20000, Tiers 19 & 20)
// Feature #3: Gemini 3.8 Flash Multimodal Artwork & Appraisal Pipeline
// myhome.tellmyname.app

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { getHouseConceptByLevel } from '../../src/lib/taxonomy.js';
import { renderHouseArtworkSvg, GEMINI_MODEL_ID } from '../../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

export const SHARD_ID = 'shard_9';
export const MIN_SHARD_LEVEL = 18000;
export const MAX_SHARD_LEVEL = 20000;
export const TOTAL_SHARD_LEVELS = MAX_SHARD_LEVEL - MIN_SHARD_LEVEL + 1; // 2001

export const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging', 'shard_9');
export const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
export const CHUNK_18_PATH = path.join(CHUNKS_DIR, 'houses-chunk-18.json');
export const CHUNK_19_PATH = path.join(CHUNKS_DIR, 'houses-chunk-19.json');

// Exactly 20 showcase levels covering key milestones across Tier 19 and Tier 20
export const SHOWCASE_LEVELS = [
  18000, // Tier 19 Start (Real) - Freeman Dyson Sphere Core Palace
  18001, // Tier 19 Start (Fiction) - Asgard Bifrost Core
  18100, // Tier 19 Deep Space (Real)
  18224, // Tier 19 Key Level
  18300, // Tier 19 Deep Space Structure
  18400, // Tier 19 Mid-Point (Real)
  18401, // Tier 19 Mid-Point (Fiction)
  18600, // Tier 19 Stellar Civilization
  18800, // Tier 19 Galactic Engineering
  18999, // Tier 19 End (Fiction) - Dragon Ball Super Grand Zeno Palace
  19000, // Tier 20 Start (Real) - Laniakea Supercluster Great Attractor HQ
  19001, // Tier 20 Start (Fiction) - Rick's Citadel Central Finite Curve Palace
  19200, // Tier 20 Cosmic Web Station
  19400, // Tier 20 Multiverse Anchor Station
  19500, // Tier 20 Mid-Point - Interdimensional Hub
  19600, // Tier 20 Higher Dimension Sanctum
  19800, // Tier 20 Omega Point Nexus
  19998, // Tier 20 Boss (Real) - Cosmic Horizon Event Boundary Observation Deck
  19999, // Tier 20 Boss (Fiction) - Multiverse Author Room Final Metaspace
  20000  // Tier 20 Final Boss - Observable Universe Living Room Snowglobe Penthouse
];

/**
 * Enriches a chunk item with standard R2 key, webp URLs, and AI model identifier
 */
export function enrichItem(item) {
  const padded = String(item.level).padStart(5, '0');
  return {
    ...item,
    r2Key: `houses/${padded}.webp`,
    imageUrl: `/r2/houses/${padded}.webp`,
    ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
    aiModel: GEMINI_MODEL_ID
  };
}

/**
 * Reads, enriches, and writes back chunks 18 and 19
 */
export function enrichChunks() {
  console.log(`[Shard 9] Enriching chunks 18 and 19...`);

  if (!fs.existsSync(CHUNK_18_PATH)) {
    throw new Error(`Chunk 18 not found at: ${CHUNK_18_PATH}`);
  }
  if (!fs.existsSync(CHUNK_19_PATH)) {
    throw new Error(`Chunk 19 not found at: ${CHUNK_19_PATH}`);
  }

  const chunk18Raw = JSON.parse(fs.readFileSync(CHUNK_18_PATH, 'utf-8'));
  const chunk19Raw = JSON.parse(fs.readFileSync(CHUNK_19_PATH, 'utf-8'));

  const enrichedChunk18 = chunk18Raw.map(enrichItem);
  const enrichedChunk19 = chunk19Raw.map(enrichItem);

  fs.writeFileSync(CHUNK_18_PATH, JSON.stringify(enrichedChunk18, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(CHUNK_19_PATH, JSON.stringify(enrichedChunk19, null, 2) + '\n', 'utf-8');

  console.log(`[Shard 9] ✔ Chunk 18 enriched: ${enrichedChunk18.length} items (Lv. ${enrichedChunk18[0].level}..${enrichedChunk18[enrichedChunk18.length - 1].level})`);
  console.log(`[Shard 9] ✔ Chunk 19 enriched: ${enrichedChunk19.length} items (Lv. ${enrichedChunk19[0].level}..${enrichedChunk19[enrichedChunk19.length - 1].level})`);

  return { enrichedChunk18, enrichedChunk19 };
}

/**
 * Generates showcase artwork SVGs and writes manifest.json
 */
export async function generateShard9({ full = false } = {}) {
  console.log(`=== [Starting Image Generation Shard 9 (Levels ${MIN_SHARD_LEVEL}..${MAX_SHARD_LEVEL})] ===`);
  console.log(`Mode: ${full ? 'FULL (2,001 levels)' : `SHOWCASE (${SHOWCASE_LEVELS.length} key levels)`}`);
  console.log(`AI Model: ${GEMINI_MODEL_ID}`);

  // 1. Ensure staging directory exists
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  // 2. Enrich chunks 18 and 19
  const { enrichedChunk18, enrichedChunk19 } = enrichChunks();

  // 3. Determine target levels
  const targetLevels = full
    ? Array.from({ length: TOTAL_SHARD_LEVELS }, (_, i) => MIN_SHARD_LEVEL + i)
    : SHOWCASE_LEVELS;

  console.log(`[Shard 9] Rendering ${targetLevels.length} SVG artwork files to ${STAGING_DIR}...`);

  const artworks = [];

  for (const level of targetLevels) {
    const concept = getHouseConceptByLevel(level);
    const padded = String(level).padStart(5, '0');
    const fileName = `houses_${padded}.svg`;
    const svgContent = renderHouseArtworkSvg(concept);
    const filePath = path.join(STAGING_DIR, fileName);

    fs.writeFileSync(filePath, svgContent, 'utf-8');

    artworks.push({
      level: concept.level,
      paddedLevel: padded,
      fileName,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${padded}.webp`,
      title: concept.title,
      tier: concept.tier,
      tierName: concept.tierName,
      zone: concept.zone,
      realityType: concept.realityType,
      category: concept.category,
      categoryLabel: concept.categoryLabel,
      fileSizeBytes: Buffer.byteLength(svgContent, 'utf-8'),
      aiModel: GEMINI_MODEL_ID
    });
  }

  // 4. Generate manifest.json
  const manifest = {
    shardId: SHARD_ID,
    shardName: 'Shard 9 (Levels 18000..20000, Tiers 19 & 20)',
    minLevel: MIN_SHARD_LEVEL,
    maxLevel: MAX_SHARD_LEVEL,
    totalLevels: TOTAL_SHARD_LEVELS,
    tiers: [19, 20],
    chunks: [
      path.basename(CHUNK_18_PATH),
      path.basename(CHUNK_19_PATH)
    ],
    aiModel: GEMINI_MODEL_ID,
    mode: full ? 'full' : 'showcase',
    generatedCount: artworks.length,
    showcaseCount: SHOWCASE_LEVELS.length,
    generatedAt: new Date().toISOString(),
    chunkStats: {
      chunk18: {
        fileName: path.basename(CHUNK_18_PATH),
        minLevel: enrichedChunk18[0].level,
        maxLevel: enrichedChunk18[enrichedChunk18.length - 1].level,
        count: enrichedChunk18.length,
        tier: 19
      },
      chunk19: {
        fileName: path.basename(CHUNK_19_PATH),
        minLevel: enrichedChunk19[0].level,
        maxLevel: enrichedChunk19[enrichedChunk19.length - 1].level,
        count: enrichedChunk19.length,
        tier: 20
      }
    },
    artworks
  };

  const manifestPath = path.join(STAGING_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(`[Shard 9] ✔ Manifest written: ${manifestPath} (${artworks.length} artwork records)`);

  console.log(`=== [Shard 9 Complete: ${artworks.length} artworks generated, chunks 18 & 19 enriched] ===`);
  return manifest;
}

// CLI execution entry point
const isDirectCall = process.argv[1] && (
  process.argv[1] === __filename ||
  pathToFileURL(process.argv[1]).href === import.meta.url
);

if (isDirectCall) {
  const isFull = process.argv.includes('--full');
  generateShard9({ full: isFull })
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Shard 9 Error]:', err);
      process.exit(1);
    });
}
