// web/js/share.js — Unified Viral Photocard & Bento Share Card Engine (14 Languages)
// Domain: tellmyname.app

import * as i18nMod from './lib/i18n.js';
import { MAX_LEVEL, GOOD_HOUSE_THRESHOLD } from './lib/constants.js';

export const SHARE_ORIGIN = 'https://tellmyname.app';
const WATERMARK_DOMAIN = 'tellmyname.app';
const GOOD_THRESHOLD = typeof GOOD_HOUSE_THRESHOLD === 'number' ? GOOD_HOUSE_THRESHOLD : 500;

const DISPLAY_FONT = '"Paperlogy", "SUITE Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const BODY_FONT = '"SUITE Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

const SHARE_UI_COPY = {
  ko: {
    subtitle: '원하는 테마를 골라 이미지를 저장하거나 공유해보세요',
    themeCream: '포토카드',
    themeAurora: '오로라',
    themePeach: '피치',
    unifiedBtn: '이미지 저장 · 공유하기',
    downloadDirect: '파일로 바로 저장',
    copyLink: '링크 복사',
    generating: '포토카드 만드는 중...',
    savedToast: '이미지를 저장했습니다! 인스타그램이나 카카오톡에서 바로 올려보세요.',
    sharedToast: '공유 창을 열었습니다!',
    copiedToast: '결과 링크를 복사했습니다!',
    realShort: '실제',
    fictionShort: '상상'
  },
  en: {
    subtitle: 'Pick a theme and save or share your image card',
    themeCream: 'Photocard',
    themeAurora: 'Aurora',
    themePeach: 'Peach',
    unifiedBtn: 'Save & Share Image',
    downloadDirect: 'Download PNG',
    copyLink: 'Copy Link',
    generating: 'Creating card...',
    savedToast: 'Image saved! Share it on Instagram, WhatsApp, or anywhere.',
    sharedToast: 'Share sheet opened!',
    copiedToast: 'Result link copied!',
    realShort: 'Real',
    fictionShort: 'Fiction'
  },
  ja: {
    subtitle: 'テーマを選んで画像を保存・共有しましょう',
    themeCream: 'フォトカード',
    themeAurora: 'オーロラ',
    themePeach: 'ピーチ',
    unifiedBtn: '画像を保存・共有する',
    downloadDirect: 'PNGを直接保存',
    copyLink: 'リンクをコピー',
    generating: 'カード作成中...',
    savedToast: '画像を保存しました！インスタやLINEでシェアしましょう。',
    sharedToast: '共有メニューを開きました！',
    copiedToast: 'リンクをコピーしました！',
    realShort: '実在',
    fictionShort: '架空'
  },
  zh: {
    subtitle: '选择卡片主题并保存或分享图片',
    themeCream: '拍立得白',
    themeAurora: '极光暗黑',
    themePeach: '蜜桃落日',
    unifiedBtn: '保存并分享图片',
    downloadDirect: '直接下载PNG',
    copyLink: '复制链接',
    generating: '正在生成卡片...',
    savedToast: '图片已保存！快去社交平台分享吧。',
    sharedToast: '已打开分享面板！',
    copiedToast: '链接已复制！',
    realShort: '现实',
    fictionShort: '虚构'
  },
  es: {
    subtitle: 'Elige un tema para guardar o compartir tu tarjeta',
    themeCream: 'Postal',
    themeAurora: 'Aurora',
    themePeach: 'Atardecer',
    unifiedBtn: 'Guardar y compartir imagen',
    downloadDirect: 'Descargar PNG',
    copyLink: 'Copiar enlace',
    generating: 'Creando tarjeta...',
    savedToast: '¡Imagen guardada! Compártela en Instagram o WhatsApp.',
    sharedToast: '¡Menú para compartir abierto!',
    copiedToast: '¡Enlace copiado!',
    realShort: 'Real',
    fictionShort: 'Ficción'
  },
  fr: {
    subtitle: 'Choisissez un thème pour enregistrer ou partager',
    themeCream: 'Photo',
    themeAurora: 'Aurore',
    themePeach: 'Pêche',
    unifiedBtn: 'Enregistrer et partager l’image',
    downloadDirect: 'Télécharger PNG',
    copyLink: 'Copier le lien',
    generating: 'Création de la carte...',
    savedToast: 'Image enregistrée ! Partagez-la sur Instagram ou ailleurs.',
    sharedToast: 'Menu de partage ouvert !',
    copiedToast: 'Lien copié !',
    realShort: 'Réel',
    fictionShort: 'Fiction'
  },
  de: {
    subtitle: 'Thema wählen und Bild speichern oder teilen',
    themeCream: 'Fotokarte',
    themeAurora: 'Aurora',
    themePeach: 'Pfirsich',
    unifiedBtn: 'Bild speichern & teilen',
    downloadDirect: 'PNG herunterladen',
    copyLink: 'Link kopieren',
    generating: 'Karte wird erstellt...',
    savedToast: 'Bild gespeichert! Jetzt auf Instagram oder WhatsApp teilen.',
    sharedToast: 'Teilen-Menü geöffnet!',
    copiedToast: 'Link kopiert!',
    realShort: 'Real',
    fictionShort: 'Fiktion'
  },
  pt: {
    subtitle: 'Escolha um tema para salvar ou compartilhar',
    themeCream: 'Foto',
    themeAurora: 'Aurora',
    themePeach: 'Pêssego',
    unifiedBtn: 'Salvar e compartilhar imagem',
    downloadDirect: 'Baixar PNG',
    copyLink: 'Copiar link',
    generating: 'Criando cartão...',
    savedToast: 'Imagem salva! Compartilhe no Instagram ou WhatsApp.',
    sharedToast: 'Menu de compartilhamento aberto!',
    copiedToast: 'Link copiado!',
    realShort: 'Real',
    fictionShort: 'Ficção'
  },
  it: {
    subtitle: 'Scegli un tema per salvare o condividere',
    themeCream: 'Fotocard',
    themeAurora: 'Aurora',
    themePeach: 'Pesca',
    unifiedBtn: 'Salva e condividi immagine',
    downloadDirect: 'Scarica PNG',
    copyLink: 'Copia link',
    generating: 'Creazione card...',
    savedToast: 'Immagine salvata! Condividila su Instagram o WhatsApp.',
    sharedToast: 'Menu di condivisione aperto!',
    copiedToast: 'Link copiato!',
    realShort: 'Reale',
    fictionShort: 'Finzione'
  },
  ru: {
    subtitle: 'Выберите тему, чтобы сохранить или поделиться',
    themeCream: 'Фотокарта',
    themeAurora: 'Аврора',
    themePeach: 'Персик',
    unifiedBtn: 'Сохранить и поделиться',
    downloadDirect: 'Скачать PNG',
    copyLink: 'Копировать ссылку',
    generating: 'Создание карточки...',
    savedToast: 'Изображение сохранено! Поделитесь им в соцсетях.',
    sharedToast: 'Меню отправки открыто!',
    copiedToast: 'Ссылка скопирована!',
    realShort: 'Реальность',
    fictionShort: 'Вымысел'
  },
  vi: {
    subtitle: 'Chọn giao diện để lưu hoặc chia sẻ thẻ ảnh',
    themeCream: 'Thẻ Ảnh',
    themeAurora: 'Cực Quang',
    themePeach: 'Đào',
    unifiedBtn: 'Lưu & Chia sẻ ảnh',
    downloadDirect: 'Tải PNG',
    copyLink: 'Sao chép link',
    generating: 'Đang tạo thẻ ảnh...',
    savedToast: 'Đã lưu ảnh! Hãy chia sẻ lên Instagram hoặc Zalo.',
    sharedToast: 'Đã mở bảng chia sẻ!',
    copiedToast: 'Đã sao chép liên kết!',
    realShort: 'Thực tế',
    fictionShort: 'Hư cấu'
  },
  id: {
    subtitle: 'Pilih tema untuk menyimpan atau membagikan gambar',
    themeCream: 'Foto',
    themeAurora: 'Aurora',
    themePeach: 'Senja',
    unifiedBtn: 'Simpan & Bagikan Gambar',
    downloadDirect: 'Unduh PNG',
    copyLink: 'Salin Tautan',
    generating: 'Membuat kartu...',
    savedToast: 'Gambar disimpan! Bagikan ke Instagram atau WhatsApp.',
    sharedToast: 'Menu bagikan dibuka!',
    copiedToast: 'Tautan disalin!',
    realShort: 'Nyata',
    fictionShort: 'Fiksi'
  },
  ms: {
    subtitle: 'Pilih tema untuk simpan atau kongsi kad imej',
    themeCream: 'Kad Foto',
    themeAurora: 'Aurora',
    themePeach: 'Senja',
    unifiedBtn: 'Simpan & Kongsi Imej',
    downloadDirect: 'Muat Turun PNG',
    copyLink: 'Salin Pautan',
    generating: 'Menjana kad...',
    savedToast: 'Imej disimpan! Kongsikan di Instagram atau WhatsApp.',
    sharedToast: 'Menu kongsi dibuka!',
    copiedToast: 'Pautan disalin!',
    realShort: 'Nyata',
    fictionShort: 'Fiksyen'
  },
  hi: {
    subtitle: 'थीम चुनें और अपनी कार्ड इमेज सेव या शेयर करें',
    themeCream: 'फ़ोटो कार्ड',
    themeAurora: 'ऑरोरा',
    themePeach: 'पीच',
    unifiedBtn: 'इमेज सेव और शेयर करें',
    downloadDirect: 'PNG डाउनलोड',
    copyLink: 'लिंक कॉपी',
    generating: 'कार्ड बन रहा है...',
    savedToast: 'इमेज सेव हो गई! इसे इंस्टाग्राम या व्हाट्सऐप पर शेयर करें।',
    sharedToast: 'शेयर विकल्प खुल गया!',
    copiedToast: 'लिंक कॉपी हो गया!',
    realShort: 'वास्तविक',
    fictionShort: 'काल्पनिक'
  }
};

