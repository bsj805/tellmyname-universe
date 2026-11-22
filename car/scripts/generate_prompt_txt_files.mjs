#!/usr/bin/env node
/**
 * scripts/generate_prompt_txt_files.mjs
 *
 * Reads 0~1000 Master Bizarre Vehicles & Creature Mounts Dataset from src/lib/master_dataset.js
 * Generates:
 * 1. images/00000.txt .. images/01000.txt (5-digit zero-padded for R2 & auto_generator.py)
 * 2. images/0.txt .. images/1000.txt (unpadded level aliases required by spec)
 * 3. images/manifest.json (complete level-to-prompt & spec mapping)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MASTER_CARS } from '../src/lib/master_dataset.js';
import { buildCarImagePrompt } from '../src/lib/gemini_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

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
fs.mkdirSync(targetImagesDir, { recursive: true });

console.log('===============================================================');
console.log(' [MyCar] Vehicle & Mount Prompt TXT Generator (0~1000)');
console.log(`  - Target Directory: ${targetImagesDir}`);
console.log(`  - Master Cars Count: ${MASTER_CARS.length}`);
console.log('===============================================================');

const manifest = {};
let generatedCount = 0;

for (let i = 0; i < MASTER_CARS.length; i++) {
  const car = MASTER_CARS[i];
  if (!car) continue;

  const level = car.level;
  const paddedCode = String(level).padStart(5, '0');
  const prompt = buildCarImagePrompt(car);

  // Write 5-digit zero-padded 00000.txt .. 01000.txt AND unpadded 0.txt .. 1000.txt
  fs.writeFileSync(path.join(targetImagesDir, `${paddedCode}.txt`), prompt, 'utf8');
  fs.writeFileSync(path.join(targetImagesDir, `${level}.txt`), prompt, 'utf8');

  manifest[String(level)] = {
    level,
    paddedCode,
    title: car.title,
    prompt,
    category: car.category,
    categoryLabel: car.categoryLabel,
    categoryEmoji: car.categoryEmoji,
    realityType: car.realityType,
    realityLabel: car.realityLabel,
    zone: car.zone,
    zoneLabel: car.zoneLabel,
    tier: car.tier,
    tierName: car.tierName,
    era: car.era,
    estimatedPrice: car.estimatedPrice,
    estimatedSalary: car.estimatedSalary,
    specialFeature: car.specialFeature,
    specialDuty: car.specialDuty,
    aiVerdict: car.aiVerdict
  };

  generatedCount++;
}

const manifestPath = path.join(targetImagesDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`✔ Generated ${generatedCount} padded prompt files (00000.txt ~ 01000.txt)`);
console.log(`✔ Generated ${generatedCount} unpadded prompt files (0.txt ~ 1000.txt)`);
console.log(`✔ Wrote manifest.json (${Object.keys(manifest).length} entries)`);
