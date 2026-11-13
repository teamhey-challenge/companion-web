import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { KeyValueRow } from '../KeyValueRow/KeyValueRow';
import { StatusPill } from '../StatusPill/StatusPill';
import { Text } from '../Text/Text';
import { Case, CaseGrid, Cases, LONG_JA } from '../../internal/showcase';
import { Card } from './Card';

const meta = { title: '웹 부품/표시/Card', component: Card, args: { padding: 16 } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

function Content() {
  return (
    <>
      <Text variant="heading">{'롯데호텔 서울'}</Text>
      <Text variant="body" tone="muted">
        {'서울 중구 을지로 30'}
      </Text>
      <KeyValueRow label="도착 예정" value="오후 3:42" icon="clock" />
      <Button variant="secondary">{'자세히'}</Button>
    </>
  );
}

export const Default: Story = { args: { children: <Content /> } };

export const LongText: Story = {
  name: '긴 글 (일본어)',
  args: { children: <Text variant="body">{LONG_JA}</Text> },
};

export const Empty: Story = { name: '내용 없음', args: { children: null } };

export const AllStates: Story = {
  name: 'All states',
  args: { children: null },
  render: () => (
    <Cases>
      <Case title="톤 × 안쪽 여백 16 · 24">
        <CaseGrid>
          {(['default', 'accent', 'inverse', 'sunken'] as const).map((tone) => (
            <Card key={tone} tone={tone} padding={16}>
              <Text variant="caption" tone="muted">
                {`${tone} · 16`}
              </Text>
              <Content />
            </Card>
          ))}
          {(['default', 'accent', 'inverse', 'sunken'] as const).map((tone) => (
            <Card key={`${tone}24`} tone={tone} padding={24}>
              <Text variant="caption" tone="muted">
                {`${tone} · 24`}
              </Text>
              <Content />
            </Card>
          ))}
        </CaseGrid>
      </Case>
      <Case title="긴 글 (일본어)">
        <Card padding={16}>
          <StatusPill tone="info" label="연결 확인 중" />
          <Text variant="body">{LONG_JA}</Text>
        </Card>
      </Case>
      <Case title="내용 없음">
        <Card padding={16}>{null}</Card>
      </Case>
    </Cases>
  ),
};
