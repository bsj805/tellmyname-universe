# -*- coding: utf-8 -*-
"""
Tiers 6 to 10 (Levels 250 to 499, 250 items)
Tier 6: 극한 기상·재난 현장 중계 (250..299)
Tier 7: 황당한 길거리 장사·무모한 상인 (300..349)
Tier 8: 영혼 갈리는 블랙기업·야근 지옥 (350..399)
Tier 9: 아찔한 고소작업·극한 수리공 (400..449)
Tier 10: 폭망의 끝자락·아슬아슬 생계형 (450..499)
"""

# ==========================================
# TIER 6: 극한 기상·재난 현장 중계 (250..299)
# ==========================================

TIER_6_REAL = [
    # 250 (Iconic required)
    ("대설특보 광화문에서 머리 위 눈이 30cm 쌓인 채 생방송 인터뷰하는 박대기 기자",
     "Snowstorm Special News Reporter Standing in Blizzard with 30cm of Snow on Head",
     "2010년 1월 4일 서울 중구 세종대로 대설경보 아침 7시 생방송",
     "January 4, 2010, Heavy Snow Warning Broadcast at 7 AM, Gwanghwamun, Seoul",
     "연봉 1,400만 원 + 평생 무료 방한 귀도리 및 핫팩 무한 리필",
     "$14,000/year + Lifetime Free Earmuffs & Unlimited Hand Warmers",
     "체감온도 영하 20도 폭설 속에서 정수리에 눈이 30cm 쌓여 눈사람이 될 때까지 마이크를 잡고 '눈이 점점 더 많이 내리고 있습니다'를 생중계합니다. 카메라 감독님과 함께 광화문 광장의 살아있는 빙설 조각상으로 박제됩니다.",
     "Stands firm in sub-zero blizzard until 30cm of snow piles on the head, broadcasting live news as a living snowman. Freezes on live television alongside the camera operator as a national monument.",
     "직업정신 하나로 온몸이 얼어붙어도 뉴스를 전하는 대한민국 레전드 기자! 눈보라 속에서도 꺾이지 않는 불굴의 눈사람입니다.",
     "A legendary reporter embodying pure dedication, turning into a living ice statue to report the storm!"),
] + [
    (title, en_title, "2024년 극한 기상 재난 현장 취재선", "2024, Extreme Weather Disaster Reporting Line",
     "연봉 1,500만 원 (방한복 및 감기약 무상 지원)", "$13,000/year (Thermal Parka & Cold Meds Covered)",
     f"{title}로서 시속 150km 강풍과 폭설, 폭우 속에서도 마이크를 놓지 않고 현장 속보를 전합니다. 우산이 3초 만에 찢어지고 카메라 렌즈에 물보라가 쳐도 시청자들의 안전을 위해 목청껏 소리칩니다. 방송이 끝나면 얼어붙은 손가락을 핫팩으로 녹입니다.",
     f"Broadcasts live breaking reports in howling 150km/h gales and blizzards as a {en_title}. Umbrellas shred within 3 seconds, yet screams into the mic so viewers stay safe, thawing frozen fingers afterward.",
     "자연재해의 한가운데서 온몸을 던져 뉴스를 전하는 불굴의 현장 저널리즘 정신!",
     "Sacrificing life and limb in natural disasters to deliver live news—journalistic dedication!")
    for title, en_title in [
        ("시속 150km 태풍 매미 한가운데서 뒤집힌 우산 들고 날아가는 기상 리포터", "Typhoon Maemi 150km/h Wind Inverted Umbrella Blown-Away Reporter"),
        ("섭씨 50도 폭염 아스팔트 위에서 계란프라이 익나 3시간 생중계하는 VJ", "50C Asphalt Heatwave 3-Hour Fried Egg Frying Live VJ"),
        ("미국 오클라호마 토네이도 추적 트럭 지붕에 매달려 카메라 잡은 촬영 감독", "Oklahoma Tornado Chase Truck Roof Camera Operator"),
        ("아이슬란드 화산재 폭우 속에서 카메라 렌즈 수건으로 닦는 보도국 막내", "Icelandic Volcanic Ash Rain Camera Lens Wiping Junior Cameraman"),
        ("영하 35도 철원 전방에서 바나나로 못 박기 시연하다 손가락 언 기자", "Minus 35C Frozen Banana Nail Hammering Demo Cold Reporter"),
        ("집중호우 강남역 침수 현장 보트 타고 노 저으며 뉴스 진행하는 앵커", "Gangnam Station Flood Rubber Boat Rowing Live News Anchor"),
        ("사하라 모래폭풍 속에서 선글라스 벗겨진 채 마이크 잡은 특파원", "Sahara Desert Sandstorm Blown-Off Sunglasses Live Correspondent"),
        ("알래스카 빙하 붕괴 파도 앞에서 방수 마이크 들고 소리 지르는 현장 취재팀", "Alaska Glacier Calving Tsunami Wave Screaming Reporter"),
        ("폭설로 고속도로 20시간 고립된 버스 안에서 승객들 인터뷰하는 기자", "Highway Blizzard 20-Hour Stranded Bus Passenger Interviewer"),
        ("캘리포니아 대형 산불 연기 속에서 방독면 쓰고 산불 속보 전하는 현장 기자", "California Wildfire Heavy Smoke Gas Mask Live Reporter"),
        ("해운대 10m 너울성 파도 방파제 위에서 구명조끼 입고 버티는 생방송 리포터", "Haeundae 10m Swell Wave Breakwater Lifejacket Live Reporter"),
        ("영하 40도 시베리아 야쿠츠크 노천 시장 얼어붙은 생선 들고 인터뷰하는 VJ", "Minus 40C Yakutsk Market Frozen Fish Wielding Live VJ"),
        ("대구 아프리카급 폭염 도로 위 살수차 뒤꽁무니 따라가며 취재하는 신입 기자", "Daegu Extreme Heatwave Water Tank Truck Chasing Rookie Reporter"),
        ("태풍 볼라벤 순간 최대 풍속에 간판 날아가는 거리에서 전신주 붙잡은 리포터", "Typhoon Bolaven Flying Signboard Telephone Pole Clutching Reporter"),
        ("강원도 미시령 고개 1미터 폭설 속 제설차 조수석에서 밤샘 취재하는 기자", "Misiryeong Pass 1m Snow Snowplow Cab Overnight Reporter"),
        ("황사 미세먼지 수치 1,000 돌파한 날 남산타워 안 보인다고 손짓하는 취재원", "Fine Dust Index 1,000 Invisible Namsan Tower Gesturing Reporter"),
        ("필리핀 슈퍼태풍 하이옌 상륙 해안가에서 헬멧 쓰고 바람 맞으며 중계하는 특파원", "Philippine Super Typhoon Haiyan Coastal Gale Helmeted Correspondent"),
        ("경주 지진 발생 순간 천장 조명 흔들리는 스튜디오에서 차분한 척 브리핑하는 아나운서", "Gyeongju Earthquake Trembling Studio Shaking Chandelier Anchor"),
        ("장마철 소양강댐 수문 개방 물보라 폭포 앞에서 우비 찢어진 채 외치는 기자", "Soyang Dam Floodgate Torrent Water Spray Shredded Raincoat Reporter"),
        ("섭씨 45도 인도 뉴델리 폭염 속 녹아내린 횡단보도 아스팔트 밟으며 중계하는 특파원", "New Delhi 45C Melted Crosswalk Asphalt Stepping Live Correspondent"),
        ("제주 백록담 칼바람 속에서 꽁꽁 언 삼각김밥 베어 물며 날씨 전하는 기상캐스터", "Jeju Hallasan Peak Icy Gale Frozen Onigiri Biting Weathercaster"),
        ("폭우로 불어난 탄천 주차장 침수 차량 위로 대피하며 스마트폰 라이브 켠 시민기자", "Flooded Tancheon Parking Lot Car Roof Evacuated Citizen Streamer"),
        ("북미 한파 체감 영하 50도 나이아가라 얼어붙은 폭포 앞에서 마이크 얼어붙은 기자", "Niagara Falls -50C Polar Vortex Frozen Microphone Reporter"),
        ("도심 우박 폭우에 헬멧 두들겨 맞으며 골프공만 한 얼음 주워 보여주는 리포터", "Golf-Ball Hailstorm Smashing Helmet Live Demonstration Reporter")
    ]
]