function getDict(lang = 'ko') {
  const dictMap = i18nMod.UI_DICTIONARY || i18nMod.TRANSLATIONS || {};
  return dictMap[lang] || dictMap.ko || {};
}

function localizeItem(itemData, lang = 'ko', name = '') {
  const fn = i18nMod.localizeHouse || i18nMod.localizeJob || i18nMod.localizeVehicle || i18nMod.localizeCar;
  if (typeof fn === 'function') {
    return fn(itemData, lang, name);
  }
  return itemData || {};
}

export function buildPermanentShareUrl(itemData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  if (trimmed) {
    const base = `${SHARE_ORIGIN}/name/${encodeURIComponent(trimmed)}`;
    return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
  }
  const rawLv = (itemData && itemData.level != null) ? Number(itemData.level) : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const base = `${SHARE_ORIGIN}/level/${lv}`;
  return (lang && lang !== 'ko') ? `${base}?lang=${lang}` : base;
}

export function formatReadableShareUrl(url) {
  try {
    return decodeURIComponent(url);
  } catch (_) {
    return url;
  }
}

export function buildSharePayload(itemData, currentName = '', lang = 'ko') {
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = (itemData && itemData.level != null) ? Number(itemData.level) : 0;
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const dict = getDict(lang);
  const localized = localizeItem(itemData || { level: lv }, lang, trimmed);

  const title = localized?.title || itemData?.title || `Lv.${lv}`;
  const spec1 = localized?.era || localized?.builtYear || itemData?.era || itemData?.builtYear || '';
  const spec2 = localized?.estimatedPrice || localized?.estimatedSalary || localized?.estimatedValue || itemData?.estimatedPrice || itemData?.estimatedSalary || itemData?.estimatedValue || '';
  const spec3 = localized?.specialFeature || localized?.specialDuty || itemData?.specialFeature || itemData?.specialDuty || '';

  let shareTitle = '';
  if (lang === 'ko') {
    const baseHeadline = trimmed
      ? '{name}님에게 어울리는 집은'.replace('{name}', trimmed).replace(/은$|는$/, '')
      : '나에게 어울리는 집';
    shareTitle = `${baseHeadline} · Lv.${lv} ${title}`;
  } else {
    const ownerPhrase = trimmed && dict.ownerTitle
      ? dict.ownerTitle.replace('{name}', trimmed)
      : (dict.brandHeader || 'The House That Suits You');
    shareTitle = `${ownerPhrase} · Lv.${lv} ${title}`;
  }

  const spec1Label = dict.specs?.eraLabel || dict.specs?.builtYearLabel || (lang === 'ko' ? '건축 연도' : 'Year Built');
  const spec2Label = dict.specs?.priceLabel || dict.specs?.estimatedValueLabel || (lang === 'ko' ? '추산 가치' : 'Est. Value');
  const spec3Label = dict.specs?.featureLabel || dict.specs?.specialFeatureLabel || (lang === 'ko' ? '특별한 기능' : 'Key Feature');

  const textLines = [
    spec1 ? `📅 ${spec1Label}: ${spec1}` : '',
    spec2 ? `💰 ${spec2Label}: ${spec2}` : '',
    spec3 ? `⚡ ${spec3Label}: ${spec3}` : ''
  ].filter(Boolean);

  const shareUrl = buildPermanentShareUrl(itemData, trimmed, lang);
  const paddedLevel = String(lv).padStart(5, '0');
  const imageUrl = itemData?.ogImageUrl || `https://img.tellmyname.app/houses/${paddedLevel}.webp`;

  return {
    title: shareTitle,
    text: textLines.join('\n'),
    url: shareUrl,
    imageUrl
  };
}

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

