import { ICON_SHAPES, type IconName } from './paths';
import styles from './Icon.module.css';

export type { IconName };
export { ICON_NAMES } from './paths';

export interface IconProps {
  name: IconName;
  size?: 'md' | 'lg';
  /** 뜻이 있는 아이콘이면 이름을 준다. 없으면 장식으로 숨긴다. */
  label?: string;
}

/** 24 격자 선 아이콘. 색은 주변 글자색(currentColor)을 따른다. */
export function Icon({ name, size = 'md', label }: IconProps) {
  return (
    <svg
      className={styles.root}
      data-size={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
