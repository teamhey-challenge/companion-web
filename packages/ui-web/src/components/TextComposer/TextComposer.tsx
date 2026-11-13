import { useId } from 'react';
import { Icon } from '../Icon/Icon';
import { SpinnerRing } from '../../internal/SpinnerRing';
import styles from './TextComposer.module.css';
import type { Handler } from '../../handler';

export interface TextComposerProps {
  /** 입력 이름. 예: "기사님께 보낼 말". */
  label: string;
  value: string;
  onChange: Handler<[value: string]>;
  placeholder?: string;
  /** 글자 수 상한. 넘기면 보내기가 막히고 숫자가 빨갛게 변한다. */
  maxLength: number;
  onSend: Handler;
  /** 보내기 단추 이름. 예: "보내기". */
  sendLabel: string;
  sending?: boolean;
  /** 지금은 보낼 수 없다(연결 끊김). 글은 그대로 남고 보내기만 막힌다. */
  disabled?: boolean;
  /** 이 입력에 붙는 오류 문장. */
  error?: string;
}

/** 직접 쓰는 요청 입력. 글자 수를 보여 주고 상한을 넘기면 보내기를 막는다. */
export function TextComposer({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  onSend,
  sendLabel,
  sending = false,
  disabled = false,
  error,
}: TextComposerProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const count = Array.from(value).length;
  const over = count > maxLength;
  const empty = value.trim().length === 0;
  const blocked = empty || over || sending || disabled;
  const near = !over && count >= maxLength * 0.9;

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.box} data-error={error || over ? true : undefined}>
        <textarea
          id={id}
          className={styles.input}
          rows={3}
          value={value}
          placeholder={placeholder}
          aria-invalid={error || over ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={sending}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className={styles.bar}>
          <span className={styles.count} data-state={over ? 'over' : near ? 'near' : undefined}>
            {count}/{maxLength}
          </span>
          <button className={styles.send} type="button" aria-label={sendLabel} disabled={blocked} onClick={onSend}>
            {sending ? <SpinnerRing size="sm" /> : <Icon name="send" />}
          </button>
        </div>
      </div>
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          <Icon name="error" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
