import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps {
  children: ReactNode;
  /** 글이 제목일 때 h1. 숨김 스타일은 이 요소 자신에게 걸려야 안쪽이 잘려 보인다. */
  as?: 'span' | 'h1';
}

/** 화면에는 보이지 않고 보조 기술에만 읽히는 글. */
export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return <Tag className={styles.root}>{children}</Tag>;
}
