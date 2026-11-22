// scripts/upload_to_r2.mjs — Cloudflare R2 Asset Synchronizer
// Uploads optimized food images (images/web/*.webp and *.jpg) to Cloudflare R2 using AWS SigV4
// Zero external dependencies (uses native Node.js crypto and fetch)
// Supports --dry-run, --limit, and custom bucket overrides

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_WEB_DIR = path.join(ROOT_DIR, 'images', 'web');
const IMAGES_RAW_DIR = path.join(ROOT_DIR, 'images');

// R2 Credentials & Configuration
const CONFIG = {
  accountId: process.env.CF_R2_ACCOUNT_ID || '5e276b42664b54929d077e3edd6335d4',
  endpoint: (process.env.CF_R2_ENDPOINT || 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com').replace(/\/+$/, ''),
  accessKeyId: process.env.CF_R2_ACCESS_KEY_ID || 'c9b90a1ca4daa52169d4c8411f5ad68c',
  secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY || '63559ed8b6c45deca38e44bc00914df6ccaa628ac7f695c5643207f3612b5965',
  bucketName: process.env.CF_R2_BUCKET || 'myhome-houses-r2',
  region: process.env.CF_R2_REGION || 'auto'
};

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function hmacHex(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * AWS Signature Version 4 헤더 서명 생성기
 */
export function signS3Request({ method, url, headers = {}, payloadBuffer, region, accessKeyId, secretAccessKey }) {
  const parsedUrl = new URL(url);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256(payloadBuffer);

  const signedHeaderKeys = [
    'cache-control',
    'content-type',
    'host',
    'x-amz-content-sha256',
    'x-amz-date'
  ].sort();

  const headerMap = {
    'host': parsedUrl.host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    'content-type': headers['content-type'] || 'application/octet-stream',
    'cache-control': headers['cache-control'] || 'public, max-age=31536000, immutable'
  };

  const canonicalHeaders = signedHeaderKeys
    .map(k => `${k}:${headerMap[k]}\n`)
    .join('');

  const signedHeadersStr = signedHeaderKeys.join(';');

  const canonicalRequest = [
    method,
    parsedUrl.pathname,
    parsedUrl.search ? parsedUrl.search.slice(1) : '',
    canonicalHeaders,
    signedHeadersStr,
    payloadHash
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256(canonicalRequest)
  ].join('\n');

  const kDate = hmac('AWS4' + secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = hmacHex(kSigning, stringToSign);

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    ...headerMap,
    'authorization': authorizationHeader
  };
}

/**
 * 단일 파일 R2 업로드 함수
 */
export async function uploadFileToR2(filePath, objectKey, options = {}) {
  const {
    dryRun = false,
    endpoint = CONFIG.endpoint,
    bucket = CONFIG.bucketName,
    region = CONFIG.region,
    accessKeyId = CONFIG.accessKeyId,
    secretAccessKey = CONFIG.secretAccessKey
  } = options;

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = (ext === '.webp')
    ? 'image/webp'
    : (ext === '.jpg' || ext === '.jpeg')
      ? 'image/jpeg'
      : (ext === '.png')
        ? 'image/png'
        : 'application/octet-stream';

  const cacheControl = 'public, max-age=31536000, immutable';
  const url = `${endpoint}/${bucket}/${objectKey}`;

  if (dryRun) {
    return {
      status: 'DRY_RUN',
      key: objectKey,
      size: fileBuffer.byteLength,
      contentType,
      url
    };
  }

  const signedHeaders = signS3Request({
    method: 'PUT',
    url,
    headers: {
      'content-type': contentType,
      'cache-control': cacheControl
    },
    payloadBuffer: fileBuffer,
    region,
    accessKeyId,
    secretAccessKey
  });

  const res = await fetch(url, {
    method: 'PUT',
    headers: signedHeaders,
    body: fileBuffer
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`R2 Upload failed for [${objectKey}]: HTTP ${res.status} ${res.statusText} — ${errorText}`);
  }

  return {
    status: 'UPLOADED',
    httpStatus: res.status,
    key: objectKey,
    size: fileBuffer.byteLength,
    contentType,
    url
  };
}

/**
 * 원본 고해상도 PNG (401개, images/*.png) R2 업로드 함수
 * R2 버킷에 foods/{filename} 및 images/{filename} 두 경로로 등록하여
 * 어떤 라우트로 요청되더라도 무손실 원본 PNG가 즉시 반환되도록 보장합니다.
 */
export async function syncOriginalPngsToR2(options = {}) {
  const dryRun = options.dryRun || process.argv.includes('--dry-run');
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : (options.limit || Infinity);

  console.log(`=== [Cloudflare R2 Original High-Res PNG Sync] ===`);
  console.log(`  - Endpoint: ${CONFIG.endpoint}`);
  console.log(`  - Bucket: ${CONFIG.bucketName}`);
  console.log(`  - Source Directory: ${IMAGES_RAW_DIR}`);
  console.log(`  - Mode: ${dryRun ? 'DRY-RUN (No HTTP requests)' : 'LIVE-UPLOAD'}`);

  if (!fs.existsSync(IMAGES_RAW_DIR)) {
    throw new Error(`Directory not found: ${IMAGES_RAW_DIR}`);
  }

  const rawFiles = fs.readdirSync(IMAGES_RAW_DIR)
    .filter(f => /^\d{5}\.png$/i.test(f))
    .sort();

  const targets = rawFiles.slice(0, limit);
  console.log(`  - Target Files: ${targets.length} original PNGs (Total ~735MB)\n`);

  let totalBytes = 0;
  let successCount = 0;
  let failCount = 0;

  const concurrency = options.concurrency || 6;
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    await Promise.all(batch.map(async (filename) => {
      const filePath = path.join(IMAGES_RAW_DIR, filename);
      // Dual registration: foods/00001.png AND images/00001.png
      const keysToUpload = [`foods/${filename}`, `images/${filename}`];

      for (const objectKey of keysToUpload) {
        let retries = 3;
        while (retries > 0) {
          try {
            const result = await uploadFileToR2(filePath, objectKey, { ...options, dryRun });
            if (objectKey === keysToUpload[0]) {
              totalBytes += result.size;
              successCount++;
            }
            const kb = (result.size / 1024).toFixed(1);
            console.log(`✔ [${result.status}] ${objectKey} (${kb} KB, image/png)`);
            break;
          } catch (err) {
            retries--;
            if (retries === 0) {
              failCount++;
              console.error(`✖ [FAIL] ${objectKey}: ${err.message}`);
            } else {
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }
      }
    }));
  }

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log('\n======================================================');
  console.log(`[Summary] Original High-Res PNGs Completed: ${successCount} files (${totalMB} MB)`);
  if (failCount > 0) {
    console.error(`[Summary] Failed: ${failCount} uploads`);
  }
  console.log('======================================================');

  return {
    totalFiles: targets.length,
    successCount,
    failCount,
    totalBytes
  };
}

/**
 * 전체 이미지 디렉토리 업로드 메인 루프 (WebP & JPG 에셋)
 */
export async function syncImagesToR2(options = {}) {
  const dryRun = options.dryRun || process.argv.includes('--dry-run');
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : (options.limit || Infinity);

  console.log(`=== [Cloudflare R2 Asset Sync] ===`);
  console.log(`  - Endpoint: ${CONFIG.endpoint}`);
  console.log(`  - Bucket: ${CONFIG.bucketName}`);
  console.log(`  - Source Directory: ${IMAGES_WEB_DIR}`);
  console.log(`  - Mode: ${dryRun ? 'DRY-RUN (No HTTP requests)' : 'LIVE-UPLOAD'}`);

  if (!fs.existsSync(IMAGES_WEB_DIR)) {
    throw new Error(`Directory not found: ${IMAGES_WEB_DIR}. Please optimize images first.`);
  }

  const allEntries = fs.readdirSync(IMAGES_WEB_DIR)
    .filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
    .sort();

  const targets = allEntries.slice(0, limit);
  console.log(`  - Target Files: ${targets.length} of ${allEntries.length} total\n`);

  let totalBytes = 0;
  let successCount = 0;
  let failCount = 0;

  const concurrency = options.concurrency || 5;
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    await Promise.all(batch.map(async (filename) => {
      const filePath = path.join(IMAGES_WEB_DIR, filename);
      const objectKey = `images/web/${filename}`;
      try {
        const result = await uploadFileToR2(filePath, objectKey, { ...options, dryRun });
        totalBytes += result.size;
        successCount++;
        const kb = (result.size / 1024).toFixed(1);
        console.log(`✔ [${result.status}] ${objectKey} (${kb} KB, ${result.contentType})`);
      } catch (err) {
        failCount++;
        console.error(`✖ [FAIL] ${objectKey}: ${err.message}`);
      }
    }));
  }

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log('\n======================================================');
  console.log(`[Summary] Completed: ${successCount} files (${totalMB} MB)`);
  if (failCount > 0) {
    console.error(`[Summary] Failed: ${failCount} files`);
  }
  console.log('======================================================');

  return {
    totalFiles: targets.length,
    successCount,
    failCount,
    totalBytes
  };
}

// CLI 실행 시
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const uploadAll = async () => {
    // 1. 원본 고해상도 PNG (401개) 먼저 업로드
    await syncOriginalPngsToR2();
    // 2. 만약 --web 플래그가 함께 있거나 단독 실행 시 web 에셋도 동기화
    if (process.argv.includes('--web') || process.argv.includes('--all')) {
      await syncImagesToR2();
    }
  };

  uploadAll().catch(err => {
    console.error('Fatal R2 sync error:', err);
    process.exit(1);
  });
}
