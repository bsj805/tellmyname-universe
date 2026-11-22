# -*- coding: utf-8 -*-
"""
125 New Curated REAL GOOD House Entries (Tiers 11 - 20)
Inspired by world-class luxury architecture, breathtaking natural retreats,
engineering marvels, billionaire superyachts, and astronomical observatories.
"""

from scripts.build_data_real_bad import CATEGORY_MAP

RAW_REAL_GOOD = [
    # Tier 11 (0..12)
    {
        'cat': 'EXTREME_NATURE',
        'title': '핀란드 라플란드 카크슬라우타넨 유리 이글루 오로라 스노우 롯지',
        'year': '1999년 북극권 유리 돔 리조트',
        'val': '8억 5,000만 원 (1박 180만 원 선약 필수)',
        'feat': '특수 열선 유리 돔 천장을 통해 영하 30도의 눈보라 속에서도 따뜻한 침대에 누워 밤하늘에 춤추는 초록빛 오로라를 감상합니다.',
        'verd': '순록이 창밖을 스쳐 지나가고 벽난로 자작나무 타는 향기가 온몸을 녹여주는 북유럽 극지의 낭만 힐링 하우스입니다.',
        'prompt': 'Breathtaking nighttime photography of a luxury thermal glass igloo at Kakslauttanen Lapland Finland, brilliant neon-green Aurora Borealis swirling in starry Arctic sky, glowing warm interior, snow covered pine trees, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '인도네시아 발리 우붓 아융강 계곡 대나무 친환경 3층 트리하우스 풀빌라',
        'year': '2018년 친환경 대나무 건축 마스터',
        'val': '15억 원 (친환경 천연 곡선 건축 가치)',
        'feat': '못 하나 쓰지 않고 대나무로만 엮어 올린 유려한 곡선의 3층 트리하우스로, 절벽 인피니티풀에서 열대 우림과 계곡물 소리를 즐깁니다.',
        'verd': '자연과 건축의 경계가 완전히 허물어진, 발리 정글의 맑은 공기와 새소리가 영혼을 치유하는 에코 럭셔리 빌라입니다.',
        'prompt': 'Architectural masterpiece photograph of a curving three-story sustainable bamboo luxury treehouse villa in Ubud Bali jungle, open-air living room, infinity plunge pool overlooking Ayung River gorge, morning mist, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '스위스 알프스 체르마트 마테호른 뷰 야외 온수 자쿠지 목조 샬레',
        'year': '2012년 스위스 알파인 샬레 명작',
        'val': '42억 원 (알프스 최고봉 파노라마 뷰)',
        'feat': '해발 1,600m 테라스의 김이 모락모락 피어오르는 온수 자쿠지에 몸을 담그고 피라미드 모양의 마테호른 황금빛 일출을 독점합니다.',
        'verd': '최고급 스위스 소나무 향기가 가득한 실내 벽난로 앞에서 퐁뒤를 맛보는 유럽 알프스의 궁극의 스키 인/아웃 샬레입니다.',
        'prompt': 'Spectacular alpine photography of a steaming outdoor hot tub jacuzzi on a cedar wood balcony in Zermatt Switzerland, iconic Matterhorn peak rising majestically in background during golden sunrise, snow covered chalets, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '남아공 크루거 국립공원 사파리 별빛 아래 프라이빗 럭셔리 캔버스 텐트',
        'year': '2015년 최고급 글램핑 사파리 로지',
        'val': '22억 원 (빅5 동물 프라이빗 사파리 권리)',
        'feat': '사바나의 밤하늘 은하수가 쏟아지는 데크 위에서 사자와 코끼리의 울음소리를 들으며 킹사이즈 침대에서 잠듭니다.',
        'verd': '완벽한 호텔 서비스와 야생의 스릴이 공존하는 아프리카 대륙 최고의 하이엔드 글램핑 파라다이스입니다.',
        'prompt': 'Luxurious safari lodge photography in Kruger National Park South Africa, elegant open-air canvas luxury tent suite on raised wooden deck, starry African night sky, lantern lit dinner setting, watering hole below, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '일본 교토 아라시야마 대나무 숲속 300년 전통 프라이빗 료칸 온천 스위트',
        'year': '1716년 에도 시대 창건 전통 료칸',
        'val': '35억 원 (300년 정원 보존 문화재 가치)',
        'feat': '바람에 사각거리는 대나무 숲 한가운데 편백나무(히노키) 야외 노천탕에서 유황 온천수를 즐기며 가이세키 정찬을 맞이합니다.',
        'verd': '일본 전통 와비사비(侘寂) 미학의 정수 속에서 물소리와 바람 소리만으로 번뇌를 씻어내는 힐링 온천 명당입니다.',
        'prompt': 'Serene Japanese architecture photography of a luxury private ryokan suite in Arashiyama Kyoto, steaming outdoor hinoki cedar onsen tub overlooking bamboo grove illuminated by soft garden lanterns, autumn maple leaves, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '모로코 마라케시 메디나 유서 깊은 리야드 모자이크 타일 중정 분수 빌라',
        'year': '1850년 귀족 저택 보존 복원',
        'val': '28억 원 (장인 수작업 젤리즈 타일)',
        'feat': '외부에서는 소음이 완전히 차단된 채, 오렌지 나무가 자라는 중정 분수대와 정교한 모로코 아라베스크 타일 회랑을 거닙니다.',
        'verd': '아라비안나이트의 천일야화 속으로 걸어 들어온 듯한 신비로운 이슬람 정원 건축의 평온한 오아시스입니다.',
        'prompt': 'Exquisite interior architectural photo of a traditional Moroccan Riad courtyard in Marrakech, turquoise plunge pool reflecting intricate zellij mosaic tiles, carved cedar wood archways, banana palms, soft lanterns, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '아이슬란드 블루라군 지열 실리카 프라이빗 라군 직결 모던 글래스 스위트',
        'year': '2018년 더 리트리트 앳 블루라군',
        'val': '65억 원 (프라이빗 지열 미네랄 워터 독점권)',
        'feat': '테라스 문을 열고 걸어 나가면 바로 우윳빛 청록색 38도 미네랄 실리카 온천수로 연결되는 세계 유일의 화산암 라군 스위트입니다.',
        'verd': '검은 화산암 절벽과 신비로운 지열 증기 속에서 피부와 피로를 완벽하게 재생시키는 북대서양의 웰니스 성채입니다.',
        'prompt': 'High-end architectural photography at The Retreat at Blue Lagoon Iceland, minimalist modern glass suite with direct private steps into steaming milky-turquoise geothermal waters, dark mossy volcanic lava fields, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '칠레 파타고니아 에코캠프 토레스 델 파이네 지오데식 돔 롯지',
        'year': '2001년 세계 최초 파타고니아 지오데식 돔',
        'val': '18억 원 (지속 가능한 청정 에너지 가치)',
        'feat': '녹색 돔 천장의 투명 창을 통해 파타고니아의 거대한 삼각 화강암 첨탑(토레스 봉우리)과 은하수를 누워서 감상합니다.',
        'verd': '파타고니아의 거친 돌풍에도 흔들림 없는 완벽한 구형 구조 속에서 안데스의 야생을 만끽하는 에코 롯지입니다.',
        'prompt': 'Stunning travel photography of a cozy geodesic dome suite at EcoCamp Patagonia in Torres del Paine, glowing interior warmth, dramatic granite horns soaring against starry dusk sky, wild steppe, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '태국 코사무이 절벽 해안 파노라마 인피니티풀 열대 오션 빌라',
        'year': '2020년 안다만 해안 절벽 빌라',
        'val': '32억 원 (태국만 180도 파노라마 오션뷰)',
        'feat': '거실 통유리가 바다를 향해 활짝 열리며 20m 인피니티풀의 수면이 에메랄드빛 바다 수평선과 완벽하게 하나가 됩니다.',
        'verd': '개인 버틀러가 서빙하는 트로피컬 칵테일을 마시며 남태평양의 황홀한 핑크빛 선셋을 감상하는 풀빌라의 정석입니다.',
        'prompt': 'Breathtaking luxury travel photo of a cliffside infinity pool villa in Koh Samui Thailand, glass pavilion seamlessly blending into seamless horizon of turquoise Gulf of Thailand, golden sunset, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '호주 블루마운틴 유칼립투스 계곡 위 공중 부유 에코 글래스 트리하우스',
        'year': '2016년 호주 친환경 건축 수상작',
        'val': '25억 원 (원시 유칼립투스 숲 독점 조망)',
        'feat': '바닥과 벽면 전체가 통유리로 설계되어 해발 800m 유칼립투스 나무 꼭대기 사이 공중에 둥둥 떠 있는 듯한 착각을 줍니다.',
        'verd': '푸른 안개가 피어오르는 유칼립투스 숲 향기를 맡으며 코알라와 눈높이를 맞추는 공중 부유 유리 정원입니다.',
        'prompt': 'Daring architectural photography of a glass-walled luxury treehouse cantilevered over deep eucalyptus canyon in Blue Mountains Australia, blue mist rising, morning sunbeams through forest canopy, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 몬태나 로키산맥 럭셔리 랜치 옐로스톤 강가 플라이낚시 롯지',
        'year': '2010년 로키산맥 프라이빗 랜치',
        'val': '55억 원 (1만 평 사유지 및 전용 강줄기)',
        'feat': '거대한 통나무와 자연석으로 마감된 롯지 앞마당 잔디밭에서 몇 걸음만 걸어나가면 은빛 송어가 튀어 오르는 청정 계곡입니다.',
        'verd': '영화 <흐르는 강물처럼>의 낭만을 현대적인 5성급 럭셔리로 승화시킨 아메리칸 로키산맥의 클래식 롯지입니다.',
        'prompt': 'Atmospheric luxury ranch photography in Montana along Yellowstone River, majestic timber frame log mansion with roaring stone outdoor fireplace, fly fisherman on crystal clear river with mountain peaks, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '캐나다 밴프 국립공원 페어몬트 밴프 스프링스 헤리티지 성채 온천 스위트',
        'year': '1888년 로키산맥의 성채 호텔',
        'val': '78억 원 (로키산맥 세계유산 중심부)',
        'feat': '스코틀랜드 남작 양식의 고풍스러운 석조 성채 최상층 스위트에서 보우 폭포와 런들산 설벽을 내려다보며 광천 온천수를 즐깁니다.',
        'verd': '130년 역사의 우아함과 캐나다 로키산맥의 압도적인 자연 경관이 어우러진 북미 최고의 헤리티지 팰리스입니다.',
        'prompt': 'Historic grand hotel photography of Fairmont Banff Springs castle nestled amid towering Canadian Rockies pines, Bow River rapids below, turrets and stone battlements crowned with fresh snow, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '노르웨이 피오르드 절벽 끝 통유리 뷰 버드네스트(Birdbox) 미니멀 샬레',
        'year': '2019년 노르웨이 미니멀리즘 디자인 롯지',
        'val': '12억 원 (노르드피오르드 파노라마 뷰)',
        'feat': '절벽 바위 위에 새 둥지처럼 걸쳐진 미래형 큐브 샬레로, 침대에 누우면 360도 통유리창으로 피오르드의 빙하 폭포가 쏟아집니다.',
        'verd': '극단적인 미니멀리즘 디자인을 통해 오직 나와 노르웨이의 피오르드 대자연만이 대화하는 궁극의 사색 공간입니다.',
        'prompt': 'Minimalist architectural photography of a black geometric Birdbox cabin perched on rugged cliff edge above deep blue Nordfjord Norway, massive panoramic glass window showing misty fjords and waterfalls, 8k.'
    },

    # Tier 12 (13..25)
    {
        'cat': 'ROYAL_PALACE',
        'title': '프랑스 루아르 계곡 샹보르 성 르네상스 첨탑 서재 스위트',
        'year': '1519년 프랑수아 1세 르네상스 걸작',
        'val': '1,200억 원 (레오나르도 다빈치 이중 나선계단 가치)',
        'feat': '다빈치가 설계한 마법 같은 이중 나선 계단을 올라가 성채 꼭대기 첨탑 서재에서 5,000만 평의 황실 숲을 내려다봅니다.',
        'verd': '프랑스 르네상스 건축의 정점에 서서 왕들의 화려한 사냥과 연회의 역사를 품격 있게 누리는 황실 스위트입니다.',
        'prompt': 'Majestic architectural photography of Château de Chambord Loire Valley France, ornate Renaissance roofline of chimneys and lanterns, private library suite inside top spire turret, manicured lawns, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '이탈리아 토스카나 16세기 메디치 가문 올리브 농원 대저택과 와이너리',
        'year': '1580년 메디치 공작 별장',
        'val': '480억 원 (유네스코 세계문화유산 빌라)',
        'feat': '수령 수백 년의 올리브 나무와 사이프러스 가로수길이 펼쳐진 언덕 위에서 전용 와인 저장고의 빈티지 키안티 와인을 음미합니다.',
        'verd': '르네상스 귀족들의 우아한 전원생활을 완벽하게 계승한 토스카나의 황금빛 햇살 가득한 빌라입니다.',
        'prompt': 'Enchanting Tuscan landscape photo of a 16th century Medici villa atop rolling green hills, cypress tree lined driveway, ancient olive groves, warm terracotta terrace at sunset with wine glass, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '스페인 그라나다 알람브라 궁전 내려다보이는 헤네랄리페 정원 빌라',
        'year': '1319년 나스르 왕조 여름 별궁',
        'val': '350억 원 (이슬람 정원 건축의 극치)',
        'feat': '시에라네바다 산맥의 만년설 녹은 물이 솟아오르는 분수 회랑을 지나, 알람브라 붉은 성채의 전경을 테라스에서 독점합니다.',
        'verd': '장미 향기와 물소리가 은은하게 퍼지는 스페인 무어 양식의 가장 낭만적인 지상낙원 헤네랄리페입니다.',
        'prompt': 'Exquisite photography of Generalife summer palace patio in Granada Spain, long reflecting pool framed by arching water jets and blooming roses, panoramic view of Alhambra fortress on hillside, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '영국 옥스퍼드셔 블레넘 궁전 바로크 양식 귀족 게스트하우스',
        'year': '1722년 처칠 수상 탄생지 말버러 공작령',
        'val': '850억 원 (영국 유일의 비왕실 팰리스)',
        'feat': '거대한 인공 호수와 반브루(Vanbrugh) 다리가 한눈에 들어오는 대리석 기둥 테라스에서 영국 귀족의 품격 있는 하이 티를 즐깁니다.',
        'verd': '윈스턴 처칠의 숨결이 살아있는 영국 바로크 건축의 위대한 유산 속에서 대영제국의 영광을 체험하는 궁전입니다.',
        'prompt': 'Grand architectural photo of Blenheim Palace Oxfordshire, monumental baroque limestone facade reflected in Great Lake, formal water terrace gardens, afternoon tea set on balustrade, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '독일 바이에른 노이슈반슈타인 성 백조의 기사 테라스 샬레',
        'year': '1886년 루트비히 2세 동화의 성채',
        'val': '1,500억 원 (디즈니 성의 실제 모티브)',
        'feat': '깎아지른 바위산 협곡 꼭대기 하얀 석회암 탑 테라스에서 알프스 호수와 숲을 360도로 조망하며 바그너 오페라를 감상합니다.',
        'verd': '디즈니 신데렐라 성의 원형이 된, 중세 기사도의 로망을 현실에 구현한 인류 역사상 가장 아름다운 동화 성채입니다.',
        'prompt': 'Iconic fairy tale photography of Neuschwanstein Castle perched dramatically on rocky Bavarian Alps ridge, white limestone spires rising above autumn mist, Marienbrücke bridge visible in canyon, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '인도 라자스탄 우다이푸르 타지 레이크 팰리스 백리석 수상 궁전 스위트',
        'year': '1746년 마하라나 자갓 싱 2세 수상 궁전',
        'val': '650억 원 (피촐라 호수 중앙 수상 궁전)',
        'feat': '피촐라 호수 한가운데 떠 있는 순백의 대리석 궁전으로, 전용 왕실 목조 보트를 타고 궁전에 들어서면 장미 꽃잎 세례를 받습니다.',
        'verd': '인도 왕족 마하라자의 전설적인 화려함과 잔잔한 호수 뷰를 누리는 세계에서 가장 로맨틱한 수상 궁전입니다.',
        'prompt': 'Mesmerizing photography of Taj Lake Palace floating like a white marble dream in the center of Lake Pichola Udaipur, ornate jharokha balconies, peacock fountains, royal shikara boat approaching, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '오스트리아 빈 쇤브룬 궁전 합스부르크 황실 정원 직결 로열 아파트먼트',
        'year': '1750년 마리아 테레지아 황후 여름 궁전',
        'val': '720억 원 (합스부르크 황실 유산 가치)',
        'feat': '황금빛 로코코 양식으로 장식된 침실에서 창문을 열면 글로리에테 언덕 분수대와 완벽하게 정돈된 황실 미로 정원이 펼쳐집니다.',
        'verd': '모차르트가 어린 시절 피아노를 연주했던 그 홀 바로 옆에서 합스부르크 황제의 품격을 누리는 비엔나의 황궁입니다.',
        'prompt': 'Regal architectural photo inside a grand rococo suite at Schönbrunn Palace Vienna, gold leaf moldings, crimson damask silk wallpaper, tall French doors opening directly to Neptune Fountain gardens, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '포르투갈 신트라 페나 궁전 알록달록 동화 같은 로맨틱 타워 스위트',
        'year': '1854년 페르난두 2세 낭만주의 궁전',
        'val': '450억 원 (신트라 산 정상 유네스코 랜드마크)',
        'feat': '노란색, 빨간색, 파란색 타일로 마감된 마누엘 양식의 첨탑 위에서 대서양 바다와 유칼립투스 운해를 내려다봅니다.',
        'verd': '괴테와 바이런이 찬사를 아끼지 않았던, 상상력과 낭만주의가 폭발한 포르투갈의 무지개 궁전입니다.',
        'prompt': 'Vibrant colorful architectural photography of Pena Palace Sintra atop forested mountain, vivid yellow and red gothic-renaissance turrets, intricate tile work, Atlantic ocean shimmering in distance, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '체코 프라하 블타바 강 카를교 직면 고딕 르네상스 펜트하우스',
        'year': '15세기 고딕 양식 보존 주택',
        'val': '120억 원 (프라하 성과 카를교 동시 파노라마)',
        'feat': '600년 역사의 카를교 돌다리 위를 오가는 사람들과 프라하 성의 화려한 야경을 발코니에서 샴페인을 들고 직관합니다.',
        'verd': '중세 유럽의 낭만이 그대로 살아 숨 쉬는 황금의 도시 프라하의 역사적인 심장부 펜트하우스입니다.',
        'prompt': 'Romantic evening photography from private terrace overlooking Charles Bridge in Prague, cobblestone bridge lanterns glowing over Vltava river, majestic Prague Castle illuminated on hill, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '이탈리아 아말피 해안 포지타노 레몬 절벽 빌라 전용 보트 리프트',
        'year': '1960년대 지중해 절벽 휴양 빌라',
        'val': '85억 원 (포지타노 수직 절벽 1열 명당)',
        'feat': '파스텔톤 집들이 수직으로 솟아오른 절벽 한가운데 레몬 정원 테라스에서 전용 수직 리프트를 타고 프라이빗 요트 선착장으로 내려갑니다.',
        'verd': '지중해의 햇살과 노란 레몬 향기, 그리고 에메랄드빛 티레니아해가 조화를 이루는 아말피 해안의 보석 같은 빌라입니다.',
        'prompt': 'Stunning travel photograph of Positano cliffside villa Italy, terrace pergola dripping with ripe yellow lemons, pastel colored houses stacked up sheer rock face, sparkling turquoise sea below, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '그리스 산토리니 이아 마을 에게해 칼데라 선셋 인피니티 동굴 빌라',
        'year': '산토리니 전통 키클라데스 양식',
        'val': '58억 원 (세계 3대 일몰 에게해 칼데라 뷰)',
        'feat': '화산암을 파내어 만든 하얀 회반죽 돔 동굴 침실에서 에게해 화산 분화구 칼데라를 향해 뻗어있는 인피니티풀로 걸어 나갑니다.',
        'verd': '세상에서 가장 아름다운 에게해의 붉은 석양을 프라이빗 온수 풀에서 단둘이 감상하는 산토리니의 낭만 궁전입니다.',
        'prompt': 'Iconic whitewashed Cycladic cave villa terrace in Oia Santorini, curving private infinity pool overlooking dramatic volcanic caldera, brilliant orange and pink Aegean sunset, blue church domes, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '프랑스 칸 피에르 가르뎅 \'팔레 불(Palais Bulles)\' 지중해 절벽 버블 대저택',
        'year': '1989년 안티 로박 설계 미래파 버블 저택',
        'val': '4,500억 원 (테라코타 구형 건축의 마스터피스)',
        'feat': '직선이 하나도 없는 분홍빛 구형(Sphere) 모듈 28개가 지중해 붉은 절벽 위에 유기체처럼 얽혀있는 기상천외한 버블 궁전입니다.',
        'verd': '패션 거장 피에르 가르뎅의 예술혼이 깃든, 500석 야외 원형 극장과 인피니티풀을 갖춘 전 세계 건축계의 아이콘입니다.',
        'prompt': 'Avant-garde architectural photography of Palais Bulles (Bubble Palace) on cliffs of Théoule-sur-Mer France, terracotta spherical bubble pods with round portholes, cascading infinity pools, Mediterranean sea, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '스코틀랜드 하이랜드 에일린 도난 성 호수 위 돌다리 성채 스위트',
        'year': '13세기 스코틀랜드 하이랜드 요새',
        'val': '320억 원 (3개 바다 호수가 만나는 전략 요충지)',
        'feat': '신비로운 안개 자욱한 호수(Loch Duich) 위 돌다리를 건너야만 들어갈 수 있는 석조 성채로 밤마다 하이랜드 백파이프 소리가 울립니다.',
        'verd': '영화 <하이랜더>와 007의 배경이 된 스코틀랜드 역사상 가장 사진이 많이 찍힌 그림 같은 호수 성채입니다.',
        'prompt': 'Moody atmospheric photography of Eilean Donan Castle Scotland at blue hour, ancient stone arch bridge spanning Loch Duich, warm interior lights glowing through medieval castle windows, mist, 8k.'
    }
]
print(f"REAL GOOD Part 1 loaded: {len(RAW_REAL_GOOD)} items")

