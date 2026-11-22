// scripts/collect_all_foods.mjs
// Aggregates foods from all 14 shards:
// - part1 (School, Michelin 3/2/1, Bib Gourmand)
// - part2 (Raw Natural, Unique Specials, Korean Popular)
// - part3 (Cinema, Drama, Pop-culture Specials)
// - part4 (Baemin/Delivery App Standard Categories)
// - part5 (Uber Eats US, Local Breads, Highway Snacks, Frozen Hits, Trail Eats)
// - part6 (World Gourmet Restaurant Cuisines: Italian, Japanese, Indian, Chinese, French, American)
// - part7 (Breakfast Substitutes & Healthy Morning Meals: Misutgaru, Porridges, Oatmeal, Shakes)
// - part8 (Convenience Store Lineup: Triangle Gimbap variations, Cup Noodles, Bento, Hotbars)
// - part9 (World Street Food & Global Desserts: Pad Thai, Banh Mi, Quesadilla, Birria, Churros, Gelato)
// - part10 (Korean Meat, Stew, Seafood, Late-night: Samgyeopsal, Galbi, Gopchang, Gukbap, Steamed Crab)
// - part11 (Famous Korean Noodles, Kalguksu, Bunsik, Tteokbokki, Dumplings)
// - part12 (Rice Bowls, Soba, Stone Pot, Bibimbap, Hangover Gukbap, Roasted Fish)
// - part13 (Cafe Bakery, Pastries, Desserts, Late-night Pocha Bites: Salt Bread, Croffle, Basque Cake)
// - part14 (Global Traditional BBQ & Hot Pot: Churrasco, Asado, Raclette, Motsunabe, Huoguo, Brisket)
// Assigns 1-based index, generates 5-digit code ("00001"..),
// attaches buildIllustrationPrompt, getFoodImageUrl, deliveryCategory, and validates schema with 0 duplicate check.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  FOOD_ORIGIN_GROUPS,
  MEAL_CATEGORIES,
  formatFoodCode,
  buildIllustrationPrompt,
  getFoodImageUrl
} from '../src/lib/constants.js';

import { FOODS_PART_1 } from './data_shards/foods_part1.mjs';
import { FOODS_PART_2 } from './data_shards/foods_part2.mjs';
import { FOODS_PART_3_CINEMA } from './data_shards/foods_part3_cinema.mjs';
import { FOODS_PART_4_DELIVERY } from './data_shards/foods_part4_delivery.mjs';
import { FOODS_PART_5_GLOBAL_LOCAL } from './data_shards/foods_part5_global_and_local.mjs';
import { FOODS_PART_6_WORLD_GOURMET } from './data_shards/foods_part6_world_gourmet.mjs';
import { FOODS_PART_7_BREAKFAST_SUBS } from './data_shards/foods_part7_breakfast_subs.mjs';
import { FOODS_PART_8_CONVENIENCE_STORE } from './data_shards/foods_part8_convenience_store.mjs';
import { FOODS_PART_9_WORLD_STREET_AND_DESSERTS } from './data_shards/foods_part9_world_street_and_desserts.mjs';
import { FOODS_PART_10_MEAT_SEAFOOD_STEW } from './data_shards/foods_part10_meat_seafood_stew.mjs';
import { FOODS_PART_11_NOODLES_AND_BUNSIK } from './data_shards/foods_part11_noodles_and_bunsik.mjs';
import { FOODS_PART_12_RICE_BOWLS_AND_SOUPS } from './data_shards/foods_part12_rice_bowls_and_soups.mjs';
import { FOODS_PART_13_CAFE_BAKERY_AND_NIGHT } from './data_shards/foods_part13_cafe_bakery_and_night.mjs';
import { FOODS_PART_14_GLOBAL_BBQ_AND_POT } from './data_shards/foods_part14_global_bbq_and_pot.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const OUT_RAW_FILE = path.join(DATA_DIR, 'raw_foods_collected.json');

