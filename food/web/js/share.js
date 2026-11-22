// web/js/share.js — Feature #5 & #12: Instagram Story & KakaoTalk Share Integration
// Delegates core canvas rendering and sharing logic to share_core.js

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  MEAL_KEYS,
  MEAL_MAP,
  FOOD_ORIGIN_GROUPS,
  formatFoodCode,
  getFoodImageUrl
} from '../../src/lib/constants.js';

import {
  DEFAULT_TIMEZONE,
  getLocalTimeParts
} from '../../src/lib/timezone.js';

import {
  recommendDailyMeals
} from '../../src/lib/hash.js';

import * as FoodDatasetModule from '../../src/lib/food_dataset.js';
import { t, normalizeLang } from '../../src/lib/i18n.js';

import {
  renderStoryCanvas,
  canvasToBlob,
  shareImage,
  downloadImage,
  shareKakaoText,
  shareWhatsAppText,
  copyToClipboard as coreCopyToClipboard,
  showToast as coreShowToast
} from './share_core.js';

export function getAppLang() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
    return normalizeLang(document.documentElement.lang);
  }
  return 'ko';
}

/**
 * Toast Notification Utility (re-export from share_core)
 */
export function showToast(message, duration = 3000) {
  coreShowToast(message, duration);
}

/**
 * Clipboard Copy with Fallback (re-export from share_core)
 */
export async function copyToClipboard(text, successMessage = null) {
  return coreCopyToClipboard(text, successMessage);
}

/**
 * Share URL Builder
 * Generates canonical permanent URL with query params
 */
export function buildShareUrl({ name = '김서윤', date = '', tz = 'Asia/Seoul', meals = [], lang = null } = {}) {
  const url = new URL(SITE_ORIGIN);
  const currentLang = normalizeLang(lang || getAppLang());
  if (name) url.searchParams.set('name', name);
  if (date) url.searchParams.set('date', date);
  if (tz && tz !== DEFAULT_TIMEZONE) url.searchParams.set('tz', tz);
  if (currentLang && currentLang !== 'ko') url.searchParams.set('lang', currentLang);

  if (Array.isArray(meals) && meals.length > 0) {
    if (meals.length === MEAL_CATEGORIES.length) {
      url.searchParams.set('meals', 'all');
    } else {
      url.searchParams.set('meals', meals.join(','));
    }
  }
  return url.toString();
}

/**
 * KakaoTalk Rich Text Message Builder
 */
export function buildKakaoShareText({ dailyData, selectedMealKeys = [], name = '김서윤', dateStr = '', lang = null } = {}) {
  const currentLang = normalizeLang(lang || getAppLang());
  const dateFormatted = dateStr || dailyData?.date || '';
  const effectiveName = name || dailyData?.name || '김서윤';
  const mealsList = dailyData?.orderedList || [];
  const selectedSet = new Set(selectedMealKeys.length > 0 ? selectedMealKeys : MEAL_KEYS);

  const siteTitle = t(currentLang, 'brandTitle');
  const lines = [
    t(currentLang, 'kakaoHeader', { siteName: siteTitle }),
    t(currentLang, 'kakaoTitle', { name: effectiveName, date: dateFormatted }),
    ''
  ];

  let totalCalories = 0;

  for (const entry of mealsList) {
    if (!selectedSet.has(entry.mealKey)) continue;
    const food = entry.food;
    if (!food) continue;

    const mealLabel = t(currentLang, 'meal_' + entry.mealKey);
    const originBadge = t(currentLang, 'origin_' + food.originGroup);
    lines.push(`${entry.mealEmoji} ${mealLabel}: ${food.name} (${originBadge})`);
    if (food.tagline) {
      lines.push(`   "${food.tagline}"`);
    }
    if (food.calories) {
      const match = String(food.calories).match(/(\d+)/);
      if (match) totalCalories += parseInt(match[1], 10);
    }
  }

  if (totalCalories > 0 && selectedSet.size >= 3) {
    lines.push('');
    lines.push(t(currentLang, 'kakaoTotalCal', { calories: totalCalories.toLocaleString() }));
  }

  lines.push('');
  lines.push(t(currentLang, 'kakaoCta'));
  const shareUrl = buildShareUrl({
    name: effectiveName,
    date: dateFormatted,
    meals: Array.from(selectedSet)
  });
  lines.push(shareUrl);

  return {
    title: t(currentLang, 'kakaoShareTitle', { name: effectiveName, count: selectedSet.size }),
    text: lines.join('\n'),
    url: shareUrl
  };
}

/**
 * WhatsApp Formatted Text Message Builder
 */
