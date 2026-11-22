# -*- coding: utf-8 -*-
"""
125 New Curated BAD FICTION House Entries (Tiers 01 - 10)
Inspired by iconic dark fantasy, movies, anime, sci-fi, webtoons, and gaming disasters.
"""

from scripts.build_data_real_bad import CATEGORY_MAP

RAW_FIC_BAD = [
    # Tier 1 (0..12)
    {
        'cat': 'FICTION_MEDIA',
        'title': '『다크 소울』 병자의 마을 독늪 바닥 거대 모기 날아다니는 썩은 판자 움막',
        'year': '로드란의 잊혀진 지하 암흑기',
        'val': '-9억 9,000만 소울 (독 해독 이끼 덩어리 품귀)',
        'feat': '발목까지 썩은 독수(毒水)에 잠겨 독침을 쏘는 거대 날파리와 화염 들개들을 피해 삐걱거리는 썩은 나무판자 위에 웅크려 잡니다.',
        'verd': '프레임 드랍과 맹독 중독이 동시에 찾아오는 다크 소울 유저들의 영원한 PTSD 성지 하우스입니다.',
        'prompt': 'Dark fantasy digital concept art of a decrepit rotting timber shack submerged in toxic green sludge swamp at bottom of Blighttown from Dark Souls, giant blood-red mosquitoes hovering, toxic mist, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『오징어 게임』 줄다리기 게임 탈락자 대기실 녹슨 철제 관 침상',
        'year': '제33회 오징어 게임',
        'val': '-456억 원 (상금 잔여 채무 및 위약금)',
        'feat': '분홍색 리본이 묶인 관 뚜껑이 언제 닫힐지 모르는 서늘한 지하 복도에서 456명의 탈락자 명단을 바라보며 칼잠을 잡니다.',
        'verd': '탈락하면 즉시 소각장으로 직행하는 오징어 게임 최하위 참가자 전용 익스트림 관짝 룸입니다.',
        'prompt': 'Cinematic psychological thriller concept art of an ominous black coffin bed tied with a vibrant pink ribbon in cold brutalist tiled hallway from Squid Game, harsh neon lighting, dramatic shadows, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『리그 오브 레전드』 자운 최하층 부식성 화학 공학 폐수 방류관 옆 철망 다락',
        'year': '화공 남작들의 지하 착취 시대',
        'val': '-3,000골드 (화공 폐 손상 보상금 0원)',
        'feat': '필트오버에서 버려진 독성 화학 가스(자운 그레이)와 초록빛 폐수 방류관 바로 옆 철망 바닥에 침낭을 묶어두고 잡니다.',
        'verd': '숨을 쉴 때마다 녹색 화학 증기가 기관지를 세척(?)해주는 자운 지하 빈민가의 리얼 화공 테크 룸입니다.',
        'prompt': 'Arcane style gritty cyberpunk fantasy concept art inside lowest sump level of Zaun, rickety metal mesh sleeping perch suspended beside glowing green chemtech toxic drainage pipes, industrial haze, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『해리 포터』 아즈카반 디멘터 순찰 복도 끝 얼어붙은 독방 바닥 짚단',
        'year': '마법사 세계의 혹한기',
        'val': '-500갈레온 (모든 행복한 기억 압류 완료)',
        'feat': '디멘터가 복도를 스쳐 지나갈 때마다 창문이 얼어붙고 인생에서 가장 끔찍한 기억들만 강제로 재생되는 북해 고도의 독방입니다.',
        'verd': '행복한 감정을 0.1초도 허용하지 않는 마법부 지정 궁극의 멘탈 탈곡기 아즈카반 스위트입니다.',
        'prompt': 'Grim gothic fantasy concept art inside a freezing dark stone solitary cell in Azkaban fortress, frost spreading on iron bars as hooded Dementor silhouette glides outside misty corridor, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '『매드맥스: 분노의 도로』 시타델 워보이 배기관 열기 뿜어내는 라디에이터 해먹',
        'year': '물과 기름이 고갈된 포스트 아포칼립스',
        'val': '-800구아스 (임모탄 조의 은총 0개)',
        'feat': 'V8 엔진의 뜨거운 배기가스가 뿜어져 나오는 거대 트럭 라디에이터 바로 뒤에 해먹을 걸고 은색 락카를 입에 뿌리며 잠듭니다.',
        'verd': '발할라로 기억받으며 갈 수 있는 불멸의 워보이 전용 섭씨 80도 찜통 모빌리티 하우스입니다.',
        'prompt': 'Mad Max post-apocalyptic concept art of a grease-smeared warboy hammock strung directly behind the roaring smoking chrome radiator exhaust pipes of a colossal battle rig, desert dust storm, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『지옥락』 신선향 섬 식인 연꽃 밭 한가운데 거대 나비 번데기 껍질 속',
        'year': '신선들이 타천한 불로불사 시대',
        'val': '-1,000만 냥 (타오 흡수당해 단약으로 변환)',
        'feat': '사람의 얼굴을 한 기괴한 나비와 식인 연꽃들이 밤마다 타오(氣)를 빨아먹으려 촉수를 뻗치는 거대 번데기 껍질 안쪽 침낭입니다.',
        'verd': '겉보기엔 극락정토의 아름다운 꽃밭이지만 잠드는 순간 인간 단약으로 착즙되는 신선향 미스터리 룸입니다.',
        'prompt': 'Surreal anime fantasy concept art inside a translucent giant butterfly chrysalis hollow, surrounded by sinister human-faced lotus flowers in eerie glowing paradise jungle from Hell\'s Paradise, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『원피스』 임펠다운 레벨 4 초열지옥 펄펄 끓는 피 연못 바로 위 철망 당번실',
        'year': '대해적시대 세계정부 최고 감옥',
        'val': '-2억 베리 (마젤란 서장의 독가스 위험 수당)',
        'feat': '펄펄 끓는 피 연못과 거대한 가마솥 열기가 치솟는 철망 바닥 위에서 죄수들을 감시하며 땀범벅이 된 채 뻗어 잡니다.',
        'verd': '지하 4층의 살벌한 화염 열기 덕분에 사시사철 불지옥 찜질방 무료 이용권을 누리는 해군 당번석입니다.',
        'prompt': 'Epic anime concept art inside Impel Down Level 4 Blazing Hell, suspended grated steel watch platform over bubbling cauldrons of boiling red blood lake, towering black iron pillars, volcanic glow, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『사이버펑크 2077』 나이트시티 외곽 쓰레기 매립지 고장 난 냉동고 캡슐',
        'year': '2077년 나이트시티 교외 덤프',
        'val': '-500에디 (사이버웨어 고철 분해 위기)',
        'feat': '덱스터 드숀에게 버려진 낡은 냉동고 문짝을 걷어차고 들어가 고장 난 사이버웨어 쓰레기 산을 베개 삼아 밤을 지새웁니다.',
        'verd': '조니 실버핸드의 잔소리와 함께 나이트시티의 화려한 네온 스카이라인을 쓰레기 더미 위에서 바라보는 밑바닥 룸입니다.',
        'prompt': 'Moody cyberpunk concept art of a battered rusted freezer turned into a makeshift sleeping pod amid mountains of electronic junk in Night City badlands landfill, distant neon city glow, acid rain, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『바이오하자드』 라쿤시티 하수도 거대 악어 서식지 배수 밸브 틈새 쉘터',
        'year': '1998년 T-바이러스 라쿤시티 참사',
        'val': '-3억 원 (엄브렐러사 비밀 연구소 폐기물)',
        'feat': 'T-바이러스에 감염되어 20m로 거대화된 돌연변이 악어가 하수도를 순찰할 때마다 수압 밸브 위에 매달려 숨을 죽입니다.',
        'verd': '녹색 허브 하나만 쥐고 하수도 오물 냄새를 맡으며 엄브렐러 특수부대를 기다리는 바이오하자드 서바이벌 룸입니다.',
        'prompt': 'Survival horror concept art inside dark slimy Raccoon City sewer junction, yellow hazard light, giant mutated alligator silhouette swimming in murky flooded drain, rusted valves, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『체인소 맨』 지옥의 어둠의 악마 영역 잘려나간 우주비행사 기도 손 아래',
        'year': '태초의 공포가 지배하는 영겁',
        'val': '-6억 엔 (악마와의 계약으로 수명 전부 헌납)',
        'feat': '반으로 갈라져 두 손을 모아 기도하는 우주비행사 시체들이 도열한 지옥의 초원 한가운데 어둠의 악마 그림자 밑에 눕습니다.',
        'verd': '소리를 내는 순간 팔다리가 분해되는 근원의 공포 속에서 지옥의 문고리를 쳐다보는 궁극의 공포 스위트입니다.',
        'prompt': 'Surreal haunting anime concept art of Chainsaw Man Hell, row of bisected astronaut corpses with praying hands lining a grassy plain under black sky with floating wooden doors, absolute dread, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『엘든 링』 에오니아 늪 붉은 부패 결정 동굴 해충들 기어다니는 구석',
        'year': '파쇄전쟁 말레니아의 붉은 에오니아 개화기',
        'val': '-9억 룬 (보존하는 이끼약 품절)',
        'feat': '붉은 부패가 온몸을 갉아먹는 분홍색 포자 안개 속에서 새우 모양의 부패의 권속들이 실을 뿜는 결정 동굴 벽에 웅크려 잡니다.',
        'verd': '말레니아의 부패 꽃이 만개한 케일리드의 독성 중심부에서 매초 피가 깎여나가는 진정한 빛바랜 자의 똥지게방입니다.',
        'prompt': 'Dark fantasy digital art inside a crystal cave dripping with crimson rot spores in Swamp of Aeonia Elden Ring, glowing red fungal growths, chittering Pests in background shadows, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『폴아웃』 볼트 87 방사능 3,000라드 슈퍼뮤턴트 배양 수조 옆 고장 난 숙소',
        'year': '2077년 대전쟁 이후 FEV 실험 구역',
        'val': '-5,000병뚜껑 (라드어웨이 1,000개 필요)',
        'feat': '입구부터 방사능이 3,000라드를 찍어 1분 만에 뼈까지 익어버리는 FEV 바이러스 초록색 배양 수조 옆 부서진 볼트 침대입니다.',
        'verd': '슈퍼뮤턴트로 강제 진화당하기 직전 핍보이의 방사능 경고 비프음을 자장가 삼아 잠드는 볼트텍 최악의 실험실입니다.',
        'prompt': 'Fallout post-apocalyptic retro-futuristic concept art inside irradiated Vault 87 laboratory, glowing green FEV biochemical vats, broken Vault-Tec steel bunk bed, warning klaxons, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『데드 스페이스』 USG 이시무라호 의료구역 네크로모프 환풍구 틈새 비박실',
        'year': '2508년 플래닛 크랙 채굴선 참사',
        'val': '-7억 크레딧 (플라즈마 커터 탄약 0발)',
        'feat': '피로 물든 의료구역 바닥에서 벽을 뚫고 튀어나오는 슬래셔와 러커들을 피해 환풍기 모터 틈새에 숨어 숨소리를 죽입니다.',
        'verd': '"하나가 되자"라는 환청이 귓가에 맴돌며 아이작 클라크가 문을 부수고 오기만을 기다리는 공포의 채굴선 셋방입니다.',
        'prompt': 'Claustrophobic sci-fi survival horror concept art inside bloodstained medical bay of USG Ishimura Dead Space, flickering holographic displays, dark ceiling vent with metallic claw scraping, 8k.'
    },

    # Tier 2 (13..25)
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『워해머 40,000』 하이브 시티 최하층 시체 재활용 공장 슬러지 파이프 틈',
        'year': '제41천년기 인류제국 암흑기',
        'val': '-10억 크레디트 (시체 녹말 1회 배급권 교환)',
        'feat': '수십억 명이 버린 폐기물과 시체를 끓여 전 인류의 식량인 \'시체 녹말(Corpse-Starch)\'로 만드는 배관 바로 밑의 침상입니다.',
        'verd': '황제 폐하에 대한 충성심 하나로 시체 썩는 단백질 슬러지 냄새를 견뎌내는 하이브 월드 최하층 언더하이브 룸입니다.',
        'prompt': 'Grimdark gothic industrial concept art inside the colossal depths of a Warhammer 40k Hive City Underhive, massive rusted corpse-starch processing pipes dripping grey slime, skulls, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『메트로 2033』 모스크바 지하철 방사능 침수 터널 곰팡이 핀 낡은 드레진 보트',
        'year': '핵전쟁 20년 후 모스크바 지하 메트로',
        'val': '-50군용 5.45mm 탄약 (방독면 필터 2개 잔여)',
        'feat': '방사능 곰팡이가 벽면을 가득 채운 침수된 지하철 선로 위에 낡은 손잡이 펌프 드레진을 띄워두고 노살리스 돌연변이를 경계합니다.',
        'verd': '지상에는 악마들이 날아다니고 지하에는 괴물들이 울부짖는 모스크바 메트로의 외로운 수상(?) 침대입니다.',
        'prompt': 'Atmospheric post-apocalyptic concept art inside a flooded metro tunnel of Moscow Metro 2033, rusty hand-pump railcar floating in stagnant water, bioluminescent green moss on tunnel walls, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『스타워즈』 타투인 사막 거대 사르락(Sarlacc) 구덩이 소화 점액벽 틈새',
        'year': '은하 제국 시대 자바 더 헛의 처형장',
        'val': '-10만 은하 크레딧 (1,000년간 천천히 소화)',
        'feat': '거대 촉수와 수천 개의 이빨이 꿈틀대는 사르락의 위벽 소화액 분비선 틈새에 매달려 1,000년 동안 소화되는 고통을 기다립니다.',
        'verd': '보바 펫도 제트팩으로 겨우 탈출했던, 은하계에서 가장 소화가 잘 되는(?) 궁극의 유기농 캡슐 하우스입니다.',
        'prompt': 'Sci-fi creature concept art inside the slimy organic digestive throat of the giant Great Pit of Carkoon Sarlacc on Tatooine, acidic enzymes dripping from fleshy walls, skeletal remains, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『블레이드 러너』 로스앤젤레스 2019 산성비 쏟아지는 폐건물 옥상 네온 간판 뒤',
        'year': '2019년 11월 디스토피아 LA',
        'val': '-3,000달러 (보이트-캄프 테스트 불합격)',
        'feat': '24시간 멈추지 않는 유독성 산성비를 피하기 위해 게이샤 얼굴이 번쩍이는 거대 전자 광고판 뒷면 변압기 그늘에 숨어 있습니다.',
        'verd': '"모든 기억이 빗속의 눈물처럼 사라질 것"이라는 로이 배티의 명대사를 온몸으로 젖어가며 곱씹는 사이버펑크 옥상방입니다.',
        'prompt': 'Iconic cyberpunk digital concept art on a rainy neon-drenched rooftop in Blade Runner Los Angeles, towering holographic geisha billboard illuminating puddles, flying spinner cars in smog, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『신세기 에반게리온』 제3신도쿄시 전투 후 무너진 지오프론트 잔해 철골 틈새',
        'year': '2015년 사도 습격 이후 폐허',
        'val': '-8,000만 엔 (LCL 용액 오염 구역)',
        'feat': '사도의 십자가 폭발로 천장이 뚫려 붉은 피바다가 된 지오프론트 피라미드 잔해 철골 사이에 돗자리를 깔고 신지의 비명을 듣습니다.',
        'verd': '인류보완계획이 시작되기 전 LCL 바다 냄새를 맡으며 내면의 고독과 대화하는 네르프 지하 셋방입니다.',
        'prompt': 'Evangelion anime aesthetic concept art inside ruined GeoFront cavern beneath Tokyo-3, shattered inverted pyramid headquarters surrounded by sea of red liquid, massive steel I-beams, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『아키라』 네오도쿄 올림픽 스타디움 지하 극저온 아키라 캡슐 앞 콘크리트 잔해',
        'year': '2019년 네오도쿄 올림픽 지하 공사장',
        'val': '-1억 엔 (카네다의 바이크 연료비 미납)',
        'feat': '영하 273도의 냉동 보관 캡슐 주변에 서리가 하얗게 피어오르는 지하 거대 구덩이에서 테츠오의 각성 두통 소리를 견딥니다.',
        'verd': '폭주하는 초능력과 군대의 탱크 폭격 사이에서 힘겹게 자리를 지키는 네오도쿄의 파멸 1열 관람석입니다.',
        'prompt': 'Akira anime inspired cinematic concept art deep beneath Neo-Tokyo Olympic Stadium, massive cryogenic sphere surrounded by towering cracked concrete scaffolding and frozen nitrogen vapor, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『베르세르크』 일식의 제물 강마의 의식 마물들 뼈 무덤 사이 피 웅덩이',
        'year': '매의 단 일식의 의식의 날',
        'val': '-999조 원 (제물의 낙인 찍힌 영혼)',
        'feat': '목덜미에서 제물의 낙인 피가 솟구치고 수만 마리의 사도들이 동료들을 씹어 삼키는 거대한 얼굴 언덕 피바다 한가운데 눕습니다.',
        'verd': '가츠의 드래곤 슬레이어가 휘둘러지기 전까지 단 1초도 살아남을 수 없는 절대 절망의 다크 판타지 밑바닥입니다.',
        'prompt': 'Epic dark fantasy digital painting of Berserk Eclipse altar, towering mountain of grotesque demonic faces, blood red sky with black eclipsed sun, horrifying apostle silhouettes in fog, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『공각기동대』 신하마시 폐수 처리 구역 침수된 구형 사이보그 폐기물 드럼통',
        'year': '2029년 네트워크 정보화 사회',
        'val': '-4,500만 엔 (고스트(Ghost) 해킹 경보)',
        'feat': '버려진 전뇌 케이블과 의체 윤활유가 둥둥 떠다니는 수로에서 찌그러진 오일 드럼통 안에 들어가 유선 접속 케이블을 연결합니다.',
        'verd': '네트워크의 바다는 광대하지만 나의 거처는 0.2평 고철통인 사이버네틱스 시대의 서글픈 디스토피아 하우스입니다.',
        'prompt': 'Ghost in the Shell aesthetic cyberpunk concept art in industrial drainage canal of New Port City, submerged cybernetic limbs and glowing optical fiber cables tangled around rusted drum, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『워킹데드』 교도소 철창 바깥 워커들이 손 뻗는 0.3평 초소',
        'year': '좀비 아포칼립스 2년 차',
        'val': '-2,000달러 (산탄총 탄약 3발)',
        'feat': '썩어가는 좀비 수백 마리가 철조망을 흔들며 으르렁거리는 감시탑 계단 밑 0.3평 철망 구석에서 도끼를 쥐고 쪽잠을 잡니다.',
        'verd': '언제 철조망이 무너져 좀비들의 뷔페 식사가 될지 모르는 숨 막히는 아포칼립스 초소입니다.',
        'prompt': 'Atmospheric zombie apocalypse photography of a narrow guard sentry box outside West Georgia Correctional Facility from The Walking Dead, walkers crowding against chainlink fence, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『매트릭스』 현실 세계 기계도시 배양액 방출 하수관 녹슨 파이프 위',
        'year': '2199년 기계 전쟁 이후 현실 세계',
        'val': '-9,000만 달러 (빨간 약 복용 후 영구 추방)',
        'feat': '인간 배양 포드에서 버려진 분홍색 젤리 배양액이 콸콸 쏟아져 내리는 거대 파이프 위에서 전신 털이 다 뽑힌 채 덜덜 떱니다.',
        'verd': '가상현실의 스테이크 대신 차가운 하수관에서 현실의 쓴맛을 제대로 맛보는 네오의 각성 직후 하우스입니다.',
        'prompt': 'Matrix movie concept art inside slimy metallic waste drainage tunnel beneath human harvesting towers, pink nutrient fluid flowing through giant cracked corrugated pipes, dark dystopian wires, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『블러드본』 야남 구시가지 붉은 달 아래 맹수들 울부짖는 시계탑 목조 비계',
        'year': '야수 사냥의 밤',
        'val': '-50만 유지 (발광 수치 99% 도달)',
        'feat': '듀라의 개틀링건 사격이 빗발치는 야남 구시가지 허공에 매달린 썩은 목조 사다리 비계에서 피 냄새를 맡으며 웅크립니다.',
        'verd': '붉은 달이 떠오르며 인간이 야수로 변해가는 거리를 내려다보는 야수 사냥꾼 전용 비명 펜트하우스입니다.',
        'prompt': 'Bloodborne gothic horror concept art on rickety wooden scaffolding high above burning Victorian gothic town of Old Yharnam, blood red moon in night sky, cloaked beasts prowling below, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『둠(DOOM)』 화성 UAC 기지 지옥 포털 열린 플라즈마 필터 정비 구역',
        'year': '2149년 아전트 에너지 포털 붕괴',
        'val': '-6,666만 달러 (둠가이의 분노 게이지 Max)',
        'feat': '벽면에서 피가 흘러내리고 악마들의 살점이 엉켜있는 플라즈마 냉각관 틈새에서 샷건 장전 소리를 들으며 공포에 떱니다.',
        'verd': '헤비메탈 기타 리프가 울려 퍼질 때마다 악마들이 찢겨 나가는 둠 슬레이어의 학살 구역 청소부 대기실입니다.',
        'prompt': 'Doom eternal inspired sci-fi hell concept art inside corrupted Martian UAC facility, glowing pentagrams carved into high-tech titanium consoles, demonic flesh infesting plasma conduits, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『스타크래프트』 저그 군단 타소니스 차르 행성 점막(Creep) 뒤덮인 낡은 벙커',
        'year': '종족 전쟁 차르 행성 대침공',
        'val': '-150미네랄 (스팀팩 부작용 치료비)',
        'feat': '저그의 보라색 꿈틀거리는 점막이 문틈으로 밀고 들어와 침대를 집어삼키는 테란의 고립된 콘크리트 벙커 구석입니다.',
        'verd': '밖에서는 저글링들이 강철 문을 긁어대고 안에서는 점막 종양이 자라나는 테란 해병의 마지막 생존 초소입니다.',
        'prompt': 'Starcraft sci-fi concept art inside a dilapidated Terran bunker infested with pulsating purple Zerg creep biomass creeping through cracked blast doors, fiery volcanic wastes of Char outside, 8k.'
    }
]
print(f"FIC BAD Part 1 loaded: {len(RAW_FIC_BAD)} items")

