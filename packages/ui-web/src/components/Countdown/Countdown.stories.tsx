import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { Case, Cases } from '../../internal/showcase';
import { Countdown } from './Countdown';

const meta = {
  title: '웹 부품/표시/Countdown',
  component: Countdown,
  args: { label: '남은 시간', endsAt: Date.now() + 5 * 60_000 },
} satisfies Meta<typeof Countdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ends: Story = {
  name: '끝나면 onEnd 한 번',
  args: { endsAt: Date.now() + 1200, onEnd: fn() },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onEnd).toHaveBeenCalledTimes(1), { timeout: 4000 });
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="5분">
        <Countdown label="QR 코드가 만료되기까지" endsAt={Date.now() + 5 * 60_000} />
      </Case>
      <Case title="30초 이하 (강조)">
        <Countdown label="남은 시간" endsAt={Date.now() + 20_000} />
      </Case>
      <Case title="끝남 (00:00)">
        <Countdown label="요청이 만료됐어요" endsAt={Date.now() - 1000} />
      </Case>
    </Cases>
  ),
};
