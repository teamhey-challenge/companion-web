import type { ReactNode } from 'react';

export const ICON_NAMES = [
  'arrow-left', 'arrow-right', 'check', 'close', 'chevron-down', 'chevron-right', 'search', 'clock',
  'speaker', 'message', 'send', 'user', 'users', 'menu', 'info', 'warning', 'error', 'refresh',
  'qr', 'plus', 'minus', 'link', 'logout', 'music', 'quiet', 'trash', 'mic', 'book',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** 24 격자, 선 1.75, 둥근 끝. 한 벌의 선 아이콘. */
export const ICON_SHAPES: Record<IconName, ReactNode> = {
  'arrow-left': <path d="M19 12H5m6-6-6 6 6 6" />,
  'arrow-right': <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6m2.500-8.500a7.500 7.500 0 0 1 0 11" />
    </>
  ),
  message: <path d="M5 5h14a1.500 1.500 0 0 1 1.500 1.500v9A1.500 1.500 0 0 1 19 17h-8l-4.500 3.500V17H5a1.500 1.500 0 0 1-1.500-1.500v-9A1.500 1.500 0 0 1 5 5Z" />,
  send: <path d="M20.500 3.500 10.500 13.500M20.500 3.500l-6.500 17-3.500-7-7-3.500 17-6.500Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.500" />
      <path d="M5 20c.5-3.700 3.200-5.500 7-5.500s6.500 1.800 7 5.500" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.500" r="3" />
      <path d="M3.500 19.500c.4-3.200 2.600-5 5.500-5s5.100 1.800 5.500 5" />
      <path d="M15.500 5.700a3 3 0 0 1 0 5.600m1.500 3.400c2.100.4 3.300 2.200 3.500 4.800" />
    </>
  ),
  menu: <path d="M4.500 7h15m-15 5h15m-15 5h15" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M12 11v5.500M12 7.700v.01" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 21 19.500H3L12 4Z" />
      <path d="M12 10v4.500m0 2.500v.01" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="m9 9 6 6m0-6-6 6" />
    </>
  ),
  refresh: <path d="M19.500 12a7.500 7.500 0 1 1-2.200-5.300M19.500 4.500v4h-4" />,
  qr: (
    <>
      <rect x="4" y="4" width="6.500" height="6.500" rx="1" />
      <rect x="13.500" y="4" width="6.500" height="6.500" rx="1" />
      <rect x="4" y="13.500" width="6.500" height="6.500" rx="1" />
      <path d="M13.500 13.500h2.500v2.500m4-2.500v.01M13.500 20h.01M16 20h4v-2.500" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  link: <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />,
  logout: <path d="M10 4.500H6.500A1.500 1.500 0 0 0 5 6v12a1.500 1.500 0 0 0 1.500 1.500H10M15 8l4 4-4 4m4-4H9.500" />,
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.500" cy="18" r="2.500" />
      <circle cx="16.500" cy="16" r="2.500" />
    </>
  ),
  quiet: (
    <>
      <path d="M4 9.500v5h3.500l4.500 4v-13l-4.500 4Z" />
      <path d="m16 9.500 5 5m0-5-5 5" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5.5m4-5.5v5.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.500" width="6" height="11" rx="3" />
      <path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v2.500" />
    </>
  ),
  book: (
    <>
      <path d="M6 4.500h11.500v15H7.500A1.500 1.500 0 0 1 6 18Z" />
      <path d="M6 18a1.500 1.500 0 0 1 1.500-1.500h10M10 4.500v6l1.500-1 1.500 1v-6" />
    </>
  ),
};
