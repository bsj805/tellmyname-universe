#!/usr/bin/env node
// IndexNow Instant URL Submission Script (Yandex, Bing, IndexNow.org, Naver/Seznam shared IndexNow)
// Usage: node submit_indexnow.mjs [origin]

const INDEXNOW_KEY = 'a8f4c2e9b1d703654e2a9c8b7d6f1e3a';
const targetOrigin = (process.argv[2] || 'https://myhome.tellmyname.app').replace(/\/+$/, '');
const host = new URL(targetOrigin).hostname;

function getUrlsForOrigin(origin) {
  if (origin.includes('myhome.tellmyname.app')) {
    const langCodes = ['en', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ja', 'zh', 'ms'];
    return [
      `${origin}/`,
      ...langCodes.map(c => `${origin}/?lang=${c}`),
      `${origin}/name/%EA%B9%80%EC%84%9C%EC%9C%A4`,
      `${origin}/name/%EC%9D%B4%EB%AF%BC%EC%A4%80`,
      `${origin}/name/%ED%99%8D%EA%B8%B8%EB%8F%99`,
      `${origin}/name/Steve?lang=en`,
      `${origin}/name/Aarav?lang=hi`,
      `${origin}/name/Budi?lang=id`,
      `${origin}/name/Minh?lang=vi`,
      `${origin}/name/Ivan?lang=ru`,
      `${origin}/level/512`,
      `${origin}/level/999`,
      `${origin}/level/0`,
      `${origin}/about.html`
    ];
  }
  return [`${origin}/`];
}

async function submitIndexNow() {
  const urlList = getUrlsForOrigin(targetOrigin);
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${targetOrigin}/${INDEXNOW_KEY}.txt`,
    urlList
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://yandex.com/indexnow',
    'https://www.bing.com/indexnow'
  ];

  console.log(`=== [IndexNow Instant Submission] Host: ${host} (${urlList.length} URLs across 14 languages) ===`);
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log(`  -> ${endpoint}: HTTP ${res.status} (${res.status === 200 || res.status === 202 ? 'ACCEPTED' : 'RESPONSE'})`);
    } catch (err) {
      console.warn(`  -> ${endpoint}: Error ${err.message}`);
    }
  }
}

submitIndexNow();
