import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Case, CaseRow, Cases } from '../../internal/showcase';
import { PartySizePicker, type PartySize } from './PartySizePicker';

const meta = {
  title: '웹 부품/행동/PartySizePicker',
  component: PartySizePicker,
  args: {
    value: 1,
    onChange: () => undefined,
    label: '탑승 인원',
    decreaseLabel: '한 명 줄이기',
    increaseLabel: '한 명 늘리기',
    unit: '명',
  },
} satisfies Meta<typeof PartySizePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial }: { initial: PartySize }) {
  const [value, setValue] = useState<PartySize>(initial);
  return (
    <PartySizePicker
      value={value}
      onChange={setValue}
      label="탑승 인원"
      decreaseLabel="한 명 줄이기"
      increaseLabel="한 명 늘리기"
      unit="명"
    />
  );
}

export const Default: Story = {
  render: () => <Demo initial={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dec = canvas.getByRole('button', { name: '한 명 줄이기' });
    const inc = canvas.getByRole('button', { name: '한 명 늘리기' });
    await expect(dec).toBeDisabled();
    await userEvent.click(inc);
    await userEvent.click(inc);
    await userEvent.click(inc);
    await expect(canvas.getByRole('img', { name: 'HEY' })).toBeInTheDocument();
    await expect(inc).toBeDisabled();
    await expect(canvas.getByText('4')).toBeInTheDocument();
    await userEvent.click(dec);
    await expect(canvas.getByText('3')).toBeInTheDocument();
    await expect(inc).toBeEnabled();
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="1명 (줄이기 비활성)">
        <PartySizePicker value={1} onChange={() => undefined} label="탑승 인원" decreaseLabel="한 명 줄이기" increaseLabel="한 명 늘리기" unit="명" />
      </Case>
      <Case title="2·3명">
        <CaseRow>
          <Demo initial={2} />
          <Demo initial={3} />
        </CaseRow>
      </Case>
      <Case title="4명 (늘리기 비활성)">
        <PartySizePicker value={4} onChange={() => undefined} label="탑승 인원" decreaseLabel="한 명 줄이기" increaseLabel="한 명 늘리기" unit="명" />
      </Case>
      <Case title="영어 단위">
        <PartySizePicker value={3} onChange={() => undefined} label="Passengers" decreaseLabel="Remove one" increaseLabel="Add one" unit="people" />
      </Case>
    </Cases>
  ),
};
