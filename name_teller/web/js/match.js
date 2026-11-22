// web/js/match.js — 이름점 보기 (이름 궁합) & 99% 천생연분 추천 모듈
import { on, emit, escapeHtml } from './core.js';
import { t, getLang } from './i18n.js';

// 한글 자모 및 획수표
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSEUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGSUNG = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const STROKES = {
  // 초성 및 기본 자음
  'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8,
  'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 3, 'ㅍ': 4, 'ㅎ': 3,
  // 모음
  'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2, 'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4,
  'ㅗ': 2, 'ㅘ': 4, 'ㅙ': 5, 'ㅚ': 3, 'ㅛ': 3, 'ㅜ': 2, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3,
  'ㅠ': 3, 'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1,
  // 겹받침
  'ㄳ': 4, 'ㄵ': 5, 'ㄶ': 5, 'ㄺ': 7, 'ㄻ': 9, 'ㄼ': 9, 'ㄽ': 7, 'ㄾ': 8, 'ㄿ': 9, 'ㅀ': 8, 'ㅄ': 6
};

/** 한글 한 글자의 총 획수 계산 */
export function getCharStrokes(char) {
  if (!char) return 0;
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return 0; // 한글 음절 범위 외

  const cho = CHOSUNG[Math.floor(code / 588)];
  const jung = JUNGSEUNG[Math.floor((code % 588) / 28)];
  const jong = JONGSUNG[code % 28];

  const choStroke = STROKES[cho] || 0;
  const jungStroke = STROKES[jung] || 0;
  const jongStroke = jong ? (STROKES[jong] || 0) : 0;

  return choStroke + jungStroke + jongStroke;
}

/**
 * 두 한글 이름의 획수 교차 합산 이름점 계산
 * @param {string} nameA 본인 이름 (예: 김수현)
 * @param {string} nameB 상대방 이름 (예: 전지현)
 */
export function calculateMatch(nameA, nameB) {
  const charsA = [...String(nameA || '').trim()];
  const charsB = [...String(nameB || '').trim()];

  if (charsA.length === 0 || charsB.length === 0) {
    return { interleave: [], charOrigins: [], steps: [], percent: 0 };
  }

  // 1. 이름 글자 교차 배치 (A1, B1, A2, B2, A3, B3 ...)
  const maxLen = Math.max(charsA.length, charsB.length);
  const interleave = [];
  const charOrigins = []; // 'A' or 'B' (시각화용)

  for (let i = 0; i < maxLen; i++) {
    if (i < charsA.length) {
      interleave.push(charsA[i]);
      charOrigins.push('A');
    }
    if (i < charsB.length) {
      interleave.push(charsB[i]);
      charOrigins.push('B');
    }
  }

  // 2. 획수 초깃값
  const initialStrokes = interleave.map(ch => getCharStrokes(ch));
  const steps = [initialStrokes];

  // 3. 인접 숫자 합산 modulo 10 반복 (길이가 2가 될 때까지)
  let currentNums = initialStrokes;
  while (currentNums.length > 2) {
    const nextRow = [];
    for (let i = 0; i < currentNums.length - 1; i++) {
      nextRow.push((currentNums[i] + currentNums[i + 1]) % 10);
    }
    steps.push(nextRow);
    currentNums = nextRow;
  }

  const percent = currentNums.length === 2 ? currentNums[0] * 10 + currentNums[1] : 0;
  return { interleave, charOrigins, steps, percent };
}

/** 점수대별 궁합 평가 문구 (유닛 테스트 및 다국어 지원) */
export function getVerdict(percent) {
  let tier = '0';
  let fallbackTitle = '티격태격 스며드는 케미';
  let fallbackDesc = '첫인상은 낯설어도 부딪히며 점차 서로의 진가를 발견해 나가는 특별한 인연입니다.';
  let emoji = '🌱';

  if (percent >= 90) {
    tier = '100';
    fallbackTitle = '운명적인 천생연분';
    fallbackDesc = '서로에게 푹 빠져 있는 완벽한 찰떡궁합! 전생부터 이어진 운명 같은 인연입니다.';
    emoji = '💖';
  } else if (percent >= 75) {
    tier = '75';
    fallbackTitle = '설레는 핑크빛 기류';
    fallbackDesc = '눈만 마주쳐도 가슴이 두근거리는 사이! 언제든 불꽃이 타오를 수 있는 높은 궁합입니다.';
    emoji = '💘';
  } else if (percent >= 55) {
    tier = '50';
    fallbackTitle = '친구 이상의 묘한 썸';
    fallbackDesc = '편안하면서도 은근히 서로를 의식하게 되는 관계. 서로에 대한 호감이 쑥쑥 자라나고 있어요.';
    emoji = '🥰';
  } else if (percent >= 35) {
    tier = '30';
    fallbackTitle = '알쏭달쏭 밀당의 단계';
    fallbackDesc = '가까워질 듯 말 듯 묘한 긴장감이 흐르는 사이! 먼저 다가가면 반전의 매력이 열립니다.';
    emoji = '🤔';
  }

  const localizedDesc = typeof t === 'function' ? t(`match.verdict_${tier}`) : fallbackDesc;

  return {
    score: percent,
    emoji,
    title: fallbackTitle,
    desc: localizedDesc || fallbackDesc
  };
}

