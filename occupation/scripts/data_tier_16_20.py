# -*- coding: utf-8 -*-
"""
scripts/data_tier_16_20.py
Tiers 16 to 20 (Levels 750 to 1000, 251 items, GOOD Zone)
STRICT SPECIFICATION: ZERO space keywords in Tiers 16~19 (Levels 750..949)!
Space, cosmic, planetary, and galactic jobs ONLY in Tier 20 (Levels 950..1000)!
Tier 16: 월스트리트·빅테크·명품 제국 최고 권력자 (750..799)
Tier 17: 글로벌 카르텔·다이아몬드·석유·카지노 대부 (800..849)
Tier 18: 국가급 랜드마크·세계 경제를 쥐락펴락하는 거물 (850..899)
Tier 19: 지구 최정상 부호·인류 미래 기술 독점 제왕 (900..949)
Tier 20: 우주 개척·은하계·다중우주 시공간 창조 아키텍트 (950..1000)
"""

# ==========================================
# TIER 16: 월스트리트·빅테크·명품 제국 최고 권력자 (750..799)
# ==========================================

TIER_16_REAL = [
    (title, en_title,
     "2024년 월스트리트·실리콘밸리·파리 명품 제국 이사회", "2024, Wall Street, Silicon Valley & Paris Luxury Boardrooms",
     "연봉 300억 원 ~ 1,000억 원 (글로벌 독점 배정권 & 이사회 배당)",
     "$25 Million - $80 Million/year (Global Allocation Rights & Board Dividends)",
     f"{title}로서 현대 세계 경제와 인공지능, 명품 산업의 최정점에서 결정을 내립니다. 전 세계 AI 칩의 공급 순번을 결정하거나 초단타 퀀트 알고리즘으로 매일 수천억 원을 벌어들입니다. 국가 수반들과 글로벌 CEO들이 한 번의 면담을 위해 줄을 서는 절대 권력자입니다.",
     f"Commands global high finance, tech titans, and luxury conglomerates as a {en_title}. Dictates worldwide AI semiconductor allocations, quant fund liquidity, and mega-mergers at sovereign levels.",
     "손짓 한 번에 전 세계 증시와 AI 반도체 공급망이 출렁이는 글로벌 최고 권력자!",
     "A single nod moves global stock exchanges and AI supply chains—supreme titans of capital!")
    for title, en_title in [
        ("엔비디아 차세대 AI 칩 글로벌 할당 순번 결정하는 총괄 부사장", "NVIDIA Next-Gen AI Chip Global Allocation Senior Executive VP"),
        ("월스트리트 100조 원 헤지펀드 초단타 퀀트 알고리즘 단독 설계자", "Wall Street $80B Hedge Fund HFT Quant Algorithm Sole Architect"),
        ("애플 비밀 디자인 랩 차세대 아이폰 하드웨어 폼팩터 총괄 부사장", "Apple Secret Design Lab Next-Gen iPhone Form Factor EVP"),
        ("루이비통 모엣헤네시(LVMH) 하이엔드 럭셔리 하우스 인수합병 총괄 대표", "LVMH Haute Luxe Mergers & Acquisitions Global Managing Director"),
        ("스위스 다보스 세계경제포럼 국가 정상 및 빅테크 CEO 비공개 만찬 호스트", "Davos WEF Heads of State & Tech Titan Private Soiree Host"),
        ("전 세계 해저 인터넷 백본 광케이블 100만 km 대역폭 독점 배정 총재", "Transoceanic Subsea 1,000,000km Fiber Backbone Bandwidth Czar"),
        ("오픈AI·구글 슈퍼컴퓨터 100만 개 GPU 클러스터 전력 공급 총괄 사령관", "OpenAI & Google 1M-GPU Supercluster Gigawatt Power Director"),
        ("골드만삭스 글로벌 투자은행 부문 100조 원 메가 딜 단독 승인 파트너", "Goldman Sachs $80B Mega-M&A Sole Signoff Senior Partner"),
        ("ASML 네덜란드 극자외선 노광장비 1대 4,000억 글로벌 출하 우선권 승인 위원장", "ASML Extreme Ultraviolet Lithography EUV Allocation Chairman"),
        ("런던 로이즈 해상 보험 전 세계 초대형 유조선 및 항만 독점 인수 심사관", "Lloyd's of London Global Supertanker & Mega-Port Underwriter"),
        ("글로벌 반도체 파운드리 TSMC 2나노 공정 빅테크 생산 슬롯 배정 디렉터", "TSMC 2nm Advanced Foundry Fab Capacity Allocation Director"),
        ("세계 최대 사모펀드 블랙스톤 글로벌 부동산 자산 400조 원 인수 총괄 대표", "Blackstone Global $300B Real Estate Portfolio Managing Director"),
        ("미국 실리콘밸리 샌드힐 로드 최상위 벤처캐피털 펀드 결성 총괄 제너럴 파트너", "Sand Hill Road Tier-1 Venture Capital Founding General Partner"),
        ("전 세계 스마트폰 안드로이드 OS 보안 루트 인증서 마스터 키 단독 보유관", "Android Root Trust Authority Global Master Key Sole Keeper"),
        ("독일 폭스바겐·포르쉐 그룹 하이퍼카 라인업 최종 양산 사인하는 수석 엔지니어", "Porsche-Volkswagen Group Hypercar Production Sole Signoff Chief"),
        ("스위스 제네바 국제 시계 박람회 그랑프리 심사위원장", "Watches and Wonders Geneva Grand Prix Chief Juror"),
        ("전 세계 신용카드 결제망 비자·마스터카드 초당 10만 건 결제 승인 총괄 아키텍트", "Global Payment Network 100K-TPS Settlement Lead Architect"),
        ("미국 시카고 상업거래소 전 세계 원자재·선물 시장 청산 결제 최고책임자", "Chicago Mercantile Exchange CME Global Clearing Chief"),
        ("일본 도쿄 증권거래소 1부 리그 기업 상장폐지 최종 심사 위원장", "Tokyo Stock Exchange Prime Market Delisting & Vetting Chairman"),
        ("미국 국방부 펜타곤 10조 원 클라우드 프로젝트 단독 입찰 총괄 기술이사", "Pentagon $10B Defense Cloud Infrastructure Sole Chief Technologist"),
        ("프랑스 파리 패션협회 오트 쿠튀르 공식 브랜드 인증 최종 심사위원", "Chambre Syndicale de la Haute Couture Paris Official Judge"),
        ("세계은행 글로벌 개발도상국 인프라 차관 50조 원 최종 집행관", "World Bank $40B Infrastructure Sovereign Loan Comptroller"),
        ("글로벌 곡물 메이저 카길 전 세계 밀·대두·옥수수 유통 독점 트레이더", "Cargill Global Staple Grain & Soybean Monopoly Head Trader"),
        ("미국 실리콘밸리 빅테크 연합 AI 데이터센터 독점 원자력 전력 계약관", "Silicon Valley Big Tech Nuclear Power Grid Monopoly Broker"),
        ("스위스 취리히 비밀 프라이빗 뱅크 10조 원 무기명 채권 금고 수석 총괄", "Zurich Secret Private Bank $8B Bearer Bond Vault Sovereign Trustee")
    ]
]

