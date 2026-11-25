// worker.js — Cloudflare Edge Dynamic SSR Router & Same-Domain R2 Handler for MyJob
// tellmyname.app/job (Zero-File-Explosion Dynamic Edge SSR with 14-Language Support & Image SEO)

import { SITE_ORIGIN, MIN_LEVEL, MAX_LEVEL, GOOD_JOB_THRESHOLD } from './src/lib/constants.js';
import { analyzeNameToJob } from './src/lib/hash.js';
import { getJobConceptByLevel } from './src/lib/taxonomy.js';
import { renderJobArtworkSvg } from './src/lib/gemini_client.js';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  UI_DICTIONARY,
  getTranslation,
  localizeJob,
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
  const headerBrand = dict.brandHeader || '나에게 어울리는 직업';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="naver-site-verification" content="500b75986dd93e8da7fcbbb280dae50e9f195b04" />
  <meta name="yandex-verification" content="05d40864cd87eefe" />
  <meta name="msvalidate.01" content="2ACD105E72F63152A701D20FEC1AD467" />
  <link rel="sitemap" type="application/xml" title="MyJob Sitemap" href="https://tellmyname.app/job/sitemap.xml" />
  <link rel="sitemap" type="application/xml" title="Photodiary Sitemap" href="https://photodiary.tellmyname.app/sitemap.xml" />
  <link rel="sitemap" type="application/xml" title="MyHome Sitemap" href="https://tellmyname.app/sitemap.xml" />
  <link rel="sitemap" type="application/xml" title="Food Sitemap" href="https://tellmyname.app/food/sitemap.xml" />
  <title>${escapeHtml(headerBrand)} | MyJob</title>
