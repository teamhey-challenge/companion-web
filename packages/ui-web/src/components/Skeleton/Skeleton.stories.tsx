import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Case, Cases } from '../../internal/showcase';
import { Skeleton } from './Skeleton';

const meta = { title: '웹 부품/표시/Skeleton', component: Skeleton, args: { lines: 3 } } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {([1, 2, 3, 4] as const).map((n) => (
        <Case key={n} title={`${n}줄`}>
          <Skeleton lines={n} />
        </Case>
      ))}
      <Case title="카드 안">
        <Card padding={16}>
          <Skeleton lines={3} />
        </Card>
      </Case>
    </Cases>
  ),
};
