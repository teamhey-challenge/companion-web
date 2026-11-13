import { ThemeProvider } from '@hey/ui-web';
import { W1 } from './screens/W1/W1';
import { entryFromPath } from './routes';

/** 앱 루트: 주소에서 입구를 읽어 W1(QR 입장)에 넘긴다. */
export function App() {
  const entry = entryFromPath(window.location.pathname);
  return (
    <ThemeProvider theme="light" lang="ko">
      <W1 pairCode={entry.kind === 'pair' ? entry.code : null} />
    </ThemeProvider>
  );
}
