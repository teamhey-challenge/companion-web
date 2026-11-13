import { useEffect, useRef } from 'react';
import { Portal } from '../../internal/Portal';
import { Icon } from '../Icon/Icon';
import styles from './Toast.module.css';
import type { Handler } from '../../handler';

export interface ToastProps {
  /** 보이는 동안 true. 4초 뒤 onDismiss가 불린다. */
  open: boolean;
  message: string;
  tone?: 'default' | 'success' | 'danger';
  onDismiss: Handler;
}

const VISIBLE_MS = 4000;

/** 아래에 잠깐 뜨는 알림. 초점을 가져가지 않고 뒤 페이지를 막지 않는다. */
export function Toast({ open, message, tone = 'default', onDismiss }: ToastProps) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => dismissRef.current(), VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [open, message]);

  if (!open) return null;

  return (
    <Portal hostRef={() => undefined}>
      <div className={styles.positioner}>
        <div className={styles.root} data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
          {tone === 'success' ? <Icon name="check" /> : tone === 'danger' ? <Icon name="error" /> : null}
          <span className={styles.message}>{message}</span>
        </div>
      </div>
    </Portal>
  );
}
