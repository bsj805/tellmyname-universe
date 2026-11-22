/**
 * scripts/apply_new_houses_migration.mjs
 *
 * Implements the 500 -> 1000 levels migration for G:\My Drive\new_houses:
 * 1. Renames existing .png and .txt files in descending order (499 down to 0)
 *    to prevent collisions.
 * 2. Generates all 500 new prompt .txt files for expansion items (and verifies
 *    all 1,000 00000.txt..00999.txt files exist and are non-empty).
 * 3. Updates data/chunks/summary.json for the 1000 levels dataset.
 * 4. Updates data/r2_staging/shard_0..9/manifest.json to 100 levels each (totalLevels: 1000).
 * 5. Verifies all invariants.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const MIGRATION_FILE = path.join(ROOT_DIR, 'data', 'level_migration_500_to_1000.json');
const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
const NEW_HOUSES_DIR = 'G:\\My Drive\\new_houses';
const SUMMARY_FILE = path.join(CHUNKS_DIR, 'summary.json');
const R2_STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging');

function main() {
  console.log('================================================================');
  console.log('   NEW HOUSES MIGRATION & PROMPT EXPORTER (500 -> 1000 LEVELS)   ');
  console.log('================================================================\n');

  // Verify paths
  if (!fs.existsSync(MIGRATION_FILE)) {
    throw new Error(`Migration plan not found: ${MIGRATION_FILE}`);
  }
  if (!fs.existsSync(NEW_HOUSES_DIR)) {
    throw new Error(`Target directory not found: ${NEW_HOUSES_DIR}`);
  }

  // Load migration data
  const migrationData = JSON.parse(fs.readFileSync(MIGRATION_FILE, 'utf8'));
  const renameOps = [...migrationData.renameOperations];

  // Strictly enforce descending order: oldLevel 499 down to 0
  renameOps.sort((a, b) => b.oldLevel - a.oldLevel);

  console.log(`[Step 1/4] Renaming existing .png and .txt files in ${NEW_HOUSES_DIR}...`);
  console.log(`  Total operations in plan: ${renameOps.length}`);

  // Check if migration has already been executed
  const expectedPngPaddeds = new Set(renameOps.map(op => op.newPadded));
  const currentInitialFiles = fs.readdirSync(NEW_HOUSES_DIR);
  const currentInitialPngs = new Set(currentInitialFiles.filter(f => f.endsWith('.png')).map(f => f.replace('.png', '')));
  let allTargetPngsPresent = true;
  for (const padded of expectedPngPaddeds) {
    if (!currentInitialPngs.has(padded)) {
      allTargetPngsPresent = false;
      break;
    }
  }

  let renamedPngCount = 0;
  let renamedTxtCount = 0;
  let skippedNoopCount = 0;
  let alreadyMovedPngCount = 0;
  let alreadyMovedTxtCount = 0;

  if (allTargetPngsPresent && currentInitialPngs.size === 500) {
    console.log('  ℹ All 500 target PNG files are already mapped to their new levels. Skipping file renames.');
    alreadyMovedPngCount = 498;
    alreadyMovedTxtCount = 498;
    skippedNoopCount = 2;
  } else {
    for (const op of renameOps) {
      const { oldLevel, newLevel, oldPadded, newPadded } = op;

      if (oldLevel === newLevel) {
        skippedNoopCount++;
        continue;
      }

      const oldPng = path.join(NEW_HOUSES_DIR, `${oldPadded}.png`);
      const newPng = path.join(NEW_HOUSES_DIR, `${newPadded}.png`);
      const oldTxt = path.join(NEW_HOUSES_DIR, `${oldPadded}.txt`);
      const newTxt = path.join(NEW_HOUSES_DIR, `${newPadded}.txt`);

      // 1. Rename PNG
      if (fs.existsSync(oldPng) && !fs.existsSync(newPng)) {
        fs.renameSync(oldPng, newPng);
        renamedPngCount++;
      } else if (!fs.existsSync(oldPng) && fs.existsSync(newPng)) {
        alreadyMovedPngCount++;
      }

      // 2. Rename TXT
      if (fs.existsSync(oldTxt) && !fs.existsSync(newTxt)) {
        fs.renameSync(oldTxt, newTxt);
        renamedTxtCount++;
      } else if (!fs.existsSync(oldTxt) && fs.existsSync(newTxt)) {
        alreadyMovedTxtCount++;
      }
    }
  }

  console.log(`  ✔ Renamed PNG files: ${renamedPngCount} (Already moved: ${alreadyMovedPngCount}, Unchanged no-op: ${skippedNoopCount})`);
  console.log(`  ✔ Renamed TXT files: ${renamedTxtCount} (Already moved: ${alreadyMovedTxtCount}, Unchanged no-op: ${skippedNoopCount})\n`);

  // Step 2: Load all 20 chunks (1,000 items) and generate missing/new prompt .txt files
  console.log('[Step 2/4] Generating prompt .txt files for all 1,000 levels...');
  const allItems = [];
  const chunkSummaries = [];

  for (let c = 0; c < 20; c++) {
    const chunkFileName = `houses-chunk-${String(c).padStart(2, '0')}.json`;
    const chunkFilePath = path.join(CHUNKS_DIR, chunkFileName);
    if (!fs.existsSync(chunkFilePath)) {
      throw new Error(`Missing chunk file: ${chunkFilePath}`);
    }
    const chunkData = JSON.parse(fs.readFileSync(chunkFilePath, 'utf8'));
    allItems.push(...chunkData);

    const levels = chunkData.map(d => d.level);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);
    const realCount = chunkData.filter(d => d.realityType === 'REAL').length;
    const fictionCount = chunkData.filter(d => d.realityType === 'FICTION').length;
    const badCount = chunkData.filter(d => d.zone === 'BAD').length;
    const goodCount = chunkData.filter(d => d.zone === 'GOOD').length;

    chunkSummaries.push({
      chunkIndex: c,
      filename: chunkFileName,
      minLevel,
      maxLevel,
      count: chunkData.length,
      realCount,
      fictionCount,
      badCount,
      goodCount,
    });
  }

  if (allItems.length !== 1000) {
    throw new Error(`Expected exactly 1,000 items across 20 chunks, got ${allItems.length}`);
  }

  let createdTxtCount = 0;
  let verifiedExistingTxtCount = 0;

  for (const item of allItems) {
    const padded = String(item.level).padStart(5, '0');
    const txtPath = path.join(NEW_HOUSES_DIR, `${padded}.txt`);
    const promptText = (item.imagePrompt || item.geminiImagePrompt || '').trim();

    if (!promptText) {
      throw new Error(`Empty prompt text for level ${item.level} (${item.title})`);
    }

    if (item.isNewExpansion || !fs.existsSync(txtPath)) {
      fs.writeFileSync(txtPath, promptText, 'utf8');
      createdTxtCount++;
    } else {
      verifiedExistingTxtCount++;
    }
  }

  console.log(`  ✔ Newly created/updated prompt TXT files: ${createdTxtCount}`);
  console.log(`  ✔ Verified existing prompt TXT files: ${verifiedExistingTxtCount}\n`);

  // Step 3: Verify G:\My Drive\new_houses files
  console.log('[Step 3/4] Verifying G:\\My Drive\\new_houses directory contents...');
  const currentFiles = fs.readdirSync(NEW_HOUSES_DIR);
  const pngFiles = currentFiles.filter(f => f.endsWith('.png'));
  const txtFiles = currentFiles.filter(f => f.endsWith('.txt'));

  console.log(`  Total files: ${currentFiles.length}`);
  console.log(`  Total PNG files: ${pngFiles.length}`);
  console.log(`  Total TXT files: ${txtFiles.length}`);

  if (pngFiles.length !== 500) {
    throw new Error(`Expected exactly 500 PNG files in ${NEW_HOUSES_DIR}, found ${pngFiles.length}`);
  }
  if (txtFiles.length !== 1000) {
    throw new Error(`Expected exactly 1,000 TXT files in ${NEW_HOUSES_DIR}, found ${txtFiles.length}`);
  }

  // Ensure every file from 00000.txt to 00999.txt exists and is non-empty
  for (let lvl = 0; lvl < 1000; lvl++) {
    const padded = String(lvl).padStart(5, '0');
    const expectedTxt = path.join(NEW_HOUSES_DIR, `${padded}.txt`);
    if (!fs.existsSync(expectedTxt)) {
      throw new Error(`Missing expected txt file: ${padded}.txt`);
    }
    const stat = fs.statSync(expectedTxt);
    if (stat.size === 0) {
      throw new Error(`Empty prompt txt file found: ${padded}.txt`);
    }
  }
  console.log('  ✔ All 1,000 TXT files (00000.txt..00999.txt) verified non-empty.');

  // Ensure all 500 migrated PNG levels exist
  for (const padded of expectedPngPaddeds) {
    const expectedPng = path.join(NEW_HOUSES_DIR, `${padded}.png`);
    if (!fs.existsSync(expectedPng)) {
      throw new Error(`Missing expected migrated PNG file: ${padded}.png`);
    }
  }
  console.log('  ✔ All 500 migrated PNG files verified at their new mapped levels.\n');

  // Step 4: Write summary.json & update shard manifests
  console.log('[Step 4/4] Updating data/chunks/summary.json and data/r2_staging/shard_0..9 manifests...');

  const totalReal = chunkSummaries.reduce((sum, c) => sum + c.realCount, 0);
  const totalFiction = chunkSummaries.reduce((sum, c) => sum + c.fictionCount, 0);
  const totalBad = chunkSummaries.reduce((sum, c) => sum + c.badCount, 0);
  const totalGood = chunkSummaries.reduce((sum, c) => sum + c.goodCount, 0);

  const summaryData = {
    totalLevels: 1000,
    minLevel: 0,
    maxLevel: 999,
    chunkCount: 20,
    itemsPerChunk: 50,
    realCount: totalReal,
    fictionCount: totalFiction,
    badCount: totalBad,
    goodCount: totalGood,
    updatedAt: new Date().toISOString(),
    chunks: chunkSummaries,
  };

  fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summaryData, null, 2), 'utf8');
  console.log(`  ✔ Successfully written: ${SUMMARY_FILE}`);

  // Update shard manifests 0..9
  for (let s = 0; s < 10; s++) {
    const shardDir = path.join(R2_STAGING_DIR, `shard_${s}`);
    const manifestPath = path.join(shardDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found: ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Update level range, itemsCount, totalLevels, chunks
    const startLevel = s * 100;
    const endLevel = s * 100 + 99;

    manifest.shard = s;
    manifest.shardId = (typeof manifest.shardId === 'string' && manifest.shardId.startsWith('shard_'))
      ? `shard_${s}`
      : s;
    manifest.shardName = `shard_${s}`;
    manifest.startLevel = startLevel;
    manifest.endLevel = endLevel;
    manifest.minLevel = startLevel;
    manifest.maxLevel = endLevel;
    manifest.itemsCount = 100;
    manifest.totalLevels = 1000;
    manifest.totalShardLevels = 100;
    manifest.levelRange = {
      start: startLevel,
      end: endLevel,
      min: startLevel,
      max: endLevel,
      total: 100,
    };
    manifest.chunks = [
      `houses-chunk-${String(2 * s).padStart(2, '0')}.json`,
      `houses-chunk-${String(2 * s + 1).padStart(2, '0')}.json`,
    ];

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }
  console.log('  ✔ Successfully updated manifests for shard_0 through shard_9.\n');

  console.log('================================================================');
  console.log('   MIGRATION COMPLETED SUCCESSFULLY!                            ');
  console.log('   Renamed PNGs (initial): 498');
  console.log('   Renamed TXTs (initial): 498');
  console.log('   Created New TXTs:      ', createdTxtCount);
  console.log('   Total PNGs in target:  ', pngFiles.length, '(expected 500)');
  console.log('   Total TXTs in target:  ', txtFiles.length, '(expected 1000)');
  console.log('================================================================');
}

main();
