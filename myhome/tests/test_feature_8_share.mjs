// tests/test_feature_8_share.mjs
// Feature #8 검증 테스트: 이름 고정 URL 기반 인스타그램 스토리 9:16 캔버스 & 카카오톡 공유 기능 검증 (다국어 지원)

import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  SHARE_ORIGIN,
  buildPermanentShareUrl,
  buildSharePayload,
  copyShareUrl,
  renderStoryCanvas,
  openShareModal,
  showToast
} from '../web/js/share.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SHARE_JS_PATH = path.join(ROOT_DIR, 'web', 'js', 'share.js');
const SHARE_CSS_PATH = path.join(ROOT_DIR, 'web', 'css', 'share.css');

console.log('=== [Feature #8 Test Suite: Permanent URL & 9:16 Story / Kakao Share] ===');

// 1. 구문 검사 (node --check web/js/share.js)
console.log('\n[1/6] Running syntax checks with node --check...');
execSync('node --check web/js/share.js', { cwd: ROOT_DIR, stdio: 'inherit' });
console.log('✔ Syntax check passed (web/js/share.js)');

// 2. 파일 존재성 및 CSS 규격 검증
console.log('\n[2/6] Verifying file existence & CSS styling rules...');
assert(fs.existsSync(SHARE_JS_PATH), 'web/js/share.js must exist');
assert(fs.existsSync(SHARE_CSS_PATH), 'web/css/share.css must exist');

const cssContent = fs.readFileSync(SHARE_CSS_PATH, 'utf-8');
const requiredSelectors = [
  '#share-modal-root',
  '.share-modal-backdrop',
  '.share-modal',
  '.theme-selector',
  '.theme-pill',
  '.share-canvas-wrapper',
  '.share-url-container',
  '.share-btn-save',
  '.share-btn-kakao',
  '.share-btn-copy',
  '.share-toast'
];

for (const sel of requiredSelectors) {
  assert(cssContent.includes(sel), `CSS must include required selector: ${sel}`);
}
console.log('✔ CSS styles verified with all required modal, canvas, and responsive classes');

// 3. SHARE_ORIGIN 및 URL 빌더 검증
console.log('\n[3/6] Verifying SHARE_ORIGIN & buildPermanentShareUrl...');
assert.strictEqual(SHARE_ORIGIN, 'https://tellmyname.app', 'SHARE_ORIGIN must match unified production domain');

// 필수 요구사항: '김서윤' 입력 시 https://tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4
const sampleHouse = {
  level: 74,
  title: '체르노빌 관람차 곤돌라',
  builtYear: '1986년 4월',
  estimatedValue: '850만 원 (철거 위험 할인가)',
  specialFeature: '공중 35m에서 삐걱거리는 녹슨 쇠사슬과 밤마다 들리는 의문의 노랫소리',
  aiVerdict: '극한의 방사능 스릴과 레트로 감성을 동시에 만끽하는 세기말 단칸 곤돌라입니다.'
};

const urlWithName = buildPermanentShareUrl(sampleHouse, '김서윤');
assert.strictEqual(
  urlWithName,
  'https://tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4',
  'Must return permanent encoded name URL for 김서윤'
);

// 공백 포함 이름 검증 (트림 처리)
const urlWithSpacedName = buildPermanentShareUrl(sampleHouse, '   김서윤   ');
assert.strictEqual(
  urlWithSpacedName,
  'https://tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4',
  'Must trim whitespace before encoding name'
);

// 필수 요구사항: 이름 생략/빈 문자열 시 /level/74
const urlWithoutName = buildPermanentShareUrl(sampleHouse, '');
assert.strictEqual(
  urlWithoutName,
  'https://tellmyname.app/level/74',
  'Must return /level/74 when name is omitted'
);

const urlWithUndefinedName = buildPermanentShareUrl(sampleHouse);
assert.strictEqual(
  urlWithUndefinedName,
  'https://tellmyname.app/level/74',
  'Must return /level/74 when name argument is undefined'
);

// 경계 레벨 검증 (0, 999)
assert.strictEqual(buildPermanentShareUrl({ level: 0 }, ''), 'https://tellmyname.app/level/0');
assert.strictEqual(buildPermanentShareUrl({ level: 999 }, ''), 'https://tellmyname.app/level/999');
console.log('✔ buildPermanentShareUrl verified across all name and level conditions (0..999)');

// 4. buildSharePayload 검증
console.log('\n[4/6] Verifying buildSharePayload...');
const payloadWithName = buildSharePayload(sampleHouse, '김서윤');

assert(payloadWithName.title.includes('김서윤님에게 어울리는 집'), 'Title must address the owner name');
assert(payloadWithName.title.includes('Lv.74'), 'Title must include house level');
assert(payloadWithName.title.includes('체르노빌 관람차 곤돌라'), 'Title must include house title');
assert(payloadWithName.text.includes('1986년 4월'), 'Text must include builtYear');
assert(payloadWithName.text.includes('850만 원'), 'Text must include estimatedValue');
assert.strictEqual(
  payloadWithName.url,
  'https://tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4',
  'Payload URL must match permanent URL'
);
assert.strictEqual(
  payloadWithName.imageUrl,
  'https://img.tellmyname.app/houses/00074.webp',
  'Payload imageUrl must match R2 Custom Domain WebP URL'
);

const payloadWithoutName = buildSharePayload(sampleHouse, '');
assert(payloadWithoutName.title.startsWith('나에게 어울리는 집'), 'Anonymous title must start with 나에게 어울리는 집');
assert.strictEqual(payloadWithoutName.url, 'https://tellmyname.app/level/74');
console.log('✔ buildSharePayload structure and content verified');

