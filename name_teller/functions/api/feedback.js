// functions/api/feedback.js — Cloudflare Pages Function for user feature requests & feedback
const ipHits = new Map();

function isRateLimited(ip, limit = 5, windowMs = 600000) { // 10분에 최대 5회
  if (!ip) return false;
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter(t => now - t < windowMs);
  if (hits.length >= limit) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);

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
      JSON.stringify({ error: '짧은 시간 동안 너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.' }),
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

  const category = String(body.category || '기능 제안').trim().slice(0, 30);
  const content = String(body.content || '').trim();
  const contact = String(body.contact || '').trim().slice(0, 100);

  if (!content || content.length < 5) {
    return new Response(
      JSON.stringify({ error: '내용을 최소 5자 이상 작성해주세요.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  if (content.length > 1000) {
    return new Response(
      JSON.stringify({ error: '내용은 최대 1,000자까지 작성할 수 있습니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const summary = content.replace(/[\r\n\t]+/g, ' ').slice(0, 35) + (content.length > 35 ? '…' : '');
  const now = new Date();
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);

  const issueTitle = `[사용자 제안] ${category}: ${summary}`;
  const issueBody = `## 💡 개발자에게 요청하기 (User Feedback & Feature Request)

- **분류**: \`${category}\`
- **접수 일시**: ${kstTime} (KST)
- **작성자 / 연락처**: ${contact ? `\`${contact}\`` : '*(익명 방문자)*'}
- **접수 IP**: \`${ip.slice(0, 7)}***\`

---

### 📝 요청 내용:
${content}

---
*Submitted via tellmyname.app 「개발자에게 요청하기」*`;

  const repo = (env && env.GITHUB_REPO) || 'bsj805/name_teller';
  const token = env && env.GITHUB_TOKEN;
  const queueIssueNumber = (env && env.QUEUE_ISSUE_NUMBER) || '7';

  if (!token) {
    console.warn('[api/feedback] GITHUB_TOKEN is not configured; simulated success');
    return new Response(
      JSON.stringify({
        ok: true,
        mocked: true,
        message: '의견이 접수되었습니다! (개발 환경 모의 전송)'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 1. GitHub API: 새 Issue 생성 시도 (우선순위 1)
  try {
    const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'name-teller-feedback-function'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['user-request', 'enhancement']
      })
    });

    if (ghRes.ok) {
      const created = await ghRes.json();
      return new Response(
        JSON.stringify({
          ok: true,
          issueNumber: created.number,
          issueUrl: created.html_url,
          message: '소중한 의견이 GitHub Issue로 등록되었습니다!'
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. 만약 Issue 생성 권한 부족 등으로 실패 시 Queue Issue에 코멘트로 폴백 (우선순위 2)
    console.warn('[api/feedback] Creating issue failed, fallback to comment:', ghRes.status);
    const commentMarkdown = '```json\n' + JSON.stringify({
      type: 'feedback',
      category,
      content,
      contact,
      createdAt: new Date().toISOString()
    }, null, 2) + '\n```';

    const commentRes = await fetch(`https://api.github.com/repos/${repo}/issues/${queueIssueNumber}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'name-teller-feedback-function'
      },
      body: JSON.stringify({ body: `### [사용자 건의] ${category}\n\n${commentMarkdown}` })
    });

    if (commentRes.ok) {
      return new Response(
        JSON.stringify({
          ok: true,
          fallback: true,
          message: '소중한 의견이 개발자 큐에 안전하게 전달되었습니다!'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'GitHub 연동 처리 중 오류가 발생했습니다.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[api/feedback] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
