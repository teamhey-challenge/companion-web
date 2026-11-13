import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Text } from '../Text/Text';
import { Case, Cases } from '../../internal/showcase';
import { Spinner } from './Spinner';

const meta = { title: '웹 부품/표시/Spinner', component: Spinner, args: { label: '불러오는 중이에요' } } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="기본">
        <Spinner label="불러오는 중이에요" />
      </Case>
      <Case title="글과 함께">
        <Inline gap={8}>
          <Spinner label="장소를 찾고 있어요" />
          <Text variant="label" tone="muted">
            {'장소를 찾고 있어요'}
          </Text>
        </Inline>
      </Case>
    </Cases>
  ),
};
