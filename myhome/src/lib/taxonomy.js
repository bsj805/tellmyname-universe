// src/lib/taxonomy.js — 0~999단계 (1,000종) 건물 마스터 택소노미 및 50:50 교차 데이터셋 엔진
// myhome.tellmyname.app

import {
  MIN_LEVEL,
  MAX_LEVEL,
  TOTAL_LEVELS,
  GOOD_HOUSE_THRESHOLD,
  HOUSE_CATEGORIES,
  getHouseImageUrl,
  getLevelClassifier
} from './constants.js';

import { MASTER_TIERS_500, MASTER_HOUSES } from './master_dataset.js';

// 12개 카테고리 룩업 맵
export const CATEGORY_MAP = Object.fromEntries(
  HOUSE_CATEGORIES.map(c => [c.id, c])
);

// 20개 티어 마스터 정의 (0~499: BAD 폭망 하우스 / 500~999: GOOD 대박 하우스)
export const MASTER_TIERS = MASTER_TIERS_500.map((t, idx) => ({
  ...t,
  tierName: t.name || t.tierName,
  minLevel: t.range ? t.range[0] : idx * 50,
  maxLevel: t.range ? t.range[1] : (idx + 1) * 50 - 1
}));

/**
 * 0~999 단계별 주택 정보 즉시 반환 (중복 0% 고유 마스터 데이터)
 * @param {number} level 0 ~ 999
 */
export function getHouseConceptByLevel(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const item = MASTER_HOUSES[lv];
  if (item) {
    const cat = CATEGORY_MAP[item.category] || {};
    return {
      ...item,
      categoryLabel: cat.label || item.categoryLabel,
      categoryEmoji: cat.emoji || item.categoryEmoji || '🏠',
      imageUrl: getHouseImageUrl(lv, false),
      ogImageUrl: getHouseImageUrl(lv, true)
    };
  }

  // Fallback (비상용)
  const classifier = getLevelClassifier(lv);
  const tierIndex = classifier.tier - 1;
  const masterTier = MASTER_TIERS[tierIndex] || MASTER_TIERS[0];
  const cat = HOUSE_CATEGORIES[0];
  return {
    level: lv,
    tier: masterTier.tier,
    tierName: masterTier.tierName,
    zone: classifier.zone,
    zoneLabel: classifier.zoneLabel,
    realityType: classifier.realityType,
    realityLabel: classifier.realityLabel,
    category: cat.id,
    categoryLabel: cat.label,
    categoryEmoji: cat.emoji,
    title: `다중우주 제${lv}호 감정 대상 건축물`,
    builtYear: '알 수 없는 시공간',
    estimatedValue: classifier.zone === 'GOOD' ? '100억 원' : '고철값 100원',
    specialFeature: '시간과 공간의 법칙을 뒤흔드는 기괴한 주거 특권이 부여됩니다.',
    aiVerdict: 'AI 감정평가사가 심혈을 기울여 다중우주 등기부에 정식 등록한 건축물입니다.',
    geminiImagePrompt: `Cinematic concept art of level ${lv} architecture, 8k resolution.`,
    imageUrl: classifier.imageUrl,
    ogImageUrl: classifier.ogImageUrl
  };
}

const TIER_PALETTES = [
  ['#1a0505', '#450a0a', '#dc2626', '#fca5a5'], // Tier 1: Magma/Sulfur
  ['#1c1917', '#44403c', '#d97706', '#fde68a'], // Tier 2: Cardboard/Trash
  ['#1e1b4b', '#312e81', '#818cf8', '#e0e7ff'], // Tier 3: Doghouse/Closet
  ['#042f2e', '#115e59', '#2dd4bf', '#ccfbf1'], // Tier 4: Bizarre Toilet
  ['#090d16', '#1e293b', '#64748b', '#e2e8f0'], // Tier 5: Ruin/Prison
  ['#27272a', '#3f3f46', '#f59e0b', '#fef3c7'], // Tier 6: Broken Vehicle
  ['#0c4a6e', '#0369a1', '#38bdf8', '#e0f2fe'], // Tier 7: Extreme Nature
  ['#3b0764', '#6b21a8', '#c084fc', '#f3e8ff'], // Tier 8: Upside-down B-grade
  ['#431407', '#9a3412', '#fb923c', '#ffedd5'], // Tier 9: 1-Pyeong / Giant Object
  ['#450a0a', '#7f1d1d', '#facc15', '#fef9c3'], // Tier 10: Cursed Boss Bad House
  ['#064e3b', '#047857', '#34d399', '#d1fae5'], // Tier 11: Bunker / Geek Rich
  ['#1e3a8a', '#1d4ed8', '#60a5fa', '#dbeafe'], // Tier 12: Luxury Mobility / Museum
  ['#31102f', '#701a75', '#e879f9', '#fae8ff'], // Tier 13: Billionaire Cliff Mansion
  ['#422006', '#854d0e', '#facc15', '#fef08a'], // Tier 14: Skyscraper / Wonder
  ['#083344', '#0e7490', '#22d3ee', '#cffafe'], // Tier 15: Undersea / Floating Megacity
  ['#0f172a', '#334155', '#38bdf8', '#f0f9ff'], // Tier 16: CERN / Mega Science Island
  ['#090d16', '#1e1b4b', '#a78bfa', '#ede9fe'], // Tier 17: Orbital ISS / Lunar Palace
  ['#451a03', '#92400e', '#fbbf24', '#fef3c7'], // Tier 18: Mars / Saturn Ring Resort
  ['#2e1065', '#581c87', '#f472b6', '#fce7f3'], // Tier 19: Dyson Sphere / Asgard
  ['#020617', '#1e1b4b', '#fde047', '#ffffff']  // Tier 20: Multiverse Creator Penthouse
];

