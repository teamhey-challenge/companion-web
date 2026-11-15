import { describe, expect, test } from 'bun:test';
import { ApiError, createPhoneApi } from './api';
import { createSession } from './session';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('createPhoneApi', () => {
  test('claim은 토큰 없이 record·memory를 POST한다', async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const api = createPhoneApi('/api', (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return Promise.resolve(json({ phoneToken: 'T', character: { name: 'n', bodyColor: 0 } }));
    });
    await api.claim('ABC', { record: true, memory: false });
    expect(calls[0]?.url).toBe('/api/v1/pairings/ABC/claim');
    expect(calls[0]?.init.method).toBe('POST');
    expect(calls[0]?.init.body).toBe('{"record":true,"memory":false}');
    expect((calls[0]?.init.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });

  test('기억 목록은 nextCursor를 끝까지 따라가고 폰 토큰을 보낸다', async () => {
    const urls: string[] = [];
    const api = createPhoneApi('/api', (url, init) => {
      urls.push(String(url));
      expect((init?.headers as Record<string, string>)['Authorization']).toBe('Bearer tok');
      return Promise.resolve(
        urls.length === 1
          ? json({ items: [{ id: 'a', kind: 'fact', text: 'x', createdAt: '' }], nextCursor: 'c1' })
          : json({ items: [{ id: 'b', kind: 'fact', text: 'y', createdAt: '' }], nextCursor: null }),
      );
    });
    const items = await api.listMemory('tok');
    expect(items.map((m) => m.id)).toEqual(['a', 'b']);
    expect(urls[1]).toContain('cursor=c1');
  });

  test('204는 본문 없이 성공, 4xx는 status를 담은 ApiError, 네트워크 실패는 status 0', async () => {
    const ok = createPhoneApi('/api', () => Promise.resolve(new Response(null, { status: 204 })));
    await expect(ok.deleteMemory('t', 'id')).resolves.toBeUndefined();
    const unauth = createPhoneApi('/api', () => Promise.resolve(json({}, 401)));
    await expect(unauth.deleteAllMemory('t')).rejects.toMatchObject({ status: 401 });
    const down = createPhoneApi('/api', () => Promise.reject(new TypeError('x')));
    const err = await down.getSettings('t').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(0);
  });
});

describe('createSession', () => {
  const memoryStore = () => {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
  };
  test('저장한 토큰을 돌려주고 clear하면 없다', () => {
    const s = createSession(memoryStore());
    expect(s.getToken()).toBeNull();
    s.save('T', { name: '헤이리', bodyColor: 1 });
    expect(s.getToken()).toBe('T');
    expect(s.getCharacter()).toEqual({ name: '헤이리', bodyColor: 1 });
    s.clear();
    expect(s.getToken()).toBeNull();
    expect(s.getCharacter()).toBeNull();
  });
  test('저장소가 던져도 토큰 없음으로 본다', () => {
    const s = createSession({ getItem: () => { throw new Error('blocked'); }, setItem: () => undefined, removeItem: () => { throw new Error('blocked'); } });
    expect(s.getToken()).toBeNull();
    expect(() => s.clear()).not.toThrow();
  });
});
