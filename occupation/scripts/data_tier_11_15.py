# -*- coding: utf-8 -*-
"""
scripts/data_tier_11_15.py
Tiers 11 to 15 (Levels 500 to 749, 250 items, GOOD Zone)
STRICT SPECIFICATION: ZERO space keywords in Levels 0 to 949!
Tier 11: 세상에 이런 꿀직업이·이색 억대 호사 (500..549)
Tier 12: 대박 장사꾼·미식·럭셔리 투어리스트 (550..599)
Tier 13: 괴짜 천재·크립토·실리콘밸리 승부사 (600..649)
Tier 14: 월드클래스 스타·저작권 연금·스포츠 제왕 (650..699)
Tier 15: 초호화 슈퍼리치·억만장자 VIP 전담 디렉터 (700..749)
"""

# ==========================================
# TIER 11: 세상에 이런 꿀직업이·이색 억대 호사 (500..549)
# ==========================================

TIER_11_REAL = [
    (title, en_title,
     "2024년 글로벌 초호화 힐링 휴양지", "2024, Global Ultra-Luxury Healing Retreat",
     "연봉 8,500만 원 ~ 1.5억 원 (전 세계 특급 리조트 숙박 & 항공권 전액 지원)",
     "$75,000 - $120,000/year (All 5-Star Stays & First-Class Flights Covered)",
     f"{title}로서 일과 휴식의 경계를 허무는 꿈의 꿀직업을 만끽합니다. 최고급 휴양지와 판다 유치원, 럭셔리 워터파크를 누비며 행복한 감별 업무를 수행합니다. 출근길 스트레스 없이 온종일 미소 지으며 인생을 여행하듯 살아갑니다.",
     f"Lives the absolute dream blurring work and luxury leisure as a {en_title}. Enjoys world-class resorts, cuddly panda kindergartens, and VIP waterslides on unlimited corporate expense accounts.",
     "숨만 쉬고 낮잠만 자도 통장에 억대 연봉이 꽂히는 지구상 최고의 꿀직업 챔피언!",
     "Sleeping on sunbeds and hugging baby pandas for high salaries—the undisputed dream job!")
    for title, en_title in [
        ("몰디브 5성급 리조트 해변 선베드 낮잠 쿠션감 감별사", "Maldives 5-Star Resort Beach Sunbed Nap Cushion Critic"),
        ("중국 쓰촨성 판다 기지 아기 판다 종일 안아주기 보모", "Sichuan Giant Baby Panda All-Day Cuddle Nanny"),
        ("두바이 7성급 호텔 워터파크 슬라이드 속도감 측정 테스터", "Dubai 7-Star Hotel Waterpark Slide Velocity Tester"),
        ("스위스 알프스 럭셔리 샬레 깃털 이불 보온성 연구 수면 전문가", "Swiss Alps Luxury Chalet Feather Duvet Sleep Connoisseur"),
        ("전 세계 넷플릭스 오리지널 드라마 정주행 평론가", "Global Netflix Original Binge-Watch Critic"),
        ("프랑스 프로방스 라벤더 농장 천연 아로마 향기 마스터", "Provence Lavender Farm Natural Aroma Fragrance Master"),
        ("호주 그레이트 배리어 리프 산호초 프라이빗 섬 관리인", "Great Barrier Reef Private Coral Island Caretaker"),
        ("영국 왕실 웰시코기 전담 산책 및 유기농 간식 수석 셰프", "British Royal Welsh Corgi Head Walker & Gourmet Chef"),
        ("벨기에 최고급 수제 초콜릿 쇼콜라티에 관능 평가관", "Belgian Grand Cru Chocolate Sensory Evaluation Master"),
        ("미국 디즈니랜드 놀이기구 탑승 안전 및 스릴감 검증 디렉터", "Disneyland Ride Thrill & Safety Evaluation Director"),
        ("아이슬란드 블루라군 천연 온천수 온도 및 머드팩 감별 연구원", "Iceland Blue Lagoon Geothermal Mudpack Inspector"),
        ("핀란드 산타마을 공식 루돌프 썰매 순록 털 빗질 마스터", "Lapland Santa Village Reindeer Fur Grooming Specialist"),
        ("하와이 와이키키 해변 튜브 바람 넣기 및 일광욕 코치", "Waikiki Beach Floating Tube & Sunbathing Relax Coach"),
        ("이탈리아 피렌체 젤라또 신메뉴 당도 및 텍스처 감정사", "Florence Artisan Gelato Texture & Sweetness Appraiser"),
        ("노르웨이 피오르드 크루즈 갑판 오로라 관측 의자 세팅 요원", "Norwegian Fjord Cruise Aurora Viewing Deck Concierge"),
        ("캐나다 단풍나무 숲 프리미엄 메이플 시럽 첫물 채취 장인", "Canadian Forest Premium First-Sap Maple Syrup Master"),
        ("일본 홋카이도 온천 원숭이 전용 탕 온도 조절사", "Hokkaido Hot Spring Snow Monkey Bath Thermostat Attendant"),
        ("독일 옥토버페스트 VIP 텐트 맥주 거품 황금비율 감별사", "Oktoberfest VIP Tent Beer Foam Golden Ratio Connoisseur"),
        ("스페인 이비자 섬 클럽 해변 VIP 파라솔 명당 지정 매니저", "Ibiza Sunset Beach VIP Cabana Sunshade Manager"),
        ("미국 캘리포니아 나파밸리 포도나무 그늘 낮잠 품질 연구가", "Napa Valley Vineyard Shade Afternoon Nap Quality Researcher"),
        ("뉴질랜드 퀸스타운 번지점프대 1번 타자 안전 시범관", "Queenstown Bungee Jump Daily First Safety Demonstrator"),
        ("모나코 그랑프리 VIP 테라스 샴페인 잔 온도 유지 매니저", "Monaco Grand Prix VIP Balcony Champagne Chilling Steward"),
        ("멕시코 칸쿤 해저 조각공원 스쿠버다이빙 가이드 겸 포토그래퍼", "Cancun Underwater Museum Scuba Diving Photo Guide"),
        ("프랑스 보르도 와이너리 오크통 숙성 공기 냄새 감정관", "Bordeaux Winery Oak Barrel Cellar Air Scent Sommelier"),
        ("덴마크 레고랜드 신제품 레고 브릭 조립감 손맛 감별 마스터", "Legoland Denmark New Brick Click-Feel Sensory Master")
    ]
]

