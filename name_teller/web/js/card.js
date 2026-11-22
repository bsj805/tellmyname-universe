// web/js/card.js — 이름 및 한자 뜻 카드 모듈 (수평 스냅 피드 · 무한 캐러셀 · 단일 페이지)
import { on, emit, explainSyllables, randomEntry, escapeHtml, toChosung, hangulToRoman, hangulToIpa } from './core.js';
import { t, getLang } from './i18n.js';

let appCtx = null;
let rootEl = null;
let carouselEl = null;
let prevBtnEl = null;
let nextBtnEl = null;

const i18nPackCache = {};
let currentI18nPack = null;

/**
 * Web Speech API 기반 한국어 이름 음성 재생
 */
function speakKoreanName(name) {
  if (!name || typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(name);
    utter.lang = 'ko-KR';
    utter.rate = 0.82; // 외국인도 선명하게 들을 수 있는 단정한 속도
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn('[speakKoreanName] Error:', err);
  }
}

async function fetchLanguagePack(lang) {
  if (!lang || lang === 'ko') {
    currentI18nPack = null;
    return;
  }
  if (i18nPackCache[lang]) {
    currentI18nPack = i18nPackCache[lang];
    return;
  }
  try {
    const res = await fetch(`/data/i18n/names_${lang}.json`);
    if (res.ok) {
      const data = await res.json();
      i18nPackCache[lang] = data;
      currentI18nPack = data;
    } else {
      currentI18nPack = null;
    }
  } catch {
    currentI18nPack = null;
  }
}

const state = {
  cards: [], // Array of { surname, given, entries: [], activeVariantIdx: 0 }
  activeIndex: 0,
  isInternalUpdate: false
};

// 순우리말 대표 어휘 및 음절 세트 (꽃, 마음, 별, 달, 빛, 솔, 봄, 바람, 바다 등)
const PURE_KOREAN_SEEDS = new Set([
  '꽃', '마음', '별', '달', '빛', '솔', '새', '봄', '바람', '바다', '구름', '물', '흙', '숲',
  '이슬', '노을', '나래', '라온', '다온', '아라', '새론', '하람', '해솔', '가온', '산들', '온유',
  '푸름', '초롱', '나리', '도래', '미르', '마루', '미소', '비단', '새나', '소미', '솔이', '슬기',
  '우리', '토리', '하율', '해나', '환희', '흰별', '힘찬'
]);

/**
 * DB에 없는 한글 이름일 경우 순우리말 또는 인명용 한자 풀이 생성
 */
function buildFallbackEntry(given, ctx) {
  const chars = [...(given || '')];
  const hanjaMap = ctx?.hanja || {};
  const hanjaChars = [];
  const meanings = [];

  const isPureSeed = PURE_KOREAN_SEEDS.has(given) || chars.some(c => PURE_KOREAN_SEEDS.has(c));

  for (const ch of chars) {
    const isPureCh = isPureSeed && (PURE_KOREAN_SEEDS.has(ch) || given.includes('마음') || given.includes('바람') || given.includes('하늘'));
    const info = !isPureCh ? hanjaMap[ch] : null;

    if (info && info.hanja) {
      hanjaChars.push(info.hanja);
      meanings.push(info.sym || info.meaning || `${ch}의 맑은 기운`);
    } else {
      hanjaChars.push('');
      if (ch === '꽃') {
        meanings.push('꽃처럼 활짝 피어나는 화사한 생명력');
      } else if (ch === '마' && given.includes('마음')) {
        meanings.push('순수하고 따뜻한 마음의 온기');
      } else if (ch === '음' && given.includes('마음')) {
        meanings.push('진심이 담긴 깊은 사랑의 울림');
      } else if (ch === '별') {
        meanings.push('어둠을 밝히는 밤하늘 별처럼 찬란한 빛');
      } else if (ch === '빛') {
        meanings.push('세상을 따스하게 비추는 맑은 빛');
      } else if (ch === '솔') {
        meanings.push('사계절 푸른 소나무처럼 곧은 지조');
      } else if (ch === '봄') {
        meanings.push('새로운 희망을 피워내는 봄날의 따스함');
      } else {
        meanings.push(`${ch}의 순수한 마음`);
      }
    }
  }

  // 순우리말 음절이 하나라도 포함되어 한자가 없으면 전체 한자 표기를 비움 (이상한 한자 노출 방지)
  const isPureKorean = isPureSeed || hanjaChars.some(h => !h);
  const finalHanja = isPureKorean ? '' : hanjaChars.join('');

  let generatedMeaning = '';
  if (given === '꽃마음') {
    generatedMeaning = '활짝 피어나는 꽃처럼 화사하고 순수한 마음으로 세상을 따뜻하게 밝히는 사람';
  } else if (meanings.length === 1) {
    generatedMeaning = `${meanings[0]}으로 세상을 밝히는 사람`;
  } else if (meanings.length === 2) {
    generatedMeaning = `${meanings[0]}으로, ${meanings[1]}을 품고 나아가는 사람`;
  } else {
    generatedMeaning = `${meanings.join(', ')}으로 세상을 따뜻하고 지혜롭게 가꾸는 사람`;
  }

  return {
    name: given,
    cho: toChosung(given),
    hanja: finalHanja,
    altHanja: finalHanja,
    meaning: generatedMeaning,
    gender: '',
    category: isPureKorean ? '순우리말 이름' : '인명용 한자 이름'
  };
}

