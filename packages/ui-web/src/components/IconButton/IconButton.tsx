import { Icon, type IconName } from '../Icon/Icon';
import styles from './IconButton.module.css';
import type { Handler } from '../../handler';

export interface IconButtonProps {
  icon: IconName;
  /** 보이지 않는 이름. 보조 기술과 길게 누름 안내에 쓴다. */
  label: string;
  variant?: 'ghost' | 'secondary';
  disabled?: boolean;
  onClick?: Handler;
}

/** 아이콘만 있는 단추. 누름 면 44×44. */
export function IconButton({ icon, label, variant = 'ghost', disabled = false, onClick }: IconButtonProps) {
  return (
    <button
      className={styles.root}
      data-variant={variant}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}
