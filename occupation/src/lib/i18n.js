// src/lib/i18n.js — 14-Language Internationalization (i18n) Engine & Dynamic Job Localizer for MyJob
// Supports: ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms
// Domain: job.tellmyname.app

import { MASTER_JOBS } from './master_dataset.js';

export const SUPPORTED_LANGUAGES = [
  {
    code: 'ko',
    label: '한국어',
    native: '한국어',
    flag: '🇰🇷',
    locale: 'ko-KR',
    sampleNames: ['김서윤', '이민준', '홍길동', '박대기', '선우용녀']
  },
  {
    code: 'en',
    label: 'English',
    native: 'English',
    flag: '🇺🇸',
    locale: 'en-US',
    sampleNames: ['Steve', 'Emma', 'Liam', 'Olivia', 'Noah']
  },
  {
    code: 'hi',
    label: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    locale: 'hi-IN',
    sampleNames: ['Aarav', 'Diya', 'Vihaan', 'Ananya', 'Rohan']
  },
  {
    code: 'vi',
    label: 'Vietnamese',
    native: 'Tiếng Việt',
    flag: '🇻🇳',
    locale: 'vi-VN',
    sampleNames: ['Minh', 'Linh', 'Anh', 'Hùng', 'Trang']
  },
  {
    code: 'fr',
    label: 'French',
    native: 'Français',
    flag: '🇫🇷',
    locale: 'fr-FR',
    sampleNames: ['Lucas', 'Emma', 'Gabriel', 'Chloé', 'Jules']
  },
  {
    code: 'pt',
    label: 'Portuguese',
    native: 'Português',
    flag: '🇧🇷',
    locale: 'pt-BR',
    sampleNames: ['Miguel', 'Helena', 'Arthur', 'Alice', 'Gael']
  },
  {
    code: 'es',
    label: 'Spanish',
    native: 'Español',
    flag: '🇪🇸',
    locale: 'es-ES',
    sampleNames: ['Mateo', 'Sofía', 'Santiago', 'Valentina', 'Leo']
  },
  {
    code: 'id',
    label: 'Indonesian',
    native: 'Bahasa Indonesia',
    flag: '🇮🇩',
    locale: 'id-ID',
    sampleNames: ['Budi', 'Siti', 'Rizky', 'Putri', 'Agus']
  },
  {
    code: 'ru',
    label: 'Russian',
    native: 'Русский',
    flag: '🇷🇺',
    locale: 'ru-RU',
    sampleNames: ['Александр', 'София', 'Максим', 'Анна', 'Михаил']
  },
  {
    code: 'de',
    label: 'German',
    native: 'Deutsch',
    flag: '🇩🇪',
    locale: 'de-DE',
    sampleNames: ['Noah', 'Emilia', 'Matteo', 'Mia', 'Leon']
  },
  {
    code: 'it',
    label: 'Italian',
    native: 'Italiano',
    flag: '🇮🇹',
    locale: 'it-IT',
    sampleNames: ['Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Alessandro']
  },
  {
    code: 'ja',
    label: 'Japanese',
    native: '日本語',
    flag: '🇯🇵',
    locale: 'ja-JP',
    sampleNames: ['Haruto', 'Yui', 'Sora', 'Hina', 'Ren']
  },
  {
    code: 'zh',
    label: 'Chinese',
    native: '简体中文',
    flag: '🇨🇳',
    locale: 'zh-CN',
    sampleNames: ['Wei', 'Fang', 'Hao', 'Yuhan', 'Zihan']
  },
  {
    code: 'ms',
    label: 'Malay',
    native: 'Bahasa Melayu',
    flag: '🇲🇾',
    locale: 'ms-MY',
    sampleNames: ['Aisyah', 'Ahmad', 'Nur', 'Muhammad', 'Siti']
  }
];

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(l => [l.code, l])
);

