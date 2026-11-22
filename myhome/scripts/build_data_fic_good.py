# -*- coding: utf-8 -*-
"""
125 New Curated GOOD FICTION House Entries (Tiers 11 - 20)
Inspired by legendary anime, Ghibli, Disney, Pixar, Tolkien, sci-fi masterpieces,
superhero empires, mythology pantheons, and omniverse pinnacles.
"""

from scripts.build_data_real_bad import CATEGORY_MAP

RAW_FIC_GOOD = [
    # Tier 11 (0..12)
    {
        'cat': 'FICTION_MEDIA',
        'title': '『이웃집 토토로』 사츠키와 메이의 숲속 하얀색 서양식 발코니가 달린 시골집',
        'year': '1958년 쇼와 시대 전원마을',
        'val': '8억 5,000만 원 (도토리 요정의 은총 무한대)',
        'feat': '썩은 나무 기둥을 흔들면 도토리가 우수수 쏟아지고 2층 다락방에는 검댕이 먼지귀신(마쿠로쿠로스케)이 숨 쉬는 정겨운 목조 가옥입니다.',
        'verd': '비 오는 날 정류장에서 토토로에게 우산을 건네주고 고양이 버스를 탈 수 있는 전 세계인들의 영원한 힐링 고향 하우스입니다.',
        'prompt': 'Studio Ghibli style warm pastoral anime art of Satsuki and Mei\'s countryside house from My Neighbor Totoro, weathered red tiled roof, white wooden porch balustrade, overgrown summer flower garden, towering camphor tree behind, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『마녀 배달부 키키』 바다가 보이는 코리코 마을 오소노 아주머니의 구스토 빵집 다락방',
        'year': '유럽풍 항구도시 코리코',
        'val': '12억 원 (갓 구운 크루아상 평생 무료 제공)',
        'feat': '창문을 열면 시원한 지중해 바닷바람과 함께 갓 구운 바게트 향기가 밀려들고, 빗자루를 타고 창문 밖으로 바로 날아오를 수 있습니다.',
        'verd': '검은 고양이 지지와 함께 새로운 마을에 정착하며 마법과 자립을 배우던 키키의 따스한 햇살 가득한 다락방입니다.',
        'prompt': 'Charming Ghibli anime concept art inside Kiki\'s cozy attic bedroom above the seaside bakery in Koriko, round arched window overlooking cobblestone port town and sparkling blue ocean, fresh flour and warm bread aroma, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『하울의 움직이는 성』 소피의 꽃집이 있는 마켓 시핑 마을 햇살 드는 발코니',
        'year': '19세기 스팀펑크 마법 왕국',
        'val': '25억 원 (마법 문고리를 돌리면 사계절 여행)',
        'feat': '색깔별로 돌아가는 4색 마법 문고리를 돌리면 별빛 호수와 화려한 킹스베리 수도, 그리고 꽃 피는 비밀 화원으로 즉시 연결됩니다.',
        'verd': '하울과 캘시퍼의 온기가 살아 숨 쉬는, 마법과 로맨스가 꽃피는 지브리 역사상 가장 낭만적인 발코니 룸입니다.',
        'prompt': 'Studio Ghibli aesthetic romantic art on Sophie\'s sun-drenched floral balcony in Market Chipping, flower pots overflowing with blossoms, view of whimsical timber-framed fantasy houses and distant mountain peaks, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『반지의 제왕』 호빗마을 샤이어 백엔드 샘와이즈 감지의 노란 꽃 만발한 원형 문 언덕집',
        'year': '제3시대 샤이어 호빗골',
        'val': '15억 원 (하루 7끼 식사와 맥주 무제한 파티)',
        'feat': '초록색 잔디 언덕 속에 파묻힌 아늑한 원형 나무 문을 열면 맛있는 감자 파이 굽는 냄새와 벽난로의 장작 타는 소리가 반겨줍니다.',
        'verd': '반지 원정을 마친 샘와이즈 감지가 평화롭게 정착한, 온 세상의 시름을 잊게 만드는 가운데땅 최고의 안식처 스위트입니다.',
        'prompt': 'Tolkien fantasy aesthetic painting of Samwise Gamgee\'s cozy round yellow door hobbit hole in the Shire, round windows with brass latches, circular stone pathways bordered by vibrant yellow sunflowers and pumpkin patch, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『곰돌이 푸』 백 에이커 숲속 푸의 꿀단지 가득 찬 모래 언덕 나무 굴집',
        'year': '백 에이커의 영원한 봄날',
        'val': '3억 5,000만 원 (황금빛 천연 벌꿀 100단지 완비)',
        'feat': '"샌더스(Mr. Sanders)"라는 팻말이 걸린 거대한 고목 나무 굴속에 수십 개의 토기 꿀단지가 가득 차 있고 피글렛이 문을 두드립니다.',
        'verd': '바쁜 현대인의 걱정을 아무것도 안 하는 행복으로 바꿔주는 곰돌이 푸의 백 에이커 숲속 달콤한 보금자리입니다.',
        'prompt': 'Classic Winnie the Pooh storybook watercolor illustration of Pooh\'s cozy tree house in the Hundred Acre Wood, \'Mr. Sanders\' sign carved above round wooden door, shelves lined with ceramic pots labeled \'HUNNY\', 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『무민』 무민 골짜기 푸른 원통형 지붕과 따뜻한 난로가 있는 무민 하우스',
        'year': '핀란드 동화 무민 골짜기',
        'val': '9억 원 (무민마마의 특제 팬케이크와 라즈베리 잼)',
        'feat': '무민파파가 직접 지은 파란색 3층 원통형 집으로, 1층 거실에서는 사시사철 따뜻한 팬케이크 굽는 냄새와 난로 온기가 가득합니다.',
        'verd': '겨울이 오면 가족 모두가 모여 평화로운 동면에 들어가는, 북유럽 동화의 정수를 담은 따뜻한 힐링 하우스입니다.',
        'prompt': 'Whimsical Scandinavian storybook illustration of the blue cylindrical Moominhouse with red conical roof in lush Moominvalley, bridge over sparkling stream, porch with rocking chair, lilac bushes, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『피터래빗』 레이크 디스트릭트 흙벽돌과 쐐기풀 정원 속 아늑한 토끼 굴 침실',
        'year': '1902년 비어트릭스 포터 전원 동화',
        'val': '4억 원 (카모마일 차 한 주전자와 깃털 이불)',
        'feat': '전나무 거대 뿌리 아래 파놓은 보송보송한 모래 굴 침실로, 엄마 토끼가 끓여주는 따뜻한 카모마일 차와 솔방울 난로가 있습니다.',
        'verd': '맥그리거 아저씨의 채소밭에서 당근을 훔쳐 먹고 돌아와 편안하게 잠들 수 있는 동화 속 가장 아늑한 지하 침실입니다.',
        'prompt': 'Beatrix Potter watercolor style illustration inside Mrs. Rabbit\'s clean sandy burrow under fir tree roots, soft moss bed covered in patchwork quilt, dried herbs hanging from earthy ceiling, teacups on table, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『빨간 머리 앤』 프린스 에드워드 섬 초록 지붕 집 앤의 사과꽃 향기 가득한 동쪽 다락방',
        'year': '1908년 캐나다 에이번리 마을',
        'val': '11억 원 (사과꽃 만발한 눈의 여왕 나무 뷰)',
        'feat': '하얀 사과꽃이 창틀을 두드리는 동쪽 다락방 삼각 지붕 아래에서 마릴라 아주머니의 자두 케이크를 먹으며 상상의 나래를 폅니다.',
        'verd': '고아 소녀 앤 셜리가 진정한 가족의 사랑과 꿈을 찾았던 캐나다 프린스 에드워드 섬의 초록 지붕 집 감성 룸입니다.',
        'prompt': 'Lucy Maud Montgomery classic Anne of Green Gables aesthetic, sunlit east gable bedroom in the green gabled farmhouse, white dimity bedspread, window open to blooming white apple blossoms, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『피노키오』 제페토 할아버지의 뻐꾸기시계와 나무 인형 향기 가득한 따뜻한 목공소',
        'year': '1883년 이탈리아 토스카나 마을',
        'val': '6억 8,000만 원 (장인의 손길이 담긴 오르골 컬렉션)',
        'feat': '수십 개의 수제 뻐꾸기시계가 정각마다 아름다운 오르골 멜로디를 연주하고, 장작 난로 위에서 따뜻한 수프 냄비가 끓고 있습니다.',
        'verd': '거짓말을 하면 코가 길어지는 피노키오에게 진정한 인간의 심장을 불어넣어 준 사랑이 넘치는 나무 향기 목공소입니다.',
        'prompt': 'Classic Italian fairytale concept art inside Geppetto\'s warm carpenter workshop, walls filled with intricate handcrafted cuckoo clocks and wooden toys, wood shavings on floor, glowing stone hearth, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『샬롯의 거미줄』 펀의 헛간 따뜻한 건초 더미와 거미줄에 맺힌 아침 이슬 쉼터',
        'year': '1952년 주커만 농장',
        'val': '5억 2,000만 원 (위대한 돼지 윌버의 기적의 거미줄)',
        'feat': '천장 구석 거미줄에 아침 햇살과 함께 "대단한 돼지(SOME PIG)"라는 글자가 영롱한 이슬방울로 반짝이는 건초 쉼터입니다.',
        'verd': '현명한 거미 샬롯과 돼지 윌버의 영원한 우정이 깃든, 시골 농장의 포근하고 따뜻한 건초 향기 힐링 룸입니다.',
        'prompt': 'Heartwarming farm storybook concept art inside Zuckerman\'s wooden barn, golden hayloft drenched in morning sunlight, delicate dewdrop spiderweb hanging in corner spelling out shining words, sweet hay, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『하이디』 스위스 알프스 할아버지의 통나무 오두막 건초 침대와 치즈 난로방',
        'year': '1880년 마이엔펠트 알프스 고산 목초지',
        'val': '14억 원 (알프스 만년설과 알펜글로우 360도 독점)',
        'feat': '지붕 다락방 둥근 창문으로 알프스 별빛이 쏟아지는 마른 풀 건초 침대에 누워 모닥불에 구운 녹아내린 라클렛 치즈를 맛봅니다.',
        'verd': '맑은 염소 젖과 고산 야생화 향기가 가득한, 온 세상의 근심과 병을 씻어주는 순수 알프스 힐링 오두막입니다.',
        'prompt': 'Johanna Spyri classic Heidi aesthetic, rustic timber alpine cabin in high Swiss meadow, dry sweet-smelling hay bed under round gable window looking at glowing pink alpenglow peaks, warm fireplace, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『피터 팬』 네버랜드 로스트 보이즈의 속 빈 거대 참나무 뿌리 속 비밀 은신처',
        'year': '영원히 나이 들지 않는 네버랜드',
        'val': '9억 9,000만 팅커벨 요정가루',
        'feat': '나무 구멍을 미끄럼틀처럼 타고 내려오면 나타나는 지하 비밀 기지로, 벽난로와 곰 가죽 카펫, 팅커벨의 빛나는 방이 마련되어 있습니다.',
        'verd': '후크 선장의 대포알도 뚫을 수 없는, 어린 시절의 모험심과 순수함이 영원히 박제된 네버랜드 지하 펜트하우스입니다.',
        'prompt': 'Enchanting fantasy concept art of Peter Pan and Lost Boys\' underground home under the roots of a giant oak tree in Neverland, glowing fairy lights in lanterns, cozy hollowed-out tree stump fireplace, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『동물의 숲』 너굴 마일리지 풀할부 완납 3층 복층 확장 테라스 정원 하우스',
        'year': '무인도 이주 패키지 완공',
        'val': '5,698,000벨 (너굴 사장 주택 대출 전액 상환 기념)',
        'feat': '황금 물뿌리개로 키운 파란 장미가 정원을 가득 채우고, 3층 루프탑 테라스에서 K.K.의 라이브 통기타 공연을 듣습니다.',
        'verd': '지옥 같은 무인도 빚 갚기를 끝내고 마침내 자유를 얻은 섬 대표 주민의 초호화 전원주택입니다.',
        'prompt': 'Animal Crossing inspired charming 3D cartoon render of a fully expanded 3-story cottage with blue tiled roof, blooming golden and blue roses in white picket garden, K.K. Slider guitar resting on wooden deck, 8k.'
    },

    # Tier 12 (13..25)
    {
        'cat': 'ROYAL_PALACE',
        'title': '『겨울왕국 2』 아토할란 기억의 강 얼음 동굴 속 다이아몬드 크리스털 알현실',
        'year': '과거의 모든 진실이 흐르는 강',
        'val': '10조 원 (제5정령 엘사의 마법 얼음 기억 성소)',
        'feat': '얼어붙은 빙하 절벽 속에서 모든 과거의 순간들이 투명한 얼음 조각상으로 재현되며 다이아몬드보다 투명한 얼음 옥좌가 빛납니다.',
        'verd': '"보여줘(Show Yourself)"를 부르며 다섯 번째 정령으로 각성한 엘사의 신비롭고 웅장한 크리스털 빙하 궁전입니다.',
        'prompt': 'Disney Frozen 2 inspired breathtaking concept art inside the mystical glacier heart of Ahtohallan, towering prismatic blue diamond ice crystals radiating inner ethereal light, frozen river floor, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『알라딘』 아그라바 왕궁 술탄의 화려한 공작새 모자이크 정원 분수 테라스',
        'year': '아라비안나이트 마법의 왕국',
        'val': '5조 원 (지니의 소원으로 지어진 황금 돔 왕궁)',
        'feat': '황금 돔과 코발트블루 타일이 빛나는 궁전 발코니에서 마법의 양탄자를 타고 밤하늘 은하수를 향해 이륙할 수 있습니다.',
        'verd': '"아름다운 세상(A Whole New World)"을 테마송으로 들으며 아그라바 왕국의 황금빛 야경을 발아래 두는 술탄의 궁전입니다.',
        'prompt': 'Disney Aladdin grand palace concept art on Sultan\'s palace terrace in Agrabah, towering onion domes shimmering in gold leaf, intricately tiled peacock mosaic fountains, flying magic carpet hovering, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『미녀와 야수』 야수의 성 마법 장미가 빛나는 스테인드글라스 발코니 펜트하우스',
        'year': '저주가 풀리기 직전의 프랑스 고성',
        'val': '8조 원 (10만 권 회전 나선계단 서재 포함)',
        'feat': '유리 돔 안에서 붉은 꽃잎을 떨구는 마법 장미 곁에서 벨과 야수가 황금빛 드레스를 입고 왈츠를 추던 대연회장이 내려다보입니다.',
        'verd': '말하는 촛대 뤼미에르와 찻잔 칩의 따뜻한 환대를 받으며 진정한 사랑의 마법을 누리는 디즈니 최고의 로맨틱 성채입니다.',
        'prompt': 'Disney Beauty and the Beast concept art inside the Beast\'s high gothic castle tower chamber, enchanted red rose under glass cloche glowing with mystical sparkles, ornate arched balcony overlooking snowy French forest, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『라푼젤』 코로나 왕국 축제날 수만 개의 풍등이 하늘을 수놓는 시계탑 스위트',
        'year': '잃어버린 공주의 귀환 기념 축제',
        'val': '6조 5,000억 원 (수만 개 황금 풍등의 야경 독점)',
        'feat': '왕국 호수 위로 수만 개의 따뜻한 황금빛 풍등(Lantern)이 밤하늘을 은하수처럼 가득 채우는 장관을 보트와 발코니에서 직관합니다.',
        'verd': '"빛이 이제야 보이네(I See the Light)"의 감동을 그대로 담은, 디즈니 역사상 가장 눈부시게 빛나는 야경 펜트하우스입니다.',
        'prompt': 'Disney Tangled magical concept art from high clocktower balcony in Kingdom of Corona, thousands of glowing golden paper lanterns floating into purple twilight sky over castle harbor, reflective water, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『인어공주』 에릭 왕자의 지중해 절벽 위 하얀 파도 부서지는 로맨틱 해변 캐슬',
        'year': '에릭 왕자의 항해 왕국',
        'val': '4조 8,000억 원 (프라이빗 모래사장과 산호 해변)',
        'feat': '파도가 부서지는 바다 절벽 위에 백색 석회암으로 지어진 궁전 테라스에서 에리얼과 함께 바다 바람을 맞으며 항해를 준비합니다.',
        'verd': '육지와 바다의 사랑이 완성된, 지중해풍 낭만과 인어공주의 인어 전설이 어우러진 해안 절벽의 백색 궁전입니다.',
        'prompt': 'Disney Little Mermaid romantic coastal castle concept art, Prince Eric\'s grand white palace perched atop sheer granite sea cliffs, Mediterranean turquoise waves crashing on sand below, sunset glow, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『신데렐라』 왕자님의 무도회 대리석 나선 계단과 유리구두 크리스털 시계탑 룸',
        'year': '12시 마법이 시작되는 밤',
        'val': '7조 원 (호박 마차 전용 황금 회랑)',
        'feat': '순백의 천연 대리석 계단 위에 반짝이는 투명한 유리구두 한 짝이 놓여있고, 12시를 알리는 황금 괘종시계가 울립니다.',
        'verd': '요정 대모의 "비비디 바비디 부" 마법으로 가난한 소녀가 왕비가 되는 동화의 기적이 실현되는 신데렐라 궁전입니다.',
        'prompt': 'Disney Cinderella grand royal palace ballroom concept art, magnificent sweeping marble staircase, giant sparkling crystal chandelier illuminating golden baroque arches, glass slipper on velvet cushion, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『잠자는 숲속의 공주』 숲속 세 요정의 마법 케이크 구워지는 무지개 오두막',
        'year': '오로라 공주 은신처 우드커터 코티지',
        'val': '28억 원 (요정 지팡이로 청소되는 마법 가구)',
        'feat': '요정들이 지팡이를 휘두를 때마다 15단 딸기 생크림 케이크가 저절로 구워지고 파란색과 분홍색으로 변하는 드레스가 춤을 춥니다.',
        'verd': '숲속 다람쥐와 파랑새들이 창문으로 날아들어 노래하는, 디즈니 고전 애니메이션의 우아한 마법 오두막입니다.',
        'prompt': 'Disney Sleeping Beauty mid-century storybook style concept art inside woodcutter\'s cottage, magical glowing wands floating while frosting a whimsical crooked multi-tiered cake, woodland animals on windowsill, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『백설공주』 일곱 난쟁이의 다이아몬드 광산 보석 박힌 오솔길 통나무집',
        'year': '1937년 디즈니 최초 장편 성지',
        'val': '3조 5,000억 원 (바구니 가득 루비와 사파이어)',
        'feat': '난쟁이들이 곡괭이로 캐온 주먹만 한 다이아몬드가 바구니마다 가득 차 있고 백설공주의 파이 굽는 냄새가 숲을 채웁니다.',
        'verd': '"하이호(Heigh-Ho)"를 부르며 퇴근하는 난쟁이들의 정겨운 합창과 피아노 반주가 울려 퍼지는 마법의 숲속 통나무 성채입니다.',
        'prompt': 'Disney Snow White classic animation concept art inside Seven Dwarfs\' handcrafted timber cottage, carved animal wooden chairs, bowls of glowing uncut diamonds and rubies on rough table, cozy fireplace, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『포카혼타스』 버지니아 신비한 버드나무 할머니의 바람이 속삭이는 숲속 정원',
        'year': '1607년 태고의 신대륙 자연',
        'val': '가치 환산 불가 (자연의 영혼과 대화하는 지혜)',
        'feat': '살아있는 거대한 버드나무 할머니의 줄기가 인간의 자애로운 얼굴로 변해 바람의 색깔(Colors of the Wind)을 보여줍니다.',
        'verd': '문명의 탐욕을 내려놓고 대자연의 모든 생명과 친구가 되는 위대한 영적 치유의 성소입니다.',
        'prompt': 'Disney Pocahontas emotional landscape concept art, colossal ancient weeping willow tree with wise gentle face forming in bark, autumn leaves swirling on vibrant purple-gold evening breeze, tranquil river, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『메리다와 마법의 숲』 스코틀랜드 하이랜드 던브로크 성 붉은 타탄체크 벽난로 연회장',
        'year': '중세 스코틀랜드 켈트 왕국',
        'val': '3조 2,000억 원 (도깨비불 윌오더위스프 인도권)',
        'feat': '거대한 곰 가죽과 스코틀랜드 타탄체크 깃발이 걸린 연회장 벽난로 앞에서 화살을 쏘아 10점 만점을 맞추는 호걸의 성채입니다.',
        'verd': '파란 도깨비불을 따라 신비한 고인돌 스톤헨지로 모험을 떠나는 용감한 바이킹 공주의 하이랜드 캐슬입니다.',
        'prompt': 'Disney Pixar Brave concept art inside Great Hall of DunBroch Castle Scotland, massive stone hearth roaring with fire, tartan tapestries, round oak tables, carved Celtic stone pillars, bagpipe, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『타잔』 아프리카 정글 거대한 바오밥나무 캐노피 위 줄타기 직결 럭셔리 트리 빌라',
        'year': '1999년 아프리카 심장부 밀림',
        'val': '2조 5,000억 원 (타잔 전용 덩굴 고속도로 시스템)',
        'feat': '수령 3,000년 된 바오밥나무 상층부 나뭇가지에 침실과 서재를 꾸미고 덩굴을 잡고 정글 캐노피를 시속 60km로 서핑합니다.',
        'verd': '필 콜린스의 명곡 "You\'ll Be in My Heart"가 울려 퍼지는, 정글의 왕 타잔과 제인의 야생 트리 펜트하우스입니다.',
        'prompt': 'Disney Tarzan dynamic lush concept art of a magnificent multi-level Victorian-explorer treehouse nestled in a gargantuan African baobab tree canopy, vine ziplines, sunset over endless misty jungle, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『헤라클레스』 올림포스 산 황금 구름 계단 위 신들의 넥타르 연회 파빌리온',
        'year': '그리스 로마 신화의 황금기',
        'val': '99조 원 (불로불사의 넥타르와 암브로시아)',
        'feat': '솜사탕 같은 핑크빛 구름 계단을 밟고 올라서면 제우스의 번개와 페가수스가 날아다니는 신들의 황금빛 신전 테라스가 펼쳐집니다.',
        'verd': '신들의 음료 넥타르를 마시며 진정한 영웅의 자격을 얻은 자만이 입장할 수 있는 디즈니 신화의 최고봉 파빌리온입니다.',
        'prompt': 'Disney Hercules vibrant stylized mythic concept art atop Mount Olympus, radiant golden Greek colonnade rising from pastel pink and turquoise clouds, Pegasus resting, lightning bolt glowing, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『뮬란』 황제의 자금성 대전 황금 용 조각 지붕 위 불꽃놀이 파노라마 뷰',
        'year': '중국 한나라 훈족 격퇴 기념일',
        'val': '10조 원 (황제가 직접 하사한 샨유의 칼과 메달)',
        'feat': '수만 명의 백성이 무릎 꿇고 절하는 자금성 광장이 내려다보이는 황금 용 기와지붕 위에서 승리의 화려한 오색 불꽃놀이를 직관합니다.',
        'verd': '여성의 몸으로 중국 전역을 구원하고 영웅이 된 뮬란의 영광이 만개하는 천상의 황실 루프탑입니다.',
        'prompt': 'Disney Mulan grand imperial palace concept art on golden dragon-crested pagoda roof of Forbidden City, massive fireworks exploding in crimson and emerald across starry night sky, palace courtyards illuminated, 8k.'
    },

    # Tier 13 (26..37)
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『주토피아』 레인포레스트 디스트릭트 초거대 캐노피 수목원 케이블카 스위트',
        'year': '인공 기후 통제 첨단 도시',
        'val': '4조 5,000억 원 (인공 강우 및 열대 습도 조절 특허)',
        'feat': '거대한 인공 수목 나무 기둥 사이를 연결하는 투명 케이블카 캡슐 스위트에서 형광 식물과 인공 비구름 쇼를 감상합니다.',
        'verd': '포유류 동물들이 만들어낸 최첨단 기후 공학의 경이로움 속에서 열대우림의 신비로움을 24시간 즐기는 스위트입니다.',
        'prompt': 'Disney Zootopia Rainforest District vibrant concept art, giant metal artificial tree trunks supporting lush tropical foliage, modern glass gondola cable car suite floating through mist, neon bioluminescence, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『몬스터 주식회사』 몬스트로폴리스 워터누스 회장의 최고급 스크림 에너지 펜트하우스',
        'year': '웃음 에너지 전환 이전 황금기',
        'val': '3조 8,000만 비명 배럴 (최고급 청정 에너지 정제소)',
        'feat': '벽면 전체가 수만 개의 차원 문(Door) 제어 터미널과 연결되어 있고, 10,000V 스크림 배터리가 황금빛 에너지로 빛납니다.',
        'verd': '몬스터 세상의 최고 경영자만이 누릴 수 있는, 전 세계 어린이방 옷장 문을 손가락 하나로 열고 닫는 차원 게이트웨이 룸입니다.',
        'prompt': 'Pixar Monsters Inc inspired retro-industrial executive penthouse in Monstropolis, polished brass canisters glowing with golden scream energy, panoramic view of quirky monster city skyline, 8k.'
    },
    {
        'cat': 'BOX',
        'title': '『토이 스토리 4』 앤틱 고물상 벤슨 인형들의 샹들리에 위 비밀의 VIP 라운지',
        'year': '세컨드 찬스 앤틱 골동품점',
        'val': '1억 5,000만 원 (1950년대 빈티지 골동품 가치)',
        'feat': '19세기 프랑스제 크리스털 샹들리에 위에 마련된 장난감들의 비밀 아지트로, 듀크 카붐의 스턴트 오토바이 점프대가 설치되어 있습니다.',
        'verd': '인간들의 눈을 피해 골동품 상점 천장 위에서 장난감들의 무한한 자유와 카바레 파티를 즐기는 공중 라운지입니다.',
        'prompt': 'Pixar Toy Story 4 perspective concept art atop a sparkling antique crystal chandelier in Second Chance Antiques, vintage tin toys and Duke Caboom stunt ramp, warm shop glow below, 8k.'
    },
    {
        'cat': 'VEHICLE',
        'title': '『카(Cars)』 플로의 V8 카페 형광 네온사인 켜진 라디에이터 스프링스 로열 스위트',
        'year': '미국 66번 국도 황금기',
        'val': '35억 원 (옥탄가 100 무제한 유기농 연료 바)',
        'feat': 'V8 엔진 블록 모양의 화려한 네온사인 아래에서 최상급 합성 엔진오일 칵테일을 마시며 붉은 사암 윌리스 버트 절벽을 봅니다.',
        'verd': '라이트닝 맥퀸이 진정한 레이싱의 정신을 배웠던 미국 루트 66의 따뜻한 감성과 네온사인이 살아있는 모터 롯지입니다.',
        'prompt': 'Pixar Cars inspired Route 66 neon aesthetic, Flo\'s V8 Cafe with glowing turquoise and hot pink neon engine tubes, vintage chrome bar stools, red rock canyon mesa glowing under starry twilight, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『니모를 찾아서』 그레이트 배리어 리프 말미잘 둥지 옆 오팔 산호초 글래스 빌라',
        'year': '태고의 남태평양 산호초 해역',
        'val': '8조 2,000억 원 (지구 최대 생태계 산호초 독점)',
        'feat': '독성이 없는 촉수를 흔드는 보라색 말미잘 둥지 바로 옆에서 흰동가리 니모 가족과 함께 영롱한 형광 산호초 정원을 거닙니다.',
        'verd': '바닷속에서 가장 안전하고 따뜻한 말미잘 침대에서 남태평양 해류의 다정한 물결을 느끼는 해저 에덴동산입니다.',
        'prompt': 'Disney Pixar Finding Nemo underwater concept art, glowing translucent sea anemone with vibrant orange clownfish resting inside, towering kaleidoscopic coral reefs, turquoise sunbeams piercing clear sea, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '『인크레더블 2』 윈스턴 디버가 지어준 절벽 하이테크 폭포 억만장자 저택',
        'year': '1960년대 미드센추리 모던 억만장자 하우스',
        'val': '1,500억 원 (비밀 슈퍼히어로 출동 수로 시스템)',
        'feat': '거실 바닥 전체가 움직이며 숨겨진 워터 슬라이드와 인크레더빌 카 출동 격납고가 열리는 2,000평 절벽 초호화 스마트 저택입니다.',
        'verd': '미드센추리 모던 디자인과 최첨단 슈퍼히어로 기술이 완벽하게 결합된 애니메이션 역사상 가장 멋진 절벽 건축물입니다.',
        'prompt': 'Pixar Incredibles 2 mid-century modern mega-mansion architecture, cantilevered concrete and glass pavilions hanging over waterfall cliff, indoor fire pit, stone terrazzo floors, 1960s luxury aesthetic, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『코코』 헥터와 이멜다가 춤추는 죽은 자들의 세상 해골 멕시코 전통 대궁전',
        'year': '망자의 날 환상의 차원',
        'val': '영원한 가족의 기억 (금빛 만수국 꽃잎 다리 직결)',
        'feat': '빅토리아 양식과 아즈텍 피라미드가 수직으로 끝없이 쌓아 올려진 네온 불빛 도시에서 황금빛 금잔화 꽃가루 샤워를 맞이합니다.',
        'verd': '"기억해 줘(Remember Me)"의 감동적인 멜로디가 뼈마디를 울리는, 멕시코 영혼들의 가장 화려하고 신명 나는 축제 궁전입니다.',
        'prompt': 'Disney Pixar Coco concept art of Land of the Dead, towering neon-lit vertical fantasy city stacked with Victorian and Aztec pastel houses, bridge made of glowing orange marigold petals, alebrijes flying, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『소울(Soul)』 \'태어나기 전 세상(Great Before)\' 성격 형성 파빌리온 푹신한 구름 룸',
        'year': '영혼들의 탄생 이전 세계',
        'val': '삶의 불꽃(Spark) 1개 (인생을 사랑하는 열정)',
        'feat': '중력도 무게도 없는 파스텔톤 부드러운 언덕 위에서 영혼들이 저마다의 재능과 인생의 불꽃(Spark)을 찾는 마법의 공간입니다.',
        'verd': '피아노 건반 하나, 피자 한 조각의 향기 속에서 삶의 진정한 의미를 깨닫게 해주는 디즈니 픽사의 영적 힐링 룸입니다.',
        'prompt': 'Disney Pixar Soul aesthetic concept art of The Great Before, soft glowing pastel landscape of gentle rolling cyan and lavender hills, minimalist translucent pavilion buildings, little souls floating happily, 8k.'
    },
    {
        'cat': 'FICTION_MEDIA',
        'title': '『루카』 이탈리아 리비에라 포르토로소 광장 분수대 옆 바다 바라보는 다락방',
        'year': '1950년대 이탈리아 지중해 어촌',
        'val': '18억 원 (베스파 스쿠터와 바질 페스토 파스타)',
        'feat': '빨간 기와지붕 너머로 청록색 리구리아해가 한눈에 들어오는 다락방에서 햇볕에 말린 빨래 냄새와 젤라또를 즐깁니다.',
        'verd': '물에 닿으면 바다 괴물로 변하는 비밀을 품고 베스파를 타며 자유를 꿈꾸던 루카와 알베르토의 따뜻한 여름 다락방입니다.',
        'prompt': 'Disney Pixar Luca concept art of charming sunlit attic bedroom in Portorosso Italy, green wooden shutters open to quaint cobblestone piazza fountain and turquoise Ligurian sea, vintage Vespa parked below, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『엔칸토』 마드리갈 가문의 마법으로 살아 움직이는 카시타(Casita) 꽃의 방',
        'year': '콜롬비아 신비의 안데스 계곡',
        'val': '마법의 기적 (온 집안의 바닥 타일이 춤추는 마법)',
        'feat': '바닥 타일이 음악에 맞춰 파도를 치고 계단이 미끄럼틀로 변하며 이사벨라의 손길에서 수백만 송이의 난초 꽃이 피어납니다.',
        'verd': '가족 구성원 모두의 개성과 사랑이 살아 숨 쉬는 기적의 촛불이 타오르는 콜롬비아 마법의 저택 카시타입니다.',
        'prompt': 'Disney Encanto vibrant concept art inside Casita, sentient colorful Spanish colonial courtyard with animated floor tiles and waving shutters, cascades of pink and purple exotic orchids and bougainvillea, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『슈렉 2』 요정 대모의 물약 연구소 황금 나비 날아다니는 펜트하우스',
        'year': '겁나 먼 왕국(Far Far Away) 황금기',
        'val': '8조 원 (\'영원한 행복\' 묘약 레시피 완비)',
        'feat': '수천 개의 마법 물약 병이 컨베이어 벨트를 타고 흐르고 천장에서는 황금 나비들이 날아다니는 요정 대모의 궁극 럭셔리 타워입니다.',
        'verd': '"I Need a Hero"의 폭발적인 노래와 함께 겁나 먼 왕국의 화려한 할리우드식 라이프스타일을 지배하는 마법 펜트하우스입니다.',
        'prompt': 'DreamWorks Shrek 2 concept art inside Fairy Godmother\'s glamorous potion factory penthouse in Far Far Away, towering shelves of glowing colorful elixir flasks, golden butterflies fluttering, gilded mirrors, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『드래곤 길들이기 3』 히든 월드(Hidden World) 발광 산호와 네온 드래곤들의 천공 성채',
        'year': '지구 끝 거대 폭포 아래 드래곤의 고향',
        'val': '100조 원 (모든 드래곤의 기원이 되는 성역)',
        'feat': '거대한 바다 폭포 지하 깊은 곳에 숨겨진 세계로, 네온 빛으로 발광하는 거대 수정 기둥들 사이로 수만 마리의 드래곤이 춤을 춥니다.',
        'verd': '투슬리스가 드래곤들의 왕으로 즉위한, 인류의 손길이 닿지 않은 지구상 가장 찬란하고 신비로운 발광 생태계 성채입니다.',
        'prompt': 'DreamWorks How to Train Your Dragon The Hidden World breathtaking concept art, colossal bioluminescent crystal caverns with turquoise and magenta glowing stalactites, waterfalls falling into abyss, dragons circling, 8k.'
    }
]
print(f"FIC GOOD Part 1 loaded: {len(RAW_FIC_GOOD)} items")

