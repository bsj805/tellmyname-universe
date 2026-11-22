# -*- coding: utf-8 -*-
"""
125 New Curated REAL BAD House Entries (Tiers 01 - 10)
Inspired by YouTube extreme expedition, slum documentaries, and bizarre travel channels.
"""

CATEGORY_MAP = {
    'EXTREME_NATURE': ('극한 오지·화산·심해·빙하 지형', '🪨'),
    'TOILET': ('세계의 신기한 화장실·위생시설', '🚽'),
    'DOGHOUSE': ('개집·동물 서식지·캣타워', '🐶'),
    'BOX': ('종이상자·택배박스·용기', '📦'),
    'VEHICLE': ('자동차·캠핑카·기차·잠수함', '🚗'),
    'SPACESHIP': ('우주선·우주정거장·궤도기지', '🚀'),
    'FICTION_MEDIA': ('영화·소설·애니메이션 속 공간', '🎬'),
    'MUSEUM_PUBLIC': ('이색 박물관·교도소·기괴 공공건물', '🏛️'),
    'IMAGINARY_CITY': ('상상 속의 도시·미니어처 왕국', '🏙️'),
    'WEIRD_ARCH': ('세계의 기이한 실제 건축물·랜드마크', '🏰'),
    'MULTIVERSE': ('초차원·블랙홀·다중우주 창조주 신전', '🌌'),
    'RUINS_ABANDONED': ('폐허·방치 건물·슬럼가', '🏚️'),
    'INDUSTRIAL_HAZARD': ('산업 재해·방사능·중오염 구역', '☣️'),
    'UNDERGROUND_BUNKER': ('지하 은신처·방공호·카타콤', '🕳️'),
    'PRISON_FACILITY': ('감옥·독방·수용소', '⛓️'),
    'LUXURY_PENTHOUSE': ('세계 랜드마크·초호화 펜트하우스', '👑'),
    'ROYAL_PALACE': ('황실 궁전·역사 고성', '🏰'),
    'MICRO_DWELLING': ('초소형·골판지·자판기·캡슐 원룸', '📦'),
    'CLOSET': ('옷장·가구·코인사물함', '🚪')
}

RAW_REAL_BAD = [
    # Tier 1 (0..12)
    {
        'cat': 'EXTREME_NATURE',
        'title': '에티오피아 다나킬 분화구 유황 소금 지대 1인용 야자나무 잎 광부 움막',
        'year': '1970년대 아파르족 소금 채굴지',
        'val': '-8,000만 원 (방독면 및 해독제 구입비)',
        'feat': '낮 기온 50도를 넘나드는 지구상 가장 뜨거운 땅에서 형광 노란색 유황 온천 증기를 쐬며 갓 캐낸 암염 덩어리를 베개 삼아 잠듭니다.',
        'verd': '지구상의 지옥이라 불리는 다나킬 사막 한가운데서 천연 유황 사우나를 24시간 즐기는 극한의 자연 치유 라이프입니다.',
        'prompt': 'Editorial documentary photo of a solitary fragile palm frond hut in Danakil Depression Ethiopia, bright acid-yellow and neon-green sulfur salt mineral formations, heat haze, surreal volcanic hellscape, 8k.'
    },
    {
        'cat': 'TOILET',
        'title': '러시아 오이먀콘 영하 71도 야외 재래식 나무 화장실 오두막',
        'year': '1933년 혹한 관측 기록기',
        'val': '-1억 2,000만 원 (동상 절단 수술비 미포함)',
        'feat': '영하 70도의 극저온 돌풍이 판자 틈새로 휘몰아치며, 볼일을 보는 순간 즉시 바위처럼 얼어붙어 쇠꼬챙이로 깨며 살아야 합니다.',
        'verd': '세계에서 가장 추운 인간 거주지에서 인간의 한계와 괄약근의 인내심을 시험하는 냉동 극기 훈련소입니다.',
        'prompt': 'Cinematic documentary photograph of a solitary rickety wooden outhouse toilet in Oymyakon Siberia during blizzard minus 70C, heavy frost ice icicles covering wood planks, vast frozen snowy tundra, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '파나마 다리엔 갭 원시 정글 늪지대 진흙 범벅 해먹',
        'year': '태고의 미개척 밀림',
        'val': '-5,000만 원 (구조 헬기 출동 불가 구역)',
        'feat': '도로가 완전히 끊긴 세계 최악의 밀림에서 독사, 마약 카르텔, 진흙 늪지대를 피해 두 그루의 맹그로브 나무 사이에 걸어둔 해먹입니다.',
        'verd': '문명과의 모든 연결이 차단된 무법지대 밀림 한가운데서 밤마다 재규어의 울음소리를 ASMR 삼아 잠드는 서바이벌 하우스입니다.',
        'prompt': 'Atmospheric photography of a muddy weathered survival hammock strung between dense jungle trees in Darien Gap Panama, thick tropical rain mist, muddy swamp waters below, dramatic perilous wilderness, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '볼리비아 융가스 죽음의 도로 600m 절벽 끝 폐버스 감시 초소',
        'year': '1982년 추락 사고 잔해 재활용',
        'val': '-3,000만 원 (견인 불가 위험물)',
        'feat': '폭 3m의 비포장 절벽 길 가장자리에 바퀴 절반이 공중에 뜬 채 걸려있는 녹슨 통학버스로, 창밖을 보면 600m 수직 낭떠러지가 펼쳐집니다.',
        'verd': '한 발자국만 헛디뎌도 안데스산맥 계곡으로 직행하는 심장 쫄깃한 익스트림 절벽 뷰 펜트하우스입니다.',
        'prompt': 'Dramatic vertigo-inducing photograph of a rusted vintage bus perched precariously over the 600m cliff edge of Yungas Death Road Bolivia, deep misty canyon abyss below, crumbling dirt road, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '나우루 공화국 폐인산염 광산 석회암 뾰족 기둥 사이 함석집',
        'year': '1990년대 자원 고갈 직후',
        'val': '-1,500만 원 (복구 불가능한 불모지)',
        'feat': '국토의 80%가 파헤쳐져 남은 칼날 같은 석회암 기둥(피나클) 사이에 녹슨 함석판을 얼기설기 얹어 만든 외딴 생존 가설 가옥입니다.',
        'verd': '한때 세계 최고의 부국이었다가 자원 고갈로 황폐해진 섬나라의 역사를 뼈저리게 체감하는 돌기둥 미로 하우스입니다.',
        'prompt': 'Editorial photograph of a makeshift rusty tin shack wedged between sharp jagged limestone pinnacles in devastated mined interior of Nauru island, harsh scorching sun, desolate landscape, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '투르크메니스탄 지옥의 문(다르바자) 불타는 가스 분화구 턱 밑 내열 텐트',
        'year': '1971년 소련 시추 사고 이후',
        'val': '-9,000만 원 (소방진화비 및 가스 누출 벌금)',
        'feat': '50년 넘게 꺼지지 않고 타오르는 지름 70m의 거대 불타는 구덩이 바로 옆에 설치되어 밤낮으로 섭씨 400도의 열풍과 메탄 냄새를 공급합니다.',
        'verd': '가스비와 난방비 걱정은 평생 없으나, 자는 동안 굴러떨어지면 지옥불 통구이가 되는 화끈한 불멍 하우스입니다.',
        'prompt': 'Stunning nighttime photograph of an expedition heat-resistant tent pitched just meters from the roaring blazing fiery crater of Darvaza Gas Crater Door to Hell in Turkmenistan, glowing embers, starry sky, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '베네수엘라 카타툼보 번개 호수 위 수상 양철 오두막',
        'year': '1965년 마라카이보 어로 가설물',
        'val': '-4,500만 원 (피뢰침 교체 비용 눈덩이)',
        'feat': '연간 300일, 매일 밤 10시간 동안 분당 40번의 벼락이 내리꽂히는 마라카이보 호수 한가운데 세워진 수상 양철 오두막입니다.',
        'verd': '밤마다 공짜로 즐기는 100만 볼트 천연 레이저 쇼 덕분에 불면증과 심신 쇠약이 절로 찾아오는 감전 주의 하우스입니다.',
        'prompt': 'Dramatic long exposure photograph of a rustic wooden stilt cabin on Lake Maracaibo Venezuela, massive spider web lightning bolts flashing across purple storm clouds above, water reflections, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '시베리아 보르쿠타 영하 50도 폐탄광 아파트 고드름 베란다',
        'year': '1962년 소련 광산 노동자 아파트',
        'val': '-2,000만 원 (난방 공급 영구 중단)',
        'feat': '난방 배관이 동파되어 실내 벽과 가구 전체가 30cm 두께의 새하얀 고드름과 서리로 뒤덮인 유령도시의 동결된 베란다 침실입니다.',
        'verd': '겨울왕국 엘사의 얼음 궁전 실사판이지만 보일러가 없어서 숨을 쉴 때마다 폐가 찢어지는 영구동토 빙하 아파트입니다.',
        'prompt': 'Haunting documentary photograph of an abandoned Soviet apartment in Vorkuta Russia completely encrusted in thick white frost and giant icicles hanging from the ceiling, frozen room, peeling paint, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '페루 라 린코나다 해발 5,100m 만성 고산병 금광 판잣집',
        'year': '1985년 골드러시 난민 정착',
        'val': '-3,500만 원 (산소통 구입비 및 수은 오염)',
        'feat': '인류 최고 고도 영구 거주지에서 상하수도와 난방 없이 빙하 녹은 오수를 마시며, 수은 찌꺼기 냄새 속에서 산소 부족과 싸워야 합니다.',
        'verd': '가만히 누워만 있어도 머리가 깨질 듯한 두통이 찾아오는, 지구상 가장 가혹한 고도에서 캐내는 희망과 절망의 판잣집입니다.',
        'prompt': 'Gritty realistic photograph of a corrugated sheet metal shack clinging to the frozen mountain side of La Rinconada Peru at 5100m altitude, garbage strewn on ice, towering snow capped Andes peak, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '이집트 카이로 자발린 쓰레기 수거 마을 옥상 골판지 펜트하우스',
        'year': '1980년대 만쉬야트 나스르 슬럼',
        'val': '-1,200만 원 (파리 떼 퇴치제 비용)',
        'feat': '카이로 전역에서 모여든 쓰레기 더미가 산처럼 쌓인 건물 옥상에서 수천 마리의 돼지와 파리 떼와 함께 숙식을 공유하는 골판지 방입니다.',
        'verd': '재활용 100%의 친환경(?) 분리수거 마을 최상층에서 카이로의 악취 섞인 석양을 360도로 조망하는 쓰레기 더미 펜트하우스입니다.',
        'prompt': 'Editorial street photography of a cardboard and pallet shelter on the rooftop of Manshiyat Naser Garbage City Cairo, surrounded by towering sacks of sorted plastic recyclables, dusty cityscape, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '알래스카 베텔 툰드라 영구동토층이 녹아 45도 기울어진 트레일러',
        'year': '1979년 유전 탐사단 이동식 캠프',
        'val': '-2,500만 원 (지반 침하 복구 불가)',
        'feat': '지구 온난화로 영구동토층이 녹아내리며 바퀴 한쪽이 진흙 수렁에 빠져 45도로 기울어졌으며, 침대에서 자다 보면 문 쪽으로 굴러떨어집니다.',
        'verd': '모든 가구와 냄비가 한쪽 벽으로 미끄러져 내려가는 물리 법칙 체감형 툰드라 슬라이딩 하우스입니다.',
        'prompt': 'Realistic photography of a weathered camper trailer sunk deep into thawing muddy permafrost mud tilted at a steep 45 degree angle in Alaskan tundra, gloomy subarctic wilderness, mosquitoes, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '인도 체라푼지 연강수량 11,000mm 살아있는 나무뿌리 다리 밑 방수포 천막',
        'year': '1890년대 카시족 전통 고무나무 다리',
        'val': '-1,800만 원 (곰팡이 핀 옷가지 세탁비)',
        'feat': '세계에서 비가 가장 많이 오는 마을에서 살아있는 고무나무 뿌리를 꼬아 만든 다리 아래에 방수포를 치고 365일 쏟아지는 폭우를 맞습니다.',
        'verd': '빨래가 1년 내내 마르지 않고 몸에서 버섯이 자라날 것 같은 극강의 습도를 자랑하는 천연 수중 사우나입니다.',
        'prompt': 'Lush moody photograph of a simple canvas tarpaulin shelter pitched beneath an ancient living root bridge in Cherrapunji India, torrential monsoon rain pouring down, emerald green mossy jungle, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '사하라 사막 모리타니 700km 철광석 화물열차 석탄 먼지 화물칸 침낭',
        'year': '1963년 완공된 사하라 횡단 철도',
        'val': '-1,000만 원 (폐세척 및 각막 치료비)',
        'feat': '길이 2.5km에 달하는 거대 화물열차의 덮개 없는 철광석 가루 더미 위에 침낭을 깔고, 시속 60km로 날아오는 검은 철가루를 마시며 20시간을 달립니다.',
        'verd': '도착할 때쯤이면 온몸이 흑연 조각상이 되어 눈알만 굴리고 있는 사하라 사막의 익스트림 오픈카 슬리퍼입니다.',
        'prompt': 'Dramatic high-contrast photography of a traveler in sleeping bag lying atop an open hopper car filled with black iron ore on Mauritania Sahara train, vast endless desert dunes speeding past, dust cloud, 8k.'
    },

    # Tier 2 (13..25)
    {
        'cat': 'RUINS_ABANDONED',
        'title': '브라질 리우데자네이루 파벨라 미로 골목 꼭대기 플라스틱 드럼통 옥상 판잣집',
        'year': '1988년 호시냐 파벨라 불법 증축',
        'val': '-1,500만 원 (방탄 철판 시공 견적 미달)',
        'feat': '미로 같은 파벨라 급경사 계단 맨 꼭대기 물탱크 옆에 파란색 플라스틱 드럼통과 폐합판으로 지어져 총격전 소리가 밤마다 울려 퍼집니다.',
        'verd': '코파카바나 해변의 멋진 야경 뒤로 언제 어디서 총알이 날아올지 모르는 긴장감 200%의 옥상 전망대입니다.',
        'prompt': 'Vibrant yet gritty documentary photograph of a makeshift rooftop shack built with blue plastic water barrels and corrugated sheets atop Rocinha favela Rio de Janeiro, sprawling labyrinth hills, dusk, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '필리핀 마닐라 스모키 마운틴 불타는 쓰레기 매립지 위 대나무 원룸',
        'year': '1975년 슬럼 난민 형성기',
        'val': '-800만 원 (유독가스 배출 정화비)',
        'feat': '지하에서 메탄가스가 저절로 발화해 24시간 연기가 피어오르는 쓰레기 산비탈 위에 대나무 장대로 기둥을 세운 1평짜리 거처입니다.',
        'verd': '신발 밑창이 열기에 녹아내리고 코를 찌르는 플라스틱 타는 냄새가 일상인 세계 최대 쓰레기 매립지 하우스입니다.',
        'prompt': 'Powerful editorial photography of a fragile bamboo shack standing on smoldering mountain of garbage in Smokey Mountain Manila, acrid smoke rising, vultures circling hazy sky, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '남아공 요하네스버그 폰테 시티 타워 중앙 쓰레기 구덩이 바닥 0.5평 간이 쉘터',
        'year': '1990년대 아파르트헤이트 붕괴 직후',
        'val': '-2,200만 원 (낙하물 방지망 미설치 벌금)',
        'feat': '54층 속이 텅 빈 원통형 타워 중앙 바닥에 수십 년간 주민들이 위에서 던진 3층 높이 쓰레기 산 꼭대기에 텐트를 쳤습니다.',
        'verd': '하늘을 올려다보면 원형 감옥 같고, 위층에서 언제 유리병이나 폐가전이 떨어질지 모르는 낙하물 주의 벙커입니다.',
        'prompt': 'Looking up inside the dizzying brutalist cylindrical hollow core of Ponte City Tower Johannesburg, standing on massive mound of trash at the bottom, circular opening to the sky high above, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '케냐 나이로비 키베라 슬럼가 기찻길 바로 옆 10초마다 기차 지나가는 양철 움막',
        'year': '1984년 우간다 철도 연선 불법 점거',
        'val': '-600만 원 (진동으로 인한 뇌진탕 위험)',
        'feat': '문지방에서 철로까지의 거리가 단 30cm에 불과해, 화물열차가 지나갈 때마다 방 전체가 지진 난 듯 요동치며 숟가락이 춤을 춥니다.',
        'verd': '기차 경적 소리가 모닝콜이자 자장가이며, 문을 열 때 머리를 숙이지 않으면 기차 범퍼에 하이파이브하는 초밀착 역세권 하우스입니다.',
        'prompt': 'Captivating street photo of a tiny rusted corrugated iron shack situated inches away from active railway tracks in Kibera slum Nairobi, colorful clothes hanging, muddy path, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '인도 뭄바이 다라비 가죽 무두질 공장 화학 폐수 배수관 옆 합판 침상',
        'year': '1970년 피혁 공단 밀집기',
        'val': '-1,100만 원 (크롬 중독 해독 비용)',
        'feat': '중금속 크롬과 동물 가죽 썩는 냄새가 진동하는 배수로 바로 위에 나무 합판 두 장을 걸쳐놓고 밤을 지새우는 피혁공들의 취침 공간입니다.',
        'verd': '향수 100병을 들이부어도 지워지지 않는 독보적인 가죽 화학 약품 향기를 24시간 만끽하는 럭셔리(?) 아로마 룸입니다.',
        'prompt': 'Atmospheric photo of a narrow wooden plank sleeping berth directly over a toxic blue chemical drainage ditch in a leather tannery alley in Dharavi Mumbai, worn machinery, steam, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '방글라데시 다카 가죽 무두질 공장 슬러지 제방 위 비닐하우스',
        'year': '1995년 부리가강 오염 지대',
        'val': '-900만 원 (토양 정화 불가 판정)',
        'feat': '검은 화학 폐수가 흘러드는 부리가강 둑방길의 유독 슬러지 흙더미 위에 비닐과 대나무를 엮어 만든 초미니 가설 주택입니다.',
        'verd': '창문을 열면 무지개색 화학 기름띠가 흐르는 강물이 한눈에 들어오는 독성 워터프론트 뷰 하우스입니다.',
        'prompt': 'Documentary photography of a plastic sheet shack built on jet-black industrial sludge banks of Buriganga River Dhaka, colorful chemical sheen on water surface, polluted foggy dawn, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '인도네시아 자카르타 침수 빈민촌 바닷물 차오르는 콘크리트 다리 교각 틈새',
        'year': '2005년 지반 침하 구역',
        'val': '-1,300만 원 (만조 시 자동 수몰)',
        'feat': '도시 침하로 하루에 두 번 만조 때마다 방바닥에 무릎까지 녹조 낀 바닷물이 밀려들어 스티로폼 부표 위에 침대를 띄워놓고 삽니다.',
        'verd': '자연이 선사하는 일 2회 자동 물청소 시스템을 갖춘, 베네치아 부럽지 않은 자카르타식 침수 풀빌라입니다.',
        'prompt': 'Gritty photograph of a makeshift wooden dwelling suspended under a cracked concrete bridge pier in North Jakarta, murky seawater rising to knee level, plastic trash floating, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '멕시코 티후아나 국경 장벽 바로 아래 녹슨 철조망 그늘 텐트',
        'year': '2018년 국경 카라반 대기 캠프',
        'val': '-700만 원 (국경수비대 강제 철거 예정)',
        'feat': '미국과 멕시코를 가르는 거대한 철제 국경 장벽 틈새에 방수포를 묶어 만든 텐트로, 밤마다 서치라이트와 헬기 소리가 방을 비춥니다.',
        'verd': '아메리칸 드림을 코앞 10cm에 두고 철조망을 벽지 삼아 잠드는 세상에서 가장 긴장감 넘치는 국경선 텐트입니다.',
        'prompt': 'Poignant photography of a makeshift fabric tent nestled directly against the towering rusted steel bollard border wall in Tijuana Mexico, harsh security spotlight, dusty desert borderland, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '아이티 포르토프랭스 지진 잔해 콘크리트 슬래브 틈새 0.8평 은신처',
        'year': '2010년 대지진 붕괴 건물 잔해',
        'val': '-500만 원 (추가 붕괴 위험 99%)',
        'feat': '팬케이크처럼 무너져 내린 4층 건물의 콘크리트 슬래브 틈새에 겨우 기어들어갈 공간을 파내어 매트리스를 깔았습니다.',
        'verd': '철근이 뼈대처럼 튀어나온 천장을 바라보며 여진이 오지 않기만을 기도해야 하는 자연재해 생존 체험실입니다.',
        'prompt': 'Raw documentary photograph of a tiny living space hollowed out inside collapsed concrete slabs with exposed rusted rebar in Port-au-Prince Haiti, single kerosene lantern, rubble, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '짐바브웨 하라레 초인플레이션 시절 100조 달러 지폐 뭉치로 벽 단열재 채운 흙집',
        'year': '2008년 하이퍼인플레이션 극성기',
        'val': '폐지 3kg 교환 가격 (약 200원)',
        'feat': '계란 한 알에 수천억 달러 하던 시절, 벽돌보다 싸진 100조 달러 지폐 다발을 벽체 틈새에 보온 단열재로 빽빽하게 채워 넣었습니다.',
        'verd': '전 세계에서 가장 돈이 많이 들어간 흙집이지만, 정작 빵 한 조각과도 바꿀 수 없는 슬픈 갑부의 하우스입니다.',
        'prompt': 'Surreal photograph inside a rustic mud brick hut where thousands of genuine blue 100 Trillion Zimbabwe Dollar banknotes are packed into wall cracks as insulation, oil lamp light, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '캄보디아 프놈펜 백색 빌딩(화이트 빌딩) 붕괴 직전 균열 간 복도 끝방',
        'year': '1963년 바사크 강변 공공주택',
        'val': '-1,700만 원 (철거 명령 강제 이주 구역)',
        'feat': '한때 근대 건축의 걸작이었으나 마약상과 슬럼으로 전락해 건물 전체에 뱀 같은 균열이 가고 벽에서 콘크리트 가루가 비처럼 내립니다.',
        'verd': '건물이 언제 주저앉을지 카운트다운을 세며 삐걱거리는 콘크리트 신음 소리를 감상하는 역사 유적 셋방입니다.',
        'prompt': 'Eerie atmospheric photo of a crumbling hallway in Phnom Penh White Building, severe structural cracks in peeling concrete walls, tropical moss, flickering fluorescent light, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '미국 디트로이트 팩커드 자동차 폐공장 도색 스프레이 잔여물 바닥 텐트',
        'year': '1958년 공장 폐쇄 이후 방치',
        'val': '-2,800만 원 (석면 및 중금속 정화 명령)',
        'feat': '수십 년 전 자동차 페인트가 굳어 무지개색 암석처럼 굳어버린 도색 부스 바닥에 텐트를 치고 도시 탐험가 흉내를 냅니다.',
        'verd': '몰락한 자동차 도시의 녹슨 심장부에서 맹독성 유기용제 냄새를 맡으며 과거의 번영을 회상하는 러스트 벨트 하우스입니다.',
        'prompt': 'Moody urban exploration photo of a camping tent inside vast derelict Packard Automotive Plant in Detroit, colorful dried automotive paint buildup on peeling industrial floor, broken glass, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '루마니아 부쿠레슈티 차우셰스쿠 시대 지하 난방 파이프 미로 하수도 굴방',
        'year': '1980년대 독재 정권 지하 시설망',
        'val': '-1,200만 원 (지상 출입증 없음)',
        'feat': '뜨거운 지역난방 온수 파이프가 얽혀있는 어두운 지하 하수도 터널에서 본드 흡입자들과 함께 쥐를 벗 삼아 살아가는 지하 셋방입니다.',
        'verd': '겨울에는 찜통더위, 여름에는 곰팡이 천국을 선사하는 지옥의 하수도 언더그라운드 익스프레스입니다.',
        'prompt': 'Claustrophobic documentary photography of a subterranean steam heating tunnel in Bucharest sewers, rusty massive hot water pipes wrapped in deteriorating insulation, shadowy den, 8k.'
    }
]
print(f"REAL BAD Part 1 loaded: {len(RAW_REAL_BAD)} items")

