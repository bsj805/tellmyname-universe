// web/js/app.js — 나에게 어울리는 집 (MyHome) Frontend Application
// Features: 14-Language Switcher, Name Search, Appraisal Card, 3-Button Dock, Reverse Routing, Scroll Explorer

import { analyzeNameToHouse } from './lib/hash.js';
import { getHouseConceptByLevel } from './lib/taxonomy.js';
import { renderHouseArtworkSvg, getHouseArtworkSvgDataUri } from './lib/taxonomy.js';
import { getNextActiveLevel, getPrevActiveLevel, getRandomActiveLevel, normalizeToActiveLevel, MAX_LEVEL, GOOD_HOUSE_THRESHOLD } from './lib/constants.js';
import { openShareModal, copyShareUrl } from './share.js?v=20261125';
import { renderStoryCanvas } from './share.js?v=20261125';
import { SUPPORTED_LANGUAGES, LANGUAGE_MAP, UI_DICTIONARY, getTranslation, localizeHouse, getWorldCupTranslation } from './lib/i18n.js';
import { LEVEL_TO_NAME_MAP, getSitemapNameForLevel } from './lib/level_name_map.js';
import { openWorldCupMode, setWorldCupLanguage, renderWorldCup } from './worldcup.js';
import { renderCrossLevelSectionHtml } from './lib/cross_level_map.js';

// Application State
export const state = {
  activeTab: 'search', // 'search' | 'worst-to-best' | 'best-to-worst'
  currentLevel: 512, // Default landing level (Kim Seo-yoon: Lv.512)
  inlineStoryTheme: 'sunset',
  activeName: null,   // Currently viewed name (e.g. '김서윤')
  activeStrokeInfo: null, // Stroke breakdown info for activeName
  userOriginalHouse: null, // User's own original house { name, level, strokeInfo }
  currentHouse: null, // Full house data object
  lang: 'ko',         // Active 14-language code: ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms
  isLoading: false,
  scrollFilter: 'HIGHER', // Default: 'HIGHER' (only levels > currentLevel); 'ALL' shows 0..999; 'BAD', 'GOOD', 'REAL', 'FICTION'
  scrollVisibleCount: 24, // Infinite scroll initial window (24 items)
  scrollRenderedCount: 0, // Track rendered items count for incremental append
  scrollTotalFilteredCount: 0 // Track total filtered count for current scroll filter
};

// DOM Elements Cache
const DOM = {
  langSelect: null,
  langQuickPills: null,
  headerBrandTitle: null,
  headerBrandBadge: null,
  headerBrandSub: null,
  nameInput: null,
  randomDiceBtn: null,
  btnRefreshChips: null,
  searchBtn: null,
  labelSearchBtn: null,
  searchForm: null,
  sampleChips: null,
  labelSampleChips: null,
  cardRoot: null,
  btnPrevLevel: null,
  btnRandomLevel: null,
  btnNextLevel: null,
  labelBtnPrev: null,
  labelBtnNext: null,
  labelBtnRandom: null,
  dockKeyboardHint: null,
  returnMyHouseBar: null,
  returnMyHouseBtn: null,
  returnHouseText: null,
  scrollPreviewSection: null,
  scrollPreviewTitle: null,
  scrollPreviewSubtitle: null,
  scrollPreviewList: null,
  scrollTierFilter: null,
  btnLoadMoreScroll: null,
  infiniteScrollSentinel: null,
  loadingOverlay: null,
  loadingStatusText: null,
  toastContainer: null
};

/**
 * Initialize DOM Elements
 */
function initDomElements() {
  DOM.langSelect = document.getElementById('lang-select');
  DOM.langQuickPills = document.getElementById('lang-quick-pills');
  DOM.headerBrandTitle = document.getElementById('header-brand-title');
  DOM.headerBrandBadge = document.getElementById('header-brand-badge');
  DOM.headerBrandSub = document.getElementById('header-brand-sub');
  DOM.nameInput = document.getElementById('name-input');
  DOM.randomDiceBtn = document.getElementById('random-dice-btn');
  DOM.btnRefreshChips = document.getElementById('btn-refresh-chips');
  DOM.searchBtn = document.getElementById('search-btn');
  DOM.labelSearchBtn = document.getElementById('label-search-btn');
  DOM.searchForm = document.getElementById('search-form');
  DOM.sampleChips = document.getElementById('sample-chips');
  DOM.labelSampleChips = document.getElementById('label-sample-chips');
  DOM.cardRoot = document.getElementById('card-root');
  DOM.btnPrevLevel = document.getElementById('btn-prev-level');
  DOM.btnRandomLevel = document.getElementById('btn-random-level');
  DOM.btnNextLevel = document.getElementById('btn-next-level');
  DOM.labelBtnPrev = document.getElementById('label-btn-prev');
  DOM.labelBtnNext = document.getElementById('label-btn-next');
  DOM.labelBtnRandom = document.getElementById('label-btn-random');
  DOM.dockKeyboardHint = document.getElementById('dock-keyboard-hint');
  DOM.returnMyHouseBar = document.getElementById('return-my-house-bar');
  DOM.returnMyHouseBtn = document.getElementById('return-my-house-btn');
  DOM.returnHouseText = document.getElementById('return-house-text');
  DOM.scrollPreviewSection = document.getElementById('scroll-preview-section');
  DOM.scrollPreviewTitle = document.getElementById('scroll-preview-title');
  DOM.scrollPreviewSubtitle = document.getElementById('scroll-preview-subtitle');
  DOM.scrollPreviewList = document.getElementById('scroll-preview-list');
  DOM.scrollTierFilter = document.getElementById('scroll-tier-filter');
  DOM.btnLoadMoreScroll = document.getElementById('btn-load-more-scroll');
  DOM.infiniteScrollSentinel = document.getElementById('infinite-scroll-sentinel');
  DOM.loadingOverlay = document.getElementById('loading-overlay');
  DOM.loadingStatusText = document.getElementById('loading-status-text');
  DOM.toastContainer = document.getElementById('toast-container');
}

/**
 * Toast Notification System
 * @param {string} message
 * @param {number} duration
 */
export function showToast(message, duration = 3000) {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * Safely push AdSense queue for newly inserted in-feed ads and initial slots
 */
export function pushPendingAdSense() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (DOM.scrollPreviewSection && (DOM.scrollPreviewSection.hasAttribute('hidden') || DOM.scrollPreviewSection.style.display === 'none')) return;
  try {
    const unpushed = document.querySelectorAll('.adsbygoogle:not([data-ad-pushed="true"])');
    unpushed.forEach((el) => {
      el.setAttribute('data-ad-pushed', 'true');
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    });
  } catch (err) {
    // Graceful fallback if AdSense script blocked or errored
  }
}

/**
 * Fetch or procedurally generate house data for a level (0..999)
 * @param {number} level 0 ~ 999
 * @returns {Promise<object>} House data object
 */
export async function getHouseData(level) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));

  // 1. Synchronous taxonomy generator (Zero-latency)
  if (typeof getHouseConceptByLevel === 'function') {
    try {
      const concept = getHouseConceptByLevel(lv);
      if (concept && concept.title) {
        return concept;
      }
    } catch (err) {
      console.warn('[MyHome] getHouseConceptByLevel fallback:', err);
    }
  }

  // 2. Fallback: Fetch chunk JSON if running in environment where static chunk is available
  try {
    const chunkIdx = Math.min(19, Math.floor(lv / 50));
    const padded = String(chunkIdx).padStart(2, '0');
    const resp = await fetch(`/data/chunks/houses-chunk-${padded}.json`);
    if (resp.ok) {
      const chunk = await resp.json();
      const found = chunk.find(h => h.level === lv);
      if (found) return found;
    }
  } catch (err) {
    console.warn('[MyHome] Chunk fetch fallback failed:', err);
  }

  // 3. Fallback: Procedural fallback
  const isGood = lv >= GOOD_HOUSE_THRESHOLD;
  const isReal = lv % 2 === 0;
  return {
    level: lv,
    tier: Math.min(20, Math.floor(lv / 50) + 1),
    tierName: `Tier ${String(Math.min(20, Math.floor(lv / 50) + 1)).padStart(2, '0')}`,
    zone: isGood ? 'GOOD' : 'BAD',
    zoneLabel: isGood ? '대박 하우스' : '폭망 하우스',
    realityType: isReal ? 'REAL' : 'FICTION',
    realityLabel: isReal ? '실제 존재하는 건축물·사물' : '허구·상상 속 건축물·사물',
    category: 'MUSEUM_PUBLIC',
    categoryLabel: '다중우주 공인 건축물',
    categoryEmoji: '🏛️',
    title: `다중우주 제${lv}호 감정 대상 건축물`,
    builtYear: '알 수 없는 시공간',
    estimatedValue: isGood ? '측정 불가 (초호화)' : '고철값 100원',
    specialFeature: '시간과 공간의 법칙을 뒤흔드는 기괴한 주거 특권이 부여됩니다.',
    aiVerdict: 'AI 감정평가사가 심혈을 기울여 다중우주 등기부에 정식 등록한 건축물입니다.',
    imageUrl: `/r2/houses/${String(lv).padStart(5, '0')}.webp`,
    ogImageUrl: `https://myhome.tellmyname.app/r2/houses/${String(lv).padStart(5, '0')}.webp`
  };
}

