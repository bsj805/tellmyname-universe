// functions/api/search.js — Cloudflare Pages Function for searched names queue
const ipHits = new Map();

function isRateLimited(ip, limit = 30, windowMs = 60000) {
  if (!ip) return false;
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter(t => now - t < windowMs);
  if (hits.length >= limit) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);

  // Occasional garbage collection
  if (ipHits.size > 1000) {
    for (const [k, v] of ipHits.entries()) {
      if (v.every(t => now - t > windowMs)) ipHits.delete(k);
    }
  }
  return false;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: '유효한 JSON 형식이 아닙니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const name = String(body.name || body.hangulName || '').trim();
  const lang = String(body.lang || '').trim().toLowerCase();

  const isKorean = /^[가-힣]{1,6}$/.test(name);
  const isForeign = /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF\s'.-]{1,30}$/.test(name);

  if (!isKorean && !isForeign) {
    return new Response(
      JSON.stringify({ error: '유효한 한글 이름(1~6자) 또는 외국어 이름(1~30자)이어야 합니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const searchPayload = {
    type: isForeign ? 'search_foreign' : 'search',
    name,
    lang: isForeign ? (lang || 'auto') : 'ko',
    createdAt: new Date().toISOString()
  };

  const repo = (env && env.GITHUB_REPO) || 'bsj805/name_teller';
  const issueNumber = (env && env.QUEUE_ISSUE_NUMBER) || '7';
  const token = env && env.GITHUB_TOKEN;

  if (!token) {
    console.warn('[api/search] GITHUB_TOKEN is not configured; simulated success');
    return new Response(
      JSON.stringify({ ok: true, mocked: true }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const commentMarkdown = '```json\n' + JSON.stringify(searchPayload, null, 2) + '\n```';
    const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'name-teller-pages-function'
      },
      body: JSON.stringify({ body: commentMarkdown })
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      console.error('[api/search] GitHub API error:', ghRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'GitHub Issue 연동 실패' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const created = await ghRes.json();
    return new Response(
      JSON.stringify({ ok: true, id: created.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[api/search] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
