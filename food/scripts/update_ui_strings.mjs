// scripts/update_ui_strings.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const i18nPath = path.join(ROOT_DIR, 'src', 'lib', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const EXTRA_KEYS = {
  ko: {
    gallerySearchPlaceholder: "음식 이름 검색 (예: 떡볶이, 파스타, 샐러드...)",
    galleryRandomBtn: "랜덤 추천",
    galleryRandomTitle: "선택 카테고리에서 무작위 추천",
    gallerySelectedCount: "선택된 메뉴:",
    galleryCountUnit: "개",
    detailBackBtn: "← 도감으로 돌아가기",
    galleryEmptyTitle: "검색된 음식이 없습니다",
    galleryEmptySub: "다른 검색어나 카테고리를 선택해보세요.",
    toastCategoryRandomPick: "🎲 같은 카테고리의 새로운 메뉴를 골랐습니다!"
  },
  en: {
    gallerySearchPlaceholder: "Search food name (e.g. Pasta, Pizza, Steak...)",
    galleryRandomBtn: "Random Pick",
    galleryRandomTitle: "Random recommendation within selected category",
    gallerySelectedCount: "Showing dishes:",
    galleryCountUnit: " items",
    detailBackBtn: "← Back to Gallery",
    galleryEmptyTitle: "No foods found",
    galleryEmptySub: "Try a different search keyword or category filter.",
    toastCategoryRandomPick: "🎲 Picked another dish in this category!"
  },
  hi: {
    gallerySearchPlaceholder: "भोजन का नाम खोजें (उदा: पास्ता, पिज्जा, स्टेक...)",
    galleryRandomBtn: "यादृच्छिक",
    galleryRandomTitle: "चयनित श्रेणी से यादृच्छिक सिफारिश",
    gallerySelectedCount: "चयनित व्यंजन:",
    galleryCountUnit: " व्यंजन",
    detailBackBtn: "← गैलरी पर वापस",
    galleryEmptyTitle: "कोई व्यंजन नहीं मिला",
    galleryEmptySub: "कृपया भिन्न खोज शब्द या श्रेणी फ़िल्टर आज़माएँ।",
    toastCategoryRandomPick: "🎲 इस श्रेणी में एक और व्यंजन चुना गया!"
  },
  vi: {
    gallerySearchPlaceholder: "Tìm kiếm món ăn (ví dụ: Mì Ý, Pizza, Bít tết...)",
    galleryRandomBtn: "Chọn ngẫu nhiên",
    galleryRandomTitle: "Đề xuất ngẫu nhiên trong danh mục đã chọn",
    gallerySelectedCount: "Món ăn đang hiển thị:",
    galleryCountUnit: " món",
    detailBackBtn: "← Quay lại bộ sưu tập",
    galleryEmptyTitle: "Không tìm thấy món ăn nào",
    galleryEmptySub: "Hãy thử từ khóa tìm kiếm hoặc bộ lọc danh mục khác.",
    toastCategoryRandomPick: "🎲 Đã chọn một món mới trong cùng danh mục!"
  },
  fr: {
    gallerySearchPlaceholder: "Rechercher un plat (ex. Pâtes, Pizza, Steak...)",
    galleryRandomBtn: "Au hasard",
    galleryRandomTitle: "Recommandation aléatoire dans la catégorie choisie",
    gallerySelectedCount: "Plats affichés :",
    galleryCountUnit: " plats",
    detailBackBtn: "← Retour à la galerie",
    galleryEmptyTitle: "Aucun plat trouvé",
    galleryEmptySub: "Essayez un autre mot-clé de recherche ou un autre filtre de catégorie.",
    toastCategoryRandomPick: "🎲 Un autre plat de cette catégorie a été choisi !"
  },
  pt: {
    gallerySearchPlaceholder: "Buscar nome da comida (ex.: Massa, Pizza, Bife...)",
    galleryRandomBtn: "Aleatório",
    galleryRandomTitle: "Recomendação aleatória na categoria selecionada",
    gallerySelectedCount: "Pratos exibidos:",
    galleryCountUnit: " pratos",
    detailBackBtn: "← Voltar à galeria",
    galleryEmptyTitle: "Nenhum prato encontrado",
    galleryEmptySub: "Tente uma palavra-chave de busca ou filtro de categoria diferente.",
    toastCategoryRandomPick: "🎲 Outro prato desta categoria foi selecionado!"
  },
  es: {
    gallerySearchPlaceholder: "Buscar nombre de comida (ej.: Pasta, Pizza, Filete...)",
    galleryRandomBtn: "Aleatorio",
    galleryRandomTitle: "Recomendación aleatoria dentro de la categoría seleccionada",
    gallerySelectedCount: "Platos mostrados:",
    galleryCountUnit: " platos",
    detailBackBtn: "← Volver a la galería",
    galleryEmptyTitle: "No se encontraron platos",
    galleryEmptySub: "Intenta con otra palabra clave de búsqueda o filtro de categoría.",
    toastCategoryRandomPick: "🎲 ¡Se eligió otro plato de esta categoría!"
  },
  id: {
    gallerySearchPlaceholder: "Cari nama makanan (contoh: Pasta, Pizza, Steak...)",
    galleryRandomBtn: "Pilihan Acak",
    galleryRandomTitle: "Rekomendasi acak dalam kategori yang dipilih",
    gallerySelectedCount: "Menu terpilih:",
    galleryCountUnit: " menu",
    detailBackBtn: "← Kembali ke Galeri",
    galleryEmptyTitle: "Makanan tidak ditemukan",
    galleryEmptySub: "Coba kata kunci pencarian atau filter kategori lainnya.",
    toastCategoryRandomPick: "🎲 Memilih menu baru dalam kategori yang sama!"
  },
  ru: {
    gallerySearchPlaceholder: "Поиск блюда (напр., Паста, Пицца, Стейк...)",
    galleryRandomBtn: "Случайный выбор",
    galleryRandomTitle: "Случайная рекомендация в выбранной категории",
    gallerySelectedCount: "Выбрано блюд:",
    galleryCountUnit: " шт.",
    detailBackBtn: "← Назад в галерею",
    galleryEmptyTitle: "Блюда не найдены",
    galleryEmptySub: "Попробуйте изменить поисковый запрос или фильтр категорий.",
    toastCategoryRandomPick: "🎲 Выбрано новое блюдо в этой категории!"
  },
  de: {
    gallerySearchPlaceholder: "Gericht suchen (z. B. Pasta, Pizza, Steak...)",
    galleryRandomBtn: "Zufallsauswahl",
    galleryRandomTitle: "Zufallsempfehlung in der ausgewählten Kategorie",
    gallerySelectedCount: "Ausgewählte Gerichte:",
    galleryCountUnit: " Gerichte",
    detailBackBtn: "← Zurück zur Galerie",
    galleryEmptyTitle: "Keine Gerichte gefunden",
    galleryEmptySub: "Versuchen Sie ein anderes Suchwort oder einen anderen Kategoriefilter.",
    toastCategoryRandomPick: "🎲 Ein neues Gericht aus dieser Kategorie ausgewählt!"
  },
  it: {
    gallerySearchPlaceholder: "Cerca piatto (es. Pasta, Pizza, Bistecca...)",
    galleryRandomBtn: "Scelta casuale",
    galleryRandomTitle: "Raccomandazione casuale nella categoria selezionata",
    gallerySelectedCount: "Piatti mostrati:",
    galleryCountUnit: " piatti",
    detailBackBtn: "← Torna alla galleria",
    galleryEmptyTitle: "Nessun piatto trovato",
    galleryEmptySub: "Prova un'altra parola chiave di ricerca o un altro filtro di categoria.",
    toastCategoryRandomPick: "🎲 Scelto un altro piatto di questa categoria!"
  },
  ja: {
    gallerySearchPlaceholder: "料理名を検索（例：パスタ、ピザ、ステーキ...）",
    galleryRandomBtn: "ランダム推薦",
    galleryRandomTitle: "選択カテゴリーからランダム推薦",
    gallerySelectedCount: "表示中のメニュー：",
    galleryCountUnit: "品",
    detailBackBtn: "← 図鑑に戻る",
    galleryEmptyTitle: "該当する料理が見つかりません",
    galleryEmptySub: "別の検索ワードやカテゴリーを選択してみてください。",
    toastCategoryRandomPick: "🎲 同じカテゴリーから新しいメニューを選びました！"
  },
  zh: {
    gallerySearchPlaceholder: "搜索美食名称（例如：意面、披萨、牛排...）",
    galleryRandomBtn: "随机推荐",
    galleryRandomTitle: "在当前分类中随机推荐",
    gallerySelectedCount: "当前展示美食：",
    galleryCountUnit: "道",
    detailBackBtn: "← 返回图鉴",
    galleryEmptyTitle: "未找到相关美食",
    galleryEmptySub: "请尝试更换搜索关键词或选择其他分类。",
    toastCategoryRandomPick: "🎲 已为您挑选同分类下的新菜品！"
  },
  ms: {
    gallerySearchPlaceholder: "Cari nama makanan (cth: Pasta, Piza, Stik...)",
    galleryRandomBtn: "Pilihan Rawak",
    galleryRandomTitle: "Cadangan rawak dalam kategori yang dipilih",
    gallerySelectedCount: "Menu dipilih:",
    galleryCountUnit: " hidangan",
    detailBackBtn: "← Kembali ke Galeri",
    galleryEmptyTitle: "Tiada makanan ditemui",
    galleryEmptySub: "Cuba kata kunci carian atau penapis kategori lain.",
    toastCategoryRandomPick: "🎲 Menu baharu dalam kategori yang sama telah dipilih!"
  }
};

// Import existing UI_STRINGS
import { UI_STRINGS, SUPPORTED_LANGUAGES, ORIGIN_GROUP_KEYS } from '../src/lib/i18n.js';

// Merge extra keys into UI_STRINGS
for (const [lang, keys] of Object.entries(EXTRA_KEYS)) {
  if (UI_STRINGS[lang]) {
    Object.assign(UI_STRINGS[lang], keys);
  }
}

// Rebuild src/lib/i18n.js clean output
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

// Find where functions start in current i18n.js
const funcStartIndex = content.indexOf('export function normalizeLang(');
if (funcStartIndex === -1) {
  throw new Error('Could not find normalizeLang in i18n.js');
}
const funcSection = content.slice(funcStartIndex);

const finalContent = fileHeader + '\n' + funcSection;
fs.writeFileSync(i18nPath, finalContent, 'utf8');
console.log('✔ Successfully updated UI_STRINGS with all 9 gallery keys across 14 languages');
