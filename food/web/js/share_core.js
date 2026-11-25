// web/js/share_core.js — Unified Viral Photocard & Bento Share Engine for Mukbang (/food)
// Supports: 'daily' (5-meal board), 'multi' (2~4 meals), 'single' (1 meal), 'food' (gallery dish card)
// 14-Language support, R2 Custom Domain (img.tellmyname.app/foods), Zero-Clip Dynamic Height

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  MEAL_KEYS,
  FOOD_ORIGIN_GROUPS,
  formatFoodCode,
  getFoodImageUrl
} from '../../src/lib/constants.js';

import {
  t,
  normalizeLang,
  localizeFood
} from '../../src/lib/i18n.js';

const WATERMARK_DOMAIN = 'tellmyname.app/food';

export const FONT_STACK_DISPLAY = '"Paperlogy", "SUITE Variable", "Pretendard", "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", sans-serif';
export const FONT_STACK_SANS = '"SUITE Variable", "Pretendard", "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", "Noto Sans Devanagari", sans-serif';
export const FONT_STACK_SERIF = FONT_STACK_DISPLAY;

export const FALLBACK_SAVE_TOASTS = {
  ko: '이미지를 저장했습니다! 인스타그램이나 카카오톡에서 불러와 공유해보세요.',
  en: 'Image saved! Share it on Instagram, KakaoTalk, or anywhere.',
  hi: 'छवि सहेजी गई। साझा करने के लिए इसे इंस्टाग्राम या काकाओटॉक में खोलें।',
  vi: 'Đã lưu hình ảnh. Hãy chia sẻ lên Instagram hoặc Zalo nhé.',
  fr: 'Image enregistrée. Partagez-la sur Instagram ou vos messageries.',
  pt: 'Imagem salva. Compartilhe no Instagram ou WhatsApp.',
  es: 'Imagen guardada. Compártela en Instagram o WhatsApp.',
  id: 'Gambar berhasil disimpan. Bagikan ke Instagram atau WhatsApp.',
  ru: 'Изображение сохранено. Поделитесь им в Instagram или мессенджере.',
  de: 'Bild gespeichert. Jetzt auf Instagram oder WhatsApp teilen.',
  it: 'Immagine salvata. Condividila su Instagram o WhatsApp.',
  ja: '画像を保存しました！インスタやLINEでシェアしてみてください。',
  zh: '图片已保存！可导入至社交平台进行分享。',
  ms: 'Imej berjaya disimpan. Kongsikan di Instagram atau WhatsApp.'
};

export function getFallbackSaveToast(lang = 'ko') {
  const norm = normalizeLang(lang);
  return FALLBACK_SAVE_TOASTS[norm] || FALLBACK_SAVE_TOASTS.ko;
}


function resolveLocalizedFoodForCanvas(rawFood, currentLang, foodDict = null) {
  if (!rawFood) return {};
  const dict = foodDict || (typeof window !== 'undefined' ? window.__MUKBANG_FOOD_DICT__ : null);
  const loc = localizeFood(rawFood, currentLang, dict) || rawFood;
  if (currentLang === 'ko') return loc;
  const hasHangul = (s) => /[가-힣]/.test(String(s || ''));
  return {
    ...loc,
    name: hasHangul(loc.name) ? (rawFood.englishName || loc.name) : loc.name,
    tagline: hasHangul(loc.tagline) ? '' : loc.tagline
  };
}

export function formatPriceForLang(priceRange, lang = 'ko') {
  if (!priceRange) return '';
  const norm = normalizeLang(lang);
  const str = String(priceRange).trim();
  if (norm === 'ko') return str;
  const noKoreanNotes = str
    .replace(/\([^)]*[가-힣][^)]*\)/g, '')
    .replace(/([0-9,]+)\s*원/g, '₩$1')
    .replace(/원/g, '')
    .replace(/[가-힣]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!noKoreanNotes) return 'Est. Price';
  return noKoreanNotes;
}

