# TellMyName Universe (`tellmyname.app` 통합 모노레포)

이름의 한글 획수와 유니코드 코드포인트를 32비트 FNV-1a 해시로 분석하는 `tellmyname.app` 패밀리 서비스 통합 저장소입니다.

## 디렉터리 구조

| 폴더 | 도메인 | 설명 |
| :--- | :--- | :--- |
| `name_teller/` | `https://tellmyname.app` | 4대 이름 세계관 카드 쇼케이스 및 개발자의 다른 사이트(`photodiary`)를 연결하는 통합 허브 포털 |
| `myhome/` | `https://myhome.tellmyname.app` | 나에게 어울리는 집 (Lv.0~999 실존·상상 하우스 1,000종 도감 & 이상형 월드컵) |
| `food/` | `https://food.tellmyname.app` | 오늘 뭐 먹지? (이름·기분·날씨 맞춤 하루 5끼 식단 401종 도감 & 음식 이상형 월드컵) |
| `occupation/` | `https://job.tellmyname.app` | 나에게 어울리는 직업 (Lv.0~1000 시대·차원 초월 직업 1,001종 도감 & 이상형 월드컵) |
| `car/` | `https://car.tellmyname.app` | 나에게 어울리는 자동차 (Lv.0~1000 탈것·모빌리티 1,001종 도감 & 이상형 월드컵) |

## 빌드 및 일괄 배포 명령어

루트 디렉터리(`c:\Users\USER\Documents\projects`)에서 한 줄의 명령어로 한국어 AI 문체 검증(`korean-humanizer`), 정적 사이트 빌드, Cloudflare Workers 배포를 한꺼번에 실행할 수 있습니다.

```bash
# 1. 전체 앱 한국어 문체 검증(Grade A) + 정적 빌드
npm run build

# 2. 전체 5개 앱 한 번에 Cloudflare Workers 배포
npm run deploy

# 3. 허브(tellmyname.app) + myhome + food 3개만 우선 배포
npm run deploy:open
```
