import { Children, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './MessageList.module.css';

export interface MessageListProps {
  /** 목록의 접근성 이름. */
  label: string;
  /** 사용자가 위로 올려 둔 사이 새 글이 왔을 때 단추 이름. */
  newMessageLabel: string;
  children?: ReactNode;
}

/** 이 거리(스크롤 픽셀) 안이면 맨 아래에 있다고 본다. */
const BOTTOM_SLACK = 8;

/** 대화 목록. 맨 아래를 보고 있으면 새 글을 따라가고, 위로 올려 두었으면 자리를 지키며 "새 글" 단추를 보인다. */
export function MessageList({ label, newMessageLabel, children }: MessageListProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const lastCount = useRef(0);
  const [hasNew, setHasNew] = useState(false);
  const [cutTop, setCutTop] = useState(false);
  const count = Children.count(children);

  const toBottom = useCallback(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useLayoutEffect(() => {
    const grew = count > lastCount.current;
    const first = lastCount.current === 0;
    lastCount.current = count;
    if (!grew) return;
    if (first || atBottom.current) {
      toBottom();
      setCutTop((scroller.current?.scrollTop ?? 0) > 0);
    } else {
      setHasNew(true);
    }
  }, [count, toBottom]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_SLACK;
    setCutTop(el.scrollTop > 0);
    if (atBottom.current) setHasNew(false);
  };

  return (
    <div className={styles.root} data-cut-top={cutTop ? 'true' : undefined}>
      <div
        ref={scroller}
        className={styles.scroller}
        role="log"
        aria-live="polite"
        aria-label={label}
        tabIndex={0}
        onScroll={onScroll}
      >
        <div className={styles.items}>{children}</div>
      </div>
      {hasNew ? (
        <div className={styles.newWrap}>
          <Button
            variant="secondary"
            icon="chevron-down"
            onClick={() => {
              toBottom();
              atBottom.current = true;
              setHasNew(false);
            }}
          >
            {newMessageLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