TIER_11_FICTION = [
    (title, en_title,
     "동화 및 판타지 왕국 힐링 성역", "Fairy Tale & Fantasy Healing Sanctuary",
     "연봉 무지개 이슬 10병 + 별가루 베개", "10 Vials of Rainbow Dew + Starlight Pillow/year",
     f"{title}로서 마법 세계에서 가장 편안하고 환상적인 호사를 누립니다. 요정들의 자장가를 들으며 구름 침대에서 뒹굴고, 신비한 마법 생물들과 교감합니다. 근심 걱정 하나 없는 동화 속에서 행복 바이러스를 전파하며 살아갑니다.",
     f"Basks in the softest fairy-tale luxuries of magical realms as a {en_title}. Lounges on cloud marshmallow mattresses to pixie lullabies, radiating absolute serenity and bliss.",
     "동화 속 요정들도 부러워하는 환상 세계 최고의 호사스러운 판타지 꿀직업!",
     "Lounging on cloud marshmallows and listening to pixie lullabies—the coziest fantasy role!")
    for title, en_title in [
        ("요정 여왕의 구름 솜사탕 침대 푹신함 테스트 수면 연구원", "Fairy Queen Cloud Cotton-Candy Mattress Sleep Tester"),
        ("포켓몬 센터 잠만보 낮잠 자장가 오르골 연주가", "Pokemon Center Snorlax Lullaby Music Box Player"),
        ("짱구는 못말려 초코비 공장 신상 분홍 악어 스티커 검수관", "Crayon Shin-chan Chocobi Factory Pink Crocodile Sticker Inspector"),
        ("찰리와 초콜릿 공장 씹어도 줄지 않는 풍선껌 풍미 연구원", "Willy Wonka Everlasting Gobstopper Flavor Chemist"),
        ("이웃집 토토로 거대 푹신푹신 배 위 낮잠 쿠션 테스트 요원", "My Neighbor Totoro Fluffy Belly Nap Cushion Tester"),
        ("마녀 배달부 키키 구름 위 빗자루 비행 풍속 테스터", "Kiki's Broomstick Cloud-Level Breeze Velocity Tester"),
        ("센과 치히로 가마할아범 온천 보일러실 검은 그을음 먼지 먹이 주기", "Spirited Away Kamaji Boiler Soot-Sprite Candy Feeder"),
        ("이상한 나라의 앨리스 모자장수 티파티 마들렌 굽기 셰프", "Mad Hatter Wonderland Tea Party Madeleine Pastry Chef"),
        ("심슨 가족 호머 심슨 핑크 도넛 설탕 코팅 수석 마스터", "Simpsons Homer Pink Donut Sugar Glaze Chief Master"),
        ("몬스터 주식회사 어린이 웃음소리 에너지 보관 캔 밀봉관", "Monsters Inc Child Laughter Energy Canister Sealer"),
        ("곰돌이 푸 100에이커 숲 단풍나무 천연 꿀단지 미각 감별사", "Winnie the Pooh Hundred Acre Wood Honey Pot Sommelier"),
        ("보노보노 포로리 호두 껍질 까기 및 조개껍질 광택사", "Bonobono Sea Otter Shell Polisher & Walnut Cracker"),
        ("스폰지밥 징징이 클라리넷 독주회 맨 앞줄 졸기 금지 요원", "Squidward Clarinet Recital Front-Row Awake Guard"),
        ("치즈 나라 크래커 발라먹기 전담 미식가", "Cheese Land Gourmet Cracker Buttering Connoisseur"),
        ("슈렉 피오나 공주 늪지대 머드 온천 머드팩 마스터", "Shrek Swamp Geothermal Mudpack Spa Master"),
        ("핀과 제이크의 어드벤처 타임 캔디 왕국 버블검 공주 젤리 연구원", "Adventure Time Candy Kingdom Princess Bubblegum Jelly Scientist"),
        ("주먹왕 랄프 슈가 러시 레이싱 카라멜 도로 포장 정비공", "Wreck-It Ralph Sugar Rush Caramel Asphalt Pavement Tech"),
        ("토이 스토리 앤디 방 장난감 회의 비밀 서기장", "Toy Story Andy's Bedroom Secret Council Scribe"),
        ("마다가스카 펭귄 특공대 작전용 정어리 캔 오프너", "Madagascar Penguin Commando Tactical Sardine Can Opener"),
        ("쿵푸팬더 포의 아빠 핑 국수집 비법 육수 비밀 맛 테이스터", "Kung Fu Panda Mr. Ping Secret Ingredient Noodle Broth Taster"),
        ("드래곤 길들이기 나이트 퓨어리 턱밑 긁어주기 전담 보모", "How to Train Your Dragon Night Fury Toothless Chin Scratches Nanny"),
        ("라따뚜이 파리 구스토 레스토랑 주방 천장 쥐 전용 환기구 안내원", "Ratatouille Gusteau Kitchen Ceiling Vent Concierge"),
        ("인어공주 아리엘 바닷속 인간 보물 수집 포크(딩글호퍼) 빗질사", "Little Mermaid Ariel Dinglehopper Hair Combing Specialist"),
        ("알라딘 마법의 양탄자 공중 털 털기 및 오리엔탈 실크 클리너", "Aladdin Magic Carpet Silk Dusting Aerial Steward"),
        ("겨울왕국 올라프 여름 해변 전용 휴대용 눈구름 살포 코디네이터", "Frozen Olaf Summer Beach Personal Flurry Snow Cloud Operator")
    ]
]

# ==========================================
# TIER 12: 대박 장사꾼·미식·럭셔리 투어리스트 (550..599)
# ==========================================

TIER_12_REAL = [
    (title, en_title,
     "2024년 전 세계 미슐랭 3스타 및 대박 상권", "2024, World 3-Star Michelin & Mega-Commercial Markets",
     "연봉 2억 원 ~ 5억 원 (무제한 블랙 법인카드 지원)",
     "$150,000 - $380,000/year (Unlimited Black Card Expense Account)",
     f"{title}로서 파리와 도쿄, 뉴욕, 강남의 최고급 식당과 특급 명소를 누비며 최고의 가치를 창출합니다. 수천만 원 상당의 빈티지 와인과 캐비아를 맛보거나 하루 수천만 원 매출을 올리는 대박 장사의 정점을 찍습니다. 전 세계 미식가와 여행자들의 찬사를 매일 받습니다.",
     f"Operates at the pinnacle of elite gastronomy and wildly profitable commercial empires as a {en_title}. Samples grand cru vintages, inspects transcontinental luxury trains, and generates massive fortunes.",
     "입만 열면 수억 원 매출이 쏟아지는 지구 최강의 황금 혀와 장사 수완의 달인!",
     "Savoring the pinnacle of gastronomy on corporate black cards—the golden touch of luxury trade!")
    for title, en_title in [
        ("전 세계 미슐랭 3스타 레스토랑 시크릿 암행 시식가", "Global 3-Star Michelin Secret Anonymous Inspector"),
        ("강남역 일매출 5,000만 원 전설의 붕어빵·호떡 빌딩주 사장님", "Gangnam Station $40K/Day Street Pastry Building Owner"),
        ("청담동 예약 2년 밀린 1인 50만 원 하이엔드 오마카세 마스터", "Cheongdam-dong 2-Year Waitlist $400 Omakase Master"),
        ("스위스 알프스 빙하 특급열차 일등석 파노라마 뷰 전담 안내관", "Swiss Glacier Express 1st-Class Panoramic View Guide"),
        ("프랑스 보르도 특급 샤토 와인 경매 수석 소믈리에", "Bordeaux Premier Grand Cru Chateau Auction Chief Sommelier"),
        ("이탈리아 알바 백송로버섯(화이트 트러플) 채취 탐지견 수석 훈련사", "Alba White Truffle Hunting Dog Master Trainer"),
        ("일본 긴자 1송이 50만 원 루비로망 포도 경매 낙찰 중개인", "Ginza $400 Ruby Roman Luxury Grape Auction Broker"),
        ("미국 뉴욕 맨해튼 펜트하우스 프라이빗 셰프 및 케이터링 디렉터", "Manhattan Penthouse Private Executive Chef & Caterer"),
        ("홍콩 빅토리아 피크 야경 레스토랑 명당 좌석 예약 프리미엄 브로커", "Victoria Peak Night View Table VIP Reservation Broker"),
        ("스페인 하몽 이베리코 베요타 10년 숙성 수석 카버 장인", "Jamón Ibérico de Bellota 10-Year Aged Master Carving Artisan"),
        ("두바이 금시장 99.99% 순금 식용 금박 디저트 데코레이터", "Dubai Gold Souk 24K Edible Gold Leaf Dessert Designer"),
        ("프랑스 파리 방돔 광장 하이주얼리 VIP 프라이빗 살롱 도슨트", "Place Vendôme Paris High-Jewelry Private Salon Docent"),
        ("영국 스코틀랜드 하일랜드 50년산 싱글몰트 위스키 캐스크 감정관", "Highland 50-Year Single Malt Cask Inspector"),
        ("미국 라스베이거스 벨라지오 분수 쇼 VIP 스위트룸 뷰 큐레이터", "Bellagio Las Vegas Fountain View VIP Suite Curator"),
        ("호주 태즈메이니아 야생 전복 및 남방참다랑어 경매 마스터", "Tasmanian Wild Abalone & Bluefin Tuna Auction Master"),
        ("독일 뮌헨 명품 스포츠카 아우토반 최고속도 시운전 가이드", "Munich Supercar Autobahn Unlimited Velocity Test Guide"),
        ("미국 나파밸리 억만장자 프라이빗 와인 컬렉션 자산 관리인", "Napa Valley Billionaire Private Wine Cellar Asset Manager"),
        ("싱가포르 마리나 베이 샌즈 인피니티 풀 VIP 카바나 총괄 매니저", "Marina Bay Sands Infinity Pool VIP Cabana Concierge"),
        ("페루 쿠스코 마추픽추 호화 럭셔리 기차 벨몬드 하이럼 빙엄 지배인", "Belmond Hiram Bingham Luxury Train to Machu Picchu GM"),
        ("오스트리아 비엔나 오페라 극장 황실 발코니석 샴페인 마스터", "Vienna State Opera Imperial Balcony Champagne Steward"),
        ("벨기에 브뤼셀 다이아몬드 거래소 보석 감정 및 커팅 마스터", "Antwerp-Brussels Diamond Bourse Master Cutter & Gemologist"),
        ("멕시코 데킬라 아가베 최고급 엑스트라 아네호 증류 마스터", "Highland Agave Extra Añejo Tequila Master Distiller"),
        ("이탈리아 카프리 섬 푸른 동굴 프라이빗 요트 투어 수석 선장", "Capri Blue Grotto Private Mega-Yacht Skipper"),
        ("미국 캘리포니아 베벌리힐스 스타 로드 트립 VIP 전담 가이드", "Beverly Hills Celebrity Estates VIP Excursion Director"),
        ("영국 런던 메이페어 5성 호텔 애프터눈 티 홍차 블렌딩 마스터", "Mayfair 5-Star Hotel Royal Afternoon Tea Blending Master")
    ]
]

