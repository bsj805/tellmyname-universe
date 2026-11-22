// web/js/letters.js — WhatsApp풍 익명 편지 채팅 모듈
import { loadLetters, on, emit, escapeHtml } from './core.js';
import { t } from './i18n.js';

// 비속어 및 부적절한 언어 필터 목록
const PROFANITY_WORDS = [
  '시발', '씨발', '씨바', '개새끼', '새끼', '병신', '지랄', '존나', '좆', '닥쳐',
  '꺼져', '죽어', '미친년', '미친놈', '애미', '느금', '엠창', '창녀', '걸레', '등신',
  '호구', '싸가지', '바보새끼', '개자식', '씹', '염병', '호로', '자살', '살인'
];

function containsProfanity(text) {
  if (!text) return false;
  // 공백 및 특수문자 제거 후 검사
  const clean = text.replace(/[\s\.\,\!\?\~\@\#\$\%\^\&\*\-\_\=\+\<\>\/\\\|]/g, '');
  return PROFANITY_WORDS.some(w => clean.includes(w));
}

function containsUrl(text) {
  if (!text) return false;
  const urlPattern = /(https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|kr|co\.kr|io|me|xyz|app|site|dev|gg)\b/i;
  return urlPattern.test(text);
}

function containsPhone(text) {
  if (!text) return false;
  const phonePattern = /(?:01[016789][-\s]?\d{3,4}[-\s]?\d{4})|(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4})/g;
  return phonePattern.test(text);
}

// WhatsApp 그룹 채팅 스타일 발신자 이름 색상 해시
const SENDER_COLORS = [
  '#008069', '#1f7a8c', '#d9534f', '#2563eb', '#7c3aed',
  '#d97706', '#059669', '#db2777', '#0284c7', '#9333ea',
  '#ea580c', '#0d9488', '#4f46e5', '#b91c1c'
];

function getSenderColor(str) {
  if (!str) return '#54656f';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % SENDER_COLORS.length;
  return SENDER_COLORS[idx];
}

// 날짜 구분선 포맷 ("2026-10-24" -> "2026년 10월 24일")
function formatDatePill(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.slice(0, 10).split('-');
  if (parts.length === 3) {
    return `${parts[0]}년 ${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
  }
  return dateStr;
}

// 말풍선 하단 시간 포맷
function formatBubbleTime(createdAt) {
  if (!createdAt) return '';
  if (createdAt.includes('T')) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        const h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const period = h < 12 ? '오전' : '오후';
        const h12 = h % 12 || 12;
        return `${period} ${h12}:${m}`;
      }
    } catch { }
  }
  const parts = createdAt.slice(0, 10).split('-');
  if (parts.length === 3) {
    return `${parseInt(parts[1], 10)}.${parseInt(parts[2], 10)}`;
  }
  return createdAt;
}

// LocalStorage pendingLetters 관리
function getPendingLetters() {
  try {
    const raw = localStorage.getItem('pendingLetters');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function savePendingLetter(msg) {
  const list = getPendingLetters();
  list.push(msg);
  try {
    localStorage.setItem('pendingLetters', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save pendingLetter:', e);
  }
}

// 가시성 규칙:
// - surname이 '' (이름에만 남긴 편지): 해당 이름의 모든 성씨 뷰('서윤', '안서윤', '김서윤')에 노출
// - surname이 '안': 현재 뷰가 정확히 '안' + '서윤' 일 때만 노출
function isLetterVisible(msg, currentSurname, currentGiven) {
  if (!msg || msg.hangulName !== currentGiven) return false;
  const msgSur = msg.surname || '';
  if (msgSur === '') return true;
  return msgSur === (currentSurname || '');
}

// 모듈 내부 상태
let serverLetters = [];
let currentSurname = '';
let currentGiven = '';
let selectedScope = '';
let toastTimer = null;

export async function init(ctx) {
  const root = document.getElementById('letters-root');
  if (!root) return;

  // 1. 서버 편지 로드
  try {
    const res = await loadLetters();
    serverLetters = Array.isArray(res) ? res : (res && Array.isArray(res.messages) ? res.messages : []);
  } catch {
    serverLetters = [];
  }

  // 2. 기본 UI 렌더링
  root.innerHTML = `
    <div class="letters-container">
      <header class="letters-header">
        <div class="letters-header-left">
          <div class="letters-header-avatar">💌</div>
          <div class="letters-header-text">
            <div class="letters-header-title" id="letters-header-title">${t('letters.title')}</div>
          </div>
        </div>
      </header>

      <div class="letters-body" id="letters-body"></div>

      <div class="letters-toast" id="letters-toast" hidden></div>

      <div class="letters-composer">
        <!-- 성씨가 있을 때만 노출되는 대상 범위 토글 -->
        <div class="letters-scope-wrap" id="letters-scope-wrap" hidden>
          <div class="letters-scope-toggle">
            <button type="button" class="letters-scope-pill active" id="letters-scope-pill-full" data-scope="full">
              '풀네임'에게만
            </button>
            <button type="button" class="letters-scope-pill" id="letters-scope-pill-given" data-scope="given">
              성 없이 '이름' 모두에게
            </button>
          </div>
        </div>

        <!-- 받는 사람 / 보내는 사람 힌트 칩 -->
        <div class="letters-hints-bar">
          <div class="letters-hint-item" id="letters-recipient-item">
            <button type="button" class="letters-hint-chip" id="letters-recipient-chip">${t('letters.to_hint_btn')}</button>
            <div class="letters-hint-input-box" id="letters-recipient-box" hidden>
              <span class="letters-hint-label">${t('letters.to_label')}</span>
              <input type="text" class="letters-hint-field" id="letters-recipient-input" maxlength="20" placeholder="${t('letters.to_placeholder')}" />
              <button type="button" class="letters-hint-clear" id="letters-recipient-clear" aria-label="닫기">×</button>
            </div>
          </div>

          <div class="letters-hint-item" id="letters-sender-item">
            <button type="button" class="letters-hint-chip" id="letters-sender-chip">${t('letters.from_hint_btn')}</button>
            <div class="letters-hint-input-box" id="letters-sender-box" hidden>
              <span class="letters-hint-label">${t('letters.from_label')}</span>
              <input type="text" class="letters-hint-field" id="letters-sender-input" maxlength="20" placeholder="${t('letters.from_placeholder')}" />
              <button type="button" class="letters-hint-clear" id="letters-sender-clear" aria-label="닫기">×</button>
            </div>
          </div>
        </div>

        <!-- 텍스트 입력창 + 전송 버튼 -->
        <div class="letters-input-row">
          <div class="letters-input-wrap">
            <textarea
              class="letters-textarea"
              id="letters-content-input"
              rows="1"
              maxlength="300"
              placeholder="${t('letters.input_placeholder')}"
            ></textarea>
            <span class="letters-char-count" id="letters-char-count">0/300</span>
          </div>
          <button type="button" class="letters-send-btn" id="letters-send-btn" aria-label="${t('letters.send_btn')}" title="${t('letters.send_btn')}">
            <svg class="letters-send-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  bindEvents(root);

  // 3. name:show 이벤트 수신
  on('name:show', payload => {
    currentSurname = payload.surname || '';
    currentGiven = payload.given || '';
    selectedScope = currentSurname; // 성씨가 있으면 기본값은 성+이름 전체
    updateScopeToggle();
    renderChat();
    scrollToBottom(false);
  });

  // 언어 변경 시 다국어 UI 즉시 갱신
  on('lang:change', () => {
    const titleEl = document.getElementById('letters-header-title');
    if (titleEl) titleEl.textContent = t('letters.title');
    const recipientChip = document.getElementById('letters-recipient-chip');
    if (recipientChip) recipientChip.textContent = t('letters.to_hint_btn');
    const senderChip = document.getElementById('letters-sender-chip');
    if (senderChip) senderChip.textContent = t('letters.from_hint_btn');
    const textarea = document.getElementById('letters-content-input');
    if (textarea) textarea.placeholder = t('letters.input_placeholder');
    const sendBtn = document.getElementById('letters-send-btn');
    if (sendBtn) {
      sendBtn.title = t('letters.send_btn');
      sendBtn.setAttribute('aria-label', t('letters.send_btn'));
    }
    updateScopeToggle();
    renderChat();
  });

  if (ctx && ctx.current) {
    currentSurname = ctx.current.surname || '';
    currentGiven = ctx.current.given || '';
    selectedScope = currentSurname;
    updateScopeToggle();
    renderChat();
    scrollToBottom(false);
  }
}

function bindEvents(root) {
  // 범위 토글 버튼 이벤트
  const pillFull = root.querySelector('#letters-scope-pill-full');
  const pillGiven = root.querySelector('#letters-scope-pill-given');

  if (pillFull && pillGiven) {
    pillFull.addEventListener('click', () => {
      selectedScope = currentSurname;
      pillFull.classList.add('active');
      pillGiven.classList.remove('active');
    });

    pillGiven.addEventListener('click', () => {
      selectedScope = '';
      pillGiven.classList.add('active');
      pillFull.classList.remove('active');
    });
  }

  // 받는 사람 힌트 토글
  const recChip = root.querySelector('#letters-recipient-chip');
  const recBox = root.querySelector('#letters-recipient-box');
  const recInput = root.querySelector('#letters-recipient-input');
  const recClear = root.querySelector('#letters-recipient-clear');

  if (recChip && recBox && recInput && recClear) {
    recChip.addEventListener('click', () => {
      recChip.hidden = true;
      recBox.hidden = false;
      recInput.focus();
    });

    recClear.addEventListener('click', () => {
      recInput.value = '';
      recBox.hidden = true;
      recChip.hidden = false;
    });
  }

  // 보내는 사람 힌트 토글
  const sndChip = root.querySelector('#letters-sender-chip');
  const sndBox = root.querySelector('#letters-sender-box');
  const sndInput = root.querySelector('#letters-sender-input');
  const sndClear = root.querySelector('#letters-sender-clear');

  if (sndChip && sndBox && sndInput && sndClear) {
    sndChip.addEventListener('click', () => {
      sndChip.hidden = true;
      sndBox.hidden = false;
      sndInput.focus();
    });

    sndClear.addEventListener('click', () => {
      sndInput.value = '';
      sndBox.hidden = true;
      sndChip.hidden = false;
    });
  }

  // 텍스트 영역 입력 및 크기 조절
  const textarea = root.querySelector('#letters-content-input');
  const charCounter = root.querySelector('#letters-char-count');
  const sendBtn = root.querySelector('#letters-send-btn');

  if (textarea) {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 110);
      textarea.style.height = `${newHeight}px`;
      if (charCounter) charCounter.textContent = `${textarea.value.length}/300`;
    });

    textarea.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          // Shift+Enter는 줄바꿈 허용
          return;
        }
        // Enter 단독은 전송
        e.preventDefault();
        handleSend();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }
}

