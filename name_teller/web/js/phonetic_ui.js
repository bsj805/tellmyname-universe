// web/js/phonetic_ui.js — 외국어 이름 → 한국어 이름 발음 탐색 UI 컴포넌트
// 엄격 소유 파일: phonetic_ui.js

import { on, emit, escapeHtml } from './core.js';
import { findPhoneticMatches, normalizeForeignName, hangulToRoman } from './phonetic_matcher.js';
import { CURATED_NAMES } from './phonetic_data.js';
import { getLang, t } from './i18n.js';
import { logSearch } from './search.js';

let rootEl = null;
let currentCtx = null;
let launcherBtn = null;
let activeLangFilter = 'all';
let currentSearchQuery = 'Sophia';

const LANG_REPRESENTATIVE_NAMES = {
  vi: [
    { name: 'Minh', flag: '🇻🇳', lang: 'vi' },
    { name: 'Linh', flag: '🇻🇳', lang: 'vi' },
    { name: 'Duc', flag: '🇻🇳', lang: 'vi' },
    { name: 'Hoa', flag: '🇻🇳', lang: 'vi' },
    { name: 'Anh', flag: '🇻🇳', lang: 'vi' }
  ],
  fr: [
    { name: 'Camille', flag: '🇫🇷', lang: 'fr' },
    { name: 'Louis', flag: '🇫🇷', lang: 'fr' },
    { name: 'Gabriel', flag: '🇫🇷', lang: 'fr' },
    { name: 'Léa', flag: '🇫🇷', lang: 'fr' },
    { name: 'Manon', flag: '🇫🇷', lang: 'fr' }
  ],
  es: [
    { name: 'Carlos', flag: '🇪🇸', lang: 'es' },
    { name: 'Mateo', flag: '🇪🇸', lang: 'es' },
    { name: 'Sofía', flag: '🇪🇸', lang: 'es' },
    { name: 'Santiago', flag: '🇪🇸', lang: 'es' },
    { name: 'Valentina', flag: '🇪🇸', lang: 'es' }
  ],
  pt: [
    { name: 'Thiago', flag: '🇧🇷', lang: 'pt' },
    { name: 'Gabriel', flag: '🇧🇷', lang: 'pt' },
    { name: 'Lucas', flag: '🇧🇷', lang: 'pt' },
    { name: 'Alice', flag: '🇧🇷', lang: 'pt' },
    { name: 'Arthur', flag: '🇧🇷', lang: 'pt' }
  ],
  de: [
    { name: 'Felix', flag: '🇩🇪', lang: 'de' },
    { name: 'Maximilian', flag: '🇩🇪', lang: 'de' },
    { name: 'Lukas', flag: '🇩🇪', lang: 'de' },
    { name: 'Emma', flag: '🇩🇪', lang: 'de' },
    { name: 'Mia', flag: '🇩🇪', lang: 'de' }
  ],
  it: [
    { name: 'Marco', flag: '🇮🇹', lang: 'it' },
    { name: 'Leonardo', flag: '🇮🇹', lang: 'it' },
    { name: 'Francesco', flag: '🇮🇹', lang: 'it' },
    { name: 'Giulia', flag: '🇮🇹', lang: 'it' },
    { name: 'Sofia', flag: '🇮🇹', lang: 'it' }
  ],
  ru: [
    { name: 'Elena', flag: '🇷🇺', lang: 'ru' },
    { name: 'Alexander', flag: '🇷🇺', lang: 'ru' },
    { name: 'Dmitry', flag: '🇷🇺', lang: 'ru' },
    { name: 'Anastasia', flag: '🇷🇺', lang: 'ru' },
    { name: 'Ivan', flag: '🇷🇺', lang: 'ru' }
  ],
  id: [
    { name: 'Budi', flag: '🇮🇩', lang: 'id' },
    { name: 'Siti', flag: '🇮🇩', lang: 'id' },
    { name: 'Dewi', flag: '🇮🇩', lang: 'id' },
    { name: 'Rizky', flag: '🇮🇩', lang: 'id' },
    { name: 'Agus', flag: '🇮🇩', lang: 'id' }
  ],
  ja: [
    { name: 'Sakura', flag: '🇯🇵', lang: 'ja' },
    { name: 'Haruto', flag: '🇯🇵', lang: 'ja' },
    { name: 'Ren', flag: '🇯🇵', lang: 'ja' },
    { name: 'Yuto', flag: '🇯🇵', lang: 'ja' },
    { name: 'Aoi', flag: '🇯🇵', lang: 'ja' }
  ],
  zh: [
    { name: 'Chen Yu', flag: '🇨🇳', lang: 'zh' },
    { name: 'Zi Han', flag: '🇨🇳', lang: 'zh' },
    { name: 'Hao Yu', flag: '🇨🇳', lang: 'zh' },
    { name: 'Xin Yi', flag: '🇨🇳', lang: 'zh' },
    { name: 'Yu Xuan', flag: '🇨🇳', lang: 'zh' }
  ],
  en: [
    { name: 'Sophia', flag: '🇺🇸', lang: 'en' },
    { name: 'Lucas', flag: '🇺🇸', lang: 'en' },
    { name: 'Liam', flag: '🇺🇸', lang: 'en' },
    { name: 'Emma', flag: '🇺🇸', lang: 'en' },
    { name: 'Oliver', flag: '🇺🇸', lang: 'en' }
  ]
};

