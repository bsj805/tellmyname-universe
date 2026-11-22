// scripts/data_shards/foods_part4_delivery.mjs
// 배달앱(배민/요기요/쿠팡이츠) 15대 카테고리 기반 실전 인기 배달·외식 메뉴 확장 (85종 추가)

export const FOODS_PART_4_DELIVERY = [
  // =========================================================================
  // 1. 족발·보쌈 (PORK_FEET_BOSSAM)
  // =========================================================================
  {
    name: '달콤알싸한 마늘소스 듬뿍 올린 마늘보쌈과 무김치',
    englishName: 'Garlic Bossam Boiled Pork with Sweet Garlic Sauce',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'PORK_FEET_BOSSAM',
    emoji: '🥩',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '860 kcal',
    priceRange: '36,000원',
    tagline: '야들야들하게 삶은 삼겹 수육 위에 특제 꿀마늘 소스를 산처럼 덮은 배달 1티어 보쌈',
    funComment: '마늘의 알싸함은 날아가고 달콤함만 남아 보쌈고기와 무김치의 감칠맛을 폭발시키는 맛!',
    pairingTip: '절인 배추잎 위에 마늘보쌈과 꼬들꼬들한 보쌈 무말랭이를 얹어 크게 싸 드세요.',
    tags: ['마늘보쌈', '배달의민족', '족발보쌈', '저녁추천']
  },
  {
    name: '코끝이 찡한 부산 부평동식 해파리 냉채족발',
    englishName: 'Busan Style Chilled Jellyfish Mustard Jokbal Salad',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'PORK_FEET_BOSSAM',
    emoji: '🥗',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'night',
    calories: '620 kcal',
    priceRange: '37,000원',
    tagline: '톡 쏘는 겨자소스에 쫄깃한 해파리와 아삭한 오이, 얇게 썬 족발을 버무린 여름밤 야식',
    funComment: '한 젓가락 입에 넣자마자 눈물이 찔끔 나며 막힌 코가 뻥 뚫리는 부산 자갈치 시장의 마력!',
    pairingTip: '소면 사리를 겨자 양념에 비벼 족발과 함께 건져 드세요.',
    tags: ['냉채족발', '부산원조', '야식추천', '겨자소스']
  },
  {
    name: '겉은 바삭 속은 쫀득한 독일 슈바인학센식 튀김족발',
    englishName: 'Crispy Deep-Fried Jokbal Pork Knuckle with Dipping Sauces',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'PORK_FEET_BOSSAM',
    emoji: '🍖',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'night',
    calories: '980 kcal',
    priceRange: '39,000원',
    tagline: '통째로 바삭하게 튀겨내어 껍질은 과자처럼 파삭하고 속은 콜라겐으로 찰진 이색 족발',
    funComment: '족발이야 통닭이야? 한 번 맛보면 일반 족발로 돌아가기 힘들다는 치명적인 바삭함.',
    pairingTip: '어니언 크림소스와 매콤한 스리라차 마요 소스를 번갈아 찍어 드세요.',
    tags: ['튀김족발', '슈바인학센', '이색족발', '맥주안주']
  },

  // =========================================================================
  // 2. 찜·탕·전골 (SOUP_STEW)
  // =========================================================================
  {
    name: '매콤달콤 양념이 쏙 밴 뚝배기 묵은지 닭볶음탕(닭도리탕)',
    englishName: 'Spicy Braised Chicken with Aged Mugeonji Kimchi',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'SOUP_STEW',
    emoji: '🍲',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '820 kcal',
    priceRange: '32,000원',
    tagline: '포슬포슬한 감자와 부드러운 닭다리살, 길게 찢은 묵은지를 밥 위에 얹어 먹는 배달 인기 찜',
    funComment: '자작하게 졸아든 국물에 김가루와 밥을 볶아 먹는 것은 닭볶음탕을 대하는 한국인의 의무입니다.',
    pairingTip: '국물에 삶은 계란 노른자를 으깨어 비벼 먹으면 꿀맛입니다.',
    tags: ['닭볶음탕', '묵은지닭도리탕', '배달인기', '저녁메뉴']
  },
  {
    name: '얼큰하고 칼칼한 동해 생태 알곤이 동태탕 뚝배기',
    englishName: 'Spicy Pollack Stew with Soft Roe and Tofu',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'SOUP_STEW',
    emoji: '🐟',
    candidateMeals: ['breakfast', 'lunch', 'dinner'],
    primaryMeal: 'breakfast',
    calories: '490 kcal',
    priceRange: '12,000원',
    tagline: '무와 쑥갓, 콩나물이 듬뿍 들어가 국물 한 모금에 어제 마신 술이 확 깨는 아침 해장국',
    funComment: '부드러운 이리와 톡톡 씹히는 알을 와사비 간장에 콕 찍어 먹는 재미가 쏠쏠합니다.',
    pairingTip: '국물에 다진 마늘과 청양고추를 살짝 더해 칼칼하게 땀 흘리며 드세요.',
    tags: ['동태탕', '알곤이탕', '아침해장', '시원한국물']
  },
  {
    name: '매콤 콩나물 산더미 마산 아구찜과 볶음밥',
    englishName: 'Spicy Braised Monkfish with Bean Sprouts (Agujjim)',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'SOUP_STEW',
    emoji: '🌶️',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'dinner',
    calories: '710 kcal',
    priceRange: '38,000원',
    tagline: '통통하고 쫄깃한 아구살과 미더덕, 아삭한 굵은 콩나물을 전분 매운 소스에 볶아낸 명작',
    funComment: '입안 가득 차는 아구의 뽀얀 살코기와 오독오독 씹히는 미더덕의 바다 향!',
    pairingTip: '남은 양념에 미나리와 날치알을 넣고 철판 볶음밥을 만들어 바닥까지 긁어 드세요.',
    tags: ['아구찜', '마산아구찜', '매콤한저녁', '배달찜']
  },
  {
    name: '스팸·소시지·라면사리 듬뿍 들어간 의정부 원조 부대찌개',
    englishName: 'Uijeongbu Army Base Stew with Spam, Sausage & Ramen',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'SOUP_STEW',
    emoji: '🥘',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '890 kcal',
    priceRange: '11,000원',
    tagline: '민찌 고기와 베이크드 빈스, 체다치즈 한 장이 녹아든 걸쭉하고 얼큰한 부대찌개',
    funComment: '대접밥 위에 햄과 국물을 세 국자 붓고 꼬들꼬들하게 익은 라면 사리를 건져 후루룩!',
    pairingTip: '어묵볶음과 마카로니 샐러드를 밑반찬으로 곁들이면 기사식당 부대찌개 완성.',
    tags: ['부대찌개', '의정부부대찌개', '라면사리', '점심추천']
  },

  // =========================================================================
  // 3. 치킨 (CHICKEN)
  // =========================================================================
  {
    name: '마법의 치즈 시즈닝 가루 솔솔 뿌린 단짠 뿌링클 치킨과 요거트 딥핑',
    englishName: 'Magic Cheese Seasoned Crispy Chicken with Yogurt Dip',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHICKEN',
    emoji: '🍗',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'night',
    calories: '1150 kcal',
    priceRange: '21,000원',
    tagline: '치즈·양파·마늘 가루가 두껍게 덮인 바삭한 치킨을 새콤달콤한 하얀 요거트 소스에 푹 찍어 먹는 마성',
    funComment: '치킨 상자를 열자마자 진동하는 달콤한 치즈 향기! 손가락에 묻은 가루까지 빨아먹게 되는 맛.',
    pairingTip: '속에 달콤한 모짜렐라 치즈가 든 바삭 치즈볼 5개를 꼭 함께 주문하세요.',
    tags: ['뿌링클', '치즈치킨', '야식1티어', '배민치킨']
  },
  {
    name: '오븐에 구워 기름기 쏙 뺀 매콤 바삭 고추바사삭 치킨과 마블링 소스',
    englishName: 'Oven-Baked Crispy Pepper Chicken with Chili Mayo Dip',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHICKEN',
    emoji: '🌶️',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'night',
    calories: '890 kcal',
    priceRange: '20,000원',
    tagline: '청양고추 알갱이가 튀김옷에 콕콕 박혀 알싸하게 매콤하고 오븐구이 특유의 담백한 육즙',
    funComment: '튀기지 않아 죄책감은 덜하고 매콤한 마블링·고블링 소스 찍먹으로 끝없이 들어가는 야식.',
    pairingTip: '시원한 제로콜라나 라임 탄산수와 함께 깔끔하게 즐기세요.',
    tags: ['고추바사삭', '오븐치킨', '다이어트야식', '배달치킨']
  },
  {
    name: '단짠의 원조 교촌 스타일 짭조름한 간장 윙봉 콤보',
    englishName: 'Crispy Soy Garlic Chicken Wings & Drumettes Combo',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHICKEN',
    emoji: '🍗',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'night',
    calories: '930 kcal',
    priceRange: '23,000원',
    tagline: '붓으로 정성스럽게 바른 마늘간장 소스가 얇고 바삭한 튀김옷에 바짝 졸여진 닭날개와 봉',
    funComment: '한 손에 윙 하나 쥐고 뼈 발골 쇼를 펼치다 보면 맥주 한 캔이 3분 만에 사라집니다.',
    pairingTip: '웨지감자와 스위트칠리소스 세트를 곁들여 단짠 조합을 극대화하세요.',
    tags: ['간장치킨', '교촌윙봉', '맥주안주', '야식추천']
  },
  {
    name: '숯불 향 진하게 밴 양념 숯불바베큐 치킨과 우동사리 추가',
    englishName: 'Charcoal Grilled BBQ Chicken with Chewy Udon Noodles',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHICKEN',
    emoji: '🔥',
    candidateMeals: ['dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '990 kcal',
    priceRange: '22,000원',
    tagline: '직화 숯불에 구워 기름을 뺀 순살 치킨과 떡사리, 매콤달콤한 소스에 볶아낸 탱탱한 우동사리',
    funComment: '치킨을 어느 정도 집어먹은 뒤 자작한 숯불 양념에 우동면을 비벼 먹는 탄수화물 축제!',
    pairingTip: '치킨무 국물로 입가심하고 마지막에 햇반 하나 비벼 치밥으로 마침표를 찍으세요.',
    tags: ['숯불치킨', '지코바스타일', '우동사리', '치밥']
  },

  // =========================================================================
  // 4. 피자·버거·양식 (PIZZA_BURGER)
  // =========================================================================
  {
    name: '달콤한 꿀에 찍어 먹는 얇고 쫀득한 화덕 고르곤졸라 피자',
    englishName: 'Wood-Fired Gorgonzola Pizza with Pure Honey Dip',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🍕',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'lunch',
    calories: '680 kcal',
    priceRange: '18,000원',
    tagline: '참나무 화덕에서 부풀어 오른 쫄깃한 도우 위에 짭짤한 블루치즈와 달콤한 천연 벌꿀의 마리아주',
    funComment: '한 조각 돌돌 말아 꿀에 푹 적셔 먹으면 쿰쿰한 치즈 향이 향긋한 디저트처럼 변하는 기적.',
    pairingTip: '루꼴라 샐러드와 시원한 맥주 또는 스파클링 화이트 와인을 곁들이세요.',
    tags: ['고르곤졸라', '화덕피자', '꿀피자', '점심추천']
  },
  {
    name: '네모난 바삭 크러스트 페퍼로니 디트로이트 딥디쉬 피자',
    englishName: 'Square Crispy Detroit Style Pepperoni Deep Dish Pizza',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🍕',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '1180 kcal',
    priceRange: '26,000원',
    tagline: '사각 팬 모서리에서 치즈가 바삭하게 튀겨져 카라멜라이징된 도우 위에 페퍼로니 꽃이 활짝!',
    funComment: '겉은 바삭바삭 크런치하고 속은 폭신한 포카치아 빵 같은 미국식 찐 헤비 피자입니다.',
    pairingTip: '갈릭디핑 소스와 핫소스를 듬뿍 뿌려 미국 현지 감성으로 즐기세요.',
    tags: ['디트로이트피자', '페퍼로니피자', '미국식피자', '헤비야식']
  },
  {
    name: '육즙 좔좔 100% 소고기 패티의 브리오슈 번 수제 치즈버거',
    englishName: 'Gourmet Smashed Hanwoo Beef Cheeseburger on Brioche',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🍔',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'lunch',
    calories: '750 kcal',
    priceRange: '11,500원',
    tagline: '버터 바른 브리오슈 번 사이에 철판에 바짝 눌러 구운 스매시 소고기 패티 2장과 아메리칸 치즈',
    funComment: '한 입 베어 물면 손가락 사이로 따뜻한 육즙이 주르륵 흐르는 정통 미국식 크래프트 버거!',
    pairingTip: '트러플 오일을 뿌린 감자튀김과 시원한 바닐라 셰이크를 함께 곁들이세요.',
    tags: ['수제버거', '스매시버거', '치즈버거', '점심버거']
  },
  {
    name: '12시간 훈연해 결대로 찢은 텍사스 풀드포크 바베큐 버거',
    englishName: 'Texas 12-Hour Smoked Pulled Pork BBQ Sandwich',
    originGroup: 'UNIQUE_SPECIAL',
    deliveryCategory: 'PIZZA_BURGER',
    emoji: '🥪',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '720 kcal',
    priceRange: '13,000원',
    tagline: '히코리 나무 훈연으로 부드러워진 돼지 어깨살 바베큐와 아삭한 코울슬로를 넘치게 채운 버거',
    funComment: '달콤스모키한 바베큐 소스와 상큼한 코울슬로가 만나 느끼함 없이 입안에서 사르르 녹아내립니다.',
    pairingTip: '체다 치즈 소스를 듬뿍 얹은 치즈 프라이와 어니언 링을 곁들이세요.',
    tags: ['풀드포크', '텍사스바베큐', '수제버거', '이색양식']
  },

  // =========================================================================
  // 5. 중식 (CHINESE)
  // =========================================================================
  {
    name: '불맛 확 살아있는 양파 듬뿍 삼선 간짜장과 반숙 계란후라이',
    englishName: 'Wok-Fried Samseon Seafood Gan-Jjajang with Fried Egg',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHINESE',
    emoji: '🥢',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '860 kcal',
    priceRange: '9,500원',
    tagline: '물 한 방울 안 붓고 센 불에 춘장과 양파, 해산물을 볶아낸 꾸덕한 소스에 노란 면발과 계란후라이',
    funComment: '면 위에 뜨거운 간짜장 소스를 붓고 젓가락 두 짝으로 양손 비비기를 할 때 침샘이 폭발합니다.',
    pairingTip: '고춧가루를 한 숟가락 팍팍 뿌리고 단무지에 식초를 둘러 함께 드세요.',
    tags: ['간짜장', '중식배달', '부산식계란후라이', '점심추천']
  },
  {
    name: '해물과 고기가 가득 들어간 얼큰 불맛 차돌 짬뽕',
    englishName: 'Fiery Wok-Smoked Beef Brisket & Seafood Jjamppong',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHINESE',
    emoji: '🍜',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'lunch',
    calories: '820 kcal',
    priceRange: '11,000원',
    tagline: '진한 사골 육수에 불향을 입힌 차돌박이와 오징어, 홍합이 어우러진 땀 뻘뻘 얼큰한 짬뽕 국물',
    funComment: '한 숟가락 뜨는 순간 속이 뻥 뚫리며 밥 한 공기까지 말아먹고 싶어지는 K-직장인의 해장 1위.',
    pairingTip: '바삭하고 쫄깃한 찹쌀 탕수육을 국물에 살짝 찍어 드셔보세요.',
    tags: ['차돌짬뽕', '불맛짬뽕', '해장짬뽕', '중식추천']
  },
  {
    name: '새우살을 식빵 사이에 다져 넣어 튀긴 바삭한 멘보샤 6개',
    englishName: 'Crispy Deep-Fried Shrimp Toast (Mianbaoxia) 6pcs',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHINESE',
    emoji: '🍤',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'snack',
    calories: '560 kcal',
    priceRange: '18,000원',
    tagline: '겉 식빵은 빠삭빠삭하고 속은 촉촉한 통새우 살이 팡 터지는 중식 파인다이닝의 인기 메뉴',
    funComment: '한 입 베어 물면 "바삭!" 소리와 함께 탱글탱글한 새우 육즙이 입안을 가득 채웁니다.',
    pairingTip: '달콤매콤한 스위트 칠리소스에 푹 찍어 따뜻할 때 드세요.',
    tags: ['멘보샤', '새우토스트', '중식간식', '맥주안주']
  },
  {
    name: '얼얼한 산초와 고추기름으로 볶아낸 사천 마파두부 덮밥',
    englishName: 'Sichuan Spicy Mala Mapo Tofu over Steamed Rice',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CHINESE',
    emoji: '🍛',
    candidateMeals: ['breakfast', 'lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '620 kcal',
    priceRange: '9,000원',
    tagline: '부드러운 연두부와 다진 돼지고기, 사천 화자오(산초)가 어우러져 입안이 얼얼하고 향긋한 덮밥',
    funComment: '숟가락으로 두부를 으깨가며 밥과 쓱쓱 비비면 혀끝이 찌릿찌릿하면서도 멈출 수 없는 중독성!',
    pairingTip: '맑은 계란탕 국물과 시원한 짜사이를 곁들여 매운맛을 달래세요.',
    tags: ['마파두부', '사천요리', '점심덮밥', '얼얼한맛']
  },

  // =========================================================================
  // 6. 돈까스·일식·회 (JAPANESE_DON)
  // =========================================================================
  {
    name: '갓 튀긴 왕새우·장어·단호박이 탑처럼 쌓인 에도식 스페셜 텐동',
    englishName: 'Edo Style Special Tempura Rice Bowl (Tendon) with King Prawn',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'JAPANESE_DON',
    emoji: '🍤',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '890 kcal',
    priceRange: '16,000원',
    tagline: '참기름 향 풍기는 바삭한 튀김들에 달콤짭조름한 타레 소스를 둘러 밥 위에 얹은 튀김 덮밥',
    funComment: '튀김을 뚜껑 접시에 덜어놓고 온천계란(온센타마고)을 밥에 톡 터뜨려 비벼 먹는 재미!',
    pairingTip: '와사비를 튀김 위에 살짝 얹고 따뜻한 미소 장국을 곁들이세요.',
    tags: ['텐동', '튀김덮밥', '일식추천', '바삭한점심']
  },
  {
    name: '신선한 참치·연어·광어·연어알이 가득한 바다 한 그릇 카이센동',
    englishName: 'Premium Fresh Seafood Sashimi Bowl (Kaisendon) with Salmon Roe',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'JAPANESE_DON',
    emoji: '🍣',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '580 kcal',
    priceRange: '22,000원',
    tagline: '초밥 밥 위에 제철 숙성 사시미와 톡톡 터지는 이쿠라(연어알)를 꽃처럼 플레이팅한 덮밥',
    funComment: '김 한 장 위에 와사비 묻힌 참치와 연어알을 얹어 미니 셀프 마끼로 만들어 먹는 호사.',
    pairingTip: '사시미 간장에 와사비를 풀지 말고 회 위에 직접 올려 간장을 살짝 찍으세요.',
    tags: ['카이센동', '해산물덮밥', '사시미', '럭셔리점심']
  },
  {
    name: '두툼한 삼겹 차슈가 4장 올라간 미소라멘과 미니 교자',
    englishName: 'Sapporo Style Rich Miso Ramen with Chashu & Crispy Gyoza',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'JAPANESE_DON',
    emoji: '🍜',
    candidateMeals: ['lunch', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '760 kcal',
    priceRange: '12,000원',
    tagline: '홋카이도 삿포로식 구수한 된장 육수에 버터 한 조각과 옥수수 콘, 불맛 차슈가 어우러진 라멘',
    funComment: '버터가 녹아든 진한 국물 한 모금 마시면 뼛속까지 따스함이 차오릅니다.',
    pairingTip: '바닥은 바삭하고 위는 촉촉한 한입 교자만두를 라멘 국물에 살짝 담가 드세요.',
    tags: ['미소라멘', '삿포로라멘', '차슈라멘', '저녁라멘']
  },

  // =========================================================================
  // 7. 아시안·월드푸드 (ASIAN_WORLD)
  // =========================================================================
  {
    name: '숯불 돼지고기와 새콤달콤 느억맘 소스에 적셔 먹는 하노이식 분짜',
    englishName: 'Hanoi Style Grilled Pork & Rice Noodles with Nuoc Cham Dip (Bun Cha)',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'ASIAN_WORLD',
    emoji: '🥗',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '580 kcal',
    priceRange: '14,000원',
    tagline: '숯불 향이 가득 밴 따뜻한 완자와 삼겹살을 차가운 쌀국수 면, 신선한 야채와 함께 소스에 풍덩!',
    funComment: '오바마 대통령이 베트남에서 맥주와 함께 먹고 반했다는 바로 그 전설의 분짜입니다.',
    pairingTip: '바삭한 스프링롤(짜조) 2조각을 함께 소스에 찍어 드세요.',
    tags: ['분짜', '베트남음식', '하노이분짜', '새콤달콤']
  },
  {
    name: '새우와 레몬그라스 향이 폭발하는 세계 3대 수프 똠얌꿍과 쌀국수면',
    englishName: 'Thai Spicy & Sour Tom Yum Goong Soup with King Prawns',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'ASIAN_WORLD',
    emoji: '🍲',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '510 kcal',
    priceRange: '16,000원',
    tagline: '시큼하고 매콤하며 코코넛 밀크의 고소함이 어우러진 중독성 최강의 태국 정통 새우 수프',
    funComment: '첫 숟가락엔 "이게 무슨 맛이지?" 하다가 그릇 바닥까지 숟가락으로 긁고 있는 자신을 발견하게 됩니다.',
    pairingTip: '자스민 쌀밥을 국물에 말아 먹거나 쌀국수 면 사리를 넣어 즐기세요.',
    tags: ['똠얌꿍', '태국음식', '세계3대수프', '해장수프']
  },
  {
    name: '바삭하게 튀긴 소프트쉘 크랩과 부드러운 옐로우 커리 푸팟퐁커리',
    englishName: 'Thai Soft Shell Crab Yellow Coconut Curry (Poo Pad Pong Karee)',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'ASIAN_WORLD',
    emoji: '🦀',
    candidateMeals: ['lunch', 'dinner'],
    primaryMeal: 'dinner',
    calories: '740 kcal',
    priceRange: '28,000원',
    tagline: '껍질째 통째로 씹어 먹는 부드러운 게 튀김 위에 계란과 코코넛 밀크가 풀어진 달콤고소한 커리',
    funComment: '게 살의 고소함과 계란 커리 소스의 풍미가 밥도둑을 넘어 밥강도 수준의 위력을 발휘합니다.',
    pairingTip: '따뜻한 안남미 볶음밥 위에 커리 소스를 듬뿍 얹어 비벼 드세요.',
    tags: ['푸팟퐁커리', '태국커리', '소프트쉘크랩', '저녁외식']
  },
  {
    name: '과카몰리와 살사 소스를 얹은 정통 멕시칸 비프 타코 3피스',
    englishName: 'Authentic Mexican Birria Beef Tacos with Guacamole & Fresh Lime',
    originGroup: 'GLOBAL_DINING',
    deliveryCategory: 'ASIAN_WORLD',
    emoji: '🌮',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'dinner',
    calories: '560 kcal',
    priceRange: '14,500원',
    tagline: '또띠아를 고기 육수에 적셔 구운 뒤 결대로 찢은 소고기와 양파, 고수, 생라임을 짠 타코',
    funComment: '라임을 꾹 짜서 한 입 베어 물면 멕시코 칸쿤 해변의 푸드트럭으로 순간이동합니다.',
    pairingTip: '나초 칩과 치즈 디핑 소스, 시원한 코로나 맥주를 곁들이세요.',
    tags: ['멕시칸타코', '비리아타코', '과카몰리', '야식타코']
  },

  // =========================================================================
  // 8. 샐러드·포케·건강식 (SALAD_HEALTH)
  // =========================================================================
  {
    name: '생연어 깍둑썰기와 날치알, 현미밥이 어우러진 하와이안 살몬 포케 볼',
    englishName: 'Hawaiian Fresh Salmon Poke Bowl with Brown Rice & Avocado',
    originGroup: 'RAW_NATURAL',
    deliveryCategory: 'SALAD_HEALTH',
    emoji: '🥗',
    candidateMeals: ['breakfast', 'lunch', 'dinner'],
    primaryMeal: 'lunch',
    calories: '520 kcal',
    priceRange: '13,500원',
    tagline: '스파이시 마요 소스에 버무린 생연어, 아보카도, 병아리콩, 해초 샐러드, 바삭한 어니언 크리스피',
    funComment: '다이어트 음식인데 이렇게 맛있어도 되나 싶은 든든하고 신선한 한 끼 샐러드 볼!',
    pairingTip: '와사비 간장 소스를 살짝 뿌려 젓가락으로 가볍게 비벼 드세요.',
    tags: ['연어포케', '하와이안포케', '클린식단', '건강한점심']
  },
  {
    name: '수비드 촉촉 닭가슴살과 구운 단호박 웜 샐러드',
    englishName: 'Sous-Vide Tender Chicken Breast & Roasted Pumpkin Warm Salad',
    originGroup: 'RAW_NATURAL',
    deliveryCategory: 'SALAD_HEALTH',
    emoji: '🥗',
    candidateMeals: ['breakfast', 'lunch', 'dinner'],
    primaryMeal: 'dinner',
    calories: '380 kcal',
    priceRange: '11,000원',
    tagline: '저온 수비드로 조리해 퍽퍽함이 0%인 닭가슴살과 달콤하게 구운 단호박, 발사믹 글레이즈',
    funComment: '운동 끝나고 헬스장에서 나오며 주문하면 몸에 즉각 단백질과 미네랄을 공급해 주는 식단.',
    pairingTip: '오리엔탈 드레싱이나 참깨 드레싱을 반만 둘러 가볍게 즐기세요.',
    tags: ['닭가슴살샐러드', '수비드치킨', '식단관리', '저녁다이어트']
  },

  // =========================================================================
  // 9. 분식 (BUNSIK)
  // =========================================================================
  {
    name: '순살 치킨 가라아게 토핑 올린 매콤 꾸덕 크림 로제 떡볶이',
    englishName: 'Creamy Rosé Tteokbokki with Crispy Chicken Karaage Topping',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🌶️',
    candidateMeals: ['lunch', 'snack', 'dinner', 'night'],
    primaryMeal: 'night',
    calories: '920 kcal',
    priceRange: '15,000원',
    tagline: '고추장과 부드러운 우유 생크림 소스가 환상 비율로 만난 배달 분식계의 압도적 베스트셀러',
    funComment: '바삭한 치킨 가라아게를 로제 국물에 푹 적셔 떡과 함께 씹는 순간 도파민 분출!',
    pairingTip: '납작당면 사리와 모짜렐라 치즈를 추가하면 완벽합니다.',
    tags: ['로제떡볶이', '배민분식', '치킨토핑', '야식떡볶이']
  },
  {
    name: '추억의 달콤한 키위 소스와 햄·치즈·계란 듬뿍 이삭 햄스페셜 토스트',
    englishName: 'Sweet Kiwi Sauce Ham & Cheese Special Toast Sandwich',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'BUNSIK',
    emoji: '🥪',
    candidateMeals: ['breakfast', 'lunch', 'snack', 'night'],
    primaryMeal: 'breakfast',
    calories: '450 kcal',
    priceRange: '4,200원',
    tagline: '달콤한 마법의 특제 과일 소스와 옥수수 콘 박힌 계란 부침, 아삭한 양배추 채가 꽉 찬 토스트',
    funComment: '포장지 은박지를 살짝 벗기며 따뜻할 때 한 입 베어 물면 학창 시절 아침의 그 맛!',
    pairingTip: '달콤한 딸기 주스나 아이스 아메리카노와 함께 드세요.',
    tags: ['이삭토스트', '햄스페셜', '추억의토스트', '아침간편식']
  },

  // =========================================================================
  // 10. 카페·디저트 (CAFE_DESSERT)
  // =========================================================================
  {
    name: '크루아상을 누룽지처럼 얇게 눌러 구운 빠작한 크룽지와 바닐라 아이스크림',
    englishName: 'Crispy Flattened Croissant (Croongji) with Vanilla Bean Ice Cream',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🥐',
    candidateMeals: ['breakfast', 'snack', 'night'],
    primaryMeal: 'snack',
    calories: '480 kcal',
    priceRange: '6,500원',
    tagline: '버터 풍미 폭발하는 크루아상을 납작하게 눌러 캐러멜 코팅한 K-디저트의 위대한 발명품',
    funComment: '과자처럼 바삭바삭 부서지는 크룽지 위에 차가운 바닐라 아이스크림을 얹어 먹는 극상의 식감.',
    pairingTip: '진한 룽고 커피나 차가운 콜드브루와 함께 오후 3시 디저트로 즐기세요.',
    tags: ['크룽지', 'K디저트', '크루아상누룽지', '간식추천']
  },
  {
    name: '겉은 바삭하고 속은 쫀득하게 카라멜화된 꾸덕 황치즈 버터바',
    englishName: 'Chewy Salted Caramel & Cheddar Cheese Butter Bar',
    originGroup: 'KOREAN_POPULAR',
    deliveryCategory: 'CAFE_DESSERT',
    emoji: '🧈',
    candidateMeals: ['snack', 'night'],
    primaryMeal: 'snack',
    calories: '430 kcal',
    priceRange: '5,000원',
    tagline: '두꺼운 버터 크러스트 위에 단짠의 황치즈 반죽을 쫀득하게 구워 얼먹(얼려 먹기)하는 디저트',
    funComment: '냉동실에서 꺼내 5분 뒤 이로 베어 물 때 느껴지는 극강의 꾸덕함과 진한 치즈 향!',
    pairingTip: '무조건 쓴맛의 따뜻한 아메리카노나 진한 홍차와 페어링하세요.',
    tags: ['황치즈버터바', '버터바', '꾸덕디저트', '얼먹디저트']
  }
];