function updateScopeToggle() {
  const wrap = document.getElementById('letters-scope-wrap');
  const pillFull = document.getElementById('letters-scope-pill-full');
  const pillGiven = document.getElementById('letters-scope-pill-given');
  if (!wrap || !pillFull || !pillGiven) return;

  if (currentSurname) {
    wrap.hidden = false;
    pillFull.textContent = t('letters.scope_full', { name: currentSurname + currentGiven });
    pillGiven.textContent = t('letters.scope_given', { name: currentGiven });
    pillFull.classList.add('active');
    pillGiven.classList.remove('active');
    selectedScope = currentSurname;
  } else {
    wrap.hidden = true;
    selectedScope = '';
  }
}

function resetHintChips() {
  const recInput = document.getElementById('letters-recipient-input');
  const recBox = document.getElementById('letters-recipient-box');
  const recChip = document.getElementById('letters-recipient-chip');
  if (recInput) recInput.value = '';
  if (recBox) recBox.hidden = true;
  if (recChip) recChip.hidden = false;

  const sndInput = document.getElementById('letters-sender-input');
  const sndBox = document.getElementById('letters-sender-box');
  const sndChip = document.getElementById('letters-sender-chip');
  if (sndInput) sndInput.value = '';
  if (sndBox) sndBox.hidden = true;
  if (sndChip) sndChip.hidden = false;
}

