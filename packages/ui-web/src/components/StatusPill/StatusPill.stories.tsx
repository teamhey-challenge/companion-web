import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, CaseRow, Cases, LONG_KO } from '../../internal/showcase';
import { StatusPill } from './StatusPill';

const meta = {
  title: '웹 부품/표시/StatusPill',
  component: StatusPill,
  args: { tone: 'info', label: '연결 확인 중' },
} satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const TONES = ['neutral', 'info', 'success', 'warning', 'danger', 'accent'] as const;

export const LongText: Story = { name: '긴 라벨 (띄어쓰기 없음)', args: { icon: 'info', label: LONG_KO } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="톤">
        <CaseRow>
          {TONES.map((tone) => (
            <StatusPill key={tone} tone={tone} label={tone} />
          ))}
        </CaseRow>
      </Case>
      <Case title="아이콘 있음">
        <CaseRow>
          <StatusPill tone="success" icon="check" label="합의됨" />
          <StatusPill tone="warning" icon="clock" label="기다리는 중" />
          <StatusPill tone="danger" icon="error" label="어려워요" />
        </CaseRow>
      </Case>
      <Case title="긴 라벨 (띄어쓰기 없음)">
        <StatusPill tone="info" icon="info" label={LONG_KO} />
      </Case>
    </Cases>
  ),
};
