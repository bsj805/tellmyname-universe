// web/js/app.js — Mukbang (오늘 뭐 먹지?) Main Application Logic
// Features #4 & #5: Timezone-Aware Hero, Fixed Chronological Scroll, and Selective/Full Share Integration

import {
  SITE_ORIGIN,
  SITE_NAME,
  MEAL_CATEGORIES,
  MEAL_KEYS,
  MEAL_MAP,
  FOOD_ORIGIN_GROUPS,
  formatFoodCode,
  buildIllustrationPrompt,
  getFoodImageUrl
} from '../../src/lib/constants.js';

import {
  DEFAULT_TIMEZONE,
  normalizeTimezone,
  detectClientTimezone,
  getLocalTimeParts,
  resolveActiveMealByHour,
  getRemainingUntilMidnight,
  getOrderedMealsWithCurrentFlag
} from '../../src/lib/timezone.js';

import {
  getNameStrokeInfo,
  computeDateSeed,
  computeNameBaseHash,
  computeMealSlotHash,
  pickFoodForMealSlot,
  recommendDailyMeals
} from '../../src/lib/hash.js';

import * as FoodDatasetModule from '../../src/lib/food_dataset.js';

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANG_CODES,
  normalizeLang,
  detectLanguage,
  t,
  localizeFood
} from '../../src/lib/i18n.js';

import {
  shareModal,
  showToast,
  buildShareUrl,
  buildKakaoShareText,
  buildWhatsAppShareText,
  copyToClipboard
} from './share.js';

import {
  shareWhatsAppText,
  formatPriceForLang
} from './share_core.js';

import {
  GalleryController,
  parseRoute,
  buildGalleryUrl,
  buildFoodUrl,
  getFoodByCode
} from './gallery.js';

import {
  WorldCupController,
  buildWorldCupUrl
} from './worldcup.js';

import {
  parseWorldCupPath
} from '../../src/lib/worldcup.js';

export let galleryController = null;
export let worldCupController = null;

/**
 * High-Quality Fallback Food Master Pool
 * 40 iconic Korean & Michelin & Natural dishes across 8 origin groups
 * Used when food_dataset.js is building or has empty slots
 */
