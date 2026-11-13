import { Icon, type IconName } from '../Icon/Icon';
import { Text } from '../Text/Text';
import styles from './ConditionSummary.module.css';

export interface ConditionItem {
  icon: IconName;
  label: string;
}

/** 조건이 하나도 없으면 그리지 않는다. 빈 목록을 넘길 수 없게 첫 항목을 요구한다. */
export type ConditionItems = readonly [ConditionItem, ...ConditionItem[]];

/** 목록을 그릴 수 있는 모양으로 좁힌다. 비어 있으면 null이라 부품을 그리지 않는다. */
export function asConditionItems(items: readonly ConditionItem[]): ConditionItems | null {
  const [first, ...rest] = items;
  return first ? [first, ...rest] : null;
}

export interface ConditionSummaryProps {
  /** 목록의 보이지 않는 이름. 예: "요청한 조건". */
  label: string;
  items: ConditionItems;
}

/** 승객이 정한 조건(짐, 걷기, 온도 등)을 아이콘과 글 한 줄씩 보여 준다. */
export function ConditionSummary({ label, items }: ConditionSummaryProps) {
  return (
    <ul className={styles.root} aria-label={label}>
      {items.map((item, i) => (
        <li key={`${item.icon}-${i}`} className={styles.item}>
          <span className={styles.icon}>
            <Icon name={item.icon} />
          </span>
          <Text variant="label" as="span">
            {item.label}
          </Text>
        </li>
      ))}
    </ul>
  );
}
