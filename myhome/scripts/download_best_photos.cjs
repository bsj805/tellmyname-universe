const https = require('https');
const fs = require('fs');
const path = require('path');

const sampleDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\44bcbb58-87a4-4d69-a441-5591dcfcbb1d\\sample_best_picks';
if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });

const targets = [
  { level: 19002, query: 'Lofoten Reine Norway', title: '노르웨이 로포텐 피오르드 (Lv.19002)' },
  { level: 19004, query: 'Emirates Palace Abu Dhabi', title: '아랍에미리트 아부다비 에미리트 팰리스 (Lv.19004)' },
  { level: 19006, query: 'Kapalua Maui', title: '하와이 마우이섬 카팔루아 비치 (Lv.19006)' },
  { level: 19008, query: 'Port Hercules Monaco', title: '모나코 몬테카를로 포트 에르퀼 (Lv.19008)' },
  { level: 19012, query: 'Sydney Opera House', title: '호주 시드니 오페라하우스 (Lv.19012)' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MyHomeApp/1.0 (contact@tellmyname.app)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const getWithRedirect = (curUrl) => {
      https.get(curUrl, { headers: { 'User-Agent': 'MyHomeApp/1.0 (contact@tellmyname.app)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          getWithRedirect(res.headers.location);
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    };
    getWithRedirect(url);
  });
}

// "장소가 가장 잘 보이는 사진"을 정밀 채점하는 알고리즘
function scoreCandidate(page) {
  const info = page.imageinfo && page.imageinfo[0];
  if (!info) return -999;
  
  const title = (page.title || '').toLowerCase();
  const width = info.width || 0;
  const height = info.height || 0;
  
  // 반드시 사진 포맷이어야 함 (.jpg, .jpeg, .png, .webp) - pdf, djvu, svg, tif 제외
  const isPhoto = /\.(jpg|jpeg|png|webp)$/i.test(title);
  if (!isPhoto) return -1000;
  
  if (width < 900 || height < 600) return -200; // 해상도 미달
  
  // 지도, 설계도면, 로고, 우표, 동전, 텍스트 문서, 야간 흔들린 사진 등 제외
  const blacklist = ['map', 'plan', 'logo', 'icon', 'diagram', 'chart', 'stamp', 'coin', 'pdf', 'drawing', 'sketch', 'interior detail'];
  for (const b of blacklist) {
    if (title.includes(b)) return -500;
  }
  
  let score = 0;
  
  // 1. 가로형 풍경/건축 황금 비율 (1.33 ~ 1.78)
  const ratio = width / height;
  if (ratio >= 1.3 && ratio <= 1.8) score += 60;
  else if (ratio >= 1.1 && ratio <= 2.2) score += 30;
  else score -= 20; // 너무 길쭉하거나 세로 사진은 감점
  
  // 2. 고화질 (풍경 디테일이 살아있는 2000px 이상)
  if (width >= 2400) score += 30;
  else if (width >= 1600) score += 20;
  else if (width >= 1200) score += 10;
  
  // 3. 전경/풍경/건축 뷰 키워드 보너스
  const scenicKeywords = ['view', 'landscape', 'panorama', 'panoramic', 'palace', 'harbor', 'opera', 'bay', 'exterior', 'sunrise', 'sunset', 'wide', 'aerial'];
  for (const kw of scenicKeywords) {
    if (title.includes(kw)) score += 15;
  }

  return score;
}

async function findBestPhoto(target) {
  // 상위 15개 후보 검색
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(target.query)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1280&format=json`;
  
  const res = await fetchJson(apiUrl);
  if (!res.query || !res.query.pages) {
    console.log('No results for:', target.query);
    return null;
  }
  
  const pages = Object.values(res.query.pages);
  console.log(`\n==================================================`);
  console.log(`🔍 [${target.title}] ${pages.length}개 후보 사진 분석 중...`);
  
  const scored = pages.map(page => {
    const s = scoreCandidate(page);
    return { page, score: s };
  }).filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);
  
  if (scored.length === 0) {
    console.log(`❌ 유효한 사진을 찾지 못했습니다: ${target.title}`);
    return null;
  }

  scored.slice(0, 3).forEach((c, idx) => {
    const info = c.page.imageinfo[0];
    console.log(`  ⭐ Rank ${idx+1} (점수: ${c.score}점) | ${c.page.title.slice(5, 55)} | ${info.width}x${info.height}`);
  });
  
  const best = scored[0].page;
  const bestInfo = best.imageinfo[0];
  const downloadUrl = bestInfo.thumburl || bestInfo.url;
  const meta = bestInfo.extmetadata || {};
  
  const license = meta.LicenseShortName ? meta.LicenseShortName.value : 'Public Domain / CC';
  let artist = meta.Artist ? meta.Artist.value.replace(/<[^>]*>?/gm, '').trim() : 'Wikimedia Contributor';
  if (artist.length > 50) artist = artist.slice(0, 50) + '...';
  
  const ext = path.extname(bestInfo.url) || '.jpg';
  const fileName = `${target.level}_best${ext.split('?')[0]}`;
  const destPath = path.join(sampleDir, fileName);
  
  console.log(`  👉 최종 1위 선정: ${best.title}`);
  await downloadFile(downloadUrl, destPath);
  
  return {
    level: target.level,
    title: target.title,
    fileName,
    destPath,
    artist,
    license,
    score: scored[0].score,
    sourceUrl: bestInfo.descriptionurl,
    downloadUrl,
    width: bestInfo.width,
    height: bestInfo.height
  };
}

(async () => {
  const results = [];
  for (const t of targets) {
    try {
      const best = await findBestPhoto(t);
      if (best) results.push(best);
    } catch (e) {
      console.error('Error for', t.title, e.message);
    }
  }
  fs.writeFileSync(path.join(sampleDir, 'best_results.json'), JSON.stringify(results, null, 2), 'utf-8');
  console.log('\n✨ 장소가 가장 잘 보이는 최고 사진 5장 다운로드 완료!');
})();