RAW_REAL_BAD.extend([
    # Tier 3 (26..37)
    {
        'cat': 'BOX',
        'title': '부산 감천문화마을 꼭대기 뒤집힌 고물 냉장고 안쪽 간이 쉘터',
        'year': '1998년 IMF 부도 냉장고 재활용',
        'val': '-350만 원 (고철값 1만 2천 원)',
        'feat': '급경사 산복도로 옹벽 위에 굴러떨어진 양문형 냉장고 문짝을 뜯어내고 스티로폼 단열재를 긁어내 만든 1인용 맞춤형 캡슐입니다.',
        'verd': '여름에는 찜통 건식 사우나, 겨울에는 완벽한 냉동실로 변신하는 4계절 기후 체험형 백색가전 하우스입니다.',
        'prompt': 'Humorous yet gritty street photo of a gutted vintage refrigerator repurposed as a sleeping pod perched on steep hillside wall in Gamcheon Busan, colorful rooftops below, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '미국 텍사스 폐타이어 매립장 1,000만 개 고무 타이어 무덤 한가운데 튜브 동굴',
        'year': '1987년 불법 폐타이어 집적장',
        'val': '-1,800만 원 (화재 시 유독가스 경보 1순위)',
        'feat': '지평선 끝까지 쌓여있는 수천만 개의 트럭 타이어를 동굴처럼 파고 들어가 고무 냄새 가득한 중심부에 침상을 마련했습니다.',
        'verd': '쿠션감 하나는 세계 최고지만 한번 불이 붙으면 30년간 꺼지지 않는 텍사스 고무 무덤 하우스입니다.',
        'prompt': 'Dramatic wide-angle photo of a small cave-like shelter carved inside a massive towering sea of millions of black discarded rubber tires in Texas desert, heat shimmer, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '일본 오사카 도톤보리 뒷골목 자판기 3대 사이에 낀 골판지 캡슐',
        'year': '2012년 야간 음료 자판기 틈새',
        'val': '-150만 원 (동전 교환기 소음 피해)',
        'feat': '따뜻한 음료를 배출하는 자판기 실외기 모터 바로 뒤편 0.3평 틈새에 골판지를 끼워 넣고 모터 진동을 마사지 삼아 잡니다.',
        'verd': '누군가 100엔을 넣고 캔커피를 뽑을 때마다 "덜컹!" 하는 경쾌한 소음이 뇌를 깨워주는 초역세권 자판기 룸입니다.',
        'prompt': 'Detailed night street photography in Osaka back alley, cozy cardboard micro shelter wedged tightly between three glowing Japanese beverage vending machines, warm neon glow, 8k.'
    },
    {
        'cat': 'CLOSET',
        'title': '서울 을지로 공구거리 철공소 선반 기계 기름받이 밑 공구함 침상',
        'year': '1976년 청계천 철공 단지 시절',
        'val': '-400만 원 (절삭유 세척비 미포함)',
        'feat': '쇠를 깎는 선반 기계 아래 절삭유와 쇳가루가 뚝뚝 떨어지는 기름받이 통 바로 옆 대형 쇠공구함 뚜껑을 열고 잠을 청합니다.',
        'verd': '아침마다 쇠 깎는 굉음과 타는 냄새가 뇌세포를 번쩍 깨워주는 대한민국의 위대한 산업화 체험형 철공 룸입니다.',
        'prompt': 'Gritty documentary photograph of a makeshift sleeping space tucked under a massive oily industrial lathe machine in Euljiro Seoul tool workshop, metal shavings, incandescent bulb, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '대만 가오슝 폐선박 해체장 프로펠러 샤프트 터널 안 임시 취침실',
        'year': '1983년 해체된 10만 톤급 화물선',
        'val': '-2,300만 원 (밀폐 공간 질식 위험 경고)',
        'feat': '해체 중인 거대 화물선 밑바닥 녹슨 강철 스크루 축 터널에 기어들어가 쇠망치 두드리는 소리를 백색소음 삼아 잠듭니다.',
        'verd': '산소 농도 15%의 아슬아슬한 환기 상태에서 조선소 노동자의 거친 숨결을 체험하는 강철 잠수함 벙커입니다.',
        'prompt': 'Claustrophobic view inside a rusted steel propeller shaft tunnel of a dismantled cargo ship in Kaohsiung shipbreaking yard, torch sparks in distance, industrial gloom, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '영국 런던 지하철 환풍구 위 따뜻한 바람 쐬는 접이식 쇼핑카트 쉘터',
        'year': '1999년 센트럴 라인 환기구',
        'val': '-80만 원 (마트 카트 무단 점유)',
        'feat': '지하철이 지나갈 때마다 뿜어져 나오는 텁텁한 튜브 먼지와 미지근한 바람을 쐬기 위해 쇼핑카트에 비닐을 씌워 만든 카트 텐트입니다.',
        'verd': '빅벤과 런던아이의 낭만 뒤편에서 튜브 브리즈(Tube Breeze)를 무료 난방 삼아 버티는 런던 스트리트 하우스입니다.',
        'prompt': 'Atmospheric rainy night photograph in London sidewalk, shopping cart draped in clear plastic sheeting positioned directly over a warm glowing subway grating vent, wet pavement reflections, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '독일 베를린 폐가전 수거장 CRT 모니터 100대 쌓아 만든 브라운관 이글루',
        'year': '2004년 평판 디스플레이 전환기',
        'val': '-600만 원 (납 유리 폐기물 처리비)',
        'feat': '버려진 17인치 볼록 브라운관 모니터 100대를 이글루 형태로 둥글게 쌓아올려 만든 기괴한 사이버 펑크 폐가전 쉘터입니다.',
        'verd': '모니터 안쪽에서 중금속 납 가루가 솔솔 풍겨오지만 바람 하나는 완벽하게 막아주는 레트로 테크 돔입니다.',
        'prompt': 'Cyberpunk inspired urban photo of an igloo built entirely from stacked vintage beige CRT computer monitors in an overgrown Berlin recycling yard, gloomy overcast sky, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '프랑스 마르세유 항구 버려진 녹슨 수송용 컨테이너 바닥 구멍 뚫린 구석',
        'year': '1991년 퇴역 컨테이너',
        'val': '-950만 원 (해수 염분 부식 90%)',
        'feat': '바닥 철판이 바닷물에 삭아 구멍이 숭숭 뚫려있으며, 발밑으로 쥐들이 지나다니고 지중해 바닷바람이 뼛속까지 시리게 파고듭니다.',
        'verd': '지중해 크루즈의 낭만 대신 녹가루와 바다 짠내를 한껏 들이마시는 마르세유 부두의 해상 물류 익스프레스입니다.',
        'prompt': 'Realistic photography inside a heavily corroded orange shipping container at Port of Marseille, rust holes in floor revealing gravel below, sea salt crusts, harsh Mediterranean sunlight, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '일본 아키하바라 버려진 대형 뽑기 기계(가챠폰) 진열대 안쪽 1인용 박스',
        'year': '2008년 폐업한 오락실 뒷골목',
        'val': '-200만 원 (동전 투입구 고장)',
        'feat': '캡슐 토이가 들어있던 투명 아크릴 진열장 내부를 털어내고 웅크려 누울 수 있게 개조한 오타쿠 성지의 미니멀 캡슐입니다.',
        'verd': '밖에서 지나가는 사람들이 뽑기 레버를 돌릴 때마다 침대가 덜컹거리는 기상천외한 뽑기 기계 펜트하우스입니다.',
        'prompt': 'Intriguing street photograph in Tokyo Akihabara backstreet, oversized gutted vintage gachapon capsule toy vending machine converted into a tiny glowing sleeping capsule, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '서울 청계천 고물상 폐지 압축기 옆 0.5평 신문지 벙커',
        'year': '1982년 폐자원 수거장',
        'val': '-120만 원 (종이 무게 350kg)',
        'feat': '하루 10톤씩 쏟아지는 신문지와 폐박스 압축 덩어리 사이에 몸 하나 쏙 들어갈 틈새를 파내어 최고의 보온성을 확보했습니다.',
        'verd': '대한민국 40년 현대사 뉴스를 벽지로 바르고 자며 세상 돌아가는 소식을 엉덩이로 읽는 신문지 보온 벙커입니다.',
        'prompt': 'Detailed documentary photo inside a packed Cheonggyecheon Seoul paper recycling yard, cozy nook carved into giant bales of compressed cardboard and newspapers, warm yellow work light, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '호주 아웃백 방치된 볼링장 폐목재 핀 볼링공 리턴 레일 위 해먹',
        'year': '1974년 사막 광산 마을 볼링장',
        'val': '-500만 원 (흰개미 목재 부식)',
        'feat': '사막 한가운데 버려진 볼링장의 기름 먹은 단풍나무 레일 위에 해먹을 치고, 굴러다니는 16파운드 볼링공을 발받침 삼아 쉽니다.',
        'verd': '밤마다 사막 딩고 개들이 볼링 핀을 물어뜯는 소리를 들으며 스트라이크의 쾌감을 꿈꾸는 레트로 스포츠 로지입니다.',
        'prompt': 'Eerie atmospheric photo of an abandoned desert bowling alley in Australian Outback, red sand dusting polished wooden lanes, camping hammock strung across rusted ball return mechanism, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '캐나다 퀘벡 얼어붙은 폐차장 스쿨버스 뒷좌석 스프링 튀어나온 벤치',
        'year': '1985년 퇴역 노란색 스쿨버스',
        'val': '-750만 원 (창문 깨짐 및 동파)',
        'feat': '창문 유리창이 다 깨져 눈보라가 들이치는 노란 스쿨버스 맨 뒷자리에서 스프링 튀어나온 비닐 시트 위에 침낭을 덮고 잡니다.',
        'verd': '학창 시절 맨 뒷자리에서 과자 까먹던 추억을 영하 30도 혹한 속에서 뼈저리게 되새기는 스쿨버스 동면 룸입니다.',
        'prompt': 'Atmospheric winter photography inside an abandoned yellow school bus buried in deep snow in Quebec junk yard, snow drifting through broken windows onto ripped vinyl seats with exposed springs, 8k.'
    },

    # Tier 4 (38..50)
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '러시아 체르노빌 원전 붉은 숲(Red Forest) 가장자리 방사능 계측기 삐 소리 나는 오두막',
        'year': '1986년 원전 폭발 직후 버려진 초소',
        'val': '-1억 5,000만 원 (고준위 방사능 차폐 불가)',
        'feat': '방사능으로 솔잎이 붉게 말라죽은 숲 가장자리에서 방사선 계측기 수치가 시간당 50마이크로시버트를 찍는 통나무 초소입니다.',
        'verd': '어두운 밤에도 벽과 손톱이 영롱한 형광 초록색으로 빛나는(?) 자연 발광 시스템을 갖춘 체르노빌 핫스팟입니다.',
        'prompt': 'Haunting documentary photograph of an overgrown wooden ranger cabin on edge of Chernobyl Red Forest, rusted geiger counter on table, dead rust-red pine trees visible through cracked window, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '일본 후쿠시마 원전 귀환 곤란 구역 잡초 무성한 폐편의점 계산대 뒤',
        'year': '2011년 동일본 대지진 직후 소개령',
        'val': '-6,000만 원 (출입 통제 바리케이드 구역)',
        'feat': '시간이 멈춘 편의점 바닥에 유통기한 13년 지난 컵라면 박스들이 뒹굴고, 잡초가 바닥 타일을 뚫고 자라난 계산대 구석 셋방입니다.',
        'verd': '24시간 연중무휴 편의점의 따뜻함 대신 멧돼지와 원숭이만이 문안 인사를 오는 침묵의 편의점 스위트입니다.',
        'prompt': 'Eerie photo of an abandoned convenience store inside Fukushima Exclusion Zone, floor cracked with wild overgrown weeds, dust covered shelves with faded goods, sunlight beaming through glass, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '러시아 첼랴빈스크 마야크 핵재처리장 테차강 둔치 방사능 오염 흙토굴',
        'year': '1957년 키시팀 사고 유출 구역',
        'val': '-9,500만 원 (강제 이주 지정 토지)',
        'feat': '스트론튬-90과 세슘-137로 극심하게 오염된 테차강 강기슭 흙을 파내어 지은 토굴로, 강물에 손을 담그면 화상을 입을 위험이 있습니다.',
        'verd': '세계에서 가장 오염된 강변에서 방사능 온돌(?) 효과를 누리며 체세포 돌연변이를 관찰하는 극단적 과학 기지입니다.',
        'prompt': 'Somber landscape photo of an earthen dugout shelter on the desolate grassy banks of Techa River in Chelyabinsk, yellow radiation warning signs posted on rusted barbed wire, overcast sky, 8k.'
    },
    {
        'cat': 'TOILET',
        'title': '칠레 아타카마 사막 버려진 구리 광산 비소 침출 연못 옆 양철통 변소',
        'year': '1968년 폐광 이후 방치',
        'val': '-4,000만 원 (토양 비소 농도 기준치 500배)',
        'feat': '초록빛 비소와 황산이 고여있는 독성 연못 바로 옆에 녹슨 드럼통을 잘라 만든 푸세식 변소 겸 1인용 바람막이입니다.',
        'verd': '사막의 맑은 별빛 아래서 비소 증기를 심호흡하며 장 건강을 단번에 정화(?)시키는 극약 처방 하우스입니다.',
        'prompt': 'Dramatic high-contrast photograph of a rusted steel drum outhouse perched beside a surreal emerald-green toxic arsenic tailings pond in Atacama desert, white salt flats, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '호주 위트눔(Wittenoom) 청석면 치명적 분진 날리는 유령마을 주유소',
        'year': '1966년 광산 폐쇄 및 지도 말소',
        'val': '-5,500만 원 (석면 폐증 치료비 별도)',
        'feat': '호주 정부가 지도에서 공식 삭제한 청석면 광산 마을에서 바람이 불 때마다 미세한 푸른 석면 바늘들이 허공을 가르는 주유소 사무실입니다.',
        'verd': '숨을 쉴 때마다 1급 발암물질이 폐포에 콕콕 박히는 웰컴 투 석면 월드의 유령 주유소 펜트하우스입니다.',
        'prompt': 'Desolate photograph of an abandoned 1960s petrol station in ghost town of Wittenoom Pilbara Australia, dusty red dirt roads, blue asbestos fibers shimmering in harsh desert sun, warning sign, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '카자흐스탄 세미팔라틴스크 핵실험장 \'원자 호수\' 분화구 턱 밑 텐트',
        'year': '1965년 소련 수소폭탄 차간 핵실험',
        'val': '-8,500만 원 (방사능 낙진 구역)',
        'feat': '수소폭탄을 터뜨려 인공적으로 만든 직경 400m 원자 호수 분화구 턱밑에 텐트를 치고 유리처럼 녹아내린 암석 위에서 잠듭니다.',
        'verd': '인류가 만든 가장 파괴적인 폭발의 흔적을 침대 머리맡에 두고 핵시대의 공포를 실시간으로 체감하는 멜트다운 캠프입니다.',
        'prompt': 'Stark panoramic photo of an expedition tent pitched on the high crater lip of Chagan Lake Semipalatinsk Kazakhstan, glassy black crater rim, stagnant radioactive lake water, desolate steppe, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '인도 보팔 가스 참사 폐공장 잔해 유독성 화학물질 탱크 그늘막',
        'year': '1984년 유니온 카바이드 참사 부지',
        'val': '-7,000만 원 (미처리 화학 폐기물 방치)',
        'feat': '수천 명의 목숨을 앗아간 메틸 이소시아네이트 저장 탱크의 녹슨 골조 아래 그늘막을 치고 40년째 방치된 중금속 먼지를 마십니다.',
        'verd': '산업 재해 역사의 가장 어두운 비극의 현장에서 맹독성 잔여물과 함께 살아가는 역사적 반면교사 셋방입니다.',
        'prompt': 'Haunting photography inside the overgrown abandoned Union Carbide chemical plant in Bhopal India, massive rusted reaction vessels and pipes draped in vines, dusty shadow shelter, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '미국 핸포드 플루토늄 생산기지 지하 폐수 누출 탱크 상부 배관실',
        'year': '1944년 맨해튼 프로젝트 시절 건설',
        'val': '-1억 원 (정화 비용 수조 원 추산 구역)',
        'feat': '나가사키 원폭 플루토늄을 생산하던 비밀 기지의 노후 지하 탱크 상부 밸브실로, 탱크에서 끓어오르는 방사성 슬러지 증기가 샙니다.',
        'verd': '원자폭탄의 고향 한복판 지하 배관에서 방사능 슬러지의 온기를 느끼며 잠드는 냉전의 유산 하우스입니다.',
        'prompt': 'Claustrophobic industrial photo of a narrow underground valve room at Hanford nuclear site Washington, peeling yellow lead paint on massive steel pipes, flickering gauge lights, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '러시아 카라차이 호수 극고준위 방사능 둔치 콘크리트 차폐벽 밑 쉘터',
        'year': '1990년대 호수 매립 차폐 공사',
        'val': '-1억 8,000만 원 (1시간 체류 시 사망)',
        'feat': '방사능 먼지 확산을 막기 위해 콘크리트 블록 1만 개로 덮어버린 호숫가 차폐벽 틈새에 설치된 극단적인 철제 캡슐입니다.',
        'verd': '서 있는 것만으로도 치사량에 도달하는 세계에서 가장 위험한 호숫가 1열 뷰를 자랑하는 익스트림 엔드게임 룸입니다.',
        'prompt': 'Grim industrial landscape photo of giant interlocking concrete shielding blocks burying Lake Karachay Russia, cracked radioactive wasteland, distant heavy surveillance towers, cold winter mist, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '우크라이나 프리피야트 놀이공원 녹슨 대관람차 7호 곤돌라 바람맞이',
        'year': '1986년 개장 이틀 전 버려진 놀이공원',
        'val': '-3,800만 원 (방사능 핫스팟 지점)',
        'feat': '단 한 번도 정식 운행하지 못한 노란색 관람차 곤돌라에 걸터앉아 프리피야트 유령도시의 텅 빈 아파트들을 내려다봅니다.',
        'verd': '바람이 불 때마다 삐걱거리는 녹슨 쇠 소리가 오장육부를 긁는, 방사능 핫스팟 대관람차 VIP 라운지입니다.',
        'prompt': 'Iconic haunting photo sitting inside a weathered yellow gondola of the abandoned Pripyat ferris wheel, moss covered seats, view of decaying Soviet high rises through cracked metal bars, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '이탈리아 세베소 다이옥신 오염 사고 기념 숲 오염토 매립 언덕 구덩이',
        'year': '1976년 다이옥신 폭발 참사',
        'val': '-4,500만 원 (표토 독극물 매립지)',
        'feat': '치명적인 TCDD 다이옥신으로 오염된 동물 사체와 흙을 거대 콘크리트 수조에 묻고 그 위에 조성한 인공 언덕의 배기구 옆입니다.',
        'verd': '지하에 묻힌 수만 톤의 맹독성 오염토를 온돌 삼아 누워있는 이탈리아 롬바르디아의 독성 지열 하우스입니다.',
        'prompt': 'Atmospheric photo of an grassy artificial mound at Seveso Oak Forest Park Italy, concrete ventilation shaft sticking out of ground surrounded by wildflowers, ominous stillness, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '볼리비아 포토시 세로 리코 해발 4,300m 은광 지하 갱도 분진 속 광부 휴게소',
        'year': '1545년 스페인 식민지 은광 개발',
        'val': '-6,500만 원 (규폐증 발병률 90%)',
        'feat': '수백 년간 수백만 명이 목숨을 잃어 \'사람을 먹는 산\'이라 불리는 지하 갱도 막장에서 실리카 분진을 마시며 코카 잎을 씹습니다.',
        'verd': '지하 악마신 \'엘 티오(El Tio)\'에게 담배와 독주를 바치며 갱도 붕괴를 면하기만을 비는 극한의 지하 광산 벙커입니다.',
        'prompt': 'Gritty realistic underground photography inside deep Cerro Rico silver mine Potosi Bolivia, miner resting beside clay devil shrine El Tio adorned with cigarettes and coca leaves, dust particles in headlamp beam, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '잠비아 카브웨 납 광산 전 세계 납 오염도 1위 마을 마당 흙먼지 텐트',
        'year': '1902년 영국 식민지 광산 개발',
        'val': '-5,000만 원 (혈중 납 농도 치명적 초과)',
        'feat': '토양 속 납 함유량이 기준치의 수십 배에 달해 아이들의 혈중 납 농도가 위험 수위를 넘는 마을 공터에 친 간이 텐트입니다.',
        'verd': '바람이 불어 흙먼지를 마실 때마다 지능 지수와 수명이 실시간으로 깎여나가는 중금속 납 범벅 하우스입니다.',
        'prompt': 'Raw documentary photograph of a canvas tent in dry dusty township of Kabwe Zambia, stark white tailings dump visible on horizon, children playing in heavy mineral lead dust, 8k.'
    },

    # Tier 5 (51..62)
    {
        'cat': 'PRISON_FACILITY',
        'title': '미국 샌프란시스코 앨카트라즈 섬 바다 안개 자욱한 D블록 암흑 독방',
        'year': '1934년 연방 교도소 개관',
        'val': '-8,000만 원 (빛 한 점 없는 완전 격리)',
        'feat': '차가운 바닷바람과 상어 들끓는 해류에 갇힌 채 빛 한 점 들어오지 않는 0.8평 시멘트 독방 바닥에 웅크려 샌프란시스코 불빛을 상상합니다.',
        'verd': '바다 건너 들려오는 도시의 파티 음악 소리가 수감자의 정신을 파괴하는 탈옥 불가능의 궁극 감옥입니다.',
        'prompt': 'Atmospheric interior photograph looking into pitch black D-Block solitary confinement cell at Alcatraz Federal Penitentiary, heavy solid steel door cracked open, damp peeling concrete walls, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '프랑스령 기아나 악마의 섬(디아블 섬) 상어 득실대는 바다 앞 쇠창살 감옥',
        'year': '1852년 나폴레옹 3세 정치범 수용소',
        'val': '-9,000만 원 (황열병 및 상어 탈출 불가)',
        'feat': '영화 <빠삐용>의 배경이 된 열대 정글 고도에서 높은 파도와 식인 상어가 감시관 역할을 하는 해안 절벽 쇠창살 감방입니다.',
        'verd': '코코넛 껍질을 엮어 뗏목을 만들지 않는 한 평생 카리브해의 거친 파도 소리만 듣다 가는 고립무원의 유배지입니다.',
        'prompt': 'Dramatic coastal photograph of a stone prison cell with rusted iron bars perched atop jagged sea cliffs of Devil\'s Island French Guiana, violent crashing ocean waves, dense jungle canopy, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '러시아 블라디미르 중앙 감옥 혹한기 0.5평 타일 바닥 취조실 옆 대기실',
        'year': '1783년 제정 러시아 수용 시설',
        'val': '-7,500만 원 (외부 면회 전면 금지)',
        'feat': '영하 35도 혹한에 난방이 끊긴 차가운 타일 바닥에서 두 손을 뒤로 결박당한 채 고함 소리와 간수의 발자국 소리를 듣습니다.',
        'verd': '도스토옙스키의 죄와 벌도 고개를 절레절레 흔들게 만드는 시베리아 한파 직격 냉동 취조실 대기석입니다.',
        'prompt': 'Cold bleak photo inside historic Vladimir Central Prison Russia, stark pale-green tiled holding cell with frosted iron barred window, bare dim incandescent bulb dangling from ceiling wire, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '미국 콜로라도 ADX 플로렌스 슈퍼맥스 교도소 23시간 독방 콘크리트 침대',
        'year': '1994년 최고 보안 등급 연방 교도소',
        'val': '-1억 1,000만 원 (인간 접촉 제로 룸)',
        'feat': '침대, 책상, 세면대가 모두 100% 일체형 콘크리트로 부어져 있으며, 하루 23시간 동안 창문 밖으로 하늘 10cm만 보이는 방입니다.',
        'verd': '인간이 느낄 수 있는 시각적, 청각적 자극을 완벽하게 차단하여 자아를 소멸시키는 첨단 적막 펜트하우스입니다.',
        'prompt': 'Minimalist sterile interior photo of a solid concrete cell at ADX Florence Supermax, poured concrete bed and desk, narrow slit window showing only a sliver of Colorado sky, absolute isolation, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '필리핀 케손 시티 감옥 수용 인원 10배 초과 야외 농구장 계단 위 칼잠 바닥',
        'year': '1953년 개설 이후 과밀화 극치',
        'val': '-3,000만 원 (숨 쉴 공간 부족 벌금)',
        'feat': '수용 인원 800명 감옥에 4,000명이 갇혀 발 디딜 틈 없는 야외 농구장 콘크리트 계단에서 옆 사람과 포개어져 칼잠을 잡니다.',
        'verd': '열대야 38도에 서로의 땀과 체온을 100% 공유하며 인간 테트리스가 되는 필리핀 과밀 수용소 익스트림 룸입니다.',
        'prompt': 'Shocking documentary photograph of hundreds of inmates sleeping shoulder-to-shoulder on open-air cracked concrete bleachers of Quezon City Jail Manila, intense tropical humidity, tangled tarps, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '남아공 로벤 섬 넬슨 만델라가 갇혔던 석회암 채석장 먼지 감방',
        'year': '1964년 아파르트헤이트 정치범 수용',
        'val': '-6,000만 원 (석회암 분진 실명 위험)',
        'feat': '눈부신 흰 석회암 채석장에서 하루 종일 곡괭이질을 한 뒤 돌아오는 2m x 2m의 차가운 돌바닥 감방에서 얇은 담요 한 장을 덮습니다.',
        'verd': '인권과 자유의 소중함을 뼛속 깊이 깨닫게 해주는 27년 독방 수감의 묵직한 역사 현장입니다.',
        'prompt': 'Historic interior photograph of Nelson Mandela\'s small solitary cell on Robben Island Cape Town, straw mat and thin blanket on bare stone floor, small barred window looking out to limestone quarry, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '베트남 꼰다오 섬 프랑스 식민지 시절 악명 높은 \'호랑이 우리\' 철창 밑',
        'year': '1940년 프랑스 식민 당국 건설',
        'val': '-5,500만 원 (생석회 투하 고문실)',
        'feat': '천장이 쇠창살로 뚫려있어 위에서 간수들이 수감자들에게 생석회 가루와 오물을 뿌리던 지하 감옥 바닥에 누워 하늘을 봅니다.',
        'verd': '식민지 시대의 잔혹함이 벽마다 스며있는 역사상 최악의 지옥 감옥 호랑이 우리(Tiger Cages) 셋방입니다.',
        'prompt': 'Chilling documentary photograph looking up from inside a concrete pit \'tiger cage\' cell on Con Dao Island Vietnam, heavy iron bars on ceiling where sunlight cuts through dust, weathered stone walls, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '터키 이스탄불 예디쿨레 요새 지하 피의 감옥 참수대 앞 짚단 바닥',
        'year': '1458년 오스만 제국 정복 요새',
        'val': '-4,500만 원 (참수된 술탄의 원혼)',
        'feat': '오스만 제국의 폐위된 술탄과 외국 대사들이 처형당하던 돌기둥 참수대 바로 옆 썩은 짚단 위에 매트리스를 깔았습니다.',
        'verd': '벽에 새겨진 죄수들의 마지막 낙서를 읽으며 등골이 오싹해지는 오스만 제국 천년 감옥의 처형장 뷰입니다.',
        'prompt': 'Atmospheric low-angle photo of dark vaulted dungeon chamber in Yedikule Fortress Istanbul, ancient stone execution block, inscriptions carved by prisoners into dark damp stone walls, torchlight, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '영국 런던탑 반역자의 문(Traitors\' Gate) 바로 옆 쥐 들끓는 만조 수로 감방',
        'year': '1078년 정복왕 윌리엄 축조',
        'val': '-7,000만 원 (만조 시 무릎까지 침수)',
        'feat': '템스강 만조 때마다 더러운 강물이 찰랑이며 들어와 쥐들이 벽돌 틈으로 기어오르는 중세 고딕식 수로 감옥입니다.',
        'verd': '앤 불린과 토머스 모어의 처형 전 마지막 비명 소리가 환청처럼 들리는 영국 왕실 공포 테마 감방입니다.',
        'prompt': 'Moody gothic photograph of flooded stone dungeon archway beside Traitors\' Gate in Tower of London, murky Thames water lapping at slimy cobblestone steps, heavy portcullis, misty fog, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '러시아 시베리아 굴라그 콜리마 수용소 극저온 벌목장 얼어붙은 통나무 막사',
        'year': '1937년 스탈린 대숙청 강제 수용소',
        'val': '-8,500만 원 (영하 60도 방한 대책 무)',
        'feat': '영하 60도 툰드라 벌목장에서 자작나무를 베어 만든 통나무 틈새로 칼바람이 불어닥치며, 젖은 빵 배급을 베개 밑에 숨겨 얼립니다.',
        'verd': '솔제니친의 수용소 군도를 1열에서 라이브로 체험하는 시베리아 혹한의 생사 결단 막사입니다.',
        'prompt': 'Stark historical documentary photograph of a snow-buried wooden gulag barrack in Kolyma Siberia, heavy frost clinging to rough log walls, wooden bunks, iron stove with faint glowing ember, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '마다가스카르 안타나나리보 안치라베 교도소 벼룩 들끓는 진흙 바닥 수용실',
        'year': '1960년대 식민지 이후 시설',
        'val': '-2,500만 원 (페스트 벼룩 방역비 미납)',
        'feat': '흙바닥에 가마니를 깔고 자며 밤마다 천장에서 떨어지는 벼룩과 빈대 떼에게 헌혈을 해야 하는 아프리카 과밀 수용소입니다.',
        'verd': '피부과 의사도 경악할 전신 가려움증을 선물하는 면역력 극한 테스트 하우스입니다.',
        'prompt': 'Gritty realistic photograph inside a dimly lit overcrowded jail cell in Madagascar, dirt floor covered in worn woven straw mats, sunlight streaming through high rusted barred slit, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '태국 방콕 방쾅 중앙교도소 사형수 대기동 족쇄 찬 바닥',
        'year': '1931년 방콕 힐튼 교도소',
        'val': '-6,500만 원 (24시간 쇠사슬 족쇄 착용)',
        'feat': '다리에 5kg짜리 쇠사슬 족쇄를 영구 용접한 채 걸을 때마다 짤랑거리는 쇳소리를 들으며 콘크리트 바닥에서 대기합니다.',
        'verd': '살벌한 규율과 찌는 듯한 방콕의 열기 속에서 자유의 무게를 5kg짜리 쇳덩이로 실감하는 방콕 힐튼 스위트입니다.',
        'prompt': 'Somber documentary photograph inside high security wing of Bang Kwang Central Prison Bangkok, polished concrete floor with heavy iron leg shackle chains resting, harsh tropical sunbeams, 8k.'
    },

    # Tier 6 (63..75)
    {
        'cat': 'MICRO_DWELLING',
        'title': '서울 신림동 고시촌 창문 없는 1.2평 복도 끝 보일러실 옆 고시원 방',
        'year': '1995년 사법시험 고시촌 전성기',
        'val': '-250만 원 (산소 부족 및 이명 현상)',
        'feat': '팔을 뻗으면 양쪽 벽이 동시에 닿고, 창문 대신 환풍기 구멍 하나만 있으며 보일러 모터가 24시간 우웅거리며 울립니다.',
        'verd': '합격의 영광을 꿈꾸며 청춘을 1.2평 관짝에 봉인한 대한민국 고시생들의 눈물이 서린 수험생 하우스입니다.',
        'prompt': 'Realistic documentary interior of an ultra-tiny 1.2 pyung gosiwon room in Sillim-dong Seoul, no window, twin single mattress touching three walls, study desk crammed with law textbooks, fluorescent tube, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '일본 도쿄 카부키초 넷카페 0.4평 가죽 리클라이너 의자 위 30일 장기 숙박석',
        'year': '2015년 넷카페 난민 거주 시설',
        'val': '-180만 원 (샤워 1회당 300엔 추가)',
        'feat': '나무 칸막이 너머로 옆방 아저씨의 코골이와 키보드 타자 소리가 실시간 중계되는 0.4평 가죽 소파 위에서 한 달째 살아갑니다.',
        'verd': '무료 음료 디스펜서와 만화책 3만 권을 보유했으나 다리를 뻗고 잘 수 없는 도쿄 사이버 난민의 은신처입니다.',
        'prompt': 'Authentic interior photo of a tiny cubicle inside a Tokyo manga net cafe, reclining pleather seat, glowing desktop monitor, narrow padded floor space, partition walls, soft neon glow, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '홍콩 삼수이포 0.6평 철창 침대 \'닭장집(Cage Home)\' 맨 아래층 바닥칸',
        'year': '1960년대 홍콩 영구 임대 철창',
        'val': '-300만 원 (월세 3,000홍콩달러)',
        'feat': '3단으로 쌓아올린 닭장 같은 철망 침대 맨 아래칸에서 자물쇠를 걸어두고 바퀴벌레와 함께 웅크려 잠듭니다.',
        'verd': '홍콩의 초호화 스카이라인 그늘 아래 인간 존엄성의 마지노선에 서 있는 0.6평 철창 케이지 하우스입니다.',
        'prompt': 'Poignant wide photograph of a historic Hong Kong cage home in Sham Shui Po, stacked wire mesh bunk cages filled with personal belongings, laundry hanging, dim yellowish light, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '서울 구로디지털단지 지하 보일러실 밸브 배관 사이 접이식 매트리스',
        'year': '1980년대 구로공단 아파트형 공장',
        'val': '-200만 원 (배관 누수 위험)',
        'feat': '뜨거운 증기 파이프가 미로처럼 얽힌 지하 3층 기계실 구석에 접이식 라꾸라꾸 침대를 펴놓고 보일러 기사의 삶을 삽니다.',
        'verd': '겨울 난방비는 확실히 0원이지만 증기 밸브가 터지면 즉시 만두처럼 쪄지는 스팀 사우나 펜트하우스입니다.',
        'prompt': 'Industrial photo of a folding cot mattress tucked between maze of insulated red and blue heating steam pipes in basement boiler room of Guro Industrial Complex Seoul, pressure gauges, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '미국 뉴욕 맨해튼 브루클린 다리 아래 노숙자 판자 텐트 골목',
        'year': '2020년 팬데믹 이후 노숙 촌',
        'val': '-400만 원 (뉴욕 경찰 불시 철거)',
        'feat': '다리 위를 달리는 수만 대의 자동차 소음과 지하철 진동이 머리 위 콘크리트 상판을 타고 24시간 귓전을 때립니다.',
        'verd': '월세 5,000달러 맨해튼 뷰를 단돈 0원에 누리는 대신 쥐 떼와의 영역 싸움을 감수해야 하는 브루클린 브릿지 언더 뷰입니다.',
        'prompt': 'Urban street photography under massive stone arches of Brooklyn Bridge New York, cluster of cardboard and nylon tents on wet pavement, distant Manhattan skyline illuminated at night, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '일본 신주쿠 지하도 골판지 하우스 4겹 보온 테이프 칭칭 감은 박스',
        'year': '1990년대 버블 붕괴 이후',
        'val': '-120만 원 (테이프 값 2만 엔)',
        'feat': '냉장고 포장 박스 4겹을 겹치고 포장용 은박 테이프를 칭칭 감아 장인 정신으로 완성한 자립형 1인용 큐브입니다.',
        'verd': '새벽 5시 첫차가 다니기 전 청소원 아저씨가 물청소를 시작하면 박스를 접어 등에 메고 떠나는 유목민 하우스입니다.',
        'prompt': 'Detailed documentary photo of a meticulously constructed cardboard shelter wrapped in silver duct tape in Shinjuku underground walkway Tokyo, tiled floor reflections, neat shoes placed outside entrance, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '대만 타이베이 용산사 공원 벤치 밑 방수포 돗자리',
        'year': '2010년 타이베이 완화구 노숙 거점',
        'val': '-80만 원 (모기향 구입비)',
        'feat': '사찰에서 피어오르는 향 연기를 맡으며 공원 나무 벤치 아래 좁은 공간에 돗자리를 펴고 타이베이의 끈적한 밤을 보냅니다.',
        'verd': '부처님의 자비 아래 모기 떼의 공습을 온몸으로 받아내는 타이베이 야외 참선 명당입니다.',
        'prompt': 'Moody night street scene at Bangka Lungshan Temple park in Taipei, bamboo mat spread under ornate wooden park bench, smoke from incense burning, damp tropical night air, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '프랑스 파리 지하철 메트로 2호선 고가 철로 밑 텐트 촌',
        'year': '2017년 난민 밀집 텐트촌',
        'val': '-350만 원 (시위 및 최루탄 노출)',
        'feat': '스타일그라드 역 인근 메트로 2호선 고가 철교 밑 콘크리트 바닥에 텐트를 닥닥 쳐놓고 파리의 겨울 추위를 견딥니다.',
        'verd': '에펠탑의 낭만 뒤에 숨겨진 유럽 대도시의 차가운 현실을 2분마다 지나가는 전철 바퀴 소리로 실감하는 고가 하우스입니다.',
        'prompt': 'Gritty urban photo beneath the elevated steel railway tracks of Paris Metro Line 2 near Stalingrad, row of colorful camping tents lining gray concrete pavement, drizzle, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '독일 프랑크푸르트 중앙역 앞 카이저슈트라세 폐건물 계단실 틈새',
        'year': '2005년 역전 슬럼화 구역',
        'val': '-280만 원 (경찰 순찰 사이렌 소음)',
        'feat': '버려진 은행 건물 2층 비상계단 난간 틈새에 매트리스를 끼워 넣고 역 앞 홍등가의 번쩍이는 네온사인을 커튼 삼아 잡니다.',
        'verd': '유럽 금융의 수도 심장부에서 가장 바닥의 삶을 관찰하는 고위험 계단실 스위트입니다.',
        'prompt': 'Atmospheric photo of a gritty stairwell landing in an abandoned building near Frankfurt Hauptbahnhof Kaiserstrasse, cracked linoleum, broken window overlooking neon lit street below, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '미국 샌프란시스코 텐더로인 디스트릭트 깨진 주사기 골목 간이 텐트',
        'year': '2021년 펜타닐 사태 중심지',
        'val': '-450만 원 (보행 안전 위험 최고 등급)',
        'feat': '길바닥에 깨진 유리와 쓰레기가 뒹굴고 좀비처럼 걸어 다니는 중독자들의 비명 소리가 밤새 메아리치는 골목길 텐트입니다.',
        'verd': '실리콘밸리의 천문학적 부와 극단적인 빈곤이 교차하는 미국 최악의 거리 체험형 텐트 하우스입니다.',
        'prompt': 'Raw documentary street photo in Tenderloin district San Francisco, small blue nylon tent on dirty sidewalk, graffitied brick wall, distant sirens, harsh city night lighting, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '영국 런던 히드로 공항 제3터미널 수하물 컨베이어 벨트 뒤 유지보수 틈새',
        'year': '2003년 불법 체류 노동자 은신처',
        'val': '-500만 원 (공항 보안법 위반 구속)',
        'feat': '수천 개의 캐리어가 덜컹거리며 굴러가는 고무 컨베이어 벨트 모터 뒤편 좁은 공간에 숨어 공항 노숙의 극치를 달립니다.',
        'verd': '톰 행크스의 영화 <터미널>을 능가하는 수하물 분류기 속 007 작전 취침 벙커입니다.',
        'prompt': 'Secretive perspective photograph behind airport baggage claim carousel at Heathrow Terminal 3, tangle of black rubber conveyor belts and sorting machinery, narrow hidden alcove, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '호주 시드니 하버 브리지 남단 교각 속 환기구 사다리 밑참',
        'year': '1932년 개통 당시 거대 화강암 교각',
        'val': '-650만 원 (국가 중요 시설 무단 침입)',
        'feat': '거대한 화강암 교각 내부 텅 빈 콘크리트 공간 속 철제 사다리 중간 참에 침낭을 묶어두고 하버 브리지의 진동을 느낍니다.',
        'verd': '오페라 하우스가 손에 잡힐 듯 가깝지만 문을 열면 50m 허공으로 추락하는 비밀 교각 펜트하우스입니다.',
        'prompt': 'Moody industrial photo inside the cavernous hollow granite pylon of Sydney Harbour Bridge, rusted steel maintenance ladders rising into darkness, tiny cot perched on landing platform, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '서울 영등포 쪽방촌 1평 남짓 여름 40도 찜통 선풍기 고장 난 방',
        'year': '1970년대 도시 빈민 쪽방',
        'val': '-200만 원 (월세 25만 원 밀림)',
        'feat': '선풍기 날개가 덜덜거리다 멈춰버린 한여름 40도의 밀폐된 1평 방에서 땀띠로 뒤덮인 등을 벽지에 대고 눕습니다.',
        'verd': '벽 하나를 사이에 두고 옆방 숨소리까지 공유하는 대한민국 근현대사의 아픔이 서린 영등포 쪽방입니다.',
        'prompt': 'Heartbreaking realistic photo inside a 1-pyung jjjokbang room in Yeongdeungpo Seoul, tiny fan with broken blades, water stained floral wallpaper, single thin stained mattress, stifling heat atmosphere, 8k.'
    }
])
print(f"REAL BAD Part 2 loaded: {len(RAW_REAL_BAD)} items")

