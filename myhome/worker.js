// worker.js — Cloudflare Edge Dynamic SSR Router & Same-Domain R2 Handler
// myhome.tellmyname.app (Zero-File-Explosion Dynamic Edge SSR with 14-Language Support & Image SEO)

import { SITE_ORIGIN, MIN_LEVEL, MAX_LEVEL, GOOD_HOUSE_THRESHOLD } from './src/lib/constants.js';
import { analyzeNameToHouse } from './src/lib/hash.js';
import { getHouseConceptByLevel } from './src/lib/taxonomy.js';
import { renderHouseArtworkSvg } from './src/lib/gemini_client.js';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  UI_DICTIONARY,
  getTranslation,
  localizeHouse,
  getWorldCupTranslation
} from './src/lib/i18n.js';
import { getSitemapNameForLevel } from './src/lib/level_name_map.js';
import { renderCrossLevelSectionHtml } from './src/lib/cross_level_map.js';


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


/**
 * HTML 특수 문자 이스케이프 유틸리티
 */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 기본 Fallback HTML 템플릿 (env.ASSETS 미제공 또는 로컬 테스트 시 사용)
 */
function getFallbackHtmlTemplate(lang = 'ko') {
  const dict = UI_DICTIONARY[lang] || UI_DICTIONARY['ko'];
  const headerBrand = dict.brandHeader || '나에게 어울리는 집';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />
  <meta name="yandex-verification" content="05d40864cd87eefe" />
  <meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />
  <title>${escapeHtml(headerBrand)} | MyHome</title>
</head>
<body>
  <div id="app">
    <header class="site-header">
      <a href="/" class="site-logo">${escapeHtml(headerBrand)}</a>
    </header>
    <main class="main-container">
      <section id="card-root"></section>
    </main>
  </div>
</body>
</html>`;
}

/**
 * Localizes static Korean shell text in index.html during SSR when selectedLang !== 'ko'
 */
function localizeStaticShellHtml(html, selectedLang, dict) {
  if (selectedLang === 'ko') return html;

  const replaceById = (id, newInnerHtml) => {
    if (newInnerHtml === undefined || newInnerHtml === null) return;
    const regex = new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bid=["']${id}["'][^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i');
    html = html.replace(regex, `$1${newInnerHtml}$3`);
  };

  const foodLabel = dict.foodLink || 'What to Eat Today?';
  replaceById('photodiary-text', escapeHtml(foodLabel));
  replaceById('footer-link-food', `🍱 ${escapeHtml(foodLabel)}`);
  const pdHref = selectedLang && selectedLang !== 'ko'
    ? `https://food.tellmyname.app/?lang=${escapeHtml(selectedLang)}`
    : 'https://food.tellmyname.app/';
  html = html.replace(/id="photodiary-link"\s+href="[^"]*"/g, `id="photodiary-link" href="${pdHref}"`);
  html = html.replace(/id="footer-link-food"\s+href="[^"]*"/g, `id="footer-link-food" href="${pdHref}"`);
  replaceById('header-brand-text', escapeHtml(dict.brandHeader || 'The House That Suits You'));
  replaceById('label-search-btn', escapeHtml(dict.searchBtn || 'Find My House'));
  replaceById('label-sample-chips', escapeHtml(dict.sampleLabel || 'Trending Names:'));
  replaceById('return-house-text', escapeHtml(dict.returnMyHouseDefault || 'Return to My House'));

  // Explorer & Scroll Preview (even though hidden, ensure 0 Hangul in DOM)
  replaceById('label-btn-prev', escapeHtml(dict.prevHouseBtn || 'Previous'));
  replaceById('label-btn-random', escapeHtml(dict.randomHouseBtn || 'Random'));
  replaceById('label-btn-next', escapeHtml(dict.nextHouseBtn || 'Next'));
  replaceById('dock-keyboard-hint', escapeHtml(dict.dockKeyboardHint || ''));
  replaceById('scroll-preview-title', escapeHtml(dict.scrollPreviewTitle || 'House List by Level'));
  replaceById('scroll-preview-subtitle', escapeHtml(dict.scrollPreviewSubtitle || ''));
  replaceById('filter-btn-all', escapeHtml(dict.scrollFilterAll || 'All (0~999)'));
  replaceById('filter-btn-bad', escapeHtml(dict.scrollFilterBad || '💀 Doom (Lv.0~499)'));
  replaceById('filter-btn-good', escapeHtml(dict.scrollFilterGood || '🌟 Jackpot (Lv.500~999)'));
  replaceById('filter-btn-real', escapeHtml(dict.scrollFilterReal || '🏛️ Real 50%'));
  replaceById('filter-btn-fiction', escapeHtml(dict.scrollFilterFiction || '🦄 Fiction 50%'));

  // Guide
  if (dict.guide) {
    replaceById('guide-section-title', escapeHtml(dict.guide.sectionTitle));
    replaceById('guide-bad-badge', escapeHtml(dict.guide.badBadge));
    replaceById('guide-bad-title', escapeHtml(dict.guide.badTitle));
    replaceById('guide-bad-desc', escapeHtml(dict.guide.badDesc));
    replaceById('guide-good-badge', escapeHtml(dict.guide.goodBadge));
    replaceById('guide-good-title', escapeHtml(dict.guide.goodTitle));
    replaceById('guide-good-desc', escapeHtml(dict.guide.goodDesc));
    replaceById('guide-rule-badge', escapeHtml(dict.guide.ruleBadge));
    replaceById('guide-rule-title', escapeHtml(dict.guide.ruleTitle));
    replaceById('guide-rule-desc', dict.guide.ruleDesc);
  }

  // Whitepaper
  if (dict.whitepaper) {
    replaceById('wp-tag', escapeHtml(dict.whitepaper.tag));
    replaceById('wp-main-title', escapeHtml(dict.whitepaper.mainTitle));
    replaceById('wp-art1-title', escapeHtml(dict.whitepaper.art1Title));
    replaceById('wp-art1-p1', escapeHtml(dict.whitepaper.art1P1));
    replaceById('wp-art1-p2', escapeHtml(dict.whitepaper.art1P2));
    replaceById('wp-art2-title', escapeHtml(dict.whitepaper.art2Title));
    replaceById('wp-art2-p1', escapeHtml(dict.whitepaper.art2P1));
    replaceById('wp-art2-p2', escapeHtml(dict.whitepaper.art2P2));
    replaceById('wp-art3-title', escapeHtml(dict.whitepaper.art3Title));
    replaceById('wp-art3-p1', escapeHtml(dict.whitepaper.art3P1));
    replaceById('wp-art3-p2', escapeHtml(dict.whitepaper.art3P2));
  }

  // Footer & Loading
  if (dict.footer) {
    replaceById('footer-brand-text', escapeHtml(dict.footer.brand));
    replaceById('footer-link-about', escapeHtml(dict.footer.about));
    replaceById('footer-link-contact', escapeHtml(dict.footer.contact));
    replaceById('footer-link-privacy', escapeHtml(dict.footer.privacy));
    replaceById('footer-link-terms', escapeHtml(dict.footer.terms));
    replaceById('footer-link-consent', escapeHtml(dict.footer.consent));
    replaceById('footer-desc-text', escapeHtml(dict.footer.desc));
  }
  replaceById('loading-status-text', escapeHtml(dict.loadingText || 'Loading...'));

  // Localize sample chips in SSR HTML
  const langInfo = LANGUAGE_MAP[selectedLang] || LANGUAGE_MAP['en'];
  const sampleNames = langInfo?.sampleNames || ['Chloe', 'Emma', 'Olivia', 'Liam', 'Noah'];
  const sampleChipsHtml = sampleNames.map(n => {
    const lv = analyzeNameToHouse(n).level;
    return `<button type="button" class="sample-chip" data-name="${escapeHtml(n)}">${escapeHtml(n)} (Lv.${lv})</button>`;
  }).join('\n              ');
  replaceById('sample-chips', `\n              ${sampleChipsHtml}\n            `);

  // Replace Korean attributes in shell HTML
  html = html
    .replace(/placeholder="이름을 입력하세요[^"]*"/g, `placeholder="${escapeHtml(dict.searchPlaceholder || 'Enter your name...')}"`)
    .replace(/aria-label="감정받을 이름 입력"/g, `aria-label="${escapeHtml(dict.nameInputAria || 'Enter a name')}"`)
    .replace(/aria-label="언어 변경"/g, `aria-label="${escapeHtml(dict.langSelectLabel || 'Change Language')}"`)
    .replace(/title="오늘 뭐 먹지\? 바로가기"/g, `title="${escapeHtml(dict.foodTitle || 'What to Eat Today?')}"`)
    .replace(/title="🎲 주사위 굴려 무작위 이름 보기"/g, `title="${escapeHtml(dict.randomDiceTitle || 'Random Name')}"`)
    .replace(/aria-label="랜덤 이름 검색"/g, `aria-label="${escapeHtml(dict.randomDiceTitle || 'Random Name')}"`)
    .replace(/aria-label="검색"/g, `aria-label="${escapeHtml(dict.searchBtn || 'Search')}"`)
    .replace(/aria-label="샘플 이름 바로가기"/g, `aria-label="Sample Names"`)
    .replace(/title="새로운 추천 이름 뽑기"/g, `title="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="추천 이름 새로고침"/g, `aria-label="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="단계 탐색 네비게이션"/g, `aria-label="Level Explorer"`)
    .replace(/title="이전 단계 집 보기[^"]*"/g, `title="${escapeHtml(dict.prevHouseBtn || 'Previous')}"`)
    .replace(/title="랜덤 집 보기[^"]*"/g, `title="${escapeHtml(dict.randomHouseBtn || 'Random')}"`)
    .replace(/title="다음 단계 집 보기[^"]*"/g, `title="${escapeHtml(dict.nextHouseBtn || 'Next')}"`)
    .replace(/aria-label="단계별 건축물 텍스트 미리보기 탐색기"/g, `aria-label="House Explorer"`)
    .replace(/aria-label="다중우주 부동산 감정원 공식 시스템 해설서"/g, `aria-label="Official Whitepaper"`)
    .replace(/content="MyHome — 다중우주 부동산·건축 감정원"/g, `content="MyHome — Multiverse Architectural Appraisal Institute"`);

  // Mark selected language option in <select id="lang-select">
  html = html.replace(/<option value="ko" selected>/i, '<option value="ko">');
  html = html.replace(new RegExp(`<option value="${selectedLang}">`, 'i'), `<option value="${selectedLang}" selected>`);


  // Complete SSR non-Korean localization (0 Korean leaks for Googlebot / ?lang=en)
  html = html.replace(/<section[^>]*id=[\"']photodiary-promo-section[\"'][\s\S]*?<\/section>/i, '');
  const _enReplacements = [
    ['내 집 찾기', 'Find My Home'],
    ['내 직업 찾기', 'Find My Job'],
    ['내 자동차 찾기', 'Find My Car'],
    ['최악 중 최선 월드컵', 'Best of the Worst'],
    ['최선 중 최악 월드컵', 'Worst of the Best'],
    ['내 원래 집으로 돌아가기', 'Return to My House'],
    ['내 원래 직업으로 돌아가기', 'Return to My Job'],
    ['내 원래 자동차로 돌아가기', 'Return to My Car'],
    ['TellMyName 허브', 'TellMyName Home'],
    ['오늘 뭐 먹지?', 'Daily Food'],
    ['포토 다이어리', 'PhotoDiary'],
    ['서비스 소개', 'About'],
    ['개인정보처리방침', 'Privacy Policy'],
    ['이용약관', 'Terms'],
    ['문의하기', 'Contact'],
    ['추천 이름:', 'Trending:'],
    ['인기 이름:', 'Trending:'],
    ['랜덤 집 보기', 'Random House'],
    ['랜덤 직업 보기', 'Random Job'],
    ['랜덤 자동차 보기', 'Random Car'],
    ['이전 단계 집 보기', 'Previous Level'],
    ['다음 단계 집 보기', 'Next Level'],
    ['이전 단계 직업 보기', 'Previous Level'],
    ['다음 단계 직업 보기', 'Next Level'],
    ['이전 단계 자동차 보기', 'Previous Level'],
    ['다음 단계 자동차 보기', 'Next Level'],
    ['결과 링크 복사', 'Copy Link'],
    ['인스타 스토리 / 카톡 공유 카드 만들기', 'Create Share Card'],
    ['이름을 입력하세요 (예: 김서윤, Chloe, 陽翔...)', 'Enter a name (e.g., Chloe, Emma, Liam...)'],
    ['이름을 입력하세요 (예: 김서윤, 박대기, 홍길동, Steve...)', 'Enter a name (e.g., Chloe, Emma, Liam...)'],
    ['이름을 입력하세요 (예: 김서윤, 해리포터, 홍길동, Steve...)', 'Enter a name (e.g., Chloe, Emma, Liam...)'],
    ['키보드 좌우 방향키(← / →)로 단계 이동, 스페이스바(Space)로 랜덤 탐색할 수 있습니다.', 'Use arrow keys (← / →) to browse levels or Space for random.']
  ];
  for (const [koStr, enStr] of _enReplacements) {
    if (html.includes(koStr)) html = html.split(koStr).join(enStr);
  }
  // Translate whitepaper article 4 if Korean remains in SSR
  html = html.replace(
    /<article[^>]*>[\s\S]*?4\.\s*내가 좋아하는 집은\?[\s\S]*?<\/article>/i,
    '<article class="seo-article"><h3>4. Which House Would You Pick? Ideal Type World Cup</h3><p>Compare 1,000 houses head-to-head in two tournament modes: <strong>Best of the Worst</strong> (pick the most livable spot among Lv.0–499 extreme shelters) and <strong>Worst of the Best</strong> (eliminate the most overwhelming option among Lv.500–999 dream landmarks).</p></article>'
  );
  // Translate any remaining Korean aria-labels or titles in static shell
  html = html.replace(/aria-label="[^"]*[가-힣][^"]*"/g, 'aria-label="Navigation"');
  html = html.replace(/title="[^"]*[가-힣][^"]*"/g, '');

  return html;
}

/**
 * Edge SSR HTML 렌더러
 * baseHtml 내의 <head> 및 <section id="card-root">에 실시간 동적 SEO/OG/Schema.org/SSR 마크업 주입
 *
 * @param {string} baseHtml - dist/index.html 기본 SPA 쉘
 * @param {object} house - 감정서 및 상세 스펙 데이터 객체
 * @param {string|null} nameQuery - 감정 대상 이름 (없으면 null)
 * @param {string} origin - 사이트 오리진 (기본값 SITE_ORIGIN)
 * @param {string} lang - 타겟 언어 코드 (기본값 'ko')
 * @returns {string} 완성된 완전 SSR HTML
 */
export function renderSeoHtml(baseHtml, house, nameQuery, origin = SITE_ORIGIN, lang = 'ko', isRoot = false) {
  const selectedLang = LANGUAGE_MAP[lang] ? lang : 'ko';
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const effectiveName = nameQuery || house.name || house.cleanName || null;
  const levelNum = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(house.level) || 0)));
  const padded = String(levelNum).padStart(5, '0');
  const ogImageUrl = `${origin}/r2/houses/${padded}.webp`;

  // Consolidate canonical URL to /level/:level for all subpages (eliminates 50k /name/ duplicate doorway pages)
  const baseCanonicalUrl = isRoot
    ? `${origin}/`
    : `${origin}/level/${levelNum}`;
  const isNameRoute = Boolean(effectiveName && !isRoot);

  const isKorean = selectedLang === 'ko';
  const canonicalUrl = isKorean ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${selectedLang}`;
  const ogUrl = isRoot
    ? canonicalUrl
    : (effectiveName
        ? (isKorean ? `${origin}/name/${encodeURIComponent(effectiveName)}` : `${origin}/name/${encodeURIComponent(effectiveName)}?lang=${selectedLang}`)
        : canonicalUrl);
  const ogLocale = (LANGUAGE_MAP[selectedLang]?.locale || 'ko-KR').replace('-', '_');
  const displayHouse = isKorean ? house : localizeHouse(house, selectedLang, effectiveName);
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];

  // <html lang="..."> 동적 동기화
  if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(selectedLang)}">`);
  }

  // Localize static shell HTML when selectedLang !== 'ko'
  if (!isKorean) {
    html = localizeStaticShellHtml(html, selectedLang, dict);
  }

  // Requirement 5: Remove bottom guide & whitepaper from all subpages (/level/:level, /name/:name);
  // keep it ONLY on the initial root screen (isRoot === true)
  if (!isRoot) {
    html = html.replace(/<section\s+class=["'][^"']*service-guide-section[^"']*["'][^>]*>[\s\S]*?<\/section>\s*(?=\s*<!--\s*Footer|<footer)/i, '');
  }

  // Cache-busting query string for static CSS/JS assets so browsers always load latest localized bundles
  html = html
    .replace(/href="\/css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261125"')
    .replace(/href="\/css\/share\.css(\?[^"]*)?"/g, 'href="/css/share.css?v=20261125"')
    .replace(/src="\/js\/consent\.js(\?[^"]*)?"/g, 'src="/js/consent.js?v=20261125"')
    .replace(/src="\/js\/app\.js(\?[^"]*)?"/g, 'src="/js/app.js?v=20261125"');

  // Title:
  // 한국어(기본값)일 때 기존 테스트 호환성을 100% 엄격 보장
  const titleText = isRoot
    ? (isKorean
        ? '나에게 어울리는 집 - 이름만 입력해서 찾는 재미로 보는 집 테스트'
        : `${dict.brandHeader || 'The House That Suits You'} (MyHome) — ${dict.brandSub || 'Fun Name-Based House Matching Test'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 집 (Lv.${levelNum}) — ${house.title} | 나에게 어울리는 집`
            : `Lv.${levelNum} ${house.title} | 나에게 어울리는 집`)
        : (effectiveName
            ? `${dict.ownerTitle ? dict.ownerTitle.replace('{name}', effectiveName) : `The House That Suits ${effectiveName}`}: ${displayHouse.title} (Lv.${levelNum}) | ${dict.brandHeader || 'MyHome'}`
            : `Lv.${levelNum} ${displayHouse.title} | ${dict.brandHeader || 'MyHome'}`));

  // Meta Description (Clean, natural description without English keyword stuffing)
  const descText = isRoot
    ? (isKorean
        ? '이름만 입력하면 나에게 어울리는 집을 바로 찾을 수 있어요! 0단계부터 999단계까지 재미로 보는 내 집 찾기 테스트를 지금 해보세요.'
        : `${dict.footer?.desc || 'Just enter your name to find the house that suits you! Fun house matching test from Level 0 to Level 999.'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 집은 Lv.${levelNum} [${house.title}]입니다. (건축연도: ${house.builtYear} / 추산 가치: ${house.estimatedValue} / 특별한 기능: ${house.specialFeature})`
            : `Lv.${levelNum} [${house.title}] (${house.zoneLabel} · ${house.realityLabel}). 건축연도: ${house.builtYear} / 추산 가치: ${house.estimatedValue} / 특별한 기능: ${house.specialFeature} ${house.aiVerdict || ''}`)
        : (effectiveName
            ? `${displayHouse.title} (${displayHouse.zoneLabel}, ${displayHouse.realityLabel}). ${dict.specs?.builtYearLabel || 'Year Built'}: ${displayHouse.builtYear} / ${dict.specs?.estimatedValueLabel || 'Estimated Value'}: ${displayHouse.estimatedValue} / ${dict.specs?.specialFeatureLabel || 'Special Feature'}: ${displayHouse.specialFeature}`
            : `Lv.${levelNum} [${displayHouse.title}] (${displayHouse.zoneLabel}, ${displayHouse.realityLabel}). ${displayHouse.builtYear} / ${displayHouse.estimatedValue} / ${displayHouse.specialFeature} ${displayHouse.aiVerdict || ''}`));

  // Keywords
  const keywordsText = isRoot
    ? (isKorean
        ? '나에게 어울리는 집, 나에게어울리는집, 이름으로 찾는 집, 재미로 보는 집 테스트, 집 이상형 월드컵, 좋은 집 이상형 월드컵, 나쁜 집 이상형 월드컵, 내가 좋아하는 집은, 폭망 하우스 월드컵, 대박 하우스 월드컵, MyHome, 내 집 찾기 테스트'
        : 'The House That Suits You, MyHome, name house test, fun house quiz, house recommendation, house tournament, best house world cup')
    : (isKorean
        ? `Lv.${levelNum}, ${house.title}, ${house.categoryLabel || ''}, 나에게 어울리는 집, MyHome`
        : `Lv.${levelNum}, ${displayHouse.title}, ${displayHouse.categoryLabel || ''}, MyHome`);

  // 14개 언어 hreflang 태그 + x-default (baseCanonicalUrl 기준 상호 참조)
  const hreflangTags = SUPPORTED_LANGUAGES.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${l.code === 'ko' ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${l.code}`}" />`
  ).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${baseCanonicalUrl}" />`;

  // Google AdSense 태그 (자동 주입)
  const adsenseTag = /<script[^>]*adsbygoogle\.js/i.test(baseHtml) ? '' : '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>';

  // Schema.org JSON-LD (@graph: WebPage, Residence, ImageObject, FAQPage)
  const imageObjectNode = {
    '@type': 'ImageObject',
    '@id': `${canonicalUrl}#image`,
    'contentUrl': ogImageUrl,
    'url': ogImageUrl,
    'name': `Lv.${levelNum} ${displayHouse.title}`,
    'caption': isKorean
      ? `Lv.${levelNum} ${house.title} — ${house.specialFeature || ''}`
      : `Lv.${levelNum} ${displayHouse.title} — ${displayHouse.specialFeature || ''}`,
    'representativeOfPage': true
  };

  const faqEntity = [
    {
      '@type': 'Question',
      'name': isKorean ? '언제 지어진 집인가요?' : (dict.specs?.builtYearLabel ? `${dict.specs.builtYearLabel}?` : 'When was this house built?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayHouse.builtYear)
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '추산 가치는 얼마인가요?' : (dict.specs?.estimatedValueLabel ? `${dict.specs.estimatedValueLabel}?` : 'What is the estimated value?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayHouse.estimatedValue)
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '특별한 기능은 무엇인가요?' : (dict.specs?.specialFeatureLabel ? `${dict.specs.specialFeatureLabel}?` : 'What is the special feature?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayHouse.specialFeature)
      }
    }
  ];

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': titleText,
        'description': descText,
        'inLanguage': isKorean ? 'ko-KR' : (LANGUAGE_MAP[selectedLang]?.locale || 'en-US')
      },
      {
        '@type': 'Residence',
        '@id': `${canonicalUrl}#residence`,
        'name': displayHouse.title,
        'description': `${displayHouse.specialFeature || ''} ${displayHouse.aiVerdict || ''}`.trim(),
        'image': ogImageUrl,
        'disambiguatingDescription': `Level ${levelNum} (${displayHouse.tierName || ''})`,
        'additionalProperty': [
          {
            '@type': 'PropertyValue',
            'name': isKorean ? '건축연도' : (dict.specs?.builtYearLabel || 'Year Built'),
            'value': String(displayHouse.builtYear)
          },
          {
            '@type': 'PropertyValue',
            'name': isKorean ? '추산가치' : (dict.specs?.estimatedValueLabel || 'Estimated Value'),
            'value': String(displayHouse.estimatedValue)
          },
          {
            '@type': 'PropertyValue',
            'name': isKorean ? '특별기능' : (dict.specs?.specialFeatureLabel || 'Special Feature'),
            'value': String(displayHouse.specialFeature)
          }
        ]
      },
      imageObjectNode,
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        'mainEntity': faqEntity
      }
    ]
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdGraph, null, 2)}\n  </script>`;

  const robotsMetaTag = isNameRoute
    ? '<meta name="robots" content="noindex, follow" />'
    : '<meta name="robots" content="index, follow" />';

  const headElements = [
    `<title>${escapeHtml(titleText)}</title>`,
    robotsMetaTag,
    `<meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />`,
    `<meta name="yandex-verification" content="05d40864cd87eefe" />`,
    `<meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />`,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    hreflangTags,
    `<meta property="og:type" content="${isRoot ? 'website' : 'article'}" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:url" content="${ogUrl}" />`,
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(dict.brandHeader || '나에게 어울리는 집 (MyHome)')}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    adsenseTag,
    jsonLdScript
  ];

  const headMetadata = headElements.join('\n  ');

  // 중복 태그 제거
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']naver-site-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']yandex-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']msvalidate\.01["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?window\.__INITIAL_HOUSE_DATA__[\s\S]*?<\/script>/gi, '');

  // <head> 내부에 메타데이터 주입
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  } else {
    html = `<head>\n  ${headMetadata}\n</head>\n` + html;
  }

  // 검색 로봇(네이버 Yeti, 구글봇)이 JS 실행 없이 100% 인덱싱하는 시맨틱 SSR 아티클
  const imgAltText = isKorean
    ? `Lv.${levelNum} ${house.title} (${house.categoryLabel || ''})`
    : `Lv.${levelNum} ${displayHouse.title} (${displayHouse.categoryLabel || ''})`;
  const imgTitleText = `Lv.${levelNum} ${displayHouse.title}`;

  const articleHtml = [
    `<article class="seo-house-ssr" data-level="${levelNum}">`,
    `  <header class="seo-house-header">`,
    `    <div class="seo-badges">`,
    `      <span class="seo-badge seo-badge-tier">${escapeHtml(displayHouse.tierName || `Tier ${displayHouse.tier}`)}</span>`,
    `      <span class="seo-badge seo-badge-zone">${escapeHtml(displayHouse.zoneLabel || (levelNum >= GOOD_HOUSE_THRESHOLD ? '대박 하우스' : '폭망 하우스'))}</span>`,
    `      <span class="seo-badge seo-badge-reality">${escapeHtml(displayHouse.realityLabel || (levelNum % 2 === 0 ? '실제 존재하는 건축물·사물' : '허구·상상 속 건축물·사물'))}</span>`,
    `      <span class="seo-badge seo-badge-level">Lv.${levelNum}</span>`,
    `    </div>`,
    `    <h1 class="seo-house-title">${effectiveName ? `<span class="seo-owner">${escapeHtml(effectiveName)}${isKorean ? '님에게 어울리는 집: ' : ': '}</span>` : ''}${escapeHtml(displayHouse.title)}</h1>`,
    `    <p class="seo-house-category">${escapeHtml(displayHouse.categoryEmoji || '')} ${escapeHtml(displayHouse.categoryLabel || '')}</p>`,
    `  </header>`,
    `  <figure class="seo-house-figure">`,
    `    <img src="${ogImageUrl}" alt="${escapeHtml(imgAltText)}" title="${escapeHtml(imgTitleText)}" width="600" height="600" loading="eager" />`,
    `    <figcaption class="seo-house-caption">Lv.${levelNum} — ${escapeHtml(displayHouse.title)}</figcaption>`,
    `  </figure>`,
    `  <section class="seo-house-specs">`,
    `    <h2>${isKorean ? '부동산 감정서 및 상세 스펙' : escapeHtml(dict.storySpecTitle || 'Architectural Specifications')}</h2>`,
    `    <dl class="specs-grid">`,
    `      <div class="spec-item">`,
    `        <dt>${isKorean ? '건축연도' : escapeHtml(dict.specs?.builtYearLabel || 'Year Built')}</dt>`,
    `        <dd class="spec-built-year">${escapeHtml(displayHouse.builtYear)}</dd>`,
    `      </div>`,
    `      <div class="spec-item">`,
    `        <dt>${isKorean ? '추산 가치' : escapeHtml(dict.specs?.estimatedValueLabel || 'Estimated Value')}</dt>`,
    `        <dd class="spec-estimated-value">${escapeHtml(displayHouse.estimatedValue)}</dd>`,
    `      </div>`,
    `      <div class="spec-item">`,
    `        <dt>${isKorean ? '특별한 기능' : escapeHtml(dict.specs?.specialFeatureLabel || 'Special Feature')}</dt>`,
    `        <dd class="spec-special-feature">${escapeHtml(displayHouse.specialFeature)}</dd>`,
    `      </div>`,
    displayHouse.aiVerdict ? [
      `      <div class="spec-item spec-ai-verdict-box">`,
      `        <dt>${isKorean ? 'AI 감정 총평' : escapeHtml(dict.specs?.aiVerdictLabel || 'AI Appraiser Verdict')}</dt>`,
      `        <dd class="spec-ai-verdict">${escapeHtml(displayHouse.aiVerdict)}</dd>`,
      `      </div>`
    ].join('\n') : '',
    `    </dl>`,
    `  </section>`,
    `</article>`
  ].filter(Boolean).join('\n');

  const crossSectionHtml = renderCrossLevelSectionHtml(levelNum, effectiveName, selectedLang, 'myhome', MAX_LEVEL);

  // <section id="card-root"> 내부에 시맨틱 아티클 + 다른 세계관 Lv.N 상호참조 주입
  if (/<section\s+id=["']card-root["'][^>]*>[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(
      /<section\s+id=["']card-root["'][^>]*>[\s\S]*?<\/section>/i,
      `<section id="card-root">\n${articleHtml}\n${crossSectionHtml}\n    </section>`
    );
  } else if (/<main[^>]*>[\s\S]*?<\/main>/i.test(html)) {
    html = html.replace(
      /<main([^>]*)>([\s\S]*?)<\/main>/i,
      `<main$1>\n      <section id="card-root">\n${articleHtml}\n${crossSectionHtml}\n      </section>\n$2</main>`
    );
  } else if (/<body[^>]*>/i.test(html)) {
    html = html.replace(
      /<body([^>]*)>/i,
      `<body$1>\n  <section id="card-root">\n${articleHtml}\n${crossSectionHtml}\n  </section>`
    );
  } else {
    html += `\n<section id="card-root">\n${articleHtml}\n${crossSectionHtml}\n</section>`;
  }

  // SPA 즉시 수화(Hydration)를 위한 초기 데이터 스크립트 주입
  // Note: when selectedLang !== 'ko', remove Korean-only fields from hydration payload so zero Hangul exists in HTML source
  const initialData = isKorean
    ? { ...displayHouse, _lang: selectedLang }
    : {
        level: displayHouse.level,
        tier: displayHouse.tier,
        tierName: displayHouse.tierName,
        zone: displayHouse.zone,
        zoneLabel: displayHouse.zoneLabel,
        realityType: displayHouse.realityType,
        realityLabel: displayHouse.realityLabel,
        category: displayHouse.category,
        categoryLabel: displayHouse.categoryLabel,
        categoryEmoji: displayHouse.categoryEmoji,
        title: displayHouse.title,
        builtYear: displayHouse.builtYear,
        estimatedValue: displayHouse.estimatedValue,
        specialFeature: displayHouse.specialFeature,
        aiVerdict: displayHouse.aiVerdict,
        imageUrl: displayHouse.imageUrl,
        ogImageUrl: displayHouse.ogImageUrl,
        name: effectiveName && !/[가-힣]/.test(effectiveName) ? effectiveName : undefined,
        cleanName: effectiveName && !/[가-힣]/.test(effectiveName) ? effectiveName : undefined,
        strokes: displayHouse.strokes,
        totalStrokes: displayHouse.totalStrokes,
        _lang: selectedLang
      };
  const initialDataJson = JSON.stringify(initialData).replace(/</g, '\\u003c');
  const initialDataScript = `<script>window.__INITIAL_HOUSE_DATA__ = ${initialDataJson};</script>`;

  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `  ${initialDataScript}\n</body>`);
  } else {
    html += `\n${initialDataScript}`;
  }


  // Edge AdSense Policy Safety Gate: never serve AdSense script on sensitive/disaster/gambling pages
  if (/(?:보팔|굴라그|후쿠시마|체르노빌|아오키가하라|사형수|처형|도살장|살인 현장|베이루트|카지노|고문실|참수대|강제 수용소|Bhopal|Gulag|Fukushima|Chernobyl|Aokigahara|Death Row|Execution|Slaughterhouse|Beirut|Casino|Torture)/i.test(html)) {
    html = html.replace(/<script[^>]*adsbygoogle\.js[^>]*><\/script>/gi, '');
  }

  return html;
}