export function showToast(message, duration = 3000) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('toast-container') || document.body;
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  if (typeof toast.setAttribute === 'function') {
    toast.setAttribute('role', 'alert');
  }
  toast.innerHTML = `<span class="toast-icon">✨</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, duration);
}

export async function copyToClipboard(text, successMessage = null) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      if (successMessage) showToast(`🔗 ${successMessage}`);
      return true;
    } catch (_) {}
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        if (successMessage) showToast(`🔗 ${successMessage}`);
        return true;
      }
    } catch (_) {}
  }
  return false;
}

export function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle = null, strokeStyle = null, lineWidth = 1) {
  ctx.save();
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

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Full-fidelity text wrapper with ZERO '...' truncation
 */
export function wrapCanvasLines(ctx, text, maxWidth) {
  if (!text) return [];
  const raw = String(text).replace(/\s+/g, ' ').trim();
  if (!raw) return [];

  const hasSpaces = raw.includes(' ');
  const units = hasSpaces ? raw.split(' ') : Array.from(raw);
  const lines = [];
  let current = '';

  const breakLongWord = (word) => {
    let chunk = '';
    for (const ch of Array.from(word)) {
      const next = chunk + ch;
      if (ctx.measureText(next).width > maxWidth && chunk.length > 0) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk = next;
      }
    }
    return chunk;
  };

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const sep = (hasSpaces && current.length > 0) ? ' ' : '';
    const candidate = current + sep + unit;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current.length > 0) lines.push(current);
      if (ctx.measureText(unit).width > maxWidth) {
        current = breakLongWord(unit);
      } else {
        current = unit;
      }
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

export function renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapCanvasLines(ctx, text, maxWidth);
  let curY = y;
  for (const line of lines) {
    ctx.fillText(line, x, curY);
    curY += lineHeight;
  }
  return curY;
}

async function ensureFoodCanvasFonts() {
  if (typeof document === 'undefined' || !document.fonts || typeof document.fonts.load !== 'function') {
    return;
  }
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('700 34px "Paperlogy"'),
        document.fonts.load('800 44px "Paperlogy"'),
        document.fonts.load('600 24px "SUITE Variable"'),
        document.fonts.load('700 26px "SUITE Variable"')
      ]),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);
  } catch (_) {}
}

export function loadArtworkImage(src, timeoutMs = 4200) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined' || !src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    let settled = false;
    const done = (val) => {
      if (!settled) {
        settled = true;
        resolve(val);
      }
    };
    img.onload = () => done((img.naturalWidth > 0 || img.width > 0) ? img : null);
    img.onerror = () => done(null);
    img.src = src;
    setTimeout(() => done(null), timeoutMs);
  });
}

async function loadFoodArtworkWithFallback(food) {
  const imgCode = food?.code || formatFoodCode(food?.index || 1);
  const candidates = [
    `https://img.tellmyname.app/foods/${imgCode}.png?v=2`,
    `/images/web/${imgCode}.webp`,
    `/images/${imgCode}.png`
  ];
  for (const url of candidates) {
    const img = await loadArtworkImage(url);
    if (img) return img;
  }
  return null;
}

