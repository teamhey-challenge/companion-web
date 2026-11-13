import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { COPY } from '../../copy';
import { W1 } from './W1';

const meta = {
  title: '폰 웹/W1 QR 입장',
  component: W1,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
} satisfies Meta<typeof W1>;
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
