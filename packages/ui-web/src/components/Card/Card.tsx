import type { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  tone?: 'default' | 'accent' | 'inverse' | 'sunken';
  padding: 16 | 24;
  /** 안쪽 직속 자식 사이 간격은 16 고정. */
  children?: ReactNode;
}

/** 내용을 묶는 면. accent·inverse에서는 안의 글자색이 면에 맞게 바뀐다. */
export function Card({ tone = 'default', padding, children }: CardProps) {
  return (
    <div className={styles.root} data-tone={tone} data-padding={padding}>
      {children}
    </div>
  );
}
