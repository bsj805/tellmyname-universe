// src/lib/gemini_client.js — Shared Gemini 3.8 Flash Multimodal & Artwork Client for MyJob (0~1000 Occupations)
// Supports live Gemini 3.8 Flash API when GEMINI_API_KEY is present, plus deterministic high-detail SVG/WebP artwork & appraisal synthesis.

export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const TIER_PALETTES = [
  ['#1a0505', '#450a0a', '#dc2626', '#fca5a5'], // Tier 1: Extreme 3D Slum Labor
  ['#1c1917', '#44403c', '#d97706', '#fde68a'], // Tier 2: Extinct Historical Hardship
  ['#1e1b4b', '#312e81', '#818cf8', '#e0e7ff'], // Tier 3: Room NEET / Slacker Survival
  ['#042f2e', '#115e59', '#2dd4bf', '#ccfbf1'], // Tier 4: Bizarre Part-time Oddity
  ['#090d16', '#1e293b', '#64748b', '#e2e8f0'], // Tier 5: Extreme Reporting & Hazard Duty
  ['#27272a', '#3f3f46', '#f59e0b', '#fef3c7'], // Tier 6: Absurd Historical & Trade Service
  ['#0c4a6e', '#0369a1', '#38bdf8', '#e0f2fe'], // Tier 7: Weird Street Market Vendor
  ['#3b0764', '#6b21a8', '#c084fc', '#f3e8ff'], // Tier 8: Humorous Fiction Underdog
  ['#431407', '#9a3412', '#fb923c', '#ffedd5'], // Tier 9: Strange Tourism & Mascot Agent
  ['#450a0a', '#7f1d1d', '#facc15', '#fef9c3'], // Tier 10: Threshold of Survival & Disaster
  ['#064e3b', '#047857', '#34d399', '#d1fae5'], // Tier 11: Dream Job Entry & Eco-Caretaker
  ['#1e3a8a', '#1d4ed8', '#60a5fa', '#dbeafe'], // Tier 12: Elite Whitehat & Crypto Explorer
  ['#31102f', '#701a75', '#e879f9', '#fae8ff'], // Tier 13: Luxury VIP Specialist & Curator
  ['#422006', '#854d0e', '#facc15', '#fef08a'], // Tier 14: Global Executive & Media Titan
  ['#083344', '#0e7490', '#22d3ee', '#cffafe'], // Tier 15: Deep Ocean & Megastructure Leader
  ['#0f172a', '#334155', '#38bdf8', '#f0f9ff'], // Tier 16: Earth Megaproject Commander
  ['#090d16', '#1e1b4b', '#a78bfa', '#ede9fe'], // Tier 17: Space Colonization Director
  ['#451a03', '#92400e', '#fbbf24', '#fef3c7'], // Tier 18: Intergalactic Diplomat & Trader
  ['#2e1065', '#581c87', '#f472b6', '#fce7f3'], // Tier 19: Dyson Sphere Cosmic Architect
  ['#020617', '#1e1b4b', '#fde047', '#ffffff']  // Tier 20: Multiverse Deity & Timeline Weaver
];