function showToast(msg, duration = 3200) {
  const toast = document.getElementById('letters-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  // Trigger animation next tick
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.hidden = true;
    }, 260);
  }, duration);
}

function scrollToBottom(smooth = true) {
  const body = document.getElementById('letters-body');
  if (!body) return;
  body.scrollTo({
    top: body.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function renderChat() {
  const headerTitle = document.getElementById('letters-header-title');
  const body = document.getElementById('letters-body');
  if (!body) return;

  const fullName = (currentSurname || '') + (currentGiven || '');

  // 1. 전체 편지 취합 (서버 편지 + 로컬 pendingLetters)
  const pending = getPendingLetters();
  const serverIds = new Set(serverLetters.map(m => m.id));
  const activePending = pending.filter(p => !serverIds.has(p.id));

  const all = [
    ...serverLetters.map(m => ({ ...m, isPending: false })),
    ...activePending.map(m => ({ ...m, isPending: true }))
  ];

  // 2. 가시성 필터링
  const visible = all.filter(m => isLetterVisible(m, currentSurname, currentGiven));

  // 3. 시간순 정렬
  visible.sort((a, b) => {
    const da = (a.createdAt || '').slice(0, 10);
    const db = (b.createdAt || '').slice(0, 10);
    if (da !== db) return da.localeCompare(db);
    if (a.isPending !== b.isPending) return a.isPending ? 1 : -1;
    return String(a.id || '').localeCompare(String(b.id || ''));
  });

  // 4. 헤더 타이틀 갱신: "💌 {fullName}에게 온 익명 편지 · N개"
  if (headerTitle) {
    headerTitle.textContent = t('letters.header_for_name', { name: fullName, count: visible.length });
  }

  // 5. 본문 렌더링
  let html = '';

  // 365일 보관 안내 알약
  html += `
    <div class="letters-notice-pill">
      ${t('letters.notice_pill')}
    </div>
  `;

  if (visible.length === 0) {
    // 빈 상태 말풍선
    html += `
      <div class="letters-empty-container">
        <div class="letters-empty-bubble">
          ${t('letters.empty')} ✍️
        </div>
      </div>
    `;
  } else {
    let lastDate = null;
    for (const msg of visible) {
      const dateKey = (msg.createdAt || '').slice(0, 10);
      if (dateKey && dateKey !== lastDate) {
        html += `<div class="letters-date-pill">${formatDatePill(dateKey)}</div>`;
        lastDate = dateKey;
      }
      html += renderBubble(msg);
    }
  }

  body.innerHTML = html;
}

function renderBubble(msg) {
  const isOut = !!msg.isPending;
  const rowClass = isOut ? 'outgoing' : 'incoming';
  const bubbleClass = isOut ? 'letters-bubble letters-bubble-out' : 'letters-bubble letters-bubble-in';

  let senderHtml = '';
  if (!isOut) {
    const sender = msg.senderHint || t('letters.anonymous_friend');
    const color = getSenderColor(sender);
    senderHtml = `<div class="letters-sender-name" style="color: ${color}">${escapeHtml(sender)}</div>`;
  } else if (msg.senderHint) {
    const color = getSenderColor(msg.senderHint);
    senderHtml = `<div class="letters-sender-name" style="color: ${color}">${escapeHtml(msg.senderHint)} (${t('letters.me')})</div>`;
  }

  let recipientHtml = '';
  if (msg.recipientHint) {
    recipientHtml = `<div class="letters-recipient-tag">→ ${t('letters.to_label')} ${escapeHtml(msg.recipientHint)}</div>`;
  }

  const timeStr = formatBubbleTime(msg.createdAt);
  const pendingLabel = isOut ? `<span class="letters-pending-badge">⏳ ${t('letters.pending_badge')}</span>` : '';

  return `
    <div class="letters-msg-row ${rowClass}">
      <div class="${bubbleClass}">
        ${senderHtml}
        ${recipientHtml}
        <div class="letters-bubble-content">${escapeHtml(msg.content)}</div>
        <div class="letters-bubble-footer">
          ${pendingLabel}
          <span class="letters-bubble-time">${timeStr}</span>
        </div>
      </div>
    </div>
  `;
}

async function handleSend() {
  const textarea = document.getElementById('letters-content-input');
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) {
    showToast('편지 내용을 입력해주세요.');
    return;
  }
  if (content.length > 300) {
    showToast('편지는 최대 300자까지 작성할 수 있어요.');
    return;
  }
  if (containsProfanity(content)) {
    showToast('따뜻하고 다정한 말을 남겨주세요 🌸 (비속어 제한)');
    return;
  }
  if (containsUrl(content)) {
    showToast('안전한 익명 편지를 위해 웹사이트 링크는 포함할 수 없어요.');
    return;
  }
  if (containsPhone(content)) {
    showToast('개인정보 보호를 위해 전화번호나 연락처는 포함할 수 없어요.');
    return;
  }

  const recInput = document.getElementById('letters-recipient-input');
  const sndInput = document.getElementById('letters-sender-input');
  const recipientHint = (recInput ? recInput.value.trim() : '').slice(0, 20);
  const senderHint = (sndInput ? sndInput.value.trim() : '').slice(0, 20);

  // KST 기준 오늘 날짜 (YYYY-MM-DD)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset).toISOString().slice(0, 10);

  const newMsg = {
    id: 'local_' + Date.now(),
    hangulName: currentGiven,
    surname: selectedScope,
    recipientHint,
    senderHint,
    content,
    createdAt: kstDate
  };

  // 1. LocalStorage 저장
  savePendingLetter(newMsg);

  // 2. 입력란 초기화 및 힌트 리셋
  textarea.value = '';
  textarea.style.height = 'auto';
  const charCounter = document.getElementById('letters-char-count');
  if (charCounter) charCounter.textContent = '0/300';
  resetHintChips();

  // 3. 즉시 발신 말풍선으로 렌더링
  renderChat();
  scrollToBottom(true);

  // 4. API 전송 시도
  try {
    const res = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    });
    if (!res.ok) {
      showToast('서버 연결이 불안정하여 기기에 임시 보관되었어요. (내일 반영 예정)');
    } else {
      showToast('편지가 접수되었어요! 💌 매일 자정에 반영됩니다.');
    }
    openSentSuccessModal(newMsg);
  } catch {
    showToast('오프라인 상태입니다. 기기에 안전하게 보관되었어요. (내일 반영 예정)');
    openSentSuccessModal(newMsg);
  }
}

