// tests/test_gallery.mjs — Comprehensive Unit Tests for gallery.js
import assert from 'node:assert';
import {
  GALLERY_CATEGORIES,
  matchesCategory,
  filterFoods,
  pickRandomFood,
  getFoodByCode,
  parseRoute,
  buildGalleryUrl,
  buildFoodUrl
} from '../web/js/gallery.js';

import {
  ALL_FOODS,
  FOODS_BY_CODE
} from '../src/lib/food_dataset.js';

console.log('=== [Mukbang] Illustration Gallery & Random Picker Test Suite ===\n');

// 1. Verify Category Definitions
console.log('[Check 1] Category Definitions Completeness');
assert(Array.isArray(GALLERY_CATEGORIES), 'GALLERY_CATEGORIES must be an array');
assert.strictEqual(GALLERY_CATEGORIES.length, 23, 'Must define exactly 23 categories (all + 5 meals + 7 origins + 10 delivery)');

const expectedGroups = {
  all: 1,
  meal: 5,
  origin: 7,
  delivery: 10
};

const actualGroupCounts = {};
for (const cat of GALLERY_CATEGORIES) {
  assert(cat.key, `Category missing key: ${JSON.stringify(cat)}`);
  assert(cat.label, `Category ${cat.key} missing label`);
  assert(cat.emoji, `Category ${cat.key} missing emoji`);
  actualGroupCounts[cat.group] = (actualGroupCounts[cat.group] || 0) + 1;
}

assert.deepStrictEqual(actualGroupCounts, expectedGroups, 'Category group counts must match specification');
console.log('✔ Verified all 23 category filters across meals (5), origins (7), and delivery categories (10)');

// 2. Verify Every Category Matches Real Foods in Dataset
console.log('\n[Check 2] Dataset Coverage for Each Category Filter');
for (const cat of GALLERY_CATEGORIES) {
  const matches = ALL_FOODS.filter(f => matchesCategory(f, cat.key));
  assert(matches.length > 0, `Category ${cat.key} must match at least 1 food in dataset (got 0)`);
  if (cat.key === 'all') {
    assert.strictEqual(matches.length, ALL_FOODS.length, 'Category "all" must match 100% of foods');
  }
}
console.log(`✔ All 23 categories have active foods in the 401-food catalog`);

// 3. Category Random 100 Runs Test (Acceptance Criteria #14)
console.log('\n[Check 3] Category Random Conformance (100 Runs per Category)');
for (const cat of GALLERY_CATEGORIES) {
  for (let i = 0; i < 100; i++) {
    const picked = pickRandomFood({
      foods: ALL_FOODS,
      category: cat.key,
      lang: 'ko'
    });
    assert(picked, `pickRandomFood for ${cat.key} iteration ${i} returned null`);
    const rawFood = getFoodByCode(picked.code || picked.index, ALL_FOODS);
    assert(rawFood, `Picked food code ${picked.code} not found in catalog`);
    assert(
      matchesCategory(rawFood, cat.key),
      `Picked food "${rawFood.name}" does NOT match category "${cat.key}" on iteration ${i}`
    );
  }
}
console.log('✔ 100 random picks across all 23 categories strictly adhered to chosen category (2,300 runs passed)');

// 4. Multilingual & Multi-Field Search Matching
console.log('\n[Check 4] Multi-Field Live Search Verification');
{
  // A: Search Korean name
  const resKo = filterFoods({ foods: ALL_FOODS, searchQuery: '떡볶이' });
  assert(resKo.length > 0, 'Search for "떡볶이" must return results');
  for (const f of resKo) {
    const matches = f.name.includes('떡볶이') || (f.rawName && f.rawName.includes('떡볶이'));
    assert(matches, `Result "${f.name}" must contain "떡볶이"`);
  }

  // B: Search English name
  const resEn = filterFoods({ foods: ALL_FOODS, searchQuery: 'Spaghetti' });
  assert(resEn.length > 0, 'Search for "Spaghetti" must return results');
  for (const f of resEn) {
    const matches = (f.englishName && f.englishName.toLowerCase().includes('spaghetti')) || f.name.toLowerCase().includes('spaghetti');
    assert(matches, `Result "${f.name}" / "${f.englishName}" must match "spaghetti"`);
  }

  // C: Case-insensitivity
  const resCase1 = filterFoods({ foods: ALL_FOODS, searchQuery: 'pasta' });
  const resCase2 = filterFoods({ foods: ALL_FOODS, searchQuery: 'PASTA' });
  assert.strictEqual(resCase1.length, resCase2.length, 'Search must be case-insensitive');
  assert(resCase1.length > 0, 'Search for "pasta" must find items');

  // D: Category + Search combined
  const resCombined = filterFoods({
    foods: ALL_FOODS,
    category: 'delivery:chicken',
    searchQuery: '치킨'
  });
  assert(resCombined.length > 0, 'Chicken category + 치킨 search must return matches');
  for (const f of resCombined) {
    assert.strictEqual(f.deliveryCategory, 'CHICKEN', 'All combined results must be in CHICKEN category');
  }
  console.log('✔ Live search correctly matches Korean names, English names, and combined category filters');
}

// 5. Route Parsing & PushState URL Builders
console.log('\n[Check 5] Route Parsing & URL State Builders');
{
  assert.deepStrictEqual(parseRoute('/'), { view: 'home' });
  assert.deepStrictEqual(parseRoute('/?lang=ja'), { view: 'home' });
  assert.deepStrictEqual(parseRoute('/gallery'), { view: 'gallery' });
  assert.deepStrictEqual(parseRoute('/gallery?cat=meal:lunch'), { view: 'gallery' });
  assert.deepStrictEqual(parseRoute('/food/00116'), { view: 'food', code: '00116' });
  assert.deepStrictEqual(parseRoute('/food/1'), { view: 'food', code: '00001' }, 'Short code must format to 5 digits');
  assert.deepStrictEqual(parseRoute('/food/00042?lang=fr'), { view: 'food', code: '00042' });

  // URL builders
  assert.strictEqual(buildGalleryUrl('delivery:pizza_burger', 'ko'), '/gallery?cat=delivery%3Apizza_burger');
  assert.strictEqual(buildGalleryUrl('all', 'ja'), '/gallery?lang=ja');
  assert.strictEqual(buildFoodUrl('00116', 'ko'), '/food/00116');
  assert.strictEqual(buildFoodUrl(42, 'en'), '/food/00042?lang=en');
  console.log('✔ Client route parsing and URL builders work across all views');
}

// 6. Food Detail Code Lookup & Metadata Integrity
console.log('\n[Check 6] getFoodByCode Lookup & Integrity');
{
  const food116 = getFoodByCode('00116', ALL_FOODS);
  assert(food116, 'Food #00116 must be found');
  assert.strictEqual(food116.code, '00116');
  assert(food116.name, 'Food must have a name');
  assert(food116.originGroup, 'Food must have an origin group');
  assert(food116.tagline, 'Food must have a tagline');

  const food1 = getFoodByCode(1, ALL_FOODS);
  assert(food1, 'Food #1 must be found');
  assert.strictEqual(food1.code, '00001');

  const missing = getFoodByCode('99999', ALL_FOODS);
  assert.strictEqual(missing, null, 'Non-existent code must return null');
  console.log('✔ getFoodByCode retrieves foods by string code or numeric index');
}

console.log('\n========================================');
console.log('🎉 ALL GALLERY UNIT TESTS PASSED (100%)');
console.log('========================================');
