# companion-web

차량 캐릭터 AI 컴패니언(임시 이름 `companion-*`)의 폰 웹이다. 동승자·운전자가 차 화면의 QR을 폰 카메라로 찍으면 `/p/:pairCode`가 열리고, 여기서 녹음·기억 저장에 동의해 차와 연결한다(PRD W1~W3).

HEY 승객 웹 `hey-passenger-web@2754655`에서 뼈대만 복사해 왔다. 택시 화면과 택시 전용 부품(요금·탑승 카드·장소 검색 등)은 모두 지웠고, 컴패니언 폰 웹(W1~W3)에 쓰는 부품만 남겼다.

## 지금 있는 것

| 위치 | 내용 |
|---|---|
| `packages/ui-web` | 디자인 시스템 부품. `className`·`style`을 받지 않고, 화면은 이 부품으로만 조립한다 |
| `apps/passenger-web` | 앱. 주소 `/p/:pairCode`를 W1(QR 입장)로 연결하는 최소 셸. 코드가 없거나 모양이 다르면 "QR을 다시 찍어 주세요" 안내 |
| `apps/passenger-web/src/transport/relayUrlGuard.ts` | 운영 빌드는 https 서버 주소(`VITE_RELAY_URL`)만 허용 |
| `scripts/check-*.mjs` | CSS 리터럴·번들 예산·이야기 누락·레이아웃·접근성 검사 |
| `eslint.config.js` | 화면에서 HTML 태그·style·className·글자 리터럴 금지 |
| `shared/` | `companion-shared` v0.1.0 서브모듈(디자인 토큰) |

W1~W3의 동의·연결·기억 화면과 서버 연동은 이후 작업이다. 이 저장소의 W1은 주소의 코드를 보여 주는 자리까지만 한다.

패키지 이름(`@hey/ui-web`, `@darren-pleos-challenge/hey-*`)은 앱 이름이 확정될 때까지 바꾸지 않는다.

## 시작

```sh
git clone --recurse-submodules git@github.com:darren-pleos-challenge/companion-web.git
cd companion-web
nice -n 19 bun install
bun run dev:web        # http://localhost:5187/p/7KQ4M9XT
```

`VITE_RELAY_URL`은 운영 빌드에만 필요하다(https). 값은 저장소에 두지 않는다.

## 점검

CI는 두지 않는다. 로컬에서 한 번에 돌린다.

```sh
bun run check          # lint → CSS 리터럴 → 타입 → 시험 → 번들 예산 → Storybook 빌드 → 이야기 누락
bun run check -- --layout --a11y   # 브라우저 검사까지(ds-browser 필요)
```
