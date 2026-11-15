import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
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
  render: () => <Demo initial={false} label={LONG_KO} description={LONG_KO_SPACED} />,
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
        <Demo initial label="대화 요약을 기억으로 저장" description="끄면 헤이리가 이 대화를 기억하지 않아요." />
      </Case>
      <Case title="비활성 (켬 · 끔)">
        <Demo initial label="자동 번역" disabled />
        <Demo initial={false} label="자동 번역" disabled />
      </Case>
      <Case title="긴 라벨 (띄어쓰기 없음) + 긴 설명">
        <Demo initial={false} label={LONG_KO} description={LONG_KO_SPACED} />
      </Case>
    </Cases>
  ),
};
