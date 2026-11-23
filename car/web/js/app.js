import { renderCrossLevelSectionHtml } from './lib/cross_level_map.js';
// web/js/app.js — 나에게 어울리는 자동차 (MyCar) Frontend Application
// Features: 14-Language Switcher, Name Search, Random Name Dice, Vehicle Appraisal Card,
//           Name Stroke Breakdown Accordion, Step Navigation Dock, 9:16 Story Share, Ideal-Type World Cup Tabs

import { analyzeNameToCar } from './lib/hash.js';
import * as taxonomyMod from './lib/taxonomy.js';
import {
  getNextActiveLevel,
  getPrevActiveLevel,
  getRandomActiveLevel,
  MAX_LEVEL,
  GOOD_CAR_THRESHOLD
} from './lib/constants.js';
import { openShareModal, copyShareUrl, renderStoryCanvas } from './share.js';
import * as i18nMod from './lib/i18n.js';
import { getSitemapNameForLevel } from './lib/level_name_map.js';
import {
  openWorldCupMode,
  setWorldCupLanguage,
  renderWorldCup,
  getWorldCupUiLabels
} from './worldcup.js';

const GOOD_THRESHOLD = typeof GOOD_CAR_THRESHOLD === 'number' ? GOOD_CAR_THRESHOLD : 500;

