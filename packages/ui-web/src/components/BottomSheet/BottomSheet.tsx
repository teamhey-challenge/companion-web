import { useId, useRef, type ReactNode } from 'react';
import { Portal } from '../../internal/Portal';
import { useModalLayer } from '../../internal/useModalLayer';
import { IconButton } from '../IconButton/IconButton';
import styles from './BottomSheet.module.css';
import type { Handler } from '../../handler';

export interface BottomSheetProps {
  open: boolean;
  onClose: Handler;
  title: string;
  /** 닫기 단추 이름. 예: "닫기". dismissible이 false면 쓰이지 않는다. */
  closeLabel: string;
  /** 고정 행동 막대. 본문이 길어도 항상 보인다. */
  footer?: ReactNode;
  /** false면 Esc·막 누르기·닫기 단추가 모두 막힌다(응답이 필요한 시트). */
  dismissible?: boolean;
  children?: ReactNode;
}

/**
 * 휴대폰 하단 시트. 모든 규약을 이 부품이 가진다.
 * 검정 32% 막, 위 모서리 반경 24, 손잡이 32×4, 위쪽 64 띄움, 최대 폭 640,
 * 초점 가둠, 뒤 페이지 inert, Esc는 한 겹씩, 닫으면 연 요소로 초점 복귀, 움직임 줄이기에서 0초.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  footer,
  dismissible = true,
  children,
}: BottomSheetProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useModalLayer(open, hostRef, panelRef, () => {
    if (dismissible) onClose();
  });

  if (!open) return null;

  return (
    <Portal hostRef={hostRef}>
      <div className={styles.scrim} onClick={dismissible ? onClose : undefined} aria-hidden="true" />
      <div className={styles.positioner}>
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <div className={styles.handle} aria-hidden="true" />
          <div className={styles.head}>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            {dismissible ? <IconButton icon="close" label={closeLabel} onClick={onClose} /> : null}
          </div>
          <div className={styles.body}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
}
