import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './Banner.module.css';

export interface BannerProps {
  tone: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  message: string;
  /** 보통 ghost Button 하나. */
  action?: ReactNode;
}

const ICONS: Record<BannerProps['tone'], IconName> = {
  info: 'info',
  warning: 'warning',
  danger: 'error',
  success: 'check',
};

/** 화면 안에서 알리는 띠. danger는 즉시 읽히고 나머지는 차분히 읽힌다. */
export function Banner({ tone, title, message, action }: BannerProps) {
  return (
    <div className={styles.root} data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className={styles.icon}>
        <Icon name={ICONS[tone]} />
      </span>
      <div className={styles.body}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <p className={styles.message}>{message}</p>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
    </div>
  );
}
