import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases } from '../../internal/showcase';
import { TripProgress, type TripProgressLabels } from './TripProgress';

const labels: TripProgressLabels = {
  eta: '도착까지',
  distance: '남은 거리',
  unitMin: '분',
  unitKm: 'km',
  stale: '위치를 새로 받지 못해 마지막 값을 보여 드려요',
  none: '아직 계산 중이에요',
};

const meta = {
  title: '웹 부품/HEY/TripProgress',
  component: TripProgress,
  args: { state: 'eta', etaMin: 18, distanceKm: 7.4, stale: false, labels },
} satisfies Meta<typeof TripProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { name: '값 없음', args: { state: 'none' } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="보통">
        <TripProgress state="eta" etaMin={18} distanceKm={7.4} stale={false} labels={labels} />
      </Case>
      <Case title="오래된 값 (stale)">
        <TripProgress state="eta" etaMin={18} distanceKm={7.4} stale labels={labels} />
      </Case>
      <Case title="값 없음">
        <TripProgress state="none" labels={labels} />
      </Case>
      <Case title="시간만">
        <TripProgress state="eta" etaMin={6} stale={false} labels={labels} />
      </Case>
      <Case title="거리만 + stale">
        <TripProgress state="distance" distanceKm={12.8} stale labels={labels} />
      </Case>
      <Case title="세 자리 값">
        <TripProgress state="eta" etaMin={128} distanceKm={104.6} stale={false} labels={labels} />
      </Case>
      <Case title="긴 라벨 (영어)">
        <TripProgress
          state="eta"
          etaMin={18}
          distanceKm={7.4}
          stale
          labels={{
            eta: 'Estimated time until you arrive',
            distance: 'Distance remaining to destination',
            unitMin: 'min',
            unitKm: 'km',
            stale: 'We could not refresh the car position, so this is the last value we received a while ago.',
            none: 'Calculating',
          }}
        />
      </Case>
    </Cases>
  ),
};
