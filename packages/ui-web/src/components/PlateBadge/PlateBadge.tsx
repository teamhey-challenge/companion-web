import styles from './PlateBadge.module.css';

export interface PlateBadgeProps {
  /** 차량 번호 뒤 4자리. */
  plateSuffix: string;
}

/** 차량 번호 뒤 4자리. 승객이 맞는 차인지 확인하는 용도. */
export function PlateBadge({ plateSuffix }: PlateBadgeProps) {
  return (
    <span className={styles.root}>
      <span className={styles.dots} aria-hidden="true" />
      <span className={styles.digits}>{plateSuffix}</span>
    </span>
  );
}
