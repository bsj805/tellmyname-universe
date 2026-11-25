// web/js/share.js — Unified 1-Button Share Modal Controller for Mukbang (/food)

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  MEAL_KEYS,
  formatFoodCode
} from '../../src/lib/constants.js';

import {
  DEFAULT_TIMEZONE
} from '../../src/lib/timezone.js';

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
} from './share_core.js?v=20261125';

export function getAppLang() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
    return normalizeLang(document.documentElement.lang);
  }
  return 'ko';
}

export function showToast(message, duration = 3000) {
  coreShowToast(message, duration);
}

export async function copyToClipboard(text, successMessage = null) {
  return coreCopyToClipboard(text, successMessage);
}

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
    if (food.tagline) lines.push(`   "${food.tagline}"`);
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
    meals: Array.from(selectedSet),
    lang: currentLang
  });
  lines.push(shareUrl);

  return {
    title: t(currentLang, 'kakaoShareTitle', { name: effectiveName, count: selectedSet.size }),
    text: lines.join('\n'),
    url: shareUrl
  };
}

export function buildWhatsAppShareText({ dailyData, selectedMealKeys = [], name = '김서윤', dateStr = '', lang = null } = {}) {
  const payload = buildKakaoShareText({ dailyData, selectedMealKeys, name, dateStr, lang });
  return payload;
}

export async function drawStoryCanvas(canvas, { dailyData, selectedMealKeys = ['lunch'], theme = 'cream', lang = null, singleFood = null } = {}) {
  const currentLang = normalizeLang(lang || getAppLang());
  if (singleFood) {
    return renderStoryCanvas({
      mode: 'food',
      lang: currentLang,
      theme,
      canvas,
      items: [singleFood]
    });
  }

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

export async function downloadStoryImage(canvas, filename = 'mukbang_card.png') {
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

export async function shareStoryImage(canvas, filename = 'mukbang_card.png', shareData = {}) {
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

class ShareModalController {
  constructor() {
    this.modalEl = null;
    this.canvasEl = null;
    this.dailyData = null;
    this.singleFood = null;
    this.selectedKeys = ['lunch'];
    this.activeTheme = 'cream';
    this.mode = 'selective'; // 'selective' | 'daily_all' | 'food_single'
    this.renderPromise = null;
  }

  init() {
    if (typeof document === 'undefined') return;
    this.modalEl = document.getElementById('share-modal');
    this.canvasEl = document.getElementById('story-canvas');
    if (!this.modalEl || !this.canvasEl) return;

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    const tabSelective = document.getElementById('tab-mode-selective');
    const tabDailyAll = document.getElementById('tab-mode-daily-all');
    if (tabSelective) tabSelective.addEventListener('click', () => this.setMode('selective'));
    if (tabDailyAll) tabDailyAll.addEventListener('click', () => this.setMode('daily_all'));

    const checkboxes = this.modalEl.querySelectorAll('.modal-meal-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => this.onMealCheckboxChange());
    });

    const themeChips = this.modalEl.querySelectorAll('.theme-chip');
    themeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        themeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeTheme = chip.dataset.theme || 'cream';
        this.renderCanvas();
      });
    });

    const getFilename = () => {
      if (this.singleFood) {
        const code = this.singleFood.code || formatFoodCode(this.singleFood.index || 1);
        return `mukbang_food_${code}.png`;
      }
      const name = (this.dailyData?.name || 'mukbang').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
      const date = this.dailyData?.date || 'today';
      return `mukbang_${name}_${date}.png`;
    };

    const getCurrentShareUrl = () => {
      const currentLang = getAppLang();
      if (this.singleFood) {
        const code = this.singleFood.code || formatFoodCode(this.singleFood.index || 1);
        return `${SITE_ORIGIN}/food/${code}${currentLang !== 'ko' ? '?lang=' + currentLang : ''}`;
      }
      return buildShareUrl({
        name: this.dailyData?.name || '김서윤',
        date: this.dailyData?.date || '',
        meals: this.selectedKeys,
        lang: currentLang
      });
    };

    // Unified Primary Button: Save & Share Image
    const storyBtn = document.getElementById('modal-share-story-btn');
    if (storyBtn) {
      storyBtn.addEventListener('click', async () => {
        if (this.renderPromise) await this.renderPromise;
        const filename = getFilename();
        const url = getCurrentShareUrl();
        const title = this.singleFood
          ? `${this.singleFood.name} — ${t(getAppLang(), 'brandTitle')}`
          : `${this.dailyData?.name || ''} — ${t(getAppLang(), 'brandTitle')}`;
        await shareStoryImage(this.canvasEl, filename, { title, text: `${title}\n${url}`, url });
      });
    }

    // Secondary Helper: Direct PNG Download
    const downloadBtn = document.getElementById('modal-download-png-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        if (this.renderPromise) await this.renderPromise;
        await downloadStoryImage(this.canvasEl, getFilename());
      });
    }

    // Secondary Helper: Copy Link
    const linkBtn = document.getElementById('modal-copy-link-btn');
    if (linkBtn) {
      linkBtn.addEventListener('click', () => {
        const currentLang = getAppLang();
        copyToClipboard(getCurrentShareUrl(), t(currentLang, 'toastLinkCopied'));
      });
    }
  }

  setMode(mode) {
    this.mode = mode;
    const modeTabsWrap = this.modalEl?.querySelector('.share-mode-tabs');
    const tabSelective = document.getElementById('tab-mode-selective');
    const tabDailyAll = document.getElementById('tab-mode-daily-all');
    const selectorWrap = document.getElementById('modal-meal-selector-wrap');

    if (mode === 'food_single') {
      if (modeTabsWrap) modeTabsWrap.style.display = 'none';
      if (selectorWrap) selectorWrap.style.display = 'none';
    } else {
      if (modeTabsWrap) modeTabsWrap.style.display = 'grid';
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
    }

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
    const labelEl = document.getElementById('tab-selective-label');
    const currentLang = getAppLang();
    if (labelEl) {
      labelEl.textContent = t(currentLang, 'tabSelective', { count: this.selectedKeys.length });
      return;
    }
    const countEl = document.getElementById('modal-selected-count');
    if (countEl) {
      countEl.textContent = String(this.selectedKeys.length);
    }
  }

  open({ dailyData, initialMealKeys = ['lunch'], mode = 'selective' } = {}) {
    this.singleFood = null;
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

  openFood(foodObj) {
    if (!foodObj) return;
    this.singleFood = foodObj;
    if (this.modalEl) {
      this.modalEl.classList.add('open');
      this.modalEl.setAttribute('aria-hidden', 'false');
    }
    this.setMode('food_single');
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      this.modalEl.setAttribute('aria-hidden', 'true');
    }
  }

  renderCanvas() {
    if (!this.canvasEl) return null;
    if (!this.singleFood && !this.dailyData) return null;
    this.renderPromise = drawStoryCanvas(this.canvasEl, {
      dailyData: this.dailyData,
      selectedMealKeys: this.selectedKeys,
      theme: this.activeTheme,
      singleFood: this.singleFood
    });
    return this.renderPromise;
  }
}

export const shareModal = new ShareModalController();
