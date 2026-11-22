// scripts/generate_static_site.mjs
// 정적 호스팅(Cloudflare Pages)을 위한 프로덕션 빌드 스크립트:
// 1. dist/ 디렉토리 초기화
// 2. scripts/build_web.mjs 실행 (web/ -> dist/ 복사, data/ -> dist/data/*.json 경량화)
// 3. 상위 300개 인기 이름에 대한 경량 pSEO 랜딩 페이지 (dist/name/{name}/index.html) 생성
// 4. sitemap.xml, sitemap-surnames.xml, robots.txt, rss.xml, ads.txt, privacy/terms 자산 구축

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { CURATED_NAMES } from '../web/js/phonetic_data.js';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('[build:static] Starting static site generation...');

// (a) dist/ 디렉토리 완전 삭제
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// (b) scripts/build_web.mjs 실행
console.log('[build:static] Running scripts/build_web.mjs...');
execSync('node scripts/build_web.mjs', { stdio: 'inherit', cwd: rootDir });

// Site Origin 결정 (도메인: tellmyname.app)
let siteOrigin = process.env.SITE_ORIGIN || process.env.CF_PAGES_URL || 'https://tellmyname.app';
if (!siteOrigin.startsWith('http://') && !siteOrigin.startsWith('https://')) {
  siteOrigin = `https://${siteOrigin}`;
}
siteOrigin = siteOrigin.replace(/\/$/, '');

// AdSense 설정 로드
let adsConfig = {
  enabled: true,
  publisherId: 'ca-pub-8793936135959956',
  autoAds: true
};
const adsConfigPath = path.join(rootDir, 'config/adsense.config.json');
if (fs.existsSync(adsConfigPath)) {
  try {
    adsConfig = { ...adsConfig, ...JSON.parse(fs.readFileSync(adsConfigPath, 'utf8')) };
  } catch {}
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// SPA Shell 읽기 (dist/index.html)
const spaShellPath = path.join(distDir, 'index.html');
let baseHtml = fs.readFileSync(spaShellPath, 'utf8');
// Normalize title in dist/index.html if needed
baseHtml = baseHtml.replace(/<title>[\s\S]*?(?:<\/title>|\?\/title>)/i, '<title>이름을 설명해드립니다</title>');
fs.writeFileSync(spaShellPath, baseHtml, 'utf8');

// dist/data/names.json 로드
const names = JSON.parse(fs.readFileSync(path.join(distDir, 'data/names.json'), 'utf8'));

// (c) 상위 300개 이름에 대해 경량 SEO 페이지 생성 (dist/name/{name}/index.html)
const seoStaticLimit = 300;
const targetNames = names.slice(0, seoStaticLimit);
console.log(`[build:static] Generating ${targetNames.length} SEO landing pages under dist/name/{name}/...`);

for (const item of targetNames) {
  const name = item[0];
  const hanja = item[2] || '';
  const meaning = item[4] || '';
  const teaser7 = meaning.slice(0, 7) + '...';

  const pageTitle = `${name} 이름 뜻·한자·의미 풀이 | 이름을 설명해드립니다`;
  const pageDesc = `'${name}${hanja ? `(${hanja})` : ''}'의 이름 뜻: "${meaning}" — 대법원 인명용 한자 풀이와 상세 의미를 확인해보세요.`;
  const canonicalUrl = `${siteOrigin}/name/${encodeURIComponent(name)}/`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        'name': `${name} (${hanja})`,
        'description': `${teaser7} (이름을 설명해드립니다)`,
        'url': canonicalUrl
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `'${name}' 이름 뜻은 무엇인가요?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `'${name}(${hanja})'의 뜻은 "${teaser7}"을(를) 비롯하여 대법원 인명용 한자와 시적 해설을 담고 있습니다. 이름을 설명해드립니다에서 전체 뜻풀이를 확인하세요.`
            }
          }
        ]
      }
    ]
  };

  const headInjections = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="이름을 설명해드립니다" />`,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>`
  ];

  if (adsConfig.enabled && adsConfig.publisherId && !baseHtml.includes(adsConfig.publisherId)) {
    headInjections.unshift(
      `<meta name="google-adsense-account" content="${adsConfig.publisherId}" />`,
      `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.publisherId}" crossorigin="anonymous"></script>`
    );
  }

  let pageHtml = baseHtml;
  // Replace <title>
  pageHtml = pageHtml.replace(/<title>[\s\S]*?(?:<\/title>|\?\/title>)/i, `<title>${escapeHtml(pageTitle)}</title>`);
  // Replace <meta name="description" ...>
  pageHtml = pageHtml.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
  // Inject tags before </head>
  pageHtml = pageHtml.replace('</head>', `  ${headInjections.join('\n  ')}\n</head>`);

  const koreanSeoBody = `
    <article class="name-card-seo" style="max-width: 540px; margin: 24px auto; padding: 28px 22px; background: #FAF7F2; border-radius: 20px; border: 1px solid rgba(28, 25, 23, 0.08); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
      <span style="font-size: 11px; font-weight: 700; color: #78716C; letter-spacing: 0.06em; text-transform: uppercase;">KOREAN NAME MEANING</span>
      <h1 style="font-size: 36px; font-weight: 800; color: #1C1917; margin: 12px 0 4px; font-family: 'Noto Serif KR', serif;">${escapeHtml(name)}</h1>
      ${hanja ? `<p style="font-size: 16px; font-weight: 600; color: #475569; margin: 0 0 16px;">${escapeHtml(hanja)}</p>` : ''}
      <div style="background: #FFFFFF; border-radius: 12px; padding: 18px 16px; border: 1px solid #E5E7EB; text-align: left; margin-bottom: 18px;">
        <span style="font-size: 11px; font-weight: 700; color: #D97706; display: block; margin-bottom: 6px;">이름에 담긴 시적 의미</span>
        <p style="font-size: 14px; color: #1E293B; line-height: 1.6; margin: 0;">“${escapeHtml(meaning)}”</p>
      </div>
      <p style="font-size: 12.5px; color: #64748B; margin: 0;">이름을 설명해드립니다(Name Teller)에서 전체 한자 뜻풀이를 확인해보세요.</p>
    </article>
  `;
  pageHtml = pageHtml.replace('<section id="card-root"></section>', `<section id="card-root">${koreanSeoBody}</section>`);

  const nameDir = path.join(distDir, 'name', name);
  fs.mkdirSync(nameDir, { recursive: true });
  fs.writeFileSync(path.join(nameDir, 'index.html'), pageHtml, 'utf8');
}

