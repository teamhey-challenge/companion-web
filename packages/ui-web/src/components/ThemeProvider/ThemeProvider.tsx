import type { ReactNode } from 'react';
import styles from './ThemeProvider.module.css';

export type Theme = 'light' | 'dark';

export interface ThemeProviderProps {
  theme: Theme;
  children?: ReactNode;
}

/** 테마(색 세트)와 문서 언어(한국어)를 하위 트리에 씌운다. 앱 루트에 하나. */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <div className={styles.root} data-theme={theme} lang="ko">
      {children}
    </div>
  );
}
