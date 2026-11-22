// scripts/generate_static_site.mjs
// Zero-File-Explosion Static Site Builder for Cloudflare Pages/Workers & Programmatic SEO
// Feature #6: Sitemap 50k Split, Google Image Sitemap, Naver Yeti / Googlebot SEO, Legal Pages, R2 Caching Headers

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { SITE_ORIGIN, TOTAL_LEVELS, MIN_LEVEL, MAX_LEVEL } from '../src/lib/constants.js';
import { analyzeNameToJob } from '../src/lib/hash.js';
import { getJobConceptByLevel } from '../src/lib/taxonomy.js';
import { getSitemapNameForLevel } from '../src/lib/level_name_map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const WEB_DIR = path.join(ROOT_DIR, 'web');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const SRC_LIB_DIR = path.join(ROOT_DIR, 'src', 'lib');
export const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
export const SEED_NAMES_PATH = path.join(ROOT_DIR, 'data', 'seed_names_50k.json');

/**
 * 재귀적으로 디렉토리 내의 파일 개수를 카운트
 * @param {string} dir
 * @returns {number}
 */
export function countFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFilesRecursively(fullPath);
    } else if (entry.isFile()) {
      count++;
    }
  }
  return count;
}

/**
 * 디렉토리 내 모든 파일 경로를 재귀적으로 수집
 * @param {string} dir
 * @param {string} baseDir
 * @returns {string[]}
 */
