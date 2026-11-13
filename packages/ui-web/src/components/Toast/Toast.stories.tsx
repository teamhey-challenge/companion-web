import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { Toast } from './Toast';

const meta = {
  title: '웹 부품/겹침/Toast',
  component: Toast,
  parameters: { layout: 'fullscreen' },
  args: { open: true, message: '링크를 복사했어요', onDismiss: () => undefined },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ message, tone, label }: { message: string; tone?: 'default' | 'success' | 'danger'; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Toast open={open} message={message} tone={tone} onDismiss={() => setOpen(false)} />
    </>
  );
}

export const Default: Story = {};

export const LongText: Story = { name: '긴 글 (일본어)', args: { open: true, message: LONG_JA } };

export const AllStates: Story = {
  name: 'All states',
  args: { open: false },
  parameters: { layout: 'padded' },
  render: () => (
    <Cases>
      <Case title="누르면 4초 뒤 사라져요">
        <Stack gap={8} align="start">
          <Demo label="기본" message="링크를 복사했어요" />
          <Demo label="성공" tone="success" message="기사님께 전했어요" />
          <Demo label="오류" tone="danger" message="보내지 못했어요. 다시 시도해 주세요." />
          <Demo label="긴 글" message={LONG_JA} />
        </Stack>
      </Case>
    </Cases>
  ),
};
