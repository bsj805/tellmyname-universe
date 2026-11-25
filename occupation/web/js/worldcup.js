// web/js/worldcup.js — 나의 직업 고르기 이상형 월드컵 (최악 중 최선 / 최선 중 최악) — 14개국어 & 모바일 위·아래 스크롤 최적화

import { getJobConceptByLevel } from './lib/taxonomy.js';
import { MIN_LEVEL, MAX_LEVEL, GOOD_JOB_THRESHOLD } from './lib/constants.js';
import { localizeJob, getWorldCupTranslation } from './lib/i18n.js';

export const WORLDCUP_MODES = {
  'worst-to-best': {
    id: 'worst-to-best',
    dictKey: 'worstToBest',
    oppositeMode: 'best-to-worst',
    themeClass: 'wc-theme-worst',
    minLevel: MIN_LEVEL,
    maxLevel: GOOD_JOB_THRESHOLD - 1 // Lv.0 ~ 499 (500 bad jobs)
  },
  'best-to-worst': {
    id: 'best-to-worst',
    dictKey: 'bestToWorst',
    oppositeMode: 'worst-to-best',
    themeClass: 'wc-theme-best',
    minLevel: GOOD_JOB_THRESHOLD, // Lv.500 ~ 1000 (501 good jobs)
    maxLevel: MAX_LEVEL
  }
};

export const ROUND_OPTIONS = [16, 32, 64, 128, 256];