const TOP_SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권'];

/**
 * 나랑 99% 궁합이 되는 이름 검색 (역산 및 데이터베이스 탐색)
 * @param {string} myName - 본인 이름 (2~4글자)
 * @param {Array} pool - 이름 DB 목록 (객체 또는 배열)
 * @param {Object} options - { gender, type, limit }
 */
export function find99Matches(myName, pool = [], options = {}) {
  const cleanMyName = String(myName || '').trim();
  if (cleanMyName.length < 2) return [];

  const limit = options.limit || 30;
  const genderFilter = options.gender || 'all';
  const typeFilter = options.type || 'all';

  const results = [];
  const seen = new Set();

  const normalizedPool = (pool || []).map(item => {
    if (Array.isArray(item)) {
      return {
        name: item[0],
        hanja: item[2] || '',
        meaning: item[4] || '',
        gender: item[5] || '남녀공통'
      };
    }
    return item;
  }).filter(Boolean);

  // 1. 단일 이름 풀 탐색 (2자~3자 이름)
  if (typeFilter === 'all' || typeFilter === 'given') {
    for (const item of normalizedPool) {
      const candidateName = item.name;
      if (!candidateName || candidateName === cleanMyName) continue;
      if (genderFilter !== 'all' && item.gender && item.gender !== '남녀공통' && item.gender !== genderFilter) continue;

      const scoreAB = calculateMatch(cleanMyName, candidateName).percent;
      const scoreBA = calculateMatch(candidateName, cleanMyName).percent;

      if (scoreAB === 99 || scoreBA === 99) {
        if (!seen.has(candidateName)) {
          seen.add(candidateName);
          const isDouble = (scoreAB === 99 && scoreBA === 99);
          results.push({
            name: candidateName,
            hanja: item.hanja || '',
            meaning: item.meaning || `${candidateName}의 아름다운 의미`,
            gender: item.gender || '남녀공통',
            scoreAB,
            scoreBA,
            isDouble,
            primaryDirection: isDouble ? 'double' : (scoreAB === 99 ? 'AB' : 'BA')
          });

          if (results.length >= limit) break;
        }
      }
    }
  }

  // 2. 성씨 조합 풀 탐색 (3자 풀네임: 상위 15개 성씨 + 2자 이름)
  if (results.length < limit && (typeFilter === 'all' || typeFilter === 'full')) {
    for (const surname of TOP_SURNAMES) {
      for (const item of normalizedPool) {
        if (!item.name || item.name.length !== 2) continue;
        const fullName = surname + item.name;
        if (fullName === cleanMyName) continue;
        if (seen.has(fullName)) continue;
        if (genderFilter !== 'all' && item.gender && item.gender !== '남녀공통' && item.gender !== genderFilter) continue;

        const scoreAB = calculateMatch(cleanMyName, fullName).percent;
        const scoreBA = calculateMatch(fullName, cleanMyName).percent;

        if (scoreAB === 99 || scoreBA === 99) {
          seen.add(fullName);
          const isDouble = (scoreAB === 99 && scoreBA === 99);
          results.push({
            name: fullName,
            hanja: item.hanja || '',
            meaning: item.meaning || `${fullName}의 빛나는 뜻을 담은 이름`,
            gender: item.gender || '남녀공통',
            scoreAB,
            scoreBA,
            isDouble,
            primaryDirection: isDouble ? 'double' : (scoreAB === 99 ? 'AB' : 'BA')
          });

          if (results.length >= limit) break;
        }
      }
      if (results.length >= limit) break;
    }
  }

  // 쌍방 99% 우선 정렬
  results.sort((a, b) => {
    if (a.isDouble && !b.isDouble) return -1;
    if (!a.isDouble && b.isDouble) return 1;
    return 0;
  });

  return results.slice(0, limit);
}

// 모듈 내부 상태
let appCtx = null;
let currentNameA = '김수현';
let currentNameB = ''; // 사용자 요청: default로 김수현을 입력해놓고 반대를 비워둠
let activeMode = 'couple'; // 'couple' (커플 이름점 보기) | 'recommend' (궁합 99% 추천)
let activeDirection = 'AB'; // 'AB' or 'BA'
let recGenderFilter = 'all';
let recTypeFilter = 'all';
let activeKeyHandler = null;
let activeMountRoot = null;
let isMountStandalone = false;

export function setMatchNames(nameA, nameB) {
  if (nameA) currentNameA = nameA;
  if (typeof nameB === 'string') currentNameB = nameB;
}

export async function init(ctx) {
  appCtx = ctx;

  // 1. 모달 오픈 이벤트 리스너
  on('match:open', payload => {
    openMatchModal(payload);
  });

  // 2. 언어 변경 시 화면 실시간 갱신
  on('lang:change', () => {
    if (activeMountRoot) {
      renderMatchComponent(activeMountRoot, isMountStandalone);
    }
  });

  // 3. 독립 페이지(#match-page-app) 감지 시 자동 렌더링
  const standaloneContainer = document.getElementById('match-page-app');
  if (standaloneContainer) {
    renderMatchComponent(standaloneContainer, true);
  }
}

