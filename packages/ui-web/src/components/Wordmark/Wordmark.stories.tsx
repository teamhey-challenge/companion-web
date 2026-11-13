import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Case, CaseRow, Cases } from '../../internal/showcase';
import { Wordmark } from './Wordmark';

const meta = {
  title: '웹 부품/글자·브랜드/Wordmark',
  component: Wordmark,
  args: { partySize: 1, size: 'lg' },
} satisfies Meta<typeof Wordmark>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Growing() {
  const [n, setN] = useState<1 | 2 | 3 | 4>(1);
  return (
    <Stack gap={16} align="start">
      <Wordmark partySize={n} size="lg" />
      <Button variant="secondary" icon="plus" onClick={() => setN((n % 4 + 1) as 1 | 2 | 3 | 4)}>
        {'일행 늘리기 (4 다음은 1)'}
      </Button>
    </Stack>
  );
}

export const GrowOnClick: Story = {
  name: '늘어나는 동작 (움직임 줄이기에서는 즉시)',
  render: () => <Growing />,
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="lg · 1~4명">
        <Stack gap={16}>
          {([1, 2, 3, 4] as const).map((n) => (
            <Wordmark key={n} partySize={n} size="lg" animate={false} />
          ))}
        </Stack>
      </Case>
      <Case title="md · 1~4명">
        <CaseRow>
          {([1, 2, 3, 4] as const).map((n) => (
            <Wordmark key={n} partySize={n} size="md" animate={false} />
          ))}
        </CaseRow>
      </Case>
    </Cases>
  ),
};
