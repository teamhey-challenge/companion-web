import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_JA, LONG_KO, LONG_ZH } from '../../internal/showcase';
import { ArrivalSummary, type ArrivalSummaryProps } from './ArrivalSummary';

const base: ArrivalSummaryProps = {
  dropoff: { heading: '합의한 내릴 곳', label: '롯데호텔 서울 정문 앞 승차장' },
  lang: 'ko',
  stats: {
    state: 'time',
    duration: { label: '이동 시간', value: '24분' },
    distance: { label: '이동 거리', value: '12.4km' },
  },
  conditions: [{ icon: 'door', label: '호텔 정문 앞에서 만나요' }],
  notes: ['두고 내린 물건이 없는지 확인해 주세요.'],
};

const meta = {
  title: '웹 부품/HEY/ArrivalSummary',
  component: ArrivalSummary,
  args: base,
} satisfies Meta<typeof ArrivalSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  name: '긴 글 (일본어·중국어·한국어)',
  args: {
    dropoff: { heading: '합의한 내릴 곳', label: LONG_KO },
    conditions: [
      { icon: 'thermometer-cool', label: LONG_JA },
      { icon: 'door', label: LONG_ZH },
    ],
    notes: [LONG_JA, LONG_ZH],
  },
};

export const Empty: Story = {
  name: '통계·조건·알림 없음',
  args: { stats: { state: 'none' }, conditions: [], notes: [] },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="조건 있음 · 시간과 거리">
        <ArrivalSummary {...base} />
      </Case>
      <Case title="조건 없음">
        <ArrivalSummary {...base} conditions={[]} />
      </Case>
      <Case title="통계 없음">
        <ArrivalSummary {...base} stats={{ state: 'none' }} />
      </Case>
      <Case title="거리만">
        <ArrivalSummary {...base} stats={{ state: 'distance', distance: { label: '이동 거리', value: '12.4km' } }} notes={[]} />
      </Case>
      <Case title="시간만">
        <ArrivalSummary {...base} stats={{ state: 'time', duration: { label: '이동 시간', value: '24분' } }} notes={[]} />
      </Case>
      <Case title="내릴 곳만">
        <ArrivalSummary {...base} stats={{ state: 'none' }} conditions={[]} notes={[]} />
      </Case>
      <Case title="긴 글">
        <ArrivalSummary
          {...base}
          dropoff={{ heading: '합의한 내릴 곳', label: LONG_KO }}
          conditions={[{ icon: 'thermometer-cool', label: LONG_JA }]}
          notes={[LONG_ZH]}
        />
      </Case>
    </Cases>
  ),
};
