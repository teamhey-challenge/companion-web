import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon/Icon';
import { Inline } from '../Inline/Inline';
import { Text } from '../Text/Text';
import { Case, Cases } from '../../internal/showcase';
import { VisuallyHidden } from './VisuallyHidden';

const meta = { title: '웹 부품/기반/VisuallyHidden', component: VisuallyHidden } satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '보조 기술에만 읽혀요' } };

export const Empty: Story = { name: '빈 값', args: { children: '' } };

export const AllStates: Story = {
  name: 'All states',
  args: { children: '' },
  render: () => (
    <Cases>
      <Case title="아이콘 옆 숨은 이름 (화면에는 아이콘만 보임, 스크린리더는 '새 요청 3건')">
        <Inline gap={8}>
          <Icon name="message" />
          <VisuallyHidden>{'새 요청 3건'}</VisuallyHidden>
        </Inline>
      </Case>
      <Case title="빈 값">
        <Text variant="caption" tone="muted">
          {'내용이 비어 있어도 레이아웃을 차지하지 않아요.'}
        </Text>
        <VisuallyHidden>{''}</VisuallyHidden>
      </Case>
    </Cases>
  ),
};
