// worker.js — Cloudflare Edge Dynamic SSR Router & Same-Domain R2 Handler for MyCar
// car.tellmyname.app (Zero-File-Explosion Dynamic Edge SSR with 14-Language Support & Image SEO)

import { SITE_ORIGIN, MIN_LEVEL, MAX_LEVEL, GOOD_CAR_THRESHOLD } from './src/lib/constants.js';
import { FAMILY_SITES } from './src/lib/common/family_sites.js';
import { analyzeNameToCar } from './src/lib/hash.js';
import * as taxonomy from './src/lib/taxonomy.js';
import * as i18n from './src/lib/i18n.js';
import { getSitemapNameForLevel } from './src/lib/level_name_map.js';
import { renderCrossLevelSectionHtml } from './src/lib/cross_level_map.js';
import {
  serveR2CarImage,
  renderCarEdgeSvg,
  createR2ImageResponse
} from './src/lib/r2_storage.js';


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


const DEFAULT_SUPPORTED_LANGUAGES = [
  { code: 'ko', locale: 'ko-KR', sampleNames: ['김서윤', '이민준', '홍길동', '박대기', '선우용녀'] },
  { code: 'en', locale: 'en-US', sampleNames: ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah'] },
  { code: 'hi', locale: 'hi-IN', sampleNames: ['Aarav', 'Diya', 'Vihaan', 'Ananya', 'Rohan'] },
  { code: 'vi', locale: 'vi-VN', sampleNames: ['Minh', 'Linh', 'Anh', 'Hùng', 'Trang'] },
  { code: 'fr', locale: 'fr-FR', sampleNames: ['Lucas', 'Emma', 'Gabriel', 'Chloé', 'Jules'] },
  { code: 'pt', locale: 'pt-BR', sampleNames: ['Miguel', 'Helena', 'Arthur', 'Alice', 'Gael'] },
  { code: 'es', locale: 'es-ES', sampleNames: ['Mateo', 'Sofía', 'Santiago', 'Valentina', 'Leo'] },
  { code: 'id', locale: 'id-ID', sampleNames: ['Budi', 'Siti', 'Rizky', 'Putri', 'Agus'] },
  { code: 'ru', locale: 'ru-RU', sampleNames: ['Александр', 'София', 'Максим', 'Анна', 'Михаил'] },
  { code: 'de', locale: 'de-DE', sampleNames: ['Noah', 'Emilia', 'Matteo', 'Mia', 'Leon'] },
  { code: 'it', locale: 'it-IT', sampleNames: ['Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Alessandro'] },
  { code: 'ja', locale: 'ja-JP', sampleNames: ['Haruto', 'Yui', 'Sora', 'Hina', 'Ren'] },
  { code: 'zh', locale: 'zh-CN', sampleNames: ['Wei', 'Fang', 'Hao', 'Yuhan', 'Zihan'] },
  { code: 'ms', locale: 'ms-MY', sampleNames: ['Aisyah', 'Ahmad', 'Nur', 'Muhammad', 'Siti'] }
];

function getSupportedLanguages() {
  return Array.isArray(i18n.SUPPORTED_LANGUAGES) && i18n.SUPPORTED_LANGUAGES.length > 0
    ? i18n.SUPPORTED_LANGUAGES
    : DEFAULT_SUPPORTED_LANGUAGES;
}

function getLanguageMap() {
  if (i18n.LANGUAGE_MAP) return i18n.LANGUAGE_MAP;
  return Object.fromEntries(getSupportedLanguages().map(l => [l.code, l]));
}

function getUiDict(lang = 'ko') {
  const dictMap = i18n.UI_DICTIONARY || {};
  return dictMap[lang] || dictMap['ko'] || {};
}

function getConceptByLevel(level) {
  const lv = clampLevel(level);
  const fn = taxonomy.getCarConceptByLevel || taxonomy.getJobConceptByLevel || taxonomy.getHouseConceptByLevel;
  if (typeof fn === 'function') {
    return fn(lv);
  }
  return {
    level: lv,
    zone: lv >= GOOD_CAR_THRESHOLD ? 'GOOD' : 'BAD',
    realityType: lv % 2 === 0 ? 'REAL' : 'FICTION',
    tier: Math.min(20, Math.floor(lv / 50) + 1),
    title: `Lv.${lv} 자동차`
  };
}

function localizeVehicle(car, lang = 'ko', nameQuery = null) {
  const fn = i18n.localizeCar || i18n.localizeJob || i18n.localizeHouse;
  const localized = typeof fn === 'function' ? fn(car, lang, nameQuery) : car;
  return normalizeCarFields(localized);
}

function getWcTranslations(lang = 'ko') {
  if (typeof i18n.getWorldCupTranslation === 'function') {
    return i18n.getWorldCupTranslation(lang);
  }
  return {
    tabWorst: '최악 중 최선 월드컵',
    tabBest: '최선 중 최악 월드컵',
    worstToBest: {
      title: '💀 최악의 자동차 중 최선의 탈것 월드컵',
      subtitle: 'Lv.0 ~ 499 폭망 탈것 중 그나마 타고 출근할 만한 최선의 탈것을 골라보세요!'
    },
    bestToWorst: {
      title: '🌟 최선의 자동차 중 최악의 탈것 월드컵',
      subtitle: 'Lv.500 ~ 1,000 드림카·초월 탈것 중 의외로 가장 타기 싫은 최악의 탈것을 뽑아보세요!'
    }
  };
}

function clampLevel(raw) {
  const num = Number(raw);
  if (!Number.isFinite(num)) return MIN_LEVEL;
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(num)));
}

