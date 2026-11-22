// src/lib/hash.js — JSA-FoodHash-Date (Jamo-Stroke Avalanche Hybrid Hash Engine with Date & Meal Slot Mixing)
// Inherits the exact Hangul Jamo & Stroke table and Murmur3 avalanche architecture from C:\Users\USER\Documents\projects\myhome\src\lib\hash.js
// Adds deterministic date (YYYY-MM-DD) and meal slot mixing so:
//   1. Same Name + Same Date (within 1 day) => 100% identical food recommendation.
//   2. Same Name + Next Date => Completely different food recommendation via avalanche effect.

import { MEAL_CATEGORIES, MEAL_MAP } from './constants.js';

// myhome / name_teller 한글 자모 및 획수 테이블 100% 계승
export const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const JUNGSUNG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

export const JONGSUNG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const STROKES = {
  // 초성 및 기본 자음
  'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8,
  'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 3, 'ㅍ': 4, 'ㅎ': 3,
  // 모음
  'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2, 'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4,
  'ㅗ': 2, 'ㅘ': 4, 'ㅙ': 5, 'ㅚ': 3, 'ㅛ': 3, 'ㅜ': 2, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3,
  'ㅠ': 3, 'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1,
  // 겹받침
  'ㄳ': 4, 'ㄵ': 5, 'ㄶ': 5, 'ㄺ': 7, 'ㄻ': 9, 'ㄼ': 9, 'ㄽ': 7, 'ㄾ': 8, 'ㄿ': 9, 'ㅀ': 8, 'ㅄ': 6
};

/**
 * 한 글자를 초성, 중성, 종성 및 자모별 획수로 분해 (myhome 동일 규격)
 */
export function decomposeHangul(ch) {
  if (!ch) {
    return {
      code: 0,
      cho: 0,
      jung: 0,
      jong: 0,
      choChar: '',
      jungChar: '',
      jongChar: '',
      sCho: 0,
      sJung: 0,
      sJong: 0,
      totalStroke: 0
    };
  }
  const code = ch.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const offset = code - 0xAC00;
    const cho = Math.floor(offset / 588);
    const jung = Math.floor((offset % 588) / 28);
    const jong = offset % 28;
    const choChar = CHOSUNG[cho] || '';
    const jungChar = JUNGSUNG[jung] || '';
    const jongChar = jong ? (JONGSUNG[jong] || '') : '';
    const sCho = STROKES[choChar] || 0;
    const sJung = STROKES[jungChar] || 0;
    const sJong = jong ? (STROKES[jongChar] || 0) : 0;
    return {
      code,
      cho,
      jung,
      jong,
      choChar,
      jungChar,
      jongChar,
      sCho,
      sJung,
      sJong,
      totalStroke: sCho + sJung + sJong
    };
  }
  return {
    code,
    cho: code & 0x1f,
    jung: (code >> 5) & 0x1f,
    jong: 0,
    choChar: '',
    jungChar: '',
    jongChar: '',
    sCho: (code % 7) + 1,
    sJung: 2,
    sJong: 0,
    totalStroke: (code % 9) + 1
  };
}

/**
 * Murmur3 32비트 아발란체 비트 믹서 (fmix32)
 */
