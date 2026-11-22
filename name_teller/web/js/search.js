// web/js/search.js — 상단 미니멀 검색 헤더, 언어 선택기 및 랜덤 추천 모듈
import { on, emit, isHangul, isChosungOnly, parseFullName, randomEntry } from './core.js';
import { SUPPORTED_LANGUAGES, getLang, setLang, t, applyTranslations } from './i18n.js';

/**
 * Cloudflare Pages Function (/api/search)으로 검색된 이름(한글 또는 외국어) 전송
 * Fire-and-forget 방식 (try/catch)
 */
export function logSearch(queryName, langCode = '') {
  // GitHub 이슈 큐 전송 비활성화 (순수 클라이언트 정적 서빙)
  return;
}

export async function init(ctx) {
  const root = document.getElementById('search-root');
  if (!root) return;

  const initialLang = getLang();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === initialLang) || SUPPORTED_LANGUAGES[0];

  const langListHtml = SUPPORTED_LANGUAGES.map(l => `
    <button type="button" class="lang-item ${l.code === initialLang ? 'active' : ''}" data-lang="${l.code}">
      <span class="lang-item-flag">${l.flag}</span>
      <span class="lang-item-native">${l.native}</span>
      <span class="lang-item-name">${l.label}</span>
    </button>
  `).join('');

  root.innerHTML = `
    <div class="search-inner">
      <a href="/" class="search-logo" aria-label="Name Teller">Name Teller</a>
      <form class="search-form" role="search" action="javascript:void(0);">
        <input
          type="text"
          class="search-input"
          maxlength="25"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          inputmode="search"
          enterkeyhint="search"
          placeholder="${t('search.placeholder')}"
          aria-label="${t('search.placeholder')}"
        />
        <button type="submit" class="search-submit-btn" aria-label="${t('search.btn_aria')}">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.5" y2="16.5"></line>
          </svg>
        </button>
      </form>

      <!-- 다국어 선택기 (12개국 언어) -->
      <div class="lang-picker-wrapper">
        <button type="button" class="lang-picker-btn" aria-label="언어 선택" aria-expanded="false">
          <span class="lang-flag">${currentLangObj.flag}</span>
          <span class="lang-code">${currentLangObj.code.toUpperCase()}</span>
        </button>
        <div class="lang-dropdown" role="menu">
          ${langListHtml}
        </div>
      </div>

      <!-- 실시간 랭킹 차트 아이콘 버튼 -->
      <button type="button" class="search-ranking-btn" aria-label="이름 및 편지 랭킹" title="이름 및 편지 랭킹">
        <svg class="ranking-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </button>

      <!-- 이름점 (이름 궁합) 전용 페이지 바로가기 버튼 -->
      <a href="/match/" class="search-match-btn" id="search-match-btn" aria-label="${t('match.header_badge')}" title="${t('match.header_badge')}">
        <span class="search-match-heart" aria-hidden="true">💘</span>
        <span class="search-match-text">${t('match.header_badge')}</span>
      </a>

      <button type="button" class="search-random-btn" aria-label="${t('search.random_title')}" title="${t('search.random_title')}">
        <span class="search-random-dice" aria-hidden="true">🎲</span>
      </button>
    </div>
  `;

  const form = root.querySelector('.search-form');
  const input = root.querySelector('.search-input');
  const randomBtn = root.querySelector('.search-random-btn');
  const rankingBtn = root.querySelector('.search-ranking-btn');
  const matchBtn = root.querySelector('#search-match-btn');
  const logo = root.querySelector('.search-logo');
  const langWrapper = root.querySelector('.lang-picker-wrapper');
  const langBtn = root.querySelector('.lang-picker-btn');
  const langDropdown = root.querySelector('.lang-dropdown');
  const langFlagEl = root.querySelector('.lang-flag');
  const langCodeEl = root.querySelector('.lang-code');

  // 언어 선택 드롭다운 토글
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!langWrapper.contains(e.target)) {
      langDropdown.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });

  langDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.lang-item');
    if (!item) return;
    const code = item.dataset.lang;
    if (code) {
      setLang(code);
      langDropdown.querySelectorAll('.lang-item').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === code);
      });
      const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
      if (selected) {
        langFlagEl.textContent = selected.flag;
        langCodeEl.textContent = selected.code.toUpperCase();
      }
      langDropdown.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
      input.placeholder = t('search.placeholder');
      randomBtn.title = t('search.random_title');
      randomBtn.setAttribute('aria-label', t('search.random_title'));
      const matchTextEl = root.querySelector('.search-match-text');
      if (matchTextEl) matchTextEl.textContent = t('match.header_badge');
      if (matchBtn) {
        matchBtn.title = t('match.header_badge');
        matchBtn.setAttribute('aria-label', t('match.header_badge'));
      }
      applyTranslations();
    }
  });

  on('lang:change', (newCode) => {
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === newCode);
    if (selected) {
      langFlagEl.textContent = selected.flag;
      langCodeEl.textContent = selected.code.toUpperCase();
    }
    input.placeholder = t('search.placeholder');
    randomBtn.title = t('search.random_title');
    applyTranslations();
  });

  let debounceTimer = null;

  function cancelDebounce() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  function handleInputChange() {
    const raw = input.value.trim();
    cancelDebounce();

    if (!raw) {
      emit('search:chosung', { query: '' });
      return;
    }

    // 초성(isChosungOnly) 또는 부분 입력 중인 경우 debounced ~120ms로 chosung 모듈에 전달
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      emit('search:chosung', { query: input.value.trim() });
    }, 120);
  }

  function submitSearch() {
    const val = input.value.trim().replace(/\s+/g, '');
    if (!isHangul(val)) return;

    cancelDebounce();

    const parsed = parseFullName(val, ctx.nameSet, ctx.surnameSet);
    emit('name:show', parsed);
    emit('search:chosung', { query: '' });
    logSearch(parsed.given || val);

    input.value = '';
    input.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function triggerRandom() {
    const entry = randomEntry();
    if (!entry || !entry.name) return;

    cancelDebounce();
    emit('search:chosung', { query: '' });
    emit('name:show', { surname: '', given: entry.name });

    input.value = '';
    input.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const dice = randomBtn.querySelector('.search-random-dice');
    if (dice && typeof dice.animate === 'function') {
      dice.animate(
        [
          { transform: 'rotate(0deg) scale(1)' },
          { transform: 'rotate(180deg) scale(1.2)' },
          { transform: 'rotate(360deg) scale(1)' }
        ],
        { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
      );
    }
  }

  // IME composition 및 input 이벤트 처리
  input.addEventListener('input', handleInputChange);
  input.addEventListener('compositionend', handleInputChange);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      input.value = '';
      cancelDebounce();
      emit('search:chosung', { query: '' });
      input.blur();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitSearch();
  });

  randomBtn.addEventListener('click', () => {
    triggerRandom();
  });

  rankingBtn.addEventListener('click', () => {
    cancelDebounce();
    emit('search:chosung', { query: '' });
    emit('ranking:open');
  });

  matchBtn?.addEventListener('click', () => {
    cancelDebounce();
  });

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    triggerRandom();
  });

  // 'name:show' 수신 시 현재 전체 이름을 placeholder에 반영하고 input은 비움
  on('name:show', (payload) => {
    if (!payload) return;
    const fullName = (payload.surname || '') + (payload.given || '');
    if (fullName) {
      input.placeholder = fullName;
    }
    input.value = '';
    cancelDebounce();
  });
}
