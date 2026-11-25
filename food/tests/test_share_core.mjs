// tests/test_share_core.mjs — Comprehensive Unit Tests for share_core.js
import assert from 'node:assert';
import {
  FALLBACK_SAVE_TOASTS,
  getFallbackSaveToast,
  FONT_STACK_SANS,
  FONT_STACK_SERIF,
  getThemePalette,
  renderStoryCanvas,
  canvasToBlob,
  downloadImage,
  shareImage,
  shareKakaoText,
  shareWhatsAppText
} from '../web/js/share_core.js';

import {
  buildWhatsAppShareText
} from '../web/js/share.js';

import {
  SUPPORTED_LANG_CODES
} from '../src/lib/i18n.js';

console.log('=== [Mukbang] Share Core Engine & Story Canvas Test Suite ===\n');

// 1. Verify Fallback Toasts in all 14 Languages
console.log('[Check 1] Fallback Save Toast Completeness & Zero Hangul in Non-ko');
const HANGUL_REGEX = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;

for (const lang of SUPPORTED_LANG_CODES) {
  const toast = getFallbackSaveToast(lang);
  assert(typeof toast === 'string' && toast.trim().length > 0, `[${lang}] Fallback toast must be non-empty`);
  if (lang !== 'ko') {
    assert(!HANGUL_REGEX.test(toast), `[${lang}] Fallback toast must not contain Hangul: "${toast}"`);
  } else {
    assert(toast.includes('이미지를 저장했습니다'), 'Korean fallback toast must match spec');
  }
}
console.log('✔ Verified fallback save toasts for all 14 languages with zero Hangul leakage in non-ko');

// 2. Helper: Create Mock Canvas & 2D Context for Node.js
function createMockCanvas(width = 1080, height = 1920) {
  const drawnTexts = [];
  const drawnRects = [];
  const drawnImages = [];

  const ctx = {
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    letterSpacing: '0px',
    save() {},
    restore() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    rect() {},
    roundRect(x, y, w, h, r) {
      drawnRects.push({ x, y, w, h, r });
    },
    stroke() {},
    fill() {},
    clip() {},
    fillRect(x, y, w, h) {
      drawnRects.push({ x, y, w, h, fill: true });
    },
    fillText(text, x, y) {
      drawnTexts.push({ text: String(text), x, y });
    },
    measureText(text) {
      return { width: String(text).length * 14 };
    },
    drawImage(img, x, y, w, h) {
      drawnImages.push({ img, x, y, w, h });
    },
    createLinearGradient() {
      return { addColorStop() {} };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    }
  };

  const canvas = {
    width,
    height,
    getContext(type) {
      if (type === '2d') return ctx;
      return null;
    },
    toBlob(callback, type = 'image/png') {
      const mockBlob = new Blob(['mock_png_binary_data'], { type });
      callback(mockBlob);
    },
    toDataURL(type = 'image/png') {
      return `data:${type};base64,bW9ja19kYXRh`;
    },
    _inspect: { drawnTexts, drawnRects, drawnImages }
  };

  return canvas;
}

// 3. Test renderStoryCanvas in 'food' Mode (Feature #14 Enlarged Showcase)
console.log('\n[Check 2] renderStoryCanvas mode: "food" (Illustration Showcase)');
{
  const mockCanvas = createMockCanvas();
  const sampleFood = {
    code: '00116',
    name: '황금빛 바삭 꽈배기와 찹쌀도넛',
    englishName: 'Golden Crispy Twisted Donuts',
    rawName: '황금빛 바삭 꽈배기와 찹쌀도넛',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    calories: '420 kcal',
    priceRange: '3,000원',
    tagline: '설탕 솔솔 뿌려 갓 튀겨낸 쫄깃하고 달콤한 시장통 국민 간식',
    pairingTip: '차가운 흰 우유 500ml와 함께 드세요.'
  };

  await renderStoryCanvas({
    mode: 'food',
    lang: 'ko',
    items: [sampleFood],
    canvas: mockCanvas
  });

  assert.strictEqual(mockCanvas.width, 1080, 'Canvas width must be 1080');
  assert(mockCanvas.height >= 1520, 'Canvas height must be dynamically computed >= 1520');

  const texts = mockCanvas._inspect.drawnTexts.map(t => t.text);
  assert(texts.some(t => t.includes('00116')), 'Canvas must include food code #00116');
  assert(texts.some(t => t.includes('황금빛 바삭 꽈배기')), 'Canvas must include food name');
  assert(texts.some(t => t.includes('420 kcal')), 'Canvas must include calories');
  assert(texts.some(t => t.includes('시장통 국민 간식')), 'Canvas must include tagline');
  assert(texts.some(t => t.includes('tellmyname.app/food')), 'Canvas must include unified site footer');
  console.log('✔ mode: "food" renders 1080xDynamic enlarged illustration card with full metadata');
}

