// src/lib/worldcup.js — Food Ideal Type World Cup Tournament Engine & SEO Presets
// Pure ESM module shared between browser UI, Cloudflare Worker SSR, and unit tests.

export const WORLDCUP_MODES = ['best', 'worst'];

export const WORLDCUP_CATEGORIES = [
  { key: 'all', emoji: '✨', koLabel: '전체 음식', enLabel: 'All Foods' },
  { key: 'breakfast', emoji: '🌅', koLabel: '아침', enLabel: 'Breakfast' },
  { key: 'lunch', emoji: '☀️', koLabel: '점심', enLabel: 'Lunch' },
  { key: 'snack', emoji: '🍰', koLabel: '간식', enLabel: 'Snack' },
  { key: 'dinner', emoji: '🌙', koLabel: '저녁', enLabel: 'Dinner' },
  { key: 'night', emoji: '🦉', koLabel: '야식', enLabel: 'Late-night' }
];

export const WORLDCUP_ROUND_SIZES = [32, 64, 128];

/**
 * Dedicated SEO Landing Presets for /worldcup and /worldcup/:slug
 * Naver Yeti & Google SEO optimized (<title> concise & keyword-first)
 */
export const WORLDCUP_SEO_SLUGS = {
  '': {
    slug: '',
    category: 'lunch',
    mode: 'best',
    koTitle: '음식 이상형 월드컵 | 오늘 뭐 먹지? (Mukbang)',
    koDesc: '아침·점심·저녁·간식·야식 최고의 음식과 최악의 음식을 32강·64강·128강 토너먼트로 뽑아보세요!',
    koKeywords: '음식 이상형 월드컵, 점심 고르기, 저녁 메뉴 월드컵, 최악의 음식 월드컵, 오늘 뭐 먹지',
    enTitle: 'Food Ideal Type World Cup | Mukbang',
    enDesc: 'Pick the best or worst food across breakfast, lunch, snack, dinner, and late-night in 32, 64, or 128-round brackets!'
  },
  breakfast: {
    slug: 'breakfast',
    category: 'breakfast',
    mode: 'best',
    koTitle: '오늘의 아침 고르기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '아침 메뉴 163종 중 오늘 가장 먹고 싶은 최고의 아침 식사를 32강·64강·128강 월드컵으로 골라보세요.',
    koKeywords: '오늘의 아침 고르기, 아침 메뉴 이상형 월드컵, 아침밥 추천, 아침 식사 월드컵',
    enTitle: 'Breakfast Food World Cup | Mukbang',
    enDesc: 'Choose your favorite breakfast dish in a 32, 64, or 128-food random tournament!'
  },
  lunch: {
    slug: 'lunch',
    category: 'lunch',
    mode: 'best',
    koTitle: '오늘의 점심 고르기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '점심 메뉴 279종 중 오늘 딱 땡기는 최고의 점심을 32강·64강·128강 랜덤 대진으로 뽑아보세요!',
    koKeywords: '오늘의 점심 고르기, 점심 메뉴 이상형 월드컵, 점메추 월드컵, 직장인 점심 추천',
    enTitle: 'Lunch Menu Ideal Type World Cup | Mukbang',
    enDesc: 'Decide what to eat for lunch today with a random 32, 64, or 128-food bracket!'
  },
  snack: {
    slug: 'snack',
    category: 'snack',
    mode: 'best',
    koTitle: '오늘의 간식·디저트 고르기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '달콤한 디저트와 분식 간식 141종 중 오늘의 최애 간식을 32강·64강·128강 월드컵으로 정해보세요.',
    koKeywords: '간식 이상형 월드컵, 디저트 월드컵, 오후 간식 추천, 오늘의 간식 고르기',
    enTitle: 'Snack & Dessert World Cup | Mukbang',
    enDesc: 'Pick the ultimate snack or dessert in a 32, 64, or 128-round food bracket!'
  },
  dinner: {
    slug: 'dinner',
    category: 'dinner',
    mode: 'best',
    koTitle: '오늘의 저녁 고르기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '저녁 메뉴 278종 중 오늘 밤 가장 먹고 싶은 최고의 저녁 식사를 32강·64강·128강 월드컵으로 골라보세요.',
    koKeywords: '오늘의 저녁 고르기, 저녁 메뉴 이상형 월드컵, 저메추 월드컵, 저녁 식사 추천',
    enTitle: 'Dinner Menu Ideal Type World Cup | Mukbang',
    enDesc: 'Find your ideal dinner tonight with a 32, 64, or 128-dish random tournament!'
  },
  night: {
    slug: 'night',
    category: 'night',
    mode: 'best',
    koTitle: '오늘의 야식 고르기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '치킨·라면·족발 등 야식 206종 중 지금 당장 시켜 먹고 싶은 최고의 야식을 월드컵으로 뽑아보세요!',
    koKeywords: '오늘의 야식 고르기, 야식 이상형 월드컵, 야식 메뉴 추천, 밤에 뭐 먹지',
    enTitle: 'Late-Night Cravings World Cup | Mukbang',
    enDesc: 'Pick the best late-night snack from 206 dishes in a 32, 64, or 128-round bracket!'
  },
  worst: {
    slug: 'worst',
    category: 'all',
    mode: 'worst',
    koTitle: '최악의 음식 뽑기 이상형 월드컵 | 오늘 뭐 먹지?',
    koDesc: '보기만 해도 먹기 싫은 최악의 음식은? 401종 음식 중 최악의 메뉴를 32강·64강·128강으로 가려보세요!',
    koKeywords: '최악의 음식 월드컵, 최악의 음식 뽑기, 극혐 음식 이상형 월드컵, 먹기 싫은 음식',
    enTitle: 'Worst Food Ideal Type World Cup | Mukbang',
    enDesc: 'Which dish would you avoid at all costs? Crown the worst food in a 32, 64, or 128-food bracket!'
  }
};