/**
 * Preload adjacent level images for instantaneous navigation
 * @param {number} level
 */
export function preloadAdjacentImages(level) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const prevLv = getPrevActiveLevel(lv);
  const nextLv = getNextActiveLevel(lv);

  const prevImg = new Image();
  prevImg.src = `/r2/houses/${String(prevLv).padStart(5, '0')}.webp`;

  const nextImg = new Image();
  nextImg.src = `/r2/houses/${String(nextLv).padStart(5, '0')}.webp`;
}

/**
 * Render the Appraisal Certificate Card into #card-root
 * @param {object} house
 * @param {string|null} name
 * @param {object|null} strokeInfo
 */
export function renderCard(house, name = null, strokeInfo = null) {
  if (!DOM.cardRoot) return;

  const rawLv = Number(house.level);
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const isGood = lv >= GOOD_HOUSE_THRESHOLD;
  const isReal = lv % 2 === 0;
  const zoneClass = isGood ? 'zone-good' : 'zone-bad';
  const realityClass = isReal ? 'reality-real' : 'reality-fiction';

  // 14-Language Localization
  const localized = localizeHouse(house, state.lang, name);
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];

  // Update document.title dynamically for active language & house (preserve brand title on root '/')
  if (typeof document !== 'undefined') {
    const isRootPath = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');
    if (isRootPath && (!name || name === '김서윤')) {
      document.title = state.lang === 'ko'
        ? '나에게 어울리는 집 - 이름만 입력해서 찾는 재미로 보는 집 테스트'
        : `${dict.brandHeader || 'The House That Suits You'} (MyHome) — ${dict.brandSub || 'Fun Name-Based House Matching Test'}`;
    } else if (state.lang === 'ko') {
      document.title = name
        ? `${name}님에게 어울리는 집 (Lv.${lv}) — ${localized.title} | 나에게 어울리는 집`
        : `Lv.${lv} ${localized.title} | 나에게 어울리는 집`;
    } else {
      const ownerPart = name && dict.ownerTitle ? dict.ownerTitle.replace('{name}', name) : (dict.brandHeader || 'MyHome');
      document.title = `${ownerPart}: ${localized.title} (Lv.${lv}) | ${dict.brandHeader || 'MyHome'}`;
    }
  }

  // SEO Image Alt & Title (Clean level-based alt text without English keyword stuffing)
  const imgAltText = `Lv.${lv} ${escapeHtml(localized.title)} (${escapeHtml(localized.categoryLabel || '')})`;
  const imgTitleText = `Lv.${lv} ${escapeHtml(localized.title)}`;

  const ownerHeadline = name
    ? (dict.ownerTitle ? dict.ownerTitle.replace('{name}', escapeHtml(name)) : `${escapeHtml(name)}`)
    : (dict.brandHeader || 'MyHome');

  const shareBtnLabel = dict.openShareModalBtn || dict.storyPhotoHint || '인스타 스토리 / 카톡 공유 카드 만들기';
  const copyBtnLabel = dict.copyUrlBtn || '내 결과 주소 복사';

  const isRootHomepage = typeof window !== 'undefined' &&
    (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html') &&
    !new URLSearchParams(window.location.search || '').has('name') &&
    !new URLSearchParams(window.location.search || '').has('level');

  // Requirement 5: Show bottom guide & whitepaper ONLY on the initial root screen before name search
  const guideSection = document.querySelector('.service-guide-section');
  if (guideSection) {
    const showGuide = isRootHomepage && state.activeTab === 'search';
    guideSection.classList.toggle('hidden', !showGuide);
    guideSection.style.display = showGuide ? '' : 'none';
  }

  const displayOwnerName = name || (state.lang === 'ko' ? '김서윤' : (LANGUAGE_MAP[state.lang]?.sampleNames?.[0] || 'Chloe'));
  const activeInlineTheme = state.inlineStoryTheme || 'sunset';
  const inlineStoryTitle = state.lang === 'ko'
    ? `📸 인스타그램 공유 이미지 미리보기 (${escapeHtml(displayOwnerName)}님 예시)`
    : `📸 Instagram Story Share Preview (${escapeHtml(displayOwnerName)})`;
  const inlineStorySub = state.lang === 'ko'
    ? '위 검색창에 이름만 입력하면 나에게 어울리는 집 인스타 스토리 이미지가 바로 만들어집니다!'
    : 'Enter any name above to generate your own 9:16 Instagram Story house card!';
  const inlineDownloadLabel = state.lang === 'ko'
    ? '📥 이 인스타 이미지 바로 저장'
    : (dict.saveStoryBtn || '📥 Save Story Image');

  const inlineInstaShowcaseHtml = isRootHomepage ? `
    <!-- Main Page Instagram Story Share Image Preview Showcase -->
    <section class="inline-insta-showcase" id="inline-insta-showcase" aria-label="${inlineStoryTitle}">
      <div class="inline-insta-header">
        <span class="inline-insta-badge">INSTAGRAM STORY 9:16 PREVIEW</span>
        <h2 class="inline-insta-title">${inlineStoryTitle}</h2>
        <p class="inline-insta-subtitle">${inlineStorySub}</p>
      </div>
      <div class="inline-theme-selector" id="inline-theme-selector">
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'sunset' ? 'active' : ''}" data-theme="sunset">🌅 ${dict.shareModal?.themeSunset || (state.lang === 'ko' ? '노을 그라디언트' : 'Sunset')}</button>
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'cert' ? 'active' : ''}" data-theme="cert">📜 ${dict.shareModal?.themeCert || (state.lang === 'ko' ? '등기권리증' : 'Classic')}</button>
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'cyber' ? 'active' : ''}" data-theme="cyber">⚡ ${dict.shareModal?.themeCyber || (state.lang === 'ko' ? '사이버 네온' : 'Cyberpunk')}</button>
      </div>
      <div class="inline-story-canvas-wrap">
        <canvas id="inline-story-canvas" width="1080" height="1920"></canvas>
      </div>
      <div class="inline-insta-actions">
        <button type="button" id="btn-inline-save-story" class="btn-action btn-share-modal">
          <span class="btn-icon">📥</span>
          <span class="btn-label">${escapeHtml(inlineDownloadLabel)}</span>
        </button>
        <button type="button" id="btn-inline-open-modal" class="btn-action btn-copy-address">
          <span class="btn-icon">📸</span>
          <span class="btn-label">${escapeHtml(shareBtnLabel)}</span>
        </button>
      </div>
    </section>
  ` : '';

  const html = `
    
    <article class="appraisal-card ${zoneClass}" id="appraisal-certificate" data-level="${lv}">
      
      <!-- Friendly Owner Headline Header -->
      <header class="card-certificate-header">
        <p class="owner-headline-label">${ownerHeadline}</p>
      </header>

      <!-- House Main Title -->
      <div class="house-title-container">
        <h3 class="house-title">${escapeHtml(localized.title)}</h3>
      </div>

      <!-- House Visual Media -->
      <div class="house-media-wrapper">
        <div class="media-frame">
          <img
            id="house-main-img"
            class="house-image"
            src="${localized.imageUrl}"
            alt="${imgAltText}"
            title="${imgTitleText}"
            loading="eager"
            onerror="this.onerror=null; this.classList.add('img-fallback');"
          />
        </div>
        <div class="image-sub-bar">
          <span class="image-credit" id="image-credit-box">${localized.license ? `📷 ${escapeHtml(localized.license)}${localized.author ? ` · ${escapeHtml(localized.author)}` : ''}` : ''}</span>
        </div>
      </div>

      <!-- Badge Matrix: Level, Zone, Reality, Category (Compact Inline Bar) -->
      <div class="badge-matrix">
        <div class="matrix-badge badge-level">
          <span class="badge-val">Lv. ${lv.toLocaleString()} <span class="badge-total">/ ${MAX_LEVEL}</span></span>
        </div>
        <div class="matrix-badge badge-zone ${zoneClass}">
          <span class="badge-val">${isGood ? '🌟 ' + escapeHtml(localized.zoneLabel) : '💀 ' + escapeHtml(localized.zoneLabel)}</span>
        </div>
        <div class="matrix-badge badge-reality ${realityClass}">
          <span class="badge-val">${isReal ? '🏛️ ' + escapeHtml(localized.realityLabel) : '🦄 ' + escapeHtml(localized.realityLabel)}</span>
        </div>
        <div class="matrix-badge badge-category">
          <span class="badge-val">${escapeHtml(localized.categoryEmoji || '🏠')} ${escapeHtml(localized.categoryLabel || '')}</span>
        </div>
      </div>

      <!-- 3 Mandatory Appraisal Spec Boxes -->
      <div class="appraisal-spec-grid" aria-label="${escapeHtml(dict.storySpecTitle || 'Architectural Specifications')}">
        
        <!-- Spec 1: 건축 연도 (언제 지어졌나?) -->
        <div class="spec-card spec-built-year">
          <div class="spec-card-header">
            <span class="spec-icon">📅</span>
            <span class="spec-title">${escapeHtml(dict.specs?.builtYearLabel || 'Year Built')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value">${escapeHtml(localized.builtYear || '')}</p>
          </div>
        </div>

        <!-- Spec 2: 추산 가치 (얼마나 하나?) -->
        <div class="spec-card spec-estimated-value">
          <div class="spec-card-header">
            <span class="spec-icon">💰</span>
            <span class="spec-title">${escapeHtml(dict.specs?.estimatedValueLabel || 'Estimated Value')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value price-highlight">${escapeHtml(localized.estimatedValue || '')}</p>
          </div>
        </div>

        <!-- Spec 3: 집의 특별한 기능 (AI 감정 특권) -->
        <div class="spec-card spec-special-feature">
          <div class="spec-card-header">
            <span class="spec-icon">⚡</span>
            <span class="spec-title">${escapeHtml(dict.specs?.specialFeatureLabel || 'Special Feature')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value feature-text">${escapeHtml(localized.specialFeature || '')}</p>
          </div>
        </div>

      </div>

      <!-- AI Chief Appraiser Verdict Box -->
      <section class="ai-verdict-section" aria-label="${escapeHtml(dict.specs?.aiVerdictLabel || 'AI Verdict')}">
        <p class="verdict-quote">
          "${escapeHtml(localized.aiVerdict || '')}"
        </p>
      </section>

      <!-- Action Buttons (Feature #8 Shared Interface) -->
      <div class="card-action-bar">
        <button type="button" id="btn-open-share" class="btn-action btn-share-modal" style="width: 100%; flex: 1 1 100%;" title="${escapeHtml(shareBtnLabel)}">
          <span class="btn-icon">🖼️</span>
          <span class="btn-label">${escapeHtml(shareBtnLabel)}</span>
        </button>
      </div>

    </article>
    ${renderCrossLevelSectionHtml(lv, name, state.lang, 'myhome', MAX_LEVEL)}
  `;

  DOM.cardRoot.innerHTML = html;

  // Bind step-nav-btn (Prev / Random / Next level buttons below card) for smooth SPA navigation
  DOM.cardRoot.querySelectorAll('.step-nav-btn[data-target-level]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLv = parseInt(btn.getAttribute('data-target-level'), 10);
      if (!isNaN(targetLv)) {
        navigateToLevel(targetLv, true);
      }
    });
  });

  // Render Inline 9:16 Instagram Story Canvas on Main Page
  const inlineCanvas = document.getElementById('inline-story-canvas');
  if (inlineCanvas && typeof renderStoryCanvas === 'function') {
    renderStoryCanvas(inlineCanvas, house, displayOwnerName, state.inlineStoryTheme || 'sunset', state.lang).catch(() => {});
  }

  const inlineThemeSelector = document.getElementById('inline-theme-selector');
  if (inlineThemeSelector && inlineCanvas) {
    inlineThemeSelector.querySelectorAll('.inline-theme-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const selectedTheme = pill.getAttribute('data-theme') || 'sunset';
        state.inlineStoryTheme = selectedTheme;
        inlineThemeSelector.querySelectorAll('.inline-theme-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        if (typeof renderStoryCanvas === 'function') {
          renderStoryCanvas(inlineCanvas, house, displayOwnerName, selectedTheme, state.lang).catch(() => {});
        }
      });
    });
  }

  const inlineSaveBtn = document.getElementById('btn-inline-save-story');
  if (inlineSaveBtn && inlineCanvas) {
    inlineSaveBtn.addEventListener('click', () => {
      const sanitized = (displayOwnerName || 'myhome').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
      const filename = `myhome_${sanitized}_lv${lv}_${state.inlineStoryTheme || 'sunset'}.png`;
      if (inlineCanvas.toBlob) {
        inlineCanvas.toBlob((blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          showToast(dict.shareModal?.savedToast || '📥 9:16 인스타 스토리 이미지가 저장되었습니다!');
        }, 'image/png');
      }
    });
  }

  const inlineOpenModalBtn = document.getElementById('btn-inline-open-modal');
  if (inlineOpenModalBtn) {
    inlineOpenModalBtn.addEventListener('click', () => {
      if (typeof openShareModal === 'function') {
        openShareModal(state.currentHouse, state.activeName || displayOwnerName, state.lang);
      }
    });
  }

  // Bind Action Buttons
  const shareBtn = document.getElementById('btn-open-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (typeof openShareModal === 'function') {
        openShareModal(state.currentHouse, state.activeName, state.lang);
      } else {
        showToast(dict.copiedToast || 'Share modal ready');
      }
    });
  }

  const copyBtn = document.getElementById('btn-copy-url');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (typeof copyShareUrl === 'function') {
        copyShareUrl(state.currentHouse, state.activeName, state.lang);
      }
    });
  }

  // Preload images for level - 1 and level + 1
  preloadAdjacentImages(lv);

  // If real architecture, asynchronously fetch license from R2 json
  if (isReal && !localized.license) {
    const padded = String(lv).padStart(5, '0');
    fetch(`/r2/houses/${padded}.json`)
      .then(res => res.ok ? res.json() : null)
      .then(meta => {
        const creditEl = document.getElementById('image-credit-box');
        if (creditEl && meta && (meta.license || meta.artist)) {
          const lic = meta.license || 'Free License';
          const art = meta.artist ? ` · ${meta.artist}` : '';
          const src = meta.sourceUrl;
          if (src) {
            creditEl.innerHTML = `📷 <a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:underline;">Photo: ${escapeHtml(lic)}${escapeHtml(art)}</a>`;
          } else {
            creditEl.textContent = `📷 Photo: ${lic}${art}`;
          }
        }
      })
      .catch(() => {});
  }
}

