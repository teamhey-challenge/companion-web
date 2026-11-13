import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ICON_NAMES } from '../Icon/Icon';
import { Inline } from '../Inline/Inline';
import { Case, Cases } from '../../internal/showcase';
import { IconButton } from './IconButton';

const meta = {
  title: '웹 부품/행동/IconButton',
  component: IconButton,
  args: { icon: 'menu', label: '메뉴 열기', onClick: fn() },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '메뉴 열기' }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: '메뉴 열기' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {(['ghost', 'secondary'] as const).map((variant) => (
        <Case key={variant} title={variant}>
          <Inline gap={8} wrap>
            <IconButton icon="menu" label="메뉴 열기" variant={variant} />
            <IconButton icon="close" label="닫기" variant={variant} />
            <IconButton icon="refresh" label="다시 불러오기" variant={variant} disabled />
            <IconButton icon="speaker" label="다시 듣기" variant={variant} />
          </Inline>
        </Case>
      ))}
      <Case title="모든 아이콘">
        <Inline gap={4} wrap>
          {ICON_NAMES.map((n) => (
            <IconButton key={n} icon={n} label={n} />
          ))}
        </Inline>
      </Case>
    </Cases>
  ),
};
