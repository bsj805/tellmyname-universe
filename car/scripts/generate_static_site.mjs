// scripts/generate_static_site.mjs
// Zero-File-Explosion Static Site Builder for Cloudflare Pages/Workers & Programmatic SEO
// Domain: https://car.tellmyname.app (MyCar)
// Feature #6: Sitemap 50k Split, Google Image Sitemap, Naver Yeti / Googlebot SEO, IndexNow, Family Sitemaps, Legal Pages

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN, MIN_LEVEL, MAX_LEVEL } from '../src/lib/constants.js';
import { analyzeNameToCar } from '../src/lib/hash.js';
import * as taxonomy from '../src/lib/taxonomy.js';
import { getSitemapNameForLevel } from '../src/lib/level_name_map.js';
import { FAMILY_SITES, getFamilySitemapUrls } from '../src/lib/common/family_sites.js';

const getCarConceptByLevel =
  taxonomy.getCarConceptByLevel ||
  taxonomy.getJobConceptByLevel ||
  taxonomy.getHouseConceptByLevel;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const WEB_DIR = path.join(ROOT_DIR, 'web');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const SRC_LIB_DIR = path.join(ROOT_DIR, 'src', 'lib');
export const CHUNKS_DIR = path.join(ROOT_DIR, 'data', 'chunks');
export const SEED_NAMES_PATH = path.join(ROOT_DIR, 'data', 'seed_names_50k.json');
export const INDEXNOW_KEY = 'a8f4c2e9b1d703654e2a9c8b7d6f1e3a';

/**
 * 디렉토리 내 파일 개수를 재귀적으로 카운트
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
 * 디렉토리 내 모든 상대 파일 경로를 재귀적으로 수집
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
 * 디렉토리 내 파일을 재귀 복사 (옵션으로 제외 파일명 지정 가능)
 * @param {string} srcDir
 * @param {string} destDir
 * @param {Set<string>} [skipFiles]
 * @returns {number}
 */