/**
 * 주어진 성+이름으로 카드 아이템 데이터 객체 생성
 */

/**
 * 대법원 인명용 한자 사전을 기반으로 동일한 한글 이름에 대한 2~4가지 다양한 한자 조합 및 고유 뜻풀이 생성
 */
function buildHanjaVariants(given, baseEntries, ctx) {
  const isPure = PURE_KOREAN_SEEDS.has(given) || [...given].some(c => PURE_KOREAN_SEEDS.has(c));
  if (isPure) return baseEntries;

  const hanjaMap = ctx?.hanja || {};
  const chars = [...given];
  if (chars.length === 0 || chars.length > 3) return baseEntries;

  // 각 음절별 사용 가능한 대법원 인명용 한자 목록 수집
  const sylVariantsList = chars.map(ch => {
    const info = hanjaMap[ch];
    if (!info) return [];
    const list = [];
    if (info.variants && info.variants.length > 0) {
      for (const v of info.variants) {
        if (v.hanja && !list.some(item => item.hanja === v.hanja)) list.push(v);
      }
    }
    if (info.hanja && !list.some(item => item.hanja === info.hanja)) {
      list.unshift({ hanja: info.hanja, meaning: info.meaning, sym: info.sym });
    }
    if (info.altHanja && !list.some(item => item.hanja === info.altHanja)) {
      list.push({ hanja: info.altHanja, meaning: info.altMeaning || info.meaning, sym: info.sym });
    }
    return list;
  });

  if (sylVariantsList.some(list => list.length === 0)) return baseEntries;

  const resultEntries = [];
  const seenHanja = new Set();

  for (const b of (baseEntries || [])) {
    if (b && b.hanja) {
      resultEntries.push(b);
      seenHanja.add(b.hanja);
    }
  }

  if (chars.length === 2) {
    const list1 = sylVariantsList[0];
    const list2 = sylVariantsList[1];
    const pairs = [
      [0, 0],
      [1, 1],
      [0, 1],
      [1, 0],
      [2, 0],
      [0, 2],
      [2, 2]
    ];

    for (const [i1, i2] of pairs) {
      if (resultEntries.length >= 4) break;
      if (list1[i1] && list2[i2]) {
        const v1 = list1[i1];
        const v2 = list2[i2];
        const combinedHanja = v1.hanja + v2.hanja;
        if (!seenHanja.has(combinedHanja)) {
          seenHanja.add(combinedHanja);
          const s1 = v1.sym || `${chars[0]}의 맑은 기운`;
          const s2 = v2.sym || `${chars[1]}의 따뜻한 온기`;
          const poeticMeaning = `${s1}과 ${s2}을 품고 지혜롭게 피어나는 사람`;

          resultEntries.push({
            name: given,
            cho: toChosung(given),
            hanja: combinedHanja,
            altHanja: combinedHanja,
            meaning: poeticMeaning,
            gender: '공용',
            category: '인명용 한자 이름'
          });
        }
      }
    }
  } else if (chars.length === 1) {
    const list = sylVariantsList[0];
    for (let i = 0; i < Math.min(list.length, 4); i++) {
      const v = list[i];
      if (!seenHanja.has(v.hanja)) {
        seenHanja.add(v.hanja);
        const sym = v.sym || `${chars[0]}의 맑은 뜻`;
        resultEntries.push({
          name: given,
          cho: toChosung(given),
          hanja: v.hanja,
          altHanja: v.hanja,
          meaning: `${sym}으로 세상을 밝히는 사람`,
          gender: '공용',
          category: '인명용 한자 이름'
        });
      }
    }
  }

  return resultEntries.length > 0 ? resultEntries : baseEntries;
}

