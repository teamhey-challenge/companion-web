import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { COPY } from '../../copy';
import { memorySession } from '../fakes';
import { W2 } from './W2';

const meta = {
  title: '폰 웹/W2 연결 완료',
  component: W2,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
  args: { session: memorySession('t') },
} satisfies Meta<typeof W2>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: COPY.doneTitle })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: COPY.doneMemory })).toHaveAttribute('href', '/me/memory');
  },
};

export const NotPaired: Story = { args: { session: memorySession(null) } };
