// scripts/add_whatsapp_keys.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const i18nPath = path.join(ROOT_DIR, 'src', 'lib', 'i18n.js');

const NEW_KEYS = {
  ko: {
    shareWhatsAppBtn: "WhatsApp 공유",
    toastWhatsAppSuccess: "💬 WhatsApp 공유 창이 열렸습니다!",
    downloadPngBtn: "이미지 저장 (PNG)",
    shareFoodLinkBtn: "음식 링크 복사",
    randomSameCatBtn: "같은 카테고리 다른 음식",
    calLabel: "열량",
    priceLabel: "예상 가격",
    shareFoodCta: "지금 도감에서 401가지 맛있는 일러스트 메뉴를 확인해보세요!",
    galleryBadge: "일러스트 도감"
  },
  en: {
    shareWhatsAppBtn: "Share via WhatsApp",
    toastWhatsAppSuccess: "💬 WhatsApp share window opened!",
    downloadPngBtn: "Save Image (PNG)",
    shareFoodLinkBtn: "Copy Food Link",
    randomSameCatBtn: "Another Dish in Category",
    calLabel: "Calories",
    priceLabel: "Estimated Price",
    shareFoodCta: "Explore 401 delicious illustrated dishes now on Mukbang!",
    galleryBadge: "FOOD SHOWCASE"
  },
  hi: {
    shareWhatsAppBtn: "व्हाट्सएप पर साझा करें",
    toastWhatsAppSuccess: "💬 व्हाट्सएप शेयर विंडो खुल गई!",
    downloadPngBtn: "छवि सहेजें (PNG)",
    shareFoodLinkBtn: "व्यंजन लिंक कॉपी करें",
    randomSameCatBtn: "इसी श्रेणी का दूसरा व्यंजन",
    calLabel: "कैलोरी",
    priceLabel: "अनुमानित मूल्य",
    shareFoodCta: "अभी मुकबांग पर 401 स्वादिष्ट सचित्र व्यंजन देखें!",
    galleryBadge: "व्यंजन शोकेस"
  },
  vi: {
    shareWhatsAppBtn: "Chia sẻ qua WhatsApp",
    toastWhatsAppSuccess: "💬 Đã mở cửa sổ chia sẻ WhatsApp!",
    downloadPngBtn: "Lưu hình ảnh (PNG)",
    shareFoodLinkBtn: "Sao chép liên kết món",
    randomSameCatBtn: "Món khác cùng danh mục",
    calLabel: "Lượng calo",
    priceLabel: "Giá dự kiến",
    shareFoodCta: "Khám phá ngay 401 món ăn minh họa thơm ngon trên Mukbang!",
    galleryBadge: "BỘ SƯU TẬP MÓN ĂN"
  },
  fr: {
    shareWhatsAppBtn: "Partager sur WhatsApp",
    toastWhatsAppSuccess: "💬 Fenêtre de partage WhatsApp ouverte !",
    downloadPngBtn: "Enregistrer l'image (PNG)",
    shareFoodLinkBtn: "Copier le lien du plat",
    randomSameCatBtn: "Autre plat dans cette catégorie",
    calLabel: "Calories",
    priceLabel: "Prix estimé",
    shareFoodCta: "Découvrez dès maintenant 401 délicieux plats illustrés sur Mukbang !",
    galleryBadge: "VITRINE GOURMANDE"
  },
  pt: {
    shareWhatsAppBtn: "Compartilhar no WhatsApp",
    toastWhatsAppSuccess: "💬 Janela de compartilhamento do WhatsApp aberta!",
    downloadPngBtn: "Salvar Imagem (PNG)",
    shareFoodLinkBtn: "Copiar Link do Prato",
    randomSameCatBtn: "Outro prato nesta categoria",
    calLabel: "Calorias",
    priceLabel: "Preço estimado",
    shareFoodCta: "Explore agora 401 deliciosos pratos ilustrados no Mukbang!",
    galleryBadge: "VITRINE GASTRONÔMICA"
  },
  es: {
    shareWhatsAppBtn: "Compartir en WhatsApp",
    toastWhatsAppSuccess: "💬 ¡Ventana de compartir en WhatsApp abierta!",
    downloadPngBtn: "Guardar imagen (PNG)",
    shareFoodLinkBtn: "Copiar enlace del plato",
    randomSameCatBtn: "Otro plato de esta categoría",
    calLabel: "Calorías",
    priceLabel: "Precio estimado",
    shareFoodCta: "¡Descubre ahora 401 deliciosos platos ilustrados en Mukbang!",
    galleryBadge: "MUESTRA GASTRONÓMICA"
  },
  id: {
    shareWhatsAppBtn: "Bagikan via WhatsApp",
    toastWhatsAppSuccess: "💬 Jendela berbagi WhatsApp terbuka!",
    downloadPngBtn: "Simpan Gambar (PNG)",
    shareFoodLinkBtn: "Salin Tautan Makanan",
    randomSameCatBtn: "Menu lain dalam kategori ini",
    calLabel: "Kalori",
    priceLabel: "Perkiraan Harga",
    shareFoodCta: "Jelajahi 401 hidangan berilustrasi lezat sekarang di Mukbang!",
    galleryBadge: "ETALASE KULINER"
  },
  ru: {
    shareWhatsAppBtn: "Поделиться в WhatsApp",
    toastWhatsAppSuccess: "💬 Окно отправки в WhatsApp открыто!",
    downloadPngBtn: "Сохранить изображение (PNG)",
    shareFoodLinkBtn: "Скопировать ссылку на блюдо",
    randomSameCatBtn: "Другое блюдо в этой категории",
    calLabel: "Калории",
    priceLabel: "Примерная цена",
    shareFoodCta: "Ознакомьтесь с 401 аппетитным блюдом прямо сейчас на Mukbang!",
    galleryBadge: "ГАЛЕРЕЯ БЛЮД"
  },
  de: {
    shareWhatsAppBtn: "Über WhatsApp teilen",
    toastWhatsAppSuccess: "💬 WhatsApp-Teilen geöffnet!",
    downloadPngBtn: "Bild speichern (PNG)",
    shareFoodLinkBtn: "Gericht-Link kopieren",
    randomSameCatBtn: "Anderes Gericht in dieser Kategorie",
    calLabel: "Kalorien",
    priceLabel: "Geschätzter Preis",
    shareFoodCta: "Entdecken Sie jetzt 401 köstliche illustrierte Gerichte auf Mukbang!",
    galleryBadge: "SPEISEN-GALERIE"
  },
  it: {
    shareWhatsAppBtn: "Condividi su WhatsApp",
    toastWhatsAppSuccess: "💬 Finestra di condivisione WhatsApp aperta!",
    downloadPngBtn: "Salva immagine (PNG)",
    shareFoodLinkBtn: "Copia link del piatto",
    randomSameCatBtn: "Un altro piatto di questa categoria",
    calLabel: "Calorie",
    priceLabel: "Prezzo stimato",
    shareFoodCta: "Scopri subito 401 deliziosi piatti illustrati su Mukbang!",
    galleryBadge: "VETRINA DEI PIATTI"
  },
  ja: {
    shareWhatsAppBtn: "WhatsAppで共有",
    toastWhatsAppSuccess: "💬 WhatsApp共有画面を開きました！",
    downloadPngBtn: "画像を保存 (PNG)",
    shareFoodLinkBtn: "料理リンクをコピー",
    randomSameCatBtn: "同じカテゴリーの別の料理",
    calLabel: "カロリー",
    priceLabel: "予想価格",
    shareFoodCta: "今すぐMukbangで401種類の美味しいイラストメニューをチェック！",
    galleryBadge: "料理ショーケース"
  },
  zh: {
    shareWhatsAppBtn: "通过WhatsApp分享",
    toastWhatsAppSuccess: "💬 已打开WhatsApp分享！",
    downloadPngBtn: "保存图片 (PNG)",
    shareFoodLinkBtn: "复制美食链接",
    randomSameCatBtn: "同分类其他美食",
    calLabel: "热量",
    priceLabel: "参考价格",
    shareFoodCta: "立即在Mukbang查看401道精美手绘美食！",
    galleryBadge: "美食图鉴"
  },
  ms: {
    shareWhatsAppBtn: "Kongsi melalui WhatsApp",
    toastWhatsAppSuccess: "💬 Tetingkap perkongsian WhatsApp telah dibuka!",
    downloadPngBtn: "Simpan Imej (PNG)",
    shareFoodLinkBtn: "Salin Pautan Hidangan",
    randomSameCatBtn: "Hidangan lain dalam kategori ini",
    calLabel: "Kalori",
    priceLabel: "Anggaran Harga",
    shareFoodCta: "Terokai 401 hidangan berilustrasi yang lazat sekarang di Mukbang!",
    galleryBadge: "PAMERAN HIDANGAN"
  }
};

