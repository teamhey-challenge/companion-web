import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '../Banner/Banner';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_KO } from '../../internal/showcase';
import { ThemeProvider } from './ThemeProvider';

const meta = {
  title: '웹 부품/기반/ThemeProvider',
  component: ThemeProvider,
} satisfies Meta<typeof ThemeProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function Sample() {
  return (
    <Card padding={16}>
      <Text variant="heading">{'헤이리와 이야기해요'}</Text>
      <Text variant="body" tone="muted">
        {LONG_KO}
      </Text>
      <Banner tone="info" message="헤이리가 확인하고 있어요." />
      <Button variant="primary">{'연결하기'}</Button>
    </Card>
  );
}

export const Default: Story = {
  args: { theme: 'light', children: <Sample /> },
};

export const AllStates: Story = {
  name: 'All states',
  args: { theme: 'light' },
  render: () => (
    <Cases>
      <Case title="라이트">
        <ThemeProvider theme="light">
          <Stack gap={16}>
            <Sample />
          </Stack>
        </ThemeProvider>
      </Case>
      <Case title="다크">
        <ThemeProvider theme="dark">
          <Stack gap={16}>
            <Sample />
          </Stack>
        </ThemeProvider>
      </Case>
    </Cases>
  ),
};