/**
 * Update Explorer Dock Buttons and Labels
 * @param {number} level
 */
export function updateExplorerDock(level) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, level));
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];

  if (DOM.btnPrevLevel) {
    const prevLv = getPrevActiveLevel(lv);
    const prevLabel = `${dict.prevHouseBtn || '◀ Prev'} (Lv. ${prevLv.toLocaleString()})`;
    if (DOM.labelBtnPrev) {
      DOM.labelBtnPrev.textContent = prevLabel;
    }
    DOM.btnPrevLevel.title = `${prevLabel} [←]`;
  }

  if (DOM.btnRandomLevel && DOM.labelBtnRandom) {
    DOM.labelBtnRandom.textContent = dict.randomHouseBtn || '🎲 Random';
    DOM.btnRandomLevel.title = `${dict.randomHouseBtn || 'Random'} [Space]`;
  }

  if (DOM.btnNextLevel) {
    const nextLv = getNextActiveLevel(lv);
    const nextLabel = `${dict.nextHouseBtn || 'Next ▶'} (Lv. ${nextLv.toLocaleString()})`;
    if (DOM.labelBtnNext) {
      DOM.labelBtnNext.textContent = nextLabel;
    }
    DOM.btnNextLevel.title = `${nextLabel} [→]`;
  }
}