export const UI_DICTIONARY = {
  ko: {
    familyNav: {
      job: '나에게 어울리는 직업',
      myhome: '나에게 어울리는 집',
      food: '나에게 어울리는 음식',
      photodiary: '포토다이어리'
    },
    brandHeader: '나에게 어울리는 직업',
    brandSub: '이름만 입력해서 찾는 재미로 보는 내 직업 테스트 · 1,001개 직업 매칭',
    searchPlaceholder: '이름을 입력하세요 (예: 김서윤, 박대기, 홍길동, Steve...)',
    searchBtn: '내 직업 찾기',
    sampleLabel: '추천 이름:',
    ownerTitle: '{name}님에게 어울리는 직업은',
    certificateTitle: '나에게 어울리는 직업',
    zones: {
      GOOD: '대박 직업',
      BAD: '폭망 직업'
    },
    reality: {
      REAL: '실제 존재하는 직업·일거리',
      FICTION: '허구·상상·SF·판타지 직업'
    },
    categories: {
      EXTREME_3D_LABOR: '3D 극한 노동·위험 현장 일거리',
      PAST_EXTINCT_JOB: '고대·중세·근대 역사 속 사라진 직업',
      ROOM_NEET_SURVIVAL: '골방백수·방구석 생존·기상천외 무직',
      BIZARRE_PARTTIME: '세계의 황당한 알바·이색 상인',
      ABSURD_PRO_REAL: '기상천외 실제 프로 직업·극한 취재',
      FICTION_NOVEL_MOVIE: '영화·소설·애니·판타지 속 직업',
      TOURISM_EVENT_MERCHANT: '이색 관광거리·축제 이벤트 요원',
      CRYPTO_HACKER_TYCOON: '천재 해커·어둠의 크립토 괴짜',
      GLOBAL_VIP_EXECUTIVE: '억만장자·초호화 꿀직업·재벌 특권직',
      PLANETARY_TERRAFORM: '범지구 프로젝트·인류 구원 사령관',
      SPACE_GALACTIC_CORP: '공상과학(SF)·우주 개척·외계 교섭직',
      MULTIVERSE_DEITY_JOB: '초미래·다중우주·시공간 창조 아키텍트',
      BACKSU_NEETS: '골방백수·방구석 잉여·기괴한 무직',
      HISTORICAL_EXTREME: '고대·중세·근대 극한 역사 직업',
      EXTREME_JOURNALISM: '극한 현장·방송·기상천외 취재',
      WEIRD_BIZ_TRADE: '세계의 황당한 장사·이색 상인',
      TOURISM_EVENT: '기상천외 관광거리·특별 이벤트 요원',
      BIZARRE_REAL_JOB: '실제로 존재하는 신기한 이색 직업',
      FANTASY_MEDIA_JOB: '판타지·영화·애니·소설 속 일자리',
      HACKER_UNDERGROUND: '천재 해커·어둠의 일거리·크립토 괴짜',
      TYCOON_LUXURY: '억만장자·초호화 꿀직업·재벌 특권직',
      EARTH_MEGAPROJECT: '범지구 프로젝트·인류 구원 사령관',
      SPACE_SCIFI_JOB: '공상과학(SF)·우주 개척·외계 교섭직',
      MULTIVERSE_GOD: '초미래·다중우주·시공간 창조 아키텍트'
    },
    specs: {
      builtYearLabel: '언제 하던 직업인지',
      estimatedValueLabel: '추산되는 연봉',
      specialFeatureLabel: '직업의 특별한 역할·할일',
      aiVerdictLabel: 'AI 인사팀장 총평',
      eraLabel: '언제 하던 직업인지',
      salaryLabel: '추산되는 연봉',
      dutyLabel: '직업의 특별한 역할·할일',
      tierLabel: '티어',
      levelLabel: '단계'
    },
    tierTemplate: 'Tier {tier}: {name}',
    storyHeader: '"{name}님에게 어울리는 직업은"',
    storyPhotoHint: '인스타그램 스토리 / 틱톡 공유용 인증 카드',
    storySpecTitle: '직업 명세서',
    saveStoryBtn: '스토리 카드 이미지 저장',
    shareMobileBtn: '모바일로 공유하기',
    copyUrlBtn: '결과 링크 복사',
    copiedToast: '링크가 클립보드에 복사되었습니다!',
    prevHouseBtn: '◀ 이전 단계 직업 보기',
    nextHouseBtn: '다음 단계 직업 보기 ▶',
    randomHouseBtn: '🎲 랜덤 직업 보기',
    scrollPreviewTitle: '단계별 직업 목록 (클릭하여 사진 열람)',
    imageLockedBadge: '🔒 페이지에 들어가면 직업 사진이 공개됩니다',
    enterHouseBtn: '이 직업 들어가서 사진 보기 👉',
    linkedNameBadge: '👤 대표 취업자: {name}',
    seoTitleWithName: '{name}님에게 어울리는 직업은? {title} | MyJob AI 인사발령',
    seoDescWithName: '{name}님의 이름으로 찾은 평생 직업: {title} ({zoneLabel}, {realityLabel}).',
    seoImageKeywords: '{name} 직업 추천, {title}, MyJob',
    seoImgAltWithName: '{name}님에게 어울리는 직업: {title} ({categoryLabel}) - {name} job image',
    openShareModalBtn: '인스타 스토리 / 카톡 공유 카드 만들기',
    shareModal: {
      themeCert: '인사발령장',
      themeCyber: '사이버 네온',
      themeSunset: '노을 그라디언트',
      instaDirectBtn: '인스타그램 스토리로 바로 보내기 / 공유',
      tiktokDirectBtn: '틱톡 공유 (9:16 카드 & 링크)',
      whatsappDirectBtn: '왓츠앱으로 공유하기',
      savedToast: '📥 9:16 인스타 스토리 이미지가 저장되었습니다!',
      instaDownloadedToast: '📸 스토리가 다운로드되고 링크가 복사되었습니다!',
      tiktokDownloadedToast: '🎵 9:16 스토리가 다운로드되고 링크가 복사되었습니다!',
      whatsappOpenedToast: '🟢 왓츠앱으로 공유 메시지가 전송됩니다!',
      messengerCopiedToast: '💬 공유 주소가 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유하세요.'
    },
    photoDiaryLink: '포토 다이어리',
    photoDiaryTitle: '포토 다이어리 바로가기',
    langSelectLabel: '언어 변경',
    nameInputAria: '감정받을 이름 입력',
    randomDiceTitle: '🎲 주사위 굴려 무작위 이름 보기',
    randomDiceToast: "🎲 랜덤 이름 '{name}' 인사발령 완료!",
    refreshChipsTitle: '새로운 추천 이름 뽑기',
    refreshChipsToast: '🔄 추천 검색 이름이 새로고침되었습니다!',
    enterNameToast: '이름을 입력해주세요!',
    returnMyHouseText: '내 원래 직업({name} · Lv.{level})으로 돌아가기',
    returnMyHouseDefault: '내 원래 직업으로 돌아가기',
    adBadgeTop: 'AD · GOOGLE ADSENSE (상단 배너 광고 영역)',
    adBadgeMain: 'AD · GOOGLE ADSENSE (추천 직업 하단 광고 영역)',
    adBadgeFooter: 'AD · GOOGLE ADSENSE (하단 멀티플렉스 광고 영역)',
    adHintInfeed: 'Sponsored ({index}번째 카드 하단 광고)',
    scrollPreviewSubtitle: '제목을 클릭하면 해당 직업 페이지로 이동하여 사진을 확인할 수 있습니다.',
    scrollSubtitleHigher: "현재 레벨(Lv.{current})보다 더 높은 단계(Lv.{start}~{max})만 표시 중입니다. '전체 (0~1000)'를 누르면 0레벨부터 볼 수 있습니다.",
    scrollSubtitleAll: '0단계부터 {max}단계까지 제목을 클릭하면 해당 직업 페이지로 이동하여 사진을 확인할 수 있습니다.',
    scrollFilterAll: '전체 (0~1000)',
    scrollFilterBad: '💀 폭망 (Lv.0~499)',
    scrollFilterGood: '🌟 대박 (Lv.500~1000)',
    scrollFilterReal: '🏛️ 실존 50%',
    scrollFilterFiction: '🦄 허구 50%',
    previewEnterArrow: '사진 보기 ›',
    dockKeyboardHint: '💡 키보드 좌우 방향키(← / →)로 단계 이동, 스페이스바(Space)로 랜덤 탐색할 수 있습니다.',
    loadingText: 'AI 인사팀장이 다중우주 직업 등기부를 조회하고 있습니다...',
    loadingWithName: 'AI 인사팀장이 [{name}]님의 발령 내역을 조회 중입니다...',
    tiers: {
      1: 'Tier 01: 태초의 3D 막노동과 오물 처리',
      2: 'Tier 02: 역사 속 사라진 흑역사 직업',
      3: 'Tier 03: 골방 백수와 방구석 생존술',
      4: 'Tier 04: 세계의 기상천외 황당 알바',
      5: 'Tier 05: 극한 현장 방송과 목숨 건 취재',
      6: 'Tier 06: 눈물의 저임금 황당 장사치',
      7: 'Tier 07: 거리의 이색 삐끼와 이벤트 요원',
      8: 'Tier 08: 서브컬처·애니 속 불쌍한 졸개',
      9: 'Tier 09: 턱걸이 생계형 이색 전문가',
      10: 'Tier 10: 폭망 직업 마지노선 턱걸이',
      11: 'Tier 11: 대박 직업 입문 힐링 꿀보직',
      12: 'Tier 12: 천재 해커와 크립토 신흥 부자',
      13: 'Tier 13: 억만장자 개인 전담 특권직',
      14: 'Tier 14: 글로벌 대기업 총수와 거물',
      15: 'Tier 15: 심해·지하 메가프로젝트 사령관',
      16: 'Tier 16: 범지구 기후·인류 구원 프로젝트',
      17: 'Tier 17: 공상과학(SF) 궤도 기지 개척관',
      18: 'Tier 18: 행성간 무역상과 은하계 특사',
      19: 'Tier 19: 다이슨 스피어 우주 건설 총괄',
      20: 'Tier 20: 다중우주 시공간 창조 아키텍트'
    },
    guide: {
      sectionTitle: '💼 다중우주 인사발령원 안내서',
      badBadge: '0 ~ 499단계',
      badTitle: '💀 극단적 폭망 직업',
      badDesc: '고대 로마 콜로세움 맹수 우리 맨손 배설물 청소부, 대설특보 눈사람 박대기 기자, 10년차 골방백수 등 상상을 초월하는 극한 노동과 황당 직업들만 모여있습니다.',
      goodBadge: '500 ~ 1,000단계',
      goodTitle: '🌟 극단적 대박 직업',
      goodDesc: '남태평양 무인도 별장 관리인, 비트코인 8조원 화이트해커, 화성 테라포밍 총감독관, 다중우주 창조 아키텍트까지 펼쳐집니다.',
      ruleBadge: '1단계 단위 교차',
      ruleTitle: '🏛️ 실제 50% ↔ 🦄 허구 50%',
      ruleDesc: '<strong>짝수 단계</strong>는 지구상에 실제로 존재하거나 역사적으로 실존했던 기상천외한 일자리, <strong>홀수 단계</strong>는 SF·판타지·영화·소설 속 허구의 직업이 1단계마다 정확히 번갈아 나타납니다.'
    },
    whitepaper: {
      tag: 'FUN OCCUPATION MATCHING GUIDE',
      mainTitle: '이름만 입력해서 찾는 재미로 보는 나에게 어울리는 직업 (MyJob) 안내',
      art1Title: '💼 1. 이름만 입력하면 끝! 재미로 보는 나에게 어울리는 직업 찾기',
      art1P1: '나에게 어울리는 직업(MyJob)은 복잡한 가입이나 설문 없이 이름만 입력하면 나에게 어울리는 직업을 바로 찾을 수 있는 재미로 보는 직업 매칭 테스트입니다. 내 이름은 물론 가족, 친구, 연인, 좋아하는 최애의 이름만 입력해 보세요! 한글 자모 획수와 위치 가중치를 분석하여 0단계부터 1,000단계까지 1,001가지 기상천외한 직업 중 찰떡같이 어울리는 직업을 찾아줍니다.',
      art1P2: '이름 한 글자나 획수 하나만 달라져도 0단계(폭망 직업)부터 1,000단계(대박 직업)까지 전혀 다른 직업이 배정됩니다. 같은 이름을 입력하면 언제나 똑같은 직업이 나오니, 친구들과 서로의 이름을 검색해 누가 더 웃기고 황당한 일자리나 초고연봉 미래 직업에 당첨되는지 재미로 비교하고 공유해 보세요!',
      art2Title: '⚡ 2. 평범한 사무직은 없다! 1,001가지 극단적이고 웃긴 일자리',
      art2P1: '이 테스트에는 흔하고 평범한 회사원이 없습니다. 눈보라 속 눈사람이 된 박대기 기자, 비트코인 8조 원을 탈환한 해커, 골방백수부터 화성 테라포밍 총감독관까지 황당하고 웃긴 1,001개의 독창적인 일자리가 준비되어 있습니다.',
      art2P2: '또한 짝수 단계(0, 2, 4...)는 역사 속 실제 직업이나 지구상에 실존하는 기이한 일자리를, 홀수 단계(1, 3, 5...)는 SF·판타지 소설 속 상상의 직업을 정확히 1단계 단위로 50:50 번갈아 배치하여 지적 탐구와 유쾌한 웃음을 동시에 선사합니다.',
      art3Title: '🛡️ 3. 개인정보 저장 없는 안전한 재미용 테스트',
      art3P1: '나에게 어울리는 직업(MyJob)은 검색창에 입력한 어떠한 이름이나 검색 기록도 서버에 저장하지 않습니다. 모든 결과는 화면에서 즉시 계산되고 사라지므로 누구나 안심하고 재미로 이름을 검색해 볼 수 있습니다.',
      art3P2: '직업마다 적혀 있는 활동 시대, 추산 연봉, 특별한 역할과 할일, AI 인사팀장 총평은 모두 유쾌한 웃음과 상상력을 위해 꾸며낸 엔터테인먼트 콘텐츠입니다. 결과 카드를 이미지로 저장해 인스타그램 스토리나 카카오톡으로 친구들에게 내 직업을 자랑해 보세요!'
    },
    footer: {
      brand: '나에게 어울리는 직업 (MyJob)',
      about: '소개 (About)',
      contact: '문의 (Contact)',
      privacy: '개인정보처리방침 (Privacy Policy)',
      terms: '이용약관 (Terms of Service)',
      consent: '개인정보설정 (Consent)',
      desc: '본 서비스는 이름만 입력해서 재미로 보는 나에게 어울리는 직업 매칭 테스트 및 나의 직업 고르기 이상형 월드컵입니다.'
    }
  },

  en: {
    familyNav: {
      job: 'My Job',
      myhome: 'My Home',
      food: 'My Food',
      photodiary: 'Photo Diary'
    },
    brandHeader: 'The Job That Suits You',
    brandSub: 'Fun Name-Based Job Matching Test · 1,001 Career Matching',
    searchPlaceholder: 'Enter a name (e.g. Steve, Emma, Alex, Noah...)',
    searchBtn: 'Find My Job',
    sampleLabel: 'Trending Names:',
    ownerTitle: 'The job that suits {name} is',
    certificateTitle: 'The Job That Suits You',
    zones: {
      GOOD: 'Dream Job',
      BAD: 'Nightmare Job'
    },
    reality: {
      REAL: 'Real-World Job',
      FICTION: 'Fictional & Sci-Fi Job'
    },
    categories: {
      EXTREME_3D_LABOR: 'Extreme 3D Hazard Labor',
      PAST_EXTINCT_JOB: 'Extinct Historical Occupations',
      ROOM_NEET_SURVIVAL: 'Room NEET & Slacker Survival',
      BIZARRE_PARTTIME: 'Bizarre & Odd Part-Time Jobs',
      ABSURD_PRO_REAL: 'Absurd Real Professional Work',
      FICTION_NOVEL_MOVIE: 'Fictional & Sci-Fi Roles',
      TOURISM_EVENT_MERCHANT: 'Tourism, Event & Street Vendor',
      CRYPTO_HACKER_TYCOON: 'Genius Hacker & Crypto Rogue',
      GLOBAL_VIP_EXECUTIVE: 'Billionaire VIP & Executive',
      PLANETARY_TERRAFORM: 'Planetary Terraform Commander',
      SPACE_GALACTIC_CORP: 'Intergalactic Corp Specialist',
      MULTIVERSE_DEITY_JOB: 'Multiverse Timeline Architect',
      BACKSU_NEETS: 'Room NEET & Slacker Survival',
      HISTORICAL_EXTREME: 'Extinct Historical Occupations',
      EXTREME_JOURNALISM: 'Absurd Real Professional Work',
      WEIRD_BIZ_TRADE: 'Bizarre & Odd Part-Time Jobs',
      TOURISM_EVENT: 'Tourism, Event & Street Vendor',
      BIZARRE_REAL_JOB: 'Extreme 3D Hazard Labor',
      FANTASY_MEDIA_JOB: 'Fictional & Sci-Fi Roles',
      HACKER_UNDERGROUND: 'Genius Hacker & Crypto Rogue',
      TYCOON_LUXURY: 'Billionaire VIP & Executive',
      EARTH_MEGAPROJECT: 'Planetary Terraform Commander',
      SPACE_SCIFI_JOB: 'Intergalactic Corp Specialist',
      MULTIVERSE_GOD: 'Multiverse Timeline Architect'
    },
    specs: {
      builtYearLabel: 'Era / When Active',
      estimatedValueLabel: 'Estimated Salary',
      specialFeatureLabel: 'Special Role & Duty',
      aiVerdictLabel: 'AI HR Director Verdict',
      eraLabel: 'Era / When Active',
      salaryLabel: 'Estimated Salary',
      dutyLabel: 'Special Role & Duty',
      tierLabel: 'Tier',
      levelLabel: 'Level'
    },
    tierTemplate: 'Tier {tier}: {name}',
    storyHeader: '"The Job That Suits {name}"',
    storyPhotoHint: 'Instagram Story / TikTok Sharing Card',
    storySpecTitle: 'Career Specification',
    saveStoryBtn: 'Save Story Card',
    shareMobileBtn: 'Share on Mobile',
    copyUrlBtn: 'Copy Result Link',
    copiedToast: 'Link copied to clipboard!',
    prevHouseBtn: '◀ Previous Job',
    nextHouseBtn: 'Next Job ▶',
    randomHouseBtn: '🎲 Random Job',
    scrollPreviewTitle: 'Job List by Level (Click to View Photo)',
    imageLockedBadge: '🔒 Photo unlocks on page visit',
    enterHouseBtn: 'View Job & Photo 👉',
    linkedNameBadge: '👤 Featured Match: {name}',
    seoTitleWithName: 'The Job That Suits {name}? {title} | MyJob AI HR Appraisal',
    seoDescWithName: 'Lifelong career for {name}: {title} ({zoneLabel}, {realityLabel}).',
    seoImageKeywords: '{title}, MyJob, TellMyName',
    seoImgAltWithName: 'The job that suits {name}: {title} ({categoryLabel}) - {name} job image',
    openShareModalBtn: 'Create Instagram Story / Share Card',
    shareModal: {
      themeCert: 'Official Appointment',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Sunset Gradient',
      instaDirectBtn: 'Share to Instagram Story Directly',
      tiktokDirectBtn: 'Share to TikTok (9:16 Card & Link)',
      whatsappDirectBtn: 'Share via WhatsApp',
      savedToast: '📥 9:16 Instagram Story image saved!',
      instaDownloadedToast: '📸 Story downloaded and link copied to clipboard!',
      tiktokDownloadedToast: '🎵 9:16 Story downloaded and link copied to clipboard!',
      whatsappOpenedToast: '🟢 WhatsApp share message opened!',
      messengerCopiedToast: '💬 Share URL copied! Paste and share in chat.'
    },
    photoDiaryLink: 'Photo Diary',
    photoDiaryTitle: 'Go to Photo Diary',
    langSelectLabel: 'Change Language',
    nameInputAria: 'Enter a name to appraise',
    randomDiceTitle: '🎲 Roll dice for a random name',
    randomDiceToast: "🎲 Random name '{name}' assigned!",
    refreshChipsTitle: 'Get new trending names',
    refreshChipsToast: '🔄 Trending names refreshed!',
    enterNameToast: 'Please enter a name!',
    returnMyHouseText: 'Return to My Job ({name} · Lv.{level})',
    returnMyHouseDefault: 'Return to My Job',
    adBadgeTop: 'AD · GOOGLE ADSENSE',
    adBadgeMain: 'AD · GOOGLE ADSENSE',
    adBadgeFooter: 'AD · GOOGLE ADSENSE',
    adHintInfeed: 'Sponsored (Ad below card #{index})',
    scrollPreviewSubtitle: 'Click any title to view the full appraisal card and illustration.',
    scrollSubtitleHigher: "Showing levels (Lv.{start}~{max}) higher than current (Lv.{current}). Click 'All (0~1000)' to see from Level 0.",
    scrollSubtitleAll: 'Click any title from Level 0 to Level {max} to view details and photos.',
    scrollFilterAll: 'All (0~1000)',
    scrollFilterBad: '💀 Nightmare (Lv.0~499)',
    scrollFilterGood: '🌟 Dream (Lv.500~1000)',
    scrollFilterReal: '🏛️ Real 50%',
    scrollFilterFiction: '🦄 Fiction 50%',
    previewEnterArrow: 'View Photo ›',
    dockKeyboardHint: '💡 Use Left/Right Arrow keys (← / →) to step levels, Spacebar to explore randomly.',
    loadingText: 'AI HR Director is querying the multiverse career registry...',
    loadingWithName: 'AI HR Director is appraising the career registry for [{name}]...',
    tiers: {
      1: 'Tier 01: Extreme 3D Labor & Waste Handler',
      2: 'Tier 02: Extinct Historical Hardship Jobs',
      3: 'Tier 03: Room NEET & Slacker Survivalist',
      4: 'Tier 04: Bizarre Oddity & Novelty Part-timers',
      5: 'Tier 05: Extreme Hazard Journalism & Media',
      6: 'Tier 06: Absurd Low-Pay Street Peddler',
      7: 'Tier 07: Bizarre Tourism & Mascot Agent',
      8: 'Tier 08: Subculture & Fictional Underdog',
      9: 'Tier 09: Curious Professional Realist',
      10: 'Tier 10: Barely Surviving Threshold',
      11: 'Tier 11: Chill & Healing Dream Careers',
      12: 'Tier 12: Genius Hacker & Crypto Tycoon',
      13: 'Tier 13: Luxury Billionaire Concierge',
      14: 'Tier 14: Global Executive & Media Titan',
      15: 'Tier 15: Deep-Sea & Megastructure Leader',
      16: 'Tier 16: Earth Megaproject Commander',
      17: 'Tier 17: Sci-Fi Orbital Colony Director',
      18: 'Tier 18: Intergalactic Envoy & Trader',
      19: 'Tier 19: Dyson Sphere Cosmic Architect',
      20: 'Tier 20: Multiverse Timeline Creator'
    },
    guide: {
      sectionTitle: '💼 Multiverse HR Career Guide',
      badBadge: 'Levels 0 ~ 499',
      badTitle: '💀 Extreme Nightmare Jobs',
      badDesc: 'Barehanded Colosseum lion cage cleaners, snowstorm frozen reporters, 10-year bedroom hermits, and bizarre survival tasks.',
      goodBadge: 'Levels 500 ~ 1,000',
      goodTitle: '🌟 Extreme Dream Jobs',
      goodDesc: 'Private tropical island caretakers, 8-billion-dollar crypto whitehats, Mars terraforming directors, and cosmic architects.',
      ruleBadge: '1-Level Alternating Rule',
      ruleTitle: '🏛️ Real 50% ↔ 🦄 Fiction 50%',
      ruleDesc: '<strong>Even levels</strong> feature real-world or historical occupations; <strong>odd levels</strong> feature imaginative sci-fi and fantasy careers, alternating strictly every single level.'
    },
    whitepaper: {
      tag: 'FUN OCCUPATION MATCHING GUIDE',
      mainTitle: 'About The Job That Suits You (MyJob) — Fun Name-Based Career Test',
      art1Title: '💼 1. Just Enter Your Name! Find Your Ideal Career For Fun',
      art1P1: 'MyJob is a fun, zero-signup name-based career matching test. Just type your name, or friends, family, and celebrities! Using algorithmic stroke and phoneme mapping, it finds your destiny among 1,001 bizarre jobs from Level 0 to Level 1,000.',
      art1P2: 'Changing even one letter or stroke completely changes your destiny from a nightmare job to an ultra-wealthy dream career. Share with friends to see who gets the funniest job!',
      art2Title: '⚡ 2. No Boring Office Jobs! 1,001 Bizarre Careers',
      art2P1: 'You will find no boring corporate cubicle jobs here. From snowstorm reporters to bitcoin recovery hackers and Mars terraforming leaders, enjoy 1,001 unique, humorous occupations.',
      art2P2: 'Even levels showcase real historical or bizarre existing jobs, while odd levels bring fictional sci-fi and fantasy roles to life, alternating 50:50 every single level.',
      art3Title: '🛡️ 3. Safe Fun with Zero Personal Data Storage',
      art3P1: 'MyJob stores no search logs or names on any server. Every result is computed instantly in your browser or edge worker and disappears upon leaving.',
      art3P2: 'All eras, salaries, duties, and verdicts are curated entertainment designed to spark laughter and imagination. Save your Instagram story card and share your job!'
    },
    footer: {
      brand: 'The Job That Suits You (MyJob)',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      consent: 'Consent Settings',
      desc: 'This service is a fun name-based job matching test and career tournament for entertainment purposes.'
    }
  }
};

