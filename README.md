# companion-web

앱 이름 **Hey**(캐릭터 헤이리), 팀 **Team Hey**. 저장소 이름 `companion-*`은 그대로다.

차량 캐릭터 AI 컴패니언의 **폰 웹**(폰 앱의 백업)과 웹 디자인 시스템·Storybook 저장소다. 차 화면의 QR을 폰 카메라로 찍으면 `/p/:pairCode`가 열리고, 여기서 녹음·기억 저장에 동의해 차와 연결한다(W1~W3). 한국어 한 가지만 다룬다.

## 제출물과 주소

- 서버: https://hey.lastmile.ltd/api, 폰 웹: https://hey.lastmile.ltd/ , Storybook: https://hey.lastmile.ltd/storybook/
- APK는 이 저장소에 없다. 차량 앱은 companion-car `apk/TeamHey_Hey_release.apk`(https://hey.lastmile.ltd/download/latest.apk), 폰 앱은 companion-phone `apk/TeamHey_Hey-phone_release.apk`(https://hey.lastmile.ltd/download/phone/latest.apk).
- 심사자 에뮬레이터의 차 등록에는 등록 비밀 파일이 필요하다. 팀이 요청 시 전달하며 방법은 companion-car README에 있다.

## 테스트 환경

Bun 1.4 이상(CI는 1.4.2), TypeScript 5.9, Vite. 브라우저 검사(`--layout --a11y`)에는 Chromium이 필요하다. 이 저장소는 Pleos SDK(Vehicle·NaviHelper·SpeechToText·TextToSpeech)를 쓰지 않는다. 차량 앱이 쓴다. 폰 웹은 마이크 오디오와 좌표를 다루지 않는다(음성 인식은 차량의 Pleos 온디바이스 STT).

## 구성

| 위치 | 내용 |
|---|---|
| `packages/ui-web` | 디자인 시스템 부품. `className`·`style`을 받지 않고, 화면은 이 부품으로만 조립한다 |
| `apps/passenger-web` | 폰 웹 앱(폴더 이름은 배포 경로 때문에 옛 이름 그대로). `/p/:pairCode`가 W1(QR 입장·동의) → W2(연결 완료) → W3(기억·말투·연결 해제)로 이어진다. 코드가 없거나 모양이 다르면 "QR을 다시 찍어 주세요" 안내 |
| `apps/passenger-web/src/transport/relayUrlGuard.ts` | 운영 빌드는 https 서버 주소(`VITE_RELAY_URL`)만 허용 |
| `scripts/check-*.mjs` | CSS 리터럴·번들 예산·이야기 누락·레이아웃·접근성 검사 |
| `eslint.config.js` | 화면에서 HTML 태그·style·className·글자 리터럴 금지 |
| `shared/` | `companion-shared` 서브모듈(디자인 토큰) |

W1~W3 화면은 서버의 페어링·동의·기억 API와 연결된다.

패키지 이름(`@hey/ui-web`, `hey-*` 토큰·프로토콜 패키지)은 앱 이름이 확정될 때까지 바꾸지 않는다.

## 시작

```sh
git clone --recurse-submodules https://github.com/teamhey-challenge/companion-web.git
cd companion-web
nice -n 19 bun install
bun run dev:web        # http://localhost:5187/p/7KQ4M9XT
```

`VITE_RELAY_URL`은 운영 빌드에만 필요하다(https). 값은 저장소에 두지 않는다.

## 점검

```sh
bun run check          # lint → CSS 리터럴 → 타입 → 시험 → 번들 예산 → Storybook 빌드 → 이야기 누락
bun run check -- --layout --a11y   # 브라우저 검사까지(Chromium 필요)
```

## 차 앱·시안 갤러리

공개 Storybook 은 웹 부품·폰 웹 외에 `차 앱 부품`, `차 앱 화면`, `시안`(+ `폰 웹/시안 대조`)을 싣는다. 그림은 저장소에 두지 않고 빌드 때 `scripts/collect-gallery.ts` 가 받는다(companion-car main 의 Paparazzi 스냅샷, hey-companion-ui main 의 `artifacts/delivery-v05`). 커밋 SHA 는 이야기 아래에 적힌다. 결과(`gallery/public`, `gallery/generated`)는 gitignore 대상이다.

```sh
bun scripts/collect-gallery.ts      # gh 로그인 또는 GH_TOKEN/GH_TOKEN_FILE 필요, CAR_SHA/UI_SHA 로 커밋 고정 가능
bun run sb:build
```

## 링크·라이선스

| 저장소 | 내용 |
|---|---|
| [companion-car](https://github.com/teamhey-challenge/companion-car) | 차량 앱 |
| [companion-phone](https://github.com/teamhey-challenge/companion-phone) | 폰 앱(QR 연결·동의·기억 관리) |
| [companion-server](https://github.com/teamhey-challenge/companion-server) | 대화·기억·TTS 서버 |
| [companion-web](https://github.com/teamhey-challenge/companion-web) | 폰 웹(폰 앱의 백업)·디자인 시스템 Storybook(이 저장소) |
| [companion-shared](https://github.com/teamhey-challenge/companion-shared) | 디자인 토큰·프로토콜(서브모듈 `shared/`) |

공모전 제출 묶음의 일부다. 앱 Hey(캐릭터 헤이리), 팀 Team Hey. APK는 차량 앱·폰 앱 저장소의 `apk/`에 있다.

- 코드는 MIT(`LICENSE`). 글꼴 등 고지는 `THIRD_PARTY.md`.
