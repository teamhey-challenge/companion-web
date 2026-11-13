import type { ReactNode } from 'react';
import { Inline } from '../components/Inline/Inline';
import { Stack } from '../components/Stack/Stack';
import { Text } from '../components/Text/Text';
import styles from './showcase.module.css';

/** 이야기 전용: 칸을 격자로 늘어놓는다(변형 × 상태 표). */
export function CaseGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}

/** 이야기 전용: 360×640 휴대폰 틀. 안쪽이 스크롤되므로 키보드로도 닿게 한다. */
export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className={styles.phone} tabIndex={0}>
      {children}
    </div>
  );
}

/** 이야기 전용: 이름표 붙은 한 칸. 부품 목록(index.ts)으로는 내보내지 않는다. */
export function Case({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap={8}>
      <Text variant="caption" tone="subtle" as="span">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

/** 이야기 전용: 칸을 세로로 쌓는다. */
export function Cases({ children }: { children: ReactNode }) {
  return <Stack gap={24}>{children}</Stack>;
}

/** 이야기 전용: 칸을 가로로 늘어놓고 줄바꿈한다. */
export function CaseRow({ children }: { children: ReactNode }) {
  return (
    <Inline gap={16} wrap align="start">
      {children}
    </Inline>
  );
}

export const LONG_JA =
  '羽田空港第三ターミナルの国際線到着口から東京駅八重洲口まで、大きなスーツケースが二つあるので、できるだけ入口に近い場所で降ろしていただけると助かります。お支払いはクレジットカードでお願いしたいです。';
export const LONG_ZH =
  '请把我们送到东京站八重洲口附近的酒店门口，我们带着两个很大的行李箱，所以希望能在离入口最近的地方下车，另外请问可以刷信用卡付款吗，谢谢您的帮助和耐心等待。';
export const LONG_KO =
  '서울특별시강남구테헤란로152강남파이낸스센터지하2층주차장입구옆엘리베이터홀앞에서내려주시면감사하겠습니다그리고짐이많아서트렁크를열어주세요';
export const LONG_EN =
  'Please drop us at the side entrance of the Lotte Hotel Seoul Main Tower, the one closest to the airport limousine bus stop, because we have two very heavy suitcases.';
