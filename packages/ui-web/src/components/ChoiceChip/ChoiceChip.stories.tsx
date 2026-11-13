import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { Case, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { ChoiceChip } from './ChoiceChip';

const meta = {
  title: '웹 부품/행동/ChoiceChip',
  component: ChoiceChip,
  args: { selected: false, icon: 'door', label: '입구에서 만나요', onToggle: fn() },
} satisfies Meta<typeof ChoiceChip>;
export default meta;
type Story = StoryObj<typeof meta>;

function Toggle({ label, icon }: { label: string; icon?: 'door' | 'quiet' }) {
  const [on, setOn] = useState(false);
  return <ChoiceChip selected={on} icon={icon} label={label} onToggle={() => setOn(!on)} />;
}

export const Default: Story = {
  render: () => <Toggle label="입구에서 만나요" icon="door" />,
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByRole('button', { name: '입구에서 만나요' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard(' ');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onToggle).not.toHaveBeenCalled();
  },
};

export const LongText: Story = {
  name: '긴 라벨 (일본어)',
  args: { icon: 'door', label: LONG_JA },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="해제 · 선택 · 비활성 · 선택+비활성">
        <Inline gap={8} wrap>
          <ChoiceChip selected={false} icon="door" label="입구에서 만나요" onToggle={() => undefined} />
          <ChoiceChip selected icon="door" label="입구에서 만나요" onToggle={() => undefined} />
          <ChoiceChip selected={false} icon="quiet" label="조용히" disabled onToggle={() => undefined} />
          <ChoiceChip selected icon="quiet" label="조용히" disabled onToggle={() => undefined} />
        </Inline>
      </Case>
      <Case title="아이콘 없음">
        <Inline gap={8} wrap>
          <ChoiceChip selected={false} label="시원하게" onToggle={() => undefined} />
          <ChoiceChip selected label="따뜻하게" onToggle={() => undefined} />
        </Inline>
      </Case>
      <Case title="긴 라벨 (일본어, 띄어쓰기 없음)">
        <ChoiceChip selected={false} icon="door" label={LONG_JA} onToggle={() => undefined} />
      </Case>
      <Case title="긴 라벨 (한국어)">
        <ChoiceChip selected icon="door" label={LONG_KO} onToggle={() => undefined} />
      </Case>
    </Cases>
  ),
};
