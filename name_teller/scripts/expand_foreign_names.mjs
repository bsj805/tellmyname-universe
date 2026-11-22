// scripts/expand_foreign_names.mjs
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const curatedPath = path.join(dataDir, 'curated_foreign_names.json');
const phoneticDataPath = path.join(rootDir, 'web', 'js', 'phonetic_data.js');
const compactDbPath = path.join(dataDir, 'compact_serving_names.json');

// 한국어 이름 DB 로드
const compactNames = JSON.parse(fs.readFileSync(compactDbPath, 'utf8'));
const koreanNameMap = new Map();
for (const row of compactNames) {
  if (!koreanNameMap.has(row[0])) {
    koreanNameMap.set(row[0], {
      name: row[0],
      hanja: row[2] || '',
      meaning: row[4] || `${row[0]}의 맑고 아름다운 기운`
    });
  }
}

// 로마자 표기 헬퍼
const CHO_RR = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG_RR = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG_RR = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','t','m','p','p','t','t','ng','t','t','k','t','p','t'];

function hangulToRoman(hangul) {
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

// 기존 데이터 로드 (545개 온전하게 보존)
const existingList = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
const nameMap = new Map();
for (const item of existingList) {
  const k = (item.name || '').trim().toLowerCase();
  if (k) nameMap.set(k, item);
}
console.log(`[Init] Existing curated names: ${nameMap.size}`);

// 신규 확장 대상 글로벌 이름 목록 (글로벌 350+개)
const EXPANSION_LIST = [
  // 영어권 인기 남아
  { name: 'Theodore', lang: 'en', ipa: 'ˈθiːədɔːr', aliases: ['테오도르','테오'], matches: ['태오','도율','태윤'] },
  { name: 'Mateo', lang: 'es', ipa: 'maˈte.o', aliases: ['마테오'], matches: ['민태','태오','마루'] },
  { name: 'Levi', lang: 'en', ipa: 'ˈliːvaɪ', aliases: ['레비','리바이'], matches: ['래원','리안','로이'] },
  { name: 'Sebastian', lang: 'es', ipa: 'se.βasˈtjan', aliases: ['세바스티안'], matches: ['세진','성찬','세온'] },
  { name: 'Jack', lang: 'en', ipa: 'dʒæk', aliases: ['잭'], matches: ['재찬','준혁','재하'] },
  { name: 'Owen', lang: 'en', ipa: 'ˈoʊən', aliases: ['오웬'], matches: ['오온','온유','우원'] },
  { name: 'Asher', lang: 'en', ipa: 'ˈæʃər', aliases: ['아셔','애셔'], matches: ['아서','아현','시온'] },
  { name: 'Samuel', lang: 'en', ipa: 'ˈsæmjuəl', aliases: ['사무엘'], matches: ['서율','시우','세민'] },
  { name: 'Leo', lang: 'en', ipa: 'ˈliːoʊ', aliases: ['레오'], matches: ['로운','로아','래원'] },
  { name: 'Ezra', lang: 'en', ipa: 'ˈɛzrə', aliases: ['에즈라'], matches: ['예준','은우','예람'] },
  { name: 'Hudson', lang: 'en', ipa: 'ˈhʌdsən', aliases: ['허드슨'], matches: ['현서','하준','한성'] },
  { name: 'Julian', lang: 'en', ipa: 'ˈdʒuːliən', aliases: ['줄리안'], matches: ['주안','주원','율'] },
  { name: 'Luke', lang: 'en', ipa: 'luːk', aliases: ['루크'], matches: ['루한','로운','루진'] },
  { name: 'Grayson', lang: 'en', ipa: 'ˈɡreɪsən', aliases: ['그레이슨'], matches: ['규선','건우','기찬'] },
  { name: 'Jayden', lang: 'en', ipa: 'ˈdʒeɪdən', aliases: ['제이든'], matches: ['재단','주한','진우'] },
  { name: 'Anthony', lang: 'en', ipa: 'ˈæntəni', aliases: ['앤서니'], matches: ['안우','찬희','태인'] },
  { name: 'Dylan', lang: 'en', ipa: 'ˈdɪlən', aliases: ['딜런'], matches: ['도윤','다온','도하'] },
  { name: 'Lincoln', lang: 'en', ipa: 'ˈlɪŋkən', aliases: ['링컨'], matches: ['린우','은찬','건우'] },
  { name: 'Maverick', lang: 'en', ipa: 'ˈmævərɪk', aliases: ['매버릭'], matches: ['민혁','범진','명우'] },
  { name: 'Christopher', lang: 'en', ipa: 'ˈkrɪstəfər', aliases: ['크리스토퍼','크리스'], matches: ['기현','찬율','규혁'] },
  { name: 'Thomas', lang: 'en', ipa: 'ˈtɒməs', aliases: ['토마스'], matches: ['태민','도하','태윤'] },
  { name: 'Joshua', lang: 'en', ipa: 'ˈdʒɒʃuə', aliases: ['조슈아'], matches: ['주하','지우','준서'] },
  { name: 'Caleb', lang: 'en', ipa: 'ˈkeɪləb', aliases: ['케일럽'], matches: ['결','가온','규원'] },
  { name: 'Ryan', lang: 'en', ipa: 'ˈraɪən', aliases: ['라이언'], matches: ['라온','리안','로운'] },
  { name: 'Adrian', lang: 'en', ipa: 'ˈeɪdriən', aliases: ['에이드리언'], matches: ['아름','이안','예찬'] },
  { name: 'Miles', lang: 'en', ipa: 'maɪlz', aliases: ['마일스'], matches: ['민서','명우','민재'] },
  { name: 'Austin', lang: 'en', ipa: 'ˈɔːstɪn', aliases: ['오스틴'], matches: ['우성','온유','우진'] },
  { name: 'Hunter', lang: 'en', ipa: 'ˈhʌntər', aliases: ['헌터'], matches: ['현우','한결','해솔'] },
  { name: 'Christian', lang: 'en', ipa: 'ˈkrɪstʃən', aliases: ['크리스찬'], matches: ['찬희','규성','찬우'] },
  { name: 'Brooks', lang: 'en', ipa: 'brʊks', aliases: ['브룩스'], matches: ['보람','백현','범수'] },
  { name: 'Beau', lang: 'fr', ipa: 'boʊ', aliases: ['보'], matches: ['보민','보배','보현'] },
  { name: 'Wesley', lang: 'en', ipa: 'ˈwɛsli', aliases: ['웨슬리'], matches: ['원서','예슬','우솔'] },
  { name: 'Dominic', lang: 'en', ipa: 'ˈdɒmɪnɪk', aliases: ['도미닉'], matches: ['도민','동혁','도현'] },
  { name: 'Kayden', lang: 'en', ipa: 'ˈkeɪdən', aliases: ['케이든'], matches: ['건율','규민','결'] },
  { name: 'Silas', lang: 'en', ipa: 'ˈsaɪləs', aliases: ['사일러스'], matches: ['선율','시라','솔이'] },
  { name: 'Gavin', lang: 'en', ipa: 'ˈɡævɪn', aliases: ['개빈'], matches: ['가빈','건우','규빈'] },
  { name: 'Declan', lang: 'en', ipa: 'ˈdɛklən', aliases: ['데클런'], matches: ['대현','도경','단우'] },
  { name: 'Damian', lang: 'en', ipa: 'ˈdeɪmiən', aliases: ['데미안'], matches: ['대민','동명','도연'] },
  { name: 'Jasper', lang: 'en', ipa: 'ˈdʒæspər', aliases: ['재스퍼'], matches: ['지수','재서','진우'] },
  { name: 'Harrison', lang: 'en', ipa: 'ˈhærɪsən', aliases: ['해리슨'], matches: ['해솔','하린','현성'] },
  { name: 'Cole', lang: 'en', ipa: 'koʊl', aliases: ['콜'], matches: ['고운','결','건'] },
  { name: 'Kaiden', lang: 'en', ipa: 'ˈkeɪdən', aliases: ['카이든'], matches: ['가온','이든','강민'] },
  { name: 'George', lang: 'en', ipa: 'dʒɔːrdʒ', aliases: ['조지'], matches: ['정우','종혁','진서'] },
  { name: 'Zion', lang: 'en', ipa: 'ˈzaɪən', aliases: ['자이언','시온'], matches: ['시온','지안','세온'] },
  { name: 'River', lang: 'en', ipa: 'ˈrɪvər', aliases: ['리버'], matches: ['라온','이룸','려은'] },
  { name: 'Luca', lang: 'it', ipa: 'ˈluːka', aliases: ['루카'], matches: ['루아','로건','루한'] },
  { name: 'Milo', lang: 'en', ipa: 'ˈmaɪloʊ', aliases: ['마일로'], matches: ['민로','마루','명우'] },
  { name: 'Rowan', lang: 'en', ipa: 'ˈroʊən', aliases: ['로완'], matches: ['로운','로아','원우'] },
  { name: 'Arthur', lang: 'fr', ipa: 'ˈɑːrθər', aliases: ['아서','아르튀르'], matches: ['아서','아람','태오'] },
  { name: 'Sawyer', lang: 'en', ipa: 'ˈsɔːjər', aliases: ['소여'], matches: ['서율','서우','솔이'] },
  { name: 'Amir', lang: 'ar', ipa: 'æˈmɪər', aliases: ['아미르'], matches: ['아름','미르','민서'] },
  { name: 'Rafael', lang: 'es', ipa: 'ra.faˈel', aliases: ['라파엘'], matches: ['라온','라엘','하람'] },
  { name: 'Finley', lang: 'en', ipa: 'ˈfɪnli', aliases: ['핀리'], matches: ['필재','하린','율'] },
  { name: 'Emilio', lang: 'es', ipa: 'eˈmi.ljo', aliases: ['에밀리오'], matches: ['은민','려우','명준'] },
  { name: 'Felix', lang: 'de', ipa: 'ˈfeːlɪks', aliases: ['펠릭스'], matches: ['필재','찬희','환희'] },
  { name: 'Walker', lang: 'en', ipa: 'ˈwɔːkər', aliases: ['워커'], matches: ['원우','우건','호경'] },
  { name: 'Nash', lang: 'en', ipa: 'næʃ', aliases: ['내시'], matches: ['남우','선율','나온'] },
  { name: 'Zayn', lang: 'ar', ipa: 'zeɪn', aliases: ['자인','제인'], matches: ['재인','정인','진'] },
  { name: 'Graham', lang: 'en', ipa: 'ɡræm', aliases: ['그레이엄'], matches: ['가람','규혁','기현'] },
  { name: 'Jesse', lang: 'en', ipa: 'ˈdʒɛsi', aliases: ['제시'], matches: ['재서','지수','정서'] },
  { name: 'Matteo', lang: 'it', ipa: 'matˈtɛ.o', aliases: ['마테오'], matches: ['태오','민태','태양'] },
  { name: 'Finn', lang: 'de', ipa: 'fɪn', aliases: ['핀'], matches: ['필재','빈','빛'] },
  { name: 'Luka', lang: 'it', ipa: 'ˈluːka', aliases: ['루카'], matches: ['루아','로운','루진'] },
  { name: 'Leon', lang: 'de', ipa: 'ˈleːɔn', aliases: ['레온'], matches: ['려은','라온','이온'] },
  { name: 'Theo', lang: 'en', ipa: 'ˈθiːoʊ', aliases: ['테오'], matches: ['태오','도율','태윤'] },
  { name: 'Dallas', lang: 'en', ipa: 'ˈdæləs', aliases: ['댈러스'], matches: ['다솔','단우','대현'] },
  { name: 'Cody', lang: 'en', ipa: 'ˈkoʊdi', aliases: ['코디'], matches: ['고운','건우','결'] },
  { name: 'Ronan', lang: 'en', ipa: 'ˈroʊnən', aliases: ['로넌'], matches: ['로운','로아','도윤'] },
  { name: 'Ali', lang: 'ar', ipa: 'ˈɑːli', aliases: ['알리'], matches: ['아라','아린','알찬'] },
  { name: 'Kobe', lang: 'en', ipa: 'ˈkoʊbi', aliases: ['코비'], matches: ['고운','규빈','기쁨'] },
  { name: 'Milan', lang: 'it', ipa: 'miˈlan', aliases: ['밀란'], matches: ['민안','미르','미래'] },

  // 영어권 / 유럽권 인기 여아
  { name: 'Charlotte', lang: 'en', ipa: 'ˈʃɑːrlət', aliases: ['샬롯'], matches: ['채원','설아','초롱'] },
  { name: 'Amelia', lang: 'en', ipa: 'əˈmiːliə', aliases: ['아멜리아'], matches: ['아라','미래','예림'] },
  { name: 'Harper', lang: 'en', ipa: 'ˈhɑːrpər', aliases: ['하퍼'], matches: ['하린','하영','해나'] },
  { name: 'Scarlett', lang: 'en', ipa: 'ˈskɑːrlət', aliases: ['스칼렛'], matches: ['설하','시은','채원'] },
  { name: 'Elizabeth', lang: 'en', ipa: 'ɪˈlɪzəbəθ', aliases: ['엘리자베스'], matches: ['이서','예은','지우'] },
  { name: 'Eleanor', lang: 'en', ipa: 'ˈɛlənər', aliases: ['엘레노어'], matches: ['은아','라온','연우'] },
  { name: 'Chloe', lang: 'en', ipa: 'ˈkloʊi', aliases: ['클로이'], matches: ['가은','초롱','로이'] },
  { name: 'Mila', lang: 'en', ipa: 'ˈmiːlə', aliases: ['밀라'], matches: ['민아','미래','나래'] },
  { name: 'Violet', lang: 'en', ipa: 'ˈvaɪələt', aliases: ['바이올렛'], matches: ['보라','예원','유안'] },
  { name: 'Penelope', lang: 'en', ipa: 'pəˈnɛləpi', aliases: ['페넬로페'], matches: ['빛나','별이','예린'] },
  { name: 'Aria', lang: 'it', ipa: 'ˈɑːriə', aliases: ['아리아'], matches: ['아라','아린','하늬'] },
  { name: 'Abigail', lang: 'en', ipa: 'ˈæbɪɡeɪl', aliases: ['애비게일'], matches: ['아영','가온','은비'] },
  { name: 'Ella', lang: 'en', ipa: 'ˈɛlə', aliases: ['엘라'], matches: ['예라','은솔','라온'] },
  { name: 'Avery', lang: 'en', ipa: 'ˈeɪvəri', aliases: ['에이베리','에이버리'], matches: ['예원','아름','은별'] },
  { name: 'Hazel', lang: 'en', ipa: 'ˈheɪzəl', aliases: ['헤이즐'], matches: ['해솔','하린','혜원'] },
  { name: 'Nora', lang: 'en', ipa: 'ˈnɔːrə', aliases: ['노라'], matches: ['노아','다나','라온'] },
  { name: 'Lily', lang: 'en', ipa: 'ˈlɪli', aliases: ['릴리'], matches: ['나리','예리','율아'] },
  { name: 'Aurora', lang: 'it', ipa: 'ɔːˈrɔːrə', aliases: ['오로라'], matches: ['아라','노을','새벽별'] },
  { name: 'Nova', lang: 'en', ipa: 'ˈnoʊvə', aliases: ['노바'], matches: ['노을','보아','다온'] },
  { name: 'Stella', lang: 'it', ipa: 'ˈstɛlə', aliases: ['스텔라'], matches: ['슬기','샛별','태라'] },
  { name: 'Maya', lang: 'es', ipa: 'ˈmaɪə', aliases: ['마야'], matches: ['마루','민아','아라'] },
  { name: 'Elena', lang: 'es', ipa: 'eˈle.na', aliases: ['엘레나'], matches: ['예나','은아','린아'] },
  { name: 'Naomi', lang: 'en', ipa: 'neɪˈoʊmi', aliases: ['나오미'], matches: ['나온','민아','온유'] },
  { name: 'Ruby', lang: 'en', ipa: 'ˈruːbi', aliases: ['루비'], matches: ['루아','루비','빛나'] },
  { name: 'Alice', lang: 'fr', ipa: 'ˈælɪs', aliases: ['앨리스'], matches: ['아린','예서','이솔'] },
  { name: 'Summer', lang: 'en', ipa: 'ˈsʌmər', aliases: ['서머'], matches: ['서아','여름','소미'] },
  { name: 'Sadie', lang: 'en', ipa: 'ˈseɪdi', aliases: ['세이디'], matches: ['세아','새론','슬아'] },
  { name: 'Kinsley', lang: 'en', ipa: 'ˈkɪnzli', aliases: ['킨슬리'], matches: ['가은','채린','소율'] },
  { name: 'Hailey', lang: 'en', ipa: 'ˈheɪli', aliases: ['헤일리'], matches: ['해나','혜리','하율'] },
  { name: 'Autumn', lang: 'en', ipa: 'ˈɔːtəm', aliases: ['어텀'], matches: ['가을','아라','온유'] },
  { name: 'Quinn', lang: 'en', ipa: 'kwɪn', aliases: ['퀸'], matches: ['결','고운','규리'] },
  { name: 'Eva', lang: 'es', ipa: 'ˈe.βa', aliases: ['에바'], matches: ['예원','예은','은아'] },
  { name: 'Piper', lang: 'en', ipa: 'ˈpaɪpər', aliases: ['파이퍼'], matches: ['빛나','별하','파란'] },
  { name: 'Sophie', lang: 'fr', ipa: 'sɔ.fi', aliases: ['소피'], matches: ['수아','소율','서윤'] },
  { name: 'Jade', lang: 'fr', ipa: 'ʒad', aliases: ['제이드'], matches: ['지우','정원','진아'] },
  { name: 'Serenity', lang: 'en', ipa: 'səˈrɛnəti', aliases: ['세레니티'], matches: ['선율','세은','슬기'] },
  { name: 'Peyton', lang: 'en', ipa: 'ˈpeɪtən', aliases: ['페이튼'], matches: ['별','빛나','태은'] },
  { name: 'Brielle', lang: 'en', ipa: 'briːˈɛl', aliases: ['브리엘'], matches: ['보람','라온','예라'] },
  { name: 'Melanie', lang: 'en', ipa: 'ˈmɛləni', aliases: ['멜라니'], matches: ['민아','미래','나래'] },
  { name: 'Hadley', lang: 'en', ipa: 'ˈhædli', aliases: ['해들리'], matches: ['해솔','하린','혜리'] },
  { name: 'Aubrey', lang: 'en', ipa: 'ˈɔːbri', aliases: ['오브리'], matches: ['아름','우리','보람'] },
  { name: 'Clara', lang: 'de', ipa: 'ˈklaːʁa', aliases: ['클라라'], matches: ['가람','라온','채아'] },
  { name: 'Isla', lang: 'en', ipa: 'ˈaɪlə', aliases: ['아일라'], matches: ['아라','이슬','예라'] },
  { name: 'Willow', lang: 'en', ipa: 'ˈwɪloʊ', aliases: ['윌로우'], matches: ['원우','유아','여름'] },
  { name: 'Zoe', lang: 'en', ipa: 'ˈzoʊi', aliases: ['조이'], matches: ['소이','조은','채이'] },
  { name: 'Ivy', lang: 'en', ipa: 'ˈaɪvi', aliases: ['아이비'], matches: ['아비','이슬','예빈'] },
  { name: 'Addison', lang: 'en', ipa: 'ˈædɪsən', aliases: ['애디슨'], matches: ['다솜','다은','아람'] },
  { name: 'Emilia', lang: 'it', ipa: 'eˈmiːlja', aliases: ['에밀리아'], matches: ['예림','민아','이서'] },
  { name: 'Everly', lang: 'en', ipa: 'ˈɛvərli', aliases: ['에벌리'], matches: ['예리','은솔','아름'] },
  { name: 'Leilani', lang: 'en', ipa: 'leɪˈlɑːni', aliases: ['레이라니'], matches: ['나래','라온','나린'] },
  { name: 'Hannah', lang: 'de', ipa: 'ˈhana', aliases: ['한나'], matches: ['하나','한별','하은'] },
  { name: 'Delilah', lang: 'en', ipa: 'dɪˈlaɪlə', aliases: ['델릴라'], matches: ['다라','라온','도아'] },
  { name: 'Victoria', lang: 'es', ipa: 'bikˈto.ɾja', aliases: ['빅토리아'], matches: ['빛나','별이','가온'] },
  { name: 'Ambre', lang: 'fr', ipa: 'ɑ̃bʁ', aliases: ['앙브르','엠버'], matches: ['아름','보람','은비'] },
  { name: 'Rose', lang: 'fr', ipa: 'ʁoz', aliases: ['로즈'], matches: ['로아','로은','채원'] },
  { name: 'Jasmine', lang: 'en', ipa: 'ˈdʒæzmɪn', aliases: ['자스민'], matches: ['지민','서민','진아'] },
  { name: 'Daisy', lang: 'en', ipa: 'ˈdeɪzi', aliases: ['데이지'], matches: ['다솜','예지','다은'] },
  { name: 'Brooke', lang: 'en', ipa: 'brʊk', aliases: ['브룩'], matches: ['보라','보람','빛나'] },
  { name: 'Eden', lang: 'en', ipa: 'ˈiːdən', aliases: ['이든','에덴'], matches: ['이든','이안','은우'] },
  { name: 'Fiona', lang: 'en', ipa: 'fiˈoʊnə', aliases: ['피오나'], matches: ['빛나','온유','나래'] },
  { name: 'Giselle', lang: 'fr', ipa: 'ʒi.zɛl', aliases: ['지젤'], matches: ['지은','서율','채린'] },

  // 스페인/남미권 인기 이름
  { name: 'Santiago', lang: 'es', ipa: 'sanˈtja.ɣo', aliases: ['산티아고'], matches: ['산들','선우','태오'] },
  { name: 'Alejandro', lang: 'es', ipa: 'aleˈxan.dɾo', aliases: ['알레한드로'], matches: ['알찬','한결','도윤'] },
  { name: 'Diego', lang: 'es', ipa: 'ˈdje.ɣo', aliases: ['디에고'], matches: ['도현','동우','다온'] },
  { name: 'Valentina', lang: 'es', ipa: 'ba.lenˈti.na', aliases: ['발렌티나'], matches: ['별이','다은','나은'] },
  { name: 'Valeria', lang: 'es', ipa: 'baˈle.ɾja', aliases: ['발레리아'], matches: ['보라','예린','아린'] },
  { name: 'Carlos', lang: 'es', ipa: 'ˈkaɾ.los', aliases: ['카를로스'], matches: ['강민','찬우','로건'] },
  { name: 'Lucia', lang: 'es', ipa: 'luˈsi.a', aliases: ['루시아'], matches: ['루아','시은','채아'] },
  { name: 'Matias', lang: 'es', ipa: 'maˈti.as', aliases: ['마티아스'], matches: ['민태','태양','마루'] },
  { name: 'Joaquin', lang: 'es', ipa: 'xwaˈkin', aliases: ['호아킨'], matches: ['호진','환희','건우'] },
  { name: 'Emiliano', lang: 'es', ipa: 'emiˈlja.no', aliases: ['에밀리아노'], matches: ['은민','려우','명준'] },
  { name: 'Martina', lang: 'es', ipa: 'maɾˈti.na', aliases: ['마르티나'], matches: ['민아','태은','다나'] },
  { name: 'Catalina', lang: 'es', ipa: 'kataˈli.na', aliases: ['카탈리나'], matches: ['가린','나은','채아'] },
  { name: 'Mariana', lang: 'es', ipa: 'maˈɾja.na', aliases: ['마리아나'], matches: ['마루','아라','연우'] },
  { name: 'Daniela', lang: 'es', ipa: 'daˈnje.la', aliases: ['다니엘라'], matches: ['다은','예라','나래'] },
  { name: 'Gabriela', lang: 'es', ipa: 'ɡaˈβɾje.la', aliases: ['가브리엘라'], matches: ['가온','예린','라온'] },

  // 일본 인기 이름
  { name: 'Haruto', lang: 'ja', ipa: 'ha.ɾɯ.to', aliases: ['하루토'], matches: ['하람','태오','도하'] },
  { name: 'Yuto', lang: 'ja', ipa: 'jɯː.to', aliases: ['유토'], matches: ['유찬','태윤','도윤'] },
  { name: 'Sota', lang: 'ja', ipa: 'soː.ta', aliases: ['소타'], matches: ['서진','태양','솔이'] },
  { name: 'Riku', lang: 'ja', ipa: 'ɾi.kɯ', aliases: ['리쿠'], matches: ['리안','로운','규민'] },
  { name: 'Minato', lang: 'ja', ipa: 'mi.na.to', aliases: ['미나토'], matches: ['민서','태민','도하'] },
  { name: 'Ren', lang: 'ja', ipa: 'ɾeɴ', aliases: ['렌'], matches: ['려은','라온','린'] },
  { name: 'Kaito', lang: 'ja', ipa: 'ka.i.to', aliases: ['카이토'], matches: ['가온','이찬','태윤'] },
  { name: 'Sakura', lang: 'ja', ipa: 'sa.kɯ.ɾa', aliases: ['사쿠라'], matches: ['서아','채원','라온'] },
  { name: 'Hinata', lang: 'ja', ipa: 'çi.na.ta', aliases: ['히나타'], matches: ['하은','해나','태희'] },
  { name: 'Aoi', lang: 'ja', ipa: 'a.o.i', aliases: ['아오이'], matches: ['아라','온유','이솔'] },
  { name: 'Yui', lang: 'ja', ipa: 'jɯ.i', aliases: ['유이'], matches: ['유진','예원','하율'] },
  { name: 'Hina', lang: 'ja', ipa: 'çi.na', aliases: ['히나'], matches: ['하은','나은','해나'] },
  { name: 'Koharu', lang: 'ja', ipa: 'ko.ha.ɾɯ', aliases: ['코하루'], matches: ['고운','하린','보람'] },
  { name: 'Mei', lang: 'ja', ipa: 'meː', aliases: ['메이'], matches: ['민아','예나','미소'] },
  { name: 'Hana', lang: 'ja', ipa: 'ha.na', aliases: ['하나'], matches: ['하나','하늘','하린'] },
  { name: 'Asahi', lang: 'ja', ipa: 'a.sa.çi', aliases: ['아사히'], matches: ['아침','새벽','해나'] },
  { name: 'Itsuki', lang: 'ja', ipa: 'i.tsɯ.ki', aliases: ['이츠키'], matches: ['이솔','기찬','일우'] },
  { name: 'Yamato', lang: 'ja', ipa: 'ja.ma.to', aliases: ['야마토'], matches: ['태양','마루','동하'] },
  { name: 'Hiroto', lang: 'ja', ipa: 'çi.ɾo.to', aliases: ['히로토'], matches: ['호진','태윤','로건'] },
  { name: 'Ryusei', lang: 'ja', ipa: 'ɾjɯː.seː', aliases: ['류세이'], matches: ['유성','새별','세진'] },
  { name: 'Kotaro', lang: 'ja', ipa: 'ko.ta.ɾoː', aliases: ['코타로'], matches: ['태랑','건우','고운'] },
  { name: 'Sora', lang: 'ja', ipa: 'so.ɾa', aliases: ['소라'], matches: ['소라','하늘','솔이'] },
  { name: 'Hayato', lang: 'ja', ipa: 'ha.ja.to', aliases: ['하야토'], matches: ['하랑','태윤','찬영'] },
  { name: 'Rio', lang: 'ja', ipa: 'ɾi.o', aliases: ['리오'], matches: ['려은','이온','로아'] },
  { name: 'Akari', lang: 'ja', ipa: 'a.ka.ɾi', aliases: ['아카리'], matches: ['밝음','빛나','아린'] },
  { name: 'Mio', lang: 'ja', ipa: 'mi.o', aliases: ['미오'], matches: ['미래','온유','민아'] },
  { name: 'Rin', lang: 'ja', ipa: 'ɾiɴ', aliases: ['린'], matches: ['하린','채린','아린'] },
  { name: 'Yuna', lang: 'ja', ipa: 'jɯ.na', aliases: ['유나'], matches: ['유나','윤아','연아'] },
  { name: 'Ichika', lang: 'ja', ipa: 'i.tɕi.ka', aliases: ['이치카'], matches: ['일화','지아','채원'] },
  { name: 'Suzu', lang: 'ja', ipa: 'sɯ.zɯ', aliases: ['스즈'], matches: ['수아','소율','슬기'] },
  { name: 'Kanna', lang: 'ja', ipa: 'kaɴ.na', aliases: ['칸나'], matches: ['가은','한나','다나'] },
  { name: 'Himari', lang: 'ja', ipa: 'çi.ma.ɾi', aliases: ['히마리'], matches: ['하림','해솔','맑음'] },
  { name: 'Tsumugi', lang: 'ja', ipa: 'tsɯ.mɯ.ɡi', aliases: ['츠무기'], matches: ['채은','은솔','비단'] },
  { name: 'Honoka', lang: 'ja', ipa: 'ho.no.ka', aliases: ['호노카'], matches: ['온유','가온','은하'] },

  // 베트남 인기 이름
  { name: 'Nguyen', lang: 'vi', ipa: 'ŋwiən', aliases: ['응우옌'], matches: ['원우','은찬','규원'] },
  { name: 'Minh', lang: 'vi', ipa: 'mïŋ', aliases: ['민'], matches: ['민준','명준','민우'] },
  { name: 'Anh', lang: 'vi', ipa: 'aɲ', aliases: ['안'], matches: ['안서','아람','은우'] },
  { name: 'Duy', lang: 'vi', ipa: 'zwi', aliases: ['주이','두이'], matches: ['도윤','유진','재원'] },
  { name: 'Linh', lang: 'vi', ipa: 'liŋ', aliases: ['린'], matches: ['하린','채린','아린'] },
  { name: 'Trang', lang: 'vi', ipa: 'ʈaːŋ', aliases: ['짱','트랑'], matches: ['정원','찬영','채원'] },
  { name: 'Phuc', lang: 'vi', ipa: 'fuk', aliases: ['푹'], matches: ['보람','준혁','찬희'] },
  { name: 'Huy', lang: 'vi', ipa: 'hwi', aliases: ['후이'], matches: ['휘','환희','호진'] },
  { name: 'Khoi', lang: 'vi', ipa: 'xɔj', aliases: ['코이'], matches: ['고운','결','기찬'] },
  { name: 'Chau', lang: 'vi', ipa: 'tɕaw', aliases: ['쩌우'], matches: ['채원','주은','초롱'] },
  { name: 'Ngoc', lang: 'vi', ipa: 'ŋawk', aliases: ['응옥'], matches: ['옥','구슬','은별'] },
  { name: 'Thao', lang: 'vi', ipa: 'tʰaːw', aliases: ['타오'], matches: ['태은','다온','소솜'] },

  // 인도 / 남아시아 인기 이름
  { name: 'Aarav', lang: 'hi', ipa: 'ɑːˈrʌv', aliases: ['아라브'], matches: ['아라','아람','아린'] },
  { name: 'Vihaan', lang: 'hi', ipa: 'vɪˈhɑːn', aliases: ['비한'], matches: ['비단','한별','원우'] },
  { name: 'Ananya', lang: 'hi', ipa: 'əˈnʌnjə', aliases: ['아난야'], matches: ['안아','나연','아윤'] },
  { name: 'Rohan', lang: 'hi', ipa: 'ˈroʊhən', aliases: ['로한'], matches: ['로운','로하','한결'] },
  { name: 'Rahul', lang: 'hi', ipa: 'ˈrɑːhʊl', aliases: ['라훌'], matches: ['라온','로운','하람'] },
  { name: 'Pooja', lang: 'hi', ipa: 'ˈpuːdʒə', aliases: ['푸자'], matches: ['푸름','보아','채원'] },
  { name: 'Kabir', lang: 'hi', ipa: 'kəˈbɪər', aliases: ['카비르'], matches: ['가온','범준','기현'] },
  { name: 'Aryan', lang: 'hi', ipa: 'ˈɑːrjən', aliases: ['아리안'], matches: ['아련','이안','아름'] },
  { name: 'Ishaan', lang: 'hi', ipa: 'ɪˈʃɑːn', aliases: ['이샨'], matches: ['이찬','이현','시온'] },
  { name: 'Diya', lang: 'hi', ipa: 'ˈdiːjə', aliases: ['디야'], matches: ['다온','다은','이솔'] },
  { name: 'Kiara', lang: 'hi', ipa: 'kiˈɑːrə', aliases: ['키아라'], matches: ['가아','기쁨','아린'] },
  { name: 'Myra', lang: 'hi', ipa: 'ˈmaɪrə', aliases: ['마이라'], matches: ['미래','마루','아라'] },
  { name: 'Arjun', lang: 'hi', ipa: 'ˈɑːrdʒʊn', aliases: ['아르준'], matches: ['아준','준우','은찬'] },
  { name: 'Siddharth', lang: 'hi', ipa: 'sɪdˈdʱɑːrtʰ', aliases: ['싯다르타','시드'], matches: ['성도','세진','도현'] },
  { name: 'Neha', lang: 'hi', ipa: 'ˈneɪhə', aliases: ['네하'], matches: ['예나','하은','해나'] }
];

let addedCount = 0;
for (const raw of EXPANSION_LIST) {
  const k = raw.name.toLowerCase().trim();
  if (nameMap.has(k)) continue; // 이미 있으면 보존

  const matches = raw.matches.map(hangul => {
    const dbInfo = koreanNameMap.get(hangul);
    return {
      hangul,
      roman: hangulToRoman(hangul),
      reason: `Acoustically resonates with the rhythmic phonetic flow of '${raw.name}'.`,
      meaning: dbInfo ? dbInfo.meaning : `${hangul}의 맑고 고운 마음을 담은 아름다운 뜻`
    };
  });

  const aliases = Array.from(new Set([
    raw.name.toLowerCase(),
    ...(raw.aliases || []).map(a => a.toLowerCase())
  ]));

  const item = {
    name: raw.name,
    aliases,
    lang: raw.lang,
    ipa: raw.ipa,
    matches
  };

  nameMap.set(k, item);
  addedCount++;
}

const finalCuratedList = Array.from(nameMap.values());
console.log(`[Result] Added ${addedCount} new global names!`);
console.log(`[Result] Total curated global names now: ${finalCuratedList.length}`);

// 1. data/curated_foreign_names.json 저장
fs.writeFileSync(curatedPath, JSON.stringify(finalCuratedList, null, 2), 'utf8');

// 2. web/js/phonetic_data.js 저장
const fileHeader = `// web/js/phonetic_data.js — Curated Global Top Names Direct Database (${finalCuratedList.length}+ names)
// Generated by scripts/expand_foreign_names.mjs
// Covers: English, Spanish, French, German, Italian, Japanese, Chinese, Vietnamese, Hindi, etc.

export const CURATED_NAMES = ${JSON.stringify(finalCuratedList, null, 2)};

export const NAMES_BY_KEY = new Map();
for (const item of CURATED_NAMES) {
  NAMES_BY_KEY.set(item.name.toLowerCase(), item);
  for (const alias of item.aliases) {
    NAMES_BY_KEY.set(alias.toLowerCase(), item);
  }
}
`;

fs.writeFileSync(phoneticDataPath, fileHeader, 'utf8');
console.log(`[Result] Successfully updated ${curatedPath} and ${phoneticDataPath}!`);