TIER_16_FICTION = [
    (title, en_title,
     "가상 제국 최고 군사 기술 및 판타지 왕실 정부", "Fictional Sovereign Military Tech & Imperial States",
     "연봉 비브라늄 잉곳 100개 + 왕실 면책 특권", "100 Vibranium Ingots + Royal Sovereign Immunity/year",
     f"{title}로서 와칸다와 원피스 세계정부, 마법 제국의 국가급 전략 자산과 무기고를 총괄 지휘합니다. 비브라늄 광맥을 관리하고 수백조 원의 군자금과 보물창고를 통제합니다. 세계 질서를 배후에서 좌지우지하는 가상 세계 최정상 권력자로 군림합니다.",
     f"Commands sovereign fictional nations and military superpowers as a {en_title}. Manages Wakandan vibranium mines, evaluates Gol D. Roger's One Piece, and controls worldwide shadow budgets.",
     "국왕과 원수들도 고개를 조아리는 판타지 세계 최상위 전략 자산의 총사령관!",
     "The grand marshal commanding sovereign super-weapons and national fictional treasuries!")
    for title, en_title in [
        ("와칸다 왕국 비브라늄 광산 채굴권 및 왕실 기술 수출 독점 총재", "Wakanda Kingdom Vibranium Mining Rights & Royal Tech Monopoly Director"),
        ("원피스 골드 로저의 '원피스' 실물 감정 및 세계정부 현상금 정산소장", "One Piece Gol D. Roger Treasure Authenticator & World Gov Bounty Chief"),
        ("나루토 나뭇잎 마을 닌자 군수물자 및 기폭찰 독점 조달청장", "Hidden Leaf Village Shinobi Tactical Supplies & Paper Bomb Czar"),
        ("강철의 연금술사 현자의 돌 연성 군사 비밀 연구소 최고 책임자", "Fullmetal Alchemist Philosopher's Stone Military Secret Lab Director"),
        ("블리치 호정 13대 기술개발국 영자 병기 독점 공급 사령관", "Bleach Soul Society Squad 12 Reishi Armament Chief Commander"),
        ("헌터X헌터 헌터 십이지 암흑대륙 원정 자금 100조 예산 총괄 집행관", "Hunter x Hunter Zodiac 12 Dark Continent $80B Expedition Comptroller"),
        ("원펀맨 메탈나이트(보포이 박사) 무인 로봇 병단 글로벌 방위산업 독점 회장", "One-Punch Man Metal Knight Autonomous Defense Conglomerate Chairman"),
        ("나 혼자만 레벨업 세계 헌터 협회 마정석 국가 비축 기지 총사령관", "Solo Leveling World Hunter Association Mana Stone Sovereign Depot Chief"),
        ("죠죠 스피드왜건 재단 초자연 현상 비밀 연구 및 글로벌 자산 운용 총괄", "Speedwagon Foundation Supernatural Division & Global Asset Chairman"),
        ("바이오하자드 엄브렐러 코퍼레이션 지하 라쿤시티 하이브 연구소 총괄 이사", "Resident Evil Umbrella Corp Subterranean Hive Lab Managing Director"),
        ("메탈기어 솔리드 애국자들(The Patriots) 글로벌 군사 AI 경제 시스템 설계자", "Metal Gear Solid The Patriots Global War Economy AI Architect"),
        ("데스노트 키라(야가미 라이토) 전 세계 추종자 비밀 헌금 10조 원 자산 관리인", "Death Note Kira Global Follower $8B Secret Sovereign Asset Manager"),
        ("사이코패스 시빌라 시스템 범죄계수 면죄체질자 최종 선별 판정관", "Psycho-Pass Sibyl System Asymptomatic Exemption Chief Overseer"),
        ("페이트 스테이 나이트 아인츠베른 호문클루스 황금 성배 주조 총괄 연금술사", "Fate/stay night Einzbern Golden Holy Grail Master Alchemist"),
        ("진격의 거인 파라디 섬 빙폭석 및 뇌창 독점 양산 조병창 총재", "Attack on Titan Paradis Island Iceburst Stone & Thunder Spear Arsenal Chief"),
        ("귀멸의 칼날 귀살대 우부야시키 가문 전 세계 암약 자산 및 일륜도 철광석 광산주", "Demon Slayer Ubuyashiki Dynasty Scarlet Iron Mine Owner"),
        ("주술회전 주술총감부 특급 주물 '료멘스쿠나 손가락' 지하 봉인 결계사", "Jujutsu Kaisen Sukuna Finger Special Grade Underground Barrier Grandmaster"),
        ("에반게리온 네르프(NERF) 제1신동경시 지하 지오프론트 방어 예산 총괄", "Evangelion NERV Tokyo-3 Geofront Defense Budget Comptroller"),
        ("공각기동대 메가테크 바디 코퍼레이션 사이보그 전뇌 의체 글로벌 독점 총재", "Ghost in the Shell Megatech Body Corp Cybernetic Shell Monopoly President"),
        ("메이플스토리 블랙윙 에델슈타인 광산 마스크 군단 군자금 총괄", "MapleStory Black Wings Edelstein Mine War Fund Grandmaster"),
        ("던전앤파이터 천계 황혼의 바다 카르텔 해상 요새 무기 밀수 거물", "Dungeon & Fighter Empyrean Sea Cartel Heavy Arsenal Smuggling Baron"),
        ("로스트아크 베른 공화국 에폰 신성 기사단 실리안 국왕 전용 무기고 수장", "Lost Ark Shushire & Bern Royal Armory Sovereign Master"),
        ("리그 오브 레전드 필트오버 필토버 의회 마법공학 헥스테크 원자로 독점 특허관", "League of Legends Piltover Council Hextech Core Monopoly Patentee"),
        ("전지적 독자 시점 도깨비 통신사 성좌 프리미엄 광고 패키지 독점 총괄", "Omniscient Reader Dokkaebi Broadcasting Star Stream Ad Monopoly Chief"),
        ("체인소 맨 공안 대마 특이과 악마 계약 심사 및 심장 이식 총괄 국장", "Chainsaw Man Public Safety Devil Hunter Contract & Hybrid Heart Director")
    ]
]

# ==========================================
# TIER 17: 글로벌 카르텔·다이아몬드·석유·카지노 대부 (800..849)
# ==========================================

