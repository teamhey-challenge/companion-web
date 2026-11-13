import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { TextComposer } from './TextComposer';

const render = (over: { value?: string; disabled?: boolean }) =>
  renderToStaticMarkup(
    <TextComposer label="말" value={over.value ?? '入口の近くで'} onChange={() => undefined} maxLength={100} onSend={() => undefined} sendLabel="보내기" disabled={over.disabled} />,
  );

const sendDisabled = (html: string) => /<button[^>]*aria-label="보내기"[^>]*disabled/.test(html);

describe('TextComposer 보내기 단추', () => {
  test('연결이 끊기면(disabled) 글은 남고 보내기만 막힌다 (눌러도 아무 일 없던 결함)', () => {
    const html = render({ disabled: true });
    expect(sendDisabled(html)).toBe(true);
    expect(html).toContain('入口の近くで');
    expect(html).not.toMatch(/<textarea[^>]*disabled/);
  });

  test('연결되어 있고 글이 있으면 보낼 수 있다', () => {
    expect(sendDisabled(render({}))).toBe(false);
  });

  test('빈 글은 막힌다', () => {
    expect(sendDisabled(render({ value: '  ' }))).toBe(true);
  });
});