TIER_6_FICTION = [
    (title, en_title, "재난 영화 및 판타지 대혼돈 현장 특파 본부", "Disaster Movie & Fantasy Calamity Field Desk",
     "연봉 방수 방염 마이크 1자루 + 종합 감기약 1통", "1 Waterproof Fireproof Mic + 1 Cold Medicine Pack/year",
     f"{title}로서 판타지 용암 분출과 괴수의 발길질, 슈퍼 태풍과 좀비 아포칼립스 속에서도 시청률 1위를 위해 카메라 앵글을 유지합니다. 헬멧 위로 파편이 튀고 거센 비바람이 몰아쳐도 마이크를 꼭 쥐고 생방송을 이어갑니다.",
     f"Broadcasts fantasy eruptions, kaiju rampages, and monster calamities live as a {en_title}. Holds camera angles steady amid debris and torrential gales for top ratings until signals fade.",
     "세상이 무너지는 극한의 재난 속에서도 마이크를 놓지 않는 불굴의 현장 특파원!",
     "Clutching microphones to deliver closing lines even amid monstrous storms—legendary disaster reporter!")
    for title, en_title in [
        ("고질라 발바닥 바로 밑에서 강남 아파트 시세 폭락 속보 전하는 아나운서", "Godzilla Stomp Zone Real Estate Crash Live Breaking Anchor"),
        ("판타지 용암 분출 활화산 바로 앞에서 삼겹살 굽는 모험가 인터뷰하는 리포터", "Active Volcano Lava Edge Barbecue Adventurer Interviewer"),
        ("영화 투모로우 뉴욕 빙하기 영하 50도 자유의 여신상 코트 입혀주기 취재 기자", "The Day After Tomorrow Sub-Zero Statue of Liberty Reporter"),
        ("판타지 메테오 낙하 현장 날아오는 화염 운석 피하며 속보 전하는 마법 통신병", "Fantasy Meteor Bombardment Dodging Arcane Signal Courier"),
        ("영화 트위스터 시속 300km F5 토네이도 중심에서 날아가는 젖소 생중계하는 기상캐스터", "Twister 300km/h F5 Tornado Flying Cow Live Weathercaster"),
        ("사이버펑크 메가시티 산성비 홍수 속에서 네온사인 감전 위험 알리는 AI 앵커", "Cyberpunk Megacity Acid Rain Flood Neon Shock Warning AI Anchor"),
        ("좀비 아포칼립스 한복판 바리케이드 위에서 해적 방송으로 생존자 안내하는 DJ", "Zombie Apocalypse Barricade Pirate Radio Survival Guide DJ"),
        ("해저도시 수압 붕괴 경보 울리는 통제실에서 침착하게 마지막 방송하는 아나운서", "Sub-Oceanic City Hull Breach Alarm Final Calm Broadcast Anchor"),
        ("좀비 무리가 방송국 스튜디오 문 부수는 라이브 현장에서 클로징 멘트 치는 앵커", "Zombie Horde Smashing Studio Glass Live Signoff Anchor"),
        ("판타지 냉기 드래곤 브레스 맞아 얼음 조각상 되어가며 날씨 전하는 엘프 리포터", "Frost Dragon Breath Freezing Into Ice Statue Elf Weathercaster"),
        ("쥐라기 공원 랩터 우리 철창 앞에서 마이크 손에 쥐고 오들오들 떠는 인턴 기자", "Jurassic Park Raptor Cage Trembling Microphone Intern Reporter"),
        ("지옥불 용암 분출 축제 현장에서 오징어 굽는 도깨비들 인터뷰하는 리포터", "Hellfire Lava Eruption Festival Goblin Barbecue Interviewer"),
        ("거대 메갈로돈 상어 턱 바로 앞에서 수중 태풍 생중계하는 다이버 리포터", "Giant Megalodon Shark Jaw Underwater Typhoon Live Diver Reporter"),
        ("타임머신 폭주로 조선시대와 미래가 뒤섞인 광화문 교차로 실시간 교통 리포터", "Time Rift Anomaly Mingled Timeline Gwanghwamun Traffic Caster"),
        ("거대 괴수와 거대 로봇 격투 현장 빌딩 옥상에서 팝콘 먹으며 중계하는 해설자", "Giant Mecha vs Kaiju Rooftop Popcorn Eating Fight Commentator"),
        ("설국열차 앞바퀴 얼음 두께 30미터 영하 70도 눈보라 속에서 속보 전하는 기자", "Snowpiercer Engine Front Wheel 30m Ice Blizzard Live Reporter"),
        ("판타지 마왕군 총진격 나팔 소리 속에서 도망치는 모험가들 소감 묻는 기자", "Demon Lord Grand Assault Fleeing Adventurer Interviewer"),
        ("슈퍼 태풍 매미 100배 돌풍 속에서 가로수 끌어안고 날아갈 뻔한 기상캐스터", "Super Typhoon 100x Gale Hugging Street Tree Weathercaster"),
        ("나노머신 안개 바이러스 살포 구역에서 해독제 주사기 들고 방송하는 리포터", "Nanomachine Fog Outbreak Syringe Holding Live Reporter"),
        ("마법학교 퀴디치 경기장 번개 폭풍 속에서 날아다니는 빗자루 중계방송 캐스터", "Quidditch Lightning Storm Flying Broom Play-by-Play Announcer"),
        ("차원 균열로 하늘에서 거대 고래가 떨어지는 현장 생중계하는 기상캐스터", "Dimensional Rift Sky-Falling Whale Storm Weathercaster"),
        ("고담시 조커 독가스 풍선 터지는 광장에서 방독면 쓰고 속보 전하는 TV 앵커", "Gotham Joker Gas Balloon Square Gasmask Live Breaking TV Anchor"),
        ("판타지 엘프 숲 산불에 세계수 불타는 현장에서 눈물 흘리며 생방송하는 요정 VJ", "Burning World Tree Wildfire Weeping Pixie Live Streamer"),
        ("가상현실 매트릭스 서버 다운 카운트다운 속에서 접속자 인터뷰하는 아바타 기자", "VR Matrix Shutdown 10-Second Countdown Avatar Interviewer"),
        ("백두산 천지 화산 폭발 잿더미 속에서 화산재 마스크 쓰고 중계하는 현장 취재반장", "Baekdu Mountain Ash Cloud Volcanic Mask Live Reporter Chief")
    ]
]

