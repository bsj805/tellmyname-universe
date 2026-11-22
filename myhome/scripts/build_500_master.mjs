// scripts/build_500_master.mjs
// Generates 500 unique items (0 to 499), 20 tiers (25 items each),
// 250 REAL (even) / 250 FICTION (odd), 250 BAD (0..249) / 250 GOOD (250..499).
// NO STAR WARS items.
// Exports prompt .txt files to G:\My Drive\new_houses\00000.txt .. 00499.txt
// Copies existing matching PNG images from G:\My Drive\houses to G:\My Drive\new_houses\

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 20 Tier Definitions (25 levels per tier)
export const MASTER_TIERS_500 = [
  { tier: 1, name: 'Tier 01: 태초의 밑바닥', range: [0, 24], zone: 'BAD', desc: '화산 유황지대, 지구 맨틀, 극한 오지 화장실, 고물 기계' },
  { tier: 2, name: 'Tier 02: 폐허와 슬럼가', range: [25, 49], zone: 'BAD', desc: '슬럼가 골목, 버려진 공장, 카타콤, 계단 밑 벽장' },
  { tier: 3, name: 'Tier 03: 기괴한 고물과 상자', range: [50, 74], zone: 'BAD', desc: '골판지 상자, 고장 난 자판기, 고물 트럭 짐칸, 컨테이너' },
  { tier: 4, name: 'Tier 04: 극한 오지 변소와 방사능', range: [75, 99], zone: 'BAD', desc: '체르노빌 관람차, 에베레스트 변소, 방사능 호수, 하수관' },
  { tier: 5, name: 'Tier 05: 폐쇄 구역과 감옥', range: [100, 124], zone: 'BAD', desc: '아즈카반 독방, 교도소 독방, 버려진 정신병원, 폐광 갱도' },
  { tier: 6, name: 'Tier 06: 애니·영화 속 굴욕의 거처', range: [125, 149], zone: 'BAD', desc: '코끼리 무덤 해골, 장난감 고문실, 하수도 쥐구멍, 오물통' },
  { tier: 7, name: 'Tier 07: 위험천만 이동식 쉘터', range: [150, 174], zone: 'BAD', desc: '화물열차 배관실, 흔들리는 닭장, 침수된 오리배, 뗏목' },
  { tier: 8, name: 'Tier 08: 늪지대와 침수 구역', range: [175, 199], zone: 'BAD', desc: '슈렉 늪지대, 갠지스 화장터, 톤레삽 홍수, 침수 계단' },
  { tier: 9, name: 'Tier 09: 고립된 사막과 얼음 굴', range: [200, 224], zone: 'BAD', desc: '다나킬 사막 움막, 혹한기 빙하 틈, 소금사막 파라솔' },
  { tier: 10, name: 'Tier 10: 폭망의 문턱 턱걸이', range: [225, 249], zone: 'BAD', desc: '0.3평 만화카페, 1평 고시원, 만조 때 잠기는 평상' },
  { tier: 11, name: 'Tier 11: 대박 입문 힐링 샬레', range: [250, 274], zone: 'GOOD', desc: '지열 온천 빌라, 빙하 호수 샬레, 바오밥 공중 트리하우스' },
  { tier: 12, name: 'Tier 12: 세계 역사 고성과 랜드마크', range: [275, 299], zone: 'GOOD', desc: '몽생미셸, 노이슈반슈타인 성, 알람브라 궁전, 피사 사탑' },
  { tier: 13, name: 'Tier 13: 픽사·디즈니 애니메이션 명소', range: [300, 324], zone: 'GOOD', desc: '엘사의 얼음 궁전, UP 풍선 하우스, 야수의 서재, 앤디의 방' },
  { tier: 14, name: 'Tier 14: 세계 초일류 도심 펜트하우스', range: [325, 349], zone: 'GOOD', desc: '에펠탑 펜트하우스, 부르즈 할리파 아틀리에, 마리나베이샌즈' },
  { tier: 15, name: 'Tier 15: 판타지 영화와 문학의 성채', range: [350, 374], zone: 'GOOD', desc: '호그와트 기숙사, 리벤델 요정 테라스, 호빗 백엔드' },
  { tier: 16, name: 'Tier 16: 세계 7대 불가사의와 비경', range: [375, 399], zone: 'GOOD', desc: '우유니 소금거울 돔, 그랜드 캐니언 스카이워크, 마추픽추' },
  { tier: 17, name: 'Tier 17: 미래 스마트 도시와 슈퍼요트', range: [400, 424], zone: 'GOOD', desc: '나이트시티 펜트하우스, 자비스 스타크 맨션, 메가 요트' },
  { tier: 18, name: 'Tier 18: 신화와 전설의 황금 궁전', range: [425, 449], zone: 'GOOD', desc: '올림포스 제우스 궁전, 발할라 연회장, 아틀란티스 신전' },
  { tier: 19, name: 'Tier 19: SF 궤도 스테이션과 콜로니', range: [450, 474], zone: 'GOOD', desc: '쿠퍼 스테이션, 제임스 웹 L2 관측소, 달 기지 스카이빌라' },
  { tier: 20, name: 'Tier 20: 우주 초월 다이슨 스피어', range: [475, 499], zone: 'GOOD', desc: '다이슨 스피어 링 월드, 안드로메다 웜홀, 창조의 기둥' }
];

