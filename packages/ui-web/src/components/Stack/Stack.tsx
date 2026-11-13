import { Children, type ReactNode } from 'react';
import styles from './Stack.module.css';

export type Gap = 4 | 8 | 16 | 24 | 32;

export interface StackProps {
  gap: Gap;
  align?: 'stretch' | 'start' | 'center';
  as?: 'div' | 'section' | 'ul' | 'ol';
  children?: ReactNode;
}

/** 세로 배치. 직속 자식 사이 간격을 한 번에 정한다. ul·ol이면 자식을 li로 감싼다. */
export function Stack({ gap, align = 'stretch', as: Tag = 'div', children }: StackProps) {
  const list = Tag === 'ul' || Tag === 'ol';
  return (
    <Tag className={styles.root} data-gap={gap} data-align={align} data-list={list || undefined}>
      {list ? Children.toArray(children).map((child, i) => <li key={i}>{child}</li>) : children}
    </Tag>
  );
}
