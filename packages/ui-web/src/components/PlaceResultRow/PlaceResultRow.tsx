import { Icon } from '../Icon/Icon';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import { Text } from '../Text/Text';
import styles from './PlaceResultRow.module.css';
import type { Handler } from '../../handler';

export interface PlaceResultRowProps {
  nameLocal: string;
  nameKo: string;
  area: string;
  /** nameLocal의 언어. */
  lang?: Lang;
  selected?: boolean;
  onSelect: Handler;
}

/** 장소 검색 결과 한 줄. 목록 안에서는 PlaceResultList가 면과 구분선을 맡는다. */
export function PlaceResultRow({ nameLocal, nameKo, area, lang, selected = false, onSelect }: PlaceResultRowProps) {
  const detail = nameKo === nameLocal ? area : `${nameKo} · ${area}`;
  return (
    <button className={styles.root} type="button" data-selected={selected || undefined} aria-pressed={selected} onClick={onSelect}>
      <span className={styles.pin}>
        <Icon name="pin" />
      </span>
      <span className={styles.body}>
        <Text variant="bodyStrong" as="span" lang={lang} truncate={2}>
          {nameLocal}
        </Text>
        <Text variant="caption" tone="muted" as="span" truncate={2}>
          {detail}
        </Text>
      </span>
      {selected ? (
        <span className={styles.check}>
          <Icon name="check" />
        </span>
      ) : null}
    </button>
  );
}
