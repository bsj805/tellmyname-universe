// src/lib/constants.js — Shared constants, Phase-Aware Active Slot Mapping & R2 same-domain contract for MyHome

export const SITE_ORIGIN = 'https://myhome.tellmyname.app';
export const MIN_LEVEL = 0;
export const MAX_LEVEL = 999;
export const TOTAL_LEVELS = 1000; // 0 .. 999 inclusive
export const GOOD_HOUSE_THRESHOLD = 500; // 0~499: BAD (폭망 하우스), 500~999: GOOD (대박 하우스)

/**
 * 1,000단계 전 슬롯 활성화 (중복 0% 고유 마스터 데이터셋)
 */
export const ACTIVE_SLOTS_PER_TIER = 50;

// 12 Bizarre Non-Apartment Categories (평범한 아파트 원천 배제)
export const HOUSE_CATEGORIES = [
  { id: 'TOILET', label: '세계의 신기한 화장실·위생시설', emoji: '🚽' },
  { id: 'CLOSET', label: '옷장·가구·코인사물함', emoji: '🚪' },
  { id: 'DOGHOUSE', label: '개집·동물 서식지·캣타워', emoji: '🐶' },
  { id: 'BOX', label: '종이상자·택배박스·용기', emoji: '📦' },
  { id: 'VEHICLE', label: '자동차·캠핑카·기차·잠수함', emoji: '🚗' },
  { id: 'SPACESHIP', label: '우주선·우주정거장·궤도기지', emoji: '🚀' },
  { id: 'FICTION_MEDIA', label: '영화·소설·애니메이션 속 공간', emoji: '🎬' },
  { id: 'MUSEUM_PUBLIC', label: '이색 박물관·교도소·기괴 공공건물', emoji: '🏛️' },
  { id: 'IMAGINARY_CITY', label: '상상 속의 도시·미니어처 왕국', emoji: '🏙️' },
  { id: 'EXTREME_NATURE', label: '극한 오지·화산·심해·빙하 지형', emoji: '🪨' },
  { id: 'WEIRD_ARCH', label: '세계의 기이한 실제 건축물·랜드마크', emoji: '🏰' },
  { id: 'MULTIVERSE', label: '초차원·블랙홀·다중우주 창조주 신전', emoji: '🌌' }
];

/**
 * 0~999 사이의 원시 단계(rawLevel)를 정규화합니다.
 */
export function normalizeToActiveLevel(rawLevel) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(rawLevel) || 0)));
}

/**
 * [다음 단계 집 보기 ▶] 클릭 시 다음 단계로 이동합니다 (999 -> 0 순환).
 */
export function getNextActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv >= MAX_LEVEL ? MIN_LEVEL : activeLv + 1;
}

/**
 * [◀ 이전 단계 집 보기] 클릭 시 이전 단계로 이동합니다 (0 -> 999 순환).
 */
export function getPrevActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv <= MIN_LEVEL ? MAX_LEVEL : activeLv - 1;
}

/**
 * [🎲 랜덤 집 보기] 클릭 시 0~999단계 중 균등 무작위 추출합니다.
 */
export function getRandomActiveLevel() {
  return Math.floor(Math.random() * TOTAL_LEVELS);
}

/**
 * 동일 도메인(Same-Origin) Cloudflare R2 이미지 경로 반환
 */
export function getHouseImageUrl(level, withOrigin = false) {
  const clamped = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const padded = String(clamped).padStart(5, '0');
  const relPath = `https://img.tellmyname.app/houses/${padded}.webp`;
  return withOrigin ? `${SITE_ORIGIN}${relPath}` : relPath;
}

/**
 * 단계(0 ~ 999)로부터 기본 속성(폭망/대박, 짝수=실제/홀수=허구, 티어 1~20) 판별
 */
export function getLevelClassifier(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const isGood = lv >= GOOD_HOUSE_THRESHOLD;
  const isReal = lv % 2 === 0; // 짝수 = 실제 건축물, 홀수 = 허구 건축물
  const tierIndex = Math.min(19, Math.floor(lv / 50)); // 0 ~ 19 (Tier 01 ~ Tier 20, 50개씩)
  return {
    level: lv,
    zone: isGood ? 'GOOD' : 'BAD',
    zoneLabel: isGood ? '대박 하우스' : '폭망 하우스',
    realityType: isReal ? 'REAL' : 'FICTION',
    realityLabel: isReal ? '실제 존재하는 건축물·사물' : '허구·상상 속 건축물·사물',
    tier: tierIndex + 1,
    imageUrl: getHouseImageUrl(lv, false),
    ogImageUrl: getHouseImageUrl(lv, true)
  };
}
