import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// -------------------------------------------------------------
// Master Scene Generator: Lv. 2 Oymyakon Siberian Outhouse (-67°C)
// Resolution: 1024 x 1024
// Pure artwork, ZERO text, ZERO badges, ZERO numbers
// -------------------------------------------------------------

function generateOymyakonSVG() {
  let seed = 98765;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const svg = [];
  svg.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">`);

  // -----------------------------------------------------------
  // 1. DEFS & FILTERS & GRADIENTS
  // -----------------------------------------------------------
  svg.push(`<defs>`);

  // Polar Twilight Sky Gradient
  svg.push(`
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#02040b"/>
      <stop offset="20%" stop-color="#050d22"/>
      <stop offset="45%" stop-color="#0a1a36"/>
      <stop offset="70%" stop-color="#102547"/>
      <stop offset="88%" stop-color="#18365b"/>
      <stop offset="100%" stop-color="#224770"/>
    </linearGradient>

    <!-- Aurora Borealis Gradients -->
    <linearGradient id="auroraEmerald" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0"/>
      <stop offset="25%" stop-color="#10b981" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#34d399" stop-opacity="0.65"/>
      <stop offset="85%" stop-color="#38bdf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="auroraViolet" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0"/>
      <stop offset="40%" stop-color="#a855f7" stop-opacity="0.5"/>
      <stop offset="75%" stop-color="#ec4899" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="auroraCyan" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0"/>
      <stop offset="35%" stop-color="#06b6d4" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#2dd4bf" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>

    <!-- Distant Mountain Gradients -->
    <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a3a52"/>
      <stop offset="50%" stop-color="#18273c"/>
      <stop offset="100%" stop-color="#0a1322"/>
    </linearGradient>

    <linearGradient id="mountainSnowFar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>

    <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c2a3f"/>
      <stop offset="60%" stop-color="#111c2e"/>
      <stop offset="100%" stop-color="#09101b"/>
    </linearGradient>

    <!-- Snow Terrain Gradients -->
    <linearGradient id="snowSlopeFar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4b607c"/>
      <stop offset="50%" stop-color="#2e4056"/>
      <stop offset="100%" stop-color="#192638"/>
    </linearGradient>

    <linearGradient id="snowSlopeMid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7c95b5"/>
      <stop offset="35%" stop-color="#516884"/>
      <stop offset="75%" stop-color="#30445d"/>
      <stop offset="100%" stop-color="#1a293d"/>
    </linearGradient>

    <linearGradient id="snowSlopeFront" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="25%" stop-color="#94a3b8"/>
      <stop offset="60%" stop-color="#475569"/>
      <stop offset="85%" stop-color="#28374c"/>
      <stop offset="100%" stop-color="#141f2e"/>
    </linearGradient>

    <linearGradient id="snowDriftCrest" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0.2"/>
    </linearGradient>

    <!-- Weathered Outhouse Timber -->
    <linearGradient id="woodPlankSide" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a120c"/>
      <stop offset="50%" stop-color="#2d1f15"/>
      <stop offset="100%" stop-color="#1a120b"/>
    </linearGradient>

    <linearGradient id="woodPlankFrontDark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a1c14"/>
      <stop offset="45%" stop-color="#402d20"/>
      <stop offset="85%" stop-color="#342419"/>
      <stop offset="100%" stop-color="#20150e"/>
    </linearGradient>

    <linearGradient id="woodPlankFrontLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#312218"/>
      <stop offset="50%" stop-color="#4e3828"/>
      <stop offset="85%" stop-color="#3f2d20"/>
      <stop offset="100%" stop-color="#261911"/>
    </linearGradient>

    <linearGradient id="doorPlankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2f2017"/>
      <stop offset="25%" stop-color="#483425"/>
      <stop offset="70%" stop-color="#3a291d"/>
      <stop offset="100%" stop-color="#241810"/>
    </linearGradient>

    <!-- Rusted Iron Hardware -->
    <linearGradient id="ironHingeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="25%" stop-color="#1e293b"/>
      <stop offset="65%" stop-color="#0f172a"/>
      <stop offset="85%" stop-color="#9a3412"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>

    <!-- Roof Puffy Snow Cap -->
    <linearGradient id="roofSnowPillow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#f8fafc"/>
      <stop offset="70%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>

    <!-- Crystal Icicle Gradients -->
    <linearGradient id="icicleFacetLit" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#e0f2fe" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.7"/>
    </linearGradient>

    <linearGradient id="icicleFacetShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.7"/>
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.5"/>
    </linearGradient>

    <linearGradient id="icicleWarmLit" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#fef08a" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.6"/>
    </linearGradient>

    <!-- Warm Glowing Tungsten Light Interior -->
    <radialGradient id="warmLightSource" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#fef08a"/>
      <stop offset="55%" stop-color="#f59e0b"/>
      <stop offset="85%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </radialGradient>

    <!-- Light Cone Spilling onto Snow -->
    <radialGradient id="groundLightFan" cx="0%" cy="20%" r="85%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#f59e0b" stop-opacity="0.7"/>
      <stop offset="55%" stop-color="#d97706" stop-opacity="0.35"/>
      <stop offset="80%" stop-color="#b45309" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#78350f" stop-opacity="0"/>
    </radialGradient>

    <!-- Volumetric Light Halo from Moon Cutout -->
    <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#fef08a" stop-opacity="0.75"/>
      <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </radialGradient>

    <!-- Frozen Steam Gradient -->
    <linearGradient id="steamIceGrad" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#e0f2fe" stop-opacity="0.85"/>
      <stop offset="80%" stop-color="#7dd3fc" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.5"/>
    </linearGradient>

    <!-- Footprint Shadow Gradient -->
    <linearGradient id="bootShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1b" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#142033" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#24364e" stop-opacity="0.3"/>
    </linearGradient>

    <!-- Filters for Atmosphere & Glow -->
    <filter id="auroraBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <filter id="auroraGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur1"/>
      <feGaussianBlur stdDeviation="24" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="warmBloom" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`);

  // -----------------------------------------------------------
  // 2. SKY & POLAR TWILIGHT HORIZON
  // -----------------------------------------------------------
  svg.push(`<!-- Polar Twilight Sky -->`);
  svg.push(`<rect width="1024" height="1024" fill="url(#skyGrad)"/>`);

  // -----------------------------------------------------------
  // 3. STARS & POLAR CELESTIAL SPARKLES
  // -----------------------------------------------------------
  svg.push(`<!-- Glittering Subzero Stars -->`);
  svg.push(`<g opacity="0.9">`);
  for (let i = 0; i < 280; i++) {
    const sx = Math.floor(random() * 1024);
    const sy = Math.floor(random() * 450);
    const sr = (0.5 + random() * 1.5).toFixed(1);
    const op = (0.25 + random() * 0.75).toFixed(2);
    const col = random() > 0.75 ? '#fed7aa' : (random() > 0.35 ? '#ffffff' : '#bae6fd');
    svg.push(`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${col}" opacity="${op}"/>`);
  }

  // 7 Prominent sparkling 4-point cross stars
  const crossStars = [
    { x: 140, y: 80, s: 6 },
    { x: 380, y: 55, s: 7 },
    { x: 670, y: 70, s: 5 },
    { x: 820, y: 90, s: 6 },
    { x: 930, y: 140, s: 5 },
    { x: 260, y: 160, s: 4.5 },
    { x: 520, y: 110, s: 4 }
  ];
  crossStars.forEach(cs => {
    svg.push(`
      <g transform="translate(${cs.x}, ${cs.y})" opacity="0.95">
        <circle cx="0" cy="0" r="${cs.s * 2}" fill="#93c5fd" opacity="0.35" filter="url(#auroraBlur)"/>
        <path d="M 0 -${cs.s * 2.5} Q 0 0 ${cs.s * 2.5} 0 Q 0 0 0 ${cs.s * 2.5} Q 0 0 -${cs.s * 2.5} 0 Q 0 0 0 -${cs.s * 2.5} Z" fill="#ffffff"/>
        <circle cx="0" cy="0" r="${(cs.s * 0.4).toFixed(1)}" fill="#ffffff"/>
      </g>
    `);
  });
  svg.push(`</g>`);

  // -----------------------------------------------------------
  // 4. AURORA BOREALIS (NORTHERN LIGHTS RIBBONS)
  // -----------------------------------------------------------
  svg.push(`<!-- Aurora Borealis Ribbons -->`);
  svg.push(`
    <g filter="url(#auroraGlow)">
      <!-- Main Undulating Emerald Ribbon -->
      <path d="M -50 200 
               C 160 110, 320 230, 540 140 
               S 840 210, 1070 130 
               L 1070 260 
               C 850 310, 640 190, 420 290 
               S 140 220, -50 280 Z" 
            fill="url(#auroraEmerald)"/>

      <!-- High-Altitude Violet-Magenta Fringe -->
      <path d="M -40 140 
               C 180 70, 430 160, 690 85 
               S 970 135, 1060 105 
               L 1060 190 
               C 890 210, 640 135, 400 215 
               S 100 165, -40 205 Z" 
            fill="url(#auroraViolet)"/>

      <!-- Lower Cyan Wave Ribbon -->
      <path d="M 40 170 
               C 240 250, 460 115, 710 195 
               S 970 145, 1080 185 
               L 1080 255 
               C 920 230, 670 270, 450 180 
               S 190 310, 40 230 Z" 
            fill="url(#auroraCyan)"/>
    </g>

    <!-- Vertical Curtain Striations -->
    <g opacity="0.32" filter="url(#auroraBlur)">
  `);
  for (let i = 0; i < 32; i++) {
    const rx = 40 + i * 31 + (random() * 10);
    const ry1 = 75 + Math.sin(i * 0.35) * 35;
    const ry2 = ry1 + 95 + random() * 50;
    const rw = (2 + random() * 4).toFixed(1);
    svg.push(`<line x1="${rx}" y1="${ry1.toFixed(0)}" x2="${rx + (random() * 16 - 8)}" y2="${ry2.toFixed(0)}" stroke="#6ee7b7" stroke-width="${rw}" stroke-linecap="round"/>`);
  }
  svg.push(`</g>`);

  // -----------------------------------------------------------
  // 5. DISTANT SIBERIAN MOUNTAIN RANGES
  // -----------------------------------------------------------
  svg.push(`<!-- Distant Siberian Mountains -->`);

  // Deep Background Jagged Mountain Ridge
  svg.push(`
    <path d="M -20 440 
             L 35 380 L 105 425 L 185 345 L 255 410 L 325 360 L 415 420 
             L 505 325 L 585 390 L 665 335 L 755 410 L 845 330 L 925 385 
             L 995 340 L 1050 375 L 1050 520 L -20 520 Z" 
          fill="url(#mountainFar)"/>

    <!-- Lit Snow Facets on Far Peaks -->
    <polygon points="185,345 220,380 255,410 235,430 185,345" fill="url(#mountainSnowFar)" opacity="0.65"/>
    <polygon points="505,325 545,365 585,390 555,420 505,325" fill="url(#mountainSnowFar)" opacity="0.8"/>
    <polygon points="665,335 705,375 755,410 725,435 665,335" fill="url(#mountainSnowFar)" opacity="0.7"/>
    <polygon points="845,330 880,365 925,385 895,415 845,330" fill="url(#mountainSnowFar)" opacity="0.75"/>
    <polygon points="35,380 70,405 105,425 85,440 35,380" fill="url(#mountainSnowFar)" opacity="0.6"/>
  `);

  // Closer Mountain Ridge with Deep Snow Couloirs
  svg.push(`
    <path d="M -20 475 
             L 65 405 L 115 440 L 205 375 L 285 435 L 375 385 L 465 445 
             L 565 365 L 635 430 L 725 375 L 815 435 L 905 370 L 975 425 L 1050 390 
             L 1050 560 L -20 560 Z" 
          fill="url(#mountainMid)"/>

    <polygon points="205,375 175,410 115,440 155,455 205,375" fill="#e0f2fe" opacity="0.8"/>
    <polygon points="205,375 245,415 285,435 260,450 205,375" fill="#93c5fd" opacity="0.45"/>
    <polygon points="565,365 525,405 465,445 505,460 565,365" fill="#e0f2fe" opacity="0.85"/>
    <polygon points="565,365 605,405 635,430 610,450 565,365" fill="#64748b" opacity="0.5"/>
    <polygon points="725,375 685,410 635,430 675,450 725,375" fill="#e0f2fe" opacity="0.75"/>
    <polygon points="905,370 865,405 815,435 855,455 905,370" fill="#e0f2fe" opacity="0.8"/>
  `);

  // -----------------------------------------------------------
  // 6. FROZEN TAIGA SPRUCE FORESTS (침엽수림)
  // -----------------------------------------------------------
  svg.push(`<!-- Taiga Ridge Silhouette -->`);
  svg.push(`<path d="M -10 500 `);
  for (let x = 0; x <= 1040; x += 16) {
    const treeH = 14 + Math.sin(x * 0.06) * 7 + (random() * 10);
    svg.push(`L ${x - 4} 500 L ${x} ${(500 - treeH).toFixed(0)} L ${x + 5} 500 `);
  }
  svg.push(`L 1040 520 L -10 520 Z" fill="#091018"/>`);

  function renderSpruce(baseX, baseY, scale, bend = 12) {
    let t = `<g transform="translate(${baseX}, ${baseY}) scale(${scale})">`;
    t += `<path d="M -3 0 L ${bend * 0.5} -140 L ${(bend * 0.5) + 3} -140 L 4 0 Z" fill="#15100c"/>`;
    
    const tiers = [
      { y: -30, w: 46, h: 22, sH: 14, b: bend * 0.3 },
      { y: -60, w: 38, h: 20, sH: 13, b: bend * 0.5 },
      { y: -88, w: 30, h: 18, sH: 11, b: bend * 0.7 },
      { y: -112, w: 22, h: 16, sH: 9, b: bend * 0.85 },
      { y: -132, w: 14, h: 14, sH: 8, b: bend }
    ];

    tiers.forEach(tr => {
      t += `<path d="M ${-tr.w + tr.b} ${tr.y} Q ${tr.b} ${tr.y - tr.h * 0.6} ${tr.w + tr.b + 6} ${tr.y + 4} Q ${tr.b + 2} ${tr.y + tr.h * 0.7} ${-tr.w + tr.b} ${tr.y} Z" fill="#0c1d17"/>`;
      t += `<path d="M ${-tr.w + tr.b - 2} ${tr.y - 2} C ${-tr.w * 0.5 + tr.b} ${tr.y - tr.sH - 3}, ${tr.w * 0.5 + tr.b} ${tr.y - tr.sH - 2}, ${tr.w + tr.b + 8} ${tr.y + 2} C ${tr.w * 0.4 + tr.b} ${tr.y + 2}, ${-tr.w * 0.4 + tr.b} ${tr.y + 3}, ${-tr.w + tr.b - 2} ${tr.y - 2} Z" fill="#f8fafc"/>`;
      t += `<path d="M ${-tr.w + tr.b} ${tr.y} Q ${tr.b} ${tr.y + 3} ${tr.w + tr.b + 6} ${tr.y + 2} Q ${tr.b} ${tr.y - 3} ${-tr.w + tr.b} ${tr.y} Z" fill="#94a3b8" opacity="0.65"/>`;
    });

    t += `<path d="M ${bend - 2} -140 Q ${bend + 5} -158 ${bend + 10} -162 Q ${bend + 3} -145 ${bend + 3} -140 Z" fill="#e2e8f0"/>`;
    t += `</g>`;
    return t;
  }

  svg.push(`<!-- Midground Taiga Trees (Left side) -->`);
  svg.push(renderSpruce(60, 535, 0.75, 10));
  svg.push(renderSpruce(115, 550, 0.9, 14));
  svg.push(renderSpruce(185, 540, 0.72, 12));
  svg.push(renderSpruce(245, 565, 0.85, 15));

  svg.push(`<!-- Midground Taiga Trees (Right side) -->`);
  svg.push(renderSpruce(770, 555, 0.8, 12));
  svg.push(renderSpruce(840, 540, 0.95, 16));
  svg.push(renderSpruce(915, 565, 0.85, 14));
  svg.push(renderSpruce(980, 545, 0.75, 10));

  // -----------------------------------------------------------
  // 7. ROLLING SIBERIAN SNOW DRIFTS (설원)
  // -----------------------------------------------------------
  svg.push(`<!-- Rolling Tundra Snowdrifts -->`);
  svg.push(`
    <path d="M -30 520 
             C 180 500, 360 550, 580 525 
             S 880 495, 1050 535 
             L 1050 640 L -30 640 Z" 
          fill="url(#snowSlopeFar)"/>
  `);

  svg.push(`
    <path d="M -30 585 
             C 160 555, 340 605, 540 570 
             S 820 535, 1050 610 
             L 1050 780 L -30 780 Z" 
          fill="url(#snowSlopeMid)"/>
    
    <path d="M -30 595 Q 220 555 520 580 T 1050 615" stroke="#cbd5e1" stroke-width="3" fill="none" opacity="0.6"/>
  `);

  svg.push(`
    <path d="M 280 685 
             C 410 625, 610 620, 780 665 
             C 690 725, 480 735, 280 685 Z" 
          fill="#3b4d66" opacity="0.5"/>
  `);

  // -----------------------------------------------------------
  // 8. WEATHERED SIBERIAN WOODEN FENCE (BURIED IN DRIFTS)
  // -----------------------------------------------------------
  svg.push(`<!-- Weathered Split-Rail Fence (Right side) -->`);
  svg.push(`<g opacity="0.92">`);
  const fencePosts = [
    { x: 745, y: 590, h: 62, tilt: 8 },
    { x: 815, y: 605, h: 68, tilt: -6 },
    { x: 890, y: 620, h: 66, tilt: 14 },
    { x: 965, y: 645, h: 58, tilt: -10 }
  ];

  svg.push(`
    <path d="M 743 610 L 817 622 L 893 638 L 967 660" stroke="#231710" stroke-width="7" stroke-linecap="round"/>
    <path d="M 745 630 L 815 642 L 855 655" stroke="#19100a" stroke-width="6" stroke-linecap="round"/>
    <path d="M 741 607 Q 780 610 817 619 Q 855 625 893 635" stroke="#f1f5f9" stroke-width="5" fill="none"/>
  `);

  fencePosts.forEach(fp => {
    svg.push(`
      <g transform="translate(${fp.x}, ${fp.y}) rotate(${fp.tilt})">
        <rect x="-5" y="-${fp.h}" width="10" height="${fp.h}" fill="#302017" rx="1"/>
        <line x1="-2" y1="-${fp.h}" x2="-2" y2="0" stroke="#453123" stroke-width="2"/>
        <ellipse cx="0" cy="-${fp.h}" rx="8" ry="5" fill="#f8fafc"/>
        <path d="M -7 -${fp.h} Q 0 -${fp.h + 6} 7 -${fp.h} Q 0 -${fp.h + 2} -7 -${fp.h} Z" fill="#ffffff"/>
        <polygon points="-2,-${fp.h + 2} 0,-${fp.h - 9} 2,-${fp.h + 2}" fill="#bae6fd" opacity="0.8"/>
      </g>
    `);
  });
  svg.push(`</g>`);

  // -----------------------------------------------------------
  // 9. THE CENTERPIECE: SIBERIAN WOODEN OUTHOUSE (-67°C)
  // -----------------------------------------------------------
  svg.push(`<!-- CENTERPIECE: Siberian Wooden Outhouse (오이미야콘 푸세식 화장실) -->`);
  svg.push(`<g id="outhouse" transform="translate(550, 555) rotate(-3.5)">`);

  // Foundation Logs
  svg.push(`
    <path d="M -130 185 L 120 185 L 110 205 L -140 205 Z" fill="#120d09"/>
    <path d="M -125 188 L 115 188" stroke="#3b2b1e" stroke-width="4"/>
  `);

  // Left Side Wall (Perspective Depth)
  svg.push(`
    <path d="M -120 -115 L -60 -155 L -60 185 L -120 185 Z" fill="url(#woodPlankSide)"/>
    
    <line x1="-105" y1="-125" x2="-105" y2="185" stroke="#0a0705" stroke-width="2.5"/>
    <line x1="-90" y1="-135" x2="-90" y2="185" stroke="#0a0705" stroke-width="2.5"/>
    <line x1="-75" y1="-145" x2="-75" y2="185" stroke="#0a0705" stroke-width="2.5"/>

    <path d="M -115 -80 Q -113 -40 -114 40 T -115 140" stroke="#352419" stroke-width="1.2" fill="none" opacity="0.6"/>
    <path d="M -98 -100 Q -101 -30 -97 60 T -99 160" stroke="#352419" stroke-width="1.2" fill="none" opacity="0.6"/>
    <path d="M -82 -110 Q -80 -20 -83 80 T -81 170" stroke="#352419" stroke-width="1.2" fill="none" opacity="0.6"/>

    <path d="M -120 -115 L -112 -110 L -114 185 L -120 185 Z" fill="#cbd5e1" opacity="0.45"/>
  `);

  // Front Wall Facade
  svg.push(`
    <path d="M -60 -155 L 110 -130 L 110 185 L -60 185 Z" fill="url(#woodPlankFrontDark)"/>
  `);

  // Vertical Planks
  const frontPlanks = [
    { x1: -60, x2: -36, grad: 'woodPlankFrontLight' },
    { x1: -36, x2: -12, grad: 'woodPlankFrontDark' },
    { x1: -12, x2: 14, grad: 'woodPlankFrontLight' },
    { x1: 14, x2: 38, grad: 'woodPlankFrontDark' },
    { x1: 38, x2: 62, grad: 'woodPlankFrontLight' },
    { x1: 62, x2: 86, grad: 'woodPlankFrontDark' },
    { x1: 86, x2: 110, grad: 'woodPlankFrontLight' }
  ];

  frontPlanks.forEach(p => {
    svg.push(`
      <rect x="${p.x1}" y="-155" width="${p.x2 - p.x1}" height="340" fill="url(#${p.grad})"/>
      <line x1="${p.x2}" y1="-155" x2="${p.x2}" y2="185" stroke="#100b07" stroke-width="2"/>
      <line x1="${p.x1 + 1}" y1="-155" x2="${p.x1 + 1}" y2="185" stroke="#543c2b" stroke-width="1.2" opacity="0.7"/>
    `);
  });

  // Radiant Warm Golden Light Leaking from Narrow Plank Gaps
  svg.push(`
    <line x1="-36" y1="-80" x2="-36" y2="150" stroke="#f59e0b" stroke-width="2.2" opacity="0.9" filter="url(#auroraBlur)"/>
    <line x1="-36" y1="-80" x2="-36" y2="150" stroke="#fffbeb" stroke-width="1.0" opacity="0.95"/>

    <line x1="38" y1="-110" x2="38" y2="160" stroke="#f59e0b" stroke-width="2.5" opacity="0.9" filter="url(#auroraBlur)"/>
    <line x1="38" y1="-110" x2="38" y2="160" stroke="#fffbeb" stroke-width="1.1" opacity="0.95"/>

    <line x1="86" y1="-60" x2="86" y2="140" stroke="#f59e0b" stroke-width="2.2" opacity="0.85" filter="url(#auroraBlur)"/>
    <line x1="86" y1="-60" x2="86" y2="140" stroke="#fffbeb" stroke-width="1.0" opacity="0.9"/>
  `);

  // Crooked Wooden Door
  svg.push(`
    <g id="outhouseDoor">
      <rect x="-34" y="-137" width="118" height="314" fill="#0b0805"/>

      <!-- Door Slab -->
      <polygon points="-32,-133 80,-115 80,175 -32,175" fill="url(#doorPlankGrad)"/>
      
      <line x1="-4" y1="-128" x2="-4" y2="175" stroke="#18100b" stroke-width="2"/>
      <line x1="24" y1="-124" x2="24" y2="175" stroke="#18100b" stroke-width="2"/>
      <line x1="52" y1="-120" x2="52" y2="175" stroke="#18100b" stroke-width="2"/>

      <!-- Diagonal cross-brace on lower half -->
      <path d="M -30 165 L 75 80 L 75 100 L -30 175 Z" fill="#281a12" opacity="0.9"/>
      <line x1="-30" y1="165" x2="75" y2="80" stroke="#422f21" stroke-width="1.5"/>

      <!-- Wood knots -->
      <ellipse cx="6" cy="40" rx="4" ry="7" fill="#100b07"/>
      <ellipse cx="6" cy="40" rx="2" ry="4" fill="#000000"/>
      <ellipse cx="62" cy="-40" rx="3" ry="5" fill="#100b07"/>

      <!-- Frost on door base -->
      <path d="M -32 150 Q 24 165 80 148 L 80 175 L -32 175 Z" fill="#cbd5e1" opacity="0.5"/>

      <!-- Heavy Hand-Forged Rusted Iron Strap Hinges (Positioned clear of the crescent moon!) -->
      <!-- Top Hinge: positioned near top corner at y = -125 to -115 -->
      <path d="M -38 -126 L 42 -118 L 42 -107 L -38 -114 Z" fill="url(#ironHingeGrad)"/>
      <circle cx="-35" cy="-120" r="4.5" fill="#0f172a"/>
      <rect x="-18" y="-121" width="5" height="5" fill="#475569"/>
      <rect x="8" y="-118" width="5" height="5" fill="#475569"/>
      <rect x="30" y="-115" width="5" height="5" fill="#475569"/>

      <!-- Bottom Hinge: at y = 95 to 110 -->
      <path d="M -38 95 L 42 105 L 42 118 L -38 112 Z" fill="url(#ironHingeGrad)"/>
      <circle cx="-35" cy="103" r="4.5" fill="#0f172a"/>
      <rect x="-18" y="102" width="5" height="5" fill="#475569"/>
      <rect x="8" y="105" width="5" height="5" fill="#475569"/>
      <rect x="30" y="108" width="5" height="5" fill="#475569"/>

      <!-- Wooden Slide Latch & Frozen Metal Padlock -->
      <rect x="62" y="5" width="22" height="10" fill="#241912" stroke="#0e0906" stroke-width="1.5"/>
      <circle cx="78" cy="18" r="5.5" fill="none" stroke="#64748b" stroke-width="2.5"/>
      <rect x="73" y="22" width="10" height="12" fill="#334155" rx="2"/>
      <path d="M 72 20 Q 78 24 84 20" stroke="#ffffff" stroke-width="2" fill="none"/>

      <!-- ======================================================= -->
      <!-- THE ICONIC CRESCENT MOON CUTOUT (초승달 환기창) -->
      <!-- Mathematically verified crisp crescent moon, blazing gold -->
      <!-- Top vertex: (24, -85), Bottom vertex: (24, -35), Height: 50px -->
      <!-- ======================================================= -->
      <g id="crescentMoonCutout">
        <!-- Broad radiant atmospheric amber glow centered on cutout -->
        <circle cx="20" cy="-60" r="48" fill="url(#moonHalo)" filter="url(#auroraBlur)"/>

        <!-- Deep carved cavity behind cutout -->
        <path d="M 24 -85 A 30 30 0 0 0 24 -35 A 42 42 0 0 1 24 -85 Z" fill="#180e06"/>

        <!-- The Glowing Crescent Moon Window -->
        <path d="M 24 -85 A 30 30 0 0 0 24 -35 A 42 42 0 0 1 24 -85 Z" fill="url(#warmLightSource)"/>

        <!-- Radiant golden core bloom -->
        <path d="M 24 -85 A 30 30 0 0 0 24 -35 A 42 42 0 0 1 24 -85 Z" fill="#ffffff" opacity="0.88" filter="url(#warmBloom)"/>

        <!-- Carved wood bevel edge highlight on moon perimeter -->
        <path d="M 24 -85 A 30 30 0 0 0 24 -35" stroke="#fef08a" stroke-width="1.5" fill="none"/>
        <path d="M 24 -35 A 42 42 0 0 1 24 -85" stroke="#b45309" stroke-width="1.2" fill="none"/>

        <!-- Frost needle crystals rimming the cutout -->
        <line x1="5" y1="-60" x2="11" y2="-60" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="8" y1="-50" x2="13" y2="-52" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="8" y1="-70" x2="13" y2="-68" stroke="#ffffff" stroke-width="1.5"/>
      </g>

      <!-- Radiant glow along door bottom threshold -->
      <polygon points="-30,174 80,174 120,185 -45,185" fill="#f59e0b" opacity="0.85" filter="url(#auroraBlur)"/>
      <line x1="-30" y1="174" x2="80" y2="174" stroke="#ffffff" stroke-width="2.5"/>
    </g>
  `);

  // --- COMEDIC DETAIL: FROZEN TOILET PAPER ON A STICK ---
  svg.push(`
    <!-- COMEDIC STORYTELLING: Frozen Toilet Paper Roll (-67°C) -->
    <g id="frozenToiletPaper" transform="translate(-115, 20)">
      <line x1="0" y1="0" x2="-28" y2="-4" stroke="#36251b" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-28" cy="-4" rx="2.5" ry="3.5" fill="#f1f5f9"/>

      <!-- Frozen Solid Toilet Paper Roll -->
      <ellipse cx="-16" cy="-3" rx="10" ry="15" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8"/>
      <ellipse cx="-16" cy="-3" rx="4.5" ry="7.5" fill="#713f12"/>
      <ellipse cx="-16" cy="-3" rx="3" ry="4.5" fill="#29180c"/>
      <path d="M -24 -15 Q -16 -19 -8 -15" stroke="#ffffff" stroke-width="2.5" fill="none"/>

      <!-- Paper Sheets: Frozen dead stiff horizontally in the gale -->
      <path d="M -23 4 L -64 18 L -62 36 L -20 18 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
      <line x1="-46" y1="12" x2="-44" y2="28" stroke="#94a3b8" stroke-dasharray="2.5,2" stroke-width="1.2"/>

      <!-- Sharp crystal icicles hanging from toilet paper -->
      <polygon points="-62,36 -60,48 -58,35" fill="#bae6fd"/>
      <polygon points="-52,30 -50,44 -48,29" fill="#bae6fd"/>
      <polygon points="-40,24 -38,36 -36,23" fill="#bae6fd"/>
      <polygon points="-28,19 -26,28 -24,18" fill="#bae6fd"/>
    </g>
  `);

  // --- ROOF VENT PIPE & FROZEN STEAM SCULPTURE ---
  svg.push(`
    <!-- Roof Vent Pipe & Instantly Frozen Steam Sculpture -->
    <g id="roofVentPipe" transform="translate(68, -145)">
      <rect x="-8" y="-45" width="16" height="48" fill="#1e293b" rx="1"/>
      <line x1="-8" y1="-45" x2="8" y2="-45" stroke="#64748b" stroke-width="2"/>
      <line x1="-5" y1="-45" x2="-5" y2="0" stroke="#475569" stroke-width="2"/>
      <rect x="-8" y="-28" width="16" height="6" fill="#7c2d12" opacity="0.8"/>
      <ellipse cx="0" cy="0" rx="13" ry="5" fill="#f8fafc"/>

      <!-- COMEDIC DETAIL: STEAM INSTANTLY FROZEN IN MID-AIR -->
      <g id="frozenSteamSculpture" transform="translate(0, -48)">
        <path d="M 0 0 
                 C -14 -18, -26 -38, -12 -60 
                 C 2 -75, 30 -65, 24 -92 
                 C 18 -112, -10 -118, 4 -140 
                 C 18 -158, 42 -145, 34 -172 
                 C 22 -166, 12 -150, -2 -135 
                 C -16 -118, -4 -98, -16 -82 
                 C -28 -64, -16 -36, 0 0 Z" 
              fill="url(#steamIceGrad)" opacity="0.95"/>

        <polygon points="-12,-48 -30,-56 -14,-53" fill="#ffffff"/>
        <polygon points="18,-78 38,-88 22,-84" fill="#ffffff"/>
        <polygon points="20,-122 40,-132 24,-128" fill="#ffffff"/>
        <polygon points="-6,-108 -24,-116 -8,-112" fill="#ffffff"/>
        <polygon points="24,-158 44,-168 28,-164" fill="#ffffff"/>

        <path d="M -4 -20 Q -12 -45 -2 -68 T 14 -115 T 10 -155" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.95"/>
      </g>
    </g>
  `);

  // --- THE SLANTED SNOW-PILED ROOF ---
  svg.push(`
    <!-- Slanted Timber Roof Rafter -->
    <polygon points="-140,-125 125,-140 128,-125 -138,-110" fill="#1c140e"/>

    <!-- MASSIVE PILLOW OF SCULPTED ROOF SNOW -->
    <path d="M -145 -125 
             C -140 -165, -80 -195, 0 -190 
             C 70 -185, 125 -165, 135 -138 
             C 130 -126, 120 -122, 110 -125 
             C 95 -120, 80 -124, 65 -122 
             C 45 -120, 25 -125, 5 -123 
             C -20 -120, -45 -126, -70 -122 
             C -95 -120, -120 -125, -145 -125 Z" 
          fill="url(#roofSnowPillow)"/>

    <!-- Windward Upper White Glaze -->
    <path d="M -142 -135 
             C -130 -170, -75 -195, 0 -190 
             C 65 -185, 120 -165, 130 -142 
             C 80 -175, -60 -175, -142 -135 Z" 
          fill="#ffffff" opacity="0.95"/>

    <!-- Underside Ambient Shadow -->
    <path d="M -145 -125 Q -10 -120 135 -138 L 130 -128 Q -10 -110 -140 -115 Z" fill="#475569" opacity="0.75"/>
  `);

  // --- CRYSTAL ICICLES (고드름) FRAMING THE FACADE ---
  // Roof eave is at y = -125 to -135.
  // The crescent moon is at y = -85 to -35.
  // Icicles directly above the door are kept to length 10-18px (reaching only y = -115 to -107),
  // leaving the crescent moon cutout completely open, bright, and sparkling!
  svg.push(`<!-- Crystal Icicles (고드름) Framing the Facade -->`);
  svg.push(`<g id="crystalIcicles">`);

  const icicles = [
    // Left Eaves (Dramatic long daggers)
    { x: -140, len: 45, w: 6, warm: false },
    { x: -130, len: 75, w: 8, warm: false },
    { x: -122, len: 32, w: 5, warm: false },
    { x: -114, len: 95, w: 10, warm: false },
    { x: -104, len: 52, w: 6, warm: false },
    { x: -94, len: 110, w: 11, warm: false },
    { x: -84, len: 42, w: 5, warm: false },
    { x: -74, len: 80, w: 9, warm: false },
    { x: -64, len: 48, w: 6, warm: false },
    { x: -54, len: 65, w: 7, warm: false },
    { x: -44, len: 35, w: 5, warm: false },
    // Above door frame (short so crescent moon is fully visible and prominent!)
    { x: -32, len: 20, w: 4, warm: true },
    { x: -20, len: 15, w: 3, warm: true },
    { x: -8, len: 12, w: 3, warm: true },
    { x: 4, len: 14, w: 3, warm: true },
    { x: 16, len: 11, w: 2.5, warm: true },
    { x: 28, len: 15, w: 3, warm: true },
    { x: 40, len: 20, w: 4, warm: true },
    { x: 52, len: 28, w: 5, warm: true },
    // Right Eaves (Dramatic daggers)
    { x: 64, len: 70, w: 8, warm: false },
    { x: 76, len: 45, w: 6, warm: false },
    { x: 88, len: 85, w: 9, warm: false },
    { x: 100, len: 55, w: 7, warm: false },
    { x: 112, len: 72, w: 8, warm: false },
    { x: 122, len: 38, w: 5, warm: false },
    { x: 130, len: 25, w: 4, warm: false }
  ];

  icicles.forEach(ic => {
    const roofY = -124 - (ic.x * 0.05);
    const litGrad = ic.warm ? 'url(#icicleWarmLit)' : 'url(#icicleFacetLit)';
    const shadeGrad = 'url(#icicleFacetShade)';
    
    svg.push(`
      <polygon points="${ic.x - ic.w * 0.5},${roofY} 
                      ${ic.x},${roofY} 
                      ${ic.x},${roofY + ic.len}" 
               fill="${litGrad}"/>
      <polygon points="${ic.x},${roofY} 
                      ${ic.x + ic.w * 0.5},${roofY} 
                      ${ic.x},${roofY + ic.len}" 
               fill="${shadeGrad}"/>
      <line x1="${ic.x}" y1="${roofY}" x2="${ic.x}" y2="${roofY + ic.len - 3}" 
            stroke="#ffffff" stroke-width="1.2" opacity="0.95"/>
    `);
  });

  svg.push(`</g>`); // End icicles
  svg.push(`</g>`); // End outhouse group

  // -----------------------------------------------------------
  // 10. DRAMATIC WARM GROUND LIGHT POOL ON SNOW
  // -----------------------------------------------------------
  svg.push(`<!-- Warm Tungsten Light Pool on Snowdrifts -->`);
  svg.push(`
    <g id="groundLightCone">
      <path d="M 505 720 
               L 655 725 
               L 840 900 
               L 360 920 Z" 
            fill="url(#groundLightFan)"/>
      <ellipse cx="570" cy="795" rx="180" ry="75" fill="#f59e0b" opacity="0.32" filter="url(#auroraBlur)"/>
      <ellipse cx="550" cy="740" rx="80" ry="28" fill="#fef08a" opacity="0.6" filter="url(#auroraBlur)"/>
    </g>
  `);

  // -----------------------------------------------------------
  // 11. FOREGROUND SNOWDRIFTS & SASTRUGI (WIND-CARVED CRESTS)
  // -----------------------------------------------------------
  svg.push(`<!-- Foreground Snowdrifts & Sastrugi -->`);

  svg.push(`
    <path d="M 370 720 
             C 440 710, 510 735, 590 725 
             C 670 715, 730 735, 790 730 
             C 730 770, 510 780, 370 720 Z" 
          fill="#314259" opacity="0.6"/>
  `);

  svg.push(`
    <path d="M -30 760 
             C 180 720, 380 810, 620 750 
             S 880 740, 1050 810 
             L 1050 1050 L -30 1050 Z" 
          fill="url(#snowSlopeFront)"/>

    <path d="M -20 815 
             C 140 775, 290 835, 480 800 
             S 760 805, 1040 845" 
          stroke="url(#snowDriftCrest)" stroke-width="6" fill="none"/>

    <path d="M -20 820 
             C 140 780, 290 840, 480 805 
             C 380 855, 180 835, -20 860 Z" 
          fill="#1c283a" opacity="0.75"/>

    <path d="M 60 925 
             C 280 875, 540 940, 780 890 
             S 980 930, 1050 905" 
          stroke="url(#snowDriftCrest)" stroke-width="8" fill="none"/>
  `);

  // Shovel stuck in drift
  svg.push(`
    <g id="frozenShovel" transform="translate(705, 695) rotate(22)">
      <line x1="0" y1="0" x2="0" y2="-85" stroke="#451a03" stroke-width="4.5"/>
      <ellipse cx="0" cy="-85" rx="6" ry="3" fill="#1e293b"/>
      <path d="M -16 -10 L 16 -10 L 12 15 L -12 15 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="-1" y1="-80" x2="-1" y2="-15" stroke="#ffffff" stroke-width="1.5" opacity="0.85"/>
      <ellipse cx="0" cy="5" rx="14" ry="5" fill="#f1f5f9"/>
    </g>
  `);

  // -----------------------------------------------------------
  // 12. COMEDIC DETAIL: FRANTIC DEEP BOOT FOOTPRINTS IN SNOW
  // -----------------------------------------------------------
  svg.push(`<!-- COMEDIC STORYTELLING: Frantic Hurried Footprints in Deep Snow -->`);
  svg.push(`<g id="franticFootprints">`);

  const footprints = [
    { x: 95, y: 995, rot: 35, s: 1.15 },
    { x: 135, y: 960, rot: 40, s: 1.1 },
    { x: 185, y: 935, rot: 32, s: 1.05 },
    { x: 235, y: 895, rot: 38, s: 1.0 },
    { x: 295, y: 870, rot: 30, s: 0.95 },
    { x: 355, y: 830, rot: 35, s: 0.9 },
    { x: 415, y: 805, rot: 28, s: 0.85 },
    { x: 468, y: 768, rot: 33, s: 0.8 },
    { x: 518, y: 745, rot: 25, s: 0.75 },
    { x: 545, y: 730, rot: 15, s: 0.7 }
  ];

  footprints.forEach((fp, idx) => {
    const isLeft = idx % 2 === 0;
    const lateralOffset = isLeft ? -8 : 8;

    svg.push(`
      <g transform="translate(${fp.x + lateralOffset}, ${fp.y}) rotate(${fp.rot}) scale(${fp.s})">
        <ellipse cx="0" cy="0" rx="13" ry="7.5" fill="#ffffff" opacity="0.85"/>
        <ellipse cx="1" cy="2" rx="12" ry="6.5" fill="#cbd5e1"/>
        <ellipse cx="-1" cy="0" rx="9.5" ry="5.5" fill="url(#bootShadow)"/>
        <ellipse cx="-5" cy="0" rx="5" ry="3.8" fill="#080d16"/>
        <ellipse cx="3.5" cy="0" rx="5.5" ry="4.2" fill="#080d16"/>
        <line x1="-8" y1="0" x2="-15" y2="1" stroke="#162235" stroke-width="2.5" opacity="0.75"/>
      </g>
    `);
  });
  svg.push(`</g>`);

  // -----------------------------------------------------------
  // 13. SIBERIAN BLIZZARD & BLOWING SNOW PARTICLES
  // -----------------------------------------------------------
  svg.push(`<!-- Siberian Blizzard: Wind Streaks & Blowing Snow -->`);

  svg.push(`
    <g opacity="0.4">
      <path d="M -50 350 C 250 310, 600 370, 1100 290" stroke="#bae6fd" stroke-width="2.5" stroke-dasharray="120,40,80,60" fill="none"/>
      <path d="M -50 480 C 350 440, 700 510, 1100 420" stroke="#e0f2fe" stroke-width="3" stroke-dasharray="180,60,90,40" fill="none"/>
      <path d="M -30 650 C 280 610, 650 680, 1100 590" stroke="#f8fafc" stroke-width="3.5" stroke-dasharray="150,50,110,70" fill="none"/>
      <path d="M -30 820 C 380 770, 750 840, 1100 760" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="100,40,140,50" fill="none"/>
    </g>
  `);

  svg.push(`<g opacity="0.88">`);
  for (let i = 0; i < 480; i++) {
    const px = Math.floor(random() * 1100) - 40;
    const py = Math.floor(random() * 1024);
    const pSize = 0.8 + random() * 3.5;
    const pLen = (pSize * (3.0 + random() * 4.0)).toFixed(1);
    const op = (0.25 + random() * 0.7).toFixed(2);
    const dx = parseFloat(pLen);
    const dy = -dx * 0.32;

    if (random() > 0.38) {
      svg.push(`<line x1="${px}" y1="${py}" x2="${(px + dx).toFixed(1)}" y2="${(py + dy).toFixed(1)}" stroke="#ffffff" stroke-width="${(pSize * 0.6).toFixed(1)}" stroke-linecap="round" opacity="${op}"/>`);
    } else {
      svg.push(`<circle cx="${px}" cy="${py}" r="${(pSize * 0.5).toFixed(1)}" fill="#f0f9ff" opacity="${op}"/>`);
    }
  }

  const bokeh = [
    { x: 130, y: 210, r: 9, op: 0.35 },
    { x: 330, y: 770, r: 13, op: 0.4 },
    { x: 870, y: 330, r: 10, op: 0.35 },
    { x: 930, y: 870, r: 14, op: 0.45 },
    { x: 440, y: 140, r: 8, op: 0.3 },
    { x: 75, y: 610, r: 11, op: 0.38 }
  ];
  bokeh.forEach(b => {
    svg.push(`<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#ffffff" opacity="${b.op}" filter="url(#auroraBlur)"/>`);
  });
  svg.push(`</g>`);

  // -----------------------------------------------------------
  // 14. DELICATE SUBZERO FROST RIME (NATURAL CORNER FRAMING)
  // -----------------------------------------------------------
  svg.push(`<!-- Delicate Subzero Rime Frost (Natural Corner Framing) -->`);
  svg.push(`
    <g opacity="0.55">
      <path d="M 0 0 Q 60 10 90 0 M 0 0 Q 10 60 0 90" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
      <path d="M 0 0 L 50 50 M 20 20 L 35 12 M 20 20 L 12 35 M 35 35 L 45 28 M 35 35 L 28 45" stroke="#ffffff" stroke-width="1.2"/>
      
      <path d="M 1024 0 Q 964 10 934 0 M 1024 0 Q 1014 60 1024 90" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
      <path d="M 1024 0 L 974 50 M 1004 20 L 989 12 M 1004 20 L 1012 35" stroke="#ffffff" stroke-width="1.2"/>

      <path d="M 0 1024 Q 60 1014 90 1024 M 0 1024 Q 10 964 0 934" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
      <path d="M 0 1024 L 50 974 M 20 1004 L 35 1012 M 20 1004 L 12 989" stroke="#ffffff" stroke-width="1.2"/>

      <path d="M 1024 1024 Q 964 1014 934 1024 M 1024 1024 Q 1014 964 1024 934" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
      <path d="M 1024 1024 L 974 974 M 1004 1004 L 989 1012 M 1004 1004 L 1012 989" stroke="#ffffff" stroke-width="1.2"/>
    </g>
  `);

  svg.push(`</svg>`);
  return svg.join('\n');
}

