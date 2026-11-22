// web/js/share_core.js — Core Sharing & Instagram Story (1080×1920) Engine for Mukbang
// Supports:
// - mode: 'daily'  -> 5-meal daily board with user name, date, calories, badges
// - mode: 'single' -> 1 selected meal card with user name & meal slot
// - mode: 'food'   -> Special single food enlarged card (1080-wide prominent illustration, origin, category, tagline)
// - mode: 'multi'  -> 2~4 selected meals card
// Multilingual support (14 languages) & Web Share API Level 2 (files) with PNG download fallback

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

/**
 * 14-Language Fallback Toast Notifications for Download Fallback
 */
export const FALLBACK_SAVE_TOASTS = {
  ko: '이미지를 저장했습니다. 인스타그램 스토리나 카카오톡에서 불러와 공유해보세요.',
  en: 'Image saved. Open Instagram Stories or KakaoTalk to share it.',
  hi: 'छवि सहेजी गई। साझा करने के लिए इसे इंस्टाग्राम स्टोरी या काकाओटॉक में आयात करें।',
  vi: 'Đã lưu hình ảnh. Hãy tải lên Instagram Story hoặc KakaoTalk để chia sẻ.',
  fr: 'Image enregistrée. Importez-la dans vos Stories Instagram ou KakaoTalk pour la partager.',
  pt: 'Imagem salva. Importe no Instagram Stories ou KakaoTalk para compartilhar.',
  es: 'Imagen guardada. Impórtala en Instagram Stories o KakaoTalk para compartir.',
  id: 'Gambar berhasil disimpan. Buka di Instagram Stories atau KakaoTalk untuk membagikannya.',
  ru: 'Изображение сохранено. Загрузите его в Instagram Stories или KakaoTalk, чтобы поделиться.',
  de: 'Bild gespeichert. In Instagram Stories oder KakaoTalk importieren, um es zu teilen.',
  it: 'Immagine salvata. Importala nelle Storie di Instagram o su KakaoTalk per condividerla.',
  ja: '画像を保存しました。インスタストーリーやKakaoTalkから読み込んで共有してみてください。',
  zh: '图片已保存。可导入至Instagram快拍或KakaoTalk中进行分享。',
  ms: 'Imej berjaya disimpan. Muat naik ke Instagram Stories atau KakaoTalk untuk berkongsi.'
};

export function getFallbackSaveToast(lang = 'ko') {
  const norm = normalizeLang(lang);
  return FALLBACK_SAVE_TOASTS[norm] || FALLBACK_SAVE_TOASTS.ko;
}

/**
 * Format priceRange cleanly for the active language (avoiding Korean "원" in non-ko)
 */
export function formatPriceForLang(priceRange, lang = 'ko') {
  if (!priceRange) return '';
  const norm = normalizeLang(lang);
  const str = String(priceRange).trim();
  if (norm === 'ko') return str;
  if (/원/.test(str)) {
    const cleaned = str.replace(/원/g, '').trim();
    return cleaned.startsWith('₩') ? cleaned : `₩${cleaned}`;
  }
  return str;
}

/**
 * Load food artwork with PNG -> WebP fallback
 */
async function loadFoodArtworkWithFallback(food) {
  const imgCode = food?.code || formatFoodCode(food?.index || 1);
  let img = await loadArtworkImage(`/images/${imgCode}.png`);
  if (!img) {
    img = await loadArtworkImage(`/images/web/${imgCode}.webp`);
  }
  return img;
}

/**
 * Draw image with cover-fit (center crop) inside rounded rectangle
 */
function drawCoverImageInRoundedRect(ctx, img, x, y, w, h, radius) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  const imgRatio = img.width / Math.max(1, img.height);
  const boxRatio = w / Math.max(1, h);
  let drawW = w;
  let drawH = h;
  let drawX = x;
  let drawY = y;

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

/**
 * Draw a photo-first meal tile with minimal bottom gradient caption
 */
