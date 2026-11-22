// web/js/worldcup.js — Food Ideal Type World Cup Controller (Best & Worst Modes)
// Supports:
// - Best Food & Worst Food tournament modes
// - Categories: All, Breakfast, Lunch, Snack, Dinner, Late-night
// - Round Sizes: 32, 64, 128 (randomized Fisher-Yates seeding every game)
// - Mobile-friendly vertical scrollable match cards
// - Full 14-language localization via src/lib/i18n.js
// - SEO URL routing (/worldcup, /worldcup/lunch, /worldcup/worst, etc.)

import {
  SITE_ORIGIN,
  getFoodImageUrl,
  formatFoodCode
} from '../../src/lib/constants.js';

import {
  ALL_FOODS
} from '../../src/lib/food_dataset.js';

import {
  t,
  normalizeLang,
  localizeFood
} from '../../src/lib/i18n.js';

import {
  WORLDCUP_CATEGORIES,
  WORLDCUP_ROUND_SIZES,
  WORLDCUP_SEO_SLUGS,
  filterFoodsByCategory,
  createWorldCupState,
  pickWinner,
  undoPick,
  parseWorldCupPath
} from '../../src/lib/worldcup.js';

import {
  renderStoryCanvas,
  canvasToBlob,
  shareImage,
  downloadImage,
  shareKakaoText,
  copyToClipboard,
  showToast,
  formatPriceForLang
} from './share_core.js';

/**
 * Build World Cup URL for pushState & sharing (preserves category, mode, roundSize, seed, lang)
 */
