// scripts/upload_r2_images.mjs
// Cloudflare R2 Object Storage staging & bulk upload manager for 500 House artworks.
// Scans data/r2_staging/shard_0 .. shard_9, synthesizes SVG artworks on demand,
// supports scanning real PNG/WEBP house images from G:\My Drive\new_houses,
// prepares wrangler commands, and outputs manifest to data/r2_upload_summary.json.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { MIN_LEVEL, MAX_LEVEL } from '../src/lib/constants.js';
import { getHouseConceptByLevel } from '../src/lib/taxonomy.js';
import { renderHouseArtworkSvg } from '../src/lib/gemini_client.js';
import { R2_BUCKET_NAME, R2_S3_ENDPOINT, R2_BUCKET_S3_URL, R2_CACHE_CONTROL, getR2ObjectKey } from '../src/lib/r2_storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STAGING_DIR = path.join(ROOT_DIR, 'data', 'r2_staging');
const SUMMARY_FILE = path.join(ROOT_DIR, 'data', 'r2_upload_summary.json');

export const NUM_SHARDS = 10;
export const SHARD_SIZE = 50; // Shard 0: 0..49, ..., Shard 9: 450..499 (500 levels / 10 shards)

/**
 * Calculates shard index (0..9) for a given level.
 */
export function getShardIndexForLevel(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  return Math.min(NUM_SHARDS - 1, Math.floor(lv / SHARD_SIZE));
}

/**
 * Returns staging path for a given level, respecting existing shard file naming.
 */
export function getStagingFilePath(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const shardIdx = getShardIndexForLevel(lv);
  const shardDir = path.join(STAGING_DIR, `shard_${shardIdx}`);
  const padded = String(lv).padStart(5, '0');

  // Check if houses_XXXXX.svg exists in this shard
  const namedFile = path.join(shardDir, `houses_${padded}.svg`);
  if (fs.existsSync(namedFile)) {
    return namedFile;
  }

  // Default to standard 5-digit padded XXXXX.svg
  return path.join(shardDir, `${padded}.svg`);
}

/**
 * Scans data/r2_staging/shard_0 .. shard_9 for existing staged artwork files.
 * Supports both XXXXX.svg and houses_XXXXX.svg naming patterns.
 * Returns Array<{ level: number, filePath: string, shard: number }>
 */
export function scanStagedFiles() {
  const stagedMap = new Map();
  if (!fs.existsSync(STAGING_DIR)) {
    return [];
  }

  for (let s = 0; s < NUM_SHARDS; s++) {
    const shardDir = path.join(STAGING_DIR, `shard_${s}`);
    if (!fs.existsSync(shardDir)) continue;

    const files = fs.readdirSync(shardDir);
    for (const f of files) {
      const match = f.match(/^(?:houses_)?(\d{1,5})\.(svg|webp|png)$/i);
      if (match) {
        const level = parseInt(match[1], 10);
        if (level >= MIN_LEVEL && level <= MAX_LEVEL) {
          if (!stagedMap.has(level) || f.startsWith('houses_')) {
            stagedMap.set(level, {
              level,
              filePath: path.join(shardDir, f),
              shard: s
            });
          }
        }
      }
    }
  }

  const staged = Array.from(stagedMap.values());
  staged.sort((a, b) => a.level - b.level);
  return staged;
}

/**
 * Scans Google Drive folders (G:\My Drive\new_houses, G:\My Drive\houses) for real house images
 */
export function scanGdriveImages() {
  const gdriveDirs = [
    'G:/My Drive/new_houses',
    'G:/My Drive/houses'
  ];

  const foundMap = new Map();

  for (const gdir of gdriveDirs) {
    if (!fs.existsSync(gdir)) continue;
    let files = [];
    try {
      files = fs.readdirSync(gdir);
    } catch {
      continue;
    }
    for (const f of files) {
      const match = f.match(/^(\d{1,5})\.(png|webp)$/i);
      if (match) {
        const level = parseInt(match[1], 10);
        if (level >= MIN_LEVEL && level <= MAX_LEVEL) {
          if (!foundMap.has(level)) {
            foundMap.set(level, {
              level,
              filePath: path.resolve(gdir, f),
              shard: getShardIndexForLevel(level)
            });
          }
        }
      }
    }
  }

  const items = Array.from(foundMap.values());
  items.sort((a, b) => a.level - b.level);
  return items;
}

/**
 * Generates and stages SVG artwork files for the specified range.
 */