RAW_FIC_BAD.extend([
    # Tier 3 (26..37)
    {
        'cat': 'FICTION_MEDIA',
        'title': '『스폰지밥』 플랑크톤의 미끼식당 찌꺼기 튀김기 기름 찌든 배수구 구석',
        'year': '비키니 시티 최악의 요식업',
        'val': '-5센트 (게살버거 비밀 레시피 훔치기 실패 벌금)',
        'feat': '손님이 단 한 명도 오지 않는 냄새나는 미끼죽(Chum) 튀김기 기름때 묻은 배수관 틈새에 서서 카렌의 컴퓨터 잔소리를 듣습니다.',
        'verd': '집게리아의 황금빛 성공을 바다 밑바닥에서 질투 어린 시선으로 바라보는 비키니 시티 최하층 은신처입니다.',
        'prompt': 'Cartoon concept art inside grimy interior of Chum Bucket from Spongebob, rusted green industrial vat with purple chum sludge dripping, microscopic cot in the shadows, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '『포켓몬스터』 로켓단 나옹이가 동전 줍다 빠진 로켓단 열기구 버너 밑바구니',
        'year': '관동지방 피카츄 포획 작전 1,000회 차',
        'val': '-500엔 (열기구 가스 연료비 미납)',
        'feat': '피카츄의 10만 볼트를 맞고 "우린 또 날아가네~!"를 외치며 추락하기 직전의 그을린 나옹이 모양 열기구 바구니 구석입니다.',
        'verd': '매일 하늘로 날아가 별이 되는 익스트림 비행 체험을 보장하는 로켓단 전용 무중력 탈출석입니다.',
        'prompt': 'Anime inspired concept art inside scorched wicker basket of Team Rocket Meowth balloon, charred sandbags and smoking burner above, soaring high in cloudy blue sky, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『심슨 가족』 모의 선술집 맥주 찌꺼기 냄새 진동하는 화장실 변기통 뒤',
        'year': '스프링필드 1989년',
        'val': '-25달러 (바니 검블의 밀린 술값 연대보증)',
        'feat': '바니 검블이 토해놓은 더프 맥주 찌꺼기와 모의 험악한 욕설이 들려오는 불결한 선술집 화장실 칸막이 뒤에 돗자리를 폈습니다.',
        'verd': '스프링필드의 어두운 밑바닥에서 호머 심슨의 바보짓을 생생한 오디오로 감상하는 모의 타번 스위트입니다.',
        'prompt': 'Grotesque comic concept art inside the grimy dingy bathroom of Moe\'s Tavern from The Simpsons, rusted cracked toilet, dirty neon reflection on stained tile floor, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『토이 스토리』 불량소년 시드의 폭약 실험용 로켓 매달린 흙구덩이',
        'year': '1995년 픽사 첫 장편 시절',
        'val': '-8달러 (장난감 수술 실패 보상금)',
        'feat': '머리통이 뽑힌 인형들과 용접된 기괴한 장난감들이 묻혀있는 진흙 구덩이에서 메가 베이비의 외눈박이 감시를 받으며 웅크립니다.',
        'verd': '시드가 폭약 \'빅 원(The Big One)\' 도화선에 불을 붙이기 전에 탈출해야 하는 장난감들의 지옥 탈출 룸입니다.',
        'prompt': 'Dramatic toy-scale perspective photo looking out from muddy trench in Sid\'s destructive backyard in Toy Story, broken doll heads on mechanical spider legs, explosive rocket strapped nearby, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『인크레더블』 신드롬의 옴니드로이드 로봇 폐기장 잘려나간 집게발 안쪽',
        'year': '2004년 노마니산 섬 비밀 기지',
        'val': '-2,000만 달러 (슈퍼히어로 제거 프로젝트 잔해)',
        'feat': '인크레더블과의 전투로 잘려나간 전투 로봇 옴니드로이드의 거대한 강철 관절 속에서 기름때를 닦으며 잠을 청합니다.',
        'verd': '화산 분화구 폭포 뒤편에 숨겨진 악당의 섬에서 로봇 고철을 이불 삼아 덮는 슈퍼빌런 연구실 폐기장입니다.',
        'prompt': 'Cinematic retro-futuristic concept art inside the severed hollow mechanical claw of an Omnidroid robot in volcanic jungle scrap heap on Nomanisan Island, tropical steam, 8k.'
    },
    {
        'cat': 'CLOSET',
        'title': '『몬스터 주식회사』 란달의 위장 벽지 고장 나서 지지직거리는 옷장 틈새',
        'year': '2001년 인간 아이 비명 채취 시대',
        'val': '-150만 비명 볼트 (스캔들에 의한 회사 파산)',
        'feat': '카멜레온 괴물 란달이 피부 색깔을 위장하다가 고장 나서 지지직거리는 도트 무늬 벽지 옷장 틈새에 끼어 숨을 죽입니다.',
        'verd': '인간 아이의 양말 하나만 떨어져도 CDA 방역 요원들이 출동해 온몸을 면도당하는 위험천만 옷장 룸입니다.',
        'prompt': 'Whimsical yet tense concept art inside a child\'s bedroom closet from Monsters Inc, wooden door cracked open showing high-tech door station frame, camouflage wallpaper glitching into static, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『괴물의 아이』 떫은 감나무 밑 멧돼지 수인들이 침 뱉고 지나간 멍석',
        'year': '이계의 짐승들의 거리 쥬텐가이',
        'val': '-10만 냥 (쿠마테츠의 청소 독촉)',
        'feat': '시끄러운 짐승 수인들이 고기를 뜯으며 싸우는 쥬텐가이 저잣거리 뒤편 떫은 감나무 아래에 낡은 멍석을 깔고 누워있습니다.',
        'verd': '쿠마테츠가 수련한답시고 목검을 휘두를 때마다 돌풍이 불어 멍석이 날아가는 무도파 괴물 제자의 마당방입니다.',
        'prompt': 'Studio Ghibli / Mamoru Hosoda style anime concept art beneath a bitter persimmon tree in bustling beast market of Jutengai, worn straw mat, lanterns glowing in dusty alley, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『주술회전』 특급 주령 다곤의 영역 바다 거대 식인 물고기 뼈 둥지',
        'year': '시부야 사변 직전 주령 밀담',
        'val': '-8,000만 엔 (사멸회유 참가비)',
        'feat': '아름다운 열대 해변의 탈을 썼으나 바닷속에서 식인 거대 어류 식신 \'사담충\'들이 튀어나와 뼈만 남겨놓은 암초 둥지입니다.',
        'verd': '토우지가 유운을 들고 쳐들어와 영역을 찢어버리기 전까지 편안한(?) 해변 휴양을 즐기는 특급 주령의 백사장입니다.',
        'prompt': 'Jujutsu Kaisen anime style digital art on tropical beach inside Dagon\'s Domain Expansion, massive bleached fish skeletons piled like a grotesque nest on white sand, ominous ocean waters, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『귀멸의 칼날』 도우마의 무한빙당 얼어붙은 연꽃 연못 얼음 밑바닥',
        'year': '다이쇼 시대 상현의 이 거처',
        'val': '-1억 엔 (만세극락교 헌금 전액 갈취)',
        'feat': '극저온의 혈귀술 얼음 연꽃 가루가 공기 중에 흩날려 들이마시는 순간 폐포가 얼어 터지는 영하 50도 얼음 연못 밑바닥입니다.',
        'verd': '도우마의 가짜 미소를 보며 신도가 되어 녹아내릴 것인지 얼어붙을 것인지 선택하는 만세극락교 냉동실입니다.',
        'prompt': 'Demon Slayer aesthetic dark fantasy concept art inside Doma\'s Infinity Ice Palace, frozen lotus pond with razor-sharp ice crystals, pale lotus flowers emitting freezing mist, blood stains on ice, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『나루토』 비 마을 페인 천도 탑 아래 비 365일 들이치는 배수 파이프',
        'year': '아카츠키 본거지 비 마을',
        'val': '-5,000만 냥 (페인의 감지 감우술 24시간 감시)',
        'feat': '페인이 차크라를 섞어 내리는 비를 365일 맞으며 거대한 강철 조각상 얼굴 파이프 아래에서 컵라면 물을 받습니다.',
        'verd': '아카츠키의 리더가 위에서 내려다보는 신의 탑 그늘에서 비에 젖은 양말을 말리지 못하는 비 마을 배관실입니다.',
        'prompt': 'Naruto inspired dark anime concept art of towering industrial monoliths in Rain Village, colossal metallic pipe draining rainwater, lone ninja cloak sheltering in conduit opening, heavy rain, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『원펀맨』 Z시 괴인 출몰 폐허 구역 사이타마가 집세 안 내고 사는 옆집 잔해',
        'year': '괴인 다발 발생 재해 지역',
        'val': '-0원 (공짜 거주지만 매일 미사일 폭격)',
        'feat': '귀급, 용급 괴인들이 수시로 건물을 부수고 지나가 벽 절반이 뚫려있으나 사이타마가 옆집에 살아 이상하게 안 죽는 폐허입니다.',
        'verd': '언제 벽을 뚫고 괴인의 주먹이 날아올지 모르지만 인근 마트 특가 세일 전단지를 보며 마음을 달래는 Z시 생존 룸입니다.',
        'prompt': 'One Punch Man anime style ruined cityscape in City Z abandoned zone, cracked concrete apartment building with outer wall blown off, Saitama\'s apartment laundry hanging nearby, craters, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『보노보노』 포로리 누나들이 때리고 지나간 속 빈 호두나무 그루터기',
        'year': '동물 숲속의 일상',
        'val': '-30도토리 (호두 껍질 압류)',
        'feat': '포로리의 포악한 누나 도로리와 아로리가 발차기를 날리고 간 호두나무 밑동에 숨어 호두 껍질을 베개 삼아 누워있습니다.',
        'verd': '"나 때릴 거야?"를 물어볼 틈도 없이 날아오는 숲속 폭력의 현장을 피할 수 있는 유일한 다람쥐 방공호입니다.',
        'prompt': 'Cute yet melancholy anime forest concept art inside a hollow mossy walnut tree stump, tiny bed made of dried leaves and cracked walnut shells, soft dappled sunlight filtering through woods, 8k.'
    },

    # Tier 4 (38..50)
    {
        'cat': 'CLOSET',
        'title': '『해리 포터』 더즐리 가문 프리벳가 4번지 계단 밑 먼지투성이 벽장',
        'year': '1991년 호그와트 입학 전야',
        'val': '-100파운드 (거미와 동침비)',
        'feat': '두들리가 계단을 뛰어내려올 때마다 천장에서 석고 가루와 거미가 머리 위로 떨어지는 1평짜리 계단 밑 벽장입니다.',
        'verd': '마법 세계를 구원할 영웅도 어린 시절엔 거미줄을 치우며 쪽잠을 잤던 전설의 프리벳가 계단 밑 스위트입니다.',
        'prompt': 'Detailed cinematic interior of the cupboard under the stairs at 4 Privet Drive, narrow wooden cot squeezed between coats and boots, cobwebs in corners, dust motes falling from sloped wooden ceiling, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『강철의 연금술사』 글러트니의 뱃속 무한한 가짜 진리의 문 피바다 위 잔해',
        'year': '인조인간 식인 공간 창조기',
        'val': '-5,000만 센즈 (출구 없는 무한 공간)',
        'feat': '글러트니가 삼켜버린 부서진 도시의 건물 잔해와 유혈이 낭자한 붉은 바다 위에서 에드워드의 연금술 탈출을 기다립니다.',
        'verd': '하늘도 땅도 없이 피의 수평선만 펼쳐진 가짜 진리의 공간에서 뼈다귀를 건져 올리는 인조인간 내장 룸입니다.',
        'prompt': 'Fullmetal Alchemist dark anime concept art inside Gluttony\'s stomach dimension, endless shallow sea of dark red blood, ruined ancient stone archways and pillars scattered under pitch black sky, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『은혼』 카부키초 해결사 사무소 긴토키의 단 거 흘린 소파 밑 먼지 소굴',
        'year': '에도 시대 말기 천인(외계인) 침공',
        'val': '-300만 엔 (집세 6개월 연체로 오토세가 문 부숨)',
        'feat': '딸기 우유와 파르페 흘린 자국이 굳어 끈적거리는 가죽 소파 아래 신구라와 사다하루의 털 뭉치 사이에서 웅크려 잡니다.',
        'verd': '당뇨 위험 군 긴토키의 나태한 한숨 소리와 점프 만화책 뒹구는 소리가 울려 퍼지는 에도 최고의 백수 하우스입니다.',
        'prompt': 'Anime comedy concept art inside the messy Yorozuya agency living room in Kabukicho Gintama, scuffed wooden floor, spilled strawberry milk on carpet under worn sofa, scattered Jump manga, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『진격의 거인』 월 마리아 지하 지하실 에렌 아빠의 비밀 지하실 구석 쥐구멍',
        'year': '845년 초대형 거인 벽 파괴 이전',
        'val': '-3억 마르크 (지하실 열쇠 분실 위험)',
        'feat': '거인의 발소리가 쿵쾅거리는 지상 아래 그리샤 예거가 인류의 비밀 노트를 숨겨둔 책장 뒤 어두운 지하실 구석입니다.',
        'verd': '지하실 열쇠를 꽂기 전까지는 벽 바깥 세계의 진실도 알 수 없고 곰팡이 냄새만 맡아야 하는 월 마리아 지하실입니다.',
        'prompt': 'Attack on Titan anime concept art inside Dr. Yeager\'s dusty secret basement laboratory under Wall Maria, antique apothecary jars, heavy locked mahogany desk drawer, shafts of dusty light, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『주토피아』 툰드라 타운 미스터 빅의 북극곰 부하들이 얼음물 담그는 냉동 창고',
        'year': '주토피아 마피아 전성기',
        'val': '-50만 주토 달러 (얼음물 입수 강제 집행)',
        'feat': '마피아 보스 미스터 빅에게 무례하게 굴었다가 거대 북극곰 경호원들에게 붙잡혀 영하 20도 얼음 구멍 위에 매달려 잡니다.',
        'verd': '"얼음물에 담가버려(Ice \'em)"라는 한마디에 심장이 얼어붙는 툰드라 타운 마피아 냉동 창고 스위트입니다.',
        'prompt': 'Disney Zootopia style noir concept art inside Mr. Big\'s icy warehouse in Tundra Town, towering polar bear guards in black suits, open circular ice hole in frozen floor revealing subzero water, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '『괴수 8호』 괴수 해체 전문 청소업체 내장 찌꺼기 수거 차량 짐칸',
        'year': '괴수 방위대 청소 외주 시대',
        'val': '-40만 엔 (괴수 악취 제거 샤워비 별도)',
        'feat': '해체된 거대 괴수의 썩어가는 내장과 악취 나는 소화액 찌꺼기를 가득 실은 청소 트럭 짐칸 뒤편에 방호복을 입고 눕습니다.',
        'verd': '카프카가 괴수를 먹고 괴수 8호로 각성하기 전의 짠내 나는 인생을 체험하는 괴수 잔여물 트럭 하우스입니다.',
        'prompt': 'Kaiju No. 8 anime aesthetic concept art inside the rear cargo bay of a monster disposal cleanup truck, rubber hoses, piles of iridescent slimy kaiju organ tissue, industrial yellow hazmat gear, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『체인소 맨』 덴지가 포치타와 살던 쓰레기 가득한 판자촌 1룸',
        'year': '야쿠자 채무 노예 시절',
        'val': '-3,804만 엔 (야쿠자 빚과 장기 매매 잔액)',
        'feat': '잼도 없이 곰팡이 핀 식빵 한 조각을 포치타와 나눠 먹으며 겨울엔 전기 장판도 없이 서로 껴안고 체온으로 버티던 판잣집입니다.',
        'verd': '꿈에 그리던 \'식빵에 잼 발라 먹기\'를 소원으로 품고 살던 덴지의 눈물겨운 밑바닥 원룸입니다.',
        'prompt': 'Gritty anime realism concept art of Denji\'s dilapidated wooden shack in Chainsaw Man, leaking corrugated roof, single stained futon on sagging tatami mat, Pochita resting on empty wooden box, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『도쿄 구울』 안테이크 지하 11구 아오기리 나무 고문실 야모리의 펜치 옆 의자',
        'year': '구울 대책국(CCG) 격돌기',
        'val': '-1,000에서 7을 빼면 얼마지? (영구 고문실)',
        'feat': '빨간 피지네가 귓속으로 기어들어가고 열 손가락 발가락을 펜치로 뜯기며 머리카락이 백발로 변하는 고문 의자입니다.',
        'verd': '카네키 켄이 각성하여 구울의 왕이 되기 전 지옥의 고통을 겪었던 피 묻은 타일 바닥 고문실입니다.',
        'prompt': 'Tokyo Ghoul dark anime concept art inside Yamori\'s tiled torture chamber, bloodstained dental chair with heavy iron leather straps, rusty pliers on steel tray, red Chinese centipede on floor, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『헌터x헌터』 키르아 조르딕 가문 고문실 전기 채찍 매달린 지하 감옥',
        'year': '암살자 일족 조르딕 가문 본가',
        'val': '-50억 제니 (암살 가문 내림 고문)',
        'feat': '100만 볼트 전기가 흐르는 채찍을 맞으면서도 "간지럽다"고 하품을 해야 하는 조르딕 가문의 혹독한 신부 수업(?) 감옥입니다.',
        'verd': '웬만한 사람은 3초 만에 숯덩이가 되는 전기 고문을 일상 트레이닝으로 즐기는 킬러 패밀리 스위트입니다.',
        'prompt': 'Hunter x Hunter anime concept art inside Zoldyck family dungeon torture chamber, massive iron chains suspended from stone ceiling, electrical sparks arcing across metal shackles, dim torchlight, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『데스노트』 류크가 사과 껍질 던져놓은 사신계 황량한 뼈 언덕',
        'year': '시간이 멈춘 사신의 세계',
        'val': '-0원 (사과 한 알이면 영혼도 팜)',
        'feat': '도박이나 하며 썩어가는 사신들이 뒹구는 해골과 뼈로 가득한 황량한 암석 언덕에서 먼지를 맞으며 앉아있습니다.',
        'verd': '싱싱하고 즙이 터지는 빨간 사과가 없으면 몸이 뒤틀리는 사신 류크의 따분함 100% 사신계 야외 취침석입니다.',
        'prompt': 'Death Note aesthetic surreal digital painting of the Shinigami realm, desolate landscape of giant bleached skeletons and crumbling skulls under sickly pale yellowish-green sky, floating bones, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『죠죠의 기묘한 모험』 디오의 관 밑바닥 대서양 해저 100년 잠긴 상자',
        'year': '1889년 조나단 죠스타 사망 이후 100년',
        'val': '-100년의 고독 (스탠드 \'더 월드\' 충전 중)',
        'feat': '조나단의 목을 자르고 차지한 몸으로 두꺼운 강철 관 속에 갇혀 대서양 깊은 바닷속에서 100년간 햇빛을 보지 못하고 갇혀 있습니다.',
        'verd': '인양선이 끌어올려 줄 때까지 100년간 시간 멈추기 연습이나 해야 하는 궁극의 흡혈귀 심해 관짝입니다.',
        'prompt': 'JoJo\'s Bizarre Adventure inspired gothic concept art of DIO\'s heavy brass-inlaid ornate steel coffin lying encrusted with barnacles on the dark ocean trench floor, deep blue abyss water, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『나의 히어로 아카데미아』 빌런 연합 지하 아지트 곰팡이 핀 바 카운터 밑',
        'year': '올포원 은신처 아지트',
        'val': '-3,000만 엔 (쿠로기리의 워프 게이트 대기실)',
        'feat': '시가라키 토무라가 아버지 손을 얼굴에 얹고 손톱을 긁는 삐걱거리는 낡은 바 카운터 밑에서 올마이트 암살 작전을 엿듣습니다.',
        'verd': '언제 프로 히어로들이 벽을 부수고 스매시를 날릴지 모르는 빌런 연합의 음침한 지하 술집 셋방입니다.',
        'prompt': 'My Hero Academia anime style concept art inside League of Villains underground dive bar, worn mahogany bar counter with dusty liquor bottles, sinister shadows, single hanging vintage lamp, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『카이지』 제애그룹 지하 노역장 1일 외출권 못 사고 페리카 탕진한 침상',
        'year': '제애그룹 비밀 지하 제국 건설장',
        'val': '-9,000만 페리카 (킨구 닭꼬치와 아사히 맥주 유혹 패배)',
        'feat': '지하 갱도에서 온종일 바위를 나르고 번 9,100페리카를 시원한 캔맥주와 닭꼬치 한 꼬치에 탕진하고 눈물의 후회를 씹는 침상입니다.',
        'verd': '"범죄적인 맛이야...!"를 외치며 탕진하고 다시 15년 노동 형벌에 들어가는 카이지의 지하 노역소 매트리스입니다.',
        'prompt': 'Kaiji anime inspired underground construction labor camp dormitory, cramped three-tiered raw wooden bunks, exhausted workers in grey prison jumpsuits, flickering fluorescent lamps, dust, 8k.'
    },

    # Tier 5 (51..62)
    {
        'cat': 'SPACESHIP',
        'title': '『카우보이 비밥』 비밥호 고장 난 냉장고 안 1년 방치된 정체불명 외계생명체 옆',
        'year': '2071년 우주 현상금 사냥꾼 비밥호',
        'val': '-5,000우롱 (냉장고 우주 투기 처리비)',
        'feat': '스파이크가 먹다 남겨둔 바닷가재가 1년 동안 냉장고 안에서 숙성되어 독성 슬라임 괴물로 진화한 냉동실 틈새에 갇힙니다.',
        'verd': '물리면 온몸이 마비되어 쓰러지는 전설의 괴생명체와 함께 우주 공간으로 방출될 위기의 비밥호 냉장고 룸입니다.',
        'prompt': 'Cowboy Bebop retro anime concept art inside the dark rusty interior of the Bebop\'s neglected freezer, glowing bioluminescent green moss and alien sludge oozing from ancient lobster container, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『스타크래프트』 짐 레이너가 마린 시절 갇혔던 뉴 폴섬 초극비 교도소 독방',
        'year': '자치령 최고 보안 감옥 뉴 폴섬',
        'val': '-8,000만 크레딧 (멩스크 황제의 영구 감금령)',
        'feat': '용암이 끓어오르는 화산 행성 뉴 폴섬의 중장갑 레이저 철창 안에서 신경 재사회화(Resocialization) 수술을 기다립니다.',
        'verd': '히페리온이 교도소를 폭파하고 구출하러 오기 전까지 용암 복도를 바라보며 버텨야 하는 테란 자치령 감옥입니다.',
        'prompt': 'Starcraft sci-fi concept art inside high security cell of New Folsom prison, thick titanium walls, glowing red forcefield barrier looking out over bubbling lava plains, industrial steam, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『하프라이프 2』 17번 지구 콤바인 검문소 바로 밑 파괴된 맨홀 쉘터',
        'year': '외계 콤바인 7시간 전쟁 이후 점령기',
        'val': '-0원 (수분 배급 쿠폰 1장)',
        'feat': '외계 콤바인 순찰대 바이저가 번쩍이고 콤바인 스캐너가 플래시를 터뜨리는 맨홀 뚜껑 바로 아래서 쇠지렛대(크로우바)를 쥐고 숨습니다.',
        'verd': '"깨어나세요, 고든 리맨"을 기다리며 브린 박사의 선전 방송을 스피커로 강제 청취하는 17번 지구 하수도입니다.',
        'prompt': 'Half-Life 2 dystopian industrial concept art inside ruined sewer directly beneath City 17 Combine checkpoint, Combine Scanner drone hovering above grate, concrete rubble, surveillance camera, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『포탈(Portal)』 애퍼처 사이언스 버려진 동면실 터렛들이 겨누고 있는 복도',
        'year': '글라도스(GLaDOS) 신경독 살포 이후',
        'val': '-1억 달러 (케이크는 거짓말(The Cake is a Lie))',
        'feat': '하얀 계란 모양의 앙증맞은 터렛들이 "거기 있나요?"라고 속삭이며 빨간 레이저 조준선을 머리에 꽂는 테스트 챔버 복도입니다.',
        'verd': '포탈건도 없이 글라도스의 비꼬는 조롱 방송을 들으며 신경독 가스를 마셔야 하는 애퍼처 사이언스 실험실입니다.',
        'prompt': 'Portal video game aesthetic minimalist testing chamber, pristine white modular panels with rusted stains, three cute white Aperture sentry turrets with red laser sights locked on viewer, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『에일리언』 노스트로모호 환기 덕트 페이스허거 알 깨진 자리 옆',
        'year': '2122년 제노모프 첫 접촉',
        'val': '-5억 달러 (웨이랜드 유타니 극비 회수 명령)',
        'feat': '끈적거리는 산성 침이 뚝뚝 떨어지는 좁은 환풍 덕트에서 가죽 같은 외계인 알이 열리고 튀어나온 페이스허거의 발소리를 듣습니다.',
        'verd': '우주에서는 아무도 당신의 비명 소리를 들을 수 없다는 영화 포스터의 진리를 온몸으로 증명하는 환기구 하우스입니다.',
        'prompt': 'Alien 1979 classic sci-fi horror concept art inside narrow metallic air duct of USCSS Nostromo, open leathery xenomorph egg sac dripping slime on grate floor, motion tracker blip, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『터미네이터』 미래 전쟁 스카이넷 헌터킬러 잔해 뼈밭 위 벙커',
        'year': '2029년 인간 저항군 생존 구역',
        'val': '-9,000만 달러 (플라즈마 라이플 잔여 배터리 10%)',
        'feat': '불타버린 인간들의 두개골이 바다처럼 깔린 폐허에서 거대한 스카이넷 헌터킬러 폭격기의 서치라이트를 피해 콘크리트 구덩이에 숨습니다.',
        'verd': '존 코너의 저항군 무전을 기다리며 은색 엔도스켈레톤의 붉은 눈빛을 경계하는 심판의 날 이후 하우스입니다.',
        'prompt': 'Terminator post-apocalyptic future war concept art, vast ground covered in crushed human skulls, glowing red eyes of T-800 Endoskeleton in smoky ruins, searchlight beam cutting through fog, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『매트릭스』 사이퍼가 스테이크 먹던 레스토랑 뒤 쓰레기 수거 통',
        'year': '매트릭스 가상현실 1999년 시뮬레이션',
        'val': '-1,000달러 (가짜 스테이크 잔반)',
        'feat': '"무지가 축복이다"라며 스미스 요원과 밀담을 나누던 고급 스테이크 하우스 뒷골목 쓰레기통 옆에서 쥐들과 함께 남은 고기를 먹습니다.',
        'verd': '초록색 디지털 코드가 비처럼 쏟아지는 골목길에서 달콤한 환상의 잔반을 맛보는 배신자의 쓰레기통 룸입니다.',
        'prompt': 'The Matrix cyberpunk aesthetic green-tinted night alleyway behind luxury restaurant, rain-slicked wet asphalt, garbage bins, green digital code streaming faintly over brick textures, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『월-E』 지구 쓰레기 타워 꼭대기 모래폭풍 몰아치는 월-E의 컨테이너 창고 구석',
        'year': '2805년 인류가 버리고 떠난 지구',
        'val': '-0원 (반짝이는 크리스마스 전구 3줄)',
        'feat': '수백 미터 높이의 사각 압축 쓰레기 빌딩 꼭대기 바퀴벌레 한 마리와 함께 낡은 컨테이너 안에서 지포 라이터 불빛을 켭니다.',
        'verd': '모래폭풍이 불면 문을 닫고 비디오 테이프 속 춤추는 연인들을 보며 사랑을 꿈꾸는 지구 최후의 로봇 창고입니다.',
        'prompt': 'Pixar Wall-E inspired cinematic concept art inside weathered shipping container home atop towering garbage cube skyscraper, glowing string lights, vintage VHS tape player, red dust storm outside, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『사이버펑크: 엣지러너』 데이비드 마르티네즈의 세탁기 고장 난 0.8평 메가빌딩 방',
        'year': '2076년 산토 도밍고 메가빌딩 H4',
        'val': '-2,500에디 (트라우마 팀 골드 멤버십 연체)',
        'feat': '어머니가 사고로 세상을 떠나고 밀린 집세를 내지 못해 문에 빨간 압류 홀로그램 딱지가 붙은 0.8평 아파트 침대입니다.',
        'verd': '산데비스탄을 등에 박기 전 나이트시티의 잔인한 현실에 온몸으로 짓밟히던 데이비드의 눈물 젖은 메가빌딩 룸입니다.',
        'prompt': 'Cyberpunk Edgerunners anime style interior of tiny decrepit apartment in Megabuilding H4, glitching eviction hologram notice floating over yellow door, broken washing machine leaking water, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『디스트릭트 9』 요하네스버그 외계인 격리 수용소 고양이 사료 캔 뒹구는 판잣집',
        'year': '2010년 프라운(Prawn) 격리 구역',
        'val': '-1,200랜드 (고양이 사료 10캔 교환)',
        'feat': '외계인들이 가장 좋아하는 고양이 사료 캔 껍질이 산더미처럼 쌓인 양철 판잣집에서 외계 무기 밀매업자들의 총성을 듣습니다.',
        'verd': '외계 유체에 노출되어 왼손이 새우 집게발로 변해가는 절체절명의 공포를 맛보는 디스트릭트 9 슬럼 하우스입니다.',
        'prompt': 'Gritty realistic documentary concept art inside shantytown shack of District 9 Johannesburg, rusted corrugated tin walls, empty cat food cans littering dirt floor, alien mech parts, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『트랜스포머』 디셉티콘 메가트론이 찌그러뜨린 폐차장 압축 고철 덩어리 안',
        'year': '2007년 올스파크 쟁탈전 잔해',
        'val': '-350달러 (압축 고철 톤당 시세)',
        'feat': '메가트론의 주먹에 정육면체로 찌그러진 포드 승용차 트렁크 안쪽에 몸을 욱여넣고 외계 로봇들의 레이저 전투를 피합니다.',
        'verd': '바깥에서는 범블비가 미사일을 쏘고 안에서는 철판이 찌그러져 샌드위치가 되는 오토봇-디셉티콘 교전 구역입니다.',
        'prompt': 'Action sci-fi concept art inside a crushed cube of compressed scrap car metal, daylight slicing through jagged metal tears, towering silhouette of Decepticon fighting outside, sparks, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『인터스텔라』 밀러 행성 1시간이 7년인 거대 해일 덮치기 직전 얕은 바다 캡슐',
        'year': '인류 생존 가르강튀아 탐사',
        'val': '-23년 (해일 한 번 피할 때마다 나이 23살 추가)',
        'feat': '발목까지 오는 얕은 바다 저 멀리서 구름인 줄 알았던 1,200m 높이의 거대한 수직 해일 파도가 벽처럼 다가오는 착륙선 틈새입니다.',
        'verd': '지구에 있는 자식들이 할아버지가 되는 동안 단 10분 만에 늙어버리는 상대성이론 극악의 시간 낭비 하우스입니다.',
        'prompt': 'Interstellar movie cinematic concept art on Miller\'s planet, standing in knee-deep mirror ocean looking up at colossal 4000-foot vertical tidal wave wall sweeping across horizon, grey sky, 8k.'
    }
])
print(f"FIC BAD Part 2 loaded: {len(RAW_FIC_BAD)} items")

