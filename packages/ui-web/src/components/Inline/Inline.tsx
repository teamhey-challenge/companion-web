import type { ReactNode } from 'react';
import type { Gap } from '../Stack/Stack';
import styles from './Inline.module.css';

export interface InlineProps {
  gap: Gap;
  wrap?: boolean;
  justify?: 'start' | 'between' | 'end' | 'center';
  align?: 'center' | 'start' | 'end' | 'stretch';
  children?: ReactNode;
}

/** 가로 배치. 직속 자식 사이 간격을 한 번에 정한다. */
export function Inline({ gap, wrap = false, justify = 'start', align = 'center', children }: InlineProps) {
  return (
    <div className={styles.root} data-gap={gap} data-wrap={wrap || undefined} data-justify={justify} data-align={align}>
      {children}
    </div>
  );
}
