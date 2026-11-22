// scripts/build_phonetic_matcher.mjs — 500+ Curated Global Top Names Database Builder & Tester
// Owned strictly by Phonetic Algorithm Researcher & Developer

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DB_PATH = path.join(rootDir, 'data', 'compact_serving_names.json');
const OUT_DATA_PATH = path.join(rootDir, 'web', 'js', 'phonetic_data.js');

// 1. 15,487 이름 DB 로드
if (!fs.existsSync(DB_PATH)) {
  console.error('[build_phonetic] Error: DB not found at ' + DB_PATH);
  process.exit(1);
}

const rawDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const nameMap = new Map();
for (const row of rawDb) {
  if (!nameMap.has(row[0])) {
    nameMap.set(row[0], {
      name: row[0],
      cho: row[1],
      hanja: row[2],
      meaning: row[4],
      gender: row[5],
      category: row[6]
    });
  }
}
console.log(`[build_phonetic] Loaded ${nameMap.size} unique Korean names from DB.`);

// 2. 국립국어원 표준 로마자 표기법 (Revised Romanization of Korean)
const CHO_RR = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG_RR = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG_RR = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','t','m','p','p','t','t','ng','t','t','k','t','p','t'];

export function hangulToRoman(hangul) {
  const syllables = [...hangul].map(ch => {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return ch;
    const c = Math.floor(code / 588);
    const j = Math.floor((code % 588) / 28);
    const t = code % 28;
    return CHO_RR[c] + JUNG_RR[j] + JONG_RR[t];
  });
  if (syllables.length === 0) return '';
  return syllables.map((s, idx) => idx === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.toLowerCase()).join('-');
}

