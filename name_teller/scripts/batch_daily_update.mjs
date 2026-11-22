// scripts/batch_daily_update.mjs
// 일일 배치 실행 스크립트:
// 1. GitHub Issue 코멘트에 적재된 익명 편지(type: letter)와 검색 큐(type: search)를 수집합니다.
// 2. 익명 편지를 data/messages/YYYY-MM-DD.json 파일에 {id, hangulName, surname, recipientHint, senderHint, content, createdAt} 형식으로 추가합니다.
// 3. 365일 이내의 편지만 유지하여 data/serving_messages_365d.json을 재구축하고, 만료된 파일은 정리합니다.
// 4. 기존 데이터베이스에 없는 신규 검색 이름은 data/searched_names_queue.json에 큐잉합니다.

import fs from 'fs';
import path from 'path';
import { runGeminiNamePipeline, runGeminiForeignNamePipeline } from './gemini_name_generator.mjs';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const messagesDir = path.join(dataDir, 'messages');
const queueFile = path.join(dataDir, 'searched_names_queue.json');
const foreignQueueFile = path.join(dataDir, 'searched_foreign_queue.json');
const RETENTION_DAYS = 365;

if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

function isValidKoreanName(name) {
  const trimmed = (name || '').trim();
  return /^[가-힣]{1,5}$/.test(trimmed);
}

function extractJsonPayload(body) {
  if (!body || typeof body !== 'string') return null;
  const trimmed = body.trim();
  // Check for markdown code fences ```json ... ``` or ``` ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const target = fenceMatch ? fenceMatch[1].trim() : trimmed;
  if (target.startsWith('{') && target.endsWith('}')) {
    try {
      return JSON.parse(target);
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchGithubIssueComments(repo, issueNumber, token) {
  if (process.env.MOCK_GITHUB_COMMENTS) {
    try {
      return JSON.parse(process.env.MOCK_GITHUB_COMMENTS);
    } catch (e) {
      console.warn('[Daily Batch] Failed to parse MOCK_GITHUB_COMMENTS:', e.message);
      return [];
    }
  }
  if (!token || !issueNumber) return [];
  const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments?per_page=100`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'name-teller-batch'
      }
    });
    if (!res.ok) {
      console.warn(`[Daily Batch] GitHub API returned ${res.status}: ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Daily Batch] Failed to fetch comments:`, err.message);
    return [];
  }
}

async function deleteGithubIssueComment(repo, commentId, token) {
  if (!token || !commentId) return false;
  const url = `https://api.github.com/repos/${repo}/issues/comments/${commentId}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'name-teller-batch'
      }
    });
    if (!res.ok) {
      console.warn(`[Daily Batch] Failed to delete comment #${commentId}: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Daily Batch] Error deleting comment #${commentId}:`, err.message);
    return false;
  }
}

