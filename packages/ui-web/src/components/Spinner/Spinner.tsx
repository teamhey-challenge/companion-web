import { SpinnerRing } from '../../internal/SpinnerRing';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** 보조 기술에 읽히는 상태 문구. 예: "불러오는 중이에요". */
  label: string;
}

/** 기다리는 중 표시. 움직임 줄이기에서는 멈춘 고리만 보인다. */
export function Spinner({ label }: SpinnerProps) {
  return (
    <span className={styles.root} role="status">
      <SpinnerRing size="md" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
