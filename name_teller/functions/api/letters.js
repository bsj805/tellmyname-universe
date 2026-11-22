// functions/api/letters.js — Cloudflare Pages Function for anonymous letters
const ipHits = new Map();

function isRateLimited(ip, limit = 15, windowMs = 60000) {
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

function stripUrls(text) {
  if (!text) return '';
  return text
    .replace(/https?:\/\/[^\s]+/gi, '')
    .replace(/www\.[^\s]+/gi, '')
    .replace(/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s]*/gi, '')
    .trim();
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

  const hangulName = String(body.hangulName || '').trim();
  const surname = String(body.surname || '').trim();
  const recipientHint = String(body.recipientHint || '').trim().slice(0, 20);
  const senderHint = String(body.senderHint || body.senderNickname || '').trim().slice(0, 20);
  const rawContent = String(body.content || '');
  const cleanContent = stripUrls(rawContent).slice(0, 300);

  // Validate hangulName (1-5 Hangul)
  if (!/^[가-힣]{1,5}$/.test(hangulName)) {
    return new Response(
      JSON.stringify({ error: '이름은 1~5자의 한글이어야 합니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate surname ('' or ≤2 Hangul)
  if (surname && !/^[가-힣]{1,2}$/.test(surname)) {
    return new Response(
      JSON.stringify({ error: '성씨는 1~2자의 한글이어야 합니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate content (1-300 chars, no empty after stripping URLs)
  if (!cleanContent || cleanContent.length < 1 || cleanContent.length > 300) {
    return new Response(
      JSON.stringify({ error: '편지 내용은 1자 이상 300자 이하여야 하며, URL은 허용되지 않습니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const letterPayload = {
    type: 'letter',
    hangulName,
    surname,
    recipientHint,
    senderHint,
    content: cleanContent,
    createdAt: new Date().toISOString()
  };

  const repo = (env && env.GITHUB_REPO) || 'bsj805/name_teller';
  const issueNumber = (env && env.QUEUE_ISSUE_NUMBER) || '7';
  const token = env && env.GITHUB_TOKEN;

  if (!token) {
    // If running in an environment without GITHUB_TOKEN (e.g. preview), log and accept
    console.warn('[api/letters] GITHUB_TOKEN is not configured; simulated success');
    return new Response(
      JSON.stringify({ ok: true, mocked: true }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const commentMarkdown = '```json\n' + JSON.stringify(letterPayload, null, 2) + '\n```';
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
      console.error('[api/letters] GitHub API error:', ghRes.status, errText);
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
    console.error('[api/letters] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
