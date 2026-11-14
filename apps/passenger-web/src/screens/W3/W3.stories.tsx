import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { COPY } from '../../copy';
import { failing, fakeApi, memorySession, pending } from '../fakes';
import { W3 } from './W3';

const meta = {
  title: '폰 웹/W3 기억 보기',
  component: W3,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
  args: { api: fakeApi(), session: memorySession('t'), onBack: fn() },
} satisfies Meta<typeof W3>;
export default meta;
type Story = StoryObj<typeof meta>;

const body = (el: HTMLElement) => within(el.ownerDocument.body);

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole('button', { name: COPY.memoryDeleteOne })).toHaveLength(3);
  },
};

export const DeleteOne: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = await canvas.findAllByRole('button', { name: COPY.memoryDeleteOne });
    await userEvent.click(buttons[0]!);
    await userEvent.click(await body(canvasElement).findByRole('button', { name: COPY.confirmOneAction }));
    await waitFor(() => expect(canvas.getAllByRole('button', { name: COPY.memoryDeleteOne })).toHaveLength(2));
  },
};

export const DeleteAll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: COPY.memoryDeleteAll }));
    await userEvent.click(await body(canvasElement).findByRole('button', { name: COPY.confirmAllAction }));
    await canvas.findByText(COPY.memoryEmpty);
  },
};

export const Empty: Story = {
  args: { api: fakeApi({ listMemory: () => Promise.resolve([]) }) },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText(COPY.memoryEmpty);
  },
};

export const Loading: Story = { args: { api: fakeApi({ listMemory: pending }) } };

export const LoadFailed: Story = {
  args: { api: fakeApi({ listMemory: failing() }) },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText(COPY.memoryLoadFailed);
  },
};

export const DeleteFailed: Story = {
  args: { api: fakeApi({ deleteMemory: failing() }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = await canvas.findAllByRole('button', { name: COPY.memoryDeleteOne });
    await userEvent.click(buttons[0]!);
    await userEvent.click(await body(canvasElement).findByRole('button', { name: COPY.confirmOneAction }));
    await canvas.findByText(COPY.memoryDeleteFailed);
    await expect(canvas.getAllByRole('button', { name: COPY.memoryDeleteOne })).toHaveLength(3);
  },
};

export const Unpaired: Story = {
  args: { session: memorySession(null) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(COPY.memoryUnpaired);
    await expect(canvas.queryAllByRole('button', { name: COPY.memoryDeleteOne })).toHaveLength(0);
  },
};

export const SessionExpired: Story = {
  args: { api: fakeApi({ listMemory: failing(401) }) },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText(COPY.memoryUnpaired);
  },
};

export const SpeechChange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('radio', { name: COPY.speechJondaetmal }));
    await expect(canvas.getByRole('radio', { name: COPY.speechJondaetmal })).toBeChecked();
  },
};

export const SpeechFailed: Story = {
  args: { api: fakeApi({ patchSettings: failing() }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('radio', { name: COPY.speechJondaetmal }));
    await canvas.findByText(COPY.speechFailed);
    await expect(canvas.getByRole('radio', { name: COPY.speechBanmal })).toBeChecked();
  },
};

export const Unpair: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: COPY.unpair }));
    await userEvent.click(await body(canvasElement).findByRole('button', { name: COPY.unpairAction }));
    await canvas.findByText(COPY.memoryUnpaired);
  },
};
