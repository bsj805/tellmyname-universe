#!/usr/bin/env node
/**
 * scripts/generate_prompt_txt_files.mjs
 *
 * Reads 0~1000 Master Occupation Dataset from src/lib/master_dataset.js
 * Generates prompt files:
 * 1. images/00000.txt .. images/01000.txt (Strict 5-digit zero-padded format for R2 and automation)
 * 2. Cleans up any unpadded *.txt or *.png (e.g. 0.txt, 1.png) to prevent duplicate image generation
 * 3. images/manifest.json (complete mapping)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MASTER_JOBS } from '../src/lib/master_dataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// CLI Argument parsing
let customTargetDir = null;

for (let i = 2; i < process.argv.length; i++) {
  const rawArg = process.argv[i].trim();
  if (!rawArg) continue;
  const cleanArg = rawArg.replace(/^['"]+|['"]+$/g, '');

  if (cleanArg.startsWith('--target=') || cleanArg.startsWith('--images=') || cleanArg.startsWith('--out=')) {
    customTargetDir = path.resolve(cleanArg.replace(/^--[a-z]+=/i, '').replace(/^['"]+|['"]+$/g, ''));
  } else if (!cleanArg.startsWith('--')) {
    customTargetDir = path.resolve(cleanArg);
  }
}

const targetImagesDir = customTargetDir || path.join(projectRoot, 'images');

// Ensure target directory exists
if (!fs.existsSync(targetImagesDir)) {
  fs.mkdirSync(targetImagesDir, { recursive: true });
}

console.log('===============================================================');
console.log(' [MyJob] Occupation Prompt TXT Generator (00000.txt ~ 01000.txt)');
console.log(`  - Target Directory: ${targetImagesDir}`);
console.log(`  - Master Jobs Count: ${MASTER_JOBS.length}`);
console.log('===============================================================');

// Clean up any unpadded .txt or .png files to prevent duplicate generation
let cleanedCount = 0;
const existingFiles = fs.readdirSync(targetImagesDir);
for (const file of existingFiles) {
  if (/^\d{1,4}\.(txt|png)$/.test(file)) {
    fs.unlinkSync(path.join(targetImagesDir, file));
    cleanedCount++;
  }
}
if (cleanedCount > 0) {
  console.log(`🧹 Cleaned up ${cleanedCount} unpadded files (e.g. 0.txt, 1.png) to prevent duplicate generation.`);
}

const manifest = {};
let generatedCount = 0;

for (let i = 0; i < MASTER_JOBS.length; i++) {
  const job = MASTER_JOBS[i];
  if (!job) continue;

  const level = job.level;
  const paddedCode = String(level).padStart(5, '0');
  const paddedName = `${paddedCode}.txt`;

  const prompt = job.geminiImagePrompt || job.imagePrompt ||
    `일러스트풍으로 ${job.title} 직업을 가진 사람의 모습을 재미있고 생동감 넘치게 그려줘. I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements.`;

  // Write ONLY 5-digit padded 00000.txt .. 01000.txt
  const paddedPath = path.join(targetImagesDir, paddedName);
  fs.writeFileSync(paddedPath, prompt, 'utf8');

  manifest[String(level)] = {
    level,
    paddedCode,
    title: job.title,
    prompt,
    category: job.category,
    categoryLabel: job.categoryLabel,
    categoryEmoji: job.categoryEmoji,
    realityType: job.realityType,
    realityLabel: job.realityLabel,
    zone: job.zone,
    zoneLabel: job.zoneLabel,
    tier: job.tier,
    tierName: job.tierName,
    era: job.era,
    estimatedSalary: job.estimatedSalary,
    specialDuty: job.specialDuty,
    aiVerdict: job.aiVerdict
  };

  generatedCount++;
}

// Write manifest.json
const manifestPath = path.join(targetImagesDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`✔ Successfully generated ${generatedCount} prompt files (00000.txt ~ 01000.txt)`);
console.log(`✔ Successfully wrote manifest.json (${Object.keys(manifest).length} entries)`);