const CATEGORY_VECTORS = {
  // 1. Extreme 3D Labor (Pickaxe, shovel, hazardous sparks)
  EXTREME_3D_LABOR: '<path d="M300 720 L480 540 M480 540 L700 320" stroke="currentColor" stroke-width="20" stroke-linecap="round"/><path d="M640 260 L760 380 M680 220 L800 340 M620 300 Q760 160 840 240 Q920 320 780 460 Z" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="340" cy="680" r="45" fill="none" stroke="currentColor" stroke-width="16"/><path d="M260 480 L380 480 M240 540 L340 540" stroke="currentColor" stroke-width="14" stroke-dasharray="10 10"/>',

  // 2. Extinct Historical Jobs (Hourglass, ancient parchment, torch)
  PAST_EXTINCT_JOB: '<polygon points="360,260 664,260 560,512 664,764 360,764 464,512" fill="none" stroke="currentColor" stroke-width="18"/><line x1="320" y1="260" x2="704" y2="260" stroke="currentColor" stroke-width="22" stroke-linecap="round"/><line x1="320" y1="764" x2="704" y2="764" stroke="currentColor" stroke-width="22" stroke-linecap="round"/><circle cx="512" cy="620" r="32" fill="currentColor"/><circle cx="512" cy="400" r="20" fill="currentColor"/>',

  // 3. Room NEET / Slacker (Couch/bed, instant ramen noodles bowl, wifi signal)
  ROOM_NEET_SURVIVAL: '<rect x="220" y="560" width="584" height="220" rx="28" fill="none" stroke="currentColor" stroke-width="18"/><path d="M300 560 L300 420 A90,90 0 0,1 480 420 L480 560" fill="none" stroke="currentColor" stroke-width="16"/><ellipse cx="640" cy="460" rx="90" ry="40" fill="none" stroke="currentColor" stroke-width="14"/><path d="M570 430 Q600 350 630 430 Q660 350 690 430" fill="none" stroke="currentColor" stroke-width="10"/><line x1="260" y1="780" x2="260" y2="840" stroke="currentColor" stroke-width="18" stroke-linecap="round"/><line x1="764" y1="780" x2="764" y2="840" stroke="currentColor" stroke-width="18" stroke-linecap="round"/>',

  // 4. Bizarre Part-time (Mascot bear/panda costume head, clock/stopwatch)
  BIZARRE_PARTTIME: '<circle cx="512" cy="530" r="210" fill="none" stroke="currentColor" stroke-width="18"/><circle cx="360" cy="330" r="75" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="664" cy="330" r="75" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="430" cy="500" r="28" fill="currentColor"/><circle cx="594" cy="500" r="28" fill="currentColor"/><ellipse cx="512" cy="590" rx="42" ry="26" fill="currentColor"/><path d="M440 650 Q512 710 584 650" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>',

  // 5. Absurd Professional Real (Microphone, camera lens, press badge)
  ABSURD_PRO_REAL: '<rect x="420" y="240" width="184" height="300" rx="92" fill="none" stroke="currentColor" stroke-width="18"/><path d="M340 440 C340 610 684 610 684 440" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round"/><line x1="512" y1="610" x2="512" y2="780" stroke="currentColor" stroke-width="20"/><line x1="380" y1="780" x2="644" y2="780" stroke="currentColor" stroke-width="22" stroke-linecap="round"/><line x1="420" y1="360" x2="604" y2="360" stroke="currentColor" stroke-width="14"/>',

  // 6. Fiction / Movie / Fantasy (Wizard hat, magic wand stars, crystal orb)
  FICTION_NOVEL_MOVIE: '<polygon points="512,220 330,680 694,680" fill="none" stroke="currentColor" stroke-width="18"/><ellipse cx="512" cy="680" rx="260" ry="70" fill="none" stroke="currentColor" stroke-width="18"/><circle cx="512" cy="480" r="45" fill="currentColor"/><polygon points="512,300 528,345 575,345 537,372 552,416 512,388 472,416 487,372 449,345 496,345" fill="none" stroke="currentColor" stroke-width="8"/>',

  // 7. Tourism & Merchant (Carnival ferris wheel, festival tent, cart)
  TOURISM_EVENT_MERCHANT: '<circle cx="512" cy="480" r="220" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="512" cy="480" r="40" fill="currentColor"/><line x1="512" y1="260" x2="512" y2="700" stroke="currentColor" stroke-width="14"/><line x1="292" y1="480" x2="732" y2="480" stroke="currentColor" stroke-width="14"/><line x1="356" y1="324" x2="668" y2="636" stroke="currentColor" stroke-width="14"/><line x1="356" y1="636" x2="668" y2="324" stroke="currentColor" stroke-width="14"/><polygon points="410,810 512,520 614,810" fill="none" stroke="currentColor" stroke-width="18"/>',

  // 8. Crypto Hacker Tycoon (Matrix terminal, code brackets, glowing chip)
  CRYPTO_HACKER_TYCOON: '<rect x="250" y="270" width="524" height="380" rx="24" fill="none" stroke="currentColor" stroke-width="18"/><line x1="250" y1="570" x2="774" y2="570" stroke="currentColor" stroke-width="14"/><polygon points="512,650 430,790 594,790" fill="none" stroke="currentColor" stroke-width="18"/><polyline points="340,380 400,430 340,480" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><line x1="440" y1="480" x2="530" y2="480" stroke="currentColor" stroke-width="16" stroke-linecap="round"/>',

  // 9. Global VIP Executive (Diamond, penthouse skyline, royal seal)
  GLOBAL_VIP_EXECUTIVE: '<polygon points="512,250 780,430 512,790 244,430" fill="none" stroke="currentColor" stroke-width="18"/><polyline points="330,430 512,250 694,430" fill="none" stroke="currentColor" stroke-width="14"/><polyline points="244,430 512,490 780,430" fill="none" stroke="currentColor" stroke-width="14"/><line x1="512" y1="490" x2="512" y2="790" stroke="currentColor" stroke-width="16"/>',

  // 10. Planetary Terraform (Terraforming dome, globe grid, geo crane)
  PLANETARY_TERRAFORM: '<circle cx="512" cy="512" r="230" fill="none" stroke="currentColor" stroke-width="18"/><ellipse cx="512" cy="512" rx="230" ry="90" fill="none" stroke="currentColor" stroke-width="14"/><ellipse cx="512" cy="512" rx="90" ry="230" fill="none" stroke="currentColor" stroke-width="14"/><path d="M310 740 Q512 880 714 740" fill="none" stroke="currentColor" stroke-width="16" stroke-dasharray="14 10"/>',

  // 11. Space Galactic Corp (Orbital starship, thrusters, cosmic antenna)
  SPACE_GALACTIC_CORP: '<path d="M512,210 C630,360 650,560 620,720 L404,720 C374,560 394,360 512,210 Z" fill="none" stroke="currentColor" stroke-width="18"/><polygon points="404,580 260,740 404,720" fill="none" stroke="currentColor" stroke-width="16"/><polygon points="620,580 764,740 620,720" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="512" cy="440" r="50" fill="none" stroke="currentColor" stroke-width="16"/>',

  // 12. Multiverse Deity Job (Cosmic ring singularity, omnipotent eye, timeline nexus)
  MULTIVERSE_DEITY_JOB: '<circle cx="512" cy="512" r="240" fill="none" stroke="currentColor" stroke-width="14"/><ellipse cx="512" cy="512" rx="290" ry="95" transform="rotate(-25 512 512)" fill="none" stroke="currentColor" stroke-width="14"/><ellipse cx="512" cy="512" rx="290" ry="95" transform="rotate(35 512 512)" fill="none" stroke="currentColor" stroke-width="14"/><circle cx="512" cy="512" r="55" fill="currentColor"/>'
};