/**
 * Update Return My House Floating Banner
 */
export function updateReturnBanner() {
  if (!DOM.returnMyHouseBar || !DOM.returnHouseText) return;
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];

  if (state.userOriginalHouse && state.userOriginalHouse.level !== state.currentLevel) {
    const tpl = dict.returnMyHouseText || '내 원래 집({name} · Lv.{level})으로 돌아가기';
    DOM.returnHouseText.textContent = tpl
      .replace('{name}', state.userOriginalHouse.name)
      .replace('{level}', state.userOriginalHouse.level.toLocaleString());
    DOM.returnMyHouseBar.classList.remove('hidden');
  } else {
    DOM.returnHouseText.textContent = dict.returnMyHouseDefault || '내 원래 집으로 돌아가기';
    DOM.returnMyHouseBar.classList.add('hidden');
  }
}

/**
 * Show / Hide Appraisal Stamp Loading Overlay
 * @param {boolean} show
 * @param {string} text
 */
function setLoading(show, text = '') {
  state.isLoading = show;
  if (!DOM.loadingOverlay) return;
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];
  if (DOM.loadingStatusText) {
    DOM.loadingStatusText.textContent = text || dict.loadingText || 'Loading...';
  }
  if (show) {
    DOM.loadingOverlay.classList.remove('hidden');
    DOM.loadingOverlay.setAttribute('aria-hidden', 'false');
  } else {
    DOM.loadingOverlay.classList.add('hidden');
    DOM.loadingOverlay.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Navigate to a specific house level with Sitemap Reverse Routing (Requirement 4 Part A)
 * @param {number} level
 * @param {boolean} pushState
 */
export async function navigateToLevel(level, pushState = true) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  state.currentLevel = lv;

  // Check if we returned to user's original house
  if (state.userOriginalHouse && state.userOriginalHouse.level === lv) {
    state.activeName = state.userOriginalHouse.name;
    state.activeStrokeInfo = state.userOriginalHouse.strokeInfo;
  } else {
    state.activeName = null;
    state.activeStrokeInfo = null;
  }

  // Update URL to canonical level path /level/${lv}
  if (pushState) {
    const langParam = (state.lang && state.lang !== 'ko') ? `?lang=${state.lang}` : '';
    const targetUrl = `/level/${lv}${langParam}`;

    try {
      window.history.pushState({ level: lv, activeName: null, lang: state.lang }, '', targetUrl);
    } catch (e) {}
  }

  // Load house data
  const house = await getHouseData(lv);
  state.currentHouse = house;

  // Render Card and Update Docks
  renderCard(house, state.activeName, state.activeStrokeInfo);
  updateExplorerDock(lv);
  updateReturnBanner();

  // If '전체' (ALL) is not selected, dynamically show levels higher than current level (lv + 1 .. 999)
  if (state.scrollFilter === 'HIGHER') {
    renderScrollPreviewList(true);
  } else if (DOM.scrollPreviewList) {
    // Update in-place active card highlight in scroll list
    const prevActive = DOM.scrollPreviewList.querySelector('.scroll-preview-card.active-current-card');
    if (prevActive) {
      prevActive.classList.remove('active-current-card');
    }
    const nextActive = DOM.scrollPreviewList.querySelector(`.scroll-preview-card[data-level="${lv}"]`);
    if (nextActive) {
      nextActive.classList.add('active-current-card');
    }
  }

  // Scroll smoothly to top of card if scrolled down
  if (DOM.cardRoot && window.scrollY > 200) {
    DOM.cardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Navigate to a specific Name
 * @param {string} name
 * @param {boolean} pushState
 * @param {boolean} animate
 */
export async function navigateToName(name, pushState = true, animate = true) {
  const cleanName = String(name || '').trim();
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];
  if (!cleanName) {
    showToast(dict.enterNameToast || (state.lang === 'ko' ? '이름을 입력해주세요!' : 'Please enter a name!'));
    if (DOM.nameInput) DOM.nameInput.focus();
    return;
  }

  // Analyze name with JSA-Hash
  const analyzed = analyzeNameToHouse(cleanName);
  state.currentLevel = analyzed.level;
  state.activeName = analyzed.cleanName;
  state.activeStrokeInfo = analyzed;
  state.userOriginalHouse = {
    name: analyzed.cleanName,
    level: analyzed.level,
    strokeInfo: analyzed
  };

  // Update input field
  if (DOM.nameInput) {
    DOM.nameInput.value = cleanName;
  }

  // Update URL to permanent SEO friendly path /name/{이름}
  if (pushState) {
    try {
      const langParam = (state.lang && state.lang !== 'ko') ? `?lang=${state.lang}` : '';
      window.history.pushState(
        { name: cleanName, level: analyzed.level, lang: state.lang },
        '',
        `/name/${encodeURIComponent(cleanName)}${langParam}`
      );
    } catch (e) {}
  }

  // Optional appraisal stamp animation
  if (animate) {
    const loadingMsg = dict.loadingWithName
      ? dict.loadingWithName.replace('{name}', cleanName)
      : (state.lang === 'ko'
          ? `AI 감정평가사가 [${cleanName}]님의 명의를 조회 중입니다...`
          : `AI Appraiser verifying multiverse deed for [${cleanName}]...`);
    setLoading(true, loadingMsg);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
  }

  // Load house data
  const house = await getHouseData(analyzed.level);
  state.currentHouse = house;

  // Render
  renderCard(house, state.activeName, state.activeStrokeInfo);
  updateExplorerDock(analyzed.level);
  updateReturnBanner();

  // When searching a name, if '전체' (ALL) is not clicked, show levels higher than current level
  if (state.scrollFilter === 'HIGHER') {
    renderScrollPreviewList(true);
  } else if (DOM.scrollPreviewList) {
    const prevActive = DOM.scrollPreviewList.querySelector('.scroll-preview-card.active-current-card');
    if (prevActive) prevActive.classList.remove('active-current-card');
    const nextActive = DOM.scrollPreviewList.querySelector(`.scroll-preview-card[data-level="${analyzed.level}"]`);
    if (nextActive) nextActive.classList.add('active-current-card');
  }

  if (DOM.cardRoot) {
    DOM.cardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Navigate to a random level
 */
export function navigateToRandom() {
  let nextLv;
  do {
    nextLv = getRandomActiveLevel();
  } while (nextLv === state.currentLevel);

  navigateToLevel(nextLv, true);
}

/**
 * 14-Language UI Switcher Controller (Requirement 2)
 * @param {string} langCode
 * @param {boolean} updateUrl
 */
export function setLanguage(langCode, updateUrl = true) {
  const code = LANGUAGE_MAP[langCode] ? langCode : 'ko';
  state.lang = code;

  try {
    localStorage.setItem('myhome_lang', code);
  } catch (e) {}

  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }

  // Update Language Dropdown & Quick Pills
  if (DOM.langSelect) {
    DOM.langSelect.value = code;
  }
  const pills = document.querySelectorAll('.lang-pill');
  pills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-lang') === code);
  });

  // If the current activeName has Korean characters when switching to a non-Korean language
  // (e.g. default resident on root page), update activeName to the target language's resident name for this level
  if (code !== 'ko' && state.activeName && /[가-힣]/.test(state.activeName)) {
    const localizedResident = getSitemapNameForLevel(state.currentLevel, code);
    if (localizedResident) {
      state.activeName = localizedResident;
      if (DOM.nameInput && /[가-힣]/.test(DOM.nameInput.value)) {
        DOM.nameInput.value = '';
      }
    }
  } else if (!state.userOriginalHouse && state.currentHouse) {
    const localizedResident = getSitemapNameForLevel(state.currentLevel, code);
    if (localizedResident) {
      state.activeName = localizedResident;
    }
  }

  // Re-render UI labels
  updateLocalizedStaticTexts();

  // Dynamically update sample chips
  updateSampleChipsForLanguage(code);

  // Re-render Current Card
  if (state.currentHouse) {
    renderCard(state.currentHouse, state.activeName, state.activeStrokeInfo);
  }

  // Update Explorer Dock & Return Banner
  updateExplorerDock(state.currentLevel);
  updateReturnBanner();

  // Re-render Scroll Preview Explorer
  state.scrollVisibleCount = 24;
  state.scrollRenderedCount = 0;
  renderScrollPreviewList(true);

  // Update World Cup Language & Re-render if active
  setWorldCupLanguage(code);
  if (state.activeTab !== 'search') {
    const wcRoot = document.getElementById('worldcup-root');
    if (wcRoot) renderWorldCup(wcRoot);
  }

  // Update URL ?lang= parameter if appropriate
  if (updateUrl && typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    if (code === 'ko') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', code);
    }
    window.history.replaceState(window.history.state, '', url.toString());
  }
}

