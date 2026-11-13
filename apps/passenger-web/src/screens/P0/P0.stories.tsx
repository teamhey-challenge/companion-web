import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { COPY } from '../../copy';
import { P0 } from './P0';

const meta = {
  title: '승객 화면/P0 QR 입장',
  component: P0,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
} satisfies Meta<typeof P0>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { pairCode: '7KQ4M9XT' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('7KQ4M9XT')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: COPY.pairTitle })).toBeInTheDocument();
  },
};

export const Invalid: Story = { args: { pairCode: null } };