/**
 * Filter foods by meal category ('all', 'breakfast', 'lunch', 'snack', 'dinner', 'night')
 * @param {Array} foods
 * @param {string} category
 * @returns {Array}
 */
export function filterFoodsByCategory(foods, category = 'all') {
  if (!Array.isArray(foods)) return [];
  if (!category || category === 'all') return [...foods];
  return foods.filter((f) => {
    if (!f) return false;
    if (Array.isArray(f.candidateMeals) && f.candidateMeals.includes(category)) {
      return true;
    }
    return f.primaryMeal === category;
  });
}

/**
 * Fisher-Yates shuffle (non-mutating)
 * @param {Array} items
 * @param {Function} rng
 * @returns {Array}
 */
export function shuffleArray(items, rng = Math.random) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pair an even-length list of items into [left, right] matches
 * @param {Array} items
 * @returns {Array<[Object, Object]>}
 */
export function pairIntoMatches(items) {
  const matches = [];
  for (let i = 0; i + 1 < items.length; i += 2) {
    matches.push([items[i], items[i + 1]]);
  }
  return matches;
}

/**
 * Resolve largest valid power-of-2 round size <= requestedSize and <= poolLength
 * @param {number} poolLength
 * @param {number} requestedSize
 * @returns {number}
 */
export function resolveEffectiveRoundSize(poolLength, requestedSize = 32) {
  const validPowers = [128, 64, 32, 16, 8, 4, 2];
  const cap = Math.min(poolLength, requestedSize);
  for (const p of validPowers) {
    if (cap >= p) return p;
  }
  return 0;
}

/**
 * Deterministic Mulberry32 PRNG from string or number seed
 * @param {string|number} seed
 * @returns {Function}
 */