TIER_12_FICTION = [
    (title, en_title,
     "판타지 명작 요리 및 초호화 만찬장", "Fantasy Culinary Classics & Grand Feast Halls",
     "연봉 마법 레시피 황금 두루마리 + 드래곤 와인 1병", "Golden Magic Recipe Scroll + 1 Bottle of Dragon Wine/year",
     f"{title}로서 전설적인 애니메이션과 영화 속 황홀경을 선사하는 궁극의 미식을 연출합니다. 황금 티켓의 초콜릿 공장과 마법 온천장의 사금 정산대에서 VIP 고객들을 영접합니다. 음식을 먹는 순간 옷이 찢어지거나 눈물을 흘리는 최고의 맛을 완성합니다.",
     f"Creates legendary gastronomic paradises inspired by famous fictional worlds as a {en_title}. Serves golden tickets in Wonka's factory, counts alluvial gold in spirited bathhouses, and crafts euphoria.",
     "한 입 베어 물면 머릿속에서 오케스트라가 울려 퍼지는 판타지 세계관 최고의 미식 장인!",
     "Culinary sorcery that makes symphonies erupt in your mind with a single bite—gourmet legend!")
    for title, en_title in [
        ("찰리의 초콜릿 공장 황금 티켓 신메뉴 수석 테이스터", "Willy Wonka Golden Ticket Confectionery Chief Taster"),
        ("센과 치히로의 행방불명 유바바 온천장 VVIP 사금 정산 지배인", "Spirited Away Yubaba Bathhouse VVIP Alluvial Gold Banker"),
        ("요리왕 비룡 전설의 주방기구 8종 녹 방지 및 황금 볶음밥 심사관", "Cooking Master Boy 8 Legendary Utensils Golden Fried Rice Judge"),
        ("해리포터 버터맥주 및 온갖 맛이 나는 젤리 수석 조제 마법사", "Hogwarts Three Broomsticks Butterbeer & Bertie Bott's Master Brewer"),
        ("식극의 소마 옷 찢어지는 리액션 유발 황홀경 요리 연구원", "Food Wars Shokugeki Euphoria Reaction Recipe Chemist"),
        ("하울의 움직이는 성 캘시퍼 베이컨 에그 브런치 불꽃 온도 조절사", "Howl's Moving Castle Calcifer Bacon-Egg Flame Stoker"),
        ("던전밥 레드 드래곤 꼬리 고기 스테이크 전담 요리사", "Delicious in Dungeon Red Dragon Tail Steak Executive Chef"),
        ("토리코 구르메계 갓(GOD) 식재료 포획 사냥꾼 보조", "Toriko Gourmet World GOD Ingredient Capture Assistant"),
        ("원피스 상디 올블루 직송 해산물 특선 코스 요리 시식관", "One Piece Sanji All Blue Ocean Seafood Banquet Critic"),
        ("미녀와 야수 저택 마법 촛대 뤼미에르 만찬 코스 춤 지휘자", "Beauty and the Beast Lumiere Be Our Guest Banquet Choreographer"),
        ("벼랑 위의 포뇨 꿀 넣은 따뜻한 우유와 햄 라멘 끓이기 달인", "Ponyo Honey Hot Milk & Steaming Ham Ramen Chef"),
        ("마인크래프트 황금 사과 및 인챈트 황금 당근 조합 연금술사", "Minecraft Enchanted Golden Apple & Carrot Master Alchemist"),
        ("몬스터 헌터 집회소 아이루 수제 경단 만찬 총괄 조리장", "Monster Hunter Felyne Assembly Kitchen Dango Grand Chef"),
        ("젤다의 전설 야생의 숨결 만능 냄비 브리또 & 바나나 요리 연구가", "Zelda Breath of the Wild Hearty Durian Simmered Dish Master"),
        ("주디 홉스 주토피아 점보 팝 아이스바 주트 쪼개기 마스터", "Zootopia Jumbo Pop Ice-Popsicle Melting Artisan"),
        ("쿠키런 킹덤 설탕노움 왕국 3단 딸기 케이크 건축 셰프", "Cookie Run Kingdom Sugar Gnome 3-Tier Strawberry Cake Architect"),
        ("나루토 일락라면 나루토 멘마 2배 차슈 곱빼기 토핑 실장", "Naruto Ichiraku Ramen Double-Chashu Special Topping Master"),
        ("포켓몬스터 분홍색 야돈 꼬리 달콤한 시럽 절임 미식가", "Pokemon Sweet Slowpoke Tail Syrup Delicacy Connoisseur"),
        ("메이플스토리 헤네시스 버섯 사탕 & 주황버섯 갓 구이 장인", "MapleStory Henesys Sweet Mushroom Candy Master Baker"),
        ("닥터 스톤 센쿠표 수제 콜라 탄산 배합 화학자", "Dr. Stone Senku Homemade Carbonated Cola Chemist"),
        ("원신 만민당 향릉표 절운고추 슬라임 푸딩 검식관", "Genshin Impact Wanmin Restaurant Xiangling Slime Pudding Taster"),
        ("슬레이어즈 칠흑의 마왕 만찬 암흑 물질 소화제 조제사", "Slayers Dark Lord Banquet Digestion Potion Apothecary"),
        ("블리치 우라하라 상점 기적의 영력 회복 사탕 독점 판매상", "Bleach Urahara Shop Spirit Rejuvenation Candy Merchant"),
        ("은혼 긴토키 단것 중독 딸기 파르페 휘핑크림 타워 축조사", "Gintama Gintoki Strawberry Parfait Whipped Cream Tower Builder"),
        ("강철의 연금술사 피나코 할머니표 영양 듬뿍 고기스튜 국물 테스터", "Fullmetal Alchemist Pinako Granny Hearty Beef Stew Critic")
    ]
]

