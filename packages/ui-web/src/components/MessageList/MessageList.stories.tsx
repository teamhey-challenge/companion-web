import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import type { RequestStatusLabels } from '../RequestStatus/RequestStatus';
import { Stack } from '../Stack/Stack';
import { Case, Cases, LONG_JA, LONG_ZH } from '../../internal/showcase';
import { MessageList } from './MessageList';

const statusLabels: RequestStatusLabels = {
  sending: '보내는 중',
  received: '차량이 받았어요',
  spoken: '기사님께 전했어요',
  answered: '기사님이 답했어요',
  failed: '보내지 못했어요',
};

const meta = {
  title: '웹 부품/HEY/MessageList',
  component: MessageList,
  args: { label: '기사님과 나눈 대화', newMessageLabel: '새 메시지 보기' },
  render: (args) => (
    <MessageList {...args}>
      <MessageBubble from="system" text="기사님과 연결되었어요." time="오후 2:38" />
      <MessageBubble
        from="me"
        text="Please slow down a little."
        lang="en"
        delivery={{ state: "spoken", labels: statusLabels }}
        time="오후 2:41"
      />
      <MessageBubble from="driver" text="네, 천천히 갈게요." lang="ko" subText="Sure, I will go slowly." subLang="en" time="오후 2:42" />
    </MessageList>
  ),
} satisfies Meta<typeof MessageList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { name: '빈 대화', render: (args) => <MessageList {...args} /> };

export const LongText: Story = {
  name: '긴 글',
  render: (args) => (
    <MessageList {...args}>
      <MessageBubble from="me" text={LONG_JA} lang="ja" delivery={{ state: "answered", replyExpected: true, labels: statusLabels }} time="오후 2:41" />
      <MessageBubble from="driver" text={LONG_ZH} lang="zh-Hans" time="오후 2:42" />
    </MessageList>
  ),
};

function Row({ i }: { i: number }) {
  if (i % 7 === 0) return <MessageBubble from="system" text={`${i}번째 안내예요.`} time="오후 2:40" />;
  return i % 2 === 0 ? (
    <MessageBubble from="driver" text={`${i}번째 기사님 답: 곧 도착합니다.`} lang="ko" time="오후 2:41" />
  ) : (
    <MessageBubble
      from="me"
      text={`Message number ${i}`}
      lang="en"
      delivery={{ state: "spoken", labels: statusLabels }}
      time="오후 2:41"
    />
  );
}

function Growing({ initial, label, newMessageLabel }: { initial: number; label: string; newMessageLabel: string }) {
  const [count, setCount] = useState(initial);
  return (
    <Stack gap={16}>
      <MessageList label={label} newMessageLabel={newMessageLabel}>
        {Array.from({ length: count }, (_, i) => (
          <Row key={i} i={i + 1} />
        ))}
      </MessageList>
      <Button variant="secondary" icon="plus" onClick={() => setCount((c) => c + 1)}>
        {'메시지 추가'}
      </Button>
    </Stack>
  );
}

export const Many: Story = {
  name: '많음 (30개, 추가하면 맨 아래로)',
  render: (args) => <Growing initial={30} label={args.label} newMessageLabel={args.newMessageLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '메시지 추가' }));
    await expect(canvas.getByText('Message number 31')).toBeInTheDocument();
  },
};

/** 위로 더 있으면 맨 위 줄이 서서히 사라진다(잘린 시각 라벨이 오류처럼 보이지 않게). 모두 보이면 표식이 없다. */
export const CutTopFade: Story = {
  name: '위로 더 있음 (맨 위 서서히 사라짐)',
  render: (args) => <Growing initial={30} label={args.label} newMessageLabel={args.newMessageLabel} />,
  play: async ({ canvasElement }) => {
    const log = within(canvasElement).getByRole('log');
    const root = log.parentElement as HTMLElement;
    await expect(log.scrollTop).toBeGreaterThan(0);
    await expect(root).toHaveAttribute('data-cut-top', 'true');
    log.scrollTop = 0;
    log.dispatchEvent(new Event('scroll'));
    await expect(root).not.toHaveAttribute('data-cut-top');
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: (args) => (
    <Cases>
      <Case title="몇 개">
        <MessageList {...args}>
          <MessageBubble from="driver" text="어디로 모실까요?" lang="ko" time="오후 2:38" />
          <MessageBubble from="me" text="Lotte Hotel Seoul, please." lang="en" delivery={{ state: "received", labels: statusLabels }} time="오후 2:39" />
        </MessageList>
      </Case>
      <Case title="빈 대화">
        <MessageList {...args} />
      </Case>
      <Case title="30개 (넘치면 안에서 스크롤)">
        <Growing initial={30} label={args.label} newMessageLabel={args.newMessageLabel} />
      </Case>
    </Cases>
  ),
};
