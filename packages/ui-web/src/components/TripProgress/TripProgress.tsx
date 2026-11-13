import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import styles from './TripProgress.module.css';

export interface TripProgressLabels {
  eta: string;
  distance: string;
  unitMin: string;
  unitKm: string;
  /** 값이 오래됐을 때 안내. */
  stale: string;
  /** 값이 하나도 없을 때 안내. */
  none: string;
}

interface FigureProps {
  label: string;
  value?: number;
  unit: string;
  none: string;
  stale: boolean;
}

function Figure({ label, value, unit, none, stale }: FigureProps) {
  return (
    <div className={styles.figure} data-stale={stale || undefined}>
      <Text variant="caption" tone="muted" as="span">
        {label}
      </Text>
      {value === undefined ? (
        <Text variant="label" tone="subtle" as="span">
          {none}
        </Text>
      ) : (
        <span className={styles.value}>
          <span className={styles.number}>
            <Text variant="title" as="span">
              {String(value)}
            </Text>
          </span>
          <Text variant="label" tone="muted" as="span">
            {unit}
          </Text>
        </span>
      )}
    </div>
  );
}

/**
 * 이동 중 남은 시간과 거리. 값이 없으면 `none`, 있으면 값이 하나 이상 있어야 하고
 * 오래됨(`stale`)은 값이 있을 때만 뜻이 있다.
 */
export type TripProgressProps =
  | { state: 'none'; labels: TripProgressLabels }
  | { state: 'eta'; etaMin: number; distanceKm?: number; stale: boolean; labels: TripProgressLabels }
  | { state: 'distance'; distanceKm: number; stale: boolean; labels: TripProgressLabels };

export function TripProgress(props: TripProgressProps) {
  const { labels } = props;
  if (props.state === 'none') {
    return (
      <div className={styles.root}>
        <Text variant="label" tone="muted">
          {labels.none}
        </Text>
      </div>
    );
  }
  const etaMin = props.state === 'eta' ? props.etaMin : undefined;
  const distanceKm = props.state === 'distance' || props.state === 'eta' ? props.distanceKm : undefined;
  const stale = props.stale;
  return (
    <div className={styles.root} data-stale={stale || undefined}>
      <div className={styles.figures}>
        <Figure label={labels.eta} value={etaMin} unit={labels.unitMin} none={labels.none} stale={stale} />
        <Figure label={labels.distance} value={distanceKm} unit={labels.unitKm} none={labels.none} stale={stale} />
      </div>
      {stale ? (
        <p className={styles.stale} role="status">
          <Icon name="warning" />
          <Text variant="caption" tone="muted" as="span">
            {labels.stale}
          </Text>
        </p>
      ) : null}
    </div>
  );
}
