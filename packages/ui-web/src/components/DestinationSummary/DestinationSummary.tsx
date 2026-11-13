import type { Lang } from '../ThemeProvider/ThemeProvider';
import { Text } from '../Text/Text';
import styles from './DestinationSummary.module.css';

export interface DestinationSummaryProps {
  /** 승객 언어로 쓴 장소 이름. */
  nameLocal: string;
  nameKo: string;
  addressKo: string;
  area?: string;
  /** nameLocal의 언어. */
  lang?: Lang;
  /** 이름 제목의 단계. 카드 제목(h2) 아래면 3(기본), 화면 제목(h1) 바로 아래면 2. */
  level?: 2 | 3;
}

/** 목적지 한 곳의 이름(승객 언어·한국어)과 주소. */
export function DestinationSummary({ nameLocal, nameKo, addressKo, area, lang, level = 3 }: DestinationSummaryProps) {
  return (
    <div className={styles.root}>
      <Text variant="heading" as={level === 2 ? 'h2' : 'h3'} lang={lang}>
        {nameLocal}
      </Text>
      {nameKo !== nameLocal ? (
        <Text variant="bodyStrong" lang="ko">
          {nameKo}
        </Text>
      ) : null}
      <Text variant="caption" tone="muted" lang="ko">
        {addressKo}
      </Text>
      {area && !addressKo.includes(area) ? (
        <Text variant="caption" tone="subtle">
          {area}
        </Text>
      ) : null}
    </div>
  );
}
