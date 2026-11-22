// scripts/build_level_name_map.mjs — Generates src/lib/level_name_map.js for 0..1000 occupation levels
// Maps each of the 1,001 levels (0..1000) to representative Korean and multilingual names from data/seed_names_50k.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MIN_LEVEL, MAX_LEVEL, TOTAL_LEVELS } from '../src/lib/constants.js';
import { mapNameToJobLevel } from '../src/lib/hash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const seed50k = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/seed_names_50k.json'), 'utf8'));

const LANG_CANDIDATES = {
  ko: [],
  en: ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Logan', 'Charlotte', 'Jacob', 'Amelia', 'Jackson', 'Harper', 'Aiden', 'Evelyn'],
  hi: ['Aarav', 'Diya', 'Vihaan', 'Ananya', 'Rohan', 'Aditya', 'Priya', 'Arjun', 'Kavya', 'Kabir'],
  vi: ['Minh', 'Linh', 'Anh', 'Hùng', 'Trang', 'Nam', 'Hương', 'Dũng', 'Lan', 'Tuấn'],
  fr: ['Lucas', 'Emma', 'Gabriel', 'Chloé', 'Jules', 'Léa', 'Louis', 'Manon', 'Hugo', 'Camille'],
  pt: ['Miguel', 'Helena', 'Arthur', 'Alice', 'Gael', 'Laura', 'Heitor', 'Manuela', 'Theo', 'Valentina'],
  es: ['Mateo', 'Sofía', 'Santiago', 'Valentina', 'Leo', 'Isabella', 'Sebastián', 'Camila', 'Alejandro', 'Valeria'],
  id: ['Budi', 'Siti', 'Rizky', 'Putri', 'Agus', 'Dewi', 'Eko', 'Ayu', 'Fajar', 'Nur'],
  ru: ['Александр', 'София', 'Максим', 'Анна', 'Михаил', 'Мария', 'Артем', 'Алиса', 'Иван', 'Виктория'],
  de: ['Noah', 'Emilia', 'Matteo', 'Mia', 'Leon', 'Hannah', 'Paul', 'Sophia', 'Ben', 'Emma'],
  it: ['Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Alessandro', 'Giulia', 'Lorenzo', 'Ginevra', 'Mattia', 'Alice'],
  ja: ['Haruto', 'Yui', 'Sora', 'Hina', 'Ren', 'Aoi', 'Yuto', 'Sakura', 'Sota', 'Rin'],
  zh: ['Wei', 'Fang', 'Hao', 'Yuhan', 'Zihan', 'Yichen', 'Xinyi', 'Haoran', 'Zixuan', 'Yuxuan'],
  ms: ['Aisyah', 'Ahmad', 'Nur', 'Muhammad', 'Siti', 'Amir', 'Farah', 'Zainal', 'Hana', 'Adam']
};

const levelMap = {};
for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
  levelMap[lv] = {};
}

for (const name of seed50k) {
  const lv = mapNameToJobLevel(name);
  const entry = levelMap[lv];
  if (!entry) continue;
  const isKo = /^[가-힣]+$/.test(name);
  if (isKo && !entry.ko) {
    entry.ko = name;
    entry.default = name;
  } else if (!isKo && /^[A-Za-z\s-]+$/.test(name) && !entry.en) {
    entry.en = name;
  }
}

const langCodes = Object.keys(LANG_CANDIDATES);
for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
  const entry = levelMap[lv];
  if (!entry.ko) {
    entry.ko = `홍길동${lv}`;
    entry.default = entry.ko;
  }
  if (!entry.en) {
    const pool = LANG_CANDIDATES.en;
    entry.en = pool[lv % pool.length];
  }
  for (const code of langCodes) {
    if (code === 'ko' || code === 'en') continue;
    const pool = LANG_CANDIDATES[code];
    entry[code] = pool[lv % pool.length];
  }
}

const outCode = `// src/lib/level_name_map.js — Auto-generated mapping from 1,001 occupation levels (0..1000) to sitemap names
// job.tellmyname.app

import { MIN_LEVEL, MAX_LEVEL } from './constants.js';

export const LEVEL_TO_NAME_MAP = ${JSON.stringify(levelMap, null, 2)};

/**
 * Returns representative sitemap name for a given occupation level (0..1000) and language code.
 */
export function getSitemapNameForLevel(level, lang = 'ko') {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const entry = LEVEL_TO_NAME_MAP[String(lv)];
  if (!entry) return lang === 'ko' ? '홍길동' : 'Steve';
  return entry[lang] || entry.ko || entry.default || '홍길동';
}
`;

const targetPath = path.join(ROOT_DIR, 'src/lib/level_name_map.js');
fs.writeFileSync(targetPath, outCode, 'utf8');
console.log(`✔ Generated src/lib/level_name_map.js for ${TOTAL_LEVELS} levels (0..${MAX_LEVEL})`);