function createCardItem(surname, given, extra = {}) {
  const cleanGiven = (given || '').trim();
  const cleanSurname = (surname || '').trim();
  let entries = appCtx?.byName?.get(cleanGiven);

  if (!entries || entries.length === 0) {
    entries = [buildFallbackEntry(cleanGiven, appCtx)];
  }

  // 한자 변형 다중 조합 적용 (다양한 한자 표기 및 뜻 노출)
  const expandedEntries = buildHanjaVariants(cleanGiven, entries, appCtx);

  return {
    surname: cleanSurname,
    given: cleanGiven,
    isUnserved: false,
    entries: [...expandedEntries],
    activeVariantIdx: 0,
    foreignOrigin: extra.foreignOrigin || '',
    foreignSound: extra.foreignSound || '',
    phoneticReason: extra.phoneticReason || '',
    allMatches: extra.allMatches || []
  };
}

/**
 * 랜덤 카드 아이템 생성
 */
function getRandomCardItem() {
  const r = randomEntry();
  const given = r ? r.name : '서윤';
  return createCardItem('', given);
}

/**
 * 카드 슬라이드 내부 HTML 생성
 */

// ==========================================
// 대법원 인명용 한자 직접 선택 및 변경 모달 (Hanja Picker)
// ==========================================
let hanjaPickerModalEl = null;

function ensureHanjaPickerModal() {
  if (hanjaPickerModalEl) return hanjaPickerModalEl;

  hanjaPickerModalEl = document.createElement('div');
  hanjaPickerModalEl.id = 'hanja-picker-modal-root';
  hanjaPickerModalEl.className = 'hanja-picker-overlay';
  hanjaPickerModalEl.setAttribute('role', 'dialog');
  hanjaPickerModalEl.setAttribute('aria-modal', 'true');
  hanjaPickerModalEl.setAttribute('hidden', '');

  hanjaPickerModalEl.innerHTML = `
    <div class="hanja-picker-backdrop"></div>
    <div class="hanja-picker-dialog">
      <header class="hanja-picker-header">
        <div class="hanja-picker-title-group">
          <div class="hanja-picker-badge">대법원 인명용 한자 목록</div>
          <h2 class="hanja-picker-title">
            <span class="hanja-picker-syl serif"></span>
            <span>한자 직접 선택</span>
          </h2>
          <p class="hanja-picker-desc">내 이름에 쓰이는 진짜 한자를 선택해 보세요. 한자를 누르면 뜻풀이가 즉시 바뀝니다.</p>
        </div>
        <button type="button" class="hanja-picker-close-btn" aria-label="닫기">✕</button>
      </header>
      <div class="hanja-picker-body">
        <div class="hanja-picker-grid"></div>
      </div>
    </div>
  `;

  document.body.appendChild(hanjaPickerModalEl);

  const closeBtn = hanjaPickerModalEl.querySelector('.hanja-picker-close-btn');
  const backdrop = hanjaPickerModalEl.querySelector('.hanja-picker-backdrop');
  const close = () => closeHanjaPicker();
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hanjaPickerModalEl.hasAttribute('hidden')) {
      close();
    }
  });

  return hanjaPickerModalEl;
}

