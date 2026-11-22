// scripts/sync_github_issues.mjs
// GitHub 저장소(bsj805/name_teller)에 전체 구현 기능 이슈들을 생성하고 닫아주며(Close),
// 웹사이트 내 실시간 검색 이름(최대 5자) 및 일별 익명 편지 수집용 오픈 큐 이슈를 생성합니다.

import fs from 'fs';

const token = process.env.GITHUB_TOKEN;
const repo = 'bsj805/name_teller';

const html = fs.readFileSync('C:/Users/USER/Downloads/qc_v2_0_ui.html', 'utf8');
const s = html.indexOf('const INITIAL_GITHUB_ISSUES = [');
const e = html.indexOf('const ADR_DECISIONS = [', s);
const coreIssues = new Function(html.slice(s, e) + '; return INITIAL_GITHUB_ISSUES;')();

const COMPLETED_ISSUES = [
  ...coreIssues.map(item => ({
    title: item.title,
    body: `${item.summary}\n\n- **구현 파일**: \`${item.implementedFile}\`\n- **커밋**: \`${item.commitHash}\``
  })),
  {
    title: '[Feat #1] 대규모 한글 이름 데이터베이스 구축 (시집·문학 2~3글자 시어 + 인명용 한자 + 통계청 7,232선)',
    body: `### 구현 내용
- 나무위키·위키데이터·대법원·통계청 인명 통계 데이터와 한국 현대시집/문학작품(윤동주, 김소월, 정지용, 백석, 나태주 등)에서 조사(\`은/는/이/가/을/를\` 등)를 제거한 2~3글자 시어 어휘를 결합해 총 **7,232개** 정적 서빙 이름 DB 구축 완료
- 정적 HTML 서빙을 위한 \`data/serving_names_db.json\`, \`data/compact_serving_names.json\`, \`data/poetic_literature_words.json\` 생성 완료
- 구현 파일: \`scripts/build_expanded_names_dataset.mjs\`, \`data/serving_names_db.json\``
  },
  {
    title: '[Feat #2] 인스타그램 릴스/피드형 상하 스냅 스크롤 탐색 & 랜덤 이름 추천 무한 스크롤 피드 구현',
    body: `### 구현 내용
- 인스타그램 릴스처럼 세게 스크롤(플릭)하면 다음 이름과 한자·시적 뜻풀이 카드로 자연스럽게 넘어가는 CSS Scroll Snap(\`scroll-snap-type: y mandatory\`) 피드 구현
- **🎲 랜덤 이름 추천 스크롤 모드**를 통해 시집 시어·예쁜 아기 이름·인명용 한자 이름을 연속 스크롤하며 탐색하고 즉시 해당 이름의 편지함으로 이동 가능
- 구현 파일: \`qc_v2_0_ui.html\`, \`scripts/generate_static_site.mjs\``
  },
  {
    title: '[Feat #3] 호기심 유발형(6~7자 말줄임) SEO 메타태그 & URL 이름 슬러그 정적 HTML 생성',
    body: `### 구현 내용
- URL에 이름이 직접 포함되는 구조(\`/name/[이름]/index.html\` 및 \`?name=[이름]\`) 적용
- 검색엔진 결과(SERP)에서 이름 뜻 설명이 **6~7자에서 잘려(\`...\`)** 보이도록 티저 스니펫을 구성해 클릭률(CTR) 및 호기심 극대화
- 핵심 타겟 키워드(**이쁜 아기 이름 추천, 이름 뜻 확인하기, 익명편지함**)를 \`<title>\`, \`<meta name="description">\`, OpenGraph, JSON-LD 구조화 데이터에 전면 배치
- \`sitemap.xml\`, \`rss.xml\`, \`robots.txt\` 자동 생성기 구축
- 구현 파일: \`scripts/generate_static_site.mjs\`, \`src/app/name/[name]/page.tsx\``
  },
  {
    title: '[Feat #4] 365일 보관주기 일별 파일 기반 익명편지함 & 사진 없는 가벼운 채팅형 UI 구현',
    body: `### 구현 내용
- 하루 동안 들어온 익명 편지를 \`data/messages/YYYY-MM-DD.json\` 파일로 모아서 저장하고, 매일 12시 배치 배포 시 오늘로부터 **365일(1년) 전까지의 파일**에 들어있는 편지들만 각 이름에 표시(\`data/serving_messages_365d.json\`)
- 특정 이름에 편지를 남길 때 사진/파일 첨부 없이 **채팅 형식(말풍선 UI)**으로 가볍고 빠르게 남길 수 있도록 개편
- 구현 파일: \`scripts/batch_daily_update.mjs\`, \`data/messages/2026-10-24.json\`, \`qc_v2_0_ui.html\``
  },
  {
    title: '[Feat #5] 서버 유지비 0원 정적 HTML 호스팅 아키텍처 & 매일 12시 GitHub Actions 자동 배치 파이프라인',
    body: `### 구현 내용
- 서버 유지비 0원으로 구글·네이버 검색엔진 노출을 극대화할 수 있는 정적 HTML 빌드(\`dist/\`) 및 Cloudflare Pages / GitHub Pages / Vercel 정적 배포 아키텍처 수립
- 매일 12시(KST) GitHub Actions 크론(\`.github/workflows/daily_batch_deploy.yml\`)이 일별 편지 병합(365일 보관) 및 신규 검색 이름 뜻풀이 생성 후 정적 HTML 자동 재배포
- 구현 파일: \`.github/workflows/daily_batch_deploy.yml\`, \`scripts/generate_static_site.mjs\``
  },
  {
    title: '[Feat #6] 웹사이트 내 검색 이름(최대 5자 제한) GitHub Issue 코멘트 자동 적재 & 이름별 채팅 편지 연동',
    body: `### 구현 내용
- 웹사이트 내 이름 검색 입력 한계를 **최대 5자(1~5자 한글)**로 설정하고 모든 검색된 이름별로 즉시 채팅형 익명 편지를 남길 수 있도록 구현
- 방문자가 검색한 미등록 이름이나 작성한 익명 편지를 GitHub Issue 코멘트로 자동 적재하는 브릿지 모듈 및 일일 배치 파서 구현
- 구현 파일: \`scripts/batch_daily_update.mjs\`, \`scripts/cloudflare-worker-github-bridge.js\`, \`qc_v2_0_ui.html\``
  }
];