function normalizeCarFields(car = {}) {
  const era = car.era || car.builtYear || '동시대 및 다중우주';
  const estimatedPrice = car.estimatedPrice || car.estimatedSalary || car.estimatedValue || '측정 불가';
  const specialFeature = car.specialFeature || car.specialDuty || '상상을 초월하는 특수 주행 성능 보유';
  const aiVerdict = car.aiVerdict || '다중우주 차고감정원에서 보증하는 독보적인 탈것입니다.';
  return {
    ...car,
    era,
    builtYear: era,
    estimatedPrice,
    estimatedSalary: estimatedPrice,
    estimatedValue: estimatedPrice,
    specialFeature,
    specialDuty: specialFeature,
    aiVerdict
  };
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
 * 5개 패밀리 사이트맵 <link rel="sitemap"> 태그 문자열 생성
 */
function buildFamilySitemapLinks() {
  return FAMILY_SITES.map(site =>
    `<link rel="sitemap" type="application/xml" title="${escapeHtml(site.id.toUpperCase())} Sitemap" href="${escapeHtml(site.sitemapUrl)}" />`
  ).join('\n  ');
}

/**
 * 기본 Fallback HTML 템플릿 (env.ASSETS 미제공 또는 로컬 테스트 시 사용)
 */
function getFallbackHtmlTemplate(lang = 'ko') {
  const dict = getUiDict(lang);
  const headerBrand = dict.brandHeader || '나에게 어울리는 자동차';
  const familyNavHtml = FAMILY_SITES.map(site => {
    const isActive = site.id === 'car';
    const label = dict.familyNav?.[site.id] || site.defaultLabel.replace(/^[^\s]+\s+/, '');
    const href = lang !== 'ko' && !isActive ? `${site.origin}/?lang=${encodeURIComponent(lang)}` : `${site.origin}/`;
    const activeAttrs = isActive ? ' class="family-nav-link active" aria-current="page"' : ' class="family-nav-link" target="_blank" rel="noopener"';
    return `        <a href="${escapeHtml(href)}"${activeAttrs} id="family-link-${escapeHtml(site.id)}" title="${escapeHtml(label)}">
          <span class="family-nav-icon">${site.emoji}</span> <span class="family-nav-label" id="family-label-${escapeHtml(site.id)}">${escapeHtml(label)}</span>
        </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />
  <meta name="yandex-verification" content="05d40864cd87eefe" />
  <meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />
  ${buildFamilySitemapLinks()}
  <title>${escapeHtml(headerBrand)} | MyCar</title>
</head>
<body>
  <div class="app-layout">
    <nav id="family-top-nav" class="family-top-nav" aria-label="tellmyname.app 패밀리 서비스">
      <div class="family-nav-inner">
${familyNavHtml}
      </div>
    </nav>
    <header class="app-header">
      <a href="/" class="brand-link">${escapeHtml(headerBrand)}</a>
    </header>
    <main class="main-content">
      <section id="card-root"></section>
      <section id="worldcup-root" class="worldcup-root hidden"></section>
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

  if (dict.familyNav) {
    replaceById('family-label-car', escapeHtml(dict.familyNav.car));
    replaceById('family-label-job', escapeHtml(dict.familyNav.job));
    replaceById('family-label-myhome', escapeHtml(dict.familyNav.myhome));
    replaceById('family-label-food', escapeHtml(dict.familyNav.food));
    replaceById('family-label-photodiary', escapeHtml(dict.familyNav.photodiary));
  }

  const langSuffix = `?lang=${escapeHtml(selectedLang)}`;
  for (const site of FAMILY_SITES) {
    const targetHref = site.id === 'car' ? `/${langSuffix}` : `${site.origin}/${langSuffix}`;
    const idRegex = new RegExp(`id=["']family-link-${site.id}["']\\s+href=["'][^"']*["']`, 'g');
    const hrefFirstRegex = new RegExp(`href=["'][^"']*["']\\s+id=["']family-link-${site.id}["']`, 'g');
    html = html
      .replace(idRegex, `id="family-link-${site.id}" href="${targetHref}"`)
      .replace(hrefFirstRegex, `href="${targetHref}" id="family-link-${site.id}"`);
  }

  replaceById('photodiary-text', escapeHtml(dict.photoDiaryLink || 'Photo Diary'));
  const pdHref = `https://photodiary.tellmyname.app/${langSuffix}`;
  html = html.replace(/id="photodiary-link"\s+href="[^"]*"/g, `id="photodiary-link" href="${pdHref}"`);
  replaceById('header-brand-text', escapeHtml(dict.brandHeader || 'The Car That Suits You'));
  replaceById('label-search-btn', escapeHtml(dict.searchBtn || 'Find My Car'));
  replaceById('label-sample-chips', escapeHtml(dict.sampleLabel || 'Trending Names:'));
  replaceById('ad-badge-top', escapeHtml(dict.adBadgeTop || 'AD · GOOGLE ADSENSE'));
  replaceById('ad-badge-main', escapeHtml(dict.adBadgeMain || 'AD · GOOGLE ADSENSE'));
  replaceById('ad-badge-footer', escapeHtml(dict.adBadgeFooter || 'AD · GOOGLE ADSENSE'));
  replaceById('return-house-text', escapeHtml(dict.returnMyHouseDefault || dict.returnMyCarDefault || 'Return to My Car'));

  // Mode Tabs
  const wcT = getWcTranslations(selectedLang);
  replaceById('tab-btn-search', `<span>🚗</span> <span>${escapeHtml(wcT.tabSearch || dict.searchBtn || 'Find My Car')}</span>`);
  replaceById('tab-btn-worst', `<span>💀</span> <span>${escapeHtml(wcT.tabWorst || 'Best of Worst')}</span>`);
  replaceById('tab-btn-best', `<span>🌟</span> <span>${escapeHtml(wcT.tabBest || 'Worst of Best')}</span>`);

  // Explorer & Scroll Preview
  replaceById('label-btn-prev', escapeHtml(dict.prevHouseBtn || dict.prevCarBtn || 'Previous Ride'));
  replaceById('label-btn-random', escapeHtml(dict.randomHouseBtn || dict.randomCarBtn || 'Random Ride'));
  replaceById('label-btn-next', escapeHtml(dict.nextHouseBtn || dict.nextCarBtn || 'Next Ride'));
  replaceById('dock-keyboard-hint', escapeHtml(dict.dockKeyboardHint || ''));
  replaceById('scroll-preview-title', escapeHtml(dict.scrollPreviewTitle || 'Vehicle List by Level'));
  replaceById('scroll-preview-subtitle', escapeHtml(dict.scrollPreviewSubtitle || ''));
  replaceById('filter-btn-all', escapeHtml(dict.scrollFilterAll || 'All (0~1000)'));
  replaceById('filter-btn-bad', escapeHtml(dict.scrollFilterBad || '💀 Wreck (Lv.0~499)'));
  replaceById('filter-btn-good', escapeHtml(dict.scrollFilterGood || '🌟 Dream (Lv.500~1000)'));
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
    if (dict.whitepaper.art4Title) replaceById('wp-art4-title', escapeHtml(dict.whitepaper.art4Title));
    if (dict.whitepaper.art4P1) replaceById('wp-art4-p1', escapeHtml(dict.whitepaper.art4P1));
    if (dict.whitepaper.art4P2) replaceById('wp-art4-p2', escapeHtml(dict.whitepaper.art4P2));
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

  // Sample Chips
  const langMap = getLanguageMap();
  const langInfo = langMap[selectedLang] || langMap['en'];
  const sampleNames = langInfo?.sampleNames || ['Steve', 'Emma', 'Olivia', 'Liam', 'Noah'];
  const sampleChipsHtml = sampleNames.map(n => {
    const lv = analyzeNameToCar(n).level;
    return `<button type="button" class="sample-chip" data-name="${escapeHtml(n)}">${escapeHtml(n)} (Lv.${lv})</button>`;
  }).join('\n              ');
  replaceById('sample-chips', `\n              ${sampleChipsHtml}\n            `);

  // Attributes in shell
  html = html
    .replace(/placeholder="이름을 입력하세요[^"]*"/g, `placeholder="${escapeHtml(dict.searchPlaceholder || 'Enter your name...')}"`)
    .replace(/aria-label="감정받을 이름 입력"/g, `aria-label="${escapeHtml(dict.nameInputAria || 'Enter a name')}"`)
    .replace(/aria-label="언어 변경"/g, `aria-label="${escapeHtml(dict.langSelectLabel || 'Change Language')}"`)
    .replace(/title="포토 다이어리 바로가기"/g, `title="${escapeHtml(dict.photoDiaryTitle || 'Photo Diary')}"`)
    .replace(/title="🎲 주사위 굴려 무작위 이름 보기"/g, `title="${escapeHtml(dict.randomDiceTitle || 'Random Name')}"`)
    .replace(/aria-label="랜덤 이름 검색"/g, `aria-label="${escapeHtml(dict.randomDiceTitle || 'Random Name')}"`)
    .replace(/aria-label="검색"/g, `aria-label="${escapeHtml(dict.searchBtn || 'Search')}"`)
    .replace(/aria-label="샘플 이름 바로가기"/g, 'aria-label="Sample Names"')
    .replace(/title="새로운 추천 이름 뽑기"/g, `title="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="추천 이름 새로고침"/g, `aria-label="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="단계 탐색 네비게이션"/g, 'aria-label="Level Explorer"')
    .replace(/aria-label="단계별 자동차 텍스트 미리보기 탐색기"/g, 'aria-label="Vehicle Explorer"')
    .replace(/aria-label="다중우주 차고감정원 공식 시스템 해설서"/g, 'aria-label="Official Vehicle Guide"')
    .replace(/content="나에게 어울리는 자동차 \(MyCar\)"/g, 'content="The Car That Suits You (MyCar)"');

  // Sync lang-select option
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

  const _carExtraEn = [
    ['나의 자동차 고르기 이상형 월드컵', 'Ideal Vehicle World Cup'],
    ['자동차 이상형 월드컵 (최악 중 최선)', 'Vehicle World Cup (Best of the Worst)'],
    ['탈것 이상형 월드컵 (최선 중 최악)', 'Vehicle World Cup (Worst of the Best)']
  ];
  for (const [k, v] of _carExtraEn) {
    if (html.includes(k)) html = html.split(k).join(v);
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
 * Clean existing SEO head tags before injecting dynamic SSR metadata
 */
function stripExistingHeadSeoTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']naver-site-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']yandex-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']msvalidate\.01["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']sitemap["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*ca-pub-8793936135959956[^>]*><\/script>/gi, '');
}

/**
 * Edge SSR HTML 렌더러
 * baseHtml 내의 <head> 및 <section id="card-root">에 실시간 동적 SEO/OG/Schema.org/SSR 마크업 주입
 *
 * @param {string} baseHtml - dist/index.html SPA 쉘
 * @param {object} car - 시승 감정서 및 상세 스펙 데이터 객체
 * @param {string|null} nameQuery - 대상 이름 (없으면 null)
 * @param {string} origin - 사이트 오리진 (기본값 SITE_ORIGIN)
 * @param {string} lang - 타겟 언어 코드 (기본값 'ko')
 * @param {boolean} isRoot - 메인 루트 경로 여부
 * @returns {string} 완성된 완전 SSR HTML
 */
export function renderSeoHtml(baseHtml, car, nameQuery, origin = SITE_ORIGIN, lang = 'ko', isRoot = false) {
  const langMap = getLanguageMap();
  const supportedLangs = getSupportedLanguages();
  const selectedLang = langMap[lang] ? lang : 'ko';

  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const normalizedCar = normalizeCarFields(car);
  const effectiveName = nameQuery || normalizedCar.name || normalizedCar.cleanName || null;
  const levelNum = clampLevel(normalizedCar.level);
  const padded = String(levelNum).padStart(5, '0');
  const ogImageUrl = `${origin}/r2/cars/${padded}.webp`;

  const baseCanonicalUrl = isRoot ? `${origin}/` : `${origin}/level/${levelNum}`;
  const isNameRoute = Boolean(effectiveName && !isRoot);

  const isKorean = selectedLang === 'ko';
  const canonicalUrl = isKorean ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${selectedLang}`;
  const ogLocale = (langMap[selectedLang]?.locale || 'ko-KR').replace('-', '_');
  const displayCar = isKorean ? normalizedCar : localizeVehicle(normalizedCar, selectedLang, effectiveName);
  const dict = getUiDict(selectedLang);

  // <html lang="..."> 동적 동기화
  if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(selectedLang)}">`);
  }

  // Localize static shell HTML when selectedLang !== 'ko'
  if (!isKorean) {
    html = localizeStaticShellHtml(html, selectedLang, dict);
  }
  if (!isRoot) {
    html = html.replace(/<section\s+class=["'][^"']*service-guide-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');
  }

  // Cache-busting query string
  html = html
    .replace(/href="\/css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261125"')
    .replace(/href="\/css\/share\.css(\?[^"]*)?"/g, 'href="/css/share.css?v=20261125"')
    .replace(/src="\/js\/consent\.js(\?[^"]*)?"/g, 'src="/js/consent.js?v=20261125"')
    .replace(/src="\/js\/app\.js(\?[^"]*)?"/g, 'src="/js/app.js?v=20261125"');

  // Strict SEO Title (Root Korean <= 40 chars: 36 chars)
  const titleText = isRoot
    ? (isKorean
        ? '나에게 어울리는 자동차 - 이름으로 찾는 재미로 보는 탈것 테스트'
        : `${dict.brandHeader || 'The Car That Suits You'} (MyCar) — ${dict.brandSub || 'Fun Name-Based Vehicle Test'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 자동차 (Lv.${levelNum}) — ${displayCar.title} | 나에게 어울리는 자동차`
            : `Lv.${levelNum} ${displayCar.title} | 나에게 어울리는 자동차`)
        : (effectiveName
            ? `${dict.ownerTitle ? dict.ownerTitle.replace('{name}', effectiveName) : `The car that suits ${effectiveName}`}: ${displayCar.title} (Lv.${levelNum}) | ${dict.brandHeader || 'MyCar'}`
            : `Lv.${levelNum} ${displayCar.title} | ${dict.brandHeader || 'MyCar'}`));

  // Strict SEO Meta Description (Root Korean <= 80 chars: 76 chars)
  const descText = isRoot
    ? (isKorean
        ? '이름만 입력하면 세발자전거부터 해리포터 빗자루, 상어 라이딩, 슈퍼카까지 나에게 어울리는 0~1000단계 자동차와 이상형 월드컵을 확인하세요!'
        : `${dict.footer?.desc || 'Enter your name to find the car, broomstick, shark ride or supercar that suits you from Level 0 to 1,000!'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 자동차는 Lv.${levelNum} [${displayCar.title}]입니다. (언제 타던 탈것인지: ${displayCar.era} / 추산 가격·유지비: ${displayCar.estimatedPrice} / 특별한 기능·주행성능: ${displayCar.specialFeature}) | ${effectiveName}에게 어울리는 자동차, 나에게 어울리는 자동차, 나의 자동차 고르기 이상형 월드컵`
            : `Lv.${levelNum} [${displayCar.title}]. (언제 타던 탈것인지: ${displayCar.era} / 추산 가격·유지비: ${displayCar.estimatedPrice} / 특별한 기능·주행성능: ${displayCar.specialFeature}) | 자동차 추천, 탈것 이미지, 나에게 어울리는 자동차, MyCar`)
        : (effectiveName
            ? `${displayCar.title} (${displayCar.zoneLabel || displayCar.zone}, ${displayCar.realityLabel || displayCar.realityType}). ${dict.specs?.eraLabel || dict.specs?.builtYearLabel || 'Era'}: ${displayCar.era} / ${dict.specs?.estimatedPriceLabel || dict.specs?.estimatedValueLabel || 'Estimated Price'}: ${displayCar.estimatedPrice} / ${dict.specs?.specialFeatureLabel || 'Special Feature'}: ${displayCar.specialFeature}`
            : `Lv.${levelNum} [${displayCar.title}] (${displayCar.zoneLabel || displayCar.zone}, ${displayCar.realityLabel || displayCar.realityType}). ${displayCar.era} / ${displayCar.estimatedPrice} / ${displayCar.specialFeature}`));

  // Keywords (including Worldcup SEO keywords)
  const keywordsText = isRoot
    ? (isKorean
        ? '나에게 어울리는 자동차, 나의 자동차 고르기 이상형 월드컵, 자동차 이상형 월드컵, 탈것 이상형 월드컵, 최악의 자동차 월드컵, 최선의 자동차 월드컵, 이름으로 보는 자동차, 재미로 보는 탈것 테스트, 세발자전거, 해리포터 빗자루, 상어 라이딩, MyCar'
        : 'The Car That Suits You, MyCar, name car test, fun vehicle quiz, car recommendation, vehicle tournament, ideal car world cup')
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}에게 어울리는 자동차, 나에게 어울리는 자동차, 나의 자동차 고르기 이상형 월드컵, 자동차 이상형 월드컵, 탈것 이상형 월드컵, ${displayCar.title}, ${effectiveName} car recommendation, MyCar`
            : `나에게 어울리는 자동차, 나의 자동차 고르기 이상형 월드컵, 자동차 이상형 월드컵, 탈것 이상형 월드컵, ${displayCar.title}, MyCar`)
        : (effectiveName
            ? `${displayCar.title}, MyCar`
            : `${displayCar.title}, MyCar`));

  // Bidirectional 14-language hreflang tags + x-default
  const hreflangTags = supportedLangs.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${l.code === 'ko' ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${l.code}`}" />`
  ).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${baseCanonicalUrl}" />`;

  // Google AdSense
  const adsenseTag = /<script[^>]*adsbygoogle\.js/i.test(baseHtml) ? '' : '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>';

  // Schema.org JSON-LD (WebApplication, WebPage, Vehicle, ImageObject, FAQPage + Family Sites)
  const imageObjectNode = {
    '@type': 'ImageObject',
    '@id': `${canonicalUrl}#image`,
    'contentUrl': ogImageUrl,
    'url': ogImageUrl,
    'width': 1024,
    'height': 1024,
    'name': effectiveName ? `${displayCar.title} (${effectiveName})` : `${displayCar.title}`,
    'caption': isKorean
      ? (effectiveName ? `${effectiveName}님에게 어울리는 자동차: Lv.${levelNum} ${displayCar.title}` : `Lv.${levelNum} ${displayCar.title}`)
      : (effectiveName ? `${effectiveName}: Lv.${levelNum} ${displayCar.title}` : `Lv.${levelNum} ${displayCar.title}`),
    'representativeOfPage': true
  };

  const faqEntity = [
    {
      '@type': 'Question',
      'name': isKorean ? '언제 타던 탈것인가요?' : (dict.specs?.eraLabel || dict.specs?.builtYearLabel ? `${dict.specs.eraLabel || dict.specs.builtYearLabel}?` : 'What era is this vehicle from?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayCar.era)
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '추산 가격과 유지비는 얼마인가요?' : (dict.specs?.estimatedPriceLabel || dict.specs?.estimatedValueLabel ? `${dict.specs.estimatedPriceLabel || dict.specs.estimatedValueLabel}?` : 'What is the estimated price & maintenance cost?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayCar.estimatedPrice)
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '특별한 기능과 주행성능은 무엇인가요?' : (dict.specs?.specialFeatureLabel ? `${dict.specs.specialFeatureLabel}?` : 'What are the special features & driving performance?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayCar.specialFeature)
      }
    }
  ];

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${SITE_ORIGIN}/#webapp`,
        'name': isKorean ? '나에게 어울리는 자동차 (MyCar)' : `${dict.brandHeader || 'The Car That Suits You'} (MyCar)`,
        'url': SITE_ORIGIN,
        'applicationCategory': 'EntertainmentApplication',
        'operatingSystem': 'All',
        'sameAs': FAMILY_SITES.map(s => s.origin),
        'relatedLink': FAMILY_SITES.map(s => s.sitemapUrl)
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': titleText,
        'description': descText,
        'inLanguage': isKorean ? 'ko-KR' : (langMap[selectedLang]?.locale || 'en-US'),
        'isPartOf': { '@id': `${SITE_ORIGIN}/#webapp` },
        'primaryImageOfPage': { '@id': `${canonicalUrl}#image` }
      },
      {
        '@type': 'Vehicle',
        '@id': `${canonicalUrl}#vehicle`,
        'name': displayCar.title,
        'description': `${displayCar.specialFeature} ${displayCar.aiVerdict}`.trim(),
        'vehicleModelDate': String(displayCar.era),
        'model': `Lv.${levelNum} (${displayCar.tierName || ''})`,
        'image': ogImageUrl
      },
      imageObjectNode,
      {
        '@type': 'FAQPage',
        'mainEntity': faqEntity
      }
    ]
  };

  const headMetadata = [
    `<title>${escapeHtml(titleText)}</title>`,
    `<meta name="description" content="${escapeHtml(descText)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywordsText)}" />`,
    `<meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />`,
    `<meta name="yandex-verification" content="05d40864cd87eefe" />`,
    `<meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    buildFamilySitemapLinks(),
    hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="나에게 어울리는 자동차 (MyCar)" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:image:alt" content="${escapeHtml(displayCar.title)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />`,
    adsenseTag,
    `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>`
  ].join('\n  ');

  html = stripExistingHeadSeoTags(html);

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  }

  // SSR Article HTML Injection into <section id="card-root">
  const ownerHeadline = effectiveName
    ? (dict.ownerTitle ? dict.ownerTitle.replace('{name}', effectiveName) : `${effectiveName}님에게 어울리는 자동차는`)
    : (dict.brandHeader || '나에게 어울리는 자동차');

  const zoneBadgeText = displayCar.zoneLabel || (displayCar.zone === 'GOOD' ? '대박 탈것' : '폭망 탈것');
  const realityBadgeText = displayCar.realityLabel || (displayCar.realityType === 'REAL' ? '실제 탈것·생물' : '허구·마법·SF');
  const catBadgeText = displayCar.categoryLabel || displayCar.category || '이색 탈것';
  const tierBadgeText = displayCar.tierName || `Tier ${displayCar.tier || 1}`;

  const eraLabel = dict.specs?.eraLabel || dict.specs?.builtYearLabel || '언제 타던 탈것인지';
  const priceLabel = dict.specs?.estimatedPriceLabel || dict.specs?.estimatedValueLabel || '추산 가격·유지비';
  const featureLabel = dict.specs?.specialFeatureLabel || '특별한 기능·주행성능';
  const verdictLabel = dict.specs?.aiVerdictLabel || 'AI 시승 총평';

  const ssrArticleHtml = `
      <article class="appraisal-card seo-car-ssr seo-job-ssr seo-house-ssr ${displayCar.zone === 'GOOD' ? 'zone-good' : 'zone-bad'}" id="appraisal-certificate" data-level="${levelNum}">
        <header class="card-certificate-header">
          <p class="owner-headline-label">${escapeHtml(ownerHeadline)}</p>
        </header>

        <div class="card-badge-row">
          <span class="badge-item badge-level">Lv.${levelNum} / 1000</span>
          <span class="badge-item badge-zone">${escapeHtml(zoneBadgeText)}</span>
          <span class="badge-item badge-reality">${escapeHtml(realityBadgeText)}</span>
          <span class="badge-item badge-tier">${escapeHtml(tierBadgeText)}</span>
          <span class="badge-item badge-category">${escapeHtml(catBadgeText)}</span>
        </div>

        <h1 class="car-title-main job-title-main" id="cert-title">${escapeHtml(displayCar.title)}</h1>

        <div class="artwork-container">
          <img src="${escapeHtml(ogImageUrl)}"
               alt="${escapeHtml(displayCar.title)} - ${escapeHtml(dict.brandHeader || 'MyCar')}"
               class="artwork-img"
               width="1024"
               height="1024"
               loading="eager"
               decoding="async"
               onerror="this.onerror=null; this.src='/favicon.svg';" />
        </div>

        <div class="specs-grid">
          <dl class="spec-dl">
            <dt>${escapeHtml(eraLabel)}</dt>
            <dd class="spec-built-year spec-era">${escapeHtml(displayCar.era)}</dd>
            <dt>${escapeHtml(priceLabel)}</dt>
            <dd class="spec-estimated-value spec-estimated-price">${escapeHtml(displayCar.estimatedPrice)}</dd>
            <dt>${escapeHtml(featureLabel)}</dt>
            <dd class="spec-special-feature">${escapeHtml(displayCar.specialFeature)}</dd>
            <dt>${escapeHtml(verdictLabel)}</dt>
            <dd class="spec-ai-verdict">${escapeHtml(displayCar.aiVerdict)}</dd>
          </dl>
        </div>

        <p class="seo-worldcup-links" style="font-size:0.85rem; opacity:0.85; margin-top:0.75rem;">
          <a href="/worldcup">나의 자동차 고르기 이상형 월드컵</a> ·
          <a href="/worldcup/worst-to-best">자동차 이상형 월드컵 (최악 중 최선)</a> ·
          <a href="/worldcup/best-to-worst">탈것 이상형 월드컵 (최선 중 최악)</a>
        </p>
      </article>`;

  // Inject into <section id="card-root"></section>
  const cardRootRegex = /<section\s+id=["']card-root["'][^>]*>([\s\S]*?)<\/section>/i;
  if (cardRootRegex.test(html)) {
    html = html.replace(cardRootRegex, `<section id="card-root">${ssrArticleHtml}\n${renderCrossLevelSectionHtml(levelNum, effectiveName, selectedLang, 'car', MAX_LEVEL)}</section>`);
  }

  // Inject initial data before </body>
  const initialDataPayload = {
    ...displayCar,
    level: levelNum,
    name: effectiveName,
    imageUrl: ogImageUrl,
    ogImageUrl
  };

  const scriptTag = `  <script>window.__INITIAL_CAR_DATA__ = ${JSON.stringify(initialDataPayload)}; window.__INITIAL_JOB_DATA__ = window.__INITIAL_CAR_DATA__; window.__INITIAL_HOUSE_DATA__ = window.__INITIAL_CAR_DATA__;</script>\n</body>`;
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, scriptTag);
  } else {
    html += scriptTag;
  }


  if (!/<script[^>]*adsbygoogle\.js/i.test(html)) {
    html = html.replace('</head>', '  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>\n</head>');
  }
  if (selectedLang !== 'ko') {
    html = html
      .replace(/나의 자동차 고르기 이상형 월드컵/g, 'Ideal Vehicle World Cup')
      .replace(/자동차 이상형 월드컵 \(최악 중 최선\)/g, 'Vehicle World Cup (Best of the Worst)')
      .replace(/탈것 이상형 월드컵 \(최선 중 최악\)/g, 'Vehicle World Cup (Worst of the Best)');
  }

  return html;
}