function drawPhotoMealTile(ctx, { x, y, w, h, radius = 24, img, entry, food, currentLang, palette }) {
  drawRoundedRect(ctx, x, y, w, h, radius, palette.cardBg, 'rgba(255, 255, 255, 0.16)', 2);

  if (img) {
    drawCoverImageInRoundedRect(ctx, img, x + 3, y + 3, w - 6, h - 6, Math.max(8, radius - 2));
  } else {
    drawFallbackFoodIllustration(
      ctx,
      x + (w - Math.min(w, h) * 0.72) / 2,
      y + 20,
      Math.min(w, h) * 0.72,
      entry.mealEmoji || '🍽',
      food.name || t(currentLang, 'canvasFallbackFood'),
      entry.themeColor || palette.textAccent
    );
  }

  // Subtle bottom gradient scrim so photo remains 80%+ unobstructed
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x + 3, y + 3, w - 6, h - 6, Math.max(8, radius - 2));
  } else {
    ctx.rect(x + 3, y + 3, w - 6, h - 6);
  }
  ctx.clip();

  const scrimH = Math.min(130, Math.round(h * 0.34));
  const scrimY = y + h - scrimH;
  const scrim = ctx.createLinearGradient(0, scrimY, 0, y + h);
  scrim.addColorStop(0, 'rgba(0, 0, 0, 0)');
  scrim.addColorStop(0.55, 'rgba(0, 0, 0, 0.62)');
  scrim.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
  ctx.fillStyle = scrim;
  ctx.fillRect(x, scrimY, w, scrimH);

  const localizedMeal = entry.mealKey ? t(currentLang, 'meal_' + entry.mealKey) : '';
  const padX = 22;

  ctx.textAlign = 'left';
  ctx.fillStyle = entry.themeColor || palette.textAccent;
  ctx.font = `bold 24px ${FONT_STACK_SANS}`;
  if (localizedMeal) {
    ctx.fillText(`${entry.mealEmoji || '🍽'} ${localizedMeal}`, x + padX, y + h - 56);
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 30px ${FONT_STACK_SERIF}`;
  const foodName = String(food.name || t(currentLang, 'canvasFallbackFood'));
  // Truncate cleanly if too wide for tile
  let displayTitle = foodName;
  while (ctx.measureText(displayTitle).width > w - padX * 2 && displayTitle.length > 4) {
    displayTitle = displayTitle.slice(0, -2) + '…';
  }
  ctx.fillText(displayTitle, x + padX, y + h - 20);
  ctx.restore();
}

/**
 * Multilingual font families with safe fallbacks across 14 target languages
 */
export const FONT_STACK_SANS = 'Pretendard, "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", "Noto Sans Devanagari", sans-serif';
export const FONT_STACK_SERIF = '"Noto Serif KR", Georgia, serif, Pretendard, "Noto Sans JP", "Noto Sans SC", "Noto Sans Devanagari", sans-serif';

/**
 * Toast Notification Utility
 */
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

/**
 * Clipboard Copy with Fallback
 */
export async function copyToClipboard(text, successMessage = null) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      if (successMessage) showToast(`🔗 ${successMessage}`);
      return true;
    } catch (_) {}
  }

  // Fallback for older browsers
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

/**
 * Helper: Draw rounded rectangle on canvas
 */
export function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle = null, strokeStyle = null, lineWidth = 1) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
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
 * Helper: Multi-line wrapped text
 */
export function renderWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  if (!text) return y;
  const chars = Array.from(String(text));
  let line = '';
  let lineCount = 0;
  let currentY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(line.slice(0, Math.max(0, line.length - 2)) + '...', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/**
 * Asynchronously load food artwork image or return null on error/timeout
 */
export function loadArtworkImage(src) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 3500);
  });
}

/**
 * Fallback vector illustration for foods when image asset fails to load
 */
export function drawFallbackFoodIllustration(ctx, x, y, size, emoji = '🍲', foodName = '맛있는 음식', themeColor = '#FF9F43') {
  ctx.save();
  const grad = ctx.createRadialGradient(x + size / 2, y + size / 2, size * 0.1, x + size / 2, y + size / 2, size * 0.5);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${Math.floor(size * 0.34)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x + size / 2, y + size / 2 - 10);

  ctx.font = `bold 24px ${FONT_STACK_SANS}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(String(foodName || '').slice(0, 10), x + size / 2, y + size / 2 + size * 0.24);

  ctx.restore();
}

/**
 * Theme palette generator
 */
