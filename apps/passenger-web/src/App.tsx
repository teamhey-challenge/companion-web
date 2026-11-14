import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, type Theme } from '@hey/ui-web';
import { entryFromPath } from './routes';
import { W1 } from './screens/W1/W1';
import { W2 } from './screens/W2/W2';
import { W3 } from './screens/W3/W3';
import { Privacy } from './screens/Privacy/Privacy';
import { API_BASE, createPhoneApi } from './transport/api';
import { createSession } from './transport/session';

/** 시스템 화면 모드(prefers-color-scheme)를 따른다(D-26). 바뀌면 바로 따라간다. */
function useSystemTheme(): Theme {
  const query = '(prefers-color-scheme: dark)';
  const [dark, setDark] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return dark ? 'dark' : 'light';
}

/** 앱 루트: 주소에서 화면을 고른다. 화면 이동은 전체 주소 이동이 아니라 history로 한다. */
export function App() {
  const theme = useSystemTheme();
  const api = useMemo(() => createPhoneApi(API_BASE), []);
  const session = useMemo(() => createSession(window.localStorage), []);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, '', to);
    setPath(to);
  }, []);
  const back = useCallback(() => window.history.back(), []);

  const entry = entryFromPath(path);
  return (
    <ThemeProvider theme={theme} lang="ko">
      {entry.kind === 'pair' ? <W1 pairCode={entry.code} api={api} session={session} navigate={navigate} /> : null}
      {entry.kind === 'none' ? <W1 pairCode={null} api={api} session={session} navigate={navigate} /> : null}
      {entry.kind === 'done' ? <W2 session={session} /> : null}
      {entry.kind === 'memory' ? <W3 api={api} session={session} onBack={back} /> : null}
      {entry.kind === 'privacy' ? <Privacy /> : null}
    </ThemeProvider>
  );
}
