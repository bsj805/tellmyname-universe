// web/js/i18n.js — 다국어(i18n) 통합 관리 모듈
// 지원 언어: 한국어(ko), 영어(en), 베트남어(vi), 프랑스어(fr), 포르투갈(pt-BR), 스페인(es),
// 인도네시아(id), 러시아(ru), 독일(de), 이탈리아(it), 일본(ja), 중국(zh)

import { DICTIONARY } from './i18n_dict.js';
import { on, emit } from './core.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'ko', label: '한국어', flag: '🇰🇷', native: '한국어' },
  { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', native: 'Tiếng Việt' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', native: 'Français' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', native: 'Português' },
  { code: 'es', label: 'Español', flag: '🇪🇸', native: 'Español' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', native: 'Indonesia' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', native: 'Русский' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', native: '日本語' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳', native: '简体中文' }
];

const STORAGE_KEY = 'name_teller_lang';

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DICTIONARY[saved]) return saved;
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && DICTIONARY[urlParam]) return urlParam;
    const navLangs = navigator.languages || [navigator.language || 'ko'];
    for (const l of navLangs) {
      const code2 = l.slice(0, 2).toLowerCase();
      if (DICTIONARY[code2]) return code2;
    }
  } catch {
    // fallback
  }
  return 'ko';
}

let currentLang = detectInitialLang();

export function getLang() {
  return currentLang;
}

export function setLang(langCode) {
  if (!DICTIONARY[langCode]) return;
  currentLang = langCode;
  try {
    localStorage.setItem(STORAGE_KEY, langCode);
    document.documentElement.lang = langCode;
  } catch {}
  emit('lang:change', langCode);
  applyTranslations();
}

/**
 * 번역 문자열 조회
 * key 예: 'search.placeholder', 'card.meaning_title'
 */
export function t(key, params = {}) {
  const dict = DICTIONARY[currentLang] || DICTIONARY['ko'] || {};
  let str = dict[key] || (DICTIONARY['en'] && DICTIONARY['en'][key]) || (DICTIONARY['ko'] && DICTIONARY['ko'][key]) || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`{${k}}`, 'g'), v);
  }
  return str;
}

/**
 * data-i18n="key" 및 data-i18n-attr="attr:key" 속성을 가진 DOM 요소 자동 번역
 */
export function applyTranslations(root = document) {
  const elems = root.querySelectorAll('[data-i18n]');
  elems.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  const attrElems = root.querySelectorAll('[data-i18n-placeholder]');
  attrElems.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });

  const titleElems = root.querySelectorAll('[data-i18n-title]');
  titleElems.forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });

  const ariaElems = root.querySelectorAll('[data-i18n-aria]');
  ariaElems.forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  });
}
