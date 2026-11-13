import { useId } from 'react';
import styles from './TextField.module.css';
import type { Handler } from '../../handler';

export interface TextFieldProps {
  /** 입력 이름. 화면에 보인다. */
  label: string;
  value: string;
  onChange: Handler<[value: string]>;
  placeholder?: string;
  /** 글자 수 상한(코드 포인트). 넘게 쓸 수 없고, 상한의 90%부터 숫자가 나온다. */
  maxLength: number;
  disabled?: boolean;
}

/** 짧은 한 줄 글 입력(예: 만나기로 한 입구). 긴 요청은 TextComposer를 쓴다. */
export function TextField({ label, value, onChange, placeholder, maxLength, disabled = false }: TextFieldProps) {
  const id = useId();
  const count = Array.from(value).length;
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.box}>
        <input
          id={id}
          className={styles.input}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(Array.from(event.target.value).slice(0, maxLength).join(''))}
        />
        {count >= maxLength * 0.9 ? (
          <span className={styles.count}>
            {count}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
