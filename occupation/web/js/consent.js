// consent.js — Google Consent Mode v2 + Funding Choices / UMP CMP & Non-Personalized Ads Control
(function () {
  const CONSENT_KEY = 'tellmyname_consent_v2';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  const saved = (function () {
    try { return localStorage.getItem(CONSENT_KEY) || localStorage.getItem('myhome_consent_v1') || 'all'; }
    catch (_) { return 'all'; }
  })();

  function applyConsentState(mode, isUpdate) {
    const granted = mode !== 'essential';
    const state = {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      wait_for_update: 500
    };
    gtag('consent', isUpdate ? 'update' : 'default', state);
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = granted ? 0 : 1;
  }

  // Apply default Consent Mode v2 state immediately before ad requests
  applyConsentState(saved, false);

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

    const currentConsent = localStorage.getItem(CONSENT_KEY) || localStorage.getItem('myhome_consent_v1') || 'all';
    const isEn = (document.documentElement.lang || '').toLowerCase().startsWith('en');

    const modal = document.createElement('div');
    modal.id = 'consent-modal-root';
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;max-width:480px;width:100%;padding:24px;box-shadow:0 20px 40px rgba(0,0,0,0.5);font-family:sans-serif;color:#f8fafc;position:relative;">
          <h3 style="font-size:18px;font-weight:800;margin:0 0 10px 0;color:#38bdf8;">${isEn ? '🍪 Privacy & Cookie Settings' : '🍪 개인정보 및 쿠키 설정 (Privacy Settings)'}</h3>
          <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:0 0 16px 0;">
            ${isEn
              ? 'TellMyName uses cookies for Google AdSense ads and analytics. Names you enter are never stored on our servers. You can choose personalized or non-personalized ads below.'
              : '본 서비스는 Google AdSense 광고 게재와 사이트 통계를 위해 쿠키를 사용할 수 있습니다. 입력한 이름은 서버에 저장되지 않으며, 아래에서 맞춤형/비맞춤형 광고를 선택할 수 있습니다.'}
          </p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;color:#e2e8f0;">
              <input type="radio" name="consent-choice" value="all" ${currentConsent !== 'essential' ? 'checked' : ''} />
              ${isEn ? 'Allow personalized ads & cookies' : '모든 쿠키 및 맞춤형 광고 허용 (권장)'}
            </label>
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;cursor:pointer;color:#e2e8f0;">
              <input type="radio" name="consent-choice" value="essential" ${currentConsent === 'essential' ? 'checked' : ''} />
              ${isEn ? 'Essential only (Non-personalized ads)' : '필수 기능만 허용 (비맞춤형 광고 게재)'}
            </label>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button id="consent-save-btn" style="background:#38bdf8;color:#042f2e;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;">${isEn ? 'Save' : '저장하기'}</button>
            <button id="consent-close-btn" style="background:#334155;color:#cbd5e1;border:none;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;">${isEn ? 'Close' : '닫기'}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('consent-save-btn').onclick = () => {
      const selected = modal.querySelector('input[name="consent-choice"]:checked')?.value || 'all';
      try {
        localStorage.setItem(CONSENT_KEY, selected);
        localStorage.setItem('myhome_consent_v1', selected);
      } catch (_) {}
      applyConsentState(selected, true);
      modal.remove();
    };

    document.getElementById('consent-close-btn').onclick = () => modal.remove();
  }

  function bindConsentButtons() {
    document.querySelectorAll('[data-consent-settings]').forEach(btn => {
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
