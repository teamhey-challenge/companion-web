import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { SpinnerRing } from '../../internal/SpinnerRing';
import styles from './Button.module.css';
import type { Handler } from '../../handler';

export interface ButtonProps {
  variant: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** 주면 이동하는 링크(<a>)로 그린다. 링크 안에 단추를 넣지 않는다. */
  href?: string;
  /** 링크가 새 창으로 열릴 때. */
  external?: boolean;
  onClick?: Handler;
  children: ReactNode;
}

/** 단추. 폭은 부모가 정한다(세로 Stack 안에서는 가득, Inline 안에서는 내용만큼). */
export function Button({
  variant,
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  href,
  external = false,
  onClick,
  children,
}: ButtonProps) {
  const inactive = disabled || loading;
  const content = (
    <>
      {loading ? <SpinnerRing size="sm" /> : icon ? <Icon name={icon} /> : null}
      <span className={styles.label}>{children}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        className={styles.root}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        href={inactive ? undefined : href}
        role={inactive ? 'link' : undefined}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={inactive ? undefined : onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={styles.root}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      type="button"
      disabled={inactive}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