export const FALLBACK_FOODS_BY_MEAL = {
  breakfast: [
    {
      id: 'food_00001',
      index: 1,
      name: '흙 털어낸 유기농 생당근',
      englishName: 'Fresh Organic Raw Carrot',
      originGroup: 'RAW_NATURAL',
      originBadge: '🥕 생야채·과일·자연식',
      calories: '41 kcal',
      priceRange: '1,200원',
      tagline: '바니바니 당근당근! 아침을 깨우는 아삭한 소리와 맑은 시력 충전',
      funComment: '조리 시간 0초! 씹을수록 달큰한 채즙이 터지며 하루를 가볍게 시작합니다.',
      pairingTip: '제주산 무염 땅콩버터나 고소한 쌈장에 살짝 찍어 드세요.'
    },
    {
      id: 'food_00002',
      index: 2,
      name: '전주 콩나물해장국과 수란',
      englishName: 'Jeonju Bean Sprout Hangover Soup',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '380 kcal',
      priceRange: '8,500원',
      tagline: '칼칼하고 시원한 멸치 다시마 육수에 아스파라긴산 폭탄 해장',
      funComment: '수란에 김 가루와 국물 서너 숟가락을 부어 호로록 마시는 것이 전주의 법도입니다.',
      pairingTip: '모주(달달한 계피 한방주) 한 잔 곁들이면 속이 완벽히 풀립니다.'
    },
    {
      id: 'food_00003',
      index: 3,
      name: '설탕 듬뿍 뿌린 완숙 찰토마토',
      englishName: 'Sweet Sugar-Dusted Ripe Tomatoes',
      originGroup: 'RAW_NATURAL',
      originBadge: '🥕 생야채·과일·자연식',
      calories: '75 kcal',
      priceRange: '2,500원',
      tagline: '어릴 적 할머니가 큰 대접에 썰어주시던 달콤새콤 여름 아침의 맛',
      funComment: '토마토를 다 건져 먹은 뒤 대접째 들이켜는 설탕 국물이 진짜 주인공입니다.',
      pairingTip: '다 마신 국물에 차가운 우유를 살짝 섞으면 천국의 맛이 납니다.'
    },
    {
      id: 'food_00004',
      index: 4,
      name: '에그 베네딕트와 아보카도',
      englishName: 'Eggs Benedict with Creamy Avocado',
      originGroup: 'GLOBAL_DINING',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '520 kcal',
      priceRange: '16,000원',
      tagline: '잉글리시 머핀 위에 터지는 수란과 버터 풍미 가득 홀랜다이즈 소스',
      funComment: '노른자가 폭포처럼 흘러내릴 때의 쾌감! 갓 내린 아메리카노와 환상 조합.',
      pairingTip: '따뜻한 롱블랙 커피 또는 상큼한 생오렌지 주스를 곁들이세요.'
    },
    {
      id: 'food_00005',
      index: 5,
      name: '급식실 모닝빵 버거와 딸기잼',
      englishName: 'School Cafeteria Morning Bread Burger',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '340 kcal',
      priceRange: '2,000원',
      tagline: '폭신한 모닝빵에 케첩 마요 샐러드와 얇은 패티의 정겨운 추억',
      funComment: '수요일 아침 기숙사 급식에서 두 개씩 먹다 혼나던 그 맛 그대로!',
      pairingTip: '서울우유 흰 우유 200ml 팩 빨대로 콕 찔러 함께 드세요.'
    },
    {
      id: 'food_00006',
      index: 6,
      name: '빕 구르망 맑은 돼지곰탕',
      englishName: 'Bib Gourmand Clear Pork Gomtang',
      originGroup: 'BIB_GOURMAND',
      originBadge: '🏅 미슐랭 빕 구르망',
      calories: '450 kcal',
      priceRange: '10,000원',
      tagline: '잡내 하나 없이 투명하게 맑은 육수에 얇게 썬 지리산 버크셔K 흑돼지',
      funComment: '국물을 들이켜는 순간 감탄사가 절로 나오는 미쉐린 빕 구르망의 품격.',
      pairingTip: '고기는 특제 쌈장에 찍고 밥은 국물에 푹 토렴해 드세요.'
    },
    {
      id: 'food_00007',
      index: 7,
      name: '등산용 아삭 오이와 시골 쌈장',
      englishName: 'Hiking Crunchy Cucumber & Ssamjang',
      originGroup: 'RAW_NATURAL',
      originBadge: '🥕 생야채·과일·자연식',
      calories: '35 kcal',
      priceRange: '1,000원',
      tagline: '갈증을 단숨에 날려버리는 수분 95% 청량감 넘치는 천연 스포츠음료',
      funComment: '산 정상에서 먹든 침대 위에서 먹든 톡 부러뜨릴 때마다 청량지수 폭발!',
      pairingTip: '보리밥과 함께 먹거나 참기름 한 방울 떨어뜨린 시골 된장과 찰떡입니다.'
    },
    {
      id: 'food_00008',
      index: 8,
      name: '버터 간장계란밥과 스팸 2조각',
      englishName: 'Butter Soy Sauce Fried Egg Rice & Spam',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '510 kcal',
      priceRange: '3,000원',
      tagline: '반숙 계란 노른자에 녹아드는 고소한 버터와 짭조름한 양조간장 비빔',
      funComment: '바쁜 아침 3분 만에 뚝딱 비벼 먹는 한국인의 영원한 소울푸드.',
      pairingTip: '잘 익은 배추김치 한 점 얹어 먹으면 한 그릇 순식간에 비워집니다.'
    }
  ],
  lunch: [
    {
      id: 'food_00009',
      index: 9,
      name: '수요일 특식 스파게티 & 케첩 쏘야',
      englishName: 'Wednesday School Spaghetti & Sausage Stir-fry',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '680 kcal',
      priceRange: '4,500원',
      tagline: '급식 종 치자마자 전속력으로 달려가 식판 가득 받던 수요일의 축제',
      funComment: '새콤달콤 토마토 소스에 비벼진 면발과 칼집 낸 비엔나소시지의 도파민 파티!',
      pairingTip: '마카로니 콘샐러드와 노란 단무지 두 쪽을 곁들여보세요.'
    },
    {
      id: 'food_00010',
      index: 10,
      name: '직화 제육볶음과 싱싱한 상추쌈',
      englishName: 'Fire-Grilled Spicy Pork Bulgogi with Lettuce Wraps',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '720 kcal',
      priceRange: '9,500원',
      tagline: '센 불에 빠르게 볶아내 불맛이 살아있는 매콤달콤 밥도둑 끝판왕',
      funComment: '직장인 점심 선호도 부동의 1위! 상추 두 장 겹쳐 마늘 한 쪽 올리면 완벽.',
      pairingTip: '된장찌개 한 뚝배기와 흰 쌀밥을 고슬고슬하게 곁들이세요.'
    },
    {
      id: 'food_00011',
      index: 11,
      name: '빕 구르망 평양냉면 순면',
      englishName: 'Bib Gourmand Pyongyang Cold Noodles',
      originGroup: 'BIB_GOURMAND',
      originBadge: '🏅 미슐랭 빕 구르망',
      calories: '490 kcal',
      priceRange: '15,000원',
      tagline: '은은한 메밀 향과 깊고 슴슴한 소고기 육수가 빚어내는 무한 중독',
      funComment: '첫 입엔 밍밍해도 저녁이 되면 자꾸 생각나서 잠 못 이루는 마성의 국물.',
      pairingTip: '식초와 겨자를 치지 않고 면을 먼저 푼 뒤 육수를 두 모금 들이켜세요.'
    },
    {
      id: 'food_00012',
      index: 12,
      name: '급식 피카츄 돈까스와 떡꼬치 소스',
      englishName: 'School Nostalgia Pikachu Pork Cutlet',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '420 kcal',
      priceRange: '1,500원',
      tagline: '바삭하게 튀겨낸 피카츄 모양 패티에 양념치킨맛 달콤 소스 듬뿍',
      funComment: '귀부터 먹을까 꼬리부터 먹을까 고민하던 하굣길 최고의 간식이자 특식!',
      pairingTip: '슬러시 오렌지맛 한 컵과 함께하면 2000년대로 시간여행 완료.'
    },
    {
      id: 'food_00013',
      index: 13,
      name: '통오징어 튀김 먹물 짜장면',
      englishName: 'Deep-Fried Whole Squid Squid-Ink Black Bean Noodles',
      originGroup: 'UNIQUE_SPECIAL',
      originBadge: '🧪 음식점 특이메뉴',
      calories: '890 kcal',
      priceRange: '14,000원',
      tagline: '바삭한 통오징어 한 마리가 통째로 올라간 인스타 바이럴 퓨전 중식',
      funComment: '가위로 오징어를 숭덩숭덩 잘라 먹물 춘장 소스에 찍어 먹는 황홀경!',
      pairingTip: '단무지에 식초 두 바퀴 두르고 탄산음료와 함께 즐기세요.'
    },
    {
      id: 'food_00014',
      index: 14,
      name: '뚝배기 돼지김치찌개와 두툼한 계란말이',
      englishName: 'Pork Kimchi Stew & Thick Rolled Omelet',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '650 kcal',
      priceRange: '9,000원',
      tagline: '묵은지와 두툼한 돼지 앞다리살을 푹 끓여낸 든든하고 진한 한 끼',
      funComment: '국물에 밥을 슥슥 비벼서 케첩 뿌린 계란말이 한 조각 얹으면 피로가 싹 풀립니다.',
      pairingTip: '조미김에 찌개 고기를 싸서 간장에 콕 찍어 드셔보세요.'
    },
    {
      id: 'food_00015',
      index: 15,
      name: '연어초밥 12피스와 미니우동',
      englishName: 'Fresh Salmon Sushi 12pcs & Mini Udon',
      originGroup: 'GLOBAL_DINING',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '610 kcal',
      priceRange: '17,000원',
      tagline: '기름진 노르웨이 생연어와 고소한 뱃살, 달콤한 양파 타르타르 소스',
      funComment: '입안에 넣자마자 살살 녹아내리는 부드러움! 생와사비 살짝 얹어 한 입.',
      pairingTip: '락교와 초생강을 간장에 적셔 연어 위에 붓처럼 발라 드세요.'
    },
    {
      id: 'food_00016',
      index: 16,
      name: '비빔만두와 아삭 양배추무침',
      englishName: 'Crispy Fried Dumplings with Spicy Cabbage Salad',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '530 kcal',
      priceRange: '6,000원',
      tagline: '노릇노릇 바삭한 튀김만두에 새콤달콤 매콤하게 버무린 양배추 채',
      funComment: '만두피 사이에 양배추 무침을 쌈 싸듯 넣어 와그작 베어 무는 재미!',
      pairingTip: '시원한 냉보리차나 따끈한 분식집 어묵 국물과 곁들이세요.'
    }
  ],
  snack: [
    {
      id: 'food_00017',
      index: 17,
      name: '두바이 초콜릿 붕어빵',
      englishName: 'Dubai Chocolate Pistachio Kataifi Bungeoppang',
      originGroup: 'UNIQUE_SPECIAL',
      originBadge: '🧪 음식점 특이메뉴',
      calories: '390 kcal',
      priceRange: '4,500원',
      tagline: '바삭하게 볶은 카다이프와 고소한 피스타치오 스프레드가 가득 찬 황금빛 붕어빵',
      funComment: '한 입 베어 무는 순간 파사삭 소리와 함께 퍼지는 고급 피스타치오의 진수!',
      pairingTip: '진한 에스프레소나 시원한 콜드브루와 극상의 페어링을 자랑합니다.'
    },
    {
      id: 'food_00018',
      index: 18,
      name: '추억의 학교 앞 회오리감자',
      englishName: 'Nostalgic Spiral Tornado Potato',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '280 kcal',
      priceRange: '3,000원',
      tagline: '기다란 꼬치에 나선형으로 깎아 튀겨낸 겉바속촉 감자에 치즈 시즈닝 솔솔',
      funComment: '한 칸씩 뜯어먹다 보면 어느새 나무 꼬치 끝까지 순삭하는 마법!',
      pairingTip: '어니언 시즈닝과 칠리 시즈닝을 반반 섞어 뿌려달라고 하세요.'
    },
    {
      id: 'food_00019',
      index: 19,
      name: '알맹이 터지는 샤인머스캣 한 송이',
      englishName: 'Crisp Sweet Shine Muscat Grape Bunch',
      originGroup: 'RAW_NATURAL',
      originBadge: '🥕 생야채·과일·자연식',
      calories: '140 kcal',
      priceRange: '8,000원',
      tagline: '껍질째 아삭하게 씹히는 과육과 망고 향이 감도는 청량한 천연 비타민',
      funComment: '냉장고에 넣어 차갑게 칠링한 뒤 한 알씩 쏙쏙 따먹으면 오후 피로가 싹 날아갑니다.',
      pairingTip: '탄산수에 얼음과 샤인머스캣 몇 알을 띄워 천연 에이드로 즐기세요.'
    },
    {
      id: 'food_00020',
      index: 20,
      name: '갓 구운 버터 소금빵과 아이스 아메리카노',
      englishName: 'Fresh Baked Butter Salt Bread & Iced Americano',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '310 kcal',
      priceRange: '6,500원',
      tagline: '바닥은 버터로 튀겨지듯 바삭하고 속은 쫄깃한 소금빵에 고소한 펄솔트',
      funComment: '버터 동굴의 은혜로운 풍미와 쌉싸름한 원두커피의 깔끔한 피니시.',
      pairingTip: '오븐이나 에어프라이어에 2분 데워 따끈할 때 드세요.'
    },
    {
      id: 'food_00021',
      index: 21,
      name: '인절미 눈꽃 팥빙수',
      englishName: 'Injeolmi Soybean Powder Snow Bingsu',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '450 kcal',
      priceRange: '11,000원',
      tagline: '부드러운 우유 얼음 위에 볶은 콩고물과 쫄깃한 인절미 떡, 달콤한 연유',
      funComment: '숨 들이쉬며 콩가루 먹다 기침 조심! 숟가락으로 살살 비벼 먹는 디저트 명작.',
      pairingTip: '연유를 처음부터 다 붓지 말고 중간쯤 먹었을 때 추가로 부어보세요.'
    },
    {
      id: 'food_00022',
      index: 22,
      name: '바삭 고구마맛탕과 바나나우유',
      englishName: 'Candied Sweet Potatoes & Banana Flavored Milk',
      originGroup: 'SCHOOL_LUNCH',
      originBadge: '🍱 초중고 급식메뉴',
      calories: '360 kcal',
      priceRange: '3,500원',
      tagline: '물엿 시럽이 굳어 겉은 탕후루처럼 파삭하고 속은 촉촉한 꿀고구마',
      funComment: '찬물에 살짝 담갔다 빼면 시럽이 딱딱해져서 더욱 바삭해집니다.',
      pairingTip: '단지 모양 빙그레 바나나맛 우유와 함께 먹으면 환상의 궁합.'
    },
    {
      id: 'food_00023',
      index: 23,
      name: '민트초코 탕수육',
      englishName: 'Mint Chocolate Sweet & Sour Pork',
      originGroup: 'UNIQUE_SPECIAL',
      originBadge: '🧪 음식점 특이메뉴',
      calories: '580 kcal',
      priceRange: '18,000원',
      tagline: '바삭한 찹쌀 탕수육 위에 민트빛 소스와 초코칩이 쏟아진 괴식계의 슈퍼스타',
      funComment: '민초단에게는 천국, 반민초단에게는 충격! 인스타 스토리 업로드 보장 메뉴.',
      pairingTip: '눈을 감고 시원한 민트 향과 고기 육즙의 반전 조화를 음미해보세요.'
    },
    {
      id: 'food_00024',
      index: 24,
      name: '대왕 공룡알 초코빙수',
      englishName: 'Giant Dinosaur Egg Chocolate Shaved Ice',
      originGroup: 'UNIQUE_SPECIAL',
      originBadge: '🧪 음식점 특이메뉴',
      calories: '620 kcal',
      priceRange: '15,000원',
      tagline: '작은 나무 망치로 거대한 초콜릿 알을 깨뜨리면 젤리와 아이스크림이 와르르',
      funComment: '스트레스 해소와 당 충전을 동시에 달성하는 도파민 뿜뿜 이색 디저트!',
      pairingTip: '망치질 영상을 슬로우 모션으로 찍어 친구들에게 공유해보세요.'
    }
  ],
  dinner: [
    {
      id: 'food_00025',
      index: 25,
      name: '[3스타] 한우 우니(성게알) 타르타르',
      englishName: 'Michelin 3-Star Hanwoo Beef & Sea Urchin Tartare',
      originGroup: 'MICHELIN_3',
      originBadge: '⭐⭐⭐ 미슐랭 3스타',
      calories: '480 kcal',
      priceRange: '85,000원',
      tagline: '최상급 1++ 한우 꾸리살과 캘리포니아산 성게알, 바삭한 김부각의 완벽한 하모니',
      funComment: '입안 가득 번지는 바다와 육지의 진귀한 풍미. 오늘 밤 나만을 위한 최고의 사치.',
      pairingTip: '미네랄이 풍부한 드라이 화이트 와인이나 샴페인 한 잔을 추천합니다.'
    },
    {
      id: 'food_00026',
      index: 26,
      name: '두꺼운 숙성 삼겹살과 미나리 구이',
      englishName: 'Thick Aged Pork Belly with Fresh Water Parsley',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '820 kcal',
      priceRange: '18,000원',
      tagline: '노릇하게 구운 삼겹살 기름에 청도 미나리를 살짝 숨 죽여 돌돌 말아먹는 정석',
      funComment: '지글지글 고기 굽는 소리와 향긋한 미나리 향기만으로도 하루의 피로가 눈 녹듯 사라집니다.',
      pairingTip: '갈치속젓에 콕 찍고 솥뚜껑 볶음밥으로 완벽하게 마무리하세요.'
    },
    {
      id: 'food_00027',
      index: 27,
      name: '[2스타] 숯불에 구운 제철 금태 솥밥',
      englishName: 'Michelin 2-Star Charcoal Blackthroat Seaperch Pot Rice',
      originGroup: 'MICHELIN_2',
      originBadge: '⭐⭐ 미슐랭 2스타',
      calories: '550 kcal',
      priceRange: '65,000원',
      tagline: '참숯 향을 머금은 부드러운 금태 살과 도정한 제철 쌀로 지은 감동의 솥밥',
      funComment: '주걱으로 생선 살을 살살 으깨어 밥알 사이사이에 기름이 배어들도록 비벼 드세요.',
      pairingTip: '맑은 모시조개 백합탕과 갓김치 한 점을 곁들이면 최고입니다.'
    },
    {
      id: 'food_00028',
      index: 28,
      name: '빕 구르망 손칼국수와 왕만두전골',
      englishName: 'Bib Gourmand Hand-cut Noodles & Royal Dumpling Hot Pot',
      originGroup: 'BIB_GOURMAND',
      originBadge: '🏅 미슐랭 빕 구르망',
      calories: '690 kcal',
      priceRange: '13,000원',
      tagline: '진한 사골 양지 육수에 속이 꽉 찬 수제 만두와 쫄깃한 자가제면 칼국수',
      funComment: '보글보글 끓어오르는 냄비 앞에서 마늘 듬뿍 들어간 겉절이 김치를 곁들이는 행복.',
      pairingTip: '만두를 국물 속에서 살짝 터뜨려 육수의 감칠맛을 두 배로 끌어올리세요.'
    },
    {
      id: 'food_00029',
      index: 29,
      name: '트러플 크림 뇨끼와 바게트',
      englishName: 'Truffle Cream Potato Gnocchi & Baguette',
      originGroup: 'GLOBAL_DINING',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '630 kcal',
      priceRange: '21,000원',
      tagline: '쫀득쫀득하게 빚은 감자 뇨끼에 진한 블랙 트러플 오일과 버섯 크림소스',
      funComment: '크림소스를 숟가락으로 싹싹 긁어먹은 뒤 바게트로 접시를 닦아먹게 되는 맛.',
      pairingTip: '바디감 있는 이탈리아 레드 와인(끼안티 클라시코)과 곁들이세요.'
    },
    {
      id: 'food_00030',
      index: 30,
      name: '[1스타] 프렌치 어니언 수프와 한우 채끝',
      englishName: 'Michelin 1-Star French Onion Soup & Striploin',
      originGroup: 'MICHELIN_1',
      originBadge: '⭐ 미슐랭 1스타',
      calories: '710 kcal',
      priceRange: '75,000원',
      tagline: '캐러멜라이징한 양파의 깊은 단맛과 그뤼예르 치즈 크루통, 미디엄 레어 채끝',
      funComment: '수프 스푼을 치즈 속으로 푹 찔러 넣을 때 늘어나는 치즈의 황홀한 비주얼.',
      pairingTip: '오크 향이 감도는 보르도 풀바디 와인과 환상의 마리아주를 이룹니다.'
    },
    {
      id: 'food_00031',
      index: 31,
      name: '차돌박이 된장찌개와 강된장 비빔밥',
      englishName: 'Beef Brisket Soybean Paste Stew & Bibimbap',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '680 kcal',
      priceRange: '10,000원',
      tagline: '구수한 집된장에 기름진 차돌박이가 어우러진 한국인의 저녁 밥도둑',
      funComment: '양푼에 상추 뜯어 넣고 강된장 두 숟갈 둘러 쓱쓱 비벼 먹으면 밥 두 공기 거뜬!',
      pairingTip: '풋고추를 된장에 푹 찍어 아삭하게 베어 물며 드세요.'
    },
    {
      id: 'food_00032',
      index: 32,
      name: '춘천 철판 닭갈비와 눈꽃치즈 볶음밥',
      englishName: 'Chuncheon Spicy Stir-fried Chicken & Cheese Fried Rice',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '780 kcal',
      priceRange: '14,000원',
      tagline: '매콤달콤 고추장 양념 닭다리살과 양배추, 고구마, 쫄깃한 쌀떡의 어우러짐',
      funComment: '철판 바닥에 눌어붙은 치즈 볶음밥을 숟가락 모서리로 긁어먹을 때가 하이라이트!',
      pairingTip: '시원한 얼음 동동 동치미 국물로 매운맛을 달래가며 드세요.'
    }
  ],
  night: [
    {
      id: 'food_00033',
      index: 33,
      name: '후라이드 반 양념 반 바삭 치킨',
      englishName: 'Half & Half Crispy Fried and Sweet Spicy Chicken',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '980 kcal',
      priceRange: '21,000원',
      tagline: '바삭한 튀김옷 속 육즙이 팡팡 터지는 야식의 절대군주 치킨',
      funComment: '후라이드 한 입 물고 양념 소스에 푹 찍어 먹는 닭다리의 황홀경!',
      pairingTip: '차갑게 얼린 생맥주나 톡 쏘는 콜라, 아삭한 치킨무를 준비하세요.'
    },
    {
      id: 'food_00034',
      index: 34,
      name: '숯불 불족발과 새콤 비빔막국수',
      englishName: 'Charcoal Spicy Pork Trotters with Cold Buckwheat Noodles',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '890 kcal',
      priceRange: '35,000원',
      tagline: '숯불 향이 진하게 밴 매콤 쫄깃 콜라겐 덩어리 족발과 시원한 막국수',
      funComment: '비닐장갑 끼고 뼈째 뜯어야 제맛! 땀방울 송골송골 맺히는 화끈한 야식.',
      pairingTip: '백김치에 싸서 매운맛을 중화하고 시원한 소맥과 함께 즐기세요.'
    },
    {
      id: 'food_00035',
      index: 35,
      name: '편의점 불닭게티 + 참치마요 삼각김밥',
      englishName: 'Convenience Store Buldak-Ghetti & Tuna Mayo Rice Ball',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '750 kcal',
      priceRange: '4,500원',
      tagline: '불닭볶음면과 짜파게티의 황금 배율에 참치마요 김밥을 비벼 먹는 궁극의 편의점 레시피',
      funComment: '새벽 1시 편의점 창가 테이블에서 먹으면 그 어떤 고급 코스 요리도 안 부러운 맛.',
      pairingTip: '스트링치즈 한 줄 찢어 올리고 전자레인지에 40초 돌려보세요.'
    },
    {
      id: 'food_00036',
      index: 36,
      name: '죄책감 제로 등산용 아삭 오이와 쌈장',
      englishName: 'Zero-Guilt Crunchy Night Cucumber & Dip',
      originGroup: 'RAW_NATURAL',
      originBadge: '🥕 생야채·과일·자연식',
      calories: '30 kcal',
      priceRange: '1,000원',
      tagline: '밤늦게 먹어도 붓기 없고 살찔 걱정 없는 청량한 수분 가득 자연식',
      funComment: '와그작 씹는 소리로 야식 욕구를 200% 잠재워주는 다이어터들의 든든한 방패!',
      pairingTip: '시판 쌈장에 들기름 한 방울과 다진 마늘을 섞으면 환상적인 디핑 소스 완성.'
    },
    {
      id: 'food_00037',
      index: 37,
      name: '칼칼한 한우 대창 곱창전골',
      englishName: 'Spicy Hanwoo Beef Tripe & Intestine Hot Pot',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '920 kcal',
      priceRange: '38,000원',
      tagline: '녹진한 대창 기름과 들깨가루, 깻잎이 어우러진 땀 뻘뻘 심야 안주',
      funComment: '우동 사리 넣어 호로록 건져 먹고 볶음밥까지 긁어먹어야 야식 완성이죠.',
      pairingTip: '칼칼한 국물에 소주 한 잔 기울이며 밤새 이야기 나누기 딱 좋은 메뉴.'
    },
    {
      id: 'food_00038',
      index: 38,
      name: '심야 포장마차 냄비우동과 모둠튀김',
      englishName: 'Midnight Street Cart Pot Udon & Assorted Tempura',
      originGroup: 'KOREAN_POPULAR',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '580 kcal',
      priceRange: '7,000원',
      tagline: '노란 양은냄비에 쑥갓과 유부, 고춧가루를 팍팍 넣고 끓여낸 정겨운 우동',
      funComment: '찬 바람 부는 밤 따끈한 국물 한 모금 마시면 얼어붙은 온몸이 사르르 녹아내립니다.',
      pairingTip: '야끼만두와 김말이를 우동 국물에 푹 적셔 드세요.'
    },
    {
      id: 'food_00039',
      index: 39,
      name: '치즈폭포 마라 로제 떡볶이',
      englishName: 'Cheese Waterfall Mara Rosé Tteokbokki',
      originGroup: 'UNIQUE_SPECIAL',
      originBadge: '🧪 음식점 특이메뉴',
      calories: '860 kcal',
      priceRange: '13,000원',
      tagline: '얼얼한 마라와 부드러운 생크림 로제 소스 위에 모짜렐라 치즈가 이불처럼 덮인 특식',
      funComment: '분모자와 중국당면을 포크에 돌돌 말아 치즈와 함께 먹는 야간 탄수화물 폭탄!',
      pairingTip: '바삭한 쿨피스 복숭아맛 얼음과 함께 즐기세요.'
    },
    {
      id: 'food_00040',
      index: 40,
      name: '겨울철 슈크림 붕어빵 3마리',
      englishName: 'Winter Custard Cream Bungeoppang 3pcs',
      originGroup: 'NIGHT_SNACK_CAFE',
      originBadge: '🍲 한국 인기 메뉴',
      calories: '380 kcal',
      priceRange: '2,000원',
      tagline: '겉은 바삭하고 속은 뜨거운 바닐라 슈크림이 가득 찬 귀여운 붕어빵 세 자매',
      funComment: '팥붕 vs 슈붕의 영원한 대결에서 오늘은 달콤한 슈붕의 압승!',
      pairingTip: '입천장 데이지 않게 꼬리부터 살살 식혀가며 드세요.'
    }
  ]
};

