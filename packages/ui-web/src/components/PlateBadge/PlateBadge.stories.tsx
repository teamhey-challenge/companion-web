import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, CaseRow, Cases } from '../../internal/showcase';
import { PlateBadge } from './PlateBadge';

const meta = { title: '웹 부품/표시/PlateBadge', component: PlateBadge, args: { plateSuffix: '1234' } } satisfies Meta<typeof PlateBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { name: '빈 값', args: { plateSuffix: '' } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="4자리">
        <CaseRow>
          <PlateBadge plateSuffix="1234" />
          <PlateBadge plateSuffix="0007" />
          <PlateBadge plateSuffix="9999" />
        </CaseRow>
      </Case>
      <Case title="짧은 값 · 빈 값">
        <CaseRow>
          <PlateBadge plateSuffix="12" />
          <PlateBadge plateSuffix="" />
        </CaseRow>
      </Case>
    </Cases>
  ),
};
