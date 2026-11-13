import { Icon, type IconName } from '../Icon/Icon';
import styles from './StatusPill.module.css';

export interface StatusPillProps {
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';
  label: string;
  icon?: IconName;
}

/** 상태 한 마디. 색만으로 뜻을 전하지 않도록 글이 항상 있다. */
export function StatusPill({ tone, label, icon }: StatusPillProps) {
  return (
    <span className={styles.root} data-tone={tone}>
      {icon ? <Icon name={icon} /> : null}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