// Default Delivery Category Inferrer based on keywords and originGroup
export function inferDeliveryCategory(raw) {
  if (raw.deliveryCategory) return raw.deliveryCategory;
  const name = raw.name || '';

  if (name.includes('치킨') || name.includes('통닭') || name.includes('닭강정') || name.includes('윙')) return 'CHICKEN';
  if (name.includes('피자') || name.includes('버거') || name.includes('파스타') || name.includes('스테이크') || name.includes('뇨끼') || name.includes('스파게티') || name.includes('립') || name.includes('맥앤치즈')) return 'PIZZA_BURGER';
  if (name.includes('족발') || name.includes('보쌈')) return 'PORK_FEET_BOSSAM';
  if (name.includes('짜장') || name.includes('짬뽕') || name.includes('탕수육') || name.includes('마라') || name.includes('멘보샤')) return 'CHINESE';
  if (name.includes('초밥') || name.includes('스시') || name.includes('돈까스') || name.includes('라멘') || name.includes('사시미') || name.includes('카이센') || name.includes('텐동')) return 'JAPANESE_DON';
  if (name.includes('떡볶이') || name.includes('만두') || name.includes('순대') || name.includes('김밥') || name.includes('토스트') || name.includes('핫도그') || name.includes('소떡') || name.includes('떡꼬치') || name.includes('물떡') || name.includes('계란빵')) return 'BUNSIK';
  if (name.includes('국밥') || name.includes('해장국') || name.includes('설렁탕') || name.includes('곰탕') || name.includes('냉면') || name.includes('칼국수') || name.includes('막국수')) return 'GUKBAP_NOODLE';
  if (name.includes('찌개') || name.includes('찜') || name.includes('탕') || name.includes('전골') || name.includes('백숙')) return 'SOUP_STEW';
  if (name.includes('삼겹살') || name.includes('갈비') || name.includes('곱창') || name.includes('대창') || name.includes('고기') || name.includes('제육') || name.includes('파전')) return 'MEAT_BBQ';
  if (name.includes('생당근') || name.includes('토마토') || name.includes('오이') || name.includes('샐러드') || name.includes('포케') || name.includes('후무스') || name.includes('도토리묵')) return 'SALAD_HEALTH';
  if (name.includes('빙수') || name.includes('붕어빵') || name.includes('과일') || name.includes('소금빵') || name.includes('디저트') || name.includes('케이크') || name.includes('크룽지') || name.includes('요거트') || name.includes('아이스크림') || name.includes('감자빵') || name.includes('잣샌드') || name.includes('황남빵') || name.includes('호두과자') || name.includes('소보로') || name.includes('십원빵') || name.includes('와플')) return 'CAFE_DESSERT';
  if (name.includes('쌀국수') || name.includes('타코') || name.includes('분짜') || name.includes('똠얌꿍') || name.includes('커리') || name.includes('부리또')) return 'ASIAN_WORLD';
  if (name.includes('라면') || name.includes('삼각김밥') || name.includes('핫바') || name.includes('왕교자')) return 'FAST_CONVENIENCE';
  if (name.includes('아이언맨') || name.includes('올드보이') || name.includes('기생충') || name.includes('황해') || name.includes('범죄도시') || name.includes('하울') || name.includes('센과치히로') || name.includes('라따뚜이') || name.includes('펄프픽션') || name.includes('도깨비') || name.includes('대부')) return 'CINEMA_SPECIAL';

  return 'KOREAN_MEAL';
}

