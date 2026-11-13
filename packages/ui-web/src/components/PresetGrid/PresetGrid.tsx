import type { ReactNode } from 'react';
import styles from './PresetGrid.module.css';

export interface PresetGridProps {
  /** PresetTile들. 2열 고정. */
  children: ReactNode;
}

/** 프리셋 칸을 2열로 늘어놓는다. */
export function PresetGrid({ children }: PresetGridProps) {
  return <div className={styles.root}>{children}</div>;
}