const DEFAULT_SUPPORTED_LANGUAGES = [
  { code: 'ko', sampleNames: ['김서윤', '이민준', '홍길동', '해리포터', '손흥민'] },
  { code: 'en', sampleNames: ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah'] },
  { code: 'hi', sampleNames: ['Aarav', 'Diya', 'Vihaan', 'Ananya', 'Rohan'] },
  { code: 'vi', sampleNames: ['Minh', 'Linh', 'Anh', 'Hùng', 'Trang'] },
  { code: 'fr', sampleNames: ['Lucas', 'Emma', 'Gabriel', 'Chloé', 'Jules'] },
  { code: 'pt', sampleNames: ['Miguel', 'Helena', 'Arthur', 'Alice', 'Gael'] },
  { code: 'es', sampleNames: ['Mateo', 'Sofía', 'Santiago', 'Valentina', 'Leo'] },
  { code: 'id', sampleNames: ['Budi', 'Siti', 'Rizky', 'Putri', 'Agus'] },
  { code: 'ru', sampleNames: ['Александр', 'София', 'Максим', 'Анна', 'Михаил'] },
  { code: 'de', sampleNames: ['Noah', 'Emilia', 'Matteo', 'Mia', 'Leon'] },
  { code: 'it', sampleNames: ['Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Alessandro'] },
  { code: 'ja', sampleNames: ['Haruto', 'Yui', 'Sora', 'Hina', 'Ren'] },
  { code: 'zh', sampleNames: ['Wei', 'Fang', 'Hao', 'Yuhan', 'Zihan'] },
  { code: 'ms', sampleNames: ['Aisyah', 'Ahmad', 'Nur', 'Muhammad', 'Siti'] }
];

const CAR_UI_FALLBACKS = {
  ko: {
    familyNav: {
      car: '나에게 어울리는 자동차',
      job: '나에게 어울리는 직업',
      myhome: '나에게 어울리는 집',
      food: '나에게 어울리는 음식',
      photodiary: '포토다이어리'
    },
    brandHeader: '나에게 어울리는 자동차',
    brandSub: '이름만 입력해서 찾는 재미로 보는 탈것 테스트 · 0~1000단계 다중우주 차고 감정소',
    searchPlaceholder: '이름을 입력하세요 (예: 김서윤, 해리포터, 홍길동, Steve...)',
    searchBtn: '내 자동차 찾기',
    sampleLabel: '추천 이름:',
    ownerTitle: '{name}님에게 어울리는 자동차',
    zones: { GOOD: '대박 탈것', BAD: '폭망 탈것' },
    reality: { REAL: '실제 탈것·생물', FICTION: '허구·마법·SF' },
    specs: {
      eraLabel: '언제 타던 탈것인지 (연식·시대)',
      priceLabel: '추산 가격·유지비',
      featureLabel: '탈것의 특별한 기능·주행성능',
      aiVerdictLabel: 'AI 수석 정비사 한 줄 시승 총평'
    },
    stroke: {
      summary: '✍️ 이름 획수·자모 조화 분석 ({name} · 총 {total}획 → Lv.{level})',
      unit: '획',
      harmony: '인접 획수 조화값',
      pyramidTitle: 'name_teller 인접 획수 합산 단계'
    },
    prevCarBtn: '◀ 이전 단계 탈것',
    nextCarBtn: '다음 단계 탈것 ▶',
    randomCarBtn: '🎲 랜덤 탈것',
    openShareModalBtn: '인스타 스토리 / 카톡 공유 카드 만들기',
    copyUrlBtn: '결과 링크 복사',
    returnMyCarText: '내 원래 자동차({name} · Lv.{level})로 돌아가기',
    returnMyCarDefault: '내 원래 자동차로 돌아가기',
    photoDiaryLink: '포토 다이어리',
    myJobLink: '내 직업 찾기',
    enterNameToast: '이름을 입력해주세요!',
    randomDiceToast: "🎲 랜덤 이름 '{name}' 시승 감정 완료!",
    refreshChipsToast: '🔄 추천 이름이 새로고침되었습니다!',
    loadingText: 'AI 수석 정비사가 다중우주 차고 등기부를 조회하고 있습니다...',
    loadingWithName: 'AI 수석 정비사가 [{name}]님의 차고를 감정 중입니다...',
    dockKeyboardHint: '💡 키보드 좌우 방향키(← / →)로 단계 이동, 스페이스바(Space)로 랜덤 탐색할 수 있습니다.',
    footerBrand: '나에게 어울리는 자동차 (MyCar)',
    footerDesc: '본 서비스는 이름만 입력해서 재미로 보는 나에게 어울리는 자동차 매칭 테스트 및 탈것 이상형 월드컵입니다.'
  },
  en: {
    familyNav: {
      car: 'My Car',
      job: 'My Job',
      myhome: 'My Home',
      food: 'My Food',
      photodiary: 'Photo Diary'
    },
    brandHeader: 'The Ride That Suits You',
    brandSub: 'Fun Name-Based Vehicle & Mount Appraisal (Lv. 0~1000)',
    searchPlaceholder: 'Enter a name (e.g. Steve, Emma, Harry, Alex...)',
    searchBtn: 'Find My Ride',
    sampleLabel: 'Trending Names:',
    ownerTitle: 'The Ride That Suits {name}',
    zones: { GOOD: 'Dream Ride', BAD: 'Doom Ride' },
    reality: { REAL: 'Real Vehicle / Mount', FICTION: 'Fictional / Magic / Sci-Fi' },
    specs: {
      eraLabel: 'Vehicle Era & Year',
      priceLabel: 'Est. Price & Upkeep',
      featureLabel: 'Special Features & Performance',
      aiVerdictLabel: 'AI Chief Mechanic Verdict'
    },
    stroke: {
      summary: '✍️ Name Stroke Breakdown ({name} · {total} strokes → Lv.{level})',
      unit: 'st',
      harmony: 'Stroke Harmony Index',
      pyramidTitle: 'Adjacent Stroke Reduction Steps'
    },
    prevCarBtn: '◀ Prev Ride',
    nextCarBtn: 'Next Ride ▶',
    randomCarBtn: '🎲 Random Ride',
    openShareModalBtn: 'Create Instagram Story / Share Card',
    copyUrlBtn: 'Copy Result Link',
    returnMyCarText: 'Return to My Ride ({name} · Lv.{level})',
    returnMyCarDefault: 'Return to My Ride',
    photoDiaryLink: 'Photo Diary',
    myJobLink: 'Find My Job',
    enterNameToast: 'Please enter a name!',
    randomDiceToast: "🎲 Random name '{name}' appraised!",
    refreshChipsToast: '🔄 Sample names refreshed!',
    loadingText: 'AI Chief Mechanic is checking the Multiverse Garage Registry...',
    loadingWithName: 'AI Chief Mechanic is appraising [{name}]’s destined ride...',
    dockKeyboardHint: '💡 Use Left/Right arrows (← / →) to browse levels or Space for a random ride.',
    footerBrand: 'The Ride That Suits You (MyCar)',
    footerDesc: 'Fun name-based vehicle matching test & ideal-type vehicle world cup from Lv.0 to Lv.1000.'
  },
  ja: {
    familyNav: { car: '似合う車', job: '似合う職業', myhome: '似合う家', food: '似合う食べ物', photodiary: 'フォト日記' },
    brandHeader: 'あなたに似合う車',
    searchPlaceholder: '名前を入力してください (例: Haruto, Yui...)',
    ownerTitle: '{name}さんに似合う車',
    zones: { GOOD: '神名車', BAD: '爆死ポンコツ' },
    reality: { REAL: '実在', FICTION: '架空・魔導・SF' },
    specs: {
      eraLabel: '活躍した時代・年式',
      priceLabel: '推定価格・維持費',
      featureLabel: '特殊機能・走行性能',
      aiVerdictLabel: 'AI整備士の一言総評'
    },
    stroke: { summary: '✍️ 名前画数分析 ({name} · 合計{total}画 → Lv.{level})', unit: '画', harmony: '画数調和値', pyramidTitle: '隣接画数計算ステップ' },
    prevCarBtn: '◀ 前の車', nextCarBtn: '次の車 ▶', randomCarBtn: '🎲 ランダム',
    openShareModalBtn: 'インスタストーリー共有カード作成', copyUrlBtn: '結果リンクをコピー'
  },
  zh: {
    familyNav: { car: '适合的座驾', job: '适合的职业', myhome: '适合的家', food: '适合的美食', photodiary: '照片日记' },
    brandHeader: '适合你的座驾',
    searchPlaceholder: '请输入姓名 (例如: Wei, Fang...)',
    ownerTitle: '适合 {name} 的座驾',
    zones: { GOOD: '神级梦想座驾', BAD: '惨烈报废座驾' },
    reality: { REAL: '现实存在', FICTION: '虚构·魔法·科幻' },
    specs: {
      eraLabel: '活跃年代·年份',
      priceLabel: '预估车价·维护费',
      featureLabel: '特殊功能·驾驶性能',
      aiVerdictLabel: 'AI首席技师试驾总评'
    },
    stroke: { summary: '✍️ 姓名笔画分析 ({name} · 共{total}画 → Lv.{level})', unit: '画', harmony: '笔画和谐值', pyramidTitle: '相邻笔画计算步骤' },
    prevCarBtn: '◀ 上一级座驾', nextCarBtn: '下一级座驾 ▶', randomCarBtn: '🎲 随机座驾',
    openShareModalBtn: '生成快拍分享卡片', copyUrlBtn: '复制结果链接'
  },
  hi: {
    familyNav: { car: 'मेरी कार', job: 'मेरा पेशा', myhome: 'मेरा घर', food: 'मेरा खाना', photodiary: 'फोटो डायरी' },
    brandHeader: 'आपके लिए सही सवारी',
    ownerTitle: '{name} के लिए सही सवारी'
  },
  vi: {
    familyNav: { car: 'Xe Hợp Mệnh', job: 'Nghề Hợp Mệnh', myhome: 'Nhà Hợp Mệnh', food: 'Món Hợp Mệnh', photodiary: 'Nhật Ký Ảnh' },
    brandHeader: 'Chiếc Xe Hợp Với Bạn',
    ownerTitle: 'Chiếc xe hợp với {name}'
  },
  fr: {
    familyNav: { car: 'Mon Véhicule', job: 'Mon Métier', myhome: 'Ma Maison', food: 'Mon Plat', photodiary: 'Journal Photo' },
    brandHeader: 'Le Véhicule Fait Pour Vous',
    ownerTitle: 'Le véhicule adapté à {name}'
  },
  pt: {
    familyNav: { car: 'Meu Carro', job: 'Meu Emprego', myhome: 'Minha Casa', food: 'Minha Comida', photodiary: 'Diário de Fotos' },
    brandHeader: 'O Veículo Que Combina Com Você',
    ownerTitle: 'O veículo ideal para {name}'
  },
  es: {
    familyNav: { car: 'Mi Vehículo', job: 'Mi Profesión', myhome: 'Mi Casa', food: 'Mi Comida', photodiary: 'Fotodiario' },
    brandHeader: 'El Vehículo Para Ti',
    ownerTitle: 'El vehículo ideal para {name}'
  },
  id: {
    familyNav: { car: 'Mobilku', job: 'Pekerjaanku', myhome: 'Rumahku', food: 'Makananku', photodiary: 'Diari Foto' },
    brandHeader: 'Kendaraan yang Cocok Untukmu',
    ownerTitle: 'Kendaraan yang cocok untuk {name}'
  },
  ru: {
    familyNav: { car: 'Мой Транспорт', job: 'Моя Работа', myhome: 'Мой Дом', food: 'Моя Еда', photodiary: 'Фотодневник' },
    brandHeader: 'Твой Идеальный Транспорт',
    ownerTitle: 'Транспорт для {name}'
  },
  de: {
    familyNav: { car: 'Mein Fahrzeug', job: 'Mein Beruf', myhome: 'Mein Haus', food: 'Mein Essen', photodiary: 'Fototagebuch' },
    brandHeader: 'Dein Passendes Fahrzeug',
    ownerTitle: 'Das Fahrzeug für {name}'
  },
  it: {
    familyNav: { car: 'Il Mio Veicolo', job: 'Il Mio Lavoro', myhome: 'La Mia Casa', food: 'Il Mio Cibo', photodiary: 'Diario Foto' },
    brandHeader: 'Il Veicolo Adatto a Te',
    ownerTitle: 'Il veicolo adatto a {name}'
  },
  ms: {
    familyNav: { car: 'Kereta Saya', job: 'Kerja Saya', myhome: 'Rumah Saya', food: 'Makanan Saya', photodiary: 'Diari Foto' },
    brandHeader: 'Kenderaan yang Sesuai Dengan Anda',
    ownerTitle: 'Kenderaan yang sesuai untuk {name}'
  }
};

function getLanguageMap() {
  if (i18nMod.LANGUAGE_MAP && Object.keys(i18nMod.LANGUAGE_MAP).length > 0) {
    return i18nMod.LANGUAGE_MAP;
  }
  return Object.fromEntries(DEFAULT_SUPPORTED_LANGUAGES.map(l => [l.code, l]));
}

function getUiDict(lang = 'ko') {
  const code = CAR_UI_FALLBACKS[lang] ? lang : 'en';
  const carFb = code === 'ko'
    ? CAR_UI_FALLBACKS.ko
    : {
        ...CAR_UI_FALLBACKS.en,
        ...CAR_UI_FALLBACKS[code],
        familyNav: { ...CAR_UI_FALLBACKS.en.familyNav, ...(CAR_UI_FALLBACKS[code]?.familyNav || {}) },
        specs: { ...CAR_UI_FALLBACKS.en.specs, ...(CAR_UI_FALLBACKS[code]?.specs || {}) },
        stroke: { ...CAR_UI_FALLBACKS.en.stroke, ...(CAR_UI_FALLBACKS[code]?.stroke || {}) },
        zones: { ...CAR_UI_FALLBACKS.en.zones, ...(CAR_UI_FALLBACKS[code]?.zones || {}) },
        reality: { ...CAR_UI_FALLBACKS.en.reality, ...(CAR_UI_FALLBACKS[code]?.reality || {}) }
      };
  const extDict = i18nMod.UI_DICTIONARY?.[lang];
  if (!extDict) return carFb;
  return {
    ...carFb,
    ...extDict,
    familyNav: { ...carFb.familyNav, ...(extDict.familyNav || {}) },
    specs: { ...carFb.specs, ...(extDict.specs || {}) },
    stroke: { ...carFb.stroke, ...(extDict.stroke || {}) },
    zones: { ...carFb.zones, ...(extDict.zones || {}) },
    reality: { ...carFb.reality, ...(extDict.reality || {}) }
  };
}

function localizeVehicle(car, lang, name) {
  const fn = i18nMod.localizeCar || i18nMod.localizeJob || i18nMod.localizeHouse;
  if (typeof fn === 'function') {
    return fn(car, lang, name);
  }
  return car;
}

function getConceptSync(level) {
  const getter = taxonomyMod.getCarConceptByLevel || taxonomyMod.getJobConceptByLevel || taxonomyMod.getHouseConceptByLevel;
  if (typeof getter === 'function') {
    return getter(level);
  }
  return null;
}

// Application State
export const state = {
  activeTab: 'finder', // 'finder' | 'worst-to-best' | 'best-to-worst'
  currentLevel: 331,   // Default landing level (김서윤: Lv.331)
  inlineStoryTheme: 'sunset',
  activeName: null,
  activeStrokeInfo: null,
  userOriginalCar: null,
  currentCar: null,
  lang: 'ko',
  isLoading: false
};

// DOM Elements Cache
const DOM = {
  langSelect: null,
  nameInput: null,
  randomDiceBtn: null,
  btnRefreshChips: null,
  searchBtn: null,
  labelSearchBtn: null,
  searchForm: null,
  sampleChips: null,
  labelSampleChips: null,
  cardRoot: null,
  explorerDock: null,
  btnPrevLevel: null,
  btnRandomLevel: null,
  btnNextLevel: null,
  labelBtnPrev: null,
  labelBtnNext: null,
  labelBtnRandom: null,
  dockKeyboardHint: null,
  returnMyHouseBar: null,
  returnMyHouseBtn: null,
  returnHouseText: null,
  loadingOverlay: null,
  loadingStatusText: null,
  toastContainer: null
};

function initDomElements() {
  DOM.langSelect = document.getElementById('lang-select');
  DOM.nameInput = document.getElementById('name-input');
  DOM.randomDiceBtn = document.getElementById('random-dice-btn');
  DOM.btnRefreshChips = document.getElementById('btn-refresh-chips');
  DOM.searchBtn = document.getElementById('search-btn');
  DOM.labelSearchBtn = document.getElementById('label-search-btn');
  DOM.searchForm = document.getElementById('search-form');
  DOM.sampleChips = document.getElementById('sample-chips');
  DOM.labelSampleChips = document.getElementById('label-sample-chips');
  DOM.cardRoot = document.getElementById('card-root');
  DOM.explorerDock = document.getElementById('explorer-dock');
  DOM.btnPrevLevel = document.getElementById('btn-prev-level');
  DOM.btnRandomLevel = document.getElementById('btn-random-level');
  DOM.btnNextLevel = document.getElementById('btn-next-level');
  DOM.labelBtnPrev = document.getElementById('label-btn-prev');
  DOM.labelBtnNext = document.getElementById('label-btn-next');
  DOM.labelBtnRandom = document.getElementById('label-btn-random');
  DOM.dockKeyboardHint = document.getElementById('dock-keyboard-hint');
  DOM.returnMyHouseBar = document.getElementById('return-my-house-bar');
  DOM.returnMyHouseBtn = document.getElementById('return-my-house-btn');
  DOM.returnHouseText = document.getElementById('return-house-text');
  DOM.loadingOverlay = document.getElementById('loading-overlay');
  DOM.loadingStatusText = document.getElementById('loading-status-text');
  DOM.toastContainer = document.getElementById('toast-container');
}

export function showToast(message, duration = 3000) {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, duration);
}

