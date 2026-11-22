// 글씨(텍스트/신문/문서) 페널티 및 필터링 로직 테스트

const documentKeywords = [
  'newspaper', 'times', 'magazine', 'journal', 'gazette', 'daily', 'post',
  'press', 'article', 'issue', 'page', 'scan', 'archive', 'ia sim', 'text',
  'publication', 'transcript', 'document', 'periodical', 'editorial cartoon'
];

function checkTextAndDocPenalty(title, description, categories) {
  const combined = `${title} ${description || ''} ${categories || ''}`.toLowerCase();
  
  // 1. 신문/잡지/도서/스캔 문서 키워드가 발견되면 즉시 강력한 감점 (-1,000점)
  for (const kw of documentKeywords) {
    if (combined.includes(kw)) {
      return { penalty: -1000, reason: `문서/신문 키워드 감지: "${kw}"` };
    }
  }
  
  // 2. 파일 형식 검사: PDF, TIF, DJVU는 이미지라도 100% 문서 스캔본이므로 탈락
  if (/\.(pdf|djvu|tif|tiff)$/i.test(title)) {
    return { penalty: -1000, reason: '문서 스캔 포맷 (.pdf/.djvu/.tif)' };
  }
  
  return { penalty: 0, reason: '순수 사진' };
}

console.log(checkTextAndDocPenalty('Victoria Daily Times (1924-09-26) (IA victoriadailytimes19240926).pdf'));
console.log(checkTextAndDocPenalty('State Magazine 2003-05- Iss 468.pdf'));
console.log(checkTextAndDocPenalty('Emirates Palace @ Abu Dhabi.jpg'));
