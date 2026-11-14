/** 폰 웹의 입구. `/p/:pairCode`(W1), `/p/done`(W2), `/me/memory`(W3), `/privacy`(처리방침 안내). */
export type Entry =
  | { kind: 'pair'; code: string }
  | { kind: 'done' }
  | { kind: 'memory' }
  | { kind: 'privacy' }
  | { kind: 'none' };

export const PATHS = { done: '/p/done', memory: '/me/memory', privacy: '/privacy' } as const;

export function entryFromPath(pathname: string): Entry {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  if (trimmed === PATHS.done) return { kind: 'done' };
  if (trimmed === PATHS.memory) return { kind: 'memory' };
  if (trimmed === PATHS.privacy) return { kind: 'privacy' };
  const code = /^\/p\/([A-Za-z0-9]+)$/.exec(trimmed)?.[1];
  if (!code) return { kind: 'none' };
  return { kind: 'pair', code };
}