export async function copyShareUrl(itemData, currentName = '', lang = 'ko') {
  const url = buildPermanentShareUrl(itemData, currentName, lang);
  const readableUrl = formatReadableShareUrl(url);
  const ui = SHARE_UI_COPY[lang] || SHARE_UI_COPY.en;
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

  showToast(`🔗 ${ui.copiedToast}`);
  return url;
}

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

function fillRoundedRect(ctx, x, y, w, h, r, fillStyle, strokeStyle = null, lineWidth = 1) {
  ctx.save();
  drawRoundedRectPath(ctx, x, y, w, h, r);
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
 * Full-fidelity line wrapper with ZERO truncation ('...' never happens).
 * Supports space-delimited words AND CJK character wrapping + long compound word breaking.
 */
function wrapCanvasLines(ctx, text, maxWidth) {
  if (!text) return [];
  const raw = String(text).replace(/\s+/g, ' ').trim();
  if (!raw) return [];

  const hasSpaces = raw.includes(' ');
  const units = hasSpaces ? raw.split(' ') : Array.from(raw);
  const lines = [];
  let current = '';

  const pushBrokenLongWord = (word) => {
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
      if (current.length > 0) {
        lines.push(current);
      }
      if (ctx.measureText(unit).width > maxWidth) {
        current = pushBrokenLongWord(unit);
      } else {
        current = unit;
      }
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
}

async function ensureCanvasFonts() {
  if (typeof document === 'undefined' || !document.fonts || typeof document.fonts.load !== 'function') {
    return;
  }
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('700 36px "Paperlogy"'),
        document.fonts.load('800 44px "Paperlogy"'),
        document.fonts.load('600 25px "SUITE Variable"'),
        document.fonts.load('700 27px "SUITE Variable"')
      ]),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);
  } catch (_) {}
}

