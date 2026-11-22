// scripts/dev_server.mjs — Local Cloudflare Workers / Static Assets Dev Server for MyCar
// Wraps worker.js and provides mock ASSETS & CAR_R2 for 100% faithful local E2E simulation (car.tellmyname.app)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import worker from '../worker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Cloudflare Worker 환경 모의 객체(Mock Env) 생성
 */
export function createMockEnv(customOptions = {}) {
  const rootDir = customOptions.rootDir || ROOT_DIR;

  const mockR2 = {
    async get(key) {
      if (typeof customOptions.r2Get === 'function') {
        return customOptions.r2Get(key);
      }

      const baseNum = path.basename(key, path.extname(key));
      const rawLv = parseInt(baseNum, 10);
      const ext = path.extname(key).toLowerCase();

      let candidatePaths = [];

      if (ext === '.json') {
        candidatePaths = [
          path.resolve(rootDir, 'images', `${baseNum}.json`),
          path.resolve(rootDir, 'images', `${rawLv}.json`),
          path.resolve(rootDir, 'dist', key),
          path.resolve(rootDir, 'data', key)
        ];
      } else if (ext === '.webp') {
        candidatePaths = [
          path.resolve(rootDir, 'images', `${baseNum}.webp`),
          path.resolve(rootDir, 'images', `${rawLv}.webp`),
          path.resolve(rootDir, 'images', `${baseNum}.png`),
          path.resolve(rootDir, 'images', `${rawLv}.png`),
          path.resolve(rootDir, 'dist', key),
          path.resolve(rootDir, 'data', key),
          path.resolve(rootDir, 'dist', 'r2', key),
          path.resolve(rootDir, 'data', 'r2', key)
        ];
      } else {
        candidatePaths = [
          path.resolve(rootDir, 'images', `${baseNum}.png`),
          path.resolve(rootDir, 'images', `${rawLv}.png`),
          path.resolve(rootDir, 'images', `${baseNum}.webp`),
          path.resolve(rootDir, 'images', `${rawLv}.webp`),
          path.resolve(rootDir, 'dist', key),
          path.resolve(rootDir, 'data', key),
          path.resolve(rootDir, 'dist', 'r2', key),
          path.resolve(rootDir, 'data', 'r2', key)
        ];
      }

      for (const p of candidatePaths) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
          const buf = fs.readFileSync(p);
          return {
            body: buf,
            size: buf.byteLength,
            httpMetadata: {
              contentType: getMimeType(p)
            },
            httpEtag: `"${buf.byteLength.toString(16)}"`
          };
        }
      }
      return null;
    }
  };

  return {
    CAR_R2: mockR2,
    OCCUPATION_R2: mockR2,
    MYHOME_R2: mockR2,

    ASSETS: {
      async fetch(assetRequest) {
        if (typeof customOptions.assetsFetch === 'function') {
          return customOptions.assetsFetch(assetRequest);
        }

        const reqUrl = new URL(assetRequest.url);
        let pathname = decodeURIComponent(reqUrl.pathname);
        if (pathname === '/' || pathname === '') {
          pathname = '/index.html';
        }

        const cleanRelPath = pathname.replace(/^\/+/, '');
        const candidatePaths = [
          path.resolve(rootDir, 'dist', cleanRelPath),
          path.resolve(rootDir, 'web', cleanRelPath),
          path.resolve(rootDir, 'public', cleanRelPath),
          path.resolve(rootDir, cleanRelPath),
          path.resolve(rootDir, 'dist', cleanRelPath + '.html'),
          path.resolve(rootDir, 'web', cleanRelPath + '.html'),
          path.resolve(rootDir, 'public', cleanRelPath + '.html'),
          path.resolve(rootDir, cleanRelPath + '.html')
        ];

        for (const p of candidatePaths) {
          if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            const buf = fs.readFileSync(p);
            return new Response(buf, {
              status: 200,
              headers: {
                'Content-Type': getMimeType(p),
                'Content-Length': String(buf.byteLength)
              }
            });
          }
        }

        // SPA 라우팅 폴백 (dist/index.html 또는 web/index.html)
        const spaCandidates = [
          path.resolve(rootDir, 'dist', 'index.html'),
          path.resolve(rootDir, 'web', 'index.html')
        ];
        for (const p of spaCandidates) {
          if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            const buf = fs.readFileSync(p);
            return new Response(buf, {
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          }
        }

        return new Response('Asset Not Found', { status: 404 });
      }
    }
  };
}

/**
 * HTTP Dev Server 생성
 */
export function createDevServer(options = {}) {
  const env = createMockEnv(options);

  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host || `127.0.0.1:${options.port || 8796}`;
      const fullUrl = new URL(req.url, `http://${host}`);

      let bodyBuffer = null;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        if (chunks.length > 0) {
          bodyBuffer = Buffer.concat(chunks);
        }
      }

      const webHeaders = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value != null) {
          if (Array.isArray(value)) {
            for (const v of value) webHeaders.append(key, v);
          } else {
            webHeaders.set(key, value);
          }
        }
      }

      const webRequest = new Request(fullUrl.toString(), {
        method: req.method,
        headers: webHeaders,
        body: bodyBuffer
      });

      const webResponse = await worker.fetch(webRequest, env, {});

      res.statusCode = webResponse.status;
      webResponse.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const respBytes = await webResponse.arrayBuffer();
      res.end(Buffer.from(respBytes));
    } catch (err) {
      console.error('[Dev Server Error]', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      res.end('Internal Dev Server Error: ' + (err.message || String(err)));
    }
  });

  return server;
}

/**
 * Dev Server 시작 유틸리티
 */
export function startServer(options = {}) {
  const port = options.port !== undefined && options.port !== null
    ? Number(options.port)
    : Number(process.env.PORT || 8796);
  const host = options.host || '127.0.0.1';
  const server = createDevServer({ ...options, port });

  return new Promise((resolve, reject) => {
    server.listen(port, host, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      const url = `http://${host}:${actualPort}/`;
      if (!options.silent) {
        console.log(`[MyCar Dev Server] Listening on ${url}`);
        console.log('  - Cloudflare Edge Worker SSR: Active (https://car.tellmyname.app)');
        console.log('  - Same-domain R2 router: Active (/r2/cars/*.webp, /r2/cars/*.png, SVG fallback)');
        console.log('  - API endpoints: /api/car, /api/car/:level, /api/level/:level, /api/name/:name, /api/level-name/:level');
        const imgDir = path.resolve(ROOT_DIR, 'images');
        if (fs.existsSync(imgDir)) {
          const imgCount = fs.readdirSync(imgDir).filter(f => /\.(png|webp)$/i.test(f)).length;
          console.log(`  - Local Image Source: images/ (${imgCount} active PNG/WebP images detected)`);
        }
      }
      resolve({
        server,
        port: actualPort,
        url,
        close: () => new Promise(r => server.close(r))
      });
    });

    server.on('error', reject);
  });
}

// 직접 CLI 실행 시 자동 구동
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startServer().catch(err => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });
}
