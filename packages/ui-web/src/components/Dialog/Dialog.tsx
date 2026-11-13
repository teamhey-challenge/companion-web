import { useId, useRef } from 'react';
import { Portal } from '../../internal/Portal';
import { useModalLayer } from '../../internal/useModalLayer';
import { Button } from '../Button/Button';
import styles from './Dialog.module.css';
import type { Handler } from '../../handler';

export interface DialogProps {
  open: boolean;
  title: string;
  message: string;
  /** 확인 단추 글. 동사로: "운행 끝내기". */
  confirm: string;
  /** 취소 단추 글. */
  cancel: string;
  tone?: 'default' | 'danger';
  onConfirm: Handler;
  /** 취소 단추와 Esc가 부른다. */
  onCancel: Handler;
}

/** 확인 대화상자. 시트와 같은 접근성 계약(초점 가둠·inert·Esc·초점 복귀)을 가진다. */
export function Dialog({ open, title, message, confirm, cancel, tone = 'default', onConfirm, onCancel }: DialogProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  useModalLayer(open, hostRef, panelRef, onCancel);

  if (!open) return null;

  return (
    <Portal hostRef={hostRef}>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.positioner}>
        <div
          ref={panelRef}
          className={styles.panel}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={messageId}
          tabIndex={-1}
        >
          <div className={styles.text}>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            <p className={styles.message} id={messageId}>
              {message}
            </p>
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onCancel}>
              {cancel}
            </Button>
            <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirm}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