function openHanjaPicker(hangul, sylIdx, currentHanja, card, sIdx) {
  const modal = ensureHanjaPickerModal();
  const info = appCtx?.hanja ? appCtx.hanja[hangul] : null;

  const titleSyl = modal.querySelector('.hanja-picker-syl');
  if (titleSyl) titleSyl.textContent = `'${hangul}'`;

  const grid = modal.querySelector('.hanja-picker-grid');
  if (!grid) return;

  const list = [];
  if (info) {
    if (info.variants && info.variants.length > 0) {
      for (const v of info.variants) {
        if (v.hanja && !list.some(x => x.hanja === v.hanja)) list.push(v);
      }
    }
    if (info.hanja && !list.some(x => x.hanja === info.hanja)) {
      list.unshift({ hanja: info.hanja, meaning: info.meaning, stroke: info.stroke, ohaeng: info.ohaeng, sym: info.sym });
    }
    if (info.altHanja && !list.some(x => x.hanja === info.altHanja)) {
      list.push({ hanja: info.altHanja, meaning: info.altMeaning || info.meaning, stroke: info.stroke, ohaeng: info.ohaeng, sym: info.sym });
    }
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="hanja-picker-empty">
        <p>‘${escapeHtml(hangul)}’ 음절은 등록된 인명용 한자가 없거나 순우리말 고유 음절입니다.</p>
      </div>
    `;
  } else {
    grid.innerHTML = list.map(item => {
      const isSelected = (item.hanja === currentHanja);
      return `
        <button type="button" class="hanja-picker-card ${isSelected ? 'is-selected' : ''}" data-hanja="${escapeHtml(item.hanja)}" data-meaning="${escapeHtml(item.meaning || '')}" data-sym="${escapeHtml(item.sym || '')}">
          <div class="hanja-picker-card-top">
            <span class="hanja-char serif">${escapeHtml(item.hanja)}</span>
            ${isSelected ? '<span class="hanja-current-badge">선택됨</span>' : ''}
          </div>
          <div class="hanja-meaning">${escapeHtml(item.meaning || hangul)}</div>
          <div class="hanja-meta">
            ${item.stroke ? `<span class="meta-tag">${item.stroke}획</span>` : ''}
            ${item.ohaeng ? `<span class="meta-tag">${escapeHtml(item.ohaeng)}</span>` : ''}
          </div>
          ${item.sym ? `<div class="hanja-sym">${escapeHtml(item.sym)}</div>` : ''}
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.hanja-picker-card').forEach(cardBtn => {
      cardBtn.addEventListener('click', () => {
        const selectedHanja = cardBtn.dataset.hanja;
        const selectedMeaning = cardBtn.dataset.meaning;
        const selectedSym = cardBtn.dataset.sym;
        applyCustomHanja(card, sylIdx, selectedHanja, selectedMeaning, selectedSym, sIdx);
        closeHanjaPicker();
      });
    });
  }

  modal.removeAttribute('hidden');
  modal.classList.add('is-open');
}

function closeHanjaPicker() {
  if (hanjaPickerModalEl) {
    hanjaPickerModalEl.classList.remove('is-open');
    setTimeout(() => {
      if (!hanjaPickerModalEl.classList.contains('is-open')) {
        hanjaPickerModalEl.setAttribute('hidden', '');
      }
    }, 180);
  }
}

function applyCustomHanja(card, sylIdx, selectedHanja, selectedMeaning, selectedSym, sIdx) {
  const activeEntry = card.entries[card.activeVariantIdx || 0] || card.entries[0] || {};
  const currentHanjaStr = activeEntry.hanja || '';
  const givenChars = [...card.given];

  let hanjaArr = [...currentHanjaStr];
  while (hanjaArr.length < givenChars.length) {
    const ch = givenChars[hanjaArr.length];
    const info = appCtx?.hanja ? appCtx.hanja[ch] : null;
    hanjaArr.push(info?.hanja || '');
  }

  if (sylIdx >= 0 && sylIdx < hanjaArr.length) {
    hanjaArr[sylIdx] = selectedHanja;
  }

  const newHanjaStr = hanjaArr.join('');
  const syllables = explainSyllables({ name: card.given, hanja: newHanjaStr }, appCtx?.hanja || {});
  const syms = syllables.map(s => s.sym || `${s.hangul}의 맑은 기운`);
  let newMeaning = '';
  if (syms.length === 1) {
    newMeaning = `${syms[0]}으로 세상을 맑고 따뜻하게 밝히는 사람`;
  } else if (syms.length === 2) {
    newMeaning = `${syms[0]}과 ${syms[1]}을 품고 지혜롭게 피어나는 사람`;
  } else {
    newMeaning = `${syms.join(', ')}의 아름다운 조화로 세상에 선한 빛을 더하는 사람`;
  }

  const newEntry = {
    name: card.given,
    cho: toChosung(card.given),
    hanja: newHanjaStr,
    altHanja: newHanjaStr,
    meaning: newMeaning,
    gender: activeEntry.gender || '공용',
    category: '인명용 한자 이름'
  };

  card.entries.unshift(newEntry);
  card.activeVariantIdx = 0;

  const slide = carouselEl?.querySelector(`.card-slide[data-index="${sIdx}"]`);
  if (slide) {
    slide.innerHTML = renderSlideInner(card, sIdx);
  }
}

