// scripts/build_web.mjs — web/ 단일 페이지 앱을 dist/ 로 빌드 (정적 호스팅: Cloudflare Pages)
// 1) web/ → dist/ 복사  2) data/ → dist/data/*.json (경량화)  3) public/ 정적 파일 복사
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const rd = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.mkdirSync(path.join(dist, 'data'), { recursive: true });
copyDir(path.join(root, 'web'), dist);
for (const f of ['privacy.html', 'terms.html', 'about.html', 'contact.html', 'ads.txt', '_headers', 'CNAME', 'favicon.svg', 'favicon.ico']) {
  const p = path.join(root, 'public', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(dist, f));
}

// names.json: [name, cho, hanja, altHanja, meaning, gender, category]
const names = rd('data/compact_serving_names.json').map(r => r.slice(0, 7));
fs.writeFileSync(path.join(dist, 'data/names.json'), JSON.stringify(names));

// hanja.json: { 음절: { hanja, meaning, sym, variants:[{hanja, meaning, sym}] } }
const hj = rd('data/serving_hanja_syllables.json');
const hanja = {};
for (const [k, v] of Object.entries(hj)) {
  hanja[k] = { hanja: v.hanja, meaning: v.meaning, sym: v.sym, variants: (v.variants || []).map(x => ({ hanja: x.hanja, meaning: x.meaning, sym: x.sym })) };
}
fs.writeFileSync(path.join(dist, 'data/hanja.json'), JSON.stringify(hanja));

const surnames = rd('data/korean_surnames_all.json').map(s => ({ surname: s.surname, hanja: s.hanja, meaning: s.meaning, isTwoSyllable: !!s.isTwoSyllable }));
fs.writeFileSync(path.join(dist, 'data/surnames.json'), JSON.stringify(surnames));

// curated_foreign_names.json 복사
if (fs.existsSync(path.join(root, 'data/curated_foreign_names.json'))) {
  fs.copyFileSync(path.join(root, 'data/curated_foreign_names.json'), path.join(dist, 'data/curated_foreign_names.json'));
}

// i18n 언어팩 복사
const i18nSrc = path.join(root, 'data/i18n');
const i18nDst = path.join(dist, 'data/i18n');
if (fs.existsSync(i18nSrc)) {
  copyDir(i18nSrc, i18nDst);
}



console.log(`[build_web] dist/ ready — names ${names.length}, syllables ${Object.keys(hanja).length}, surnames ${surnames.length}`);
