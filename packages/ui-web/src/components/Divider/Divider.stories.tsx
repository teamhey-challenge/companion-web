import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases } from '../../internal/showcase';
import { Divider } from './Divider';

const meta = { title: '웹 부품/기반/Divider', component: Divider } satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="기본">
        <Stack gap={8}>
          <Text variant="body">{'위'}</Text>
          <Divider />
          <Text variant="body">{'아래'}</Text>
        </Stack>
      </Case>
      <Case title="inset (목록 줄 사이)">
        <Stack gap={8}>
          <Text variant="body">{'첫째 줄'}</Text>
          <Divider inset />
          <Text variant="body">{'둘째 줄'}</Text>
          <Divider inset />
          <Text variant="body">{'셋째 줄'}</Text>
        </Stack>
      </Case>
    </Cases>
  ),
};
