// src/lib/constants.js — Shared constants, 0~1000 Level Mapping & R2 same-domain contract for MyCar (car.tellmyname.app)

import { FAMILY_SITES } from './common/family_sites.js';

export const SITE_ORIGIN = 'https://car.tellmyname.app';
export const SITE_NAME = '나에게 어울리는 자동차';
export const BRAND_SUB = 'MyCar';
export const MIN_LEVEL = 0;
export const MAX_LEVEL = 1000;
export const TOTAL_LEVELS = 1001; // 0 .. 1000 inclusive
export const GOOD_CAR_THRESHOLD = 500; // 0~499: BAD (폭망 탈것), 500~1000: GOOD (대박 탈것)

// Backward-compatible aliases for shared family modules
export const GOOD_JOB_THRESHOLD = GOOD_CAR_THRESHOLD;
export const GOOD_HOUSE_THRESHOLD = GOOD_CAR_THRESHOLD;
export const ACTIVE_SLOTS_PER_TIER = 50;
export { FAMILY_SITES };

// 12 Bizarre Vehicle & Creature Mount Categories (평범한 출퇴근 승용차 원천 배제!)
export const CAR_CATEGORIES = [
  { id: 'BABY_TOY_RIDE', label: '아기 세발자전거·보행기·유아용 탈것', emoji: '🚲' },
  { id: 'CART_HANDCART', label: '바퀴 빠진 쇼핑카트·손수레·인력거', emoji: '🛒' },
  { id: 'ANIMAL_LAND_MOUNT', label: '기상천외 육상 생물 라이딩', emoji: '🦤' },
  { id: 'SHARK_SEA_MOUNT', label: '상어·해양 괴수·수중 생물 라이딩', emoji: '🦈' },
  { id: 'MAGIC_BROOM_CARPET', label: '해리포터 마법 빗자루·양탄자·신화 탈것', emoji: '🧹' },
  { id: 'BIZARRE_MOD_CAR', label: '마개조 똥차·기상천외 황당 튜닝카', emoji: '🚜' },
  { id: 'FANTASY_ANIME_RIDE', label: '판타지·애니·소설 속 전설의 탈것', emoji: '🐉' },
  { id: 'MOVIE_HERO_VEHICLE', label: '영화·히어로·SF 특수 모빌리티', emoji: '🦇' },
  { id: 'HYPER_LUXURY_CAR', label: '억만장자 하이퍼카·황금 튜닝 슈퍼카', emoji: '🏎️' },
  { id: 'ROYAL_YACHT_JET', label: '초호화 슈퍼요트·황실 전용기·잠수함', emoji: '🛥️' },
  { id: 'SPACE_WARP_CRUISER', label: '우주 전함·행성간 워프 크루저', emoji: '🚀' },
  { id: 'MULTIVERSE_GOD_RIDE', label: '다중우주·시공간 초월 신화 모빌리티', emoji: '🌌' }
];

export const JOB_CATEGORIES = CAR_CATEGORIES;
export const HOUSE_CATEGORIES = CAR_CATEGORIES;

/**
 * 0~1000 사이의 원시 단계(rawLevel)를 정규화합니다.
 */
export function normalizeToActiveLevel(rawLevel) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(rawLevel) || 0)));
}

/**
 * [다음 단계 탈것 보기 ▶] 클릭 시 다음 단계로 이동합니다 (1000 -> 0 순환).
 */
export function getNextActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv >= MAX_LEVEL ? MIN_LEVEL : activeLv + 1;
}

/**
 * [◀ 이전 단계 탈것 보기] 클릭 시 이전 단계로 이동합니다 (0 -> 1000 순환).
 */
export function getPrevActiveLevel(currentLevel) {
  const activeLv = normalizeToActiveLevel(currentLevel);
  return activeLv <= MIN_LEVEL ? MAX_LEVEL : activeLv - 1;
}

/**
 * [🎲 랜덤 탈것 보기] 클릭 시 0~1000단계 중 균등 무작위 추출합니다.
 */
export function getRandomActiveLevel() {
  return Math.floor(Math.random() * TOTAL_LEVELS);
}

/**
 * 동일 도메인(Same-Origin) Cloudflare R2 이미지 경로 반환 (/r2/cars/00000.webp ~ /r2/cars/01000.webp)
 */
export function getCarImageUrl(level, withOrigin = false) {
  const clamped = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const padded = String(clamped).padStart(5, '0');
  const relPath = `/r2/cars/${padded}.webp`;
  return withOrigin ? `${SITE_ORIGIN}${relPath}` : relPath;
}

export const getJobImageUrl = getCarImageUrl;
export const getHouseImageUrl = getCarImageUrl;

/**
 * 단계(0 ~ 1000)로부터 기본 속성(폭망/대박, 짝수=실제/홀수=허구, 티어 1~20) 판별
 * - 0 ~ 499: BAD (폭망 탈것)
 * - 500 ~ 1000: GOOD (대박 탈것)
 * - 짝수(level % 2 === 0): REAL (실제 존재하거나 역사 속 실존 탈것·생물 라이딩)
 * - 홀수(level % 2 === 1): FICTION (허구·마법 빗자루·판타지·SF 속 탈것)
 */
export function getLevelClassifier(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const isGood = lv >= GOOD_CAR_THRESHOLD;
  const isReal = lv % 2 === 0; // 짝수 = 실제 탈것/생물, 홀수 = 허구 탈것/마법/SF
  const tierIndex = Math.min(19, Math.floor(lv / 50)); // 0 ~ 19 (Tier 01 ~ Tier 20)
  return {
    level: lv,
    zone: isGood ? 'GOOD' : 'BAD',
    zoneLabel: isGood ? '대박 탈것' : '폭망 탈것',
    realityType: isReal ? 'REAL' : 'FICTION',
    realityLabel: isReal ? '실제·역사 속 실존 탈것·생물 라이딩' : '허구·마법 빗자루·판타지·SF 탈것',
    tier: tierIndex + 1,
    imageUrl: getCarImageUrl(lv, false),
    ogImageUrl: getCarImageUrl(lv, true)
  };
}