# ==========================================
# TIER 13: 괴짜 천재·크립토·실리콘밸리 승부사 (600..649)
# ==========================================

TIER_13_REAL = [
    (title, en_title,
     "2024년 글로벌 테크·크립토·실리콘밸리 금융 승부처", "2024, Silicon Valley Crypto & Tech Frontiers",
     "연봉 10억 원 ~ 8조 원 (스톡옵션 & 비트코인 지갑 직입금)",
     "$800,000 - $6 Billion/year (Stock Options & Direct BTC Cold Wallets)",
     f"{title}로서 현대 자본주의와 디지털 테크의 최전선에서 전설을 써 내려갑니다. 천재적인 두뇌와 알고리즘, 대담한 베팅으로 수천억에서 수조 원대 자산을 단숨에 일궈냅니다. 실리콘밸리와 월스트리트의 모든 거물들이 경외하는 은둔의 승부사로 군림합니다.",
     f"Commands immense fortunes at the absolute cutting edge of capitalism and computer science as a {en_title}. Writes three lines of code for unicorns, captures billions in crypto, and retires to private island beaches.",
     "방구석 모니터 앞에서 키보드 몇 번 두드려 조 단위 자산을 쓸어 담는 전설의 승부사!",
     "Typing lines of code in hoodies that move global financial markets—the digital titans!")
    for title, en_title in [
        ("비트코인 8조 원을 해킹해 남태평양 무인도 해변에서 코코넛 마시는 전설의 유령 개발자", "Ghost Hacker Sipping Coconuts on South Pacific Island with $6B in Stolen Bitcoin"),
        ("이더리움 스마트 컨트랙트 취약점 찾아내 500억 버그바운티 받은 화이트해커", "Ethereum Smart Contract Bug Bounty White-Hat $40M Earner"),
        ("라스베이거스 카지노 블랙잭 승률 99% 계산해 출입금지당한 MIT 수학 천재", "MIT Math Genius Banned from Las Vegas with 99% Blackjack Algorithm"),
        ("스팀 1인 개발 도트 인디게임으로 글로벌 1,000억 매출 터뜨린 방구석 천재", "Solo Indie Developer Earning $80M on Steam from Bedroom"),
        ("글로벌 초단타 매매(HFT) 광섬유 0.0001초 지연시간 단축 알고리즘 천재", "High-Frequency Trading 0.1ms Fiber-Optic Latency Quant Prodigy"),
        ("솔라나 밈코인 하루 만에 1만 배 펌핑 먹고 은퇴한 20대 크립토 고래", "20-Year-Old Crypto Whale Retiring on 10,000x Solana Meme Token Pump"),
        ("다크웹 마켓플레이스 추적해 분실된 가상화폐 3,000억 회수해준 사설 사이버 탐정", "Darknet Blockchain Investigator Recovering $250M Lost Crypto"),
        ("테슬라·애플 제로데이 보안 취약점 100개 제보해 명예의 전당 오른 고교생 해커", "High School Hacker Reporting 100 Zero-Days to Apple & Tesla Hall of Fame"),
        ("비트코인 10만 개 든 하드디스크 쓰레기 매립지 발굴 프로젝트 총괄 AI 공학자", "Landfill Excavation AI Engineer Recovering 100,000 Lost Bitcoins"),
        ("글로벌 NFT 아트 1장 700억에 팔아치운 디지털 크립토 아티스트", "Digital Crypto Artist Selling Single NFT Artwork for $60M"),
        ("실리콘밸리 시리즈A 투자만 받고 피봇 5번 하며 몸값 1조 띄운 언변의 창업자", "Silicon Valley 5x Pivot Charismatic Founder Valued at $1B"),
        ("전 세계 도메인 명당 ai.com 선점해 200억에 되판 도메인 스나이퍼", "Domain Sniper Snatching and Flipping ai.com for $15M"),
        ("유튜브 알고리즘 역공학 분석해 1억 구독자 채널 10개 키워낸 데이터 천재", "YouTube Algorithm Reverse Engineer Growing Ten 100M-Sub Channels"),
        ("전 세계 게임 스피드런 버그 글리치 최초 발견해 상금 싹쓸이한 게이머", "World Esports Speedrun Glitch Pioneer Sweeping Global Bounties"),
        ("실리콘밸리 AI 유니콘 스타트업 코드 3줄 짜주고 지분 30% 챙긴 천재", "Silicon Valley Genius Writing 3 Lines of Code for 30% Unicorn Equity"),
        ("미국 실리콘밸리 헤드헌터 1위 천재 개발자 1명 이직시키고 수수료 30억 버는 에이전트", "Top Tech Recruiter Earning $2M Commission per Genius Placement"),
        ("챗GPT 탈옥 프롬프트 깎는 장인 빅테크 보안 자문료 시급 1,000만 원", "ChatGPT Jailbreak Prompt Artisan Earning $8,000/Hour Consulting Fees"),
        ("글로벌 블록체인 크로스체인 브릿지 해킹 막아내고 수수료 200억 챙긴 화이트햇", "Cross-Chain Bridge Exploit Defender Earning $15M Savior Bounty"),
        ("암호화폐 탈중앙화 거래소 차익거래 MEV 봇 단독 운영해 매일 1억 버는 은둔자", "Solitary Arbitrage MEV Bot Architect Mining $80K Daily"),
        ("구글 검색엔진 상위노출 알고리즘 패치 하루 전 예측하는 SEO 천재", "Google Core Algorithm Update Predictive Mastermind"),
        ("포브스 30세 이하 부자 표지 모델 메타버스 가상 부동산 500억 매각 승부사", "Forbes 30 Under 30 Virtual Metaverse Real Estate Mogul"),
        ("양자 암호 해독 방어 체계 글로벌 특허 출원한 20대 천재 수학자", "Post-Quantum Cryptography Defense Patent Holder Prodigy"),
        ("글로벌 e스포츠 롤드컵 3연패 달성 후 스트리밍 계약 500억 찍은 프로게이머", "3-Time World Champion Esports Icon Signing $40M Exclusivity Deal"),
        ("스위스 크립토 밸리 재단 비밀 금고 개인키 수석 수탁관", "Swiss Crypto Valley Cold Storage Private Key Chief Custodian"),
        ("오픈소스 핵심 라이브러리 혼자 개발해 전 세계 빅테크 후원금으로 월 1억 버는 1인 개발자", "Solo Open-Source Core Maintainer Funded $1M/Year by Big Tech")
    ]
]

