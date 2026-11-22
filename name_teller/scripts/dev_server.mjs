// scripts/dev_server.mjs
// Lightweight local dev server simulating Cloudflare Pages static hosting with clean URL rewrites & mock API
import http from 'http';
import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveFile(res, filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Server Error: ' + err.message);
  }
}

const server = http.createServer((req, res) => {
  const decodedUrl = decodeURIComponent(req.url.split('?')[0]);

  // Handle mock /api/* endpoints locally
  if (decodedUrl.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end();
    }
    if (req.method === 'POST') {
      let raw = '';
      req.on('data', chunk => { raw += chunk; });
      req.on('end', () => {
        console.log(`[Dev Server Mock API] POST ${decodedUrl}: ${raw.slice(0, 100)}`);
        res.writeHead(202, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: true, mocked: true, message: 'Local dev server mock response (202 Accepted)' }));
      });
      return;
    }
  }

  let safePath = path.normalize(decodedUrl).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(distDir, safePath);

  // 1. Direct file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }

  // 2. Directory with index.html (e.g. /name/서윤/ -> /name/서윤/index.html)
  const dirIndexPath = path.join(distDir, safePath, 'index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    return serveFile(res, dirIndexPath);
  }

  // 3. Clean URL with .html extension
  const htmlPath = path.join(distDir, safePath + '.html');
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return serveFile(res, htmlPath);
  }

  // 4. Cloudflare Pages SPA rewrite fallback for /name/* or unknown paths -> /index.html
  const fallbackIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(fallbackIndex)) {
    return serveFile(res, fallbackIndex);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`🚀 [Local Dev Server] Running at http://localhost:${PORT}`);
  console.log(`📁 Serving directory: ${distDir}`);
});
