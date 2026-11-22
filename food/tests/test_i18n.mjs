// tests/test_i18n.mjs — Comprehensive Unit Tests for i18n Engine
import assert from 'node:assert';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANG_CODES,
  UI_STRINGS,
  normalizeLang,
  detectLanguage,
  t,
  localizeFood
} from '../src/lib/i18n.js';

console.log('=== [Mukbang] i18n Engine & UI Strings Test Suite ===\n');

// 1. Verify 14 Supported Languages
console.log('[Check 1] Supported Languages Count & Metadata');
assert.strictEqual(SUPPORTED_LANGUAGES.length, 14, 'Must support exactly 14 languages');
const expectedCodes = ['ko', 'en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
assert.deepStrictEqual(SUPPORTED_LANG_CODES, expectedCodes, 'Language codes must match 14 target languages in order');

for (const langObj of SUPPORTED_LANGUAGES) {
  assert(langObj.code, `Language missing code: ${JSON.stringify(langObj)}`);
  assert(langObj.native, `Language ${langObj.code} missing native name`);
  assert(langObj.flag, `Language ${langObj.code} missing flag`);
  assert(langObj.locale, `Language ${langObj.code} missing locale`);
  assert(Array.isArray(langObj.sampleNames), `Language ${langObj.code} missing sampleNames array`);
  assert.strictEqual(langObj.sampleNames.length, 6, `Language ${langObj.code} must have 6 sampleNames`);
  for (const name of langObj.sampleNames) {
    assert(typeof name === 'string' && name.trim().length > 0, `Language ${langObj.code} has invalid sampleName: ${name}`);
  }
}
console.log('✔ Verified all 14 languages metadata and 6 sample names each');

// 2. Verify UI_STRINGS key completeness across all 14 languages
console.log('\n[Check 2] UI_STRINGS Key Completeness & Zero Hangul in Non-ko');
const koKeys = Object.keys(UI_STRINGS.ko);
assert(koKeys.length >= 100, `Expected at least 100 UI string keys, found ${koKeys.length}`);

const HANGUL_REGEX = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;

for (const code of expectedCodes) {
  assert(UI_STRINGS[code], `UI_STRINGS missing language: ${code}`);
  const currentKeys = Object.keys(UI_STRINGS[code]);
  
  // All keys present
  const missingKeys = koKeys.filter(k => !Object.prototype.hasOwnProperty.call(UI_STRINGS[code], k));
  assert.strictEqual(missingKeys.length, 0, `[${code}] Missing keys: ${missingKeys.join(', ')}`);

  // Extra keys check
  const extraKeys = currentKeys.filter(k => !koKeys.includes(k));
  assert.strictEqual(extraKeys.length, 0, `[${code}] Extra keys: ${extraKeys.join(', ')}`);

  // Check non-empty and no Hangul for non-ko
  for (const [key, val] of Object.entries(UI_STRINGS[code])) {
    assert(typeof val === 'string' && val.trim().length > 0, `[${code}][${key}] String must be non-empty`);
    if (code !== 'ko') {
      assert(!HANGUL_REGEX.test(val), `[${code}][${key}] Contained Hangul: "${val}"`);
    }
  }
}
console.log(`✔ Verified ${koKeys.length} keys in all 14 languages with 0 missing, 0 empty, and 0 Hangul leakage`);

// 3. normalizeLang()
console.log('\n[Check 3] normalizeLang() Tests');
assert.strictEqual(normalizeLang('ko'), 'ko');
assert.strictEqual(normalizeLang('en-US'), 'en');
assert.strictEqual(normalizeLang('JA_JP'), 'ja');
assert.strictEqual(normalizeLang('zh-CN'), 'zh');
assert.strictEqual(normalizeLang('pt-BR'), 'pt');
assert.strictEqual(normalizeLang('ar'), 'ko', 'Unsupported ar must normalize/fallback to ko');
assert.strictEqual(normalizeLang(null), 'ko', 'null must fallback to ko');
assert.strictEqual(normalizeLang(undefined), 'ko', 'undefined must fallback to ko');
assert.strictEqual(normalizeLang(''), 'ko', 'empty string must fallback to ko');
console.log('✔ normalizeLang() handles cases and fallbacks correctly');

// 4. detectLanguage() Priority Checks
console.log('\n[Check 4] detectLanguage() Priority Hierarchy');
// Priority: urlLang > cookieLang > acceptLanguage / navigatorLanguages > 'ko'
assert.strictEqual(
  detectLanguage({ urlLang: 'ja', cookieLang: 'en', acceptLanguage: 'fr', navigatorLanguages: ['de'] }),
  'ja',
  'urlLang must have highest priority'
);

assert.strictEqual(
  detectLanguage({ cookieLang: 'fr', acceptLanguage: 'de-DE,de;q=0.9', navigatorLanguages: ['it'] }),
  'fr',
  'cookieLang must take priority when urlLang is absent'
);

assert.strictEqual(
  detectLanguage({ acceptLanguage: 'de-DE,de;q=0.9,en;q=0.8', navigatorLanguages: ['es'] }),
  'de',
  'acceptLanguage must take priority when urlLang and cookieLang are absent'
);

assert.strictEqual(
  detectLanguage({ navigatorLanguages: ['es-ES', 'en'] }),
  'es',
  'navigatorLanguages must take priority when HTTP headers/cookies are absent'
);

assert.strictEqual(
  detectLanguage({ urlLang: 'ar' }),
  'ko',
  'Unsupported urlLang (ar) must fallback to ko'
);

assert.strictEqual(
  detectLanguage({}),
  'ko',
  'Empty options must default to ko'
);
console.log('✔ detectLanguage() strictly follows url > cookie > accept-language/navigator > ko priority');

// 5. t() Variable Substitution and Fallback
console.log('\n[Check 5] t() Substitution & Fallback');
assert.strictEqual(
  t('ko', 'timelineTitle', { name: '홍길동' }),
  '홍길동님의 하루 5끼 전체 식단표'
);
assert.strictEqual(
  t('en', 'timelineTitle', { name: 'Steve' }),
  "Steve's Full 5-Meal Daily Dining Plan"
);
assert.strictEqual(
  t('ja', 'timelineTitle', { name: 'Haruto' }),
  'Haruto様の1日5食フル献立表'
);
assert.strictEqual(
  t('de', 'sliderLabel', { time: '12:00' }),
  'Genaue Zeiteinstellung: 12:00'
);
// Key that does not exist in any language falls back to key itself
assert.strictEqual(
  t('en', 'non_existent_key_xyz_123'),
  'non_existent_key_xyz_123'
);
console.log('✔ t() variable substitution and key fallbacks work as expected');

// 6. localizeFood() Tests
console.log('\n[Check 6] localizeFood() with and without dictionary');
const sampleFood = {
  id: 'food_00001',
  index: 1,
  code: '00001',
  name: '수요일 특식 토마토 미트소스 스파게티',
  englishName: 'Wednesday School Special Tomato Meat Spaghetti',
  originGroup: 'SCHOOL_LUNCH',
  originBadge: '🍱 초중고 급식메뉴',
  tagline: '수요일 급식실 줄을 2배로 길게 만들던 전설의 특식 스파게티와 마늘빵 1조각'
};

// Korean: original preserved
const localizedKo = localizeFood(sampleFood, 'ko', null);
assert.strictEqual(localizedKo.name, sampleFood.name);
assert.strictEqual(localizedKo.tagline, sampleFood.tagline);
assert.strictEqual(localizedKo.originBadge, sampleFood.originBadge);
assert.strictEqual(localizedKo.isLocalized, true);

// English with dictionary
const mockEnDict = {
  '00001': {
    name: 'Wednesday Cafeteria Tomato Meat Spaghetti',
    tagline: 'Legendary Wednesday cafeteria spaghetti that doubled the lunch line'
  }
};
const localizedEn = localizeFood(sampleFood, 'en', mockEnDict);
assert.strictEqual(localizedEn.name, 'Wednesday Cafeteria Tomato Meat Spaghetti');
assert.strictEqual(localizedEn.tagline, 'Legendary Wednesday cafeteria spaghetti that doubled the lunch line');
assert.strictEqual(localizedEn.originBadge, '🍱 School Cafeteria');
assert.strictEqual(localizedEn.isLocalized, true);
assert(!HANGUL_REGEX.test(localizedEn.name));
assert(!HANGUL_REGEX.test(localizedEn.tagline));
assert(!HANGUL_REGEX.test(localizedEn.originBadge));

// Missing dictionary entry fallback
const localizedJaMissing = localizeFood(sampleFood, 'ja', null);
assert.strictEqual(localizedJaMissing.name, sampleFood.englishName, 'Name must fall back to englishName');
assert.strictEqual(localizedJaMissing.tagline, '', 'Tagline must be empty string to prevent Korean leakage');
assert.strictEqual(localizedJaMissing.originBadge, '🍱 学校給食メニュー');
assert.strictEqual(localizedJaMissing.isLocalized, false);
assert(!HANGUL_REGEX.test(localizedJaMissing.name));

console.log('✔ localizeFood() correctly handles ko, dictionary entries, fallbacks, and badges');

console.log('\n========================================');
console.log('🎉 ALL i18n UNIT TESTS PASSED (100%)');
console.log('========================================\n');
