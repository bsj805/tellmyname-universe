// web/js/consent.js - Google Funding Choices / UMP CMP Integration & Consent Fallback Banner
(function () {
  const CONSENT_KEY = 'name_teller_consent_v1';

  function openPrivacySettings(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window.googlefc !== 'undefined' && window.googlefc.showRevocationMessage) {
      window.googlefc.showRevocationMessage();
    } else {
      showFallbackConsentModal();
    }
  }

  function showFallbackConsentModal() {
    let existingModal = document.getElementById('consent-modal-root');
    if (existingModal) existingModal.remove();

    const currentConsent = localStorage.getItem(CONSENT_KEY) || 'all';

    const modal = document.createElement('div');
    modal.id = 'consent-modal-root';
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:24px;box-shadow:0 20px 40px rgba(0,0,0,0.2);font-family:sans-serif;color:#1c1917;position:relative;">
          <h3 style="font-size:18px;font-weight:800;margin:0 0 10px 0;">🍪 개인정보 및 쿠키 설정 (Privacy Settings)</h3>
          <p style="font-size:13px;line-height:1.6;color:#57534e;margin:0 0 16px 0;">
            본 서비스는 맞춤형 광고 및 사이트 통계를 위해 쿠키 및 유사 기술을 사용할 수 있습니다. EEA/영국 등 법률상 동의가 필요한 지역의 경우 동의 여부를 선택하실 수 있습니다.
          </p>
          <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;padding:12px;margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;">
              <input type="radio" name="consent-choice" value="all" ${currentConsent === 'all' ? 'checked' : ''} />
              모든 쿠키 및 맞춤형 광고 허용 (권장)
            </label>
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;">
              <input type="radio" name="consent-choice" value="essential" ${currentConsent === 'essential' ? 'checked' : ''} />
              필수 기능만 허용 (비맞춤형 광고 게재)
            </label>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button id="consent-save-btn" style="background:#1c1917;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;">저장하기</button>
            <button id="consent-close-btn" style="background:#f5f5f4;color:#44403c;border:none;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;">닫기</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('consent-save-btn').onclick = () => {
      const selected = modal.querySelector('input[name="consent-choice"]:checked')?.value || 'all';
      localStorage.setItem(CONSENT_KEY, selected);
      modal.remove();
      alert('개인정보 설정이 저장되었습니다.');
    };

    document.getElementById('consent-close-btn').onclick = () => {
      modal.remove();
    };
  }

  function bindConsentButtons() {
    const btns = document.querySelectorAll('[data-consent-settings]');
    btns.forEach(btn => {
      btn.removeEventListener('click', openPrivacySettings);
      btn.addEventListener('click', openPrivacySettings);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindConsentButtons);
  } else {
    bindConsentButtons();
  }

  window.openPrivacySettings = openPrivacySettings;
})();
