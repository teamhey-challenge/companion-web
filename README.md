# companion-web

Hey 폰 웹과 웹 디자인 시스템 Storybook.

Hey는 차 안에서 말을 걸고 나를 기억하는 캐릭터 AI 컴패니언(캐릭터 헤이리)이고, 만든 팀은 Team Hey다. 이 저장소에는 폰 앱의 백업인 **폰 웹**과, 화면을 조립하는 **웹 디자인 시스템**이 있다. 차 화면의 QR을 폰 카메라로 찍으면 `/p/:pairCode`가 열리고, 여기서 녹음·기억 저장에 동의해 차와 연결한다. 한국어만 지원한다.

- 폰 웹: https://hey.lastmile.ltd/
- Storybook(웹 부품, 차 앱 부품·화면, 시안): https://hey.lastmile.ltd/storybook/

## 구성

| 위치 | 내용 |
|---|---|
| `packages/ui-web` | 디자인 시스템 부품. `className`·`style`을 받지 않고, 화면은 이 부품으로만 조립한다 |
| `apps/passenger-web` | 폰 웹 앱(React + Vite). `/p/:pairCode`가 연결·동의(W1) → 연결 완료(W2) → 기억·말투·연결 해제(W3)로 이어진다. 코드가 없거나 모양이 다르면 QR을 다시 찍도록 안내한다. 폴더 이름은 배포 경로 때문에 옛 이름 그대로다 |
| `scripts/` | CSS 리터럴·번들 예산·이야기 누락·레이아웃·접근성 검사, 시안 갤러리 수집 |
| `.storybook/` | Storybook 설정 |
| `shared/` | [`companion-shared`](https://github.com/teamhey-challenge/companion-shared) 서브모듈(디자인 토큰·프로토콜 타입) |

`eslint.config.js`가 화면 코드의 HTML 태그·`style`·`className`·글자 리터럴을 막는다. 색과 크기는 토큰으로만 쓴다.

## 시작하기

필요한 것: [Bun](https://bun.sh) 1.4 이상. 브라우저 검사에는 Chromium이 더 필요하다.

```sh
git clone --recurse-submodules https://github.com/teamhey-challenge/companion-web.git
cd companion-web
bun install
bun run dev:web     # http://localhost:5187/p/7KQ4M9XT
bun run sb          # Storybook, http://localhost:6106
```

| 명령 | 하는 일 |
|---|---|
| `bun run dev:web` | 폰 웹 개발 서버 |
| `bun run --cwd apps/passenger-web build` | 폰 웹 빌드(타입 검사 후 Vite 빌드) |
| `bun run sb` / `bun run sb:build` | Storybook 개발 서버 / 정적 빌드(`storybook-static/`) |
| `bun run check` | lint → CSS 리터럴 → 타입 → 시험 → 번들 예산 → Storybook 빌드 → 이야기 누락 |
| `bun run check -- --layout --a11y` | 위 검사에 브라우저 레이아웃·접근성 검사 추가 |

운영 빌드는 서버 주소를 환경 변수 `VITE_RELAY_URL`(https만 허용)로 받는다. 값은 저장소에 두지 않는다.

## 시안 갤러리

Storybook의 `차 앱 부품`·`차 앱 화면`·`시안`은 그림을 저장소에 두지 않고, 빌드 때 `scripts/collect-gallery.ts`가 [`companion-car`](https://github.com/teamhey-challenge/companion-car)의 스냅샷과 디자인 스튜디오 산출물에서 받아 온다. GitHub 로그인(`gh`) 또는 `GH_TOKEN`이 필요하고, 결과는 gitignore 대상이다.

```sh
bun scripts/collect-gallery.ts
bun run sb:build
```

## 배포

`main`에 병합되고 CI가 통과한 커밋이 폰 웹과 Storybook으로 자동 배포된다. 서버 주소 등 배포 설정은 저장소 밖에서 주입한다.

## 관련 저장소

| 저장소 | 내용 |
|---|---|
| [companion-car](https://github.com/teamhey-challenge/companion-car) | 차량 앱 |
| [companion-phone](https://github.com/teamhey-challenge/companion-phone) | 폰 앱 |
| [companion-server](https://github.com/teamhey-challenge/companion-server) | 대화·기억·TTS 서버 |
| [companion-shared](https://github.com/teamhey-challenge/companion-shared) | 디자인 토큰·프로토콜 |

코드는 MIT 라이선스([`LICENSE`](LICENSE))이며, 글꼴 등 제3자 고지는 [`THIRD_PARTY.md`](THIRD_PARTY.md)에 있다.