export function pushPendingAdSense() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const unpushed = document.querySelectorAll('.adsbygoogle:not([data-ad-pushed="true"])');
    unpushed.forEach((el) => {
      el.setAttribute('data-ad-pushed', 'true');
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {}
    });
  } catch (_) {}
}

/**
 * Fetch or procedurally generate vehicle data for a level (0..1000)
 */
export async function getCarData(level) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));

  try {
    const concept = getConceptSync(lv);
    if (concept && concept.title) {
      return concept;
    }
  } catch (err) {
    console.warn('[MyCar] getCarConceptByLevel fallback:', err);
  }

  try {
    const chunkIdx = Math.min(19, Math.floor(lv / 50));
    const padded = String(chunkIdx).padStart(2, '0');
    const resp = await fetch(`/data/chunks/cars-chunk-${padded}.json`);
    if (resp.ok) {
      const chunk = await resp.json();
      const found = chunk.find(c => c.level === lv);
      if (found) return found;
    }
  } catch (_) {}

  const isGood = lv >= GOOD_THRESHOLD;
  const isReal = lv % 2 === 0;
  const paddedLv = String(lv).padStart(5, '0');
  const era = '시공간 미상';
  const price = isGood ? '감정가 측정 불가 (초호화 탈것)' : '폐차 스티커 비용 본인 부담';
  const feature = '다중우주 차고 등기부에 등록된 기상천외한 특수 주행 모빌리티입니다.';

  return {
    level: lv,
    tier: Math.min(20, Math.floor(lv / 50) + 1),
    tierName: `Tier ${String(Math.min(20, Math.floor(lv / 50) + 1)).padStart(2, '0')}`,
    zone: isGood ? 'GOOD' : 'BAD',
    zoneLabel: isGood ? '대박 탈것' : '폭망 탈것',
    realityType: isReal ? 'REAL' : 'FICTION',
    realityLabel: isReal ? '실제 탈것·생물' : '허구·마법·SF 탈것',
    category: 'BIZARRE_MOD_CAR',
    categoryLabel: '다중우주 공인 탈것',
    categoryEmoji: '🚗',
    title: `다중우주 제${lv}호 특별 시승 차량`,
    era,
    builtYear: era,
    estimatedPrice: price,
    estimatedSalary: price,
    estimatedValue: price,
    specialFeature: feature,
    specialDuty: feature,
    aiVerdict: 'AI 수석 정비사가 다중우주 차고에서 직접 출고 검증을 완료한 탈것입니다.',
    imageUrl: `/r2/cars/${paddedLv}.webp`,
    ogImageUrl: `https://car.tellmyname.app/r2/cars/${paddedLv}.webp`
  };
}

export const getJobData = getCarData;
export const getHouseData = getCarData;

export function preloadAdjacentImages(level) {
  if (typeof Image === 'undefined') return;
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const prevLv = getPrevActiveLevel(lv);
  const nextLv = getNextActiveLevel(lv);

  const prevImg = new Image();
  prevImg.src = `/r2/cars/${String(prevLv).padStart(5, '0')}.webp`;

  const nextImg = new Image();
  nextImg.src = `/r2/cars/${String(nextLv).padStart(5, '0')}.webp`;
}

/**
 * Build Name Stroke Breakdown Accordion HTML (name_teller integration)
 */
function buildStrokeAccordionHtml(name, strokeInfo, lv, dict) {
  if (!name || !strokeInfo || !Array.isArray(strokeInfo.steps) || strokeInfo.steps.length === 0) {
    return '';
  }

  const chars = strokeInfo.chars || [...String(strokeInfo.cleanName || name)];
  const strokes = strokeInfo.strokes || [];
  const totalStrokes = strokeInfo.totalStrokes ?? strokes.reduce((a, b) => a + b, 0);
  const strokeUnit = dict.stroke?.unit || '획';

  const summaryText = (dict.stroke?.summary || '✍️ 이름 획수·자모 조화 분석 ({name} · 총 {total}획 → Lv.{level})')
    .replace('{name}', escapeHtml(name))
    .replace('{total}', String(totalStrokes))
    .replace('{level}', String(lv));

  const charPillsHtml = chars.map((ch, idx) => {
    const st = strokes[idx] ?? 0;
    return `<span class="stroke-char-pill">${escapeHtml(ch)} <span class="stroke-char-count">${st}${escapeHtml(strokeUnit)}</span></span>`;
  }).join('');

  const stepsHtml = strokeInfo.steps.map((row, rIdx) => {
    const isFinal = rIdx === strokeInfo.steps.length - 1;
    const nums = row.map(n => `<span class="stroke-step-num">${n}</span>`).join('');
    return `<div class="stroke-step-row ${isFinal ? 'is-final' : ''}">${nums}</div>`;
  }).join('');

  const harmonyLabel = dict.stroke?.harmony || '인접 획수 조화값';
  const pyramidTitle = dict.stroke?.pyramidTitle || 'name_teller 인접 획수 합산 단계';

  return `
    <details class="stroke-accordion" id="stroke-breakdown-accordion">
      <summary class="stroke-accordion-summary">
        <span>${summaryText}</span>
        <span class="stroke-accordion-chevron" aria-hidden="true">▼</span>
      </summary>
      <div class="stroke-accordion-body">
        <div class="stroke-char-row" aria-label="글자별 획수">${charPillsHtml}</div>
        <div class="stroke-meta-line" style="margin-bottom:6px;">${escapeHtml(pyramidTitle)}</div>
        <div class="stroke-pyramid">${stepsHtml}</div>
        <div class="stroke-meta-line">
          ${escapeHtml(harmonyLabel)}: <strong>${escapeHtml(String(strokeInfo.strokeHarmony ?? '-'))}</strong> · JSA-Hash-1001 → <strong>Lv.${lv}</strong>
        </div>
      </div>
    </details>
  `;
}

/**
 * Render Vehicle Appraisal Certificate Card into #card-root
 */
