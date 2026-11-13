import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases } from '../../internal/showcase';
import { ConnectionIndicator } from './ConnectionIndicator';

const labels = { online: '연결됨', reconnecting: '다시 연결하는 중', offline: '연결이 끊겼어요' };

const meta = {
  title: '웹 부품/표시/ConnectionIndicator',
  component: ConnectionIndicator,
  args: { status: 'online', labels },
} satisfies Meta<typeof ConnectionIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {(['online', 'reconnecting', 'offline'] as const).map((s) => (
        <Case key={s} title={s}>
          <ConnectionIndicator status={s} labels={labels} />
        </Case>
      ))}
      <Case title="긴 라벨 (일본어)">
        <ConnectionIndicator
          status="reconnecting"
          labels={{ ...labels, reconnecting: 'サーバーとの接続が一時的に不安定になっているため、自動的に再接続を試みています' }}
        />
      </Case>
    </Cases>
  ),
};