// 3-B. 11개 언어권 540개 인기 외국인 이름 발음 매칭 전용 SEO 랜딩 페이지 생성 (e.g. 'sophia korean name', 'lucas korean name')
console.log(`[build:static] Generating ${CURATED_NAMES.length} Foreign Sounds-Like SEO landing pages under dist/name/{foreign_name}/...`);
const foreignSitemapUrls = [];
const todayIso = new Date().toISOString().slice(0, 10);

for (const entry of CURATED_NAMES) {
  const foreignName = entry.name;
  const slug = foreignName.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!slug) continue;

  const topMatch = entry.matches[0];
  const allMatchStr = entry.matches.map(m => `${m.hangul} (${m.roman})`).join(', ');

  const pageTitle = `${foreignName} Korean Name — Beautiful Names That Sound Like ${foreignName} | Name Teller`;
  const pageDesc = `What is the Korean name for ${foreignName}? Discover beautiful Korean names like ${allMatchStr} that sound similar to ${foreignName} with deep poetic meanings.`;
  const canonicalUrl = `${siteOrigin}/name/${encodeURIComponent(slug)}/`;

  foreignSitemapUrls.push(`  <url><loc>${canonicalUrl}</loc><lastmod>${todayIso}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        'name': `${foreignName} Korean Name`,
        'description': pageDesc,
        'url': canonicalUrl
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `What is the Korean name for ${foreignName}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `The most authentic Korean names that sound like ${foreignName} are ${allMatchStr}. ${topMatch.reason} Korean poetic meaning: "${topMatch.meaning}". Explore full details on Name Teller.`
            }
          }
        ]
      }
    ]
  };

  const headInjections = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:site_name" content="Name Teller" />`,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>`
  ];

  let pageHtml = baseHtml;
  pageHtml = pageHtml.replace(/<title>[\s\S]*?(?:<\/title>|\?\/title>)/i, `<title>${escapeHtml(pageTitle)}</title>`);
  pageHtml = pageHtml.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
  pageHtml = pageHtml.replace('</head>', `  ${headInjections.join('\n  ')}\n</head>`);

  const seoBodyContent = `
    <article class="phonetic-seo-article" style="max-width: 580px; margin: 24px auto; padding: 24px 20px; background: #FAF7F2; border-radius: 20px; border: 1px solid rgba(217, 119, 6, 0.25); box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
      <header style="margin-bottom: 20px; text-align: center;">
        <span style="font-size: 12px; font-weight: 700; color: #D97706; background: rgba(217,119,6,0.12); padding: 3px 9px; border-radius: 999px;">🌐 Foreign Name → Korean Name</span>
        <h1 style="font-size: 24px; font-weight: 800; color: #1C1917; margin: 12px 0 6px;">${escapeHtml(foreignName)} Korean Name</h1>
        <p style="font-size: 13.5px; color: #78716C; margin: 0; line-height: 1.5;">Looking for a Korean name that sounds like <strong>${escapeHtml(foreignName)}</strong>? Here are the top phonetic matches with authentic poetic meanings:</p>
      </header>

      <div class="seo-matches" style="display: flex; flex-direction: column; gap: 14px;">
        ${entry.matches.map((m, idx) => `
          <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #1C1917;">${escapeHtml(m.hangul)}</span>
                <span style="font-size: 14px; font-weight: 600; color: #64748B;">(${escapeHtml(m.roman)})</span>
              </div>
              <span style="font-size: 11px; font-weight: 700; color: #D97706; background: #FEF3C7; padding: 2px 8px; border-radius: 999px;">${idx === 0 ? '🥇 Best Match' : `${idx + 1}nd Match`}</span>
            </div>
            <p style="font-size: 12.5px; color: #475569; margin: 4px 0 8px; line-height: 1.45;"><strong>Sound bridge:</strong> “${escapeHtml(m.reason)}”</p>
            <p style="font-size: 12.5px; color: #1E293B; margin: 0; line-height: 1.45; background: #F8FAFC; padding: 8px 10px; border-radius: 8px;"><strong>Poetic meaning:</strong> ${escapeHtml(m.meaning)}</p>
            <div style="margin-top: 10px; text-align: right;">
              <a href="${siteOrigin}/name/${encodeURIComponent(m.hangul)}/" style="display: inline-block; font-size: 12px; font-weight: 700; color: #D97706; text-decoration: none;">View ${escapeHtml(m.hangul)} Name Card & Anonymous Letters →</a>
            </div>
          </div>
        `).join('')}
      </div>

      <section style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #E5E7EB;">
        <h2 style="font-size: 16px; font-weight: 700; color: #1C1917; margin-bottom: 8px;">About Korean Names Matching “${escapeHtml(foreignName)}”</h2>
        <p style="font-size: 13px; color: #64748B; line-height: 1.6; margin: 0;">On Name Teller (이름을 설명해드립니다), we curate Korean names that harmonize naturally with global sounds while carrying authentic Sino-Korean (Hanja) or Pure Korean (순우리말) roots and literary elegance. Discover the deep personal story behind each name and send or receive heartfelt anonymous letters.</p>
      </section>
    </article>
  `;

  // Inject crawlable rich content directly inside section#card-root
  pageHtml = pageHtml.replace('<section id="card-root"></section>', `<section id="card-root">${seoBodyContent}</section>`);

  const foreignDir = path.join(distDir, 'name', slug);
  fs.mkdirSync(foreignDir, { recursive: true });
  fs.writeFileSync(path.join(foreignDir, 'index.html'), pageHtml, 'utf8');
}

