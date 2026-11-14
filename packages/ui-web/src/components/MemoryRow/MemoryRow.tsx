import { Icon } from '../Icon/Icon';
import styles from './MemoryRow.module.css';
import type { Handler } from '../../handler';

export interface MemoryRowProps {
  /** 작은 분류 글. 예: "좋아하는 것". */
  kind: string;
  text: string;
  /** 저장한 날. 예: "11월 13일". */
  date?: string;
  /** 지우기 단추의 이름. 예: "이 기억 지우기". */
  deleteLabel: string;
  disabled?: boolean;
  onDelete: Handler;
}

/** 기억 한 줄: 분류, 내용, 저장한 날과 지우기 단추. */
export function MemoryRow({ kind, text, date, deleteLabel, disabled = false, onDelete }: MemoryRowProps) {
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <span className={styles.kind}>{kind}</span>
        <span className={styles.body}>{text}</span>
        {date ? <span className={styles.date}>{date}</span> : null}
      </div>
      <button className={styles.delete} type="button" aria-label={deleteLabel} title={deleteLabel} disabled={disabled} onClick={onDelete}>
        <Icon name="trash" size="lg" />
      </button>
    </div>
  );
}
