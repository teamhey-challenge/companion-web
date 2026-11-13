import { Icon } from '../Icon/Icon';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import styles from './LanguageOption.module.css';
import type { Handler } from '../../handler';

export interface LanguageOptionProps {
  lang: Lang;
  /** 그 언어로 쓴 이름. 예: "日本語". */
  nativeName: string;
  selected: boolean;
  onSelect: Handler;
}

/** 언어 한 줄. 이름은 그 언어로 쓴다. */
export function LanguageOption({ lang, nativeName, selected, onSelect }: LanguageOptionProps) {
  return (
    <button
      className={styles.root}
      type="button"
      role="radio"
      aria-checked={selected}
      data-selected={selected || undefined}
      lang={lang}
      onClick={onSelect}
    >
      <span className={styles.name}>{nativeName}</span>
      <span className={styles.check}>{selected ? <Icon name="check" /> : null}</span>
    </button>
  );
}
