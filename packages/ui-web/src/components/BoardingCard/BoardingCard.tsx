import type { ReactNode } from 'react';
import { ConditionSummary, asConditionItems, type ConditionItem } from '../ConditionSummary/ConditionSummary';
import { Card } from '../Card/Card';
import { DestinationSummary, type DestinationSummaryProps } from '../DestinationSummary/DestinationSummary';
import { Divider } from '../Divider/Divider';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { StatusPill, type StatusPillProps } from '../StatusPill/StatusPill';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import { Text } from '../Text/Text';
import styles from './BoardingCard.module.css';
import type { Handler } from '../../handler';

/** 카드가 지금 어느 단계인지. 이름과 표시 문구가 한 값이라 서로 어긋날 수 없다. */
export type BoardingStatus = { kind: 'draft' | 'sent' | 'confirmed' | 'inTrip'; label: string };

/**
 * 내릴 곳 줄. 단계마다 보여 줄 것이 다르다.
 * - undecided: 아직 정하지 않음
 * - proposed: 기사 제안이 답을 기다림(대표 승객에게만 `action`이 붙는다)
 * - agreed: 합의한 지점 문구가 반드시 있다
 */
export type BoardingDropoff =
  | { state: 'undecided'; heading: string; stateLabel: string }
  | { state: 'proposed'; heading: string; stateLabel: string; action?: { label: string; onPress: Handler } }
  | { state: 'agreed'; heading: string; stateLabel: string; spot: string };

export interface BoardingCardProps {
  /** 카드 이름. 예: "탑승 카드". */
  title: string;
  destination: DestinationSummaryProps;
  dropoff?: BoardingDropoff;
  conditions: ConditionItem[];
  status: BoardingStatus;
  /** 내릴 곳 이름(`dropoff.spot`)의 언어. 승객 언어다. */
  lang: Lang;
  /** 카드 아래 동작 자리(보통 Button). */
  footer?: ReactNode;
}

const STATUS_TONE: Record<BoardingStatus['kind'], StatusPillProps['tone']> = {
  draft: 'neutral',
  sent: 'info',
  confirmed: 'success',
  inTrip: 'accent',
};
const DROPOFF_TONE: Record<BoardingDropoff['state'], StatusPillProps['tone']> = {
  undecided: 'neutral',
  proposed: 'info',
  agreed: 'success',
};

/** 기사님께 보여 줄 탑승 카드: 목적지, 내릴 곳, 조건을 한 장에 모은다. */
export function BoardingCard({ title, destination, dropoff, conditions, status, lang, footer }: BoardingCardProps) {
  const conditionList = asConditionItems(conditions);
  return (
    <Card padding={16}>
      <div className={styles.header}>
        <Text variant="label" tone="muted" as="h2">
          {title}
        </Text>
        <StatusPill tone={STATUS_TONE[status.kind]} label={status.label} />
      </div>
      <DestinationSummary {...destination} />
      {dropoff || conditions.length > 0 ? <Divider /> : null}
      {dropoff ? (
        <div className={styles.dropoffBlock}>
          <div className={styles.dropoff}>
            <span className={styles.flag}>
              <Icon name="flag" />
            </span>
            <div className={styles.dropoffBody}>
              <Text variant="caption" tone="muted">
                {dropoff.heading}
              </Text>
              {dropoff.state === 'agreed' ? (
                <Text variant="bodyStrong" lang={lang}>
                  {dropoff.spot}
                </Text>
              ) : null}
            </div>
            <StatusPill tone={DROPOFF_TONE[dropoff.state]} label={dropoff.stateLabel} />
          </div>
          {dropoff.state === 'proposed' && dropoff.action ? (
            <Button variant="secondary" onClick={dropoff.action.onPress}>
              {dropoff.action.label}
            </Button>
          ) : null}
        </div>
      ) : null}
      {conditionList ? <ConditionSummary label={title} items={conditionList} /> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Card>
  );
}
