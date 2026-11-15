import type { MemoryItem, Settings } from '@darren-pleos-challenge/hey-protocol';
import { ApiError, type PhoneApi } from '../transport/api';
import { createSession, type Session } from '../transport/session';

/** 이야기·시험 전용 가짜 서버와 세션. 화면 코드는 이것을 모른다. */
export const SAMPLE_MEMORY: MemoryItem[] = [
  { id: 'm1', kind: 'fact', text: '비 오는 날, 잔잔한 음악을 좋아해요.', createdAt: '2026-11-13T09:00:00+09:00' },
  { id: 'm2', kind: 'fact', text: '퇴근길에는 조용한 대화를 좋아해요.', createdAt: '2026-11-12T09:00:00+09:00' },
  { id: 'm3', kind: 'summary', text: '금요일에 중요한 발표가 있어요.', createdAt: '2026-11-11T09:00:00+09:00' },
];

const SETTINGS: Settings = { proactive: 'normal', memoryEnabled: true, speech: 'banmal', nickname: null };
const never = <T>() => new Promise<T>(() => undefined);

export function fakeApi(over: Partial<PhoneApi> = {}): PhoneApi {
  return {
    getPairing: () => Promise.resolve({ status: 'pending', character: { name: '헤이리', bodyColor: 0 } }),
    claim: () => Promise.resolve({ phoneToken: 'fake', character: { name: '헤이리', bodyColor: 0 } }),
    listMemory: () => Promise.resolve(SAMPLE_MEMORY),
    deleteMemory: () => Promise.resolve(),
    deleteAllMemory: () => Promise.resolve(),
    getSettings: () => Promise.resolve(SETTINGS),
    patchSettings: (_t, patch) => Promise.resolve({ ...SETTINGS, ...patch }),
    ...over,
  };
}

export const pending = never;
export const failing = (status = 500) => () => Promise.reject(new ApiError(status, 'fail'));

export function memorySession(token: string | null): Session {
  const data = new Map<string, string>();
  const s = createSession({
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  });
  if (token) s.save(token, { name: '헤이리', bodyColor: 0 });
  return s;
}
