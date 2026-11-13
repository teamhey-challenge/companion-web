import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Menu } from '../Menu/Menu';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { BottomSheet } from './BottomSheet';

const meta = {
  title: '웹 부품/겹침/BottomSheet',
  component: BottomSheet,
  parameters: { layout: 'fullscreen' },
  args: { open: false, onClose: () => undefined, title: '', closeLabel: '닫기' },
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({
  title,
  body,
  footer,
  dismissible = true,
  startOpen = false,
  opener = '시트 열기',
}: {
  title: string;
  body: ReactNode;
  footer?: ReactNode;
  dismissible?: boolean;
  startOpen?: boolean;
  opener?: string;
}) {
  const [open, setOpen] = useState(startOpen);
  return (
    <Stack gap={16}>
      <Text variant="body">{'시트 뒤 페이지 내용이에요. 시트가 열리면 누를 수 없어요.'}</Text>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {opener}
      </Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={title} closeLabel="닫기" footer={footer} dismissible={dismissible}>
        {body}
      </BottomSheet>
    </Stack>
  );
}

const short = <Text variant="body">{'헤이파리가 기억을 확인하는 중이에요.'}</Text>;
const long = (
  <>
    {Array.from({ length: 14 }, (_, i) => (
      <Text key={i} variant="body" lang="ja">
        {LONG_JA}
      </Text>
    ))}
  </>
);

export const Default: Story = {
  render: () => <Demo title="내릴 곳을 골라 주세요" body={short} footer={<Button variant="primary">{'여기 좋아요'}</Button>} />,
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: '시트 열기' });
    await userEvent.click(opener);
    const dialog = await within(document.body).findByRole('dialog', { name: '내릴 곳을 골라 주세요' });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    // 뒤 페이지는 inert
    await expect(canvasElement).toHaveAttribute('inert');
    // 초점이 시트 안으로
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    // 초점 가둠: Tab을 여러 번 눌러도 시트를 벗어나지 않는다
    for (let i = 0; i < 6; i += 1) {
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
    }
    // Esc가 닫고 초점이 연 단추로 돌아온다
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
    await expect(opener).toHaveFocus();
    await expect(canvasElement).not.toHaveAttribute('inert');
  },
};

export const NotDismissible: Story = {
  name: '닫기 불가 (응답 필요)',
  render: () => (
    <Demo
      title="이 기억을 지울까요?"
      body={short}
      dismissible={false}
      footer={<Button variant="primary">{'여기 좋아요'}</Button>}
      startOpen
    />
  ),
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeInTheDocument();
    await expect(within(dialog).queryByRole('button', { name: '닫기' })).toBeNull();
  },
};

export const LongText: Story = {
  name: '긴 내용 (본문만 스크롤, 막대 고정)',
  render: () => <Demo title={LONG_JA.slice(0, 40)} body={long} footer={<Button variant="primary">{'확인'}</Button>} startOpen />,
};

export const OpenWithMenu: Story = {
  name: '메뉴가 들어간 시트',
  render: () => (
    <Demo
      title="메뉴"
      startOpen
      body={
        <Menu
          onSelect={() => undefined}
          items={[
            { id: 'dest', label: '목적지 바꾸기', icon: 'pin' },
            { id: 'lang', label: '언어 바꾸기', icon: 'globe' },
            { id: 'leave', label: '연결 끊기', icon: 'logout', tone: 'danger' },
          ]}
        />
      }
    />
  ),
};

export const LongTitleKo: Story = {
  name: '긴 제목 (한국어 띄어쓰기 없음)',
  render: () => <Demo title={LONG_KO} body={short} startOpen />,
};

export const AllStates: Story = {
  name: 'All states',
  parameters: { layout: 'padded' },
  render: () => (
    <Cases>
      <Case title="위 이야기를 하나씩 열어 보세요 (시트는 화면 전체를 덮어요)">
        <Demo title="짧은 내용" body={short} footer={<Button variant="primary">{'확인'}</Button>} opener="짧은 시트" />
        <Demo title="긴 내용" body={long} footer={<Button variant="primary">{'확인'}</Button>} opener="긴 시트" />
        <Demo title="응답 필요" body={short} dismissible={false} footer={<Button variant="primary">{'여기 좋아요'}</Button>} opener="닫기 불가 시트" />
      </Case>
    </Cases>
  ),
};
