import { Icon, type IconName } from '../Icon/Icon';
import styles from './ChoiceChip.module.css';
import type { Handler } from '../../handler';

export interface ChoiceChipProps {
  selected: boolean;
  icon?: IconName;
  label: string;
  disabled?: boolean;
  onToggle: Handler;
}

/** 켜고 끄는 선택지. 선택되면 체크가 앞에 붙는다. */
export function ChoiceChip({ selected, icon, label, disabled = false, onToggle }: ChoiceChipProps) {
  return (
    <button
      className={styles.root}
      type="button"
      aria-pressed={selected}
      data-selected={selected || undefined}
      disabled={disabled}
      onClick={onToggle}
    >
      {selected ? <Icon name="check" /> : icon ? <Icon name={icon} /> : null}
      <span className={styles.label}>{label}</span>
    </button>
  );
}
