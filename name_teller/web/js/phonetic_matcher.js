// web/js/phonetic_matcher.js — 외국인 이름을 위한 발음 유사 한글 이름 탐색 알고리즘 엔진
// 1) 500+ Curated Global Top Names Direct Database 연동
// 2) G2P (Grapheme-to-Phoneme) 음소 변환기 (Latin, Cyrillic, Kana, Diacritics)
// 3) 음절 초성·중성·종성 분해 기반 음향 유사도 랭킹 & 국립국어원 표준 로마자 표기

import { CURATED_NAMES, NAMES_BY_KEY } from './phonetic_data.js';

// ==========================================
// 1. 키릴 문자 & 일본어 가나 변환 사전
// ==========================================
const CYRILLIC_MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
  'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
  'у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y',
  'ь':'','э':'e','ю':'yu','я':'ya'
};

const KANA_MAP = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','의':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  // 카타카나
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po'
};

/**
 * 사용자 입력 문자열 정규화:
 * 1. 키릴 문자 -> 라틴 알파벳
 * 2. 일본어 가나 -> 헵번식 로마자
 * 3. 악센트 및 발음 구별 부호(é, è, ô, ã, ü, đ 등) 분리 및 제거
 * 4. 알파벳, 공백, 하이픈만 유지
 */
export function normalizeForeignName(rawInput) {
  if (!rawInput) return '';
  let s = String(rawInput).trim().toLowerCase();

  // 일본어 가나 변환
  let kanaConverted = '';
  for (const ch of s) {
    kanaConverted += KANA_MAP[ch] || ch;
  }
  s = kanaConverted;

  // 키릴 문자 변환
  s = s.replace(/[\u0400-\u04FF]/g, c => CYRILLIC_MAP[c] || c);

  // 라틴 발음 기호 정규화 (NFD 분해 후 diacritics 제거)
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 특수 문자 매핑
  s = s.replace(/ß/g, 'ss')
       .replace(/æ/g, 'ae')
       .replace(/œ/g, 'oe')
       .replace(/ø/g, 'o')
       .replace(/ł/g, 'l')
       .replace(/đ/g, 'd');

  // 알파벳, 하이픈, 공백만 남기고 정리
  s = s.replace(/[^a-z\s-]/g, '').replace(/\s+/g, ' ').trim();
  return s;
}

// ==========================================
// 2. 한글 음절 조합 및 Revised Romanization
// ==========================================
export const CHO_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export const JUNG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
export const JONG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const CHO_RR = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG_RR = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG_RR = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','t','m','p','p','t','t','ng','t','t','k','t','p','t'];

export function hangulToRoman(hangul) {
  if (!hangul) return '';
  const syllables = [...hangul].map(ch => {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return ch;
    const c = Math.floor(code / 588);
    const j = Math.floor((code % 588) / 28);
    const t = code % 28;
    return CHO_RR[c] + JUNG_RR[j] + JONG_RR[t];
  });
  if (syllables.length === 0) return '';
  return syllables.map((s, idx) => idx === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.toLowerCase()).join('-');
}

export function decomposeHangul(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null;
  return [
    Math.floor(code / 588),
    Math.floor((code % 588) / 28),
    code % 28
  ];
}

function makeHangul(cho, jung, jong = '') {
  const c = CHO_LIST.indexOf(cho);
  const j = JUNG_LIST.indexOf(jung);
  const t = jong ? JONG_LIST.indexOf(jong) : 0;
  if (c < 0 || j < 0 || t < 0) return '';
  return String.fromCharCode(0xAC00 + (c * 21 + j) * 28 + t);
}

