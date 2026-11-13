import { describe, expect, test } from 'bun:test';
import type { ButtonProps } from './components/Button/Button';
import type { Handler } from './handler';

describe('이벤트 핸들러는 함수를 돌려줄 수 없다', () => {
  test('Button: 핸들러가 함수를 돌려주면 컴파일되지 않는다(호출만 되고 실행되지 않는 버그)', () => {
    const base = { variant: 'primary', children: 'c' } satisfies Omit<ButtonProps, 'onClick'>;
    const run = () => undefined;
    const ok: ButtonProps = { ...base, onClick: () => void run() };
    // @ts-expect-error 함수를 돌려주는 핸들러: 호출만 되고 실행되지 않는 버그가 타입에서 막힌다
    const wrong: ButtonProps = { ...base, onClick: () => (base.children ? undefined : () => run()) };
    // @ts-expect-error Promise를 돌려주는 핸들러도 거부한다(`void`로 버리고 넘긴다)
    const promise: Handler = async () => undefined;
    expect([ok, wrong, promise].length).toBe(3);
  });
});