TIER_17_REAL = [
    (title, en_title,
     "2024년 페르시아만·제네바·남아공 자원 카르텔 본부", "2024, Persian Gulf, Geneva & South African Commodity Cartels",
     "연봉 1,000억 원 ~ 5,000억 원 (유전 로열티 & 원자재 독점 지분)",
     "$80 Million - $400 Million/year (Oilfield Royalties & Commodity Stakes)",
     f"{title}로서 지구상의 석유와 다이아몬드, 운하와 카지노 등 인류 핵심 실물 자산을 지배합니다. 사우디 유전의 매장량을 승인하거나 수에즈 운하의 통항권을 배정하며 천문학적인 부를 누립니다. 지구 자원 경제의 혈관을 쥐고 흔드는 실물 제국의 대부입니다.",
     f"Rules prime physical assets of human civilization including petroleum, diamonds, and canals as a {en_title}. Authorizes Aramco reserves, allocates Suez transit rights, and commands commodity syndicates.",
     "밸브 하나 잠그면 전 세계 원유 가격이 폭등하는 실물 경제의 살아있는 제왕!",
     "Turning pipeline valves that shift global crude prices—the undisputed commodity kings!")
    for title, en_title in [
        ("사우디 아람코 신규 유전 매장량 최종 승인 및 로열티 정산 위원장", "Saudi Aramco New Oilfield Reserves Certification & Royalty Chairman"),
        ("스위스 제네바 비밀 지하 금고 100캐럿 핑크 다이아몬드 수석 경매사", "Geneva Vault 100-Carat Vivid Pink Diamond Head Auctioneer"),
        ("마카오 카지노 거물 연합 정킷 롤링 머니 연간 50조 원 정산 대주주", "Macau Casino Junket Syndicate $40B Rolling Turnover Major Stakeholder"),
        ("수에즈·파나마 운하 초대형 컨테이너선 우선 통항권 배정 총재", "Suez & Panama Canals Ultra-Large Container Priority Transit Commodore"),
        ("전 세계 리튬·코발트·니켈 희토류 광산 채굴권 독점 거래 카르텔 의장", "Global Lithium, Cobalt & Rare Earth Mining Rights Monopoly Chairman"),
        ("남아프리카공화국 킴벌리 다이아몬드 광산 파이프라인 단독 소유주", "Kimberley South Africa Deep Diamond Pipe Sole Concessionaire"),
        ("미국 텍사스 퍼미안 분지 셰일 오일 1,000개 유정 파이프라인 총괄 회장", "Permian Basin Texas 1,000-Well Shale Pipeline Conglomerate Chairman"),
        ("남극 크루즈 & 북극 오로라 유리 돔 호텔 체인 창립자 겸 총괄 회장", "Antarctic Ultra-Luxury Cruise & Arctic Glass-Dome Hotel Fleet Owner"),
        ("싱가포르 말라카 해협 해상 벙커링 원유 환적 유조선 함대 사령관", "Strait of Malacca Offshore Bunkering Supertanker Fleet Admiral"),
        ("런던 금속거래소 전 세계 구리·알루미늄 실물 비축 창고 총괄 책임자", "London Metal Exchange LME Global Metal Strategic Depository Chief"),
        ("아랍에미리트 두바이 인공섬 팜 주메이라 분양 및 해안선 개발 총재", "Dubai Palm Jumeirah Ultra-Luxe Coastline Development Sovereign Chief"),
        ("호주 필바라 철광석 자이언트 광산 100량 무인 열차 물류 총사령관", "Pilbara Australia Giant Iron Ore Autonomous 100-Car Train Logistics Chief"),
        ("칠레 아타카마 사막 백색 황금 리튬 염호 50년 독점 채굴권자", "Atacama Desert Salar White Gold Lithium 50-Year Monopoly Concessionaire"),
        ("카스피해 연안 전 세계 캐비아 유통 90% 독점 철갑상어 어업 제왕", "Caspian Sea Sturgeon Beluga Caviar 90% Global Distribution Tycoon"),
        ("멕시코만 심해 3,000m 시추선 플랜트 건조 프로젝트 총괄 디렉터", "Gulf of Mexico Ultra-Deepwater 3,000m Drillship Construction Director"),
        ("스위스 알프스 만년설 프리미엄 생수원 단독 파이프라인 소유주", "Swiss Alps High-Glacier Pristine Mineral Spring Sole Pipeline Baron"),
        ("인도 수라트 전 세계 90% 다이아몬드 연마 가공 공장 연합 총수", "Surat India 90% Global Diamond Polishing Conglomerate Mogul"),
        ("콩고민주공화국 탄탈럼·콜탄 광맥 글로벌 공급망 독점 계약관", "DR Congo Strategic Tantalum & Coltan Global Supply Exclusive Broker"),
        ("노르웨이 국부펀드 2,000조 원 유전 흑자 글로벌 부동산 운용 총괄", "Norway Sovereign Wealth Fund $1.5T Oil Surplus Real Estate Head"),
        ("페르시아만 액화천연가스 쇄빙선 100척 선단 총괄 선주", "Persian Gulf LNG Icebreaker Fleet 100-Vessel Sovereign Owner"),
        ("미국 네바다 사막 기가팩토리 원자재 공급망 단독 계약 거물", "Nevada Gigafactory Raw Materials Strategic Supply Exclusive Baron"),
        ("브라질 아마존 분지 희귀 목재 및 유기농 원료 독점 수출 제왕", "Amazon Basin Certified Rare Timber & Bioactive Raw Materials Export Czar"),
        ("그린란드 빙하 퇴적 희토류 탐사 및 광구 독점 보유자", "Greenland Subglacial Rare Earth Exploration Prime Concessionaire"),
        ("볼리비아 우유니 소금사막 리튬 채굴 합작법인 초대 총재", "Uyuni Salt Flat Bolivia Lithium State Joint-Venture President"),
        ("아이슬란드 지열 발전 에너지를 이용한 친환경 알루미늄 제련소 회장", "Iceland Geothermal Mega-Smelter Green Aluminum Industrial Chairman")
    ]
]

TIER_17_FICTION = [
    (title, en_title,
     "판타지 전설의 황금향 및 암흑 마피아 본부", "Fantasy Golden El Dorados & Syndicate Strongholds",
     "연봉 난쟁이 왕국 미스릴 주화 100,000닢 + 에레보르 보물 지분", "100,000 Mithril Sovereigns + Erebor Hoard Stake/year",
     f"{title}로서 에레보르의 외로운 산 황금 창고와 지니의 램프 소원 계약, 카리브해 저주받은 보물섬을 통치합니다. 거대한 보물과 해적, 암흑 연금술사들의 거대한 자산을 독점하고 관리합니다. 전설적인 보물과 신화적 재화를 독식하는 가상 세계 최대의 거물입니다.",
     f"Rules mythic treasuries, mountain hoards, and legendary wishing contracts as a {en_title}. Audits gold in Erebor, drafts contracts for Genies, and commands pirate syndicates.",
     "거대한 전설의 보물더미를 실물로 관리하는 황금 보물 창고의 주인!",
     "The master of mythic gold hoards and ancient sovereign treasures!")
    for title, en_title in [
        ("반지의 제왕 에레보르 외로운 산 황금 보물창고 수석 감사관", "Lord of the Rings Lonely Mountain Erebor Gold Hoard Chief Auditor"),
        ("알라딘 지니의 램프 소원 계약서 독소조항 검토 전문 로펌 대표변호사", "Aladdin Genie Lamp Three Wishes Contract Clause Senior Managing Partner"),
        ("캐리비안의 해적 아즈텍 저주받은 황금 주화 전 세계 밀수 협회장", "Pirates of the Caribbean Aztec Cursed Gold Smuggling Cartel President"),
        ("드래곤볼 천하제일무술대회 미스터 사탄 전속 스폰서십 및 세계 챔피언 연금 정산소장", "Dragon Ball World Martial Arts Champion Hercule Satan Global Sponsor Head"),
        ("하울의 움직이는 성 황야의 마녀 저택 마법 벨벳 카펫 및 금괴 수석 관리인", "Howl's Moving Castle Witch of the Waste Velvet Carpet & Gold Custodian"),
        ("나루토 아카츠키 미수 포획 군자금 100억 냥 환전소장", "Naruto Akatsuki Tailed Beast Bounty 10 Billion Ryo Vault Master"),
        ("헌터X헌터 조르딕 가문 암살 의뢰료 입금 확인 및 쿠쿠루 마운틴 시험의 문 수석 경비대장", "Zoldyck Assassin Family Wire Transfer Gatekeeper & Testing Gate Chief"),
        ("원피스 도플라밍고 드레스로자 지하 암흑 브로커 무기 카르텔 총괄 매니저", "One Piece Doflamingo Dressrosa Underground Arms Broker Grand Manager"),
        ("강철의 연금술사 싱 제국 황제 불로불사의 영약 진상 무역 대상단 총수", "Fullmetal Alchemist Xing Emperor Elixir of Immortality Caravan Grandmaster"),
        ("블리치 라스 노체스 아이젠 소스케 옥좌 순백색 대리석 광택사", "Bleach Las Noches Aizen Sosuke Throne Alabaster Marble Polisher"),
        ("유희왕 페가수스 J. 크로포드 인더스트리얼 일루전 창립자 전속 카드 인쇄 총괄", "Yu-Gi-Oh! Industrial Illusions Pegasus Chief Card Minting Director"),
        ("페이트 제로 영웅왕 길가메시 바빌론 주조소 황금 와인잔 세척관", "Fate/Zero Gilgamesh Golden Goblet Master Cellar Cleanser"),
        ("죠죠 스틸 볼 런 대륙횡단 레이스 5,000만 달러 상금 보관 열차 총괄 차장", "JoJo Steel Ball Run Transcontinental Race $50M Gold Train Conductor"),
        ("영웅전설 궤적 시리즈 이바르스 지하 카지노 붉은 성단 용병 계약 총재", "Trails Series Underground Casino Red Constellation Mercenary Boss"),
        ("어쌔신 크리드 템플 기사단 성궤 에덴의 조각 유물 거래소 총재", "Assassin's Creed Templar Pieces of Eden Secret Artifact Bourse Master"),
        ("다크소울 아노르 론도 태양의 제단 거인 대장장이 전용 쐐기석 원석 공급 거물", "Dark Souls Anor Londo Giant Blacksmith Titanite Slab Smuggling Tycoon"),
        ("엘든 링 도읍 로데일 황금 나무 성수 수액 채취 및 축복의 물병 독점 상인", "Elden Ring Leyndell Erdtree Sacred Sap & Blessed Flask Monopolist"),
        ("세키로 아시나 성 칠본창 비전 뇌명검 담금질용 특수 숯 공급 거간꾼", "Sekiro Ashina Seven Spears Lightning Blade Tamahagane Charcoal Broker"),
        ("몬스터 헌터 고룡종 나나-테스카토리 고염 보옥 경매 수석 중개인", "Monster Hunter Elder Dragon Teostra Hellfire Gem Auctioneer"),
        ("던전앤파이터 흑요정 왕국 언더풋 지하 황금 맥주 독점 양조장 주인", "Dungeon & Fighter Dark Elf Underfoot Underground Golden Ale Master"),
        ("메이플스토리 루디브리엄 시간의 신전 잃어버린 시간 괘종시계 금태엽 교체사", "MapleStory Temple of Time Lost Hour Grandfather Clock Gold Spring Horologist"),
        ("로스트아크 볼다이크 현자의 탑 호문클루스 연구 기금 100억 골드 총괄 회장", "Lost Ark Voldis Sage Tower Homunculus $80M Research Fund President"),
        ("원신 리월 칠성 천권 응광의 군옥각 비취 보석 공중 건축 자재 독점 납품상", "Genshin Impact Ningguang Jade Chamber Floating Masonry Exclusive Vendor"),
        ("나 혼자만 레벨업 백호 길드 안상민 부장 길드 인수 300억 계약서 검토관", "Solo Leveling White Tiger Guild $25M Acquisition Lead Legal Counsel"),
        ("전지적 독자 시점 한명오 부장 악마 부유성 월세 계약서 공증 변호사", "Omniscient Reader Han Myung-oh Demon Floating Castle Lease Notary")
    ]
]

