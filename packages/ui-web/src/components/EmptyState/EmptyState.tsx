import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  message?: string;
  /** 비어 있음에서 이어 갈 행동 하나. */
  action?: ReactNode;
  /** 화면 전체가 이 상태 하나일 때 true: 제목이 문서의 h1이 된다. 화면 안의 한 조각이면 생략(문단). */
  screen?: boolean;
}

/** 비어 있거나 찾지 못했을 때. 무슨 일인지와 다음 행동을 말한다. */
export function EmptyState({ icon, title, message, action, screen }: EmptyStateProps) {
  const Title = screen ? 'h1' : 'p';
  return (
    <div className={styles.root} data-screen={screen || undefined}>
      <span className={styles.icon}>
        <Icon name={icon} size="lg" />
      </span>
      <div className={styles.text}>
        <Title className={styles.title}>{title}</Title>
        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
