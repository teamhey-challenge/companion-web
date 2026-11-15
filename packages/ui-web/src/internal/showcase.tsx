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

/** 긴 글 점검용(한국어만). 띄어쓰기 없는 120자 이상, 띄어쓰기 있는 긴 문장. */
export const LONG_KO =
  '별이는강아지이고산책을좋아하고간식은닭가슴살을제일좋아하며비가오는날에는창가에앉아서밖을구경하는것을좋아한다고어제저녁에분명히말씀해주셨던것을헤이리가기억하고있어요그리고주말에는가족모두함께공원에간다고도하셨어요';
export const LONG_KO_SPACED =
  '지난주에 말씀해 주신 대로 강아지 별이는 비 오는 날 산책을 싫어하고 닭가슴살 간식을 가장 좋아해서, 헤이리는 앞으로 비 소식이 있는 날 아침에 먼저 우산과 간식 이야기를 꺼내 볼게요.';