export function renderCard(car, name = null, strokeInfo = null) {
  if (!DOM.cardRoot) return;

  const rawLv = Number(car.level);
  const lv = Math.max(0, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
  const paddedLv = String(lv).padStart(5, '0');
  const isGood = lv >= GOOD_THRESHOLD;
  const isReal = lv % 2 === 0;
  const zoneClass = isGood ? 'zone-good' : 'zone-bad';
  const realityClass = isReal ? 'reality-real' : 'reality-fiction';

  const localized = localizeVehicle(car, state.lang, name);
  const dict = getUiDict(state.lang);

  // Update document.title dynamically
  if (typeof document !== 'undefined') {
    const isRootPath = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');
    if (isRootPath && (!name || name === '김서윤')) {
      document.title = state.lang === 'ko'
        ? '나에게 어울리는 자동차 - 이름으로 찾는 재미로 보는 탈것 테스트'
        : `${dict.brandHeader || 'The Ride That Suits You'} (MyCar) — ${dict.brandSub || ''}`;
    } else if (state.lang === 'ko') {
      document.title = name
        ? `${name}님에게 어울리는 자동차 (Lv.${lv}) — ${localized.title} | 나에게 어울리는 자동차`
        : `Lv.${lv} ${localized.title} | 나에게 어울리는 자동차`;
    } else {
      const ownerPart = name && dict.ownerTitle ? dict.ownerTitle.replace('{name}', name) : (dict.brandHeader || 'MyCar');
      document.title = `${ownerPart}: ${localized.title} (Lv.${lv}) | MyCar`;
    }
  }

  const imgAltText = `${escapeHtml(localized.title)} (${escapeHtml(localized.categoryLabel || '')})`;
  const imgTitleText = `${escapeHtml(localized.title)}`;

  const ownerHeadline = name
    ? (dict.ownerTitle ? dict.ownerTitle.replace('{name}', escapeHtml(name)) : `${escapeHtml(name)}님에게 어울리는 자동차`)
    : (dict.brandHeader || '나에게 어울리는 자동차');

  const shareBtnLabel = dict.openShareModalBtn || '인스타 스토리 / 카톡 공유 카드 만들기';
  const copyBtnLabel = dict.copyUrlBtn || '결과 링크 복사';

  const isRootHomepage = typeof window !== 'undefined' &&
    (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html') &&
    !new URLSearchParams(window.location.search || '').has('name') &&
    !new URLSearchParams(window.location.search || '').has('level');

  const langMap = getLanguageMap();
  const displayOwnerName = name || (state.lang === 'ko' ? '김서윤' : (langMap[state.lang]?.sampleNames?.[0] || 'Steve'));
  const activeInlineTheme = state.inlineStoryTheme || 'sunset';
  const inlineStoryTitle = state.lang === 'ko'
    ? `📸 인스타그램 9:16 스토리 미리보기 (${escapeHtml(displayOwnerName)}님 예시)`
    : `📸 Instagram Story Share Preview (${escapeHtml(displayOwnerName)})`;
  const inlineStorySub = state.lang === 'ko'
    ? '위 검색창에 이름만 입력하면 나에게 어울리는 자동차 인스타 스토리 이미지가 바로 생성됩니다!'
    : 'Enter any name above to generate your own 9:16 Instagram Story vehicle card!';
  const inlineDownloadLabel = state.lang === 'ko'
    ? '📥 이 인스타 이미지 바로 저장'
    : (dict.saveStoryBtn || '📥 Save 9:16 Story PNG');

  const inlineInstaShowcaseHtml = isRootHomepage ? `
    <section class="inline-insta-showcase" id="inline-insta-showcase" aria-label="${inlineStoryTitle}">
      <div class="inline-insta-header">
        <span class="inline-insta-badge">INSTAGRAM STORY 9:16 PREVIEW</span>
        <h2 class="inline-insta-title">${inlineStoryTitle}</h2>
        <p class="inline-insta-subtitle">${inlineStorySub}</p>
      </div>
      <div class="inline-theme-selector" id="inline-theme-selector">
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'sunset' ? 'active' : ''}" data-theme="sunset">🌅 ${dict.shareModal?.themeSunset || (state.lang === 'ko' ? '노을 그라디언트' : 'Sunset')}</button>
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'cert' ? 'active' : ''}" data-theme="cert">📜 ${dict.shareModal?.themeCert || (state.lang === 'ko' ? '시승 감정서' : 'Classic')}</button>
        <button type="button" class="inline-theme-pill ${activeInlineTheme === 'cyber' ? 'active' : ''}" data-theme="cyber">⚡ ${dict.shareModal?.themeCyber || (state.lang === 'ko' ? '사이버 네온' : 'Cyberpunk')}</button>
      </div>
      <div class="inline-story-canvas-wrap">
        <canvas id="inline-story-canvas" width="1080" height="1920"></canvas>
      </div>
      <div class="inline-insta-actions">
        <button type="button" id="btn-inline-save-story" class="btn-action btn-share-modal">
          <span class="btn-icon">📥</span>
          <span class="btn-label">${escapeHtml(inlineDownloadLabel)}</span>
        </button>
        <button type="button" id="btn-inline-open-modal" class="btn-action btn-copy-address">
          <span class="btn-icon">📸</span>
          <span class="btn-label">${escapeHtml(shareBtnLabel)}</span>
        </button>
      </div>
    </section>
  ` : '';

  const eraVal = localized.era || localized.builtYear || car.era || car.builtYear || '';
  const priceVal = localized.estimatedPrice || localized.estimatedSalary || localized.estimatedValue || car.estimatedPrice || car.estimatedSalary || car.estimatedValue || '';
  const featureVal = localized.specialFeature || localized.specialDuty || car.specialFeature || car.specialDuty || '';
  const verdictVal = localized.aiVerdict || car.aiVerdict || '';
  const imageSrc = `/r2/cars/${paddedLv}.webp`;
  const tierNum = localized.tier || car.tier || Math.min(20, Math.floor(lv / 50) + 1);

  const zoneLabel = localized.zoneLabel || (isGood ? (dict.zones?.GOOD || '대박 탈것') : (dict.zones?.BAD || '폭망 탈것'));
  const realityLabel = localized.realityLabel || (isReal ? (dict.reality?.REAL || '실제 탈것·생물') : (dict.reality?.FICTION || '허구·마법·SF'));

  const strokeAccordionHtml = buildStrokeAccordionHtml(name, strokeInfo, lv, dict);

  const html = `
    <article class="appraisal-card ${zoneClass}" id="appraisal-certificate" data-level="${lv}">

      <!-- Friendly Owner Headline Header -->
      <header class="card-certificate-header">
        <p class="owner-headline-label">${ownerHeadline}</p>
      </header>

      <!-- Vehicle Main Title -->
      <div class="house-title-container">
        <h2 class="house-title">${escapeHtml(localized.title)}</h2>
      </div>

      <!-- Vehicle Visual Media (1:1) -->
      <div class="house-media-wrapper">
        <div class="media-frame">
          <img
            id="house-main-img"
            class="house-image"
            src="${escapeHtml(imageSrc)}"
            alt="${imgAltText}"
            title="${imgTitleText}"
            loading="eager"
            onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=window.renderCarFallbackSvg ? window.renderCarFallbackSvg(${lv}) : '/favicon.svg';}else{this.onerror=null;this.classList.add('img-fallback');}"
          />
        </div>
        ${localized.license ? `
          <div class="image-sub-bar">
            <span class="image-credit" id="image-credit-box">📷 ${escapeHtml(localized.license)}${localized.author ? ` · ${escapeHtml(localized.author)}` : ''}</span>
          </div>
        ` : ''}
      </div>

      <!-- Badge Matrix: Level, Tier, Zone, Reality, Category -->
      <div class="badge-matrix">
        <div class="matrix-badge badge-level">
          <span class="badge-val">Lv. ${lv.toLocaleString()} <span class="badge-total">/ ${MAX_LEVEL}</span></span>
        </div>
        <div class="matrix-badge">
          <span class="badge-val">Tier ${String(tierNum).padStart(2, '0')}</span>
        </div>
        <div class="matrix-badge badge-zone ${zoneClass}">
          <span class="badge-val">${isGood ? '🌟 ' : '💀 '}${escapeHtml(zoneLabel)}</span>
        </div>
        <div class="matrix-badge badge-reality ${realityClass}">
          <span class="badge-val">${isReal ? '🏛️ ' : '🦄 '}${escapeHtml(realityLabel)}</span>
        </div>
        <div class="matrix-badge badge-category">
          <span class="badge-val">${escapeHtml(localized.categoryEmoji || car.categoryEmoji || '🚗')} ${escapeHtml(localized.categoryLabel || car.categoryLabel || '')}</span>
        </div>
      </div>

      <!-- 3 Core Vehicle Specs -->
      <div class="appraisal-spec-grid" aria-label="Vehicle Specifications">
        <div class="spec-card spec-built-year">
          <div class="spec-card-header">
            <span class="spec-icon">📅</span>
            <span class="spec-title">${escapeHtml(dict.specs?.eraLabel || dict.specs?.builtYearLabel || '언제 타던 탈것인지 (연식·시대)')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value">${escapeHtml(eraVal)}</p>
          </div>
        </div>

        <div class="spec-card spec-estimated-value">
          <div class="spec-card-header">
            <span class="spec-icon">💰</span>
            <span class="spec-title">${escapeHtml(dict.specs?.priceLabel || dict.specs?.estimatedValueLabel || '추산 가격·유지비')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value price-highlight">${escapeHtml(priceVal)}</p>
          </div>
        </div>

        <div class="spec-card spec-special-feature">
          <div class="spec-card-header">
            <span class="spec-icon">⚡</span>
            <span class="spec-title">${escapeHtml(dict.specs?.featureLabel || dict.specs?.specialFeatureLabel || '탈것의 특별한 기능·주행성능')}</span>
          </div>
          <div class="spec-card-body">
            <p class="spec-value feature-text">${escapeHtml(featureVal)}</p>
          </div>
        </div>
      </div>

      <!-- AI Chief Mechanic Verdict Box -->
      <section class="ai-verdict-section" aria-label="${escapeHtml(dict.specs?.aiVerdictLabel || 'AI 수석 정비사 한 줄 시승 총평')}">
        <div class="verdict-label-row">🤖 ${escapeHtml(dict.specs?.aiVerdictLabel || 'AI 수석 정비사 한 줄 시승 총평')}</div>
        <p class="verdict-quote">
          “${escapeHtml(verdictVal)}”
        </p>
      </section>

      <!-- Name Stroke Breakdown Accordion (name_teller stroke steps) -->
      ${strokeAccordionHtml}

      <!-- Action Buttons -->
      <div class="card-action-bar">
        <button type="button" id="btn-open-share" class="btn-action btn-share-modal" title="${escapeHtml(shareBtnLabel)}">
          <span class="btn-icon">📸</span>
          <span class="btn-label">${escapeHtml(shareBtnLabel)}</span>
        </button>

        <button type="button" id="btn-copy-url" class="btn-action btn-copy-address" title="${escapeHtml(copyBtnLabel)}">
          <span class="btn-icon">🔗</span>
          <span class="btn-label">${escapeHtml(copyBtnLabel)}</span>
        </button>
      </div>

    </article>
    
  `;

  const guideSectionEl = document.querySelector('.service-guide-section');
  if (guideSectionEl) {
    const showGuide = isRootHomepage && state.activeTab === 'search';
    guideSectionEl.classList.toggle('hidden', !showGuide);
    guideSectionEl.style.display = showGuide ? '' : 'none';
  }
  DOM.cardRoot.innerHTML = html + renderCrossLevelSectionHtml(lv, name, state.lang, 'car', MAX_LEVEL);
  DOM.cardRoot.querySelectorAll('.step-nav-btn[data-target-level]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLv = parseInt(btn.getAttribute('data-target-level'), 10);
      if (!isNaN(targetLv)) navigateToLevel(targetLv, true);
    });
  });

  const inlineCanvas = document.getElementById('inline-story-canvas');
  if (inlineCanvas && typeof renderStoryCanvas === 'function') {
    renderStoryCanvas(inlineCanvas, car, displayOwnerName, state.inlineStoryTheme || 'sunset', state.lang).catch(() => {});
  }

  const inlineThemeSelector = document.getElementById('inline-theme-selector');
  if (inlineThemeSelector && inlineCanvas) {
    inlineThemeSelector.querySelectorAll('.inline-theme-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const selectedTheme = pill.getAttribute('data-theme') || 'sunset';
        state.inlineStoryTheme = selectedTheme;
        inlineThemeSelector.querySelectorAll('.inline-theme-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderStoryCanvas(inlineCanvas, car, displayOwnerName, selectedTheme, state.lang).catch(() => {});
      });
    });
  }

  const inlineSaveBtn = document.getElementById('btn-inline-save-story');
  if (inlineSaveBtn && inlineCanvas) {
    inlineSaveBtn.addEventListener('click', () => {
      const sanitized = (displayOwnerName || 'mycar').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
      const filename = `mycar_${sanitized}_lv${lv}_${state.inlineStoryTheme || 'sunset'}.png`;
      if (inlineCanvas.toBlob) {
        inlineCanvas.toBlob((blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          showToast(dict.shareModal?.savedToast || '📥 9:16 인스타 스토리 이미지가 저장되었습니다!');
        }, 'image/png');
      }
    });
  }

  const inlineOpenModalBtn = document.getElementById('btn-inline-open-modal');
  if (inlineOpenModalBtn) {
    inlineOpenModalBtn.addEventListener('click', () => {
      openShareModal(state.currentCar, state.activeName || displayOwnerName, state.lang);
    });
  }

  const shareBtn = document.getElementById('btn-open-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      openShareModal(state.currentCar, state.activeName, state.lang);
    });
  }

  const copyBtn = document.getElementById('btn-copy-url');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyShareUrl(state.currentCar, state.activeName, state.lang);
    });
  }

  preloadAdjacentImages(lv);
}