async function api(pathUrl, method = 'GET', bodyObj = null) {
  const res = await fetch(`https://api.github.com/repos/${repo}${pathUrl}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'name-teller-setup'
    },
    body: bodyObj ? JSON.stringify(bodyObj) : undefined
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${errText}`);
  }
  return await res.json();
}

async function main() {
  const existing = await api('/issues?state=all&per_page=100');
  const existingTitles = new Set(existing.map(i => i.title));

  for (const item of COMPLETED_ISSUES) {
    let issue = existing.find(i => i.title === item.title);
    if (!issue) {
      issue = await api('/issues', 'POST', {
        title: item.title,
        body: item.body
      });
      console.log(`Created issue #${issue.number}: ${issue.title}`);
    }
    if (issue.state !== 'closed') {
      await api(`/issues/${issue.number}`, 'PATCH', {
        state: 'closed',
        state_reason: 'completed'
      });
      console.log(`Closed issue #${issue.number}`);
    }
  }

  // 실시간 검색 이름(최대 5자) 및 일별 익명 편지 수집용 전용 이슈 생성 (이슈 코멘트 적재용)
  const queueTitle = '[QUEUE] 웹사이트 실시간 검색 이름(최대 5자) & 일별 익명편지 수집 허브';
  let queueIssue = existing.find(i => i.title === queueTitle);
  if (!queueIssue) {
    queueIssue = await api('/issues', 'POST', {
      title: queueTitle,
      body: `## 📥 웹사이트 검색 이름(최대 5자) & 일별 익명편지 자동 수집 이슈\n\n이 이슈의 코멘트로 웹사이트 방문자가 검색한 이름(최대 5자)과 채팅형 익명 편지가 JSON 포맷으로 쌓입니다.\n매일 12시 배치 스크립트(\`scripts/batch_daily_update.mjs\`)가 이 이슈의 코멘트를 읽어:\n1. 새로운 이름의 한자·시적 뜻풀이를 생성해 \`data/serving_names_db.json\`에 추가하고,\n2. 하루 동안 들어온 익명 편지를 \`data/messages/YYYY-MM-DD.json\` 파일로 저장(보관주기 365일)한 뒤 정적 HTML을 재배포합니다.`
    });
    console.log(`Created Queue Issue #${queueIssue.number}: ${queueIssue.title}`);
    // 샘플 검색 이름 코멘트 1건 등록
    await api(`/issues/${queueIssue.number}/comments`, 'POST', {
      body: JSON.stringify({
        type: 'SEARCH_NAME',
        hangulName: '윤슬비',
        timestamp: new Date().toISOString(),
        note: '웹사이트 검색창(최대 5자) 유입 이름 자동 기록 샘플'
      })
    });
  } else {
    console.log(`Queue Issue already exists: #${queueIssue.number}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
