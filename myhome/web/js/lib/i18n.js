// src/lib/i18n.js — 14-Language Internationalization (i18n) Engine & Dynamic House Localizer
// Supports: ko, en, hi, vi, fr, pt, es, id, ru, de, it, ja, zh, ms
// Domain: tellmyname.app

import { MASTER_HOUSES } from './master_dataset.js';

export const SUPPORTED_LANGUAGES = [
  {
    "code": "ko",
    "label": "한국어",
    "native": "한국어",
    "flag": "🇰🇷",
    "locale": "ko-KR",
    "sampleNames": [
      "김서윤",
      "이민준",
      "홍길동",
      "박서윤",
      "선우용녀"
    ]
  },
  {
    "code": "en",
    "label": "English",
    "native": "English",
    "flag": "🇺🇸",
    "locale": "en-US",
    "sampleNames": [
      "Chloe",
      "Emma",
      "Liam",
      "Olivia",
      "Noah"
    ]
  },
  {
    "code": "hi",
    "label": "Hindi",
    "native": "हिन्दी",
    "flag": "🇮🇳",
    "locale": "hi-IN",
    "sampleNames": [
      "Aarav",
      "Diya",
      "Vihaan",
      "Ananya",
      "Rohan"
    ]
  },
  {
    "code": "vi",
    "label": "Vietnamese",
    "native": "Tiếng Việt",
    "flag": "🇻🇳",
    "locale": "vi-VN",
    "sampleNames": [
      "Minh",
      "Linh",
      "Anh",
      "Hùng",
      "Trang"
    ]
  },
  {
    "code": "fr",
    "label": "French",
    "native": "Français",
    "flag": "🇫🇷",
    "locale": "fr-FR",
    "sampleNames": [
      "Lucas",
      "Emma",
      "Gabriel",
      "Chloé",
      "Jules"
    ]
  },
  {
    "code": "pt",
    "label": "Portuguese",
    "native": "Português",
    "flag": "🇧🇷",
    "locale": "pt-BR",
    "sampleNames": [
      "Miguel",
      "Helena",
      "Arthur",
      "Alice",
      "Gael"
    ]
  },
  {
    "code": "es",
    "label": "Spanish",
    "native": "Español",
    "flag": "🇪🇸",
    "locale": "es-ES",
    "sampleNames": [
      "Mateo",
      "Sofía",
      "Santiago",
      "Valentina",
      "Leo"
    ]
  },
  {
    "code": "id",
    "label": "Indonesian",
    "native": "Bahasa Indonesia",
    "flag": "🇮🇩",
    "locale": "id-ID",
    "sampleNames": [
      "Budi",
      "Siti",
      "Rizky",
      "Putri",
      "Agus"
    ]
  },
  {
    "code": "ru",
    "label": "Russian",
    "native": "Русский",
    "flag": "🇷🇺",
    "locale": "ru-RU",
    "sampleNames": [
      "Александр",
      "София",
      "Максим",
      "Анна",
      "Михаил"
    ]
  },
  {
    "code": "de",
    "label": "German",
    "native": "Deutsch",
    "flag": "🇩🇪",
    "locale": "de-DE",
    "sampleNames": [
      "Noah",
      "Emilia",
      "Matteo",
      "Mia",
      "Leon"
    ]
  },
  {
    "code": "it",
    "label": "Italian",
    "native": "Italiano",
    "flag": "🇮🇹",
    "locale": "it-IT",
    "sampleNames": [
      "Leonardo",
      "Sofia",
      "Francesco",
      "Aurora",
      "Alessandro"
    ]
  },
  {
    "code": "ja",
    "label": "Japanese",
    "native": "日本語",
    "flag": "🇯🇵",
    "locale": "ja-JP",
    "sampleNames": [
      "Haruto",
      "Yui",
      "Sora",
      "Hina",
      "Ren"
    ]
  },
  {
    "code": "zh",
    "label": "Chinese",
    "native": "简体中文",
    "flag": "🇨🇳",
    "locale": "zh-CN",
    "sampleNames": [
      "Wei",
      "Fang",
      "Hao",
      "Yuhan",
      "Zihan"
    ]
  },
  {
    "code": "ms",
    "label": "Malay",
    "native": "Bahasa Melayu",
    "flag": "🇲🇾",
    "locale": "ms-MY",
    "sampleNames": [
      "Aisyah",
      "Ahmad",
      "Nur",
      "Muhammad",
      "Siti"
    ]
  }
];

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(l => [l.code, l])
);

export const UI_DICTIONARY = {
  "ko": {
    "brandHeader": "나에게 어울리는 집",
    "brandSub": "이름만 입력해서 찾는 재미로 보는 내 집 테스트 · 1,000개 하우스 매칭",
    "searchPlaceholder": "이름을 입력하세요 (예: 김서윤, Steve, 陽翔...)",
    "searchBtn": "내 집 찾기",
    "sampleLabel": "인기 추천 이름:",
    "ownerTitle": "{name}님에게 어울리는 집은",
    "certificateTitle": "나에게 어울리는 집",
    "zones": {
      "GOOD": "대박 하우스",
      "BAD": "폭망 하우스"
    },
    "reality": {
      "REAL": "실제 존재하는 건축물·사물",
      "FICTION": "허구·상상 속 건축물·사물"
    },
    "categories": {
      "TOILET": "세계의 신기한 화장실·위생시설",
      "CLOSET": "옷장·가구·코인사물함",
      "DOGHOUSE": "개집·동물 서식지·캣타워",
      "BOX": "종이상자·택배박스·용기",
      "VEHICLE": "자동차·캠핑카·기차·잠수함",
      "SPACESHIP": "우주선·우주정거장·궤도기지",
      "FICTION_MEDIA": "영화·소설·애니메이션 속 공간",
      "MUSEUM_PUBLIC": "이색 박물관·교도소·기괴 공공건물",
      "IMAGINARY_CITY": "상상 속의 도시·미니어처 왕국",
      "EXTREME_NATURE": "극한 오지·화산·심해·빙하 지형",
      "WEIRD_ARCH": "세계의 기이한 실제 건축물·랜드마크",
      "MULTIVERSE": "초차원·블랙홀·다중우주 창조주 신전",
      "PRISON_FACILITY": "감옥·독방·수용소",
      "INDUSTRIAL_HAZARD": "산업 재해·방사능·중오염 구역",
      "RUINS_ABANDONED": "폐허·방치 건물·슬럼가",
      "MICRO_DWELLING": "초소형·골판지·자판기·캡슐 원룸",
      "UNDERGROUND_BUNKER": "지하 은신처·방공호·카타콤",
      "ROYAL_PALACE": "황실 궁전·역사 고성",
      "LUXURY_PENTHOUSE": "세계 랜드마크·초호화 펜트하우스"
    },
    "specs": {
      "builtYearLabel": "건축 연도",
      "estimatedValueLabel": "추산 가치",
      "specialFeatureLabel": "특별한 기능",
      "aiVerdictLabel": "AI 감정평가사 총평",
      "tierLabel": "티어",
      "levelLabel": "단계"
    },
    "tierTemplate": "Tier {tier}: {name}",
    "storyHeader": "\"{name}님에게 어울리는 집은\"",
    "storyPhotoHint": "원하는 테마를 골라 이미지를 저장하거나 공유해보세요",
    "storySpecTitle": "건축물 명세서",
    "saveStoryBtn": "이미지로 저장 · 공유하기",
    "shareMobileBtn": "모바일로 공유하기",
    "copyUrlBtn": "결과 링크 복사",
    "copiedToast": "링크가 클립보드에 복사되었습니다!",
    "prevHouseBtn": "◀ 이전 단계 집 보기",
    "nextHouseBtn": "다음 단계 집 보기 ▶",
    "randomHouseBtn": "🎲 랜덤 집 보기",
    "scrollPreviewTitle": "단계별 집 목록 (클릭하여 사진 보기)",
    "imageLockedBadge": "🔒 페이지에 들어가면 집 사진이 공개됩니다",
    "enterHouseBtn": "이 집 들어가서 사진 보기 👉",
    "linkedNameBadge": "👤 대표 입주자: {name}",
    "seoTitleWithName": "{name}님에게 어울리는 집은? {title} | MyHome AI 감정",
    "seoDescWithName": "{name}님의 이름으로 찾은 인생 하우스: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "{name} 집 추천, {name} 집 이미지, {name} house recommendation, {name} house image, house for {name}, {name} house photo",
    "seoImgAltWithName": "{name}님에게 어울리는 집: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "이미지로 저장 · 공유하기",
    "photoDiaryLink": "오늘 뭐 먹지?",
    "photoDiaryTitle": "오늘 뭐 먹지? 바로가기",
    "foodLink": "오늘 뭐 먹지?",
    "foodTitle": "오늘 뭐 먹지? 바로가기",
    "langSelectLabel": "언어 변경",
    "nameInputAria": "감정받을 이름 입력",
    "randomDiceTitle": "🎲 주사위 굴려 무작위 이름 보기",
    "randomDiceToast": "🎲 랜덤 이름 '{name}' 감정 완료!",
    "refreshChipsTitle": "새로운 추천 이름 뽑기",
    "refreshChipsToast": "🔄 추천 검색 이름이 새로고침되었습니다!",
    "enterNameToast": "이름을 입력해주세요!",
    "returnMyHouseText": "내 원래 집({name} · Lv.{level})으로 돌아가기",
    "returnMyHouseDefault": "내 원래 집으로 돌아가기",
    "adBadgeTop": "AD · GOOGLE ADSENSE (상단 배너 광고 영역)",
    "adBadgeMain": "AD · GOOGLE ADSENSE (추천 집 하단 광고 영역)",
    "adBadgeFooter": "AD · GOOGLE ADSENSE (하단 멀티플렉스 광고 영역)",
    "adHintInfeed": "Sponsored ({index}번째 카드 하단 광고)",
    "scrollPreviewSubtitle": "제목을 클릭하면 해당 집 페이지로 이동하여 사진을 확인할 수 있습니다.",
    "scrollSubtitleHigher": "현재 레벨(Lv.{current})보다 더 높은 단계(Lv.{start}~{max})만 표시 중입니다. '전체 (0~999)'를 누르면 0레벨부터 볼 수 있습니다.",
    "scrollSubtitleAll": "0단계부터 {max}단계까지 제목을 클릭하면 해당 집 페이지로 이동하여 사진을 확인할 수 있습니다.",
    "scrollFilterAll": "전체 (0~999)",
    "scrollFilterBad": "💀 폭망 (Lv.0~499)",
    "scrollFilterGood": "🌟 대박 (Lv.500~999)",
    "scrollFilterReal": "🏛️ 실존 50%",
    "scrollFilterFiction": "🦄 허구 50%",
    "previewEnterArrow": "사진 보기 ›",
    "dockKeyboardHint": "💡 키보드 좌우 방향키(← / →)로 단계 이동, 스페이스바(Space)로 랜덤 탐색할 수 있습니다.",
    "loadingText": "AI 감정평가사가 다중우주 등기부를 조회하고 있습니다...",
    "loadingWithName": "AI 감정평가사가 [{name}]님의 명의를 조회 중입니다...",
    "tiers": {
      "1": "Tier 01: 태초의 밑바닥",
      "2": "Tier 02: 폐허와 슬럼가",
      "3": "Tier 03: 기괴한 고물과 상자",
      "4": "Tier 04: 극한 오지 변소와 방사능",
      "5": "Tier 05: 폐쇄 구역과 감옥",
      "6": "Tier 06: 애니·영화 속 굴욕의 거처",
      "7": "Tier 07: 위험천만 이동식 쉘터",
      "8": "Tier 08: 늪지대와 침수 구역",
      "9": "Tier 09: 고립된 사막과 얼음 굴",
      "10": "Tier 10: 폭망의 문턱 턱걸이",
      "11": "Tier 11: 대박 입문 힐링 샬레",
      "12": "Tier 12: 세계 역사 고성과 랜드마크",
      "13": "Tier 13: 픽사·디즈니 애니메이션 명소",
      "14": "Tier 14: 세계 초일류 도심 펜트하우스",
      "15": "Tier 15: 판타지 영화와 문학의 성채",
      "16": "Tier 16: 세계 7대 불가사의와 비경",
      "17": "Tier 17: 미래 스마트 도시와 슈퍼요트",
      "18": "Tier 18: 신화와 전설의 황금 궁전",
      "19": "Tier 19: SF 궤도 스테이션과 콜로니",
      "20": "Tier 20: 우주 초월 다이슨 스피어"
    },
    "guide": {
      "sectionTitle": "🏛️ 다중우주 부동산 감정원 안내서",
      "badBadge": "0 ~ 499단계",
      "badTitle": "💀 극단적 폭망 하우스",
      "badDesc": "마그마 반지하, 비 맞은 택배 박스, 시골 개집, 투명 공중화장실, 고장 난 마티즈 등 사람이 살기엔 상상을 초월하는 기괴하고 웃긴 집들만 모여있습니다.",
      "goodBadge": "500 ~ 999단계",
      "goodTitle": "🌟 극단적 대박 하우스",
      "goodDesc": "지하 핵미사일 사일로 호화 콘도, 아이언맨 절벽 저택, 부르즈 할리파 꼭대기, 국제우주정거장, 다이슨 스피어, 우주 창조주의 펜트하우스까지 펼쳐집니다.",
      "ruleBadge": "1단계 단위 교차",
      "ruleTitle": "🏛️ 실제 50% ↔ 🦄 허구 50%",
      "ruleDesc": "<strong>짝수 단계</strong>는 지구상에 실제로 존재하거나 존재했던 기상천외한 건축물, <strong>홀수 단계</strong>는 영화·SF·만화 속 허구의 공간이 1단계마다 정확히 번갈아 나타납니다."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "이름만 입력해서 찾는 재미로 보는 나에게 어울리는 집 (MyHome) 안내",
      "art1Title": "🏠 1. 이름만 입력하면 끝! 재미로 보는 나에게 어울리는 집 찾기",
      "art1P1": "나에게 어울리는 집(MyHome)은 복잡한 가입이나 설문 없이 이름만 입력하면 나에게 어울리는 집을 바로 찾을 수 있는 재미로 보는 하우스 매칭 테스트입니다. 내 이름은 물론 가족, 친구, 연인, 좋아하는 최애의 이름만 입력해 보세요! 한글, 영어 등 어떤 이름이든 입력하는 순간 그 이름만의 고유한 값으로 분석하여 1,000가지 기상천외한 집 중 찰떡같이 어울리는 집을 찾아줍니다.",
      "art1P2": "이름 한 글자나 획수 하나만 달라져도 0단계(폭망 하우스)부터 999단계(대박 하우스)까지 전혀 다른 집이 배정됩니다. 같은 이름을 입력하면 언제나 똑같은 집이 나오니, 친구들과 서로의 이름을 검색해 누가 더 웃기고 황당한 집이나 초호화 펜트하우스에 당첨되는지 재미로 비교하고 공유해 보세요!",
      "art2Title": "📐 2. 평범한 아파트는 없다! 1,000가지 기상천외한 집",
      "art2P1": "이 테스트에는 흔하고 뻔한 성냥갑 아파트나 빌라가 없습니다. 비 맞은 택배 박스, 투명 공중화장실, 시골 개집 같은 황당하고 웃긴 폭망 하우스부터 아이언맨 절벽 저택, 우주정거장, 은하계 펜트하우스 같은 초호화 대박 하우스까지 재미로 보는 1,000개의 독창적인 집들이 준비되어 있습니다.",
      "art2P2": "또한 짝수 단계(0, 2, 4...)는 지구상에 실제로 존재하거나 역사적으로 실존했던 기상천외한 건축물을, 홀수 단계(1, 3, 5...)는 영화, SF 소설, 신화 속 상상의 거주지를 정확히 1단계 단위로 50:50 번갈아 배치하여 지적 탐구와 엔터테인먼트적 재미를 동시에 선사합니다.",
      "art3Title": "🛡️ 3. 개인정보 저장 없는 안전한 재미용 테스트",
      "art3P1": "나에게 어울리는 집(MyHome)은 검색창에 입력한 어떠한 이름이나 검색 기록도 서버에 저장하지 않습니다. 모든 결과는 화면에서 즉시 계산되고 사라지므로 누구나 안심하고 재미로 이름을 검색해 볼 수 있습니다.",
      "art3P2": "집마다 적혀 있는 건축 연도, 추산 가치, 특별한 기능, AI 감정 총평은 모두 유쾌한 웃음과 상상력을 위해 꾸며낸 재미로 보는 엔터테인먼트 콘텐츠입니다. 결과 카드를 이미지로 저장해 인스타그램 스토리나 카카오톡으로 친구들에게 내 집을 자랑해 보세요!"
    },
    "footer": {
      "brand": "나에게 어울리는 집 (MyHome)",
      "about": "소개 (About)",
      "contact": "문의 (Contact)",
      "privacy": "개인정보처리방침 (Privacy Policy)",
      "terms": "이용약관 (Terms of Service)",
      "consent": "개인정보설정 (Consent)",
      "desc": "본 서비스는 이름만 입력해서 재미로 보는 나에게 어울리는 집 매칭 테스트입니다."
    },
    "shareModal": {
      "themeCert": "등기권리증",
      "themeCyber": "사이버 네온",
      "themeSunset": "노을 그라디언트",
      "instaDirectBtn": "인스타그램 스토리로 바로 보내기 / 공유",
      "savedToast": "📥 9:16 인스타 스토리 이미지가 저장되었습니다! 인스타그램 스토리에서 사진을 올리고 링크 스티커를 첨부해보세요.",
      "instaDownloadedToast": "📸 9:16 스토리가 다운로드되고 링크가 복사되었습니다! 인스타그램 스토리에서 사진을 올리고 링크 스티커를 붙여보세요.",
      "messengerCopiedToast": "💬 공유 주소가 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유하세요.",
      "whatsappDirectBtn": "왓츠앱으로 공유하기",
      "whatsappOpenedToast": "🟢 왓츠앱 대화창으로 공유 메시지가 전송됩니다!",
      "tiktokDirectBtn": "틱톡 공유 (9:16 카드 & 링크)",
      "tiktokDownloadedToast": "🎵 9:16 스토리가 다운로드되고 링크가 복사되었습니다! 틱톡에서 사진/스토리를 올리고 링크를 붙여보세요."
    }
  },
  "en": {
    "brandHeader": "The House That Suits You",
    "brandSub": "Fun Name Test: Discover Your Perfect House · 1,000 House Matches",
    "searchPlaceholder": "Enter your name (e.g. Steve, Emma, Olivia...)",
    "searchBtn": "Find My House",
    "sampleLabel": "Trending Names:",
    "ownerTitle": "The House That Suits {name}",
    "certificateTitle": "The House That Suits You",
    "zones": {
      "GOOD": "Jackpot House",
      "BAD": "Extreme Doom House"
    },
    "reality": {
      "REAL": "Real-World Architecture & Places",
      "FICTION": "Fictional, Sci-Fi & Mythical Places"
    },
    "categories": {
      "TOILET": "Bizarre Toilets & Restrooms",
      "CLOSET": "Closets, Furniture & Coin Lockers",
      "DOGHOUSE": "Doghouses, Animal Habitats & Cat Towers",
      "BOX": "Cardboard Boxes, Parcels & Containers",
      "VEHICLE": "Cars, RVs, Trains & Submarines",
      "SPACESHIP": "Spaceships, Stations & Orbital Bases",
      "FICTION_MEDIA": "Movies, Novels & Anime Dwellings",
      "MUSEUM_PUBLIC": "Odd Museums, Prisons & Bizarre Public Sites",
      "IMAGINARY_CITY": "Imaginary Cities & Miniature Kingdoms",
      "EXTREME_NATURE": "Extreme Wilds, Volcanoes, Abysses & Glaciers",
      "WEIRD_ARCH": "Weird Architectural Wonders & Quirky Landmarks",
      "MULTIVERSE": "Hyperdimensions, Black Holes & Multiverse Temples",
      "PRISON_FACILITY": "Prisons, Solitary Cells & Detention Facilities",
      "INDUSTRIAL_HAZARD": "Industrial Hazard, Radiation & Polluted Zones",
      "RUINS_ABANDONED": "Abandoned Ruins, Ghost Towns & Slums",
      "MICRO_DWELLING": "Micro-Dwellings, Cardboard, Vending & Capsule Rooms",
      "UNDERGROUND_BUNKER": "Underground Bunkers, Shelters & Catacombs",
      "ROYAL_PALACE": "Royal Palaces & Historic Castles",
      "LUXURY_PENTHOUSE": "World Landmarks & Ultra-Luxury Penthouses"
    },
    "specs": {
      "builtYearLabel": "Year Built",
      "estimatedValueLabel": "Estimated Value",
      "specialFeatureLabel": "Special Feature",
      "aiVerdictLabel": "AI Appraiser Verdict",
      "tierLabel": "Tier",
      "levelLabel": "Level"
    },
    "tierTemplate": "Tier {tier}: {name}",
    "storyHeader": "\"The House That Suits {name}\"",
    "storyPhotoHint": "Pick a theme to save or share your card",
    "storySpecTitle": "Architectural Specifications",
    "saveStoryBtn": "Save & Share Image",
    "shareMobileBtn": "Share on Mobile",
    "copyUrlBtn": "Copy Result Link",
    "copiedToast": "Link copied to clipboard!",
    "prevHouseBtn": "◀ Previous House",
    "nextHouseBtn": "Next House ▶",
    "randomHouseBtn": "🎲 Random House",
    "scrollPreviewTitle": "House List by Level (Click to View Photo)",
    "imageLockedBadge": "🔒 Enter page to reveal house photo",
    "enterHouseBtn": "Enter this house & see photo 👉",
    "linkedNameBadge": "👤 Featured Resident: {name}",
    "seoTitleWithName": "{name}'s House Match: {title} | MyHome AI Architecture & House Finder",
    "seoDescWithName": "Discover {name}'s destined house: {title} ({zoneLabel}, {realityLabel}). Find {name} house recommendation, {name} house image, house for {name} on MyHome.",
    "seoImageKeywords": "{name} house recommendation, {name} house image, house for {name}, {name} house photo, {name} home test, {name} house",
    "seoImgAltWithName": "{name}'s matched house: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Save & Share Image",
    "photoDiaryLink": "What to Eat Today?",
    "photoDiaryTitle": "Go to What to Eat Today?",
    "foodLink": "What to Eat Today?",
    "foodTitle": "Go to What to Eat Today?",
    "langSelectLabel": "Change Language",
    "nameInputAria": "Enter a name for appraisal",
    "randomDiceTitle": "🎲 Roll dice for a random name",
    "randomDiceToast": "🎲 Random name '{name}' appraised!",
    "refreshChipsTitle": "Refresh trending names",
    "refreshChipsToast": "🔄 Trending names refreshed!",
    "enterNameToast": "Please enter a name!",
    "returnMyHouseText": "Return to My House ({name} · Lv.{level})",
    "returnMyHouseDefault": "Return to My Original House",
    "adBadgeTop": "AD · GOOGLE ADSENSE (TOP BANNER)",
    "adBadgeMain": "AD · GOOGLE ADSENSE (MAIN DISPLAY)",
    "adBadgeFooter": "AD · GOOGLE ADSENSE (FOOTER MULTIPLEX)",
    "adHintInfeed": "Sponsored (Card #{index})",
    "scrollPreviewSubtitle": "Click any house title below to enter its page and reveal the photo.",
    "scrollSubtitleHigher": "Showing levels higher than your current level Lv.{current} (Lv.{start}~{max}). Click 'All (0~999)' to browse from Lv.0.",
    "scrollSubtitleAll": "Click any title from Lv.0 to Lv.{max} to visit its page and reveal the photo.",
    "scrollFilterAll": "All (0~999)",
    "scrollFilterBad": "💀 Doom (Lv.0~499)",
    "scrollFilterGood": "🌟 Jackpot (Lv.500~999)",
    "scrollFilterReal": "🏛️ Real 50%",
    "scrollFilterFiction": "🦄 Fiction 50%",
    "previewEnterArrow": "View Photo ›",
    "dockKeyboardHint": "💡 Use Left/Right Arrow keys (← / →) to navigate levels, or Spacebar for a random house.",
    "loadingText": "AI Appraiser is querying the multiverse property registry...",
    "loadingWithName": "AI Appraiser is verifying the multiverse deed for [{name}]...",
    "tiers": {
      "1": "Tier 01: Primordial Rock Bottom",
      "2": "Tier 02: Ruins & Slum Alleys",
      "3": "Tier 03: Bizarre Scrap & Cardboard Boxes",
      "4": "Tier 04: Extreme Outpost Latrines & Radiation",
      "5": "Tier 05: Lockdown Zones & Prisons",
      "6": "Tier 06: Humiliating Anime & Movie Lairs",
      "7": "Tier 07: Precarious Mobile Shelters",
      "8": "Tier 08: Swamps & Flooded Zones",
      "9": "Tier 09: Isolated Deserts & Ice Caves",
      "10": "Tier 10: Edge of Doom Threshold",
      "11": "Tier 11: Jackpot Entry Healing Chalets",
      "12": "Tier 12: Historic World Castles & Landmarks",
      "13": "Tier 13: Iconic Pixar & Disney Dwellings",
      "14": "Tier 14: Ultra-Prime Urban Penthouses",
      "15": "Tier 15: Citadels of Fantasy Film & Literature",
      "16": "Tier 16: Seven Wonders & Hidden Sanctuaries",
      "17": "Tier 17: Future Smart Cities & Superyachts",
      "18": "Tier 18: Golden Palaces of Myth & Legend",
      "19": "Tier 19: Sci-Fi Orbital Stations & Colonies",
      "20": "Tier 20: Transcendental Dyson Spheres"
    },
    "guide": {
      "sectionTitle": "🏛️ Multiverse Real Estate & House Guide",
      "badBadge": "Levels 0 ~ 499",
      "badTitle": "💀 Extreme Doom Houses",
      "badDesc": "From magma semi-basements and rain-soaked delivery boxes to rural doghouses, transparent public toilets, and broken micro-cars—an absurd collection of hilarious survival dwellings.",
      "goodBadge": "Levels 500 ~ 999",
      "goodTitle": "🌟 Extreme Jackpot Houses",
      "goodDesc": "From luxury nuclear silo condos and cliffside billionaire mansions to the top of Burj Khalifa, the International Space Station, Dyson Spheres, and the Multiverse Creator Penthouse.",
      "ruleBadge": "Alternating Every 1 Level",
      "ruleTitle": "🏛️ 50% Real ↔ 🦄 50% Fictional",
      "ruleDesc": "<strong>Even levels</strong> feature extraordinary architecture and places that actually exist on Earth, while <strong>odd levels</strong> alternate strictly every step with iconic spaces from movies, sci-fi, and mythology."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Discover Your House by Name · MyHome Guide & Overview",
      "art1Title": "🏠 1. Just Enter a Name! A Fun Test to Find the House That Suits You",
      "art1P1": "The House That Suits You (MyHome) is a fun house-matching test where you can instantly discover your perfect dwelling simply by entering your name—no tedious sign-ups or surveys required. Try entering your own name, or the names of your family, friends, partner, or favorite celebrity! Whether entered in English, Korean, or any other language, each name is analyzed by its unique character value to pair you with a match among 1,000 extraordinary houses.",
      "art1P2": "A difference of even a single letter or stroke completely changes your destiny—assigning you anything from Level 0 (Extreme Doom House) to Level 999 (Ultimate Jackpot House). The same name always yields the exact same house deterministically, so search your friends' names and share the results to see who lands the most hilarious flop dwelling or the ultimate luxury penthouse!",
      "art2Title": "📐 2. No Boring Apartments! 1,000 Extraordinary Dwellings",
      "art2P1": "You won't find generic cookie-cutter apartments here. From hilarious flop houses like a rain-soaked delivery box, a transparent public toilet, and a rural doghouse, to extravagant dream estates like Iron Man's cliffside mansion, the International Space Station, and an intergalactic penthouse—1,000 uniquely imaginative houses await.",
      "art2P2": "Furthermore, even levels (0, 2, 4...) feature bizarre architectural wonders that actually exist or once existed on Earth, while odd levels (1, 3, 5...) feature imaginative dwellings from cinema, sci-fi novels, and mythology. Alternating strictly 50:50 every single level, it delivers intellectual curiosity and delightful entertainment alike.",
      "art3Title": "🛡️ 3. Safe & Private: Zero Personal Data Stored",
      "art3P1": "MyHome does not store any entered names or search history on any central server or database. All calculations are executed instantly in your browser memory and cleared immediately, so anyone can enjoy searching names with complete peace of mind.",
      "art3P2": "The construction year, estimated value, special features, and AI appraisal verdict displayed for each house are creative entertainment content designed for humor and imagination. Save your result card as an image and show off your house to friends on Instagram Stories, TikTok, or messaging apps!"
    },
    "footer": {
      "brand": "The House That Suits You (MyHome)",
      "about": "About",
      "contact": "Contact",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "consent": "Privacy Settings",
      "desc": "MyHome is an entertaining name test that finds the house that suits you best just by entering a name."
    },
    "shareModal": {
      "themeCert": "Classic Deed",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Sunset Glow",
      "instaDirectBtn": "Share to Instagram Story Directly",
      "savedToast": "📥 9:16 Instagram Story image saved! Upload it to your Story with the Link sticker.",
      "instaDownloadedToast": "📸 Story image downloaded & link copied! Upload it to Instagram Story.",
      "messengerCopiedToast": "💬 Share link copied! Paste it into your messenger chat.",
      "whatsappDirectBtn": "Share via WhatsApp",
      "whatsappOpenedToast": "🟢 WhatsApp share window opened!",
      "tiktokDirectBtn": "Share to TikTok (9:16 Card & Link)",
      "tiktokDownloadedToast": "🎵 9:16 Story downloaded & link copied! Upload it to TikTok with the Link sticker."
    }
  },
  "hi": {
    "brandHeader": "आपके लिए उपयुक्त घर",
    "brandSub": "सिर्फ नाम लिखकर जानें आपके लिए सही घर · मजेदार हाउस टेस्ट · 1,000 अनोखे घर",
    "searchPlaceholder": "अपना नाम दर्ज करें (उदा. Aarav, Diya, Steve...)",
    "searchBtn": "मेरा घर खोजें",
    "sampleLabel": "लोकप्रिय नाम:",
    "ownerTitle": "{name} के लिए उपयुक्त घर",
    "certificateTitle": "आपके लिए उपयुक्त घर",
    "zones": {
      "GOOD": "लकी जैकपॉट घर",
      "BAD": "बदकिस्मत फनी घर"
    },
    "reality": {
      "REAL": "वास्तविक दुनिया की वास्तुकला और स्थान",
      "FICTION": "काल्पनिक, विज्ञान-कथा और पौराणिक स्थान"
    },
    "categories": {
      "TOILET": "अनोखे शौचालय व स्वच्छता सुविधाएं",
      "CLOSET": "अलमारियां, फर्नीचर और सिक्का लॉकर",
      "DOGHOUSE": "कुत्ते के घर, पशु आवास और कैट टॉवर",
      "BOX": "गत्ते के डिब्बे, पार्सल और कंटेनर",
      "VEHICLE": "कार, आरवी, ट्रेन और पनडुब्बी",
      "SPACESHIP": "अंतरिक्ष यान, स्टेशन और कक्षीय आधार",
      "FICTION_MEDIA": "फिल्मों, उपन्यासों और एनीमे के आवास",
      "MUSEUM_PUBLIC": "विचित्र संग्रहालय, जेल और असामान्य भवन",
      "IMAGINARY_CITY": "काल्पनिक शहर और लघु साम्राज्य",
      "EXTREME_NATURE": "चरम इलाके, ज्वालामुखी, गहरे समुद्र और ग्लेशियर",
      "WEIRD_ARCH": "दुनिया के अनोखे वास्तुशिल्प चमत्कार",
      "MULTIVERSE": "अति-आयामी, ब्लैक होल और मल्टीवर्स मंदिर",
      "PRISON_FACILITY": "जेल, एकांत कोठरी और बंदीगृह",
      "INDUSTRIAL_HAZARD": "औद्योगिक जोखिम और विकिरण क्षेत्र",
      "RUINS_ABANDONED": "खंडहर, परित्यक्त इमारतें और बस्तियां",
      "MICRO_DWELLING": "सूक्ष्म आवास, कार्डबोर्ड और कैप्सूल कमरे",
      "UNDERGROUND_BUNKER": "भूमिगत बंकर, आश्रय और कैटाकॉम्ब",
      "ROYAL_PALACE": "शाही महल और ऐतिहासिक किले",
      "LUXURY_PENTHOUSE": "विश्व लैंडमार्क और अल्ट्रा-लक्जरी पेंटहाउस"
    },
    "specs": {
      "builtYearLabel": "निर्माण वर्ष",
      "estimatedValueLabel": "अनुमानित मूल्य",
      "specialFeatureLabel": "विशेष सुविधा",
      "aiVerdictLabel": "AI मूल्यांकनकर्ता का निष्कर्ष",
      "tierLabel": "टियर (Tier)",
      "levelLabel": "लेवल (Level)"
    },
    "tierTemplate": "टियर {tier}: {name}",
    "storyHeader": "\"{name} के लिए उपयुक्त घर\"",
    "storyPhotoHint": "थीम चुनें और अपनी कार्ड इमेज सेव या शेयर करें",
    "storySpecTitle": "वास्तुशिल्प विनिर्देश",
    "saveStoryBtn": "इमेज सेव और शेयर करें",
    "shareMobileBtn": "मोबाइल पर शेयर करें",
    "copyUrlBtn": "लिंक कॉपी करें",
    "copiedToast": "लिंक क्लिपबोर्ड पर कॉपी हो गया!",
    "prevHouseBtn": "◀ पिछला घर",
    "nextHouseBtn": "अगला घर ▶",
    "randomHouseBtn": "🎲 यादृच्छिक घर",
    "scrollPreviewTitle": "स्तर अनुसार घर सूची (फोटो देखने के लिए क्लिक करें)",
    "imageLockedBadge": "🔒 फोटो देखने के लिए पेज पर जाएं",
    "enterHouseBtn": "इस घर में प्रवेश करें और फोटो देखें 👉",
    "linkedNameBadge": "👤 प्रमुख निवासी: {name}",
    "seoTitleWithName": "{name} के लिए उपयुक्त घर: {title} | MyHome AI आर्किटेक्चर",
    "seoDescWithName": "{name} के लिए उपयुक्त घर: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "{name} के लिए घर, {name} का घर, {name} घर सिफारिश, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "{name} के लिए घर: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "इमेज सेव और शेयर करें",
    "photoDiaryLink": "आज क्या खाएं?",
    "photoDiaryTitle": "आज क्या खाएं? पर जाएं",
    "foodLink": "आज क्या खाएं?",
    "foodTitle": "आज क्या खाएं? पर जाएं",
    "langSelectLabel": "भाषा बदलें",
    "nameInputAria": "मूल्यांकन के लिए नाम दर्ज करें",
    "randomDiceTitle": "🎲 यादृच्छिक नाम के लिए पासा पलटें",
    "randomDiceToast": "🎲 यादृच्छिक नाम '{name}' का मूल्यांकन पूरा हुआ!",
    "refreshChipsTitle": "नए सुझाए गए नाम चुनें",
    "refreshChipsToast": "🔄 लोकप्रिय नाम अपडेट किए गए!",
    "enterNameToast": "कृपया एक नाम दर्ज करें!",
    "returnMyHouseText": "मेरे मूल घर ({name} · Lv.{level}) पर वापस जाएं",
    "returnMyHouseDefault": "मेरे मूल घर पर वापस जाएं",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "फोटो देखने के लिए किसी भी घर के शीर्षक पर क्लिक करें।",
    "scrollSubtitleHigher": "आपके वर्तमान स्तर Lv.{current} से उच्च स्तर (Lv.{start}~{max}) दिखाए जा रहे हैं। Lv.0 से देखने के लिए 'सभी (0~999)' पर क्लिक करें।",
    "scrollSubtitleAll": "फोटो देखने के लिए Lv.0 से Lv.{max} तक किसी भी शीर्षक पर क्लिक करें।",
    "scrollFilterAll": "सभी (0~999)",
    "scrollFilterBad": "💀 फ्लॉप (Lv.0~499)",
    "scrollFilterGood": "🌟 लकी (Lv.500~999)",
    "scrollFilterReal": "🏛️ वास्तविक 50%",
    "scrollFilterFiction": "🦄 काल्पनिक 50%",
    "previewEnterArrow": "फोटो देखें ›",
    "dockKeyboardHint": "💡 स्तर बदलने के लिए तीर कुंजियों (← / →) या रैंडम घर के लिए Space का उपयोग करें।",
    "loadingText": "AI मूल्यांकनकर्ता मल्टीवर्स रजिस्ट्री की जांच कर रहा है...",
    "loadingWithName": "AI मूल्यांकनकर्ता [{name}] के घर का सत्यापन कर रहा है...",
    "tiers": {
      "1": "टियर 01: पाताल का सबसे निचला स्तर",
      "2": "टियर 02: खंडहर और तंग गलियां",
      "3": "टियर 03: अजीबोगरीब कबाड़ और डिब्बे",
      "4": "टियर 04: दुर्गम शौचालय और विकिरण क्षेत्र",
      "5": "टियर 05: बंद क्षेत्र और जेलें",
      "6": "टियर 06: एनीमे और फिल्मों के अजीब ठिकाने",
      "7": "टियर 07: खतरनाक मोबाइल आश्रय",
      "8": "टियर 08: दलदल और बाढ़ वाले क्षेत्र",
      "9": "टियर 09: एकांत रेगिस्तान और बर्फ की गुफाएं",
      "10": "टियर 10: दुर्भाग्य की अंतिम दहलीज",
      "11": "टियर 11: लकी हीलिंग शैले",
      "12": "टियर 12: ऐतिहासिक विश्व किले और लैंडमार्क",
      "13": "टियर 13: डिज्नी और पिक्सर के प्रसिद्ध स्थान",
      "14": "टियर 14: विश्व स्तरीय शहरी पेंटहाउस",
      "15": "टियर 15: फंतासी फिल्मों और साहित्य के गढ़",
      "16": "टियर 16: विश्व के सात अजूबे और गुप्त स्वर्ग",
      "17": "टियर 17: स्मार्ट शहर और सुपरयॉट",
      "18": "टियर 18: पौराणिक स्वर्ण महल",
      "19": "टियर 19: अंतरिक्ष स्टेशन और कॉलोनियां",
      "20": "टियर 20: ब्रह्मांडीय डायसन स्फीयर"
    },
    "guide": {
      "sectionTitle": "🏛️ मल्टीवर्स हाउस गाइड",
      "badBadge": "स्तर 0 ~ 499",
      "badTitle": "💀 एकदम बदकिस्मत फनी घर",
      "badDesc": "मैग्मा बेसमेंट, भीगे हुए पार्सल बॉक्स, डॉगहाउस और अजीबोगरीब सार्वजनिक शौचालयों से लेकर टूटी गाड़ियों तक के मजेदार घर।",
      "goodBadge": "स्तर 500 ~ 999",
      "goodTitle": "🌟 भव्य लकी जैकपॉट घर",
      "goodDesc": "लक्जरी परमाणु बंकर, क्लिफसाइड मेंशन, बुर्ज खलीफा के शिखर, अंतरिक्ष स्टेशन और डायसन स्फीयर पेंटहाउस तक।",
      "ruleBadge": "प्रत्येक स्तर पर बदलाव",
      "ruleTitle": "🏛️ 50% वास्तविक ↔ 🦄 50% काल्पनिक",
      "ruleDesc": "<strong>सम स्तर</strong> पृथ्वी पर वास्तविक वास्तुकला दिखाते हैं, जबकि <strong>विषम स्तर</strong> फिल्मों, विज्ञान-कथा और पौराणिक कथाओं के काल्पनिक स्थानों को बारी-बारी से दिखाते हैं।"
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "MyHome गाइड · सिर्फ नाम लिखकर जानें आपके लिए सबसे सही घर",
      "art1Title": "🏠 1. बस नाम लिखें और नतीजा पाएं! आपके अनुकूल घर खोजने का मजेदार टेस्ट",
      "art1P1": "‘आपके लिए उपयुक्त घर’ (MyHome) एक मजेदार हाउस-मैचिंग टेस्ट है, जहां बिना किसी झंझट या फॉर्म भरे, केवल अपना नाम लिखकर आप जान सकते हैं कि कौन सा घर आपके लिए बिल्कुल सही है। अपना नाम, दोस्तों, परिवार या अपने पसंदीदा सेलिब्रिटी का नाम लिखकर देखें! हिंदी, अंग्रेजी या किसी भी भाषा में नाम लिखते ही सिस्टम उसके अनोखे अक्षरों का विश्लेषण करके आपको 1,000 अनोखे घरों में से एक सटीक घर आवंटित करता है।",
      "art1P2": "नाम में सिर्फ एक अक्षर या मात्रा का अंतर भी आपकी किस्मत को पूरी तरह बदल सकता है — लेवल 0 (एकदम बदकिस्मत फनी घर) से लेकर लेवल 999 (भव्य लकी जैकपॉट घर) तक! एक ही नाम पर हमेशा वही घर मिलता है, इसलिए अपने दोस्तों के नाम सर्च करें और शेयर करके देखें कि किसे सबसे हास्यास्पद ठिकाना मिला और किसे आलीशान पेंटहाउस!",
      "art2Title": "📐 2. कोई उबाऊ साधारण फ्लैट नहीं! 1,000 अनोखे और अजीबोगरीब घर",
      "art2P1": "इस टेस्ट में आपको कोई साधारण अपार्टमेंट या फ्लैट नहीं मिलेगा। बारिश में भीगे डिलीवरी बॉक्स, पारदर्शी सार्वजनिक शौचालय, और कुत्ते के घर जैसे अजीब और हंसाने वाले ठिकानों से लेकर आयरन मैन के क्लिफ मेंशन, अंतरराष्ट्रीय अंतरिक्ष स्टेशन और सुपर-लक्जरी पेंटहाउस तक — 1,000 अनोखे और कल्पनाशील घर आपका इंतजार कर रहे हैं।",
      "art2P2": "इसके अलावा, सम स्तर (0, 2, 4...) पृथ्वी पर वास्तव में मौजूद अजूबे निर्माणों को दिखाते हैं, जबकि विषम स्तर (1, 3, 5...) फिल्मों, विज्ञान-कथाओं और पौराणिक कथाओं के काल्पनिक स्थानों को 50:50 के सटीक अनुपात में प्रस्तुत करते हैं, जो ज्ञान और मनोरंजन दोनों का भरपूर आनंद देते हैं।",
      "art3Title": "🛡️ 3. पूर्णतः सुरक्षित: कोई व्यक्तिगत डेटा सुरक्षित नहीं होता",
      "art3P1": "MyHome आपके द्वारा दर्ज किए गए किसी भी नाम या खोज इतिहास को अपने सर्वर पर सुरक्षित नहीं रखता है। सभी परिणाम सीधे आपके ब्राउज़र में तैयार होते हैं और तुरंत समाप्त हो जाते हैं, इसलिए कोई भी पूरी निश्चिंतता के साथ इसका आनंद ले सकता है।",
      "art3P2": "प्रत्येक घर के लिए प्रदर्शित निर्माण वर्ष, अनुमानित मूल्य, विशेष सुविधाएं और AI मूल्यांकनकर्ता की टिप्पणी केवल मनोरंजन और चेहरे पर मुस्कान लाने के लिए बनाई गई काल्पनिक सामग्री है। अपने परिणाम कार्ड को इमेज के रूप में सेव करें और इंस्टाग्राम स्टोरी या व्हाट्सएप पर दोस्तों के साथ गर्व से शेयर करें!"
    },
    "footer": {
      "brand": "आपके लिए उपयुक्त घर (MyHome)",
      "about": "परिचय (About)",
      "contact": "संपर्क (Contact)",
      "privacy": "गोपनीयता नीति (Privacy)",
      "terms": "सेवा की शर्तें (Terms)",
      "consent": "गोपनीयता सेटिंग्स (Consent)",
      "desc": "यह सेवा सिर्फ नाम दर्ज करके आपके अनुकूल घर खोजने वाला एक मनोरंजक टेस्ट है।"
    },
    "shareModal": {
      "themeCert": "क्लासिक",
      "themeCyber": "साइबरपंक",
      "themeSunset": "सनसेट",
      "instaDirectBtn": "इंस्टाग्राम स्टोरी पर सीधे शेयर करें",
      "savedToast": "📥 9:16 स्टोरी इमेज सेव हो गई!",
      "instaDownloadedToast": "📸 स्टोरी डाउनलोड हो गई और लिंक कॉपी हो गया!",
      "messengerCopiedToast": "💬 शेयर लिंक कॉपी हो गया!",
      "whatsappDirectBtn": "WhatsApp पर शेयर करें",
      "whatsappOpenedToast": "🟢 WhatsApp शेयर विंडो खुल गई है!",
      "tiktokDirectBtn": "TikTok पर शेयर करें (9:16 कार्ड और लिंक)",
      "tiktokDownloadedToast": "🎵 9:16 स्टोरी डाउनलोड हो गई और लिंक कॉपी हो गया! TikTok पर लिंक के साथ शेयर करें।"
    }
  },
  "vi": {
    "brandHeader": "Ngôi Nhà Phù Hợp Với Bạn",
    "brandSub": "Trắc nghiệm vui tìm ngôi nhà hợp với bạn chỉ bằng tên · Khám phá 1.000 ngôi nhà độc lạ",
    "searchPlaceholder": "Nhập tên của bạn (vd: Minh, Linh, Steve...)",
    "searchBtn": "Tìm Nhà Của Tôi",
    "sampleLabel": "Tên Thịnh Hành:",
    "ownerTitle": "Ngôi nhà phù hợp với {name}",
    "certificateTitle": "Ngôi Nhà Phù Hợp Với Bạn",
    "zones": {
      "GOOD": "Biệt Thự May Mắn Đỉnh Cao",
      "BAD": "Ngôi Nhà Xui Xẻo Hài Hước"
    },
    "reality": {
      "REAL": "Kiến Trúc & Địa Danh Thực Tế",
      "FICTION": "Địa Danh Giả Tưởng & Khoa Học Viễn Tưởng"
    },
    "categories": {
      "TOILET": "Nhà Vệ Sinh & Công Trình Vệ Sinh Kỳ Lạ",
      "CLOSET": "Tủ Quần Áo, Nội Thất & Tủ Khóa",
      "DOGHOUSE": "Nhà Chó, Chuồng Thú & Trụ Cào Móng",
      "BOX": "Thùng Carton, Hộp Hàng & Thùng Chứa",
      "VEHICLE": "Xe Hơi, Xe Nhà Kéo, Tàu Hỏa & Tàu Ngầm",
      "SPACESHIP": "Tàu Vũ Trụ, Trạm Không Gian & Căn Cứ Quỹ Đạo",
      "FICTION_MEDIA": "Không Gian Phim Ảnh, Tiểu Thuyết & Anime",
      "MUSEUM_PUBLIC": "Bảo Tàng Kỳ Lạ, Nhà Tù & Công Trình Kỳ Quặc",
      "IMAGINARY_CITY": "Thành Phố Tưởng Tượng & Vương Quốc Thu Nhỏ",
      "EXTREME_NATURE": "Vùng Đất Khắc Nghiệt, Núi Lửa, Biển Sâu & Băng Trôi",
      "WEIRD_ARCH": "Kỳ Quan Kiến Trúc Độc Lạ Thế Giới",
      "MULTIVERSE": "Đa Chiều Không Gian, Hố Đen & Đền Thờ Đa Vũ Trụ",
      "PRISON_FACILITY": "Nhà Tù, Phòng Biệt Giam & Trại Giam",
      "INDUSTRIAL_HAZARD": "Khu Công Nghiệp Nguy Hiểm & Phóng Xạ",
      "RUINS_ABANDONED": "Phế Tích, Tòa Nhà Bỏ Hoang & Khu Ổ Chuột",
      "MICRO_DWELLING": "Nhà Siêu Nhỏ, Thùng Carton & Phòng Capsule",
      "UNDERGROUND_BUNKER": "Boong-ke Ngầm, Hầm Trú Ẩn & Hầm Mộ",
      "ROYAL_PALACE": "Cung Điện Hoàng Gia & Lâu Đài Cổ",
      "LUXURY_PENTHOUSE": "Biểu Tượng Thế Giới & Penthouse Siêu Sang"
    },
    "specs": {
      "builtYearLabel": "Năm Xây Dựng",
      "estimatedValueLabel": "Giá Trị Ước Tính",
      "specialFeatureLabel": "Đặc Điểm Nổi Bật",
      "aiVerdictLabel": "Đánh Giá Của Thẩm Định Viên AI",
      "tierLabel": "Hạng",
      "levelLabel": "Cấp"
    },
    "tierTemplate": "Hạng {tier}: {name}",
    "storyHeader": "\"Ngôi Nhà Phù Hợp Với {name}\"",
    "storyPhotoHint": "Chọn giao diện để lưu hoặc chia sẻ thẻ ảnh",
    "storySpecTitle": "Bản Chi Tiết Công Trình",
    "saveStoryBtn": "Lưu & Chia sẻ ảnh",
    "shareMobileBtn": "Chia Sẻ Qua Di Động",
    "copyUrlBtn": "Sao Chép Liên Kết",
    "copiedToast": "Đã sao chép liên kết vào bộ nhớ tạm!",
    "prevHouseBtn": "◀ Xem Nhà Trước",
    "nextHouseBtn": "Xem Nhà Kế Tiếp ▶",
    "randomHouseBtn": "🎲 Xem Nhà Ngẫu Nhiên",
    "scrollPreviewTitle": "Danh Sách Nhà Theo Cấp Độ (Nhấp để xem ảnh)",
    "imageLockedBadge": "🔒 Truy cập trang để xem toàn bộ ảnh nhà",
    "enterHouseBtn": "Vào Ngôi Nhà Này Để Xem Ảnh 👉",
    "linkedNameBadge": "👤 Cư Dân Tiêu Biểu: {name}",
    "seoTitleWithName": "Ngôi Nhà Của {name}: {title} | MyHome AI Thẩm Định",
    "seoDescWithName": "Khám phá ngôi nhà dành cho {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "ngôi nhà cho {name}, nhà của {name}, gợi ý nhà cho {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Ngôi nhà cho {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Lưu & Chia sẻ ảnh",
    "photoDiaryLink": "Hôm Nay Ăn Gì?",
    "photoDiaryTitle": "Đi tới Hôm Nay Ăn Gì?",
    "foodLink": "Hôm Nay Ăn Gì?",
    "foodTitle": "Đi tới Hôm Nay Ăn Gì?",
    "langSelectLabel": "Đổi ngôn ngữ",
    "nameInputAria": "Nhập tên để thẩm định",
    "randomDiceTitle": "🎲 Tung xúc xắc chọn tên ngẫu nhiên",
    "randomDiceToast": "🎲 Đã thẩm định tên ngẫu nhiên '{name}'!",
    "refreshChipsTitle": "Làm mới tên gợi ý",
    "refreshChipsToast": "🔄 Đã làm mới danh sách tên thịnh hành!",
    "enterNameToast": "Vui lòng nhập tên của bạn!",
    "returnMyHouseText": "Quay lại nhà của tôi ({name} · Lv.{level})",
    "returnMyHouseDefault": "Quay lại nhà ban đầu của tôi",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Nhấp vào tiêu đề bất kỳ để vào trang và xem ảnh ngôi nhà.",
    "scrollSubtitleHigher": "Đang hiển thị các cấp cao hơn cấp hiện tại của bạn Lv.{current} (Lv.{start}~{max}). Nhấp 'Tất cả (0~999)' để xem từ Lv.0.",
    "scrollSubtitleAll": "Nhấp vào bất kỳ tiêu đề nào từ Lv.0 đến Lv.{max} để xem ảnh.",
    "scrollFilterAll": "Tất cả (0~999)",
    "scrollFilterBad": "💀 Xui xẻo (Lv.0~499)",
    "scrollFilterGood": "🌟 Đỉnh cao (Lv.500~999)",
    "scrollFilterReal": "🏛️ Thực tế 50%",
    "scrollFilterFiction": "🦄 Giả tưởng 50%",
    "previewEnterArrow": "Xem ảnh ›",
    "dockKeyboardHint": "💡 Dùng phím mũi tên (← / →) để chuyển cấp, hoặc phím Cách (Space) để xem ngẫu nhiên.",
    "loadingText": "Thẩm định viên AI đang tra cứu sổ đăng ký đa vũ trụ...",
    "loadingWithName": "Thẩm định viên AI đang xác minh hồ sơ đa vũ trụ cho [{name}]...",
    "tiers": {
      "1": "Hạng 01: Tận Cùng Đáy Vũ Trụ",
      "2": "Hạng 02: Phế Tích & Ngõ Hẻm",
      "3": "Hạng 03: Phế Liệu Kỳ Dị & Thùng Carton",
      "4": "Hạng 04: Nhà Vệ Sinh Vùng Sâu & Phóng Xạ",
      "5": "Hạng 05: Khu Phong Tỏa & Nhà Ngục",
      "6": "Hạng 06: Nơi Trú Ẩn Éo Le Trong Phim & Anime",
      "7": "Hạng 07: Nơi Trú Ẩn Di Động Nguy Hiểm",
      "8": "Hạng 08: Đầm Lầy & Vùng Ngập Nước",
      "9": "Hạng 09: Sa Mạc Cô Lập & Hang Băng",
      "10": "Hạng 10: Ngưỡng Cửa Thoát Hiểm",
      "11": "Hạng 11: Biệt Thự Nghỉ Dưỡng Khởi Đầu",
      "12": "Hạng 12: Lâu Đài Lịch Sử & Kỳ Quan Thế Giới",
      "13": "Hạng 13: Tuyệt Tác Kiến Trúc Pixar & Disney",
      "14": "Hạng 14: Penthouse Đô Thị Siêu Sang",
      "15": "Hạng 15: Thành Trì Phim Giả Tưởng & Văn Học",
      "16": "Hạng 16: 7 Kỳ Quan Thế Giới & Bí Cảnh",
      "17": "Hạng 17: Thành Phố Thông Minh & Siêu Du Thuyền",
      "18": "Hạng 18: Cung Điện Hoàng Kim Thần Thoại",
      "19": "Hạng 19: Trạm Quỹ Đạo & Thuộc Địa Không Gian",
      "20": "Hạng 20: Quả Cầu Dyson Siêu Việt Vũ Trụ"
    },
    "guide": {
      "sectionTitle": "🏛️ Cẩm Nang Khám Phá Nhà Đa Vũ Trụ",
      "badBadge": "Cấp 0 ~ 499",
      "badTitle": "💀 Ngôi Nhà Xui Xẻo Hài Hước",
      "badDesc": "Từ tầng hầm dung nham, thùng carton ướt mưa, chuồng chó quê đến nhà vệ sinh trong suốt—những không gian sống kỳ quặc và hài hước vượt xa trí tưởng tượng.",
      "goodBadge": "Cấp 500 ~ 999",
      "goodTitle": "🌟 Biệt Thự May Mắn Đỉnh Cao",
      "goodDesc": "Từ căn hộ hầm hạt nhân hạng sang, biệt thự vách đá của Iron Man, đỉnh Burj Khalifa, Trạm Vũ trụ Quốc tế đến Penthouse Đấng Sáng Tạo Đa Vũ Trụ.",
      "ruleBadge": "Xen Kẽ Từng Cấp",
      "ruleTitle": "🏛️ 50% Thực Tế ↔ 🦄 50% Giả Tưởng",
      "ruleDesc": "<strong>Cấp chẵn</strong> là các công trình kỳ lạ có thật trên Trái Đất, còn <strong>cấp lẻ</strong> là không gian giả tưởng từ phim ảnh, sci-fi và thần thoại đan xen chính xác từng cấp."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Cẩm Nang MyHome · Khám phá ngôi nhà phù hợp với bạn chỉ bằng tên gọi",
      "art1Title": "🏠 1. Chỉ cần nhập tên! Trắc nghiệm vui tìm ngôi nhà sinh ra để dành cho bạn",
      "art1P1": "Ngôi Nhà Phù Hợp Với Bạn (MyHome) là bài kiểm tra ghép đôi nhà ở thú vị, giúp bạn tìm ra ngay ngôi nhà định mệnh của mình chỉ bằng cách nhập tên — không cần đăng ký tài khoản hay điền bảng hỏi dài dòng. Hãy thử nhập tên của chính bạn, người thân, bạn bè, người yêu hay thần tượng của bạn! Dù là tiếng Việt, tiếng Anh hay bất kỳ ngôn ngữ nào, hệ thống đều phân tích giá trị ký tự độc nhất để ghép bạn với 1 trong 1.000 ngôi nhà kỳ lạ và độc đáo nhất đa vũ trụ.",
      "art1P2": "Chỉ cần khác một chữ cái hay một dấu câu, kết quả sẽ hoàn toàn thay đổi — từ Cấp 0 (Ngôi Nhà Xui Xẻo Hài Hước) đến Cấp 999 (Biệt Thự May Mắn Đỉnh Cao). Cùng một tên sẽ luôn ra kết quả giống nhau, vì vậy hãy thử tìm tên bạn bè và chia sẻ xem ai quay vào ô nhà thảm họa cười ra nước mắt, ai trúng penthouse triệu đô nhé!",
      "art2Title": "📐 2. Không có chung cư nhàm chán! 1.000 ngôi nhà độc lạ ngoài sức tưởng tượng",
      "art2P1": "Ở đây không có những căn hộ chung cư hộp diêm quen thuộc. Từ những ngôi nhà thảm họa dở khóc dở cười như thùng carton ướt mưa, nhà vệ sinh công cộng trong suốt, chuồng chó thôn quê, đến những bất động sản xa hoa như biệt thự vách đá Iron Man, Trạm Vũ trụ Quốc tế và penthouse dải ngân hà — 1.000 ngôi nhà sáng tạo đang chờ bạn khám phá.",
      "art2P2": "Đặc biệt, các cấp số chẵn (0, 2, 4...) là những công trình kiến trúc kỳ lạ có thật ngoài đời hoặc trong lịch sử, còn các cấp số lẻ (1, 3, 5...) là không gian giả tưởng trong phim ảnh, tiểu thuyết viễn tưởng và thần thoại. Tỷ lệ đan xen chuẩn xác 50:50 qua từng cấp độ mang đến cả sự hiểu biết lẫn tiếng cười sảng khoái.",
      "art3Title": "🛡️ 3. An toàn tuyệt đối: Không lưu trữ dữ liệu cá nhân",
      "art3P1": "MyHome không bao giờ lưu lại bất kỳ tên gọi hay lịch sử tìm kiếm nào của bạn trên máy chủ. Mọi kết quả đều được tính toán trực tiếp trên trình duyệt của bạn và biến mất ngay sau đó, giúp bạn hoàn toàn an tâm trải nghiệm.",
      "art3P2": "Năm xây dựng, giá trị ước tính, tính năng đặc biệt và lời nhận xét của thẩm định viên AI đều là nội dung giải trí hư cấu nhằm mang lại niềm vui và trí tưởng tượng phong phú. Hãy lưu lại tấm thẻ kết quả dạng ảnh và chia sẻ lên Instagram Story, TikTok hay Facebook để khoe với bạn bè ngay nhé!"
    },
    "footer": {
      "brand": "Ngôi Nhà Phù Hợp Với Bạn (MyHome)",
      "about": "Giới thiệu (About)",
      "contact": "Liên hệ (Contact)",
      "privacy": "Chính sách bảo mật (Privacy)",
      "terms": "Điều khoản dịch vụ (Terms)",
      "consent": "Cài đặt quyền riêng tư (Consent)",
      "desc": "Dịch vụ này là bài trắc nghiệm vui giúp bạn tìm ngôi nhà phù hợp nhất chỉ bằng cách nhập tên."
    },
    "shareModal": {
      "themeCert": "Cổ Điển",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Hoàng Hôn",
      "instaDirectBtn": "Chia Sẻ Trực Tiếp Lên Instagram Story",
      "savedToast": "📥 Đã lưu ảnh Story 9:16!",
      "instaDownloadedToast": "📸 Đã tải ảnh Story và sao chép liên kết!",
      "messengerCopiedToast": "💬 Đã sao chép liên kết chia sẻ!",
      "whatsappDirectBtn": "Chia Sẻ Qua WhatsApp",
      "whatsappOpenedToast": "🟢 Đã mở cửa sổ chia sẻ WhatsApp!",
      "tiktokDirectBtn": "Chia Sẻ Lên TikTok (Thẻ 9:16 & Liên Kết)",
      "tiktokDownloadedToast": "🎵 Đã tải ảnh Story 9:16 và sao chép liên kết! Hãy đăng lên TikTok kèm liên kết."
    }
  },
  "fr": {
    "brandHeader": "La Maison Qui Vous Convient",
    "brandSub": "Test amusant : trouvez la maison idéale rien qu'avec votre prénom · 1 000 maisons uniques",
    "searchPlaceholder": "Entrez votre nom (ex. Lucas, Emma, Steve...)",
    "searchBtn": "Trouver Ma Maison",
    "sampleLabel": "Noms Populaires :",
    "ownerTitle": "La maison qui correspond à {name}",
    "certificateTitle": "La Maison Qui Vous Convient",
    "zones": {
      "GOOD": "Maison Coup de Cœur",
      "BAD": "Maison Catastrophe"
    },
    "reality": {
      "REAL": "Architecture Réelle & Lieux Existants",
      "FICTION": "Lieux Fictifs, SF et Mythologiques"
    },
    "categories": {
      "TOILET": "Toilettes et Installations Insolites",
      "CLOSET": "Placards, Meubles et Casiers",
      "DOGHOUSE": "Niches, Habitats d'Animaux et Arbres à Chat",
      "BOX": "Boîtes en Carton, Colis et Récipients",
      "VEHICLE": "Voitures, Camping-cars, Trains et Sous-marins",
      "SPACESHIP": "Vaisseaux, Stations Spatiales et Bases Orbitales",
      "FICTION_MEDIA": "Habitations de Films, Romans et Anime",
      "MUSEUM_PUBLIC": "Musées Insolites, Prisons et Édifices Bizarres",
      "IMAGINARY_CITY": "Cités Imaginaires et Royaumes Miniatures",
      "EXTREME_NATURE": "Terres Extrêmes, Volcans, Abysses et Glaciers",
      "WEIRD_ARCH": "Merveilles Architecturales Insolites et Curiosités",
      "MULTIVERSE": "Hyperdimensions, Trous Noirs et Temples du Multivers",
      "PRISON_FACILITY": "Prisons, Cellules d’Isolement et Centres de Détention",
      "INDUSTRIAL_HAZARD": "Zones Industrielles à Risque et Radioactives",
      "RUINS_ABANDONED": "Ruines Abandonnées, Villes Fantômes et Bidonvilles",
      "MICRO_DWELLING": "Micro-Habitations, Cartons et Capsules",
      "UNDERGROUND_BUNKER": "Bunkers Souterrains, Abris et Catacombes",
      "ROYAL_PALACE": "Palais Royaux et Châteaux Historiques",
      "LUXURY_PENTHOUSE": "Monuments Mondiaux et Penthouses Ultra-Luxueux"
    },
    "specs": {
      "builtYearLabel": "Année de Construction",
      "estimatedValueLabel": "Valeur Estimée",
      "specialFeatureLabel": "Caractéristique Spéciale",
      "aiVerdictLabel": "Verdict de l'Expert IA",
      "tierLabel": "Palier",
      "levelLabel": "Niveau"
    },
    "tierTemplate": "Palier {tier} : {name}",
    "storyHeader": "\"La Maison Qui Correspond à {name}\"",
    "storyPhotoHint": "Choisissez un thème pour enregistrer ou partager",
    "storySpecTitle": "Spécifications Architecturales",
    "saveStoryBtn": "Enregistrer et partager l’image",
    "shareMobileBtn": "Partager sur Mobile",
    "copyUrlBtn": "Copier le Lien du Résultat",
    "copiedToast": "Lien copié dans le presse-papiers !",
    "prevHouseBtn": "◀ Maison Précédente",
    "nextHouseBtn": "Maison Suivante ▶",
    "randomHouseBtn": "🎲 Maison Aléatoire",
    "scrollPreviewTitle": "Liste des Maisons par Niveau (Cliquez pour voir la photo)",
    "imageLockedBadge": "🔒 Entrez sur la page pour dévoiler la photo",
    "enterHouseBtn": "Visiter cette maison et voir la photo 👉",
    "linkedNameBadge": "👤 Résident Vedette : {name}",
    "seoTitleWithName": "La Maison Idéale pour {name} : {title} | MyHome IA",
    "seoDescWithName": "Découvrez la maison de {name} : {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "maison pour {name}, maison de {name}, recommandation de maison pour {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Maison pour {name} : {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Enregistrer et partager l’image",
    "photoDiaryLink": "Quoi Manger Aujourd'hui ?",
    "photoDiaryTitle": "Aller à Quoi Manger Aujourd'hui ?",
    "foodLink": "Quoi Manger Aujourd'hui ?",
    "foodTitle": "Aller à Quoi Manger Aujourd'hui ?",
    "langSelectLabel": "Changer de langue",
    "nameInputAria": "Entrez un nom à évaluer",
    "randomDiceTitle": "🎲 Lancer le dé pour un nom aléatoire",
    "randomDiceToast": "🎲 Nom aléatoire '{name}' évalué !",
    "refreshChipsTitle": "Actualiser les noms suggérés",
    "refreshChipsToast": "🔄 Noms populaires actualisés !",
    "enterNameToast": "Veuillez entrer un nom !",
    "returnMyHouseText": "Retourner à ma maison ({name} · Lv.{level})",
    "returnMyHouseDefault": "Retourner à ma maison d’origine",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Cliquez sur un titre pour accéder à la page et révéler la photo.",
    "scrollSubtitleHigher": "Affichage des niveaux supérieurs à votre niveau actuel Lv.{current} (Lv.{start}~{max}). Cliquez sur « Tout (0~999) » pour voir dès le Lv.0.",
    "scrollSubtitleAll": "Cliquez sur un titre de Lv.0 à Lv.{max} pour voir la photo.",
    "scrollFilterAll": "Tout (0~999)",
    "scrollFilterBad": "💀 Catastrophe (Lv.0~499)",
    "scrollFilterGood": "🌟 Rêve (Lv.500~999)",
    "scrollFilterReal": "🏛️ Réel 50%",
    "scrollFilterFiction": "🦄 Fiction 50%",
    "previewEnterArrow": "Voir la photo ›",
    "dockKeyboardHint": "💡 Utilisez les flèches (← / →) pour naviguer, ou Espace pour une maison aléatoire.",
    "loadingText": "L’expert IA consulte le registre immobilier du multivers...",
    "loadingWithName": "L’expert IA vérifie le titre de propriété du multivers pour [{name}]...",
    "tiers": {
      "1": "Palier 01 : Le Fond Primordial",
      "2": "Palier 02 : Ruines et Ruelles Délabrées",
      "3": "Palier 03 : Ferraille Bizarre et Boîtes en Carton",
      "4": "Palier 04 : Latrines Extrêmes et Zones Radioactives",
      "5": "Palier 05 : Zones Confinées et Prisons",
      "6": "Palier 06 : Repaires Humiliants de Films et d’Anime",
      "7": "Palier 07 : Abris Mobiles Périlleux",
      "8": "Palier 08 : Marécages et Zones Inondées",
      "9": "Palier 09 : Déserts Isolés et Grottes de Glace",
      "10": "Palier 10 : Le Seuil du Chaos",
      "11": "Palier 11 : Chalets de Guérison Coup de Cœur",
      "12": "Palier 12 : Châteaux Historiques et Monuments Mondiaux",
      "13": "Palier 13 : Lieux Emblématiques Pixar et Disney",
      "14": "Palier 14 : Penthouses Urbains de Prestige",
      "15": "Palier 15 : Citadelles du Cinéma Fantastique et des Lettres",
      "16": "Palier 16 : Sept Merveilles du Monde et Sanctuaires Secrets",
      "17": "Palier 17 : Villes Intelligentes du Futur et Superyachts",
      "18": "Palier 18 : Palais Dorés des Mythes et Légendes",
      "19": "Palier 19 : Stations Orbitales et Colonies Sci-Fi",
      "20": "Palier 20 : Sphères de Dyson Transcendantales"
    },
    "guide": {
      "sectionTitle": "🏛️ Guide des Demeures du Multivers",
      "badBadge": "Niveaux 0 ~ 499",
      "badTitle": "💀 Maisons Catastrophe Absolue",
      "badDesc": "Des sous-sols de magma aux cartons trempés, niches pour chiens et toilettes publiques transparentes : des habitations absurdes et hilarantes.",
      "goodBadge": "Niveaux 500 ~ 999",
      "goodTitle": "🌟 Maisons Coup de Cœur Suprême",
      "goodDesc": "Des bunkers nucléaires de luxe et villas sur falaise au sommet du Burj Khalifa, à la Station Spatiale Internationale et aux Sphères de Dyson.",
      "ruleBadge": "Alternance à Chaque Niveau",
      "ruleTitle": "🏛️ 50% Réel ↔ 🦄 50% Fiction",
      "ruleDesc": "Les <strong>niveaux pairs</strong> présentent des architectures insolites bien réelles sur Terre, tandis que les <strong>niveaux impairs</strong> alternent avec des lieux fictifs de films, de SF et de mythologie."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Guide Officiel MyHome · Découvrez la maison qui vous convient grâce à votre prénom",
      "art1Title": "🏠 1. Entrez simplement un prénom ! Un test amusant pour trouver votre maison idéale",
      "art1P1": "La Maison Qui Vous Convient (MyHome) est un test d'affinité ludique qui vous permet de trouver instantanément votre logement idéal en tapant simplement votre prénom, sans inscription ni questionnaire fastidieux. Testez avec votre propre prénom, celui de vos proches, de vos amis ou de vos célébrités préférées ! Qu'il soit en français, anglais ou dans toute autre langue, chaque prénom est analysé selon ses caractéristiques uniques pour vous attribuer l'une des 1 000 demeures extraordinaires du multivers.",
      "art1P2": "Une seule lettre de différence transforme totalement votre résultat : du Niveau 0 (Maison Catastrophe Hilarante) au Niveau 999 (Maison Coup de Cœur Absolu). Le même nom donne toujours exactement le même résultat, alors comparez vos résultats entre amis pour voir qui hérite du logement le plus absurde ou de l'attique le plus somptueux !",
      "art2Title": "📐 2. Aucun appartement banal ! 1 000 demeures insolites",
      "art2P1": "Ici, aucun studio banal ou immeuble triste à l'horizon. De la maison catastrophe comique (carton de livraison trempé, toilettes publiques transparentes, niche de chien) au chef-d'œuvre de luxe (villa suspendue d'Iron Man, Station spatiale internationale, penthouse galactique), 1 000 demeures pleines d'imagination vous attendent.",
      "art2P2": "De plus, les niveaux pairs (0, 2, 4...) mettent en lumière des architectures insolites bien réelles sur Terre, tandis que les niveaux impairs (1, 3, 5...) alternent rigoureusement à 50/50 avec des lieux mythiques du cinéma, de la science-fiction et des légendes, alliant curiosité culturelle et pur divertissement.",
      "art3Title": "🛡️ 3. Sécurité et confidentialité : zéro donnée stockée",
      "art3P1": "MyHome ne stocke aucun prénom ni historique de recherche sur aucun serveur central. Tous les calculs s'effectuent en temps réel dans votre navigateur et s'effacent immédiatement, vous garantissant une utilisation 100 % confidentielle et sereine.",
      "art3P2": "L'année de construction, la valeur estimée, les fonctionnalités insolites et le verdict de l'expert IA sont des éléments humoristiques conçus pour stimuler votre imaginaire. Téléchargez votre carte en image et partagez-la fièrement en Story Instagram, sur TikTok ou par message !"
    },
    "footer": {
      "brand": "La Maison Qui Vous Convient (MyHome)",
      "about": "À propos (About)",
      "contact": "Contact",
      "privacy": "Confidentialité (Privacy)",
      "terms": "Conditions (Terms)",
      "consent": "Paramètres de confidentialité (Consent)",
      "desc": "Ce service est un test de divertissement qui trouve la maison qui vous correspond simplement en entrant votre prénom."
    },
    "shareModal": {
      "themeCert": "Classique",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Coucher de Soleil",
      "instaDirectBtn": "Partager directement en Story Instagram",
      "savedToast": "📥 Image Story 9:16 enregistrée !",
      "instaDownloadedToast": "📸 Story téléchargée et lien copié !",
      "messengerCopiedToast": "💬 Lien de partage copié !",
      "whatsappDirectBtn": "Partager sur WhatsApp",
      "whatsappOpenedToast": "🟢 Fenêtre WhatsApp ouverte !",
      "tiktokDirectBtn": "Partager sur TikTok (Carte 9:16 & Lien)",
      "tiktokDownloadedToast": "🎵 Story 9:16 téléchargée et lien copié ! Publiez-la sur TikTok avec le lien."
    }
  },
  "pt": {
    "brandHeader": "A Casa Ideal Para Você",
    "brandSub": "Teste divertido: descubra sua casa ideal só pelo nome · 1.000 casas únicas para combinar",
    "searchPlaceholder": "Digite seu nome (ex. Miguel, Helena, Steve...)",
    "searchBtn": "Encontrar Minha Casa",
    "sampleLabel": "Nomes em Alta:",
    "ownerTitle": "A casa que combina com {name}",
    "certificateTitle": "A Casa Ideal Para Você",
    "zones": {
      "GOOD": "Casa dos Sonhos",
      "BAD": "Casa do Fracasso"
    },
    "reality": {
      "REAL": "Arquitetura e Lugares Reais",
      "FICTION": "Lugares Fictícios, Sci-Fi e Mitológicos"
    },
    "categories": {
      "TOILET": "Banheiros e Instalações Sanitárias Inusitadas",
      "CLOSET": "Armários, Móveis e Guarda-Volumes",
      "DOGHOUSE": "Casinhas de Cachorro, Habitats e Arranhadores",
      "BOX": "Caixas de Papelão, Encomendas e Recipientes",
      "VEHICLE": "Carros, Trailers, Trens e Submarinos",
      "SPACESHIP": "Naves Espaciais, Estações e Bases Orbitais",
      "FICTION_MEDIA": "Casas de Filmes, Livros e Animes",
      "MUSEUM_PUBLIC": "Museus Curiosos, Prisões e Prédios Estranhos",
      "IMAGINARY_CITY": "Cidades Imaginárias e Reinos em Miniatura",
      "EXTREME_NATURE": "Terras Extremas, Vulcões, Abismos e Geleiras",
      "WEIRD_ARCH": "Maravilhas Arquitetônicas Estranhas e Marcos Curiosos",
      "MULTIVERSE": "Hiperdimensões, Buracos Negros e Templos Cósmicos",
      "PRISON_FACILITY": "Prisões, Solitárias e Centros de Detenção",
      "INDUSTRIAL_HAZARD": "Zonas de Risco Industrial e Radiação",
      "RUINS_ABANDONED": "Ruínas Abandonadas, Cidades Fantasmas e Favelas",
      "MICRO_DWELLING": "Micro-Habitações, Papelão e Quartos Cápsula",
      "UNDERGROUND_BUNKER": "Bunkers Subterrâneos, Abrigos e Catacumbas",
      "ROYAL_PALACE": "Palácios Reais e Castelos Históricos",
      "LUXURY_PENTHOUSE": "Marcos Mundiais e Penthouses Ultra-Luxuosos"
    },
    "specs": {
      "builtYearLabel": "Ano de Construção",
      "estimatedValueLabel": "Valor Estimado",
      "specialFeatureLabel": "Recurso Especial",
      "aiVerdictLabel": "Veredito do Avaliador IA",
      "tierLabel": "Tier",
      "levelLabel": "Nível"
    },
    "tierTemplate": "Nível {tier}: {name}",
    "storyHeader": "\"A Casa Que Combina Com {name}\"",
    "storyPhotoHint": "Escolha um tema para salvar ou compartilhar",
    "storySpecTitle": "Especificações Arquitetônicas",
    "saveStoryBtn": "Salvar e compartilhar imagem",
    "shareMobileBtn": "Compartilhar no Celular",
    "copyUrlBtn": "Copiar Link do Resultado",
    "copiedToast": "Link copiado para a área de transferência!",
    "prevHouseBtn": "◀ Casa Anterior",
    "nextHouseBtn": "Próxima Casa ▶",
    "randomHouseBtn": "🎲 Casa Aleatória",
    "scrollPreviewTitle": "Lista de Casas por Nível (Clique para ver a foto)",
    "imageLockedBadge": "🔒 Entre na página para revelar a foto da casa",
    "enterHouseBtn": "Entrar nesta casa e ver foto 👉",
    "linkedNameBadge": "👤 Morador em Destaque: {name}",
    "seoTitleWithName": "A Casa de {name}: {title} | MyHome IA Arquitetura",
    "seoDescWithName": "Descubra a casa de {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "casa para {name}, casa de {name}, recomendação de casa para {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Casa de {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Salvar e compartilhar imagem",
    "photoDiaryLink": "O Que Comer Hoje?",
    "photoDiaryTitle": "Ir para O Que Comer Hoje?",
    "foodLink": "O Que Comer Hoje?",
    "foodTitle": "Ir para O Que Comer Hoje?",
    "langSelectLabel": "Mudar idioma",
    "nameInputAria": "Digite um nome para avaliação",
    "randomDiceTitle": "🎲 Rolar dado para nome aleatório",
    "randomDiceToast": "🎲 Nome aleatório '{name}' avaliado!",
    "refreshChipsTitle": "Atualizar nomes sugeridos",
    "refreshChipsToast": "🔄 Nomes em alta atualizados!",
    "enterNameToast": "Por favor, digite um nome!",
    "returnMyHouseText": "Voltar para minha casa ({name} · Lv.{level})",
    "returnMyHouseDefault": "Voltar para minha casa original",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Clique em qualquer título abaixo para entrar na página e ver a foto.",
    "scrollSubtitleHigher": "Mostrando níveis superiores ao seu nível atual Lv.{current} (Lv.{start}~{max}). Clique em 'Tudo (0~999)' para ver a partir do Lv.0.",
    "scrollSubtitleAll": "Clique em qualquer título de Lv.0 a Lv.{max} para revelar a foto.",
    "scrollFilterAll": "Todos (0~999)",
    "scrollFilterBad": "💀 Fracasso (Lv.0~499)",
    "scrollFilterGood": "🌟 Sonho (Lv.500~999)",
    "scrollFilterReal": "🏛️ Real 50%",
    "scrollFilterFiction": "🦄 Ficção 50%",
    "previewEnterArrow": "Ver foto ›",
    "dockKeyboardHint": "💡 Use as setas (← / →) para navegar pelos níveis ou Espaço para casa aleatória.",
    "loadingText": "O avaliador IA está consultando o registro do multiverso...",
    "loadingWithName": "O avaliador IA está verificando a escritura de [{name}]...",
    "tiers": {
      "1": "Nível 01: O Fundo Primordial",
      "2": "Nível 02: Ruínas e Becos Abandonados",
      "3": "Nível 03: Sucata Bizarra e Caixas de Papelão",
      "4": "Nível 04: Banheiros Extremos e Zonas Radioativas",
      "5": "Nível 05: Zonas de Confinamento e Prisões",
      "6": "Nível 06: Esconderijos Humilhantes de Filmes e Animes",
      "7": "Nível 07: Abrigos Móveis Perigosos",
      "8": "Nível 08: Pântanos e Áreas Alagadas",
      "9": "Nível 09: Desertos Isolados e Cavernas de Gelo",
      "10": "Nível 10: No Limiar do Desastre",
      "11": "Nível 11: Chalés Relaxantes de Entrada",
      "12": "Nível 12: Castelos Históricos e Marcos Mundiais",
      "13": "Nível 13: Cenários Icônicos da Pixar e Disney",
      "14": "Nível 14: Penthouses Urbanos de Alto Padrão",
      "15": "Nível 15: Cidadelas de Filmes de Fantasia e Literatura",
      "16": "Nível 16: Sete Maravilhas do Mundo e Refúgios Secretos",
      "17": "Nível 17: Cidades Inteligentes do Futuro e Superiates",
      "18": "Nível 18: Palácios Dourados de Mitos e Lendas",
      "19": "Nível 19: Estações Orbitais e Colônias Sci-Fi",
      "20": "Nível 20: Esferas de Dyson Transcendentais"
    },
    "guide": {
      "sectionTitle": "🏛️ Guia de Casas do Multiverso",
      "badBadge": "Níveis 0 ~ 499",
      "badTitle": "💀 Casas do Fracasso Total",
      "badDesc": "De porões de magma e caixas de papelão molhadas a casinhas de cachorro e banheiros públicos transparentes—moradias bizarras e hilárias.",
      "goodBadge": "Níveis 500 ~ 999",
      "goodTitle": "🌟 Casas dos Sonhos Absolutos",
      "goodDesc": "De condomínios em silos nucleares e mansões na falésia ao topo do Burj Khalifa, Estação Espacial Internacional e Esferas de Dyson.",
      "ruleBadge": "Alternância a Cada 1 Nível",
      "ruleTitle": "🏛️ 50% Real ↔ 🦄 50% Ficção",
      "ruleDesc": "<strong>Níveis pares</strong> trazem arquiteturas bizarras que realmente existem na Terra, enquanto <strong>níveis ímpares</strong> alternam com espaços fictícios do cinema, sci-fi e mitologia."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Guia Oficial MyHome · Descubra a casa ideal para você apenas com o seu nome",
      "art1Title": "🏠 1. Só digitar o nome! O teste divertido para encontrar sua casa ideal",
      "art1P1": "A Casa Ideal Para Você (MyHome) é um teste descontraído de combinação onde você descobre na hora a residência perfeita para você apenas digitando seu nome — sem cadastros chatos nem formulários longos. Experimente com o seu nome, de amigos, familiares ou do seu artista favorito! Seja em português, inglês ou outro idioma, cada nome é analisado pelo seu valor único para encontrar a combinação perfeita entre 1.000 casas extraordinárias.",
      "art1P2": "A diferença de uma única letra muda completamente o seu destino: do Nível 0 (Casa do Fracasso Cômico) ao Nível 999 (Casa dos Sonhos Absoluta). O mesmo nome sempre resulta na mesma casa de forma determinística, então pesquise o nome dos seus amigos e compartilhe para ver quem tira a casa mais engraçada ou a cobertura mais luxuosa!",
      "art2Title": "📐 2. Nada de apartamentos sem graça! 1.000 moradias surpreendentes",
      "art2P1": "Aqui não existem prédios genéricos nem quitinetes sem graça. De moradias hilárias como uma caixa de papelão ensopada pela chuva, um banheiro público transparente e uma casinha de cachorro rústica, até palácios dos sonhos como a mansão no penhasco do Homem de Ferro, a Estação Espacial Internacional e uma cobertura intergaláctica: são 1.000 casas criativas feitas para divertir.",
      "art2P2": "Além disso, os níveis pares (0, 2, 4...) trazem arquiteturas inacreditáveis que realmente existem ou existiram na Terra, enquanto os níveis ímpares (1, 3, 5...) trazem locais icônicos do cinema, ficção científica e mitologia. A alternância perfeita de 50:50 a cada nível garante diversão e curiosidade garantidas.",
      "art3Title": "🛡️ 3. Seguro e privado: nenhum dado pessoal é armazenado",
      "art3P1": "O MyHome não salva nenhum nome ou histórico de busca em servidores ou bancos de dados. Todos os cálculos acontecem instantaneamente na memória do seu navegador e somem na hora, para que você possa se divertir com total tranquilidade.",
      "art3P2": "O ano de construção, valor estimado, recursos especiais e o veredito do avaliador IA são conteúdos criativos feitos para arrancar risadas e atiçar a imaginação. Salve o seu cartão como imagem e compartilhe nos Stories do Instagram, TikTok ou WhatsApp para mostrar sua nova casa!"
    },
    "footer": {
      "brand": "A Casa Ideal Para Você (MyHome)",
      "about": "Sobre (About)",
      "contact": "Contato (Contact)",
      "privacy": "Privacidade (Privacy)",
      "terms": "Termos de Uso (Terms)",
      "consent": "Configurações de Privacidade (Consent)",
      "desc": "Este serviço é um teste divertido que descobre a casa que combina com você apenas digitando o seu nome."
    },
    "shareModal": {
      "themeCert": "Clássico",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Pôr do Sol",
      "instaDirectBtn": "Compartilhar Direto no Instagram Story",
      "savedToast": "📥 Imagem 9:16 do Story salva!",
      "instaDownloadedToast": "📸 Story baixado e link copiado!",
      "messengerCopiedToast": "💬 Link copiado para compartilhar!",
      "whatsappDirectBtn": "Compartilhar no WhatsApp",
      "whatsappOpenedToast": "🟢 Janela do WhatsApp aberta!",
      "tiktokDirectBtn": "Compartilhar no TikTok (Cartão 9:16 e link)",
      "tiktokDownloadedToast": "🎵 Story 9:16 baixado e link copiado! Publique no TikTok com o link."
    }
  },
  "es": {
    "brandHeader": "La Casa Que Va Contigo",
    "brandSub": "Test divertido: descubre la casa que va contigo solo con tu nombre · 1.000 casas únicas",
    "searchPlaceholder": "Introduce tu nombre (ej. Mateo, Sofía, Steve...)",
    "searchBtn": "Buscar Mi Casa",
    "sampleLabel": "Nombres Populares:",
    "ownerTitle": "La casa ideal para {name}",
    "certificateTitle": "La Casa Que Va Contigo",
    "zones": {
      "GOOD": "Casa de Ensueño",
      "BAD": "Casa Desastrosa"
    },
    "reality": {
      "REAL": "Arquitectura y Lugares Reales",
      "FICTION": "Lugares Ficticios, Ciencia Ficción y Míticos"
    },
    "categories": {
      "TOILET": "Baños e Instalaciones Insólitas",
      "CLOSET": "Armarios, Muebles y Taquillas",
      "DOGHOUSE": "Casas de Perro, Hábitats y Torres de Gato",
      "BOX": "Cajas de Cartón, Paquetes y Contenedores",
      "VEHICLE": "Coches, Autocaravanas, Trenes y Submarinos",
      "SPACESHIP": "Naves Espaciales, Estaciones y Bases Orbitales",
      "FICTION_MEDIA": "Espacios de Películas, Novelas y Anime",
      "MUSEUM_PUBLIC": "Museos Extraños, Prisiones y Edificios Curiosos",
      "IMAGINARY_CITY": "Ciudades Imaginarias y Reinos en Miniatura",
      "EXTREME_NATURE": "Tierras Extremas, Volcanes, Abismos y Glaciares",
      "WEIRD_ARCH": "Maravillas Arquitectónicas Curiosas y Monumentos Raros",
      "MULTIVERSE": "Hiperdimensiones, Agujeros Negros y Templos del Multiverso",
      "PRISON_FACILITY": "Prisiones, Celdas de Aislamiento y Centros de Detención",
      "INDUSTRIAL_HAZARD": "Zonas de Riesgo Industrial y Radiación",
      "RUINS_ABANDONED": "Ruinas Abandonadas, Pueblos Fantasma y Barrios Marginales",
      "MICRO_DWELLING": "Microviviendas, Cajas de Cartón y Cápsulas",
      "UNDERGROUND_BUNKER": "Búnkeres Subterráneos, Refugios y Catacumbas",
      "ROYAL_PALACE": "Palacios Reales y Castillos Históricos",
      "LUXURY_PENTHOUSE": "Monumentos Mundiales y Áticos de Ultralujo"
    },
    "specs": {
      "builtYearLabel": "Año de Construcción",
      "estimatedValueLabel": "Valor Estimado",
      "specialFeatureLabel": "Característica Especial",
      "aiVerdictLabel": "Veredicto del Tasador IA",
      "tierLabel": "Tier",
      "levelLabel": "Nivel"
    },
    "tierTemplate": "Nivel {tier}: {name}",
    "storyHeader": "\"La Casa Que Va Con {name}\"",
    "storyPhotoHint": "Elige un tema para guardar o compartir tu tarjeta",
    "storySpecTitle": "Especificaciones Arquitectónicas",
    "saveStoryBtn": "Guardar y compartir imagen",
    "shareMobileBtn": "Compartir en Móvil",
    "copyUrlBtn": "Copiar Enlace",
    "copiedToast": "¡Enlace copiado al portapapeles!",
    "prevHouseBtn": "◀ Casa Anterior",
    "nextHouseBtn": "Siguiente Casa ▶",
    "randomHouseBtn": "🎲 Casa Aleatoria",
    "scrollPreviewTitle": "Lista de Casas por Nivel (Clic para ver la foto)",
    "imageLockedBadge": "🔒 Entra en la página para descubrir la foto de la casa",
    "enterHouseBtn": "Entrar en esta casa y ver foto 👉",
    "linkedNameBadge": "👤 Residente Destacado: {name}",
    "seoTitleWithName": "La Casa de {name}: {title} | MyHome IA Tasación",
    "seoDescWithName": "Descubre la casa de {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "casa para {name}, casa de {name}, recomendación de casa para {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Casa para {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Guardar y compartir imagen",
    "photoDiaryLink": "¿Qué Comer Hoy?",
    "photoDiaryTitle": "Ir a ¿Qué Comer Hoy?",
    "foodLink": "¿Qué Comer Hoy?",
    "foodTitle": "Ir a ¿Qué Comer Hoy?",
    "langSelectLabel": "Cambiar idioma",
    "nameInputAria": "Introduce un nombre para tasar",
    "randomDiceTitle": "🎲 Tirar el dado para un nombre aleatorio",
    "randomDiceToast": "🎲 ¡Nombre aleatorio '{name}' tasado!",
    "refreshChipsTitle": "Actualizar nombres sugeridos",
    "refreshChipsToast": "🔄 ¡Nombres populares actualizados!",
    "enterNameToast": "¡Por favor, introduce un nombre!",
    "returnMyHouseText": "Volver a mi casa ({name} · Lv.{level})",
    "returnMyHouseDefault": "Volver a mi casa original",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Haz clic en cualquier título para entrar en la página y ver la foto.",
    "scrollSubtitleHigher": "Mostrando niveles superiores a tu nivel actual Lv.{current} (Lv.{start}~{max}). Pulsa 'Todo (0~999)' para ver desde el Lv.0.",
    "scrollSubtitleAll": "Haz clic en cualquier título de Lv.0 a Lv.{max} para ver la foto.",
    "scrollFilterAll": "Todos (0~999)",
    "scrollFilterBad": "💀 Desastre (Lv.0~499)",
    "scrollFilterGood": "🌟 Ensueño (Lv.500~999)",
    "scrollFilterReal": "🏛️ Real 50%",
    "scrollFilterFiction": "🦄 Ficción 50%",
    "previewEnterArrow": "Ver foto ›",
    "dockKeyboardHint": "💡 Usa las flechas (← / →) para cambiar de nivel o Espacio para una casa aleatoria.",
    "loadingText": "El tasador IA está consultando el registro del multiverso...",
    "loadingWithName": "El tasador IA está verificando la escritura de [{name}]...",
    "tiers": {
      "1": "Nivel 01: El Fondo Primordial",
      "2": "Nivel 02: Ruinas y Callejones Abandonados",
      "3": "Nivel 03: Chatarra Extraña y Cajas de Cartón",
      "4": "Nivel 04: Letrinas Extremas y Radiación",
      "5": "Nivel 05: Zonas de Confinamiento y Prisiones",
      "6": "Nivel 06: Guaridas Humillantes de Cine y Anime",
      "7": "Nivel 07: Refugios Móviles Peligrosos",
      "8": "Nivel 08: Pantanos y Zonas Inundadas",
      "9": "Nivel 09: Desiertos Aislados y Cuevas de Hielo",
      "10": "Nivel 10: Al Borde del Desastre",
      "11": "Nivel 11: Chalets Relajantes de Entrada",
      "12": "Nivel 12: Castillos Históricos y Monumentos Mundiales",
      "13": "Nivel 13: Escenarios Icónicos de Pixar y Disney",
      "14": "Nivel 14: Áticos Urbanos de Élite Mundial",
      "15": "Nivel 15: Ciudadelas de Cine Fantástico y Literatura",
      "16": "Nivel 16: Siete Maravillas del Mundo y Santuarios",
      "17": "Nivel 17: Ciudades Inteligentes del Futuro y Superyates",
      "18": "Nivel 18: Palacios Dorados de Mitos y Leyendas",
      "19": "Nivel 19: Estaciones Orbitales y Colonias Sci-Fi",
      "20": "Nivel 20: Esferas de Dyson Trascendentales"
    },
    "guide": {
      "sectionTitle": "🏛️ Guía de Casas del Multiverso",
      "badBadge": "Niveles 0 ~ 499",
      "badTitle": "💀 Casas del Fracaso Cómico",
      "badDesc": "Desde sótanos de magma y cajas de cartón mojadas hasta casetas de perro y baños públicos transparentes: viviendas absurdas y divertidísimas.",
      "goodBadge": "Niveles 500 ~ 999",
      "goodTitle": "🌟 Casas de Ensueño Máximo",
      "goodDesc": "Desde búnkeres nucleares de lujo y mansiones en acantilados hasta la cima del Burj Khalifa, la Estación Espacial Internacional y Esferas de Dyson.",
      "ruleBadge": "Alternancia en Cada Nivel",
      "ruleTitle": "🏛️ 50% Real ↔ 🦄 50% Ficción",
      "ruleDesc": "Los <strong>niveles pares</strong> muestran arquitecturas extraordinarias que existen realmente en la Tierra, mientras que los <strong>niveles impares</strong> alternan con lugares ficticios del cine, ciencia ficción y mitología."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Guía Oficial de MyHome · Descubre la casa ideal según tu nombre",
      "art1Title": "🏠 1. ¡Solo escribe tu nombre! Un divertido test para encontrar tu casa ideal",
      "art1P1": "La Casa Que Va Contigo (MyHome) es un entretenido test de compatibilidad inmobiliaria donde puedes descubrir al instante qué vivienda encaja contigo con solo introducir tu nombre, sin registros molestos ni cuestionarios. ¡Prueba con tu propio nombre, el de tus amigos, familiares, pareja o tu celebridad favorita! Ya sea en español, inglés o cualquier idioma, el sistema analiza el valor único de cada nombre para emparejarte con una de las 1.000 viviendas más insólitas del multiverso.",
      "art1P2": "Un solo carácter de diferencia cambia por completo tu destino: desde el Nivel 0 (Casa del Fracaso Cómico) hasta el Nivel 999 (Casa de Ensueño Máxima). El mismo nombre siempre genera la misma casa de forma determinista, así que busca los nombres de tus amigos y comparte los resultados para ver quién consigue el rincón más disparatado o el ático más lujoso.",
      "art2Title": "📐 2. ¡Cero apartamentos aburridos! 1.000 viviendas extraordinarias",
      "art2P1": "Aquí no encontrarás bloques de pisos monótonos ni apartamentos convencionales. Te esperan 1.000 casas originales: desde fracasos hilarantes como una caja de cartón empapada por la lluvia, un baño público transparente o una caseta de perro, hasta casas de ensueño como la mansión en el acantilado de Iron Man, la Estación Espacial Internacional o un ático intergaláctico.",
      "art2P2": "Además, los niveles pares (0, 2, 4...) presentan construcciones insólitas que existen o existieron realmente en la Tierra, mientras que los niveles impares (1, 3, 5...) alternan paso a paso con espacios imaginarios del cine, novelas de ciencia ficción y mitología, garantizando entretenimiento y curiosidad al 50:50.",
      "art3Title": "🛡️ 3. Máxima privacidad: ningún dato personal se almacena",
      "art3P1": "MyHome no guarda ningún nombre ni historial de búsqueda en servidores centrales. Todos los resultados se calculan al instante en la memoria de tu navegador y desaparecen de inmediato, para que disfrutes del test con total tranquilidad.",
      "art3P2": "El año de construcción, el valor estimado, las características especiales y el veredicto del tasador IA son contenidos puramente recreativos creados para sacarte una sonrisa. ¡Guarda tu tarjeta como imagen y compártela en tus historias de Instagram, TikTok o WhatsApp para presumir de casa!"
    },
    "footer": {
      "brand": "La Casa Que Va Contigo (MyHome)",
      "about": "Acerca de (About)",
      "contact": "Contacto (Contact)",
      "privacy": "Privacidad (Privacy)",
      "terms": "Términos (Terms)",
      "consent": "Configuración de Privacidad (Consent)",
      "desc": "Este servicio es un entretenido test para descubrir tu casa ideal simplemente ingresando tu nombre."
    },
    "shareModal": {
      "themeCert": "Clásico",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Atardecer",
      "instaDirectBtn": "Compartir Directamente en Instagram Story",
      "savedToast": "📥 ¡Imagen de Story 9:16 guardada!",
      "instaDownloadedToast": "📸 ¡Story descargada y enlace copiado!",
      "messengerCopiedToast": "💬 ¡Enlace copiado para compartir!",
      "whatsappDirectBtn": "Compartir por WhatsApp",
      "whatsappOpenedToast": "🟢 ¡Ventana de WhatsApp abierta!",
      "tiktokDirectBtn": "Compartir en TikTok (Tarjeta 9:16 y enlace)",
      "tiktokDownloadedToast": "🎵 ¡Story 9:16 descargada y enlace copiado! Súbela a TikTok con el enlace."
    }
  },
  "id": {
    "brandHeader": "Rumah Yang Cocok Untuk Anda",
    "brandSub": "Tes seru temukan rumah yang cocok hanya dengan mengetik nama · 1.000 pilihan rumah unik",
    "searchPlaceholder": "Masukkan nama Anda (mis. Budi, Siti, Steve...)",
    "searchBtn": "Cari Rumah Saya",
    "sampleLabel": "Nama Populer:",
    "ownerTitle": "Rumah yang cocok untuk {name}",
    "certificateTitle": "Rumah Yang Cocok Untuk Anda",
    "zones": {
      "GOOD": "Rumah Hoki Impian",
      "BAD": "Rumah Apes Ekstrem"
    },
    "reality": {
      "REAL": "Arsitektur & Lokasi Nyata",
      "FICTION": "Tempat Fiksi, Fiksi Ilmiah & Mitologi"
    },
    "categories": {
      "TOILET": "Toilet & Fasilitas Sanitasi Aneh Dunia",
      "CLOSET": "Lemari, Furnitur & Loker Koin",
      "DOGHOUSE": "Kandang Anjing, Habitat Hewan & Cat Tower",
      "BOX": "Kardus, Kotak Paket & Wadah",
      "VEHICLE": "Mobil, Campervan, Kereta Api & Kapal Selam",
      "SPACESHIP": "Pesawat Antariksa, Stasiun & Pangkalan Orbit",
      "FICTION_MEDIA": "Hunian Film, Novel & Anime",
      "MUSEUM_PUBLIC": "Museum Unik, Penjara & Bangunan Aneh",
      "IMAGINARY_CITY": "Kota Khayalan & Kerajaan Miniatur",
      "EXTREME_NATURE": "Alam Ekstrem, Gunung Berapi, Laut Dalam & Gletser",
      "WEIRD_ARCH": "Arsitektur Unik & Bangunan Monumental Ganjil",
      "MULTIVERSE": "Hiperdimensi, Lubang Hitam & Kuil Multiversum",
      "PRISON_FACILITY": "Penjara, Sel Isolasi & Fasilitas Tahanan",
      "INDUSTRIAL_HAZARD": "Zona Bahaya Industri & Radiasi",
      "RUINS_ABANDONED": "Reruntuhan Terbengkalai, Kota Hantu & Permukiman Kumuh",
      "MICRO_DWELLING": "Hunian Mikro, Kardus & Kamar Kapsul",
      "UNDERGROUND_BUNKER": "Bunker Bawah Tanah, Perlindungan & Katakombe",
      "ROYAL_PALACE": "Istana Kerajaan & Kastil Bersejarah",
      "LUXURY_PENTHOUSE": "Landmark Dunia & Penthouse Super Mewah"
    },
    "specs": {
      "builtYearLabel": "Tahun Dibangun",
      "estimatedValueLabel": "Estimasi Nilai",
      "specialFeatureLabel": "Fitur Unggulan",
      "aiVerdictLabel": "Putusan Penilai AI",
      "tierLabel": "Tier",
      "levelLabel": "Level"
    },
    "tierTemplate": "Tingkat {tier}: {name}",
    "storyHeader": "\"Rumah Yang Cocok Untuk {name}\"",
    "storyPhotoHint": "Pilih tema untuk menyimpan atau membagikan kartu",
    "storySpecTitle": "Spesifikasi Arsitektur",
    "saveStoryBtn": "Simpan & Bagikan Gambar",
    "shareMobileBtn": "Bagikan Lewat Ponsel",
    "copyUrlBtn": "Salin Tautan Hasil",
    "copiedToast": "Tautan disalin ke papan klip!",
    "prevHouseBtn": "◀ Rumah Sebelumnya",
    "nextHouseBtn": "Rumah Selanjutnya ▶",
    "randomHouseBtn": "🎲 Rumah Acak",
    "scrollPreviewTitle": "Daftar Rumah Berdasarkan Level (Klik untuk melihat foto)",
    "imageLockedBadge": "🔒 Masuk ke halaman untuk melihat foto rumah",
    "enterHouseBtn": "Masuk ke rumah ini & lihat foto 👉",
    "linkedNameBadge": "👤 Penghuni Unggulan: {name}",
    "seoTitleWithName": "Rumah Yang Cocok Untuk {name}: {title} | MyHome AI",
    "seoDescWithName": "Temukan rumah takdir untuk {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "rumah untuk {name}, rumah {name}, rekomendasi rumah {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Rumah untuk {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Simpan & Bagikan Gambar",
    "photoDiaryLink": "Makan Apa Hari Ini?",
    "photoDiaryTitle": "Buka Makan Apa Hari Ini?",
    "foodLink": "Makan Apa Hari Ini?",
    "foodTitle": "Buka Makan Apa Hari Ini?",
    "langSelectLabel": "Ubah bahasa",
    "nameInputAria": "Masukkan nama untuk dinilai",
    "randomDiceTitle": "🎲 Lempar dadu untuk nama acak",
    "randomDiceToast": "🎲 Nama acak '{name}' selesai dinilai!",
    "refreshChipsTitle": "Segarkan nama rekomendasi",
    "refreshChipsToast": "🔄 Nama populer telah diperbarui!",
    "enterNameToast": "Silakan masukkan nama!",
    "returnMyHouseText": "Kembali ke Rumah Saya ({name} · Lv.{level})",
    "returnMyHouseDefault": "Kembali ke Rumah Asli Saya",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Klik judul rumah mana pun untuk masuk ke halaman dan melihat fotonya.",
    "scrollSubtitleHigher": "Menampilkan level yang lebih tinggi dari level Anda saat ini Lv.{current} (Lv.{start}~{max}). Klik 'Semua (0~999)' untuk melihat mulai dari Lv.0.",
    "scrollSubtitleAll": "Klik judul dari Lv.0 hingga Lv.{max} untuk melihat foto rumah.",
    "scrollFilterAll": "Semua (0~999)",
    "scrollFilterBad": "💀 Apes (Lv.0~499)",
    "scrollFilterGood": "🌟 Impian (Lv.500~999)",
    "scrollFilterReal": "🏛️ Nyata 50%",
    "scrollFilterFiction": "🦄 Fiksi 50%",
    "previewEnterArrow": "Lihat foto ›",
    "dockKeyboardHint": "💡 Gunakan tombol panah (← / →) untuk pindah level, atau Spasi untuk rumah acak.",
    "loadingText": "Penilai AI sedang memeriksa registri properti multiversum...",
    "loadingWithName": "Penilai AI sedang memverifikasi akta multiversum untuk [{name}]...",
    "tiers": {
      "1": "Tingkat 01: Dasar Bumi Purba",
      "2": "Tingkat 02: Reruntuhan & Gang Kumuh",
      "3": "Tingkat 03: Barang Rongsokan & Kotak Kardus",
      "4": "Tingkat 04: Toilet Pelosok Ekstrem & Radiasi",
      "5": "Tingkat 05: Area Terlarang & Penjara",
      "6": "Tingkat 06: Markas Konyol di Film & Anime",
      "7": "Tingkat 07: Tempat Berlindung Bergerak Berbahaya",
      "8": "Tingkat 08: Rawa & Area Banjir",
      "9": "Tingkat 09: Gurun Terpencil & Gua Es",
      "10": "Tingkat 10: Ambang Batas Kesialan",
      "11": "Tingkat 11: Chalet Penyembuhan Impian",
      "12": "Tingkat 12: Kastil Bersejarah & Landmark Dunia",
      "13": "Tingkat 13: Lokasi Ikonik Pixar & Disney",
      "14": "Tingkat 14: Penthouse Kota Kelas Dunia",
      "15": "Tingkat 15: Benteng Film Fantasi & Sastra",
      "16": "Tingkat 16: Tujuh Keajaiban Dunia & Surga Tersembunyi",
      "17": "Tingkat 17: Kota Pintar Masa Depan & Superyacht",
      "18": "Tingkat 18: Istana Emas Mitologi & Legenda",
      "19": "Tingkat 19: Stasiun Orbit & Koloni Sci-Fi",
      "20": "Tingkat 20: Bola Dyson Transendental"
    },
    "guide": {
      "sectionTitle": "🏛️ Panduan Rumah Multiversum",
      "badBadge": "Level 0 ~ 499",
      "badTitle": "💀 Rumah Apes Ekstrem",
      "badDesc": "Mulai dari ruang bawah tanah magma, kardus paket basah, kandang anjing hingga toilet umum transparan—kumpulan hunian konyol dan mengocok perut.",
      "goodBadge": "Level 500 ~ 999",
      "goodTitle": "🌟 Rumah Impian Megah",
      "goodDesc": "Mulai dari kondominium silo nuklir mewah, vila tebing Iron Man, puncak Burj Khalifa, Stasiun Luar Angkasa Internasional hingga Penthouse Pencipta Multiversum.",
      "ruleBadge": "Selang-Seling Tiap 1 Level",
      "ruleTitle": "🏛️ 50% Nyata ↔ 🦄 50% Fiksi",
      "ruleDesc": "<strong>Level genap</strong> menampilkan bangunan unik yang benar-benar ada di Bumi, sedangkan <strong>level ganjil</strong> bergantian dengan tempat fiksi dari film, sci-fi, dan mitologi."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Panduan Resmi MyHome · Temukan rumah yang cocok untuk Anda hanya dengan nama",
      "art1Title": "🏠 1. Cukup ketik nama! Tes seru untuk menemukan rumah yang cocok untukmu",
      "art1P1": "Rumah Yang Cocok Untuk Anda (MyHome) adalah tes kecocokan rumah santai dan seru di mana kamu bisa langsung mengetahui tempat tinggal yang cocok hanya dengan mengetik nama—tanpa perlu daftar akun atau mengisi kuesioner panjang. Coba ketik namamu sendiri, nama teman, keluarga, pasangan, atau idola favoritmu! Baik dalam bahasa Indonesia, Inggris, maupun bahasa lainnya, setiap nama dianalisis berdasarkan karakter uniknya untuk dipasangkan dengan satu dari 1.000 rumah luar biasa di multisemesta.",
      "art1P2": "Beda satu huruf saja bisa mengubah nasib rumahmu secara drastis—mulai dari Level 0 (Rumah Apes Ekstrem yang bikin ngakak) hingga Level 999 (Rumah Hoki Impian super mewah). Nama yang sama akan selalu menghasilkan rumah yang sama, jadi ajak teman-temanmu mencari nama mereka dan bandingkan siapa yang dapat tempat paling apes atau penthouse paling sultan!",
      "art2Title": "📐 2. Nggak ada apartemen biasa yang membosankan! 1.000 rumah unik di luar nalar",
      "art2P1": "Kamu nggak akan menemukan rumah petak atau apartemen biasa di sini. Mulai dari hunian apes yang lucu seperti kardus paket kehujanan, toilet umum transparan, kandang anjing desa, hingga hunian impian luar biasa seperti mansion tebing Iron Man, Stasiun Luar Angkasa Internasional, dan penthouse galaksi—tersedia 1.000 rumah unik penuh imajinasi.",
      "art2P2": "Selain itu, level genap (0, 2, 4...) menampilkan arsitektur ajaib yang benar-benar ada di dunia nyata, sedangkan level ganjil (1, 3, 5...) menyajikan tempat tinggal imajinatif dari film, novel fiksi ilmiah, dan mitologi. Semuanya berselang-seling rapi 50:50 di setiap level untuk menghadirkan rasa ingin tahu sekaligus tawa.",
      "art3Title": "🛡️ 3. Aman tanpa simpan data pribadi: Tes murni untuk bersenang-senang",
      "art3P1": "MyHome sama sekali tidak menyimpan nama atau riwayat pencarian apa pun di server pusat. Semua hasil dihitung seketika di memori browser perangkatmu dan langsung terhapus, sehingga siapa pun bisa bermain dengan aman dan nyaman tanpa khawatir privasi.",
      "art3P2": "Tahun pembangunan, estimasi nilai, fitur unik, dan penilaian AI yang tertera semuanya adalah konten hiburan yang dibuat untuk memicu tawa dan imajinasi. Simpan kartu hasilmu sebagai gambar dan pamerkan ke teman-teman di Instagram Story, TikTok, atau grup WhatsApp!"
    },
    "footer": {
      "brand": "Rumah Yang Cocok Untuk Anda (MyHome)",
      "about": "Tentang (About)",
      "contact": "Kontak (Contact)",
      "privacy": "Kebijakan Privasi (Privacy)",
      "terms": "Ketentuan Layanan (Terms)",
      "consent": "Pengaturan Privasi (Consent)",
      "desc": "Layanan ini adalah tes hiburan seru untuk menemukan rumah yang cocok hanya dengan mengetik nama."
    },
    "shareModal": {
      "themeCert": "Klasik",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Senja",
      "instaDirectBtn": "Bagikan Langsung ke Instagram Story",
      "savedToast": "📥 Gambar Story 9:16 berhasil disimpan!",
      "instaDownloadedToast": "📸 Story diunduh dan tautan disalin!",
      "messengerCopiedToast": "💬 Tautan berbagi berhasil disalin!",
      "whatsappDirectBtn": "Bagikan ke WhatsApp",
      "whatsappOpenedToast": "🟢 Jendela berbagi WhatsApp telah dibuka!",
      "tiktokDirectBtn": "Bagikan ke TikTok (Kartu 9:16 & Tautan)",
      "tiktokDownloadedToast": "🎵 Story 9:16 diunduh dan tautan disalin! Unggah ke TikTok dengan stiker tautan."
    }
  },
  "ru": {
    "brandHeader": "Дом, который подходит именно вам",
    "brandSub": "Веселый тест: узнайте свой идеальный дом по имени · 1 000 уникальных домов",
    "searchPlaceholder": "Введите имя (напр. Александр, София, Стив...)",
    "searchBtn": "Найти мой дом",
    "sampleLabel": "Популярные имена:",
    "ownerTitle": "Дом, подходящий для {name}",
    "certificateTitle": "Дом, который подходит именно вам",
    "zones": {
      "GOOD": "Дом Мечты (Джекпот)",
      "BAD": "Фейл-Хаус (Провал)"
    },
    "reality": {
      "REAL": "Реально существующие здания и места",
      "FICTION": "Вымышленные, научно-фантастические и мифические места"
    },
    "categories": {
      "TOILET": "Причудливые туалеты и санитарные сооружения",
      "CLOSET": "Шкафы, мебель и ячейки хранения",
      "DOGHOUSE": "Будки, жилища животных и кошачьи домики",
      "BOX": "Картонные коробки, посылки и контейнеры",
      "VEHICLE": "Автомобили, трейлеры, поезда и субмарины",
      "SPACESHIP": "Космические корабли, станции и орбитальные базы",
      "FICTION_MEDIA": "Жилища из кино, книг и аниме",
      "MUSEUM_PUBLIC": "Странные музеи, тюрьмы и причудливые здания",
      "IMAGINARY_CITY": "Воображаемые города и миниатюрные королевства",
      "EXTREME_NATURE": "Экстремальные дебри, вулканы, бездны и ледники",
      "WEIRD_ARCH": "Причудливые архитектурные шедевры мира",
      "MULTIVERSE": "Гиперпространство, черные дыры и храмы мультивселенной",
      "PRISON_FACILITY": "Тюрьмы, Одиночные Камеры и Изоляторы",
      "INDUSTRIAL_HAZARD": "Зоны Промышленных Катастроф и Радиации",
      "RUINS_ABANDONED": "Заброшенные Руины, Города-Призраки и Трущобы",
      "MICRO_DWELLING": "Микрожилье, Коробки и Капсульные Комнаты",
      "UNDERGROUND_BUNKER": "Подземные Бункеры, Убежища и Катакомбы",
      "ROYAL_PALACE": "Королевские Дворцы и Исторические Замки",
      "LUXURY_PENTHOUSE": "Мировые Достопримечательности и Супер-Пентхаусы"
    },
    "specs": {
      "builtYearLabel": "Год постройки",
      "estimatedValueLabel": "Оценочная стоимость",
      "specialFeatureLabel": "Особая характеристика",
      "aiVerdictLabel": "Вердикт AI-оценщика",
      "tierLabel": "Тир",
      "levelLabel": "Уровень"
    },
    "tierTemplate": "Ярус {tier}: {name}",
    "storyHeader": "\"Дом, подходящий для {name}\"",
    "storyPhotoHint": "Выберите тему, чтобы сохранить или поделиться",
    "storySpecTitle": "Архитектурные спецификации",
    "saveStoryBtn": "Сохранить и поделиться",
    "shareMobileBtn": "Поделиться с телефона",
    "copyUrlBtn": "Скопировать ссылку",
    "copiedToast": "Ссылка скопирована в буфер обмена!",
    "prevHouseBtn": "◀ Предыдущий дом",
    "nextHouseBtn": "Следующий дом ▶",
    "randomHouseBtn": "🎲 Случайный дом",
    "scrollPreviewTitle": "Список домов по уровням (Нажмите, чтобы посмотреть фото)",
    "imageLockedBadge": "🔒 Перейдите на страницу, чтобы открыть фото дома",
    "enterHouseBtn": "Войти в этот дом и посмотреть фото 👉",
    "linkedNameBadge": "👤 Главный житель: {name}",
    "seoTitleWithName": "Дом для {name}: {title} | MyHome AI Архитектура",
    "seoDescWithName": "Найдите идеальный дом для {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "дом для {name}, дом {name}, рекомендация дома для {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Дом для {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Сохранить и поделиться",
    "photoDiaryLink": "Что поесть сегодня?",
    "photoDiaryTitle": "Перейти в Что поесть сегодня?",
    "foodLink": "Что поесть сегодня?",
    "foodTitle": "Перейти в Что поесть сегодня?",
    "langSelectLabel": "Изменить язык",
    "nameInputAria": "Введите имя для оценки",
    "randomDiceTitle": "🎲 Бросить кубик для случайного имени",
    "randomDiceToast": "🎲 Случайное имя «{name}» оценено!",
    "refreshChipsTitle": "Обновить популярные имена",
    "refreshChipsToast": "🔄 Список популярных имен обновлен!",
    "enterNameToast": "Пожалуйста, введите имя!",
    "returnMyHouseText": "Вернуться в мой дом ({name} · Ур.{level})",
    "returnMyHouseDefault": "Вернуться в мой исходный дом",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Нажмите на любое название дома, чтобы перейти на страницу и увидеть фото.",
    "scrollSubtitleHigher": "Отображаются уровни выше вашего текущего Lv.{current} (Lv.{start}~{max}). Нажмите «Все (0~999)», чтобы смотреть с Lv.0.",
    "scrollSubtitleAll": "Нажмите на любое название от Ур.0 до Ур.{max}, чтобы открыть фото.",
    "scrollFilterAll": "Все (0~999)",
    "scrollFilterBad": "💀 Фейл (Ур.0~499)",
    "scrollFilterGood": "🌟 Мечта (Ур.500~999)",
    "scrollFilterReal": "🏛️ Реальные 50%",
    "scrollFilterFiction": "🦄 Вымысел 50%",
    "previewEnterArrow": "Смотреть фото ›",
    "dockKeyboardHint": "💡 Используйте стрелки (← / →) для перехода по уровням или Пробел для случайного дома.",
    "loadingText": "AI-оценщик проверяет реестр недвижимости мультивселенной...",
    "loadingWithName": "AI-оценщик проверяет права собственности в мультивселенной для [{name}]...",
    "tiers": {
      "1": "Ярус 01: Первобытное Дно",
      "2": "Ярус 02: Руины и Трущобы",
      "3": "Ярус 03: Причудливый Металлолом и Коробки",
      "4": "Ярус 04: Экстремальные Уборные и Радиация",
      "5": "Ярус 05: Закрытые Зоны и Тюрьмы",
      "6": "Ярус 06: Нелепые Укрытия из Кино и Аниме",
      "7": "Ярус 07: Опасные Передвижные Убежища",
      "8": "Ярус 08: Болота и Затопленные Зоны",
      "9": "Ярус 09: Пустыни и Ледяные Пещеры",
      "10": "Ярус 10: На Грани Провала",
      "11": "Ярус 11: Уютные Шале Удачи",
      "12": "Ярус 12: Исторические Замки и Памятники Мира",
      "13": "Ярус 13: Культовые Дома Pixar и Disney",
      "14": "Ярус 14: Элитные Городские Пентхаусы",
      "15": "Ярус 15: Цитадели Фэнтези и Литературы",
      "16": "Ярус 16: Семь Чудес Света и Тайные Святилища",
      "17": "Ярус 17: Умные Города Будущего и Суперъяхты",
      "18": "Ярус 18: Золотые Дворцы Мифов и Легенд",
      "19": "Ярус 19: Орбитальные Станции и Космические Колонии",
      "20": "Ярус 20: Трансцендентные Сферы Дайсона"
    },
    "guide": {
      "sectionTitle": "🏛️ Путеводитель по домам мультивселенной",
      "badBadge": "Уровни 0 ~ 499",
      "badTitle": "💀 Полный Фейл-Хаус",
      "badDesc": "От магмовых полуподвалов и промокших коробок до собачьих будок и прозрачных биотуалетов — невероятно смешные и абсурдные места для выживания.",
      "goodBadge": "Уровни 500 ~ 999",
      "goodTitle": "🌟 Роскошный Дом Мечты",
      "goodDesc": "От роскошных бункеров и особняков на утесе до вершины Бурдж-Халифа, МКС, Сферы Дайсона и Пентхауса Творца Мультивселенной.",
      "ruleBadge": "Чередование на каждом уровне",
      "ruleTitle": "🏛️ 50% Реальность ↔ 🦄 50% Вымысел",
      "ruleDesc": "<strong>Четные уровни</strong> — реальные удивительные сооружения Земли, а <strong>нечетные уровни</strong> — вымышленные миры из кино, фантастики и мифов."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Официальный гид MyHome · Найдите дом, который подходит вам, просто введя имя",
      "art1Title": "🏠 1. Просто введите имя! Веселый тест на поиск идеального дома",
      "art1P1": "«Дом, который подходит именно вам» (MyHome) — это забавный развлекательный тест, который мгновенно подберет дом вашей мечты (или провала!) всего лишь по одному имени, без регистрации и нудных опросов. Введите свое имя, имя друга, близкого человека или кумира! На русском, английском или любом другом языке — каждый символ анализируется, чтобы подобрать вам один из 1 000 удивительных домов мультивселенной.",
      "art1P2": "Разница всего в одну букву способна кардинально изменить вашу судьбу: от Уровня 0 (Полный Фейл-Хаус) до Уровня 999 (Роскошный Дом Мечты). Одно и то же имя всегда приводит к одному и тому же дому. Проверьте имена друзей и поделитесь результатами, чтобы узнать, кому достанется самая смешная конура, а кому — заоблачный пентхаус!",
      "art2Title": "📐 2. Никаких скучных панелек! 1 000 невероятных жилищ",
      "art2P1": "Здесь вы не найдете унылых типовых квартир-коробок. От уморительных фейл-домов, вроде промокшей картонной коробки, прозрачного туалета или деревенской будки, до потрясающих супер-особняков, таких как резиденция Железного человека на скале, МКС и галактический пентхаус — вас ждут 1 000 уникальных мест проживания.",
      "art2P2": "Кроме того, четные уровни (0, 2, 4...) представляют реальные архитектурные диковинки планеты Земля, а нечетные (1, 3, 5...) строго чередуются с вымышленными обителями из кино, научной фантастики и мифов в пропорции 50:50, сочетая познавательный интерес и море веселья.",
      "art3Title": "🛡️ 3. Безопасно и конфиденциально: персональные данные не сохраняются",
      "art3P1": "MyHome не сохраняет введенные имена и историю поиска на серверах или в базах данных. Все результаты вычисляются прямо в памяти вашего браузера и мгновенно исчезают, гарантируя полную конфиденциальность.",
      "art3P2": "Год постройки, оценочная стоимость, особые функции и вердикт AI-оценщика — это вымышленный развлекательный контент, созданный для поднятия настроения. Сохраните карточку с результатом и поделитесь ей в Instagram Stories, TikTok, Telegram или ВКонтакте!"
    },
    "footer": {
      "brand": "Дом, который подходит именно вам (MyHome)",
      "about": "О проекте (About)",
      "contact": "Контакты (Contact)",
      "privacy": "Конфиденциальность (Privacy)",
      "terms": "Условия (Terms)",
      "consent": "Настройки конфиденциальности (Consent)",
      "desc": "Этот сервис — увлекательный развлекательный тест, который подбирает подходящий вам дом просто по имени."
    },
    "shareModal": {
      "themeCert": "Классика",
      "themeCyber": "Киберпанк",
      "themeSunset": "Закат",
      "instaDirectBtn": "Поделиться напрямую в Instagram Story",
      "savedToast": "📥 Изображение 9:16 для Story сохранено!",
      "instaDownloadedToast": "📸 Карточка скачана, ссылка скопирована!",
      "messengerCopiedToast": "💬 Ссылка для отправки скопирована!",
      "whatsappDirectBtn": "Поделиться в WhatsApp",
      "whatsappOpenedToast": "🟢 Окно WhatsApp открыто!",
      "tiktokDirectBtn": "Поделиться в TikTok (Карточка 9:16 и ссылка)",
      "tiktokDownloadedToast": "🎵 Карточка 9:16 скачана, ссылка скопирована! Загрузите в TikTok с ссылкой."
    }
  },
  "de": {
    "brandHeader": "Das Haus, das zu Ihnen passt",
    "brandSub": "Unterhaltsamer Namenstest: Finde dein passendes Haus · 1.000 einzigartige Häuser",
    "searchPlaceholder": "Namen eingeben (z. B. Noah, Emilia, Steve...)",
    "searchBtn": "Mein Haus finden",
    "sampleLabel": "Beliebte Namen:",
    "ownerTitle": "Das passende Haus für {name}",
    "certificateTitle": "Das Haus, das zu Ihnen passt",
    "zones": {
      "GOOD": "Traumhaftes Luxushaus",
      "BAD": "Extremes Flop-Haus"
    },
    "reality": {
      "REAL": "Reale Architektur & Existierende Orte",
      "FICTION": "Fiktive, Sci-Fi- und Fantasie-Orte"
    },
    "categories": {
      "TOILET": "Bizarre Toiletten & Sanitäranlagen",
      "CLOSET": "Schränke, Möbel & Schließfächer",
      "DOGHOUSE": "Hundehütten, Tiergehege & Kratzbäume",
      "BOX": "Kartons, Versandpakete & Behälter",
      "VEHICLE": "Autos, Wohnmobile, Züge & U-Boote",
      "SPACESHIP": "Raumschiffe, Raumstationen & Orbitalbasen",
      "FICTION_MEDIA": "Wohnorte aus Filmen, Büchern & Animes",
      "MUSEUM_PUBLIC": "Kuriose Museen, Gefängnisse & Bizarre Bauten",
      "IMAGINARY_CITY": "Fantasie-Städte & Miniatur-Königreiche",
      "EXTREME_NATURE": "Extreme Wildnis, Vulkane, Tiefsee & Gletscher",
      "WEIRD_ARCH": "Bizarre Architektur-Wunder & Kuriose Landmarken",
      "MULTIVERSE": "Hyperdimensionen, Schwarze Löcher & Multiversum-Tempel",
      "PRISON_FACILITY": "Gefängnisse, Einzelzellen & Haftanstalten",
      "INDUSTRIAL_HAZARD": "Industriegefahren- & Strahlungszonen",
      "RUINS_ABANDONED": "Verlassene Ruinen, Geisterstädte & Slums",
      "MICRO_DWELLING": "Mikrowohnungen, Kartons & Kapselzimmer",
      "UNDERGROUND_BUNKER": "Unterirdische Bunker, Schutzräume & Katakomben",
      "ROYAL_PALACE": "Königliche Paläste & Historische Schlösser",
      "LUXURY_PENTHOUSE": "Weltwahrzeichen & Ultra-Luxus-Penthäuser"
    },
    "specs": {
      "builtYearLabel": "Baujahr",
      "estimatedValueLabel": "Geschätzter Wert",
      "specialFeatureLabel": "Besonderes Merkmal",
      "aiVerdictLabel": "Urteil des KI-Gutachters",
      "tierLabel": "Tier",
      "levelLabel": "Level"
    },
    "tierTemplate": "Stufe {tier}: {name}",
    "storyHeader": "\"Das Haus, das zu {name} passt\"",
    "storyPhotoHint": "Thema wählen und Karte speichern oder teilen",
    "storySpecTitle": "Architektonische Spezifikationen",
    "saveStoryBtn": "Bild speichern & teilen",
    "shareMobileBtn": "Auf Mobilgerät teilen",
    "copyUrlBtn": "Ergebnis-Link kopieren",
    "copiedToast": "Link in die Zwischenablage kopiert!",
    "prevHouseBtn": "◀ Vorheriges Haus",
    "nextHouseBtn": "Nächstes Haus ▶",
    "randomHouseBtn": "🎲 Zufälliges Haus",
    "scrollPreviewTitle": "Häuserliste nach Stufen (Klicken zum Ansehen des Fotos)",
    "imageLockedBadge": "🔒 Seite betreten, um das Hausfoto zu enthüllen",
    "enterHouseBtn": "Dieses Haus betreten & Foto ansehen 👉",
    "linkedNameBadge": "👤 Hauptbewohner: {name}",
    "seoTitleWithName": "Das Haus für {name}: {title} | MyHome KI-Architektur",
    "seoDescWithName": "Finden Sie das passende Haus für {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "Haus für {name}, {name} Haus, Haus-Empfehlung für {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Haus für {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Bild speichern & teilen",
    "photoDiaryLink": "Was essen wir heute?",
    "photoDiaryTitle": "Zu Was essen wir heute?",
    "foodLink": "Was essen wir heute?",
    "foodTitle": "Zu Was essen wir heute?",
    "langSelectLabel": "Sprache ändern",
    "nameInputAria": "Namen zur Bewertung eingeben",
    "randomDiceTitle": "🎲 Würfeln für einen zufälligen Namen",
    "randomDiceToast": "🎲 Zufälliger Name '{name}' bewertet!",
    "refreshChipsTitle": "Vorgeschlagene Namen aktualisieren",
    "refreshChipsToast": "🔄 Beliebte Namen aktualisiert!",
    "enterNameToast": "Bitte geben Sie einen Namen ein!",
    "returnMyHouseText": "Zurück zu meinem Haus ({name} · Lv.{level})",
    "returnMyHouseDefault": "Zurück zu meinem ursprünglichen Haus",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Klicken Sie auf einen Titel, um die Seite zu betreten und das Foto freizuschalten.",
    "scrollSubtitleHigher": "Zeigt nur Stufen an, die höher als dein aktuelles Level Lv.{current} sind (Lv.{start}~{max}). Klicke auf 'Alle (0~999)', um ab Lv.0 zu stöbern.",
    "scrollSubtitleAll": "Klicken Sie auf einen Titel von Lv.0 bis Lv.{max}, um das Foto anzusehen.",
    "scrollFilterAll": "Alle (0~999)",
    "scrollFilterBad": "💀 Flop (Lv.0~499)",
    "scrollFilterGood": "🌟 Traumhaus (Lv.500~999)",
    "scrollFilterReal": "🏛️ Real 50%",
    "scrollFilterFiction": "🦄 Fiktion 50%",
    "previewEnterArrow": "Foto ansehen ›",
    "dockKeyboardHint": "💡 Pfeiltasten (← / →) zum Navigieren oder Leertaste für ein zufälliges Haus.",
    "loadingText": "Der KI-Gutachter prüft das Multiversum-Grundbuch...",
    "loadingWithName": "Der KI-Gutachter überprüft die Multiversum-Urkunde für [{name}]...",
    "tiers": {
      "1": "Stufe 01: Der Urzeitliche Tiefpunkt",
      "2": "Stufe 02: Ruinen & Verlassene Gassen",
      "3": "Stufe 03: Bizarrer Schrott & Pappkartons",
      "4": "Stufe 04: Extreme Wildnis-Latrinen & Strahlung",
      "5": "Stufe 05: Sperrzonen & Gefängnisse",
      "6": "Stufe 06: Kuriose Verstecke aus Film & Anime",
      "7": "Stufe 07: Riskante Mobile Notunterkünfte",
      "8": "Stufe 08: Sümpfe & Überschwemmungsgebiete",
      "9": "Stufe 09: Isolierte Wüsten & Eishöhlen",
      "10": "Stufe 10: An der Schwelle des Chaos",
      "11": "Stufe 11: Erholsame Traum-Chalets",
      "12": "Stufe 12: Historische Schlösser & Weltwahrzeichen",
      "13": "Stufe 13: Legendäre Pixar- & Disney-Schauplätze",
      "14": "Stufe 14: Erstklassige Stadt-Penthäuser",
      "15": "Stufe 15: Zitadellen aus Fantasy-Film & Literatur",
      "16": "Stufe 16: Sieben Weltwunder & Geheime Refugien",
      "17": "Stufe 17: Smart Cities der Zukunft & Superyachten",
      "18": "Stufe 18: Goldene Paläste der Mythen & Legenden",
      "19": "Stufe 19: Sci-Fi-Orbitalstationen & Kolonien",
      "20": "Stufe 20: Transzendentale Dyson-Sphären"
    },
    "guide": {
      "sectionTitle": "🏛️ Multiversum-Häuser-Ratgeber",
      "badBadge": "Level 0 ~ 499",
      "badTitle": "💀 Extreme Flop-Häuser",
      "badDesc": "Von Magma-Kellern und durchnässten Paketkartons bis hin zu Hundehütten und transparenten Toiletten – herrlich schräge Überlebensquartiere.",
      "goodBadge": "Level 500 ~ 999",
      "goodTitle": "🌟 Traumhafte Mega-Häuser",
      "goodDesc": "Von luxuriösen Raketensilo-Condos und Klippenvillen bis zur Spitze des Burj Khalifa, der ISS, Dyson-Sphären und dem Schöpfer-Penthaus.",
      "ruleBadge": "Wechsel auf jedem Level",
      "ruleTitle": "🏛️ 50% Real ↔ 🦄 50% Fiktion",
      "ruleDesc": "<strong>Gerade Level</strong> zeigen außergewöhnliche reale Bauwerke der Erde, während <strong>ungerade Level</strong> sich exakt mit fiktiven Orten aus Film, Sci-Fi und Mythologie abwechseln."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "MyHome Leitfaden · Finde dein passendes Haus ganz einfach mit deinem Namen",
      "art1Title": "🏠 1. Einfach Namen eingeben! Der unterhaltsame Haus-Matching-Test",
      "art1P1": "Das Haus, das zu Ihnen passt (MyHome), ist ein vergnüglicher Matching-Test, bei dem Sie ohne mühsame Registrierung oder Fragebögen sofort Ihr Traum- oder Flop-Haus entdecken – einfach durch Eingabe eines Namens. Probieren Sie Ihren eigenen Namen aus oder die Namen von Freunden, Familie oder Stars! Ob auf Deutsch, Englisch oder in einer anderen Sprache: Jeder Name wird anhand seiner einzigartigen Zeichen analysiert und einem von 1.000 außergewöhnlichen Häusern zugeordnet.",
      "art1P2": "Schon ein einziger Buchstabe Unterschied führt zu einem völlig anderen Schicksal: von Stufe 0 (Extremes Flop-Haus) bis Stufe 999 (Traumhaftes Luxushaus). Der gleiche Name ergibt immer deterministisch dasselbe Haus. Vergleichen Sie die Ergebnisse mit Freunden und finden Sie heraus, wer die witzigste Bruchbude oder das nobelste Penthouse erwischt!",
      "art2Title": "📐 2. Keine langweiligen Standardwohnungen! 1.000 außergewöhnliche Häuser",
      "art2P1": "Eintönige Plattenbauten und gewöhnliche Mietwohnungen suchen Sie hier vergeblich. Von urkomischen Flop-Häusern wie einem durchnässten Paketkarton, einer gläsernen öffentlichen Toilette oder einer ländlichen Hundehütte bis hin zu Super-Luxushäusern wie der Klippenvilla von Iron Man, der Internationalen Raumstation oder einem galaktischen Penthouse: 1.000 originelle Wohnsitze warten darauf, entdeckt zu werden.",
      "art2P2": "Gerade Stufen (0, 2, 4...) zeigen kuriose architektonische Wunder, die auf der Erde tatsächlich existieren oder existierten. Ungerade Stufen (1, 3, 5...) wechseln sich exakt im 50:50-Rhythmus mit fantastischen Schauplätzen aus Filmen, Sci-Fi-Romanen und der Mythologie ab – eine perfekte Mischung aus Wissensdurst und purem Humor.",
      "art3Title": "🛡️ 3. Sicherer Spielspaß: Keine Speicherung persönlicher Daten",
      "art3P1": "MyHome speichert keinerlei eingegebene Namen oder Suchverläufe auf Servern oder in Datenbanken. Alle Berechnungen erfolgen blitzschnell im Speicher Ihres Browsers und verfallen sofort. So kann jeder vollkommen unbesorgt drauflostesten.",
      "art3P2": "Baujahr, geschätzter Wert, besondere Merkmale und das KI-Gutachterurteil sind humorvolle, fiktive Inhalte zur Unterhaltung und Anregung der Fantasie. Speichern Sie Ihre Ergebnis-Karte als Bild und teilen Sie sie stolz in Ihrer Instagram-Story, auf TikTok oder per WhatsApp!"
    },
    "footer": {
      "brand": "Das Haus, das zu Ihnen passt (MyHome)",
      "about": "Über uns (About)",
      "contact": "Kontakt (Contact)",
      "privacy": "Datenschutz (Privacy)",
      "terms": "Nutzungsbedingungen (Terms)",
      "consent": "Datenschutzeinstellungen (Consent)",
      "desc": "Dieser Service ist ein unterhaltsamer Namenstest, der allein anhand eines Namens das passende Haus ermittelt."
    },
    "shareModal": {
      "themeCert": "Klassisch",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Sonnenuntergang",
      "instaDirectBtn": "Direkt in Instagram Story teilen",
      "savedToast": "📥 9:16 Story-Bild gespeichert!",
      "instaDownloadedToast": "📸 Story heruntergeladen und Link kopiert!",
      "messengerCopiedToast": "💬 Teilen-Link in die Zwischenablage kopiert!",
      "whatsappDirectBtn": "Über WhatsApp teilen",
      "whatsappOpenedToast": "🟢 WhatsApp-Teilen-Fenster geöffnet!",
      "tiktokDirectBtn": "Auf TikTok teilen (9:16-Karte & Link)",
      "tiktokDownloadedToast": "🎵 9:16 Story-Bild heruntergeladen & Link kopiert! Auf TikTok mit Link teilen."
    }
  },
  "it": {
    "brandHeader": "La Casa Che Fa Per Te",
    "brandSub": "Test divertente: scopri la tua casa ideale solo con il nome · 1.000 case da abbinare",
    "searchPlaceholder": "Inserisci il tuo nome (es. Leonardo, Sofia, Steve...)",
    "searchBtn": "Trova La Mia Casa",
    "sampleLabel": "Nomi di Tendenza:",
    "ownerTitle": "La casa perfetta per {name}",
    "certificateTitle": "La Casa Che Fa Per Te",
    "zones": {
      "GOOD": "Casa da Sogno",
      "BAD": "Casa Disastrosa"
    },
    "reality": {
      "REAL": "Architettura Reale e Luoghi Esistenti",
      "FICTION": "Luoghi Fittizi, Fantascientifici e Mitologici"
    },
    "categories": {
      "TOILET": "Servizi Igienici Bizzarri del Mondo",
      "CLOSET": "Armadi, Mobili e Armadietti",
      "DOGHOUSE": "Cucce, Habitat Animali e Tiragraffi",
      "BOX": "Scatole di Cartone, Pacchi e Contenitori",
      "VEHICLE": "Auto, Camper, Treni e Sottomarini",
      "SPACESHIP": "Navi Spaziali, Stazioni e Basi Orbitali",
      "FICTION_MEDIA": "Spazi di Film, Libri e Anime",
      "MUSEUM_PUBLIC": "Musei Insoliti, Prigioni e Strutture Bizzarre",
      "IMAGINARY_CITY": "Città Immaginarie e Regni in Miniatura",
      "EXTREME_NATURE": "Terre Estreme, Vulcani, Abissi e Ghiacciai",
      "WEIRD_ARCH": "Meraviglie Architettoniche Bizzarre e Monumenti Curiosi",
      "MULTIVERSE": "Iperdimensioni, Buchi Neri e Templi del Multiverso",
      "PRISON_FACILITY": "Prigioni, Celle d’Isolamento e Centri di Detenzione",
      "INDUSTRIAL_HAZARD": "Zone a Rischio Industriale e Radiazioni",
      "RUINS_ABANDONED": "Rovine Abbandonate, Città Fantasma e Bassifondi",
      "MICRO_DWELLING": "Micro-Abitazioni, Scatole di Cartone e Capsule",
      "UNDERGROUND_BUNKER": "Bunker Sotterranei, Rifugi e Catacombe",
      "ROYAL_PALACE": "Palazzi Reali e Castelli Storici",
      "LUXURY_PENTHOUSE": "Monumenti Mondiali e Attici Ultra-Lusso"
    },
    "specs": {
      "builtYearLabel": "Anno di Costruzione",
      "estimatedValueLabel": "Valore Stimato",
      "specialFeatureLabel": "Caratteristica Speciale",
      "aiVerdictLabel": "Verdetto del Perito AI",
      "tierLabel": "Tier",
      "levelLabel": "Livello"
    },
    "tierTemplate": "Livello {tier}: {name}",
    "storyHeader": "\"La Casa Che Fa Per {name}\"",
    "storyPhotoHint": "Scegli un tema per salvare o condividere",
    "storySpecTitle": "Specifiche Architettoniche",
    "saveStoryBtn": "Salva e condividi immagine",
    "shareMobileBtn": "Condividi su Mobile",
    "copyUrlBtn": "Copia Link del Risultato",
    "copiedToast": "Link copiato negli appunti!",
    "prevHouseBtn": "◀ Casa Precedente",
    "nextHouseBtn": "Casa Successiva ▶",
    "randomHouseBtn": "🎲 Casa Casuale",
    "scrollPreviewTitle": "Elenco Case per Livello (Clicca per visualizzare la foto)",
    "imageLockedBadge": "🔒 Accedi alla pagina per scoprire la foto della casa",
    "enterHouseBtn": "Entra in questa casa e guarda la foto 👉",
    "linkedNameBadge": "👤 Residente in Evidenza: {name}",
    "seoTitleWithName": "La Casa Ideale per {name}: {title} | MyHome AI",
    "seoDescWithName": "Scopri la casa ideale per {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "casa per {name}, casa di {name}, raccomandazione casa per {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Casa per {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Salva e condividi immagine",
    "photoDiaryLink": "Cosa Mangiare Oggi?",
    "photoDiaryTitle": "Vai a Cosa Mangiare Oggi?",
    "foodLink": "Cosa Mangiare Oggi?",
    "foodTitle": "Vai a Cosa Mangiare Oggi?",
    "langSelectLabel": "Cambia lingua",
    "nameInputAria": "Inserisci un nome da valutare",
    "randomDiceTitle": "🎲 Lancia il dado per un nome casuale",
    "randomDiceToast": "🎲 Nome casuale '{name}' valutato!",
    "refreshChipsTitle": "Aggiorna nomi consigliati",
    "refreshChipsToast": "🔄 Nomi di tendenza aggiornati!",
    "enterNameToast": "Per favore inserisci un nome!",
    "returnMyHouseText": "Torna alla mia casa ({name} · Lv.{level})",
    "returnMyHouseDefault": "Torna alla mia casa originale",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Clicca su qualsiasi titolo per entrare nella pagina e scoprire la foto.",
    "scrollSubtitleHigher": "Visualizzazione dei livelli superiori al tuo livello attuale Lv.{current} (Lv.{start}~{max}). Clicca su 'Tutto (0~999)' per iniziare dal Lv.0.",
    "scrollSubtitleAll": "Clicca su un titolo da Lv.0 a Lv.{max} per vedere la foto.",
    "scrollFilterAll": "Tutti (0~999)",
    "scrollFilterBad": "💀 Disastro (Lv.0~499)",
    "scrollFilterGood": "🌟 Sogno (Lv.500~999)",
    "scrollFilterReal": "🏛️ Reale 50%",
    "scrollFilterFiction": "🦄 Finzione 50%",
    "previewEnterArrow": "Vedi foto ›",
    "dockKeyboardHint": "💡 Usa le frecce (← / →) per cambiare livello o Spazio per una casa casuale.",
    "loadingText": "Il perito AI sta consultando il registro immobiliare del multiverso...",
    "loadingWithName": "Il perito AI sta verificando l’atto del multiverso per [{name}]...",
    "tiers": {
      "1": "Livello 01: Il Fondo Primordiale",
      "2": "Livello 02: Rovine e Vicoli Fatiscenti",
      "3": "Livello 03: Rottami Bizzarri e Scatole di Cartone",
      "4": "Livello 04: Latrine Estreme e Zone Radioattive",
      "5": "Livello 05: Zone di Confinamento e Prigioni",
      "6": "Livello 06: Rifugi Umilianti di Film e Anime",
      "7": "Livello 07: Rifugi Mobili Pericolosi",
      "8": "Livello 08: Paludi e Aree Allagate",
      "9": "Livello 09: Deserti Isolati e Grotte di Ghiaccio",
      "10": "Livello 10: Sulla Soglia del Disastro",
      "11": "Livello 11: Chalet Rilassanti da Sogno",
      "12": "Livello 12: Castelli Storici e Monumenti Mondiali",
      "13": "Livello 13: Luoghi Iconici Pixar e Disney",
      "14": "Livello 14: Attici Urbani d’Élite Mondiale",
      "15": "Livello 15: Cittadelle del Cinema Fantasy e della Letteratura",
      "16": "Livello 16: Sette Meraviglie del Mondo e Santuari Segreti",
      "17": "Livello 17: Smart City del Futuro e Superyacht",
      "18": "Livello 18: Palazzi Dorati di Miti e Leggende",
      "19": "Livello 19: Stazioni Orbitali e Colonie Sci-Fi",
      "20": "Livello 20: Sfere di Dyson Trascendentali"
    },
    "guide": {
      "sectionTitle": "🏛️ Guida alle Case del Multiverso",
      "badBadge": "Livelli 0 ~ 499",
      "badTitle": "💀 Case del Fallimento Totale",
      "badDesc": "Dai seminterrati di magma e scatole di cartone bagnate alle cucce per cani e bagni pubblici trasparenti: dimore assurde e divertentissime.",
      "goodBadge": "Livelli 500 ~ 999",
      "goodTitle": "🌟 Case da Sogno Assoluto",
      "goodDesc": "Dai bunker nucleari di lusso e ville sulla scogliera fino alla cima del Burj Khalifa, alla Stazione Spaziale Internazionale e alle Sfere di Dyson.",
      "ruleBadge": "Alternanza a Ogni Livello",
      "ruleTitle": "🏛️ 50% Reale ↔ 🦄 50% Finzione",
      "ruleDesc": "I <strong>livelli pari</strong> mostrano straordinarie architetture realmente esistenti sulla Terra, mentre i <strong>livelli dispari</strong> si alternano con luoghi immaginari di cinema, fantascienza e mitologia."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Guida Ufficiale MyHome · Scopri la casa che fa per te semplicemente con il tuo nome",
      "art1Title": "🏠 1. Basta inserire un nome! Il test divertente per trovare la tua casa ideale",
      "art1P1": "La Casa Che Fa Per Te (MyHome) è un simpatico test di affinità abitativa che ti permette di scoprire all'istante la tua dimora perfetta inserendo semplicemente il tuo nome, senza registrazioni o noiosi questionari. Prova con il tuo nome, con quello dei tuoi amici, familiari o della tua celebrità preferita! In italiano, inglese o in qualsiasi altra lingua, ogni nome viene analizzato per abbinarti a una delle 1.000 case più incredibili del multiverso.",
      "art1P2": "Basta una sola lettera diversa per cambiare completamente il tuo destino: dal Livello 0 (Casa del Fallimento Comico) al Livello 999 (Casa da Sogno Assoluta). Lo stesso nome genera sempre esattamente la stessa casa, quindi cerca i nomi dei tuoi amici e condividi i risultati per vedere chi finisce nella sistemazione più assurda o nell'attico più lussuoso!",
      "art2Title": "📐 2. Nessun appartamento banale! 1.000 dimore straordinarie",
      "art2P1": "Non troverai condomini anonimi o appartamenti monotoni. Da alloggi comici e disastrosi (una scatola di cartone sotto la pioggia, un bagno pubblico trasparente, una cuccia per cani) a dimore da sogno ultra-lussuose (la villa sulla scogliera di Iron Man, la Stazione Spaziale Internazionale, un attico galattico): ti aspettano 1.000 case piene di fantasia.",
      "art2P2": "Inoltre, i livelli pari (0, 2, 4...) presentano stranezze architettoniche realmente esistite o tuttora presenti sulla Terra, mentre i livelli dispari (1, 3, 5...) si alternano rigorosamente al 50:50 con ambientazioni di film, romanzi sci-fi e mitologia, regalando intrattenimento e curiosità culturale.",
      "art3Title": "🛡️ 3. Sicuro e riservato: nessun dato personale salvato",
      "art3P1": "MyHome non memorizza alcun nome o cronologia di ricerca sui propri server. Tutti i risultati vengono calcolati in tempo reale nella memoria del tuo browser e svaniscono immediatamente, permettendoti di giocare in totale sicurezza e privacy.",
      "art3P2": "L'anno di costruzione, il valore stimato, le caratteristiche insolite e il verdetto del perito AI sono contenuti puramente ricreativi pensati per regalare un sorriso. Salva la scheda come immagine e condividila nelle tue Storie Instagram, su TikTok o tramite messaggi per mostrare la tua casa agli amici!"
    },
    "footer": {
      "brand": "La Casa Che Fa Per Te (MyHome)",
      "about": "Chi siamo (About)",
      "contact": "Contatti (Contact)",
      "privacy": "Privacy Policy",
      "terms": "Termini di Servizio (Terms)",
      "consent": "Impostazioni Privacy (Consent)",
      "desc": "Questo servizio è un divertente test che trova la casa perfetta per te semplicemente inserendo un nome."
    },
    "shareModal": {
      "themeCert": "Classico",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Tramonto",
      "instaDirectBtn": "Condividi Direttamente su Instagram Story",
      "savedToast": "📥 Immagine Story 9:16 salvata!",
      "instaDownloadedToast": "📸 Story scaricata e link copiato!",
      "messengerCopiedToast": "💬 Link di condivisione copiato!",
      "whatsappDirectBtn": "Condividi su WhatsApp",
      "whatsappOpenedToast": "🟢 Finestra di WhatsApp aperta!",
      "tiktokDirectBtn": "Condividi su TikTok (Card 9:16 & Link)",
      "tiktokDownloadedToast": "🎵 Story 9:16 scaricata e link copiato! Pubblicala su TikTok con il link."
    }
  },
  "ja": {
    "brandHeader": "あなたにふさわしい家",
    "brandSub": "名前を入力するだけ！おもしろマイホーム診断 · 1,000軒の住宅マッチング",
    "searchPlaceholder": "名前を入力してください（例：Haruto, 結衣, Steve...）",
    "searchBtn": "ぴったりの家を探す",
    "sampleLabel": "注目の名前：",
    "ownerTitle": "{name}さんにふさわしい家",
    "certificateTitle": "あなたにふさわしい家",
    "zones": {
      "GOOD": "大当たり大豪邸",
      "BAD": "大爆死ハウス"
    },
    "reality": {
      "REAL": "実在する建築物・場所",
      "FICTION": "架空・SF・ファンタジー空間"
    },
    "categories": {
      "TOILET": "世界の奇妙なトイレ・衛生施設",
      "CLOSET": "クローゼット・家具・コインロッカー",
      "DOGHOUSE": "犬小屋・動物の巣・キャットタワー",
      "BOX": "段ボール箱・宅配箱・容器",
      "VEHICLE": "自動車・キャンピングカー・列車・潜水艦",
      "SPACESHIP": "宇宙船・宇宙ステーション・軌道基地",
      "FICTION_MEDIA": "映画・小説・アニメの架空住居",
      "MUSEUM_PUBLIC": "異色博物館・監獄・奇怪な公共建築",
      "IMAGINARY_CITY": "空想都市・ミニチュア王国",
      "EXTREME_NATURE": "極限の秘境・火山・深海・氷河",
      "WEIRD_ARCH": "世界の奇妙な実在建築・ランドマーク",
      "MULTIVERSE": "超次元・ブラックホール・多次元宇宙の神殿",
      "PRISON_FACILITY": "監獄・独房・収容施設",
      "INDUSTRIAL_HAZARD": "産業災害・放射能・重汚染区域",
      "RUINS_ABANDONED": "廃墟・放置建築・スラム街",
      "MICRO_DWELLING": "極小住宅・段ボール・自販機・カプセルルーム",
      "UNDERGROUND_BUNKER": "地下シェルター・防空壕・カタコンベ",
      "ROYAL_PALACE": "王宮・歴史的古城",
      "LUXURY_PENTHOUSE": "世界のランドマーク・超高級ペントハウス"
    },
    "specs": {
      "builtYearLabel": "建築年",
      "estimatedValueLabel": "推定評価額",
      "specialFeatureLabel": "特別機能",
      "aiVerdictLabel": "AI鑑定士 総評",
      "tierLabel": "ティア",
      "levelLabel": "レベル"
    },
    "tierTemplate": "ティア {tier}: {name}",
    "storyHeader": "「{name}さんにふさわしい家」",
    "storyPhotoHint": "テーマを選んで画像を保存・共有しましょう",
    "storySpecTitle": "建築仕様書",
    "saveStoryBtn": "画像を保存・共有",
    "shareMobileBtn": "スマホで共有",
    "copyUrlBtn": "結果リンクをコピー",
    "copiedToast": "リンクをクリップボードにコピーしました！",
    "prevHouseBtn": "◀ 前の段階の家を見る",
    "nextHouseBtn": "次の段階の家を見る ▶",
    "randomHouseBtn": "🎲 ランダムハウス",
    "scrollPreviewTitle": "レベル別住宅一覧（クリックして写真を見る）",
    "imageLockedBadge": "🔒 ページに入ると家の写真が公開されます",
    "enterHouseBtn": "この家に入って写真を見る 👉",
    "linkedNameBadge": "👤 代表入居者: {name}",
    "seoTitleWithName": "{name}さんにふさわしい家：{title} | MyHome AI建築鑑定",
    "seoDescWithName": "{name}さんの運命の家：{title}（{zoneLabel}、{realityLabel}）。{name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "{name}の家, {name}の家診断, {name}の家画像, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "{name}さんにぴったりの家：{title}（{categoryLabel}） - {name} house image",
    "openShareModalBtn": "画像を保存・共有",
    "photoDiaryLink": "今日なに食べる？",
    "photoDiaryTitle": "今日なに食べる？へ移動",
    "foodLink": "今日なに食べる？",
    "foodTitle": "今日なに食べる？へ移動",
    "langSelectLabel": "言語を変更",
    "nameInputAria": "鑑定する名前を入力",
    "randomDiceTitle": "🎲 サイコロを振ってランダムな名前を表示",
    "randomDiceToast": "🎲 ランダム名「{name}」の鑑定が完了しました！",
    "refreshChipsTitle": "おすすめの名前を更新",
    "refreshChipsToast": "🔄 おすすめの名前を更新しました！",
    "enterNameToast": "名前を入力してください！",
    "returnMyHouseText": "元の自分の家（{name} · Lv.{level}）に戻る",
    "returnMyHouseDefault": "元の自分の家に戻る",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "タイトルをクリックすると該当ページへ移動し、家の写真を確認できます。",
    "scrollSubtitleHigher": "現在のレベル（Lv.{current}）より高い段階（Lv.{start}〜{max}）のみ表示中。「全体（0~999）」を押すとLv.0から閲覧できます。",
    "scrollSubtitleAll": "Lv.0からLv.{max}まで、タイトルをクリックすると写真を確認できます。",
    "scrollFilterAll": "すべて (0~999)",
    "scrollFilterBad": "💀 爆死 (Lv.0~499)",
    "scrollFilterGood": "🌟 大当たり (Lv.500~999)",
    "scrollFilterReal": "🏛️ 実在 50%",
    "scrollFilterFiction": "🦄 架空 50%",
    "previewEnterArrow": "写真を見る ›",
    "dockKeyboardHint": "💡 キーボードの左右キー（← / →）でレベル移動、スペースキー（Space）でランダム探索できます。",
    "loadingText": "AI鑑定士がマルチバース登記簿を照会しています...",
    "loadingWithName": "AI鑑定士が [{name}] 様のマルチバース登記を確認しています...",
    "tiers": {
      "1": "ティア 01: 原初のどん底",
      "2": "ティア 02: 廃墟とスラムの路地",
      "3": "ティア 03: 奇妙なガラクタと段ボール箱",
      "4": "ティア 04: 極限秘境のトイレと放射能地帯",
      "5": "ティア 05: 閉鎖区域と監獄",
      "6": "ティア 06: アニメ・映画の中の屈辱の住処",
      "7": "ティア 07: 危険だらけの移動式シェルター",
      "8": "ティア 08: 湿地帯と水没エリア",
      "9": "ティア 09: 孤立した砂漠と氷の洞窟",
      "10": "ティア 10: 大爆死ギリギリの境界線",
      "11": "ティア 11: 大当たり入門・癒やしのシャレー",
      "12": "ティア 12: 世界の歴史的古城とランドマーク",
      "13": "ティア 13: ピクサー・ディズニーの名所",
      "14": "ティア 14: 世界最高峰の都心ペントハウス",
      "15": "ティア 15: ファンタジー映画と文学の城塞",
      "16": "ティア 16: 世界七不思議と秘境の聖域",
      "17": "ティア 17: 未来のスマートシティとスーパーヨット",
      "18": "ティア 18: 神話と伝説の黄金宮殿",
      "19": "ティア 19: SF軌道ステーションとスペースコロニー",
      "20": "ティア 20: 宇宙超越ダイソン・スフィア"
    },
    "guide": {
      "sectionTitle": "🏛️ マルチバース住宅診断 ガイド",
      "badBadge": "0 〜 499段階",
      "badTitle": "💀 超ド級の爆死ハウス",
      "badDesc": "マグマの半地下、雨に濡れた宅配段ボール箱、田舎の犬小屋、透明公衆トイレ、故障した軽自動車など、住むには想像を絶する奇妙で笑える家ばかりが集まっています。",
      "goodBadge": "500 〜 999段階",
      "goodTitle": "🌟 奇跡の大当たり超豪邸",
      "goodDesc": "地下核ミサイルサイロの豪華コンドミニアム、断崖絶壁の豪邸、ブルジュ・ハリファの最上階、国際宇宙ステーション、ダイソン・スフィアまで広がります。",
      "ruleBadge": "1段階ごとに交互配置",
      "ruleTitle": "🏛️ 実在 50% ↔ 🦄 架空 50%",
      "ruleDesc": "<strong>偶数段階</strong>は地球上に実在する奇想天外な建築物、<strong>奇数段階</strong>は映画・SF・アニメの中の架空の空間が1段階ごとに交互に現れます。"
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "名前を入力するだけで見つかる！あなたにふさわしい家（MyHome）完全ガイド",
      "art1Title": "🏠 1. 名前を入力するだけで完了！おもしろマイホーム診断",
      "art1P1": "「あなたにふさわしい家（MyHome）」は、面倒な会員登録やアンケートは一切不要！名前を入力するだけで自分にぴったりの家がすぐに見つかるエンタメ住宅診断テストです。自分の名前はもちろん、家族や友人、恋人、推しの名前もぜひ入力してみてください。日本語やアルファベットなど、どんな名前でも入力された文字の固有の響きと情報から分析し、1,000種類の奇想天外な住居の中から相性抜群の家を導き出します。",
      "art1P2": "文字が1文字や1画変わるだけでも、0段階（大爆死ハウス）から999段階（大当たり超豪邸）まで全く異なる家が割り当てられます。同じ名前ならいつでも必ず同じ家が診断されるので、友達同士でお互いの名前を検索して、誰が一番笑えるトンデモ物件や超高級ペントハウスを引き当てるか、ぜひ診断してシェアしてみてください！",
      "art2Title": "📐 2. ありきたりなマンションはゼロ！1,000軒の奇想天外な住まい",
      "art2P1": "このテストには、どこにでもある平凡なアパートやマンションは一つもありません。雨に濡れた段ボール箱、透明公衆トイレ、田舎の犬小屋といった爆笑必至のハズレ部屋から、アイアンマンの断崖豪邸、国際宇宙ステーション、銀河のペントハウスといった超豪華な大当たりハウスまで、遊び心あふれる1,000軒の個性豊かな家が揃っています。",
      "art2P2": "さらに、偶数レベル（0, 2, 4...）には地球上に実在する（または歴史上実在した）世界の奇想天外な建築物を、奇数レベル（1, 3, 5...）には映画・SF小説・神話に登場する空想の住居を、1レベル刻みで50:50きれいに交互配置。知的好奇心と笑えるエンタメ性を同時にお届けします。",
      "art3Title": "🛡️ 3. 個人情報の保存なし！安心・安全なエンタメ診断",
      "art3P1": "「MyHome」は、検索ボックスに入力された名前や検索履歴をサーバー上に一切保存しません。すべての結果はお使いのブラウザ上で即座に計算されて消去されるため、誰でも安心して名前を検索してお楽しみいただけます。",
      "art3P2": "各住宅に記載されている建築年、推定評価額、特別機能、AI鑑定士の総評は、すべて皆様に笑顔と想像力をお届けするために創作されたエンターテインメントコンテンツです。結果カードを画像として保存し、InstagramストーリーやLINEなどで友達にシェアして自慢の家を共有しましょう！"
    },
    "footer": {
      "brand": "あなたにふさわしい家 (MyHome)",
      "about": "紹介 (About)",
      "contact": "お問い合わせ (Contact)",
      "privacy": "プライバシーポリシー (Privacy)",
      "terms": "利用規約 (Terms)",
      "consent": "プライバシー設定 (Consent)",
      "desc": "本サービスは名前を入力するだけで楽しめる、あなたにふさわしい家の診断テストです。"
    },
    "shareModal": {
      "themeCert": "権利証クラシック",
      "themeCyber": "サイバーネオン",
      "themeSunset": "サンセット",
      "instaDirectBtn": "Instagramストーリーで直接シェア",
      "savedToast": "📥 9:16 ストーリー画像を保存しました！",
      "instaDownloadedToast": "📸 ストーリー画像を保存し、リンクをコピーしました！",
      "messengerCopiedToast": "💬 共有リンクをコピーしました！",
      "whatsappDirectBtn": "WhatsAppでシェア",
      "whatsappOpenedToast": "🟢 WhatsAppの共有画面が開きました！",
      "tiktokDirectBtn": "TikTokでシェア（9:16カード＆リンク）",
      "tiktokDownloadedToast": "🎵 9:16 ストーリー画像が保存され、リンクをコピーしました！TikTokでシェアしてみましょう。"
    }
  },
  "zh": {
    "brandHeader": "最适合你的房子",
    "brandSub": "输入名字即可测出最适合你的房子 · 趣味房屋匹配测试 · 1,000套特色住宅",
    "searchPlaceholder": "输入姓名（例如：Wei, Fang, Steve...）",
    "searchBtn": "寻找我的专属住宅",
    "sampleLabel": "热门名字：",
    "ownerTitle": "适合{name}的房子",
    "certificateTitle": "最适合你的房子",
    "zones": {
      "GOOD": "天选神仙豪宅",
      "BAD": "爆笑翻车宅"
    },
    "reality": {
      "REAL": "真实存在的建筑与地点",
      "FICTION": "虚构・科幻・神话世界建筑"
    },
    "categories": {
      "TOILET": "全球猎奇厕所与卫浴空间",
      "CLOSET": "衣柜・家具・储物柜",
      "DOGHOUSE": "狗屋・动物巢穴・猫爬架",
      "BOX": "纸箱・快递箱・容器",
      "VEHICLE": "汽车・房车・火车・潜水艇",
      "SPACESHIP": "飞船・空间站・轨道基地",
      "FICTION_MEDIA": "影视・小说・动漫虚构居所",
      "MUSEUM_PUBLIC": "奇特博物馆・监狱・诡异公共建筑",
      "IMAGINARY_CITY": "想象之城・微缩王国",
      "EXTREME_NATURE": "极限秘境・火山・深海・冰川",
      "WEIRD_ARCH": "全球奇特建筑与奇趣地标",
      "MULTIVERSE": "超维度・黑洞・多元宇宙神殿",
      "PRISON_FACILITY": "监狱・单人牢房・拘留设施",
      "INDUSTRIAL_HAZARD": "工业灾害・核辐射・重度污染区",
      "RUINS_ABANDONED": "废墟・荒废建筑・贫民窟",
      "MICRO_DWELLING": "超微型居所・纸箱・贩卖机・胶囊房",
      "UNDERGROUND_BUNKER": "地下掩体・防空洞・地下墓穴",
      "ROYAL_PALACE": "皇家宫殿・历史古堡",
      "LUXURY_PENTHOUSE": "全球地标・超豪华顶层公寓"
    },
    "specs": {
      "builtYearLabel": "建造年份",
      "estimatedValueLabel": "估算价值",
      "specialFeatureLabel": "特色功能",
      "aiVerdictLabel": "AI鉴定师总评",
      "tierLabel": "梯级",
      "levelLabel": "等级"
    },
    "tierTemplate": "梯队 {tier}: {name}",
    "storyHeader": "“适合{name}的房子”",
    "storyPhotoHint": "选择主题即可保存或分享图片卡片",
    "storySpecTitle": "建筑规格明细",
    "saveStoryBtn": "保存并分享图片",
    "shareMobileBtn": "手机端分享",
    "copyUrlBtn": "复制结果链接",
    "copiedToast": "链接已复制到剪贴板！",
    "prevHouseBtn": "◀ 查看上一阶段房子",
    "nextHouseBtn": "查看下一阶段房子 ▶",
    "randomHouseBtn": "🎲 随机探访房子",
    "scrollPreviewTitle": "逐级房子列表（点击查看照片）",
    "imageLockedBadge": "🔒 进入专属页面解锁房屋全景高清照片",
    "enterHouseBtn": "探访此屋并查看照片 👉",
    "linkedNameBadge": "👤 代表住户：{name}",
    "seoTitleWithName": "适合{name}的房子：{title} | MyHome AI建筑鉴定",
    "seoDescWithName": "{name}的命定之屋：{title}（{zoneLabel}，{realityLabel}）。{name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "{name}的房子, {name}房屋推荐, {name}房子图片, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "适合{name}的房子：{title}（{categoryLabel}） - {name} house image",
    "openShareModalBtn": "保存并分享图片",
    "photoDiaryLink": "今天吃什么？",
    "photoDiaryTitle": "前往今天吃什么？",
    "foodLink": "今天吃什么？",
    "foodTitle": "前往今天吃什么？",
    "langSelectLabel": "切换语言",
    "nameInputAria": "输入要鉴定的姓名",
    "randomDiceTitle": "🎲 掷骰子随机测试名字",
    "randomDiceToast": "🎲 随机姓名“{name}”鉴定完成！",
    "refreshChipsTitle": "换一批推荐名字",
    "refreshChipsToast": "🔄 热门名字已刷新！",
    "enterNameToast": "请输入姓名！",
    "returnMyHouseText": "返回我的初始房屋（{name} · Lv.{level}）",
    "returnMyHouseDefault": "返回我的初始房屋",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "点击下方任意房屋标题即可进入专属页面并解锁高清实景照片。",
    "scrollSubtitleHigher": "仅显示高于您当前等级（Lv.{current}）的房屋（Lv.{start}~{max}）。点击“全部（0~999）”可从Lv.0开始浏览。",
    "scrollSubtitleAll": "点击 Lv.0 至 Lv.{max} 的任意标题即可查看房屋照片。",
    "scrollFilterAll": "全部 (0~999)",
    "scrollFilterBad": "💀 翻车 (Lv.0~499)",
    "scrollFilterGood": "🌟 豪宅 (Lv.500~999)",
    "scrollFilterReal": "🏛️ 真实 50%",
    "scrollFilterFiction": "🦄 虚构 50%",
    "previewEnterArrow": "查看照片 ›",
    "dockKeyboardHint": "💡 使用键盘左右方向键（← / →）切换等级，按空格键（Space）随机探访。",
    "loadingText": "AI鉴定师正在查询多元宇宙房产登记簿...",
    "loadingWithName": "AI鉴定师正在核验 [{name}] 的多元宇宙产权证...",
    "tiers": {
      "1": "梯队 01: 太初底层深渊",
      "2": "梯队 02: 废墟与贫民暗巷",
      "3": "梯队 03: 诡异废铁与纸箱",
      "4": "梯队 04: 极限荒野厕所与辐射区",
      "5": "梯队 05: 封锁禁区与监狱",
      "6": "梯队 06: 影视动漫中的屈辱居所",
      "7": "梯队 07: 惊险移动式庇护所",
      "8": "梯队 08: 沼泽地与淹没区",
      "9": "梯队 09: 孤立荒漠与冰洞",
      "10": "梯队 10: 爆雷边缘生死线",
      "11": "梯队 11: 吉宅入门治愈木屋",
      "12": "梯队 12: 世界历史古堡与地标",
      "13": "梯队 13: 皮克斯与迪士尼经典圣地",
      "14": "梯队 14: 全球顶尖都市顶层豪宅",
      "15": "梯队 15: 奇幻影视与文学要塞",
      "16": "梯队 16: 世界七大奇迹与秘境",
      "17": "梯队 17: 未来智慧城市与超级游艇",
      "18": "梯队 18: 神话与传说的黄金宫殿",
      "19": "梯队 19: 科幻轨道空间站与殖民地",
      "20": "梯队 20: 超越宇宙的戴森球"
    },
    "guide": {
      "sectionTitle": "🏛️ 多元宇宙房屋测评指南",
      "badBadge": "0 ~ 499级",
      "badTitle": "💀 爆笑翻车住宅",
      "badDesc": "从岩浆半地下室、淋雨的快递纸箱、乡村狗窝、透明公厕到报废微型车，汇集了各种超乎想象、令人捧腹的奇葩避难所。",
      "goodBadge": "500 ~ 999级",
      "goodTitle": "🌟 天选梦幻豪宅",
      "goodDesc": "从地下核导弹发射井豪华公寓、钢铁侠悬崖豪宅、哈利法塔顶层、国际空间站，一直延伸至戴森球与多元宇宙创世神顶层套房。",
      "ruleBadge": "逐级精准交替",
      "ruleTitle": "🏛️ 真实 50% ↔ 🦄 虚构 50%",
      "ruleDesc": "<strong>偶数等级</strong>为地球上真实存在或曾存在过的奇特建筑，<strong>奇数等级</strong>为电影、科幻与动漫中的虚构空间，每一级严格按 50:50 交替呈现。"
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "输入名字测命定之屋 · 最适合你的房子（MyHome）指南",
      "art1Title": "🏠 1. 仅需输入名字！测测看最适合你的专属住宅",
      "art1P1": "“最适合你的房子”（MyHome）无需复杂的注册或冗长的问卷，只需输入姓名即可瞬间测出最适合你的专属房屋，是一项充满趣味的住宅匹配测试。不仅可以测自己的名字，还可以输入家人、朋友、恋人甚至你最喜欢的爱豆的名字！无论是中文汉字、英文拉丁字母还是其他语言，系统都会根据名字的独特字符特征，从 1,000 套脑洞大开的奇特住宅中，为你精准匹配专属居所。",
      "art1P2": "哪怕名字只差一个字或一笔一画，分配到的居所就会天差地别——从 0 级（极度翻车房）到 999 级（天选梦幻豪宅）应有尽有。输入同一个名字每次都会得出完全一致的结果，快和朋友们互相测测对方的名字，看看谁抽到了爆笑翻车的奇葩居所，谁又抽中了超级顶层豪宅，一起分享快乐吧！",
      "art2Title": "📐 2. 拒绝平庸！1,000套脑洞大开的奇特居所",
      "art2P1": "在这个测试里，绝不会出现千篇一律的普通商品房或火柴盒公寓。从被雨淋湿的快递纸箱、全透明公厕、乡村狗窝等让人啼笑皆非的翻车居所，到钢铁侠悬崖庄园、国际空间站、银河顶层星空豪宅等极尽奢华的梦想之居，1,000 套独具创意的特色住宅为你带来无限惊喜。",
      "art2P2": "此外，偶数等级（0, 2, 4...）展示地球上真实存在或历史曾存的奇特建筑物，奇数等级（1, 3, 5...）则呈现电影、科幻小说与神话世界中的虚构居所，以 1 级为单位 50:50 严格交替排列，兼具趣味性与探索世界的知识乐趣。",
      "art3Title": "🛡️ 3. 不留存个人隐私，安全绿色的趣味测试",
      "art3P1": "“MyHome”绝不会将您在搜索框中输入的任何姓名或查询记录保存在服务器端。所有结果均在您的浏览器端即时计算并即刻销毁，没有任何数据泄露风险，人人都可以放心玩测。",
      "art3P2": "每套房屋注明的建造年份、估算价值、特色功能以及 AI 鉴定师总评，均为激发想象力与带来欢笑而精心创作的娱乐内容。您可以将结果卡片保存为高清图片，分享到微信、朋友圈、小红书或 Instagram 快拍，向好友展示你的奇趣豪宅！"
    },
    "footer": {
      "brand": "最适合你的房子 (MyHome)",
      "about": "关于我们 (About)",
      "contact": "联系我们 (Contact)",
      "privacy": "隐私政策 (Privacy)",
      "terms": "服务条款 (Terms)",
      "consent": "隐私设置 (Consent)",
      "desc": "本服务是一款仅需输入姓名即可测出专属房屋的趣味娱乐测试。"
    },
    "shareModal": {
      "themeCert": "产权证经典",
      "themeCyber": "赛博霓虹",
      "themeSunset": "落日渐变",
      "instaDirectBtn": "直接分享到 Instagram 快拍",
      "savedToast": "📥 9:16 快拍图片已保存！",
      "instaDownloadedToast": "📸 快拍图片已下载且链接已复制！",
      "messengerCopiedToast": "💬 分享链接已复制！",
      "whatsappDirectBtn": "通过 WhatsApp 分享",
      "whatsappOpenedToast": "🟢 已打开 WhatsApp 分享窗口！",
      "tiktokDirectBtn": "分享到抖音/TikTok（9:16卡片与链接）",
      "tiktokDownloadedToast": "🎵 9:16 快拍图片已下载且链接已复制！可在抖音/TikTok中发布照片并附带链接。"
    }
  },
  "ms": {
    "brandHeader": "Rumah Yang Sesuai Untuk Anda",
    "brandSub": "Ujian santai cari rumah yang sesuai hanya dengan nama · 1,000 pilihan rumah unik",
    "searchPlaceholder": "Masukkan nama anda (cth. Aisyah, Ahmad, Steve...)",
    "searchBtn": "Cari Rumah Saya",
    "sampleLabel": "Nama Popular:",
    "ownerTitle": "Rumah yang sesuai untuk {name}",
    "certificateTitle": "Rumah Yang Sesuai Untuk Anda",
    "zones": {
      "GOOD": "Rumah Impian Bertuah",
      "BAD": "Rumah Malang Ekstrem"
    },
    "reality": {
      "REAL": "Seni Bina & Tempat Nyata",
      "FICTION": "Tempat Fiksyen, Sains Fiksyen & Mitologi"
    },
    "categories": {
      "TOILET": "Tandas & Fasiliti Sanitasi Pelik Dunia",
      "CLOSET": "Almari, Perabot & Loker Duit Syiling",
      "DOGHOUSE": "Rumah Anjing, Habitat Haiwan & Menara Kucing",
      "BOX": "Kotak Kadbod, Bungkusan & Bekas",
      "VEHICLE": "Kereta, Campervan, Kereta Api & Kapal Selam",
      "SPACESHIP": "Kapal Angkasa, Stesen & Pangkalan Orbit",
      "FICTION_MEDIA": "Kediaman Filem, Novel & Anime",
      "MUSEUM_PUBLIC": "Muzium Ganjil, Penjara & Bangunan Pelik",
      "IMAGINARY_CITY": "Bandar Imaginasi & Kerajaan Miniatur",
      "EXTREME_NATURE": "Kawasan Ekstrem, Gunung Berapi, Laut Dalam & Glasier",
      "WEIRD_ARCH": "Keajaiban Seni Bina Pelik & Mercu Tanda Ganjil",
      "MULTIVERSE": "Hiperdimensi, Lubang Hitam & Tempat Suci Multiverse",
      "PRISON_FACILITY": "Penjara, Sel Asingan & Pusat Tahanan",
      "INDUSTRIAL_HAZARD": "Zon Bahaya Industri & Radiasi",
      "RUINS_ABANDONED": "Runtuhan Terbiar, Bandar Hantu & Setinggan",
      "MICRO_DWELLING": "Kediaman Mikro, Kotak Kadbod & Bilik Kapsul",
      "UNDERGROUND_BUNKER": "Bunker Bawah Tanah, Tempat Perlindungan & Katakombe",
      "ROYAL_PALACE": "Istana Diraja & Istana Bersejarah",
      "LUXURY_PENTHOUSE": "Mercu Tanda Dunia & Penthouse Ultra-Mewah"
    },
    "specs": {
      "builtYearLabel": "Tahun Dibina",
      "estimatedValueLabel": "Nilai Anggaran",
      "specialFeatureLabel": "Ciri Istimewa",
      "aiVerdictLabel": "Keputusan Penilai AI",
      "tierLabel": "Peringkat",
      "levelLabel": "Tahap"
    },
    "tierTemplate": "Tahap {tier}: {name}",
    "storyHeader": "\"Rumah Yang Sesuai Untuk {name}\"",
    "storyPhotoHint": "Pilih tema untuk simpan atau kongsi kad imej",
    "storySpecTitle": "Spesifikasi Seni Bina",
    "saveStoryBtn": "Simpan & Kongsi Imej",
    "shareMobileBtn": "Kongsi di Telefon",
    "copyUrlBtn": "Salin Pautan Keputusan",
    "copiedToast": "Pautan disalin ke papan keratan!",
    "prevHouseBtn": "◀ Lihat Rumah Sebelumnya",
    "nextHouseBtn": "Lihat Rumah Seterusnya ▶",
    "randomHouseBtn": "🎲 Rumah Rawak",
    "scrollPreviewTitle": "Senarai Rumah Mengikut Tahap (Klik untuk melihat foto)",
    "imageLockedBadge": "🔒 Masuk halaman untuk mendedahkan foto rumah",
    "enterHouseBtn": "Masuk rumah ini & lihat foto 👉",
    "linkedNameBadge": "👤 Penghuni Pilihan: {name}",
    "seoTitleWithName": "Rumah Sesuai Untuk {name}: {title} | MyHome AI",
    "seoDescWithName": "Ketahui rumah takdir untuk {name}: {title} ({zoneLabel}, {realityLabel}). {name} house recommendation, {name} house image, house for {name}.",
    "seoImageKeywords": "rumah untuk {name}, rumah {name}, cadangan rumah {name}, {name} house recommendation, {name} house image, house for {name}",
    "seoImgAltWithName": "Rumah untuk {name}: {title} ({categoryLabel}) - {name} house image",
    "openShareModalBtn": "Simpan & Kongsi Imej",
    "photoDiaryLink": "Makan Apa Hari Ini?",
    "photoDiaryTitle": "Pergi ke Makan Apa Hari Ini?",
    "foodLink": "Makan Apa Hari Ini?",
    "foodTitle": "Pergi ke Makan Apa Hari Ini?",
    "langSelectLabel": "Tukar bahasa",
    "nameInputAria": "Masukkan nama untuk penilaian",
    "randomDiceTitle": "🎲 Baling dadu untuk nama rawak",
    "randomDiceToast": "🎲 Nama rawak '{name}' selesai dinilai!",
    "refreshChipsTitle": "Muat semula nama cadangan",
    "refreshChipsToast": "🔄 Nama popular telah dikemas kini!",
    "enterNameToast": "Sila masukkan nama!",
    "returnMyHouseText": "Kembali ke Rumah Saya ({name} · Lv.{level})",
    "returnMyHouseDefault": "Kembali ke Rumah Asal Saya",
    "adBadgeTop": "AD · GOOGLE ADSENSE",
    "adBadgeMain": "AD · GOOGLE ADSENSE",
    "adBadgeFooter": "AD · GOOGLE ADSENSE",
    "adHintInfeed": "Sponsored (#{index})",
    "scrollPreviewSubtitle": "Klik mana-mana tajuk rumah untuk masuk ke halaman dan melihat fotonya.",
    "scrollSubtitleHigher": "Menunjukkan tahap yang lebih tinggi daripada tahap semasa anda Lv.{current} (Lv.{start}~{max}). Klik 'Semua (0~999)' untuk melihat dari Lv.0.",
    "scrollSubtitleAll": "Klik mana-mana tajuk dari Lv.0 hingga Lv.{max} untuk melihat foto rumah.",
    "scrollFilterAll": "Semua (0~999)",
    "scrollFilterBad": "💀 Malang (Lv.0~499)",
    "scrollFilterGood": "🌟 Impian (Lv.500~999)",
    "scrollFilterReal": "🏛️ Nyata 50%",
    "scrollFilterFiction": "🦄 Fiksyen 50%",
    "previewEnterArrow": "Lihat foto ›",
    "dockKeyboardHint": "💡 Gunakan kekunci anak panah (← / →) untuk tukar tahap, atau Space untuk rumah rawak.",
    "loadingText": "Penilai AI sedang menyemak daftar hartanah multiverse...",
    "loadingWithName": "Penilai AI sedang mengesahkan geran multiverse untuk [{name}]...",
    "tiers": {
      "1": "Tahap 01: Dasar Bumi Purba",
      "2": "Tahap 02: Runtuhan & Lorong Setinggan",
      "3": "Tahap 03: Besi Buruk Pelik & Kotak Kadbod",
      "4": "Tahap 04: Tandas Pedalaman Ekstrem & Radiasi",
      "5": "Tahap 05: Zon Larangan & Penjara",
      "6": "Tahap 06: Tempat Persembunyian Lucu Filem & Anime",
      "7": "Tahap 07: Perlindungan Mudah Alih Berbahaya",
      "8": "Tahap 08: Paya & Kawasan Banjir",
      "9": "Tahap 09: Gurun Terpencil & Gua Ais",
      "10": "Tahap 10: Di Ambang Kemalangan",
      "11": "Tahap 11: Chalet Penyembuhan Impian",
      "12": "Tahap 12: Istana Bersejarah & Mercu Tanda Dunia",
      "13": "Tahap 13: Lokasi Ikonik Pixar & Disney",
      "14": "Tahap 14: Penthouse Bandar Kelas Dunia",
      "15": "Tahap 15: Kubu Filem Fantasi & Sastera",
      "16": "Tahap 16: Tujuh Keajaiban Dunia & Syurga Rahsia",
      "17": "Tahap 17: Bandar Pintar Masa Depan & Superyacht",
      "18": "Tahap 18: Istana Emas Mitos & Legenda",
      "19": "Tahap 19: Stesen Orbit & Koloni Sci-Fi",
      "20": "Tahap 20: Sfera Dyson Transendental"
    },
    "guide": {
      "sectionTitle": "🏛️ Panduan Rumah Multiverse",
      "badBadge": "Tahap 0 ~ 499",
      "badTitle": "💀 Rumah Malang Ekstrem",
      "badDesc": "Daripada bawah tanah magma, kotak bungkusan basah, rumah anjing hingga tandas awam lutsinar—koleksi kediaman pelik dan mencuit hati.",
      "goodBadge": "Tahap 500 ~ 999",
      "goodTitle": "🌟 Rumah Impian Bertuah",
      "goodDesc": "Daripada kondo silo nuklear mewah, banglo tebing Iron Man, puncak Burj Khalifa, Stesen Angkasa Antarabangsa hingga Penthouse Pencipta Multiverse.",
      "ruleBadge": "Berselang-seli Setiap 1 Tahap",
      "ruleTitle": "🏛️ 50% Nyata ↔ 🦄 50% Fiksyen",
      "ruleDesc": "<strong>Tahap genap</strong> memaparkan seni bina luar biasa yang benar-benar wujud di Bumi, manakala <strong>tahap ganjil</strong> berselang-seli dengan lokasi fiksyen daripada filem, sci-fi dan mitologi."
    },
    "whitepaper": {
      "tag": "OFFICIAL WHITEPAPER",
      "mainTitle": "Panduan Rasmi MyHome · Temui rumah yang sesuai untuk anda hanya dengan nama",
      "art1Title": "🏠 1. Masukkan nama sahaja! Ujian santai mencari rumah idaman anda",
      "art1P1": "Rumah Yang Sesuai Untuk Anda (MyHome) ialah ujian padanan rumah santai dan menghiburkan di mana anda boleh mengetahui kediaman yang sesuai dengan anda serta-merta hanya dengan memasukkan nama—tanpa perlu mendaftar atau mengisi borang kaji selidik. Cubalah masukkan nama anda sendiri, ahli keluarga, rakan-rakan, pasangan, atau selebriti kegemaran anda! Sama ada dalam Bahasa Melayu, Inggeris atau bahasa lain, setiap nama dianalisis mengikut nilai aksaranya yang tersendiri untuk memadankan anda dengan salah satu daripada 1,000 rumah luar biasa di multiverse.",
      "art1P2": "Perbezaan satu huruf sahaja sudah cukup untuk mengubah nasib rumah anda sepenuhnya—daripada Tahap 0 (Rumah Malang Ekstrem yang melucukan) hingga Tahap 999 (Rumah Impian Bertuah serba mewah). Nama yang sama akan sentiasa menghasilkan rumah yang sama secara konsisten. Cari nama kawan-kawan anda dan kongsikan keputusan untuk melihat siapa yang dapat pondok paling kelakar atau penthouse paling mewah!",
      "art2Title": "📐 2. Tiada pangsapuri biasa yang membosankan! 1,000 rumah unik di luar imaginasi",
      "art2P1": "Di sini tiada flat atau kondominium biasa yang membosankan. Daripada rumah malang yang melucukan seperti kotak bungkusan basah kuyup, tandas awam lutsinar dan pondok anjing kampung, sehinggalah ke rumah mewah impian seperti banglo tebing Iron Man, Stesen Angkasa Antarabangsa dan penthouse galaksi—1,000 buah rumah unik menanti anda.",
      "art2P2": "Selain itu, tahap genap (0, 2, 4...) memaparkan seni bina pelik yang benar-benar wujud di dunia, manakala tahap ganjil (1, 3, 5...) menampilkan kediaman imaginasi daripada filem, novel sains fiksyen dan mitologi. Susunan berselang-seli 50:50 ini menggabungkan pengetahuan menarik dan hiburan santai serentak.",
      "art3Title": "🛡️ 3. Selamat dan peribadi: Tiada data peribadi disimpan",
      "art3P1": "MyHome tidak pernah menyimpan sebarang nama atau sejarah carian anda pada pelayan pusat. Segala pengiraan diproses serta-merta dalam memori pelayar anda dan terpadam serta-merta, membolehkan sesiapa sahaja mencubanya dengan rasa selamat dan tenang.",
      "art3P2": "Tahun binaan, nilai anggaran, keistimewaan dan ulasan penilai AI yang dipaparkan adalah kandungan rekaan santai yang dicipta untuk menceriakan hari anda. Simpan kad keputusan sebagai imej dan kongsikan di Instagram Story, TikTok atau WhatsApp untuk berbangga dengan rumah baharu anda!"
    },
    "footer": {
      "brand": "Rumah Yang Sesuai Untuk Anda (MyHome)",
      "about": " Mengenai Kami (About)",
      "contact": "Hubungi (Contact)",
      "privacy": "Dasar Privasi (Privacy)",
      "terms": "Syarat Perkhidmatan (Terms)",
      "consent": "Tetapan Privasi (Consent)",
      "desc": "Perkhidmatan ini adalah ujian santai untuk mencari rumah yang sesuai dengan anda hanya dengan memasukkan nama."
    },
    "shareModal": {
      "themeCert": "Klasik",
      "themeCyber": "Cyberpunk",
      "themeSunset": "Senja",
      "instaDirectBtn": "Kongsi Terus ke Instagram Story",
      "savedToast": "📥 Imej Story 9:16 berjaya disimpan!",
      "instaDownloadedToast": "📸 Story dimuat turun dan pautan disalin!",
      "messengerCopiedToast": "💬 Pautan kongsi berjaya disalin!",
      "whatsappDirectBtn": "Kongsi Melalui WhatsApp",
      "whatsappOpenedToast": "🟢 Tetingkap perkongsian WhatsApp telah dibuka!",
      "tiktokDirectBtn": "Kongsi ke TikTok (Kad 9:16 & Pautan)",
      "tiktokDownloadedToast": "🎵 Story 9:16 dimuat turun dan pautan disalin! Muat naik ke TikTok dengan pelekat pautan."
    }
  }
};

export const MULTILANG_LEVEL_MAP = {
  "hi": {
    "0": {
      "title": "इंडोनेशिया के कावा इजेन सल्फर खदान के पास एकल व्यक्ति चट्टानी दरार",
      "builtYear": "4.5 अरब ईसा पूर्व (पृथ्वी के निर्माण काल का उत्पाद)",
      "estimatedValue": "-$75M USD (पुनर्स्थापना जुर्माना और पर्यावरण सफाई लागत)",
      "specialFeature": "हर रात चमकीली नीली सल्फर की लपटें प्राकृतिक अप्रत्यक्ष रोशनी का काम करती हैं, और साल भर तीखी सल्फर की भाप आपकी बंद नाक खोलती रहती है।",
      "aiVerdict": "बधाई हो! पृथ्वी के सबसे दहकते जुनून को अपने पूरे शरीर में समाहित करने वाले प्रकृतिवादी जीवन की शुरुआत।"
    },
    "60": {
      "title": "बुसान के गमचियोन गांव में खड़ी सीढ़ियों के अंत पर 80 सेमी चौड़ी दरार वाली ब्लॉक झोपड़ी",
      "builtYear": "लगभग 2013 का आपातकालीन निर्माण (नवंबर में पूरा)",
      "estimatedValue": "~$2,000 USD (कबाड़ सामग्री मूल्य, विध्वंस शुल्क अलग)",
      "specialFeature": "शरणार्थियों द्वारा पहाड़ी ढलान काटकर बनाई गई भूलभुलैया जैसी गलियां, बगल के घर से केवल 80 सेमी के अंतर में सीमेंट ब्लॉकों से बनी संकरी झोपड़ी। दरवाजा खोलते ही खाई जैसी 148 सीढ़ियां दिखती हैं, जहां पैर फिसलते ही समुद्र तक लुढ़क जाने का डर रहता है।",
      "aiVerdict": "जंगली उत्तरजीविता कौशल विकसित करने के लिए इससे अधिक कठोर और ईमानदार निवास कोई दूसरा नहीं है।"
    },
    "74": {
      "title": "बांग्लादेश ढाका चमड़ा टेनेरी की कीचड़ तटबंध पर पॉलीथीन शेड",
      "builtYear": "1995 बुरिगंगा नदी प्रदूषित क्षेत्र",
      "estimatedValue": "-$6,800 USD (मृदा सुधार असंभव घोषित)",
      "specialFeature": "काले रासायनिक अपशिष्ट से भरी बुरिगंगा नदी के तटबंध पर जहरीली कीचड़ के ढेर पर पॉलीथीन और बांस से बना अति-लघु अस्थायी आश्रय।",
      "aiVerdict": "खिड़की खोलते ही सतरंगी रासायनिक तेल की परत वाली नदी दिखाई देने वाला विषैला वाटरफ्रंट व्यू घर।"
    },
    "81": {
      "title": "स्किबिडी टॉयलेट के गाने वाला निरंतर ओवरफ्लो होने वाला पीतल कमोड हाउस",
      "builtYear": "2023 यूट्यूब शॉर्ट्स वायरल विस्फोट दिवस",
      "estimatedValue": "-$75,000 USD (मनोचिकित्सा उपचार खर्च सहित)",
      "specialFeature": "कमोड का ढक्कन खोलते ही सिर बाहर निकलता है और 24 घंटे लत लगाने वाला थीम गीत गाता है, जबकि पानी लगातार ओवरफ्लो होता रहता है।",
      "aiVerdict": "कैमरामैन गठबंधन के मिसाइल दागने से पहले कानों में ईयरप्लग लगाकर भागने लायक डोपामाइन नरक।"
    },
    "183": {
      "title": "『टोक्यो घोल』 एंटीक बेसमेंट 11वां वार्ड अओगिरी ट्री टॉर्चर रूम यामोरी के सरौते के बगल की कुर्सी",
      "builtYear": "घोल निरोधक ब्यूरो (CCG) संघर्ष काल",
      "estimatedValue": "1,000 में से 7 घटाएं तो कितना बचेगा? (स्थायी यातना कक्ष)",
      "specialFeature": "कानों में लाल कनखजूरे रेंगते हैं, दसों उंगलियों और पंजों को सरौते से नोचा जाता है और बाल सफेद हो जाते हैं — यह वही यातना की कुर्सी है।",
      "aiVerdict": "केन कानेकी के घोल राजा के रूप में जागृत होने से पहले नरकीय दर्द झेलने वाला खून से सना टाइल फर्श वाला यातना कक्ष।"
    },
    "250": {
      "title": "थाईलैंड बैंकॉक बांग क्वांग सेंट्रल जेल मौत की सजा पाए कैदियों का बेड़ियों से जकड़ा फर्श",
      "builtYear": "1931 बैंकॉक हिल्टन जेल",
      "estimatedValue": "-$49,000 USD (24 घंटे लोहे की बेड़ियों का बोझ)",
      "specialFeature": "पैरों में 5 किलो की लोहे की बेड़ियां स्थायी रूप से वेल्ड की गई हैं, और चलते समय खनकती आवाज सुनते हुए कंक्रीट के फर्श पर इंतजार करना पड़ता है।",
      "aiVerdict": "कड़े अनुशासन और बैंकॉक की चिलचिलाती गर्मी में 5 किलो लोहे के भार से आजादी की कीमत समझाने वाला बैंकॉक हिल्टन सुइट।"
    },
    "500": {
      "title": "अमेरिका कंसास भूमिगत 15-मंजिला परमाणु मिसाइल साइलो रूपांतरित अति-लक्जरी सर्वाइवल कोंडो",
      "builtYear": "2015 एटलस एफ मिसाइल बेस का लक्जरी नवीनीकरण",
      "estimatedValue": "$2.6M USD (9-फीट कंक्रीट की बाहरी दीवारों से सुसज्जित)",
      "specialFeature": "शानदार आवास के 10,000 चरणों की ऐतिहासिक शुरुआत! परमाणु विस्फोट और ज़ॉम्बी सर्वनाश में भी 15 मंजिल नीचे स्विमिंग पूल, सिनेमा और हॉट स्प्रिंग में 5 साल का भोजन व आवास सुनिश्चित।",
      "aiVerdict": "दुनिया खत्म होने पर भी नेटफ्लिक्स देखते हुए शान से जीने के लिए बनाया गया अंतिम सर्वाइवल लक्जरी बंकर।"
    },
    "512": {
      "title": "टोक्यो रोप्पोंगी हिल्स मोरी टॉवर प्राइवेट आर्ट स्काईलाउंज प्राकृतिक संगमरमर और 24 कैरेट शुद्ध सोने से सजा निजी महल",
      "builtYear": "2029 प्रित्ज़कर पुरस्कार विजेता वास्तुकार द्वारा निर्मित",
      "estimatedValue": "अनुमानित ~$1.3M USD (ग्लोबल सोथबी नीलामी)",
      "specialFeature": "इलेक्ट्रिक ब्लाइंड्स हटते ही दुनिया के शीर्ष 3 पैनोरमिक दृश्यों में से एक सामने आ जाता है, और मिशेलिन 3-स्टार शेफ की रसोई 24 घंटे चालू रहती है।",
      "aiVerdict": "सफलता के शिखर पर पहुंचे व्यक्ति के लिए ही उपलब्ध बेजोड़ विलासिता का प्रतीक।"
    },
    "635": {
      "title": "『सोल (Soul)』 'ग्रेट बिफोर' व्यक्तित्व निर्माण पवेलियन का मुलायम बादलों वाला कमरा",
      "builtYear": "आत्माओं के जन्म से पूर्व की दुनिया",
      "estimatedValue": "जीवन की 1 चिंगारी (स्पार्क) (जीवन से प्रेम करने का जुनून)",
      "specialFeature": "गुरुत्वाकर्षण और भार रहित हल्के पेस्टल रंग की पहाड़ियों पर जहां आत्माएं अपनी-अपनी प्रतिभा और जीवन की चिंगारी खोजती हैं, वह जादुई स्थान।",
      "aiVerdict": "पियानो की धुन और पिज्जा के टुकड़े की महक में जीवन का सच्चा अर्थ समझाने वाला डिज़नी पिक्सर का आध्यात्मिक हीलिंग रूम।"
    },
    "820": {
      "title": "ओरियन नेबुला तारों के पालने के बीचों-बीच तारा जन्म इनक्यूबेटर पेंटहाउस",
      "builtYear": "ईस्वी 25,000 तारकीय साम्राज्य परिसंघ की स्थापना",
      "estimatedValue": "$2.9×10²¹ USD",
      "specialFeature": "आदिम गैस बादलों में नवजात तारों के पहली बार प्रज्वलित होने की चकाचौंध चमक को बिस्तर के सिरहाने से देखते हुए ब्रह्मांड के जन्म को लोरी की तरह सुनना।",
      "aiVerdict": "आकाशगंगा में सर्वश्रेष्ठ ग्रीनहाउस प्रभाव का दावा करने वाला तारकीय प्रसूति वार्ड का शीर्ष स्थान।"
    },
    "829": {
      "title": "『अप (UP)』 पैराडाइज फॉल्स के ऊपर हवा में तैरता 10,000 बहुरंगी हीलियम गुब्बारों वाला घर",
      "builtYear": "कार्ल और एली फ्रेडरिकसन का जीवन भर का आशियाना",
      "estimatedValue": "रोमांच का अमूल्य मूल्य (बचपन का वादा)",
      "specialFeature": "चिमनी से बंधे 10,000 रंग-बिरंगे गुब्बारे पूरे घर को आसमान में उड़ाते हैं और दक्षिण अमेरिका के पौराणिक झरने की चट्टान पर धीरे से उतारते हैं।",
      "aiVerdict": "अनमोल यादों और फोटो एलबम से भरे लिविंग रूम की खिड़की खोलते ही बादलों का स्वागत करने वाला दुनिया का सबसे गर्मजोशी भरा और रोमांटिक उड़ने वाला घर।"
    },
    "874": {
      "title": "स्विट्जरलैंड जुंगफ्राउजोख समुद्र तल से 3,454 मीटर टॉप ऑफ यूरोप आइस पैलेस स्फिंक्स वेधशाला कक्ष",
      "builtYear": "1912 जुंगफ्राउ माउंटेन रेलवे पूर्ण",
      "estimatedValue": "$125M USD (यूरोप के सबसे लंबे 22 किमी अलेत्श ग्लेशियर का प्रारंभिक बिंदु)",
      "specialFeature": "खड़ी चट्टान पर बनी स्फिंक्स वेधशाला में यूनेस्को अलेत्श ग्लेशियर की 22 किमी लंबी बर्फ की विशाल नदी को पैरों तले रखकर सोना।",
      "aiVerdict": "पहाड़ी ट्रेन से ग्लेशियर को चीरते हुए आल्प्स के स्थायी ग्लेशियर पर राज करने वाला टॉप ऑफ यूरोप पेंटहाउस।"
    },
    "999": {
      "title": "『राजा आर्थर की किंवदंती』 एवलॉन कैमलॉट गोलमेज के शूरवीर एक्सकैलिबर स्वर्ण भोज कक्ष महल",
      "builtYear": "ब्रिटेन मध्यकालीन किंवदंतियों का युग",
      "estimatedValue": "पवित्र ग्रिल और चट्टान में फंसी तलवार एक्सकैलिबर",
      "specialFeature": "ऊंच-नीच से मुक्त समतावादी गोलमेज पर 12 शूरवीर बैठकर जादूगर मर्लिन की भविष्यवाणी सुनते हैं और गौरवशाली रोमांच का संकल्प लेते हैं।",
      "aiVerdict": "शूरवीरता और मध्यकालीन रोमांस के सभी आदर्शों के साथ स्वर्ण ध्वज लहराने वाला अमर एवलॉन गढ़।"
    }
  },
  "vi": {
    "0": {
      "title": "Khe đá đơn cạnh mỏ lưu huỳnh Kawah Ijen, Indonesia",
      "builtYear": "4,5 tỷ năm TCN (Sản phẩm từ thời kỳ hình thành Trái Đất)",
      "estimatedValue": "-75 triệu USD (Phạt phục hồi nguyên trạng & Chi phí xử lý môi trường)",
      "specialFeature": "Mỗi đêm ngọn lửa lưu huỳnh xanh lam rực rỡ đóng vai trò đèn gián tiếp tự nhiên, hơi lưu huỳnh nồng nặc quanh năm giúp thông mũi mát họng.",
      "aiVerdict": "Chúc mừng! Khởi đầu cuộc sống hòa mình vào thiên nhiên, hấp thụ trọn vẹn nhiệt huyết bỏng cháy nhất của Trái Đất."
    },
    "60": {
      "title": "Nhà ván khối xi măng khe hẹp 80cm cuối cầu thang dốc Làng Gamcheon, Busan",
      "builtYear": "Dựng khẩn cấp khoảng năm 2013 (Hoàn thành tháng 11)",
      "estimatedValue": "~2.000 USD (Giá trị phế liệu & xà bần, chưa tính phí tháo dỡ)",
      "specialFeature": "Hẻm mê cung do người tị nạn bạt sườn núi xếp tầng xây nên, căn nhà ván chật chội dựng bằng gạch xi măng lọt thỏm trong khe 80cm cạnh nhà bên. Mở cửa ra là 148 bậc thang dốc đứng như vực thẳm, hụt chân một bước là lăn thẳng xuống biển.",
      "aiVerdict": "Không có nơi cư trú nào khắc nghiệt và chân thực hơn thế này để trui rèn bản năng sinh tồn nơi hoang dã."
    },
    "74": {
      "title": "Lán bạt nilon trên bờ kè bùn thải xưởng thuộc da Dhaka, Bangladesh",
      "builtYear": "1995 Khu vực ô nhiễm sông Buriganga",
      "estimatedValue": "-6.800 USD (Phán quyết đất nhiễm độc không thể phục hồi)",
      "specialFeature": "Căn lều tạm siêu nhỏ ghép bằng nilon và tre dựng ngay trên đống bùn độc hại ven bờ sông Buriganga, nơi nước thải hóa chất đen ngòm đổ về.",
      "aiVerdict": "Căn nhà view bờ sông độc hại, mở cửa sổ ra là thu trọn vào tầm mắt dòng sông lấp lánh váng dầu hóa chất cầu vồng."
    },
    "94": {
      "title": "Phòng cuối hành lang nứt toác sắp sập ở Tòa nhà Trắng (White Building) Phnom Penh, Campuchia",
      "builtYear": "1963 Nhà ở công cộng ven sông Bassac",
      "estimatedValue": "-13.000 USD (Khu vực cưỡng chế di dời theo lệnh giải tỏa)",
      "specialFeature": "Từng là kiệt tác kiến trúc hiện đại nhưng đã thoái hóa thành ổ ma túy và khu ổ chuột, vết nứt như rắn bò khắp tòa nhà và bụi bê tông rơi lả tả như mưa từ trần tường.",
      "aiVerdict": "Căn phòng trọ di tích lịch sử nơi bạn vừa đếm ngược ngày tòa nhà sụp đổ vừa lắng nghe tiếng bê tông kẽo kẹt rên rỉ."
    },
    "183": {
      "title": "『Tokyo Ghoul』 Ghế cạnh kìm Yamori trong phòng tra tấn Cây Aogiri, tầng hầm Quận 11 Anteiku",
      "builtYear": "Thời kỳ xung đột với Cục Phòng chống Ghoul (CCG)",
      "estimatedValue": "1.000 trừ 7 bằng bao nhiêu? (Phòng tra tấn vĩnh viễn)",
      "specialFeature": "Chiếc ghế tra tấn nơi rết đỏ bò vào tai, từng ngón tay ngón chân bị kìm bấm đứt lìa cho đến khi mái tóc hóa bạc trắng.",
      "aiVerdict": "Phòng tra tấn sàn gạch loang lổ máu, nơi Ken Kaneki nếm trải nỗi đau địa ngục trước khi thức tỉnh thành Vua Ghoul."
    },
    "250": {
      "title": "Sàn xi măng xích chân khu chờ tử hình Nhà tù Trung tâm Bang Kwang, Bangkok, Thái Lan",
      "builtYear": "1931 Nhà tù Bangkok Hilton",
      "estimatedValue": "-49.000 USD (Gánh nặng cùm xích sắt hàn chết 24/24)",
      "specialFeature": "Chân bị hàn chết xiềng xích nặng 5kg, mỗi bước đi vang lên tiếng sắt leng keng rợn người trong lúc chờ đợi trên sàn bê tông lạnh ngắt.",
      "aiVerdict": "Bangkok Hilton Suite nơi bạn thấm thía sức nặng của tự do qua khối sắt 5kg giữa kỷ luật thép và cái nóng ngột ngạt của Bangkok."
    },
    "276": {
      "title": "Nhà cắm trại ghế sau Daewoo Matiz màu vàng đời 1999 mất 3 bánh",
      "builtYear": "1999 Xuất xưởng nhà máy Daewoo Changwon",
      "estimatedValue": "240 USD (Giá phế liệu rã xe cũ)",
      "specialFeature": "Bảo hành không tai nạn trọn đời với tốc độ 0 km/h! Mở cốp phụ ghế phụ xe ra sẽ được tặng kèm khăn ướt và 3 đồng xu 100 won.",
      "aiVerdict": "Không lo tiếng ồn giữa các vách tường, nhưng hễ có chú mèo nào trèo lên nắp capo là xe rung lắc như tàu lượn siêu tốc."
    },
    "500": {
      "title": "Condo sinh tồn siêu sang cải tạo từ hầm phóng tên lửa hạt nhân sâu 15 tầng ngầm ở Kansas, Mỹ",
      "builtYear": "2015 Cải tạo xa xỉ từ căn cứ tên lửa Atlas F",
      "estimatedValue": "2,6 triệu USD (Trang bị tường bê tông dày 9 feet)",
      "specialFeature": "Khởi đầu lịch sử cho 10.000 cấp độ Nhà Siêu Đẳng! Đảm bảo 5 năm ăn ở với hồ bơi, rạp chiếu phim và suối nước nóng ngầm ở tầng sâu thứ 15, thách thức cả nổ hạt nhân lẫn đại dịch zombie.",
      "aiVerdict": "Boongke sinh tồn xa xỉ tột đỉnh giúp bạn thảnh thơi nằm xem Netflix tận hưởng cuộc sống vương giả ngay cả khi Trái Đất diệt vong."
    },
    "512": {
      "title": "Sky Lounge nghệ thuật tư nhân Mori Tower Roppongi Hills Tokyo - Cung điện riêng trang trí đá cẩm thạch tự nhiên và vàng ròng 24K",
      "builtYear": "2029 Kiến trúc sư đoạt giải Pritzker thế giới thi công",
      "estimatedValue": "Ước tính khoảng 1,3 triệu USD (Đấu giá quốc tế Sotheby's)",
      "specialFeature": "Rèm tự động kéo lên hé lộ tầm nhìn toàn cảnh top 3 thế giới, cùng bếp riêng phục vụ 24/24 của đầu bếp Michelin 3 sao.",
      "aiVerdict": "Tinh hoa xa xỉ tột bậc mà chỉ những người chạm đến đỉnh cao danh vọng mới có thể tận hưởng."
    },
    "546": {
      "title": "Chalet suối nước nóng lộ thiên riêng trong rừng bạch dương Niseko Annupuri, Hokkaido, Nhật Bản",
      "builtYear": "1888 Khách sạn lâu đài dãy Rocky",
      "estimatedValue": "5,9 triệu USD (Trung tâm di sản thế giới dãy Rocky)",
      "specialFeature": "Chalet tối giản kết hợp hiện đại giữa rừng Niseko Annupuri tuyết bột mịn nhất thế giới. Đắm mình trong bồn tắm gỗ Hinoki ngát hương lưu huỳnh giữa làn tuyết rơi nhẹ, trải nghiệm sự thanh lọc và chữa lành trọn vẹn.",
      "aiVerdict": "Cung điện di sản hàng đầu Bắc Mỹ kết hợp hài hòa vẻ tao nhã 130 năm lịch sử cùng cảnh quan ngoạn mục của dãy núi Rocky Canada."
    },
    "826": {
      "title": "Chalet siêu cấp Net-Zero kết nối trực tiếp nhà máy thu giữ carbon địa nhiệt Hellisheiði, Iceland",
      "builtYear": "2021 Trạm thu giữ carbon Climeworks Orca",
      "estimatedValue": "14,3 triệu USD (Hóa đá vĩnh viễn carbon trong khí quyển)",
      "specialFeature": "Chalet công nghệ cao tích cực với khí hậu (Climate Positive), trực tiếp thu giữ CO2 trong không khí và hóa đá vào nền đá bazan sâu dưới lòng đất.",
      "aiVerdict": "Căn chalet sinh thái tiên tiến nằm ở tuyến đầu công nghệ khí hậu nhân loại, nơi bạn chủ động làm sạch môi trường Trái Đất ngay trong lúc sinh sống."
    },
    "908": {
      "title": "Penthouse quách đá hoa cương đỏ Phòng Vua Khufu bên trong Đại Kim Tự Tháp Giza, Ai Cập",
      "builtYear": "Khoảng 2560 TCN Vương triều thứ 4",
      "estimatedValue": "3,8 tỷ USD (Kỳ quan duy nhất còn sót lại của Thế giới Cổ đại)",
      "specialFeature": "Tọa lạc tại trung tâm 2,3 triệu khối đá vôi khổng lồ, duy trì nhiệt độ 20 độ C ổn định quanh năm, cách âm hoàn hảo và tràn ngập năng lượng vũ trụ huyền bí.",
      "aiVerdict": "Chốn ngự trị vượt thời không ngay giữa trái tim kim tự tháp bất tử từ bình minh của nền văn minh nhân loại, nơi cảm nhận sự trường sinh của Pharaoh."
    },
    "999": {
      "title": "『Truyền thuyết Vua Arthur』 Lâu đài yến tiệc hoàng kim Hiệp sĩ Bàn Tròn Excalibur tại Camelot, Avalon",
      "builtYear": "Thời kỳ huyền thoại Trung cổ đảo Anh",
      "estimatedValue": "Chén Thánh và Thanh gươm trong đá Excalibur",
      "specialFeature": "12 hiệp sĩ quây quần quanh bàn tròn bình đẳng không phân biệt trên dưới, lắng nghe lời tiên tri của pháp sư Merlin và tuyên thệ bước vào những chuyến phiêu lưu vinh quang.",
      "aiVerdict": "Pháo đài Avalon bất diệt nơi ngọn cờ hoàng kim tung bay cùng toàn bộ lý tưởng của tinh thần hiệp sĩ và lãng mạn Trung cổ."
    }
  },
  "fr": {
    "0": {
      "title": "Fissure rocheuse individuelle près de la mine de soufre de Kawah Ijen, Indonésie",
      "builtYear": "4,5 milliards d'années av. J.-C. (Produit de la formation de la Terre)",
      "estimatedValue": "-75 M$ USD (Amende de remise en état et dépollution environnementale)",
      "specialFeature": "Chaque nuit, d'étincelantes flammes de soufre bleu font office d'éclairage d'ambiance naturel, tandis que les vapeurs de soufre piquantes débouchent les sinus en toute saison.",
      "aiVerdict": "Félicitations ! Le début d'une vie sauvage absorbant à pleins poumons la passion la plus brûlante de la planète Terre."
    },
    "60": {
      "title": "Bicoque en parpaings de 80 cm de large au bout des escaliers abrupts du village de Gamcheon, Busan",
      "builtYear": "Construction d'urgence vers 2013 (Achevée en novembre)",
      "estimatedValue": "~2 000 $ USD (Valeur de la ferraille et des gravats, frais de démolition en sus)",
      "specialFeature": "Dans les ruelles en labyrinthe taillées à flanc de colline par les réfugiés, une cabane étriquée bâtie en parpaings dans un interstice de 80 cm contre la maison voisine. En ouvrant la porte, 148 marches vertigineuses se déploient au bord du gouffre, où le moindre faux pas promet de vous faire rouler jusqu'à la mer.",
      "aiVerdict": "Il n'existe aucun logis plus impitoyable et authentique pour forger son instinct de survie en milieu hostile."
    },
    "74": {
      "title": "Serre en bâche plastique sur la digue de boues toxiques d'une tannerie à Dacca, Bangladesh",
      "builtYear": "1995 Zone polluée de la rivière Buriganga",
      "estimatedValue": "-6 800 $ USD (Déclaré sol non dépolluable)",
      "specialFeature": "Un abri de fortune minuscule tressé de bambou et de plastique, perché sur un monticule de boue toxique le long de la rivière Buriganga où s'écoulent des effluents chimiques noirs.",
      "aiVerdict": "Une maison avec vue sur un front de mer toxique : ouvrez la fenêtre et contemplez les reflets irisés des nappes d'hydrocarbures chimiques."
    },
    "99": {
      "title": "『DOOM』 Zone de maintenance du filtre à plasma du portail infernal sur la base UAC de Mars",
      "builtYear": "2149 Effondrement du portail d'énergie Argent",
      "estimatedValue": "-66,66 M$ USD (Jauge de rage du Doomguy au maximum)",
      "specialFeature": "Du sang ruisselle le long des parois et des morceaux de chair démoniaque s'enchevêtrent dans les conduits de plasma pendant que vous tremblez de terreur au son du rechargement du fusil de chasse.",
      "aiVerdict": "La salle d'attente des agents d'entretien dans la zone de massacre du Doom Slayer, où les démons sont déchiquetés à chaque riff de guitare heavy metal."
    },
    "106": {
      "title": "Abri de fortune dans un vieux réfrigérateur retourné au sommet du village culturel de Gamcheon, Busan",
      "builtYear": "1998 Recyclage d'un réfrigérateur de faillite de la crise du FMI",
      "estimatedValue": "-2 600 $ USD (Valeur de ferraille 9 $ USD)",
      "specialFeature": "Une capsule individuelle sur mesure conçue en arrachant les portes d'un réfrigérateur américain tombé sur le mur de soutènement de la route en corniche et en grattant l'isolation en polystyrène.",
      "aiVerdict": "Un foyer électroménager quatre saisons : sauna sec étouffant en été et congélateur parfait en hiver."
    },
    "183": {
      "title": "『Tokyo Ghoul』 Chaise à côté des tenailles de Yamori dans la salle de torture de l'Arbre Aogiri, sous-sol du 11e arrondissement d'Anteiku",
      "builtYear": "Époque des affrontements avec le Centre de Contrôle des Goules (CCG)",
      "estimatedValue": "Combien font 1 000 moins 7 ? (Chambre de torture permanente)",
      "specialFeature": "La chaise de supplice où des mille-pattes rouges s'insinuent dans vos oreilles, où les doigts et orteils sont arrachés aux tenailles et où la chevelure vire au blanc immaculé.",
      "aiVerdict": "La salle de torture au sol carrelé maculé de sang où Ken Kaneki a enduré les tourments de l'enfer avant de s'éveiller en Roi des Goules."
    },
    "250": {
      "title": "Sol entravé du quartier des condamnés à mort de la prison centrale de Bang Kwang, Bangkok, Thaïlande",
      "builtYear": "1931 Prison du Bangkok Hilton",
      "estimatedValue": "-49 000 $ USD (Poids des fers soudés aux chevilles 24h/24)",
      "specialFeature": "Des chaînes en acier de 5 kg soudées en permanence aux chevilles, attendant sur le sol en béton au son métallique grinçant à chacun de vos pas.",
      "aiVerdict": "La suite Bangkok Hilton, où la rigueur implacable et la chaleur écrasante vous font mesurer le poids de la liberté à travers 5 kg de fonte brute."
    },
    "337": {
      "title": "『WALL-E』 Fissure d'un boulon rouillé géant au pied d'une tour de cubes d'ordures compressées",
      "builtYear": "An 2805 Temps de la Terre abandonnée",
      "estimatedValue": "0 $ USD (Réservé au seul être vivant de la planète : le cafard)",
      "specialFeature": "Blotti entre les parois de cubes où des millions de tonnes de déchets s'élèvent à la hauteur de gratte-ciels, vous dormez recroquevillé à l'abri des tempêtes de sable.",
      "aiVerdict": "Un studio post-apocalyptique où vous vivez 700 ans après l'abandon de la Terre par l'humanité, au son feutré des chenilles du robot nettoyeur compactant inlassablement les détritus."
    },
    "343": {
      "title": "『Les Simpson』 Sous la console de commande du réacteur nucléaire où Homer a renversé des miettes de beignet",
      "builtYear": "Centrale nucléaire de Springfield, secteur 7G",
      "estimatedValue": "-50 M$ USD (48 alarmes consécutives de fusion du cœur)",
      "specialFeature": "Vous faites la sieste directement sous le repose-pieds de la console d'arrêt d'urgence du réacteur, dont les boutons sont englués de confiture de beignet par Homer.",
      "aiVerdict": "Une maison à haut risque nucléaire nichée sous les pieds du pire inspecteur de sécurité au monde, rythmée par la sirène de fusion en guise de réveil."
    },
    "392": {
      "title": "Bunker de confinement en béton sur les rives hautement radioactives du lac Karatchaï, Tcheliabinsk, Russie",
      "builtYear": "1951 Site de stockage des déchets nucléaires de Maïak",
      "estimatedValue": "-7,5 M$ USD (Dose mortelle en 1 heure de séjour)",
      "specialFeature": "Un lac mortel entièrement recouvert de blocs de béton où une exposition d'une heure seulement délivre une dose fatale de 600 roentgens.",
      "aiVerdict": "La zone à risque radiologique ultime, au milieu d'un tombeau de béton saturé de matières radioactives où séjourner nécessite un tablier de plomb."
    },
    "500": {
      "title": "Condo de survie ultra-luxueux aménagé dans un silo de missile nucléaire de 15 étages sous terre au Kansas, États-Unis",
      "builtYear": "2015 Reconversion luxueuse d'une base de missiles Atlas F",
      "estimatedValue": "2,6 M$ USD (Murs extérieurs en béton armé de 9 pieds)",
      "specialFeature": "Le départ historique des 10 000 niveaux des Maisons Légendaires ! Piscine, cinéma et bains thermaux au 15e sous-sol garantissant 5 ans d'autonomie face aux explosions nucléaires et à l'apocalypse zombie.",
      "aiVerdict": "Le bunker de survie haut de gamme par excellence, où vous mènerez la belle vie devant Netflix même si la planète s'effondre."
    },
    "512": {
      "title": "Sky Lounge d'art privé de la Mori Tower à Roppongi Hills, Tokyo - Palais privé orné de marbre naturel et d'or pur 24 carats",
      "builtYear": "2029 Conçu par un architecte lauréat du prix Pritzker",
      "estimatedValue": "Estimation d'environ 1,3 M$ USD (Vente aux enchères internationale Sotheby's)",
      "specialFeature": "Lorsque les stores motorisés se lèvent, l'un des trois plus beaux panoramas du monde s'offre à vous, avec une cuisine privée animée 24h/24 par un chef 3 étoiles Michelin.",
      "aiVerdict": "La quintessence du luxe absolu, réservée uniquement à ceux qui ont atteint le sommet de la réussite."
    },
    "999": {
      "title": "『Légende arthurienne』 Château de la salle de banquet doré des Chevaliers de la Table Ronde et d'Excalibur à Camelot, Avalon",
      "builtYear": "Ère des légendes médiévales de Bretagne",
      "estimatedValue": "Le Saint Graal et l'Épée dans la pierre Excalibur",
      "specialFeature": "Douze chevaliers assis autour d'une Table Ronde égalitaire sans préséance, écoutant les prophéties de Merlin l'Enchanteur et jurant de partir pour de glorieuses quêtes.",
      "aiVerdict": "L'immortelle forteresse d'Avalon où flottent les bannières d'or incarnant tous les idéaux de la chevalerie et du roman courtois médiéval."
    }
  },
  "pt": {
    "0": {
      "title": "Fresta de rocha individual ao lado da mina de enxofre de Kawah Ijen, Indonésia",
      "builtYear": "4,5 bilhões a.C. (Produto da era de formação da Terra)",
      "estimatedValue": "-$75M USD (Multa de recuperação ambiental e custo de despoluição)",
      "specialFeature": "Todas as noites, chamas azul-turquesa de enxofre brilham como iluminação indireta natural, enquanto vapores sulfurosos penetrantes desobstruem as vias respiratórias o ano todo.",
      "aiVerdict": "Parabéns! O início de uma vida selvagem que absorve no próprio corpo a paixão mais ardente do planeta Terra."
    },
    "60": {
      "title": "Barraco de blocos em fresta de 80 cm no fim da escadaria íngreme da Vila Gamcheon, Busan",
      "builtYear": "Construção de emergência por volta de 2013 (Concluída em novembro)",
      "estimatedValue": "~$2.000 USD (Valor de sucata e entulho, taxa de demolição não inclusa)",
      "specialFeature": "Nos becos labirínticos esculpidos na encosta pelos refugiados, um barraco apertado de blocos de cimento erguido numa brecha de 80 cm rente à casa vizinha. Ao abrir a porta, revelam-se 148 degraus vertiginosos que parecem um abismo, onde um passo em falso fará você rolar até o mar.",
      "aiVerdict": "Não há moradia mais implacável e honesta para forjar o instinto de sobrevivência na selva urbana."
    },
    "74": {
      "title": "Barraca de lona plástica sobre dique de lodo tóxico de curtume em Daca, Bangladesh",
      "builtYear": "1995 Zona poluída do rio Buriganga",
      "estimatedValue": "-$6.800 USD (Sentença de solo irrecuperável por contaminação)",
      "specialFeature": "Um minúsculo abrigo improvisado de bambu e plástico sobre montes de lodo tóxico na margem do rio Buriganga, onde correm efluentes químicos negros.",
      "aiVerdict": "Uma residência à beira-rio tóxica: abra a janela e contemple o rio cintilando com faixas oleosas multicoloridas de dejetos químicos."
    },
    "95": {
      "title": "『Bloodborne』 Andaime de madeira sob a lua de sangue na torre do relógio de Old Yharnam entre feras uivantes",
      "builtYear": "Noite da Caçada",
      "estimatedValue": "-500.000 Ecos de Sangue (Barra de Frenesi em 99%)",
      "specialFeature": "Encolhido em um andaime podre de madeira suspenso no ar em Old Yharnam sob o fogo cruzado da metralhadora giratória de Djura, respirando o cheiro de sangue.",
      "aiVerdict": "A cobertura do desespero feita sob medida para caçadores que contemplam as ruas onde homens se transformam em bestas sob a lua carmesim."
    },
    "183": {
      "title": "『Tokyo Ghoul』 Cadeira ao lado do alicate de Yamori na câmara de tortura da Árvore Aogiri, subsolo do Distrito 11 de Anteiku",
      "builtYear": "Período de confronto com a Comissão de Contramedidas Ghoul (CCG)",
      "estimatedValue": "Quanto é 1.000 menos 7? (Câmara de tortura permanente)",
      "specialFeature": "A infame cadeira de tortura onde lacraias vermelhas rastejam para dentro do ouvido, os dedos das mãos e dos pés são arrancados com alicate e os cabelos se tornam brancos como a neve.",
      "aiVerdict": "A câmara de tortura de azulejos manchados de sangue onde Ken Kaneki suportou o tormento infernal antes de despertar como o Rei de Um Olho só."
    },
    "250": {
      "title": "Chão de grilhões da ala do corredor da morte da Prisão Central de Bang Kwang, Bangkok, Tailândia",
      "builtYear": "1931 Prisão Bangkok Hilton",
      "estimatedValue": "-$49.000 USD (Fardo de correntes soldadas 24 horas por dia)",
      "specialFeature": "Com correntes de ferro de 5 kg soldadas permanentemente às pernas, esperando sobre o chão de concreto enquanto ouve o tilintar metálico a cada passo.",
      "aiVerdict": "A suíte Bangkok Hilton, onde sob disciplina brutal e calor sufocante você sente o peso da liberdade em 5 kg de ferro fundido."
    },
    "291": {
      "title": "『Bleach』 Fresta de rocha varrida pelo vento no centro de treinamento gigante sob a Loja Urahara",
      "builtYear": "Treinamento para a invasão da Soul Society",
      "estimatedValue": "-20.000.000 Kan (Destruição da Zanpakuto se o treino de Shikai falhar)",
      "specialFeature": "Escondido sob estilhaços de pedra lançados pelos golpes cortantes de Ichigo enquanto ele treina a Bankai em um campo subterrâneo de 500 metros de altura sob uma loja de doces.",
      "aiVerdict": "Um abrigo em meio à poeira no centro de um perigoso campo de treino de Shinigami, vigiado por Kisuke Urahara abanando seu leque sob o chapéu."
    },
    "500": {
      "title": "Condomínio de sobrevivência ultraluxuoso em silo de míssil nuclear de 15 andares subterrâneos no Kansas, EUA",
      "builtYear": "2015 Reforma luxuosa da base de mísseis Atlas F",
      "estimatedValue": "$2.6M USD (Equipado com paredes externas de concreto de 9 pés)",
      "specialFeature": "O marco inicial histórico das 10.000 fases das Casas Lendárias! Piscina, cinema e fontes termais no 15º subsolo garantindo 5 anos de subsistência contra ogivas nucleares e apocalipse zumbi.",
      "aiVerdict": "O bunker de luxo supremo para sobreviver com estilo assistindo à Netflix, mesmo que o mundo acabe."
    },
    "512": {
      "title": "Sky Lounge de arte privativo da Mori Tower em Roppongi Hills, Tóquio - Palácio exclusivo decorado com mármore natural e ouro puro 24K",
      "builtYear": "2029 Construído por arquiteto laureado com o Prêmio Pritzker",
      "estimatedValue": "Avaliação estimada em ~$1.3M USD (Leilão Global da Sotheby's)",
      "specialFeature": "Quando as persianas elétricas se abrem, surge uma das 3 vistas panorâmicas mais espetaculares do planeta, com uma cozinha privativa de chef 3 estrelas Michelin ativa 24 horas.",
      "aiVerdict": "A essência do luxo supremo, acessível apenas a quem atingiu o zênite do sucesso."
    },
    "645": {
      "title": "『Dragon Ball Super』 Palácio cósmico transcendental em forma de água-viva do Grande Zen'oh",
      "builtYear": "Vazio primordial anterior à criação dos 12 universos",
      "estimatedValue": "Todos os 12 universos inteiros (Com poder de apagamento instantâneo)",
      "specialFeature": "O trono do Deus Supremo que pode apagar um universo inteiro com um simples estalar de dedos se algo o desagradar.",
      "aiVerdict": "A residência do poder absoluto, onde é preciso se comportar como um bobo da corte todos os dias para mantê-lo entretido e evitar a extinção cósmica."
    },
    "785": {
      "title": "『StarCraft II』 Sala de jukebox no lounge do Comandante Raynor a bordo da nave capitânia terrana Hyperion",
      "builtYear": "Reforma da nave rebelde contra a Supremacia",
      "estimatedValue": "1 Cruzador de Batalha (Incalculável)",
      "specialFeature": "Música country clássica tocando na jukebox enquanto você saboreia uma cerveja gelada na companhia de Tychus Findlay.",
      "aiVerdict": "O refúgio acolhedor de heróis caubóis endurecidos que lutam pela liberdade do Setor Koprulu."
    },
    "991": {
      "title": "『Bleach』 Topo da cidade flutuante da Dimensão Real de Hyosube Ichibei no Palácio Real",
      "builtYear": "Pilar de sustentação dos Três Mundos (Mundo Humano, Soul Society e Hueco Mundo)",
      "estimatedValue": "Partes do corpo do Rei das Almas que sustentam o equilíbrio do mundo",
      "specialFeature": "Superando os limites do poder espiritual através de fontes termais e treinos no topo das cinco cidades que flutuam em espiral ao redor do Palácio Central do Rei das Almas.",
      "aiVerdict": "A suíte sagrada do Palácio Real reservada exclusivamente à Divisão Zero, os pilares que sustentam a própria ordem do cosmos."
    },
    "999": {
      "title": "『Lenda do Rei Arthur』 Castelo do salão de banquetes de ouro dos Cavaleiros da Távola Redonda e Excalibur em Camelot, Avalon",
      "builtYear": "Era lendária medieval da Britânia",
      "estimatedValue": "O Santo Graal e a Espada na Rocha Excalibur",
      "specialFeature": "Doze cavaleiros reunidos em torno de uma Távola Redonda sem hierarquia, ouvindo as profecias do mago Merlin e jurando partir para gloriosas aventuras.",
      "aiVerdict": "A fortaleza imortal de Avalon, onde estandartes dourados tremulam exibindo os mais nobres ideais da cavalaria e do romance medieval."
    }
  },
  "es": {
    "0": {
      "title": "Grieta rocosa individual junto a la mina de azufre de Kawah Ijen, Indonesia",
      "builtYear": "4.500 millones a.C. (Producto de la formación de la Tierra)",
      "estimatedValue": "-$75M USD (Multa de restauración ambiental y costo de descontaminación)",
      "specialFeature": "Cada noche, las deslumbrantes llamas azules de azufre sirven de luz indirecta natural, y los vapores sulfurosos penetrantes despejan las vías respiratorias durante todo el año.",
      "aiVerdict": "¡Felicidades! El inicio de una vida silvestre que absorbe en todo el cuerpo la pasión más ardiente del planeta Tierra."
    },
    "60": {
      "title": "Choza de bloques en hueco de 80 cm al final de la empinada escalera de la aldea Gamcheon, Busan",
      "builtYear": "Construcción de emergencia hacia 2013 (Finalizada en noviembre)",
      "estimatedValue": "~$2.000 USD (Valor de chatarra y escombros, tarifa de demolición aparte)",
      "specialFeature": "En los callejones laberínticos tallados en la ladera por los refugiados, una diminuta caseta levantada con bloques de cemento en un espacio de 80 cm contra la casa contigua. Al abrir la puerta, 148 escalones empinados se abren como un precipicio, donde un mal paso te hará rodar directo hasta el mar.",
      "aiVerdict": "No existe un hogar más implacable y honesto para forjar el instinto de supervivencia salvaje."
    },
    "74": {
      "title": "Cobertizo de plástico sobre el dique de lodo tóxico de una curtiduría en Daca, Bangladés",
      "builtYear": "1995 Zona contaminada del río Buriganga",
      "estimatedValue": "-$6.800 USD (Declarado suelo no remediable por contaminación)",
      "specialFeature": "Una diminuta chabola improvisada de plástico y bambú sobre montículos de lodo tóxico en la ribera del río Buriganga, donde desembocan residuos químicos negros.",
      "aiVerdict": "Una casa frente a un río tóxico: abre la ventana y contempla las aguas teñidas con destellos de hidrocarburos multicolores."
    },
    "183": {
      "title": "『Tokyo Ghoul』 Silla junto a las tenazas de Yamori en la sala de tortura del Árbol Aogiri, sótano del Distrito 11 de Anteiku",
      "builtYear": "Época de enfrentamientos con la Comisión de Contramedidas Ghoul (CCG)",
      "estimatedValue": "¿Cuánto es 1.000 menos 7? (Cámara de tortura permanente)",
      "specialFeature": "La silla de tormento donde ciempiés rojos se introducen por las orejas, los dedos de manos y pies son arrancados con tenazas y el cabello se torna blanco como la nieve.",
      "aiVerdict": "La sala de tortura con suelo de baldosas ensangrentadas donde Ken Kaneki soportó el dolor del infierno antes de despertar como el Rey Ghoul."
    },
    "200": {
      "title": "Cabaña de balsa flotante de bambú sobre el río Citarum en Bandung, Indonesia, cubierta de basura donde el agua no se ve",
      "builtYear": "Construcción de emergencia hacia 1969 (Finalizada en agosto)",
      "estimatedValue": "~$2.170 USD (Cotización de chatarra y materiales desechables, demolición aparte)",
      "specialFeature": "Una choza flotante sobre el río Citarum, catalogado como el más contaminado del mundo, cuya superficie está alfombrada por cientos de miles de toneladas de plástico. En lugar de remar, puedes cruzar caminando sobre la densa alfombra de desechos mientras intentas conciliar el sueño.",
      "aiVerdict": "No existe un alojamiento más despiadado y crudo para cultivar la supervivencia en estado puro."
    },
    "250": {
      "title": "Suelo encadenado del pabellón de condenados a muerte de la prisión central de Bang Kwang, Bangkok, Tailandia",
      "builtYear": "1931 Prisión Bangkok Hilton",
      "estimatedValue": "-$49.000 USD (Carga de grilletes soldados las 24 horas del día)",
      "specialFeature": "Con grilletes de hierro de 5 kg soldados permanentemente a las piernas, esperando sobre el suelo de hormigón mientras escuchas el tintineo metálico a cada paso.",
      "aiVerdict": "La suite Bangkok Hilton, donde bajo una disciplina atroz y un calor sofocante sientes el peso de la libertad en 5 kg de hierro macizo."
    },
    "422": {
      "title": "Sombra de árbol seco de 500 años bajo las dunas rojas del desierto de Namib, Namibia",
      "builtYear": "Deadvlei - Acacias secas desde hace 900 años",
      "estimatedValue": "-$13.500 USD (Cero suministro de agua en un radio de 200 km)",
      "specialFeature": "Extiende tu saco de dormir a la sombra de una acacia espinosa petrificada y ennegrecida sobre una llanura de arcilla blanca, contemplando la duna roja de 300 metros (Duna 45).",
      "aiVerdict": "La suite de árboles secos de Deadvlei, que brinda una desolación surrealista como sacada de un lienzo de Salvador Dalí."
    },
    "500": {
      "title": "Condominio de supervivencia ultralujoso remodelado en un silo de misiles nucleares de 15 pisos bajo tierra en Kansas, EE. UU.",
      "builtYear": "2015 Remodelación de lujo de la base de misiles Atlas F",
      "estimatedValue": "$2.6M USD (Completamente equipado con muros exteriores de hormigón de 9 pies)",
      "specialFeature": "¡El histórico inicio de los 10.000 niveles de Casas Legendarias! Piscina, cine y aguas termales en el piso subterráneo 15 con sustento garantizado para 5 años ante bombas atómicas o apocalipsis zombi.",
      "aiVerdict": "El búnker de supervivencia de lujo definitivo para vivir como un rey viendo Netflix incluso si el mundo se acaba."
    },
    "512": {
      "title": "Sky Lounge de arte privado en Mori Tower, Roppongi Hills, Tokio - Palacio exclusivo con mármol natural y oro puro de 24K",
      "builtYear": "2029 Diseñado por un arquitecto ganador del Premio Pritzker",
      "estimatedValue": "Valor estimado en ~$1.3M USD (Subasta Global de Sotheby's)",
      "specialFeature": "Al levantarse las persianas motorizadas se despliega una de las 3 vistas panorámicas más deslumbrantes del mundo, con cocina privada atendida las 24 horas por un chef 3 estrellas Michelin.",
      "aiVerdict": "La cumbre del lujo supremo, reservada únicamente para quienes han conquistado la cima del éxito."
    },
    "654": {
      "title": "Ático superior en 220 Central Park South, Billionaires' Row, Manhattan, Nueva York, EE. UU.",
      "builtYear": "2019 Torre de multimillonarios diseñada por Robert A.M. Stern",
      "estimatedValue": "$210M USD (Venta residencial más cara en la historia de EE. UU.)",
      "specialFeature": "Un ático tríplex a 290 metros de altura que domina Central Park en perfecta simetría como una alfombra verde rectangular.",
      "aiVerdict": "El trono definitivo sobre el horizonte de Manhattan adquirido por el multimillonario de fondos de cobertura Ken Griffin, símbolo del pináculo del capitalismo global."
    },
    "896": {
      "title": "Suite real dorada directamente bajo la Creación de Adán de Miguel Ángel en la Capilla Sixtina, Ciudad del Vaticano",
      "builtYear": "1481 Papa Sixto IV",
      "estimatedValue": "Incalculable (El santuario supremo del Renacimiento de la humanidad)",
      "specialFeature": "Un espacio milagroso en el templo donde se celebra el cónclave papal, durmiendo mientras contemplas el dedo creador de Dios hacia Adán pintado por Miguel Ángel.",
      "aiVerdict": "El cenit del patrimonio cultural humano, envuelto por las mayores obras maestras del arte occidental donde la emoción del Espíritu Santo estremece el alma."
    },
    "924": {
      "title": "Villa infinita sobre la pasarela de cristal Skywalk a 1.200 m de altura al borde del Gran Cañón, EE. UU.",
      "builtYear": "2007 Reserva India Hualapai",
      "estimatedValue": "$64M USD (Vista panorámica a 2.000 millones de años de estratos geológicos)",
      "specialFeature": "Una villa suspendida en el aire con suelo de vidrio templado de 5 capas que deja ver directamente el fondo del cañón del río Colorado a 1.200 metros de profundidad.",
      "aiVerdict": "El mejor refugio natural para levitar en el corazón de la colosal escultura tallada por la Madre Tierra durante 2.000 millones de años."
    },
    "999": {
      "title": "『Leyenda del Rey Arturo』 Castillo del banquete dorado de los Caballeros de la Mesa Redonda y Excálibur en Camelot, Ávalon",
      "builtYear": "Era de las leyendas medievales de Britania",
      "estimatedValue": "El Santo Grial y la Espada en la Piedra Excálibur",
      "specialFeature": "Doce caballeros sentados en torno a una Mesa Redonda igualitaria sin jerarquías, escuchando las profecías de Merlín y jurando emprender gloriosas gestas.",
      "aiVerdict": "La fortaleza inmortal de Ávalon donde ondean estandartes dorados que encarnan todos los ideales de la caballería y el romance medieval."
    }
  },
  "id": {
    "0": {
      "title": "Celah batu satu orang di dekat tambang belerang Kawah Ijen, Indonesia",
      "builtYear": "4,5 miliar tahun SM (Produk dari era pembentukan Bumi)",
      "estimatedValue": "-$75M USD (Denda pemulihan lingkungan & Biaya dekontaminasi)",
      "specialFeature": "Setiap malam api belerang biru menyala anggun sebagai pencahayaan temaram alami, dan uap belerang menyengat sepanjang tahun melegakan hidung tersumbat.",
      "aiVerdict": "Selamat! Awal dari kehidupan alami yang menyerap gairah terpanas Bumi ke seluruh tubuh Anda."
    },
    "31": {
      "title": "『Cyberpunk 2077』 Kapsul freezer rusak di tempat pembuangan sampah pinggiran Night City",
      "builtYear": "2077 Tempat pembuangan sampah pinggiran Night City",
      "estimatedValue": "-500 Eddie (Risiko pembongkaran rongsokan cyberware)",
      "specialFeature": "Menendang pintu lemari es tua yang dibuang oleh Dexter DeShawn, lalu tidur beralaskan tumpukan sampah cyberware yang rusak.",
      "aiVerdict": "Kamar kelas bawah tempat Anda menatap gemerlap neon cakrawala Night City dari atas tumpukan sampah ditemani omelan Johnny Silverhand."
    },
    "60": {
      "title": "Gubuk blok semen celah 80 cm di ujung tangga curam Desa Gamcheon, Busan",
      "builtYear": "Pembangunan darurat sekitar 2013 (Selesai November)",
      "estimatedValue": "~$2.000 USD (Nilai besi tua & puing, biaya pembongkaran belum termasuk)",
      "specialFeature": "Gang berliku bak labirin yang dipahat para pengungsi di lereng bukit, gubuk sempit dari blok semen yang didirikan di celah 80 cm tepat di samping rumah tetangga. Saat pintu dibuka, terbentang 148 anak tangga curam bak jurang yang bisa membuat Anda menggelinding hingga ke laut bila salah melangkah.",
      "aiVerdict": "Tidak ada tempat tinggal yang lebih keras dan jujur dari ini untuk mengasah naluri bertahan hidup di alam liar."
    },
    "74": {
      "title": "Pondok terpal plastik di atas tanggul lumpur limbah pabrik penyamakan kulit Dhaka, Bangladesh",
      "builtYear": "1995 Zona tercemar Sungai Buriganga",
      "estimatedValue": "-$6.800 USD (Tanah divonis tidak dapat dipulihkan)",
      "specialFeature": "Gubuk darurat super mini berbahan plastik dan bambu di atas gundukan lumpur beracun di tanggul Sungai Buriganga tempat limbah kimia hitam mengalir.",
      "aiVerdict": "Rumah pemandangan tepi sungai beracun: buka jendela untuk menyaksikan aliran sungai yang berkilau dengan lapisan minyak kimia aneka warna."
    },
    "183": {
      "title": "『Tokyo Ghoul』 Kursi di samping tang Yamori di ruang penyiksaan Pohon Aogiri, ruang bawah tanah Distrik 11 Anteiku",
      "builtYear": "Masa konflik dengan Komisi Penanggulangan Ghoul (CCG)",
      "estimatedValue": "Berapa 1.000 dikurangi 7? (Ruang penyiksaan permanen)",
      "specialFeature": "Kursi siksaan tempat kelabang merah merayap ke dalam telinga, sepuluh jari tangan dan kaki dicabut dengan tang, hingga rambut berubah menjadi putih pucat.",
      "aiVerdict": "Ruang penyiksaan berlantai ubin berlumuran darah tempat Ken Kaneki menanggung siksaan neraka sebelum bangkit menjadi Raja Ghoul."
    },
    "250": {
      "title": "Lantai berbelenggu di blok terpidana mati Penjara Pusat Bang Kwang, Bangkok, Thailand",
      "builtYear": "1931 Penjara Bangkok Hilton",
      "estimatedValue": "-$49.000 USD (Beban belenggu rantai besi yang dilas 24 jam)",
      "specialFeature": "Belenggu rantai besi seberat 5 kg dilas mati di kaki, menunggu di lantai beton sambil mendengarkan gemerincing logam setiap kali melangkah.",
      "aiVerdict": "Bangkok Hilton Suite tempat Anda merasakan beratnya kebebasan melalui besi seberat 5 kg di tengah kedisiplinan brutal dan teriknya hawa Bangkok."
    },
    "296": {
      "title": "Rumah terpencil di pulau tak berpenghuni Elliðaey, Islandia (3 hari ke toserba tanpa perahu)",
      "builtYear": "1953 Didirikan oleh Asosiasi Pemburu Burung Puffin",
      "estimatedValue": "$105.000 USD (Pemandangan alam 100 poin / Jarak ke minimarket 0 poin)",
      "specialFeature": "Hanya rumah ini satu-satunya yang berdiri di seluruh pulau; jika ingin protes soal kebisingan tetangga, Anda harus menggugat 20.000 ekor burung puffin.",
      "aiVerdict": "Tempat perlindungan ujung dunia terbaik bagi mereka yang lelah bersosialisasi dan ingin menyendiri secara mutlak."
    },
    "376": {
      "title": "Kamar ondol 3 meter persegi di samping pemandian umum berubin terkelupas di gang penginapan tua Daeheung-dong, Daejeon",
      "builtYear": "1987 Zona tanpa hukum Kowloon Walled City",
      "estimatedValue": "$28.500 USD (Hak huni tanpa izin pasar gelap)",
      "specialFeature": "Kamar ondol seluas 3 meter persegi tepat di samping kamar mandi umum penginapan tua tahun 1970-an tempat para pekerja kereta api dan pedagang keliling Stasiun Daejeon beristirahat. Suara peluit kereta Jalur Gyeongbu bergema sayup-sayup melewati keran berkarat yang menetes dan dinding ubin mosaik yang terkelupas.",
      "aiVerdict": "Kawasan kumuh cyberpunk yang mendebarkan di puncak labirin beton tanpa hukum tempat Anda mendongak menatap roda pesawat terbang."
    },
    "500": {
      "title": "Kondo bertahan hidup super mewah hasil renovasi silo rudal nuklir bawah tanah 15 lantai di Kansas, AS",
      "builtYear": "2015 Renovasi mewah pangkalan rudal Atlas F",
      "estimatedValue": "$2.6M USD (Dilengkapi dinding luar beton setebal 9 kaki)",
      "specialFeature": "Awal bersejarah dari 10.000 tingkatan Rumah Spektakuler! Kolam renang, bioskop, dan pemandian air panas di bawah tanah lantai 15 menjamin sandang pangan selama 5 tahun bahkan saat ledakan nuklir dan kiamat zombi melanda.",
      "aiVerdict": "Bunker bertahan hidup ultra-mewah tempat Anda bisa bersantai menonton Netflix dan menikmati hidup meski dunia kiamat."
    },
    "512": {
      "title": "Sky Lounge seni privat Mori Tower Roppongi Hills Tokyo - Istana pribadi berlapis marmer alami dan emas murni 24K",
      "builtYear": "2029 Dibangun oleh arsitek pemenang Pritzker Prize dunia",
      "estimatedValue": "Estimasi sekitar ~$1.3M USD (Lelang Global Sotheby's)",
      "specialFeature": "Saat tirai otomatis terangkat, pemandangan panorama top 3 dunia terhampar di depan mata, didukung dapur khusus koki bintang 3 Michelin yang beroperasi 24 jam.",
      "aiVerdict": "Puncak kemewahan luar biasa yang hanya bisa dinikmati oleh mereka yang telah mencapai puncak kesuksesan."
    },
    "677": {
      "title": "『007 No Time to Die』 Vila privat canggih di dalam gua kuno Sassi di Matera, Italia",
      "builtYear": "Tahun Kekaisaran 10191 Selesai dibangun oleh Kekaisaran Padishah",
      "estimatedValue": "10.000 ton Rempah Melange (Cukup untuk membeli 3 sistem bintang)",
      "specialFeature": "Gua batu kapur Sassi warisan UNESCO berusia ribuan tahun yang disulap menjadi vila rahasia berkonsep minimalis mewah. Matahari terbenam keemasan menyinari tebing jurang, sementara sistem keamanan antipeluru menjamin persembunyian sempurna.",
      "aiVerdict": "Cacing pasir Shai-Hulud mendekat hingga ke depan pintu, namun perisai pelindung yang sempurna mengubahnya menjadi tur safari VIP."
    },
    "864": {
      "title": "Teras menara Façade Kelahiran karya Gaudí di Basilika Sagrada Família, Barcelona, Spanyol",
      "builtYear": "1882 Peletakan batu pertama oleh Antoni Gaudí",
      "estimatedValue": "$900M USD (Mahakarya seumur hidup sang arsitek jenius)",
      "specialFeature": "Cahaya kaca patri warna-warni membanjiri ruangan layaknya berada di tengah hutan batu raksasa, sementara Laut Mediterania berkilau di antara menara berbentuk jagung.",
      "aiVerdict": "Teras suci tempat menyambut sinar mentari pagi bersama jiwa sang jenius Gaudí yang mengabstraksikan misteri alam dan lekukan menjadi mahakarya arsitektur."
    },
    "999": {
      "title": "『Legenda Raja Arthur』 Kastel aula perjamuan emas Ksatria Meja Bundar dan Excalibur di Camelot, Avalon",
      "builtYear": "Era legenda abad pertengahan Britania",
      "estimatedValue": "Cawan Suci dan Pedang dalam Batu Excalibur",
      "specialFeature": "Dua belas ksatria duduk mengelilingi Meja Bundar yang setara tanpa hierarki atas-bawah, mendengarkan ramalan penyihir Merlin dan bersumpah menempuh petualangan mulia.",
      "aiVerdict": "Benteng abadi Avalon tempat panji-panji emas berkibar menyuarakan seluruh cita-cita ksatria dan romansa abad pertengahan."
    }
  },
  "ru": {
    "0": {
      "title": "Одноместная расщелина в скале у серной шахты Кава Иджен, Индонезия",
      "builtYear": "4,5 млрд лет до н. э. (эпоха формирования Земли)",
      "estimatedValue": "-$75M USD (штраф за восстановление и экоочистку)",
      "specialFeature": "Каждую ночь мерцающее синее серное пламя служит естественной рассеянной подсветкой, а едкие серные пары круглый год прочищают дыхательные пути.",
      "aiVerdict": "Поздравляем! Это начало жизни отшельника, впитывающего всем телом самый пылкий жар Земли."
    },
    "60": {
      "title": "Шлакоблочная лачуга в щели шириной 80 см на вершине крутой лестницы в деревне Камчхон, Пусан",
      "builtYear": "Около 2013 года, экстренная постройка (завершено в ноябре)",
      "estimatedValue": "Около $2,000 USD по курсу металлолома и стройотходов (без учета сноса)",
      "specialFeature": "Тесная лачуга из цементных блоков, втиснутая в 80-сантиметровый зазор между домами в лабиринте переулков, построенных беженцами на склоне горы. Открыв дверь, вы сразу попадаете на головокружительную лестницу из 148 ступеней, где один неверный шаг грозит падением прямо в море.",
      "aiVerdict": "Нет более сурового и честного жилья для развития первобытных навыков выживания."
    },
    "74": {
      "title": "Пленочная хижина на шламовой дамбе кожевенного завода в Дакке, Бангладеш",
      "builtYear": "1995 год, зона загрязнения реки Буриганга",
      "estimatedValue": "-$6,800 USD (вердикт: почва не подлежит очистке)",
      "specialFeature": "Миниатюрная временная хижина из полиэтилена и бамбука, сооруженная прямо на куче токсичного шлама вдоль дамбы реки Буриганга, куда сбрасываются черные химические отходы.",
      "aiVerdict": "Дом с токсичным видом на набережную, где из окна открывается река, переливающаяся радужными химическими масляными пленками."
    },
    "183": {
      "title": "«Токийский гуль»: стул рядом с клещами Ямори в камере пыток Древа Аогири, 11-й район подземелья Антейку",
      "builtYear": "Период столкновений с Управлением по борьбе с гулями (CCG)",
      "estimatedValue": "Сколько будет 1000 минус 7? (вечная комната пыток)",
      "specialFeature": "Стул для пыток, где красная сколопендра заползает в ухо, пальцы на руках и ногах отрывают плоскогубцами, а волосы седеют от невыносимой боли.",
      "aiVerdict": "Комната пыток с залитым кровью кафельным полом, где Кен Канеки прошел через адские муки перед тем, как пробудиться и стать Одноглазым Королем."
    },
    "250": {
      "title": "Пол в блоке смертников с кандалами, центральная тюрьма Бангкванг, Бангкок, Таиланд",
      "builtYear": "1931 год, тюрьма «Бангкок Хилтон»",
      "estimatedValue": "-$49,000 USD (круглосуточное ношение железных кандалов)",
      "specialFeature": "Ожидание на бетонном полу с намертво заваренными на ногах 5-килограммовыми железными кандалами, звенящими при каждом шаге.",
      "aiVerdict": "Люкс «Бангкок Хилтон», где в условиях жестокой дисциплины и удушающей жары вес свободы ощущается через 5 килограммов железа."
    },
    "500": {
      "title": "Сверхроскошный кондоминиум выживания в 15-уровневой шахте ядерной ракеты, Канзас, США",
      "builtYear": "2015 год, элитная перестройка ракетной базы Атлас-F",
      "estimatedValue": "$2.6M USD (толщина бетонных стен 9 футов)",
      "specialFeature": "Историческое начало элитных уровней! Гарантия комфортного проживания на 5 лет с подземным бассейном, кинотеатром и геотермальным спа даже при ядерном взрыве или зомби-апокалипсисе.",
      "aiVerdict": "Идеальный роскошный бункер для выживания, где можно беззаботно смотреть Netflix и наслаждаться идеальной жизнью даже при конце света."
    },
    "512": {
      "title": "Приватный императорский дворец из натурального мрамора с отделкой 24-каратным золотом в арт-скайлаундже башни Мори, Роппонги Хиллз, Токио",
      "builtYear": "2029 год, проект лауреата Притцкеровской премии",
      "estimatedValue": "Оценочная стоимость около $1.3M USD (международный аукцион Sotheby's)",
      "specialFeature": "При открытии электрожалюзи открывается один из лучших в мире панорамных видов, а отдельная кухня с 3-звездочным шеф-поваром Мишлен работает круглосуточно.",
      "aiVerdict": "Квинтэссенция непревзойденной роскоши, доступная лишь тем, кто достиг абсолютной вершины успеха."
    },
    "623": {
      "title": "«В поисках Немо»: стеклянная вилла на опаловом рифе у актинии, Большой Барьерный риф",
      "builtYear": "Первозданная эпоха, коралловые воды южной части Тихого океана",
      "estimatedValue": "$6.2B USD (эксклюзивное владение крупнейшей коралловой экосистемой Земли)",
      "specialFeature": "Прогулки по сияющему неоновому коралловому саду в компании рыбок-клоунов из семьи Немо прямо рядом с фиолетовой актинией с безвредными щупальцами.",
      "aiVerdict": "Подводный Эдемский сад, где можно ощутить ласковые течения южной части Тихого океана в самой безопасной и уютной актиниевой постели."
    },
    "721": {
      "title": "«Stardew Valley»: бунгало на частном пляже курорта на Имбирном острове со спа с золотыми орехами",
      "builtYear": "День завершения восстановления острова пиратскими попугаями",
      "estimatedValue": "999 иридиевых слитков + Золотые часы",
      "specialFeature": "Дневной сон над коралловыми водами, где плавают морские черепахи, и круглогодичный урожай ананасов.",
      "aiVerdict": "Идеальный рай для пенсии и фермерской жизни, где вечное лето не прекращается даже зимой."
    },
    "751": {
      "title": "«Dungeon & Fighter»: пентхаус в императорском дворце Золотого лотоса принцессы Эрже в Генте, Небесный мир",
      "builtYear": "Эпоха династии Зибен Эдрикс, Небесный императорский дом",
      "estimatedValue": "1 трлн золота из казны Небесной империи",
      "specialFeature": "Чаепитие с ароматом цветущих лотосов в компании принцессы Эрже в саду парящего императорского дворца в небесах Гента, где курсируют стимпанк-дирижабли.",
      "aiVerdict": "Дворец, сочетающий в себе величие Небесного императорского двора, восстановившего славу после разгрома Картеля, и передовую стимпанк-цивилизацию."
    },
    "925": {
      "title": "«Ходячий замок»: деревянный балкон тайного сада Хаула у цветущего озера под звездным небом",
      "builtYear": "Место заключения детского контракта Хаула с падающей звездой",
      "estimatedValue": "Любовь свободной души (бесценно)",
      "specialFeature": "Стоит повернуть дверной диск, как перед глазами волшебным образом предстают безбрежные поля диких цветов под альпийскими снегами и тихое озеро.",
      "aiVerdict": "Самый мирный и благоуханный тайный сад в мире, укрытый от огня войны специально для Софи и Хаула."
    },
    "929": {
      "title": "«Клинок, рассекающий демонов»: беседка из черного дерева на верхнем искаженном ярусе Бесконечного замка под звуки бивы",
      "builtYear": "Пространственная крепость магии крови Двенадцати демонических лун",
      "estimatedValue": "Владения абсолютной власти Кибуцудзи Мудзана",
      "specialFeature": "Вершина многомерного деревянного лабиринта, где при каждом ударе по струнам бивы комнаты и коридоры замка вращаются в четырех измерениях, меняя направление гравитации.",
      "aiVerdict": "Трон финального босса, держащего весь мир в своей руке с вершины бесконечного искаженного лабиринта традиционных японских построек."
    },
    "999": {
      "title": "«Легенды о короле Артуре»: золотой банкетный замок Экскалибура и рыцарей Круглого стола в Камелоте, Авалон",
      "builtYear": "Эпоха средневековых легенд Британии",
      "estimatedValue": "Святой Грааль и меч в камне Экскалибур",
      "specialFeature": "Двенадцать рыцарей сидят за равным Круглым столом, слушая пророчества волшебника Мерлина и давая клятвы на славные подвиги.",
      "aiVerdict": "Бессмертная цитадель Авалона, где идеалы рыцарства и средневековой романтики реют вместе с золотыми знаменами."
    }
  },
  "de": {
    "0": {
      "title": "Einzelperson-Felsspalte neben der Schwefelmine Kawah Ijen, Indonesien",
      "builtYear": "4,5 Mrd. Jahre v. Chr. (Produkt der Erdentstehung)",
      "estimatedValue": "-75 Mio. $ USD (Wiederherstellungsstrafe und Umweltsanierungskosten)",
      "specialFeature": "Nachts dient das leuchtend blaue Schwefelfeuer als natürliche indirekte Beleuchtung, während stechende Schwefeldämpfe das ganze Jahr über die Nase freimachen.",
      "aiVerdict": "Herzlichen Glückwunsch! Dies ist der Beginn eines Einsiedlerlebens, das die heißeste Leidenschaft der Erde mit vollem Körpereinsatz aufsaugt."
    },
    "58": {
      "title": "Bambus-Einzimmerhütte auf der brennenden Mülldeponie Smokey Mountain in Manila, Philippinen",
      "builtYear": "1975, Entstehungszeit der Slum-Siedlungen",
      "estimatedValue": "-6.000 $ USD (Reinigungsgebühr für giftige Gasemissionen)",
      "specialFeature": "Ein 3,3 Quadratmeter kleiner Unterschlupf auf Bambusstelzen, errichtet an einem Müllhang, wo Methangas unterirdisch schwelt und 24 Stunden am Tag dichter Rauch aufsteigt.",
      "aiVerdict": "Ein Domizil auf der berüchtigtsten Mülldeponie der Welt, wo Schuhsohlen von der Hitze schmelzen und beißender Geruch von verbranntem Plastik zum Alltag gehört."
    },
    "60": {
      "title": "80 cm schmale Hohlblockstein-Baracke am Ende der Steiltreppe im Kulturdorf Gamcheon, Busan",
      "builtYear": "Ca. 2013, Notunterkunftsbau (fertiggestellt im November)",
      "estimatedValue": "Ca. 2.000 $ USD Schrott- und Bauschuttwert (Abrisskosten nicht inbegriffen)",
      "specialFeature": "Eine beengte Baracke aus Zementblöcken in einer 80 cm breiten Nische zwischen Nachbarhäusern in den verschlungenen Gassen eines Berghang-Flüchtlingsviertels. Wer die Tür öffnet, blickt direkt auf eine steile Treppe mit 148 Stufen, bei der ein Fehltritt bis ins Meer führen könnte.",
      "aiVerdict": "Es gibt keinen härteren und ehrlicheren Wohnort, um wilde Überlebenskräfte zu stählen."
    },
    "74": {
      "title": "Plastikplanen-Hütte auf dem Klärschlammdeich der Gerbereien von Dhaka, Bangladesch",
      "builtYear": "1995, Verschmutzungszone des Buriganga-Flusses",
      "estimatedValue": "-6.800 $ USD (Boden als unrettbar kontaminiert eingestuft)",
      "specialFeature": "Eine winzige Notunterkunft aus Plastikfolie und Bambus auf giftigen Schlammhügeln entlang des Buriganga-Damms, in den pechschwarze Industrieabwässer fließen.",
      "aiVerdict": "Ein Domizil mit giftigem Blick auf die Uferpromenade, wo beim Öffnen des Fensters ein Fluss mit regenbogenfarbenen Chemieschichten vorbeizieht."
    },
    "183": {
      "title": "»Tokyo Ghoul«: Stuhl neben Yamoris Zange in der Folterkammer des Phönixbaums, Bezirk 11 unter Anteiku",
      "builtYear": "Ära der Zusammenstöße mit dem Büro für Ghul-Bekämpfung (CCG)",
      "estimatedValue": "Wie viel ist 1000 minus 7? (Ewige Folterkammer)",
      "specialFeature": "Ein Folterstuhl, auf dem rote Hundertfüßer ins Ohr krabbeln, Finger- und Zehennägel mit Zangen ausgerissen werden und das Haar schneeweiß wird.",
      "aiVerdict": "Die blutverschmierte Fliesen-Folterkammer, in der Ken Kaneki höllische Qualen litt, bevor er zum einäugigen König erwachte."
    },
    "250": {
      "title": "Kettensträflingsboden im Todestrakt des Zentralgefängnisses Bang Kwang in Bangkok, Thailand",
      "builtYear": "1931, Gefängnis »Bangkok Hilton«",
      "estimatedValue": "-49.000 $ USD (24-Stunden-Fußfessel-Pflicht)",
      "specialFeature": "Auf dem nackten Betonboden warten, während festgeschweißte 5-kg-Eisenketten an den Knöcheln bei jedem Schritt metallisch klirren.",
      "aiVerdict": "Die »Bangkok Hilton Suite«, in der man unter eiserner Disziplin und brütender Hitze das Gewicht der Freiheit anhand von 5 kg Eisen spürt."
    },
    "434": {
      "title": "Schlafsack neben Fennek-Spuren unter dem Pilzfelsen der Weißen Wüste, Ägypten",
      "builtYear": "Millionen Jahre Winderosion von Kreidekalk",
      "estimatedValue": "-10.500 $ USD (inklusive knirschendem Beduinentee voller Wüstensand)",
      "specialFeature": "Im Schatten schneeweißer, pilzförmig erodierter Kalksteinfelsen liegen und nachts den neugierigen Blicken kleiner Wüstenfüchse auf Nahrungssuche begegnen.",
      "aiVerdict": "Ein Freiluft-Schlafzimmer in der Weißen Wüste, umgeben von schneeweißen Felsskulpturen wie in einer Winterlandschaft, während der Wüstenwind weht."
    },
    "500": {
      "title": "Luxus-Überlebens-Eigentumswohnung im umgebauten 15-stöckigen Atomraketensilo in Kansas, USA",
      "builtYear": "2015, Luxusumbau der Atlas-F-Raketenbasis",
      "estimatedValue": "2,6 Mio. $ USD (inkl. 9 Fuß dicken Betonwänden)",
      "specialFeature": "Historischer Auftakt der Luxus-Level! Garantiert 5 Jahre autarke Versorgung mit Pool, Kino und Felsentherme im 15. Untergeschoss – sicher vor Atomkrieg und Zombie-Apokalypse.",
      "aiVerdict": "Der ultimative Luxus-Überlebensbunker, in dem man selbst beim Weltuntergang entspannt Netflix schauen und sein Traumleben genießen kann."
    },
    "512": {
      "title": "Privater Kaiserpalast mit Naturmarmor und 24-Karat-Gold in der privaten Kunst-Sky-Lounge des Roppongi Hills Mori Tower, Tokio",
      "builtYear": "2029, erbaut von einem Pritzker-Preisträger",
      "estimatedValue": "Geschätzter Wert ca. 1,3 Mio. $ USD (Sotheby's Global Auction)",
      "specialFeature": "Elektrische Jalousien öffnen den Blick auf ein weltbekanntes Panorama, während eine private 3-Sterne-Michelin-Küche rund um die Uhr kocht.",
      "aiVerdict": "Die Essenz überwältigenden Luxus, die nur jenen vorbehalten ist, die den Gipfel des Erfolgs erklommen haben."
    },
    "619": {
      "title": "»Cars«: Radiator Springs Royal Suite unter den bunten Neonlichtern von Flos V8-Café",
      "builtYear": "Goldene Ära der Route 66 in den USA",
      "estimatedValue": "2,6 Mio. $ USD (unbegrenzte Bio-Treibstoffbar mit 100 Oktan)",
      "specialFeature": "Unter funkelnden Neonlichtern in Form eines V8-Motorblocks erstklassige synthetische Motoröl-Cocktails schlürfen und die Sandsteinformation von Willy's Butte bestaunen.",
      "aiVerdict": "Eine lebendige Motor-Lodge an der Route 66, voller Nostalgie und Neonzauber, wo Lightning McQueen den wahren Renngeist entdeckte."
    },
    "637": {
      "title": "Marvel »Thor«: Goldener Palast von Asgard an der Regenbogenbrücke Bifröst",
      "builtYear": "Mythisches Zeitalter, gegründet von Allvater Odin",
      "estimatedValue": "370 Trilliarden $ USD (inklusive göttlichem Uru-Metall und der Ewigen Flamme)",
      "specialFeature": "Direkt vor der Haustür liegt die von Heimdall bewachte Regenbogenbrücke, über die man sich mit Lichtgeschwindigkeit in jedes der Neun Reiche warpen kann.",
      "aiVerdict": "Der herrschaftliche Palast der nordischen Mythologie, wo man mit goldenen Äpfeln zum Frühstück das ewige Leben genießt."
    },
    "958": {
      "title": "Interstellares Voyager-Flugkontroll-Penthouse im NASA Jet Propulsion Laboratory (JPL), USA",
      "builtYear": "2008, Fertigstellung des 27 km langen Kreisbeschleunigertunnels",
      "estimatedValue": "4,5 Mrd. $ USD (Heiligtum der Entdeckung des Higgs-Bosons)",
      "specialFeature": "Ein Penthouse auf dem Flugkontrollzentrum im Herzen des NASA JPL in Pasadena, das offiziell als »Zentrum des Universums« gilt. Hier steuert man live die Telemetrie von Voyager 1 und 2 sowie der Mars-Rover im interstellaren Raum.",
      "aiVerdict": "Ein hochmoderner Rückzugsort im Epizentrum physikalischer Spitzenforschung, wo man inmitten der Gesetze des Kosmos den Puls des Universums spürt."
    },
    "999": {
      "title": "»Artussage«: Goldenes Festsaal-Schloss mit Excalibur und den Rittern der Tafelrunde in Camelot, Avalon",
      "builtYear": "Epoche der mittelalterlichen Legenden Britanniens",
      "estimatedValue": "Der Heilige Gral und das Schwert im Stein, Excalibur",
      "specialFeature": "Zwölf Ritter sitzen gleichberechtigt an der Tafelrunde, lauschen den Prophezeiungen Merlins und schwören sich auf ruhmreiche Heldentaten ein.",
      "aiVerdict": "Eine unvergängliche Festung Avalons, wo ritterliche Tugenden und mittelalterliche Romantik unter goldenen Bannern wehen."
    }
  },
  "it": {
    "0": {
      "title": "Fessura rocciosa per una persona accanto alla miniera di zolfo di Kawah Ijen, Indonesia",
      "builtYear": "4,5 miliardi di anni a.C. (prodotto della formazione della Terra)",
      "estimatedValue": "-75 milioni di $ USD (penale di ripristino ambientale e bonifica)",
      "specialFeature": "Ogni notte fiamme di zolfo blu brillante fungono da illuminazione indiretta naturale, mentre i pungenti vapori solforosi liberano le vie respiratorie tutto l'anno.",
      "aiVerdict": "Congratulazioni! È l'inizio di una vita selvaggia che assorbe con tutto il corpo la passione più ardente della Terra."
    },
    "60": {
      "title": "Baracca di blocchi di cemento in uno spazio di 80 cm in cima alle ripide scale del villaggio di Gamcheon, Busan",
      "builtYear": "Circa 2013, costruzione d'emergenza (completata a novembre)",
      "estimatedValue": "Circa 2.000 $ USD valore rottami e macerie (spese di demolizione escluse)",
      "specialFeature": "Una stretta baracca di blocchi di cemento incastrata in un'intercapedine di 80 cm tra le case nei vicoli labirintici dei rifugiati sul pendio. Aprendo la porta si aprono 148 scalini vertiginosi che sembrano un dirupo verso il mare.",
      "aiVerdict": "Non esiste rifugio più severo e onesto per forgiare un istinto di sopravvivenza selvaggio."
    },
    "74": {
      "title": "Baracca di plastica sull'argine di fanghi della conceria di Dacca, Bangladesh",
      "builtYear": "1995, zona contaminata del fiume Buriganga",
      "estimatedValue": "-6.800 $ USD (suolo dichiarato non bonificabile)",
      "specialFeature": "Una minuscola baracca di plastica e bambù eretta su cumuli di fango tossico lungo l'argine del fiume Buriganga, dove scorrono scarti chimici neri.",
      "aiVerdict": "Una casa con vista panoramica sul lungofiume tossico, dove aprendo la finestra si ammira l'acqua striata da chiazze d'olio chimico iridescenti."
    },
    "183": {
      "title": "«Tokyo Ghoul»: sedia accanto alle pinze di Yamori nella stanza delle torture dell'Albero di Aogiri, Circoscrizione 11 sotto l'Anteiku",
      "builtYear": "Epoca degli scontri con la Commissione di Contromisure per i Ghoul (CCG)",
      "estimatedValue": "Quanto fa 1000 meno 7? (sala torture permanente)",
      "specialFeature": "La sedia della tortura dove millepiedi rossi strisciano nell'orecchio, le dita di mani e piedi vengono strappate con le pinze e i capelli diventano candidi.",
      "aiVerdict": "La camera delle torture dal pavimento piastrellato di sangue dove Ken Kaneki patì sofferenze infernali prima di risvegliarsi come Re dei Ghoul."
    },
    "250": {
      "title": "Pavimento dei condannati a morte con ceppi, prigione centrale di Bang Kwang a Bangkok, Thailandia",
      "builtYear": "1931, prigione «Bangkok Hilton»",
      "estimatedValue": "-49.000 $ USD (obbligo di catene alle caviglie 24 ore su 24)",
      "specialFeature": "In attesa sul pavimento di cemento con catene di ferro da 5 kg saldate permanentemente alle gambe, che tintinnano rumorosamente a ogni passo.",
      "aiVerdict": "La suite del Bangkok Hilton dove, tra rigida disciplina e caldo asfissiante, il peso della libertà si misura in 5 kg di puro ferro."
    },
    "283": {
      "title": "«One Piece»: cuccia crollata del negozio di animali distrutto dalle palle di cannone della ciurma di Bagy a Orange Town",
      "builtYear": "Prima traversata di Rufy nel Mare Orientale",
      "estimatedValue": "-5.000 Berry (il tesoro lasciato dal padrone)",
      "specialFeature": "Sdraiarsi tra le ceneri della cuccia dopo che il negozio difeso a costo della vita dal fedele cane Chouchou è stato incenerito dalle speciali palle Buggy.",
      "aiVerdict": "Una cuccia in affitto a Orange Town intrisa delle lacrime del fedele cane e della fuliggine dei cannoni, dove Rufy lasciò il suo tocco di conforto."
    },
    "500": {
      "title": "Condominio di sopravvivenza extralusso ricavato in un silo missilistico nucleare sotterraneo di 15 piani in Kansas, USA",
      "builtYear": "2015, ristrutturazione di lusso della base missilistica Atlas-F",
      "estimatedValue": "2,6 milioni di $ USD (pareti esterne in cemento armato da 9 piedi)",
      "specialFeature": "Inizio storico delle case d'eccellenza! Garanzia di sussistenza per 5 anni con piscina, cinema e terme sotterranee al 15° piano interrato anche in caso di olocausto nucleare o apocalisse zombie.",
      "aiVerdict": "Il bunker di lusso definitivo per sopravvivere alla fine del mondo guardando Netflix in totale serenità."
    },
    "512": {
      "title": "Palazzo imperiale privato in marmo naturale e oro 24K nella private art sky lounge della Mori Tower di Roppongi Hills, Tokyo",
      "builtYear": "2029, progettato da un architetto vincitore del Premio Pritzker",
      "estimatedValue": "Stima circa 1,3 milioni di $ USD (asta globale Sotheby's)",
      "specialFeature": "All'apertura delle tende elettriche si ammira uno dei panorami più esclusivi al mondo, con una cucina privata da 3 stelle Michelin attiva 24 ore su 24.",
      "aiVerdict": "L'essenza del lusso più sbalorditivo, riservato solo a chi ha raggiunto la vetta del successo."
    },
    "590": {
      "title": "Villa sulla scogliera dei limoni a Positano con ascensore privato per barche, Costiera Amalfitana, Italia",
      "builtYear": "Anni '60, villa di villeggiatura sulla scogliera mediterranea",
      "estimatedValue": "6,4 milioni di $ USD (prima fila assoluta sulla falesia di Positano)",
      "specialFeature": "Tra case color pastello abbarbicate sulla roccia, un ascensore privato scende dalla terrazza del limoneto fino al molo privato per yacht.",
      "aiVerdict": "Un gioiello della Costiera Amalfitana che unisce il sole mediterraneo, il profumo dei limoni e le acque smeraldine del Mar Tirreno."
    },
    "727": {
      "title": "«Elden Ring»: maestosa fortezza dorata inondata dalla benedizione delle rune nelle stanze della regina a Leyndell, Capitale Reale",
      "builtYear": "Apogeo dell'Ordine Aureo",
      "estimatedValue": "Runa maggiore originaria dell'Anello di Elden",
      "specialFeature": "Le gigantesche foglie d'oro dell'Albero Madre coprono i cieli mentre bagliori dorati scivolano sui tetti di marmo immacolato dei palazzi reali.",
      "aiVerdict": "La radiosa sala del trono della maestosa Leyndell nell'Interregno, terra governata dalla regina Marika e da Radagon dell'Ordine Aureo."
    },
    "848": {
      "title": "Sky deck della sala di controllo del Tokamak del reattore a fusione ITER (sole artificiale a 100 milioni di gradi) a Cadarache, Francia",
      "builtYear": "2010, vetta dell'ingegneria moderna",
      "estimatedValue": "112 milioni di $ USD (accesso esclusivo alla tecnologia di punta)",
      "specialFeature": "Il cuore del più grande progetto scientifico dell'umanità a Cadarache: sky deck di controllo del Tokamak di ITER per osservare dietro vetri blindati un plasma a 100 milioni di °C.",
      "aiVerdict": "Un palazzo high-tech al culmine dell'ingegno umano dove si contempla la nascita di una nuova era energetica con lo sguardo proteso verso il futuro."
    },
    "933": {
      "title": "«Macross»: sky lounge del concerto di Minmay nella città sospesa all'interno della supercorazzata SDF-1",
      "builtYear": "Costruzione in tecnologia aliena OverTechnology",
      "estimatedValue": "Il sogno galattico che ha salvato l'umanità (tesoro inestimabile)",
      "specialFeature": "Sky lounge in cima alla metropoli ricostruita negli hangar della gigantesca corazzata SDF-1 da 1.200 metri, dove sotto una cupola trasparente risuonano le canzoni che salvarono la galassia.",
      "aiVerdict": "Uno spazio leggendario che fonde tecnologia stellare e romanticismo intergalattico, sospeso tra il firmamento e le melodie dell'universo."
    },
    "999": {
      "title": "«Leggende di Re Artù»: castello del banchetto dorato dei Cavalieri della Tavola Rotonda ed Excalibur a Camelot, Avalon",
      "builtYear": "Epoca delle leggende medievali della Britannia",
      "estimatedValue": "Il Santo Graal ed Excalibur, la spada nella roccia",
      "specialFeature": "I dodici cavalieri siedono intorno alla Tavola Rotonda senza gerarchie, ascoltando le profezie del mago Merlino e giurando imprese gloriose.",
      "aiVerdict": "L'immortale fortezza di Avalon, dove l'ideale cavalleresco e il romanticismo medievale sventolano fieri sotto stendardi dorati."
    }
  },
  "ja": {
    "0": {
      "title": "インドネシア・カワ・イジェン硫黄鉱山横の1人用岩の隙間",
      "builtYear": "紀元前45億年（地球形成期の産物）",
      "estimatedValue": "-7500万ドル（原状回復罰金および環境浄化費）",
      "specialFeature": "毎晩、幻想的な青い硫黄の炎が天然の間接照明となり、四季を通じて刺激的な硫黄の蒸気が鼻腔を直撃します。",
      "aiVerdict": "おめでとうございます！地球の最も熱い情熱を全身で吸収する、大自然サバイバルライフの始まりです。"
    },
    "60": {
      "title": "釜山・甘川文化村の急階段の先にある幅80cmの隙間ブロック小屋",
      "builtYear": "2013年頃の緊急仮設（11月完成）",
      "estimatedValue": "スクラップ・廃材時価 約2,000ドル（解体撤去費別）",
      "specialFeature": "避難民が山の斜面を削って積み上げた迷路のような路地、隣家との幅80cmの隙間にセメントブロックを重ねて造られた極狭バラック小屋です。扉を開けると目の前に崖のような148階段が広がり、足を踏み外せば海まで転がり落ちそうなスリルがあります。",
      "aiVerdict": "野生の生存本能を養うのに、これ以上過酷でストレートな住処はありません。"
    },
    "74": {
      "title": "バングラデシュ・ダッカ皮革なめし工場の汚泥堤防の上のビニール小屋",
      "builtYear": "1995年 ブリガンガ川汚染地帯",
      "estimatedValue": "-6,800ドル（土壌浄化不能判定）",
      "specialFeature": "黒い化学廃水が流れ込むブリガンガ川沿いの有毒スラッジの上に、ビニールシートと竹を編んで建てられた超小型仮設小屋です。",
      "aiVerdict": "窓を開けると虹色の化学油膜が浮かぶ川が一望できる、危険度MAXのトキシック・ウォーターフロント物件です。"
    },
    "144": {
      "title": "チェコ・プラハ地下の閉鎖された冷戦期防空壕 換気配管室の錆びた鉄扉前のマットレス",
      "builtYear": "2012年頃の緊急仮設（2月完成）",
      "estimatedValue": "スクラップ・廃材時価 約2,300ドル（撤去費別）",
      "specialFeature": "プラハ地下深くに掘られたワルシャワ条約機構の核防空壕、その空気清浄配管室の隅に敷かれたマットレスです。防錆油の匂いと古びた換気扇の低周波音に包まれながら、地下30メートルの岩盤下で絶対の安全と極度の閉塞感を同時に味わえます。",
      "aiVerdict": "野生のサバイバル能力を鍛え上げるのに、これほど冷酷で嘘のない住居はありません。"
    },
    "183": {
      "title": "『東京喰種トーキョーグール』あんていく地下11区 アオギリの樹 拷問部屋 ヤモリのペンチ横の椅子",
      "builtYear": "喰種対策局（CCG）激突期",
      "estimatedValue": "1000引く7は？（永久拷問部屋）",
      "specialFeature": "赤いオオムカデが耳に入り込み、ペンチで手足の指をちぎられながら髪が真っ白に染まる伝説の拷問椅子です。",
      "aiVerdict": "金木研が覚醒して隻眼の王となる前に、地獄の苦痛を味わった血染めのタイル張り拷問部屋です。"
    },
    "250": {
      "title": "タイ・バンコク バンクワン中央刑務所 死刑囚棟 足かせの転がる床",
      "builtYear": "1931年 バンコク・ヒルトン刑務所",
      "estimatedValue": "-49,000ドル（24時間鉄鎖足かせ着用義務）",
      "specialFeature": "足に5kgの鉄鎖を溶接されたまま、歩くたびに金属音を響かせながら冷たいコンクリートの床で過ごす空間です。",
      "aiVerdict": "厳格な規律と蒸し暑いバンコクの熱気の中、自由の重みを5kgの鉄の塊で痛感するバンコク・ヒルトン・スイートです。"
    },
    "343": {
      "title": "『ザ・シンプソンズ』ホーマーがドーナツの粉をこぼした原子力発電所 制御コンソール下",
      "builtYear": "スプリングフィールド原子力発電所 セクター7G",
      "estimatedValue": "-5000万ドル（メルトダウン警報48回連続発令）",
      "specialFeature": "ホーマーがドーナツのジャムを垂らしてボタンがベタついている原子炉緊急停止盤の足元で昼寝を楽しめます。",
      "aiVerdict": "世界一間抜けな安全検査官の足元で、メルトダウン警報を目覚まし時計にして暮らすハラハラ放射能ハウスです。"
    },
    "359": {
      "title": "『DARK SOULS III』深みの聖堂 泥まみれの巨人の足元 汚物溜まり",
      "builtYear": "火が陰りゆく黄昏の時代",
      "estimatedValue": "-80万ソウル（汚泥スライム毒素浄化費）",
      "specialFeature": "鎖に繋がれた巨人が地団駄を踏むたびに汚物とウジ虫が跳ね上がる泥沼に、息を潜めて隠れるスペースです。",
      "aiVerdict": "巨人の足に踏み潰されるか聖堂騎士の大剣に貫かれるかの二者択一を迫られる、深みの底辺物件です。"
    },
    "361": {
      "title": "『シュレック』泥沼地帯 耳垢キャンドルが灯るうつろな丸太の屋外ボットン便所",
      "builtYear": "おとぎ話の遠い昔",
      "estimatedValue": "玉ねぎ3袋（おとぎ話の怪物オーガの縄張り）",
      "specialFeature": "三日月型の小窓が開いたドアを開けると、シュレックが耳からほじり出した黄色い耳垢のろうそくが独特の香りを放って燃えています。",
      "aiVerdict": "どんな侵入者もわずか1秒で退散させる、天然のオーガ結界が張られた不可侵の湿地トイレスイートです。"
    },
    "500": {
      "title": "アメリカ・カンザス州 地下15階 核ミサイルサイロ改造 超豪華サバイバルコンドミニアム",
      "builtYear": "2015年 アトラスFミサイル基地ラグジュアリー改装",
      "estimatedValue": "260万ドル（厚さ9フィートの防護コンクリート外壁完備）",
      "specialFeature": "大当たりハウスの歴史的幕開け！核爆発やゾンビパンデミックでも地下15階のプール、映画館、岩盤温泉で5年間の快適生活が保証されます。",
      "aiVerdict": "世界が滅亡してもNetflixを観ながら悠々自適に最高の人生を謳歌できる、究極のサバイバル超豪華シェルターです。"
    },
    "512": {
      "title": "東京・六本木ヒルズ 森タワー プライベートアート・スカイラウンジ 天然大理石と24K純金装飾のプライベート皇宮",
      "builtYear": "2029年 世界的プリツカー賞受賞建築家施工",
      "estimatedValue": "推定鑑定価格 約130万ドル（グローバル・サザビーズ競売）",
      "specialFeature": "電動ブラインドが開くと世界トップクラスのパノラマ夜景が一望でき、ミシュラン3つ星シェフ専用キッチンが24時間稼働します。",
      "aiVerdict": "成功の頂点を極めた者だけが享受できる、圧倒的ラグジュアリーの極致です。"
    },
    "578": {
      "title": "オーストリア・ウィーン シェーンブルン宮殿 ハプスブルク皇室庭園直結 ロイヤルアパートメント",
      "builtYear": "1750年 マリア・テレジア女帝の夏の離宮",
      "estimatedValue": "5400万ドル（ハプスブルク帝国皇室遺産価値）",
      "specialFeature": "黄金色に輝くロココ様式の寝室の窓を開ければ、グロリエッテの丘の噴水と美しく整備された迷路庭園が眼下に広がります。",
      "aiVerdict": "幼少期のモーツァルトがピアノを演奏した大広間の隣で、ハプスブルク皇帝の気品に浸るウィーンの栄光の館です。"
    },
    "999": {
      "title": "『アーサー王伝説』アヴァロン・キャメロット 円卓の騎士 エクスカリバー黄金宴会城",
      "builtYear": "ブリテン中世伝説の時代",
      "estimatedValue": "聖杯と岩に刺さった選定の剣エクスカリバー",
      "specialFeature": "身分の上下のない円卓を12人の騎士が囲み、魔術師マーリンの予言に耳を傾けながら栄光ある冒険を誓い合います。",
      "aiVerdict": "騎士道精神と中世ロマンスのあらゆる理想が黄金の旗とともにたなびく、不滅のアヴァロン城砦です。"
    }
  },
  "zh": {
    "0": {
      "title": "印度尼西亚卡瓦伊真火山硫磺矿旁的单人岩石缝隙",
      "builtYear": "公元前45亿年（地球形成期的产物）",
      "estimatedValue": "-7500万美元（恢复原状罚金及环境治理费）",
      "specialFeature": "每晚幽蓝的硫磺火焰化作天然氛围灯，一年四季刺鼻的硫磺蒸汽直通鼻腔。",
      "aiVerdict": "恭喜！这是全身心感受地球最炽热激情的荒野求生生活的起点。"
    },
    "60": {
      "title": "釜山甘川文化村陡峭台阶顶端宽80厘米缝隙中的空心砖棚屋",
      "builtYear": "约2013年紧急搭建（11月竣工）",
      "estimatedValue": "废铁及建材残值约2000美元（拆除费另计）",
      "specialFeature": "在难民沿山坡层层建造的迷宫小巷中，利用隔壁房屋间仅80厘米宽的缝隙砌上水泥砖建成的逼仄棚屋。推开门就是如悬崖般的148级台阶，稍有不慎仿佛就会一路滚落大海。",
      "aiVerdict": "要磨砺野外生存能力，再也没有比这更残酷也更真实的地方了。"
    },
    "65": {
      "title": "《哈利·波特》德思礼家楼梯下布满蜘蛛网的壁橱",
      "builtYear": "1981年女贞路4号落成之日",
      "estimatedValue": "月租0美元（无限量附送姨夫的咆哮与唠叨）",
      "specialFeature": "每当达力咚咚咚踩着楼梯跑下来时，天花板上的灰尘和蜘蛛网就如雪花般纷纷扬扬落下，自带天然降雪效果。",
      "aiVerdict": "在霍格沃茨录取通知书从壁橱门缝狂飙进来1000封之前，必须默默咬牙坚持的考验之室。"
    },
    "74": {
      "title": "孟加拉国达卡皮革鞣制厂污泥堤坝上的塑料棚屋",
      "builtYear": "1995年布里甘加河重污染带",
      "estimatedValue": "-6800美元（土壤判定为无法净化）",
      "specialFeature": "在排满黑色化学污水的布里甘加河堤岸有毒污泥堆上，用塑料膜和竹竿搭建的微型临时棚房。",
      "aiVerdict": "推开窗户便能尽收彩虹色工业浮油漂荡的河面，绝顶剧毒的水景豪宅。"
    },
    "183": {
      "title": "《东京食尸鬼》安定区地下11区青桐树拷问室壁虎钳子旁的刑椅",
      "builtYear": "喰种对策局（CCG）激战期",
      "estimatedValue": "1000减7是多少？（永久拷问室）",
      "specialFeature": "红头蜈蚣爬入耳道，十根手指脚趾被钳子一根根拔断，黑发瞬间化作白发的残酷拷问椅。",
      "aiVerdict": "金木研在觉醒成为独眼之王之前，经受炼狱般折磨的血迹斑斑瓷砖拷问室。"
    },
    "250": {
      "title": "泰国曼谷邦广中央监狱死囚牢房戴脚镣的水泥地",
      "builtYear": "1931年“曼谷希尔顿”监狱",
      "estimatedValue": "-4.9万美元（24小时佩戴重型铁镣）",
      "specialFeature": "双腿被永久焊接5公斤重的铁锁链，每走一步都伴随着清脆刺耳的金属撞击声，在冰冷的水泥地上等待最终判决。",
      "aiVerdict": "在残酷的规训与曼谷窒息的酷热中，用5公斤钢铁真切感受自由重量的“曼谷希尔顿套房”。"
    },
    "413": {
      "title": "《穿靴子的猫》杰克与吉尔的野猪马车底盘接污木箱",
      "builtYear": "2011年梦工厂童话纪元",
      "estimatedValue": "魔豆0颗（沾满泥巴的野猪饲料）",
      "specialFeature": "蜷缩在彪悍亡命徒杰克与吉尔夫妇驱赶的暴走野猪群马车底部，直面扑面而来的飞溅泥浆与沙尘。",
      "aiVerdict": "在争夺下金蛋的母鹅的狂野追逐战车底，避开利爪与狂飙的极度刺激木箱。"
    },
    "500": {
      "title": "美国堪萨斯州地下15层核导弹发射井改造的超奢华末日求生公寓",
      "builtYear": "2015年擎天神-F导弹基地奢华改造",
      "estimatedValue": "260万美元（配备9英尺厚特种混凝土外墙）",
      "specialFeature": "顶级梦幻豪宅的里程碑序幕！即使遭遇核打击或丧尸末日，也能在地下15层的室内泳池、影院与岩石温泉中安然无忧自给自足生活5年。",
      "aiVerdict": "即使地球毁灭也能喝着咖啡刷Netflix、优雅享受人生的终极避难奢华堡垒。"
    },
    "512": {
      "title": "东京六本木新城森大厦私人艺术空中酒廊 天然大理石与24K纯金装饰的专属皇宫",
      "builtYear": "2029年普利兹克奖得主大师操刀",
      "estimatedValue": "估值约130万美元（苏富比全球拍卖）",
      "specialFeature": "电动百叶帘缓缓升起，全球顶尖城市全景一览无余，米其林三星名厨专属厨房24小时全天候待命。",
      "aiVerdict": "仅属于登顶巅峰之人的绝代奢华典范。"
    },
    "555": {
      "title": "《冰雪奇缘2》阿塔霍兰记忆之河冰洞内的钻石水晶王座厅",
      "builtYear": "流淌着过去所有真相的神秘之河",
      "estimatedValue": "75亿美元（第五灵艾莎的冰霜记忆圣殿）",
      "specialFeature": "在凝固的冰川裂隙深处，往昔的每个瞬间化作剔透的冰雕永恒重现，比钻石更为晶莹的寒冰宝座散发着神圣光辉。",
      "aiVerdict": "唱响《Show Yourself》蜕变为第五自然之灵的艾莎所栖息的神秘宏伟冰晶圣殿。"
    },
    "561": {
      "title": "路易威登钻石老花饰面12层行走式奢华硬箱城堡",
      "builtYear": "2026年巴黎时装周限定典藏建构",
      "estimatedValue": "1500万美元（附爱马仕鳄鱼皮手工地毯）",
      "specialFeature": "整栋建筑外立面均由顶级防水帆布与18K镀金铆钉拼接而成，只需拉开品牌拉链即可随心重组空间格局。",
      "aiVerdict": "房屋本身就是绝世奢侈品，举手投足间便能引发全球狗仔队的闪光灯风暴。"
    },
    "586": {
      "title": "捷克布拉格伏尔塔瓦河直面查理大桥的哥特复兴顶层公寓",
      "builtYear": "15世纪原版哥特风格保护建筑",
      "estimatedValue": "900万美元（同时坐拥布拉格城堡与查理大桥双绝景）",
      "specialFeature": "手握香槟倚在阳台，俯瞰拥有600年历史的查理大桥如织游人，以及暮色中布拉格城堡的璀璨夜景。",
      "aiVerdict": "尽揽中世纪欧洲典雅与浪漫、伫立于金色布拉格历史心脏的传世阁楼。"
    },
    "999": {
      "title": "《亚瑟王传奇》阿瓦隆卡米洛特圆桌骑士王者之剑金色大宴会厅城堡",
      "builtYear": "不列颠中世纪传奇纪元",
      "estimatedValue": "圣杯与石中剑王者之剑",
      "specialFeature": "十二位骑士围绕平等的圆桌而坐，倾听大法师梅林的预言，立下开启光荣远征的誓言。",
      "aiVerdict": "骑士精神与中世纪浪漫主义理想伴随金色战旗永远飘扬的不朽阿瓦隆要塞。"
    }
  },
  "ms": {
    "0": {
      "title": "Celah Batu Satu Orang di Sebelah Lombong Sulfur Kawah Ijen, Indonesia",
      "builtYear": "4.5 bilion SM (Hasil pembentukan Bumi)",
      "estimatedValue": "-$75M USD (Denda pemulihan dan kos pembersihan alam sekitar)",
      "specialFeature": "Setiap malam api sulfur biru berkilauan bertindak sebagai pencahayaan semula jadi, dan wap sulfur menusuk hidung sepanjang musim.",
      "aiVerdict": "Tahniah! Ini adalah permulaan kehidupan semula jadi yang menyerap kehangatan paling membara di Bumi dengan seluruh tubuh."
    },
    "9": {
      "title": "«Parasite»: Bendul Simen Lorong Kencing Mabuk Tepat di Hadapan Tingkap Separuh Bawah Tanah Keluarga Ki-taek",
      "builtYear": "Dijana secara rawak pada tahun 2236 Masihi dunia maya",
      "estimatedValue": "-99.9M Emas (Denda kemusnahan dungeon dikenakan)",
      "specialFeature": "Pada hari hujan, air kumbahan melimpah ke siling dan hanya kaki orang mabuk kelihatan di luar tingkap. Seluruh keluarga mesti bertenggek di atas mangkuk tandas untuk mendapatkan isyarat Wi-Fi.",
      "aiVerdict": "Jika anda boleh bertahan di sini, anda boleh menyesuaikan diri dengan senyuman dalam apa jua persekitaran seperti neraka."
    },
    "60": {
      "title": "Pondok Blok Celah Selebar 80cm di Hujung Tangga Curam Perkampungan Gamcheon, Busan",
      "builtYear": "Sekitar 2013, pembinaan kecemasan (siap pada bulan November)",
      "estimatedValue": "Nilai besi buruk & sisa bahan sekitar $2,000 USD (kos perobohan berasingan)",
      "specialFeature": "Pondok sempit yang dibina dengan blok simen dalam ruang 80cm antara rumah di lorong berliku lereng bukit pelarian. Membuka pintu mendedahkan 148 anak tangga curam bagai jurang yang boleh menyebabkan anda tergolek hingga ke laut jika tersilap langkah.",
      "aiVerdict": "Tiada tempat tinggal yang lebih keras dan jujur untuk membina daya tahan hidup liar."
    },
    "74": {
      "title": "Rumah Plastik di Atas Benteng Enapcemar Kilang Menyamak Kulit di Dhaka, Bangladesh",
      "builtYear": "1995, zon pencemaran Sungai Buriganga",
      "estimatedValue": "-$6,800 USD (Penilaian tanah tidak boleh dibersihkan)",
      "specialFeature": "Rumah sementara mini yang diperbuat daripada plastik dan buluh di atas timbunan enapcemar toksik di benteng Sungai Buriganga yang dicemari sisa kimia hitam.",
      "aiVerdict": "Rumah pemandangan tepi air toksik di mana membuka tingkap memperlihatkan sungai yang mengalir dengan lapisan minyak kimia berwarna pelangi."
    },
    "163": {
      "title": "«Gintama»: Sarang Habuk di Bawah Sofa Tumpahan Manisan Gintoki di Pejabat Yorozuya Kabukicho",
      "builtYear": "Zaman pencerobohan Amanto (makhluk asing) pada akhir era Edo",
      "estimatedValue": "-$20,000 USD (Sewa tertunggak 6 bulan hingga Otose memecahkan pintu)",
      "specialFeature": "Tidur meringkuk di celah gumpalan bulu Kagura dan Sadaharu di bawah sofa kulit melekit akibat tumpahan susu strawberi dan parfait yang mengering.",
      "aiVerdict": "Rumah penganggur terhebat di Edo, bergema dengan keluhan malas Gintoki yang berisiko diabetes dan bunyi selakan komik Jump."
    },
    "183": {
      "title": "«Tokyo Ghoul»: Kerusi Bersebelahan Playar Yamori di Bilik Seksaan Pokok Aogiri Bawah Tanah Wad 11 Anteiku",
      "builtYear": "Zaman pertempuran Suruhanjaya Kaunter Ghoul (CCG)",
      "estimatedValue": "Berapakah 1000 tolak 7? (Bilik seksaan kekal)",
      "specialFeature": "Kerusi seksaan di mana lipan merah merayap masuk ke telinga, sepuluh jari tangan dan kaki dicabut dengan playar, dan rambut bertukar menjadi putih.",
      "aiVerdict": "Bilik seksaan lantai jubin berlumuran darah di mana Ken Kaneki mengalami keperitan neraka sebelum bangkit sebagai Raja Ghoul."
    },
    "243": {
      "title": "«District 9»: Pondok Papan Tin Makanan Kucing Berselerak di Kem Kuarantin Makhluk Asing Johannesburg",
      "builtYear": "2010, zon pengasingan kaum Prawn",
      "estimatedValue": "-$65 USD (Pertukaran 10 tin makanan kucing)",
      "specialFeature": "Tinggal di pondok zink dengan timbunan tin makanan kucing kegemaran makhluk asing sambil mendengar tembakan penyeludup senjata makhluk asing.",
      "aiVerdict": "Rumah setinggan District 9 di mana anda merasai ketakutan apabila tangan kiri berubah menjadi capit udang akibat pendedahan cecair asing."
    },
    "250": {
      "title": "Lantai Berbelenggu di Blok Banduan Hukuman Mati Penjara Pusat Bang Kwang di Bangkok, Thailand",
      "builtYear": "1931, Penjara «Bangkok Hilton»",
      "estimatedValue": "-$49,000 USD (Memakai rantai belenggu besi 24 jam sehari)",
      "specialFeature": "Menunggu di atas lantai konkrit dengan rantai besi 5kg dikimpal kekal pada kaki, bergemerincing setiap kali melangkah.",
      "aiVerdict": "Suite Bangkok Hilton di mana anda merasai beratnya kebebasan melalui besi seberat 5kg di bawah disiplin ketat dan bahang panas Bangkok."
    },
    "332": {
      "title": "Bangunan Bakul Berkelah Gergasi 7 Tingkat di Ohio, AS (Bangunan Longaberger)",
      "builtYear": "1997, Ibu pejabat bakul buatan tangan siap dibina",
      "estimatedValue": "$640,000 USD (Sistem pemanas terbina pada pemegang)",
      "specialFeature": "Dua pemegang bakul seberat 150 tan dilengkapi wayar pemanas agar tidak membeku pada musim sejuk, membuatkan anda teringin memakan sandwic.",
      "aiVerdict": "Rumah bakul beli-belah terbesar di dunia yang akan dicapai makhluk asing terlebih dahulu jika mereka datang berkelah di Bumi."
    },
    "376": {
      "title": "Bilik Ondol 3 Meter Persegi Bersebelahan Bilik Mandi Awam Berjubin Tertanggal di Lorong Rumah Tumpangan Usang Daeheung-dong, Daejeon",
      "builtYear": "1987, zaman tanpa undang-undang bandar berdinding",
      "estimatedValue": "$28,000 USD (Hak penghunian haram pasaran gelap)",
      "specialFeature": "Bilik ondol seluas 3 meter persegi bersebelahan bilik basuh berkongsi di rumah tumpangan lama tahun 1970-an tempat persinggahan pekerja kereta api dan pedagang berhampiran Stesen Daejeon lama. Di sebalik paip berkarat yang menitis dan jubin mozek yang pecah, wisel kereta api laluan Gyeongbu bergema sayup-sayup.",
      "aiVerdict": "Kawasan setinggan cyberpunk yang mendebarkan di puncak labirin konkrit yang menyaksikan tayar kapal terbang melintas dari dekat."
    },
    "500": {
      "title": "Kondo Kelangsungan Hidup Mewah Ubah Suai Silo Misil Nuklear Bawah Tanah 15 Tingkat di Kansas, AS",
      "builtYear": "2015, pengubahsuaian mewah pangkalan misil Atlas-F",
      "estimatedValue": "$2.6M USD (Dilengkapi dinding konkrit tebal 9 kaki)",
      "specialFeature": "Permulaan bersejarah rumah tahap tinggi! Jaminan penginapan 5 tahun dengan kolam renang, pawagam, dan spa mata air panas batu di bawah tanah 15 tingkat walaupun berlaku letupan nuklear atau kiamat zombi.",
      "aiVerdict": "Bunker mewah kelangsungan hidup muktamad untuk menikmati kehidupan terbaik sambil menonton Netflix walaupun dunia kiamat."
    },
    "512": {
      "title": "Istana Peribadi Marmar Semula Jadi dan Emas 24K di Lounge Langit Seni Peribadi Menara Mori Roppongi Hills, Tokyo",
      "builtYear": "2029, dibina oleh arkitek pemenang Hadiah Pritzker bertaraf dunia",
      "estimatedValue": "Anggaran nilai sekitar $1.3M USD (Lelongan Global Sotheby's)",
      "specialFeature": "Pemandangan panorama terkemuka dunia terbentang apabila bidai elektrik dibuka, dan dapur khas cef 3 bintang Michelin beroperasi 24 jam sehari.",
      "aiVerdict": "Puncak kemewahan luar biasa yang hanya boleh dinikmati oleh mereka yang telah mencapai kemuncak kejayaan."
    },
    "999": {
      "title": "«Legenda Raja Arthur»: Istana Dewan Jamuan Emas Excalibur dan Kesatria Meja Bulat di Camelot, Avalon",
      "builtYear": "Zaman legenda zaman pertengahan Britain",
      "estimatedValue": "Cawan Suci dan pedang dalam batu, Excalibur",
      "specialFeature": "Dua belas kesatria duduk mengelilingi Meja Bulat tanpa hierarki, mendengar ramalan ahli sihir Merlin dan berikrar untuk pengembaraan yang mulia.",
      "aiVerdict": "Kubu Avalon abadi di mana semua cita-cita kesatria dan percintaan zaman pertengahan berkibar megah bersama bendera keemasan."
    }
  }
};

/**
 * Retrieve translation token with param interpolation
 */
export function getTranslation(lang, pathStr, params = {}) {
  const selectedLang = UI_DICTIONARY[lang] ? lang : 'ko';
  const parts = pathStr.split('.');
  let current = UI_DICTIONARY[selectedLang];
  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      // Fallback to English, then Korean
      let fb = UI_DICTIONARY['en'];
      for (const p of parts) fb = fb?.[p];
      if (fb !== undefined) {
        current = fb;
        break;
      }
      let fbKo = UI_DICTIONARY['ko'];
      for (const p of parts) fbKo = fbKo?.[p];
      current = fbKo !== undefined ? fbKo : pathStr;
      break;
    }
  }

  if (typeof current !== 'string') {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
}

/**
 * Extracts a concise English title from house.en or MASTER_HOUSES
 */
export function extractEnglishTitle(house) {
  if (!house) return 'Multiverse Residence';
  const lv = Number(house.level) || 0;
  const enEntry = house.en || MASTER_HOUSES[lv]?.en;
  if (enEntry && enEntry.title) {
    return enEntry.title;
  }
  const prompt = house.geminiImagePrompt || house.imagePrompt || '';
  const match = prompt.match(/illustration of:\s*([^(\.]+?)(?:\s*\(|\.\s*Visual|$)/i);
  if (match && match[1] && match[1].trim().length > 3) {
    return match[1].trim();
  }
  return `Multiverse Residence Lv.${lv}`;
}

/**
 * Translates/formats builtYear deterministically
 */
export function translateBuiltYear(builtYear, lang = 'ko', level = null) {
  if (lang === 'ko' || !builtYear) return builtYear;
  if (level !== null && MASTER_HOUSES[level]?.en?.builtYear) {
    const ml = MULTILANG_LEVEL_MAP[lang]?.[level];
    if (ml && ml.builtYear) return ml.builtYear;
    return MASTER_HOUSES[level].en.builtYear;
  }
  let text = String(builtYear);
  if (!/[가-힣]/.test(text)) return text;
  text = text.replace(/기원전\s*([\d,.]+)\s*억\s*년/g, '$100 Million BC');
  text = text.replace(/기원전\s*([\d,.]+)\s*만\s*년/g, '$10,000 BC');
  text = text.replace(/기원전\s*([\d,.]+)\s*년/g, '$1 BC');
  text = text.replace(/서기\s*(\d+)\s*년/g, 'AD $1');
  text = text.replace(/(\d{4})\s*년경/g, 'c. $1');
  text = text.replace(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/g, '$1-$2-$3');
  text = text.replace(/(\d{4})\s*년/g, '$1');
  text = text.replace(/(\d{1,2})\s*월\s*완공/g, 'Completed Month $1');
  text = text.replace(/\([^)]*[가-힣]+[^)]*\)/g, '').trim();
  return /[가-힣]/.test(text) ? 'Multiverse Architectural Era' : text;
}

/**
 * Translates/formats estimatedValue deterministically
 */
export function translateEstimatedValue(estimatedValue, lang = 'ko', level = null) {
  if (lang === 'ko' || !estimatedValue) return estimatedValue;
  if (level !== null && MASTER_HOUSES[level]?.en?.estimatedValue) {
    const ml = MULTILANG_LEVEL_MAP[lang]?.[level];
    if (ml && ml.estimatedValue) return ml.estimatedValue;
    return MASTER_HOUSES[level].en.estimatedValue;
  }
  const raw = String(estimatedValue);
  if (!/[가-힣]/.test(raw)) return raw;
  const joMatch = raw.match(/(-?\d+(?:,\d+)?)\s*조\s*원/);
  const eokMatch = raw.match(/(-?\d+(?:,\d+)?)\s*억\s*원/);
  const manMatch = raw.match(/(-?\d+(?:,\d+)?)\s*만\s*원/);
  if (joMatch) {
    const val = parseFloat(joMatch[1].replace(/,/g, ''));
    return `~$${(val * 0.75).toFixed(1)}B USD`;
  }
  if (eokMatch) {
    const val = parseFloat(eokMatch[1].replace(/,/g, ''));
    return `~$${(val * 0.075).toFixed(2)}M USD`;
  }
  if (manMatch) {
    const val = parseFloat(manMatch[1].replace(/,/g, ''));
    return `~$${Math.round(val * 7.5).toLocaleString()} USD`;
  }
  return 'Priceless Multiverse Valuation';
}

/**
 * Localizes a house object for any of the 14 supported languages.
 * Guarantees 0 Korean leakage when lang !== 'ko'.
 * @param {object} house Base house concept
 * @param {string} [lang='ko'] Target language code
 * @param {string|null} [nameQuery=null] Current owner name
 */
export function localizeHouse(house, lang = 'ko', nameQuery = null) {
  if (!house) return house;

  // For Korean: preserve 100% original strings
  if (!lang || lang === 'ko') {
    return { ...house };
  }

  const selectedLang = UI_DICTIONARY[lang] ? lang : 'en';
  const dict = UI_DICTIONARY[selectedLang] || UI_DICTIONARY['en'];
  const enDict = UI_DICTIONARY['en'];
  const lv = Number(house.level) || 0;

  const zoneLabel = dict.zones?.[house.zone] || enDict.zones?.[house.zone] || house.zone;
  const realityLabel = dict.reality?.[house.realityType] || enDict.reality?.[house.realityType] || house.realityType;
  const categoryLabel = dict.categories?.[house.category] || enDict.categories?.[house.category] || 'Special Architecture';
  const tierName = dict.tiers?.[house.tier] || enDict.tiers?.[house.tier] || `Tier ${house.tier}`;

  const masterEn = house.en || MASTER_HOUSES[lv]?.en;
  const mlEntry = MULTILANG_LEVEL_MAP[selectedLang]?.[lv];

  const title = mlEntry?.title || masterEn?.title || extractEnglishTitle(house);
  const builtYear = mlEntry?.builtYear || masterEn?.builtYear || translateBuiltYear(house.builtYear, selectedLang, lv);
  const estimatedValue = mlEntry?.estimatedValue || masterEn?.estimatedValue || translateEstimatedValue(house.estimatedValue, selectedLang, lv);
  const specialFeature = mlEntry?.specialFeature || masterEn?.specialFeature || ( /[가-힣]/.test(String(house.specialFeature || '')) ? 'Equipped with extraordinary multiverse architectural features.' : house.specialFeature );
  const aiVerdict = mlEntry?.aiVerdict || masterEn?.aiVerdict || ( /[가-힣]/.test(String(house.aiVerdict || '')) ? 'An iconic residence certified by the Multiverse Architectural Appraisal Institute.' : house.aiVerdict );

  return {
    ...house,
    title,
    zoneLabel,
    realityLabel,
    categoryLabel,
    tierName,
    builtYear,
    estimatedValue,
    specialFeature,
    aiVerdict
  };
}

export const WORLDCUP_I18N = {
  ko: {
    tabSearch: '내 집 찾기',
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
    lobbyHint2: '모바일에서는 위·아래로 스크롤하며 두 집을 비교한 뒤 선택할 수 있습니다.',
    matchCounter: '{cur} / {total} 경기',
    resetBtn: '🔄 처음으로',
    pickBtn: '👆 이 집 선택하기',
    realBadge: '🏛️ 실제 존재',
    fictionBadge: '🦄 허구·상상',
    realFullBadge: '🏛️ 실제 존재하는 건축물',
    fictionFullBadge: '🦄 허구·상상 속 건축물',
    builtYearLabel: '📅 건축 연도',
    valueLabel: '💰 추산 가치',
    featureLabel: '✨ 특징',
    featureFullLabel: '✨ 특별한 기능',
    verdictLabel: '🤖 AI 총평',
    championBadgeSuffix: '강 우승',
    replayBtn: '🔄 같은 모드로 다시 하기',
    copyBtn: '📋 우승 결과 복사하기',
    viewDetailBtn: '🏠 이 집 상세 감정서 보기',
    copiedToast: '📋 우승 결과가 클립보드에 복사되었습니다!',
    copyFailToast: '결과 복사에 실패했습니다.',
    shareBracketBtn: '🔗 같은 대진표 URL 공유',
    shareBracketToast: '🔗 같은 조건·같은 대진표 URL이 복사되었습니다!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 폭망 하우스',
      title: '💀 최악의 집 중 최선의 집 월드컵',
      subtitle: '살기 막막한 폭망 하우스 500종 중, 그나마 내 한 몸 뉘일 만한 최선의 집을 골라보세요!',
      questionPrompt: '이 중에서 그나마 살 만한 최선의 집은?',
      championTitle: '🏆 최악의 집들 중 살아남은 최선의 집!',
      oppositeLabel: '🌟 최선 중 최악 월드컵 도전'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 대박 하우스',
      title: '🌟 최선의 집 중 최악의 집 월드컵',
      subtitle: '초호화 대박 하우스 500종 중, 의외로 가장 살기 불편하거나 정 떨어지는 최악의 집을 뽑아보세요!',
      questionPrompt: '이 좋은 집들 중 그나마 제일 별로인 최악의 집은?',
      championTitle: '💀 대박 하우스 중 뽑힌 최악의 집!',
      oppositeLabel: '💀 최악 중 최선 월드컵 도전'
    }
  },
  en: {
    tabSearch: 'Find My House',
    tabWorst: 'Best of the Worst',
    tabBest: 'Worst of the Best',
    roundSuffix: ' Teams',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' matches',
    recommended: ' · Best',
    selectRoundLabel: 'Select Tournament Size',
    startBtnSuffix: '-House Random Bracket',
    lobbyHint1: 'Randomly draws unique houses from Lv.{min}~{max} every game.',
    lobbyHint2: 'On mobile, scroll up and down to compare both houses before picking.',
    matchCounter: 'Match {cur} / {total}',
    resetBtn: '🔄 Restart',
    pickBtn: '👆 Choose This House',
    realBadge: '🏛️ Real',
    fictionBadge: '🦄 Fiction',
    realFullBadge: '🏛️ Real-World Architecture',
    fictionFullBadge: '🦄 Fictional Architecture',
    builtYearLabel: '📅 Year Built',
    valueLabel: '💰 Est. Value',
    featureLabel: '✨ Feature',
    featureFullLabel: '✨ Special Feature',
    verdictLabel: '🤖 AI Verdict',
    championBadgeSuffix: ' Champion',
    replayBtn: '🔄 Play Again',
    copyBtn: '📋 Copy Result',
    viewDetailBtn: '🏠 View Full Appraisal',
    copiedToast: '📋 Champion result copied to clipboard!',
    copyFailToast: 'Failed to copy result.',
    shareBracketBtn: '🔗 Share Same Bracket URL',
    shareBracketToast: '🔗 Same-bracket challenge URL copied!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Worst Houses',
      title: '💀 Best of the Worst House World Cup',
      subtitle: 'Out of 500 bizarre disaster houses, which one is the most livable?',
      questionPrompt: 'Which worst house would you rather live in?',
      championTitle: '🏆 The Best Survivor Among the Worst Houses!',
      oppositeLabel: '🌟 Try Worst of the Best'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Best Houses',
      title: '🌟 Worst of the Best House World Cup',
      subtitle: 'Out of 500 ultra-luxury dream houses, which one is surprisingly the worst?',
      questionPrompt: 'Which luxury house is actually the worst to live in?',
      championTitle: '💀 The Worst House Among the Luxury Mansions!',
      oppositeLabel: '💀 Try Best of the Worst'
    }
  },
  hi: {
    tabSearch: 'मेरा घर खोजें',
    tabWorst: 'सबसे बुरे में सर्वश्रेष्ठ',
    tabBest: 'सर्वश्रेष्ठ में सबसे बुरा',
    roundSuffix: ' राउंड',
    finalLabel: 'फाइनल',
    semiFinalLabel: 'सेमीफाइनल (टॉप 4)',
    totalMatchesPrefix: 'कुल ',
    totalMatchesSuffix: ' मैच',
    recommended: ' · अनुशंसित',
    selectRoundLabel: 'टूर्नामेंट आकार चुनें',
    startBtnSuffix: ' घरों का रैंडम टूर्नामेंट शुरू करें',
    lobbyHint1: 'हर गेम में Lv.{min}~{max} से बिना दोहराव के घर चुने जाते हैं।',
    lobbyHint2: 'मोबाइल पर ऊपर-नीचे स्क्रॉल करके दोनों घरों की तुलना करें और चुनें।',
    matchCounter: 'मैच {cur} / {total}',
    resetBtn: '🔄 फिर से शुरू',
    pickBtn: '👆 यह घर चुनें',
    realBadge: '🏛️ वास्तविक',
    fictionBadge: '🦄 काल्पनिक',
    realFullBadge: '🏛️ वास्तविक वास्तुकला',
    fictionFullBadge: '🦄 काल्पनिक वास्तुकला',
    builtYearLabel: '📅 निर्माण वर्ष',
    valueLabel: '💰 अनुमानित मूल्य',
    featureLabel: '✨ विशेषता',
    featureFullLabel: '✨ विशेष सुविधा',
    verdictLabel: '🤖 AI समीक्षा',
    championBadgeSuffix: ' विजेता',
    replayBtn: '🔄 फिर से खेलें',
    copyBtn: '📋 परिणाम कॉपी करें',
    viewDetailBtn: '🏠 पूरा विवरण देखें',
    copiedToast: '📋 विजेता परिणाम क्लिपबोर्ड पर कॉपी हो गया!',
    copyFailToast: 'कॉपी करने में विफल।',
    shareBracketBtn: '🔗 समान ब्रैकेट URL साझा करें',
    shareBracketToast: '🔗 समान टूर्नामेंट URL कॉपी हो गया!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 सबसे बुरे घर',
      title: '💀 सबसे बुरे घरों में सर्वश्रेष्ठ वर्ल्ड कप',
      subtitle: '500 अजीब और खराब घरों में से रहने के लिए सबसे बेहतर घर चुनें!',
      questionPrompt: 'इनमें से कौन-सा खराब घर रहने लायक है?',
      championTitle: '🏆 सबसे बुरे घरों में बचा सर्वश्रेष्ठ घर!',
      oppositeLabel: '🌟 सर्वश्रेष्ठ में सबसे बुरा खेलें'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 सर्वश्रेष्ठ घर',
      title: '🌟 सर्वश्रेष्ठ घरों में सबसे बुरा वर्ल्ड कप',
      subtitle: '500 आलीशान घरों में से सबसे असुविधाजनक या बुरा घर चुनें!',
      questionPrompt: 'इन शानदार घरों में से कौन-सा सबसे कम पसंद है?',
      championTitle: '💀 आलीशान घरों में चुना गया सबसे बुरा घर!',
      oppositeLabel: '💀 सबसे बुरे में सर्वश्रेष्ठ खेलें'
    }
  },
  vi: {
    tabSearch: 'Tìm Nhà Của Tôi',
    tabWorst: 'Tốt Nhất Trong Tệ Nhất',
    tabBest: 'Tệ Nhất Trong Tốt Nhất',
    roundSuffix: ' Nhà',
    finalLabel: 'Chung Kết',
    semiFinalLabel: 'Bán Kết (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' trận',
    recommended: ' · Gợi ý',
    selectRoundLabel: 'Chọn Quy Mô Giải Đấu',
    startBtnSuffix: ' Nhà Ngẫu Nhiên - Bắt Đầu',
    lobbyHint1: 'Chọn ngẫu nhiên không trùng lặp từ Lv.{min}~{max} mỗi lượt.',
    lobbyHint2: 'Trên điện thoại, cuộn lên xuống để so sánh hai ngôi nhà rồi chọn.',
    matchCounter: 'Trận {cur} / {total}',
    resetBtn: '🔄 Chơi lại',
    pickBtn: '👆 Chọn Ngôi Nhà Này',
    realBadge: '🏛️ Có thật',
    fictionBadge: '🦄 Hư cấu',
    realFullBadge: '🏛️ Kiến trúc có thật',
    fictionFullBadge: '🦄 Kiến trúc hư cấu',
    builtYearLabel: '📅 Năm xây dựng',
    valueLabel: '💰 Giá trị ước tính',
    featureLabel: '✨ Đặc điểm',
    featureFullLabel: '✨ Tính năng đặc biệt',
    verdictLabel: '🤖 Đánh giá AI',
    championBadgeSuffix: ' Vô Địch',
    replayBtn: '🔄 Chơi Lại Chế Độ Này',
    copyBtn: '📋 Sao Chép Kết Quả',
    viewDetailBtn: '🏠 Xem Chi Tiết Ngôi Nhà',
    copiedToast: '📋 Đã sao chép kết quả vô địch!',
    copyFailToast: 'Không thể sao chép kết quả.',
    shareBracketBtn: '🔗 Chia sẻ URL cùng bảng đấu',
    shareBracketToast: '🔗 Đã sao chép URL cùng bảng đấu!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Nhà Thảm Họa',
      title: '💀 World Cup Nhà Tốt Nhất Trong Tệ Nhất',
      subtitle: 'Trong 500 ngôi nhà thảm họa, đâu là nơi tạm ổn nhất để ở?',
      questionPrompt: 'Ngôi nhà tệ hại nào vẫn đáng sống nhất?',
      championTitle: '🏆 Ngôi Nhà Tốt Nhất Sống Sót Giữa Thảm Họa!',
      oppositeLabel: '🌟 Thử Tệ Nhất Trong Tốt Nhất'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Nhà Siêu Sang',
      title: '🌟 World Cup Nhà Tệ Nhất Trong Tốt Nhất',
      subtitle: 'Trong 500 biệt thự siêu sang, đâu là nơi bất tiện hoặc tệ nhất?',
      questionPrompt: 'Ngôi nhà xịn nào thực ra lại tệ nhất?',
      championTitle: '💀 Ngôi Nhà Tệ Nhất Giữa Dàn Biệt Thự Siêu Sang!',
      oppositeLabel: '💀 Thử Tốt Nhất Trong Tệ Nhất'
    }
  },
  fr: {
    tabSearch: 'Trouver Ma Maison',
    tabWorst: 'Meilleure des Pires',
    tabBest: 'Pire des Meilleures',
    roundSuffix: ' Maisons',
    finalLabel: 'Finale',
    semiFinalLabel: 'Demi-finale (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' matchs',
    recommended: ' · Recommandé',
    selectRoundLabel: 'Choisir la taille du tournoi',
    startBtnSuffix: ' Maisons Aléatoires',
    lobbyHint1: 'Tirage aléatoire sans doublon parmi les niveaux {min}~{max}.',
    lobbyHint2: 'Sur mobile, faites défiler de haut en bas pour comparer puis choisir.',
    matchCounter: 'Match {cur} / {total}',
    resetBtn: '🔄 Recommencer',
    pickBtn: '👆 Choisir cette maison',
    realBadge: '🏛️ Réel',
    fictionBadge: '🦄 Fiction',
    realFullBadge: '🏛️ Architecture réelle',
    fictionFullBadge: '🦄 Architecture fictive',
    builtYearLabel: '📅 Année',
    valueLabel: '💰 Valeur est.',
    featureLabel: '✨ Atout',
    featureFullLabel: '✨ Caractéristique spéciale',
    verdictLabel: '🤖 Avis IA',
    championBadgeSuffix: ' Vainqueur',
    replayBtn: '🔄 Rejouer',
    copyBtn: '📋 Copier le résultat',
    viewDetailBtn: '🏠 Voir la fiche complète',
    copiedToast: '📋 Résultat copié dans le presse-papiers !',
    copyFailToast: 'Échec de la copie.',
    shareBracketBtn: '🔗 Partager ce tirage (URL)',
    shareBracketToast: '🔗 URL du même tirage copiée !',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Pires Maisons',
      title: '💀 Coupe du Monde : La Meilleure des Pires',
      subtitle: 'Parmi 500 maisons catastrophiques, laquelle est la plus vivable ?',
      questionPrompt: 'Laquelle de ces pires maisons est la plus acceptable ?',
      championTitle: '🏆 La Meilleure Survivante des Pires Maisons !',
      oppositeLabel: '🌟 Essayer Pire des Meilleures'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Meilleures Maisons',
      title: '🌟 Coupe du Monde : La Pire des Meilleures',
      subtitle: 'Parmi 500 demeures de rêve, laquelle est finalement la moins pratique ?',
      questionPrompt: 'Laquelle de ces maisons de luxe est la pire ?',
      championTitle: '💀 La Pire Maison Parmi les Demeures de Luxe !',
      oppositeLabel: '💀 Essayer Meilleure des Pires'
    }
  },
  pt: {
    tabSearch: 'Minha Casa',
    tabWorst: 'Melhor das Piores',
    tabBest: 'Pior das Melhores',
    roundSuffix: ' Casas',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' jogos',
    recommended: ' · Recomendado',
    selectRoundLabel: 'Tamanho do Torneio',
    startBtnSuffix: ' Casas Aleatórias',
    lobbyHint1: 'Sorteio único sem repetições entre os níveis {min}~{max}.',
    lobbyHint2: 'No celular, role para cima e para baixo para comparar antes de escolher.',
    matchCounter: 'Jogo {cur} / {total}',
    resetBtn: '🔄 Reiniciar',
    pickBtn: '👆 Escolher Esta Casa',
    realBadge: '🏛️ Real',
    fictionBadge: '🦄 Ficção',
    realFullBadge: '🏛️ Arquitetura Real',
    fictionFullBadge: '🦄 Arquitetura Fictícia',
    builtYearLabel: '📅 Ano',
    valueLabel: '💰 Valor Est.',
    featureLabel: '✨ Destaque',
    featureFullLabel: '✨ Recurso Especial',
    verdictLabel: '🤖 Veredicto IA',
    championBadgeSuffix: ' Campeã',
    replayBtn: '🔄 Jogar Novamente',
    copyBtn: '📋 Copiar Resultado',
    viewDetailBtn: '🏠 Ver Avaliação Completa',
    copiedToast: '📋 Resultado copiado para a área de transferência!',
    copyFailToast: 'Falha ao copiar.',
    shareBracketBtn: '🔗 Compartilhar Mesma Chave',
    shareBracketToast: '🔗 URL da mesma chave copiada!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Piores Casas',
      title: '💀 Copa: A Melhor das Piores Casas',
      subtitle: 'Entre 500 casas desastrosas, qual é a mais habitável?',
      questionPrompt: 'Qual dessas piores casas é a melhor opção?',
      championTitle: '🏆 A Melhor Sobrevivente das Piores Casas!',
      oppositeLabel: '🌟 Testar Pior das Melhores'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Melhores Casas',
      title: '🌟 Copa: A Pior das Melhores Casas',
      subtitle: 'Entre 500 mansões incríveis, qual é surpreendentemente a pior?',
      questionPrompt: 'Qual dessas casas incríveis é a pior para morar?',
      championTitle: '💀 A Pior Casa Entre as Mansões de Luxo!',
      oppositeLabel: '💀 Testar Melhor das Piores'
    }
  },
  es: {
    tabSearch: 'Buscar Mi Casa',
    tabWorst: 'Mejor de las Peores',
    tabBest: 'Peor de las Mejores',
    roundSuffix: ' Casas',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' duelos',
    recommended: ' · Recomendado',
    selectRoundLabel: 'Tamaño del Torneo',
    startBtnSuffix: ' Casas Aleatorias',
    lobbyHint1: 'Selección aleatoria sin repetir entre niveles {min}~{max}.',
    lobbyHint2: 'En móvil, desliza arriba y abajo para comparar ambas casas antes de elegir.',
    matchCounter: 'Duelo {cur} / {total}',
    resetBtn: '🔄 Reiniciar',
    pickBtn: '👆 Elegir Esta Casa',
    realBadge: '🏛️ Real',
    fictionBadge: '🦄 Ficción',
    realFullBadge: '🏛️ Arquitectura Real',
    fictionFullBadge: '🦄 Arquitectura Ficticia',
    builtYearLabel: '📅 Año',
    valueLabel: '💰 Valor Est.',
    featureLabel: '✨ Rasgo',
    featureFullLabel: '✨ Función Especial',
    verdictLabel: '🤖 Veredicto IA',
    championBadgeSuffix: ' Campeona',
    replayBtn: '🔄 Jugar de Nuevo',
    copyBtn: '📋 Copiar Resultado',
    viewDetailBtn: '🏠 Ver Ficha Completa',
    copiedToast: '📋 ¡Resultado copiado al portapapeles!',
    copyFailToast: 'Error al copiar.',
    shareBracketBtn: '🔗 Compartir Mismo Cuadro',
    shareBracketToast: '🔗 ¡URL del mismo cuadro copiada!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Peores Casas',
      title: '💀 Mundial: La Mejor de las Peores Casas',
      subtitle: 'Entre 500 casas desastrosas, ¿cuál es la más habitable?',
      questionPrompt: '¿Cuál de estas peores casas elegirías?',
      championTitle: '🏆 ¡La Mejor Superviviente de las Peores Casas!',
      oppositeLabel: '🌟 Probar Peor de las Mejores'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Mejores Casas',
      title: '🌟 Mundial: La Peor de las Mejores Casas',
      subtitle: 'Entre 500 mansiones de lujo, ¿cuál es en realidad la peor?',
      questionPrompt: '¿Cuál de estas casas de lujo es la peor?',
      championTitle: '💀 ¡La Peor Casa Entre las Mansiones de Lujo!',
      oppositeLabel: '💀 Probar Mejor de las Peores'
    }
  },
  id: {
    tabSearch: 'Cari Rumahku',
    tabWorst: 'Terbaik dari Terburuk',
    tabBest: 'Terburuk dari Terbaik',
    roundSuffix: ' Besar',
    finalLabel: 'Final',
    semiFinalLabel: 'Semifinal (4 Besar)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' laga',
    recommended: ' · Rekomendasi',
    selectRoundLabel: 'Pilih Jumlah Peserta',
    startBtnSuffix: ' Rumah Acak - Mulai',
    lobbyHint1: 'Memilih secara acak tanpa duplikat dari Lv.{min}~{max}.',
    lobbyHint2: 'Di HP, gulir ke atas dan bawah untuk membandingkan kedua rumah.',
    matchCounter: 'Laga {cur} / {total}',
    resetBtn: '🔄 Ulangi',
    pickBtn: '👆 Pilih Rumah Ini',
    realBadge: '🏛️ Nyata',
    fictionBadge: '🦄 Fiksi',
    realFullBadge: '🏛️ Arsitektur Nyata',
    fictionFullBadge: '🦄 Arsitektur Fiksi',
    builtYearLabel: '📅 Tahun',
    valueLabel: '💰 Estimasi Nilai',
    featureLabel: '✨ Fitur',
    featureFullLabel: '✨ Fitur Spesial',
    verdictLabel: '🤖 Ulasan AI',
    championBadgeSuffix: ' Juara',
    replayBtn: '🔄 Main Lagi',
    copyBtn: '📋 Salin Hasil',
    viewDetailBtn: '🏠 Lihat Detail Rumah',
    copiedToast: '📋 Hasil juara disalin ke papan klip!',
    copyFailToast: 'Gagal menyalin hasil.',
    shareBracketBtn: '🔗 Bagikan URL Bagan Sama',
    shareBracketToast: '🔗 URL bagan yang sama disalin!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Rumah Terburuk',
      title: '💀 Piala Dunia: Terbaik dari Rumah Terburuk',
      subtitle: 'Dari 500 rumah bencana, mana yang paling layak ditinggali?',
      questionPrompt: 'Rumah terburuk mana yang masih paling mendingan?',
      championTitle: '🏆 Rumah Terbaik di Antara yang Terburuk!',
      oppositeLabel: '🌟 Coba Terburuk dari Terbaik'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Rumah Terbaik',
      title: '🌟 Piala Dunia: Terburuk dari Rumah Terbaik',
      subtitle: 'Dari 500 rumah mewah, mana yang ternyata paling tidak nyaman?',
      questionPrompt: 'Rumah mewah mana yang sebenarnya paling buruk?',
      championTitle: '💀 Rumah Terburuk di Antara Rumah Mewah!',
      oppositeLabel: '💀 Coba Terbaik dari Terburuk'
    }
  },
  ru: {
    tabSearch: 'Найти свой дом',
    tabWorst: 'Лучший из худших',
    tabBest: 'Худший из лучших',
    roundSuffix: ' домов',
    finalLabel: 'Финал',
    semiFinalLabel: 'Полуфинал (Топ-4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' матчей',
    recommended: ' · Рекомендуем',
    selectRoundLabel: 'Размер турнира',
    startBtnSuffix: ' случайных домов',
    lobbyHint1: 'Случайный выбор без повторов из уровней {min}~{max}.',
    lobbyHint2: 'На телефоне листайте вверх и вниз, чтобы сравнить дома и выбрать.',
    matchCounter: 'Матч {cur} / {total}',
    resetBtn: '🔄 Сначала',
    pickBtn: '👆 Выбрать этот дом',
    realBadge: '🏛️ Реальный',
    fictionBadge: '🦄 Вымысел',
    realFullBadge: '🏛️ Реальная архитектура',
    fictionFullBadge: '🦄 Вымышленная архитектура',
    builtYearLabel: '📅 Год',
    valueLabel: '💰 Оценка',
    featureLabel: '✨ Фишка',
    featureFullLabel: '✨ Особенность',
    verdictLabel: '🤖 Вердикт ИИ',
    championBadgeSuffix: ' Победитель',
    replayBtn: '🔄 Сыграть ещё раз',
    copyBtn: '📋 Копировать результат',
    viewDetailBtn: '🏠 Подробнее о доме',
    copiedToast: '📋 Результат скопирован в буфер обмена!',
    copyFailToast: 'Не удалось скопировать.',
    shareBracketBtn: '🔗 Поделиться этой сеткой',
    shareBracketToast: '🔗 Ссылка на ту же сетку скопирована!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Худшие дома',
      title: '💀 Турнир: Лучший из худших домов',
      subtitle: 'Какой из 500 ужасных домов всё-таки самый пригодный для жизни?',
      questionPrompt: 'В каком из этих худших домов вы бы жили?',
      championTitle: '🏆 Лучший выживший среди худших домов!',
      oppositeLabel: '🌟 Попробовать: Худший из лучших'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Лучшие дома',
      title: '🌟 Турнир: Худший из лучших домов',
      subtitle: 'Какой из 500 роскошных домов на деле самый неудобный?',
      questionPrompt: 'Какой из этих роскошных домов хуже всех?',
      championTitle: '💀 Худший дом среди элитных особняков!',
      oppositeLabel: '💀 Попробовать: Лучший из худших'
    }
  },
  de: {
    tabSearch: 'Mein Haus finden',
    tabWorst: 'Bestes der Schlechtesten',
    tabBest: 'Schlechtestes der Besten',
    roundSuffix: 'er-Feld',
    finalLabel: 'Finale',
    semiFinalLabel: 'Halbfinale (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' Duelle',
    recommended: ' · Empfohlen',
    selectRoundLabel: 'Turniergröße wählen',
    startBtnSuffix: 'er Zufalls-Turnier starten',
    lobbyHint1: 'Zieht zufällig ohne Duplikate aus Lv.{min}~{max}.',
    lobbyHint2: 'Mobil nach oben/unten scrollen, vergleichen und auswählen.',
    matchCounter: 'Duell {cur} / {total}',
    resetBtn: '🔄 Neustart',
    pickBtn: '👆 Dieses Haus wählen',
    realBadge: '🏛️ Real',
    fictionBadge: '🦄 Fiktion',
    realFullBadge: '🏛️ Reale Architektur',
    fictionFullBadge: '🦄 Fiktive Architektur',
    builtYearLabel: '📅 Baujahr',
    valueLabel: '💰 Schätzwert',
    featureLabel: '✨ Merkmal',
    featureFullLabel: '✨ Besonderheit',
    verdictLabel: '🤖 KI-Urteil',
    championBadgeSuffix: ' Sieger',
    replayBtn: '🔄 Nochmal spielen',
    copyBtn: '📋 Ergebnis kopieren',
    viewDetailBtn: '🏠 Vollständiges Gutachten',
    copiedToast: '📋 Ergebnis in die Zwischenablage kopiert!',
    copyFailToast: 'Kopieren fehlgeschlagen.',
    shareBracketBtn: '🔗 Gleiches Turnier teilen (URL)',
    shareBracketToast: '🔗 URL für gleiches Turnier kopiert!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Katastrophen-Häuser',
      title: '💀 WM: Das Beste der schlechtesten Häuser',
      subtitle: 'Welches der 500 Horror-Häuser ist noch am ehesten bewohnbar?',
      questionPrompt: 'Welches dieser schlimmen Häuser ist am besten?',
      championTitle: '🏆 Der beste Überlebende der schlimmsten Häuser!',
      oppositeLabel: '🌟 Schlechtestes der Besten testen'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Luxus-Häuser',
      title: '🌟 WM: Das Schlechteste der besten Häuser',
      subtitle: 'Welches der 500 Traumhäuser ist überraschend am unpraktischsten?',
      questionPrompt: 'Welches dieser Luxushäuser ist am schlimmsten?',
      championTitle: '💀 Das schlechteste Haus unter den Luxusvillen!',
      oppositeLabel: '💀 Bestes der Schlechtesten testen'
    }
  },
  it: {
    tabSearch: 'Trova la Mia Casa',
    tabWorst: 'Migliore delle Peggiori',
    tabBest: 'Peggiore delle Migliori',
    roundSuffix: ' Case',
    finalLabel: 'Finale',
    semiFinalLabel: 'Semifinale (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' sfide',
    recommended: ' · Consigliato',
    selectRoundLabel: 'Dimensione Torneo',
    startBtnSuffix: ' Case Casuali',
    lobbyHint1: 'Estrazione casuale senza duplicati dai livelli {min}~{max}.',
    lobbyHint2: 'Su mobile scorri su e giù per confrontare e scegliere.',
    matchCounter: 'Sfida {cur} / {total}',
    resetBtn: '🔄 Ricomincia',
    pickBtn: '👆 Scegli Questa Casa',
    realBadge: '🏛️ Reale',
    fictionBadge: '🦄 Fittizio',
    realFullBadge: '🏛️ Architettura Reale',
    fictionFullBadge: '🦄 Architettura Fittizia',
    builtYearLabel: '📅 Anno',
    valueLabel: '💰 Valore Stimato',
    featureLabel: '✨ Dettaglio',
    featureFullLabel: '✨ Caratteristica Speciale',
    verdictLabel: '🤖 Giudizio IA',
    championBadgeSuffix: ' Vincitrice',
    replayBtn: '🔄 Gioca Ancora',
    copyBtn: '📋 Copia Risultato',
    viewDetailBtn: '🏠 Vedi Scheda Completa',
    copiedToast: '📋 Risultato copiato negli appunti!',
    copyFailToast: 'Copia non riuscita.',
    shareBracketBtn: '🔗 Condividi Stesso Tabellone',
    shareBracketToast: '🔗 URL dello stesso tabellone copiato!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Case Peggiori',
      title: '💀 Torneo: La Migliore delle Peggiori',
      subtitle: 'Tra 500 case disastrose, qual è la più vivibile?',
      questionPrompt: 'Quale di queste case peggiori sceglieresti?',
      championTitle: '🏆 La Migliore Sopravvissuta tra le Peggiori!',
      oppositeLabel: '🌟 Prova Peggiore delle Migliori'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Case Migliori',
      title: '🌟 Torneo: La Peggiore delle Migliori',
      subtitle: 'Tra 500 ville da sogno, qual è sorprendentemente la peggiore?',
      questionPrompt: 'Quale di queste case di lusso è la peggiore?',
      championTitle: '💀 La Casa Peggiore tra le Ville di Lusso!',
      oppositeLabel: '💀 Prova Migliore delle Peggiori'
    }
  },
  ja: {
    tabSearch: 'マイホーム診断',
    tabWorst: '最悪の中で最高',
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
    lobbyHint2: 'スマホでは上下にスクロールして2つの家を見比べて選べます。',
    matchCounter: '{cur} / {total} 試合',
    resetBtn: '🔄 最初から',
    pickBtn: '👆 この家を選ぶ',
    realBadge: '🏛️ 実在',
    fictionBadge: '🦄 架空',
    realFullBadge: '🏛️ 実在する建築物',
    fictionFullBadge: '🦄 架空・想像の建築物',
    builtYearLabel: '📅 建築年',
    valueLabel: '💰 推定価値',
    featureLabel: '✨ 特徴',
    featureFullLabel: '✨ 特別な機能',
    verdictLabel: '🤖 AI総評',
    championBadgeSuffix: '強 優勝',
    replayBtn: '🔄 同じモードでもう一度',
    copyBtn: '📋 結果をコピー',
    viewDetailBtn: '🏠 この家の詳細を見る',
    copiedToast: '📋 優勝結果をクリップボードにコピーしました！',
    copyFailToast: 'コピーに失敗しました。',
    shareBracketBtn: '🔗 同じ対戦表URLを共有',
    shareBracketToast: '🔗 同じ条件・同じ対戦表のURLをコピーしました！',
    worstToBest: {
      badge: 'Lv.0 ~ 499 ヤバい家',
      title: '💀 最悪の家の中で最高の家ワールドカップ',
      subtitle: '住むのが厳しすぎる500軒のヤバい家から、まだマシな最高の家を選ぼう！',
      questionPrompt: 'この中でまだ住めそうな最高の家は？',
      championTitle: '🏆 最悪の家々から生き残った最高の家！',
      oppositeLabel: '🌟 最高の中で最悪に挑戦'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 超豪華な家',
      title: '🌟 最高の家の中で最悪の家ワールドカップ',
      subtitle: '超豪華な500軒の豪邸・宇宙基地から、意外と一番住みにくい最悪の家を選ぼう！',
      questionPrompt: 'この豪邸の中で一番住みたくない家は？',
      championTitle: '💀 超豪華ハウスの中で選ばれた最悪の家！',
      oppositeLabel: '💀 最悪の中で最高に挑戦'
    }
  },
  zh: {
    tabSearch: '寻找我的家',
    tabWorst: '最差中的最佳',
    tabBest: '最佳中的最差',
    roundSuffix: '强',
    finalLabel: '决赛',
    semiFinalLabel: '半决赛 (4强)',
    totalMatchesPrefix: '共',
    totalMatchesSuffix: '场',
    recommended: ' · 推荐',
    selectRoundLabel: '选择赛制规模',
    startBtnSuffix: '强 随机对阵开始',
    lobbyHint1: '每局从 Lv.{min}~{max} 中无重复随机抽取。',
    lobbyHint2: '手机端可上下滑动对比两栋房子后再做选择。',
    matchCounter: '第 {cur} / {total} 场',
    resetBtn: '🔄 重新开始',
    pickBtn: '👆 选择这栋房子',
    realBadge: '🏛️ 真实存在',
    fictionBadge: '🦄 虚构想象',
    realFullBadge: '🏛️ 真实存在的建筑',
    fictionFullBadge: '🦄 虚构想象的建筑',
    builtYearLabel: '📅 建造年份',
    valueLabel: '💰 预估价值',
    featureLabel: '✨ 特点',
    featureFullLabel: '✨ 特殊功能',
    verdictLabel: '🤖 AI总评',
    championBadgeSuffix: '强 冠军',
    replayBtn: '🔄 再玩一次',
    copyBtn: '📋 复制冠军结果',
    viewDetailBtn: '🏠 查看详细鉴定书',
    copiedToast: '📋 已复制冠军结果到剪贴板！',
    copyFailToast: '复制失败。',
    shareBracketBtn: '🔗 分享同款对阵URL',
    shareBracketToast: '🔗 已复制同条件对阵URL！',
    worstToBest: {
      badge: 'Lv.0 ~ 499 灾难小屋',
      title: '💀 最差房子中选最佳世界杯',
      subtitle: '在500种奇葩灾难小屋中，选出最勉强能住的最佳房子！',
      questionPrompt: '这之中最勉强能住的房子是？',
      championTitle: '🏆 最差房子中脱颖而出的最佳住宅！',
      oppositeLabel: '🌟 挑战最佳中的最差'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 顶级豪宅',
      title: '🌟 最佳房子中选最差世界杯',
      subtitle: '在500种超豪华豪宅中，选出意外最不方便或最不想住的房子！',
      questionPrompt: '这些豪宅中最让你劝退的是哪栋？',
      championTitle: '💀 顶级豪宅中选出的最差房子！',
      oppositeLabel: '💀 挑战最差中的最佳'
    }
  },
  ms: {
    tabSearch: 'Cari Rumah Saya',
    tabWorst: 'Terbaik Antara Terburuk',
    tabBest: 'Terburuk Antara Terbaik',
    roundSuffix: ' Rumah',
    finalLabel: 'Akhir',
    semiFinalLabel: 'Separuh Akhir (Top 4)',
    totalMatchesPrefix: '',
    totalMatchesSuffix: ' perlawanan',
    recommended: ' · Disyorkan',
    selectRoundLabel: 'Pilih Saiz Kejohanan',
    startBtnSuffix: ' Rumah Rawak - Mula',
    lobbyHint1: 'Dipilih secara rawak tanpa ulangan dari Lv.{min}~{max}.',
    lobbyHint2: 'Di telefon, tatal atas dan bawah untuk membandingkan sebelum memilih.',
    matchCounter: 'Perlawanan {cur} / {total}',
    resetBtn: '🔄 Mula Semula',
    pickBtn: '👆 Pilih Rumah Ini',
    realBadge: '🏛️ Sebenar',
    fictionBadge: '🦄 Fiksyen',
    realFullBadge: '🏛️ Seni Bina Sebenar',
    fictionFullBadge: '🦄 Seni Bina Fiksyen',
    builtYearLabel: '📅 Tahun Dibina',
    valueLabel: '💰 Anggaran Nilai',
    featureLabel: '✨ Ciri',
    featureFullLabel: '✨ Ciri Istimewa',
    verdictLabel: '🤖 Ulasan AI',
    championBadgeSuffix: ' Juara',
    replayBtn: '🔄 Main Semula',
    copyBtn: '📋 Salin Keputusan',
    viewDetailBtn: '🏠 Lihat Penilaian Penuh',
    copiedToast: '📋 Keputusan juara telah disalin!',
    copyFailToast: 'Gagal menyalin.',
    shareBracketBtn: '🔗 Kongsi URL Jadual Sama',
    shareBracketToast: '🔗 URL jadual yang sama telah disalin!',
    worstToBest: {
      badge: 'Lv.0 ~ 499 Rumah Terburuk',
      title: '💀 Piala Dunia: Terbaik Antara Terburuk',
      subtitle: 'Daripada 500 rumah bencana, mana satu yang paling boleh didiami?',
      questionPrompt: 'Rumah terburuk mana yang masih terbaik untuk anda?',
      championTitle: '🏆 Rumah Terbaik yang Terselamat Antara Terburuk!',
      oppositeLabel: '🌟 Cuba Terburuk Antara Terbaik'
    },
    bestToWorst: {
      badge: 'Lv.500 ~ 999 Rumah Terbaik',
      title: '🌟 Piala Dunia: Terburuk Antara Terbaik',
      subtitle: 'Daripada 500 rumah mewah, mana satu yang sebenarnya paling teruk?',
      questionPrompt: 'Rumah mewah mana yang sebenarnya paling teruk?',
      championTitle: '💀 Rumah Terburuk Antara Rumah Mewah!',
      oppositeLabel: '💀 Cuba Terbaik Antara Terburuk'
    }
  }
};

export function getWorldCupTranslation(lang = 'ko') {
  return WORLDCUP_I18N[lang] || WORLDCUP_I18N.ko;
}
