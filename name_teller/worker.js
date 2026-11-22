// worker.js — TellMyName Official Hub Portal Router (tellmyname.app)
// Serves the standalone card hub for MyHome, Food (Mukbang), MyJob, MyCar, and Creator's Other Project (Photo Diary)

const SITE_ORIGIN = 'https://tellmyname.app';

function generateHubSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_ORIGIN}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://myhome.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://food.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://job.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://car.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://photodiary.tellmyname.app/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function generateHubMainSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_ORIGIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_ORIGIN}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_ORIGIN}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_ORIGIN}/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${SITE_ORIGIN}/terms.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/ads.txt') {
      return new Response('google.com, pub-8793936135959956, DIRECT, f08c47fec0942fa0\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (pathname === '/robots.txt') {
      const robots = [
        '# Robots.txt for https://tellmyname.app',
        'User-agent: *',
        'Allow: /',
        '',
        'Sitemap: https://tellmyname.app/sitemap.xml',
        'Sitemap: https://myhome.tellmyname.app/sitemap.xml',
        'Sitemap: https://food.tellmyname.app/sitemap.xml',
        'Sitemap: https://job.tellmyname.app/sitemap.xml',
        'Sitemap: https://car.tellmyname.app/sitemap.xml',
        'Sitemap: https://photodiary.tellmyname.app/sitemap.xml',
        ''
      ].join('\n');
      return new Response(robots, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (pathname === '/sitemap.xml') {
      return new Response(generateHubSitemap(), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (pathname === '/sitemap-main.xml') {
      return new Response(generateHubMainSitemap(), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