RAW_FIC_GOOD.extend([
    # Tier 14 (38..50)
    {
        'cat': 'ROYAL_PALACE',
        'title': '『센과 치히로의 행방불명』 유바바의 옥좌 뒤편 순금과 비단으로 장식된 최고급 VIP실',
        'year': '신령들의 신비한 온천장 유야',
        'val': '15조 원 (순금 덩어리와 요괴 온천 특등석)',
        'feat': '온천장 최상층에서 거대한 금박 병풍과 비단 방석에 앉아 온천 마을의 불야성과 신들의 연회를 한눈에 내려다봅니다.',
        'verd': '가오나시가 토해낸 금덩이를 긁어모으며 신들의 세계 최고 권력자 유바바의 호화로움을 독점하는 VIP 온천 스위트입니다.',
        'prompt': 'Studio Ghibli style opulent interior of Yubaba\'s private penthouse chamber in Spirited Away bathhouse, ornate red lacquered wood, gold leaf screens with soaring dragons, silk cushions, smoking incense, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『천공의 성 라퓨타』 거대 비행석 코어 룸을 감싼 초록 이끼와 고대 거목 정원',
        'year': '고대 라퓨타 초고대 문명',
        'val': '1,000조 원 (비행석의 무한 부유 에너지)',
        'feat': '성채 한가운데서 푸른빛을 내뿜는 거대한 비행석 원석 주위를 수백 년 된 거목의 뿌리와 평화로운 거신병 로봇이 호위합니다.',
        'verd': '바루스와 시타의 주문으로 사악함은 날아가고 순수한 자연과 로봇만이 남아 구름 위를 영원히 떠다니는 천공의 낙원입니다.',
        'prompt': 'Studio Ghibli aesthetic majestic concept art inside the core of Laputa Castle in the Sky, giant levitating blue Aetherium crystal surrounded by massive ancient tree roots covered in moss and flowers, gentle robot guardian, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『바람계곡의 나우시카』 부해(腐海) 깊은 바닥 정화된 청정 모래와 투명 지하수 온실',
        'year': '불의 7일간 멸망 1,000년 후',
        'val': '지구 재생의 기적 (완전 무공해 청정 수원지)',
        'feat': '유독 가스를 내뿜는 곰팡이 숲 수백 미터 지하 밑바닥에서 오무의 허물 껍질을 지붕 삼아 순수한 모래와 맑은 샘물을 누립니다.',
        'verd': '부해가 사실은 지구를 정화하고 있었다는 위대한 비밀을 간직한 나우시카의 비밀 지하 온실 정원입니다.',
        'prompt': 'Studio Ghibli concept art deep beneath the Toxic Jungle in Nausicaa of the Valley of the Wind, cavern of pure white crystal sand, crystal clear flowing water pools, shed golden shell of giant Ohmu, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『붉은 돼지』 아드리아해 포르코 로소의 비밀 무인도 붉은 비행정 정박 만(Bay)',
        'year': '1929년 아드리아해 낭만 비행 시대',
        'val': '85억 원 (사보이아 S.21 수상비행정 격납고)',
        'feat': '수직 석회암 절벽으로 외부가 완전히 가려진 비밀의 만에서 에메랄드빛 바다 위에 붉은 비행정을 띄워두고 와인을 마십니다.',
        'verd': '"날지 않는 돼지는 그냥 돼지일 뿐이지"라는 명언을 남긴 포르코 로소의 아드리아해 최고 낭만 프라이빗 은신처입니다.',
        'prompt': 'Studio Ghibli aesthetic secluded limestone cove in Adriatic Sea from Porco Rosso, crystal clear aquamarine water, red Savoia S.21 seaplane moored beside white pebble beach, deck chair and radio, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『원령공주(모노노케 히메)』 사슴신(시시가미)의 성스러운 숲 신록의 연못 속 섬',
        'year': '무로마치 시대 태고의 원시림',
        'val': '생과 사를 다스리는 숲의 신성한 영지',
        'feat': '코다마(숲 요정)들이 머리를 딸깍거리며 반겨주는 깊은 원시림 연못 한가운데서 사슴신의 발자국마다 꽃이 피어납니다.',
        'verd': '자연과 인간의 공존을 일깨우며 상처받은 모든 영혼을 치유하는 지브리 애니메이션 최고의 영적 성지 숲입니다.',
        'prompt': 'Studio Ghibli magical nature concept art of Forest Spirit\'s pool in Princess Mononoke, colossal mossy cedar trees, emerald green pond with small island of flowers, tiny white Kodama spirits sitting on branches, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『귀멸의 칼날』 우부야시키 저택 등꽃 향기 가득한 고요한 다다미 정원',
        'year': '다이쇼 시대 귀살대 최고 본부',
        'val': '500억 원 (혈귀의 접근을 영구 차단하는 등꽃 결계)',
        'feat': '보랏빛 등꽃이 커튼처럼 드리워져 혈귀가 단 1mm도 침범할 수 없는 고요한 일본식 저택 정원에서 지주들의 경례를 받습니다.',
        'verd': '천년의 숙적 무잔을 쓰러뜨리기 위한 귀살대의 숭고한 신념과 등꽃 향기가 은은하게 퍼지는 당주 우부야시키의 저택입니다.',
        'prompt': 'Demon Slayer aesthetic serene Japanese traditional palace garden at Ubuyashiki mansion, curtains of fragrant violet wisteria blossoms hanging from wooden pergolas, stone paths, koi pond, tranquil tatami veranda, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '『원피스』 워터 세븐 프랑키 하우스 개조 아쿠아 라구나 뷰 호화 조선소 펜트하우스',
        'year': '대해적시대 물의 도시 워터 세븐',
        'val': '2억 베리 (보물선 사우전드 써니호 설계지)',
        'feat': '거대한 바다 분수와 운하가 교차하는 물의 도시 꼭대기에서 전설의 배 목수들과 함께 바다열차 바다사냥을 구경합니다.',
        'verd': '"슈퍼-!"를 외치며 콜라를 들이켜는 사이보그 프랑키의 열정과 물의 도시의 장엄한 수로가 어우러진 조선소 스위트입니다.',
        'prompt': 'One Piece anime architectural concept art in Water 7, majestic tiered water city with massive canal aqueducts and arched bridges, shipyard penthouse overlooking the bustling harbor and sea train tracks, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『나루토』 불의 나라 나뭇잎 마을 역대 호카게 바위산 꼭대기 선술 라운지',
        'year': '닌자 대전 종결 이후 평화기',
        'val': '나뭇잎 마을의 불타는 의지 (보물 1호 바위산)',
        'feat': '초대 하시라마부터 7대 나루토까지 얼굴이 조각된 거대 바위산 정수리에서 나뭇잎 마을 전체의 평화로운 전경을 내려다봅니다.',
        'verd': '마을을 지키기 위해 청춘을 바친 역대 호카게들의 가호 속에서 선인 모드 차크라를 충전하는 닌자 세계의 랜드마크 옥상입니다.',
        'prompt': 'Naruto anime grand panoramic concept art from the top of the Hokage Monument rock faces, stone cliff edge overlooking the lush Hidden Leaf Village below, sprawling green forest on horizon, sunny day, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『블리치』 소울 소사이어티 정령정 1번대 총대장 야마모토의 선(禪) 정원 다실',
        'year': '호정 13대 천년의 역사',
        'val': '1,000억 칸 (참백도 류인약화의 위엄)',
        'feat': '천 년간 소울 소사이어티를 호령한 류인약화의 열기가 잠들어 있는 정결한 백사 다실에서 대장들과 차를 나누며 명상합니다.',
        'verd': '사신 세계의 최고 권위와 엄숙한 규율이 순백의 자갈 정원과 조화를 이루는 소울 소사이어티 최고사령부 다실입니다.',
        'prompt': 'Bleach anime aesthetic solemn Japanese Zen garden at 1st Division barracks in Seireitei, raked white gravel sand garden, minimalist wooden teahouse pavilion overlooking ancient pine trees and curved tiled walls, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '『헌터x헌터』 천공격투장 200층 플로어 마스터 전용 초호화 360도 스카이 스위트',
        'year': '세계 4대 격투의 성지',
        'val': '200억 제니 (넨 능력자 플로어 마스터 전용)',
        'feat': '해발 991m 200층 마천루 꼭대기에서 넨(念) 능력자들의 사투를 전용 링사이드에서 내려다보며 호화 수영장을 즐깁니다.',
        'verd': '히소카와 클로로의 세기의 결투를 직관할 수 있는 헌터 협회 공인 최고층 파이터들의 스카이 펜트하우스입니다.',
        'prompt': 'Hunter x Hunter anime concept art inside Floor Master\'s ultra-luxury sky suite at 200th floor of Heavens Arena, towering glass walls overlooking sprawling city lights at 990m height, marble plunge pool, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『주술회전』 텐겐의 결계 고전 지하 1,000m 본전 태초의 평온한 다다미 신전',
        'year': '일본 주술계 천년 결계의 핵',
        'val': '일본 전역의 주술 결계 유지권',
        'feat': '일본 전체를 악령으로부터 보호하는 거대한 결계의 심장부로, 끝없이 이어지는 하얀 도리이 문과 평온한 다다미 신전이 펼쳐집니다.',
        'verd': '불사의 술식을 지닌 주술계의 신 텐겐의 품 안에서 완벽한 영적 안전을 보장받는 최후의 성역 신전입니다.',
        'prompt': 'Jujutsu Kaisen anime concept art inside Master Tengen\'s sacred Tombs of the Star shrine beneath Jujutsu High, endless avenue of crimson Torii gates fading into misty white void, minimalist sacred tatami pavilion, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『강철의 연금술사』 아메스트리스 센트럴 사령부 대총통 킹 브래들리의 온실 정원',
        'year': '군사국가 아메스트리스 번영기',
        'val': '국가연금술사 연간 예산 전액',
        'feat': '유리 돔 온실 속에서 희귀한 서양란과 장미를 가꾸며 사령부 붉은 벽돌 요새와 센트럴 시티의 전경을 조망합니다.',
        'verd': '분노의 호문쿨루스 킹 브래들리가 검을 내려놓고 고요하게 차를 마시던 군사 제국 최고사령부의 온실 정원입니다.',
        'prompt': 'Fullmetal Alchemist anime aesthetic grand botanical greenhouse at Central Command, high vaulted Victorian iron and glass roof with exotic blooming orchids, overlooking stone courtyard of military fortress, 8k.'
    },
    {
        'cat': 'MICRO_DWELLING',
        'title': '『스파이 패밀리』 베를린트 시티 포저 일가의 따뜻한 헤링본 마루와 벽난로 거실',
        'year': '냉전 시대 가상의 동국(오스타니아)',
        'val': '세계 평화 유지 (오퍼레이션 스트릭스 성공 가치)',
        'feat': '스파이 아빠 로이드, 암살자 엄마 요르, 초능력자 딸 아냐가 본드와 함께 모여 땅콩을 먹는 따스한 미드센추리 거실입니다.',
        'verd': '각자의 비밀을 품었지만 세상 그 어떤 가족보다 진정한 사랑으로 뭉친 포저 가문의 가장 포근한 홈 스위트 홈입니다.',
        'prompt': 'Spy x Family anime interior concept art of the Forger family living room, stylish 1960s retro mid-century modern furniture, warm brick fireplace, Anya\'s peanut bowl on wooden coffee table, large white dog Bond asleep on rug, 8k.'
    },

    # Tier 15 (51..62)
    {
        'cat': 'ROYAL_PALACE',
        'title': '『반지의 제왕』 곤도르 백색도시 미나스 티리스 백색 나무 만개한 왕의 정원 알현실',
        'year': '아라고른 2세 엘레사르 왕 즉위',
        'val': '왕의 귀환 (곤도르 천년 황금기의 상징)',
        'feat': '7층 도시 최상층 아첼라스 약초 향기 나는 왕의 안뜰에서 다시 꽃을 피운 백색 나무(White Tree)와 펠렌노르 평원을 내려다봅니다.',
        'verd': '사우론의 암흑을 물리치고 인간의 시대가 열린 백색도시의 정점에서 왕의 영광을 누리는 가운데땅 최고의 성채입니다.',
        'prompt': 'Lord of the Rings epic cinematic concept art atop 7th level of Minas Tirith, King Elessar\'s court with the blooming White Tree of Gondor in courtyard, panoramic view of Pelennor Fields below, towering white stone arches, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『반지의 제왕』 로스로리엔 갈라드리엘의 말로른 황금 나무 카라스 갈라돈 궁전',
        'year': '제3시대 요정들의 황금 숲',
        'val': '물의 반지 네냐(Nenya)의 불멸의 가호',
        'feat': '가을에도 잎이 지지 않는 황금빛 말로른 거목 가지 위에 지어진 요정들의 도시 카라스 갈라돈의 은빛 거울 샘터 테라스입니다.',
        'verd': '시간마저 멈춘 듯한 신비로운 요정들의 마법 속에서 세상의 슬픔을 모두 씻어내는 영원한 요정의 숲 궁전입니다.',
        'prompt': 'Tolkien fantasy masterpiece digital painting of Caras Galadhon in Lothlórien, colossal golden Mallorn trees with glowing silver lantern platforms in canopies, Lady Galadriel\'s mirror basin glowing faintly, twilight, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『호빗』 에레보르 외로운 산 드워프 왕국의 황금 보물더미 위 스마우그의 옥좌 룸',
        'year': '드워프 왕 소린 오큰실드의 고향 수복',
        'val': '수백만 개의 황금 잔과 아르켄스톤(대산의 심장)',
        'feat': '산 하나를 통째로 파내어 만든 거대한 석조 기둥 회랑 아래 지평선처럼 펼쳐진 황금빛 보물 더미 위에서 드워프 맥주를 마십니다.',
        'verd': '용 스마우그를 몰아내고 되찾은 드워프 제국의 찬란한 금은보화와 아르켄스톤의 빛이 쏟아지는 에레보르 황금 옥좌입니다.',
        'prompt': 'The Hobbit epic concept art inside the colossal cavernous treasure hall of Erebor, towering carved dwarf colossi pillars, mountains of glittering gold coins, Arkenstone glowing with brilliant white inner light, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『아서 왕 전설』 아발론 호수 속 바위 요정 비비안의 안개 낀 크리스털 수련 궁전',
        'year': '켈트 전설 불멸의 아발론',
        'val': '성검 엑스칼리버와 마법의 검집',
        'feat': '안개가 자욱한 잔잔한 호수 수면 아래 투명한 크리스털 기둥으로 지어진 호수의 여인 비비안의 신비로운 수련 궁전입니다.',
        'verd': '아서 왕이 상처를 치유하기 위해 잠들어 있는, 영원한 생명과 마법의 원천이 흐르는 전설의 아발론 성소입니다.',
        'prompt': 'Arthurian legend magical concept art of Lady of the Lake\'s submerged crystal palace in Avalon, ethereal turquoise water reflecting glowing water lilies, Excalibur sword resting in glowing stone pedestal beneath surface, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『위쳐 3: 블러드 앤 와인』 투생 공작령 보클레르 성 포도밭 내려다보는 동화 테라스',
        'year': '안나 헨리에타 공작부인 치세',
        'val': '2,500만 크라운 (코르보 비앙코 특급 에르벨루스 와인)',
        'feat': '동화 속 기사들이 결투를 벌이는 햇살 가득한 투생 공작령의 황금빛 포도원과 보클레르 요정 궁전의 전경을 만끽합니다.',
        'verd': '괴물 사냥꾼 게롤트가 모든 모험을 마치고 마침내 은퇴하여 와인을 담그며 정착한 꿈의 파라다이스 영지입니다.',
        'prompt': 'The Witcher 3 Blood and Wine inspired fairy-tale landscape photo of Beauclair Palace in Toussaint, towering fairytale spires on cliff, rolling sun-drenched vineyards, Geralt\'s Corvo Bianco vineyard terrace, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『엘든 링』 도읍 로데일 여왕의 규수 룬의 축복이 쏟아지는 거대 황금 성채',
        'year': '황금률의 전성기',
        'val': '엘데의 고리(Elden Ring)의 근원 룬',
        'feat': '황금나무(Erdtree)에서 뿜어져 나오는 거대한 황금빛 잎사귀들이 하늘을 뒤덮고 순백의 대리석 궁전 지붕마다 황금빛이 흐릅니다.',
        'verd': '여왕 마리카와 황금률 라다곤이 다스리던 틈새의 땅 가장 위대하고 장엄한 수도 로데일의 황금빛 알현실입니다.',
        'prompt': 'Elden Ring epic digital art inside Queen\'s Bedchamber in Royal Capital Leyndell, massive glowing golden branches of the Erdtree visible through open terrace arches, golden leaves falling, marble floors, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『엘든 링』 모그윈 왕조 지하 은하수가 비치는 피의 군주 고대 석조 펜트하우스',
        'year': '피의 군주 모그의 왕조 창건기',
        'val': '피의 성배와 미켈라의 신성한 고치',
        'feat': '지하 깊은 암흑 동굴 천장에 인공 은하수가 보석처럼 박혀있고, 핏빛 대리석 기둥 사이로 시오프라 강의 푸른 물줄기가 흐릅니다.',
        'verd': '어둠과 신비로움이 공존하는 시오프라 강 지하 유적 최상층에 자리 잡은 피의 왕조의 웅장한 고대 석조 궁전입니다.',
        'prompt': 'Elden Ring concept art at Mohgwyn Dynasty Mausoleum, deep underground cavern with ceiling glittering like a starry galaxy, crimson blood pools, monumental ancient Greek-style colonnades, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『다크 소울』 햇살 찬란한 아노르 론도 태양의 왕녀 그위네비아의 황금 침실',
        'year': '신들의 도시 아노르 론도 황금기',
        'val': '태양의 왕 그윈의 거인족 신전 가치',
        'feat': '거인의 스케일에 맞춰 지어진 웅장한 황금빛 대리석 침실에서 태양의 왕녀 그위네비아의 거대한 침대와 따스한 햇살을 받습니다.',
        'verd': '은기사들의 활을 뚫고 올라온 불사자만이 마주할 수 있는, 신들의 도시 아노르 론도의 가장 눈부신 황금빛 안식처입니다.',
        'prompt': 'Dark Souls classic fantasy concept art inside Princess Gwynevere\'s sunlight chamber in Anor Londo, colossal golden statues and massive velvet bed drenched in divine golden sunbeams, cathedral gothic arches, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『스카이림』 화이트런 드래곤스리치 성 야를의 연회장과 하이 흐로스가 설산 뷰',
        'year': '제4시대 201년 드래곤의 귀환',
        'val': '10만 골드 (도바킨의 수호 브리즈홈 연계)',
        'feat': '드래곤을 생포했던 거대한 목조 성채 연회장 중앙 화로에서 노드 전통 벌꿀주(미드)를 마시며 회색의 현자들의 설산을 봅니다.',
        'verd': '"푸스 로 다(Fus Ro Dah)!"의 함성을 뒤로하고 바이킹 전사의 거친 낭만과 온기를 만끽하는 화이트런 정상의 성채입니다.',
        'prompt': 'The Elder Scrolls Skyrim concept art inside Dragonsreach great hall in Whiterun, massive timber beams, open roaring central stone fire pit, Jarl\'s throne carved with dragon motifs, snowy Throat of the World peak visible outside, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『월드 오브 워크래프트』 달라란 공중 부유 도시 보랏빛 성채 대마법사 테라스',
        'year': '키린 토 의회의 공중 부유 요새',
        'val': '아제로스 비전 마법의 정수',
        'feat': '노스렌드 하늘 위를 떠다니는 보랏빛 돔 마법 도시 달라란 최상층에서 얼어붙은 얼음왕관 성채와 은하수를 내려다봅니다.',
        'verd': '대마법사 카드가와 키린 토 6인의 의회가 비전 마법을 연구하는 아제로스 최고의 공중 부유 아카데미 펜트하우스입니다.',
        'prompt': 'World of Warcraft epic fantasy concept art of floating magical city Dalaran, violet and gold domed spires, floating arcane crystals, Violet Citadel terrace looking out over starry sky and snowy peaks, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『월드 오브 워크래프트』 수라마르 밤의 요새 나이트본 마나 분수 크리스털 궁전',
        'year': '밤의 샘(Nightwell) 1만 년 번영기',
        'val': '밤의 샘 비전 마나 무제한 공급',
        'feat': '밤의 샘(Nightwell)에서 뿜어져 나오는 비전 마나 포도주를 마시며 백색 대리석과 보랏빛 발광 수정이 어우러진 정원을 거닙니다.',
        'verd': '아제로스에서 가장 화려하고 우아한 나이트본 엘프 문명의 극치를 보여주는 수라마르 밤의 요새 스위트입니다.',
        'prompt': 'World of Warcraft Suramar City Nighthold concept art, elegant night elf palace with glowing arcane purple crystal fountains, white marble colonnades overgrown with luminescent night-lilies, starry night, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『던전앤파이터』 천계 겐트 황녀 에르제의 황금 연꽃 황궁 펜트하우스',
        'year': '천계 황실 지벤 에드릭스',
        'val': '천계 황실 국고 1조 골드',
        'feat': '스팀펑크 비행선들이 오가는 겐트 하늘 위 황실 황궁의 정원에서 에르제 황녀와 함께 연꽃 향기 가득한 차를 마십니다.',
        'verd': '카르텔의 침략을 이겨내고 황금빛 영광을 되찾은 천계 황실의 품격과 최첨단 스팀펑크 문명이 어우러진 궁전입니다.',
        'prompt': 'Dungeon Fighter Online aesthetic celestial empire concept art of Ghent Imperial Palace, blend of Korean Joseon architecture and retro steampunk airship docks, golden lotus ponds on marble terrace, 8k.'
    },

    # Tier 16 (63..75)
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '『사이버펑크 2077』 나이트시티 노스오크 억만장자 케리 유로다인의 힐탑 인피니티 저택',
        'year': '2077년 나이트시티 최상류층 전용 구역',
        'val': '5,000만 에디 (나이트시티 야경 360도 독점)',
        'feat': '사무라이(SAMURAI) 밴드의 기타 컬렉션이 진열된 노스오크 언덕 절벽 인피니티풀에서 나이트시티의 메가빌딩들을 내려다봅니다.',
        'verd': '외벽 무장 경비 터렛과 AV 착륙장을 갖춘, 록스타 케리 유로다인이 누리는 나이트시티 최고의 프라이빗 힐탑 맨션입니다.',
        'prompt': 'Cyberpunk 2077 ultra-luxury mansion concept art in North Oak, modernist cantilevered concrete and glass villa, infinity pool overlooking dazzling neon skyline of Night City, parked luxury Rayfield supercar, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스타워즈』 코러산트 은하 원로원 최고 의장실 500층 네오 레트로 스카이라운지',
        'year': '은하 공화국 황금기',
        'val': '은하계 수만 개 항성계의 행정 중심부',
        'feat': '도시 전체가 금속으로 덮인 행성 코러산트의 500층 고공에서 수십만 대의 스피더가 날아다니는 은하계 수도를 조망합니다.',
        'verd': '팰퍼틴 의장과 요다 대가스터가 은하계의 운명을 논하던, 스타워즈 프리퀄 트릴로지의 상징적인 의장실 펜트하우스입니다.',
        'prompt': 'Star Wars Coruscant luxury architecture concept art inside Supreme Chancellor\'s office suite, massive red-carpeted circular chamber with floor-to-ceiling panoramic glass windows looking out over endless multi-level city planet, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『스타워즈』 나부 행성 테드 왕궁 호숫가 파드메 아미달라의 로맨틱 워터 빌라',
        'year': '나부 행성 전원 휴양기',
        'val': '8,500만 은하 크레딧 (영화 에피소드 2 결혼식 장소)',
        'feat': '에메랄드빛 폭포와 수련이 가득한 테드 호숫가 발코니에서 아나킨 스카이워커와 비밀 결혼식을 올리던 로맨틱 궁전입니다.',
        'verd': '이탈리아 코모 호수를 모델로 한, 스타워즈 은하계에서 가장 평화롭고 아름다운 나부 왕국의 호수 별장입니다.',
        'prompt': 'Star Wars Naboo Lake Country romantic retreat concept art, Italianate villa with domed pavilions perched beside tiered turquoise waterfalls and Lake Varykino, Padmé\'s white marble terrace with floral vines, 8k.'
    },
    {
        'cat': 'WEIRD_ARCH',
        'title': '『블레이드 러너 2049』 월레스 코퍼레이션 황금 물결 반사되는 미니멀리즘 워터 궁전',
        'year': '2049년 복제인간 제조 본사',
        'val': '1,000억 달러 (브루탈리즘 건축의 궁극)',
        'feat': '거대한 노란색 실내 수조 위로 인공 태양 빛이 물결에 굴절되어 콘크리트 벽면에 일렁이는 압도적인 미니멀리즘 성소입니다.',
        'verd': '로저 디킨스의 경이로운 조명 예술과 드니 빌뇌브의 침묵의 미학이 완성한 영화 역사상 가장 숭고한 미래 건축물입니다.',
        'prompt': 'Blade Runner 2049 monumental architecture concept art inside Wallace Corporation headquarters, vast minimalist chamber with shallow reflective pool, undulating golden sunlight caustics playing on brutalist walls, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『듄(Dune)』 칼라단 행성 아트레이데스 가문 거대한 파도 치는 고대 돌성채 테라스',
        'year': '아라키스 이주 전야 제국 10191년',
        'val': '칼라단 행성 공작령 전체의 가치',
        'feat': '끝없는 푸른 바다의 거친 파도가 안개로 부서지는 거대한 화강암 절벽 위 성채에서 레토 공작과 폴 아트레이데스가 사색합니다.',
        'verd': '모래 행성 아라키스로 떠나기 전 폴이 태어나고 자란, 바다와 비의 고향 칼라단의 장엄하고 묵직한 가문의 고성입니다.',
        'prompt': 'Dune 2021 Denis Villeneuve aesthetic concept art of Castle Caladan on ocean cliff, massive monolithic brutalist stone architecture standing against stormy grey sea waves, fog, distant thopter flying, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『듄(Dune)』 카이트 행성 코리노 황제의 황금 파딜라 제국 정원 펜트하우스',
        'year': '샤담 4세 은하 제국 전성기',
        'val': '스파이스 멜란지 수십만 톤',
        'feat': '은하 제국 황제가 거주하는 카이트 행성의 황금 돔 아래 희귀한 외계 식물들이 자라는 파딜라(Prism) 정원 테라스입니다.',
        'verd': '사다우카 친위대의 삼엄한 호위를 받으며 전 은하계의 봉건 영주들을 호령하는 은하 패권의 황금 궁전입니다.',
        'prompt': 'Dune Emperor Shaddam IV imperial palace gardens on planet Kaitain, lavish golden geometric pavilions surrounded by manicured geometric alien hedges, Sardaukar guards, gleaming desert sunrise, 8k.'
    },
    {
        'cat': 'EXTREME_NATURE',
        'title': '『매트릭스: 리저렉션』 아이오(Io) 지오데식 과일 온실 인공 하늘 아래 네오의 안식처',
        'year': '기계와 인간의 공존 시대 신 시온',
        'val': '인류와 지능형 기계 신문명의 결실',
        'feat': '지하 세계에 지오데식 돔을 짓고 기계들이 만들어준 인공 햇빛 아래서 유전자 조작 딸기와 과일을 수확하며 평화를 누립니다.',
        'verd': '매트릭스의 전쟁을 끝낸 네오와 트리니티가 현실 세계에서 마침내 찾은 푸른 녹음 가득한 지하 유토피아 하우스입니다.',
        'prompt': 'The Matrix Resurrections concept art inside the human-machine city of Io, massive geodesic biodome with artificial sky, lush terraced fruit orchards, high-tech peaceful subterranean sanctuary, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『헤일로』 선조의 인공 고리 행성 헤일로(Installation 04) 고요한 산림 캐노피 스위트',
        'year': '10만 년 전 선조 문명 링월드',
        'val': '선조의 고대 기술 (링월드 직경 1만 km)',
        'feat': '고리 안쪽 면에 조성된 산맥과 인공 대양을 머리 위 하늘로 바라보며 선조의 은빛 모놀리스 기둥 옆에서 휴식합니다.',
        'verd': '머리 위를 올려다보면 반대편 산맥과 호수가 하늘을 가로지르는 링월드(Ringworld)의 경이로운 대자연 스위트입니다.',
        'prompt': 'Halo combat evolved concept art on surface of Installation 04 ringworld, pristine alpine lake and pine forest curving upward into the sky above, metallic Forerunner beam tower humming with blue light, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『매스 이펙트』 시타델 프레시디움(Presidium) 인공 호수와 에메랄드 스카이라인 펜트하우스',
        'year': '은하계 평의회 수도 우주정거장',
        'val': '은하계 다종족 연합의 최고 수도',
        'feat': '은하계 중심 우주정거장 프레시디움의 고요한 인공 호수와 벚꽃 나무 산책로 옆 테라스에서 외계 대사들과 만찬을 즐깁니다.',
        'verd': '셰퍼드 소령이 노르망디호를 정박시키고 은하계의 평화를 누리던 시타델 최고 번화가의 펜트하우스입니다.',
        'prompt': 'Mass Effect sci-fi concept art of the Presidium on the Citadel, sweeping clean white alien architecture, tranquil turquoise artificial lake, cherry blossom trees, flying skycars under artificial blue sky, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스타크래프트』 프로토스 고향 행성 아이어 황금빛 카이다린 크리스털 템플',
        'year': '아이어 침공 이전 프로토스 황금기',
        'val': '칼라의 신경망과 사이오닉 에너지의 원천',
        'feat': '거대한 황금빛 아치 구조물과 하늘을 찌르는 푸른색 카이다린 수정 기둥에서 순수한 사이오닉 매트릭스 에너지를 충전합니다.',
        'verd': '"엔 타로 아둔!"을 외치는 고귀한 프로토스 기사단의 정신적 고향이자 은하계 최고 고등 문명의 크리스털 신전입니다.',
        'prompt': 'Starcraft Protoss architecture concept art on homeworld Aiur before the fall, soaring golden spires with floating geometric pylons, colossal blue glowing Khaydarin crystals, pristine alien gardens, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『가디언즈 오브 갤럭시』 노웨어 거대 셀레스티얼 두개골 속 콜렉터의 우주 보물 펜트하우스',
        'year': '은하계 외곽 고대 우주신 유해',
        'val': '인피니티 스톤과 은하계 희귀 생물 컬렉션',
        'feat': '수십억 년 전 죽은 신(셀레스티얼)의 거대한 두개골 광산 최상층에서 유리 쇼케이스에 담긴 우주 희귀 보물들을 감상합니다.',
        'verd': '콜렉터 타넬리어 티반이 인피니티 스톤과 우주 만물을 수집해 보관하던 기상천외한 우주 박물관 펜트하우스입니다.',
        'prompt': 'Marvel Guardians of the Galaxy concept art inside The Collector\'s archive museum within the severed skull of Knowhere, towering shelves of illuminated glass display cases holding strange alien artifacts, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『오버워치』 오아시스 과학자 전용 아라비아만 인공섬 AI 초호화 자율 빌라',
        'year': '옴닉 사태 이후 과학자들의 유토피아',
        'val': '과학 연구 무제한 지원 펀드',
        'feat': '인공 지능이 100% 제어하는 미래형 수련 연못과 반중력 정원에서 분자 생물학 연구를 하며 페르시아만을 조망합니다.',
        'verd': '규제 없는 순수 과학의 발전을 위해 사막 한가운데 세워진 인류 최고의 미래형 테크 유토피아 하우스입니다.',
        'prompt': 'Overwatch Oasis university map concept art, gleaming white futuristic Middle Eastern architecture with turquoise geometric pools, advanced palm trees with holographic data streams, golden desert sun, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『에이펙스 레전드』 올림푸스 공중 부유 도시 본사이 플라자 벚꽃 공중 정원',
        'year': '행성 사이스의 공중 유토피아',
        'val': '공중 부양 반중력 터빈 플랫폼',
        'feat': '구름 위에 떠 있는 초호화 공중 도시 올림푸스의 분홍색 벚꽃 나무 광장 꼭대기에서 360도로 은하계 하늘을 내려다봅니다.',
        'verd': '아웃랜드 부호들의 최첨단 공중 휴양지 본사이 플라자에서 벚꽃 잎을 맞으며 샴페인을 기울이는 천공의 펜트하우스입니다.',
        'prompt': 'Apex Legends Olympus aesthetic concept art at Bonsai Plaza, floating sci-fi city with glowing pink cherry blossom trees, sleek white and glass towers against a dramatic sky of pastel clouds, 8k.'
    }
])
print(f"FIC GOOD Part 2 loaded: {len(RAW_FIC_GOOD)} items")

