import { useEffect, useRef } from 'react';
import styles from './Wordmark.module.css';

export interface WordmarkProps {
  /** 탑승 인원. 1이면 HEY, 2면 HEYY … 4면 HEYYYY. */
  partySize: 1 | 2 | 3 | 4;
  size: 'md' | 'lg';
  /** Y가 늘어날 때 살짝 늘어나는 움직임. 움직임 줄이기에서는 즉시. */
  animate?: boolean;
}

/** HEY 로고 글자. 일행 한 명마다 Y가 하나 늘어난다. */
export function Wordmark({ partySize, size, animate = true }: WordmarkProps) {
  // 늘어나는 움직임은 이 글자판이 떠 있는 동안 인원이 늘 때만 보인다. 화면이 바뀌어 새로 그려질 때는 곧바로 HEYY다.
  const shown = useRef(partySize);
  const grewFrom = partySize > shown.current ? shown.current - 1 : Number.POSITIVE_INFINITY;
  useEffect(() => {
    shown.current = partySize;
  }, [partySize]);
  const extra = Array.from({ length: partySize - 1 }, (_, i) => i);
  return (
    <span className={styles.root} data-size={size} role="img" aria-label="HEY">
      <span className={styles.letters} aria-hidden="true">
        <span>HE</span>
        <span>Y</span>
        {extra.map((i) => (
          <span key={i} className={styles.extra} data-animate={(animate && i >= grewFrom) || undefined}>
            <span className={styles.extraInner}>Y</span>
          </span>
        ))}
      </span>
    </span>
  );
}
