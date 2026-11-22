// scripts/build_i18n_bundles.mjs
// Builds minified web/i18n/foods/{lang}.json bundles from data/i18n/foods/{lang}.json
// Generates web/i18n/foods/ko.json from data/i18n/foods_source_ko.json
// Idempotent and safe to run whenever more translations land.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_DIR = path.join(ROOT_DIR, 'data', 'i18n', 'foods');
const KO_SOURCE_FILE = path.join(ROOT_DIR, 'data', 'i18n', 'foods_source_ko.json');
const WEB_OUT_DIR = path.join(ROOT_DIR, 'web', 'i18n', 'foods');
const DIST_OUT_DIR = path.join(ROOT_DIR, 'dist', 'i18n', 'foods');

const TARGET_LANGS = ['en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];

export function buildBundles() {
  console.log('=== [Mukbang] Building i18n Food Translation Bundles ===');

  // Ensure output directory exists
  fs.mkdirSync(WEB_OUT_DIR, { recursive: true });
  const hasDist = fs.existsSync(path.join(ROOT_DIR, 'dist'));
  if (hasDist) {
    fs.mkdirSync(DIST_OUT_DIR, { recursive: true });
  }

  const summary = {
    bundled: [],
    missing: []
  };

  // 1. Build ko.json from foods_source_ko.json
  if (fs.existsSync(KO_SOURCE_FILE)) {
    try {
      const koSource = JSON.parse(fs.readFileSync(KO_SOURCE_FILE, 'utf8'));
      const koDict = {};
      for (const item of koSource) {
        if (item && item.code) {
          koDict[item.code] = {
            name: item.name,
            tagline: item.tagline || ''
          };
        }
      }
      const koMinified = JSON.stringify(koDict);
      const koWebPath = path.join(WEB_OUT_DIR, 'ko.json');
      fs.writeFileSync(koWebPath, koMinified, 'utf8');

      if (hasDist) {
        fs.writeFileSync(path.join(DIST_OUT_DIR, 'ko.json'), koMinified, 'utf8');
      }

      const count = Object.keys(koDict).length;
      summary.bundled.push({ lang: 'ko', count, size: Buffer.byteLength(koMinified, 'utf8') });
    } catch (err) {
      console.error('Error generating ko.json:', err);
    }
  } else {
    console.warn(`Warning: Korean source file not found at ${KO_SOURCE_FILE}`);
  }

  // 2. Process Target Languages
  for (const lang of TARGET_LANGS) {
    const srcFile = path.join(DATA_DIR, `${lang}.json`);
    if (fs.existsSync(srcFile)) {
      try {
        const raw = fs.readFileSync(srcFile, 'utf8');
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        const destPath = path.join(WEB_OUT_DIR, `${lang}.json`);
        fs.writeFileSync(destPath, minified, 'utf8');

        if (hasDist) {
          fs.writeFileSync(path.join(DIST_OUT_DIR, `${lang}.json`), minified, 'utf8');
        }

        const count = Object.keys(parsed).length;
        summary.bundled.push({ lang, count, size: Buffer.byteLength(minified, 'utf8') });
      } catch (e) {
        console.warn(`[${lang}] Failed to parse/minify: ${e.message}`);
        summary.missing.push(lang);
      }
    } else {
      summary.missing.push(lang);
    }
  }

  // 3. Print Summary
  console.log('\n--- Bundling Summary ---');
  console.log(`Bundled Languages (${summary.bundled.length}):`);
  for (const b of summary.bundled) {
    const kb = (b.size / 1024).toFixed(1);
    console.log(`  ✔ [${b.lang}] entries: ${b.count}, size: ${kb} KB -> web/i18n/foods/${b.lang}.json`);
  }

  if (summary.missing.length > 0) {
    console.log(`Missing Languages (${summary.missing.length}):`);
    console.log(`  ⏳ [${summary.missing.join(', ')}] (gracefully fallback to englishName / ko)`);
  } else {
    console.log('  🎉 All 14 languages successfully bundled!');
  }
  console.log('------------------------\n');

  return summary;
}

if (process.argv[1] && process.argv[1].endsWith('build_i18n_bundles.mjs')) {
  buildBundles();
}
