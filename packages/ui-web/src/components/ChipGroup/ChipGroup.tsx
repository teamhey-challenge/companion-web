import type { ReactNode } from 'react';
import styles from './ChipGroup.module.css';

export interface ChipGroupProps {
  /** 이 묶음의 이름. 예: "원하는 조건". */
  label: string;
  /** ChoiceChip들. */
  children: ReactNode;
}

/** 칩 묶음. 넘치면 줄바꿈한다. */
export function ChipGroup({ label, children }: ChipGroupProps) {
  return (
    <div className={styles.root} role="group" aria-label={label}>
      {children}
    </div>
  );
}