RAW_REAL_GOOD.extend([
    # Tier 13 (26..37)
    {
        'cat': 'WEIRD_ARCH',
        'title': '사우디아라비아 알울라(AlUla) 마라야 사막 500개 거울 외벽 궁전 로열 스위트',
        'year': '2019년 기네스북 등재 세계 최대 거울 건축물',
        'val': '1,800억 원 (사막 모래와 바위를 100% 반사)',
        'feat': '9,740㎡의 거대한 거울로 외벽 전체가 덮여있어 붉은 사암 협곡 속으로 건물이 마법처럼 사라지는 착시를 선사하는 미러 궁전입니다.',
        'verd': '건축물이 곧 대자연의 거울이 되는, 사우디 천년 고대 나바테아 유적지 한복판의 극강 럭셔리 스카이 스위트입니다.',
        'prompt': 'Spectacular architectural photography of Maraya concert hall in AlUla desert Saudi Arabia, massive mirrored facade perfectly reflecting dramatic red sandstone cliffs, sunset desert glow, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '몰디브 콘래드 몰디브 랑갈리 섬 수심 5m 인도양 해저 아크릴 돔 마스터 침실',
        'year': '2018년 세계 최초의 해저 빌라 \'더 무라카\'',
        'val': '220억 원 (1박 6,000만 원 프라이빗 해저 레지던스)',
        'feat': '수심 5m 인도양 바닷속 180도 곡면 투명 아크릴 돔 침실에 누워 머리 위를 유영하는 만타가오리와 상어를 보며 잠듭니다.',
        'verd': '인어공주가 부럽지 않은 해저 5m 프라이빗 아쿠아리움에서 인도양의 산호초 생태계를 독점하는 궁극의 오션 스위트입니다.',
        'prompt': 'Incredible underwater interior photography inside The Muraka suite Maldives, 180-degree curved acrylic ceiling showing glowing turquoise ocean, manta rays and reef sharks swimming overhead, luxury king bed, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 유타 아만기리(Amangiri) 붉은 사암 협곡 품은 프라이빗 메사 풀빌라',
        'year': '2009년 나바호 보호구역 럭셔리 리조트',
        'val': '350억 원 (자연 사암 바위를 품은 수영장)',
        'feat': '수억 년 된 붉은 거대 사암 바위 절벽이 수영장 한가운데를 관통하며, 사막의 적막과 럭셔리 미니멀리즘이 극치를 이룹니다.',
        'verd': '헐리우드 스타와 실리콘밸리 거물들이 세상의 눈을 피해 숨어드는 미국 서부 사막의 가장 비밀스러운 은신처입니다.',
        'prompt': 'Iconic minimalist luxury architecture photography of Amangiri Utah, swimming pool wrapping around a massive prehistoric sandstone rock formation, neutral concrete pavilions, vast desert mesa, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '칠레 아타카마 사막 티에라 아타카마 천문 망원경 테라스 어도비 빌라',
        'year': '2008년 친환경 어도비 사막 건축',
        'val': '140억 원 (지구상에서 별이 가장 잘 보이는 테라스)',
        'feat': '전통 흙벽돌(어도비)로 지어진 빌라 전용 테라스에 연구용 반사망원경이 설치되어 밤마다 안데스 은하수를 관측합니다.',
        'verd': '습도 0%의 청명한 공기 속에서 밤마다 은하계의 성운과 행성들을 침대 옆에서 영접하는 스타게이징 펜트하우스입니다.',
        'prompt': 'Atmospheric night photography at Tierra Atacama Chile, sleek minimalist adobe villa with outdoor fire pit, professional telescope on private deck, breathtaking Milky Way stretching across dark desert sky, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '멕시코 카보 산 루카스 바하 반도 절벽 끝 태평양 파도 치는 인피니티 빌라',
        'year': '2017년 로스 카보스 최고급 해안 빌라',
        'val': '190억 원 (고래 이동 경로 파노라마 관측)',
        'feat': '태평양과 코르테스해가 만나는 화강암 절벽 끝자락 수영장에서 매년 겨울 헤엄쳐 지나가는 혹등고래 떼의 점프를 목격합니다.',
        'verd': '거친 파도 소리와 멕시코 전통 마가리타, 따사로운 햇살이 어우러진 북미 최고 부호들의 프라이빗 휴양지입니다.',
        'prompt': 'Dramatic coastal architectural photography of a luxury villa perched on sheer granite cliffs in Cabo San Lucas Mexico, cantilevered infinity pool hanging over crashing Pacific ocean waves, sunset, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '뉴질랜드 퀸스타운 서던 알프스 헬리콥터 전용 산정상 글래스 알파인 샬레',
        'year': '2019년 헬기 전용 알파인 롯지',
        'val': '160억 원 (도로가 없는 해발 2,000m 고립 명작)',
        'feat': '오직 헬리콥터로만 접근할 수 있는 산정상 만년설 절벽 위에 지어져 와카티푸 호수의 에메랄드 물빛을 발아래 둡니다.',
        'verd': '지구상 그 누구의 방해도 받지 않는 완벽한 고립 속에서 남알프스의 장엄한 빙하를 독점하는 스카이 샬레입니다.',
        'prompt': 'Stunning aerial photography of a remote glass alpine chalet perched on snowy mountain ridge in Queenstown New Zealand, private helicopter on helipad, Lake Wakatipu shining below, crisp alpine air, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '노르웨이 스발바르 제도 북극권 78도 오로라 천문 관측 럭셔리 돔',
        'year': '2021년 극지 천문 에코 돔',
        'val': '95억 원 (인류 최북단 영구 거주지 럭셔리)',
        'feat': '북극곰 경호원이 외곽을 순찰하는 북위 78도 빙하 설원 위에서 지열 난방 돔 내부 따뜻한 침대에 누워 오로라 폭풍을 맞이합니다.',
        'verd': '문명의 북쪽 끝자락에서 북극의 침묵과 순수한 백색 설원을 럭셔리하게 경험하는 지상 최북단 돔 하우스입니다.',
        'prompt': 'Spectacular sub-zero photography of a geodesic glass dome luxury pod in Svalbard Norway, warm interior lighting contrasting with icy blue Arctic snowdrift, dancing green and purple Northern Lights, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '페루 마추픽추 바로 아래 우루밤바 성스러운 계곡 잉카 유적 에코 로지',
        'year': '2014년 잉카 석조 건축 복원 롯지',
        'val': '175억 원 (잉카 황제의 안식처 계곡)',
        'feat': '정교한 잉카의 돌 맞춤 기법을 계승한 테라스에서 마추픽추를 감싸고도는 안데스 구름안개와 성스러운 빌카노타 강을 조망합니다.',
        'verd': '고대 태양의 제국 잉카의 신비로운 에너지를 온몸으로 호흡하는 남미 최고의 럭셔리 헤리티지 로지입니다.',
        'prompt': 'Majestic photography of an eco-luxury stone lodge in Sacred Valley Urubamba Peru, ancient Incan agricultural terraces on mountain slope, misty Andes cloud forest, roaring Vilcanota river below, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 그랜드 캐니언 노스림 절벽 끝 프라이빗 캔틸레버 관측 펜트하우스',
        'year': '2016년 절벽 돌출형 하이테크 건축',
        'val': '280억 원 (1,500m 수직 협곡 공중 돌출)',
        'feat': '협곡 절벽 밖으로 15m 돌출된 캔틸레버 구조의 강화유리 바닥 아래로 1,500m 깊이의 콜로라도강 협곡이 아찔하게 펼쳐집니다.',
        'verd': '지구의 속살이라 불리는 20억 년 지층을 허공에 떠서 조망하는 심장 쫄깃한 공중 부유 펜트하우스입니다.',
        'prompt': 'Vertigo-inducing architecture photography of a modern steel and glass cantilever residence jutting out over North Rim of Grand Canyon, glass floor revealing 1500m abyss, sunset crimson strata layers, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '짐바브웨 빅토리아 폭포 악마의 수영장 상류 잠베지 강 플로팅 럭셔리 롯지',
        'year': '2018년 잠베지 강 수상 에코 롯지',
        'val': '130억 원 (천둥 치는 연기 빅토리아 폭포 상류)',
        'feat': '초당 100만 리터의 물이 쏟아져 내리는 폭포 낙하지점 바로 500m 상류의 프라이빗 섬에서 물안개 무지개를 보며 휴식합니다.',
        'verd': '원주민들이 \'천둥 치는 연기\'라 불렀던 세계 최대 폭포의 웅장한 포효를 침대 머리맡에서 듣는 워터프론트 롯지입니다.',
        'prompt': 'Epic travel photography of a luxury timber deck lodge floating on Zambezi River upstream of Victoria Falls Zimbabwe, massive roaring white spray cloud rising in distance with permanent vibrant rainbow, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '아르헨티나 이구아수 폭포 밀림 속 포효하는 물안개 파노라마 발코니 스위트',
        'year': '1978년 국립공원 내 유일한 럭셔리 호텔',
        'val': '210억 원 (악마의 목구멍 도보 10분 독점)',
        'feat': '275개의 폭포가 말발굽 모양으로 쏟아지는 \'악마의 목구멍\' 물보라가 발코니 창가에 시원하게 흩뿌려집니다.',
        'verd': '공원 개장 전 아침 안개 속에서 고요하게 폭포를 단독 감상할 수 있는 세계 7대 자연경관의 심장부 스위트입니다.',
        'prompt': 'Breathtaking photography from private suite balcony at Gran Meliá Iguazú Argentina, panoramic view of Iguazu Falls roaring into Devil\'s Throat, tropical jungle mist, toucan perched on railing, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '탄자니아 세렝게티 그레이트 마이그레이션 누 떼를 내려다보는 모바일 럭셔리 사파리 빌라',
        'year': '2020년 계절 이동형 친환경 럭셔리 캠프',
        'val': '165억 원 (200만 마리 야생동물 대이동 추적권)',
        'feat': '200만 마리의 누와 얼룩말 무리가 마라 강을 건너는 장관을 따라 캠프 전체가 위치를 이동하는 맞춤형 사파리 빌라입니다.',
        'verd': '지구상 최대의 생명 대이동의 한가운데서 사자의 사냥과 일몰을 최고급 샴페인과 함께 감상하는 모바일 하우스입니다.',
        'prompt': 'Cinematic safari photography in Serengeti Tanzania, ultra-luxury tented villa on raised deck, hundreds of thousands of wildebeest migrating across vast golden savannah plains below at sunset, 8k.'
    },

    # Tier 14 (38..50)
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '미국 뉴욕 맨해튼 센트럴파크 사우스 220 억만장자의 거리 최상층 펜트하우스',
        'year': '2019년 로버트 A.M. 스턴 설계 억만장자 타워',
        'val': '2,800억 원 (미국 역사상 최고가 주택 거래 기록)',
        'feat': '센트럴파크 전체가 직사각형 초록빛 카펫처럼 완벽한 대칭으로 내려다보이는 해발 290m의 3층 복층 펜트하우스입니다.',
        'verd': '헤지펀드 억만장자 켄 그리핀이 매입한, 전 세계 자본주의의 정점을 상징하는 궁극의 맨해튼 스카이라인 옥좌입니다.',
        'prompt': 'Super-prime luxury real estate interior photo inside top floor triplex penthouse at 220 Central Park South NYC, double height floor-to-ceiling glass framing unobstructed autumn view of Central Park, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '영국 런던 원 하이드 파크 나이츠브리지 켄싱턴 가든 통유리 펜트하우스',
        'year': '2011년 리차드 로저스 경 설계 하이테크 하우스',
        'val': '2,200억 원 (SAS 영국 특수부대 보안 시스템)',
        'feat': '방탄 유리와 공기 정화 피난 벙커, 만다린 오리엔탈 호텔의 24시간 룸서비스를 제공받으며 하이드 파크의 녹음을 감상합니다.',
        'verd': '글로벌 왕족과 슈퍼리치들이 선택한, 철통 보안과 런던 나이츠브리지 중심의 우아함을 겸비한 트로피 에스테이트입니다.',
        'prompt': 'Exquisite prime London interior photography inside One Hyde Park Knightsbridge penthouse, sweeping glass curtain wall overlooking lush Hyde Park and Serpentine lake, sleek contemporary marble finishes, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '일본 도쿄 아자부다이 힐스 330m 모리 JP 타워 아만 레지던스 최상층',
        'year': '2023년 일본 최고 높이 마천루 완공',
        'val': '1,800억 원 (도쿄타워와 후지산을 동시 내려다봄)',
        'feat': '도쿄타워의 붉은 조명이 발아래 장난감처럼 내려다보이고 맑은 날에는 만년설의 후지산이 손에 잡힐 듯 펼쳐집니다.',
        'verd': '아만(Aman) 호텔의 정갈한 환대와 일본 현대 건축의 최고 기술력이 결합된 도쿄의 새로운 랜드마크 펜트하우스입니다.',
        'prompt': 'Ultra-luxury interior photo inside Aman Residences penthouse atop Mori JP Tower Azabudai Hills Tokyo at 330m, floor-to-ceiling glass looking down on glowing Tokyo Tower and distant Mount Fuji sunset, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '모나코 몬테카를로 투르 오데옹 360도 지중해 슬라이드 인피니티풀 펜트하우스',
        'year': '2015년 세계에서 가장 비싼 펜트하우스 타워',
        'val': '4,200억 원 (옥상 인피니티풀 워터 슬라이드)',
        'feat': '5층 규모 펜트하우스의 옥상 발코니에서 원형 워터 슬라이드를 타고 내려와 지중해 바다와 직결되는 인피니티풀로 풍덩 뛰어듭니다.',
        'verd': '슈퍼요트가 가득한 모나코 항구와 F1 그랑프리 서킷이 360도로 펼쳐지는 백만장자들의 꿈의 놀이터입니다.',
        'prompt': 'Dazzling aerial luxury photo of the Sky Penthouse at Tour Odéon Monaco, curved private outdoor water slide descending from balcony into rooftop infinity pool overlooking yacht harbor, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '홍콩 빅토리아 피크 억만장자 단독 저택 하버뷰 스카이 가든',
        'year': '2018년 홍콩 최고 부촌 피크 로드',
        'val': '2,500억 원 (빅토리아 하버 야경 영구 조망권)',
        'feat': '홍콩의 마천루 숲이 발아래 미니어처처럼 반짝이는 안개 낀 피크 정상 정원에서 프라이빗 헬리패드를 갖춘 대저택입니다.',
        'verd': '풍수지리학적으로 용의 기운이 맺히는 명당 중의 명당으로 불리는 아시아 최고 갑부들의 상징적인 프라이빗 캐슬입니다.',
        'prompt': 'Breathtaking night photography from the manicured infinity lawn of a private estate on Victoria Peak Hong Kong, dazzling neon skyline of Central and Victoria Harbour glowing like jewels below, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '싱가포르 마리나 베이 샌즈 인피니티풀 직결 3베드룸 프레지덴셜 스위트',
        'year': '2010년 모셰 사프디 설계 마리나 베이 아이콘',
        'val': '1,100억 원 (세계 최대 공중 옥상 수영장 VIP 직결)',
        'feat': '지상 200m 세 개의 타워를 연결하는 스카이파크 최상층에서 전용 엘리베이터를 타고 세계 최대 인피니티풀로 바로 입장합니다.',
        'verd': '가든스 바이 더 베이의 슈퍼트리와 싱가포르 해협의 수천 척 선박들이 만드는 야경을 독점하는 미래형 스카이 스위트입니다.',
        'prompt': 'Glamorous architectural photography of the Presidential Suite terrace at Marina Bay Sands Singapore, private plunge pool looking out over iconic infinity pool edge and Singapore financial district lights, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '아랍에미리트 두바이 부르즈 할리파 148층 앳 더 탑 스카이 프라이빗 레지던스',
        'year': '2010년 인류 최고 높이 마천루(828m)',
        'val': '3,100억 원 (구름을 뚫고 솟아오른 세계 최고 높이)',
        'feat': '비행기 순항 고도에 필적하는 지상 555m 창밖으로 페르시아만의 구름바다가 발아래 깔리며 두바이의 인공섬들이 내려다보입니다.',
        'verd': '구름 위에서 아침을 맞이하는, 인간이 지상에 지은 건축물 중 가장 높은 곳에 위치한 천공의 펜트하우스입니다.',
        'prompt': 'Dizzying ultra-high altitude luxury interior photo from Burj Khalifa 148th floor residence Dubai, looking down through floor-to-ceiling glass at clouds floating around lower skyscrapers, golden desert sun, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '미국 로스앤젤레스 벨에어 \'더 원(The One)\' 360도 태평양 파노라마 메가맨션',
        'year': '2021년 미국 최대 크기 메가맨션 (3,000평)',
        'val': '3,500억 원 (수영장 5개와 전용 나이트클럽 완비)',
        'feat': '3면이 해자처럼 인피니티풀로 둘러싸인 언덕 꼭대기 3,000평 대저택으로 볼링장, 극장, 미용실, 50대 주차장이 완비되어 있습니다.',
        'verd': '벨에어의 정상에서 LA 도심 스카이라인과 태평양 바다를 동시에 품에 안는 미국 메가맨션 건축의 정점입니다.',
        'prompt': 'Panoramic architectural photo of mega-mansion The One in Bel Air Los Angeles at twilight, massive wrap-around cantilevered infinity pool reflecting modern white architecture, sparkling city lights, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '프랑스 파리 몽테뉴가 에펠탑 뷰 19세기 오스만 양식 대리석 펜트하우스',
        'year': '1860년 오스만 남작 파리 도시계획 양식',
        'val': '890억 원 (디올 본점 옆 명품거리 최상층)',
        'feat': '베르사유 궁전을 연상시키는 금박 몰딩과 헤링본 원목 마루의 프렌치 발코니에서 에펠탑 매시 정각 반짝이는 일루미네이션을 감상합니다.',
        'verd': '파리지앵의 로망과 프랑스 오트쿠튀르 패션의 심장부에서 센강의 낭만을 온몸으로 누리는 역사적인 아파트먼트입니다.',
        'prompt': 'Sophisticated Parisian interior photography on Avenue Montaigne penthouse balcony, wrought iron railing overlooking brilliantly illuminated Eiffel Tower sparking at night, Haussmann limestone facade, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '호주 시드니 오페라 하우스와 하버 브리지 직면 원 바랑가루 크라운 펜트하우스',
        'year': '2020년 윌킨슨 에어 설계 시드니 최고 마천루',
        'val': '1,250억 원 (시드니 하버 하키스틱 듀얼 뷰)',
        'feat': '세계 3대 미항 시드니 하버의 상징인 조개껍질 모양 오페라 하우스와 웅장한 하버 브리지를 침대에 누워 한눈에 담습니다.',
        'verd': '남반구 최고의 경제 도시 시드니에서 바다와 마천루가 빚어내는 황홀한 블루 하버를 360도로 독점하는 펜트하우스입니다.',
        'prompt': 'Stunning luxury living room photography inside Crown Sydney penthouse in Barangaroo, curved floor-to-ceiling glass framing panoramic view of Sydney Opera House and Sydney Harbour Bridge on sparkling blue water, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '미국 마이애미 비치 사우스비치 포르쉐 디자인 타워 슈퍼카 전용 스카이 거라지',
        'year': '2017년 포르쉐 디자인 그룹 데저베이터 특허',
        'val': '680억 원 (슈퍼카 탑승 채로 50층 거실 주차)',
        'feat': '원형 자동차 엘리베이터(Dezervator)를 타고 페라리나 포르쉐를 운전한 채로 50층 거실 유리 차고에 직접 주차합니다.',
        'verd': '마이애미의 에메랄드빛 대서양 해변을 배경으로 내가 아끼는 슈퍼카를 거실 인테리어 작품으로 감상하는 하이테크 하우스입니다.',
        'prompt': 'Ultra-modern interior photo at Porsche Design Tower Miami, living room separated by glass wall from private sky garage showcasing a sleek red supercar, Atlantic ocean turquoise waves outside terrace, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '대한민국 서울 롯데월드타워 시그니엘 레지던스 100층 한강 360도 뷰 펜트하우스',
        'year': '2017년 555m 대한민국 최고 마천루',
        'val': '370억 원 (서울 전역과 남한산성 운해 조망)',
        'feat': '해발 400m 상공에서 한강이 S자로 굽이쳐 흐르는 파노라마와 남산 서울타워를 발아래 두고 서울의 일출과 일몰을 즐깁니다.',
        'verd': '대한민국 한강의 기적을 한눈에 내려다보는, 국내 최고 높이의 상징성과 6성급 호텔 서비스가 결합된 프레스티지 펜트하우스입니다.',
        'prompt': 'Panoramic interior photo of luxury penthouse at Signiel Residences Lotte World Tower Seoul, expansive curved glass looking out over winding Han River bridges glittering with traffic at blue hour, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 샌프란시스코 러시안 힐 금문교와 알카트라즈가 한눈에 들어오는 글래스 하우스',
        'year': '2015년 언덕 급경사 현대 건축',
        'val': '520억 원 (샌프란시스코 만 3대 랜드마크 조망)',
        'feat': '룸바드 꽃길 바로 인근 급경사 언덕 위에 유리로 지어져 금문교의 붉은 주탑과 바다 안개, 알카트라즈 섬을 독점합니다.',
        'verd': '케이블카가 언덕을 오르내리는 종소리를 들으며 실리콘밸리의 벤처 신화를 창조하는 샌프란시스코 최고의 글래스 맨션입니다.',
        'prompt': 'Contemporary glass modern residence on Russian Hill San Francisco, wrap-around cedar deck overlooking Golden Gate Bridge emerging from dramatic coastal fog, bay waters and Alcatraz below, 8k.'
    }
])
print(f"REAL GOOD Part 2 loaded: {len(RAW_REAL_GOOD)} items")