async function main() {
  console.log('=== [Building 500 Unique Master Dataset (0 to 499)] ===');

  // Load pristine 341 master dataset
  const scratchFile = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\e9200ef6-24eb-4722-be30-7cba2fce637b\\scratch\\master341.json';
  const existingHouses = JSON.parse(fs.readFileSync(scratchFile, 'utf8'));

  // Filter out any Star Wars items
  const cleanExisting = existingHouses.filter(h => {
    const text = (h.title + ' ' + (h.specialFeature || '') + ' ' + (h.geminiImagePrompt || '')).toLowerCase();
    if (text.includes('스타워즈') || text.includes('star wars') || text.includes('자바 더 헛') ||
        text.includes('다고바') || text.includes('데스스타') || text.includes('코러산트') || text.includes('나부 행성')) {
      console.log('  [FILTER OUT STAR WARS]:', h.title);
      return false;
    }
    return true;
  });

  console.log(`Loaded ${existingHouses.length} existing items, ${cleanExisting.length} clean items after Star Wars purge.`);

  const curRealBad = cleanExisting.filter(h => h.realityType === 'REAL' && h.zone === 'BAD');
  const curFicBad = cleanExisting.filter(h => h.realityType === 'FICTION' && h.zone === 'BAD');
  const curRealGood = cleanExisting.filter(h => h.realityType === 'REAL' && h.zone === 'GOOD');
  const curFicGood = cleanExisting.filter(h => h.realityType === 'FICTION' && h.zone === 'GOOD');

  console.log(`Current counts: RealBad=${curRealBad.length}, FicBad=${curFicBad.length}, RealGood=${curRealGood.length}, FicGood=${curFicGood.length}`);

  // Import supplemental datasets
  const { NEW_REAL_BAD } = await import('./data_new_real_bad.mjs');
  const { NEW_FIC_BAD } = await import('./data_new_fic_bad.mjs');
  const { NEW_REAL_GOOD } = await import('./data_new_real_good.mjs');
  const { NEW_FIC_GOOD } = await import('./data_new_fic_good.mjs');

  const targetRealBad = [...curRealBad, ...NEW_REAL_BAD].slice(0, 125);
  const targetFicBad = [...curFicBad, ...NEW_FIC_BAD].slice(0, 125);
  const targetRealGood = [...curRealGood, ...NEW_REAL_GOOD].slice(0, 125);
  const targetFicGood = [...curFicGood, ...NEW_FIC_GOOD].slice(0, 125);

  console.log(`Target assembled: RealBad=${targetRealBad.length}, FicBad=${targetFicBad.length}, RealGood=${targetRealGood.length}, FicGood=${targetFicGood.length}`);

  if (targetRealBad.length !== 125 || targetFicBad.length !== 125 || targetRealGood.length !== 125 || targetFicGood.length !== 125) {
    throw new Error(`Bucket sizes must be exactly 125 each! Got ${targetRealBad.length}, ${targetFicBad.length}, ${targetRealGood.length}, ${targetFicGood.length}`);
  }

  // Interleave into 500 items
  const full500 = [];

  // BAD ZONE: Lv.0 to Lv.249
  for (let i = 0; i < 125; i++) {
    // Even = REAL
    const realLv = i * 2;
    full500[realLv] = { ...targetRealBad[i], level: realLv, realityType: 'REAL' };
    // Odd = FICTION
    const ficLv = i * 2 + 1;
    full500[ficLv] = { ...targetFicBad[i], level: ficLv, realityType: 'FICTION' };
  }

  // GOOD ZONE: Lv.250 to Lv.499
  for (let i = 0; i < 125; i++) {
    // Even = REAL
    const realLv = 250 + i * 2;
    full500[realLv] = { ...targetRealGood[i], level: realLv, realityType: 'REAL' };
    // Odd = FICTION
    const ficLv = 250 + i * 2 + 1;
    full500[ficLv] = { ...targetFicGood[i], level: ficLv, realityType: 'FICTION' };
  }

  // Enrich with tier, URLs, padded keys
  for (let lv = 0; lv < 500; lv++) {
    const item = full500[lv];
    const padded = String(lv).padStart(5, '0');
    const tierIdx = Math.floor(lv / 25);
    const tierMeta = MASTER_TIERS_500[tierIdx];

    item.tier = tierMeta.tier;
    item.tierName = tierMeta.name;
    item.zone = lv < 250 ? 'BAD' : 'GOOD';
    item.zoneLabel = lv < 250 ? '폭망 하우스' : '대박 하우스';
    item.realityLabel = item.realityType === 'REAL' ? '실제 존재하는 건축물·사물' : '허구·상상 속 건축물·사물';
    item.r2Key = `houses/${padded}.webp`;
    item.imageUrl = `/r2/houses/${padded}.webp`;
    item.ogImageUrl = `https://myhome.tellmyname.app/r2/houses/${padded}.webp`;
    item.aiModel = 'gemini-3.8-flash';
  }

  console.log(`Generated ${full500.length} items successfully.`);

  // Verify unique titles
  const titleSet = new Set();
  const dupes = [];
  full500.forEach(h => {
    if (titleSet.has(h.title)) dupes.push(h.title);
    titleSet.add(h.title);
  });
  if (dupes.length > 0) {
    throw new Error(`Found duplicate titles in dataset: ${dupes.join(', ')}`);
  }
  console.log('✔ All 500 titles are strictly unique (0 duplicates).');

  // Verify No Star Wars
  full500.forEach(h => {
    const txt = (h.title + ' ' + (h.specialFeature || '') + ' ' + (h.geminiImagePrompt || '')).toLowerCase();
    if (txt.includes('스타워즈') || txt.includes('star wars') || txt.includes('자바 더 헛')) {
      throw new Error(`Star Wars item detected at Lv.${h.level}: ${h.title}`);
    }
  });
  console.log('✔ Verified zero Star Wars references across all 500 items.');

  // 1. Write src/lib/master_dataset.js
  const masterContent = `// src/lib/master_dataset.js
// 0 ~ 499단계 (총 500단계) 100% 무중복 마스터 하우스 데이터셋
// - 짝수 레벨(0, 2, 4.. 498): 실제 존재하는 건축물·장소 (REAL, 250개)
// - 홀수 레벨(1, 3, 5.. 499): 허구/가상/미디어 속 장소 (FICTION, 250개)
// - 폭망 하우스 (BAD): Lv.0 ~ 249 (250개)
// - 대박 하우스 (GOOD): Lv.250 ~ 499 (250개)
// - 스타워즈(Star Wars) 저작권 배제 완료

export const MASTER_TIERS_500 = ${JSON.stringify(MASTER_TIERS_500, null, 2)};

export const MASTER_HOUSES = ${JSON.stringify(full500, null, 2)};

export default MASTER_HOUSES;
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'src', 'lib', 'master_dataset.js'), masterContent, 'utf8');
  console.log('✔ src/lib/master_dataset.js updated with 500 items.');

  // 2. Clear and regenerate data/chunks/ (20 chunks, 25 items each)
  const chunksDir = path.join(ROOT_DIR, 'data', 'chunks');
  if (!fs.existsSync(chunksDir)) fs.mkdirSync(chunksDir, { recursive: true });

  const existingChunks = fs.readdirSync(chunksDir).filter(f => f.startsWith('houses-chunk-') && f.endsWith('.json'));
  for (const f of existingChunks) {
    fs.unlinkSync(path.join(chunksDir, f));
  }
  console.log(`Cleaned ${existingChunks.length} old chunk files in data/chunks.`);

  for (let cIdx = 0; cIdx < 20; cIdx++) {
    const chunkItems = full500.slice(cIdx * 25, (cIdx + 1) * 25);
    const chunkName = `houses-chunk-${String(cIdx).padStart(2, '0')}.json`;
    fs.writeFileSync(path.join(chunksDir, chunkName), JSON.stringify(chunkItems, null, 2), 'utf8');
  }
  console.log('✔ Generated 20 new chunk files in data/chunks (houses-chunk-00.json .. 19.json).');

  // 3. Export prompts to G:\My Drive\new_houses\00000.txt .. 00499.txt
  const newHousesDir = 'G:\\My Drive\\new_houses';
  if (!fs.existsSync(newHousesDir)) {
    fs.mkdirSync(newHousesDir, { recursive: true });
  }

  let promptCount = 0;
  for (let lv = 0; lv < 500; lv++) {
    const item = full500[lv];
    const fileName = `${String(lv).padStart(5, '0')}.txt`;
    const promptPath = path.join(newHousesDir, fileName);
    fs.writeFileSync(promptPath, item.geminiImagePrompt || '', 'utf8');
    promptCount++;
  }
  console.log(`✔ Exported ${promptCount} prompt files to "${newHousesDir}".`);

  // 4. Copy existing valid matching PNG images from G:\My Drive\houses to G:\My Drive\new_houses
  // ONLY if the prompt text in G:\My Drive\houses/{old}.txt is an EXACT MATCH to new_houses/{new}.txt
  const oldHousesDir = 'G:\\My Drive\\houses';
  let copiedCount = 0;

  if (fs.existsSync(oldHousesDir)) {
    console.log('\nMatching exact prompt text between G:\\My Drive\\houses and G:\\My Drive\\new_houses...');

    // 1. Build map of cleanPrompt -> sourcePng
    const oldPromptMap = new Map();
    for (let i = 0; i <= 46; i++) {
      const pad = String(i).padStart(5, '0');
      const oldTxt = path.join(oldHousesDir, `${pad}.txt`);
      const oldPng = path.join(oldHousesDir, `${pad}.png`);
      if (fs.existsSync(oldTxt) && fs.existsSync(oldPng)) {
        const p = fs.readFileSync(oldTxt, 'utf8').trim().replace(/\(Lv\.\d+\)/g, '').trim();
        if (!p.includes('스타워즈') && !p.includes('Star Wars')) {
          if (!oldPromptMap.has(p)) {
            oldPromptMap.set(p, { oldPad: pad, pngPath: oldPng });
          }
        }
      }
    }

    // 2. Remove any existing PNG in new_houses first to ensure clean state
    const existingNewPngs = fs.readdirSync(newHousesDir).filter(f => f.endsWith('.png'));
    for (const f of existingNewPngs) {
      fs.unlinkSync(path.join(newHousesDir, f));
    }
    console.log(`Cleaned ${existingNewPngs.length} existing PNGs in new_houses.`);

    // 3. For each of the 500 levels, copy PNG ONLY if exact prompt matches
    for (let lv = 0; lv < 500; lv++) {
      const pad = String(lv).padStart(5, '0');
      const targetTxt = path.join(newHousesDir, `${pad}.txt`);
      const targetPng = path.join(newHousesDir, `${pad}.png`);

      if (fs.existsSync(targetTxt)) {
        const newP = fs.readFileSync(targetTxt, 'utf8').trim().replace(/\(Lv\.\d+\)/g, '').trim();
        if (oldPromptMap.has(newP)) {
          const match = oldPromptMap.get(newP);
          fs.copyFileSync(match.pngPath, targetPng);
          copiedCount++;
          console.log(`  [EXACT PROMPT MATCH] houses/${match.oldPad}.png -> new_houses/${pad}.png (Lv.${lv}: ${full500[lv].title.slice(0, 30)})`);
        }
      }
    }
    console.log(`✔ Transferred ${copiedCount} verified exact-matching PNGs.`);
    console.log(`✔ Remaining ${500 - copiedCount} images will be generated freshly by auto_generator.`);
  }

  console.log('\n======================================================');
  console.log('🎉 500 Master Dataset, Chunks, and GDrive Prompts Complete!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