function loadSingleImage(src, timeoutMs = 4200) {
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
    img.onload = () => done(img.naturalWidth > 0 || img.width > 0 ? img : null);
    img.onerror = () => done(null);
    img.src = src;
    setTimeout(() => done(null), timeoutMs);
  });
}

async function loadArtworkWithFallbacks(lv, itemData) {
  const padded = String(lv).padStart(5, '0');
  const altExt = 'webp' === 'png' ? 'webp' : 'png';
  const candidates = [
    `https://img.tellmyname.app/houses/${padded}.webp?v=2`,
    `https://img.tellmyname.app/houses/${padded}.${altExt}?v=2`,
    itemData?.imageUrl || '',
    `/r2/houses/${padded}.webp`,
    `/r2/houses/${padded}.png`
  ].filter(Boolean);

  const seen = new Set();
  for (const url of candidates) {
    if (seen.has(url)) continue;
    seen.add(url);
    const img = await loadSingleImage(url);
    if (img) return img;
  }
  return null;
}

function normalizeShareTheme(theme) {
  if (theme === 'aurora' || theme === 'cyber' || theme === 'dark') return 'aurora';
  if (theme === 'peach' || theme === 'sunset' || theme === 'cosmic' || theme === 'fresh') return 'peach';
  return 'cream';
}

function getPalette(themeName) {
  if (themeName === 'aurora') {
    return {
      bgStops: ['#090D1A', '#131C38', '#0D1326'],
      orbA: 'rgba(56, 189, 248, 0.16)',
      orbB: 'rgba(167, 139, 250, 0.16)',
      cardBg: '#151E33',
      cardBorder: 'rgba(148, 163, 184, 0.22)',
      cardShadow: 'rgba(2, 6, 23, 0.55)',
      topPillBg: 'rgba(99, 102, 241, 0.22)',
      topPillText: '#A5B4FC',
      catchphrase: '#CBD5E1',
      title: '#F8FAFC',
      bentoBg: 'rgba(30, 41, 69, 0.88)',
      bentoBorder: 'rgba(148, 163, 184, 0.16)',
      bentoLabel: '#94A3B8',
      bentoVal: '#F1F5F9',
      bentoAccent: '#38BDF8',
      featureLabel: '#A78BFA',
      featureText: '#E2E8F0',
      quoteBgStart: 'rgba(79, 70, 229, 0.24)',
      quoteBgEnd: 'rgba(236, 72, 153, 0.18)',
      quoteBorder: 'rgba(165, 180, 252, 0.28)',
      quoteText: '#F8FAFC',
      footerPillBg: 'rgba(30, 41, 69, 0.9)',
      footerText: '#94A3B8'
    };
  }
  if (themeName === 'peach') {
    return {
      bgStops: ['#FFF1F2', '#FFE4E6', '#FFEDD5'],
      orbA: 'rgba(251, 113, 133, 0.18)',
      orbB: 'rgba(251, 146, 60, 0.16)',
      cardBg: '#FFFCFA',
      cardBorder: '#FECDD3',
      cardShadow: 'rgba(136, 19, 55, 0.10)',
      topPillBg: '#FFE4E6',
      topPillText: '#E11D48',
      catchphrase: '#57534E',
      title: '#1C1917',
      bentoBg: '#FFF5F5',
      bentoBorder: '#FFE4E6',
      bentoLabel: '#78716C',
      bentoVal: '#292524',
      bentoAccent: '#E11D48',
      featureLabel: '#EA580C',
      featureText: '#292524',
      quoteBgStart: '#FFF1F2',
      quoteBgEnd: '#FFEDD5',
      quoteBorder: '#FDBA74',
      quoteText: '#431407',
      footerPillBg: '#FFF1F2',
      footerText: '#9F1239'
    };
  }
  // Default: 'cream' (Bright Polaroid Photocard)
  return {
    bgStops: ['#EEF2FF', '#FDF2F8', '#FFF7ED'],
    orbA: 'rgba(99, 102, 241, 0.14)',
    orbB: 'rgba(236, 72, 153, 0.12)',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardShadow: 'rgba(15, 23, 42, 0.10)',
    topPillBg: '#EEF2FF',
    topPillText: '#4F46E5',
    catchphrase: '#475569',
    title: '#0F172A',
    bentoBg: '#F8FAFC',
    bentoBorder: '#E2E8F0',
    bentoLabel: '#64748B',
    bentoVal: '#1E293B',
    bentoAccent: '#4F46E5',
    featureLabel: '#6366F1',
    featureText: '#334155',
    quoteBgStart: '#EEF2FF',
    quoteBgEnd: '#FDF2F8',
    quoteBorder: '#C7D2FE',
    quoteText: '#1E1B4B',
    footerPillBg: '#F1F5F9',
    footerText: '#64748B'
  };
}

