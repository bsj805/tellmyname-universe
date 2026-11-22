// src/lib/taxonomy.js — Car Taxonomy, Level Lookup & 1024x1024 SVG Illustration Generator for MyCar (car.tellmyname.app)

import {
  MASTER_TIERS_1001,
  MASTER_TIERS_500,
  MASTER_CARS,
  MASTER_JOBS,
  MASTER_HOUSES,
  lookupCarByLevel
} from './master_dataset.js';

export {
  MASTER_TIERS_1001,
  MASTER_TIERS_500,
  MASTER_CARS,
  MASTER_JOBS,
  MASTER_HOUSES
};

const TIER_PALETTES = [
  ['#1a0505', '#450a0a', '#ef4444', '#fca5a5'], // Tier 1: Stone Age & Hell
  ['#2e1024', '#500724', '#f472b6', '#fbcfe8'], // Tier 2: Baby Trikes & Broken Toys
  ['#1c1917', '#44403c', '#f97316', '#fed7aa'], // Tier 3: Broken Carts & Junk
  ['#042f2e', '#115e59', '#2dd4bf', '#ccfbf1'], // Tier 4: Slow/Grumpy Creatures
  ['#2a1805', '#5a2d0c', '#fb923c', '#ffedd5'], // Tier 5: Wild Rampaging Mounts
  ['#18181b', '#3f3f46', '#eab308', '#fef08a'], // Tier 6: Bizarre Modded Clunkers
  ['#0c2239', '#1e3a5f', '#38bdf8', '#bae6fd'], // Tier 7: Extreme Weather Delivery
  ['#2e1065', '#4c1d95', '#a78bfa', '#ede9fe'], // Tier 8: Absurd Public Beaters
  ['#3b0764', '#701a75', '#e879f9', '#fae8ff'], // Tier 9: Acrobatic Thrill Rides
  ['#330b0b', '#7f1d1d', '#f59e0b', '#fef3c7'], // Tier 10: Threshold Clunkers
  ['#064e3b', '#047857', '#10b981', '#d1fae5'], // Tier 11: Firebolt & Dream Opens
  ['#082f49', '#0369a1', '#38bdf8', '#e0f2fe'], // Tier 12: Great White Shark & Apex Mounts
  ['#1e1b4b', '#3730a3', '#818cf8', '#e0e7ff'], // Tier 13: Anime & Fantasy Legends
  ['#090d16', '#1e293b', '#38bdf8', '#f8fafc'], // Tier 14: Batmobile & Hero Tech
  ['#3b2304', '#78350f', '#fbbf24', '#fef3c7'], // Tier 15: 24K Gold Hypercars
  ['#0f172a', '#1e293b', '#f59e0b', '#fef08a'], // Tier 16: Moving Fortresses
  ['#022c22', '#065f46', '#34d399', '#ecfdf5'], // Tier 17: Mega Yachts & Helicarriers
  ['#451a03', '#92400e', '#fcd34d', '#fffbeb'], // Tier 18: Arch-Dragons & Myth Chariots
  ['#0f0a2a', '#312e81', '#c084fc', '#f5f3ff'], // Tier 19: Interplanetary Warp Cruisers
  ['#020617', '#1e1b4b', '#fde047', '#ffffff']  // Tier 20: Multiverse Omega Throne
];

