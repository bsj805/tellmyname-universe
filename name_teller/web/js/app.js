// web/js/app.js — 진입점. 각 모듈의 init(ctx)만 호출합니다.
import { bootstrap, emit, readRoute, parseFullName, randomEntry } from './core.js';
import * as card from './card.js';
import * as search from './search.js';
import * as chosung from './chosung.js';
import * as feed from './feed.js';
import * as share from './share.js';
import * as phoneticUi from './phonetic_ui.js';
import * as ranking from './ranking.js';
import * as match from './match.js';
import { applyTranslations } from './i18n.js';
import { NAMES_BY_KEY } from './phonetic_data.js';

const ctx = await bootstrap();
for (const m of [card, search, chosung, feed, share, phoneticUi, ranking, match]) await m.init(ctx);
applyTranslations();

// 메인 카드 아래 스폰서 광고 로드 요청
try {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
} catch (e) {}

// URL 쿼리 파라미터 (?a=김수현&b=전지현) 가 있으면 /match/ 로 자연스럽게 전달
const urlParams = new URLSearchParams(location.search);
if (urlParams.get('a') || urlParams.get('b')) {
  location.href = `/match/${location.search}`;
}

const route = readRoute();
if (route) {
  const lower = route.trim().toLowerCase();
  const foreignEntry = NAMES_BY_KEY ? NAMES_BY_KEY.get(lower) : null;
  if (foreignEntry && foreignEntry.matches && foreignEntry.matches.length > 0) {
    const topMatch = foreignEntry.matches[0];
    emit('name:show', {
      surname: '',
      given: topMatch.hangul,
      foreignOrigin: foreignEntry.name,
      foreignSound: foreignEntry.ipa,
      phoneticReason: topMatch.reason,
      allMatches: foreignEntry.matches
    });
  } else {
    emit('name:show', parseFullName(route, ctx.nameSet, ctx.surnameSet));
  }
} else {
  emit('name:show', { surname: '', given: randomEntry().name });
}
