// web/js/core.js — 공용 코어 (데이터 로딩 · 이름 파싱 · 이벤트 버스 · 라우팅)
// 모든 기능 모듈(card / search / chosung / letters / share)은 이 파일의 API만 사용합니다.
// ⚠️ 이 파일의 export 시그니처는 변경하지 마세요(추가는 가능).

const cache = {};
async function getJson(url) {
  if (!cache[url]) cache[url] = fetch(url).then(r => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
  return cache[url];
}

/** 이름 목록: [{ name, cho, hanja, altHanja, meaning, gender, category }] */
export async function loadNames() {
  const rows = await getJson('/data/names.json');
  return rows.map(r => ({ name: r[0], cho: r[1], hanja: r[2], altHanja: r[3], meaning: r[4], gender: r[5], category: r[6] }));
}
/** 음절별 인명용 한자: { "가": { hanja, meaning, sym, variants:[{hanja, meaning, sym}] } } */
export const loadHanja = () => getJson('/data/hanja.json');
/** 성씨: [{ surname, hanja, meaning, isTwoSyllable }] */
export const loadSurnames = () => getJson('/data/surnames.json');
/** 편지(365일): { messages:[{ id, hangulName, surname, recipientHint, senderHint, content, createdAt }] } */
export const loadLetters = () => getJson('/data/letters.json').catch(() => ({ messages: [] }));

// ---------- 이벤트 버스 ----------
const handlers = {};
export function on(evt, fn) { (handlers[evt] ||= []).push(fn); }
export function emit(evt, payload) { (handlers[evt] || []).forEach(fn => fn(payload)); }
// 이벤트 목록:
//  'name:show'   { surname: ''|'김', given: '서윤' }  → 카드/편지/공유가 해당 이름으로 갱신
//  'share:open'  { surname, given, entry }            → 공유 모달 오픈
//  'search:chosung' { query }                          → 초성 리스트 표시

// ---------- 한글 유틸 ----------
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export function toChosung(str) {
  return [...str].map(ch => {
    const c = ch.charCodeAt(0) - 0xAC00;
    return c >= 0 && c <= 11171 ? CHO[Math.floor(c / 588)] : ch;
  }).join('');
}
export const isChosungOnly = s => /^[ㄱ-ㅎ]+$/.test(s);
export const isHangul = s => /^[가-힣]{1,6}$/.test(s);

const CHO_ROMAN = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG_ROMAN = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const JONG_ROMAN = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'bs', 's', 'ss', 'ng', 't', 't', 'k', 't', 'p', 'h'];

const CHO_IPA = ['k', 'k͈', 'n', 't', 't͈', 'ɾ', 'm', 'p', 'p͈', 'sʰ', 's͈', '', 'tɕ', 't͈ɕ', 'tɕʰ', 'kʰ', 'tʰ', 'pʰ', 'h'];
const JUNG_IPA = ['a', 'ɛ', 'ja', 'jɛ', 'ʌ̹', 'e', 'jʌ̹', 'je', 'o', 'wa', 'wɛ', 'ø', 'jo', 'u', 'wʌ̹', 'we', 'ɥi', 'ju', 'ɯ', 'ɰi', 'i'];
const JONG_IPA = ['', 'k̚', 'k̚', 'k̚', 'n', 'n', 'n', 't̚', 'l', 'k̚', 'm', 'p̚', 't̚', 't̚', 'p̚', 'l', 'm', 'p̚', 'p̚', 't̚', 't̚', 'ŋ', 't̚', 't̚', 'k̚', 't̚', 'p̚', 'p̚'];

export function hangulToRoman(name) {
  const parts = [];
  for (let i = 0; i < (name || '').length; i++) {
    const code = name.charCodeAt(i) - 0xAC00;
    if (code < 0 || code > 11171) { parts.push(name[i]); continue; }
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;
    parts.push(CHO_ROMAN[cho] + JUNG_ROMAN[jung] + JONG_ROMAN[jong]);
  }
  return parts.map((p, idx) => idx === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.toLowerCase()).join('-');
}