async function runDailyBatch() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const repo = process.env.GITHUB_REPO || process.env.GITHUB_REPOSITORY || 'bsj805/name_teller';
  const token = process.env.GITHUB_TOKEN || '';
  const queueIssueNum = process.env.QUEUE_ISSUE_NUMBER || '7';

  // 1. 기존 알려진 이름 셋 로드 (data/compact_serving_names.json)
  const knownNamesSet = new Set();
  const compactNamesPath = path.join(dataDir, 'compact_serving_names.json');
  if (fs.existsSync(compactNamesPath)) {
    try {
      const rows = JSON.parse(fs.readFileSync(compactNamesPath, 'utf8'));
      for (const r of rows) {
        if (Array.isArray(r) && r[0]) knownNamesSet.add(r[0]);
      }
    } catch {}
  }

  // 2. 미등록 검색 이름 큐 로드 (data/searched_names_queue.json & data/searched_foreign_queue.json)
  let searchQueue = [];
  if (fs.existsSync(queueFile)) {
    try {
      searchQueue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    } catch {}
  }
  const queueIndexMap = new Map();
  searchQueue.forEach((item, idx) => {
    const name = typeof item === 'string' ? item : item.name;
    if (name) queueIndexMap.set(name, idx);
  });

  let foreignSearchQueue = [];
  if (fs.existsSync(foreignQueueFile)) {
    try {
      foreignSearchQueue = JSON.parse(fs.readFileSync(foreignQueueFile, 'utf8'));
    } catch {}
  }
  const foreignQueueIndexMap = new Map();
  foreignSearchQueue.forEach((item, idx) => {
    const name = typeof item === 'string' ? item : item.name;
    if (name) foreignQueueIndexMap.set(name.toLowerCase(), idx);
  });

  // 기존 큐레이션 외국어 이름 셋 로드
  const knownForeignNamesSet = new Set();
  const curatedJsonPath = path.join(dataDir, 'curated_foreign_names.json');
  if (fs.existsSync(curatedJsonPath)) {
    try {
      const list = JSON.parse(fs.readFileSync(curatedJsonPath, 'utf8'));
      for (const item of list) {
        if (item.name) knownForeignNamesSet.add(item.name.toLowerCase());
      }
    } catch {}
  }

  const lettersByDate = new Map();
  const processedCommentIds = [];
  let fetchedLettersCount = 0;
  let newSearchesQueued = 0;
  let newForeignQueued = 0;

  if (token && queueIssueNum) {
    console.log(`[Daily Batch] Fetching comments from GitHub issue #${queueIssueNum} (${repo})...`);
    const comments = await fetchGithubIssueComments(repo, queueIssueNum, token);

    for (const c of comments) {
      const payload = extractJsonPayload(c.body);
      if (!payload) continue;

      let isHandled = false;
      const pType = (payload.type || '').toLowerCase();

      // Letter payload
      if (pType === 'letter' || pType === 'anon_message') {
        const hangulName = String(payload.hangulName || '').trim();
        const content = String(payload.content || '').trim();
        if (isValidKoreanName(hangulName) && content.length > 0) {
          const createdAt = payload.createdAt || c.created_at || new Date().toISOString();
          const dateKey = createdAt.slice(0, 10);
          const letter = {
            id: `gh_${c.id}`,
            hangulName,
            surname: String(payload.surname || '').trim(),
            recipientHint: String(payload.recipientHint || '').trim().slice(0, 20),
            senderHint: String(payload.senderHint || payload.senderNickname || '').trim().slice(0, 20),
            content: content.slice(0, 300),
            createdAt
          };

          if (!lettersByDate.has(dateKey)) lettersByDate.set(dateKey, []);
          lettersByDate.get(dateKey).push(letter);
          fetchedLettersCount++;
          isHandled = true;
        }
      }

      // Search payload (한국어)
      if (pType === 'search' || pType === 'search_name') {
        const name = String(payload.name || payload.hangulName || '').trim();
        if (isValidKoreanName(name)) {
          // If unseen in known names database
          if (!knownNamesSet.has(name)) {
            if (queueIndexMap.has(name)) {
              const idx = queueIndexMap.get(name);
              if (typeof searchQueue[idx] === 'object') {
                searchQueue[idx].count = (searchQueue[idx].count || 1) + 1;
                searchQueue[idx].lastSearchedAt = new Date().toISOString();
              }
            } else {
              searchQueue.push({
                name,
                count: 1,
                firstSearchedAt: new Date().toISOString(),
                lastSearchedAt: new Date().toISOString()
              });
              queueIndexMap.set(name, searchQueue.length - 1);
              newSearchesQueued++;
            }
          }
          isHandled = true;
        }
      }

      // Foreign search payload (외국어 이름 큐잉)
      if (pType === 'search_foreign' || (pType === 'search' && !isValidKoreanName(payload.name))) {
        const foreignName = String(payload.name || '').trim();
        const lang = String(payload.lang || 'auto').trim();
        if (/^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF\s'.-]{1,30}$/.test(foreignName)) {
          const normKey = foreignName.toLowerCase();
          if (!knownForeignNamesSet.has(normKey)) {
            if (foreignQueueIndexMap.has(normKey)) {
              const idx = foreignQueueIndexMap.get(normKey);
              if (typeof foreignSearchQueue[idx] === 'object') {
                foreignSearchQueue[idx].count = (foreignSearchQueue[idx].count || 1) + 1;
                foreignSearchQueue[idx].lastSearchedAt = new Date().toISOString();
              }
            } else {
              foreignSearchQueue.push({
                name: foreignName,
                lang: lang || 'auto',
                count: 1,
                firstSearchedAt: new Date().toISOString(),
                lastSearchedAt: new Date().toISOString()
              });
              foreignQueueIndexMap.set(normKey, foreignSearchQueue.length - 1);
              newForeignQueued++;
            }
          }
          isHandled = true;
        }
      }

      if (isHandled && c.id) {
        processedCommentIds.push(c.id);
      }
    }
  } else {
    console.log(`[Daily Batch] No GITHUB_TOKEN or QUEUE_ISSUE_NUMBER found; skipping remote comment fetch.`);
  }

  // 3. 편지들을 data/messages/YYYY-MM-DD.json 파일에 저장
  for (const [dateKey, letters] of lettersByDate.entries()) {
    const filePath = path.join(messagesDir, `${dateKey}.json`);
    let dateMessages = [];
    if (fs.existsSync(filePath)) {
      try {
        dateMessages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {}
    }
    const existingIds = new Set(dateMessages.map(m => m.id));
    for (const letter of letters) {
      if (!existingIds.has(letter.id)) {
        dateMessages.push(letter);
        existingIds.add(letter.id);
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(dateMessages, null, 2), 'utf8');
  }

  // 4. 365일 보관주기(Retention) 적용 & data/serving_messages_365d.json 재구축
  const nowMs = Date.now();
  const maxAgeMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(nowMs - maxAgeMs).toISOString().slice(0, 10);
  const messageFiles = fs.readdirSync(messagesDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().reverse();

  const all365Messages = [];
  let prunedFiles = 0;

  for (const file of messageFiles) {
    const datePart = file.replace('.json', '');
    const fullPath = path.join(messagesDir, file);

    if (datePart < cutoffDate) {
      fs.unlinkSync(fullPath);
      prunedFiles++;
    } else {
      try {
        const list = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const standardized = list.map(m => ({
          id: m.id,
          hangulName: m.hangulName,
          surname: m.surname || '',
          recipientHint: m.recipientHint || '',
          senderHint: m.senderHint || m.senderNickname || '',
          content: m.content || '',
          createdAt: m.createdAt || datePart
        }));
        all365Messages.push(...standardized);
      } catch (e) {
        console.warn(`[Daily Batch] Error reading ${file}:`, e.message);
      }
    }
  }

  // 최신 순 정렬
  all365Messages.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  fs.writeFileSync(
    path.join(dataDir, 'serving_messages_365d.json'),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        retentionDays: RETENTION_DAYS,
        totalMessages: all365Messages.length,
        messages: all365Messages
      },
      null,
      2
    ),
    'utf8'
  );

  // 5. 큐 파일들 저장 (한국어 및 외국어 검색 큐)
  fs.writeFileSync(queueFile, JSON.stringify(searchQueue, null, 2), 'utf8');
  fs.writeFileSync(foreignQueueFile, JSON.stringify(foreignSearchQueue, null, 2), 'utf8');

  // 6. Gemini AI 파이프라인: 미등록 한국어 및 외국어 이름에 대해 최적 한자 및 발음 매칭 생성 후 DB 축적
  try {
    await runGeminiNamePipeline();
  } catch (err) {
    console.warn(`[Daily Batch] Gemini Korean pipeline error:`, err.message);
  }

  try {
    await runGeminiForeignNamePipeline();
  } catch (err) {
    console.warn(`[Daily Batch] Gemini Foreign pipeline error:`, err.message);
  }

  // 7. 자율 발굴 봇 (Autonomous Discovery Bot):
  // 사용자 검색 유입이 없더라도 미등록 후보 풀에서 매일 50개씩 스스로 발굴하여 DB에 자동 적재
  try {
    const { bulkIngestNames } = await import('./bulk_ingest_names.mjs');
    await bulkIngestNames(50);
  } catch (err) {
    console.warn(`[Daily Batch] Autonomous candidate discovery error:`, err.message);
  }

  // 7. 처리 완료된 GitHub Issue 코멘트 정리(삭제)
  let deletedCommentsCount = 0;
  if (token && processedCommentIds.length > 0) {
    console.log(`[Daily Batch] Cleaning up ${processedCommentIds.length} processed comments from issue #${queueIssueNum}...`);
    for (const commentId of processedCommentIds) {
      const ok = await deleteGithubIssueComment(repo, commentId, token);
      if (ok) deletedCommentsCount++;
    }
  }

  console.log(`[Daily Batch] Completed successfully:`);
  console.log(`  - Fetched letters from Issue: ${fetchedLettersCount}`);
  console.log(`  - Active 365d messages: ${all365Messages.length} (pruned ${prunedFiles} old files)`);
  console.log(`  - Korean search queue: ${searchQueue.length} (new queued: ${newSearchesQueued})`);
  console.log(`  - Foreign search queue: ${foreignSearchQueue.length} (new queued: ${newForeignQueued})`);
  console.log(`  - Deleted processed comments: ${deletedCommentsCount}/${processedCommentIds.length}`);
}

runDailyBatch();