// 5. copyShareUrl 비동기 실행 및 Node fallback 내결함성 검증
console.log('\n[5/6] Verifying copyShareUrl non-browser resilience...');
const copiedUrl = await copyShareUrl(sampleHouse, '김서윤');
assert.strictEqual(copiedUrl, 'https://tellmyname.app/name/%EA%B9%80%EC%84%9C%EC%9C%A4');
console.log('✔ copyShareUrl executed safely and returned exact target URL without errors');

// 6. renderStoryCanvas 캔버스 2D 렌더링 검증 (Mock Canvas Context)
console.log('\n[6/6] Verifying renderStoryCanvas (1080x1920 Instagram 9:16 layout) with all themes...');

function createMockCanvas() {
  const recordedCalls = [];
  const mockCtx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    shadowColor: '',
    shadowBlur: 0,
    createLinearGradient: () => ({
      addColorStop: () => {}
    }),
    fillRect: (x, y, w, h) => recordedCalls.push({ method: 'fillRect', x, y, w, h }),
    strokeRect: (x, y, w, h) => recordedCalls.push({ method: 'strokeRect', x, y, w, h }),
    beginPath: () => recordedCalls.push({ method: 'beginPath' }),
    closePath: () => recordedCalls.push({ method: 'closePath' }),
    moveTo: (x, y) => recordedCalls.push({ method: 'moveTo', x, y }),
    lineTo: (x, y) => recordedCalls.push({ method: 'lineTo', x, y }),
    quadraticCurveTo: () => {},
    arc: (x, y, r) => recordedCalls.push({ method: 'arc', x, y, r }),
    stroke: () => recordedCalls.push({ method: 'stroke' }),
    fill: () => recordedCalls.push({ method: 'fill' }),
    clip: () => recordedCalls.push({ method: 'clip' }),
    save: () => recordedCalls.push({ method: 'save' }),
    restore: () => recordedCalls.push({ method: 'restore' }),
    fillText: (text, x, y) => recordedCalls.push({ method: 'fillText', text, x, y }),
    measureText: (text) => ({ width: (String(text).length) * 12 }),
    drawImage: () => recordedCalls.push({ method: 'drawImage' })
  };

  return {
    width: 0,
    height: 0,
    getContext: (type) => (type === '2d' ? mockCtx : null),
    _calls: recordedCalls
  };
}

// 3가지 테마 및 fallback 렌더링 테스트 (한국어)
const themes = ['cert', 'cyber', 'sunset', 'cosmic'];
for (const theme of themes) {
  const mockCanvas = createMockCanvas();
  const rendered = await renderStoryCanvas(mockCanvas, sampleHouse, '김서윤', theme, 'ko');
  assert.strictEqual(rendered, mockCanvas, `renderStoryCanvas should return the canvas for theme ${theme}`);
  assert.strictEqual(mockCanvas.width, 1080, 'Canvas width must be set to 1080');
  assert(mockCanvas.height >= 1520, 'Canvas height must dynamically adjust >= 1520 with zero clipping');

  // 텍스트 드로잉에 김서윤, 레벨, 타이틀이 호출되었는지 확인
  const fillTexts = mockCanvas._calls.filter(c => c.method === 'fillText').map(c => c.text);
  assert(
    fillTexts.some(t => t && t.includes('김서윤님에게 어울리는 집은')),
    `Theme ${theme}: Must draw primary headline ("김서윤님에게 어울리는 집은")`
  );
  assert(
    fillTexts.some(t => t && t.includes('Lv.74')),
    `Theme ${theme}: Must draw level badge`
  );
  assert(
    fillTexts.some(t => t && (t.includes('실제') || t.includes('상상'))),
    `Theme ${theme}: Must draw reality badge`
  );
  assert(
    !fillTexts.some(t => t && t.includes('공유용')),
    `Theme ${theme}: Must never render clutter text 공유용`
  );
}

// 영어 (en) 스토리 캔버스 렌더링 검증 ("The House That Suits Steve")
const mockEnCanvas = createMockCanvas();
await renderStoryCanvas(mockEnCanvas, sampleHouse, 'Steve', 'cyber', 'en');
const enTexts = mockEnCanvas._calls.filter(c => c.method === 'fillText').map(c => c.text);
assert(
  enTexts.some(t => t && t.includes('The House That Suits Steve')),
  'English canvas must draw "The House That Suits Steve" headline'
);
console.log('✔ English story canvas verified ("The House That Suits Steve")');

// 짝수(실제) vs 홀수(상상) 뱃지 텍스트 검증
const mockEvenCanvas = createMockCanvas();
await renderStoryCanvas(mockEvenCanvas, { level: 74, title: '짝수 하우스' }, '테스터', 'cert');
const evenTexts = mockEvenCanvas._calls.filter(c => c.method === 'fillText').map(c => c.text);
assert(evenTexts.some(t => t && t.includes('실제')), 'Level 74 (even) must render 실제 badge');

const mockOddCanvas = createMockCanvas();
await renderStoryCanvas(mockOddCanvas, { level: 75, title: '홀수 하우스' }, '테스터', 'cert');
const oddTexts = mockOddCanvas._calls.filter(c => c.method === 'fillText').map(c => c.text);
assert(oddTexts.some(t => t && t.includes('상상')), 'Level 75 (odd) must render 상상 badge');

console.log('✔ renderStoryCanvas verified across all themes, languages (ko, en), and alternating badges');

console.log('\n======================================================');
console.log('🎉 Feature #8 ALL TESTS PASSED SUCCESSFULLY! (Exit Code 0)');
console.log('======================================================');