export function getThemePalette(theme = 'amber') {
  if (theme === 'dark') {
    return {
      bgGrad1: '#0A0C11',
      bgGrad2: '#161A24',
      cardBg: 'rgba(24, 28, 38, 0.92)',
      textPrimary: '#FFFFFF',
      textSecondary: '#B0B8C4',
      textAccent: '#D4AF37', // Gold
      cardBorder: 'rgba(212, 175, 55, 0.4)'
    };
  }
  if (theme === 'fresh') {
    return {
      bgGrad1: '#06130D',
      bgGrad2: '#11291E',
      cardBg: 'rgba(16, 40, 30, 0.92)',
      textPrimary: '#FFFFFF',
      textSecondary: '#C5E7D7',
      textAccent: '#10AC84', // Green
      cardBorder: 'rgba(16, 172, 132, 0.4)'
    };
  }
  // Amber foodie default
  return {
    bgGrad1: '#140E0A',
    bgGrad2: '#28170D',
    cardBg: 'rgba(38, 24, 16, 0.92)',
    textPrimary: '#FFF8F0',
    textSecondary: '#DFC7B4',
    textAccent: '#FFA94D', // Amber
    cardBorder: 'rgba(255, 169, 77, 0.4)'
  };
}

/**
 * 9:16 High-Resolution Instagram Story Canvas Renderer (1080 × 1920)
 *
 * @param {Object} options
 * @param {string} options.mode - 'daily' | 'single' | 'food' | 'multi'
 * @param {string} options.lang - 2-letter language code (ko, en, ja, etc.)
 * @param {Array} options.items - Array of food/meal items
 * @param {string} options.name - User name (for daily / single)
 * @param {string} options.dateText - Formatted date string
 * @param {string} options.siteUrl - Canonical URL
 * @param {string} options.theme - 'amber' | 'dark' | 'fresh'
 * @param {HTMLCanvasElement} [options.canvas] - Target canvas (created if missing)
 * @param {Object} [options.dailyData] - Backwards compatibility with share.js
 * @param {Array} [options.selectedMealKeys] - Backwards compatibility
 */