/**
 * Helper to set textContent or attribute on an element by ID
 */
function setElText(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setElHtml(id, html) {
  if (!html) return;
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/**
 * Update Header, Guide, Whitepaper, Footer, and Static UI strings for current language
 */
function updateLocalizedStaticTexts() {
  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];
  const wcT = getWorldCupTranslation(state.lang);

  // Update 3 Mode Tab Buttons
  const tabSearch = document.getElementById('tab-btn-search');
  const tabWorst = document.getElementById('tab-btn-worst');
  const tabBest = document.getElementById('tab-btn-best');
  if (tabSearch) tabSearch.innerHTML = `<span>🏠</span> <span>${wcT.tabSearch}</span>`;
  if (tabWorst) tabWorst.innerHTML = `<span>💀</span> <span>${wcT.tabWorst}</span>`;
  if (tabBest) tabBest.innerHTML = `<span>🌟</span> <span>${wcT.tabBest}</span>`;

  if (DOM.headerBrandBadge) {
    DOM.headerBrandBadge.textContent = dict.brandSub || '';
  }
  setElText('header-brand-text', dict.brandHeader);

  const langQuery = state.lang && state.lang !== 'ko'
    ? `?lang=${encodeURIComponent(state.lang)}`
    : '';

  const pdLink = document.getElementById('photodiary-link');
  if (pdLink) {
    pdLink.href = `https://photodiary.tellmyname.app/${langQuery}`;
  }
  setElText('photodiary-text', state.lang === 'ko' ? '포토 다이어리' : 'Photo Diary');

  const foodNavLink = document.getElementById('food-nav-link');
  if (foodNavLink) foodNavLink.href = `https://food.tellmyname.app/${langQuery}`;
  setElText('food-nav-text', dict.foodLink || (state.lang === 'ko' ? '오늘 뭐 먹지?' : 'What to Eat?'));

  const jobNavLink = document.getElementById('job-nav-link');
  if (jobNavLink) jobNavLink.href = `https://job.tellmyname.app/${langQuery}`;
  setElText('job-nav-text', state.lang === 'ko' ? '내 직업' : 'MyJob');

  const carNavLink = document.getElementById('car-nav-link');
  if (carNavLink) carNavLink.href = `https://car.tellmyname.app/${langQuery}`;
  setElText('car-nav-text', state.lang === 'ko' ? '내 자동차' : 'MyCar');

  const hubNavLink = document.getElementById('hub-link');
  if (hubNavLink) hubNavLink.href = `https://tellmyname.app/${langQuery}`;

  if (DOM.langSelect && dict.langSelectLabel) {
    DOM.langSelect.setAttribute('aria-label', dict.langSelectLabel);
  }

  if (DOM.nameInput) {
    DOM.nameInput.placeholder = dict.searchPlaceholder || '';
    if (dict.nameInputAria) DOM.nameInput.setAttribute('aria-label', dict.nameInputAria);
  }
  if (DOM.randomDiceBtn && dict.randomDiceTitle) {
    DOM.randomDiceBtn.title = dict.randomDiceTitle;
    DOM.randomDiceBtn.setAttribute('aria-label', dict.randomDiceTitle);
  }
  if (DOM.searchBtn && dict.searchBtn) {
    DOM.searchBtn.setAttribute('aria-label', dict.searchBtn);
  }
  if (DOM.labelSearchBtn) {
    DOM.labelSearchBtn.textContent = dict.searchBtn || '';
  }
  if (DOM.labelSampleChips) {
    DOM.labelSampleChips.textContent = dict.sampleLabel || '';
  }
  if (DOM.btnRefreshChips && dict.refreshChipsTitle) {
    DOM.btnRefreshChips.title = dict.refreshChipsTitle;
    DOM.btnRefreshChips.setAttribute('aria-label', dict.refreshChipsTitle);
  }

  // AdSense Badges
  setElText('ad-badge-top', dict.adBadgeTop);
  setElText('ad-badge-main', dict.adBadgeMain);
  setElText('ad-badge-footer', dict.adBadgeFooter);

  // Explorer & Scroll Preview
  setElText('dock-keyboard-hint', dict.dockKeyboardHint);
  setElText('scroll-preview-title', dict.scrollPreviewTitle);
  setElText('scroll-preview-subtitle', dict.scrollPreviewSubtitle);
  setElText('filter-btn-all', dict.scrollFilterAll);
  setElText('filter-btn-bad', dict.scrollFilterBad);
  setElText('filter-btn-good', dict.scrollFilterGood);
  setElText('filter-btn-real', dict.scrollFilterReal);
  setElText('filter-btn-fiction', dict.scrollFilterFiction);

  // Service Guide Section
  if (dict.guide) {
    setElText('guide-section-title', dict.guide.sectionTitle);
    setElText('guide-bad-badge', dict.guide.badBadge);
    setElText('guide-bad-title', dict.guide.badTitle);
    setElText('guide-bad-desc', dict.guide.badDesc);
    setElText('guide-good-badge', dict.guide.goodBadge);
    setElText('guide-good-title', dict.guide.goodTitle);
    setElText('guide-good-desc', dict.guide.badDesc ? dict.guide.goodDesc : '');
    setElText('guide-rule-badge', dict.guide.ruleBadge);
    setElText('guide-rule-title', dict.guide.ruleTitle);
    setElHtml('guide-rule-desc', dict.guide.ruleDesc);
  }

  // Editorial Whitepaper Section
  if (dict.whitepaper) {
    const wpEl = document.getElementById('editorial-whitepaper');
    if (wpEl && dict.whitepaper.mainTitle) {
      wpEl.setAttribute('aria-label', dict.whitepaper.mainTitle);
    }
    setElText('wp-tag', dict.whitepaper.tag);
    setElText('wp-main-title', dict.whitepaper.mainTitle);
    setElText('wp-art1-title', dict.whitepaper.art1Title);
    setElText('wp-art1-p1', dict.whitepaper.art1P1);
    setElText('wp-art1-p2', dict.whitepaper.art1P2);
    setElText('wp-art2-title', dict.whitepaper.art2Title);
    setElText('wp-art2-p1', dict.whitepaper.art2P1);
    setElText('wp-art2-p2', dict.whitepaper.art2P2);
    setElText('wp-art3-title', dict.whitepaper.art3Title);
    setElText('wp-art3-p1', dict.whitepaper.art3P1);
    setElText('wp-art3-p2', dict.whitepaper.art3P2);
    if (dict.whitepaper.art4Title) {
      setElText('wp-art4-title', dict.whitepaper.art4Title);
      setElText('wp-art4-p1', dict.whitepaper.art4P1);
      setElText('wp-art4-p2', dict.whitepaper.art4P2);
    } else if (state.lang !== 'ko') {
      const wcT = getWorldCupTranslation(state.lang);
      setElText('wp-art4-title', `🏆 4. ${wcT.tabWorst || 'World Cup'} vs ${wcT.tabBest || 'Tournament'}`);
      setElText('wp-art4-p1', wcT.subtitleWorst || wcT.descWorst || 'Play 16 to 256 round tournament matchups across all levels and compare every contender side by side.');
      setElText('wp-art4-p2', wcT.subtitleBest || wcT.descBest || 'Share identical bracket seeds with friends or switch between Worst-to-Best and Best-to-Worst tournament modes anytime.');
    }
    if (typeof window !== 'undefined' && typeof window.updatePhotoDiaryPromoLang === 'function') {
      window.updatePhotoDiaryPromoLang(state.lang);
    }
  }

  // Footer
  if (dict.footer) {
    setElText('footer-brand-text', dict.footer.brand);
    const isKo = state.lang === 'ko';
    setElText('footer-link-hub', isKo ? '✨ TellMyName 허브' : '✨ TellMyName Hub');
    setElText('footer-link-food', isKo ? '🍱 오늘 뭐 먹지?' : '🍱 What to Eat?');
    setElText('footer-link-job', isKo ? '💼 내 직업 찾기' : '💼 Find My Job');
    setElText('footer-link-car', isKo ? '🚗 내 자동차 찾기' : '🚗 Find My Car');
    setElText('footer-link-photodiary', isKo ? '📸 포토 다이어리' : '📸 Photo Diary');
    setElText('footer-link-about', dict.footer.about);
    setElText('footer-link-contact', dict.footer.contact);
    setElText('footer-link-privacy', dict.footer.privacy);
    setElText('footer-link-terms', dict.footer.terms);
    setElText('footer-link-consent', dict.footer.consent);
    setElText('footer-desc-text', dict.footer.desc);
  }

  // Loading Overlay
  setElText('loading-status-text', dict.loadingText);
}

/**
 * Dynamically update sample chips based on language
 */
export const ENGLISH_SAMPLE_NAMES = [
  'Sophia', 'Lucas', 'Oliver', 'Emma', 'Chloe', 'Noah', 'Leo', 'Liam',
  'Mia', 'David', 'Ethan', 'Charlotte', 'Amelia', 'James', 'Benjamin',
  'Alexander', 'Daniel', 'Samuel', 'Ava', 'Jackson', 'Henry', 'Sebastian',
  'Jack', 'Harper', 'Ella', 'Grace', 'Lily', 'Hannah', 'Maya', 'Zoe'
];

export const CURATED_RANDOM_NAMES = [
  '김서윤', '이민준', '박도윤', '정예준', '최시우', '강하은', '조지안', '윤서아',
  '임하윤', '한지우', '오주원', '서채원', '신현우', '황수아', '안지호', '송예린',
  '유은우', '문건우', '양우진', '손선우', '배서진', '백연우', '허수빈', '유나',
  '남지원', '심준우', '노소율', '정예성', '하시현', '곽지민', '성승우', '차준서',
  '주하율', '우예준', '구채은', '신시윤', '임서현', '전지유', '민윤서', '유민재',
  '진민석', '지보검', '엄은지', '채태형', '원정국', '천유진', '방진우', '공유찬',
  '강윤우', '현시온', '함수호', '변세진', '변성진', '염은성', '양하은', '조아린',
  '김로운', '이서우', '박재윤', '최주아', '정시아', '강승현', '조태양', '윤가온',
  '임다온', '한지환', '오지율', '서유담', '신나은', '황지온', '안예나', '송채아',
  '유하린', '홍루다', '손이안', '배이든', '백라온', '허도하', '유태민', '남지수',
  '찬솔', '늘해랑', '소망꽃', '고깔', '눈꽃', '아지랑', '새벽빛', '온새미', '새론',
  '손흥민', '이강인', '페이커', '유재석', '아이유', '차은우', '카리나', '장원영',
  '지드래곤', '제니', '봉준호', '손석구', '김연아', '안유진', '침착맨', '기안84',
  '덱스', '박보검', '송중기', '마동석', '이순신', '세종대왕', '신사임당', '홍길동',
  '선우용녀', '독고탁', '제갈량', '사마의', '배트맨', '스파이더맨', '토르',
  'Sophia', 'Lucas', 'Oliver', 'Emma', 'Chloe', 'Noah', 'Leo', 'Liam', 'Mia', 'David',
  'Ethan', 'Charlotte', 'Amelia', 'James', 'Benjamin', 'Alexander', 'Daniel', 'Ava'
];

export function getRandomName() {
  if (state.lang !== 'ko') {
    const langMeta = LANGUAGE_MAP[state.lang] || LANGUAGE_MAP['en'];
    const pool = [...(langMeta.sampleNames || []), ...ENGLISH_SAMPLE_NAMES];
    if (Math.random() < 0.6 && pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const randomLv = Math.floor(Math.random() * 1000);
    return getSitemapNameForLevel(randomLv, state.lang) || pool[0] || 'Chloe';
  }

  if (Math.random() < 0.5) {
    const idx = Math.floor(Math.random() * CURATED_RANDOM_NAMES.length);
    return CURATED_RANDOM_NAMES[idx];
  } else {
    const randomLv = Math.floor(Math.random() * 1000);
    const sName = getSitemapNameForLevel(randomLv, state.lang);
    return sName || CURATED_RANDOM_NAMES[0];
  }
}

export function refreshRandomSampleChips() {
  if (!DOM.sampleChips) return;

  if (state.lang !== 'ko') {
    const langMeta = LANGUAGE_MAP[state.lang] || LANGUAGE_MAP['en'];
    const baseSamples = langMeta.sampleNames || ['Chloe', 'Emma', 'Liam', 'Olivia', 'Noah'];
    const pickedSet = new Set();
    let attempts = 0;
    while (pickedSet.size < 5 && attempts < 50) {
      attempts++;
      if (Math.random() < 0.5 && baseSamples.length > 0) {
        pickedSet.add(baseSamples[Math.floor(Math.random() * baseSamples.length)]);
      } else {
        const randomLv = Math.floor(Math.random() * 1000);
        const sName = getSitemapNameForLevel(randomLv, state.lang);
        if (sName && !/[가-힣]/.test(sName)) pickedSet.add(sName);
      }
    }
    for (const s of baseSamples) {
      if (pickedSet.size < 5) pickedSet.add(s);
    }
    const finalNames = Array.from(pickedSet).slice(0, 5);
    let html = '';
    for (const name of finalNames) {
      const analyzed = analyzeNameToHouse(name);
      html += `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
    }
    DOM.sampleChips.innerHTML = html;
    return;
  }

  const pickedList = [];
  const randomEnglish = ENGLISH_SAMPLE_NAMES[Math.floor(Math.random() * ENGLISH_SAMPLE_NAMES.length)];
  pickedList.push(randomEnglish);

  const koreanPool = CURATED_RANDOM_NAMES.filter(n => !/^[A-Za-z\s]+$/.test(n));
  const pickedSet = new Set(pickedList);

  let attempts = 0;
  while (pickedSet.size < 5 && attempts < 50) {
    attempts++;
    if (Math.random() < 0.6 && koreanPool.length > 0) {
      const candidate = koreanPool[Math.floor(Math.random() * koreanPool.length)];
      if (candidate) pickedSet.add(candidate);
    } else {
      const randomLv = Math.floor(Math.random() * 1000);
      const sName = getSitemapNameForLevel(randomLv, 'ko');
      if (sName) pickedSet.add(sName);
    }
  }

  const finalNames = Array.from(pickedSet).sort(() => Math.random() - 0.5);

  let html = '';
  for (const name of finalNames) {
    const analyzed = analyzeNameToHouse(name);
    html += `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
  }
  DOM.sampleChips.innerHTML = html;
}

export function handleRandomDiceClick() {
  if (DOM.randomDiceBtn) {
    DOM.randomDiceBtn.classList.remove('rolling');
    void DOM.randomDiceBtn.offsetWidth;
    DOM.randomDiceBtn.classList.add('rolling');
  }

  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];
  const randomName = getRandomName();
  if (DOM.nameInput) {
    DOM.nameInput.value = randomName;
  }
  navigateToName(randomName, true, true);
  refreshRandomSampleChips();
  const toastText = (dict.randomDiceToast || "🎲 '{name}'").replace('{name}', randomName);
  showToast(toastText);
}

function updateSampleChipsForLanguage(langCode) {
  if (!DOM.sampleChips) return;
  const langMeta = LANGUAGE_MAP[langCode] || LANGUAGE_MAP['ko'];
  const sampleNames = langMeta.sampleNames || ['김서윤', '이민준', '홍길동', '박서윤', '선우용녀'];

  let html = '';
  for (const name of sampleNames) {
    const analyzed = analyzeNameToHouse(name);
    html += `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
  }
  DOM.sampleChips.innerHTML = html;
}

/**
 * Render Scrollable Text-Only House Explorer with Infinite Scroll and In-Feed AdSense
 * NO <img> is rendered in this scroll list! Photos only reveal on page entry.
 * Injects an AdSense unit every 8 cards.
 * @param {boolean} reset If true, resets list and starts from index 0; if false, appends next batch.
 */
export function renderScrollPreviewList(reset = true) {
  if (!DOM.scrollPreviewList) return;
  if (DOM.scrollPreviewSection && (DOM.scrollPreviewSection.hasAttribute('hidden') || DOM.scrollPreviewSection.style.display === 'none')) return;

  const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];

  if (reset) {
    DOM.scrollPreviewList.innerHTML = '';
    state.scrollVisibleCount = 24;
    state.scrollRenderedCount = 0;
  }

  const allLevels = [];
  const startLv = (state.scrollFilter === 'HIGHER')
    ? Math.min(MAX_LEVEL, Math.max(0, state.currentLevel + 1))
    : 0;

  for (let lv = startLv; lv <= MAX_LEVEL; lv++) {
    const isGood = lv >= GOOD_HOUSE_THRESHOLD;
    const isReal = lv % 2 === 0;

    if (state.scrollFilter === 'BAD' && isGood) continue;
    if (state.scrollFilter === 'GOOD' && !isGood) continue;
    if (state.scrollFilter === 'REAL' && !isReal) continue;
    if (state.scrollFilter === 'FICTION' && isReal) continue;

    allLevels.push(lv);
  }

  state.scrollTotalFilteredCount = allLevels.length;

  // Update subtitle for active language
  if (DOM.scrollPreviewSubtitle) {
    if (state.scrollFilter === 'HIGHER') {
      const tpl = dict.scrollSubtitleHigher || 'Lv.{start}~{max}';
      DOM.scrollPreviewSubtitle.textContent = tpl
        .replace('{current}', state.currentLevel)
        .replace('{start}', startLv)
        .replace('{max}', MAX_LEVEL);
    } else {
      const tpl = dict.scrollSubtitleAll || 'Lv.0~{max}';
      DOM.scrollPreviewSubtitle.textContent = tpl.replace('{max}', MAX_LEVEL);
    }
  }

  if (state.scrollRenderedCount >= allLevels.length) {
    if (DOM.btnLoadMoreScroll) DOM.btnLoadMoreScroll.style.display = 'none';
    if (DOM.infiniteScrollSentinel) DOM.infiniteScrollSentinel.style.display = 'none';
    return;
  }

  const sliceLevels = allLevels.slice(state.scrollRenderedCount, state.scrollVisibleCount);
  let html = '';
  const arrowLabel = dict.previewEnterArrow || 'View Photo ›';

  for (let i = 0; i < sliceLevels.length; i++) {
    const lv = sliceLevels[i];
    const idx = state.scrollRenderedCount + i;
    const concept = getHouseConceptByLevel(lv);
    const loc = localizeHouse(concept, state.lang, null);
    const isCurrent = (lv === state.currentLevel);

    html += `
      <div class="scroll-preview-card ${loc.zone === 'GOOD' ? 'zone-good' : 'zone-bad'} ${isCurrent ? 'active-current-card' : ''}" data-level="${lv}" data-target-level="${lv}">
        <span class="preview-badge-lv">Lv.${lv}</span>
        <h4 class="preview-house-title">${escapeHtml(loc.title)}</h4>
        <span class="preview-enter-arrow" aria-hidden="true">${escapeHtml(arrowLabel)}</span>
      </div>
    `;
  }

  DOM.scrollPreviewList.insertAdjacentHTML('beforeend', html);
  state.scrollRenderedCount = Math.min(state.scrollVisibleCount, allLevels.length);

  // Update Sentinel and Load More button state
  if (DOM.infiniteScrollSentinel) {
    DOM.infiniteScrollSentinel.style.display = (state.scrollRenderedCount >= allLevels.length) ? 'none' : 'block';
  }
  if (DOM.btnLoadMoreScroll) {
    DOM.btnLoadMoreScroll.style.display = 'none';
  }
}

/**
 * Handle initial URL route parsing
 */
export async function handleInitialRoute() {
  let initialName = null;
  let initialLevel = null;
  let initialLang = 'ko';

  try {
    const path = window.location.pathname || '';
    const searchParams = new URLSearchParams(window.location.search || '');

    // 0. Language param: ?lang=en
    if (searchParams.has('lang')) {
      const qLang = searchParams.get('lang');
      if (LANGUAGE_MAP[qLang]) {
        initialLang = qLang;
      }
    } else {
      const savedLang = localStorage.getItem('myhome_lang');
      if (savedLang && LANGUAGE_MAP[savedLang]) {
        initialLang = savedLang;
      }
    }

    // 1. Check pathname: /name/{name}
    const nameMatch = path.match(/^\/name\/([^/?#]+)/i);
    if (nameMatch) {
      initialName = decodeURIComponent(nameMatch[1]);
    }

    // 2. Check query: ?name={name}
    if (!initialName && searchParams.has('name')) {
      initialName = searchParams.get('name');
    }

    // 3. Check pathname: /level/{0..999}
    const levelMatch = path.match(/^\/level\/(\d+)/i);
    if (levelMatch) {
      initialLevel = parseInt(levelMatch[1], 10);
    }

    // 4. Check query: ?level={0..999}
    if (initialLevel === null && searchParams.has('level')) {
      initialLevel = parseInt(searchParams.get('level'), 10);
    }

    // 5. Check "from" query param for userHouse preservation
    if (searchParams.has('from')) {
      const fromName = searchParams.get('from');
      const analyzed = analyzeNameToHouse(fromName);
      state.userOriginalHouse = {
        name: analyzed.cleanName,
        level: analyzed.level,
        strokeInfo: analyzed
      };
    }
  } catch (err) {
    console.warn('[MyHome] Route parsing exception:', err);
  }

  // Initialize Language
  setLanguage(initialLang, false);

  const curPath = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
  if (curPath.startsWith('/worldcup')) {
    const wcMode = curPath.includes('best-to-worst') ? 'best-to-worst' : 'worst-to-best';
    const qp = new URLSearchParams(window.location.search || '');
    const roundSize = qp.has('round') ? parseInt(qp.get('round'), 10) : null;
    const seed = qp.has('seed') ? parseInt(qp.get('seed'), 10) : null;
    switchModeTab(wcMode, false, { roundSize, seed });
    return;
  }

  if (initialName) {
    await navigateToName(initialName, false, false);
  } else if (initialLevel !== null && !isNaN(initialLevel)) {
    await navigateToLevel(initialLevel, false);
  } else {
    // Default featured name on initial landing ('김서윤' -> Lv.512)
    const defaultSampleName = (LANGUAGE_MAP[initialLang]?.sampleNames?.[0]) || '김서윤';
    await navigateToName(defaultSampleName, false, false);
  }
}

/**
 * Register Event Handlers
 */
function registerEventListeners() {
  // 0. Global Mode Tabs (Search vs World Cup)
  const modeTabsEl = document.getElementById('mode-tabs');
  if (modeTabsEl) {
    modeTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-tab-btn');
      if (btn && btn.dataset.mode) {
        switchModeTab(btn.dataset.mode);
      }
    });
  }

  // 1. Language Dropdown Change
  if (DOM.langSelect) {
    DOM.langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value, true);
    });
  }

  // 2. Language Quick Pills
  if (DOM.langQuickPills) {
    DOM.langQuickPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.lang-pill');
      if (pill && pill.dataset.lang) {
        setLanguage(pill.dataset.lang, true);
      }
    });
  }

  // 3. Search Form Submission
  if (DOM.searchForm) {
    DOM.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (DOM.nameInput) {
        navigateToName(DOM.nameInput.value, true, true);
      }
    });
  }

  // 4. Search Button Click
  if (DOM.searchBtn) {
    DOM.searchBtn.addEventListener('click', () => {
      if (DOM.nameInput) {
        navigateToName(DOM.nameInput.value, true, true);
      }
    });
  }

  // 4-b. Random Dice Button Click
  if (DOM.randomDiceBtn) {
    DOM.randomDiceBtn.addEventListener('click', () => {
      handleRandomDiceClick();
    });
  }

  // 4-c. Refresh Sample Chips Click
  if (DOM.btnRefreshChips) {
    DOM.btnRefreshChips.addEventListener('click', () => {
      const dict = UI_DICTIONARY[state.lang] || UI_DICTIONARY['ko'];
      refreshRandomSampleChips();
      showToast(dict.refreshChipsToast || '🔄 Refreshed!');
    });
  }

  // 5. Sample Chips Click
  if (DOM.sampleChips) {
    DOM.sampleChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.sample-chip');
      if (chip && chip.dataset.name) {
        navigateToName(chip.dataset.name, true, true);
      }
    });
  }

  // 6. Explorer Dock Buttons
  if (DOM.btnPrevLevel) {
    DOM.btnPrevLevel.addEventListener('click', () => {
      navigateToLevel(getPrevActiveLevel(state.currentLevel), true);
    });
  }

  if (DOM.btnRandomLevel) {
    DOM.btnRandomLevel.addEventListener('click', () => {
      navigateToRandom();
    });
  }

  if (DOM.btnNextLevel) {
    DOM.btnNextLevel.addEventListener('click', () => {
      navigateToLevel(getNextActiveLevel(state.currentLevel), true);
    });
  }

  // 7. Return to User's Original House
  if (DOM.returnMyHouseBtn) {
    DOM.returnMyHouseBtn.addEventListener('click', () => {
      if (state.userOriginalHouse && state.userOriginalHouse.name) {
        navigateToName(state.userOriginalHouse.name, true, false);
      }
    });
  }

  // 8. Scroll Preview Filter Pills
  if (DOM.scrollTierFilter) {
    DOM.scrollTierFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.tier-filter-btn');
      if (btn && btn.dataset.filter) {
        const clickedFilter = btn.dataset.filter;
        const isAlreadyActive = btn.classList.contains('active') && state.scrollFilter === clickedFilter;

        DOM.scrollTierFilter.querySelectorAll('.tier-filter-btn').forEach(b => b.classList.remove('active'));

        if (isAlreadyActive) {
          state.scrollFilter = 'HIGHER';
        } else {
          btn.classList.add('active');
          state.scrollFilter = clickedFilter;
        }
        renderScrollPreviewList(true);
      }
    });
  }

  // 9. Scroll Preview List Click (Enter House to reveal photo)
  if (DOM.scrollPreviewList) {
    DOM.scrollPreviewList.addEventListener('click', (e) => {
      const enterBtn = e.target.closest('.btn-enter-house');
      const card = e.target.closest('.scroll-preview-card');
      const targetLevel = enterBtn?.dataset.targetLevel || card?.dataset.targetLevel || card?.dataset.level;

      if (targetLevel !== undefined) {
        navigateToLevel(parseInt(targetLevel, 10), true);
      }
    });
  }

  // 10. Load More Button for Scroll Preview
  if (DOM.btnLoadMoreScroll) {
    DOM.btnLoadMoreScroll.addEventListener('click', () => {
      loadNextScrollBatch();
    });
  }

  // 11. Keyboard Shortcuts: ArrowLeft (prev), ArrowRight (next), Space (random)
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const tagName = activeEl ? activeEl.tagName.toLowerCase() : '';
    if (tagName === 'input' || tagName === 'textarea' || activeEl?.isContentEditable) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToLevel(getPrevActiveLevel(state.currentLevel), true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToLevel(getNextActiveLevel(state.currentLevel), true);
    } else if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      navigateToRandom();
    }
  });

  // 12. PopState for Browser Back / Forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state) {
      if (e.state.name) {
        navigateToName(e.state.name, false, false);
      } else if (e.state.level !== undefined) {
        navigateToLevel(e.state.level, false);
      }
      if (e.state.lang && e.state.lang !== state.lang) {
        setLanguage(e.state.lang, false);
      }
    } else {
      handleInitialRoute();
    }
  });
}

/**
 * Utility: HTML Escape
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Infinite Scroll Batch Loader
 */
let isInfiniteScrollLoading = false;

export function loadNextScrollBatch() {
  if (isInfiniteScrollLoading) return;
  const maxItems = state.scrollTotalFilteredCount || (MAX_LEVEL + 1);
  if (state.scrollRenderedCount >= maxItems) return;

  isInfiniteScrollLoading = true;
  state.scrollVisibleCount += 24;
  renderScrollPreviewList(false);

  setTimeout(() => {
    isInfiniteScrollLoading = false;
  }, 100);
}

/**
 * Setup Infinite Scroll with IntersectionObserver and scroll listener fallback
 */
export function setupInfiniteScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (DOM.scrollPreviewSection && (DOM.scrollPreviewSection.hasAttribute('hidden') || DOM.scrollPreviewSection.style.display === 'none')) return;

  // 1. IntersectionObserver on #infinite-scroll-sentinel
  if ('IntersectionObserver' in window && DOM.infiniteScrollSentinel) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          loadNextScrollBatch();
        }
      },
      { root: null, rootMargin: '300px', threshold: 0 }
    );
    observer.observe(DOM.infiniteScrollSentinel);
  }

  // 2. Passive window scroll listener fallback
  window.addEventListener(
    'scroll',
    () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = (document.body.offsetHeight || document.documentElement.scrollHeight) - 500;
      if (scrollPos >= threshold) {
        loadNextScrollBatch();
      }
    },
    { passive: true }
  );
}

/**
 * Switch between 'search', 'worst-to-best', and 'best-to-worst' tabs
 * @param {string} mode
 */
export function switchModeTab(mode, pushState = true, wcOptions = {}) {
  state.activeTab = mode || 'search';
  const modeTabsEl = document.getElementById('mode-tabs');
  const searchSection = document.getElementById('search-section');
  const cardRoot = document.getElementById('card-root');
  const worldcupRoot = document.getElementById('worldcup-root');
  const returnBar = document.getElementById('return-my-house-bar');
  const guideSection = document.querySelector('.service-guide-section');
  const appLayout = document.querySelector('.app-layout');

  if (appLayout) {
    appLayout.classList.toggle('wc-wide', state.activeTab !== 'search');
  }

  if (pushState && typeof window !== 'undefined' && window.history && window.history.pushState) {
    const targetUrl = state.activeTab === 'search'
      ? '/'
      : `/worldcup/${state.activeTab}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ tab: state.activeTab }, '', targetUrl);
    }
  }

  if (modeTabsEl) {
    modeTabsEl.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.activeTab);
    });
  }

  if (state.activeTab === 'search') {
    if (searchSection) searchSection.classList.remove('hidden');
    if (cardRoot) cardRoot.classList.remove('hidden');
    const isRoot = typeof window !== 'undefined' &&
      (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html') &&
      !new URLSearchParams(window.location.search || '').has('name') &&
      !new URLSearchParams(window.location.search || '').has('level');
    if (guideSection) {
      guideSection.classList.toggle('hidden', !isRoot);
      guideSection.style.display = isRoot ? '' : 'none';
    }
    if (worldcupRoot) worldcupRoot.classList.add('hidden');
    updateReturnBanner();
  } else {
    if (searchSection) searchSection.classList.add('hidden');
    if (cardRoot) cardRoot.classList.add('hidden');
    if (guideSection) {
      guideSection.classList.add('hidden');
      guideSection.style.display = 'none';
    }
    if (returnBar) returnBar.classList.add('hidden');
    if (worldcupRoot) {
      worldcupRoot.classList.remove('hidden');
      setWorldCupLanguage(state.lang);
      openWorldCupMode(state.activeTab, worldcupRoot, {
        onViewHouse: (level) => {
          switchModeTab('search');
          navigateToLevel(level, true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onSwitchMode: (nextMode) => {
          switchModeTab(nextMode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onToast: (msg) => showToast(msg)
      }, wcOptions);
    }
  }
}

/**
 * Main Initialization
 */
export function init() {
  initDomElements();
  registerEventListeners();
  setupInfiniteScroll();
  handleInitialRoute();

  // Initialize AdSense Responsive Ads safely
  pushPendingAdSense();
}

// Auto-run if executed in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Expose SVG fallback for browser img onerror
if (typeof window !== 'undefined') {
  window.renderHouseFallbackSvg = function(level) {
    try {
      const c = getHouseConceptByLevel(level);
      return getHouseArtworkSvgDataUri(c);
    } catch {
      return '/favicon.svg';
    }
  };
}
