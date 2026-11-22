// src/lib/hash.js — JSA-Hash-1001 Engine for MyCar (car.tellmyname.app)
// Powered by shared tellmyname.app common module (src/lib/common/hash_engine.js)

import {
  TOTAL_LEVELS,
  ACTIVE_SLOTS_PER_TIER,
  normalizeToActiveLevel,
  getLevelClassifier
} from './constants.js';

import {
  CHOSUNG,
  JUNGSUNG,
  JONGSUNG,
  STROKES,
  decomposeHangul,
  fmix32,
  getNameStrokeInfo,
  computeJsaHashLevel
} from './common/hash_engine.js';

export {
  CHOSUNG,
  JUNGSUNG,
  JONGSUNG,
  STROKES,
  decomposeHangul,
  fmix32,
  getNameStrokeInfo
};

/**
 * 1,001개 전체 단계(0 ~ 1000) 기준 결정론적 JSA-Hash-1001 매핑값 반환
 * @param {string} name
 * @returns {number} 0 .. 1000 inclusive
 */
export function mapNameToCarLevelFull(name) {
  return computeJsaHashLevel(name, TOTAL_LEVELS);
}

/**
 * 이름을 활성 탈것 단계(0 ~ 1000)로 매핑합니다.
 * @param {string} name
 * @param {number} [slotsPerTier=ACTIVE_SLOTS_PER_TIER]
 * @returns {number} 0 .. 1000
 */
export function mapNameToCarLevel(name, slotsPerTier = ACTIVE_SLOTS_PER_TIER) {
  const fullLevel = mapNameToCarLevelFull(name);
  return normalizeToActiveLevel(fullLevel);
}

/**
 * 이름 분석 및 자동차·탈것 단계/분류 속성 전체 반환
 * @param {string} name
 * @param {number} [slotsPerTier=ACTIVE_SLOTS_PER_TIER]
 */
export function analyzeNameToCar(name, slotsPerTier = ACTIVE_SLOTS_PER_TIER) {
  const strokeInfo = getNameStrokeInfo(name);
  const fullLevel = mapNameToCarLevelFull(strokeInfo.cleanName);
  const level = normalizeToActiveLevel(fullLevel);
  const classifier = getLevelClassifier(level);

  return {
    cleanName: strokeInfo.cleanName,
    charCount: strokeInfo.charCount,
    strokes: strokeInfo.strokes,
    totalStrokes: strokeInfo.totalStrokes,
    strokeHarmony: strokeInfo.strokeHarmony,
    steps: strokeInfo.steps,
    fullLevel,
    slotsPerTier,
    ...classifier
  };
}

// 패밀리 공통 모듈 하위 호환 별칭(Alias) exports
export const mapNameToJobLevelFull = mapNameToCarLevelFull;
export const mapNameToJobLevel = mapNameToCarLevel;
export const analyzeNameToJob = analyzeNameToCar;
export const mapNameToHouseLevelFull = mapNameToCarLevelFull;
export const mapNameToHouseLevel = mapNameToCarLevel;
export const analyzeNameToHouse = analyzeNameToCar;
