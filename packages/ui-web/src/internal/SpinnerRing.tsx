import styles from './SpinnerRing.module.css';

/** 내부 전용: 글 없는 돌아가는 고리. 보이는 이름이 필요하면 Spinner를 쓴다. */
export function SpinnerRing({ size }: { size: 'sm' | 'md' }) {
  return <span className={styles.root} data-size={size} aria-hidden="true" />;
}