# ==========================================
# TIER 7: 황당한 길거리 장사·무모한 상인 (300..349)
# ==========================================

TIER_7_REAL = [
    (title, en_title, "2024년 세계 이색 상권 현장", "2024, Bizarre Global Street Market",
     "연봉 1,800만 원 (재고 99% 현물 지급)", "$15,000/year (99% Unsold Stock Barter)",
     f"{title}로서 아무도 사지 않는 장소에서 황당한 물건을 팔기 위해 목청을 돋웁니다. 파리만 날리는 가판대 앞에서 지나가는 손님들에게 애절한 눈빛을 보내지만 지갑을 여는 사람은 없습니다. 매일 밤 팔리지 않은 재고 박스에 둘러싸여 한숨을 쉽니다.",
     f"Pitches absurd merchandise in the world's most improbable locations as a {en_title}. Begs uninterested passersby under sweltering or freezing skies, crying over unsold crates nightly.",
     "수요와 공급의 경제학 법칙을 정면으로 거스르는 무모한 이색 길거리 장사꾼!",
     "Defying basic laws of supply and demand—the world's most recklessly stubborn street vendor!")
    for title, en_title in [
        ("사하라 사막 한가운데서 뜨거운 핫팩 파는 보부상", "Sahara Desert Hot Hand-Warmer Pack Peddler"),
        ("북극 그린란드 이글루 마을 방문 냉장고 외판원", "Greenland Arctic Igloo Village Door-to-Door Refrigerator Salesman"),
        ("사하라 모래바람 속 털장갑 노점상", "Sahara Sandstorm Thick Woolen Mittens Street Vendor"),
        ("하와이 와이키키 해변 두꺼운 오리털 패딩 재고떨이 상인", "Waikiki Beach Heavy Down Parka Liquidation Merchant"),
        ("아마존 밀림 모기장 없는 그물침대 판매원", "Amazon Jungle Mosquito-Net-Free Hammock Vendor"),
        ("대동강 얼음 깨고 찬물 파는 현대판 봉이 김선달", "Daedong River Frozen Water Chipping Cold Cup Merchant"),
        ("지하철 1호선 만능 효자손 500원 떨이 장수", "Seoul Subway Line 1 Backscratching Bamboo Wand Peddler"),
        ("동대문 새벽 시장 짝짝이 양말 골라잡기 10켤레 천 원 상인", "Dongdaemun Night Market Mismatched Socks 10-Pairs Bargain Vendor"),
        ("종로 귀금속 상가 앞 가짜 황금 도금 반지 3천 원 외판원", "Jongno Fake Gold-Plated Ring 3-Dollar Street Peddler"),
        ("남대문 시장 절대 안 벗겨진다는 페이크 덧선 묶음 장수", "Namdaemun Non-Slip Ankle Socks Miracle Bundler"),
        ("전국 5일장 만병통치약 지네 가루 파는 약장수 조수", "Rural 5-Day Fair Centipede Cure-All Powder Pitchman"),
        ("한강 둔치 한겨울 영하 15도 얼음 팥빙수 노점상", "Han River Midwinter -15C Shaved Ice Dessert Vendor"),
        ("부산 자갈치 시장 살아있는 갯지렁이 종이컵 소분 상인", "Busan Jagalchi Live Sandworm Paper Cup Dispenser"),
        ("고속도로 휴게소 뽕짝 메들리 USB 1만 곡 판매 트럭 아저씨", "Highway Rest Stop Trot Medley 10,000 Songs USB Truck Driver"),
        ("제주도 돌하르방 코 만지면 아들 낳는 부적 파는 기념품상", "Jeju Dol Hareubang Nose Touching Son-Charm Souvenir Seller"),
        ("울릉도 호박엿 가위질 엿가락 리듬 타는 장돌뱅이", "Ulleungdo Pumpkin Taffy Scissor-Snapping Rhythm Hawker"),
        ("인천 차이나타운 행운의 포춘쿠키 속에 로또 번호 적어 파는 상인", "Incheon Chinatown Lotto-Numbered Fortune Cookie Peddler"),
        ("신촌 거리 목소리 커지는 헬륨 풍선 1회 흡입 500원 장수", "Sinchon Street 50-Cent Helium Voice Balloon Dispenser"),
        ("홍대 버스킹 구역 관객 박수 유도용 플라스틱 짝짝이 노점상", "Hongdae Busking Zone Plastic Hand Clapper Hawker"),
        ("명동 외국인 관광객 대상 K-김치 냄새 탈취 캔디 노점상", "Myeongdong K-Kimchi Breath Neutralizing Candy Hawker"),
        ("청량리 경동시장 말린 지네 10마리 묶음 달인", "Gyeongdong Market Dried Centipede Stringing Expert"),
        ("지리산 입구 천연 칡즙 절구 찧으며 쓴맛 시음 권하는 상인", "Jirisan Trailhead Raw Arrowroot Juice Pestle Pounder"),
        ("속초 아바이마을 오징어순대 꼬치 들고 호객하는 앞치마 삼촌", "Sokcho Abai Village Squid Sundae Skewer Street Hawker"),
        ("전주 한옥마을 갓 쓰고 초코파이 파는 이색 보부상", "Jeonju Hanok Village Gat-Wearing Choco-Pie Peddler"),
        ("단양 패러글라이딩 착륙장 멀미약 1알 천 원 노점상", "Danyang Paragliding Landing Zone Motion Sickness Pill Hawker")
    ]
]

