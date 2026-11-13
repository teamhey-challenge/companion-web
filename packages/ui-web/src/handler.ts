/**
 * 모든 부품의 이벤트 핸들러 타입. 반환값은 `void`·`undefined`뿐이다.
 * `() => void`는 함수를 돌려줘도 컴파일되어 `onSelect={() => (x ? undefined : () => run())}` 같은
 * "아무 일도 하지 않는" 핸들러를 통과시켰다. 이 타입은 그런 반환(함수·Promise·값)을 거부한다.
 * 비동기 명령은 `() => void run()`처럼 버리고 넘긴다.
 */
export type Handler<A extends unknown[] = []> = (...args: A) => void | undefined;
