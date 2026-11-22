// tests/test_feature_5_worker.mjs
// Feature #5 검증 테스트: Cloudflare Worker 엣지 동적 SSR 라우터, 동일 도메인 R2 CDN, 로컬 Dev Server

import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import worker, { renderSeoHtml } from '../worker.js';
import { createDevServer, startServer, createMockEnv } from '../scripts/dev_server.mjs';
import { SITE_ORIGIN } from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== [Feature #5 Test Suite: Cloudflare Worker & Edge SSR Router] ===');

// ----------------------------------------------------
// [1/6] 문법 검사 (Syntax Check)
// ----------------------------------------------------
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check worker.js', { cwd: ROOT_DIR, stdio: 'inherit' });
execSync('node --check scripts/dev_server.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax checks passed for worker.js and scripts/dev_server.mjs');

// ----------------------------------------------------
// [2/6] wrangler.toml 설정 규격 검증
// ----------------------------------------------------
console.log('\n[2/6] Validating wrangler.toml configuration...');
const wranglerPath = path.resolve(ROOT_DIR, 'wrangler.toml');
assert(fs.existsSync(wranglerPath), 'wrangler.toml must exist');
const wranglerContent = fs.readFileSync(wranglerPath, 'utf-8');
assert(wranglerContent.includes('name = "myhome"'), 'wrangler.toml must have name = "myhome"');
assert(wranglerContent.includes('main = "worker.js"'), 'wrangler.toml must have main = "worker.js"');
assert(wranglerContent.includes('binding = "ASSETS"'), 'wrangler.toml must have ASSETS binding');
assert(wranglerContent.includes('binding = "MYHOME_R2"'), 'wrangler.toml must have MYHOME_R2 binding');
assert(wranglerContent.includes('run_worker_first = true'), 'wrangler.toml must have run_worker_first = true');
assert(wranglerContent.includes('directory = "./dist"'), 'wrangler.toml must specify directory = "./dist"');
console.log('✔ wrangler.toml validation passed');

// ----------------------------------------------------
// [3/6] renderSeoHtml 단위 테스트
// ----------------------------------------------------
console.log('\n[3/6] Testing renderSeoHtml dynamic SSR injection...');
const mockBaseHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>Old Title</title>
</head>
<body>
  <div id="app">
    <section id="card-root">
      <p>Old Content</p>
    </section>
  </div>
</body>
</html>`;

const mockHouse = {
  level: 74,
  tier: 3,
  tierName: 'Tier 03: 폐가·교도소·디스토피아',
  zone: 'BAD',
  zoneLabel: '폭망 하우스',
  realityType: 'REAL',
  realityLabel: '실제 존재하는 건축물·사물',
  category: 'MUSEUM_PUBLIC',
  categoryLabel: '이색 박물관·교도소·기괴 공공건물',
  categoryEmoji: '🏛️',
  title: '체르노빌 프리피야트 폐유원지 관람차 4번 곤돌라',
  builtYear: '1986년 4월 25일 (개장 하루 전 영구 휴장)',
  estimatedValue: '고철값 42,800원 (방사능 제염 비용 14억 원 본인 부담)',
  specialFeature: '밤마다 형광 녹색 자체 발광 무드등이 켜져 전기세가 0원이며 관람차가 바람에 흔들릴 때마다 360도 파노라마 폐허 뷰를 제공합니다.',
  aiVerdict: '축하합니다! 전 세계에서 가장 스릴 넘치는 고공 자연인의 삶에 당첨되셨습니다.',
  strokes: [7, 4, 6],
  totalStrokes: 17
};

const renderedHtml = renderSeoHtml(mockBaseHtml, mockHouse, '김서윤');
assert(!renderedHtml.includes('Old Title'), 'Old title must be replaced');
assert(!renderedHtml.includes('Old Content'), 'Old content in section#card-root must be replaced');
assert(renderedHtml.includes('<title>김서윤님에게 어울리는 집 (Lv.74) — 체르노빌 프리피야트 폐유원지 관람차 4번 곤돌라 | 나에게 어울리는 집</title>'), 'Title must match exact specification');
assert(renderedHtml.includes('name="description"'), 'Meta description must be present');
assert(renderedHtml.includes('1986년 4월 25일'), 'Description/Specs must include builtYear');
assert(renderedHtml.includes('고철값 42,800원'), 'Description/Specs must include estimatedValue');
assert(renderedHtml.includes('형광 녹색 자체 발광 무드등'), 'Description/Specs must include specialFeature');
assert(renderedHtml.includes('https://myhome.tellmyname.app/r2/houses/00074.webp'), 'og:image must match padded level format');
assert(renderedHtml.includes('<article class="seo-house-ssr" data-level="74">'), 'SSR article must be injected with class seo-house-ssr and data-level');
assert(renderedHtml.includes('window.__INITIAL_HOUSE_DATA__ ='), 'Initial hydration script must be injected');

// JSON-LD 검증
const jsonLdMatch = renderedHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch, 'JSON-LD script must be present');
const parsedLd = JSON.parse(jsonLdMatch[1]);
assert(parsedLd['@graph'], 'JSON-LD must have @graph structure');
const types = parsedLd['@graph'].map(item => item['@type']);
assert(types.includes('WebPage'), 'JSON-LD must include WebPage');
assert(types.includes('Residence'), 'JSON-LD must include Residence');
assert(types.includes('FAQPage'), 'JSON-LD must include FAQPage');

const faq = parsedLd['@graph'].find(item => item['@type'] === 'FAQPage');
const qNames = faq.mainEntity.map(q => q.name);
assert(qNames.includes('언제 지어진 집인가요?'), 'FAQPage must answer 언제 지어진 집인가요?');
assert(qNames.includes('추산 가치는 얼마인가요?'), 'FAQPage must answer 추산 가치는 얼마인가요?');
assert(qNames.includes('특별한 기능은 무엇인가요?'), 'FAQPage must answer 특별한 기능은 무엇인가요?');

console.log('✔ renderSeoHtml dynamic SSR injection validated');

// ----------------------------------------------------
// [4/6] worker.fetch 라우트별 직접 테스트 (Mock env.ASSETS)
// ----------------------------------------------------
console.log('\n[4/6] Testing worker.fetch routes directly...');

const mockEnv = {
  ASSETS: {
    async fetch(req) {
      return new Response(mockBaseHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  },
  MYHOME_R2: null
};

// Route 3A: GET /name/:name (김서윤 -> Lv.512)
const reqKim = new Request('https://myhome.tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4');
const resKim = await worker.fetch(reqKim, mockEnv, {});
assert.strictEqual(resKim.status, 200, 'Status must be 200');
assert.strictEqual(resKim.headers.get('Content-Type'), 'text/html; charset=utf-8');
const textKim = await resKim.text();
assert(textKim.includes('<title>김서윤님에게 어울리는 집 (Lv.512)'), 'Title must contain name and active level 512');
assert(textKim.includes('/r2/houses/00512.webp'), 'og:image must be /r2/houses/00512.webp');
assert(textKim.includes('data-level="512"'), 'Must contain data-level="512"');
assert(textKim.includes('window.__INITIAL_HOUSE_DATA__'), 'Must include initial hydration data');
console.log('  ✔ Route /name/%EA%B9%80%EC%84%9C%EC%9C%A4 (김서윤 -> Lv.512) verified');

// Route 3B: GET /level/500 (Lv.500)
const req500 = new Request('https://myhome.tellmyname.app/level/500');
const res500 = await worker.fetch(req500, mockEnv, {});
assert.strictEqual(res500.status, 200);
const text500 = await res500.text();
assert(text500.includes('Lv.500'), 'Title must contain Lv.500');
assert(text500.includes('35억 원'), 'Must contain estimatedValue of level 500');
assert(text500.includes('data-level="500"'), 'Must contain data-level="500"');
console.log('  ✔ Route /level/500 verified');

// Route 1: GET /r2/houses/00074.webp (Fallback SVG generation on edge)
const reqR2 = new Request('https://myhome.tellmyname.app/r2/houses/00074.webp');
const resR2 = await worker.fetch(reqR2, mockEnv, {});
assert.strictEqual(resR2.status, 200);
assert.strictEqual(resR2.headers.get('Content-Type'), 'image/svg+xml; charset=utf-8');
assert(resR2.headers.get('Cache-Control').includes('immutable'), 'Cache-Control must have immutable');
assert.strictEqual(resR2.headers.get('Access-Control-Allow-Origin'), '*');
const svgText = await resR2.text();
assert(svgText.includes('<svg'), 'Generated image must be valid SVG');
console.log('  ✔ Route /r2/houses/00074.webp (Edge SVG fallback) verified');

// Route 1 with Mock R2 bucket hit
const mockR2HitEnv = {
  ...mockEnv,
  MYHOME_R2: {
    async get(key) {
      if (key === 'houses/00074.webp') {
        return {
          body: Buffer.from('FAKE_WEBP_DATA'),
          size: 14,
          httpMetadata: { contentType: 'image/webp' },
          httpEtag: '"12345"'
        };
      }
      return null;
    }
  }
};
const reqR2Hit = new Request('https://myhome.tellmyname.app/r2/houses/00074.webp');
const resR2Hit = await worker.fetch(reqR2Hit, mockR2HitEnv, {});
assert.strictEqual(resR2Hit.status, 200);
assert.strictEqual(resR2Hit.headers.get('Content-Type'), 'image/webp');
assert.strictEqual(await resR2Hit.text(), 'FAKE_WEBP_DATA');
console.log('  ✔ Route /r2/houses/00074.webp (R2 hit) verified');

// Route 2A: GET /api/name/%EC%84%9C%EC%9C%A4
const reqApiName = new Request('https://myhome.tellmyname.app/api/name/%EC%84%9C%EC%9C%A4');
const resApiName = await worker.fetch(reqApiName, mockEnv, {});
assert.strictEqual(resApiName.status, 200);
assert(resApiName.headers.get('Content-Type').includes('application/json'));
assert.strictEqual(resApiName.headers.get('Access-Control-Allow-Origin'), '*');
const jsonApiName = await resApiName.json();
assert.strictEqual(jsonApiName.cleanName, '서윤');
assert(Array.isArray(jsonApiName.strokes), 'Strokes must be array');
assert(typeof jsonApiName.level === 'number', 'Level must be a number');
assert.strictEqual(jsonApiName.level, 262);
assert(jsonApiName.builtYear, 'builtYear must be present');
assert(jsonApiName.estimatedValue, 'estimatedValue must be present');
assert(jsonApiName.specialFeature, 'specialFeature must be present');
console.log(`  ✔ Route /api/name/%EC%84%9C%EC%9C%A4 (서윤 -> Lv.${jsonApiName.level}) verified`);

// Route 2B: GET /api/house/500
const reqApiHouse = new Request('https://myhome.tellmyname.app/api/house/500');
const resApiHouse = await worker.fetch(reqApiHouse, mockEnv, {});
assert.strictEqual(resApiHouse.status, 200);
const jsonApiHouse = await resApiHouse.json();
assert.strictEqual(jsonApiHouse.level, 500);
assert.strictEqual(jsonApiHouse.zone, 'GOOD');
assert(jsonApiHouse.title.includes('서바이벌 콘도') || jsonApiHouse.title.includes('미국 캔자스'));
console.log('  ✔ Route /api/house/500 verified');

// CORS OPTIONS preflight check
const reqOptions = new Request('https://myhome.tellmyname.app/api/name/%EC%84%9C%EC%9C%A4', {
  method: 'OPTIONS'
});
const resOptions = await worker.fetch(reqOptions, mockEnv, {});
assert.strictEqual(resOptions.status, 204);
assert.strictEqual(resOptions.headers.get('Access-Control-Allow-Origin'), '*');
console.log('  ✔ CORS OPTIONS preflight verified');

// Route 5: GET /robots.txt
const reqRobots = new Request('https://myhome.tellmyname.app/robots.txt');
const resRobots = await worker.fetch(reqRobots, mockEnv, {});
assert.strictEqual(resRobots.status, 200, 'robots.txt status must be 200');
assert.strictEqual(resRobots.headers.get('Content-Type'), 'text/plain; charset=utf-8');
const robotsText = await resRobots.text();
assert(robotsText.includes('User-agent: Yeti'), 'robots.txt must include Yeti');
assert(robotsText.includes('User-agent: Googlebot'), 'robots.txt must include Googlebot');
assert(robotsText.includes('User-agent: kakaotalk-scrap'), 'robots.txt must include kakaotalk-scrap');
assert(robotsText.includes('User-agent: facebookexternalhit'), 'robots.txt must include facebookexternalhit');
assert(robotsText.includes('Sitemap: https://myhome.tellmyname.app/sitemap.xml'), 'robots.txt must include sitemap.xml');
assert(robotsText.includes('Sitemap: https://myhome.tellmyname.app/rss.xml'), 'robots.txt must include rss.xml');
console.log('  ✔ Route /robots.txt verified (200 text/plain, Yeti/Googlebot/Sitemaps)');

// Route 5: GET /ads.txt
const reqAds = new Request('https://myhome.tellmyname.app/ads.txt');
const resAds = await worker.fetch(reqAds, mockEnv, {});
assert.strictEqual(resAds.status, 200, 'ads.txt status must be 200');
assert.strictEqual(resAds.headers.get('Content-Type'), 'text/plain; charset=utf-8');
const adsText = await resAds.text();
assert.strictEqual(adsText, 'google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n');
console.log('  ✔ Route /ads.txt verified (200 text/plain, pub-8793936135959956)');

// Route 4: GET / (Root SEO length limits: title <= 40, desc <= 80)
const reqRoot = new Request('https://myhome.tellmyname.app/');
const resRoot = await worker.fetch(reqRoot, mockEnv, {});
assert.strictEqual(resRoot.status, 200);
const rootHtml = await resRoot.text();
const titleMatch = rootHtml.match(/<title>([^<]*)<\/title>/);
assert(titleMatch, 'Root title must exist');
const rootTitle = titleMatch[1];
assert(rootTitle.length <= 40, `Root title must be <= 40 chars, got ${rootTitle.length}`);
assert.strictEqual(rootTitle, '나에게 어울리는 집 - 이름만 입력해서 찾는 재미로 보는 집 테스트');

const descMatch = rootHtml.match(/<meta name="description" content="([^"]*)"/);
assert(descMatch, 'Root description must exist');
const rootDesc = descMatch[1];
assert(rootDesc.length <= 80, `Root description must be <= 80 chars, got ${rootDesc.length}`);
assert.strictEqual(rootDesc, '이름만 입력하면 나에게 어울리는 집을 바로 찾을 수 있어요! 0단계부터 999단계까지 재미로 보는 내 집 찾기 테스트를 지금 해보세요.');

const ogTitleMatch = rootHtml.match(/<meta property="og:title" content="([^"]*)"/);
assert(ogTitleMatch && ogTitleMatch[1].length <= 40, 'Root og:title must be <= 40 chars');
const ogDescMatch = rootHtml.match(/<meta property="og:description" content="([^"]*)"/);
assert(ogDescMatch && ogDescMatch[1].length <= 80, 'Root og:description must be <= 80 chars');
console.log(`  ✔ Route / verified (Root Title: ${rootTitle.length} chars <= 40, Root Desc: ${rootDesc.length} chars <= 80)`);

// ----------------------------------------------------
// [5/6] scripts/dev_server.mjs 모의 환경 검증
// ----------------------------------------------------
console.log('\n[5/6] Testing dev_server mock environment...');
const devEnv = createMockEnv();
assert(devEnv.ASSETS && typeof devEnv.ASSETS.fetch === 'function', 'devEnv must have ASSETS.fetch');
assert(devEnv.MYHOME_R2 && typeof devEnv.MYHOME_R2.get === 'function', 'devEnv must have MYHOME_R2.get');

// Test static asset fetch via devEnv
const assetReq = new Request('http://localhost:8788/wrangler.toml');
const assetRes = await devEnv.ASSETS.fetch(assetReq);
assert.strictEqual(assetRes.status, 200, 'devEnv ASSETS should serve wrangler.toml from root');
const assetContent = await assetRes.text();
assert(assetContent.includes('name = "myhome"'));
console.log('✔ dev_server mock environment verified');

// ----------------------------------------------------
// [6/6] scripts/dev_server.mjs 실제 HTTP E2E 테스트
// ----------------------------------------------------
console.log('\n[6/6] Testing actual HTTP server execution via startServer()...');
// Port 0 선택 시 OS가 미사용 임의 포트 자동 할당
const runningDev = await startServer({ port: 0, silent: true });
console.log(`  Dev server successfully running on port ${runningDev.port}`);

try {
  const baseUrl = `http://127.0.0.1:${runningDev.port}`;

  // 1. SSR /name/김서윤 E2E HTTP GET (Lv.512)
  const httpResName = await fetch(`${baseUrl}/name/%EA%B9%80%EC%84%9C%EC%9C%A4`);
  assert.strictEqual(httpResName.status, 200);
  const httpTextName = await httpResName.text();
  assert(httpTextName.includes('<title>김서윤님에게 어울리는 집 (Lv.512)'));
  assert(httpTextName.includes('data-level="512"'));
  console.log('  ✔ HTTP GET /name/%EA%B9%80%EC%84%9C%EC%9C%A4 succeeded');

  // 2. R2 House image HTTP GET (serves PNG directly from G:\My Drive\new_houses\00074.png or webp/svg)
  const httpResR2 = await fetch(`${baseUrl}/r2/houses/00074.webp`);
  assert.strictEqual(httpResR2.status, 200);
  const r2Type = httpResR2.headers.get('content-type');
  assert(
    r2Type.includes('image/png') || r2Type.includes('image/webp') || r2Type.includes('image/svg+xml'),
    `content-type must be image/png, image/webp or image/svg+xml, got ${r2Type}`
  );
  console.log(`  ✔ HTTP GET /r2/houses/00074.webp succeeded (Content-Type: ${r2Type})`);

  // 3. API HTTP GET
  const httpResApi = await fetch(`${baseUrl}/api/name/%EC%84%9C%EC%9C%A4`);
  assert.strictEqual(httpResApi.status, 200);
  const httpJson = await httpResApi.json();
  assert.strictEqual(httpJson.cleanName, '서윤');
  assert.strictEqual(httpJson.level, 262);
  console.log('  ✔ HTTP GET /api/name/%EC%84%9C%EC%9C%A4 succeeded');

  // 4. SSR /level/500 E2E HTTP GET
  const httpResLevel = await fetch(`${baseUrl}/level/500`);
  assert.strictEqual(httpResLevel.status, 200);
  const httpTextLevel = await httpResLevel.text();
  assert(httpTextLevel.includes('Lv.500'));
  console.log('  ✔ HTTP GET /level/500 succeeded');
} finally {
  await runningDev.close();
  console.log('  Dev server cleanly closed');
}

console.log('\n======================================================');
console.log('🎉 ALL FEATURE #5 WORKER & DEV_SERVER TESTS PASSED!');
console.log('======================================================');