// -------------------------------------------------------------
// Execution & Verification
// -------------------------------------------------------------
async function run() {
  console.log('Generating refined master illustration for Lv.2 Oymyakon Siberian Toilet (-67°C)...');
  const svgContent = generateOymyakonSVG();

  // Destination Paths
  const svgOut1 = path.resolve('data/r2_staging/shard_0/houses_00002.svg');
  const svgOut2 = path.resolve('data/r2_staging/shard_0/00002.svg');
  const htmlFile = path.resolve('temp_render_lv2.html');
  const pngOutBrain = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\adf2f569-886e-4152-83d1-7e6637d9cf4d\\lv2_oymyakon_toilet.png';
  const pngOutShard0 = path.resolve('data/r2_staging/shard_0/00002.png');
  const pngOutStaging = path.resolve('data/r2_staging/lv2_oymyakon_toilet.png');

  // Save SVG
  fs.writeFileSync(svgOut1, svgContent, 'utf8');
  fs.writeFileSync(svgOut2, svgContent, 'utf8');
  console.log(`Saved SVG to: ${svgOut1}`);
  console.log(`Saved SVG to: ${svgOut2}`);

  // Create zero-margin 1024x1024 HTML harness
  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 1024px;
      height: 1024px;
      overflow: hidden;
      background: #000000;
    }
    svg {
      display: block;
      width: 1024px;
      height: 1024px;
    }
  </style>