export function buildWorldCupUrl(category = 'lunch', mode = 'best', lang = 'ko', { roundSize = null, seed = null } = {}) {
  const normLang = normalizeLang(lang);
  let slug = '';
  if (mode === 'worst' && category === 'all') {
    slug = 'worst';
  } else if (category && category !== 'all' && WORLDCUP_SEO_SLUGS[category] && mode === 'best') {
    slug = category;
  }
  const basePath = slug ? `/worldcup/${slug}` : '/worldcup';
  const params = new URLSearchParams();
  if (normLang !== 'ko') params.set('lang', normLang);
  if (mode === 'worst' && slug !== 'worst') params.set('mode', 'worst');
  if (category === 'all' && mode === 'best') params.set('cat', 'all');
  if (category && category !== 'all' && mode === 'worst') params.set('cat', category);
  if (roundSize && WORLDCUP_ROUND_SIZES.includes(Number(roundSize))) {
    params.set('round', String(roundSize));
  }
  if (seed !== null && seed !== undefined && String(seed).trim() !== '') {
    params.set('seed', String(seed).trim());
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export class WorldCupController {
  constructor({ foods = ALL_FOODS, lang = 'ko', dict = null, onOpenFoodDetail = null } = {}) {
    this.foods = foods;
    this.lang = normalizeLang(lang);
    this.dict = dict;
    this.onOpenFoodDetail = onOpenFoodDetail;

    this.selectedMode = 'best'; // 'best' | 'worst'
    this.selectedCategory = 'lunch'; // 'all' | 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'night'
    this.selectedRoundSize = 32; // 32 | 64 | 128

    this.state = { phase: 'setup' };
    this.isAnimatingPick = false;
    this.container = null;
    this.urlSeed = null;
    this.autoStartFromUrl = false;
  }

  init() {
    this.container = document.getElementById('worldcup-view');
    if (!this.container) return;
    this.applyPresetFromUrl();
    if (this.autoStartFromUrl) {
      this.autoStartFromUrl = false;
      this.startTournament({
        category: this.selectedCategory,
        mode: this.selectedMode,
        roundSize: this.selectedRoundSize,
        seed: this.urlSeed,
        pushUrl: false
      });
    } else {
      this.render();
    }
  }

  setLanguage(lang, dict = null) {
    this.lang = normalizeLang(lang);
    this.dict = dict;
    if (this.container) {
      this.render();
    }
  }

  applyPresetFromUrl() {
    if (typeof window === 'undefined') return;
    const parsed = parseWorldCupPath(window.location.pathname);
    const params = new URLSearchParams(window.location.search);
    if (parsed.isWorldCup) {
      this.selectedCategory = params.get('cat') || parsed.category || 'lunch';
      this.selectedMode = params.get('mode') === 'worst' ? 'worst' : parsed.mode;
      const roundParam = Number(params.get('round'));
      if (WORLDCUP_ROUND_SIZES.includes(roundParam)) {
        this.selectedRoundSize = roundParam;
      }
      const seedParam = params.get('seed');
      const autostartParam = params.get('autostart');
      if (seedParam && seedParam.trim() !== '') {
        this.urlSeed = seedParam.trim();
        this.autoStartFromUrl = true;
      } else if (autostartParam === '1' || autostartParam === 'true') {
        this.urlSeed = null;
        this.autoStartFromUrl = true;
      } else {
        this.urlSeed = null;
        this.autoStartFromUrl = false;
      }
    }
  }

  startTournament({ category = this.selectedCategory, mode = this.selectedMode, roundSize = this.selectedRoundSize, seed = null, pushUrl = true } = {}) {
    this.selectedCategory = category;
    this.selectedMode = mode;
    this.selectedRoundSize = roundSize;
    this.state = createWorldCupState({
      foods: this.foods,
      category: this.selectedCategory,
      mode: this.selectedMode,
      roundSize: this.selectedRoundSize,
      seed
    });
    this.isAnimatingPick = false;

    if (pushUrl && typeof window !== 'undefined' && window.history?.pushState) {
      const url = buildWorldCupUrl(this.selectedCategory, this.selectedMode, this.lang, {
        roundSize: this.state.initialRoundSize,
        seed: this.state.seed
      });
      window.history.pushState({ view: 'worldcup' }, '', url);
    }

    this.render();
    this.scrollArenaToTop();
  }

  resetToSetup() {
    this.state = { phase: 'setup' };
    this.isAnimatingPick = false;
    this.render();
    this.scrollArenaToTop();
  }

  handlePick(side) {
    if (this.isAnimatingPick || this.state.phase !== 'playing') return;
    this.isAnimatingPick = true;

    const cardEl = this.container?.querySelector(`[data-wc-side="${side}"]`);
    if (cardEl) {
      cardEl.classList.add('is-picked');
    }

    setTimeout(() => {
      this.state = pickWinner(this.state, side);
      this.isAnimatingPick = false;
      this.render();
      this.scrollArenaToTop();
    }, 220);
  }

  handleUndo() {
    if (this.isAnimatingPick) return;
    this.state = undoPick(this.state);
    this.render();
    this.scrollArenaToTop();
  }

  scrollArenaToTop() {
    if (typeof window === 'undefined' || !this.container) return;
    const headerOffset = 12;
    const rect = this.container.getBoundingClientRect();
    if (rect.top < 0 || window.innerWidth <= 768) {
      const top = Math.max(0, window.scrollY + rect.top - headerOffset);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  getCategoryLabel(catKey) {
    if (catKey === 'all') return t(this.lang, 'wcCatAll');
    return t(this.lang, `meal_${catKey}`);
  }

  getRoundText(roundSize) {
    if (roundSize === 2) return t(this.lang, 'wcRoundFinal');
    if (roundSize === 4) return t(this.lang, 'wcRoundSemi');
    return t(this.lang, 'wcRoundUnit', { n: roundSize });
  }

  getLocalizedFood(food) {
    const loc = localizeFood(food, this.lang, this.dict);
    const displayName = loc?.name || food?.name || '';
    let displaySubtitle = '';
    if (this.lang !== 'en' && food?.englishName && food.englishName !== displayName) {
      displaySubtitle = food.englishName;
    } else if (this.lang !== 'ko' && food?.name && food.name !== displayName) {
      displaySubtitle = food.name;
    }
    return {
      ...loc,
      displayName,
      displaySubtitle,
      displayTagline: loc?.tagline || '',
      displayFunComment: this.lang === 'ko' ? (loc?.funComment || '') : ''
    };
  }

  render() {
    if (!this.container) return;

    const isWorst = this.selectedMode === 'worst' || this.state.mode === 'worst';
    this.container.classList.toggle('wc-mode-worst', isWorst);
    this.container.classList.toggle('wc-mode-best', !isWorst);

    if (this.state.phase === 'playing') {
      this.container.innerHTML = this.renderArenaHtml();
      this.bindArenaEvents();
    } else if (this.state.phase === 'finished' && this.state.winner) {
      this.container.innerHTML = this.renderResultHtml();
      this.bindResultEvents();
    } else {
      this.container.innerHTML = this.renderSetupHtml();
      this.bindSetupEvents();
    }
  }

  renderSetupHtml() {
    const isWorst = this.selectedMode === 'worst';
    const catInfo = WORLDCUP_CATEGORIES.find((c) => c.key === this.selectedCategory) || WORLDCUP_CATEGORIES[2];
    const catLabel = this.getCategoryLabel(this.selectedCategory);
    const poolCount = filterFoodsByCategory(this.foods, this.selectedCategory).length;

    const modeTitle = t(this.lang, isWorst ? 'wcTitleWorst' : 'wcTitleBest');
    const modeDesc = t(this.lang, isWorst ? 'wcDescWorst' : 'wcDescBest');
    const countUnit = t(this.lang, 'wcCountUnit');

    const categoryButtons = WORLDCUP_CATEGORIES.map((cat) => {
      const count = filterFoodsByCategory(this.foods, cat.key).length;
      const active = cat.key === this.selectedCategory ? 'active' : '';
      const label = this.getCategoryLabel(cat.key);
      return `
        <button type="button" class="wc-cat-btn ${active}" data-wc-cat="${cat.key}">
          <span class="wc-cat-emoji">${cat.emoji}</span>
          <span class="wc-cat-name">${label}</span>
          <span class="wc-cat-count">${count}${countUnit ? ' ' + countUnit : ''}</span>
        </button>
      `;
    }).join('');

    const roundButtons = WORLDCUP_ROUND_SIZES.map((size) => {
      const active = size === this.selectedRoundSize ? 'active' : '';
      const disabled = poolCount < size ? 'disabled' : '';
      const label = t(this.lang, 'wcRoundUnit', { n: size });
      const matchesLabel = t(this.lang, 'wcMatchesUnit', { n: size - 1 });
      return `
        <button type="button" class="wc-round-btn ${active}" data-wc-round="${size}" ${disabled}>
          <strong>${label}</strong>
          <span>${matchesLabel}</span>
        </button>
      `;
    }).join('');

    const startLabel = t(this.lang, 'wcStartBtn', {
      emoji: catInfo.emoji,
      cat: catLabel,
      n: this.selectedRoundSize
    });

    return `
      <section class="wc-setup-card" aria-label="${modeTitle}">
        <div class="wc-hero-header">
          <span class="wc-hero-kicker">${t(this.lang, 'wcKicker')}</span>
          <h2 class="wc-hero-title">${modeTitle}</h2>
          <p class="wc-hero-desc">${modeDesc}</p>
        </div>

        <!-- 1. Mode Selection -->
        <div class="wc-section">
          <h3 class="wc-section-label">${t(this.lang, 'wcStep1')}</h3>
          <div class="wc-mode-grid">
            <button type="button" class="wc-mode-card ${!isWorst ? 'active' : ''}" data-wc-mode="best">
              <span class="wc-mode-icon">🏆</span>
              <div class="wc-mode-text">
                <strong>${t(this.lang, 'wcModeBest')}</strong>
                <span>${t(this.lang, 'wcModeBestSub')}</span>
              </div>
            </button>
            <button type="button" class="wc-mode-card wc-mode-card-worst ${isWorst ? 'active' : ''}" data-wc-mode="worst">
              <span class="wc-mode-icon">💀</span>
              <div class="wc-mode-text">
                <strong>${t(this.lang, 'wcModeWorst')}</strong>
                <span>${t(this.lang, 'wcModeWorstSub')}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Category Selection -->
        <div class="wc-section">
          <h3 class="wc-section-label">${t(this.lang, 'wcStep2')}</h3>
          <div class="wc-cat-grid">
            ${categoryButtons}
          </div>
        </div>

        <!-- 3. Round Size Selection -->
        <div class="wc-section">
          <h3 class="wc-section-label">${t(this.lang, 'wcStep3')}</h3>
          <div class="wc-round-grid">
            ${roundButtons}
          </div>
        </div>

        <!-- Start CTA -->
        <div class="wc-start-wrap">
          <button type="button" id="wc-start-btn" class="wc-start-btn">
            ${startLabel}
          </button>
          <p class="wc-mobile-hint">
            ${t(this.lang, 'wcMobileHint')}
          </p>
        </div>

        <!-- Quick SEO Presets -->
        <div class="wc-presets-wrap">
          <span class="wc-presets-label">${t(this.lang, 'wcPresetsLabel')}</span>
          <div class="wc-presets-list">
            <button type="button" class="wc-preset-chip" data-preset-cat="lunch" data-preset-mode="best">☀️ ${t(this.lang, 'wcPresetLunch')}</button>
            <button type="button" class="wc-preset-chip" data-preset-cat="dinner" data-preset-mode="best">🌙 ${t(this.lang, 'wcPresetDinner')}</button>
            <button type="button" class="wc-preset-chip" data-preset-cat="night" data-preset-mode="best">🦉 ${t(this.lang, 'wcPresetNight')}</button>
            <button type="button" class="wc-preset-chip" data-preset-cat="all" data-preset-mode="worst">💀 ${t(this.lang, 'wcPresetWorst')}</button>
          </div>
        </div>
      </section>
    `;
  }

  renderArenaHtml() {
    const isWorst = this.state.mode === 'worst';
    const currentMatch = this.state.matches[this.state.matchIndex];
    const [leftFood, rightFood] = currentMatch;
    const roundLabel = this.getRoundText(this.state.currentRoundSize);
    const catLabel = this.getCategoryLabel(this.state.category);
    const matchNum = this.state.matchIndex + 1;
    const totalInRound = this.state.matches.length;
    const progressPct = Math.round((this.state.completedMatches / Math.max(1, this.state.totalMatches)) * 100);

    const modeBadge = t(this.lang, isWorst ? 'wcModeBadgeWorst' : 'wcModeBadgeBest');
    const promptText = t(this.lang, isWorst ? 'wcPromptWorst' : 'wcPromptBest');
    const undoDisabled = this.state.history.length === 0 ? 'disabled' : '';

    return `
      <section class="wc-arena" id="worldcup-arena" aria-label="${modeBadge}">
        <div class="wc-arena-topbar">
          <div class="wc-arena-meta">
            <span class="wc-mode-pill ${isWorst ? 'worst' : 'best'}">${modeBadge}</span>
            <span class="wc-round-pill">${catLabel} · ${roundLabel} (${matchNum}/${totalInRound})</span>
          </div>
          <div class="wc-arena-controls">
            <button type="button" id="wc-undo-btn" class="wc-ctrl-btn" ${undoDisabled}>
              ↩️ ${t(this.lang, 'wcUndo')}
            </button>
            <button type="button" id="wc-restart-setup-btn" class="wc-ctrl-btn">
              ⚙️ ${t(this.lang, 'wcSetup')}
            </button>
          </div>
        </div>

        <div class="wc-progress-wrap">
          <div class="wc-progress-bar" style="width: ${progressPct}%"></div>
        </div>

        <p class="wc-arena-prompt">${promptText}</p>

        <div class="wc-versus-grid">
          ${this.renderCandidateCardHtml(leftFood, 'left')}
          <div class="wc-vs-divider" aria-hidden="true">
            <span class="wc-vs-badge">VS</span>
          </div>
          ${this.renderCandidateCardHtml(rightFood, 'right')}
        </div>
      </section>
    `;
  }

  renderCandidateCardHtml(food, side) {
    const isWorst = this.state.mode === 'worst';
    const loc = this.getLocalizedFood(food);
    const code = formatFoodCode(food.index);
    const imgUrl = getFoodImageUrl(code);
    const ctaText = t(this.lang, isWorst ? 'wcPickWorst' : 'wcPickBest');
    const posBadge = t(this.lang, side === 'left' ? 'wcOptionA' : 'wcOptionB');
    const priceStr = formatPriceForLang(food.priceRange, this.lang);

    return `
      <article class="wc-candidate-card" data-wc-side="${side}" tabindex="0" role="button" aria-label="${loc.displayName}">
        <div class="wc-card-img-wrap">
          <span class="wc-side-tag">${posBadge}</span>
          <img
            src="${imgUrl}"
            alt="${loc.displayName}"
            class="wc-card-img"
            loading="eager"
          />
          ${loc.originBadge ? `<span class="wc-origin-chip">${loc.originBadge}</span>` : ''}
        </div>
        <div class="wc-card-body">
          <h3 class="wc-card-title">${loc.displayName}</h3>
          ${loc.displaySubtitle ? `<p class="wc-card-sub">${loc.displaySubtitle}</p>` : ''}
          ${loc.displayTagline ? `<p class="wc-card-tagline">${loc.displayTagline}</p>` : ''}
          <div class="wc-card-specs">
            ${food.calories ? `<span class="wc-spec">${food.calories}</span>` : ''}
            ${priceStr ? `<span class="wc-spec">${priceStr}</span>` : ''}
          </div>
          <div class="wc-card-select-btn">${ctaText}</div>
        </div>
      </article>
    `;
  }

  renderResultHtml() {
    const isWorst = this.state.mode === 'worst';
    const winner = this.state.winner;
    const loc = this.getLocalizedFood(winner);
    const code = formatFoodCode(winner.index);
    const imgUrl = getFoodImageUrl(code);
    const catLabel = this.getCategoryLabel(this.state.category);
    const priceStr = formatPriceForLang(winner.priceRange, this.lang);

    const headline = t(this.lang, isWorst ? 'wcResultTitleWorst' : 'wcResultTitleBest', { cat: catLabel });
    const subStats = t(this.lang, 'wcResultStats', {
      cat: catLabel,
      n: this.state.initialRoundSize,
      m: this.state.totalMatches
    });

    return `
      <section class="wc-result-card" aria-label="${headline}">
        <div class="wc-result-banner">
          <span class="wc-result-kicker">${subStats}</span>
          <h2 class="wc-result-title">${headline}</h2>
        </div>

        <div class="wc-winner-showcase">
          <div class="wc-winner-img-wrap">
            <img src="${imgUrl}" alt="${loc.displayName}" class="wc-winner-img" />
            <span class="wc-winner-crown">${isWorst ? '💀 WORST #1' : '🏆 WINNER #1'}</span>
          </div>
          <div class="wc-winner-info">
            ${loc.originBadge ? `<span class="wc-origin-chip">${loc.originBadge}</span>` : ''}
            <h3 class="wc-winner-name">${loc.displayName}</h3>
            ${loc.displaySubtitle ? `<p class="wc-winner-sub">${loc.displaySubtitle}</p>` : ''}
            ${loc.displayTagline ? `<p class="wc-winner-tagline">${loc.displayTagline}</p>` : ''}
            ${loc.displayFunComment ? `<p class="wc-winner-comment">“${loc.displayFunComment}”</p>` : ''}
            <div class="wc-card-specs">
              ${winner.calories ? `<span class="wc-spec">${winner.calories}</span>` : ''}
              ${priceStr ? `<span class="wc-spec">${priceStr}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="wc-result-actions">
          <button type="button" id="wc-share-story-btn" class="btn btn-share-instagram">
            📸 ${t(this.lang, 'shareInstagramBtn')}
          </button>
          <button type="button" id="wc-share-kakao-btn" class="btn btn-share-kakao">
            💬 ${t(this.lang, 'shareKakaoBtn')}
          </button>
          <button type="button" id="wc-download-png-btn" class="btn btn-download-png">
            ⬇️ ${t(this.lang, 'downloadPngBtn')}
          </button>
          <button type="button" id="wc-copy-link-btn" class="btn btn-share-link">
            🔗 ${t(this.lang, 'shareLinkBtn')}
          </button>
        </div>

        <div class="wc-result-secondary">
          <button type="button" id="wc-view-detail-btn" class="wc-sec-btn">
            🔍 ${t(this.lang, 'wcViewDetail')}
          </button>
          <button type="button" id="wc-retry-same-btn" class="wc-sec-btn primary">
            🔄 ${t(this.lang, 'wcRetrySame')}
          </button>
          <button type="button" id="wc-back-setup-btn" class="wc-sec-btn">
            🎯 ${t(this.lang, 'wcBackSetup')}
          </button>
        </div>
      </section>
    `;
  }

  bindSetupEvents() {
    this.container.querySelectorAll('[data-wc-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedMode = btn.getAttribute('data-wc-mode');
        this.render();
      });
    });

    this.container.querySelectorAll('[data-wc-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-wc-cat');
        this.render();
      });
    });

    this.container.querySelectorAll('[data-wc-round]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        this.selectedRoundSize = Number(btn.getAttribute('data-wc-round'));
        this.render();
      });
    });

    const startBtn = document.getElementById('wc-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startTournament();
      });
    }

    this.container.querySelectorAll('[data-preset-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-preset-cat');
        const mode = btn.getAttribute('data-preset-mode');
        this.startTournament({ category: cat, mode, roundSize: this.selectedRoundSize });
      });
    });
  }

  bindArenaEvents() {
    this.container.querySelectorAll('[data-wc-side]').forEach((card) => {
      const side = card.getAttribute('data-wc-side');
      card.addEventListener('click', () => this.handlePick(side));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handlePick(side);
        }
      });
    });

    document.getElementById('wc-undo-btn')?.addEventListener('click', () => this.handleUndo());
    document.getElementById('wc-restart-setup-btn')?.addEventListener('click', () => this.resetToSetup());
  }

  bindResultEvents() {
    const winner = this.state.winner;
    if (!winner) return;
    const loc = this.getLocalizedFood(winner);
    const code = formatFoodCode(winner.index);
    const shareUrl = `${SITE_ORIGIN}${buildWorldCupUrl(this.state.category, this.state.mode, this.lang, {
      roundSize: this.state.initialRoundSize,
      seed: this.state.seed
    })}`;
    const catLabel = this.getCategoryLabel(this.state.category);
    const modeLabel = t(this.lang, this.state.mode === 'worst' ? 'wcModeWorst' : 'wcModeBest');
    const rankTitle = t(this.lang, 'wcRankTitle', { cat: catLabel, mode: modeLabel });
    const localizedWinner = {
      ...winner,
      name: loc.displayName,
      tagline: loc.displayTagline,
      funComment: loc.displayFunComment
    };
    const storyItems = [{
      mealKey: this.state.category === 'all' ? 'lunch' : this.state.category,
      food: localizedWinner
    }];

    document.getElementById('wc-share-story-btn')?.addEventListener('click', async () => {
      try {
        const canvas = await renderStoryCanvas({
          mode: 'single',
          name: rankTitle,
          dateText: new Date().toISOString().slice(0, 10),
          items: storyItems,
          lang: this.lang
        });
        const blob = await canvasToBlob(canvas);
        await shareImage(blob, `mukbang-worldcup-${code}.png`, `${loc.displayName} — ${shareUrl}`);
      } catch (err) {
        showToast(t(this.lang, 'wcShareFail'), 'error');
      }
    });

    document.getElementById('wc-download-png-btn')?.addEventListener('click', async () => {
      try {
        const canvas = await renderStoryCanvas({
          mode: 'single',
          name: rankTitle,
          dateText: new Date().toISOString().slice(0, 10),
          items: storyItems,
          lang: this.lang
        });
        const blob = await canvasToBlob(canvas);
        downloadImage(blob, `mukbang-worldcup-${code}.png`);
        showToast(t(this.lang, 'wcSavedImg'), 'success');
      } catch (err) {
        showToast(t(this.lang, 'wcSaveFail'), 'error');
      }
    });

    document.getElementById('wc-share-kakao-btn')?.addEventListener('click', async () => {
      const text = t(this.lang, 'wcShareMsg', {
        tab: t(this.lang, 'worldcupTab'),
        rank: rankTitle,
        food: loc.displayName,
        url: shareUrl
      });
      await shareKakaoText(text);
    });

    document.getElementById('wc-copy-link-btn')?.addEventListener('click', async () => {
      const ok = await copyToClipboard(shareUrl);
      showToast(ok ? t(this.lang, 'wcLinkCopied') : t(this.lang, 'wcLinkCopyFail'), ok ? 'success' : 'error');
    });

    document.getElementById('wc-view-detail-btn')?.addEventListener('click', () => {
      if (typeof this.onOpenFoodDetail === 'function') {
        this.onOpenFoodDetail(winner);
      }
    });

    document.getElementById('wc-retry-same-btn')?.addEventListener('click', () => {
      this.startTournament({
        category: this.state.category,
        mode: this.state.mode,
        roundSize: this.state.initialRoundSize
      });
    });

    document.getElementById('wc-back-setup-btn')?.addEventListener('click', () => {
      this.resetToSetup();
    });
  }
}