export function fmix32(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * 이름의 한글 자모 및 획수 정보, 인접 글자 획수 조화 단계 계산 (myhome 동일 규격)
 */
export function getNameStrokeInfo(name) {
  const cleanName = String(name || '').trim().normalize('NFC');
  const chars = [...cleanName];
  const decomposed = chars.map(ch => decomposeHangul(ch));
  const strokes = decomposed.map(d => d.totalStroke);
  const totalStrokes = strokes.reduce((sum, s) => sum + s, 0);

  const steps = [];
  if (strokes.length > 0) {
    steps.push([...strokes]);
    let current = [...strokes];
    while (current.length > 1) {
      const nextRow = [];
      for (let i = 0; i < current.length - 1; i++) {
        nextRow.push((current[i] + current[i + 1]) % 10);
      }
      steps.push(nextRow);
      current = nextRow;
    }
  }

  let strokeHarmony = totalStrokes;
  for (let i = 0; i < decomposed.length - 1; i++) {
    strokeHarmony = (strokeHarmony * 10 + ((decomposed[i].totalStroke + decomposed[i + 1].totalStroke) % 10)) >>> 0;
  }

  return {
    cleanName,
    charCount: chars.length,
    chars,
    decomposed,
    strokes,
    totalStrokes,
    strokeHarmony,
    steps
  };
}

/**
 * 날짜 문자열 정규화 (YYYY-MM-DD 형태로 통일)
 */
export function normalizeDateString(dateInput) {
  if (!dateInput) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = String(dateInput).trim();
  const match = str.match(/^(\d{4})[-./]?(\d{1,2})[-./]?(\d{1,2})/);
  if (match) {
    const y = match[1];
    const m = String(Number(match[2])).padStart(2, '0');
    const d = String(Number(match[3])).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return str;
}

/**
 * 날짜(YYYY-MM-DD)를 32비트 아발란체 시드로 변환
 * 하루만 바뀌어도(예: 2026-11-08 -> 2026-11-09) 비트 전체가 뒤집히도록 설계
 */
export function computeDateSeed(dateInput) {
  const normDate = normalizeDateString(dateInput);
  let h = 0x811c9dc5;
  for (let i = 0; i < normDate.length; i++) {
    const code = normDate.charCodeAt(i);
    let k = Math.imul(code ^ ((i + 1) * 0x9e3779b9), 0xcc9e2d51);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, 0x1b873593);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 0xe6546b64) >>> 0;
  }
  return fmix32(h ^ (normDate.length * 0x9e3779b1));
}

/**
 * 이름 자체의 원시 JSA-Hash 32비트 정수 계산 (myhome의 mapNameToHouseLevelFull 해시 코어 계승)
 */
export function computeNameBaseHash(name) {
  const clean = String(name || '').trim().normalize('NFC');
  if (!clean) return 0;
  const chars = [...clean];

  let totalStrokes = 0;
  const decomp = chars.map(ch => {
    const d = decomposeHangul(ch);
    totalStrokes += d.totalStroke;
    return d;
  });

  let h1 = (0x9E3779B9 ^ Math.imul(chars.length, 0xCC9E2D51) ^ Math.imul(totalStrokes, 0x1B873593)) >>> 0;

  for (let i = 0; i < decomp.length; i++) {
    const d = decomp[i];
    const lane = (
      (d.cho & 0x1F) |
      ((d.jung & 0x1F) << 5) |
      ((d.jong & 0x1F) << 10) |
      ((d.sCho & 0x0F) << 15) |
      ((d.sJung & 0x0F) << 19) |
      ((d.sJong & 0x0F) << 23) |
      (((d.totalStroke + i * 7) & 0x1F) << 27)
    ) ^ Math.imul(d.code, 0x85ebca6b);

    let k1 = Math.imul(lane, 0xcc9e2d51);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, 0x1b873593);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;
  }

  let strokeHarmony = totalStrokes;
  for (let i = 0; i < decomp.length - 1; i++) {
    strokeHarmony = (strokeHarmony * 10 + ((decomp[i].totalStroke + decomp[i + 1].totalStroke) % 10)) >>> 0;
  }
  h1 ^= Math.imul(strokeHarmony, 0x9E3779B1);

  return fmix32(h1 ^ Math.imul(decomp.length, 0x85ebca6b));
}

/**
 * 이름 + 날짜(YYYY-MM-DD) + 끼니 슬롯(breakfast/lunch/snack/dinner/night) 결합 32비트 해시
 */
