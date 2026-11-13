import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { Menu } from './Menu';

const items = [
  { id: 'dest', label: '목적지 바꾸기', icon: 'pin' as const },
  { id: 'lang', label: '언어 바꾸기', icon: 'globe' as const },
  { id: 'invite', label: '일행 초대하기', icon: 'users' as const },
  { id: 'leave', label: '운행에서 나가기', icon: 'logout' as const, tone: 'danger' as const },
];

const meta = { title: '웹 부품/겹침/Menu', component: Menu, args: { items, onSelect: fn() } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '언어 바꾸기' }));
    await expect(args.onSelect).toHaveBeenCalledWith('lang');
  },
};

export const LongText: Story = {
  name: '긴 라벨 (일본어)',
  args: { items: [{ id: 'a', label: LONG_JA, icon: 'info' }] },
};

export const Empty: Story = { name: '0개', args: { items: [] } };

export const Many: Story = {
  name: '많음 (12개)',
  args: { items: Array.from({ length: 12 }, (_, i) => ({ id: `m${i}`, label: `메뉴 항목 ${i + 1}`, icon: 'info' as const })) },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="1개">
        <Menu items={items.slice(0, 1)} onSelect={() => undefined} />
      </Case>
      <Case title="4개 (마지막은 danger)">
        <Menu items={items} onSelect={() => undefined} />
      </Case>
      <Case title="긴 라벨 (일본어)">
        <Menu items={[{ id: 'a', label: LONG_JA, icon: 'info' }]} onSelect={() => undefined} />
      </Case>
      <Case title="0개">
        <Menu items={[]} onSelect={() => undefined} />
      </Case>
    </Cases>
  ),
};
