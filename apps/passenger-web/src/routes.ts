/** 폰 웹의 입구. `/p/:pairCode`만 P0(QR 입장, PRD W1)로 열린다. `/p/done`은 W2 자리라 입구가 아니다. */
export type Entry = { kind: 'pair'; code: string } | { kind: 'none' };

export function entryFromPath(pathname: string): Entry {
  const code = /^\/p\/([A-Za-z0-9]+)\/?$/.exec(pathname)?.[1];
  if (!code || code === 'done') return { kind: 'none' };
  return { kind: 'pair', code };
}
