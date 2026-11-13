import { Icon, type IconName } from '../Icon/Icon';
import styles from './KeyValueRow.module.css';

export interface KeyValueRowProps {
  label: string;
  value: string;
  icon?: IconName;
}

/** 이름과 값 한 줄. 값이 길면 아래로 내려 쓴다. */
export function KeyValueRow({ label, value, icon }: KeyValueRowProps) {
  return (
    <div className={styles.root}>
      {icon ? (
        <span className={styles.icon}>
          <Icon name={icon} />
        </span>
      ) : null}
      <dl className={styles.pair}>
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{value}</dd>
      </dl>
    </div>
  );
}