TIER_7_FICTION = [
    (title, en_title, "판타지 다차원 암시장 노점가", "Multiverse Fantasy Black Market Alley",
     "연봉 가상 골드 30닢 (환전 불가)", "30 Fantasy Gold Coins (Non-Convertible)/year",
     f"{title}로서 상식 파괴의 기상천외한 마법 물품과 아이템을 노점에서 판매합니다. 드라큘라나 좀비, 괴짜 손님들이 찾아와 진상 흥정을 벌일 때마다 주머니 속 호신용 주문서를 만지작거립니다. 단속반이 뜨면 짐보따리를 싸 들고 차원 포털로 도망칩니다.",
     f"Sells reality-bending magical oddities in cross-dimensional alleyways as a {en_title}. Haggles with vampires, zombies, and quirky monsters while preparing escape portals if market guards raid.",
     "상상할 수 있는 모든 판타지 세계의 틈새시장을 노리는 시공간 보부상!",
     "Peddling enchanted contraband across interdimensional markets—the slyest fantasy peddler!")
    for title, en_title in [
        ("드라큘라 성 앞에서 마늘즙 시음 행사하는 판촉 사원", "Dracula Castle Front Garlic Juice Free Sample Promoter"),
        ("해저도시 아틀란티스 골목길 투명 우비 노점상", "Underwater Atlantis Alleys Clear Raincoat Street Vendor"),
        ("사하라 사막 모래 언덕 얼음 스케이트 대여점 주인", "Sahara Desert Sand Dune Ice Skate Rental Booth Owner"),
        ("불타는 지옥 입구 얼음 팥빙수 배달원", "Gates of Hell Midst Molten Lake Shaved Ice Delivery Imp"),
        ("투명인간 마을 선글라스 노점상", "Invisible Man Village Sunglasses Street Merchant"),
        ("좀비 격리 구역 틀니 세척제 방문판매원", "Zombie Quarantine Zone Denture Cleanser Door-to-Door Salesman"),
        ("마법학교 기숙사 투명 망토 중고 직거래 브로커", "Hogwarts Invisibility Cloak Used Gear P2P Deal Broker"),
        ("사이버펑크 뒷골목 해킹된 기억 칩 1테라 떨이 상인", "Cyberpunk Black Alley 1TB Hacked Memory Chip Hawker"),
        ("판타지 용암 괴물 화상 방지용 방염 냄비 받침 판매원", "Molten Lava Golem Heatproof Pot Mat Peddler"),
        ("판타지 던전 입구 귀환 스크롤 짝퉁 덤터기 장사꾼", "Dungeon Entrance Counterfeit Town Portal Scroll Hustler"),
        ("마왕성 앞 용사 전용 비상구 약도 파는 암상인", "Demon Castle Gate Hero Emergency Exit Blueprint Dealer"),
        ("거인국 소인 전용 돋보기 안경 행상", "Brobdingnag Giant Realm Micro-Human Magnifier Hawker"),
        ("요정 마을 도토리 껍질 투구 노점상", "Pixie Hamlet Acorn Shell Battle Helmet Peddler"),
        ("드래곤 둥지 앞 방화복 1회 대여 렌탈샵 주인", "Dragon Lair Fire-Proof Suit 1-Hour Rental Booth Owner"),
        ("시간여행자 쉼터 과거 로또 당첨 번호 암거래상", "Time Traveler Rest Stop Past Winning Lotto Numbers Dealer"),
        ("유령의 집 귀마개 및 심장마비 방지 부적 판매상", "Haunted House Earmuffs & Cardiac Arrest Talisman Seller"),
        ("에버랜드 티익스프레스 롤러코스터 꼭대기 멀미 봉투 10장 묶음 상인", "T-Express Rollercoaster Peak Vertigo Barf Bag 10-Pack Vendor"),
        ("스폰지밥 비키니시티 건조 오징어포 수중 포장마차", "Bikini Bottom Dried Squid Tentacle Underwater Cart"),
        ("매트릭스 빨간 약 파란 약 반반 섞은 젤리 노점상", "Matrix Red Pill Blue Pill Half-and-Half Gummy Hawker"),
        ("늑대인간 보름달 진정용 개껌 특허 상인", "Werewolf Full Moon Calming Giant Chew-Bone Merchant"),
        ("세이렌 암초 구역 귀청소 면봉 덤터기 장사꾼", "Siren Reef Wax Earplug Cotton Swab Overcharging Hawker"),
        ("메두사 석상 테마파크 선글라스 대여점 사장", "Medusa Stone Garden Heavy Mirror Sunglasses Renter"),
        ("바벨탑 건설 현장 만국어 번역 엿장수", "Tower of Babel Construction Universal Translation Taffy Hawker"),
        ("프랑켄슈타인 묘지 번개 유치용 황동 피뢰침 행상", "Frankenstein Lab Lightning Attracting Brass Rod Hawker"),
        ("무릉도원 신선 전용 복숭아 씨앗 까기 도구 상인", "Shangri-La Taoist Immortal Peach Pit Cracking Tool Vendor")
    ]
]

# ==========================================
# TIER 8: 영혼 갈리는 블랙기업·야근 지옥 (350..399)
# ==========================================

TIER_8_REAL = [
    (title, en_title, "2024년 역삼동 테헤란로 야근 빌딩 14층", "2024, Teheran-ro Gangnam 14th Floor Overtime Cube",
     "연봉 2,400만 원 (포괄임금 24시간 + 야근식대 김밥 1줄)", "$20,000/year (All-Inclusive 24h + 1 Kimbap Overtime Meal)",
     f"{title}로서 밤낮없이 쏟아지는 업무 폭탄과 상사의 갑질 속에 영혼이 탈곡됩니다. 금요일 밤에 날아오는 기습 수정 요청에 눈물을 삼키며 카페인 음료를 들이붓습니다. 모니터 파란 불빛 아래서 퇴사 충동을 누르며 타자를 두드립니다.",
     f"Soul drained dry by relentless workloads and toxic bosses as a {en_title}. Gulping energy drinks at 11:59 PM to meet sudden weekend revisions, crying softly under blue monitor glows.",
     "포괄임금제라는 이름의 합법적 영혼 갈갈이 지옥에서 버티는 K-직장인의 비애!",
     "Surviving the all-inclusive overtime meatgrinder—the exhausted tragedy of the modern office!")
    for title, en_title in [
        ("금요일 밤 11시 59분에 본부장님이 던져준 PPT 수정 노예", "Friday 11:59 PM Executive PPT Emergency Revision Slave"),
        ("명절 고속도로 톨게이트 18시간 정체 구간 영수증 줍기 요원", "Holiday Highway Tollgate 18-Hour Gridlock Receipt Picker"),
        ("무한 엑셀 VLOOKUP 오류 수정 야간 파견직", "Endless Excel VLOOKUP #N/A Error Midnight Contractor"),
        ("24시간 감시카메라 돌아가는 콜센터 1초 대기 상담원", "24/7 CCTV Monitored Call Center 1-Second Queue Rep"),
        ("일요일 아침 단톡방에 등산 공지 올리는 부장님 맞장구 알바", "Sunday 7 AM Boss Group Chat Hiking Notice Hype-Man"),
        ("무선 이어폰 한쪽 잃어버린 고객센터 사죄 전담 사원", "One-Earbud Lost Customer Apology Specialist"),
        ("새벽 2시 서버 터진 게임회사 DB 롤백 당직 개발자", "2 AM Game Server Crash DB Rollback Duty Programmer"),
        ("점심시간 부장님 숟가락 밑에 휴지 깔아주기 전담 막내", "Lunchtime Boss Spoon Napkin Placing Junior Orderly"),
        ("회식자리 삼겹살 뒤집기 및 소맥 황금비율 제조 막내 사원", "Company Dinner Pork Belly Flipping Somaek Ratio Mixer"),
        ("대표이사 골프 비거리 거짓말 맞장구치는 수행 비서", "CEO Golf Drive 300m Exaggeration Agreer Escort"),
        ("고객 불만 리뷰 지우려다 실수로 사장님 댓글 지운 마케터", "Negative Review Deleter Who Erased Owner's Response"),
        ("퇴근 직전 복사기 종이 걸림 에러 코드 33번 수리 막내", "Paper Jam Error 33 Photocopier 5:59 PM Novice Fixer"),
        ("월요일 아침 8시 전사 주간회의 회의록 타자 치는 인턴", "Monday 8 AM Weekly Exec Meeting Minutes Typist Intern"),
        ("사내 메신저 대표님 프로필 사진 바뀔 때마다 좋아요 누르는 직원", "CEO Corporate Messenger Status Change Instant Liker"),
        ("야근 식대 8천 원 한도 맞추려다 7,900원 메뉴만 찾는 대리", "Overtime Meal $8 Cap Calculator Searching $7.90 Menus"),
        ("사무실 냉장고 남의 이름 적힌 우유 몰래 마시다 걸린 사원", "Office Fridge Stolen Labeled Milk Caught Employee"),
        ("대표님 애완견 생일 파티 풍선 불기 차출된 기획팀원", "CEO Pet Poodle Birthday Party Balloon Blower Staff"),
        ("사내 체육대회 대표팀 줄다리기 맨 뒷자리 밧줄 감은 대리", "Company Sports Day Tug-of-War Anchor Weight Deputy"),
        ("연차 신청서 사유란에 '개인 사정' 썼다가 반려당한 사원", "Annual Leave 'Personal Reasons' Denied Application Clerk"),
        ("단톡방 '넵' 대답 타이핑 속도 사내 1위 기록 보유자", "Corporate Chat 'Noted Sir' 0.2s Fastest Reply Typist"),
        ("워크숍 장기자랑 아이돌 댄스 강제 차출된 신입 공채 1기", "Company Workshop Forced Idol Dance Performance Recruit"),
        ("출근길 만원 지하철 가방 문틈에 끼어 10정거장 끌려간 사원", "Subway Door Backpack-Trapped 10-Station Dragged Commuter"),
        ("주말 출근 안 하면 애사심 없다는 소리 듣는 개발팀 막내", "Weekend Absenteeism Branded Lack-of-Loyalty Coder"),
        ("회의실 화이트보드 굳어버린 보드마카 지우개로 빡빡 닦는 인턴", "Conference Room Dried Whiteboard Marker Eraser Scrubber"),
        ("퇴근 1분 전 메신저 로그인 알림 떠서 숨죽이는 대리", "5:59 PM Ping Sound Messenger Hide-and-Seek Employee")
    ]
]

