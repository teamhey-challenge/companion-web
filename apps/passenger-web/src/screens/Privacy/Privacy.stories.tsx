import type { Meta, StoryObj } from '@storybook/react-vite';
import { Privacy } from './Privacy';

const meta = {
  title: '폰 웹/개인정보 처리 안내',
  component: Privacy,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
} satisfies Meta<typeof Privacy>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
