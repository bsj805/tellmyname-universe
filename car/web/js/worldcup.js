// web/js/worldcup.js — 자동차·탈것 이상형 월드컵 (최악 중 최선 / 최선 중 최악) — 14개국어 & 모바일 상하 스크롤 최적화
// Domain: car.tellmyname.app

import * as taxonomyMod from './lib/taxonomy.js';
import * as i18nMod from './lib/i18n.js';
import { MIN_LEVEL, MAX_LEVEL, GOOD_CAR_THRESHOLD } from './lib/constants.js';
import { mulberry32, normalizeSeed, seedToInt, seededShuffle } from './lib/common/prng.js';

const GOOD_THRESHOLD = typeof GOOD_CAR_THRESHOLD === 'number' ? GOOD_CAR_THRESHOLD : 500;

export const WORLDCUP_MODES = {
  'worst-to-best': {
    id: 'worst-to-best',
    dictKey: 'worstToBest',
    oppositeMode: 'best-to-worst',
    themeClass: 'wc-theme-worst',
    minLevel: MIN_LEVEL,
    maxLevel: GOOD_THRESHOLD - 1 // Lv.0 ~ 499 (500 bad rides)
  },
  'best-to-worst': {
    id: 'best-to-worst',
    dictKey: 'bestToWorst',
    oppositeMode: 'worst-to-best',
    themeClass: 'wc-theme-best',
    minLevel: GOOD_THRESHOLD, // Lv.500 ~ 1000 (501 good rides)
    maxLevel: MAX_LEVEL
  }
};

export const ROUND_OPTIONS = [16, 32, 64, 128, 256];