TIER_8_FICTION = [
    (title, en_title, "저승 및 암흑 마왕군 행정 사무국", "Administrative Bureau of Hades and Demon Legion",
     "연봉 영혼 에너지 0.5cc + 징벌 유예 1일", "0.5cc Soul Energy + 1-Day Torment Postponement/year",
     f"{title}로서 영겁의 세월 동안 끝나지 않는 초자연적 서류 지옥을 처리합니다. 염라대왕이나 마왕의 변덕으로 서류 양식이 바뀔 때마다 수백만 명의 생사부를 수작업으로 다시 적습니다. 악마 상사의 채찍질 아래서 밤새 붉은 먹물을 찍어 바릅니다.",
     f"Processes infinite paranormal bureaucracy for eternity as a {en_title}. Rewriting millions of Book of Life entries manually whenever demon lords change document templates overnight.",
     "죽어서 저승에 가도 끝나지 않는 영원불멸의 지옥 야근 노예!",
     "Overtime doesn't end even after death—the eternal bureaucratic slavery of hell!")
    for title, en_title in [
        ("지옥 염라대왕실 엑셀 매크로 오류 수작업 복구 야근 사신", "King Yama Court Excel Macro Error Manual Restoration Reaper"),
        ("시간의 방에서 1년 동안 똑같은 버그만 잡는 무한루프 개발자", "Hyperbolic Time Chamber 1-Year Infinite Loop Bug Fixer"),
        ("판타지 길드 본부 모험가 영수증 종이 전산화 야간 알바", "Adventurer Guild Potion Receipt Paper Digitizer"),
        ("사이버펑크 메가코프 인공지능이 채찍질하는 야간 코딩 노예", "Cyberpunk Megacorp AI-Whipped Night Shift Neural Coder"),
        ("저승 입국관리소 지문 스캐너 잉크 닦는 야간 요원", "Afterlife Customs Fingerprint Scanner Ink Wiper Orderly"),
        ("마왕성 인사팀 전사자 유가족 위로금 지급 누락 수습 임프", "Demon Army HR Fallen Minion Compensation Omission Imp"),
        ("드래곤 은행 보물 금고 금화 이자 계산 주판알 튕기는 고블린", "Dragon Bank Gold Vault Compound Interest Abacus Goblin"),
        ("마왕성 경리과 전사자 위로금 10만 명 영수증 분류 야근 서기", "Demon King Financial Office Fallen Minion Receipt Filing Clerk"),
        ("매트릭스 소스코드 오타 수정하다 파란 알약 먹고 싶어진 요원", "Matrix Source Code Typo Fixer Craving Blue Pill Agent"),
        ("마법부 신비한 동물 단속반 서류 캐비닛 정리하는 유령", "Ministry of Magic Magical Beast Filing Cabinet Ghost"),
        ("다크소울 화톳불 꺼질 때마다 장작 보충하러 뛰어가는 망자", "Dark Souls Bonfire Extinction Wood Replenishing Hollow"),
        ("판타지 거대 요새 청소 불량 시말서 쓰는 근위대 장교", "Fantasy Fortress Swab Inspection Failure Reprimand Writer"),
        ("좀비 바이러스 유출 보고서 파쇄기 돌리는 비밀 연구소 인턴", "Zombie Outbreak Memo Shredding Deep Lab Intern"),
        ("드라큘라 성 야간 당직 서다 십자가 보고 기절한 하급 뱀파이어", "Dracula Castle Night Guard Crucifix-Fainting Vampire"),
        ("아즈카반 간수 디멘터 결근계 대리 작성하는 해골 서기", "Azkaban Dementor Sick Leave Form Proxy Skeleton Clerk"),
        ("프랑켄슈타인 괴물 부품 재고 파악 엑셀 치는 실험실 조교", "Frankenstein Body Part Inventory Spreadsheet Grunt"),
        ("천국 입국 심사대 베드로 열쇠 잃어버려서 문 따는 천사", "Heaven Pearly Gates Saint Peter Lost Key Lockpicker"),
        ("카리브해 해적선 세무조사관 피해 보물상자 이중장부 조작하는 해적 회계사", "Caribbean Pirate Double-Book Smuggling Accountant"),
        ("스폰지밥 집게리아 야간 드라이브스루 패티 굽는 다람쥐", "Krusty Krab Overnight Drive-Thru Patty Grill Squirrel"),
        ("판타지 던전 보물상자 미믹 이빨 닦기 야간 당번 요정", "Dungeon Mimic Chest Sharp Teeth Night Flossing Sprite"),
        ("사우론 절대반지 분실 경위서 1,000장 쓰는 오크 중간관리직", "One Ring Loss Incident 1,000-Page Report Orc Manager"),
        ("신화 속 판도라 상자 열려버려 사유서 쓰는 그리스 신전 서기", "Pandora's Box Accidental Opening Apology Scribe"),
        ("늑대인간 야간 콜센터 보름달 변신 고객 응대 상담원", "Werewolf Night Shift Call Center Full Moon Support Rep"),
        ("바벨탑 공사 현장 인부들 말 안 통해 번역기 돌리는 현장소장", "Tower of Babel Language Confusion Multilingual Overseer"),
        ("지옥 불 가마솥 온도계 고장 나서 손가락 넣어 재는 하급 악마", "Hell Cauldron Broken Thermometer Finger-Dipper Imp")
    ]
]

# ==========================================
# TIER 9: 아찔한 고소작업·극한 수리공 (400..449)
# ==========================================