const CAR_CATEGORY_VECTORS = {
  // 1. Baby tricycle / toy ride
  BABY_TOY_RIDE: '<circle cx="-110" cy="45" r="42" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="-110" cy="45" r="10" fill="currentColor"/><circle cx="70" cy="60" r="26" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="115" cy="60" r="26" fill="none" stroke="currentColor" stroke-width="9"/><path d="M-110 45 L-50 -55 L-75 -55 M-50 -55 L15 20 L85 20 L110 60 M-10 -25 L25 -25" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>',
  // 2. Shopping cart / handcart
  CART_HANDCART: '<path d="M-130 -60 L-95 -60 L-65 40 L95 40 L120 -35 L-85 -35" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><line x1="-78" y1="0" x2="108" y2="0" stroke="currentColor" stroke-width="7"/><line x1="-20" y1="-35" x2="-15" y2="40" stroke="currentColor" stroke-width="7"/><line x1="40" y1="-35" x2="35" y2="40" stroke="currentColor" stroke-width="7"/><circle cx="-55" cy="70" r="20" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="75" cy="70" r="18" fill="none" stroke="currentColor" stroke-width="9" stroke-dasharray="10 6"/>',
  // 3. Land animal mount (galloping silhouette + saddle)
  ANIMAL_LAND_MOUNT: '<path d="M-110 25 Q-85 -35 -10 -25 L45 -45 L75 -85 L110 -70 L95 -40 L60 -15 L55 55 M-10 20 L-25 75 M-85 25 L-115 70 M20 20 L35 75" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M-30 -30 Q5 -50 35 -30" fill="none" stroke="currentColor" stroke-width="9"/>',
  // 4. Shark / sea monster mount (fin & jaws)
  SHARK_SEA_MOUNT: '<path d="M-135 20 Q-60 -10 -15 -75 Q5 -25 55 -15 Q110 -5 135 20 Q70 35 0 30 Q-70 35 -135 20 Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><path d="M-135 20 L-160 -20 L-145 20 L-160 55 Z" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/><path d="M-140 75 Q-70 50 0 75 Q70 100 140 75" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>',
  // 5. Magic broom / flying carpet
  MAGIC_BROOM_CARPET: '<line x1="-130" y1="35" x2="80" y2="-35" stroke="currentColor" stroke-width="13" stroke-linecap="round"/><path d="M80 -35 L140 -75 M80 -35 L145 -45 M80 -35 L135 -15" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><polygon points="-70,-60 -62,-40 -40,-40 -58,-27 -51,-6 -70,-19 -89,-6 -82,-27 -100,-40 -78,-40" fill="none" stroke="currentColor" stroke-width="7"/>',
  // 6. Bizarre modded car
  BIZARRE_MOD_CAR: '<path d="M-125 35 L-125 -5 L-75 -15 L-45 -55 L45 -55 L85 -10 L130 -5 L130 35 Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><circle cx="-75" cy="45" r="28" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="75" cy="45" r="22" fill="none" stroke="currentColor" stroke-width="10"/><path d="M-125 -15 L-148 -45 M-140 -60 Q-125 -80 -105 -65" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>',
  // 7. Fantasy / anime ride (winged dragon)
  FANTASY_ANIME_RIDE: '<path d="M-120 35 Q-50 -60 0 -10 Q50 -60 120 35 Q60 10 0 40 Q-60 10 -120 35 Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><path d="M0 -10 L0 -75 L25 -55 L0 -40" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="55" r="14" fill="currentColor"/>',
  // 8. Movie / hero / sci-fi vehicle (sleek bat-fin turbo)
  MOVIE_HERO_VEHICLE: '<polygon points="-140,30 -90,-40 -25,-25 0,-60 25,-25 90,-40 140,30 75,45 0,25 -75,45" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><circle cx="-70" cy="45" r="24" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="70" cy="45" r="24" fill="none" stroke="currentColor" stroke-width="9"/>',
  // 9. Hyper luxury car
  HYPER_LUXURY_CAR: '<path d="M-145 30 Q-120 -25 -35 -42 L40 -42 Q105 -20 145 20 L135 42 L-135 42 Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><circle cx="-82" cy="42" r="27" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="82" cy="42" r="27" fill="none" stroke="currentColor" stroke-width="10"/><line x1="-25" y1="-22" x2="45" y2="-22" stroke="currentColor" stroke-width="7"/>',
  // 10. Superyacht / private jet
  ROYAL_YACHT_JET: '<polygon points="-145,20 125,20 155,-15 -95,-15" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><path d="M-65 -15 L-35 -55 L55 -55 L85 -15 M-145 55 Q-70 35 0 55 Q70 75 145 55" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>',
  // 11. Space warp cruiser
  SPACE_WARP_CRUISER: '<path d="M0 -115 C55 -45 65 25 50 80 L-50 80 C-65 25 -55 -45 0 -115 Z" fill="none" stroke="currentColor" stroke-width="10"/><polygon points="-52,25 -115,85 -50,75" fill="none" stroke="currentColor" stroke-width="9"/><polygon points="52,25 115,85 50,75" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="0" cy="-15" r="22" fill="none" stroke="currentColor" stroke-width="8"/>',
  // 12. Multiverse god ride
  MULTIVERSE_GOD_RIDE: '<circle cx="0" cy="0" r="85" fill="none" stroke="currentColor" stroke-width="9"/><ellipse cx="0" cy="0" rx="135" ry="42" transform="rotate(-25)" fill="none" stroke="currentColor" stroke-width="8"/><ellipse cx="0" cy="0" rx="135" ry="42" transform="rotate(35)" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="0" cy="0" r="22" fill="currentColor"/>'
};