/**
 * Get active pools dynamically merging FoodDatasetModule or fallback
 */
export function getMealPools() {
  if (FoodDatasetModule && FoodDatasetModule.FOODS_BY_MEAL && Object.keys(FoodDatasetModule.FOODS_BY_MEAL).length > 0) {
    return FoodDatasetModule.FOODS_BY_MEAL;
  }
  if (FoodDatasetModule && FoodDatasetModule.poolsByMeal && Object.keys(FoodDatasetModule.poolsByMeal).length > 0) {
    return FoodDatasetModule.poolsByMeal;
  }
  if (FoodDatasetModule && FoodDatasetModule.MEAL_POOLS && Object.keys(FoodDatasetModule.MEAL_POOLS).length > 0) {
    return FoodDatasetModule.MEAL_POOLS;
  }
  if (FoodDatasetModule && typeof FoodDatasetModule.getFoodsByMeal === 'function') {
    const res = FoodDatasetModule.getFoodsByMeal();
    if (res && res.breakfast) return res;
  }
  if (FoodDatasetModule && FoodDatasetModule.default) {
    if (FoodDatasetModule.default.FOODS_BY_MEAL) return FoodDatasetModule.default.FOODS_BY_MEAL;
    if (typeof FoodDatasetModule.default === 'object' && FoodDatasetModule.default.breakfast) return FoodDatasetModule.default;
  }
  return FALLBACK_FOODS_BY_MEAL;
}

