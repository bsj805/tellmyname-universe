// tests/test_worldcup.mjs — Food Ideal Type World Cup Unit, Tournament & SEO SSR Test Suite

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_FOODS } from '../src/lib/food_dataset.js';
import { SUPPORTED_LANG_CODES } from '../src/lib/i18n.js';
import {
  WORLDCUP_CATEGORIES,
  WORLDCUP_ROUND_SIZES,
  filterFoodsByCategory,
  createWorldCupState,
  pickWinner,
  undoPick,
  getRoundLabel,
  parseWorldCupPath
} from '../src/lib/worldcup.js';
import {
  WorldCupController,
  buildWorldCupUrl
} from '../web/js/worldcup.js';
import worker from '../worker.js';
import { createMockEnv } from '../scripts/dev_server.mjs';

console.log('=== [Mukbang] Food Ideal Type World Cup Test Suite ===\n');

// 1. Category counts support 32, 64, 128 rounds
console.log('[Test 1] Category Pools Support 32, 64, 128 Rounds...');
for (const cat of WORLDCUP_CATEGORIES) {
  const pool = filterFoodsByCategory(ALL_FOODS, cat.key);
  assert(pool.length >= 128, `Category ${cat.key} should have >= 128 foods, got ${pool.length}`);
  console.log(`  ✔ ${cat.key}: ${pool.length} foods`);
}

// 2. Randomization & No-Duplicate Seeding
console.log('\n[Test 2] Random Bracket Seeding & Uniqueness...');
for (const roundSize of WORLDCUP_ROUND_SIZES) {
  const s1 = createWorldCupState({ foods: ALL_FOODS, category: 'lunch', mode: 'best', roundSize });
  const s2 = createWorldCupState({ foods: ALL_FOODS, category: 'lunch', mode: 'best', roundSize });
  assert.strictEqual(s1.phase, 'playing');
  assert.strictEqual(s1.initialRoundSize, roundSize);
  assert.strictEqual(s1.matches.length, roundSize / 2);
  assert.strictEqual(s1.totalMatches, roundSize - 1);

  const ids1 = s1.matches.flat().map((f) => f.index);
  const ids2 = s2.matches.flat().map((f) => f.index);
  assert.strictEqual(new Set(ids1).size, roundSize, `All ${roundSize} seeded items must be unique`);
  assert.notStrictEqual(ids1.join(','), ids2.join(','), 'Two random runs should produce different brackets');
}
console.log('  ✔ Verified 32, 64, 128 brackets have unique randomized participants');

// 3. Full Tournament Simulation (Best & Worst) + Undo
console.log('\n[Test 3] Full Tournament Simulation (Best & Worst) & Undo...');
for (const mode of ['best', 'worst']) {
  let state = createWorldCupState({ foods: ALL_FOODS, category: 'dinner', mode, roundSize: 32 });
  assert.strictEqual(getRoundLabel(state.currentRoundSize, 'ko'), '32강');

  // Pick first match, then undo
  const firstLeft = state.matches[0][0];
  state = pickWinner(state, 'left');
  assert.strictEqual(state.completedMatches, 1);
  assert.strictEqual(state.nextRoundPool[0].index, firstLeft.index);

  state = undoPick(state);
  assert.strictEqual(state.completedMatches, 0);
  assert.strictEqual(state.matchIndex, 0);

  // Play all 31 matches to completion
  let steps = 0;
  while (state.phase === 'playing') {
    state = pickWinner(state, steps % 2 === 0 ? 'left' : 'right');
    steps++;
  }
  assert.strictEqual(steps, 31, '32-team tournament must take exactly 31 matches');
  assert.strictEqual(state.phase, 'finished');
  assert(state.winner && state.winner.name, 'Tournament must produce a valid winner');
  console.log(`  ✔ ${mode.toUpperCase()} 32강 completed in 31 matches → Winner: ${state.winner.name}`);
}

