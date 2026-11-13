import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Case, CaseGrid, Cases, LONG_JA } from '../../internal/showcase';
import { ConditionSummary, type ConditionItems } from './ConditionSummary';

const ONE: ConditionItems = [{ icon: 'door', label: '호텔 정문 앞에서 만나요' }];
const QUIET: ConditionItems[number] = { icon: 'quiet', label: '조용히 가 주세요' };
const MANY: ConditionItems = [
  { icon: 'music', label: '음악은 작게 해 주세요' },
  QUIET,
  { icon: 'door', label: '호텔 정문 3번 출입구 앞에서 만나요' },
  { icon: 'thermometer-cool', label: '조금 시원하게 해 주세요' },
];

const meta = {
  title: '웹 부품/HEY/ConditionSummary',
  component: ConditionSummary,
  args: { label: '요청한 조건', items: ONE },
} satisfies Meta<typeof ConditionSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items: [MANY[0], QUIET] } };

/** 조건이 하나도 없으면 화면이 이 부품을 그리지 않는다(빈 목록은 타입으로 막혀 있다). */
export const Empty: Story = {
  name: '조건 없음 (화면이 그리지 않음)',
  render: () => (
    <Card padding={16}>
      <Case title="빈 목록 자리">
        <ConditionSummary label="요청한 조건" items={ONE} />
      </Case>
    </Card>
  ),
};

export const Many: Story = { name: '조건 4개', args: { items: MANY } };

export const LongText: Story = {
  name: '긴 글 (일본어)',
  args: { items: [{ icon: 'door', label: LONG_JA }, QUIET] },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <CaseGrid>
        <Case title="1개">
          <Card padding={16}>
            <ConditionSummary label="요청한 조건" items={ONE} />
          </Card>
        </Case>
        <Case title="4개">
          <Card padding={16}>
            <ConditionSummary label="요청한 조건" items={MANY} />
          </Card>
        </Case>
        <Case title="긴 글 (일본어)">
          <Card padding={16}>
            <ConditionSummary label="要望" items={[{ icon: 'door', label: LONG_JA }, QUIET]} />
          </Card>
        </Case>
      </CaseGrid>
    </Cases>
  ),
};