RAW_FIC_BAD.extend([
    # Tier 6 (63..75)
    {
        'cat': 'DOGHOUSE',
        'title': '『이 멋진 세계에 축복을!(코노스바)』 카즈마와 아쿠아가 말똥 치우던 마구간 짚단',
        'year': '액셀 마을 초보자 모험가 시절',
        'val': '-500에리스 (마구간 1박 30에리스 월세)',
        'feat': '여신 아쿠아가 술주정을 부리며 울고 있는 옆에서 말똥 냄새를 맡으며 젖은 건초 짚단을 이불 삼아 덮고 잡니다.',
        'verd': '이세계 전생의 화려한 치트 하렘은커녕 노가다 일용직 노동 후 말똥과 동침하는 코노스바 생존 마구간입니다.',
        'prompt': 'Konosuba anime comedy concept art inside rustic horse stable, warm glowing lantern hanging from wooden beam, bed made of golden straw, Aqua crying in background while clutching bottle, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『던전앤파이터』 엘븐가드 세리아의 나무 집 뒤편 고블린 투척 돌 맞은 틈새',
        'year': '아라드 대륙 모험의 시작',
        'val': '-50골드 (세리아 구출 퀘스트 보상)',
        'feat': '초보 모험가들이 고블린을 잡겠다고 칼을 휘두를 때마다 튕겨 나온 조약돌이 창문을 깨고 들어오는 나무 밑동 구석 셋방입니다.',
        'verd': '"기억해주세요, 저를..."이라는 세리아의 영원한 대사를 들으며 피로도 156을 다 쓰고 잠드는 아라드 초보자 쉼터입니다.',
        'prompt': 'Dungeon Fighter Online fantasy concept art behind Seria\'s treehouse in Elvengard, hollow enchanted tree roots, wooden signs, mossy stone path with scattered goblin slingshot stones, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『메이플스토리』 슬리피우드 축축한 개미굴 주니어 발록 출몰지 앞 비박 텐트',
        'year': '빅뱅 이전 구 메이플 아일랜드',
        'val': '-2,000메소 (택시비 1만 메소 부족)',
        'feat': '끈적끈적한 좀비버섯과 뿔버섯이 쏟아져 나오는 개미굴 맨 깊은 곳에서 주니어 발록의 포효 소리를 들으며 텐트를 쳤습니다.',
        'verd': '포탈 한 번 잘못 탔다가 묘비가 쿵 떨어지고 경험치 10%를 잃어버리는 추억의 빅뱅 전 슬리피우드 지옥 텐트입니다.',
        'prompt': 'Classic MapleStory inspired fantasy digital painting inside the eerie dark Sleepywood Ant Tunnel, giant glowing purple mushrooms, damp stone steps, ominous shadow of Junior Balrog, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『바람의 나라』 주막 주모 뒤편 동동주 빈 병 쌓인 창고 구석 멍석',
        'year': '국내성 왈숙네 주막 시절',
        'val': '-50전 (도토리 1개 5전 시세)',
        'feat': '"넥슨은 다람쥐를 뿌려라!"를 외치는 초보 무사들의 함성을 들으며 왈숙이 아줌마의 동동주 항아리 뒤 멍석에 눕습니다.',
        'verd': '체력 회복을 위해 "주모, 동동주 100잔 주시오"를 외치며 밤샘 노가다를 뛰던 1세대 도트 게임의 성지 창고입니다.',
        'prompt': 'Retro Korean fantasy concept art inside historic traditional tavern tavern inn in Kingdom of the Winds, clay jars of rice wine, worn straw mats, wooden partitions, pixel nostalgia charm, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『라그나로크 온라인』 프론테라 지하수로 바퀴벌레(도둑벌레) 득실대는 배수구',
        'year': '2002년 룬 미드가츠 왕국',
        'val': '-1,000제니 (파리 날개 1장 가격)',
        'feat': '금빛 황금도둑벌레가 훔쳐 간 카드를 찾기 위해 하수도 오물 웅덩이 속 배관 파이프 위에 걸터앉아 단검을 닦습니다.',
        'verd': '초보 복사와 검사들이 몰이 사냥하다가 바퀴벌레 떼에 누워 카프라 부활을 외치던 눈물의 지하수로 하우스입니다.',
        'prompt': 'Ragnarok Online aesthetic concept art in the murky stone sewers beneath Prontera, glowing green sewage water flowing, Thief Bugs scuttling along damp mossy brick conduits, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『포켓몬스터』 회색체육관 웅이의 롱스톤이 꼬리로 내려친 바위 파편 틈새',
        'year': '관동지방 첫 번째 배지 도전',
        'val': '-1,500엔 (파이리 불꽃세례 100번 맞음)',
        'feat': '롱스톤의 조이기 기술에 바위가 산산조각 난 체육관 바닥 파편 사이에 끼어 웅이의 실눈 웃음을 올려다봅니다.',
        'verd': '파이리를 첫 포켓몬으로 골랐다가 눈물 흘리며 바위깨기 노가다를 하던 트레이너들의 좌절의 바위틈 룸입니다.',
        'prompt': 'Pokemon anime inspired concept art inside Brock\'s Pewter City Gym, shattered boulders and stone debris scattered on battlefield, towering shadow of giant Onix curling overhead, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『드래곤볼』 야무치가 재배맨 자폭 맞고 쓰러져 파인 흙구덩이',
        'year': '사이어인 지구 침공의 날',
        'val': '-0제니 (전투력 1,480 측정)',
        'feat': '재배맨이 등 뒤에서 껴안고 자폭하여 만들어진 완벽한 반구형 크레이터 중심부에 옆으로 누워 그 유명한 패배 포즈로 잡니다.',
        'verd': '드래곤볼 역사상 가장 유명한 밈(Meme)의 진원지에서 패자의 굴욕과 흙먼지를 온몸으로 흡수하는 야무치 포즈 룸입니다.',
        'prompt': 'Dragon Ball Z iconic anime concept art of circular blast crater in rocky desert wasteland, Yamcha\'s classic defeated silhouette resting in center of dusty smoking pit, cracked earth, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『원피스』 버기 해적단 대포알에 날아간 오렌지 마을 무너진 펫샵 개집',
        'year': '이스트블루 루피 첫 출항기',
        'val': '-5,000베리 (주인이 남긴 보물)',
        'feat': '충견 슈슈가 목숨 걸고 지키던 사료 가게가 버기의 특제 마기탄 대포알에 불타버린 잿더미 개집 속에 눕습니다.',
        'verd': '루피가 모자를 씌워주며 위로했던 감동의 오렌지 마을에서 충견의 눈물과 대포 그을음을 함께 덮는 개집 셋방입니다.',
        'prompt': 'One Piece anime concept art in ruins of burned pet food shop in Orange Town, brave little dog Chou Chou\'s charred wooden doghouse, smoke rising against peaceful seaside village sky, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『나루토』 나루토가 컵라면 유통기한 지난 거 먹던 쓰레기 가득한 방',
        'year': '구미호 봉인 소년의 외로운 유년기',
        'val': '-150냥 (상한 우유 마시고 배탈 남)',
        'feat': '마을 사람들의 차가운 눈총을 피해 들어온 단칸방 바닥에 빈 컵라면 용기 수십 개와 마시다 남은 상한 우유 팩을 베개 삼아 잡니다.',
        'verd': '호카게가 되겠다는 원대한 꿈 뒤편에 숨겨진 7세 나루토의 서글프고 외로운 컵라면 단칸방 펜트하우스입니다.',
        'prompt': 'Naruto anime emotional concept art inside young Naruto\'s messy solitary apartment in Hidden Leaf Village, piles of empty ramen cups on low table, spoiled milk carton, sunset light, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『블리치』 우라하라 상점 지하 거대 훈련장 모래바람 날리는 바위 틈',
        'year': '소울 소사이어티 침공 대비 훈련',
        'val': '-2,000만 칸 (시해 해방 훈련 실패 시 참백도 파괴)',
        'feat': '사탕가게 지하에 숨겨진 높이 500m의 광활한 인공 지하 훈련장에서 이치고가 만해를 연습하며 날린 참격 바위 파편 밑에 숨습니다.',
        'verd': '모자 쓴 우라하라 키스케가 부채로 부치며 지켜보는 위험천만 사신 훈련장 한복판의 모래바람 대피소입니다.',
        'prompt': 'Bleach anime concept art inside Urahara Kisuke\'s vast cavernous underground training ground, synthetic sky, crumbling cliffside rocks scarred with giant Getsuga Tensho slashes, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『강철의 연금술사』 요키의 탄광 마을 착취당한 인부들의 진흙 천막',
        'year': '유스웰 탄광 에드워드 방문 전',
        'val': '-100센즈 (요키 부관의 터무니없는 세금)',
        'feat': '하루 16시간 석탄을 캐고 돌아와 씻을 물도 없는 진흙 천막 바닥에 누워 석탄 가루 섞인 수프를 마십니다.',
        'verd': '강철의 연금술사가 탄광 소유권을 인부들에게 넘겨주기 전까지 지옥 같은 착취를 버텨낸 유스웰의 눈물 천막입니다.',
        'prompt': 'Fullmetal Alchemist anime concept art in muddy Youswell coal mining camp, soot-covered miner tents, pickaxes leaning on rickety wooden carts, heavy smog choking mountain valley, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『페이트/스테이 나이트』 마토우 가문 지하 각인충 기어다니는 벌레 방 구석',
        'year': '제5차 성배전쟁 전야 마토우 저택',
        'val': '-0원 (마술회로 개조 및 인간성 박탈)',
        'feat': '조켄의 끔찍한 벌레 사역마 수만 마리가 발목을 타고 기어오르는 지하 암흑 석조 벌레 구덩이에서 비명을 삼킵니다.',
        'verd': '사쿠라의 11년 고통이 서려 있는 타입문 역사상 가장 불쾌하고 잔혹한 마술 가문의 지하 벌레 지옥입니다.',
        'prompt': 'Fate Stay Night dark gothic concept art inside Matou Zouken\'s underground worm pit dungeon, slimy glistening Crest Worms writhing across cold stone floor, dim sickly green light, absolute horror, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『던전밥』 레드 드래곤 소화액에 녹아내리는 던전 지하 5층 바위 틈',
        'year': '황금향 던전 최하층 원정기',
        'val': '-1,000골드 (파린 소화 카운트다운)',
        'feat': '레드 드래곤이 뿜어낸 화염 브레스에 붉게 달아오른 바위 틈새에서 라이오스가 구워주는 마물 바비큐 냄새를 맡으며 대기합니다.',
        'verd': '먹느냐 먹히느냐의 갈림길에서 거대 전갈과 걸어 다니는 버섯 찌개를 끓여 먹는 미식(?) 던전 생존 룸입니다.',
        'prompt': 'Delicious in Dungeon anime aesthetic concept art inside dungeon 5th floor red dragon lair, scorched magma rock chamber with smoking ashes, cast iron pot cooking monster stew over campfire, 8k.'
    },

    # Tier 7 (76..87)
    {
        'cat': 'MICRO_DWELLING',
        'title': '『톰과 제리』 제리가 쥐구멍 앞에 파놓은 쥐덫 바로 옆 0.05평 틈새',
        'year': '1940년 한나-바베라 클래식 시대',
        'val': '-50센트 (치즈 1조각 도난당함)',
        'feat': '톰이 스프링 쥐덫을 설치해 둔 걸 뻔히 알면서도 노란 체다 치즈 한 조각을 베개 삼아 쥐구멍 입구에서 잡니다.',
        'verd': '스프링이 탕! 하고 튕기는 순간 다이너마이트가 폭발하는 클래식 슬랩스틱 코미디의 최전선 명당(?)입니다.',
        'prompt': 'Classic 1950s American cartoon interior view from inside Jerry\'s arched mouse hole in living room baseboard, giant steel mousetrap loaded with yellow swiss cheese just outside, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『짱구는 못말려』 신형만(짱구 아빠)의 32년 남은 주택 대출금 영수증 더미 밑',
        'year': '사이타마현 카스카베시 떡잎마을',
        'val': '-3,200만 엔 (아직도 32년 남은 융자금)',
        'feat': '폭발로 날아가 새로 지은 단독주택의 32년 만기 주택 론 영수증 박스 아래 짱구 아빠의 악취 나는 양말을 피해 숨습니다.',
        'verd': '지구상 최강의 화학 무기인 짱구 아빠 발냄새를 견뎌내며 대한민국 가장들의 비애를 공유하는 떡잎마을 다다미방입니다.',
        'prompt': 'Crayon Shin-chan anime style cozy living room in Kasukabe, stack of home loan mortgage bank statements on chabudai table, Hiroshi\'s notorious smelly socks steaming on tatami floor, 8k.'
    },
    {
        'cat': 'CLOSET',
        'title': '『도라에몽』 노진구가 0점 맞은 시험지 숨겨둔 천장 다락방 먼지 구덩이',
        'year': '도쿄 네리마구 진구네 집',
        'val': '-0엔 (엄마의 등짝 스매싱 100대 예약)',
        'feat': '엄마한테 들키면 지옥이 열리는 0점짜리 산수 시험지 수백 장을 도라에몽 옷장 위 천장 틈새에 숨겨두고 발을 동동 구릅니다.',
        'verd': '어디로든 문도 대나무 헬리콥터도 구할 수 없는 0점 시험지의 공포가 서린 진구의 은밀한 다락방 벙커입니다.',
        'prompt': 'Doraemon anime aesthetic dusty attic alcove above Nobita\'s bedroom closet, crumpled test papers with red 0 marks hidden beneath floorboards, Doraemon sleeping in closet below, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『아기공룡 둘리』 고길동 아저씨 집 연탄 창고 둘리와 또치가 어지럽힌 구석',
        'year': '1983년 서울 쌍문동 둘리 식객 시절',
        'val': '-500만 원 (고길동 아저씨 레코드판 파손비)',
        'feat': '둘리가 초능력으로 부숴먹은 고길동의 양주병과 희동이가 쏟아놓은 분유통 옆 검은 연탄재 더미 위에 웅크립니다.',
        'verd': '"호의가 계속되면 권리인 줄 안다"는 명언을 남긴 대한민국 최대의 대인배 고길동 하우스의 연탄 창고 셋방입니다.',
        'prompt': 'Classic Korean comic aesthetic interior of coal briquette yeontan storage shed in Ssangmun-dong Seoul, cracked black briquettes, baby dinosaur Dooly\'s footprints on dusty floor, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『개구리 중사 케로로』 히나타 가문 지하 사령부 청소도구함 케로로 텐트',
        'year': '퍼렁별(지구) 침략 대기 20년 차',
        'val': '-10만 엔 (건프라 한정판 키트 할부금)',
        'feat': '침략은 뒷전이고 최신 건담 프라모델 조립에 미쳐있는 케로로가 빗자루와 걸레 사이에 쳐둔 0.3평 침략 사령부 텐트입니다.',
        'verd': '히나타 나츠미의 킥 한 방이면 날아가는 나태한 외계 개구리의 건프라 취미방 펜트하우스입니다.',
        'prompt': 'Keroro Gunso anime style secret underground base janitor supply closet, miniature military tent pitched between mop buckets and brooms, shelves loaded with plastic Gundam model boxes, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『안녕 자두야』 자두네 집 옥상 빨래 건조대 밑 비 새는 비닐 차양',
        'year': '1980년대 흑백 TV 시절 한국 골목',
        'val': '-3,000원 (자두가 훔쳐먹은 멸치 볶음 값)',
        'feat': '빨래집게로 널어둔 엄마의 몸빼 바지 그늘 아래 비닐 차양을 치고 동생 미미와 승기 몰래 쫀드기를 씹어 먹습니다.',
        'verd': '엄마의 잔소리 폭격이 옥상까지 울려 퍼지는 정겨운 1980년대 서울 골목길 옥상 비밀 아지트입니다.',
        'prompt': 'Nostalgic 1980s Korean cartoon rooftop scene in Hello Jadoo, colorful floral patterned pants hanging on laundry drying rack, improvised clear vinyl tarp shelter on red brick roof, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『검정고무신』 기철이가 바나나 껍질 주워 먹던 1960년대 흙벽 단칸방',
        'year': '1969년 서울 마포구 마포동',
        'val': '-50환 (귀한 바나나 한 개 500원 시절)',
        'feat': '바나나 한 조각을 맛보고 눈물을 흘렸던 기철이가 문틈으로 외풍이 솔솔 들어오는 문풍지 흙방 아랫목에서 잡니다.',
        'verd': '가난했지만 따뜻했던 그 시절의 눈물 젖은 보릿고개 감성을 온몸으로 체험하는 검정고무신 단칸방입니다.',
        'prompt': 'Heartwarming 1960s Korean traditional clay wall room from Black Rubber Shoes, patched hanji paper sliding door, warm floor mat under low kerosene lamp, retro school desk, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『치이카와』 하치와레의 비 새는 동굴 찢어진 이불과 금 간 밥그릇',
        'year': '가혹한 풀 뽑기 토벌의 세계',
        'val': '-100엔 (풀 뽑기 검정 5급 수수료)',
        'feat': '비가 오면 천장에서 빗물이 뚝뚝 떨어져 찌그러진 냄비로 물을 받으며 찢어진 이불 속에서 하치와레와 기타를 칩니다.',
        'verd': '귀여운 외모 뒤에 숨겨진 잔혹한 노동 착취 세계관에서 꿋꿋하게 우정을 꽃피우는 짠내 나는 동굴 하우스입니다.',
        'prompt': 'Chiikawa style cute yet poignant anime digital art inside Hachiware\'s simple rocky cave dwelling, dripping rainwater catching in cracked ceramic pot, patched futon quilt, small guitar, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『보노보노』 너부리가 발로 차서 날아간 강가 억새풀 숲 젖은 흙바닥',
        'year': '숲속 개그 일상',
        'val': '-0조개 (조개 도둑맞음)',
        'feat': '너부리에게 "날 때릴 거야?"라고 깐죽대다 날아차기를 맞고 강가 억새풀 밭 진흙탕에 거꾸로 처박힌 채 별을 봅니다.',
        'verd': '철학적인 질문을 던지다 육체적인 응징을 당하는 보노보노와 친구들의 눈물겨운 강변 야외 취침석입니다.',
        'prompt': 'Whimsical anime riverbank landscape from Bonobono, tall whispering reeds beside clear flowing stream, impression of clumsy animal belly flop in soft muddy bank, pastel twilight sky, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『심슨 가족』 호머 심슨이 핵발전소 도넛 가루 흘린 원자로 제어 콘솔 밑',
        'year': '스프링필드 원자력 발전소 7G 섹터',
        'val': '-5,000만 달러 (멜트다운 경보 48회 연속)',
        'feat': '호머가 도넛 잼을 흘려 버튼이 끈적거리는 원자로 비상 정지 콘솔 바로 아래 발판에서 낮잠을 잡니다.',
        'verd': '세계에서 가장 멍청한 안전 감독관의 발밑에서 멜트다운 사이렌을 알람 시계 삼아 살아가는 핵 위험 하우스입니다.',
        'prompt': 'Simpsons style cartoon nuclear control room Sector 7G, glowing green radioactive reactor core visible through thick glass, Homer\'s control console sticky with pink donut glaze, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『사우스 파크』 케니가 매번 사망하는 눈 덮인 가로등 밑 눈구덩이',
        'year': '사우스 파크 콜로라도 설원',
        'val': '-10달러 (주황색 파카 수선비)',
        'feat': '"맙소사! 그들이 케니를 죽였어!" 소리가 메아리치는 영하 20도 사우스 파크 설원의 가로등 밑 눈더미 속입니다.',
        'verd': '매 에피소드마다 온갖 기상천외한 방식으로 사망하는 불사신 케니의 오렌지색 파카 전용 부활 명당입니다.',
        'prompt': 'South Park paper cutout style aesthetic snowy mountain town sidewalk at night, lone glowing streetlight illuminating a deep frozen snowdrift with Kenny\'s orange hood buried inside, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『릭 앤 모티』 제리가 지하실에서 모기 물려가며 만든 이상한 모형 안쪽',
        'year': 'C-137 지구 스미스 가문 지하실',
        'val': '-0원 (패배자의 자존심)',
        'feat': '릭의 차원 포털 실험 장치 구석에서 모기 물려가며 종이박스로 만든 볼품없는 모형 요새 안에 쭈구려 앉아 있습니다.',
        'verd': '은하계 최고 천재 할아버지와 모험을 떠나지 못하고 가족 내 서열 최하위의 서러움을 삭이는 제리의 찌질이 룸입니다.',
        'prompt': 'Rick and Morty cartoon concept art in dark basement garage, Rick\'s high-tech glowing portal fluid apparatus in background, pathetic homemade cardboard fort built by Jerry in corner, 8k.'
    },

    # Tier 8 (88..100)
    {
        'cat': 'EXTREME_NATURE',
        'title': '『엘든 링』 케일리드 붉은 까마귀들이 시체 뜯어먹는 가시나무 둥지',
        'year': '파쇄전쟁 이후 황폐화된 케일리드',
        'val': '-7,000만 룬 (거대 까마귀 부리 쪼기 치명타)',
        'feat': '피처럼 붉은 하늘 아래 사람 머리통만 한 눈알을 굴리는 기형 거대 까마귀들이 시체를 쌓아둔 가시나무 둥지 틈새입니다.',
        'verd': '말을 타고 전속력으로 도망치지 않으면 부리 한 방에 룬을 전부 잃어버리는 케일리드 최악의 까마귀 둥지입니다.',
        'prompt': 'Elden Ring dark fantasy digital art in desolate Caelid red wastes, grotesque monstrous giant crows perched in twisted thorn tree nest filled with bones under blood-red sky, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『다크 소울 3』 깊은 곳의 성당 진흙 거인 발밑 오물 웅덩이',
        'year': '불이 꺼져가는 황혼의 시대',
        'val': '-80만 소울 (슬라임 중독 정화비)',
        'feat': '사슬에 묶인 거대한 거인이 발을 쿵쿵 구를 때마다 오물과 구더기가 튀어 오르는 진흙탕 웅덩이에 무릎 꿇고 숨습니다.',
        'verd': '거인의 발바닥에 밟혀 납작해지거나 성당 기사들의 대검에 꿰뚫릴 위험을 감수해야 하는 깊은 곳의 성당 밑바닥입니다.',
        'prompt': 'Dark Souls 3 gothic fantasy concept art inside sludge-filled lower nave of Cathedral of the Deep, giant enslaved giant foot wading through deep filth and muck, vaulted gothic stone pillars, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『세키로』 아시나 성 본성 버려진 감옥 불사의 찌꺼기 시술소 볏짚',
        'year': '센고쿠 말기 아시나 가문 몰락기',
        'val': '-0전 (변약수를 마시고 붉은 눈 괴물로 변이)',
        'feat': '변약수 실험으로 이성을 잃고 붉은 눈으로 울부짖는 죄수들의 신음 소리가 울려 퍼지는 지하 수로 감옥 바닥 볏짚입니다.',
        'verd': '도준의 생체 실험용 모르모트가 되어 불사의 찌꺼기로 버려지기 직전의 아시나 성 지하 감옥 스위트입니다.',
        'prompt': 'Sekiro Shadows Die Twice dark Japanese Sengoku concept art inside Abandoned Dungeon beneath Ashina Castle, damp wooden cells with rotting straw, glowing red eyes lurking in shadows, torches, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『아머드 코어 6』 루비콘 3 오염 구역 폐허 코랄 폭발 재 덮인 컨테이너',
        'year': '아이비스의 불 대재앙 이후',
        'val': '-500만 COAM (코랄 중독 뇌사 위험)',
        'feat': '행성 전체를 불태웠던 붉은 신물질 코랄(Coral)의 입자가 공기 중에 타오르는 폐허 도시의 녹슨 컨테이너 안쪽입니다.',
        'verd': '강화인간 C4-621의 AC 메카닉이 부스터를 켜고 날아갈 때마다 화염 폭풍이 몰아치는 루비콘 행성의 최전선 룸입니다.',
        'prompt': 'Armored Core VI futuristic industrial mecha concept art in ash-covered ruins of Rubicon 3, fiery red glowing Coral particles floating through grey blizzard haze, giant crushed cargo container, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『몬스터 헌터』 독기의 골짜기 시체 썩는 노란 독기 안개 속 골총 틈새',
        'year': '신대륙 고룡 조사단 파견기',
        'val': '-8,000제니 (독기 내성 호석 미착용)',
        'feat': '거대 몬스터들의 유해가 산처럼 쌓여 부패하면서 뿜어내는 노란색 독기 안개가 가득 찬 거대 용의 갈비뼈 틈새입니다.',
        'verd': '지속적으로 최대 체력이 절반으로 깎여나가며 발하자크의 꼬리치기를 피해야 하는 헌터들의 맹독 서바이벌 룸입니다.',
        'prompt': 'Monster Hunter World concept art inside Rotten Vale, colossal dragon skeletal ribcage arching over yellow sulfurous toxic effluvium mist, red flesh fungi growing on massive bones, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『니어: 오토마타』 폐허 도시 녹슨 철골에 매달린 작동 정지된 2B 시체 옆',
        'year': '서기 11945년 제14차 기계전쟁',
        'val': '-1만 G (블랙박스 데이터 백업 손상)',
        'feat': '식물과 이끼가 뒤덮은 무너진 고층 빌딩 철골에 매달려 작동이 멈춘 안드로이드의 손을 잡고 지구 탈환의 무의미함을 곱씹습니다.',
        'verd': '인류는 이미 멸망했고 외계인도 죽어버린 지구에서 기계생명체들의 슬픈 노래를 듣는 니어 오토마타 잔해 하우스입니다.',
        'prompt': 'NieR Automata melancholic sci-fi digital art in overgrown Ruined City, massive cracked skyscraper draped in ivy, collapsed highway overpass, lone rusted android chassis on rusted steel beam, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『데빌 메이 크라이』 마계 탑 테멘니그루 악마 피 튄 계단실 틈새',
        'year': '단테의 악마 사냥 사무소 개업 전',
        'val': '-666레드 오브 (스타일리시 랭크 D: Don\'t worry)',
        'feat': '단테와 버질이 칼을 맞대며 썰어버린 악마들의 보랏빛 피가 계단을 타고 흘러내리는 400m 높이의 거대 마계 탑 틈새입니다.',
        'verd': '스타일리시 지수 0점의 일반인이 헬 배트들의 낫질을 피해 계단 난간 밑에 숨어있는 악마 침공 대피소입니다.',
        'prompt': 'Devil May Cry gothic action concept art inside towering demonic monolith Temen-ni-gru, spiral stone stairs splattered with purple ichor, glowing arcane demonic runes carved into black stone, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『바이오하자드 7』 베이커 가문 늪지대 부패한 폐가 썩은 음식 식탁 밑',
        'year': '루이지애나 덜비 교외 감염 참사',
        'val': '-0달러 (잭 베이커의 가족 만찬 강제 초대)',
        'feat': '구더기가 들끓는 정체불명의 장기와 썩은 내장 요리가 차려진 식탁 밑에서 잭 베이커가 삽을 끌고 다니는 발소리를 듣습니다.',
        'verd': '"가족이 된 걸 환영한다, 아들아!"라는 잭의 펀치를 맞기 직전의 루이지애나 생체 공포 식탁 룸입니다.',
        'prompt': 'Resident Evil 7 biohazard horror concept art inside decrepit Baker family dining room, rotting maggot-infested feast on peeling table, flickering chandelier, blood on wallpaper, dark doorway, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『사일런트 힐』 안개 자욱한 마을 녹슨 휠체어 굴러다니는 병원 지하실',
        'year': '이면세계(Otherworld) 전환기',
        'val': '-100만 달러 (영구 정신병원 입원비)',
        'feat': '사이렌이 울리며 벽면이 녹슨 철망과 피범벅 살점으로 변하는 이면세계의 브룩헤이븐 병원 지하실에서 라디오 잡음을 듣습니다.',
        'verd': '삼각두(피라미드 헤드)의 거대한 대검 긁는 소리가 복도를 울리는 궁극의 심리적 지옥 사일런트 힐 병원입니다.',
        'prompt': 'Silent Hill psychological horror concept art in rusty industrial Otherworld hospital basement, decaying peeling walls, rusted empty wheelchair sitting under a flickering surgical spotlight, mist, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『더 라스트 오브 어스』 포자 가득한 클리커 서식지 지하철 침수 역사 틈',
        'year': '동충하초 곰팡이 감염 20년 후',
        'val': '-50보급품 (방독면 필터 금속 파손)',
        'feat': '벽면 전체를 덮은 주황색 곰팡이 포자 구름 속에서 얼굴이 버섯으로 쪼개진 클리커들의 "딱-딱-딱" 소리를 피해 웅크립니다.',
        'verd': '벽돌 한 장 쥐고 숨을 참지 않으면 목덜미가 뜯겨나가는 보스턴 지하철 침수 역사의 극한 공포 셋방입니다.',
        'prompt': 'The Last of Us post-apocalyptic concept art in flooded Boston subway station, overgrown with toxic orange cordyceps fungal spores, ominous Clicker silhouette searching in shadow, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『앨런 웨이크』 어둠의 공간(Dark Place) 깜빡이는 가로등 꺼진 골목 구석',
        'year': '브라이트 폴즈 어둠의 호수 속',
        'val': '-1원고 (빛이 사라지면 소멸)',
        'feat': '어둠의 존재들이 속삭이며 다가오는데 유일한 안전지대인 가로등 전구가 펑 터져버린 뉴욕 악몽 도시의 골목 막다른 길입니다.',
        'verd': '손전등 건전지가 다 닳아가는 절망 속에서 타자기로 다음 페이지를 써내려가야 하는 작가의 지옥 하우스입니다.',
        'prompt': 'Alan Wake 2 psychological thriller concept art in rain-soaked Dark Place alleyway, neon signs buzzing, flickering street lamp violently bursting, shadowy figures emerging from darkness, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『데드 바이 데이라이트』 엔티티의 영역 갈고리 바로 밑 피 묻은 풀숲',
        'year': '엔티티의 영원한 희생 제사',
        'val': '-5,000블러드포인트 (탈출 실패)',
        'feat': '녹슨 거대 쇠갈고리 바로 아래 가시덤불 속에 숨어 발전기를 돌리는 소리와 살인마의 심장 박동 소리를 듣습니다.',
        'verd': '엔티티의 거대 거미 다리가 하늘에서 내려와 영혼을 꿰뚫기 직전의 4대 1 비대칭 생존 공포 풀숲입니다.',
        'prompt': 'Dead by Daylight survival horror concept art in foggy Coldwind Farm, rusty meat hook suspended from wooden gallows stained with dried blood, dense tall dead grass, moonlight cutting through fog, 8k.'
    },
    {
        'cat': 'PRISON_FACILITY',
        'title': '『SCP 재단』 SCP-173 격리실 바닥 피와 배설물 잔여물 섞인 청소 구역',
        'year': 'SCP 제19기지 유클리드 등급 격리',
        'val': '-0원 (D계급 인원 1회용 청소부 지정)',
        'feat': '눈을 깜빡이는 순간 목뼈를 꺾어버리는 조각상 SCP-173을 세 명이서 서로 번갈아 쳐다보며 바닥의 배설물을 닦아냅니다.',
        'verd': '"눈 감지 마!"를 외치며 안구 건조증과 목뼈 골절의 공포 사이에서 줄타기하는 SCP 재단 D계급 숙소입니다.',
        'prompt': 'SCP Foundation inspired realistic concept art inside concrete containment cell of SCP-173, reinforced blast door, blood and fecal slurry on floor drain, ominous painted concrete sculpture, 8k.'
    },

    # Tier 9 (101..112)
    {
        'cat': 'MICRO_DWELLING',
        'title': '『마음의 소리』 조석의 전경 시절 방패 뒤 땀내 나는 침낭',
        'year': '2000년대 대한민국 의무경찰 시절',
        'val': '-500원 (건빵 1봉지 훔쳐먹기)',
        'feat': '진압 방패를 병풍 삼아 세워두고 선임들의 잔심부름을 피해 방패 뒤편 0.2평에 찌그러져 침낭을 덮고 잡니다.',
        'verd': '네이버 웹툰 최장수 레전드의 시작을 알렸던 조석의 눈물과 땀내가 진동하는 의경 내무반 방패 룸입니다.',
        'prompt': 'The Sound of Your Heart webtoon comedy aesthetic, square-faced character sleeping curled in sleeping bag squeezed behind scratched polycarbonate police riot shields, messy barracks corner, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『유미의 세포들』 출출 세포가 떡볶이 국물 쏟아놓은 세포 마을 뒷골목',
        'year': '유미의 야식 충동 폭발기',
        'val': '-1만 5,000원 (배달비 4,000원 포함)',
        'feat': '거대 떡볶이 떡을 머리에 꽂은 출출 세포가 휩쓸고 지나간 세포 마을 광장 구석 떡볶이 양념 웅덩이 옆에 돗자리를 폈습니다.',
        'verd': '다이어트 세포가 절규하며 쓰러진 자리에서 야식의 달콤한 유혹을 온몸으로 받아내는 유미의 뇌 속 하우스입니다.',
        'prompt': 'Yumi\'s Cells cute 3D animation style digital art in colorful cell village, giant spicy tteokbokki rice cake leaning against miniature building, splattered red sauce on cobblestone street, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『패션왕』 우기명이 패션 배틀 지고 쭈구려 앉은 체육관 창고 매트리스',
        'year': '2011년 기안84 웹툰 전성기',
        'val': '-10만 원 (노스페이스 700 패딩 찢어짐)',
        'feat': '시각을 포기한 헤어스타일을 하고 패션 배틀에서 패배한 뒤 곰팡이 핀 뜀틀 매트리스 구석에서 눈물을 훔칩니다.',
        'verd': '대한민국 급식 패션의 전설이 시각과 자존심을 동시에 잃고 패션의 완성을 고뇌하던 체육관 창고입니다.',
        'prompt': 'Korean webtoon aesthetic inside dusty school gym storage room, giant high jump foam mattress covered in green vinyl, discarded puffy North Face down jacket on floor, sunlight dust motes, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『놓지마 정신줄』 정신이가 발명품 폭발시키고 남은 그을린 방구석',
        'year': '정신이네 대폭발 사고 300회 차',
        'val': '-5,000만 원 (아파트 외벽 수리비 청구)',
        'feat': '새로운 황당 발명품을 테스트하다가 방 전체가 시커멓게 폭발해 머리가 아프로 펌으로 변한 채 그을린 벽에 등을 기댑니다.',
        'verd': '정주리와 엄마의 회초리 난무가 시작되기 직전 정신줄을 꽉 잡고 버텨야 하는 폭발물 처리반 방입니다.',
        'prompt': 'Humorous webtoon concept art inside a completely charred and smoking bedroom, exploded machinery parts, black soot silhouettes on peeling wallpaper, quirky inventor gadget debris, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『정글고』 불사조가 야자 째고 숨어있던 학교 옥상 물탱크 사다리 밑',
        'year': '명문사립 정글고등학교',
        'val': '-0원 (이사장님의 황금 동상 수리비)',
        'feat': '이사장과 정글고 교사들의 감시를 피해 야간자율학습을 째고 파란색 거대 물탱크 사다리 밑 틈새에 숨어 라면을 먹습니다.',
        'verd': '입시 지옥 정글고에서 만점 수석 불사조의 여유를 0.5평 물탱크 그늘에서 배우는 대한민국 수험생 은신처입니다.',
        'prompt': 'Korean high school rooftop scene at night from Jungle High School webtoon, giant cylindrical blue water tank, iron maintenance ladder, city lights glowing below school fence, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『신과 함께』 나태지옥 삼도천 인면어들이 뜯어먹으려 쫓아오는 물살 위 뗏목',
        'year': '저승 재판 49일 여정',
        'val': '-평생 게으름의 업보 (회전 원통 달리기 형벌)',
        'feat': '쉬지 않고 헤엄치지 않으면 사람 얼굴을 한 물고기(인면어)들에게 다리를 뜯어먹히는 삼도천 급류 위 부실한 뗏목입니다.',
        'verd': '초강대왕의 엄격한 재판을 앞두고 침대에 누워있던 지난날의 게으름을 눈물로 참회하는 나태지옥 워터파크입니다.',
        'prompt': 'Along with the Gods Korean myth webtoon digital painting of Hell of Sloth river, turbulent murky river populated by creepy human-faced fish swimming after a fragile wooden log raft, misty netherworld, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『호랑이형님』 흰눈썹의 단약 가마솥 아궁이 재 털어내는 잿더미 밑',
        'year': '태고의 조선 호랑이 신화',
        'val': '-100년 묵은 산삼 찌꺼기',
        'feat': '영생을 꿈꾸는 흰눈썹이 인간을 갈아 넣고 끓여낸 붉은 영약 가마솥 아궁이의 뜨거운 잿더미 밑에 숨어 산군의 포효를 듣습니다.',
        'verd': '언제 호랑이 괴수들의 발톱에 찢겨 나갈지 모르는 압도적 조선 판타지 괴물들의 아궁이 셋방입니다.',
        'prompt': 'Tiger Brother webtoon dark myth concept art inside dark ancient stone cave laboratory, colossal bubbling cast iron caldron glowing with red elixir fire, ash heap below, heavy atmosphere, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『신의 탑』 2층 에반켈의 지옥 시험장 붉은 흙먼지 뒹구는 바위 그늘',
        'year': '탑의 2층 선별인원 시험장',
        'val': '-200명 중 3명 생존 서바이벌',
        'feat': '200명의 선별인원들이 서로를 죽고 죽이는 거대한 붉은 대지 시험장에서 신수를 다루지 못해 거대 바위 그늘에 웅크립니다.',
        'verd': '밤과 라헬의 엇갈린 운명이 시작된 신의 탑 2층 에반켈의 화염 바베큐장이 내려다보이는 바위틈 룸입니다.',
        'prompt': 'Tower of God anime concept art in Evankhell\'s 2nd floor hellish testing ground, vast red clay savanna wasteland dotted with strange giant bones, harsh alien sunlight, floating examiners, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『나 혼자만 레벨업』 성진우가 E급 시절 고블린 칼 맞고 버려진 D급 던전 구석',
        'year': '인류 최약병기 E급 헌터 시절',
        'val': '-E급 마정석 1개 (치료비 50만 원)',
        'feat': '이중 던전의 석상 신전에 들어가기 전, 가장 약한 고블린에게도 복부를 찔려 피를 흘리며 주저앉았던 축축한 동굴 구석입니다.',
        'verd': '그림자 군주로 각성하기 전 세상의 모든 멸시를 홀로 견뎌내던 성진우의 눈물겨운 D급 던전 바닥입니다.',
        'prompt': 'Solo Leveling anime concept art inside dark damp low-rank cavern dungeon, shattered wooden spear and rusty goblin dagger on wet rocky floor, single glowing blue mana stone, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『전지적 독자 시점』 동호대교 위 어류 성좌 출몰 한강 바닥 깨진 차창',
        'year': '시나리오 1 종료 직후 동호대교 폭파',
        'val': '-10,000코인 (어룡의 먹이로 전락 위기)',
        'feat': '멸망한 서울에서 첫 번째 시나리오를 깨고 부서진 다리 밑 한강 물속으로 추락한 버스 창문 틈에 끼어 어룡을 피합니다.',
        'verd': '도깨비 비형의 방송 스트리밍 후원을 받지 못하면 물고기 밥이 되는 전독시 시나리오 2번 생존 구역입니다.',
        'prompt': 'Omniscient Reader\'s Viewpoint webtoon concept art inside flooded submerged Seoul bus beneath collapsed Dongho Bridge, Han river water murk, giant shadow of sea serpent monster passing window, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『화산귀환』 청명이 화산파 복귀 직후 거미줄 친 망해가는 백매관 흙방',
        'year': '화산파 100년 만의 부활 전야',
        'val': '-5냥 (화산파 전 재산 빚더미)',
        'feat': '문파의 모든 무공과 보물이 털리고 기와가 무너져 거미줄만 무성한 백매관 흙바닥에서 청명이 피눈물을 흘리며 누워있습니다.',
        'verd': '천하삼대검파의 영광은 어디 가고 풀뿌리 캐먹던 망해가는 화산파의 몰락 직후 잡초방입니다.',
        'prompt': 'Return of the Blossoming Blade webtoon aesthetic inside dilapidated martial arts academy dormitory, torn paper doors, spiderwebs hanging from rotting rafters, withered plum blossom branches outside, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『광마회귀』 이자하가 점소이 시절 무공 연습하다 부숴먹은 객잔 뒤 변소',
        'year': '점소이에서 광마로의 질주',
        'val': '-2냥 (객잔 주방 식기 파손비)',
        'feat': '미치광이처럼 광기를 품고 무공을 연마하다가 객잔 화장실 벽을 권풍으로 날려버리고 똥통 옆에 서서 허탈하게 웃습니다.',
        'verd': '"나는 미친놈이다"를 외치며 강호를 뒤흔들 광마의 전설이 시작된 눈물겨운 하오문 객잔 뒤편 셋방입니다.',
        'prompt': 'Return of the Crazy Demon wuxia comedy concept art behind rundown ancient Chinese inn, cracked wooden outhouse wall shattered by martial arts fist blast, moonlight illuminating dusty courtyard, 8k.'
    },

    # Tier 10 (113..124)
    {
        'cat': 'EXTREME_NATURE',
        'title': '『젤다의 전설: 야생의 숨결』 코로그 열매(응가) 찾으려고 들춘 숲속 평범한 돌멩이 밑',
        'year': '하이랄 대재앙 100년 후',
        'val': '-0루피 (야하하! 찾았다! 코로그 열매 1개)',
        'feat': '바위를 들어 올리면 "야하하!" 소리와 함께 머리에 나뭇잎을 단 정령이 코로그 열매(응가 모양)를 던져주고 사라지는 돌 밑 0.1평입니다.',
        'verd': '하이랄 전역에 900개나 숨겨져 있어 링크를 분노하게 만드는 궁극의 수집 강박 유발 스위트입니다.',
        'prompt': 'Zelda Breath of the Wild anime landscape concept art, solitary round mossy stone resting in serene sunlit Hyrule forest meadow, cute Korok spirit with leaf mask popping out from beneath, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『슈퍼 마리오』 쿠파 성 용암 위 1초마다 회전하는 가시 철퇴 기둥 옆 블록',
        'year': '버섯 왕국 피치 공주 납치기',
        'val': '-1코인 (낙사 시 목숨 1개 소멸)',
        'feat': '펄펄 끓는 주황색 용암 바다 위에서 360도로 회전하는 가시 박힌 불꽃 쇠사슬(파이어 바)을 타이밍 맞춰 점프하며 버팁니다.',
        'verd': '점프 타이밍을 0.1초만 놓쳐도 용암 속으로 풍덩 빠져 엉덩이에 불이 붙는 쿠파 성 익스트림 점프 룸입니다.',
        'prompt': 'Super Mario classic video game concept art inside Bowser\'s volcanic castle dungeon, boiling red lava sea, spinning spiked iron balls on chains sweeping over narrow floating brick blocks, 8k.'
    },
    {
        'cat': 'INDUSTRIAL_HAZARD',
        'title': '『소닉』 에그맨 기지 스크랩 브레인 존 가시밭 트랩 바로 위 발판',
        'year': '닥터 에그맨 기계 제국',
        'val': '-0링 (가시에 닿으면 가지고 있던 링 전부 증발)',
        'feat': '밟으면 1초 뒤에 아래로 꺼지는 발판 위에서 솟구치는 강철 가시 트랩을 피해 링을 튕겨내며 스핀 대시를 준비합니다.',
        'verd': '시속 1,000km로 달리다 브레이크를 못 밟으면 꼬치구이가 되는 에그맨 인더스트리얼 가시밭 하우스입니다.',
        'prompt': 'Classic Sonic retro sci-fi factory concept art inside Scrap Brain Zone, hazardous steel spikes protruding from checkered metal floor, sparking high voltage cables, industrial machinery hum, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『메가맨』 와일리 스테이지 즉사 레이저 지나가는 사다리 끝 0.1평',
        'year': '닥터 와일리 세계 정복 음모',
        'val': '-1UP (스치기만 해도 즉사)',
        'feat': '화면 밖에서 빛의 속도로 날아오는 주황색 즉사 레이저(Quick Laser) 타이밍에 맞춰 사다리 맨 꼭대기 쇠파이프에 매달립니다.',
        'verd': '암기하지 않으면 무조건 죽는 록맨 유저들의 영원한 반사신경 테스트용 사다리 펜트하우스입니다.',
        'prompt': 'Mega Man retro video game aesthetic concept art in futuristic metal fortress, blazing orange instant-death energy beam flashing horizontally through corridor, blue metal ladder against steel wall, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『스트리트 파이터』 가일 스테이지 공군 기지 부서진 전투기 날개 밑바닥',
        'year': '1991년 스트리트 파이터 2 챔피언십',
        'val': '-500달러 (보너스 게임 자동차 부수기 견적)',
        'feat': '가일이 빗질하며 썸머솔트 킥을 날리는 F-16 전투기 격납고 바닥에서 상자 부수기 파편을 맞으며 웅크립니다.',
        'verd': '배경에서 아저씨들이 리듬 타며 박수 치는 BGM 소리가 24시간 귓가를 맴도는 미 공군 기지 1열 관람석입니다.',
        'prompt': 'Street Fighter II retro arcade concept art on military airbase tarmac, weathered grey fighter jet parked under hangar, wooden crates scattered on asphalt, vibrant sunset sky, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『철권』 폴 피닉스가 오토바이 고치다 기름 튄 허름한 차고 바닥',
        'year': 'The King of Iron Fist Tournament',
        'val': '-3,000달러 (상금 사냥 매번 실패)',
        'feat': '우주 최강의 사나이라 자부하지만 매번 우승 상금을 놓치는 폴의 30cm 솟아오른 빗자루 머리 왁스 냄새 나는 차고 바닥입니다.',
        'verd': '"오아-!"를 외치며 붕권을 날리다 차고 벽을 부숴먹는 열혈 바보 격투가의 기름투성이 차고 셋방입니다.',
        'prompt': 'Tekken arcade aesthetic inside messy American suburban garage, vintage motorcycle disassembled on dirty concrete, scattered wrenches and motor oil puddles, Paul Phoenix\'s red judo gi hanging, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『오버워치』 정크랫과 로드호그의 쓰레기촌(정커타운) 방사능 녹슨 고철 텐트',
        'year': '호주 옴니움 핵융합로 폭발 이후',
        'val': '-50쓰레기통 (폭탄 타이어 오작동)',
        'feat': '방사능 황무지가 된 호주 아웃백 쓰레기촌에서 고철과 화약을 엮어 만든 텐트 안에서 정크랫의 미친 웃음소리를 듣습니다.',
        'verd': '언제 어디서 시한폭탄이 터져 하늘 높이 날아갈지 모르는 매드맥스풍 오버워치 폭탄마 하우스입니다.',
        'prompt': 'Overwatch vibrant stylized concept art in rusted scrap shantytown of Junkertown Australia, makeshift corrugated iron tent surrounded by radioactive scrap metal and ticking DIY fireworks, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『에이펙스 레전드』 킹스 캐년 해골 마을(스컬 타운) 뼈기둥 꼭대기 저격 포인트',
        'year': '에이펙스 게임 경기장',
        'val': '-0원 (내리자마자 3초 컷 로비 사출)',
        'feat': '핫드랍 명소 스컬 타운 거대 짐승 뼈 기둥 꼭대기에 맨몸으로 떨어져 총도 없이 펀치 싸움을 하다가 로비로 사출당합니다.',
        'verd': '착지하자마자 10개 분대가 몰려와 수류탄과 샷건 난사가 쏟아지는 에이펙스 레전드 초고속 로비 복귀석입니다.',
        'prompt': 'Apex Legends sci-fi shooter concept art atop the colossal bleached leviathan rib bones of Skull Town Kings Canyon, dusty canyon buildings below, supply drops streaking across sky, 8k.'
    },
    {
        'cat': 'RUINS_ABANDONED',
        'title': '『배틀그라운드』 에란겔 포친키 2층집 옥상 난간 구석 파밍 다 털린 방',
        'year': '배틀로얄 서바이벌 경기',
        'val': '-0원 (권총 탄약 5발과 붕대 1개)',
        'feat': '포친키 격전지에 떨어졌으나 권총 한 자루도 못 줍고 프라이팬 하나 쥔 채 옥상 난간 구석에 엎드려 발소리를 셉니다.',
        'verd': '"이겼닭! 오늘 저녁은 치킨이닭!"은 고사하고 레드존 폭격 맞고 사망하는 포친키 파밍 폭망 룸입니다.',
        'prompt': 'PUBG realistic battle royale concept art on second floor balcony of Soviet apartment in Pochinki Erangel, abandoned cast iron frying pan on wooden floor, distant red zone smoke plume, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『발로란트』 바인드 B사이트 텔레포터 안쪽 소리 울리는 밀폐 큐브',
        'year': '레디어나이트 확보전',
        'val': '-100크레드 (텔레포트 타자마자 샷건 대기)',
        'feat': '텔레포터를 타는 순간 "쿠구궁!" 하는 거대한 알람 소리가 온 맵에 울려 퍼지며 문밖에서 대기하던 적의 샷건을 맞이합니다.',
        'verd': '소리 때문에 기습은 불가능하고 갇히면 수류탄이 날아들어와 꼼짝없이 폭사하는 발로란트 밀폐 큐브 룸입니다.',
        'prompt': 'Valorant stylized tactical shooter concept art inside metallic teleporter chamber on Bind B-site, glowing radianite green energy conduits, heavy steel blast doors with mechanical indicators, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『리그 오브 레전드』 소환사의 협곡 칼날부리 둥지 쪼아먹히는 덤불 속',
        'year': '소환사의 협곡 정글 구역',
        'val': '-100골드 (정글러 강타 스틸 당함)',
        'feat': '어미 칼날부리와 새끼 칼날부리 5마리가 사방에서 뾰족한 부리로 쪼아대 피가 깎여나가는 정글 덤불 한가운데 눕습니다.',
        'verd': '1레벨 정글러가 혼자 잡으려다 체력이 다 털리고 미드 라이너에게 백업 핑을 찍는 소환사의 협곡 정글 룸입니다.',
        'prompt': 'League of Legends fantasy digital art in Summoner\'s Rift jungle, nesting hollow under ancient stone arch where sharp-beaked raptor birds peck menacingly around brush bushes, magic flora, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스타크래프트』 프로토스 드라군이 길 잃고 벽에 끼어 멈춰 선 좁은 언덕길',
        'year': '프로토스 기계화 부대 이동기',
        'val': '-125미네랄 50가스 (AI 버그로 이동 불가)',
        'feat': '다리 네 개 달린 드라군이 언덕 입구 좁은 틈새에 끼어 앞으로 가지도 뒤로 가지도 못하고 제자리에서 덜덜거리는 복도입니다.',
        'verd': '멍청한 인공지능 덕분에 테란 시즈탱크의 공짜 타깃이 되는 프로토스 용기병의 영원한 길치 하우스입니다.',
        'prompt': 'Starcraft sci-fi concept art of an iconic blue Protoss Dragoon walker wedged awkwardly between narrow metallic high-ground ramp pillars, blue photon energy humming, glowing golden armor, 8k.'
    }
])
print(f"FIC BAD Total loaded: {len(RAW_FIC_BAD)} items")