// Aliases for taxonomy category IDs
CATEGORY_VECTORS.BACKSU_NEETS = CATEGORY_VECTORS.ROOM_NEET_SURVIVAL;
CATEGORY_VECTORS.HISTORICAL_EXTREME = CATEGORY_VECTORS.PAST_EXTINCT_JOB;
CATEGORY_VECTORS.EXTREME_JOURNALISM = CATEGORY_VECTORS.ABSURD_PRO_REAL;
CATEGORY_VECTORS.WEIRD_BIZ_TRADE = CATEGORY_VECTORS.BIZARRE_PARTTIME;
CATEGORY_VECTORS.TOURISM_EVENT = CATEGORY_VECTORS.TOURISM_EVENT_MERCHANT;
CATEGORY_VECTORS.BIZARRE_REAL_JOB = CATEGORY_VECTORS.EXTREME_3D_LABOR;
CATEGORY_VECTORS.FANTASY_MEDIA_JOB = CATEGORY_VECTORS.FICTION_NOVEL_MOVIE;
CATEGORY_VECTORS.HACKER_UNDERGROUND = CATEGORY_VECTORS.CRYPTO_HACKER_TYCOON;
CATEGORY_VECTORS.TYCOON_LUXURY = CATEGORY_VECTORS.GLOBAL_VIP_EXECUTIVE;
CATEGORY_VECTORS.EARTH_MEGAPROJECT = CATEGORY_VECTORS.PLANETARY_TERRAFORM;
CATEGORY_VECTORS.SPACE_SCIFI_JOB = CATEGORY_VECTORS.SPACE_GALACTIC_CORP;
CATEGORY_VECTORS.MULTIVERSE_GOD = CATEGORY_VECTORS.MULTIVERSE_DEITY_JOB;
CATEGORY_VECTORS.DEFAULT = CATEGORY_VECTORS.EXTREME_3D_LABOR;

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates a high-detail SVG artwork string for a given occupation concept object (0~1000)
 * @param {object} concept
 * @returns {string} SVG artwork markup
 */
