// src/lib/r2_storage.js — Cloudflare R2 Object Storage & Edge Fallback Renderer for MyJob
// Supports high-performance CDN caching (1 year immutable) and instant SVG Edge rendering fallback.

import { MIN_LEVEL, MAX_LEVEL, getJobImageUrl, getHouseImageUrl } from './constants.js';
import { getJobConceptByLevel } from './taxonomy.js';
import { renderJobArtworkSvg } from './gemini_client.js';

export const R2_BUCKET_NAME = 'myhome-houses-r2';
export const R2_ACCOUNT_ID = '5e276b42664b54929d077e3edd6335d4';
export const R2_S3_ENDPOINT = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com';
export const R2_BUCKET_S3_URL = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com/myhome-houses-r2';
export const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Parses occupation/house level integer (0..1000) from an R2 image request pathname.
 * Examples:
 *   "/r2/jobs/00331.webp"   -> 331
 *   "/r2/houses/00331.webp" -> 331
 *   "/r2/jobs/1000.svg"     -> 1000
 *   "/r2/jobs/00000.webp"   -> 0
 * Returns null if pathname is invalid or level is outside [MIN_LEVEL, MAX_LEVEL].
 * @param {string} pathname
 * @returns {number|null}
 */
export function parseLevelFromR2Path(pathname) {
  if (typeof pathname !== 'string' || !pathname.trim()) {
    return null;
  }

  let cleanPath = pathname.trim();
  try {
    if (cleanPath.includes('://')) {
      cleanPath = new URL(cleanPath).pathname;
    }
  } catch {
    // Continue with original path string
  }

  const match = cleanPath.match(/(?:^|\/)r2\/(?:jobs|houses)\/(\d+)(?:\.[a-zA-Z0-9]+)?$/i);
  if (!match) {
    return null;
  }

  const parsed = parseInt(match[1], 10);
  if (!Number.isInteger(parsed) || parsed < MIN_LEVEL || parsed > MAX_LEVEL) {
    return null;
  }

  return parsed;
}

/**
 * Returns standard Cloudflare R2 object key for a given level.
 * Example: level = 331 -> "jobs/00331.webp"
 * @param {number|string} level
 * @returns {string}
 */
export function getR2ObjectKey(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  return `jobs/${String(lv).padStart(5, '0')}.webp`;
}

/**
 * Calculates metadata chunk index (0..19) for a given level.
 * Formula: Math.min(19, Math.floor(level / 50)) (Lv.1000 maps to chunk 19)
 * @param {number|string} level
 * @returns {number}
 */
export function getChunkIndexForLevel(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  return Math.min(19, Math.floor(lv / 50));
}

/**
 * Returns the chunk filename containing the metadata for a given level.
 * Example: level = 331 -> "jobs-chunk-06.json"
 * @param {number|string} level
 * @returns {string}
 */
export function getChunkFilename(level) {
  const chunkIdx = getChunkIndexForLevel(level);
  return `jobs-chunk-${String(chunkIdx).padStart(2, '0')}.json`;
}

/**
 * Serves occupation image from Cloudflare R2 bucket binding if present;
 * otherwise dynamically renders high-detail vector SVG artwork on the Edge.
 *
 * Browsers seamlessly render SVG artwork even when requested with .webp URL extension
 * as long as the Content-Type header is 'image/svg+xml; charset=utf-8'.
 *
 * @param {number|string} level
 * @param {object} [env={}]
 * @returns {Promise<{body: any, contentType: string, headers: Record<string, string>, source: 'R2_BUCKET'|'EDGE_RENDERER'}>}
 */
export async function serveR2JobImage(level, env = {}) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const padded = String(lv).padStart(5, '0');

  // 1. Check Cloudflare R2 Bucket Binding (OCCUPATION_R2 or MYHOME_R2) for .webp and .png
  const r2Bucket = env?.OCCUPATION_R2 || env?.MYHOME_R2;
  if (r2Bucket && typeof r2Bucket.get === 'function') {
    const keysToCheck = [
      `jobs/${padded}.webp`,
      `jobs/${padded}.png`,
      `houses/${padded}.webp`,
      `houses/${padded}.png`
    ];
    for (const key of keysToCheck) {
      try {
        const obj = await r2Bucket.get(key);
        if (obj) {
          const isPng = key.endsWith('.png');
          return {
            body: obj.body !== undefined ? obj.body : obj,
            contentType: obj.httpMetadata?.contentType || (isPng ? 'image/png' : 'image/webp'),
            headers: {
              'Cache-Control': R2_CACHE_CONTROL,
              'Access-Control-Allow-Origin': '*'
            },
            source: 'R2_BUCKET'
          };
        }
      } catch (err) {
        console.warn(`[serveR2JobImage] Warning: R2 fetch failed for key "${key}":`, err?.message || err);
      }
    }
  }

  // 2. Dynamic Edge SVG Artwork Renderer Fallback
  let concept;
  try {
    concept = typeof getJobConceptByLevel === 'function' ? getJobConceptByLevel(lv) : { level: lv, title: `Lv.${lv} 직업` };
  } catch {
    concept = { level: lv, title: `Lv.${lv} 직업` };
  }
  const svgString = renderJobArtworkSvg(concept);

  return {
    body: svgString,
    contentType: 'image/svg+xml; charset=utf-8',
    headers: {
      'Cache-Control': R2_CACHE_CONTROL,
      'Access-Control-Allow-Origin': '*'
    },
    source: 'EDGE_RENDERER'
  };
}

// Backward-compatible alias
export const serveR2HouseImage = serveR2JobImage;

/**
 * Helper to construct a standard Web Response object from serveR2JobImage result.
 * @param {object} result
 * @param {number} [status=200]
 * @returns {Response}
 */
export function createR2ImageResponse(result, status = 200) {
  return new Response(result.body, {
    status,
    headers: {
      'Content-Type': result.contentType,
      ...result.headers,
      'X-Image-Source': result.source
    }
  });
}

export { MIN_LEVEL, MAX_LEVEL, getJobImageUrl, getHouseImageUrl };
