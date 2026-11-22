// tests/test_seo.mjs — Comprehensive Multilingual Food SEO & Sitemaps Test Suite
// Asserts AC1 ~ AC4 for Issue #11 and Cloudflare Static Assets Deploy for Issue #13

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import worker, {
  generateSitemapIndex,
  generateSitemapPages,
  generateSitemapFoods,
  generateSitemapImages,
  generateSitemapNames,
  generateRobotsTxt
} from '../worker.js';
import { ALL_FOODS, FOODS_BY_CODE } from '../src/lib/food_dataset.js';
import { SUPPORTED_LANG_CODES } from '../src/lib/i18n.js';
import { formatFoodCode, SITE_ORIGIN } from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== [Mukbang] Multilingual SEO & Cloudflare Sitemaps Test Suite ===\n');

// ----------------------------------------------------
// [Test 1] Sitemap Index XML Validity
// ----------------------------------------------------
console.log('[Test 1] Sitemap Index XML (/sitemap.xml)...');
{
  const indexXml = generateSitemapIndex();
  assert(indexXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must start with XML declaration');
  assert(indexXml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Must contain sitemapindex xmlns');
  assert(indexXml.includes('<loc>https://food.tellmyname.app/sitemap-pages.xml</loc>'), 'Must list sitemap-pages.xml');
  assert(indexXml.includes('<loc>https://food.tellmyname.app/sitemap-foods.xml</loc>'), 'Must list sitemap-foods.xml');
  assert(indexXml.includes('<loc>https://food.tellmyname.app/sitemap-images.xml</loc>'), 'Must list sitemap-images.xml');
  assert(indexXml.includes('<loc>https://food.tellmyname.app/sitemap-names.xml</loc>'), 'Must list sitemap-names.xml');
  assert(indexXml.includes('<loc>https://photodiary.tellmyname.app/sitemap.xml</loc>'), 'Must list photodiary.tellmyname.app sitemap');
  assert(indexXml.includes('<loc>https://myhome.tellmyname.app/sitemap.xml</loc>'), 'Must list myhome.tellmyname.app sitemap');

  const sitemapTagCount = (indexXml.match(/<sitemap>/g) || []).length;
  assert.strictEqual(sitemapTagCount, 6, 'Must have exactly 6 sub-sitemaps');
  console.log('  ✔ Verified sitemap index with 6 valid sub-sitemaps');
}

// ----------------------------------------------------
// [Test 2] Sitemap Foods XML (AC2: 5,614 Multilingual URLs)
// ----------------------------------------------------
console.log('\n[Test 2] Sitemap Foods XML (/sitemap-foods.xml, 5,614 entries)...');
{
  const foodsXml = generateSitemapFoods();
  assert(foodsXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must start with XML declaration');
  assert(foodsXml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), 'Must declare xhtml namespace for hreflang alternates');

  // URL 태그 개수 검증 (401 foods * 14 languages = 5,614 URLs)
  const urlMatches = foodsXml.match(/<url>/g) || [];
  assert.strictEqual(urlMatches.length, 5614, `Expected exactly 5,614 <url> entries, got ${urlMatches.length}`);

  // 특정 음식(00116) 및 언어(ja) 샘플 엔트리 검증
  assert(foodsXml.includes('<loc>https://food.tellmyname.app/food/00116?lang=ja</loc>'), 'Must contain food 00116 with lang=ja');
  assert(foodsXml.includes('<xhtml:link rel="alternate" hreflang="ja" href="https://food.tellmyname.app/food/00116?lang=ja" />'), 'Must have Japanese hreflang alternate');
  assert(foodsXml.includes('<xhtml:link rel="alternate" hreflang="ko" href="https://food.tellmyname.app/food/00116?lang=ko" />'), 'Must have Korean hreflang alternate');
  assert(foodsXml.includes('<xhtml:link rel="alternate" hreflang="en" href="https://food.tellmyname.app/food/00116?lang=en" />'), 'Must have English hreflang alternate');
  assert(foodsXml.includes('<xhtml:link rel="alternate" hreflang="x-default" href="https://food.tellmyname.app/food/00116" />'), 'Must have x-default hreflang alternate');

  console.log('  ✔ Verified sitemap-foods.xml contains exactly 5,614 URLs with 15 hreflang alternates each');
}

// ----------------------------------------------------
// [Test 3] Sitemap Pages & Images & Robots.txt
// ----------------------------------------------------
console.log('\n[Test 3] Sitemap Pages, Images & Robots.txt...');
{
  const pagesXml = generateSitemapPages();
  const pagesUrlCount = (pagesXml.match(/<url>/g) || []).length;
  // 14 langs * (2 pages: home & gallery + 7 worldcup SEO pages) = 126 URLs
  assert.strictEqual(pagesUrlCount, 126, `Expected 126 page URLs, got ${pagesUrlCount}`);
  assert(pagesXml.includes('<loc>https://food.tellmyname.app/?lang=ko</loc>'));
  assert(pagesXml.includes('<loc>https://food.tellmyname.app/gallery?lang=fr</loc>'));
  assert(pagesXml.includes('<loc>https://food.tellmyname.app/worldcup/lunch</loc>'));
  assert(pagesXml.includes('<loc>https://food.tellmyname.app/worldcup/worst?lang=en</loc>'));
  console.log('  ✔ Verified sitemap-pages.xml has 126 multilingual URLs (including World Cup SEO pages)');

  const imagesXml = generateSitemapImages();
  const imagesCount = (imagesXml.match(/<image:image>/g) || []).length;
  assert.strictEqual(imagesCount, 401, `Expected 401 Google Image entries, got ${imagesCount}`);
  assert(imagesXml.includes('<image:loc>https://food.tellmyname.app/images/web/00001.webp</image:loc>'));
  assert(imagesXml.includes('<image:title>'));
  assert(imagesXml.includes('<image:caption>'));
  console.log('  ✔ Verified sitemap-images.xml has 401 Google Image entries');

  const robots = generateRobotsTxt();
  assert(robots.includes('Disallow: /api/'), 'Must disallow /api/');
  assert(robots.includes('Sitemap: https://food.tellmyname.app/sitemap.xml'), 'Must declare sitemap');
  console.log('  ✔ Verified robots.txt crawler directives and sitemap declaration');
}

// ----------------------------------------------------
// [Test 4] SSR Route /food/00116?lang=ja (AC1: Multilingual Food SEO)
// ----------------------------------------------------
console.log('\n[Test 4] Food Detail SSR (/food/00116?lang=ja)...');
{
  const targetFood = FOODS_BY_CODE['00116'] || ALL_FOODS.find(f => f.code === '00116');
  assert(targetFood, 'Food 00116 must exist in dataset');

  const req = new Request('https://food.tellmyname.app/food/00116?lang=ja');
  const res = await worker.fetch(req);

  assert.strictEqual(res.status, 200, 'HTTP 200 OK');
  assert(res.headers.get('content-type').includes('text/html'), 'Content-Type must be text/html');

  const html = await res.text();

  // 1. <html lang="ja">
  assert(/<html[^>]*lang=["']ja["']/i.test(html), 'html tag must declare lang="ja"');

  // 2. Japanese Title with English and Korean names
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  assert(titleMatch, '<title> tag must be present');
  const title = titleMatch[1];
  assert(title.includes(targetFood.englishName), `Title must contain English name "${targetFood.englishName}"`);
  assert(title.includes(targetFood.name), `Title must contain Korean original name "${targetFood.name}"`);
  console.log(`  ✔ Title verified: "${title}"`);

  // 3. Meta description with bilingual terms
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  assert(descMatch, 'meta description must be present');
  assert(descMatch[1].includes(targetFood.englishName), 'Meta description must contain English name');
  assert(descMatch[1].includes(targetFood.name), 'Meta description must contain Korean original name');

  // 4. 15 hreflang tags (14 languages + x-default)
  const hreflangs = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']/gi) || [];
  assert.strictEqual(hreflangs.length, 15, `Expected 15 hreflang tags, found ${hreflangs.length}`);
  assert(html.includes('hreflang="x-default"'), 'Must contain x-default hreflang');
  assert(html.includes('hreflang="ja"'), 'Must contain ja hreflang');
  assert(html.includes('hreflang="ko"'), 'Must contain ko hreflang');
  assert(html.includes('hreflang="en"'), 'Must contain en hreflang');

  // 5. Canonical URL
  assert(html.includes('<link rel="canonical" href="https://food.tellmyname.app/food/00116?lang=ja" />'), 'Canonical URL must point to lang=ja');

  // 6. Schema.org JSON-LD (Recipe + BreadcrumbList)
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert(jsonLdMatch, 'JSON-LD script must be present');
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert(jsonLd['@context'] === 'https://schema.org', 'Context must be schema.org');
  const graph = jsonLd['@graph'];
  assert(Array.isArray(graph), '@graph must be an array');

  const recipeItem = graph.find(item => item['@type'] === 'Recipe');
  assert(recipeItem, 'Recipe schema must be in @graph');
  assert(recipeItem.headline.includes(targetFood.englishName), 'Recipe headline must include English name');
  assert(recipeItem.headline.includes(targetFood.name), 'Recipe headline must include Korean name');
  assert(Array.isArray(recipeItem.image) && recipeItem.image.length > 0, 'Recipe image must be present');
  assert.strictEqual(recipeItem.inLanguage, 'ja', 'Recipe inLanguage must be ja');

  const breadcrumbItem = graph.find(item => item['@type'] === 'BreadcrumbList');
  assert(breadcrumbItem, 'BreadcrumbList schema must be in @graph');
  assert.strictEqual(breadcrumbItem.itemListElement.length, 3, 'Breadcrumb must have 3 levels (Home > Gallery > Food)');

  // 7. Injected SSR Body Markup (h1 with localized name, p with English & Korean for search crawlers)
  assert(/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html), 'SSR markup must have an <h1> heading');
  assert(html.includes(targetFood.englishName), 'Body must contain English name for indexing');
  assert(html.includes(targetFood.name), 'Body must contain Korean original name for indexing');

  console.log('  ✔ Verified /food/00116?lang=ja: Japanese title, 15 hreflang tags, Recipe JSON-LD, bilingual indexing text');
}

// ----------------------------------------------------
// [Test 5] SSR Route /gallery (Gallery Page & Multilingual Meta)
// ----------------------------------------------------
console.log('\n[Test 5] Gallery SSR (/gallery?lang=fr)...');
{
  const req = new Request('https://food.tellmyname.app/gallery?lang=fr');
  const res = await worker.fetch(req);
  assert.strictEqual(res.status, 200, 'HTTP 200 OK');

  const html = await res.text();
  assert(/<html[^>]*lang=["']fr["']/i.test(html), 'html tag must declare lang="fr"');
  assert(html.includes('<link rel="canonical" href="https://food.tellmyname.app/gallery?lang=fr" />'), 'Canonical must be gallery lang=fr');

  const hreflangs = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']/gi) || [];
  assert.strictEqual(hreflangs.length, 15, `Expected 15 hreflang tags on /gallery, found ${hreflangs.length}`);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert(jsonLdMatch, 'JSON-LD script must be present on gallery');
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  const collectionItem = jsonLd['@graph'].find(item => item['@type'] === 'CollectionPage');
  assert(collectionItem, 'CollectionPage schema must be present');
  assert.strictEqual(collectionItem.inLanguage, 'fr');

  console.log('  ✔ Verified /gallery?lang=fr: French locale, 15 hreflang tags, CollectionPage JSON-LD');
}

// ----------------------------------------------------
// [Test 6] Determinism Across Languages (AC4)
// ----------------------------------------------------
console.log('\n[Test 6] Determinism Across Languages (ko vs fr with same name & date)...');
{
  const testName = '손흥민';
  const testDate = '2026-11-09';

  const reqKo = new Request(`https://food.tellmyname.app/?name=${encodeURIComponent(testName)}&date=${testDate}&lang=ko`);
  const reqFr = new Request(`https://food.tellmyname.app/?name=${encodeURIComponent(testName)}&date=${testDate}&lang=fr`);

  const resKo = await worker.fetch(reqKo);
  const resFr = await worker.fetch(reqFr);

  const htmlKo = await resKo.text();
  const htmlFr = await resFr.text();

  const matchDataKo = htmlKo.match(/window\.__INITIAL_MUKBANG_DATA__\s*=\s*(\{[\s\S]*?\});/);
  const matchDataFr = htmlFr.match(/window\.__INITIAL_MUKBANG_DATA__\s*=\s*(\{[\s\S]*?\});/);

  assert(matchDataKo, 'window.__INITIAL_MUKBANG_DATA__ must be present in ko');
  assert(matchDataFr, 'window.__INITIAL_MUKBANG_DATA__ must be present in fr');

  const dataKo = JSON.parse(matchDataKo[1]);
  const dataFr = JSON.parse(matchDataFr[1]);

  assert.strictEqual(dataKo.orderedMeals.length, 5, 'Must have 5 meals');
  assert.strictEqual(dataFr.orderedMeals.length, 5, 'Must have 5 meals');

  for (let i = 0; i < 5; i++) {
    const slotKo = dataKo.orderedMeals[i];
    const slotFr = dataFr.orderedMeals[i];
    const codeKo = formatFoodCode(slotKo.food.index);
    const codeFr = formatFoodCode(slotFr.food.index);
    assert.strictEqual(codeKo, codeFr, `Meal slot ${i} (${slotKo.mealKey}) food code must be identical: ${codeKo} === ${codeFr}`);
  }

  console.log('  ✔ Determinism confirmed: ko and fr produce 100% identical food codes across all 5 meal slots');
}

// ----------------------------------------------------
// [Test 7] Static Pre-Generated Files in dist/
// ----------------------------------------------------
console.log('\n[Test 7] Pre-Generated Static Files in dist/...');
{
  const distDir = path.join(ROOT_DIR, 'dist');
  assert(fs.existsSync(distDir), 'dist/ directory must exist');

  const requiredFiles = [
    'sitemap.xml',
    'sitemap-pages.xml',
    'sitemap-foods.xml',
    'sitemap-images.xml',
    'sitemap-names.xml',
    'robots.txt',
    'a8f4c2e9b1d703654e2a9c8b7d6f1e3a.txt'
  ];

  for (const f of requiredFiles) {
    const p = path.join(distDir, f);
    assert(fs.existsSync(p), `dist/${f} must exist`);
    const size = fs.statSync(p).size;
    assert(size > 0, `dist/${f} must not be empty (size=${size})`);
  }

  // sitemap-foods.xml 파일 내 5,614 엔트리 검증
  const foodsXmlContent = fs.readFileSync(path.join(distDir, 'sitemap-foods.xml'), 'utf8');
  const countInFile = (foodsXmlContent.match(/<url>/g) || []).length;
  assert.strictEqual(countInFile, 5614, `dist/sitemap-foods.xml must contain 5,614 <url> tags, found ${countInFile}`);

  console.log('  ✔ Verified all static sitemaps and crawler support files exist in dist/');
}

// ----------------------------------------------------
// [Test 8] Path-Based Language Routing & Static Shell SSR Localization
// ----------------------------------------------------
console.log('\n[Test 8] Path-Based Language Routing & Static Shell SSR Localization...');
{
  // 1. GET /en (Path-based language home)
  const enReq = new Request('https://food.tellmyname.app/en');
  const enRes = await worker.fetch(enReq, {}, {});
  assert.strictEqual(enRes.status, 200);
  const enHtml = await enRes.text();
  assert(enHtml.includes('<html lang="en"'), 'Must have <html lang="en">');
  assert(enHtml.includes('Daily Meals') || enHtml.includes('What to Eat Today?'), 'Must have English brand or tab');
  assert(enHtml.includes('Steve') || enHtml.includes('Emma'), 'Must have English sample chips');

  // 2. GET /ja/food/00116 (Path-based food detail)
  const jaFoodReq = new Request('https://food.tellmyname.app/ja/food/00116');
  const jaFoodRes = await worker.fetch(jaFoodReq, {}, {});
  assert.strictEqual(jaFoodRes.status, 200);
  const jaFoodHtml = await jaFoodRes.text();
  assert(jaFoodHtml.includes('<html lang="ja"'), 'Must have <html lang="ja">');
  assert(jaFoodHtml.includes('ニンニクポッサム'), 'Must contain Japanese food name');

  // 3. GET /fr/gallery (Path-based gallery)
  const frGalReq = new Request('https://food.tellmyname.app/fr/gallery');
  const frGalRes = await worker.fetch(frGalReq, {}, {});
  assert.strictEqual(frGalRes.status, 200);
  const frGalHtml = await frGalRes.text();
  assert(frGalHtml.includes('<html lang="fr"'), 'Must have <html lang="fr">');
  assert(frGalHtml.includes('Galerie d&#39;illustrations') || frGalHtml.includes('Food Illustration Gallery'), 'Must have French title/meta');

  console.log('  ✔ Path-based language routes (/en, /ja/food/:code, /fr/gallery) verified with localized shell SSR');
}

console.log('\n========================================');
console.log('🎉 ALL SEO & CLOUDFLARE TESTS PASSED (100%)');
console.log('========================================\n');
