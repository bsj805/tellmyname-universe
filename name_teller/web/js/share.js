// web/js/share.js — 인스타그램 스토리용 9:16 카드 생성 및 공유 모달
import { on, explainSyllables } from './core.js';

// 3가지 감성 배경 테마 (노을, 새벽, 숲)
const THEMES = {
  sunset: {
    key: 'sunset',
    name: '노을',
    gradientStops: [
      [0.0, '#261326'],
      [0.28, '#5C2240'],
      [0.58, '#A83E3E'],
      [0.82, '#DC6B43'],
      [1.0, '#F5A15D']
    ],
    glowColor: 'rgba(255, 175, 120, 0.22)',
    subTextColor: 'rgba(255, 245, 235, 0.82)',
    cardBg: 'rgba(255, 255, 255, 0.10)',
    cardBorder: 'rgba(255, 230, 210, 0.22)',
    accent: '#FFE29A'
  },
  dawn: {
    key: 'dawn',
    name: '새벽',
    gradientStops: [
      [0.0, '#0D1322'],
      [0.28, '#192842'],
      [0.58, '#2B3F63'],
      [0.82, '#4B5277'],
      [1.0, '#757299']
    ],
    glowColor: 'rgba(165, 200, 255, 0.20)',
    subTextColor: 'rgba(226, 235, 245, 0.82)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(200, 225, 255, 0.22)',
    accent: '#C7E2FE'
  },
  forest: {
    key: 'forest',
    name: '숲',
    gradientStops: [
      [0.0, '#0A1810'],
      [0.28, '#143122'],
      [0.58, '#224B35'],
      [0.82, '#35684B'],
      [1.0, '#538868']
    ],
    glowColor: 'rgba(165, 240, 190, 0.20)',
    subTextColor: 'rgba(225, 245, 230, 0.82)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(180, 230, 200, 0.22)',
    accent: '#B8F3CD'
  }
};

let appCtx = null;
let currentPayload = null;
let currentTheme = 'sunset';
let activeKeyHandler = null;
let toastTimeoutId = null;

/** 모듈 초기화 */
export async function init(ctx) {
  appCtx = ctx;
  on('share:open', payload => {
    openModal(payload);
  });
}

