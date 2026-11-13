import { useId } from 'react';
import { Icon } from '../Icon/Icon';
import { SpinnerRing } from '../../internal/SpinnerRing';
import styles from './SearchField.module.css';
import type { Handler } from '../../handler';

export interface SearchFieldProps {
  /** 입력 이름. 화면에는 보이지 않고 보조 기술이 읽는다. */
  label: string;
  value: string;
  onChange: Handler<[value: string]>;
  placeholder: string;
  loading?: boolean;
  /** 지우기 단추 이름. 예: "지우기". */
  clearLabel: string;
  onClear: Handler;
}

/** 장소 검색 입력. 값이 있으면 지우기 단추가 나온다. */
export function SearchField({ label, value, onChange, placeholder, loading = false, clearLabel, onClear }: SearchFieldProps) {
  const id = useId();
  return (
    <div className={styles.root}>
      <label className={styles.srLabel} htmlFor={id}>
        {label}
      </label>
      <span className={styles.lead}>
        <Icon name="search" />
      </span>
      <input
        id={id}
        className={styles.input}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        aria-busy={loading || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {loading ? (
        <span className={styles.trail}>
          <SpinnerRing size="sm" />
        </span>
      ) : value ? (
        <button className={styles.clear} type="button" aria-label={clearLabel} onClick={onClear}>
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
