// web/js/share.js — Multilingual Instagram Story 9:16 Canvas & KakaoTalk Share Module for MyCar
// Domain: car.tellmyname.app

import * as i18nMod from './lib/i18n.js';
import { MAX_LEVEL, GOOD_CAR_THRESHOLD } from './lib/constants.js';

export const SHARE_ORIGIN = 'https://car.tellmyname.app';
const GOOD_THRESHOLD = typeof GOOD_CAR_THRESHOLD === 'number' ? GOOD_CAR_THRESHOLD : 500;

const CAR_SHARE_I18N = {
  ko: {
    brandHeader: '나에게 어울리는 자동차',
    ownerHeadline: '{name}님에게 어울리는 자동차는',
    defaultHeadline: '나에게 어울리는 자동차는',
    subHeadlineWithName: '{name}님의 다중우주 시승 감정서',
    subHeadlineDefault: '나의 다중우주 시승 감정서',
    eraLabel: '언제 타던 탈것인지',
    priceLabel: '추산 가격·유지비',
    featureLabel: '특별한 기능·주행성능',
    verdictLabel: 'AI 시승 총평',
    zoneGood: '대박 탈것',
    zoneBad: '폭망 탈것',
    realBadge: '🏛️ 짝수 · 실제 탈것',
    fictionBadge: '🦄 홀수 · 허구 탈것',
    hint: '👆 링크를 눌러 나에게 어울리는 자동차를 확인해보세요!',
    storySubtitle: '인스타그램 스토리 / 카카오톡 공유용 인증 카드 (9:16)',
    themeCert: '시승 감정서',
    themeCyber: '사이버 네온',
    themeSunset: '노을 그라디언트',
    instaDirectBtn: '인스타그램 스토리로 바로 보내기 / 공유',
    tiktokDirectBtn: '틱톡 공유 (9:16 카드 & 링크)',
    whatsappDirectBtn: '왓츠앱으로 공유하기',
    kakaoShareBtn: '카카오톡 / 모바일로 공유하기',
    saveStoryBtn: '스토리 카드 이미지 저장',
    copyUrlBtn: '결과 링크 복사',
    copyShort: '복사',
    copiedToast: '공유 주소가 복사되었습니다!',
    savedToast: '📥 9:16 인스타 스토리 이미지가 저장되었습니다!',
    instaDownloadedToast: '📸 스토리가 다운로드되고 링크가 복사되었습니다!',
    tiktokDownloadedToast: '🎵 9:16 스토리가 다운로드되고 링크가 복사되었습니다!',
    whatsappOpenedToast: '🟢 왓츠앱으로 공유 메시지가 전송됩니다!',
    messengerCopiedToast: '💬 공유 주소가 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유하세요.'
  },
  en: {
    brandHeader: 'The Ride That Suits You',
    ownerHeadline: 'The ride that suits {name} is',
    defaultHeadline: 'The Ride That Suits You',
    subHeadlineWithName: "{name}'s Multiverse Vehicle Appraisal",
    subHeadlineDefault: 'Multiverse Vehicle Appraisal',
    eraLabel: 'Vehicle Era',
    priceLabel: 'Est. Price & Upkeep',
    featureLabel: 'Special Feature',
    verdictLabel: 'AI Mechanic Verdict',
    zoneGood: 'Dream Ride',
    zoneBad: 'Doom Ride',
    realBadge: '🏛️ Even · Real Ride',
    fictionBadge: '🦄 Odd · Fictional Ride',
    hint: '👆 Tap the link to discover your destined ride!',
    storySubtitle: '9:16 Story Share Card for Instagram & Messengers',
    themeCert: 'Appraisal',
    themeCyber: 'Cyber Neon',
    themeSunset: 'Sunset Glow',
    instaDirectBtn: 'Share to Instagram Story Directly',
    tiktokDirectBtn: 'Share to TikTok (9:16 Card & Link)',
    whatsappDirectBtn: 'Share via WhatsApp',
    kakaoShareBtn: 'Share via Mobile / Messenger',
    saveStoryBtn: 'Save 9:16 Story Card PNG',
    copyUrlBtn: 'Copy Result Link',
    copyShort: 'Copy',
    copiedToast: 'Share URL copied to clipboard!',
    savedToast: '📥 9:16 Instagram Story card saved!',
    instaDownloadedToast: '📸 Story downloaded & link copied!',
    tiktokDownloadedToast: '🎵 9:16 card downloaded & link copied!',
    whatsappOpenedToast: '🟢 Opening WhatsApp share!',
    messengerCopiedToast: '💬 Share link copied! Paste it into your chat.'
  },
  ja: {
    brandHeader: 'あなたに似合う車',
    ownerHeadline: '{name}さんに似合う乗り物は',
    defaultHeadline: 'あなたに似合う乗り物は',
    subHeadlineWithName: '{name}さんの試乗鑑定書',
    subHeadlineDefault: '多次元ガレージ試乗鑑定書',
    eraLabel: '活躍した時代',
    priceLabel: '推定価格・維持費',
    featureLabel: '特殊機能・走行性能',
    verdictLabel: 'AI整備士の一言',
    zoneGood: '神スペック名車',
    zoneBad: '爆死ポンコツ',
    realBadge: '🏛️ 偶数 · 実在',
    fictionBadge: '🦄 奇数 · 架空',
    hint: '👆 リンクをタップしてあなたに似合う車をチェック！',
    copyShort: 'コピー'
  },
  zh: {
    brandHeader: '适合你的座驾',
    ownerHeadline: '最适合 {name} 的座驾是',
    defaultHeadline: '最适合你的座驾是',
    subHeadlineWithName: '{name} 的多元宇宙试驾鉴定书',
    subHeadlineDefault: '多元宇宙试驾鉴定书',
    eraLabel: '活跃年代',
    priceLabel: '预估车价与维护费',
    featureLabel: '特殊功能与性能',
    verdictLabel: 'AI首席技师总评',
    zoneGood: '神级梦想座驾',
    zoneBad: '惨烈报废座驾',
    realBadge: '🏛️ 偶数 · 现实',
    fictionBadge: '🦄 奇数 · 虚构',
    hint: '👆 点击链接查看最适合你的座驾！',
    copyShort: '复制'
  },
  hi: {
    brandHeader: 'आपके लिए सही सवारी',
    ownerHeadline: '{name} के लिए सही सवारी है',
    defaultHeadline: 'आपके लिए सही सवारी',
    eraLabel: 'वाहन का युग',
    priceLabel: 'अनुमानित कीमत',
    featureLabel: 'विशेष फ़ीचर',
    verdictLabel: 'AI मैकेनिक की राय',
    zoneGood: 'ड्रीम राइड',
    zoneBad: 'डूम राइड',
    hint: '👆 अपनी सवारी जानने के लिए लिंक पर टैप करें!'
  },
  vi: {
    brandHeader: 'Chiếc Xe Hợp Với Bạn',
    ownerHeadline: 'Chiếc xe hợp với {name} là',
    defaultHeadline: 'Chiếc xe hợp với bạn là',
    eraLabel: 'Thời đại hoạt động',
    priceLabel: 'Giá & Chi phí dự kiến',
    featureLabel: 'Tính năng đặc biệt',
    verdictLabel: 'Nhận xét của AI',
    zoneGood: 'Siêu Xe Đỉnh',
    zoneBad: 'Xe Thảm Họa',
    hint: '👆 Nhấn vào liên kết để xem chiếc xe của bạn!'
  },
  fr: {
    brandHeader: 'Le Véhicule Fait Pour Vous',
    ownerHeadline: 'Le véhicule pour {name} est',
    defaultHeadline: 'Votre véhicule idéal',
    eraLabel: 'Époque',
    priceLabel: 'Prix & Entretien est.',
    featureLabel: 'Fonction spéciale',
    verdictLabel: 'Verdict du mécanicien IA',
    zoneGood: 'Bolide de Rêve',
    zoneBad: 'Épave Infernale',
    hint: '👆 Touchez le lien pour découvrir votre véhicule !'
  },
  pt: {
    brandHeader: 'O Veículo Que Combina Com Você',
    ownerHeadline: 'O veículo ideal para {name} é',
    defaultHeadline: 'O veículo ideal para você',
    eraLabel: 'Época',
    priceLabel: 'Preço e Custo est.',
    featureLabel: 'Recurso Especial',
    verdictLabel: 'Veredito da IA',
    zoneGood: 'Veículo dos Sonhos',
    zoneBad: 'Sucata Maldita',
    hint: '👆 Toque no link para descobrir seu veículo!'
  },
  es: {
    brandHeader: 'El Vehículo Para Ti',
    ownerHeadline: 'El vehículo para {name} es',
    defaultHeadline: 'El vehículo ideal para ti',
    eraLabel: 'Época',
    priceLabel: 'Precio y Mantenimiento',
    featureLabel: 'Función Especial',
    verdictLabel: 'Veredicto IA',
    zoneGood: 'Vehículo Soñado',
    zoneBad: 'Chatarra Total',
    hint: '👆 ¡Toca el enlace para descubrir tu vehículo!'
  },
  id: {
    brandHeader: 'Kendaraan yang Cocok Untukmu',
    ownerHeadline: 'Kendaraan untuk {name} adalah',
    defaultHeadline: 'Kendaraan untukmu adalah',
    eraLabel: 'Era Kendaraan',
    priceLabel: 'Perkiraan Harga',
    featureLabel: 'Fitur Spesial',
    verdictLabel: 'Komentar Mekanik AI',
    zoneGood: 'Kendaraan Impian',
    zoneBad: 'Kendaraan Zonk',
    hint: '👆 Ketuk tautan untuk cek kendaraanmu!'
  },
  ru: {
    brandHeader: 'Твой Идеальный Транспорт',
    ownerHeadline: 'Транспорт для {name}:',
    defaultHeadline: 'Ваш идеальный транспорт',
    eraLabel: 'Эпоха',
    priceLabel: 'Цена и содержание',
    featureLabel: 'Особые функции',
    verdictLabel: 'Вердикт ИИ-механика',
    zoneGood: 'Мечта',
    zoneBad: 'Кошмар',
    hint: '👆 Нажмите на ссылку, чтобы узнать свой транспорт!'
  },
  de: {
    brandHeader: 'Dein Passendes Fahrzeug',
    ownerHeadline: 'Das Fahrzeug für {name} ist',
    defaultHeadline: 'Dein passendes Fahrzeug',
    eraLabel: 'Epoche',
    priceLabel: 'Geschätzter Preis',
    featureLabel: 'Spezial-Feature',
    verdictLabel: 'KI-Mechaniker-Urteil',
    zoneGood: 'Traumfahrzeug',
    zoneBad: 'Schrottkarre',
    hint: '👆 Link antippen und dein Fahrzeug entdecken!'
  },
  it: {
    brandHeader: 'Il Veicolo Adatto a Te',
    ownerHeadline: 'Il veicolo per {name} è',
    defaultHeadline: 'Il veicolo adatto a te',
    eraLabel: 'Epoca',
    priceLabel: 'Prezzo e Costi st.',
    featureLabel: 'Funzione Speciale',
    verdictLabel: 'Giudizio IA',
    zoneGood: 'Veicolo da Sogno',
    zoneBad: 'Rottame Totale',
    hint: '👆 Tocca il link per scoprire il tuo veicolo!'
  },
  ms: {
    brandHeader: 'Kenderaan yang Sesuai Dengan Anda',
    ownerHeadline: 'Kenderaan untuk {name} ialah',
    defaultHeadline: 'Kenderaan untuk anda ialah',
    eraLabel: 'Era Kenderaan',
    priceLabel: 'Anggaran Harga',
    featureLabel: 'Ciri Istimewa',
    verdictLabel: 'Ulasan Mekanik AI',
    zoneGood: 'Kenderaan Impian',
    zoneBad: 'Kenderaan Teruk',
    hint: '👆 Ketik pautan untuk melihat kenderaan anda!'
  }
};

