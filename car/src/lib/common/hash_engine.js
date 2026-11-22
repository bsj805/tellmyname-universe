// src/lib/common/hash_engine.js — Shared JSA-Hash (Jamo-Stroke Avalanche Hybrid Hash Engine)
// Reusable across all tellmyname.app family projects (myhome, occupation, food, car, name_teller)

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
 * 한 글자를 초성, 중성, 종성 및 자모별 획수로 분해 (name_teller 표준 규격)
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
 * 이름의 한글 자모 및 획수 정보, 인접 글자 획수 조화 단계(steps) 계산
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
 * 임의의 TOTAL_LEVELS(예: 1001 또는 20001)에 대해 결정론적 해시 매핑값을 계산
 */
export function computeJsaHashLevel(name, totalLevels = 1001) {
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

  const finalHash = fmix32(h1 ^ (decomp.length * totalLevels));
  return finalHash % totalLevels;
}