TIER_9_REAL = [
    (title, en_title, "2024년 극한 고소 수리 현장", "2024, Extreme Altitude Maintenance Zone",
     "연봉 3,200만 원 (생명수당 포함 + 낙하산 미지급)", "$27,000/year (Hazard Pay Included, No Parachutes)",
     f"{title}로서 지상 수백 미터 상공과 절벽 끝에서 와이어 하나에 의지해 볼트를 조입니다. 돌풍이 불면 온몸이 공중에서 그네처럼 흔들리며 간담이 서늘해집니다. 아래를 내려다보면 아득한 현기증이 찾아오지만 손에 쥔 스패너를 놓지 않습니다.",
     f"Dangles from single steel cables hundreds of meters above ground as a {en_title}. Violent mountain winds swing workers like pendulums while vertigo roars below, clutching wrenches tight.",
     "바람 한 번에 천 길 낭떠러지로 떨어질 수 있는 지상 최고의 고소공포 극한 수리공!",
     "Dangling on steel wires hundreds of meters up—the ultimate vertigo-defying technician!")
    for title, en_title in [
        ("두바이 부르즈 할리파 꼭대기 피뢰침 전구 갈아끼우는 수리공", "Burj Khalifa 828m Pinnacle Lightning Rod Bulb Replacer"),
        ("아마존 피라냐 강물 속 통신 케이블 절연테이프 감기 잠수부", "Amazon Piranha River Submerged Fiber Cable Tape Diver"),
        ("미국 600m TV 송신탑 꼭대기 맨손 전구 교체 기사", "600m TV Broadcast Tower Free-Solo Lightbulb Climber"),
        ("알프스 케이블카 공중 멈춤 수동 와이어 기름칠 기사", "Alps Cable Car Mid-Air Stalled Wire Manual Greaser"),
        ("거대 풍력발전기 날개 끝 매달려 균열 때우는 로프공", "Offshore Wind Turbine Blade Tip Crack Epoxy Rope Tech"),
        ("나이아가라 폭포 난간 페인트칠 도색공", "Niagara Falls Edge Mist Railing Painter"),
        ("남극 빙벽 관측 센서 배터리 교체 등반가", "Antarctic Ice Wall Weather Sensor Battery Climber"),
        ("원자력 발전소 원자로 냉각수조 내부 점검 잠수부", "Nuclear Reactor Core Spent Fuel Pool Inspection Diver"),
        ("에베레스트 해발 8,000m 사다리 가설 셰르파", "Everest 8,000m Khumbu Icefall Aluminum Ladder Sherpa"),
        ("샌프란시스코 금문교 주탑 케이블 녹 제거 페인터", "Golden Gate Bridge Main Suspension Cable Rust Chipper"),
        ("호주 아웃백 50m 통신철탑 독거미 둥지 털어내는 기사", "Outback 50m Telecom Tower Redback Spider Sweeper"),
        ("초대형 유조선 스크루 바다 한가운데서 그물 걷어내는 잠수부", "Supertanker Propeller Entangled Net Mid-Ocean Diver"),
        ("해저 100m 천연가스 송유관 수중 용접 잠수공", "100m Saturation Diver Underwater Oil Pipeline Welder"),
        ("석유 시추선 폭풍우 속 유정 밸브 수동 차단 정비공", "North Sea Oil Rig Storm Wellhead Valve Shutoff Tech"),
        ("활화산 분화구 열화상 카메라 센서 교체 화산학자 조수", "Active Volcano Caldera Thermal Camera Sensor Swapper"),
        ("잠실 롯데월드타워 555m 외벽 유리창 청소 로프공", "Lotte World Tower 555m Exterior Window Rope Washer"),
        ("고속철도 KTX 터널 환기팬 고속 회전 베어링 교체 기사", "Bullet Train Tunnel 200km/h Jet Fan Bearing Mechanic"),
        ("댐 수문 수심 60m 뻘에 박힌 통나무 전기톱 제거 잠수부", "Dam Sluice 60m Silted Timber Chainsaw Clearance Diver"),
        ("초대형 원유 시추선 해저 2,000m 폭풍 속 고압 밸브 누출 점검원", "Offshore Deepwater 2,000m Storm High-Pressure Valve Inspector"),
        ("고압 송전선 15만 볼트 활선 헬리콥터 매달려 수리하는 기사", "150kV High Voltage Line Helicopter Live-Line Mechanic"),
        ("시베리아 횡단열차 폭설 속 선로 얼음 제거 곡괭이 인부", "Trans-Siberian Railway Deep Snow Rail Pickaxe Ice Breaker"),
        ("지하철 지하 50m 환기통 쥐 둥지 차단망 설치 기사", "Deep Underground 50m Air Vent Rat Barrier Installer"),
        ("대형 화물선 크레인 80m 꼭대기 유압 모터 수리기사", "Container Port 80m Gantry Crane Hydraulic Motor Mechanic"),
        ("스위스 산악열차 톱니바퀴 선로 자갈 다지기 인부", "Swiss Cogwheel Mountain Railway Ballast Tamping Worker"),
        ("남태평양 해저 통신 케이블 상어 이빨 자국 수리 잠수부", "Transpacific Subsea Cable Shark Bite Splice Diver")
    ]
]

