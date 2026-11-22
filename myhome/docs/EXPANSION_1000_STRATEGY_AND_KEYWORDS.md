# 500 -> 1,000단계 다중우주 하우스 확장 전략 및 유튜브/구글 오지·기이건축 키워드 가이드북

> **문서 상태**: 공식 확정 아키텍처 가이드 (Accepted & Authoritative)  
> **프로젝트**: `myhome` (myhome.tellmyname.app)  
> **관련 이슈**: GitHub Issue #17  
> **관련 ADR**: `docs/adr/ADR-008-1000-level-expansion-and-renumbering.md`  
> **대상 데이터셋**: `data/chunks/houses-chunk-00.json` ~ `houses-chunk-19.json` 및 `G:\My Drive\new_houses`  

---

## 목차
1. [1,000단계(`Lv.0 ~ Lv.999`) 확장 구조 총괄 개요](#1-1000단계lv0--lv999-확장-구조-총괄-개요)
   - 1.1 폭망(BAD 500종) vs 대박(GOOD 500종) 50:50 황금 균형
   - 1.2 짝수(REAL 500종) vs 홀수(FICTION 500종) 패리티 100% 보존 원칙
   - 1.3 20개 티어 × 티어당 50레벨 맵핑 명세표
2. [12대 카테고리별 유튜브 & 구글 검색 키워드 공략 전략](#2-12대-카테고리별-유튜브--구글-검색-키워드-공략-전략)
   - 2.1 EXTREME_NATURE (극한 오지·화산·심해·빙하)
   - 2.2 WEIRD_ARCH (세계의 기이한 실제 건축물·랜드마크)
   - 2.3 MUSEUM_PUBLIC (이색 박물관·교도소·지하벙커·공공건물)
   - 2.4 TOILET (세계의 신기한 화장실·위생시설·목욕탕)
   - 2.5 CLOSET (옷장·가구·코인사물함·비밀방)
   - 2.6 DOGHOUSE (개집·동물 서식지·생태 돔·황제펭귄 군락)
   - 2.7 BOX (종이상자·택배박스·용기·모듈러 하우스)
   - 2.8 VEHICLE (폐차·기차·잠수함·슈퍼요트·전용기)
   - 2.9 SPACESHIP (우주정거장·달기지·화성 거주구·스타쉽)
   - 2.10 FICTION_MEDIA (영화·애니·소설·게임 속 명소 vs 최악의 장소)
   - 2.11 IMAGINARY_CITY (디스토피아 지하도시 vs 유토피아 공중도시)
   - 2.12 MULTIVERSE (4차원 미궁·블랙홀 vs 다중우주 신전·다이슨 스피어)
3. [레벨 재조정 수식 및 `G:\My Drive\new_houses` 안전 리넘버링 전략](#3-레벨-재조정-수식-및-gmy-drivenew_houses-안전-리넘버링-전략)
   - 3.1 페어 보존 리넘버링 수식 (Pairwise Mapping Formula)
   - 3.2 단계별 파일명 매핑 대조표 (Before & After Sample)
   - 3.3 덮어쓰기 충돌 0% 보장: 역순(Descending 499 -> 0) 이름 변경 알고리즘 (Step 2.1)
   - 3.4 신규 500개 프롬프트 텍스트(`{padded}.txt`) 자동 생성 파이프라인 (Step 2.2)

---

## 1. 1,000단계(`Lv.0 ~ Lv.999`) 확장 구조 총괄 개요

기존 500단계(`Lv.0 ~ Lv.499`) 시스템에서 글로벌 사용자의 체류 시간 및 탐색 몰입도를 극대화하기 위해, 총 **1,000단계(`Lv.0 ~ Lv.999`)** 체제로 전면 확장합니다.

```
[ 기존 500단계 구조 ]
Lv.0  ─────────────────── Lv.249 │ Lv.250 ─────────────────── Lv.499
  BAD (폭망 하우스 250종)         │   GOOD (대박 하우스 250종)
  - 짝수: REAL (125종)           │   - 짝수: REAL (125종)
  - 홀수: FICTION (125종)        │   - 홀수: FICTION (125종)

                             ▼ 2배 확장 (각 구역 +250종)

[ 신규 1,000단계 확장 구조 ]
Lv.0  ─────────────────── Lv.499 │ Lv.500 ─────────────────── Lv.999
  BAD (폭망 하우스 500종)         │   GOOD (대박 하우스 500종)
  (기존 250종 + 신규 250종)       │   (기존 250종 + 신규 250종)
  - 짝수(Even): REAL (250종)      │   - 짝수(Even): REAL (250종)
  - 홀수(Odd) : FICTION (250종)   │   - 홀수(Odd) : FICTION (250종)
```

### 1.1 폭망(BAD 500종) vs 대박(GOOD 500종) 50:50 황금 균형
- **폭망 구역 (BAD Zone: `Lv.0 ~ Lv.499`, 총 500종)**:
  - 전 세계 유튜브와 다큐멘터리에서 화제가 된 극한의 오지, 열악한 거주 공간, 기상천외한 슬럼가, 영화 속 악명 높은 감옥 등 250개 신규 소재를 대거 확충.
- **대박 구역 (GOOD Zone: `Lv.500 ~ Lv.999`, 총 500종)**:
  - 세계 부호들의 기괴하고 호화로운 랜드마크 맨션, 자연 절경 속 프라이빗 리트릿, SF 궤도 펜트하우스, 다중우주 창조주 궁전 등 250개 신규 하이엔드 소재 확충.

### 1.2 짝수(REAL 500종) vs 홀수(FICTION 500종) 패리티 100% 보존 원칙
- **짝수 단계 (`lv % 2 === 0`)**: 실존하는 건축물·장소·실제 물건 (`realityType: "REAL"`). 위키미디어 공용 / Flickr CC 저작권 고화질 대표 실사 사진을 매핑.
- **홀수 단계 (`lv % 2 === 1`)**: 영화·소설·애니·게임·신화·SF 가상 공간 (`realityType: "FICTION"`). 고품질 AI 생성 일러스트를 매핑.
- 리넘버링 이후에도 모든 짝수는 REAL, 모든 홀수는 FICTION으로 100% 일치합니다.

### 1.3 20개 티어 × 티어당 50레벨 맵핑 명세표
각 청크 파일(`data/chunks/houses-chunk-00.json` ~ `houses-chunk-19.json`)이 정확히 50개 레벨을 담당하도록 설계되었습니다.

| 청크 파일명 | 티어 번호 | 티어 명칭 | 레벨 범위 | 구역 | 핵심 테마 |
|:---|:---:|:---|:---:|:---:|:---|
| `houses-chunk-00.json` | Tier 01 | 태초의 밑바닥 | Lv.000 ~ Lv.049 | BAD | 화산 유황지대, 지구 맨틀, 극한 오지 화장실, 고물 기계 |
| `houses-chunk-01.json` | Tier 02 | 폐허와 슬럼가 | Lv.050 ~ Lv.099 | BAD | 슬럼가 골목, 버려진 공장, 지하 카타콤, 계단 밑 벽장 |
| `houses-chunk-02.json` | Tier 03 | 기괴한 고물과 상자 | Lv.100 ~ Lv.149 | BAD | 골판지 상자, 고장 난 자판기, 고물 트럭 짐칸, 녹슨 컨테이너 |
| `houses-chunk-03.json` | Tier 04 | 극한 오지 변소와 방사능 | Lv.150 ~ Lv.199 | BAD | 체르노빌 관람차, 에베레스트 변소, 방사능 호수, 하수관로 |
| `houses-chunk-04.json` | Tier 05 | 폐쇄 구역과 감옥 | Lv.200 ~ Lv.249 | BAD | 아즈카반 독방, 교도소 독방, 버려진 정신병원, 폐광 갱도 |
| `houses-chunk-05.json` | Tier 06 | 애니·영화 속 굴욕의 거처 | Lv.250 ~ Lv.299 | BAD | 코끼리 무덤 해골, 장난감 고문실, 하수도 쥐구멍, 오물 수거함 |
| `houses-chunk-06.json` | Tier 07 | 위험천만 이동식 쉘터 | Lv.300 ~ Lv.349 | BAD | 화물열차 배관실, 흔들리는 닭장, 침수된 오리배, 조난 뗏목 |
| `houses-chunk-07.json` | Tier 08 | 늪지대와 침수 구역 | Lv.350 ~ Lv.399 | BAD | 슈렉 늪지대, 갠지스 화장터, 톤레삽 우기 수상가옥, 침수 계단 |
| `houses-chunk-08.json` | Tier 09 | 고립된 사막과 얼음 굴 | Lv.400 ~ Lv.449 | BAD | 다나킬 사막 움막, 혹한기 빙하 크레바스, 소금사막 찢어진 파라솔 |
| `houses-chunk-09.json` | Tier 10 | 폭망의 문턱 턱걸이 | Lv.450 ~ Lv.499 | BAD | 0.3평 만화카페, 1평 고시원 단칸방, 만조 때 잠기는 갯벌 평상 |
| `houses-chunk-10.json` | Tier 11 | 대박 입문 힐링 샬레 | Lv.500 ~ Lv.549 | GOOD | 지열 온천 빌라, 빙하 호수 샬레, 바오밥 공중 트리하우스 |
| `houses-chunk-11.json` | Tier 12 | 세계 역사 고성과 랜드마크 | Lv.550 ~ Lv.599 | GOOD | 몽생미셸 수도원, 노이슈반슈타인 성, 알람브라 궁전, 피사 사탑 |
| `houses-chunk-12.json` | Tier 13 | 픽사·디즈니 애니메이션 명소 | Lv.600 ~ Lv.649 | GOOD | 엘사의 얼음 궁전, UP 풍선 하우스, 야수의 서재, 앤디의 장난감 방 |
| `houses-chunk-13.json` | Tier 14 | 세계 초일류 도심 펜트하우스 | Lv.650 ~ Lv.699 | GOOD | 에펠탑 최상층 아파트, 부르즈 할리파 아틀리에, 마리나베이샌즈 스카이 |
| `houses-chunk-14.json` | Tier 15 | 판타지 영화와 문학의 성채 | Lv.700 ~ Lv.749 | GOOD | 호그와트 기숙사, 리벤델 요정 테라스, 호빗골 백엔드 언덕집 |
| `houses-chunk-15.json` | Tier 16 | 세계 7대 불가사의와 비경 | Lv.750 ~ Lv.799 | GOOD | 우유니 소금거울 돔, 그랜드 캐니언 스카이워크, 마추픽추 절벽 |
| `houses-chunk-16.json` | Tier 17 | 미래 스마트 도시와 슈퍼요트 | Lv.800 ~ Lv.849 | GOOD | 나이트시티 펜트하우스, 스타크 인터내셔널 맨션, 기가 요트 스위트 |
| `houses-chunk-17.json` | Tier 18 | 신화와 전설의 황금 궁전 | Lv.850 ~ Lv.899 | GOOD | 올림포스 제우스 신전, 발할라 전사들의 연회장, 아틀란티스 해저 궁전 |
| `houses-chunk-18.json` | Tier 19 | SF 궤도 스테이션과 콜로니 | Lv.900 ~ Lv.949 | GOOD | 쿠퍼 스테이션 원통도시, 제임스 웹 L2 관측소 돔, 달 기지 스카이빌라 |
| `houses-chunk-19.json` | Tier 20 | 우주 초월 다이슨 스피어 | Lv.950 ~ Lv.999 | GOOD | 다이슨 스피어 링 월드, 안드로메다 웜홀 허브, 옴니버스 창조주 펜트하우스 |

---

## 2. 12대 카테고리별 유튜브 & 구글 검색 키워드 공략 전략

실제 유튜브 채널(빠니보틀, 곽튜브, 진용진, 지식해적단, Drew Binsky, Yes Theory, MrBeast, Enes Yilmazer, Architectural Digest, Kirsten Dirksen, Exploring Alternatives, National Geographic 등)의 인기 클립 및 다큐멘터리 소재를 12개 카테고리별로 정밀하게 검색·추출합니다.

---

### 2.1 EXTREME_NATURE (극한 오지·화산·심해·빙하) 🪨
- **핵심 레퍼런스 채널**: 빠니보틀 Pani Bottle, 곽튜브 Kwaktube, Drew Binsky, Yes Theory, National Geographic, BBC Earth
- **BAD (폭망 오지)**:
  - **한국어 검색어**: `"세계에서 가장 살기 힘든 오지 유튜브"`, `"영하 70도 야쿠츠크 텐트 생활"`, `"다나킬 소금사막 유황 캠프"`, `"다리엔 갭 정글 판잣집"`, `"오이먀콘 야외 푸세식 화장실"`, `"부베 섬 절벽 위 고립 기지"`, `"볼리비아 죽음의 도로 낭떠러지 판잣집"`
  - **영어 검색어**: `"world's most inhospitable places to live"`, `"Yakutsk -71C winter tent survival"`, `"Danakil Depression sulfur camp extreme heat"`, `"Darien Gap swamp shack refugee route"`, `"Bouvet Island cliff ledge shelter"`, `"Oymyakon frozen outhouse -60C"`, `"Death Road Bolivia cliff shack"`
  - **대표 장소**: 시베리아 오이먀콘 영하 60도 야외 텐트, 에티오피아 다나킬 분지 50도 유황 가스 움막, 남태평양 부베 섬 만년설 절벽 끝 대피소, 파나마-콜롬비아 다리엔 갭 진흙 늪지대 임시 쉘터.
- **GOOD (대박 비경)**:
  - **한국어 검색어**: `"세계 최고 억만장자 자연 벙커"`, `"절벽 통유리 맨션 유튜브"`, `"스위스 알프스 빙하 샬레"`, `"몰디브 해저 럭셔리 빌라 콘래드 무라카"`, `"아이슬란드 오로라 이글루 호텔"`, `"돌로미티 산꼭대기 유리 캐빈"`
  - **영어 검색어**: `"billionaire cliffside mansion Enes Yilmazer"`, `"underwater luxury villa Maldives Conrad Muraka"`, `"Swiss Alps private glacier chalet tour"`, `"Iceland aurora glass dome luxury igloo"`, `"New Zealand fjord private architectural retreat"`, `"Dolomites mountaintop glass cabin"`
  - **대표 장소**: 몰디브 무라카 해저 5미터 마스터 스위트, 스위스 체르마트 마테호른 뷰 프라이빗 글래시어 샬레, 아이슬란드 레이캬비크 오로라 360도 글래스 이글루.

---

### 2.2 WEIRD_ARCH (세계의 기이한 실제 건축물·랜드마크) 🏰
- **핵심 레퍼런스 채널**: Architectural Digest (AD), Kirsten Dirksen, Never Too Small, Enes Yilmazer, B1M, 지식해적단
- **BAD (폭망 기이건축)**:
  - **한국어 검색어**: `"세상에서 가장 기괴한 집"`, `"세계에서 가장 좁은 집 유튜버"`, `"구룡성채 극소 닭장집"`, `"기울어지는 탑 지하 보일러실"`, `"망셀 요새 버려진 해상 녹슨 요새"`, `"폴란드 케렛 하우스 좁은 틈새 집"`, `"체코 뼈의 교회 납골당 거주지"`, `"홍콩 관짝방 케이지 홈"`
  - **영어 검색어**: `"world's skinniest house Keret House tour"`, `"Kowloon Walled City micro cage room"`, `"abandoned Soviet sea fort Maunsell Forts"`, `"leaning tower unstable boiler room"`, `"Sedlec Ossuary crypt living space"`, `"Chongqing monorail building underside room"`, `"Hong Kong coffin cubicles documentary"`
  - **대표 장소**: 폴란드 바르샤바 케렛 하우스(폭 92cm 틈새 집), 영국 템스강 하구 제2차 대전 망셀 해상 녹슨 요새, 체코 세들레츠 납골당 해골 전시장 지하 관리실, 홍콩 삼수이포 0.5평 와이어 케이지 침상.
- **GOOD (대박 명작건축)**:
  - **한국어 검색어**: `"세계에서 가장 비싼 기이한 저택"`, `"피에르 가르뎅 버블 팰리스 투어"`, `"낙수장 프랭크 로이드 라이트 저택"`, `"네옴시티 더 라인 거울 펜트하우스"`, `"아만기리 사막 바위 스위트룸"`, `"스페인 가우디 카사 바트요 마스터 베드룸"`, `"몬트리올 해비타트 67 레고 큐브"`
  - **영어 검색어**: `"Architectural Digest most unique homes in the world"`, `"Pierre Cardin Bubble Palace Palais Bulles tour"`, `"Fallingwater Frank Lloyd Wright private residence"`, `"Neom The Line mirror penthouse architecture"`, `"Amangiri desert rock luxury suite"`, `"Antilia Mumbai Ambani private skyscraper"`, `"Habitat 67 Montreal iconic brutalist apartment"`
  - **대표 장소**: 프랑스 칸 피에르 가르뎅 버블 팰리스(Palais Bulles), 미국 펜실베이니아 프랭크 로이드 라이트 낙수장(Fallingwater), 미국 유타주 아만기리 리조트 사막 암벽 스위트룸, 인도 뭄바이 무케시 암바니 안틸리아 27층 저택.

---

### 2.3 MUSEUM_PUBLIC (이색 박물관·교도소·지하벙커·공공건물) 🏛️
- **핵심 레퍼런스 채널**: Dark Tourist, The Proper People, Shiey, Exploring With Josh, 빠니보틀, 곽튜브, 진용진
- **BAD (폭망 폐쇄공간)**:
  - **한국어 검색어**: `"세계 최악의 교도소 감방 투어"`, `"알카트라즈 독방 체험"`, `"폐쇄된 지하 방공호 습기 가득한 방"`, `"버려진 정신병원 격리실"`, `"볼리비아 산페드로 교도소 패밀리 셀"`, `"러시아 흑돌고래 교도소 복도 끝 방"`, `"냉전시대 폐쇄 레이더 기지 지하 벙커"`
  - **영어 검색어**: `"world's worst prison cell Black Dolphin"`, `"Alcatraz solitary confinement D block"`, `"abandoned psychiatric hospital padded cell"`, `"San Pedro prison Bolivia inmate cell"`, `"cold war nuclear fallout bunker damp room"`, `"abandoned Soviet radar station subterranean bunker"`
  - **대표 장소**: 러시아 오렌부르크 흑돌고래 교도소 삼중 철창 독방, 볼리비아 라파스 산페드로 무법 교도소 젖은 타일 바닥, 냉전 시대 지하 50미터 폐기 방공호 녹물 배관실.
- **GOOD (대박 문화궁전)**:
  - **한국어 검색어**: `"세계 최고 박물관 VIP 스위트룸"`, `"루브르 박물관 모나리자 앞 하룻밤"`, `"초호화 개조 은행 대형 금고 스위트룸"`, `"스위스 지하 핵벙커 초호화 데이터센터 펜트하우스"`, `"대영박물관 돔 천장 프라이빗 서재"`, `"구겐하임 미술관 나선형 VIP 레지던스"`
  - **영어 검색어**: `"Louvre museum private VIP night stay"`, `"luxury historic bank vault converted suite"`, `"Swiss Alps nuclear bunker transformed luxury penthouse"`, `"Guggenheim Museum spiral private penthouse"`, `"Smithsonian private curator suite after hours"`
  - **대표 장소**: 파리 루브르 박물관 유리 피라미드 아래 VIP 전용 살롱, 스위스 알프스 지하 요새를 개조한 델타 데이터센터 억만장자 벙커 빌라, 월스트리트 옛 연방준비은행 100톤 방탄 금고 개조 프라이빗 스위트.

---

### 2.4 TOILET (세계의 신기한 화장실·위생시설·목욕탕) 🚽
- **핵심 레퍼런스 채널**: 진용진, MrBeast, 빠니보틀, World's Weirdest Homes, Great Big Story
- **BAD (폭망 위생악몽)**:
  - **한국어 검색어**: `"인도 기차 재래식 낙하 분변 화장실"`, `"시베리아 얼어붙은 푸세식 공중변소"`, `"중국 칸막이 없는 개방형 도로변 변소"`, `"파리 지하철 환풍구 위 악취 화장실"`, `"침수된 정화조 위 판자 거치대"`
  - **영어 검색어**: `"world's worst public toilet open trench"`, `"Siberian frozen outhouse -50C drop toilet"`, `"Indian railway open hopper toilet sleeper car"`, `"flooded sewer septic tank wooden plank shelter"`, `"open street urinal living space"`
  - **대표 장소**: 인도 철도 재래식 선로 직하강 화장실 칸, 시베리아 콜리마 고속도로 영하 50도 고드름 푸세식 변소, 중국 시골 도로변 벽 없는 오픈형 콘크리트 도랑 변소.
- **GOOD (대박 황금욕실)**:
  - **한국어 검색어**: `"세계에서 가장 비싼 순금 변기 욕실"`, `"홍콩 항풍골드 황금 화장실 스위트룸"`, `"두바이 버즈 알 아랍 24K 금장 자쿠지"`, `"스위스 알프스 통유리 뷰 파노라마 욕실"`, `"도쿄 팀랩 인터랙티브 디지털 목욕탕"`
  - **영어 검색어**: `"world's most expensive solid gold toilet suite"`, `"Hong Kong Hang Fung Gold Technology gold bathroom"`, `"Burj Al Arab royal suite 24k gold jacuzzi"`, `"panoramic glass bathroom Swiss Alps cliff"`, `"luxury thermal onsen private ryokan master bath"`
  - **대표 장소**: 홍콩 항풍골드 순금 24K 보석 변기 룸, 두바이 버즈 알 아랍 로열 스위트 금박 대리석 자쿠지, 스위스 체르마트 깎아지른 절벽 끝 통유리 마그네슘 온천탕.

---

### 2.5 CLOSET (옷장·가구·코인사물함·비밀방) 🚪
- **핵심 레퍼런스 채널**: Kirsten Dirksen, Never Too Small, BuzzFeed Video, Living Big In A Tiny House
- **BAD (폭망 폐쇄공포)**:
  - **한국어 검색어**: `"도쿄 0.5평 코인락커 거주자"`, `"해리포터 계단 밑 벽장 현실판"`, `"이케아 옷장 개조 불법 거주지"`, `"환기 안 되는 이불장 틈새방"`, `"버려진 녹슨 철제 캐비닛 침실"`
  - **영어 검색어**: `"Tokyo micro coin locker bedroom 1sqm"`, `"real life cupboard under the stairs Harry Potter"`, `"Ikea PAX wardrobe stealth camper living"`, `"ventilated rusted gym locker room sleeping cot"`, `"subway station utility closet living space"`
  - **대표 장소**: 도쿄 신주쿠역 뒤편 대형 코인 락커 내부 0.4평 공간, 런던 낡은 연립주택 계단 아래 먼지 쌓인 0.6평 벽장, 폐체육관 녹슨 락커룸 사물함 사이 간이 매트리스.
- **GOOD (대박 비밀의 방)**:
  - **한국어 검색어**: `"나니아 연대기 옷장 속 비밀 왕국"`, `"킹스맨 양복점 비밀 무기고 드레스룸"`, `"헐리우드 스타 3층 워크인 클로젯"`, `"스마트 회전식 럭셔리 워드로브 펜트하우스"`, `"에르메스 가죽 마감 하이엔드 드레스룸"`
  - **영어 검색어**: `"Narnia wardrobe magical forest entrance room"`, `"Kingsman secret tailor shop armory room"`, `"celebrity 3-story walk-in closet Architectural Digest"`, `"billionaire automated revolving luxury wardrobe suite"`, `"Hermes custom leather-paneled secret lounge"`
  - **대표 장소**: 킹스맨 헌츠맨 테일러 숍 거울 뒤 비밀 무기고 라운지, 베벌리힐스 맨션 3층 복층 구조 스마트 컨베이어 드레스룸, 나니아 연대기 마법의 삼나무 옷장 너머 눈 덮인 숲길 테라스.

---

### 2.6 DOGHOUSE (개집·동물 서식지·생태 돔·황제펭귄 군락) 🐶
- **핵심 레퍼런스 채널**: The Dodo, Supercar Blondie, BBC Planet Earth, YouTube Pet Luxury Channel
- **BAD (폭망 동물우리)**:
  - **한국어 검색어**: `"녹슨 쇠사슬 묶인 야외 뜬장"`, `"비둘기 배설물 가득한 옥상 닭장"`, `"하수도 쥐 소굴 옆 박스 개집"`, `"버려진 곰 우리 쇠창살 침대"`, `"유기견 보호소 젖은 콘크리트 견사"`
  - **영어 검색어**: `"rusted wire puppy mill cage dwelling"`, `"pigeon feces infested rooftop coop shelter"`, `"subway sewer rat colony nesting spot"`, `"abandoned rusty zoo bear cage bunk"`, `"flooded outdoor dog shelter pen"`
  - **대표 장소**: 시골 농가 녹슨 철망 뜬장, 도심 옥상 비둘기 배설물 가득한 닭장 판잣집, 버려진 폐동물원 녹슨 곰 우리 쇠창살 침상.
- **GOOD (대박 펫팰리스)**:
  - **한국어 검색어**: `"1억 원짜리 에어컨 나오는 명품 개집"`, `"파리스 힐튼 2층 애견 전용 럭셔리 빌라"`, `"두바이 왕자 매 전용 에어컨 궁전"`, `"황제 펭귄 5성급 극지 생태 돔"`, `"고양이 전용 4층 캣타워 캐슬"`
  - **영어 검색어**: `"Paris Hilton luxury two-story dog mansion"`, `"100k air-conditioned high-tech dog villa"`, `"Dubai prince falcon luxury air-conditioned aviary"`, `"five-star biodome Antarctic emperor penguin sanctuary"`, `"multi-level luxury cat tree architectural fortress"`
  - **대표 장소**: 파리스 힐튼의 스페인식 기와지붕 2층 에어컨 애견 전용 맨션, 아랍에미리트 왕실 귀빈 매(Falcon) 전용 대리석 항온항습 궁전, 남극 맥머도 기지 옆 황제펭귄 극지 생태 바이오돔 VIP 라운지.

---

### 2.7 BOX (종이상자·택배박스·용기·모듈러 하우스) 📦
- **핵심 레퍼런스 채널**: Exploring Alternatives, Living Big In A Tiny House, MrBeast, Never Too Small
- **BAD (폭망 박스)**:
  - **한국어 검색어**: `"비에 젖은 라면 박스 노숙 텐트"`, `"냉장고 박스 테이프 누더기 집"`, `"물류센터 파손된 스티로폼 상자"`, `"버려진 녹슨 선적 컨테이너 구석"`, `"썩은 사과나무 궤짝 은신처"`
  - **영어 검색어**: `"rain-soaked cardboard ramen box homeless shelter"`, `"refrigerator cardboard box taped together home"`, `"broken styrofoam cooler box shelter"`, `"rusted abandoned shipping container dark corner"`, `"rotting wooden apple crate hideout"`
  - **대표 장소**: 비에 젖어 찌그러진 오뚜기 라면 골판지 상자, 청계천 다리 밑 테이프로 이어 붙인 냉장고 포장 박스, 부두에 방치된 녹슨 해상 컨테이너의 칠흑 같은 구석자리.
- **GOOD (대박 모듈러 큐브)**:
  - **한국어 검색어**: `"애플 스타일 미니멀 통유리 큐브 빌라"`, `"초호화 모듈러 글래스 하우스 펜트하우스"`, `"다이아몬드 커팅 크리스탈 큐브 파빌리온"`, `"우주항공 티타늄 모듈러 스마트 홈"`, `"전망대 일체형 360도 큐브 레지던스"`
  - **영어 검색어**: `"Apple flagship style minimalist glass cube villa"`, `"ultra-luxury prefab modular glass pavilion"`, `"diamond-cut architectural crystal cube home"`, `"aerospace titanium smart modular living capsule"`, `"360 degree infinity glass cube observatory house"`
  - **대표 장소**: 애플 5번가 매장을 연상시키는 360도 무이음새 초강화 통유리 큐브 펜트하우스, 항공우주용 티타늄 프레임 스마트 모듈러 빌라, 알프스 절벽 돌출형 다이아몬드 커팅 크리스탈 파빌리온.

---

### 2.8 VEHICLE (폐차·기차·잠수함·슈퍼요트·전용기) 🚗
- **핵심 레퍼런스 채널**: eGarage, Enes Yilmazer, Supercar Blondie, Roman Atwood, DownieLive
- **BAD (폭망 폐탈것)**:
  - **한국어 검색어**: `"폐차장 침수된 티코 운전석"`, `"인도 통근열차 천장 위 매달린 자리"`, `"녹슨 폐어선 기관실 침수 격실"`, `"타이어 빠진 낡은 트레일러"`, `"버려진 지하철 1호선 폐객차"`
  - **영어 검색어**: `"flooded rusted junkyard scrap car driver seat"`, `"India train roof commuter hanging perch"`, `"abandoned rusty trawler engine room bilge"`, `"flat-tire rotting rusty camper trailer"`, `"abandoned decommissioned subway train cabin"`
  - **대표 장소**: 폐차장 진흙탕에 처박힌 녹슨 경차 운전석, 뭄바이 통근열차 지붕 위 고압선 바로 아래 자리, 침몰 위기 폐목선의 곰팡이 핀 기관실 바닥.
- **GOOD (대박 슈퍼모빌리티)**:
  - **한국어 검색어**: `"세계 최고가 1조원 롤스로이스 디자인 슈퍼요트"`, `"오리엔트 익스프레스 프레지덴셜 스위트 객차"`, `"보잉 747 개조 개인 전용기 펜트하우스"`, `"두바이 사막 모터홈 마르키 모빌 엘레멘트"`, `"개인 잠수함 트라이톤 360도 통유리 캐빈"`
  - **영어 검색어**: `"billion-dollar mega yacht interior tour Enes Yilmazer"`, `"Venice Simplon-Orient-Express grand suite train carriage"`, `"Boeing 747 converted private VIP jet palace"`, `"Marchi Mobile eleMMent Palazzo luxury RV motorhome"`, `"Triton luxury private submersible transparent pressure sphere"`
  - **대표 장소**: 1조 2천억 원 가치의 180미터 슈퍼요트 아잠(Azzam) 마스터 펜트하우스 데크, 베니스 심플론 오리엔트 익스프레스 호화 열차 그랜드 스위트, 보잉 747-8 인터콘티넨털 전용기 스카이 팰리스.

---

### 2.9 SPACESHIP (우주정거장·달기지·화성 거주구·스타쉽) 🚀
- **핵심 레퍼런스 채널**: Everyday Astronaut, Scott Manley, NASA TV, Isaac Arthur, Kurzgesagt
- **BAD (폭망 우주재앙)**:
  - **한국어 검색어**: `"국제우주정거장 ISS 고장난 화장실 모듈"`, `"소유즈 귀환 캡슐 화재 그을린 잔해"`, `"우주 쓰레기 파편 맞은 비상탈출 셔틀"`, `"산소 누출되는 버려진 달 궤도 정거장"`, `"방사능 차폐 실패한 화성 이주선 컨테이너"`
  - **영어 검색어**: `"ISS broken waste management compartment sleeping bag"`, `"charred Soyuz descent module burnt wreckage"`, `"space debris punctured escape capsule"`, `"leaking oxygen abandoned lunar orbit outpost"`, `"radiation-leaking Mars cargo bay pressurized closet"`
  - **대표 장소**: ISS 즈베즈다 모듈 고장 난 오물 처리기 바로 옆 침낭, 대기권 재진입 중 타버린 소유즈 캡슐 비좁은 바닥, 우주 쓰레기에 관통당해 산소가 새는 궤도 비상 쉘터.
- **GOOD (대박 성간기지)**:
  - **한국어 검색어**: `"스페이스X 아르테미스 달 기지 럭셔리 거주 돔"`, `"보이저 스테이션 궤도 5성급 우주 호텔 스위트"`, `"스타쉽 화성 정착 도시 프레지덴셜 돔"`, `"오닐 실린더 인공중력 전원 도시 펜트하우스"`, `"성간 우주선 엔터프라이즈 함장실"`
  - **영어 검색어**: `"SpaceX Starship Mars base luxury pressurized habitat dome"`, `"Orbital Assembly Voyager Station luxury space hotel suite"`, `"O'Neill cylinder artificial gravity villa garden"`, `"Starship private orbital executive suite"`, `"interstellar starship captain's quarters with observation lounge"`
  - **대표 장소**: 보이저 스테이션 인공중력 링 5성급 우주 호텔 파노라마 스위트룸, 스타쉽 화성 도시 올림포스 몬스 기슭 프레지덴셜 바이오돔, 지구-달 라그랑주 포인트 L1 궤도 스카이 샬레.

---

### 2.10 FICTION_MEDIA (영화·소설·애니·게임 속 명소 vs 최악의 장소) 🎬
- **핵심 레퍼런스 채널**: Cinema Summary, Heavy Spoilers, CineFix, Screen Rant, IGN
- **BAD (폭망 미디어 거처)**:
  - **한국어 검색어**: `"기생충 지하 단칸방 침수 변기 위"`, `"해리포터 아즈카반 디멘터 감시 독방"`, `"설국열차 꼬리칸 단백질 블록 배급실"`, `"매트릭스 인간 배양 젤리 포드"`, `"오징어게임 456인 공동 침상 밑바닥"`, `"폴아웃 볼트 방사능 바퀴벌레 방"`
  - **영어 검색어**: `"Parasite semi-basement flooded toilet bathroom"`, `"Azkaban prison dementor solitary cell Harry Potter"`, `"Snowpiercer tail section cramped bunk bed"`, `"The Matrix human harvesting bio pod"`, `"Squid Game lowest tier tiered steel bunk"`, `"Fallout Vault radroach infested overseer holding room"`
  - **대표 장소**: 영화 《기생충》 역류하는 변기 위 와이파이 잡는 계단 모서리, 《설국열차》 꼬리칸 철제 3단 침상 바닥, 《매트릭스》 끈적이는 배양액 캡슐 속 플러그 침상.
- **GOOD (대박 미디어 궁전)**:
  - **한국어 검색어**: `"토니 스타크 말리부 절벽 절경 스마트 맨션"`, `"배트맨 브루스 웨인 웨인 저택 마스터 룸"`, `"호빗마을 빌보 배긴스 백엔드 언덕집"`, `"센과 치히로 온천장 유바바 최상층 집무실"`, `"위대한 개츠비 롱아일랜드 바다 앞 궁전"`, `"아이언맨 어벤져스 타워 펜트하우스"`
  - **영어 검색어**: `"Tony Stark Malibu point cliffside mansion interior"`, `"Wayne Manor master suite Christopher Nolan Batman"`, `"Bag End Bilbo Baggins Hobbit hole Shire"`, `"Spirited Away Yubaba bathhouse top floor suite"`, `"Great Gatsby Long Island waterfront gold coast mansion"`, `"Avengers Tower executive penthouse sky lounge"`
  - **대표 장소**: 《아이언맨》 토니 스타크 말리부 포인트 절벽 통유리 저택, 《반지의 제왕》 샤이어 호빗골 백엔드 아늑한 둥근 문 저택, 《센과 치히로의 행방불명》 유바바의 최고층 황금 융단 집무실.

---

### 2.11 IMAGINARY_CITY (디스토피아 지하도시 vs 유토피아 공중도시) 🏙️
- **핵심 레퍼런스 채널**: Kurzgesagt, Oversimplified, AlternateHistoryHub, B1M, Neo
- **BAD (폭망 지하도시)**:
  - **한국어 검색어**: `"매트릭스 시온 지하 하수도 바닥 은신처"`, `"사이버펑크 나이트시티 슬럼가 고물 골목"`, `"디스토피아 스모그 돔 지하 유독가스 굴"`, `"버려진 메트로 2033 모스크바 지하철 터널 역"`, `"황폐해진 워터월드 녹슨 부유 환풍구"`
  - **영어 검색어**: `"Zion underground sewer drainage maintenance burrow"`, `"Cyberpunk Night City Pacifica landfill slum shanty"`, `"Metro 2033 infested abandoned subway station alcove"`, `"Waterworld rusted floating atoll cage cabin"`, `"dystopian acid rain smog vault sewer platform"`
  - **대표 장소**: 《메트로 2033》 모스크바 지하철 폐쇄된 역의 돌연변이 소굴 옆 벙커, 사이버펑크 파시피카 쓰레기 매립지 드럼통 움막, 유독성 산성비가 내리는 스모그 도시의 배수구 철망 위.
- **GOOD (대박 공중도시)**:
  - **한국어 검색어**: `"천공의 성 라퓨타 공중 정원 펜트하우스"`, `"전설의 황금도시 엘도라도 태양의 궁전"`, `"아틀란티스 심해 크리스탈 궁전 마스터 베드"`, `"사이버펑크 아라사카 타워 최상층 공중 정원"`, `"유토피아 솔라펑크 생태 공중도시 스위트룸"`
  - **영어 검색어**: `"Laputa Castle in the Sky floating botanic penthouse"`, `"El Dorado mythical city of gold sun temple suite"`, `"Atlantis submerged bioluminescent crystal grand palace"`, `"Arasaka Tower highest cloud garden penthouse Cyberpunk"`, `"Solarpunk utopian sky city terrace villa with vertical forest"`
  - **대표 장소**: 지브리 《천공의 성 라퓨타》 거대 비행석 상공 식물원 펜트하우스, 전설 속 남미 황금도시 엘도라도 태양의 신전, 수직 숲과 무공해 자기부상 열차가 연결된 솔라펑크 2150 친환경 공중도시 스위트.

---

### 2.12 MULTIVERSE (4차원 미궁·블랙홀 vs 다중우주 신전·다이슨 스피어) 🌌
- **핵심 레퍼런스 채널**: Event Horizon, PBS Space Time, Kurzgesagt, Isaac Arthur, Cool Worlds
- **BAD (폭망 차원왜곡)**:
  - **한국어 검색어**: `"블랙홀 사건의 지평선 찌그러진 4차원 틈새"`, `"무한 거울 미궁 속 갇힌 허공의 방"`, `"영원의 공허 속 부서진 시공간 파편 큐브"`, `"엔트로피 종말 우주의 마지막 식어버린 암흑 벙커"`, `"다차원 웜홀 소용돌이 쓰레기 압축실"`
  - **영어 검색어**: `"event horizon gravitational singularity distortion void"`, `"infinite mirror tesseract trapped pocket dimension"`, `"heat death of the universe last frozen dark bunker"`, `"entropy maximum crumbling temporal shard capsule"`, `"multiverse void singularity trash compactor chamber"`
  - **대표 장소**: 초대질량 블랙홀 중심의 시간과 공간이 붕괴하는 테서랙트 파편 틈새, 거울이 무한히 반사되어 탈출구가 없는 4차원 큐브 미궁, 우주 열죽음(Heat Death) 직전 마지막으로 얼어붙은 극저온 암흑 공허 벙커.
- **GOOD (대박 초월신전)**:
  - **한국어 검색어**: `"다중우주 창조주 전지전능 옴니버스 펜트하우스"`, `"다이슨 스피어 중심 항성 직관 파노라마 팰리스"`, `"시간의 끝 시간선 관리국 템포럴 룸"`, `"차원 초월 크리스탈 다차원 성소"`, `"은하계 연합 평의회 센트럴 펄사 라운지"`
  - **영어 검색어**: `"Omniverse Creator Supreme Multiverse Penthouse"`, `"Dyson Sphere stellar core direct panoramic palace"`, `"End of Time Citadel at the End of Time throne room"`, `"transdimensional crystalline cosmic nexus sanctuary"`, `"Galactic Core Pulsar grand council observatory villa"`
  - **대표 장소**: 수천억 개의 평행우주를 바닥 유리창으로 내려다보는 옴니버스 창조주 궁극의 펜트하우스 (`Lv.999`), 항성 전체를 감싼 직경 3억 km 다이슨 스피어 중심 관제궁전, 시공간의 끝자락(Citadel at the End of Time) 타임라인 통제 센터.

---

## 3. 레벨 재조정 수식 및 `G:\My Drive\new_houses` 안전 리넘버링 전략

### 3.1 페어 보존 리넘버링 수식 (Pairwise Mapping Formula)

기존 500개 레벨(`oldLv = 0 .. 499`)은 250개의 `(짝수=REAL, 홀수=FICTION)` 페어로 구성되어 있습니다:
$$\text{pair index } p = \lfloor \text{oldLv} / 2 \rfloor \quad (p = 0, 1, 2, \dots, 249)$$

새로운 1,000단계(`newLv = 0 .. 999`)로 확장 시, 기존 데이터의 상대적 순위와 패리티(짝수/홀수)를 완벽히 유지하면서 신규 확장 슬롯을 공평하게 끼워 넣기 위해 다음 수학적 공식을 적용합니다:

#### 일반 페어 규칙 ($p = 0 \dots 248$, 즉 $\text{oldLv} = 0 \dots 497$):
- **기존 REAL (짝수)**: $\text{oldEven} = 2p \longrightarrow \mathbf{\text{newLv} = 4p}$ (REAL 보존)
- **기존 FICTION (홀수)**: $\text{oldOdd} = 2p + 1 \longrightarrow \mathbf{\text{newLv} = 4p + 1}$ (FICTION 보존)
- **신규 확장 REAL (짝수)**: $\mathbf{\text{newLv} = 4p + 2}$ (Step 2.2에서 신규 `.txt` 생성)
- **신규 확장 FICTION (홀수)**: $\mathbf{\text{newLv} = 4p + 3}$ (Step 2.2에서 신규 `.txt` 생성)

#### 최상위 엔드포인트 페어 ($p = 249$, 즉 $\text{oldLv} = 498, 499$):
최종 끝판왕인 **`Lv.499` (다중우주 창조주의 펜트하우스)** 가 1,000단계 체제의 최종 정점인 **`Lv.999`** 로 정확히 이동하도록 특별 보존 매핑을 적용합니다:
- **기존 REAL**: $\text{oldLv} = 498 \longrightarrow \mathbf{\text{newLv} = 996}$ (REAL 보존)
- **신규 확장 FICTION**: $\mathbf{\text{newLv} = 997}$ (신규 생성)
- **신규 확장 REAL**: $\mathbf{\text{newLv} = 998}$ (신규 생성)
- **기존 FICTION (최종 정점)**: $\text{oldLv} = 499 \longrightarrow \mathbf{\text{newLv} = 999}$ (다중우주 창조주 펜트하우스 불변 유지)

---

### 3.2 단계별 파일명 매핑 대조표 (Before & After Sample)

`G:\My Drive\new_houses` 디렉터리의 실제 파일명 변경 대조표는 다음과 같습니다:

| 기존 레벨 (`oldLv`) | 기존 파일명 | 신규 레벨 (`newLv`) | 신규 파일명 | 유형 | 판정 구역 | 비고 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| `0` | `00000.{png,txt}` | **`0`** | `00000.{png,txt}` | REAL | BAD | 위치 불변 (최악의 지옥 유지) |
| `1` | `00001.{png,txt}` | **`1`** | `00001.{png,txt}` | FICTION | BAD | 위치 불변 (마그마 반지하 유지) |
| - | *(신규 슬롯)* | **`2`** | `00002.txt` | REAL | BAD | **신규 확장 REAL 하우스** |
| - | *(신규 슬롯)* | **`3`** | `00003.txt` | FICTION | BAD | **신규 확장 FICTION 하우스** |
| `2` | `00002.{png,txt}` | **`4`** | `00004.{png,txt}` | REAL | BAD | 2단계 이동 |
| `3` | `00003.{png,txt}` | **`5`** | `00005.{png,txt}` | FICTION | BAD | 2단계 이동 |
| ... | ... | ... | ... | ... | ... | 균등 4배 확장 파이프라인 |
| `248` | `00248.{png,txt}` | **`496`** | `00496.{png,txt}` | REAL | BAD | 구 폭망 마지막 페어 |
| `249` | `00249.{png,txt}` | **`497`** | `00497.{png,txt}` | FICTION | BAD | 구 폭망 마지막 페어 |
| - | *(신규 슬롯)* | **`498`** | `00498.txt` | REAL | BAD | **신규 폭망 경계 REAL** |
| - | *(신규 슬롯)* | **`499`** | `00499.txt` | FICTION | BAD | **신규 폭망 경계 FICTION** |
| `250` | `00250.{png,txt}` | **`500`** | `00500.{png,txt}` | REAL | GOOD | **신규 대박 시작점 (서바이벌 콘도)** |
| `251` | `00251.{png,txt}` | **`501`** | `00501.{png,txt}` | FICTION | GOOD | 힐링 온천 빌라 |
| ... | ... | ... | ... | ... | ... | 대박 구역 250개 이동 |
| `498` | `00498.{png,txt}` | **`996`** | `00996.{png,txt}` | REAL | GOOD | 기존 최상위 실제 건축물 |
| - | *(신규 슬롯)* | **`997`** | `00997.txt` | FICTION | GOOD | **신규 확장 FICTION 하우스** |
| - | *(신규 슬롯)* | **`998`** | `00998.txt` | REAL | GOOD | **신규 확장 REAL 하우스** |
| `499` | `00499.{png,txt}` | **`999`** | `00999.{png,txt}` | FICTION | GOOD | **최고의 정점 다중우주 창조주 펜트하우스** |

---

### 3.3 덮어쓰기 충돌 0% 보장: 역순(Descending 499 -> 0) 이름 변경 알고리즘 (Step 2.1)

#### 충돌 위험성 분석 (위험 시나리오)
만약 0부터 499까지 오름차순(Ascending)으로 이름을 바꾸면:
- `00002`를 `00004`로 바꿀 때, 기존 `00004` 파일이 아직 변경되지 않은 상태로 존재하므로 **기존 `00004` 파일이 덮어씌워져 영구 소실**되는 치명적 데이터 손실이 발생합니다.

#### 수학적 역순 무충돌 증명 (Zero-Collision Proof)
모든 기존 레벨 $k \in [0, 499]$에 대하여 신규 레벨 $\text{newLv}(k)$는 다음 부등식을 엄격히 만족합니다:
$$\mathbf{\text{newLv}(k) \ge k} \quad (\forall k \in [0, 499])$$
- $k = 0 \implies \text{newLv}(0) = 0$
- $k = 1 \implies \text{newLv}(1) = 1$
- $k \ge 2 \implies \text{newLv}(k) > k$ (예: $k=2 \rightarrow 4$, $k=250 \rightarrow 500$, $k=499 \rightarrow 999$)

따라서, **역순인 $k = 499$부터 $0$까지 내림차순(Descending)** 으로 파일명을 변경하면:
1. $k = 499$는 $999$로 변경됩니다. (현재 디렉터리에는 499 이하 파일만 있으므로 타깃 999는 100% 비어 있음!)
2. $k = 498$은 $996$으로 변경됩니다. (타깃 996은 100% 비어 있음!)
3. 임의의 $k$를 변경하는 순간, 목적지 $\text{newLv}(k) \ge k$는 이미 더 큰 번호들의 처리가 끝났거나 애초에 존재하지 않던 고유 번호이므로, **어떠한 임시 파일(`.tmp`)이나 이중 복사 없이도 100% 무충돌·원자적 이름 변경이 보장**됩니다.
4. $k = 1$ 및 $k = 0$은 목적지 번호가 동일하므로 스킵(No-op)됩니다.

---

### 3.4 신규 500개 프롬프트 텍스트(`{padded}.txt`) 자동 생성 파이프라인 (Step 2.2)

Step 2.1 파일명 변경이 완료된 직후, 비어 있는 신규 슬롯(총 500개)에 대해 다음 절차가 자동 수행됩니다:

1. **대상 슬롯 식별**:
   - $p = 0 \dots 248$: $4p + 2$ (REAL 249개) 및 $4p + 3$ (FICTION 249개)
   - $p = 249$: $997$ (FICTION 1개) 및 $998$ (REAL 1개)
   - 합계: 정확히 500개 슬롯
2. **청크 기반 프롬프트 주입**:
   - `data/chunks/houses-chunk-00.json` ~ `houses-chunk-19.json`에 확장된 500개 신규 아이템의 `geminiImagePrompt` 텍스트를 추출.
   - `G:\My Drive\new_houses/{padded}.txt` 파일로 UTF-8 포맷 저장.
3. **무결성 검증**:
   - `G:\My Drive\new_houses/` 디렉터리에 `00000.txt`부터 `00999.txt`까지 누락 없이 총 1,000개의 텍스트 파일이 정확히 생성되었는지 카운트 검증.

---

> **다음 단계 승인 대기**:  
> 본 전략 문서와 GitHub Issue #17을 사용자에게 확인받은 후, 사용자의 최종 승인이 떨어지면 즉시 `Step 2.1 (G:\My Drive\new_houses 파일명 변경)` 및 `Step 2.2 (신규 500개 .txt 생성)` 단계로 순차 돌입합니다.