function getShareCopy(lang = 'ko') {
  const code = CAR_SHARE_I18N[lang] ? lang : 'en';
  const base = code === 'ko' ? CAR_SHARE_I18N.ko : { ...CAR_SHARE_I18N.en, ...CAR_SHARE_I18N[code] };
  const dict = i18nMod.UI_DICTIONARY?.[lang] || null;
  return { base, dict };
}

function localizeVehicle(carData, lang = 'ko', currentName = '') {
  const fn = i18nMod.localizeCar || i18nMod.localizeJob || i18nMod.localizeHouse;
  if (typeof fn === 'function') {
    return fn(carData, lang, currentName);
  }
  return carData;
}

/**
 * 이름 기반 영구 공유 URL 생성
 * - currentName이 있으면: https://car.tellmyname.app/name/{encodeURIComponent(이름)}
 * - 없으면: https://car.tellmyname.app/level/{level}
 */
export function buildPermanentShareUrl(carData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  if (trimmed) {
    const base = `${SHARE_ORIGIN}/name/${encodeURIComponent(trimmed)}`;
    return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
  }
  const rawLv = (carData && carData.level != null) ? Number(carData.level) : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, rawLv));
  const base = `${SHARE_ORIGIN}/level/${lv}`;
  return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
}

/**
 * URL 디코딩을 통한 사람이 읽기 쉬운 공유 URL 포맷터
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
export function buildSharePayload(carData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = (carData && carData.level != null) ? carData.level : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, Number(rawLv) || 0));
  const { base, dict } = getShareCopy(lang);
  const localized = localizeVehicle(carData || { level: lv }, lang, trimmed);

  const title = localized?.title || carData?.title || `다중우주 탈것 Lv.${lv}`;
  const era = localized?.era || localized?.builtYear || carData?.era || carData?.builtYear || '';
  const estimatedPrice = localized?.estimatedPrice || localized?.estimatedSalary || localized?.estimatedValue || carData?.estimatedPrice || carData?.estimatedSalary || carData?.estimatedValue || '';
  const specialFeature = localized?.specialFeature || localized?.specialDuty || carData?.specialFeature || carData?.specialDuty || '';

  let shareTitle = '';
  if (lang === 'ko') {
    shareTitle = trimmed
      ? `${trimmed}님에게 어울리는 자동차 — Lv.${lv} ${title}`
      : `나에게 어울리는 자동차 — Lv.${lv} ${title}`;
  } else {
    const ownerPhrase = trimmed
      ? (dict?.ownerTitle || base.ownerHeadline).replace('{name}', trimmed)
      : (dict?.brandHeader || base.brandHeader);
    shareTitle = `${ownerPhrase} — Lv.${lv} ${title}`;
  }

  const specEraLabel = (lang !== 'ko' && dict?.specs?.eraLabel) || (lang !== 'ko' && dict?.specs?.builtYearLabel) || base.eraLabel;
  const specPriceLabel = (lang !== 'ko' && dict?.specs?.priceLabel) || (lang !== 'ko' && dict?.specs?.estimatedValueLabel) || base.priceLabel;
  const specFeatureLabel = (lang !== 'ko' && dict?.specs?.featureLabel) || (lang !== 'ko' && dict?.specs?.specialFeatureLabel) || base.featureLabel;

  const textLines = [
    era ? `📅 ${specEraLabel}: ${era}` : '',
    estimatedPrice ? `💰 ${specPriceLabel}: ${estimatedPrice}` : '',
    specialFeature ? `⚡ ${specFeatureLabel}: ${specialFeature}` : ''
  ].filter(Boolean);

  const shareText = textLines.join('\n');
  const shareUrl = buildPermanentShareUrl(carData, trimmed, lang);

  const paddedLevel = String(lv).padStart(5, '0');
  const imageUrl = carData?.ogImageUrl || `${SHARE_ORIGIN}/r2/cars/${paddedLevel}.webp`;

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
export async function copyShareUrl(carData, currentName = '', lang = 'ko') {
  const url = buildPermanentShareUrl(carData, currentName, lang);
  const readableUrl = formatReadableShareUrl(url);
  const { base, dict } = getShareCopy(lang);
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
    ? `car.tellmyname.app/name/${trimmed}`
    : readableUrl.replace(/^https?:\/\//, '');

  const toastMsg = `🔗 ${dict?.copiedToast || base.copiedToast} (${displayUrl})`;
  showToast(toastMsg);
  return url;
}

/**
 * 텍스트 줄바꿈 렌더링 헬퍼 (Canvas 2D)
 */
function renderWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
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
 * 비동기 이미지 로더
 */
function loadArtworkImage(src) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 4500);
  });
}

/**
 * 9:16 인스타그램 스토리 고해상도 캔버스(1080 × 1920) 렌더링
 * Visual Hierarchy:
 *   1. Top Headline: "{name}님에게 어울리는 자동차는" + Vehicle Title & Tier/Level badges
 *   2. Middle Visual: 1:1 High-res Vehicle Artwork Image (720x720)
 *   3. Bottom Specs: 📅 언제 타던 탈것인지, 💰 추산 가격·유지비, ⚡ 특별한 기능·주행성능, 🤖 AI 시승 총평 + car.tellmyname.app/name/{name}
 */
export async function renderStoryCanvas(canvas, carData, currentName = '', theme = 'sunset', lang = 'ko') {
  if (!canvas || typeof canvas.getContext !== 'function') {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = 1080;
  canvas.height = 1920;

  const width = 1080;
  const height = 1920;
  const trimmedName = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = Number(carData?.level);
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const paddedLevel = String(lv).padStart(5, '0');
  const isReal = lv % 2 === 0;
  const isGood = lv >= GOOD_THRESHOLD;
  const tierNum = carData?.tier || Math.min(20, Math.floor(lv / 50) + 1);

  const selectedLang = CAR_SHARE_I18N[lang] ? lang : 'ko';
  const { base, dict } = getShareCopy(selectedLang);
  const localized = localizeVehicle(carData || { level: lv }, selectedLang, trimmedName);

  let activeTheme = theme;
  if (activeTheme === 'cosmic') activeTheme = 'sunset';
  if (!['cert', 'cyber', 'sunset'].includes(activeTheme)) {
    activeTheme = 'sunset';
  }

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

    cardBg = 'rgba(20, 6, 30, 0.80)';
    textPrimary = '#ffffff';
    textSecondary = '#fbcfe8';
    textAccent = '#fde047';
    badgeBg = 'rgba(255, 255, 255, 0.18)';
  }

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

  // Outer Frame Border
  ctx.save();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 4;
  drawRoundedRectPath(ctx, 48, 48, width - 96, height - 96, 36);
  ctx.stroke();
  ctx.restore();

  // =========================================================================
  // 1. TOP HEADLINE (Y: 78 ~ 340) — Owner Headline + Vehicle Title & Badges
  // =========================================================================
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = badgeBg;
  drawRoundedRectPath(ctx, width / 2 - 270, 78, 540, 40, 20);
  ctx.fill();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  ctx.fillText(`🚗 ${dict?.brandHeader || base.brandHeader} • MyCar AI`, width / 2, 105);

  const primaryHeadline = trimmedName
    ? (dict?.ownerTitle || base.ownerHeadline).replace('{name}', trimmedName)
    : base.defaultHeadline;

  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 40px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(primaryHeadline, width / 2, 162);
  ctx.shadowBlur = 0;

  const vehicleTitle = localized?.title || carData?.title || `Vehicle Lv.${lv}`;
  ctx.fillStyle = textAccent;
  ctx.font = 'bold 34px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  const afterTitleY = renderWrappedText(ctx, vehicleTitle, width / 2, 214, 920, 42, 2);

  // Tier / Level / Zone / Reality Badges Row
  const badgeRowY = Math.min(298, Math.max(264, afterTitleY + 6));
  const zoneLabel = isGood
    ? `🌟 ${dict?.zones?.GOOD || base.zoneGood}`
    : `💀 ${dict?.zones?.BAD || base.zoneBad}`;
  const realityLabel = isReal
    ? (dict?.reality?.REAL ? `🏛️ ${dict.reality.REAL}` : base.realBadge)
    : (dict?.reality?.FICTION ? `🦄 ${dict.reality.FICTION}` : base.fictionBadge);

  const tierBadgeTxt = `Tier ${String(tierNum).padStart(2, '0')} · Lv.${lv.toLocaleString()}`;
  const pills = [
    { txt: tierBadgeTxt, color: textAccent, w: 250 },
    { txt: zoneLabel, color: isGood ? '#34d399' : '#f87171', w: 240 },
    { txt: realityLabel, color: isReal ? '#38bdf8' : '#e879f9', w: 320 }
  ];
  const totalPillsW = pills.reduce((s, p) => s + p.w, 0) + 24;
  let px = (width - totalPillsW) / 2;

  for (const p of pills) {
    ctx.fillStyle = 'rgba(5, 7, 15, 0.85)';
    drawRoundedRectPath(ctx, px, badgeRowY, p.w, 42, 21);
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.font = 'bold 20px "Pretendard", sans-serif';
    ctx.fillText(p.txt, px + p.w / 2, badgeRowY + 28);
    px += p.w + 12;
  }

  ctx.restore();

  // =========================================================================
  // 2. MIDDLE VISUAL (Y: 360 ~ 1080) — Exact 1:1 Vehicle Artwork (720 x 720)
  // =========================================================================
  const artSize = 720;
  const artX = (width - artSize) / 2;
  const artY = 360;
  const artRadius = 32;

  ctx.save();
  drawRoundedRectPath(ctx, artX, artY, artSize, artSize, artRadius);
  ctx.clip();

  ctx.fillStyle = '#080c18';
  ctx.fillRect(artX, artY, artSize, artSize);

  const imageSrc = carData?.imageUrl || `/r2/cars/${paddedLevel}.webp`;
  const artworkImg = await loadArtworkImage(imageSrc);

  if (artworkImg) {
    const imgRatio = artworkImg.width / artworkImg.height;
    let sx, sy, sWidth, sHeight;
    if (imgRatio > 1) {
      sHeight = artworkImg.height;
      sWidth = artworkImg.height;
      sx = (artworkImg.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = artworkImg.width;
      sHeight = artworkImg.width;
      sx = 0;
      sy = (artworkImg.height - sHeight) / 2;
    }
    ctx.drawImage(artworkImg, sx, sy, sWidth, sHeight, artX, artY, artSize, artSize);

    const artGlow = ctx.createLinearGradient(artX, artY + artSize - 140, artX, artY + artSize);
    artGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    artGlow.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = artGlow;
    ctx.fillRect(artX, artY + artSize - 140, artSize, 140);
  } else {
    const fallbackGrad = ctx.createLinearGradient(artX, artY, artX + artSize, artY + artSize);
    fallbackGrad.addColorStop(0, '#1e293b');
    fallbackGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(artX, artY, artSize, artSize);

    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'center';
    ctx.font = '88px sans-serif';
    ctx.fillText(localized?.categoryEmoji || carData?.categoryEmoji || '🚗', artX + artSize / 2, artY + artSize / 2 - 20);
    ctx.font = 'bold 30px "Pretendard", sans-serif';
    ctx.fillText(`Lv.${lv} Vehicle Artwork`, artX + artSize / 2, artY + artSize / 2 + 50);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 3;
  drawRoundedRectPath(ctx, artX, artY, artSize, artSize, artRadius);
  ctx.stroke();
  ctx.restore();

  // =========================================================================
  // 3. BOTTOM SPECS (Y: 1104 ~ 1720) — Era, Price, Special Feature, AI Verdict
  // =========================================================================
  const cardX = 80;
  const cardY = 1104;
  const cardW = 920;
  const cardH = 616;
  const cardRadius = 32;

  ctx.save();
  ctx.fillStyle = cardBg;
  drawRoundedRectPath(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  let detailY = cardY + 58;
  const labelColX = cardX + 42;
  const valColX = cardX + 295;
  const valWidth = cardW - 337;

  const eraVal = localized?.era || localized?.builtYear || carData?.era || carData?.builtYear || '-';
  const priceVal = localized?.estimatedPrice || localized?.estimatedSalary || localized?.estimatedValue || carData?.estimatedPrice || carData?.estimatedSalary || carData?.estimatedValue || '-';
  const featureVal = localized?.specialFeature || localized?.specialDuty || carData?.specialFeature || carData?.specialDuty || '-';
  const verdictVal = localized?.aiVerdict || carData?.aiVerdict || '-';

  const eraLbl = `📅 ${dict?.specs?.eraLabel || dict?.specs?.builtYearLabel || base.eraLabel}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 22px "Pretendard", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(eraLbl, labelColX, detailY);
  ctx.fillStyle = textPrimary;
  ctx.font = '600 22px "Pretendard", sans-serif';
  detailY = renderWrappedText(ctx, eraVal, valColX, detailY, valWidth, 32, 2) + 18;

  const priceLbl = `💰 ${dict?.specs?.priceLabel || dict?.specs?.estimatedValueLabel || base.priceLabel}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 22px "Pretendard", sans-serif';
  ctx.fillText(priceLbl, labelColX, detailY);
  ctx.fillStyle = textAccent;
  ctx.font = 'bold 23px "Pretendard", sans-serif';
  detailY = renderWrappedText(ctx, priceVal, valColX, detailY, valWidth, 32, 2) + 18;

  const featureLbl = `⚡ ${dict?.specs?.featureLabel || dict?.specs?.specialFeatureLabel || base.featureLabel}`;
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 22px "Pretendard", sans-serif';
  ctx.fillText(featureLbl, labelColX, detailY);
  ctx.fillStyle = textPrimary;
  ctx.font = '500 21px "Pretendard", sans-serif';
  detailY = renderWrappedText(ctx, featureVal, valColX, detailY, valWidth, 30, 3) + 16;

  const verdictDivY = Math.max(detailY + 4, cardY + 390);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 42, verdictDivY);
  ctx.lineTo(cardX + cardW - 42, verdictDivY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 20px "Pretendard", sans-serif';
  ctx.fillText(`🤖 ${dict?.specs?.aiVerdictLabel || base.verdictLabel}`, width / 2, verdictDivY + 38);

  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 25px "Pretendard", "Apple SD Gothic Neo", sans-serif';
  renderWrappedText(ctx, `“${verdictVal}”`, width / 2, verdictDivY + 80, cardW - 90, 35, 3);

  ctx.restore();

  // =========================================================================
  // 4. FOOTER URL & CTA (Y: 1745 ~ 1875)
  // =========================================================================
  ctx.save();
  ctx.textAlign = 'center';

  const shareUrl = buildPermanentShareUrl(carData, trimmedName, selectedLang);
  const readableUrl = formatReadableShareUrl(shareUrl);
  const displayHostAndPath = readableUrl.replace(/^https?:\/\//, '');

  ctx.fillStyle = textAccent;
  ctx.font = 'bold 29px "Pretendard", sans-serif';
  ctx.fillText(`🔗 ${displayHostAndPath}`, width / 2, 1770);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = '500 22px "Pretendard", sans-serif';
  ctx.fillText(dict?.storyPhotoHint || base.hint, width / 2, 1814);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '400 17px monospace';
  ctx.fillText('car.tellmyname.app • 0~1000 Multiverse Vehicle Appraisal', width / 2, 1852);
  ctx.restore();

  return canvas;
}

/**
 * 공유 모달 대화상자 열기 (다국어 지원)
 */
export function openShareModal(carData, currentName = '', lang = 'ko') {
  if (typeof document === 'undefined') return;

  const selectedLang = CAR_SHARE_I18N[lang] ? lang : 'ko';
  const { base, dict } = getShareCopy(selectedLang);
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const shareUrl = buildPermanentShareUrl(carData, trimmed, selectedLang);
  const readableShareUrl = formatReadableShareUrl(shareUrl);
  const payload = buildSharePayload(carData, trimmed, selectedLang);

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
            <h3 class="share-modal-title" id="share-modal-title">🚗 ${dict?.brandHeader || base.brandHeader}</h3>
            <p class="share-modal-subtitle">${dict?.storyPhotoHint || base.storySubtitle}</p>
          </div>
          <button class="share-modal-close" id="share-modal-close-btn" aria-label="Close">×</button>
        </div>

        <div class="share-modal-body">
          <div class="theme-selector">
            <button class="theme-pill" data-theme="cert">📜 ${dict?.shareModal?.themeCert || base.themeCert}</button>
            <button class="theme-pill" data-theme="cyber">⚡ ${dict?.shareModal?.themeCyber || base.themeCyber}</button>
            <button class="theme-pill active" data-theme="sunset">🌅 ${dict?.shareModal?.themeSunset || base.themeSunset}</button>
          </div>

          <div class="share-canvas-wrapper">
            <canvas id="share-story-canvas" width="1080" height="1920"></canvas>
            <div id="share-canvas-spinner" class="share-canvas-spinner" style="display: none;">
              🎨 9:16 Story Generating...
            </div>
          </div>

          <div class="share-url-container">
            <input type="text" class="share-url-input" id="share-url-field" readonly value="${readableShareUrl}">
            <button class="share-url-copy-btn" id="share-url-copy-button">${base.copyShort}</button>
          </div>

          <div class="share-actions">
            <button class="share-btn share-btn-insta" id="share-action-insta-direct">
              📸 ${dict?.shareModal?.instaDirectBtn || base.instaDirectBtn}
            </button>

            <button class="share-btn share-btn-tiktok" id="share-action-tiktok">
              🎵 ${dict?.shareModal?.tiktokDirectBtn || base.tiktokDirectBtn}
            </button>

            <button class="share-btn share-btn-whatsapp" id="share-action-whatsapp">
              🟢 ${dict?.shareModal?.whatsappDirectBtn || base.whatsappDirectBtn}
            </button>

            <button class="share-btn share-btn-kakao" id="share-action-mobile-share">
              💬 ${dict?.shareMobileBtn || base.kakaoShareBtn}
            </button>

            <button class="share-btn share-btn-save" id="share-action-save-image">
              📥 ${dict?.saveStoryBtn || base.saveStoryBtn}
            </button>

            <button class="share-btn share-btn-copy" id="share-action-copy-url">
              🔗 ${dict?.copyUrlBtn || base.copyUrlBtn}
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
      await renderStoryCanvas(canvas, carData, trimmed, currentTheme, selectedLang);
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
      const selectedTheme = pill.getAttribute('data-theme') || 'sunset';
      updateCanvas(selectedTheme);
    });
  });

  const handleCopy = () => {
    copyShareUrl(carData, trimmed, selectedLang);
  };

  const copyFieldBtn = document.getElementById('share-url-copy-button');
  const copyActionBtn = document.getElementById('share-action-copy-url');
  if (copyFieldBtn) copyFieldBtn.addEventListener('click', handleCopy);
  if (copyActionBtn) copyActionBtn.addEventListener('click', handleCopy);

  const downloadCanvasPng = () => {
    return new Promise((resolve) => {
      if (!canvas) return resolve(null);
      const lv = carData?.level ?? 0;
      const sanitized = (trimmed || 'mycar').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
      const filename = `mycar_${sanitized}_lv${lv}_${currentTheme}.png`;

      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
          resolve({ blob, filename });
        }, 'image/png');
      } else {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve({ dataUrl, filename });
        } catch (_) {
          resolve(null);
        }
      }
    });
  };

  const shareCanvasFiles = async () => {
    if (!canvas || typeof navigator === 'undefined' || typeof navigator.share !== 'function' || typeof File !== 'function') {
      return false;
    }
    const blobResult = await new Promise((resolve) => {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      } else {
        resolve(null);
      }
    });
    if (!blobResult) return false;
    const lv = carData?.level ?? 0;
    const sanitized = (trimmed || 'mycar').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
    const filename = `mycar_${sanitized}_lv${lv}_${currentTheme}.png`;
    try {
      const file = new File([blobResult], filename, { type: 'image/png' });
      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: payload.title,
          text: `${payload.title}\n${payload.text}`,
          url: payload.url
        });
        return true;
      }
    } catch (_) {}
    return false;
  };

  const saveImgBtn = document.getElementById('share-action-save-image');
  if (saveImgBtn) {
    saveImgBtn.addEventListener('click', async () => {
      await downloadCanvasPng();
      showToast(dict?.shareModal?.savedToast || base.savedToast);
    });
  }

  const instaDirectBtn = document.getElementById('share-action-insta-direct');
  if (instaDirectBtn) {
    instaDirectBtn.addEventListener('click', async () => {
      await copyShareUrl(carData, trimmed, selectedLang);
      const shared = await shareCanvasFiles();
      if (shared) return;
      await downloadCanvasPng();
      showToast(dict?.shareModal?.instaDownloadedToast || base.instaDownloadedToast);
    });
  }

  const tiktokBtn = document.getElementById('share-action-tiktok');
  if (tiktokBtn) {
    tiktokBtn.addEventListener('click', async () => {
      await copyShareUrl(carData, trimmed, selectedLang);
      const shared = await shareCanvasFiles();
      if (shared) return;
      await downloadCanvasPng();
      showToast(dict?.shareModal?.tiktokDownloadedToast || base.tiktokDownloadedToast);
    });
  }

  const whatsappBtn = document.getElementById('share-action-whatsapp');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const waText = `${payload.title}\n${payload.text}\n👉 ${readableShareUrl}`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast(dict?.shareModal?.whatsappOpenedToast || base.whatsappOpenedToast);
    });
  }

  const mobileShareBtn = document.getElementById('share-action-mobile-share');
  if (mobileShareBtn) {
    mobileShareBtn.addEventListener('click', async () => {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: payload.title,
            text: `${payload.title}\n${payload.text}`,
            url: payload.url
          });
          return;
        } catch (_) {}
      }
      await copyShareUrl(carData, trimmed, selectedLang);
      showToast(dict?.shareModal?.messengerCopiedToast || base.messengerCopiedToast);
    });
  }
}
