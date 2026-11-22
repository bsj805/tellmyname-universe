// web/js/chosung.js — 초성 및 실시간 이름 검색 드롭다운 패널
import { on, emit, toChosung, isChosungOnly, escapeHtml } from './core.js';

const BATCH_SIZE = 60;

// 아바타 원형 배경용 그라디언트 팔레트
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #F59E0B, #EA580C)',
  'linear-gradient(135deg, #EC4899, #BE185D)',
  'linear-gradient(135deg, #8B5CF6, #6366F1)',
  'linear-gradient(135deg, #10B981, #047857)',
  'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  'linear-gradient(135deg, #F97316, #C2410C)',
  'linear-gradient(135deg, #14B8A6, #0F766E)',
  'linear-gradient(135deg, #6366F1, #4338CA)',
  'linear-gradient(135deg, #A855F7, #7E22CE)',
  'linear-gradient(135deg, #06B6D4, #0E7490)'
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

function formatSubtitle(hanja, meaning) {
  const h = (hanja || '').trim();
  const m = (meaning || '').trim();
  let text = '';
  if (h && m) {
    text = `${h} · ${m}`;
  } else {
    text = h || m;
  }

  if (text.length > 18) {
    return text.slice(0, 18) + '…';
  }
  return text;
}

// 사전 색인 (15k 이름 대상 한 번만 생성)
let chosungIndex = [];
let rootEl = null;
let observer = null;
let sentinelEl = null;
let currentMatches = [];
let renderedCount = 0;
let currentQuery = '';

export async function init(ctx) {
  rootEl = document.getElementById('chosung-root');
  if (!rootEl) return;

  // 1. 초성 인덱스 사전 계산 (ctx.byName 키 기준 중복 제거)
  chosungIndex = [];
  if (ctx.byName && ctx.byName.size > 0) {
    for (const [name, entries] of ctx.byName.entries()) {
      const first = entries[0] || {};
      chosungIndex.push({
        name,
        cho: toChosung(name),
        hanja: first.hanja || '',
        meaning: first.meaning || ''
      });
    }
  } else if (Array.isArray(ctx.names)) {
    const seen = new Set();
    for (const entry of ctx.names) {
      if (!seen.has(entry.name)) {
        seen.add(entry.name);
        chosungIndex.push({
          name: entry.name,
          cho: entry.cho || toChosung(entry.name),
          hanja: entry.hanja || '',
          meaning: entry.meaning || ''
        });
      }
    }
  }

  // 2. 이벤트 버스 구독
  on('search:chosung', ({ query } = {}) => {
    const raw = query ?? '';
    const clean = raw.trim();
    if (!clean) {
      hide();
      return;
    }
    handleQuery(clean, raw);
  });

  on('name:show', () => {
    hide();
  });

  // 3. 행 선택 및 닫기 버튼 이벤트 위임 (클릭 & 키보드)
  rootEl.addEventListener('click', (e) => {
    if (e.target.closest('.chosung-close-btn')) {
      hide();
      return;
    }

    const row = e.target.closest('.chosung-row');
    if (row) {
      selectName(row.getAttribute('data-name'));
    }
  });

  rootEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const row = e.target.closest('.chosung-row');
      if (row) {
        e.preventDefault();
        selectName(row.getAttribute('data-name'));
      }
    }
  });

  // 4. 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (rootEl.hidden) return;
    if (rootEl.contains(e.target)) return;
    const searchRoot = document.getElementById('search-root');
    if (searchRoot && searchRoot.contains(e.target)) return;
    hide();
  });

  // 5. ESC 키 입력 시 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !rootEl.hidden) {
      hide();
    }
  });
}

function selectName(name) {
  if (!name) return;
  emit('name:show', { surname: '', given: name });
  hide();
  window.dispatchEvent(new CustomEvent('search:clear'));
}

function show() {
  if (rootEl) rootEl.hidden = false;
}

function hide() {
  if (!rootEl || rootEl.hidden) return;
  rootEl.hidden = true;
  cleanupObserver();
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (sentinelEl) {
    sentinelEl.remove();
    sentinelEl = null;
  }
}