/** 공유 모달 열기 */
async function openModal(payload) {
  currentPayload = payload;
  currentTheme = 'sunset';

  const root = document.getElementById('share-root');
  if (!root) return;

  const surname = payload?.surname || '';
  const given = payload?.given || payload?.entry?.name || '';
  const fullName = surname + given;
  const shareUrl = `${location.origin}/name/${encodeURIComponent(fullName)}`;

  // 모달 렌더링
  root.innerHTML = `
    <div class="share-overlay" role="dialog" aria-modal="true" aria-label="인스타그램 스토리 공유">
      <div class="share-backdrop"></div>
      <div class="share-dialog">
        <header class="share-dialog-header">
          <h2 class="share-dialog-title">스토리 공유</h2>
          <button type="button" class="share-close-btn" aria-label="닫기">×</button>
        </header>

        <!-- 테마 선택 스위처 -->
        <div class="share-theme-selector" role="radiogroup" aria-label="배경 테마 선택">
          <button type="button" class="share-theme-btn active" data-theme="sunset" role="radio" aria-checked="true">
            <span class="share-swatch share-swatch-sunset"></span>
            <span class="share-theme-label">노을</span>
          </button>
          <button type="button" class="share-theme-btn" data-theme="dawn" role="radio" aria-checked="false">
            <span class="share-swatch share-swatch-dawn"></span>
            <span class="share-theme-label">새벽</span>
          </button>
          <button type="button" class="share-theme-btn" data-theme="forest" role="radio" aria-checked="false">
            <span class="share-swatch share-swatch-forest"></span>
            <span class="share-theme-label">숲</span>
          </button>
        </div>

        <!-- 9:16 인스타 스토리 미리보기 캔버스 -->
        <div class="share-preview-wrapper">
          <canvas class="share-preview-canvas" width="1080" height="1920" aria-label="${escapeAttr(fullName)} 이름 스토리 미리보기"></canvas>
        </div>

        <!-- 액션 버튼 영역 (카카오톡, 인스타, 이미지 저장, 링크 복사) -->
        <div class="share-actions-grid">
          <button type="button" class="share-btn share-btn-kakao" id="share-kakao-btn" aria-label="카카오톡으로 공유">
            <svg class="share-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.857 1.867 5.372 4.686 6.744l-.986 3.633a.5.5 0 0 0 .75.534l4.336-2.89c.394.048.8.079 1.214.079 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            카카오톡 공유
          </button>
          <button type="button" class="share-btn share-btn-ig" id="share-ig-btn" aria-label="인스타그램 스토리에 공유">
            <svg class="share-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            인스타 스토리
          </button>
          <button type="button" class="share-btn share-btn-secondary" id="share-download-btn" aria-label="이미지 저장">
            <svg class="share-btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            이미지 저장
          </button>
          <button type="button" class="share-btn share-btn-secondary" id="share-copy-btn" aria-label="링크 복사">
            <svg class="share-btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            링크 복사
          </button>
        </div>

        <!-- 힌트 및 토스트 메시지 -->
        <p class="share-hint" hidden></p>
        <div class="share-toast" hidden></div>
      </div>
    </div>
  `;

  // 스크롤 잠금
  document.body.style.overflow = 'hidden';

  const overlay = root.querySelector('.share-overlay');
  const closeBtn = root.querySelector('.share-close-btn');
  const canvas = root.querySelector('.share-preview-canvas');
  const themeBtns = root.querySelectorAll('.share-theme-btn');
  const shareKakaoBtn = root.querySelector('#share-kakao-btn');
  const shareIgBtn = root.querySelector('#share-ig-btn');
  const downloadBtn = root.querySelector('#share-download-btn');
  const copyBtn = root.querySelector('#share-copy-btn');
  const hintEl = root.querySelector('.share-hint');
  const toastEl = root.querySelector('.share-toast');

  // 닫기 핸들러
  const handleClose = () => closeModal();
  closeBtn?.addEventListener('click', handleClose);
  overlay?.addEventListener('click', e => {
    if (e.target === overlay || e.target.classList.contains('share-backdrop')) {
      handleClose();
    }
  });

  // Escape 키 바인딩
  if (activeKeyHandler) window.removeEventListener('keydown', activeKeyHandler);
  activeKeyHandler = e => {
    if (e.key === 'Escape') handleClose();
  };
  window.addEventListener('keydown', activeKeyHandler);

  // 테마 전환
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeKey = btn.dataset.theme;
      if (!themeKey || themeKey === currentTheme) return;
      currentTheme = themeKey;

      themeBtns.forEach(b => {
        const isActive = b.dataset.theme === currentTheme;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', String(isActive));
      });

      renderCanvas(canvas, currentTheme, currentPayload);
    });
  });

  // 카카오톡 공유 버튼
  shareKakaoBtn?.addEventListener('click', () => {
    shareToKakao(canvas, fullName, shareUrl, toastEl, hintEl);
  });

  // 인스타 스토리에 공유 버튼
  shareIgBtn?.addEventListener('click', () => {
    shareToInstagram(canvas, fullName, shareUrl, hintEl);
  });

  // 이미지 저장 버튼
  downloadBtn?.addEventListener('click', () => {
    downloadImage(canvas, fullName, toastEl);
  });

  // 링크 복사 버튼
  copyBtn?.addEventListener('click', () => {
    copyLink(shareUrl, toastEl);
  });

  // 최초 캔버스 렌더링
  await renderCanvas(canvas, currentTheme, currentPayload);
}

/** 모달 닫기 */
function closeModal() {
  const root = document.getElementById('share-root');
  if (root) root.innerHTML = '';
  document.body.style.overflow = '';
  if (activeKeyHandler) {
    window.removeEventListener('keydown', activeKeyHandler);
    activeKeyHandler = null;
  }
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
}

/** 폰트 로딩 대기 */
let fontsLoaded = false;
async function ensureFonts() {
  if (fontsLoaded) return;
  if (document.fonts?.load) {
    try {
      // 명시적 요구사항: await document.fonts.load('700 80px "Noto Serif KR"')
      await document.fonts.load('700 80px "Noto Serif KR"');
      await document.fonts.load('600 38px "Noto Serif KR"');
      await document.fonts.load('400 34px "Noto Serif KR"');
      await document.fonts.load('500 26px "Noto Sans KR"');
      await document.fonts.load('700 28px "Noto Sans KR"');
      await document.fonts.ready;
    } catch (err) {
      console.warn('Font loading warning:', err);
    }
  }
  fontsLoaded = true;
}

