// web/js/share.js — Feature #8: Multilingual Instagram Story 9:16 Canvas & KakaoTalk Share Module
// Domain: myhome.tellmyname.app

import { UI_DICTIONARY, getTranslation, localizeHouse } from './lib/i18n.js';
import { MAX_LEVEL, GOOD_HOUSE_THRESHOLD } from './lib/constants.js';

export const SHARE_ORIGIN = 'https://myhome.tellmyname.app';

/**
 * 이름 기반 영구 공유 URL 생성
 * - currentName이 있으면: https://myhome.tellmyname.app/name/{encodeURIComponent(이름)}
 * - 없으면: https://myhome.tellmyname.app/level/{level}
 */
export function buildPermanentShareUrl(houseData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  if (trimmed) {
    const base = `${SHARE_ORIGIN}/name/${encodeURIComponent(trimmed)}`;
    return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
  }
  const rawLv = (houseData && houseData.level != null) ? Number(houseData.level) : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, rawLv));
  const base = `${SHARE_ORIGIN}/level/${lv}`;
  return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
}

/**
 * URL 디코딩을 통한 사람이 읽기 쉬운 공유 URL 포맷터
 * (예: %EA%B9%80%EC%84%9C%EC%9C%A4 -> 김서윤)
 */
export function formatReadableShareUrl(url) {
  try {
    return decodeURIComponent(url);
  } catch (_) {
    return url;
  }
}

/**
 * 카카오톡 / 인스타그램 / Web Share API용 공유 페이로드 생성 (다국어 지원)
 */
export function buildSharePayload(houseData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = (houseData && houseData.level != null) ? houseData.level : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, Number(rawLv) || 0));
  const dict = UI_DICTIONARY[lang] || UI_DICTIONARY['ko'];
  const localized = localizeHouse(houseData || { level: lv }, lang, trimmed);

  const title = localized?.title || houseData?.title || '다중우주 주택';
  const builtYear = localized?.builtYear || houseData?.builtYear || '';
  const estimatedValue = localized?.estimatedValue || houseData?.estimatedValue || '';
  const specialFeature = localized?.specialFeature || houseData?.specialFeature || '';

  let shareTitle = '';
  if (lang === 'ko') {
    shareTitle = trimmed
      ? `${trimmed}님에게 어울리는 집 — Lv.${lv} ${title}`
      : `나에게 어울리는 집 — Lv.${lv} ${title}`;
  } else {
    const ownerPhrase = trimmed
      ? dict.ownerTitle.replace('{name}', trimmed)
      : dict.brandHeader;
    shareTitle = `${ownerPhrase} — Lv.${lv} ${title}`;
  }

  let specYearLabel = '건축연도';
  let specValueLabel = '추산가치';
  let specFeatureLabel = '특별기능';

  if (lang !== 'ko' && dict.specs) {
    specYearLabel = dict.specs.builtYearLabel || 'Year Built';
    specValueLabel = dict.specs.estimatedValueLabel || 'Estimated Value';
    specFeatureLabel = dict.specs.specialFeatureLabel || 'Special Feature';
  }

  const textLines = [
    builtYear ? `📅 ${specYearLabel}: ${builtYear}` : '',
    estimatedValue ? `💰 ${specValueLabel}: ${estimatedValue}` : '',
    specialFeature ? `⚡ ${specFeatureLabel}: ${specialFeature}` : ''
  ].filter(Boolean);

  const shareText = textLines.join('\n');
  const shareUrl = buildPermanentShareUrl(houseData, trimmed, lang);

  const paddedLevel = String(lv).padStart(5, '0');
  const imageUrl = houseData?.ogImageUrl || `${SHARE_ORIGIN}/r2/houses/${paddedLevel}.webp`;

  return {
    title: shareTitle,
    text: shareText,
    url: shareUrl,
    imageUrl
  };
}

/**
 * 토스트 알림 표시
 */
export function showToast(message, duration = 2800) {
  if (typeof document === 'undefined') return;

  let toast = document.getElementById('share-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast-notification';
    toast.className = 'share-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (toast._timer) {
    clearTimeout(toast._timer);
  }

  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
    toast._timer = null;
  }, duration);
}

