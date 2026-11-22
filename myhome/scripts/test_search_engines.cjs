const https = require('https');

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

async function testOpenverse(query) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=commercial&page_size=8`;
  try {
    const res = await fetchJson(url);
    console.log(`\n=== Openverse Results for "${query}" (Total: ${res.result_count}) ===`);
    if (res.results) {
      res.results.forEach((r, idx) => {
        console.log(`[${idx+1}] Title: ${r.title} | Source: ${r.source} | License: ${r.license} | ${r.width}x${r.height}`);
      });
    }
    return res.results || [];
  } catch (err) {
    console.error('Openverse Error:', err.message);
    return [];
  }
}

async function main() {
  await testOpenverse('Emirates Palace Abu Dhabi');
  await testOpenverse('Sydney Opera House');
  await testOpenverse('Lofoten Norway');
}

main();
