# 🏛️ MyHome Architecture Decision Records (ADRs)

본 디렉터리는 `myhome` (나에게 어울리는 집, [myhome.tellmyname.app](https://myhome.tellmyname.app)) 프로젝트의 핵심 아키텍처 결정 사항(Architecture Decision Records, ADR)을 체계적으로 보존하고 관리하는 공식 문서 보관소입니다.

모든 ADR은 문제 상황(Context), 고려된 대안(Options), 최종 결정(Decision Outcome), 아키텍처 다이어그램 및 트레이드오프를 명확히 기록하며, 프로젝트의 [GitHub Issues Archive](../GITHUB_ISSUES_ARCHIVE.md)와 1:1로 상호 연결됩니다.

---

## 📑 ADR 목록 (Table of Decisions)

| ADR 번호 | 의사결정 제목 (Title) | 상태 (Status) | 주요 관련 이슈 |
| :---: | :--- | :---: | :---: |
| [**ADR-001**](./ADR-001-jsa-hash-avalanche-name-mapping.md) | **JSA-Hash 아발란체 하이브리드 엔진을 통한 한글 자모 및 14개 다국어 이름의 결정론적 균등 매핑** | `Accepted` | #1, #10 |
| [**ADR-002**](./ADR-002-zero-normalcy-50-50-alternating-taxonomy.md) | **평범한 주택 완전 배제(Zero-Normalcy)와 폭망/대박 50:50 및 짝수(실제)/홀수(허구) 1단계 교차 택소노미** | `Accepted` | #2, #9, #16 |
| [**ADR-003**](./ADR-003-zero-file-explosion-cloudflare-workers-assets-ssr.md) | **무파일 증식(Zero-File-Explosion) 원칙과 Cloudflare Workers & Static Assets 기반 엣지 동적 SSR 라우터** | `Accepted` | #5, #14 |
| [**ADR-004**](./ADR-004-r2-storage-and-local-gdrive-hybrid-image-serving.md) | **Cloudflare R2 오브젝트 스토리지와 로컬 G-Drive(`new_houses`) 하이브리드 서빙 및 SVG 폴백 파이프라인** | `Accepted` | #4, #16 |
| [**ADR-005**](./ADR-005-multilingual-14-languages-and-50k-global-image-seo.md) | **글로벌 14개 언어권 확장 및 5만 개 인명 데이터셋 분할 사이트맵과 프로그래매틱 이미지 SEO** | `Accepted` | #6, #10, #15 |
| [**ADR-006**](./ADR-006-scroll-text-preview-and-sitemap-name-reverse-routing.md) | **호기심 유발 스크롤 텍스트 전용 프리뷰(이미지 잠금)와 사이트맵 시드 이름 역매핑(/name/ 자동 라우팅)** | `Accepted` | #7, #13 |
| [**ADR-007**](./ADR-007-multilingual-story-canvas-and-adsense-monetization.md) | **14개 다국어 인스타그램 스토리 9:16 3단 캔버스 카드 공유 및 CLS=0 구글 애드센스 수익화 파이프라인** | `Accepted` | #8, #11, #12 |

---

## 🔗 관련 문서 링크
- [GitHub Issues Full Archive (#1 ~ #16)](../GITHUB_ISSUES_ARCHIVE.md)
- [0~499단계(500종) 마스터 컨셉 기획표](../CONCEPT_TABLE_0_TO_340.md)
- [프로젝트 초기 기획 및 세부 명세서](../PLANNING_SPEC.md)