const CAR_WORLDCUP_I18N = {
  ko: {
    tabFinder: '내 자동차 찾기',
    tabWorst: '최악 중 최선 월드컵',
    tabBest: '최선 중 최악 월드컵',
    roundSuffix: '강',
    finalLabel: '결승전',
    semiFinalLabel: '준결승 (4강)',
    totalMatchesPrefix: '총 ',
    totalMatchesSuffix: '경기',
    recommended: ' · 추천',
    selectRoundLabel: '토너먼트 강수 선택',
    startBtnSuffix: '강 무작위 대결 시작하기',
    lobbyHint1: '매 판마다 Lv.{min}~{max} 구간 탈것이 중복 없이 랜덤 추출됩니다.',
    lobbyHint2: '모바일에서는 위·아래로 스크롤하며 두 탈것을 비교하고 터치해 선택하세요.',
    matchCounter: '{cur} / {total} 경기',
    resetBtn: '🔄 처음으로',
    pickBtn: '👆 이 탈것 선택하기',
    realBadge: '🏛️ 실제 탈것',
    fictionBadge: '🦄 허구 탈것',
    realFullBadge: '🏛️ 실제·역사 속 실존 탈것',
    fictionFullBadge: '🦄 허구·마법·SF 탈것',
    builtYearLabel: '📅 언제 타던 탈것인지',
    valueLabel: '💰 추산 가격·유지비',
    featureLabel: '⚡ 특별한 기능·주행성능',
    featureFullLabel: '⚡ 탈것의 특별한 기능·주행성능',
    verdictLabel: '🤖 AI 시승 총평',
    championBadgeSuffix: '강 최종 우승',
    replayBtn: '🔄 다시하기',
    replaySameBtn: '🔁 같은 조건(동일 대진표)으로 다시 하기',
    replayNewRandomBtn: '🎲 새로운 무작위 대진표 시작',
    restartSameBtn: '🔁 이 대진표 처음부터',
    copyBtn: '📋 우승 탈것 결과 복사',
    viewDetailBtn: '🚗 이 탈것 감정서 자세히 보기',
    copiedToast: '📋 우승 탈것 결과가 클립보드에 복사되었습니다!',
    copyFailToast: '복사에 실패했습니다.',
    shareBracketBtn: '🔗 같은 조건 대진표 URL 공유',
    shareBracketToast: '🔗 같은 조건 대진표 URL이 복사되었습니다! 친구에게 보내보세요.',
    sameConditionBoxTitle: '🔗 같은 조건으로 다시 하기 / 친구에게 동일 대진표 공유',
    sameConditionBoxDesc: '아래 주소를 공유하면 친구도 똑같은 모드({mode}) · {round}강 · 동일 후보 대진표(시드 #{seed})로 월드컵을 진행할 수 있습니다.',
    copyUrlShortBtn: 'URL 복사',
    worstToBest: {
      badge: 'Lv.0 ~ 499 최악의 탈것 구간',
      title: '💀 최악 중 최선 자동차·탈것 월드컵',
      subtitle: '세발자전거, 바퀴 빠진 쇼핑카트, 똥차 등 500종의 폭망 탈것 중 그나마 타고 출근할 최선의 탈것을 뽑아보세요!',
      questionPrompt: '이 두 가지 최악의 탈것 중, 그나마 타고 출근한다면 어느 쪽?',
      championTitle: '🏆 최악의 탈것들 사이에서 살아남은 최후의 출근 애마!',
      oppositeLabel: '🌟 최선 중 최악 월드컵 도전'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 최고의 탈것 구간',
      title: '🌟 최선 중 최악 자동차·탈것 월드컵',
      subtitle: '파이어볼트 마법 빗자루, 백상아리 라이딩, 배트모빌, 우주 워프 크루저 등 501종의 드림카 중 의외로 제일 타기 싫은 최악을 뽑아보세요!',
      questionPrompt: '이 두 가지 꿈의 탈것 중, 의외로 제일 타기 부담스럽거나 싫은 쪽은?',
      championTitle: '💀 대박 탈것들 사이에서 뽑힌 의외의 탑승 기피 1순위!',
      oppositeLabel: '💀 최악 중 최선 월드컵 도전'
    }
  },
  en: {
    tabFinder: 'Find My Ride',
    tabWorst: 'Best of the Worst',
    tabBest: 'Worst of the Best',
    roundSuffix: ' Rides',
    finalLabel: 'Final',
    semiFinalLabel: 'Semi-Final (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' matches',
    recommended: ' · Recommended',
    selectRoundLabel: 'Select Tournament Size',
    startBtnSuffix: ' Rides — Start Random Bracket',
    lobbyHint1: 'Unique vehicles from Lv.{min}~{max} are drawn each round without duplicates.',
    lobbyHint2: 'On mobile, scroll vertically to compare both rides and tap to pick.',
    matchCounter: 'Match {cur} / {total}',
    resetBtn: '🔄 Restart',
    pickBtn: '👆 Pick This Ride',
    realBadge: '🏛️ Real Ride',
    fictionBadge: '🦄 Fiction',
    realFullBadge: '🏛️ Real-World Vehicle / Mount',
    fictionFullBadge: '🦄 Fictional / Magic / Sci-Fi Ride',
    builtYearLabel: '📅 Vehicle Era',
    valueLabel: '💰 Est. Price & Upkeep',
    featureLabel: '⚡ Special Feature',
    featureFullLabel: '⚡ Special Features & Performance',
    verdictLabel: '🤖 AI Mechanic Verdict',
    championBadgeSuffix: ' Champion',
    replayBtn: '🔄 Play Again',
    replaySameBtn: '🔁 Replay Exact Same Bracket',
    replayNewRandomBtn: '🎲 Start New Random Bracket',
    restartSameBtn: '🔁 Restart This Bracket',
    copyBtn: '📋 Copy Result',
    viewDetailBtn: '🚗 View Full Appraisal',
    copiedToast: '📋 Champion ride copied to clipboard!',
    copyFailToast: 'Failed to copy result.',
    shareBracketBtn: '🔗 Share Same-Seed Bracket URL',
    shareBracketToast: '🔗 Same-seed bracket URL copied! Challenge your friends.',
    sameConditionBoxTitle: '🔗 Replay Same Condition / Share Exact Bracket',
    sameConditionBoxDesc: 'Anyone opening this link gets the exact same mode ({mode}), {round} rides, and identical matchups (Seed #{seed}).',
    copyUrlShortBtn: 'Copy URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Nightmare Rides',
      title: '💀 Best of the Worst Vehicle World Cup',
      subtitle: 'Out of 500 awful rides (broken tricycles, shopping carts, junkers), pick the one you can actually survive commuting in!',
      questionPrompt: 'Between these two terrible rides, which one would you rather commute in?',
      championTitle: '🏆 The Most Survivable Ride Among the Worst!',
      oppositeLabel: '🌟 Try Worst of the Best'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 Dream & Cosmic Rides',
      title: '🌟 Worst of the Best Vehicle World Cup',
      subtitle: 'Out of 501 dream rides (Firebolt broomstick, Shark mount, Batmobile, Warp Cruisers), which one would you surprisingly hate riding?',
      questionPrompt: 'Between these two epic rides, which one would you least want to ride?',
      championTitle: '💀 The Most Unwanted Ride Among Dream Vehicles!',
      oppositeLabel: '💀 Try Best of the Worst'
    }
  },
  ja: {
    tabFinder: '私の車を探す',
    tabWorst: '最悪の中で最善',
    tabBest: '最善の中で最悪',
    roundSuffix: '強',
    finalLabel: '決勝戦',
    semiFinalLabel: '準決勝 (ベスト4)',
    totalMatchesPrefix: '全 ',
    totalMatchesSuffix: '試合',
    recommended: ' · おすすめ',
    selectRoundLabel: 'トーナメント規模を選択',
    startBtnSuffix: '強 ランダム対決スタート',
    lobbyHint1: 'Lv.{min}~{max}の乗り物が重複なしでランダム抽出されます。',
    lobbyHint2: 'スマホでは上下にスクロールして比較し、タップで選択できます。',
    matchCounter: '{cur} / {total} 試合',
    resetBtn: '🔄 最初から',
    pickBtn: '👆 この乗り物を選ぶ',
    realBadge: '🏛️ 実在',
    fictionBadge: '🦄 架空',
    builtYearLabel: '📅 時代・年式',
    valueLabel: '💰 推定価格・維持費',
    featureLabel: '⚡ 特殊機能・性能',
    verdictLabel: '🤖 AI総評',
    championBadgeSuffix: '強 優勝',
    shareBracketBtn: '🔗 同じ対戦表URLを共有',
    viewDetailBtn: '🚗 鑑定書を詳しく見る',
    worstToBest: {
      badge: 'Lv.0 ~ 499 ポンコツ区間',
      title: '💀 最悪の中で最善 乗り物ワールドカップ',
      subtitle: '500種の爆死ポンコツの中から、まだ乗って通勤できそうなマシな1台を選ぼう！',
      questionPrompt: 'この2つの最悪な乗り物、まだマシなのはどっち？',
      championTitle: '🏆 最悪の中で生き残った究極の妥協カー！',
      oppositeLabel: '🌟 最善の中で最悪に挑戦'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 ドリームカー区間',
      title: '🌟 最善の中で最悪 乗り物ワールドカップ',
      subtitle: '501種の伝説の名車・魔導・宇宙戦艦の中から、意外と乗りたくない1台を選ぼう！',
      questionPrompt: 'この2つの夢の乗り物、意外と一番乗りたくないのはどっち？',
      championTitle: '💀 名車の中で選ばれた乗車拒否ナンバーワン！',
      oppositeLabel: '💀 最悪の中で最善に挑戦'
    }
  },
  zh: {
    tabFinder: '寻找我的座驾',
    tabWorst: '最烂里选最好',
    tabBest: '神车里选最不想开',
    roundSuffix: '强',
    finalLabel: '总决赛',
    semiFinalLabel: '半决赛',
    totalMatchesPrefix: '共 ',
    totalMatchesSuffix: ' 场',
    recommended: ' · 推荐',
    selectRoundLabel: '选择淘汰赛规模',
    startBtnSuffix: '强 随机对决开始',
    matchCounter: '第 {cur} / {total} 场',
    resetBtn: '🔄 重新开始',
    pickBtn: '👆 选择此座驾',
    realBadge: '🏛️ 现实',
    fictionBadge: '🦄 虚构',
    builtYearLabel: '📅 活跃年代',
    valueLabel: '💰 预估车价',
    featureLabel: '⚡ 特殊功能',
    verdictLabel: '🤖 AI总评',
    championBadgeSuffix: '强 冠军',
    shareBracketBtn: '🔗 分享相同对阵表链接',
    viewDetailBtn: '🚗 查看完整鉴定书',
    worstToBest: {
      badge: 'Lv.0 ~ 499 报废区',
      title: '💀 最烂座驾里选最好 世界杯',
      subtitle: '在500种奇葩破车中选出你最勉强能开去上班的那一辆！',
      questionPrompt: '这两辆糟糕的座驾中，你更愿意开哪一辆？',
      championTitle: '🏆 从最烂座驾中突围的勉强之选！',
      oppositeLabel: '🌟 挑战神车里选最烂'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 梦幻座驾区',
      title: '🌟 神车里选最不想开 世界杯',
      subtitle: '在501种梦幻座驾中挑出意外最让人抗拒的那一辆！',
      questionPrompt: '这两辆梦幻座驾中，你最不想坐哪一辆？',
      championTitle: '💀 梦幻座驾中被选出的最劝退座驾！',
      oppositeLabel: '💀 挑战最烂里选最好'
    }
  },
  hi: { tabFinder: 'मेरी सवारी खोजें', tabWorst: 'बदतर में बेहतरीन', tabBest: 'बेहतरीन में बदतर' },
  vi: { tabFinder: 'Tìm Xe Hợp Mệnh', tabWorst: 'Tốt Nhất Trong Tệ Nhất', tabBest: 'Tệ Nhất Trong Tốt Nhất' },
  fr: { tabFinder: 'Trouver Mon Véhicule', tabWorst: 'Meilleur du Pire', tabBest: 'Pire du Meilleur' },
  pt: { tabFinder: 'Achar Meu Veículo', tabWorst: 'Melhor dos Piores', tabBest: 'Pior dos Melhores' },
  es: { tabFinder: 'Buscar Mi Vehículo', tabWorst: 'Mejor de lo Peor', tabBest: 'Peor de lo Mejor' },
  id: { tabFinder: 'Cari Kendaraanku', tabWorst: 'Terbaik dari Terburuk', tabBest: 'Terburuk dari Terbaik' },
  ru: { tabFinder: 'Найти Транспорт', tabWorst: 'Лучший из худших', tabBest: 'Худший из лучших' },
  de: { tabFinder: 'Mein Fahrzeug', tabWorst: 'Bestes vom Schlechtesten', tabBest: 'Schlechtestes vom Besten' },
  it: { tabFinder: 'Trova il Veicolo', tabWorst: 'Migliore dei Peggiori', tabBest: 'Peggiore dei Migliori' },
  ms: { tabFinder: 'Cari Kenderaan Saya', tabWorst: 'Terbaik Daripada Terburuk', tabBest: 'Terburuk Daripada Terbaik' }
};