/**
 * Update Step Navigation Dock Buttons and Labels
 */
export function updateExplorerDock(level) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, level));
  const dict = getUiDict(state.lang);

  if (DOM.btnPrevLevel) {
    const prevLv = getPrevActiveLevel(lv);
    const prevBase = dict.prevCarBtn || '◀ 이전 단계 탈것';
    const prevLabel = `${prevBase} (Lv.${prevLv})`;
    if (DOM.labelBtnPrev) {
      DOM.labelBtnPrev.textContent = prevLabel;
    }
    DOM.btnPrevLevel.title = `${prevLabel} [←]`;
  }

  if (DOM.btnRandomLevel && DOM.labelBtnRandom) {
    DOM.labelBtnRandom.textContent = dict.randomCarBtn || '🎲 랜덤 탈것';
    DOM.btnRandomLevel.title = `${dict.randomCarBtn || 'Random'} [Space]`;
  }

  if (DOM.btnNextLevel) {
    const nextLv = getNextActiveLevel(lv);
    const nextBase = dict.nextCarBtn || '다음 단계 탈것 ▶';
    const nextLabel = `${nextBase.replace(' ▶', '')} (Lv.${nextLv}) ▶`;
    if (DOM.labelBtnNext) {
      DOM.labelBtnNext.textContent = nextLabel;
    }
    DOM.btnNextLevel.title = `${nextLabel} [→]`;
  }
}

export function updateReturnBanner() {
  if (!DOM.returnMyHouseBar || !DOM.returnHouseText) return;
  const dict = getUiDict(state.lang);

  if (state.userOriginalCar && state.userOriginalCar.level !== state.currentLevel) {
    const tpl = dict.returnMyCarText || '내 원래 자동차({name} · Lv.{level})으로 돌아가기';
    DOM.returnHouseText.textContent = tpl
      .replace('{name}', state.userOriginalCar.name)
      .replace('{level}', state.userOriginalCar.level.toLocaleString());
    DOM.returnMyHouseBar.classList.remove('hidden');
  } else {
    DOM.returnHouseText.textContent = dict.returnMyCarDefault || '내 원래 자동차로 돌아가기';
    DOM.returnMyHouseBar.classList.add('hidden');
  }
}

function setLoading(show, text = '') {
  state.isLoading = show;
  if (!DOM.loadingOverlay) return;
  const dict = getUiDict(state.lang);
  if (DOM.loadingStatusText) {
    DOM.loadingStatusText.textContent = text || dict.loadingText || 'Loading...';
  }
  if (show) {
    DOM.loadingOverlay.classList.remove('hidden');
    DOM.loadingOverlay.setAttribute('aria-hidden', 'false');
  } else {
    DOM.loadingOverlay.classList.add('hidden');
    DOM.loadingOverlay.setAttribute('aria-hidden', 'true');
  }
}