export function renderJobArtworkSvg(concept) {
  const lv = Math.max(0, Math.min(1000, Math.floor(Number(concept?.level) || 0)));
  const tierNum = Math.max(1, Math.min(20, Math.floor(Number(concept?.tier) || Math.min(20, Math.floor(lv / 50) + 1))));
  const tierIdx = tierNum - 1;
  const [bgStart, bgEnd, accent, textLight] = TIER_PALETTES[tierIdx] || TIER_PALETTES[0];

  const catKey = concept?.category || 'EXTREME_3D_LABOR';
  const vector = CATEGORY_VECTORS[catKey] || CATEGORY_VECTORS.DEFAULT;
  const isReal = lv % 2 === 0;
  const isGood = lv >= 500;
  const paddedLv = String(lv).padStart(5, '0');

  // Deterministic star/particle coordinates from level
  let stars = '';
  for (let i = 0; i < 18; i++) {
    const cx = ((lv * 137 + i * 293) % 920) + 52;
    const cy = ((lv * 251 + i * 179) % 620) + 80;
    const r = ((lv + i) % 4) + 2;
    const op = (((lv + i * 3) % 6) + 3) / 10;
    stars += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="${op}"/>`;
  }

  const titleText = String(concept?.title || `Lv.${lv} 직업`);
  const line1 = titleText.slice(0, 20);
  const line2 = titleText.slice(20, 42);

  const salaryStr = concept?.estimatedSalary || concept?.estimatedValue || '측정 불가';
  const catLabel = concept?.categoryLabel || catKey;

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
  <!-- Top Badges -->
  <rect x="84" y="84" width="260" height="58" rx="29" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
  <text x="214" y="122" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="26" font-weight="800">LV. ${paddedLv} / 1000</text>
  <rect x="630" y="84" width="310" height="58" rx="29" fill="#000000" fill-opacity="0.45" stroke="${textLight}" stroke-width="2" stroke-opacity="0.5"/>
  <text x="785" y="122" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="24" font-weight="700">${isReal ? '짝수 · 실제 직업·일거리' : '홀수 · 허구·상상 속 직업'}</text>
  <!-- Center Illustration -->
  <g color="${accent}" transform="translate(0, -30)">
    ${vector}
  </g>
  <!-- Bottom Appraisal Plate -->
  <rect x="74" y="740" width="876" height="200" rx="28" fill="#000000" fill-opacity="0.62" stroke="${accent}" stroke-width="2" stroke-opacity="0.6"/>
  <text x="512" y="790" text-anchor="middle" fill="${accent}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="24" font-weight="800">[${isGood ? '대박 직업' : '폭망 직업'} · Tier ${String(tierNum).padStart(2, '0')}] ${escapeXml(catLabel)}</text>
  <text x="512" y="842" text-anchor="middle" fill="#ffffff" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="32" font-weight="800">${escapeXml(line1)}</text>
  ${line2 ? `<text x="512" y="886" text-anchor="middle" fill="#ffffff" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="30" font-weight="700">${escapeXml(line2)}</text>` : ''}
  <text x="512" y="924" text-anchor="middle" fill="${textLight}" font-family="'Pretendard','Noto Sans KR',sans-serif" font-size="21" font-weight="600">추산 연봉: ${escapeXml(String(salaryStr).slice(0, 38))} | job.tellmyname.app</text>
</svg>`;
}

// Backward-compatible alias
export const renderHouseArtworkSvg = renderJobArtworkSvg;

/**
 * Calls Gemini 3.8 Flash API if GEMINI_API_KEY is available, or returns enriched appraisal
 */
export async function generateGemini38Appraisal(concept, apiKey = process.env.GEMINI_API_KEY) {
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 기상천외하고 유쾌한 다중우주 인사팀장 및 직업 분석가입니다.
단계: ${concept.level} (${concept.realityType === 'REAL' ? '실제 직업·일거리' : '허구·상상 직업'})
직업명: ${concept.title}
다음 JSON 형식으로만 응답하세요:
{"era":"언제 하던 직업인지","estimatedSalary":"추산되는 연봉","specialDuty":"직업의 특별한 역할·할일(황당하고 웃기게)","aiVerdict":"한 줄 AI 인사팀장 총평"}`
            }]
          }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            ...concept,
            ...parsed,
            builtYear: parsed.era || concept.builtYear,
            estimatedValue: parsed.estimatedSalary || concept.estimatedValue,
            specialFeature: parsed.specialDuty || concept.specialFeature,
            model: GEMINI_MODEL_ID
          };
        }
      }
    } catch {
      // Fallback to deterministic synthesis below
    }
  }
  return {
    ...concept,
    era: concept.era || concept.builtYear || '동시대 및 다중우주',
    builtYear: concept.builtYear || concept.era || '동시대 및 다중우주',
    estimatedSalary: concept.estimatedSalary || concept.estimatedValue || '측정 불가',
    estimatedValue: concept.estimatedValue || concept.estimatedSalary || '측정 불가',
    specialDuty: concept.specialDuty || concept.specialFeature || '상상을 초월하는 특별 임무 수행',
    specialFeature: concept.specialFeature || concept.specialDuty || '상상을 초월하는 특별 임무 수행',
    model: GEMINI_MODEL_ID,
    generatedAt: '2026-11-01T00:00:00.000Z'
  };
}
