// src/lib/taxonomy.js — Occupation Taxonomy, Level Lookup & 1024x1024 SVG Illustration Generator

import {
  MASTER_TIERS_1001,
  MASTER_TIERS_500,
  MASTER_JOBS,
  MASTER_HOUSES,
  lookupJobByLevel
} from './master_dataset.js';

export {
  MASTER_TIERS_1001,
  MASTER_TIERS_500,
  MASTER_JOBS,
  MASTER_HOUSES
};

/**
 * 단계(0..1000)를 받아 직업 컨셉 객체를 반환합니다.
 */
export function getJobConceptByLevel(level) {
  return lookupJobByLevel(level);
}

export const getHouseConceptByLevel = getJobConceptByLevel;

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
 * 1024x1024 고품질 직업 SVG 일러스트를 렌더링합니다.
 * 이미지 미생성 시 Edge SSR 및 브라우저에서 폴백으로 즉시 표시됩니다.
 */
export function renderJobArtworkSvg(concept) {
  if (!concept) concept = MASTER_JOBS[0];

  const isGood = concept.zone === 'GOOD';
  const isReal = concept.realityType === 'REAL';
  const paddedLevel = String(concept.level).padStart(5, '0');

  // Themes
  const bgGradStart = isGood ? '#0b132b' : '#1a0808';
  const bgGradEnd = isGood ? '#1c2541' : '#2b0b0b';
  const accentColor = isGood ? '#10b981' : '#ef4444';
  const accentSecondary = isGood ? '#f59e0b' : '#f97316';
  const glowColor = isGood ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
  const badgeBg = isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  const badgeBorder = isGood ? '#10b981' : '#ef4444';

  const zoneBadgeText = isGood ? '🌟 대박 직업 (GOOD)' : '💀 폭망 직업 (BAD)';
  const realityBadgeText = isReal ? '🏛️ 짝수 · 실제 역사/실존 직업' : '🦄 홀수 · 허구 상상/SF/판타지';
  const tierBadgeText = `Tier ${String(concept.tier).padStart(2, '0')}: ${concept.tierName}`;

  // Wrap title for clean display
  const titleLines = wrapText(concept.title, 20);
  const dutyLines = wrapText(concept.specialDuty, 32).slice(0, 3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" style="background:#090d16; font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif;">
  <defs>
    <!-- Background Gradients -->
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
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${accentSecondary}" stop-opacity="0.2"/>
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>

    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>

  <!-- Cybernetic Grid Patterns -->
  <g opacity="0.07" stroke="#ffffff" stroke-width="1">
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

  <!-- Main Card Container -->
  <rect x="36" y="36" width="952" height="952" rx="36" fill="rgba(15, 23, 42, 0.75)" stroke="url(#cardBorder)" stroke-width="3" filter="url(#softShadow)"/>

  <!-- Center Ambient Radial Glow -->
  <circle cx="512" cy="380" r="320" fill="url(#centerGlow)"/>

  <!-- Header Section -->
  <g transform="translate(64, 76)">
    <!-- Level Badge -->
    <rect x="0" y="0" width="220" height="48" rx="24" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="2"/>
    <text x="110" y="31" fill="#ffffff" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="1">LV. ${paddedLevel} / 01000</text>

    <!-- Zone Badge -->
    <rect x="236" y="0" width="200" height="48" rx="24" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="2"/>
    <text x="336" y="31" fill="${accentColor}" font-size="18" font-weight="800" text-anchor="middle">${xmlEscape(zoneBadgeText)}</text>

    <!-- Reality Badge -->
    <rect x="452" y="0" width="240" height="48" rx="24" fill="rgba(255, 255, 255, 0.08)" stroke="#64748b" stroke-width="1.5"/>
    <text x="572" y="31" fill="#e2e8f0" font-size="16" font-weight="700" text-anchor="middle">${xmlEscape(realityBadgeText)}</text>

    <!-- Tier Name -->
    <text x="896" y="32" fill="#94a3b8" font-size="16" font-weight="600" text-anchor="end">${xmlEscape(tierBadgeText)}</text>
  </g>

  <!-- Center Artwork Icon & Orbital Rings -->
  <g transform="translate(512, 380)">
    <!-- Outer Orbit Ring -->
    <circle cx="0" cy="0" r="190" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="10 14" opacity="0.4"/>
    <circle cx="0" cy="0" r="160" fill="none" stroke="#475569" stroke-width="1" opacity="0.6"/>

    <!-- Glowing Center Disc -->
    <circle cx="0" cy="0" r="130" fill="rgba(15, 23, 42, 0.9)" stroke="url(#auraGlow)" stroke-width="4" filter="url(#glowFilter)"/>

    <!-- Category Emoji -->
    <text x="0" y="42" font-size="110" text-anchor="middle">${concept.categoryEmoji || '💼'}</text>

    <!-- Category Label Pill Below Centerpiece -->
    <rect x="-140" y="150" width="280" height="38" rx="19" fill="rgba(0, 0, 0, 0.6)" stroke="${accentColor}" stroke-width="1.5"/>
    <text x="0" y="175" fill="#f8fafc" font-size="16" font-weight="700" text-anchor="middle">${xmlEscape(concept.categoryLabel)}</text>
  </g>

  <!-- Job Title Section -->
  <g transform="translate(512, 630)">
    ${titleLines.map((line, idx) => {
      const yOffset = (idx - (titleLines.length - 1) / 2) * 46;
      return `<text x="0" y="${yOffset}" fill="#ffffff" font-size="36" font-weight="900" text-anchor="middle" filter="url(#softShadow)" letter-spacing="-0.5">${xmlEscape(line)}</text>`;
    }).join('\n    ')}
  </g>

  <!-- Key Info Specs Grid -->
  <g transform="translate(76, 730)">
    <!-- Era Box -->
    <rect x="0" y="0" width="420" height="64" rx="16" fill="rgba(30, 41, 59, 0.65)" stroke="#334155" stroke-width="1.5"/>
    <text x="24" y="26" fill="#94a3b8" font-size="13" font-weight="700">📅 언제 하던 직업인가 (ERA)</text>
    <text x="24" y="50" fill="#f1f5f9" font-size="16" font-weight="700">${xmlEscape(concept.era || '기원전 2500년 ~ 서기 5000년')}</text>

    <!-- Estimated Salary Box -->
    <rect x="452" y="0" width="420" height="64" rx="16" fill="rgba(30, 41, 59, 0.65)" stroke="${badgeBorder}" stroke-width="1.5"/>
    <text x="476" y="26" fill="${accentColor}" font-size="13" font-weight="700">💰 추산 연봉 (ESTIMATED SALARY)</text>
    <text x="476" y="50" fill="#ffffff" font-size="16" font-weight="800">${xmlEscape(concept.estimatedSalary)}</text>
  </g>

  <!-- Special Duty Box -->
  <g transform="translate(76, 810)">
    <rect x="0" y="0" width="872" height="96" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" stroke-width="1"/>
    <text x="24" y="28" fill="${accentSecondary}" font-size="13" font-weight="800">⚡ 직업의 특별한 역할이나 할일 (SPECIAL DUTY)</text>
    ${dutyLines.map((line, idx) => {
      return `<text x="24" y="${52 + idx * 22}" fill="#cbd5e1" font-size="14" font-weight="500">${xmlEscape(line)}</text>`;
    }).join('\n    ')}
  </g>

  <!-- Footer Watermark & Origin Brand -->
  <g transform="translate(512, 946)">
    <line x1="-380" y1="-16" x2="380" y2="-16" stroke="#334155" stroke-width="1" opacity="0.6"/>
    <text x="0" y="6" fill="#64748b" font-size="14" font-weight="600" text-anchor="middle" letter-spacing="1">나에게 어울리는 직업 · job.tellmyname.app · 0~1000 Level Master Taxonomy</text>
  </g>
</svg>`;
}

export const renderHouseArtworkSvg = renderJobArtworkSvg;

/**
 * 1024x1024 SVG Data URI를 반환합니다.
 */
export function getJobArtworkSvgDataUri(concept) {
  const svgString = renderJobArtworkSvg(concept);
  const base64 = Buffer.from(svgString, 'utf8').toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

export const getHouseArtworkSvgDataUri = getJobArtworkSvgDataUri;