function getCarWorldCupT(lang = 'ko') {
  const code = CAR_WORLDCUP_I18N[lang] ? lang : 'en';
  if (code === 'ko') return CAR_WORLDCUP_I18N.ko;
  const custom = CAR_WORLDCUP_I18N[code] || {};
  return {
    ...CAR_WORLDCUP_I18N.en,
    ...custom,
    worstToBest: { ...CAR_WORLDCUP_I18N.en.worstToBest, ...(custom.worstToBest || {}) },
    bestToWorst: { ...CAR_WORLDCUP_I18N.en.bestToWorst, ...(custom.bestToWorst || {}) }
  };
}

const wcState = {
  mode: 'worst-to-best',
  roundSize: 32,
  seed: null,
  phase: 'lobby', // 'lobby' | 'playing' | 'finished'
  currentRound: [],
  nextRoundWinners: [],
  matchIndex: 0,
  championLevel: null,
  isTransitioning: false,
  lang: 'ko',
  callbacks: {
    onViewCar: null,
    onViewHouse: null,
    onSwitchMode: null,
    onToast: null
  }
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function createSeededRng(seed) {
  return mulberry32(seedToInt(seed));
}

export function sampleLevelsForMode(modeId, count, seed = null) {
  const cfg = WORLDCUP_MODES[modeId] || WORLDCUP_MODES['worst-to-best'];
  const pool = [];
  for (let lv = cfg.minLevel; lv <= cfg.maxLevel; lv++) {
    pool.push(lv);
  }
  const normalizedSeed = normalizeSeed(seed);
  const shuffled = seededShuffle(pool, normalizedSeed);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function buildWorldCupShareUrl(mode = wcState.mode, roundSize = wcState.roundSize, seed = wcState.seed, lang = wcState.lang) {
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.startsWith('file:'))
    ? window.location.origin
    : 'https://car.tellmyname.app';
  const params = new URLSearchParams();
  params.set('round', String(roundSize));
  if (seed !== null && seed !== undefined) {
    params.set('seed', String(seed));
  }
  if (lang && lang !== 'ko') {
    params.set('lang', lang);
  }
  return `${origin}/worldcup/${mode}?${params.toString()}`;
}

export function getRoundLabel(roundLength, lang = 'ko') {
  const t = getCarWorldCupT(lang);
  if (roundLength <= 2) return t.finalLabel;
  if (roundLength === 4) return t.semiFinalLabel;
  return `${roundLength}${t.roundSuffix}`;
}

function getRawCarConcept(level) {
  const lv = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(Number(level) || 0)));
  const getter = taxonomyMod.getCarConceptByLevel || taxonomyMod.getJobConceptByLevel || taxonomyMod.getHouseConceptByLevel;
  if (typeof getter === 'function') {
    try {
      const c = getter(lv);
      if (c) return c;
    } catch (_) {}
  }
  const isGood = lv >= GOOD_THRESHOLD;
  const isReal = lv % 2 === 0;
  const padded = String(lv).padStart(5, '0');
  return {
    level: lv,
    tier: Math.min(20, Math.floor(lv / 50) + 1),
    tierName: `Tier ${String(Math.min(20, Math.floor(lv / 50) + 1)).padStart(2, '0')}`,
    zone: isGood ? 'GOOD' : 'BAD',
    realityType: isReal ? 'REAL' : 'FICTION',
    categoryEmoji: '🚗',
    title: `다중우주 탈것 Lv.${lv}`,
    era: '시공간 미상',
    estimatedPrice: isGood ? '초호화 감정가 측정 불가' : '폐차비 본인 부담',
    specialFeature: '특수 주행 성능 테스트 중',
    aiVerdict: '다중우주 차고 등기부 인증 차량입니다.',
    imageUrl: `/r2/cars/${padded}.webp`
  };
}

