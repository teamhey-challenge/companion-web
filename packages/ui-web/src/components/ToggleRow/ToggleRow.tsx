import { useId } from 'react';
import styles from './ToggleRow.module.css';
import type { Handler } from '../../handler';

export interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: Handler<[checked: boolean]>;
}

/** 켜고 끄는 설정 한 줄. 줄 전체가 눌린다. */
export function ToggleRow({ label, description, checked, disabled = false, onChange }: ToggleRowProps) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <label className={styles.root} data-disabled={disabled || undefined}>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description ? (
          <span className={styles.description} id={descId}>
            {description}
          </span>
        ) : null}
      </span>
      <input
        className={styles.input}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-describedby={description ? descId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
