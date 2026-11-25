// worker.js — Cloudflare Edge Dynamic SSR Router & Multilingual Food SEO Handler
// food.tellmyname.app (Deterministic JSA-FoodHash-Date SSR with Timezone-Aware Spotlight, Gallery & Multilingual SEO)

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  MEAL_MAP,
  formatFoodCode
} from './src/lib/constants.js';
import {
  getLocalTimeParts,
  resolveActiveMealByHour,
  getRemainingUntilMidnight,
  getOrderedMealsWithCurrentFlag
} from './src/lib/timezone.js';
import { recommendDailyMeals } from './src/lib/hash.js';
import {
  POOLS_BY_MEAL,
  ALL_FOODS,
  FOODS_BY_CODE,
  CATEGORY_STATS,
  getPoolsWithCap
} from './src/lib/food_dataset.js';
import { renderFoodIllustrationSvg } from './src/lib/illustration_svg.js';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANG_CODES,
  LANGUAGE_MAP,
  normalizeLang,
  detectLanguage,
  t,
  localizeFood
} from './src/lib/i18n.js';
import {
  WORLDCUP_SEO_SLUGS,
  parseWorldCupPath
} from './src/lib/worldcup.js';


function createClean404Response(pathname = '') {
  const safePath = String(pathname || '').replace(/[<>&"']/g, '');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 Page Not Found | TellMyName</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,sans-serif; background:#0f172a; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; text-align:center; }
    .box { max-width:480px; background:#1e293b; border:1px solid #334155; border-radius:20px; padding:32px 24px; }
    h1 { font-size:2rem; margin:0 0 8px; color:#38bdf8; }
    p { color:#94a3b8; line-height:1.6; margin:0 0 20px; }
    a { display:inline-block; padding:10px 20px; border-radius:999px; background:#38bdf8; color:#0f172a; font-weight:700; text-decoration:none; margin:4px; }
  </style>
</head>
<body>
  <main class="box">
    <h1>404 Not Found</h1>
    <p>The requested page (<code>${safePath}</code>) could not be found on TellMyName.</p>
    <div>
      <a href="/">🏠 MyHome</a>
      <a href="/food/">🍽️ Food</a>
      <a href="/job/">💼 MyJob</a>
      <a href="/car/">🚗 MyCar</a>
    </div>
  </main>
</body>
</html>`;
  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  });
}


function withSecurityHeaders(res) {
  const headers = new Headers(res.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}


export const INDEXNOW_KEY = 'a8f4c2e9b1d703654e2a9c8b7d6f1e3a';

/**
 * HTML 특수 문자 이스케이프
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * XML 특수 문자 이스케이프
 */
export function escapeXml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 대표적인 50가지 한국 인기 이름 목록 (Sitemap 등록용)
 */
export const POPULAR_SEED_NAMES = [
  '홍길동', '김서윤', '이도윤', '박하은', '이준우', '정지우', '최서진', '김민준',
  '이지호', '박예은', '윤시우', '임수아', '강하준', '조유나', '한주원', '송채원',
  '오은우', '배지아', '신서율', '안다은', '황도현', '전서아', '고유진', '문하율',
  '손시윤', '양나은', '백준서', '허윤아', '유지후', '남수빈', '심민서', '노태양',
  '하승우', '곽서우', '성지원', '차민혁', '주예린', '우지민', '구도원', '라온',
  '김태희', '이민호', '박보검', '아이유', '손흥민', '페이커', '차은우', '장원영',
  '카리나', '안유진'
];

// In-memory 캐시 for localized food dictionaries
const FOOD_DICTS = new Map();

/**
 * 다국어 음식 사전 로드 (Cloudflare Workers env.ASSETS 또는 Node.js fs 폴백)
 */
export async function getFoodDictionary(lang, env = {}, request = null) {
  const norm = normalizeLang(lang);
  if (norm === 'ko') return null;
  if (FOOD_DICTS.has(norm)) return FOOD_DICTS.get(norm);

  // 1. Cloudflare Workers env.ASSETS (또는 dev server mock ASSETS)
  if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
    try {
      const baseUrl = request ? request.url : SITE_ORIGIN;
      const assetUrl = new URL(`/i18n/foods/${norm}.json`, baseUrl);
      const res = await env.ASSETS.fetch(new Request(assetUrl.toString()));
      if (res && res.ok) {
        const data = await res.json();
        FOOD_DICTS.set(norm, data);
        return data;
      }
    } catch (_) {}
  }

  // 2. Node.js 환경 폴백 (테스트, CLI 스크립트 등)
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const cwd = process.cwd();
      const candidatePaths = [
        path.resolve(cwd, 'dist', 'i18n', 'foods', `${norm}.json`),
        path.resolve(cwd, 'web', 'i18n', 'foods', `${norm}.json`),
        path.resolve(cwd, 'data', 'i18n', 'foods', `${norm}.json`)
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const data = JSON.parse(raw);
          FOOD_DICTS.set(norm, data);
          return data;
        }
      }
    } catch (_) {}
  }

  return null;
}

/**
 * 기본 Fallback HTML 템플릿
 */
export function getFallbackHtmlTemplate() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(SITE_NAME)}</title>
  <link rel="icon" href="/favicon.ico" />
</head>
<body>
  <div id="app">
    <header class="site-header">
      <a href="/" class="site-logo">🍽️ ${escapeHtml(SITE_NAME)}</a>
    </header>
    <main class="main-container">
      <section id="hero-current-meal"></section>
      <section id="daily-timeline-section">
        <div class="timeline-cards-grid" id="timeline-cards-container"></div>
      </section>
    </main>
  </div>
</body>
</html>`;
}

/**
 * 사이트맵 인덱스 XML 생성 (/sitemap.xml)
 * Method B: Only food.tellmyname.app & myhome.tellmyname.app open, 0 name doorway sitemaps
 */
export function generateSitemapIndex(origin = SITE_ORIGIN) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${origin}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${origin}/sitemap-foods.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${origin}/sitemap-images.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://myhome.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://job.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://car.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://photodiary.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * 정적 페이지 사이트맵 XML 생성 (/sitemap-pages.xml)
 * 홈(/), 도감(/gallery), 월드컵(/worldcup*) 각 1개 대표 URL + xhtml:link alternates
 */
export function generateSitemapPages(origin = SITE_ORIGIN) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];

  // 1. 홈 (/)
  lines.push('  <url>');
  lines.push(`    <loc>${origin}/</loc>`);
  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push('    <changefreq>daily</changefreq>');
  lines.push('    <priority>1.0</priority>');
  for (const altLang of SUPPORTED_LANG_CODES) {
    const altHref = altLang === 'ko' ? `${origin}/` : `${origin}/?lang=${altLang}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altHref}" />`);
  }
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" />`);
  lines.push('  </url>');

  // 2. 일러스트 도감 갤러리 (/gallery)
  lines.push('  <url>');
  lines.push(`    <loc>${origin}/gallery</loc>`);
  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push('    <changefreq>daily</changefreq>');
  lines.push('    <priority>0.9</priority>');
  for (const altLang of SUPPORTED_LANG_CODES) {
    const altHref = altLang === 'ko' ? `${origin}/gallery` : `${origin}/gallery?lang=${altLang}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altHref}" />`);
  }
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/gallery" />`);
  lines.push('  </url>');

  // 3. 음식 이상형 월드컵 SEO 랜딩 (7종, 각 1개 대표 URL)
  for (const slug of Object.keys(WORLDCUP_SEO_SLUGS)) {
    const basePath = slug ? `/worldcup/${slug}` : '/worldcup';
    lines.push('  <url>');
    lines.push(`    <loc>${origin}${basePath}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.9</priority>');
    for (const altLang of SUPPORTED_LANG_CODES) {
      const altUrl = altLang === 'ko' ? `${origin}${basePath}` : `${origin}${basePath}?lang=${altLang}`;
      lines.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`);
    }
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${basePath}" />`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * 전체 음식 상세 페이지 사이트맵 XML 생성 (/sitemap-foods.xml)
 * 401개 음식 각각 1개 대표 URL (/food/00001 .. /food/00401) + xhtml:link alternates
 */
export function generateSitemapFoods(origin = SITE_ORIGIN) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];

  for (const food of ALL_FOODS) {
    const code = formatFoodCode(food.index);
    lines.push('  <url>');
    lines.push(`    <loc>${origin}/food/${code}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    for (const altLang of SUPPORTED_LANG_CODES) {
      const altUrl = altLang === 'ko' ? `${origin}/food/${code}` : `${origin}/food/${code}?lang=${altLang}`;
      lines.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`);
    }
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/food/${code}" />`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * 음식 이미지 사이트맵 XML 생성 (/sitemap-images.xml)
 * 401개 음식 이미지 (image:loc, image:title, image:caption)
 */
export function generateSitemapImages(origin = SITE_ORIGIN) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  ];

  for (const food of ALL_FOODS) {
    const code = formatFoodCode(food.index);
    lines.push('  <url>');
    lines.push(`    <loc>${origin}/food/${code}</loc>`);
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${origin}/images/web/${code}.webp</image:loc>`);
    lines.push(`      <image:title>${escapeXml(food.name)}</image:title>`);
    lines.push(`      <image:caption>${escapeXml(food.tagline || food.funComment || food.englishName)}</image:caption>`);
    lines.push('    </image:image>');
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * 대표 이름 결과 사이트맵 XML 생성 (/sitemap-names.xml)
 */
export function generateSitemapNames(origin = SITE_ORIGIN) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const name of POPULAR_SEED_NAMES) {
    lines.push('  <url>');
    lines.push(`    <loc>${origin}/name/${encodeURIComponent(name)}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push('    <changefreq>daily</changefreq>');
    lines.push('    <priority>0.8</priority>');
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * robots.txt 텍스트 생성
 */
export function generateRobotsTxt(origin = SITE_ORIGIN) {
  return [
    `# Robots.txt for ${origin}`,
    '# Designed for Naver Yeti, Googlebot, Bingbot, Kakao, and Instagram scrapers',
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Yeti',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# Sitemaps',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n');
}

export const LOCALIZED_SAMPLE_NAMES = {
  en: ['Chloe', 'Emma', 'Olivia', 'Liam', 'Noah'],
  ja: ['佐藤', '鈴木', '高橋', '田中', '伊藤'],
  zh: ['张伟', '王伟', '王芳', '李伟', '李娜'],
  hi: ['Aarav', 'Vihaan', 'Aditi', 'Diya', 'Rohan'],
  vi: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'],
  fr: ['Lucas', 'Emma', 'Gabriel', 'Léa', 'Louis'],
  pt: ['Lucas', 'Gabriel', 'Sophia', 'Alice', 'Arthur'],
  es: ['Mateo', 'Santiago', 'Sofía', 'Valentina', 'Lucas'],
  id: ['Budi', 'Siti', 'Agus', 'Dewi', 'Rian'],
  ru: ['Александр', 'Михаил', 'Анна', 'София', 'Дмитрий'],
  de: ['Noah', 'Matteo', 'Emma', 'Mia', 'Paul'],
  it: ['Leonardo', 'Francesco', 'Sofia', 'Giulia', 'Lorenzo'],
  ms: ['Muhammad', 'Ahmad', 'Nurul', 'Siti', 'Adam']
};

/**
 * Localizes static HTML shell (data-i18n, placeholders, titles, lang attribute, select options, and sample chips)
 * Zero Hangul leakage for non-Korean requests in SSR
 */
export function localizeStaticShellHtml(html, lang = 'ko') {
  const norm = normalizeLang(lang);
  if (norm === 'ko') return html;

  // 1. Sync <html lang="...">
  html = html.replace(/<html(?:\s+lang="[^"]*")?/i, `<html lang="${escapeHtml(norm)}"`);

  // 2. Sync <select id="lang-select"> selected option
  html = html.replace(/<option\s+value="ko"\s+selected>/i, '<option value="ko">');
  html = html.replace(new RegExp(`<option\\s+value="${norm}">`, 'i'), `<option value="${norm}" selected>`);

  // 3. Replace all elements with data-i18n="key"
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n=["']([^"']+)["'][^>]*>)([\s\S]*?)(<\/\2>)/gi, (match, openTag, tagName, key, inner, closeTag) => {
    const val = t(norm, key);
    if (val && val !== key) {
      return `${openTag}${escapeHtml(val)}${closeTag}`;
    }
    return match;
  });

  // 4. Replace data-i18n-placeholder="key"
  html = html.replace(/\bdata-i18n-placeholder=["']([^"']+)["']/gi, (match, key) => {
    const val = t(norm, key);
    if (val && val !== key) {
      return `placeholder="${escapeHtml(val)}" data-i18n-placeholder="${key}"`;
    }
    return match;
  });

  // 5. Replace data-i18n-title="key"
  html = html.replace(/\bdata-i18n-title=["']([^"']+)["']/gi, (match, key) => {
    const val = t(norm, key);
    if (val && val !== key) {
      return `title="${escapeHtml(val)}" data-i18n-title="${key}"`;
    }
    return match;
  });

  // 6. Replace sample chips with localized names
  const samples = LOCALIZED_SAMPLE_NAMES[norm];
  if (samples && samples.length > 0) {
    const chipsHtml = samples.map(n => `<button type="button" class="sample-name-chip" data-name="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('\n            ');
    html = html.replace(/<div class="sample-names-wrap" id="sample-chips-container">[\s\S]*?<\/div>/i, `<div class="sample-names-wrap" id="sample-chips-container">\n            ${chipsHtml}\n          </div>`);
  }


  // Complete SSR non-Korean localization for food (0 Korean leaks for Googlebot / ?lang=en)
  html = html.replace(/<section[^>]*id=[\"']photodiary-promo-section[\"'][\s\S]*?<\/section>/i, '');
  // Replace Korean sample chips with international names
  html = html.replace(
    /<div class="sample-chips-list" id="sample-chips-container">[\s\S]*?<\/div>/i,
    '<div class="sample-chips-list" id="sample-chips-container">' +
    ['Chloe', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Lucas', 'Maya']
      .map(n => `<button type="button" class="sample-chip" data-name="${n}">${n}</button>`).join('') +
    '</div>'
  );
  // Translate Korean timeline header & static strings
  html = html.replace(/([A-Za-z0-9가-힣_\s-]+)님의 하루 5끼 전체 식단표/g, "$1's 5 Daily Meal Recommendations");
  html = html.replace(/김서윤\s*님의 하루 5끼 전체 식단표/g, "Chloe's 5 Daily Meal Recommendations");
  html = html.replace(/하루 5끼 전체 식단표/g, '5 Daily Meal Recommendations');
  html = html.replace(/(\d{1,3}(?:,\d{3})*)원(?:\s*\([^)]*[가-힣][^)]*\))?/g, (_, p) => '$' + Math.max(1, Math.round(parseInt(p.replace(/,/g, ''), 10) / 1350)) + ' USD');
  const _foodEnPairs = [
    ['🇰🇷 서울 (KST, UTC+9)', '🇰🇷 Seoul (KST, UTC+9)'],
    ['🇯🇵 도쿄 (JST, UTC+9)', '🇯🇵 Tokyo (JST, UTC+9)'],
    ['🇺🇸 뉴욕 (EST/EDT)', '🇺🇸 New York (EST/EDT)'],
    ['🇺🇸 LA (PST/PDT)', '🇺🇸 Los Angeles (PST/PDT)'],
    ['🇬🇧 런던 (GMT/BST)', '🇬🇧 London (GMT/BST)'],
    ['🇫🇷 파리 (CET/CEST)', '🇫🇷 Paris (CET/CEST)'],
    ['🇩🇪 베를린 (CET/CEST)', '🇩🇪 Berlin (CET/CEST)'],
    ['🇦🇺 시드니 (AEST/AEDT)', '🇦🇺 Sydney (AEST/AEDT)'],
    ['🇸🇬 싱가포르 (SGT)', '🇸🇬 Singapore (SGT)'],
    ['🇹🇭 방콕 (ICT)', '🇹🇭 Bangkok (ICT)'],
    ['🇻🇳 하노이 (ICT)', '🇻🇳 Hanoi (ICT)'],
    ['🇮🇩 자카르타 (WIB)', '🇮🇩 Jakarta (WIB)'],
    ['🇷🇺 모스크바 (MSK)', '🇷🇺 Moscow (MSK)'],
    ['🇨🇳 상하이 (CST)', '🇨🇳 Shanghai (CST)'],
    ['🇮🇳 뭄바이 (IST)', '🇮🇳 Mumbai (IST)'],
    ['🇧🇷 상파울루 (BRT)', '🇧🇷 São Paulo (BRT)'],
    ['🇲🇽 멕시코시티 (CST)', '🇲🇽 Mexico City (CST)'],
    ['서울', 'Seoul'], ['도쿄', 'Tokyo'], ['뉴욕', 'New York'], ['런던', 'London'],
    ['파리', 'Paris'], ['시드니', 'Sydney'], ['방콕', 'Bangkok'], ['싱가포르', 'Singapore'],
    ['오늘 (2026.11.08)', 'Today'],
    ['음식 일러스트', 'Food illustration'],
    ['서비스 소개', 'About'],
    ['개인정보처리방침', 'Privacy Policy'],
    ['이용약관', 'Terms'],
    ['문의하기', 'Contact'],
    ['나에게 어울리는 집', 'MyHome'],
    ['나에게 어울리는 직업', 'MyJob'],
    ['나에게 어울리는 자동차', 'MyCar'],
    ['포토 다이어리', 'PhotoDiary'],
    ['오늘 뭐 먹지?', 'TellMyName Food']
  ];
  for (const [k, v] of _foodEnPairs) {
    if (html.includes(k)) html = html.split(k).join(v);
  }
  html = html.replace(/aria-label="[^"]*[가-힣][^"]*"/g, 'aria-label="Food navigation"');
  html = html.replace(/title="[^"]*[가-힣][^"]*"/g, '');

  return html;
}

/**
 * Edge SSR HTML 렌더러 — 홈(/) 및 이름 결과(/name/:name)
 */
export function renderMukbangSeoHtml(baseHtml, ssrPayload, origin = SITE_ORIGIN) {
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate();

  const {
    name,
    date,
    timeZone,
    hour,
    currentMealKey,
    currentRecommendation,
    orderedMeals,
    countdown,
    strokeInfo,
    lang = 'ko',
    isHome = false
  } = ssrPayload;

  const normLang = normalizeLang(lang);
  html = localizeStaticShellHtml(html, normLang);
  const langMeta = LANGUAGE_MAP[normLang] || { locale: 'ko-KR' };

  const activeMeal = MEAL_MAP[currentMealKey] || resolveActiveMealByHour(hour);
  const activeRec = currentRecommendation?.food || (orderedMeals || []).find(m => m.mealKey === activeMeal.key)?.food || null;
  const foodIndex = activeRec ? Number(activeRec.index || 1) : 1;
  const paddedCode = formatFoodCode(foodIndex);

  const ogImageUrl = `https://img.tellmyname.app/foods/${paddedCode}.png`;
  const canonicalUrl = normLang === 'ko'
    ? `${origin}/`
    : `${origin}/?lang=${normLang}`;

  // Requirement 5: Remove bottom origin-spectrum-section on non-home pages (/name/:name)
  if (!isHome) {
    html = html.replace(/<section\s+class=["'][^"']*origin-spectrum-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');
  }

  const foodName = activeRec?.name || '오늘의 맞춤 미식';
  const localizedMealLabel = t(normLang, `meal_${activeMeal.key}`) || activeMeal.label;

  let titleText;
  let descText;
  if (normLang === 'ko') {
    titleText = `${name}님의 ${localizedMealLabel} 추천: ${foodName} | ${SITE_NAME}`;
    descText = `${name}님을 위한 ${date} ${localizedMealLabel} 추천 메뉴는 [${foodName}]입니다! (${activeRec?.originBadge || ''}) 하루 5끼(아침·점심·간식·저녁·야식) 맞춤 식단표와 자정 리셋 카운트다운을 확인해보세요.`;
  } else {
    const localizedBrand = normLang === 'ko' ? '오늘 뭐 먹지?' : 'TellMyName Food';
    titleText = `${name}'s ${localizedMealLabel}: ${foodName} | ${localizedBrand}`;
    descText = `${name}'s ${date} ${localizedMealLabel} recommendation: ${foodName}. ${activeRec?.tagline || ''} Explore 5 customized daily meals on ${localizedBrand}.`;
  }

  const keywordsText = `${name}, 오늘뭐먹지, 음식추천, ${localizedMealLabel}, ${foodName}, ${activeRec?.englishName || ''}, Mukbang`;

  // 15 hreflang tags
  const hreflangTags = SUPPORTED_LANG_CODES.map(l => {
    const altHref = isHome
      ? (l === 'ko' ? `${origin}/` : `${origin}/?lang=${l}`)
      : (l === 'ko' ? `${origin}/name/${encodeURIComponent(name)}` : `${origin}/name/${encodeURIComponent(name)}?lang=${l}`);
    return `<link rel="alternate" hreflang="${l}" href="${altHref}" />`;
  });
  const defaultHref = isHome
    ? `${origin}/`
    : `${origin}/name/${encodeURIComponent(name)}`;
  hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${defaultHref}" />`);

  // Schema.org JSON-LD (WebPage + Menu + MenuItem + BreadcrumbList)
  const menuItems = (orderedMeals || []).map(slot => {
    const f = slot.food;
    return {
      '@type': 'MenuItem',
      'name': f?.name || slot.mealLabel,
      'description': f?.tagline || f?.funComment || `${slot.mealFullLabel} 메뉴`,
      'image': `https://img.tellmyname.app/foods/${formatFoodCode(f?.index || 1)}.png`,
      'offers': {
        '@type': 'Offer',
        'price': f?.priceRange || '0',
        'priceCurrency': 'KRW'
      },
      'nutrition': {
        '@type': 'NutritionInformation',
        'calories': f?.calories || ''
      }
    };
  });

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'url': `${origin}/`,
        'name': SITE_NAME,
        'description': '이름 × 날짜 × 타임존 기반 하루 5끼 맞춤 미식 식단소',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${origin}/name/{search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': canonicalUrl,
        'url': canonicalUrl,
        'name': titleText,
        'description': descText,
        'inLanguage': normLang
      },
      {
        '@type': 'Menu',
        '@id': `${canonicalUrl}#daily-menu`,
        'name': `${name} — ${date} Daily 5 Meals`,
        'description': `${localizedMealLabel}: ${foodName}`,
        'hasMenuItem': menuItems
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/?lang=${normLang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': name,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdGraph, null, 2)}\n  </script>`;

  const robotsMetaTag = isHome
    ? '<meta name="robots" content="index, follow" />'
    : '<meta name="robots" content="noindex, follow" />';

  const headElements = [
    `<title>${escapeHtml(titleText)}</title>`,
    robotsMetaTag,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...hreflangTags,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${langMeta.locale ? langMeta.locale.replace('-', '_') : 'ko_KR'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    jsonLdScript
  ];

  const headMetadata = headElements.join('\n  ');

  // <html lang="..."> 교체
  html = html.replace(/<html(\s+[^>]*?)?lang=["'][^"']*["']/i, `<html$1lang="${normLang}"`);

  // 기존 중복 메타 태그 제거
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?window\.__INITIAL_MUKBANG_DATA__[\s\S]*?<\/script>/gi, '');

  // <head> 내부에 메타데이터 주입
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  } else {
    html = `<head>\n  ${headMetadata}\n</head>\n` + html;
  }

  // 1. Hero Spotlight 카드 마크업 생성
  const heroCardHtml = [
    `<div class="hero-spotlight-card" data-active-meal="${escapeHtml(activeMeal.key)}">`,
    `  <div class="hero-spotlight-header">`,
    `    <div class="hero-badge-group">`,
    `      <span class="spotlight-slot-badge">${escapeHtml(activeMeal.emoji)} ${escapeHtml(localizedMealLabel)} (${escapeHtml(activeMeal.timeRangeText)})</span>`,
    `      <span class="spotlight-origin-badge">${escapeHtml(activeRec?.originBadge || '🍽️ 오늘의 추천')}</span>`,
    `      <span class="spotlight-code-badge">#${escapeHtml(paddedCode)}</span>`,
    `    </div>`,
    `    <h2 class="hero-dish-title">`,
    (normLang === 'ko')
      ? `      <span class="hero-user-highlight">${escapeHtml(name)}</span>님의 ${escapeHtml(localizedMealLabel)} 추천 메뉴: <span class="hero-dish-name">${escapeHtml(foodName)}</span>`
      : `      <span class="hero-user-highlight">${escapeHtml(name)}</span>'s ${escapeHtml(localizedMealLabel)} Pick: <span class="hero-dish-name">${escapeHtml(foodName)}</span>`,
    `    </h2>`,
    activeRec?.englishName ? `    <p class="hero-dish-en">${escapeHtml(activeRec.englishName)}</p>` : '',
    activeRec?.tagline ? `    <p class="hero-dish-tagline">${escapeHtml(activeRec.tagline)}</p>` : '',
    `  </div>`,
    `  <div class="hero-spotlight-visual">`,
    `    <img src="${ogImageUrl}" alt="${escapeHtml(foodName)} - ${escapeHtml(name)}'s ${escapeHtml(localizedMealLabel)}" width="600" height="600" loading="eager" class="hero-dish-img" />`,
    (normLang === 'ko' && activeRec?.funComment) ? `    <p class="hero-fun-comment">${escapeHtml(activeRec.funComment)}</p>` : '',
    `  </div>`,
    `  <div class="hero-spotlight-specs">`,
    `    <dl class="hero-specs-list">`,
    `      <div class="hero-spec-item"><dt>${escapeHtml(t(normLang, 'calLabel') || '열량')}</dt><dd>${escapeHtml(activeRec?.calories || (normLang === 'ko' ? '균형 영양식' : 'Balanced'))}</dd></div>`,
    `      <div class="hero-spec-item"><dt>${escapeHtml(t(normLang, 'priceLabel') || '예상 가격')}</dt><dd>${escapeHtml(activeRec?.priceRange || (normLang === 'ko' ? '시세 기준' : 'Standard'))}</dd></div>`,
    (normLang === 'ko' && activeRec?.pairingTip) ? `      <div class="hero-spec-item"><dt>페어링 팁</dt><dd>${escapeHtml(activeRec.pairingTip)}</dd></div>` : '',
    `    </dl>`,
    `  </div>`,
    `</div>`
  ].filter(Boolean).join('\n');

  // 2. 5끼 전체 타임라인 그리드 카드 마크업 생성
  const timelineCardsHtml = (orderedMeals || []).map(m => {
    const isCur = m.mealKey === activeMeal.key;
    const f = m.food;
    const code = formatFoodCode(f?.index || 1);
    const imgUrl = `https://img.tellmyname.app/foods/${code}.png`;
    const mealLabelText = t(normLang, `meal_${m.mealKey}`) || m.mealLabel;
    return `        <article class="meal-card${isCur ? ' is-active-slot' : ''}" data-meal="${escapeHtml(m.mealKey)}">
          <div class="meal-card-header">
            <span class="meal-slot-badge">${escapeHtml(m.mealEmoji)} ${escapeHtml(mealLabelText)}</span>
            <span class="meal-slot-time">${escapeHtml(m.timeRangeText)}</span>
          </div>
          <div class="meal-card-body">
            <div class="meal-image-wrap">
              <img src="${imgUrl}" alt="${escapeHtml(f?.name || mealLabelText)}" width="200" height="200" loading="lazy" />
            </div>
            <div class="meal-info-wrap">
              <span class="food-origin-pill">${escapeHtml(f?.originBadge || '')}</span>
              <h3 class="food-card-title">${escapeHtml(f?.name || '추천 메뉴')}</h3>
              <p class="food-card-desc">${escapeHtml(f?.tagline || (normLang === 'ko' ? f?.funComment : '') || '')}</p>
              <div class="food-meta-tags">
                <span class="meta-tag tag-cal">${escapeHtml(f?.calories || '')}</span>
                <span class="meta-tag tag-price">${escapeHtml(f?.priceRange || '')}</span>
              </div>
            </div>
          </div>
        </article>`;
  }).join('\n');

  // 3. web/index.html 특정 DOM 요소 주입
  if (/<section\s+id=["']hero-current-meal["'][^>]*>[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(
      /<section\s+id=["']hero-current-meal["'][^>]*>[\s\S]*?<\/section>/i,
      `<section id="hero-current-meal" class="hero-current-meal-section" aria-label="현재 시간 추천 끼니">\n${heroCardHtml}\n      </section>`
    );
  } else if (/<section\s+id=["']recommendation-root["'][^>]*>[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(
      /<section\s+id=["']recommendation-root["'][^>]*>[\s\S]*?<\/section>/i,
      `<section id="recommendation-root">\n${heroCardHtml}\n      </section>`
    );
  }

  // 타임라인 카드 그리드 주입
  if (/<div\s+class=["'][^"']*timeline-cards-grid[^"']*["']\s+id=["']timeline-cards-container["'][^>]*>[\s\S]*?<\/div>/i.test(html)) {
    html = html.replace(
      /<div\s+class=["'][^"']*timeline-cards-grid[^"']*["']\s+id=["']timeline-cards-container["'][^>]*>[\s\S]*?<\/div>/i,
      `<div class="timeline-cards-grid" id="timeline-cards-container">\n${timelineCardsHtml}\n        </div>`
    );
  }

  // 검색 인풋창 및 헤더 사용자명 주입
  html = html.replace(/<span\s+id=["']timeline-user-name["'][^>]*>[\s\S]*?<\/span>/i, `<span id="timeline-user-name">${escapeHtml(name)}</span>`);
  const todayLabel = (normLang === 'ko') ? `오늘 (${escapeHtml(date)})` : `${t(normLang, 'brandToday') || 'Today'} (${escapeHtml(date)})`;
  html = html.replace(/<span\s+id=["']current-date-text["'][^>]*>[\s\S]*?<\/span>/i, `<span id="current-date-text">${escapeHtml(todayLabel)}</span>`);
  html = html.replace(/<strong\s+id=["']midnight-countdown["'][^>]*>[\s\S]*?<\/strong>/i, `<strong id="midnight-countdown" class="countdown-timer">${escapeHtml(countdown?.formatted || '00:00:00')}</strong>`);
  html = html.replace(/<input\b([^>]*\bid=["']name-input["'][^>]*)>/i, (match, attrs) => {
    const cleanedAttrs = attrs.replace(/\bvalue=["'][^"']*["']/i, '');
    return `<input${cleanedAttrs} value="${escapeHtml(name)}">`;
  });

  // SPA 즉시 수화(Hydration)를 위한 초기 데이터 스크립트 주입
  const initialDataJson = JSON.stringify({ ...ssrPayload, lang: normLang }).replace(/</g, '\\u003c');
  const initialDataScript = `<script>window.__INITIAL_MUKBANG_DATA__ = ${initialDataJson};</script>`;

  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `  ${initialDataScript}\n</body>`);
  } else {
    html += `\n${initialDataScript}`;
  }


  if (normLang !== 'ko') {
    html = html
      .replace(/<section[^>]*id=["']photodiary-promo-section["'][\s\S]*?<\/section>/i, '')
      .replace(/([A-Za-z0-9가-힣_\s-]+)님의\s*5 Daily Meal Recommendations/g, "$1's 5 Daily Meal Recommendations")
      .replace(/김서윤<\/span>님의/g, "Chloe</span>'s")
      .replace(/<\/span>님의/g, "</span>'s")
      .replace(/김서윤님의/g, "Chloe's")
      .replace(/소개 \(About\)/g, 'About')
      .replace(/문의 \(Contact\)/g, 'Contact')
      .replace(/([A-Za-z]+)님의/g, "$1's")
      .replace(/(\d{1,3}(?:,\d{3})*)원(?:\s*\([^)]*[가-힣][^)]*\))?/g, (_, p) => '$' + Math.max(1, Math.round(parseInt(p.replace(/,/g, ''), 10) / 1350)) + ' USD')
      .replace(/정밀 시간 조절:/g, 'Fine-tune hour:')
      .replace(/아침 추천 시간/g, 'Breakfast time')
      .replace(/점심 추천 시간/g, 'Lunch time')
      .replace(/간식 추천 시간/g, 'Snack time')
      .replace(/저녁 추천 시간/g, 'Dinner time')
      .replace(/야식 추천 시간/g, 'Late-night time')
      .replace(/✅ 원하는 음식만 선택 \(/g, '✅ Selected meals (')
      .replace(/끼\)/g, ')')
      .replace(/언어 선택 \(Language\)/g, 'Language')
      .replace(/추천 끼니/g, 'Recommended meal');
  }

  return html;
}


/**
 * Edge SSR HTML 렌더러 — 음식 상세 페이지 (/food/{code}?lang={lang})
 * 검색엔진 크롤러가 한국어명·영어명·번역명을 모두 인덱싱할 수 있도록 SSR 마크업 완비
 */
export function renderFoodDetailSeoHtml(baseHtml, food, lang = 'ko', dict = null, origin = SITE_ORIGIN) {
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate();

  const normLang = normalizeLang(lang);
  html = localizeStaticShellHtml(html, normLang);
  // Requirement 5: Remove bottom origin-spectrum-section from /food/:code subpages
  html = html.replace(/<section\s+class=["'][^"']*origin-spectrum-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');
  const langMeta = LANGUAGE_MAP[normLang] || { locale: 'ko-KR' };
  const localized = localizeFood(food, normLang, dict);
  const code = formatFoodCode(food.index);

  // Title: 번역명 · 영어명 (한국어원명) | 오늘 뭐 먹지?
  let titleText;
  let descText;
  if (normLang === 'ko') {
    titleText = `${food.name} · ${food.englishName} 일러스트 & 메뉴 추천 | ${SITE_NAME}`;
    descText = `${food.name} (${food.englishName}) - ${food.tagline || ''}. 열량: ${food.calories || '균형 영양식'}, ${food.originBadge || ''}. 오늘 뭐 먹지? 일러스트 도감 및 하루 5끼 맞춤 추천.`;
  } else {
    titleText = `${localized.name} · ${food.englishName} (${food.name}) | ${SITE_NAME}`;
    descText = `${localized.name} (${food.englishName} / ${food.name}) - ${localized.tagline || food.tagline || ''}. Calories: ${food.calories || 'N/A'}, ${localized.originBadge || ''}. Mukbang Food Illustration & Daily Meal Planner.`;
  }

  const keywordsText = `${localized.name}, ${food.englishName}, ${food.name}, 오늘뭐먹지, 음식추천, ${localized.originBadge || ''}, Mukbang`;
  const canonicalUrl = `${origin}/food/${code}?lang=${normLang}`;
  const ogImageUrl = `https://img.tellmyname.app/foods/${code}.png`;

  // 15 hreflang tags
  const hreflangTags = SUPPORTED_LANG_CODES.map(l =>
    `<link rel="alternate" hreflang="${l}" href="${origin}/food/${code}?lang=${l}" />`
  );
  hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${origin}/food/${code}" />`);

  // Schema.org JSON-LD: Recipe + BreadcrumbList
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Recipe',
        '@id': `${canonicalUrl}#recipe`,
        'name': localized.name,
        'headline': `${localized.name} (${food.englishName} / ${food.name})`,
        'image': [
          `https://img.tellmyname.app/foods/${code}.png`,
          `https://img.tellmyname.app/foods/${code}.png`
        ],
        'description': localized.tagline || food.tagline || descText,
        'recipeCategory': food.primaryMeal || 'lunch',
        'recipeCuisine': food.originGroup || 'Korean',
        'nutrition': {
          '@type': 'NutritionInformation',
          'calories': food.calories || ''
        },
        'inLanguage': normLang
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/?lang=${normLang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Gallery',
            'item': `${origin}/gallery?lang=${normLang}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': localized.name,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdGraph, null, 2)}\n  </script>`;

  const robotsMetaTag = '<meta name="robots" content="index, follow" />';

  const headElements = [
    `<title>${escapeHtml(titleText)}</title>`,
    robotsMetaTag,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...hreflangTags,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${langMeta.locale ? langMeta.locale.replace('-', '_') : 'ko_KR'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    jsonLdScript
  ];

  const headMetadata = headElements.join('\n  ');

  // <html lang="..."> 교체
  html = html.replace(/<html(\s+[^>]*?)?lang=["'][^"']*["']/i, `<html$1lang="${normLang}"`);

  // 기존 중복 메타 태그 제거
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?window\.__INITIAL_MUKBANG_DATA__[\s\S]*?<\/script>/gi, '');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  } else {
    html = `<head>\n  ${headMetadata}\n</head>\n` + html;
  }

  // 검색엔진 크롤러를 위한 SSR 마크업 (h1 번역명 + p 태그에 영어명 및 한국어 원명 포함)
  const ssrFoodCardHtml = `
    <article class="food-detail-ssr" id="food-detail-card" data-code="${escapeHtml(code)}" data-lang="${escapeHtml(normLang)}">
      <header class="food-detail-header">
        <div class="food-badge-group">
          <span class="food-origin-pill">${escapeHtml(localized.originBadge || '')}</span>
          <span class="food-code-pill">#${escapeHtml(code)}</span>
        </div>
        <h1 class="food-title-localized">${escapeHtml(localized.name)}</h1>
        <p class="food-names-bilingual">
          <span class="food-name-en">English: <strong>${escapeHtml(food.englishName || '')}</strong></span>
          <span class="food-name-ko">한국어 원명: <strong>${escapeHtml(food.name || '')}</strong></span>
        </p>
        <p class="food-tagline">${escapeHtml(localized.tagline || food.tagline || '')}</p>
      </header>
      <div class="food-detail-visual">
        <picture>
          <source srcset="https://img.tellmyname.app/foods/${code}.png" type="image/png">
          <img src="${ogImageUrl}" alt="${escapeHtml(localized.name)} (${escapeHtml(food.englishName)} / ${escapeHtml(food.name)}) 일러스트" width="800" height="800" loading="eager" class="food-hero-img" />
        </picture>
      </div>
      <div class="food-detail-specs">
        <dl class="food-specs-list">
          <div class="spec-row"><dt>열량 / Calories</dt><dd>${escapeHtml(food.calories || '균형 영양식')}</dd></div>
          <div class="spec-row"><dt>예상 가격 / Price</dt><dd>${escapeHtml(food.priceRange || '시세 기준')}</dd></div>
          <div class="spec-row"><dt>추천 끼니 / Meal</dt><dd>${escapeHtml(food.primaryMeal || 'lunch')}</dd></div>
          ${normLang === 'ko' && food.pairingTip ? `<div class="spec-row"><dt>페어링 팁</dt><dd>${escapeHtml(food.pairingTip)}</dd></div>` : ''}
          ${normLang === 'ko' && food.funComment ? `<div class="spec-row"><dt>한줄평</dt><dd>${escapeHtml(food.funComment)}</dd></div>` : ''}
        </dl>
      </div>
      <div class="food-detail-nav">
        <a href="${origin}/gallery?lang=${normLang}" class="btn btn-outline">← ${escapeHtml(t(normLang, 'detailBackBtn') || '도감 둘러보기')}</a>
        <a href="${origin}/?lang=${normLang}" class="btn btn-primary">${escapeHtml(t(normLang, 'brandTitle') || '오늘 뭐 먹지?')}</a>
      </div>
    </article>
  `.trim();

  // hero-current-meal 또는 main 요소 교체
  if (/<section\s+id=["']hero-current-meal["'][^>]*>[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(
      /<section\s+id=["']hero-current-meal["'][^>]*>[\s\S]*?<\/section>/i,
      `<section id="hero-current-meal" class="hero-current-meal-section" aria-label="음식 상세">\n${ssrFoodCardHtml}\n      </section>`
    );
  } else if (/<section\s+id=["']recommendation-root["'][^>]*>[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(
      /<section\s+id=["']recommendation-root["'][^>]*>[\s\S]*?<\/section>/i,
      `<section id="recommendation-root">\n${ssrFoodCardHtml}\n      </section>`
    );
  }

  // Hydration용 데이터 주입
  const initialDataJson = JSON.stringify({
    type: 'food',
    code,
    lang: normLang,
    food: localized,
    rawFood: food
  }).replace(/</g, '\\u003c');
  const initialDataScript = `<script>window.__INITIAL_MUKBANG_DATA__ = ${initialDataJson};</script>`;

  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `  ${initialDataScript}\n</body>`);
  } else {
    html += `\n${initialDataScript}`;
  }

  return html;
}

/**
 * Edge SSR HTML 렌더러 — 음식 이상형 월드컵 (/worldcup, /worldcup/:slug)
 */
export function renderWorldCupSeoHtml(baseHtml, slug = '', lang = 'ko', origin = SITE_ORIGIN) {
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate();

  const normLang = normalizeLang(lang);
  html = localizeStaticShellHtml(html, normLang);
  // Requirement 5: Remove bottom origin-spectrum-section from /worldcup* subpages
  html = html.replace(/<section\s+class=["'][^"']*origin-spectrum-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');
  const langMeta = LANGUAGE_MAP[normLang] || { locale: 'ko-KR' };
  const preset = WORLDCUP_SEO_SLUGS[slug] || WORLDCUP_SEO_SLUGS[''];
  const basePath = preset.slug ? `/worldcup/${preset.slug}` : '/worldcup';

  const titleText = normLang === 'ko' ? preset.koTitle : preset.enTitle;
  const descText = normLang === 'ko' ? preset.koDesc : preset.enDesc;
  const keywordsText = preset.koKeywords || '음식 이상형 월드컵, 점심 고르기, 저녁 메뉴 월드컵, 최악의 음식 월드컵';
  const canonicalUrl = normLang === 'ko' ? `${origin}${basePath}` : `${origin}${basePath}?lang=${normLang}`;
  const ogImageUrl = 'https://img.tellmyname.app/foods/00001.png';

  const hreflangTags = SUPPORTED_LANG_CODES.map((l) => {
    const href = l === 'ko' ? `${origin}${basePath}` : `${origin}${basePath}?lang=${l}`;
    return `<link rel="alternate" hreflang="${l}" href="${href}" />`;
  });
  hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${origin}${basePath}" />`);

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${canonicalUrl}#webapp`,
        'name': titleText,
        'description': descText,
        'url': canonicalUrl,
        'applicationCategory': 'GameApplication',
        'operatingSystem': 'All',
        'inLanguage': normLang
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': normLang === 'ko' ? `${origin}/` : `${origin}/?lang=${normLang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': titleText,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdGraph, null, 2)}\n  </script>`;

  const robotsMetaTag = '<meta name="robots" content="index, follow" />';

  const headElements = [
    `<title>${escapeHtml(titleText)}</title>`,
    robotsMetaTag,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${langMeta.locale ? langMeta.locale.replace('-', '_') : 'ko_KR'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    jsonLdScript
  ];

  html = html.replace(/<html(\s+[^>]*?)?lang=["'][^"']*["']/i, `<html$1lang="${normLang}"`);
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headElements.join('\n  ')}\n</head>`);
  } else {
    html = `<head>\n  ${headElements.join('\n  ')}\n</head>\n` + html;
  }

  // Static SSR SEO fallback content for non-JS crawlers
  const ssrFallback = `<div id="worldcup-view" class="worldcup-view">
      <section class="wc-setup-card">
        <div class="wc-hero-header">
          <h2 class="wc-hero-title">${escapeHtml(titleText)}</h2>
          <p class="wc-hero-desc">${escapeHtml(descText)}</p>
        </div>
        <nav aria-label="음식 이상형 월드컵 카테고리">
          <ul>
            <li><a href="/worldcup/breakfast">오늘의 아침 고르기 이상형 월드컵</a></li>
            <li><a href="/worldcup/lunch">오늘의 점심 고르기 이상형 월드컵</a></li>
            <li><a href="/worldcup/snack">오늘의 간식 고르기 이상형 월드컵</a></li>
            <li><a href="/worldcup/dinner">오늘의 저녁 고르기 이상형 월드컵</a></li>
            <li><a href="/worldcup/night">오늘의 야식 고르기 이상형 월드컵</a></li>
            <li><a href="/worldcup/worst">최악의 음식 뽑기 이상형 월드컵</a></li>
          </ul>
        </nav>
      </section>
    </div>`;
  html = html.replace(/<div id="worldcup-view"[^>]*>[\s\S]*?<\/div>/i, ssrFallback);

  return html;
}

/**
 * Edge SSR HTML 렌더러 — 일러스트 도감 갤러리 (/gallery?lang={lang})
 */
export function renderGallerySeoHtml(baseHtml, lang = 'ko', origin = SITE_ORIGIN) {
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate();

  const normLang = normalizeLang(lang);
  html = localizeStaticShellHtml(html, normLang);
  // Requirement 5: Remove bottom origin-spectrum-section from /gallery subpage
  html = html.replace(/<section\s+class=["'][^"']*origin-spectrum-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');
  const langMeta = LANGUAGE_MAP[normLang] || { locale: 'ko-KR' };

  let titleText;
  let descText;
  if (normLang === 'ko') {
    titleText = '일러스트 도감 401선 · 음식 탐색 및 랜덤 추천 | 오늘 뭐 먹지?';
    descText = '초중고 급식부터 미슐랭 3스타까지 401가지 음식 일러스트 도감을 둘러보고, 카테고리별 랜덤 추천과 고화질 인스타 스토리 공유를 즐겨보세요.';
  } else {
    titleText = 'Food Illustration Gallery (401 Dishes) | Mukbang';
    descText = 'Explore 401 curated food illustrations from school lunches to 3-star Michelin fine dining. Browse, get random dish recommendations, and share to Instagram Story.';
  }

  const keywordsText = `일러스트도감, 음식도감, 401선, 푸드아트, 랜덤음식추천, Mukbang, Gallery`;
  const canonicalUrl = normLang === 'ko' ? `${origin}/gallery` : `${origin}/gallery?lang=${normLang}`;
  const ogImageUrl = 'https://img.tellmyname.app/foods/00001.png';

  // 15 hreflang tags
  const hreflangTags = SUPPORTED_LANG_CODES.map(l =>
    `<link rel="alternate" hreflang="${l}" href="${origin}/gallery?lang=${l}" />`
  );
  hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${origin}/gallery" />`);

  // Schema.org JSON-LD (CollectionPage + BreadcrumbList)
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': titleText,
        'description': descText,
        'inLanguage': normLang
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/?lang=${normLang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Gallery',
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdGraph, null, 2)}\n  </script>`;

  const robotsMetaTag = '<meta name="robots" content="index, follow" />';

  const headElements = [
    `<title>${escapeHtml(titleText)}</title>`,
    robotsMetaTag,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${langMeta.locale ? langMeta.locale.replace('-', '_') : 'ko_KR'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    jsonLdScript
  ];

  const headMetadata = headElements.join('\n  ');

  // <html lang="..."> 교체
  html = html.replace(/<html(\s+[^>]*?)?lang=["'][^"']*["']/i, `<html$1lang="${normLang}"`);

  // 기존 중복 메타 태그 제거
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?window\.__INITIAL_MUKBANG_DATA__[\s\S]*?<\/script>/gi, '');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  } else {
    html = `<head>\n  ${headMetadata}\n</head>\n` + html;
  }

  // Hydration용 데이터 주입
  const initialDataJson = JSON.stringify({
    type: 'gallery',
    lang: normLang
  }).replace(/</g, '\\u003c');
  const initialDataScript = `<script>window.__INITIAL_MUKBANG_DATA__ = ${initialDataJson};</script>`;

  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `  ${initialDataScript}\n</body>`);
  } else {
    html += `\n${initialDataScript}`;
  }


  // Inject 24 real SSR food cards into #gallery-grid and show #gallery-view (hide #daily-view) for Googlebot
  if (typeof ALL_FOODS !== 'undefined' && Array.isArray(ALL_FOODS) && ALL_FOODS.length > 0) {
    const sampleCards = ALL_FOODS.slice(0, 24).map(f => {
      const code = f.code || formatFoodCode(f.index || 1);
      const displayName = normLang === 'ko' ? f.name : (f.englishName || f.name);
      const cal = f.calories ? `🔥 ${escapeHtml(f.calories)}` : '';
      return `<article class="gallery-food-card"><a href="/food/${code}${normLang !== 'ko' ? '?lang=' + normLang : ''}" style="text-decoration:none;color:inherit;display:block;"><div class="gallery-card-thumb-wrap"><img src="https://img.tellmyname.app/foods/${code}.png" alt="${escapeHtml(displayName)}" class="gallery-card-thumb" loading="lazy" width="320" height="240" /><span class="gallery-code-badge">#${code}</span></div><div class="gallery-card-info"><h3 class="gallery-card-title">${escapeHtml(displayName)}</h3><div class="gallery-card-meta"><span>${cal}</span></div></div></a></article>`;
    }).join('\n');
    html = html
      .replace(/<div id="daily-view" class="daily-view">/i, '<div id="daily-view" class="daily-view" style="display:none;">')
      .replace(/<section id="gallery-view" class="gallery-view" style="display:\s*none;">/i, '<section id="gallery-view" class="gallery-view" style="display:flex;">')
      .replace(/<div class="gallery-grid" id="gallery-grid">\s*<!--[\s\S]*?-->\s*<\/div>/i, `<div class="gallery-grid" id="gallery-grid">\n${sampleCards}\n</div>`)
      .replace(/<div id="gallery-grid" class="gallery-grid">\s*<\/div>/i, `<div id="gallery-grid" class="gallery-grid">\n${sampleCards}\n</div>`);
  }


  if (normLang !== 'ko') {
    html = html
      .replace(/<section[^>]*id=["']photodiary-promo-section["'][\s\S]*?<\/section>/i, '')
      .replace(/([A-Za-z0-9가-힣_\s-]+)님의\s*5 Daily Meal Recommendations/g, "$1's 5 Daily Meal Recommendations")
      .replace(/김서윤<\/span>님의/g, "Chloe</span>'s")
      .replace(/<\/span>님의/g, "</span>'s")
      .replace(/김서윤님의/g, "Chloe's")
      .replace(/소개 \(About\)/g, 'About')
      .replace(/문의 \(Contact\)/g, 'Contact')
      .replace(/([A-Za-z]+)님의/g, "$1's")
      .replace(/(\d{1,3}(?:,\d{3})*)원(?:\s*\([^)]*[가-힣][^)]*\))?/g, (_, p) => '$' + Math.max(1, Math.round(parseInt(p.replace(/,/g, ''), 10) / 1350)) + ' USD')
      .replace(/정밀 시간 조절:/g, 'Fine-tune hour:')
      .replace(/아침 추천 시간/g, 'Breakfast time')
      .replace(/점심 추천 시간/g, 'Lunch time')
      .replace(/간식 추천 시간/g, 'Snack time')
      .replace(/저녁 추천 시간/g, 'Dinner time')
      .replace(/야식 추천 시간/g, 'Late-night time')
      .replace(/✅ 원하는 음식만 선택 \(/g, '✅ Selected meals (')
      .replace(/끼\)/g, ')')
      .replace(/언어 선택 \(Language\)/g, 'Language')
      .replace(/추천 끼니/g, 'Recommended meal');
  }

  return html;
}


export default {
  /**
   * Cloudflare Workers fetch 진입점
   * @param {Request} request
   * @param {object} env
   * @param {object} ctx
   */
  async fetch(request, env = {}, ctx = {}) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const origin = (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
      ? url.origin
      : SITE_ORIGIN;

    // CORS Preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Extract path-based language prefix (e.g. /en/... or /ja)
    let effectivePathname = pathname;
    let pathLang = null;
    const pathLangMatch = effectivePathname.match(/^\/([a-z]{2})(?:\/|$)(.*)/i);
    if (pathLangMatch && SUPPORTED_LANG_CODES.includes(pathLangMatch[1].toLowerCase())) {
      pathLang = pathLangMatch[1].toLowerCase();
      effectivePathname = '/' + (pathLangMatch[2] || '');
      if (effectivePathname !== '/') {
        effectivePathname = effectivePathname.replace(/\/+$/, '') || '/';
      }
    }
    const langParam = normalizeLang(url.searchParams.get('lang') || pathLang || 'ko');

    // Method B: /myhome or /myhome/* seamlessly connects to myhome.tellmyname.app
    if (pathname === '/myhome' || pathname.startsWith('/myhome/')) {
      const subPath = pathname.slice('/myhome'.length) || '/';
      return Response.redirect(`https://myhome.tellmyname.app${subPath}${url.search}`, 302);
    }

    if (pathname === '/ads.txt') {
      return new Response('google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // ----------------------------------------------------
    // Route: Sitemaps & robots.txt & IndexNow
    // ----------------------------------------------------
    if (pathname === '/sitemap.xml') {
      return new Response(generateSitemapIndex(origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/sitemap-pages.xml') {
      return new Response(generateSitemapPages(origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/sitemap-foods.xml') {
      return new Response(generateSitemapFoods(origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/sitemap-images.xml') {
      return new Response(generateSitemapImages(origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/sitemap-names.xml') {
      return new Response(generateSitemapNames(origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/robots.txt') {
      return new Response(generateRobotsTxt(origin), {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === `/${INDEXNOW_KEY}.txt`) {
      return new Response(`${INDEXNOW_KEY}\n`, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60'
        }
      });
    }

    // ----------------------------------------------------
    // Route: GET /images/web/:filename (WebP & OG JPG 정적 에셋)
    // ----------------------------------------------------
    if (pathname.startsWith('/images/web/')) {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes && assetRes.ok) return assetRes;
      }
    }

    // ----------------------------------------------------
    // Route 1: GET /images/:filename 및 GET /r2/foods/:filename
    // ----------------------------------------------------
    if (pathname.startsWith('/images/') || pathname.startsWith('/r2/foods/')) {
      if (pathname.startsWith('/images/web/') && env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes && assetRes.ok) {
          const headers = new Headers(assetRes.headers);
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          headers.set('Access-Control-Allow-Origin', '*');
          return new Response(assetRes.body, { status: 200, headers });
        }
      }
      const match = pathname.match(/^\/(?:images(?:\/web)?|r2\/foods)\/(\d{1,5})\.(png|webp|svg|jpg)$/i);
      if (match) {
        const rawNum = parseInt(match[1], 10);
        const ext = match[2].toLowerCase();
        const codeNum = Math.max(1, isNaN(rawNum) ? 1 : rawNum);
        const paddedCode = formatFoodCode(codeNum);

        // 1. Cloudflare R2 버킷 (또는 로컬 모의 R2)에서 원본 고해상도 PNG 우선 확인
        if (env && env.MUKBANG_R2 && typeof env.MUKBANG_R2.get === 'function') {
          try {
            // 원본 고해상도 PNG 경로들 우선 탐색
            const candidateKeys = [
              `foods/${paddedCode}.png`,
              `images/${paddedCode}.png`,
              `${paddedCode}.png`,
              `foods/${paddedCode}.${ext}`,
              `images/${paddedCode}.${ext}`,
              `${paddedCode}.${ext}`,
              `images/web/${paddedCode}.webp`
            ];

            let object = null;
            let detectedContentType = ext === 'webp' ? 'image/webp' : 'image/png';

            for (const key of candidateKeys) {
              object = await env.MUKBANG_R2.get(key);
              if (object) {
                if (key.endsWith('.webp')) detectedContentType = 'image/webp';
                else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) detectedContentType = 'image/jpeg';
                else detectedContentType = 'image/png';
                break;
              }
            }

            if (object) {
              const headers = new Headers();
              headers.set('Content-Type', object.httpMetadata?.contentType || detectedContentType);
              headers.set('Cache-Control', 'public, max-age=31536000, immutable');
              headers.set('Access-Control-Allow-Origin', '*');
              if (object.httpEtag) headers.set('ETag', object.httpEtag);
              return new Response(object.body, { status: 200, headers });
            }
          } catch (_) {
            // R2 조회 실패 시 다음 폴백으로 이동
          }
        }

        // 2. 미생성 상태인 경우: 음식 마스터 데이터 조회 후 손그림 SVG 자동 렌더링
        let targetFood = null;
        if (typeof FOODS_BY_CODE !== 'undefined' && FOODS_BY_CODE) {
          targetFood = FOODS_BY_CODE[paddedCode] || FOODS_BY_CODE[String(codeNum)];
        }
        if (!targetFood && typeof ALL_FOODS !== 'undefined' && Array.isArray(ALL_FOODS)) {
          targetFood = ALL_FOODS.find(f => f.index === codeNum || formatFoodCode(f.index) === paddedCode);
        }

        const foodToRender = targetFood || {
          index: codeNum,
          name: `맛있는 추천 메뉴 #${paddedCode}`,
          englishName: 'Signature Mukbang Delight',
          originGroup: 'KOREAN_POPULAR',
          originBadge: '🍽️ 오늘의 추천 메뉴',
          calories: '맛있으면 0 kcal',
          priceRange: '행복 가득'
        };

        const svg = renderFoodIllustrationSvg(foodToRender);
        return new Response(svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=60',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response('Food image not found', {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // ----------------------------------------------------
    // Route 2: GET /api/recommend (이름 + 날짜 + 타임존 기준 실시간 추천 API)
    // ----------------------------------------------------
    if (pathname === '/api/recommend') {
      const name = url.searchParams.get('name') || '홍길동';
      const dateParam = url.searchParams.get('date');
      const tzParam = url.searchParams.get('tz') || request.cf?.timezone || 'Asia/Seoul';
      const hourParam = url.searchParams.get('hour');
      const capParam = url.searchParams.get('cap');
      const langParam = normalizeLang(url.searchParams.get('lang') || 'ko');

      const localParts = getLocalTimeParts(new Date(), tzParam);
      const effectiveDateStr = (dateParam && String(dateParam).trim()) || localParts.dateStr;
      const effectiveHour = (hourParam !== null && hourParam !== undefined && hourParam !== '')
        ? Math.max(0, Math.min(23, Number(hourParam) || 0))
        : localParts.hour;

      let pools = (typeof POOLS_BY_MEAL !== 'undefined' && POOLS_BY_MEAL) ? POOLS_BY_MEAL : {};
      if (capParam && typeof getPoolsWithCap === 'function') {
        const capNum = parseInt(capParam, 10);
        if (!isNaN(capNum) && capNum > 0) {
          pools = getPoolsWithCap(capNum);
        }
      }

      const activeMeal = resolveActiveMealByHour(effectiveHour);
      const daily = recommendDailyMeals(name, effectiveDateStr, pools);
      const countdown = getRemainingUntilMidnight(localParts);

      // 다국어 로컬라이징 적용
      let localizedMeals = daily.meals;
      let localizedList = daily.orderedList;
      if (langParam !== 'ko') {
        const dict = await getFoodDictionary(langParam, env, request);
        localizedMeals = {};
        for (const [k, slot] of Object.entries(daily.meals)) {
          localizedMeals[k] = {
            ...slot,
            food: localizeFood(slot.food, langParam, dict)
          };
        }
        localizedList = daily.orderedList.map(slot => ({
          ...slot,
          food: localizeFood(slot.food, langParam, dict)
        }));
      }

      const responsePayload = {
        name: daily.name,
        date: effectiveDateStr,
        timeZone: localParts.timeZone,
        hour: effectiveHour,
        currentMealKey: activeMeal.key,
        currentRecommendation: localizedMeals[activeMeal.key],
        orderedMeals: localizedList,
        countdown,
        strokeInfo: daily.strokeInfo,
        lang: langParam
      };

      return new Response(JSON.stringify(responsePayload, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    // ----------------------------------------------------
    // Route 3: GET /api/foods (전체 음식 수 및 카테고리 통계 리포트 API)
    // ----------------------------------------------------
    if (pathname === '/api/foods') {
      const totalCount = (typeof ALL_FOODS !== 'undefined' && Array.isArray(ALL_FOODS)) ? ALL_FOODS.length : 0;
      const stats = (typeof CATEGORY_STATS !== 'undefined' && CATEGORY_STATS) ? CATEGORY_STATS : {};
      return new Response(JSON.stringify({ totalRawFoods: totalCount, categoryStats: stats }, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // dist/index.html SPA 쉘 가져오기 헬퍼
    async function getBaseHtml() {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        try {
          const assetUrl = new URL('/index.html', request.url);
          const assetRes = await env.ASSETS.fetch(new Request(assetUrl.toString()));
          if (assetRes && assetRes.ok) {
            return await assetRes.text();
          }
        } catch (_) {}
      }
      if (typeof process !== 'undefined' && process.versions?.node) {
        try {
          const fs = await import('node:fs');
          const path = await import('node:path');
          const cwd = process.cwd();
          const candidatePaths = [
            path.resolve(cwd, 'dist', 'index.html'),
            path.resolve(cwd, 'web', 'index.html')
          ];
          for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
              return fs.readFileSync(p, 'utf8');
            }
          }
        } catch (_) {}
      }
      return getFallbackHtmlTemplate();
    }

    // ----------------------------------------------------
    // Route 4: GET /food/:code (Edge SSR Food Detail)
    // Supports /{lang}/food/:code or /food/:code?lang={lang}
    // ----------------------------------------------------
    const foodMatch = effectivePathname.match(/^\/food\/(\d{1,5})\/?$/i);
    if (foodMatch) {
      const rawNum = parseInt(foodMatch[1], 10);
      const paddedCode = formatFoodCode(rawNum);
      const food = (typeof FOODS_BY_CODE !== 'undefined' && FOODS_BY_CODE)
        ? (FOODS_BY_CODE[paddedCode] || FOODS_BY_CODE[String(rawNum)])
        : (ALL_FOODS || []).find(f => f.index === rawNum || formatFoodCode(f.index) === paddedCode);

      if (!food) {
        return new Response('Food Not Found', { status: 404 });
      }

      const dict = (langParam !== 'ko') ? await getFoodDictionary(langParam, env, request) : null;
      const baseHtml = await getBaseHtml();
      const html = renderFoodDetailSeoHtml(baseHtml, food, langParam, dict, origin);

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 5: GET /gallery (Edge SSR Gallery Page)
    // Supports /{lang}/gallery or /gallery?lang={lang}
    // ----------------------------------------------------
    if (effectivePathname === '/gallery' || effectivePathname === '/gallery/') {
      const baseHtml = await getBaseHtml();
      const html = renderGallerySeoHtml(baseHtml, langParam, origin);

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 5b: GET /worldcup & /worldcup/:slug (Edge SSR World Cup Page)
    // Supports /{lang}/worldcup/:slug or /worldcup/:slug?lang={lang}
    // ----------------------------------------------------
    const wcRoute = parseWorldCupPath(effectivePathname);
    if (wcRoute.isWorldCup) {
      const baseHtml = await getBaseHtml();
      const html = renderWorldCupSeoHtml(baseHtml, wcRoute.slug, langParam, origin);

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 6: GET /name/:name 및 GET / (Dynamic Edge SSR)
    // Supports /{lang}/name/:name or /{lang} or /?lang={lang}
    // ----------------------------------------------------
    let isNameRoute = false;
    let isHome = false;
    let targetName = '홍길동';

    if (effectivePathname.startsWith('/name/')) {
      const rawName = effectivePathname.slice('/name/'.length);
      try {
        targetName = decodeURIComponent(rawName).trim();
      } catch (_) {
        targetName = rawName.trim();
      }
      if (!targetName) {
        return Response.redirect(new URL('/', request.url).toString(), 302);
      }
      isNameRoute = true;
    } else if (effectivePathname === '/' || effectivePathname === '') {
      targetName = url.searchParams.get('name') || (LOCALIZED_SAMPLE_NAMES[langParam] ? LOCALIZED_SAMPLE_NAMES[langParam][0] : '김서윤');
      isNameRoute = true;
      isHome = !url.searchParams.get('name');
    }

    if (isNameRoute) {
      const dateParam = url.searchParams.get('date');
      const tzParam = url.searchParams.get('tz') || request.cf?.timezone || 'Asia/Seoul';
      const hourParam = url.searchParams.get('hour');
      const capParam = url.searchParams.get('cap');

      const localParts = getLocalTimeParts(new Date(), tzParam);
      const effectiveDateStr = (dateParam && String(dateParam).trim()) || localParts.dateStr;
      const effectiveHour = (hourParam !== null && hourParam !== undefined && hourParam !== '')
        ? Math.max(0, Math.min(23, Number(hourParam) || 0))
        : localParts.hour;

      let pools = (typeof POOLS_BY_MEAL !== 'undefined' && POOLS_BY_MEAL) ? POOLS_BY_MEAL : {};
      if (capParam && typeof getPoolsWithCap === 'function') {
        const capNum = parseInt(capParam, 10);
        if (!isNaN(capNum) && capNum > 0) {
          pools = getPoolsWithCap(capNum);
        }
      }

      const activeMeal = resolveActiveMealByHour(effectiveHour);
      const daily = recommendDailyMeals(targetName, effectiveDateStr, pools);
      const countdown = getRemainingUntilMidnight(localParts);

      // 다국어 로컬라이징 적용
      let localizedMeals = daily.meals;
      let localizedList = daily.orderedList;
      if (langParam !== 'ko') {
        const dict = await getFoodDictionary(langParam, env, request);
        localizedMeals = {};
        for (const [k, slot] of Object.entries(daily.meals)) {
          const locFood = localizeFood(slot.food, langParam, dict);
          localizedMeals[k] = {
            ...slot,
            food: {
              ...locFood,
              rawName: slot.food.name
            }
          };
        }
        localizedList = daily.orderedList.map(slot => {
          const locFood = localizeFood(slot.food, langParam, dict);
          return {
            ...slot,
            food: {
              ...locFood,
              rawName: slot.food.name
            }
          };
        });
      }

      const ssrPayload = {
        name: daily.name,
        date: effectiveDateStr,
        timeZone: localParts.timeZone,
        hour: effectiveHour,
        currentMealKey: activeMeal.key,
        currentRecommendation: localizedMeals[activeMeal.key],
        orderedMeals: localizedList,
        countdown,
        strokeInfo: daily.strokeInfo,
        lang: langParam,
        isHome
      };

      const baseHtml = await getBaseHtml();
      const html = renderMukbangSeoHtml(baseHtml, ssrPayload, origin);

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 7: 정적 자산(Static Assets) 서빙 폴백
    // ----------------------------------------------------
        // Return true HTTP 404 (no AdSense code, noindex) for unknown non-file paths instead of SPA Soft-404
    const hasFileExt = /\.[a-z0-9]{1,8}$/i.test(pathname);
    if (!hasFileExt) {
      return createClean404Response(pathname);
    }
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return await env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