export function createSeededRng(seed) {
  let h = 2166136261 >>> 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a compact random numeric seed string
 */
export function generateRandomSeed() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Create a brand-new randomized World Cup tournament state
 * @param {Object} opts
 * @param {Array} opts.foods
 * @param {string} [opts.category='lunch']
 * @param {string} [opts.mode='best']
 * @param {number} [opts.roundSize=32]
 * @param {string|number} [opts.seed]
 * @param {Function} [opts.rng]
 */
export function createWorldCupState({
  foods = [],
  category = 'lunch',
  mode = 'best',
  roundSize = 32,
  seed = null,
  rng = null
} = {}) {
  const safeMode = WORLDCUP_MODES.includes(mode) ? mode : 'best';
  const pool = filterFoodsByCategory(foods, category);
  const effectiveSize = resolveEffectiveRoundSize(pool.length, Number(roundSize) || 32);
  const effectiveSeed = (seed !== null && seed !== undefined && String(seed).trim() !== '')
    ? String(seed).trim()
    : generateRandomSeed();
  const effectiveRng = typeof rng === 'function' ? rng : createSeededRng(effectiveSeed);

  if (effectiveSize < 2) {
    return {
      phase: 'setup',
      category,
      mode: safeMode,
      seed: effectiveSeed,
      requestedRoundSize: Number(roundSize) || 32,
      initialRoundSize: 0,
      currentRoundSize: 0,
      matches: [],
      matchIndex: 0,
      nextRoundPool: [],
      completedMatches: 0,
      totalMatches: 0,
      winner: null,
      history: []
    };
  }

  const seeded = shuffleArray(pool, effectiveRng).slice(0, effectiveSize);
  const matches = pairIntoMatches(seeded);

  return {
    phase: 'playing',
    category,
    mode: safeMode,
    seed: effectiveSeed,
    requestedRoundSize: Number(roundSize) || 32,
    initialRoundSize: effectiveSize,
    currentRoundSize: effectiveSize,
    matches,
    matchIndex: 0,
    nextRoundPool: [],
    completedMatches: 0,
    totalMatches: effectiveSize - 1,
    winner: null,
    history: []
  };
}

/**
 * Pick a winner ('left' | 'right') for the current match and advance tournament
 * @param {Object} state
 * @param {'left'|'right'} side
 * @param {Function} [rng=Math.random]
 * @returns {Object} new state
 */
export function pickWinner(state, side, rng = Math.random) {
  if (!state || state.phase !== 'playing') return state;
  const currentMatch = state.matches[state.matchIndex];
  if (!currentMatch) return state;

  const chosen = side === 'right' ? currentMatch[1] : currentMatch[0];
  const snapshot = {
    phase: state.phase,
    currentRoundSize: state.currentRoundSize,
    matches: state.matches,
    matchIndex: state.matchIndex,
    nextRoundPool: [...state.nextRoundPool],
    completedMatches: state.completedMatches,
    winner: state.winner
  };

  const nextPool = [...state.nextRoundPool, chosen];
  const nextCompleted = state.completedMatches + 1;
  const nextHistory = [...state.history, snapshot];

  // More matches left in current round
  if (state.matchIndex + 1 < state.matches.length) {
    return {
      ...state,
      matchIndex: state.matchIndex + 1,
      nextRoundPool: nextPool,
      completedMatches: nextCompleted,
      history: nextHistory
    };
  }

  // Round finished: check if tournament is complete
  if (nextPool.length === 1) {
    return {
      ...state,
      phase: 'finished',
      nextRoundPool: nextPool,
      completedMatches: nextCompleted,
      winner: nextPool[0],
      history: nextHistory
    };
  }

  // Advance to next round with freshly shuffled matchups
  const shuffledNext = shuffleArray(nextPool, rng);
  const nextMatches = pairIntoMatches(shuffledNext);

  return {
    ...state,
    currentRoundSize: nextPool.length,
    matches: nextMatches,
    matchIndex: 0,
    nextRoundPool: [],
    completedMatches: nextCompleted,
    history: nextHistory
  };
}

/**
 * Undo the most recent match pick
 * @param {Object} state
 * @returns {Object}
 */
export function undoPick(state) {
  if (!state || !Array.isArray(state.history) || state.history.length === 0) {
    return state;
  }
  const prev = state.history[state.history.length - 1];
  return {
    ...state,
    phase: prev.phase,
    currentRoundSize: prev.currentRoundSize,
    matches: prev.matches,
    matchIndex: prev.matchIndex,
    nextRoundPool: prev.nextRoundPool,
    completedMatches: prev.completedMatches,
    winner: prev.winner,
    history: state.history.slice(0, -1)
  };
}

/**
 * Human-readable round label
 * @param {number} roundSize
 * @param {string} lang
 * @returns {string}
 */
export function getRoundLabel(roundSize, lang = 'ko') {
  if (lang === 'ko') {
    if (roundSize === 2) return '결승';
    if (roundSize === 4) return '준결승 (4강)';
    return `${roundSize}강`;
  }
  if (roundSize === 2) return 'Final';
  if (roundSize === 4) return 'Semifinals';
  if (roundSize === 8) return 'Quarterfinals';
  return `Round of ${roundSize}`;
}

/**
 * Parse /worldcup or /worldcup/:slug pathname
 * @param {string} pathname
 * @returns {{ isWorldCup: boolean, slug: string, category: string, mode: string }}
 */
export function parseWorldCupPath(pathname = '/') {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/worldcup') {
    const preset = WORLDCUP_SEO_SLUGS[''];
    return { isWorldCup: true, slug: '', category: preset.category, mode: preset.mode };
  }
  if (clean.startsWith('/worldcup/')) {
    const slug = clean.slice('/worldcup/'.length).split('/')[0].toLowerCase();
    const preset = WORLDCUP_SEO_SLUGS[slug] || WORLDCUP_SEO_SLUGS[''];
    return {
      isWorldCup: true,
      slug: WORLDCUP_SEO_SLUGS[slug] ? slug : '',
      category: preset.category,
      mode: preset.mode
    };
  }
  return { isWorldCup: false, slug: '', category: 'lunch', mode: 'best' };
}
