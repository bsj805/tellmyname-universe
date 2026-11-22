// tests/test_all_features.mjs
// Automated verification suite for mukbang (Issues #1 ~ #7)

import assert from 'node:assert';
import { recommendDailyMeals } from '../src/lib/hash.js';
import { POOLS_BY_MEAL, ALL_FOODS, getFoodByCodeOrId } from '../src/lib/food_dataset.js';
import { getLocalTimeParts, resolveActiveMealByHour, getRemainingUntilMidnight } from '../src/lib/timezone.js';
import { renderFoodIllustrationSvg } from '../src/lib/illustration_svg.js';

console.log('=== [Mukbang] Comprehensive Integration Test Suite ===');

// 1. Data Collection & Cinema items
console.log('\n[Check 1] Food Count & Cinema/Drama Items');
assert(ALL_FOODS.length >= 100, `Expected >= 100 foods, got ${ALL_FOODS.length}`);
const ironman = ALL_FOODS.find(f => f.name.includes('아이언맨'));
const oldboy = ALL_FOODS.find(f => f.name.includes('올드보이'));
const parasite = ALL_FOODS.find(f => f.name.includes('기생충'));
assert(ironman, 'Iron Man cheeseburger must exist');
assert(oldboy, 'Oldboy mandu must exist');
assert(parasite, 'Parasite jjapaguri must exist');
console.log(`✔ Verified Cinema foods: "${ironman.name.slice(0, 30)}..." & "${oldboy.name.slice(0, 30)}..."`);

// 2. Hash Engine & Determinism
console.log('\n[Check 2] Hash Engine Determinism & 5 Meals Deduplication');
const res1 = recommendDailyMeals('김서윤', '2026-11-08', POOLS_BY_MEAL);
const res2 = recommendDailyMeals('김서윤', '2026-11-08', POOLS_BY_MEAL);
assert.strictEqual(res1.name, '김서윤');
assert.strictEqual(res1.date, '2026-11-08');
for (const k of ['breakfast', 'lunch', 'snack', 'dinner', 'night']) {
  assert.strictEqual(res1.meals[k].food.id, res2.meals[k].food.id, `Mismatch on meal ${k}`);
}
const mealIds = Object.values(res1.meals).map(m => m.food.id);
assert.strictEqual(new Set(mealIds).size, 5, 'Daily meals must be completely unique');
console.log('✔ Determinism and 5-meal unique check passed');

// 3. Timezone & Hour resolution
console.log('\n[Check 3] Timezone & Hour Mapping (11:00 -> Lunch)');
const morning = resolveActiveMealByHour(8);
const lunch = resolveActiveMealByHour(11);
const snack = resolveActiveMealByHour(15);
const dinner = resolveActiveMealByHour(19);
const night = resolveActiveMealByHour(23);

assert.strictEqual(morning.key, 'breakfast');
assert.strictEqual(lunch.key, 'lunch', '11:00 must map to lunch (점심)');
assert.strictEqual(snack.key, 'snack');
assert.strictEqual(dinner.key, 'dinner');
assert.strictEqual(night.key, 'night');
console.log('✔ 11:00 maps to Lunch (점심) correctly as requested');

// 4. SVG Illustration Fallback
console.log('\n[Check 4] SVG Illustration Fallback');
const svg = renderFoodIllustrationSvg(ironman);
assert(svg.includes('<svg'), 'Must render valid SVG');
assert(svg.includes('아이언맨'), 'SVG must include food name');
console.log('✔ SVG illustration generator works with zero broken image risk');

console.log('\n========================================');
console.log('🎉 ALL INTEGRATION TESTS PASSED (100%)');
console.log('========================================\n');
