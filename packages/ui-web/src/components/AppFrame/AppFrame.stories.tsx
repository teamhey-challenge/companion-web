import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';
import { Inline } from '../Inline/Inline';
import { KeyValueRow } from '../KeyValueRow/KeyValueRow';
import { Section } from '../Section/Section';
import { Text } from '../Text/Text';
import { Wordmark } from '../Wordmark/Wordmark';
import { LONG_JA, Phone } from '../../internal/showcase';
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
    <Wordmark partySize={2} size="md" animate={false} />
    <ConnectionIndicator status="online" labels={labels} />
  </Inline>
);

const footer = (
  <Button variant="primary" size="lg">
    {'기사님께 보내기'}
  </Button>
);

function Short() {
  return (
    <Section title="목적지">
      <Card padding={16}>
        <Text variant="heading">{'롯데호텔 서울'}</Text>
        <Text variant="caption" tone="muted">
          {'서울 중구 을지로 30'}
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
            <KeyValueRow label="도착 예정" value="오후 3:42" icon="clock" />
            <Text variant="body" tone="muted" lang="ja">
              {LONG_JA}
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
  name: '긴 글 (일본어, 띄어쓰기 없음)',
  args: {
    header,
    footer,
    children: (
      <Card padding={16}>
        <Text variant="body" lang="ja">
          {LONG_JA}
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