export function listFilesRecursively(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursively(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

/**
 * XML 특수문자 이스케이프
 * @param {string} str
 * @returns {string}
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 정적 사이트 및 Programmatic SEO 번들 빌드
 */
export async function buildStaticSite() {
  const startTime = Date.now();
  console.log('=== [Feature #6] Zero-File-Explosion Static Site Builder for MyJob ===');

  // 1. dist 디렉토리 청소 및 재생성
  console.log('\n[1/8] Cleaning and recreating dist/ directory...');
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('✔ Clean dist/ ready');

  // 2. web/ 디렉토리 자산 복사
  console.log('\n[2/8] Copying web/ assets (if available)...');
  let webAssetsCount = 0;
  if (fs.existsSync(WEB_DIR)) {
    // web/index.html
    const indexPath = path.join(WEB_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      fs.copyFileSync(indexPath, path.join(DIST_DIR, 'index.html'));
      webAssetsCount++;
    }

    // web/css/*
    const cssDir = path.join(WEB_DIR, 'css');
    if (fs.existsSync(cssDir)) {
      const distCssDir = path.join(DIST_DIR, 'css');
      fs.mkdirSync(distCssDir, { recursive: true });
      for (const file of fs.readdirSync(cssDir)) {
        const src = path.join(cssDir, file);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, path.join(distCssDir, file));
          webAssetsCount++;
        }
      }
    }

    // web/js/*
    const jsDir = path.join(WEB_DIR, 'js');
    if (fs.existsSync(jsDir)) {
      const distJsDir = path.join(DIST_DIR, 'js');
      fs.mkdirSync(distJsDir, { recursive: true });
      for (const file of fs.readdirSync(jsDir)) {
        const src = path.join(jsDir, file);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, path.join(distJsDir, file));
          webAssetsCount++;
        }
      }
    }
  }
  console.log(`✔ Copied ${webAssetsCount} web asset files`);

  // 3. src/lib/* -> dist/js/lib/* 복사 (브라우저 ESM ./lib/* 임포트 경로 보장)
  console.log('\n[3/8] Copying src/lib/* to dist/js/lib/* for browser ESM...');
  const distLibDir = path.join(DIST_DIR, 'js', 'lib');
  fs.mkdirSync(distLibDir, { recursive: true });
  const libFiles = fs.readdirSync(SRC_LIB_DIR);
  let copiedLibCount = 0;
  for (const file of libFiles) {
    if (file === 'gemini_client.js' || file === 'r2_storage.js') continue;
    const srcPath = path.join(SRC_LIB_DIR, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, path.join(distLibDir, file));
      copiedLibCount++;
    }
  }
  console.log(`✔ Copied ${copiedLibCount} library files into dist/js/lib/`);

  // 4. data/chunks/jobs-chunk-00.json .. jobs-chunk-19.json 복사
  console.log('\n[4/8] Copying 20 master job chunks (jobs-chunk-00.json .. 19.json)...');
  const distChunksDir = path.join(DIST_DIR, 'data', 'chunks');
  fs.mkdirSync(distChunksDir, { recursive: true });
  let copiedChunksCount = 0;
  for (let i = 0; i < 20; i++) {
    const jobFilename = `jobs-chunk-${String(i).padStart(2, '0')}.json`;
    const houseFilename = `houses-chunk-${String(i).padStart(2, '0')}.json`;
    const srcJob = path.join(CHUNKS_DIR, jobFilename);
    const srcHouse = path.join(CHUNKS_DIR, houseFilename);

    if (fs.existsSync(srcJob)) {
      fs.copyFileSync(srcJob, path.join(distChunksDir, jobFilename));
      copiedChunksCount++;
    } else if (fs.existsSync(srcHouse)) {
      fs.copyFileSync(srcHouse, path.join(distChunksDir, jobFilename));
      copiedChunksCount++;
    } else {
      console.warn(`[Warning] Chunk file missing: ${srcJob}`);
    }
  }
  console.log(`✔ Successfully copied ${copiedChunksCount} JSON chunks to dist/data/chunks/`);

  // 5. 50,000 시드 이름 읽기 및 분할 Sitemap 생성
  console.log('\n[5/8] Reading 50,000 seed names & generating split XML sitemaps...');
  if (!fs.existsSync(SEED_NAMES_PATH)) {
    throw new Error(`Seed names file missing: ${SEED_NAMES_PATH}`);
  }
  const seedNames = JSON.parse(fs.readFileSync(SEED_NAMES_PATH, 'utf8'));
  assert.strictEqual(seedNames.length, 50000, `Expected 50,000 names, got ${seedNames.length}`);

  const today = new Date().toISOString().slice(0, 10);

  // 5-a. dist/sitemap-main.xml (Main routes + 14-language xhtml:link hreflang + 1,001 job levels)
  const SUPPORTED_LANG_CODES = ['ko', 'en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
  const rootHreflangXml = SUPPORTED_LANG_CODES.map(code =>
    `    <xhtml:link rel="alternate" hreflang="${code}" href="${code === 'ko' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/?lang=${code}`}" />`
  ).concat([
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />`
  ]);

  const xmlMain = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/</loc>`,
    ...rootHreflangXml,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/worldcup</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/worldcup/worst-to-best</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/worldcup/best-to-worst</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/privacy.html</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>yearly</changefreq>',
    '    <priority>0.3</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/terms.html</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>yearly</changefreq>',
    '    <priority>0.3</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/about.html</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.5</priority>',
    '  </url>',
    '  <url>',
    `    <loc>${SITE_ORIGIN}/contact.html</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.5</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://photodiary.tellmyname.app/</loc>',
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>0.8</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://myhome.tellmyname.app/</loc>',
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>0.8</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://food.tellmyname.app/</loc>',
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>0.8</priority>',
    '  </url>'
  ];

  // All 1,001 levels from Lv.0 to Lv.1000
  for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
    xmlMain.push(
      '  <url>',
      `    <loc>${SITE_ORIGIN}/level/${lv}</loc>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>'
    );
  }
  xmlMain.push('</urlset>');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-main.xml'), xmlMain.join('\n'), 'utf8');

  // 5-d. dist/sitemap-images.xml (Google Image Sitemap for 1,001 levels)
  console.log('\n[5-d] Generating sitemap-images.xml with Google Image Sitemap schema...');
  const xmlImages = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  ];

  for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
    const job = getJobConceptByLevel(lv);
    const koName = getSitemapNameForLevel(lv, 'ko');
    const enName = getSitemapNameForLevel(lv, 'en');
    const padded = String(lv).padStart(5, '0');
    const imageUrl = `${SITE_ORIGIN}/r2/jobs/${padded}.webp`;
    const pageUrl = `${SITE_ORIGIN}/level/${lv}`;

    xmlImages.push(
      '  <url>',
      `    <loc>${pageUrl}</loc>`,
      '    <image:image>',
      `      <image:loc>${imageUrl}</image:loc>`,
      `      <image:title>${escapeXml(enName)} job recommendation - ${escapeXml(job.title)} (${escapeXml(enName)} job image)</image:title>`,
      `      <image:caption>${escapeXml(koName)}님에게 어울리는 직업 (Lv.${lv} ${escapeXml(job.title)}): ${escapeXml(job.specialDuty || job.specialFeature || '')} - ${escapeXml(enName)} job recommendation &amp; job image</image:caption>`,
      '    </image:image>',
      '  </url>'
    );
  }
  xmlImages.push('</urlset>');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-images.xml'), xmlImages.join('\n'), 'utf8');
  console.log('✔ Generated dist/sitemap-images.xml (1,001 job image URLs)');

  // 5-e. dist/sitemap.xml (Sitemap Index)
  const xmlIndex = [
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
    '    <loc>https://tellmyname.app/sitemap.xml</loc>',
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '  <sitemap>',
    '    <loc>https://myhome.tellmyname.app/sitemap.xml</loc>',
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '  <sitemap>',
    '    <loc>https://food.tellmyname.app/sitemap.xml</loc>',
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '  <sitemap>',
    '    <loc>https://car.tellmyname.app/sitemap.xml</loc>',
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '  <sitemap>',
    '    <loc>https://photodiary.tellmyname.app/sitemap.xml</loc>',
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '</sitemapindex>'
  ];
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xmlIndex.join('\n'), 'utf8');
  console.log('✔ Generated sitemap.xml, sitemap-main.xml, sitemap-images.xml');

  // 6. dist/robots.txt 생성
  console.log('\n[6/8] Generating robots.txt with search crawler & scraper permissions...');
  const robotsTxt = [
    '# Robots.txt for https://job.tellmyname.app',
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
    
    
    'Sitemap: https://photodiary.tellmyname.app/sitemap.xml',
    'Sitemap: https://myhome.tellmyname.app/sitemap.xml',
    'Sitemap: https://food.tellmyname.app/sitemap.xml',
    `Sitemap: ${SITE_ORIGIN}/rss.xml`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('✔ Generated dist/robots.txt');

  // 7. dist/rss.xml 생성 (네이버 서치어드바이저 RSS 2.0 등록용 50개 큐레이션)
  console.log('\n[7/8] Generating RSS 2.0 feed (50 curated job appraisals) for Naver Yeti...');
  const curatedNames = seedNames.slice(0, 50);
  const nowRfc822 = new Date().toUTCString();

  const xmlRss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>나에게 어울리는 직업 | 1,001종 멀티버스 이름 직업 감정평가</title>',
    `    <link>${SITE_ORIGIN}</link>`,
    '    <description>이름 획수로 알아보는 나만의 기상천외한 직업! 콜로세움 청소부부터 다중우주 창조 아키텍트까지 1,001가지 직업 감정</description>',
    '    <language>ko-KR</language>',
    `    <lastBuildDate>${nowRfc822}</lastBuildDate>`,
    `    <atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`
  ];

  for (let i = 0; i < 50; i++) {
    const lv = i * 20;
    const concept = getJobConceptByLevel(lv);
    const itemDate = new Date(Date.now() - i * 3600000).toUTCString();
    const levelUrl = `${SITE_ORIGIN}/level/${lv}`;

    xmlRss.push(
      '    <item>',
      `      <title><![CDATA[[${concept.zoneLabel}] Lv.${concept.level} ${concept.title}]]></title>`,
      `      <link>${levelUrl}</link>`,
      `      <description><![CDATA[Lv.${concept.level} ${concept.title} (${concept.era || concept.builtYear}). 추산 연봉: ${concept.estimatedSalary || concept.estimatedValue}. 역할: ${concept.specialDuty || concept.specialFeature} ${concept.aiVerdict}]]></description>`,
      `      <pubDate>${itemDate}</pubDate>`,
      `      <guid isPermaLink="true">${levelUrl}</guid>`,
      '    </item>'
    );
  }
  xmlRss.push('  </channel>', '</rss>');
  fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), xmlRss.join('\n'), 'utf8');
  console.log('✔ Generated dist/rss.xml (50 items)');

  // 8. Legal Pages (privacy.html, terms.html, about.html, contact.html), _headers, ads.txt, .nojekyll 복사/생성
  console.log('\n[8/8] Copying legal pages & generating Cloudflare / SEO meta files...');
  const headersSrc = path.join(PUBLIC_DIR, '_headers');

  for (const page of ['privacy.html', 'terms.html', 'about.html', 'contact.html']) {
    const src = path.join(PUBLIC_DIR, page);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST_DIR, page));
    } else {
      throw new Error(`Missing ${src}`);
    }
  }

  if (fs.existsSync(headersSrc)) {
    fs.copyFileSync(headersSrc, path.join(DIST_DIR, '_headers'));
  } else {
    throw new Error(`Missing ${headersSrc}`);
  }

  // Favicons
  for (const fav of ['favicon.ico', 'favicon.svg']) {
    const favSrc = path.join(PUBLIC_DIR, fav);
    if (fs.existsSync(favSrc)) {
      fs.copyFileSync(favSrc, path.join(DIST_DIR, fav));
    }
  }

  // ads.txt & .nojekyll (Google AdSense publisher ID pub-8793936135959956 적용)
  fs.writeFileSync(
    path.join(DIST_DIR, 'ads.txt'),
    '# Google AdSense ca-pub-8793936135959956\ngoogle.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, '.nojekyll'),
    '# Disable GitHub / Cloudflare Pages Jekyll filter\n',
    'utf8'
  );

  console.log('✔ Copied legal pages, _headers, ads.txt, .nojekyll');

  // 최종 dist/ 파일 수 검증 (Zero-File-Explosion Contract: < 50 files)
  const allDistFiles = listFilesRecursively(DIST_DIR);
  const totalFiles = allDistFiles.length;
  console.log('\n======================================================');
  console.log(`[Summary] Total files generated in dist/: ${totalFiles}`);
  console.log('Files in dist/:');
  allDistFiles.forEach(f => console.log(`  - ${f}`));
  console.log('======================================================');

  assert(
    totalFiles < 50,
    `File explosion detected! Expected < 50 files in dist/, but found ${totalFiles}`
  );
  console.log(`✔ Zero-File-Explosion Verified: ${totalFiles} < 50 files`);
  console.log(`✔ Build completed in ${Date.now() - startTime}ms`);

  return {
    totalFiles,
    files: allDistFiles
  };
}

// CLI 실행 처리
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  buildStaticSite().catch(err => {
    console.error('Fatal build failure:', err);
    process.exit(1);
  });
}
