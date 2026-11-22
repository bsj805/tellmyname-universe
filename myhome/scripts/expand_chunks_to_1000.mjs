// scripts/expand_chunks_to_1000.mjs
// Pairwise Tier-Preserving Level Expansion (0..499 -> 0..999)
// Expands 500 existing houses into 1,000 houses (50 items x 20 chunks).

import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.resolve('data/chunks_backup_500');
const TARGET_CHUNKS_DIR = path.resolve('data/chunks');
const CURATED_NEW_FILE = path.resolve('data/curated_new_500_houses.json');
const MIGRATION_MAP_FILE = path.resolve('data/level_migration_500_to_1000.json');

export const TIER_NAMES = {
  1: 'Tier 01: 태초의 밑바닥',
  2: 'Tier 02: 폐허와 슬럼가',
  3: 'Tier 03: 기괴한 고물과 상자',
  4: 'Tier 04: 극한 오지 변소와 방사능',
  5: 'Tier 05: 폐쇄 구역과 감옥',
  6: 'Tier 06: 애니·영화 속 굴욕의 거처',
  7: 'Tier 07: 위험천만 이동식 쉘터',
  8: 'Tier 08: 늪지대와 침수 구역',
  9: 'Tier 09: 고립된 사막과 얼음 굴',
  10: 'Tier 10: 폭망의 문턱 턱걸이',
  11: 'Tier 11: 대박 입문 힐링 샬레',
  12: 'Tier 12: 세계 역사 고성과 랜드마크',
  13: 'Tier 13: 픽사·디즈니 애니메이션 명소',
  14: 'Tier 14: 세계 초일류 도심 펜트하우스',
  15: 'Tier 15: 판타지 영화와 문학의 성채',
  16: 'Tier 16: 세계 7대 불가사의와 비경',
  17: 'Tier 17: 미래 스마트 도시와 슈퍼요트',
  18: 'Tier 18: 신화와 전설의 황금 궁전',
  19: 'Tier 19: SF 궤도 스테이션과 콜로니',
  20: 'Tier 20: 우주 초월 다이슨 스피어'
};

export const SITE_ORIGIN = 'https://myhome.tellmyname.app';

function pad5(num) {
  return String(num).padStart(5, '0');
}