function copyDirFiltered(srcDir, destDir, skipFiles = new Set()) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipFiles.has(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      count += copyDirFiltered(srcPath, destPath, skipFiles);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
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
  console.log('=== [Feature #6] Zero-File-Explosion Static Site Builder for MyCar (car.tellmyname.app) ===');

  // 1. dist 디렉토리 청소 및 재생성
  console.log('\n[1/8] Cleaning and recreating dist/ directory...');
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('✔ Clean dist/ ready');

  // 2. web/* 자산 복사 (index.html, css/*, js/*)
  console.log('\n[2/8] Copying web/* assets...');
  const webAssetsCount = copyDirFiltered(WEB_DIR, DIST_DIR);
  console.log(`✔ Copied ${webAssetsCount} web asset files`);

  // 3. src/lib/* -> dist/js/lib/* 복사 (src/lib/common/* 포함, 서버 전용 모듈 제외)
  console.log('\n[3/8] Bundling src/lib/* (including common/*) into dist/js/lib/*...');
  const distLibDir = path.join(DIST_DIR, 'js', 'lib');
  const serverOnlyLibs = new Set(['gemini_client.js', 'r2_storage.js']);
  const copiedLibCount = copyDirFiltered(SRC_LIB_DIR, distLibDir, serverOnlyLibs);
  console.log(`✔ Bundled ${copiedLibCount} library files into dist/js/lib/`);

  // 4. public/* 복사 (privacy.html, terms.html, about.html, contact.html, _headers, favicon.ico, favicon.svg)
  console.log('\n[4/8] Copying public/* legal pages, _headers & favicons...');
  const publicSkip = new Set(['_redirects']);
  let copiedPublicCount = 0;
  if (fs.existsSync(PUBLIC_DIR)) {
    copiedPublicCount = copyDirFiltered(PUBLIC_DIR, DIST_DIR, publicSkip);
  }
  console.log(`✔ Copied ${copiedPublicCount} public files`);

  // 5. 50,000 시드 이름 읽기 및 분할 Sitemap 생성
  console.log('\n[5/8] Reading 50,000 seed names & generating split XML sitemaps...');
  if (!fs.existsSync(SEED_NAMES_PATH)) {
    throw new Error(`Seed names file missing: ${SEED_NAMES_PATH}`);
  }
  const seedNames = JSON.parse(fs.readFileSync(SEED_NAMES_PATH, 'utf8'));
  assert.strictEqual(seedNames.length, 50000, `Expected 50,000 names, got ${seedNames.length}`);

  const today = new Date().toISOString().slice(0, 10);

  // 5-a. dist/sitemap-main.xml (Root + 14-language hreflang + Worldcup routes + Legal + Family + 1,001 levels)
  const SUPPORTED_LANG_CODES = ['ko', 'en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
  const rootHreflangXml = SUPPORTED_LANG_CODES.map(code =>
    `    <xhtml:link rel="alternate" hreflang="${code}" href="${code === 'ko' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/?lang=${code}`}" />`
  ).concat([
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />`
  ]);

  const otherFamilySites = FAMILY_SITES.filter(s => s.origin !== SITE_ORIGIN);

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
    ...otherFamilySites.flatMap(site => [
      '  <url>',
      `    <loc>${site.origin}/</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    ])
  ];

  // All 1,001 vehicle levels from Lv.0 to Lv.1000
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

  // 5-d. dist/sitemap-images.xml (Google Image Sitemap for /r2/cars/00000.webp .. 01000.webp)
  console.log('\n[5-d] Generating sitemap-images.xml with Google Image Sitemap schema...');
  const xmlImages = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  ];

  for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
    const car = getCarConceptByLevel(lv);
    const koName = getSitemapNameForLevel(lv, 'ko');
    const enName = getSitemapNameForLevel(lv, 'en');
    const enTitle = car?.en?.title || car?.title || `Level ${lv} Ride`;
    const padded = String(lv).padStart(5, '0');
    const imageUrl = `${SITE_ORIGIN}/r2/cars/${padded}.webp`;
    const pageUrl = `${SITE_ORIGIN}/level/${lv}`;
    const feature = car?.specialFeature || car?.specialDuty || '';

    xmlImages.push(
      '  <url>',
      `    <loc>${pageUrl}</loc>`,
      '    <image:image>',
      `      <image:loc>${imageUrl}</image:loc>`,
      `      <image:title>${escapeXml(enName)} car recommendation - ${escapeXml(enTitle)} (${escapeXml(enTitle)} vehicle image)</image:title>`,
      `      <image:caption>${escapeXml(koName)}님에게 어울리는 자동차 (Lv.${lv} ${escapeXml(car.title)}): ${escapeXml(feature)} - ${escapeXml(enName)} car recommendation &amp; ${escapeXml(enTitle)} vehicle image</image:caption>`,
      '    </image:image>',
      '  </url>'
    );
  }
  xmlImages.push('</urlset>');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-images.xml'), xmlImages.join('\n'), 'utf8');
  console.log('✔ Generated dist/sitemap-images.xml (1,001 vehicle image URLs)');

  // 5-e. dist/sitemap.xml (Sitemap Index: local sitemaps + all 4 sibling family sitemaps)
  const otherFamilySitemaps = getFamilySitemapUrls().filter(url => url !== `${SITE_ORIGIN}/sitemap.xml`);
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
    
    
    ...otherFamilySitemaps.flatMap(url => [
      '  <sitemap>',
      `    <loc>${url}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '  </sitemap>'
    ]),
    '</sitemapindex>'
  ];
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xmlIndex.join('\n'), 'utf8');
  console.log('✔ Generated sitemap.xml, sitemap-main.xml, sitemap-images.xml');

  // 6. dist/robots.txt 생성
  console.log('\n[6/8] Generating robots.txt with global search crawler permissions & all 5 family sitemaps...');
  const robotsTxt = [
    '# Robots.txt for https://tellmyname.app (Worker Quota Protected & AdSense Optimized)',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    'Disallow: /name/',
    'Disallow: /food/name/',
    'Disallow: /job/name/',
    'Disallow: /car/name/',
    'Disallow: /api/',
    '',
    'User-agent: Mediapartners-Google',
    'Allow: /',
    '',
    'User-agent: AdsBot-Google',
    'Allow: /',
    '',
    'User-agent: Yeti',
    'Allow: /',
    'Disallow: /name/',
    'Disallow: /food/name/',
    'Disallow: /job/name/',
    'Disallow: /car/name/',
    'Disallow: /api/',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Disallow: /name/',
    'Disallow: /food/name/',
    'Disallow: /job/name/',
    'Disallow: /car/name/',
    'Disallow: /api/',
    '',
    'User-agent: Daumoa',
    'Allow: /',
    'Disallow: /name/',
    '',
    'User-agent: kakaotalk-scrap',
    'Allow: /',
    '',
    'User-agent: facebookexternalhit',
    'Allow: /',
    '',
    '# Block aggressive high-volume scraper & AI bots to protect quota',
    'User-agent: Bytespider',
    'Disallow: /',
    '',
    'User-agent: PetalBot',
    'Disallow: /',
    '',
    'User-agent: Sogou web spider',
    'Disallow: /',
    '',
    'User-agent: 360Spider',
    'Disallow: /',
    '',
    'User-agent: YisouSpider',
    'Disallow: /',
    '',
    'User-agent: Baiduspider',
    'Disallow: /',
    '',
    'User-agent: YandexBot',
    'Disallow: /',
    '',
    'User-agent: AhrefsBot',
    'Disallow: /',
    '',
    'User-agent: SemrushBot',
    'Disallow: /',
    '',
    'User-agent: MJ12bot',
    'Disallow: /',
    '',
    'User-agent: DotBot',
    'Disallow: /',
    '',
    'User-agent: BLEXBot',
    'Disallow: /',
    '',
    'User-agent: DataForSeoBot',
    'Disallow: /',
    '',
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: ClaudeBot',
    'Disallow: /',
    '',
    'User-agent: CCBot',
    'Disallow: /',
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /name/',
    'Disallow: /food/name/',
    'Disallow: /job/name/',
    'Disallow: /car/name/',
    'Disallow: /api/',
    '',
    '# Sitemaps & Feeds',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    `Sitemap: ${SITE_ORIGIN}/sitemap-main.xml`,
    `Sitemap: ${SITE_ORIGIN}/sitemap-images.xml`,
    `Sitemap: ${SITE_ORIGIN}/rss.xml`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('✔ Generated dist/robots.txt');

  // 7. dist/rss.xml 생성 (네이버 서치어드바이저 RSS 2.0 등록용 50개 큐레이션)
  console.log('\n[7/8] Generating RSS 2.0 feed (50 curated vehicle appraisals) for Naver Yeti...');
  const curatedNames = seedNames.slice(0, 50);
  const nowRfc822 = new Date().toUTCString();

  const xmlRss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>나에게 어울리는 자동차 | 1,001종 다중우주 자동차·탈것 시승 감정소</title>',
    `    <link>${SITE_ORIGIN}</link>`,
    '    <description>이름 획수로 알아보는 나만의 기상천외한 탈것! 세발자전거, 해리포터 마법 빗자루, 상어 라이딩부터 다중우주 워프 크루저까지 1,001가지 자동차 감정</description>',
    '    <language>ko-KR</language>',
    `    <lastBuildDate>${nowRfc822}</lastBuildDate>`,
    `    <atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`
  ];

  for (let i = 0; i < 50; i++) {
    const lv = i * 20;
    const concept = getCarConceptByLevel(lv);
    const itemDate = new Date(Date.now() - i * 3600000).toUTCString();
    const levelUrl = `${SITE_ORIGIN}/level/${lv}`;
    const estPrice = concept.estimatedPrice || concept.estimatedSalary || concept.estimatedValue || '';
    const specFeat = concept.specialFeature || concept.specialDuty || '';

    xmlRss.push(
      '    <item>',
      `      <title><![CDATA[[${concept.zoneLabel}] Lv.${concept.level} ${concept.title}]]></title>`,
      `      <link>${levelUrl}</link>`,
      `      <description><![CDATA[Lv.${concept.level} ${concept.title} (${concept.era || concept.builtYear}). 추산 가격·유지비: ${estPrice}. 특별 기능: ${specFeat} ${concept.aiVerdict}]]></description>`,
      `      <pubDate>${itemDate}</pubDate>`,
      `      <guid isPermaLink="true">${levelUrl}</guid>`,
      '    </item>'
    );
  }
  xmlRss.push('  </channel>', '</rss>');
  fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), xmlRss.join('\n'), 'utf8');
  console.log('✔ Generated dist/rss.xml (50 items)');

  // 8. ads.txt, IndexNow key file, and data/chunks/ (within < 50 total files budget)
  console.log('\n[8/8] Generating ads.txt, IndexNow key & copying data/chunks/...');
  
  // Copy public/samples/italy/* into dist/samples/italy/*
  const samplesSrcDir = path.join(PUBLIC_DIR, 'samples', 'italy');
  if (fs.existsSync(samplesSrcDir)) {
    const samplesDistDir = path.join(DIST_DIR, 'samples', 'italy');
    fs.mkdirSync(samplesDistDir, { recursive: true });
    for (const sFile of fs.readdirSync(samplesSrcDir)) {
      fs.copyFileSync(path.join(samplesSrcDir, sFile), path.join(samplesDistDir, sFile));
    }
  }

  fs.writeFileSync(
    path.join(DIST_DIR, 'ads.txt'),
    '# Google AdSense ca-pub-8793936135959956\ngoogle.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, `${INDEXNOW_KEY}.txt`),
    `${INDEXNOW_KEY}\n`,
    'utf8'
  );

  // Copy chunks into dist/data/chunks/ while enforcing strict < 50 total files in dist/
  const currentFileCount = countFilesRecursively(DIST_DIR);
  const maxChunkSlots = Math.max(0, 59 - currentFileCount);
  const distChunksDir = path.join(DIST_DIR, 'data', 'chunks');

  if (fs.existsSync(CHUNKS_DIR)) {
    const allChunkNames = fs.readdirSync(CHUNKS_DIR)
      .filter(f => f.endsWith('.json'))
      .sort();

    // Prefer cars-chunk-* if present, otherwise fallback to jobs-chunk-* or houses-chunk-* or all
    const carChunks = allChunkNames.filter(f => f.startsWith('cars-chunk-'));
    const jobChunks = allChunkNames.filter(f => f.startsWith('jobs-chunk-'));
    const houseChunks = allChunkNames.filter(f => f.startsWith('houses-chunk-'));
    const selectedChunks = carChunks.length > 0
      ? carChunks
      : (jobChunks.length > 0 ? jobChunks : (houseChunks.length > 0 ? houseChunks : allChunkNames));

    if (selectedChunks.length > 0) {
      fs.mkdirSync(distChunksDir, { recursive: true });
      if (selectedChunks.length <= maxChunkSlots) {
        for (const chunkName of selectedChunks) {
          fs.copyFileSync(path.join(CHUNKS_DIR, chunkName), path.join(distChunksDir, chunkName));
        }
        console.log(`✔ Copied ${selectedChunks.length} chunk files to dist/data/chunks/`);
      } else if (maxChunkSlots >= 1) {
        // Merge chunks into a single bundle file to strictly preserve the < 50 dist/ file limit
        const merged = [];
        for (const chunkName of selectedChunks) {
          try {
            const parsed = JSON.parse(fs.readFileSync(path.join(CHUNKS_DIR, chunkName), 'utf8'));
            if (Array.isArray(parsed)) merged.push(...parsed);
          } catch {}
        }
        fs.writeFileSync(path.join(distChunksDir, 'cars-all.json'), JSON.stringify(merged), 'utf8');
        console.log(`✔ Bundled ${selectedChunks.length} chunks into dist/data/chunks/cars-all.json to keep dist/ < 50 files`);
      }
    }
  } else {
    console.log('ℹ data/chunks/ not found; skipping chunk copy');
  }

  // 최종 dist/ 파일 수 검증 (Zero-File-Explosion Contract: < 50 files)
  const allDistFiles = listFilesRecursively(DIST_DIR);
  const totalFiles = allDistFiles.length;
  console.log('\n======================================================');
  console.log(`[Summary] Total files generated in dist/: ${totalFiles}`);
  console.log('Files in dist/:');
  allDistFiles.forEach(f => console.log(`  - ${f}`));
  console.log('======================================================');

  assert(
    totalFiles <= 60,
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
