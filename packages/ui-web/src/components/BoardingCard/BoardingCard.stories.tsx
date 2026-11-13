import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import type { ConditionItem } from '../ConditionSummary/ConditionSummary';
import { Case, Cases, LONG_JA, LONG_KO, LONG_ZH } from '../../internal/showcase';
import { BoardingCard, type BoardingCardProps, type BoardingDropoff } from './BoardingCard';

const CONDITIONS: ConditionItem[] = [
  { icon: 'door', label: '호텔 정문 앞에서 만나요' },
  { icon: 'thermometer-cool', label: '조금 시원하게 해 주세요' },
];
const DESTINATION = {
  nameLocal: 'Lotte Hotel Seoul',
  nameKo: '롯데호텔 서울',
  addressKo: '서울 중구 을지로 30',
  area: 'Jung-gu, Seoul',
  lang: 'en',
} as const;

const STATUS = {
  draft: { kind: 'draft', label: '작성 중' },
  sent: { kind: 'sent', label: '기사님께 보냄' },
  confirmed: { kind: 'confirmed', label: '기사님 확인' },
  inTrip: { kind: 'inTrip', label: '이동 중' },
} as const satisfies Record<string, BoardingCardProps['status']>;

const DROPOFF: Record<BoardingDropoff['state'], BoardingDropoff> = {
  undecided: { heading: '내릴 곳', state: 'undecided', stateLabel: '정하는 중' },
  proposed: { heading: '내릴 곳', state: 'proposed', stateLabel: '제안 도착' },
  agreed: { heading: '내릴 곳', state: 'agreed', stateLabel: '합의함', spot: '정문 앞 승차장' },
};

const base: BoardingCardProps = {
  title: '탑승 카드',
  destination: DESTINATION,
  dropoff: DROPOFF.agreed,
  conditions: CONDITIONS,
  status: STATUS.confirmed,
  lang: 'ko',
};

const meta = {
  title: '웹 부품/HEY/BoardingCard',
  component: BoardingCard,
  args: base,
} satisfies Meta<typeof BoardingCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { footer: <Button variant="secondary">{'기사님께 다시 보여 주기'}</Button> },
};

export const LongText: Story = {
  name: '긴 글 (일본어·한국어)',
  args: {
    destination: {
      nameLocal: LONG_JA,
      nameKo: LONG_KO,
      addressKo: '서울특별시 강남구 테헤란로 152 강남파이낸스센터 지하 2층 주차장 입구 옆 엘리베이터 홀 앞',
      area: LONG_ZH,
      lang: 'ja',
    },
    dropoff: { heading: '내릴 곳', state: 'proposed', stateLabel: '기사님이 제안한 위치를 확인해 주세요' },
    conditions: [
      { icon: 'thermometer-cool', label: LONG_JA },
      { icon: 'door', label: LONG_ZH },
    ],
    status: STATUS.sent,
  },
};

export const Empty: Story = {
  name: '조건·내릴 곳 없음',
  args: { dropoff: undefined, conditions: [], status: STATUS.draft },
};

export const WithRespondAction: Story = {
  name: '답이 필요한 제안 (다시 열기 단추)',
  args: {
    dropoff: {
      heading: '내릴 곳',
      state: 'proposed',
      stateLabel: '아직 답하지 않았어요',
      action: { label: '답하기', onPress: fn() },
    },
    status: STATUS.inTrip,
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {Object.values(STATUS).flatMap((status) =>
        (['undecided', 'proposed', 'agreed'] as const).map((state) => (
          <Case key={`${status.kind}-${state}`} title={`${status.kind} × ${state}`}>
            <BoardingCard
              {...base}
              status={status}
              dropoff={DROPOFF[state]}
              footer={status.kind === 'draft' ? <Button variant="primary" onClick={fn()}>{'기사님께 보내기'}</Button> : undefined}
            />
          </Case>
        )),
      )}
      <Case title="조건·내릴 곳 없음">
        <BoardingCard {...base} dropoff={undefined} conditions={[]} status={STATUS.draft} />
      </Case>
    </Cases>
  ),
};