/**
 * 클립보드에 고정 공유 URL 복사 및 토스트 피드백
 */
export async function copyShareUrl(houseData, currentName = '', lang = 'ko') {
  const url = buildPermanentShareUrl(houseData, currentName, lang);
  const readableUrl = formatReadableShareUrl(url);
  const dict = UI_DICTIONARY[lang] || UI_DICTIONARY['ko'];
  let copied = false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(readableUrl);
      copied = true;
    } catch (_) {}
  }

  if (!copied && typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = readableUrl;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copied = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (_) {}
  }

  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const displayUrl = trimmed
    ? `myhome.tellmyname.app/name/${trimmed}`
    : readableUrl.replace(/^https?:\/\//, '');

  const toastMsg = dict.copiedToast
    ? `🔗 ${dict.copiedToast} (${displayUrl})`
    : `🔗 공유 주소가 복사되었습니다! (${displayUrl})`;

  showToast(toastMsg);
  return url;
}

/**
 * 텍스트 줄바꿈 렌더링 헬퍼 (Canvas 2D)
 */
function renderWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  if (!text) return y;
  const str = String(text).trim();
  const useWordWrap = /[A-Za-z0-9]/.test(str) && str.includes(' ');
  const tokens = useWordWrap ? str.split(/(\s+)/) : Array.from(str);
  let line = '';
  let lineCount = 0;
  let currentY = y;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const testLine = line + token;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.trim().length > 0) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(line.trimEnd().slice(0, Math.max(0, line.trimEnd().length - 2)) + '...', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line.trimEnd(), x, currentY);
      line = token.trimStart();
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line.trim() && lineCount < maxLines) {
    ctx.fillText(line.trimEnd(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/**
 * 둥근 사각형 경로 헬퍼
 */
function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  if (typeof ctx.beginPath === 'function') ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    if (typeof ctx.moveTo === 'function') ctx.moveTo(x + r, y);
    if (typeof ctx.lineTo === 'function') ctx.lineTo(x + width - r, y);
    if (typeof ctx.quadraticCurveTo === 'function') ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    if (typeof ctx.lineTo === 'function') ctx.lineTo(x + width, y + height - r);
    if (typeof ctx.quadraticCurveTo === 'function') ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    if (typeof ctx.lineTo === 'function') ctx.lineTo(x + r, y + height);
    if (typeof ctx.quadraticCurveTo === 'function') ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    if (typeof ctx.lineTo === 'function') ctx.lineTo(x, y + r);
    if (typeof ctx.quadraticCurveTo === 'function') ctx.quadraticCurveTo(x, y, x + r, y);
    if (typeof ctx.closePath === 'function') ctx.closePath();
  }
}

/**
 * 비동기 이미지 로더 (동일 출처 R2 이미지 로드, 실패 시 null 반환)
 */
function loadArtworkImage(src) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 4500); // 4.5초 안전 타임아웃
  });
}

/**
 * 9:16 인스타그램 스토리 고해상도 캔버스(1080 × 1920) 렌더링
 * 3-Step Visual Hierarchy:
 *   Step 1 (TOP Y:90~250): Owner Headline ("{name}님에게 어울리는 집은")
 *   Step 2 (CENTER Y:260~1020): High-Resolution House Photo ("사진")
 *   Step 3 (BOTTOM Y:1045~1700): Photo Descriptions & Appraisal Specs ("사진에 대한 설명들")
 * 테마: 'cert' (등기권리증 골드/크림슨), 'cyber' (사이버 네온), 'sunset'/'cosmic' (노을 그라디언트)
 */