// 12 Additional Native Language Configurations
const MULTILANG_DEFINITIONS = {
  hi: {
    familyNav: {
      job: 'मेरी नौकरी',
      myhome: 'मेरा घर',
      food: 'मेरा भोजन',
      photodiary: 'फोटो डायरी'
    },
    brandHeader: 'आपके लिए उपयुक्त नौकरी',
    brandSub: 'नाम से जानें अपनी नियति • 1,001 नौकरियों का मिलान',
    searchPlaceholder: 'नाम दर्ज करें (उदा. Aarav, Diya, Steve...)',
    searchBtn: 'मेरी नौकरी खोजें',
    sampleLabel: 'लोकप्रिय नाम:',
    ownerTitle: '{name} के लिए सबसे उपयुक्त नौकरी है',
    certificateTitle: 'आपके लिए उपयुक्त नौकरी',
    zones: { GOOD: 'शानदार नौकरी', BAD: 'बदहाल नौकरी' },
    reality: { REAL: 'वास्तविक दुनिया की नौकरी', FICTION: 'काल्पनिक व विज्ञान-कथा नौकरी' },
    specs: {
      builtYearLabel: 'सक्रिय काल / युग',
      estimatedValueLabel: 'अनुमानित वेतन',
      specialFeatureLabel: 'विशेष भूमिका व कर्तव्य',
      aiVerdictLabel: 'AI एचआर निदेशक का फैसला',
      eraLabel: 'सक्रिय काल / युग',
      salaryLabel: 'अनुमानित वेतन',
      dutyLabel: 'विशेष भूमिका व कर्तव्य',
      tierLabel: 'टियर',
      levelLabel: 'स्तर'
    },
    storyHeader: '"{name} के लिए उपयुक्त नौकरी"',
    storyPhotoHint: 'इंस्टाग्राम स्टोरी / टिकटॉक शेयरिंग कार्ड',
    storySpecTitle: 'करियर विनिर्देश',
    saveStoryBtn: 'स्टोरी कार्ड सहेजें',
    shareMobileBtn: 'मोबाइल पर साझा करें',
    copyUrlBtn: 'परिणाम लिंक कॉपी करें',
    copiedToast: 'लिंक क्लिपबोर्ड पर कॉपी हो गया!',
    openShareModalBtn: 'इंस्टा स्टोरी / शेयर कार्ड बनाएं',
    shareModal: {
      themeCert: 'आधिकारिक नियुक्ति',
      themeCyber: 'साइबर नियॉन',
      themeSunset: 'सूर्यास्त ढाल',
      instaDirectBtn: 'सीधे इंस्टाग्राम स्टोरी पर साझा करें',
      tiktokDirectBtn: 'टिकटॉक पर साझा करें (9:16 कार्ड और लिंक)',
      whatsappDirectBtn: 'व्हाट्सएप के जरिए साझा करें',
      savedToast: '📥 9:16 इंस्टाग्राम स्टोरी इमेज सहेजी गई!',
      instaDownloadedToast: '📸 स्टोरी डाउनलोड हुई और लिंक कॉपी हुआ!',
      tiktokDownloadedToast: '🎵 9:16 स्टोरी डाउनलोड हुई और लिंक कॉपी हुआ!',
      whatsappOpenedToast: '🟢 व्हाट्सएप शेयर संदेश खोला गया!',
      messengerCopiedToast: '💬 शेयर लिंक कॉपी हो गया! चैट में पेस्ट करें।'
    }
  },

  vi: {
    familyNav: {
      job: 'Nghề của tôi',
      myhome: 'Nhà của tôi',
      food: 'Món ăn của tôi',
      photodiary: 'Nhật ký ảnh'
    },
    brandHeader: 'Nghề Nghiệp Phù Hợp Với Bạn',
    brandSub: 'Trắc nghiệm nghề nghiệp theo tên vui nhộn · Khớp nối 1.001 công việc',
    searchPlaceholder: 'Nhập tên của bạn (vd: Minh, Linh, Steve...)',
    searchBtn: 'Tìm nghề của tôi',
    sampleLabel: 'Tên phổ biến:',
    ownerTitle: 'Công việc phù hợp với {name} là',
    certificateTitle: 'Nghề Nghiệp Phù Hợp Với Bạn',
    zones: { GOOD: 'Nghề Hoàng Kim', BAD: 'Nghề Thảm Họa' },
    reality: { REAL: 'Nghề Có Thật Ngoài Đời', FICTION: 'Nghề Hư Cấu & Viễn Tưởng' },
    specs: {
      builtYearLabel: 'Thời kỳ / Niên đại hoạt động',
      estimatedValueLabel: 'Mức lương ước tính',
      specialFeatureLabel: 'Vai trò & Nhiệm vụ đặc biệt',
      aiVerdictLabel: 'Đánh giá của Giám đốc Nhân sự AI',
      eraLabel: 'Thời kỳ / Niên đại hoạt động',
      salaryLabel: 'Mức lương ước tính',
      dutyLabel: 'Vai trò & Nhiệm vụ đặc biệt',
      tierLabel: 'Hạng',
      levelLabel: 'Cấp'
    },
    storyHeader: '"Nghề Nghiệp Phù Hợp Với {name}"',
    storyPhotoHint: 'Thẻ chia sẻ Instagram Story / TikTok',
    storySpecTitle: 'Hồ sơ nghề nghiệp',
    saveStoryBtn: 'Lưu thẻ Story',
    shareMobileBtn: 'Chia sẻ qua điện thoại',
    copyUrlBtn: 'Sao chép liên kết kết quả',
    copiedToast: 'Đã sao chép liên kết vào bộ nhớ tạm!',
    openShareModalBtn: 'Tạo thẻ chia sẻ Insta Story',
    shareModal: {
      themeCert: 'Quyết định bổ nhiệm',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Hoàng hôn rực rỡ',
      instaDirectBtn: 'Chia sẻ trực tiếp lên Instagram Story',
      tiktokDirectBtn: 'Chia sẻ lên TikTok (Thẻ 9:16 & link)',
      whatsappDirectBtn: 'Chia sẻ qua WhatsApp',
      savedToast: '📥 Đã lưu ảnh Instagram Story 9:16!',
      instaDownloadedToast: '📸 Đã tải ảnh Story và sao chép liên kết!',
      tiktokDownloadedToast: '🎵 Đã tải ảnh 9:16 và sao chép liên kết!',
      whatsappOpenedToast: '🟢 Đang mở chia sẻ WhatsApp!',
      messengerCopiedToast: '💬 Đã sao chép liên kết! Hãy dán vào ứng dụng nhắn tin.'
    }
  },

  fr: {
    familyNav: {
      job: 'Mon Métier',
      myhome: 'Ma Maison',
      food: 'Mon Repas',
      photodiary: 'Journal Photo'
    },
    brandHeader: 'Le Métier Qui Vous Correspond',
    brandSub: 'Test amusant de métier basé sur votre prénom · 1 001 carrières',
    searchPlaceholder: 'Entrez un prénom (ex: Lucas, Emma, Steve...)',
    searchBtn: 'Trouver mon métier',
    sampleLabel: 'Prénoms populaires :',
    ownerTitle: 'Le métier qui correspond à {name} est',
    certificateTitle: 'Le Métier Qui Vous Correspond',
    zones: { GOOD: 'Métier de Rêve', BAD: 'Métier Cauchemar' },
    reality: { REAL: 'Métier du Monde Réel', FICTION: 'Métier Fictif & Sci-Fi' },
    specs: {
      builtYearLabel: 'Époque / Période d’activité',
      estimatedValueLabel: 'Salaire estimé',
      specialFeatureLabel: 'Rôle & Mission spéciale',
      aiVerdictLabel: 'Verdict du Directeur RH IA',
      eraLabel: 'Époque / Période',
      salaryLabel: 'Salaire estimé',
      dutyLabel: 'Rôle & Mission spéciale',
      tierLabel: 'Rang',
      levelLabel: 'Niveau'
    },
    storyHeader: '"Le Métier Qui Correspond à {name}"',
    storyPhotoHint: 'Carte de partage Instagram Story / TikTok',
    storySpecTitle: 'Spécification de carrière',
    saveStoryBtn: 'Enregistrer la carte Story',
    shareMobileBtn: 'Partager sur mobile',
    copyUrlBtn: 'Copier le lien du résultat',
    copiedToast: 'Lien copié dans le presse-papiers !',
    openShareModalBtn: 'Créer une carte Story Instagram',
    shareModal: {
      themeCert: 'Avis officiel de nomination',
      themeCyber: 'Cyber Néon',
      themeSunset: 'Dégradé Crépuscule',
      instaDirectBtn: 'Partager directement sur Instagram Story',
      tiktokDirectBtn: 'Partager sur TikTok (Carte 9:16 & lien)',
      whatsappDirectBtn: 'Partager via WhatsApp',
      savedToast: '📥 Image Instagram Story 9:16 enregistrée !',
      instaDownloadedToast: '📸 Story téléchargée et lien copié !',
      tiktokDownloadedToast: '🎵 Image 9:16 téléchargée et lien copié !',
      whatsappOpenedToast: '🟢 Partage WhatsApp ouvert !',
      messengerCopiedToast: '💬 Lien copié ! Collez-le dans votre messagerie.'
    }
  },

  pt: {
    familyNav: {
      job: 'Minha Profissão',
      myhome: 'Minha Casa',
      food: 'Minha Comida',
      photodiary: 'Diário de Fotos'
    },
    brandHeader: 'A Profissão Ideal Para Você',
    brandSub: 'Teste divertido de profissão baseado no seu nome · 1.001 carreiras',
    searchPlaceholder: 'Digite um nome (ex: Miguel, Helena, Steve...)',
    searchBtn: 'Encontrar Minha Profissão',
    sampleLabel: 'Nomes populares:',
    ownerTitle: 'A profissão ideal para {name} é',
    certificateTitle: 'A Profissão Ideal Para Você',
    zones: { GOOD: 'Profissão dos Sonhos', BAD: 'Profissão Pesadelo' },
    reality: { REAL: 'Profissão Real', FICTION: 'Profissão Fictícia & Sci-Fi' },
    specs: {
      builtYearLabel: 'Época / Período em atividade',
      estimatedValueLabel: 'Salário estimado',
      specialFeatureLabel: 'Função & Dever especial',
      aiVerdictLabel: 'Veredito do Diretor de RH IA',
      eraLabel: 'Época / Período',
      salaryLabel: 'Salário estimado',
      dutyLabel: 'Função & Dever especial',
      tierLabel: 'Nível',
      levelLabel: 'Grau'
    },
    storyHeader: '"A Profissão Ideal Para {name}"',
    storyPhotoHint: 'Cartão para compartilhar no Instagram Story / TikTok',
    storySpecTitle: 'Ficha da Carreira',
    saveStoryBtn: 'Salvar Cartão de Story',
    shareMobileBtn: 'Compartilhar no Celular',
    copyUrlBtn: 'Copiar Link do Resultado',
    copiedToast: 'Link copiado para a área de transferência!',
    openShareModalBtn: 'Criar Cartão do Instagram Story',
    shareModal: {
      themeCert: 'Aviso de Nomeação Oficial',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Pôr do Sol Gradiente',
      instaDirectBtn: 'Compartilhar direto no Instagram Story',
      tiktokDirectBtn: 'Compartilhar no TikTok (Cartão 9:16 e link)',
      whatsappDirectBtn: 'Compartilhar via WhatsApp',
      savedToast: '📥 Imagem 9:16 do Instagram Story salva!',
      instaDownloadedToast: '📸 Story baixado e link copiado!',
      tiktokDownloadedToast: '🎵 Imagem 9:16 baixada e link copiado!',
      whatsappOpenedToast: '🟢 Compartilhamento no WhatsApp aberto!',
      messengerCopiedToast: '💬 Link copiado! Cole no seu aplicativo de mensagens.'
    }
  },

  es: {
    familyNav: {
      job: 'Mi Trabajo',
      myhome: 'Mi Casa',
      food: 'Mi Comida',
      photodiary: 'Diario de Fotos'
    },
    brandHeader: 'El Trabajo Ideal Para Ti',
    brandSub: 'Test divertido de profesión según tu nombre · 1.001 empleos únicos',
    searchPlaceholder: 'Ingresa un nombre (ej: Mateo, Sofía, Steve...)',
    searchBtn: 'Buscar Mi Trabajo',
    sampleLabel: 'Nombres populares:',
    ownerTitle: 'El trabajo ideal para {name} es',
    certificateTitle: 'El Trabajo Ideal Para Ti',
    zones: { GOOD: 'Trabajo Soñado', BAD: 'Trabajo Pesadilla' },
    reality: { REAL: 'Trabajo Real', FICTION: 'Trabajo Ficticio & Sci-Fi' },
    specs: {
      builtYearLabel: 'Época / Período en activo',
      estimatedValueLabel: 'Salario estimado',
      specialFeatureLabel: 'Función & Tarea especial',
      aiVerdictLabel: 'Veredicto del Director de RRHH con IA',
      eraLabel: 'Época / Período',
      salaryLabel: 'Salario estimado',
      dutyLabel: 'Función & Tarea especial',
      tierLabel: 'Rango',
      levelLabel: 'Nivel'
    },
    storyHeader: '"El Trabajo Ideal Para {name}"',
    storyPhotoHint: 'Tarjeta para compartir en Instagram Story / TikTok',
    storySpecTitle: 'Ficha de la profesión',
    saveStoryBtn: 'Guardar Tarjeta de Story',
    shareMobileBtn: 'Compartir en Móvil',
    copyUrlBtn: 'Copiar Enlace del Resultado',
    copiedToast: '¡Enlace copiado al portapapeles!',
    openShareModalBtn: 'Crear Tarjeta de Instagram Story',
    shareModal: {
      themeCert: 'Nombramiento Oficial',
      themeCyber: 'Cyber Neón',
      themeSunset: 'Atardecer Gradiente',
      instaDirectBtn: 'Compartir directamente en Instagram Story',
      tiktokDirectBtn: 'Compartir en TikTok (Tarjeta 9:16 y link)',
      whatsappDirectBtn: 'Compartir por WhatsApp',
      savedToast: '📥 ¡Imagen 9:16 de Instagram Story guardada!',
      instaDownloadedToast: '📸 ¡Story descargado y enlace copiado!',
      tiktokDownloadedToast: '🎵 ¡Tarjeta 9:16 descargada y enlace copiado!',
      whatsappOpenedToast: '🟢 ¡Mensaje para WhatsApp abierto!',
      messengerCopiedToast: '💬 ¡Enlace copiado! Pégalo en tu aplicación de mensajería.'
    }
  },

  id: {
    familyNav: {
      job: 'Pekerjaan Saya',
      myhome: 'Rumah Saya',
      food: 'Makanan Saya',
      photodiary: 'Buku Harian Foto'
    },
    brandHeader: 'Pekerjaan yang Cocok untuk Anda',
    brandSub: 'Tes kecocokan karier berdasarkan nama · 1.001 pekerjaan unik',
    searchPlaceholder: 'Masukkan nama (contoh: Budi, Siti, Steve...)',
    searchBtn: 'Cari Pekerjaan Saya',
    sampleLabel: 'Nama populer:',
    ownerTitle: 'Pekerjaan yang cocok untuk {name} adalah',
    certificateTitle: 'Pekerjaan yang Cocok untuk Anda',
    zones: { GOOD: 'Pekerjaan Impian', BAD: 'Pekerjaan Mimpi Buruk' },
    reality: { REAL: 'Pekerjaan Nyata', FICTION: 'Pekerjaan Fiksi & Fiksi Ilmiah' },
    specs: {
      builtYearLabel: 'Era / Masa aktif',
      estimatedValueLabel: 'Perkiraan gaji',
      specialFeatureLabel: 'Peran & Tugas khusus',
      aiVerdictLabel: 'Keputusan Direktur HR AI',
      eraLabel: 'Era / Masa aktif',
      salaryLabel: 'Perkiraan gaji',
      dutyLabel: 'Peran & Tugas khusus',
      tierLabel: 'Tingkat',
      levelLabel: 'Level'
    },
    storyHeader: '"Pekerjaan yang Cocok untuk {name}"',
    storyPhotoHint: 'Kartu berbagi Instagram Story / TikTok',
    storySpecTitle: 'Spesifikasi Karier',
    saveStoryBtn: 'Simpan Kartu Story',
    shareMobileBtn: 'Bagikan via Ponsel',
    copyUrlBtn: 'Salin Tautan Hasil',
    copiedToast: 'Tautan disalin ke papan klip!',
    openShareModalBtn: 'Buat Kartu Instagram Story',
    shareModal: {
      themeCert: 'Surat Keputusan Resmi',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Gradien Senja',
      instaDirectBtn: 'Bagikan langsung ke Instagram Story',
      tiktokDirectBtn: 'Bagikan ke TikTok (Kartu 9:16 & tautan)',
      whatsappDirectBtn: 'Bagikan lewat WhatsApp',
      savedToast: '📥 Gambar 9:16 Instagram Story tersimpan!',
      instaDownloadedToast: '📸 Story diunduh dan tautan disalin!',
      tiktokDownloadedToast: '🎵 Gambar 9:16 diunduh dan tautan disalin!',
      whatsappOpenedToast: '🟢 Pesan WhatsApp terbuka!',
      messengerCopiedToast: '💬 Tautan disalin! Tempelkan di obrolan Anda.'
    }
  },

  ru: {
    familyNav: {
      job: 'Моя Профессия',
      myhome: 'Мой Дом',
      food: 'Моя Еда',
      photodiary: 'Фотодневник'
    },
    brandHeader: 'Подходящая Вам Профессия',
    brandSub: 'Шуточный тест подбора профессии по имени · 1 001 вакансия',
    searchPlaceholder: 'Введите имя (напр. Александр, София, Steve...)',
    searchBtn: 'Найти мою профессию',
    sampleLabel: 'Популярные имена:',
    ownerTitle: 'Профессия, которая подходит {name}:',
    certificateTitle: 'Подходящая Вам Профессия',
    zones: { GOOD: 'Работа Мечты', BAD: 'Работа-Кошмар' },
    reality: { REAL: 'Реальная профессия', FICTION: 'Вымышленная и Sci-Fi' },
    specs: {
      builtYearLabel: 'Эпоха / Период активности',
      estimatedValueLabel: 'Примерная зарплата',
      specialFeatureLabel: 'Особая роль и обязанности',
      aiVerdictLabel: 'Вердикт ИИ HR-директора',
      eraLabel: 'Эпоха / Период',
      salaryLabel: 'Примерная зарплата',
      dutyLabel: 'Особая роль и обязанности',
      tierLabel: 'Тир',
      levelLabel: 'Уровень'
    },
    storyHeader: '"Профессия, подходящая {name}"',
    storyPhotoHint: 'Карточка для Instagram Story / TikTok',
    storySpecTitle: 'Характеристики профессии',
    saveStoryBtn: 'Сохранить карточку Story',
    shareMobileBtn: 'Поделиться с телефона',
    copyUrlBtn: 'Скопировать ссылку',
    copiedToast: 'Ссылка скопирована в буфер обмена!',
    openShareModalBtn: 'Создать карточку Instagram Story',
    shareModal: {
      themeCert: 'Официальный приказ',
      themeCyber: 'Кибернеон',
      themeSunset: 'Закатный градиент',
      instaDirectBtn: 'Отправить напрямую в Instagram Story',
      tiktokDirectBtn: 'Поделиться в TikTok (формат 9:16 и ссылка)',
      whatsappDirectBtn: 'Поделиться через WhatsApp',
      savedToast: '📥 Изображение 9:16 для Instagram Story сохранено!',
      instaDownloadedToast: '📸 Стори скачана, ссылка скопирована!',
      tiktokDownloadedToast: '🎵 Формат 9:16 скачан, ссылка скопирована!',
      whatsappOpenedToast: '🟢 Диалог WhatsApp открыт!',
      messengerCopiedToast: '💬 Ссылка скопирована! Вставьте ее в мессенджер.'
    }
  },

  de: {
    familyNav: {
      job: 'Mein Beruf',
      myhome: 'Mein Zuhause',
      food: 'Mein Essen',
      photodiary: 'Fototagebuch'
    },
    brandHeader: 'Der Beruf, Der Zu Dir Passt',
    brandSub: 'Unterhaltsamer Namens-Berufstest · 1.001 einzigartige Berufe',
    searchPlaceholder: 'Namen eingeben (z. B. Noah, Emilia, Steve...)',
    searchBtn: 'Meinen Beruf Finden',
    sampleLabel: 'Beliebte Namen:',
    ownerTitle: 'Der Beruf, der zu {name} passt, ist',
    certificateTitle: 'Der Beruf, Der Zu Dir Passt',
    zones: { GOOD: 'Traumberuf', BAD: 'Albtraum-Beruf' },
    reality: { REAL: 'Echter Beruf', FICTION: 'Fiktiver & Sci-Fi-Beruf' },
    specs: {
      builtYearLabel: 'Epoche / Tätigkeitszeitraum',
      estimatedValueLabel: 'Geschätztes Gehalt',
      specialFeatureLabel: 'Besondere Rolle & Aufgabe',
      aiVerdictLabel: 'Urteil des KI-Personalleiters',
      eraLabel: 'Epoche / Zeitraum',
      salaryLabel: 'Geschätztes Gehalt',
      dutyLabel: 'Besondere Rolle & Aufgabe',
      tierLabel: 'Rang',
      levelLabel: 'Stufe'
    },
    storyHeader: '"Der Beruf, der zu {name} passt"',
    storyPhotoHint: 'Karte zum Teilen für Instagram Story / TikTok',
    storySpecTitle: 'Berufsspezifikation',
    saveStoryBtn: 'Story-Karte speichern',
    shareMobileBtn: 'Auf dem Smartphone teilen',
    copyUrlBtn: 'Ergebnislink kopieren',
    copiedToast: 'Link in die Zwischenablage kopiert!',
    openShareModalBtn: 'Instagram Story-Karte erstellen',
    shareModal: {
      themeCert: 'Offizielle Ernennungsurkunde',
      themeCyber: 'Cyber-Neon',
      themeSunset: 'Sonnenuntergangs-Verlauf',
      instaDirectBtn: 'Direkt in Instagram Story teilen',
      tiktokDirectBtn: 'Auf TikTok teilen (9:16-Karte & Link)',
      whatsappDirectBtn: 'Über WhatsApp teilen',
      savedToast: '📥 9:16 Instagram Story-Bild gespeichert!',
      instaDownloadedToast: '📸 Story heruntergeladen und Link kopiert!',
      tiktokDownloadedToast: '🎵 9:16-Bild heruntergeladen und Link kopiert!',
      whatsappOpenedToast: '🟢 WhatsApp-Nachricht geöffnet!',
      messengerCopiedToast: '💬 Link kopiert! In Chat-App einfügen.'
    }
  },

  it: {
    familyNav: {
      job: 'Il Mio Lavoro',
      myhome: 'La Mia Casa',
      food: 'Il Mio Cibo',
      photodiary: 'Diario Fotografico'
    },
    brandHeader: 'Il Lavoro Che Fa Per Te',
    brandSub: 'Divertente test della carriera basato sul tuo nome · 1.001 professioni',
    searchPlaceholder: 'Inserisci un nome (es: Leonardo, Sofia, Steve...)' ,
    searchBtn: 'Trova Il Mio Lavoro',
    sampleLabel: 'Nomi di tendenza:',
    ownerTitle: 'Il lavoro ideale per {name} è',
    certificateTitle: 'Il Lavoro Che Fa Per Te',
    zones: { GOOD: 'Lavoro da Sogno', BAD: 'Lavoro da Incubo' },
    reality: { REAL: 'Lavoro Reale', FICTION: 'Lavoro Fittizio & Sci-Fi' },
    specs: {
      builtYearLabel: 'Epoca / Periodo di attività',
      estimatedValueLabel: 'Stipendio stimato',
      specialFeatureLabel: 'Ruolo & Compito speciale',
      aiVerdictLabel: 'Verdetto del Direttore HR IA',
      eraLabel: 'Epoca / Periodo',
      salaryLabel: 'Stipendio stimato',
      dutyLabel: 'Ruolo & Compito speciale',
      tierLabel: 'Livello',
      levelLabel: 'Grado'
    },
    storyHeader: '"Il Lavoro Che Fa Per {name}"',
    storyPhotoHint: 'Scheda da condividere su Instagram Story / TikTok',
    storySpecTitle: 'Specifiche della carriera',
    saveStoryBtn: 'Salva Scheda Story',
    shareMobileBtn: 'Condividi su cellulare',
    copyUrlBtn: 'Copia Link del Risultato',
    copiedToast: 'Link copiato negli appunti!',
    openShareModalBtn: 'Crea Scheda Instagram Story',
    shareModal: {
      themeCert: 'Decreto Ufficiale di Nomina',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Tramonto Gradiente',
      instaDirectBtn: 'Condividi direttamente su Instagram Story',
      tiktokDirectBtn: 'Condividi su TikTok (Scheda 9:16 e link)',
      whatsappDirectBtn: 'Condividi via WhatsApp',
      savedToast: '📥 Immagine 9:16 di Instagram Story salvata!',
      instaDownloadedToast: '📸 Story scaricata e link copiato!',
      tiktokDownloadedToast: '🎵 Immagine 9:16 scaricata e link copiato!',
      whatsappOpenedToast: '🟢 Messaggio WhatsApp aperto!',
      messengerCopiedToast: '💬 Link copiato! Incollalo nella tua app di messaggistica.'
    }
  },

  ja: {
    familyNav: {
      job: '私の職業',
      myhome: '私の家',
      food: '私の料理',
      photodiary: 'フォトダイアリー'
    },
    brandHeader: 'あなたに似合う職業',
    brandSub: '名前を入力するだけ！おもしろ適職診断 · 1,001の職業マッチング',
    searchPlaceholder: '名前を入力してください（例: 翔太, 結衣, Steve...）',
    searchBtn: '私の職業を見つける',
    sampleLabel: '注目の名前:',
    ownerTitle: '{name}さんにぴったりの職業は',
    certificateTitle: 'あなたに似合う職業',
    zones: { GOOD: '大金持ち職業', BAD: '爆死ブラック職業' },
    reality: { REAL: '実在する職業・仕事', FICTION: '架空・空想・SF職業' },
    specs: {
      builtYearLabel: '活動時代・年代',
      estimatedValueLabel: '推定年収',
      specialFeatureLabel: '特別な役割・仕事内容',
      aiVerdictLabel: 'AI人事部長の総評',
      eraLabel: '活動時代・年代',
      salaryLabel: '推定年収',
      dutyLabel: '特別な役割・仕事内容',
      tierLabel: 'ティア',
      levelLabel: 'レベル'
    },
    storyHeader: '"{name}さんに似合う職業は"',
    storyPhotoHint: 'Instagramストーリー / TikTokシェア用カード',
    storySpecTitle: '職業明細書',
    saveStoryBtn: 'ストーリー画像を保存',
    shareMobileBtn: 'スマホでシェア',
    copyUrlBtn: '結果リンクをコピー',
    copiedToast: 'リンクがクリップボードにコピーされました！',
    openShareModalBtn: 'インスタストーリー画像を作る',
    shareModal: {
      themeCert: '公式辞令書',
      themeCyber: 'サイバーネオン',
      themeSunset: '夕暮れグラデーション',
      instaDirectBtn: 'Instagramストーリーに直接シェア',
      tiktokDirectBtn: 'TikTokでシェア（9:16カード＆リンク）',
      whatsappDirectBtn: 'WhatsAppでシェア',
      savedToast: '📥 9:16 Instagramストーリー画像を保存しました！',
      instaDownloadedToast: '📸 ストーリー画像が保存され、リンクがコピーされました！',
      tiktokDownloadedToast: '🎵 9:16画像が保存され、リンクがコピーされました！',
      whatsappOpenedToast: '🟢 WhatsAppを開きました！',
      messengerCopiedToast: '💬 リンクがコピーされました！チャットに貼り付けてシェアしてください。'
    }
  },

  zh: {
    familyNav: {
      job: '我的职业',
      myhome: '我的理想家',
      food: '我的美食',
      photodiary: '照片日记'
    },
    brandHeader: '最适合你的奇葩职业',
    brandSub: '输入名字测你适合什么职业 · 1,001个脑洞大开的神奇职业',
    searchPlaceholder: '请输入姓名（例: 伟, 芳, Steve...）',
    searchBtn: '寻找我的职业',
    sampleLabel: '热门推荐姓名:',
    ownerTitle: '适合{name}的职业是',
    certificateTitle: '最适合你的奇葩职业',
    zones: { GOOD: '神仙梦幻职业', BAD: '血亏地狱职业' },
    reality: { REAL: '现实存在的职业', FICTION: '虚构·科幻·奇幻职业' },
    specs: {
      builtYearLabel: '活跃时代 / 年代',
      estimatedValueLabel: '预估年薪',
      specialFeatureLabel: '专属职责与特殊任务',
      aiVerdictLabel: 'AI人事总监终审评价',
      eraLabel: '活跃时代 / 年代',
      salaryLabel: '预估年薪',
      dutyLabel: '专属职责与特殊任务',
      tierLabel: '梯队',
      levelLabel: '等级'
    },
    storyHeader: '"适合{name}的职业是"',
    storyPhotoHint: 'Instagram Story / 抖音分享卡片',
    storySpecTitle: '职业履历明细',
    saveStoryBtn: '保存快拍分享图',
    shareMobileBtn: '手机快捷分享',
    copyUrlBtn: '复制结果链接',
    copiedToast: '链接已成功复制到剪贴板！',
    openShareModalBtn: '生成快拍分享卡片',
    shareModal: {
      themeCert: '官方任命状',
      themeCyber: '赛博霓虹',
      themeSunset: '日落渐变',
      instaDirectBtn: '直接分享到Instagram Story',
      tiktokDirectBtn: '分享到TikTok/抖音 (9:16卡片及链接)',
      whatsappDirectBtn: '通过WhatsApp分享',
      savedToast: '📥 9:16快拍图片已成功保存！',
      instaDownloadedToast: '📸 快拍图已保存，链接已复制！',
      tiktokDownloadedToast: '🎵 9:16卡片已保存，链接已复制！',
      whatsappOpenedToast: '🟢 已开启WhatsApp分享！',
      messengerCopiedToast: '💬 链接已复制！快去聊天中粘贴分享吧。'
    }
  },

  ms: {
    familyNav: {
      job: 'Pekerjaan Saya',
      myhome: 'Rumah Saya',
      food: 'Makanan Saya',
      photodiary: 'Diari Foto'
    },
    brandHeader: 'Pekerjaan Yang Sesuai Untuk Anda',
    brandSub: 'Ujian padanan kerjaya nama yang menyeronokkan · 1,001 pekerjaan unik',
    searchPlaceholder: 'Masukkan nama (cth: Aisyah, Ahmad, Steve...)',
    searchBtn: 'Cari Pekerjaan Saya',
    sampleLabel: 'Nama popular:',
    ownerTitle: 'Pekerjaan yang sesuai untuk {name} ialah',
    certificateTitle: 'Pekerjaan Yang Sesuai Untuk Anda',
    zones: { GOOD: 'Pekerjaan Impian', BAD: 'Pekerjaan Mimpi Ngeri' },
    reality: { REAL: 'Pekerjaan Nyata', FICTION: 'Pekerjaan Fiksyen & Sains Fiksyen' },
    specs: {
      builtYearLabel: 'Era / Tempoh aktif',
      estimatedValueLabel: 'Anggaran gaji',
      specialFeatureLabel: 'Peranan & Tugas khas',
      aiVerdictLabel: 'Keputusan Pengarah HR AI',
      eraLabel: 'Era / Tempoh aktif',
      salaryLabel: 'Anggaran gaji',
      dutyLabel: 'Peranan & Tugas khas',
      tierLabel: 'Tahap',
      levelLabel: 'Gred'
    },
    storyHeader: '"Pekerjaan Yang Sesuai Untuk {name}"',
    storyPhotoHint: 'Kad perkongsian Instagram Story / TikTok',
    storySpecTitle: 'Spesifikasi Kerjaya',
    saveStoryBtn: 'Simpan Kad Story',
    shareMobileBtn: 'Kongsi di Telefon',
    copyUrlBtn: 'Salin Pautan Keputusan',
    copiedToast: 'Pautan disalin ke papan keratan!',
    openShareModalBtn: 'Cipta Kad Instagram Story',
    shareModal: {
      themeCert: 'Surat Pelantikan Rasmi',
      themeCyber: 'Cyber Neon',
      themeSunset: 'Kecerunan Senja',
      instaDirectBtn: 'Kongsi terus ke Instagram Story',
      tiktokDirectBtn: 'Kongsi ke TikTok (Kad 9:16 & pautan)',
      whatsappDirectBtn: 'Kongsi melalui WhatsApp',
      savedToast: '📥 Imej 9:16 Instagram Story disimpan!',
      instaDownloadedToast: '📸 Story dimuat turun dan pautan disalin!',
      tiktokDownloadedToast: '🎵 Imej 9:16 dimuat turun dan pautan disalin!',
      whatsappOpenedToast: '🟢 Mesej WhatsApp dibuka!',
      messengerCopiedToast: '💬 Pautan disalin! Tampal dalam sembang anda.'
    }
  }
};

