import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { TextComposer } from './TextComposer';

const meta = {
  title: '웹 부품/입력/TextComposer',
  component: TextComposer,
  args: {
    label: '기사님께 보낼 말',
    value: '',
    onChange: () => undefined,
    placeholder: '직접 쓴 말은 기사님께 한국어로 전해져요',
    maxLength: 100,
    onSend: fn(),
    sendLabel: '보내기',
  },
} satisfies Meta<typeof TextComposer>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({
  initial,
  sending,
  disabled,
  error,
  onSend,
}: {
  initial: string;
  sending?: boolean;
  disabled?: boolean;
  error?: string;
  onSend?: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <TextComposer
      label="기사님께 보낼 말"
      value={value}
      onChange={setValue}
      placeholder="직접 쓴 말은 기사님께 한국어로 전해져요"
      maxLength={100}
      sendLabel="보내기"
      onSend={onSend ?? (() => undefined)}
      sending={sending}
      disabled={disabled}
      error={error}
    />
  );
}

export const Default: Story = {
  render: (args) => <Demo initial="" onSend={args.onSend} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const send = canvas.getByRole('button', { name: '보내기' });
    await expect(send).toBeDisabled();
    const box = canvas.getByRole('textbox', { name: '기사님께 보낼 말' });
    await userEvent.type(box, 'Please stop at the side entrance');
    await expect(send).toBeEnabled();
    await expect(canvas.getByText('32/100')).toBeInTheDocument();
    await userEvent.click(send);
    await expect(args.onSend).toHaveBeenCalledTimes(1);
  },
};

export const OverLimit: Story = {
  name: '글자 수 초과 (보내기 막힘)',
  render: () => <Demo initial={LONG_JA + LONG_JA} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '보내기' })).toBeDisabled();
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const LongText: Story = {
  name: '긴 입력 (일본어, 90자 넘김)',
  render: () => <Demo initial={LONG_JA.slice(0, 94)} />,
};

export const Empty: Story = { name: '빈 값', render: () => <Demo initial="" /> };

export const Error: Story = {
  name: '오류',
  render: () => <Demo initial="入口の近くで降ろしてください" error="번역하지 못했어요. 잠시 뒤에 다시 보내 주세요." />,
};

export const Loading: Story = {
  name: '보내는 중',
  render: () => <Demo initial="入口の近くで降ろしてください" sending />,
};

export const Disabled: Story = {
  name: '연결 끊김 (글은 남고 보내기만 막힘)',
  render: () => <Demo initial="入口の近くで降ろしてください" disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '보내기' })).toBeDisabled();
    await expect(canvas.getByRole('textbox')).toHaveValue('入口の近くで降ろしてください');
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="빈 값">
        <Demo initial="" />
      </Case>
      <Case title="입력 중">
        <Demo initial="入口の近くで降ろしてください" />
      </Case>
      <Case title="초과 직전 (90자 이상)">
        <Demo initial={LONG_JA.slice(0, 94)} />
      </Case>
      <Case title="초과">
        <Demo initial={LONG_JA + LONG_JA} />
      </Case>
      <Case title="보내는 중">
        <Demo initial="入口の近くで降ろしてください" sending />
      </Case>
      <Case title="연결 끊김">
        <Demo initial="入口の近くで降ろしてください" disabled />
      </Case>
      <Case title="오류">
        <Demo initial="入口の近くで降ろしてください" error="번역하지 못했어요. 잠시 뒤에 다시 보내 주세요." />
      </Case>
    </Cases>
  ),
};
