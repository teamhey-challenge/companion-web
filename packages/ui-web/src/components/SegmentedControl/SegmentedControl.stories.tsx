import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: '웹 부품/행동/SegmentedControl',
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ options, initial, label }: { options: Array<{ value: string; label: string }>; initial: string; label: string }) {
  const [value, setValue] = useState(initial);
  return <SegmentedControl options={options} value={value} onChange={setValue} label={label} />;
}

const three = [
  { value: 'auto', label: '자동' },
  { value: 'light', label: '밝게' },
  { value: 'dark', label: '어둡게' },
];

export const Default: Story = {
  args: { options: three, value: 'auto', onChange: () => undefined, label: '화면 테마' },
  render: () => <Demo options={three} initial="auto" label="화면 테마" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const auto = canvas.getByRole('radio', { name: '자동' });
    await expect(auto).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: '어둡게' }));
    await expect(canvas.getByRole('radio', { name: '어둡게' })).toHaveAttribute('aria-checked', 'true');
    await expect(auto).toHaveAttribute('aria-checked', 'false');
    // 방향키: 오른쪽 끝에서 처음으로 돌아가고 바로 선택된다.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: '자동' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: '자동' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('radio', { name: '어둡게' })).toHaveAttribute('aria-checked', 'true');
  },
};

export const LongText: Story = {
  name: '긴 라벨 (띄어쓰기 없음)',
  args: { options: three, value: 'a', onChange: () => undefined, label: '긴 라벨' },
  render: () => (
    <Demo
      label="긴 라벨"
      initial="a"
      options={[
        { value: 'a', label: LONG_KO.slice(0, 40) },
        { value: 'b', label: LONG_KO_SPACED.slice(0, 30) },
        { value: 'c', label: 'Almost there' },
      ]}
    />
  ),
};

export const AllStates: Story = {
  name: 'All states',
  args: { options: three, value: 'auto', onChange: () => undefined, label: '화면 테마' },
  render: () => (
    <Cases>
      <Case title="2개">
        <Demo
          label="단위"
          initial="km"
          options={[
            { value: 'km', label: 'km' },
            { value: 'mi', label: 'mile' },
          ]}
        />
      </Case>
      <Case title="3개">
        <Demo label="화면 테마" initial="auto" options={three} />
      </Case>
      <Case title="4개 (언어)">
        <Demo
          label="언어"
          initial="ja"
          options={[
            { value: 'en', label: 'English' },
            { value: 'ja', label: '日本語' },
            { value: 'zh', label: '简体中文' },
            { value: 'ko', label: '한국어' },
          ]}
        />
      </Case>
      <Case title="긴 라벨 (줄바꿈)">
        <Demo
          label="긴 라벨"
          initial="a"
          options={[
            { value: 'a', label: LONG_KO.slice(0, 40) },
            { value: 'b', label: LONG_KO_SPACED.slice(0, 30) },
            { value: 'c', label: 'Almost there' },
          ]}
        />
      </Case>
    </Cases>
  ),
};