export function computeMealSlotHash(name, dateStr, mealKey = 'lunch', retryOffset = 0) {
  const nameHash = computeNameBaseHash(name);
  const dateSeed = computeDateSeed(dateStr);
  const mealObj = MEAL_MAP[mealKey] || MEAL_MAP.lunch;
  const mealSalt = mealObj.salt >>> 0;

  let combined = (nameHash ^ Math.imul(dateSeed, 0xcc9e2d51)) >>> 0;
  combined = (combined << 13) | (combined >>> 19);
  combined = (Math.imul(combined, 5) + mealSalt) >>> 0;

  if (retryOffset > 0) {
    combined ^= Math.imul(retryOffset, 0x9e3779b9);
  }

  return fmix32(combined ^ dateSeed ^ mealSalt);
}

/**
 * 특정 끼니의 활성 음식 배열(pool)에서 이름 + 날짜 기준으로 결정론적 음식 1개 선택
 * usedIds Set이 전달되면 하루 5끼 내에 동일한 음식 ID가 중복 배정되지 않도록 자동 오프셋 탐색
 */
export function pickFoodForMealSlot(name, dateStr, mealKey, pool, usedIds = null) {
  if (!Array.isArray(pool) || pool.length === 0) return null;

  for (let retry = 0; retry < pool.length; retry++) {
    const hashVal = computeMealSlotHash(name, dateStr, mealKey, retry);
    const idx = hashVal % pool.length;
    const candidate = pool[idx];
    if (!usedIds || !usedIds.has(candidate.id)) {
      if (usedIds && candidate?.id) {
        usedIds.add(candidate.id);
      }
      return {
        food: candidate,
        hash: hashVal,
        poolIndex: idx,
        poolSize: pool.length
      };
    }
  }

  // 모든 후보가 이미 사용된 경우 첫 해시 결과 반환
  const fallbackHash = computeMealSlotHash(name, dateStr, mealKey, 0);
  const fallbackIdx = fallbackHash % pool.length;
  return {
    food: pool[fallbackIdx],
    hash: fallbackHash,
    poolIndex: fallbackIdx,
    poolSize: pool.length
  };
}

/**
 * 이름 + 날짜(YYYY-MM-DD) 기준으로 하루 5끼(아침·점심·간식·저녁·야식) 전체 식단표를 결정론적으로 산출
 * @param {string} name - 사용자 입력 이름
 * @param {string} dateStr - 현지 날짜 (YYYY-MM-DD)
 * @param {object} poolsByMeal - { breakfast: [...], lunch: [...], snack: [...], dinner: [...], night: [...] }
 */
export function recommendDailyMeals(name, dateStr, poolsByMeal) {
  const strokeInfo = getNameStrokeInfo(name || '홍길동');
  const effectiveName = strokeInfo.cleanName || '홍길동';
  const normDate = normalizeDateString(dateStr);
  const usedIds = new Set();

  const meals = {};
  const orderedList = [];

  for (const cat of MEAL_CATEGORIES) {
    const pool = (poolsByMeal && Array.isArray(poolsByMeal[cat.key])) ? poolsByMeal[cat.key] : [];
    const picked = pickFoodForMealSlot(effectiveName, normDate, cat.key, pool, usedIds);
    const entry = {
      mealKey: cat.key,
      mealOrder: cat.order,
      mealLabel: cat.label,
      mealFullLabel: cat.fullLabel,
      mealEmoji: cat.emoji,
      timeRangeText: cat.timeRangeText,
      themeColor: cat.themeColor,
      hash: picked ? picked.hash : 0,
      poolIndex: picked ? picked.poolIndex : 0,
      poolSize: picked ? picked.poolSize : 0,
      food: picked ? picked.food : null
    };
    meals[cat.key] = entry;
    orderedList.push(entry);
  }

  return {
    name: effectiveName,
    date: normDate,
    strokeInfo: {
      cleanName: strokeInfo.cleanName,
      charCount: strokeInfo.charCount,
      strokes: strokeInfo.strokes,
      totalStrokes: strokeInfo.totalStrokes,
      strokeHarmony: strokeInfo.strokeHarmony,
      steps: strokeInfo.steps
    },
    nameBaseHash: computeNameBaseHash(effectiveName),
    dateSeed: computeDateSeed(normDate),
    meals,
    orderedList
  };
}