# ==========================================
# TIER 18: 국가급 랜드마크·세계 경제를 쥐락펴락하는 거물 (850..899)
# ==========================================

TIER_18_REAL = [
    (title, en_title,
     "2024년 글로벌 중앙은행·네옴시티·초대형 국가 프로젝트", "2024, Central Banks, NEOM & Sovereign Mega-Landmarks",
     "연봉 5,000억 원 ~ 3조 원 (국가급 랜드마크 지분 & 특권 자산)",
     "$400 Million - $2.5 Billion/year (Sovereign Mega-Landmark Stakes)",
     f"{title}로서 인류 문명의 가장 거대한 랜드마크와 글로벌 통화 금융 시스템의 심장부를 관장합니다. 미국 연준의 기준금리 결정이나 네옴시티의 건설, CERN의 대형강입자가속기를 이끌며 국가 단위를 초월하는 영향력을 행사합니다. 인류 역사의 한 페이지를 직접 장식하는 거물입니다.",
     f"Presides over monumental civilizational landmarks and the heart of global monetary policy as a {en_title}. Delivers Fed rate announcements, leads NEOM's The Line, and steers CERN.",
     "국가 하나의 GDP를 능가하는 자금과 문명급 랜드마크를 총괄하는 글로벌 거물!",
     "Steering monumental civilizational projects that eclipse entire national economies!")
    for title, en_title in [
        ("미국 연방준비제도 기준금리 발표 1초 전 봉투 전달하는 수석 서기장", "US Federal Reserve FOMC Rate Decision 1-Second Envelope Chief Clerk"),
        ("사우디 네옴시티 '더 라인' 170km 거울 도시 총괄 마스터 건축가", "Saudi NEOM 'The Line' 170km Mirrored Megacity Master Lead Architect"),
        ("스위스 국제결제은행 국가 간 바젤III 금괴 결제 승인 총재", "Bank for International Settlements BIS Sovereign Gold Settlement Governor"),
        ("노벨상 기금 100년 글로벌 투자 운용 총괄 위원회 의장", "Nobel Foundation Centenary Global Investment Strategy Council Chair"),
        ("영국 런던 시티 자치 정부 수석 재무장관", "City of London Corporation Sovereign Chief Financial Chamberlain"),
        ("프랑스 파리 루브르 박물관 모나리자 방탄 특수 유리 교체 총괄 디렉터", "Musée du Louvre Mona Lisa Bulletproof Nano-Glass Chief Curator"),
        ("미국 엠파이어 스테이트 빌딩 & 록펠러 센터 통합 자산 관리 회장", "Empire State & Rockefeller Center Combined Asset Sovereign Chairman"),
        ("아랍에미리트 두바이 부르즈 할리파 828m 첨탑 유지보수 총사령관", "Burj Khalifa 828m Pinnacle Spire Maintenance Supreme Commander"),
        ("유럽원자핵공동연구소 27km 거대강입자가속기 힉스 입자 총괄 디렉터", "CERN 27km Large Hadron Collider Higgs Boson Chief Director"),
        ("미국 워싱턴 DC 스미소니언 박물관 연합 희귀 보물 총괄 수석 큐레이터", "Smithsonian Institution National Treasure Master Curator General"),
        ("영국 그리니치 천문대 본초자오선 0도 기준시계 공식 조율관", "Royal Observatory Greenwich Prime Meridian 0-Degree Master Horologist"),
        ("미국 포트 녹스 4,500톤 미국 국가 금괴 보관소 수석 사령관", "United States Bullion Depository Fort Knox 4,500-Ton Gold Commander"),
        ("바티칸 시스티나 성당 미켈란젤로 천장화 영구 복원 보존 총괄 감독", "Vatican Sistine Chapel Michelangelo Ceiling Master Conservator"),
        ("이집트 기자의 대피라미드 비밀 미발굴 챔버 탐사 총괄 고고학 최고책임자", "Great Pyramid of Giza Undiscovered Chamber Exploration Lead Archaeologist"),
        ("미국 후버 댐 수력발전 및 라스베이거스 전체 전력망 총괄 사령관", "Hoover Dam Hydroelectric & Las Vegas Mega-Grid Supreme Commander"),
        ("중국 삼협 댐 초당 10만 톤 방류량 조절 및 지구 자전 영향 모니터링 총괄", "Three Gorges Dam 100K-Ton Discharge & Planetary Spin Lead Engineer"),
        ("국제형사재판소 전 세계 독재자 은닉 비자금 100조 원 동결 집행관", "International Criminal Court Dictator $80B Slush Fund Freezing Marshall"),
        ("유럽중앙은행 500유로 지폐 위조 방지 홀로그램 마스터 플레이트 각인사", "European Central Bank ECB Hologram Master Engraving Master"),
        ("일본 후지산 화산 폭발 대비 지하 100km 방재 터널 프로젝트 총감독", "Mount Fuji Volcanic Eruption Subterranean 100km Disaster Tunnel Chief"),
        ("미국 나스닥 증권거래소 1초당 5,000만 건 거래 체결 엔진 단독 관리자", "NASDAQ Stock Market Ultra-Fast 50M TPS Matching Engine Architect"),
        ("싱가포르 창이 공항 보석 쥬얼 폭포 수량 조절 및 터미널 5 메가 허브 총괄", "Singapore Changi Airport Jewel Rain Vortex & Mega T5 General Director"),
        ("호주 시드니 오페라 하우스 하얀 돛 조개껍질 지붕 세라믹 타일 영구 보존관", "Sydney Opera House White Sail Shell Ceramic Tile Master Conservator"),
        ("미국 뉴욕 자유의 여신상 횃불 24K 순금 박편 영구 보존 수석 장인", "Statue of Liberty Torch 24K Gold Leaf Master Restorer"),
        ("스페인 바르셀로나 사그라다 파밀리아 성당 140년 만의 완공 총괄 수석 건축가", "Sagrada Família 140-Year Completion Chief Master Architect"),
        ("인도 타지마할 순백색 대리석 산성비 방지 나노 코팅 수석 총감독", "Taj Mahal Pure White Makrana Marble Anti-Acid Nanocoating Director")
    ]
]