RAW_REAL_GOOD.extend([
    # Tier 15 (51..62)
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '바하마 엑수마 제도 억만장자 프라이빗 아일랜드 에메랄드 산호초 단독 리조트',
        'year': '2016년 프라이빗 케이(Cay) 개발',
        'val': '1,100억 원 (섬 전체 단독 소유 및 전용 활주로)',
        'feat': '비행기에서 내리면 투명한 에메랄드빛 바다와 순백의 산호 모래사장이 섬 전체를 감싸고 있는 100% 비공개 단독 섬입니다.',
        'verd': '캐리비안의 푸른 바다를 나 홀로 소유한 채 요트와 수상 비행기로만 왕래하는 세계 최고 부호들의 프라이빗 아일랜드입니다.',
        'prompt': 'Aerial tropical photography of a private luxury island estate in Exuma Bahamas, pure white sand beaches encircled by glowing turquoise coral reefs, private airstrip, main villa pavilion, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '피지 라우칼라 섬 레드불 창업주 프라이빗 아일랜드 심해 잠수함 포함 빌라',
        'year': '2011년 디트리히 마테시츠 프라이빗 아일랜드',
        'val': '1,600억 원 (딥플라이트 2인승 잠수함 포함)',
        'feat': '남태평양 원시 열대 우림과 절벽 수영장을 갖추고 전용 2인승 심해 잠수함을 타고 산호초 절벽을 탐험할 수 있습니다.',
        'verd': '지상, 해상, 그리고 해저까지 완벽하게 지배하는 글로벌 억만장자의 모험과 휴식이 결합된 피지의 낙원입니다.',
        'prompt': 'Luxury island resort photography at Laucala Island Fiji, freeform lagoon pool winding through coconut palms, private yellow DeepFlight submersible boat floating near wooden dock, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '영국령 버진아일랜드 리처드 브랜슨 경의 네커 아일랜드 발리풍 그레이트 하우스',
        'year': '1979년 버진 그룹 창업주 전용 섬',
        'val': '1,400억 원 (홍학 200마리와 보무새 보호구역)',
        'feat': '카리브해 360도 오션뷰가 펼쳐지는 발리식 목조 대저택에서 분홍빛 플라밍고 떼와 대형 거북이들이 노니는 정원을 거닙니다.',
        'verd': '오바마 대통령을 비롯한 세계적 명사들이 서핑과 휴식을 즐기던 카리브해의 가장 아이코닉한 억만장자 놀이터입니다.',
        'prompt': 'Stunning panoramic view of the Great House on Necker Island British Virgin Islands, open-air Balinese teak pavilion overlooking infinity pool, flock of pink flamingos wading in shallow turquoise bay, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '모나코 포트 에르큘 140m 하이브리드 슈퍼요트 헬리패드 딸린 마스터 선실',
        'year': '2022년 루르센(Lürssen) 맞춤 건조 슈퍼요트',
        'val': '5,800억 원 (연간 유지비만 500억 원)',
        'feat': '길이 140m 6개 데크에 헬리패드 2개, 해저 관측 라운지, 실내 수영장, 미슐랭 레스토랑 주방이 완비된 바다 위의 7성급 호텔입니다.',
        'verd': '전 세계 어느 공해상에서도 완벽한 독립 왕국을 유지할 수 있는 인류 해양 기술의 결정체 메가요트 마스터 스위트입니다.',
        'prompt': 'Ultra-luxury marine photography of a 140-meter custom superyacht moored off Monaco Port Hercule, sleek silver hull, certified helipad with helicopter, glowing underwater hull lights, sunset, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '이탈리아 코모 호수 빌라 발비아넬로 전용 클래식 목조 보트 선착장 궁전',
        'year': '1787년 안젤로 두리니 추기경 여름 저택',
        'val': '1,350억 원 (영화 007 카지노 로얄 촬영지)',
        'feat': '알프스 빙하 호수의 절벽 끝 테라스에서 완벽하게 다듬어진 플라타너스 가로수와 전용 리바(Riva) 목조 모터보트를 맞이합니다.',
        'verd': '영화 <스타워즈 에피소드 2>와 <007>의 배경이 된, 이탈리아 호수 귀족 문화의 가장 로맨틱한 정점입니다.',
        'prompt': 'Iconic lakeside photography of Villa del Balbianello on Lake Como Italy, terraced gardens with manicured umbrella-shaped holm oak trees, classic varnished Riva mahogany speedboat docked at stone steps, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '프랑스 리비에라 앙티브 곶 에덴 록 호텔 직결 올리가르히 절벽 대저택',
        'year': '2015년 코트다쥐르 프라이빗 에스테이트',
        'val': '2,100억 원 (지중해 바위 절벽 해수 다이빙 보드)',
        'feat': '지중해 현무암 절벽을 깎아 만든 바닷물 풀장과 프라이빗 다이빙대에서 앙티브의 푸른 파도로 뛰어드는 전용 별채입니다.',
        'verd': '피카소와 헤밍웨이가 사랑했던 프랑스 남부 코트다쥐르에서 세기의 부호들이 머무는 전설적인 바위 절벽 맨션입니다.',
        'prompt': 'Glamorous French Riviera photography at Cap d\'Antibes, historic white stone mansion overlooking a dramatic seawater pool carved directly into volcanic sea rocks, diving board extending over blue sea, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '스위스 제네바 호수 몽트뢰 시옹 성 맞은편 알프스 뷰 프라이빗 샬레 에스테이트',
        'year': '2013년 제네바 호숫가 프라이빗 샬레',
        'val': '1,050억 원 (호숫가 포도밭과 만년설 알프스 뷰)',
        'feat': '유네스코 라보(Lavaux) 계단식 포도밭과 백조들이 유영하는 레만호 수면 위로 톱니바퀴 같은 당 뒤 미디 설산이 병풍처럼 둘러섭니다.',
        'verd': '스위스 프라이빗 뱅킹의 심장부에서 평화와 완벽한 비밀 보장을 누리는 제네바 호숫가의 황제급 에스테이트입니다.',
        'prompt': 'Scenic Swiss lakeside photography in Montreux Lake Geneva, luxury glass chalet with stone terrace overlooking historic Chillon Castle on tranquil water, snowy Dents du Midi peaks in background, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 콜로라도 아스펜 스노우매스 프라이빗 스키 인/스키 아웃 힐탑 샬레',
        'year': '2017년 로키산맥 스키 리조트 맨션',
        'val': '920억 원 (스키 슬로프 직결 게이트)',
        'feat': '스키 부츠를 신은 채로 거실 문을 열면 북미 최고의 파우더 스노 슬로프로 바로 미끄러져 내려가는 1,500평 통나무 대저택입니다.',
        'verd': '월가 CEO들과 할리우드 명사들이 겨울마다 모여드는 아스펜 설원의 최정상 힐탑 스키 샬레입니다.',
        'prompt': 'Winter architectural photography of a mega-chalet in Aspen Colorado, massive natural timber and stone facade, heated outdoor swimming pool steaming in heavy snowfall, ski trail leading right to entrance, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '하와이 카우아이 섬 나팔리 코스트 헬기 전용 에메랄드 절벽 프라이빗 랜치',
        'year': '2019년 태평양 나팔리 해안 에스테이트',
        'val': '1,450억 원 (영화 쥬라기 공원 오프닝 뷰)',
        'feat': '수직으로 1,000m 솟아오른 에메랄드빛 주름진 절벽과 태평양 파도가 만들어내는 태고의 풍경을 단독으로 품은 대목장입니다.',
        'verd': '지구상에서 가장 웅장한 해안 절벽으로 꼽히는 하와이 정원의 섬 카우아이의 자연보호구역 헬기 랜치입니다.',
        'prompt': 'Dramatic aerial photography of a secluded luxury ranch perched above Na Pali Coast Kauai Hawaii, jagged fluted emerald green mountain ridges plunging into cobalt ocean, private helicopter landing, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '프랑스 생트로페 브리지트 바르도 해변 직결 지중해 소나무 숲 풀빌라',
        'year': '2016년 생트로페 팜펠론 비치 빌라',
        'val': '880억 원 (지중해 우산소나무 숲 산책로)',
        'feat': '우산 모양의 지중해 소나무(Stone Pine) 향기 가득한 정원을 지나면 바로 하얀 백사장과 슈퍼요트 정박지로 이어지는 해변 빌라입니다.',
        'verd': '전 세계 셀럽들의 여름 파티 수도인 생트로페에서 프라이버시와 화려함을 동시에 잡은 지중해 최고의 빌라입니다.',
        'prompt': 'Sun-drenched architectural photography in Saint-Tropez France, modern white stone villa nestled among umbrella pine trees, teak deck infinity pool leading toward golden sand beach of Pampelonne, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '스페인 이비자 섬 칼라 콘타 일몰 직면 화이트 미니멀리즘 슈퍼 클럽 빌라',
        'year': '2018년 발레아레스 제도 하이테크 빌라',
        'val': '750억 원 (음향 차음 방음 클럽 시스템)',
        'feat': '이비자 최고의 일몰 포인트 칼라 콘타 절벽 위에서 세계 최고 DJ의 프라이빗 세트를 감상할 수 있는 방음 클럽 룸을 갖췄습니다.',
        'verd': '지중해의 파티 에너지와 순백의 미니멀리즘 건축이 결합된 이비자 섬의 가장 트렌디한 파티 펜트하우스입니다.',
        'prompt': 'Ultra-stylish minimalist white villa on cliff of Cala Conta Ibiza, sunken lounge seating with fire pit beside infinity pool facing brilliant sunset over Balearic sea, ambient LED lighting, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '이탈리아 카프리 섬 파라글리오니 바위 직면 파란 동굴 위 절벽 빌라',
        'year': '1955년 카프리 귀족 여름 빌라',
        'val': '1,150억 원 (파라글리오니 시 스택 영구 뷰)',
        'feat': '바다에서 솟아오른 3개의 거대한 석회암 바위섬(파라글리오니)이 바로 눈앞에 걸려있는 로마 황제 티베리우스 스타일의 빌라입니다.',
        'verd': '카프리 섬의 전설적인 푸른 바다와 부겐빌레아 꽃이 만발한 테라스에서 영원한 지중해의 여름을 누리는 궁전입니다.',
        'prompt': 'Breathtaking coastal photography on Capri island Italy, terrace framed by vibrant magenta bougainvillea flowers overlooking the famous Faraglioni sea stack rock formations in azure sea, 8k.'
    },

    # Tier 16 (63..75)
    {
        'cat': 'WEIRD_ARCH',
        'title': '스페인 발렌시아 예술과 과학의 도시 칼라트라바 설계 미래 지향 하이테크 하우스',
        'year': '2005년 산티아고 칼라트라바 미래 건축',
        'val': '850억 원 (거대 고래 뼈대 형상화 모바일 루프)',
        'feat': '백색 콘크리트와 거대한 뼈대 구조가 유압식으로 열리고 닫히는 미래형 건축물로 수면 위에 떠 있는 우주선 형태의 레지던스입니다.',
        'verd': '건축과 조각, 첨단 공학이 하나로 융합된 스페인 현대 건축의 찬란한 미래주의 예술품입니다.',
        'prompt': 'Futuristic architectural photography of a residence inspired by Santiago Calatrava in City of Arts and Sciences Valencia, dramatic white ribbed organic skeletal arches over shallow turquoise pools, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 펜실베이니아 프랭크 로이드 라이트 \'낙수재(Fallingwater)\' 폭포 위 유기적 저택',
        'year': '1935년 현대 건축 100대 걸작 1위',
        'val': '2,500억 원 (유네스코 세계문화유산 유기적 건축)',
        'feat': '자연 폭포 위에 콘크리트 테라스를 캔틸레버로 띄워 집 안에서 바위와 쏟아지는 폭포수 소리를 교향곡처럼 듣는 유기적 건축입니다.',
        'verd': '인간의 건축이 자연의 일부가 되는 위대한 철학을 실현한 미국 건축 역사의 영원한 마스터피스입니다.',
        'prompt': 'Iconic autumn architectural photography of Frank Lloyd Wright\'s Fallingwater in Pennsylvania, tiered cantilevered concrete balconies floating above cascading natural waterfall and colorful forest, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '스페인 바르셀로나 가우디의 카사 바트요 곡선 타일 용의 등뼈 다락방 스위트',
        'year': '1906년 안토니 가우디 모더니즘 걸작',
        'val': '3,800억 원 (카탈루냐 수호성인 성 조지의 전설)',
        'feat': '형형색색의 세라믹 트렌카디스 타일과 용의 비늘처럼 굽이치는 아치형 다락방 창문에서 그라시아 거리의 활기를 내려다봅니다.',
        'verd': '직선을 배제하고 자연의 곡선과 빛을 담아낸 천재 건축가 안토니 가우디의 환상적인 예술 궁전입니다.',
        'prompt': 'Enchanting architectural photo inside the attic of Casa Batlló Barcelona by Antoni Gaudí, catenary white plaster arches resembling ribcage of a dragon, mosaic stained glass windows casting rainbow light, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '아랍에미리트 아부다비 루브르 박물관 바다 위 은빛 돔 햇살 비치는 수상 파빌리온',
        'year': '2017년 장 누벨 설계 바다 위 박물관',
        'val': '6,500억 원 (7,850개 기하학 별 모양 돔 천장)',
        'feat': '8개 층으로 겹쳐진 거대한 은빛 돔을 통과한 햇빛이 마치 야자수 잎 사이로 쏟아지는 \'빛의 비(Rain of Light)\'가 되는 수상 룸입니다.',
        'verd': '바다 위에 떠 있는 미래형 아랍 메디나에서 인류 문명의 위대한 예술품들과 함께 숨 쉬는 건축적 기적입니다.',
        'prompt': 'Breathtaking interior architecture photo at Louvre Abu Dhabi by Jean Nouvel, massive geometric silver dome casting \'rain of light\' sunbeams across quiet sea channels and stark white modern pavilions, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '싱가포르 창이 쥬얼 40m 실내 레인 보텍스 폭포 최상층 보타니컬 스위트',
        'year': '2019년 모셰 사프디 설계 실내 열대우림',
        'val': '1,900억 원 (세계 최대 실내 인공 폭포 뷰)',
        'feat': '유리 돔 지붕 중앙에서 40m 아래로 쏟아져 내리는 세계 최대 실내 폭포와 2,000그루의 열대 식물 숲을 파노라마로 독점합니다.',
        'verd': '실내에서 열대우림의 피톤치드와 웅장한 워터 보텍스를 24시간 감상하는 싱가포르 바이오필릭 건축의 정점입니다.',
        'prompt': 'Stunning architectural photography inside Jewel Changi Airport Singapore, looking out from a luxury botanical suite toward the roaring 40-meter indoor Rain Vortex waterfall surrounded by lush terraced jungle, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '덴마크 코펜하겐 비야케 잉겔스(BIG) 설계 코펜힐 스키 슬로프 옥상 펜트하우스',
        'year': '2017년 친환경 열병합 발전소 위 스키 슬로프',
        'val': '780억 원 (폐기물 발전소 옥상 친환경 스키장)',
        'feat': '도시의 쓰레기를 태워 청정 에너지를 만드는 친환경 발전소 옥상 인공 잔디 스키 슬로프 정상에 자리 잡은 펜트하우스입니다.',
        'verd': '사회적 인프라와 레저, 지속 가능성을 유쾌하게 융합한 비야케 잉겔스의 쾌락적 지속가능성(Hedonistic Sustainability) 하우스입니다.',
        'prompt': 'Innovative architecture photography of CopenHill in Copenhagen by BIG, green artificial ski slope running down the roof of shimmering aluminum facade waste-to-energy plant, rooftop glass cafe at summit, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '중국 베이징 다싱 국제공항 자하 하디드 설계 불가사리 유기 곡선 공항 스위트',
        'year': '2019년 자하 하디드 유작 메가에어포트',
        'val': '1,400억 원 (세계 최대 단일 터미널 건물)',
        'feat': '기둥 없이 곡선으로 뻗어나가는 거대한 C자형 채광 기둥과 황금빛 유기적 천장이 흐르는 공항 최상층 프라이빗 스위트입니다.',
        'verd': '곡선의 여왕 자하 하디드가 남긴 우주적 스케일의 미래형 건축 속에서 세계로 날아오르는 비행 스카이라운지입니다.',
        'prompt': 'Grand architectural interior photo inside Beijing Daxing International Airport by Zaha Hadid, flowing organic white structural columns branching into glowing ceiling skylights, warm parametric lines, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '아제르바이잔 바쿠 헤이다르 알리예프 센터 유려한 백색 파도 곡선 파빌리온',
        'year': '2012년 자하 하디드 디자인 디자인 뮤지엄',
        'val': '2,200억 원 (직선이 0개인 순백의 파도 곡선)',
        'feat': '지면에서 솟아올라 파도처럼 물결치는 백색 외피가 그대로 내부 벽과 천장으로 이어지는 완전한 연속성의 주거 파빌리온입니다.',
        'verd': '중력을 거스르는 듯한 우아한 곡선미로 건축계의 노벨상인 런던 디자인 뮤지엄 올해의 디자인상을 수상한 걸작입니다.',
        'prompt': 'Futuristic architectural photography of Heydar Aliyev Centre in Baku Azerbaijan by Zaha Hadid, fluid sweeping white curved facade rising seamlessly from plaza into sky, twilight blue hour, illuminated glass, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '이탈리아 밀라노 보스코 베르티칼레(수직 숲) 1,000그루 나무 테라스 펜트하우스',
        'year': '2014년 스테파노 보에리 수직 정원 아파트',
        'val': '320억 원 (연간 20톤 탄소 흡수 식물 생태계)',
        'feat': '2개 타워 외벽에 800그루의 나무와 15,000그루의 다년생 식물이 숲을 이루어 도심 속 피톤치드와 새소리를 제공합니다.',
        'verd': '도시 생물다양성을 복원하고 공기를 정화하는 밀라노 패션 수도의 가장 푸른 친환경 수직 정원 펜트하우스입니다.',
        'prompt': 'Lush architectural photography of Bosco Verticale (Vertical Forest) towers in Milan, cantilevered balconies overflowing with mature green trees and cascading shrubs against modern glass facade, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '노르웨이 린데스네스 유럽 최초의 해저 레스토랑 \'언더(Under)\' 5m 심해 뷰 빌라',
        'year': '2019년 스노헤타(Snøhetta) 설계 콘크리트 해저 모놀리스',
        'val': '180억 원 (수심 5m 북해 해저 거대 아크릴 창)',
        'feat': '거친 북해 파도 속으로 반쯤 가라앉은 콘크리트 모놀리스 내부에서 길이 11m 파노라마 아크릴 창을 통해 북해 심해 생태계를 봅니다.',
        'verd': '건축물이 시간이 지나며 인공 산호초로 변해가는, 노르웨이 남단 빙하 바다의 장엄한 해저 안식처입니다.',
        'prompt': 'Atmospheric architectural photography of Under restaurant in Lindesnes Norway by Snøhetta, half-sunken monolithic concrete tube resting on sea floor, giant panoramic underwater glass window into dark green sea, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 텍사스 마르파 치나티 재단 도널드 저드 미니멀리즘 콘크리트 아트 하우스',
        'year': '1986년 현대 미니멀리즘 예술 성지',
        'val': '240억 원 (100개 알루미늄 및 콘크리트 조각 군)',
        'feat': '사막 군사 기지 막사를 개조해 거대한 통유리창과 도널드 저드의 기하학적 박스 조각이 햇빛에 반사되는 예술적 주거 공간입니다.',
        'verd': '현대 미술 수집가들과 건축가들이 인생을 걸고 순례하는 텍사스 사막 한가운데 미니멀리즘의 메카입니다.',
        'prompt': 'Serene minimalist art photography at Chinati Foundation in Marfa Texas, converted military artillery shed with polished concrete floor, Donald Judd mill aluminum boxes reflecting bright desert sunlight, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '일본 나오시마 베네세 하우스 오벌(Oval) 안도 다다오 타원형 수조 하늘 펜트하우스',
        'year': '1995년 안도 다다오 설계 예술 섬 리조트',
        'val': '420억 원 (전용 모노레일로만 접근 가능한 6개 객실)',
        'feat': '산 정상 타원형 수조 한가운데 하늘이 비치는 중정을 품은 노출 콘크리트 명작으로 모네의 <수련> 원작이 도보 거리에 있습니다.',
        'verd': '세토 내해의 푸른 바다와 안도 다다오의 빛과 콘크리트 철학이 영혼을 정화하는 세계 최고의 현대 예술 섬 펜트하우스입니다.',
        'prompt': 'Minimalist architectural photography of Benesse House Oval in Naoshima by Tadao Ando, tranquil oval water pool open to blue sky, curved smooth fair-faced concrete walls, panoramic Seto Inland Sea view, 8k.'
    },


    # Tier 17 (76..87)
    {
        'cat': 'WEIRD_ARCH',
        'title': '사우디아라비아 네옴(NEOM) 더 라인(THE LINE) 500m 거울 외벽 속 인공기후 펜트하우스',
        'year': '2030년 미래 비전 170km 선형 스마트 시티',
        'val': '8,500억 원 (100% 재생에너지 자율기후 통제)',
        'feat': '폭 200m, 높이 500m의 초대형 거울 외벽 속에서 3차원 입체 도시 계획으로 설계된 인공 폭포와 수직 정원을 발아래 둡니다.',
        'verd': '자동차와 도로, 탄소 배출이 0인 미래 인류의 새로운 거주 패러다임을 선도하는 네옴시티의 최상층 스카이 팰리스입니다.',
        'prompt': 'Futuristic megastructure architectural concept art of THE LINE in NEOM Saudi Arabia, towering 500m mirrored linear skyscraper cutting through desert, lush internal vertical biophilic city gardens, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '몰디브 몰디비안 플로팅 시티 산호초 모양 부유식 인공섬 탄소중립 빌라',
        'year': '2024년 유네스코 협력 세계 최초 부유식 도시',
        'val': '280억 원 (해수면 상승 완벽 대응 부유 기술)',
        'feat': '뇌산호(Brain Coral) 구조를 모방한 육각형 모듈 인공섬 위에 지어져 해수면이 상승해도 자동으로 함께 떠오르는 친환경 빌라입니다.',
        'verd': '기후 변화에 맞서 인류가 찾아낸 가장 아름답고 안전한 바다 위 부유 도시의 선구자적 레지던스입니다.',
        'prompt': 'Aerial architectural photography of Maldives Floating City, vibrant pastel-colored sustainable residential houses on hexagonal floating coral-shaped platforms, turquoise lagoon canals, solar roofs, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '일본 도쿄만 우븐 시티(Woven City) 수소 연료전지와 자율주행 지하 물류망 결합 주택',
        'year': '2025년 토요타 후지산 기슭 미래 실증 도시',
        'val': '450억 원 (지하 자율주행 로봇 물류 및 AI 헬스케어)',
        'feat': '일본 전통 목조 건축과 현대 탄소섬유를 융합한 친환경 목조 스마트홈에서 침대가 수면 상태와 건강을 자동 측정합니다.',
        'verd': '지상은 사람과 자연, 지하는 자율주행 로봇이 달리는 완전 연결 스마트 사회의 실험적 펜트하우스입니다.',
        'prompt': 'High-tech smart city architectural photography at Toyota Woven City near Mount Fuji, sustainable mass timber residences with sweeping curved roofs, automated electric shuttles on pedestrian streets, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '프랑스 폴리네시아 타히티 해수 온도차 발전(OTEC) 구동 친환경 플로팅 아일랜드 샬레',
        'year': '2026년 블루 프론티어스 플로팅 아일랜드',
        'val': '340억 원 (심층수 냉방 및 100% 에너지 자립)',
        'feat': '심해 1,000m의 차가운 해수를 끌어올려 에어컨 없이 자연 냉방을 구현하고 무공해 전력을 자체 생산하는 미래형 해양 주택입니다.',
        'verd': '남태평양 청정 바다와 산호초를 보호하며 살아가는 미래 인류의 해양 문명 개척지 샬레입니다.',
        'prompt': 'Stunning ocean engineering photography of a floating eco-island villa in Tahiti lagoon, hydrodynamic curved white modular architecture, solar glass panels, crystalline water revealing coral gardens below, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '아랍에미리트 마스다르 시티 제로 에너지를 구현한 전통 윈드타워 스마트 레지던스',
        'year': '2015년 포스터 앤 파트너스 설계 탄소중립 도시',
        'val': '230억 원 (전통 바르질 바람탑의 현대적 재해석)',
        'feat': '사막의 뜨거운 공기를 45m 윈드타워가 시원한 바람으로 바꾸어 에어컨 사용량을 50% 줄여주는 하이테크 패시브 하우스입니다.',
        'verd': '중동 전통 지혜와 노먼 포스터 경의 미래 공학이 만나 완성된 아부다비 탄소 제로 스마트 하우스입니다.',
        'prompt': 'Sustainable smart city architecture photo in Masdar City Abu Dhabi by Foster + Partners, modern terracotta wind tower creating shaded microclimate courtyard, automated personal rapid transit pod, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '미국 네바다 블랙록 사막 테슬라 기가팩토리 인근 100% 태양광 스마트 그리드 벙커',
        'year': '2022년 오프그리드 자율 에너지 벙커',
        'val': '380억 원 (메가팩 배터리 5MWh 에너지 저장)',
        'feat': '사막의 강렬한 태양광을 흡수하는 메가팩 배터리와 스페이스X 스타링크 통신망으로 외부와 단절되어도 5년간 자립 거주가 가능합니다.',
        'verd': '문명의 붕괴에도 끄떡없는 하이테크 서바이벌과 럭셔리 라이프스타일이 완벽하게 결합된 미래형 자율 벙커입니다.',
        'prompt': 'Futuristic off-grid desert bunker residence in Nevada Black Rock Desert, sleek low-profile concrete and black solar glass architecture, battery storage wall glowing blue, starry desert night, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '아이슬란드 헬리셰이디 지열 탄소 포집 공장 직결 넷제로 하이퍼 샬레',
        'year': '2021년 클라임웍스 오르카(Orca) 탄소 포집 기지',
        'val': '190억 원 (대기 중 탄소를 돌로 만들어 영구 격리)',
        'feat': '공기 중의 이산화탄소를 직접 포집해 현무암 암반 지하에 돌로 굳혀버리는 기후 긍정(Climate Positive) 첨단 샬레입니다.',
        'verd': '살면서 지구의 환경을 능동적으로 정화하는, 인류 기후 기술의 최전선에 위치한 혁신적인 에코 샬레입니다.',
        'prompt': 'Modern eco-futuristic architectural photography in Hellisheidi Iceland, sleek modular cabin standing near Climeworks Orca direct air capture collector fans, geothermal steam rising from mossy lava, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '영국 콘월 에덴 프로젝트 거대 바이오 돔 내부 열대우림 캐노피 스카이 워크 롯지',
        'year': '2001년 니콜라스 그림쇼 설계 지오데식 바이오스피어',
        'val': '420억 원 (세계 최대 온실 내부 프라이빗 레지던스)',
        'feat': '폐채석장 구덩이에 지어진 거대한 6각형 ETFE 복합 플라스틱 바이오 돔 내부 상층부에서 아마존 정글 캐노피를 내려다봅니다.',
        'verd': '영국 콘월의 비바람 치는 날씨 속에서도 1년 365일 완벽한 열대우림 기후와 꽃향기를 만끽하는 지오데식 롯지입니다.',
        'prompt': 'Breathtaking interior architecture photo inside Eden Project biomes Cornwall, looking out from a luxury skywalk timber lodge suspended near ceiling of massive hexagonal geodesic dome, lush jungle below, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '스위스 취리히 ETH 바이오 하이브리드 목재 3D 프린팅 자율 순환 하우스',
        'year': '2023년 스위스 취리히 연방공대 첨단 실험 주택',
        'val': '290억 원 (로봇 팔 3D 콘크리트 및 스마트 목재)',
        'feat': '로봇 팔이 정밀하게 3D 프린팅한 콘크리트 기둥과 자체 호흡하는 지능형 목재 패널이 결합된 건축 공학의 정점입니다.',
        'verd': '알고리즘이 설계하고 로봇이 시공한, 인간의 상상력을 초월하는 완벽한 에너지 순환형 미래 주택입니다.',
        'prompt': 'Cutting-edge digital fabrication architecture photo at ETH Zurich DFAB House, complex double-curved 3D-printed concrete ceiling with intricate filigree patterns, warm robotic timber frame walls, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '노르웨이 스발바르 국제 종자 저장고 연구원 전용 영구동토층 속 미래 생명 벙커',
        'year': '2008년 인류 종말 대비 최후의 날 저장고',
        'val': '650억 원 (인류 모든 농작물 100만 종 보관)',
        'feat': '해발 130m 영구동토층 바위산 120m 깊숙이 뚫린 벙커 안에서 핵폭발과 지진에도 안전하게 인류 식량의 씨앗을 지킵니다.',
        'verd': '인류 문명이 리셋되어도 다시 번성할 수 있는 생명의 노아의 방주 속에 마련된 가장 안전하고 숭고한 연구자 벙커입니다.',
        'prompt': 'Iconic photograph of Svalbard Global Seed Vault entrance portal glowing with turquoise crystalline artwork in frozen Arctic mountainside at twilight, snow covered slopes, Northern Lights, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '미국 캘리포니아 모하비 우주공항 버진 갤럭틱 궤도 비행사 전용 글래스 라운지',
        'year': '2021년 상업 우주비행 기지',
        'val': '580억 원 (준궤도 우주비행선 발사 직관 테라스)',
        'feat': '우주선 스페이스십투(SpaceShipTwo)가 모선에서 분리되어 마하 3으로 우주를 향해 치솟는 궤적을 거실 통유리에서 관측합니다.',
        'verd': '민간 우주여행 시대를 여는 우주비행사들의 출발지에서 우주복을 입고 에스프레소를 마시는 차세대 우주 공항 라운지입니다.',
        'prompt': 'Sleek aerospace architectural photography at Mojave Air and Space Port, futuristic glass observation lounge overlooking runway where sleek white commercial spaceship prepares for launch, desert sunset, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '아랍에미리트 두바이 미래 박물관(Museum of the Future) 아랍 캘리그래피 외벽 스위트',
        'year': '2022년 숀 킬라 설계 토러스(Torus) 형태 세계 최고 랜드마크',
        'val': '9,500억 원 (내셔널 지오그래픽 선정 세계에서 가장 아름다운 박물관)',
        'feat': '외벽 전체가 셰이크 모하메드의 시를 새긴 1,024개의 스테인리스 스틸 아랍 캘리그래피 창문으로 채워져 빛이 글자 모양으로 쏟아집니다.',
        'verd': '중심이 텅 빈 원형(Torus) 구조로 미래의 미지를 상징하는, 지구상에서 가장 지적이고 시적인 현대 건축의 걸작입니다.',
        'prompt': 'Stunning twilight architectural photo of Museum of the Future Dubai, glistening elliptical torus shaped stainless steel building engraved with glowing Arabic calligraphy script windows, reflecting pool, 8k.'
    }
])
print(f"REAL GOOD Part 3A loaded: {len(RAW_REAL_GOOD)} items")