function drawCoverImageInRoundedRect(ctx, img, x, y, w, h, radius) {
  ctx.save();
  if (typeof ctx.beginPath === 'function') ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  const imgRatio = img.width / Math.max(1, img.height);
  const boxRatio = w / Math.max(1, h);
  let drawW = w, drawH = h, drawX = x, drawY = y;

  if (imgRatio > boxRatio) {
    drawH = h;
    drawW = h * imgRatio;
    drawX = x - (drawW - w) / 2;
  } else {
    drawW = w;
    drawH = w / Math.max(0.01, imgRatio);
    drawY = y - (drawH - h) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

export function drawFallbackFoodIllustration(ctx, x, y, size, emoji = '🍲', foodName = '맛있는 음식', themeColor = '#F97316') {
  ctx.save();
  drawRoundedRect(ctx, x, y, size, size, 28, '#FFF7ED', themeColor, 2);
  ctx.font = `${Math.floor(size * 0.34)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x + size / 2, y + size / 2 - 12);
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 24px ${FONT_STACK_DISPLAY}`;
  ctx.fillStyle = '#9A3412';
  ctx.fillText(String(foodName || '').slice(0, 14), x + size / 2, y + size / 2 + size * 0.24);
  ctx.restore();
}

export function getThemePalette(theme = 'cream') {
  if (theme === 'aurora' || theme === 'dark') {
    return {
      bgGrad1: '#090D1A',
      bgGrad2: '#151E36',
      bgGrad3: '#0D1326',
      orbA: 'rgba(56, 189, 248, 0.16)',
      orbB: 'rgba(249, 115, 22, 0.14)',
      cardBg: '#151E33',
      cardBorder: 'rgba(148, 163, 184, 0.22)',
      cardShadow: 'rgba(2, 6, 23, 0.55)',
      topPillBg: 'rgba(249, 115, 22, 0.20)',
      topPillText: '#FDBA74',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textAccent: '#FB923C',
      bentoBg: 'rgba(30, 41, 69, 0.88)',
      bentoBorder: 'rgba(148, 163, 184, 0.16)',
      quoteBg1: 'rgba(249, 115, 22, 0.20)',
      quoteBg2: 'rgba(236, 72, 153, 0.16)',
      quoteBorder: 'rgba(251, 146, 60, 0.32)',
      quoteText: '#FFF7ED',
      footerPillBg: 'rgba(30, 41, 69, 0.92)',
      footerText: '#94A3B8'
    };
  }
  if (theme === 'peach' || theme === 'fresh') {
    return {
      bgGrad1: '#FFF1F2',
      bgGrad2: '#FFE4E6',
      bgGrad3: '#FFEDD5',
      orbA: 'rgba(251, 113, 133, 0.18)',
      orbB: 'rgba(16, 185, 129, 0.12)',
      cardBg: '#FFFCFA',
      cardBorder: '#FECDD3',
      cardShadow: 'rgba(136, 19, 55, 0.10)',
      topPillBg: '#FFE4E6',
      topPillText: '#E11D48',
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#78716C',
      textAccent: '#E11D48',
      bentoBg: '#FFF5F5',
      bentoBorder: '#FFE4E6',
      quoteBg1: '#FFF1F2',
      quoteBg2: '#FFEDD5',
      quoteBorder: '#FDBA74',
      quoteText: '#431407',
      footerPillBg: '#FFF1F2',
      footerText: '#9F1239'
    };
  }
  // Default: 'cream' / 'amber' — Bright Warm Polaroid Photocard
  return {
    bgGrad1: '#FFF7ED',
    bgGrad2: '#FDF2F8',
    bgGrad3: '#EEF2FF',
    orbA: 'rgba(249, 115, 22, 0.14)',
    orbB: 'rgba(99, 102, 241, 0.12)',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardShadow: 'rgba(15, 23, 42, 0.10)',
    topPillBg: '#FFF7ED',
    topPillText: '#EA580C',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textAccent: '#EA580C',
    bentoBg: '#F8FAFC',
    bentoBorder: '#E2E8F0',
    quoteBg1: '#FFF7ED',
    quoteBg2: '#FDF2F8',
    quoteBorder: '#FED7AA',
    quoteText: '#431407',
    footerPillBg: '#F1F5F9',
    footerText: '#64748B'
  };
}

/**
 * Dynamic-Height Zero-Clip Polaroid Bento Canvas Renderer for Food
 */
export async function renderStoryCanvas({
  mode = 'daily',
  lang = 'ko',
  items = [],
  name = '',
  dateText = '',
  siteUrl = SITE_ORIGIN,
  theme = 'cream',
  canvas = null,
  dailyData = null,
  selectedMealKeys = null
} = {}) {
  let targetCanvas = canvas;
  if (!targetCanvas) {
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      targetCanvas = document.createElement('canvas');
    } else {
      throw new Error('Canvas element required for renderStoryCanvas');
    }
  }

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return targetCanvas;

  await ensureFoodCanvasFonts();

  const width = 1080;
  const currentLang = normalizeLang(lang);
  const pal = getThemePalette(theme);

  let effectiveName = name || dailyData?.name || (currentLang === 'ko' ? '김서윤' : 'Chloe');
  let effectiveDate = dateText || dailyData?.date || '';
  let effectiveItems = items;

  if ((!effectiveItems || effectiveItems.length === 0) && dailyData?.orderedList) {
    const keys = Array.isArray(selectedMealKeys) && selectedMealKeys.length > 0
      ? selectedMealKeys
      : (mode === 'single' ? ['lunch'] : MEAL_KEYS);
    effectiveItems = dailyData.orderedList.filter(m => keys.includes(m.mealKey));
  }

  const cardX = 56;
  const cardW = width - cardX * 2; // 968
  const padX = 48;
  const innerX = cardX + padX;     // 104
  const innerW = cardW - padX * 2; // 872

  targetCanvas.width = width;
  targetCanvas.height = 1600;

  const isSingleCard = (mode === 'food' || mode === 'single' || effectiveItems.length <= 1);
  const brandTitle = t(currentLang, 'brandTitle') || (currentLang === 'ko' ? '오늘 뭐 먹지?' : 'What to Eat Today?');

  // =======================================================================
  // SINGLE DISH / GALLERY SHOWCASE POLAROID CARD (1 Dish)
  // =======================================================================
  if (isSingleCard) {
    const entry = effectiveItems[0] || {};
    const food = resolveLocalizedFoodForCanvas(entry.food || entry, currentLang);
    const imgCode = food.code || formatFoodCode(food.index || 1);
    const loadedImg = await loadFoodArtworkWithFallback(food);

    const origin = FOOD_ORIGIN_GROUPS[food.originGroup] || { badge: '🍲 추천 메뉴', color: pal.textAccent };
    const localizedOriginBadge = t(currentLang, 'origin_' + food.originGroup) || origin.badge || '🍲 Menu';
    const localizedMeal = entry.mealKey ? t(currentLang, 'meal_' + entry.mealKey) : '';
    const localizedMealFull = entry.mealKey ? t(currentLang, 'mealFull_' + entry.mealKey) : '';

    let catchphrase = '';
    if (mode === 'food') {
      catchphrase = currentLang === 'ko' ? `미식 일러스트 도감 · #${imgCode}` : `Food Showcase · #${imgCode}`;
    } else {
      catchphrase = t(currentLang, 'canvasSingleHeadline', { name: effectiveName, meal: localizedMeal });
    }

    const foodTitle = String(food.name || t(currentLang, 'canvasFallbackFood')).trim();
    let subTitle = '';
    if (currentLang === 'ko' && food.englishName) {
      subTitle = String(food.englishName).trim();
    }

    const calLabel = `🔥 ${currentLang === 'ko' ? '예상 열량' : 'Calories'}`;
    const calVal = String(food.calories || t(currentLang, 'canvasNutritionBalance')).replace(/^🔥\s*/, '').trim();

    const priceLabel = `💰 ${currentLang === 'ko' ? '예상 가격대' : 'Est. Price'}`;
    const formattedPrice = formatPriceForLang(food.priceRange, currentLang);
    const priceVal = String(formattedPrice || t(currentLang, 'canvasGreatPrice')).replace(/^💰\s*/, '').trim();

    const taglineQuote = food.tagline ? `“${String(food.tagline).trim()}”` : '';
    const pairingText = (currentLang === 'ko' && food.pairingTip) ? String(food.pairingTip).trim() : '';

    // Pre-measure all wrapped text blocks
    ctx.font = `700 34px ${FONT_STACK_DISPLAY}`;
    const catchLines = wrapCanvasLines(ctx, catchphrase, innerW - 20);
    const catchLineH = 46;

    const titleFontPx = Array.from(foodTitle).length > 26 ? 38 : 44;
    const titleLineH = titleFontPx === 38 ? 50 : 58;
    ctx.font = `800 ${titleFontPx}px ${FONT_STACK_DISPLAY}`;
    const titleLines = wrapCanvasLines(ctx, foodTitle, innerW - 16);

    ctx.font = `600 24px ${FONT_STACK_SANS}`;
    const subLines = subTitle ? wrapCanvasLines(ctx, subTitle, innerW - 24) : [];
    const subLineH = 34;

    const bentoGap = 20;
    const bentoColW = Math.floor((innerW - bentoGap) / 2);
    const bentoInnerW = bentoColW - 48;
    const bentoValLineH = 34;

    ctx.font = `700 24px ${FONT_STACK_DISPLAY}`;
    const calLines = wrapCanvasLines(ctx, calVal, bentoInnerW);
    const priceLines = wrapCanvasLines(ctx, priceVal, bentoInnerW);
    const maxSpecLines = Math.max(1, calLines.length, priceLines.length);
    const bentoBoxH = 24 + 28 + 12 + maxSpecLines * bentoValLineH + 22;

    ctx.font = `700 27px ${FONT_STACK_SANS}`;
    const quoteLines = taglineQuote ? wrapCanvasLines(ctx, taglineQuote, innerW - 64) : [];
    const quoteLineH = 40;
    const quoteBoxH = quoteLines.length > 0 ? (26 + quoteLines.length * quoteLineH + 26) : 0;

    ctx.font = `600 24px ${FONT_STACK_SANS}`;
    const tipLines = pairingText ? wrapCanvasLines(ctx, pairingText, innerW - 56) : [];
    const tipLineH = 36;
    const tipBoxH = tipLines.length > 0 ? (22 + 28 + 10 + tipLines.length * tipLineH + 22) : 0;

    const photoH = 720;
    const padTop = 46;
    const appPillH = 46;
    const footerPillH = 44;
    const padBottom = 42;

    const cardH =
      padTop +
      appPillH +
      20 +
      catchLines.length * catchLineH +
      26 +
      photoH +
      36 +
      titleLines.length * titleLineH +
      (subLines.length > 0 ? (10 + subLines.length * subLineH) : 0) +
      26 +
      bentoBoxH +
      (quoteBoxH > 0 ? (18 + quoteBoxH) : 0) +
      (tipBoxH > 0 ? (18 + tipBoxH) : 0) +
      28 +
      footerPillH +
      padBottom;

    const finalHeight = Math.max(1520, cardH + 112);
    targetCanvas.width = width;
    targetCanvas.height = finalHeight;
    const cardY = Math.round((finalHeight - cardH) / 2);

    // Draw Backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, width, finalHeight);
    bgGrad.addColorStop(0, pal.bgGrad1);
    bgGrad.addColorStop(0.5, pal.bgGrad2);
    bgGrad.addColorStop(1, pal.bgGrad3);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, finalHeight);

    if (typeof ctx.createRadialGradient === 'function') {
      const orb1 = ctx.createRadialGradient(180, 220, 20, 180, 220, 460);
      orb1.addColorStop(0, pal.orbA);
      orb1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, finalHeight);
    }

    // Polaroid Card Shadow + Fill
    ctx.save();
    ctx.shadowColor = pal.cardShadow;
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 18;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44, pal.cardBg);
    ctx.restore();
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44, null, pal.cardBorder, 2);

    let curY = cardY + padTop;

    // Top App Pill
    ctx.font = `700 22px ${FONT_STACK_DISPLAY}`;
    const appPillLabel = `🍽️ ${brandTitle}`;
    const appPillW = Math.min(innerW, Math.ceil(ctx.measureText(appPillLabel).width) + 52);
    drawRoundedRect(ctx, Math.round((width - appPillW) / 2), curY, appPillW, appPillH, 23, pal.topPillBg);
    ctx.fillStyle = pal.topPillText;
    ctx.textAlign = 'center';
    ctx.fillText(appPillLabel, width / 2, curY + 31);
    curY += appPillH + 20;

    // Catchphrase
    ctx.fillStyle = pal.textSecondary;
    ctx.font = `700 34px ${FONT_STACK_DISPLAY}`;
    ctx.textAlign = 'center';
    for (const line of catchLines) {
      ctx.fillText(line, width / 2, curY + 34);
      curY += catchLineH;
    }
    curY += 26;

    // Hero Food Photo
    const photoX = innerX;
    const photoY = curY;
    const photoW = innerW;
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 32, '#F1F5F9');

    if (loadedImg) {
      drawCoverImageInRoundedRect(ctx, loadedImg, photoX, photoY, photoW, photoH, 32);
    } else {
      drawFallbackFoodIllustration(ctx, photoX + (photoW - 560) / 2, photoY + 80, 560, entry.mealEmoji || '🍲', foodTitle, pal.textAccent);
    }
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 32, null, 'rgba(15, 23, 42, 0.08)', 2);

    // Floating Badges on Photo
    ctx.font = `700 21px ${FONT_STACK_DISPLAY}`;
    const leftPillText = localizedOriginBadge;
    const leftPillW = Math.min(photoW - 60, Math.ceil(ctx.measureText(leftPillText).width) + 40);
    drawRoundedRect(ctx, photoX + 22, photoY + 22, leftPillW, 46, 23, 'rgba(15, 23, 42, 0.76)', 'rgba(255,255,255,0.22)', 1.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(leftPillText, photoX + 22 + leftPillW / 2, photoY + 52);

    if (localizedMealFull) {
      const rightPillText = `${entry.mealEmoji || '🍽️'} ${localizedMealFull}`;
      const rightPillW = Math.ceil(ctx.measureText(rightPillText).width) + 36;
      if (leftPillW + rightPillW + 64 < photoW) {
        const rightPillX = photoX + photoW - 22 - rightPillW;
        drawRoundedRect(ctx, rightPillX, photoY + 22, rightPillW, 46, 23, 'rgba(15, 23, 42, 0.74)', 'rgba(255,255,255,0.22)', 1.5);
        ctx.fillStyle = '#FDBA74';
        ctx.fillText(rightPillText, rightPillX + rightPillW / 2, photoY + 52);
      }
    }

    curY += photoH + 36;

    // Food Title
    ctx.fillStyle = pal.textPrimary;
    ctx.font = `800 ${titleFontPx}px ${FONT_STACK_DISPLAY}`;
    ctx.textAlign = 'center';
    for (const line of titleLines) {
      ctx.fillText(line, width / 2, curY + titleFontPx);
      curY += titleLineH;
    }

    if (subLines.length > 0) {
      curY += 10;
      ctx.fillStyle = pal.textMuted;
      ctx.font = `600 24px ${FONT_STACK_SANS}`;
      for (const line of subLines) {
        ctx.fillText(line, width / 2, curY + 24);
        curY += subLineH;
      }
    }

    curY += 26;

    // 2 Side-by-Side Bento Stat Boxes
    const leftBoxX = innerX;
    const rightBoxX = innerX + bentoColW + bentoGap;
    drawRoundedRect(ctx, leftBoxX, curY, bentoColW, bentoBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);
    drawRoundedRect(ctx, rightBoxX, curY, bentoColW, bentoBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);

    ctx.textAlign = 'left';
    ctx.font = `700 20px ${FONT_STACK_SANS}`;
    ctx.fillStyle = pal.textMuted;
    ctx.fillText(calLabel, leftBoxX + 24, curY + 42);
    ctx.fillText(priceLabel, rightBoxX + 24, curY + 42);

    ctx.font = `700 24px ${FONT_STACK_DISPLAY}`;
    ctx.fillStyle = pal.textPrimary;
    let cY = curY + 80;
    for (const line of calLines) {
      ctx.fillText(line, leftBoxX + 24, cY);
      cY += bentoValLineH;
    }

    ctx.fillStyle = pal.textAccent;
    let pY = curY + 80;
    for (const line of priceLines) {
      ctx.fillText(line, rightBoxX + 24, pY);
      pY += bentoValLineH;
    }

    curY += bentoBoxH;

    // Quote Card
    if (quoteLines.length > 0) {
      curY += 18;
      const qGrad = ctx.createLinearGradient(innerX, curY, innerX + innerW, curY + quoteBoxH);
      qGrad.addColorStop(0, pal.quoteBg1);
      qGrad.addColorStop(1, pal.quoteBg2);
      drawRoundedRect(ctx, innerX, curY, innerW, quoteBoxH, 26, qGrad, pal.quoteBorder, 1.5);
      ctx.textAlign = 'center';
      ctx.font = `700 27px ${FONT_STACK_SANS}`;
      ctx.fillStyle = pal.quoteText;
      let qY = curY + 54;
      for (const line of quoteLines) {
        ctx.fillText(line, width / 2, qY);
        qY += quoteLineH;
      }
      curY += quoteBoxH;
    }

    // Pairing Tip Card (ko)
    if (tipLines.length > 0) {
      curY += 18;
      drawRoundedRect(ctx, innerX, curY, innerW, tipBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);
      ctx.textAlign = 'left';
      ctx.font = `700 20px ${FONT_STACK_SANS}`;
      ctx.fillStyle = pal.textAccent;
      ctx.fillText('💡 꿀조합 추천', innerX + 28, curY + 40);
      ctx.font = `600 24px ${FONT_STACK_SANS}`;
      ctx.fillStyle = pal.textSecondary;
      let tY = curY + 76;
      for (const line of tipLines) {
        ctx.fillText(line, innerX + 28, tY);
        tY += tipLineH;
      }
      curY += tipBoxH;
    }

    curY += 28;

    // Clean Domain Watermark Pill
    ctx.font = `700 21px ${FONT_STACK_DISPLAY}`;
    const wmW = Math.ceil(ctx.measureText(WATERMARK_DOMAIN).width) + 48;
    drawRoundedRect(ctx, Math.round((width - wmW) / 2), curY, wmW, footerPillH, 22, pal.footerPillBg);
    ctx.fillStyle = pal.footerText;
    ctx.textAlign = 'center';
    ctx.fillText(WATERMARK_DOMAIN, width / 2, curY + 29);

    return targetCanvas;
  }

  // =======================================================================
  // MULTI / 5-MEAL DAILY MENU BOARD POLAROID CARD (2 ~ 5 Meals, Zero Clip)
  // =======================================================================
  const mealEntries = effectiveItems.slice(0, 5);
  const loadedImgs = await Promise.all(mealEntries.map((e) => loadFoodArtworkWithFallback(e.food || e)));

  const headline = mealEntries.length >= 5
    ? t(currentLang, 'canvasDailyHeadline', { name: effectiveName })
    : t(currentLang, 'canvasMultiHeadline', { name: effectiveName, count: mealEntries.length });

  ctx.font = `800 38px ${FONT_STACK_DISPLAY}`;
  const headLines = wrapCanvasLines(ctx, headline, innerW - 16);
  const headLineH = 50;

  // Pre-measure every meal row so long dish names never clip
  const thumbSize = 180;
  const rowTextW = innerW - 24 - thumbSize - 28 - 28; // right column text width
  let totalCalories = 0;

  const measuredRows = mealEntries.map((entry, idx) => {
    const food = resolveLocalizedFoodForCanvas(entry.food || entry, currentLang);
    const foodTitle = String(food.name || t(currentLang, 'canvasFallbackFood')).trim();
    const localizedMeal = entry.mealKey ? t(currentLang, 'meal_' + entry.mealKey) : '';
    const originBadge = t(currentLang, 'origin_' + food.originGroup) || '';

    if (food.calories) {
      const m = String(food.calories).match(/(\d+)/);
      if (m) totalCalories += parseInt(m[1], 10);
    }

    ctx.font = `800 29px ${FONT_STACK_DISPLAY}`;
    const fTitleLines = wrapCanvasLines(ctx, foodTitle, rowTextW);
    const fTitleLineH = 38;

    const metaParts = [
      food.calories ? `🔥 ${food.calories}` : '',
      food.priceRange ? `💰 ${formatPriceForLang(food.priceRange, currentLang)}` : ''
    ].filter(Boolean).join('  ·  ');

    ctx.font = `600 22px ${FONT_STACK_SANS}`;
    const tagLines = food.tagline ? wrapCanvasLines(ctx, food.tagline, rowTextW) : [];
    const tagLineH = 31;

    const textBlockH = 34 + 10 + fTitleLines.length * fTitleLineH + (metaParts ? 34 : 0) + (tagLines.length > 0 ? (8 + tagLines.length * tagLineH) : 0);
    const rowH = Math.max(thumbSize + 36, textBlockH + 40);

    return {
      entry,
      food,
      img: loadedImgs[idx],
      localizedMeal,
      originBadge,
      fTitleLines,
      fTitleLineH,
      metaParts,
      tagLines,
      tagLineH,
      rowH
    };
  });

  const rowsGap = 16;
  const totalRowsH = measuredRows.reduce((acc, r) => acc + r.rowH, 0) + Math.max(0, measuredRows.length - 1) * rowsGap;
  const calBannerH = totalCalories > 0 ? 54 : 0;
  const padTop = 46;
  const appPillH = 46;
  const footerPillH = 44;
  const padBottom = 42;

  const cardH =
    padTop +
    appPillH +
    18 +
    headLines.length * headLineH +
    (effectiveDate ? 40 : 0) +
    26 +
    totalRowsH +
    (calBannerH > 0 ? (22 + calBannerH) : 0) +
    26 +
    footerPillH +
    padBottom;

  const finalHeight = Math.max(1560, cardH + 112);
  targetCanvas.width = width;
  targetCanvas.height = finalHeight;
  const cardY = Math.round((finalHeight - cardH) / 2);

  // Backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, width, finalHeight);
  bgGrad.addColorStop(0, pal.bgGrad1);
  bgGrad.addColorStop(0.5, pal.bgGrad2);
  bgGrad.addColorStop(1, pal.bgGrad3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, finalHeight);

  // Polaroid Card
  ctx.save();
  ctx.shadowColor = pal.cardShadow;
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 18;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44, pal.cardBg);
  ctx.restore();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44, null, pal.cardBorder, 2);

  let curY = cardY + padTop;

  // App Pill
  ctx.font = `700 22px ${FONT_STACK_DISPLAY}`;
  const appPillLabel = `🍽️ ${brandTitle}`;
  const appPillW = Math.min(innerW, Math.ceil(ctx.measureText(appPillLabel).width) + 52);
  drawRoundedRect(ctx, Math.round((width - appPillW) / 2), curY, appPillW, appPillH, 23, pal.topPillBg);
  ctx.fillStyle = pal.topPillText;
  ctx.textAlign = 'center';
  ctx.fillText(appPillLabel, width / 2, curY + 31);
  curY += appPillH + 18;

  // Headline
  ctx.fillStyle = pal.textPrimary;
  ctx.font = `800 38px ${FONT_STACK_DISPLAY}`;
  ctx.textAlign = 'center';
  for (const line of headLines) {
    ctx.fillText(line, width / 2, curY + 38);
    curY += headLineH;
  }

  if (effectiveDate) {
    ctx.fillStyle = pal.textMuted;
    ctx.font = `600 23px ${FONT_STACK_SANS}`;
    ctx.fillText(`📅 ${effectiveDate}`, width / 2, curY + 30);
    curY += 40;
  }

  curY += 26;

  // Meal Bento Rows
  for (let i = 0; i < measuredRows.length; i++) {
    const r = measuredRows[i];
    drawRoundedRect(ctx, innerX, curY, innerW, r.rowH, 28, pal.bentoBg, pal.bentoBorder, 1.5);

    const thumbX = innerX + 20;
    const thumbY = curY + Math.round((r.rowH - thumbSize) / 2);
    drawRoundedRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 22, '#E2E8F0');
    if (r.img) {
      drawCoverImageInRoundedRect(ctx, r.img, thumbX, thumbY, thumbSize, thumbSize, 22);
    } else {
      drawFallbackFoodIllustration(ctx, thumbX, thumbY, thumbSize, r.entry.mealEmoji || '🍽️', r.food.name || '', pal.textAccent);
    }

    const tx = thumbX + thumbSize + 26;
    let ty = curY + 42;

    ctx.textAlign = 'left';
    ctx.font = `700 21px ${FONT_STACK_DISPLAY}`;
    ctx.fillStyle = pal.textAccent;
    const mealHeader = [
      `${r.entry.mealEmoji || '🍽️'} ${r.localizedMeal}`,
      r.originBadge
    ].filter(Boolean).join('  ·  ');
    ctx.fillText(mealHeader, tx, ty);
    ty += 38;

    ctx.font = `800 29px ${FONT_STACK_DISPLAY}`;
    ctx.fillStyle = pal.textPrimary;
    for (const fl of r.fTitleLines) {
      ctx.fillText(fl, tx, ty);
      ty += r.fTitleLineH;
    }

    if (r.metaParts) {
      ctx.font = `700 21px ${FONT_STACK_SANS}`;
      ctx.fillStyle = pal.textSecondary;
      ctx.fillText(r.metaParts, tx, ty - 2);
      ty += 32;
    }

    if (r.tagLines.length > 0) {
      ctx.font = `600 21px ${FONT_STACK_SANS}`;
      ctx.fillStyle = pal.textMuted;
      for (const tl of r.tagLines) {
        ctx.fillText(tl, tx, ty);
        ty += r.tagLineH;
      }
    }

    curY += r.rowH + rowsGap;
  }

  curY -= rowsGap;

  if (calBannerH > 0) {
    curY += 22;
    const calSummary = t(currentLang, 'canvasCalTotal', { calories: totalCalories.toLocaleString() });
    drawRoundedRect(ctx, innerX, curY, innerW, calBannerH, 27, pal.topPillBg);
    ctx.textAlign = 'center';
    ctx.font = `700 23px ${FONT_STACK_DISPLAY}`;
    ctx.fillStyle = pal.topPillText;
    ctx.fillText(calSummary, width / 2, curY + 35);
    curY += calBannerH;
  }

  curY += 26;

  // Clean Domain Watermark Pill
  ctx.font = `700 21px ${FONT_STACK_DISPLAY}`;
  const wmW = Math.ceil(ctx.measureText(WATERMARK_DOMAIN).width) + 48;
  drawRoundedRect(ctx, Math.round((width - wmW) / 2), curY, wmW, footerPillH, 22, pal.footerPillBg);
  ctx.fillStyle = pal.footerText;
  ctx.textAlign = 'center';
  ctx.fillText(WATERMARK_DOMAIN, width / 2, curY + 29);

  return targetCanvas;
}

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas) return reject(new Error('Canvas is required'));
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    } else if (typeof canvas.toDataURL === 'function') {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const commaIndex = dataUrl.indexOf(',');
        const b64Data = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
        const binStr = (typeof atob === 'function') ? atob(b64Data) : Buffer.from(b64Data, 'base64').toString('binary');
        const len = binStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
        resolve(new Blob([bytes], { type: 'image/png' }));
      } catch (err) {
        reject(err);
      }
    } else {
      reject(new Error('Neither toBlob nor toDataURL is available on canvas'));
    }
  });
}