/**
 * 단계(0..1000)를 받아 자동차·탈것 컨셉 객체를 반환합니다.
 * @param {number} level
 * @returns {object}
 */
export function getCarConceptByLevel(level) {
  return lookupCarByLevel(level);
}

export const getJobConceptByLevel = getCarConceptByLevel;
export const getHouseConceptByLevel = getCarConceptByLevel;

/**
 * XML/HTML 특수문자를 이스케이프합니다.
 */
function xmlEscape(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 긴 문자열을 지정된 글자 수 단위로 분할합니다 (SVG 텍스트 줄바꿈용).
 */
function wrapText(text, maxChars = 24) {
  if (!text) return [];
  const words = String(text).trim();
  if (words.length <= maxChars) return [words];

  const lines = [];
  let remaining = words;
  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      lines.push(remaining);
      break;
    }
    let splitIdx = remaining.lastIndexOf(' ', maxChars);
    if (splitIdx <= 0) splitIdx = maxChars;
    lines.push(remaining.slice(0, splitIdx).trim());
    remaining = remaining.slice(splitIdx).trim();
  }
  return lines;
}

/**
 * 1024x1024 고품질 자동차·탈것 SVG 일러스트 카드를 렌더링합니다.
 * 이미지 미생성 시 Edge SSR 및 브라우저에서 폴백으로 즉시 표시됩니다.
 * @param {object} concept
 * @returns {string} SVG markup
 */