export function generateStagedArtworks(startLevel, endLevel, { force = false, verbose = false } = {}) {
  const start = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, startLevel));
  const end = Math.max(start, Math.min(MAX_LEVEL, endLevel));

  let generatedCount = 0;
  let skippedCount = 0;

  for (let lv = start; lv <= end; lv++) {
    const filePath = getStagingFilePath(lv);
    const shardDir = path.dirname(filePath);

    if (!fs.existsSync(shardDir)) {
      fs.mkdirSync(shardDir, { recursive: true });
    }

    if (!force && fs.existsSync(filePath)) {
      skippedCount++;
      continue;
    }

    const concept = getHouseConceptByLevel(lv);
    const svg = renderHouseArtworkSvg(concept);
    fs.writeFileSync(filePath, svg, 'utf-8');
    generatedCount++;
  }

  if (verbose) {
    console.log(`[Staging] Generated ${generatedCount} artworks, ${skippedCount} already existed (range: ${start}..${end}).`);
  }

  return { start, end, generatedCount, skippedCount };
}

/**
 * Prepares Cloudflare wrangler upload command for a staged artwork file.
 */
export function prepareWranglerCommand(level, filePath, bucketName = R2_BUCKET_NAME) {
  const key = getR2ObjectKey(level);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : (ext === '.webp' ? 'image/webp' : 'image/svg+xml');
  const normalizedFile = filePath.replace(/\\/g, '/');
  const relPath = normalizedFile.startsWith(ROOT_DIR.replace(/\\/g, '/'))
    ? path.relative(ROOT_DIR, filePath).replace(/\\/g, '/')
    : normalizedFile;
  return `wrangler r2 object put ${bucketName}/${key} --file="${relPath}" --content-type="${contentType}"`;
}

/**
 * Parse CLI arguments.
 */
export function parseArgs(rawArgs = process.argv.slice(2)) {
  const options = {
    start: undefined,
    end: undefined,
    dryRun: undefined,
    force: false,
    shard: undefined,
    source: undefined,
    help: false
  };

  for (const arg of rawArgs) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--dry-run=true') {
      options.dryRun = true;
    } else if (arg === '--dry-run=false' || arg === '--upload') {
      options.dryRun = false;
    } else if (arg === '--force' || arg === '--force-generate') {
      options.force = true;
    } else if (arg.startsWith('--start=')) {
      options.start = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--end=')) {
      options.end = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--shard=')) {
      options.shard = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--source=')) {
      options.source = arg.split('=')[1].toLowerCase();
    } else if (arg === '--gdrive') {
      options.source = 'gdrive';
    }
  }

  // Default dryRun: true if not explicitly false and CLOUDFLARE_API_TOKEN is not set
  if (options.dryRun === undefined) {
    options.dryRun = !process.env.CLOUDFLARE_API_TOKEN;
  }

  return options;
}

/**
 * Main execution pipeline
 */
export async function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Usage: node scripts/upload_r2_images.mjs [options]

Options:
  --start=<num>       Starting level (0..499)
  --end=<num>         Ending level (0..499)
  --shard=<0..9>      Stage/upload only a specific shard (50 levels each)
  --source=gdrive     Scan real images from G:\\My Drive\\new_houses first
  --dry-run           Perform dry-run simulation without actual R2 uploads
  --upload            Perform live R2 upload via Wrangler CLI
  --force             Force regeneration of existing staged SVG artworks
  -h, --help          Show this help message
