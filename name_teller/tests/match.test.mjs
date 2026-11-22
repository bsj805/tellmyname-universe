// tests/match.test.mjs — 이름점 및 99% 궁합 역산 유닛 테스트
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCharStrokes,
  calculateMatch,
  getVerdict,
  find99Matches
} from '../web/js/match.js';

test('1. 한글 음절 획수 계산 (getCharStrokes)', async (t) => {
  // 사용자 제공 예시 검증: 김(7), 전(7), 수(4), 지(4), 현(8)
  assert.equal(getCharStrokes('김'), 7, '김 획수는 7이어야 함 (ㄱ:2, ㅣ:1, ㅁ:4)');
  assert.equal(getCharStrokes('전'), 7, '전 획수는 7이어야 함 (ㅈ:3, ㅓ:2, ㄴ:2)');
  assert.equal(getCharStrokes('수'), 4, '수 획수는 4이어야 함 (ㅅ:2, ㅜ:2)');
  assert.equal(getCharStrokes('지'), 4, '지 획수는 4이어야 함 (ㅈ:3, ㅣ:1)');
  assert.equal(getCharStrokes('현'), 8, '현 획수는 8이어야 함 (ㅎ:3, ㅕ:3, ㄴ:2)');

  // 추가 음절 검증
  assert.equal(getCharStrokes('이'), 2, '이 획수는 2이어야 함 (ㅇ:1, ㅣ:1)');
  assert.equal(getCharStrokes('박'), 8, '박 획수는 8이어야 함 (ㅂ:4, ㅏ:2, ㄱ:2)');
});

test('2. 이름점 트리 계산 알고리즘 (calculateMatch)', async (t) => {
  // 사용자 첨부 이미지 검증: 김수현 & 전지현 -> 37%
  const result = calculateMatch('김수현', '전지현');

  // 교차 배열: 김, 전, 수, 지, 현, 현
  assert.deepEqual(result.interleave, ['김', '전', '수', '지', '현', '현']);
  assert.deepEqual(result.charOrigins, ['A', 'B', 'A', 'B', 'A', 'B']);

  // 단계별 획수 트리 검증
  assert.deepEqual(result.steps[0], [7, 7, 4, 4, 8, 8]);
  assert.deepEqual(result.steps[1], [4, 1, 8, 2, 6]);
  assert.deepEqual(result.steps[2], [5, 9, 0, 8]);
  assert.deepEqual(result.steps[3], [4, 9, 8]);
  assert.deepEqual(result.steps[4], [3, 7]);

  // 최종 점수 37%
  assert.equal(result.percent, 37, '김수현 -> 전지현 이름점은 37%여야 함');
});

test('3. 가변 길이 이름 계산 검증 (2글자 vs 3글자, 3글자 vs 2글자)', async (t) => {
  const res2v3 = calculateMatch('수지', '김수현');
  assert.equal(res2v3.interleave.length, 5, '2글자 + 3글자는 총 5음절');
  assert.ok(res2v3.percent >= 0 && res2v3.percent <= 99, '결과는 0~99 범위');

  const res3v2 = calculateMatch('김수현', '수지');
  assert.equal(res3v2.interleave.length, 5, '3글자 + 2글자는 총 5음절');
  assert.ok(res3v2.percent >= 0 && res3v2.percent <= 99, '결과는 0~99 범위');
});

test('4. 점수대별 감성 평가 문구 (getVerdict)', async (t) => {
  assert.equal(getVerdict(99).title, '운명적인 천생연분');
  assert.equal(getVerdict(80).title, '설레는 핑크빛 기류');
  assert.equal(getVerdict(60).title, '친구 이상의 묘한 썸');
  assert.equal(getVerdict(40).title, '알쏭달쏭 밀당의 단계');
  assert.equal(getVerdict(20).title, '티격태격 스며드는 케미');
});

test('5. 궁합 99% 추천 역산 검증 (find99Matches)', async (t) => {
  // 모의 이름 풀 (테스트용)
  const mockNamesPool = [
    { name: '해가람', meaning: '태양의 기운', gender: '남녀공통' },
    { name: '윤가람', meaning: '단비를 머금은 강물', gender: '남녀공통' },
    { name: '하미르', meaning: '하늘을 나는 용', gender: '남녀공통' },
    { name: '아람', meaning: '풍성한 결실', gender: '남녀공통' },
    { name: '도윤', meaning: '올바른 도리', gender: '남성' },
    { name: '서윤', meaning: '상서로운 빛', gender: '여성' }
  ];

  const matches = find99Matches('김수현', mockNamesPool, { limit: 10 });

  // 추천된 모든 이름은 실제로 calculateMatch를 돌렸을 때 최소 한쪽 방향에서 99%가 나와야 함
  assert.ok(matches.length > 0, '최소 1개 이상의 99% 매칭 결과가 발견되어야 함');

  for (const match of matches) {
    const scoreAB = calculateMatch('김수현', match.name).percent;
    const scoreBA = calculateMatch(match.name, '김수현').percent;
    const is99 = scoreAB === 99 || scoreBA === 99;
    assert.ok(is99, `${match.name}의 궁합 점수는 99%여야 함 (실제 AB: ${scoreAB}%, BA: ${scoreBA}%)`);
  }
});
