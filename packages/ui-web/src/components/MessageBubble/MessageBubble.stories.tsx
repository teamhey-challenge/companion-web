import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, CaseGrid, Cases, LONG_EN, LONG_JA, LONG_ZH } from '../../internal/showcase';
import type { RequestState, RequestStatusLabels } from '../RequestStatus/RequestStatus';
import { MessageBubble, type MyDelivery } from './MessageBubble';

const statusLabels: RequestStatusLabels = {
  sending: '보내는 중',
  received: '차량이 받았어요',
  spoken: '기사님께 전했어요',
  answered: '기사님이 답했어요',
  failed: '보내지 못했어요',
};

const meta = {
  title: '웹 부품/HEY/MessageBubble',
  component: MessageBubble,
  args: {
    from: 'me',
    text: 'Could you drop me at the side entrance of Lotte Hotel Seoul?',
    lang: 'en',
    subText: '롯데호텔 서울 별관 쪽 입구에 내려 주시겠어요?',
    subLang: 'ko',
    delivery: { state: 'spoken', replyExpected: true, labels: statusLabels },
    time: '오후 2:41',
  },
} satisfies Meta<typeof MessageBubble>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const STATES: Array<Exclude<RequestState, 'failed'>> = ['sending', 'received', 'spoken', 'answered'];

export const Loading: Story = {
  name: '보내는 중',
  args: { delivery: { state: 'sending', labels: statusLabels } },
};

export const Error: Story = {
  name: '실패 (다시 보내기)',
  args: { delivery: { state: 'failed', labels: statusLabels, retry: { label: '다시 보내기', onRetry: fn() } } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 보내기' }));
    if (args.from !== 'me' || args.delivery.state !== 'failed') throw new globalThis.Error('failed delivery expected');
    await expect(args.delivery.retry.onRetry).toHaveBeenCalledTimes(1);
  },
};

export const LongText: Story = {
  name: '긴 글 (일본어·중국어)',
  args: {
    from: 'me',
    text: LONG_JA,
    lang: 'ja',
    subText: LONG_ZH,
    subLang: 'zh-Hans',
    delivery: { state: 'answered', labels: statusLabels },
  },
  render: (args) => (
    <Cases>
      <MessageBubble {...args} />
      <MessageBubble from="driver" text={LONG_ZH} lang="zh-Hans" subText={LONG_EN} subLang="en" time="오후 2:42" />
      <MessageBubble from="system" text={LONG_JA} lang="ja" time="오후 2:43" />
    </Cases>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <CaseGrid>
      {STATES.map((state) => (
        <Case key={state} title={`me · ${state}`}>
          <MessageBubble
            from="me"
            text="에어컨을 조금 약하게 해 주세요."
            lang="ko"
            subText="Could you turn the air conditioning down a little?"
            subLang="en"
            delivery={{ state, replyExpected: state === 'answered', labels: statusLabels } satisfies MyDelivery}
            time="오후 2:41"
          />
        </Case>
      ))}
      <Case title="me · 실패">
        <MessageBubble
          from="me"
          text="에어컨을 조금 약하게 해 주세요."
          lang="ko"
          delivery={{ state: 'failed', labels: statusLabels, retry: { label: '다시 보내기', onRetry: fn() } }}
          time="오후 2:41"
        />
      </Case>
      <Case title="me · 알림형 (spoken에서 끝)">
        <MessageBubble from="me" text="Please slow down a little." lang="en" delivery={{ state: 'spoken', labels: statusLabels }} time="오후 2:41" />
      </Case>
      <Case title="driver">
        <MessageBubble
          from="driver"
          text="네, 정문 쪽으로 가겠습니다."
          lang="ko"
          subText="Yes, I will go to the main entrance."
          subLang="en"
          time="오후 2:42"
          listen={{ label: '다시 듣기', onListen: fn() }}
        />
      </Case>
      <Case title="driver · 번역 없음">
        <MessageBubble from="driver" text="도착했습니다." lang="ko" time="오후 2:50" />
      </Case>
      <Case title="system">
        <MessageBubble from="system" text="기사님이 롯데호텔 서울 근처에 도착했어요." time="오후 2:50" />
      </Case>
    </CaseGrid>
  ),
};
