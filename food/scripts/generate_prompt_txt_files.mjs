#!/usr/bin/env node
/**
 * scripts/generate_prompt_txt_files.mjs
 *
 * Reads food dataset (data/foods_master.json or data/raw_foods_collected.json)
 * and generates per-food prompt files: images/{00001..00NNN}.txt
 * with the exact format: "일러스트풍으로 {음식이름}그려줘"
 * and an overall mapping: images/manifest.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Command line argument parser
let customDataPath = null;
let customTargetDir = null;

for (let i = 2; i < process.argv.length; i++) {
  const rawArg = process.argv[i].trim();
  if (!rawArg) continue;
  const cleanArg = rawArg.replace(/^['"]+|['"]+$/g, '');

  if (cleanArg.startsWith('--data=')) {
    customDataPath = path.resolve(cleanArg.slice(7).replace(/^['"]+|['"]+$/g, ''));
  } else if (cleanArg.startsWith('--target=') || cleanArg.startsWith('--images=') || cleanArg.startsWith('--out=')) {
    customTargetDir = path.resolve(cleanArg.replace(/^--[a-z]+=/i, '').replace(/^['"]+|['"]+$/g, ''));
  } else if (cleanArg.toLowerCase().endsWith('.json')) {
    customDataPath = path.resolve(cleanArg);
  } else {
    customTargetDir = path.resolve(cleanArg);
  }
}

const defaultMasterPath = path.join(projectRoot, 'data', 'foods_master.json');
const defaultRawPath = path.join(projectRoot, 'data', 'raw_foods_collected.json');
const targetImagesDir = customTargetDir || path.join(projectRoot, 'images');

// 1. Determine data file path
let dataFilePath = customDataPath;
if (!dataFilePath) {
  if (fs.existsSync(defaultMasterPath)) {
    dataFilePath = defaultMasterPath;
  } else if (fs.existsSync(defaultRawPath)) {
    dataFilePath = defaultRawPath;
  }
}

// Ensure target images directory exists
if (!fs.existsSync(targetImagesDir)) {
  fs.mkdirSync(targetImagesDir, { recursive: true });
}

if (!dataFilePath || !fs.existsSync(dataFilePath)) {
  console.warn('===============================================================');
  console.warn(' [안내] 음식 데이터셋 파일을 찾을 수 없습니다.');
  console.warn(`  - 확인 경로 1: ${defaultMasterPath}`);
  console.warn(`  - 확인 경로 2: ${defaultRawPath}`);
  console.warn('  -> 데이터 수집 완료 후 재실행하면 images/*.txt 파일이 자동 생성됩니다.');
  console.warn('===============================================================');
  
  const manifestPath = path.join(targetImagesDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, JSON.stringify({}, null, 2), 'utf8');
  }
  process.exit(0);
}

// 2. Load and parse JSON
console.log(`[정보] 음식 데이터셋 로드: ${dataFilePath}`);
let rawContent;
try {
  rawContent = fs.readFileSync(dataFilePath, 'utf8');
} catch (err) {
  console.error(`[오류] 데이터 파일 읽기 실패: ${err.message}`);
  process.exit(1);
}

let parsed;
try {
  // Strip UTF-8 BOM if present
  const cleanJson = rawContent.charCodeAt(0) === 0xFEFF ? rawContent.slice(1) : rawContent;
  parsed = JSON.parse(cleanJson);
} catch (err) {
  console.error(`[오류] JSON 파싱 실패: ${err.message}`);
  process.exit(1);
}

// Extract foods array (supports raw array, { foods: [...] }, or { items: [...] })
let foods = [];
if (Array.isArray(parsed)) {
  foods = parsed;
} else if (Array.isArray(parsed.foods)) {
  foods = parsed.foods;
} else if (Array.isArray(parsed.items)) {
  foods = parsed.items;
} else {
  console.warn('[경고] 데이터 파일 내 음식 배열(foods 또는 items)을 찾지 못했습니다.');
}

console.log(`[정보] 총 ${foods.length}개 음식 항목을 처리합니다.`);
console.log(`[정보] 타겟 이미지 폴더: ${targetImagesDir}`);

// 3. Generate {00001}.txt and manifest.json
const manifest = {};
let generatedCount = 0;

for (let i = 0; i < foods.length; i++) {
  const item = foods[i];
  if (!item) continue;

  const idx = Number.isInteger(item.index) && item.index > 0
    ? item.index
    : (item.code && /^\d+$/.test(String(item.code)) ? parseInt(item.code, 10) : (i + 1));

  const code = String(idx).padStart(5, '0');
  const foodName = String(item.name || item.title || item.foodName || '').trim();
  const prompt = `일러스트풍으로 ${foodName}그려줘`;

  const txtPath = path.join(targetImagesDir, `${code}.txt`);
  fs.writeFileSync(txtPath, prompt, 'utf8');

  manifest[code] = {
    code,
    name: foodName,
    prompt,
    ...(item.originGroup ? { originGroup: item.originGroup } : {}),
    ...(item.originBadge ? { originBadge: item.originBadge } : {}),
    ...(item.primaryMeal ? { primaryMeal: item.primaryMeal } : {}),
    ...(item.tags ? { tags: item.tags } : {})
  };

  generatedCount++;
}

const manifestPath = path.join(targetImagesDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('===============================================================');
console.log(` [완료] 총 ${generatedCount}개의 프롬프트 TXT 파일 및 manifest.json 생성 완료`);
console.log(`  - 폴더 위치: ${targetImagesDir}`);
console.log(`  - 첫 번째 파일: ${generatedCount > 0 ? '00001.txt' : '없음'}`);
console.log(`  - 매니페스트: ${manifestPath}`);
console.log('===============================================================');