</head>
<body>
  <div class="app-layout">
    <nav id="family-top-nav" class="family-top-nav" aria-label="tellmyname.app 패밀리 서비스">
      <div class="family-nav-inner">
        <a href="https://tellmyname.app/job/" class="family-nav-link active" id="family-link-job" aria-current="page" title="나에게 어울리는 직업 (MyJob)">
          <span class="family-nav-icon">💼</span> <span class="family-nav-label" id="family-label-job">${escapeHtml(dict.familyNav?.job || '나에게 어울리는 직업')}</span>
        </a>
        <a href="https://tellmyname.app/" class="family-nav-link" id="family-link-myhome" target="_blank" rel="noopener" title="나에게 어울리는 집 (MyHome)">
          <span class="family-nav-icon">🏠</span> <span class="family-nav-label" id="family-label-myhome">${escapeHtml(dict.familyNav?.myhome || '나에게 어울리는 집')}</span>
        </a>
        <a href="https://tellmyname.app/food/" class="family-nav-link" id="family-link-food" target="_blank" rel="noopener" title="나에게 어울리는 음식 (MyFood)">
          <span class="family-nav-icon">🍔</span> <span class="family-nav-label" id="family-label-food">${escapeHtml(dict.familyNav?.food || '나에게 어울리는 음식')}</span>
        </a>
        <a href="https://photodiary.tellmyname.app/" class="family-nav-link" id="family-link-photodiary" target="_blank" rel="noopener" title="포토다이어리 (Photodiary)">
          <span class="family-nav-icon">📸</span> <span class="family-nav-label" id="family-label-photodiary">${escapeHtml(dict.familyNav?.photodiary || '포토다이어리')}</span>
        </a>
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
    replaceById('family-label-job', escapeHtml(dict.familyNav.job));
    replaceById('family-label-myhome', escapeHtml(dict.familyNav.myhome));
    replaceById('family-label-food', escapeHtml(dict.familyNav.food));
    replaceById('family-label-photodiary', escapeHtml(dict.familyNav.photodiary));
  }
  const langSuffix = selectedLang !== 'ko' ? `?lang=${escapeHtml(selectedLang)}` : '';
  html = html.replace(/id="family-link-myhome"\s+href="[^"]*"/g, `id="family-link-myhome" href="https://tellmyname.app/${langSuffix}"`);
  html = html.replace(/id="family-link-food"\s+href="[^"]*"/g, `id="family-link-food" href="https://tellmyname.app/food/${langSuffix}"`);
  html = html.replace(/id="family-link-photodiary"\s+href="[^"]*"/g, `id="family-link-photodiary" href="https://photodiary.tellmyname.app/${langSuffix}"`);

  replaceById('photodiary-text', escapeHtml(dict.photoDiaryLink || 'Photo Diary'));
  const pdHref = selectedLang && selectedLang !== 'ko'
    ? `https://photodiary.tellmyname.app/?lang=${escapeHtml(selectedLang)}`
    : 'https://photodiary.tellmyname.app/';
  html = html.replace(/id="photodiary-link"\s+href="[^"]*"/g, `id="photodiary-link" href="${pdHref}"`);
  replaceById('header-brand-text', escapeHtml(dict.brandHeader || 'The Job That Suits You'));
  replaceById('label-search-btn', escapeHtml(dict.searchBtn || 'Find My Job'));
  replaceById('label-sample-chips', escapeHtml(dict.sampleLabel || 'Trending Names:'));
  replaceById('ad-badge-top', escapeHtml(dict.adBadgeTop || 'AD · GOOGLE ADSENSE'));
  replaceById('ad-badge-main', escapeHtml(dict.adBadgeMain || 'AD · GOOGLE ADSENSE'));
  replaceById('ad-badge-footer', escapeHtml(dict.adBadgeFooter || 'AD · GOOGLE ADSENSE'));
  replaceById('return-house-text', escapeHtml(dict.returnMyHouseDefault || 'Return to My Job'));

  // Explorer & Scroll Preview
  replaceById('label-btn-prev', escapeHtml(dict.prevHouseBtn || 'Previous Job'));
  replaceById('label-btn-random', escapeHtml(dict.randomHouseBtn || 'Random Job'));
  replaceById('label-btn-next', escapeHtml(dict.nextHouseBtn || 'Next Job'));
  replaceById('dock-keyboard-hint', escapeHtml(dict.dockKeyboardHint || ''));
  replaceById('scroll-preview-title', escapeHtml(dict.scrollPreviewTitle || 'Job List by Level'));
  replaceById('scroll-preview-subtitle', escapeHtml(dict.scrollPreviewSubtitle || ''));
  replaceById('filter-btn-all', escapeHtml(dict.scrollFilterAll || 'All (0~1000)'));
  replaceById('filter-btn-bad', escapeHtml(dict.scrollFilterBad || '💀 Nightmare (Lv.0~499)'));
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
  const langInfo = LANGUAGE_MAP[selectedLang] || LANGUAGE_MAP['en'];
  const sampleNames = langInfo?.sampleNames || ['Steve', 'Emma', 'Olivia', 'Liam', 'Noah'];
  const sampleChipsHtml = sampleNames.map(n => {
    const lv = analyzeNameToJob(n).level;
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
    .replace(/aria-label="샘플 이름 바로가기"/g, `aria-label="Sample Names"`)
    .replace(/title="새로운 추천 이름 뽑기"/g, `title="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="추천 이름 새로고침"/g, `aria-label="${escapeHtml(dict.refreshChipsTitle || 'Refresh')}"`)
    .replace(/aria-label="단계 탐색 네비게이션"/g, `aria-label="Level Explorer"`)
    .replace(/aria-label="단계별 직업 텍스트 미리보기 탐색기"/g, `aria-label="Job Explorer"`)
    .replace(/aria-label="다중우주 인사발령원 공식 시스템 해설서"/g, `aria-label="Official Career Guide"`)
    .replace(/content="나에게 어울리는 직업 \(MyJob\)"/g, `content="The Job That Suits You (MyJob)"`);

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

  html = html.replace(
    /<article[^>]*>[\s\S]*?4\.\s*나의 직업 고르기 이상형 월드컵[\s\S]*?<\/article>/i,
    '<article class="seo-article"><h3>4. Find Your Ideal Career World Cup</h3><p>Test your priorities across 1,001 unique careers in two tournament brackets: <strong>Best of the Worst</strong> (choose the least painful extreme job from Lv.0–499) and <strong>Worst of the Best</strong> (eliminate the most overwhelming dream role from Lv.500–1000).</p></article>'
  );
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
 * @param {string} baseHtml - dist/index.html SPA 쉘
 * @param {object} job - 감정서 및 상세 스펙 데이터 객체
 * @param {string|null} nameQuery - 대상 이름 (없으면 null)
 * @param {string} origin - 사이트 오리진 (기본값 SITE_ORIGIN)
 * @param {string} lang - 타겟 언어 코드 (기본값 'ko')
 * @param {boolean} isRoot - 메인 루트 경로 여부
 * @returns {string} 완성된 완전 SSR HTML
 */
export function renderSeoHtml(baseHtml, job, nameQuery, origin = SITE_ORIGIN, lang = 'ko', isRoot = false) {
  const selectedLang = LANGUAGE_MAP[lang] ? lang : 'ko';
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const effectiveName = nameQuery || job.name || job.cleanName || null;
  const levelNum = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(job.level) || 0)));
  const padded = String(levelNum).padStart(5, '0');
  const ogImageUrl = `${origin}/r2/jobs/${padded}.webp`;

  const baseCanonicalUrl = isRoot ? `${origin}/` : `${origin}/level/${levelNum}`;
  const isNameRoute = Boolean(effectiveName && !isRoot);

  const isKorean = selectedLang === 'ko';
  const canonicalUrl = isKorean ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${selectedLang}`;
  const ogLocale = (LANGUAGE_MAP[selectedLang]?.locale || 'ko-KR').replace('-', '_');
  const displayJob = isKorean ? job : localizeJob(job, selectedLang, effectiveName);
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];

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

  // Title:
  const titleText = isRoot
    ? (isKorean
        ? '나에게 어울리는 직업 - 이름만 입력해서 찾는 재미로 보는 내 직업 테스트 & 직업 이상형 월드컵'
        : `${dict.brandHeader || 'The Job That Suits You'} (MyJob) — ${dict.brandSub || 'Fun Name-Based Job Matching Test'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 직업 (Lv.${levelNum}) — ${job.title} | 나에게 어울리는 직업`
            : `Lv.${levelNum} ${job.title} | 나에게 어울리는 직업`)
        : (effectiveName
            ? `${dict.ownerTitle ? dict.ownerTitle.replace('{name}', effectiveName) : `The job that suits ${effectiveName}`}: ${displayJob.title} (Lv.${levelNum}) | ${dict.brandHeader || 'MyJob'}`
            : `Lv.${levelNum} ${displayJob.title} | ${dict.brandHeader || 'MyJob'}`));

  // Meta Description:
  const descText = isRoot
    ? (isKorean
        ? '이름만 입력하면 0단계부터 1,000단계까지 나에게 어울리는 직업을 바로 찾아드립니다! 언제 하던 직업인지, 추산 연봉, 특별한 역할과 나의 직업 고르기 이상형 월드컵까지 지금 즐겨보세요.'
        : `${dict.footer?.desc || 'Just enter your name to find the job that suits you! Fun career matching test from Level 0 to Level 1,000.'}`)
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}님에게 어울리는 직업은 Lv.${levelNum} [${job.title}]입니다. (언제 하던 직업인지: ${job.era || job.builtYear} / 추산되는 연봉: ${job.estimatedSalary || job.estimatedValue} / 특별한 역할·할일: ${job.specialDuty || job.specialFeature}) | ${effectiveName}에게 어울리는 직업, 나에게 어울리는 직업, 나의 직업 고르기 이상형 월드컵`
            : `Lv.${levelNum} [${job.title}]. (언제 하던 직업인지: ${job.era || job.builtYear} / 추산되는 연봉: ${job.estimatedSalary || job.estimatedValue} / 특별한 역할·할일: ${job.specialDuty || job.specialFeature}) | 직업 추천, 직업 이미지, 나에게 어울리는 직업, MyJob`)
        : (effectiveName
            ? `${displayJob.title} (${displayJob.zoneLabel}, ${displayJob.realityLabel}). ${dict.specs?.builtYearLabel || 'Era'}: ${displayJob.era || displayJob.builtYear} / ${dict.specs?.estimatedValueLabel || 'Estimated Salary'}: ${displayJob.estimatedSalary || displayJob.estimatedValue} / ${dict.specs?.specialFeatureLabel || 'Special Role'}: ${displayJob.specialDuty || displayJob.specialFeature}`
            : `Lv.${levelNum} [${displayJob.title}] (${displayJob.zoneLabel}, ${displayJob.realityLabel}). ${displayJob.era || displayJob.builtYear} / ${displayJob.estimatedSalary || displayJob.estimatedValue} / ${displayJob.specialDuty || displayJob.specialFeature}`));

  // Keywords:
  const keywordsText = isRoot
    ? (isKorean
        ? '나에게 어울리는 직업, 나의 직업 고르기 이상형 월드컵, 직업 이상형 월드컵, 최악의 직업 월드컵, 최선의 직업 월드컵, 이름으로 보는 직업, 재미로 보는 직업 테스트, 전생 직업 테스트, 미래 직업 테스트, MyJob'
        : 'The Job That Suits You, MyJob, name job test, fun career quiz, career recommendation, job tournament, best job world cup')
    : (isKorean
        ? (effectiveName
            ? `${effectiveName}에게 어울리는 직업, ${job.title}, MyJob`
            : `${job.title}, MyJob`)
        : (effectiveName
            ? `${displayJob.title}, MyJob`
            : `${displayJob.title}, MyJob`));

  // 14개 언어 hreflang 태그 + x-default
  const hreflangTags = SUPPORTED_LANGUAGES.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${l.code === 'ko' ? baseCanonicalUrl : `${baseCanonicalUrl}?lang=${l.code}`}" />`
  ).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${baseCanonicalUrl}" />`;

  // Google AdSense
  const adsenseTag = /<script[^>]*adsbygoogle\.js/i.test(baseHtml) ? '' : '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8793936135959956" crossorigin="anonymous"></script>';

  // Schema.org JSON-LD
  const imageObjectNode = {
    '@type': 'ImageObject',
    '@id': `${canonicalUrl}#image`,
    'contentUrl': ogImageUrl,
    'url': ogImageUrl,
    'name': effectiveName ? `${effectiveName} job image — ${displayJob.title}` : `${displayJob.title} job image`,
    'caption': isKorean
      ? (effectiveName ? `${effectiveName}님에게 어울리는 직업: Lv.${levelNum} ${job.title}` : `Lv.${levelNum} ${job.title}`)
      : (effectiveName ? `${effectiveName}: Lv.${levelNum} ${displayJob.title}` : `Lv.${levelNum} ${displayJob.title}`),
    'representativeOfPage': true
  };

  const faqEntity = [
    {
      '@type': 'Question',
      'name': isKorean ? '언제 하던 직업인가요?' : (dict.specs?.builtYearLabel ? `${dict.specs.builtYearLabel}?` : 'When was this job active?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayJob.era || displayJob.builtYear || '')
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '추산되는 연봉은 얼마인가요?' : (dict.specs?.estimatedValueLabel ? `${dict.specs.estimatedValueLabel}?` : 'What is the estimated salary?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayJob.estimatedSalary || displayJob.estimatedValue || '')
      }
    },
    {
      '@type': 'Question',
      'name': isKorean ? '특별한 역할과 할일은 무엇인가요?' : (dict.specs?.specialFeatureLabel ? `${dict.specs.specialFeatureLabel}?` : 'What is the special role & duty?'),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': String(displayJob.specialDuty || displayJob.specialFeature || '')
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
        '@type': 'Occupation',
        '@id': `${canonicalUrl}#occupation`,
        'name': displayJob.title,
        'description': `${displayJob.specialDuty || displayJob.specialFeature || ''} ${displayJob.aiVerdict || ''}`.trim(),
        'estimatedSalary': String(displayJob.estimatedSalary || displayJob.estimatedValue || ''),
        'disambiguatingDescription': `Level ${levelNum} (${displayJob.tierName || ''})`
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
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="sitemap" type="application/xml" title="MyJob Sitemap" href="${SITE_ORIGIN}/sitemap.xml" />`,
    '<link rel="sitemap" type="application/xml" title="Photodiary Sitemap" href="https://photodiary.tellmyname.app/sitemap.xml" />',
    '<link rel="sitemap" type="application/xml" title="MyHome Sitemap" href="https://tellmyname.app/sitemap.xml" />',
    '<link rel="sitemap" type="application/xml" title="Food Sitemap" href="https://tellmyname.app/food/sitemap.xml" />',
    hreflangTags,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="나에게 어울리는 직업 (MyJob)" />`,
    `<meta property="og:title" content="${escapeHtml(titleText)}" />`,
    `<meta property="og:description" content="${escapeHtml(descText)}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="1024" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:image:alt" content="${escapeHtml(displayJob.title)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(descText)}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    adsenseTag,
    `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>`
  ].join('\n  ');

  // Clean existing head metadata tags in baseHtml
  html = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']naver-site-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']yandex-verification["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']msvalidate\.01["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']sitemap["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${headMetadata}\n</head>`);
  }

  // SSR Article HTML Injection into <section id="card-root">
  const ownerHeadline = effectiveName
    ? (dict.ownerTitle ? dict.ownerTitle.replace('{name}', effectiveName) : `${effectiveName}님에게 어울리는 직업은`)
    : (dict.brandHeader || '나에게 어울리는 직업');

  const zoneBadgeText = displayJob.zoneLabel || (displayJob.zone === 'GOOD' ? '대박 직업' : '폭망 직업');
  const realityBadgeText = displayJob.realityLabel || (displayJob.realityType === 'REAL' ? '실제 직업' : '허구·상상');
  const catBadgeText = displayJob.categoryLabel || displayJob.category;
  const tierBadgeText = displayJob.tierName || `Tier ${displayJob.tier || 1}`;

  const ssrArticleHtml = `
      <article class="appraisal-card seo-house-ssr seo-job-ssr ${displayJob.zone === 'GOOD' ? 'zone-good' : 'zone-bad'}" id="appraisal-certificate" data-level="${levelNum}">
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

        <h1 class="job-title-main" id="cert-title">${escapeHtml(displayJob.title)}</h1>

        <div class="artwork-container">
          <img src="${ogImageUrl}"
               alt="${escapeHtml(displayJob.title)} - ${escapeHtml(dict.brandHeader || 'MyJob')}"
               class="artwork-img"
               width="1024"
               height="1024"
               loading="eager"
               decoding="async"
               onerror="this.onerror=null; this.src='/favicon.svg';" />
        </div>

        <div class="specs-grid">
          <dl class="spec-dl">
            <dt>${escapeHtml(dict.specs?.builtYearLabel || '언제 하던 직업인지')}</dt>
            <dd class="spec-built-year">${escapeHtml(displayJob.era || displayJob.builtYear || '동시대 및 다중우주')}</dd>
            <dt>${escapeHtml(dict.specs?.estimatedValueLabel || '추산되는 연봉')}</dt>
            <dd class="spec-estimated-value">${escapeHtml(displayJob.estimatedSalary || displayJob.estimatedValue || '측정 불가')}</dd>
            <dt>${escapeHtml(dict.specs?.specialFeatureLabel || '직업의 특별한 역할·할일')}</dt>
            <dd class="spec-special-feature">${escapeHtml(displayJob.specialDuty || displayJob.specialFeature || '상상을 초월하는 특별 임무 수행')}</dd>
            <dt>${escapeHtml(dict.specs?.aiVerdictLabel || 'AI 인사팀장 총평')}</dt>
            <dd class="spec-ai-verdict">${escapeHtml(displayJob.aiVerdict || '다중우주 인사발령원에서 보증하는 독보적인 커리어입니다.')}</dd>
          </dl>
        </div>
      </article>`;

  // Inject into <section id="card-root"></section>
  const cardRootRegex = /<section\s+id=["']card-root["'][^>]*>([\s\S]*?)<\/section>/i;
  if (cardRootRegex.test(html)) {
    html = html.replace(cardRootRegex, `<section id="card-root">${ssrArticleHtml}\n${renderCrossLevelSectionHtml(levelNum, effectiveName, selectedLang, 'job', MAX_LEVEL)}</section>`);
  }

  // Inject initial data before </body>
  const initialDataPayload = {
    ...displayJob,
    level: levelNum,
    name: effectiveName,
    imageUrl: ogImageUrl,
    ogImageUrl
  };

  const scriptTag = `  <script>window.__INITIAL_JOB_DATA__ = ${JSON.stringify(initialDataPayload)}; window.__INITIAL_HOUSE_DATA__ = window.__INITIAL_JOB_DATA__;</script>\n</body>`;
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, scriptTag);
  } else {
    html += scriptTag;
  }

  return html;
}

