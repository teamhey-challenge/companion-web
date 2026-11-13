import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceChip } from '../ChoiceChip/ChoiceChip';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { ChipGroup } from './ChipGroup';

const meta = { title: '웹 부품/행동/ChipGroup', component: ChipGroup } satisfies Meta<typeof ChipGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const ALL = ['짐 있음', '덜 걷기', '만나기로 한 입구', '시원하게', '따뜻하게', '카드 결제', '영수증 필요', '어린이 동승', LONG_JA];

function Demo({ items }: { items: string[] }) {
  const [on, setOn] = useState<string[]>([items[0] ?? '']);
  return (
    <ChipGroup label="원하는 조건">
      {items.map((label) => (
        <ChoiceChip
          key={label}
          label={label}
          selected={on.includes(label)}
          onToggle={() => setOn(on.includes(label) ? on.filter((x) => x !== label) : [...on, label])}
        />
      ))}
    </ChipGroup>
  );
}

export const Default: Story = {
  args: { label: '원하는 조건', children: null },
  render: () => <Demo items={ALL.slice(0, 4)} />,
};

export const Empty: Story = {
  name: '0개',
  args: { label: '비어 있음', children: null },
};

export const Many: Story = {
  name: '많음 (줄바꿈, 긴 일본어 포함)',
  args: { label: '원하는 조건', children: null },
  render: () => <Demo items={ALL} />,
};

export const AllStates: Story = {
  name: 'All states',
  args: { label: '원하는 조건', children: null },
  render: () => (
    <Cases>
      <Case title="1개">
        <Demo items={['짐 있음']} />
      </Case>
      <Case title="많음 (줄바꿈, 긴 일본어 포함)">
        <Demo items={ALL} />
      </Case>
      <Case title="0개">
        <ChipGroup label="비어 있음">{null}</ChipGroup>
      </Case>
    </Cases>
  ),
};