// ==========================================
// 3. G2P: 라틴 철자 -> 한글 발음 음절 변환
// ==========================================
const LATIN_CONSONANTS = [
  ['shch', 'ㅅ'], ['tch', 'ㅊ'], ['sch', 'ㅅ'], ['chr', 'ㅋ'], ['ch', 'ㅊ'],
  ['sh', 'ㅅ'], ['ph', 'ㅍ'], ['th', 'ㅅ'], ['ck', 'ㅋ'], ['kh', 'ㅋ'],
  ['zh', 'ㅈ'], ['ts', 'ㅊ'], ['gh', 'ㄱ'], ['qu', 'ㅋ'], ['wh', 'ㅎ'],
  ['b', 'ㅂ'], ['c', 'ㅋ'], ['d', 'ㄷ'], ['f', 'ㅍ'], ['g', 'ㄱ'],
  ['h', 'ㅎ'], ['j', 'ㅈ'], ['k', 'ㅋ'], ['l', 'ㄹ'], ['m', 'ㅁ'],
  ['n', 'ㄴ'], ['p', 'ㅍ'], ['q', 'ㅋ'], ['r', 'ㄹ'], ['s', 'ㅅ'],
  ['t', 'ㅌ'], ['v', 'ㅂ'], ['w', 'ㅇ'], ['x', 'ㄳ'], ['y', 'ㅇ'], ['z', 'ㅈ']
];

const LATIN_VOWELS = [
  ['ae', 'ㅐ'], ['ai', 'ㅐ'], ['ay', 'ㅐ'], ['au', 'ㅗ'], ['aw', 'ㅗ'],
  ['ea', 'ㅣ'], ['ee', 'ㅣ'], ['ei', 'ㅔ'], ['ey', 'ㅔ'], ['eu', 'ㅡ'],
  ['ia', 'ㅑ'], ['ie', 'ㅣ'], ['io', 'ㅛ'], ['iu', 'ㅠ'],
  ['oa', 'ㅘ'], ['oe', 'ㅚ'], ['oi', 'ㅚ'], ['oy', 'ㅚ'],
  ['oo', 'ㅜ'], ['ou', 'ㅜ'], ['ow', 'ㅗ'],
  ['ua', 'ㅘ'], ['ue', 'ㅞ'], ['ui', 'ㅟ'], ['uo', 'ㅝ'],
  ['a', 'ㅏ'], ['e', 'ㅔ'], ['i', 'ㅣ'], ['o', 'ㅗ'], ['u', 'ㅜ'], ['y', 'ㅣ']
];

