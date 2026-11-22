// scripts/cloudflare-worker-github-bridge.js
// 정적 HTML 웹사이트에서 방문자가 이름을 검색(최대 5자)하거나 채팅형 익명 편지를 남길 때,
// GitHub Personal Access Token을 브라우저에 노출하지 않고 안전하게 GitHub Issue(#7)의 코멘트로 적재해주는
// 무료 Cloudflare Worker 브릿지 스크립트입니다 (일 10만 건 무료).

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const payload = await request.json();
      const hangulName = (payload.hangulName || '').trim();

      // 최대 5자 한글 이름 검증
      if (!/^[가-힣]{1,5}$/.test(hangulName)) {
        return new Response(JSON.stringify({ error: '이름은 1~5자 한글만 가능합니다.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const repo = env.GITHUB_REPO || 'bsj805/name_teller';
      const issueNumber = env.QUEUE_ISSUE_NUMBER || '7';
      const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'name-teller-cloudflare-bridge'
        },
        body: JSON.stringify({
          body: JSON.stringify({
            type: payload.type || 'SEARCH_NAME',
            hangulName,
            recipientHint: payload.recipientHint ? String(payload.recipientHint).slice(0, 30) : undefined,
            senderNickname: payload.senderNickname ? String(payload.senderNickname).slice(0, 20) : undefined,
            content: payload.content ? String(payload.content).slice(0, 300) : undefined,
            timestamp: new Date().toISOString()
          })
        })
      });

      if (!ghRes.ok) {
        return new Response(JSON.stringify({ error: 'GitHub Issue comment failed' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const created = await ghRes.json();
      return new Response(JSON.stringify({ ok: true, commentId: created.id }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
