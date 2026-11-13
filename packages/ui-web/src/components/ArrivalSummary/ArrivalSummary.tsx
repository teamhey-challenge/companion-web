import { Card } from '../Card/Card';
import { ConditionSummary, asConditionItems, type ConditionItem } from '../ConditionSummary/ConditionSummary';
import { Divider } from '../Divider/Divider';
import { Icon } from '../Icon/Icon';
import { KeyValueRow } from '../KeyValueRow/KeyValueRow';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import { Text } from '../Text/Text';
import styles from './ArrivalSummary.module.css';

/** 소요 시간과 거리. 둘 다 없으면 `none`이라 빈 통계 줄이 그려지지 않는다. */
export type ArrivalStats =
  | { state: 'none' }
  | { state: 'time'; duration: { label: string; value: string }; distance?: { label: string; value: string } }
  | { state: 'distance'; distance: { label: string; value: string }; duration?: { label: string; value: string } };

export interface ArrivalSummaryProps {
  /** 합의된 내릴 곳. */
  dropoff: { heading: string; label: string };
  /** `dropoff.label`의 언어. 승객 언어다. */
  lang: Lang;
  stats: ArrivalStats;
  conditions: ConditionItem[];
  /** 도착 뒤 알림 문장들. */
  notes: string[];
}

/** 도착 요약: 합의한 내릴 곳이 가장 크고, 소요 시간·거리·조건·알림이 뒤따른다. */
export function ArrivalSummary({ dropoff, lang, stats, conditions, notes }: ArrivalSummaryProps) {
  const duration = stats.state === 'none' ? undefined : stats.duration;
  const distance = stats.state === 'none' ? undefined : stats.distance;
  const hasStats = stats.state !== 'none';
  const conditionList = asConditionItems(conditions);
  const hasMore = conditionList !== null || notes.length > 0;
  return (
    <Card padding={24}>
      <div className={styles.focus}>
        <span className={styles.flag}>
          <Icon name="flag" />
        </span>
        <div className={styles.focusBody}>
          <Text variant="caption" tone="muted">
            {dropoff.heading}
          </Text>
          <Text variant="title" as="h2" lang={lang}>
            {dropoff.label}
          </Text>
        </div>
      </div>
      {hasStats ? (
        <>
          <Divider />
          <div className={styles.stats}>
            {duration ? <KeyValueRow icon="clock" label={duration.label} value={duration.value} /> : null}
            {distance ? <KeyValueRow icon="route" label={distance.label} value={distance.value} /> : null}
          </div>
        </>
      ) : null}
      {hasMore ? <Divider /> : null}
      {conditionList ? <ConditionSummary label={dropoff.heading} items={conditionList} /> : null}
      {notes.length > 0 ? (
        <ul className={styles.notes}>
          {notes.map((note, i) => (
            <li key={i} className={styles.note}>
              <span className={styles.noteIcon}>
                <Icon name="info" />
              </span>
              <Text variant="caption" tone="muted" as="span">
                {note}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