`);
    return;
  }

  console.log('=== [Cloudflare R2 Object Storage Image Staging & Upload Manager] ===');
  console.log(`Bucket Name: ${R2_BUCKET_NAME}`);
  console.log(`S3 Endpoint: ${R2_S3_ENDPOINT}`);
  console.log(`S3 Bucket URL: ${R2_BUCKET_S3_URL}`);
  console.log(`Mode: ${options.dryRun ? 'DRY-RUN (Simulation)' : 'LIVE-UPLOAD'}`);
  if (options.source) {
    console.log(`Source: ${options.source.toUpperCase()}`);
  }

  // Determine start & end levels
  let startLevel = options.start;
  let endLevel = options.end;

  if (options.shard !== undefined && options.shard >= 0 && options.shard < NUM_SHARDS) {
    const sStart = options.shard * SHARD_SIZE;
    const sEnd = options.shard === NUM_SHARDS - 1 ? MAX_LEVEL : (options.shard + 1) * SHARD_SIZE - 1;
    startLevel = startLevel !== undefined ? Math.max(sStart, startLevel) : sStart;
    endLevel = endLevel !== undefined ? Math.min(sEnd, endLevel) : sEnd;
  }

  let staged = [];

  if (options.source === 'gdrive') {
    console.log('Scanning images from G:\\My Drive\\new_houses & G:\\My Drive\\houses...');
    staged = scanGdriveImages();
    if (startLevel !== undefined || endLevel !== undefined) {
      const s = startLevel !== undefined ? startLevel : 0;
      const e = endLevel !== undefined ? endLevel : MAX_LEVEL;
      staged = staged.filter(item => item.level >= s && item.level <= e);
    }
  } else {
    // If specific range requested or staging directory empty, generate requested artworks
    staged = scanStagedFiles();

    if (startLevel !== undefined || endLevel !== undefined) {
      const s = startLevel !== undefined ? startLevel : 0;
      const e = endLevel !== undefined ? endLevel : s;
      console.log(`\nGenerating/verifying artworks for range: ${s} .. ${e}...`);
      generateStagedArtworks(s, e, { force: options.force, verbose: true });
      staged = scanStagedFiles().filter(item => item.level >= s && item.level <= e);
    } else if (staged.length === 0) {
      // Default fallback when staging is completely empty: generate 0..100
      console.log('\nStaging directory empty. Generating default range 0 .. 100...');
      generateStagedArtworks(0, 100, { force: options.force, verbose: true });
      staged = scanStagedFiles();
    }
  }

  if (staged.length === 0) {
    console.warn('No staged files found to process.');
    return;
  }

  const effectiveStart = staged[0].level;
  const effectiveEnd = staged[staged.length - 1].level;

  // Prepare commands & shard statistics
  const commands = [];
  const shardCounts = {};

  for (const item of staged) {
    const cmd = prepareWranglerCommand(item.level, item.filePath, R2_BUCKET_NAME);
    commands.push(cmd);
    const shardKey = `shard_${item.shard}`;
    shardCounts[shardKey] = (shardCounts[shardKey] || 0) + 1;
  }

  console.log(`\nStaged artworks scanned: ${staged.length} files`);
  console.log(`Level range: ${effectiveStart} .. ${effectiveEnd}`);
  console.log('Shard breakdown:');
  for (const [sKey, count] of Object.entries(shardCounts)) {
    console.log(`  - ${sKey}: ${count} files`);
  }

  // Prepare and write manifest summary
  const summary = {
    timestamp: new Date().toISOString(),
    bucket: R2_BUCKET_NAME,
    cacheControl: R2_CACHE_CONTROL,
    dryRun: options.dryRun,
    startLevel: effectiveStart,
    endLevel: effectiveEnd,
    totalObjects: staged.length,
    stagedFilesCount: staged.length,
    shards: shardCounts,
    sampleCommands: commands.slice(0, 10),
    status: options.dryRun ? 'DRY_RUN_COMPLETED' : 'READY_FOR_UPLOAD'
  };

  const dataDir = path.dirname(SUMMARY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`\n✔ Staging manifest successfully written to: ${path.relative(ROOT_DIR, SUMMARY_FILE)}`);

  console.log('\nSample Wrangler R2 Commands:');
  summary.sampleCommands.slice(0, 3).forEach(c => console.log(`  $ ${c}`));
  if (commands.length > 3) {
    console.log(`  ... and ${commands.length - 3} more commands.`);
  }

  // Live upload execution if not dry-run
  if (!options.dryRun) {
    console.log('\nExecuting R2 bulk upload via Wrangler CLI...');
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      try {
        execSync(cmd, { cwd: ROOT_DIR, stdio: 'pipe' });
        successCount++;
        if ((i + 1) % 50 === 0 || i === commands.length - 1) {
          console.log(`Progress: ${i + 1}/${commands.length} uploaded...`);
        }
      } catch (err) {
        console.error(`Failed to upload object for: ${cmd}`, err?.message);
        failCount++;
      }
    }

    summary.uploadedCount = successCount;
    summary.failedCount = failCount;
    summary.status = failCount === 0 ? 'UPLOAD_SUCCESS' : 'UPLOAD_PARTIAL';
    fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`\nUpload finished: ${successCount} succeeded, ${failCount} failed.`);
  } else {
    console.log('\n✔ Dry-run complete. Set CLOUDFLARE_API_TOKEN and pass --upload to execute live upload.');
  }
}

// Auto-run when executed directly via CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(err => {
    console.error('Error executing upload_r2_images.mjs:', err);
    process.exit(1);
  });
}
