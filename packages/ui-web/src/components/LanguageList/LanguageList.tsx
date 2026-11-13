import type { ReactNode } from 'react';
import styles from './LanguageList.module.css';

export interface LanguageListProps {
  /** 이 선택의 이름. 예: "언어". */
  label: string;
  /** LanguageOption들. */
  children: ReactNode;
}

/** 언어 줄 묶음. 한 번에 하나만 고른다. */
export function LanguageList({ label, children }: LanguageListProps) {
  return (
    <div className={styles.root} role="radiogroup" aria-label={label}>
      {children}
    </div>
  );
}
