import styles from './Divider.module.css';

export interface DividerProps {
  /** 앞쪽을 비워 목록 줄 사이 구분선으로 쓴다. */
  inset?: boolean;
}

/** 가는 구분선. */
export function Divider({ inset = false }: DividerProps) {
  return (
    <div className={styles.root} data-inset={inset || undefined} role="separator">
      <div className={styles.line} />
    </div>
  );
}