export function downloadImage(blob, filename = 'mukbang-share.png') {
  if (!blob) return false;
  if (typeof document === 'undefined' || typeof window === 'undefined') return true;

  try {
    const createUrl = window.URL?.createObjectURL || window.webkitURL?.createObjectURL;
    const revokeUrl = window.URL?.revokeObjectURL || window.webkitURL?.revokeObjectURL;

    if (createUrl) {
      const url = createUrl(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        if (revokeUrl) revokeUrl(url);
      }, 1500);
      return true;
    }
  } catch (err) {
    console.error('downloadImage error:', err);
  }
  return false;
}

function shouldUseMobileShareSheet() {
  if (typeof window === 'undefined') return true; // allow Node unit test mocks
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  if (navigator.maxTouchPoints > 1 && window.innerWidth < 1024) return true;
  return false;
}

export async function shareImage({
  blob,
  filename = 'mukbang-share.png',
  title = '',
  text = '',
  url = '',
  lang = 'ko'
} = {}) {
  const currentLang = normalizeLang(lang);

  if (
    shouldUseMobileShareSheet() &&
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function' &&
    typeof File !== 'undefined' &&
    blob
  ) {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title || t(currentLang, 'modalTitle'),
          text: text || t(currentLang, 'kakaoCta'),
          url: url || undefined
        });
        showToast(t(currentLang, 'toastStoryShared'));
        return { success: true, method: 'share' };
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        return { success: false, method: 'share', aborted: true };
      }
    }
  }

  downloadImage(blob, filename);
  showToast(getFallbackSaveToast(currentLang));
  return { success: true, method: 'download' };
}

export async function shareKakaoText({
  title = '',
  text = '',
  url = '',
  lang = 'ko'
} = {}) {
  const currentLang = normalizeLang(lang);

  if (shouldUseMobileShareSheet() && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url: url || undefined
      });
      showToast(t(currentLang, 'toastKakaoSuccess'));
      return { success: true, method: 'share' };
    } catch (err) {
      if (err?.name === 'AbortError') {
        return { success: false, method: 'share', aborted: true };
      }
    }
  }

  const fullText = [title, text, url].filter(Boolean).join('\n\n');
  const copied = await copyToClipboard(fullText, t(currentLang, 'toastKakaoCopied'));
  return { success: copied, method: 'clipboard' };
}

export async function shareWhatsAppText({
  title = '',
  text = '',
  url = '',
  lang = 'ko'
} = {}) {
  const currentLang = normalizeLang(lang);
  const fullText = [title, text, url].filter(Boolean).join('\n\n');
  const waUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast(t(currentLang, 'toastWhatsAppSuccess'));
    return { success: true, method: 'whatsapp' };
  }

  const copied = await copyToClipboard(fullText, t(currentLang, 'toastWhatsAppSuccess'));
  return { success: copied, method: 'clipboard' };
}