function findMatches(cleanQuery) {
  const norm = cleanQuery.replace(/\s+/g, '');
  if (!norm) return [];

  // 1) 초성으로만 구성된 경우 (예: "ㅅㅇ")
  if (isChosungOnly(norm)) {
    const matches = chosungIndex.filter(item => item.cho.startsWith(norm));
    matches.sort((a, b) => {
      const aExact = a.cho === norm ? 0 : 1;
      const bExact = b.cho === norm ? 0 : 1;
      return aExact - bExact;
    });
    return matches;
  }

  // 2) 완성형 음절이 포함된 경우 (예: "서", "서ㅇ", "서윤")
  const qCho = toChosung(norm);
  const completedPart = norm.match(/^[가-힣]+/)?.[0] || '';

  const matches = chosungIndex.filter(item => {
    return item.cho.startsWith(qCho) && item.name.startsWith(completedPart);
  });

  matches.sort((a, b) => {
    // 이름 전체 일치 우선
    const aNameExact = a.name === norm ? 0 : 1;
    const bNameExact = b.name === norm ? 0 : 1;
    if (aNameExact !== bNameExact) return aNameExact - bNameExact;

    // 초성 일치 우선
    const aChoExact = a.cho === qCho ? 0 : 1;
    const bChoExact = b.cho === qCho ? 0 : 1;
    if (aChoExact !== bChoExact) return aChoExact - bChoExact;

    return 0;
  });

  return matches;
}

function renderRow(item) {
  const firstSyl = item.name[0] || '';
  const gradient = getAvatarGradient(item.name);
  const subtitle = formatSubtitle(item.hanja, item.meaning);

  return `
    <li class="chosung-row" data-name="${escapeHtml(item.name)}" role="button" tabindex="0">
      <div class="chosung-avatar" style="background: ${gradient};" aria-hidden="true">${escapeHtml(firstSyl)}</div>
      <div class="chosung-info">
        <span class="chosung-name">${escapeHtml(item.name)}</span>
        <span class="chosung-sub">${escapeHtml(subtitle)}</span>
      </div>
      <button type="button" class="chosung-view-btn" tabindex="-1">보기</button>
    </li>
  `.trim();
}

function handleQuery(cleanQuery, rawQuery) {
  const matches = findMatches(cleanQuery);
  currentQuery = rawQuery.trim();
  currentMatches = matches;
  renderedCount = 0;

  cleanupObserver();
  show();

  if (matches.length === 0) {
    rootEl.innerHTML = `
      <div class="chosung-header">
        <span class="chosung-count-text">
          <strong class="chosung-count-query">${escapeHtml(currentQuery)}</strong> 이름 0개
        </span>
        <button type="button" class="chosung-close-btn" aria-label="닫기">✕</button>
      </div>
      <div class="chosung-empty">
        <div class="chosung-empty-icon" aria-hidden="true">🌱</div>
        <p class="chosung-empty-text">일치하는 이름이 없어요 — 그대로 검색하면 뜻을 만들어 드려요</p>
      </div>
    `;
    rootEl.scrollTop = 0;
    return;
  }

  rootEl.innerHTML = `
    <div class="chosung-header">
      <span class="chosung-count-text">
        <strong class="chosung-count-query">${escapeHtml(currentQuery)}</strong> 이름 ${matches.length.toLocaleString('ko-KR')}개
      </span>
      <button type="button" class="chosung-close-btn" aria-label="닫기">✕</button>
    </div>
    <ul class="chosung-list" role="list"></ul>
  `;

  const listEl = rootEl.querySelector('.chosung-list');
  const firstBatch = matches.slice(0, BATCH_SIZE);
  renderedCount = firstBatch.length;
  listEl.innerHTML = firstBatch.map(renderRow).join('');

  if (renderedCount < matches.length && typeof IntersectionObserver !== 'undefined') {
    sentinelEl = document.createElement('li');
    sentinelEl.className = 'chosung-sentinel';
    sentinelEl.setAttribute('aria-hidden', 'true');
    listEl.appendChild(sentinelEl);

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          appendNextBatch(listEl);
        }
      }
    }, {
      root: listEl,
      rootMargin: '160px'
    });

    observer.observe(sentinelEl);
  }
}

function appendNextBatch(listEl) {
  if (renderedCount >= currentMatches.length) {
    cleanupObserver();
    return;
  }

  const nextBatch = currentMatches.slice(renderedCount, renderedCount + BATCH_SIZE);
  renderedCount += nextBatch.length;

  const temp = document.createElement('div');
  temp.innerHTML = nextBatch.map(renderRow).join('');

  const fragment = document.createDocumentFragment();
  while (temp.firstChild) {
    fragment.appendChild(temp.firstChild);
  }

  if (sentinelEl && sentinelEl.parentNode === listEl) {
    listEl.insertBefore(fragment, sentinelEl);
  } else {
    listEl.appendChild(fragment);
  }

  if (renderedCount >= currentMatches.length) {
    cleanupObserver();
  }
}