RAW_REAL_BAD.extend([
    # Tier 7 (76..87)
    {
        'cat': 'VEHICLE',
        'title': '볼리비아 융가스 절벽에 아슬아슬하게 걸쳐진 1970년대 폐화물차 짐칸',
        'year': '1978년 추락 트럭 잔해',
        'val': '-3,500만 원 (무게중심 10cm 이동 시 추락)',
        'feat': '낭떠러지 바위턱에 앞바퀴가 걸려 허공에 뜬 덤프트럭 짐칸에 텐트를 치고 아래를 내려다보면 아득한 계곡 안개가 소용돌이칩니다.',
        'verd': '몸을 뒤척일 때마다 화물차가 삐걱거리며 기우뚱하는 세상에서 가장 심장 쫄깃한 침대입니다.',
        'prompt': 'Dramatic high-angle photograph of an old rusted cargo truck teetering on a narrow rocky spur over Yungas mountain canyon in Bolivia, misty abyss far below, precarious camp, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '몽골 고비 사막 모래폭풍 속 시동 꺼진 고물 유즈(UAZ) 승합차 안',
        'year': '1989년 소련제 군용 밴',
        'val': '-1,200만 원 (모래로 인한 엔진 완전 사망)',
        'feat': '시속 100km의 모래바람이 유리창을 때려 모래가 차 안으로 쏟아져 들어오며, 차체 틈새로 황토 먼지가 이불처럼 쌓입니다.',
        'verd': '사막 한가운데서 고립의 공포와 모래 씹히는 컵라면을 함께 맛보는 몽골 오프로드 조난 하우스입니다.',
        'prompt': 'Atmospheric photo inside a weathered Soviet UAZ van in Gobi desert, severe sandstorm howling outside, fine yellow sand accumulating on dashboard and worn vinyl seats, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '미국 알래스카 달튼 하이웨이 트럭커 눈폭풍 고립 시 사용하는 엔진룸 담요',
        'year': '2005년 대형 디젤 트랙터 트럭',
        'val': '-2,500만 원 (외기 온도 영하 45도)',
        'feat': '화이트아웃 눈폭풍으로 엔진이 꺼지면 아직 남아있는 디젤 엔진 블록의 잔열을 찾아 엔진 덮개 위에 웅크려 담요를 뒤집어씁니다.',
        'verd': '기름 냄새와 엔진 블록의 온기만이 유일한 생명줄이 되는 북극권 얼음 도로의 서바이벌 침상입니다.',
        'prompt': 'Gritty winter photo of an 18-wheeler semi-truck buried in deep snowbank along Dalton Highway Alaska, blizzard whiteout, trucker shivering under heavy thermal blanket against warm diesel engine block, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '인도 히말라야 마날리-레 도로 산사태 바위 밑 낙석 방지 터널 틈새',
        'year': '1992년 인도 국경 도로 기구(BRO) 건설',
        'val': '-1,800만 원 (낙석 관통 위험)',
        'feat': '해발 4,000m 고갯길에서 거대한 집채만 한 낙석이 터널 지붕을 뚫고 떨어진 틈새에 매트리스를 펴고 산소통을 빱니다.',
        'verd': '천장에서 언제 돌가루가 쏟아질지 모르는 공포 속에서 히말라야의 만년설을 감상하는 절체절명 터널 룸입니다.',
        'prompt': 'Dramatic high altitude photo inside a damaged concrete rockfall shed on Manali-Leh highway India, giant boulder crushed through roof, Himalayan snowy peaks visible through breach, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '파키스탄 카라코람 하이웨이 깎아지른 절벽 가장자리 기름 탱크로리 밑',
        'year': '1986년 파키스탄 유조차',
        'val': '-3,000만 원 (인화성 유증기 폭발 위험)',
        'feat': '바위산 절벽 외길에서 바퀴가 터져 멈춰 선 대형 유조차 차축 아래에 해먹을 매달아 인더스 강의 흙탕물 계곡을 내려다봅니다.',
        'verd': '머리 위에는 휘발유 3만 리터, 발밑에는 300m 수직 절벽이 있는 스릴 만점의 인더스 계곡 펜트하우스입니다.',
        'prompt': 'Vertigo photography under a colorful decorated Pakistani Bedford fuel tanker truck stopped on razor-edge dirt ledge of Karakoram Highway, deep Indus river gorge churning below, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '러시아 야쿠츠크 레나강 얼음 도로 위 멈춰 선 고물 볼보 트럭',
        'year': '1997년 시베리아 화물차',
        'val': '-2,200만 원 (해빙기 수몰 위험)',
        'feat': '얼어붙은 거대한 강바닥을 도로 삼아 달리다 얼음에 금이 가며 멈춰 서서 얼음이 녹기 전에 구조를 기다리는 침대칸입니다.',
        'verd': '바닥 밑 2m 아래에서 거대한 얼음판이 쩍쩍 갈라지는 소리가 심장을 울리는 얼음 도로 1열 관람석입니다.',
        'prompt': 'Eerie winter photo of a long-haul truck stranded on the vast frozen Lena River ice road Yakutsk, deep blue cracks in transparent ice sheet under massive tires, freezing fog, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '이집트 시나이 사막 베두인 낙타 몰이꾼 모래 먼지 천막',
        'year': '수천 년 전통의 베두인 유목',
        'val': '-600만 원 (낙타 침 냄새 서비스)',
        'feat': '거친 털로 짠 베두인 천막 옆에 무릎 꿇린 낙타 서너 마리를 바람막이 삼아 세워두고 낙타의 거친 숨소리를 들으며 잡니다.',
        'verd': '사막의 모래폭풍을 막아주는 유일한 방패가 낙타의 엉덩이뿐인 원초적 사막 유목민 하우스입니다.',
        'prompt': 'Atmospheric night photography in Sinai desert Egypt, rough black goat-hair Bedouin tent nestled against two resting dromedary camels blocking whipping desert wind, small campfire embers, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '모리타니 대서양 해안 난파된 화물선 \'유나이티드 말리카\' 기울어진 선교',
        'year': '2003년 대서양 좌초 난파선',
        'val': '-4,500만 원 (염수 침식 고철)',
        'feat': '황량한 백사장에 45도로 기울어져 좌초된 거대 냉동 화물선의 선교 조타실에서 대서양의 거친 파도를 정면으로 맞이합니다.',
        'verd': '바다와 사막이 만나는 곳에서 유령선의 선장이 되어 녹슨 키를 잡고 잠드는 해적 테마 펜트하우스입니다.',
        'prompt': 'Stunning dramatic photo inside the rusted tilted bridge of shipwreck United Malika stranded on the shores of Mauritania, massive Atlantic breakers crashing against shattered windows, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '인도네시아 수마트라 화산재 도로 옆 타이어 펑크 난 미니버스 좌석',
        'year': '2010년 시나붕 화산 폭발 잔해',
        'val': '-800만 원 (화산재 흡입 폐렴 위험)',
        'feat': '시나붕 화산 폭발로 지붕 위에 20cm의 회색 화산재가 쌓여 주저앉은 미니버스 안에서 방진 마스크를 쓰고 밤을 버팁니다.',
        'verd': '온 세상이 잿빛 흑백 영화로 변해버린 화산재 재난 영화의 주인공이 되는 수마트라 버스 룸입니다.',
        'prompt': 'Moody documentary photograph inside an abandoned public minibus covered in thick gray volcanic ash near Mount Sinabung Indonesia, surreal ashscape outside windshield, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '페루 안데스 산맥 해발 4,800m 광산 버스 지붕 위 짐칸 그물 속',
        'year': '1984년 산악 버스 지붕 개조',
        'val': '-700만 원 (저체온증 및 추락 위험)',
        'feat': '정원 초과로 버스 안에 타지 못해 지붕 위 짐칸의 타이어와 자루들 사이에 그물을 치고 영하의 안데스 바람을 맞으며 이동합니다.',
        'verd': '파란 하늘과 안데스 산맥의 능선이 360도로 파노라마처럼 펼쳐지는 목숨을 건 스카이 루프탑 좌석입니다.',
        'prompt': 'Action documentary photography on the roof rack of a crowded Andean bus winding through high mountain pass Peru at 4800m, passenger huddled in woven blanket amid luggage, snow capped peaks, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '칠레 아타카마 소금호수 횡단용 튜닝 지프차 지붕 위 찢어진 루프탑 텐트',
        'year': '2011년 사막 원정대 지프',
        'val': '-1,400만 원 (소금 부식으로 하부 녹아내림)',
        'feat': '바람이 초속 25m로 몰아쳐 루프탑 텐트 천이 찢겨 나가 차 지붕 알루미늄 판 위에서 소금 결정을 씹으며 버팁니다.',
        'verd': '차체 하부는 소금물에 절여지고 지붕 위는 강풍에 날아갈 듯 흔들리는 아타카마 사막의 지프 롤러코스터입니다.',
        'prompt': 'Dramatic night photo of a 4x4 expedition vehicle stranded in Atacama salt flats, rooftop tent canvas violently torn by gale force desert winds, dazzling starry night sky above, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '아이슬란드 링로드 겨울 폭풍에 도로 밖으로 굴러복된 렌터카 찌그러진 운전석',
        'year': '2019년 소형 렌터카 전복 사고',
        'val': '-1,800만 원 (면책 보험 미적용)',
        'feat': '블랙아이스에 미끄러져 도로 옆 눈 구덩이에 거꾸로 박힌 경차 안에서 구조대가 올 때까지 비상등 깜빡임을 조명 삼아 잡니다.',
        'verd': '세상이 뒤집힌 시야에서 눈보라 속 오로라를 감상하는 360도 전복 인테리어 하우스입니다.',
        'prompt': 'Realistic documentary photo inside an overturned small rental car stuck upside down in deep Icelandic snowbank along Ring Road, windshield cracked with frost, hazard light casting orange glow on snow, 8k.'
    },

    # Tier 8 (88..100)
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 루이지애나 아차팔라야 늪지대 악어 둥지 바로 위 삐걱거리는 통나무 데크',
        'year': '1972년 악어 사냥꾼 캠프',
        'val': '-2,800만 원 (밤마다 악어 꼬리 치기 소음)',
        'feat': '물속에서 4m 길이의 거대 앨리게이터들이 서성이는 탁한 늪물 위 50cm 높이에 대충 엮어둔 썩은 편백나무 발판입니다.',
        'verd': '잠결에 발을 헛디디면 즉시 악어의 야식이 되는 긴장감 넘치는 바이유(Bayou) 워터프론트 데크입니다.',
        'prompt': 'Atmospheric photo of a rickety cypress wood platform suspended inches above dark murky swamp water in Atchafalaya Basin Louisiana, Spanish moss hanging from trees, glowing yellow alligator eyes in water, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '베트남 메콩 델타 우기 흙탕물 넘치는 맹그로브 숲속 부유식 대나무 뗏목',
        'year': '1985년 메콩강 수상 농가',
        'val': '-1,100만 원 (우기 홍수 뗏목 유실 위험)',
        'feat': '황토색 거센 흙탕물이 굽이치는 맹그로브 뿌리에 뗏목을 묶어두고 수천 마리의 물모기 떼와 뱀을 피해 모기장 안에서 버팁니다.',
        'verd': '수위가 올라갈 때마다 집도 함께 뜨는 천연 수력 발전(?) 메콩강 수상 레지던스입니다.',
        'prompt': 'Lush moody photograph of a simple bamboo raft shack moored among tangled mangrove roots in muddy Mekong Delta during torrential monsoon flood, rain splashing on brown river, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '방글라데시 순다르반스 벵골 호랑이 출몰 맹그로브 늪지대 밀렵꾼 나무 오두막',
        'year': '1990년 꿀 채취꾼 가설 트리하우스',
        'val': '-3,200만 원 (호랑이 습격 경보 발령 구역)',
        'feat': '사람을 사냥하는 로열 벵골 호랑이를 피해 나무 위 5m 높이에 얼기설기 지어둔 오두막으로, 호랑이가 나무를 긁는 소리가 들립니다.',
        'verd': '화장실을 가려면 나무 아래로 내려가야 하는데 목숨을 걸어야 하는 진정한 서바이벌 트리하우스입니다.',
        'prompt': 'Tense atmospheric photography of a crude wooden tree platform high in Sundarbans mangrove jungle Bangladesh, dense humid fog, tiger claw scratches visible on tree trunk below, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '브라질 판타나우 침수 평원 피라냐 들끓는 물웅덩이 위 해먹',
        'year': '1998년 카우보이(판타네이루) 임시 캠프',
        'val': '-1,500만 원 (수중 낙하 시 피라냐 습격)',
        'feat': '홍수기에 광활한 늪으로 변하는 판타나우 평원에서 붉은배피라냐와 카이만이 우글거리는 물웅덩이 바로 위에 쳐둔 해먹입니다.',
        'verd': '발가락 하나만 물에 담가도 살점이 뜯겨나갈 수 있는 스릴 만점의 수중 사파리 해먹입니다.',
        'prompt': 'Dramatic wildlife travel photo of a canvas hammock strung between two gnarled trees over flooded murky wetlands in Pantanal Brazil, schooling piranhas splashing near water surface, sunset, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '인도네시아 칼리만탄 이탄습지 산불 연기 자욱한 진흙 바닥 움막',
        'year': '2015년 대규모 이탄지 화재 이후',
        'val': '-2,100만 원 (초미세먼지 PM2.5 기준치 100배)',
        'feat': '지하 이탄층이 몇 달째 꺼지지 않고 타오르며 뿜어내는 노란색 유독 연기 속에서 젖은 수건을 얼굴에 감고 누워있습니다.',
        'verd': '지구의 허파가 타들어가는 현장에서 숨을 쉴 때마다 폐가 훈제되는 천연 스모크 훈제 하우스입니다.',
        'prompt': 'Grim documentary photograph of a palm thatch hut in burning peat swamp of Kalimantan Borneo, thick suffocating yellow haze smoke, charred tree stumps, glowing embers underground, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '이탈리아 베네치아 아쿠아 알타 때 무릎까지 물 차는 반지하 창고',
        'year': '17세기 베네치아 석조 건물 지하',
        'val': '-3,500만 원 (방수 펌프 고장)',
        'feat': '만조 알람 사이렌이 울리면 하수구에서 바닷물이 역류해 방바닥에 무릎 높이까지 차오르며 장화를 신고 침대에 올라가야 합니다.',
        'verd': '세계적인 관광도시 베네치아에서 실내 수영장을 공짜로(?) 즐기는 낭만적인 침수 워터 캐슬입니다.',
        'prompt': 'Atmospheric photo inside a ground-floor Venetian canal storage room during Acqua Alta flood, emerald green seawater reflecting vaulted brick ceiling, furniture raised on cinder blocks, rubber boots, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '멕시코 유카탄 반도 정글 속 박쥐 똥 가득한 세노테 동굴 수면 위 뗏목',
        'year': '고대 마야 지하수 제단 동굴',
        'val': '-2,400만 원 (구아노 악취 및 히스토플라스마균 위험)',
        'feat': '수만 마리의 박쥐가 천장에 매달려 똥을 쏟아내는 깊은 석회암 싱크홀 동굴 수면에 뗏목을 띄워놓고 암흑 속에서 잡니다.',
        'verd': '마야의 신들이 드나들던 지하 세계의 영험한 기운과 박쥐 구아노의 강력한 암모니아 냄새를 동시에 마시는 동굴 스위트입니다.',
        'prompt': 'Eerie underground photography inside a deep water-filled cenote cave in Yucatan Mexico, wooden raft floating in turquoise water, dramatic light shaft from collapsed ceiling, bats flying, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '미국 플로리다 에버글레이즈 늪지대 비단구렁이 서식지 옆 고장 난 에어보트',
        'year': '1994년 대형 프로펠러 에어보트',
        'val': '-1,700만 원 (버마왕뱀 번식 구역)',
        'feat': '외래종 5m 버마왕뱀들이 갈대숲을 기어다니는 늪지대 한가운데 프로펠러가 부러져 멈춰 선 알루미늄 보트 좌석에서 밤을 샙니다.',
        'verd': '밤새 들려오는 풀숲 바스락거리는 소리에 한숨도 못 자고 뱀과 눈싸움을 해야 하는 파충류 왕국 룸입니다.',
        'prompt': 'Atmospheric photo of a broken down aluminum airboat stranded in tall sawgrass marshes of Florida Everglades, massive Burmese python coiled on distant log, dramatic stormy twilight sky, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '호주 노던 테리토리 바다악어 서식 맹그로브 하구 부서진 카누 안쪽',
        'year': '2001년 알루미늄 카누 난파',
        'val': '-2,600만 원 (식인 바다악어 밀집 해역)',
        'feat': '바다악어가 꼬리로 치고 지나간 찌그러진 카누 잔해 속에 몸을 숨기고 조수가 빠져나가 갯벌에 갇힌 채 구조를 기다립니다.',
        'verd': '세계에서 가장 난폭한 파충류 바다악어에게 통조림 캔 속 참치처럼 제공될 뻔한 기적의 카누 은신처입니다.',
        'prompt': 'Tense realistic photo of a battered aluminum canoe half-submerged in muddy tidal mangrove creek in Northern Territory Australia, huge saltwater crocodile sliding into water nearby, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '루마니아 도나우 삼각주 갈대밭 속 모기 떼 습격받는 낡은 목선',
        'year': '1979년 삼각주 어부 목선',
        'val': '-900만 원 (선체 누수로 하루 500L 배수)',
        'feat': '끝없이 펼쳐진 갈대 미로 숲에서 엔진이 꺼진 낡은 나무배 바닥에 물을 퍼내며 수백만 마리의 늪 모기에게 전신 헌혈을 합니다.',
        'verd': '유럽 최대의 습지에서 펠리컨의 울음소리를 들으며 모기향 10통을 피워도 소용없는 헌혈 센터 보트입니다.',
        'prompt': 'Moody twilight photo of an old weathered wooden rowboat trapped deep within dense endless reed beds of Danube Delta Romania, swarm of mosquitoes silhouetted against purple evening sky, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '콜롬비아 아마존 상류 진흙탕 홍수림 속 바나나 잎 가설 천막',
        'year': '태고의 아마존 우림',
        'val': '-1,300만 원 (독충 및 기생충 위험 구역)',
        'feat': '바나나 잎과 야자 잎을 엮어 지붕을 얹었으나 10분마다 쏟아지는 스콜에 잎이 찢겨 나가며 진흙탕 바닥에서 벌레들과 뒹굽니다.',
        'verd': '아마존의 신비로운 대자연과 피부를 파고드는 모래파리의 가려움증을 100% 생생하게 체험하는 아마존 정글 텐트입니다.',
        'prompt': 'Lush detailed photo of a makeshift shelter made of giant green banana leaves in muddy flooded Amazonian rainforest in Colombia, heavy raindrops bouncing off foliage, tropical gloom, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '미얀마 인레 호수 수초 썩어가는 수상 텃밭 구석 대나무 원룸',
        'year': '1993년 인타족 수상 가옥',
        'val': '-850만 원 (부유 텃밭 가라앉음)',
        'feat': '수초와 진흙을 엮어 호수 위에 띄워놓은 부유식 토마토 텃밭 한구석에 지은 대나무 집으로, 바닥을 디딜 때마다 밭이 출렁입니다.',
        'verd': '발밑에서 수초가 발효되며 뿜어내는 천연 메탄 향기와 잔잔한 물결을 동시에 즐기는 인레 호수 수상 방갈로입니다.',
        'prompt': 'Scenic yet rustic documentary photo of a tiny fragile bamboo hut on a floating vegetation garden in Inle Lake Myanmar, rotting water hyacinth roots, calm misty lake reflections at dawn, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '보츠와나 오카방고 델타 하마 길목 한가운데 설치된 불안한 갈대 오두막',
        'year': '1988년 삼각주 사파리 가이드 캠프',
        'val': '-3,000만 원 (하마 야간 돌진 구역)',
        'feat': '아프리카에서 가장 많은 사람을 해치는 2톤짜리 하마들이 밤마다 풀을 뜯으러 지나다니는 하마 전용 통로 바로 옆 갈대 오두막입니다.',
        'verd': '하마가 하품하며 지나갈 때 오두막 벽이 통째로 날아갈 수 있는 긴장감 1,000%의 아프리카 야생 로지입니다.',
        'prompt': 'Thrilling photography in Okavango Delta Botswana, flimsy papyrus reed hut standing beside a deeply rutted hippo trail leading into water, massive silhouette of hippo grazing in twilight, 8k.'
    },

    # Tier 9 (101..112)
    {
        'cat': 'EXTREME_NATURE',
        'title': '칠레 아타카마 사막 연강수량 0mm 달의 계곡 메마른 소금 바위 동굴',
        'year': '수천 년 풍화된 암염 동굴',
        'val': '-2,000만 원 (수분 증발로 입술 찢어짐)',
        'feat': '연간 강우량이 0에 수렴하는 지구상 가장 건조한 사막의 암염 지층 동굴로, 침을 삼키는 순간 입술과 목구멍이 바싹 말라붙습니다.',
        'verd': '달 표면에 불시착한 우주비행사처럼 절대적인 건조함과 적막 속에서 메마른 침묵을 만끽하는 우주 동굴 룸입니다.',
        'prompt': 'Surreal otherworldly photo inside a white salt-crusted rock cave in Valle de la Luna Atacama Chile, bone-dry jagged mineral walls, brilliant pink sunset glowing outside cave mouth, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '이란 다슈테 루트 지표온도 70.7도 기록된 칼루트 모래탑 그늘',
        'year': '2005년 NASA 인공위성 최고기온 관측지',
        'val': '-4,500만 원 (열사병 치사율 95%)',
        'feat': '지구 표면 온도 70도를 찍은 모래사막의 거대한 풍화 모래 기둥(칼루트) 밑 좁은 그늘막에 엎드려 계란이 즉시 익는 열풍을 견딥니다.',
        'verd': '숨을 들이쉴 때마다 기도가 불타는 듯한 사하라 뺨치는 극열 사막의 자연 오븐 하우스입니다.',
        'prompt': 'Dramatic high-heat photography of a traveler sheltering beneath the razor-sharp shadow of a massive wind-carved yardang sand tower in Dasht-e Lut Iran, intense shimmering heat mirage, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '알제리 사하라 타실리 나제르 메마른 사암 협곡 모래바람 대피 굴',
        'year': '기원전 6000년 암각화 유적지',
        'val': '-3,200만 원 (사암 붕괴 위험)',
        'feat': '사하라 사막 한가운데 깎아지른 사암 미로 협곡의 선사시대 소 암각화가 그려진 바위 처마 밑에서 모래폭풍을 피합니다.',
        'verd': '1만 년 전 선사시대 인류가 그렸던 기린과 코끼리 그림을 감상하며 모래바람을 씹는 사하라 고고학 캠프입니다.',
        'prompt': 'Stunning desert photography in Tassili n\'Ajjer sandstone canyon Algeria, ancient prehistoric rock art visible on cave ceiling, camping gear laid on red sand floor, desert wind, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 데스밸리 배드워터 해수면 아래 86m 소금 결정 평원 위 간이 차양',
        'year': '1913년 최고 기온 56.7도 기록지',
        'val': '-2,500만 원 (탈수 증세 30분 도달)',
        'feat': '북미 대륙에서 가장 낮은 해수면 아래 86m의 새하얀 소금 결정 바닥 위에 얇은 은박 차양을 치고 50도의 지옥불 열기를 버팁니다.',
        'verd': '소금 결정판이 햇빛을 반사해 위아래로 동시에 통구이가 되는 미국 데스밸리 VIP 선탠 베드입니다.',
        'prompt': 'Blinding high-key landscape photo of a thin aluminized sunshade tarp pitched on hexagonal white salt crust patterns at Badwater Basin Death Valley, extreme heat distortion waves, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '나미비아 나미브 사막 붉은 모래언덕 아래 500년 된 고목 그늘막',
        'year': '데드블레이 900년 전 말라죽은 아카시아',
        'val': '-1,800만 원 (물 공급 반경 200km 전무)',
        'feat': '새하얀 점토 바닥 위에 검게 타버린 500년 된 마른 낙타가시나무 고목 그늘에 침낭을 깔고 300m 높이의 붉은 사구(Dune 45)를 봅니다.',
        'verd': '살바도르 달리의 초현실주의 그림 속으로 걸어 들어간 듯한 초현실적 황량함을 선사하는 데드블레이 고목 스위트입니다.',
        'prompt': 'Iconic surreal photograph in Deadvlei Namib-Naukluft Park Namibia, dark petrified camelthorn tree silhouetted against glowing orange sand dune in morning sun, pristine white clay pan, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '오만 빈 사막(룹알할리) 끝없는 모래바다 속 낙타 가죽 비박 텐트',
        'year': '아라비아 반도 엠프티 쿼터(Empty Quarter)',
        'val': '-2,200만 원 (나침반 고장 사막 미아 위험)',
        'feat': '프랑스 면적보다 넓은 모래언덕 바다의 한복판에서 낙타 가죽 텐트를 치고 밤이 되면 영하로 떨어지는 극단적 일교차와 싸웁니다.',
        'verd': '인류 문명의 흔적이 1mm도 없는 완전한 무(無)의 공간에서 우주의 고독을 독점하는 빈 사막 펜트하우스입니다.',
        'prompt': 'Breathtaking vast landscape photo of a single traditional camel leather tent dwarfed by colossal golden crescent dunes of the Empty Quarter Rub\' al Khali Oman, sea of sand, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '호주 그레이트 빅토리아 사막 붉은 스피니펙스 풀밭 속 함석판 바람막이',
        'year': '1970년대 아웃백 생존 기지',
        'val': '-1,600만 원 (맹독성 이스턴브라운스네이크 서식)',
        'feat': '바늘처럼 뾰족한 스피니펙스 가시 풀밭 사이에 녹슨 함석판 두 장을 맞대어 세우고 파리 떼의 공습을 받으며 부시 음식을 먹습니다.',
        'verd': '세상에서 가장 독한 뱀과 독거미들이 밤마다 텐트 문안 인사를 오는 호주 아웃백 붉은 대지의 와일드 룸입니다.',
        'prompt': 'Rustic wide photograph in Great Victoria Desert Australia, red sand plains covered in spiky spinifex grass clumps, rusted corrugated tin windbreak shelter, lone dead gum tree, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '이집트 백사막 석회암 버섯 바위 밑 사막여우 발자국 옆 침낭',
        'year': '수백만 년 바람 침식 백악질 석회암',
        'val': '-1,400만 원 (모래 씹히는 베두인 차 제공)',
        'feat': '바람에 깎여 거대한 버섯 모양으로 남은 순백의 석회암 바위 그늘에 누워 밤마다 먹이를 찾아오는 귀여운 사막여우와 눈을 맞춥니다.',
        'verd': '마치 설원에 온 듯한 착각을 불러일으키는 하얀 바위 조각 정원 속에서 모래 바람을 맞이하는 백사막 야외 침실입니다.',
        'prompt': 'Magical nighttime photo in White Desert Egypt, sleeping bag laid beside a massive mushroom-shaped chalk rock formation, tiny fennec fox glowing in campfire light, milky way above, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '볼리비아 우유니 소금사막 한가운데 바람에 흔들리는 소금벽돌 1평 대피소',
        'year': '1995년 소금 채취 광부 임시 대피소',
        'val': '-2,700만 원 (우기 호수 범람 침수)',
        'feat': '사방 100km가 순백의 소금으로만 이루어진 평원 한가운데 소금 벽돌을 쌓아 지은 대피소로, 벽을 핥으면 100% 천연 암염 맛이 납니다.',
        'verd': '식탁 소금은 평생 무한 리필이지만 밤마다 고산병과 영하 20도 혹한의 칼바람이 불어닥치는 소금 왕국 대피소입니다.',
        'prompt': 'Minimalist stark photograph of a crude small shelter built entirely of rectangular salt blocks standing isolated in center of infinite Salar de Uyuni Bolivia, mirror water reflection, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '예멘 소코트라 섬 용혈수 나무 그늘 아래 돌무더기 바람막이',
        'year': '외계 생태계 소코트라 고유종',
        'val': '-3,500만 원 (외부 연락 수단 단절)',
        'feat': '외계 행성에 온 듯 버섯 모양으로 우거진 용혈수(Dragon Blood Tree) 붉은 수액 나무 밑에 돌을 쌓아 인도양 몬순 강풍을 피합니다.',
        'verd': '지구상 다른 어디서도 볼 수 없는 기괴한 외계 식물들의 호위를 받으며 잠드는 소코트라 섬의 판타지 캠프입니다.',
        'prompt': 'Otherworldly landscape photo on Dixam plateau Socotra Yemen, sleeping camp sheltered behind limestone rocks beneath canopy of umbrella-like Dragon Blood trees, crimson dusk sky, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '수단 누비아 사막 고대 피라미드 모래에 묻힌 기단부 틈새 쉘터',
        'year': '기원전 700년 메로에 왕국 유적',
        'val': '-2,800만 원 (세계문화유산 무단 숙박)',
        'feat': '이집트보다 가파른 각도로 솟아오른 메로에 검은 피라미드 기단부 모래 언덕에 방수포를 깔고 고대 파라오의 침묵을 엿듣습니다.',
        'verd': '관광객이 1년에 10명도 안 오는 황량한 사막 피라미드를 단독 전세 낸 듯 누리는 누비아 왕국의 은밀한 야영지입니다.',
        'prompt': 'Stunning historic desert photo at Meroe pyramids Sudan, slender steep sandstone pyramids half buried in shifting orange sand dunes, lone traveler tent at base, golden hour, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '사우디아라비아 네푸드 붉은 모래사막 석유 파이프라인 그늘 속 매트리스',
        'year': '1950년 횡단 아라비안 파이프라인(Tapline)',
        'val': '-3,000만 원 (원유 배관 보안 순찰 구역)',
        'feat': '사막을 끝없이 가로지르는 직경 1m짜리 거대한 원유 수송 파이프 밑바닥 그늘에 매트리스를 깔고 파이프 속 석유 흐르는 소리를 듣습니다.',
        'verd': '세계 에너지의 혈관 바로 아래서 원유의 진동을 마사지 삼아 잠드는 아라비아 석유 파이프라인 룸입니다.',
        'prompt': 'Industrial surreal photo in red sand Nefud desert Saudi Arabia, massive steel crude oil pipeline stretching straight to horizon, mattress laid in narrow shaded underbelly of pipe, 8k.'
    },

    # Tier 10 (113..124)
    {
        'cat': 'MICRO_DWELLING',
        'title': '서울 종로 낙원상가 옥상 1968년식 오래된 환풍탑 뒤편 비밀 비닐 텐트',
        'year': '1968년 주상복합 건축 기념물',
        'val': '-150만 원 (하부 악기상가 드럼 비트 소음)',
        'feat': '대한민국 1세대 주상복합 건물 옥상 환풍기 뒤편에 비닐을 둘러쳐 지었으며, 아래층 악기상가에서 올라오는 색소폰 소리를 듣습니다.',
        'verd': '종로의 화려한 도시 빌딩 숲과 탑골공원을 발아래 두고 음악 소리에 취하는 빈티지 옥상 펜트하우스입니다.',
        'prompt': 'Urban rooftop photography atop historic Nakwon Arcade in Jongno Seoul, weathered vinyl tent tucked behind massive aged ventilation shaft, dramatic view of Seoul skyline at dusk, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '부산 자갈치시장 건어물 골목 생선 비린내 환풍기 직격 2층 합판 다락방',
        'year': '1975년 수산시장 부속 창고',
        'val': '-180만 원 (생선 냄새 영구 흡착)',
        'feat': '건어물과 멸치 건조장 대형 환풍구가 바로 창문 앞에 있어 24시간 고소하면서도 퀴퀴한 바다 비린내가 온 방안을 가득 채웁니다.',
        'verd': '자갈치 아지매들의 우렁찬 목소리와 비린내 가득한 부산의 정취를 온몸으로 흡수하는 수산시장 1열 다락방입니다.',
        'prompt': 'Atmospheric photo inside a tiny wooden mezzanine room in Jagalchi Fish Market Busan, large industrial exhaust vent blowing air across window, strings of dried squid hanging, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '대구 서문시장 야시장 리어카 보관 창고 틈새 접이식 야전침대',
        'year': '1982년 시장 물류 창고',
        'val': '-120만 원 (새벽 야시장 철수 소음)',
        'feat': '야시장이 끝나고 밀려 들어오는 수십 대의 납작만두, 떡볶이 조리 리어카 사이에 접이식 야전침대를 끼워 넣고 잠을 잡니다.',
        'verd': '새벽 내내 참기름과 고기 굽는 잔여 향기가 코를 자극해 밤새 배가 고파지는 미식가 테마 창고 룸입니다.',
        'prompt': 'Detailed night documentary photo inside packed street food cart storage garage at Seomun Market Daegu, folding cot crammed between steel food stalls, aroma steam, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '대전 중앙시장 순대골목 가마솥 증기 뿜어져 나오는 처마 밑 평상',
        'year': '1970년대 대전역 앞 전통시장',
        'val': '-110만 원 (사골 육수 증기 얼굴 찜질)',
        'feat': '24시간 돼지 사골 국물이 펄펄 끓는 대형 가마솥 바로 위 처마 밑 평상에 누워 무료 안면 스팀 마사지를 받으며 잠듭니다.',
        'verd': '돼지국밥과 순대 냄새가 뼛속까지 배어들어 배고플 틈이 없는 대한민국 전통시장 사골 스팀 하우스입니다.',
        'prompt': 'Street photography in traditional Daejeon market sundae alley, wooden resting bench situated directly beside massive boiling soup caldrons billowing thick fragrant white steam, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '광주 양동시장 홍어 숙성 항아리 창고 바로 옆 관리인용 1평 샌드위치 판넬방',
        'year': '1985년 홍어 전문 유통 단지',
        'val': '-160만 원 (암모니아 가스 정화 마스크 필수)',
        'feat': '항아리 수백 개에서 알싸하게 삭아가는 칠산 바다 삭힌 홍어 창고 바로 옆방으로, 눈을 깜빡이기만 해도 눈물이 찔끔 납니다.',
        'verd': '코가 뻥 뚫리고 뇌세포가 각성하는 대한민국 최고의 천연 비염 치료 명당이자 암모니아 아로마 테라피 룸입니다.',
        'prompt': 'Documentary photo of a tiny sandwich-panel guard room adjacent to dark cellar filled with hundreds of traditional fermented skate fish earthenware onggi jars in Gwangju Yangdong Market, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '일본 도쿄 긴자 나카긴 캡슐 타워 철거 전 녹물 나오는 2평 원형 창문 방',
        'year': '1972년 구로카와 기쇼 메타볼리즘 걸작',
        'val': '-5,000만 원 (석면 제거 및 누수 철거 판정)',
        'feat': '원형 우주선 창문이 달린 2평짜리 메타볼리즘 캡슐에서 수도꼭지를 틀면 갈색 녹물이 콸콸 쏟아지는 건축 유산의 말기 방입니다.',
        'verd': '미래주의 건축의 황혼기에서 건축 애호가들의 성지 순례를 온몸으로 버텨내는 전설의 캡슐 펜트하우스입니다.',
        'prompt': 'Retro-futuristic interior photograph of a dilapidated pod inside Nakagin Capsule Tower Ginza Tokyo, iconic round porthole window looking out to expressway, peeling modular fixtures, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '홍콩 몽콕 야시장 네온사인 간판 바로 뒤 3층 베란다 철망 침대',
        'year': '1988년 구룡반도 번화가 건물',
        'val': '-250만 원 (밤새 번쩍이는 붉은 네온 불빛)',
        'feat': '거대한 한자 네온사인 간판 뒷면의 고압 변압기 웅웅거리는 소리와 붉은색 네온 불빛이 방 전체를 클럽처럼 물들입니다.',
        'verd': '암막 커튼이 없으면 잠을 잘 수 없지만 왕가위 영화 속 주인공의 우수를 100% 느끼는 홍콩 느와르 룸입니다.',
        'prompt': 'Atmospheric cyberpunk-esque street photo looking from inside a narrow balcony in Mong Kok Hong Kong, sleeping bed positioned inches behind towering glowing red and yellow neon shop signs, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '대만 타이난 노포 우육면집 주방 뒤 육수 끓는 열기 가득한 쪽방',
        'year': '1962년 타이난 구도심 노포',
        'val': '-130만 원 (주방 섭씨 42도 유지)',
        'feat': '팔각과 한약재를 넣고 48시간 우려내는 우육면 솥 바로 뒤편 얇은 합판 벽 너머에 누워 땀을 뻘뻘 흘립니다.',
        'verd': '주방장 아저씨의 고함 소리와 국수 건지는 소리가 자장가처럼 들리는 대만 미식 골목의 찜통 스위트입니다.',
        'prompt': 'Intimate street food documentary photo inside tiny storage alcove directly behind steamy commercial kitchen of traditional beef noodle shop in Tainan Taiwan, giant simmering stock pots, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '태국 치앙마이 야시장 로티 팬케이크 마차 뒤편 접이식 의자',
        'year': '2016년 타패 게이트 야시장',
        'val': '-90만 원 (연유 끈적임 주의)',
        'feat': '달콤한 바나나 로티를 굽는 뜨거운 마가린 철판 바로 뒤에 접이식 낚시 의자를 펴고 누워 배낭여행자들의 발걸음을 지켜봅니다.',
        'verd': '연유와 누텔라 향기가 코를 찌르고 음악 소리가 쿵쾅거리는 치앙마이 야시장의 중심부 명당(?)입니다.',
        'prompt': 'Vibrant colorful street photography behind a busy outdoor roti pancake cart at Chiang Mai night market, glowing gas burners, sizzling butter, small canvas stool in narrow stall gap, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '베트남 하노이 기차길 마을 기차가 10cm 거리로 스쳐 지나가는 테라스',
        'year': '1902년 프랑스 식민지 철도 부설',
        'val': '-220만 원 (창틀 충돌 위험)',
        'feat': '열차가 지나갈 때마다 의자와 테이블을 벽에 밀착시키지 않으면 박살 나는 하노이 구시가지 철로 바로 옆 1층 테라스입니다.',
        'verd': '하루 두 번 열차의 차가운 강철 옆면과 하이파이브를 나눌 수 있는 세상에서 가장 스릴 넘치는 철길 셋방입니다.',
        'prompt': 'Dramatic close-up photograph of a massive blue diesel train rumbling through Hanoi train street just inches away from open cafe terrace door, vintage tiled floor, fluttering laundry, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '말레이시아 페낭 조지타운 백년 된 중국계 연립주택 어두운 중정 틈새',
        'year': '1910년 해협 식민지 숍하우스',
        'val': '-170만 원 (흰개미 및 박쥐 서식)',
        'feat': '빛이 거의 들지 않는 좁고 긴 숍하우스 한가운데 환기용 중정(Airwell) 바닥에 대나무 의자를 펴고 눅눅한 열대야를 견딥니다.',
        'verd': '페낭의 유네스코 문화유산 주택이지만 낮에도 컴컴하고 습기가 차는 페라나칸 역사의 그림자 방입니다.',
        'prompt': 'Moody architectural photo inside a long narrow historic shophouse airwell courtyard in George Town Penang, weathered turquoise walls with peeling plaster, single shaft of tropical light, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '영국 콘월 해안 절벽 위 새똥으로 뒤덮인 폐쇄된 해안경비대 감시대',
        'year': '1938년 2차 대전 해안 감시 초소',
        'val': '-3,400만 원 (갈매기 배설물 두께 10cm)',
        'feat': '거친 대서양 파도가 몰아치는 절벽 꼭대기 콘크리트 초소에 갈매기 수천 마리가 둥지를 틀어 온 바닥과 창문이 하얀 새똥으로 덮였습니다.',
        'verd': '영국 해협의 장엄한 바다 뷰를 단독 소유했으나 갈매기들의 맹렬한 쪼기와 똥 폭탄을 감수해야 하는 조류 공포 하우스입니다.',
        'prompt': 'Dramatic coastal view of a weathered concrete World War II lookout bunker perched on jagged cliffs of Cornwall England, thickly encrusted with white seabird guano, turbulent Atlantic waves below, 8k.'
    }
])
print(f"REAL BAD Total loaded: {len(RAW_REAL_BAD)} items")