export async function navigateToLevel(level, pushState = true) {
  const lv = Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  state.currentLevel = lv;

  const linkedName = getSitemapNameForLevel(lv, state.lang);

  if (state.userOriginalCar && state.userOriginalCar.level === lv) {
    state.activeName = state.userOriginalCar.name;
    state.activeStrokeInfo = state.userOriginalCar.strokeInfo;
  } else if (linkedName) {
    state.activeName = linkedName;
    state.activeStrokeInfo = analyzeNameToCar(linkedName);
  } else {
    state.activeName = null;
    state.activeStrokeInfo = null;
  }

  if (pushState) {
    const langParam = (state.lang && state.lang !== 'ko') ? `?lang=${state.lang}` : '';
    const targetUrl = state.activeName
      ? `/name/${encodeURIComponent(state.activeName)}${langParam}`
      : `/level/${lv}${langParam}`;

    try {
      window.history.pushState({ level: lv, activeName: state.activeName, lang: state.lang }, '', targetUrl);
    } catch (_) {}
  }

  const car = await getCarData(lv);
  state.currentCar = car;

  renderCard(car, state.activeName, state.activeStrokeInfo);
  updateExplorerDock(lv);
  updateReturnBanner();

  if (DOM.cardRoot && typeof window !== 'undefined' && window.scrollY > 200) {
    DOM.cardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export async function navigateToName(name, pushState = true, animate = true) {
  const cleanName = String(name || '').trim();
  const dict = getUiDict(state.lang);
  if (!cleanName) {
    showToast(dict.enterNameToast || '이름을 입력해주세요!');
    if (DOM.nameInput) DOM.nameInput.focus();
    return;
  }

  const analyzed = analyzeNameToCar(cleanName);
  state.currentLevel = analyzed.level;
  state.activeName = analyzed.cleanName;
  state.activeStrokeInfo = analyzed;
  state.userOriginalCar = {
    name: analyzed.cleanName,
    level: analyzed.level,
    strokeInfo: analyzed
  };

  if (DOM.nameInput) {
    DOM.nameInput.value = cleanName;
  }

  if (pushState) {
    try {
      const langParam = (state.lang && state.lang !== 'ko') ? `?lang=${state.lang}` : '';
      window.history.pushState(
        { name: cleanName, level: analyzed.level, lang: state.lang },
        '',
        `/name/${encodeURIComponent(cleanName)}${langParam}`
      );
    } catch (_) {}
  }

  if (animate) {
    const loadingMsg = (dict.loadingWithName || 'AI 수석 정비사가 [{name}]님의 차고를 감정 중입니다...')
      .replace('{name}', cleanName);
    setLoading(true, loadingMsg);
    await new Promise(r => setTimeout(r, 420));
    setLoading(false);
  }

  const car = await getCarData(analyzed.level);
  state.currentCar = car;

  renderCard(car, state.activeName, state.activeStrokeInfo);
  updateExplorerDock(analyzed.level);
  updateReturnBanner();

  if (DOM.cardRoot && typeof window !== 'undefined' && window.scrollY > 180) {
    DOM.cardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function navigateToRandom() {
  let nextLv;
  do {
    nextLv = getRandomActiveLevel();
  } while (nextLv === state.currentLevel);

  navigateToLevel(nextLv, true);
}

function setElText(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setElHtml(id, html) {
  if (!html) return;
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function updateLocalizedStaticTexts() {
  const dict = getUiDict(state.lang);
  const wcT = getWorldCupUiLabels(state.lang);

  // Top Family Navigation Bar Localized Labels & URLs
  if (dict.familyNav) {
    setElText('family-label-car', dict.familyNav.car);
    setElText('family-label-job', dict.familyNav.job);
    setElText('family-label-myhome', dict.familyNav.myhome);
    setElText('family-label-food', dict.familyNav.food);
    setElText('family-label-photodiary', dict.familyNav.photodiary);
  }
  const langSuffix = state.lang && state.lang !== 'ko' ? `?lang=${encodeURIComponent(state.lang)}` : '';
  const familyLinks = [
    ['family-link-car', 'https://car.tellmyname.app/'],
    ['family-link-job', 'https://job.tellmyname.app/'],
    ['family-link-myhome', 'https://myhome.tellmyname.app/'],
    ['family-link-food', 'https://food.tellmyname.app/'],
    ['family-link-photodiary', 'https://photodiary.tellmyname.app/']
  ];
  for (const [elId, baseHref] of familyLinks) {
    const el = document.getElementById(elId);
    if (el) el.href = `${baseHref}${langSuffix}`;
  }

  const tabFinder = document.getElementById('tab-btn-finder');
  const tabWorst = document.getElementById('tab-btn-worst');
  const tabBest = document.getElementById('tab-btn-best');
  if (tabFinder) tabFinder.innerHTML = `<span>🚗</span> <span>${escapeHtml(wcT.tabFinder || '내 자동차 찾기')}</span>`;
  if (tabWorst) tabWorst.innerHTML = `<span>💀</span> <span>${escapeHtml(wcT.tabWorst || '최악 중 최선 월드컵')}</span>`;
  if (tabBest) tabBest.innerHTML = `<span>🌟</span> <span>${escapeHtml(wcT.tabBest || '최선 중 최악 월드컵')}</span>`;

  setElText('header-brand-text', dict.brandHeader);

  const pdLink = document.getElementById('photodiary-link');
  if (pdLink) pdLink.href = `https://photodiary.tellmyname.app/${langSuffix}`;
  setElText('photodiary-text', dict.photoDiaryLink || dict.familyNav?.photodiary);

  const mjLink = document.getElementById('myjob-link');
  if (mjLink) mjLink.href = `https://job.tellmyname.app/${langSuffix}`;
  setElText('myjob-text', dict.myJobLink || dict.familyNav?.job);

  if (DOM.nameInput && dict.searchPlaceholder) {
    DOM.nameInput.placeholder = dict.searchPlaceholder;
  }
  if (DOM.labelSearchBtn && dict.searchBtn) {
    DOM.labelSearchBtn.textContent = dict.searchBtn;
  }
  if (DOM.labelSampleChips && dict.sampleLabel) {
    DOM.labelSampleChips.textContent = dict.sampleLabel;
  }

  setElText('dock-keyboard-hint', dict.dockKeyboardHint);
  setElText('loading-status-text', dict.loadingText);

  if (dict.footer) {
    setElText('footer-brand-text', dict.footer.brand);
    const isKo = state.lang === 'ko';
    setElText('footer-link-hub', isKo ? '✨ TellMyName 허브' : '✨ TellMyName Hub');
    const hubLabelEl = document.querySelector('#family-link-hub .family-nav-label');
    if (hubLabelEl) hubLabelEl.textContent = isKo ? 'TellMyName 허브' : 'TellMyName Hub';
    setElText('footer-link-food', isKo ? '🍱 오늘 뭐 먹지?' : '🍱 What to Eat?');
    setElText('footer-link-job', isKo ? '💼 내 직업 찾기' : '💼 Find My Job');
    setElText('footer-link-car', isKo ? '🚗 내 자동차 찾기' : '🚗 Find My Car');
    setElText('footer-link-photodiary', isKo ? '📸 포토 다이어리' : '📸 Photo Diary');
    setElText('footer-link-about', dict.footer.about);
    setElText('footer-link-contact', dict.footer.contact);
    setElText('footer-link-privacy', dict.footer.privacy);
    setElText('footer-link-terms', dict.footer.terms);
    setElText('footer-link-consent', dict.footer.consent);
    setElText('footer-desc-text', dict.footer.desc);
  } else {
    setElText('footer-brand-text', dict.footerBrand);
    setElText('footer-desc-text', dict.footerDesc);
  }

  if (dict.guide) {
    setElText('guide-section-title', dict.guide.sectionTitle);
    setElText('guide-bad-badge', dict.guide.badBadge);
    setElText('guide-bad-title', dict.guide.badTitle);
    setElText('guide-bad-desc', dict.guide.badDesc);
    setElText('guide-good-badge', dict.guide.goodBadge);
    setElText('guide-good-title', dict.guide.goodTitle);
    setElText('guide-good-desc', dict.guide.goodDesc);
    setElText('guide-rule-badge', dict.guide.ruleBadge);
    setElText('guide-rule-title', dict.guide.ruleTitle);
    setElHtml('guide-rule-desc', dict.guide.ruleDesc);
  }
}

export function setLanguage(langCode, updateUrl = true) {
  const langMap = getLanguageMap();
  const code = langMap[langCode] ? langCode : 'ko';
  state.lang = code;

  try {
    localStorage.setItem('mycar_lang', code);
  } catch (_) {}

  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }

  if (DOM.langSelect) {
    DOM.langSelect.value = code;
  }

  if (code !== 'ko' && state.activeName && /[가-힣]/.test(state.activeName)) {
    const localizedResident = getSitemapNameForLevel(state.currentLevel, code);
    if (localizedResident) {
      state.activeName = localizedResident;
      state.activeStrokeInfo = analyzeNameToCar(localizedResident);
      if (DOM.nameInput && /[가-힣]/.test(DOM.nameInput.value)) {
        DOM.nameInput.value = '';
      }
    }
  } else if (!state.userOriginalCar && state.currentCar) {
    const localizedResident = getSitemapNameForLevel(state.currentLevel, code);
    if (localizedResident) {
      state.activeName = localizedResident;
      state.activeStrokeInfo = analyzeNameToCar(localizedResident);
    }
  }

  updateLocalizedStaticTexts();
  updateSampleChipsForLanguage(code);

  if (state.currentCar) {
    renderCard(state.currentCar, state.activeName, state.activeStrokeInfo);
  }

  updateExplorerDock(state.currentLevel);
  updateReturnBanner();

  setWorldCupLanguage(code);
  if (state.activeTab !== 'finder' && state.activeTab !== 'search') {
    const wcRoot = document.getElementById('worldcup-root');
    if (wcRoot) renderWorldCup(wcRoot);
  }

  if (updateUrl && typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    if (code === 'ko') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', code);
    }
    try {
      window.history.replaceState(window.history.state, '', url.toString());
    } catch (_) {}
  }
}

export const ENGLISH_SAMPLE_NAMES = [
  'Sophia', 'Lucas', 'Oliver', 'Emma', 'Chloe', 'Noah', 'Leo', 'Liam',
  'Mia', 'David', 'Ethan', 'Charlotte', 'Amelia', 'James', 'Benjamin',
  'Alexander', 'Daniel', 'Samuel', 'Ava', 'Jackson', 'Henry', 'Sebastian'
];

export const CURATED_RANDOM_NAMES = [
  '김서윤', '이민준', '홍길동', '해리포터', '손흥민', '박도윤', '정예준', '최시우', '강하은', '윤서아',
  '임하윤', '한지우', '오주원', '서채원', '신현우', '황수아', '안지호', '송예린',
  '페이커', '유재석', '아이유', '차은우', '이강인', '김연아', '봉준호', '마동석',
  '배트맨', '아이언맨', '스파이더맨', '토토로', '이순신', '세종대왕',
  'Sophia', 'Lucas', 'Oliver', 'Emma', 'Chloe', 'Noah', 'Leo', 'Liam'
];

export function getRandomName() {
  const langMap = getLanguageMap();
  if (state.lang !== 'ko') {
    const langMeta = langMap[state.lang] || langMap['en'];
    const pool = [...(langMeta.sampleNames || []), ...ENGLISH_SAMPLE_NAMES];
    if (Math.random() < 0.6 && pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const randomLv = Math.floor(Math.random() * (MAX_LEVEL + 1));
    return getSitemapNameForLevel(randomLv, state.lang) || pool[0] || 'Steve';
  }

  if (Math.random() < 0.5) {
    return CURATED_RANDOM_NAMES[Math.floor(Math.random() * CURATED_RANDOM_NAMES.length)];
  }
  const randomLv = Math.floor(Math.random() * (MAX_LEVEL + 1));
  return getSitemapNameForLevel(randomLv, state.lang) || CURATED_RANDOM_NAMES[0];
}

export function refreshRandomSampleChips() {
  if (!DOM.sampleChips) return;
  const langMap = getLanguageMap();

  if (state.lang !== 'ko') {
    const langMeta = langMap[state.lang] || langMap['en'];
    const baseSamples = langMeta.sampleNames || ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah'];
    const pickedSet = new Set();
    let attempts = 0;
    while (pickedSet.size < 5 && attempts < 50) {
      attempts++;
      if (Math.random() < 0.5 && baseSamples.length > 0) {
        pickedSet.add(baseSamples[Math.floor(Math.random() * baseSamples.length)]);
      } else {
        const randomLv = Math.floor(Math.random() * (MAX_LEVEL + 1));
        const sName = getSitemapNameForLevel(randomLv, state.lang);
        if (sName && !/[가-힣]/.test(sName)) pickedSet.add(sName);
      }
    }
    for (const s of baseSamples) {
      if (pickedSet.size < 5) pickedSet.add(s);
    }
    const finalNames = Array.from(pickedSet).slice(0, 5);
    DOM.sampleChips.innerHTML = finalNames.map(name => {
      const analyzed = analyzeNameToCar(name);
      return `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
    }).join('');
    return;
  }

  const pickedSet = new Set();
  pickedSet.add(ENGLISH_SAMPLE_NAMES[Math.floor(Math.random() * ENGLISH_SAMPLE_NAMES.length)]);
  const koreanPool = CURATED_RANDOM_NAMES.filter(n => !/^[A-Za-z\s]+$/.test(n));

  let attempts = 0;
  while (pickedSet.size < 5 && attempts < 50) {
    attempts++;
    if (Math.random() < 0.6 && koreanPool.length > 0) {
      const candidate = koreanPool[Math.floor(Math.random() * koreanPool.length)];
      if (candidate) pickedSet.add(candidate);
    } else {
      const randomLv = Math.floor(Math.random() * (MAX_LEVEL + 1));
      const sName = getSitemapNameForLevel(randomLv, 'ko');
      if (sName) pickedSet.add(sName);
    }
  }

  const finalNames = Array.from(pickedSet).sort(() => Math.random() - 0.5);
  DOM.sampleChips.innerHTML = finalNames.map(name => {
    const analyzed = analyzeNameToCar(name);
    return `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
  }).join('');
}

export function handleRandomDiceClick() {
  if (DOM.randomDiceBtn) {
    DOM.randomDiceBtn.classList.remove('rolling');
    void DOM.randomDiceBtn.offsetWidth;
    DOM.randomDiceBtn.classList.add('rolling');
  }

  const dict = getUiDict(state.lang);
  const randomName = getRandomName();
  if (DOM.nameInput) {
    DOM.nameInput.value = randomName;
  }
  navigateToName(randomName, true, true);
  refreshRandomSampleChips();
  const toastText = (dict.randomDiceToast || "🎲 '{name}'").replace('{name}', randomName);
  showToast(toastText);
}

function updateSampleChipsForLanguage(langCode) {
  if (!DOM.sampleChips) return;
  const langMap = getLanguageMap();
  const langMeta = langMap[langCode] || langMap['ko'];
  const sampleNames = langMeta.sampleNames || ['김서윤', '이민준', '홍길동', '해리포터', '손흥민'];

  DOM.sampleChips.innerHTML = sampleNames.map(name => {
    const analyzed = analyzeNameToCar(name);
    return `<button type="button" class="sample-chip" data-name="${escapeHtml(name)}">${escapeHtml(name)} (Lv.${analyzed.level})</button>`;
  }).join('');
}

export async function handleInitialRoute() {
  let initialName = null;
  let initialLevel = null;
  let initialLang = 'ko';
  const langMap = getLanguageMap();

  try {
    const path = (window.location.pathname || '').replace(/^\/car(?=\/|$)/, '') || '/';
    const searchParams = new URLSearchParams(window.location.search || '');

    if (searchParams.has('lang')) {
      const qLang = searchParams.get('lang');
      if (langMap[qLang]) initialLang = qLang;
    } else {
      try {
        const savedLang = localStorage.getItem('mycar_lang');
        if (savedLang && langMap[savedLang]) initialLang = savedLang;
      } catch (_) {}
    }

    const nameMatch = path.match(/^\/name\/([^/?#]+)/i);
    if (nameMatch) {
      initialName = decodeURIComponent(nameMatch[1]);
    }
    if (!initialName && searchParams.has('name')) {
      initialName = searchParams.get('name');
    }

    const levelMatch = path.match(/^\/level\/(\d+)/i);
    if (levelMatch) {
      initialLevel = parseInt(levelMatch[1], 10);
    }
    if (initialLevel === null && searchParams.has('level')) {
      initialLevel = parseInt(searchParams.get('level'), 10);
    }

    if (searchParams.has('from')) {
      const fromName = searchParams.get('from');
      const analyzed = analyzeNameToCar(fromName);
      state.userOriginalCar = {
        name: analyzed.cleanName,
        level: analyzed.level,
        strokeInfo: analyzed
      };
    }
  } catch (err) {
    console.warn('[MyCar] Route parsing exception:', err);
  }

  setLanguage(initialLang, false);

  const curPath = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
  if (curPath.startsWith('/worldcup')) {
    const qp = new URLSearchParams(window.location.search || '');
    let wcMode = curPath.includes('best-to-worst')
      ? 'best-to-worst'
      : (curPath.includes('worst-to-best') ? 'worst-to-best' : null);
    if (!wcMode && qp.has('mode')) {
      const qm = qp.get('mode');
      if (qm === 'best-to-worst' || qm === 'worst-to-best') {
        wcMode = qm;
      }
    }
    if (!wcMode) wcMode = 'worst-to-best';
    const roundSize = qp.has('round') ? parseInt(qp.get('round'), 10) : null;
    const seed = qp.has('seed') ? qp.get('seed') : null;
    switchModeTab(wcMode, false, { roundSize, seed });
    return;
  }

  if (initialName) {
    await navigateToName(initialName, false, false);
  } else if (initialLevel !== null && !isNaN(initialLevel)) {
    await navigateToLevel(initialLevel, false);
  } else {
    const defaultSampleName = (langMap[initialLang]?.sampleNames?.[0]) || '김서윤';
    await navigateToName(defaultSampleName, false, false);
  }
}

function registerEventListeners() {
  const modeTabsEl = document.getElementById('mode-tabs');
  if (modeTabsEl) {
    modeTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-tab-btn');
      if (btn && btn.dataset.mode) {
        switchModeTab(btn.dataset.mode);
      }
    });
  }

  if (DOM.langSelect) {
    DOM.langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value, true);
    });
  }

  if (DOM.searchForm) {
    DOM.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (DOM.nameInput) {
        navigateToName(DOM.nameInput.value, true, true);
      }
    });
  }

  if (DOM.searchBtn) {
    DOM.searchBtn.addEventListener('click', () => {
      if (DOM.nameInput) {
        navigateToName(DOM.nameInput.value, true, true);
      }
    });
  }

  if (DOM.randomDiceBtn) {
    DOM.randomDiceBtn.addEventListener('click', () => {
      handleRandomDiceClick();
    });
  }

  if (DOM.btnRefreshChips) {
    DOM.btnRefreshChips.addEventListener('click', () => {
      const dict = getUiDict(state.lang);
      refreshRandomSampleChips();
      showToast(dict.refreshChipsToast || '🔄 추천 이름이 새로고침되었습니다!');
    });
  }

  if (DOM.sampleChips) {
    DOM.sampleChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.sample-chip');
      if (chip && chip.dataset.name) {
        navigateToName(chip.dataset.name, true, true);
      }
    });
  }

  if (DOM.btnPrevLevel) {
    DOM.btnPrevLevel.addEventListener('click', () => {
      navigateToLevel(getPrevActiveLevel(state.currentLevel), true);
    });
  }

  if (DOM.btnRandomLevel) {
    DOM.btnRandomLevel.addEventListener('click', () => {
      navigateToRandom();
    });
  }

  if (DOM.btnNextLevel) {
    DOM.btnNextLevel.addEventListener('click', () => {
      navigateToLevel(getNextActiveLevel(state.currentLevel), true);
    });
  }

  if (DOM.returnMyHouseBtn) {
    DOM.returnMyHouseBtn.addEventListener('click', () => {
      if (state.userOriginalCar && state.userOriginalCar.name) {
        navigateToName(state.userOriginalCar.name, true, false);
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'finder' && state.activeTab !== 'search') return;
    const activeEl = document.activeElement;
    const tagName = activeEl ? activeEl.tagName.toLowerCase() : '';
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || activeEl?.isContentEditable) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToLevel(getPrevActiveLevel(state.currentLevel), true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToLevel(getNextActiveLevel(state.currentLevel), true);
    } else if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      navigateToRandom();
    }
  });

  window.addEventListener('popstate', (e) => {
    if (e.state) {
      if (e.state.tab && e.state.tab !== 'finder' && e.state.tab !== 'search') {
        switchModeTab(e.state.tab, false, { roundSize: e.state.round, seed: e.state.seed });
        return;
      }
      if (e.state.name) {
        switchModeTab('finder', false);
        navigateToName(e.state.name, false, false);
      } else if (e.state.level !== undefined) {
        switchModeTab('finder', false);
        navigateToLevel(e.state.level, false);
      }
      if (e.state.lang && e.state.lang !== state.lang) {
        setLanguage(e.state.lang, false);
      }
    } else {
      handleInitialRoute();
    }
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Switch between 'finder', 'worst-to-best', and 'best-to-worst' tabs
 */
export function switchModeTab(mode, pushState = true, wcOptions = {}) {
  const normalizedMode = (!mode || mode === 'search') ? 'finder' : mode;
  state.activeTab = normalizedMode;
  const isFinder = normalizedMode === 'finder';

  const modeTabsEl = document.getElementById('mode-tabs');
  const searchSection = document.getElementById('search-section');
  const cardRoot = document.getElementById('card-root');
  const worldcupRoot = document.getElementById('worldcup-root');
  const explorerDock = document.getElementById('explorer-dock');
  const returnBar = document.getElementById('return-my-house-bar');
  const guideSection = document.querySelector('.service-guide-section');
  const appLayout = document.querySelector('.app-layout');

  if (appLayout) {
    appLayout.classList.toggle('wc-wide', !isFinder);
  }

  if (pushState && typeof window !== 'undefined' && window.history && window.history.pushState) {
    const langParam = (state.lang && state.lang !== 'ko') ? `?lang=${state.lang}` : '';
    const targetUrl = isFinder
      ? `/${langParam}`
      : `/worldcup/${normalizedMode}${langParam}`;
    if (window.location.pathname !== (isFinder ? '/' : `/worldcup/${normalizedMode}`)) {
      try {
        window.history.pushState({ tab: normalizedMode, lang: state.lang }, '', targetUrl);
      } catch (_) {}
    }
  }

  if (modeTabsEl) {
    modeTabsEl.querySelectorAll('.mode-tab-btn').forEach(btn => {
      const btnMode = btn.dataset.mode === 'search' ? 'finder' : btn.dataset.mode;
      btn.classList.toggle('active', btnMode === normalizedMode);
    });
  }

  if (isFinder) {
    if (searchSection) searchSection.classList.remove('hidden');
    if (cardRoot) cardRoot.classList.remove('hidden');
    if (explorerDock) explorerDock.classList.remove('hidden');
    if (guideSection) guideSection.classList.remove('hidden');
    if (worldcupRoot) worldcupRoot.classList.add('hidden');
    updateReturnBanner();
  } else {
    if (searchSection) searchSection.classList.add('hidden');
    if (cardRoot) cardRoot.classList.add('hidden');
    if (explorerDock) explorerDock.classList.add('hidden');
    if (guideSection) guideSection.classList.add('hidden');
    if (returnBar) returnBar.classList.add('hidden');
    if (worldcupRoot) {
      worldcupRoot.classList.remove('hidden');
      setWorldCupLanguage(state.lang);
      openWorldCupMode(normalizedMode, worldcupRoot, {
        onViewCar: (level) => {
          switchModeTab('finder');
          navigateToLevel(level, true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onSwitchMode: (nextMode) => {
          switchModeTab(nextMode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onToast: (msg) => showToast(msg)
      }, wcOptions);
    }
  }
}

export function init() {
  initDomElements();
  registerEventListeners();
  handleInitialRoute();
  pushPendingAdSense();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

if (typeof window !== 'undefined') {
  window.renderCarFallbackSvg = function (level) {
    try {
      const c = getConceptSync(level);
      const uriFn = taxonomyMod.getCarArtworkSvgDataUri || taxonomyMod.getJobArtworkSvgDataUri || taxonomyMod.getHouseArtworkSvgDataUri;
      if (c && typeof uriFn === 'function') {
        return uriFn(c);
      }
      const svgFn = taxonomyMod.renderCarArtworkSvg || taxonomyMod.renderJobArtworkSvg;
      if (c && typeof svgFn === 'function') {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgFn(c));
      }
    } catch (_) {}
    return '/favicon.svg';
  };
  window.renderJobFallbackSvg = window.renderCarFallbackSvg;
  window.renderHouseFallbackSvg = window.renderCarFallbackSvg;
}
