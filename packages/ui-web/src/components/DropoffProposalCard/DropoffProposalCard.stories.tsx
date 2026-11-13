import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, CaseGrid, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { DropoffProposalCard, type DropoffProposalLabels } from './DropoffProposalCard';

const labels: DropoffProposalLabels = {
  badge: '기사님 제안',
  ok: '여기서 내릴게요',
  elsewhere: '다른 곳이 좋아요',
  unsure: '잘 모르겠어요',
  later: '나중에 정하기',
  noReason: '기사님이 이유를 적지 않았어요.',
  states: { ok: '여기로 정했어요', elsewhere: '다른 곳을 원했어요', unsure: '잘 모르겠다고 했어요', superseded: '새 제안으로 바뀌었어요' },
};

const meta = {
  title: '웹 부품/HEY/DropoffProposalCard',
  component: DropoffProposalCard,
  args: {
    label: '롯데호텔 서울 본관 정문 앞 택시 승강장',
    state: { status: 'pending' },
    reasonText: '정문 앞은 공사 중이라 승강장에서 내리시는 게 안전해요.',
    distanceLabel: '목적지에서 25 m',
    labels,
    onRespond: fn(),
    onLater: fn(),
  },
} satisfies Meta<typeof DropoffProposalCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '다른 곳이 좋아요' }));
    await expect(args.onRespond).toHaveBeenCalledWith('elsewhere');
    await userEvent.click(canvas.getByRole('button', { name: '나중에 정하기' }));
    await expect(args.onLater).toHaveBeenCalledTimes(1);
  },
};

export const LongText: Story = {
  name: '긴 글',
  args: {
    label: LONG_KO,
    reasonText: LONG_JA,
    distanceLabel: '목적지에서 약 1.2 km 떨어져 있어요',
    labels: {
      ...labels,
      ok: 'Drop me off right here at this exact spot please',
      elsewhere: 'I would like to get off somewhere else nearby',
      unsure: LONG_JA,
    },
  },
};

export const Disabled: Story = {
  name: '비활성 (오프라인)',
  args: { state: { status: 'pending', disabled: true } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '여기서 내릴게요' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: '나중에 정하기' }));
    await expect(args.onLater).toHaveBeenCalledTimes(1);
  },
};

export const Loading: Story = {
  name: '보내는 중',
  args: { state: { status: 'pending', responding: 'ok' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '여기서 내릴게요' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: '다른 곳이 좋아요' })).toBeDisabled();
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: (args) => (
    <CaseGrid>
      <Case title="pending">
        <DropoffProposalCard {...args} />
      </Case>
      <Case title="pending · 이유 없음, 거리 없음, 나중에 없음">
        <DropoffProposalCard {...args} reasonText={undefined} distanceLabel={undefined} onLater={undefined} />
      </Case>
      <Case title="pending · 비활성">
        <DropoffProposalCard {...args} state={{ status: 'pending', disabled: true }} />
      </Case>
      <Case title="pending · 다른 곳 보내는 중">
        <DropoffProposalCard {...args} state={{ status: 'pending', responding: 'elsewhere' }} />
      </Case>
      {(['ok', 'elsewhere', 'unsure', 'superseded'] as const).map((status) => (
        <Case key={status} title={status}>
          <DropoffProposalCard {...args} state={{ status }} />
        </Case>
      ))}
    </CaseGrid>
  ),
};

export const Stacked: Story = {
  name: '긴 일본어 이유',
  render: (args) => (
    <Cases>
      <DropoffProposalCard {...args} reasonText={LONG_JA} />
    </Cases>
  ),
};
