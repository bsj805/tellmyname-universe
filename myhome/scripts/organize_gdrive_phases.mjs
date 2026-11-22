// scripts/organize_gdrive_phases.mjs
// G:\My Drive\houses 내의 20,001개 .txt 프롬프트 파일을
// - 현재 활성(Phase 1): 각 티어별 50장 (T*1000 + 000 ~ 049, + 20000.txt = 총 1,001개)만 G:\My Drive\houses 루트에 유지
// - 추후 확장(future_work/phase2 ~ phase20): 각 Phase별로 티어당 50장씩(1,000개씩) 분할 이동하여 보관
// - 추후 `node scripts/organize_gdrive_phases.mjs --activate=phase2` 실행 시 해당 phase의 txt를 루트로 즉시 복원

import fs from 'fs';
import path from 'path';

const HOUSES_DIR = 'G:/My Drive/houses';
const FUTURE_WORK_DIR = path.join(HOUSES_DIR, 'future_work');
const SLOTS_PER_PHASE = 50; // 각 phase당 티어별 50장

const args = process.argv.slice(2);
const activateArg = args.find(a => a.startsWith('--activate='));

if (activateArg) {
  const phaseName = activateArg.split('=')[1];
  const phaseDir = path.join(FUTURE_WORK_DIR, phaseName);
  if (!fs.existsSync(phaseDir)) {
    console.error(`Phase directory not found: ${phaseDir}`);
    process.exit(1);
  }
  const files = fs.readdirSync(phaseDir).filter(f => f.endsWith('.txt'));
  let moved = 0;
  for (const f of files) {
    fs.renameSync(path.join(phaseDir, f), path.join(HOUSES_DIR, f));
    moved++;
  }
  console.log(`✔ Activated ${phaseName}: moved ${moved} .txt files into ${HOUSES_DIR}`);
  process.exit(0);
}

console.log(`=== Organizing ${HOUSES_DIR} into Phase 1 (root, 50/tier) & future_work/phase2..phase20 ===`);

// Ensure future_work/phase2 .. phase20 directories exist
fs.mkdirSync(FUTURE_WORK_DIR, { recursive: true });
for (let p = 2; p <= 20; p++) {
  fs.mkdirSync(path.join(FUTURE_WORK_DIR, `phase${p}`), { recursive: true });
}

const entries = fs.readdirSync(HOUSES_DIR);
let keptInRoot = 0;
let movedToFuture = 0;
const phaseCounts = {};

for (const file of entries) {
  if (!file.endsWith('.txt')) continue;
  const numStr = file.slice(0, -4);
  const level = Number(numStr);
  if (!Number.isInteger(level) || level < 0 || level > 20000) continue;

  // Level 20000 (Final Boss) stays in Phase 1 root
  if (level === 20000) {
    keptInRoot++;
    continue;
  }

  const offsetInTier = level % 1000; // 0 .. 999
  const phaseNum = Math.floor(offsetInTier / SLOTS_PER_PHASE) + 1; // 1 .. 20

  if (phaseNum === 1) {
    // offset 0 .. 49 -> keep in root (Phase 1)
    keptInRoot++;
  } else {
    const phaseKey = `phase${phaseNum}`;
    const srcPath = path.join(HOUSES_DIR, file);
    const destPath = path.join(FUTURE_WORK_DIR, phaseKey, file);
    fs.renameSync(srcPath, destPath);
    movedToFuture++;
    phaseCounts[phaseKey] = (phaseCounts[phaseKey] || 0) + 1;
  }
}

console.log(`✔ Root (${HOUSES_DIR}) active .txt files kept: ${keptInRoot} (50 per tier × 20 tiers + Lv.20000)`);
console.log(`✔ Moved to ${FUTURE_WORK_DIR}: ${movedToFuture} .txt files across 19 future phases`);
console.log('Phase breakdown:', phaseCounts);
