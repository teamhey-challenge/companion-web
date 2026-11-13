import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, CaseGrid, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { PresetTile } from './PresetTile';

const meta = {
  title: '웹 부품/행동/PresetTile',
  component: PresetTile,
  args: { icon: 'thermometer-cool', label: '조금 시원하게 해 주세요', kind: 'notice', onPress: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PresetTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
export const Question: Story = {
  args: { kind: 'question', icon: 'door', label: '창문 열어도 될까요?', questionLabel: '기사님 답을 받아요' },
};

export const LongText: Story = {
  name: '긴 라벨 (일본어)',
  args: { label: LONG_JA, kind: 'question', questionLabel: '기사님 답을 받아요' },
};

/** 두 줄 라벨에서도 아이콘 위 여백이 8을 넘지 않는다(칸이 필요 이상 커지지 않게). */
export const TwoLineLabel: Story = {
  name: '두 줄 라벨 (칸 높이)',
  args: { icon: 'thermometer-warm', label: '조금 따뜻하게 해 주실 수 있을까요? 조금만요', kind: 'notice' },
  play: async ({ canvasElement }) => {
    const tile = within(canvasElement).getByRole('button');
    const icon = tile.querySelector('span');
    if (!icon) throw new globalThis.Error('icon missing');
    const gap = icon.getBoundingClientRect().top - tile.getBoundingClientRect().top;
    await expect(gap).toBeLessThanOrEqual(9);
  },
};

export const Disabled: Story = {
  name: '비활성 (보낸 직후)',
  args: { disabled: true },
};

export const AllStates: Story = {
  name: 'All states',
  decorators: [],
  render: () => (
    <Cases>
      <Case title="알림형 · 질문형 · 비활성">
        <CaseGrid>
          <PresetTile icon="thermometer-cool" label="시원하게" kind="notice" onPress={() => undefined} />
          <PresetTile icon="message" label="카드 되나요?" kind="question" questionLabel="기사님 답을 받아요" onPress={() => undefined} />
          <PresetTile icon="speaker" label="보냈어요" kind="notice" disabled onPress={() => undefined} />
        </CaseGrid>
      </Case>
      <Case title="긴 라벨">
        <CaseGrid>
          <PresetTile icon="luggage" label={LONG_JA} kind="notice" onPress={() => undefined} />
          <PresetTile icon="luggage" label={LONG_KO} kind="question" questionLabel="기사님 답을 받아요" onPress={() => undefined} />
        </CaseGrid>
      </Case>
    </Cases>
  ),
};