RAW_REAL_GOOD.extend([
    # Tier 18 (88..100)
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 하와이 마우나케아 해발 4,205m 서브밀리미터 천문대 단지 과학자 샬레',
        'year': '1970년 세계 최대 천문 관측 단지',
        'val': '1,200억 원 (해양성 역전층 위의 구름바다 독점)',
        'feat': '태평양 한가운데 해발 4,200m 구름바다 위로 솟아오른 13개의 세계 최대 망원경 돔들과 함께 우주의 심연을 바라봅니다.',
        'verd': '지구 대기의 40%가 발아래에 깔려 별빛이 깜빡이지 않고 선명하게 다이아몬드처럼 빛나는 천문학자들의 지상 천국입니다.',
        'prompt': 'Breathtaking astrophotography at summit of Mauna Kea Hawaii, silhouette of white astronomical observatory domes above sweeping sea of sunset clouds, brilliant violet twilight sky, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '칠레 아타카마 ALMA 전파망원경 해발 5,000m 차스난토르 고원 스타게이징 돔',
        'year': '2013년 66대 전파안테나 결합 세계 최대 전파간섭계',
        'val': '1조 8,000억 원 (우주 탄생 초기 빛 관측소)',
        'feat': '해발 5,000m 고원 위에 도열한 지름 12m짜리 거대 백색 전파안테나 66대가 일제히 같은 성운을 향해 회전하는 장관을 봅니다.',
        'verd': '인간이 지구상에서 우주의 첫 번째 별과 은하의 형성을 가장 선명하게 포착하는 전파 천문학의 심장부 돔입니다.',
        'prompt': 'Majestic wide-angle photo of ALMA radio telescope array on Chajnantor Plateau Chile at 5000m altitude, giant parabolic white dish antennas angled toward dazzling Milky Way galactic core, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '스페인 카나리아 제도 라팔마 섬 로케 데 로스 무차초스 천문대 구름바다 위 테라스',
        'year': '1985년 국제 천문 관측소 협정',
        'val': '850억 원 (그란텔레스코피오 카나리아스 10.4m 망원경)',
        'feat': '대서양 무역풍이 만들어낸 하얀 구름 파도가 칼데라 분화구 절벽 아래로 폭포처럼 흘러내리는 테라스에서 별을 관측합니다.',
        'verd': '유럽 최고의 천문 관측 명소에서 밤낮으로 구름바다와 우주의 신비를 감상하는 천공의 테라스 하우스입니다.',
        'prompt': 'Stunning sea-of-clouds landscape photography at Roque de los Muchachos Observatory La Palma, massive white telescope domes perched on jagged volcanic caldera ridge above fluffy white cloud ocean, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 유타 본네빌 소금평원 시속 1,000km 제트차 레이서 전용 하이테크 트레일러 스위트',
        'year': '1914년 세계 지상 최고속도 기록 측정지',
        'val': '420억 원 (완벽한 수평선과 지상 스피드웨이)',
        'feat': '지구의 곡률이 눈으로 보일 만큼 평평한 순백의 단단한 소금 바닥 위에서 제트 엔진 레이스카의 굉음과 거울 같은 일몰을 즐깁니다.',
        'verd': '스피드를 향한 인간의 한계 도전과 광활한 소금 사막의 무한한 자유를 동시에 누리는 하이퍼 스피드 트레일러입니다.',
        'prompt': 'Futuristic sleek silver trailer suite parked on infinite glass-smooth white salt flats of Bonneville Salt Flats Utah, custom aerodynamic jet land-speed racer parked beside, vibrant pink sunset, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '칠레 파라날 천문대 ESO 초거대망원경(VLT) 옆 제임스 본드 촬영지 레지덴시아 오아시스',
        'year': '2002년 아우어+베버 설계 지하 오아시스 호텔',
        'val': '1,400억 원 (영화 007 퀀텀 오브 솔러스 촬영지)',
        'feat': '화성 표면 같은 붉은 사막 지하에 돔 모양으로 파묻혀 실내 수영장과 열대 정원을 품은 천문학자 전용 지중(地中) 오아시스입니다.',
        'verd': '외부는 완전한 불모의 사막이지만 내부는 완벽한 습도와 녹음이 숨 쉬는 영화 007의 전설적인 지하 펜트하우스입니다.',
        'prompt': 'Cinematic architectural photo of ESO Paranal Residencia in Atacama desert Chile, futuristic semi-subterranean concrete complex with central glass dome covering indoor tropical garden oasis and pool, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '프랑스 피레네 산맥 픽 뒤 미디 해발 2,877m 별빛 쏟아지는 천공 호텔 스위트',
        'year': '1878년 피레네 산 정상 천문대',
        'val': '950억 원 (NASA 아폴로 착륙지 지도 작성 관측소)',
        'feat': '케이블카가 끊기면 구름 위에 단 19명의 게스트만 남겨지는 산정상 관측소에서 피레네 전역의 360도 설벽 파노라마를 맞이합니다.',
        'verd': '아폴로 우주선이 달에 착륙할 수 있도록 정밀 달 지도를 그렸던 역사적인 천문대의 정상 스위트입니다.',
        'prompt': 'Daring alpine photography at Pic du Midi de Bigorre observatory in French Pyrenees at 2877m, cantilevered metal catwalk over sheer abyss, telescope domes under sparkling starry sky, ocean of clouds, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '스위스 융프라우요흐 해발 3,454m 유럽의 정상 얼음 궁전 스핑크스 천문대 룸',
        'year': '1912년 융프라우 산악철도 완공',
        'val': '1,650억 원 (유럽 최장 알레치 빙하 22km 시발점)',
        'feat': '수직 암벽 위에 세워진 스핑크스 전망대에서 22km 길이의 유네스코 알레치 빙하 거대한 얼음 강을 발아래 두고 잠듭니다.',
        'verd': '산악 철도를 타고 빙하 속을 뚫고 올라와 알프스의 영구 빙하를 지배하는 탑 오브 유럽(Top of Europe) 펜트하우스입니다.',
        'prompt': 'Spectacular high alpine photography of Sphinx Observatory at Jungfraujoch Switzerland at 3454m, dramatic metal and glass station perched on jagged needle peak overlooking vast white Aletsch Glacier, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 알래스카 드날리(매킨리) 국립공원 빙하 위 루스 빙하 돈 셸던 알파인 샬레',
        'year': '1966년 전설의 부시 파일럿 돈 셸던 오두막',
        'val': '580억 원 (북미 최고봉 드날리 암벽 1열 뷰)',
        'feat': '해발 1,800m 얼어붙은 원형 협곡(Ruth Gorge) 화강암 절벽 위에 오직 스키 비행기로만 착륙할 수 있는 고립무원의 샬레입니다.',
        'verd': '창문 밖으로 1,500m 수직 화강암 암벽 그레이트 협곡이 병풍처럼 둘러싸인 북미 최강의 익스트림 알파인 롯지입니다.',
        'prompt': 'Breathtaking wilderness photography of Sheldon Chalet perched on rocky nunatak outcrop in Ruth Glacier Denali National Park Alaska, sheer vertical granite rock walls flanking vast white glacier, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '볼리비아 안데스 라파스 미 텔레페리코 케이블카 직결 일리마니 설산 뷰 펜트하우스',
        'year': '2019년 해발 3,600m 안데스 스카이라인',
        'val': '220억 원 (6,438m 일리마니 만년설 정면 뷰)',
        'feat': '도시의 대중교통인 빨간색 케이블카 곤돌라가 발코니 옆을 스쳐 지나가며 분지 형태의 라파스 도시 불빛과 일리마니 설산이 공존합니다.',
        'verd': '세계에서 가장 높은 수도 라파스의 수만 개 붉은 벽돌 집들과 설산이 만드는 기묘하고도 찬란한 안데스 스카이 하우스입니다.',
        'prompt': 'Dramatic urban photography from a luxury penthouse balcony in La Paz Bolivia, colorful Mi Teleférico cable cars gliding past outside, sprawling brick city in bowl canyon with snow-capped Mount Illimani, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '이탈리아 돌로미티 코르티나 담페초 토파나 봉우리 직면 360도 설벽 파노라마 글래스 큐브',
        'year': '2020년 돌로미티 해발 2,752m 글래스 룸',
        'val': '340억 원 (유네스코 세계유산 분홍빛 알펜글로우)',
        'feat': '일몰 때마다 백운암(Dolomite) 바위산이 분홍색과 주황색으로 불타오르는 전설의 에로산(Enrosadira) 현상을 침대에서 맞이합니다.',
        'verd': '세계에서 가장 극적인 암봉들이 사방을 둘러싸고 있는 이탈리아 북부 돌로미티 알프스의 천공의 유리 침실입니다.',
        'prompt': 'Stunning architectural photography of Starlight Room glass cube perched high on rocky ridge in Dolomites Cortina d\'Ampezzo Italy, jagged pale dolomite peaks glowing fiery pink during sunset alpenglow, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '티베트 라싸 포탈라궁 황금 지붕이 내려다보이는 해발 3,650m 달라이 라마 역사 뷰 스위트',
        'year': '1645년 제5대 달라이 라마 붉은 궁전',
        'val': '1,800억 원 (티베트 불교의 심장부)',
        'feat': '13층 높이 백궁과 홍궁의 거대한 화강암 벽체와 순금으로 덮인 역대 달라이 라마의 영탑 황금 지붕을 테라스에서 합장하며 바라봅니다.',
        'verd': '세계의 지붕 티베트 고원에서 영적인 평화와 불교 건축의 가장 웅장한 신성함을 온몸으로 느끼는 천상의 궁전입니다.',
        'prompt': 'Reverent travel photography of Potala Palace in Lhasa Tibet at sunrise, towering red and white fortress palace rising above valley floor, golden roofs catching first morning sunbeams, prayer flags flutter, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '부탄 히말라야 탁상 사원(호랑이 둥지) 맞은편 900m 깎아지른 절벽 럭셔리 로지',
        'year': '1692년 파로 계곡 파드마삼바바 명상 동굴',
        'val': '980억 원 (국민총행복(GNH) 1위 청정 왕국)',
        'feat': '해발 3,120m 수직 절벽 틈새에 매달린 호랑이 둥지(탁상 사원)를 정면으로 마주하는 프라이빗 테라스에서 삼나무 온천욕을 즐깁니다.',
        'verd': '마지막 샹그릴라 부탄 왕국의 고요한 숲속에서 번뇌를 잊고 진정한 마음의 평화를 찾는 은자의 최고급 생크추어리입니다.',
        'prompt': 'Mystical photography of an exclusive luxury stone lodge balcony in Paro Bhutan, overlooking iconic Tiger\'s Nest monastery (Paro Taktsang) clinging to sheer 900m granite cliff opposite across misty valley, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '인도 라다크 레 판공초 해발 4,250m 에메랄드빛 고산 호수 글램핑 에코 돔',
        'year': '2018년 판공초 친환경 지오데식 럭셔리 롯지',
        'val': '320억 원 (영화 세 얼간이 엔딩 호수)',
        'feat': '인도와 티베트에 걸쳐있는 길이 134km의 거대 고산 호수가 하루에도 7번씩 파란색과 에메랄드색으로 색깔을 바꾸는 호숫가 돔입니다.',
        'verd': '해발 4,200m의 청정한 대기 속에서 안데스보다 높은 히말라야 호수의 영롱한 물결과 은하수를 독점하는 캠프입니다.',
        'prompt': 'Breathtaking landscape photography at Pangong Lake Ladakh at 4250m altitude, luxury geodesic heated dome tent on pebble shore of deep sapphire and turquoise saline lake, barren brown mountains, 8k.'
    },

    # Tier 19 (101..112)
    {
        'cat': 'SPACESHIP',
        'title': '국제우주정거장(ISS) 큐폴라(Cupola) 7개 창문 지구 푸른 지평선 내려다보는 무중력 룸',
        'year': '2010년 유럽우주국(ESA) 큐폴라 관측 모듈',
        'val': '1조 5,000억 원 (지구 궤도 400km 90분마다 지구 한 바퀴)',
        'feat': '7개의 대형 석영 강화유리 창문을 통해 발아래로 회전하는 푸른 지구의 대기층과 오로라를 무중력 상태로 둥둥 떠서 감상합니다.',
        'verd': '우주비행사들만이 경험하던 지적 충격인 \'조망 효과(Overview Effect)\'를 침실에서 24시간 만끽하는 궤도 상공의 펜트하우스입니다.',
        'prompt': 'Astonishing space photography inside the ISS Cupola observation module, astronaut floating in zero gravity gazing through panoramic wrap-around windows at the brilliant blue curved Earth and auroras below, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '미국 스페이스X 스타십 화성 이주선 탑승자 전용 360도 돔 관측 데크 라운지',
        'year': '2026년 행성간 운송 시스템(Starship Mars)',
        'val': '3조 8,000억 원 (화성 테라포밍 개척 선발대)',
        'feat': '직경 9m 우주선의 상단 노즈콘 전체가 투명 캐노피로 개방되어 붉은 행성 화성을 향해 날아가는 심우주의 별들을 봅니다.',
        'verd': '일론 머스크의 다행성 인류 꿈을 싣고 태양계를 항해하는 인류 역사상 가장 거대한 유인 우주선의 스카이라운지입니다.',
        'prompt': 'Sci-fi realism digital concept art inside the forward observation dome of SpaceX Starship en route to Mars, massive curved structural glass window looking out at distant glowing red Mars planet, stars, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '미국 액시옴 스페이스(Axiom) 지구 저궤도 상업용 상업 우주정거장 필립 스탁 인테리어 룸',
        'year': '2026년 세계 최초 민간 상업 우주정거장',
        'val': '2조 4,000억 원 (필립 스탁 디자인 스웨이드 쿠션 벽면)',
        'feat': '디자인 거장 필립 스탁이 설계한 부드러운 스웨이드 벽과 나노 LED 무드등이 장착된 객실에서 무중력 샴페인을 즐깁니다.',
        'verd': '우주 관광의 새로운 럭셔리 기준을 제시하는, 민간 상업 우주비행사 전용 궤도 호텔의 1호 프라이빗 스위트입니다.',
        'prompt': 'High-end interior concept art of Axiom Space commercial space station module designed by Philippe Starck, curved walls padded with cream-colored tufted suede fabric and interactive fiber optic LEDs, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '보이저 스테이션 인공중력 회전 바퀴 궤도 호텔 프라이빗 럭셔리 스위트',
        'year': '2027년 오비탈 어셈블리 링형 우주정거장',
        'val': '4조 5,000억 원 (달 중력 1/6 인공 원심력 구현)',
        'feat': '직경 200m 링이 회전하며 만들어내는 달 중력(0.16G) 덕분에 우주에서도 화장실을 정상적으로 이용하고 침대에서 편안히 잡니다.',
        'verd': '영화 <스페이스 오디세이 2001>의 회전 링 호텔이 현실이 된, 지구를 내려다보며 스테이크를 써는 궤도 리조트입니다.',
        'prompt': 'Futuristic luxury concept art of a luxury hotel suite inside the rotating ring of Voyager Station in Earth orbit, panoramic curved windows showing Earth curvature, modern furniture secured to floor, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '오비탈 어셈블리 파이오니어 스테이션 우주 비행사 전용 무중력 수면 포드',
        'year': '2025년 하이브리드 중력 우주 플랫폼',
        'val': '1조 2,000억 원 (28명 수용 민간 우주 실험 기지)',
        'feat': '중력과 무중력을 필요에 따라 조절할 수 있는 모듈러 포드에서 우주 유영(EVA) 훈련을 마친 후 벨크로 침낭에 몸을 고정합니다.',
        'verd': '우주 연구원과 부호들이 함께 머물며 미세중력 제조와 단백질 결정 실험을 진행하는 첨단 궤도 연구 하우스입니다.',
        'prompt': 'Hyper-realistic sci-fi interior photography inside Pioneer Station orbital habitat, sleek ergonomic sleeping pods lined along curved titanium fuselage, glowing cyan interface monitors, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '달 남극 섀클턴 분화구 영구 일조 구역 태양광 발전 얼음 채굴 베이스캠프',
        'year': '2028년 NASA 아르테미스 기지 캠프',
        'val': '5조 2,000억 원 (영구 음영 지역 수십억 톤 얼음 자원)',
        'feat': '항상 햇빛이 비치는 분화구 봉우리에서 무한 태양광 발전을 하며, 절대 영도의 어두운 크레이터 바닥에서 식수를 채굴합니다.',
        'verd': '인류가 지구를 떠나 외계 천체에 세운 최초의 영구 거점 기지이자 화성 정복을 위한 전초기지 벙커입니다.',
        'prompt': 'Realistic lunar base concept art on the rim of Shackleton Crater at Lunar South Pole, reflective geodesic habitat domes, massive vertical solar tracking sails catching brilliant sunlight, Earth on horizon, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '화성 올림포스 화산 해발 21km 칼데라 가장자리 테라포밍 탐사선 지휘 모듈',
        'year': '2035년 화성 유인 착륙 미션',
        'val': '12조 원 (태양계 최고봉 21,287m 정상 기지)',
        'feat': '에베레스트의 2.5배 높이인 화성 올림포스 몬스 화산 꼭대기에서 화성의 붉은 모래폭풍 위로 솟아오른 푸른 일몰을 감상합니다.',
        'verd': '태양계에서 가장 거대한 화산 정상에 깃발을 꽂고 화성의 테라포밍을 지휘하는 인류 외계 개척의 기념비적 돔입니다.',
        'prompt': 'Dramatic space exploration concept art on the caldera rim of Olympus Mons Mars at 21km altitude, advanced pressurized habitat module perched on volcanic cliff, blue Martian sunset glowing in thin atmosphere, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '블루 오리진 뉴 글렌 로켓 발사대 케이프 커내버럴 카운트다운 VIP 관람 펜트하우스',
        'year': '2024년 제프 베조스 상업 궤도 발사대',
        'val': '8,500억 원 (발사대 2km 거리 방폭 내진 설계)',
        'feat': '높이 98m 2단 대형 로켓 뉴 글렌이 7개의 BE-4 엔진을 점화하고 밤하늘을 대낮처럼 밝히며 솟구치는 순간을 직관합니다.',
        'verd': '지축을 흔드는 굉음과 화염의 충격파를 강화 방탄 유리 테라스에서 온몸으로 체감하는 플로리다 우주 해안 펜트하우스입니다.',
        'prompt': 'Exclusive VIP viewing lounge photography at Cape Canaveral Launch Complex 36, floor-to-ceiling blast-resistant glass overlooking illuminated Blue Origin New Glenn rocket on launchpad at night, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '프랑스령 기아나 쿠루 유럽우주국(ESA) 아리안 로켓 정글 발사장 글래스 빌라',
        'year': '1968년 기아나 우주 센터(CSG)',
        'val': '6,200억 원 (적도 직속 지구 자전 가속도 보너스)',
        'feat': '적도 부근 열대 우림 한가운데 발사장에서 아리안 6호 로켓이 수증기 구름을 뿜으며 우주로 발사되는 궤적을 수영장에서 봅니다.',
        'verd': '아마존 정글의 야생 동물 소리와 최첨단 우주 로켓의 굉음이 만나는 유럽 우주 기술의 심장부 정글 빌라입니다.',
        'prompt': 'Tropical spaceport architectural photography in Kourou French Guiana, luxury infinity pool villa surrounded by dense rainforest, Ariane 6 rocket ascending on a column of fire into twilight sky, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '미국 NASA 케네디 우주센터 39A 발사대 직면 아폴로 11호 역사 기념 스카이라운지',
        'year': '1969년 인류 달 착륙 아폴로 11호 발사대',
        'val': '9,800억 원 (닐 암스트롱이 달로 떠난 역사적 성지)',
        'feat': '인류가 처음으로 달에 발을 디뎠던 전설의 발사대 패드 39A와 현재 스페이스X 크루 드래곤 유인 우주선 발사를 조망합니다.',
        'verd': '인류 탐험 역사의 가장 거대한 도약이 시작된 성스러운 발사대 바로 옆에서 미래 우주 시대를 축하하는 라운지입니다.',
        'prompt': 'Historic NASA Kennedy Space Center observation lounge photo overlooking Launch Complex 39A, sunset sky framing Apollo gantry historic monument and modern SpaceX Falcon Heavy rocket, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '사우스 오스트레일리아 우메라 로켓 시험장 끝없는 붉은 대지 위 스타게이징 사일로',
        'year': '1947년 세계 최대 육상 금지 구역(12만㎢)',
        'val': '4,500억 원 (잉글랜드 크기 군사 우주 시험장)',
        'feat': '외부인의 출입이 엄격히 통제된 호주 사막 한가운데 로켓 발사 사일로를 개조해 360도 천문 망원경 돔을 얹었습니다.',
        'verd': '인공 불빛이 제로인 절대 암흑 속에서 남반구 은하수와 우주 탐사선의 궤도를 가장 순수하게 관측하는 사막 사일로입니다.',
        'prompt': 'Minimalist industrial architecture photography in Woomera South Australia, repurposed concrete rocket test silo converted into high-tech stargazing observatory, dazzling southern hemisphere Milky Way, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '일본 다네가시마 우주센터 에메랄드 해안 로켓 발사대 바로 옆 미쓰비시 로열 파빌리온',
        'year': '1969년 세계에서 가장 아름다운 로켓 발사장',
        'val': '5,300억 원 (에메랄드빛 해변 절벽 위 발사대)',
        'feat': '푸른 산호초 해변과 하얀 모래사장 바로 옆 절벽 위에 세워진 H3 로켓 발사대 카운트다운을 프라이빗 비치에서 맞이합니다.',
        'verd': '자연경관이 세계에서 가장 아름다운 우주 기지로 꼽히는 다네가시마 해안의 최고급 우주 테마 파빌리온입니다.',
        'prompt': 'Breathtaking coastal spaceport photography at Tanegashima Space Center Japan, turquoise Pacific ocean waves crashing on white beach, red launch tower perched on green cliff under dramatic clouds, 8k.'
    },

    # Tier 20 (113..124)
    {
        'cat': 'SPACESHIP',
        'title': '제임스 웹 우주망원경(JWST) 지구-태양 L2 라그랑주 포인트 150만km 심우주 차양 쉘터',
        'year': '2021년 발사 100억 달러 황금 육각 거울',
        'val': '13조 원 (우주 태초 135억 년 전 첫 빛 관측)',
        'feat': '영하 233도의 극저온 차양막 그늘 아래서 18개의 베릴륨 금도금 육각 거울이 태초의 은하를 향해 펼쳐진 모습을 관측합니다.',
        'verd': '지구로부터 150만km 떨어진 중력 균형점에서 우주의 기원을 탐색하는 인류 광학 기술의 최고 정점 관측소입니다.',
        'prompt': 'Magnificent deep space digital art of James Webb Space Telescope at Sun-Earth L2, 18 gold-coated hexagonal mirrors gleaming in cosmic darkness, 5-layer silver sunshield gleaming, distant spiral galaxies, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '남극점 아문센-스콧 기지 혹한 영하 82도 빙하 2,800m 위 극지 과학 천문 돔',
        'year': '1956년 남위 90도 지구 최남단 기지',
        'val': '2조 5,000억 원 (모든 경도가 수렴하는 남극점 포인트)',
        'feat': '지구 자전축이 관통하는 지리학적 남극점 표지목 바로 옆에서 눈보라를 뚫고 우주 마이크로파 배경 복사를 탐색합니다.',
        'verd': '얼음 대륙의 가장 깊은 중심에서 인류 과학의 불꽃을 밝히는 혹한기 최고의 익스트림 극지 펜트하우스입니다.',
        'prompt': 'Stark subzero photography of Amundsen-Scott South Pole Station Antarctica at sunset, elevated geometric modular station on stilts over pure white ice plateau, geographic south pole marker, frozen halos, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '스위스 제네바 CERN 거대 강입자 충돌기(LHC) 지하 100m 힉스 입자 검출기 룸',
        'year': '2008년 27km 원형 가속기 터널 완공',
        'val': '6조 원 (신의 입자 힉스 보손 발견 성지)',
        'feat': '초전도 자석이 영하 271도로 냉각된 27km 원형 터널 한가운데 7,000톤짜리 ATLAS 검출기 옆에서 양성자 충돌 데이터를 봅니다.',
        'verd': '우주 만물에 질량을 부여한 신의 입자를 밝혀낸 물리학의 성소 한가운데서 우주 법칙을 깨닫는 지하 100m 벙커입니다.',
        'prompt': 'Monumental science photography inside ATLAS detector cavern at CERN LHC Geneva, massive 8-story octagonal superconducting magnet rings with glowing blue conduits, technical catwalks, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '미국 LIGO 핸포드 중력파 검출기 4km 레이저 진공 파이프 교차점 무진 펜트하우스',
        'year': '2015년 아인슈타인 예측 100년 만의 중력파 첫 검출',
        'val': '1조 6,000억 원 (블랙홀 충돌 시공간 왜곡 측정기)',
        'feat': '수십억 광년 밖 블랙홀 두 개가 충돌할 때 발생한 시공간의 미세한 흔들림(양성자 크기의 1/10,000)을 레이저 간섭계로 잡아냅니다.',
        'verd': '아인슈타인의 일반상대성이론의 마지막 퍼즐을 완성한, 우주의 속삭임을 듣는 완벽한 무진동 펜트하우스입니다.',
        'prompt': 'High-precision physics laboratory photography at LIGO Hanford Observatory, cleanroom bridge above the junction of two 4km ultra-high vacuum beam tubes stretching across desert horizon, laser prisms, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '칠레 아타카마 유럽초거대망원경(ELT) 직경 39m 주경 돔 브릴리언트 옵저버토리',
        'year': '2028년 완공 세계 최대 광학망원경',
        'val': '2조 원 (허블 망원경의 16배 선명도)',
        'feat': '798개의 육각 거울로 이루어진 축구장 크기의 돔 안에서 외계 행성의 대기 구성과 생명체 신호를 직접 분석합니다.',
        'verd': '외계 생명체의 존재 유무를 확인하게 될 지구상 인류 최대의 눈(Eye) 바로 아래 자리 잡은 천문대 레지던스입니다.',
        'prompt': 'Awe-inspiring architectural engineering concept of the Extremely Large Telescope (ELT) dome atop Cerro Armazones Chile, colossal open silver dome revealing 39-meter primary segmented mirror, starry sky, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '미국 그린뱅크 전파망원경 세계 최대 조향식 전파망원경 완전 무소음 전파 청정 샬레',
        'year': '2000년 로버트 C. 버드 전파망원경',
        'val': '9,500억 원 (미국 국립 전파 조용 구역 3만㎢)',
        'feat': '와이파이, 스마트폰, 전자레인지가 법적으로 전면 금지된 33,000㎢ 전파 청정 구역 한가운데서 순수한 아날로그 침묵을 즐깁니다.',
        'verd': '전자기파 공해로부터 100% 해방되어 우주에서 날아오는 자연 전파만을 들으며 영혼을 디톡스하는 무소음 샬레입니다.',
        'prompt': 'Scenic landscape photography at Green Bank Observatory West Virginia, colossal white steerable parabolic radio dish standing in misty mountain valley, quiet pastoral countryside without powerlines, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '중국 구이저우 FAST 500m 전파망원경(천안) 거대 카르스트 분지 스카이 브릿지 빌라',
        'year': '2016년 세계 최대 단일 구경 전파망원경',
        'val': '1조 5,000억 원 (자연 카르스트 지형 500m 전파 접시)',
        'feat': '자연적으로 형성된 거대한 석회암 카르스트 분지 전체를 알루미늄 패널 4,450개로 메워 만든 은빛 전파 바다 위를 조망합니다.',
        'verd': '하늘의 눈(天眼)이라 불리는 거대한 접시 안테나 가장자리 절벽에서 우주의 신호를 탐색하는 경이로운 빌라입니다.',
        'prompt': 'Dramatic aerial photography of FAST (Five-hundred-meter Aperture Spherical radio Telescope) in Guizhou China, massive silver dish bowl nestled in lush green conical karst mountain peaks, suspension bridge, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '미국 애리조나 바링거 운석 분화구(Meteor Crater) 1.2km 크레이터 능선 뷰 롯지',
        'year': '5만 년 전 철-니켈 운석 충돌 유적',
        'val': '7,500억 원 (지구상 가장 보존 상태가 뛰어난 운석 충돌구)',
        'feat': '5만 년 전 거대 소행성이 충돌해 만든 직경 1.2km, 깊이 170m의 완벽한 운석 분화구 능선에서 붉은 사막의 일몰을 봅니다.',
        'verd': '아폴로 우주비행사들이 달 표면 훈련을 진행했던, 외계 천체 충돌의 생생한 흔적을 품은 유서 깊은 분화구 롯지입니다.',
        'prompt': 'Panoramic wide-angle photography at Meteor Crater Arizona, crisp rocky rim overlooking vast circular impact crater depression, clear desert sky with glowing pink twilight, visitor observation deck, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '베네수엘라 로라이마 산(Mount Roraima) 20억 년 태고의 구름바다 위 평정산 크리스탈 롯지',
        'year': '20억 년 선캄브리아기 지구 최고령 암반',
        'val': '2조 2,000억 원 (아서 코난 도일 <잃어버린 세계> 무대)',
        'feat': '사방이 400m 수직 절벽으로 둘러싸여 구름 위에 떠 있는 탁자 모양의 테이블 마운틴 정상에서 천연 석영 크리스털 바닥을 밟습니다.',
        'verd': '영화 <업(UP)>의 파라다이스 폭포 원형이자 외계 생명체가 살 법한 태고의 고립 생태계를 품은 로라이마 평정산 로지입니다.',
        'prompt': 'Epic surreal photography on summit plateau of Mount Roraima Venezuela, bizarre black weathered rock towers, pink quartz crystal deposits glistening in natural pool, endless cloud ocean below sheer cliffs, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '아이슬란드 트리고누카기구르(Thrihnukagigur) 마그마가 빠져나간 거대 화산 내부 마그마 챔버 펜트하우스',
        'year': '4,000년 전 분출 후 마그마 배출 화산',
        'val': '1조 1,000억 원 (지구상 유일의 화산 내부 탐험 공간)',
        'feat': '자유의 여신상이 통째로 들어갈 크기의 거대한 분화구 내부 지하 120m로 개방형 리프트를 타고 내려와 오색 광물 벽을 마주합니다.',
        'verd': '화산의 심장 속으로 걸어 들어가 굳어버린 마그마의 화려한 미네랄 예술을 감상하는 쥘 베른의 <지구 속 여행> 현실판입니다.',
        'prompt': 'Incredible subterranean photography inside the colossal magma chamber of Thrihnukagigur volcano Iceland, open viewing platform suspended inside cavernous rainbow-colored mineral rock vault, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '바하마 딘스 블루홀(Dean\'s Blue Hole) 수심 202m 에메랄드빛 블루홀 위 플로팅 빌라',
        'year': '자연 해저 싱크홀 블루홀',
        'val': '8,500억 원 (세계에서 두 번째로 깊은 블루홀)',
        'feat': '수심 1m의 잔잔한 백사장이 갑자기 수심 202m의 깊은 군청색 심연으로 뚝 떨어지는 드라마틱한 원형 블루홀 수면에 떠 있습니다.',
        'verd': '프리다이버들의 성지이자 바다의 블랙홀이라 불리는 신비로운 에메랄드 만의 심연을 품은 플로팅 빌라입니다.',
        'prompt': 'Breathtaking aerial photography of Dean\'s Blue Hole Long Island Bahamas, perfect circular deep sapphire-blue sinkhole drop-off contrasting with surrounding pale turquoise sand bar, luxury floating overwater deck, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '노르웨이 프레이케스톨렌(Preikestolen) 뤼세피오르드 604m 수직 절벽 끝 글래스 큐브',
        'year': '빙하기 1만 년 전 서리 침식 펄핏 락',
        'val': '9,200억 원 (뤼세피오르드 수직 낙하 604m 뷰)',
        'feat': '25m x 25m 평평한 거대 사각 바위 꼭대기에 설치된 투명 글래스 큐브에서 피오르드의 푸른 물줄기를 수직으로 내려다봅니다.',
        'verd': '영화 <미션 임파서블: 폴아웃>의 클라이맥스 격투 장소가 된, 북유럽 대자연의 압도적인 장관을 독점하는 프레이케스톨렌 큐브입니다.',
        'prompt': 'Vertigo-inducing landscape photography at Preikestolen (Pulpit Rock) Norway, transparent modern glass cube suite perched on edge of 604-meter flat vertical cliff plunging into misty Lysefjord below, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '지구-달 라그랑주 L1 포인트 지구와 달이 동시에 차오르는 인류 최초 영구 유인 게이트웨이 정거장 로열 관측 스위트',
        'year': '2030년대 중반 루나 게이트웨이(Gateway) 심우주 기지',
        'val': '15조 원 (지구와 달의 중력 균형점 L1 궤도)',
        'feat': '지구와 달 사이 중력이 상쇄되는 L1 포인트에서 한쪽 창으로는 푸른 지구를, 다른 쪽 창으로는 달의 크레이터를 동시에 조망합니다.',
        'verd': '인류가 지구의 중력장을 완전히 벗어나 달과 화성으로 향하는 관문에서 우주 시대를 호흡하는 지상 최고의 현실 랜드마크입니다.',
        'prompt': 'Ultimate space architecture concept art inside the royal observation cupola of Lunar Gateway station at Earth-Moon L1 point, high-tech curved panoramic viewing deck showing brilliant blue marble Earth and giant cratered Moon, 8k.'
    }
])
print(f"REAL GOOD Total loaded: {len(RAW_REAL_GOOD)} items")
