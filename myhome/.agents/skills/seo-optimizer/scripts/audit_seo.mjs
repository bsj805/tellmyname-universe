#!/usr/bin/env node
// Automated Global SEO Audit Script (Naver Search Advisor, Google Search Central, Yandex Webmaster, Bing Webmaster, IndexNow)
// Usage: node audit_seo.mjs <url> (e.g., node audit_seo.mjs https://myhome.tellmyname.app)

const targetUrl = process.argv[2] || 'https://myhome.tellmyname.app';
const INDEXNOW_KEY = 'a8f4c2e9b1d703654e2a9c8b7d6f1e3a';

function extractTagContent(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

async function runAudit(baseUrl) {
  const origin = new URL(baseUrl).origin;
  console.log(`=== [Global SEO Audit: Naver · Google · Yandex · Bing · IndexNow] Target: ${origin} ===\n`);
  let warnings = 0;

  const check = (label, ok, detail) => {
    const icon = ok ? '✔ [PASS]' : '✖ [WARN]';
    if (!ok) warnings++;
    console.log(`${icon} ${label}: ${detail}`);
  };

  // 1. Fetch Root Page (/)
  const rootRes = await fetch(`${origin}/`, { redirect: 'manual' });
  check('Root HTTP Status (200 OK)', rootRes.status === 200, `Status ${rootRes.status}`);
  const html = await rootRes.text();

  // 2. Title & OG Title (<= 40 chars for Naver Search Advisor)
  const title = extractTagContent(html, /<title>([\s\S]*?)<\/title>/i);
  check(
    'Site Title (<title> <= 40 chars)',
    Boolean(title && title.length > 0 && title.length <= 40),
    `"${title}" (${title ? title.length : 0} chars)`
  );

  const ogTitle = extractTagContent(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  check(
    'Open Graph Title (og:title <= 40 chars)',
    Boolean(ogTitle && ogTitle.length > 0 && ogTitle.length <= 40),
    `"${ogTitle}" (${ogTitle ? ogTitle.length : 0} chars)`
  );

  // 3. Description & OG Description (<= 80 chars for Naver Search Advisor)
  const desc = extractTagContent(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  check(
    'Site Description (description <= 80 chars)',
    Boolean(desc && desc.length > 0 && desc.length <= 80),
    `"${desc}" (${desc ? desc.length : 0} chars)`
  );

  const ogDesc = extractTagContent(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  check(
    'Open Graph Description (og:description <= 80 chars)',
    Boolean(ogDesc && ogDesc.length > 0 && ogDesc.length <= 80),
    `"${ogDesc}" (${ogDesc ? ogDesc.length : 0} chars)`
  );

  // 4. Canonical URL on Root
  const canonical = extractTagContent(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const expectedCanonical1 = `${origin}/`;
  const expectedCanonical2 = origin;
  check(
    'Root Canonical URL matches Root Domain',
    canonical === expectedCanonical1 || canonical === expectedCanonical2,
    `canonical="${canonical}"`
  );

  // 5. Webmaster Site Verifications (Naver, Yandex, Bing)
  const naverVerif = extractTagContent(html, /<meta\s+name=["']naver-site-verification["']\s+content=["']([^"']*)["']/i);
  check(
    'Naver Search Advisor Verification (naver-site-verification)',
    Boolean(naverVerif && !naverVerif.includes('placeholder')),
    `content="${naverVerif}"`
  );

  const yandexVerif = extractTagContent(html, /<meta\s+name=["']yandex-verification["']\s+content=["']([^"']*)["']/i);
  check(
    'Yandex Webmaster Verification (yandex-verification)',
    Boolean(yandexVerif && yandexVerif.length > 0),
    `content="${yandexVerif}"`
  );

  const bingVerif = extractTagContent(html, /<meta\s+name=["']msvalidate\.01["']\s+content=["']([^"']*)["']/i);
  check(
    'Bing Webmaster Verification (msvalidate.01)',
    Boolean(bingVerif && bingVerif.length > 0),
    `content="${bingVerif}"`
  );

  // 6. OpenGraph Image & Twitter Card
  const ogImage = extractTagContent(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  check('Open Graph Image (og:image)', Boolean(ogImage && ogImage.startsWith('http')), `og:image="${ogImage}"`);

  // 7. JSON-LD Structured Data
  const jsonLd = extractTagContent(html, /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  let jsonLdValid = false;
  if (jsonLd) {
    try {
      JSON.parse(jsonLd);
      jsonLdValid = true;
    } catch (_) {}
  }
  check('Schema.org JSON-LD Structured Data', jsonLdValid, jsonLdValid ? 'Valid JSON-LD present' : 'Missing or invalid JSON-LD');

  // 8. Static SEO Body Content (Non-JS Crawler Fallback for Baiduspider / YandexBot / Yeti)
  const hasStaticBodyText = /<h1[^>]*>[\s\S]+?<\/h1>/i.test(html);
  check(
    'Static SEO Body Content (<h1> present without JS)',
    hasStaticBodyText,
    hasStaticBodyText ? 'Semantic <h1> body fallback present' : 'Missing static <h1> in initial HTML'
  );

  // 9. robots.txt (Yeti, Googlebot, Yandex, Bingbot, Baiduspider)
  const robotsRes = await fetch(`${origin}/robots.txt`);
  const robotsText = await robotsRes.text();
  const robotsType = robotsRes.headers.get('content-type') || '';
  const robotsOk =
    robotsRes.status === 200 &&
    robotsType.includes('text/plain') &&
    robotsText.includes('Yeti') &&
    robotsText.includes('Yandex') &&
    robotsText.includes('Baiduspider') &&
    robotsText.includes('Sitemap:');
  check(
    'robots.txt (200 OK, Yeti/Googlebot/Yandex/Bingbot/Baiduspider + Sitemap)',
    robotsOk,
    `Status ${robotsRes.status}, Content-Type: ${robotsType}`
  );

  // 10. IndexNow Key File
  const indexNowRes = await fetch(`${origin}/${INDEXNOW_KEY}.txt`);
  const indexNowText = (await indexNowRes.text()).trim();
  check(
    `IndexNow Key File (/${INDEXNOW_KEY}.txt)`,
    indexNowRes.status === 200 && indexNowText === INDEXNOW_KEY,
    `Status ${indexNowRes.status}, Body matches key=${indexNowText === INDEXNOW_KEY}`
  );

  // 11. sitemap.xml
  const sitemapRes = await fetch(`${origin}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const sitemapOk =
    sitemapRes.status === 200 &&
    (sitemapText.includes('<sitemapindex') || sitemapText.includes('<urlset'));
  check('sitemap.xml (200 OK, Valid XML)', sitemapOk, `Status ${sitemapRes.status}`);

  console.log('\n------------------------------------------------------');
  if (warnings === 0) {
    console.log('🎉 ALL GLOBAL SEO CHECKS (NAVER, GOOGLE, YANDEX, BING, BAIDU, INDEXNOW) PASSED!');
  } else {
    console.log(`⚠️ Completed with ${warnings} warning(s).`);
    process.exitCode = 1;
  }
}

runAudit(targetUrl).catch((err) => {
  console.error('SEO Audit Error:', err);
  process.exit(1);
});
