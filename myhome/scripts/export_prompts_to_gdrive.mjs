// scripts/export_prompts_to_gdrive.mjs
// Extracts geminiImagePrompt from data/chunks and saves them as 00000.txt, 00001.txt ... in G:\My Drive\houses

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'G:\\My Drive\\houses';

async function run() {
  console.log(`Source Chunks Directory: ${CHUNKS_DIR}`);
  console.log(`Target Directory: ${OUTPUT_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const chunkFiles = fs.readdirSync(CHUNKS_DIR)
    .filter(f => f.startsWith('houses-chunk-') && f.endsWith('.json'))
    .sort();

  console.log(`Found ${chunkFiles.length} chunk files.`);

  const startTime = Date.now();
  let totalWritten = 0;

  for (let cIdx = 0; cIdx < chunkFiles.length; cIdx++) {
    const chunkFile = chunkFiles[cIdx];
    const chunkPath = path.join(CHUNKS_DIR, chunkFile);
    const houses = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));

    const chunkStartTime = Date.now();
    const batchSize = 100;
    for (let i = 0; i < houses.length; i += batchSize) {
      const batch = houses.slice(i, i + batchSize);
      await Promise.all(
        batch.map(house => {
          const fileName = String(house.level).padStart(5, '0') + '.txt';
          const filePath = path.join(OUTPUT_DIR, fileName);
          const prompt = house.geminiImagePrompt || '';
          return fs.promises.writeFile(filePath, prompt, 'utf-8');
        })
      );
      totalWritten += batch.length;
    }

    const chunkElapsed = ((Date.now() - chunkStartTime) / 1000).toFixed(2);
    console.log(
      `[${cIdx + 1}/${chunkFiles.length}] Processed ${chunkFile} (${houses.length} items) in ${chunkElapsed}s. (Total written: ${totalWritten})`
    );
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Completed! Total ${totalWritten} files written to "${OUTPUT_DIR}" in ${totalElapsed}s.`);
}

run().catch(err => {
  console.error('Error exporting prompts:', err);
  process.exit(1);
});