export function renderCarArtworkSvg(concept) {
  if (!concept) concept = MASTER_CARS[0];

  const lv = Math.max(0, Math.min(1000, Math.floor(Number(concept.level) || 0)));
  const tierNum = Math.max(1, Math.min(20, Math.floor(Number(concept.tier) || Math.min(20, Math.floor(lv / 50) + 1))));
  const [bgGradStart, bgGradEnd, tierAccent, tierLight] = TIER_PALETTES[tierNum - 1] || TIER_PALETTES[0];

  const isGood = concept.zone === 'GOOD' || lv >= 500;
  const isReal = concept.realityType === 'REAL' || lv % 2 === 0;
  const paddedLevel = String(lv).padStart(5, '0');

  const accentColor = isGood ? '#10b981' : '#ef4444';
  const accentSecondary = tierAccent || (isGood ? '#f59e0b' : '#f97316');
  const badgeBg = isGood ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.16)';
  const badgeBorder = isGood ? '#10b981' : '#ef4444';

  const zoneBadgeText = isGood ? '🌟 대박 탈것 (GOOD)' : '💀 폭망 탈것 (BAD)';
  const realityBadgeText = isReal ? '🏛️ 짝수 · 실제 탈것·생물' : '🦄 홀수 · 허구·마법·SF';
  const tierBadgeText = `Tier ${String(tierNum).padStart(2, '0')}: ${concept.tierName || ''}`;

  const eraText = concept.era || concept.builtYear || '동시대 및 다중우주';
  const priceText = concept.estimatedPrice || concept.estimatedSalary || concept.estimatedValue || '측정 불가';
  const featureText = concept.specialFeature || concept.specialDuty || '기상천외한 특수 주행 성능 탑재';

  const titleLines = wrapText(concept.title, 22).slice(0, 2);
  const featureLines = wrapText(featureText, 38).slice(0, 3);
  const categoryVector = CAR_CATEGORY_VECTORS[concept.category] || CAR_CATEGORY_VECTORS.BIZARRE_MOD_CAR;

  // Deterministic ambient stars/particles
  let particles = '';
  for (let i = 0; i < 16; i++) {
    const cx = ((lv * 137 + i * 293) % 900) + 62;
    const cy = ((lv * 251 + i * 179) % 520) + 120;
    const r = ((lv + i) % 3) + 2;
    const op = (((lv + i * 3) % 5) + 2) / 10;
    particles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tierLight}" opacity="${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" style="background:#090d16; font-family:'Pretendard','Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradStart}"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="${bgGradEnd}"/>
    </linearGradient>

    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="50%" stop-color="#475569"/>
      <stop offset="100%" stop-color="${accentSecondary}"/>
    </linearGradient>

    <linearGradient id="auraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${accentSecondary}" stop-opacity="0.3"/>
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentSecondary}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${accentSecondary}" stop-opacity="0"/>
    </radialGradient>

    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>

  <!-- Cybernetic Grid -->
  <g opacity="0.06" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="128" x2="1024" y2="128"/>
    <line x1="0" y1="256" x2="1024" y2="256"/>
    <line x1="0" y1="384" x2="1024" y2="384"/>
    <line x1="0" y1="512" x2="1024" y2="512"/>
    <line x1="0" y1="640" x2="1024" y2="640"/>
    <line x1="0" y1="768" x2="1024" y2="768"/>
    <line x1="0" y1="896" x2="1024" y2="896"/>
    <line x1="128" y1="0" x2="128" y2="1024"/>
    <line x1="256" y1="0" x2="256" y2="1024"/>
    <line x1="384" y1="0" x2="384" y2="1024"/>
    <line x1="512" y1="0" x2="512" y2="1024"/>
    <line x1="640" y1="0" x2="640" y2="1024"/>
    <line x1="768" y1="0" x2="768" y2="1024"/>
    <line x1="896" y1="0" x2="896" y2="1024"/>
  </g>
  ${particles}

  <!-- Main Card Container -->
  <rect x="36" y="36" width="952" height="952" rx="36" fill="rgba(15, 23, 42, 0.78)" stroke="url(#cardBorder)" stroke-width="3" filter="url(#softShadow)"/>

  <!-- Ambient Glow -->
  <circle cx="512" cy="365" r="300" fill="url(#centerGlow)"/>

  <!-- Header Badges -->
  <g transform="translate(64, 72)">
    <rect x="0" y="0" width="210" height="44" rx="22" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="2"/>
    <text x="105" y="29" fill="#ffffff" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">LV. ${paddedLevel} / 01000</text>

    <rect x="224" y="0" width="196" height="44" rx="22" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="2"/>
    <text x="322" y="28" fill="${accentColor}" font-size="17" font-weight="800" text-anchor="middle">${xmlEscape(zoneBadgeText)}</text>

    <rect x="434" y="0" width="246" height="44" rx="22" fill="rgba(255, 255, 255, 0.08)" stroke="#64748b" stroke-width="1.5"/>
    <text x="557" y="28" fill="#e2e8f0" font-size="15" font-weight="700" text-anchor="middle">${xmlEscape(realityBadgeText)}</text>

    <text x="896" y="72" fill="#94a3b8" font-size="15" font-weight="600" text-anchor="end">${xmlEscape(tierBadgeText)}</text>
  </g>

  <!-- Center Vehicle Vector & Orbital Rings -->
  <g transform="translate(512, 360)">
    <circle cx="0" cy="0" r="185" fill="none" stroke="${accentSecondary}" stroke-width="1.5" stroke-dasharray="10 14" opacity="0.45"/>
    <circle cx="0" cy="0" r="152" fill="none" stroke="#475569" stroke-width="1" opacity="0.6"/>
    <circle cx="0" cy="0" r="134" fill="rgba(15, 23, 42, 0.9)" stroke="url(#auraGlow)" stroke-width="4" filter="url(#glowFilter)"/>

    <!-- Custom Vector Silhouette -->
    <g color="${tierLight}" opacity="0.92" transform="scale(0.8)">
      ${categoryVector}
    </g>

    <!-- Category Emoji Stamp -->
    <text x="106" y="-88" font-size="52" text-anchor="middle">${xmlEscape(concept.categoryEmoji || '🚗')}</text>

    <!-- Category Pill -->
    <rect x="-175" y="148" width="350" height="36" rx="18" fill="rgba(0, 0, 0, 0.65)" stroke="${accentSecondary}" stroke-width="1.5"/>
    <text x="0" y="172" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">${xmlEscape(concept.categoryLabel || '특수 탈것')}</text>
  </g>

  <!-- Vehicle Title -->
  <g transform="translate(512, 616)">
    ${titleLines.map((line, idx) => {
      const yOffset = (idx - (titleLines.length - 1) / 2) * 42;
      return `<text x="0" y="${yOffset}" fill="#ffffff" font-size="31" font-weight="900" text-anchor="middle" filter="url(#softShadow)" letter-spacing="-0.5">${xmlEscape(line)}</text>`;
    }).join('\n    ')}
  </g>

  <!-- Key Specs Grid -->
  <g transform="translate(76, 696)">
    <rect x="0" y="0" width="420" height="72" rx="16" fill="rgba(30, 41, 59, 0.68)" stroke="#334155" stroke-width="1.5"/>
    <text x="20" y="26" fill="#94a3b8" font-size="13" font-weight="700">📅 언제 타던 탈것인가 (ERA)</text>
    <text x="20" y="53" fill="#f1f5f9" font-size="15" font-weight="700">${xmlEscape(String(eraText).slice(0, 28))}</text>

    <rect x="452" y="0" width="420" height="72" rx="16" fill="rgba(30, 41, 59, 0.68)" stroke="${badgeBorder}" stroke-width="1.5"/>
    <text x="472" y="26" fill="${accentColor}" font-size="13" font-weight="700">💰 추산 가격·유지비 (ESTIMATED PRICE)</text>
    <text x="472" y="53" fill="#ffffff" font-size="15" font-weight="800">${xmlEscape(String(priceText).slice(0, 28))}</text>
  </g>

  <!-- Special Feature Box -->
  <g transform="translate(76, 784)">
    <rect x="0" y="0" width="872" height="114" rx="16" fill="rgba(15, 23, 42, 0.88)" stroke="#334155" stroke-width="1.2"/>
    <text x="22" y="28" fill="${accentSecondary}" font-size="13" font-weight="800">⚡ 탈것의 특별한 기능·주행성능 (SPECIAL FEATURE)</text>
    ${featureLines.map((line, idx) => {
      return `<text x="22" y="${54 + idx * 23}" fill="#cbd5e1" font-size="14" font-weight="500">${xmlEscape(line)}</text>`;
    }).join('\n    ')}
  </g>

  <!-- Footer Watermark & Origin -->
  <g transform="translate(512, 946)">
    <line x1="-380" y1="-18" x2="380" y2="-18" stroke="#334155" stroke-width="1" opacity="0.6"/>
    <text x="0" y="5" fill="#94a3b8" font-size="14" font-weight="600" text-anchor="middle" letter-spacing="0.6">나에게 어울리는 자동차 · car.tellmyname.app · 0~1000 Level Master Taxonomy</text>
  </g>
</svg>`;
}

export const renderJobArtworkSvg = renderCarArtworkSvg;
export const renderHouseArtworkSvg = renderCarArtworkSvg;

/**
 * 1024x1024 SVG Data URI를 반환합니다 (Node.js & Cloudflare Workers 호환).
 * @param {object} concept
 * @returns {string}
 */
export function getCarArtworkSvgDataUri(concept) {
  const svgString = renderCarArtworkSvg(concept);
  if (typeof Buffer !== 'undefined') {
    const base64 = Buffer.from(svgString, 'utf8').toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
  if (typeof btoa !== 'undefined' && typeof TextEncoder !== 'undefined') {
    const bytes = new TextEncoder().encode(svgString);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/svg+xml;base64,${btoa(binary)}`;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export const getJobArtworkSvgDataUri = getCarArtworkSvgDataUri;
export const getHouseArtworkSvgDataUri = getCarArtworkSvgDataUri;
