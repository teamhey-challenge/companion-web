import type { ReactNode } from 'react';
import { Text } from '../Text/Text';
import styles from './Section.module.css';

export interface SectionProps {
  title?: string;
  /** 제목 오른쪽 동작. 보통 ghost Button 하나. */
  action?: ReactNode;
  /** 본문 직속 자식 사이 간격은 24 고정(블록 간격은 앱 전체에서 하나). */
  children?: ReactNode;
}

/** 제목 줄과 내용 묶음. */
export function Section({ title, action, children }: SectionProps) {
  return (
    <section className={styles.root}>
      {title || action ? (
        <div className={styles.head}>
          {title ? (
            <Text variant="bodyStrong" as="h2">
              {title}
            </Text>
          ) : null}
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
      ) : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