TIER_9_FICTION = [
    (title, en_title, "판타지 & SF 거대 메카 격납 요새", "Fantasy & Sci-Fi Colossal Mecha Fortress",
     "연봉 마나 공구 세트 1개 + 안전 밧줄 1가닥", "1 Mana Wrench Set + 1 Safety Tether/year",
     f"{title}로서 하늘을 떠다니는 거대 비행선과 움직이는 성, 메카의 위태로운 외벽을 고칩니다. 마법 폭풍과 대공 포화 속에서 떨어지지 않으려고 발가락까지 힘을 주고 렌치를 휘두릅니다. 발을 헛디디면 구름 밑으로 영원히 추락할 위기 속에서 수리를 마칩니다.",
     f"Repairs perilous outer hulls of flying sky fortresses and moving castles as a {en_title}. Clings with toes against magic flak cannons and vortexes, turning bolts above endless abyss falls.",
     "하늘 위에서 스패너 돌리다 구름 밑으로 번지점프할 뻔한 공중 메카 수리공!",
     "Turning wrenches atop flying castles dodging flak shells—the vertigo mechanic of the skies!")
    for title, en_title in [
        ("하울의 움직이는 성 외벽 녹슨 나사 매달려 조이는 수습 정비공", "Howl's Moving Castle Outer Hull Rusted Bolt Tightener"),
        ("사이버펑크 500층 네온사인 빗물 누전 맨손 수리기사", "Cyberpunk 500th Floor Neon Sign Barehanded Electrician"),
        ("구름 위 천공의 성 라퓨타 추락 방지용 부유석 왁스칠 당번", "Laputa Castle in the Sky Levitation Stone Waxing Tech"),
        ("하늘 위 거대 비행선 외벽에 날아오는 번개 파편 방패로 막는 공중 갑판병", "Sky Dreadnought Airship Hull Lightning Debris Shield Guard"),
        ("드래곤 뿔 사이 고압 마법 전선 연결 기사", "High-Voltage Arcane Cable Dragon Horn Stringer"),
        ("스팀펑크 장갑 열차 증기 엔진 과열 폭발 직전 망치로 때려 고치는 정비공", "Steampunk Armored Train Steam Engine Hammer Banging Mechanic"),
        ("에반게리온 초호기 구속구 볼트 조이다 싱크로 폭주 맞은 엔지니어", "Evangelion Unit-01 Restraint Bolt Torquing Tech"),
        ("건담 지상 기지 전투 직후 녹아내린 거대 방패 거치대 톱질하는 정비병", "Gundam Ground Base Molten Shield Rack Sawing Mechanic"),
        ("스팀펑크 비행선 가스 주머니 총탄 구멍 바느질하는 공중 재봉사", "Steampunk Airship Gasbag Bullet Hole Aerial Seamstress"),
        ("판타지 철옹성 대포 배기구 그을음 털다 날아오는 투석 피하는 고블린", "Iron Fortress Cannon Exhaust Vent Soot Sweeping Goblin"),
        ("트랜스포머 옵티머스 프라임 발가락 타이어 공기압 체크 로봇", "Optimus Prime Toe Tire Pressure Gauge Inspector"),
        ("어벤져스 헬리캐리어 회전 로터 날개에 낀 비둘기 깃털 빼는 요원", "S.H.I.E.L.D. Helicarrier Turbine Bird Feather Plucker"),
        ("판타지 골렘 관절 마나 누출 배관 땜질하는 대장장이", "Fantasy Siege Golem Mana Pipe Solderer Blacksmith"),
        ("매트릭스 호버크래프트 EMP 코일 방전 후 재충전 와이어맨", "Matrix Nebuchadnezzar EMP Coil Recharging Wireman"),
        ("타임머신 드로리안 차원 이동 콘덴서 전선 꼬인 것 푸는 조수", "DeLorean Flux Capacitor Tangled Wire Untangler Assistant"),
        ("설국열차 영구동력 엔진실 뜨거운 석탄통 불씨 뒤적이는 최하층 화부", "Snowpiercer Engine Room Burning Coal Stoking Tail-Section Worker"),
        ("스타크래프트 공성 전차 시즈 모드 유압 실린더 기름칠하는 SCV", "Starcraft Siege Tank Hydraulic Cylinder Greasing SCV"),
        ("마크로스 가변 전투기 날개 변신 관절 WD-40 뿌리는 정비사", "Macross Variable Fighter Wing Pivot WD-40 Sprayer"),
        ("아이언맨 아크 리액터 발열 식히려 얼음주머니 대주는 더미 로봇", "Arc Reactor Overheat Ice Pack Cooling Dummy Arm Robot"),
        ("판타지 비공정 프로펠러에 감긴 익룡 날개 풀기 항공 승무원", "Airship Propeller Tangled Pterodactyl Wing Untangler"),
        ("고질라 가슴 흉터 사이 메카고질라 미사일 불발탄 캐내는 폭파병", "Godzilla Chest Scar Unexploded Mecha Missile EOD Diver"),
        ("바이오쇼크 해저도시 랩처 유리창 균열 방수 시멘트 바르는 잠수부", "Rapture Underwater Glass Crack Waterproof Patching Diver"),
        ("판타지 던전 차원 포털 회전 톱니에 낀 마법 자갈 빼내는 기술자", "Dungeon Portal Gate Gear Stuck Mana Pebble Extraction Tech"),
        ("판타지 마법 탑 꼭대기 피뢰침에 떨어진 벼락 에너지 배터리 교체원", "Wizard Tower Pinnacle Lightning Battery Swapper"),
        ("해저 2만리 노틸러스호 잠수함 엔진 냉각수 누출 껌으로 때우는 긴급 정비공", "Nautilus Submarine Engine Coolant Leak Chewing Gum Patcher")
    ]
]

# ==========================================
# TIER 10: 폭망의 끝자락·아슬아슬 생계형 (450..499)
# ==========================================

TIER_10_REAL = [
    (title, en_title, "2024년 도시 골목길 아슬아슬 생계 현장", "2024, Gritty Urban Survival Frontline",
     "연봉 3,800만 원 (몸으로 때우는 일당제)", "$32,000/year (Sweat-and-Bone Daily Wages)",
     f"{title}로서 하루하루 밥벌이를 위해 온몸을 던져 악착같이 버텨냅니다. 새벽 칼바람과 사람들의 매서운 눈총 속에서도 가족을 위해 묵묵히 땀방울을 쏟아냅니다. 고단한 일과가 끝나면 소주 한 잔으로 피로를 달래며 내일을 맞이합니다.",
     f"Clings to survival through sheer bodily grit as a {en_title}. Endures freezing dawn winds and sharp stares to bring home daily bread, thawing aching joints with soju nightly.",
     "폭망의 벼랑 끝에서도 치열하게 삶을 지켜내는 눈물겨운 이 시대의 가장!",
     "Holding the line against poverty through relentless physical hustle—everyday heroes!")
    for title, en_title in [
        ("전국 로또 명당 줄서기 대행 14시간 알바", "Lotto Lucky Store 14-Hour Queue Waiting Stand-In"),
        ("새벽 4시 수산시장 대게 집게발 고무줄 끼우기 달인", "4 AM Fish Market King Crab Pincer Rubber Band Snapper"),
        ("지하철 신도림역 출근길 지옥철 탑승 푸시맨", "Sindorim Subway Rush Hour Hell Train Pusher"),
        ("결혼식 하객 대행 및 눈물 훔치기 전문 연기자", "Wedding Fake Guest Tear-Dabbing Emotional Actor"),
        ("워터파크 파도풀 빠진 틀니 및 금목걸이 잠수 수거꾼", "Water Park Wave Pool Lost Dentures & Gold Chain Diver"),
        ("한여름 40도 인형탈 쓰고 댄스 배틀하는 놀이공원 알바", "Midsummer 40C Mascot Suit Breakdance Part-Timer"),
        ("새벽 경매장 생선 상자 10단 머리에 이고 나르는 이모님", "Dawn Auction 10-Tier Fish Box Head-Carrying Auntie"),
        ("대리기사 심야 외곽 도로 킥보드 타고 10km 복귀 질주", "Late-Night Chauffeur 10km Electric Scooter Highway Runner"),
        ("장례식장 육개장 나르며 유가족 눈치 백단 맞추는 도우미", "Funeral Spicy Beef Soup Server Bereaved Family Comfort Staff"),
        ("겨울철 붕어빵 포장마차 반죽 붓다 손가락 데이는 사장님", "Winter Bungeoppang Stall Hot Dough Finger-Burn Vendor"),
        ("명절 기차역 암표 단속 피해 번개 거래하는 보따리상", "Holiday Train Station Scalped Ticket Lightning Hand-Off Hustler"),
        ("새벽 인력시장 소형 봉고차 맨 뒷자리 끼어 타는 잡부", "Dawn Day-Labor Van Back-Seat Squeezed Construction Worker"),
        ("고물상 폐지 리어카 언덕길 뒤에서 밀어주는 효자 청년", "Scrap Yard Cardboard Handcart Uphill Pushing Youth"),
        ("치킨집 기름 솥 폐유 교체하다 얼굴에 기름 튄 주방장", "Fried Chicken Deep Fryer Grease Tank Replacement Cook"),
        ("동대문 의류 상가 원단 롤 50kg 어깨에 메고 계단 오르는 지게꾼", "Fabric District 50kg Textile Roll Shoulder Hauler"),
        ("아파트 재건축 총회 조합원 문전박대 뚫는 홍보 OS 요원", "Apartment Reconstruction General Meeting Door-to-Door Canvasser"),
        ("중고차 매매단지 침수차 엔진 냄새 향수로 덮는 광택사", "Used Car Lot Flooded Engine Perfume Masking Detailer"),
        ("밤샘 클럽 입구 만취 취객 토사물 대걸레 청소 알바", "Morning-After Club Entrance Vomit Mopping Part-Timer"),
        ("지하상가 폐업 정리 현수막 '망했습니다 사장 실종' 부착 기사", "Going Out of Business 'Owner Fled' Banner Hanging Signman"),
        ("비둘기 똥 테러 맞은 야외 주차장 세차 손세차 달인", "Pigeon Dropping Bombed Car Park Hand Wash Specialist"),
        ("동물병원 사나운 고양이 발톱 깎기용 수건 포박 간호사", "Veterinary Fierce Cat Towel Burrito Swaddling Nurse"),
        ("대형마트 오픈런 샤넬백 텐트 치고 밤샘 대기 알바", "Luxury Department Store Open-Run Tent Camping Line-Sitter"),
        ("배달 오토바이 폭우 속 미끄러지는 배달통 붙잡는 라이더", "Torrential Rain Slipping Food Delivery Box Clutching Rider"),
        ("찜질방 불가마 장작 뒤적이며 땀구멍 폭발하는 화부", "Korean Spa Fire Kiln Oak Firewood Stoking Stoker"),
        ("새벽 고속도로 휴게소 우동 면발 삶기 1초 타이머 주방 이모", "Highway Rest Stop 1-Second Udon Noodle Blanching Cook")
    ]
]

