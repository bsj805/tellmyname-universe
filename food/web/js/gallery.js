// web/js/gallery.js — Feature #14: Illustration Gallery Tab, Category Random Picker & Enlarged Food Showcase
// Supports:
// - Category filtering across 3 domains: Meals (5), Origins (7), Delivery Categories (10)
// - Live multilingual search (Current language translation, Korean name, English name)
// - Category-constrained random pick (Math.random)
// - Enlarged Food Detail View (/food/{code}) with 4 share actions (Story, KakaoTalk, Save PNG, Copy Link)
// - Same-category random recommendation
// - History pushState SPA client routing

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  FOOD_ORIGIN_GROUPS,
  formatFoodCode,
  getFoodImageUrl
} from '../../src/lib/constants.js';

import {
  ALL_FOODS,
  FOODS_BY_CODE
} from '../../src/lib/food_dataset.js';

import {
  SUPPORTED_LANG_CODES,
  t,
  normalizeLang,
  localizeFood
} from '../../src/lib/i18n.js';

import {
  renderStoryCanvas,
  canvasToBlob,
  shareImage,
  downloadImage,
  shareKakaoText,
  shareWhatsAppText,
  copyToClipboard,
  showToast,
  formatPriceForLang
} from './share_core.js';

/**
 * Gallery Filter Category Definitions
 */
export const GALLERY_CATEGORIES = [
  { key: 'all', group: 'all', label: '전체', enLabel: 'All', emoji: '✨' },
  // 1. Meals (5)
  { key: 'meal:breakfast', group: 'meal', mealKey: 'breakfast', label: '아침', enLabel: 'Breakfast', emoji: '🌅' },
  { key: 'meal:lunch', group: 'meal', mealKey: 'lunch', label: '점심', enLabel: 'Lunch', emoji: '☀️' },
  { key: 'meal:snack', group: 'meal', mealKey: 'snack', label: '간식', enLabel: 'Snack', emoji: '🍰' },
  { key: 'meal:dinner', group: 'meal', mealKey: 'dinner', label: '저녁', enLabel: 'Dinner', emoji: '🌙' },
  { key: 'meal:night', group: 'meal', mealKey: 'night', label: '야식', enLabel: 'Late-night', emoji: '🦉' },
  // 2. Origins (7)
  { key: 'origin:school', group: 'origin', originKey: 'SCHOOL_LUNCH', label: '급식', enLabel: 'School Lunch', emoji: '🍱' },
  { key: 'origin:michelin', group: 'origin', originKey: 'MICHELIN', label: '미슐랭', enLabel: 'Michelin Star', emoji: '⭐' },
  { key: 'origin:bib', group: 'origin', originKey: 'BIB_GOURMAND', label: '빕구르망', enLabel: 'Bib Gourmand', emoji: '🏅' },
  { key: 'origin:raw', group: 'origin', originKey: 'RAW_NATURAL', label: '자연식', enLabel: 'Raw & Natural', emoji: '🥕' },
  { key: 'origin:unique', group: 'origin', originKey: 'UNIQUE_SPECIAL', label: '특이메뉴', enLabel: 'Special Menu', emoji: '🧪' },
  { key: 'origin:korean', group: 'origin', originKey: 'KOREAN_POPULAR', label: '한국인기', enLabel: 'Korean Popular', emoji: '🍲' },
  { key: 'origin:global', group: 'origin', originKey: 'GLOBAL_DINING', label: '세계미식', enLabel: 'Global Dining', emoji: '🌍' },
  // 3. Delivery Categories (10)
  { key: 'delivery:chicken', group: 'delivery', deliveryKey: 'CHICKEN', label: '치킨', enLabel: 'Chicken', emoji: '🍗' },
  { key: 'delivery:pizza_burger', group: 'delivery', deliveryKey: 'PIZZA_BURGER', label: '피자·버거', enLabel: 'Pizza & Burger', emoji: '🍕' },
  { key: 'delivery:chinese', group: 'delivery', deliveryKey: 'CHINESE', label: '중식', enLabel: 'Chinese', emoji: '🥢' },
  { key: 'delivery:japanese', group: 'delivery', deliveryKey: 'JAPANESE_DON', label: '일식', enLabel: 'Japanese', emoji: '🍣' },
  { key: 'delivery:bunsik', group: 'delivery', deliveryKey: 'BUNSIK', label: '분식', enLabel: 'Street Food', emoji: '🍢' },
  { key: 'delivery:gukbap_noodle', group: 'delivery', deliveryKey: 'GUKBAP_NOODLE', label: '국밥·면', enLabel: 'Gukbap & Noodles', emoji: '🍜' },
  { key: 'delivery:soup_stew', group: 'delivery', deliveryKey: 'SOUP_STEW', label: '찌개·탕', enLabel: 'Soup & Stew', emoji: '🍲' },
  { key: 'delivery:meat_bbq', group: 'delivery', deliveryKey: 'MEAT_BBQ', label: '고기·구이', enLabel: 'Meat & BBQ', emoji: '🥩' },
  { key: 'delivery:cafe_dessert', group: 'delivery', deliveryKey: 'CAFE_DESSERT', label: '카페·디저트', enLabel: 'Cafe & Dessert', emoji: '☕' },
  { key: 'delivery:convenience', group: 'delivery', deliveryKey: 'FAST_CONVENIENCE', label: '간편식', enLabel: 'Convenience', emoji: '🍱' }
];

