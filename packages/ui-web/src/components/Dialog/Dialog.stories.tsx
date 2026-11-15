import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_KO } from '../../internal/showcase';
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
  parameters: { layout: 'padded' },
  render: () => <Demo opener="연결 끊기" title="연결을 끊을까요?" message="끊으면 이 폰에서 기억을 볼 수 없어요." confirm="연결 끊기" tone="danger" />,
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: '나가기' });
    await userEvent.click(opener);
    const dialog = await within(document.body).findByRole('alertdialog', { name: '연결을 끊을까요?' });
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
  name: '긴 글 (띄어쓰기 없음)',
  render: () => <Demo opener="긴 글 대화상자" title={LONG_KO} message={LONG_KO} confirm="확인" startOpen />,
};

export const AllStates: Story = {
  name: 'All states',
  parameters: { layout: 'padded' },
  render: () => (
    <Cases>
      <Case title="기본 / 위험">
        <Demo opener="기본 대화상자" title="기억을 저장할까요?" message="헤이리가 다음 대화부터 기억해요." confirm="저장하기" />
        <Demo opener="위험 대화상자" title="기억을 모두 지울까요?" message="지우면 헤이리가 지난 대화를 잊어요." confirm="모두 지우기" tone="danger" />
      </Case>
    </Cases>
  ),
};
