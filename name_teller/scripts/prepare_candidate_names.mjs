// scripts/prepare_candidate_names.mjs
// 대법원 305개 인명용 한자 음절 전체를 기반으로 초광폭 롱테일 한국어 이름 풀 생성기
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const compactNamesPath = path.join(dataDir, 'compact_serving_names.json');
const hanjaPath = path.join(dataDir, 'serving_hanja_syllables.json');

const existingNames = new Set(JSON.parse(fs.readFileSync(compactNamesPath, 'utf8')).map(r => r[0]));
console.log(`[Init] Existing names in DB: ${existingNames.size}`);

const hanjaData = JSON.parse(fs.readFileSync(hanjaPath, 'utf8'));
const allHanjaSyllables = Object.keys(hanjaData);
console.log(`[Init] Total Hanja syllables: ${allHanjaSyllables.length}`);

// 한국인 이름에 자연스럽게 쓰이는 주요 첫 글자 음절 (160종)
const NATURAL_FIRST_SYLLABLES = [
  '가', '강', '건', '결', '겸', '경', '고', '관', '광', '구', '규', '균', '근', '기', '길',
  '나', '남', '노', '누', '다', '단', '담', '대', '덕', '도', '동', '두', '라', '란', '람',
  '래', '로', '루', '리', '린', '림', '마', '만', '명', '무', '문', '미', '민', '범', '별',
  '병', '보', '봄', '부', '비', '빈', '산', '상', '새', '서', '석', '선', '설', '섭', '성',
  '세', '소', '솔', '솜', '송', '수', '숙', '순', '슬', '승', '시', '신', '아', '안', '애',
  '양', '여', '연', '영', '예', '오', '옥', '온', '완', '용', '우', '운', '울', '웅', '원',
  '유', '윤', '율', '은', '을', '음', '의', '이', '익', '인', '일', '임', '자', '재', '전',
  '정', '제', '종', '주', '준', '중', '지', '진', '찬', '창', '채', '천', '철', '초', '태',
  '택', '하', '학', '한', '해', '혁', '현', '형', '혜', '호', '홍', '화', '환', '효', '훈',
  '휘', '희'
];

// 한국인 이름에 자연스럽게 쓰이는 주요 끝 글자 음절 (160종)
const NATURAL_SECOND_SYLLABLES = [
  '경', '곤', '구', '국', '규', '균', '근', '기', '길', '남', '담', '대', '덕', '도', '동',
  '두', '란', '람', '량', '련', '령', '로', '록', '론', '루', '리', '린', '림', '만', '명',
  '모', '무', '문', '미', '민', '범', '별', '병', '보', '복', '본', '봉', '봄', '빈', '산',
  '상', '서', '석', '선', '설', '섭', '성', '세', '소', '솔', '솜', '송', '수', '숙', '순',
  '슬', '승', '시', '신', '심', '아', '안', '애', '양', '연', '열', '염', '엽', '영', '예',
  '옥', '온', '완', '왕', '요', '용', '우', '운', '울', '웅', '원', '월', '유', '윤', '율',
  '융', '은', '을', '음', '의', '이', '익', '인', '일', '임', '자', '작', '잔', '장', '재',
  '전', '정', '제', '조', '종', '주', '준', '중', '지', '직', '진', '찬', '창', '채', '천',
  '철', '초', '춘', '출', '충', '태', '택', '하', '학', '한', '해', '혁', '현', '형', '혜',
  '호', '홍', '화', '환', '황', '회', '효', '후', '훈', '휘', '희'
];

const candidateSet = new Set();

// 2글자 자연스러운 조합 (160 * 160 = 25,600)
for (const f of NATURAL_FIRST_SYLLABLES) {
  for (const s of NATURAL_SECOND_SYLLABLES) {
    candidateSet.add(`${f}${s}`);
  }
}

// 1글자 감성 및 정통 인명 (전체 305개 음절 중 인명으로 적합한 것)
for (const syl of allHanjaSyllables) {
  candidateSet.add(syl);
}

// 순우리말 3글자/2글자 감성 이름 풀 추가
const POETIC_PURE_NAMES = [
  '가온누리', '나르샤', '다솜이', '늘해랑', '차오름', '모아나', '온새미로', '빛초롱', '해누리',
  '새론이', '하늘빛', '하람이', '봄내음', '여름이', '가을이', '겨울이', '꽃보라', '물비늘',
  '산마루', '솔바람', '달무리', '별무리', '은하수', '미리내', '샛별이', '소소미', '늘푸름',
  '바람결', '파도소리', '새벽별', '초롱이', '다소니', '너울이', '늘솔길', '마루한', '밝은달'
];
for (const p of POETIC_PURE_NAMES) {
  candidateSet.add(p);
}

const allCandidates = Array.from(candidateSet);
const unservedCandidates = allCandidates.filter(name => !existingNames.has(name));

console.log(`[Summary] Total generated candidates: ${allCandidates.length}`);
console.log(`[Summary] Already in DB: ${allCandidates.length - unservedCandidates.length}`);
console.log(`[Summary] New unserved candidates: ${unservedCandidates.length}`);

// 자율 발굴 풀 파일로 저장
const poolPath = path.join(dataDir, 'autonomous_candidate_names.json');
fs.writeFileSync(poolPath, JSON.stringify(unservedCandidates, null, 2), 'utf8');
console.log(`[Success] Saved ${unservedCandidates.length} candidate names to ${poolPath}`);
