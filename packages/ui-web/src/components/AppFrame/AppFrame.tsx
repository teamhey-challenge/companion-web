import type { ReactNode } from 'react';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './AppFrame.module.css';

export interface AppFrameProps {
  /** 맨 위 줄. 보통 ScreenHeader. */
  header: ReactNode;
  /** 아래 고정 행동 막대. 없으면 본문이 끝까지 쓴다. */
  footer?: ReactNode;
  /**
   * 화면 이름(문서의 h1). 본문에 눈에 보이는 h1이 없는 화면만 준다. 보이는 h1이 있으면 주지 않는다(h1은 한 화면에 하나).
   * 화면 맨 앞에서 보조 기술에만 읽힌다.
   */
  heading?: string;
  children?: ReactNode;
}

/**
 * 페이지 틀. 가운데 열(최대 480), 위 머리(banner), 가운데 본문(main, 직속 자식 사이 24), 아래 고정 막대(contentinfo).
 * 화면은 틀을 고르지 않고 내용만 쌓는다.
 */
export function AppFrame({ header, footer, heading, children }: AppFrameProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>{header}</header>
      <main className={styles.main}>
        {heading ? <VisuallyHidden as="h1">{heading}</VisuallyHidden> : null}
        {children}
      </main>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </div>
  );
}
