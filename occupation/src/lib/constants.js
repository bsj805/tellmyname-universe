// src/lib/constants.js — Shared constants, 0~1000 Level Mapping & R2 same-domain contract for MyJob (job.tellmyname.app)

export const SITE_ORIGIN = 'https://job.tellmyname.app';
export const SITE_NAME = '나에게 어울리는 직업';
export const BRAND_SUB = 'MyJob';
export const MIN_LEVEL = 0;
export const MAX_LEVEL = 1000;
export const TOTAL_LEVELS = 1001; // 0 .. 1000 inclusive
export const GOOD_JOB_THRESHOLD = 500; // 0~499: BAD (폭망 직업), 500~1000: GOOD (대박 직업)

// Backward-compatible aliases for shared modules
export const GOOD_HOUSE_THRESHOLD = GOOD_JOB_THRESHOLD;
export const ACTIVE_SLOTS_PER_TIER = 50;

// 12 Bizarre Occupation / Activity Categories (평범한 사무직 원천 배제)
export const JOB_CATEGORIES = [
  { id: 'BACKSU_NEETS', label: '골방백수·방구석 잉여·기괴한 무직', emoji: '🛌' },
  { id: 'HISTORICAL_EXTREME', label: '고대·중세·근대 극한 역사 직업', emoji: '🪣' },
  { id: 'EXTREME_JOURNALISM', label: '극한 현장·방송·기상천외 취재', emoji: '🎙️' },
  { id: 'WEIRD_BIZ_TRADE', label: '세계의 황당한 장사·이색 상인', emoji: '🛒' },
  { id: 'TOURISM_EVENT', label: '기상천외 관광거리·특별 이벤트 요원', emoji: '🎢' },
  { id: 'BIZARRE_REAL_JOB', label: '실제로 존재하는 신기한 이색 직업', emoji: '🐼' },
  { id: 'FANTASY_MEDIA_JOB', label: '판타지·영화·애니·소설 속 일자리', emoji: '🧙' },
  { id: 'HACKER_UNDERGROUND', label: '천재 해커·어둠의 일거리·크립토 괴짜', emoji: '💻' },
  { id: 'TYCOON_LUXURY', label: '억만장자·초호화 꿀직업·재벌 특권직', emoji: '💎' },
  { id: 'EARTH_MEGAPROJECT', label: '범지구 프로젝트·인류 구원 사령관', emoji: '🌍' },
  { id: 'SPACE_SCIFI_JOB', label: '공상과학(SF)·우주 개척·외계 교섭직', emoji: '🚀' },
  { id: 'MULTIVERSE_GOD', label: '초미래·다중우주·시공간 창조 아키텍트', emoji: '🌌' }
];

export const HOUSE_CATEGORIES = JOB_CATEGORIES;

/**
 * 0~1000 사이의 원시 단계(rawLevel)를 정규화합니다.
 */
export function normalizeToActiveLevel(rawLevel) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(rawLevel) || 0)));
}

/**
 * [다음 단계 직업 보기 ▶] 클릭 시 다음 단계로 이동합니다 (1000 -> 0 순환).
 */
export function getNextActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv >= MAX_LEVEL ? MIN_LEVEL : activeLv + 1;
}

/**
 * [◀ 이전 단계 직업 보기] 클릭 시 이전 단계로 이동합니다 (0 -> 1000 순환).
 */
export function getPrevActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv <= MIN_LEVEL ? MAX_LEVEL : activeLv - 1;
}

/**
 * [🎲 랜덤 직업 보기] 클릭 시 0~1000단계 중 균등 무작위 추출합니다.
 */
export function getRandomActiveLevel() {
  return Math.floor(Math.random() * TOTAL_LEVELS);
}

/**
 * 동일 도메인(Same-Origin) Cloudflare R2 이미지 경로 반환 (/r2/jobs/00000.webp ~ /r2/jobs/01000.webp)
 */
export function getJobImageUrl(level, withOrigin = false) {
  const clamped = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const padded = String(clamped).padStart(5, '0');
  const relPath = `https://img.tellmyname.app/jobs/${padded}.png`;
  return withOrigin ? `${SITE_ORIGIN}${relPath}` : relPath;
}

export const getHouseImageUrl = getJobImageUrl;

/**
 * 단계(0 ~ 1000)로부터 기본 속성(폭망/대박, 짝수=실제/홀수=허구, 티어 1~20) 판별
 * - 0 ~ 499: BAD (폭망 직업)
 * - 500 ~ 1000: GOOD (대박 직업)
 * - 짝수(level % 2 === 0): REAL (실제 존재하거나 역사 속 실존 직업·일거리)
 * - 홀수(level % 2 === 1): FICTION (허구·상상·SF·판타지 속 직업·일자리)
 */
export function getLevelClassifier(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const isGood = lv >= GOOD_JOB_THRESHOLD;
  const isReal = lv % 2 === 0; // 짝수 = 실제 직업, 홀수 = 허구 직업
  const tierIndex = Math.min(19, Math.floor(lv / 50)); // 0 ~ 19 (Tier 01 ~ Tier 20, Tier 20 covers 950~1000)
  return {
    level: lv,
    zone: isGood ? 'GOOD' : 'BAD',
    zoneLabel: isGood ? '대박 직업' : '폭망 직업',
    realityType: isReal ? 'REAL' : 'FICTION',
    realityLabel: isReal ? '실제·역사 속 실존 직업·일거리' : '허구·상상·SF·판타지 속 일자리',
    tier: tierIndex + 1,
    imageUrl: getJobImageUrl(lv, false),
    ogImageUrl: getJobImageUrl(lv, true)
  };
}