TIER_13_FICTION = [
    (title, en_title,
     "사이버펑크 및 서브컬처 가상현실 잭팟 무대", "Cyberpunk & VR Jackpot Underground Arenas",
     "연봉 가상 코인 100만 개 + 마법 크랙 코드", "1,000,000 Crypto Credits + Arcane Exploit Crack/year",
     f"{title}로서 매트릭스와 사이버 공간, 가상현실 게임 세계관의 치명적인 버그와 허점을 공략합니다. 도라에몽의 4차원 주머니에서 보물을 털거나 아카바 타워의 방화벽을 뚫고 무한 재화를 복사합니다. 현실과 가상의 경계를 농락하며 최고의 쾌감을 맛봅니다.",
     f"Hacks and exploits the most legendary fictional cybernetics and virtual realms as a {en_title}. Clones diamonds in the Matrix, auctions 4D pocket gadgets, and breaches mega-corp ICE.",
     "가상현실과 판타지 게임의 시스템을 해킹해 치트키 인생을 사는 무적의 넷러너!",
     "Rewriting the laws of reality with god-mode exploit scripts—the legendary netrunner!")
    for title, en_title in [
        ("매트릭스 소스코드 버그를 찾아내 다이아몬드를 무한 복사한 네오급 해커", "Neo-Level Hacker Exploiting Matrix Source Code to Clone Infinite Diamonds"),
        ("도라에몽 4차원 주머니 중고 명품 경매소 독점 딜러", "Doraemon 4D Pocket Rare Magic Gadget Exclusive Auction Broker"),
        ("유희왕 카이바 코퍼레이션 홀로그램 듀얼디스크 수석 설계 엔지니어", "KaibaCorp Holographic Duel Disk Chief Hardware Architect"),
        ("소드 아트 온라인 아인크라드 100층 히든 보스 공략 매크로 제작자", "Sword Art Online Aincrad 100th Floor Hidden Boss Macro Coder"),
        ("데스노트 L(엘)에게 단맛 사탕 공급하며 IP 추적 우회망 깔아주는 전속 해커", "L Lawliet Personal Sweet Candy Supplier & IP Proxy Route Builder"),
        ("공각기동대 쿠사나기 소령 전뇌 해킹 방어용 고스트 방화벽 프로그래머", "Ghost in the Shell Major Kusanagi Cyberbrain Anti-Hack Ghost Firewall Coder"),
        ("사이버펑크 2077 나이트시티 아라사카 타워 서브넷 침투 넷러너", "Cyberpunk 2077 Night City Arasaka Tower Subnet Infiltration Netrunner"),
        ("포가튼 렐름 바드 류트 튜닝으로 마법 골렘 자동 채굴 돌리는 해커", "Forgotten Realms Bard Lute Melodic Arcane Golem Mining Script Hacker"),
        ("레디 플레이어 원 오아시스 이스터에그 첫 번째 황금 열쇠 발견자", "Ready Player One OASIS Halliday Easter Egg First Golden Key Finder"),
        ("카케구루이 햣카오 학원 도박판 밑장빼기 X-Ray 안경 공급업자", "Kakegurui Hyakkaou Academy High-Stakes X-Ray Card Glass Supplier"),
        ("도박묵시록 카이지 지하 노역장 친치로 주사위 자석 원격 조종 엔지니어", "Kaiji Underground Chinchirorin Magnetic Remote Dice Technician"),
        ("페이트 스테이 나이트 성배전쟁 마나 무한 리필 크랙 패치 개발자", "Fate Holy Grail War Infinite Mana Regeneration Crack Patch Coder"),
        ("노 게임 노 라이프 공백 남매 전용 16개 체스말 딥러닝 AI 설계자", "No Game No Life Blank Siblings 16-Piece Chess Deep Learning AI Designer"),
        ("슈타인즈 게이트 D메일 시간 왜곡 방지 전화렌지 펌웨어 개발자", "Steins;Gate D-Mail Phone Microwave Time-Distortion Firmware Coder"),
        ("메가맨 Dr. 와일리 8보스 패턴 0.1초 전 예측 알고리즘 분석관", "Mega Man Dr. Wily 8 Robot Boss Attack Pattern Predictive Analyst"),
        ("유유백서 암흑무술대회 도박 승률 배당판 조작 암흑 브로커", "YuYu Hakusho Dark Tournament Betting Odds Fixing Underworld Syndicate"),
        ("헌터X헌터 그리드 아일랜드 '대천사의 숨결' 카드 독점 복제 암상인", "Hunter x Hunter Greed Island Angel's Breath Card Duplicate Black Merchant"),
        ("죠죠의 기묘한 모험 스탠드 능력치 스탯표 작성 및 암흑 경매사", "JoJo's Bizarre Adventure Stand Power Matrix Evaluator & Black Auctioneer"),
        ("오버로드 나자릭 지하대분묘 마법 아이템 인벤토리 데이터베이스 관리자", "Overlord Great Tomb of Nazarick Divine Tier Item Database Administrator"),
        ("전생했더니 슬라임 대현자 스킬 코딩 훈수 두는 이세계 데브옵스", "That Time I Got Reincarnated as a Slime Great Sage Skill DevOps Advisor"),
        ("나 혼자만 레벨업 성진우 그림자 군단 자동 출퇴근 근태 관리 시스템 개발자", "Solo Leveling Sung Jin-woo Shadow Army Auto Attendance System Coder"),
        ("전지적 독자 시점 성좌 배후성 후원 코인 수수료 환전소 총괄 딜러", "Omniscient Reader Star Stream Constellation Coin Currency Exchange Boss"),
        ("신의 탑 랭커 랭킹 산정위원회 시험 층 프리미엄 패스 암표상", "Tower of God High Ranker Evaluation Board Test Floor Fast-Pass Scalper"),
        ("페르소나 5 마음의 괴도단 내비게이션 섀도 위치 추적기 해커", "Persona 5 Phantom Thieves Palace Shadow Navigation GPS Exploit Coder"),
        ("리그 오브 레전드 자운 하수구 화학공학 마법공학 핵 크랙 암거래상", "Zaun Underground Chemtech & Hextech Exploit Crack Syndicate Dealer")
    ]
]

# ==========================================
# TIER 14: 월드클래스 스타·저작권 연금·스포츠 제왕 (650..699)
# ==========================================

