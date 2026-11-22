// tests/test_feature_6_seo.mjs
// Feature #6 검증 테스트: 50,000개 시드 이름 분할 Sitemap 자동 생성, 네이버 Yeti / 구글 SEO,
// Google 이미지 사이트맵(sitemap-images.xml), Google AdSense(ads.txt),
// 법적 고지 문서(privacy/terms), 보안 캐시 헤더(_headers), Zero-File-Explosion(<50 files) 검증

import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { countFilesRecursively, listFilesRecursively } from '../scripts/generate_static_site.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('=== [Feature #6 Test Suite: Programmatic SEO & Static Site Builder (500 Levels)] ===');

// 1. 구문 검사 (node --check)
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check scripts/generate_static_site.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check tests/test_feature_6_seo.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax checks passed');

// 2. scripts/generate_static_site.mjs 실행
console.log('\n[2/6] Executing static site generation script...');
execSync('node scripts/generate_static_site.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Static site generated successfully');

// 3. Sitemap Index 및 분할 Sitemap (50,000개 URL + 이미지 사이트맵) 검증
console.log('\n[3/6] Verifying sitemap.xml index and split sitemaps (50,000 names + image sitemap)...');
const sitemapIndexPath = path.join(DIST_DIR, 'sitemap.xml');
assert(fs.existsSync(sitemapIndexPath), 'dist/sitemap.xml must exist');

const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
assert(sitemapIndexContent.includes('<sitemapindex'), 'sitemap.xml must have <sitemapindex> tag');
assert(
  sitemapIndexContent.includes('https://myhome.tellmyname.app/sitemap-main.xml'),
  'sitemap.xml must reference sitemap-main.xml'
);
assert(
  sitemapIndexContent.includes('https://myhome.tellmyname.app/sitemap-names-1.xml'),
  'sitemap.xml must reference sitemap-names-1.xml'
);
assert(
  sitemapIndexContent.includes('https://myhome.tellmyname.app/sitemap-names-2.xml'),
  'sitemap.xml must reference sitemap-names-2.xml'
);
assert(
  sitemapIndexContent.includes('https://myhome.tellmyname.app/sitemap-images.xml'),
  'sitemap.xml must reference sitemap-images.xml'
);

// sitemap-names-1.xml 검증
const sitemap1Path = path.join(DIST_DIR, 'sitemap-names-1.xml');
assert(fs.existsSync(sitemap1Path), 'dist/sitemap-names-1.xml must exist');
const sitemap1Content = fs.readFileSync(sitemap1Path, 'utf8');
const loc1Matches = sitemap1Content.match(/<loc>([^<]+)<\/loc>/g) || [];
assert.strictEqual(
  loc1Matches.length,
  25000,
  `dist/sitemap-names-1.xml must contain exactly 25,000 <loc> tags, found ${loc1Matches.length}`
);

// sitemap-names-2.xml 검증
const sitemap2Path = path.join(DIST_DIR, 'sitemap-names-2.xml');
assert(fs.existsSync(sitemap2Path), 'dist/sitemap-names-2.xml must exist');
const sitemap2Content = fs.readFileSync(sitemap2Path, 'utf8');
const loc2Matches = sitemap2Content.match(/<loc>([^<]+)<\/loc>/g) || [];
assert.strictEqual(
  loc2Matches.length,
  25000,
  `dist/sitemap-names-2.xml must contain exactly 25,000 <loc> tags, found ${loc2Matches.length}`
);

// 총합 50,000개 URL 고유성 검증
const allNameUrls = new Set([
  ...loc1Matches.map(m => m.replace(/<\/?loc>/g, '')),
  ...loc2Matches.map(m => m.replace(/<\/?loc>/g, ''))
]);
assert.strictEqual(
  allNameUrls.size,
  50000,
  `Combined sitemap name URLs must be exactly 50,000 unique URLs, found ${allNameUrls.size}`
);
console.log('✔ Sitemaps verified: 25,000 + 25,000 = 50,000 unique name URLs in split sitemaps');

// sitemap-main.xml 검증 (1,000 levels + 5 pages = 1,005 URLs: Home, Privacy, Terms, About, Contact)
const sitemapMainPath = path.join(DIST_DIR, 'sitemap-main.xml');
assert(fs.existsSync(sitemapMainPath), 'dist/sitemap-main.xml must exist');
const sitemapMainContent = fs.readFileSync(sitemapMainPath, 'utf8');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/'), 'Main route missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/privacy.html'), 'privacy.html missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/terms.html'), 'terms.html missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/about.html'), 'about.html missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/contact.html'), 'contact.html missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/level/0'), 'Lv.0 missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/level/999'), 'Lv.999 missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/worldcup'), 'worldcup route missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/worldcup/worst-to-best'), 'worldcup/worst-to-best missing in sitemap-main.xml');
assert(sitemapMainContent.includes('https://myhome.tellmyname.app/worldcup/best-to-worst'), 'worldcup/best-to-worst missing in sitemap-main.xml');
const mainLocMatches = sitemapMainContent.match(/<loc>([^<]+)<\/loc>/g) || [];
assert.strictEqual(mainLocMatches.length, 1008, `sitemap-main.xml must contain 1008 URLs, found ${mainLocMatches.length}`);
console.log('✔ sitemap-main.xml verified: 1,008 URLs (Home, WorldCup x3, Legal, About, Contact, 1,000 house levels)');

// sitemap-images.xml 검증
const sitemapImagesPath = path.join(DIST_DIR, 'sitemap-images.xml');
assert(fs.existsSync(sitemapImagesPath), 'dist/sitemap-images.xml must exist');
const sitemapImagesContent = fs.readFileSync(sitemapImagesPath, 'utf8');
assert(sitemapImagesContent.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'sitemap-images.xml must have image schema namespace');
const imageMatches = sitemapImagesContent.match(/<image:loc>/g) || [];
assert.strictEqual(imageMatches.length, 1000, `dist/sitemap-images.xml must contain 1000 images, got ${imageMatches.length}`);
console.log('✔ sitemap-images.xml verified: 1,000 images registered with Google Image Sitemap schema');

// 4. 네이버 Yeti 및 크롤러 정책 (robots.txt) 검증
console.log('\n[4/6] Verifying robots.txt search engine directives...');
const robotsPath = path.join(DIST_DIR, 'robots.txt');
assert(fs.existsSync(robotsPath), 'dist/robots.txt must exist');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');

assert(robotsContent.includes('User-agent: Yeti'), 'robots.txt must contain User-agent: Yeti for Naver');
assert(robotsContent.includes('User-agent: Googlebot'), 'robots.txt must contain User-agent: Googlebot');
assert(robotsContent.includes('User-agent: kakaotalk-scrap'), 'robots.txt must contain User-agent: kakaotalk-scrap');
assert(robotsContent.includes('User-agent: facebookexternalhit'), 'robots.txt must contain User-agent: facebookexternalhit');
assert(robotsContent.includes('User-agent: *'), 'robots.txt must contain User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt must allow root crawling');
assert(
  robotsContent.includes('https://myhome.tellmyname.app/sitemap.xml'),
  'robots.txt must include Sitemap: https://myhome.tellmyname.app/sitemap.xml'
);
assert(
  robotsContent.includes('https://myhome.tellmyname.app/sitemap-images.xml'),
  'robots.txt must include Sitemap: https://myhome.tellmyname.app/sitemap-images.xml'
);
assert(
  robotsContent.includes('https://myhome.tellmyname.app/rss.xml'),
  'robots.txt must include Sitemap: https://myhome.tellmyname.app/rss.xml'
);
console.log('✔ robots.txt verified: Yeti, Googlebot, Social scrapers allowed + Sitemaps registered');

// 5. 네이버 서치어드바이저 RSS 2.0 피드 (rss.xml) 검증
console.log('\n[5/6] Verifying RSS 2.0 feed (dist/rss.xml)...');
const rssPath = path.join(DIST_DIR, 'rss.xml');
assert(fs.existsSync(rssPath), 'dist/rss.xml must exist');
const rssContent = fs.readFileSync(rssPath, 'utf8');

assert(rssContent.includes('<rss version="2.0"'), 'rss.xml must be valid RSS 2.0');
assert(rssContent.includes('<channel>'), 'rss.xml must contain <channel>');
assert(rssContent.includes('<title>나에게 어울리는 집'), 'rss.xml channel title missing');
assert(rssContent.includes('<link>https://myhome.tellmyname.app</link>'), 'rss.xml channel link missing');
const rssItems = rssContent.match(/<item>/g) || [];
assert.strictEqual(rssItems.length, 50, `dist/rss.xml must contain exactly 50 curated items, got ${rssItems.length}`);
assert(rssContent.includes('<guid isPermaLink="true">'), 'rss.xml items must have guid');
console.log('✔ RSS 2.0 verified: valid XML with 50 curated house appraisals');

// 6. Zero-File-Explosion & 법적 고지/보안 헤더/AdSense 검증
console.log('\n[6/6] Verifying Zero-File-Explosion contract (< 50 files) and assets...');
const allDistFiles = listFilesRecursively(DIST_DIR);
console.log(`Total files in dist/: ${allDistFiles.length}`);
assert(
  allDistFiles.length < 50,
  `Zero-File-Explosion violation! Expected < 50 files in dist/, found ${allDistFiles.length}`
);

// 20개 청크 파일 확인
for (let i = 0; i < 20; i++) {
  const chunkName = `data/chunks/houses-chunk-${String(i).padStart(2, '0')}.json`;
  assert(
    allDistFiles.includes(chunkName),
    `Missing chunk in dist: ${chunkName}`
  );
}

// 라이브러리 파일 확인 (브라우저 ESM 호환)
assert(allDistFiles.includes('js/lib/hash.js'), 'dist/js/lib/hash.js must exist');
assert(allDistFiles.includes('js/lib/taxonomy.js'), 'dist/js/lib/taxonomy.js must exist');
assert(allDistFiles.includes('js/lib/constants.js'), 'dist/js/lib/constants.js must exist');

// 법적 문서 및 메타 파일 확인
assert(allDistFiles.includes('privacy.html'), 'dist/privacy.html must exist');
assert(allDistFiles.includes('terms.html'), 'dist/terms.html must exist');
assert(allDistFiles.includes('_headers'), 'dist/_headers must exist');
assert(allDistFiles.includes('ads.txt'), 'dist/ads.txt must exist');
assert(allDistFiles.includes('.nojekyll'), 'dist/.nojekyll must exist');

// ads.txt 내용 검증
const adsTxtContent = fs.readFileSync(path.join(DIST_DIR, 'ads.txt'), 'utf8');
assert(adsTxtContent.includes('pub-8793936135959956'), 'dist/ads.txt must contain pub-8793936135959956');
console.log('✔ dist/ads.txt verified: contains pub-8793936135959956');

// _headers 내용 검증 (장기 캐시 계약 확인)
const headersContent = fs.readFileSync(path.join(DIST_DIR, '_headers'), 'utf8');
assert(
  headersContent.includes('/data/chunks/*') && headersContent.includes('Cache-Control: public, max-age=31536000, immutable'),
  '_headers must configure long cache for /data/chunks/*'
);
assert(
  headersContent.includes('/r2/houses/*') && headersContent.includes('Cache-Control: public, max-age=31536000, immutable'),
  '_headers must configure long cache for /r2/houses/*'
);

console.log('✔ Zero-File-Explosion confirmed: Exactly ' + allDistFiles.length + ' files in dist/ (< 50)');
console.log('✔ All Feature #6 SEO & Static Site Builder requirements passed perfectly!\n');