RAW_FIC_GOOD.extend([
    # Tier 17 (76..87)
    {
        'cat': 'WEIRD_ARCH',
        'title': '『아이언맨』 토니 스타크 말리부 해안 절벽 아크 원자로 자율주행 글래스 스마트 저택',
        'year': '스타크 인더스트리 최첨단 스마트홈',
        'val': '1,500억 원 (자비스 AI 인공지능 홈 시스템)',
        'feat': '태평양이 내려다보이는 말리부 곶 절벽 위에 유기적 백색 콘크리트로 지어졌으며 홀로그램 인터페이스로 수트를 착용합니다.',
        'verd': '자비스(JARVIS)의 브리핑을 받으며 지하 연구실에서 마크 수트를 튜닝하는 전 세계 공대생들의 로망 하우스입니다.',
        'prompt': 'Marvel Iron Man iconic concept art of Tony Stark\'s Malibu cliffside mansion, organic white concrete curves perched over Pacific ocean, modern glass pavilions, holographic displays floating in living room, sunset, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『블랙 팬서』 와칸다 골든 시티 비브라늄 자기부상 모노레일 직결 왕실 폭포 궁전',
        'year': '비브라늄 문명 1만 년 번영기',
        'val': '900조 원 (세계 유일의 비브라늄 광맥 독점)',
        'feat': '거대한 폭포수가 쏟아지는 절벽 위 황금빛 아프리카 전통 왕궁으로, 비브라늄 자기부상 열차가 발코니 아래를 소리 없이 질주합니다.',
        'verd': '"와칸다 포에버!"를 외치며 최첨단 과학 기술과 아프리카 전통 문화의 찬란한 조화를 누리는 왕실 폭포 팰리스입니다.',
        'prompt': 'Marvel Black Panther concept art of Wakanda Golden City palace, soaring afro-futurist skyscrapers with thatched roofs, majestic waterfalls plunging beside royal balcony, maglev train gliding by, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『토르』 아스가르드 헤임달의 비프로스트 무지개다리 황금 천문대 로열 라운지',
        'year': '신들의 영역 아스가르드 황금기',
        'val': '아홉 왕국의 수호 (비프로스트 차원 전송기)',
        'feat': '우주로 뻗어나가는 7색 무지개다리 끝자락 황금 구형 천문대에서 헤임달의 검 호프룬드를 돌려 우주 어디로든 순간이동합니다.',
        'verd': '우주 전체의 10조 개 별과 아홉 왕국의 숨결을 한눈에 감시하는 신들의 차원 관측소 로열 라운지입니다.',
        'prompt': 'Marvel Thor concept art inside Heimdall\'s golden Bifrost observatory dome in Asgard, glowing crystalline rainbow bridge extending across cosmic void into distant nebulae, golden spinning mechanism, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『닥터 스트레인지』 뉴욕 생텀 생토럼 비샨티의 눈 스테인드글라스 명상 마스터 스위트',
        'year': '그리니치 빌리지 블리커가 177A',
        'val': '지구 차원 방어 결계의 심장부',
        'feat': '소서러 슈프림의 상징인 비샨티의 봉인이 새겨진 거대한 원형 스테인드글라스 창문 아래서 부유 마법 망토가 어깨를 감싸줍니다.',
        'verd': '도르마무의 다크 디멘션 침공을 막아내는 차원 수호자 닥터 스트레인지의 신비로운 마법 도서관 펜트하우스입니다.',
        'prompt': 'Marvel Doctor Strange concept art inside New York Sanctum Sanctorum, iconic circular Window of the Worlds stained glass casting mystical shadows, floating Cloak of Levitation, ancient spellbooks, 8k.'
    },
    {
        'cat': 'LUXURY_PENTHOUSE',
        'title': '『배트맨』 브루스 웨인 웨인 타워 최상층 고담시 야경 360도 프라이빗 펜트하우스',
        'year': '고담시의 수호자 웨인 엔터프라이즈',
        'val': '4,500억 원 (지하 비밀 배트케이브 직통 리프트)',
        'feat': '고담시의 가고일 석상들이 내려다보이는 아르데코 양식 마천루 꼭대기에서 알프레드의 티 서비스를 받으며 배트시그널을 확인합니다.',
        'verd': '낮에는 억만장자 플레이보이, 밤에는 어둠의 기사로 변신하는 브루스 웨인의 가장 클래식한 고담 펜트하우스입니다.',
        'prompt': 'DC Batman luxury interior concept art inside Bruce Wayne\'s penthouse atop Wayne Tower, soaring art deco vaulted windows framing dark gothic Gotham City skyline with Bat-Signal in clouds, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『슈퍼맨』 북극 고독의 요새(Fortress of Solitude) 크립톤 크리스털 메모리 홀',
        'year': '북극 빙하 속 크립톤 문명 보존소',
        'val': '사라진 행성 크립톤의 10만 년 지식 아카이브',
        'feat': '수십 미터 높이의 거대한 푸른빛 크립톤 수정 기둥들이 솟아오른 얼음 요새에서 조엘의 홀로그램과 우주의 진리를 대화합니다.',
        'verd': '칼엘(슈퍼맨)이 자신의 근원과 힘을 되찾는 북극 빙하 깊은 곳의 장엄하고 성스러운 크리스털 성채입니다.',
        'prompt': 'DC Superman iconic concept art inside the Fortress of Solitude in the Arctic, towering crystalline spires of translucent blue ice and glowing alien data crystals, statue of Jor-El and Lara, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『아쿠아맨』 아틀란티스 심해 7개 왕국 발광 생물 발광 왕립 해저 옥좌 궁전',
        'year': '대서양 3,000m 심해 고대 왕국',
        'val': '바다의 7대 왕국 삼지창과 전 함대',
        'feat': '고대 아틀란의 황금 삼지창이 꽂힌 해저 알현실에서 형광 플랑크톤과 발광 고래들이 궁전 창밖을 호위하는 심해 옥좌입니다.',
        'verd': '지구 표면의 70%를 지배하는 바다의 왕 아서 커리가 통치하는, 환상적인 네온 산호와 고대 그리스 신전이 결합된 해저 황궁입니다.',
        'prompt': 'DC Aquaman breathtaking underwater concept art of royal throne room of Atlantis, glowing neon cyan and magenta bioluminescent architecture, swimming sea creatures, ancient Greek-inspired coral columns, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『원더우먼』 데미스키라 파라다이스 아일랜드 아마존 전사들의 대리석 해안 신전',
        'year': '올림포스 신들의 은폐 결계 섬',
        'val': '아마존 전사들의 불멸과 헤스티아의 진실의 올가미',
        'feat': '외부 세계의 간섭이 차단된 지상낙원 섬에서 에게해의 푸른 파도가 찰랑이는 순백의 대리석 기둥 테라스에서 활쏘기를 연습합니다.',
        'verd': '다이애나 왕세녀가 자라난, 여성 전사들의 명예와 그리스 신들의 은총이 영원히 깃든 데미스키라 해안 신전입니다.',
        'prompt': 'DC Wonder Woman mythic concept art of Themyscira paradise island, gleaming white classical marble temples built into seaside cliffs, turquoise lagoon waters, Amazon warriors on horseback along beach, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『엑스맨』 자비에 영재학교 웨스트체스터 카운티 자비에 교수의 세레브로 룸 정원 저택',
        'year': '1963년 뮤턴트 평화 공존 아카데미',
        'val': '850억 원 (세레브로 뮤턴트 뇌파 증폭 헬멧)',
        'feat': '완벽하게 정돈된 영국식 잔디 정원 지하에 둥근 은빛 통로를 지나면 전 세계 모든 인간과 뮤턴트의 뇌파를 연결하는 세레브로가 있습니다.',
        'verd': '프로페서 X의 인류 평화 비전과 돌연변이 영웅들의 따뜻한 보금자리가 되어주는 뉴욕 교외의 빅토리아 매너 하우스입니다.',
        'prompt': 'X-Men Xavier\'s School for Gifted Youngsters architectural photo, stately Victorian brick mansion surrounded by autumn oak estate lawns, open circular metallic vault door beneath leading to Cerebro, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『어벤져스』 어벤져스 컴파운드 뉴욕 호숫가 최첨단 퀸젯 격납고 펜트하우스',
        'year': '뉴욕주 업스테이트 최첨단 기지',
        'val': '2,500억 원 (스타크 테크 나노 무기 제조창)',
        'feat': '유리 돔 격납고에서 스텔스 수송선 퀸젯이 호수 수면을 가르며 수직 이착륙하는 모습을 보며 어벤져스 브리핑을 받습니다.',
        'verd': '지구 최강의 영웅들이 모여 타노스의 위협에 맞서 지구를 방어하던 마블 시네마틱 유니버스의 최전선 본부입니다.',
        'prompt': 'Marvel Avengers Compound upstate New York concept art, sleek glass and dark steel corporate facility on tranquil lake, Quinjet aircraft parked on illuminated landing pad, sunset reflection on water, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『판타스틱 4』 바스터 빌딩 최상층 리드 리차즈 4차원 차원문 연구실 스카이 빌라',
        'year': '맨해튼 미드타운 42가',
        'val': '네거티브 존(Negative Zone) 차원 게이트웨이',
        'feat': '맨해튼 한가운데 바스터 빌딩 상단 5개 층에서 네거티브 존으로 통하는 차원문을 열어두고 우주 방사선 연구를 진행합니다.',
        'verd': '미스터 판타스틱 리드 리차즈의 천재적인 과학 기술과 판타스틱 4 가족의 따뜻한 식탁이 공존하는 맨해튼 스카이라인 랜드마크입니다.',
        'prompt': 'Marvel Fantastic Four Baxter Building penthouse concept art, retro-futuristic science laboratory with giant blue numeral \'4\' glowing on glass atrium, panoramic Manhattan skyline outside, portal humming, 8k.'
    },
    {
        'cat': 'UNDERGROUND_BUNKER',
        'title': '『스파이더맨: 뉴 유니버스』 피터 파커의 지하 비밀 스파이더 케이브 슈트 쇼룸',
        'year': '메이 숙모 집 뒤뜰 지하 비밀 기지',
        'val': '수십 벌의 다차원 스파이더맨 수트 컬렉션',
        'feat': '메이 숙모의 빨래 건조대 지하에 숨겨진 첨단 기지에서 클래식 수트, 누아르 수트, 아이언 스파이더 아머가 진열된 유리장을 봅니다.',
        'verd': '"큰 힘에는 큰 책임이 따른다"는 진리를 가슴에 품고 다차원 스파이더 군단이 모여 결의를 다지던 비밀 아지트입니다.',
        'prompt': 'Spider-Man Into the Spider-Verse stylized comic concept art inside hidden Spider-Cave under Aunt May\'s shed, circular glass pods displaying various colorful Spider-Man suits, neon computer consoles, 8k.'
    },

    # Tier 18 (88..100)
    {
        'cat': 'ROYAL_PALACE',
        'title': '『그리스 신화』 올림포스 산 황금 구름 옥좌 제우스와 헤라의 불멸의 대리석 궁전',
        'year': '티타노마키아 승리 이후',
        'val': '인간과 신들의 운명을 다스리는 천상계',
        'feat': '파르테논 신전을 압도하는 순백의 대리석 열주 회랑에서 제우스의 벼락과 헤라의 공작새가 테라스를 거니는 천상 궁전입니다.',
        'verd': '12주신이 불멸의 연회를 벌이며 인간 세상을 굽어살피는 서양 문명 신화의 가장 찬란한 황금빛 정상입니다.',
        'prompt': 'Classical Greek mythology concept art of Zeus\'s grand palace atop Mount Olympus, colossal pristine marble colonnades bathed in divine golden sunlight above rolling fluffy cloud floor, bronze braziers, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『북유럽 신화』 발할라 540개 문과 창으로 엮은 지붕 에인헤랴르 영웅들의 황금 만찬장',
        'year': '오딘의 아스가르드 황금 연회장',
        'val': '라그나로크를 대비하는 54만 전사의 전당',
        'feat': '황금 방패로 기와를 올리고 창으로 서까래를 엮은 540개의 문이 달린 거대한 홀에서 영원히 되살아나는 멧돼지 세흐림니르 고기를 먹습니다.',
        'verd': '발키리의 인도를 받아 전사한 영웅들만이 입장할 수 있는 북유럽 바이킹 전설의 가장 호쾌한 천상 만찬장입니다.',
        'prompt': 'Norse mythology concept art of Valhalla\'s great hall, roof thatched with gleaming golden shields, walls framed by shining spears, roaring hearth fires along endless wooden tables filled with Viking heroes, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『이집트 신화』 라(Ra)의 태양의 돛배 은하수를 건너는 황금 태양신 바크 스위트',
        'year': '태초의 눈(Nun) 혼돈 이후',
        'val': '매일 아침 태양을 떠오르게 하는 우주의 생명력',
        'feat': '새벽의 만뎃 돛배와 저녁의 메셈텟 돛배를 갈아타며 은하수 강물을 항해하고 사악한 뱀 아포피스를 물리치는 황금 바크선입니다.',
        'verd': '이집트 파라오들이 사후 세계에서 가장 영원히 승선하고 싶어 했던 우주를 항해하는 태양신의 황금빛 돛배입니다.',
        'prompt': 'Egyptian mythology concept art of Ra\'s golden solar barque sailing through starry cosmic waters of the Milky Way, ornate papyrus prow shaped like a golden falcon head, sun disc blazing with divine fire, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『수메르 신화』 길가메시의 우루크 하늘 궁전 청람석(라피스 라줄리) 보석 성벽 펜트하우스',
        'year': '기원전 2700년 메소포타미아 문명의 요람',
        'val': '인류 최초의 서사시 길가메시 왕의 궁전',
        'feat': '티그리스-유프라테스 강변 구운 벽돌과 짙푸른 청람석(라피스 라줄리)으로 마감된 7층 지구라트 정상에서 별자리를 읽습니다.',
        'verd': '엔키두와의 영원한 우정과 영생의 비밀을 찾아 헤매던 인류 최고(最古)의 영웅 길가메시의 전설적인 왕궁입니다.',
        'prompt': 'Ancient Sumerian mythology concept art atop the grand Ziggurat of Uruk, walls inlaid with deep blue lapis lazuli and gold leaf reliefs, overlooking fertile Euphrates valley at twilight, incense braziers, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『인도 신화』 인드라의 스바르가 천계 영원한 젊음의 소마주 흐르는 아마라바티 궁전',
        'year': '천둥과 신들의 왕 인드라의 치세',
        'val': '신들의 도시 아마라바티와 백상아리 아이라바타',
        'feat': '천 개의 문과 천 개의 보석 탑으로 둘러싸인 천계 도시 아마라바티에서 마시면 늙지 않는 신들의 소마(Soma) 음료를 맛봅니다.',
        'verd': '압사라 요정들이 천상의 춤을 추고 간다르바의 악사들이 음악을 연주하는 힌두 신화의 가장 환희에 찬 천상 궁전입니다.',
        'prompt': 'Vibrant Indian Vedic mythology concept art of Indra\'s heavenly palace Amaravati in Svarga, intricately carved multi-tiered golden gopuram towers decorated with jewels, celestial Apsaras dancing by lotus pool, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『켈트 신화』 티르 나 노그(Tír na nÓg) 영원한 청춘의 섬 사과꽃 잎 흩날리는 크리스털 성',
        'year': '서쪽 바다 너머 요정들의 섬',
        'val': '질병과 노화와 죽음이 없는 영원한 청춘',
        'feat': '사계절 내내 하얀 사과꽃이 만발하고 황금빛 사과가 열리는 섬에서 요정 공주 니암과 함께 백마를 타고 바다 위를 달립니다.',
        'verd': '인간 세상으로 돌아오면 순식간에 늙어버린다는 전설을 품은 켈트 신화의 가장 슬프고도 아름다운 영원한 청춘의 궁전입니다.',
        'prompt': 'Celtic mythology concept art of Tír na nÓg (Land of Youth), crystalline castle rising from meadows of perpetual blooming apple blossoms, emerald green hills, white horse with golden mane by mystical sea, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『일본 신화』 타카마노하라(고천원) 아마테라스 오오카미의 태양빛 거울 신전',
        'year': '일본 신토 신화 태양신 통치기',
        'val': '삼종신기 야타의 거울과 야사카니의 곡옥',
        'feat': '신성한 아마노야스가와 강가의 신전에서 세상을 밝히는 태양신 아마테라스의 청동 거울에 반사되는 신성한 햇살을 맞이합니다.',
        'verd': '동굴에 숨었던 태양이 다시 솟아오르며 온 천지에 만발한 신들의 웃음꽃이 피어나는 일본 신토의 최고 성역 신전입니다.',
        'prompt': 'Japanese Shinto mythology concept art of Takamanohara (Plain of High Heaven), serene hinoki cypress shrine pavilion surrounded by sacred white stone riverbed, giant glowing bronze mirror reflecting divine sunlight, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『중국 신화』 곤륜산 서왕모의 불로불사 반도 복숭아 화원 옥황상제 별궁',
        'year': '곤륜산 천계 선경',
        'val': '3,000년에 한 번 열리는 불로불사 천도복숭아',
        'feat': '구름이 감도는 곤륜산 정상 비취 연못 요지(瑤池)에서 3,000년 만에 열린 탐스러운 반도 복숭아를 한 입 베어 물며 영생을 얻습니다.',
        'verd': '손오공이 훔쳐먹고 신선들이 모여 잔치를 벌이던 중국 도교 신화 최고의 낙원 서왕모의 요지선경(瑤池仙境)입니다.',
        'prompt': 'Chinese mythology Taoist concept art of Queen Mother of the West\'s palace on Mount Kunlun, misty jade pavilions overlooking a garden of giant glowing peach trees with ripe celestial peaches, crane flying, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『아서 왕 전설』 요정의 여왕 모르간 르 페이의 아발론 사과꽃 만발한 유리탑',
        'year': '불멸의 마법 아발론 섬',
        'val': '아서 왕의 상처를 치유하는 아홉 자매의 마법',
        'feat': '투명한 유리로 만들어진 9층 첨탑 꼭대기에서 아홉 자매 요정들이 치유의 주문을 외우며 엑스칼리버 검의 빛을 보존합니다.',
        'verd': '중세 켈트 기사도 로망스의 가장 신비로운 종착지이자 마법의 성배가 숨겨진 서쪽 바다의 유리탑 궁전입니다.',
        'prompt': 'Arthurian romance concept art of Morgan le Fay\'s transparent Glass Tower on Island of Avalon, spiral glass staircase, surrounding orchards of sweet apple trees under twilight purple skies, mystical mist, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『신곡(단테)』 천국편 엠피레오(최고천) 빛의 흰 장미 중심부 천사들의 합창 펜트하우스',
        'year': '1320년 단테 알리기에리 불멸의 걸작',
        'val': '신의 신성한 사랑이 우주를 움직이는 궁극의 빛',
        'feat': '수백만 개의 꽃잎마다 구원받은 영혼들이 성좌를 이루고 있는 거대한 빛의 순백 장미 중심부에서 천사들의 날갯짓을 봅니다.',
        'verd': '베아트리체의 미소와 함께 신의 지고한 사랑을 직관하는 인류 문학사상 가장 숭고한 천국 엠피레오의 중심입니다.',
        'prompt': 'Dante\'s Paradiso grand mystical concept art of the Empyrean Celestial Rose, colossal luminous white rose formed of millions of glowing angelic beings and souls, blinding divine golden core, cosmic majesty, 8k.'
    },

    {
        'cat': 'ROYAL_PALACE',
        'title': '『천일야화』 바그다드 하룬 알 라시드의 천 개의 방이 있는 청금석 수상 궁전',
        'year': '이슬람 아바스 왕조 바그다드 번영기',
        'val': '셰에라자드의 1,001개 불멸의 이야기 컬렉션',
        'feat': '티그리스 강변에 세워진 천 개의 방마다 황금 분수와 비단 커튼이 드리워져 밤마다 셰에라자드의 매혹적인 이야기를 듣습니다.',
        'verd': '지혜의 집(Bayt al-Hikma)과 함께 이슬람 황금기를 찬란하게 꽃피운 바그다드 칼리프의 전설적인 궁전입니다.',
        'prompt': 'One Thousand and One Nights Arabian palace concept art in Baghdad on Tigris river, turquoise glazed tile domes, soaring geometric archways, fountains flowing with rose water, silk carpets, crescent moon, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『동방신기록』 봉래산 불로초 자라는 신선들의 구름 위 비취 정자',
        'year': '동방 삼신산(봉래·방장·영주)',
        'val': '진시황이 평생을 바쳐 찾던 영생의 불로초',
        'feat': '학을 타고 날아온 신선들이 구름 위 비취색 정자에서 바둑을 두고, 마당에서는 사슴이 불로초를 뜯어 먹는 무릉도원입니다.',
        'verd': '"신선놀음에 도끼자루 썩는 줄 모른다"는 속담이 탄생한, 세속의 번뇌와 시간의 흐름을 잊는 동양의 불로장생 성소입니다.',
        'prompt': 'Traditional East Asian Taoist celestial art of Mount Penglai floating above sea of white clouds, exquisite jade pavilion perched on floating mist island, white cranes soaring, glowing herbs of immortality, 8k.'
    },

    # Tier 19 (101..112)
    {
        'cat': 'SPACESHIP',
        'title': '『닥터 후』 타디스(TARDIS) 안쪽이 바깥보다 넓은 다차원 시간 볼텍스 콘솔 룸',
        'year': '갈리프레이 타임로드 시공간 이동 장치',
        'val': '과거, 현재, 미래 우주 전역 여행권',
        'feat': '겉보기엔 평범한 1960년대 영국 경찰 전화박스지만 문을 열고 들어가면 중앙 타임 로터가 웅웅거리며 회전하는 거대 홀이 펼쳐집니다.',
        'verd': '"안쪽이 바깥보다 넓잖아!(It\'s bigger on the inside!)"라는 감탄사가 절로 나오는 전설의 타임로드 시간 여행 펜트하우스입니다.',
        'prompt': 'Doctor Who iconic sci-fi concept art inside the TARDIS console room, glowing glass time rotor pumping in center of circular hexagonal controls, roundel-patterned walls soaring into massive interior space, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스타트렉』 행성연방 U.S.S. 엔터프라이즈 NCC-1701-D 홀로덱 10성급 럭셔리 라운지',
        'year': '2364년 갤럭시급 탐사 성간함선',
        'val': '빛보다 빠른 워프 9.6 항해 드라이브',
        'feat': '물질-에너지 변환 기술을 이용한 홀로덱에서 전 우주 어떤 행성의 자연환경도 100% 촉감과 맛까지 완벽하게 시뮬레이션합니다.',
        'verd': '피카드 함장의 "인게이지(Engage)!" 명령과 함께 우주의 미개척 영역을 탐사하는 행성연방 최고의 플래그십 라운지입니다.',
        'prompt': 'Star Trek The Next Generation interior concept art inside Ten Forward lounge on USS Enterprise-D, sweeping panoramic observation windows looking out at starfield with warp stars streaking past, sleek bar, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『인터스텔라』 쿠퍼 스테이션 토성 궤도 5만 명 거주 인공 중력 전원도시 센트럴 파크 빌라',
        'year': '중력 방정식 해결 이후 인류 신문명',
        'val': '지구 멸망을 극복한 인류 생존 궤도 거점',
        'feat': '거대한 원통형 회전 콜로니 내부에서 머리 위를 올려다보면 반대편 야구장에서 홈런 친 공이 위쪽 잔디밭으로 떨어지는 집입니다.',
        'verd': '머피의 중력 이론으로 지구인을 모두 우주로 탈출시킨, 토성의 고리가 창밖을 가득 채우는 평화로운 우주 전원주택입니다.',
        'prompt': 'Interstellar movie concept art of Cooper Station interior inside giant rotating cylinder habitat orbiting Saturn, landscape curving seamlessly overhead with upside-down farmhouses, Saturn\'s rings outside end-cap, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스페이스 오디세이 2001』 우주정거장 V 힐튼 우주 호텔 무중력 볼룸 펜트하우스',
        'year': '1968년 스탠리 큐브릭 SF 불멸의 이정표',
        'val': '지구 저궤도 회전 인공중력 호텔 체인',
        'feat': '요한 슈트라우스의 \'아름답고 푸른 도나우강\' 왈츠에 맞춰 회전하는 우주정거장 내부 올리비에 무르그의 빨간 조개 모양 의자에 앉습니다.',
        'verd': '스탠리 큐브릭 감독의 완벽주의 미학이 살아 숨 쉬는, 인류 SF 영화사상 가장 우아하고 클래식한 우주 호텔 룸입니다.',
        'prompt': 'Stanley Kubrick 2001 A Space Odyssey aesthetic interior of Space Station V Hilton reception lounge, stark curved white minimalist corridors, bright red futuristic Djinn chairs, Earth rotating outside windows, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『스타워즈』 데스스타 2 황제의 옥좌 거대한 원형 창문 너머 은하계 전투 뷰 스위트',
        'year': '엔도 전투 은하 제국의 심장부',
        'val': '카이버 크리스털 슈퍼레이저 행성 파괴 병기',
        'feat': '거대한 거미줄 모양의 원형 창문 너머로 제국 함대 스타 디스트로이어들과 반란군 함선의 터보레이저 포화를 감상하는 옥좌입니다.',
        'verd': '황제 팰퍼틴이 포스 라이트닝을 뿜어내며 은하계를 지배하려 했던, 다스 베이더의 참회가 일어난 전설의 황제 알현실입니다.',
        'prompt': 'Star Wars Return of the Jedi concept art inside Emperor Palpatine\'s throne room aboard Death Star II, iconic circular spiderweb window looking out over Endor moon and massive space battle explosions, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『헤일로』 아크(The Ark) 은하계 외곽 헤일로 제조 거대 6개 꽃잎 인공 천체 코어 룸',
        'year': '은하계 중심에서 26만 광년 외곽',
        'val': '은하계 모든 헤일로 고리 재구축 공장',
        'feat': '직경 12만 km의 거대한 6개 꽃잎 모양 금속 천체 중심부에서 헤일로 링월드가 주조되어 우주로 사출되는 장관을 지켜봅니다.',
        'verd': '마스터 치프가 코타나와 함께 인류의 모든 전쟁을 끝냈던, 선조 문명 최고의 공학적 성채 아크의 코어 펜트하우스입니다.',
        'prompt': 'Halo 3 epic sci-fi concept art inside the Foundry of The Ark (Installation 00), looking from control bridge into the glowing core where a newly forged Halo ringworld is being assembled in space, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『은하수를 여행하는 히치하이커를 위한 안내서』 우주의 끝에 있는 레스토랑(Milliways) VIP 예약석',
        'year': '시간의 끝 우주 붕괴 5분 전',
        'val': '생명, 우주, 그리고 모든 것에 대한 답: 42',
        'feat': '거대한 시간 거품 안에서 전복과 포도주를 즐기며 창밖으로 전 우주가 대폭발(Big Crunch)로 붕괴하고 멸망하는 순간을 직관합니다.',
        'verd': '식사를 주문하면 스스로 다가와 어느 부위가 가장 맛있는지 설명해 주는 소와 대화하는 황당무계한 우주 끝 펜트하우스입니다.',
        'prompt': 'Douglas Adams Hitchhiker\'s Guide whimsical sci-fi concept art inside Milliways restaurant at the end of the universe, opulent golden dining tables with silver dome platters overlooking cosmic universe exploding, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『스타크래프트』 젤나가 오만의 신전 울나르(Ulnar) 공허를 다스리는 고대 공학 알현실',
        'year': '우주 순환의 시초 젤나가의 사원',
        'val': '공허(Void)와 승천(Ascension)의 비밀',
        'feat': '별도 은하도 없는 차원 간 균열 속에 세워진 초거대 피라미드 신전에서 아몬의 공허 에너지를 정화하고 승천을 맞이합니다.',
        'verd': '테란, 프로토스, 저그 삼종족의 창조주인 젤나가가 잠들어 있는 스타크래프트 우주관의 가장 성스러운 공허 신전입니다.',
        'prompt': 'Starcraft II Legacy of the Void concept art inside Xel\'Naga temple on Ulnar, massive geometric floating stone megaliths glowing with cyan cosmic energy patterns, dark dimensional rift background, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『매스 이펙트』 섀도우 브로커 기지 폭풍 구름 뚫고 질주하는 초거대 우주선 선교 스위트',
        'year': '하갈라즈 행성 플라즈마 폭풍 대기권',
        'val': '은하계 모든 비밀 정부 정보와 기밀 데이터',
        'feat': '초속 300m 번개 폭풍이 몰아치는 대기권 상층부를 가르며 날아가는 우주선 선교에서 은하계 1,000개 행성의 비밀을 도청합니다.',
        'verd': '리아라 트소니가 은하계 최고의 정보 브로커로 즉위한, 번개와 쉴드가 충돌하며 불꽃을 튀기는 전설의 공중 기지입니다.',
        'prompt': 'Mass Effect 2 cinematic concept art of Shadow Broker\'s ship bridge, massive forward cockpit facing intense violet lightning strikes and atmospheric plasma currents on planet Hagalaz, holographic terminals, 8k.'
    },
    {
        'cat': 'SPACESHIP',
        'title': '『붕괴: 스타레일』 은하열차 아스트랄 익스프레스 객차 폼폼의 특등석 커피 라운지',
        'year': '개척의 에이언즈 아키빌리의 유산',
        'val': '은하수를 횡단하는 스타 레일(Star Rail) 무제한 승차권',
        'feat': '레트로 유럽풍 호화 열차 객차에서 귀여운 차장 폼폼이 내려주는 커피를 마시며 창밖으로 스쳐 지나가는 초신성과 은하수를 감상합니다.',
        'verd': '스텔라론의 재앙을 봉인하며 우주 수만 개 행성으로 모험을 떠나는 개척자(Trailblazer)들의 가장 안락한 은하열차 룸입니다.',
        'prompt': 'Honkai Star Rail anime aesthetic interior of Astral Express passenger coach, plush velvet armchairs, vintage polished brass fixtures, giant curved windows looking out at colorful cosmic nebulae and stars, 8k.'
    },
    {
        'cat': 'IMAGINARY_CITY',
        'title': '『원신』 리월항 천권성 응광의 비행 궁전 \'군옥각(Jade Chamber)\' 황금 집무실',
        'year': '리월 칠성 통치 시대',
        'val': '리월항의 모든 무역 계약서와 수천억 모라',
        'feat': '부유석(鳴霞石)의 힘으로 하늘 높이 떠올라 리월항 전체를 굽어보는 비취와 황금의 궁전에서 비밀 정보가 적힌 종이를 날립니다.',
        'verd': '마신 오셀의 침공에 맞서 하늘에서 떨어뜨릴 만큼 리월을 사랑했던 천권성 응광의 장엄한 공중 황금 펜트하우스입니다.',
        'prompt': 'Genshin Impact aesthetic Chinese fantasy digital art inside Ningguang\'s floating Jade Chamber, luxurious mahogany and jade filigree interior, panoramic open balcony looking down on harbor of Liyue, sunny sky, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『페이트/그랜드 오더』 제2부 올림포스 신대거신해양 지상 기신(機神) 제우스의 천공 코어 룸',
        'year': '성간도시산맥 올림포스 이문대',
        'val': '항성간 우주전함 기신 제우스의 벼락',
        'feat': '외계에서 날아온 거대 우주함선 기신(機神) 제우스의 중추 코어에서 번개 플라즈마를 다스리며 인리수복의 대원정을 관측합니다.',
        'verd': '신화와 첨단 SF 메카닉이 하나로 융합된 나스 키노코 페이트 세계관 최고의 기신 제국 정상 펜트하우스입니다.',
        'prompt': 'Fate Grand Order concept art inside Machine God Zeus core chamber in Lostbelt Olympus, fusion of classical Greek temple colonnades and gigantic glowing sci-fi starship fusion generators, arcing lightning, 8k.'
    },

    # Tier 20 (113..124)
    {
        'cat': 'MULTIVERSE',
        'title': '『마블 시네마틱 유니버스』 로키의 시간의 방 시간 직조기(Time Loom) 중심부 위그드라실 옥좌',
        'year': '신성한 시간선 너머 모든 시간의 종착지',
        'val': '수억 개의 멀티버스 타임라인의 생명 그 자체',
        'feat': '터져나가는 모든 다중우주의 시간선들을 맨손으로 붙잡아 자신의 마법으로 엮어 거대한 세계수 위그드라실을 이루고 홀로 옥좌에 앉습니다.',
        'verd': '"너희들을 위해, 우리 모두를 위해" 장엄한 목적을 완성하고 다중우주의 신으로 즉위한 로키의 불멸의 고독한 옥좌입니다.',
        'prompt': 'Marvel Loki Season 2 finale iconic concept art, Loki in golden horned horned crown sitting on obsidian throne at the center of the Multiverse, clutching glowing emerald green timeline strands woven into Yggdrasil tree, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『닥터 스트레인지 2』 비샨티의 책이 안치된 차원과 차원 사이 틈새 황금 크리스털 신전',
        'year': '멀티버스 차원의 틈새(Gap Junction)',
        'val': '모든 마법사의 소원을 이루어주는 비샨티의 책',
        'feat': '다중우주들이 모자이크처럼 떠다니는 무중력 차원의 틈새 중심부 순백의 크리스털 기둥 위에 안치된 성스러운 책을 마주합니다.',
        'verd': '다크홀드의 흑마법을 정화하고 우주의 균형을 되찾을 수 있는 유일한 진리의 빛이 쏟아지는 차원 간 신전입니다.',
        'prompt': 'Doctor Strange in the Multiverse of Madness concept art inside the Gap Junction between dimensions, floating golden crystal temple suspended in cosmic void reflecting infinite parallel Earths, Book of Vishanti, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『드래곤볼 슈퍼』 전왕(全王)의 궁전 우주 12개가 내려다보이는 해파리 모양 무한 옥좌',
        'year': '전 우주의 창조와 파멸을 다스리는 절대자',
        'val': '12개 우주의 존속과 소멸 결정권',
        'feat': '기둥 위에 12개 우주가 포도알처럼 떠 있는 해파리 모양의 보라색 궁전 바닥에서 전왕과 함께 손오공의 버튼을 누르며 놉니다.',
        'verd': '"지워버린다?"라는 귀여운 한마디에 우주 몇 개가 즉시 사라지는 드래곤볼 세계관 최강 절대자의 궁극 옥좌입니다.',
        'prompt': 'Dragon Ball Super anime concept art inside Grand Zeno\'s palace, colossal minimalist purple and golden floating pillars, 12 swirling universes floating like glowing marbles in mid-air, cosmic floor reflecting eternity, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『인터스텔라』 5차원 존재들의 4차원 초입방체 테서랙트(Tesseract) 과거와 미래 연결 룸',
        'year': '블랙홀 가르강튀아 특이점 내부',
        'val': '시간을 물리적 차원으로 건너뛰는 5차원의 사랑',
        'feat': '무한히 뻗어있는 딸 머피의 방 서재 책장들이 4차원 격자로 얽혀있어 중력을 이용해 시곗바늘로 모스 부호를 전달합니다.',
        'verd': '"사랑은 시공간을 초월하는 유일한 것"임을 증명한 크리스토퍼 놀란 감독의 위대한 5차원 테서랙트 펜트하우스입니다.',
        'prompt': 'Interstellar movie masterpiece concept art inside the 5-dimensional Tesseract inside Gargantua, infinite cross-hatching grid of Murph\'s bedroom bookshelves extending into multi-dimensional infinity, dust motes, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『스파이더맨: 어크로스 더 유니버스』 미겔 오하라의 누에바 요크 차원 관제 멀티버스 본부 스카이 덱',
        'year': '지구-928 미래 도시 누에바 요크',
        'val': '수천 명의 스파이더 소사이어티 차원 이동 시계',
        'feat': '오렌지빛 차원 포털이 수백 개씩 열리는 미래 도시 상공에서 미겔 오하라와 함께 공식 설정 사건(Canon Event)을 모니터링합니다.',
        'verd': '멀티버스의 붕괴를 막기 위해 차원 시계를 차고 수천 명의 스파이더맨들이 웹스윙을 펼치는 차원 관제 센터입니다.',
        'prompt': 'Spider-Man Across the Spider-Verse dynamic concept art at Spider Society headquarters in Nueva York, towering neo-futuristic platforms with glowing orange hexagonal holographic portals, hundreds of Spider-heroes, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『천원돌파 그렌라간』 초은하 다이그렌 천원돌파 무한 나선 우주 은하를 발판 삼는 코어 룸',
        'year': '안티 스파이럴과의 최종 결전',
        'val': '인간의 가능성과 무한한 나선력(Spiral Power)',
        'feat': '은하계 전체를 하나의 발판처럼 밟고 서 있는 수십억 광년 크기의 거대 메카 중심부에서 시몬과 함께 드릴을 하늘로 치켜듭니다.',
        'verd': '"나를 누구라고 생각하느냐!"를 외치며 우주의 법칙마저 주먹으로 뚫어버리는 열혈 나선력의 궁극 코어 하우스입니다.',
        'prompt': 'Tengen Toppa Gurren Lagann cosmic concept art inside Chouginga Dai-Gurren core, blazing green Spiral energy vortex illuminating pilot seat, looking out at galaxies swirling beneath giant mecha feet like pebbles, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『에반게리온: 다카포』 골고다 오브젝트 모든 평행세계의 기억이 교차하는 마이너스 우주 신전',
        'year': '신 에반게리온 극장판 인류보완계획 종결',
        'val': '네온 제네시스(새로운 창세기) 창조의 권능',
        'feat': '물질도 시간도 존재하지 않는 마이너스 우주 한가운데서 모든 기억과 평행세계의 에반게리온들이 무한히 교차하는 십자가 신전입니다.',
        'verd': '"안녕, 모든 에반게리온"을 고하며 저주받은 에바의 굴레를 끊고 현실로 나아가는 안노 히데아키의 최후의 안식처입니다.',
        'prompt': 'Evangelion 3.0+1.0 Thrice Upon a Time surreal concept art inside Golgotha Object in Anti-Universe, infinite black void intersecting with shimmering rainbow grid lines, colossal black cross floating in geometric space, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『마블 코믹스』 리빙 트리뷰널의 심판의 전당 멀티버스 균형을 관장하는 삼면 얼굴 룸',
        'year': '전지전능 원 어보브 올(TOAA)의 대행자',
        'val': '전능한 인피니티 건틀렛조차 무력화하는 절대 심판',
        'feat': '공평, 필연, 복수를 상징하는 세 개의 거대한 가려진 황금 얼굴 아래서 전 멀티버스의 존속과 소멸을 판결하는 법정 테라스입니다.',
        'verd': '마블 멀티버스에서 신적인 존재들도 무릎 꿇어야 하는 절대 심판자 리빙 트리뷰널의 전지전능한 알현실입니다.',
        'prompt': 'Marvel Comics cosmic concept art inside The Living Tribunal\'s Judgment Hall, colossal golden entity with three hooded faces hovering in deep cosmic starfield, glowing scales of cosmic balance, floating marble platform, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『DC 코믹스』 메트론의 모비우스 의자 우주의 모든 지식이 흐르는 암흑 에너지 옥좌',
        'year': '뉴 가즈(New Gods) 제4세계 지식의 탐구',
        'val': '우주의 모든 과거, 현재, 미래의 진실',
        'feat': '모비우스 의자에 앉는 순간 우주에 존재하는 모든 존재의 이름과 비밀, 그리고 반생명 방정식(Anti-Life Equation)의 답을 얻습니다.',
        'verd': '앉는 자에게 전지(全知)의 권능을 부여하는 차원 이동 옥좌 위에서 시공간을 자유자재로 유영하는 코스믹 체어입니다.',
        'prompt': 'DC Comics New Gods concept art of the Mobius Chair, futuristic hovering throne made of sleek dark alien metal with pulsing blue circuitry, energy crackles, cosmic knowledge data streams swirling in background, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『원펀맨』 신(GOD)의 차원 달 표면 크레이터 너머로 현현하는 목성 소용돌이 성채',
        'year': '괴인화와 홈리스 황제에게 힘을 부여한 절대자',
        'val': '인류 문명을 멸망시킬 신의 신통력',
        'feat': '달 뒷면 크레이터 뒤에서 웅크리고 있던 거대한 신의 형상이 목성의 대적점 소용돌이 너머 차원에서 모습을 드러내는 성채입니다.',
        'verd': '가로우에게 우주적 힘을 하사했던 코스믹 호러의 정점, 차원의 경계를 부수고 서 있는 침묵의 신의 영역입니다.',
        'prompt': 'One Punch Man manga aesthetic cosmic horror digital art, surface of Earth\'s moon looking out into black void where a gargantuan starry silhouette of GOD looms over the red swirling eye of Jupiter, 8k.'
    },
    {
        'cat': 'ROYAL_PALACE',
        'title': '『블리치』 영왕궁 효스베 이치베이의 영번리 선경(仙境) 공중 부유 도시 최상층',
        'year': '삼계(인간계·소울소사이어티·웨코문도)의 쐐기',
        'val': '세계의 균형을 유지하는 영왕의 신체 부위들',
        'feat': '영왕 대내전 주위를 나선형으로 공중 부유하는 5개의 영번리 도시 꼭대기에서 온천과 수련을 거치며 영압의 한계를 초월합니다.',
        'verd': '우주 삼계를 떠받치는 쐐기이자 사신의 정점에 선 0번대만이 머무를 수 있는 성스러운 영왕궁 스위트입니다.',
        'prompt': 'Bleach anime grand concept art of Soul King Palace (Reiokyu), floating spherical islands in crystal clear sky, giant stone circular gate, floating white pavilions with cascading spiritual water, cherry blossoms, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『나루토』 오오츠츠키 카구야의 시공간 포털 시원의 이공간 중력 피라미드 신전',
        'year': '차크라의 시조 오오츠츠키 일족',
        'val': '모든 차크라의 기원과 무한 츠쿠요미',
        'feat': '초중력 공간, 용암 공간, 빙설 공간, 사막 공간을 마음대로 전환하는 카구야의 시원 이공간 중심부 피라미드 신전입니다.',
        'verd': '차크라의 모든 시작이자 끝인 토끼 여신 카구야가 차원을 손바닥 뒤집듯 바꾸던 시공간의 원천 룸입니다.',
        'prompt': 'Naruto Shippuden concept art inside Kaguya Otsutsuki\'s core dimension, monolithic obsidian pyramid floating in zero gravity between swirling dimensional portals of lava, ice, and hyper-gravity, 8k.'
    },
    {
        'cat': 'MULTIVERSE',
        'title': '『다중우주 신화』 아카식 레코드(Akashic Records) 모든 차원과 평행우주의 역사가 기록된 무한 크리스털 도서관 마스터 스위트',
        'year': '빅뱅 이전 영겁의 아카샤',
        'val': '존재하는 모든 우주의 지혜와 영혼의 기록',
        'feat': '수십억 광년 높이로 솟아오른 투명한 에테르 크리스털 서가에 모든 생명체의 과거, 현재, 미래가 황금빛 글씨로 적혀있는 전지전능 도서관입니다.',
        'verd': 'Lv.997에 등극한 위대한 탐험가가 모든 차원의 진리를 한눈에 읽으며 영원한 우주의 지혜를 소유하는 최고의 지적 펜트하우스입니다.',
        'prompt': 'Supreme cosmic concept art of Akashic Records library, infinite soaring crystalline bookshelves extending into infinite cosmic nebula, ethereal golden glowing codexes floating in midair, marble observation floor, 8k.'
    }
])
print(f"FIC GOOD Total loaded: {len(RAW_FIC_GOOD)} items")