/** 이름점 모달 열기 */
export function openMatchModal(payload = {}) {
  const root = document.getElementById('match-root');
  if (!root) return;

  if (payload.nameA) currentNameA = payload.nameA;
  if (typeof payload.nameB === 'string') currentNameB = payload.nameB;

  renderMatchComponent(root, false);
}

/** 통합 렌더링 함수 (모달 or 독립 페이지 공용) */
export function renderMatchComponent(root, isStandalone = false) {
  activeMountRoot = root;
  isMountStandalone = isStandalone;

  root.hidden = false;

  const innerHtml = `
    <!-- 상단 모드 전환 탭 바 ('커플 이름점 보기' vs '궁합 99%가 되는 이름 추천') -->
    <nav class="match-mode-nav" role="tablist" aria-label="이름점 모드 선택">
      <button type="button" class="match-mode-tab ${activeMode === 'couple' ? 'active' : ''}" data-mode="couple" role="tab" aria-selected="${activeMode === 'couple'}">
        <span>${t('match.tab_couple')}</span>
      </button>
      <button type="button" class="match-mode-tab ${activeMode === 'recommend' ? 'active' : ''}" data-mode="recommend" role="tab" aria-selected="${activeMode === 'recommend'}">
        <span>${t('match.tab_recommend')}</span>
      </button>
    </nav>

    <div class="match-body">
      ${activeMode === 'couple' ? `
        <!-- 1. 커플 이름점 보기 모드 -->
        <div class="match-input-card">
          <div class="match-input-row">
            <div class="match-input-group">
              <label class="match-input-label match-label-a" for="match-input-a">
                <span>${t('match.input_label_a')}</span>
              </label>
              <div class="match-input-field-wrap">
                <input
                  type="text"
                  id="match-input-a"
                  class="match-input match-input-a"
                  value="${escapeHtml(currentNameA)}"
                  placeholder="${t('match.placeholder_a')}"
                  maxlength="5"
                  autocomplete="off" />
                ${currentNameA ? `<button type="button" class="match-input-clear" data-clear="A" aria-label="삭제">×</button>` : ''}
              </div>
            </div>

            <div class="match-vs-badge">❤️</div>

            <div class="match-input-group">
              <label class="match-input-label match-label-b" for="match-input-b">
                <span>${t('match.input_label_b')}</span>
              </label>
              <div class="match-input-field-wrap">
                <input
                  type="text"
                  id="match-input-b"
                  class="match-input match-input-b"
                  value="${escapeHtml(currentNameB)}"
                  placeholder="${t('match.placeholder_b')}"
                  maxlength="5"
                  autocomplete="off" />
                ${currentNameB ? `<button type="button" class="match-input-clear" data-clear="B" aria-label="삭제">×</button>` : ''}
              </div>
            </div>
          </div>

          <button type="button" class="match-calc-btn" id="match-calc-btn">
            <span>${t('match.btn_calc')}</span>
          </button>
        </div>

        <!-- 결과 및 추천 렌더링 컨테이너 -->
        <div id="match-result-container"></div>
      ` : `
        <!-- 2. 궁합 99%가 되는 이름 추천 모드 (역산 추천) -->
        <div class="match-recommend-card">
          <div class="match-rec-header">
            <span class="match-rec-badge">${t('match.rec_badge')}</span>
            <h3 class="match-rec-title">${t('match.rec_title')}</h3>
            <p class="match-rec-desc">${t('match.rec_desc')}</p>
          </div>

          <div class="match-rec-input-box">
            <label class="match-input-label match-label-a" for="match-rec-myname">${t('match.input_label_a')}</label>
            <div class="match-rec-input-row">
              <input
                type="text"
                id="match-rec-myname"
                class="match-input match-input-a"
                value="${escapeHtml(currentNameA)}"
                placeholder="${t('match.placeholder_a')}"
                maxlength="5"
                autocomplete="off" />
              <button type="button" class="match-rec-btn" id="match-rec-btn">
                <span>${t('match.rec_search_btn')}</span>
              </button>
            </div>
          </div>

          <!-- 필터 칩 바 -->
          <div class="match-rec-filters">
            <div class="match-filter-row">
              <span class="match-filter-label">${t('match.filter_type_label')}</span>
              <button type="button" class="match-filter-chip ${recTypeFilter === 'all' ? 'active' : ''}" data-filter-type="type" data-val="all">${t('match.filter_all')}</button>
              <button type="button" class="match-filter-chip ${recTypeFilter === 'given' ? 'active' : ''}" data-filter-type="type" data-val="given">${t('match.filter_given')}</button>
              <button type="button" class="match-filter-chip ${recTypeFilter === 'full' ? 'active' : ''}" data-filter-type="type" data-val="full">${t('match.filter_full')}</button>
            </div>
            <div class="match-filter-row">
              <span class="match-filter-label">${t('match.filter_gender_label')}</span>
              <button type="button" class="match-filter-chip ${recGenderFilter === 'all' ? 'active' : ''}" data-filter-type="gender" data-val="all">${t('match.filter_all')}</button>
              <button type="button" class="match-filter-chip ${recGenderFilter === '여성' ? 'active' : ''}" data-filter-type="gender" data-val="여성">${t('match.filter_female')}</button>
              <button type="button" class="match-filter-chip ${recGenderFilter === '남성' ? 'active' : ''}" data-filter-type="gender" data-val="남성">${t('match.filter_male')}</button>
            </div>
          </div>

          <!-- 추천 결과 리스트 컨테이너 -->
          <div id="match-rec-results-wrap" class="match-rec-results-wrap"></div>
        </div>
      `}
    </div>
  `;

  if (isStandalone) {
    // 독립형 페이지 모드
    root.innerHTML = innerHtml;
  } else {
    // 모달 다이얼로그 모드
    root.innerHTML = `
      <div class="match-overlay" role="dialog" aria-modal="true" aria-label="${t('match.header_badge')}">
        <div class="match-backdrop"></div>
        <div class="match-dialog">
          <header class="match-header">
            <div class="match-header-title-wrap">
              <span class="match-header-icon">💘</span>
              <h2 class="match-header-title">${t('match.header_badge')}</h2>
            </div>
            <button type="button" class="match-close-btn" aria-label="닫기">×</button>
          </header>
          ${innerHtml}
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';

    const overlay = root.querySelector('.match-overlay');
    const closeBtn = root.querySelector('.match-close-btn');

    const closeModal = () => {
      root.hidden = true;
      root.innerHTML = '';
      document.body.style.overflow = '';
      activeMountRoot = null;
      if (activeKeyHandler) {
        window.removeEventListener('keydown', activeKeyHandler);
        activeKeyHandler = null;
      }
    };

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', e => {
      if (e.target === overlay || e.target.classList.contains('match-backdrop')) {
        closeModal();
      }
    });

    if (activeKeyHandler) window.removeEventListener('keydown', activeKeyHandler);
    activeKeyHandler = e => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', activeKeyHandler);
  }

  // 상단 모드 전환 탭 바 이벤트 바인딩
  root.querySelectorAll('.match-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      if (mode === activeMode) return;
      activeMode = mode;
      renderMatchComponent(root, isStandalone);
    });
  });

  if (activeMode === 'couple') {
    // 커플 모드 이벤트 바인딩
    const calcBtn = root.querySelector('#match-calc-btn');
    const inputA = root.querySelector('#match-input-a');
    const inputB = root.querySelector('#match-input-b');

    // 입력값 변경 시 실시간 반응 (input 이벤트)
    const handleInputChanged = () => {
      currentNameA = (inputA?.value || '').trim();
      currentNameB = (inputB?.value || '').trim();
      renderResultsView(root, isStandalone);
    };

    inputA?.addEventListener('input', handleInputChanged);
    inputB?.addEventListener('input', handleInputChanged);

    // 삭제 버튼 (×)
    root.querySelectorAll('.match-input-clear').forEach(clearBtn => {
      clearBtn.addEventListener('click', () => {
        const target = clearBtn.dataset.clear;
        if (target === 'A' && inputA) {
          inputA.value = '';
          currentNameA = '';
        } else if (target === 'B' && inputB) {
          inputB.value = '';
          currentNameB = '';
        }
        renderMatchComponent(root, isStandalone);
      });
    });

    // 계산 버튼 클릭
    calcBtn?.addEventListener('click', () => {
      handleInputChanged();
      const container = root.querySelector('#match-result-container');
      container?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    renderResultsView(root, isStandalone);
  } else {
    // 99% 추천 모드 이벤트 바인딩
    const myNameInput = root.querySelector('#match-rec-myname');
    const searchBtn = root.querySelector('#match-rec-btn');

    // 필터 칩 클릭
    root.querySelectorAll('.match-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const filterType = chip.dataset.filterType;
        const val = chip.dataset.val;
        if (filterType === 'type') recTypeFilter = val;
        if (filterType === 'gender') recGenderFilter = val;
        renderMatchComponent(root, isStandalone);
      });
    });

    const executeRecommend = () => {
      const nameVal = (myNameInput?.value || '').trim();
      if (!/^[가-힣]+$/.test(nameVal) || nameVal.length < 2) {
        alert(t('match.alert_korean_only'));
        return;
      }
      currentNameA = nameVal;
      renderRecommendationsView(root, nameVal, isStandalone);
    };

    searchBtn?.addEventListener('click', executeRecommend);
    myNameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') executeRecommend(); });

    renderRecommendationsView(root, currentNameA, isStandalone);
  }
}

/**
 * 커플 탭 결과 뷰 렌더링:
 * 1) 양쪽 이름 모두 입력된 경우 -> 획수 풀이 트리 다이어그램 표시
 * 2) 한쪽 이름만 입력된 경우 (예: 김수현 입력, 상대 비움) -> 김수현의 99% 추천 후보들을 즉시 표시!
 * 3) 둘 다 비어 있는 경우 -> 안내 문구
 */
function renderResultsView(root, isStandalone = false) {
  const container = root.querySelector('#match-result-container');
  if (!container) return;

  const validA = /^[가-힣]{2,}$/.test(currentNameA);
  const validB = /^[가-힣]{2,}$/.test(currentNameB);

  if (validA && validB) {
    // 양쪽 이름 모두 입력됨 -> 커플 획수 트리 표 렌더링
    const dataAB = calculateMatch(currentNameA, currentNameB);
    const dataBA = calculateMatch(currentNameB, currentNameA);

    const isAB = activeDirection === 'AB';
    const activeData = isAB ? dataAB : dataBA;
    const firstName = isAB ? currentNameA : currentNameB;
    const secondName = isAB ? currentNameB : currentNameA;
    const verdict = getVerdict(activeData.percent);

    container.innerHTML = `
      <!-- 방향 전환 탭 (A->B vs B->A) -->
      <div class="match-direction-tabs" role="tablist">
        <button type="button" class="match-dir-tab ${isAB ? 'active' : ''}" data-dir="AB" role="tab" aria-selected="${isAB}">
          <span>${escapeHtml(currentNameA)} ➔ ${escapeHtml(currentNameB)}</span>
          <span class="match-dir-score">${dataAB.percent}%</span>
        </button>
        <button type="button" class="match-dir-tab ${!isAB ? 'active' : ''}" data-dir="BA" role="tab" aria-selected="${!isAB}">
          <span>${escapeHtml(currentNameB)} ➔ ${escapeHtml(currentNameA)}</span>
          <span class="match-dir-score">${dataBA.percent}%</span>
        </button>
      </div>

      <!-- 결과 카드 & 트리 표 -->
      <div class="match-result-card">
        <span class="match-result-badge">${verdict.emoji} ${escapeHtml(firstName)} ➔ ${escapeHtml(secondName)}</span>
        <h3 class="match-result-title">
          ${escapeHtml(firstName)} ➔ ${escapeHtml(secondName)}
        </h3>

        <div class="match-tree-wrap">
          ${renderTreeSvg(activeData, isAB)}
        </div>

        <div class="match-verdict-box">
          <div class="match-verdict-title">${verdict.emoji} ${verdict.title} (${activeData.percent}%)</div>
          <div class="match-verdict-desc">${verdict.desc}</div>
        </div>

        <!-- 액션 버튼 그리드 (카카오톡, 이미지 저장, 링크 복사) -->
        <div class="match-actions-grid" style="margin-top: 16px;">
          <button type="button" class="match-btn match-btn-kakao" id="match-share-kakao-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.857 1.867 5.372 4.686 6.744l-.986 3.633a.5.5 0 0 0 .75.534l4.336-2.89c.394.048.8.079 1.214.079 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            ${t('match.btn_kakao')}
          </button>
          <button type="button" class="match-btn match-btn-save" id="match-save-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            ${t('match.btn_save_image')}
          </button>
          <button type="button" class="match-btn match-btn-copy" id="match-copy-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            ${t('match.btn_copy_link')}
          </button>
        </div>
      </div>
    `;

    // 탭 클릭 이벤트
    container.querySelectorAll('.match-dir-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const dir = tab.dataset.dir;
        if (dir === activeDirection) return;
        activeDirection = dir;
        renderResultsView(root, isStandalone);
      });
    });

    // 버튼 이벤트 연결
    container.querySelector('#match-save-btn')?.addEventListener('click', () => {
      downloadMatchImage(firstName, secondName, activeData, verdict);
    });

    container.querySelector('#match-share-kakao-btn')?.addEventListener('click', () => {
      shareMatchImage(firstName, secondName, activeData, verdict);
    });

    container.querySelector('#match-copy-btn')?.addEventListener('click', () => {
      const url = `${location.origin}/match/?a=${encodeURIComponent(currentNameA)}&b=${encodeURIComponent(currentNameB)}`;
      navigator.clipboard?.writeText(url).then(() => {
        alert(t('match.copied_toast'));
      }).catch(() => {
        prompt(t('match.copied_toast'), url);
      });
    });

  } else if (validA || validB) {
    // 한쪽 이름만 입력된 경우 -> 해당 이름의 99% 추천 후보들을 즉시 표시!
    const targetName = validA ? currentNameA : currentNameB;
    const targetSlot = validA ? 'B' : 'A';
    const namesPool = appCtx?.names || [];
    const matches = find99Matches(targetName, namesPool, { limit: 20 });

    container.innerHTML = `
      <div class="match-inline-rec-card">
        <div class="match-inline-rec-header">
          <span class="match-inline-rec-badge">${t('match.badge_single_99')}</span>
          <h3 class="match-inline-rec-title">${t('match.rec_hint_header', { name: targetName })}</h3>
          <p class="match-inline-rec-desc">${t('match.rec_hint_sub')}</p>
        </div>

        <div class="match-rec-list">
          ${matches.map(item => `
            <article class="match-rec-item" data-candidate="${escapeHtml(item.name)}">
              <div class="match-rec-item-header">
                <div class="match-rec-item-name-group">
                  <span class="match-rec-item-name">${escapeHtml(item.name)}</span>
                  ${item.hanja ? `<span class="match-rec-item-hanja">(${escapeHtml(item.hanja)})</span>` : ''}
                  <span class="match-rec-item-badge ${item.isDouble ? 'is-double' : ''}">
                    ${item.isDouble ? t('match.badge_double_99') : t('match.badge_single_99')}
                  </span>
                </div>
                <button type="button" class="match-rec-item-btn match-pick-btn" data-candidate="${escapeHtml(item.name)}" data-direction="${item.primaryDirection}">
                  <span>${t('match.view_tree')}</span>
                </button>
              </div>
              <div class="match-rec-item-scores">
                <span class="match-score-pill">${t('match.score_to')} <strong>${item.scoreAB}%</strong></span>
                <span class="match-score-pill">${t('match.score_from')} <strong>${item.scoreBA}%</strong></span>
                ${item.gender ? `<span class="match-gender-pill">${escapeHtml(item.gender)}</span>` : ''}
              </div>
              <p class="match-rec-item-meaning">“${escapeHtml(item.meaning)}”</p>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    // 추천 후보의 [궁합 보기 👉] 클릭 시 상대방 이름칸을 채우고 트리 표 즉시 렌더링
    container.querySelectorAll('.match-pick-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const cand = btn.dataset.candidate;
        if (!cand) return;

        if (targetSlot === 'B') {
          currentNameB = cand;
          const inputB = root.querySelector('#match-input-b');
          if (inputB) inputB.value = cand;
        } else {
          currentNameA = cand;
          const inputA = root.querySelector('#match-input-a');
          if (inputA) inputA.value = cand;
        }

        renderResultsView(root, isStandalone);
      });
    });

  } else {
    // 둘 다 비어 있는 경우
    container.innerHTML = `
      <div class="match-rec-empty">
        <span class="match-rec-empty-icon">💘</span>
        <p class="match-rec-empty-text">${escapeHtml(t('match.rec_hint_sub'))}</p>
      </div>
    `;
  }
}

/** 99% 궁합 추천 리스트 렌더링 (추천 탭 전용) */
function renderRecommendationsView(root, myName, isStandalone = false) {
  const container = root.querySelector('#match-rec-results-wrap');
  if (!container) return;

  const namesPool = appCtx?.names || [];
  const matches = find99Matches(myName, namesPool, {
    gender: recGenderFilter,
    type: recTypeFilter,
    limit: 30
  });

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="match-rec-empty">
        <span class="match-rec-empty-icon">🌱</span>
        <p class="match-rec-empty-text">${escapeHtml(t('match.rec_empty'))}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="match-rec-count-bar">
      <span>${t('match.rec_count_found', { name: escapeHtml(myName), count: matches.length })}</span>
    </div>
    <div class="match-rec-list">
      ${matches.map(item => `
        <article class="match-rec-item">
          <div class="match-rec-item-header">
            <div class="match-rec-item-name-group">
              <span class="match-rec-item-name">${escapeHtml(item.name)}</span>
              ${item.hanja ? `<span class="match-rec-item-hanja">(${escapeHtml(item.hanja)})</span>` : ''}
              <span class="match-rec-item-badge ${item.isDouble ? 'is-double' : ''}">${item.isDouble ? t('match.badge_double_99') : t('match.badge_single_99')}</span>
            </div>
            <button type="button" class="match-rec-item-btn" data-candidate="${escapeHtml(item.name)}" data-direction="${item.primaryDirection}">
              <span>${t('match.view_tree')}</span>
            </button>
          </div>
          <div class="match-rec-item-scores">
            <span class="match-score-pill">${t('match.score_to')} <strong>${item.scoreAB}%</strong></span>
            <span class="match-score-pill">${t('match.score_from')} <strong>${item.scoreBA}%</strong></span>
            ${item.gender ? `<span class="match-gender-pill">${escapeHtml(item.gender)}</span>` : ''}
          </div>
          <p class="match-rec-item-meaning">“${escapeHtml(item.meaning)}”</p>
        </article>
      `).join('')}
    </div>
  `;

  // [표 보기 👉] 클릭 시 커플 모드로 전환하여 해당 이름과의 99% 트리 표를 바로 보여줌
  container.querySelectorAll('.match-rec-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cand = btn.dataset.candidate;
      const dir = btn.dataset.direction;
      if (!cand) return;

      currentNameA = myName;
      currentNameB = cand;
      activeDirection = dir === 'BA' ? 'BA' : 'AB';
      activeMode = 'couple';
      renderMatchComponent(root, isStandalone);
    });
  });
}

