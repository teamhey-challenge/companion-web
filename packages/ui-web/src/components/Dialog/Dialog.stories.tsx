import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { Dialog } from './Dialog';

const meta = {
  title: '웹 부품/겹침/Dialog',
  component: Dialog,
  parameters: { layout: 'fullscreen' },
  args: { open: false, title: '', message: '', confirm: '확인', cancel: '취소', onConfirm: () => undefined, onCancel: () => undefined },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({
  title,
  message,
  confirm,
  tone,
  opener,
  startOpen = false,
}: {
  title: string;
  message: string;
  confirm: string;
  tone?: 'default' | 'danger';
  opener: string;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [result, setResult] = useState('');
  return (
    <Stack gap={16} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {opener}
      </Button>
      <Text variant="caption" tone="muted">
        {result}
      </Text>
      <Dialog
        open={open}
        title={title}
        message={message}
        confirm={confirm}
        cancel="취소"
        tone={tone}
        onConfirm={() => {
          setResult('확인함');
          setOpen(false);
        }}
        onCancel={() => {
          setResult('취소함');
          setOpen(false);
        }}
      />
    </Stack>
  );
}

export const Default: Story = {
  render: () => <Demo opener="나가기" title="운행에서 나갈까요?" message="나가면 이 운행 내용을 다시 볼 수 없어요." confirm="나가기" tone="danger" />,
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: '나가기' });
    await userEvent.click(opener);
    const dialog = await within(document.body).findByRole('alertdialog', { name: '운행에서 나갈까요?' });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    for (let i = 0; i < 5; i += 1) {
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('alertdialog')).toBeNull());
    await expect(opener).toHaveFocus();
    await expect(within(canvasElement).getByText('취소함')).toBeInTheDocument();
    await userEvent.click(opener);
    await expect(await within(document.body).findByRole('alertdialog')).toBeInTheDocument();
  },
};

export const LongText: Story = {
  name: '긴 글 (일본어)',
  render: () => <Demo opener="긴 글 대화상자" title={LONG_JA} message={LONG_JA} confirm="확인" startOpen />,
};

export const AllStates: Story = {
  name: 'All states',
  parameters: { layout: 'padded' },
  render: () => (
    <Cases>
      <Case title="기본 / 위험">
        <Demo opener="기본 대화상자" title="요청을 보낼까요?" message="기사님께 한국어로 전해져요." confirm="보내기" />
        <Demo opener="위험 대화상자" title="운행을 끝낼까요?" message="끝내면 승객 기기에서 연결이 끊어져요." confirm="운행 끝내기" tone="danger" />
      </Case>
    </Cases>
  ),
};
