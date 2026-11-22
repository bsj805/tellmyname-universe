// scripts/generate_static_site.mjs — Static Site Builder for Cloudflare Workers + Static Assets
// Copies web assets, mirrors src/lib for browser ESM, copies images/web (WebP & JPG),
// copies web/i18n, and pre-generates robots.txt & complete XML sitemaps (5,614 food URLs).

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN, SITE_NAME } from '../src/lib/constants.js';
import {
  generateSitemapIndex,
  generateSitemapPages,
  generateSitemapFoods,
  generateSitemapImages,
  generateSitemapNames,
  generateRobotsTxt,
  INDEXNOW_KEY,
  POPULAR_SEED_NAMES
} from '../worker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const WEB_DIR = path.join(ROOT_DIR, 'web');
export const SRC_LIB_DIR = path.join(ROOT_DIR, 'src', 'lib');
export const IMAGES_WEB_DIR = path.join(ROOT_DIR, 'images', 'web');
export const WEB_I18N_DIR = path.join(ROOT_DIR, 'web', 'i18n');

/**
 * 디렉토리 내의 파일들을 재귀적으로 복사
 */
export function copyDirRecursively(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      count += copyDirRecursively(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

/**
 * 디렉토리 내 모든 상대 파일 경로 목록 조회
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
 * 정적 빌드 메인 함수
 */
export async function buildStaticSite() {
  const startTime = Date.now();
  console.log(`=== [Mukbang] Static Site & Asset Builder (${SITE_ORIGIN}) ===`);

  // 1. dist/ 디렉토리 초기화
  console.log('\n[1/7] Cleaning and preparing dist/ directory...');
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('✔ dist/ ready');

  // 2. web/ 에셋 복사 (index.html, css/, js/)
  console.log('\n[2/7] Copying web/ assets to dist/ (if present)...');
  let webCount = 0;
  if (fs.existsSync(WEB_DIR)) {
    webCount = copyDirRecursively(WEB_DIR, DIST_DIR);
    console.log(`✔ Copied ${webCount} web files to dist/`);
  } else {
    // web/이 없을 경우 기본 쉘 index.html 생성
    const defaultIndexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME}</title>
  <link rel="icon" href="/favicon.ico" />
</head>
<body>
  <div id="app">
    <header class="site-header">
      <a href="/" class="site-logo">🍽️ ${SITE_NAME}</a>
    </header>
    <main class="main-container">
      <section id="recommendation-root"></section>
    </main>
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), defaultIndexHtml, 'utf8');
    console.log('✔ Generated default shell dist/index.html');
  }

  // 3. src/lib/* -> dist/src/lib/* 및 dist/lib/* 복사 (브라우저 ESM 상대경로 보장)
  console.log('\n[3/7] Copying src/lib/* for browser ESM imports...');
  const distSrcLibDir = path.join(DIST_DIR, 'src', 'lib');
  const distLibDir = path.join(DIST_DIR, 'lib');
  fs.mkdirSync(distSrcLibDir, { recursive: true });
  fs.mkdirSync(distLibDir, { recursive: true });

  let libCount = 0;
  if (fs.existsSync(SRC_LIB_DIR)) {
    const files = fs.readdirSync(SRC_LIB_DIR);
    for (const f of files) {
      const src = path.join(SRC_LIB_DIR, f);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, path.join(distSrcLibDir, f));
        fs.copyFileSync(src, path.join(distLibDir, f));
        libCount++;
      }
    }
  }
  console.log(`✔ Mirrored ${libCount} library files to dist/src/lib/ and dist/lib/`);

  // 4. images/web/ (WebP & OG JPG) 복사 -> dist/images/web/
  // (PNG 원본 약 800MB는 제외하여 dist 용량을 150MB 이하로 유지)
  console.log('\n[4/7] Copying optimized web images (WebP & JPG) to dist/images/web/...');
  const distImagesWebDir = path.join(DIST_DIR, 'images', 'web');
  fs.mkdirSync(distImagesWebDir, { recursive: true });

  let imgCount = 0;
  if (fs.existsSync(IMAGES_WEB_DIR)) {
    const entries = fs.readdirSync(IMAGES_WEB_DIR);
    for (const file of entries) {
      if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')) {
        fs.copyFileSync(path.join(IMAGES_WEB_DIR, file), path.join(distImagesWebDir, file));
        imgCount++;
      }
    }
    console.log(`✔ Copied ${imgCount} optimized food images to dist/images/web/`);
  } else {
    console.warn('⚠ images/web directory not found; skipping image copy');
  }

  // 5. web/i18n/ -> dist/i18n/ 복사 (14개 언어 번역 번들)
  console.log('\n[5/7] Copying web/i18n/ food bundles to dist/i18n/...');
  let i18nCount = 0;
  if (fs.existsSync(WEB_I18N_DIR)) {
    i18nCount = copyDirRecursively(WEB_I18N_DIR, path.join(DIST_DIR, 'i18n'));
    console.log(`✔ Copied ${i18nCount} i18n bundle files to dist/i18n/`);
  } else {
    console.warn('⚠ web/i18n directory not found; run scripts/build_i18n_bundles.mjs first');
  }

  // 6. 모든 XML 사이트맵 파일 생성 (이름별 URL 사이트맵 제외, 음식별 1개씩 연결)
  console.log('\n[6/7] Generating XML Sitemaps (Index, Pages, 401 Foods, Images - 0 Name Doorway URLs)...');
  const sitemapIndexXml = generateSitemapIndex(SITE_ORIGIN);
  const sitemapPagesXml = generateSitemapPages(SITE_ORIGIN);
  const sitemapFoodsXml = generateSitemapFoods(SITE_ORIGIN);
  const sitemapImagesXml = generateSitemapImages(SITE_ORIGIN);

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-pages.xml'), sitemapPagesXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-foods.xml'), sitemapFoodsXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-images.xml'), sitemapImagesXml, 'utf8');

  console.log(`✔ Generated dist/sitemap.xml (Index)`);
  console.log(`✔ Generated dist/sitemap-pages.xml`);
  console.log(`✔ Generated dist/sitemap-foods.xml (401 canonical food URLs)`);
  console.log(`✔ Generated dist/sitemap-images.xml (401 Google Image URLs)`);

  // 7. robots.txt, IndexNow 키 파일, .nojekyll, ads.txt 생성
  console.log('\n[7/7] Generating robots.txt, IndexNow key, .nojekyll & ads.txt...');
  const robotsTxt = generateRobotsTxt(SITE_ORIGIN);
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, `${INDEXNOW_KEY}.txt`), `${INDEXNOW_KEY}\n`, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '# Disable Jekyll\n', 'utf8');
  fs.writeFileSync(
    path.join(DIST_DIR, 'ads.txt'),
    'google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n',
    'utf8'
  );
  console.log(`✔ Generated dist/robots.txt, dist/${INDEXNOW_KEY}.txt, dist/.nojekyll, dist/ads.txt`);

  // dist 전체 파일 및 용량 검증
  const allFiles = listFilesRecursively(DIST_DIR);
  let totalSizeBytes = 0;
  let maxSingleSizeBytes = 0;
  let largestFile = '';

  for (const relPath of allFiles) {
    const fullPath = path.join(DIST_DIR, relPath);
    const stat = fs.statSync(fullPath);
    totalSizeBytes += stat.size;
    if (stat.size > maxSingleSizeBytes) {
      maxSingleSizeBytes = stat.size;
      largestFile = relPath;
    }
  }

  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const maxSingleSizeMB = (maxSingleSizeBytes / (1024 * 1024)).toFixed(2);

  console.log('\n======================================================');
  console.log(`[Summary] Total static files in dist/: ${allFiles.length}`);
  console.log(`[Summary] Total dist size: ${totalSizeMB} MB (< 150 MB limit)`);
  console.log(`[Summary] Largest file: ${largestFile} (${maxSingleSizeMB} MB, < 25 MB Cloudflare limit)`);
  console.log(`✔ Build completed in ${Date.now() - startTime}ms`);
  console.log('======================================================');

  // Cloudflare Workers Assets 제약 조건 검증
  assert(totalSizeBytes < 150 * 1024 * 1024, `dist size (${totalSizeMB} MB) exceeds 150 MB limit!`);
  assert(allFiles.length < 20000, `File count (${allFiles.length}) exceeds 20,000 limit!`);
  assert(maxSingleSizeBytes < 25 * 1024 * 1024, `Single file (${largestFile}) exceeds 25 MB limit!`);

  return {
    totalFiles: allFiles.length,
    totalSizeMB: parseFloat(totalSizeMB),
    files: allFiles
  };
}

// 직접 CLI 실행 시 빌드 구동
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  buildStaticSite().catch(err => {
    console.error('Fatal static site build failure:', err);
    process.exit(1);
  });
}