for (const [code, custom] of Object.entries(MULTILANG_DEFINITIONS)) {
  UI_DICTIONARY[code] = {
    ...UI_DICTIONARY.en,
    ...custom,
    familyNav: { ...UI_DICTIONARY.en.familyNav, ...custom.familyNav },
    zones: { ...UI_DICTIONARY.en.zones, ...custom.zones },
    reality: { ...UI_DICTIONARY.en.reality, ...custom.reality },
    specs: { ...UI_DICTIONARY.en.specs, ...custom.specs },
    shareModal: { ...UI_DICTIONARY.en.shareModal, ...custom.shareModal }
  };
}

export const WORLDCUP_I18N = {
  ko: {
    tabSearch: '내 직업 찾기',
    tabWorst: '최악 중 최선 월드컵',
    tabBest: '최선 중 최악 월드컵',
    roundSuffix: '강',
    finalLabel: '결승전',
    semiFinalLabel: '준결승 (4강)',
    totalMatchesPrefix: '총 ',
    totalMatchesSuffix: '경기',
    recommended: ' · 추천',
    selectRoundLabel: '토너먼트 강수 선택',
    startBtnSuffix: '강 랜덤 대진표 시작하기',
    lobbyHint1: '매 판마다 {min}~{max}단계 중 중복 없이 무작위로 뽑힙니다.',
    lobbyHint2: '모바일에서는 위·아래로 스크롤하며 두 직업을 비교한 뒤 선택할 수 있습니다.',
    matchCounter: '{cur} / {total} 경기',
    resetBtn: '🔄 처음으로',
    pickBtn: '👆 이 직업 선택하기',
    realBadge: '🏛️ 실제 직업',
    fictionBadge: '🦄 허구·상상',
    realFullBadge: '🏛️ 실제 존재하는 직업·일거리',
    fictionFullBadge: '🦄 허구·상상·SF·판타지 직업',
    builtYearLabel: '⏰ 언제 하던 직업인지',
    valueLabel: '💰 추산되는 연봉',
    featureLabel: '🛠️ 역할·할일',
    featureFullLabel: '🛠️ 직업의 특별한 역할·할일',
    verdictLabel: '🤖 AI 인사팀장 총평',
    championBadgeSuffix: '강 우승',
    replayBtn: '🔄 같은 모드로 다시 하기',
    replaySameBtn: '🔁 같은 조건(동일 대진표)으로 다시 하기',
    replayNewRandomBtn: '🎲 새로운 랜덤 대진표로 하기',
    restartSameBtn: '🔁 이 대진표 처음부터',
    copyBtn: '📋 우승 결과 복사하기',
    viewDetailBtn: '💼 이 직업 상세 감정서 보기',
    copiedToast: '📋 우승 결과가 클립보드에 복사되었습니다!',
    copyFailToast: '결과 복사에 실패했습니다.',
    shareBracketBtn: '🔗 같은 조건으로 다시 할 수 있는 URL 공유',
    shareBracketToast: '🔗 같은 조건(강수·대진표)으로 다시 할 수 있는 URL이 복사되었습니다!',
    sameConditionBoxTitle: '🔗 같은 조건으로 다시 하기 / 친구에게 같은 대진표 공유',
    sameConditionBoxDesc: '아래 URL로 접속하면 동일한 모드({mode}) · {round}강 · 동일한 후보 대진표(시드 #{seed}) 조건으로 똑같이 다시 플레이할 수 있습니다.',
    copyUrlShortBtn: 'URL 복사',
    worstToBest: {
      badge: 'Lv.0 ~ 499 폭망 직업',
      title: '💀 최악의 직업 중 최선의 직업 월드컵',
      subtitle: '연봉 바닥·극한 노동 폭망 직업 500종 중, 그나마 출근할 만한 최선의 직업을 골라보세요!',
      questionPrompt: '이 최악의 직업들 중 그나마 할 만한 최선의 직업은?',
      championTitle: '🏆 최악의 직업들 중 살아남은 최선의 직업!',
      oppositeLabel: '🌟 최선 중 최악 월드컵 도전'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 대박 직업',
      title: '🌟 최선의 직업 중 최악의 직업 월드컵',
      subtitle: '초고액 연봉·미래 대박 직업 501종 중, 의외로 가장 하기 싫거나 아찔한 최악의 직업을 뽑아보세요!',
      questionPrompt: '이 대박 직업들 중 의외로 제일 하기 싫은 최악의 직업은?',
      championTitle: '💀 대박 직업 중 뽑힌 최악의 직업!',
      oppositeLabel: '💀 최악 중 최선 월드컵 도전'
    }
  },

  en: {
    tabSearch: 'Find My Job',
    tabWorst: 'Best of the Worst',
    tabBest: 'Worst of the Best',
    roundSuffix: ' Teams',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' matches',
    recommended: ' · Best',
    selectRoundLabel: 'Select Tournament Size',
    startBtnSuffix: '-Job Random Bracket',
    lobbyHint1: 'Randomly draws unique occupations from Lv.{min}~{max} every game.',
    lobbyHint2: 'On mobile, scroll up and down to compare both jobs before picking.',
    matchCounter: 'Match {cur} / {total}',
    resetBtn: '🔄 Restart',
    pickBtn: '👆 Choose This Job',
    realBadge: '🏛️ Real Job',
    fictionBadge: '🦄 Fiction',
    realFullBadge: '🏛️ Real-World Occupation',
    fictionFullBadge: '🦄 Fictional & Sci-Fi Job',
    builtYearLabel: '⏰ Era / Active',
    valueLabel: '💰 Est. Salary',
    featureLabel: '🛠️ Special Duty',
    featureFullLabel: '🛠️ Special Role & Duty',
    verdictLabel: '🤖 AI Verdict',
    championBadgeSuffix: ' Champion',
    replayBtn: '🔄 Play Again',
    replaySameBtn: '🔁 Replay Exact Same Bracket',
    replayNewRandomBtn: '🎲 Play New Random Bracket',
    restartSameBtn: '🔁 Restart Same Bracket',
    copyBtn: '📋 Copy Result',
    viewDetailBtn: '💼 View Full Appraisal',
    copiedToast: '📋 Champion result copied to clipboard!',
    copyFailToast: 'Failed to copy result.',
    shareBracketBtn: '🔗 Share URL for Same Conditions',
    shareBracketToast: '🔗 Same-condition replay URL copied to clipboard!',
    sameConditionBoxTitle: '🔗 Replay Same Conditions / Share Exact Bracket URL',
    sameConditionBoxDesc: 'Anyone visiting this URL will play the exact same mode ({mode}), {round}-round size, and identical candidate bracket (Seed #{seed}).',
    copyUrlShortBtn: 'Copy URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Nightmare Jobs',
      title: '💀 Best of the Worst Job World Cup',
      subtitle: 'Out of 500 grueling nightmare jobs, which one is the most bearable to work at?',
      questionPrompt: 'Which worst job would you rather clock in for?',
      championTitle: '🏆 The Best Survivor Among the Worst Jobs!',
      oppositeLabel: '🌟 Try Worst of the Best'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 Dream Jobs',
      title: '🌟 Worst of the Best Job World Cup',
      subtitle: 'Out of 501 ultra-wealthy dream careers, which one is surprisingly the worst or most stressful?',
      questionPrompt: 'Which luxury dream job is actually the worst to perform?',
      championTitle: '💀 The Worst Pick Among Dream Jobs!',
      oppositeLabel: '💀 Try Best of the Worst'
    }
  }
};

