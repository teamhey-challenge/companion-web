import type { ReactNode } from 'react';
import styles from './ThemeProvider.module.css';

export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'ja' | 'zh-Hans' | 'zh-Hant' | 'vi' | 'th' | 'ko';

export interface ThemeProviderProps {
  theme: Theme;
  lang: Lang;
  children?: ReactNode;
}

/** 테마(색 세트)와 문서 언어를 하위 트리에 씌운다. 앱 루트에 하나. */
export function ThemeProvider({ theme, lang, children }: ThemeProviderProps) {
  return (
    <div className={styles.root} data-theme={theme} lang={lang}>
      {children}
    </div>
  );
}