/**
 * 이상형 월드컵 전용 SEO SSR HTML 생성 (/worldcup, /worldcup/worst-to-best, /worldcup/best-to-worst)
 */
export function renderWorldCupSeoHtml(baseHtml, mode = 'worst-to-best', origin = SITE_ORIGIN, lang = 'ko', wcParams = {}) {
  const selectedLang = LANGUAGE_MAP[lang] ? lang : 'ko';
  let html = (typeof baseHtml === 'string' && baseHtml.trim().length > 0)
    ? baseHtml
    : getFallbackHtmlTemplate(selectedLang);

  const seoConfigs = {
    'overview': {
      path: '/worldcup',
      title: '나의 직업 고르기 이상형 월드컵 - 직업 이상형 월드컵 32강·64강·128강 | MyJob',
      desc: '내가 원하는 직업의 마지노선은? 16강·32강·64강·128강·256강 토너먼트로 즐기는 나의 직업 고르기 이상형 월드컵! 최악의 직업 중 최선 뽑기와 대박 직업 중 최악 뽑기를 지금 시작해보세요.',
      keywords: '나의 직업 고르기 이상형 월드컵, 직업 이상형 월드컵, 최악의 직업 중 최선의 직업 월드컵, 최선의 직업 중 최악의 직업 월드컵, 32강 직업 월드컵, 64강 직업 월드컵, 128강 직업 월드컵, 재미로 보는 직업 테스트, MyJob',
      ogImg: `${origin}/r2/jobs/00628.webp`,
      headline: '🏆 나의 직업 고르기 이상형 월드컵 — 내가 원하는 직업은?',
      faqQ: '직업 이상형 월드컵에서는 어떤 모드를 플레이할 수 있나요?',
      faqA: 'Lv.0~499 폭망 직업 500종 중 그나마 출근할 만한 최선을 고르는 월드컵과 Lv.500~1,000 대박 직업 501종 중 의외로 가장 하기 싫은 최악을 뽑는 월드컵 두 가지를 16강·32강·64강·128강·256강으로 즐길 수 있습니다.'
    },
    'worst-to-best': {
      path: '/worldcup/worst-to-best',
      title: '최악의 직업 중 최선의 직업 월드컵 - 32강·64강·128강 | MyJob',
      desc: 'Lv.0~499 폭망 직업 500종 중 그나마 출근할 만한 최선의 직업을 골라보세요! 극한 노동과 바닥 연봉 속 최선의 선택, 직업 이상형 월드컵.',
      keywords: '최악의 직업 중 최선의 직업 월드컵, 최악의 직업 월드컵, 폭망 직업 월드컵, 나의 직업 고르기 이상형 월드컵, 직업 이상형 월드컵, 32강 64강 128강, MyJob',
      ogImg: `${origin}/r2/jobs/00000.webp`,
      headline: '💀 최악의 직업 중 최선의 직업 월드컵 — 폭망 직업(Lv.0~499) 중 최선은?',
      faqQ: '최악의 직업 중 최선 월드컵은 어떤 게임인가요?',
      faqA: '고대 콜로세움 맹수 우리 청소부, 눈사람 박대기 기자, 골방백수 등 0~499단계 최악의 직업 중 무작위 16강~256강 대진표에서 그나마 출근할 만한 직업을 골라내는 토너먼트입니다.'
    },
    'best-to-worst': {
      path: '/worldcup/best-to-worst',
      title: '최선의 직업 중 최악의 직업 월드컵 - 32강·64강·128강 | MyJob',
      desc: 'Lv.500~1,000 초고액 연봉·미래 대박 직업 501종 중 의외로 가장 하기 싫은 최악의 직업을 뽑아보세요! 배부른 고민, 좋은 직업 이상형 월드컵.',
      keywords: '최선의 직업 중 최악의 직업 월드컵, 대박 직업 월드컵, 최선 중 최악 월드컵, 나의 직업 고르기 이상형 월드컵, 직업 이상형 월드컵, 32강 64강 128강, MyJob',
      ogImg: `${origin}/r2/jobs/01000.webp`,
      headline: '🌟 최선의 직업 중 최악의 직업 월드컵 — 대박 직업(Lv.500~1000) 중 최악은?',
      faqQ: '최선의 직업 중 최악 월드컵은 어떻게 진행되나요?',
      faqA: '무인도 별장 관리인, 화성 테라포밍 총감독관, 다중우주 창조 아키텍트 등 초호화 직업 중 가장 부담스럽거나 아찔한 최악의 직업을 가려냅니다.'
    }
  };

  const cfg = seoConfigs[mode] || seoConfigs['worst-to-best'];
  const isKorean = selectedLang === 'ko';
  const wcT = getWorldCupTranslation(selectedLang);
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['ko'];
  const ogLocale = (LANGUAGE_MAP[selectedLang]?.locale || 'ko-KR').replace('-', '_');

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
        ? `${wcT.bestToWorst.title} | ${dict.brandHeader || 'MyJob'}`
        : (mode === 'worst-to-best'
            ? `${wcT.worstToBest.title} | ${dict.brandHeader || 'MyJob'}`
            : `${wcT.tabWorst} · ${wcT.tabBest} | ${dict.brandHeader || 'MyJob'}`));

  let localizedDesc = isKorean
    ? cfg.desc
    : (mode === 'best-to-worst'
        ? wcT.bestToWorst.subtitle
        : wcT.worstToBest.subtitle);

  let bracketPrefix = '';
  if (hasSameCondition) {
    bracketPrefix = isKorean
      ? `[${roundNum}강 동일 조건 대진표 #${seedNum}] `
      : `[${roundNum}-Match Same Condition Bracket #${seedNum}] `;
    localizedTitle = `${bracketPrefix}${localizedTitle}`;
    localizedDesc = `${bracketPrefix}${localizedDesc}`;
  }

  const hreflangTags = SUPPORTED_LANGUAGES.map(l => {
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
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': localizedTitle,
        'description': localizedDesc,
        'inLanguage': LANGUAGE_MAP[selectedLang]?.locale || 'ko-KR'
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
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="sitemap" type="application/xml" title="MyJob Sitemap" href="${SITE_ORIGIN}/sitemap.xml" />`,
    '<link rel="sitemap" type="application/xml" title="Photodiary Sitemap" href="https://photodiary.tellmyname.app/sitemap.xml" />',
    '<link rel="sitemap" type="application/xml" title="MyHome Sitemap" href="https://tellmyname.app/sitemap.xml" />',
    '<link rel="sitemap" type="application/xml" title="Food Sitemap" href="https://tellmyname.app/food/sitemap.xml" />',
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
    .replace(/<link\s+rel=["']sitemap["'][^>]*>/gi, '')
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
    // Route 1: GET /r2/jobs/:filename AND GET /r2/houses/:filename (동일 도메인 R2 CDN 라우터)
    // ----------------------------------------------------
    if (pathname.startsWith('/r2/jobs/') || pathname.startsWith('/r2/houses/')) {
      const match = pathname.match(/^\/r2\/(?:jobs|houses)\/(\d{1,5})\.(webp|svg|png|jpg|json)$/i);
      if (match) {
        const rawLv = parseInt(match[1], 10);
        const ext = match[2].toLowerCase();
        const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, isNaN(rawLv) ? 0 : rawLv));
        const padded = String(level).padStart(5, '0');

        // .json 라이선스 메타데이터 요청 처리
        if (ext === 'json') {
          const r2Bucket = env?.OCCUPATION_R2 || env?.MYHOME_R2;
          if (r2Bucket && typeof r2Bucket.get === 'function') {
            try {
              const object = await r2Bucket.get('jobs/' + padded + '.json') || await r2Bucket.get('houses/' + padded + '.json');
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

        // Cloudflare R2 버킷 조회 (.webp 우선, 미존재 시 .png 조회)
        const r2Bucket = env?.OCCUPATION_R2 || env?.MYHOME_R2;
        if (r2Bucket && typeof r2Bucket.get === 'function') {
          try {
            const isHouseRoute = pathname.startsWith('/r2/houses/');
            const keysToCheck = isHouseRoute
              ? ['houses/' + padded + '.webp', 'houses/' + padded + '.png']
              : ['jobs/' + padded + '.webp', 'jobs/' + padded + '.png'];
            for (const key of keysToCheck) {
              const object = await r2Bucket.get(key);
              if (object) {
                const isPng = key.endsWith('.png');
                const headers = new Headers();
                headers.set('Content-Type', object.httpMetadata?.contentType || (isPng ? 'image/png' : 'image/webp'));
                headers.set('Cache-Control', 'public, max-age=31536000, immutable');
                headers.set('Access-Control-Allow-Origin', '*');
                if (object.httpEtag) headers.set('ETag', object.httpEtag);
                return new Response(object.body, { status: 200, headers });
              }
            }
          } catch (err) {
            // fallback
          }
        }

        // R2 미존재 또는 미업로드 시 엣지에서 즉시 벡터 SVG 생성 반환
        const concept = getJobConceptByLevel(level);
        const svg = renderJobArtworkSvg(concept);
        return new Response(svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      return new Response('Job image not found', {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // ----------------------------------------------------
    // Route 2: GET /api/job/:level, GET /api/house/:level, GET /api/name/:name, GET /api/level-name/:level
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

    if (pathname.startsWith('/api/job/') || pathname.startsWith('/api/house/')) {
      const prefix = pathname.startsWith('/api/job/') ? '/api/job/' : '/api/house/';
      const rawLv = pathname.slice(prefix.length);
      const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, parseInt(rawLv, 10) || 0));
      const job = getJobConceptByLevel(level);
      const outputJob = lang === 'ko' ? job : localizeJob(job, lang);
      return new Response(JSON.stringify(outputJob, null, 2), {
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

      const strokeData = analyzeNameToJob(decodedName);
      const concept = getJobConceptByLevel(strokeData.level);
      const baseJob = {
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      };
      const job = lang === 'ko' ? baseJob : localizeJob(baseJob, lang, decodedName);

      return new Response(JSON.stringify(job, null, 2), {
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

      const strokeData = analyzeNameToJob(decodedName);
      const concept = getJobConceptByLevel(strokeData.level);
      const job = {
        ...concept,
        ...strokeData,
        name: decodedName,
        title: concept.title
      };

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, job, decodedName, origin, lang);
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
      const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, parseInt(rawLv, 10) || 0));
      const concept = getJobConceptByLevel(level);
      const job = { ...concept };

      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, job, null, origin, lang);
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
    if (pathname === '/worldcup' || pathname === '/worldcup/' || pathname === '/worldcup/worst-to-best' || pathname === '/worldcup/best-to-worst') {
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
      const defaultName = lang === 'ko' ? '김서윤' : (LANGUAGE_MAP[lang]?.sampleNames?.[0] || 'Steve');
      const strokeData = analyzeNameToJob(defaultName);
      const defaultLv = strokeData.level;
      const concept = getJobConceptByLevel(defaultLv);
      const job = {
        ...concept,
        ...strokeData,
        level: defaultLv,
        name: defaultName,
        title: concept.title
      };
      const baseHtml = await getBaseHtml();
      const html = renderSeoHtml(baseHtml, job, defaultName, origin, lang, true);
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
    // Route 5: GET /robots.txt, GET /ads.txt & IndexNow Key
    // ----------------------------------------------------
    if (pathname === '/robots.txt') {
      const robotsTxt = [
        '# Robots.txt for https://tellmyname.app/job',
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
        'Sitemap: https://photodiary.tellmyname.app/sitemap.xml',
        'Sitemap: https://tellmyname.app/sitemap.xml',
        'Sitemap: https://tellmyname.app/food/sitemap.xml',
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
        if (assetRes.status === 200) return assetRes;
      }
      const today = new Date().toISOString().slice(0, 10);
      const sitemapIndexXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-main.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-images.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-names-1.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-names-2.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        '    <loc>https://photodiary.tellmyname.app/sitemap.xml</loc>',
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        '    <loc>https://tellmyname.app/sitemap.xml</loc>',
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        '    <loc>https://tellmyname.app/food/sitemap.xml</loc>',
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
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
