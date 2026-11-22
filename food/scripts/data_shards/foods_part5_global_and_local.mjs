// scripts/data_shards/foods_part5_global_and_local.mjs
// 추가 테마:
// 1. 미국 Uber Eats 인기 메뉴 (BBQ Ribs, 치킨와플, 필리치즈스테이크, 버팔로윙, 부리또볼, 맥앤치즈 등)
// 2. 지역 특산물 빵/간식 (춘천 감자빵, 가평 잣샌드, 경주 황남빵, 천안 호두과자, 대전 튀김소보로 등)
// 3. 고속도로 휴게소 간식 (소떡소떡, 통감자구이, 호두과자, 만쥬, 십원빵)
// 4. 전국민 히트 냉동식품 (CJ 비비고 왕교자, 고메 크리스피 핫도그, 풀무원 얇은피만두, 냉동 에어프라이어 피자, 슈프림 양념만두)
// 5. 산 밑 맛집/등산로 노포 메뉴 (한방 능이백숙, 도토리묵무침, 파전과 막걸리, 보리밥정식, 산채비빔밥)
// 6. 길거리 노점상/포장마차 (붕어빵, 풀빵, 계란빵, 떡꼬치, 물떡, 순대꼬치, 염통꼬치)

export const FOODS_PART_5_GLOBAL_LOCAL = [
  // =========================================================================
  // 1. 미국 Uber Eats 대표 인기 배달 메뉴 (12종)
  // =========================================================================
  {
    name: '스모키 바베큐 베이비백립과 코울슬로 (Uber Eats 1위)',
    englishName: 'American Smoked BBQ Baby Back Ribs with Coleslaw & Fries',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🍖',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '980 kcal',
    priceRange: '$28.99 (약 39,000원)',
    tagline: '뼈에서 살이 스르륵 분리될 정도로 8시간 저온 훈연한 정통 아메리칸 포크 립',
    funComment: '미국 우버이츠에서 금요일 저녁 파티용으로 가장 많이 주문되는 압도적 단짠 육식 메뉴!',
    pairingTip: '바베큐 소스를 손가락 쪽쪽 빨아가며 버터 바른 옥수수 구이와 함께 드세요.',
    tags: ['바베큐립', '미국우버이츠', '베이비백립', '헤비디너']
  },
  {
    name: '단짠의 극치 크리스피 치킨 & 벨기에 와플 (메이플 시럽 듬뿍)',
    englishName: 'Southern Soul Food Fried Chicken & Waffles with Maple Syrup',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'CHICKEN',
    emoji: '🧇',
    candidateMeals: ['breakfast', 'lunch', 'snack'],
    primaryMeal: 'lunch',
    calories: '890 kcal',
    priceRange: '$18.50 (약 25,000원)',
    tagline: '바삭하고 짭조름한 남부식 케이준 후라이드 치킨 위에 갓 구운 와플과 메이플 시럽 폭포',
    funComment: '치킨에 시럽을 붓는다고? 한 번 맛보면 이 단짠단짠 소울푸드의 노예가 됩니다.',
    pairingTip: '따뜻한 메이플 버터를 치킨 껍질 위에 골고루 끼얹어 와플과 한 입에 베어 무세요.',
    tags: ['치킨와플', '소울푸드', '미국브런치', '단짠끝판왕']
  },
  {
    name: '철판에 볶은 얇은 소고기와 치즈 위즈 폭포 필라델피아 치즈스테이크',
    englishName: 'Authentic Philadelphia Cheesesteak with Cheez Whiz & Onions',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🥖',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'lunch',
    calories: '820 kcal',
    priceRange: '$15.99 (약 21,500원)',
    tagline: '길쭉한 아모로소 빵 사이에 양파와 함께 철판에 볶은 소고기 슬라이스와 녹아내린 치즈',
    funComment: '필라델피아 골목에서 냅킨 10장 챙겨 들고 팔꿈치를 45도로 꺾어 육즙을 흘리며 먹는 그 맛!',
    pairingTip: '매콤한 할라피뇨 절임과 닥터페퍼 탄산음료를 곁들이세요.',
    tags: ['필리치즈스테이크', '미국샌드위치', '우버이츠인기', '점심추천']
  },
  {
    name: '매콤새콤 버팔로 윙 10조각과 블루치즈 딥 & 샐러리 스틱',
    englishName: 'Classic Spicy Buffalo Chicken Wings with Blue Cheese Dip & Celery',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'CHICKEN',
    emoji: '🍗',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'night',
    calories: '740 kcal',
    priceRange: '$16.50 (약 22,000원)',
    tagline: '뉴욕 버팔로시 오리지널 스타일! 핫소스와 버터로 버무린 톡 쏘는 산미의 바삭한 윙',
    funComment: '슈퍼볼 경기 날 미국 전역에서 1억 개 이상 소비되는 미국인들의 국민 야식 윙입니다.',
    pairingTip: '쿰쿰하고 고소한 블루치즈 드레싱에 윙을 푹 찍고 아삭한 샐러리로 입가심하세요.',
    tags: ['버팔로윙', '블루치즈딥', '미국야식', '맥주안주']
  },
  {
    name: '치폴레(Chipotle) 스타일 과카몰리 비프 스테이크 부리또 볼',
    englishName: 'Chipotle Style Steak Burrito Bowl with Fresh Guacamole & Salsa',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'ASIAN_WORLD',
    emoji: '🥗',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '690 kcal',
    priceRange: '$14.20 (약 19,000원)',
    tagline: '고수 라임 라이스 위에 그릴드 비프, 블랙빈, 파히타 채소, 토마토 살사, 과카몰리 한 스쿱',
    funComment: '미국 직장인과 대학생들의 점심 우버이츠 배달 1순위! 뚜껑을 닫고 쉐킷쉐킷 흔들어 드세요.',
    pairingTip: '사워크림을 듬뿍 추가하고 바삭한 또띠아 나초 칩에 떠먹으면 환상적입니다.',
    tags: ['치폴레볼', '부리또볼', '과카몰리', '미국배달1위']
  },
  {
    name: '체다치즈를 아낌없이 쏟아부어 오븐에 구운 꾸덕 맥앤치즈 (Mac & Cheese)',
    englishName: 'Baked Four-Cheese Creamy Macaroni and Cheese Casserole',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🧀',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'night',
    calories: '680 kcal',
    priceRange: '$12.00 (약 16,000원)',
    tagline: '포크로 뜰 때마다 노란 치즈가 폭포처럼 늘어나는 미국인들의 영원한 컴포트 푸드',
    funComment: '추운 날 밤이나 스트레스 가득한 날, 노란 치즈 탄수화물로 영혼을 녹여주는 따뜻한 위로.',
    pairingTip: '바삭하게 튀긴 베이컨 칩과 매콤한 핫소스를 살짝 둘러 드세요.',
    tags: ['맥앤치즈', '미국컴포트푸드', '꾸덕치즈', '야식추천']
  },

  // =========================================================================
  // 2. 전국 지역 특산물 빵 & 간식 (10종)
  // =========================================================================
  {
    name: '흙에서 갓 캔 듯한 비주얼의 춘천 원조 감자빵과 옥수수빵',
    englishName: 'Chuncheon Signature Potato Bread with Mashed Potato Filling',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🥔',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '295 kcal',
    priceRange: '3,800원',
    tagline: '진짜 강원도 흙감자처럼 콩가루와 흑임자가 묻은 쫀득한 타피오카 피 속에 달콤한 감자 앙금',
    funComment: '줄 서서 박스째 사 오던 춘천 명물! 전자레인지에 30초 돌리면 갓 찐 감자 향이 솔솔 납니다.',
    pairingTip: '서리태 콩물이나 고소한 감자라떼와 함께 오후 간식으로 즐기세요.',
    tags: ['춘천감자빵', '지역특산물', 'K디저트', '간식추천']
  },
  {
    name: '가평 휴게소 필수 오픈런 가평 맛남샌드 (잣 & 솔티드 카라멜)',
    englishName: 'Gapyeong Rest Stop Pine Nut Salted Caramel Butter Sand Cookies',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🍪',
    candidateMeals: ['breakfast', 'snack'],
    primaryMeal: 'snack',
    calories: '185 kcal (1개)',
    priceRange: '16,000원 (10개입 1박스)',
    tagline: '고소한 가평 특산물 잣이 콕콕 박힌 바삭한 버터 쿠키 속에 솔티드 카라멜과 버터크림',
    funComment: '고속도로 지나갈 때 키오스크 줄 안 서면 못 사던 희귀템! 선물용으로도 최고 인기.',
    pairingTip: '핸드드립 블랙커피 한 잔과 함께 버터 풍미를 우아하게 음미하세요.',
    tags: ['가평잣샌드', '맛남샌드', '가평휴게소', '고급샌드쿠키']
  },
  {
    name: '얇은 피 속에 달콤한 팥앙금이 90% 차 있는 경주 황남빵 3개',
    englishName: 'Gyeongju Historic Hwangnam-ppang Sweet Red Bean Pastries',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🥮',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '310 kcal (3개)',
    priceRange: '3,600원',
    tagline: '1939년부터 이어져 온 경주 전통 명물! 피는 거들 뿐, 100% 국산 팥앙금이 가득 찬 맛',
    funComment: '경주 수학여행 가서 부모님 사다 드린다고 사놓고 올라오는 버스 안에서 다 먹어버리던 빵.',
    pairingTip: '찬 우유 한 모금에 황남빵 반쪽 베어 물면 팥과 우유가 입안에서 융합합니다.',
    tags: ['경주황남빵', '원조팥빵', '경주특산물', '어르신간식']
  },
  {
    name: '대전 성심당의 전설 갓 튀겨 바삭달콤한 튀김소보로 & 부추빵',
    englishName: 'Daejeon Sungsimdang Deep-Fried Soboro & Chive Bread Combo',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🥖',
    candidateMeals: ['breakfast', 'lunch', 'snack'],
    primaryMeal: 'snack',
    calories: '420 kcal',
    priceRange: '3,800원',
    tagline: '도넛처럼 튀겨내어 바삭함이 폭발하는 소보로 껍질 속에 부드러운 통팥 앙금!',
    funComment: '대전역에 기차 타고 가면 승객 80%가 들고 탄다는 노란색 성심당 종이가방의 주인공.',
    pairingTip: '에어프라이어에 180도로 3분 데우면 튀김옷의 바삭함이 되살아납니다.',
    tags: ['튀김소보로', '성심당', '대전명물', '빵지순례']
  },
  {
    name: '천안 삼거리 원조 호두과자 (통호두 알갱이가 콕 박힌 흰앙금)',
    englishName: 'Cheonan Traditional Walnut Pastries with Whole Walnut & White Bean Paste',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🌰',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '320 kcal (6개)',
    priceRange: '5,000원',
    tagline: '바삭하고 폭신한 반죽 속에 통호두 반쪽과 보들보들한 흰 팥앙금이 들어간 휴게소의 영원한 1위',
    funComment: '종이봉투를 뜯어 김이 모락모락 날 때 입천장 데어가며 후후 불어 먹는 고속도로 낭만.',
    pairingTip: '캔커피 레쓰비 또는 보리차와 함께 차 안에서 즐기는 추억의 맛.',
    tags: ['천안호두과자', '통호두', '휴게소간식', '원조호두과자']
  },

  // =========================================================================
  // 3. 고속도로 휴게소 인기 간식 (6종)
  // =========================================================================
  {
    name: '영자 언니 추천 케첩+머스타드 양면 코팅 원조 소떡소떡 꼬치',
    englishName: 'Highway Rest Stop Grilled Sausage & Rice Cake Skewer (Sotteok Sotteok)',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🍢',
    candidateMeals: ['lunch', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '390 kcal',
    priceRange: '4,000원',
    tagline: '소시지와 가래떡을 절대 따로 먹지 말고 갈비처럼 가로로 물어 한 입에 씹어 먹는 정석!',
    funComment: '기름에 튀기듯 구운 쫄깃한 떡과 톡 터지는 소시지가 한 입에서 어우러지는 기적의 밸런스.',
    pairingTip: '케첩과 머스타드를 격자무늬로 듬뿍 뿌려 따뜻할 때 드세요.',
    tags: ['소떡소떡', '휴게소간식', '이영자추천', '길거리꼬치']
  },
  {
    name: '버터에 굴려 껍질은 짭짤하고 속은 포슬한 휴게소 알감자 버터구이',
    englishName: 'Highway Rest Stop Butter-Roasted Baby Potatoes with Sugar & Salt',
    originGroup: 'RAW_NATURAL',
    deliveryCategory: 'BUNSIK',
    emoji: '🥔',
    candidateMeals: ['breakfast', 'snack'],
    primaryMeal: 'snack',
    calories: '340 kcal',
    priceRange: '4,500원',
    tagline: '철판에서 버터에 달달 볶아 황금빛으로 익힌 꼬마 알감자에 설탕과 맛소금을 반반 솔솔~',
    funComment: '이쑤시개로 콕 찍어 입에 넣으면 버터 향과 소금의 짭짤함이 터지며 장거리 운전 피로 해소!',
    pairingTip: '설탕을 살짝 더 뿌려 단짠의 조화를 극대화하세요.',
    tags: ['휴게소알감자', '버터구이감자', '단짠간식', '여행간식']
  },
  {
    name: '치즈가 1미터 늘어나는 경주 첨성대 십원빵',
    englishName: 'Gyeongju 10-Won Coin Bread Stuffed with Stretchy Mozzarella Cheese',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🪙',
    candidateMeals: ['snack', 'night'],
    primaryMeal: 'snack',
    calories: '380 kcal',
    priceRange: '4,000원',
    tagline: '다보탑 문양이 선명하게 새겨진 십원짜리 동전 모양 핫케이크 속에 통모짜렐라 치즈가 가득!',
    funComment: '길거리에서 한 입 물고 뒤로 걸어가며 치즈 늘리기 인증샷 찍는 게 국룰인 이색 간식.',
    pairingTip: '치즈가 굳기 전 뜨거울 때 바로 치즈 폭포를 만끽하세요.',
    tags: ['십원빵', '경주십원빵', '치즈빵', '길거리이색간식']
  },

  // =========================================================================
  // 4. 전국민 히트 냉동식품 & 편의점 에어프라이어 명작 (8종)
  // =========================================================================
  {
    name: '에어프라이어에 180도 10분 돌린 바삭 비비고 왕교자 만두 6개',
    englishName: 'Air-Fried Crispy Bibigo Royal Mandu Dumplings 6pcs',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'FAST_CONVENIENCE',
    emoji: '🥟',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'night',
    calories: '510 kcal',
    priceRange: '4,500원 (냉동실 필수템)',
    tagline: '한국 냉동만두의 역사를 바꾼 굵게 썬 돼지고기와 부추, 한 입 물면 터져 나오는 육즙!',
    funComment: '새벽 1시 출출할 때 냉동실 문 열고 에어프라이어에 던져 넣으면 10분 만에 완성되는 야식의 구원자.',
    pairingTip: '간장, 식초, 고춧가루를 2:1:1로 섞은 초간장에 콕 찍어 드세요.',
    tags: ['비비고만두', '에어프라이어만두', '냉동만두', '야식추천']
  },
  {
    name: '겉은 크리스피하고 속은 모짜렐라+소시지 반반 핫도그',
    englishName: 'Crispy Frozen Mozzarella & Sausage Half-and-Half Corn Dog',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'FAST_CONVENIENCE',
    emoji: '🌭',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '330 kcal',
    priceRange: '2,000원',
    tagline: '전자레인지에 돌려도 겉의 현미 크런치가 바삭하고 앞쪽은 치즈, 뒤쪽은 소시지가 든 핫도그',
    funComment: '냉동실에 5개들이 한 봉지 쟁여두면 늦은 밤 야식 걱정이 사라지는 자취생 필수템.',
    pairingTip: '설탕을 살살 묻힌 뒤 케첩과 스위트 머스타드를 지그재그로 뿌려 드세요.',
    tags: ['냉동핫도그', '반반핫도그', '치즈핫도그', '간편야식']
  },
  {
    name: '만두피가 거의 안 보이는 속 꽉 찬 얇은피 김치만두',
    englishName: 'Ultra-Thin Skin Spicy Kimchi Dumplings Steamed to Perfection',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'FAST_CONVENIENCE',
    emoji: '🥟',
    candidateMeals: ['breakfast', 'lunch', 'night'],
    primaryMeal: 'night',
    calories: '440 kcal',
    priceRange: '4,800원',
    tagline: '피 두께 0.7mm! 속의 아삭한 깍두기와 김치가 훤히 비치는 매콤칼칼한 찜만두',
    funComment: '밀가루 피 맛 대신 꽉 찬 매콤한 김치소의 식감이 혀끝을 자극하는 칼칼한 야식.',
    pairingTip: '단무지 한 장을 만두 위에 얹어 함께 드시면 맵단 밸런스가 잡힙니다.',
    tags: ['얇은피만두', '김치만두', '냉동히트상품', '야식만두']
  },

  // =========================================================================
  // 5. 산 밑 맛집 & 등산로 노포 메뉴 (6종)
  // =========================================================================
  {
    name: '등산 후 계곡 평상에서 먹는 한방 능이버섯 토종닭 백숙과 찰밥죽',
    englishName: 'Mountain Trail Korean Native Chicken & Neungi Mushroom Herbal Soup with Sticky Rice',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'SOUP_STEW',
    emoji: '🍲',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '890 kcal',
    priceRange: '65,000원 (계곡 평상 감성)',
    tagline: '지리산 검은 능이버섯을 우려내어 국물이 흑갈색으로 짙고 쫄깃한 토종닭 다리살이 뜯기는 백숙',
    funComment: '산 정상 찍고 내려와 계곡물에 발 담그고 먹을 때 "아 이게 인생이지" 탄성이 절로 나오는 보양식!',
    pairingTip: '다 먹은 뒤 쫀득한 찹쌀 녹두밥을 국물에 넣고 걸쭉한 닭죽으로 끓여 드세요.',
    tags: ['능이백숙', '산밑맛집', '계곡평상', '등산보양식']
  },
  {
    name: '들기름과 깻잎에 팍팍 무쳐낸 산 밑 원조 도토리묵무침',
    englishName: 'Mountain Trail Acorn Jelly Salad (Dotori-muk) with Wild Perilla Dressing',
    originGroup: 'RAW_NATURAL',
    deliveryCategory: 'KOREAN_MEAL',
    emoji: '🥗',
    candidateMeals: ['lunch', 'dinner', 'snack'],
    primaryMeal: 'lunch',
    calories: '310 kcal',
    priceRange: '13,000원',
    tagline: '탱글탱글 쌉싸름한 도토리묵에 오이, 쑥갓, 상추를 고춧가루와 방앗간 들기름에 버무린 맛',
    funComment: '칼로리는 가볍고 입안은 향긋하고 고소해서 등산객들의 막걸리 안주 부동의 1위!',
    pairingTip: '차가운 살얼음 동동주나 지평 생막걸리 한 잔과 함께 드시면 완벽합니다.',
    tags: ['도토리묵무침', '산밑노포', '등산안주', '자연건강식']
  },
  {
    name: '오징어와 쪽파가 통째로 들어간 바삭 두툼 해물파전',
    englishName: 'Mountain Foot Crispy Giant Seafood Scallion Pancake (Haemul Pajeon)',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'KOREAN_MEAL',
    emoji: '🥞',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '780 kcal',
    priceRange: '17,000원',
    tagline: '기름에 튀기듯 부쳐내어 테두리가 과자처럼 파삭하고 속은 통통한 오징어와 조갯살이 듬뿍!',
    funComment: '비 오는 날이나 땀 흘린 등산 직후, 지글지글 부침개 부치는 소리만 들어도 침샘이 고입니다.',
    pairingTip: '양파와 청양고추가 담긴 초간장에 파전을 푹 찍어 양파 한 조각을 올려 드세요.',
    tags: ['해물파전', '산밑파전', '막걸리짝꿍', '비오는날메뉴']
  },

  // =========================================================================
  // 6. 길거리 노점상 & 지하철역 명물 (6종)
  // =========================================================================
  {
    name: '달걀 1개가 통째로 들어가 짭짤달콤한 겨울철 길거리 계란빵 2개',
    englishName: 'Street Vendor Sweet & Savory Whole Egg Bread (Gyeran-ppang) 2pcs',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🍳',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'breakfast',
    calories: '360 kcal (2개)',
    priceRange: '3,000원',
    tagline: '폭신한 카스테라 반죽 속에 통달걀이 반숙으로 익어 파슬리와 소금이 살짝 뿌려진 노점 명작',
    funComment: '찬 바람 부는 지하철 출구 앞 포장마차에서 종이컵에 담아 호호 불며 먹는 겨울 아침의 낭만.',
    pairingTip: '따뜻한 베지밀 두유나 율무차와 함께 든든하게 드세요.',
    tags: ['계란빵', '길거리노점상', '겨울길거리음식', '아침간편식']
  },
  {
    name: '달콤매콤 고추장 소스 발라 튀겨낸 쫄깃 떡꼬치 3개',
    englishName: 'Street Food Deep-Fried Rice Cake Skewers with Sweet Chili Glaze 3pcs',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🍢',
    candidateMeals: ['snack', 'lunch', 'night'],
    primaryMeal: 'snack',
    calories: '420 kcal (3개)',
    priceRange: '3,000원',
    tagline: '가래떡 5알을 꼬치에 꿰어 기름에 튀겨 겉은 바삭 속은 쫀득! 케첩+고추장 떡꼬치 소스',
    funComment: '초등학교 앞 분식집에서 500원 들고 사 먹던 그 소스 맛 그대로! 어른이 되어도 포기할 수 없는 맛.',
    pairingTip: '입가에 양념을 묻혀가며 시원한 피크닉 사과맛 음료와 함께 드세요.',
    tags: ['떡꼬치', '학교앞분식', '추억간식', '길거리노점']
  },
  {
    name: '부산 남포동 포장마차 어묵 국물에 불려 먹는 가래떡 물떡 3꼬치',
    englishName: 'Busan Street Cart Broth-Soaked Chewy Rice Cake Skewers (Mool-tteok)',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🍢',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '310 kcal',
    priceRange: '3,000원',
    tagline: '진한 멸치 게 육수 통 속에서 오랫동안 익어 야들야들하고 말랑말랑해진 통가래떡 꼬치',
    funComment: '양념간장에 살짝 찍어 한 입 베어 물면 가래떡 속까지 짭조름한 어묵 육수가 배어 있습니다.',
    pairingTip: '빨간 바가지로 떠주는 뜨끈한 어묵 국물을 종이컵에 받아 호로록 마시세요.',
    tags: ['부산물떡', '물떡꼬치', '남포동포차', '길거리명물']
  }
];
