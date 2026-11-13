# @hey/ui-web

HEY 승객 웹의 디자인 시스템이에요. 승객 웹 화면은 이 패키지의 부품만으로 조립해요. 계약은 `docs/architecture.md` 4절, 부품 목록은 `docs/components.md` 2절이에요.

## 규칙 (예외 없음)

1. 부품은 `className`과 `style`을 받지 않아요. 이 규칙은 린트가 아니라 타입으로 지켜요. Props 인터페이스에 `className`·`style`을 넣지 않으면 호출하는 쪽이 넘길 수가 없어요. 변형이 필요하면 이름 있는 prop(`variant`, `tone`, `size`)을 추가해요.
2. 부품 CSS에는 색과 길이 값이 없어요. `var(--hey-*)`만 써요(`0`, `100%`, `auto`, `1fr`, `currentColor`는 허용). `node scripts/check-css.mjs`가 0을 보고해야 해요.
3. 간격은 4·8·16·24·32만 써요(`--hey-space-*`). 부품은 바깥 여백·폭·위치를 갖지 않고, 직속 자식 사이 간격은 부모 컨테이너(`Stack`, `Inline`, `Section`)가 `gap`으로 정해요.
4. 누를 수 있는 면은 44px 이상이에요(`--hey-size-touch-web`).
5. 누를 수 있는 요소는 겹치지 않아요. 이동하는 단추는 `Button`의 `href`로 그려요. 링크 안에 단추를 넣지 않아요.
6. 모든 글자는 `Text`로 그려요. 문구는 문자열 prop으로 받고, 호출하는 화면이 `t()`로 만든 값만 넘겨요. 부품 안에 UI 문구를 적지 않아요(보조 기술 이름은 prop으로 받아요).
7. 움직임은 `prefers-reduced-motion: reduce`에서 0초 또는 없음이에요.
8. 휴대폰 하단 시트는 `BottomSheet` 하나가 가져요. 막 32%, 반경 24, 손잡이 32×4, 위 64 띄움, 최대 폭 640, 초점 가둠, 뒤 페이지 inert, Esc 한 겹씩, 초점 복귀를 이 부품이 소유해요. `Dialog`는 같은 겹침 규약(`src/internal/useModalLayer.ts`)을 써요.

## 부품 추가하는 법

1. `docs/components.md` 2절에 부품이 없으면 먼저 거기에 적어요.
2. `src/components/<Name>/` 폴더에 세 파일을 만들어요.
   - `<Name>.tsx`: 부품. Props 인터페이스를 내보내요.
   - `<Name>.module.css`: 스타일. 상태는 `data-*` 속성으로 고르고, 색·길이는 `var(--hey-*)`만 써요.
   - `<Name>.stories.tsx`: 이야기. 제목은 `웹 부품/<구분>/<Name>`이에요.
3. 이야기는 아래 상황을 모두 덮어요.
   - 기본, 긴 글(띄어쓰기 없는 일본어·중국어 120자 이상, 긴 한국어), 빈 값, 항목 0·1·많음, 비활성, 오류, 로딩.
   - 부품 하나당 `All states` 이야기가 있고, 변형과 상태를 한 화면에 격자로 놓아요(`src/internal/showcase.tsx`의 `Case`, `CaseGrid`).
   - 라이트·다크는 Storybook 위 도구 줄의 테마로 바꿔 봐요.
   - 동작이 있는 부품은 `play` 함수로 상호작용을 시험해요.
4. `src/index.ts`에 내보내요.
5. 확인해요.
   ```
   bunx tsc --noEmit -p packages/ui-web
   node scripts/check-css.mjs
   bun run lint
   nice -n 19 bun run sb:build
   ```
6. 화면에서 쓰기 전에 Storybook에서 모든 이야기를 직접 눈으로 확인해요. 화면에서 깨진 것은 화면에서 덧칠하지 않고 부품으로 돌아와 고쳐요.

## 내부 도우미

`src/internal/`은 이 패키지 안에서만 써요. `index.ts`로 내보내지 않아요.

- `useModalLayer`, `Portal`: 겹침의 접근성 계약.
- `SpinnerRing`: 글 없는 돌아가는 고리.
- `showcase`: 이야기 전용 칸 배치와 긴 예시 글.

## 실행

- Storybook: 루트에서 `bun run sb` (포트 6106), 정적 빌드는 `bun run sb:build`. 차량 화면은 `HEY_CAR_DIR`(기본 `../hey-car`)의 Paparazzi PNG에서 만들고, 없으면 안내 페이지만 나와요.
- 토큰은 `shared/`(hey-shared)에서 바꾸고, 거기서 `bun run tokens`로 `dist`를 다시 만든 뒤 새 태그를 서브모듈에 올려요.
