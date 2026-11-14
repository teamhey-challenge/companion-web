import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';
import { Inline } from '../Inline/Inline';
import { Section } from '../Section/Section';
import { Text } from '../Text/Text';
import { LONG_KO, Phone } from '../../internal/showcase';
import { AppFrame } from './AppFrame';

const meta = {
  title: '웹 부품/기반/AppFrame',
  component: AppFrame,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppFrame>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = { online: '연결됨', reconnecting: '다시 연결하는 중', offline: '연결 끊김' };

const header = (
  <Inline gap={16} justify="between">
    <Text variant="label" tone="muted">{'헤이파리'}</Text>
    <ConnectionIndicator status="online" labels={labels} />
  </Inline>
);

const footer = (
  <Button variant="primary" size="lg">
    {'연결하기'}
  </Button>
);

function Short() {
  return (
    <Section title="헤이파리가 기억해요">
      <Card padding={16}>
        <Text variant="heading">{'강아지 이름은 별이야'}</Text>
        <Text variant="caption" tone="muted">
          {'11월 1일에 알려 주셨어요'}
        </Text>
      </Card>
    </Section>
  );
}

function Long() {
  return (
    <>
      <Short />
      {Array.from({ length: 8 }, (_, i) => (
        <Section key={i} title={`섹션 ${i + 1}`}>
          <Card padding={16}>
            <Text variant="bodyStrong">{'주말에는 공원에 가요'}</Text>
            <Text variant="body" tone="muted">
              {LONG_KO}
            </Text>
          </Card>
        </Section>
      ))}
    </>
  );
}

export const Default: Story = {
  args: { header, footer, children: <Short /> },
};

export const LongScrolling: Story = {
  name: '긴 내용 (스크롤, 막대 고정)',
  args: { header, footer, children: <Long /> },
};

export const NoFooter: Story = {
  name: '고정 막대 없음',
  args: { header, children: <Short /> },
};

export const LongText: Story = {
  name: '긴 글 (띄어쓰기 없음)',
  args: {
    header,
    footer,
    children: (
      <Card padding={16}>
        <Text variant="body">
          {LONG_KO}
        </Text>
      </Card>
    ),
  },
};

export const AllStates: Story = {
  name: 'All states',
  args: { header, footer, children: <Short /> },
  parameters: {
    layout: 'padded',
    // 한 문서에 휴대폰 틀 둘을 나란히 놓은 모음 이야기라 banner·main 이 둘이다. 실제 화면은 틀이 하나라 이 규칙을 그대로 지킨다.
    a11y: {
      config: {
        rules: [
          { id: 'landmark-no-duplicate-banner', enabled: false },
          { id: 'landmark-no-duplicate-main', enabled: false },
          { id: 'landmark-unique', enabled: false },
        ],
      },
    },
  },
  render: () => (
    <Inline gap={24} align="start" wrap>
      <Phone>
        <AppFrame header={header} footer={footer}>
          <Short />
        </AppFrame>
      </Phone>
      <Phone>
        <AppFrame header={header}>
          <Long />
        </AppFrame>
      </Phone>
    </Inline>
  ),
};
