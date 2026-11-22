// src/lib/r2_storage.js — Cloudflare R2 Object Storage & Edge Fallback Renderer for MyCar
// Supports high-performance CDN caching (1 year immutable) and instant 1024x1024 SVG Edge rendering fallback.

import { MIN_LEVEL, MAX_LEVEL, getCarImageUrl, getJobImageUrl, getHouseImageUrl } from './constants.js';
import * as taxonomy from './taxonomy.js';
import * as geminiClient from './gemini_client.js';

export const R2_BUCKET_NAME = 'myhome-houses-r2';
export const R2_ACCOUNT_ID = '5e276b42664b54929d077e3edd6335d4';
export const R2_S3_ENDPOINT = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com';
export const R2_BUCKET_S3_URL = 'https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com/myhome-houses-r2';
export const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable';

function clampLevel(level) {
  const num = Number(level);
  if (!Number.isFinite(num)) return MIN_LEVEL;
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(num)));
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderMinimalFallbackSvg(concept, lv) {
  const isGood = lv >= 500;
  const bg = isGood ? '#0f172a' : '#1f0b0b';
  const accent = isGood ? '#38bdf8' : '#f87171';
  const title = escapeXml(concept?.title || `Lv.${lv} 자동차`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  <rect x="48" y="48" width="928" height="928" rx="40" fill="none" stroke="${accent}" stroke-width="6"/>
  <text x="512" y="460" text-anchor="middle" fill="${accent}" font-size="64" font-weight="800" font-family="sans-serif">Lv.${lv}</text>
  <text x="512" y="560" text-anchor="middle" fill="#f8fafc" font-size="40" font-weight="700" font-family="sans-serif">${title}</text>
</svg>`;
}

/**
 * Parses vehicle/occupation/house level integer (0..1000) from an R2 image request pathname.
 * Examples:
 *   "/r2/cars/00331.webp"   -> 331
 *   "/r2/jobs/00331.webp"   -> 331
 *   "/r2/houses/00331.webp" -> 331
 *   "/r2/cars/1000.svg"     -> 1000
 *   "/r2/cars/00000.webp"   -> 0
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

  const match = cleanPath.match(/(?:^|\/)r2\/(?:cars|jobs|houses)\/(\d+)(?:\.[a-zA-Z0-9]+)?$/i);
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
 * Example: level = 331 -> "cars/00331.webp"
 * @param {number|string} level
 * @returns {string}
 */
export function getR2ObjectKey(level) {
  const lv = clampLevel(level);
  return `cars/${String(lv).padStart(5, '0')}.webp`;
}

/**
 * Calculates metadata chunk index (0..19) for a given level.
 * Formula: Math.min(19, Math.floor(level / 50)) (Lv.1000 maps to chunk 19)
 * @param {number|string} level
 * @returns {number}
 */
export function getChunkIndexForLevel(level) {
  const lv = clampLevel(level);
  return Math.min(19, Math.floor(lv / 50));
}

/**
 * Returns the chunk filename containing the metadata for a given level.
 * Example: level = 331 -> "cars-chunk-06.json"
 * @param {number|string} level
 * @returns {string}
 */
export function getChunkFilename(level) {
  const chunkIdx = getChunkIndexForLevel(level);
  return `cars-chunk-${String(chunkIdx).padStart(2, '0')}.json`;
}

/**
 * Renders 1024x1024 vector SVG artwork for a given level on the Edge.
 * @param {number|string} level
 * @returns {string}
 */
export function renderCarEdgeSvg(level) {
  const lv = clampLevel(level);
  const getConcept = taxonomy.getCarConceptByLevel || taxonomy.getJobConceptByLevel || taxonomy.getHouseConceptByLevel;
  let concept;
  try {
    concept = typeof getConcept === 'function' ? getConcept(lv) : { level: lv, title: `Lv.${lv} 자동차` };
  } catch {
    concept = { level: lv, title: `Lv.${lv} 자동차` };
  }

  const renderFn =
    geminiClient.renderCarArtworkSvg ||
    geminiClient.renderJobArtworkSvg ||
    taxonomy.renderCarArtworkSvg ||
    taxonomy.renderJobArtworkSvg;

  if (typeof renderFn === 'function') {
    try {
      return renderFn(concept);
    } catch {
      // Fall through to minimal inline SVG
    }
  }
  return renderMinimalFallbackSvg(concept, lv);
}

/**
 * Serves car/vehicle image from Cloudflare R2 bucket binding if present;
 * otherwise dynamically renders high-detail 1024x1024 vector SVG artwork on the Edge.
 *
 * Browsers seamlessly render SVG artwork even when requested with .webp URL extension
 * as long as the Content-Type header is 'image/svg+xml; charset=utf-8'.
 *
 * @param {number|string} level
 * @param {object} [env={}]
 * @returns {Promise<{body: any, contentType: string, headers: Record<string, string>, source: 'R2_BUCKET'|'EDGE_RENDERER'}>}
 */
export async function serveR2CarImage(level, env = {}) {
  const lv = clampLevel(level);
  const padded = String(lv).padStart(5, '0');

  // 1. Check Cloudflare R2 Bucket Binding (CAR_R2, OCCUPATION_R2, or MYHOME_R2) for .webp and .png
  const r2Bucket = env?.CAR_R2 || env?.OCCUPATION_R2 || env?.MYHOME_R2;
  if (r2Bucket && typeof r2Bucket.get === 'function') {
    const keysToCheck = [
      `cars/${padded}.webp`,
      `cars/${padded}.png`
    ];
    for (const key of keysToCheck) {
      try {
        const obj = await r2Bucket.get(key);
        if (obj) {
          const isPng = key.endsWith('.png');
          const headers = {
            'Cache-Control': R2_CACHE_CONTROL,
            'Access-Control-Allow-Origin': '*'
          };
          if (obj.httpEtag) {
            headers['ETag'] = obj.httpEtag;
          }
          return {
            body: obj.body !== undefined ? obj.body : obj,
            contentType: obj.httpMetadata?.contentType || (isPng ? 'image/png' : 'image/webp'),
            headers,
            source: 'R2_BUCKET'
          };
        }
      } catch (err) {
        console.warn(`[serveR2CarImage] Warning: R2 fetch failed for key "${key}":`, err?.message || err);
      }
    }
  }

  // 2. Dynamic Edge SVG Artwork Renderer Fallback
  const svgString = renderCarEdgeSvg(lv);

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

// Backward-compatible aliases
export const serveR2JobImage = serveR2CarImage;
export const serveR2HouseImage = serveR2CarImage;

/**
 * Helper to construct a standard Web Response object from serveR2CarImage result.
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

export { MIN_LEVEL, MAX_LEVEL, getCarImageUrl, getJobImageUrl, getHouseImageUrl };
