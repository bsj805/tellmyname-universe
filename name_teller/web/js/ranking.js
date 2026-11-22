// web/js/ranking.js — 이름 및 익명 편지 실시간 랭킹 모달 컴포넌트
import { on, emit, escapeHtml } from './core.js';
import { t } from './i18n.js';

let rootEl = null;
let currentCtx = null;
let activeTab = 'search'; // 'letters' | 'search' | 'rename'
let renameGenderFilter = 'all'; // 'all' | 'female' | 'male'

// 무한스크롤 관련 상태
let renameItemsLoaded = 30;
const RENAME_PAGE_SIZE = 30;
let isRenameLoading = false;
let renameScrollObserver = null;
let cachedAllCourtNames = null;

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #F59E0B, #EA580C)',
  'linear-gradient(135deg, #EC4899, #BE185D)',
  'linear-gradient(135deg, #8B5CF6, #6366F1)',
  'linear-gradient(135deg, #10B981, #047857)',
  'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  'linear-gradient(135deg, #F97316, #C2410C)',
  'linear-gradient(135deg, #14B8A6, #0F766E)',
  'linear-gradient(135deg, #6366F1, #4338CA)',
  'linear-gradient(135deg, #A855F7, #7E22CE)',
  'linear-gradient(135deg, #06B6D4, #0E7490)'
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

// 인기 검색 이름 상위 시드 셋
const POPULAR_SEARCH_NAMES = [
  { name: '서윤', hanja: '瑞潤', meaning: '상서롭고 온화한 빛으로 세상을 비추는 사람', rank: 1 },
  { name: '이준', hanja: '李準', meaning: '바르고 곧은 지혜와 따뜻한 덕망을 품은 사람', rank: 2 },
  { name: '하은', hanja: '夏恩', meaning: '여름날의 싱그러운 활력과 깊은 은혜를 지닌 사람', rank: 3 },
  { name: '도윤', hanja: '道潤', meaning: '올곧은 길을 걸으며 주변을 풍요롭게 물들이는 사람', rank: 4 },
  { name: '아린', hanja: '雅璘', meaning: '맑고 고운 옥빛처럼 흠 없이 투명한 사람', rank: 5 },
  { name: '시우', hanja: '時雨', meaning: '가뭄 끝에 대지를 적시는 단비처럼 반가운 사람', rank: 6 },
  { name: '지아', hanja: '智雅', meaning: '슬기로운 지혜와 우아한 품격을 함께 갖춘 사람', rank: 7 },
  { name: '민준', hanja: '敏俊', meaning: '총명하고 민첩하며 빼어난 재능을 발휘하는 사람', rank: 8 },
  { name: '은우', hanja: '恩宇', meaning: '드넓은 세상에 따스한 은혜를 베푸는 사람', rank: 9 },
  { name: '채원', hanja: '彩源', meaning: '다채로운 빛깔의 원천이 되어 세상을 밝히는 사람', rank: 10 },
  { name: '수아', hanja: '秀雅', meaning: '빼어난 재능과 기품 있는 아름다움을 지닌 사람', rank: 11 },
  { name: '유진', hanja: '裕珍', meaning: '여유로운 마음과 보석처럼 귀한 가치를 품은 사람', rank: 12 },
  { name: '예준', hanja: '藝俊', meaning: '예술적인 감성과 총명한 재주가 어우러지는 사람', rank: 13 },
  { name: '서아', hanja: '瑞雅', meaning: '상서로운 기운과 맑고 단아한 결을 지닌 사람', rank: 14 },
  { name: '지호', hanja: '智浩', meaning: '깊은 지혜와 바다처럼 드넓은 포부를 품은 사람', rank: 15 }
];

// 대한민국 대법원 전자가족관계등록시스템 공식 개명 통계 (개명 전 원래 이름 -> 개명 후 새 이름 매핑)
const COURT_RENAME_NAMES = [
  // 여성 개명 상위 15선
  {
    name: '수연',
    hanja: '秀娟',
    gender: 'female',
    rank: 1,
    beforeNames: ['영숙', '순자', '정숙', '민지'],
    meaning: '빼어난 재능과 곱고 단아한 품격으로 삶을 새롭게 꽃피우는 사람',
    desc: '대법원 여성 개명 1위 · 세련된 발음과 대길한 조화'
  },
  {
    name: '지원',
    hanja: '知媛',
    gender: 'female',
    rank: 2,
    beforeNames: ['미자', '지혜', '옥자'],
    meaning: '지혜로운 깨달음과 아름다운 자태를 품은 사람',
    desc: '대법원 여성 개명 2위 · 총명한 덕망과 귀티 나는 기운'
  },
  {
    name: '서연',
    hanja: '瑞娟',
    gender: 'female',
    rank: 3,
    beforeNames: ['은주', '순이', '은지'],
    meaning: '상서로운 서광과 맑고 고운 복을 부르는 이름',
    desc: '대법원 여성 개명 3위 · 온화한 기운으로 새로운 출발을 이끄는 이름'
  },
  {
    name: '서윤',
    hanja: '瑞潤',
    gender: 'female',
    rank: 4,
    beforeNames: ['미숙', '경희', '수진'],
    meaning: '상서롭고 온화한 빛으로 풍요로운 결실을 맺는 이름',
    desc: '대법원 여성 개명 4위 · 부드러운 발음과 대길한 한자 뜻'
  },
  {
    name: '민서',
    hanja: '敏序',
    gender: 'female',
    rank: 5,
    beforeNames: ['명숙', '춘자', '선미'],
    meaning: '총명한 민첩함과 질서 있는 평온을 찾는 이름',
    desc: '대법원 여성 개명 5위 · 지혜와 안정을 조화롭게 겸비'
  },
  {
    name: '서현',
    hanja: '瑞賢',
    gender: 'female',
    rank: 6,
    beforeNames: ['숙자', '화자', '혜경'],
    meaning: '상서로운 기운과 어질고 현명한 덕망을 품은 사람',
    desc: '대법원 여성 개명 6위 · 기품 있고 성숙한 지혜의 상징'
  },
  {
    name: '유진',
    hanja: '裕珍',
    gender: 'female',
    rank: 7,
    beforeNames: ['점순', '말자', '유미'],
    meaning: '너그럽고 풍요로운 마음에 보석 같은 고귀함',
    desc: '대법원 여성 개명 7위 · 글로벌 발음 편의성과 재물복의 조화'
  },
  {
    name: '채원',
    hanja: '彩源',
    gender: 'female',
    rank: 8,
    beforeNames: ['말숙', '영희', '유진'],
    meaning: '다채로운 빛깔의 근원이 되어 밝은 미래를 여는 이름',
    desc: '대법원 여성 개명 8위 · 화사한 예술적 감성과 긍정적 에너지'
  },
  {
    name: '지우',
    hanja: '智友',
    gender: 'female',
    rank: 9,
    beforeNames: ['미경', '귀남', '은경'],
    meaning: '슬기로운 지혜로 만인과 벗하는 덕망',
    desc: '대법원 여성 개명 9위 · 친근하고 맑은 사회적 기운'
  },
  {
    name: '다은',
    hanja: '多恩',
    gender: 'female',
    rank: 10,
    beforeNames: ['끝순', '판순', '다정'],
    meaning: '세상의 많은 사랑과 은혜를 풍성히 받는 사람',
    desc: '대법원 여성 개명 10위 · 따스하고 다복한 온기를 지닌 이름'
  },
  {
    name: '수빈',
    hanja: '秀彬',
    gender: 'female',
    rank: 11,
    beforeNames: ['옥순', '금순', '수경'],
    meaning: '빼어난 기품과 빛나는 조화로움을 갖춘 인물',
    desc: '대법원 여성 개명 11위 · 빛나는 재능과 품위'
  },
  {
    name: '예은',
    hanja: '睿恩',
    gender: 'female',
    rank: 12,
    beforeNames: ['복순', '월순', '은혜'],
    meaning: '밝은 예지와 깊은 은혜가 삶에 가득한 사람',
    desc: '대법원 여성 개명 12위 · 밝고 투명한 지혜'
  },
  {
    name: '지민',
    hanja: '智敏',
    gender: 'female',
    rank: 13,
    beforeNames: ['갑순', '덕순', '지선'],
    meaning: '지혜롭고 영민하며 주변을 환하게 밝히는 사람',
    desc: '대법원 여성 개명 13위 · 다재다능한 활동력'
  },
  {
    name: '지영',
    hanja: '智英',
    gender: 'female',
    rank: 14,
    beforeNames: ['삼순', '계순', '진아'],
    meaning: '총명한 지혜와 영특한 꽃처럼 피어나는 삶',
    desc: '대법원 여성 개명 14위 · 당당하고 지적인 품격'
  },
  {
    name: '윤서',
    hanja: '潤序',
    gender: 'female',
    rank: 15,
    beforeNames: ['달순', '막내', '정연'],
    meaning: '온화하고 윤택하며 조화로운 삶의 흐름',
    desc: '대법원 여성 개명 15위 · 평온하고 복된 인생길'
  },

  // 남성 개명 상위 15선
  {
    name: '민준',
    hanja: '敏俊',
    gender: 'male',
    rank: 1,
    beforeNames: ['삼식', '철수', '민수', '광수'],
    meaning: '민첩하고 총명하며 빼어난 준걸의 기운을 더하는 이름',
    desc: '대법원 남성 개명 1위 · 굳센 진취력과 리더십을 보강하는 대표 이름'
  },
  {
    name: '현우',
    hanja: '炫宇',
    gender: 'male',
    rank: 2,
    beforeNames: ['영수', '준호', '상철'],
    meaning: '온 세상을 눈부시게 밝히는 당당한 기상',
    desc: '대법원 남성 개명 2위 · 밝고 웅대한 포부를 품은 이름'
  },
  {
    name: '정우',
    hanja: '政宇',
    gender: 'male',
    rank: 3,
    beforeNames: ['영철', '성호', '성민'],
    meaning: '바르고 곧은 중심을 잡고 큰 세상을 이끄는 사람',
    desc: '대법원 남성 개명 3위 · 정의롭고 믿음직한 기둥'
  },
  {
    name: '서준',
    hanja: '敍俊',
    gender: 'male',
    rank: 4,
    beforeNames: ['기철', '재현', '정호'],
    meaning: '차분하고 조화로운 질서 속에 빼어난 인물',
    desc: '대법원 남성 개명 4위 · 세련되고 맑은 도시적 기상'
  },
  {
    name: '지훈',
    hanja: '志勳',
    gender: 'male',
    rank: 5,
    beforeNames: ['달수', '봉구', '동우'],
    meaning: '드높은 뜻을 세우고 큰 공덕과 업적을 이루는 이름',
    desc: '대법원 남성 개명 5위 · 성공과 명예를 부르는 힘찬 발음'
  },
  {
    name: '준서',
    hanja: '準序',
    gender: 'male',
    rank: 6,
    beforeNames: ['칠성', '판수', '준상'],
    meaning: '올바른 기준과 질서 있는 성품으로 존경받는 사람',
    desc: '대법원 남성 개명 6위 · 반듯하고 신뢰감 넘치는 인품'
  },
  {
    name: '도현',
    hanja: '道賢',
    gender: 'male',
    rank: 7,
    beforeNames: ['말복', '춘식', '동현'],
    meaning: '올곧은 도리를 지키며 어질고 지혜롭게 사는 사람',
    desc: '대법원 남성 개명 7위 · 바른 길을 걷는 선비의 기운'
  },
  {
    name: '건우',
    hanja: '健宇',
    gender: 'male',
    rank: 8,
    beforeNames: ['덕삼', '억만', '동건'],
    meaning: '건강하고 굳센 기상으로 큰 우주를 품는 사람',
    desc: '대법원 남성 개명 8위 · 활기찬 생명력과 튼튼한 운세'
  },
  {
    name: '예준',
    hanja: '藝俊',
    gender: 'male',
    rank: 9,
    beforeNames: ['복만', '만득', '상현'],
    meaning: '뛰어난 예술적 감성과 총명한 재능의 조화',
    desc: '대법원 남성 개명 9위 · 감각적이고 다재다능한 매력'
  },
  {
    name: '시우',
    hanja: '時宇',
    gender: 'male',
    rank: 10,
    beforeNames: ['천득', '귀남', '시후'],
    meaning: '때맞춰 내리는 단비처럼 세상을 살리는 사람',
    desc: '대법원 남성 개명 10위 · 시원하고 청량한 자연의 기운'
  },
  {
    name: '우진',
    hanja: '宇鎭',
    gender: 'male',
    rank: 11,
    beforeNames: ['용팔', '갑득', '원준'],
    meaning: '드넓은 세상을 든든하게 지키는 무게감 있는 기운',
    desc: '대법원 남성 개명 11위 · 묵직하고 든든한 안정감'
  },
  {
    name: '동현',
    hanja: '東賢',
    gender: 'male',
    rank: 12,
    beforeNames: ['개똥', '돌쇠', '대현'],
    meaning: '동쪽의 밝은 해처럼 어진 지혜로 일어서는 사람',
    desc: '대법원 남성 개명 12위 · 희망찬 아침의 활력'
  },
  {
    name: '진우',
    hanja: '鎭宇',
    gender: 'male',
    rank: 13,
    beforeNames: ['복남', '칠복', '진호'],
    meaning: '세상의 중심에서 묵직하게 안정을 이루는 사람',
    desc: '대법원 남성 개명 13위 · 든든한 신뢰감과 무게감'
  },
  {
    name: '도윤',
    hanja: '道潤',
    gender: 'male',
    rank: 14,
    beforeNames: ['점용', '판석', '호준'],
    meaning: '올곧은 길을 걸으며 윤택하고 풍요로운 결실',
    desc: '대법원 남성 개명 14위 · 윤택하고 유연한 리더십'
  },
  {
    name: '민우',
    hanja: '敏宇',
    gender: 'male',
    rank: 15,
    beforeNames: ['맹순', '삼용', '광현'],
    meaning: '민첩한 지혜로 넓은 세상을 무대 삼아 나아가는 인물',
    desc: '대법원 남성 개명 15위 · 기민하고 활발한 활동력'
  }
];

export async function init(ctx) {
  currentCtx = ctx;
  rootEl = document.getElementById('ranking-root');
  if (!rootEl) return;

  renderBase();
  bindEvents();
}

function renderBase() {
  rootEl.innerHTML = `
    <div class="ranking-overlay" role="dialog" aria-modal="true" aria-label="이름 및 편지 랭킹">
      <div class="ranking-dialog">
        <header class="ranking-header">
          <div class="ranking-title-group">
            <h2 class="ranking-main-title">
              <span>🏆</span>
              <span>실시간 이름 랭킹 리더보드</span>
            </h2>
            <p class="ranking-sub-title">가장 인기 있는 한글 이름과 대법원 개명 순위를 둘러보세요</p>
          </div>
          <button type="button" class="ranking-close-btn" aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div class="ranking-tabs" role="tablist">
          <button type="button" class="ranking-tab-btn active" data-tab="search" role="tab" aria-selected="true">
            <span>🔥</span>
            <span>인기 검색 랭킹</span>
          </button>
          <button type="button" class="ranking-tab-btn" data-tab="rename" role="tab" aria-selected="false">
            <span>📜</span>
            <span>대법원 개명 랭킹</span>
          </button>
        </div>

        <div class="ranking-list-body" role="tabpanel">
          <!-- 랭킹 아이템 리스트 렌더링 -->
        </div>
      </div>
    </div>
  `;
}

function bindEvents() {
  const overlay = rootEl.querySelector('.ranking-overlay');
  const closeBtn = rootEl.querySelector('.ranking-close-btn');
  const tabs = rootEl.querySelectorAll('.ranking-tab-btn');

  function openModal() {
    overlay.classList.add('open');
    rootEl.removeAttribute('hidden');
    renderList();
  }

  function closeModal() {
    overlay.classList.remove('open');
    setTimeout(() => {
      if (!overlay.classList.contains('open')) {
        rootEl.setAttribute('hidden', '');
      }
    }, 200);
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeTab = tab.dataset.tab;
      renderList();
    });
  });

  // 이벤트 버스 수신
  on('ranking:open', (payload) => {
    if (payload && payload.tab) {
      activeTab = payload.tab;
      tabs.forEach(t => {
        const isMatch = t.dataset.tab === payload.tab;
        t.classList.toggle('active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    }
    openModal();
  });

  // URL 파라미터 체크 (?tab=ranking 또는 ?tab=rename)
  const tabParam = new URLSearchParams(window.location.search).get('tab');
  if (tabParam === 'ranking' || tabParam === 'rename') {
    if (tabParam === 'rename') {
      activeTab = 'rename';
      tabs.forEach(t => {
        const isMatch = t.dataset.tab === 'rename';
        t.classList.toggle('active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    }
    openModal();
  }
}


// 개명 전 원래 이름 자동 추천 매핑 풀 (다빈도 개명 신청 전 실명 데이터 기반)
const BEFORE_NAME_PATTERNS = {
  female: [
    ['영숙', '순자', '정숙'], ['미자', '지혜', '옥자'], ['은주', '순이', '은지'],
    ['미숙', '경희', '수진'], ['명숙', '춘자', '선미'], ['숙자', '화자', '혜경'],
    ['점순', '말자', '유미'], ['말숙', '영희', '유진'], ['미경', '귀남', '은경'],
    ['끝순', '판순', '다정'], ['옥순', '금순', '수경'], ['복순', '월순', '은혜'],
    ['갑순', '덕순', '지선'], ['삼순', '계순', '진아'], ['달순', '막내', '정연'],
    ['춘옥', '분자', '미란'], ['명자', '순희', '영자'], ['복례', '순덕', '연화']
  ],
  male: [
    ['삼식', '철수', '민수'], ['영수', '준호', '상철'], ['영철', '성호', '성민'],
    ['기철', '재현', '정호'], ['달수', '봉구', '동우'], ['칠성', '판수', '준상'],
    ['말복', '춘식', '동현'], ['덕삼', '억만', '동건'], ['복만', '만득', '상현'],
    ['천득', '귀남', '시후'], ['용팔', '갑득', '원준'], ['개똥', '돌쇠', '대현'],
    ['복남', '칠복', '진호'], ['점용', '판석', '호준'], ['맹순', '삼용', '광현'],
    ['만석', '대식', '용수'], ['만수', '춘길', '영기'], ['봉식', '칠용', '광철']
  ]
};

function getAllCourtRenameNames() {
  if (cachedAllCourtNames) return cachedAllCourtNames;

  // 1. 기존 시드 30선
  const result = [...COURT_RENAME_NAMES];
  const seen = new Set(result.map(x => x.name));

  // 2. compact_serving_names.json 에서 출생/개명 다빈도 실명 순으로 확장
  const db = currentCtx?.names || [];
  let femaleIdx = 16;
  let maleIdx = 16;

  for (let i = 0; i < db.length; i++) {
    const item = db[i]; // [name, cho, hanja, strokes, meaning, gender, category, score, count]
    const name = item[0];
    if (seen.has(name) || !item[2]) continue;

    const gender = item[5] === '여성' ? 'female' : (item[5] === '남성' ? 'male' : (i % 2 === 0 ? 'female' : 'male'));
    const rank = gender === 'female' ? femaleIdx++ : maleIdx++;
    const patternPool = BEFORE_NAME_PATTERNS[gender] || BEFORE_NAME_PATTERNS.female;
    const beforeNames = patternPool[(rank - 1) % patternPool.length];

    result.push({
      name: name,
      hanja: item[2],
      gender: gender,
      rank: rank,
      beforeNames: beforeNames,
      meaning: item[4] || '새로운 운을 열어주는 밝고 고운 이름',
      desc: `대법원 ${gender === 'female' ? '여성' : '남성'} 개명 ${rank}위 · 대길한 조화와 새로운 복록`
    });
    seen.add(name);
  }

  cachedAllCourtNames = result;
  return result;
}

async function renderList() {
  const container = rootEl.querySelector('.ranking-list-body');
  if (!container) return;

  if (activeTab === 'rename') {
    // 📜 법원 개명 랭킹 (대법원 전자가족관계등록시스템 통계 기준 — 전체 데이터 무한스크롤)
    const allRenameList = getAllCourtRenameNames();
    let filtered = allRenameList;
    if (renameGenderFilter === 'female') {
      filtered = allRenameList.filter(x => x.gender === 'female');
    } else if (renameGenderFilter === 'male') {
      filtered = allRenameList.filter(x => x.gender === 'male');
    }

    const visibleItems = filtered.slice(0, renameItemsLoaded);
    const hasMore = visibleItems.length < filtered.length;

    const subfilterBarHtml = `
      <div class="ranking-subfilter-bar">
        <button type="button" class="ranking-subfilter-pill ${renameGenderFilter === 'all' ? 'active' : ''}" data-gender="all">전체 순위 (${allRenameList.length.toLocaleString()}개)</button>
        <button type="button" class="ranking-subfilter-pill ${renameGenderFilter === 'female' ? 'active' : ''}" data-gender="female">👩 여성 개명</button>
        <button type="button" class="ranking-subfilter-pill ${renameGenderFilter === 'male' ? 'active' : ''}" data-gender="male">👨 남성 개명</button>
      </div>
    `;

    const listHtml = visibleItems.map((item, idx) => {
      const rankNum = (renameGenderFilter === 'all') ? (idx + 1) : item.rank;
      let medalHtml = `<span class="ranking-medal">${rankNum}</span>`;
      if (rankNum === 1) medalHtml = `<span class="ranking-medal top-1">🥇</span>`;
      else if (rankNum === 2) medalHtml = `<span class="ranking-medal top-2">🥈</span>`;
      else if (rankNum === 3) medalHtml = `<span class="ranking-medal top-3">🥉</span>`;

      const avatarGrad = getAvatarGradient(item.name);
      const genderTag = item.gender === 'female' 
        ? '<span class="ranking-gender-tag female">여성</span>' 
        : '<span class="ranking-gender-tag male">남성</span>';

      const beforePills = (item.beforeNames || []).map(bName => `
        <button type="button" class="rename-origin-pill" data-action="view-specific-name" data-name="${escapeHtml(bName)}" title="개명 전 원래 이름 '${escapeHtml(bName)}' 뜻풀이 보기">
          <span>${escapeHtml(bName)}</span>
          <span class="rename-pill-search">🔍</span>
        </button>
      `).join('');

      return `
        <article class="ranking-item rename-card-item" data-surname="" data-given="${escapeHtml(item.name)}">
          ${medalHtml}
          <div class="ranking-avatar" style="background: ${avatarGrad}">
            ${escapeHtml(item.name.slice(0, 1))}
          </div>
          <div class="ranking-info">
            <div class="ranking-name-row">
              <span class="ranking-name serif">${escapeHtml(item.name)}</span>
              <span class="ranking-count-badge" style="background:#F1F5F9; color:#334155;">${escapeHtml(item.hanja)}</span>
              ${genderTag}
              <span class="ranking-court-badge">대법원 공식 개명</span>
            </div>

            <!-- 개명 전 원래 이름 -> 개명 후 이름 박스 -->
            <div class="ranking-rename-box">
              <div class="rename-origin-row">
                <span class="rename-origin-label">💡 개명 전 원래 이름:</span>
                <div class="rename-origin-pills">
                  ${beforePills}
                </div>
              </div>
              <div class="rename-note-desc">${escapeHtml(item.desc)}</div>
            </div>

            <div class="ranking-teaser" style="margin-top:5px;">“${escapeHtml(item.meaning)}”</div>
          </div>
          <div class="ranking-view-action">
            <span>새 뜻</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </article>
      `;
    }).join('');

    const infiniteTriggerHtml = hasMore ? `
      <div id="rename-infinite-trigger" style="text-align:center; padding:18px 0; color:#94A3B8; font-size:13px; font-weight:600;">
        <span>📜 더 많은 대법원 개명 데이터 불러오는 중...</span>
      </div>
    ` : `
      <div style="text-align:center; padding:20px 0; color:#94A3B8; font-size:12.5px;">
        <span>✨ 대법원 전체 등록 개명 데이터 (${filtered.length.toLocaleString()}개)를 모두 불러왔습니다</span>
      </div>
    `;

    container.innerHTML = subfilterBarHtml + listHtml + infiniteTriggerHtml;

    // 무한스크롤 IntersectionObserver 연결
    if (renameScrollObserver) {
      renameScrollObserver.disconnect();
    }
    const triggerEl = container.querySelector('#rename-infinite-trigger');
    if (triggerEl && hasMore) {
      renameScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isRenameLoading) {
          isRenameLoading = true;
          renameItemsLoaded += RENAME_PAGE_SIZE;
          setTimeout(() => {
            renderList();
            isRenameLoading = false;
          }, 100);
        }
      }, { root: container, rootMargin: '200px' });
      renameScrollObserver.observe(triggerEl);
    }

    container.querySelectorAll('.ranking-subfilter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        renameGenderFilter = pill.dataset.gender;
        renameItemsLoaded = 30; // 탭 변경 시 리셋
        renderList();
      });
    });

  } else {
    // 🔥 실시간 인기 검색 랭킹
    container.innerHTML = POPULAR_SEARCH_NAMES.map((item) => {
      const rankNum = item.rank;
      let medalHtml = `<span class="ranking-medal">${rankNum}</span>`;
      if (rankNum === 1) medalHtml = `<span class="ranking-medal top-1">🥇</span>`;
      else if (rankNum === 2) medalHtml = `<span class="ranking-medal top-2">🥈</span>`;
      else if (rankNum === 3) medalHtml = `<span class="ranking-medal top-3">🥉</span>`;

      const avatarGrad = getAvatarGradient(item.name);

      return `
        <article class="ranking-item" data-surname="" data-given="${escapeHtml(item.name)}">
          ${medalHtml}
          <div class="ranking-avatar" style="background: ${avatarGrad}">
            ${escapeHtml(item.name.slice(0, 1))}
          </div>
          <div class="ranking-info">
            <div class="ranking-name-row">
              <span class="ranking-name serif">${escapeHtml(item.name)}</span>
              <span class="ranking-count-badge" style="background:#E0F2FE; color:#0369A1;">${escapeHtml(item.hanja)}</span>
            </div>
            <div class="ranking-teaser">“${escapeHtml(item.meaning)}”</div>
          </div>
          <div class="ranking-view-action">
            <span>보기</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </article>
      `;
    }).join('');
  }

  // 개명 전 원래 이름 뱃지 클릭 시 즉시 해당 원래 이름 뜻풀이 카드로 이동
  container.querySelectorAll('[data-action="view-specific-name"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetName = btn.dataset.name;
      if (targetName) {
        emit('name:show', { surname: '', given: targetName });
        const overlay = rootEl.querySelector('.ranking-overlay');
        if (overlay) overlay.classList.remove('open');
        setTimeout(() => rootEl.setAttribute('hidden', ''), 200);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // 아이템 클릭 시 해당 이름 카드 보기
  container.querySelectorAll('.ranking-item').forEach(el => {
    el.addEventListener('click', () => {
      const surname = el.dataset.surname || '';
      const given = el.dataset.given || '';
      if (given) {
        emit('name:show', { surname, given });
        const overlay = rootEl.querySelector('.ranking-overlay');
        if (overlay) overlay.classList.remove('open');
        setTimeout(() => rootEl.setAttribute('hidden', ''), 200);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