/**
 * Application Global State
 */
export const appState = {
  currentName: '김서윤',
  currentTimezone: DEFAULT_TIMEZONE,
  simulatedHour: null, // null = live real-time, 0..23 = simulated
  currentDateStr: '2026-11-08',
  selectedMealKeys: new Set(['lunch']),
  dailyData: null,
  activeMealKey: 'lunch',
  timerInterval: null,
  lastKnownHour: null,
  currentLang: 'ko',
  foodDict: null,
  activeTab: 'daily',
  hasUserSearched: false
};

/**
 * In-memory Cache for Lazy-Fetched Food Translation Dictionaries
 */
export const foodDictCache = new Map();

/**
 * Lazy Fetch Food Translations for Target Language
 */
export async function loadFoodDict(lang) {
  const norm = normalizeLang(lang);
  if (norm === 'ko') {
    return null;
  }
  if (foodDictCache.has(norm)) {
    return foodDictCache.get(norm);
  }
  try {
    const res = await fetch(`/i18n/foods/${norm}.json`);
    if (res.ok) {
      const data = await res.json();
      foodDictCache.set(norm, data);
      return data;
    }
  } catch (err) {
    console.warn(`[i18n] Failed to fetch food bundle for ${norm}:`, err);
  }
  return null;
}

/**
 * Resolve effective current hour (simulated or real-time)
 */
export function getEffectiveHour() {
  if (appState.simulatedHour !== null && appState.simulatedHour >= 0 && appState.simulatedHour <= 23) {
    return appState.simulatedHour;
  }
  const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
  return parts.hour;
}

/**
 * Format today date text for display using Intl.DateTimeFormat
 */
export function formatDateDisplay(dateStr, lang = appState.currentLang) {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    const locale = langObj ? langObj.locale : 'ko-KR';
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
    return formatter.format(dt);
  } catch (_) {
    return dateStr;
  }
}

/**
 * Apply Localized UI Strings to Static DOM Elements
 */
export function applyUiStrings() {
  const lang = appState.currentLang;
  if (typeof document === 'undefined') return;

  document.documentElement.lang = lang;

  // text content
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(lang, key);
    }
  });

  // placeholder
  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(lang, key);
    }
  });

  // title
  const titles = document.querySelectorAll('[data-i18n-title]');
  titles.forEach(el => {
    const key = el.dataset.i18nTitle;
    if (key) {
      el.title = t(lang, key);
    }
  });

  // aria-label
  const arias = document.querySelectorAll('[data-i18n-aria]');
  arias.forEach(el => {
    const key = el.dataset.i18nAria;
    if (key) {
      el.setAttribute('aria-label', t(lang, key));
    }
  });

  // Sync Language Select dropdown
  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  // Update hero meal chips active styling & text
  updateHeroMealChips();

  // Translate footer brand & static links when lang !== 'ko'
  const isKo = lang === 'ko';
  const fBrandStrong = document.querySelector('.footer-brand strong');
  if (fBrandStrong) fBrandStrong.textContent = isKo ? '오늘 뭐 먹지? (Mukbang)' : `${t(lang, 'brandTitle')} (Mukbang)`;
  document.querySelectorAll('.footer-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes('job.tellmyname.app')) a.textContent = isKo ? '💼 나에게 어울리는 직업' : '💼 Find My Job';
    else if (href.includes('car.tellmyname.app')) a.textContent = isKo ? '🚗 나에게 어울리는 자동차' : '🚗 Find My Car';
    else if (href.endsWith('/about.html')) a.textContent = isKo ? '소개 (About)' : 'About';
    else if (href.endsWith('/contact.html')) a.textContent = isKo ? '문의 (Contact)' : 'Contact';
    else if (href.endsWith('/privacy.html')) a.textContent = isKo ? '개인정보처리방침 (Privacy Policy)' : 'Privacy Policy';
    else if (href.endsWith('/terms.html')) a.textContent = isKo ? '이용약관 (Terms of Service)' : 'Terms of Service';
  });
}

/**
 * Render Language-Specific Sample Names Bar
 */
export function renderSampleChips() {
  const container = document.getElementById('sample-chips-container');
  if (!container) return;

  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === appState.currentLang);
  const sampleNames = langObj?.sampleNames || ['김서윤', '이민준', '박지훈', '최수아', '정우성', '홍길동'];

  container.innerHTML = sampleNames.map(name => `
    <button type="button" class="sample-chip" data-name="${name}">${name}</button>
  `).join('');

  const chips = container.querySelectorAll('.sample-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const name = chip.dataset.name;
      if (name) {
        appState.currentName = name;
        appState.hasUserSearched = true;
        const nameInput = document.getElementById('name-input');
        if (nameInput) nameInput.value = name;
        updateRecommendation();
        showToast(t(appState.currentLang, 'toastNameChange', { name }));
      }
    });
  });
}