// 3-C. 이름점(이름 궁합) 전용 SEO 랜딩 페이지 생성 (/match/)
console.log('[build:static] Generating Name Compatibility landing page under dist/match/index.html...');
const matchHtmlSource = fs.readFileSync(path.join(rootDir, 'web/match.html'), 'utf8');
const matchDir = path.join(distDir, 'match');
fs.mkdirSync(matchDir, { recursive: true });
fs.writeFileSync(path.join(matchDir, 'index.html'), matchHtmlSource, 'utf8');

// (d) sitemap.xml, sitemap-surnames.xml, sitemap-foreign.xml, robots.txt, rss.xml, ads.txt, privacy/terms
console.log('[build:static] Generating sitemaps, robots.txt, and rss.xml...');

// 1. sitemap.xml (메인, 법적 페이지, 전체 이름)
const sitemapUrls = [
  `  <url><loc>${siteOrigin}/</loc><lastmod>${todayIso}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${siteOrigin}/match/</loc><lastmod>${todayIso}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
  `  <url><loc>${siteOrigin}/privacy.html</loc><lastmod>${todayIso}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
  `  <url><loc>${siteOrigin}/terms.html</loc><lastmod>${todayIso}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
  `  <url><loc>${siteOrigin}/about.html</loc><lastmod>${todayIso}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  `  <url><loc>${siteOrigin}/contact.html</loc><lastmod>${todayIso}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  ...names.map(
    n => `  <url><loc>${siteOrigin}/name/${encodeURIComponent(n[0])}/</loc><lastmod>${todayIso}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  )
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

