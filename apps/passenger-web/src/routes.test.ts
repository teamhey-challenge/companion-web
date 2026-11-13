import { describe, expect, test } from 'bun:test';
import { entryFromPath } from './routes';

describe('entryFromPath', () => {
  test('/p/:pairCode는 pair 입구다', () => {
    expect(entryFromPath('/p/7KQ4M9XT')).toEqual({ kind: 'pair', code: '7KQ4M9XT' });
    expect(entryFromPath('/p/7KQ4M9XT/')).toEqual({ kind: 'pair', code: '7KQ4M9XT' });
  });
  test('코드가 없거나 모양이 다르면 입구가 없다', () => {
    expect(entryFromPath('/')).toEqual({ kind: 'none' });
    expect(entryFromPath('/p/')).toEqual({ kind: 'none' });
    expect(entryFromPath('/p/ab-cd')).toEqual({ kind: 'none' });
    expect(entryFromPath('/p/ABC/extra')).toEqual({ kind: 'none' });
    expect(entryFromPath('/c/ABC')).toEqual({ kind: 'none' });
  });
  test('/p/done은 입구가 아니다', () => {
    expect(entryFromPath('/p/done')).toEqual({ kind: 'none' });
  });
});
