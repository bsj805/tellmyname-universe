// web/js/match_page.js — 이름 궁합 독립형 전용 페이지 스크립트
import { bootstrap } from './core.js';
import { setLang, getLang, t, SUPPORTED_LANGUAGES, applyTranslations } from './i18n.js';
import * as match from './match.js';

async function initMatchPage() {
  const ctx = await bootstrap();

  // 2. 다국어 선택기 드롭다운 렌더링
  const langWrapper = document.getElementById('match-page-lang-wrapper');
  if (langWrapper) {
    renderLangPicker(langWrapper);
  }

  // 3. 이름 궁합 컴포넌트 마운트
  const appContainer = document.getElementById('match-page-app');
  if (appContainer) {
    // URL 쿼리 파라미터 (?a=김수현&b=전지현) 파싱
    const params = new URLSearchParams(location.search);
    const queryA = params.get('a');
    const queryB = params.get('b');

    await match.init(ctx);

    if (queryA || typeof queryB === 'string') {
      match.setMatchNames(queryA || undefined, queryB !== null ? queryB : undefined);
    }

    match.renderMatchComponent(appContainer, true);
  }

  // 4. data-i18n 속성 번역 일괄 적용
  applyTranslations();

  // 6. 애드센스 광고 슬롯 초기화
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}
}

function renderLangPicker(wrapper) {
  const current = getLang();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === current) || SUPPORTED_LANGUAGES[0];

  const langListHtml = SUPPORTED_LANGUAGES.map(l => `
    <button type="button" class="lang-item ${l.code === current ? 'active' : ''}" data-lang="${l.code}" role="menuitem">
      <span class="lang-item-flag">${l.flag}</span>
      <span class="lang-item-native">${l.native}</span>
      <span class="lang-item-code">${l.code.toUpperCase()}</span>
    </button>
  `).join('');

  wrapper.innerHTML = `
    <button type="button" class="lang-picker-btn" id="match-lang-btn" aria-label="언어 선택" aria-expanded="false">
      <span class="lang-flag">${currentLangObj.flag}</span>
      <span class="lang-code">${currentLangObj.code.toUpperCase()}</span>
    </button>
    <div class="lang-dropdown" id="match-lang-dropdown" role="menu">
      ${langListHtml}
    </div>
  `;

  const btn = wrapper.querySelector('#match-lang-btn');
  const dropdown = wrapper.querySelector('#match-lang-dropdown');
  const flagEl = wrapper.querySelector('.lang-flag');
  const codeEl = wrapper.querySelector('.lang-code');

  btn?.addEventListener('click', e => {
    e.stopPropagation();
    dropdown?.classList.toggle('open');
    btn.setAttribute('aria-expanded', dropdown?.classList.contains('open') ? 'true' : 'false');
  });

  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) {
      dropdown?.classList.remove('open');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });

  dropdown?.addEventListener('click', e => {
    const item = e.target.closest('.lang-item');
    if (!item) return;
    const code = item.dataset.lang;
    if (code) {
      setLang(code);
      dropdown.querySelectorAll('.lang-item').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === code);
      });
      const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
      if (selected && flagEl && codeEl) {
        flagEl.textContent = selected.flag;
        codeEl.textContent = selected.code.toUpperCase();
      }
      dropdown.classList.remove('open');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });
}

initMatchPage().catch(console.error);
