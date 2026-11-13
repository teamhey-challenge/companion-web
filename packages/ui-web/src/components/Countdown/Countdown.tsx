import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Countdown.module.css';
import type { Handler } from '../../handler';

export interface CountdownProps {
  /** 끝나는 시각(밀리초 epoch). */
  endsAt: number;
  /** 앞에 붙는 말. 예: "남은 시간". */
  label: string;
  onEnd?: Handler;
  /** 이야기·시험용 현재 시각 공급. 없으면 Date.now. */
  now?: () => number;
}

function format(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** mm:ss 남은 시간. 1초마다 갱신하고 끝나면 onEnd를 한 번 부른다. */
export function Countdown({ endsAt, label, onEnd, now = Date.now }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => endsAt - now());
  const ended = useRef(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    ended.current = false;
    const tick = () => {
      const left = endsAt - now();
      setRemaining(left);
      if (left <= 0 && !ended.current) {
        ended.current = true;
        onEndRef.current?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt, now]);

  return (
    <span className={styles.root} data-urgent={remaining <= 30_000 || undefined} role="timer">
      <Icon name="clock" />
      <span className={styles.label}>{label}</span>
      <span className={styles.time}>{format(remaining)}</span>
    </span>
  );
}
