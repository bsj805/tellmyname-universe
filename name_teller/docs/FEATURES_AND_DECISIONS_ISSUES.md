# 🐙 GitHub Private 레포지토리 (name-teller) 총 기능 이슈 목록 & 결정사항(ADR)

## 1. 총 기능 목록 (1 Issue = 1 Feature 원칙)
- [x] Issue #1 (CLOSED): 한글 이름 사전 DB 스키마 및 초성 색인 설계 (prisma/schema.prisma)
- [x] Issue #2 (CLOSED): 사전 구축 한글 이름 시드 셋(5,240개) 및 초성 허브(ㄱ~ㅎ) 조회 (src/app/name/[name]/page.tsx)
- [x] Issue #3 (CLOSED): 미등록 이름 유입 시 Gemini API 가장 예쁜 한자 뜻풀이 생성 & DB 자동 적재 플라이휠 (src/lib/gemini-name-service.ts)
- [x] Issue #4 (CLOSED): 이름을 설명해드립니다 한자 음가/심미성 검증 및 2단계 자가 교정 루프 (src/lib/quality-check.ts)
- [x] Issue #5 (CLOSED): 한글 이름 음운 유효성 가드레일(isValidKoreanNamePhonetics) 및 무의미 문자열 스팸 색인 차단 (src/lib/quality-check.ts)
- [x] Issue #6 (CLOSED): 이름별 익명 메시지 전달소(우체통) 작성·공감·우표 테마 4종 및 전용 공유 링크 (src/app/api/messages/route.ts)
- [x] Issue #7 (CLOSED): 익명 메시지 UGC 클린봇(PII 정규식 차단 + 욕설/사이버불링 검열) (src/lib/quality-check.ts)
- [x] Issue #8 (CLOSED): Programmatic SEO 동적 sitemap.xml(isIndexable 필터) 및 DefinedTerm+FAQPage JSON-LD (src/app/sitemap.ts)
- [x] Issue #9 (CLOSED): Google AdSense 화면별 4대 최적 광고 슬롯(CLS=0 고정 높이 래퍼) 및 ads.txt (src/components/AdSenseBanner.tsx)
- [x] Issue #10 (CLOSED): 화면별 인터랙티브 UI 프로토타입 및 월간 AdSense 수익/커버리지 시뮬레이터 (name_teller_ui.html)
- [ ] Issue #11 (OPEN): Google Search Console Indexing API 자동 Ping 및 일일 신규 이름 배치 색인 워커
- [ ] Issue #12 (OPEN): 이름 뜻풀이 결과 카드 인스타그램 스토리용 OG 이미지(/api/og/[name]) 동적 생성기
