/**
 * MyHome REAL Architecture/Location Photo Collector Pipeline
 * 
 * Target: C:\Users\USER\Documents\projects\myhome\data\chunks
 * Destination: G:\My Drive\houses/{padded}.png & {padded}.json
 * Features:
 *  - Respects Wikimedia API rate limits (auto-sleep, 429 retry-after backoff)
 *  - Penalizes text/newspaper/scan documents (-1000 score)
 *  - Scores best landscape/building view (ratio, resolution, scenic keywords)
 *  - Converts image to pure PNG format
 *  - Stores license metadata in matching .json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHUNKS_DIR = path.resolve('data/chunks');
const DEST_DIR = 'G:\\My Drive\\houses';
const TEMP_DIR = path.resolve('tmp_downloads');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// 신문, 잡지, 고문서 스캔본, 인물/스포츠 키워드 (강력 감점 -1,000점)
const DOCUMENT_KEYWORDS = [
  'newspaper', 'times', 'magazine', 'journal', 'gazette', 'daily', 'post',
  'press', 'article', 'issue', 'page', 'scan', 'archive', 'ia sim', 'text',
  'publication', 'transcript', 'document', 'periodical', 'editorial cartoon',
  'portrait', 'player', 'athlete', 'celebrity', 'politician', 'singer',
  'actor', 'actress', 'match', 'tournament', 'championship', 'wimbledon',
  'football', 'soccer', 'tennis', 'cricket', 'baseball', 'basketball', 'olympics'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJsonWithRetry(url, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount) => {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'MyHomeApp/1.0 (contact@tellmyname.app; https://myhome.tellmyname.app)'
        }
      }, (res) => {
        // Rate limit 429 처리
        if (res.statusCode === 429) {
          const retryAfterSec = parseInt(res.headers['retry-after'], 10) || 15;
          console.warn(`[WARN] 429 Too Many Requests! Sleeping for ${retryAfterSec}s...`);
          setTimeout(() => attempt(retryCount + 1), retryAfterSec * 1000);
          return;
        }

        if (res.statusCode >= 500 && retryCount < maxRetries) {
          const backoff = (retryCount + 1) * 2000;
          console.warn(`[WARN] Server error ${res.statusCode}. Retrying in ${backoff}ms...`);
          setTimeout(() => attempt(retryCount + 1), backoff);
          return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        });
      });

      req.on('error', (err) => {
        if (retryCount < maxRetries) {
          const backoff = (retryCount + 1) * 2000;
          console.warn(`[WARN] Network error: ${err.message}. Retrying in ${backoff}ms...`);
          setTimeout(() => attempt(retryCount + 1), backoff);
        } else {
          reject(err);
        }
      });
    };

    attempt(0);
  });
}

function downloadFileWithRetry(url, destPath, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (curUrl, retryCount) => {
      const file = fs.createWriteStream(destPath);
      const req = https.get(curUrl, {
        headers: {
          'User-Agent': 'MyHomeApp/1.0 (contact@tellmyname.app; https://myhome.tellmyname.app)'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(destPath);
          attempt(res.headers.location, retryCount);
          return;
        }

        if (res.statusCode === 429) {
          file.close();
          fs.unlinkSync(destPath);
          const waitSec = parseInt(res.headers['retry-after'], 10) || 15;
          console.warn(`[WARN] 429 during download! Waiting ${waitSec}s...`);
          setTimeout(() => attempt(curUrl, retryCount + 1), waitSec * 1000);
          return;
        }

        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          if (retryCount < maxRetries) {
            setTimeout(() => attempt(curUrl, retryCount + 1), 2000);
          } else {
            reject(new Error(`Download failed with status: ${res.statusCode}`));
          }
          return;
        }

        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      });

      req.on('error', (err) => {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        if (retryCount < maxRetries) {
          setTimeout(() => attempt(curUrl, retryCount + 1), 2000);
        } else {
          reject(err);
        }
      });
    };

    attempt(url, 0);
  });
}

function convertToPng(inputPath, outputPath) {
  // PowerShell System.Drawing을 사용한 신뢰성 높은 표준 PNG 변환
  const psCmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('${inputPath.replace(/'/g, "''")}'); $img.Save('${outputPath.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png); $img.Dispose();"`;
  execSync(psCmd, { stdio: 'ignore' });
}

// 텍스트/신문 페널티 및 전경 채점 알고리즘
function scoreCandidate(page) {
  const info = page.imageinfo && page.imageinfo[0];
  if (!info) return -9999;
  
  const title = (page.title || '').toLowerCase();
  const width = info.width || 0;
  const height = info.height || 0;
  
  // 반드시 이미지 포맷 (.jpg, .jpeg, .png, .webp)
  if (!/\.(jpg|jpeg|png|webp)$/i.test(title)) return -9999;
  if (width < 800 || height < 500) return -500;
  
  // 1. 신문, 잡지, 문서 키워드 검사 (감점 -1000점)
  for (const kw of DOCUMENT_KEYWORDS) {
    if (title.includes(kw)) return -1000;
  }
  
  // 지도, 설계도면, 로고, 아이콘, 우표 제외
  const blacklist = ['map', 'plan', 'logo', 'icon', 'diagram', 'chart', 'stamp', 'coin', 'drawing'];
  for (const b of blacklist) {
    if (title.includes(b)) return -500;
  }
  
  let score = 0;
  
  // 2. 가로형 풍경/건축 비율 우대 (1.33 ~ 1.78)
  const ratio = width / height;
  if (ratio >= 1.3 && ratio <= 1.8) score += 60;
  else if (ratio >= 1.1 && ratio <= 2.2) score += 30;
  else score -= 15;
  
  // 3. 해상도
  if (width >= 2400) score += 30;
  else if (width >= 1600) score += 20;
  else if (width >= 1200) score += 10;
  
  // 4. 전경/풍경 키워드 가산점
  const scenic = ['view', 'landscape', 'panorama', 'panoramic', 'exterior', 'building', 'wide', 'aerial', 'facade'];
  for (const s of scenic) {
    if (title.includes(s)) score += 15;
  }
  
  return score;
}

// 검색어 정제 함수: 장소/명소 고유명사 정밀 추출
function extractSearchQueries(house) {
  const queries = [];
  const title = house.title || '';
  const prompt = house.geminiImagePrompt || '';
  
  // 1. 프롬프트에서 순수 영문 고유 지명 추출 (한글이 섞이지 않은 경우)
  const engMatch = prompt.match(/(?:photograph of|photography of|view of|inside)\s+([A-Za-z0-9\s,\-–]+?)(?:,|\.|\bin\b|$)/i);
  if (engMatch && engMatch[1]) {
    const candidate = engMatch[1].replace(/^(a|an|the)\s+/i, '').trim();
    if (candidate.length >= 4 && !candidate.toLowerCase().includes('editorial') && !candidate.toLowerCase().includes('realistic')) {
      queries.push(candidate);
    }
  }

  // 2. 타이틀에서 레벨 괄호 제거
  let cleanTitle = title.replace(/\(Lv\.\d+\)/gi, '').trim();
  
  // 괄호 안의 별칭 추출 (예: "일본 군함도(하시마섬)" -> "하시마섬", "군함도")
  const parenMatch = cleanTitle.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1]) {
    const alias = parenMatch[1].trim();
    if (alias.length >= 2) queries.push(alias);
  }
  
  // 괄호 제거 후 앞부분 2~3단어 (예: "영국 런던 템스강 썰물 때..." -> "런던 템스강", "영국 런던 템스강")
  cleanTitle = cleanTitle.replace(/\([^)]+\)/g, '').trim();
  const tokens = cleanTitle.split(/\s+/).filter(w => w.length >= 2);
  
  if (tokens.length >= 3) {
    // [도시/지역] + [명소] (예: "런던 템스강")
    queries.push(`${tokens[1]} ${tokens[2]}`);
    // [국가] + [도시] + [명소] (예: "영국 런던 템스강")
    queries.push(`${tokens[0]} ${tokens[1]} ${tokens[2]}`);
  } else if (tokens.length === 2) {
    queries.push(`${tokens[0]} ${tokens[1]}`);
  } else if (tokens.length === 1) {
    queries.push(tokens[0]);
  }
  
  // "영국 런던"처럼 너무 포괄적인 2개 단어만 남은 경우 지양하고 세부 명소 포함
  return [...new Set(queries.filter(q => q.length >= 2))];
}

async function searchWikimediaBestPhoto(queries) {
  for (const q of queries) {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1280&format=json`;
    try {
      const res = await fetchJsonWithRetry(apiUrl);
      if (res && res.query && res.query.pages) {
        const pages = Object.values(res.query.pages);
        const scored = pages.map(p => ({ page: p, score: scoreCandidate(p) }))
          .filter(c => c.score > 0)
          .sort((a, b) => b.score - a.score);
        
        if (scored.length > 0) {
          return { best: scored[0].page, score: scored[0].score, queryUsed: q };
        }
      }
    } catch (err) {
      console.warn(`Query failed for "${q}":`, err.message);
    }
    await sleep(400); // 쿼리 간 짧은 대기
  }
  return null;
}

async function processHouse(house) {
  const lv = house.level;
  const padded = String(lv).padStart(5, '0');
  const destPngPath = path.join(DEST_DIR, `${padded}.png`);
  const destJsonPath = path.join(DEST_DIR, `${padded}.json`);

  // 이미 존재하는 경우 스킵
  if (fs.existsSync(destPngPath) && fs.statSync(destPngPath).size > 1024) {
    console.log(`[SKIP] Lv.${lv} (${padded}.png already exists)`);
    return { status: 'skipped', level: lv };
  }

  const queries = extractSearchQueries(house);
  console.log(`\n--------------------------------------------------`);
  console.log(`[Lv.${lv}] "${house.title}"`);
  console.log(`  검색 쿼리 후보:`, queries);

  const found = await searchWikimediaBestPhoto(queries);
  if (!found) {
    console.log(`  ❌ 적합한 실제 사진을 찾지 못함 (AI 실사 이미지 유지 대상)`);
    return { status: 'not_found', level: lv };
  }

  const { best, score, queryUsed } = found;
  const info = best.imageinfo[0];
  const downloadUrl = info.thumburl || info.url;
  const meta = info.extmetadata || {};
  
  const license = meta.LicenseShortName ? meta.LicenseShortName.value : 'Public Domain / Free License';
  let artist = meta.Artist ? meta.Artist.value.replace(/<[^>]*>?/gm, '').trim() : 'Wikimedia Commons Contributor';
  if (artist.length > 60) artist = artist.slice(0, 60) + '...';

  console.log(`  ⭐ 1위 사진 선정 (점수: ${score}점, 쿼리: "${queryUsed}")`);
  console.log(`     파일명: ${best.title}`);
  console.log(`     라이선스: ${license} | 저작자: ${artist}`);

  // 1. 임시 파일 다운로드
  const tempFile = path.join(TEMP_DIR, `temp_${padded}.tmp`);
  await downloadFileWithRetry(downloadUrl, tempFile);

  // 2. 표준 PNG로 변환하여 목적지에 저장
  try {
    convertToPng(tempFile, destPngPath);
  } catch (err) {
    // 변환 실패 시 파일 직접 복사
    fs.copyFileSync(tempFile, destPngPath);
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }

  // 3. 라이선스 메타데이터 JSON 저장 (Windows 호환 UTF-8 with BOM 보장)
  const licenseMeta = {
    level: lv,
    title: house.title,
    artist,
    license,
    sourceUrl: info.descriptionurl,
    downloadUrl,
    width: info.width,
    height: info.height,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(destJsonPath, '\uFEFF' + JSON.stringify(licenseMeta, null, 2), 'utf-8');

  console.log(`  ✅ 저장 완료: ${padded}.png & ${padded}.json`);
  return { status: 'saved', level: lv, license, artist };
}

async function runChunk(chunkFileName, limit = null) {
  const chunkPath = path.join(CHUNKS_DIR, chunkFileName);
  if (!fs.existsSync(chunkPath)) {
    console.error(`Chunk file not found: ${chunkPath}`);
    return;
  }

  console.log(`\n==================================================`);
  console.log(`🚀 Processing ${chunkFileName}...`);
  console.log(`==================================================`);

  const houses = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
  const realHouses = houses.filter(h => h.realityType === 'REAL');

  console.log(`총 ${houses.length}개 항목 중 REAL 실존 장소: ${realHouses.length}개`);
  
  const targetList = limit ? realHouses.slice(0, limit) : realHouses;
  let savedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (let i = 0; i < targetList.length; i++) {
    const h = targetList[i];
    try {
      const res = await processHouse(h);
      if (res.status === 'saved') savedCount++;
      else if (res.status === 'skipped') skippedCount++;
      else notFoundCount++;
    } catch (err) {
      console.error(`Error processing Lv.${h.level}:`, err.message);
    }

    // Rate limit 방지를 위한 필수 sleep (700ms)
    await sleep(700);
  }

  console.log(`\n==================================================`);
  console.log(`🎉 ${chunkFileName} 처리 완료!`);
  console.log(`   - 신규 저장: ${savedCount}개`);
  console.log(`   - 기 존재(스킵): ${skippedCount}개`);
  console.log(`   - 미발견(AI 유지): ${notFoundCount}개`);
  console.log(`==================================================\n`);
}

// CLI 실행 모드
const chunkArg = process.argv[2] || 'houses-chunk-00.json';
const limitArg = process.argv[3] ? parseInt(process.argv[3], 10) : null;

runChunk(chunkArg, limitArg);