import { UI_STRINGS, SUPPORTED_LANGUAGES, ORIGIN_GROUP_KEYS } from '../src/lib/i18n.js';

for (const [lang, keys] of Object.entries(NEW_KEYS)) {
  if (UI_STRINGS[lang]) {
    Object.assign(UI_STRINGS[lang], keys);
  }
}

let content = fs.readFileSync(i18nPath, 'utf8');
const funcStartIndex = content.indexOf('export function normalizeLang(');
if (funcStartIndex === -1) {
  throw new Error('Could not find normalizeLang in i18n.js');
}
const funcSection = content.slice(funcStartIndex);

const fileHeader = `// src/lib/i18n.js — 14-Language Comprehensive Internationalization Engine for Mukbang
// Supports: ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms

export const DEFAULT_LANGUAGE = 'ko';

export const SUPPORTED_LANGUAGES = ${JSON.stringify(SUPPORTED_LANGUAGES, null, 2)};

export const SUPPORTED_LANG_CODES = SUPPORTED_LANGUAGES.map(l => l.code);

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(l => [l.code, l])
);

export const ORIGIN_GROUP_KEYS = ${JSON.stringify(ORIGIN_GROUP_KEYS, null, 2)};

export const UI_STRINGS = ${JSON.stringify(UI_STRINGS, null, 2)};
`;

fs.writeFileSync(i18nPath, fileHeader + '\n' + funcSection, 'utf8');
console.log('✔ Successfully added WhatsApp and sharing keys across all 14 languages');
