// src/lib/r2_storage.js — Cloudflare R2 Object Storage & Edge Fallback Renderer
// Supports high-performance CDN caching (1 year immutable) and instant SVG Edge rendering fallback.

import { MIN_LEVEL, MAX_LEVEL, getHouseImageUrl } from './constants.js';
import { getHouseConceptByLevel } from './taxonomy.js';
import { renderHouseArtworkSvg } from './gemini_client.js';

export const R2_BUCKET_NAME = 'myhome-houses-r2';
export const R2_ACCOUNT_ID = '5e276b42664b54929d077e3edd6335d4';
export const R2_S3_ENDPOINT = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com';
export const R2_BUCKET_S3_URL = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com/myhome-houses-r2';
export const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Parses building level integer (0..20000) from an R2 image request pathname.
 * Examples:
 *   "/r2/houses/04478.webp" -> 4478
 *   "/r2/houses/4478.svg"   -> 4478
 *   "/r2/houses/00000.webp" -> 0
 *   "/r2/houses/20000.webp" -> 20000
 * Returns null if pathname is invalid or level is outside [MIN_LEVEL, MAX_LEVEL].
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

  const match = cleanPath.match(/(?:^|\/)r2\/houses\/(\d+)(?:\.[a-zA-Z0-9]+)?$/i);
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
 * Example: level = 4478 -> "houses/04478.webp"
 */
export function getR2ObjectKey(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  return `houses/${String(lv).padStart(5, '0')}.webp`;
}

/**
 * Calculates metadata chunk index (0..19) for a given level.
 * Formula: Math.min(19, Math.floor(level / 50))
 */
export function getChunkIndexForLevel(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  return Math.min(19, Math.floor(lv / 50));
}

/**
 * Returns the chunk filename containing the metadata for a given level.
 * Example: level = 4478 -> "houses-chunk-04.json"
 */
export function getChunkFilename(level) {
  const chunkIdx = getChunkIndexForLevel(level);
  return `houses-chunk-${String(chunkIdx).padStart(2, '0')}.json`;
}

/**
 * Serves house image from Cloudflare R2 bucket binding if present;
 * otherwise dynamically renders high-detail architectural SVG artwork on the Edge.
 *
 * Browsers seamlessly render SVG artwork even when requested with .webp URL extension
 * as long as the Content-Type header is 'image/svg+xml; charset=utf-8'.
 *
 * @param {number|string} level
 * @param {object} [env={}]
 * @returns {Promise<{body: any, contentType: string, headers: Record<string, string>, source: 'R2_BUCKET'|'EDGE_RENDERER'}>}
 */
export async function serveR2HouseImage(level, env = {}) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const padded = String(lv).padStart(5, '0');

  // 1. Check Cloudflare R2 Bucket Binding (MYHOME_R2) for .webp and .png
  if (env && env.MYHOME_R2 && typeof env.MYHOME_R2.get === 'function') {
    const keysToCheck = [`houses/${padded}.webp`, `houses/${padded}.png`];
    for (const key of keysToCheck) {
      try {
        const obj = await env.MYHOME_R2.get(key);
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
        console.warn(`[serveR2HouseImage] Warning: R2 fetch failed for key "${key}":`, err?.message || err);
      }
    }
  }

  // 2. Dynamic Edge SVG Artwork Renderer Fallback
  const concept = getHouseConceptByLevel(lv);
  const svgString = renderHouseArtworkSvg(concept);

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

/**
 * Helper to construct a standard Web Response object from serveR2HouseImage result.
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

export { MIN_LEVEL, MAX_LEVEL, getHouseImageUrl };
