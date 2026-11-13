import { Icon } from '../Icon/Icon';
import { Wordmark } from '../Wordmark/Wordmark';
import styles from './PartySizePicker.module.css';
import type { Handler } from '../../handler';

export type PartySize = 1 | 2 | 3 | 4;

export interface PartySizePickerProps {
  value: PartySize;
  onChange: Handler<[value: PartySize]>;
  /** 그룹 이름. 예: "탑승 인원". */
  label: string;
  /** 줄이기 단추 이름. 예: "한 명 줄이기". */
  decreaseLabel: string;
  /** 늘리기 단추 이름. 예: "한 명 늘리기". */
  increaseLabel: string;
  /** 숫자 뒤에 붙는 말. 예: "명". */
  unit: string;
}

/** 탑승 인원 1~4. 늘리면 아래 HEY의 Y도 함께 늘어난다. */
export function PartySizePicker({ value, onChange, label, decreaseLabel, increaseLabel, unit }: PartySizePickerProps) {
  const dec = (value - 1) as number;
  const inc = (value + 1) as number;
  return (
    <div className={styles.root} role="group" aria-label={label}>
      <div className={styles.preview}>
        <Wordmark partySize={value} size="lg" />
      </div>
      <div className={styles.controls}>
        <button
          className={styles.step}
          type="button"
          aria-label={decreaseLabel}
          disabled={value <= 1}
          onClick={() => onChange(dec as PartySize)}
        >
          <Icon name="minus" />
        </button>
        <output className={styles.value} aria-live="polite">
          <span className={styles.number}>{value}</span>
          <span className={styles.unit}>{unit}</span>
        </output>
        <button
          className={styles.step}
          type="button"
          aria-label={increaseLabel}
          disabled={value >= 4}
          onClick={() => onChange(inc as PartySize)}
        >
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}