const CATEGORY_VECTORS = {
  TOILET: '<rect x="380" y="340" width="260" height="280" rx="36" fill="none" stroke="currentColor" stroke-width="16"/><ellipse cx="512" cy="620" rx="180" ry="70" fill="none" stroke="currentColor" stroke-width="16"/><path d="M360 620 Q512 820 664 620" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="590" cy="400" r="18" fill="currentColor"/>',
  CLOSET: '<rect x="312" y="260" width="400" height="540" rx="18" fill="none" stroke="currentColor" stroke-width="16"/><line x1="512" y1="260" x2="512" y2="800" stroke="currentColor" stroke-width="14"/><circle cx="475" cy="530" r="14" fill="currentColor"/><circle cx="549" cy="530" r="14" fill="currentColor"/>',
  DOGHOUSE: '<polygon points="512,260 250,480 774,480" fill="none" stroke="currentColor" stroke-width="16"/><rect x="300" y="480" width="424" height="320" fill="none" stroke="currentColor" stroke-width="16"/><path d="M432,800 L432,610 A80,80 0 0,1 592,610 L592,800" fill="none" stroke="currentColor" stroke-width="16"/>',
  BOX: '<polygon points="512,280 760,400 760,700 512,820 264,700 264,400" fill="none" stroke="currentColor" stroke-width="16"/><polyline points="264,400 512,520 760,400" fill="none" stroke="currentColor" stroke-width="16"/><line x1="512" y1="520" x2="512" y2="820" stroke="currentColor" stroke-width="16"/>',
  VEHICLE: '<path d="M220,620 L290,430 L734,430 L804,620 Z" fill="none" stroke="currentColor" stroke-width="16"/><rect x="190" y="620" width="644" height="120" rx="30" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="330" cy="750" r="65" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="694" cy="750" r="65" fill="none" stroke="currentColor" stroke-width="16"/>',
  SPACESHIP: '<path d="M512,220 C640,380 660,580 620,740 L404,740 C364,580 384,380 512,220 Z" fill="none" stroke="currentColor" stroke-width="16"/><polygon points="404,600 260,760 404,740" fill="none" stroke="currentColor" stroke-width="16"/><polygon points="620,600 764,760 620,740" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="512" cy="460" r="55" fill="none" stroke="currentColor" stroke-width="16"/>',
  FICTION_MEDIA: '<polygon points="280,780 280,420 400,280 512,420 624,260 744,420 744,780" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="512" cy="560" r="75" fill="none" stroke="currentColor" stroke-width="14"/>',
  MUSEUM_PUBLIC: '<polygon points="512,250 220,410 804,410" fill="none" stroke="currentColor" stroke-width="16"/><line x1="280" y1="410" x2="280" y2="750" stroke="currentColor" stroke-width="18"/><line x1="435" y1="410" x2="435" y2="750" stroke="currentColor" stroke-width="18"/><line x1="589" y1="410" x2="589" y2="750" stroke="currentColor" stroke-width="18"/><line x1="744" y1="410" x2="744" y2="750" stroke="currentColor" stroke-width="18"/><rect x="210" y="750" width="604" height="50" fill="none" stroke="currentColor" stroke-width="16"/>',
  IMAGINARY_CITY: '<rect x="240" y="460" width="130" height="330" fill="none" stroke="currentColor" stroke-width="14"/><rect x="410" y="300" width="180" height="490" fill="none" stroke="currentColor" stroke-width="16"/><rect x="630" y="390" width="150" height="400" fill="none" stroke="currentColor" stroke-width="14"/><circle cx="500" cy="230" r="36" fill="none" stroke="currentColor" stroke-width="14"/>',
  EXTREME_NATURE: '<polygon points="180,790 420,310 590,580 710,380 860,790" fill="none" stroke="currentColor" stroke-width="16"/><path d="M360,430 Q512,200 660,350" fill="none" stroke="currentColor" stroke-width="12" stroke-dasharray="16 12"/>',
  WEIRD_ARCH: '<polygon points="512,220 790,780 234,780" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="512" cy="580" r="110" fill="none" stroke="currentColor" stroke-width="14"/><line x1="512" y1="220" x2="512" y2="780" stroke="currentColor" stroke-width="10" stroke-dasharray="14 14"/>',
  MULTIVERSE: '<circle cx="512" cy="520" r="240" fill="none" stroke="currentColor" stroke-width="14"/><ellipse cx="512" cy="520" rx="290" ry="95" transform="rotate(-25 512 520)" fill="none" stroke="currentColor" stroke-width="14"/><ellipse cx="512" cy="520" rx="290" ry="95" transform="rotate(35 512 520)" fill="none" stroke="currentColor" stroke-width="14"/><circle cx="512" cy="520" r="55" fill="currentColor"/>'
};

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderHouseArtworkSvg(concept) {
  if (!concept) return '';
  const tierIdx = Math.max(0, Math.min(19, (concept.tier || 1) - 1));
  const [bgStart, bgEnd, accent, textLight] = TIER_PALETTES[tierIdx] || TIER_PALETTES[0];
  const vector = CATEGORY_VECTORS[concept.category] || CATEGORY_VECTORS.WEIRD_ARCH;
  const isReal = concept.realityType === 'REAL';
  const isGood = concept.zone === 'GOOD';
  const paddedLv = String(concept.level || 0).padStart(5, '0');

  let stars = '';
  for (let i = 0; i < 18; i++) {
    const cx = (((concept.level || 0) * 137 + i * 293) % 920) + 52;
    const cy = (((concept.level || 0) * 251 + i * 179) % 620) + 80;
    const r = (((concept.level || 0) + i) % 4) + 2;
    const op = ((((concept.level || 0) + i * 3) % 6) + 3) / 10;
    stars += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="${op}"/>`;
  }

  const titleText = String(concept.title || '');
  const line1 = titleText.slice(0, 20);
  const line2 = titleText.slice(20, 42);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}"/>
      <stop offset="100%" stop-color="${bgEnd}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>
  <circle cx="512" cy="520" r="420" fill="url(#glowGrad)"/>
  ${stars}
  <rect x="44" y="44" width="936" height="936" rx="42" fill="none" stroke="${accent}" stroke-width="4" stroke-opacity="0.45"/>
  <rect x="84" y="84" width="260" height="58" rx="29" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
  <text x="214" y="122" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="26" font-weight="800">LV. ${paddedLv} / 20000</text>
  <rect x="650" y="84" width="290" height="58" rx="29" fill="#000000" fill-opacity="0.45" stroke="${textLight}" stroke-width="2" stroke-opacity="0.5"/>
  <text x="795" y="122" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="24" font-weight="700">${isReal ? '짝수 · 실제 건축물' : '홀수 · 허구 건축물'}</text>
  <g color="${accent}" transform="translate(0, -30)">
    ${vector}
  </g>
  <rect x="74" y="740" width="876" height="200" rx="28" fill="#000000" fill-opacity="0.62" stroke="${accent}" stroke-width="2" stroke-opacity="0.6"/>
  <text x="512" y="790" text-anchor="middle" fill="${accent}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="24" font-weight="800">[${isGood ? '대박 하우스' : '폭망 하우스'} · Tier ${String(concept.tier || 1).padStart(2, '0')}] ${escapeXml(concept.categoryLabel || '')}</text>
  <text x="512" y="842" text-anchor="middle" fill="#ffffff" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="32" font-weight="800">${escapeXml(line1)}</text>
  ${line2 ? `<text x="512" y="886" text-anchor="middle" fill="#ffffff" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="30" font-weight="700">${escapeXml(line2)}</text>` : ''}
  <text x="512" y="924" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="21" font-weight="600">추산 가치: ${escapeXml(String(concept.estimatedValue || '').slice(0, 38))} | myhome.tellmyname.app</text>
</svg>`;
}

export function getHouseArtworkSvgDataUri(concept) {
  const svg = renderHouseArtworkSvg(concept);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
