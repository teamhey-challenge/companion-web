import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import styles from './ShowDriverCard.module.css';

export interface ShowDriverCardProps {
  /** 기사님께 보여 드릴 한국어 문장. */
  textKo: string;
  /** 승객에게 하는 안내(예: "기사님께 이 화면을 보여 주세요"). */
  caption: string;
}

/** 기사님께 화면을 보여 드릴 때 쓰는 큰 한국어 카드. */
export function ShowDriverCard({ textKo, caption }: ShowDriverCardProps) {
  return (
    <Card tone="inverse" padding={24}>
      <div className={styles.text}>
        <Text variant="display" lang="ko">
          {textKo}
        </Text>
      </div>
      <div className={styles.caption}>
        <Icon name="speaker" />
        <Text variant="caption" tone="muted">
          {caption}
        </Text>
      </div>
    </Card>
  );
}
