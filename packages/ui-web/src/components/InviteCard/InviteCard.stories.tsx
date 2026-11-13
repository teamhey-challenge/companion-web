import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { InviteCard } from './InviteCard';

const URL_SAMPLE = 'https://hey.example/join/7KQ4M9XT';
const TITLE = '일행을 초대해요';
const MESSAGE = '링크를 받은 일행도 같은 택시 상태를 함께 볼 수 있어요.';
const COPY = '링크 복사';
const COPIED = '복사했어요';

const meta = {
  title: '웹 부품/HEY/InviteCard',
  component: InviteCard,
  args: {
    url: URL_SAMPLE,
    title: TITLE,
    message: MESSAGE,
    copy: { state: 'idle', label: COPY },
    onCopy: fn(),
  },
} satisfies Meta<typeof InviteCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: COPY }));
    await expect(args.onCopy).toHaveBeenCalledTimes(1);
  },
};

export const LongText: Story = {
  name: '긴 글',
  args: {
    url: 'https://hey.example/join/7KQ4M9XT?from=lotte-hotel-seoul-main-tower-side-entrance&lang=ja&party=4&utm_source=qr-sticker-back-seat',
    title: LONG_JA,
    message: LONG_JA,
    copy: { state: 'idle', label: 'リンクをコピーして一緒に乗る人に送る' },
  },
};

function Live() {
  const [copied, setCopied] = useState(false);
  return (
    <InviteCard
      url={URL_SAMPLE}
      title={TITLE}
      message={MESSAGE}
      copy={copied ? { state: 'copied', label: COPIED } : { state: 'idle', label: COPY }}
      onCopy={() => setCopied(true)}
    />
  );
}

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="복사 전">
        <InviteCard {...meta.args} onCopy={fn()} />
      </Case>
      <Case title="복사 후">
        <InviteCard {...meta.args} copy={{ state: 'copied', label: COPIED }} onCopy={fn()} />
      </Case>
      <Case title="누르면 바뀜">
        <Live />
      </Case>
    </Cases>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole('button', { name: COPY });
    await userEvent.click(buttons.at(-1) as HTMLElement);
    await expect(within(canvasElement).getAllByRole('button', { name: COPIED })).toHaveLength(2);
  },
};