const MULTILANG_WORLDCUP_DEFINITIONS = {
  hi: {
    tabSearch: 'मेरी नौकरी खोजें',
    tabWorst: 'बदतरीन में सर्वश्रेष्ठ',
    tabBest: 'सर्वश्रेष्ठ में बदतरीन',
    roundSuffix: ' टीमें',
    finalLabel: 'फाइनल',
    semiFinalLabel: 'सेमीफाइनल (शीर्ष 4)',
    totalMatchesPrefix: 'कुल ',
    totalMatchesSuffix: ' मैच',
    recommended: ' · अनुशंसित',
    selectRoundLabel: 'टूर्नामेंट का आकार चुनें',
    startBtnSuffix: '-नौकरी ब्रैकेट शुरू करें',
    lobbyHint1: 'हर खेल में Lv.{min}~{max} से यादृच्छिक नौकरियां चुनी जाती हैं।',
    lobbyHint2: 'मोबाइल पर दोनों नौकरियों की तुलना करने के लिए ऊपर-नीचे स्क्रॉल करें।',
    matchCounter: 'मैच {cur} / {total}',
    resetBtn: '🔄 पुनः प्रारंभ करें',
    pickBtn: '👆 इस नौकरी को चुनें',
    realBadge: '🏛️ वास्तविक नौकरी',
    fictionBadge: '🦄 काल्पनिक',
    realFullBadge: '🏛️ वास्तविक दुनिया की नौकरी',
    fictionFullBadge: '🦄 काल्पनिक व विज्ञान-कथा नौकरी',
    builtYearLabel: '⏰ सक्रिय काल',
    valueLabel: '💰 अनु. वेतन',
    featureLabel: '🛠️ विशेष कर्तव्य',
    featureFullLabel: '🛠️ विशेष भूमिका व कर्तव्य',
    verdictLabel: '🤖 AI फैसला',
    championBadgeSuffix: ' विजेता',
    replayBtn: '🔄 फिर से खेलें',
    replaySameBtn: '🔁 समान ब्रैकेट दोबारा खेलें',
    replayNewRandomBtn: '🎲 नया यादृच्छिक ब्रैकेट खेलें',
    restartSameBtn: '🔁 यह ब्रैकेट शुरू से खेलें',
    copyBtn: '📋 परिणाम कॉपी करें',
    viewDetailBtn: '💼 पूर्ण मूल्यांकन देखें',
    copiedToast: '📋 विजेता परिणाम क्लिपबोर्ड पर कॉपी हो गया!',
    copyFailToast: 'परिणाम कॉपी करने में विफल।',
    shareBracketBtn: '🔗 समान शर्तों के लिए URL साझा करें',
    shareBracketToast: '🔗 समान शर्तों का लिंक क्लिपबोर्ड पर कॉपी हो गया!',
    sameConditionBoxTitle: '🔗 समान शर्तें दोबारा खेलें / ब्रैकेट साझा करें',
    sameConditionBoxDesc: 'इस लिंक पर जाने वाला कोई भी व्यक्ति समान मोड ({mode}), {round}-दौर आकार और समान ब्रैकेट (सीड #{seed}) खेलेगा।',
    copyUrlShortBtn: 'URL कॉपी करें',
    worstToBest: {
      badge: 'Lv.0 ~ 499 बदहाल नौकरियां',
      title: '💀 बदतरीन में सर्वश्रेष्ठ नौकरी विश्व कप',
      subtitle: '500 सबसे कठिन नौकरियों में से, कौन सी नौकरी करना सबसे आसान है?',
      questionPrompt: 'इन खराब नौकरियों में से आप कौन सी नौकरी चुनेंगे?',
      championTitle: '🏆 बदतरीन नौकरियों में से चुनी गई सर्वश्रेष्ठ नौकरी!',
      oppositeLabel: '🌟 सर्वश्रेष्ठ में बदतरीन खेलें'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 सपनों की नौकरियां',
      title: '🌟 सर्वश्रेष्ठ में बदतरीन नौकरी विश्व कप',
      subtitle: '501 शानदार नौकरियों में से कौन सी नौकरी सबसे तनावपूर्ण या अवांछित है?',
      questionPrompt: 'इन सपनों की नौकरियों में से वास्तव में सबसे खराब कौन सी है?',
      championTitle: '💀 सपनों की नौकरियों में से चुनी गई सबसे खराब नौकरी!',
      oppositeLabel: '💀 बदतरीन में सर्वश्रेष्ठ खेलें'
    }
  },

  vi: {
    tabSearch: 'Tìm nghề của tôi',
    tabWorst: 'Tốt nhất trong tệ nhất',
    tabBest: 'Tệ nhất trong tốt nhất',
    roundSuffix: ' đội',
    finalLabel: 'Chung kết',
    semiFinalLabel: 'Bán kết (Top 4)',
    totalMatchesPrefix: 'Tổng ',
    totalMatchesSuffix: ' trận',
    recommended: ' · Khuyên dùng',
    selectRoundLabel: 'Chọn quy mô giải đấu',
    startBtnSuffix: ' nghề - Bắt đầu nhánh đấu ngẫu nhiên',
    lobbyHint1: 'Mỗi lượt chơi sẽ chọn ngẫu nhiên các nghề từ Cấp {min}~{max} không trùng lặp.',
    lobbyHint2: 'Trên điện thoại, cuộn lên xuống để so sánh cả hai nghề trước khi chọn.',
    matchCounter: 'Trận {cur} / {total}',
    resetBtn: '🔄 Bắt đầu lại',
    pickBtn: '👆 Chọn nghề này',
    realBadge: '🏛️ Nghề có thật',
    fictionBadge: '🦄 Hư cấu',
    realFullBadge: '🏛️ Nghề nghiệp có thật ngoài đời',
    fictionFullBadge: '🦄 Nghề hư cấu & viễn tưởng',
    builtYearLabel: '⏰ Niên đại',
    valueLabel: '💰 Lương ước tính',
    featureLabel: '🛠️ Nhiệm vụ đặc biệt',
    featureFullLabel: '🛠️ Vai trò & Nhiệm vụ đặc biệt',
    verdictLabel: '🤖 Đánh giá AI',
    championBadgeSuffix: ' Quán quân',
    replayBtn: '🔄 Chơi lại chế độ này',
    replaySameBtn: '🔁 Chơi lại đúng nhánh đấu này',
    replayNewRandomBtn: '🎲 Chơi nhánh đấu ngẫu nhiên mới',
    restartSameBtn: '🔁 Chơi lại nhánh này từ đầu',
    copyBtn: '📋 Sao chép kết quả',
    viewDetailBtn: '💼 Xem hồ sơ đánh giá chi tiết',
    copiedToast: '📋 Đã sao chép kết quả quán quân vào bộ nhớ tạm!',
    copyFailToast: 'Không thể sao chép kết quả.',
    shareBracketBtn: '🔗 Chia sẻ liên kết nhánh đấu cùng điều kiện',
    shareBracketToast: '🔗 Đã sao chép liên kết nhánh đấu cùng điều kiện!',
    sameConditionBoxTitle: '🔗 Chơi lại cùng điều kiện / Chia sẻ nhánh đấu',
    sameConditionBoxDesc: 'Bất kỳ ai truy cập liên kết này sẽ chơi cùng chế độ ({mode}), quy mô {round} đội và đúng nhánh ứng viên (Seed #{seed}).',
    copyUrlShortBtn: 'Sao chép URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Nghề Thảm Họa',
      title: '💀 World Cup Chọn Nghề Đỡ Tệ Nhất Trong Các Nghề Khủng Khiếp',
      subtitle: 'Trong 500 nghề thảm họa lương đáy, nghề nào bạn thấy còn chấp nhận được nhất để đi làm?',
      questionPrompt: 'Trong hai nghề tệ hại này, bạn thà đi làm nghề nào hơn?',
      championTitle: '🏆 Nghề đỡ tệ nhất sống sót qua các nghề thảm họa!',
      oppositeLabel: '🌟 Thử World Cup Tệ Nhất Trong Nghề Tốt'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 Nghề Hoàng Kim',
      title: '🌟 World Cup Chọn Nghề Tệ Nhất Trong Các Nghề Hoàng Kim',
      subtitle: 'Trong 501 nghề hoàng kim siêu lương, nghề nào bất ngờ lại gây ngột ngạt hoặc áp lực nhất?',
      questionPrompt: 'Trong hai nghề trong mơ này, nghề nào thực chất tệ hơn?',
      championTitle: '💀 Nghề tệ nhất bị loại trong các nghề hoàng kim!',
      oppositeLabel: '💀 Thử World Cup Đỡ Tệ Nhất'
    }
  },

  fr: {
    tabSearch: 'Trouver mon métier',
    tabWorst: 'Le meilleur du pire',
    tabBest: 'Le pire du meilleur',
    roundSuffix: ' Équipes',
    finalLabel: 'Finale',
    semiFinalLabel: 'Demi-finale (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' matchs',
    recommended: ' · Recommandé',
    selectRoundLabel: 'Sélectionner la taille du tournoi',
    startBtnSuffix: ' métiers - Lancer le tournoi aléatoire',
    lobbyHint1: 'Tirage aléatoire sans doublon parmi les niveaux {min} à {max}.',
    lobbyHint2: 'Sur mobile, faites défiler pour comparer les deux métiers avant de choisir.',
    matchCounter: 'Match {cur} / {total}',
    resetBtn: '🔄 Recommencer',
    pickBtn: '👆 Choisir ce métier',
    realBadge: '🏛️ Métier réel',
    fictionBadge: '🦄 Fiction',
    realFullBadge: '🏛️ Métier du monde réel',
    fictionFullBadge: '🦄 Métier fictif & science-fiction',
    builtYearLabel: '⏰ Époque',
    valueLabel: '💰 Salaire est.',
    featureLabel: '🛠️ Mission spéciale',
    featureFullLabel: '🛠️ Rôle & Mission spéciale',
    verdictLabel: '🤖 Verdict IA',
    championBadgeSuffix: ' Champion',
    replayBtn: '🔄 Rejouer ce mode',
    replaySameBtn: '🔁 Rejouer avec exactement le même tableau',
    replayNewRandomBtn: '🎲 Nouveau tableau aléatoire',
    restartSameBtn: '🔁 Recommencer ce tableau depuis le début',
    copyBtn: '📋 Copier le résultat',
    viewDetailBtn: '💼 Voir l’expertise complète',
    copiedToast: '📋 Résultat champion copié dans le presse-papiers !',
    copyFailToast: 'Échec de la copie du résultat.',
    shareBracketBtn: '🔗 Partager le lien du tableau identique',
    shareBracketToast: '🔗 Lien du tableau identique copié !',
    sameConditionBoxTitle: '🔗 Rejouer aux mêmes conditions / Partager ce tableau',
    sameConditionBoxDesc: 'Quiconque visite cette URL jouera au même mode ({mode}), avec {round} équipes et le même tableau de candidats (Seed #{seed}).',
    copyUrlShortBtn: 'Copier l’URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Métiers Cauchemar',
      title: '💀 World Cup du Meilleur Métier Parmi les Pires',
      subtitle: 'Parmi 500 métiers atroces sous-payés, lequel supporteriez-vous le mieux ?',
      questionPrompt: 'Pour lequel de ces deux pires métiers préféreriez-vous pointer ?',
      championTitle: '🏆 Le métier le plus tolérable parmi les pires !',
      oppositeLabel: '🌟 Essayer le Pire du Meilleur'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1 000 Métiers de Rêve',
      title: '🌟 World Cup du Pire Métier Parmi les Meilleurs',
      subtitle: 'Parmi 501 carrières dorées richissimes, laquelle est étrangement la plus stressante ou détestable ?',
      questionPrompt: 'Quel métier de rêve est en réalité le plus pénible ?',
      championTitle: '💀 Le pire métier désigné parmi les carrières de rêve !',
      oppositeLabel: '💀 Essayer le Meilleur du Pire'
    }
  },

  pt: {
    tabSearch: 'Encontrar Minha Profissão',
    tabWorst: 'Melhor do Pior',
    tabBest: 'Pior do Melhor',
    roundSuffix: ' Equipes',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' partidas',
    recommended: ' · Recomendado',
    selectRoundLabel: 'Selecione o tamanho do torneio',
    startBtnSuffix: ' empregos - Iniciar chave aleatória',
    lobbyHint1: 'Sorteia empregos únicos entre os níveis {min} e {max} a cada partida.',
    lobbyHint2: 'No celular, deslize para cima e para baixo para comparar as duas profissões.',
    matchCounter: 'Partida {cur} / {total}',
    resetBtn: '🔄 Reiniciar',
    pickBtn: '👆 Escolher esta profissão',
    realBadge: '🏛️ Profissão real',
    fictionBadge: '🦄 Ficção',
    realFullBadge: '🏛️ Profissão do mundo real',
    fictionFullBadge: '🦄 Profissão fictícia e de ficção científica',
    builtYearLabel: '⏰ Época',
    valueLabel: '💰 Salário est.',
    featureLabel: '🛠️ Função especial',
    featureFullLabel: '🛠️ Função & Dever especial',
    verdictLabel: '🤖 Veredito IA',
    championBadgeSuffix: ' Campeão',
    replayBtn: '🔄 Jogar novamente',
    replaySameBtn: '🔁 Jogar novamente com a mesma chave',
    replayNewRandomBtn: '🎲 Nova chave aleatória',
    restartSameBtn: '🔁 Reiniciar esta chave do início',
    copyBtn: '📋 Copiar resultado',
    viewDetailBtn: '💼 Ver avaliação completa',
    copiedToast: '📋 Resultado do campeão copiado!',
    copyFailToast: 'Falha ao copiar o resultado.',
    shareBracketBtn: '🔗 Compartilhar URL da mesma chave',
    shareBracketToast: '🔗 Link da mesma chave copiado para a área de transferência!',
    sameConditionBoxTitle: '🔗 Jogar com as mesmas condições / Compartilhar chave',
    sameConditionBoxDesc: 'Quem acessar esta URL jogará no mesmo modo ({mode}), com {round} equipes e a mesma chave de candidatos (Seed #{seed}).',
    copyUrlShortBtn: 'Copiar URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Profissões Pesadelo',
      title: '💀 Copa do Mundo do Melhor Entre os Piores Empregos',
      subtitle: 'Entre 500 empregos desastrosos de salário mínimo, qual seria o mais suportável?',
      questionPrompt: 'Em qual desses dois piores empregos você preferiria bater ponto?',
      championTitle: '🏆 O melhor sobrevivente entre as piores profissões!',
      oppositeLabel: '🌟 Jogar Pior do Melhor'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1.000 Profissões dos Sonhos',
      title: '🌟 Copa do Mundo do Pior Entre os Melhores Empregos',
      subtitle: 'Entre 501 carreiras luxuosas milionárias, qual é surpreendentemente a mais estressante ou indesejável?',
      questionPrompt: 'Qual profissão dos sonhos é na verdade a mais desgastante?',
      championTitle: '💀 A pior profissão escolhida entre as carreiras dos sonhos!',
      oppositeLabel: '💀 Jogar Melhor do Pior'
    }
  },

  es: {
    tabSearch: 'Buscar Mi Trabajo',
    tabWorst: 'Lo mejor de lo peor',
    tabBest: 'Lo peor de lo mejor',
    roundSuffix: ' Equipos',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' partidos',
    recommended: ' · Recomendado',
    selectRoundLabel: 'Selecciona el tamaño del torneo',
    startBtnSuffix: ' empleos - Iniciar llave aleatoria',
    lobbyHint1: 'Selecciona al azar empleos de Lv.{min}~{max} sin repetición en cada partida.',
    lobbyHint2: 'En móvil, desplázate verticalmente para comparar ambos trabajos antes de elegir.',
    matchCounter: 'Partido {cur} / {total}',
    resetBtn: '🔄 Reiniciar',
    pickBtn: '👆 Elegir este trabajo',
    realBadge: '🏛️ Trabajo real',
    fictionBadge: '🦄 Ficción',
    realFullBadge: '🏛️ Trabajo del mundo real',
    fictionFullBadge: '🦄 Trabajo ficticio y de ciencia ficción',
    builtYearLabel: '⏰ Época',
    valueLabel: '💰 Salario est.',
    featureLabel: '🛠️ Tarea especial',
    featureFullLabel: '🛠️ Función & Tarea especial',
    verdictLabel: '🤖 Veredicto IA',
    championBadgeSuffix: ' Campeón',
    replayBtn: '🔄 Jugar de nuevo',
    replaySameBtn: '🔁 Jugar de nuevo con la misma llave',
    replayNewRandomBtn: '🎲 Nueva llave aleatoria',
    restartSameBtn: '🔁 Reiniciar esta llave desde el principio',
    copyBtn: '📋 Copiar resultado',
    viewDetailBtn: '💼 Ver evaluación completa',
    copiedToast: '📋 ¡Resultado del campeón copiado al portapapeles!',
    copyFailToast: 'No se pudo copiar el resultado.',
    shareBracketBtn: '🔗 Compartir URL de la misma llave',
    shareBracketToast: '🔗 ¡Enlace de la misma llave copiado al portapapeles!',
    sameConditionBoxTitle: '🔗 Jugar con las mismas condiciones / Compartir llave',
    sameConditionBoxDesc: 'Cualquiera que visite este enlace jugará en el mismo modo ({mode}), con {round} equipos y la misma llave de candidatos (Seed #{seed}).',
    copyUrlShortBtn: 'Copiar URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Trabajos Pesadilla',
      title: '💀 Mundial del Mejor Trabajo Entre los Peores',
      subtitle: 'Entre 500 trabajos desastrosos y precarios, ¿en cuál soportarías más trabajar?',
      questionPrompt: '¿En cuál de estos dos pésimos trabajos preferirías fichar?',
      championTitle: '🏆 ¡El trabajo más tolerable entre los peores!',
      oppositeLabel: '🌟 Jugar Lo Peor de lo Mejor'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1.000 Trabajos Soñados',
      title: '🌟 Mundial del Peor Trabajo Entre los Mejores',
      subtitle: 'Entre 501 carreras doradas multimillonarias, ¿cuál es sorprendentemente la más insoportable o estresante?',
      questionPrompt: '¿Qué trabajo soñado resulta ser en realidad el peor?',
      championTitle: '💀 ¡El peor trabajo elegido entre las carreras soñadas!',
      oppositeLabel: '💀 Jugar Lo Mejor de lo Peor'
    }
  },

  id: {
    tabSearch: 'Cari Pekerjaan Saya',
    tabWorst: 'Terbaik dari yang Terburuk',
    tabBest: 'Terburuk dari yang Terbaik',
    roundSuffix: ' Tim',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (4 Besar)',
    totalMatchesPrefix: 'Total ',
    totalMatchesSuffix: ' pertandingan',
    recommended: ' · Disarankan',
    selectRoundLabel: 'Pilih jumlah tim turnamen',
    startBtnSuffix: ' pekerjaan - Mulai bagan acak',
    lobbyHint1: 'Mengundi pekerjaan unik dari Lv.{min}~{max} di setiap permainan.',
    lobbyHint2: 'Di ponsel, gulir ke atas dan bawah untuk membandingkan kedua pekerjaan sebelum memilih.',
    matchCounter: 'Pertandingan {cur} / {total}',
    resetBtn: '🔄 Ulangi',
    pickBtn: '👆 Pilih pekerjaan ini',
    realBadge: '🏛️ Pekerjaan nyata',
    fictionBadge: '🦄 Fiksi',
    realFullBadge: '🏛️ Pekerjaan di dunia nyata',
    fictionFullBadge: '🦄 Pekerjaan fiksi & fiksi ilmiah',
    builtYearLabel: '⏰ Era',
    valueLabel: '💰 Est. Gaji',
    featureLabel: '🛠️ Tugas khusus',
    featureFullLabel: '🛠️ Peran & Tugas khusus',
    verdictLabel: '🤖 Keputusan AI',
    championBadgeSuffix: ' Juara',
    replayBtn: '🔄 Main lagi',
    replaySameBtn: '🔁 Mainkan kembali bagan yang sama persis',
    replayNewRandomBtn: '🎲 Mainkan bagan acak baru',
    restartSameBtn: '🔁 Ulangi bagan ini dari awal',
    copyBtn: '📋 Salin hasil',
    viewDetailBtn: '💼 Lihat ulasan lengkap',
    copiedToast: '📋 Hasil juara disalin ke papan klip!',
    copyFailToast: 'Gagal menyalin hasil.',
    shareBracketBtn: '🔗 Bagikan URL bagan yang sama',
    shareBracketToast: '🔗 Tautan bagan kondisi sama disalin ke papan klip!',
    sameConditionBoxTitle: '🔗 Main kondisi sama / Bagikan bagan turnamen',
    sameConditionBoxDesc: 'Siapa pun yang membuka URL ini akan memainkan mode ({mode}), ukuran {round} tim, dan bagan kandidat yang sama (Seed #{seed}).',
    copyUrlShortBtn: 'Salin URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Pekerjaan Mimpi Buruk',
      title: '💀 Piala Dunia Pekerjaan Terbaik di Antara yang Terburuk',
      subtitle: 'Dari 500 pekerjaan menyedihkan berupah rendah, mana yang paling mending untuk dijalani?',
      questionPrompt: 'Dari dua pekerjaan terburuk ini, mana yang lebih rela Anda jalani?',
      championTitle: '🏆 Pekerjaan paling mending yang bertahan di antara yang terburuk!',
      oppositeLabel: '🌟 Coba Terburuk dari yang Terbaik'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1.000 Pekerjaan Impian',
      title: '🌟 Piala Dunia Pekerjaan Terburuk di Antara yang Terbaik',
      subtitle: 'Dari 501 karier mewah bergaji fantastis, mana yang ternyata paling menyiksa atau tidak disukai?',
      questionPrompt: 'Pekerjaan impian mana yang sebenarnya paling menyiksa?',
      championTitle: '💀 Pekerjaan terburuk yang terpilih di antara karier impian!',
      oppositeLabel: '💀 Coba Terbaik dari yang Terburuk'
    }
  },

  ru: {
    tabSearch: 'Найти мою профессию',
    tabWorst: 'Лучшее из худшего',
    tabBest: 'Худшее из лучшего',
    roundSuffix: ' участников',
    finalLabel: 'Финал',
    semiFinalLabel: 'Полуфинал (Топ-4)',
    totalMatchesPrefix: 'Всего ',
    totalMatchesSuffix: ' матчей',
    recommended: ' · Рекомендуем',
    selectRoundLabel: 'Выберите масштаб турнира',
    startBtnSuffix: ' профессий - Начать случайную сетку',
    lobbyHint1: 'Каждую игру выбираются случайные профессии с Lv.{min}~{max} без повторений.',
    lobbyHint2: 'На телефоне листайте вверх и вниз, чтобы сравнить профессии перед выбором.',
    matchCounter: 'Матч {cur} / {total}',
    resetBtn: '🔄 Заново',
    pickBtn: '👆 Выбрать эту профессию',
    realBadge: '🏛️ Реальная профессия',
    fictionBadge: '🦄 Вымысел',
    realFullBadge: '🏛️ Профессия из реального мира',
    fictionFullBadge: '🦄 Вымышленная и фантастическая профессия',
    builtYearLabel: '⏰ Эпоха',
    valueLabel: '💰 Оценка зарплаты',
    featureLabel: '🛠️ Особая обязанность',
    featureFullLabel: '🛠️ Особая роль и обязанности',
    verdictLabel: '🤖 Вердикт ИИ',
    championBadgeSuffix: ' Чемпион',
    replayBtn: '🔄 Сыграть снова',
    replaySameBtn: '🔁 Повторить с той же сеткой',
    replayNewRandomBtn: '🎲 Новая случайная сетка',
    restartSameBtn: '🔁 Начать эту сетку сначала',
    copyBtn: '📋 Скопировать результат',
    viewDetailBtn: '💼 Подробная экспертиза',
    copiedToast: '📋 Результат чемпиона скопирован!',
    copyFailToast: 'Не удалось скопировать результат.',
    shareBracketBtn: '🔗 Поделиться ссылкой на ту же сетку',
    shareBracketToast: '🔗 Ссылка на сетку скопирована в буфер обмена!',
    sameConditionBoxTitle: '🔗 Сыграть на тех же условиях / Поделиться сеткой',
    sameConditionBoxDesc: 'Любой, кто откроет эту ссылку, сыграет в том же режиме ({mode}), на {round} участников и с той же сеткой (Seed #{seed}).',
    copyUrlShortBtn: 'Копировать URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Работы-Кошмары',
      title: '💀 Чемпионат: Лучшая из Худших Профессий',
      subtitle: 'Из 500 ужасных низкооплачиваемых профессий — на какую вы согласились бы выйти хоть как-то?',
      questionPrompt: 'На какую из двух ужасных работ вы бы скорее вышли?',
      championTitle: '🏆 Лучшая профессия, выжившая среди худших!',
      oppositeLabel: '🌟 Сыграть в Худшее из Лучшего'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1 000 Работы Мечты',
      title: '🌟 Чемпионат: Худшая из Лучших Профессий',
      subtitle: 'Из 501 элитной сверхдоходной профессии — какая на самом деле самая невыносимая или нервная?',
      questionPrompt: 'Какая работа мечты на поверку оказалась самой ужасной?',
      championTitle: '💀 Худшая профессия среди работ мечты!',
      oppositeLabel: '💀 Сыграть в Лучшее из Худшего'
    }
  },

  de: {
    tabSearch: 'Meinen Beruf Finden',
    tabWorst: 'Das Beste vom Schlimmsten',
    tabBest: 'Das Schlimmste vom Besten',
    roundSuffix: ' Teams',
    finalLabel: 'Finale',
    semiFinalLabel: 'Halbfinale (Top 4)',
    totalMatchesPrefix: 'Gesamt ',
    totalMatchesSuffix: ' Spiele',
    recommended: ' · Empfohlen',
    selectRoundLabel: 'Turniergröße wählen',
    startBtnSuffix: ' Berufe - Zufälligen Turnierbaum starten',
    lobbyHint1: 'Zieht in jedem Spiel einzigartige Berufe von Lv.{min}~{max} ohne Wiederholung.',
    lobbyHint2: 'Auf dem Handy nach oben und unten scrollen, um beide Berufe zu vergleichen.',
    matchCounter: 'Spiel {cur} / {total}',
    resetBtn: '🔄 Neustart',
    pickBtn: '👆 Diesen Beruf wählen',
    realBadge: '🏛️ Realer Beruf',
    fictionBadge: '🦄 Fiktion',
    realFullBadge: '🏛️ Beruf aus der realen Welt',
    fictionFullBadge: '🦄 Fiktiver & Sci-Fi-Beruf',
    builtYearLabel: '⏰ Epoche',
    valueLabel: '💰 Geschätztes Gehalt',
    featureLabel: '🛠️ Besondere Aufgabe',
    featureFullLabel: '🛠️ Besondere Rolle & Aufgabe',
    verdictLabel: '🤖 KI-Urteil',
    championBadgeSuffix: ' Champion',
    replayBtn: '🔄 Erneut spielen',
    replaySameBtn: '🔁 Genau denselben Turnierbaum wiederholen',
    replayNewRandomBtn: '🎲 Neuen zufälligen Turnierbaum spielen',
    restartSameBtn: '🔁 Diesen Turnierbaum von vorne starten',
    copyBtn: '📋 Ergebnis kopieren',
    viewDetailBtn: '💼 Vollständiges Gutachten ansehen',
    copiedToast: '📋 Champion-Ergebnis in die Zwischenablage kopiert!',
    copyFailToast: 'Kopieren des Ergebnisses fehlgeschlagen.',
    shareBracketBtn: '🔗 Link für denselben Turnierbaum teilen',
    shareBracketToast: '🔗 Link für identische Bedingungen kopiert!',
    sameConditionBoxTitle: '🔗 Gleiche Bedingungen wiederholen / Turnierbaum teilen',
    sameConditionBoxDesc: 'Jeder mit dieser URL spielt denselben Modus ({mode}), dieselbe Größe ({round} Teams) und denselben Kandidatenbaum (Seed #{seed}).',
    copyUrlShortBtn: 'URL kopieren',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Albtraum-Berufe',
      title: '💀 World Cup des besten Berufs unter den schlimmsten',
      subtitle: 'Welcher von 500 miserablen Niedriglohn-Jobs wäre für dich am ehesten erträglich?',
      questionPrompt: 'Zu welchem dieser beiden Horror-Jobs würdest du eher antreten?',
      championTitle: '🏆 Der erträglichste Beruf unter den schlimmsten!',
      oppositeLabel: '🌟 Das Schlimmste vom Besten spielen'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1.000 Traumberufe',
      title: '🌟 World Cup des schlimmsten Berufs unter den besten',
      subtitle: 'Welcher von 501 milliardenschweren Luxusberufen ist überraschenderweise am stressigsten oder nervigsten?',
      questionPrompt: 'Welcher Traumberuf ist in Wahrheit der schlimmste?',
      championTitle: '💀 Der schlimmste Beruf unter den Traumberufen!',
      oppositeLabel: '💀 Das Beste vom Schlimmsten spielen'
    }
  },

  it: {
    tabSearch: 'Trova Il Mio Lavoro',
    tabWorst: 'Il migliore del peggio',
    tabBest: 'Il peggiore del meglio',
    roundSuffix: ' Squadre',
    finalLabel: 'Finale',
    semiFinalLabel: 'Semifinale (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' partite',
    recommended: ' · Consigliato',
    selectRoundLabel: 'Seleziona la dimensione del torneo',
    startBtnSuffix: ' professioni - Avvia tabellone casuale',
    lobbyHint1: 'Estrae professioni uniche da Lv.{min}~{max} in ogni partita senza ripetizioni.',
    lobbyHint2: 'Su cellulare, scorri in alto e in basso per confrontare i due lavori prima di scegliere.',
    matchCounter: 'Partita {cur} / {total}',
    resetBtn: '🔄 Ricomincia',
    pickBtn: '👆 Scegli questo lavoro',
    realBadge: '🏛️ Lavoro reale',
    fictionBadge: '🦄 Finzione',
    realFullBadge: '🏛️ Professione del mondo reale',
    fictionFullBadge: '🦄 Professione fittizia e sci-fi',
    builtYearLabel: '⏰ Epoca',
    valueLabel: '💰 Stipendio stimato',
    featureLabel: '🛠️ Compito speciale',
    featureFullLabel: '🛠️ Ruolo & Compito speciale',
    verdictLabel: '🤖 Verdetto IA',
    championBadgeSuffix: ' Campione',
    replayBtn: '🔄 Gioca di nuovo',
    replaySameBtn: '🔁 Rigioca con lo stesso identico tabellone',
    replayNewRandomBtn: '🎲 Gioca con un nuovo tabellone casuale',
    restartSameBtn: '🔁 Ricomincia questo tabellone dall’inizio',
    copyBtn: '📋 Copia risultato',
    viewDetailBtn: '💼 Visualizza perizia completa',
    copiedToast: '📋 Risultato del vincitore copiato negli appunti!',
    copyFailToast: 'Impossibile copiare il risultato.',
    shareBracketBtn: '🔗 Condividi URL dello stesso tabellone',
    shareBracketToast: '🔗 Link del tabellone identico copiato negli appunti!',
    sameConditionBoxTitle: '🔗 Rigioca alle stesse condizioni / Condividi tabellone',
    sameConditionBoxDesc: 'Chiunque visiti questo URL giocherà con la stessa modalità ({mode}), dimensione ({round} squadre) e tabellone candidati (Seed #{seed}).',
    copyUrlShortBtn: 'Copia URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Lavori da Incubo',
      title: '💀 World Cup del Miglior Lavoro Tra i Peggiori',
      subtitle: 'Tra 500 lavori disastrosi sottopagati, quale sarebbe il più sopportabile per andare a lavorare?',
      questionPrompt: 'In quale di questi due pessimi lavori preferiresti timbrare il cartellino?',
      championTitle: '🏆 Il lavoro più sopportabile sopravvissuto tra i peggiori!',
      oppositeLabel: '🌟 Gioca a Il Peggiore del Meglio'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1.000 Lavori da Sogno',
      title: '🌟 World Cup del Peggior Lavoro Tra i Migliori',
      subtitle: 'Tra 501 carriere dorate multimilionarie, quale si rivela sorprendentemente la più stressante o odiosa?',
      questionPrompt: 'Quale lavoro da sogno è in realtà il peggiore da svolgere?',
      championTitle: '💀 Il peggior lavoro votato tra le carriere da sogno!',
      oppositeLabel: '💀 Gioca a Il Migliore del Peggio'
    }
  },

  ja: {
    tabSearch: '私の職業を見つける',
    tabWorst: '最悪の中で最善',
    tabBest: '最高の中で最悪',
    roundSuffix: '強',
    finalLabel: '決勝戦',
    semiFinalLabel: '準決勝 (ベスト4)',
    totalMatchesPrefix: '全',
    totalMatchesSuffix: '試合',
    recommended: ' · おすすめ',
    selectRoundLabel: 'トーナメント規模を選択',
    startBtnSuffix: '強 ランダム対戦スタート',
    lobbyHint1: '毎回 Lv.{min}~{max} から重複なしでランダム選出されます。',
    lobbyHint2: 'スマホでは上下にスクロールして2つの職業を見比べて選べます。',
    matchCounter: '{cur} / {total} 試合',
    resetBtn: '🔄 最初から',
    pickBtn: '👆 この職業を選ぶ',
    realBadge: '🏛️ 実在する職業',
    fictionBadge: '🦄 架空・空想',
    realFullBadge: '🏛️ 実在する職業・仕事',
    fictionFullBadge: '🦄 架空・空想・SF職業',
    builtYearLabel: '⏰ 活動時代',
    valueLabel: '💰 推定年収',
    featureLabel: '🛠️ 特別な仕事',
    featureFullLabel: '🛠️ 特別な役割・仕事内容',
    verdictLabel: '🤖 AI総評',
    championBadgeSuffix: '強 優勝',
    replayBtn: '🔄 同じモードでもう一度',
    replaySameBtn: '🔁 同じ条件（同一対戦表）でもう一度',
    replayNewRandomBtn: '🎲 新しいランダム対戦表で遊ぶ',
    restartSameBtn: '🔁 この対戦表を最初から',
    copyBtn: '📋 結果をコピー',
    viewDetailBtn: '💼 この職業の詳細を見る',
    copiedToast: '📋 優勝結果をクリップボードにコピーしました！',
    copyFailToast: 'コピーに失敗しました。',
    shareBracketBtn: '🔗 同じ条件で遊べるURLを共有',
    shareBracketToast: '🔗 同じ条件（規模・対戦表）で遊べるURLがコピーされました！',
    sameConditionBoxTitle: '🔗 同じ条件でもう一度 / 友達に対戦表を共有',
    sameConditionBoxDesc: 'このURLにアクセスすると、同じモード（{mode}）· {round}強 · 同一候補対戦表（シード #{seed}）でそのままプレイできます。',
    copyUrlShortBtn: 'URLコピー',
    worstToBest: {
      badge: 'Lv.0 ~ 499 爆死ブラック職業',
      title: '💀 最悪の職業の中で一番マシな職業ワールドカップ',
      subtitle: '過酷労働＆低賃金の最悪職業500種の中から、まだ出勤できそうな一番マシな職業を選ぼう！',
      questionPrompt: 'この最悪な2つの仕事のうち、まだ働けるマシな方はどっち？',
      championTitle: '🏆 最悪な職業の中で生き残った一番マシな職業！',
      oppositeLabel: '🌟 最高の中で最悪ワールドカップに挑戦'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 大金持ち職業',
      title: '🌟 最高の職業の中で一番やりたくない最悪職業ワールドカップ',
      subtitle: '超高収入・未来の大当たり職業501種の中から、意外と一番やりたくない最悪の職業を選ぼう！',
      questionPrompt: 'この憧れの職業のうち、実は一番やりたくない職業は？',
      championTitle: '💀 大当たり職業の中で選ばれた最悪の職業！',
      oppositeLabel: '💀 最悪の中で最善ワールドカップに挑戦'
    }
  },

  zh: {
    tabSearch: '寻找我的职业',
    tabWorst: '最烂之中选最好',
    tabBest: '最好之中选最烂',
    roundSuffix: '强',
    finalLabel: '总决赛',
    semiFinalLabel: '半决赛 (四强)',
    totalMatchesPrefix: '共 ',
    totalMatchesSuffix: ' 场对决',
    recommended: ' · 推荐',
    selectRoundLabel: '选择淘汰赛规模',
    startBtnSuffix: '强 随机对决开始',
    lobbyHint1: '每局对决在 Lv.{min}~{max} 随机抽取且不重复。',
    lobbyHint2: '手机端可上下滑动对比两项职业后再作抉择。',
    matchCounter: '第 {cur} / {total} 场',
    resetBtn: '🔄 重新开始',
    pickBtn: '👆 选择此职业',
    realBadge: '🏛️ 现实职业',
    fictionBadge: '🦄 虚构职业',
    realFullBadge: '🏛️ 现实存在的真实职业',
    fictionFullBadge: '🦄 虚构·想象·科幻职业',
    builtYearLabel: '⏰ 活跃时代',
    valueLabel: '💰 预估年薪',
    featureLabel: '🛠️ 专属职责',
    featureFullLabel: '🛠️ 专属职责与特殊任务',
    verdictLabel: '🤖 AI评价',
    championBadgeSuffix: '强 最终优胜',
    replayBtn: '🔄 重新再玩一次',
    replaySameBtn: '🔁 相同条件（完全相同对阵表）重玩',
    replayNewRandomBtn: '🎲 开启全新随机对阵表',
    restartSameBtn: '🔁 从头重玩此对阵表',
    copyBtn: '📋 复制获胜结果',
    viewDetailBtn: '💼 查看该职业完整鉴定书',
    copiedToast: '📋 冠军结果已复制到剪贴板！',
    copyFailToast: '复制结果失败。',
    shareBracketBtn: '🔗 分享相同条件重玩的URL链接',
    shareBracketToast: '🔗 相同对阵表链接已复制到剪贴板！',
    sameConditionBoxTitle: '🔗 相同条件重玩 / 给朋友分享同款对阵表',
    sameConditionBoxDesc: '访问此链接即可在完全相同的模式（{mode}）· {round}强 · 相同候选对阵表（种子码 #{seed}）下进行对决。',
    copyUrlShortBtn: '复制链接',
    worstToBest: {
      badge: 'Lv.0 ~ 499 地狱级职业',
      title: '💀 最烂职业里选最好的工作世界杯',
      subtitle: '在500个极度辛苦且工资垫底的地狱职业中，选出你最愿意去打工的那一个！',
      questionPrompt: '在这两份糟糕的工作中，你更愿意去哪家上班？',
      championTitle: '🏆 从最烂地狱职业中杀出重围的相对最佳职业！',
      oppositeLabel: '🌟 挑战神仙职业选最烂'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 神仙梦幻职业',
      title: '🌟 神仙职业里选最不想干的工作世界杯',
      subtitle: '在501个超高年薪的梦幻神仙职业中，挑出意外最让人抗拒或压力最大的那一个！',
      questionPrompt: '在这两份梦幻职业中，实际上哪份你最不想干？',
      championTitle: '💀 神仙职业中被大家评选出的最烂职业！',
      oppositeLabel: '💀 挑战最烂职业选最好'
    }
  },

  ms: {
    tabSearch: 'Cari Pekerjaan Saya',
    tabWorst: 'Terbaik daripada yang Terburuk',
    tabBest: 'Terburuk daripada yang Terbaik',
    roundSuffix: ' Pasukan',
    finalLabel: 'Peringkat Akhir',
    semiFinalLabel: 'Separuh Akhir (Top 4)',
    totalMatchesPrefix: 'Jumlah ',
    totalMatchesSuffix: ' perlawanan',
    recommended: ' · Disyorkan',
    selectRoundLabel: 'Pilih saiz kejohanan',
    startBtnSuffix: ' pekerjaan - Mulakan carta rawak',
    lobbyHint1: 'Cabutan rawak pekerjaan unik dari Lv.{min}~{max} setiap pusingan.',
    lobbyHint2: 'Di telefon, tatal ke atas dan ke bawah untuk membandingkan kedua-dua pekerjaan sebelum memilih.',
    matchCounter: 'Perlawanan {cur} / {total}',
    resetBtn: '🔄 Mulakan semula',
    pickBtn: '👆 Pilih pekerjaan ini',
    realBadge: '🏛️ Pekerjaan nyata',
    fictionBadge: '🦄 Fiksyen',
    realFullBadge: '🏛️ Pekerjaan di dunia nyata',
    fictionFullBadge: '🦄 Pekerjaan fiksyen & sains fiksyen',
    builtYearLabel: '⏰ Era',
    valueLabel: '💰 Anggaran Gaji',
    featureLabel: '🛠️ Tugas khas',
    featureFullLabel: '🛠️ Peran & Tugas khas',
    verdictLabel: '🤖 Keputusan AI',
    championBadgeSuffix: ' Juara',
    replayBtn: '🔄 Main semula',
    replaySameBtn: '🔁 Main semula dengan carta yang sama persis',
    replayNewRandomBtn: '🎲 Main carta rawak baharu',
    restartSameBtn: '🔁 Mulakan semula carta ini dari awal',
    copyBtn: '📋 Salin keputusan',
    viewDetailBtn: '💼 Lihat penilaian penuh',
    copiedToast: '📋 Keputusan juara disalin ke papan keratan!',
    copyFailToast: 'Gagal menyalin keputusan.',
    shareBracketBtn: '🔗 Kongsi URL untuk carta yang sama',
    shareBracketToast: '🔗 Pautan carta keadaan sama disalin ke papan keratan!',
    sameConditionBoxTitle: '🔗 Main semula keadaan sama / Kongsi carta perlawanan',
    sameConditionBoxDesc: 'Sesiapa yang membuka URL ini akan bermain mod yang sama ({mode}), saiz {round} pasukan, dan carta calon yang serupa (Seed #{seed}).',
    copyUrlShortBtn: 'Salin URL',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Pekerjaan Mimpi Ngeri',
      title: '💀 Piala Dunia Pekerjaan Terbaik Antara yang Terburuk',
      subtitle: 'Daripada 500 pekerjaan teruk dengan gaji rendah, yang manakah paling boleh anda tahan untuk bekerja?',
      questionPrompt: 'Antara dua kerja terburuk ini, yang mana anda rela masuk bertugas?',
      championTitle: '🏆 Pekerjaan paling boleh tahan yang terselamat antara yang terburuk!',
      oppositeLabel: '🌟 Cuba Terburuk Antara yang Terbaik'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 1,000 Pekerjaan Impian',
      title: '🌟 Piala Dunia Pekerjaan Terburuk Antara yang Terbaik',
      subtitle: 'Daripada 501 kerjaya mewah berpendapatan tinggi, yang manakah mengejutkan kerana paling membosankan atau tertekan?',
      questionPrompt: 'Pekerjaan impian manakah yang sebenarnya paling tidak diingini?',
      championTitle: '💀 Pekerjaan terburuk yang dipilih antara kerjaya impian!',
      oppositeLabel: '💀 Cuba Terbaik Antara yang Terburuk'
    }
  }
};

