import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Case, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { ToggleRow } from './ToggleRow';

const meta = {
  title: '웹 부품/입력/ToggleRow',
  component: ToggleRow,
  args: { label: '음성으로 알려 드려요', checked: true, onChange: () => undefined },
} satisfies Meta<typeof ToggleRow>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, description, label, disabled }: { initial: boolean; description?: string; label: string; disabled?: boolean }) {
  const [on, setOn] = useState(initial);
  return <ToggleRow label={label} description={description} checked={on} disabled={disabled} onChange={setOn} />;
}

export const Default: Story = { render: () => <Demo initial label="음성으로 알려 드려요" /> };

export const LongText: Story = {
  name: '긴 라벨·설명',
  render: () => <Demo initial={false} label={LONG_JA} description={LONG_KO} />,
};

export const Disabled: Story = {
  name: '비활성',
  render: () => <Demo initial label="자동 번역" disabled />,
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="켬 · 끔">
        <Demo initial label="진동" />
        <Divider />
        <Demo initial={false} label="소리" />
      </Case>
      <Case title="설명 있음">
        <Demo initial label="일행 초대 허용" description="초대 링크로 들어온 일행은 기사님 승인 없이 함께 볼 수 있어요." />
      </Case>
      <Case title="비활성 (켬 · 끔)">
        <Demo initial label="자동 번역" disabled />
        <Demo initial={false} label="자동 번역" disabled />
      </Case>
      <Case title="긴 라벨 (일본어) + 긴 설명 (한국어)">
        <Demo initial={false} label={LONG_JA} description={LONG_KO} />
      </Case>
    </Cases>
  ),
};