/** SVG 트리 브랜치 다이어그램 렌더링 */
function renderTreeSvg(data, isAB) {
  const { interleave, charOrigins, steps, percent } = data;
  const numCols = interleave.length;

  const width = 420;
  const padX = 26;
  const colSpacing = (width - padX * 2) / (numCols - 1);

  const rowHeight = 46;
  const circleY = 32;
  const startY = 74;
  const totalRows = steps.length;
  const svgHeight = startY + (totalRows - 1) * rowHeight + 64;

  let svgElements = '';

  // 1. 최상단 원형 글자 배지 (Row 0 글자)
  interleave.forEach((char, i) => {
    const cx = padX + i * colSpacing;
    const origin = charOrigins[i];
    const isA = (isAB && origin === 'A') || (!isAB && origin === 'B');
    const color = isA ? '#DC2626' : '#D97706';

    svgElements += `
      <!-- 원형 테두리 -->
      <circle cx="${cx}" cy="${circleY}" r="18" fill="#FFFFFF" stroke="#9CA3AF" stroke-width="1.2" />
      <!-- 글자 -->
      <text x="${cx}" y="${circleY + 6.5}" text-anchor="middle" font-size="18" font-weight="800" font-family="'Noto Sans KR', sans-serif" fill="${color}">${escapeHtml(char)}</text>
    `;
  });

  // 2. 각 단계별 숫자와 브랜치 연결선 (Fork Bracket)
  for (let r = 0; r < totalRows; r++) {
    const rowNums = steps[r];
    const currentY = startY + r * rowHeight;
    const rowCount = rowNums.length;
    const offset = r * (colSpacing / 2);

    // 숫자 렌더링
    rowNums.forEach((num, c) => {
      const x = padX + offset + c * colSpacing;
      svgElements += `
        <text x="${x}" y="${currentY + 5}" text-anchor="middle" font-size="16" font-weight="700" font-family="'Noto Sans KR', sans-serif" fill="#4B5563">${num}</text>
      `;
    });

    // 브랜치 연결선: r 행의 각 쌍 (c, c+1)을 연결하여 r+1 행의 c번째 자식으로 내림
    if (r < totalRows - 1) {
      const nextY = startY + (r + 1) * rowHeight;
      const midY = currentY + (rowHeight * 0.44);

      for (let c = 0; c < rowCount - 1; c++) {
        const xLeft = padX + offset + c * colSpacing;
        const xRight = padX + offset + (c + 1) * colSpacing;
        const xChild = (xLeft + xRight) / 2;

        svgElements += `
          <!-- 연결 U-브래킷 -->
          <path d="M ${xLeft} ${currentY + 11} L ${xLeft} ${midY} L ${xRight} ${midY} L ${xRight} ${currentY + 11} M ${xChild} ${midY} L ${xChild} ${nextY - 9}" fill="none" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        `;
      }
    }
  }

  // 3. 최하단 2자리 숫자 아래 브랜치 및 최종 빨간색 퍼센트 렌더링
  const lastRowY = startY + (totalRows - 1) * rowHeight;
  const lastOffset = (totalRows - 1) * (colSpacing / 2);
  const xLast0 = padX + lastOffset;
  const xLast1 = padX + lastOffset + colSpacing;
  const xCenter = (xLast0 + xLast1) / 2;
  const finalMidY = lastRowY + (rowHeight * 0.38);
  const finalY = lastRowY + (rowHeight * 0.95);

  svgElements += `
    <!-- 마지막 2자리 연결 브랜치 -->
    <path d="M ${xLast0} ${lastRowY + 11} L ${xLast0} ${finalMidY} L ${xLast1} ${finalMidY} L ${xLast1} ${lastRowY + 11} M ${xCenter} ${finalMidY} L ${xCenter} ${finalY - 14}" fill="none" stroke="#9CA3AF" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    <!-- 최종 퍼센트 강조 -->
    <text x="${xCenter}" y="${finalY + 8}" text-anchor="middle" font-size="28" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#DC2626">${percent}%</text>
  `;

  return `
    <svg class="match-tree-svg" viewBox="0 0 ${width} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${svgElements}
    </svg>
  `;
}

