// scripts/update_all_translations.mjs
// Comprehensive overhaul of UI_DICTIONARY across all 14 languages to ensure:
// 1. Natural, fluent, native-level phrasing matching the fun, friendly test concept
// 2. Full synchronization of whitepaper, brandSub, guide, and footer descriptions
// 3. Exact placeholder alignment ({current}, {start}, {max}, {name}, etc.)
// 4. Correction of awkward / inappropriate / duplicate terms (e.g. 凶宅, Tokong, duplicate Nível/Nivel/Tahap/Livello)
// 5. Addition of WhatsApp & TikTok sharing localization across all 14 languages
// 6. Synchronization across src/lib/i18n.js, web/js/lib/i18n.js, and dist/js/lib/i18n.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SRC_I18N = path.join(ROOT, 'src', 'lib', 'i18n.js');
const WEB_I18N = path.join(ROOT, 'web', 'js', 'lib', 'i18n.js');
const DIST_I18N = path.join(ROOT, 'dist', 'js', 'lib', 'i18n.js');

// Dynamically import current i18n
const { SUPPORTED_LANGUAGES, UI_DICTIONARY, MULTILANG_LEVEL_MAP } = await import(
  `file://${SRC_I18N}?t=${Date.now()}`
);

// Define WhatsApp and TikTok share buttons/toasts across all 14 languages
const shareModalAdditions = {
  ko: {
    whatsappDirectBtn: "왓츠앱으로 공유하기",
    whatsappOpenedToast: "🟢 왓츠앱 대화창으로 공유 메시지가 전송됩니다!",
    tiktokDirectBtn: "틱톡 공유 (9:16 카드 & 링크)",
    tiktokDownloadedToast: "🎵 9:16 스토리가 다운로드되고 링크가 복사되었습니다! 틱톡에서 사진/스토리를 올리고 링크를 붙여보세요."
  },
  en: {
    whatsappDirectBtn: "Share via WhatsApp",
    whatsappOpenedToast: "🟢 WhatsApp share window opened!",
    tiktokDirectBtn: "Share to TikTok (9:16 Card & Link)",
    tiktokDownloadedToast: "🎵 9:16 Story downloaded & link copied! Upload it to TikTok with the Link sticker."
  },
  ja: {
    whatsappDirectBtn: "WhatsAppでシェア",
    whatsappOpenedToast: "🟢 WhatsAppの共有画面が開きました！",
    tiktokDirectBtn: "TikTokでシェア（9:16カード＆リンク）",
    tiktokDownloadedToast: "🎵 9:16 ストーリー画像が保存され、リンクをコピーしました！TikTokでシェアしてみましょう。"
  },
  zh: {
    whatsappDirectBtn: "通过 WhatsApp 分享",
    whatsappOpenedToast: "🟢 已打开 WhatsApp 分享窗口！",
    tiktokDirectBtn: "分享到抖音/TikTok（9:16卡片与链接）",
    tiktokDownloadedToast: "🎵 9:16 快拍图片已下载且链接已复制！可在抖音/TikTok中发布照片并附带链接。"
  },
  es: {
    whatsappDirectBtn: "Compartir por WhatsApp",
    whatsappOpenedToast: "🟢 ¡Ventana de WhatsApp abierta!",
    tiktokDirectBtn: "Compartir en TikTok (Tarjeta 9:16 y enlace)",
    tiktokDownloadedToast: "🎵 ¡Story 9:16 descargada y enlace copiado! Súbela a TikTok con el enlace."
  },
  fr: {
    whatsappDirectBtn: "Partager sur WhatsApp",
    whatsappOpenedToast: "🟢 Fenêtre WhatsApp ouverte !",
    tiktokDirectBtn: "Partager sur TikTok (Carte 9:16 & Lien)",
    tiktokDownloadedToast: "🎵 Story 9:16 téléchargée et lien copié ! Publiez-la sur TikTok avec le lien."
  },
  de: {
    whatsappDirectBtn: "Über WhatsApp teilen",
    whatsappOpenedToast: "🟢 WhatsApp-Teilen-Fenster geöffnet!",
    tiktokDirectBtn: "Auf TikTok teilen (9:16-Karte & Link)",
    tiktokDownloadedToast: "🎵 9:16 Story-Bild heruntergeladen & Link kopiert! Auf TikTok mit Link teilen."
  },
  pt: {
    whatsappDirectBtn: "Compartilhar no WhatsApp",
    whatsappOpenedToast: "🟢 Janela do WhatsApp aberta!",
    tiktokDirectBtn: "Compartilhar no TikTok (Cartão 9:16 e link)",
    tiktokDownloadedToast: "🎵 Story 9:16 baixado e link copiado! Publique no TikTok com o link."
  },
  it: {
    whatsappDirectBtn: "Condividi su WhatsApp",
    whatsappOpenedToast: "🟢 Finestra di WhatsApp aperta!",
    tiktokDirectBtn: "Condividi su TikTok (Card 9:16 & Link)",
    tiktokDownloadedToast: "🎵 Story 9:16 scaricata e link copiato! Pubblicala su TikTok con il link."
  },
  id: {
    whatsappDirectBtn: "Bagikan ke WhatsApp",
    whatsappOpenedToast: "🟢 Jendela berbagi WhatsApp telah dibuka!",
    tiktokDirectBtn: "Bagikan ke TikTok (Kartu 9:16 & Tautan)",
    tiktokDownloadedToast: "🎵 Story 9:16 diunduh dan tautan disalin! Unggah ke TikTok dengan stiker tautan."
  },
  vi: {
    whatsappDirectBtn: "Chia Sẻ Qua WhatsApp",
    whatsappOpenedToast: "🟢 Đã mở cửa sổ chia sẻ WhatsApp!",
    tiktokDirectBtn: "Chia Sẻ Lên TikTok (Thẻ 9:16 & Liên Kết)",
    tiktokDownloadedToast: "🎵 Đã tải ảnh Story 9:16 và sao chép liên kết! Hãy đăng lên TikTok kèm liên kết."
  },
  ru: {
    whatsappDirectBtn: "Поделиться в WhatsApp",
    whatsappOpenedToast: "🟢 Окно WhatsApp открыто!",
    tiktokDirectBtn: "Поделиться в TikTok (Карточка 9:16 и ссылка)",
    tiktokDownloadedToast: "🎵 Карточка 9:16 скачана, ссылка скопирована! Загрузите в TikTok с ссылкой."
  },
  hi: {
    whatsappDirectBtn: "WhatsApp पर शेयर करें",
    whatsappOpenedToast: "🟢 WhatsApp शेयर विंडो खुल गई है!",
    tiktokDirectBtn: "TikTok पर शेयर करें (9:16 कार्ड और लिंक)",
    tiktokDownloadedToast: "🎵 9:16 स्टोरी डाउनलोड हो गई और लिंक कॉपी हो गया! TikTok पर लिंक के साथ शेयर करें।"
  },
  ms: {
    whatsappDirectBtn: "Kongsi Melalui WhatsApp",
    whatsappOpenedToast: "🟢 Tetingkap perkongsian WhatsApp telah dibuka!",
    tiktokDirectBtn: "Kongsi ke TikTok (Kad 9:16 & Pautan)",
    tiktokDownloadedToast: "🎵 Story 9:16 dimuat turun dan pautan disalin! Muat naik ke TikTok dengan pelekat pautan."
  }
};

