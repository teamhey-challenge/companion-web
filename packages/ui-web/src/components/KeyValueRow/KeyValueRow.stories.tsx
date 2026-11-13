import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Case, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { KeyValueRow } from './KeyValueRow';

const meta = {
  title: '웹 부품/표시/KeyValueRow',
  component: KeyValueRow,
  args: { label: '이동 시간', value: '38분', icon: 'clock' },
} satisfies Meta<typeof KeyValueRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { name: '긴 값 (일본어)', args: { label: '하차 위치', value: LONG_JA, icon: 'pin' } };

export const Empty: Story = { name: '빈 값', args: { label: '영수증', value: '', icon: 'card' } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="아이콘 있음 · 없음">
        <KeyValueRow label="이동 시간" value="38분" icon="clock" />
        <Divider />
        <KeyValueRow label="거리" value="21.4km" />
      </Case>
      <Case title="긴 값 (일본어)">
        <KeyValueRow label="하차 위치" value={LONG_JA} icon="pin" />
      </Case>
      <Case title="긴 값 (한국어 띄어쓰기 없음) + 긴 라벨">
        <KeyValueRow label="헤이파리가 지난 대화에서 기억해 둔 내용" value={LONG_KO} icon="flag" />
      </Case>
      <Case title="빈 값">
        <KeyValueRow label="영수증" value="" icon="card" />
      </Case>
    </Cases>
  ),
};