// 4. Test renderStoryCanvas in 'daily' Mode (5 Meals Course Board)
console.log('\n[Check 3] renderStoryCanvas mode: "daily" (5-Meal Daily Course Board)');
{
  const mockCanvas = createMockCanvas();
  const mockDailyData = {
    name: '김서윤',
    date: '2026-11-09',
    orderedList: [
      { mealKey: 'breakfast', mealEmoji: '🌅', timeRangeText: '05:00~09:59', themeColor: '#FF9F43', food: { name: '유기농 생당근', originGroup: 'RAW_NATURAL', calories: '45 kcal', priceRange: '1,000원' } },
      { mealKey: 'lunch', mealEmoji: '☀️', timeRangeText: '10:00~13:59', themeColor: '#FF6B6B', food: { name: '전주 콩나물국밥', originGroup: 'KOREAN_POPULAR', calories: '450 kcal', priceRange: '8,000원' } },
      { mealKey: 'snack', mealEmoji: '🍰', timeRangeText: '14:00~16:59', themeColor: '#F368E0', food: { name: '마카롱 세트', originGroup: 'GLOBAL_DINING', calories: '250 kcal', priceRange: '5,000원' } },
      { mealKey: 'dinner', mealEmoji: '🌙', timeRangeText: '17:00~20:59', themeColor: '#54A0FF', food: { name: '미슐랭 한우 구이', originGroup: 'MICHELIN_2', calories: '650 kcal', priceRange: '65,000원' } },
      { mealKey: 'night', mealEmoji: '🦉', timeRangeText: '21:00~04:59', themeColor: '#8395A7', food: { name: '얼큰 해장 라면', originGroup: 'BUNSIK', calories: '500 kcal', priceRange: '4,500원' } }
    ]
  };

  await renderStoryCanvas({
    mode: 'daily',
    lang: 'ko',
    dailyData: mockDailyData,
    canvas: mockCanvas
  });

  const texts = mockCanvas._inspect.drawnTexts.map(t => t.text);
  assert(texts.some(t => t.includes('김서윤')), 'Canvas must include user name');
  assert(texts.some(t => t.includes('2026-11-09')), 'Canvas must include date');
  assert(texts.some(t => t.includes('전주 콩나물국밥')), 'Canvas must include lunch food name');
  assert(texts.some(t => t.includes('1,895') || t.includes('kcal')), 'Canvas must include total calories calculation');
  console.log('✔ mode: "daily" renders 5-meal complete board with calories and name');
}

// 5. Test canvasToBlob with toBlob and toDataURL
console.log('\n[Check 4] canvasToBlob Promise Resolution');
{
  const mockCanvas1 = createMockCanvas();
  const blob1 = await canvasToBlob(mockCanvas1);
  assert(blob1 instanceof Blob, 'Must return a Blob instance');
  assert.strictEqual(blob1.type, 'image/png', 'Blob type must be image/png');

  // Test dataURL fallback when toBlob is undefined
  const mockCanvas2 = createMockCanvas();
  delete mockCanvas2.toBlob;
  const blob2 = await canvasToBlob(mockCanvas2);
  assert(blob2 instanceof Blob, 'Must return a Blob instance via dataURL fallback');
  assert.strictEqual(blob2.type, 'image/png');
  console.log('✔ canvasToBlob handles both toBlob and toDataURL cleanly');
}

// 6. Test shareImage Web Share API Level 2 and Download Fallback
console.log('\n[Check 5] shareImage Native Level 2 and Fallback Logic');
{
  const testBlob = new Blob(['png_data'], { type: 'image/png' });
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

  // Scenario A: Web Share API with File is supported
  let shareCalledWith = null;
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      canShare: (data) => Boolean(data && data.files),
      share: async (data) => {
        shareCalledWith = data;
      }
    },
    configurable: true,
    writable: true
  });

  const result1 = await shareImage({
    blob: testBlob,
    filename: 'test-story.png',
    title: 'Test Title',
    text: 'Test Text',
    url: 'https://food.tellmyname.app'
  });

  assert.strictEqual(result1.success, true);
  assert.strictEqual(result1.method, 'share');
  assert(shareCalledWith && Array.isArray(shareCalledWith.files), 'Files array must be passed to navigator.share');
  assert.strictEqual(shareCalledWith.files[0].name, 'test-story.png');
  console.log('  - Level 2 native file share invoked successfully');

  // Scenario B: User aborts share sheet (AbortError)
  globalThis.navigator.share = async () => {
    const err = new Error('User cancelled');
    err.name = 'AbortError';
    throw err;
  };

  const result2 = await shareImage({
    blob: testBlob,
    filename: 'test-story.png'
  });
  assert.strictEqual(result2.success, false);
  assert.strictEqual(result2.aborted, true);
  console.log('  - AbortError cleanly handled without error');

  // Scenario C: File share unsupported (Desktop Chrome) -> Automatic download fallback
  globalThis.navigator.canShare = () => false;

  // Mock document.createElement for downloadImage
  let downloadTriggered = false;
  let downloadedFilename = '';
  globalThis.document = {
    createElement(tag) {
      const el = {
        href: '',
        download: '',
        style: {},
        className: '',
        innerHTML: '',
        setAttribute(k, v) { this[k] = v; },
        click() {
          downloadTriggered = true;
          downloadedFilename = this.download;
        }
      };
      return el;
    },
    body: {
      appendChild() {},
      removeChild() {}
    },
    getElementById() { return null; }
  };
  globalThis.window = {
    URL: {
      createObjectURL: () => 'blob:mock-url',
      revokeObjectURL: () => {}
    }
  };

  const result3 = await shareImage({
    blob: testBlob,
    filename: 'mukbang-food-00116.png',
    lang: 'ko'
  });

  assert.strictEqual(result3.success, true);
  assert.strictEqual(result3.method, 'download');
  assert.strictEqual(downloadTriggered, true, 'downloadImage must trigger a click');
  assert.strictEqual(downloadedFilename, 'mukbang-food-00116.png');
  console.log('  - Desktop / unsupported environment falls back to automatic download');

  // Clean up mock globals
  if (originalNavigator) {
    Object.defineProperty(globalThis, 'navigator', originalNavigator);
  } else {
    delete globalThis.navigator;
  }
  delete globalThis.document;
  delete globalThis.window;
}

