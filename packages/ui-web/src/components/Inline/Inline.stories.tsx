import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceChip } from '../ChoiceChip/ChoiceChip';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { Inline } from './Inline';

const meta = {
  title: '웹 부품/기반/Inline',
  component: Inline,
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;

const chips = ['짐 있음', '덜 걷기', '만나기로 한 입구', '실내 온도', '카드 결제', '영수증 필요', '어린이 동승'];

function Chips() {
  return (
    <>
      {chips.map((c) => (
        <ChoiceChip key={c} label={c} selected={false} onToggle={() => undefined} />
      ))}
    </>
  );
}

export const Default: Story = {
  args: { gap: 8, wrap: true, children: <Chips /> },
};

export const LongText: Story = {
  name: '긴 글 (일본어)',
  args: {
    gap: 8,
    align: 'start',
    children: (
      <Text variant="body" lang="ja">
        {LONG_JA}
      </Text>
    ),
  },
};

export const Many: Story = {
  name: '칩 많음 (줄바꿈)',
  args: { gap: 8, wrap: true, children: <Chips /> },
};

export const AllStates: Story = {
  name: 'All states',
  args: { gap: 8 },
  render: () => (
    <Cases>
      <Case title="wrap + gap 8">
        <Inline gap={8} wrap>
          <Chips />
        </Inline>
      </Case>
      <Case title="wrap 없음 (넘치면 잘림 방지는 부모 몫)">
        <Inline gap={8}>
          <Text variant="label">{'좁은 칸에서 줄바꿈하지 않는 줄'}</Text>
        </Inline>
      </Case>
      <Case title="justify between">
        <Inline gap={16} justify="between">
          <Text variant="bodyStrong">{'왼쪽'}</Text>
          <Text variant="caption" tone="muted">
            {'오른쪽'}
          </Text>
        </Inline>
      </Case>
      <Case title="justify end / center">
        <Inline gap={16} justify="end">
          <Text variant="body">{'끝 정렬'}</Text>
        </Inline>
        <Inline gap={16} justify="center">
          <Text variant="body">{'가운데 정렬'}</Text>
        </Inline>
      </Case>
      <Case title="긴 일본어 한 줄(줄임 없이 줄바꿈)">
        <Inline gap={8} align="start">
          <Text variant="body">{LONG_JA}</Text>
        </Inline>
      </Case>
      <Case title="gap 4 / 16 / 24 / 32">
        {([4, 16, 24, 32] as const).map((g) => (
          <Inline key={g} gap={g} wrap>
            <Chips />
          </Inline>
        ))}
      </Case>
    </Cases>
  ),
};
