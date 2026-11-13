import styles from './Skeleton.module.css';

export interface SkeletonProps {
  lines: 1 | 2 | 3 | 4;
}

/** 글줄 자리 표시. 마지막 줄은 짧다. 보조 기술에는 보이지 않는다. */
export function Skeleton({ lines }: SkeletonProps) {
  return (
    <div className={styles.root} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className={styles.line} data-last={lines > 1 && i === lines - 1 ? true : undefined} />
      ))}
    </div>
  );
}