/**
 * Check if a food item matches the given category filter
 * @param {Object} food
 * @param {string} categoryKey
 * @returns {boolean}
 */
export function matchesCategory(food, categoryKey = 'all') {
  if (!food) return false;
  if (!categoryKey || categoryKey === 'all') return true;

  if (categoryKey.startsWith('meal:')) {
    const meal = categoryKey.replace('meal:', '');
    return Boolean(
      (Array.isArray(food.candidateMeals) && food.candidateMeals.includes(meal)) ||
      food.primaryMeal === meal
    );
  }

  if (categoryKey.startsWith('origin:')) {
    const origin = categoryKey.replace('origin:', '');
    if (origin === 'michelin') {
      return ['MICHELIN_3', 'MICHELIN_2', 'MICHELIN_1'].includes(food.originGroup);
    }
    if (origin === 'school') return food.originGroup === 'SCHOOL_LUNCH';
    if (origin === 'bib') return food.originGroup === 'BIB_GOURMAND';
    if (origin === 'raw') return food.originGroup === 'RAW_NATURAL';
    if (origin === 'unique') return food.originGroup === 'UNIQUE_SPECIAL';
    if (origin === 'korean') return food.originGroup === 'KOREAN_POPULAR';
    if (origin === 'global') return food.originGroup === 'GLOBAL_DINING';
    return food.originGroup === origin;
  }

  if (categoryKey.startsWith('delivery:')) {
    const delivery = categoryKey.replace('delivery:', '');
    if (delivery === 'meat_bbq') {
      return ['MEAT_BBQ', 'PORK_FEET_BOSSAM'].includes(food.deliveryCategory);
    }
    if (delivery === 'convenience') {
      return ['FAST_CONVENIENCE', 'KOREAN_MEAL', 'SALAD_HEALTH'].includes(food.deliveryCategory);
    }
    if (delivery === 'japanese') return food.deliveryCategory === 'JAPANESE_DON';
    if (delivery === 'gukbap_noodle') return food.deliveryCategory === 'GUKBAP_NOODLE';
    if (delivery === 'soup_stew') return food.deliveryCategory === 'SOUP_STEW';
    if (delivery === 'cafe_dessert') return food.deliveryCategory === 'CAFE_DESSERT';
    if (delivery === 'pizza_burger') return food.deliveryCategory === 'PIZZA_BURGER';
    return food.deliveryCategory?.toLowerCase() === delivery.toLowerCase();
  }

  return (
    food.deliveryCategory === categoryKey ||
    food.originGroup === categoryKey ||
    food.primaryMeal === categoryKey
  );
}

/**
 * Filter foods by category and search query
 * @param {Object} options
 * @returns {Array<Object>}
 */