function getLocalizedCar(level, lang) {
  const raw = getRawCarConcept(level);
  const localizer = i18nMod.localizeCar || i18nMod.localizeJob || i18nMod.localizeHouse;
  if (lang && lang !== 'ko' && typeof localizer === 'function') {
    return localizer(raw, lang);
  }
  return raw;
}

function preloadNextMatchImages() {
  if (typeof Image === 'undefined') return;
  const nextIdx = wcState.matchIndex + 1;
  if (nextIdx * 2 + 1 < wcState.currentRound.length) {
    const lvA = wcState.currentRound[nextIdx * 2];
    const lvB = wcState.currentRound[nextIdx * 2 + 1];
    [lvA, lvB].forEach(lv => {
      const img = new Image();
      img.src = `/r2/cars/${String(lv).padStart(5, '0')}.webp`;
    });
  }
}

export function setWorldCupLanguage(lang) {
  wcState.lang = lang || 'ko';
}

export function openWorldCupMode(modeId, rootEl, callbacks = {}, options = {}) {
  if (callbacks) {
    wcState.callbacks = { ...wcState.callbacks, ...callbacks };
  }
  if (WORLDCUP_MODES[modeId]) {
    const modeChanged = wcState.mode !== modeId;
    wcState.mode = modeId;
    if (modeChanged && !options.seed) {
      wcState.phase = 'lobby';
      wcState.seed = null;
      wcState.currentRound = [];
      wcState.nextRoundWinners = [];
      wcState.matchIndex = 0;
      wcState.championLevel = null;
      wcState.isTransitioning = false;
    }
  }
  if (options.roundSize && ROUND_OPTIONS.includes(Number(options.roundSize))) {
    wcState.roundSize = Number(options.roundSize);
  }
  if (options.seed) {
    startTournament(wcState.roundSize, rootEl, options.seed);
    return;
  }
  renderWorldCup(rootEl);
}