TIER_14_REAL = [
    (title, en_title,
     "2024년 글로벌 스타디움·엔터테인먼트·스포츠 왕좌", "2024, World-Class Entertainment & Sports Stadiums",
     "연봉 30억 원 ~ 100억 원 (글로벌 저작권료 & 주급 입금)",
     "$2.5 Million - $8 Million/year (Global Royalty Streams & Weekly Wages)",
     f"{title}로서 전 세계 수억 명의 환호성을 한 몸에 받으며 막대한 부와 명예를 누립니다. 캐럴 한 곡으로 평생 연금을 받거나 슈퍼볼 하프타임쇼와 윔블던 결승전의 역사를 직접 지휘합니다. 글로벌 문화와 스포츠의 정점에서 황금빛 스포트라이트를 받습니다.",
     f"Basks in the adulation of millions while earning colossal wealth as a {en_title}. Collects perpetual holiday royalties, orchestrates Super Bowl halftime shows, and directs global culture.",
     "재능 하나로 전 세계를 매료시키고 매년 수십억 원이 자동 입금되는 월드스타!",
     "Pure talent turning global applause into automatic multi-million dollar annual royalties!")
    for title, en_title in [
        ("매년 겨울마다 캐럴 한 곡으로 저작권료 100억 자동 입금되는 작곡가", "Composer Earning $8M Annually in Royalties from Single Christmas Carol"),
        ("프리미어리그 주급 10억 원 받으며 벤치에서 물병 세우기 하는 백업 골키퍼", "Premier League $800K/Week Backup Goalie Perfecting Bottle Flips on Bench"),
        ("메이저리그 오타니 전담 통역 겸 경기 전 멘탈 케어 전담 디렉터", "Shohei Ohtani Personal Interpreter & Pre-Game Mental Coach"),
        ("미국 슈퍼볼 하프타임쇼 12분 무대 총괄 연출 및 드론 쇼 감독", "Super Bowl 12-Minute Halftime Extravaganza & Drone Spectacle Director"),
        ("영국 윔블던 테니스 결승전 센터코트 전담 잔디 깎기 및 라인 장인", "Wimbledon Centre Court Final Grass Trimming & Line Marking Artisan"),
        ("전 세계 스타디움 월드 투어 전용기 전담 음향 믹싱 수석 엔지니어", "Stadium World Tour Private Jet Chief Sound Mixing Engineer"),
        ("칸 영화제 황금종려상 트로피 24K 순금 조각 및 운송 전담관", "Cannes Palme d'Or 24K Solid Gold Sculptor & Armored Escort Chief"),
        ("그래미 어워드 올해의 앨범상 수상곡 마스터링 레코딩 엔지니어", "Grammy Album of the Year Mastering & Studio Recording Virtuoso"),
        ("F1 챔피언십 우승팀 피트스탑 1.8초 타이어 교체 피트크루 총괄 리더", "F1 World Champion 1.8-Second Pit Crew Tire Change Chief Director"),
        ("글로벌 팝스타 월드투어 백댄서 단장 겸 안무 저작권료 부자", "Pop Superstar World Tour Dance Captain & Choreography Royalty Mogul"),
        ("전 세계 K-POP 아이돌 빌보드 1위 킬링파트 3초 작곡가", "K-Pop Hitmaker Composing 3-Second Billboard Hot 100 Killing Hooks"),
        ("소더비 경매 1점 낙찰가 200억 받는 현대 미술 생존 거장", "Contemporary Living Art Master Selling Canvas at Sotheby's for $15M"),
        ("올림픽 개막식 성화 점화 특수효과 및 불꽃놀이 총괄 예술감독", "Olympic Opening Ceremony Cauldron Lighting Pyro Artistic Director"),
        ("미국 브로드웨이 뮤지컬 흥행 1위 오리지널 극본가 겸 총괄 프로듀서", "Broadway #1 Box-Office Musical Playwright & Executive Producer"),
        ("골프 마스터스 토너먼트 그린 재킷 제작 런던 맞춤 테일러", "Masters Tournament Green Jacket Bespoke Master Tailor"),
        ("글로벌 음원 스트리밍 플랫폼 플레이리스트 1번 트랙 선정 총괄 큐레이터", "Global Music Streaming Platform Playlist Track #1 Head Curator"),
        ("헐리우드 블록버스터 히어로 영화 메인 테마 오케스트라 영화음악 거장", "Hollywood Superhero Blockbuster Grand Orchestral Score Composer"),
        ("세계 최고의 패션위크 샤넬·구찌 피날레 런웨이 총괄 무대 연출가", "Fashion Week Haute Couture Grand Finale Runway Stage Director"),
        ("메이저리그 명예의 전당 입성 레전드 전담 자서전 대필 작가", "MLB Hall of Fame Legend Personal Ghostwriter & Biographer"),
        ("글로벌 게임 명예의 전당 등극 e스포츠 구단 총괄 단장 겸 구단주", "Global Esports Hall of Fame Championship Team Owner & GM"),
        ("전 세계 억만장자 전용 파파라치 차단 드론 쉴드 운용 책임자", "Celebrity Anti-Paparazzi Drone Shield Security System Director"),
        ("롤링스톤지 선정 역사상 가장 위대한 록밴드 전담 기타 테크니션", "Rolling Stone Top 10 Rock Band Lead Guitar Rig Technician"),
        ("NBA 파이널 결승전 코트사이드 1열 좌석 VVIP 전담 호스트", "NBA Finals Courtside Row 1 Celebrity VIP Executive Host"),
        ("베니스 비엔날레 한국관 총괄 큐레이터 겸 국제 아트페어 디렉터", "Venice Biennale Head Curator & Global Art Fair Director"),
        ("헐리우드 최고 스타들의 아카데미 시상식 레드카펫 턱시도 스타일리스트", "Academy Awards Red Carpet A-List Tuxedo & Gown Head Stylist")
    ]
]

TIER_14_FICTION = [
    (title, en_title,
     "헐리우드 블록버스터 히어로 본부 및 판타지 명장", "Hollywood Hero Sanctuaries & Mythic Weapon Masters",
     "연봉 아다만티움 골드 바 10개 + 히어로 인증 배지", "10 Adamantium Gold Ingots + Official Hero Badge/year",
     f"{title}로서 어벤져스와 저스티스 리그, 판타지 명작 영화 속 최정상급 인물들을 전담 보좌합니다. 토니 스타크의 말리부 저택 AI를 튜닝하고 배트맨의 배트케이브 슈퍼카를 관리합니다. 세계를 구하는 히어로들의 가장 든든한 파트너로 활약합니다.",
     f"Directs the technical might of the greatest fictional heroes and superhero headquarters as a {en_title}. Tunes Jarvis for Tony Stark, polishes Batmobiles, and manages S-Class hero rosters.",
     "아이언맨과 배트맨의 지갑을 열고 히어로들의 슈퍼카와 장비를 총괄하는 수석 파트너!",
     "The master technician tuning super-suits and Batmobiles for billionaire heroes!")
    for title, en_title in [
        ("토니 스타크(아이언맨) 말리부 저택 AI 자비스 유머 감각 튜닝 엔지니어", "Tony Stark Malibu Estate JARVIS Humor & Sarcasm Calibration Engineer"),
        ("브루스 웨인(배트맨) 배트케이브 슈퍼카 광택 및 비밀통로 총괄 집사", "Bruce Wayne Batcave Batmobile Ceramic Coating & Secret Route Butler"),
        ("원펀맨 히어로 협회 S급 히어로 연봉 협상 및 피해 보상 전담 에이전트", "One-Punch Man Hero Association S-Class Salary Negotiation Chief Agent"),
        ("캡틴 아메리카 비브라늄 방패 도색 및 탄성 계수 측정 장인", "Captain America Vibranium Shield Kinetic Recoil & Painting Artisan"),
        ("토르 묠니르 망치 손잡이 최고급 아스가르드 가죽 끈 교체사", "Thor Mjolnir Hammer Handle Fine Asgardian Leather Strap Replacer"),
        ("스파이더맨 거미줄 발사기(웹슈터) 특허 출원 및 액체 탄성 연구원", "Spider-Man Web-Shooter Fluid Viscosity & Patent Attorney Chemist"),
        ("해리포터 퀴디치 월드컵 골든 스니치 비행 궤적 세팅 마법사", "Quidditch World Cup Golden Snitch Flight Dynamics Charm Enchanter"),
        ("보헤미안 랩소디 프레디 머큐리 마이크 스탠드 황금 도금사", "Freddie Mercury Half-Mic Stand 24K Gold Plating Craftsman"),
        ("록키 발보아 계단 조깅 전담 생계란 5개 쉐이크 바텐더", "Rocky Balboa Museum Steps 5-Raw-Egg Morning Protein Shake Bartender"),
        ("탑건 매버릭 F-14 톰캣 헬멧 쿨한 선글라스 흠집 제거사", "Top Gun Maverick Aviator Sunglasses Micro-Scratch Buffer Specialist"),
        ("분노의 질주 도미닉 토레토 가족 식사 바베큐 그릴 전담 마스터", "Fast & Furious Dominic Toretto Family Backyard Barbecue Grill Master"),
        ("매드맥스 분노의 도로 불뿜는 빨간 내복 기타리스트 전담 앰프 튜너", "Mad Max Fury Road Doof Warrior Flame-Throwing Guitar Amp Technician"),
        ("킹콩 엠파이어 스테이트 빌딩 꼭대기 발판 미끄럼 방지 패드 시공사", "King Kong Empire State Building Spire Anti-Slip Footing Grip Installer"),
        ("쥐라기 공원 T-렉스 식사 시간 염소 크레인 원격 조종 기사", "Jurassic Park T-Rex Feeding Enclosure Goat Crane Remote Operator"),
        ("나이트메어 프레디 크루거 손톱 칼날 5연발 숫돌 연마 장인", "A Nightmare on Elm Street Freddy Krueger Razor Glove Whetsmith"),
        ("터미네이터 T-800 가죽 자켓 방탄 코팅 및 샷건 리로드 코치", "Terminator T-800 Leather Jacket Kevlar Sprayer & Shotgun Flip-Coach"),
        ("트랜스포머 옵티머스 프라임 범퍼 크롬 광택 및 엔진오일 교환사", "Optimus Prime Western Star Truck Chrome Polish & Synthetic Oiler"),
        ("퍼시픽 림 예거 로봇 신경망 접속(드리프트) 뇌파 동기화 조율사", "Pacific Rim Jaeger Pilot Neural Drift Synapse Calibration Neuro-Tech"),
        ("고스트버스터즈 양성자 팩 방사능 누출 차단 밸브 수석 정비관", "Ghostbusters Proton Pack Radiation Containment Field Chief Tech"),
        ("백 투 더 퓨처 드로리안 타임머신 1.21 기가와트 플루토늄 충전사", "Back to the Future DeLorean 1.21 Gigawatt Flux Capacitor Loader"),
        ("인디아나 존스 굴러오는 거대 원형 바위 속도 조절 트랩 엔지니어", "Indiana Jones Ancient Temple Rolling Boulder Velocity Trap Rig Tech"),
        ("미션 임파서블 톰 크루즈 부르즈 할리파 외벽 등반 흡착 장갑 배터리 검수관", "Mission Impossible Burj Khalifa Climbing Geckoglove Battery Inspector"),
        ("캐리비안의 해적 잭 스패로우 나침반 북쪽 거부 자이로스코프 수리공", "Captain Jack Sparrow Desired-Direction Compass Gyro Horologist"),
        ("반지의 제왕 레골라스 화살 깃털 엘프 실크 공기역학 디자이너", "Lord of the Rings Legolas Arrow Elven Fletching Aerodynamicist"),
        ("스타워즈 요다 900년 묵은 지팡이 옹이 왁스칠 전담 제다이 수습생", "Jedi Master Yoda 900-Year Gimer Stick Knot Waxing Padawan")
    ]
]