function renderSlideInner(card, idx) {
  const activeEntry = card.entries[card.activeVariantIdx || 0] || card.entries[0] || {};
  const fullName = (card.surname || '') + card.given;

  // 성씨 한자 조회
  let surHanja = '';
  let surObj = null;
  if (card.surname) {
    surObj = (appCtx?.surnames || []).find(s => s.surname === card.surname);
    surHanja = surObj?.hanja || '';
  }
  // 한자가 없거나(순우리말) 음절 수와 맞지 않는 경우 한자 미표기
  const hasFullHanja = activeEntry.hanja && activeEntry.hanja.length === activeEntry.name.length;
  const fullHanja = hasFullHanja ? (surHanja + activeEntry.hanja) : '';

  // 음절별 한자 풀이
  const syllables = explainSyllables(activeEntry, appCtx?.hanja || {});
  const allSyllables = [];

  if (card.surname) {
    const surHanjaInfo = appCtx?.hanja ? appCtx.hanja[card.surname] : null;
    const surSym = surHanjaInfo?.sym || '가문의 뿌리와 전통을 잇는 성씨';
    allSyllables.push({
      hangul: card.surname,
      hanja: surObj?.hanja || surHanjaInfo?.hanja || '',
      meaning: surObj?.meaning || surHanjaInfo?.meaning || '성씨',
      sym: surSym,
      isSurname: true
    });
  }

  syllables.forEach((s, idx) => {
    allSyllables.push({
      hangul: s.hangul,
      hanja: s.hanja,
      meaning: s.meaning || (s.hanja ? '' : '순우리말'),
      sym: s.sym || (s.hanja ? '' : '맑고 고운 마음을 담은 아름다운 우리말'),
      isSurname: false,
      givenCharIndex: idx
    });
  });

  // 여러 한자 표기(variants)가 있는 경우 탭/도트 UI
  let variantsNavHtml = '';
  if (card.entries.length > 1) {
    const dotsHtml = card.entries.map((entry, vIdx) => {
      const isActive = vIdx === (card.activeVariantIdx || 0);
      const label = entry.hanja ? entry.hanja : `한자 ${vIdx + 1}`;
      return `
        <button type="button" class="card-variant-dot ${isActive ? 'active' : ''}" data-action="set-variant" data-variant-idx="${vIdx}" aria-label="한자 ${escapeHtml(label)}" title="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
        </button>
      `;
    }).join('');

    variantsNavHtml = `
      <div class="card-variant-nav">
        <span class="card-variant-nav-label">${t('card.hanja_label')}</span>
        <div class="card-variant-dots">${dotsHtml}</div>
      </div>
    `;
  }

  const syllablesHtml = allSyllables.map(s => {
    const isClickable = !s.isSurname && appCtx?.hanja && appCtx.hanja[s.hangul];
    const givenCharIndex = s.givenCharIndex !== undefined ? s.givenCharIndex : 0;
    return `
    <div class="card-syllable-item ${s.isSurname ? 'is-surname' : ''}">
      <div class="syl-badge serif ${isClickable ? 'is-clickable' : ''}" ${isClickable ? `data-action="open-hanja-picker" data-syl="${escapeHtml(s.hangul)}" data-syl-idx="${givenCharIndex}" data-current-hanja="${escapeHtml(s.hanja)}" title="'${escapeHtml(s.hangul)}' 한자 직접 바꾸기"` : ''}>
        <span class="syl-hangul">${escapeHtml(s.hangul)}</span>
        ${s.hanja ? `<span class="syl-hanja">${escapeHtml(s.hanja)}</span>` : `<span class="syl-hanja-empty">${t('card.category_pure')}</span>`}
        ${isClickable ? `<span class="syl-badge-change-icon" aria-hidden="true">✎</span>` : ''}
      </div>
      <div class="syl-info">
        <div class="syl-meaning-title-row">
          <div class="syl-meaning-title">${escapeHtml(s.meaning || s.hangul)}</div>
          ${isClickable ? `
            <button type="button" class="syl-change-pill-btn" data-action="open-hanja-picker" data-syl="${escapeHtml(s.hangul)}" data-syl-idx="${givenCharIndex}" data-current-hanja="${escapeHtml(s.hanja)}" title="'${escapeHtml(s.hangul)}' 음절의 인명용 한자 목록 보기">
              <span>한자 변경</span>
              <span class="pill-arrow">▾</span>
            </button>
          ` : ''}
        </div>
        ${s.sym ? `<div class="syl-sym-desc">${escapeHtml(s.sym)}</div>` : ''}
      </div>
    </div>
  `;
  }).join('');

  let foreignBridgeHtml = '';
  if (card.foreignOrigin) {
    const otherMatches = (card.allMatches || []).filter(m => m.hangul !== card.given);
    foreignBridgeHtml = `
      <div class="card-phonetic-bridge">
        <div class="bridge-badge">
          <span>✨</span>
          <span>${escapeHtml(card.foreignOrigin)} Korean Name</span>
          ${card.foreignSound ? `<span class="bridge-ipa">[${escapeHtml(card.foreignSound)}]</span>` : ''}
        </div>
        ${card.phoneticReason ? `<p class="bridge-reason">“${escapeHtml(card.phoneticReason)}”</p>` : ''}
        ${otherMatches.length > 0 ? `
          <div class="bridge-alts">
            <span class="bridge-alts-label">Other sounds-like names:</span>
            <div class="bridge-alts-pills">
              ${otherMatches.map(m => `
                <button type="button" class="bridge-alt-pill" data-action="switch-foreign-match" data-hangul="${escapeHtml(m.hangul)}" data-reason="${escapeHtml(m.reason)}">
                  ${escapeHtml(m.hangul)} (${escapeHtml(m.roman)})
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div style="margin-top: 10px;">
          <button type="button" class="bridge-explore-more-btn" data-action="open-phonetic-panel" style="font-size: 11.5px; color: #D97706; background: none; border: none; cursor: pointer; font-weight: 700; text-decoration: underline; padding: 0;">🌐 '${escapeHtml(card.foreignOrigin)}' 외국어 이름 → 한국어 이름 전체 보기</button>
        </div>
      </div>
    `;
  }

  // 미등록 노티스 제거 (모든 이름을 정식 카드로 표기)
  const unservedNoticeHtml = '';

  const i18nEntry = currentI18nPack ? currentI18nPack[card.given] : null;
  const romanStr = i18nEntry?.roman || hangulToRoman(fullName);
  const ipaStr = i18nEntry?.ipa || hangulToIpa(fullName);

  const phoneticPillHtml = `
    <button type="button" class="card-phonetic-btn" data-action="speak-name" data-name="${escapeHtml(fullName)}" aria-label="${escapeHtml(fullName)} 발음 듣기" title="소리내어 발음 듣기">
      <span class="card-phonetic-roman">${escapeHtml(romanStr)}</span>
      <span class="card-phonetic-ipa">[${escapeHtml(ipaStr)}]</span>
      <span class="card-phonetic-speaker" aria-hidden="true">🔊</span>
    </button>
  `;

  const displayMeaning = i18nEntry?.poeticTitle || i18nEntry?.meaning || activeEntry.meaning || '맑고 고운 뜻을 품고 살아가는 아름다운 사람';

  return `
    <article class="name-card  ${card.foreignOrigin ? 'is-foreign-match-card' : ''}">
      ${foreignBridgeHtml}
      ${unservedNoticeHtml}
      ${variantsNavHtml}

      <header class="card-header">
        <h1 class="card-name-hangul serif">${escapeHtml(fullName)}</h1>
        ${fullHanja ? `<div class="card-name-hanja serif">${escapeHtml(fullHanja)}</div>` : `<div class="card-name-hanja-tag">${t('card.category_pure')}</div>`}
        ${phoneticPillHtml}
      </header>

      <div class="card-meaning-box">
        <p class="card-meaning-text serif">“${escapeHtml(displayMeaning)}”</p>
      </div>

      <div class="card-syllables-list">
        ${syllablesHtml}
      </div>

      <div class="card-actions">
        <button type="button" class="card-action-btn share-btn" data-action="share" aria-label="${escapeHtml(fullName)} 이름 뜻 공유">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span>${t('card.share_story')}</span>
        </button>
        </div>
    </article>
  `;
}

/**
 * 슬라이드 래퍼 요소 생성
 */
function createSlideElement(card, idx) {
  const div = document.createElement('div');
  div.className = 'card-slide';
  div.dataset.index = String(idx);
  div.innerHTML = renderSlideInner(card, idx);
  return div;
}

/**
 * 뒤쪽에 랜덤 카드 무한 추가
 */
function appendMoreRandomCards(count = 5) {
  if (!carouselEl) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const card = getRandomCardItem();
    const idx = state.cards.length;
    state.cards.push(card);
    fragment.appendChild(createSlideElement(card, idx));
  }
  carouselEl.appendChild(fragment);
}

/**
 * 이전/다음 화살표 버튼 상태 갱신
 */
function updateArrowButtons() {
  if (prevBtnEl) {
    prevBtnEl.disabled = (state.activeIndex <= 0);
  }
  if (nextBtnEl) {
    nextBtnEl.disabled = false;
  }
}

/**
 * 특정 인덱스의 카드로 부드럽게 스크롤
 */
function scrollToIndex(idx) {
  if (!carouselEl || idx < 0) return;
  if (idx >= state.cards.length) {
    appendMoreRandomCards(5);
  }
  const slideWidth = carouselEl.clientWidth || carouselEl.offsetWidth;
  carouselEl.scrollTo({
    left: idx * slideWidth,
    behavior: 'smooth'
  });
}

/**
 * 스크롤이 멈췄을 때 현재 활성화된 카드 정착 처리
 */
function handleScrollSettle() {
  if (!carouselEl) return;
  const slideWidth = carouselEl.clientWidth || carouselEl.offsetWidth;
  if (!slideWidth) return;

  const settledIndex = Math.round(carouselEl.scrollLeft / slideWidth);
  if (settledIndex >= 0 && settledIndex < state.cards.length && settledIndex !== state.activeIndex) {
    state.activeIndex = settledIndex;
    updateArrowButtons();

    // 끝부분에 가까워지면 무한 로딩
    if (state.activeIndex >= state.cards.length - 3) {
      appendMoreRandomCards(5);
    }

    const currentCard = state.cards[settledIndex];
    if (currentCard) {
      state.isInternalUpdate = true;
      try {
        emit('name:show', {
          surname: currentCard.surname || '',
          given: currentCard.given
        });
      } finally {
        queueMicrotask(() => {
          state.isInternalUpdate = false;
        });
      }
    }
  }
}

/**
 * 캐러셀 피드 전체 재구성 (외부 이벤트 발생 시 시작 이름으로 초기화)
 */
function buildCarousel(surname, given, extra = {}) {
  if (!carouselEl) return;

  state.cards = [createCardItem(surname, given, extra)];
  for (let i = 0; i < 6; i++) {
    state.cards.push(getRandomCardItem());
  }
  state.activeIndex = 0;

  carouselEl.innerHTML = '';
  const fragment = document.createDocumentFragment();
  state.cards.forEach((card, idx) => {
    fragment.appendChild(createSlideElement(card, idx));
  });
  carouselEl.appendChild(fragment);

  carouselEl.scrollLeft = 0;
  updateArrowButtons();
}

/**
 * 'name:show' 이벤트 수신 핸들러
 */
function handleNameShow(payload) {
  if (!payload || !payload.given) return;

  // 자신이 스크롤 정착 시 발생시킨 이벤트는 재빌드 건너뜀
  if (state.isInternalUpdate) return;

  const current = state.cards[state.activeIndex];
  if (current && current.given === payload.given && (current.surname || '') === (payload.surname || '') && !payload.foreignOrigin) {
    return;
  }

  buildCarousel(payload.surname || '', payload.given, payload);
}

/**
 * 모듈 초기화
 */
export async function init(ctx) {
  appCtx = ctx;
  rootEl = document.getElementById('card-root');
  if (!rootEl) return;

  // 기본 레이아웃 구성
  rootEl.innerHTML = `
    <div class="card-section">
      <button type="button" class="carousel-arrow carousel-arrow-prev" aria-label="이전 이름 보기" title="이전 이름" disabled>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button type="button" class="carousel-arrow carousel-arrow-next" aria-label="다음 이름 보기" title="다음 이름">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div class="card-carousel" id="card-carousel" tabindex="0" aria-label="이름 카드 피드"></div>

      </div>
  `;

  carouselEl = rootEl.querySelector('.card-carousel');
  prevBtnEl = rootEl.querySelector('.carousel-arrow-prev');
  nextBtnEl = rootEl.querySelector('.carousel-arrow-next');
  

  // 좌우 화살표 클릭 핸들러
  prevBtnEl?.addEventListener('click', () => {
    if (state.activeIndex > 0) scrollToIndex(state.activeIndex - 1);
  });
  nextBtnEl?.addEventListener('click', () => {
    scrollToIndex(state.activeIndex + 1);
  });

  

  // 캐러셀 내부 이벤트 위임 (공유 버튼, 편지 쓰기 버튼, 한자 변형 선택, 발음 듣기)
  carouselEl?.addEventListener('click', (e) => {
    // 0. 이름 발음 듣기 (Web Speech API)
    const speakBtn = e.target.closest('[data-action="speak-name"]');
    if (speakBtn) {
      const nameToSpeak = speakBtn.dataset.name;
      if (nameToSpeak) {
        speakKoreanName(nameToSpeak);
        speakBtn.classList.add('is-speaking');
        setTimeout(() => speakBtn.classList.remove('is-speaking'), 700);
      }
      return;
    }

    // 1. 공유 버튼
    const shareBtn = e.target.closest('[data-action="share"]');
    if (shareBtn) {
      const slide = shareBtn.closest('.card-slide');
      if (slide) {
        const sIdx = parseInt(slide.dataset.index, 10);
        const card = state.cards[sIdx];
        if (card) {
          const activeEntry = card.entries[card.activeVariantIdx || 0] || card.entries[0];
          emit('share:open', {
            surname: card.surname || '',
            given: card.given,
            entry: activeEntry
          });
        }
      }
      return;
    }

    

    // 2-b. 음절별 한자 직접 변경 모달 열기
    const pickerTrigger = e.target.closest('[data-action="open-hanja-picker"]');
    if (pickerTrigger) {
      const syl = pickerTrigger.dataset.syl;
      const sylIdx = parseInt(pickerTrigger.dataset.sylIdx, 10);
      const currentHanja = pickerTrigger.dataset.currentHanja || '';
      const slide = pickerTrigger.closest('.card-slide');
      if (slide) {
        const sIdx = parseInt(slide.dataset.index, 10);
        const card = state.cards[sIdx];
        if (card && syl) {
          openHanjaPicker(syl, sylIdx, currentHanja, card, sIdx);
        }
      }
      return;
    }

    // 3. 한자 변형 선택 버튼
    const variantBtn = e.target.closest('[data-action="set-variant"]');
    if (variantBtn) {
      const vIdx = parseInt(variantBtn.dataset.variantIdx, 10);
      const slide = variantBtn.closest('.card-slide');
      if (slide) {
        const sIdx = parseInt(slide.dataset.index, 10);
        const card = state.cards[sIdx];
        if (card && card.entries[vIdx] !== undefined) {
          card.activeVariantIdx = vIdx;
          slide.innerHTML = renderSlideInner(card, sIdx);
        }
      }
      return;
    }

    

    // 5. 외국인 이름 매칭 대안 이름으로 즉시 스위칭
    const switchForeignBtn = e.target.closest('[data-action="switch-foreign-match"]');
    if (switchForeignBtn) {
      const targetHangul = switchForeignBtn.dataset.hangul;
      const targetReason = switchForeignBtn.dataset.reason;
      const current = state.cards[state.activeIndex];
      if (targetHangul && current) {
        emit('name:show', {
          surname: '',
          given: targetHangul,
          foreignOrigin: current.foreignOrigin,
          foreignSound: current.foreignSound,
          phoneticReason: targetReason || current.phoneticReason,
          allMatches: current.allMatches
        });
      }
      return;
    }

    // 5-b. 외국어 이름 -> 한국어 이름 전체 패널 열기
    const openPhoneticBtn = e.target.closest('[data-action="open-phonetic-panel"]');
    if (openPhoneticBtn) {
      const current = state.cards[state.activeIndex];
      emit('phonetic:open', { query: current?.foreignOrigin || '' });
      return;
    }
  });

  // 스크롤 감지 및 정착
  let scrollTimeout = null;
  carouselEl?.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScrollSettle, 140);
  }, { passive: true });

  carouselEl?.addEventListener('scrollend', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    handleScrollSettle();
  }, { passive: true });

  // 키보드 좌우 방향키 네비게이션
  window.addEventListener('keydown', (e) => {
    const tag = (e.target?.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(state.activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (state.activeIndex > 0) scrollToIndex(state.activeIndex - 1);
    }
  });

  // 창 크기 변경 시 현재 인덱스 정렬 유지
  window.addEventListener('resize', () => {
    if (!carouselEl) return;
    const slideWidth = carouselEl.clientWidth || carouselEl.offsetWidth;
    carouselEl.scrollLeft = state.activeIndex * slideWidth;
  });

  // 이벤트 버스 등록
  on('name:show', handleNameShow);

  on('lang:change', async (newLang) => {
    await fetchLanguagePack(newLang);
    if (carouselEl && state.cards.length > 0) {
      const slides = carouselEl.querySelectorAll('.card-slide');
      slides.forEach((slide, idx) => {
        const c = state.cards[idx];
        if (c) slide.innerHTML = renderSlideInner(c, idx);
      });
      
    }
  });

  // 초기 비한국어 환경일 경우 해당 언어팩 선제 로딩
  const initialLang = getLang();
  if (initialLang && initialLang !== 'ko') {
    fetchLanguagePack(initialLang).then(() => {
      if (carouselEl && state.cards.length > 0) {
        const slides = carouselEl.querySelectorAll('.card-slide');
        slides.forEach((slide, idx) => {
          const c = state.cards[idx];
          if (c) slide.innerHTML = renderSlideInner(c, idx);
        });
      }
    });
  }

  // 부트스트랩 시 이미 ctx.current가 존재하는 경우
  if (ctx.current) {
    handleNameShow(ctx.current);
  }
}
