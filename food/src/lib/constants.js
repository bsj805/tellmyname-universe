// src/lib/constants.js — Shared contract for tellmyname.app/food
// Defines domain, 5 meal categories (ordered Morning -> Late-night), 8 food origin groups, and per-category cap settings.

export const SITE_ORIGIN = 'https://tellmyname.app/food';
export const SITE_NAME = '오늘 뭐 먹지? (Mukbang)';

/**
 * 하루 5끼 고정 스크롤 순서 (아침 -> 점심 -> 간식/디저트 -> 저녁 -> 야식)
 * - 상단 Hero에는 접속자 타임존 현재 시간에 맞는 끼니가 노출되고,
 * - 아래로 스크롤하면 반드시 이 배열 순서대로 5끼가 노출됩니다.
 */
export const MEAL_CATEGORIES = [
  {
    key: 'breakfast',
    order: 1,
    label: '아침',
    fullLabel: '아침 추천',
    enLabel: 'Breakfast',
    emoji: '🌅',
    timeRangeText: '05:00 ~ 09:59',
    startHour: 5,
    endHour: 9,
    salt: 0x1F83D9AB,
    themeColor: '#FF9F43'
  },
  {
    key: 'lunch',
    order: 2,
    label: '점심',
    fullLabel: '점심 추천',
    enLabel: 'Lunch',
    emoji: '☀️',
    timeRangeText: '10:00 ~ 13:59',
    startHour: 10,
    endHour: 13,
    salt: 0x5BE0CD19,
    themeColor: '#FF6B6B'
  },
  {
    key: 'snack',
    order: 3,
    label: '간식',
    fullLabel: '간식(디저트) 추천',
    enLabel: 'Snack & Dessert',
    emoji: '🍰',
    timeRangeText: '14:00 ~ 16:59',
    startHour: 14,
    endHour: 16,
    salt: 0x9B05688C,
    themeColor: '#F368E0'
  },
  {
    key: 'dinner',
    order: 4,
    label: '저녁',
    fullLabel: '저녁 추천',
    enLabel: 'Dinner',
    emoji: '🌙',
    timeRangeText: '17:00 ~ 20:59',
    startHour: 17,
    endHour: 20,
    salt: 0x510E527F,
    themeColor: '#54A0FF'
  },
  {
    key: 'night',
    order: 5,
    label: '야식',
    fullLabel: '야식 추천',
    enLabel: 'Late-night Snack',
    emoji: '🦉',
    timeRangeText: '21:00 ~ 04:59',
    startHour: 21,
    endHour: 4,
    salt: 0xA54FF53A,
    themeColor: '#8395A7'
  }
];

export const MEAL_KEYS = MEAL_CATEGORIES.map(m => m.key);

export const MEAL_MAP = Object.fromEntries(
  MEAL_CATEGORIES.map(m => [m.key, m])
);

/**
 * 8대 음식 수집 출처 도메인 (종류에 상관없이 총망라)
 */
export const FOOD_ORIGIN_GROUPS = {
  SCHOOL_LUNCH: {
    id: 'SCHOOL_LUNCH',
    label: '초·중·고 추억의 급식',
    badge: '🍱 초중고 급식메뉴',
    emoji: '🍱',
    color: '#FF9F43'
  },
  MICHELIN_3: {
    id: 'MICHELIN_3',
    label: '미슐랭 3스타 파인다이닝',
    badge: '⭐⭐⭐ 미슐랭 3스타',
    emoji: '⭐⭐⭐',
    color: '#D4AF37'
  },
  MICHELIN_2: {
    id: 'MICHELIN_2',
    label: '미슐랭 2스타 다이닝',
    badge: '⭐⭐ 미슐랭 2스타',
    emoji: '⭐⭐',
    color: '#C5A059'
  },
  MICHELIN_1: {
    id: 'MICHELIN_1',
    label: '미슐랭 1스타 다이닝',
    badge: '⭐ 미슐랭 1스타',
    emoji: '⭐',
    color: '#E67E22'
  },
  BIB_GOURMAND: {
    id: 'BIB_GOURMAND',
    label: '미슐랭 빕 구르망 맛집',
    badge: '🏅 미슐랭 빕 구르망',
    emoji: '🏅',
    color: '#EE5253'
  },
  RAW_NATURAL: {
    id: 'RAW_NATURAL',
    label: '생당근·토마토·과일·자연식',
    badge: '🥕 생야채·과일·자연식',
    emoji: '🥕',
    color: '#10AC84'
  },
  UNIQUE_SPECIAL: {
    id: 'UNIQUE_SPECIAL',
    label: '음식점 특이메뉴·이색 별미',
    badge: '🧪 음식점 특이메뉴',
    emoji: '🧪',
    color: '#9B59B6'
  },
  KOREAN_POPULAR: {
    id: 'KOREAN_POPULAR',
    label: '한국인이 사랑하는 대중 메뉴',
    badge: '🍲 한국 인기 메뉴',
    emoji: '🍲',
    color: '#2E86DE'
  },
  GLOBAL_DINING: {
    id: 'GLOBAL_DINING',
    label: '세계 각국 레스토랑 미식',
    badge: '🌍 세계 레스토랑 미식',
    emoji: '🌍',
    color: '#00CEC9'
  }
};

/**
 * 카테고리별 최대 음식 개수 제한 (Cap) 설정
 * - null 또는 0 이하이면 수집된 해당 카테고리 음식을 제한 없이 100% 모두 사용합니다.
 * - 숫자를 지정하면(예: 40) 각 카테고리별로 출처 그룹 균형을 맞춰 최대 해당 개수까지만 활성화합니다.
 */
export const DEFAULT_CATEGORY_CAP = null;

export const CATEGORY_MAX_LIMITS = {
  breakfast: null,
  lunch: null,
  snack: null,
  dinner: null,
  night: null
};

/**
 * 음식 고유 번호(index: 1 ~ N)에 대한 5자리 패딩 문자열 반환 (예: "00001")
 */
export function formatFoodCode(index) {
  const num = Math.max(1, Math.floor(Number(index) || 1));
  return String(num).padStart(5, '0');
}

/**
 * 음식 일러스트 생성용 고정 프롬프트 포맷터
 * 요구사항: "일러스트풍으로 {음식이름}그려줘"
 */
export function buildIllustrationPrompt(foodName) {
  const clean = String(foodName || '').trim();
  return `일러스트풍으로 ${clean}그려줘`;
}

/**
 * 음식 이미지 경로 반환 (/images/00001.png)
 */
export function getFoodImageUrl(index, withOrigin = false) {
  const padded = formatFoodCode(index);
  return `https://img.tellmyname.app/foods/${padded}.png`;
}