// 4. URL Path Parsing & Edge SSR SEO Routes
console.log('\n[Test 4] World Cup SEO Routes & Edge SSR...');
{
  const parsed = parseWorldCupPath('/worldcup/lunch');
  assert.strictEqual(parsed.isWorldCup, true);
  assert.strictEqual(parsed.category, 'lunch');
  assert.strictEqual(parsed.mode, 'best');

  const env = createMockEnv();
  const routesToCheck = [
    { path: '/worldcup', expectedText: '음식 이상형 월드컵' },
    { path: '/worldcup/lunch', expectedText: '오늘의 점심 고르기 이상형 월드컵' },
    { path: '/worldcup/dinner', expectedText: '오늘의 저녁 고르기 이상형 월드컵' },
    { path: '/worldcup/worst', expectedText: '최악의 음식 뽑기 이상형 월드컵' },
    { path: '/en/worldcup/lunch', expectedText: 'Lunch Menu Ideal Type World Cup' }
  ];

  for (const r of routesToCheck) {
    const req = new Request(`https://food.tellmyname.app${r.path}`);
    const res = await worker.fetch(req, env, {});
    assert.strictEqual(res.status, 200, `${r.path} must return 200`);
    const html = await res.text();
    assert(html.includes(r.expectedText), `${r.path} HTML must include "${r.expectedText}"`);
    assert(html.includes('<link rel="canonical"'), `${r.path} must include canonical link`);
    assert(html.includes('hreflang="x-default"'), `${r.path} must include x-default hreflang`);
    assert(html.includes('application/ld+json'), `${r.path} must include JSON-LD`);
    console.log(`  ✔ Verified SSR SEO route: ${r.path}`);
  }
}

// 5. 14-Language WorldCupController Rendering Audit (Zero undefined / Zero Hangul leakage)
console.log('\n[Test 5] 14-Language WorldCupController Setup/Arena/Result Audit...');
{
  for (const lang of SUPPORTED_LANG_CODES) {
    const dictPath = path.resolve('web', 'i18n', 'foods', `${lang}.json`);
    const dict = fs.existsSync(dictPath) ? JSON.parse(fs.readFileSync(dictPath, 'utf8')) : null;
    const mockContainer = {
      innerHTML: '',
      classList: { toggle() {} },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      getBoundingClientRect() { return { top: 0 }; }
    };

    const ctrl = new WorldCupController({ foods: ALL_FOODS, lang, dict });
    ctrl.container = mockContainer;

    // 1. Setup screen
    const setupHtml = ctrl.renderSetupHtml();
    assert(!setupHtml.includes('undefined'), `[${lang}] Setup HTML must not contain "undefined"`);
    assert(!setupHtml.includes('null'), `[${lang}] Setup HTML must not contain "null"`);

    // 2. Arena screen
    ctrl.state = createWorldCupState({ foods: ALL_FOODS, category: 'lunch', mode: 'best', roundSize: 32 });
    const arenaHtml = ctrl.renderArenaHtml();
    assert(!arenaHtml.includes('undefined'), `[${lang}] Arena HTML must not contain "undefined"`);
    assert(!arenaHtml.includes('null'), `[${lang}] Arena HTML must not contain "null"`);
    if (lang !== 'ko') {
      assert(!/\d원/.test(arenaHtml), `[${lang}] Arena HTML must not contain Korean "원" price`);
    }

    // 3. Result screen
    let s = ctrl.state;
    while (s.phase === 'playing') s = pickWinner(s, 'left');
    ctrl.state = s;
    const resultHtml = ctrl.renderResultHtml();
    assert(!resultHtml.includes('undefined'), `[${lang}] Result HTML must not contain "undefined"`);
    assert(!resultHtml.includes('null'), `[${lang}] Result HTML must not contain "null"`);
    if (lang !== 'ko') {
      assert(!/\d원/.test(resultHtml), `[${lang}] Result HTML must not contain Korean "원" price`);
    }
  }
  console.log(`  ✔ Verified all ${SUPPORTED_LANG_CODES.length} languages render Setup/Arena/Result with zero "undefined" and zero "원" leakage`);
}

// 6. Seeded Replay URL Determinism
console.log('\n[Test 6] Seeded Replay URL & Exact Bracket Determinism...');
{
  const a = createWorldCupState({ foods: ALL_FOODS, category: 'dinner', mode: 'worst', roundSize: 64, seed: '777888' });
  const b = createWorldCupState({ foods: ALL_FOODS, category: 'dinner', mode: 'worst', roundSize: 64, seed: '777888' });
  const idsA = a.matches.flat().map((f) => f.index).join(',');
  const idsB = b.matches.flat().map((f) => f.index).join(',');
  assert.strictEqual(idsA, idsB, 'Same seed must produce identical 64-food bracket');

  const url = buildWorldCupUrl('dinner', 'worst', 'en', { roundSize: 64, seed: '777888' });
  assert(url.includes('/worldcup'), 'URL must point to /worldcup');
  assert(url.includes('mode=worst'), 'URL must preserve mode=worst');
  assert(url.includes('cat=dinner'), 'URL must preserve cat=dinner');
  assert(url.includes('round=64'), 'URL must preserve round=64');
  assert(url.includes('seed=777888'), 'URL must preserve seed=777888');
  assert(url.includes('lang=en'), 'URL must preserve lang=en');
  console.log(`  ✔ Verified replay URL: ${url}`);
}

console.log('\n========================================');
console.log('🎉 ALL WORLD CUP TESTS PASSED (100%)');
console.log('========================================');
