/**
 * Run photo collection pipeline across all chunks (00 to 19)
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHUNKS_DIR = path.resolve('data/chunks');
const SCRIPT_PATH = path.resolve('scripts/collect_real_photos.cjs');

async function runCommand(chunkFile) {
  return new Promise((resolve) => {
    console.log(`\n=======================================================`);
    console.log(`▶ Starting pipeline for: ${chunkFile}`);
    console.log(`=======================================================`);

    const child = spawn('node', [SCRIPT_PATH, chunkFile], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      console.log(`✔ Finished ${chunkFile} (exit code ${code})`);
      resolve(code);
    });
  });
}

async function main() {
  const files = fs.readdirSync(CHUNKS_DIR)
    .filter(f => f.startsWith('houses-chunk-') && f.endsWith('.json'))
    .sort();

  console.log(`Found ${files.length} chunk files to process.`);

  for (const f of files) {
    await runCommand(f);
  }

  console.log(`\n🎉 All chunks processed successfully!`);
}

main();