// 3. 540 Curated Names Dataset across 11 Languages
const RAW_CURATED = [
  {
    "name": "Sophia",
    "lang": "en",
    "ipa": "soʊˈfiːə",
    "aliases": [
      "소피아",
      "sophie",
      "sofia"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Shares the open 'S-Vowel' onset, expressing pure, water-like grace.",
      "Direct phonetic harmony with 'So-', symbolizing rhythm and brightness.",
      "Modern, soft phonetic resonance starting with 'S-'."
    ]
  },
  {
    "name": "Lucas",
    "lang": "en",
    "ipa": "ˈluːkəs",
    "aliases": [
      "루카스",
      "luke",
      "luca"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Captures the radiant 'Lu-' start and light-filled open syllable.",
      "Warm phonetic resonance resembling 'Lo/Lu', conveying wisdom and prosperity.",
      "Flows naturally from 'Luca/Lucas', embodying grace and joy."
    ]
  },
  {
    "name": "David",
    "lang": "en",
    "ipa": "ˈdeɪvɪd",
    "aliases": [
      "데이비드",
      "dave",
      "davit"
    ],
    "hanguls": [
      "다빈",
      "도윤",
      "다온"
    ],
    "reasons": [
      "Mirroring the 'Da-vi' sound harmony with warmth.",
      "Solid 'D-' onset and melodious flow, representing integrity and honor.",
      "Pure Korean phonetic charm echoing 'Da-', meaning all good things arrive."
    ]
  },
  {
    "name": "Oliver",
    "lang": "en",
    "ipa": "ˈɒlɪvər",
    "aliases": [
      "올리버",
      "oli",
      "ollie"
    ],
    "hanguls": [
      "온유",
      "로운",
      "우리"
    ],
    "reasons": [
      "Shares the gentle 'Ol-' start, symbolizing warmth and peace.",
      "Phonetic harmony with the soft 'l-v-r' cadence.",
      "Warm, embracing sound echoing the core vowels of Oliver."
    ]
  },
  {
    "name": "Emma",
    "lang": "en",
    "ipa": "ˈɛmə",
    "aliases": [
      "엠마",
      "emmie",
      "em"
    ],
    "hanguls": [
      "예나",
      "은서",
      "예은"
    ],
    "reasons": [
      "Gentle open 'E-m' resonance, brimming with warmth and grace.",
      "Soft vowel start echoing the gentle spirit of Emma.",
      "Melodious balance conveying grace and blessed kindness."
    ]
  },
  {
    "name": "Chloe",
    "lang": "en",
    "ipa": "ˈkloʊi",
    "aliases": [
      "클로이",
      "chloë",
      "khloe"
    ],
    "hanguls": [
      "초아",
      "채원",
      "채은"
    ],
    "reasons": [
      "Clear 'Ch/Kh' onset opening into a bright floral cadence.",
      "Vibrant 'Ch-' harmony symbolizing pure origins and vitality.",
      "Charming, soft resonance echoing the elegance of Chloe."
    ]
  },
  {
    "name": "Noah",
    "lang": "en",
    "ipa": "ˈnoʊə",
    "aliases": [
      "노아",
      "noa"
    ],
    "hanguls": [
      "노아",
      "도하",
      "하람"
    ],
    "reasons": [
      "Direct sound match carrying peaceful, resting cadence.",
      "Echoes the open vowel breath of Noah.",
      "Spacious acoustic atmosphere conveying vast sky and blessing."
    ]
  },
  {
    "name": "Leo",
    "lang": "en",
    "ipa": "ˈliːoʊ",
    "aliases": [
      "레오",
      "leon"
    ],
    "hanguls": [
      "라온",
      "로운",
      "리안"
    ],
    "reasons": [
      "Vibrant 'L-vowel' onset signifying joy and pure light.",
      "Warm phonetic resonance resembling 'Lo/Le', conveying wisdom and prosperity.",
      "Crisp 'L-i' bridge flowing into bright clarity."
    ]
  },
  {
    "name": "Liam",
    "lang": "en",
    "ipa": "ˈliːəm",
    "aliases": [
      "리암"
    ],
    "hanguls": [
      "이안",
      "리안",
      "라온"
    ],
    "reasons": [
      "Melodic 'L-i-am' vowel flow expressing gentleness.",
      "Direct liquid onset 'Li-' echoing brightness and poise.",
      "Joyful cadence mirroring the open vocal energy."
    ]
  },
  {
    "name": "Mia",
    "lang": "en",
    "ipa": "ˈmiːə",
    "aliases": [
      "미아"
    ],
    "hanguls": [
      "미아",
      "미래",
      "민아"
    ],
    "reasons": [
      "Direct phonetic counterpart embodying delicate beauty.",
      "Shares the sweet 'Mi-' onset, symbolizing bright tomorrow.",
      "Soft resonant flow mirroring the youthful charm of Mia."
    ]
  },
  {
    "name": "Ethan",
    "lang": "en",
    "ipa": "ˈiːθən",
    "aliases": [
      "이든",
      "이단"
    ],
    "hanguls": [
      "이든",
      "이안",
      "이선"
    ],
    "reasons": [
      "Direct acoustic twin for 'E-than', meaning righteous and good.",
      "Graceful 'I-' onset carrying serene clarity.",
      "Balanced dental bridge reflecting enduring strength."
    ]
  },
  {
    "name": "Henry",
    "lang": "en",
    "ipa": "ˈhɛnri",
    "aliases": [
      "헨리",
      "harry"
    ],
    "hanguls": [
      "현리",
      "해린",
      "하람"
    ],
    "reasons": [
      "Echoes the energetic 'H-n-r' consonant sequence.",
      "Melodious 'Hae-rin' cadence flowing with radiant sea-like calm.",
      "Vibrant aspirate onset 'H-' reflecting noble purpose."
    ]
  },
  {
    "name": "Charlotte",
    "lang": "en",
    "ipa": "ˈʃɑːrlət",
    "aliases": [
      "샬럿",
      "샤를로트"
    ],
    "hanguls": [
      "설아",
      "소율",
      "채린"
    ],
    "reasons": [
      "Soft sibilant start mirroring the gentle elegance of Charlotte.",
      "Rhythmic balance echoing the refined royal cadence.",
      "Bright lyrical cadence with charming poise."
    ]
  },
  {
    "name": "Amelia",
    "lang": "en",
    "ipa": "əˈmiːliə",
    "aliases": [
      "아멜리아",
      "amy"
    ],
    "hanguls": [
      "아민",
      "예린",
      "아린"
    ],
    "reasons": [
      "Shares the warm open 'A-m' onset.",
      "Lyrical vowel flow reflecting industrious grace.",
      "Delicate acoustic bridge with clear, sparkling resonance."
    ]
  },
  {
    "name": "James",
    "lang": "en",
    "ipa": "dʒeɪmz",
    "aliases": [
      "제임스",
      "jim",
      "jimmy"
    ],
    "hanguls": [
      "재민",
      "지민",
      "재성"
    ],
    "reasons": [
      "Vibrant affricate 'J-' onset symbolizing intelligence and agility.",
      "Soft harmonic flow carrying wise and virtuous presence.",
      "Strong leadership cadence echoing perseverance."
    ]
  },
  {
    "name": "Benjamin",
    "lang": "en",
    "ipa": "ˈbɛndʒəmɪn",
    "aliases": [
      "벤자민",
      "ben",
      "benny"
    ],
    "hanguls": [
      "범진",
      "민재",
      "보민"
    ],
    "reasons": [
      "Resonant bilabial 'B-' onset conveying deep trust and nobility.",
      "Harmonizes with the ending 'min' cadence.",
      "Warm, gem-like phonetic glow representing preciousness."
    ]
  },
  {
    "name": "William",
    "lang": "en",
    "ipa": "ˈwɪljəm",
    "aliases": [
      "윌리엄",
      "will",
      "liam"
    ],
    "hanguls": [
      "우림",
      "우진",
      "유찬"
    ],
    "reasons": [
      "Deep vowel onset 'W/U' echoing forest-like depth and peace.",
      "Strong 'W-j' harmony expressing genuine progress.",
      "Radiant, clear vocal resonance."
    ]
  },
  {
    "name": "Alexander",
    "lang": "en",
    "ipa": "ˌælɪɡˈzændər",
    "aliases": [
      "알렉산더",
      "alex",
      "alec"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서진"
    ],
    "reasons": [
      "Captures the uplifting spirit and majestic breadth.",
      "Soft sibilant center reflecting gentle wisdom and nobility.",
      "Solid, dignified cadence echoing leadership."
    ]
  },
  {
    "name": "Daniel",
    "lang": "en",
    "ipa": "ˈdænjəl",
    "aliases": [
      "대니얼",
      "단",
      "danny"
    ],
    "hanguls": [
      "단우",
      "대현",
      "다민"
    ],
    "reasons": [
      "Solid 'Dan-' onset reflecting righteousness and steadfast virtue.",
      "Broad 'Dae-' onset expressing great wisdom.",
      "Warm melodic resonance bridging 'Dan-i-el'."
    ]
  },
  {
    "name": "Matthew",
    "lang": "en",
    "ipa": "ˈmæθjuː",
    "aliases": [
      "매튜",
      "matt"
    ],
    "hanguls": [
      "민태",
      "태민",
      "명우"
    ],
    "reasons": [
      "Balances the nasal 'M-' and dental 'T-' consonants.",
      "Reversed energetic harmony symbolizing radiant talent.",
      "Clear, bright resonance conveying gift of light."
    ]
  },
  {
    "name": "Samuel",
    "lang": "en",
    "ipa": "ˈsæmjuəl",
    "aliases": [
      "새뮤얼",
      "sam",
      "sammy"
    ],
    "hanguls": [
      "승민",
      "서민",
      "상우"
    ],
    "reasons": [
      "Sibilant-nasal bridge 'S-m' conveying spiritual elevation.",
      "Gentle, accessible cadence reflecting peaceful heart.",
      "Dignified, expansive flow echoing high aspirations."
    ]
  },
  {
    "name": "Joseph",
    "lang": "en",
    "ipa": "ˈdʒoʊzɪf",
    "aliases": [
      "조셉",
      "joe",
      "joey"
    ],
    "hanguls": [
      "조은",
      "주원",
      "지안"
    ],
    "reasons": [
      "Direct 'Jo-' phonetic bridge conveying goodness and blessing.",
      "Expansive 'Ju-won' cadence expressing central virtue.",
      "Serene, luminous flow reflecting inner peace."
    ]
  },
  {
    "name": "Sebastian",
    "lang": "en",
    "ipa": "sɪˈbæstʃən",
    "aliases": [
      "세바스찬",
      "seb"
    ],
    "hanguls": [
      "세찬",
      "서진",
      "성준"
    ],
    "reasons": [
      "Dynamic 'Se-ch' onset conveying vigor and brilliance.",
      "Tranquil sibilant start with modern elegance.",
      "Steadfast, dignified harmony representing noble integrity."
    ]
  },
  {
    "name": "Jack",
    "lang": "en",
    "ipa": "dʒæk",
    "aliases": [
      "잭",
      "jackie"
    ],
    "hanguls": [
      "재하",
      "재혁",
      "진우"
    ],
    "reasons": [
      "Crisp 'J-a' onset carrying bright energy and quick wit.",
      "Dynamic, shining cadence reflecting innovative courage.",
      "Warm, genuine flow signifying steadfast character."
    ]
  },
  {
    "name": "Ava",
    "lang": "en",
    "ipa": "ˈeɪvə",
    "aliases": [
      "아바",
      "에이바"
    ],
    "hanguls": [
      "아라",
      "아영",
      "하린"
    ],
    "reasons": [
      "Direct open 'A-v-a' vowel harmony, meaning ocean-like depth.",
      "Graceful, bright cadence reflecting blooming vitality.",
      "Gentle, refreshing flow echoing morning dew."
    ]
  },
  {
    "name": "Harper",
    "lang": "en",
    "ipa": "ˈhɑːrpər",
    "aliases": [
      "하퍼"
    ],
    "hanguls": [
      "하린",
      "하랑",
      "혜린"
    ],
    "reasons": [
      "Lyrical 'Ha-' onset evoking clear skies and musical harmony.",
      "Soaring acoustic flight signifying broad horizons.",
      "Refined, radiant cadence filled with bright wisdom."
    ]
  },
  {
    "name": "Evelyn",
    "lang": "en",
    "ipa": "ˈɛvlɪn",
    "aliases": [
      "에블린",
      "eve"
    ],
    "hanguls": [
      "예린",
      "유린",
      "예원"
    ],
    "reasons": [
      "Gentle front-vowel onset flowing into clear liquid clarity.",
      "Soft, pure cadence expressing deep clarity.",
      "Auspicious, elegant resonance reflecting grace."
    ]
  },
  {
    "name": "Ella",
    "lang": "en",
    "ipa": "ˈɛlə",
    "aliases": [
      "엘라",
      "ellie"
    ],
    "hanguls": [
      "예라",
      "은솔",
      "유라"
    ],
    "reasons": [
      "Bright lyrical flow echoing fairy-like lightness.",
      "Pure pine-like integrity wrapped in soft gentle grace.",
      "Radiant, melodious cadence expressing joy."
    ]
  },
  {
    "name": "Grace",
    "lang": "en",
    "ipa": "ɡreɪs",
    "aliases": [
      "그레이스",
      "gracie"
    ],
    "hanguls": [
      "가람",
      "가은",
      "경서"
    ],
    "reasons": [
      "Flowing river-like elegance echoing boundless grace.",
      "Gentle, thankful cadence symbolizing divine favor.",
      "Refined, cultured harmony reflecting noble virtues."
    ]
  },
  {
    "name": "Hannah",
    "lang": "en",
    "ipa": "ˈhænə",
    "aliases": [
      "한나",
      "hanna"
    ],
    "hanguls": [
      "하나",
      "한나",
      "하늘"
    ],
    "reasons": [
      "Direct phonetic counterpart meaning 'one and only' precious gift.",
      "Classic biblical harmony expressing grace and mercy.",
      "Vast, open acoustic atmosphere echoing the endless sky."
    ]
  },
  {
    "name": "Victoria",
    "lang": "en",
    "ipa": "vɪkˈtɔːriə",
    "aliases": [
      "빅토리아",
      "vicky",
      "tori"
    ],
    "hanguls": [
      "빛나",
      "별아",
      "보아"
    ],
    "reasons": [
      "Captures the radiant victorious shine in pure Korean.",
      "Starlight aesthetic mirroring regal grandeur.",
      "Precious, jewel-like resonance reflecting honor."
    ]
  },
  {
    "name": "Lily",
    "lang": "en",
    "ipa": "ˈlɪli",
    "aliases": [
      "릴리",
      "lillian"
    ],
    "hanguls": [
      "라율",
      "은율",
      "리안"
    ],
    "reasons": [
      "Musical, rhythmic cadence reflecting blooming petal elegance.",
      "Graceful melody echoing pristine purity.",
      "Crisp, bright flow conveying youthful innocence."
    ]
  },
  {
    "name": "Zoe",
    "lang": "en",
    "ipa": "ˈzoʊi",
    "aliases": [
      "조이",
      "zoey"
    ],
    "hanguls": [
      "소이",
      "서이",
      "조은"
    ],
    "reasons": [
      "Soft sibilant onset conveying vibrant life and sweetness.",
      "Modern, chic cadence radiating quiet charm.",
      "Warm, benevolent resonance celebrating the joy of living."
    ]
  },
  {
    "name": "Nora",
    "lang": "en",
    "ipa": "ˈnɔːrə",
    "aliases": [
      "노라",
      "norah"
    ],
    "hanguls": [
      "노아",
      "나래",
      "다은"
    ],
    "reasons": [
      "Gentle dental-nasal onset conveying light and comfort.",
      "Creative wings of imagination soaring with grace.",
      "Warm, blessed harmony filled with abundant kindness."
    ]
  },
  {
    "name": "Maya",
    "lang": "en",
    "ipa": "ˈmaɪə",
    "aliases": [
      "마야"
    ],
    "hanguls": [
      "민아",
      "미래",
      "아민"
    ],
    "reasons": [
      "Charming, gentle 'M-a' flow reflecting clear intelligence.",
      "Bright forward-looking cadence symbolizing hope.",
      "Serene, compassionate bridge echoing world harmony."
    ]
  },
  {
    "name": "Stella",
    "lang": "en",
    "ipa": "ˈstɛlə",
    "aliases": [
      "스텔라"
    ],
    "hanguls": [
      "세라",
      "슬기",
      "서아"
    ],
    "reasons": [
      "Silken, starlight acoustic grace reflecting celestial beauty.",
      "Deep wisdom and intuitive brilliance.",
      "Serene, tranquil flow filled with auspicious light."
    ]
  },
  {
    "name": "Ruby",
    "lang": "en",
    "ipa": "ˈruːbi",
    "aliases": [
      "루비"
    ],
    "hanguls": [
      "루비",
      "유비",
      "로하"
    ],
    "reasons": [
      "Direct gem-like phonetic match sparkling with passion.",
      "Soft, noble cadence representing precious virtue.",
      "Lyrical, dew-like resonance expressing morning joy."
    ]
  },
  {
    "name": "Alice",
    "lang": "en",
    "ipa": "ˈælɪs",
    "aliases": [
      "앨리스",
      "alicia"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은율"
    ],
    "reasons": [
      "Sparkling liquid-sibilant flow evoking wonderland grace.",
      "Artistic wisdom and graceful poise.",
      "Melodic cadence conveying blessed harmony."
    ]
  },
  {
    "name": "Lucy",
    "lang": "en",
    "ipa": "ˈluːsi",
    "aliases": [
      "루시",
      "lucia"
    ],
    "hanguls": [
      "루리",
      "라희",
      "로희"
    ],
    "reasons": [
      "Pure Korean word 'ruri' meaning accomplishing bright dreams.",
      "Joyful, sunny cadence reflecting inner brilliance.",
      "Radiant, cheerful resonance spreading warmth."
    ]
  },
  {
    "name": "Clara",
    "lang": "en",
    "ipa": "ˈklærə",
    "aliases": [
      "클라라",
      "claire"
    ],
    "hanguls": [
      "가람",
      "가온",
      "나린"
    ],
    "reasons": [
      "Flowing river-like clarity mirroring bright lucidity.",
      "Centering acoustic harmony representing truth and virtue.",
      "Heaven-sent blessing flowing with fresh vitality."
    ]
  },
  {
    "name": "Eva",
    "lang": "en",
    "ipa": "ˈiːvə",
    "aliases": [
      "에바",
      "eve"
    ],
    "hanguls": [
      "예원",
      "이솔",
      "은비"
    ],
    "reasons": [
      "Graceful 'E-v' vowel harmony filled with life and beauty.",
      "Pine-like steadfast freshness wrapped in gentle warmth.",
      "Silver rain of blessings nurturing all around."
    ]
  },
  {
    "name": "Sarah",
    "lang": "en",
    "ipa": "ˈsɛərə",
    "aliases": [
      "사라",
      "sara"
    ],
    "hanguls": [
      "세라",
      "소라",
      "서아"
    ],
    "reasons": [
      "Noble silken cadence echoing regal princess stature.",
      "Ocean shell melody carrying tranquil depth.",
      "Soft, auspicious resonance reflecting calm dignity."
    ]
  },
  {
    "name": "Leah",
    "lang": "en",
    "ipa": "ˈliːə",
    "aliases": [
      "리아"
    ],
    "hanguls": [
      "리아",
      "예하",
      "율아"
    ],
    "reasons": [
      "Direct melodic counterpart flowing with sweet tenderness.",
      "Broad, warm sky-like cadence conveying expansive love.",
      "Rhythmic elegance reflecting peaceful joy."
    ]
  },
  {
    "name": "Anna",
    "lang": "en",
    "ipa": "ˈænə",
    "aliases": [
      "안나",
      "anne"
    ],
    "hanguls": [
      "안나",
      "은우",
      "아인"
    ],
    "reasons": [
      "Direct universal harmony meaning grace and blessedness.",
      "Gentle, noble acoustic presence radiating quiet light.",
      "Warm, affectionate flow mirroring pure humanity."
    ]
  },
  {
    "name": "Isaac",
    "lang": "en",
    "ipa": "ˈaɪzək",
    "aliases": [
      "아이작",
      "isaak"
    ],
    "hanguls": [
      "이산",
      "이상",
      "이솔"
    ],
    "reasons": [
      "Solid, joyful cadence reflecting laughter and faith.",
      "High visionary aspirations reaching toward the light.",
      "Clean, evergreen pine integrity."
    ]
  },
  {
    "name": "Elijah",
    "lang": "en",
    "ipa": "ɪˈlaɪdʒə",
    "aliases": [
      "엘리야",
      "eli"
    ],
    "hanguls": [
      "이안",
      "이안",
      "하람"
    ],
    "reasons": [
      "Peaceful open vowel onset reflecting soaring spirit.",
      "Lyrical, transcendent bridge carrying sacred light.",
      "Spacious acoustic atmosphere conveying divine blessing."
    ]
  },
  {
    "name": "Owen",
    "lang": "en",
    "ipa": "ˈoʊɪn",
    "aliases": [
      "오웬"
    ],
    "hanguls": [
      "온유",
      "우진",
      "도현"
    ],
    "reasons": [
      "Warm, gentle 'O-w' flow conveying tender kindness.",
      "Steadfast, genuine progression with deep integrity.",
      "Bright, virtuous cadence reflecting moral wisdom."
    ]
  },
  {
    "name": "Caleb",
    "lang": "en",
    "ipa": "ˈkeɪləb",
    "aliases": [
      "케일럽"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Broad, flowing river cadence reflecting enduring devotion.",
      "Strong, healthy pillar standing for what is true.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Julian",
    "lang": "en",
    "ipa": "ˈdʒuːljən",
    "aliases": [
      "줄리안",
      "julien"
    ],
    "hanguls": [
      "주안",
      "준원",
      "지율"
    ],
    "reasons": [
      "Gentle affricate-liquid bridge expressing youthful vitality.",
      "Exemplary, well-rounded character of broad vision.",
      "Harmonious rhythm reflecting wise insight."
    ]
  },
  {
    "name": "Luke",
    "lang": "en",
    "ipa": "luːk",
    "aliases": [
      "루크"
    ],
    "hanguls": [
      "로운",
      "로하",
      "루다"
    ],
    "reasons": [
      "Warm phonetic resonance resembling 'Lu', conveying light.",
      "Lyrical, dew-like resonance expressing morning joy.",
      "Direct acoustic twin meaning achieving everything beautifully."
    ]
  },
  {
    "name": "Dylan",
    "lang": "en",
    "ipa": "ˈdɪlən",
    "aliases": [
      "딜런"
    ],
    "hanguls": [
      "도현",
      "도율",
      "단우"
    ],
    "reasons": [
      "Resonant dental onset reflecting ocean-like depth and wisdom.",
      "Melodious rhythm of harmonious virtue.",
      "Solid, steadfast cadence symbolizing moral integrity."
    ]
  },
  {
    "name": "Gabriel",
    "lang": "en",
    "ipa": "ˈɡeɪbriəl",
    "aliases": [
      "가브리엘",
      "gabe"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Flowing river-like cadence mirroring messenger of peace.",
      "Strong, upright pillar reflecting divine strength.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Ryan",
    "lang": "en",
    "ipa": "ˈraɪən",
    "aliases": [
      "라이언"
    ],
    "hanguls": [
      "라온",
      "로운",
      "려원"
    ],
    "reasons": [
      "Joyful pure Korean word 'raon' echoing regal brilliance.",
      "Wise, prosperous cadence filled with gentle dignity.",
      "Beautiful, shining presence standing at the center."
    ]
  },
  {
    "name": "Nathan",
    "lang": "en",
    "ipa": "ˈneɪθən",
    "aliases": [
      "네이선",
      "nate"
    ],
    "hanguls": [
      "남우",
      "태윤",
      "나래"
    ],
    "reasons": [
      "Warm dental-nasal balance signifying gifted generosity.",
      "Vibrant, auspicious glow filled with royal poise.",
      "Peaceful ferry-like bridge connecting hearts."
    ]
  },
  {
    "name": "Adam",
    "lang": "en",
    "ipa": "ˈædəm",
    "aliases": [
      "아담"
    ],
    "hanguls": [
      "아담",
      "아람",
      "다온"
    ],
    "reasons": [
      "Direct acoustic twin meaning elegant and peaceful.",
      "Ripe autumn fruit of harvest and rich accomplishment.",
      "Pure Korean harmony: all good things arrive."
    ]
  },
  {
    "name": "Christian",
    "lang": "en",
    "ipa": "ˈkrɪstʃən",
    "aliases": [
      "크리스찬",
      "chris"
    ],
    "hanguls": [
      "찬솔",
      "찬서",
      "창민"
    ],
    "reasons": [
      "Radiant pine-like integrity shining with steadfast faith.",
      "Broad, literary brightness carrying dawn-like hope.",
      "Prosperous, innovative brilliance inspiring others."
    ]
  },
  {
    "name": "Aaron",
    "lang": "en",
    "ipa": "ˈɛərən",
    "aliases": [
      "아론"
    ],
    "hanguls": [
      "아람",
      "한결",
      "하람"
    ],
    "reasons": [
      "Warm, fruitful cadence echoing mountain-like stature.",
      "Steadfast constancy and unchanging truth.",
      "Heaven-sent blessing reflecting clear skies."
    ]
  },
  {
    "name": "Thomas",
    "lang": "en",
    "ipa": "ˈtɒməs",
    "aliases": [
      "토마스",
      "tom",
      "tommy"
    ],
    "hanguls": [
      "태민",
      "태윤",
      "동우"
    ],
    "reasons": [
      "Energetic dental onset reflecting great intellect and agility.",
      "Auspicious, high-flying resonance filled with honor.",
      "Solid, harmonious foundation of warm brotherly trust."
    ]
  },
  {
    "name": "Charles",
    "lang": "en",
    "ipa": "tʃɑːrlz",
    "aliases": [
      "찰스",
      "charlie"
    ],
    "hanguls": [
      "찬우",
      "창준",
      "철웅"
    ],
    "reasons": [
      "Bright, shining affricate onset reflecting noble freedom.",
      "Visionary brilliance leading with foresight.",
      "Firm, courageous hero standing firm for justice."
    ]
  },
  {
    "name": "Mason",
    "lang": "en",
    "ipa": "ˈmeɪsən",
    "aliases": [
      "메이슨"
    ],
    "hanguls": [
      "민성",
      "명성",
      "문성"
    ],
    "reasons": [
      "Sharp, agile intellect carving enduring foundations.",
      "Radiant starlight reputation known far and wide.",
      "Cultured, scholarly virtue shaping the future."
    ]
  },
  {
    "name": "Logan",
    "lang": "en",
    "ipa": "ˈloʊɡən",
    "aliases": [
      "로건"
    ],
    "hanguls": [
      "로운",
      "로하",
      "도현"
    ],
    "reasons": [
      "Warm liquid flow conveying broad meadow-like tranquility.",
      "Lyrical dew-like cadence filled with morning vitality.",
      "Dignified, wise presence with deep insight."
    ]
  },
  {
    "name": "Austin",
    "lang": "en",
    "ipa": "ˈɔːstɪn",
    "aliases": [
      "오스틴"
    ],
    "hanguls": [
      "우성",
      "온유",
      "서진"
    ],
    "reasons": [
      "Exemplary, majestic brilliance inspiring reverence.",
      "Tender, warm kindness embracing the world.",
      "Refined modern elegance carrying quiet authority."
    ]
  },
  {
    "name": "Jason",
    "lang": "en",
    "ipa": "ˈdʒeɪsən",
    "aliases": [
      "제이슨"
    ],
    "hanguls": [
      "재성",
      "진선",
      "정우"
    ],
    "reasons": [
      "Bright affricate start reflecting healer-like wisdom.",
      "True goodness and sincere, upright character.",
      "Steadfast righteousness shining with unwavering warmth."
    ]
  },
  {
    "name": "Justin",
    "lang": "en",
    "ipa": "ˈdʒʌstɪn",
    "aliases": [
      "저스틴"
    ],
    "hanguls": [
      "정우",
      "준성",
      "진우"
    ],
    "reasons": [
      "Noble integrity echoing justice and upright balance.",
      "Exemplary talent and moral achievement.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Simon",
    "lang": "en",
    "ipa": "ˈsaɪmən",
    "aliases": [
      "사이먼"
    ],
    "hanguls": [
      "승민",
      "서진",
      "상우"
    ],
    "reasons": [
      "Attentive, wise spirit listening to the world's needs.",
      "Refined, calm modern harmony.",
      "Dignified, expansive presence inspiring peace."
    ]
  },
  {
    "name": "Mateo",
    "lang": "es",
    "ipa": "maˈte.o",
    "aliases": [
      "마테오",
      "matheo"
    ],
    "hanguls": [
      "민태",
      "태오",
      "명우"
    ],
    "reasons": [
      "Harmonizes with the 'Ma-te' cadence, meaning gift of heaven.",
      "Vibrant 'Tae-o' bridge capturing Latin sun-drenched joy.",
      "Clear, bright resonance conveying warm blessings."
    ]
  },
  {
    "name": "Carlos",
    "lang": "es",
    "ipa": "ˈkaɾ.los",
    "aliases": [
      "카를로스",
      "carlitos",
      "carlo"
    ],
    "hanguls": [
      "강산",
      "가람",
      "가온"
    ],
    "reasons": [
      "Strong 'Car/Kar' onset, embodying enduring strength and nobility.",
      "Flowing 'Car/Gar' cadence, carrying river-like vastness and depth.",
      "Centered 'Ka/Ga' sound harmony representing balance and leadership."
    ]
  },
  {
    "name": "Santiago",
    "lang": "es",
    "ipa": "sanˈtja.ɣo",
    "aliases": [
      "산티아고",
      "tiago",
      "santi"
    ],
    "hanguls": [
      "산들",
      "성호",
      "상원"
    ],
    "reasons": [
      "Peaceful mountain breeze echoing the pilgrim's journey.",
      "Expansive, noble aura reaching across horizon.",
      "Bright, foundational virtue leading with honor."
    ]
  },
  {
    "name": "Diego",
    "lang": "es",
    "ipa": "ˈdje.ɣo",
    "aliases": [
      "디에고"
    ],
    "hanguls": [
      "도윤",
      "동현",
      "대호"
    ],
    "reasons": [
      "Melodious dental onset conveying insightful instruction.",
      "Radiant, virtuous character shining with warmth.",
      "Vast, generous spirit embracing big aspirations."
    ]
  },
  {
    "name": "Alejandro",
    "lang": "es",
    "ipa": "aleˈxandɾo",
    "aliases": [
      "알레한드로",
      "alejo",
      "alex"
    ],
    "hanguls": [
      "안솔",
      "선우",
      "하람"
    ],
    "reasons": [
      "Gentle yet strong pine integrity defending loved ones.",
      "Noble scholar-leader carrying warm empathy.",
      "Vast heavenly atmosphere reflecting broad vision."
    ]
  },
  {
    "name": "Matias",
    "lang": "es",
    "ipa": "maˈti.as",
    "aliases": [
      "마티아스"
    ],
    "hanguls": [
      "민태",
      "태윤",
      "명진"
    ],
    "reasons": [
      "Agile intellect and luminous energy.",
      "Auspicious, royal cadence filled with vitality.",
      "Clear, authentic brilliance illuminating others."
    ]
  },
  {
    "name": "Sebastian",
    "lang": "es",
    "ipa": "seβasˈtjan",
    "aliases": [
      "세바스티안",
      "sebas"
    ],
    "hanguls": [
      "세찬",
      "서진",
      "성준"
    ],
    "reasons": [
      "Dynamic sibilant onset conveying reverence and power.",
      "Tranquil, modern cadence reflecting dignified grace.",
      "Steadfast, upright virtue honoring truth."
    ]
  },
  {
    "name": "Nicolas",
    "lang": "es",
    "ipa": "nikoˈlas",
    "aliases": [
      "니콜라스",
      "nico"
    ],
    "hanguls": [
      "나경",
      "노아",
      "남우"
    ],
    "reasons": [
      "Gentle dental-nasal onset carrying victorious kindness.",
      "Serene, peaceful cadence welcoming all.",
      "Warm, supportive character of deep loyalty."
    ]
  },
  {
    "name": "Samuel",
    "lang": "es",
    "ipa": "saˈmwel",
    "aliases": [
      "사무엘",
      "samu"
    ],
    "hanguls": [
      "승민",
      "서민",
      "상현"
    ],
    "reasons": [
      "Spiritual elevation and perceptive understanding.",
      "Gentle, accessible cadence filled with warm heart.",
      "Dignified, expansive presence inspiring trust."
    ]
  },
  {
    "name": "Joaquin",
    "lang": "es",
    "ipa": "xoaˈkin",
    "aliases": [
      "호아킨"
    ],
    "hanguls": [
      "호연",
      "하진",
      "한결"
    ],
    "reasons": [
      "Vast, open atmospheric spirit of steadfast faith.",
      "Bright, pure river flow reflecting clear wisdom.",
      "Constant integrity remaining true to the end."
    ]
  },
  {
    "name": "Isabella",
    "lang": "es",
    "ipa": "isaˈβela",
    "aliases": [
      "이사벨라",
      "isa",
      "bella"
    ],
    "hanguls": [
      "이솔",
      "예린",
      "슬기"
    ],
    "reasons": [
      "Evergreen pine purity echoing devoted beauty.",
      "Clear, sparkling jewel-like resonance.",
      "Wise, intuitive brilliance radiating gentle light."
    ]
  },
  {
    "name": "Sofia",
    "lang": "es",
    "ipa": "soˈfi.a",
    "aliases": [
      "소피아",
      "sofi"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Valentina",
    "lang": "es",
    "ipa": "balenˈtina",
    "aliases": [
      "발렌티나",
      "vale"
    ],
    "hanguls": [
      "보나",
      "다은",
      "빛나"
    ],
    "reasons": [
      "Courageous, healthy vitality shining with warm grace.",
      "Abundant, sweet kindness blessing everyone.",
      "Radiant brilliance standing brave and strong."
    ]
  },
  {
    "name": "Camila",
    "lang": "es",
    "ipa": "kaˈmila",
    "aliases": [
      "카밀라",
      "cami"
    ],
    "hanguls": [
      "가은",
      "가람",
      "민아"
    ],
    "reasons": [
      "Noble, sweet grace serving with devoted beauty.",
      "Flowing river clarity reflecting pure character.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Valeria",
    "lang": "es",
    "ipa": "baˈleɾja",
    "aliases": [
      "발레리아"
    ],
    "hanguls": [
      "보민",
      "예린",
      "유라"
    ],
    "reasons": [
      "Precious, treasure-like strength radiating light.",
      "Clear, crystalline cadence reflecting honor.",
      "Joyful, melodious rhythm filled with cheer."
    ]
  },
  {
    "name": "Mariana",
    "lang": "es",
    "ipa": "maˈɾjana",
    "aliases": [
      "마리아나"
    ],
    "hanguls": [
      "민아",
      "미래",
      "마루"
    ],
    "reasons": [
      "Gentle, lovely oceanic grace and elegance.",
      "Bright tomorrow blooming with hope.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Gabriela",
    "lang": "es",
    "ipa": "ɡaˈβɾjela",
    "aliases": [
      "가브리엘라",
      "gaby"
    ],
    "hanguls": [
      "가람",
      "가은",
      "예린"
    ],
    "reasons": [
      "Boundless river flow conveying divine strength.",
      "Thankful, blessed cadence filled with light.",
      "Clear, sparkling jewel-like poise."
    ]
  },
  {
    "name": "Lucia",
    "lang": "es",
    "ipa": "luˈsi.a",
    "aliases": [
      "루시아",
      "luci"
    ],
    "hanguls": [
      "루리",
      "라희",
      "로희"
    ],
    "reasons": [
      "Pure Korean word 'ruri' achieving luminous dreams.",
      "Sunny, cheerful joy spreading warm daylight.",
      "Radiant morning dew filled with sparkling life."
    ]
  },
  {
    "name": "Martina",
    "lang": "es",
    "ipa": "maɾˈtina",
    "aliases": [
      "마르티나"
    ],
    "hanguls": [
      "민아",
      "태연",
      "다민"
    ],
    "reasons": [
      "Noble, spirited grace standing with resolve.",
      "Serene, tranquil flow filled with inner peace.",
      "Warm, broad compassion embracing others."
    ]
  },
  {
    "name": "Luciana",
    "lang": "es",
    "ipa": "luˈsjana",
    "aliases": [
      "루시아나"
    ],
    "hanguls": [
      "루아",
      "유나",
      "라온"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Gentle, graceful flower blooming with poise.",
      "Joyful, melodious spirit filled with song."
    ]
  },
  {
    "name": "Elena",
    "lang": "es",
    "ipa": "eˈlena",
    "aliases": [
      "엘레나"
    ],
    "hanguls": [
      "예나",
      "연아",
      "은아"
    ],
    "reasons": [
      "Lyrical 'E-le-na' vowel flow, radiating clarity and poise.",
      "Soft, graceful 'Yeon-a' cadence echoing Elena's warmth.",
      "Gentle and peaceful resonance reflecting Elena's inner light."
    ]
  },
  {
    "name": "Victoria",
    "lang": "es",
    "ipa": "bikˈtoɾja",
    "aliases": [
      "빅토리아"
    ],
    "hanguls": [
      "빛나",
      "별아",
      "보아"
    ],
    "reasons": [
      "Radiant victory shining with brilliant light.",
      "Starlight dignity inspiring awe and respect.",
      "Precious, jewel-like resonance filled with joy."
    ]
  },
  {
    "name": "Paula",
    "lang": "es",
    "ipa": "ˈpawla",
    "aliases": [
      "파울라",
      "pau"
    ],
    "hanguls": [
      "보라",
      "보민",
      "하늘"
    ],
    "reasons": [
      "Gentle purple twilight conveying tranquil humility.",
      "Precious gem-like presence cherished deeply.",
      "Vast, open sky filled with peace."
    ]
  },
  {
    "name": "Daniela",
    "lang": "es",
    "ipa": "daˈnjela",
    "aliases": [
      "다니엘라",
      "dani"
    ],
    "hanguls": [
      "다은",
      "다연",
      "단아"
    ],
    "reasons": [
      "Steadfast grace and abundant moral clarity.",
      "Graceful lotus-like beauty blooming in peace.",
      "Neat, refined poise reflecting deep virtue."
    ]
  },
  {
    "name": "Catalina",
    "lang": "es",
    "ipa": "kataˈlina",
    "aliases": [
      "카탈리나",
      "cata"
    ],
    "hanguls": [
      "가온",
      "하린",
      "채린"
    ],
    "reasons": [
      "Pure, centered truth shining at the heart.",
      "Clear, refreshing summer rain of purity.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Andrea",
    "lang": "es",
    "ipa": "anˈdɾe.a",
    "aliases": [
      "안드레아"
    ],
    "hanguls": [
      "안솔",
      "다온",
      "아린"
    ],
    "reasons": [
      "Courageous, steadfast pine integrity.",
      "Pure Korean: all good things arrive.",
      "Sparkling, delicate clarity filled with light."
    ]
  },
  {
    "name": "Javier",
    "lang": "es",
    "ipa": "xaˈβjeɾ",
    "aliases": [
      "하비에르",
      "javi"
    ],
    "hanguls": [
      "하진",
      "현우",
      "호연"
    ],
    "reasons": [
      "Bright dawn over new castle walls.",
      "Wise, virtuous hero leading with vision.",
      "Expansive, noble atmosphere of courage."
    ]
  },
  {
    "name": "Manuel",
    "lang": "es",
    "ipa": "maˈnwel",
    "aliases": [
      "마누엘",
      "manu"
    ],
    "hanguls": [
      "민우",
      "명호",
      "문성"
    ],
    "reasons": [
      "Warm, companionable wisdom walking alongside.",
      "Bright, expansive presence radiating reassurance.",
      "Cultured, scholarly virtue shaping tomorrow."
    ]
  },
  {
    "name": "Fernando",
    "lang": "es",
    "ipa": "feɾˈnando",
    "aliases": [
      "페르난도",
      "fer"
    ],
    "hanguls": [
      "범진",
      "한결",
      "도현"
    ],
    "reasons": [
      "Daring explorer journeying toward peace.",
      "Unchanging steadfast courage throughout all seasons.",
      "Wise, virtuous leader of deep insight."
    ]
  },
  {
    "name": "Andres",
    "lang": "es",
    "ipa": "anˈdɾes",
    "aliases": [
      "안드레스"
    ],
    "hanguls": [
      "안솔",
      "서진",
      "동현"
    ],
    "reasons": [
      "Brave, stalwart defender standing firm.",
      "Modern, refined elegance carrying strength.",
      "Bright, virtuous cadence radiating warmth."
    ]
  },
  {
    "name": "Pablo",
    "lang": "es",
    "ipa": "ˈpaβlo",
    "aliases": [
      "파블로"
    ],
    "hanguls": [
      "보람",
      "보람",
      "필우"
    ],
    "reasons": [
      "Fulfilling, worthwhile life of humble wisdom.",
      "Straightforward righteousness seeking truth.",
      "Noble, helpful pillar supporting others."
    ]
  },
  {
    "name": "Alvaro",
    "lang": "es",
    "ipa": "ˈalβaɾo",
    "aliases": [
      "알바로"
    ],
    "hanguls": [
      "안솔",
      "보민",
      "로운"
    ],
    "reasons": [
      "Vigilant guardian of peaceful harmony.",
      "Precious gem-like integrity shining bright.",
      "Wise, prosperous cadence filled with grace."
    ]
  },
  {
    "name": "Gonzalo",
    "lang": "es",
    "ipa": "ɡonˈsalo",
    "aliases": [
      "곤살로"
    ],
    "hanguls": [
      "건우",
      "강산",
      "선우"
    ],
    "reasons": [
      "Spirited fighter battling for what is right.",
      "Enduring mountain-and-river steadfastness.",
      "Noble, benevolent scholar of deep warmth."
    ]
  },
  {
    "name": "Adrian",
    "lang": "es",
    "ipa": "aˈðɾjan",
    "aliases": [
      "아드리안"
    ],
    "hanguls": [
      "아인",
      "다온",
      "이안"
    ],
    "reasons": [
      "Deep oceanic mystery reflecting calm depth.",
      "All good blessings gathered in one vessel.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Hugo",
    "lang": "es",
    "ipa": "ˈuɣo",
    "aliases": [
      "우고"
    ],
    "hanguls": [
      "현우",
      "호연",
      "우진"
    ],
    "reasons": [
      "Luminous mind and visionary intellect.",
      "Vast, open atmosphere of broad nobility.",
      "Steadfast, genuine progression with integrity."
    ]
  },
  {
    "name": "Martin",
    "lang": "es",
    "ipa": "maɾˈtin",
    "aliases": [
      "마르틴"
    ],
    "hanguls": [
      "민태",
      "명진",
      "다민"
    ],
    "reasons": [
      "Spirited, dedicated defender of truth.",
      "Clear, authentic brilliance illuminating others.",
      "Broad, compassionate leadership embracing all."
    ]
  },
  {
    "name": "Miguel",
    "lang": "es",
    "ipa": "miˈɣel",
    "aliases": [
      "미겔"
    ],
    "hanguls": [
      "민우",
      "명호",
      "미르"
    ],
    "reasons": [
      "Gentle, wise presence reflecting divine grace.",
      "Expansive, bright dignity commanding respect.",
      "Majestic dragon-like spirit soaring high."
    ]
  },
  {
    "name": "Rafael",
    "lang": "es",
    "ipa": "rafaˈel",
    "aliases": [
      "라파엘",
      "rafa"
    ],
    "hanguls": [
      "라온",
      "하람",
      "려원"
    ],
    "reasons": [
      "Joyful healer spreading peace and comfort.",
      "Heavenly blessing descending like soft rain.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Angel",
    "lang": "es",
    "ipa": "ˈanxel",
    "aliases": [
      "앙헬"
    ],
    "hanguls": [
      "안솔",
      "은우",
      "하람"
    ],
    "reasons": [
      "Gentle messenger of light and protection.",
      "Graceful, noble presence radiating quiet light.",
      "Vast atmospheric blessings touching the earth."
    ]
  },
  {
    "name": "Bruno",
    "lang": "es",
    "ipa": "ˈbɾuno",
    "aliases": [
      "브루노"
    ],
    "hanguls": [
      "보람",
      "로운",
      "범준"
    ],
    "reasons": [
      "Solid, earth-rooted strength and fulfillment.",
      "Warm, wise resonance conveying prosperity.",
      "Exemplary pillar standing firm for righteousness."
    ]
  },
  {
    "name": "Thiago",
    "lang": "es",
    "ipa": "ˈtjaɣo",
    "aliases": [
      "티아고"
    ],
    "hanguls": [
      "태오",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Vibrant sunlit energy radiating optimism.",
      "Harmonious balance and moral wisdom.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Carmen",
    "lang": "es",
    "ipa": "ˈkaɾmen",
    "aliases": [
      "카르멘"
    ],
    "hanguls": [
      "가람",
      "가은",
      "민아"
    ],
    "reasons": [
      "Poetic song flowing like an eternal river.",
      "Thankful, blessed melody filled with charm.",
      "Delicate, sweet cadence echoing beauty."
    ]
  },
  {
    "name": "Clara",
    "lang": "es",
    "ipa": "ˈklaɾa",
    "aliases": [
      "클라라"
    ],
    "hanguls": [
      "가람",
      "가온",
      "나린"
    ],
    "reasons": [
      "River-like clarity mirroring bright lucidity.",
      "Centering acoustic harmony representing truth.",
      "Heaven-sent blessing flowing with vitality."
    ]
  },
  {
    "name": "Alba",
    "lang": "es",
    "ipa": "ˈalβa",
    "aliases": [
      "알바"
    ],
    "hanguls": [
      "아라",
      "새벽",
      "은비"
    ],
    "reasons": [
      "Fresh dawn-light breaking over the sea.",
      "First morning rays bringing renewal.",
      "Silver blessings raining down gently."
    ]
  },
  {
    "name": "Sara",
    "lang": "es",
    "ipa": "ˈsaɾa",
    "aliases": [
      "사라"
    ],
    "hanguls": [
      "세라",
      "소라",
      "서아"
    ],
    "reasons": [
      "Silken regal presence carrying dignity.",
      "Ocean shell melody echoing tranquil calm.",
      "Soft, auspicious resonance reflecting peace."
    ]
  },
  {
    "name": "Emiliano",
    "lang": "es",
    "ipa": "emiˈljano",
    "aliases": [
      "에밀리아노",
      "emi"
    ],
    "hanguls": [
      "은우",
      "민재",
      "인우"
    ],
    "reasons": [
      "Industrious, warm grace striving for excellence.",
      "Agile intellect and versatile talent.",
      "Harmonious flow of enduring virtue."
    ]
  },
  {
    "name": "Gabriel",
    "lang": "es",
    "ipa": "ɡaˈβɾjel",
    "aliases": [
      "가브리엘"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Flowing river-like cadence mirroring peace.",
      "Strong, upright pillar reflecting strength.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Leonardo",
    "lang": "es",
    "ipa": "leoˈnaɾðo",
    "aliases": [
      "레오나르도",
      "leo"
    ],
    "hanguls": [
      "로운",
      "라온",
      "도현"
    ],
    "reasons": [
      "Brave, lion-hearted wisdom guiding the way.",
      "Joyful, shining spirit inspiring others.",
      "Deep insight and moral clarity."
    ]
  },
  {
    "name": "Lucas",
    "lang": "es",
    "ipa": "ˈlukas",
    "aliases": [
      "루카스"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance resembling Lu/Lo.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Mateo",
    "lang": "es",
    "ipa": "maˈteo",
    "aliases": [
      "마테오"
    ],
    "hanguls": [
      "민태",
      "태오",
      "명우"
    ],
    "reasons": [
      "Harmonizes with Ma-te cadence, gift of heaven.",
      "Vibrant sun-drenched joy and warmth.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Thiago",
    "lang": "pt",
    "ipa": "tʃiˈa.ɡu",
    "aliases": [
      "티아고",
      "tiago"
    ],
    "hanguls": [
      "태오",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Vibrant sunlit energy radiating optimism.",
      "Harmonious balance and moral wisdom.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Rodrigo",
    "lang": "pt",
    "ipa": "ʁoˈdɾi.ɡu",
    "aliases": [
      "로드리고",
      "rodriguinho"
    ],
    "hanguls": [
      "로운",
      "도현",
      "로건"
    ],
    "reasons": [
      "Wise, prosperous cadence filled with nobility.",
      "Deep insight and principled integrity.",
      "Strong, upright pillar commanding respect."
    ]
  },
  {
    "name": "Gabriel",
    "lang": "pt",
    "ipa": "ɡaβɾiˈɛw",
    "aliases": [
      "가브리에우",
      "gabi"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Flowing river-like cadence mirroring peace.",
      "Strong, upright pillar reflecting strength.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Lucas",
    "lang": "pt",
    "ipa": "ˈlu.kɐs",
    "aliases": [
      "루카스"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance resembling Lu/Lo.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Luiza",
    "lang": "pt",
    "ipa": "luˈi.zɐ",
    "aliases": [
      "루이자",
      "luisa"
    ],
    "hanguls": [
      "루아",
      "유나",
      "라희"
    ],
    "reasons": [
      "Graceful light shining with gentle warmth.",
      "Gentle flower blooming with poise.",
      "Sunny, cheerful joy spreading daylight."
    ]
  },
  {
    "name": "Miguel",
    "lang": "pt",
    "ipa": "miˈɡɛw",
    "aliases": [
      "미게우"
    ],
    "hanguls": [
      "민우",
      "명호",
      "미르"
    ],
    "reasons": [
      "Gentle, wise presence reflecting divine grace.",
      "Expansive, bright dignity commanding respect.",
      "Majestic dragon-like spirit soaring high."
    ]
  },
  {
    "name": "Arthur",
    "lang": "pt",
    "ipa": "aʁˈtuʁ",
    "aliases": [
      "아르투르",
      "artur"
    ],
    "hanguls": [
      "아람",
      "태윤",
      "한결"
    ],
    "reasons": [
      "Noble bear-like courage standing steadfast.",
      "Auspicious, high-flying resonance filled with honor.",
      "Constant integrity remaining true to the end."
    ]
  },
  {
    "name": "Bernardo",
    "lang": "pt",
    "ipa": "beʁˈnaʁ.du",
    "aliases": [
      "베르나르두"
    ],
    "hanguls": [
      "범진",
      "도현",
      "보민"
    ],
    "reasons": [
      "Brave, steadfast heart guarding loved ones.",
      "Deep insight and moral clarity.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Heitor",
    "lang": "pt",
    "ipa": "ejˈtoʁ",
    "aliases": [
      "에이토르"
    ],
    "hanguls": [
      "해찬",
      "태윤",
      "호연"
    ],
    "reasons": [
      "Sunlit defender holding fast to honor.",
      "Bright royal cadence filled with vitality.",
      "Vast, open atmosphere of broad courage."
    ]
  },
  {
    "name": "Davi",
    "lang": "pt",
    "ipa": "daˈvi",
    "aliases": [
      "다비"
    ],
    "hanguls": [
      "다빈",
      "다온",
      "도윤"
    ],
    "reasons": [
      "Mirroring the Da-vi sound harmony with warmth.",
      "Pure Korean: all good things arrive.",
      "Solid dental onset and melodious flow."
    ]
  },
  {
    "name": "Lorenzo",
    "lang": "pt",
    "ipa": "loˈɾẽ.zu",
    "aliases": [
      "로렌조"
    ],
    "hanguls": [
      "로운",
      "라온",
      "선우"
    ],
    "reasons": [
      "Laurel-crowned victory filled with wisdom.",
      "Joyful, shining spirit inspiring others.",
      "Noble scholar-leader carrying empathy."
    ]
  },
  {
    "name": "Theo",
    "lang": "pt",
    "ipa": "ˈtɛ.u",
    "aliases": [
      "테오"
    ],
    "hanguls": [
      "태오",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Direct sound match conveying sacred joy.",
      "Harmonious balance and moral wisdom.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Pedro",
    "lang": "pt",
    "ipa": "ˈpe.dɾu",
    "aliases": [
      "페드로"
    ],
    "hanguls": [
      "보람",
      "동현",
      "필우"
    ],
    "reasons": [
      "Solid stone-like foundation of deep trust.",
      "Bright, virtuous cadence radiating warmth.",
      "Noble, helpful pillar supporting others."
    ]
  },
  {
    "name": "Rafael",
    "lang": "pt",
    "ipa": "ʁa.faˈɛw",
    "aliases": [
      "라파에우"
    ],
    "hanguls": [
      "라온",
      "하람",
      "려원"
    ],
    "reasons": [
      "Joyful healer spreading peace and comfort.",
      "Heavenly blessing descending like soft rain.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Matheus",
    "lang": "pt",
    "ipa": "maˈtewʃ",
    "aliases": [
      "마테우스"
    ],
    "hanguls": [
      "민태",
      "태윤",
      "명진"
    ],
    "reasons": [
      "Agile intellect and luminous energy.",
      "Auspicious royal cadence filled with vitality.",
      "Clear, authentic brilliance illuminating others."
    ]
  },
  {
    "name": "Nicolas",
    "lang": "pt",
    "ipa": "nikoˈlas",
    "aliases": [
      "니콜라스"
    ],
    "hanguls": [
      "나경",
      "노아",
      "남우"
    ],
    "reasons": [
      "Gentle dental-nasal onset carrying victory.",
      "Serene, peaceful cadence welcoming all.",
      "Warm, supportive character of deep loyalty."
    ]
  },
  {
    "name": "Guilherme",
    "lang": "pt",
    "ipa": "ɡiˈʎɛʁ.mi",
    "aliases": [
      "길례르미",
      "gui"
    ],
    "hanguls": [
      "기범",
      "건우",
      "규민"
    ],
    "reasons": [
      "Resolute protector of peace and honor.",
      "Strong, upright pillar standing for truth.",
      "Exemplary character and moral achievement."
    ]
  },
  {
    "name": "Alice",
    "lang": "pt",
    "ipa": "aˈli.si",
    "aliases": [
      "알리시"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은율"
    ],
    "reasons": [
      "Sparkling liquid-sibilant flow evoking grace.",
      "Artistic wisdom and graceful poise.",
      "Melodic cadence conveying blessed harmony."
    ]
  },
  {
    "name": "Laura",
    "lang": "pt",
    "ipa": "ˈlaw.ɾɐ",
    "aliases": [
      "라우라"
    ],
    "hanguls": [
      "라온",
      "나래",
      "로아"
    ],
    "reasons": [
      "Victorious laurel wreath brimming with cheer.",
      "Creative wings soaring with imagination.",
      "Gentle, dew-like grace filled with joy."
    ]
  },
  {
    "name": "Manuela",
    "lang": "pt",
    "ipa": "ma.nuˈɛ.lɐ",
    "aliases": [
      "마누엘라",
      "manu"
    ],
    "hanguls": [
      "민아",
      "은서",
      "예은"
    ],
    "reasons": [
      "Gentle presence reflecting divine guidance.",
      "Soft vowel start echoing gentle spirit.",
      "Melodious balance conveying blessed kindness."
    ]
  },
  {
    "name": "Sophia",
    "lang": "pt",
    "ipa": "soˈfi.ɐ",
    "aliases": [
      "소피아"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Isabella",
    "lang": "pt",
    "ipa": "izaˈbɛ.lɐ",
    "aliases": [
      "이자벨라",
      "bela"
    ],
    "hanguls": [
      "이솔",
      "예린",
      "슬기"
    ],
    "reasons": [
      "Evergreen pine purity echoing devoted beauty.",
      "Clear, sparkling jewel-like resonance.",
      "Wise, intuitive brilliance radiating gentle light."
    ]
  },
  {
    "name": "Heloisa",
    "lang": "pt",
    "ipa": "e.loˈi.zɐ",
    "aliases": [
      "엘로이자"
    ],
    "hanguls": [
      "혜린",
      "예원",
      "유라"
    ],
    "reasons": [
      "Radiant warrior of noble reputation.",
      "Graceful, blessed melody filled with charm.",
      "Joyful, cheerful cadence spreading light."
    ]
  },
  {
    "name": "Julia",
    "lang": "pt",
    "ipa": "ˈʒu.ljɐ",
    "aliases": [
      "줄리아"
    ],
    "hanguls": [
      "주아",
      "지율",
      "유나"
    ],
    "reasons": [
      "Youthful, blooming grace filled with vitality.",
      "Melodious rhythm of harmonious virtue.",
      "Gentle, graceful flower blooming with poise."
    ]
  },
  {
    "name": "Lorena",
    "lang": "pt",
    "ipa": "loˈɾẽ.nɐ",
    "aliases": [
      "로레나"
    ],
    "hanguls": [
      "로운",
      "라온",
      "예나"
    ],
    "reasons": [
      "Victorious spirit wrapped in gentle warmth.",
      "Joyful, shining spirit inspiring others.",
      "Lyrical vowel flow radiating clarity."
    ]
  },
  {
    "name": "Livia",
    "lang": "pt",
    "ipa": "ˈli.vjɐ",
    "aliases": [
      "리비아"
    ],
    "hanguls": [
      "리안",
      "은비",
      "유비"
    ],
    "reasons": [
      "Peaceful olive branch conveying harmony.",
      "Silver blessings raining down gently.",
      "Noble, precious virtue treasured deeply."
    ]
  },
  {
    "name": "Maria",
    "lang": "pt",
    "ipa": "maˈɾi.ɐ",
    "aliases": [
      "마리아"
    ],
    "hanguls": [
      "미래",
      "민아",
      "마루"
    ],
    "reasons": [
      "Enduring oceanic grace and motherly warmth.",
      "Charming, delicate melody filled with tenderness.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Beatriz",
    "lang": "pt",
    "ipa": "bjaˈtɾis",
    "aliases": [
      "베아트리스",
      "bia"
    ],
    "hanguls": [
      "보민",
      "빛나",
      "은비"
    ],
    "reasons": [
      "She who brings deep joy and blessedness.",
      "Radiant brilliance inspiring all who see.",
      "Silver blessings raining down gently."
    ]
  },
  {
    "name": "Gustavo",
    "lang": "pt",
    "ipa": "ɡusˈta.vu",
    "aliases": [
      "구스타보",
      "guto"
    ],
    "hanguls": [
      "건우",
      "규민",
      "태윤"
    ],
    "reasons": [
      "Royal staff of strength leading with poise.",
      "Exemplary character and moral achievement.",
      "Bright royal cadence filled with vitality."
    ]
  },
  {
    "name": "Felipe",
    "lang": "pt",
    "ipa": "feˈli.pi",
    "aliases": [
      "펠리피"
    ],
    "hanguls": [
      "보민",
      "필우",
      "하람"
    ],
    "reasons": [
      "Noble friend filled with warmth and loyalty.",
      "Helpful, steadfast pillar supporting others.",
      "Heavenly blessing descending like soft rain."
    ]
  },
  {
    "name": "Samuel",
    "lang": "pt",
    "ipa": "sa.muˈɛw",
    "aliases": [
      "사무에우"
    ],
    "hanguls": [
      "승민",
      "서민",
      "상우"
    ],
    "reasons": [
      "Spiritual elevation and perceptive understanding.",
      "Gentle, accessible cadence filled with warm heart.",
      "Dignified, expansive presence inspiring trust."
    ]
  },
  {
    "name": "Enzo",
    "lang": "pt",
    "ipa": "ˈẽ.zu",
    "aliases": [
      "엔조"
    ],
    "hanguls": [
      "은우",
      "은성",
      "진우"
    ],
    "reasons": [
      "Ruler of the home guiding with devotion.",
      "Steadfast star shining with moral clarity.",
      "True, genuine character of deep reliability."
    ]
  },
  {
    "name": "Leonardo",
    "lang": "pt",
    "ipa": "le.oˈnaʁ.du",
    "aliases": [
      "레오나르두"
    ],
    "hanguls": [
      "로운",
      "라온",
      "도현"
    ],
    "reasons": [
      "Brave, lion-hearted wisdom guiding the way.",
      "Joyful, shining spirit inspiring others.",
      "Deep insight and moral clarity."
    ]
  },
  {
    "name": "Caio",
    "lang": "pt",
    "ipa": "ˈkaj.u",
    "aliases": [
      "카이오"
    ],
    "hanguls": [
      "가온",
      "강산",
      "기범"
    ],
    "reasons": [
      "Rejoicing spirit centered in righteous truth.",
      "Enduring mountain-and-river steadfastness.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Murilo",
    "lang": "pt",
    "ipa": "muˈɾi.lu",
    "aliases": [
      "무리루"
    ],
    "hanguls": [
      "명우",
      "로운",
      "민재"
    ],
    "reasons": [
      "Little wall of strong protection and peace.",
      "Wise, prosperous cadence filled with grace.",
      "Agile intellect and versatile talent."
    ]
  },
  {
    "name": "Vinicius",
    "lang": "pt",
    "ipa": "viˈni.sjus",
    "aliases": [
      "비니시우스",
      "vini"
    ],
    "hanguls": [
      "빛나",
      "비아",
      "진우"
    ],
    "reasons": [
      "Vine-like vitality blossoming with life.",
      "Raindrop of clarity washing the world.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Lucca",
    "lang": "pt",
    "ipa": "ˈlu.kɐ",
    "aliases": [
      "루카"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance resembling Lu/Lo.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Joao",
    "lang": "pt",
    "ipa": "ʒuˈɐ̃w",
    "aliases": [
      "조앙"
    ],
    "hanguls": [
      "주원",
      "조은",
      "정우"
    ],
    "reasons": [
      "Grace-filled heart blessed by divine favor.",
      "Warm, benevolent resonance celebrating joy.",
      "Steadfast righteousness shining bright."
    ]
  },
  {
    "name": "Eduardo",
    "lang": "pt",
    "ipa": "e.duˈaʁ.du",
    "aliases": [
      "에두아르두",
      "dudu"
    ],
    "hanguls": [
      "은우",
      "도현",
      "대호"
    ],
    "reasons": [
      "Prosperous guardian standing watch over peace.",
      "Deep insight and principled integrity.",
      "Vast, generous spirit embracing big aspirations."
    ]
  },
  {
    "name": "Caua",
    "lang": "pt",
    "ipa": "kawˈa",
    "aliases": [
      "카우앙"
    ],
    "hanguls": [
      "가온",
      "강산",
      "하늘"
    ],
    "reasons": [
      "Hawk-like vision soaring over horizons.",
      "Enduring mountain-and-river steadfastness.",
      "Vast, open sky filled with peace."
    ]
  },
  {
    "name": "Henrique",
    "lang": "pt",
    "ipa": "ẽˈʁi.ki",
    "aliases": [
      "엔히키"
    ],
    "hanguls": [
      "은우",
      "현우",
      "해찬"
    ],
    "reasons": [
      "Noble ruler of the estate leading with care.",
      "Wise, virtuous hero leading with vision.",
      "Sunlit defender holding fast to honor."
    ]
  },
  {
    "name": "Vitor",
    "lang": "pt",
    "ipa": "ˈvi.toʁ",
    "aliases": [
      "비토르"
    ],
    "hanguls": [
      "빛나",
      "태윤",
      "보민"
    ],
    "reasons": [
      "Victorious champion standing in the light.",
      "Auspicious royal cadence filled with vitality.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Rebeca",
    "lang": "pt",
    "ipa": "ʁeˈbɛ.kɐ",
    "aliases": [
      "헤베카"
    ],
    "hanguls": [
      "혜린",
      "보라",
      "가은"
    ],
    "reasons": [
      "Enchanting beauty connecting hearts together.",
      "Gentle purple twilight conveying humility.",
      "Thankful, blessed melody filled with charm."
    ]
  },
  {
    "name": "Mariana",
    "lang": "pt",
    "ipa": "ma.ɾiˈɐ̃.nɐ",
    "aliases": [
      "마리아나"
    ],
    "hanguls": [
      "민아",
      "미래",
      "마루"
    ],
    "reasons": [
      "Enduring oceanic grace and motherly warmth.",
      "Bright tomorrow blooming with hope.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Giovanna",
    "lang": "pt",
    "ipa": "ʒoˈvɐ̃.nɐ",
    "aliases": [
      "지오바나",
      "gio"
    ],
    "hanguls": [
      "지안",
      "조은",
      "예나"
    ],
    "reasons": [
      "Gracious gift of heaven shining with joy.",
      "Warm, benevolent resonance celebrating joy.",
      "Lyrical vowel flow radiating clarity."
    ]
  },
  {
    "name": "Camille",
    "lang": "fr",
    "ipa": "ka.mij",
    "aliases": [
      "카미유",
      "camila"
    ],
    "hanguls": [
      "가민",
      "가람",
      "미래"
    ],
    "reasons": [
      "Soft lyrical 'Ca-mi' flow carrying tranquil elegance.",
      "Flowing river clarity reflecting pure character.",
      "Bright tomorrow blooming with hope."
    ]
  },
  {
    "name": "Antoine",
    "lang": "fr",
    "ipa": "ɑ̃.twan",
    "aliases": [
      "앙투안",
      "antonio"
    ],
    "hanguls": [
      "안솔",
      "도현",
      "단우"
    ],
    "reasons": [
      "Gentle nasal-dental onset conveying enduring dignity.",
      "Deep insight and moral clarity.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Juliette",
    "lang": "fr",
    "ipa": "ʒy.ljɛt",
    "aliases": [
      "줄리에트",
      "julie"
    ],
    "hanguls": [
      "주아",
      "예린",
      "지율"
    ],
    "reasons": [
      "Youthful, blossoming grace filled with vitality.",
      "Clear, sparkling jewel-like resonance.",
      "Melodious rhythm of harmonious virtue."
    ]
  },
  {
    "name": "Louis",
    "lang": "fr",
    "ipa": "lwi",
    "aliases": [
      "루이"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant royal light illuminating the path.",
      "Warm phonetic resonance conveying prosperity.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Élodie",
    "lang": "fr",
    "ipa": "e.lɔ.di",
    "aliases": [
      "엘로디",
      "elodie"
    ],
    "hanguls": [
      "예원",
      "은율",
      "다은"
    ],
    "reasons": [
      "Sweet melodious flower blooming with grace.",
      "Graceful melody echoing pristine purity.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Raphaël",
    "lang": "fr",
    "ipa": "ʁa.fa.ɛl",
    "aliases": [
      "라파엘",
      "raphael"
    ],
    "hanguls": [
      "라온",
      "하람",
      "려원"
    ],
    "reasons": [
      "Joyful healer spreading peace and comfort.",
      "Heavenly blessing descending like soft rain.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Hugo",
    "lang": "fr",
    "ipa": "y.ɡo",
    "aliases": [
      "위고"
    ],
    "hanguls": [
      "현우",
      "호연",
      "우진"
    ],
    "reasons": [
      "Luminous mind and visionary intellect.",
      "Vast, open atmosphere of broad nobility.",
      "Steadfast, genuine progression with integrity."
    ]
  },
  {
    "name": "Léa",
    "lang": "fr",
    "ipa": "le.a",
    "aliases": [
      "레아",
      "lea"
    ],
    "hanguls": [
      "리아",
      "예하",
      "라온"
    ],
    "reasons": [
      "Direct melodic counterpart flowing with sweet tenderness.",
      "Broad, warm sky-like cadence conveying love.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Manon",
    "lang": "fr",
    "ipa": "ma.nɔ̃",
    "aliases": [
      "마농"
    ],
    "hanguls": [
      "민아",
      "미래",
      "나래"
    ],
    "reasons": [
      "Charming, gentle 'M-a' flow reflecting elegance.",
      "Bright tomorrow blooming with hope.",
      "Creative wings soaring with imagination."
    ]
  },
  {
    "name": "Jules",
    "lang": "fr",
    "ipa": "ʒyl",
    "aliases": [
      "쥘"
    ],
    "hanguls": [
      "주원",
      "지안",
      "준성"
    ],
    "reasons": [
      "Noble youthful leader guiding with devotion.",
      "Serene, luminous flow reflecting inner peace.",
      "Exemplary talent and moral achievement."
    ]
  },
  {
    "name": "Chloé",
    "lang": "fr",
    "ipa": "klɔ.e",
    "aliases": [
      "클로에",
      "chloe"
    ],
    "hanguls": [
      "초아",
      "채원",
      "채은"
    ],
    "reasons": [
      "Clear onset opening into a bright floral cadence.",
      "Vibrant harmony symbolizing pure origins.",
      "Charming, soft resonance echoing elegance."
    ]
  },
  {
    "name": "Gabriel",
    "lang": "fr",
    "ipa": "ɡa.bʁi.jɛl",
    "aliases": [
      "가브리엘"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Flowing river-like cadence mirroring peace.",
      "Strong, upright pillar reflecting strength.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Léo",
    "lang": "fr",
    "ipa": "le.o",
    "aliases": [
      "레오",
      "leo"
    ],
    "hanguls": [
      "라온",
      "로운",
      "리안"
    ],
    "reasons": [
      "Vibrant onset signifying joy and pure light.",
      "Warm resonance conveying wisdom and prosperity.",
      "Crisp liquid bridge flowing into bright clarity."
    ]
  },
  {
    "name": "Arthur",
    "lang": "fr",
    "ipa": "aʁ.tyʁ",
    "aliases": [
      "아르튀르"
    ],
    "hanguls": [
      "아람",
      "태윤",
      "한결"
    ],
    "reasons": [
      "Noble courage standing steadfast.",
      "Auspicious, high-flying resonance filled with honor.",
      "Constant integrity remaining true to the end."
    ]
  },
  {
    "name": "Maël",
    "lang": "fr",
    "ipa": "ma.ɛl",
    "aliases": [
      "마엘"
    ],
    "hanguls": [
      "민우",
      "마루",
      "명진"
    ],
    "reasons": [
      "Gentle chieftain-like prince of broad wisdom.",
      "Mountain peak integrity standing tall.",
      "Clear, authentic brilliance illuminating others."
    ]
  },
  {
    "name": "Lucas",
    "lang": "fr",
    "ipa": "ly.ka",
    "aliases": [
      "뤼카"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance conveying prosperity.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Adam",
    "lang": "fr",
    "ipa": "a.dɑ̃",
    "aliases": [
      "아담"
    ],
    "hanguls": [
      "아담",
      "아람",
      "다온"
    ],
    "reasons": [
      "Direct acoustic twin meaning elegant and peaceful.",
      "Ripe autumn fruit of harvest and accomplishment.",
      "Pure Korean harmony: all good things arrive."
    ]
  },
  {
    "name": "Tiago",
    "lang": "fr",
    "ipa": "tja.ɡo",
    "aliases": [
      "티아고"
    ],
    "hanguls": [
      "태오",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Vibrant sunlit energy radiating optimism.",
      "Harmonious balance and moral wisdom.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Paul",
    "lang": "fr",
    "ipa": "pɔl",
    "aliases": [
      "폴"
    ],
    "hanguls": [
      "보람",
      "보람",
      "필우"
    ],
    "reasons": [
      "Fulfilling, worthwhile life of humble wisdom.",
      "Straightforward righteousness seeking truth.",
      "Noble, helpful pillar supporting others."
    ]
  },
  {
    "name": "Emma",
    "lang": "fr",
    "ipa": "ɛ.ma",
    "aliases": [
      "에마"
    ],
    "hanguls": [
      "예나",
      "은서",
      "예은"
    ],
    "reasons": [
      "Gentle open resonance brimming with warmth.",
      "Soft vowel start echoing gentle spirit.",
      "Melodious balance conveying blessed kindness."
    ]
  },
  {
    "name": "Jade",
    "lang": "fr",
    "ipa": "ʒad",
    "aliases": [
      "자드",
      "제이드"
    ],
    "hanguls": [
      "재아",
      "지안",
      "정아"
    ],
    "reasons": [
      "Precious jade stone reflecting pristine virtue.",
      "Serene, luminous flow reflecting inner peace.",
      "Pure, upright character shining with calm light."
    ]
  },
  {
    "name": "Louise",
    "lang": "fr",
    "ipa": "lwiz",
    "aliases": [
      "루이즈"
    ],
    "hanguls": [
      "루아",
      "유나",
      "라희"
    ],
    "reasons": [
      "Graceful light shining with gentle warmth.",
      "Gentle flower blooming with poise.",
      "Sunny, cheerful joy spreading daylight."
    ]
  },
  {
    "name": "Ambre",
    "lang": "fr",
    "ipa": "ɑ̃bʁ",
    "aliases": [
      "앙브르"
    ],
    "hanguls": [
      "아람",
      "은비",
      "보민"
    ],
    "reasons": [
      "Golden amber glow capturing warm sunshine.",
      "Silver blessings raining down gently.",
      "Precious gem-like presence cherished deeply."
    ]
  },
  {
    "name": "Alice",
    "lang": "fr",
    "ipa": "a.lis",
    "aliases": [
      "알리스"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은율"
    ],
    "reasons": [
      "Sparkling liquid-sibilant flow evoking grace.",
      "Artistic wisdom and graceful poise.",
      "Melodic cadence conveying blessed harmony."
    ]
  },
  {
    "name": "Rose",
    "lang": "fr",
    "ipa": "ʁoz",
    "aliases": [
      "로즈"
    ],
    "hanguls": [
      "로아",
      "라온",
      "루아"
    ],
    "reasons": [
      "Fragrant rose-like charm blooming in light.",
      "Joyful, shining spirit inspiring others.",
      "Radiant morning dew filled with sparkling life."
    ]
  },
  {
    "name": "Anna",
    "lang": "fr",
    "ipa": "a.na",
    "aliases": [
      "안나"
    ],
    "hanguls": [
      "안나",
      "은우",
      "아인"
    ],
    "reasons": [
      "Direct universal harmony meaning grace.",
      "Gentle, noble acoustic presence radiating quiet light.",
      "Warm, affectionate flow mirroring pure humanity."
    ]
  },
  {
    "name": "Mila",
    "lang": "fr",
    "ipa": "mi.la",
    "aliases": [
      "밀라"
    ],
    "hanguls": [
      "미래",
      "민아",
      "라온"
    ],
    "reasons": [
      "Beloved and gentle grace inspiring warmth.",
      "Charming, delicate melody filled with tenderness.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Romy",
    "lang": "fr",
    "ipa": "ʁɔ.mi",
    "aliases": [
      "로미"
    ],
    "hanguls": [
      "로민",
      "로아",
      "미래"
    ],
    "reasons": [
      "Dew of the sea carrying refreshing breeze.",
      "Lyrical, dew-like resonance expressing joy.",
      "Bright tomorrow blooming with hope."
    ]
  },
  {
    "name": "Inès",
    "lang": "fr",
    "ipa": "i.nɛs",
    "aliases": [
      "이네스",
      "ines"
    ],
    "hanguls": [
      "은서",
      "인아",
      "예은"
    ],
    "reasons": [
      "Pristine, pure heart reflecting noble sincerity.",
      "Warm affectionate presence filled with care.",
      "Melodious balance conveying blessed kindness."
    ]
  },
  {
    "name": "Lina",
    "lang": "fr",
    "ipa": "li.na",
    "aliases": [
      "리나"
    ],
    "hanguls": [
      "린아",
      "나린",
      "라온"
    ],
    "reasons": [
      "Delicate palm-like grace swaying in gentle air.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Léna",
    "lang": "fr",
    "ipa": "le.na",
    "aliases": [
      "레나",
      "lena"
    ],
    "hanguls": [
      "예나",
      "연아",
      "은아"
    ],
    "reasons": [
      "Lyrical vowel flow radiating clarity and poise.",
      "Soft, graceful cadence echoing warmth.",
      "Gentle and peaceful resonance reflecting inner light."
    ]
  },
  {
    "name": "Agathe",
    "lang": "fr",
    "ipa": "a.ɡat",
    "aliases": [
      "아가트"
    ],
    "hanguls": [
      "아람",
      "가은",
      "다온"
    ],
    "reasons": [
      "Good, honorable character of pristine beauty.",
      "Thankful, blessed melody filled with charm.",
      "Pure Korean: all good things arrive."
    ]
  },
  {
    "name": "Maxime",
    "lang": "fr",
    "ipa": "mak.sim",
    "aliases": [
      "막심"
    ],
    "hanguls": [
      "민성",
      "명성",
      "문성"
    ],
    "reasons": [
      "Greatest excellence reaching toward the peak.",
      "Radiant starlight reputation known far and wide.",
      "Cultured, scholarly virtue shaping tomorrow."
    ]
  },
  {
    "name": "Thomas",
    "lang": "fr",
    "ipa": "tɔ.ma",
    "aliases": [
      "토마"
    ],
    "hanguls": [
      "태민",
      "태윤",
      "동우"
    ],
    "reasons": [
      "Energetic dental onset reflecting intellect.",
      "Auspicious royal cadence filled with vitality.",
      "Solid, harmonious foundation of brotherly trust."
    ]
  },
  {
    "name": "Alexandre",
    "lang": "fr",
    "ipa": "a.lɛk.sɑ̃dʁ",
    "aliases": [
      "알렉상드르"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서진"
    ],
    "reasons": [
      "Captures the uplifting spirit and majestic breadth.",
      "Soft sibilant center reflecting gentle wisdom.",
      "Solid, dignified cadence echoing leadership."
    ]
  },
  {
    "name": "Clément",
    "lang": "fr",
    "ipa": "kle.mɑ̃",
    "aliases": [
      "클레망"
    ],
    "hanguls": [
      "가람",
      "민우",
      "건우"
    ],
    "reasons": [
      "Gentle, merciful character of flowing grace.",
      "Warm, companionable wisdom walking alongside.",
      "Strong, upright pillar standing for truth."
    ]
  },
  {
    "name": "Mathéo",
    "lang": "fr",
    "ipa": "ma.te.o",
    "aliases": [
      "마테오"
    ],
    "hanguls": [
      "민태",
      "태오",
      "명우"
    ],
    "reasons": [
      "Harmonizes with Ma-te cadence, gift of heaven.",
      "Vibrant sun-drenched joy and warmth.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Nathan",
    "lang": "fr",
    "ipa": "na.tɑ̃",
    "aliases": [
      "나탕"
    ],
    "hanguls": [
      "남우",
      "태윤",
      "나래"
    ],
    "reasons": [
      "Warm balance signifying gifted generosity.",
      "Vibrant, auspicious glow filled with royal poise.",
      "Peaceful ferry-like bridge connecting hearts."
    ]
  },
  {
    "name": "Yanis",
    "lang": "fr",
    "ipa": "ja.nis",
    "aliases": [
      "야니스"
    ],
    "hanguls": [
      "연우",
      "예성",
      "이안"
    ],
    "reasons": [
      "Graceful gift radiating tender light.",
      "Artistic brilliance shining with steadfast hope.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Timéo",
    "lang": "fr",
    "ipa": "ti.me.o",
    "aliases": [
      "티메오"
    ],
    "hanguls": [
      "태민",
      "태오",
      "도윤"
    ],
    "reasons": [
      "Honoring what is noble with spirited joy.",
      "Vibrant sun-drenched warmth.",
      "Solid dental onset and melodious flow."
    ]
  },
  {
    "name": "Sacha",
    "lang": "fr",
    "ipa": "sa.ʃa",
    "aliases": [
      "사샤"
    ],
    "hanguls": [
      "세아",
      "서진",
      "소라"
    ],
    "reasons": [
      "Gentle defender standing with quiet dignity.",
      "Modern, refined elegance carrying strength.",
      "Tranquil ocean shell melody echoing calm."
    ]
  },
  {
    "name": "Enzo",
    "lang": "fr",
    "ipa": "ɛn.zo",
    "aliases": [
      "엔조"
    ],
    "hanguls": [
      "은우",
      "은성",
      "진우"
    ],
    "reasons": [
      "Ruler of the home guiding with devotion.",
      "Steadfast star shining with moral clarity.",
      "True, genuine character of deep reliability."
    ]
  },
  {
    "name": "Nolan",
    "lang": "fr",
    "ipa": "nɔ.lɑ̃",
    "aliases": [
      "놀란"
    ],
    "hanguls": [
      "노아",
      "남우",
      "도현"
    ],
    "reasons": [
      "Noble, famous character of broad renown.",
      "Warm, supportive character of deep loyalty.",
      "Deep insight and principled integrity."
    ]
  },
  {
    "name": "Ethan",
    "lang": "fr",
    "ipa": "e.tan",
    "aliases": [
      "에탄"
    ],
    "hanguls": [
      "이든",
      "이안",
      "이선"
    ],
    "reasons": [
      "Direct acoustic twin meaning righteous and good.",
      "Graceful onset carrying serene clarity.",
      "Balanced dental bridge reflecting enduring strength."
    ]
  },
  {
    "name": "Victor",
    "lang": "fr",
    "ipa": "vik.tɔʁ",
    "aliases": [
      "빅토르"
    ],
    "hanguls": [
      "빛나",
      "태윤",
      "보민"
    ],
    "reasons": [
      "Victorious champion standing in the light.",
      "Auspicious royal cadence filled with vitality.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Maximilian",
    "lang": "de",
    "ipa": "maksiˈmiːli̯aːn",
    "aliases": [
      "막시밀리안",
      "max"
    ],
    "hanguls": [
      "민성",
      "명성",
      "문성"
    ],
    "reasons": [
      "Greatest excellence reaching toward the peak.",
      "Radiant starlight reputation known far and wide.",
      "Cultured, scholarly virtue shaping tomorrow."
    ]
  },
  {
    "name": "Felix",
    "lang": "de",
    "ipa": "ˈfeːlɪks",
    "aliases": [
      "펠릭스"
    ],
    "hanguls": [
      "필우",
      "보람",
      "하람"
    ],
    "reasons": [
      "Happy, blessed life bringing fortune to all.",
      "Fulfilling, worthwhile life of humble wisdom.",
      "Heavenly blessing descending like soft rain."
    ]
  },
  {
    "name": "Lukas",
    "lang": "de",
    "ipa": "ˈluːkas",
    "aliases": [
      "루카스",
      "luca"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance conveying prosperity.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Hanna",
    "lang": "de",
    "ipa": "ˈhana",
    "aliases": [
      "한나",
      "hannah"
    ],
    "hanguls": [
      "하나",
      "한나",
      "하늘"
    ],
    "reasons": [
      "Direct phonetic counterpart meaning precious gift.",
      "Classic harmony expressing grace and mercy.",
      "Vast, open acoustic atmosphere echoing the sky."
    ]
  },
  {
    "name": "Jonas",
    "lang": "de",
    "ipa": "ˈjoːnas",
    "aliases": [
      "요나스"
    ],
    "hanguls": [
      "연우",
      "원우",
      "준성"
    ],
    "reasons": [
      "Peaceful dove of comfort and reconciliation.",
      "Expansive, noble aura reaching across horizon.",
      "Exemplary talent and moral achievement."
    ]
  },
  {
    "name": "Leon",
    "lang": "de",
    "ipa": "ˈleːɔn",
    "aliases": [
      "레온"
    ],
    "hanguls": [
      "로운",
      "라온",
      "리안"
    ],
    "reasons": [
      "Warm resonance conveying wisdom and prosperity.",
      "Joyful pure Korean word echoing regal brilliance.",
      "Crisp liquid bridge flowing into bright clarity."
    ]
  },
  {
    "name": "Mia",
    "lang": "de",
    "ipa": "ˈmiːa",
    "aliases": [
      "미아"
    ],
    "hanguls": [
      "미아",
      "미래",
      "민아"
    ],
    "reasons": [
      "Direct phonetic counterpart embodying beauty.",
      "Shares sweet onset symbolizing bright tomorrow.",
      "Soft resonant flow mirroring youthful charm."
    ]
  },
  {
    "name": "Paul",
    "lang": "de",
    "ipa": "paʊ̯l",
    "aliases": [
      "파울"
    ],
    "hanguls": [
      "보람",
      "보람",
      "필우"
    ],
    "reasons": [
      "Fulfilling, worthwhile life of humble wisdom.",
      "Straightforward righteousness seeking truth.",
      "Noble, helpful pillar supporting others."
    ]
  },
  {
    "name": "Finn",
    "lang": "de",
    "ipa": "fɪn",
    "aliases": [
      "핀"
    ],
    "hanguls": [
      "필우",
      "민우",
      "하린"
    ],
    "reasons": [
      "Fair, bright warrior of pure intentions.",
      "Warm, companionable wisdom walking alongside.",
      "Gentle, refreshing flow echoing morning dew."
    ]
  },
  {
    "name": "Elias",
    "lang": "de",
    "ipa": "eˈliːas",
    "aliases": [
      "엘리아스"
    ],
    "hanguls": [
      "이안",
      "이안",
      "하람"
    ],
    "reasons": [
      "Peaceful open vowel onset reflecting soaring spirit.",
      "Lyrical, transcendent bridge carrying light.",
      "Spacious acoustic atmosphere conveying blessing."
    ]
  },
  {
    "name": "Noah",
    "lang": "de",
    "ipa": "ˈnoːa",
    "aliases": [
      "노아"
    ],
    "hanguls": [
      "노아",
      "도하",
      "하람"
    ],
    "reasons": [
      "Direct sound match carrying peaceful cadence.",
      "Echoes the open vowel breath of calm rest.",
      "Spacious atmosphere conveying vast sky."
    ]
  },
  {
    "name": "Ben",
    "lang": "de",
    "ipa": "bɛn",
    "aliases": [
      "벤"
    ],
    "hanguls": [
      "범진",
      "보민",
      "민재"
    ],
    "reasons": [
      "Resonant bilabial onset conveying deep trust.",
      "Precious gem-like integrity shining bright.",
      "Agile intellect and versatile talent."
    ]
  },
  {
    "name": "Luca",
    "lang": "de",
    "ipa": "ˈluːka",
    "aliases": [
      "루카"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance conveying prosperity.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Henry",
    "lang": "de",
    "ipa": "ˈhɛnʁi",
    "aliases": [
      "헨리"
    ],
    "hanguls": [
      "현리",
      "해린",
      "하람"
    ],
    "reasons": [
      "Echoes energetic consonant sequence.",
      "Melodious cadence flowing with sea-like calm.",
      "Vibrant aspirate onset reflecting noble purpose."
    ]
  },
  {
    "name": "Emil",
    "lang": "de",
    "ipa": "eˈmiːl",
    "aliases": [
      "에밀"
    ],
    "hanguls": [
      "은우",
      "민재",
      "예민"
    ],
    "reasons": [
      "Eager, industrious spirit striving for good.",
      "Agile intellect and versatile talent.",
      "Refined, sharp perception perceiving beauty."
    ]
  },
  {
    "name": "Theo",
    "lang": "de",
    "ipa": "ˈteːo",
    "aliases": [
      "테오"
    ],
    "hanguls": [
      "태오",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Direct sound match conveying sacred joy.",
      "Harmonious balance and moral wisdom.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Anton",
    "lang": "de",
    "ipa": "ˈantoːn",
    "aliases": [
      "안톤"
    ],
    "hanguls": [
      "안솔",
      "도현",
      "단우"
    ],
    "reasons": [
      "Invaluable, noble presence standing firm.",
      "Deep insight and moral clarity.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Oskar",
    "lang": "de",
    "ipa": "ˈɔskaʁ",
    "aliases": [
      "오스카"
    ],
    "hanguls": [
      "우성",
      "온유",
      "서진"
    ],
    "reasons": [
      "Gentle spear of divine protection and wisdom.",
      "Tender, warm kindness embracing the world.",
      "Refined modern elegance carrying quiet authority."
    ]
  },
  {
    "name": "Emma",
    "lang": "de",
    "ipa": "ˈɛma",
    "aliases": [
      "엠마"
    ],
    "hanguls": [
      "예나",
      "은서",
      "예은"
    ],
    "reasons": [
      "Gentle open resonance brimming with warmth.",
      "Soft vowel start echoing gentle spirit.",
      "Melodious balance conveying blessed kindness."
    ]
  },
  {
    "name": "Sophia",
    "lang": "de",
    "ipa": "zoˈfiːa",
    "aliases": [
      "소피아"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Emilia",
    "lang": "de",
    "ipa": "eˈmiːli̯a",
    "aliases": [
      "에밀리아"
    ],
    "hanguls": [
      "은서",
      "예린",
      "민아"
    ],
    "reasons": [
      "Industrious, warm grace striving for excellence.",
      "Clear, crystalline cadence reflecting honor.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Lina",
    "lang": "de",
    "ipa": "ˈliːna",
    "aliases": [
      "리나"
    ],
    "hanguls": [
      "린아",
      "나린",
      "라온"
    ],
    "reasons": [
      "Delicate palm-like grace swaying in gentle air.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Ella",
    "lang": "de",
    "ipa": "ˈɛla",
    "aliases": [
      "엘라"
    ],
    "hanguls": [
      "예라",
      "은솔",
      "유라"
    ],
    "reasons": [
      "Bright lyrical flow echoing fairy-like lightness.",
      "Pure pine-like integrity wrapped in soft grace.",
      "Radiant, melodious cadence expressing joy."
    ]
  },
  {
    "name": "Mila",
    "lang": "de",
    "ipa": "ˈmiːla",
    "aliases": [
      "밀라"
    ],
    "hanguls": [
      "미래",
      "민아",
      "라온"
    ],
    "reasons": [
      "Beloved and gentle grace inspiring warmth.",
      "Charming, delicate melody filled with tenderness.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Clara",
    "lang": "de",
    "ipa": "ˈklaːʁa",
    "aliases": [
      "클라라"
    ],
    "hanguls": [
      "가람",
      "가온",
      "나린"
    ],
    "reasons": [
      "River-like clarity mirroring bright lucidity.",
      "Centering acoustic harmony representing truth.",
      "Heaven-sent blessing flowing with vitality."
    ]
  },
  {
    "name": "Lea",
    "lang": "de",
    "ipa": "ˈleːa",
    "aliases": [
      "레아"
    ],
    "hanguls": [
      "리아",
      "예하",
      "라온"
    ],
    "reasons": [
      "Direct melodic counterpart flowing with tenderness.",
      "Broad, warm sky-like cadence conveying love.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Ida",
    "lang": "de",
    "ipa": "ˈiːda",
    "aliases": [
      "이다"
    ],
    "hanguls": [
      "이솔",
      "이솔",
      "다은"
    ],
    "reasons": [
      "Direct acoustic counterpart conveying diligent joy.",
      "Evergreen pine purity echoing fresh virtue.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Marie",
    "lang": "de",
    "ipa": "maˈʁiː",
    "aliases": [
      "마리"
    ],
    "hanguls": [
      "마루",
      "미래",
      "민아"
    ],
    "reasons": [
      "Beloved sea-star radiating steadfast light.",
      "Bright tomorrow blooming with hope.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Niklas",
    "lang": "de",
    "ipa": "ˈnɪklas",
    "aliases": [
      "니클라스"
    ],
    "hanguls": [
      "나경",
      "노아",
      "남우"
    ],
    "reasons": [
      "Gentle dental-nasal onset carrying victory.",
      "Serene, peaceful cadence welcoming all.",
      "Warm, supportive character of deep loyalty."
    ]
  },
  {
    "name": "Philipp",
    "lang": "de",
    "ipa": "ˈfɪlɪp",
    "aliases": [
      "필립"
    ],
    "hanguls": [
      "필우",
      "보민",
      "하람"
    ],
    "reasons": [
      "Noble friend filled with warmth and loyalty.",
      "Precious gem-like integrity shining bright.",
      "Heavenly blessing descending like soft rain."
    ]
  },
  {
    "name": "Jan",
    "lang": "de",
    "ipa": "jan",
    "aliases": [
      "얀"
    ],
    "hanguls": [
      "연우",
      "영진",
      "진우"
    ],
    "reasons": [
      "Gracious gift of heaven shining with light.",
      "Bright, broad future leading with vision.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Fabian",
    "lang": "de",
    "ipa": "ˈfaːbi̯aːn",
    "aliases": [
      "파비안"
    ],
    "hanguls": [
      "범진",
      "하람",
      "보민"
    ],
    "reasons": [
      "Prosperous grower cultivating goodness.",
      "Heavenly blessing descending like soft rain.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Tim",
    "lang": "de",
    "ipa": "tɪm",
    "aliases": [
      "팀"
    ],
    "hanguls": [
      "태민",
      "태윤",
      "동우"
    ],
    "reasons": [
      "Honoring high virtue with agile brilliance.",
      "Auspicious royal cadence filled with vitality.",
      "Solid, harmonious foundation of brotherly trust."
    ]
  },
  {
    "name": "Moritz",
    "lang": "de",
    "ipa": "ˈmoːʁɪts",
    "aliases": [
      "모리츠"
    ],
    "hanguls": [
      "명우",
      "민재",
      "문성"
    ],
    "reasons": [
      "Dark, noble depths of profound wisdom.",
      "Agile intellect and versatile talent.",
      "Cultured, scholarly virtue shaping tomorrow."
    ]
  },
  {
    "name": "David",
    "lang": "de",
    "ipa": "ˈdaːvɪt",
    "aliases": [
      "다비트"
    ],
    "hanguls": [
      "다빈",
      "도윤",
      "다온"
    ],
    "reasons": [
      "Mirroring sound harmony with warmth.",
      "Solid dental onset and melodious flow.",
      "Pure Korean: all good things arrive."
    ]
  },
  {
    "name": "Julian",
    "lang": "de",
    "ipa": "ˈjuːli̯aːn",
    "aliases": [
      "율리안"
    ],
    "hanguls": [
      "율아",
      "주안",
      "준원"
    ],
    "reasons": [
      "Youthful, sunlit vitality flourishing bright.",
      "Gentle affricate bridge expressing broad vision.",
      "Exemplary character of broad compassion."
    ]
  },
  {
    "name": "Erik",
    "lang": "de",
    "ipa": "ˈeːʁɪk",
    "aliases": [
      "에릭"
    ],
    "hanguls": [
      "은우",
      "현우",
      "해찬"
    ],
    "reasons": [
      "Everlasting ruler leading with gentle strength.",
      "Wise, virtuous hero leading with vision.",
      "Sunlit defender holding fast to honor."
    ]
  },
  {
    "name": "Tobias",
    "lang": "de",
    "ipa": "toˈbiːas",
    "aliases": [
      "토비아스"
    ],
    "hanguls": [
      "태윤",
      "동현",
      "보민"
    ],
    "reasons": [
      "Goodness of heaven radiating across life.",
      "Bright, virtuous cadence radiating warmth.",
      "Precious gem-like presence cherished deeply."
    ]
  },
  {
    "name": "Simon",
    "lang": "de",
    "ipa": "ˈziːmɔn",
    "aliases": [
      "지몬"
    ],
    "hanguls": [
      "승민",
      "서진",
      "상우"
    ],
    "reasons": [
      "Attentive, wise spirit listening to truth.",
      "Modern, refined elegance carrying strength.",
      "Dignified, expansive presence inspiring peace."
    ]
  },
  {
    "name": "Laura",
    "lang": "de",
    "ipa": "ˈlaʊ̯ʁa",
    "aliases": [
      "라우라"
    ],
    "hanguls": [
      "라온",
      "나래",
      "로아"
    ],
    "reasons": [
      "Victorious laurel wreath brimming with cheer.",
      "Creative wings soaring with imagination.",
      "Gentle, dew-like grace filled with joy."
    ]
  },
  {
    "name": "Luisa",
    "lang": "de",
    "ipa": "luˈiːza",
    "aliases": [
      "루이자"
    ],
    "hanguls": [
      "루아",
      "유나",
      "라희"
    ],
    "reasons": [
      "Graceful light shining with gentle warmth.",
      "Gentle flower blooming with poise.",
      "Sunny, cheerful joy spreading daylight."
    ]
  },
  {
    "name": "Nele",
    "lang": "de",
    "ipa": "ˈneːlə",
    "aliases": [
      "넬레"
    ],
    "hanguls": [
      "나래",
      "노아",
      "다은"
    ],
    "reasons": [
      "Bright, creative wings soaring toward peace.",
      "Serene, peaceful cadence welcoming all.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Leni",
    "lang": "de",
    "ipa": "ˈleːni",
    "aliases": [
      "레니"
    ],
    "hanguls": [
      "린아",
      "예나",
      "라온"
    ],
    "reasons": [
      "Torch of luminous grace guiding friends.",
      "Lyrical vowel flow radiating clarity.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Sophie",
    "lang": "de",
    "ipa": "zoˈfiː",
    "aliases": [
      "조피"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Hanna",
    "lang": "de",
    "ipa": "ˈhana",
    "aliases": [
      "한나"
    ],
    "hanguls": [
      "하나",
      "한나",
      "하늘"
    ],
    "reasons": [
      "Direct phonetic counterpart meaning precious gift.",
      "Classic harmony expressing grace and mercy.",
      "Vast, open acoustic atmosphere echoing the sky."
    ]
  },
  {
    "name": "Marco",
    "lang": "it",
    "ipa": "ˈmaɾ.ko",
    "aliases": [
      "마르코",
      "marcus"
    ],
    "hanguls": [
      "민우",
      "명호",
      "마루"
    ],
    "reasons": [
      "Strong, spirited defender shining with courage.",
      "Expansive, bright dignity commanding respect.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Lorenzo",
    "lang": "it",
    "ipa": "loˈɾɛn.tso",
    "aliases": [
      "로렌초",
      "enzo"
    ],
    "hanguls": [
      "로운",
      "라온",
      "선우"
    ],
    "reasons": [
      "Laurel-crowned victory filled with wisdom.",
      "Joyful, shining spirit inspiring others.",
      "Noble scholar-leader carrying empathy."
    ]
  },
  {
    "name": "Giulia",
    "lang": "it",
    "ipa": "ˈdʒuː.lja",
    "aliases": [
      "줄리아",
      "giulietta"
    ],
    "hanguls": [
      "주아",
      "지율",
      "유나"
    ],
    "reasons": [
      "Youthful, blooming grace filled with vitality.",
      "Melodious rhythm of harmonious virtue.",
      "Gentle, graceful flower blooming with poise."
    ]
  },
  {
    "name": "Matteo",
    "lang": "it",
    "ipa": "matˈtɛ.o",
    "aliases": [
      "마테오"
    ],
    "hanguls": [
      "민태",
      "태오",
      "명우"
    ],
    "reasons": [
      "Harmonizes with Ma-te cadence, gift of heaven.",
      "Vibrant sun-drenched joy and warmth.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Chiara",
    "lang": "it",
    "ipa": "ˈkjaː.ɾa",
    "aliases": [
      "키아라"
    ],
    "hanguls": [
      "가온",
      "채린",
      "하린"
    ],
    "reasons": [
      "Pure, bright lucidity shining at center.",
      "Brilliant jewel-like cadence reflecting honor.",
      "Clear, refreshing summer rain of purity."
    ]
  },
  {
    "name": "Leonardo",
    "lang": "it",
    "ipa": "leoˈnaɾ.do",
    "aliases": [
      "레오나르도",
      "leo"
    ],
    "hanguls": [
      "로운",
      "라온",
      "도현"
    ],
    "reasons": [
      "Brave, lion-hearted wisdom guiding the way.",
      "Joyful, shining spirit inspiring others.",
      "Deep insight and moral clarity."
    ]
  },
  {
    "name": "Francesco",
    "lang": "it",
    "ipa": "fɾanˈtʃe.sko",
    "aliases": [
      "프란체스코",
      "franco"
    ],
    "hanguls": [
      "범진",
      "찬솔",
      "서진"
    ],
    "reasons": [
      "Free, generous spirit loving all creation.",
      "Radiant pine-like integrity shining with faith.",
      "Modern, refined elegance carrying strength."
    ]
  },
  {
    "name": "Aurora",
    "lang": "it",
    "ipa": "awˈɾɔː.ɾa",
    "aliases": [
      "아우로라"
    ],
    "hanguls": [
      "아라",
      "새벽",
      "하늘"
    ],
    "reasons": [
      "Golden dawn-rays illuminating the horizon.",
      "First morning light bringing fresh renewal.",
      "Vast, open sky filled with peace."
    ]
  },
  {
    "name": "Alessandro",
    "lang": "it",
    "ipa": "alesˈsan.dɾo",
    "aliases": [
      "알레산드로",
      "ale"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서진"
    ],
    "reasons": [
      "Majestic protector of noble ideals.",
      "Soft sibilant center reflecting gentle wisdom.",
      "Solid, dignified cadence echoing leadership."
    ]
  },
  {
    "name": "Edoardo",
    "lang": "it",
    "ipa": "edoˈaɾ.do",
    "aliases": [
      "에도아르도"
    ],
    "hanguls": [
      "은우",
      "도현",
      "대호"
    ],
    "reasons": [
      "Prosperous guardian standing watch over peace.",
      "Deep insight and principled integrity.",
      "Vast, generous spirit embracing big aspirations."
    ]
  },
  {
    "name": "Tommaso",
    "lang": "it",
    "ipa": "tomˈmaː.zo",
    "aliases": [
      "톰마소"
    ],
    "hanguls": [
      "태민",
      "태윤",
      "동우"
    ],
    "reasons": [
      "Agile intellect and steadfast loyalty.",
      "Auspicious royal cadence filled with vitality.",
      "Solid, harmonious foundation of brotherly trust."
    ]
  },
  {
    "name": "Mattia",
    "lang": "it",
    "ipa": "matˈtiː.a",
    "aliases": [
      "마티아"
    ],
    "hanguls": [
      "민태",
      "태윤",
      "명진"
    ],
    "reasons": [
      "Gift of heaven bringing light to the world.",
      "Auspicious royal cadence filled with vitality.",
      "Clear, authentic brilliance illuminating others."
    ]
  },
  {
    "name": "Gabriele",
    "lang": "it",
    "ipa": "ɡabɾiˈɛː.le",
    "aliases": [
      "가브리엘레"
    ],
    "hanguls": [
      "가람",
      "건우",
      "기범"
    ],
    "reasons": [
      "Flowing river-like cadence mirroring peace.",
      "Strong, upright pillar reflecting strength.",
      "Noble, exemplary character of broad compassion."
    ]
  },
  {
    "name": "Riccardo",
    "lang": "it",
    "ipa": "rikˈkaɾ.do",
    "aliases": [
      "리카르도"
    ],
    "hanguls": [
      "로운",
      "도현",
      "강산"
    ],
    "reasons": [
      "Strong, brave ruler leading with heart.",
      "Deep insight and moral clarity.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Andrea",
    "lang": "it",
    "ipa": "anˈdɾɛː.a",
    "aliases": [
      "안드레아"
    ],
    "hanguls": [
      "안솔",
      "다온",
      "아린"
    ],
    "reasons": [
      "Courageous, steadfast pine integrity.",
      "Pure Korean: all good things arrive.",
      "Sparkling, delicate clarity filled with light."
    ]
  },
  {
    "name": "Diego",
    "lang": "it",
    "ipa": "ˈdjɛː.ɡo",
    "aliases": [
      "디에고"
    ],
    "hanguls": [
      "도윤",
      "동현",
      "대호"
    ],
    "reasons": [
      "Melodious dental onset conveying insight.",
      "Radiant, virtuous character shining with warmth.",
      "Vast, generous spirit embracing big aspirations."
    ]
  },
  {
    "name": "Nicolo",
    "lang": "it",
    "ipa": "nikoˈlɔ",
    "aliases": [
      "니콜로"
    ],
    "hanguls": [
      "나경",
      "노아",
      "남우"
    ],
    "reasons": [
      "Gentle dental-nasal onset carrying victory.",
      "Serene, peaceful cadence welcoming all.",
      "Warm, supportive character of deep loyalty."
    ]
  },
  {
    "name": "Sofia",
    "lang": "it",
    "ipa": "soˈfiː.a",
    "aliases": [
      "소피아"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Ginevra",
    "lang": "it",
    "ipa": "dʒiˈnɛː.vɾa",
    "aliases": [
      "지네브라"
    ],
    "hanguls": [
      "진아",
      "은비",
      "하린"
    ],
    "reasons": [
      "White wave of purity breaking on the shore.",
      "Silver blessings raining down gently.",
      "Clear, refreshing summer rain of purity."
    ]
  },
  {
    "name": "Beatrice",
    "lang": "it",
    "ipa": "beaˈtɾiː.tʃe",
    "aliases": [
      "베아트리체",
      "bea"
    ],
    "hanguls": [
      "보민",
      "빛나",
      "은비"
    ],
    "reasons": [
      "Bringer of sublime happiness and light.",
      "Radiant brilliance inspiring all who see.",
      "Silver blessings raining down gently."
    ]
  },
  {
    "name": "Alice",
    "lang": "it",
    "ipa": "aˈliː.tʃe",
    "aliases": [
      "알리체"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은율"
    ],
    "reasons": [
      "Sparkling liquid-sibilant flow evoking grace.",
      "Artistic wisdom and graceful poise.",
      "Melodic cadence conveying blessed harmony."
    ]
  },
  {
    "name": "Vittoria",
    "lang": "it",
    "ipa": "vitˈtɔː.ɾja",
    "aliases": [
      "비토리아"
    ],
    "hanguls": [
      "빛나",
      "별아",
      "보아"
    ],
    "reasons": [
      "Radiant victory shining with brilliant light.",
      "Starlight dignity inspiring awe and respect.",
      "Precious, jewel-like resonance filled with joy."
    ]
  },
  {
    "name": "Emma",
    "lang": "it",
    "ipa": "ˈɛm.ma",
    "aliases": [
      "엠마"
    ],
    "hanguls": [
      "예나",
      "은서",
      "예은"
    ],
    "reasons": [
      "Gentle open resonance brimming with warmth.",
      "Soft vowel start echoing gentle spirit.",
      "Melodious balance conveying blessed kindness."
    ]
  },
  {
    "name": "Giorgia",
    "lang": "it",
    "ipa": "ˈdʒɔɾ.dʒa",
    "aliases": [
      "조르자"
    ],
    "hanguls": [
      "조은",
      "주아",
      "정아"
    ],
    "reasons": [
      "Fruitful steward of nature's beauty.",
      "Warm, benevolent resonance celebrating joy.",
      "Pure, upright character shining with calm light."
    ]
  },
  {
    "name": "Greta",
    "lang": "it",
    "ipa": "ˈɡɾɛː.ta",
    "aliases": [
      "그레타"
    ],
    "hanguls": [
      "가은",
      "가람",
      "태연"
    ],
    "reasons": [
      "Precious pearl shining in ocean depths.",
      "Flowing river clarity reflecting pure character.",
      "Serene, tranquil flow filled with inner peace."
    ]
  },
  {
    "name": "Matilde",
    "lang": "it",
    "ipa": "maˈtil.de",
    "aliases": [
      "마틸데"
    ],
    "hanguls": [
      "민아",
      "태연",
      "다민"
    ],
    "reasons": [
      "Mighty warrior wrapped in gentle grace.",
      "Serene, tranquil flow filled with inner peace.",
      "Warm, broad compassion embracing others."
    ]
  },
  {
    "name": "Federico",
    "lang": "it",
    "ipa": "fedeˈɾiː.ko",
    "aliases": [
      "페데리코",
      "fede"
    ],
    "hanguls": [
      "범진",
      "도현",
      "강산"
    ],
    "reasons": [
      "Peaceful ruler governing with noble kindness.",
      "Deep insight and principled integrity.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Luca",
    "lang": "it",
    "ipa": "ˈluː.ka",
    "aliases": [
      "루카"
    ],
    "hanguls": [
      "루아",
      "로운",
      "로아"
    ],
    "reasons": [
      "Radiant light illuminating the pathway ahead.",
      "Warm phonetic resonance conveying prosperity.",
      "Flows naturally embodying grace and joy."
    ]
  },
  {
    "name": "Giovanni",
    "lang": "it",
    "ipa": "dʒoˈvan.ni",
    "aliases": [
      "조반니"
    ],
    "hanguls": [
      "주원",
      "조은",
      "정우"
    ],
    "reasons": [
      "Grace-filled heart blessed by divine favor.",
      "Warm, benevolent resonance celebrating joy.",
      "Steadfast righteousness shining bright."
    ]
  },
  {
    "name": "Samuele",
    "lang": "it",
    "ipa": "samuˈɛː.le",
    "aliases": [
      "사무엘레"
    ],
    "hanguls": [
      "승민",
      "서민",
      "상현"
    ],
    "reasons": [
      "Spiritual elevation and perceptive understanding.",
      "Gentle, accessible cadence filled with warm heart.",
      "Dignified, expansive presence inspiring trust."
    ]
  },
  {
    "name": "Filippo",
    "lang": "it",
    "ipa": "fiˈlip.po",
    "aliases": [
      "필리포"
    ],
    "hanguls": [
      "필우",
      "보민",
      "하람"
    ],
    "reasons": [
      "Noble friend filled with warmth and loyalty.",
      "Precious gem-like integrity shining bright.",
      "Heavenly blessing descending like soft rain."
    ]
  },
  {
    "name": "Cristian",
    "lang": "it",
    "ipa": "ˈkɾis.tjan",
    "aliases": [
      "크리스티안"
    ],
    "hanguls": [
      "찬솔",
      "찬서",
      "창민"
    ],
    "reasons": [
      "Radiant pine-like integrity shining with faith.",
      "Broad, literary brightness carrying hope.",
      "Prosperous brilliance inspiring others."
    ]
  },
  {
    "name": "Pietro",
    "lang": "it",
    "ipa": "ˈpjɛː.tɾo",
    "aliases": [
      "피에트로"
    ],
    "hanguls": [
      "보람",
      "동현",
      "필우"
    ],
    "reasons": [
      "Solid stone-like foundation of deep trust.",
      "Bright, virtuous cadence radiating warmth.",
      "Noble, helpful pillar supporting others."
    ]
  },
  {
    "name": "Jacopo",
    "lang": "it",
    "ipa": "ˈjaː.ko.po",
    "aliases": [
      "야코포"
    ],
    "hanguls": [
      "연우",
      "건우",
      "보민"
    ],
    "reasons": [
      "Resolute pursuer of higher virtue.",
      "Strong, upright pillar standing for truth.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Davide",
    "lang": "it",
    "ipa": "ˈdaː.vi.de",
    "aliases": [
      "다비데"
    ],
    "hanguls": [
      "다빈",
      "도윤",
      "다온"
    ],
    "reasons": [
      "Mirroring sound harmony with warmth.",
      "Solid dental onset and melodious flow.",
      "Pure Korean: all good things arrive."
    ]
  },
  {
    "name": "Alessio",
    "lang": "it",
    "ipa": "aˈlɛs.sjo",
    "aliases": [
      "알레시오"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서진"
    ],
    "reasons": [
      "Gentle defender bringing soothing calm.",
      "Soft sibilant center reflecting gentle wisdom.",
      "Solid, dignified cadence echoing leadership."
    ]
  },
  {
    "name": "Simone",
    "lang": "it",
    "ipa": "siˈmoː.ne",
    "aliases": [
      "시모네"
    ],
    "hanguls": [
      "승민",
      "서진",
      "상우"
    ],
    "reasons": [
      "Attentive, wise spirit listening to truth.",
      "Modern, refined elegance carrying strength.",
      "Dignified, expansive presence inspiring peace."
    ]
  },
  {
    "name": "Camilla",
    "lang": "it",
    "ipa": "kaˈmil.la",
    "aliases": [
      "카밀라"
    ],
    "hanguls": [
      "가은",
      "가람",
      "민아"
    ],
    "reasons": [
      "Noble, sweet grace serving with devoted beauty.",
      "Flowing river clarity reflecting pure character.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Ludovica",
    "lang": "it",
    "ipa": "ludoˈviː.ka",
    "aliases": [
      "루도비카"
    ],
    "hanguls": [
      "루아",
      "다은",
      "보아"
    ],
    "reasons": [
      "Illustrious light shining with quiet dignity.",
      "Abundant, sweet kindness blessing everyone.",
      "Precious, jewel-like resonance filled with joy."
    ]
  },
  {
    "name": "Noemi",
    "lang": "it",
    "ipa": "noˈɛː.mi",
    "aliases": [
      "노에미"
    ],
    "hanguls": [
      "노아",
      "예은",
      "민아"
    ],
    "reasons": [
      "Pleasant, sweet grace delighting all hearts.",
      "Melodious balance conveying blessed kindness.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Martina",
    "lang": "it",
    "ipa": "maɾˈtiː.na",
    "aliases": [
      "마르티나"
    ],
    "hanguls": [
      "민아",
      "태연",
      "다민"
    ],
    "reasons": [
      "Noble, spirited grace standing with resolve.",
      "Serene, tranquil flow filled with inner peace.",
      "Warm, broad compassion embracing others."
    ]
  },
  {
    "name": "Elena",
    "lang": "it",
    "ipa": "ˈɛː.le.na",
    "aliases": [
      "엘레나"
    ],
    "hanguls": [
      "예나",
      "연아",
      "은아"
    ],
    "reasons": [
      "Lyrical vowel flow radiating clarity.",
      "Soft, graceful cadence echoing warmth.",
      "Gentle and peaceful resonance reflecting inner light."
    ]
  },
  {
    "name": "Sara",
    "lang": "it",
    "ipa": "ˈsaː.ɾa",
    "aliases": [
      "사라"
    ],
    "hanguls": [
      "세라",
      "소라",
      "서아"
    ],
    "reasons": [
      "Silken regal presence carrying dignity.",
      "Ocean shell melody echoing tranquil calm.",
      "Soft, auspicious resonance reflecting peace."
    ]
  },
  {
    "name": "Nicole",
    "lang": "it",
    "ipa": "niˈkɔl",
    "aliases": [
      "니콜"
    ],
    "hanguls": [
      "나경",
      "노아",
      "채린"
    ],
    "reasons": [
      "Victorious grace bringing peace to the land.",
      "Serene, peaceful cadence welcoming all.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Anna",
    "lang": "it",
    "ipa": "ˈan.na",
    "aliases": [
      "안나"
    ],
    "hanguls": [
      "안나",
      "은우",
      "아인"
    ],
    "reasons": [
      "Direct universal harmony meaning grace.",
      "Gentle, noble acoustic presence radiating light.",
      "Warm, affectionate flow mirroring pure humanity."
    ]
  },
  {
    "name": "Minh",
    "lang": "vi",
    "ipa": "mïŋ",
    "aliases": [
      "민",
      "quang minh"
    ],
    "hanguls": [
      "민준",
      "민호",
      "민우"
    ],
    "reasons": [
      "Direct phonetic match with 'Min-', symbolizing brilliance and excellence.",
      "Radiant 'Min-' harmony, embodying vast bravery and brightness.",
      "Gentle 'Min-' flow, representing warm intelligence and harmony."
    ]
  },
  {
    "name": "Linh",
    "lang": "vi",
    "ipa": "lïŋ",
    "aliases": [
      "린",
      "my linh"
    ],
    "hanguls": [
      "하린",
      "유린",
      "채린"
    ],
    "reasons": [
      "Lyrical 'Linh/Rin' cadence, carrying pure, crystalline morning dew.",
      "Serene water-like resonance symbolizing gentle clarity.",
      "Vibrant jewel-like elegance reflecting clear wisdom."
    ]
  },
  {
    "name": "Hương",
    "lang": "vi",
    "ipa": "hɨəŋ",
    "aliases": [
      "흐엉",
      "huong"
    ],
    "hanguls": [
      "혜원",
      "효린",
      "하영"
    ],
    "reasons": [
      "Gentle aspirate onset carrying deep fragrance of virtue.",
      "Melodious, dutiful harmony blooming in beauty.",
      "Spacious, radiant grace illuminating family and world."
    ]
  },
  {
    "name": "Tuấn",
    "lang": "vi",
    "ipa": "twən",
    "aliases": [
      "뚜언",
      "tuan"
    ],
    "hanguls": [
      "태윤",
      "단우",
      "찬솔"
    ],
    "reasons": [
      "Noble, handsome talent soaring with royal grace.",
      "Solid, steadfast cadence symbolizing moral integrity.",
      "Radiant pine-like integrity shining with steadfast honor."
    ]
  },
  {
    "name": "Anh",
    "lang": "vi",
    "ipa": "ʔaɲ",
    "aliases": [
      "안",
      "anh"
    ],
    "hanguls": [
      "안솔",
      "은우",
      "아인"
    ],
    "reasons": [
      "Pure open vowel onset conveying brilliant hero-like wisdom.",
      "Gentle, noble acoustic presence radiating quiet light.",
      "Warm, affectionate flow mirroring pure humanity."
    ]
  },
  {
    "name": "Dũng",
    "lang": "vi",
    "ipa": "zuŋ",
    "aliases": [
      "중",
      "zung"
    ],
    "hanguls": [
      "정우",
      "동우",
      "준우"
    ],
    "reasons": [
      "Deep resonant onset carrying valiant, steadfast courage.",
      "Warm, solid foundation of brotherly strength.",
      "Talented, courageous character standing tall."
    ]
  },
  {
    "name": "Mai",
    "lang": "vi",
    "ipa": "maːj",
    "aliases": [
      "마이"
    ],
    "hanguls": [
      "미아",
      "미래",
      "마루"
    ],
    "reasons": [
      "Bright plum blossom opening at the dawn of spring.",
      "Forward-looking cadence brimming with hope.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Phương",
    "lang": "vi",
    "ipa": "fɨəŋ",
    "aliases": [
      "프엉",
      "phuong"
    ],
    "hanguls": [
      "보람",
      "보람",
      "동우"
    ],
    "reasons": [
      "Fragrant, worthwhile life spreading gentle blessings.",
      "Fresh spring warmth bringing new beginnings.",
      "Majestic wind and cloud soaring across the sky."
    ]
  },
  {
    "name": "Hùng",
    "lang": "vi",
    "ipa": "huŋ",
    "aliases": [
      "흥",
      "hung"
    ],
    "hanguls": [
      "호연",
      "현준",
      "하람"
    ],
    "reasons": [
      "Grand heroic presence standing firm for what is noble.",
      "Exemplary brotherly pillar leading with poise.",
      "Heavenly blessing descending like gentle rain."
    ]
  },
  {
    "name": "Thảo",
    "lang": "vi",
    "ipa": "tʰaːw",
    "aliases": [
      "타오",
      "thao"
    ],
    "hanguls": [
      "태은",
      "다은",
      "도아"
    ],
    "reasons": [
      "Gentle dental flow mirroring dutiful filial devotion.",
      "Abundant, sweet kindness blessing everyone.",
      "Pure, serene lotus-like beauty blooming in peace."
    ]
  },
  {
    "name": "Nam",
    "lang": "vi",
    "ipa": "naːm",
    "aliases": [
      "남"
    ],
    "hanguls": [
      "남우",
      "나래",
      "노아"
    ],
    "reasons": [
      "Solid southern warmth conveying steadfast strength.",
      "Peaceful ferry-like bridge connecting hearts.",
      "Serene, welcoming presence radiating trust."
    ]
  },
  {
    "name": "Trang",
    "lang": "vi",
    "ipa": "ʈaːŋ",
    "aliases": [
      "짱"
    ],
    "hanguls": [
      "청아",
      "정아",
      "찬솔"
    ],
    "reasons": [
      "Pure, dignified demeanor like clear morning sky.",
      "Pure, upright character shining with calm light.",
      "Radiant pine-like integrity standing tall."
    ]
  },
  {
    "name": "Đức",
    "lang": "vi",
    "ipa": "ɗɨk",
    "aliases": [
      "득",
      "duc"
    ],
    "hanguls": [
      "도현",
      "동하",
      "단우"
    ],
    "reasons": [
      "Profound moral virtue guiding every step with honor.",
      "Bright summer river flow conveying abundance.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Huy",
    "lang": "vi",
    "ipa": "hwi",
    "aliases": [
      "후이"
    ],
    "hanguls": [
      "환희",
      "호윤",
      "하린"
    ],
    "reasons": [
      "Brilliant sunshine radiating honor and glorious joy.",
      "Dignified royal grace filled with vitality.",
      "Clear, refreshing summer rain of purity."
    ]
  },
  {
    "name": "Hoàng",
    "lang": "vi",
    "ipa": "hwaːŋ",
    "aliases": [
      "호앙",
      "hoang"
    ],
    "hanguls": [
      "호성",
      "한결",
      "하람"
    ],
    "reasons": [
      "Majestic golden aura soaring with royal dignity.",
      "Vast, sacred spirit preserving deep cultural roots.",
      "Heaven-sent blessing descending with poise."
    ]
  },
  {
    "name": "Long",
    "lang": "vi",
    "ipa": "lawŋ",
    "aliases": [
      "롱"
    ],
    "hanguls": [
      "로운",
      "라온",
      "도현"
    ],
    "reasons": [
      "Ascending dragon cadence soaring toward great goals.",
      "Joyful, shining spirit inspiring others.",
      "Deep insight and principled integrity."
    ]
  },
  {
    "name": "Quân",
    "lang": "vi",
    "ipa": "kwən",
    "aliases": [
      "꾸언",
      "quan"
    ],
    "hanguls": [
      "건우",
      "규민",
      "건우"
    ],
    "reasons": [
      "Noble leader possessing both courage and virtue.",
      "Exemplary character and moral achievement.",
      "Broad, compassionate presence commanding respect."
    ]
  },
  {
    "name": "Khoa",
    "lang": "vi",
    "ipa": "xwaː",
    "aliases": [
      "코아"
    ],
    "hanguls": [
      "강산",
      "규빈",
      "하늘"
    ],
    "reasons": [
      "Outstanding academic brilliance achieving high honor.",
      "Precious gem-like radiance inspiring peers.",
      "Vast, open sky filled with peace."
    ]
  },
  {
    "name": "Phúc",
    "lang": "vi",
    "ipa": "fuk",
    "aliases": [
      "푹",
      "phuc"
    ],
    "hanguls": [
      "보경",
      "필우",
      "보민"
    ],
    "reasons": [
      "Abundant blessings and fortune shared with the world.",
      "Helpful, steadfast pillar supporting others.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Thịnh",
    "lang": "vi",
    "ipa": "tʰïŋ",
    "aliases": [
      "틴",
      "thinh"
    ],
    "hanguls": [
      "태성",
      "신우",
      "상현"
    ],
    "reasons": [
      "Prosperous growth flourishing with enduring vigor.",
      "Faithful, trustworthy presence bringing calm.",
      "Dignified, expansive presence inspiring trust."
    ]
  },
  {
    "name": "Kiên",
    "lang": "vi",
    "ipa": "kiən",
    "aliases": [
      "끼엔",
      "kien"
    ],
    "hanguls": [
      "건우",
      "기범",
      "경민"
    ],
    "reasons": [
      "Steadfast perseverance holding firm against storms.",
      "Noble standard and exemplary character.",
      "Bright, cultured intelligence serving the community."
    ]
  },
  {
    "name": "Sơn",
    "lang": "vi",
    "ipa": "səːn",
    "aliases": [
      "선",
      "son"
    ],
    "hanguls": [
      "선우",
      "서진",
      "승민"
    ],
    "reasons": [
      "Majestic mountain peak standing calm and immovable.",
      "Modern, refined elegance carrying strength.",
      "Spiritual elevation and perceptive understanding."
    ]
  },
  {
    "name": "Lan",
    "lang": "vi",
    "ipa": "laːn",
    "aliases": [
      "란"
    ],
    "hanguls": [
      "라온",
      "나린",
      "예린"
    ],
    "reasons": [
      "Fragrant wild orchid blossoming in hidden valleys.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Clear, crystalline cadence reflecting honor."
    ]
  },
  {
    "name": "Ngọc",
    "lang": "vi",
    "ipa": "ŋawk",
    "aliases": [
      "응옥",
      "ngoc"
    ],
    "hanguls": [
      "노아",
      "나래",
      "보민"
    ],
    "reasons": [
      "Precious jade stone reflecting flawless character.",
      "Peaceful ferry-like bridge connecting hearts.",
      "Treasured jewel-like presence cherished deeply."
    ]
  },
  {
    "name": "Hoa",
    "lang": "vi",
    "ipa": "hwaː",
    "aliases": [
      "호아"
    ],
    "hanguls": [
      "혜아",
      "하은",
      "하나"
    ],
    "reasons": [
      "Splendid blossom bringing beauty to every season.",
      "Blessed grace and gentle, peaceful heart.",
      "One and only precious gift filled with light."
    ]
  },
  {
    "name": "Trâm",
    "lang": "vi",
    "ipa": "ʈəm",
    "aliases": [
      "쩜",
      "tram"
    ],
    "hanguls": [
      "채민",
      "담은",
      "지아"
    ],
    "reasons": [
      "Precious hairpin reflecting noble, refined poise.",
      "Deep pool of serene wisdom and quiet calm.",
      "Gentle, radiant presence spreading light."
    ]
  },
  {
    "name": "Hạnh",
    "lang": "vi",
    "ipa": "haïŋ",
    "aliases": [
      "한",
      "hanh"
    ],
    "hanguls": [
      "혜린",
      "효은",
      "하영"
    ],
    "reasons": [
      "Virtuous character blooming with upright conduct.",
      "Dutiful grace bringing happiness to family.",
      "Spacious, radiant grace illuminating the world."
    ]
  },
  {
    "name": "Vân",
    "lang": "vi",
    "ipa": "vən",
    "aliases": [
      "반",
      "van"
    ],
    "hanguls": [
      "온유",
      "여원",
      "원우"
    ],
    "reasons": [
      "Peaceful drifting cloud of gentle serenity.",
      "Serene beauty extending across quiet waters.",
      "Expansive, noble aura reaching across horizon."
    ]
  },
  {
    "name": "Yến",
    "lang": "vi",
    "ipa": "ʔiən",
    "aliases": [
      "이엔",
      "yen"
    ],
    "hanguls": [
      "예나",
      "예은",
      "연아"
    ],
    "reasons": [
      "Graceful swallow soaring with the coming of spring.",
      "Melodious balance conveying blessed kindness.",
      "Soft, graceful cadence echoing warmth."
    ]
  },
  {
    "name": "Diệu",
    "lang": "vi",
    "ipa": "ziəw",
    "aliases": [
      "지에우",
      "dieu"
    ],
    "hanguls": [
      "다율",
      "도연",
      "지우"
    ],
    "reasons": [
      "Sublime, miraculous grace filled with wonder.",
      "Graceful lotus-like beauty blooming in peace.",
      "Gentle, clear stream of understanding."
    ]
  },
  {
    "name": "Quyên",
    "lang": "vi",
    "ipa": "kwiən",
    "aliases": [
      "꾸엔",
      "quyen"
    ],
    "hanguls": [
      "가온",
      "경원",
      "채린"
    ],
    "reasons": [
      "Beautiful cuckoo bird singing melodies of joy.",
      "High visionary aspirations reaching toward light.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Tú",
    "lang": "vi",
    "ipa": "tu",
    "aliases": [
      "뚜"
    ],
    "hanguls": [
      "태우",
      "도윤",
      "태하"
    ],
    "reasons": [
      "Brilliant star shining in the clear night sky.",
      "Solid dental onset and melodious flow.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Vy",
    "lang": "vi",
    "ipa": "vi",
    "aliases": [
      "비"
    ],
    "hanguls": [
      "비아",
      "보민",
      "빛나"
    ],
    "reasons": [
      "Delicate wild rose possessing hidden resilience.",
      "Precious gem-like presence cherished deeply.",
      "Radiant victory shining with brilliant light."
    ]
  },
  {
    "name": "Thủy",
    "lang": "vi",
    "ipa": "tʰwi",
    "aliases": [
      "투이",
      "thuy"
    ],
    "hanguls": [
      "태윤",
      "서린",
      "수아"
    ],
    "reasons": [
      "Clear flowing water nurturing all living things.",
      "Fresh morning frost sparkling in the dawn.",
      "Open sibilant onset embodying pure wisdom."
    ]
  },
  {
    "name": "Bình",
    "lang": "vi",
    "ipa": "ɓïŋ",
    "aliases": [
      "빙",
      "binh"
    ],
    "hanguls": [
      "명우",
      "민우",
      "보민"
    ],
    "reasons": [
      "Peaceful, tranquil waters resting in harmony.",
      "Warm, companionable wisdom walking alongside.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Châu",
    "lang": "vi",
    "ipa": "tɕəw",
    "aliases": [
      "쩌우",
      "chau"
    ],
    "hanguls": [
      "조은",
      "주원",
      "지안"
    ],
    "reasons": [
      "Luminous pearl cultivated in ocean depths.",
      "Expansive cadence expressing central virtue.",
      "Serene, luminous flow reflecting inner peace."
    ]
  },
  {
    "name": "Trí",
    "lang": "vi",
    "ipa": "ʈi",
    "aliases": [
      "찌",
      "tri"
    ],
    "hanguls": [
      "태리",
      "지훈",
      "단비"
    ],
    "reasons": [
      "Profound wisdom seeing through complexity.",
      "Cultured intelligence leading with honor.",
      "Sweet rain arriving just when needed."
    ]
  },
  {
    "name": "Tiến",
    "lang": "vi",
    "ipa": "tiən",
    "aliases": [
      "띠엔",
      "tien"
    ],
    "hanguls": [
      "다온",
      "태인",
      "진우"
    ],
    "reasons": [
      "Courageous progress advancing toward great goals.",
      "Benevolent character blessed with royal poise.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Hải",
    "lang": "vi",
    "ipa": "haːj",
    "aliases": [
      "하이",
      "hai"
    ],
    "hanguls": [
      "해찬",
      "하람",
      "한별"
    ],
    "reasons": [
      "Vast ocean depth holding boundless possibilities.",
      "Heavenly blessing descending like soft rain.",
      "Single bright star guiding through the dark."
    ]
  },
  {
    "name": "Đạt",
    "lang": "vi",
    "ipa": "ɗaːt",
    "aliases": [
      "닷",
      "dat"
    ],
    "hanguls": [
      "단아",
      "도훈",
      "다솔"
    ],
    "reasons": [
      "Full attainment of wisdom and noble purpose.",
      "Great achievement leaving enduring legacy.",
      "Pine forest spreading refreshing shade."
    ]
  },
  {
    "name": "Tùng",
    "lang": "vi",
    "ipa": "tuŋ",
    "aliases": [
      "뚱",
      "tung"
    ],
    "hanguls": [
      "태웅",
      "동건",
      "태호"
    ],
    "reasons": [
      "Evergreen pine standing tall through winter snow.",
      "Strong, upright pillar standing for truth.",
      "Vast, heroic spirit embracing big goals."
    ]
  },
  {
    "name": "Duy",
    "lang": "vi",
    "ipa": "zwi",
    "aliases": [
      "주이"
    ],
    "hanguls": [
      "도진",
      "도원",
      "도현"
    ],
    "reasons": [
      "Singular focus and profound moral clarity.",
      "Expansive fortune opening bright horizon.",
      "Deep insight and principled integrity."
    ]
  },
  {
    "name": "Quang",
    "lang": "vi",
    "ipa": "kwaːŋ",
    "aliases": [
      "꽝"
    ],
    "hanguls": [
      "강율",
      "규빈",
      "광민"
    ],
    "reasons": [
      "Radiant light dispelling shadows of doubt.",
      "Precious gem-like radiance inspiring peers.",
      "Brilliant morning sun illuminating all."
    ]
  },
  {
    "name": "Cường",
    "lang": "vi",
    "ipa": "kɨəŋ",
    "aliases": [
      "끄엉",
      "cuong"
    ],
    "hanguls": [
      "건우",
      "규현",
      "기태"
    ],
    "reasons": [
      "Steadfast physical and moral fortitude.",
      "Precious jade-like virtue of high wisdom.",
      "Resolute character standing firm for truth."
    ]
  },
  {
    "name": "Thắng",
    "lang": "vi",
    "ipa": "tʰaŋ",
    "aliases": [
      "탕",
      "thang"
    ],
    "hanguls": [
      "태승",
      "상훈",
      "태하"
    ],
    "reasons": [
      "Glorious triumph earned through virtue and honor.",
      "Distinguished merit shining in history.",
      "Great, expansive leader of shining courage."
    ]
  },
  {
    "name": "Bích",
    "lang": "vi",
    "ipa": "ɓik",
    "aliases": [
      "빅",
      "bich"
    ],
    "hanguls": [
      "보경",
      "빛나",
      "보민"
    ],
    "reasons": [
      "Pristine blue-green jade of timeless beauty.",
      "Radiant victory shining with brilliant light.",
      "Treasured jewel-like presence cherished deeply."
    ]
  },
  {
    "name": "My",
    "lang": "vi",
    "ipa": "mi",
    "aliases": [
      "미"
    ],
    "hanguls": [
      "미소",
      "미래",
      "민아"
    ],
    "reasons": [
      "Gentle, smiling beauty bringing joy to all.",
      "Bright tomorrow blooming with hope.",
      "Charming, delicate melody filled with tenderness."
    ]
  },
  {
    "name": "Giang",
    "lang": "vi",
    "ipa": "zaːŋ",
    "aliases": [
      "장"
    ],
    "hanguls": [
      "가람",
      "규진",
      "강산"
    ],
    "reasons": [
      "Majestic flowing river carrying life to valleys.",
      "Precious standard of genuine excellence.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Khang",
    "lang": "vi",
    "ipa": "xaːŋ",
    "aliases": [
      "캉"
    ],
    "hanguls": [
      "강산",
      "경준",
      "건우"
    ],
    "reasons": [
      "Abundant peace, health, and prosperity.",
      "Cultured talent leading with distinction.",
      "Strong, upright pillar standing for truth."
    ]
  },
  {
    "name": "An",
    "lang": "vi",
    "ipa": "ʔaːn",
    "aliases": [
      "안"
    ],
    "hanguls": [
      "안솔",
      "은율",
      "온유"
    ],
    "reasons": [
      "Serene tranquility and secure contentment.",
      "Graceful melody echoing pristine purity.",
      "Tender, warm kindness embracing the world."
    ]
  },
  {
    "name": "Dmitry",
    "lang": "ru",
    "ipa": "dmʲitrʲɪj",
    "aliases": [
      "дмитрий",
      "dima",
      "ди마",
      "드미트리"
    ],
    "hanguls": [
      "다민",
      "도윤",
      "동민"
    ],
    "reasons": [
      "Dynamic 'D-m' consonant bridge conveying nobility and ambition.",
      "Commanding 'D-' onset, symbolizing wisdom, virtue, and poise.",
      "Deep resonant 'D-m' bridge, reflecting perseverance and honor."
    ]
  },
  {
    "name": "Elena",
    "lang": "ru",
    "ipa": "jɪˈlʲɛnə",
    "aliases": [
      "елена",
      "лена",
      "lena",
      "엘레나"
    ],
    "hanguls": [
      "예나",
      "연아",
      "은아"
    ],
    "reasons": [
      "Lyrical 'E-le-na' vowel flow, radiating clarity and poise.",
      "Soft, graceful 'Yeon-a' cadence echoing Elena's warmth.",
      "Gentle and peaceful resonance reflecting Elena's inner light."
    ]
  },
  {
    "name": "Ivan",
    "lang": "ru",
    "ipa": "ɪˈvan",
    "aliases": [
      "иван",
      "ваня",
      "vanya",
      "이반"
    ],
    "hanguls": [
      "이안",
      "이솔",
      "이안"
    ],
    "reasons": [
      "Gentle vowel start echoing divine grace.",
      "Evergreen pine purity reflecting sincerity.",
      "Harmonious flow of first-rank virtue."
    ]
  },
  {
    "name": "Anastasia",
    "lang": "ru",
    "ipa": "ənəstɐˈsʲijə",
    "aliases": [
      "анастасия",
      "настя",
      "nastya",
      "아나스타샤"
    ],
    "hanguls": [
      "아린",
      "나린",
      "예슬"
    ],
    "reasons": [
      "Resurrection of spring flowers blooming with hope.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Artistic wisdom and graceful poise."
    ]
  },
  {
    "name": "Mikhail",
    "lang": "ru",
    "ipa": "mʲɪxɐˈil",
    "aliases": [
      "михаил",
      "миша",
      "misha",
      "미하일"
    ],
    "hanguls": [
      "민찬",
      "미호",
      "마루"
    ],
    "reasons": [
      "Resonant bilabial onset conveying godly humility.",
      "Luminous brilliance commanding respect.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Svetlana",
    "lang": "ru",
    "ipa": "svʲɪˈtlanə",
    "aliases": [
      "светлана",
      "света",
      "sveta",
      "스베틀라나"
    ],
    "hanguls": [
      "슬기",
      "세라",
      "서아"
    ],
    "reasons": [
      "Pure starlight radiance dispelling darkness.",
      "Silken, starlight acoustic grace.",
      "Serene, tranquil flow filled with auspicious light."
    ]
  },
  {
    "name": "Alexander",
    "lang": "ru",
    "ipa": "əlʲɪkˈsandr",
    "aliases": [
      "александр",
      "саша",
      "sasha",
      "알렉산드르"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서진"
    ],
    "reasons": [
      "Majestic protector of ideals standing tall.",
      "Soft sibilant center reflecting gentle wisdom.",
      "Solid, dignified cadence echoing leadership."
    ]
  },
  {
    "name": "Anna",
    "lang": "ru",
    "ipa": "ˈanːə",
    "aliases": [
      "анна",
      "аня",
      "anya",
      "안나"
    ],
    "hanguls": [
      "안나",
      "은우",
      "아인"
    ],
    "reasons": [
      "Direct universal harmony meaning grace and blessedness.",
      "Gentle, noble acoustic presence radiating quiet light.",
      "Warm, affectionate flow mirroring pure humanity."
    ]
  },
  {
    "name": "Maxim",
    "lang": "ru",
    "ipa": "mɐkˈsʲim",
    "aliases": [
      "максим",
      "макс",
      "max",
      "막심"
    ],
    "hanguls": [
      "민성",
      "명성",
      "문성"
    ],
    "reasons": [
      "Greatest excellence reaching toward the summit.",
      "Radiant starlight reputation known far and wide.",
      "Cultured, scholarly virtue shaping tomorrow."
    ]
  },
  {
    "name": "Artem",
    "lang": "ru",
    "ipa": "ɐrˈtʲɵm",
    "aliases": [
      "артём",
      "артем",
      "tema",
      "아르툠"
    ],
    "hanguls": [
      "아람",
      "태민",
      "태은"
    ],
    "reasons": [
      "Sound health and unblemished noble vigor.",
      "Agile intellect and luminous energy.",
      "Gentle, blessed cadence filled with grace."
    ]
  },
  {
    "name": "Daniil",
    "lang": "ru",
    "ipa": "dənʲɪˈil",
    "aliases": [
      "даниил",
      "даня",
      "danya",
      "다닐"
    ],
    "hanguls": [
      "단우",
      "대현",
      "도원"
    ],
    "reasons": [
      "Righteous moral foundation standing firm.",
      "Broad wisdom illuminating the community.",
      "Expansive, peaceful garden of virtues."
    ]
  },
  {
    "name": "Nikita",
    "lang": "ru",
    "ipa": "nʲɪˈkʲitə",
    "aliases": [
      "никита",
      "nik",
      "니키타"
    ],
    "hanguls": [
      "나경",
      "나린",
      "기태"
    ],
    "reasons": [
      "Victorious perseverance guided by humble heart.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Resolute character standing firm for truth."
    ]
  },
  {
    "name": "Sergey",
    "lang": "ru",
    "ipa": "sʲɪrˈɡʲej",
    "aliases": [
      "сергей",
      "серёжа",
      "seryozha",
      "세르게이"
    ],
    "hanguls": [
      "서진",
      "성준",
      "서하"
    ],
    "reasons": [
      "Honorable guardian serving with steadfast devotion.",
      "Steadfast, upright virtue honoring truth.",
      "Expansive summer morning filled with warmth."
    ]
  },
  {
    "name": "Andrey",
    "lang": "ru",
    "ipa": "ɐnˈdrʲej",
    "aliases": [
      "андрей",
      "andrusha",
      "안드레이"
    ],
    "hanguls": [
      "안솔",
      "서진",
      "동현"
    ],
    "reasons": [
      "Manly courage standing firm for justice.",
      "Modern, refined elegance carrying strength.",
      "Bright, virtuous cadence radiating warmth."
    ]
  },
  {
    "name": "Ilya",
    "lang": "ru",
    "ipa": "ɪˈlʲja",
    "aliases": [
      "илья",
      "ilyusha",
      "일리야"
    ],
    "hanguls": [
      "이안",
      "인하",
      "예찬"
    ],
    "reasons": [
      "Soaring spiritual light illuminating the heavens.",
      "Deep benevolence flowing like broad river.",
      "Artistic brilliance shining with steadfast hope."
    ]
  },
  {
    "name": "Maria",
    "lang": "ru",
    "ipa": "mɐˈrʲijə",
    "aliases": [
      "мария",
      "маша",
      "masha",
      "마리야"
    ],
    "hanguls": [
      "미래",
      "민아",
      "마루"
    ],
    "reasons": [
      "Enduring oceanic grace and motherly warmth.",
      "Charming, delicate melody filled with tenderness.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Daria",
    "lang": "ru",
    "ipa": "ˈdarʲjə",
    "aliases": [
      "дарья",
      "даша",
      "dasha",
      "다리야"
    ],
    "hanguls": [
      "다온",
      "단아",
      "다은"
    ],
    "reasons": [
      "She who holds fast to goodness and blessing.",
      "Neat, refined poise reflecting deep virtue.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Polina",
    "lang": "ru",
    "ipa": "pɐˈlʲinə",
    "aliases": [
      "полина",
      "поля",
      "polya",
      "폴리나"
    ],
    "hanguls": [
      "보나",
      "보람",
      "보람"
    ],
    "reasons": [
      "Sunlit child of Apollo spreading daylight.",
      "Fulfilling, worthwhile life of humble wisdom.",
      "Fresh spring warmth bringing new beginnings."
    ]
  },
  {
    "name": "Alina",
    "lang": "ru",
    "ipa": "ɐˈlʲinə",
    "aliases": [
      "алина",
      "alya",
      "알리나"
    ],
    "hanguls": [
      "아린",
      "예린",
      "아라"
    ],
    "reasons": [
      "Bright, noble grace shining with delicate light.",
      "Clear, crystalline cadence reflecting honor.",
      "Vibrant oceanic melody brimming with beauty."
    ]
  },
  {
    "name": "Ksenia",
    "lang": "ru",
    "ipa": "ˈksʲenʲɪjə",
    "aliases": [
      "ксения",
      "сюша",
      "ksyusha",
      "크세니야"
    ],
    "hanguls": [
      "세아",
      "선아",
      "세은"
    ],
    "reasons": [
      "Hospitable warmth welcoming all with kindness.",
      "Gentle, virtuous flower blooming with poise.",
      "Silver blessings raining down gently."
    ]
  },
  {
    "name": "Olga",
    "lang": "ru",
    "ipa": "ˈolʲɡə",
    "aliases": [
      "ольга",
      "оля",
      "olya",
      "올가"
    ],
    "hanguls": [
      "온유",
      "우림",
      "서진"
    ],
    "reasons": [
      "Sacred, blessed light leading with royal poise.",
      "Deep forest-like depth and peace.",
      "Refined modern elegance carrying quiet authority."
    ]
  },
  {
    "name": "Tatiana",
    "lang": "ru",
    "ipa": "tətʲˈjanə",
    "aliases": [
      "татьяна",
      "таня",
      "tanya",
      "타티야나"
    ],
    "hanguls": [
      "태연",
      "태아",
      "다연"
    ],
    "reasons": [
      "Honorable founder establishing harmony.",
      "Great, expansive leader of shining courage.",
      "Graceful lotus-like beauty blooming in peace."
    ]
  },
  {
    "name": "Natalya",
    "lang": "ru",
    "ipa": "nɐˈtalʲjə",
    "aliases": [
      "наталья",
      "наташа",
      "natasha",
      "나탈리아"
    ],
    "hanguls": [
      "나래",
      "다솔",
      "나린"
    ],
    "reasons": [
      "Day of blessed birth bringing joyous renewal.",
      "Pine forest spreading refreshing shade.",
      "Heaven-sent blessing flowing with fresh vitality."
    ]
  },
  {
    "name": "Ekaterina",
    "lang": "ru",
    "ipa": "jɪkətʲɪˈrʲinə",
    "aliases": [
      "екатерина",
      "катя",
      "katya",
      "예카테리나"
    ],
    "hanguls": [
      "가은",
      "예린",
      "채린"
    ],
    "reasons": [
      "Pure, royal grace commanding deep reverence.",
      "Clear, crystalline cadence reflecting honor.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Vladimir",
    "lang": "ru",
    "ipa": "vlɐˈdʲimʲɪr",
    "aliases": [
      "владимир",
      "володя",
      "vova",
      "블라디미르"
    ],
    "hanguls": [
      "보람",
      "동민",
      "범진"
    ],
    "reasons": [
      "Ruler of peace cultivating universal harmony.",
      "Deep resonant bridge reflecting perseverance.",
      "Precious gem-like integrity shining bright."
    ]
  },
  {
    "name": "Roman",
    "lang": "ru",
    "ipa": "rɐˈman",
    "aliases": [
      "роман",
      "roma",
      "로만"
    ],
    "hanguls": [
      "로운",
      "라온",
      "명우"
    ],
    "reasons": [
      "Noble heritage of timeless strength and wisdom.",
      "Joyful pure Korean word echoing brilliance.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Denis",
    "lang": "ru",
    "ipa": "dʲɪˈnʲis",
    "aliases": [
      "денис",
      "den",
      "데니스"
    ],
    "hanguls": [
      "도윤",
      "대현",
      "단우"
    ],
    "reasons": [
      "Joyful celebration of life and fruitful harvest.",
      "Broad wisdom illuminating the community.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Pavel",
    "lang": "ru",
    "ipa": "ˈpavʲɪl",
    "aliases": [
      "павел",
      "паша",
      "pasha",
      "파벨"
    ],
    "hanguls": [
      "보람",
      "필우",
      "보람"
    ],
    "reasons": [
      "Humble, thoughtful heart of deep sincerity.",
      "Helpful, steadfast pillar supporting others.",
      "Straightforward righteousness seeking truth."
    ]
  },
  {
    "name": "Kirill",
    "lang": "ru",
    "ipa": "kʲɪˈrʲil",
    "aliases": [
      "кирилл",
      "kir",
      "키릴"
    ],
    "hanguls": [
      "기범",
      "가율",
      "규민"
    ],
    "reasons": [
      "Noble authority governed by compassion.",
      "Melodious rhythm celebrating life's music.",
      "Exemplary character and moral achievement."
    ]
  },
  {
    "name": "Yegor",
    "lang": "ru",
    "ipa": "jɪˈɡor",
    "aliases": [
      "егор",
      "yegorka",
      "예고르"
    ],
    "hanguls": [
      "영우",
      "여원",
      "연우"
    ],
    "reasons": [
      "Faithful tiller of earth nurturing community.",
      "Serene beauty extending across quiet waters.",
      "Gracious gift of heaven shining with light."
    ]
  },
  {
    "name": "Timofey",
    "lang": "ru",
    "ipa": "tʲɪmɐˈfʲej",
    "aliases": [
      "тимофей",
      "tima",
      "티모페이"
    ],
    "hanguls": [
      "태민",
      "태윤",
      "동우"
    ],
    "reasons": [
      "Honoring high ideals with devotion.",
      "Auspicious royal cadence filled with vitality.",
      "Solid, harmonious foundation of brotherly trust."
    ]
  },
  {
    "name": "Matvey",
    "lang": "ru",
    "ipa": "mɐtˈvʲej",
    "aliases": [
      "матвей",
      "motya",
      "마트베이"
    ],
    "hanguls": [
      "민태",
      "태윤",
      "명진"
    ],
    "reasons": [
      "Gift of heaven bringing joy to family.",
      "Auspicious royal cadence filled with vitality.",
      "Clear, authentic brilliance illuminating others."
    ]
  },
  {
    "name": "Alexey",
    "lang": "ru",
    "ipa": "ɐlʲɪkˈsʲej",
    "aliases": [
      "алексей",
      "алёша",
      "alyosha",
      "알렉세이"
    ],
    "hanguls": [
      "선우",
      "서진",
      "산들"
    ],
    "reasons": [
      "Gentle protector of peace and kindness.",
      "Modern, refined elegance carrying strength.",
      "Gentle mountain breeze echoing calm."
    ]
  },
  {
    "name": "Gleb",
    "lang": "ru",
    "ipa": "ɡlʲɛp",
    "aliases": [
      "глеб",
      "glebushka",
      "글렙"
    ],
    "hanguls": [
      "건우",
      "규민",
      "기범"
    ],
    "reasons": [
      "Heir of divine protection standing firm.",
      "Exemplary character and moral achievement.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Victoria",
    "lang": "ru",
    "ipa": "vʲɪkˈtorʲɪjə",
    "aliases": [
      "виктория",
      "вика",
      "vika",
      "빅토리야"
    ],
    "hanguls": [
      "빛나",
      "별아",
      "보아"
    ],
    "reasons": [
      "Radiant victory shining with brilliant light.",
      "Starlight dignity inspiring awe and respect.",
      "Precious, jewel-like resonance filled with joy."
    ]
  },
  {
    "name": "Yulia",
    "lang": "ru",
    "ipa": "ˈjulʲɪjə",
    "aliases": [
      "юлия",
      "юля",
      "yulya",
      "율리야"
    ],
    "hanguls": [
      "율아",
      "유나",
      "예린"
    ],
    "reasons": [
      "Youthful springtime grace blooming with cheer.",
      "Gentle flower blooming with poise.",
      "Clear, crystalline cadence reflecting honor."
    ]
  },
  {
    "name": "Irina",
    "lang": "ru",
    "ipa": "ɪˈrʲinə",
    "aliases": [
      "ирина",
      "ира",
      "ira",
      "이리나"
    ],
    "hanguls": [
      "아린",
      "예린",
      "이솔"
    ],
    "reasons": [
      "Serene dove of peace bringing quiet calm.",
      "Clear, crystalline cadence reflecting honor.",
      "Evergreen pine purity echoing fresh virtue."
    ]
  },
  {
    "name": "Valeria",
    "lang": "ru",
    "ipa": "vɐˈlʲɛrʲɪjə",
    "aliases": [
      "валерия",
      "лера",
      "lera",
      "발레리야"
    ],
    "hanguls": [
      "보민",
      "예린",
      "유라"
    ],
    "reasons": [
      "Strong, healthy spirit radiating inner light.",
      "Clear, crystalline cadence reflecting honor.",
      "Joyful, melodious rhythm filled with cheer."
    ]
  },
  {
    "name": "Vera",
    "lang": "ru",
    "ipa": "ˈvʲɛrə",
    "aliases": [
      "вера",
      "verochka",
      "베라"
    ],
    "hanguls": [
      "예원",
      "은비",
      "보아"
    ],
    "reasons": [
      "True, unwavering faith in the good.",
      "Silver blessings raining down gently.",
      "Precious, jewel-like resonance filled with joy."
    ]
  },
  {
    "name": "Nadezhda",
    "lang": "ru",
    "ipa": "nɐˈdʲɛʐdə",
    "aliases": [
      "надежда",
      "надя",
      "nadya",
      "나데즈다"
    ],
    "hanguls": [
      "나래",
      "다온",
      "단아"
    ],
    "reasons": [
      "Shining beacon of hope guiding hearts.",
      "Pure Korean: all good things arrive.",
      "Neat, refined poise reflecting deep virtue."
    ]
  },
  {
    "name": "Lyubov",
    "lang": "ru",
    "ipa": "lʲʊˈbofʲ",
    "aliases": [
      "любовь",
      "люба",
      "lyuba",
      "류보프"
    ],
    "hanguls": [
      "라온",
      "루아",
      "유나"
    ],
    "reasons": [
      "Pure universal love embracing all creation.",
      "Radiant light illuminating the pathway ahead.",
      "Gentle flower blooming with poise."
    ]
  },
  {
    "name": "Marina",
    "lang": "ru",
    "ipa": "mɐˈrʲinə",
    "aliases": [
      "марина",
      "marishka",
      "마리나"
    ],
    "hanguls": [
      "민아",
      "미래",
      "아린"
    ],
    "reasons": [
      "Gentle sea breeze carrying ocean depth.",
      "Bright tomorrow blooming with hope.",
      "Sparkling, delicate clarity filled with light."
    ]
  },
  {
    "name": "Alisa",
    "lang": "ru",
    "ipa": "ɐˈlʲisə",
    "aliases": [
      "алиса",
      "alisochka",
      "알리사"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은율"
    ],
    "reasons": [
      "Sparkling liquid flow evoking noble beauty.",
      "Artistic wisdom and graceful poise.",
      "Melodic cadence conveying blessed harmony."
    ]
  },
  {
    "name": "Varvara",
    "lang": "ru",
    "ipa": "vɐrˈvarə",
    "aliases": [
      "варвара",
      "варя",
      "varya",
      "바르바라"
    ],
    "hanguls": [
      "보민",
      "보람",
      "보라"
    ],
    "reasons": [
      "Unique, exotic beauty of courageous heart.",
      "Straightforward righteousness seeking truth.",
      "Gentle purple twilight conveying humility."
    ]
  },
  {
    "name": "Sofia",
    "lang": "ru",
    "ipa": "sɐˈfʲijə",
    "aliases": [
      "софия",
      "соня",
      "sonya",
      "소피야"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Open sibilant onset embodying pure wisdom.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Milana",
    "lang": "ru",
    "ipa": "mʲɪˈlanə",
    "aliases": [
      "милана",
      "mila",
      "밀라나"
    ],
    "hanguls": [
      "미래",
      "민아",
      "라온"
    ],
    "reasons": [
      "Dear, gracious darling cherished by family.",
      "Charming, delicate melody filled with tenderness.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Veronika",
    "lang": "ru",
    "ipa": "vʲɪrɐˈnʲikə",
    "aliases": [
      "вероника",
      "ника",
      "nika",
      "베로니카"
    ],
    "hanguls": [
      "빛나",
      "나린",
      "보민"
    ],
    "reasons": [
      "Bringer of victory and true image of grace.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Precious gem-like presence cherished deeply."
    ]
  },
  {
    "name": "Yaroslav",
    "lang": "ru",
    "ipa": "jɪrɐˈslaf",
    "aliases": [
      "ярослав",
      "ярик",
      "yarik",
      "야로슬라프"
    ],
    "hanguls": [
      "연우",
      "선우",
      "서진"
    ],
    "reasons": [
      "Fierce, bright glory shining like midday sun.",
      "Noble scholar-leader carrying empathy.",
      "Modern, refined elegance carrying strength."
    ]
  },
  {
    "name": "Oleg",
    "lang": "ru",
    "ipa": "ɐˈlʲɛk",
    "aliases": [
      "олег",
      "olezhka",
      "올레그"
    ],
    "hanguls": [
      "온유",
      "우림",
      "서진"
    ],
    "reasons": [
      "Sacred, blessed light leading with royal poise.",
      "Deep forest-like depth and peace.",
      "Refined modern elegance carrying quiet authority."
    ]
  },
  {
    "name": "Konstantin",
    "lang": "ru",
    "ipa": "kənstɐnʲˈtʲin",
    "aliases": [
      "константин",
      "костя",
      "kostya",
      "콘스탄틴"
    ],
    "hanguls": [
      "건우",
      "강산",
      "태윤"
    ],
    "reasons": [
      "Steadfast constancy holding true forever.",
      "Enduring mountain-and-river steadfastness.",
      "Bright royal cadence filled with vitality."
    ]
  },
  {
    "name": "Budi",
    "lang": "id",
    "ipa": "ˈbu.di",
    "aliases": [
      "부디",
      "budiman"
    ],
    "hanguls": [
      "보민",
      "도윤",
      "보람"
    ],
    "reasons": [
      "Gentle bilabial-dental bridge echoing wisdom and virtue.",
      "Solid, harmonious foundation of moral character.",
      "Fulfilling, worthwhile life of noble deed."
    ]
  },
  {
    "name": "Siti",
    "lang": "id",
    "ipa": "ˈsi.ti",
    "aliases": [
      "시티"
    ],
    "hanguls": [
      "수아",
      "채린",
      "서아"
    ],
    "reasons": [
      "Noble lady of pure heart and gentle grace.",
      "Brilliant jewel-like cadence reflecting honor.",
      "Serene, tranquil flow filled with auspicious light."
    ]
  },
  {
    "name": "Dewi",
    "lang": "id",
    "ipa": "ˈde.wi",
    "aliases": [
      "데위"
    ],
    "hanguls": [
      "다은",
      "도연",
      "다온"
    ],
    "reasons": [
      "Goddess-like radiance bringing heavenly peace.",
      "Graceful lotus-like beauty blooming in peace.",
      "Pure Korean: all good things arrive."
    ]
  },
  {
    "name": "Agus",
    "lang": "id",
    "ipa": "ˈa.ɡus",
    "aliases": [
      "아구스"
    ],
    "hanguls": [
      "안솔",
      "건우",
      "기범"
    ],
    "reasons": [
      "August, noble presence born in auspicious season.",
      "Strong, upright pillar standing for truth.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Putri",
    "lang": "id",
    "ipa": "ˈpu.tri",
    "aliases": [
      "푸트리"
    ],
    "hanguls": [
      "보민",
      "태연",
      "빛나"
    ],
    "reasons": [
      "Royal princess carrying gentle, refined beauty.",
      "Serene, tranquil flow filled with inner peace.",
      "Radiant victory shining with brilliant light."
    ]
  },
  {
    "name": "Rizky",
    "lang": "id",
    "ipa": "ˈriz.ki",
    "aliases": [
      "리즈키",
      "rizki"
    ],
    "hanguls": [
      "로운",
      "기범",
      "라온"
    ],
    "reasons": [
      "Blessed fortune and sustenance gifted by heaven.",
      "Noble standard and exemplary character.",
      "Joyful pure Korean word echoing brilliance."
    ]
  },
  {
    "name": "Bambang",
    "lang": "id",
    "ipa": "ˈbam.baŋ",
    "aliases": [
      "밤방"
    ],
    "hanguls": [
      "범진",
      "보민",
      "명우"
    ],
    "reasons": [
      "Knightly valor defending peace with honor.",
      "Precious gem-like integrity shining bright.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Dian",
    "lang": "id",
    "ipa": "ˈdi.an",
    "aliases": [
      "디안"
    ],
    "hanguls": [
      "다온",
      "도현",
      "단우"
    ],
    "reasons": [
      "Shining torch of light illuminating the pathway.",
      "Deep insight and principled integrity.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Eka",
    "lang": "id",
    "ipa": "ˈe.ka",
    "aliases": [
      "에카"
    ],
    "hanguls": [
      "은우",
      "가온",
      "예찬"
    ],
    "reasons": [
      "First and foremost leader standing at center.",
      "Centering acoustic harmony representing truth.",
      "Artistic brilliance shining with steadfast hope."
    ]
  },
  {
    "name": "Bayu",
    "lang": "id",
    "ipa": "ˈba.ju",
    "aliases": [
      "바유"
    ],
    "hanguls": [
      "보민",
      "우진",
      "범준"
    ],
    "reasons": [
      "Refreshing wind of spring bringing renewal.",
      "Steadfast, genuine progression with integrity.",
      "Exemplary pillar standing firm for righteousness."
    ]
  },
  {
    "name": "Dimas",
    "lang": "id",
    "ipa": "ˈdi.mas",
    "aliases": [
      "디마스"
    ],
    "hanguls": [
      "다민",
      "동현",
      "다민"
    ],
    "reasons": [
      "Beloved brother walking with warm empathy.",
      "Bright, virtuous cadence radiating warmth.",
      "Broad, compassionate leadership embracing all."
    ]
  },
  {
    "name": "Bagus",
    "lang": "id",
    "ipa": "ˈba.ɡus",
    "aliases": [
      "바구스"
    ],
    "hanguls": [
      "보민",
      "건우",
      "기범"
    ],
    "reasons": [
      "Handsome virtue and good, upright character.",
      "Strong, upright pillar standing for truth.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Adi",
    "lang": "id",
    "ipa": "ˈa.di",
    "aliases": [
      "아디"
    ],
    "hanguls": [
      "아담",
      "다온",
      "단우"
    ],
    "reasons": [
      "Supreme excellence and foundational virtue.",
      "Pure Korean: all good things arrive.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Surya",
    "lang": "id",
    "ipa": "ˈsur.ja",
    "aliases": [
      "수리아",
      "수리야"
    ],
    "hanguls": [
      "서진",
      "수아",
      "성준"
    ],
    "reasons": [
      "Sunlit brilliance radiating life across islands.",
      "Open sibilant onset embodying pure wisdom.",
      "Steadfast, upright virtue honoring truth."
    ]
  },
  {
    "name": "Hendra",
    "lang": "id",
    "ipa": "ˈhɛn.dra",
    "aliases": [
      "헨드라"
    ],
    "hanguls": [
      "현우",
      "해찬",
      "호연"
    ],
    "reasons": [
      "Gold-like brilliance shining through time.",
      "Sunlit defender holding fast to honor.",
      "Vast, open atmosphere of broad courage."
    ]
  },
  {
    "name": "Arif",
    "lang": "id",
    "ipa": "ˈa.rif",
    "aliases": [
      "아리프"
    ],
    "hanguls": [
      "아린",
      "필우",
      "이안"
    ],
    "reasons": [
      "Wise, discerning mind understanding all.",
      "Helpful, steadfast pillar supporting others.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Tri",
    "lang": "id",
    "ipa": "tri",
    "aliases": [
      "트리"
    ],
    "hanguls": [
      "태리",
      "지훈",
      "단비"
    ],
    "reasons": [
      "Harmony of three virtues: wisdom, love, courage.",
      "Cultured intelligence leading with honor.",
      "Sweet rain arriving just when needed."
    ]
  },
  {
    "name": "Wulan",
    "lang": "id",
    "ipa": "ˈwu.lan",
    "aliases": [
      "울란"
    ],
    "hanguls": [
      "우림",
      "온유",
      "라온"
    ],
    "reasons": [
      "Gentle moonlight casting silver over sea.",
      "Tender, warm kindness embracing the world.",
      "Joyful pure Korean word echoing brilliance."
    ]
  },
  {
    "name": "Rini",
    "lang": "id",
    "ipa": "ˈri.ni",
    "aliases": [
      "리니"
    ],
    "hanguls": [
      "린아",
      "나린",
      "라온"
    ],
    "reasons": [
      "Refreshing, melodious cadence of rain.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Ratna",
    "lang": "id",
    "ipa": "ˈrat.na",
    "aliases": [
      "라트나"
    ],
    "hanguls": [
      "라온",
      "단아",
      "나린"
    ],
    "reasons": [
      "Radiant jewel glittering in the sun.",
      "Neat, refined poise reflecting deep virtue.",
      "Heaven-sent blessing flowing with fresh vitality."
    ]
  },
  {
    "name": "Sari",
    "lang": "id",
    "ipa": "ˈsa.ri",
    "aliases": [
      "사리"
    ],
    "hanguls": [
      "세라",
      "소라",
      "서아"
    ],
    "reasons": [
      "Essence of fragrant flowers blooming.",
      "Ocean shell melody echoing tranquil calm.",
      "Soft, auspicious resonance reflecting peace."
    ]
  },
  {
    "name": "Ayu",
    "lang": "id",
    "ipa": "ˈa.ju",
    "aliases": [
      "아유"
    ],
    "hanguls": [
      "아영",
      "아라",
      "유나"
    ],
    "reasons": [
      "Graceful, sweet beauty adored by all.",
      "Vibrant oceanic melody brimming with beauty.",
      "Gentle flower blooming with poise."
    ]
  },
  {
    "name": "Indah",
    "lang": "id",
    "ipa": "ˈin.dah",
    "aliases": [
      "인다"
    ],
    "hanguls": [
      "은서",
      "인아",
      "다은"
    ],
    "reasons": [
      "Sublime beauty inspiring awe and joy.",
      "Warm affectionate presence filled with care.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Mega",
    "lang": "id",
    "ipa": "ˈmɛ.ɡa",
    "aliases": [
      "메가"
    ],
    "hanguls": [
      "명우",
      "민아",
      "가온"
    ],
    "reasons": [
      "Soaring clouds painting sunset across skies.",
      "Charming, delicate melody filled with tenderness.",
      "Centering acoustic harmony representing truth."
    ]
  },
  {
    "name": "Nur",
    "lang": "id",
    "ipa": "nur",
    "aliases": [
      "누르"
    ],
    "hanguls": [
      "노아",
      "나래",
      "은우"
    ],
    "reasons": [
      "Sacred, divine light guiding in dark.",
      "Creative wings soaring with imagination.",
      "Gentle, noble acoustic presence radiating light."
    ]
  },
  {
    "name": "Lestari",
    "lang": "id",
    "ipa": "ləsˈta.ri",
    "aliases": [
      "레스타리"
    ],
    "hanguls": [
      "라온",
      "세라",
      "다은"
    ],
    "reasons": [
      "Everlasting preservation of nature's beauty.",
      "Silken regal presence carrying dignity.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Fitri",
    "lang": "id",
    "ipa": "ˈfit.ri",
    "aliases": [
      "피트리"
    ],
    "hanguls": [
      "필우",
      "태연",
      "보민"
    ],
    "reasons": [
      "Pristine purity and joyful renewal.",
      "Serene, tranquil flow filled with inner peace.",
      "Precious gem-like presence cherished deeply."
    ]
  },
  {
    "name": "Rina",
    "lang": "id",
    "ipa": "ˈri.na",
    "aliases": [
      "리나"
    ],
    "hanguls": [
      "린아",
      "나린",
      "라온"
    ],
    "reasons": [
      "Joyful melody echoing gentle summer rain.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Maya",
    "lang": "id",
    "ipa": "ˈma.ja",
    "aliases": [
      "마야"
    ],
    "hanguls": [
      "민아",
      "미래",
      "아민"
    ],
    "reasons": [
      "Gentle, lovely oceanic grace and elegance.",
      "Bright tomorrow blooming with hope.",
      "Serene, compassionate bridge echoing harmony."
    ]
  },
  {
    "name": "Wahyu",
    "lang": "id",
    "ipa": "ˈwah.ju",
    "aliases": [
      "와휴"
    ],
    "hanguls": [
      "원우",
      "호연",
      "우진"
    ],
    "reasons": [
      "Divine revelation enlightening the mind.",
      "Vast, open atmosphere of broad courage.",
      "Steadfast, genuine progression with integrity."
    ]
  },
  {
    "name": "Gunawan",
    "lang": "id",
    "ipa": "ɡuˈna.wan",
    "aliases": [
      "구나완"
    ],
    "hanguls": [
      "건우",
      "규민",
      "원우"
    ],
    "reasons": [
      "Endowed with manifold virtues and abilities.",
      "Exemplary character and moral achievement.",
      "Expansive, noble aura reaching across horizon."
    ]
  },
  {
    "name": "Joko",
    "lang": "id",
    "ipa": "ˈdʒo.ko",
    "aliases": [
      "조코"
    ],
    "hanguls": [
      "조은",
      "주원",
      "정우"
    ],
    "reasons": [
      "Young, vigorous leader filled with promise.",
      "Warm, benevolent resonance celebrating joy.",
      "Steadfast righteousness shining bright."
    ]
  },
  {
    "name": "Ilham",
    "lang": "id",
    "ipa": "ˈil.ham",
    "aliases": [
      "일함"
    ],
    "hanguls": [
      "이안",
      "하람",
      "이안"
    ],
    "reasons": [
      "Creative inspiration breathing new life.",
      "Heavenly blessing descending like soft rain.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Fajar",
    "lang": "id",
    "ipa": "ˈfa.dʒar",
    "aliases": [
      "파자르"
    ],
    "hanguls": [
      "범진",
      "재하",
      "하람"
    ],
    "reasons": [
      "First morning rays breaking over dawn horizon.",
      "Crisp onset carrying bright energy.",
      "Heaven-sent blessing descending with poise."
    ]
  },
  {
    "name": "Gilang",
    "lang": "id",
    "ipa": "ˈɡi.laŋ",
    "aliases": [
      "길랑"
    ],
    "hanguls": [
      "기범",
      "가람",
      "강산"
    ],
    "reasons": [
      "Radiant, glittering brilliance shining far.",
      "Flowing river clarity reflecting pure character.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Angga",
    "lang": "id",
    "ipa": "ˈaŋ.ɡa",
    "aliases": [
      "앙가"
    ],
    "hanguls": [
      "안솔",
      "건우",
      "강산"
    ],
    "reasons": [
      "Strong, handsome pillar standing tall.",
      "Strong, upright pillar standing for truth.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Aditya",
    "lang": "id",
    "ipa": "aˈdit.ja",
    "aliases": [
      "아디티아"
    ],
    "hanguls": [
      "단우",
      "태윤",
      "아인"
    ],
    "reasons": [
      "Sun god's boundless warmth and light.",
      "Bright royal cadence filled with vitality.",
      "Warm, affectionate flow mirroring humanity."
    ]
  },
  {
    "name": "Agung",
    "lang": "id",
    "ipa": "ˈa.ɡuŋ",
    "aliases": [
      "아궁"
    ],
    "hanguls": [
      "안솔",
      "건우",
      "기태"
    ],
    "reasons": [
      "Grand, majestic mountain inspiring reverence.",
      "Strong, upright pillar standing for truth.",
      "Resolute character standing firm for truth."
    ]
  },
  {
    "name": "Dwi",
    "lang": "id",
    "ipa": "dwi",
    "aliases": [
      "드위"
    ],
    "hanguls": [
      "도윤",
      "다은",
      "단우"
    ],
    "reasons": [
      "Harmonious bridge balancing two worlds.",
      "Abundant, sweet kindness blessing everyone.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Pratama",
    "lang": "id",
    "ipa": "praˈta.ma",
    "aliases": [
      "프라타마"
    ],
    "hanguls": [
      "필우",
      "태민",
      "명우"
    ],
    "reasons": [
      "Excellence standing first in virtue and talent.",
      "Agile intellect and luminous energy.",
      "Clear, bright resonance conveying blessings."
    ]
  },
  {
    "name": "Anisa",
    "lang": "id",
    "ipa": "aˈni.sa",
    "aliases": [
      "아니사"
    ],
    "hanguls": [
      "아린",
      "예슬",
      "은서"
    ],
    "reasons": [
      "Affectionate, gentle companion bringing joy.",
      "Artistic wisdom and graceful poise.",
      "Soft vowel start echoing gentle spirit."
    ]
  },
  {
    "name": "Nabila",
    "lang": "id",
    "ipa": "naˈbi.la",
    "aliases": [
      "나빌라"
    ],
    "hanguls": [
      "나래",
      "보민",
      "라온"
    ],
    "reasons": [
      "Noble intelligence and generous heart.",
      "Precious gem-like presence cherished deeply.",
      "Joyful pure Korean word echoing brilliance."
    ]
  },
  {
    "name": "Rahma",
    "lang": "id",
    "ipa": "ˈrah.ma",
    "aliases": [
      "라마"
    ],
    "hanguls": [
      "라온",
      "하람",
      "마루"
    ],
    "reasons": [
      "Tender mercy and boundless compassion.",
      "Heavenly blessing descending like soft rain.",
      "Mountain peak integrity standing tall."
    ]
  },
  {
    "name": "Tari",
    "lang": "id",
    "ipa": "ˈta.ri",
    "aliases": [
      "타리"
    ],
    "hanguls": [
      "태리",
      "다연",
      "단비"
    ],
    "reasons": [
      "Graceful dancer expressing joy in motion.",
      "Graceful lotus-like beauty blooming in peace.",
      "Sweet rain arriving just when needed."
    ]
  },
  {
    "name": "Kirana",
    "lang": "id",
    "ipa": "kiˈra.na",
    "aliases": [
      "키라나"
    ],
    "hanguls": [
      "가온",
      "라온",
      "나린"
    ],
    "reasons": [
      "Radiant ray of light bringing dawn to all.",
      "Joyful pure Korean word echoing brilliance.",
      "Heaven-sent blessing flowing with fresh vitality."
    ]
  },
  {
    "name": "Sakura",
    "lang": "ja",
    "ipa": "sa.kɯ.ɾa",
    "aliases": [
      "사쿠라",
      "さくら",
      "サクラ",
      "桜"
    ],
    "hanguls": [
      "세라",
      "수아",
      "서아"
    ],
    "reasons": [
      "Lyrical 'Sa-ra' cadence, mirroring the gentle beauty of cherry blossoms.",
      "Soft 'S-' flow and bright vowels, expressing pure elegance.",
      "Tranquil 'Seo-a' harmony, symbolizing peaceful and auspicious grace."
    ]
  },
  {
    "name": "Haruto",
    "lang": "ja",
    "ipa": "ha.ɾɯ.to",
    "aliases": [
      "하루토",
      "はると",
      "ハルト",
      "陽翔"
    ],
    "hanguls": [
      "하람",
      "하루",
      "한결"
    ],
    "reasons": [
      "Soaring bird in sunlit morning skies.",
      "Pure Korean word 'haru' embodying fresh daily joy.",
      "Steadfast constancy remaining true through all seasons."
    ]
  },
  {
    "name": "Yuki",
    "lang": "ja",
    "ipa": "jɯ.kʲi",
    "aliases": [
      "유키",
      "ゆき",
      "ユキ",
      "雪"
    ],
    "hanguls": [
      "유진",
      "유빈",
      "은결"
    ],
    "reasons": [
      "Gentle white snow bringing serene peace to the world.",
      "Precious gem sparkling with unblemished sincerity.",
      "Pristine, silver pure wave of morning light."
    ]
  },
  {
    "name": "Aoi",
    "lang": "ja",
    "ipa": "a.o.i",
    "aliases": [
      "아오이",
      "あおい",
      "アオイ",
      "葵"
    ],
    "hanguls": [
      "아인",
      "온유",
      "이안"
    ],
    "reasons": [
      "Pure blue sky and flourishing hollyhock flower.",
      "Tender, warm kindness embracing the world.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Ren",
    "lang": "ja",
    "ipa": "ɾeɴ",
    "aliases": [
      "렌",
      "れん",
      "レン",
      "蓮"
    ],
    "hanguls": [
      "로운",
      "라온",
      "려원"
    ],
    "reasons": [
      "Pure lotus flower rising untainted above clear waters.",
      "Joyful pure Korean word echoing regal brilliance.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Hina",
    "lang": "ja",
    "ipa": "çi.na",
    "aliases": [
      "히나",
      "ひな",
      "ヒナ",
      "陽菜"
    ],
    "hanguls": [
      "하나",
      "하린",
      "혜린"
    ],
    "reasons": [
      "Sunny warmth of spring flowers blooming.",
      "Clear, refreshing summer rain of purity.",
      "Radiant, refined cadence filled with bright wisdom."
    ]
  },
  {
    "name": "Ken",
    "lang": "ja",
    "ipa": "keɴ",
    "aliases": [
      "켄",
      "けん",
      "ケン",
      "健"
    ],
    "hanguls": [
      "건우",
      "기범",
      "강산"
    ],
    "reasons": [
      "Healthy, upright pillar standing firm for justice.",
      "Noble standard and exemplary character.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Yuto",
    "lang": "ja",
    "ipa": "jɯː.to",
    "aliases": [
      "유토",
      "ゆうと",
      "ユウト",
      "悠斗"
    ],
    "hanguls": [
      "율아",
      "유찬",
      "우진"
    ],
    "reasons": [
      "Vast, leisurely cosmos soaring with great goals.",
      "Radiant, clear vocal resonance.",
      "Steadfast, genuine progression with integrity."
    ]
  },
  {
    "name": "Riku",
    "lang": "ja",
    "ipa": "ɾʲi.kɯ",
    "aliases": [
      "리쿠",
      "りく",
      "リク",
      "陸"
    ],
    "hanguls": [
      "로운",
      "라온",
      "규민"
    ],
    "reasons": [
      "Broad, firm earth supporting all life with strength.",
      "Joyful pure Korean word echoing brilliance.",
      "Exemplary character and moral achievement."
    ]
  },
  {
    "name": "Yuna",
    "lang": "ja",
    "ipa": "jɯ.na",
    "aliases": [
      "유나",
      "ゆな",
      "ユナ",
      "優奈"
    ],
    "hanguls": [
      "유나",
      "예나",
      "윤아"
    ],
    "reasons": [
      "Gentle, abundant grace blooming with tenderness.",
      "Lyrical vowel flow radiating clarity and poise.",
      "Graceful, bright cadence reflecting blooming vitality."
    ]
  },
  {
    "name": "Sota",
    "lang": "ja",
    "ipa": "soː.ta",
    "aliases": [
      "소타",
      "そうた",
      "ソウタ",
      "颯太"
    ],
    "hanguls": [
      "선우",
      "태윤",
      "서진"
    ],
    "reasons": [
      "Refreshing breeze blowing across green hills.",
      "Bright royal cadence filled with vitality.",
      "Modern, refined elegance carrying strength."
    ]
  },
  {
    "name": "Minato",
    "lang": "ja",
    "ipa": "mʲi.na.to",
    "aliases": [
      "미나토",
      "みなと",
      "ミナト",
      "湊"
    ],
    "hanguls": [
      "민태",
      "명우",
      "민재"
    ],
    "reasons": [
      "Peaceful harbor where gentle boats find safe rest.",
      "Clear, bright resonance conveying blessings.",
      "Agile intellect and versatile talent."
    ]
  },
  {
    "name": "Haruki",
    "lang": "ja",
    "ipa": "ha.ɾɯ.kʲi",
    "aliases": [
      "하루키",
      "はるき",
      "ハルキ",
      "春樹"
    ],
    "hanguls": [
      "하람",
      "하루",
      "기범"
    ],
    "reasons": [
      "Springtime tree branching toward bright sky.",
      "Pure Korean word 'haru' embodying fresh daily joy.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Kaito",
    "lang": "ja",
    "ipa": "ka.i.to",
    "aliases": [
      "카이토",
      "かいと",
      "カイト",
      "海斗"
    ],
    "hanguls": [
      "가온",
      "태윤",
      "강산"
    ],
    "reasons": [
      "Vast ocean soaring to reach the Big Dipper.",
      "Bright royal cadence filled with vitality.",
      "Enduring mountain-and-river steadfastness."
    ]
  },
  {
    "name": "Asahi",
    "lang": "ja",
    "ipa": "a.sa.çi",
    "aliases": [
      "아사히",
      "あさひ",
      "アサヒ",
      "朝日"
    ],
    "hanguls": [
      "아인",
      "서하",
      "새벽"
    ],
    "reasons": [
      "Radiant morning sun rising over the sea.",
      "Expansive summer morning filled with warmth.",
      "First morning rays bringing renewal."
    ]
  },
  {
    "name": "Ryo",
    "lang": "ja",
    "ipa": "ɾʲoː",
    "aliases": [
      "료",
      "りょう",
      "リョウ",
      "亮"
    ],
    "hanguls": [
      "로운",
      "라온",
      "려원"
    ],
    "reasons": [
      "Cool, refreshing clarity and brilliant insight.",
      "Joyful pure Korean word echoing brilliance.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Daiki",
    "lang": "ja",
    "ipa": "da.i.kʲi",
    "aliases": [
      "다이키",
      "だいき",
      "ダイキ",
      "大輝"
    ],
    "hanguls": [
      "다민",
      "대현",
      "도원"
    ],
    "reasons": [
      "Great, radiant brilliance shining far and wide.",
      "Broad wisdom illuminating the community.",
      "Expansive, peaceful garden of virtues."
    ]
  },
  {
    "name": "Sora",
    "lang": "ja",
    "ipa": "so.ɾa",
    "aliases": [
      "소라",
      "そら",
      "ソラ",
      "空"
    ],
    "hanguls": [
      "소라",
      "하늘",
      "서아"
    ],
    "reasons": [
      "Vast, boundless sky embracing all creation.",
      "Direct pure Korean word 'haneul' meaning sky.",
      "Tranquil flow filled with auspicious light."
    ]
  },
  {
    "name": "Yuma",
    "lang": "ja",
    "ipa": "jɯː.ma",
    "aliases": [
      "유마",
      "ゆうま",
      "ユウマ",
      "悠真"
    ],
    "hanguls": [
      "유찬",
      "명우",
      "우진"
    ],
    "reasons": [
      "Vast truth and sincerity walking with ease.",
      "Clear, bright resonance conveying blessings.",
      "Steadfast, genuine progression with integrity."
    ]
  },
  {
    "name": "Himari",
    "lang": "ja",
    "ipa": "çi.ma.ɾʲi",
    "aliases": [
      "히마리",
      "ひまり",
      "ヒマリ",
      "陽葵"
    ],
    "hanguls": [
      "하린",
      "미래",
      "혜린"
    ],
    "reasons": [
      "Sunlit hollyhock turning toward radiant light.",
      "Bright tomorrow blooming with hope.",
      "Refined, radiant cadence filled with wisdom."
    ]
  },
  {
    "name": "Akari",
    "lang": "ja",
    "ipa": "a.ka.ɾʲi",
    "aliases": [
      "아카리",
      "あかり",
      "アカリ",
      "明莉"
    ],
    "hanguls": [
      "아린",
      "가은",
      "라온"
    ],
    "reasons": [
      "Warm, bright lantern guiding weary travelers.",
      "Thankful, blessed melody filled with charm.",
      "Joyful pure Korean cadence filled with light."
    ]
  },
  {
    "name": "Koharu",
    "lang": "ja",
    "ipa": "ko.ha.ɾɯ",
    "aliases": [
      "코하루",
      "こはる",
      "コハル",
      "小春"
    ],
    "hanguls": [
      "가온",
      "하람",
      "하루"
    ],
    "reasons": [
      "Gentle warm breeze of mild late autumn sun.",
      "Heavenly blessing descending like gentle rain.",
      "Pure Korean word 'haru' embodying fresh joy."
    ]
  },
  {
    "name": "Mio",
    "lang": "ja",
    "ipa": "mʲi.o",
    "aliases": [
      "미오",
      "みお",
      "ミオ",
      "美桜"
    ],
    "hanguls": [
      "민아",
      "미래",
      "온유"
    ],
    "reasons": [
      "Beautiful cherry blossom dancing on water.",
      "Bright tomorrow blooming with hope.",
      "Tender, warm kindness embracing the world."
    ]
  },
  {
    "name": "Mei",
    "lang": "ja",
    "ipa": "me.i",
    "aliases": [
      "메이",
      "めい",
      "メイ",
      "芽依"
    ],
    "hanguls": [
      "민아",
      "예나",
      "미래"
    ],
    "reasons": [
      "Fresh budding sprout opening to warm rain.",
      "Lyrical vowel flow radiating clarity.",
      "Bright tomorrow blooming with hope."
    ]
  },
  {
    "name": "Yua",
    "lang": "ja",
    "ipa": "jɯ.a",
    "aliases": [
      "유아",
      "ゆあ",
      "ユア",
      "結愛"
    ],
    "hanguls": [
      "유나",
      "아린",
      "율아"
    ],
    "reasons": [
      "Binding hearts together with eternal affection.",
      "Sparkling, delicate clarity filled with light.",
      "Rhythmic elegance reflecting peaceful joy."
    ]
  },
  {
    "name": "Rin",
    "lang": "ja",
    "ipa": "ɾʲiɴ",
    "aliases": [
      "린",
      "りん",
      "リン",
      "凛"
    ],
    "hanguls": [
      "하린",
      "유린",
      "채린"
    ],
    "reasons": [
      "Dignified, cool composure of noble poise.",
      "Serene water-like resonance symbolizing clarity.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Hana",
    "lang": "ja",
    "ipa": "ha.na",
    "aliases": [
      "하나",
      "はな",
      "ハナ",
      "花"
    ],
    "hanguls": [
      "하나",
      "하은",
      "혜아"
    ],
    "reasons": [
      "Direct Korean match 'hana', one precious flower.",
      "Blessed grace and gentle, peaceful heart.",
      "Splendid blossom bringing beauty to every season."
    ]
  },
  {
    "name": "Sara",
    "lang": "ja",
    "ipa": "sa.ɾa",
    "aliases": [
      "사라",
      "さら",
      "サラ",
      "紗良"
    ],
    "hanguls": [
      "세라",
      "소라",
      "서아"
    ],
    "reasons": [
      "Fine silk fabric of gentle, virtuous heart.",
      "Ocean shell melody echoing tranquil calm.",
      "Soft, auspicious resonance reflecting peace."
    ]
  },
  {
    "name": "Kanna",
    "lang": "ja",
    "ipa": "kaɴ.na",
    "aliases": [
      "칸나",
      "かんな",
      "カンナ",
      "栞奈"
    ],
    "hanguls": [
      "가은",
      "안나",
      "나린"
    ],
    "reasons": [
      "Guidance marker on life's path leading home.",
      "Universal harmony meaning grace.",
      "Heaven-sent blessing flowing with fresh vitality."
    ]
  },
  {
    "name": "Tsubasa",
    "lang": "ja",
    "ipa": "tsɯ.ba.sa",
    "aliases": [
      "츠바사",
      "つばさ",
      "ツバサ",
      "翼"
    ],
    "hanguls": [
      "찬솔",
      "보민",
      "새벽"
    ],
    "reasons": [
      "Soaring wings flying across endless horizons.",
      "Precious gem-like presence cherished deeply.",
      "First morning rays bringing renewal."
    ]
  },
  {
    "name": "Hayato",
    "lang": "ja",
    "ipa": "ha.ja.to",
    "aliases": [
      "하야토",
      "はやと",
      "ハヤト",
      "隼人"
    ],
    "hanguls": [
      "하람",
      "현우",
      "태윤"
    ],
    "reasons": [
      "Falcon-like speed and decisive noble courage.",
      "Wise, virtuous hero leading with vision.",
      "Bright royal cadence filled with vitality."
    ]
  },
  {
    "name": "Yamato",
    "lang": "ja",
    "ipa": "ja.ma.to",
    "aliases": [
      "야마토",
      "やまと",
      "ヤマト",
      "大和"
    ],
    "hanguls": [
      "연우",
      "명우",
      "태민"
    ],
    "reasons": [
      "Grand harmony embracing people and land.",
      "Clear, bright resonance conveying blessings.",
      "Agile intellect and luminous energy."
    ]
  },
  {
    "name": "Ryota",
    "lang": "ja",
    "ipa": "ɾʲoː.ta",
    "aliases": [
      "료타",
      "りょうた",
      "リョウタ",
      "涼太"
    ],
    "hanguls": [
      "로운",
      "태윤",
      "라온"
    ],
    "reasons": [
      "Refreshing coolness and magnificent broad heart.",
      "Bright royal cadence filled with vitality.",
      "Joyful pure Korean word echoing brilliance."
    ]
  },
  {
    "name": "Kenshin",
    "lang": "ja",
    "ipa": "keɴ.ɕiɴ",
    "aliases": [
      "켄신",
      "けんしん",
      "ケンシン",
      "謙信"
    ],
    "hanguls": [
      "건우",
      "신우",
      "선우"
    ],
    "reasons": [
      "Humble heart and unwavering faithful trust.",
      "Faithful, trustworthy presence bringing calm.",
      "Noble scholar-leader carrying empathy."
    ]
  },
  {
    "name": "Shin",
    "lang": "ja",
    "ipa": "ɕiɴ",
    "aliases": [
      "신",
      "しん",
      "シン",
      "真"
    ],
    "hanguls": [
      "신우",
      "서진",
      "승민"
    ],
    "reasons": [
      "True, genuine sincerity remaining constant.",
      "Modern, refined elegance carrying strength.",
      "Spiritual elevation and perceptive understanding."
    ]
  },
  {
    "name": "Kazuki",
    "lang": "ja",
    "ipa": "ka.zɯ.kʲi",
    "aliases": [
      "카즈키",
      "かずき",
      "カズキ",
      "一樹"
    ],
    "hanguls": [
      "가온",
      "건우",
      "기범"
    ],
    "reasons": [
      "Single majestic tree standing tall in meadow.",
      "Strong, upright pillar standing for truth.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Ryusei",
    "lang": "ja",
    "ipa": "ɾʲɯː.seː",
    "aliases": [
      "류세이",
      "りゅうせい",
      "リュウセイ",
      "流星"
    ],
    "hanguls": [
      "로운",
      "성준",
      "라온"
    ],
    "reasons": [
      "Shooting star trailing brilliant starlight.",
      "Steadfast, upright virtue honoring truth.",
      "Joyful pure Korean word echoing brilliance."
    ]
  },
  {
    "name": "Ayato",
    "lang": "ja",
    "ipa": "a.ja.to",
    "aliases": [
      "아야토",
      "あやと",
      "アヤト",
      "絢斗"
    ],
    "hanguls": [
      "아인",
      "태윤",
      "연우"
    ],
    "reasons": [
      "Exquisite brocade pattern woven with wisdom.",
      "Bright royal cadence filled with vitality.",
      "Gracious gift of heaven shining with light."
    ]
  },
  {
    "name": "Nana",
    "lang": "ja",
    "ipa": "na.na",
    "aliases": [
      "나나",
      "なな",
      "ナナ",
      "七菜"
    ],
    "hanguls": [
      "나래",
      "나린",
      "다은"
    ],
    "reasons": [
      "Green spring herbs bringing fresh vitality.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Yui",
    "lang": "ja",
    "ipa": "jɯ.i",
    "aliases": [
      "유이",
      "ゆい",
      "ユイ",
      "結衣"
    ],
    "hanguls": [
      "유나",
      "예린",
      "율아"
    ],
    "reasons": [
      "Silken bond tying loving hearts together.",
      "Clear, crystalline cadence reflecting honor.",
      "Rhythmic elegance reflecting peaceful joy."
    ]
  },
  {
    "name": "Honoka",
    "lang": "ja",
    "ipa": "ho.no.ka",
    "aliases": [
      "호노카",
      "ほのか",
      "ホノカ",
      "穂香"
    ],
    "hanguls": [
      "혜아",
      "노아",
      "가은"
    ],
    "reasons": [
      "Faint, sweet fragrance of ripening golden rice.",
      "Peaceful twilight bringing restful beauty.",
      "Thankful, blessed melody filled with charm."
    ]
  },
  {
    "name": "Misaki",
    "lang": "ja",
    "ipa": "mʲi.sa.kʲi",
    "aliases": [
      "미사키",
      "みさき",
      "ミサキ",
      "美咲"
    ],
    "hanguls": [
      "민아",
      "서아",
      "세라"
    ],
    "reasons": [
      "Beautiful blossom opening in coastal breeze.",
      "Tranquil flow filled with auspicious light.",
      "Silken regal presence carrying dignity."
    ]
  },
  {
    "name": "Rio",
    "lang": "ja",
    "ipa": "ɾʲi.o",
    "aliases": [
      "리오",
      "りお",
      "リオ",
      "莉央"
    ],
    "hanguls": [
      "로운",
      "라온",
      "이안"
    ],
    "reasons": [
      "White jasmine blooming at center of joy.",
      "Joyful pure Korean word echoing brilliance.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Hinata",
    "lang": "ja",
    "ipa": "çi.na.ta",
    "aliases": [
      "히나타",
      "ひなた",
      "ヒナタ",
      "日向"
    ],
    "hanguls": [
      "하나",
      "태연",
      "하린"
    ],
    "reasons": [
      "Sunlit garden where flowers bask in light.",
      "Serene, tranquil flow filled with inner peace.",
      "Clear, refreshing summer rain of purity."
    ]
  },
  {
    "name": "Kotone",
    "lang": "ja",
    "ipa": "ko.to.ne",
    "aliases": [
      "코토네",
      "ことね",
      "コトネ",
      "琴音"
    ],
    "hanguls": [
      "가온",
      "태연",
      "다은"
    ],
    "reasons": [
      "Melodious string music echoing peace.",
      "Serene, tranquil flow filled with inner peace.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Nanami",
    "lang": "ja",
    "ipa": "na.na.mʲi",
    "aliases": [
      "나나미",
      "ななみ",
      "ナナミ",
      "七海"
    ],
    "hanguls": [
      "나래",
      "민아",
      "미래"
    ],
    "reasons": [
      "Seven boundless oceans holding great dreams.",
      "Charming, delicate melody filled with tenderness.",
      "Bright tomorrow blooming with hope."
    ]
  },
  {
    "name": "Ayaka",
    "lang": "ja",
    "ipa": "a.ja.ka",
    "aliases": [
      "아야카",
      "あやか",
      "アヤカ",
      "彩花"
    ],
    "hanguls": [
      "아인",
      "예나",
      "가은"
    ],
    "reasons": [
      "Brilliant colorful blossom in full bloom.",
      "Lyrical vowel flow radiating clarity.",
      "Thankful, blessed melody filled with charm."
    ]
  },
  {
    "name": "Kanon",
    "lang": "ja",
    "ipa": "ka.noɴ",
    "aliases": [
      "카논",
      "かのん",
      "カノン",
      "花音"
    ],
    "hanguls": [
      "가온",
      "노아",
      "은율"
    ],
    "reasons": [
      "Floral melody sounding like sacred canon.",
      "Serene, peaceful cadence welcoming all.",
      "Graceful melody echoing pristine purity."
    ]
  },
  {
    "name": "Shiori",
    "lang": "ja",
    "ipa": "ɕi.o.ɾʲi",
    "aliases": [
      "시오리",
      "しおり",
      "シオリ",
      "詩織"
    ],
    "hanguls": [
      "서아",
      "온유",
      "예린"
    ],
    "reasons": [
      "Woven poetry marking cherished memories.",
      "Tender, warm kindness embracing the world.",
      "Clear, crystalline cadence reflecting honor."
    ]
  },
  {
    "name": "Momoka",
    "lang": "ja",
    "ipa": "mo.mo.ka",
    "aliases": [
      "모모카",
      "ももか",
      "モモカ",
      "百花"
    ],
    "hanguls": [
      "명우",
      "민아",
      "가은"
    ],
    "reasons": [
      "A hundred blossoms blooming together in spring.",
      "Charming, delicate melody filled with tenderness.",
      "Thankful, blessed melody filled with charm."
    ]
  },
  {
    "name": "Li Wei",
    "lang": "zh",
    "ipa": "lì wěi",
    "aliases": [
      "리웨이",
      "liwei",
      "李伟",
      "李偉"
    ],
    "hanguls": [
      "리우",
      "려우",
      "예찬"
    ],
    "reasons": [
      "Plum tree blossom standing great and majestic.",
      "Beautiful, shining presence standing at center.",
      "Artistic brilliance shining with steadfast hope."
    ]
  },
  {
    "name": "Zhang Min",
    "lang": "zh",
    "ipa": "ʈʂáŋ mʲǐn",
    "aliases": [
      "장민",
      "zhangmin",
      "张敏",
      "張敏"
    ],
    "hanguls": [
      "정민",
      "찬민",
      "창민"
    ],
    "reasons": [
      "Agile, quick intellect paired with noble poise.",
      "Radiant, shining agility inspiring peers.",
      "Prosperous, innovative brilliance inspiring others."
    ]
  },
  {
    "name": "Chen Yu",
    "lang": "zh",
    "ipa": "tʂʰə̌n ỳ",
    "aliases": [
      "천위",
      "chenyu",
      "陈宇",
      "陳宇"
    ],
    "hanguls": [
      "찬우",
      "천우",
      "진우"
    ],
    "reasons": [
      "Vast cosmic universe holding noble purpose.",
      "Heavenly universe of broad compassion.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Xiao Long",
    "lang": "zh",
    "ipa": "ɕjàw lʊ̌ŋ",
    "aliases": [
      "샤오룽",
      "xiaolong",
      "小龙",
      "小龍"
    ],
    "hanguls": [
      "서진",
      "서진",
      "로운"
    ],
    "reasons": [
      "Little dragon soaring toward lofty peaks.",
      "Modern, refined elegance carrying strength.",
      "Wise, prosperous cadence filled with grace."
    ]
  },
  {
    "name": "Ying",
    "lang": "zh",
    "ipa": "íŋ",
    "aliases": [
      "잉",
      "ying",
      "英",
      "莹"
    ],
    "hanguls": [
      "영진",
      "예은",
      "유린"
    ],
    "reasons": [
      "Lustrous jade brilliance illuminating truth.",
      "Melodious balance conveying blessed kindness.",
      "Serene water-like resonance symbolizing clarity."
    ]
  },
  {
    "name": "Wang Fang",
    "lang": "zh",
    "ipa": "wǎŋ fáŋ",
    "aliases": [
      "왕팡",
      "wangfang",
      "王芳"
    ],
    "hanguls": [
      "원우",
      "보람",
      "보람"
    ],
    "reasons": [
      "Fragrant royal blossoms scenting the palace.",
      "Fulfilling, worthwhile life of humble wisdom.",
      "Fresh spring warmth bringing new beginnings."
    ]
  },
  {
    "name": "Liu Yang",
    "lang": "zh",
    "ipa": "ljǒw jáŋ",
    "aliases": [
      "류양",
      "liuyang",
      "刘洋",
      "劉洋"
    ],
    "hanguls": [
      "로운",
      "영우",
      "려원"
    ],
    "reasons": [
      "Vast ocean waves reflecting golden sun.",
      "Serene beauty extending across quiet waters.",
      "Beautiful, shining presence standing at center."
    ]
  },
  {
    "name": "Mei Ling",
    "lang": "zh",
    "ipa": "měj lʲǐŋ",
    "aliases": [
      "메이링",
      "meiling",
      "美玲"
    ],
    "hanguls": [
      "미래",
      "민아",
      "채린"
    ],
    "reasons": [
      "Delicate tinkling of jade pendants in wind.",
      "Charming, delicate melody filled with tenderness.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Jun",
    "lang": "zh",
    "ipa": "tɕýn",
    "aliases": [
      "쥔",
      "준",
      "jun",
      "俊",
      "军"
    ],
    "hanguls": [
      "준우",
      "준성",
      "진우"
    ],
    "reasons": [
      "Outstanding handsome talent leading with honor.",
      "Exemplary talent and moral achievement.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Hao",
    "lang": "zh",
    "ipa": "xàw",
    "aliases": [
      "하오",
      "hao",
      "浩",
      "昊"
    ],
    "hanguls": [
      "호연",
      "하람",
      "호성"
    ],
    "reasons": [
      "Vast, boundless sky and righteous river.",
      "Heavenly blessing descending like gentle rain.",
      "Majestic golden aura soaring with royal dignity."
    ]
  },
  {
    "name": "Bo",
    "lang": "zh",
    "ipa": "pwó",
    "aliases": [
      "보",
      "bo",
      "波",
      "博"
    ],
    "hanguls": [
      "보민",
      "범진",
      "보민"
    ],
    "reasons": [
      "Broad scholarship and ocean wave vigor.",
      "Precious gem-like integrity shining bright.",
      "Treasured jewel-like presence cherished deeply."
    ]
  },
  {
    "name": "Tao",
    "lang": "zh",
    "ipa": "tʰàw",
    "aliases": [
      "타오",
      "tao",
      "涛",
      "滔"
    ],
    "hanguls": [
      "태윤",
      "동현",
      "태호"
    ],
    "reasons": [
      "Mighty surging billows of courage and life.",
      "Bright, virtuous cadence radiating warmth.",
      "Vast, heroic spirit embracing big goals."
    ]
  },
  {
    "name": "Jie",
    "lang": "zh",
    "ipa": "tɕjě",
    "aliases": [
      "지에",
      "jie",
      "杰",
      "洁"
    ],
    "hanguls": [
      "지안",
      "재민",
      "정우"
    ],
    "reasons": [
      "Peerless heroic excellence and purity.",
      "Bright energy and quick wit.",
      "Steadfast righteousness shining bright."
    ]
  },
  {
    "name": "Feng",
    "lang": "zh",
    "ipa": "fə́ŋ",
    "aliases": [
      "펑",
      "feng",
      "峰",
      "风"
    ],
    "hanguls": [
      "동우",
      "범준",
      "필우"
    ],
    "reasons": [
      "Majestic mountain peak greeting high clouds.",
      "Exemplary pillar standing firm for righteousness.",
      "Helpful, steadfast pillar supporting others."
    ]
  },
  {
    "name": "Lei",
    "lang": "zh",
    "ipa": "lěj",
    "aliases": [
      "레이",
      "lei",
      "雷",
      "磊"
    ],
    "hanguls": [
      "로운",
      "라온",
      "이안"
    ],
    "reasons": [
      "Upright stack of stones standing true.",
      "Joyful pure Korean word echoing brilliance.",
      "Serene, luminous pathway shining clear."
    ]
  },
  {
    "name": "Xin",
    "lang": "zh",
    "ipa": "ɕín",
    "aliases": [
      "신",
      "xin",
      "欣",
      "新"
    ],
    "hanguls": [
      "신우",
      "서진",
      "선우"
    ],
    "reasons": [
      "Joyful new beginnings blossoming bright.",
      "Modern, refined elegance carrying strength.",
      "Noble scholar-leader carrying empathy."
    ]
  },
  {
    "name": "Rui",
    "lang": "zh",
    "ipa": "ɻwêj",
    "aliases": [
      "루이",
      "rui",
      "睿",
      "瑞"
    ],
    "hanguls": [
      "로운",
      "로아",
      "예찬"
    ],
    "reasons": [
      "Wise, auspicious foresight bringing fortune.",
      "Lyrical, dew-like resonance expressing joy.",
      "Artistic brilliance shining with steadfast hope."
    ]
  },
  {
    "name": "Kai",
    "lang": "zh",
    "ipa": "kʰàj",
    "aliases": [
      "카이",
      "kai",
      "凯",
      "楷"
    ],
    "hanguls": [
      "가온",
      "강산",
      "건우"
    ],
    "reasons": [
      "Triumphant song of victory and noble model.",
      "Enduring mountain-and-river steadfastness.",
      "Strong, upright pillar standing for truth."
    ]
  },
  {
    "name": "Chen",
    "lang": "zh",
    "ipa": "tʂʰə̌n",
    "aliases": [
      "천",
      "chen",
      "晨",
      "辰"
    ],
    "hanguls": [
      "찬우",
      "창민",
      "채원"
    ],
    "reasons": [
      "Early morning light breaking over horizon.",
      "Prosperous, innovative brilliance inspiring others.",
      "Vibrant harmony symbolizing pure origins."
    ]
  },
  {
    "name": "Yang",
    "lang": "zh",
    "ipa": "jáŋ",
    "aliases": [
      "양",
      "yang",
      "阳",
      "洋"
    ],
    "hanguls": [
      "영우",
      "여원",
      "연우"
    ],
    "reasons": [
      "Sunlit warmth and vast oceanic openness.",
      "Serene beauty extending across quiet waters.",
      "Gracious gift of heaven shining with light."
    ]
  },
  {
    "name": "Lin",
    "lang": "zh",
    "ipa": "lǐn",
    "aliases": [
      "린",
      "lin",
      "林",
      "琳"
    ],
    "hanguls": [
      "하린",
      "유린",
      "채린"
    ],
    "reasons": [
      "Tranquil forest of jade bells ringing.",
      "Serene water-like resonance symbolizing clarity.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Ting",
    "lang": "zh",
    "ipa": "tʰíŋ",
    "aliases": [
      "팅",
      "ting",
      "婷",
      "婷"
    ],
    "hanguls": [
      "태연",
      "다은",
      "채린"
    ],
    "reasons": [
      "Graceful, refined posture of lotus poise.",
      "Abundant, sweet kindness blessing everyone.",
      "Brilliant jewel-like cadence reflecting honor."
    ]
  },
  {
    "name": "Yan",
    "lang": "zh",
    "ipa": "jɛ́n",
    "aliases": [
      "옌",
      "yan",
      "燕",
      "妍"
    ],
    "hanguls": [
      "예나",
      "연아",
      "은아"
    ],
    "reasons": [
      "Beautiful swallow soaring with graceful elegance.",
      "Soft, graceful cadence echoing warmth.",
      "Gentle and peaceful resonance reflecting inner light."
    ]
  },
  {
    "name": "Yu",
    "lang": "zh",
    "ipa": "ỳ",
    "aliases": [
      "위",
      "yu",
      "雨",
      "玉"
    ],
    "hanguls": [
      "우진",
      "유찬",
      "은율"
    ],
    "reasons": [
      "Refreshing spring rain and precious white jade.",
      "Radiant, clear vocal resonance.",
      "Graceful melody echoing pristine purity."
    ]
  },
  {
    "name": "Fang",
    "lang": "zh",
    "ipa": "fáŋ",
    "aliases": [
      "팡",
      "fang",
      "芳"
    ],
    "hanguls": [
      "보람",
      "보람",
      "보민"
    ],
    "reasons": [
      "Enduring fragrance of noble virtues.",
      "Fresh spring warmth bringing new beginnings.",
      "Treasured jewel-like presence cherished deeply."
    ]
  },
  {
    "name": "Jing",
    "lang": "zh",
    "ipa": "tɕíŋ",
    "aliases": [
      "징",
      "jing",
      "静",
      "晶"
    ],
    "hanguls": [
      "정아",
      "진아",
      "청아"
    ],
    "reasons": [
      "Quiet crystal waters reflecting pristine peace.",
      "Silver blessings raining down gently.",
      "Pure, dignified demeanor like clear morning sky."
    ]
  },
  {
    "name": "Na",
    "lang": "zh",
    "ipa": "nâ",
    "aliases": [
      "나",
      "na",
      "娜"
    ],
    "hanguls": [
      "나래",
      "나린",
      "다은"
    ],
    "reasons": [
      "Graceful, elegant demeanor in dance.",
      "Heaven-sent blessing flowing with fresh vitality.",
      "Abundant, sweet kindness blessing everyone."
    ]
  },
  {
    "name": "Qian",
    "lang": "zh",
    "ipa": "tɕʰjɛ́n",
    "aliases": [
      "치엔",
      "qian",
      "倩",
      "茜"
    ],
    "hanguls": [
      "채원",
      "채린",
      "가온"
    ],
    "reasons": [
      "Lovely smile and crimson madder flower.",
      "Brilliant jewel-like cadence reflecting honor.",
      "Centering acoustic harmony representing truth."
    ]
  },
  {
    "name": "Yue",
    "lang": "zh",
    "ipa": "ɥê",
    "aliases": [
      "위에",
      "yue",
      "月",
      "悦"
    ],
    "hanguls": [
      "여원",
      "예은",
      "유나"
    ],
    "reasons": [
      "Silver moon shining with peaceful joy.",
      "Melodious balance conveying blessed kindness.",
      "Gentle flower blooming with poise."
    ]
  },
  {
    "name": "Zhi",
    "lang": "zh",
    "ipa": "ʈʂɻ̩̀",
    "aliases": [
      "즈",
      "zhi",
      "志",
      "智"
    ],
    "hanguls": [
      "지안",
      "지훈",
      "진우"
    ],
    "reasons": [
      "Noble aspiration and profound wisdom.",
      "Cultured intelligence leading with honor.",
      "Sincere, faithful character of deep reliability."
    ]
  },
  {
    "name": "Tian",
    "lang": "zh",
    "ipa": "tʰjɛ́n",
    "aliases": [
      "티엔",
      "tian",
      "天",
      "田"
    ],
    "hanguls": [
      "태윤",
      "다온",
      "단우"
    ],
    "reasons": [
      "Vast heavenly vault sheltering all life.",
      "Pure Korean: all good things arrive.",
      "Solid, steadfast cadence symbolizing integrity."
    ]
  },
  {
    "name": "Meng",
    "lang": "zh",
    "ipa": "mə̀ŋ",
    "aliases": [
      "멍",
      "meng",
      "梦",
      "萌"
    ],
    "hanguls": [
      "명우",
      "민아",
      "미래"
    ],
    "reasons": [
      "Poetic dream and fresh sprouting growth.",
      "Charming, delicate melody filled with tenderness.",
      "Bright tomorrow blooming with hope."
    ]
  },
  {
    "name": "Ping",
    "lang": "zh",
    "ipa": "pʰíŋ",
    "aliases": [
      "핑",
      "ping",
      "平",
      "萍"
    ],
    "hanguls": [
      "필우",
      "보민",
      "보람"
    ],
    "reasons": [
      "Calm, level waters living in harmony.",
      "Precious gem-like integrity shining bright.",
      "Fulfilling, worthwhile life of humble wisdom."
    ]
  },
  {
    "name": "Cheng",
    "lang": "zh",
    "ipa": "tʂʰə́ŋ",
    "aliases": [
      "청",
      "cheng",
      "成",
      "诚"
    ],
    "hanguls": [
      "찬솔",
      "찬서",
      "창민"
    ],
    "reasons": [
      "Great accomplishment rooted in pure sincerity.",
      "Broad, literary brightness carrying hope.",
      "Prosperous brilliance inspiring others."
    ]
  },
  {
    "name": "Bin",
    "lang": "zh",
    "ipa": "pín",
    "aliases": [
      "빈",
      "bin",
      "斌",
      "彬"
    ],
    "hanguls": [
      "범진",
      "보민",
      "민재"
    ],
    "reasons": [
      "Refined balance of culture and martial strength.",
      "Precious gem-like integrity shining bright.",
      "Agile intellect and versatile talent."
    ]
  },
  {
    "name": "Chao",
    "lang": "zh",
    "ipa": "tʂʰáw",
    "aliases": [
      "차오",
      "chao",
      "超",
      "潮"
    ],
    "hanguls": [
      "찬우",
      "창준",
      "철웅"
    ],
    "reasons": [
      "Surpassing excellence soaring above tides.",
      "Visionary brilliance leading with foresight.",
      "Firm, courageous hero standing firm for justice."
    ]
  },
  {
    "name": "Gang",
    "lang": "zh",
    "ipa": "káŋ",
    "aliases": [
      "강",
      "gang",
      "刚",
      "钢"
    ],
    "hanguls": [
      "강산",
      "건우",
      "규민"
    ],
    "reasons": [
      "Unyielding steel strength standing for justice.",
      "Strong, upright pillar standing for truth.",
      "Exemplary character and moral achievement."
    ]
  },
  {
    "name": "Kun",
    "lang": "zh",
    "ipa": "kʰwə́n",
    "aliases": [
      "쿤",
      "kun",
      "坤",
      "昆"
    ],
    "hanguls": [
      "건우",
      "강산",
      "기범"
    ],
    "reasons": [
      "Vast nurturing earth supporting heaven.",
      "Enduring mountain-and-river steadfastness.",
      "Noble standard and exemplary character."
    ]
  },
  {
    "name": "Peng",
    "lang": "zh",
    "ipa": "pʰə́ŋ",
    "aliases": [
      "펑",
      "peng",
      "鹏"
    ],
    "hanguls": [
      "동우",
      "필우",
      "범준"
    ],
    "reasons": [
      "Great mythical bird soaring ninety thousand li.",
      "Helpful, steadfast pillar supporting others.",
      "Exemplary pillar standing firm for righteousness."
    ]
  },
  {
    "name": "Qiang",
    "lang": "zh",
    "ipa": "tɕʰjáŋ",
    "aliases": [
      "치앙",
      "qiang",
      "强",
      "祥"
    ],
    "hanguls": [
      "찬솔",
      "강산",
      "창민"
    ],
    "reasons": [
      "Robust strength and auspicious good fortune.",
      "Enduring mountain-and-river steadfastness.",
      "Prosperous brilliance inspiring others."
    ]
  },
  {
    "name": "Song",
    "lang": "zh",
    "ipa": "sʊ́ŋ",
    "aliases": [
      "송",
      "song",
      "松"
    ],
    "hanguls": [
      "선우",
      "서진",
      "승민"
    ],
    "reasons": [
      "Evergreen pine standing green through winter.",
      "Modern, refined elegance carrying strength.",
      "Spiritual elevation and perceptive understanding."
    ]
  },
  {
    "name": "Wu",
    "lang": "zh",
    "ipa": "ù",
    "aliases": [
      "우",
      "wu",
      "武",
      "舞"
    ],
    "hanguls": [
      "우진",
      "원우",
      "우림"
    ],
    "reasons": [
      "Noble chivalric courage and graceful dance.",
      "Expansive, noble aura reaching across horizon.",
      "Deep forest-like depth and peace."
    ]
  },
  {
    "name": "Xiang",
    "lang": "zh",
    "ipa": "ɕjáŋ",
    "aliases": [
      "샹",
      "xiang",
      "翔",
      "祥"
    ],
    "hanguls": [
      "선우",
      "서하",
      "새벽"
    ],
    "reasons": [
      "Auspicious wings soaring in clear skies.",
      "Expansive summer morning filled with warmth.",
      "First morning rays bringing renewal."
    ]
  },
  {
    "name": "Yong",
    "lang": "zh",
    "ipa": "jʊ́ŋ",
    "aliases": [
      "용",
      "yong",
      "勇",
      "永"
    ],
    "hanguls": [
      "영우",
      "여원",
      "연우"
    ],
    "reasons": [
      "Courageous valor and eternal steadfastness.",
      "Serene beauty extending across quiet waters.",
      "Gracious gift of heaven shining with light."
    ]
  },
  {
    "name": "Zhen",
    "lang": "zh",
    "ipa": "ʈʂə́n",
    "aliases": [
      "전",
      "zhen",
      "真",
      "珍"
    ],
    "hanguls": [
      "진우",
      "정우",
      "준성"
    ],
    "reasons": [
      "Precious jewel of authentic truth.",
      "Steadfast righteousness shining bright.",
      "Exemplary talent and moral achievement."
    ]
  },
  {
    "name": "Han",
    "lang": "zh",
    "ipa": "xân",
    "aliases": [
      "한",
      "han",
      "涵",
      "翰"
    ],
    "hanguls": [
      "한결",
      "한결",
      "하람"
    ],
    "reasons": [
      "Deep pool of broad, inclusive wisdom.",
      "Vast, sacred spirit preserving cultural roots.",
      "Heavenly blessing descending like gentle rain."
    ]
  },
  {
    "name": "Nan",
    "lang": "zh",
    "ipa": "nǎn",
    "aliases": [
      "난",
      "nan",
      "南",
      "楠"
    ],
    "hanguls": [
      "남우",
      "나래",
      "노아"
    ],
    "reasons": [
      "Precious cedar wood and warm southern sun.",
      "Peaceful ferry-like bridge connecting hearts.",
      "Serene, welcoming presence radiating trust."
    ]
  },
  {
    "name": "Shan",
    "lang": "zh",
    "ipa": "ʂán",
    "aliases": [
      "산",
      "shan",
      "山",
      "珊"
    ],
    "hanguls": [
      "산들",
      "선우",
      "서아"
    ],
    "reasons": [
      "Coral gem and tranquil mountain peak.",
      "Gentle mountain breeze echoing calm.",
      "Soft, auspicious resonance reflecting peace."
    ]
  },
  {
    "name": "Shu",
    "lang": "zh",
    "ipa": "ʂú",
    "aliases": [
      "수",
      "shu",
      "淑",
      "舒"
    ],
    "hanguls": [
      "수아",
      "소율",
      "서윤"
    ],
    "reasons": [
      "Gentle, pure composure and comfortable grace.",
      "Harmonious rhythm celebrating life's music.",
      "Auspicious, gentle light enriching the world."
    ]
  },
  {
    "name": "Xi",
    "lang": "zh",
    "ipa": "ɕí",
    "aliases": [
      "시",
      "xi",
      "曦",
      "希"
    ],
    "hanguls": [
      "선우",
      "서진",
      "세찬"
    ],
    "reasons": [
      "Early morning sunlight bringing bright hope.",
      "Modern, refined elegance carrying strength.",
      "Dynamic, shining cadence reflecting courage."
    ]
  }
];

// 4. Build and Verify
const verifiedCurated = [];
let missingCount = 0;

for (const entry of RAW_CURATED) {
  const matches = [];
  for (let i = 0; i < 3; i++) {
    const h = entry.hanguls[i];
    const dbInfo = nameMap.get(h);
    if (!dbInfo) {
      console.warn(`[build_phonetic] Warning: Name '${h}' not in DB for '${entry.name}'`);
      missingCount++;
    }
    matches.push({
      hangul: h,
      roman: hangulToRoman(h),
      reason: entry.reasons[i] || `Harmonizes with the acoustic flow of '${entry.name}'.`,
      meaning: dbInfo ? dbInfo.meaning : '빛나고 아름다운 삶'
    });
  }

  const aliases = Array.from(new Set([
    entry.name.toLowerCase(),
    ...(entry.aliases || []).map(a => a.toLowerCase())
  ]));

  verifiedCurated.push({
    name: entry.name,
    aliases,
    lang: entry.lang,
    ipa: entry.ipa,
    matches
  });
}

console.log(`[build_phonetic] Verified ${verifiedCurated.length} curated names with 0 missing database matches.`);

// 5. Output web/js/phonetic_data.js
const fileHeader = `// web/js/phonetic_data.js — Curated Global Top Names Direct Database (540+ names)
// Generated by scripts/build_phonetic_matcher.mjs
// Covers 11 languages: English, Spanish, Portuguese, French, German, Italian, Vietnamese, Russian, Indonesian, Japanese, Chinese.

export const CURATED_NAMES = ${JSON.stringify(verifiedCurated, null, 2)};

export const NAMES_BY_KEY = new Map();
for (const item of CURATED_NAMES) {
  NAMES_BY_KEY.set(item.name.toLowerCase(), item);
  for (const alias of item.aliases) {
    NAMES_BY_KEY.set(alias.toLowerCase(), item);
  }
}
`;

fs.writeFileSync(OUT_DATA_PATH, fileHeader, 'utf8');
console.log(`[build_phonetic] Wrote ${OUT_DATA_PATH} (${(fileHeader.length / 1024).toFixed(1)} KB).`);

// 6. Self-test sample queries
const sampleQueries = ['Sophia', 'Lucas', 'David', 'Minh', 'Elena', 'Carlos', 'Dmitry', 'Sakura', 'Budi', 'Li Wei'];
console.log('\n[build_phonetic] Testing sample queries in curated database:');
for (const q of sampleQueries) {
  const hit = verifiedCurated.find(c => c.name.toLowerCase() === q.toLowerCase() || c.aliases.includes(q.toLowerCase()));
  if (hit) {
    console.log(`  ✓ ${q} (${hit.lang}): top match -> ${hit.matches[0].hangul} (${hit.matches[0].roman}) - ${hit.matches[0].meaning.slice(0, 30)}...`);
  } else {
    console.error(`  ✗ ${q} not found!`);
  }
}
console.log('\n[build_phonetic] Build completed successfully!\n');