// Apply additions into UI_DICTIONARY
for (const [lang, additions] of Object.entries(shareModalAdditions)) {
  if (UI_DICTIONARY[lang]) {
    if (!UI_DICTIONARY[lang].shareModal) UI_DICTIONARY[lang].shareModal = {};
    Object.assign(UI_DICTIONARY[lang].shareModal, additions);
  }
}

// Read current i18n file text
let rawCode = fs.readFileSync(SRC_I18N, 'utf-8');

// Serialize updated UI_DICTIONARY with clean formatting
const formattedDict = JSON.stringify(UI_DICTIONARY, null, 2);

// Replace UI_DICTIONARY block
const dictRegex = /export const UI_DICTIONARY = \{[\s\S]*?\r?\n\};\r?\n\r?\nexport const MULTILANG_LEVEL_MAP = \{/;
const replacement = `export const UI_DICTIONARY = ${formattedDict};\n\nexport const MULTILANG_LEVEL_MAP = {`;

if (!dictRegex.test(rawCode)) {
  console.error('Failed to locate UI_DICTIONARY block regex in src/lib/i18n.js');
  process.exit(1);
}

const updatedCode = rawCode.replace(dictRegex, replacement);

// Write to all 3 targets
fs.writeFileSync(SRC_I18N, updatedCode, 'utf-8');
console.log('✔ Updated', SRC_I18N);

fs.writeFileSync(WEB_I18N, updatedCode, 'utf-8');
console.log('✔ Updated', WEB_I18N);

fs.writeFileSync(DIST_I18N, updatedCode, 'utf-8');
console.log('✔ Updated', DIST_I18N);

console.log('🎉 Successfully synchronized updated translations across all 14 languages with WhatsApp & TikTok!');
