import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '../Banner/Banner';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
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
      <Text variant="heading">{'羽田空港 → 東京駅'}</Text>
      <Text variant="body" tone="muted">
        {LONG_JA}
      </Text>
      <Banner tone="info" message="헤이파리가 확인하고 있어요." />
      <Button variant="primary">{'연결하기'}</Button>
    </Card>
  );
}

export const Default: Story = {
  args: { theme: 'light', lang: 'ko', children: <Sample /> },
};

export const AllStates: Story = {
  name: 'All states',
  args: { theme: 'light', lang: 'ko' },
  render: () => (
    <Cases>
      <Case title="light / ko">
        <ThemeProvider theme="light" lang="ko">
          <Stack gap={16}>
            <Sample />
          </Stack>
        </ThemeProvider>
      </Case>
      <Case title="dark / ja">
        <ThemeProvider theme="dark" lang="ja">
          <Stack gap={16}>
            <Sample />
          </Stack>
        </ThemeProvider>
      </Case>
      <Case title="light / zh-Hans">
        <ThemeProvider theme="light" lang="zh-Hans">
          <Stack gap={16}>
            <Sample />
          </Stack>
        </ThemeProvider>
      </Case>
    </Cases>
  ),
};
