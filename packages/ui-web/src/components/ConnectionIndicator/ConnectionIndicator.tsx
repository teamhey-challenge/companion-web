import styles from './ConnectionIndicator.module.css';

export type ConnectionStatus = 'online' | 'reconnecting' | 'offline';

export interface ConnectionIndicatorProps {
  status: ConnectionStatus;
  labels: Record<ConnectionStatus, string>;
}

/** 서버 연결 상태 점과 글. */
export function ConnectionIndicator({ status, labels }: ConnectionIndicatorProps) {
  return (
    <span className={styles.root} data-status={status} role="status">
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{labels[status]}</span>
    </span>
  );
}