export async function renderStoryCanvas(canvas, houseData, currentName = '', theme = 'cosmic', lang = 'ko') {
  if (!canvas || typeof canvas.getContext !== 'function') {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. 캔버스 해상도 고정: 1080 × 1920 (9:16 Instagram Story)
  canvas.width = 1080;
  canvas.height = 1920;

  const width = 1080;
  const height = 1920;
  const trimmedName = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = Number(houseData?.level);
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const paddedLevel = String(lv).padStart(5, '0');
  const isReal = lv % 2 === 0;
  const isGood = lv >= GOOD_HOUSE_THRESHOLD;

  // 다국어 사전 및 번역 객체 준비
  const selectedLang = UI_DICTIONARY[lang] ? lang : 'ko';
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];
  const localized = localizeHouse(houseData || { level: lv }, selectedLang, trimmedName);

  // 테마 정규화
  let activeTheme = theme;
  if (activeTheme === 'cosmic') activeTheme = 'sunset';
  if (!['cert', 'cyber', 'sunset'].includes(activeTheme)) {
    activeTheme = 'cert';
  }

  // 테마별 색상 설정
  let bgGradient, borderGradient, cardBg, textPrimary, textSecondary, textAccent, badgeBg;
  if (activeTheme === 'cert') {
    bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#170609');
    bgGradient.addColorStop(0.4, '#280c13');
    bgGradient.addColorStop(1, '#110306');

    borderGradient = ctx.createLinearGradient(60, 60, width - 60, height - 60);
    borderGradient.addColorStop(0, '#f4d06f');
    borderGradient.addColorStop(0.5, '#c89933');
    borderGradient.addColorStop(1, '#f9e79f');

    cardBg = 'rgba(28, 9, 14, 0.88)';
    textPrimary = '#fff8e7';
    textSecondary = '#e6c887';
    textAccent = '#ffd700';
    badgeBg = 'rgba(218, 165, 32, 0.25)';
  } else if (activeTheme === 'cyber') {
    bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#04060e');
    bgGradient.addColorStop(0.5, '#0a1024');
    bgGradient.addColorStop(1, '#050711');

    borderGradient = ctx.createLinearGradient(60, 60, width - 60, height - 60);
    borderGradient.addColorStop(0, '#00f0ff');
    borderGradient.addColorStop(0.5, '#8a2be2');
    borderGradient.addColorStop(1, '#ff007f');

    cardBg = 'rgba(7, 13, 30, 0.90)';
    textPrimary = '#f0f8ff';
    textSecondary = '#00f0ff';
    textAccent = '#ff007f';
    badgeBg = 'rgba(0, 240, 255, 0.2)';
  } else {
    bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#0f051d');
    bgGradient.addColorStop(0.3, '#351044');
    bgGradient.addColorStop(0.65, '#831843');
    bgGradient.addColorStop(0.85, '#ea580c');
    bgGradient.addColorStop(1, '#f59e0b');

    borderGradient = ctx.createLinearGradient(60, 60, width - 60, height - 60);
    borderGradient.addColorStop(0, '#ffffff');
    borderGradient.addColorStop(0.5, '#f472b6');
    borderGradient.addColorStop(1, '#fbbf24');

    cardBg = 'rgba(20, 6, 30, 0.78)';
    textPrimary = '#ffffff';
    textSecondary = '#fbcfe8';
    textAccent = '#fde047';
    badgeBg = 'rgba(255, 255, 255, 0.18)';
  }

  // 2. 전체 배경 채우기
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  if (activeTheme === 'cyber') {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = 60; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (activeTheme === 'sunset') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const stars = [
      [140, 150, 2.5], [280, 220, 1.8], [420, 120, 3], [780, 180, 2], [920, 250, 3],
      [200, 360, 2], [850, 380, 2.2], [160, 520, 1.5], [940, 580, 2], [320, 700, 1.8]
    ];
    stars.forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // 3. 외부 테두리 프레임 (Instagram 안전 영역 내부: margin 50px)
  ctx.save();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 4;
  drawRoundedRectPath(ctx, 50, 50, width - 100, height - 100, 36);
  ctx.stroke();

  if (activeTheme === 'cert') {
    ctx.strokeStyle = 'rgba(218, 165, 32, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundedRectPath(ctx, 62, 62, width - 124, height - 124, 28);
    ctx.stroke();
  }
  ctx.restore();

  // =========================================================================
  // STEP 1: TOP (Y: 90 ~ 250) — Owner Headline ("{name}님에게 어울리는 집은")
  // =========================================================================
  ctx.save();
  ctx.textAlign = 'center';

  // 1-A. 기관 뱃지 / 인증 배지 (Y: 92)
  ctx.fillStyle = badgeBg;
  drawRoundedRectPath(ctx, width / 2 - 270, 92, 540, 44, 22);
  ctx.fill();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  const orgBadgeText = `🪐 ${dict.brandHeader || 'MyHome'} • MULTIVERSE AI`;
  ctx.fillText(orgBadgeText, width / 2, 122);

  // 1-B. 대제목: Step 1 Owner Headline ("{name}님에게 어울리는 집은" in all 14 languages!)
  let primaryHeadline = '';
  let subHeadline = '';

  if (trimmedName) {
    if (selectedLang === 'ko') {
      primaryHeadline = `${trimmedName}님에게 어울리는 집은`;
      subHeadline = `${trimmedName}님의 미래 집 등기권리증`;
    } else {
      primaryHeadline = dict.ownerTitle ? dict.ownerTitle.replace('{name}', trimmedName) : `The House That Suits ${trimmedName}`;
      subHeadline = `${dict.brandHeader || 'MyHome'} • ${trimmedName}`;
    }
  } else {
    if (selectedLang === 'ko') {
      primaryHeadline = '나에게 어울리는 집은';
      subHeadline = '나의 미래 집 등기권리증';
    } else {
      primaryHeadline = dict.brandHeader || 'The House That Suits You';
      subHeadline = dict.brandHeader || 'MyHome';
    }
  }

  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 44px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 14;
  ctx.fillText(primaryHeadline, width / 2, 185);
  ctx.shadowBlur = 0;

  // 1-C. 소제목 / 등기권리증 명세 (Y: 230)
  ctx.fillStyle = textAccent;
  ctx.font = 'bold 24px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  ctx.fillText(subHeadline, width / 2, 228);

  ctx.restore();

  // =========================================================================
  // STEP 2: CENTER (Y: 260 ~ 1020) — High-Resolution House Photo ("사진")
  // =========================================================================
  const artX = 90;
  const artY = 260;
  const artW = 900;
  const artH = 760;
  const artRadius = 32;

  ctx.save();
  drawRoundedRectPath(ctx, artX, artY, artW, artH, artRadius);
  ctx.clip();

  ctx.fillStyle = '#080c18';
  ctx.fillRect(artX, artY, artW, artH);

  const imageSrc = houseData?.imageUrl || `/r2/houses/${paddedLevel}.webp`;
  const artworkImg = await loadArtworkImage(imageSrc);

  if (artworkImg) {
    const imgRatio = artworkImg.width / artworkImg.height;
    const targetRatio = artW / artH;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
      sHeight = artworkImg.height;
      sWidth = artworkImg.height * targetRatio;
      sx = (artworkImg.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = artworkImg.width;
      sHeight = artworkImg.width / targetRatio;
      sx = 0;
      sy = (artworkImg.height - sHeight) / 2;
    }
    ctx.drawImage(artworkImg, sx, sy, sWidth, sHeight, artX, artY, artW, artH);

    const artGlow = ctx.createLinearGradient(artX, artY + artH - 220, artX, artY + artH);
    artGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    artGlow.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
    ctx.fillStyle = artGlow;
    ctx.fillRect(artX, artY + artH - 220, artW, 220);
  } else {
    const fallbackGrad = ctx.createLinearGradient(artX, artY, artX + artW, artY + artH);
    fallbackGrad.addColorStop(0, '#1e293b');
    fallbackGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(artX, artY, artW, artH);

    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'center';
    ctx.font = '72px sans-serif';
    ctx.fillText(localized?.categoryEmoji || houseData?.categoryEmoji || '🏰', artX + artW / 2, artY + artH / 2 - 30);
    ctx.font = 'bold 32px "Pretendard", sans-serif';
    ctx.fillText(`Lv.${lv} House Photo`, artX + artW / 2, artY + artH / 2 + 40);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 3;
  drawRoundedRectPath(ctx, artX, artY, artW, artH, artRadius);
  ctx.stroke();
  ctx.restore();

  // 2-B. 아트워크 위 3대 뱃지 오버레이
  ctx.save();

  ctx.fillStyle = 'rgba(5, 7, 15, 0.88)';
  drawRoundedRectPath(ctx, artX + 24, artY + 24, 280, 52, 26);
  ctx.fill();
  ctx.strokeStyle = textAccent;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = textAccent;
  ctx.font = 'bold 26px "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Lv.${lv.toLocaleString()} / ${MAX_LEVEL}`, artX + 164, artY + 59);

  const realityBadgeText = isReal
    ? (selectedLang === 'ko' ? '🏛️ 짝수 · 실제 건축물' : `🏛️ Even · ${dict.reality.REAL || 'Real World'}`)
    : (selectedLang === 'ko' ? '🛸 홀수 · 허구 건축물' : `🛸 Odd · ${dict.reality.FICTION || 'Fictional'}`);
  const realityBadgeColor = isReal ? '#38bdf8' : '#e879f9';

  ctx.font = 'bold 21px "Pretendard", sans-serif';
  const rBadgeW = Math.max(276, Math.min(540, Math.ceil(ctx.measureText(realityBadgeText).width) + 48));
  const rBadgeX = artX + artW - 24 - rBadgeW;
  ctx.fillStyle = 'rgba(5, 7, 15, 0.88)';
  drawRoundedRectPath(ctx, rBadgeX, artY + 24, rBadgeW, 52, 26);
  ctx.fill();
  ctx.strokeStyle = realityBadgeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = realityBadgeColor;
  ctx.fillText(realityBadgeText, rBadgeX + rBadgeW / 2, artY + 59);

  const zoneLabelLocalized = isGood
    ? (dict.zones.GOOD || 'Jackpot')
    : (dict.zones.BAD || 'Doom');
  const zoneBadgeText = isGood ? `💎 ${zoneLabelLocalized}` : `💀 ${zoneLabelLocalized}`;
  const zoneBadgeColor = isGood ? '#34d399' : '#f87171';

  ctx.fillStyle = 'rgba(5, 7, 15, 0.88)';
  drawRoundedRectPath(ctx, artX + 24, artY + artH - 76, 360, 52, 26);
  ctx.fill();
  ctx.strokeStyle = zoneBadgeColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = zoneBadgeColor;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  ctx.fillText(zoneBadgeText, artX + 204, artY + artH - 42);

  ctx.restore();

  // =========================================================================
  // STEP 3: BOTTOM (Y: 1040 ~ 1695) — Photo Descriptions & Appraisal Specs ("사진에 대한 설명들")
  // =========================================================================
  const cardX = 90;
  const cardY = 1040;
  const cardW = 900;
  const cardH = 655;
  const cardRadius = 32;

  ctx.save();
  ctx.fillStyle = cardBg;
  drawRoundedRectPath(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const houseTitle = localized?.title || houseData?.title || `House Lv.${lv}`;
  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 32px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  ctx.textAlign = 'left';
  let cursorY = renderWrappedText(ctx, houseTitle, cardX + 45, cardY + 58, cardW - 90, 42, 2);

  const dividerY = Math.max(cursorY + 6, cardY + 118);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 45, dividerY);
  ctx.lineTo(cardX + cardW - 45, dividerY);
  ctx.stroke();

  let detailY = dividerY + 46;
  const labelColX = cardX + 45;
  const valColX = selectedLang === 'ko' ? (cardX + 245) : (cardX + 310);
  const valWidth = cardW - (valColX - cardX) - 45;

  const builtYearLabel = `📅 ${dict.specs?.builtYearLabel || 'Year Built'}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(builtYearLabel, labelColX, detailY);
  ctx.fillStyle = textPrimary;
  ctx.font = '500 22px "Pretendard", sans-serif';
  detailY = renderWrappedText(ctx, localized?.builtYear || houseData?.builtYear || '-', valColX, detailY, valWidth, 32, 2) + 16;

  const estValueLabel = `💰 ${dict.specs?.estimatedValueLabel || 'Estimated Value'}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(estValueLabel, labelColX, detailY);
  ctx.fillStyle = textAccent;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  detailY = renderWrappedText(ctx, localized?.estimatedValue || houseData?.estimatedValue || '-', valColX, detailY, valWidth, 32, 2) + 16;

  const specFeatureLabel = `⚡ ${dict.specs?.specialFeatureLabel || 'Special Feature'}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(specFeatureLabel, labelColX, detailY);
  ctx.fillStyle = textPrimary;
  ctx.font = '400 21px "Pretendard", sans-serif';
  const specialText = localized?.specialFeature || houseData?.specialFeature || '-';
  detailY = renderWrappedText(ctx, specialText, valColX, detailY, valWidth, 30, 2) + 12;

  const verdictDivY = detailY + 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 45, verdictDivY);
  ctx.lineTo(cardX + cardW - 45, verdictDivY);
  ctx.stroke();

  const verdictStartY = verdictDivY + 44;
  ctx.textAlign = 'center';
  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 25px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  const verdictText = localized?.aiVerdict || houseData?.aiVerdict || '-';
  renderWrappedText(ctx, `“${verdictText}”`, width / 2, verdictStartY, cardW - 90, 35, 3);

  ctx.restore();

  // =========================================================================
  // 4. 하단 워터마크 & 스토리 참여 유도 (Y: 1715 ~ 1860)
  // =========================================================================
  ctx.save();
  ctx.textAlign = 'center';

  const shareUrl = buildPermanentShareUrl(houseData, trimmedName, selectedLang);
  const readableUrl = formatReadableShareUrl(shareUrl);
  const displayHostAndPath = readableUrl.replace(/^https?:\/\//, '');

  ctx.fillStyle = textAccent;
  ctx.font = 'bold 29px "Pretendard", sans-serif';
  ctx.fillText(`🔗 ${displayHostAndPath}`, width / 2, 1755);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
  ctx.font = '500 22px "Pretendard", sans-serif';
  const stickerHint = dict.storyPhotoHint || '👆 Tap Link Sticker to find your house!';
  ctx.fillText(stickerHint, width / 2, 1800);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '400 17px monospace';
  ctx.fillText('myhome.tellmyname.app • 0~999 Multiverse AI House Appraisal', width / 2, 1840);
  ctx.restore();

  return canvas;
}

/**
 * 공유 모달 대화상자 열기 (다국어 지원)
 */
export function openShareModal(houseData, currentName = '', lang = 'ko') {
  if (typeof document === 'undefined') return;

  const selectedLang = UI_DICTIONARY[lang] ? lang : 'ko';
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const shareUrl = buildPermanentShareUrl(houseData, trimmed, selectedLang);
  const readableShareUrl = formatReadableShareUrl(shareUrl);
  const payload = buildSharePayload(houseData, trimmed, selectedLang);

  let root = document.getElementById('share-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'share-modal-root';
    document.body.appendChild(root);
  }

  root.innerHTML = `
    <div class="share-modal-backdrop" id="share-modal-backdrop">
      <div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
        <div class="share-modal-header">
          <div>
            <h3 class="share-modal-title" id="share-modal-title">✨ ${dict.brandHeader || 'MyHome'}</h3>
            <p class="share-modal-subtitle">${dict.storyPhotoHint || 'Instagram Story (9:16)'}</p>
          </div>
          <button class="share-modal-close" id="share-modal-close-btn" aria-label="Close">×</button>
        </div>

        <div class="share-modal-body">
          <!-- 테마 선택기 -->
          <div class="theme-selector">
            <button class="theme-pill" data-theme="cert">📜 ${dict.shareModal?.themeCert || (selectedLang === 'ko' ? '등기권리증' : 'Classic')}</button>
            <button class="theme-pill" data-theme="cyber">⚡ ${dict.shareModal?.themeCyber || (selectedLang === 'ko' ? '사이버 네온' : 'Cyberpunk')}</button>
            <button class="theme-pill active" data-theme="sunset">🌅 ${dict.shareModal?.themeSunset || (selectedLang === 'ko' ? '노을 그라디언트' : 'Sunset')}</button>
          </div>

          <!-- 9:16 인스타그램 스토리 프리뷰 캔버스 -->
          <div class="share-canvas-wrapper">
            <canvas id="share-story-canvas" width="1080" height="1920"></canvas>
            <div id="share-canvas-spinner" class="share-canvas-spinner" style="display: none;">
              🎨 9:16 Story Generating...
            </div>
          </div>

          <!-- 고정 URL 표시 및 즉시 복사 -->
          <div class="share-url-container">
            <input type="text" class="share-url-input" id="share-url-field" readonly value="${readableShareUrl}">
            <button class="share-url-copy-btn" id="share-url-copy-button">${selectedLang === 'ko' ? '복사' : (selectedLang === 'ja' ? 'コピー' : (selectedLang === 'zh' ? '复制' : 'Copy'))}</button>
          </div>

          <!-- 액션 버튼 (4대 공유 버튼) -->
          <div class="share-actions">
            <!-- 1. 📸 인스타그램 스토리 공유 -->
            <button class="share-btn share-btn-insta" id="share-action-insta-direct">
              📸 ${dict.shareModal?.instaDirectBtn || (selectedLang === 'ko' ? '인스타그램 스토리로 바로 보내기 / 공유' : 'Share to Instagram Story Directly')}
            </button>

            <!-- 2. 🎵 틱톡 공유 (TikTok Photo Story) -->
            <button class="share-btn share-btn-tiktok" id="share-action-tiktok">
              🎵 ${dict.shareModal?.tiktokDirectBtn || (selectedLang === 'ko' ? '틱톡 공유 (9:16 카드 & 링크)' : 'Share to TikTok')}
            </button>

            <!-- 3. 🟢 왓츠앱 공유 (WhatsApp) -->
            <button class="share-btn share-btn-whatsapp" id="share-action-whatsapp">
              🟢 ${dict.shareModal?.whatsappDirectBtn || (selectedLang === 'ko' ? '왓츠앱으로 공유하기' : 'Share via WhatsApp')}
            </button>

            <!-- 4. 💬 카카오톡 / 모바일 바로 공유 -->
            <button class="share-btn share-btn-kakao" id="share-action-mobile-share">
              💬 ${dict.shareMobileBtn || 'Share on Mobile'}
            </button>

            <!-- 5. 📥 인스타/틱톡 스토리 이미지 다운로드 (PNG 1080×1920) -->
            <button class="share-btn share-btn-save" id="share-action-save-image">
              📥 ${dict.saveStoryBtn || 'Save Story Image'}
            </button>

            <!-- 6. 🔗 고정 URL 복사 -->
            <button class="share-btn share-btn-copy" id="share-action-copy-url">
              🔗 ${dict.copyUrlBtn || 'Copy Result Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  let currentTheme = 'sunset';
  const canvas = document.getElementById('share-story-canvas');
  const spinner = document.getElementById('share-canvas-spinner');

  const updateCanvas = async (t) => {
    currentTheme = t;
    if (spinner) spinner.style.display = 'flex';
    try {
      await renderStoryCanvas(canvas, houseData, trimmed, currentTheme, selectedLang);
    } finally {
      if (spinner) spinner.style.display = 'none';
    }
  };

  updateCanvas(currentTheme);

  const closeModal = () => {
    root.innerHTML = '';
    document.removeEventListener('keydown', onKeyDown);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', onKeyDown);

  const backdrop = document.getElementById('share-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  const closeBtn = document.getElementById('share-modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const themePills = root.querySelectorAll('.theme-pill');
  themePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      themePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const selectedTheme = pill.getAttribute('data-theme') || 'cert';
      updateCanvas(selectedTheme);
    });
  });

  const handleCopy = () => {
    copyShareUrl(houseData, trimmed, selectedLang);
    const field = document.getElementById('share-url-field');
    if (field) {
      field.select();
    }
  };

  const urlCopyBtn = document.getElementById('share-url-copy-button');
  if (urlCopyBtn) urlCopyBtn.addEventListener('click', handleCopy);

  const copyUrlActionBtn = document.getElementById('share-action-copy-url');
  if (copyUrlActionBtn) copyUrlActionBtn.addEventListener('click', handleCopy);

  const triggerImageDownload = () => {
    const sanitized = (trimmed || 'myhome').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
    const filename = `myhome_${sanitized}_lv${houseData?.level || 0}_${currentTheme}.png`;

    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        showToast(dict.shareModal?.savedToast || (selectedLang === 'ko'
          ? '📥 9:16 인스타 스토리 이미지가 저장되었습니다! 인스타그램 스토리에서 사진을 올리고 링크 스티커를 첨부해보세요.'
          : '📥 9:16 Instagram Story image saved! Upload it to your story with the Link sticker.'));
      }, 'image/png');
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(dict.shareModal?.savedToast || (selectedLang === 'ko'
        ? '📥 9:16 인스타 스토리 이미지가 저장되었습니다!'
        : '📥 9:16 Instagram Story image saved!'));
    }
  };

  const instaDirectBtn = document.getElementById('share-action-insta-direct');
  if (instaDirectBtn) {
    instaDirectBtn.addEventListener('click', async () => {
      if (typeof navigator !== 'undefined' && navigator.share && canvas.toBlob) {
        try {
          const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
          if (blob) {
            const file = new File([blob], `myhome_story_lv${houseData?.level || 0}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: payload.title,
                text: `${payload.title}\n${readableShareUrl}`,
                url: readableShareUrl
              });
              showToast(dict.copiedToast || 'Shared!');
              return;
            }
          }
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }

      triggerImageDownload();
      copyShareUrl(houseData, trimmed, selectedLang);
      showToast(dict.shareModal?.instaDownloadedToast || (selectedLang === 'ko'
        ? '📸 9:16 스토리가 다운로드되고 링크가 복사되었습니다! 인스타그램 스토리에서 사진을 올리고 링크 스티커를 붙여보세요.'
        : '📸 Story downloaded and link copied! Add the photo to Instagram Story with the Link sticker.'));
    });
  }

  const saveImageBtn = document.getElementById('share-action-save-image');
  if (saveImageBtn) {
    saveImageBtn.addEventListener('click', triggerImageDownload);
  }

  const mobileShareBtn = document.getElementById('share-action-mobile-share');
  if (mobileShareBtn) {
    mobileShareBtn.addEventListener('click', async () => {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          if (canvas.toBlob && navigator.canShare) {
            const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
            if (blob) {
              const file = new File([blob], `myhome_lv${houseData?.level || 0}.png`, { type: 'image/png' });
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                  files: [file],
                  title: payload.title,
                  text: `${payload.title}\n${payload.text}\n${readableShareUrl}`,
                  url: readableShareUrl
                });
                return;
              }
            }
          }

          await navigator.share({
            title: payload.title,
            text: `${payload.text}\n${readableShareUrl}`,
            url: readableShareUrl
          });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') {
            return;
          }
        }
      }

      if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
        try {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: payload.title,
              description: payload.text,
              imageUrl: payload.imageUrl,
              link: {
                mobileWebUrl: payload.url,
                webUrl: payload.url
              }
            },
            buttons: [
              {
                title: dict.searchBtn || 'Find My House',
                link: {
                  mobileWebUrl: payload.url,
                  webUrl: payload.url
                }
              }
            ]
          });
          return;
        } catch (_) {}
      }

      copyShareUrl(houseData, trimmed, selectedLang);
      showToast(dict.shareModal?.messengerCopiedToast || (selectedLang === 'ko'
        ? '💬 공유 주소가 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유하세요.'
        : '💬 Share URL copied! Paste it into your messenger chat.'));
    });
  }
}