for (const [code, custom] of Object.entries(MULTILANG_WORLDCUP_DEFINITIONS)) {
  WORLDCUP_I18N[code] = {
    ...WORLDCUP_I18N.en,
    ...custom,
    worstToBest: { ...WORLDCUP_I18N.en.worstToBest, ...custom.worstToBest },
    bestToWorst: { ...WORLDCUP_I18N.en.bestToWorst, ...custom.bestToWorst }
  };
}

/**
 * Nested path translation retriever with English and Korean fallbacks
 * @param {string} lang
 * @param {string} pathStr
 * @param {Record<string, string|number>} [params={}]
 * @returns {any}
 */
export function getTranslation(lang, pathStr, params = {}) {
  const selectedLang = UI_DICTIONARY[lang] ? lang : 'ko';
  const parts = pathStr.split('.');
  let current = UI_DICTIONARY[selectedLang];

  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      let fb = UI_DICTIONARY['en'];
      for (const p of parts) fb = fb?.[p];
      if (fb !== undefined) {
        current = fb;
        break;
      }
      let fbKo = UI_DICTIONARY['ko'];
      for (const p of parts) fbKo = fbKo?.[p];
      current = fbKo;
      break;
    }
  }

  if (typeof current === 'string') {
    let result = current;
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
    return result;
  }
  return current;
}

