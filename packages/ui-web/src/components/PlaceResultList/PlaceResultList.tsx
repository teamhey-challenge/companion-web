import { Children, type ReactNode } from 'react';
import styles from './PlaceResultList.module.css';

export interface PlaceResultListProps {
  /** 목록의 보이지 않는 이름. 예: "검색 결과". */
  label: string;
  /** PlaceResultRow들. 없으면 그리지 않는다(빈 안내는 화면이 EmptyState로). */
  children?: ReactNode;
}

/** 장소 결과 줄을 한 면에 묶고 줄 사이에 가는 구분선을 둔다. */
export function PlaceResultList({ label, children }: PlaceResultListProps) {
  const rows = Children.toArray(children);
  if (rows.length === 0) return null;
  return (
    <ul className={styles.root} aria-label={label}>
      {rows.map((row, i) => (
        <li key={i} className={styles.item}>
          {row}
        </li>
      ))}
    </ul>
  );
}
