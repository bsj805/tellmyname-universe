// web/js/consent.js - Google Funding Choices / UMP CMP Integration & Multilingual Consent Fallback Banner (MyCar)
(function () {
  const CONSENT_KEY = 'mycar_consent_v1';

  const CONSENT_I18N = {
    ko: {
      title: '🍪 개인정보 및 쿠키 설정',
      desc: '본 서비스는 맞춤형 광고 및 사이트 통계를 위해 쿠키 및 유사 기술을 사용할 수 있습니다. EEA/영국 등 법률상 동의가 필요한 지역의 경우 동의 여부를 선택하실 수 있습니다. (입력하신 이름은 서버에 저장되지 않습니다.)',
      optAll: '모든 쿠키 및 맞춤형 광고 허용 (권장)',
      optEssential: '필수 기능만 허용 (비맞춤형 광고 게재)',
      saveBtn: '저장하기',
      closeBtn: '닫기',
      savedAlert: '개인정보 설정이 저장되었습니다.'
    },
    en: {
      title: '🍪 Privacy & Cookie Settings',
      desc: 'This service may use cookies and similar technologies for personalized ads and site analytics. Users in the EEA, UK, and other applicable regions can choose their consent preferences below. (Entered names are never stored on our servers.)',
      optAll: 'Allow all cookies & personalized ads (Recommended)',
      optEssential: 'Essential cookies only (Non-personalized ads)',
      saveBtn: 'Save Preferences',
      closeBtn: 'Close',
      savedAlert: 'Your privacy preferences have been saved.'
    }
  };

  function getActiveLang() {
    const htmlLang = (document.documentElement && document.documentElement.lang) || '';
    let saved = '';
    try {
      saved = localStorage.getItem('mycar_lang') || localStorage.getItem('myjob_lang') || '';
    } catch (_) {}
    const code = (htmlLang || saved || 'ko').toLowerCase().slice(0, 2);
    return code === 'ko' ? 'ko' : 'en';
  }

  function openPrivacySettings(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window.googlefc !== 'undefined' && window.googlefc.showRevocationMessage) {
      window.googlefc.showRevocationMessage();
    } else {
      showFallbackConsentModal();
    }
  }

  function showFallbackConsentModal() {
    const existingModal = document.getElementById('consent-modal-root');
    if (existingModal) existingModal.remove();

    let currentConsent = 'all';
    try {
      currentConsent = localStorage.getItem(CONSENT_KEY) || 'all';
    } catch (_) {}
    const copy = CONSENT_I18N[getActiveLang()] || CONSENT_I18N.en;

    const modal = document.createElement('div');
    modal.id = 'consent-modal-root';
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;max-width:480px;width:100%;padding:24px;box-shadow:0 20px 40px rgba(0,0,0,0.5);font-family:sans-serif;color:#f8fafc;position:relative;">
          <h3 style="font-size:18px;font-weight:800;margin:0 0 10px 0;color:#38bdf8;">${copy.title}</h3>
          <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:0 0 16px 0;">
            ${copy.desc}
          </p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;color:#e2e8f0;">
              <input type="radio" name="consent-choice" value="all" ${currentConsent === 'all' ? 'checked' : ''} />
              ${copy.optAll}
            </label>
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;color:#e2e8f0;">
              <input type="radio" name="consent-choice" value="essential" ${currentConsent === 'essential' ? 'checked' : ''} />
              ${copy.optEssential}
            </label>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button id="consent-save-btn" style="background:#38bdf8;color:#042f2e;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;">${copy.saveBtn}</button>
            <button id="consent-close-btn" style="background:#334155;color:#cbd5e1;border:none;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;">${copy.closeBtn}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('consent-save-btn').onclick = () => {
      const selected = modal.querySelector('input[name="consent-choice"]:checked')?.value || 'all';
      try {
        localStorage.setItem(CONSENT_KEY, selected);
      } catch (_) {}
      modal.remove();
      alert(copy.savedAlert);
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