TIER_18_FICTION = [
    (title, en_title,
     "판타지 신화 속 불멸의 수도 및 초문명 랜드마크", "Mythic Fictional Capitals & Ancient Super-Structures",
     "연봉 아틀란티스 오리할콘 100톤 + 세계수 황금 잎사귀", "100 Tons of Orichalcum + Yggdrasil Golden Foliage/year",
     f"{title}로서 드래곤볼의 캡슐코퍼레이션 특허부터 아틀란티스의 해저 황금 제국, 원피스의 성지 마리조아 판게아 성을 관장합니다. 국토 전체를 변환하는 연성진과 마법 성벽을 보존하고 관리합니다. 시대를 초월한 신화적 건축물과 마법 문명의 최정점을 수호합니다.",
     f"Oversees legendary civilizational super-structures of fiction as a {en_title}. Manages Capsule Corp patents, Atlantis orichalcum bourses, and Mariejois Pangaea Castle thrones.",
     "신화와 전설의 도시들을 실물로 관리하는 환상 세계의 최고 건축 총사령관!",
     "The grand custodian maintaining mythic capitals and legendary world wonders!")
    for title, en_title in [
        ("드래곤볼 캡슐코퍼레이션 타임머신 및 만능 캡슐 글로벌 독점 특허권자", "Dragon Ball Capsule Corp Hoi-Poi Capsule Global Patent Monopoly Owner"),
        ("아틀란티스 해저 황금 제국 왕실 국고 및 오리할콘 거래소 총재", "Atlantis Sub-Oceanic Golden Empire Orichalcum Sovereign Bourse Master"),
        ("엘도라도 황금향 도시 바닥 순금 타일 청소 및 광택 도편수", "El Dorado City of Gold Floor Solid Gold Tile Master Mason"),
        ("원피스 세계정부 오로성 마리조아 판게아 성 옥좌 붉은 양탄자 수석 관리관", "One Piece Mariejois Pangaea Castle Empty Throne Crimson Carpet Warden"),
        ("나루토 종말의 계곡 초대 호카게 하시라마 & 마다라 거대 석상 보수 조각사", "Valley of the End Hashirama & Madara Colossal Monument Master Sculptor"),
        ("강철의 연금술사 아메스트리스 국토 연성진 지하 통로 전구 교체 담당관", "Fullmetal Alchemist Amestris Transmutation Underground Bulb Keeper"),
        ("반지의 제왕 곤도르 백색의 탑 미나스 티리스 성문 미스릴 보강 장인", "Lord of the Rings Minas Tirith White Tower Mithril Gate Smith"),
        ("해리포터 마법부 미스터리 부서 예언의 방 유리구슬 먼지 제거 마법사", "Ministry of Magic Department of Mysteries Hall of Prophecy Glass Orb Duster"),
        ("헌터X헌터 메르엠 네테로 회장 '백식관음' 자폭 직후 지하 장미 폭탄 해체관", "Hunter x Hunter Poor Man's Rose Detonation Area Neutralization Specialist"),
        ("블리치 영왕궁 와카이야 성수 5인방 목욕탕 탕온 유지관", "Bleach Soul King Palace Royal Guard Kirindien Hot Spring Steward"),
        ("신비한 동물사전 프랑스 마법부 비밀 기록 보관실 움직이는 서랍 조련사", "French Ministry of Magic Moving Record Drawer Tamer"),
        ("죠죠 DIO의 스탠드 '더 월드' 9초 멈춘 시간 동안 포즈 잡아주는 연출가", "JoJo DIO The World 9-Second Frozen Time Pose Dramatic Director"),
        ("진격의 거인 3대 방벽 월 마리아·로제·시나 초대형 거인 석화 봉인사", "Attack on Titan Wall Maria, Rose & Sina Titan Hardening Seal Mason"),
        ("마블 닥터 스트레인지 카마르-타지 도서관 고대 마법서 금사 제본 장인", "Kamar-Taj Library Ancient Mystic Tomes Golden Thread Master Bookbinder"),
        ("리그 오브 레전드 데마시아 흰색 페트리사이트 바위 마법 억제 성벽 축조사", "League of Legends Demacia Petricite Magic-Dampening Wall Mason"),
        ("원신 몬드 페보니우스 기사단 진 간사 집무실 민원 서류 도장 자동 찍기 요원", "Genshin Impact Knights of Favonius Jean Desk Auto-Stamping Clerk"),
        ("젤다의 전설 하이랄 성 가논돌프 봉인의 방 마스터 소드 칼받침대 보존관", "Zelda Hyrule Castle Master Sword Pedestal Ancient Sacred Conservator"),
        ("다크소울 최초의 화로 그윈 왕 잔불 보충용 영혼 숯가마 화부", "Dark Souls Kiln of the First Flame Soul Charcoal Stoker"),
        ("엘든 링 거인들의 산령 거인들의 불마루 불가마 불꽃 지킴이", "Elden Ring Mountaintops of the Giants Forge Flame Guardian"),
        ("몬스터 헌터 용력선 신대륙 비행선 엔진 제트 추진 열기구 기장", "Monster Hunter Dragonship New World Expedition Aerial Commander"),
        ("로스트아크 엘가시아 낙원의 문 프로키온의 바다 차원문 수문장", "Lost Ark Elgacia Paradise Gate Dimension Ocean Warden"),
        ("던전앤파이터 마계 센트럴파크 케이트 정원 마계 꽃 화분 분갈이사", "Dungeon & Fighter Pandemonium Central Park Kate Garden Botanical Porter"),
        ("메이플스토리 에레브 신수 깃털 빗질 및 시그너스 여제 티테이블 세터", "MapleStory Ereve Holy Beast Feather Groomer & Empress Cygnus Tea Butler"),
        ("나 혼자만 레벨업 제주도 개미 레이드 베르 턱밑 긁개 장인", "Solo Leveling Jeju Island Ant King Beru Chin Scratches Craftsman"),
        ("전지적 독자 시점 종말의 방주 시나리오 티켓 1호석 VIP 승무원", "Omniscient Reader Ark of the Apocalypse Ticket #1 VIP Flight Purser")
    ]
]

# ==========================================
# TIER 19: 지구 최정상 부호·인류 미래 기술 독점 제왕 (900..949)
# ==========================================