const wcState = {
  mode: 'worst-to-best',
  roundSize: 32,
  seed: null,
  phase: 'lobby', // 'lobby' | 'playing' | 'finished'
  currentRound: [],
  nextRoundWinners: [],
  matchIndex: 0,
  championLevel: null,
  isTransitioning: false,
  lang: 'ko',
  callbacks: {
    onViewHouse: null,
    onSwitchMode: null,
    onToast: null
  }
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function createSeededRng(seed) {
  let s = (Number(seed) >>> 0) || 1;
  return function () {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray(arr, rng = Math.random) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sampleLevelsForMode(modeId, count, seed = null) {
  const cfg = WORLDCUP_MODES[modeId] || WORLDCUP_MODES['worst-to-best'];
  const pool = [];
  for (let lv = cfg.minLevel; lv <= cfg.maxLevel; lv++) {
    pool.push(lv);
  }
  const rng = seed !== null && seed !== undefined ? createSeededRng(seed) : Math.random;
  const shuffled = shuffleArray(pool, rng);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function buildWorldCupShareUrl(mode = wcState.mode, roundSize = wcState.roundSize, seed = wcState.seed, lang = wcState.lang) {
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? window.location.origin
    : 'https://tellmyname.app/job';
  const params = new URLSearchParams();
  params.set('round', String(roundSize));
  if (seed !== null && seed !== undefined) {
    params.set('seed', String(seed));
  }
  if (lang && lang !== 'ko') {
    params.set('lang', lang);
  }
  return `${origin}/worldcup/${mode}?${params.toString()}`;
}

export function getRoundLabel(roundLength, lang = 'ko') {
  const t = getWorldCupTranslation(lang);
  if (roundLength <= 2) return t.finalLabel;
  if (roundLength === 4) return t.semiFinalLabel;
  return `${roundLength}${t.roundSuffix}`;
}

function getLocalizedJob(level, lang) {
  const raw = getJobConceptByLevel(level);
  if (lang && lang !== 'ko') {
    return localizeJob(raw, lang);
  }
  return raw;
}

function preloadNextMatchImages() {
  if (typeof Image === 'undefined') return;
  const nextIdx = wcState.matchIndex + 1;
  if (nextIdx * 2 + 1 < wcState.currentRound.length) {
    const lvA = wcState.currentRound[nextIdx * 2];
    const lvB = wcState.currentRound[nextIdx * 2 + 1];
    [lvA, lvB].forEach(lv => {
      const img = new Image();
      img.src = `/r2/jobs/${String(lv).padStart(5, '0')}.webp`;
    });
  }
}

export function setWorldCupLanguage(lang) {
  wcState.lang = lang || 'ko';
}

export function openWorldCupMode(modeId, rootEl, callbacks = {}, options = {}) {
  if (callbacks) {
    wcState.callbacks = { ...wcState.callbacks, ...callbacks };
  }
  if (WORLDCUP_MODES[modeId]) {
    const modeChanged = wcState.mode !== modeId;
    wcState.mode = modeId;
    if (modeChanged && !options.seed) {
      wcState.phase = 'lobby';
      wcState.seed = null;
      wcState.currentRound = [];
      wcState.nextRoundWinners = [];
      wcState.matchIndex = 0;
      wcState.championLevel = null;
      wcState.isTransitioning = false;
    }
  }
  if (options.roundSize && ROUND_OPTIONS.includes(Number(options.roundSize))) {
    wcState.roundSize = Number(options.roundSize);
  }
  if (options.seed) {
    startTournament(wcState.roundSize, rootEl, Number(options.seed));
    return;
  }
  renderWorldCup(rootEl);
}

export function startTournament(roundSize, rootEl, customSeed = null) {
  const size = ROUND_OPTIONS.includes(Number(roundSize)) ? Number(roundSize) : 32;
  const parsedSeed = customSeed !== null && customSeed !== undefined && !isNaN(Number(customSeed)) && Number(customSeed) > 0
    ? Math.floor(Number(customSeed))
    : Math.floor(10000000 + Math.random() * 90000000);

  wcState.roundSize = size;
  wcState.seed = parsedSeed;
  wcState.currentRound = sampleLevelsForMode(wcState.mode, size, parsedSeed);
  wcState.nextRoundWinners = [];
  wcState.matchIndex = 0;
  wcState.championLevel = null;
  wcState.phase = 'playing';
  wcState.isTransitioning = false;

  if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const sharePath = `/worldcup/${wcState.mode}?round=${size}&seed=${parsedSeed}${wcState.lang && wcState.lang !== 'ko' ? `&lang=${wcState.lang}` : ''}`;
    window.history.replaceState({ tab: wcState.mode, round: size, seed: parsedSeed }, '', sharePath);
  }

  preloadNextMatchImages();
  renderWorldCup(rootEl);
}

export function selectCandidate(choiceIdx, rootEl) {
  if (wcState.phase !== 'playing' || wcState.isTransitioning) return;

  const pairStart = wcState.matchIndex * 2;
  const levelA = wcState.currentRound[pairStart];
  const levelB = wcState.currentRound[pairStart + 1];
  const winnerLevel = choiceIdx === 0 ? levelA : levelB;
  if (winnerLevel === undefined) return;

  wcState.isTransitioning = true;

  const cards = rootEl ? rootEl.querySelectorAll('.wc-candidate-card') : [];
  if (cards[choiceIdx]) {
    cards[choiceIdx].classList.add('wc-selected');
  }

  setTimeout(() => {
    wcState.nextRoundWinners.push(winnerLevel);
    const totalMatchesInRound = Math.floor(wcState.currentRound.length / 2);

    if (wcState.matchIndex + 1 < totalMatchesInRound) {
      wcState.matchIndex += 1;
    } else if (wcState.nextRoundWinners.length === 1) {
      wcState.championLevel = wcState.nextRoundWinners[0];
      wcState.phase = 'finished';
    } else {
      const roundRng = createSeededRng((Number(wcState.seed) || 1) + (wcState.nextRoundWinners.length * 1009) + 77);
      wcState.currentRound = shuffleArray(wcState.nextRoundWinners, roundRng);
      wcState.nextRoundWinners = [];
      wcState.matchIndex = 0;
    }

    wcState.isTransitioning = false;
    preloadNextMatchImages();
    renderWorldCup(rootEl);

    if (rootEl && typeof window !== 'undefined') {
      const topAnchor = rootEl.querySelector('#wc-arena-top') || rootEl;
      const rect = topAnchor.getBoundingClientRect();
      if (rect.top < 0 || window.innerWidth <= 768) {
        topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 220);
}

export function restartSameTournament(rootEl) {
  return startTournament(wcState.roundSize, rootEl, wcState.seed);
}

export async function copySameBracketUrl(t) {
  const url = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);
  try {
    if (typeof document !== 'undefined') {
      const input = document.getElementById('wc-share-url-input') || document.getElementById('wc-finish-share-url-input');
      if (input) {
        input.select();
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(0, 99999);
        }
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    }
    if (typeof wcState.callbacks.onToast === 'function') {
      wcState.callbacks.onToast(t.shareBracketToast);
    }
  } catch {
    if (typeof wcState.callbacks.onToast === 'function') {
      wcState.callbacks.onToast(t.copyFailToast);
    }
  }
  return url;
}

function renderLobby(cfg, t, modeText) {
  const roundButtonsHtml = ROUND_OPTIONS.map(size => {
    const isActive = wcState.roundSize === size;
    const isRecommended = size === 32 || size === 64 || size === 128;
    return `
      <button type="button" class="wc-round-btn ${isActive ? 'active' : ''}" data-round="${size}">
        <span class="wc-round-num">${size}${escapeHtml(t.roundSuffix)}</span>
        <span class="wc-round-meta">${escapeHtml(t.totalMatchesPrefix)}${size - 1}${escapeHtml(t.totalMatchesSuffix)}${size === 32 ? escapeHtml(t.recommended) : ''}</span>
      </button>
    `;
  }).join('');

  const hint1 = t.lobbyHint1
    .replace('{min}', String(cfg.minLevel))
    .replace('{max}', String(cfg.maxLevel));

  return `
    <div class="wc-container ${cfg.themeClass}">
      <div class="wc-lobby-card">
        <div class="wc-lobby-badge">${escapeHtml(modeText.badge)}</div>
        <h2 class="wc-lobby-title">${escapeHtml(modeText.title)}</h2>
        <p class="wc-lobby-subtitle">${escapeHtml(modeText.subtitle)}</p>

        <div class="wc-round-selector">
          <div class="wc-round-selector-label">${escapeHtml(t.selectRoundLabel)}</div>
          <div class="wc-round-grid">
            ${roundButtonsHtml}
          </div>
        </div>

        <button type="button" id="wc-start-btn" class="wc-start-btn">
          <span>🎲</span>
          <span>${wcState.roundSize}${escapeHtml(t.startBtnSuffix)}</span>
        </button>

        <p class="wc-lobby-hint">
          💡 ${escapeHtml(hint1)}<br />
          📱 ${escapeHtml(t.lobbyHint2)}
        </p>
      </div>
    </div>
  `;
}

function renderCandidateCard(job, choiceIdx, t) {
  const isReal = job.realityType === 'REAL';
  const realityBadge = isReal ? t.realBadge : t.fictionBadge;
  const realityClass = isReal ? 'badge-real' : 'badge-fiction';
  const levelPadded = String(job.level).padStart(5, '0');
  const imgSrc = job.imageUrl || `/r2/jobs/${levelPadded}.webp`;

  return `
    <article class="wc-candidate-card" data-choice="${choiceIdx}" tabindex="0" role="button" aria-label="${escapeHtml(job.title)}">
      <div class="wc-card-media">
        <img
          src="${escapeHtml(imgSrc)}"
          alt="Lv.${job.level} ${escapeHtml(job.title)}"
          class="wc-card-img"
          loading="eager"
          onerror="if(!this.dataset.retried){this.dataset.retried='1';setTimeout(()=>{this.src=this.src.split('?')[0]+'?r='+Date.now();},300);}else if(window.renderJobFallbackSvg){this.onerror=null;this.src=window.renderJobFallbackSvg(${job.level});}"
        />
        <div class="wc-card-badges">
          <span class="wc-level-pill">Lv.${job.level}</span>
          <span class="wc-reality-pill ${realityClass}">${escapeHtml(realityBadge)}</span>
        </div>
      </div>

      <div class="wc-card-body">
        <div class="wc-card-tier">${escapeHtml(job.categoryEmoji || '💼')} ${escapeHtml(job.tierName || '')}</div>
        <h3 class="wc-card-title">${escapeHtml(job.title)}</h3>

        <div class="wc-card-specs">
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.builtYearLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(job.era || job.builtYear || '-')}</span>
          </div>
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.valueLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(job.estimatedSalary || job.estimatedValue || '-')}</span>
          </div>
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.featureLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(job.specialDuty || job.specialFeature || '-')}</span>
          </div>
        </div>

        <button type="button" class="wc-pick-btn" data-choice="${choiceIdx}">
          ${escapeHtml(t.pickBtn)}
        </button>
      </div>
    </article>
  `;
}

function renderPlaying(cfg, t, modeText) {
  const pairStart = wcState.matchIndex * 2;
  const lvA = wcState.currentRound[pairStart];
  const lvB = wcState.currentRound[pairStart + 1];
  const jobA = getLocalizedJob(lvA, wcState.lang);
  const jobB = getLocalizedJob(lvB, wcState.lang);

  const totalMatches = Math.floor(wcState.currentRound.length / 2);
  const currentMatchNum = wcState.matchIndex + 1;
  const roundLabel = getRoundLabel(wcState.currentRound.length, wcState.lang);
  const progressPct = Math.round((currentMatchNum / totalMatches) * 100);
  const matchCounterText = t.matchCounter
    .replace('{cur}', String(currentMatchNum))
    .replace('{total}', String(totalMatches));
  const shareUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);

  return `
    <div class="wc-container ${cfg.themeClass}" id="wc-arena-top">
      <div class="wc-status-bar">
        <div class="wc-status-top">
          <div class="wc-status-title-group">
            <span class="wc-round-chip">${escapeHtml(roundLabel)}</span>
            <span class="wc-match-counter">${escapeHtml(matchCounterText)}</span>
          </div>
          <div class="wc-status-actions">
            <button type="button" id="wc-restart-same-btn" class="wc-reset-btn" title="${escapeHtml(t.restartSameBtn || '🔁 이 대진표 처음부터')}">
              ${escapeHtml(t.restartSameBtn || '🔁 이 대진표 처음부터')}
            </button>
            <button type="button" id="wc-reset-btn" class="wc-reset-btn" title="${escapeHtml(t.resetBtn || '🔄 처음으로')}">
              ${escapeHtml(t.resetBtn || '🔄 처음으로')}
            </button>
          </div>
        </div>

        <div class="wc-same-condition-bar">
          <span class="wc-seed-badge">🎯 ${wcState.roundSize}${escapeHtml(t.roundSuffix)} · Seed #${wcState.seed}</span>
          <input type="text" id="wc-share-url-input" class="wc-share-url-input" value="${escapeHtml(shareUrl)}" readonly aria-label="같은 조건으로 다시 할 수 있는 URL" />
          <button type="button" id="wc-share-bracket-btn" class="wc-share-url-btn">
            ${escapeHtml(t.shareBracketBtn)}
          </button>
        </div>

        <div class="wc-progress-track" aria-hidden="true">
          <div class="wc-progress-fill" style="width: ${progressPct}%"></div>
        </div>
        <p class="wc-question-prompt">${escapeHtml(modeText.questionPrompt)}</p>
      </div>

      <div class="wc-arena">
        ${renderCandidateCard(jobA, 0, t)}

        <div class="wc-vs-divider" aria-hidden="true">
          <span class="wc-vs-badge">VS</span>
        </div>

        ${renderCandidateCard(jobB, 1, t)}
      </div>
    </div>
  `;
}

function renderFinished(cfg, t, modeText) {
  const job = getLocalizedJob(wcState.championLevel, wcState.lang);
  const isReal = job.realityType === 'REAL';
  const realityBadge = isReal ? t.realFullBadge : t.fictionFullBadge;
  const levelPadded = String(job.level).padStart(5, '0');
  const imgSrc = job.imageUrl || `/r2/jobs/${levelPadded}.webp`;
  const shareUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);

  return `
    <div class="wc-container ${cfg.themeClass}">
      <div class="wc-champion-card">
        <div class="wc-champion-header">
          <span class="wc-champion-badge">${wcState.roundSize}${escapeHtml(t.championBadgeSuffix)}</span>
          <h2 class="wc-champion-title">${escapeHtml(modeText.championTitle)}</h2>
        </div>

        <div class="wc-champion-media">
          <img
            src="${escapeHtml(imgSrc)}"
            alt="Lv.${job.level} ${escapeHtml(job.title)}"
            class="wc-champion-img"
            onerror="if(!this.dataset.retried){this.dataset.retried='1';setTimeout(()=>{this.src=this.src.split('?')[0]+'?r='+Date.now();},300);}else if(window.renderJobFallbackSvg){this.onerror=null;this.src=window.renderJobFallbackSvg(${job.level});}"
          />
          <div class="wc-card-badges">
            <span class="wc-level-pill">Lv.${job.level}</span>
            <span class="wc-reality-pill ${isReal ? 'badge-real' : 'badge-fiction'}">${escapeHtml(realityBadge)}</span>
          </div>
        </div>

        <div class="wc-champion-body">
          <div class="wc-card-tier">${escapeHtml(job.categoryEmoji || '💼')} ${escapeHtml(job.tierName || '')}</div>
          <h3 class="wc-champion-house-name">${escapeHtml(job.title)}</h3>

          <div class="wc-card-specs">
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.builtYearLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(job.era || job.builtYear || '-')}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.valueLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(job.estimatedSalary || job.estimatedValue || '-')}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.featureFullLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(job.specialDuty || job.specialFeature || '-')}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.verdictLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(job.aiVerdict || '-')}</span>
            </div>
          </div>

          <div class="wc-same-condition-box">
            <div class="wc-same-condition-title">${escapeHtml(t.sameConditionBoxTitle || '🔗 같은 조건으로 다시 하기 / 친구에게 같은 대진표 공유')}</div>
            <p class="wc-same-condition-desc">${escapeHtml((t.sameConditionBoxDesc || '').replace('{mode}', modeText.title).replace('{round}', String(wcState.roundSize)).replace('{seed}', String(wcState.seed)))}</p>
            <div class="wc-same-condition-input-row">
              <input type="text" id="wc-finish-share-url-input" class="wc-share-url-input" value="${escapeHtml(shareUrl)}" readonly aria-label="같은 조건 공유 URL" />
              <button type="button" id="wc-copy-url-inline-btn" class="wc-share-url-btn">${escapeHtml(t.copyUrlShortBtn || 'URL 복사')}</button>
            </div>
          </div>

          <div class="wc-champion-actions">
            <button type="button" id="wc-replay-same-btn" class="wc-action-btn wc-btn-primary">
              ${escapeHtml(t.replaySameBtn || '🔁 같은 조건(동일 대진표)으로 다시 하기')}
            </button>
            <button type="button" id="wc-share-bracket-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.shareBracketBtn)}
            </button>
            <button type="button" id="wc-replay-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.replayNewRandomBtn || t.replayBtn)}
            </button>
            <button type="button" id="wc-copy-result-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.copyBtn)}
            </button>
            <button type="button" id="wc-view-detail-btn" class="wc-action-btn wc-btn-outline">
              ${escapeHtml(t.viewDetailBtn)}
            </button>
            <button type="button" id="wc-opposite-btn" class="wc-action-btn wc-btn-outline">
              ${escapeHtml(modeText.oppositeLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderWorldCup(rootEl) {
  if (!rootEl) return;
  const cfg = WORLDCUP_MODES[wcState.mode] || WORLDCUP_MODES['worst-to-best'];
  const t = getWorldCupTranslation(wcState.lang);
  const modeText = t[cfg.dictKey] || t.worstToBest;

  if (wcState.phase === 'lobby') {
    rootEl.innerHTML = renderLobby(cfg, t, modeText);
    attachLobbyEvents(rootEl);
  } else if (wcState.phase === 'playing') {
    rootEl.innerHTML = renderPlaying(cfg, t, modeText);
    attachPlayingEvents(rootEl, t);
  } else if (wcState.phase === 'finished') {
    rootEl.innerHTML = renderFinished(cfg, t, modeText);
    attachFinishedEvents(rootEl, cfg, t, modeText);
  }
}

function attachLobbyEvents(rootEl) {
  const roundBtns = rootEl.querySelectorAll('.wc-round-btn');
  roundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wcState.roundSize = Number(btn.dataset.round) || 32;
      renderWorldCup(rootEl);
    });
  });

  const startBtn = rootEl.querySelector('#wc-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startTournament(wcState.roundSize, rootEl);
    });
  }
}

function attachPlayingEvents(rootEl, t) {
  const restartSameBtn = rootEl.querySelector('#wc-restart-same-btn');
  if (restartSameBtn) {
    restartSameBtn.addEventListener('click', () => {
      restartSameTournament(rootEl);
    });
  }

  const resetBtn = rootEl.querySelector('#wc-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      wcState.phase = 'lobby';
      wcState.seed = null;
      renderWorldCup(rootEl);
    });
  }

  const shareBracketBtn = rootEl.querySelector('#wc-share-bracket-btn');
  if (shareBracketBtn) {
    shareBracketBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const shareInput = rootEl.querySelector('#wc-share-url-input');
  if (shareInput) {
    shareInput.addEventListener('click', () => copySameBracketUrl(t));
    shareInput.addEventListener('focus', () => copySameBracketUrl(t));
  }

  const cards = rootEl.querySelectorAll('.wc-candidate-card');
  cards.forEach(card => {
    const choiceIdx = Number(card.dataset.choice);
    card.addEventListener('click', () => {
      selectCandidate(choiceIdx, rootEl);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCandidate(choiceIdx, rootEl);
      }
    });
  });
}

function attachFinishedEvents(rootEl, cfg, t, modeText) {
  const replaySameBtn = rootEl.querySelector('#wc-replay-same-btn');
  if (replaySameBtn) {
    replaySameBtn.addEventListener('click', () => {
      restartSameTournament(rootEl);
    });
  }

  const replayBtn = rootEl.querySelector('#wc-replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      wcState.phase = 'lobby';
      wcState.seed = null;
      renderWorldCup(rootEl);
    });
  }

  const shareBracketBtn = rootEl.querySelector('#wc-share-bracket-btn');
  if (shareBracketBtn) {
    shareBracketBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const copyUrlInlineBtn = rootEl.querySelector('#wc-copy-url-inline-btn');
  if (copyUrlInlineBtn) {
    copyUrlInlineBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const finishShareInput = rootEl.querySelector('#wc-finish-share-url-input');
  if (finishShareInput) {
    finishShareInput.addEventListener('click', () => copySameBracketUrl(t));
    finishShareInput.addEventListener('focus', () => copySameBracketUrl(t));
  }

  const oppositeBtn = rootEl.querySelector('#wc-opposite-btn');
  if (oppositeBtn) {
    oppositeBtn.addEventListener('click', () => {
      if (typeof wcState.callbacks.onSwitchMode === 'function') {
        wcState.callbacks.onSwitchMode(cfg.oppositeMode);
      } else {
        openWorldCupMode(cfg.oppositeMode, rootEl, wcState.callbacks);
      }
    });
  }

  const viewDetailBtn = rootEl.querySelector('#wc-view-detail-btn');
  if (viewDetailBtn) {
    viewDetailBtn.addEventListener('click', () => {
      if (typeof wcState.callbacks.onViewHouse === 'function') {
        wcState.callbacks.onViewHouse(wcState.championLevel);
      }
    });
  }

  const copyBtn = rootEl.querySelector('#wc-copy-result-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const job = getLocalizedJob(wcState.championLevel, wcState.lang);
      const bracketUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);
      const text = `[MyJob ${modeText.title} - ${wcState.roundSize}${t.championBadgeSuffix}]\n💼 Lv.${job.level} ${job.title}\n💰 ${job.estimatedSalary || job.estimatedValue}\n⚡ ${job.specialDuty || job.specialFeature}\n🔗 ${bracketUrl}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
        if (typeof wcState.callbacks.onToast === 'function') {
          wcState.callbacks.onToast(t.copiedToast);
        }
      } catch {
        if (typeof wcState.callbacks.onToast === 'function') {
          wcState.callbacks.onToast(t.copyFailToast);
        }
      }
    });
  }
}
