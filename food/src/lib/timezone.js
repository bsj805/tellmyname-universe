// src/lib/timezone.js — Timezone-aware local date (YYYY-MM-DD), hour (0~23), and active meal resolver
// Supports browser Intl timezone detection, server request timezone query/header, and midnight countdown calculation.

import { MEAL_CATEGORIES, MEAL_MAP } from './constants.js';

export const DEFAULT_TIMEZONE = 'Asia/Seoul';

/**
 * 유효한 IANA Timezone 문자열인지 검증 후 반환 (유효하지 않으면 Asia/Seoul 폴백)
 */
export function normalizeTimezone(tz) {
  if (!tz || typeof tz !== 'string') return DEFAULT_TIMEZONE;
  const trimmed = tz.trim();
  if (!trimmed) return DEFAULT_TIMEZONE;
  try {
    Intl.DateTimeFormat('en-US', { timeZone: trimmed });
    return trimmed;
  } catch (_) {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * 현재 실행 환경(브라우저 또는 서버)의 기본 타임존 감지
 */
export function detectClientTimezone() {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return normalizeTimezone(resolved);
  } catch (_) {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * 특정 Date 객체와 IANA timeZone을 기준으로 현지 연/월/일/시/분/초 및 YYYY-MM-DD 반환
 */
export function getLocalTimeParts(dateInput = new Date(), timeZone = DEFAULT_TIMEZONE) {
  const validTz = normalizeTimezone(timeZone);
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const safeDate = Number.isNaN(dateObj.getTime()) ? new Date() : dateObj;

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: validTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(safeDate);
  const map = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      map[p.type] = p.value;
    }
  }

  const year = map.year || '2026';
  const month = (map.month || '01').padStart(2, '0');
  const day = (map.day || '01').padStart(2, '0');
  const hour = Math.max(0, Math.min(23, parseInt(map.hour || '12', 10)));
  const minute = Math.max(0, Math.min(59, parseInt(map.minute || '0', 10)));
  const second = Math.max(0, Math.min(59, parseInt(map.second || '0', 10)));

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return {
    timeZone: validTz,
    dateStr,
    timeStr,
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour,
    minute,
    second
  };
}

/**
 * 현지 시각(0~23시)을 기준으로 현재 가장 상단에 노출할 추천 끼니 카테고리 결정
 * - 05:00 ~ 09:59 -> breakfast (아침)
 * - 10:00 ~ 13:59 -> lunch (점심)   [예: 11시에 들어오면 점심 추천이 제일 상단에 노출]
 * - 14:00 ~ 16:59 -> snack (간식/디저트)
 * - 17:00 ~ 20:59 -> dinner (저녁)
 * - 21:00 ~ 04:59 -> night (야식)
 */
export function resolveActiveMealByHour(hour) {
  const h = ((Math.floor(Number(hour) || 0) % 24) + 24) % 24;
  if (h >= 5 && h <= 9) return MEAL_MAP.breakfast;
  if (h >= 10 && h <= 13) return MEAL_MAP.lunch;
  if (h >= 14 && h <= 16) return MEAL_MAP.snack;
  if (h >= 17 && h <= 20) return MEAL_MAP.dinner;
  return MEAL_MAP.night;
}

/**
 * 접속자 타임존 기준 자정(내일의 새로운 음식 메뉴 오픈)까지 남은 시간 계산
 */
export function getRemainingUntilMidnight(localParts) {
  const h = Number(localParts?.hour ?? 12);
  const m = Number(localParts?.minute ?? 0);
  const s = Number(localParts?.second ?? 0);

  const elapsedSeconds = h * 3600 + m * 60 + s;
  const totalDaySeconds = 24 * 3600;
  const remainingSeconds = Math.max(0, totalDaySeconds - elapsedSeconds);

  const remHours = Math.floor(remainingSeconds / 3600);
  const remMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const remSecs = remainingSeconds % 60;

  return {
    remainingSeconds,
    hours: remHours,
    minutes: remMinutes,
    seconds: remSecs,
    formatted: `${String(remHours).padStart(2, '0')}:${String(remMinutes).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`
  };
}

/**
 * 하단 스크롤용 5끼 배열 반환 (항상 아침 - 점심 - 간식 - 저녁 - 야식 고정 순서 유지)
 * + 현재 시각에 해당하는 끼니에 isCurrentSlot 플래그 표시
 */
export function getOrderedMealsWithCurrentFlag(hour) {
  const activeMeal = resolveActiveMealByHour(hour);
  return MEAL_CATEGORIES.map(cat => ({
    ...cat,
    isCurrentSlot: cat.key === activeMeal.key
  }));
}
