import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { COPY } from '../../copy';
import { failing, fakeApi, memorySession, pending } from '../fakes';
import { W1 } from './W1';

const meta = {
  title: '폰 웹/W1 QR 입장',
  component: W1,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
  args: { pairCode: '7KQ4M9XT', api: fakeApi(), session: memorySession(null), navigate: fn() },
} satisfies Meta<typeof W1>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('heading', { level: 1, name: COPY.pairTitle });
    const connect = canvas.getByRole('button', { name: COPY.connect });
    await expect(connect).toBeDisabled();
    await expect(canvas.getByRole('checkbox', { name: COPY.recordLabel })).not.toBeChecked();
    await expect(canvas.getByRole('switch', { name: new RegExp(COPY.memoryLabel) })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: COPY.recordLabel }));
    await userEvent.click(connect);
    await waitFor(() => expect(args.navigate).toHaveBeenCalledWith('/p/done'));
  },
};

export const Invalid: Story = { args: { pairCode: null } };

export const Expired: Story = {
  args: { api: fakeApi({ getPairing: () => Promise.resolve({ status: 'unknown', character: { name: '헤이파리', bodyColor: 0 } }) }) },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText(COPY.invalidTitle);
  },
};

export const Loading: Story = { args: { api: fakeApi({ getPairing: pending }) } };

export const LoadFailed: Story = { args: { api: fakeApi({ getPairing: failing() }) } };

export const ClaimFailed: Story = {
  args: { api: fakeApi({ claim: failing() }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('checkbox', { name: COPY.recordLabel }));
    await userEvent.click(canvas.getByRole('switch', { name: new RegExp(COPY.memoryLabel) }));
    await userEvent.click(canvas.getByRole('button', { name: COPY.connect }));
    await canvas.findByText(COPY.pairFailed);
    await expect(canvas.getByRole('checkbox', { name: COPY.recordLabel })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: new RegExp(COPY.memoryLabel) })).toBeChecked();
  },
};

export const Submitting: Story = {
  args: { api: fakeApi({ claim: pending }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('checkbox', { name: COPY.recordLabel }));
    await userEvent.click(canvas.getByRole('button', { name: COPY.connect }));
  },
};