export function hangulToIpa(name) {
  const parts = [];
  for (let i = 0; i < (name || '').length; i++) {
    const code = name.charCodeAt(i) - 0xAC00;
    if (code < 0 || code > 11171) { parts.push(name[i]); continue; }
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;
    parts.push((CHO_IPA[cho] || '') + (JUNG_IPA[jung] || '') + (JONG_IPA[jong] || ''));
  }
  return parts.join('.');
}

/**
 * 성+이름 분리. names: Set<string> (보유 이름), surnames: Set<string>
 * '서윤' → {surname:'', given:'서윤'} / '안서윤' → {surname:'안', given:'서윤'} / '남궁서윤' → {surname:'남궁', given:'서윤'}
 */
export function parseFullName(input, names, surnames) {
  const s = (input || '').trim();
  if (names.has(s)) return { surname: '', given: s };
  for (const len of [2, 1]) {
    const sur = s.slice(0, len), given = s.slice(len);
    if (surnames.has(sur) && given.length >= 1 && names.has(given)) return { surname: sur, given };
  }
  for (const len of [2, 1]) {
    const sur = s.slice(0, len), given = s.slice(len);
    if (surnames.has(sur) && given.length >= 1) return { surname: sur, given };
  }
  return { surname: '', given: s };
}

/** 음절별 한자 풀이 생성 (순우리말 음절은 이상한 한자 대입 없이 순우리말로 온전히 보존) */
export function explainSyllables(entry, hanjaMap) {
  const nameChars = [...(entry.name || '')];
  const hanjaChars = [...(entry.hanja || '')];
  const is1to1 = (hanjaChars.length === nameChars.length && hanjaChars.length > 0);

  return nameChars.map((syl, i) => {
    const info = hanjaMap[syl] || null;
    let hj = '';

    if (is1to1) {
      hj = hanjaChars[i];
    } else if (info && info.hanja && hanjaChars.length > 0) {
      // 1:1 대응이 아닌 경우(예: 일부 음절만 한자 표기), 해당 음절의 공식 한자 변체에 포함될 때만 매칭
      const match = hanjaChars.find(c => (info.variants || []).some(v => v.hanja === c) || info.hanja === c);
      hj = match || '';
    }

    if (!hj) {
      // 한자가 없는 순우리말 음절 (꽃, 마음, 별, 솔, 빛 등)
      return {
        hangul: syl,
        hanja: '',
        meaning: '순우리말',
        sym: `${syl}의 고유하고 맑은 순우리말 기운`
      };
    }

    const variant = info ? (info.variants || []).find(v => v.hanja === hj) : null;
    return {
      hangul: syl,
      hanja: hj,
      meaning: (variant || info)?.meaning || '',
      sym: (variant || info)?.sym || ''
    };
  });
}

// ---------- 라우팅 (단일 페이지) ----------
// URL 형태: /  (랜덤) · /name/김서윤 · /?n=김서윤
export function readRoute() {
  const m = decodeURIComponent(location.pathname).match(/^\/name\/([^/]+)/);
  if (m) return m[1];
  return new URLSearchParams(location.search).get('n') || '';
}
export function writeRoute(fullName) {
  const url = fullName ? '/name/' + encodeURIComponent(fullName) : '/';
  if (location.pathname + location.search !== url) history.replaceState(null, '', url);
  document.title = fullName ? `${fullName} 이름 뜻 | 이름을 설명해드립니다` : '이름을 설명해드립니다';
}

export const ctx = { names: [], nameSet: new Set(), byName: new Map(), hanja: {}, surnames: [], surnameSet: new Set(), current: null };

export async function bootstrap() {
  const [names, hanja, surnames] = await Promise.all([loadNames(), loadHanja(), loadSurnames()]);
  ctx.names = names;
  ctx.hanja = hanja;
  ctx.surnames = surnames;
  ctx.surnameSet = new Set(surnames.map(s => s.surname));
  for (const n of names) { if (!ctx.byName.has(n.name)) ctx.byName.set(n.name, []); ctx.byName.get(n.name).push(n); }
  ctx.nameSet = new Set(ctx.byName.keys());
  on('name:show', p => { ctx.current = p; writeRoute((p.surname || '') + p.given); });
  return ctx;
}
export const randomEntry = () => ctx.names[Math.floor(Math.random() * ctx.names.length)];
export const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