export function buildWhatsAppShareText({ dailyData, selectedMealKeys = [], name = '김서윤', dateStr = '', lang = null } = {}) {
  const currentLang = normalizeLang(lang || getAppLang());
  const dateFormatted = dateStr || dailyData?.date || '';
  const effectiveName = name || dailyData?.name || '김서윤';
  const mealsList = dailyData?.orderedList || [];
  const selectedSet = new Set(selectedMealKeys.length > 0 ? selectedMealKeys : MEAL_KEYS);

  const siteTitle = t(currentLang, 'brandTitle');
  const lines = [
    `*${siteTitle}* — ${t(currentLang, 'kakaoTitle', { name: effectiveName, date: dateFormatted })}`,
    ''
  ];

  let totalCalories = 0;

  for (const entry of mealsList) {
    if (!selectedSet.has(entry.mealKey)) continue;
    const food = entry.food;
    if (!food) continue;

    const mealLabel = t(currentLang, 'meal_' + entry.mealKey);
    const originBadge = t(currentLang, 'origin_' + food.originGroup);
    lines.push(`${entry.mealEmoji} *${mealLabel}*: ${food.name} _(${originBadge})_`);
    if (food.tagline) {
      lines.push(`   "${food.tagline}"`);
    }
    if (food.calories) {
      const match = String(food.calories).match(/(\d+)/);
      if (match) totalCalories += parseInt(match[1], 10);
    }
  }

  if (totalCalories > 0 && selectedSet.size >= 3) {
    lines.push('');
    lines.push(`🔥 ${t(currentLang, 'kakaoTotalCal', { calories: totalCalories.toLocaleString() })}`);
  }

  lines.push('');
  lines.push(t(currentLang, 'kakaoCta'));
  const shareUrl = buildShareUrl({
    name: effectiveName,
    date: dateFormatted,
    meals: Array.from(selectedSet),
    lang: currentLang
  });
  lines.push(shareUrl);

  return {
    title: `${siteTitle} · ${effectiveName}`,
    text: lines.join('\n'),
    url: shareUrl
  };
}

/**
 * Delegate drawStoryCanvas to renderStoryCanvas in share_core.js
 */
export async function drawStoryCanvas(canvas, { dailyData, selectedMealKeys = ['lunch'], theme = 'amber', lang = null } = {}) {
  const currentLang = normalizeLang(lang || getAppLang());
  const selectedKeys = Array.isArray(selectedMealKeys) && selectedMealKeys.length > 0
    ? selectedMealKeys
    : ['lunch'];

  let mode = 'single';
  if (selectedKeys.length === 5) {
    mode = 'daily';
  } else if (selectedKeys.length > 1) {
    mode = 'multi';
  }

  return renderStoryCanvas({
    mode,
    lang: currentLang,
    theme,
    canvas,
    dailyData,
    selectedMealKeys: selectedKeys,
    name: dailyData?.name || '김서윤',
    dateText: dailyData?.date || ''
  });
}

/**
 * Download Canvas Image as PNG
 */
export async function downloadStoryImage(canvas, filename = 'mukbang_today_story.png') {
  if (!canvas) return;
  const currentLang = getAppLang();
  try {
    const blob = await canvasToBlob(canvas);
    downloadImage(blob, filename);
    showToast(t(currentLang, 'toastStorySaved'));
  } catch (err) {
    console.error('Download error:', err);
    showToast(t(currentLang, 'toastStoryError'));
  }
}

/**
 * Mobile Native Share (Instagram Story / Web Share API with File)
 */
export async function shareStoryImage(canvas, filename = 'mukbang_today_story.png', shareData = {}) {
  if (!canvas) return;
  const currentLang = getAppLang();
  try {
    const blob = await canvasToBlob(canvas);
    await shareImage({
      blob,
      filename,
      title: shareData.title || t(currentLang, 'modalTitle'),
      text: shareData.text || t(currentLang, 'kakaoCta'),
      url: shareData.url || undefined,
      lang: currentLang
    });
  } catch (err) {
    console.error('Share story error:', err);
    showToast(t(currentLang, 'toastStoryError'));
  }
}

/**
 * Share Modal Manager (State & Event Binding)
 */
class ShareModalController {
  constructor() {
    this.modalEl = null;
    this.canvasEl = null;
    this.dailyData = null;
    this.selectedKeys = ['lunch'];
    this.activeTheme = 'amber';
    this.mode = 'selective'; // 'selective' | 'daily_all'
  }