/**
 * 집 이상형 월드컵 전용 SEO SSR HTML 생성 (/worldcup, /worldcup/worst-to-best, /worldcup/best-to-worst)
 */
export function renderWorldCupSeoHtml(baseHtml, mode = 'worst-to-best', origin = SITE_ORIGIN, lang = 'ko') {
  const selectedLang = LANGUAGE_MAP[lang] ? lang : 'ko';
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const seoConfigs = {
    'overview': {
      path: '/worldcup',
      title: '집 이상형 월드컵 - 내가 좋아하는 집은? 좋은 집·나쁜 집 월드컵 | MyHome',
      desc: '내가 좋아하는 집은 어떤 집일까? 16강·32강·64강·128강·256강 토너먼트로 즐기는 좋은 집 이상형 월드컵(최선 중 최악)과 나쁜 집 이상형 월드컵(최악 중 최선)을 지금 해보세요!',
      keywords: '집 이상형 월드컵, 내가 좋아하는 집은, 좋은 집 이상형 월드컵, 나쁜 집 이상형 월드컵, 32강 집 월드컵, 64강 집 월드컵, 128강 집 월드컵, 부동산 이상형 월드컵, MyHome',
      ogImg: `${origin}/r2/houses/00512.webp`,
      headline: '🏆 집 이상형 월드컵 — 내가 좋아하는 집은?',
      faqQ: '집 이상형 월드컵에서는 어떤 모드를 플레이할 수 있나요?',
      faqA: 'Lv.0~499 나쁜 집(폭망 하우스) 중 최선의 집을 뽑는 월드컵과 Lv.500~999 좋은 집(대박 하우스) 중 최악의 집을 뽑는 월드컵 두 가지를 16강·32강·64강·128강·256강으로 즐길 수 있습니다.'
    },
    'worst-to-best': {
      path: '/worldcup/worst-to-best',
      title: '나쁜 집 이상형 월드컵 (최악 중 최선 뽑기) - 32강·64강·128강 | MyHome',
      desc: 'Lv.0~499 최악의 폭망 하우스 500종 중에서 그나마 살 만한 최선의 집을 뽑아보세요! 내가 좋아하는 집의 마지노선을 테스트하는 나쁜 집 이상형 월드컵.',
      keywords: '나쁜 집 이상형 월드컵, 최악의 집 월드컵, 최악 중 최선 월드컵, 폭망 하우스 월드컵, 내가 좋아하는 집은, 집 이상형 월드컵, 32강 64강 128강, MyHome',
      ogImg: `${origin}/r2/houses/00066.webp`,
      headline: '💀 나쁜 집 이상형 월드컵 — 최악의 집(Lv.0~499) 중 최선의 집은?',
      faqQ: '나쁜 집 이상형 월드컵은 어떤 게임인가요?',
      faqA: '마그마 반지하, 택배 박스, 공중화장실 등 0~499단계 최악의 집 500개 중 무작위로 뽑힌 16강~256강 대진표에서 그나마 살 만한 최선의 집을 고르는 토너먼트입니다.'
    },
    'best-to-worst': {
      path: '/worldcup/best-to-worst',
      title: '좋은 집 이상형 월드컵 (최선 중 최악 뽑기) - 32강·64강·128강 | MyHome',
      desc: 'Lv.500~999 초호화 대박 하우스 500종 중에서 의외로 제일 살기 싫은 최악의 집을 뽑아보세요! 내가 좋아하는 집 취향을 알아보는 좋은 집 이상형 월드컵.',
      keywords: '좋은 집 이상형 월드컵, 대박 하우스 월드컵, 최선 중 최악 월드컵, 내가 좋아하는 집은, 부자 집 이상형 월드컵, 집 이상형 월드컵, 32강 64강 128강, MyHome',
      ogImg: `${origin}/r2/houses/00888.webp`,
      headline: '🌟 좋은 집 이상형 월드컵 — 최선의 집(Lv.500~999) 중 최악의 집은?',
      faqQ: '좋은 집 이상형 월드컵은 어떻게 진행되나요?',
      faqA: '절벽 저택, 우주정거장, 다이슨 스피어 등 500~999단계 초호화 대박 하우스 500개 중 무작위 16강~256강 대진표에서 가장 불편하거나 정 떨어지는 최악의 집을 골라냅니다.'
    }
  };

  const cfg = seoConfigs[mode] || seoConfigs['worst-to-best'];
  const isKorean = selectedLang === 'ko';
  const wcT = getWorldCupTranslation(selectedLang);
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];
  const ogLocale = (LANGUAGE_MAP[selectedLang]?.locale || 'ko-KR').replace('-', '_');
  const baseCanonicalUrl = `${origin}${cfg.path}`;
  const canonicalUrl = isKorean ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${selectedLang}`;

  if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(selectedLang)}">`);
  }
  if (!isKorean) {
    html = localizeStaticShellHtml(html, selectedLang, dict);
  }

  // Requirement 5: Remove bottom guide & whitepaper from /worldcup* pages
  html = html.replace(/<section\s+class=["'][^"']*service-guide-section[^"']*["'][^>]*>[\s\S]*?<\/section>\s*(?=\s*<!--\s*Footer|<footer)/i, '');

  const localizedTitle = isKorean
    ? cfg.title
    : (mode === 'best-to-worst'
        ? `${wcT.bestToWorst.title} | ${dict.brandHeader || 'MyHome'}`
        : (mode === 'worst-to-best'
            ? `${wcT.worstToBest.title} | ${dict.brandHeader || 'MyHome'}`
            : `${wcT.tabWorst} · ${wcT.tabBest} | ${dict.brandHeader || 'MyHome'}`));

  const localizedDesc = isKorean
    ? cfg.desc
    : (mode === 'best-to-worst'
        ? wcT.bestToWorst.subtitle
        : wcT.worstToBest.subtitle);

  const hreflangTags = SUPPORTED_LANGUAGES.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${l.code === 'ko' ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${l.code}`}" />`
  ).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${baseCanonicalUrl}" />`;

  html = html
    .replace(/href="\/css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261125"')
    .replace(/href="\/css\/share\.css(\?[^"]*)?"/g, 'href="/css/share.css?v=20261125"')
    .replace(/src="\/js\/consent\.js(\?[^"]*)?"/g, 'src="/js/consent.js?v=20261125"')
    .replace(/src="\/js\/app\.js(\?[^"]*)?"/g, 'src="/js/app.js?v=20261125"');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': cfg.title,
        'description': cfg.desc,
        'inLanguage': 'ko-KR'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': cfg.faqQ,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': cfg.faqA
            }
          }
        ]
      }
    ]
  };

  const headMetadata = [
    `<title>${escapeHtml(localizedTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta name="keywords" content="${escapeHtml(cfg.keywords)}" />`,
    `<meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />`,
    `<meta name="yandex-verification" content="05d40864cd87eefe" />`,
    `<meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(localizedTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta property="og:image" content="${cfg.ogImg}" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(localizedTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta name="twitter:image" content="${cfg.ogImg}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  ].join('\n  ');

  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']naver-site-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']yandex-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']msvalidate\.01["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
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
    const lang = url.searchParams.get('lang') || 'ko';

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

    // ----------------------------------------------------
    // Route 0: Unified tellmyname.app Internal Path Router
    // ----------------------------------------------------
    if (pathname === '/myhome' || pathname.startsWith('/myhome/')) {
      const targetPath = pathname.slice('/myhome'.length) || '/';
      return Response.redirect(`${url.origin}${targetPath}${url.search}`, 301);
    }

    if (pathname.startsWith('/r2/jobs/') && env && env.JOB_SVC) {
      return env.JOB_SVC.fetch(request);
    }
    if (pathname.startsWith('/r2/cars/') && env && env.CAR_SVC) {
      return env.CAR_SVC.fetch(request);
    }
    if ((pathname.startsWith('/r2/foods/') || pathname.startsWith('/images/') || pathname.startsWith('/i18n/foods/') || pathname.startsWith('/src/lib/')) && env && env.FOOD_SVC) {
      return env.FOOD_SVC.fetch(request);
    }

    const subAppMounts = [
      { prefix: '/food', svc: env?.FOOD_SVC },
      { prefix: '/job', svc: env?.JOB_SVC },
      { prefix: '/car', svc: env?.CAR_SVC }
    ];
    for (const mount of subAppMounts) {
      if (mount.svc && (pathname === mount.prefix || pathname.startsWith(mount.prefix + '/'))) {
        const subPath = pathname.slice(mount.prefix.length) || '/';
        const subUrl = new URL(subPath + url.search, url.origin);
        const subReq = new Request(subUrl.toString(), {
          method: request.method,
          headers: request.headers
        });
        const upstreamRes = await mount.svc.fetch(subReq);
        const ct = upstreamRes.headers.get('content-type') || '';
        if (ct.includes('text/html')) {
          let html = await upstreamRes.text();
          const p = mount.prefix;
          html = html
            .replace(/(href|src)=["']\/(css|js|src|samples)\//g, `$1="${p}/$2/`)
            .replace(/href=["']\/favicon([^"']*)["']/g, `href="${p}/favicon$1"`)
            .replace(/(<a[^>]*class=["'][^"']*brand[^"']*["'][^>]*href=["'])\/(["'])/g, `$1${p}/$2`)
            .replace(/href=["']\/(level|name|worldcup|gallery)(\/[^"']*)?["']/g, `href="${p}/$1$2"`)
            // Keep food Static Assets images on food.tellmyname.app/images/ (0 Worker hits), unify page/canonical URLs to tellmyname.app
            .replace(/https:\/\/food\.tellmyname\.app\/r2\/foods\//g, 'https://tellmyname.app/r2/foods/')
            .replace(/https:\/\/food\.tellmyname\.app\/(?!images\/)/g, 'https://tellmyname.app/food/')
            .replace(/https:\/\/food\.tellmyname\.app(?=["'<,\s?])/g, 'https://tellmyname.app/food')
            .replace(/https:\/\/job\.tellmyname\.app\/r2\/jobs\//g, 'https://tellmyname.app/r2/jobs/')
            .replace(/https:\/\/job\.tellmyname\.app\//g, 'https://tellmyname.app/job/')
            .replace(/https:\/\/job\.tellmyname\.app(?=["'<,\s?])/g, 'https://tellmyname.app/job')
            .replace(/https:\/\/car\.tellmyname\.app\/r2\/cars\//g, 'https://tellmyname.app/r2/cars/')
            .replace(/https:\/\/car\.tellmyname\.app\//g, 'https://tellmyname.app/car/')
            .replace(/https:\/\/car\.tellmyname\.app(?=["'<,\s?])/g, 'https://tellmyname.app/car')
            .replace(/https:\/\/myhome\.tellmyname\.app\//g, 'https://tellmyname.app/')
            .replace(/https:\/\/myhome\.tellmyname\.app(?=["'<,\s?])/g, 'https://tellmyname.app');
          if (p === '/food') {
            html = html.replace(/href=["']\/food\/(\d+)/g, `href="/food/food/$1`);
          }
          const prefixShim = `<script>(function(){var P="${p}";window.__TMN_PREFIX__=P;["pushState","replaceState"].forEach(function(m){var orig=history[m];if(!orig)return;history[m]=function(s,t,u){if(typeof u==="string"&&u.charAt(0)==="/"&&u.indexOf(P+"/")!==0&&u!==P&&u.indexOf("/job/")!==0&&u.indexOf("/car/")!==0&&u.indexOf("/food/")!==0){u=P+(u==="/"?"/":u);}return orig.call(this,s,t,u);};});})();</script>`;
          html = html.replace('<head>', `<head>\n  ${prefixShim}`);
          const headers = new Headers(upstreamRes.headers);
          headers.delete('content-length');
          headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
          headers.set('X-Content-Type-Options', 'nosniff');
          headers.set('X-Frame-Options', 'DENY');
          headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
          headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
          headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
          return new Response(html, { status: upstreamRes.status, headers });
        }
        return upstreamRes;
      }
    }

    // ----------------------------------------------------
    // Route 1: GET /r2/houses/:filename (동일 도메인 R2 CDN 라우터)
    // ----------------------------------------------------
    if (pathname.startsWith('/r2/houses/')) {
      const match = pathname.match(/^\/r2\/houses\/(\d{1,5})\.(webp|svg|png|jpg|json)$/i);
      if (match) {
        const rawLv = parseInt(match[1], 10);
        const ext = match[2].toLowerCase();
        const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
        const padded = String(level).padStart(5, '0');

        // .json 라이선스 메타데이터 요청 처리 (미존재 시에도 200 {} 반환 및 24시간 캐싱하여 콘솔 404 에러 방지 & R2 Class B 연산 절약)
        if (ext === 'json') {
          if (env && env.MYHOME_R2 && typeof env.MYHOME_R2.get === 'function') {
            try {
              const object = await env.MYHOME_R2.get('houses/' + padded + '.json');
              if (object) {
                const headers = new Headers();
                headers.set('Content-Type', 'application/json; charset=utf-8');
                headers.set('Cache-Control', 'public, max-age=86400');
                headers.set('Access-Control-Allow-Origin', '*');
                return new Response(object.body, { status: 200, headers });
              }
            } catch (err) {}
          }
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        // Cloudflare R2 버킷에 파일이 존재하는지 확인 (.webp 우선, 미존재 시 .png 조회)
        if (env && env.MYHOME_R2 && typeof env.MYHOME_R2.get === 'function') {
          try {
            let object = await env.MYHOME_R2.get('houses/' + padded + '.webp');
            let detectedContentType = 'image/webp';
            if (!object) {
              object = await env.MYHOME_R2.get('houses/' + padded + '.png');
              if (object) {
                detectedContentType = 'image/png';
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
          } catch (err) {
            // R2 조회 실패 시 엣지 SVG 생성으로 안전하게 폴백
          }
        }

        // R2 미존재 또는 미업로드 시 엣지에서 즉시 벡터 SVG 생성 반환
        const concept = getHouseConceptByLevel(level);
        const svg = renderHouseArtworkSvg(concept);
        return new Response(svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      return new Response('House image not found', {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // ----------------------------------------------------
    // Route 2: GET /api/house/:level, GET /api/name/:name, GET /api/level-name/:level
    // ----------------------------------------------------
    if (pathname.startsWith('/api/level-name/')) {
      const rawLv = pathname.slice('/api/level-name/'.length);
      const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, parseInt(rawLv, 10) || 0));
      const linkedName = getSitemapNameForLevel(level, lang);
      return new Response(JSON.stringify({ level, linkedName }, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, immutable'
        }
      });
    }

    if (pathname.startsWith('/api/house/')) {
      const rawLv = pathname.slice('/api/house/'.length);
      const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, parseInt(rawLv, 10) || 0));
      const house = getHouseConceptByLevel(level);
      const outputHouse = lang === 'ko' ? house : localizeHouse(house, lang);
      return new Response(JSON.stringify(outputHouse, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, immutable'
        }
      });
    }

    if (pathname.startsWith('/api/name/')) {
      const rawName = pathname.slice('/api/name/'.length);
      let decodedName = '';
      try {
        decodedName = decodeURIComponent(rawName).trim();
      } catch (e) {
        decodedName = rawName.trim();
      }

      if (!decodedName) {
        return new Response(JSON.stringify({ error: 'Name is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const strokeData = analyzeNameToHouse(decodedName);
      const concept = getHouseConceptByLevel(strokeData.level);
      const baseHouse = {
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      };
      const house = lang === 'ko' ? baseHouse : localizeHouse(baseHouse, lang, decodedName);

      return new Response(JSON.stringify(house, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Helper: dist/index.html 정적 파일 또는 Fallback 템플릿 로드
    async function getBaseHtml() {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        try {
          const assetUrl = new URL('/index.html', request.url);
          const assetRes = await env.ASSETS.fetch(new Request(assetUrl.toString()));
          if (assetRes && assetRes.ok) {
            return await assetRes.text();
          }
        } catch (err) {
          // fallback
        }
      }
      return getFallbackHtmlTemplate(lang);
    }

    // ----------------------------------------------------
    // Route 3: GET /name/:name 및 GET /level/:level (Zero-File-Explosion Dynamic Edge SSR)
    // ----------------------------------------------------
    if (pathname.startsWith('/name/')) {
      const rawName = pathname.slice('/name/'.length);
      let decodedName = '';
      try {
        decodedName = decodeURIComponent(rawName).trim();
      } catch (e) {
        decodedName = rawName.trim();
      }

      if (!decodedName) {
        return Response.redirect(new URL('/', request.url).toString(), 302);
      }

      const strokeData = analyzeNameToHouse(decodedName);
      const concept = getHouseConceptByLevel(strokeData.level);
      const house = {
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      };

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, house, decodedName, origin, lang);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Cache-Control': 'public, max-age=3600, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname.startsWith('/level/')) {
      const rawLv = pathname.slice('/level/'.length).replace(/\/$/, '');
      if (!/^\d+$/.test(rawLv)) return createClean404Response(pathname);
      const parsedLv = parseInt(rawLv, 10);
      if (parsedLv < MIN_LEVEL || parsedLv > MAX_LEVEL) return createClean404Response(pathname);
      const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, parseInt(rawLv, 10) || 0));
      const concept = getHouseConceptByLevel(level);
      const house = { ...concept };

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, house, null, origin, lang);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Route 3b: GET /worldcup, /worldcup/worst-to-best, /worldcup/best-to-worst (이상형 월드컵 전용 SEO SSR)
    if (pathname === '/worldcup' || pathname === '/worldcup/' || pathname === '/worldcup/worst-to-best' || pathname === '/worldcup/best-to-worst') {
      const wcMode = pathname.includes('best-to-worst')
        ? 'best-to-worst'
        : (pathname.includes('worst-to-best') ? 'worst-to-best' : 'overview');
      const baseHtml = await getBaseHtml();
      const html = renderWorldCupSeoHtml(baseHtml, wcMode, origin, lang);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Cache-Control': 'public, max-age=3600, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Method B: /food or /food/* seamlessly connects to food.tellmyname.app
    if (pathname === '/food' || pathname.startsWith('/food/')) {
      const subPath = pathname.slice('/food'.length) || '/';
      return Response.redirect(`https://food.tellmyname.app${subPath}${url.search}`, 302);
    }

    if (pathname === '/match' || pathname.startsWith('/match/')) {
      return Response.redirect(`${origin}/`, 301);
    }


    // ----------------------------------------------------
    // Route 4: GET / (메인 루트 페이지 SSR 적용 - 브랜드 고유 Title/Canonical 보존 + 본문 초기 샘플 카드 SSR)
    // ----------------------------------------------------
    if (pathname === '/' || pathname === '') {
      const defaultName = lang === 'ko' ? '김서윤' : (LANGUAGE_MAP[lang]?.sampleNames?.[0] || 'Chloe');
      const strokeData = analyzeNameToHouse(defaultName);
      const defaultLv = strokeData.level;
      const concept = getHouseConceptByLevel(defaultLv);
      const house = {
        ...concept,
        ...strokeData,
        level: defaultLv,
        name: defaultName,
        title: concept.title
      };
      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, house, defaultName, origin, lang, true);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 5: GET /robots.txt, GET /ads.txt & IndexNow Key (Direct Edge Serving)
    // ----------------------------------------------------
    if (pathname === '/robots.txt') {
      const robotsTxt = [
        '# Robots.txt for https://tellmyname.app',
        '# Designed for Naver Yeti, Googlebot, Yandex, Bingbot, Baiduspider, Daum, Kakao, and Facebook crawlers',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: Yeti',
        'Allow: /',
        '',
        'User-agent: Googlebot',
        'Allow: /',
        '',
        'User-agent: Yandex',
        'Allow: /',
        '',
        'User-agent: YandexBot',
        'Allow: /',
        '',
        'User-agent: Bingbot',
        'Allow: /',
        '',
        'User-agent: Baiduspider',
        'Allow: /',
        '',
        'User-agent: Sogou web spider',
        'Allow: /',
        '',
        'User-agent: 360Spider',
        'Allow: /',
        '',
        'User-agent: YisouSpider',
        'Allow: /',
        '',
        'User-agent: PetalBot',
        'Allow: /',
        '',
        'User-agent: Bytespider',
        'Allow: /',
        '',
        'User-agent: coccocbot-web',
        'Allow: /',
        '',
        'User-agent: coccocbot-image',
        'Allow: /',
        '',
        'User-agent: Daumoa',
        'Allow: /',
        '',
        'User-agent: DuckDuckBot',
        'Allow: /',
        '',
        'User-agent: Qwantify',
        'Allow: /',
        '',
        'User-agent: Mail.RU_Bot',
        'Allow: /',
        '',
        'User-agent: kakaotalk-scrap',
        'Allow: /',
        '',
        'User-agent: facebookexternalhit',
        'Allow: /',
        '',
        '# Sitemaps & Feeds',
        'Sitemap: https://tellmyname.app/sitemap.xml',
        'Sitemap: https://tellmyname.app/sitemap-main.xml',
        'Sitemap: https://tellmyname.app/sitemap-images.xml',
        'Sitemap: https://tellmyname.app/rss.xml',
        ''
      ].join('\n');
      return new Response(robotsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/ads.txt') {
      return new Response('google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/a8f4c2e9b1d703654e2a9c8b7d6f1e3a.txt') {
      return new Response('a8f4c2e9b1d703654e2a9c8b7d6f1e3a', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 6: 정적 자산(Static Assets) 서빙 폴백
    // ----------------------------------------------------
        // Return true HTTP 404 (no AdSense code, noindex) for unknown non-file paths instead of SPA Soft-404
    const hasFileExt = /\.[a-z0-9]{1,8}$/i.test(pathname);
    if (!hasFileExt) {
      return createClean404Response(pathname);
    }
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return await env.ASSETS.fetch(request);
    }

    if (pathname === '/' || pathname === '') {
      return new Response(getFallbackHtmlTemplate(lang), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