// 2. 성씨 결합 사이트맵 대폭 확장 (네이버 및 검색엔진 성+이름 검색 공략)
// - 상위 5대 성씨 (김, 이, 박, 최, 정 - 인구 54%): 전체 24,988개 이름 결합 (이유승, 김유승 등 100% 커버)
// - 차상위 15대 성씨 (강, 조, 윤, 장, 임, 한, 오, 서, 신, 권, 황, 안, 송, 전, 홍): 상위 5,000개 이름 결합
const top5Surnames = ['김', '이', '박', '최', '정'];
const next15Surnames = ['강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];

const allSurnameUrls = [];
for (const sur of top5Surnames) {
  for (const n of names) {
    allSurnameUrls.push(`  <url><loc>${siteOrigin}/name/${encodeURIComponent(sur + n[0])}/</loc><lastmod>${todayIso}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  }
}
const top5000Names = names.slice(0, 5000);
for (const sur of next15Surnames) {
  for (const n of top5000Names) {
    allSurnameUrls.push(`  <url><loc>${siteOrigin}/name/${encodeURIComponent(sur + n[0])}/</loc><lastmod>${todayIso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
  }
}

// 45,000개 단위로 sitemap-surnames-1.xml, sitemap-surnames-2.xml ... 분할
const SITEMAP_CHUNK_SIZE = 45000;
const surnameSitemapFiles = [];
for (let i = 0; i < allSurnameUrls.length; i += SITEMAP_CHUNK_SIZE) {
  const chunk = allSurnameUrls.slice(i, i + SITEMAP_CHUNK_SIZE);
  const fileNum = Math.floor(i / SITEMAP_CHUNK_SIZE) + 1;
  const fileName = `sitemap-surnames-${fileNum}.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.join('\n')}\n</urlset>`;
  fs.writeFileSync(path.join(distDir, fileName), xml, 'utf8');
  surnameSitemapFiles.push(fileName);
}
// 하위 호환을 위한 sitemap-surnames.xml 도 1번 파일 복사본으로 유지
fs.copyFileSync(path.join(distDir, surnameSitemapFiles[0]), path.join(distDir, 'sitemap-surnames.xml'));

// 3. sitemap-foreign.xml (11개 언어권 540개 인기 외국인 이름)
const foreignSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${foreignSitemapUrls.join('\n')}\n</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap-foreign.xml'), foreignSitemapXml, 'utf8');

// 4. robots.txt (네이버 Yeti 및 주요 검색엔진 친화형 + 사이트맵 목록)
const surnameSitemapLines = surnameSitemapFiles.map(f => `Sitemap: ${siteOrigin}/${f}`).join('\n');
const robotsTxt = `# Naver Yeti, Googlebot, Daum, Bing 친화형 크롤링 정책
User-agent: *
Allow: /

User-agent: Yeti
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
Sitemap: ${siteOrigin}/sitemap-surnames.xml
${surnameSitemapLines}
Sitemap: ${siteOrigin}/sitemap-foreign.xml
Sitemap: ${siteOrigin}/rss.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

// 5. rss.xml (최신 50개 이름 피드)
const rssItems = names.slice(0, 50).map(n => {
  const name = n[0];
  const hanja = n[2] || '';
  const teaser = (n[4] || '').slice(0, 7) + '...';
  const link = `${siteOrigin}/name/${encodeURIComponent(name)}/`;
  return `    <item>
      <title><![CDATA[${name} 이름 뜻 — "${teaser}" | 이름을 설명해드립니다]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA['${name}(${hanja})'의 이름 뜻: "${teaser}" — 이름을 설명해드립니다]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`;
});
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>이름을 설명해드립니다</title>
    <link>${siteOrigin}/</link>
    <description>세상의 모든 한글 이름에 담긴 아름다운 뜻풀이 </description>
    <language>ko</language>
${rssItems.join('\n')}
  </channel>
</rss>`;
fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf8');

// 5. ads.txt 확인 및 복사
const adsTxtSource = path.join(rootDir, 'public/ads.txt');
if (fs.existsSync(adsTxtSource)) {
  fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
} else {
  const pubNum = adsConfig.publisherId.replace(/^ca-/, '');
  fs.writeFileSync(path.join(distDir, 'ads.txt'), `google.com, ${pubNum}, DIRECT, f08c47fec0942fa0\n`, 'utf8');
}

// 6. privacy.html & terms.html & CNAME 확인 및 복사
for (const f of ['privacy.html', 'terms.html', 'about.html', 'contact.html', 'CNAME']) {
  const src = path.join(rootDir, 'public', f);
  const dst = path.join(distDir, f);
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
  }
}

// 7. _headers 확인 및 복사
for (const f of ['_headers']) {
  const src = path.join(rootDir, 'public', f);
  const dst = path.join(distDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}

// 8. .nojekyll
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

console.log(`[build:static] Build finished successfully!`);
console.log(`  - Output: ${distDir}`);
console.log(`  - 300 SEO name pages generated`);
console.log(`  - sitemap.xml (${sitemapUrls.length} URLs), surname sitemaps (${allSurnameUrls.length} URLs across ${surnameSitemapFiles.length} files)`);
