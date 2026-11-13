import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import styles from './TollNotice.module.css';

export interface TollNoticeLabels {
  title: string;
  /** 통행료 안내(요금 문구는 화면이 이미 채워 넘긴다). */
  has: string;
  note: string;
}

export interface TollNoticeProps {
  labels: TollNoticeLabels;
}

/** 경로에 통행료가 있을 때만 그리는 띠. 통행료가 없으면 화면이 이 부품을 그리지 않는다(Q13). */
export function TollNotice({ labels }: TollNoticeProps) {
  return (
    <div className={styles.root} data-toll role="status">
      <span className={styles.icon}>
        <Icon name="toll" />
      </span>
      <div className={styles.body}>
        <Text variant="bodyStrong">{labels.title}</Text>
        <Text variant="label">{labels.has}</Text>
        <Text variant="caption" tone="muted">
          {labels.note}
        </Text>
      </div>
    </div>
  );
}