const QUICK_FEATURED_NAMES = [
  { name: 'Sophia', flag: '🇺🇸', lang: 'en' },
  { name: 'Lucas', flag: '🇺🇸', lang: 'en' },
  { name: 'Carlos', flag: '🇪🇸', lang: 'es' },
  { name: 'Minh', flag: '🇻🇳', lang: 'vi' },
  { name: 'Elena', flag: '🇷🇺', lang: 'ru' },
  { name: 'Sakura', flag: '🇯🇵', lang: 'ja' },
  { name: 'Felix', flag: '🇩🇪', lang: 'de' },
  { name: 'Budi', flag: '🇮🇩', lang: 'id' },
  { name: 'Chen Yu', flag: '🇨🇳', lang: 'zh' },
  { name: 'Camille', flag: '🇫🇷', lang: 'fr' },
  { name: 'Marco', flag: '🇮🇹', lang: 'it' },
  { name: 'Thiago', flag: '🇵🇹', lang: 'pt' }
];

const LANG_OPTIONS = [
  { id: 'all', label: '전체 (All)' },
  { id: 'en', label: '🇺🇸 English' },
  { id: 'es', label: '🇪🇸 Español' },
  { id: 'vi', label: '🇻🇳 Tiếng Việt' },
  { id: 'ru', label: '🇷🇺 Русский' },
  { id: 'ja', label: '🇯🇵 日本語' },
  { id: 'zh', label: '🇨🇳 中文' },
  { id: 'fr', label: '🇫🇷 Français' },
  { id: 'de', label: '🇩🇪 Deutsch' },
  { id: 'it', label: '🇮🇹 Italiano' },
  { id: 'pt', label: '🇵🇹 Português' },
  { id: 'id', label: '🇮🇩 Bahasa' }
];

function getFeaturedChips(lang) {
  if (lang && lang !== 'all' && LANG_REPRESENTATIVE_NAMES[lang]) {
    const primary = LANG_REPRESENTATIVE_NAMES[lang];
    const others = QUICK_FEATURED_NAMES.filter(item => item.lang !== lang);
    return [...primary, ...others.slice(0, 7)];
  }
  return QUICK_FEATURED_NAMES;
}

export async function init(ctx) {
  currentCtx = ctx;
  rootEl = document.getElementById('phonetic-root');
  if (!rootEl) return;

  // 초기 설정 언어 감지하여 우선 적용
  const initialLang = getLang();
  if (initialLang && initialLang !== 'ko' && LANG_REPRESENTATIVE_NAMES[initialLang]) {
    activeLangFilter = initialLang;
    currentSearchQuery = LANG_REPRESENTATIVE_NAMES[initialLang][0].name;
  } else {
    activeLangFilter = 'all';
    currentSearchQuery = 'Sophia';
  }

  // 1. 패널 기본 DOM 골격 렌더링
  renderPanelSkeleton();

  // 2. 화면 우하단 '외국어 이름 → 한국어 이름' 플로팅 런처 주입
  injectFloatingLauncher();

  // 3. 이벤트 리스너 등록
  bindEvents();

  // 4. 초기 추천 데이터 준비 (설정 언어 우선)
  executeSearch(currentSearchQuery);
}