TIER_19_REAL = [
    (title, en_title,
     "2024년 글로벌 기술 특권 제국·국제 해역 자유 공화국", "2024, Sovereign Tech Monopolies & High-Seas Empires",
     "연봉 5조 원 ~ 100조 원 (단독 원천 특허권 & 주권 배당금)",
     "$4 Billion - $80 Billion/year (Global Patent Monopoly & Sovereign Royalties)",
     f"{title}로서 인류 문명의 진화 방향과 미래 기술을 전 세계에서 독점 통제합니다. 150세 무병장수 신약 특허나 인공태양 핵융합, 양자 컴퓨터 암호 마스터키를 손에 쥐고 있습니다. 지구상 그 어떤 국가의 권력도 침범할 수 없는 인류 최고 정점의 독점 제왕입니다.",
     f"Wields absolute monopoly over the evolutionary leap of human civilization as a {en_title}. Holds single patents on 150-year biological rejuvenation, nuclear fusion, and quantum root encryption.",
     "인류의 생명 연장과 미래 청정 에너지를 손안에 쥐고 흔드는 지구 최정상의 독점 제왕!",
     "Holding the master keys to human longevity and nuclear fusion—the sovereign titans of Earth!")
    for title, en_title in [
        ("노화 역전 150세 회춘 신약 글로벌 특허를 단독 보유한 바이오 창업자", "Rejuvenation Biotech Founder Holding Sole Global Patent for 150-Year Lifespan"),
        ("태평양 공해상 세금 0% 초호화 인공 부유섬 공화국 초대 종신 대통령", "Tax-Free Pacific High Seas Ultra-Luxury Floating Island Sovereign President"),
        ("상온 초전도체 전력망 전 세계 독점 라이선스 보유 특허권자", "Room-Temperature Superconductor Power Grid Global Monopoly Patentee"),
        ("소형모듈원전 및 인공태양 핵융합 발전 글로벌 독점 사업자", "Small Modular Reactors & KSTAR Fusion Power Global Exclusive Operator"),
        ("전 세계 80억 명 뇌-컴퓨터 인터페이스 마스터 서버 총괄 아키텍트", "Neuralink 8 Billion Humans Brain-Computer Interface Master Architect"),
        ("전 세계 양자 컴퓨터 글로벌 금융 보안 마스터키 보관 재단 의장", "Global Quantum Computer Financial Security Root Key Foundation Chairman"),
        ("인공지능 AGI 싱귤래리티 글로벌 윤리 정지 스위치 단독 보유관", "Artificial General Intelligence AGI Singularity Global Emergency Kill-Switch Keeper"),
        ("인류 탄소 배출권 50%를 혼자 소유한 글로벌 기후 제국 총재", "Global Carbon Credit 50% Monopoly Sovereign Climate Empire Sovereign"),
        ("유전자 편집 크리스퍼 인간 맞춤형 DNA 설계 글로벌 특허권자", "CRISPR Human Custom DNA Designer Global Core Patentee"),
        ("지구 자기장 교정 및 초거대 지오엔지니어링 성층권 차광막 프로젝트 총사령관", "Planetary Geomagnetic Correction & Stratospheric Solar Shield Commander"),
        ("전 세계 해수 담수화 플랜트 70%를 통제하는 글로벌 물 제국 독점 황제", "Global Desalination 70% Monopoly Clean Water Sovereign Emperor"),
        ("지구 내핵 열에너지 직결 초거대 지열 발전 프로젝트 총괄 수석", "Planetary Core Geothermal Infinite Energy Mega-Grid Lead Engineer"),
        ("전 인류 합성 다이아몬드 & 인공 금 합금 양산 기술 특허권자", "Synthetic Diamond & Gold Transmutation Mass-Production Patentee"),
        ("대기 중 수소 추출 및 무한 청정 에너지 글로벌 배급 카르텔 의장", "Atmospheric Hydrogen Extraction & Clean Fuel Global Distribution Head"),
        ("마리아나 해구 11,000m 해저 하이퍼루프 대륙간 초고속 열차 총괄 디렉터", "Mariana Trench 11,000m Subsea Transcontinental Vacuum Hyperloop GM"),
        ("전 세계 곡물 수확량 10배 증폭 나노 비료 원천 기술 독점 기업 회장", "Global Crop Yield 10x Nano-Fertilizer Exclusive Tech Conglomerate Chair"),
        ("암 완치 및 유전병 100% 치료 나노 로봇 전 세계 독점 공급자", "Cancer Cure & Genetic Nanobot Medical Swarm Global Monopoly Provider"),
        ("인류 기억 백업 및 디지털 트윈 클라우드 서버 초대 창립자", "Human Memory Cloud Backup & Digital Twin Neural Network Founder"),
        ("초거대 인공강우 및 지구 기후 조절 에어로졸 분사 함대 총사령관", "Planetary Geo-Rain Cloud Seeding Aerial Fleet Grand Admiral"),
        ("전 세계 하이퍼루프 진공 튜브 대륙간 교통망 통합 의장", "Worldwide Vacuum Tube Hyperloop Intercontinental Transit Commission Chair"),
        ("인공 혈액 및 인공 장기 3D 바이오 프린팅 글로벌 독점 재벌", "Synthetic Universal Blood & 3D Bio-Printed Organ Monopoly Tycoon"),
        ("지구 해양 쓰레기 100% 분해 미생물 특허 보유 환경 황제", "Ocean Plastic Complete Biodegradation Microbe Patent Monopoly Baron"),
        ("전 세계 로봇 안드로이드 노동력 10억 대 중앙 OS 총괄 개발자", "Global 1 Billion Android Labor Force Central Operating System Architect"),
        ("무병장수 영생 바이오 캡슐 글로벌 공급 독점 재단 이사장", "Cellular Regeneration Biological Stasis Capsule Global Monopoly Head"),
        ("지구 전체 생태계 멸종 방지 노아의 방주 디지털 유전자 뱅크 총재", "Planetary Noah's Ark Digital Genome Sovereign Vault President")
    ]
]

TIER_19_FICTION = [
    (title, en_title,
     "신화적 신전 및 다차원 신들의 황금 회의", "Mythological Pantheons & Divine Halls",
     "연봉 올림포스 암브로시아 100병 + 신들의 황금 사과", "100 Flagons of Ambrosia + Golden Apple of Immortality/year",
     f"{title}로서 아스가르드의 무지개다리 바이프로스트부터 올림포스 제우스의 번개 발전소, 북유럽 세계수 위그드라실을 관장합니다. 신화와 영웅, 초월적 존재들의 의전에 관여하며 신화와 차원의 근원적인 에너지를 다룹니다. 신들의 세계에서 인정받는 절대적인 권능의 대행자로 군림합니다.",
     f"Administers mythic pantheons and divine energy sources as a {en_title}. Manages Bifrost toll gates in Asgard, Zeus's lightning generators on Olympus, and Yggdrasil's roots.",
     "신들과 어깨를 나란히 하며 신화적 에너지를 독점하는 초월적 존재들의 총괄 관리관!",
     "Standing beside mythic gods to oversee legendary divine energies—divine administrators!")
    for title, en_title in [
        ("마블 아스가르드 헤임달의 바이프로스트 무지개 다리 통행권 발급 청장", "Marvel Asgard Heimdall Bifrost Rainbow Bridge Customs Director"),
        ("올림포스 신전 제우스 번개 에너지 발전소 및 넥타르 독점 양조장 주인", "Mount Olympus Zeus Lightning Power Plant & Nectar Monopoly Brewer"),
        ("북유럽 신화 세계수 위그드라실 황금 사과 농장주 겸 가지치기 정원사", "Norse Yggdrasil World Tree Golden Apple Orchardist & Pruner"),
        ("이집트 라 신전 태양 마차 바퀴살 황금 광택 및 쇠똥구리 조련관", "Ancient Egypt Sun God Ra Solar Chariot Wheel Polisher"),
        ("인도 신화 비슈누 아바타 변신 메이크업 수석 아티스트", "Hindu Mythology Lord Vishnu Avatar Incarnation Chief Stylist"),
        ("도라에몽 '만약에 박스' 패러렐 월드 생성기 전원 어댑터 수리공", "Doraemon What-If Telephone Booth Reality Generator Electrician"),
        ("드래곤볼 신룡 소원 접수 번호표 발행 및 드래곤볼 레이더 교정사", "Dragon Ball Shenron Wishing Queue Ticket Issuer & Radar Calibrator"),
        ("원피스 악마의 열매 나무 과수원 농약 살포 및 품종 개량 연구소장", "One Piece Devil Fruit Sacred Orchard Caretaker & Geneticist"),
        ("나루토 무한 츠쿠요미 꿈속 이상향 시나리오 외주 작가", "Naruto Infinite Tsukuyomi Dream World Lead Utopia Screenwriter"),
        ("블리치 만해 각성 전용 영혼의 담금질 풀무질 대장장이", "Bleach Bankai Soul-Forging Sacred Smelting Blacksmith"),
        ("헌터X헌터 암흑대륙 만병통치약 '궁극의 풀' 독점 채취 허가청장", "Hunter x Hunter Dark Continent Ultimate Cure Herb Harvesting Commissioner"),
        ("페이트 그랜드 오더 인리소각 방지 인류사 7대 특이점 수복 공사 소장", "Fate/Grand Order 7 Singularities Human Order Restoration Director"),
        ("에반게리온 인류보완계획 LCL 용액 오렌지 주스 맛 첨가 연구원", "Evangelion Human Instrumentality LCL Orange Juice Flavoring Chemist"),
        ("신세기 사이버 포뮬러 아스라다 사념 엔진에 말대꾸 안 하기 코칭 전문가", "Cyber Formula Asurada Cybernetic Mind Non-Backtalk Mental Coach"),
        ("천원돌파 그렌라간 나선력 드릴 나선 홈 초정밀 밀링 머신 가공사", "Tengen Toppa Gurren Lagann Spiral Power Drill CNC Precision Machinist"),
        ("강철의 연금술사 진리의 문 앞 '진리'와 1:1 등가교환 환율 협상 브로커", "Fullmetal Alchemist Gate of Truth Equivalent Exchange Arbitrage Broker"),
        ("죠죠 디오의 '천국에 도달한 더 월드' 시공간 오버라이트 잉크 조제관", "JoJo The World Over Heaven Reality-Overwrite Cosmic Ink Brewer"),
        ("리그 오브 레전드 룬테라 세계 룬 5개 격리용 마법 상자 열쇠 장인", "League of Legends World Runes Sacred Containment Chest Keylocksmith"),
        ("원신 티바트 대륙 천리의 주관자 큐브 봉인 해제 핀셋 제작자", "Genshin Impact Sustainer of Heavenly Principles Cube Tweezers Craftsman"),
        ("젤다의 전설 트라이포스 황금 삼각형 모서리 버핑 장인", "Zelda Golden Triforce Courage-Wisdom-Power Edge Polishing Artisan"),
        ("다크소울 불의 시대 연장을 위한 100만 영혼 압축 펠릿 제조공", "Dark Souls Age of Fire 1,000,000-Soul Fuel Pellet Compressor"),
        ("엘든 링 엘데의 짐승 꼬리 별빛 털 빗질 및 황금 율법 조율관", "Elden Ring Elden Beast Starlight Tail Groomer & Golden Order Tuner"),
        ("메이플스토리 초월자 검은 마법사 제네시스 무기 해방 퀘스트 면제권 판매상", "MapleStory Genesis Weapon Liberation Quest Exemption Voucher Vendor"),
        ("나 혼자만 레벨업 윤회의 잔 시간 되돌리기 모래시계 모래알 세공사", "Solo Leveling Cup of Reincarnation Time-Reversal Sand Hourglass Lapidary"),
        ("전지적 독자 시점 가장 오래된 꿈 전용 지하철 쾌적 수면 담요 세터", "Omniscient Reader Oldest Dream Subway Carriage Comfort Blanket Attendant")
    ]
]

