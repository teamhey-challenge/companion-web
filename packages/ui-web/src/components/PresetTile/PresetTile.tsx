import { Icon, type IconName } from '../Icon/Icon';
import styles from './PresetTile.module.css';
import type { Handler } from '../../handler';

export interface PresetTileProps {
  icon: IconName;
  label: string;
  /** notice: 알리고 끝. question: 기사님 답이 필요하다(오른쪽 위에 표식). */
  kind: 'notice' | 'question';
  /** question 표식의 이름. 예: "답을 받아요". */
  questionLabel?: string;
  disabled?: boolean;
  onPress: Handler;
}

/** 자주 보내는 요청 한 칸. 누르면 바로 보낸다. */
export function PresetTile({ icon, label, kind, questionLabel, disabled = false, onPress }: PresetTileProps) {
  return (
    <button className={styles.root} type="button" data-kind={kind} disabled={disabled} onClick={onPress}>
      <span className={styles.icon}>
        <Icon name={icon} />
      </span>
      <span className={styles.label}>{label}</span>
      {kind === 'question' ? (
        <span className={styles.mark} role="img" aria-label={questionLabel}>
          <Icon name="message" />
        </span>
      ) : null}
    </button>
  );
}