export function collectAllFoods() {
  console.log('=== [Mukbang] Food Master Data Collector (Expanded 400~500 Foods) ===');
  console.log(`1. Shard Part 1 (School, Michelin 3/2/1, Bib Gourmand): ${FOODS_PART_1.length} items`);
  console.log(`2. Shard Part 2 (Raw Natural, Unique Specials, Korean Popular): ${FOODS_PART_2.length} items`);
  console.log(`3. Shard Part 3 (Cinema, Drama, Pop-culture Specials): ${FOODS_PART_3_CINEMA.length} items`);
  console.log(`4. Shard Part 4 (Baemin/Delivery App Standard Categories): ${FOODS_PART_4_DELIVERY.length} items`);
  console.log(`5. Shard Part 5 (Uber Eats US, Local Breads, Highway Snacks, Frozen, Trail Eats): ${FOODS_PART_5_GLOBAL_LOCAL.length} items`);
  console.log(`6. Shard Part 6 (World Gourmet Restaurant Cuisines): ${FOODS_PART_6_WORLD_GOURMET.length} items`);
  console.log(`7. Shard Part 7 (Breakfast Substitutes & Porridges): ${FOODS_PART_7_BREAKFAST_SUBS.length} items`);
  console.log(`8. Shard Part 8 (Convenience Store Samgak & Cup Noodles): ${FOODS_PART_8_CONVENIENCE_STORE.length} items`);
  console.log(`9. Shard Part 9 (World Street Food & Global Desserts): ${FOODS_PART_9_WORLD_STREET_AND_DESSERTS.length} items`);
  console.log(`10. Shard Part 10 (Meat, Seafood, Stew & Late-Night Bites): ${FOODS_PART_10_MEAT_SEAFOOD_STEW.length} items`);
  console.log(`11. Shard Part 11 (Famous Noodles, Kalguksu & Bunsik): ${FOODS_PART_11_NOODLES_AND_BUNSIK.length} items`);
  console.log(`12. Shard Part 12 (Rice Bowls, Soba & Soups): ${FOODS_PART_12_RICE_BOWLS_AND_SOUPS.length} items`);
  console.log(`13. Shard Part 13 (Bakery, Cafe & Night Pocha): ${FOODS_PART_13_CAFE_BAKERY_AND_NIGHT.length} items`);
  console.log(`14. Shard Part 14 (Global Traditional BBQ & Hot Pot): ${FOODS_PART_14_GLOBAL_BBQ_AND_POT.length} items`);

  const combined = [
    ...FOODS_PART_1,
    ...FOODS_PART_2,
    ...FOODS_PART_3_CINEMA,
    ...FOODS_PART_4_DELIVERY,
    ...FOODS_PART_5_GLOBAL_LOCAL,
    ...FOODS_PART_6_WORLD_GOURMET,
    ...FOODS_PART_7_BREAKFAST_SUBS,
    ...FOODS_PART_8_CONVENIENCE_STORE,
    ...FOODS_PART_9_WORLD_STREET_AND_DESSERTS,
    ...FOODS_PART_10_MEAT_SEAFOOD_STEW,
    ...FOODS_PART_11_NOODLES_AND_BUNSIK,
    ...FOODS_PART_12_RICE_BOWLS_AND_SOUPS,
    ...FOODS_PART_13_CAFE_BAKERY_AND_NIGHT,
    ...FOODS_PART_14_GLOBAL_BBQ_AND_POT
  ];

  console.log(`Total collected candidates: ${combined.length} items`);

  // Zero-duplicate guarantee validator
  const nameSet = new Set();
  const duplicates = [];
  for (const raw of combined) {
    const cleanName = raw.name.trim();
    if (nameSet.has(cleanName)) {
      duplicates.push(cleanName);
    }
    nameSet.add(cleanName);
  }
  if (duplicates.length > 0) {
    console.error(`FATAL: Duplicate food names detected (${duplicates.length}):`, duplicates);
    throw new Error(`Duplicate food names found: ${duplicates.join(', ')}`);
  }
  console.log(`[Validation PASSED] 0 Duplicates detected! Exactly ${nameSet.size} unique food items.`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const validMealKeys = new Set(MEAL_CATEGORIES.map(m => m.key));
  const normalizedFoods = [];
  const originCounts = {};
  const deliveryCounts = {};

  for (let i = 0; i < combined.length; i++) {
    const raw = combined[i];
    const index = i + 1;
    const code = formatFoodCode(index);
    const id = `food_${code}`;

    const originInfo = FOOD_ORIGIN_GROUPS[raw.originGroup] || FOOD_ORIGIN_GROUPS.KOREAN_POPULAR;
    originCounts[originInfo.id] = (originCounts[originInfo.id] || 0) + 1;

    const deliveryCategory = inferDeliveryCategory(raw);
    deliveryCounts[deliveryCategory] = (deliveryCounts[deliveryCategory] || 0) + 1;

    let candidateMeals = Array.isArray(raw.candidateMeals)
      ? raw.candidateMeals.filter(k => validMealKeys.has(k))
      : ['lunch'];
    if (candidateMeals.length === 0) candidateMeals = ['lunch'];

    const primaryMeal = validMealKeys.has(raw.primaryMeal) ? raw.primaryMeal : candidateMeals[0];

    const foodItem = {
      index,
      code,
      id,
      name: raw.name.trim(),
      englishName: (raw.englishName || raw.name).trim(),
      originGroup: originInfo.id,
      originLabel: originInfo.label,
      originBadge: originInfo.badge,
      deliveryCategory,
      emoji: raw.emoji || originInfo.emoji || '🍽️',
      candidateMeals,
      primaryMeal,
      calories: raw.calories || '500 kcal',
      priceRange: raw.priceRange || '10,000원',
      tagline: raw.tagline || raw.name,
      funComment: raw.funComment || '',
      pairingTip: raw.pairingTip || '',
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      illustrationPrompt: buildIllustrationPrompt(raw.name),
      imageUrl: getFoodImageUrl(index, false),
      imageUrlAbsolute: getFoodImageUrl(index, true)
    };

    normalizedFoods.push(foodItem);
  }

  fs.writeFileSync(OUT_RAW_FILE, JSON.stringify(normalizedFoods, null, 2), 'utf-8');
  console.log(`Saved ${normalizedFoods.length} normalized food items to: ${OUT_RAW_FILE}`);

  console.log('\n--- Origin Group Distribution ---');
  for (const [key, count] of Object.entries(originCounts)) {
    console.log(`  ${key}: ${count}`);
  }

  console.log('\n--- Delivery Category Distribution ---');
  for (const [cat, count] of Object.entries(deliveryCounts)) {
    console.log(`  ${cat}: ${count}`);
  }

  return normalizedFoods;
}

if (process.argv[1] && process.argv[1].endsWith('collect_all_foods.mjs')) {
  collectAllFoods();
}