# ==========================================
# TIER 20: 우주 개척·은하계·다중우주 시공간 창조 아키텍트 (950..1000, 51 items)
# (HERE AND ONLY HERE: Space, Planetary, Galactic, Dyson Sphere, Multiverse!)
# ==========================================

TIER_20_REAL = [
    (title, en_title,
     "서기 3000년~50000년 대우주 성간 문명 및 시공간 본부", "3000-50,000 AD, Intergalactic Civilization & Spacetime Directorate",
     "연봉 측정 불가 (100조 개 은하계 소유권 및 시공간 법칙 제정권)",
     "Priceless (Sovereign Ownership of 100 Trillion Galaxies & Spacetime Law)",
     f"{title}로서 인류가 지구를 넘어 태양계와 은하계, 다중우주의 법칙을 제정하는 초고도 문명의 최고 사령관으로 군림합니다. 황금 소행성 채굴선과 다이슨 스피어 에너지를 지휘하며, 마침내 시공간과 다중우주 빅뱅 시뮬레이션을 완성합니다. 인류 지성의 영원한 오메가 포인트에 도달한 창조주 아키텍트입니다.",
     f"Presides at the absolute pinnacle of cosmic evolution, intergalactic energy, and dimensional creation as a {en_title}. Commands Dyson swarms, terraforms entire worlds, and authors Big Bangs at the Omega Point.",
     "인류 문명의 정점이자 다중우주 법칙을 제정하고 영생을 관장하는 전설의 창조 아키텍트!",
     "The ultimate apex of cosmic human intelligence, authoring physics at the Multiverse Omega Point!")
    for title, en_title in [
        ("황금 소행성 '프시케 16'(가치 1해 원) 채굴 탐사선 총사령관", "16 Psyche $10 Quintillion Gold Asteroid Deep Mining Armada Supreme Commander"),
        ("화성 올림푸스 화산 정상 테라포밍 산소 발생 기지 총감독", "Mars Olympus Mons Terraforming Atmosphere Plant Grand Director"),
        ("달 남극 섀클턴 분화구 영구 얼음 채굴 및 수소 로켓 연료 기지 총재", "Lunar South Pole Shackleton Crater Water Mining & Fuel Sovereign Chief"),
        ("목성 위성 유로파 지하 얼음 바다 외계 생명체 탐사 핵잠수함 함장", "Jupiter Moon Europa Sub-Glacial Ocean Alien Life Exploration Nuclear Submarine Captain"),
        ("토성 고리 청정 얼음 채취 및 초순수 우주 생수 제조사 회장", "Saturn Ring Ice Harvester & Ultra-Pure Space Mineral Water Conglomerate Chair"),
        ("태양 궤도 1AU 지점 다이슨 스피어 태양광 패널 10억 장 시공 총괄", "1 AU Solar Orbit Dyson Sphere 1 Billion Photovoltaic Swarm Master Builder"),
        ("지구-달 라그랑주점 L1 우주 엘리베이터 36,000km 케이블 총괄 관리자", "Earth-Moon L1 Lagrange Point 36,000km Space Elevator Cable Director"),
        ("알파 센타우리 성간 탐사선 광속 20% 이온 추진 엔진 수석 설계자", "Alpha Centauri 0.2c Relativistic Ion Drive Propulsion Chief Architect"),
        ("금성 대기권 50km 공중 부유 도시 '클라우드 시티' 초대 총독", "Venusian 50km Atmosphere Cloud City Sovereign High Governor"),
        ("해왕성 대기권 초고압 다이아몬드 비(Rain) 포획 우주선 선단장", "Neptune Diamond Rain High-Pressure Atmospheric Harvesting Fleet Commodore"),
        ("카이퍼 벨트 왜소행성 명왕성 극저온 질소 얼음 우주 물류 허브 지배인", "Kuiper Belt Pluto Cryogenic Nitrogen Deep Space Logistics Hub GM"),
        ("오르트 구름 성간 혜성 궤도 수정 및 지구 충돌 방지 행성 방위군 총사령관", "Oort Cloud Interstellar Comet Deflection Planetary Defense Supreme Commander"),
        ("성간 우주 이민선 아크 10만 명 100년 동면 캡슐 총괄 생명유지관", "Interstellar Arc 100,000-Colonist Century Cryo-Sleep Chief Life Officer"),
        ("외계 문명 신호 탐사 외계 펄서 전파 해독 첫 인류 공식 교섭 대사", "SETI Decryption First Contact Humanity Plenipotentiary Ambassador"),
        ("태양계 소행성대 세레스 자치령 광물 채굴 조합 총의장", "Ceres Asteroid Belt Autonomous Territory Mining Syndicate President"),
        ("암흑물질 & 암흑에너지 우주 농축 발전소 수석 양자물리학자", "Dark Matter & Dark Energy Quantum Condensation Power Station Chief"),
        ("초거대 블랙홀 회전 에너지 추출 '펜로즈 과정' 상용화 발전소장", "Supermassive Black Hole Penrose Process Ergosphere Energy Plant GM"),
        ("은하계 중심 초대질량 블랙홀 궁수자리 A* 관측 중력파 망원경 대장", "Sagittarius A* Galactic Center Supermassive Black Hole Gravitational Telescope Director"),
        ("성간 우주 워프 게이트 시공간 압축 터널 인프라 총괄 최고책임자", "Interstellar Warp Gate Metric Engineering Spacetime Highway CEO"),
        ("다이슨 스웜 100만 개 위성 성간 무선 전력 송출 총괄 네트워크 의장", "Dyson Swarm 1,000,000-Collector Interstellar Wireless Power Grid Chair"),
        ("카르다쇼프 척도 2단계 문명 진입 태양계 전체 통합 에너지 총재", "Kardashev Scale Type-II Civilization Unified Solar Energy Sovereign"),
        ("우리 은하 1,000억 개 항성계 정밀 3D 지도 작성 우주선단 제독", "Milky Way 100-Billion-Star 3D Cartography Fleet Grand Admiral"),
        ("인류 문명 10억 년 생존 보존을 위한 은하계 외곽 DNA 아카이브 총괄", "Deep Galactic Rim 1-Billion-Year Human Civilization Genomic Vault Keeper"),
        ("은하 충돌(안드로메다-우리은하) 40억 년 궤도 계산 행성 이주 계획관", "Milky Way-Andromeda Galactic Collision 4-Billion-Year Relocation Architect"),
        ("시공간 웜홀 통과 안정성 검증 1호 무인 탐사선 원격 조종사", "Einstein-Rosen Wormhole Transversal Integrity Drone Pilot"),
        ("다중우주 빅뱅 시뮬레이션 및 오메가 포인트 영생 클라우드 총괄 창조 아키텍트", "Multiverse Big Bang Simulator & Omega Point Eternal Life Cloud Architect-Creator")
    ]
]

