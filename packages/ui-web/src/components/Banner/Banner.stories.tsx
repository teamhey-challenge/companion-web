import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { Banner } from './Banner';

const meta = {
  title: '웹 부품/표시/Banner',
  component: Banner,
  args: { tone: 'info', message: '차가 멈추면 다시 확인해요.' },
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { name: '긴 글', args: { tone: 'warning', title: LONG_KO, message: LONG_KO_SPACED } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {(['info', 'warning', 'danger', 'success'] as const).map((tone) => (
        <Case key={tone} title={tone}>
          <Banner tone={tone} message="차가 멈추면 다시 확인해요." />
          <Banner tone={tone} title="연결이 불안정해요" message="잠시 뒤 자동으로 다시 연결해요." />
          <Banner
            tone={tone}
            title="다시 시도해 주세요"
            message="기억을 불러오지 못했어요."
            action={
              <Button variant="secondary" icon="refresh">
                {'다시 보내기'}
              </Button>
            }
          />
        </Case>
      ))}
      <Case title="긴 글 (띄어쓰기 없음)">
        <Banner tone="warning" title={LONG_KO} message={LONG_KO} />
        <Banner tone="danger" message={LONG_KO_SPACED} />
      </Case>
    </Cases>
  ),
};