export async function renderStoryCanvas({
  mode = 'daily',
  lang = 'ko',
  items = [],
  name = '',
  dateText = '',
  siteUrl = SITE_ORIGIN,
  theme = 'amber',
  canvas = null,
  dailyData = null,
  selectedMealKeys = null
} = {}) {
  // Resolve canvas
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

  const width = 1080;
  const height = 1920;
  targetCanvas.width = width;
  targetCanvas.height = height;

  const currentLang = normalizeLang(lang);
  const palette = getThemePalette(theme);

  // Normalize inputs from dailyData if provided
  let effectiveName = name || dailyData?.name || '김서윤';
  let effectiveDate = dateText || dailyData?.date || '';
  let effectiveItems = items;

  if ((!effectiveItems || effectiveItems.length === 0) && dailyData?.orderedList) {
    const keys = Array.isArray(selectedMealKeys) && selectedMealKeys.length > 0
      ? selectedMealKeys
      : (mode === 'single' ? ['lunch'] : MEAL_KEYS);
    effectiveItems = dailyData.orderedList.filter(m => keys.includes(m.mealKey));
  }

  // 1. Draw Main Background Gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, palette.bgGrad1);
  bg.addColorStop(0.5, palette.bgGrad2);
  bg.addColorStop(1, palette.bgGrad1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial glow
  const glow = ctx.createRadialGradient(width / 2, 420, 50, width / 2, 420, 720);
  glow.addColorStop(0, 'rgba(255, 107, 107, 0.15)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Outer border frame
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 36, null, 'rgba(255, 255, 255, 0.1)', 2);

  // 2. Render Header (Y: 90 ~ 210)
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.textAccent;
  ctx.font = `bold 28px ${FONT_STACK_SANS}`;
  ctx.letterSpacing = '2px';
  ctx.fillText(t(currentLang, 'canvasBrand'), width / 2, 120);

  ctx.fillStyle = palette.textSecondary;
  ctx.font = `500 26px ${FONT_STACK_SANS}`;
  if (mode === 'food') {
    const item0 = effectiveItems[0] || {};
    const code = item0.code || formatFoodCode(item0.index || 1);
    ctx.fillText(`ILLUSTRATION GALLERY · #${code}`, width / 2, 165);
  } else {
    ctx.fillText(t(currentLang, 'canvasSub', { date: effectiveDate }), width / 2, 165);
  }

  // Thin separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 205);
  ctx.lineTo(width - 120, 205);
  ctx.stroke();

  // =========================================================================
  // MODE: 'food' — Special Single Food Enlarged Illustration Card (#14)
  // Prominent 1080-wide card with large artwork, origin badge, tagline, specs
  // =========================================================================
  if (mode === 'food') {
    const rawItem = effectiveItems[0] || {};
    const food = rawItem.food || rawItem;
    const origin = FOOD_ORIGIN_GROUPS[food.originGroup] || { badge: '🍲 추천 메뉴', color: palette.textAccent };
    const localizedOriginBadge = t(currentLang, 'origin_' + food.originGroup) || origin.badge || '🍲 추천 메뉴';

    // Origin Badge & Delivery Category Badge (Y: 230 ~ 285)
    ctx.font = `bold 26px ${FONT_STACK_SANS}`;
    const originText = localizedOriginBadge;
    const originW = ctx.measureText(originText).width + 40;
    const badgeY = 240;
    const badgeH = 50;

    let totalBadgesW = originW;
    let deliveryText = food.deliveryCategory ? `📦 ${food.deliveryCategory.replace(/_/g, ' ')}` : null;
    let deliveryW = 0;
    if (deliveryText) {
      deliveryW = ctx.measureText(deliveryText).width + 36;
      totalBadgesW += deliveryW + 16;
    }

    const startBadgeX = (width - totalBadgesW) / 2;
    drawRoundedRect(ctx, startBadgeX, badgeY, originW, badgeH, 25, 'rgba(15, 17, 23, 0.88)', origin.color || palette.textAccent, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(originText, startBadgeX + originW / 2, badgeY + 34);

    if (deliveryText) {
      drawRoundedRect(ctx, startBadgeX + originW + 16, badgeY, deliveryW, badgeH, 25, 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.25)', 1.5);
      ctx.fillStyle = palette.textSecondary;
      ctx.fillText(deliveryText, startBadgeX + originW + 16 + deliveryW / 2, badgeY + 34);
    }

    // Prominent Large Food Illustration Card (X: 60, Y: 320, W: 960, H: 860)
    const cardX = 60;
    const cardY = 320;
    const cardW = 960;
    const cardH = 860;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32, palette.cardBg, palette.cardBorder, 2.5);

    // Load Food Image (원본 고해상도 PNG 우선, 폴백으로 webp)
    const imgCode = food.code || formatFoodCode(food.index || 1);
    const pngUrl = `/images/${imgCode}.png`;
    const webpUrl = `/images/web/${imgCode}.webp`;
    let loadedImg = await loadArtworkImage(pngUrl);
    if (!loadedImg) {
      loadedImg = await loadArtworkImage(webpUrl);
    }

    if (loadedImg) {
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(cardX + 24, cardY + 24, cardW - 48, cardH - 48, 24);
      } else {
        ctx.rect(cardX + 24, cardY + 24, cardW - 48, cardH - 48);
      }
      ctx.clip();
      ctx.drawImage(loadedImg, cardX + 24, cardY + 24, cardW - 48, cardH - 48);
      ctx.restore();
    } else {
      drawFallbackFoodIllustration(
        ctx,
        cardX + 80,
        cardY + 50,
        cardW - 160,
        food.emoji || '🍲',
        food.name || t(currentLang, 'canvasFallbackFood'),
        palette.textAccent
      );
    }

    // Food Title Area (Y: 1220 ~ 1380)
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textPrimary;
    ctx.font = `900 52px ${FONT_STACK_SERIF}`;
    const displayName = food.name || t(currentLang, 'canvasFallbackFood');
    ctx.fillText(displayName, width / 2, 1250);

    // English or Original Korean Subtitle
    let subTitle = '';
    if (currentLang !== 'en' && food.englishName) {
      subTitle = food.englishName;
    } else if (currentLang !== 'ko' && food.rawName && food.rawName !== food.name) {
      subTitle = food.rawName;
    }
    if (subTitle) {
      ctx.fillStyle = palette.textSecondary;
      ctx.font = `500 28px ${FONT_STACK_SANS}`;
      ctx.fillText(subTitle, width / 2, 1300);
    }

    // Calories & Price Range Pills (Y: 1335 ~ 1390)
    const calText = food.calories ? `🔥 ${food.calories}` : t(currentLang, 'canvasNutritionBalance');
    const formattedPrice = formatPriceForLang(food.priceRange, currentLang);
    const priceText = formattedPrice ? `💰 ${formattedPrice}` : t(currentLang, 'canvasGreatPrice');
    ctx.font = `bold 24px ${FONT_STACK_SANS}`;
    const calW = ctx.measureText(calText).width + 36;
    const priceW = ctx.measureText(priceText).width + 36;
    const pillsW = calW + priceW + 16;
    const startPillX = (width - pillsW) / 2;
    const pillY = subTitle ? 1335 : 1300;

    drawRoundedRect(ctx, startPillX, pillY, calW, 44, 22, 'rgba(255, 255, 255, 0.08)', 'rgba(255, 169, 77, 0.4)', 1.5);
    ctx.fillStyle = palette.textAccent;
    ctx.fillText(calText, startPillX + calW / 2, pillY + 30);

    drawRoundedRect(ctx, startPillX + calW + 16, pillY, priceW, 44, 22, 'rgba(255, 255, 255, 0.08)', 'rgba(84, 160, 255, 0.4)', 1.5);
    ctx.fillStyle = '#54A0FF';
    ctx.fillText(priceText, startPillX + calW + 16 + priceW / 2, pillY + 30);

    // Tagline Box (Y: 1410 ~ 1560)
    if (food.tagline) {
      const boxW = 960;
      const boxX = (width - boxW) / 2;
      const boxY = pillY + 65;
      drawRoundedRect(ctx, boxX, boxY, boxW, 120, 20, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.12)', 1);
      ctx.fillStyle = '#FFEAA7';
      ctx.font = `bold 28px ${FONT_STACK_SANS}`;
      renderWrappedText(ctx, `"${food.tagline}"`, width / 2, boxY + 52, 880, 40, 2);
    }

    // Pairing tip (ko only) or Meal tags
    if (food.pairingTip && currentLang === 'ko') {
      const tipW = 960;
      const tipX = (width - tipW) / 2;
      drawRoundedRect(ctx, tipX, 1620, tipW, 90, 16, 'rgba(0, 0, 0, 0.35)', 'rgba(255, 255, 255, 0.08)', 1);
      ctx.fillStyle = palette.textSecondary;
      ctx.font = `500 24px ${FONT_STACK_SANS}`;
      ctx.fillText(`꿀조합 팁: ${food.pairingTip}`, width / 2, 1675);
    }

  // =========================================================================
  // MODE: 'single' — Personalized Single Meal Showcase
  // =========================================================================
  } else if (mode === 'single' || effectiveItems.length === 1) {
    const entry = effectiveItems[0] || {};
    const food = entry.food || entry;
    const origin = FOOD_ORIGIN_GROUPS[food.originGroup] || { badge: '🍲 추천 메뉴', color: palette.textAccent };
    const localizedMeal = entry.mealKey ? t(currentLang, 'meal_' + entry.mealKey) : '';
    const localizedMealFull = entry.mealKey ? t(currentLang, 'mealFull_' + entry.mealKey) : '';
    const localizedOriginBadge = t(currentLang, 'origin_' + food.originGroup) || origin.badge;

    // Headline
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textPrimary;
    ctx.font = `bold 44px ${FONT_STACK_SERIF}`;
    ctx.fillText(t(currentLang, 'canvasSingleHeadline', { name: effectiveName, meal: localizedMeal }), width / 2, 280);

    // Meal Time Badge
    if (localizedMealFull) {
      const mealBadgeText = `${entry.mealEmoji || '🍽'} ${localizedMealFull} · ${entry.timeRangeText || ''}`;
      ctx.font = `bold 26px ${FONT_STACK_SANS}`;
      const badgeW = ctx.measureText(mealBadgeText).width + 48;
      drawRoundedRect(ctx, (width - badgeW) / 2, 320, badgeW, 46, 23, 'rgba(255, 255, 255, 0.08)', entry.themeColor || palette.textAccent, 1.5);
      ctx.fillStyle = entry.themeColor || palette.textAccent;
      ctx.fillText(mealBadgeText, width / 2, 352);
    }

    // Large Food Illustration Card (Y: 410 ~ 1110)
    const cardX = 130;
    const cardY = 410;
    const cardW = 820;
    const cardH = 700;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28, palette.cardBg, palette.cardBorder, 2);

    const imgCode = food.code || formatFoodCode(food.index || 1);
    const loadedImg = await loadArtworkImage(`/images/${imgCode}.png`);

    if (loadedImg) {
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(cardX + 20, cardY + 20, cardW - 40, cardH - 40, 20);
      } else {
        ctx.rect(cardX + 20, cardY + 20, cardW - 40, cardH - 40);
      }
      ctx.clip();
      ctx.drawImage(loadedImg, cardX + 20, cardY + 20, cardW - 40, cardH - 40);
      ctx.restore();
    } else {
      drawFallbackFoodIllustration(ctx, cardX + 60, cardY + 30, cardW - 120, entry.mealEmoji || '🍲', food.name || t(currentLang, 'canvasFallbackFood'), entry.themeColor || palette.textAccent);
    }

    // Origin Badge Float
    ctx.font = `bold 26px ${FONT_STACK_SANS}`;
    const originBadgeText = localizedOriginBadge || '🍲 추천 메뉴';
    const originW = ctx.measureText(originBadgeText).width + 36;
    drawRoundedRect(ctx, cardX + 30, cardY + 30, originW, 48, 24, 'rgba(15, 17, 23, 0.88)', origin.color || palette.textAccent, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(originBadgeText, cardX + 48, cardY + 63);

    // Food Title & Info Area
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textPrimary;
    ctx.font = `900 52px ${FONT_STACK_SERIF}`;
    ctx.fillText(food.name || t(currentLang, 'canvasFallbackFood'), width / 2, 1190);

    if (food.englishName && currentLang !== 'en') {
      ctx.fillStyle = palette.textSecondary;
      ctx.font = `500 28px ${FONT_STACK_SANS}`;
      ctx.fillText(food.englishName, width / 2, 1240);
    }

    // Calories & Price Pills
    const calText = food.calories ? `🔥 ${food.calories}` : t(currentLang, 'canvasNutritionBalance');
    const formattedPrice = formatPriceForLang(food.priceRange, currentLang);
    const priceText = formattedPrice ? `💰 ${formattedPrice}` : t(currentLang, 'canvasGreatPrice');
    ctx.font = `bold 24px ${FONT_STACK_SANS}`;
    const calW = ctx.measureText(calText).width + 32;
    const priceW = ctx.measureText(priceText).width + 32;
    const totalPillsW = calW + priceW + 16;
    const startPillX = (width - totalPillsW) / 2;

    drawRoundedRect(ctx, startPillX, 1275, calW, 42, 21, 'rgba(255, 255, 255, 0.08)', 'rgba(255, 169, 77, 0.4)', 1);
    ctx.fillStyle = palette.textAccent;
    ctx.fillText(calText, startPillX + calW / 2, 1304);

    drawRoundedRect(ctx, startPillX + calW + 16, 1275, priceW, 42, 21, 'rgba(255, 255, 255, 0.08)', 'rgba(84, 160, 255, 0.4)', 1);
    ctx.fillStyle = '#54A0FF';
    ctx.fillText(priceText, startPillX + calW + 16 + priceW / 2, 1304);

    // Tagline Box
    if (food.tagline) {
      const boxW = 820;
      const boxX = (width - boxW) / 2;
      drawRoundedRect(ctx, boxX, 1345, boxW, 110, 18, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)', 1);
      ctx.fillStyle = '#FFEAA7';
      ctx.font = `bold 28px ${FONT_STACK_SANS}`;
      renderWrappedText(ctx, `"${food.tagline}"`, width / 2, 1395, 760, 38, 2);
    }

    // Pairing Tip Box (ko only)
    if (food.pairingTip && currentLang === 'ko') {
      const tipW = 820;
      const tipX = (width - tipW) / 2;
      drawRoundedRect(ctx, tipX, 1475, tipW, 90, 16, 'rgba(0, 0, 0, 0.35)', 'rgba(255, 255, 255, 0.08)', 1);
      ctx.fillStyle = palette.textSecondary;
      ctx.font = `500 24px ${FONT_STACK_SANS}`;
      ctx.fillText(`꿀조합 팁: ${food.pairingTip}`, width / 2, 1530);
    }

  // =========================================================================
  // MODE: 'multi' — 2 to 4 Selected Meals (Photo-First Layout)
  // =========================================================================
  } else if (effectiveItems.length >= 2 && effectiveItems.length <= 4) {
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textPrimary;
    ctx.font = `bold 40px ${FONT_STACK_SERIF}`;
    ctx.fillText(t(currentLang, 'canvasMultiHeadline', { name: effectiveName, count: effectiveItems.length }), width / 2, 255);

    const imgs = await Promise.all(effectiveItems.map((entry) => loadFoodArtworkWithFallback(entry.food || entry)));
    const count = effectiveItems.length;
    const marginX = 56;
    const gap = 18;
    const fullW = width - marginX * 2;
    const halfW = Math.floor((fullW - gap) / 2);

    if (count === 2) {
      const tileH = 660;
      effectiveItems.forEach((entry, idx) => {
        drawPhotoMealTile(ctx, {
          x: marginX,
          y: 290 + idx * (tileH + gap),
          w: fullW,
          h: tileH,
          img: imgs[idx],
          entry,
          food: entry.food || entry,
          currentLang,
          palette
        });
      });
    } else if (count === 3) {
      drawPhotoMealTile(ctx, {
        x: marginX,
        y: 290,
        w: fullW,
        h: 640,
        img: imgs[0],
        entry: effectiveItems[0],
        food: effectiveItems[0].food || effectiveItems[0],
        currentLang,
        palette
      });
      for (let i = 1; i < 3; i++) {
        drawPhotoMealTile(ctx, {
          x: marginX + (i - 1) * (halfW + gap),
          y: 290 + 640 + gap,
          w: halfW,
          h: 640,
          img: imgs[i],
          entry: effectiveItems[i],
          food: effectiveItems[i].food || effectiveItems[i],
          currentLang,
          palette
        });
      }
    } else {
      const tileH = 645;
      effectiveItems.forEach((entry, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        drawPhotoMealTile(ctx, {
          x: marginX + col * (halfW + gap),
          y: 290 + row * (tileH + gap),
          w: halfW,
          h: tileH,
          img: imgs[idx],
          entry,
          food: entry.food || entry,
          currentLang,
          palette
        });
      });
    }

  // =========================================================================
  // MODE: 'daily' — 5-Meal Full Course Photo-First Grid
  // =========================================================================
  } else {
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textPrimary;
    ctx.font = `bold 38px ${FONT_STACK_SERIF}`;
    ctx.fillText(t(currentLang, 'canvasDailyHeadline', { name: effectiveName }), width / 2, 250);

    const items5 = effectiveItems.slice(0, 5);
    const imgs = await Promise.all(items5.map((entry) => loadFoodArtworkWithFallback(entry.food || entry)));

    const marginX = 56;
    const gap = 18;
    const fullW = width - marginX * 2;
    const halfW = Math.floor((fullW - gap) / 2);
    const heroY = 278;
    const heroH = 440;
    const gridH = 445;

    // Top Hero Photo (Meal 1)
    if (items5[0]) {
      drawPhotoMealTile(ctx, {
        x: marginX,
        y: heroY,
        w: fullW,
        h: heroH,
        radius: 26,
        img: imgs[0],
        entry: items5[0],
        food: items5[0].food || items5[0],
        currentLang,
        palette
      });
    }

    // 2x2 Photo Grid (Meals 2~5)
    let totalCalories = 0;
    for (const entry of items5) {
      const f = entry.food || entry;
      if (f?.calories) {
        const m = String(f.calories).match(/(\d+)/);
        if (m) totalCalories += parseInt(m[1], 10);
      }
    }

    for (let i = 1; i < items5.length; i++) {
      const idx = i - 1;
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const tileX = marginX + col * (halfW + gap);
      const tileY = heroY + heroH + gap + row * (gridH + gap);
      drawPhotoMealTile(ctx, {
        x: tileX,
        y: tileY,
        w: halfW,
        h: gridH,
        radius: 24,
        img: imgs[i],
        entry: items5[i],
        food: items5[i].food || items5[i],
        currentLang,
        palette
      });
    }

    // Subtle 1-line total calories pill below the 5 photos
    if (totalCalories > 0) {
      ctx.textAlign = 'center';
      ctx.fillStyle = palette.textAccent;
      ctx.font = `bold 22px ${FONT_STACK_SANS}`;
      ctx.fillText(t(currentLang, 'canvasCalTotal', { calories: totalCalories.toLocaleString() }), width / 2, 1692);
    }
  }

  // 3. Render Footer Watermark (Y: 1720 ~ 1850)
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.textAccent;
  ctx.font = `bold 28px ${FONT_STACK_SANS}`;
  ctx.fillText(t(currentLang, 'canvasFooterCta'), width / 2, 1780);

  ctx.fillStyle = palette.textSecondary;
  ctx.font = `500 22px ${FONT_STACK_SANS}`;
  if (mode === 'food') {
    const cleanHost = siteUrl.replace(/^https?:\/\//, '');
    ctx.fillText(currentLang === 'ko' ? `${cleanHost} · 401가지 맛있는 일러스트 도감` : `${cleanHost} · 401 Food Illustrations`, width / 2, 1825);
  } else {
    ctx.fillText(t(currentLang, 'canvasFooterReset', { name: effectiveName }), width / 2, 1825);
  }

  return targetCanvas;
}

