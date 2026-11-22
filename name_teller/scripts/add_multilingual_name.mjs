// scripts/add_multilingual_name.mjs
// 신규 이름 1개를 다국어 언어팩(data/i18n/names_*.json)에 일괄 추가/갱신하는 CLI 스크립트

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const i18nDir = path.join(dataDir, 'i18n');

if (!fs.existsSync(i18nDir)) {
  fs.mkdirSync(i18nDir, { recursive: true });
}

// 초성, 중성, 종성 테이블 (국립국어원 표준 로마자 & IPA 자동 생성기)
const CHO_ROMAN = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG_ROMAN = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const JONG_ROMAN = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'bs', 's', 'ss', 'ng', 't', 't', 'k', 't', 'p', 'h'];

const CHO_IPA = ['k', 'k͈', 'n', 't', 't͈', 'ɾ', 'm', 'p', 'p͈', 'sʰ', 's͈', '', 'tɕ', 't͈ɕ', 'tɕʰ', 'kʰ', 'tʰ', 'pʰ', 'h'];
const JUNG_IPA = ['a', 'ɛ', 'ja', 'jɛ', 'ʌ̹', 'e', 'jʌ̹', 'je', 'o', 'wa', 'wɛ', 'ø', 'jo', 'u', 'wʌ̹', 'we', 'ɥi', 'ju', 'ɯ', 'ɰi', 'i'];
const JONG_IPA = ['', 'k̚', 'k̚', 'k̚', 'n', 'n', 'n', 't̚', 'l', 'k̚', 'm', 'p̚', 't̚', 't̚', 'p̚', 'l', 'm', 'p̚', 'p̚', 't̚', 't̚', 'ŋ', 't̚', 't̚', 'k̚', 't̚', 'p̚', 'p̚'];

export function hangulToRoman(name) {
  const parts = [];
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i) - 0xAC00;
    if (code < 0 || code > 11171) {
      parts.push(name[i]);
      continue;
    }
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;
    const syl = CHO_ROMAN[cho] + JUNG_ROMAN[jung] + JONG_ROMAN[jong];
    parts.push(syl);
  }
  // 첫 글자 대문자, 음절 간 하이픈 연결 (예: Seo-yun)
  return parts.map((p, idx) => idx === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.toLowerCase()).join('-');
}

export function hangulToIpa(name) {
  const parts = [];
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i) - 0xAC00;
    if (code < 0 || code > 11171) {
      parts.push(name[i]);
      continue;
    }
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;
    const syl = (CHO_IPA[cho] || '') + (JUNG_IPA[jung] || '') + (JONG_IPA[jong] || '');
    parts.push(syl);
  }
  return parts.join('.');
}

/**
 * 신규 이름을 각 언어팩에 등록
 */
export function addMultilingualName({
  name,
  roman,
  ipa,
  hanja = '',
  translations = {}
}) {
  if (!name) throw new Error('name is required');

  const finalRoman = roman || hangulToRoman(name);
  const finalIpa = ipa || hangulToIpa(name);

  const supportedLangs = ['en', 'hi', 'ja', 'zh', 'es', 'vi'];
  const results = {};

  for (const lang of supportedLangs) {
    const filePath = path.join(i18nDir, `names_${lang}.json`);
    let data = {};
    if (fs.existsSync(filePath)) {
      try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {}
    }

    const t = translations[lang] || {};
    data[name] = {
      roman: finalRoman,
      ipa: finalIpa,
      hanja: hanja || data[name]?.hanja || '',
      poeticTitle: t.poeticTitle || data[name]?.poeticTitle || t.meaning || `${name} in ${lang}`,
      meaning: t.meaning || data[name]?.meaning || t.poeticTitle || ''
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    results[lang] = data[name];
  }

  return { name, roman: finalRoman, ipa: finalIpa, results };
}

// CLI 실행 지원
const args = process.argv.slice(2);
if (args.length > 0) {
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      params[key] = val;
    }
  }

  if (params.name) {
    const res = addMultilingualName({
      name: params.name,
      roman: params.roman,
      ipa: params.ipa,
      hanja: params.hanja,
      translations: {
        en: { poeticTitle: params.en },
        hi: { poeticTitle: params.hi },
        ja: { poeticTitle: params.ja },
        zh: { poeticTitle: params.zh },
        es: { poeticTitle: params.es },
        vi: { poeticTitle: params.vi }
      }
    });
    console.log(`[add_multilingual_name] Successfully added '${params.name}' to all language packs:`, res);
  }
}