export function runExpansion() {
  console.log('=== Starting 1,000-Level Chunks & Migration Map Generation ===');

  // 1. Read the 500 existing items from backup chunks
  console.log(`Reading existing 500 items from ${BACKUP_DIR}...`);
  const existing500 = [];
  for (let c = 0; c < 20; c++) {
    const chunkFile = path.join(BACKUP_DIR, `houses-chunk-${String(c).padStart(2, '0')}.json`);
    if (!fs.existsSync(chunkFile)) {
      throw new Error(`Backup chunk file missing: ${chunkFile}`);
    }
    const items = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
    existing500.push(...items);
  }

  if (existing500.length !== 500) {
    throw new Error(`Expected exactly 500 existing items in backup, found ${existing500.length}`);
  }

  // Ensure sorted by level
  existing500.sort((a, b) => a.level - b.level);
  for (let i = 0; i < 500; i++) {
    if (existing500[i].level !== i) {
      throw new Error(`Level index mismatch at backup item ${i}: level=${existing500[i].level}`);
    }
  }
  console.log('Successfully verified 500 existing items strictly ordered 0..499.');

  // 2. Read the curated 500 new items
  console.log(`Reading curated 500 new items from ${CURATED_NEW_FILE}...`);
  if (!fs.existsSync(CURATED_NEW_FILE)) {
    throw new Error(`Curated file missing: ${CURATED_NEW_FILE}`);
  }
  const curated = JSON.parse(fs.readFileSync(CURATED_NEW_FILE, 'utf8'));
  const { new_real_bad, new_fic_bad, new_real_good, new_fic_good } = curated;

  if (new_real_bad.length !== 125 || new_fic_bad.length !== 125 ||
      new_real_good.length !== 125 || new_fic_good.length !== 125) {
    throw new Error(`Expected exactly 125 items in each of the 4 quadrants, got: ` +
      `real_bad=${new_real_bad.length}, fic_bad=${new_fic_bad.length}, ` +
      `real_good=${new_real_good.length}, fic_good=${new_fic_good.length}`);
  }
  console.log('Verified 125 items in each of the 4 quadrants (500 new items total).');

  // 3. Construct 1,000 items according to Pairwise Tier-Preserving Level Re-adjustment
  console.log('Executing Pairwise Tier-Preserving Level Re-adjustment (0..499 -> 0..999)...');
  const items1000 = new Array(1000);
  const renameOperations = [];
  const newTxtFilesToCreate = [];

  // Helper to format an item for level L
  const COPYRIGHT_SUFFIX = 'I am not asking for an exact replica. Please first define the key elements to avoid copyright infringement, and then implement those elements.';
  function sanitizeImagePrompt(prompt) {
    let p = String(prompt || '').replace(/\s*\(?Lv\.\s*\d+\)?/gi, '').replace(/\s{2,}/g, ' ').trim();
    if (p && !p.endsWith(COPYRIGHT_SUFFIX)) {
      p = `${p} ${COPYRIGHT_SUFFIX}`;
    }
    return p;
  }

  function formatItem(raw, newLv, isExisting, oldLv = null) {
    const tier = Math.floor(newLv / 50) + 1;
    const tierName = TIER_NAMES[tier];
    const zone = newLv < 500 ? 'BAD' : 'GOOD';
    const zoneLabel = newLv < 500 ? '폭망 하우스' : '대박 하우스';
    const realityType = newLv % 2 === 0 ? 'REAL' : 'FICTION';
    const realityLabel = newLv % 2 === 0 ? '실제 존재하는 건축물·사물' : '허구·상상 속 건축물·사물';
    const padded = pad5(newLv);
    const cleanPrompt = sanitizeImagePrompt(raw.geminiImagePrompt);

    const formatted = {
      title: raw.title,
      category: raw.category,
      categoryLabel: raw.categoryLabel,
      categoryEmoji: raw.categoryEmoji,
      realityType,
      realityLabel,
      zone,
      zoneLabel,
      tier,
      tierName,
      builtYear: raw.builtYear,
      estimatedValue: raw.estimatedValue,
      specialFeature: raw.specialFeature,
      aiVerdict: raw.aiVerdict,
      geminiImagePrompt: cleanPrompt,
      level: newLv,
      newLevel: newLv,
      r2Key: `houses/${padded}.webp`,
      imageUrl: `/r2/houses/${padded}.webp`,
      ogImageUrl: `${SITE_ORIGIN}/r2/houses/${padded}.webp`,
      aiModel: 'gemini-3.8-flash'
    };

    if (isExisting) {
      formatted.originalLevel = raw.originalLevel ?? oldLv;
      formatted.previousLevel = oldLv;
    } else {
      formatted.isNewExpansion = true;
    }

    return formatted;
  }

  // Iterate over 250 pairs (p = 0 .. 249)
  for (let p = 0; p < 250; p++) {
    if (p < 249) {
      // For p = 0 .. 248:
      // 1) newLv = 4*p (Even, REAL): Existing item from oldLv = 2*p
      const oldEven = 2 * p;
      const newLvEven = 4 * p;
      const existingEven = existing500[oldEven];
      items1000[newLvEven] = formatItem(existingEven, newLvEven, true, oldEven);
      renameOperations.push({
        oldLevel: oldEven,
        newLevel: newLvEven,
        oldPadded: pad5(oldEven),
        newPadded: pad5(newLvEven),
        oldPng: `${pad5(oldEven)}.png`,
        newPng: `${pad5(newLvEven)}.png`,
        oldTxt: `${pad5(oldEven)}.txt`,
        newTxt: `${pad5(newLvEven)}.txt`,
        title: existingEven.title,
        realityType: 'REAL',
        zone: newLvEven < 500 ? 'BAD' : 'GOOD'
      });

      // 2) newLv = 4*p + 1 (Odd, FICTION): Existing item from oldLv = 2*p + 1
      const oldOdd = 2 * p + 1;
      const newLvOdd = 4 * p + 1;
      const existingOdd = existing500[oldOdd];
      items1000[newLvOdd] = formatItem(existingOdd, newLvOdd, true, oldOdd);
      renameOperations.push({
        oldLevel: oldOdd,
        newLevel: newLvOdd,
        oldPadded: pad5(oldOdd),
        newPadded: pad5(newLvOdd),
        oldPng: `${pad5(oldOdd)}.png`,
        newPng: `${pad5(newLvOdd)}.png`,
        oldTxt: `${pad5(oldOdd)}.txt`,
        newTxt: `${pad5(newLvOdd)}.txt`,
        title: existingOdd.title,
        realityType: 'FICTION',
        zone: newLvOdd < 500 ? 'BAD' : 'GOOD'
      });

      // 3) newLv = 4*p + 2 (Even, REAL): Brand-new curated REAL house
      const newLvReal = 4 * p + 2;
      const newRealSource = p < 125 ? new_real_bad[p] : new_real_good[p - 125];
      items1000[newLvReal] = formatItem(newRealSource, newLvReal, false);
      newTxtFilesToCreate.push({
        newLevel: newLvReal,
        newPadded: pad5(newLvReal),
        txtFilename: `${pad5(newLvReal)}.txt`,
        pngFilename: `${pad5(newLvReal)}.png`,
        title: newRealSource.title,
        realityType: 'REAL',
        zone: newLvReal < 500 ? 'BAD' : 'GOOD',
        category: newRealSource.category,
        geminiImagePrompt: newRealSource.geminiImagePrompt
      });

      // 4) newLv = 4*p + 3 (Odd, FICTION): Brand-new curated FICTION house
      const newLvFic = 4 * p + 3;
      const newFicSource = p < 125 ? new_fic_bad[p] : new_fic_good[p - 125];
      items1000[newLvFic] = formatItem(newFicSource, newLvFic, false);
      newTxtFilesToCreate.push({
        newLevel: newLvFic,
        newPadded: pad5(newLvFic),
        txtFilename: `${pad5(newLvFic)}.txt`,
        pngFilename: `${pad5(newLvFic)}.png`,
        title: newFicSource.title,
        realityType: 'FICTION',
        zone: newLvFic < 500 ? 'BAD' : 'GOOD',
        category: newFicSource.category,
        geminiImagePrompt: newFicSource.geminiImagePrompt
      });
    } else {
      // Final pair p = 249 (newLv = 996, 997, 998, 999):
      // newLv = 996 (Even, REAL): Existing item from oldLv = 498
      const old498 = 498;
      const newLv996 = 996;
      const existing498 = existing500[old498];
      items1000[newLv996] = formatItem(existing498, newLv996, true, old498);
      renameOperations.push({
        oldLevel: old498,
        newLevel: newLv996,
        oldPadded: pad5(old498),
        newPadded: pad5(newLv996),
        oldPng: `${pad5(old498)}.png`,
        newPng: `${pad5(newLv996)}.png`,
        oldTxt: `${pad5(old498)}.txt`,
        newTxt: `${pad5(newLv996)}.txt`,
        title: existing498.title,
        realityType: 'REAL',
        zone: 'GOOD'
      });

      // newLv = 997 (Odd, FICTION): Brand-new curated FICTION house (item 124 of new_fic_good)
      const newLv997 = 997;
      const newFicSupreme = new_fic_good[124];
      items1000[newLv997] = formatItem(newFicSupreme, newLv997, false);
      newTxtFilesToCreate.push({
        newLevel: newLv997,
        newPadded: pad5(newLv997),
        txtFilename: `${pad5(newLv997)}.txt`,
        pngFilename: `${pad5(newLv997)}.png`,
        title: newFicSupreme.title,
        realityType: 'FICTION',
        zone: 'GOOD',
        category: newFicSupreme.category,
        geminiImagePrompt: newFicSupreme.geminiImagePrompt
      });

      // newLv = 998 (Even, REAL): Brand-new curated REAL house (item 124 of new_real_good)
      const newLv998 = 998;
      const newRealSupreme = new_real_good[124];
      items1000[newLv998] = formatItem(newRealSupreme, newLv998, false);
      newTxtFilesToCreate.push({
        newLevel: newLv998,
        newPadded: pad5(newLv998),
        txtFilename: `${pad5(newLv998)}.txt`,
        pngFilename: `${pad5(newLv998)}.png`,
        title: newRealSupreme.title,
        realityType: 'REAL',
        zone: 'GOOD',
        category: newRealSupreme.category,
        geminiImagePrompt: newRealSupreme.geminiImagePrompt
      });

      // newLv = 999 (Odd, FICTION): Existing item from oldLv = 499 (ultimate pinnacle)
      const old499 = 499;
      const newLv999 = 999;
      const existing499 = existing500[old499];
      items1000[newLv999] = formatItem(existing499, newLv999, true, old499);
      renameOperations.push({
        oldLevel: old499,
        newLevel: newLv999,
        oldPadded: pad5(old499),
        newPadded: pad5(newLv999),
        oldPng: `${pad5(old499)}.png`,
        newPng: `${pad5(newLv999)}.png`,
        oldTxt: `${pad5(old499)}.txt`,
        newTxt: `${pad5(newLv999)}.txt`,
        title: existing499.title,
        realityType: 'FICTION',
        zone: 'GOOD'
      });
    }
  }

  // 4. Validate all 1,000 items
  console.log('Validating expanded 1,000 items...');
  if (items1000.length !== 1000) {
    throw new Error(`Expected 1,000 items, got ${items1000.length}`);
  }
  for (let i = 0; i < 1000; i++) {
    const it = items1000[i];
    if (!it) {
      throw new Error(`Missing item at level ${i}`);
    }
    if (it.level !== i || it.newLevel !== i) {
      throw new Error(`Level mismatch at index ${i}: level=${it.level}, newLevel=${it.newLevel}`);
    }
    const expectedParity = i % 2 === 0 ? 'REAL' : 'FICTION';
    if (it.realityType !== expectedParity) {
      throw new Error(`Parity mismatch at level ${i}: expected ${expectedParity}, got ${it.realityType}`);
    }
    const expectedZone = i < 500 ? 'BAD' : 'GOOD';
    if (it.zone !== expectedZone) {
      throw new Error(`Zone mismatch at level ${i}: expected ${expectedZone}, got ${it.zone}`);
    }
    const expectedTier = Math.floor(i / 50) + 1;
    if (it.tier !== expectedTier) {
      throw new Error(`Tier mismatch at level ${i}: expected ${expectedTier}, got ${it.tier}`);
    }
    if (it.tierName !== TIER_NAMES[expectedTier]) {
      throw new Error(`TierName mismatch at level ${i}`);
    }
    const expectedKey = `houses/${pad5(i)}.webp`;
    if (it.r2Key !== expectedKey) {
      throw new Error(`r2Key mismatch at level ${i}: expected ${expectedKey}, got ${it.r2Key}`);
    }
  }

  // Check unique titles across all 1,000 items
  const allTitles = items1000.map(x => x.title);
  const uniqueTitles = new Set(allTitles);
  if (uniqueTitles.size !== 1000) {
    const dupes = allTitles.filter((t, idx) => allTitles.indexOf(t) !== idx);
    throw new Error(`Found ${1000 - uniqueTitles.size} duplicate titles in 1,000 items: ${dupes.join(', ')}`);
  }
  console.log('All 1,000 items validated: 100% unique titles, perfect parity, perfect tiers, perfect zones!');

  // 5. Partition into 20 chunks (50 items each) and write to data/chunks/
  console.log(`Writing 20 chunk files to ${TARGET_CHUNKS_DIR} (50 items per chunk)...`);
  for (let c = 0; c < 20; c++) {
    const chunkItems = items1000.slice(c * 50, (c + 1) * 50);
    if (chunkItems.length !== 50) {
      throw new Error(`Chunk ${c} has ${chunkItems.length} items instead of 50`);
    }
    const chunkFileName = `houses-chunk-${String(c).padStart(2, '0')}.json`;
    const chunkPath = path.join(TARGET_CHUNKS_DIR, chunkFileName);
    fs.writeFileSync(chunkPath, JSON.stringify(chunkItems, null, 2), 'utf8');
  }
  console.log('Successfully wrote 20 expanded chunk files (houses-chunk-00.json .. houses-chunk-19.json).');

  // 6. Sort rename operations in DESCENDING order (oldLevel: 499 -> 0)
  renameOperations.sort((a, b) => b.oldLevel - a.oldLevel);
  if (renameOperations.length !== 500) {
    throw new Error(`Expected 500 rename operations, got ${renameOperations.length}`);
  }

  // Sort newTxtFilesToCreate in ascending order (0 -> 999)
  newTxtFilesToCreate.sort((a, b) => a.newLevel - b.newLevel);
  if (newTxtFilesToCreate.length !== 500) {
    throw new Error(`Expected 500 new txt files to create, got ${newTxtFilesToCreate.length}`);
  }

  // 7. Generate migration map JSON
  const migrationManifest = {
    summary: {
      oldTotal: 500,
      newTotal: 1000,
      existingRenamedCount: renameOperations.length,
      newCreatedCount: newTxtFilesToCreate.length,
      chunksCount: 20,
      itemsPerChunk: 50,
      badZoneLevels: '0..499 (Chunks 00..09)',
      goodZoneLevels: '500..999 (Chunks 10..19)',
      rule: 'Even=REAL, Odd=FICTION, Pairwise Tier-Preserving',
      collisionFreeRenameOrder: 'Descending by oldLevel (499 down to 0)'
    },
    renameOperations,
    newTxtFilesToCreate
  };

  fs.writeFileSync(MIGRATION_MAP_FILE, JSON.stringify(migrationManifest, null, 2), 'utf8');
  console.log(`Successfully generated ${MIGRATION_MAP_FILE}!`);

  return {
    totalItems: items1000.length,
    renameCount: renameOperations.length,
    newCount: newTxtFilesToCreate.length
  };
}

// Execute if run as CLI script
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  try {
    const res = runExpansion();
    console.log('Expansion Completed Successfully:', res);
  } catch (err) {
    console.error('Expansion Failed:', err);
    process.exit(1);
  }
}