/**
 * Convert Canvas to PNG Blob
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
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
        for (let i = 0; i < len; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        resolve(new Blob([bytes], { type: 'image/png' }));
      } catch (err) {
        reject(err);
      }
    } else {
      reject(new Error('Neither toBlob nor toDataURL is available on canvas'));
    }
  });
}

/**
 * Trigger browser file download for a Blob
 * @param {Blob} blob
 * @param {string} filename
 * @returns {boolean}
 */
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
      }, 100);
      return true;
    }
  } catch (err) {
    console.error('downloadImage error:', err);
  }
  return false;
}

/**
 * High-Level Share Image Handler
 * Tries Web Share API Level 2 files (iOS/Android Instagram Stories & KakaoTalk)
 * Falls back to automatic download + localized toast
 *
 * @param {Object} options
 * @param {Blob} options.blob
 * @param {string} options.filename
 * @param {string} options.title
 * @param {string} options.text
 * @param {string} options.url
 * @param {string} options.lang
 * @returns {Promise<{ success: boolean, method: string, aborted?: boolean }>}
 */
export async function shareImage({
  blob,
  filename = 'mukbang-share.png',
  title = '',
  text = '',
  url = '',
  lang = 'ko'
} = {}) {
  const currentLang = normalizeLang(lang);

  // 1. Try Web Share API Level 2 (files support)
  if (
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
      console.warn('Native share failed, falling back to download:', err);
    }
  }

  // 2. Fallback: Automatic download + localized guidance toast
  downloadImage(blob, filename);
  const fallbackMessage = getFallbackSaveToast(currentLang);
  showToast(fallbackMessage);
  return { success: true, method: 'download' };
}

/**
 * Share KakaoTalk Text / Native Share with Clipboard Fallback
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.text
 * @param {string} options.url
 * @param {string} options.lang
 * @returns {Promise<{ success: boolean, method: string, aborted?: boolean }>}
 */
export async function shareKakaoText({
  title = '',
  text = '',
  url = '',
  lang = 'ko'
} = {}) {
  const currentLang = normalizeLang(lang);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
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

  // Fallback: Copy to clipboard
  const fullText = [title, text, url].filter(Boolean).join('\n\n');
  const copied = await copyToClipboard(fullText, t(currentLang, 'toastKakaoCopied'));
  return { success: copied, method: 'clipboard' };
}

/**
 * Share via WhatsApp Universal Web / Mobile Link
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.text
 * @param {string} options.url
 * @param {string} options.lang
 * @returns {Promise<{ success: boolean, method: string }>}
 */
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

  // Fallback
  const copied = await copyToClipboard(fullText, t(currentLang, 'toastWhatsAppSuccess'));
  return { success: copied, method: 'clipboard' };
}