/**
 * Returns World Cup translation dictionary for the given language
 * @param {string} [lang='ko']
 * @returns {object}
 */
export function getWorldCupTranslation(lang = 'ko') {
  return WORLDCUP_I18N[lang] || WORLDCUP_I18N.ko;
}

/**
 * Localizes an occupation object for any of the 14 supported languages.
 * Guarantees 0 Korean leakage when lang !== 'ko'.
 * @param {object} job Base occupation concept
 * @param {string} [lang='ko'] Target language code
 * @param {string|null} [nameQuery=null] Current candidate name
 * @returns {object}
 */
export function localizeJob(job, lang = 'ko', nameQuery = null) {
  if (!job) return job;

  // For Korean: preserve 100% original strings and dual property aliases
  if (!lang || lang === 'ko') {
    return {
      ...job,
      era: job.era || job.builtYear,
      builtYear: job.builtYear || job.era,
      estimatedSalary: job.estimatedSalary || job.estimatedValue,
      estimatedValue: job.estimatedValue || job.estimatedSalary,
      specialDuty: job.specialDuty || job.specialFeature,
      specialFeature: job.specialFeature || job.specialDuty
    };
  }

  const selectedLang = UI_DICTIONARY[lang] ? lang : 'en';
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['en'];
  const enDict = UI_DICTIONARY['en'];
  const lv = Number(job.level) || 0;

  const zoneLabel = dict.zones?.[job.zone] || enDict.zones?.[job.zone] || job.zone;
  const realityLabel = dict.reality?.[job.realityType] || enDict.reality?.[job.realityType] || job.realityType;
  const categoryLabel = dict.categories?.[job.category] || enDict.categories?.[job.category] || 'Special Occupation';
  const tierName = dict.tiers?.[job.tier] || enDict.tiers?.[job.tier] || `Tier ${job.tier}`;

  const masterJob = MASTER_JOBS?.[lv];
  const masterEn = job.en || masterJob?.en;

  const title = masterEn?.title || (/[가-힣]/.test(String(job.title || '')) ? `Level ${lv} Special Occupation` : job.title);
  let era = masterEn?.era || masterEn?.builtYear || (/[가-힣]/.test(String(job.era || job.builtYear || '')) ? 'Contemporary & Multiverse' : (job.era || job.builtYear));
  let estimatedSalary = masterEn?.estimatedSalary || masterEn?.estimatedValue || (/[가-힣]/.test(String(job.estimatedSalary || job.estimatedValue || '')) ? '$50,000 / year' : (job.estimatedSalary || job.estimatedValue));
  const specialDuty = masterEn?.specialDuty || masterEn?.specialFeature || (/[가-힣]/.test(String(job.specialDuty || job.specialFeature || '')) ? 'Performs unique tasks across the multiverse.' : (job.specialDuty || job.specialFeature));
  const aiVerdict = masterEn?.aiVerdict || (/[가-힣]/.test(String(job.aiVerdict || '')) ? 'An iconic career certified by the Multiverse Career Registry.' : job.aiVerdict);

  return {
    ...job,
    title,
    zoneLabel,
    realityLabel,
    categoryLabel,
    tierName,
    era,
    builtYear: era,
    estimatedSalary,
    estimatedValue: estimatedSalary,
    specialDuty,
    specialFeature: specialDuty,
    aiVerdict
  };
}

// Backward-compatible alias
export const localizeHouse = localizeJob;
