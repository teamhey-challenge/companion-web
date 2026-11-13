import { Icon, type IconName } from '../Icon/Icon';
import styles from './Menu.module.css';
import type { Handler } from '../../handler';

export interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  tone?: 'default' | 'danger';
}

export interface MenuProps {
  items: ReadonlyArray<MenuItem>;
  onSelect: Handler<[id: string]>;
}

/** 메뉴 목록. BottomSheet 안에서 쓴다. */
export function Menu({ items, onSelect }: MenuProps) {
  return (
    <ul className={styles.root}>
      {items.map((item) => (
        <li key={item.id}>
          <button className={styles.item} type="button" data-tone={item.tone ?? 'default'} onClick={() => onSelect(item.id)}>
            <Icon name={item.icon} />
            <span className={styles.label}>{item.label}</span>
            <span className={styles.chevron}>
              <Icon name="chevron-right" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
