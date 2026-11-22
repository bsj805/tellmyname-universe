// scripts/validate_food_translations.mjs
// Contract validator for per-language food translation files.
// Usage: node scripts/validate_food_translations.mjs [lang ...]
// File contract: data/i18n/foods/{lang}.json
//   { "00001": { "name": "...", "tagline": "..." }, ..., "00401": {...} }
// Rules:
//   - Every code in data/i18n/foods_source_ko.json must exist (no missing, no extra keys)
//   - name & tagline must be non-empty strings
//   - Non-ko languages must not contain Hangul (untranslated leftovers)
//   - Names must be unique within a language (no duplicate food names)

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SRC = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/i18n/foods_source_ko.json'), 'utf8'));
const DIR = path.join(ROOT, 'data/i18n/foods');
export const TARGET_LANGS = ['en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
const HANGUL = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;

export function validateLang(lang) {
  const errors = [];
  const file = path.join(DIR, `${lang}.json`);
  if (!fs.existsSync(file)) return { lang, ok: false, errors: ['file missing'], count: 0 };
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { lang, ok: false, errors: ['invalid JSON: ' + e.message], count: 0 }; }
  const codes = new Set(SRC.map(f => f.code));
  const names = new Map();
  for (const f of SRC) {
    const t = data[f.code];
    if (!t) { errors.push(`${f.code}: missing`); continue; }
    for (const k of ['name', 'tagline']) {
      if (typeof t[k] !== 'string' || !t[k].trim()) errors.push(`${f.code}: empty ${k}`);
      else if (HANGUL.test(t[k])) errors.push(`${f.code}: Hangul left in ${k}`);
    }
    if (t.name) {
      const n = t.name.trim().toLowerCase();
      if (names.has(n)) errors.push(`${f.code}: duplicate name with ${names.get(n)}`);
      names.set(n, f.code);
    }
  }
  for (const k of Object.keys(data)) if (!codes.has(k)) errors.push(`${k}: extra key`);
  return { lang, ok: errors.length === 0, errors, count: Object.keys(data).length };
}

if (process.argv[1] && process.argv[1].endsWith('validate_food_translations.mjs')) {
  const langs = process.argv.slice(2).length ? process.argv.slice(2) : TARGET_LANGS;
  let allOk = true;
  for (const l of langs) {
    const r = validateLang(l);
    allOk &&= r.ok;
    console.log(`${r.ok ? 'PASS' : 'FAIL'} [${l}] entries=${r.count}/${SRC.length} errors=${r.errors.length}`);
    r.errors.slice(0, 15).forEach(e => console.log('   - ' + e));
  }
  process.exit(allOk ? 0 : 1);
}
