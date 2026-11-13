import { ThemeProvider } from '@hey/ui-web';
import { P0 } from './screens/P0/P0';
import { entryFromPath } from './routes';

/** 앱 루트: 주소에서 입구를 읽어 P0(QR 입장)에 넘긴다. */
export function App() {
  const entry = entryFromPath(window.location.pathname);
  return (
    <ThemeProvider theme="light" lang="ko">
      <P0 pairCode={entry.kind === 'pair' ? entry.code : null} />
    </ThemeProvider>
  );
}