/** 편지 전송 완료 감사 모달 + 스폰서 광고 (방식 A) */
function openSentSuccessModal(msg) {
  const oldModal = document.querySelector('.letters-sent-overlay');
  if (oldModal) oldModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'letters-sent-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t('letters.sent_badge'));

  overlay.innerHTML = `
    <div class="letters-sent-backdrop"></div>
    <div class="letters-sent-dialog">
      <div class="letters-sent-icon-wrap">
        <span class="letters-sent-icon">💌</span>
      </div>
      <div class="letters-sent-badge">${t('letters.sent_badge')}</div>
      <h3 class="letters-sent-title">${t('letters.sent_modal_title')}</h3>
      <p class="letters-sent-desc">
        ${t('letters.sent_modal_desc')}
      </p>

      <!-- 스폰서 광고 영역 (구글 애드센스 정책 준수) -->
      <aside class="letters-sent-ad-box" aria-label="스폰서 광고">
        <div class="letters-sent-ad-header">
          <span class="letters-sent-ad-label">SPONSORED</span>
          <span class="letters-sent-ad-sub">서비스 운영을 지원하는 광고입니다</span>
        </div>
        <div class="letters-sent-ad-body">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-8793936135959956"
               data-ad-slot="1000000003"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <div class="ad-placeholder-content">
            <div class="ad-placeholder-inner">
              <div class="ad-placeholder-icon">✨</div>
              <div class="ad-placeholder-body">
                <span class="ad-placeholder-title">TELLMYNAME</span>
                <span class="ad-placeholder-desc">매일 밤 자정 편지가 전달됩니다</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="letters-sent-actions">
        <button type="button" class="letters-sent-btn-primary" id="letters-sent-close-btn">
          ${t('letters.confirm_btn')}
        </button>
        <button type="button" class="letters-sent-btn-share" id="letters-sent-share-btn">
          <span>${t('letters.share_my_card')}</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#letters-sent-close-btn');
  const shareBtn = overlay.querySelector('#letters-sent-share-btn');
  const backdrop = overlay.querySelector('.letters-sent-backdrop');

  const closeModal = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 200);
    window.removeEventListener('keydown', keyHandler);
  };

  const keyHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', keyHandler);

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  shareBtn?.addEventListener('click', () => {
    closeModal();
    emit('share:open', {
      surname: currentSurname,
      given: currentGiven
    });
  });

  // 애드센스 광고 단위 요청
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
    // AdBlocker 등
  }
}
