#!/usr/bin/env node
/**
 * Local Multi-App Development Server for TellMyName Universe
 * Starts all 5 apps simultaneously using their actual worker.js SSR + dist/ static assets:
 *  - http://localhost:3000 -> name_teller (tellmyname.app Hub Portal)
 *  - http://localhost:3001 -> myhome      (myhome.tellmyname.app)
 *  - http://localhost:3002 -> food        (food.tellmyname.app)
 *  - http://localhost:3003 -> occupation  (job.tellmyname.app)
 *  - http://localhost:3004 -> car         (car.tellmyname.app)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif'
};

const APPS = [
  { id: 'name_teller', port: 3000, prodOrigin: 'https://tellmyname.app' },
  { id: 'myhome',      port: 3001, prodOrigin: 'https://myhome.tellmyname.app' },
  { id: 'food',        port: 3002, prodOrigin: 'https://food.tellmyname.app' },
  { id: 'occupation',  port: 3003, prodOrigin: 'https://job.tellmyname.app' },
  { id: 'car',         port: 3004, prodOrigin: 'https://car.tellmyname.app' }
];

function createAssetsEnv(distDir, prodOrigin) {
  return {
    ASSETS: {
      async fetch(reqOrUrl) {
        const u = new URL(typeof reqOrUrl === 'string' ? reqOrUrl : reqOrUrl.url);
        let pathname = decodeURIComponent(u.pathname);
        if (pathname === '/' || pathname === '') pathname = '/index.html';
        const candidate = path.join(distDir, pathname);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          const ext = path.extname(candidate).toLowerCase();
          const body = fs.readFileSync(candidate);
          return new Response(body, {
            status: 200,
            headers: { 'content-type': MIME_TYPES[ext] || 'application/octet-stream' }
          });
        }
        // Fallback to index.html for SPA routes
        const idx = path.join(distDir, 'index.html');
        if (fs.existsSync(idx)) {
          return new Response(fs.readFileSync(idx), {
            status: 200,
            headers: { 'content-type': 'text/html; charset=utf-8' }
          });
        }
        return new Response('Not Found', { status: 404 });
      }
    }
  };
}

for (const app of APPS) {
  const appDir = path.join(ROOT_DIR, app.id);
  const distDir = path.join(appDir, 'dist');
  const workerPath = path.join(appDir, 'worker.js');
  const workerMod = await import(pathToFileURL(workerPath).href);
  const workerDefault = workerMod.default;
  const env = createAssetsEnv(distDir, app.prodOrigin);

  const server = http.createServer(async (req, res) => {
    try {
      const fullUrl = `${app.prodOrigin}${req.url || '/'}`;
      // Proxy /r2/* and /images/* from production if not found locally so images always render locally
      const parsed = new URL(fullUrl);
      const localCandidate = path.join(distDir, decodeURIComponent(parsed.pathname));
      if ((parsed.pathname.startsWith('/r2/') || parsed.pathname.startsWith('/images/')) && !fs.existsSync(localCandidate)) {
        res.writeHead(302, { Location: `${app.prodOrigin}${parsed.pathname}` });
        res.end();
        return;
      }

      const webReq = new Request(fullUrl, {
        method: req.method || 'GET',
        headers: req.headers
      });
      const webRes = await workerDefault.fetch(webReq, env, {});
      const headersObj = {};
      webRes.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
      const buf = Buffer.from(await webRes.arrayBuffer());
      res.writeHead(webRes.status, headersObj);
      res.end(buf);
    } catch (err) {
      console.error(`[${app.id}] Server Error:`, err);
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(String(err?.stack || err));
    }
  });

  server.listen(app.port, () => {
    console.log(`✔ [${app.id.padEnd(11)}] running at http://localhost:${app.port}  (mirrors ${app.prodOrigin})`);
  });
}