function renderPanelSkeleton() {
  const titleText = t('phonetic.title') || '외국어 이름 → 한국어 이름';
  const subtitleText = t('phonetic.subtitle') || '내 외국어 이름과 발음이 가장 닮은 한국어 이름을 찾아드립니다';
  const inputHint = t('phonetic.input_hint') || '외국어 이름 입력 (예: Lucas, Sophia, Minh, Camille...)';
  const featuredList = getFeaturedChips(activeLangFilter);

  rootEl.innerHTML = `
    <div class="phonetic-header">
      <div class="phonetic-title-wrap">
        <div class="phonetic-title">
          <span class="phonetic-title-text">🌐 ${escapeHtml(titleText)}</span>
          <span class="phonetic-title-badge">Phonetic Match</span>
        </div>
        <span class="phonetic-subtitle">${escapeHtml(subtitleText)}</span>
      </div>
      <button type="button" class="phonetic-close-btn" aria-label="닫기" title="닫기">✕</button>
    </div>

    <div class="phonetic-search-bar">
      <div class="phonetic-input-wrapper">
        <svg class="phonetic-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.5" y2="16.5"></line>
        </svg>
        <input
          type="text"
          class="phonetic-search-input"
          placeholder="${escapeHtml(inputHint)}"
          aria-label="외국어 이름 입력"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" class="phonetic-input-clear" aria-label="입력 지우기" hidden>✕</button>
      </div>
    </div>

    <div class="phonetic-chips-container">
      <div class="phonetic-chips-label">인기 추천 이름 빠른 탐색:</div>
      <div class="phonetic-chips-scroll phonetic-name-chips" role="list">
        ${featuredList.map(item => `
          <button type="button" class="phonetic-chip" data-name="${escapeHtml(item.name)}">
            ${item.flag} ${escapeHtml(item.name)}
          </button>
        `).join('')}
      </div>
      <div class="phonetic-chips-scroll phonetic-lang-chips" role="list">
        ${LANG_OPTIONS.map(opt => `
          <button type="button" class="phonetic-chip ${opt.id === activeLangFilter ? 'is-active' : ''}" data-lang="${opt.id}">
            ${escapeHtml(opt.label)}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="phonetic-stream" role="region" aria-live="polite"></div>
  `;
}

function injectFloatingLauncher() {
  if (document.querySelector('.phonetic-launcher-btn')) return;
  launcherBtn = document.createElement('button');
  launcherBtn.type = 'button';
  launcherBtn.className = 'phonetic-launcher-btn';
  const labelText = t('phonetic.title') || '외국어 이름 → 한국어 이름';
  launcherBtn.setAttribute('aria-label', labelText);
  launcherBtn.innerHTML = `
    <span class="phonetic-launcher-globe" aria-hidden="true">🌐</span>
    <span class="phonetic-launcher-text">${escapeHtml(labelText)}</span>
  `;
  launcherBtn.addEventListener('click', () => {
    if (rootEl.hidden) {
      show();
      const input = rootEl.querySelector('.phonetic-search-input');
      if (input) {
        input.focus();
        if (!input.value) {
          executeSearch(currentSearchQuery);
        }
      }
    } else {
      hide();
    }
  });
  document.body.appendChild(launcherBtn);
}

function updateNameChips(lang) {
  const chipsContainer = rootEl.querySelector('.phonetic-name-chips');
  if (!chipsContainer) return;
  const list = getFeaturedChips(lang);
  chipsContainer.innerHTML = list.map(item => `
    <button type="button" class="phonetic-chip" data-name="${escapeHtml(item.name)}">
      ${item.flag} ${escapeHtml(item.name)}
    </button>
  `).join('');
}

function updateLangChips(lang) {
  rootEl.querySelectorAll('.phonetic-lang-chips .phonetic-chip').forEach(c => {
    c.classList.toggle('is-active', c.getAttribute('data-lang') === lang);
  });
}

function handleLanguageSwitch(newLang) {
  if (newLang && newLang !== 'ko' && LANG_REPRESENTATIVE_NAMES[newLang]) {
    activeLangFilter = newLang;
    currentSearchQuery = LANG_REPRESENTATIVE_NAMES[newLang][0].name;
  } else {
    activeLangFilter = 'all';
    currentSearchQuery = 'Sophia';
  }

  // 1. 헤더 및 라벨 갱신
  const titleEl = rootEl.querySelector('.phonetic-title-text');
  if (titleEl) titleEl.textContent = `🌐 ${t('phonetic.title') || '외국어 이름 → 한국어 이름'}`;
  const subtitleEl = rootEl.querySelector('.phonetic-subtitle');
  if (subtitleEl) subtitleEl.textContent = t('phonetic.subtitle') || '내 외국어 이름과 발음이 가장 닮은 한국어 이름을 찾아드립니다';

  // 2. 검색창 placeholder 및 기본 검색어 갱신
  const input = rootEl.querySelector('.phonetic-search-input');
  if (input) {
    input.placeholder = t('phonetic.input_hint') || '외국어 이름 입력 (예: Lucas, Sophia, Minh, Camille...)';
    input.value = currentSearchQuery;
    const clearBtn = rootEl.querySelector('.phonetic-input-clear');
    if (clearBtn) clearBtn.hidden = !currentSearchQuery;
  }

  // 3. 플로팅 런처 텍스트 갱신
  if (launcherBtn) {
    const launcherText = launcherBtn.querySelector('.phonetic-launcher-text');
    const label = t('phonetic.title') || '외국어 이름 → 한국어 이름';
    if (launcherText) launcherText.textContent = label;
    launcherBtn.setAttribute('aria-label', label);
  }

  // 4. 칩 갱신 및 설정된 언어 기준 우선 검색 재실행
  updateNameChips(activeLangFilter);
  updateLangChips(activeLangFilter);
  executeSearch(currentSearchQuery);
}

function bindEvents() {
  const input = rootEl.querySelector('.phonetic-search-input');
  const clearBtn = rootEl.querySelector('.phonetic-input-clear');
  const closeBtn = rootEl.querySelector('.phonetic-close-btn');

  // 검색창 입력 이벤트 (debounce 150ms)
  let timer = null;
  input.addEventListener('input', () => {
    const val = input.value.trim();
    clearBtn.hidden = !val;
    clearTimeout(timer);
    timer = setTimeout(() => {
      executeSearch(val || currentSearchQuery);
    }, 150);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.hidden = true;
    input.focus();
    executeSearch(currentSearchQuery);
  });

  closeBtn.addEventListener('click', () => hide());

  // 칩 클릭 위임
  rootEl.addEventListener('click', (e) => {
    // 1. 이름 추천 칩
    const nameChip = e.target.closest('.phonetic-name-chips .phonetic-chip');
    if (nameChip) {
      const targetName = nameChip.getAttribute('data-name');
      input.value = targetName;
      clearBtn.hidden = false;
      executeSearch(targetName);
      return;
    }

    // 2. 언어 필터 칩
    const langChip = e.target.closest('.phonetic-lang-chips .phonetic-chip');
    if (langChip) {
      const selectedLang = langChip.getAttribute('data-lang');
      activeLangFilter = selectedLang;
      updateLangChips(selectedLang);
      updateNameChips(selectedLang);
      if (selectedLang !== 'all' && LANG_REPRESENTATIVE_NAMES[selectedLang]) {
        currentSearchQuery = LANG_REPRESENTATIVE_NAMES[selectedLang][0].name;
        input.value = currentSearchQuery;
        clearBtn.hidden = false;
      }
      applyLangFilter();
      return;
    }

    // 3. 카드 '이 이름 카드 보기' 버튼
    const viewBtn = e.target.closest('.phonetic-view-card-btn');
    if (viewBtn) {
      const given = viewBtn.getAttribute('data-given');
      if (given) {
        emit('name:show', { surname: '', given });
        hide();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // 다국어 언어 변경 실시간 연동 (언어 설정 시 해당 언어 기준으로 자동 전환 및 검색)
  on('lang:change', (newLang) => {
    handleLanguageSwitch(newLang);
  });

  // 상단 search.js 에서 외국어 입력 시 연동 (on 'search:chosung')
  on('search:chosung', ({ query } = {}) => {
    const raw = (query || '').trim();
    if (!raw) return;

    // 외국 문자(라틴, 키릴, 일본어 가나, 한자 등)가 포함된 경우 phonetic UI 자동 활성화
    const hasForeignChars = /[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF]/.test(raw);
    if (hasForeignChars) {
      const chosungEl = document.getElementById('chosung-root');
      if (chosungEl) chosungEl.hidden = true;

      show();
      input.value = raw;
      clearBtn.hidden = false;
      executeSearch(raw);
    }
  });

  // 명시적 이벤트 수신
  on('phonetic:open', (payload = {}) => {
    show();
    const query = payload.query || currentSearchQuery || 'Sophia';
    input.value = query;
    clearBtn.hidden = !query;
    executeSearch(query);
  });

  on('phonetic:search', ({ query } = {}) => {
    if (!query) return;
    show();
    input.value = query;
    clearBtn.hidden = false;
    executeSearch(query);
  });

  on('name:show', () => {
    hide();
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (rootEl.hidden) return;
    if (rootEl.contains(e.target)) return;
    if (launcherBtn && launcherBtn.contains(e.target)) return;
    const searchRoot = document.getElementById('search-root');
    if (searchRoot && searchRoot.contains(e.target)) return;
    hide();
  });

  // ESC 키 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !rootEl.hidden) {
      hide();
    }
  });
}

function show() {
  if (rootEl) {
    rootEl.hidden = false;
    const chosungEl = document.getElementById('chosung-root');
    if (chosungEl) chosungEl.hidden = true;
  }
}

function hide() {
  if (rootEl) rootEl.hidden = true;
}

let lastSearchOutput = null;

function executeSearch(query) {
  currentSearchQuery = query;
  const streamEl = rootEl.querySelector('.phonetic-stream');
  if (!streamEl) return;

  if (query && query.trim().length >= 2) {
    logSearch(query.trim(), activeLangFilter);
  }

  const matchData = findPhoneticMatches(query, currentCtx, { 
    limit: 5,
    preferredLang: activeLangFilter
  });
  lastSearchOutput = matchData;

  renderResults(matchData);
}

function applyLangFilter() {
  if (!lastSearchOutput) return;
  if (activeLangFilter === 'all') {
    executeSearch(currentSearchQuery);
    return;
  }

  // 언어 필터가 적용된 경우 해당 언어의 큐레이션 이름 목록 우선 추천
  const filteredCurated = CURATED_NAMES.filter(item => item.lang === activeLangFilter);
  if (filteredCurated.length > 0) {
    const firstHit = filteredCurated.find(c => c.name.toLowerCase() === currentSearchQuery.toLowerCase()) || filteredCurated[0];
    const results = firstHit.matches.map((m, idx) => ({
      hangul: m.hangul,
      roman: m.roman,
      matchRate: 98 - (idx * 2),
      reason: m.reason,
      meaning: m.meaning,
      isCurated: true,
      ipa: firstHit.ipa,
      foreignName: firstHit.name,
      lang: firstHit.lang
    }));

    renderResults({
      query: firstHit.name,
      normalized: firstHit.name.toLowerCase(),
      ipa: firstHit.ipa,
      isCurated: true,
      lang: firstHit.lang,
      results
    });
  } else {
    executeSearch(currentSearchQuery);
  }
}

function renderResults(matchData) {
  const streamEl = rootEl.querySelector('.phonetic-stream');
  if (!streamEl) return;

  const { query, isCurated, ipa, results } = matchData;

  if (!results || results.length === 0) {
    streamEl.innerHTML = `
      <div class="phonetic-empty-state">
        <div class="phonetic-empty-icon" aria-hidden="true">🌱</div>
        <div class="phonetic-empty-title">'${escapeHtml(query)}'와 어울리는 소리를 찾는 중</div>
        <p class="phonetic-empty-desc">
          다른 철자로 입력하거나 위의 인기 추천 이름을 탭해보세요.
        </p>
      </div>
    `;
    return;
  }

  streamEl.innerHTML = results.map(item => `
    <article class="phonetic-card">
      <div class="phonetic-card-meta">
        <div class="phonetic-foreign-badge">
          <span>🌍 ${escapeHtml(item.foreignName || query)}</span>
          <span class="phonetic-ipa-tag">${escapeHtml(item.ipa || ipa || '')}</span>
        </div>
        <span class="phonetic-rate-badge">
          ${item.isCurated ? '🌟 큐레이션 매칭' : '✨ 발음 매칭률'} ${item.matchRate}%
        </span>
      </div>

      <div class="phonetic-hangul-row">
        <div class="phonetic-hangul-main">
          <span class="phonetic-hangul-name">${escapeHtml(item.hangul)}</span>
          <span class="phonetic-roman-sub">${escapeHtml(item.roman)}</span>
        </div>
      </div>

      <div class="phonetic-bridge-box">
        <span class="phonetic-bridge-icon" aria-hidden="true">💫</span>
        <span class="phonetic-bridge-text">${escapeHtml(item.reason)}</span>
      </div>

      <div class="phonetic-meaning-box">
        <span class="phonetic-meaning-title">이름에 담긴 시적 의미 (Poetic Meaning)</span>
        <p class="phonetic-meaning-desc">${escapeHtml(item.meaning)}</p>
      </div>

      <div class="phonetic-action-row">
        <button type="button" class="phonetic-view-card-btn" data-given="${escapeHtml(item.hangul)}">
          <span>이 이름 카드 보기</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  `).join('');
}

