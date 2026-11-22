// src/lib/common/prng.js — Deterministic Seeded PRNG (mulberry32) & Fisher-Yates Tournament Shuffler
// Shared across tellmyname.app Worldcup modules

export function mulberry32(seedInt) {
  let a = seedInt >>> 0;
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalizeSeed(rawSeed) {
  if (rawSeed === undefined || rawSeed === null || String(rawSeed).trim() === '') {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
  return String(rawSeed).trim();
}

export function seedToInt(seedStr) {
  const s = String(seedStr || '0').trim();
  if (/^\d+$/.test(s)) {
    return parseInt(s, 10) >>> 0;
  }
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededShuffle(items, seedStr) {
  const arr = [...items];
  const rand = mulberry32(seedToInt(seedStr));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