TIER_20_FICTION = [
    (title, en_title,
     "SF 명작 우주 제국 및 다중우주 시공간 신화", "Sci-Fi Space Empires & Multiverse Mythologies",
     "연봉 다중우주 빅뱅 에너지 코어 + 시공간 법칙 변경권", "Multiverse Big Bang Energy Core + Spacetime Rewriting Rights/year",
     f"{title}로서 은하 제국의 데스스타부터 인터스텔라의 5차원 테서랙트, 닥터 후의 시간 전쟁까지 우주적 서사의 정점을 지배합니다. 듄의 아라키스 행성 스파이스와 스타워즈의 하이퍼드라이브를 호령합니다. 마침내 100조 개의 평행우주 시나리오를 집필하고 빅뱅 스위치를 누르는 전설의 총감독으로 등극합니다.",
     f"Rules the grandest fictional space operas and multiverse epics as a {en_title}. Commands Death Star superlasers, traverses Interstellar tesseracts, and harvests Arrakis spice.",
     "다중우주의 시간과 공간을 주무르며 빅뱅 스위치를 손에 쥔 궁극의 SF 판타지 지배자!",
     "Holding the master switch to the Big Bang across 100 trillion parallel realities—the supreme cosmic director!")
    for title, en_title in [
        ("토성 고리 얼음 절벽 봅슬레이 리조트 회장 및 은하계 워프 고속도로 톨게이트 황제", "Saturn Ring Ice Bobsled Resort Chair & Galactic Warp Tollway Emperor"),
        ("스타워즈 은하 제국 데스스타 슈퍼레이저 초점 렌즈 먼지 털이관", "Star Wars Death Star Superlaser Optical Crystal Lens Duster"),
        ("은하수를 여행하는 히치하이커를 위한 안내서 42번 답안지 해설 강사", "Hitchhiker's Guide to the Galaxy Ultimate Question Answer 42 Lecturer"),
        ("인터스텔라 가르강튀아 블랙홀 너머 5차원 테서랙트 책장 서가 정리원", "Interstellar Gargantua 5th-Dimensional Tesseract Bookshelf Librarian"),
        ("스타트렉 USS 엔터프라이즈 워프 항법 워프 코어 딜리튬 결정체 조율사", "Star Trek USS Enterprise Warp Core Dilithium Crystal Resonance Specialist"),
        ("가디언즈 오브 갤럭시 노웨어 거대 우주신 셀레스티얼 두개골 채굴 총감독", "Guardians of the Galaxy Knowhere Celestial Skull Mining Director"),
        ("마블 토르 아스가르드 세계선 우주 고래 레비아탄 고삐 조종사", "Marvel Space Leviathan Bridle Rein Pilot"),
        ("닥터 후 시간 전쟁 갈리프레이 행성 타임로드 평의회 찻잔 서빙관", "Doctor Who Time War Gallifrey High Council Time Lord Tea Server"),
        ("듄 아라키스 행성 거대 모래벌레 샤이 훌루드 스파이스 멜란지 독점 채취권자", "Dune Arrakis Sandworm Shai-Hulud Spice Melange Sovereign Harvester"),
        ("릭 앤 모티 다차원 포탈건 유체 리필 및 평행우주 모티 분양소장", "Rick and Morty Multiverse Portal Gun Fluid Refill & Clone Adoption Center Director"),
        ("스타크래프트 프로토스 아이어 행성 카다린 크리스탈 공명 조율사", "StarCraft Protoss Aiur Khaydarin Crystal Resonance Harmonizer"),
        ("헤일로 링월드 인스톨레이션 04 테라포밍 중력 제어기 수석 엔지니어", "Halo Installation 04 Ringworld Artificial Gravity Lead Engineer"),
        ("우주전함 야마토 파동포 충전 밸브 압력 게이지 바늘 수리공", "Space Battleship Yamato Wave Motion Gun Pressure Needle Mechanic"),
        ("스타쉽 트루퍼스 아라크니드 브레인 버그 뇌파 수면 유도관", "Starship Troopers Arachnid Brain Bug Telepathic Hypnotist"),
        ("은하철도 999 999호 기관차 보일러실 우주 탄광 석탄 투입 화부", "Galaxy Express 999 Locomotive Cosmic Firebox Stoker"),
        ("매스 이펙트 은하계 릴레이 매스 릴레이 초광속 가속기 윤활유 주입사", "Mass Effect Interstellar Relay FTL Accelerator Lubrication Tech"),
        ("워해머 40K 인류제국 황제 황금 옥좌 사이킥 등대 1,000명 영혼 배전반", "Warhammer 40K Emperor Golden Throne Astronomican Soul Switchboard Tech"),
        ("아바타 이크란 공중 편대 비행용 신경 접속 헤드셋 세척관", "Avatar Ikran Aerial Banshee Neural Headset Sanitizer"),
        ("매트릭스 23번째 시온 재건 및 아키텍트 흰 방 TV 모니터 전원 검사관", "Matrix 23rd Zion Reconstruction & Architect White Room TV Screen Inspector"),
        ("인터스텔라 밀러 행성 1시간=7년 시간 지연 이자 복리 계산사", "Interstellar Miller's Planet 1 Hour = 7 Years Time Dilation Compound Interest Actuary"),
        ("마블 인피니티 워 타노스 인피니티 건틀릿 손가락 스냅 방지 고무 캡 장착사", "Marvel Thanos Infinity Gauntlet Finger-Snap Safety Rubber Cap Fitter"),
        ("스타워즈 밀레니엄 팔콘 하이퍼드라이브 고장 날 때 쿵 내려치는 망치 기술자", "Millennium Falcon Hyperdrive Failsafe Hammer-Banging Virtuoso"),
        ("신세기 에반게리온 릴리스의 방 롱기누스 창 거치대 녹 제거사", "Neon Genesis Evangelion Central Dogma Spear of Longinus Rust Buffer"),
        ("테넷 사토르 역엔트로피 인버전 회전문 탑승 시간 안내원", "Tenet Sator Reverse-Entropy Inversion Turnstile Turnstile Concierge"),
        ("100조 개의 평행우주 시나리오를 집필하고 빅뱅 스위치를 누르는 다중우주 총감독", "Multiverse Grand Director Authoring 100 Trillion Parallel Realities and Pressing the Big Bang Switch")
    ]
]

print("Tiers 16 to 20 successfully loaded.")
