import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases } from '../../internal/showcase';
import { RequestStatus, type RequestState, type RequestStatusLabels } from './RequestStatus';

const labels: RequestStatusLabels = {
  sending: '보내는 중',
  received: '차량이 받았어요',
  spoken: '기사님께 전했어요',
  answered: '기사님이 답했어요',
  failed: '보내지 못했어요',
};

const meta = {
  title: '웹 부품/표시/RequestStatus',
  component: RequestStatus,
  args: { state: 'spoken', replyExpected: false, labels },
} satisfies Meta<typeof RequestStatus>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const STATES: RequestState[] = ['sending', 'received', 'spoken', 'answered', 'failed'];

export const Error: Story = { name: '실패', args: { state: 'failed', replyExpected: true, labels } };

export const Loading: Story = { name: '보내는 중', args: { state: 'sending', replyExpected: true, labels } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="알림형 (spoken에서 끝)">
        {(['sending', 'received', 'spoken', 'failed'] as const).map((s) => (
          <RequestStatus key={s} state={s} replyExpected={false} labels={labels} />
        ))}
      </Case>
      <Case title="질문형 (answered까지)">
        {STATES.map((s) => (
          <RequestStatus key={s} state={s} replyExpected labels={labels} />
        ))}
      </Case>
      <Case title="긴 라벨 (영어)">
        <RequestStatus
          state="answered"
          replyExpected
          labels={{
            ...labels,
            received: 'The car has received your request and it is in the queue',
            spoken: 'The driver has been told out loud in Korean',
            answered: 'The driver answered with a quick reply just now',
          }}
        />
      </Case>
    </Cases>
  ),
};