export function filterFoods({
  foods = ALL_FOODS,
  category = 'all',
  searchQuery = '',
  lang = 'ko',
  dict = null
} = {}) {
  const currentLang = normalizeLang(lang);
  const query = (searchQuery || '').trim().toLowerCase();

  return foods
    .filter(food => matchesCategory(food, category))
    .filter(food => {
      if (!query) return true;
      const localized = localizeFood(food, currentLang, dict);
      const name = (localized.name || '').toLowerCase();
      const rawName = (food.name || '').toLowerCase();
      const englishName = (food.englishName || '').toLowerCase();
      return name.includes(query) || rawName.includes(query) || englishName.includes(query);
    });
}

/**
 * Pick a random food item strictly from the category
 * @param {Object} options
 * @returns {Object|null}
 */
export function pickRandomFood({
  foods = ALL_FOODS,
  category = 'all',
  currentCode = null,
  lang = 'ko',
  dict = null
} = {}) {
  const pool = foods.filter(f => matchesCategory(f, category));
  if (pool.length === 0) return null;
  if (pool.length === 1) return localizeFood(pool[0], lang, dict);

  let candidates = pool;
  if (currentCode) {
    const formattedCode = formatFoodCode(currentCode);
    const filtered = pool.filter(f => (f.code || formatFoodCode(f.index)) !== formattedCode);
    if (filtered.length > 0) candidates = filtered;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return localizeFood(candidates[randomIndex], lang, dict);
}

/**
 * Get food by code or index
 * @param {string|number} codeOrIndex
 * @param {Array} foods
 * @returns {Object|null}
 */
export function getFoodByCode(codeOrIndex, foods = ALL_FOODS) {
  if (!codeOrIndex) return null;
  const padded = formatFoodCode(codeOrIndex);
  if (FOODS_BY_CODE && FOODS_BY_CODE[padded]) {
    return FOODS_BY_CODE[padded];
  }
  const match = foods.find(f => (f.code || formatFoodCode(f.index)) === padded);
  return match || null;
}

/**
 * Parse client pathname into view routing state
 * @param {string} pathname
 * @returns {{ view: string, code?: string }}
 */
export function parseRoute(pathname = '/') {
  const pathOnly = (pathname || '/').split('?')[0].split('#')[0];
  let clean = pathOnly.replace(/\/+$/, '') || '/';

  // Check for supported language prefix e.g. /en/... or /ja
  const langMatch = clean.match(/^\/([a-z]{2})(?:\/|$)(.*)/i);
  let pathLang = null;
  if (langMatch && SUPPORTED_LANG_CODES.includes(langMatch[1].toLowerCase())) {
    pathLang = langMatch[1].toLowerCase();
    clean = '/' + (langMatch[2] || '');
    if (clean !== '/') clean = clean.replace(/\/+$/, '') || '/';
  }

  const res = {};
  if (pathLang) res.lang = pathLang;

  if (clean === '' || clean === '/') {
    return { view: 'home', ...res };
  }
  if (clean === '/gallery' || clean === '/food/gallery') {
    return { view: 'gallery', ...res };
  }
  const foodMatch = clean.match(/^\/(?:food\/)?food\/([0-9a-zA-Z_-]+)$/);
  if (foodMatch) {
    return { view: 'food', code: formatFoodCode(foodMatch[1]), ...res };
  }
  return { view: 'home', ...res };
}

/**
 * Build shareable URLs
 */
export function buildGalleryUrl(cat = null, lang = null) {
  const params = new URLSearchParams();
  if (lang && lang !== 'ko') params.set('lang', lang);
  if (cat && cat !== 'all') params.set('cat', cat);
  const q = params.toString();
  return `/gallery${q ? '?' + q : ''}`;
}

export function buildFoodUrl(code, lang = null) {
  const formatted = formatFoodCode(code);
  const params = new URLSearchParams();
  if (lang && lang !== 'ko') params.set('lang', lang);
  const q = params.toString();
  return `/food/${formatted}${q ? '?' + q : ''}`;
}

/**
 * Gallery Controller — DOM manager for the gallery tab & enlarged modal
 */
export class GalleryController {
  constructor(options = {}) {
    this.foods = options.foods || ALL_FOODS;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentFood = null;
    this.lang = options.lang || 'ko';
    this.dict = options.dict || null;
    this.onNavigate = options.onNavigate || null;

    // DOM references
    this.galleryContainer = null;
    this.gridContainer = null;
    this.searchInput = null;
    this.chipsContainer = null;
    this.randomBtn = null;
    this.detailModal = null;
    this.detailCanvas = null;
  }

  setLang(lang, dict = null) {
    this.lang = normalizeLang(lang);
    this.dict = dict;
    this.renderCategoryChips();
    if (this.gridRendered) {
      this.renderGrid();
    }
    if (this.currentFood) {
      const refreshed = getFoodByCode(this.currentFood.code || this.currentFood.index, this.foods);
      if (refreshed) {
        this.openDetail(refreshed, { pushState: false });
      }
    }
  }

  init({ galleryEl, detailModalEl } = {}) {
    if (typeof document === 'undefined') return;

    this.galleryContainer = galleryEl || document.getElementById('gallery-view');
    this.detailModal = detailModalEl || document.getElementById('food-detail-modal');

    if (!this.galleryContainer) return;

    this.gridContainer = this.galleryContainer.querySelector('#gallery-grid');
    this.searchInput = this.galleryContainer.querySelector('#gallery-search-input');
    this.chipsContainer = this.galleryContainer.querySelector('#gallery-chips-container');
    this.randomBtn = this.galleryContainer.querySelector('#gallery-random-btn');

    // Bind Search Input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderGrid();
      });
    }

    // Bind Random Pick Button
    if (this.randomBtn) {
      this.randomBtn.addEventListener('click', () => {
        this.pickAndShowRandom();
      });
    }

    // Bind Detail Modal Controls
    if (this.detailModal) {
      // Backdrop click to close
      this.detailModal.addEventListener('click', (e) => {
        if (e.target === this.detailModal) {
          this.closeDetail();
        }
      });

      // Close button
      const closeBtn = this.detailModal.querySelector('#detail-modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeDetail());
      }

      // Back to gallery button
      const backBtn = this.detailModal.querySelector('#detail-back-gallery-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.closeDetail());
      }

      // Random from same category button
      const sameCatBtn = this.detailModal.querySelector('#detail-random-same-cat-btn');
      if (sameCatBtn) {
        sameCatBtn.addEventListener('click', () => {
          this.pickAndShowSameCategory();
        });
      }

      // Action 1: Instagram Story
      const storyBtn = this.detailModal.querySelector('#detail-share-story-btn');
      if (storyBtn) {
        storyBtn.addEventListener('click', () => this.shareStory());
      }

      // Action 2: KakaoTalk
      const kakaoBtn = this.detailModal.querySelector('#detail-share-kakao-btn');
      if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => this.shareKakao());
      }

      // Action 2b: WhatsApp
      const waBtn = this.detailModal.querySelector('#detail-share-whatsapp-btn');
      if (waBtn) {
        waBtn.addEventListener('click', () => this.shareWhatsApp());
      }

      // Action 3: Save PNG
      const downloadBtn = this.detailModal.querySelector('#detail-download-png-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.downloadPng());
      }

      // Action 4: Copy Link
      const linkBtn = this.detailModal.querySelector('#detail-copy-link-btn');
      if (linkBtn) {
        linkBtn.addEventListener('click', () => this.copyLink());
      }
    }

    // Render chips (lazy-render 401-card grid only when gallery tab is opened)
    this.gridRendered = false;
    this.renderCategoryChips();
  }

  ensureGridRendered() {
    if (!this.gridRendered) {
      this.gridRendered = true;
      this.renderGrid();
    }
  }

  setCategory(categoryKey) {
    this.currentCategory = categoryKey || 'all';
    this.renderCategoryChips();
    this.gridRendered = true;
    this.renderGrid();
  }

  renderCategoryChips() {
    if (!this.chipsContainer) return;
    this.chipsContainer.innerHTML = '';

    for (const cat of GALLERY_CATEGORIES) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `gallery-chip ${this.currentCategory === cat.key ? 'active' : ''}`;
      chip.dataset.key = cat.key;

      let displayLabel = cat.label;
      if (cat.group === 'meal' && cat.mealKey) {
        displayLabel = t(this.lang, 'meal_' + cat.mealKey);
      } else if (cat.group === 'origin' && cat.originKey) {
        displayLabel = t(this.lang, 'origin_' + cat.originKey);
      } else if (this.lang !== 'ko' && cat.enLabel) {
        displayLabel = cat.enLabel;
      }

      // Strip leading emoji/symbol from translated label so cat.emoji is never duplicated
      const cleanLabel = String(displayLabel || '').replace(/^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\s]+/u, '').trim() || displayLabel;

      chip.innerHTML = `<span class="chip-emoji">${cat.emoji}</span> <span class="chip-text">${cleanLabel}</span>`;
      chip.addEventListener('click', () => {
        this.setCategory(cat.key);
      });
      this.chipsContainer.appendChild(chip);
    }
  }

  renderGrid() {
    if (!this.gridContainer) return;
    const filtered = filterFoods({
      foods: this.foods,
      category: this.currentCategory,
      searchQuery: this.searchQuery,
      lang: this.lang,
      dict: this.dict
    });

    this.gridContainer.innerHTML = '';

    const countEl = this.galleryContainer?.querySelector('#gallery-result-count');
    if (countEl) {
      countEl.textContent = String(filtered.length);
    }

    if (filtered.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'gallery-empty-state';
      emptyDiv.innerHTML = `
        <span class="empty-emoji">🔍</span>
        <p class="empty-title">${t(this.lang, 'galleryEmptyTitle')}</p>
        <p class="empty-sub">${t(this.lang, 'galleryEmptySub')}</p>
      `;
      this.gridContainer.appendChild(emptyDiv);
      return;
    }

    for (const rawFood of filtered) {
      const food = localizeFood(rawFood, this.lang, this.dict);
      const code = food.code || formatFoodCode(food.index || 1);
      const origin = FOOD_ORIGIN_GROUPS[food.originGroup] || { badge: '🍲 추천 메뉴', color: '#FFA94D' };
      const localizedOrigin = t(this.lang, 'origin_' + food.originGroup) || origin.badge;

      const card = document.createElement('article');
      card.className = 'gallery-food-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${food.name} 상세보기`);

      const pngUrl = `https://food.tellmyname.app/images/web/${code}.webp`;
      const webpUrl = `/images/${code}.png`;

      card.innerHTML = `
        <div class="gallery-card-thumb-wrap">
          <img
            src="${pngUrl}"
            alt="${food.name}"
            class="gallery-card-thumb"
            loading="lazy"
            onerror="this.onerror=null;this.src='${webpUrl}';"
          />
          <span class="gallery-code-badge">#${code}</span>
        </div>
        <div class="gallery-card-info">
          <div class="gallery-card-origin" style="color: ${origin.color || '#FFA94D'};">
            ${localizedOrigin}
          </div>
          <h3 class="gallery-card-title">${food.name}</h3>
          <div class="gallery-card-meta">
            ${food.calories ? `<span class="gallery-meta-cal">🔥 ${food.calories}</span>` : ''}
          </div>
        </div>
      `;

      const selectFood = () => {
        this.openDetail(food, { pushState: true });
      };

      card.addEventListener('click', selectFood);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectFood();
        }
      });

      this.gridContainer.appendChild(card);
    }
  }

  pickAndShowRandom() {
    const picked = pickRandomFood({
      foods: this.foods,
      category: this.currentCategory,
      currentCode: this.currentFood ? (this.currentFood.code || formatFoodCode(this.currentFood.index)) : null,
      lang: this.lang,
      dict: this.dict
    });
    if (picked) {
      this.openDetail(picked, { pushState: true });
      showToast(t(this.lang, 'toastRandomPick'));
    }
  }

  pickAndShowSameCategory() {
    if (!this.currentFood) return;
    // Determine category based on currentFood (deliveryCategory or originGroup)
    let catKey = 'all';
    if (this.currentFood.deliveryCategory) {
      const match = GALLERY_CATEGORIES.find(c => c.deliveryKey === this.currentFood.deliveryCategory);
      if (match) catKey = match.key;
    }
    if (catKey === 'all' && this.currentFood.originGroup) {
      const match = GALLERY_CATEGORIES.find(c => c.originKey === this.currentFood.originGroup);
      if (match) catKey = match.key;
    }

    const picked = pickRandomFood({
      foods: this.foods,
      category: catKey !== 'all' ? catKey : this.currentCategory,
      currentCode: this.currentFood.code || formatFoodCode(this.currentFood.index),
      lang: this.lang,
      dict: this.dict
    });

    if (picked) {
      this.openDetail(picked, { pushState: true });
      showToast(t(this.lang, 'toastCategoryRandomPick'));
    }
  }

  openDetail(foodItem, { pushState = true } = {}) {
    if (!foodItem || !this.detailModal) return;
    this.currentFood = localizeFood(foodItem, this.lang, this.dict);
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);

    // Update modal contents
    const imgEl = this.detailModal.querySelector('#detail-food-img');
    const titleEl = this.detailModal.querySelector('#detail-food-title');
    const subTitleEl = this.detailModal.querySelector('#detail-food-subtitle');
    const originBadgeEl = this.detailModal.querySelector('#detail-origin-badge');
    const deliveryBadgeEl = this.detailModal.querySelector('#detail-delivery-badge');
    const calEl = this.detailModal.querySelector('#detail-food-calories');
    const priceEl = this.detailModal.querySelector('#detail-food-price');
    const taglineEl = this.detailModal.querySelector('#detail-food-tagline');
    const pairingEl = this.detailModal.querySelector('#detail-food-pairing');

    if (imgEl) {
      imgEl.src = `https://food.tellmyname.app/images/web/${code}.webp`;
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = `/images/web/${code}.webp`;
      };
      imgEl.alt = this.currentFood.name;
    }

    if (titleEl) titleEl.textContent = this.currentFood.name;

    if (subTitleEl) {
      let sub = '';
      if (this.lang !== 'en' && this.currentFood.englishName) {
        sub = this.currentFood.englishName;
      } else if (this.lang !== 'ko' && this.currentFood.rawName) {
        sub = this.currentFood.rawName;
      }
      subTitleEl.textContent = sub;
      subTitleEl.style.display = sub ? 'block' : 'none';
    }

    if (originBadgeEl) {
      const origin = FOOD_ORIGIN_GROUPS[this.currentFood.originGroup] || { badge: '🍲 추천 메뉴', color: '#FFA94D' };
      const localizedOrigin = t(this.lang, 'origin_' + this.currentFood.originGroup) || origin.badge;
      originBadgeEl.textContent = localizedOrigin;
      originBadgeEl.style.borderColor = origin.color || '#FFA94D';
    }

    if (deliveryBadgeEl) {
      if (this.currentFood.deliveryCategory) {
        deliveryBadgeEl.textContent = `📦 ${this.currentFood.deliveryCategory.replace(/_/g, ' ')}`;
        deliveryBadgeEl.style.display = 'inline-block';
      } else {
        deliveryBadgeEl.style.display = 'none';
      }
    }

    if (calEl) {
      calEl.textContent = this.currentFood.calories ? `🔥 ${this.currentFood.calories}` : '밸런스 식단';
    }

    if (priceEl) {
      priceEl.textContent = this.currentFood.priceRange ? `💰 ${formatPriceForLang(this.currentFood.priceRange, this.lang)}` : t(this.lang, 'canvasGreatPrice');
    }

    if (taglineEl) {
      taglineEl.textContent = this.currentFood.tagline ? `"${this.currentFood.tagline}"` : '';
      taglineEl.style.display = this.currentFood.tagline ? 'block' : 'none';
    }

    if (pairingEl) {
      if (this.lang === 'ko' && this.currentFood.pairingTip) {
        pairingEl.textContent = `💡 꿀조합 팁: ${this.currentFood.pairingTip}`;
        pairingEl.style.display = 'block';
      } else {
        pairingEl.style.display = 'none';
      }
    }

    this.detailModal.classList.add('open');
    this.detailModal.setAttribute('aria-hidden', 'false');

    if (typeof document !== 'undefined') {
      const brand = (this.lang === 'ko' ? '오늘 뭐 먹지?' : 'TellMyName Food');
      document.title = `${this.currentFood.name} | ${brand}`;
    }

    if (pushState && typeof window !== 'undefined' && window.history?.pushState) {
      const url = buildFoodUrl(code, this.lang);
      window.history.pushState({ view: 'food', code }, '', url);
    }
  }

  closeDetail({ pushState = true } = {}) {
    if (!this.detailModal) return;
    this.detailModal.classList.remove('open');
    this.detailModal.setAttribute('aria-hidden', 'true');
    this.currentFood = null;

    if (pushState && typeof window !== 'undefined' && window.history?.pushState) {
      const url = buildGalleryUrl(this.currentCategory, this.lang);
      window.history.pushState({ view: 'gallery', cat: this.currentCategory }, '', url);
    }
  }

  async getRenderedFoodCanvas() {
    if (!this.currentFood) return null;
    let canvas = this.detailCanvas;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.detailCanvas = canvas;
    }
    await renderStoryCanvas({
      mode: 'food',
      lang: this.lang,
      items: [this.currentFood],
      siteUrl: 'https://tellmyname.app/food',
      theme: 'amber',
      canvas
    });
    return canvas;
  }

  async shareStory() {
    if (!this.currentFood) return;
    const canvas = await this.getRenderedFoodCanvas();
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);
    const filename = `mukbang-food-${code}.png`;
    const shareUrl = `${SITE_ORIGIN}${buildFoodUrl(code, this.lang)}`;

    await shareImage({
      blob,
      filename,
      title: `${this.currentFood.name} — ${t(this.lang, 'brandTitle')}`,
      text: `"${this.currentFood.tagline || this.currentFood.name}" — ${t(this.lang, 'galleryBadge')}`,
      url: shareUrl,
      lang: this.lang
    });
  }

  async shareKakao() {
    if (!this.currentFood) return;
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);
    const shareUrl = `${SITE_ORIGIN}${buildFoodUrl(code, this.lang)}`;
    const brand = t(this.lang, 'brandTitle');
    const title = `🍽️ ${this.currentFood.name} | ${brand}`;
    const text = [
      this.currentFood.tagline ? `"${this.currentFood.tagline}"` : '',
      this.currentFood.calories ? `🔥 ${t(this.lang, 'calLabel')}: ${this.currentFood.calories}` : '',
      this.currentFood.priceRange ? `💰 ${t(this.lang, 'priceLabel')}: ${formatPriceForLang(this.currentFood.priceRange, this.lang)}` : '',
      '',
      t(this.lang, 'shareFoodCta')
    ].filter(Boolean).join('\n');

    await shareKakaoText({
      title,
      text,
      url: shareUrl,
      lang: this.lang
    });
  }

  async shareWhatsApp() {
    if (!this.currentFood) return;
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);
    const shareUrl = `${SITE_ORIGIN}${buildFoodUrl(code, this.lang)}`;
    const brand = t(this.lang, 'brandTitle');
    const title = `🍽️ *${this.currentFood.name}* | ${brand}`;
    const lines = [
      this.currentFood.tagline ? `_"${this.currentFood.tagline}"_` : '',
      this.currentFood.calories ? `🔥 ${t(this.lang, 'calLabel')}: ${this.currentFood.calories}` : '',
      this.currentFood.priceRange ? `💰 ${t(this.lang, 'priceLabel')}: ${formatPriceForLang(this.currentFood.priceRange, this.lang)}` : '',
      '',
      t(this.lang, 'shareFoodCta')
    ].filter(Boolean);

    await shareWhatsAppText({
      title,
      text: lines.join('\n'),
      url: shareUrl,
      lang: this.lang
    });
  }

  async downloadPng() {
    if (!this.currentFood) return;
    const canvas = await this.getRenderedFoodCanvas();
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);
    const filename = `mukbang-food-${code}.png`;
    downloadImage(blob, filename);
    showToast(t(this.lang, 'toastStorySaved'));
  }

  copyLink() {
    if (!this.currentFood) return;
    const code = this.currentFood.code || formatFoodCode(this.currentFood.index || 1);
    const shareUrl = `${SITE_ORIGIN}${buildFoodUrl(code, this.lang)}`;
    copyToClipboard(shareUrl, t(this.lang, 'toastLinkCopied'));
  }
}
