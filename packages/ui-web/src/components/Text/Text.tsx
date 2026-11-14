import type { ReactNode } from 'react';
import styles from './Text.module.css';

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'label' | 'caption';
export type TextTone = 'default' | 'muted' | 'subtle' | 'accent' | 'danger' | 'success' | 'onAccent';

export interface TextProps {
  variant: TextVariant;
  tone?: TextTone;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div' | 'strong' | 'label';
  /** 줄임 줄 수. 없으면 모두 보인다. */
  truncate?: 1 | 2;
  children?: ReactNode;
}

/** 모든 글자는 이 부품으로 그린다. */
export function Text({ variant, tone = 'default', as: Tag = 'p', truncate, children }: TextProps) {
  return (
    <Tag className={styles.root} data-variant={variant} data-tone={tone} data-truncate={truncate}>
      {children}
    </Tag>
  );
}