# ==========================================
# TIER 15: 초호화 슈퍼리치·억만장자 VIP 전담 디렉터 (700..749)
# ==========================================

TIER_15_REAL = [
    (title, en_title,
     "2024년 모나코·두바이·스위스 슈퍼리치 패밀리 오피스", "2024, Monaco, Dubai & Swiss Billionaire Family Offices",
     "연봉 100억 원 ~ 300억 원 (수조 원대 자산 수수료 & 전용기 제공)",
     "$8 Million - $25 Million/year (Asset Commission & Private Jet Access)",
     f"{title}로서 전 세계 상위 0.001% 슈퍼리치와 로열패밀리의 은밀한 일상을 책임집니다. 5,000억 원대 슈퍼요트와 순금 전용기, 카리브해 무인도 거래를 지휘하며 상상을 초월하는 보수를 받습니다. 억만장자들의 절대적인 신뢰를 받는 그림자 최고 권력자로 활약합니다.",
     f"Orchestrates ultra-luxury empires for the top 0.001% royals and titans as a {en_title}. Commands $400M mega-yachts, custom gold jumbo jets, private islands, and subterranean vaults.",
     "억만장자들이 고개 숙이며 모셔가는 지구상 가장 화려한 초호화 VIP 전담 디렉터!",
     "The gatekeeper of supreme luxury serving multi-billionaire dynasties on unlimited budgets!")
    for title, en_title in [
        ("모나코 5,000억 슈퍼요트 시운전 및 샴페인 거품 감별 캡틴", "Monaco $400M Mega-Yacht Sea Trials Master & Champagne Captain"),
        ("두바이 왕족 전용 순금 보잉 747 프라이빗 제트기 수석 기장", "Dubai Royal Family Solid Gold Boeing 747 Head Flight Captain"),
        ("에르메스 히말라야 버킨백 글로벌 VVIP 연간 3개 배정 총괄 디렉터", "Hermès Himalaya Birkin Global VVIP 3-Per-Year Allocator Director"),
        ("카리브해 억만장자 프라이빗 무인도 섬 매매 전문 수석 브로커", "Caribbean Billionaire Private Atoll Island Super-Broker"),
        ("페라리·부가티 한정판 100억 하이퍼카 구매 자격 심사위원장", "Ferrari & Bugatti Limited Edition $8M Hypercar Vetting Chairman"),
        ("스위스 제네바 자유무역항 10조 원 미술품 수장고 총지배인", "Geneva Free Port $8B Fine Art Subterranean Vault Governor"),
        ("런던 버킹엄궁 공식 납품 왕실 조달 보증서 발급 위원장", "Buckingham Palace Royal Warrant Holder Vetting Committee Head"),
        ("세계 최고의 사설 용병단 억만장자 납치 방지 경호 총사령관", "Elite Private Military VIP Kidnap Prevention Commander"),
        ("미국 베벌리힐스 1,000억 저택 프라이빗 자산 총괄 집사", "Beverly Hills $80M Mega-Mansion Major-Domo & Estate Director"),
        ("모나코 몬테카를로 카지노 VVIP 살롱 프리베 100억 칩 전담 환전 지배인", "Monte Carlo Casino Salons Privés $10M High-Roller Cashier GM"),
        ("롤스로이스 비스포크 세상에 단 한 대 코치빌드 총괄 디자이너", "Rolls-Royce Bespoke Coachbuild One-of-a-Kind Lead Designer"),
        ("스위스 생모리츠 설원 위 스노우 폴로 월드컵 VVIP 라운지 총괄 호스트", "St. Moritz Snow Polo World Cup VVIP Chateaux Host"),
        ("파리 리츠 호텔 1박 4,000만 원 임페리얼 스위트 전담 버틀러", "Hôtel Ritz Paris $30,000/Night Imperial Suite Head Butler"),
        ("세계 최대 다이아몬드 드비어스 원석 채굴권 비공개 입찰 위원", "De Beers Global Rough Diamond Private Tender Commissioner"),
        ("억만장자 패밀리 오피스 5조 원 글로벌 자산 배분 수석 CIO", "Multi-Billionaire Family Office $4B Global Asset Chief Investment Officer"),
        ("프랑스 코트다쥐르 지중해 절벽 별장 전용 헬리패드 착륙 통제관", "Côte d'Azur Mediterranean Cliff Villa Helipad Air Controller"),
        ("뉴욕 센트럴파크 뷰 펜트하우스 4개 층 통합 인테리어 총괄 아키텍트", "Central Park 4-Floor Quadplex Penthouse Master Architect"),
        ("카타르 왕실 소장 미술품 2조 원 컬렉션 인수 수석 어드바이저", "Qatar Royal Family $1.5B Fine Art Acquisition Senior Advisor"),
        ("세계 슈퍼요트 협회 100m 이상 기가요트 정박 선석 배정 총재", "Superyacht Association 100m+ Gigayacht Prime Berth Commodore"),
        ("스위스 최고급 기숙학교 르 로제 입학 심사 및 로열패밀리 인터뷰 위원", "Institut Le Rosey Royal & Dynasty Admissions Vetting Dean"),
        ("억만장자 전용 지하 방공호 럭셔리 벙커 시공 프로젝트 총괄", "Billionaire Subterranean 5-Star Nuclear Bunker Master Builder"),
        ("미국 아스펜 스키 리조트 프라이빗 슬로프 독점 이용권 브로커", "Aspen Luxury Ski Resort Private Peak Slope Rights Broker"),
        ("런던 메이페어 300년 전통 회원제 프라이빗 클럽 회원 자격 심사관", "Mayfair 300-Year Heritage Gentleman's Club Admissions Warden"),
        ("싱가포르 최대 패밀리 오피스 싱글 헤지펀드 조세 회피 구조 설계자", "Singapore Prime Family Office Sovereign Tax Haven Architect"),
        ("모나코 요트 클럽 회장 전용 만찬 테이블 은식기 24K 순금 도금사", "Yacht Club de Monaco Commodore Dinner Service 24K Gold Electroplater")
    ]
]