/** 1080x1920 캔버스 렌더링 */
async function renderCanvas(canvas, themeKey, payload) {
  if (!canvas) return;
  await ensureFonts();

  const ctx = canvas.getContext('2d');
  const theme = THEMES[themeKey] || THEMES.sunset;

  const surname = payload?.surname || '';
  const given = payload?.given || payload?.entry?.name || '';
  const fullName = surname + given;

  // 엔트리 보정 (fallback entry)
  let entry = payload?.entry;
  if (!entry || !entry.name) {
    const found = appCtx?.byName?.get(given)?.[0];
    entry = found || {
      name: given,
      hanja: '',
      meaning: `${fullName}의 빛나는 순간과 깊은 뜻을 담은 이름`
    };
  }
  if (!entry.meaning) {
    entry = {
      ...entry,
      meaning: `${fullName}의 빛나는 순간과 깊은 뜻을 담은 이름`
    };
  }

  // 1. 캔버스 초기화
  ctx.clearRect(0, 0, 1080, 1920);

  // 2. 배경 그라디언트
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  theme.gradientStops.forEach(([stop, color]) => bgGrad.addColorStop(stop, color));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // 3. 은은한 앰비언트 원형 발광 효과
  const glowGrad = ctx.createRadialGradient(540, 720, 100, 540, 720, 800);
  glowGrad.addColorStop(0, theme.glowColor);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // 4. 안전 영역(Top 250px / Bottom 300px) 내부 장식 프레임
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 60, 110, 960, 1700, 36);
  ctx.stroke();

  // 모서리 코너 액센트 라인
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 2.5;
  drawCornerAccents(ctx, 60, 110, 960, 1700, 28);
  ctx.restore();

  // 5. 상단 세련된 영문 브랜딩 워드마크 "TELLMYNAME"
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = '700 24px "Noto Sans KR", system-ui, sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '8px';
  ctx.fillText('TELLMYNAME', 540, 310);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
  ctx.font = '500 14px "Noto Sans KR", system-ui, sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText('TELLMYNAME.APP', 540, 342);

  // 워드마크 하단 미니 디바이더
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(480, 375);
  ctx.lineTo(600, 375);
  ctx.stroke();
  ctx.restore();

  // 6. Noto Serif KR 큰 이름 (성 + 이름)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const nameLen = fullName.length;
  let nameSize = 88;
  if (nameLen >= 5) nameSize = 64;
  else if (nameLen === 4) nameSize = 76;
  ctx.font = `700 ${nameSize}px "Noto Serif KR", serif`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.fillText(fullName, 540, 480);
  ctx.restore();

  // 7. 이름 아래 한자 (Hanja under it)
  const surObj = surname ? appCtx?.surnames?.find(s => s.surname === surname) : null;
  const surHanja = surObj?.hanja || '';
  const syllables = explainSyllables(entry, appCtx?.hanja || {});
  const givenHanja = entry.hanja || syllables.map(s => s.hanja || '').join('');
  let fullHanja = (surHanja ? surHanja + ' ' : '') + (givenHanja ? [...givenHanja].join(' ') : '');
  fullHanja = fullHanja.trim();

  if (fullHanja) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '400 34px "Noto Serif KR", serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '8px';
    ctx.fillStyle = theme.subTextColor;
    ctx.fillText(fullHanja, 540, 560);
    ctx.restore();
  }

  // 8. 이름 뜻 문장 (글자 수에 따른 동적 폰트 크기 및 줄바꿈으로 카드와의 겹침 방지)
  const rawMeaning = (entry.meaning || '').trim();
  const meaningLen = rawMeaning.length;

  let meaningFontSize = 36;
  let meaningLineHeight = 54;
  let maxCharsPerLine = 16;

  if (meaningLen > 75) {
    meaningFontSize = 26;
    meaningLineHeight = 40;
    maxCharsPerLine = 22;
  } else if (meaningLen > 45) {
    meaningFontSize = 30;
    meaningLineHeight = 46;
    maxCharsPerLine = 18;
  }

  const meaningLines = wrapKoreanLines(rawMeaning, maxCharsPerLine);
  const displayLines = meaningLines.slice(0, 4);

  const meaningStartY = fullHanja ? 640 : 600;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${meaningFontSize}px "Noto Serif KR", serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = 14;

  displayLines.forEach((line, i) => {
    ctx.fillText(line, 540, meaningStartY + i * meaningLineHeight);
  });
  ctx.restore();

  const meaningEndY = meaningStartY + (displayLines.length - 1) * meaningLineHeight;

  // 9. 음절별 한자 풀이 카드: 뜻 문장 끝 위치에 따라 동적으로 Y좌표 및 높이 계산
  const cardW = 860;
  const cardX = (1080 - cardW) / 2;
  const cardY = Math.max(meaningEndY + 55, 780);
  const cardMaxBottom = 1430;
  const cardH = Math.min(480, Math.max(260, cardMaxBottom - cardY));
  const cardR = 28;

  ctx.save();
  ctx.fillStyle = theme.cardBg;
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fill();
  ctx.stroke();

  const validSyllables = syllables.length > 0 ? syllables : [{ hangul: given, hanja: '', meaning: '' }];
  const count = validSyllables.length;
  const sectionH = cardH / count;

  validSyllables.forEach((item, idx) => {
    const centerY = cardY + sectionH * idx + sectionH / 2;

    // 음절 구분선
    if (idx > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 60, cardY + sectionH * idx);
      ctx.lineTo(cardX + cardW - 60, cardY + sectionH * idx);
      ctx.stroke();
    }

    // "瑞 상서로울 서" 형태 라인
    let sylTitle = '';
    if (item.hanja && item.meaning) {
      sylTitle = `${item.hanja}  ${item.meaning}`;
    } else if (item.hanja) {
      sylTitle = `${item.hanja}  ${item.hangul}`;
    } else if (item.meaning) {
      sylTitle = item.meaning;
    } else {
      sylTitle = item.hangul;
    }

    const hasSym = Boolean(item.sym && count <= 2 && sectionH >= 110);
    const sylFontSize = sectionH < 120 ? 28 : (sectionH < 150 ? 32 : 36);

    // 메인 음절 풀이 텍스트
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${sylFontSize}px "Noto Serif KR", serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    const titleY = hasSym ? centerY - Math.round(sectionH * 0.14) : centerY;
    ctx.fillText(sylTitle, 540, titleY);
    ctx.restore();

    // 상징 의미 (sym) 한 줄 문장
    if (hasSym) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const symFontSize = sectionH < 140 ? 21 : 24;
      ctx.font = `400 ${symFontSize}px "Noto Sans KR", system-ui, sans-serif`;
      ctx.fillStyle = theme.subTextColor;
      let symText = item.sym;
      if (symText.length > 32) symText = symText.slice(0, 31) + '…';
      ctx.fillText(symText, 540, centerY + Math.round(sectionH * 0.18));
      ctx.restore();
    }
  });
  ctx.restore();

  // 10. 하단 캡션 "나에게 익명 편지 남기기 ↓" 및 URL (안전 영역 1620px 이전 Y=1490~1560 에 배치)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 26px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillStyle = theme.accent;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 12;
  ctx.fillText('나에게 익명 편지 남기기 ↓', 540, 1490);
  ctx.restore();

  // URL 링크 스티커 형태의 알약 배지
  const displayHost = location.host || 'tellmyname.app';
  const displayUrl = `${displayHost}/name/${fullName}`;
  ctx.save();
  let urlFontSize = 24;
  ctx.font = `500 ${urlFontSize}px "Noto Sans KR", system-ui, sans-serif`;
  while (ctx.measureText(displayUrl).width > 720 && urlFontSize > 16) {
    urlFontSize -= 2;
    ctx.font = `500 ${urlFontSize}px "Noto Sans KR", system-ui, sans-serif`;
  }
  const urlWidth = ctx.measureText(displayUrl).width;
  const pillW = Math.max(340, urlWidth + 60);
  const pillH = 52;
  const pillX = 540 - pillW / 2;
  const pillY = 1535;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, pillX, pillY, pillW, pillH, 26);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(displayUrl, 540, pillY + pillH / 2);
  ctx.restore();
}

