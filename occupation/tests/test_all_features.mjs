// tests/test_all_features.mjs
// Comprehensive E2E Verification Suite for Features #1 ~ #6 of MyJob (job.tellmyname.app)

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SITE_ORIGIN,
  MIN_LEVEL,
  MAX_LEVEL,
  TOTAL_LEVELS,
  GOOD_JOB_THRESHOLD,
  JOB_CATEGORIES,
  getJobImageUrl
} from '../src/lib/constants.js';
import { analyzeNameToJob } from '../src/lib/hash.js';
import { MASTER_JOBS, MASTER_TIERS_1001 } from '../src/lib/master_dataset.js';
import { getJobConceptByLevel, renderJobArtworkSvg } from '../src/lib/taxonomy.js';
import { SUPPORTED_LANGUAGES, localizeJob, getWorldCupTranslation } from '../src/lib/i18n.js';
import { parseLevelFromR2Path, getR2ObjectKey, serveR2JobImage } from '../src/lib/r2_storage.js';
import { createDevServer } from '../scripts/dev_server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

let passCount = 0;
function check(condition, msg) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${msg}`);
    throw new Error(msg);
  }
  passCount++;
  console.log(`  ✔ PASS: ${msg}`);
}

async function runTests() {
  console.log('===================================================================');
  console.log(' [E2E TEST SUITE] MyJob (https://job.tellmyname.app) Features #1~#6');
  console.log('===================================================================\n');

  // 1. Feature #1: Hash Engine (0 ~ 1,000) & 50,000 name_teller Seed Names
  console.log('[1/6] Testing Feature #1: Name -> 0..1000 Deterministic Hash Engine...');
  check(SITE_ORIGIN === 'https://job.tellmyname.app', 'SITE_ORIGIN is https://job.tellmyname.app');
  check(MIN_LEVEL === 0 && MAX_LEVEL === 1000 && TOTAL_LEVELS === 1001, 'Level bounds are 0..1000 (1,001 levels)');
  check(GOOD_JOB_THRESHOLD === 500, 'GOOD_JOB_THRESHOLD is 500');

  const r1 = analyzeNameToJob('김서윤');
  const r2 = analyzeNameToJob('김서윤');
  check(r1.level === r2.level && r1.level === 331, `'김서윤' deterministically maps to Lv.331 (got ${r1.level})`);
  check(analyzeNameToJob('이민준').level === 186, `'이민준' maps to Lv.186`);
  check(analyzeNameToJob('홍길동').level === 628, `'홍길동' maps to Lv.628`);
  check(analyzeNameToJob('박대기').level === 441, `'박대기' maps to Lv.441`);
  check(analyzeNameToJob('선우용녀').level === 335, `'선우용녀' maps to Lv.335`);

  const distReport = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'hash_distribution_report.json'), 'utf8'));
  check(distReport.datasetComposition.total === 50000, '50,000 name_teller names tested');
  check(distReport.benchmarks[2].occupiedLevels === 1001, 'All 1,001 levels (0..1000) occupied (0 empty buckets)');

  // 2. Feature #2: 0 ~ 1,000 Master Occupation Dataset & Image Prompts (0.txt ~ 1000.txt)
  console.log('\n[2/6] Testing Feature #2: 0..1000 Master Occupation Dataset & Prompt TXT Files...');
  check(MASTER_JOBS.length === 1001, `MASTER_JOBS has 1,001 items (got ${MASTER_JOBS.length})`);
  check(MASTER_TIERS_1001.length === 20, `MASTER_TIERS_1001 has 20 tiers`);

  for (let lv = 0; lv <= 1000; lv++) {
    const job = getJobConceptByLevel(lv);
    assert.strictEqual(job.level, lv, `Level index mismatch at ${lv}`);
    assert.strictEqual(job.zone, lv < 500 ? 'BAD' : 'GOOD', `Zone mismatch at ${lv}`);
    assert.strictEqual(job.realityType, lv % 2 === 0 ? 'REAL' : 'FICTION', `50:50 Real/Fiction alternation mismatch at ${lv}`);
    assert(job.era && job.builtYear, `Missing era/builtYear at ${lv}`);
    assert(job.estimatedSalary && job.estimatedValue, `Missing estimatedSalary/estimatedValue at ${lv}`);
    assert(job.specialDuty && job.specialFeature, `Missing specialDuty/specialFeature at ${lv}`);
    assert(job.aiVerdict, `Missing aiVerdict at ${lv}`);
  }
  check(true, 'All 1,001 jobs strictly alternate Even=REAL / Odd=FICTION and Lv.0~499=BAD / Lv.500~1000=GOOD');
  check(getJobConceptByLevel(250).title.includes('박대기'), 'Lv.250 features iconic heavy-snow reporter (박대기 기자)');
  check(getJobConceptByLevel(600).title.includes('비트코인 8조'), 'Lv.600 features iconic 8-trillion KRW Bitcoin hacker');
  check(
    fs.existsSync(path.join(ROOT_DIR, 'images', '00000.txt')) &&
    fs.existsSync(path.join(ROOT_DIR, 'images', '01000.txt')) &&
    !fs.existsSync(path.join(ROOT_DIR, 'images', '0.txt')),
    'images/00000.txt .. images/01000.txt exist (5-digit padded, 0 unpadded duplicates)'
  );
  check(fs.existsSync(path.join(ROOT_DIR, 'auto_generator.py')) && fs.existsSync(path.join(ROOT_DIR, 'Gemini_jobs_이미지자동생성.bat')), 'auto_generator.py and Gemini_jobs_이미지자동생성.bat exist');

  // Check generated showcase PNG images (5-digit padded)
  const requiredPngs = ['00000.png', '00001.png', '00002.png', '00186.png', '00250.png', '00331.png', '00335.png', '00441.png', '00600.png', '00628.png', '01000.png'];
  for (const png of requiredPngs) {
    check(fs.existsSync(path.join(ROOT_DIR, 'images', png)), `Generated PNG image exists: images/${png}`);
  }

  // 3. Feature #3: Cloudflare R2 Storage & Edge Dynamic SSR Server
  console.log('\n[3/6] Testing Feature #3: Cloudflare R2 Router & Edge Dynamic SSR...');
  check(parseLevelFromR2Path('/r2/jobs/00331.webp') === 331, 'parseLevelFromR2Path parses /r2/jobs/00331.webp -> 331');
  check(parseLevelFromR2Path('/r2/jobs/01000.webp') === 1000, 'parseLevelFromR2Path parses /r2/jobs/01000.webp -> 1000');
  check(getR2ObjectKey(331) === 'jobs/00331.webp', 'getR2ObjectKey(331) returns jobs/00331.webp');

  const server = createDevServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`  ℹ Local Edge Dev Server listening on ${baseUrl}`);

  try {
    // Root SSR
    const rootRes = await fetch(`${baseUrl}/`);
    const rootHtml = await rootRes.text();
    check(rootRes.status === 200, 'GET / returns 200 OK');
    check(rootHtml.includes('나에게 어울리는 직업'), 'GET / contains brand header "나에게 어울리는 직업"');
    check(rootHtml.includes('나의 직업 고르기 이상형 월드컵'), 'GET / contains SEO keyword "나의 직업 고르기 이상형 월드컵"');
    check(rootHtml.includes('언제 하던 직업인지') && rootHtml.includes('추산되는 연봉') && rootHtml.includes('직업의 특별한 역할·할일'), 'GET / SSR contains all 3 mandatory occupation spec labels');

    // Family Navigation & Cross-Site Sitemaps
    check(rootHtml.includes('id="family-top-nav"'), 'GET / contains #family-top-nav');
    check(rootHtml.includes('id="family-link-job"') && rootHtml.includes('https://job.tellmyname.app'), 'GET / contains active family link for job.tellmyname.app');
    check(rootHtml.includes('id="family-link-myhome"') && rootHtml.includes('https://myhome.tellmyname.app'), 'GET / contains family link for myhome.tellmyname.app');
    check(rootHtml.includes('id="family-link-food"') && rootHtml.includes('https://food.tellmyname.app'), 'GET / contains family link for food.tellmyname.app');
    check(rootHtml.includes('id="family-link-photodiary"') && rootHtml.includes('https://photodiary.tellmyname.app'), 'GET / contains family link for photodiary.tellmyname.app');

    // Head sitemap link tags
    check(rootHtml.includes('href="https://job.tellmyname.app/sitemap.xml"'), 'GET / head includes sitemap link for job.tellmyname.app');
    check(rootHtml.includes('href="https://photodiary.tellmyname.app/sitemap.xml"'), 'GET / head includes sitemap link for photodiary.tellmyname.app');
    check(rootHtml.includes('href="https://myhome.tellmyname.app/sitemap.xml"'), 'GET / head includes sitemap link for myhome.tellmyname.app');
    check(rootHtml.includes('href="https://food.tellmyname.app/sitemap.xml"'), 'GET / head includes sitemap link for food.tellmyname.app');

    // Permanent Share URL: /name/박대기
    const nameRes = await fetch(`${baseUrl}/name/${encodeURIComponent('박대기')}`);
    const nameHtml = await nameRes.text();
    check(nameRes.status === 200, 'GET /name/박대기 returns 200 OK');
    check(nameHtml.includes('박대기님에게 어울리는 직업 (Lv.441)'), 'GET /name/박대기 SSR title matches Lv.441');
    check(nameHtml.includes('/name/%EB%B0%95%EB%8C%80%EA%B8%B0'), 'GET /name/박대기 has canonical URL for /name/박대기');

    // Level URL: /level/1000
    const lvRes = await fetch(`${baseUrl}/level/1000`);
    const lvHtml = await lvRes.text();
    check(lvRes.status === 200 && lvHtml.includes('Lv.1000'), 'GET /level/1000 renders Lv.1000 SSR page');

    // R2 Image serving: existing local PNG (Lv.250) & Edge SVG fallback (level without PNG)
    const img250Res = await fetch(`${baseUrl}/r2/jobs/00250.webp`);
    check(img250Res.status === 200 && img250Res.headers.get('content-type').includes('image/png'), 'GET /r2/jobs/00250.webp serves local generated PNG');

    let fallbackLv = null;
    for (let i = 0; i <= 1000; i++) {
      if (!fs.existsSync(path.join(ROOT_DIR, 'images', `${String(i).padStart(5, '0')}.png`))) {
        fallbackLv = i;
        break;
      }
    }
    if (fallbackLv !== null) {
      const paddedFallback = String(fallbackLv).padStart(5, '0');
      const imgFallbackRes = await fetch(`${baseUrl}/r2/jobs/${paddedFallback}.webp`);
      const imgFallbackText = await imgFallbackRes.text();
      check(imgFallbackRes.status === 200 && imgFallbackRes.headers.get('content-type').includes('image/svg+xml') && imgFallbackText.includes('<svg'), `GET /r2/jobs/${paddedFallback}.webp serves Edge SVG fallback seamlessly`);
    } else {
      const img009Res = await fetch(`${baseUrl}/r2/jobs/00009.webp`);
      check(img009Res.status === 200 && img009Res.headers.get('content-type').includes('image/png'), 'GET /r2/jobs/00009.webp serves local generated PNG (all 1,001 PNGs complete)');
    }

    // API endpoints
    const apiNameRes = await fetch(`${baseUrl}/api/name/${encodeURIComponent('홍길동')}`);
    const apiNameJson = await apiNameRes.json();
    check(apiNameRes.status === 200 && apiNameJson.level === 628 && apiNameJson.era && apiNameJson.estimatedSalary && apiNameJson.specialDuty, 'GET /api/name/홍길동 returns complete JSON with era, estimatedSalary, specialDuty');

    // World Cup SSR Routes
    const wcWorstRes = await fetch(`${baseUrl}/worldcup/worst-to-best`);
    const wcWorstHtml = await wcWorstRes.text();
    check(wcWorstRes.status === 200 && wcWorstHtml.includes('나의 직업 고르기 이상형 월드컵'), 'GET /worldcup/worst-to-best returns SEO-optimized World Cup SSR HTML');

    const wcBestRes = await fetch(`${baseUrl}/worldcup/best-to-worst`);
    const wcBestHtml = await wcBestRes.text();
    check(wcBestRes.status === 200 && wcBestHtml.includes('좋은 직업 이상형 월드컵'), 'GET /worldcup/best-to-worst returns SEO-optimized World Cup SSR HTML');

    // World Cup Same-Condition URL SSR
    const wcSameRes = await fetch(`${baseUrl}/worldcup/worst-to-best?round=32&seed=777888`);
    const wcSameHtml = await wcSameRes.text();
    check(wcSameRes.status === 200 && wcSameHtml.includes('32강') && wcSameHtml.includes('777888'), 'GET /worldcup/worst-to-best?round=32&seed=777888 SSR includes 32강 and seed 777888');

    // 14-Language SSR & Dictionary Verification
    check(SUPPORTED_LANGUAGES.length === 14, 'All 14 languages present in SUPPORTED_LANGUAGES (ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms)');
    const expectedLangs = ['ko', 'en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
    for (const l of expectedLangs) {
      check(SUPPORTED_LANGUAGES.some(s => s.code === l), `SUPPORTED_LANGUAGES includes '${l}'`);
    }

    const enRes = await fetch(`${baseUrl}/name/Steve?lang=en`);
    const enHtml = await enRes.text();
    check(enRes.status === 200 && enHtml.toLowerCase().includes('the job that suits steve'), 'GET /name/Steve?lang=en localizes SSR HTML in English');

    const jaRes = await fetch(`${baseUrl}/name/Alex?lang=ja`);
    const jaHtml = await jaRes.text();
    check(jaRes.status === 200 && jaHtml.includes('Alexさんにぴったりの職業は'), 'GET /name/Alex?lang=ja returns localized SSR HTML in Japanese');

    const hiRes = await fetch(`${baseUrl}/name/Alex?lang=hi`);
    const hiHtml = await hiRes.text();
    check(hiRes.status === 200 && hiHtml.includes('Alex के लिए सबसे उपयुक्त नौकरी है'), 'GET /name/Alex?lang=hi returns localized SSR HTML in Hindi');

    const esRes = await fetch(`${baseUrl}/name/Alex?lang=es`);
    const esHtml = await esRes.text();
    check(esRes.status === 200 && esHtml.includes('El trabajo ideal para Alex es'), 'GET /name/Alex?lang=es returns localized SSR HTML in Spanish');

    // Google AdSense verification (SSR HTML & /ads.txt)
    check(rootHtml.includes('ca-pub-8793936135959956'), 'GET / SSR includes Google AdSense client ID ca-pub-8793936135959956');
    const adsTxtRes = await fetch(`${baseUrl}/ads.txt`);
    const adsTxt = await adsTxtRes.text();
    check(adsTxtRes.status === 200 && adsTxt.includes('ca-pub-8793936135959956'), 'GET /ads.txt includes Google AdSense client ID ca-pub-8793936135959956');

    // Sitemaps, RSS, Robots.txt
    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    const robotsText = await robotsRes.text();
    check(robotsRes.status === 200 && robotsText.includes('https://job.tellmyname.app/sitemap.xml') && robotsText.includes('Yeti'), 'GET /robots.txt allows Naver Yeti & points to job.tellmyname.app sitemaps');
    check(robotsText.includes('Sitemap: https://photodiary.tellmyname.app/sitemap.xml'), 'GET /robots.txt points to photodiary.tellmyname.app/sitemap.xml');
    check(robotsText.includes('Sitemap: https://myhome.tellmyname.app/sitemap.xml'), 'GET /robots.txt points to myhome.tellmyname.app/sitemap.xml');
    check(robotsText.includes('Sitemap: https://food.tellmyname.app/sitemap.xml'), 'GET /robots.txt points to food.tellmyname.app/sitemap.xml');

    const sitemapIndexRes = await fetch(`${baseUrl}/sitemap.xml`);
    const sitemapIndexText = await sitemapIndexRes.text();
    check(sitemapIndexRes.status === 200, 'GET /sitemap.xml returns 200 OK');
    check(sitemapIndexText.includes('https://job.tellmyname.app/sitemap-main.xml'), 'GET /sitemap.xml includes job.tellmyname.app/sitemap-main.xml');
    check(sitemapIndexText.includes('https://photodiary.tellmyname.app/sitemap.xml'), 'GET /sitemap.xml includes photodiary.tellmyname.app/sitemap.xml');
    check(sitemapIndexText.includes('https://myhome.tellmyname.app/sitemap.xml'), 'GET /sitemap.xml includes myhome.tellmyname.app/sitemap.xml');
    check(sitemapIndexText.includes('https://food.tellmyname.app/sitemap.xml'), 'GET /sitemap.xml includes food.tellmyname.app/sitemap.xml');

    const sitemapMainRes = await fetch(`${baseUrl}/sitemap-main.xml`);
    const sitemapMainText = await sitemapMainRes.text();
    check(sitemapMainRes.status === 200, 'GET /sitemap-main.xml returns 200 OK');
    check(sitemapMainText.includes('https://photodiary.tellmyname.app/'), 'GET /sitemap-main.xml includes photodiary root URL');
    check(sitemapMainText.includes('https://myhome.tellmyname.app/'), 'GET /sitemap-main.xml includes myhome root URL');
    check(sitemapMainText.includes('https://food.tellmyname.app/'), 'GET /sitemap-main.xml includes food root URL');

    const distFilesCount = fs.readdirSync(path.join(ROOT_DIR, 'dist'), { recursive: true })
      .filter(f => fs.statSync(path.join(ROOT_DIR, 'dist', f)).isFile()).length;
    check(distFilesCount < 50, `Zero-File-Explosion verified: dist/ has ${distFilesCount} files (< 50)`);
  } finally {
    server.close();
  }

  console.log('\n===================================================================');
  console.log(` 🎉 ALL ${passCount} E2E TESTS PASSED PERFECTLY!`);
  console.log('===================================================================');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