/**
 * Switch Language, Update URL & Cookie, Lazy Fetch, and Re-render without Reload
 */
export async function switchLanguage(newLang) {
  const norm = normalizeLang(newLang);
  appState.currentLang = norm;

  // 1. Update URL ?lang= parameter via history.replaceState
  if (typeof window !== 'undefined' && window.location) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', norm);
    window.history.replaceState(null, '', url.toString());
  }

  // 2. Set cookie mk_lang for 1 year
  if (typeof document !== 'undefined') {
    document.cookie = `mk_lang=${norm}; path=/; max-age=31536000; SameSite=Lax`;
  }

  // 3. Lazy fetch food dictionary
  appState.foodDict = await loadFoodDict(norm);

  // 4. Update UI strings, samples, recommendation (hash codes remain invariant)
  if (!appState.hasUserSearched) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === norm);
    if (langObj && Array.isArray(langObj.sampleNames) && langObj.sampleNames.length > 0) {
      appState.currentName = langObj.sampleNames[0];
      const nameInput = document.getElementById('name-input');
      if (nameInput) nameInput.value = appState.currentName;
    }
  }
  applyUiStrings();
  renderSampleChips();
  updateRecommendation();
  if (typeof window !== 'undefined' && typeof window.updatePhotoDiaryPromoLang === 'function') {
    window.updatePhotoDiaryPromoLang(norm);
  }

  // 5. Update gallery controller
  if (galleryController) {
    galleryController.setLang(norm, appState.foodDict);
  }
  if (worldCupController) {
    worldCupController.setLanguage(norm, appState.foodDict);
  }
}

/**
 * Calculate & update daily recommendation
 */
export function updateRecommendation() {
  const pools = getMealPools();
  appState.dailyData = recommendDailyMeals(appState.currentName, appState.currentDateStr, pools);

  const effectiveHour = getEffectiveHour();
  const activeMealObj = resolveActiveMealByHour(effectiveHour);
  appState.activeMealKey = activeMealObj.key;

  // Render both sections
  renderHeroMeal();
  renderTimeline();
  updateStickyBar();
  updateRetentionBar();

  // Requirement 5: Show bottom origin-spectrum-section ONLY on initial root screen before user name search
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const spectrumEl = document.querySelector('.origin-spectrum-section');
    if (spectrumEl) {
      const path = window.location.pathname || '/';
      const isInitialRoot = (path === '/' || path === '' || path === '/index.html') &&
        !new URLSearchParams(window.location.search || '').has('name') &&
        !appState.hasUserSearched &&
        appState.activeTab === 'daily';
      spectrumEl.style.display = isInitialRoot ? '' : 'none';
    }
  }
}

/**
 * Update 5 Mini Meal Chips Active State & Localized Labels
 */
export function updateHeroMealChips() {
  const chips = document.querySelectorAll('.hero-meal-chip');
  chips.forEach(chip => {
    const meal = chip.dataset.meal;
    if (meal) {
      chip.textContent = t(appState.currentLang, 'chip_' + meal);
    }
    if (chip.dataset.meal === appState.activeMealKey) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

/**
 * Render Top Hero Spotlight Section (#hero-current-meal)
 */
export function renderHeroMeal() {
  const heroSection = document.getElementById('hero-current-meal');
  if (!heroSection || !appState.dailyData) return;

  const activeKey = appState.activeMealKey;
  const entry = appState.dailyData.meals[activeKey];
  const rawFood = entry ? entry.food : null;
  if (!rawFood) return;

  const food = localizeFood(rawFood, appState.currentLang, appState.foodDict);

  const effectiveHour = getEffectiveHour();
  const timeStr = `${String(effectiveHour).padStart(2, '0')}:00`;

  const originClass = `badge-${(food.originGroup || '').toLowerCase().replace(/_/g, '')}`;
  const originBadge = food.originBadge || t(appState.currentLang, 'origin_' + food.originGroup);
  const paddedIndex = formatFoodCode(food.index || 1);
  const imgUrl = `/images/${paddedIndex}.png`;
  const fallbackSvgUrl = `/r2/foods/${paddedIndex}.svg`;

  const currentSlotObj = resolveActiveMealByHour(effectiveHour);
  const isNow = activeKey === currentSlotObj.key;
  const localizedMealLabel = t(appState.currentLang, 'meal_' + activeKey);
  const localizedMealFullLabel = t(appState.currentLang, 'mealFull_' + activeKey);

  const timeHeading = isNow
    ? t(appState.currentLang, 'nowIsMeal', { emoji: entry.mealEmoji, meal: localizedMealLabel, time: timeStr })
    : t(appState.currentLang, 'mealRecommendTime', { emoji: entry.mealEmoji, meal: localizedMealLabel, timeRange: entry.timeRangeText });

  const isKo = appState.currentLang === 'ko';

  heroSection.innerHTML = `
    <article class="hero-meal-card" style="--meal-color: ${entry.themeColor}">
      <div class="hero-header-line">
        <div class="hero-time-indicator">
          <span class="pulse-dot ${isNow ? 'active' : ''}" aria-hidden="true"></span>
          <span class="hero-time-text">${timeHeading}</span>
        </div>
        <div class="hero-meal-badge-pill" style="color: ${entry.themeColor}; border-color: ${entry.themeColor}">
          <span>${entry.mealEmoji} ${localizedMealFullLabel}</span>
          <span>(${entry.timeRangeText})</span>
        </div>
      </div>

      <div class="hero-image-wrapper">
        <img
          id="hero-food-img"
          class="hero-food-image"
          src="${imgUrl}"
          alt="${food.name}"
          loading="eager"
          onerror="this.onerror=null; this.src='${fallbackSvgUrl}'; this.parentElement.classList.add('svg-fallback');"
        />
        <div class="hero-origin-badge-float">
          <span class="origin-badge ${originClass}">${originBadge}</span>
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-origin-badge-inline">
          <span class="origin-badge ${originClass}">${originBadge}</span>
        </div>

        <h2 class="hero-food-title">${food.name}</h2>
        ${(food.englishName && appState.currentLang !== 'en') ? `<div class="hero-food-en-title">${food.englishName}</div>` : ''}

        <div class="hero-meta-badges">
          ${food.calories ? `<span class="meta-chip calorie">🔥 ${food.calories}</span>` : ''}
          ${food.priceRange ? `<span class="meta-chip price">💰 ${formatPriceForLang(food.priceRange, appState.currentLang)}</span>` : ''}
        </div>

        ${food.tagline ? `<blockquote class="hero-tagline-quote">"${food.tagline}"</blockquote>` : ''}
        ${(food.funComment && isKo) ? `<p class="hero-fun-comment">${food.funComment}</p>` : ''}
        ${(food.pairingTip && isKo) ? `<div class="hero-pairing-tip"><span>💡</span> <span><strong>${t(appState.currentLang, 'heroPairingTip')}</strong> ${food.pairingTip}</span></div>` : ''}

        <div class="hero-actions">
          <button type="button" id="hero-share-kakao-btn" class="btn btn-share-kakao-hero" title="카카오톡 공유">
            <span class="btn-icon">💬</span>
            <span class="btn-label">${t(appState.currentLang, 'heroShareKakao')}</span>
          </button>
          <button type="button" id="hero-share-whatsapp-btn" class="btn btn-share-whatsapp-hero" title="WhatsApp 공유">
            <span class="btn-icon">🟢</span>
            <span class="btn-label">${t(appState.currentLang, 'shareWhatsAppBtn')}</span>
          </button>
          <button type="button" id="hero-share-single-btn" class="btn btn-share-story-hero" title="인스타 스토리 공유">
            <span class="btn-icon">📸</span>
            <span class="btn-label">${t(appState.currentLang, 'heroShareStory')}</span>
          </button>
          <button type="button" id="hero-share-link-btn" class="btn btn-share-link-hero" title="식단 공유 링크 복사">
            <span class="btn-icon">🔗</span>
            <span class="btn-label">${t(appState.currentLang, 'heroShareLink')}</span>
          </button>
          <button type="button" id="hero-share-all-btn" class="btn btn-secondary hero-desktop-only" title="오늘 하루 5끼 전체 공유하기">
            <span>${t(appState.currentLang, 'heroShareAll')}</span>
          </button>
        </div>
      </div>
    </article>
  `;

  // Attach button events
  const kakaoBtn = document.getElementById('hero-share-kakao-btn');
  const waBtn = document.getElementById('hero-share-whatsapp-btn');
  const singleBtn = document.getElementById('hero-share-single-btn');
  const linkBtn = document.getElementById('hero-share-link-btn');
  const allBtn = document.getElementById('hero-share-all-btn');

  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', async () => {
      const payload = buildKakaoShareText({
        dailyData: appState.dailyData,
        selectedMealKeys: [activeKey],
        name: appState.currentName,
        dateStr: appState.currentDateStr,
        lang: appState.currentLang
      });
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: payload.title,
            text: payload.text,
            url: payload.url
          });
          showToast(t(appState.currentLang, 'toastKakaoSuccess'));
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }
      await copyToClipboard(`${payload.title}\n\n${payload.text}`, t(appState.currentLang, 'toastKakaoCopied'));
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', async () => {
      const payload = buildWhatsAppShareText({
        dailyData: appState.dailyData,
        selectedMealKeys: [activeKey],
        name: appState.currentName,
        dateStr: appState.currentDateStr,
        lang: appState.currentLang
      });
      await shareWhatsAppText({
        title: payload.title,
        text: payload.text,
        url: payload.url,
        lang: appState.currentLang
      });
    });
  }

  if (singleBtn) {
    singleBtn.addEventListener('click', () => {
      shareModal.open({
        dailyData: appState.dailyData,
        initialMealKeys: [activeKey],
        mode: 'selective'
      });
    });
  }

  if (linkBtn) {
    linkBtn.addEventListener('click', () => {
      const shareUrl = buildShareUrl({
        name: appState.currentName,
        date: appState.currentDateStr,
        tz: appState.currentTimezone,
        meals: [activeKey]
      });
      copyToClipboard(shareUrl, t(appState.currentLang, 'toastLinkCopied'));
    });
  }

  if (allBtn) {
    allBtn.addEventListener('click', () => {
      shareModal.open({
        dailyData: appState.dailyData,
        initialMealKeys: [...MEAL_KEYS],
        mode: 'daily_all'
      });
    });
  }

  updateHeroMealChips();
}

