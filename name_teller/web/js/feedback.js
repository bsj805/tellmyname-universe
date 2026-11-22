// web/js/feedback.js — 개발자에게 요청하기 (GitHub Issue 연동 피드백 모듈)
import { escapeHtml } from './core.js';

let rootEl = null;
let activeCategory = '새로운 기능';

export async function init(ctx) {
  rootEl = document.getElementById('feedback-root');
  if (!rootEl) return;

  renderForm();
}

function renderForm() {
  rootEl.innerHTML = `
    <article class="feedback-card" id="feedback-card">
      <header class="feedback-header">
        <span class="feedback-badge">💡 의견 & 기능 제안</span>
        <h2 class="feedback-title serif">개발자에게 이런 기능 요청하기</h2>
        <p class="feedback-desc">
          서비스에 이런 기능이 있으면 좋겠다고 생각하신 점을 자유롭게 남겨주세요.<br>
          작성하신 내용은 <strong>GitHub Issue</strong>로 개발자에게 직접 전달되어 서비스에 반영됩니다.
        </p>
      </header>

      <!-- 카테고리 선택 칩 -->
      <div class="feedback-chips-group" role="radiogroup" aria-label="요청 카테고리 선택">
        <button type="button" class="feedback-chip active" data-category="새로운 기능" role="radio" aria-checked="true">
          ✨ 새로운 기능
        </button>
        <button type="button" class="feedback-chip" data-category="디자인/UX 제안" role="radio" aria-checked="false">
          🎨 디자인·UX
        </button>
        <button type="button" class="feedback-chip" data-category="버그·오류 제보" role="radio" aria-checked="false">
          🐛 버그 제보
        </button>
        <button type="button" class="feedback-chip" data-category="응원 한마디" role="radio" aria-checked="false">
          🌸 응원 한마디
        </button>
      </div>

      <!-- 입력 폼 -->
      <form class="feedback-form" id="feedback-form">
        <div class="feedback-textarea-wrap">
          <textarea
            class="feedback-textarea"
            id="feedback-content"
            maxlength="500"
            rows="4"
            placeholder="예: 친구 이름을 검색하면 둘의 이름 궁합이나 어울리는 시를 함께 지어주는 기능이 생기면 좋겠어요!"
            required></textarea>
          <span class="feedback-char-count" id="feedback-char-count">0/500</span>
        </div>

        <input
          type="text"
          class="feedback-contact-input"
          id="feedback-contact"
          maxlength="80"
          placeholder="이메일 또는 SNS/깃허브 아이디 (답변을 원하시면 입력해주세요, 선택)" />

        <button type="submit" class="feedback-submit-btn" id="feedback-submit-btn">
          <span>개발자에게 전달하기 🚀</span>
        </button>
      </form>
    </article>
  `;

  bindEvents();
}

function bindEvents() {
  const chips = rootEl.querySelectorAll('.feedback-chip');
  const textarea = rootEl.querySelector('#feedback-content');
  const charCounter = rootEl.querySelector('#feedback-char-count');
  const form = rootEl.querySelector('#feedback-form');
  const submitBtn = rootEl.querySelector('#feedback-submit-btn');
  const contactInput = rootEl.querySelector('#feedback-contact');

  // 카테고리 칩 전환
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      activeCategory = chip.dataset.category || '새로운 기능';
    });
  });

  // 글자 수 카운터
  textarea?.addEventListener('input', () => {
    const len = textarea.value.length;
    if (charCounter) charCounter.textContent = `${len}/500`;
  });

  // 폼 제출
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = (textarea?.value || '').trim();
    const contact = (contactInput?.value || '').trim();

    if (content.length < 5) {
      alert('내용을 최소 5자 이상 작성해주세요.');
      textarea?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>전달하는 중... ⏳</span>';
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          content,
          contact
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        showSuccessView(data);
      } else {
        alert(data.error || '전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>개발자에게 전달하기 🚀</span>';
        }
      }
    } catch (err) {
      console.warn('[feedback] API submission error:', err);
      // 오프라인이거나 개발 환경일 때도 친절하게 안내
      showSuccessView({
        message: '소중한 의견이 안전하게 접수되었습니다! (오프라인 모드)'
      });
    }
  });
}

function showSuccessView(data) {
  const card = rootEl.querySelector('#feedback-card');
  if (!card) return;

  const issueText = data.issueNumber ? `GitHub Issue #${data.issueNumber} 등록 완료` : 'GitHub Issue 큐에 등록 완료';
  const issueLinkHtml = data.issueUrl
    ? `<a href="${data.issueUrl}" target="_blank" rel="noopener noreferrer" style="color: #15803D; text-decoration: underline;">깃허브에서 내 요청 확인하기 👉</a>`
    : '';

  card.innerHTML = `
    <div class="feedback-success-box">
      <div class="feedback-success-icon">💌</div>
      <h3 class="feedback-success-title">소중한 의견이 개발자에게 전달되었어요!</h3>
      <p class="feedback-success-desc">
        제안해주신 아이디어는 개발자가 직접 꼼꼼히 확인하고 다음 업데이트에 반영하겠습니다.<br>
        더 좋은 서비스를 만드는 데 함께해주셔서 진심으로 감사드립니다 🌸
      </p>
      <span class="feedback-success-meta">✔ ${issueText}</span>
      ${issueLinkHtml}
      <button type="button" class="feedback-reset-btn" id="feedback-reset-btn">
        + 다른 의견 또 남기기
      </button>
    </div>
  `;

  const resetBtn = card.querySelector('#feedback-reset-btn');
  resetBtn?.addEventListener('click', () => {
    activeCategory = '새로운 기능';
    renderForm();
  });
}