export function latinToHangul(latinStr) {
  let s = String(latinStr || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return '';

  let syllables = [];
  let i = 0;

  function matchToken(list, idx) {
    for (const [pat, mapped] of list) {
      if (s.startsWith(pat, idx)) return { pat, mapped, len: pat.length };
    }
    return null;
  }

  while (i < s.length) {
    let cho = 'ㅇ';
    let vMatch = matchToken(LATIN_VOWELS, i);

    if (!vMatch) {
      let cMatch = matchToken(LATIN_CONSONANTS, i);
      if (cMatch) {
        // 'c'가 e, i, y 앞에 올 때는 'ㅅ' 발음
        if (cMatch.pat === 'c' && i + 1 < s.length && ['e','i','y'].includes(s[i+1])) {
          cho = 'ㅅ';
        } else {
          cho = cMatch.mapped;
        }
        i += cMatch.len;

        vMatch = matchToken(LATIN_VOWELS, i);
        if (!vMatch) {
          // 자음 연속 시 'ㅡ' 모음 삽입 (예: str, dmi)
          syllables.push(makeHangul(cho, 'ㅡ'));
          continue;
        }
      } else {
        i++;
        continue;
      }
    }

    let jung = vMatch.mapped;
    i += vMatch.len;

    let jong = '';
    let nextC = matchToken(LATIN_CONSONANTS, i);
    if (nextC) {
      // 다음 자음 뒤에 바로 모음이 오지 않는 경우 받침 처리
      let afterNextV = matchToken(LATIN_VOWELS, i + nextC.len);
      if (!afterNextV) {
        if (['m', 'n', 'l', 'r'].includes(nextC.pat)) {
          jong = nextC.pat === 'm' ? 'ㅁ' : (nextC.pat === 'n' ? 'ㄴ' : 'ㄹ');
          i += nextC.len;
        } else if (nextC.pat === 'ng') {
          jong = 'ㅇ';
          i += nextC.len;
        }
      }
    }

    syllables.push(makeHangul(cho, jung, jong));
  }

  return syllables.join('');
}

// ==========================================
// 4. 음향 유사도 계산 엔진
// ==========================================
function choSim(c1, c2) {
  if (c1 === c2) return 1.0;
  // 치경음/마찰음/파찰음 군: ㅅ(9), ㅆ(10), ㅈ(12), ㅉ(13), ㅊ(14)
  const sibilants = new Set([9, 10, 12, 13, 14]);
  if (sibilants.has(c1) && sibilants.has(c2)) return 0.85;
  // 순음 군: ㅂ(7), ㅃ(8), ㅍ(17), ㅁ(6)
  const bilabials = new Set([6, 7, 8, 17]);
  if (bilabials.has(c1) && bilabials.has(c2)) return 0.82;
  // 설근/연구개음 군: ㄱ(0), ㄲ(1), ㅋ(15), ㅇ(11)
  const velars = new Set([0, 1, 11, 15]);
  if (velars.has(c1) && velars.has(c2)) return 0.80;
  // 치조/유음/비음 군: ㄷ(3), ㄸ(4), ㅌ(16), ㄴ(2), ㄹ(5)
  const dentals = new Set([2, 3, 4, 5, 16]);
  if (dentals.has(c1) && dentals.has(c2)) return 0.78;
  // 후음/영성운 군: ㅎ(18), ㅇ(11)
  if ((c1 === 11 && c2 === 18) || (c1 === 18 && c2 === 11)) return 0.72;
  return 0.20;
}

function jungSim(j1, j2) {
  if (j1 === j2) return 1.0;
  // 원순/후설: ㅗ(8), ㅜ(13), ㅛ(12), ㅠ(17), ㅘ(9), ㅝ(14)
  const roundBack = new Set([8, 9, 12, 13, 14, 17]);
  if (roundBack.has(j1) && roundBack.has(j2)) return 0.85;
  // 전설/평순: ㅣ(20), ㅔ(5), ㅐ(1), ㅖ(7), ㅒ(3)
  const front = new Set([1, 3, 5, 7, 20]);
  if (front.has(j1) && front.has(j2)) return 0.85;
  // 중설/중모음: ㅓ(4), ㅕ(6), ㅡ(18), ㅜ(13)
  const central = new Set([4, 6, 13, 18]);
  if (central.has(j1) && central.has(j2)) return 0.78;
  // 양성 모음 군: ㅏ(0), ㅑ(2), ㅗ(8)
  const bright = new Set([0, 2, 8]);
  if (bright.has(j1) && bright.has(j2)) return 0.80;
  return 0.25;
}

function jongSim(t1, t2) {
  if (t1 === t2) return 1.0;
  if (t1 === 0 || t2 === 0) return 0.45;
  const nasals = new Set([4, 16, 21]); // ㄴ, ㅁ, ㅇ
  if (nasals.has(t1) && nasals.has(t2)) return 0.85;
  const stops = new Set([1, 7, 17, 19]); // ㄱ, ㄷ, ㅂ, ㅅ
  if (stops.has(t1) && stops.has(t2)) return 0.80;
  return 0.30;
}

function sylSim(s1, s2) {
  if (!s1 || !s2) return 0;
  const cScore = choSim(s1[0], s2[0]);
  const jScore = jungSim(s1[1], s2[1]);
  const tScore = jongSim(s1[2], s2[2]);
  return cScore * 0.45 + jScore * 0.40 + tScore * 0.15;
}

function scoreSequence(qSyls, candSyls) {
  if (qSyls.length === 0 || candSyls.length === 0) return 0;

  let baseScore = 0;
  if (qSyls.length === 1 && candSyls.length === 2) {
    const s1 = sylSim(qSyls[0], candSyls[0]);
    const s2 = sylSim(qSyls[0], candSyls[1]);
    baseScore = Math.max(s1 * 0.90 + 0.08, s2 * 0.82);
  } else if (qSyls.length >= 2 && candSyls.length === 2) {
    const match1 = sylSim(qSyls[0], candSyls[0]);
    const match2 = sylSim(qSyls[1], candSyls[1]);
    baseScore = match1 * 0.55 + match2 * 0.45;
    if (qSyls.length >= 3) {
      // 1번째 + 3번째 음절 비교 (예: 사쿠라 -> 서라, 아멜리 -> 아리)
      const match1_3 = sylSim(qSyls[0], candSyls[0]) * 0.55 + sylSim(qSyls[2], candSyls[1]) * 0.45;
      baseScore = Math.max(baseScore, match1_3);
    }
  } else if (qSyls.length === candSyls.length) {
    let sum = 0;
    for (let i = 0; i < qSyls.length; i++) {
      sum += sylSim(qSyls[i], candSyls[i]);
    }
    baseScore = sum / qSyls.length;
  } else {
    baseScore = sylSim(qSyls[0], candSyls[0]) * 0.8;
  }

  // 표준 2음절 한국인 인명 가중치 (+0.04)
  if (candSyls.length === 2) {
    baseScore += 0.04;
  }

  return baseScore;
}

// ==========================================
// 5. 음향 브릿지 해설 자동 생성기
// ==========================================
const CHO_DESCRIPTORS = {
  'ㄱ': "시원하고 곧은 'G/K' 첫소리",
  'ㄲ': "단단하고 뚜렷한 첫소리",
  'ㄴ': "부드럽고 온화한 'N' 첫소리",
  'ㄷ': "신뢰감 있는 'D/T' 첫소리",
  'ㄸ': "굳건하고 힘찬 첫소리",
  'ㄹ': "유려하게 흐르는 'L/R' 첫소리",
  'ㅁ': "포근하고 다정한 'M' 첫소리",
  'ㅂ': "밝고 당당한 'B/P' 첫소리",
  'ㅃ': "생동감 넘치는 첫소리",
  'ㅅ': "세련되고 맑은 'S' 첫소리",
  'ㅆ': "빛나는 에너지의 첫소리",
  'ㅇ': "부드러운 열린 모음의 첫소리",
  'ㅈ': "지혜롭고 기품 있는 'J' 첫소리",
  'ㅉ': "선명하고 단단한 첫소리",
  'ㅊ': "맑고 청량한 'Ch' 첫소리",
  'ㅋ': "활기차고 맑은 'K' 첫소리",
  'ㅌ': "진취적이고 밝은 'T' 첫소리",
  'ㅍ': "시원하게 울리는 'P/F' 첫소리",
  'ㅎ': "따스한 온기를 품은 'H' 첫소리"
};

function generatePhoneticReason(query, hangulName) {
  const dec = decomposeHangul(hangulName[0]);
  const choChar = dec ? CHO_LIST[dec[0]] : 'ㅇ';
  const desc = CHO_DESCRIPTORS[choChar] || "부드러운 음운의 울림";
  return `'${query}'의 핵심 울림과 어우러지는 ${desc}로, 한국어의 아름다운 선율을 자연스럽게 완성합니다.`;
}

// ==========================================
// 6. 메인 탐색 함수 (findPhoneticMatches)
// ==========================================
export function findPhoneticMatches(rawQuery, ctx = {}, options = {}) {
  const query = String(rawQuery || '').trim();
  if (!query) return { query: '', results: [] };

  const normalized = normalizeForeignName(query);
  const normalizedKey = normalized.toLowerCase();
  const targetLang = options.preferredLang || options.lang;

  // 1. Curated Direct Database 고정밀 색인 검색 (다국어 언어 설정 시 해당 언어 우선 탐색)
  let curatedHit = null;
  if (targetLang && targetLang !== 'all') {
    curatedHit = CURATED_NAMES.find(item => 
      item.lang === targetLang && (
        item.name.toLowerCase() === normalizedKey ||
        item.aliases.some(a => a.toLowerCase() === normalizedKey || a.toLowerCase() === query.toLowerCase())
      )
    );
  }

  if (!curatedHit) {
    curatedHit = NAMES_BY_KEY.get(normalizedKey) ||
                 NAMES_BY_KEY.get(query.toLowerCase());
  }

  // 1-b. 부분 일치(Prefix) 검색 시에도 설정된 언어 우선 매칭
  if (!curatedHit && normalizedKey.length >= 2) {
    const partials = CURATED_NAMES.filter(item => {
      const matchName = item.name.toLowerCase().startsWith(normalizedKey);
      const matchAlias = item.aliases.some(a => a.toLowerCase().startsWith(normalizedKey));
      return matchName || matchAlias;
    });

    if (partials.length > 0) {
      if (targetLang && targetLang !== 'all') {
        const langPartials = partials.filter(p => p.lang === targetLang);
        curatedHit = langPartials.length > 0 ? langPartials[0] : partials[0];
      } else {
        curatedHit = partials[0];
      }
    }
  }

  if (curatedHit) {
    const results = curatedHit.matches.map((m, idx) => ({
      hangul: m.hangul,
      roman: m.roman || hangulToRoman(m.hangul),
      matchRate: 98 - (idx * 2), // 98%, 96%, 94%
      reason: m.reason,
      meaning: m.meaning,
      isCurated: true,
      ipa: curatedHit.ipa,
      foreignName: curatedHit.name,
      lang: curatedHit.lang
    }));

    return {
      query,
      normalized,
      ipa: curatedHit.ipa,
      isCurated: true,
      lang: curatedHit.lang,
      results
    };
  }

  // 2. 임의의 이름 대상 G2P 변환 & 음향 유사도 퍼지 매칭
  const transliterated = latinToHangul(normalized) || query;
  const qSyls = [...transliterated].map(decomposeHangul).filter(Boolean);

  const candidatePool = Array.isArray(ctx.names) && ctx.names.length > 0
    ? ctx.names
    : [];

  if (candidatePool.length === 0 || qSyls.length === 0) {
    return {
      query,
      normalized,
      transliterated,
      isCurated: false,
      results: []
    };
  }

  // 빠른 채점을 위해 상위 점수 후보 선별
  const scored = [];
  const seenHangul = new Set();

  for (let i = 0; i < candidatePool.length; i++) {
    const item = candidatePool[i];
    if (seenHangul.has(item.name)) continue;
    seenHangul.add(item.name);

    const candSyls = [...item.name].map(decomposeHangul).filter(Boolean);
    if (candSyls.length === 0) continue;

    const rawSim = scoreSequence(qSyls, candSyls);
    scored.push({
      item,
      score: rawSim
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const topCandidates = scored.slice(0, options.limit || 5);

  const results = topCandidates.map((entry, idx) => {
    const matchPercentage = Math.min(96, Math.max(76, Math.round(entry.score * 100)));
    return {
      hangul: entry.item.name,
      roman: hangulToRoman(entry.item.name),
      matchRate: matchPercentage,
      reason: generatePhoneticReason(query, entry.item.name),
      meaning: entry.item.meaning || '빛나고 아름다운 삶',
      isCurated: false,
      ipa: `[${transliterated}]`,
      foreignName: query,
      lang: 'global'
    };
  });

  return {
    query,
    normalized,
    transliterated,
    isCurated: false,
    results
  };
}
