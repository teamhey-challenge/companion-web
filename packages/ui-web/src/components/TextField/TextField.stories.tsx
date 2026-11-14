import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Case, Cases, LONG_KO } from '../../internal/showcase';
import { TextField } from './TextField';

const meta = {
  title: '웹 부품/입력/TextField',
  component: TextField,
  args: { label: '강아지 이름', value: '', onChange: () => undefined, placeholder: '예: 별이', maxLength: 40 },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, disabled, label = '강아지 이름' }: { initial: string; disabled?: boolean; label?: string }) {
  const [value, setValue] = useState(initial);
  return <TextField label={label} value={value} onChange={setValue} placeholder="예: 별이" maxLength={40} disabled={disabled} />;
}

export const Default: Story = {
  render: () => <Demo initial="" />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('강아지 이름');
    await userEvent.type(input, '별이');
    await expect(input).toHaveValue('별이');
  },
};

export const Empty: Story = { name: '빈 값', render: () => <Demo initial="" /> };

export const Disabled: Story = { name: '비활성', render: () => <Demo initial="별이" disabled /> };

export const LongText: Story = {
  name: '긴 글',
  render: () => (
    <Cases>
      <Case title="긴 라벨과 값">
        <Demo initial={LONG_KO.slice(0, 40)} label={LONG_KO} />
      </Case>
    </Cases>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="빈 값">
        <Demo initial="" />
      </Case>
      <Case title="입력됨">
        <Demo initial="별이" />
      </Case>
      <Case title="상한 근처 (숫자 표시)">
        <Demo initial={'가'.repeat(38)} />
      </Case>
      <Case title="비활성">
        <Demo initial="별이" disabled />
      </Case>
    </Cases>
  ),
};
