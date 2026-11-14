import { useId } from 'react';
import styles from './CheckboxRow.module.css';
import type { Handler } from '../../handler';

export interface CheckboxRowProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  /** 맞지 않을 때 줄 아래에 붙는 문장. */
  error?: string;
  onChange: Handler<[checked: boolean]>;
}

/** 동의처럼 한 번 체크하는 줄. 줄 전체가 눌린다. */
export function CheckboxRow({ label, description, checked, disabled = false, error, onChange }: CheckboxRowProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const errorId = `${id}-error`;
  const describedBy = [description ? descId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={styles.wrap}>
      <label className={styles.root} data-disabled={disabled || undefined}>
        <input
          className={styles.input}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.box} aria-hidden="true">
          <svg className={styles.mark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {description ? (
            <span className={styles.description} id={descId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