</head>
<body>
${svgContent}
</body>
</html>`;
  fs.writeFileSync(htmlFile, htmlDoc, 'utf8');

  // Render to 1024x1024 PNG using Headless Chrome
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlUri = 'file:///' + htmlFile.replace(/\\/g, '/');

  console.log('Rendering 1024x1024 PNG using Headless Chrome...');
  const cmdBrain = `"${chromePath}" --headless --no-sandbox --disable-gpu --window-size=1024,1024 --default-background-color=00000000 --screenshot="${pngOutBrain}" "${htmlUri}"`;
  execSync(cmdBrain);
  console.log(`✔ Rendered to: ${pngOutBrain}`);

  fs.copyFileSync(pngOutBrain, pngOutShard0);
  console.log(`✔ Saved to: ${pngOutShard0}`);

  fs.copyFileSync(pngOutBrain, pngOutStaging);
  console.log(`✔ Saved to: ${pngOutStaging}`);

  // Clean up temp file
  if (fs.existsSync(htmlFile)) {
    fs.unlinkSync(htmlFile);
  }

  // Verification Report
  const files = [
    { name: 'SVG Shard 0 (houses_00002.svg)', path: svgOut1 },
    { name: 'SVG Shard 0 (00002.svg)', path: svgOut2 },
    { name: 'Brain PNG (lv2_oymyakon_toilet.png)', path: pngOutBrain },
    { name: 'Shard 0 PNG (00002.png)', path: pngOutShard0 },
    { name: 'Staging PNG (lv2_oymyakon_toilet.png)', path: pngOutStaging }
  ];

  console.log('\n--- VERIFICATION REPORT ---');
  for (const f of files) {
    if (fs.existsSync(f.path)) {
      const size = fs.statSync(f.path).size;
      console.log(`[PASS] ${f.name} -> Size: ${size} bytes`);
    } else {
      console.error(`[FAIL] ${f.name} does NOT exist!`);
    }
  }
}

run().catch(err => {
  console.error('Error generating illustration:', err);
  process.exit(1);
});