  init() {
    if (typeof document === 'undefined') return;
    this.modalEl = document.getElementById('share-modal');
    this.canvasEl = document.getElementById('story-canvas');
    if (!this.modalEl || !this.canvasEl) return;

    // Close button & backdrop click
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    // Mode Tabs
    const tabSelective = document.getElementById('tab-mode-selective');
    const tabDailyAll = document.getElementById('tab-mode-daily-all');
    if (tabSelective) {
      tabSelective.addEventListener('click', () => {
        this.setMode('selective');
      });
    }
    if (tabDailyAll) {
      tabDailyAll.addEventListener('click', () => {
        this.setMode('daily_all');
      });
    }

    // Meal Checkboxes
    const checkboxes = this.modalEl.querySelectorAll('.modal-meal-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        this.onMealCheckboxChange();
      });
    });

    // Theme Chips
    const themeChips = this.modalEl.querySelectorAll('.theme-chip');
    themeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        themeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeTheme = chip.dataset.theme || 'amber';
        this.renderCanvas();
      });
    });

    // Action 1: Instagram Story
    const storyBtn = document.getElementById('modal-share-story-btn');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        const name = this.dailyData?.name || '김서윤';
        const date = this.dailyData?.date || 'today';
        const filename = `mukbang_${name}_${date}_story.png`;
        const payload = buildKakaoShareText({
          dailyData: this.dailyData,
          selectedMealKeys: this.selectedKeys,
          name,
          dateStr: date
        });
        shareStoryImage(this.canvasEl, filename, payload);
      });
    }

    // Action 2: KakaoTalk
    const kakaoBtn = document.getElementById('modal-share-kakao-btn');
    if (kakaoBtn) {
      kakaoBtn.addEventListener('click', async () => {
        const currentLang = getAppLang();
        const name = this.dailyData?.name || '김서윤';
        const date = this.dailyData?.date || '';
        const payload = buildKakaoShareText({
          dailyData: this.dailyData,
          selectedMealKeys: this.selectedKeys,
          name,
          dateStr: date
        });

        await shareKakaoText({
          title: payload.title,
          text: payload.text,
          url: payload.url,
          lang: currentLang
        });
      });
    }

    // Action 2b: WhatsApp
    const waBtn = document.getElementById('modal-share-whatsapp-btn');
    if (waBtn) {
      waBtn.addEventListener('click', async () => {
        const currentLang = getAppLang();
        const name = this.dailyData?.name || '김서윤';
        const date = this.dailyData?.date || '';
        const payload = buildWhatsAppShareText({
          dailyData: this.dailyData,
          selectedMealKeys: this.selectedKeys,
          name,
          dateStr: date,
          lang: currentLang
        });

        await shareWhatsAppText({
          title: payload.title,
          text: payload.text,
          url: payload.url,
          lang: currentLang
        });
      });
    }

    // Action 3: Download Image (PNG)
    const downloadBtn = document.getElementById('modal-download-png-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const name = this.dailyData?.name || '김서윤';
        const date = this.dailyData?.date || 'today';
        const filename = `mukbang_${name}_${date}_story.png`;
        downloadStoryImage(this.canvasEl, filename);
      });
    }

    // Action 4: Copy Link
    const linkBtn = document.getElementById('modal-copy-link-btn');
    if (linkBtn) {
      linkBtn.addEventListener('click', () => {
        const currentLang = getAppLang();
        const name = this.dailyData?.name || '김서윤';
        const date = this.dailyData?.date || '';
        const url = buildShareUrl({
          name,
          date,
          meals: this.selectedKeys
        });
        copyToClipboard(url, t(currentLang, 'toastLinkCopied'));
      });
    }
  }

  setMode(mode) {
    this.mode = mode;
    const tabSelective = document.getElementById('tab-mode-selective');
    const tabDailyAll = document.getElementById('tab-mode-daily-all');
    const selectorWrap = document.getElementById('modal-meal-selector-wrap');

    if (mode === 'daily_all') {
      tabDailyAll?.classList.add('active');
      tabSelective?.classList.remove('active');
      if (selectorWrap) selectorWrap.style.display = 'none';
      this.selectedKeys = [...MEAL_KEYS];
    } else {
      tabSelective?.classList.add('active');
      tabDailyAll?.classList.remove('active');
      if (selectorWrap) selectorWrap.style.display = 'flex';
      this.syncCheckboxes();
    }

    this.updateSelectedCountText();
    this.renderCanvas();
  }

  syncCheckboxes() {
    if (!this.modalEl) return;
    const checkboxes = this.modalEl.querySelectorAll('.modal-meal-checkbox');
    const selected = [];
    checkboxes.forEach(cb => {
      if (cb.checked) selected.push(cb.value);
    });
    this.selectedKeys = selected.length > 0 ? selected : ['lunch'];
  }

  onMealCheckboxChange() {
    this.syncCheckboxes();
    this.updateSelectedCountText();
    this.renderCanvas();
  }

  updateSelectedCountText() {
    const countEl = document.getElementById('modal-selected-count');
    if (countEl) {
      countEl.textContent = String(this.selectedKeys.length);
    }
  }

  open({ dailyData, initialMealKeys = ['lunch'], mode = 'selective' } = {}) {
    this.dailyData = dailyData;
    this.selectedKeys = Array.isArray(initialMealKeys) && initialMealKeys.length > 0
      ? initialMealKeys
      : ['lunch'];

    if (this.modalEl) {
      const checkboxes = this.modalEl.querySelectorAll('.modal-meal-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = this.selectedKeys.includes(cb.value);
      });
      this.modalEl.classList.add('open');
      this.modalEl.setAttribute('aria-hidden', 'false');
    }

    this.setMode(mode);
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      this.modalEl.setAttribute('aria-hidden', 'true');
    }
  }

  async renderCanvas() {
    if (!this.canvasEl || !this.dailyData) return;
    await drawStoryCanvas(this.canvasEl, {
      dailyData: this.dailyData,
      selectedMealKeys: this.selectedKeys,
      theme: this.activeTheme
    });
  }
}

export const shareModal = new ShareModalController();