/**
 * 이상형 월드컵 전용 SEO SSR HTML 생성 (/worldcup, /worldcup/worst-to-best, /worldcup/best-to-worst)
 */
export function renderWorldCupSeoHtml(baseHtml, mode = 'worst-to-best', origin = SITE_ORIGIN, lang = 'ko', wcParams = {}) {
  const langMap = getLanguageMap();
  const supportedLangs = getSupportedLanguages();
  const selectedLang = langMap[lang] ? lang : 'ko';

  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const seoConfigs = {
    'overview': {
      path: '/worldcup',
      title: '나의 자동차 고르기 이상형 월드컵 - 탈것 이상형 월드컵 | MyCar',
      desc: '나에게 어울리는 자동차는? 16강~256강으로 즐기는 나의 자동차 고르기 이상형 월드컵! 최악의 탈것 중 최선 뽑기와 드림카 중 최악 뽑기를 지금 해보세요.',
      keywords: '나의 자동차 고르기 이상형 월드컵, 나에게 어울리는 자동차, 자동차 이상형 월드컵, 탈것 이상형 월드컵, 최악의 자동차 월드컵, 최선의 자동차 월드컵, 32강 자동차 월드컵, 64강 자동차 월드컵, MyCar',
      ogImg: `${origin}/r2/cars/00501.webp`,
      headline: '🏆 나의 자동차 고르기 이상형 월드컵 — 나에게 어울리는 자동차·탈것은?',
      faqQ: '자동차·탈것 이상형 월드컵에서는 어떤 모드를 플레이할 수 있나요?',
      faqA: 'Lv.0~499 폭망 탈것 500종 중 그나마 타고 출근할 만한 최선을 고르는 월드컵과 Lv.500~1,000 드림카·초월 탈것 501종 중 의외로 가장 타기 싫은 최악을 뽑는 월드컵을 16강·32강·64강·128강·256강으로 즐길 수 있습니다.'
    },
    'worst-to-best': {
      path: '/worldcup/worst-to-best',
      title: '최악의 자동차 중 최선의 탈것 월드컵 - 32강·64강·128강 | MyCar',
      desc: 'Lv.0~499 폭망 자동차·세발자전거·쇼핑카트 500종 중 그나마 타고 출근할 만한 최선의 탈것을 골라보세요! 나의 자동차 고르기 이상형 월드컵.',
      keywords: '나의 자동차 고르기 이상형 월드컵, 나에게 어울리는 자동차, 자동차 이상형 월드컵, 탈것 이상형 월드컵, 최악의 자동차 중 최선 월드컵, 폭망 탈것 월드컵, MyCar',
      ogImg: `${origin}/r2/cars/00000.webp`,
      headline: '💀 최악의 자동차 중 최선의 탈것 월드컵 — 폭망 탈것(Lv.0~499) 중 최선은?',
      faqQ: '최악의 자동차 중 최선 월드컵은 어떤 게임인가요?',
      faqA: '네모바퀴 돌수레, 아기 세발자전거, 바퀴 빠진 쇼핑카트, 침 뱉는 낙타, 불량 마법 빗자루 등 0~499단계 최악의 탈것 중 무작위 16강~256강 대진표에서 그나마 타고 다닐 만한 탈것을 골라내는 토너먼트입니다.'
    },
    'best-to-worst': {
      path: '/worldcup/best-to-worst',
      title: '최선의 자동차 중 최악의 탈것 월드컵 - 32강·64강·128강 | MyCar',
      desc: 'Lv.500~1,000 파이어볼트 빗자루·상어 라이딩·슈퍼카 501종 중 의외로 가장 타기 싫은 최악의 탈것을 뽑아보세요! 탈것 이상형 월드컵.',
      keywords: '나의 자동차 고르기 이상형 월드컵, 나에게 어울리는 자동차, 자동차 이상형 월드컵, 탈것 이상형 월드컵, 최선의 자동차 중 최악 월드컵, 드림카 월드컵, MyCar',
      ogImg: `${origin}/r2/cars/01000.webp`,
      headline: '🌟 최선의 자동차 중 최악의 탈것 월드컵 — 대박 드림카(Lv.500~1000) 중 최악은?',
      faqQ: '최선의 자동차 중 최악 월드컵은 어떻게 진행되나요?',
      faqA: '해리포터 파이어볼트 마법 빗자루, 백상아리 수중 라이딩, 배트모빌, 24K 순금 부가티, 다중우주 워프 크루저 등 초호화 탈것 중 가장 부담스럽거나 아찔한 최악의 탈것을 가려냅니다.'
    }
  };

  const cfg = seoConfigs[mode] || seoConfigs['worst-to-best'];
  const isKorean = selectedLang === 'ko';
  const wcT = getWcTranslations(selectedLang);
  const dict = getUiDict(selectedLang);
  const ogLocale = (langMap[selectedLang]?.locale || 'ko-KR').replace('-', '_');

  const roundNum = Number(wcParams?.round);
  const seedNum = Number(wcParams?.seed);
  const hasSameCondition = Number.isInteger(roundNum) && roundNum >= 2 && Number.isInteger(seedNum) && seedNum > 0;

  let baseCanonicalUrl = `${origin}${cfg.path}`;
  if (hasSameCondition) {
    baseCanonicalUrl += `?round=${roundNum}&seed=${seedNum}`;
  }
  const canonicalUrl = isKorean
    ? baseCanonicalUrl
    : (hasSameCondition
        ? `${origin}${cfg.path}?lang=${selectedLang}&round=${roundNum}&seed=${seedNum}`
        : `${origin}${cfg.path}?lang=${selectedLang}`);

  if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(selectedLang)}">`);
  }
  if (!isKorean) {
    html = localizeStaticShellHtml(html, selectedLang, dict);
  }
  html = html.replace(/<section\s+class=["'][^"']*service-guide-section[^"']*["'][^>]*>[\s\S]*?<\/section>/i, '');

  let localizedTitle = isKorean
    ? cfg.title
    : (mode === 'best-to-worst'
        ? `${wcT.bestToWorst?.title || 'Worst of Best Vehicle World Cup'} | ${dict.brandHeader || 'MyCar'}`
        : (mode === 'worst-to-best'
            ? `${wcT.worstToBest?.title || 'Best of Worst Vehicle World Cup'} | ${dict.brandHeader || 'MyCar'}`
            : `${wcT.tabWorst || 'Best of Worst'} · ${wcT.tabBest || 'Worst of Best'} | ${dict.brandHeader || 'MyCar'}`));

  let localizedDesc = isKorean
    ? cfg.desc
    : (mode === 'best-to-worst'
        ? (wcT.bestToWorst?.subtitle || 'Pick the worst ride among dream vehicles!')
        : (wcT.worstToBest?.subtitle || 'Pick the best ride among worst vehicles!'));

  if (hasSameCondition) {
    const bracketPrefix = isKorean
      ? `[${roundNum}강 동일 조건 대진표 #${seedNum}] `
      : `[${roundNum}-Match Same Condition Bracket #${seedNum}] `;
    localizedTitle = `${bracketPrefix}${localizedTitle}`;
    localizedDesc = `${bracketPrefix}${localizedDesc}`;
  }

  const hreflangTags = supportedLangs.map(l => {
    let href = l.code === 'ko' ? `${origin}${cfg.path}` : `${origin}${cfg.path}?lang=${l.code}`;
    if (hasSameCondition) {
      href += (l.code === 'ko' ? '?' : '&') + `round=${roundNum}&seed=${seedNum}`;
    }
    return `<link rel="alternate" hreflang="${l.code}" href="${href}" />`;
  }).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${baseCanonicalUrl}" />`;

  html = html
    .replace(/href="\/css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261125"')
    .replace(/href="\/css\/share\.css(\?[^"]*)?"/g, 'href="/css/share.css?v=20261125"')
    .replace(/src="\/js\/consent\.js(\?[^"]*)?"/g, 'src="/js/consent.js?v=20261125"')
    .replace(/src="\/js\/app\.js(\?[^"]*)?"/g, 'src="/js/app.js?v=20261125"');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${SITE_ORIGIN}/#webapp`,
        'name': isKorean ? '나에게 어울리는 자동차 (MyCar)' : `${dict.brandHeader || 'The Car That Suits You'} (MyCar)`,
        'url': SITE_ORIGIN,
        'applicationCategory': 'GameApplication',
        'operatingSystem': 'All',
        'sameAs': FAMILY_SITES.map(s => s.origin),
        'relatedLink': FAMILY_SITES.map(s => s.sitemapUrl)
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': localizedTitle,
        'description': localizedDesc,
        'inLanguage': langMap[selectedLang]?.locale || 'ko-KR',
        'isPartOf': { '@id': `${SITE_ORIGIN}/#webapp` }
      },
      {
        '@type': 'ImageObject',
        '@id': `${canonicalUrl}#image`,
        'contentUrl': cfg.ogImg,
        'url': cfg.ogImg,
        'width': 1024,
        'height': 1024,
        'representativeOfPage': true
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

  const adsenseTag = /<script[^>]*adsbygoogle\.js/i.test(baseHtml) ? '' : '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>';

  const headMetadata = [
    `<title>${escapeHtml(localizedTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta name="keywords" content="${escapeHtml(cfg.keywords)}" />`,
    adsenseTag,
    `<meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />`,
    `<meta name="yandex-verification" content="05d40864cd87eefe" />`,
    `<meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    buildFamilySitemapLinks(),
    hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="나에게 어울리는 자동차 (MyCar)" />`,
    `<meta property="og:title" content="${escapeHtml(localizedTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta property="og:image" content="${escapeHtml(cfg.ogImg)}" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(localizedTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(localizedDesc)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(cfg.ogImg)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  ].join('\n  ');

  html = stripExistingHeadSeoTags(html);

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  }

  // Inject SSR semantic Worldcup preview into <section id="worldcup-root">
  const ssrWorldCupHtml = `
      <article class="appraisal-card seo-car-ssr seo-job-ssr worldcup-seo-ssr" data-worldcup-mode="${escapeHtml(mode)}">
        <h2>${escapeHtml(cfg.headline)}</h2>
        <p>${escapeHtml(localizedDesc)}</p>
        <p class="seo-worldcup-keywords">나의 자동차 고르기 이상형 월드컵 · 나에게 어울리는 자동차 · 자동차 이상형 월드컵 · 탈것 이상형 월드컵</p>
      </article>`;
  const wcRootRegex = /<section\s+id=["']worldcup-root["'][^>]*>([\s\S]*?)<\/section>/i;
  if (wcRootRegex.test(html)) {
    html = html.replace(wcRootRegex, `<section id="worldcup-root" class="worldcup-root" aria-live="polite">${ssrWorldCupHtml}</section>`);
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
    // Route 1: GET /r2/cars/:filename (+ /r2/jobs/*, /r2/houses/* 호환)
    // ----------------------------------------------------
    if (pathname.startsWith('/r2/cars/') || pathname.startsWith('/r2/jobs/') || pathname.startsWith('/r2/houses/')) {
      const match = pathname.match(/^\/r2\/(?:cars|jobs|houses)\/(\d{1,5})\.(webp|svg|png|jpg|json)$/i);
      if (match) {
        const rawLv = parseInt(match[1], 10);
        const ext = match[2].toLowerCase();
        const level = clampLevel(isNaN(rawLv) ? 0 : rawLv);
        const padded = String(level).padStart(5, '0');

        // .json 라이선스 메타데이터 요청 처리
        if (ext === 'json') {
          const r2Bucket = env?.CAR_R2 || env?.OCCUPATION_R2 || env?.MYHOME_R2;
          if (r2Bucket && typeof r2Bucket.get === 'function') {
            try {
              const object = await r2Bucket.get(`cars/${padded}.json`);
              if (object) {
                const headers = new Headers();
                headers.set('Content-Type', 'application/json; charset=utf-8');
                headers.set('Cache-Control', 'public, max-age=86400');
                headers.set('Access-Control-Allow-Origin', '*');
                return new Response(object.body, { status: 200, headers });
              }
            } catch {
              // fallback to empty metadata JSON
            }
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

        // 명시적 .svg 요청 시 즉시 엣지 벡터 SVG 렌더링 반환
        if (ext === 'svg') {
          const svg = renderCarEdgeSvg(level);
          return new Response(svg, {
            status: 200,
            headers: {
              'Content-Type': 'image/svg+xml; charset=utf-8',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Access-Control-Allow-Origin': '*',
              'X-Image-Source': 'EDGE_RENDERER'
            }
          });
        }

        // Cloudflare R2 버킷 조회 (.webp 우선, .png 차선) 및 미존재 시 엣지 SVG 폴백
        const r2Result = await serveR2CarImage(level, env);
        return createR2ImageResponse(r2Result, 200);
      }
      return new Response('Car image not found', {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // ----------------------------------------------------
    // Route 2: API Endpoints (/api/car, /api/job, /api/level/:level, /api/name/:name, /api/level-name/:level)
    // ----------------------------------------------------
    if (pathname.startsWith('/api/level-name/')) {
      const rawLv = pathname.slice('/api/level-name/'.length);
      const level = clampLevel(parseInt(rawLv, 10) || 0);
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

    if (pathname === '/api/car' || pathname === '/api/job' || pathname === '/api/house') {
      const nameParam = (url.searchParams.get('name') || '').trim();
      if (nameParam) {
        const strokeData = analyzeNameToCar(nameParam);
        const concept = getConceptByLevel(strokeData.level);
        const baseCar = normalizeCarFields({
          ...concept,
          ...strokeData,
          name: nameParam,
          title: concept.title
        });
        const outputCar = lang === 'ko' ? baseCar : localizeVehicle(baseCar, lang, nameParam);
        return new Response(JSON.stringify(outputCar, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }

      const rawLv = url.searchParams.get('level');
      const level = clampLevel(parseInt(rawLv ?? '0', 10) || 0);
      const car = normalizeCarFields(getConceptByLevel(level));
      const outputCar = lang === 'ko' ? car : localizeVehicle(car, lang);
      return new Response(JSON.stringify(outputCar, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, immutable'
        }
      });
    }

    if (
      pathname.startsWith('/api/car/') ||
      pathname.startsWith('/api/job/') ||
      pathname.startsWith('/api/house/') ||
      pathname.startsWith('/api/level/')
    ) {
      const prefix = pathname.startsWith('/api/car/')
        ? '/api/car/'
        : (pathname.startsWith('/api/job/')
            ? '/api/job/'
            : (pathname.startsWith('/api/house/') ? '/api/house/' : '/api/level/'));
      const rawLv = pathname.slice(prefix.length);
      const level = clampLevel(parseInt(rawLv, 10) || 0);
      const car = normalizeCarFields(getConceptByLevel(level));
      const outputCar = lang === 'ko' ? car : localizeVehicle(car, lang);
      return new Response(JSON.stringify(outputCar, null, 2), {
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
      } catch {
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

      const strokeData = analyzeNameToCar(decodedName);
      const concept = getConceptByLevel(strokeData.level);
      const baseCar = normalizeCarFields({
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      });
      const car = lang === 'ko' ? baseCar : localizeVehicle(baseCar, lang, decodedName);

      return new Response(JSON.stringify(car, null, 2), {
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
        } catch {
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
      } catch {
        decodedName = rawName.trim();
      }

      if (!decodedName) {
        return Response.redirect(new URL('/', request.url).toString(), 302);
      }

      const strokeData = analyzeNameToCar(decodedName);
      const concept = getConceptByLevel(strokeData.level);
      const car = normalizeCarFields({
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      });

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, car, decodedName, origin, lang, false);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
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
      const level = clampLevel(parseInt(rawLv, 10) || 0);
      const concept = getConceptByLevel(level);
      const car = normalizeCarFields({ ...concept });

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, car, null, origin, lang, false);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Route 3b: GET /worldcup, /worldcup/worst-to-best, /worldcup/best-to-worst
    if (
      pathname === '/worldcup' ||
      pathname === '/worldcup/' ||
      pathname === '/worldcup/worst-to-best' ||
      pathname === '/worldcup/best-to-worst'
    ) {
      const queryMode = url.searchParams.get('mode');
      const wcMode = queryMode || (pathname.includes('best-to-worst')
        ? 'best-to-worst'
        : (pathname.includes('worst-to-best') ? 'worst-to-best' : 'overview'));
      const roundParam = parseInt(url.searchParams.get('round'), 10) || null;
      const seedParam = parseInt(url.searchParams.get('seed'), 10) || null;
      const wcParams = { round: roundParam, seed: seedParam };
      const baseHtml = await getBaseHtml();
      const html = renderWorldCupSeoHtml(baseHtml, wcMode, origin, lang, wcParams);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 4: GET / (메인 루트 페이지 SSR 적용)
    // ----------------------------------------------------
    if (pathname === '/' || pathname === '') {
      const langMap = getLanguageMap();
      const defaultName = lang === 'ko' ? '김서윤' : (langMap[lang]?.sampleNames?.[0] || 'Steve');
      const strokeData = analyzeNameToCar(defaultName);
      const defaultLv = strokeData.level;
      const concept = getConceptByLevel(defaultLv);
      const car = normalizeCarFields({
        ...concept,
        ...strokeData,
        level: defaultLv,
        name: defaultName,
        title: concept.title
      });
      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, car, defaultName, origin, lang, true);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ----------------------------------------------------
    // Route 5: GET /robots.txt, /sitemap.xml, /ads.txt & IndexNow Key
    // ----------------------------------------------------
    if (pathname === '/robots.txt') {
      const familyRobotSitemaps = FAMILY_SITES
        .filter(s => s.id !== 'car')
        .map(s => `Sitemap: ${s.sitemapUrl}`);

      const robotsTxt = [
        `# Robots.txt for ${SITE_ORIGIN}`,
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
        `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
        `Sitemap: ${SITE_ORIGIN}/sitemap-main.xml`,
        `Sitemap: ${SITE_ORIGIN}/sitemap-images.xml`,
        `Sitemap: ${SITE_ORIGIN}/sitemap-names-1.xml`,
        `Sitemap: ${SITE_ORIGIN}/sitemap-names-2.xml`,
        ...familyRobotSitemaps,
        `Sitemap: ${SITE_ORIGIN}/rss.xml`,
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

    if (pathname === '/sitemap.xml') {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes && assetRes.status === 200) return assetRes;
      }
      const today = new Date().toISOString().slice(0, 10);
      const localSitemaps = [
        `${SITE_ORIGIN}/sitemap-main.xml`,
        `${SITE_ORIGIN}/sitemap-images.xml`,
        `${SITE_ORIGIN}/sitemap-names-1.xml`,
        `${SITE_ORIGIN}/sitemap-names-2.xml`
      ];
      const externalFamilySitemaps = FAMILY_SITES
        .filter(s => s.id !== 'car')
        .map(s => s.sitemapUrl);

      const allSitemapLocs = [...localSitemaps, ...externalFamilySitemaps];
      const sitemapIndexXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...allSitemapLocs.map(loc => [
          '  <sitemap>',
          `    <loc>${loc}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          '  </sitemap>'
        ].join('\n')),
        '</sitemapindex>'
      ].join('\n');
      return new Response(sitemapIndexXml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/ads.txt') {
      return new Response('# Google AdSense ca-pub-8793936135959956\ngoogle.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n', {
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
