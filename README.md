# companion-web

차량 캐릭터 AI 컴패니언(앱 Hey, 캐릭터 헤이파리, 팀 Team Hey. 저장소 이름 `companion-*`은 그대로)의 폰 웹이다. 차 안의 사람이 차 화면의 QR을 폰 카메라로 찍으면 `/p/:pairCode`가 열리고, 여기서 녹음·기억 저장에 동의해 차와 연결한다(PRD W1~W3).

폰 웹과 디자인 시스템은 한국어 한 가지만 다룬다(다국어 코드 없음). 부품은 컴패니언 폰 웹(W1~W3)이 쓰는 것만 두고, 이야기 예시 글도 헤이파리 내용(동의·기억·말투·연결)만 쓴다.

## 지금 있는 것

| 위치 | 내용 |
|---|---|
| `packages/ui-web` | 디자인 시스템 부품. `className`·`style`을 받지 않고, 화면은 이 부품으로만 조립한다 |
| `apps/passenger-web` | 앱(폴더 이름은 배포 경로 `ops/companion-deploy/Dockerfile.web` 때문에 옛 이름 그대로). 주소 `/p/:pairCode`를 W1(QR 입장)로 연결하는 최소 셸. 코드가 없거나 모양이 다르면 "QR을 다시 찍어 주세요" 안내 |
| `apps/passenger-web/src/transport/relayUrlGuard.ts` | 운영 빌드는 https 서버 주소(`VITE_RELAY_URL`)만 허용 |
| `scripts/check-*.mjs` | CSS 리터럴·번들 예산·이야기 누락·레이아웃·접근성 검사 |
| `eslint.config.js` | 화면에서 HTML 태그·style·className·글자 리터럴 금지 |
| `shared/` | `companion-shared` v0.1.0 서브모듈(디자인 토큰) |

W1~W3의 동의·연결·기억 화면과 서버 연동은 이후 작업이다. 이 저장소의 W1은 주소의 코드를 보여 주는 자리까지만 한다.

패키지 이름(`@hey/ui-web`, `@darren-pleos-challenge/hey-*`)은 앱 이름이 확정될 때까지 바꾸지 않는다.

## 시작

```sh
git clone --recurse-submodules git@github.com:teamhey-challenge/companion-web.git
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

공모전 제출 묶음의 일부다. 앱 Hey(캐릭터 헤이파리), 팀 Team Hey. APK는 차량 앱·폰 앱 저장소의 `apk/`에 있다.

- 코드는 MIT(`LICENSE`). 글꼴 등 고지는 `THIRD_PARTY.md`.