/**
 * Dynamic-Height Zero-Clip Polaroid Bento Share Card Renderer
 */
export async function renderStoryCanvas(canvas, itemData, currentName = '', theme = 'cream', lang = 'ko') {
  if (!canvas || typeof canvas.getContext !== 'function') {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  await ensureCanvasFonts();

  const width = 1080;
  const trimmedName = typeof currentName === 'string' ? currentName.trim() : '';
  const rawLv = Number(itemData?.level);
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const isReal = lv % 2 === 0;
  const isGood = lv >= GOOD_THRESHOLD;

  const dict = getDict(lang);
  const selectedLang = SHARE_UI_COPY[lang] ? lang : (dict && Object.keys(dict).length > 0 ? lang : 'ko');
  const ui = SHARE_UI_COPY[selectedLang] || SHARE_UI_COPY.en;
  const localized = localizeItem(itemData || { level: lv }, selectedLang, trimmedName);
  const activeTheme = normalizeShareTheme(theme);
  const pal = getPalette(activeTheme);

  // Prepare text values
  const brandHeader = dict.brandHeader || (selectedLang === 'ko' ? '나에게 어울리는 집' : 'The House That Suits You');
  let catchphrase = '';
  if (trimmedName) {
    if (selectedLang === 'ko') {
      catchphrase = '{name}님에게 어울리는 집은'.replace('{name}', trimmedName);
    } else {
      catchphrase = dict.ownerTitle
        ? dict.ownerTitle.replace('{name}', trimmedName)
        : 'The House That Suits {name}'.replace('{name}', trimmedName);
    }
  } else {
    catchphrase = selectedLang === 'ko' ? '나에게 어울리는 집은' : brandHeader;
  }

  const itemTitle = String(localized?.title || itemData?.title || `Lv.${lv}`).trim();
  const spec1Label = `📅 ${dict.specs?.eraLabel || dict.specs?.builtYearLabel || (selectedLang === 'ko' ? '건축 연도' : 'Year Built')}`;
  const spec1Val = String(localized?.era || localized?.builtYear || itemData?.era || itemData?.builtYear || '-').trim();

  const spec2Label = `💰 ${dict.specs?.priceLabel || dict.specs?.estimatedValueLabel || (selectedLang === 'ko' ? '추산 가치' : 'Est. Value')}`;
  const spec2Val = String(localized?.estimatedPrice || localized?.estimatedSalary || localized?.estimatedValue || itemData?.estimatedPrice || itemData?.estimatedSalary || itemData?.estimatedValue || '-').trim();

  const spec3Label = `⚡ ${dict.specs?.featureLabel || dict.specs?.specialFeatureLabel || (selectedLang === 'ko' ? '특별한 기능' : 'Key Feature')}`;
  const spec3Val = String(localized?.specialFeature || localized?.specialDuty || itemData?.specialFeature || itemData?.specialDuty || '-').trim();

  const rawVerdict = String(localized?.aiVerdict || itemData?.aiVerdict || '').trim();
  const verdictQuote = rawVerdict ? `“${rawVerdict}”` : '';

  const zoneText = isGood
    ? (dict.zones?.GOOD || (selectedLang === 'ko' ? '대박 하우스' : 'Dream Home'))
    : (dict.zones?.BAD || (selectedLang === 'ko' ? '폭망 하우스' : 'Doom House'));
  const levelPillText = `Lv.${lv.toLocaleString()} · ${isGood ? '💎' : '💀'} ${zoneText}`;
  const realityPillText = isReal ? `🏛️ ${ui.realShort}` : `✨ ${ui.fictionShort}`;

  // Load image in parallel
  const artworkImg = await loadArtworkWithFallbacks(lv, itemData);

  // Pre-measure all wrapped text blocks BEFORE setting final canvas height (0% clipping!)
  const cardX = 56;
  const cardW = width - cardX * 2; // 968
  const padX = 48;
  const innerX = cardX + padX;     // 104
  const innerW = cardW - padX * 2; // 872

  canvas.width = width;
  canvas.height = 1600; // temporary height for measureText context

  ctx.font = `700 34px ${DISPLAY_FONT}`;
  const catchLines = wrapCanvasLines(ctx, catchphrase, innerW - 20);
  const catchLineH = 46;

  const titleFontPx = Array.from(itemTitle).length > 28 ? 38 : 44;
  const titleLineH = titleFontPx === 38 ? 50 : 58;
  ctx.font = `800 ${titleFontPx}px ${DISPLAY_FONT}`;
  const titleLines = wrapCanvasLines(ctx, itemTitle, innerW - 16);

  const bentoGap = 20;
  const bentoColW = Math.floor((innerW - bentoGap) / 2); // 426
  const bentoInnerW = bentoColW - 48;
  const bentoValLineH = 34;

  ctx.font = `700 24px ${DISPLAY_FONT}`;
  const spec1Lines = wrapCanvasLines(ctx, spec1Val, bentoInnerW);
  const spec2Lines = wrapCanvasLines(ctx, spec2Val, bentoInnerW);
  const maxSpecLines = Math.max(1, spec1Lines.length, spec2Lines.length);
  const bentoBoxH = 24 + 28 + 12 + maxSpecLines * bentoValLineH + 22;

  ctx.font = `600 25px ${BODY_FONT}`;
  const featureLines = wrapCanvasLines(ctx, spec3Val, innerW - 56);
  const featureLineH = 37;
  const featureBoxH = 22 + 28 + 10 + Math.max(1, featureLines.length) * featureLineH + 22;

  ctx.font = `700 27px ${BODY_FONT}`;
  const verdictLines = verdictQuote ? wrapCanvasLines(ctx, verdictQuote, innerW - 64) : [];
  const verdictLineH = 40;
  const quoteBoxH = verdictLines.length > 0 ? (26 + verdictLines.length * verdictLineH + 26) : 0;

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
    26 +
    bentoBoxH +
    18 +
    featureBoxH +
    (quoteBoxH > 0 ? (18 + quoteBoxH) : 0) +
    28 +
    footerPillH +
    padBottom;

  const outerPadY = 56;
  const finalHeight = Math.max(1520, cardH + outerPadY * 2);
  canvas.width = width;
  canvas.height = finalHeight;

  const cardY = Math.round((finalHeight - cardH) / 2);

  // 1. Draw Soft Studio Gradient Backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, width, finalHeight);
  bgGrad.addColorStop(0, pal.bgStops[0]);
  bgGrad.addColorStop(0.5, pal.bgStops[1]);
  bgGrad.addColorStop(1, pal.bgStops[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, finalHeight);

  // Soft decorative ambient orbs (if createRadialGradient available)
  if (typeof ctx.createRadialGradient === 'function') {
    const orb1 = ctx.createRadialGradient(180, 220, 20, 180, 220, 460);
    orb1.addColorStop(0, pal.orbA);
    orb1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, finalHeight);

    const orb2 = ctx.createRadialGradient(width - 160, finalHeight - 240, 20, width - 160, finalHeight - 240, 500);
    orb2.addColorStop(0, pal.orbB);
    orb2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, finalHeight);
  }

  // 2. Draw Polaroid Poster Card Container
  ctx.save();
  ctx.shadowColor = pal.cardShadow;
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 18;
  drawRoundedRectPath(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fillStyle = pal.cardBg;
  ctx.fill();
  ctx.restore();

  fillRoundedRect(ctx, cardX, cardY, cardW, cardH, 44, null, pal.cardBorder, 2);

  let curY = cardY + padTop;

  // 3. Top App Brand Pill
  ctx.save();
  ctx.font = `700 22px ${DISPLAY_FONT}`;
  const appPillLabel = `🏠 ${brandHeader}`;
  const appPillW = Math.min(innerW, Math.ceil(ctx.measureText(appPillLabel).width) + 52);
  const appPillX = Math.round((width - appPillW) / 2);
  fillRoundedRect(ctx, appPillX, curY, appPillW, appPillH, 23, pal.topPillBg);
  ctx.fillStyle = pal.topPillText;
  ctx.textAlign = 'center';
  ctx.fillText(appPillLabel, width / 2, curY + 31);
  ctx.restore();

  curY += appPillH + 20;

  // 4. Owner Catchphrase
  ctx.save();
  ctx.fillStyle = pal.catchphrase;
  ctx.font = `700 34px ${DISPLAY_FONT}`;
  ctx.textAlign = 'center';
  for (const line of catchLines) {
    ctx.fillText(line, width / 2, curY + 34);
    curY += catchLineH;
  }
  ctx.restore();

  curY += 26;

  // 5. Large Rounded Hero Artwork Frame
  const photoX = innerX;
  const photoY = curY;
  const photoW = innerW;
  const photoRadius = 32;

  ctx.save();
  drawRoundedRectPath(ctx, photoX, photoY, photoW, photoH, photoRadius);
  ctx.clip();

  ctx.fillStyle = activeTheme === 'aurora' ? '#0F172A' : '#F1F5F9';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  if (artworkImg) {
    const imgRatio = artworkImg.width / Math.max(1, artworkImg.height);
    const boxRatio = photoW / photoH;
    let sx = 0, sy = 0, sWidth = artworkImg.width, sHeight = artworkImg.height;
    if (imgRatio > boxRatio) {
      sHeight = artworkImg.height;
      sWidth = artworkImg.height * boxRatio;
      sx = (artworkImg.width - sWidth) / 2;
    } else {
      sWidth = artworkImg.width;
      sHeight = artworkImg.width / boxRatio;
      sy = (artworkImg.height - sHeight) / 2;
    }
    ctx.drawImage(artworkImg, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);
  } else {
    const fbGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    fbGrad.addColorStop(0, '#312E81');
    fbGrad.addColorStop(1, '#1E1B4B');
    ctx.fillStyle = fbGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '88px sans-serif';
    ctx.fillText(localized?.categoryEmoji || itemData?.categoryEmoji || '🏡', photoX + photoW / 2, photoY + photoH / 2 - 12);
    ctx.font = `700 30px ${DISPLAY_FONT}`;
    ctx.fillText(`Lv.${lv}`, photoX + photoW / 2, photoY + photoH / 2 + 54);
  }
  ctx.restore();

  fillRoundedRect(ctx, photoX, photoY, photoW, photoH, photoRadius, null, 'rgba(15, 23, 42, 0.08)', 2);

  // Sleek Frosted Badges on Top of Photo (Unobstructive)
  ctx.save();
  ctx.font = `700 22px ${DISPLAY_FONT}`;
  const lvPillW = Math.min(photoW - 220, Math.ceil(ctx.measureText(levelPillText).width) + 42);
  fillRoundedRect(ctx, photoX + 22, photoY + 22, lvPillW, 46, 23, 'rgba(15, 23, 42, 0.76)', 'rgba(255,255,255,0.22)', 1.5);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(levelPillText, photoX + 22 + lvPillW / 2, photoY + 53);

  ctx.font = `700 21px ${DISPLAY_FONT}`;
  const realPillW = Math.ceil(ctx.measureText(realityPillText).width) + 36;
  const realPillX = photoX + photoW - 22 - realPillW;
  fillRoundedRect(ctx, realPillX, photoY + 22, realPillW, 46, 23, 'rgba(15, 23, 42, 0.72)', 'rgba(255,255,255,0.22)', 1.5);
  ctx.fillStyle = isReal ? '#7DD3FC' : '#F0ABFC';
  ctx.fillText(realityPillText, realPillX + realPillW / 2, photoY + 52);
  ctx.restore();

  curY += photoH + 36;

  // 6. Full Unclipped Result Title
  ctx.save();
  ctx.fillStyle = pal.title;
  ctx.font = `800 ${titleFontPx}px ${DISPLAY_FONT}`;
  ctx.textAlign = 'center';
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, curY + titleFontPx);
    curY += titleLineH;
  }
  ctx.restore();

  curY += 26;

  // 7. Two Side-by-Side Bento Stat Boxes
  const leftBoxX = innerX;
  const rightBoxX = innerX + bentoColW + bentoGap;

  fillRoundedRect(ctx, leftBoxX, curY, bentoColW, bentoBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);
  fillRoundedRect(ctx, rightBoxX, curY, bentoColW, bentoBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);

  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = `700 20px ${BODY_FONT}`;
  ctx.fillStyle = pal.bentoLabel;
  ctx.fillText(spec1Label, leftBoxX + 24, curY + 42);
  ctx.fillText(spec2Label, rightBoxX + 24, curY + 42);

  ctx.font = `700 24px ${DISPLAY_FONT}`;
  ctx.fillStyle = pal.bentoVal;
  let s1Y = curY + 80;
  for (const line of spec1Lines) {
    ctx.fillText(line, leftBoxX + 24, s1Y);
    s1Y += bentoValLineH;
  }

  ctx.fillStyle = pal.bentoAccent;
  let s2Y = curY + 80;
  for (const line of spec2Lines) {
    ctx.fillText(line, rightBoxX + 24, s2Y);
    s2Y += bentoValLineH;
  }
  ctx.restore();

  curY += bentoBoxH + 18;

  // 8. Key Feature Bento Box (Full Wrap, Zero Clip)
  fillRoundedRect(ctx, innerX, curY, innerW, featureBoxH, 24, pal.bentoBg, pal.bentoBorder, 1.5);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = `700 20px ${BODY_FONT}`;
  ctx.fillStyle = pal.featureLabel;
  ctx.fillText(spec3Label, innerX + 28, curY + 40);

  ctx.font = `600 25px ${BODY_FONT}`;
  ctx.fillStyle = pal.featureText;
  let fY = curY + 78;
  for (const line of featureLines) {
    ctx.fillText(line, innerX + 28, fY);
    fY += featureLineH;
  }
  ctx.restore();

  curY += featureBoxH;

  // 9. Highlight AI One-Liner Quote Card
  if (verdictLines.length > 0) {
    curY += 18;
    const qGrad = ctx.createLinearGradient(innerX, curY, innerX + innerW, curY + quoteBoxH);
    qGrad.addColorStop(0, pal.quoteBgStart);
    qGrad.addColorStop(1, pal.quoteBgEnd);
    fillRoundedRect(ctx, innerX, curY, innerW, quoteBoxH, 26, qGrad, pal.quoteBorder, 1.5);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 27px ${BODY_FONT}`;
    ctx.fillStyle = pal.quoteText;
    let qY = curY + 54;
    for (const line of verdictLines) {
      ctx.fillText(line, width / 2, qY);
      qY += verdictLineH;
    }
    ctx.restore();

    curY += quoteBoxH;
  }

  curY += 28;

  // 10. Clean Subtle Domain Watermark Pill (Zero Clutter!)
  ctx.save();
  ctx.font = `700 21px ${DISPLAY_FONT}`;
  const wmText = WATERMARK_DOMAIN;
  const wmW = Math.ceil(ctx.measureText(wmText).width) + 48;
  const wmX = Math.round((width - wmW) / 2);
  fillRoundedRect(ctx, wmX, curY, wmW, footerPillH, 22, pal.footerPillBg);
  ctx.fillStyle = pal.footerText;
  ctx.textAlign = 'center';
  ctx.fillText(wmText, width / 2, curY + 29);
  ctx.restore();

  return canvas;
}

function isMobileShareDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  if (navigator.maxTouchPoints > 1 && typeof window !== 'undefined' && window.innerWidth < 1024) return true;
  return false;
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve) => {
    if (!canvas) return resolve(null);
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => resolve(blob || null), 'image/png');
    } else if (typeof canvas.toDataURL === 'function') {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const b64 = dataUrl.split(',')[1] || '';
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve(new Blob([bytes], { type: 'image/png' }));
      } catch (_) {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
}

function downloadBlobAsFile(blob, filename) {
  if (!blob || typeof document === 'undefined') return false;
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, 1500);
  return true;
}

/**
 * Simplified 1-Button Share Preview Modal
 */
export function openShareModal(itemData, currentName = '', lang = 'ko') {
  if (typeof document === 'undefined') return;

  const dict = getDict(lang);
  const selectedLang = SHARE_UI_COPY[lang] ? lang : 'ko';
  const ui = SHARE_UI_COPY[selectedLang] || SHARE_UI_COPY.en;
  const trimmed = typeof currentName === 'string' ? currentName.trim() : '';
  const payload = buildSharePayload(itemData, trimmed, selectedLang);
  const brandHeader = dict.brandHeader || (selectedLang === 'ko' ? '나에게 어울리는 집' : 'The House That Suits You');

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
            <h3 class="share-modal-title" id="share-modal-title">🏠 ${brandHeader}</h3>
            <p class="share-modal-subtitle">${ui.subtitle}</p>
          </div>
          <button type="button" class="share-modal-close" id="share-modal-close-btn" aria-label="Close">×</button>
        </div>

        <div class="share-modal-body">
          <div class="theme-selector" role="tablist">
            <button type="button" class="theme-pill active" data-theme="cream">🤍 ${ui.themeCream}</button>
            <button type="button" class="theme-pill" data-theme="aurora">🌙 ${ui.themeAurora}</button>
            <button type="button" class="theme-pill" data-theme="peach">🍑 ${ui.themePeach}</button>
          </div>

          <div class="share-canvas-wrapper">
            <canvas id="share-story-canvas" width="1080" height="1560"></canvas>
            <div id="share-canvas-spinner" class="share-canvas-spinner" style="display: none;">
              ✨ ${ui.generating}
            </div>
          </div>

          <div class="share-actions">
            <button type="button" class="share-btn share-btn-unified" id="share-action-unified">
              <span>📥</span>
              <span>${ui.unifiedBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  let currentTheme = 'cream';
  let renderPromise = null;
  const canvas = document.getElementById('share-story-canvas');
  const spinner = document.getElementById('share-canvas-spinner');

  const updateCanvas = (t) => {
    currentTheme = t;
    if (spinner) spinner.style.display = 'flex';
    renderPromise = renderStoryCanvas(canvas, itemData, trimmed, currentTheme, selectedLang)
      .finally(() => {
        if (spinner) spinner.style.display = 'none';
      });
    return renderPromise;
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
      updateCanvas(pill.getAttribute('data-theme') || 'cream');
    });
  });

  const getExportFilename = () => {
    const lv = itemData?.level ?? 0;
    const sanitized = (trimmed || 'myhome').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
    return `myhome_${sanitized}_lv${lv}.png`;
  };

  const handleDirectDownload = async () => {
    if (renderPromise) await renderPromise;
    const blob = await canvasToPngBlob(canvas);
    if (blob) {
      downloadBlobAsFile(blob, getExportFilename());
      showToast(`📥 ${ui.savedToast}`);
    }
  };

  const unifiedBtn = document.getElementById('share-action-unified');
  if (unifiedBtn) {
    unifiedBtn.addEventListener('click', async () => {
      if (renderPromise) await renderPromise;
      const blob = await canvasToPngBlob(canvas);
      if (!blob) return;
      const filename = getExportFilename();

      // On Mobile (iOS/Android), open native Share Sheet with PNG file (Instagram / KakaoTalk / Save Image in 1 tap)
      if (isMobileShareDevice() && typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof File === 'function') {
        try {
          const file = new File([blob], filename, { type: 'image/png' });
          if (!navigator.canShare || navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: payload.title,
              text: `${payload.title}\n${formatReadableShareUrl(payload.url)}`
            });
            showToast(`✨ ${ui.sharedToast}`);
            return;
          }
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }

      // Desktop (or fallback): Direct PNG download
      downloadBlobAsFile(blob, filename);
      showToast(`📥 ${ui.savedToast}`);
    });
  }

  const saveDirectBtn = document.getElementById('share-action-save-direct');
  if (saveDirectBtn) {
    saveDirectBtn.addEventListener('click', handleDirectDownload);
  }

  const copyUrlBtn = document.getElementById('share-action-copy-url');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      copyShareUrl(itemData, trimmed, selectedLang);
    });
  }
}
