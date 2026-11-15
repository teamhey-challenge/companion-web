import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { CheckboxRow } from './CheckboxRow';

const meta = {
  title: '웹 부품/입력/CheckboxRow',
  component: CheckboxRow,
  args: { label: '녹음과 음성 인식에 동의해요 (필수)', checked: false, onChange: () => undefined },
} satisfies Meta<typeof CheckboxRow>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, label, description, disabled, error }: { initial: boolean; label: string; description?: string; disabled?: boolean; error?: string }) {
  const [on, setOn] = useState(initial);
  return <CheckboxRow label={label} description={description} checked={on} disabled={disabled} error={error} onChange={setOn} />;
}

export const Default: Story = { render: () => <Demo initial={false} label="녹음과 음성 인식에 동의해요 (필수)" /> };

export const LongText: Story = { name: '긴 라벨·설명', render: () => <Demo initial={false} label={LONG_KO} description={LONG_KO_SPACED} /> };

export const Disabled: Story = { name: '비활성', render: () => <Demo initial label="대화 요약 저장" disabled /> };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="꺼짐 · 켜짐">
        <Demo initial={false} label="녹음과 음성 인식에 동의해요 (필수)" />
        <Divider />
        <Demo initial label="녹음과 음성 인식에 동의해요 (필수)" />
      </Case>
      <Case title="설명 있음">
        <Demo initial={false} label="대화 요약을 기억으로 저장해요 (선택)" description="끄면 헤이리가 이 대화를 기억하지 않아요." />
      </Case>
      <Case title="오류">
        <Demo initial={false} label="녹음과 음성 인식에 동의해요 (필수)" error="녹음 동의가 있어야 대화할 수 있어요" />
      </Case>
      <Case title="비활성 (켜짐 · 꺼짐)">
        <Demo initial label="대화 요약 저장" disabled />
        <Demo initial={false} label="대화 요약 저장" disabled />
      </Case>
      <Case title="긴 라벨 (띄어쓰기 없음) + 긴 설명">
        <Demo initial={false} label={LONG_KO} description={LONG_KO_SPACED} />
      </Case>
    </Cases>
  ),
};
