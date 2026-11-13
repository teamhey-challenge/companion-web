import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { TollNotice, type TollNoticeLabels } from './TollNotice';

const labels: TollNoticeLabels = {
  title: '통행료',
  has: '이 경로에는 통행료 7,900원이 있어요. 요금은 도착 후 미터기에 함께 나와요.',
  note: '실제 경로는 도로 상황에 따라 달라질 수 있어요.',
};

const meta = {
  title: '웹 부품/HEY/TollNotice',
  component: TollNotice,
  args: { labels },
} satisfies Meta<typeof TollNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="통행료 있음 (없으면 화면이 그리지 않는다)">
        <TollNotice labels={labels} />
      </Case>
      <Case title="긴 글 (일본어)">
        <TollNotice labels={{ title: LONG_JA, has: LONG_JA, note: LONG_JA }} />
      </Case>
    </Cases>
  ),
};