TIER_15_FICTION = [
    (title, en_title,
     "비밀 조직 및 판타지 왕실 최고 금고", "Secret Societies & Sovereign High Vaults",
     "연봉 고블린 순금 금화 10,000닢 + 비밀 결계석", "10,000 Goblin Pure Gold Coins + Warded Keystone/year",
     f"{title}로서 그린고트 마법사 은행의 용 금고부터 콘티넨탈 호텔의 금화 창고까지, 판타지 암흑가와 왕실의 최상위 비밀 자산을 총괄합니다. 킹스맨의 방탄 수트와 개츠비의 대저택 파티를 총괄하며 지하 세계의 평화와 균형을 수호합니다.",
     f"Commands sovereign vaults and covert shadow banking empires of fictional lore as a {en_title}. Oversees dragon-guarded vaults in Gringotts, assassin coinage in the Continental, and Kingsman armories.",
     "해리포터와 존 윅도 함부로 건드리지 못하는 지하 세계 최상위 금고의 지배자!",
     "The supreme custodian of ancient vaults, dragon treasuries, and assassin empires!")
    for title, en_title in [
        ("해리포터 그린고트 마법사 은행 최심부 드래곤 금고 총괄 지점장", "Gringotts Wizarding Bank Deepest Dragon Vault Grand Goblin Master"),
        ("존 윅 컨티넨탈 호텔 순금 코인 주조 및 암살자 스위트룸 총지배인", "John Wick Continental Hotel Gold Coin Mint & Assassin Suite GM"),
        ("킹스맨 양복점 지하 비밀 무기고 및 방탄 수트 맞춤 수석 재단사", "Kingsman Tailor Underground Arsenal & Bulletproof Bespoke Master"),
        ("위대한 개츠비 롱아일랜드 저택 매일 밤 10,000명 샴페인 파티 총괄 디렉터", "The Great Gatsby Long Island 10,000-Guest Champagne Revelry Director"),
        ("스크루지 맥덕 순금 금화 다이빙 수영장 수질 정화 및 광택 잠수부", "Scrooge McDuck Money Bin Solid Gold Coin Pool Filtration Diver"),
        ("나니아 연대기 마법 옷장 너머 눈의 여왕 썰매 벨벳 시트 관리인", "Chronicles of Narnia White Witch Sleigh Crimson Velvet Steward"),
        ("신비한 동물사전 뉴트 스캐맨더 가죽 가방 속 마법 생태계 총지배인", "Fantastic Beasts Newt Scamander Magical Leather Suitcase Habitat Warden"),
        ("모노폴리 보드게임 부자 아저씨 황금 모자 및 지팡이 전담 광택사", "Rich Uncle Pennybags Monopoly Top Hat & Golden Cane Polisher"),
        ("아바타 나비족 성스러운 영혼의 나무 부족 평화 조약 수석 중개관", "Avatar Na'vi Tree of Souls Sacred Valley Peace Treaty Ambassador"),
        ("닥터 스트레인지 생텀 생토럼 마법 유물 먼지 털기 및 결계 관리인", "Doctor Strange Sanctum Sanctorum Relic Dusting & Barrier Warder"),
        ("메트릭스 오라클 쿠키 굽기 및 예언 번호표 배부 수석 비서", "Matrix Oracle Kitchen Fresh Cookie Baker & Prophecy Ticket Clerk"),
        ("맨 인 블랙 뉴욕 본부 기억소거장치(뉴럴라이저) 배터리 충전관", "Men in Black MIB HQ Neuralyzer Flash Tube Battery Charger"),
        ("알리바바와 40인의 도적 '열려라 참깨' 음성인식 석문 보안 엔지니어", "Ali Baba Open Sesame Voice-Recognition Cavern Door Acoustic Engineer"),
        ("오즈의 마법사 에메랄드 시티 황금 벽돌길 다이아몬드 줄눈 시공사", "Wizard of Oz Emerald City Yellow Brick Road Diamond Grout Mason"),
        ("반지의 제왕 리벤델 엘론드 경 만찬실 은쟁반 반사광 조율사", "Rivendell Lord Elrond Feast Hall Silverware Ambient Light Aligner"),
        ("원피스 천룡인 샤본디 제도 거품 산책로 비눗방울 탄성 유지관", "One Piece Celestial Dragon Sabaody Bubble Walkway Elasticity Warden"),
        ("강철의 연금술사 아메스트리스 국군 대총통 집무실 탁자 왁스칠 당번", "Fullmetal Alchemist Führer Bradley Grand Mahogany Desk Waxer"),
        ("블리치 소울 소사이어티 46실 판결문 황금 깃펜 잉크 조제관", "Bleach Central 46 Judgment Golden Quill Spirit-Ink Brewer"),
        ("헌터X헌터 요크신 시티 지하 경매장 경매품 특수 밀봉 금고장", "Hunter x Hunter Yorknew City Underground Auction Vault Keeper"),
        ("원펀맨 무면허 라이더 정의의 자전거 체인 최고급 윤활유 도포사", "One-Punch Man Mumen Rider Justice Bicycle Fine Synthetic Oiler"),
        ("길가메시 왕 바빌론 보물고(게이트 오브 바빌론) 무기 재고 전수조사관", "King Gilgamesh Gate of Babylon Infinite Armory Inventory Auditor"),
        ("페이트 제로 토오사카 토키오미 우아한 와인잔 스템 각도 측정사", "Fate/Zero Tohsaka Tokiomi Elegant Wine Glass Stem Angle Inspector"),
        ("죠죠 디오 브란도 이집트 카이로 저택 암막 커튼 100% 암전 시공기사", "JoJo DIO Cairo Mansion 100% Light-Blocking Blackout Drape Installer"),
        ("은혼 에도성 쇼군 전용 팬티 황금 실크 자수 장인", "Gintama Edo Castle Shogun Imperial Silk Underwear Embroiderer"),
        ("닥터 후 타디스 타임머신 내부 카멜레온 서킷 콘솔 레버 윤활사", "Doctor Who TARDIS Interior Chameleon Circuit Console Lever Lubricator")
    ]
]

print("Tiers 11 to 15 successfully loaded.")