TIER_10_FICTION = [
    (title, en_title, "판타지 도시 뒷골목 해결사 사무소", "Fantasy Urban Underbelly Fixer Agency",
     "연봉 동화 100닢 (치료비 미지급)", "100 Copper Bits (Medical Bills Uncovered)/year",
     f"{title}로서 영웅들이 화려한 모험을 끝내고 떠난 뒤의 뒤처리를 담당합니다. 부서진 건물과 날뛰는 유령, 괴수의 부산물을 수습하며 쥐꼬리만 한 의뢰비를 챙깁니다. 화려한 스포트라이트 뒤편에서 궂은일을 도맡아 하며 오늘도 한숨을 쉽니다.",
     f"Cleans up catastrophic collateral damage left behind by glorious heroes as a {en_title}. Patches smashed masonry and calms wailing specters for meager copper coins behind epic spotlights.",
     "영웅들이 부수고 간 세상을 뒤에서 묵묵히 땜질하는 판타지 세계의 숨은 영웅!",
     "Patching up the collateral damage of superhero battles—the true unsung heroes!")
    for title, en_title in [
        ("호그와트 기숙사 유령 민원 상담 콜센터 상담원", "Hogwarts Dormitory Ghost Grievance Call Center Operator"),
        ("마블 뉴욕 전투 직후 헐크가 부순 아스팔트 땜질 반장", "Post-Chitauri Battle Hulk Smashed Asphalt Patching Foreman"),
        ("슈퍼히어로 착지 구덩이 콘크리트 미장 기사", "Superhero Three-Point Landing Crater Concrete Mason"),
        ("좀비 방어용 바리케이드 중고 가구 조달책", "Zombie Barricade Secondhand Sofa Procurement Scavenger"),
        ("판타지 슬라임 목장 울타리 망가진 틈 때우는 목수", "Slime Ranch Broken Fence Wood Patching Carpenter"),
        ("몬스터 주식회사 아이들 비명 채집통 찌그러진 것 펴는 판금공", "Monsters Inc Screaming Canister Dent Repair Metalworker"),
        ("세일러문 결투 후 박살 난 육교 난간 긴급 용접공", "Magical Girl Battle Smashed Pedestrian Overpass Welder"),
        ("드래곤볼 천하제일무술대회 링 바닥 깨진 타일 교체 인부", "World Martial Arts Tournament Ring Cracked Tile Swapper"),
        ("원펀맨 파괴된 Z시 구역 폐자재 수거 트럭 기사", "City Z Crater Debris Clearance Hauler Truck Driver"),
        ("배트맨 배트모빌 지나간 뒤 부서진 소화전 잠그는 수도 배관공", "Batmobile Chased Smashed Fire Hydrant Shutoff Plumber"),
        ("디아블로 트리스트럼 마을 불탄 잔해 잿더미 치우는 잡부", "Tristram Ruins Scorched Rubble Ash Shoveler"),
        ("포켓몬 배틀 후 파괴된 체육관 바닥 복구하는 전기공", "Gym Battle Shocked Lightning Floor Rewiring Electrician"),
        ("고질라 발자국 웅덩이 오리배 관광지로 개조하는 기획자", "Godzilla Footprint Crater Duck Boat Lake Developer"),
        ("서부 개척시대 살룬 주점 결투 난동 뒤 깨진 테이블 치우는 알바", "Wild West Saloon Brawl Smashed Table Clearance Bartender Helper"),
        ("신화 속 페가수스 말똥 떨어진 신전 지붕 긁어내는 노예", "Pegasus Flight Path Temple Roof Dung Scraper"),
        ("판타지 길드 의뢰 게시판 찢어진 종이 테이프 붙이는 접수원", "Quest Board Shredded Parchment Tape Patching Receptionist"),
        ("트랜스포머 시가전 끝난 도심 떨어진 나사 줍는 자석차 기사", "Autobot City Battle Dropped Giant Bolt Magnetic Sweeper"),
        ("마녀 배달부 키키 빗자루 배달 분실 택배 찾는 보관소 직원", "Kiki Broom Delivery Lost Parcel Tracking Depot Clerk"),
        ("매트릭스 요원 총격전에 구멍 난 벽 오피스 석고보드 땜장이", "Agent Gunfight Bullet-Riddled Drywall Spackler"),
        ("알라딘 마법 양탄자 실밥 풀린 것 꿰매는 장터 재단사", "Aladdin Magic Carpet Frayed Fringe Hemming Tailor"),
        ("좀비 아포칼립스 식료품점 털린 뒤 남은 통조림 줍는 생존자", "Post-Raid Grocery Store Dent Can Foraging Survivor"),
        ("판타지 지하 광산 수레 탈선 선로 레버 당기는 신호수", "Fantasy Underground Ore Cart Derailment Switch Lever Signalman"),
        ("사이버펑크 뒷골목 네온 간판 총알 자국 실리콘 쏘는 유리공", "Neon District Stray Bullet Glazing Silicone Gunner"),
        ("동화 신데렐라 호박 마차 자정 넘겨 썩은 호박 치우는 마부", "Post-Midnight Rotted Pumpkin Carriage Shoveling Coachman"),
        ("판타지 마왕 격퇴 승리 축하 종이폭죽 찌꺼기 청소하는 광장 환경미화원", "Demon King Defeat Victory Confetti Paper Sweeping Sanitation Worker")
    ]
]

print("Tiers 6 to 10 loaded successfully.")
