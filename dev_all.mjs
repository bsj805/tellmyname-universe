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

function createAssetsEnv(distDir) {
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

function tryServeLocalR2Image(pathname, res) {
  // Handle /r2/jobs/00512.webp, /r2/cars/00512.webp, /r2/houses/00512.webp across all local ports
  const m = pathname.match(/^\/r2\/(jobs|cars|houses)\/(\d{5})\.(webp|png|jpg)$/i);
  if (!m) return false;
  const [, bucket, padded] = m;
  if (bucket === 'jobs') {
    const localPng = path.join(ROOT_DIR, 'occupation', 'images', `${padded}.png`);
    if (fs.existsSync(localPng)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
      res.end(fs.readFileSync(localPng));
      return true;
    }
  } else if (bucket === 'cars') {
    const localPng = path.join(ROOT_DIR, 'car', 'images', `${padded}.png`);
    if (fs.existsSync(localPng)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
      res.end(fs.readFileSync(localPng));
      return true;
    }
  } else if (bucket === 'houses') {
    res.writeHead(302, { Location: `https://myhome.tellmyname.app/r2/houses/${padded}.webp` });
    res.end();
    return true;
  }
  return false;
}

for (const app of APPS) {
  const appDir = path.join(ROOT_DIR, app.id);
  const distDir = path.join(appDir, 'dist');
  const workerPath = path.join(appDir, 'worker.js');
  const workerMod = await import(pathToFileURL(workerPath).href);
  const workerDefault = workerMod.default;
  const env = createAssetsEnv(distDir);

  const server = http.createServer(async (req, res) => {
    try {
      const fullUrl = `${app.prodOrigin}${req.url || '/'}`;
      const parsed = new URL(fullUrl);
      const decodedPath = decodeURIComponent(parsed.pathname);

      // 1. Check cross-app /r2/(jobs|cars|houses)/* from local disk or production R2
      if (decodedPath.startsWith('/r2/')) {
        if (tryServeLocalR2Image(decodedPath, res)) return;
      }

      // 2. Check /images/* for food (serve local PNG or WebP directly from disk)
      const localCandidate = path.join(distDir, decodedPath);
      if (decodedPath.startsWith('/images/') && !fs.existsSync(localCandidate)) {
        const rawFoodImg = path.join(ROOT_DIR, 'food', decodedPath);
        if (fs.existsSync(rawFoodImg) && fs.statSync(rawFoodImg).isFile()) {
          const ext = path.extname(rawFoodImg).toLowerCase();
          res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'image/png', 'Cache-Control': 'public, max-age=3600' });
          res.end(fs.readFileSync(rawFoodImg));
          return;
        }
        const mFood = decodedPath.match(/^\/images\/(?:web\/)?(\d{5})\.(png|webp|jpg)$/i);
        if (mFood) {
          const webpPath = path.join(ROOT_DIR, 'food', 'dist', 'images', 'web', `${mFood[1]}.webp`);
          if (fs.existsSync(webpPath)) {
            res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=3600' });
            res.end(fs.readFileSync(webpPath));
            return;
          }
        }
        res.writeHead(302, { Location: `${app.prodOrigin}${decodedPath}` });
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
