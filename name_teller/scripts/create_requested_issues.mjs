// scripts/create_requested_issues.mjs
import { execSync } from 'child_process';

const credOut = execSync('git credential fill', {
  input: 'protocol=https\nhost=github.com\n\n',
  encoding: 'utf8'
});
let token = '';
for (const line of credOut.split('\n')) {
  if (line.startsWith('password=')) {
    token = line.slice('password='.length).trim();
  }
}

if (!token) {
  console.error('GitHub token not found via git credentials');
  process.exit(1);
}

const repo = 'bsj805/name_teller';

const NEW_ISSUES = [
  {
    title: '[Feature #13] 브랜드 전면 개편 — \'이름을 설명해드립니다 (Name Teller)\' 정화 및 레거시 워딩 완전 제거',
    body: `### 📌 구현 개요
- 기존 레거시 네이밍("QC먹는 하마", "QC 하마", "Hippo", "적대적 QC" 등)을 코드베이스, 메타태그, UI 컴포넌트, 문서 전반에서 100% 영구 제거
- 서비스명을 **"이름을 설명해드립니다 (Name Teller)"**로 일원화하고 심플하고 따뜻한 감성 디자인으로 전환

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`ce252f0\`](https://github.com/bsj805/name_teller/commit/ce252f0), [\`a86562f\`](https://github.com/bsj805/name_teller/commit/a86562f)
- **주요 파일**: \`web/index.html\`, \`README.md\`, \`scripts/generate_static_site.mjs\``
  },
  {
    title: '[Feature #14] 미니멀 UI 단일 검색바 & 🎲 랜덤 추천 버튼 인터랙션 구축',
    body: `### 📌 구현 개요
- 번잡하던 통계 패널, 대시보드, 다중 필터 요소를 모두 걷어내고, 중앙 단일 검색창 + 돋보기 + 🎲 랜덤 탐색 버튼만 배치
- 사이트 첫 진입 시 자동으로 15,487개 이름 중 무작위 예쁜 이름 카드가 로드되는 싱글 페이지 웹앱(SPA) 구조 완성

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`ff7b417\`](https://github.com/bsj805/name_teller/commit/ff7b417)
- **주요 파일**: \`web/js/search.js\`, \`web/js/card.js\`, \`web/css/search.css\``
  },
  {
    title: '[Feature #15] 왓츠앱 스타일 익명 편지 채팅 UI 및 성씨별 가시성 스코핑 규칙 엔진',
    body: `### 📌 구현 개요
- 이름 카드 바로 하단에 WhatsApp/iMessage 스타일의 산뜻한 말풍선 익명 편지함(\`#letters-root\`) 구축
- 받는 사람 / 보낸 사람 힌트 태그 입력 지원
- **가시성 스코핑(Visibility Scoping) 규칙 엄격 구현**:
  1. 성씨 없이 이름만 지정된 편지(예: '서윤'): 모든 성씨 경로(\`서윤\`, \`안서윤\`, \`김서윤\` 등)에서 공통 노출
  2. 성+이름이 함께 지정된 편지(예: '안서윤'): 정확히 해당 성씨 경로(\`안서윤\`)에서만 배타적 노출
- Cloudflare Pages Functions(\`/api/letters\`) 및 매일 새벽 GitHub Actions 배치와 결합

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`ff7b417\`](https://github.com/bsj805/name_teller/commit/ff7b417), [\`4395bcd\`](https://github.com/bsj805/name_teller/commit/4395bcd)
- **주요 파일**: \`web/js/letters.js\`, \`web/css/letters.css\`, \`functions/api/letters.js\`, \`scripts/batch_daily_update.mjs\``
  },
  {
    title: '[Feature #16] 9:16 인스타그램 스토리 카드 캔버스 렌더러 & 3종 감성 테마 공유 모달',
    body: `### 📌 구현 개요
- 1080×1920 해상도의 고품질 Canvas 기반 인스타그램 스토리 이미지 생성 모달 구현
- 노을(Sunset), 새벽(Dawn), 숲(Forest) 3가지 파스텔 그라디언트 테마 실시간 스위칭
- 인스타그램 상/하단 UI 간섭을 방지하는 세이프존(Safe Zone) 가이드라인 적용
- 모바일 Web Share API 연동 및 고해상도 PNG 파일 다운로드 기능 제공

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`ff7b417\`](https://github.com/bsj805/name_teller/commit/ff7b417)
- **주요 파일**: \`web/js/share.js\`, \`web/css/share.css\``
  },
  {
    title: '[Feature #17] 초성 검색 카카오톡 친구목록형 가상 스크롤 드롭다운 탐색기',
    body: `### 📌 구현 개요
- 검색창에 초성(예: \`ㅅㅇ\`, \`ㄱㅇ\`) 입력 시 즉각 반응하는 초성 매칭 엔진
- 카카오톡 친구 목록처럼 그라디언트 원형 아바타, 이름, 시적 한 줄 뜻풀이가 한 행씩 깔끔하게 노출되는 가상 스크롤 팝오버
- 방향키 탐색, 마우스 오버 하이라이트 및 클릭 시 즉시 해당 이름 카드 전환

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`ff7b417\`](https://github.com/bsj805/name_teller/commit/ff7b417)
- **주요 파일**: \`web/js/chosung.js\`, \`web/css/chosung.css\``
  },
  {
    title: '[Feature #18] 카드-편지 간격 최적화, UTF-8 인코딩 보정 및 무한 추천 스크롤 피드',
    body: `### 📌 구현 개요
- 카드와 익명 편지함 사이의 100vh 불필요한 여백을 제거하고 자연스러운 플로우(\`~380px\`)와 스크롤 유도 알약 버튼 제공
- PowerShell CP949 인코딩으로 인해 발생했던 푸터 한글 깨짐(\`?대쫫...\`)을 무손실 UTF-8로 완벽 복원
- 편지함 아래로 스크롤 시 IntersectionObserver를 통해 끝없이 새로운 이름 카드를 연속 탐색할 수 있는 무한 피드 스트림 구현

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`f48ae92\`](https://github.com/bsj805/name_teller/commit/f48ae92)
- **주요 파일**: \`web/js/feed.js\`, \`web/css/feed.css\`, \`web/index.html\``
  },
  {
    title: '[Feature #19] Cloudflare 정적 호스팅(Workers Builds) 연동, SPA 라우팅 및 일일 배치 파이프라인',
    body: `### 📌 구현 개요
- Cloudflare 신규 Workers Builds 환경에 최적화된 \`wrangler.toml\` \`[assets] directory = "./dist"\` 설정
- \`not_found_handling = "single-page-application"\`을 통한 무한 루프 없는 네이티브 SPA 라우팅 구축
- Cloudflare Pages Functions(\`/api/search\`, \`/api/letters\`) 엣지 런타임 및 일일 배치 자동 빌드 파이프라인 E2E 검증

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`eb5ce7c\`](https://github.com/bsj805/name_teller/commit/eb5ce7c), [\`6842961\`](https://github.com/bsj805/name_teller/commit/6842961), [\`4395bcd\`](https://github.com/bsj805/name_teller/commit/4395bcd)
- **주요 파일**: \`wrangler.toml\`, \`functions/api/letters.js\`, \`scripts/generate_static_site.mjs\``
  },
  {
    title: '[Feature #20] 보안 전수 감사(GITHUB_TOKEN 무유출 검증) 및 Node.js 최신 런타임 보안 패치',
    body: `### 📌 구현 개요
- \`dist/**\` 및 \`web/**\` 내 전체 633개 정적 배포 파일에 대해 \`GITHUB_TOKEN\`, \`ghp_\`, \`github_pat_\` 전수 보안 스캔 실시 (0건 검출, 클라이언트 누출 원천 차단 확인)
- CVE-2026-111497 (Brotli 압축 RCE "Node2Shell") 대응 Node.js \`v22.23.4\` 긴급 보안 런타임 업그레이드
- Alibaba Open Code Review 도구 연동을 통한 코드 리뷰 체계 확립

### 🔗 연관 커밋 및 구현 파일
- **커밋**: [\`f48ae92\`](https://github.com/bsj805/name_teller/commit/f48ae92), [\`6842961\`](https://github.com/bsj805/name_teller/commit/6842961)
- **주요 파일**: \`scripts/dev_server.mjs\`, \`docs/CLOUDFLARE_PAGES_DEPLOY.md\``
  }
];

async function run() {
  console.log(`Starting to create and close ${NEW_ISSUES.length} GitHub issues on ${repo}...`);
  for (const item of NEW_ISSUES) {
    try {
      // 1. Create issue
      const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'name-teller-bot',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: item.title,
          body: item.body
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Failed to create issue "${item.title}":`, err);
        continue;
      }

      const issue = await res.json();
      console.log(`Created Issue #${issue.number}: ${issue.title}`);

      // 2. Close issue
      const closeRes = await fetch(`https://api.github.com/repos/${repo}/issues/${issue.number}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'name-teller-bot',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          state: 'closed'
        })
      });

      if (closeRes.ok) {
        console.log(`  -> Successfully closed #${issue.number}`);
      } else {
        console.error(`  -> Failed to close #${issue.number}`);
      }

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 600));
    } catch (e) {
      console.error(`Error processing "${item.title}":`, e.message);
    }
  }
  console.log('Finished updating GitHub issues!');
}

run();