/**
 * Render Chronological 5 Meals Section (#daily-timeline-section)
 * Strictly ordered: Breakfast -> Lunch -> Snack -> Dinner -> Night
 */
export function renderTimeline() {
  const container = document.getElementById('timeline-cards-container');
  const userTitleEl = document.getElementById('timeline-user-name');
  const titleEl = document.getElementById('timeline-main-title');
  if (!container || !appState.dailyData) return;

  if (titleEl) {
    titleEl.textContent = t(appState.currentLang, 'timelineTitle', { name: appState.currentName });
  } else if (userTitleEl) {
    userTitleEl.textContent = appState.currentName;
  }

  const mealsList = appState.dailyData.orderedList;
  const activeKey = appState.activeMealKey;
  const isKo = appState.currentLang === 'ko';

  container.innerHTML = mealsList.map((entry, index) => {
    const rawFood = entry.food || {};
    const food = localizeFood(rawFood, appState.currentLang, appState.foodDict);
    const originClass = `badge-${(food.originGroup || '').toLowerCase().replace(/_/g, '')}`;
    const originBadge = food.originBadge || t(appState.currentLang, 'origin_' + food.originGroup);
    const isCurrent = entry.mealKey === activeKey;
    const isSelected = appState.selectedMealKeys.has(entry.mealKey);
    const paddedIndex = formatFoodCode(food.index || 1);
    const imgUrl = `/images/${paddedIndex}.png`;
    const fallbackSvgUrl = `/r2/foods/${paddedIndex}.svg`;
    const localizedMealLabel = t(appState.currentLang, 'meal_' + entry.mealKey);

    return `
      <div
        class="meal-timeline-card ${isCurrent ? 'is-current-slot' : ''}"
        id="timeline-card-${entry.mealKey}"
        data-meal="${entry.mealKey}"
      >
        <!-- Selection Checkbox -->
        <div class="card-select-wrap">
          <input
            type="checkbox"
            class="meal-select-checkbox"
            data-meal="${entry.mealKey}"
            aria-label="${t(appState.currentLang, 'cardAriaSelect', { meal: localizedMealLabel })}"
            ${isSelected ? 'checked' : ''}
          />
        </div>

        <!-- Thumbnail Image -->
        <div class="card-thumb-wrap">
          <img
            class="card-thumb-img"
            src="${imgUrl}"
            alt="${food.name}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackSvgUrl}';"
          />
          <span class="card-meal-order-badge">${t(appState.currentLang, 'cardMealOrder', { order: entry.mealOrder, meal: localizedMealLabel })}</span>
        </div>

        <!-- Info Body -->
        <div class="card-info-wrap">
          <div class="card-meta-header">
            <span class="card-meal-pill" style="color: ${entry.themeColor}">
              ${entry.mealEmoji} ${localizedMealLabel} (${entry.timeRangeText})
            </span>
            ${isCurrent ? `<span class="current-now-badge">${t(appState.currentLang, 'nowBadge')}</span>` : ''}
            <span class="origin-badge ${originClass}">${originBadge}</span>
          </div>

          <h3 class="card-food-name">${food.name}</h3>
          ${food.tagline ? `<p class="card-tagline">"${food.tagline}"</p>` : ''}

          <div class="card-specs-row">
            ${food.calories ? `<span>🔥 ${food.calories}</span>` : ''}
            ${food.priceRange ? `<span>💰 ${formatPriceForLang(food.priceRange, appState.currentLang)}</span>` : ''}
            ${(food.pairingTip && isKo) ? `<span>💡 꿀조합: ${food.pairingTip}</span>` : ''}
          </div>
        </div>

        <!-- Single Share Action -->
        <div class="card-action-wrap">
          <button
            type="button"
            class="btn-card-share"
            data-meal="${entry.mealKey}"
            title="${t(appState.currentLang, 'cardShareTitle', { meal: localizedMealLabel })}"
          >
            <span>${t(appState.currentLang, 'cardShareBtn')}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Bind checkbox events
  const checkboxes = container.querySelectorAll('.meal-select-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const meal = cb.dataset.meal;
      if (cb.checked) {
        appState.selectedMealKeys.add(meal);
      } else {
        appState.selectedMealKeys.delete(meal);
      }
      updateStickyBar();
    });
  });

  // Bind single meal share button events
  const shareButtons = container.querySelectorAll('.btn-card-share');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const meal = btn.dataset.meal;
      shareModal.open({
        dailyData: appState.dailyData,
        initialMealKeys: [meal],
        mode: 'selective'
      });
    });
  });
}

/**
 * Update Bottom Sticky Floating Share Bar
 */
export function updateStickyBar() {
  const stickyBar = document.getElementById('sticky-share-bar');
  const countEl = document.getElementById('sticky-selected-count');
  const namesEl = document.getElementById('sticky-selected-names');
  if (!stickyBar) return;

  const count = appState.selectedMealKeys.size;
  if (count === 0) {
    stickyBar.classList.remove('visible');
    return;
  }

  stickyBar.classList.add('visible');
  if (countEl) {
    countEl.textContent = t(appState.currentLang, 'stickySelectedCount', { count });
  }

  if (namesEl) {
    const selectedLabels = MEAL_CATEGORIES
      .filter(m => appState.selectedMealKeys.has(m.key))
      .map(m => `${m.emoji} ${t(appState.currentLang, 'meal_' + m.key)}`);
    namesEl.textContent = selectedLabels.join(', ');
  }
}

/**
 * Update Retention Bar (Date Text & Midnight Countdown)
 */
export function updateRetentionBar() {
  const dateText = document.getElementById('current-date-text');
  if (dateText) {
    dateText.textContent = t(appState.currentLang, 'todayWithDate', { date: formatDateDisplay(appState.currentDateStr, appState.currentLang) });
  }

  const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
  const countdown = getRemainingUntilMidnight(parts);
  const countdownEl = document.getElementById('midnight-countdown');
  if (countdownEl) {
    countdownEl.textContent = countdown.formatted;
  }
}

/**
 * Setup Real-time Clock and Countdown Loop
 */
export function startClockLoop() {
  if (appState.timerInterval) {
    clearInterval(appState.timerInterval);
  }

  const tick = () => {
    const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
    const countdown = getRemainingUntilMidnight(parts);

    const countdownEl = document.getElementById('midnight-countdown');
    if (countdownEl) {
      countdownEl.textContent = countdown.formatted;
    }

    const liveBadge = document.getElementById('tz-current-time-badge');
    const statusText = document.getElementById('tz-status-text');
    const indicatorDot = document.getElementById('tz-live-indicator');
    const summaryStatus = document.getElementById('tz-summary-status');

    if (appState.simulatedHour === null) {
      // Live Mode
      if (liveBadge) liveBadge.textContent = parts.timeStr;
      if (statusText) statusText.textContent = t(appState.currentLang, 'simLiveModeDetect');
      if (summaryStatus) summaryStatus.textContent = t(appState.currentLang, 'simLiveMode');
      if (indicatorDot) {
        indicatorDot.classList.add('active');
        indicatorDot.classList.remove('simulating');
      }

      // Check if actual wall-clock hour changed in live mode
      if (appState.lastKnownHour === null) {
        appState.lastKnownHour = parts.hour;
      } else if (parts.hour !== appState.lastKnownHour) {
        appState.lastKnownHour = parts.hour;
        const activeObj = resolveActiveMealByHour(parts.hour);
        appState.activeMealKey = activeObj.key;
        renderHeroMeal();
        renderTimeline();
      }
    } else {
      // Simulated Mode
      const simHourStr = `${String(appState.simulatedHour).padStart(2, '0')}:00`;
      if (liveBadge) liveBadge.textContent = `${simHourStr}`;
      if (statusText) statusText.textContent = t(appState.currentLang, 'simModeTitle', { time: simHourStr });
      if (summaryStatus) summaryStatus.textContent = t(appState.currentLang, 'simBadge', { time: simHourStr });
      if (indicatorDot) {
        indicatorDot.classList.remove('active');
        indicatorDot.classList.add('simulating');
      }
    }
  };

  tick();
  appState.timerInterval = setInterval(tick, 1000);
}

/**
 * Hour Simulation Setter
 */
export function setSimulatedHour(hour) {
  const h = Math.max(0, Math.min(23, parseInt(hour, 10) || 0));
  appState.simulatedHour = h;

  // Sync Slider & Labels
  const slider = document.getElementById('hour-slider');
  const sliderValue = document.getElementById('slider-hour-value');
  const sliderHint = document.getElementById('slider-meal-hint');
  const activeObj = resolveActiveMealByHour(h);
  const mealName = t(appState.currentLang, 'meal_' + activeObj.key);

  if (slider) slider.value = String(h);
  if (sliderValue) sliderValue.textContent = `${String(h).padStart(2, '0')}:00`;
  if (sliderHint) sliderHint.textContent = `${activeObj.emoji} ${t(appState.currentLang, 'sliderMealHint', { meal: mealName })}`;

  // Sync Pill Buttons
  const hourPills = document.querySelectorAll('.btn-hour-pill');
  hourPills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.dataset.hour && parseInt(pill.dataset.hour, 10) === h) {
      pill.classList.add('active');
    }
  });

  const resetBtn = document.getElementById('btn-reset-live-time');
  if (resetBtn) resetBtn.classList.remove('active');

  const summaryStatus = document.getElementById('tz-summary-status');
  if (summaryStatus) summaryStatus.textContent = t(appState.currentLang, 'simBadge', { time: `${String(h).padStart(2, '0')}:00` });

  appState.activeMealKey = activeObj.key;
  renderHeroMeal();
  renderTimeline();
}

/**
 * Reset Live Real-Time
 */
export function resetLiveTime() {
  appState.simulatedHour = null;

  const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
  const activeObj = resolveActiveMealByHour(parts.hour);
  const mealName = t(appState.currentLang, 'meal_' + activeObj.key);

  const slider = document.getElementById('hour-slider');
  const sliderValue = document.getElementById('slider-hour-value');
  const sliderHint = document.getElementById('slider-meal-hint');

  if (slider) slider.value = String(parts.hour);
  if (sliderValue) sliderValue.textContent = parts.timeStr;
  if (sliderHint) sliderHint.textContent = `${activeObj.emoji} ${t(appState.currentLang, 'sliderMealHint', { meal: mealName })}`;

  const hourPills = document.querySelectorAll('.btn-hour-pill');
  hourPills.forEach(pill => pill.classList.remove('active'));

  const resetBtn = document.getElementById('btn-reset-live-time');
  if (resetBtn) resetBtn.classList.add('active');

  const summaryStatus = document.getElementById('tz-summary-status');
  if (summaryStatus) summaryStatus.textContent = t(appState.currentLang, 'simLiveMode');

  appState.lastKnownHour = parts.hour;
  appState.activeMealKey = activeObj.key;
  renderHeroMeal();
  renderTimeline();
  showToast(t(appState.currentLang, 'toastLiveReset'));
}

/**
 * Set Timezone and Recalculate
 */
export function setTimezone(newTz) {
  appState.currentTimezone = normalizeTimezone(newTz);
  const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
  appState.currentDateStr = parts.dateStr;

  const tzSelect = document.getElementById('tz-select');
  if (tzSelect) tzSelect.value = appState.currentTimezone;

  updateRecommendation();
  showToast(t(appState.currentLang, 'toastTzChange', { tz: appState.currentTimezone }));
}

/**
 * Set Date (YYYY-MM-DD)
 */
export function setDate(newDateStr) {
  appState.currentDateStr = newDateStr;
  updateRecommendation();
}

/**
 * Application Initialization
 */
export function initApp() {
  if (typeof window === 'undefined') return;

  // 1. Parse URL Search Parameters & Language Detection
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get('name');
  const urlDate = params.get('date');
  const urlTz = params.get('tz');
  const urlHour = params.get('hour');
  const urlMeals = params.get('meals');
  const urlLang = params.get('lang');

  const pathLangMatch = (typeof window !== 'undefined' && window.location.pathname)
    ? window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/i)
    : null;
  const pathLang = (pathLangMatch && SUPPORTED_LANG_CODES.includes(pathLangMatch[1].toLowerCase()))
    ? pathLangMatch[1].toLowerCase()
    : null;
  const effectiveUrlLang = urlLang || pathLang;

  let cookieLang = null;
  if (typeof document !== 'undefined' && document.cookie) {
    const match = document.cookie.match(/(?:^|;\s*)mk_lang=([^;]+)/);
    if (match) cookieLang = decodeURIComponent(match[1]);
  }

  const detectedLang = detectLanguage({
    urlLang: effectiveUrlLang,
    cookieLang,
    navigatorLanguages: (typeof navigator !== 'undefined' && navigator.languages) ? navigator.languages : []
  });
  appState.currentLang = detectedLang;

  // Language selector
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = appState.currentLang;
    langSelect.addEventListener('change', () => {
      switchLanguage(langSelect.value);
    });
  }

  // Initial UI string application & sample chips
  applyUiStrings();
  renderSampleChips();

  // Lazy load translations if non-ko
  if (appState.currentLang !== 'ko') {
    loadFoodDict(appState.currentLang).then(dict => {
      appState.foodDict = dict;
      renderHeroMeal();
      renderTimeline();
    });
  }

  if (urlName && urlName.trim()) {
    appState.currentName = urlName.trim();
  } else if (appState.currentLang !== 'ko') {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === appState.currentLang);
    if (langObj && Array.isArray(langObj.sampleNames) && langObj.sampleNames.length > 0) {
      appState.currentName = langObj.sampleNames[0];
    }
  }

  if (urlTz && urlTz.trim()) {
    appState.currentTimezone = normalizeTimezone(urlTz);
  } else {
    appState.currentTimezone = detectClientTimezone();
  }

  const parts = getLocalTimeParts(new Date(), appState.currentTimezone);
  appState.currentDateStr = urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate)
    ? urlDate
    : parts.dateStr;

  if (urlHour !== null && urlHour !== undefined && urlHour !== '') {
    appState.simulatedHour = Math.max(0, Math.min(23, parseInt(urlHour, 10) || 0));
  }

  // Determine active meal slot
  const effectiveHour = getEffectiveHour();
  appState.lastKnownHour = parts.hour;
  const initialActiveMeal = resolveActiveMealByHour(effectiveHour);
  appState.activeMealKey = initialActiveMeal.key;

  // Selected meals from URL or default to active
  if (urlMeals) {
    if (urlMeals === 'all') {
      appState.selectedMealKeys = new Set(MEAL_KEYS);
    } else {
      const parsedKeys = urlMeals.split(',').map(s => s.trim()).filter(k => MEAL_MAP[k]);
      appState.selectedMealKeys = parsedKeys.length > 0 ? new Set(parsedKeys) : new Set([initialActiveMeal.key]);
    }
  } else {
    appState.selectedMealKeys = new Set([initialActiveMeal.key]);
  }

  // 2. Sync DOM Controls with Initial State
  const nameInput = document.getElementById('name-input');
  if (nameInput) nameInput.value = appState.currentName;

  const tzSelect = document.getElementById('tz-select');
  if (tzSelect) tzSelect.value = appState.currentTimezone;

  const slider = document.getElementById('hour-slider');
  const sliderValue = document.getElementById('slider-hour-value');
  const sliderHint = document.getElementById('slider-meal-hint');
  if (slider) slider.value = String(effectiveHour);
  if (sliderValue) sliderValue.textContent = `${String(effectiveHour).padStart(2, '0')}:00`;
  if (sliderHint) sliderHint.textContent = `${initialActiveMeal.emoji} ${initialActiveMeal.fullLabel} 시간대`;

  // 3. Bind Name Form and Random Button
  const nameForm = document.getElementById('name-form');
  if (nameForm) {
    nameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (nameInput && nameInput.value.trim()) {
        appState.currentName = nameInput.value.trim();
        appState.hasUserSearched = true;
        updateRecommendation();
        showToast(t(appState.currentLang, 'toastNameGen', { name: appState.currentName }));
      }
    });
  }

  const randomBtn = document.getElementById('random-name-btn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === appState.currentLang);
      const names = langObj?.sampleNames || ['김서윤', '이민준', '박지훈', '최수아', '정우성', '홍길동'];
      const picked = names[Math.floor(Math.random() * names.length)];
      appState.currentName = picked;
      appState.hasUserSearched = true;
      if (nameInput) nameInput.value = picked;
      updateRecommendation();
      showToast(t(appState.currentLang, 'toastRandomPick', { name: picked }));
    });
  }

  // 4. Bind Mini Meal Chips (Tap to Swap Hero Meal)
  const heroMealChips = document.querySelectorAll('.hero-meal-chip');
  heroMealChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const meal = chip.dataset.meal;
      if (meal && MEAL_MAP[meal]) {
        appState.activeMealKey = meal;
        renderHeroMeal();
        renderTimeline();
      }
    });
  });

  // 5. Bind Timezone and Hour Simulation Controls
  if (tzSelect) {
    tzSelect.addEventListener('change', () => {
      setTimezone(tzSelect.value);
    });
  }

  const hourPills = document.querySelectorAll('.btn-hour-pill');
  hourPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.id === 'btn-reset-live-time') {
        resetLiveTime();
      } else if (pill.dataset.hour) {
        setSimulatedHour(pill.dataset.hour);
      }
    });
  });

  if (slider) {
    slider.addEventListener('input', () => {
      setSimulatedHour(slider.value);
    });
  }

  // 5. Bind Date Navigation Buttons
  const btnPrev = document.getElementById('btn-prev-day');
  const btnToday = document.getElementById('btn-today');
  const btnNext = document.getElementById('btn-next-day');

  const shiftDate = (offsetDays) => {
    const [y, m, d] = appState.currentDateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d + offsetDays);
    const ny = dt.getFullYear();
    const nm = String(dt.getMonth() + 1).padStart(2, '0');
    const nd = String(dt.getDate()).padStart(2, '0');
    return `${ny}-${nm}-${nd}`;
  };

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      setDate(shiftDate(-1));
      btnToday?.classList.remove('active');
    });
  }

  if (btnToday) {
    btnToday.addEventListener('click', () => {
      const p = getLocalTimeParts(new Date(), appState.currentTimezone);
      setDate(p.dateStr);
      btnToday.classList.add('active');
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      setDate(shiftDate(1));
      btnToday?.classList.remove('active');
      showToast(t(appState.currentLang, 'toastNextDayPreview'));
    });
  }

  // 6. Bind Timeline Selection Batch Controls
  const btnSelectAll = document.getElementById('btn-select-all');
  const btnSelectCurrent = document.getElementById('btn-select-current');
  const btnDeselectAll = document.getElementById('btn-deselect-all');

  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      appState.selectedMealKeys = new Set(MEAL_KEYS);
      renderTimeline();
      updateStickyBar();
    });
  }

  if (btnSelectCurrent) {
    btnSelectCurrent.addEventListener('click', () => {
      appState.selectedMealKeys = new Set([appState.activeMealKey]);
      renderTimeline();
      updateStickyBar();
    });
  }

  if (btnDeselectAll) {
    btnDeselectAll.addEventListener('click', () => {
      appState.selectedMealKeys.clear();
      renderTimeline();
      updateStickyBar();
    });
  }

  // 7. Bind Sticky Bar Action Buttons
  const stickySelectedBtn = document.getElementById('sticky-share-selected-btn');
  const stickyAllBtn = document.getElementById('sticky-share-all-btn');

  if (stickySelectedBtn) {
    stickySelectedBtn.addEventListener('click', () => {
      const keys = Array.from(appState.selectedMealKeys);
      shareModal.open({
        dailyData: appState.dailyData,
        initialMealKeys: keys.length > 0 ? keys : [appState.activeMealKey],
        mode: 'selective'
      });
    });
  }

  if (stickyAllBtn) {
    stickyAllBtn.addEventListener('click', () => {
      shareModal.open({
        dailyData: appState.dailyData,
        initialMealKeys: [...MEAL_KEYS],
        mode: 'daily_all'
      });
    });
  }

  // 8. Initialize Share Modal and Render First View
  shareModal.init();
  updateRecommendation();
  startClockLoop();

  // 9. Initialize Gallery & Client-Side Tab/URL Routing (Feature #14)
  initGalleryRouting();
}

/**
 * Switch Active Main Navigation Tab (Daily vs Gallery)
 */
export function switchTab(tabName, { pushState = true } = {}) {
  appState.activeTab = tabName;
  const tabDaily = document.getElementById('tab-nav-daily');
  const tabGallery = document.getElementById('tab-nav-gallery');
  const tabWorldcup = document.getElementById('tab-nav-worldcup');
  const dailyView = document.getElementById('daily-view');
  const galleryView = document.getElementById('gallery-view');
  const worldcupView = document.getElementById('worldcup-view');
  const stickyBar = document.getElementById('sticky-share-bar');

  if (tabName === 'gallery') {
    tabGallery?.classList.add('active');
    tabDaily?.classList.remove('active');
    tabWorldcup?.classList.remove('active');
    if (dailyView) dailyView.style.display = 'none';
    if (galleryView) galleryView.style.display = 'flex';
    if (worldcupView) worldcupView.style.display = 'none';
    if (stickyBar) stickyBar.style.display = 'none';

    if (pushState && typeof window !== 'undefined' && window.history?.pushState) {
      const url = buildGalleryUrl(galleryController?.currentCategory, appState.currentLang);
      window.history.pushState({ view: 'gallery' }, '', url);
    }
  } else if (tabName === 'worldcup') {
    tabWorldcup?.classList.add('active');
    tabDaily?.classList.remove('active');
    tabGallery?.classList.remove('active');
    if (dailyView) dailyView.style.display = 'none';
    if (galleryView) galleryView.style.display = 'none';
    if (worldcupView) worldcupView.style.display = 'block';
    if (stickyBar) stickyBar.style.display = 'none';

    if (galleryController) {
      galleryController.closeDetail({ pushState: false });
    }

    if (pushState && typeof window !== 'undefined' && window.history?.pushState) {
      const url = buildWorldCupUrl(
        worldCupController?.selectedCategory || 'lunch',
        worldCupController?.selectedMode || 'best',
        appState.currentLang
      );
      window.history.pushState({ view: 'worldcup' }, '', url);
    }
  } else {
    // Daily view
    tabDaily?.classList.add('active');
    tabGallery?.classList.remove('active');
    tabWorldcup?.classList.remove('active');
    if (dailyView) dailyView.style.display = '';
    if (galleryView) galleryView.style.display = 'none';
    if (worldcupView) worldcupView.style.display = 'none';
    if (stickyBar) stickyBar.style.display = '';

    // If detail modal is open, close it
    if (galleryController) {
      galleryController.closeDetail({ pushState: false });
    }

    if (pushState && typeof window !== 'undefined' && window.history?.pushState) {
      const url = appState.currentLang !== 'ko' ? `/?lang=${appState.currentLang}` : '/';
      window.history.pushState({ view: 'home' }, '', url);
    }
  }
}

/**
 * Initialize Gallery & World Cup Controllers & Route Listeners
 */
export function initGalleryRouting() {
  galleryController = new GalleryController({
    foods: FoodDatasetModule.ALL_FOODS || [],
    lang: appState.currentLang,
    dict: appState.foodDict
  });
  galleryController.init();

  worldCupController = new WorldCupController({
    foods: FoodDatasetModule.ALL_FOODS || [],
    lang: appState.currentLang,
    dict: appState.foodDict,
    onOpenFoodDetail: (food) => {
      switchTab('gallery', { pushState: false });
      galleryController?.openDetail(food, { pushState: true });
    }
  });
  worldCupController.init();

  const tabDaily = document.getElementById('tab-nav-daily');
  const tabGallery = document.getElementById('tab-nav-gallery');
  const tabWorldcup = document.getElementById('tab-nav-worldcup');

  if (tabDaily) {
    tabDaily.addEventListener('click', () => {
      switchTab('daily', { pushState: true });
    });
  }

  if (tabGallery) {
    tabGallery.addEventListener('click', () => {
      switchTab('gallery', { pushState: true });
    });
  }

  if (tabWorldcup) {
    tabWorldcup.addEventListener('click', () => {
      switchTab('worldcup', { pushState: true });
    });
  }

  // Handle browser popstate (back/forward history)
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      const wcRoute = parseWorldCupPath(window.location.pathname);
      if (wcRoute.isWorldCup) {
        worldCupController?.applyPresetFromUrl();
        worldCupController?.render();
        switchTab('worldcup', { pushState: false });
        return;
      }
      const route = parseRoute(window.location.pathname);
      if (route.view === 'gallery') {
        switchTab('gallery', { pushState: false });
        galleryController?.closeDetail({ pushState: false });
      } else if (route.view === 'food') {
        switchTab('gallery', { pushState: false });
        const food = getFoodByCode(route.code, FoodDatasetModule.ALL_FOODS);
        if (food) {
          galleryController?.openDetail(food, { pushState: false });
        }
      } else {
        switchTab('daily', { pushState: false });
      }
    });

    // Handle initial route on first page load
    const initialWcRoute = parseWorldCupPath(window.location.pathname);
    if (initialWcRoute.isWorldCup) {
      switchTab('worldcup', { pushState: false });
      return;
    }
    const initialRoute = parseRoute(window.location.pathname);
    if (initialRoute.view === 'gallery') {
      switchTab('gallery', { pushState: false });
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      if (catParam) {
        galleryController?.setCategory(catParam);
      }
    } else if (initialRoute.view === 'food') {
      switchTab('gallery', { pushState: false });
      const food = getFoodByCode(initialRoute.code, FoodDatasetModule.ALL_FOODS);
      if (food) {
        galleryController?.openDetail(food, { pushState: false });
      }
    }
  }
}

// Auto bootstrap on DOM load in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
