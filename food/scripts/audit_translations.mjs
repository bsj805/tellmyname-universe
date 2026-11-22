// scripts/audit_translations.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const rawFoods = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'raw_foods_collected.json'), 'utf8'));
const langs = ['en', 'ja', 'zh', 'hi', 'vi', 'fr', 'pt', 'es', 'id', 'ru', 'de', 'it', 'ms'];

console.log(`Auditing 401 foods across ${langs.length} languages...\n`);

for (const lang of langs) {
  const filePath = path.join(ROOT_DIR, 'data', 'i18n', 'foods', `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`[${lang}] File missing!`);
    continue;
  }

  const dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let missing = 0;
  let emptyTagline = 0;
  let suspectMismatches = [];

  for (const item of rawFoods) {
    const code = item.code;
    const entry = dict[code];
    if (!entry || !entry.name) {
      missing++;
      continue;
    }
    if (!entry.tagline || entry.tagline.trim().length === 0) {
      emptyTagline++;
    }

    // Spot-check common dishes across all languages
    // e.g., 00081 (된장찌개), 00201 (달팽이/Escargot), 00281 (츄러스), 00321 (전복), 00367 (바스크 치즈케이크), 00375 (바지락), 00381 (훠궈), 00383 (비스테카), 00384 (카오소이), 00386 (세비체), 00388 (미트볼), 00389 (푸틴)
    if (code === '00081' && !/doenjang|miso|da jiang|तेंद|đậu|soja|tauco|твенд|d醬/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00201' && !/escargot|snails?|schnecke|caracol|siput|улитк|달팽이|焗蜗牛|エスカルゴ|ốc/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00281' && !/churro|吉事果|チュロス|츄러스/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00367' && !/basque|바스크|巴斯克|バスク|바스|बास्क/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00375' && !/clam|almeja|vongole|bajirak|venusmuschel|ракуш|palourde|花蛤|アサリ|바지락|bào ngư|kepah|kerang/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00381' && !/hot pot|hotpot|huoguo|motsunabe|feuertopf|fondue|хого|火锅|火鍋|훠궈|हॉटपॉट/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00383' && !/bistecca|fiorentina|t-bone|tbone|steak|bistec|бифштекс|牛排|ステーキ|스테이크/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00388' && !/meatball|köttbullar|boulette|albóndiga|polpette|frikadell|мясн|肉丸|ミートボール|미트볼|bakso|bebola/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
    if (code === '00389' && !/poutine|putin|путин|肉酱薯条|プーティン|푸틴|पूतिन/i.test(entry.name)) {
      suspectMismatches.push({ code, ko: item.name, got: entry.name });
    }
  }

  console.log(`[${lang.toUpperCase()}] Missing: ${missing}, Empty Tagline: ${emptyTagline}, Suspect Flagged: ${suspectMismatches.length}`);
  if (suspectMismatches.length > 0) {
    for (const m of suspectMismatches.slice(0, 5)) {
      console.log(`   * ${m.code} (KO: ${m.ko.slice(0, 20)}...) -> Got: "${m.got}"`);
    }
  }
}