/** 캔버스 고해상도 이미지 생성 */
function createMatchCanvas(firstName, secondName, matchData, verdict) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  // 1. 따뜻한 감성 배경 그라디언트
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1440);
  bgGrad.addColorStop(0.0, '#FFFBF8');
  bgGrad.addColorStop(0.5, '#FFF2ED');
  bgGrad.addColorStop(1.0, '#FFE8E8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1440);

  // 2. 모서리 액센트 프레임
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, 40, 40, 1000, 1360, 32);
  ctx.stroke();

  // 3. 상단 세련된 브랜딩 워드마크
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(28, 25, 23, 0.45)';
  ctx.font = '700 22px "Noto Sans KR", system-ui, sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
  ctx.fillText('TELLMYNAME', 540, 110);

  ctx.fillStyle = '#DC2626';
  ctx.font = '800 24px "Noto Sans KR", system-ui, sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText(t('match.header_badge'), 540, 155);
  ctx.restore();

  // 4. 이름 타이틀
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1C1917';
  ctx.font = '800 52px "Noto Serif KR", serif';
  ctx.fillText(`${firstName}  ❤️  ${secondName}`, 540, 235);

  ctx.fillStyle = '#78716C';
  ctx.font = '600 24px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillText(`${firstName} ➔ ${secondName}`, 540, 290);
  ctx.restore();

  // 5. 트리 다이어그램 렌더링
  const { interleave, charOrigins, steps, percent } = matchData;
  const numCols = interleave.length;
  const padX = 140;
  const widthArea = 1080 - padX * 2;
  const colSpacing = widthArea / (numCols - 1);

  const startY = 470;
  const rowHeight = 90;
  const circleY = 390;

  // 원형 글자 배지
  interleave.forEach((char, i) => {
    const cx = padX + i * colSpacing;
    const origin = charOrigins[i];
    const isA = origin === 'A';
    const color = isA ? '#DC2626' : '#D97706';

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, circleY, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = '800 36px "Noto Sans KR", system-ui, sans-serif';
    ctx.fillText(char, cx, circleY);
    ctx.restore();
  });

  // 숫자 및 브랜치 선 그리기
  const totalRows = steps.length;
  for (let r = 0; r < totalRows; r++) {
    const rowNums = steps[r];
    const currentY = startY + r * rowHeight;
    const rowCount = rowNums.length;
    const offset = r * (colSpacing / 2);

    // 숫자
    rowNums.forEach((num, c) => {
      const x = padX + offset + c * colSpacing;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#374151';
      ctx.font = '700 32px "Noto Sans KR", system-ui, sans-serif';
      ctx.fillText(String(num), x, currentY);
      ctx.restore();
    });

    // 브랜치 선
    if (r < totalRows - 1) {
      const nextY = startY + (r + 1) * rowHeight;
      const midY = currentY + (rowHeight * 0.44);

      ctx.save();
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let c = 0; c < rowCount - 1; c++) {
        const xLeft = padX + offset + c * colSpacing;
        const xRight = padX + offset + (c + 1) * colSpacing;
        const xChild = (xLeft + xRight) / 2;

        ctx.beginPath();
        ctx.moveTo(xLeft, currentY + 22);
        ctx.lineTo(xLeft, midY);
        ctx.lineTo(xRight, midY);
        ctx.lineTo(xRight, currentY + 22);
        ctx.moveTo(xChild, midY);
        ctx.lineTo(xChild, nextY - 20);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // 마지막 퍼센트 브랜치 및 텍스트
  const lastRowY = startY + (totalRows - 1) * rowHeight;
  const lastOffset = (totalRows - 1) * (colSpacing / 2);
  const xLast0 = padX + lastOffset;
  const xLast1 = padX + lastOffset + colSpacing;
  const xCenter = (xLast0 + xLast1) / 2;
  const finalMidY = lastRowY + (rowHeight * 0.38);
  const finalY = lastRowY + (rowHeight * 1.05);

  ctx.save();
  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(xLast0, lastRowY + 22);
  ctx.lineTo(xLast0, finalMidY);
  ctx.lineTo(xLast1, finalMidY);
  ctx.lineTo(xLast1, lastRowY + 22);
  ctx.moveTo(xCenter, finalMidY);
  ctx.lineTo(xCenter, finalY - 30);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#DC2626';
  ctx.font = '900 62px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillText(`${percent}%`, xCenter, finalY);
  ctx.restore();

  // 6. 하단 총평 카드
  const verdictBoxY = Math.max(finalY + 70, 1160);
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FECDD3';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, 160, verdictBoxY, 760, 110, 20);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#BE123C';
  ctx.font = '800 28px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillText(`${verdict.emoji}  ${verdict.title}`, 540, verdictBoxY + 38);

  ctx.fillStyle = '#4C0519';
  ctx.font = '500 20px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillText(verdict.desc, 540, verdictBoxY + 76);
  ctx.restore();

  // 7. 최하단 워터마크 뱃지
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(28, 25, 23, 0.4)';
  ctx.font = '500 18px "Noto Sans KR", system-ui, sans-serif';
  ctx.fillText('tellmyname.com · 이름 궁합 이름점', 540, 1340);
  ctx.restore();

  return canvas;
}

/** 이미지 다운로드 */
function downloadMatchImage(firstName, secondName, matchData, verdict) {
  const canvas = createMatchCanvas(firstName, secondName, matchData, verdict);
  canvas.toBlob(blob => {
    if (!blob) return;
    const fileName = `이름궁합_${firstName}_${secondName}.png`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/** 모바일 Web Share (카카오톡, 인스타 등 공유) */
function shareMatchImage(firstName, secondName, matchData, verdict) {
  const canvas = createMatchCanvas(firstName, secondName, matchData, verdict);
  canvas.toBlob(async blob => {
    if (!blob) return;
    const fileName = `이름궁합_${firstName}_${secondName}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    let canShare = false;
    try {
      canShare = Boolean(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
    } catch {
      canShare = false;
    }

    if (canShare) {
      try {
        await navigator.share({
          files: [file],
          title: `${firstName} ❤️ ${secondName} 이름 궁합`,
          text: `우리 이름 궁합은 ${matchData.percent}% (${verdict.title})! tellmyname.com에서 확인해보세요 ✨`,
          url: `${location.origin}/match/?a=${encodeURIComponent(currentNameA)}&b=${encodeURIComponent(currentNameB)}`
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    // fallback to download
    downloadMatchImage(firstName, secondName, matchData, verdict);
    alert('궁합 이미지가 저장되었습니다! 카카오톡이나 인스타그램에 공유해보세요 💛');
  }, 'image/png');
}

/** 둥근 사각형 헬퍼 */
function drawRoundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y, x + r, y + h, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
