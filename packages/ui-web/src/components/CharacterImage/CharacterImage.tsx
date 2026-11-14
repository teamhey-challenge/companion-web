import { useState } from 'react';
import still from '../../assets/character/still.webp';
import stillPeach from '../../assets/character/still-peach.webp';
import styles from './CharacterImage.module.css';

export interface CharacterImageProps {
  /** 이미지 설명. 보통 캐릭터 이름. */
  alt: string;
  /** loading이면 자리만 보이고 맥박처럼 깜빡인다. */
  state?: 'ready' | 'loading';
}

/**
 * 캐릭터 정지 이미지. 라이트는 청록, 다크는 복숭아 몸색(토큰의 브랜드 표시 값을 따른다).
 * 이미지를 못 불러오면 자리만 비운다(글은 그대로).
 */
export function CharacterImage({ alt, state = 'ready' }: CharacterImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.root} data-state={failed ? 'missing' : state}>
      {state === 'ready' && !failed ? (
        <>
          <img className={styles.light} src={still} alt={alt} width={560} height={560} onError={() => setFailed(true)} />
          <img className={styles.dark} src={stillPeach} alt={alt} width={560} height={560} onError={() => setFailed(true)} />
        </>
      ) : null}
    </div>
  );
}