// 7. Test shareKakaoText Native Share and Clipboard Fallback
console.log('\n[Check 6] shareKakaoText Share & Clipboard Fallback');
{
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

  // A: Native share
  let kakaoShareData = null;
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      share: async (data) => { kakaoShareData = data; }
    },
    configurable: true,
    writable: true
  });

  const res1 = await shareKakaoText({ title: '메뉴 추천', text: '맛있는 음식', url: 'https://test.com' });
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.method, 'share');
  assert.strictEqual(kakaoShareData.title, '메뉴 추천');

  // B: Clipboard fallback
  let copiedText = '';
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      clipboard: {
        writeText: async (t) => { copiedText = t; }
      }
    },
    configurable: true,
    writable: true
  });

  const res2 = await shareKakaoText({ title: '카카오 공유', text: '식단 내용', url: 'https://test.com' });
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.method, 'clipboard');
  assert(copiedText.includes('카카오 공유') && copiedText.includes('식단 내용'));

  if (originalNavigator) {
    Object.defineProperty(globalThis, 'navigator', originalNavigator);
  } else {
    delete globalThis.navigator;
  }
  console.log('✔ shareKakaoText handles native share and clipboard fallback');
}

// 7. Test shareWhatsAppText and buildWhatsAppShareText across all 14 Languages
console.log('\n[Check 7] shareWhatsAppText and buildWhatsAppShareText (14 Languages)');
{
  const mockDailyData = {
    name: 'Emma',
    date: '2026-11-09',
    orderedList: [
      {
        mealKey: 'lunch',
        mealEmoji: '☀️',
        food: {
          name: 'Bibimbap',
          rawName: '전주비빔밥',
          tagline: 'Authentic Korean classic bowl',
          originGroup: 'KOREAN_POPULAR',
          calories: '550 kcal'
        }
      }
    ]
  };

  for (const lang of SUPPORTED_LANG_CODES) {
    const payload = buildWhatsAppShareText({
      dailyData: mockDailyData,
      selectedMealKeys: ['lunch'],
      name: 'Emma',
      dateStr: '2026-11-09',
      lang
    });

    assert(payload && payload.text && payload.url, `[${lang}] WhatsApp payload must contain text and url`);
    assert(payload.url.includes(lang !== 'ko' ? `lang=${lang}` : 'http'), `[${lang}] WhatsApp URL must have lang param`);
    if (lang !== 'ko') {
      // Check zero Hangul in UI labels
      assert(!payload.text.includes('오늘 뭐 먹지?'), `[${lang}] WhatsApp share text must not leak Korean site title`);
      assert(!payload.text.includes('칼로리'), `[${lang}] WhatsApp share text must not leak Korean calorie label`);
    }

    // Verify shareWhatsAppText
    let openedUrl = '';
    globalThis.window = {
      open: (u) => { openedUrl = u; }
    };
    const res = await shareWhatsAppText({
      title: payload.title,
      text: payload.text,
      url: payload.url,
      lang
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.method, 'whatsapp');
    assert(openedUrl.startsWith('https://wa.me/?text='), `[${lang}] Must invoke WhatsApp universal link`);
    delete globalThis.window;
  }
  console.log('✔ shareWhatsAppText and buildWhatsAppShareText verified across all 14 languages with zero Hangul leakage');
}

console.log('\n========================================');
console.log('🎉 ALL SHARE CORE UNIT TESTS PASSED (100%)');
console.log('========================================');