/** 카카오톡 또는 시스템 공유 시트 실행 */
async function shareToKakao(canvas, fullName, shareUrl, toastEl, hintEl) {
  if (!canvas) return;

  canvas.toBlob(async blob => {
    if (!blob) return;
    const fileName = `${fullName}_tellmyname.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    let canShare = false;
    try {
      canShare = Boolean(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
    } catch {
      canShare = false;
    }

    if (canShare) {
      try {
        await navigator.share({
          files: [file],
          title: `${fullName} 이름 풀이`,
          text: `tellmyname.app에서 확인한 ${fullName}의 이름 풀이 카드예요 ✨`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('navigator.share failed:', err);
      }
    }

    // 데스크톱 또는 Web Share 미지원 환경: 이미지 저장 + 카카오톡 전송 안내 토스트
    downloadBlob(blob, fileName);
    showToast(toastEl, '이미지가 저장되었습니다! 카카오톡에 사진을 공유해보세요 💛');
    if (hintEl) {
      hintEl.textContent = '카카오톡 대화방을 열고 방금 저장된 이미지를 친구에게 전송해보세요!';
      hintEl.hidden = false;
    }
  }, 'image/png');
}

/** 인스타그램 스토리 공유 */
async function shareToInstagram(canvas, fullName, shareUrl, hintEl) {
  if (!canvas) return;

  canvas.toBlob(async blob => {
    if (!blob) return;
    const fileName = `${fullName}_tellmyname_story.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    let canShare = false;
    try {
      canShare = Boolean(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
    } catch {
      canShare = false;
    }

    if (canShare) {
      try {
        await navigator.share({
          files: [file],
          title: `${fullName} 이름 뜻`,
          text: `${fullName} — tellmyname.app`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('navigator.share failed, fallback to download:', err);
      }
    }

    // 미지원 환경: 다운로드 & 힌트
    downloadBlob(blob, fileName);
    if (hintEl) {
      hintEl.textContent = '이미지를 저장한 뒤 인스타그램 스토리에 올려주세요 📸';
      hintEl.hidden = false;
    }
  }, 'image/png');
}

/** 이미지 직접 저장 */
function downloadImage(canvas, fullName, toastEl) {
  if (!canvas) return;
  canvas.toBlob(blob => {
    if (!blob) return;
    const fileName = `${fullName}_tellmyname.png`;
    downloadBlob(blob, fileName);
    showToast(toastEl, '이미지가 기기에 저장되었습니다!');
  }, 'image/png');
}

/** Blob 파일 다운로드 헬퍼 */
function downloadBlob(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

/** 링크 복사 */
async function copyLink(shareUrl, toastEl) {
  try {
    await navigator.clipboard.writeText(shareUrl);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = shareUrl;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  showToast(toastEl, '링크가 복사되었습니다!');
}

/** 토스트 메시지 표시 */
function showToast(toastEl, msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.hidden = false;
  toastEl.classList.add('visible');

  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastEl.classList.remove('visible');
    setTimeout(() => {
      toastEl.hidden = true;
    }, 200);
  }, 2200);
}

/** 한국어 문장 1줄당 최대 약 16자 내외로 자연스럽게 줄바꿈 */
function wrapKoreanLines(text, maxChars = 16) {
  if (!text) return [];
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [text];

  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);

  // 마지막 줄이 1단어(4글자 이하)로 끊기면 앞줄에서 1단어를 넘겨 균형 맞춤
  if (lines.length > 1) {
    const last = lines[lines.length - 1];
    const prev = lines[lines.length - 2];
    if (last.length <= 4 && prev.includes(' ')) {
      const prevWords = prev.split(' ');
      const movedWord = prevWords.pop();
      lines[lines.length - 2] = prevWords.join(' ');
      lines[lines.length - 1] = movedWord + ' ' + last;
    }
  }
  return lines;
}

/** 둥근 사각형 경로 그리기 */
function drawRoundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/** 모서리 코너 장식 */
function drawCornerAccents(ctx, x, y, w, h, len) {
  ctx.beginPath();
  ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
  ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
  ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
  ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
  ctx.stroke();
}

/** HTML 속성 이스케이프 */
function escapeAttr(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}