export function startTournament(roundSize, rootEl, customSeed = null) {
  const size = ROUND_OPTIONS.includes(Number(roundSize)) ? Number(roundSize) : 32;
  const parsedSeed = customSeed !== null && customSeed !== undefined && String(customSeed).trim() !== ''
    ? normalizeSeed(customSeed)
    : String(Math.floor(10000000 + Math.random() * 90000000));

  wcState.roundSize = size;
  wcState.seed = parsedSeed;
  wcState.currentRound = sampleLevelsForMode(wcState.mode, size, parsedSeed);
  wcState.nextRoundWinners = [];
  wcState.matchIndex = 0;
  wcState.championLevel = null;
  wcState.phase = 'playing';
  wcState.isTransitioning = false;

  if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const sharePath = `/worldcup/${wcState.mode}?round=${size}&seed=${encodeURIComponent(parsedSeed)}${wcState.lang && wcState.lang !== 'ko' ? `&lang=${wcState.lang}` : ''}`;
    try {
      window.history.replaceState({ tab: wcState.mode, round: size, seed: parsedSeed }, '', sharePath);
    } catch (_) {}
  }

  preloadNextMatchImages();
  renderWorldCup(rootEl);
}

export function selectCandidate(choiceIdx, rootEl) {
  if (wcState.phase !== 'playing' || wcState.isTransitioning) return;

  const pairStart = wcState.matchIndex * 2;
  const levelA = wcState.currentRound[pairStart];
  const levelB = wcState.currentRound[pairStart + 1];
  const winnerLevel = choiceIdx === 0 ? levelA : levelB;
  if (winnerLevel === undefined) return;

  wcState.isTransitioning = true;

  const cards = rootEl ? rootEl.querySelectorAll('.wc-candidate-card') : [];
  if (cards[choiceIdx]) {
    cards[choiceIdx].classList.add('wc-selected');
  }

  setTimeout(() => {
    wcState.nextRoundWinners.push(winnerLevel);
    const totalMatchesInRound = Math.floor(wcState.currentRound.length / 2);

    if (wcState.matchIndex + 1 < totalMatchesInRound) {
      wcState.matchIndex += 1;
    } else if (wcState.nextRoundWinners.length === 1) {
      wcState.championLevel = wcState.nextRoundWinners[0];
      wcState.phase = 'finished';
    } else {
      const roundSeed = `${wcState.seed}-r${wcState.nextRoundWinners.length}`;
      wcState.currentRound = seededShuffle(wcState.nextRoundWinners, roundSeed);
      wcState.nextRoundWinners = [];
      wcState.matchIndex = 0;
    }

    wcState.isTransitioning = false;
    preloadNextMatchImages();
    renderWorldCup(rootEl);

    if (rootEl && typeof window !== 'undefined') {
      const topAnchor = rootEl.querySelector('#wc-arena-top') || rootEl;
      const rect = topAnchor.getBoundingClientRect();
      if (rect.top < 0 || window.innerWidth <= 768) {
        topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 220);
}

export function restartSameTournament(rootEl) {
  return startTournament(wcState.roundSize, rootEl, wcState.seed);
}

export async function copySameBracketUrl(t) {
  const url = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);
  try {
    if (typeof document !== 'undefined') {
      const input = document.getElementById('wc-share-url-input') || document.getElementById('wc-finish-share-url-input');
      if (input) {
        input.select();
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(0, 99999);
        }
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    }
    if (typeof wcState.callbacks.onToast === 'function') {
      wcState.callbacks.onToast(t.shareBracketToast);
    }
  } catch {
    if (typeof wcState.callbacks.onToast === 'function') {
      wcState.callbacks.onToast(t.copyFailToast);
    }
  }
  return url;
}

function renderLobby(cfg, t, modeText) {
  const roundButtonsHtml = ROUND_OPTIONS.map(size => {
    const isActive = wcState.roundSize === size;
    return `
      <button type="button" class="wc-round-btn ${isActive ? 'active' : ''}" data-round="${size}">
        <span class="wc-round-num">${size}${escapeHtml(t.roundSuffix)}</span>
        <span class="wc-round-meta">${escapeHtml(t.totalMatchesPrefix)}${size - 1}${escapeHtml(t.totalMatchesSuffix)}${size === 32 ? escapeHtml(t.recommended) : ''}</span>
      </button>
    `;
  }).join('');

  const hint1 = t.lobbyHint1
    .replace('{min}', String(cfg.minLevel))
    .replace('{max}', String(cfg.maxLevel));

  return `
    <div class="wc-container ${cfg.themeClass}">
      <div class="wc-lobby-card">
        <div class="wc-lobby-badge">${escapeHtml(modeText.badge)}</div>
        <h2 class="wc-lobby-title">${escapeHtml(modeText.title)}</h2>
        <p class="wc-lobby-subtitle">${escapeHtml(modeText.subtitle)}</p>

        <div class="wc-round-selector">
          <div class="wc-round-selector-label">${escapeHtml(t.selectRoundLabel)}</div>
          <div class="wc-round-grid">
            ${roundButtonsHtml}
          </div>
        </div>

        <button type="button" id="wc-start-btn" class="wc-start-btn">
          <span>🎲</span>
          <span>${wcState.roundSize}${escapeHtml(t.startBtnSuffix)}</span>
        </button>

        <p class="wc-lobby-hint">
          💡 ${escapeHtml(hint1)}<br />
          📱 ${escapeHtml(t.lobbyHint2)}
        </p>
      </div>
    </div>
  `;
}

function renderCandidateCard(car, choiceIdx, t) {
  const isReal = Number(car.level) % 2 === 0 || car.realityType === 'REAL';
  const realityBadge = isReal ? t.realBadge : t.fictionBadge;
  const realityClass = isReal ? 'badge-real' : 'badge-fiction';
  const levelPadded = String(car.level).padStart(5, '0');
  const imgSrc = `/r2/cars/${levelPadded}.webp`;

  const eraVal = car.era || car.builtYear || '-';
  const priceVal = car.estimatedPrice || car.estimatedSalary || car.estimatedValue || '-';
  const featureVal = car.specialFeature || car.specialDuty || '-';

  return `
    <article class="wc-candidate-card" data-choice="${choiceIdx}" tabindex="0" role="button" aria-label="${escapeHtml(car.title)}">
      <div class="wc-card-media">
        <img
          src="${escapeHtml(imgSrc)}"
          alt="Lv.${car.level} ${escapeHtml(car.title)}"
          class="wc-card-img"
          loading="eager"
          onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=window.renderCarFallbackSvg ? window.renderCarFallbackSvg(${car.level}) : '/favicon.svg';}else{this.onerror=null;}"
        />
        <div class="wc-card-badges">
          <span class="wc-level-pill">Lv.${car.level}</span>
          <span class="wc-reality-pill ${realityClass}">${escapeHtml(realityBadge)}</span>
        </div>
      </div>

      <div class="wc-card-body">
        <div class="wc-card-tier">${escapeHtml(car.categoryEmoji || '🚗')} ${escapeHtml(car.tierName || `Tier ${String(car.tier || 1).padStart(2, '0')}`)}</div>
        <h3 class="wc-card-title">${escapeHtml(car.title)}</h3>

        <div class="wc-card-specs">
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.builtYearLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(eraVal)}</span>
          </div>
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.valueLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(priceVal)}</span>
          </div>
          <div class="wc-spec-row">
            <span class="wc-spec-label">${escapeHtml(t.featureLabel)}</span>
            <span class="wc-spec-val">${escapeHtml(featureVal)}</span>
          </div>
        </div>

        <button type="button" class="wc-pick-btn" data-choice="${choiceIdx}">
          ${escapeHtml(t.pickBtn)}
        </button>
      </div>
    </article>
  `;
}

function renderPlaying(cfg, t, modeText) {
  const pairStart = wcState.matchIndex * 2;
  const lvA = wcState.currentRound[pairStart];
  const lvB = wcState.currentRound[pairStart + 1];
  const carA = getLocalizedCar(lvA, wcState.lang);
  const carB = getLocalizedCar(lvB, wcState.lang);

  const totalMatches = Math.floor(wcState.currentRound.length / 2);
  const currentMatchNum = wcState.matchIndex + 1;
  const roundLabel = getRoundLabel(wcState.currentRound.length, wcState.lang);
  const progressPct = Math.round((currentMatchNum / totalMatches) * 100);
  const matchCounterText = t.matchCounter
    .replace('{cur}', String(currentMatchNum))
    .replace('{total}', String(totalMatches));
  const shareUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);

  return `
    <div class="wc-container ${cfg.themeClass}" id="wc-arena-top">
      <div class="wc-status-bar">
        <div class="wc-status-top">
          <div class="wc-status-title-group">
            <span class="wc-round-chip">${escapeHtml(roundLabel)}</span>
            <span class="wc-match-counter">${escapeHtml(matchCounterText)}</span>
          </div>
          <div class="wc-status-actions">
            <button type="button" id="wc-restart-same-btn" class="wc-reset-btn" title="${escapeHtml(t.restartSameBtn)}">
              ${escapeHtml(t.restartSameBtn)}
            </button>
            <button type="button" id="wc-reset-btn" class="wc-reset-btn" title="${escapeHtml(t.resetBtn)}">
              ${escapeHtml(t.resetBtn)}
            </button>
          </div>
        </div>

        <div class="wc-same-condition-bar">
          <span class="wc-seed-badge">🎯 ${wcState.roundSize}${escapeHtml(t.roundSuffix)} · Seed #${escapeHtml(wcState.seed)}</span>
          <input type="text" id="wc-share-url-input" class="wc-share-url-input" value="${escapeHtml(shareUrl)}" readonly aria-label="같은 조건 대진표 공유 URL" />
          <button type="button" id="wc-share-bracket-btn" class="wc-share-url-btn">
            ${escapeHtml(t.shareBracketBtn)}
          </button>
        </div>

        <div class="wc-progress-track" aria-hidden="true">
          <div class="wc-progress-fill" style="width: ${progressPct}%"></div>
        </div>
        <p class="wc-question-prompt">${escapeHtml(modeText.questionPrompt)}</p>
      </div>

      <div class="wc-arena">
        ${renderCandidateCard(carA, 0, t)}

        <div class="wc-vs-divider" aria-hidden="true">
          <span class="wc-vs-badge">VS</span>
        </div>

        ${renderCandidateCard(carB, 1, t)}
      </div>
    </div>
  `;
}

function renderFinished(cfg, t, modeText) {
  const car = getLocalizedCar(wcState.championLevel, wcState.lang);
  const isReal = Number(car.level) % 2 === 0 || car.realityType === 'REAL';
  const realityBadge = isReal ? t.realFullBadge : t.fictionFullBadge;
  const levelPadded = String(car.level).padStart(5, '0');
  const imgSrc = `/r2/cars/${levelPadded}.webp`;
  const shareUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);

  const eraVal = car.era || car.builtYear || '-';
  const priceVal = car.estimatedPrice || car.estimatedSalary || car.estimatedValue || '-';
  const featureVal = car.specialFeature || car.specialDuty || '-';

  return `
    <div class="wc-container ${cfg.themeClass}">
      <div class="wc-champion-card">
        <div class="wc-champion-header">
          <span class="wc-champion-badge">${wcState.roundSize}${escapeHtml(t.championBadgeSuffix)}</span>
          <h2 class="wc-champion-title">${escapeHtml(modeText.championTitle)}</h2>
        </div>

        <div class="wc-champion-media">
          <img
            src="${escapeHtml(imgSrc)}"
            alt="Lv.${car.level} ${escapeHtml(car.title)}"
            class="wc-champion-img"
            onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=window.renderCarFallbackSvg ? window.renderCarFallbackSvg(${car.level}) : '/favicon.svg';}else{this.onerror=null;}"
          />
          <div class="wc-card-badges">
            <span class="wc-level-pill">Lv.${car.level}</span>
            <span class="wc-reality-pill ${isReal ? 'badge-real' : 'badge-fiction'}">${escapeHtml(realityBadge)}</span>
          </div>
        </div>

        <div class="wc-champion-body">
          <div class="wc-card-tier">${escapeHtml(car.categoryEmoji || '🚗')} ${escapeHtml(car.tierName || `Tier ${String(car.tier || 1).padStart(2, '0')}`)}</div>
          <h3 class="wc-champion-house-name">${escapeHtml(car.title)}</h3>

          <div class="wc-card-specs">
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.builtYearLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(eraVal)}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.valueLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(priceVal)}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.featureFullLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(featureVal)}</span>
            </div>
            <div class="wc-spec-row">
              <span class="wc-spec-label">${escapeHtml(t.verdictLabel)}</span>
              <span class="wc-spec-val">${escapeHtml(car.aiVerdict || '-')}</span>
            </div>
          </div>

          <div class="wc-same-condition-box">
            <div class="wc-same-condition-title">${escapeHtml(t.sameConditionBoxTitle)}</div>
            <p class="wc-same-condition-desc">${escapeHtml((t.sameConditionBoxDesc || '').replace('{mode}', modeText.title).replace('{round}', String(wcState.roundSize)).replace('{seed}', String(wcState.seed)))}</p>
            <div class="wc-same-condition-input-row">
              <input type="text" id="wc-finish-share-url-input" class="wc-share-url-input" value="${escapeHtml(shareUrl)}" readonly aria-label="같은 조건 공유 URL" />
              <button type="button" id="wc-copy-url-inline-btn" class="wc-share-url-btn">${escapeHtml(t.copyUrlShortBtn)}</button>
            </div>
          </div>

          <div class="wc-champion-actions">
            <button type="button" id="wc-replay-same-btn" class="wc-action-btn wc-btn-primary">
              ${escapeHtml(t.replaySameBtn)}
            </button>
            <button type="button" id="wc-share-bracket-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.shareBracketBtn)}
            </button>
            <button type="button" id="wc-replay-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.replayNewRandomBtn || t.replayBtn)}
            </button>
            <button type="button" id="wc-copy-result-btn" class="wc-action-btn wc-btn-secondary">
              ${escapeHtml(t.copyBtn)}
            </button>
            <button type="button" id="wc-view-detail-btn" class="wc-action-btn wc-btn-outline">
              ${escapeHtml(t.viewDetailBtn)}
            </button>
            <button type="button" id="wc-opposite-btn" class="wc-action-btn wc-btn-outline">
              ${escapeHtml(modeText.oppositeLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderWorldCup(rootEl) {
  if (!rootEl) return;
  const cfg = WORLDCUP_MODES[wcState.mode] || WORLDCUP_MODES['worst-to-best'];
  const t = getCarWorldCupT(wcState.lang);
  const modeText = t[cfg.dictKey] || t.worstToBest;

  if (wcState.phase === 'lobby') {
    rootEl.innerHTML = renderLobby(cfg, t, modeText);
    attachLobbyEvents(rootEl);
  } else if (wcState.phase === 'playing') {
    rootEl.innerHTML = renderPlaying(cfg, t, modeText);
    attachPlayingEvents(rootEl, t);
  } else if (wcState.phase === 'finished') {
    rootEl.innerHTML = renderFinished(cfg, t, modeText);
    attachFinishedEvents(rootEl, cfg, t, modeText);
  }
}

function attachLobbyEvents(rootEl) {
  const roundBtns = rootEl.querySelectorAll('.wc-round-btn');
  roundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wcState.roundSize = Number(btn.dataset.round) || 32;
      renderWorldCup(rootEl);
    });
  });

  const startBtn = rootEl.querySelector('#wc-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startTournament(wcState.roundSize, rootEl);
    });
  }
}

function attachPlayingEvents(rootEl, t) {
  const restartSameBtn = rootEl.querySelector('#wc-restart-same-btn');
  if (restartSameBtn) {
    restartSameBtn.addEventListener('click', () => {
      restartSameTournament(rootEl);
    });
  }

  const resetBtn = rootEl.querySelector('#wc-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      wcState.phase = 'lobby';
      wcState.seed = null;
      renderWorldCup(rootEl);
    });
  }

  const shareBracketBtn = rootEl.querySelector('#wc-share-bracket-btn');
  if (shareBracketBtn) {
    shareBracketBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const shareInput = rootEl.querySelector('#wc-share-url-input');
  if (shareInput) {
    shareInput.addEventListener('click', () => copySameBracketUrl(t));
    shareInput.addEventListener('focus', () => copySameBracketUrl(t));
  }

  const cards = rootEl.querySelectorAll('.wc-candidate-card');
  cards.forEach(card => {
    const choiceIdx = Number(card.dataset.choice);
    card.addEventListener('click', () => {
      selectCandidate(choiceIdx, rootEl);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCandidate(choiceIdx, rootEl);
      }
    });
  });
}

function attachFinishedEvents(rootEl, cfg, t, modeText) {
  const replaySameBtn = rootEl.querySelector('#wc-replay-same-btn');
  if (replaySameBtn) {
    replaySameBtn.addEventListener('click', () => {
      restartSameTournament(rootEl);
    });
  }

  const replayBtn = rootEl.querySelector('#wc-replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      wcState.phase = 'lobby';
      wcState.seed = null;
      renderWorldCup(rootEl);
    });
  }

  const shareBracketBtn = rootEl.querySelector('#wc-share-bracket-btn');
  if (shareBracketBtn) {
    shareBracketBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const copyUrlInlineBtn = rootEl.querySelector('#wc-copy-url-inline-btn');
  if (copyUrlInlineBtn) {
    copyUrlInlineBtn.addEventListener('click', () => copySameBracketUrl(t));
  }

  const finishShareInput = rootEl.querySelector('#wc-finish-share-url-input');
  if (finishShareInput) {
    finishShareInput.addEventListener('click', () => copySameBracketUrl(t));
    finishShareInput.addEventListener('focus', () => copySameBracketUrl(t));
  }

  const oppositeBtn = rootEl.querySelector('#wc-opposite-btn');
  if (oppositeBtn) {
    oppositeBtn.addEventListener('click', () => {
      if (typeof wcState.callbacks.onSwitchMode === 'function') {
        wcState.callbacks.onSwitchMode(cfg.oppositeMode);
      } else {
        openWorldCupMode(cfg.oppositeMode, rootEl, wcState.callbacks);
      }
    });
  }

  const viewDetailBtn = rootEl.querySelector('#wc-view-detail-btn');
  if (viewDetailBtn) {
    viewDetailBtn.addEventListener('click', () => {
      const handler = wcState.callbacks.onViewCar || wcState.callbacks.onViewHouse;
      if (typeof handler === 'function') {
        handler(wcState.championLevel);
      }
    });
  }

  const copyBtn = rootEl.querySelector('#wc-copy-result-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const car = getLocalizedCar(wcState.championLevel, wcState.lang);
      const bracketUrl = buildWorldCupShareUrl(wcState.mode, wcState.roundSize, wcState.seed, wcState.lang);
      const priceVal = car.estimatedPrice || car.estimatedSalary || car.estimatedValue || '-';
      const featureVal = car.specialFeature || car.specialDuty || '-';
      const text = `[MyCar ${modeText.title} - ${wcState.roundSize}${t.championBadgeSuffix}]\n🚗 Lv.${car.level} ${car.title}\n💰 ${priceVal}\n⚡ ${featureVal}\n🔗 ${bracketUrl}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
        if (typeof wcState.callbacks.onToast === 'function') {
          wcState.callbacks.onToast(t.copiedToast);
        }
      } catch {
        if (typeof wcState.callbacks.onToast === 'function') {
          wcState.callbacks.onToast(t.copyFailToast);
        }
      }
    });
  }
}

export function getWorldCupUiLabels(lang = 'ko') {
  return getCarWorldCupT(lang);
}
