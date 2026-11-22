const https = require('https');
const fs = require('fs');
const path = require('path');

const sampleDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\44bcbb58-87a4-4d69-a441-5591dcfcbb1d\\sample_images';
if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });

const targets = [
  { level: 19002, query: 'Lofoten aurora', name: '19002_lofoten_aurora.jpg', title: '노르웨이 로포텐 피오르드 오로라 (Lv.19002)' },
  { level: 19004, query: 'Emirates Palace Abu Dhabi', name: '19004_emirates_palace.jpg', title: '아랍에미리트 아부다비 에미리트 팰리스 (Lv.19004)' },
  { level: 19006, query: 'Kapalua Maui', name: '19006_kapalua_maui.jpg', title: '하와이 마우이섬 카팔루아 비치 (Lv.19006)' },
  { level: 19008, query: 'Port Hercules Monaco yacht', name: '19008_monaco_monte_carlo.jpg', title: '모나코 몬테카를로 지중해 요트 항구 (Lv.19008)' },
  { level: 19012, query: 'Sydney Opera House harbor', name: '19012_sydney_opera_house.jpg', title: '호주 시드니 오페라하우스 하버뷰 (Lv.19012)' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'MyHomeApp/1.0 (contact@tellmyname.app)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
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

async function searchAndDownload(target) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(target.query)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json`;
  const res = await fetchJson(apiUrl);
  if (!res.query || !res.query.pages) {
    console.log('No result for:', target.query);
    return null;
  }
  const page = Object.values(res.query.pages)[0];
  const info = page.imageinfo[0];
  const downloadUrl = info.thumburl || info.url;
  const meta = info.extmetadata || {};
  
  const license = meta.LicenseShortName ? meta.LicenseShortName.value : 'Public Domain / Free';
  let artist = meta.Artist ? meta.Artist.value.replace(/<[^>]*>?/gm, '').trim() : 'Wikimedia Commons Contributor';
  if (artist.length > 50) artist = artist.slice(0, 50) + '...';
  const descUrl = info.descriptionurl;

  const destPath = path.join(sampleDir, target.name);
  console.log(`Downloading ${target.title} -> ${downloadUrl}`);
  await downloadFile(downloadUrl, destPath);

  return {
    level: target.level,
    title: target.title,
    fileName: target.name,
    destPath,
    artist,
    license,
    descUrl,
    imageUrl: downloadUrl
  };
}

(async () => {
  const results = [];
  for (const t of targets) {
    try {
      const r = await searchAndDownload(t);
      if (r) results.push(r);
    } catch (err) {
      console.error('Error on', t.title, err.message);
    }
  }
  fs.writeFileSync(path.join(sampleDir, 'results.json'), JSON.stringify(results, null, 2), 'utf-8');
  console.log('Successfully completed 5 sample downloads!');
})();
