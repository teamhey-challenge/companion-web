import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { EmptyState } from './EmptyState';

const meta = {
  title: '웹 부품/표시/EmptyState',
  component: EmptyState,
  args: { icon: 'search', title: '저장된 기억이 없어요', message: '헤이파리와 이야기하면 여기에 쌓여요.' },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { name: '긴 글 (일본어)', args: { icon: 'warning', title: LONG_JA, message: LONG_JA } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="제목만">
        <EmptyState icon="message" title="아직 보낸 요청이 없어요" />
      </Case>
      <Case title="제목 + 안내">
        <EmptyState icon="search" title="저장된 기억이 없어요" message="헤이파리와 이야기하면 여기에 쌓여요." />
      </Case>
      <Case title="행동 있음">
        <EmptyState
          icon="qr"
          title="찾을 수 없는 QR이에요"
          message="차 화면의 QR을 다시 찍어 주세요."
          action={
            <Button variant="primary" icon="refresh">
              {'다시 시도'}
            </Button>
          }
        />
      </Case>
      <Case title="긴 글 (일본어)">
        <EmptyState icon="warning" title={LONG_JA} message={LONG_JA} />
      </Case>
    </Cases>
  ),
};
