import type {
  ClaimRequest,
  ClaimResponse,
  MemoryListResponse,
  PublicPairingResponse,
  Settings,
  SettingsPatch,
  MemoryItem,
} from '@teamhey/hey-protocol';

/** 서버 요청이 실패했다. status 0은 네트워크 실패. */
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface PhoneApi {
  getPairing(code: string): Promise<PublicPairingResponse>;
  claim(code: string, body: ClaimRequest): Promise<ClaimResponse>;
  listMemory(token: string): Promise<MemoryItem[]>;
  deleteMemory(token: string, id: string): Promise<void>;
  deleteAllMemory(token: string): Promise<void>;
  getSettings(token: string): Promise<Settings>;
  patchSettings(token: string, patch: SettingsPatch): Promise<Settings>;
}

/** 전체 목록을 받으려고 따라가는 페이지 수의 상한. 서버가 끝없이 cursor를 주는 경우를 끊는다. */
const MAX_PAGES = 50;
/** 요청 함수 모양. 시험에서 가짜로 바꾼다. */
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

/** 폰 웹이 쓰는 서버 요청. `base`는 공개 주소의 `/api`. */
export function createPhoneApi(base: string, fetchImpl: FetchLike = (url, init) => fetch(url, init)): PhoneApi {
  async function request<T>(method: string, path: string, opts: { token?: string; body?: unknown } = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    let res: Response;
    try {
      res = await fetchImpl(`${base}${path}`, {
        method,
        headers,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      });
    } catch {
      throw new ApiError(0, 'network');
    }
    if (!res.ok) throw new ApiError(res.status, `${method} ${path} ${res.status}`);
    if (res.status === 204) return undefined as T;
    try {
      return (await res.json()) as T;
    } catch {
      throw new ApiError(res.status, 'bad json');
    }
  }

  return {
    getPairing: (code) => request('GET', `/v1/pairings/${encodeURIComponent(code)}`),
    claim: (code, body) => request('POST', `/v1/pairings/${encodeURIComponent(code)}/claim`, { body }),
    async listMemory(token) {
      const items: MemoryItem[] = [];
      let cursor: string | null = null;
      for (let page = 0; page < MAX_PAGES; page++) {
        const query: string = cursor ? `?limit=100&cursor=${encodeURIComponent(cursor)}` : '?limit=100';
        const res: MemoryListResponse = await request('GET', `/v1/memory${query}`, { token });
        items.push(...res.items);
        if (!res.nextCursor) break;
        cursor = res.nextCursor;
      }
      return items;
    },
    deleteMemory: (token, id) => request('DELETE', `/v1/memory/${encodeURIComponent(id)}`, { token }),
    deleteAllMemory: (token) => request('DELETE', '/v1/memory', { token }),
    getSettings: (token) => request('GET', '/v1/settings', { token }),
    patchSettings: (token, patch) => request('PATCH', '/v1/settings', { token, body: patch }),
  };
}

export const API_BASE: string = (import.meta.env['VITE_API_BASE'] as string | undefined) ?? '/api';
