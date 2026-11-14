import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { MemoryRow } from './MemoryRow';

const meta = {
  title: '웹 부품/표시/MemoryRow',
  component: MemoryRow,
  args: { kind: '좋아하는 것', text: '비 오는 날, 잔잔한 음악을 좋아해요.', date: '11월 13일', deleteLabel: '이 기억 지우기', onDelete: () => undefined },
} satisfies Meta<typeof MemoryRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { name: '긴 글', args: { kind: LONG_KO, text: LONG_KO_SPACED } };

export const Disabled: Story = { name: '비활성', args: { disabled: true } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="기본">
        <MemoryRow kind="좋아하는 것" text="비 오는 날, 잔잔한 음악을 좋아해요." date="11월 13일" deleteLabel="이 기억 지우기" onDelete={() => undefined} />
      </Case>
      <Case title="날짜 없음">
        <MemoryRow kind="일상" text="퇴근길에는 조용한 대화를 좋아해요." deleteLabel="이 기억 지우기" onDelete={() => undefined} />
      </Case>
      <Case title="지우는 중 (비활성)">
        <MemoryRow kind="다가오는 일" text="금요일에 중요한 발표가 있어요." date="11월 11일" deleteLabel="이 기억 지우기" disabled onDelete={() => undefined} />
      </Case>
      <Case title="긴 글 (띄어쓰기 없음)">
        <MemoryRow kind={LONG_KO} text={LONG_KO_SPACED} date="11월 1일" deleteLabel="이 기억 지우기" onDelete={() => undefined} />
      </Case>
    </Cases>
  ),
};
