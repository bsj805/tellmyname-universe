// web/js/feed.js — 스크롤 다운 무한 이름 피드 모듈
import { on, emit, explainSyllables, escapeHtml } from './core.js';

let appCtx = null;
let feedListEl = null;
let sentinelEl = null;
let observer = null;
let pool = [];
let currentIndex = 0;
const BATCH_SIZE = 8;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderAdCard() {
  const adCard = document.createElement('article');
  adCard.className = 'feed-item-card feed-ad-card';
  adCard.innerHTML = `
    <aside class="feed-ad-box" aria-label="스폰서 광고">
      <div class="feed-ad-header">
        <span class="feed-ad-label">SPONSORED</span>
        <span class="feed-ad-desc">서비스 운영을 지원하는 스폰서 광고입니다</span>
      </div>
      <div class="feed-ad-body">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-format="fluid"
             data-ad-layout-key="-fb+5w+4e-db+86"
             data-ad-client="ca-pub-8793936135959956"
             data-ad-slot="1000000004"
             data-full-width-responsive="true"></ins>
        <div class="ad-placeholder-content">
          <div class="ad-placeholder-inner">
            <div class="ad-placeholder-icon">✨</div>
            <div class="ad-placeholder-body">
              <span class="ad-placeholder-title">TELLMYNAME</span>
              <span class="ad-placeholder-desc">소중한 사람에게 이름을 선물하세요 · tellmyname.app</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;

  // 구글 애드센스 광고 단위 요청
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
    // AdBlocker 또는 초기 로딩 지연 대응
  }

  return adCard;
}

function renderBatch() {
  if (!feedListEl || currentIndex >= pool.length) {
    if (sentinelEl) sentinelEl.hidden = true;
    return;
  }

  const nextItems = pool.slice(currentIndex, currentIndex + BATCH_SIZE);
  currentIndex += nextItems.length;

  const frag = document.createDocumentFragment();

  for (const item of nextItems) {
    const cardEl = document.createElement('article');
    cardEl.className = 'feed-item-card';
    cardEl.dataset.name = item.name;

    const syllables = explainSyllables(item, appCtx?.hanja || {});
    const sylHtml = syllables
      .filter(s => s.meaning)
      .map(s => `<span class="feed-syl-pill">${escapeHtml(s.hangul)} (${escapeHtml(s.meaning)})</span>`)
      .join('');

    cardEl.innerHTML = `
      <div class="feed-item-top">
        <div class="feed-item-name-group">
          <span class="feed-item-name serif">${escapeHtml(item.name)}</span>
          <span class="feed-item-hanja serif">${item.hanja ? `(${escapeHtml(item.hanja)})` : '<span class="feed-item-tag">순우리말</span>'}</span>
        </div>
        <button type="button" class="feed-item-select-btn" data-name="${escapeHtml(item.name)}" aria-label="${escapeHtml(item.name)} 선택">
          <span>보기 👉</span>
        </button>
      </div>

      <p class="feed-item-meaning serif">“${escapeHtml(item.meaning || '맑고 고운 뜻을 품고 살아가는 아름다운 사람')}”</p>

      ${sylHtml ? `<div class="feed-item-syls">${sylHtml}</div>` : ''}
    `;

    frag.appendChild(cardEl);
  }

  // 이름 8개마다 스폰서 인피드 광고 삽입
  if (nextItems.length > 0) {
    frag.appendChild(renderAdCard());
  }

  feedListEl.appendChild(frag);

  if (currentIndex >= pool.length && sentinelEl) {
    sentinelEl.hidden = true;
  }
}

export async function init(ctx) {
  appCtx = ctx;
  const root = document.getElementById('feed-root');
  if (!root) return;

  root.innerHTML = `
    <div class="feed-container">
      <div class="feed-header">
        <span class="feed-badge">✨ 스크롤 탐색</span>
        <h2 class="feed-title serif">다른 예쁜 이름들 둘러보기</h2>
        <p class="feed-desc">아래로 쭉쭉 내리며 15,487개 이름과 뜻을 만나보세요</p>
      </div>

      <div class="feed-list" id="feed-list"></div>

      <div class="feed-sentinel" id="feed-sentinel">
        <span class="feed-loading-spinner">✨ 더 많은 이름을 불러오는 중...</span>
      </div>
    </div>
  `;

  feedListEl = root.querySelector('#feed-list');
  sentinelEl = root.querySelector('#feed-sentinel');

  // 무작위 셔플 이름 풀 준비
  pool = shuffleArray(ctx.names || []);
  currentIndex = 0;

  // 초기 8개 렌더링
  renderBatch();

  // 무한 스크롤 Observer
  if (typeof IntersectionObserver !== 'undefined' && sentinelEl) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        renderBatch();
      }
    }, { rootMargin: '300px' });

    observer.observe(sentinelEl);
  }

  // 카드 클릭 시 해당 이름으로 이동
  feedListEl.addEventListener('click', (e) => {
    const card = e.target.closest('.feed-item-card');
    if (!card) return;
    const name = card.dataset.name;
    if (!name) return;

    emit('name:show', { surname: '', given: name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 현재 보고 있는 이름이 바뀌면 풀에서 해당 이름을 맨 앞이나 뒤로 조정
  on('name:show', (payload) => {
    // 풀 유지하되 필요시 추가 렌더
  });
}
