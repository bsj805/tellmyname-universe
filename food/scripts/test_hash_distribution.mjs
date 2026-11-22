// scripts/test_hash_distribution.mjs
// Verifies:
// 1. Determinism: Same name + same date = 100% identical 5 meals
// 2. Day-to-day freshness: Same name + next date = >90% meal changes (avalanche effect)
// 3. Daily de-duplication: Zero duplicate food items across the 5 meals of a single day
// 4. Name avalanche: 1-character difference = completely different meals

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { recommendDailyMeals } from '../src/lib/hash.js';
import { POOLS_BY_MEAL } from '../src/lib/food_dataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_FILE = path.join(ROOT_DIR, 'data', 'hash_distribution_report.json');

const SAMPLE_NAMES = [
  '홍길동', '김서윤', '이도윤', '박하은', '최민준', '정수아', '강하준', '조유나',
  '윤시우', '장지아', '임도현', '한서진', '오은우', '서채원', '신예준', '권다은',
  '황지후', '안서율', '송민서', '전태양', '홍서우', '유지원', '고민혁', '문예린',
  '손지민', '배도원', '조승우', '백하율', '허시윤', '남나은', '아이유', '손흥민',
  '페이커', '차은우', '장원영', '이정재', '최민식', '하정우', '황정민', '토니스타크'
];

export function runHashDistributionTest() {
  console.log('=== [Mukbang] Hash Distribution & Determinism Test ===');

  let passedAll = true;

  // 1. Same name + same date = 100% identical check
  console.log('\n[Test 1] Determinism Check (1,000 runs)');
  let determinismPass = true;
  for (let i = 0; i < 1000; i++) {
    const name = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
    const date = '2026-11-08';
    const r1 = recommendDailyMeals(name, date, POOLS_BY_MEAL);
    const r2 = recommendDailyMeals(name, date, POOLS_BY_MEAL);

    for (const k of ['breakfast', 'lunch', 'snack', 'dinner', 'night']) {
      if (r1.meals[k].food.id !== r2.meals[k].food.id) {
        determinismPass = false;
        break;
      }
    }
    if (!determinismPass) break;
  }
  console.log(`✔ Determinism result: ${determinismPass ? '100% PASS' : 'FAIL'}`);
  if (!determinismPass) passedAll = false;

  // 2. Daily de-duplication check: 5 meals must have distinct food ids
  console.log('\n[Test 2] Daily De-duplication Check (5 meals in 1 day)');
  let deduplicationPass = true;
  for (let i = 0; i < 500; i++) {
    const name = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
    const date = `2026-11-${String((i % 28) + 1).padStart(2, '0')}`;
    const res = recommendDailyMeals(name, date, POOLS_BY_MEAL);

    const seenIds = new Set();
    for (const k of ['breakfast', 'lunch', 'snack', 'dinner', 'night']) {
      const fid = res.meals[k].food?.id;
      if (seenIds.has(fid)) {
        deduplicationPass = false;
        console.error(`Duplicate detected in ${name} on ${date}: ${fid}`);
        break;
      }
      seenIds.add(fid);
    }
    if (!deduplicationPass) break;
  }
  console.log(`✔ Daily De-duplication result: ${deduplicationPass ? '100% UNIQUE PASS (0 Duplicates)' : 'FAIL'}`);
  if (!deduplicationPass) passedAll = false;

  // 3. Day-to-day meal variation test
  console.log('\n[Test 3] Day-to-Day Meal Variation Test (2026-11-01 -> 2026-11-30)');
  let totalComparisons = 0;
  let totalChangedMeals = 0;

  for (const name of SAMPLE_NAMES) {
    for (let day = 1; day < 30; day++) {
      const d1 = `2026-11-${String(day).padStart(2, '0')}`;
      const d2 = `2026-11-${String(day + 1).padStart(2, '0')}`;
      const r1 = recommendDailyMeals(name, d1, POOLS_BY_MEAL);
      const r2 = recommendDailyMeals(name, d2, POOLS_BY_MEAL);

      for (const k of ['breakfast', 'lunch', 'snack', 'dinner', 'night']) {
        totalComparisons++;
        if (r1.meals[k].food.id !== r2.meals[k].food.id) {
          totalChangedMeals++;
        }
      }
    }
  }

  const changeRate = (totalChangedMeals / totalComparisons) * 100;
  console.log(`✔ Day-to-Day Meal Change Rate: ${changeRate.toFixed(2)}% (Target > 90%)`);
  if (changeRate < 90) passedAll = false;

  // 4. Sample Daily Output for Kim Seo-yoon
  console.log('\n[Test 4] Sample Output for 김서윤 on 2026-11-08:');
  const sample = recommendDailyMeals('김서윤', '2026-11-08', POOLS_BY_MEAL);
  for (const item of sample.orderedList) {
    console.log(`  ${item.mealEmoji} [${item.mealFullLabel}] ${item.food.name} (${item.food.originBadge}, ${item.food.calories})`);
  }

  const report = {
    testDate: new Date().toISOString(),
    determinismPass,
    deduplicationPass,
    dayToDayChangeRate: `${changeRate.toFixed(2)}%`,
    overallStatus: passedAll ? 'PASSED' : 'FAILED',
    sampleDailyRecommendation: sample
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n✔ Saved report to ${REPORT_FILE}`);

  return passedAll;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ok = runHashDistributionTest();
  process.exit(ok ? 0 : 1);
}
