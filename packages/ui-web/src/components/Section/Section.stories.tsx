import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { KeyValueRow } from '../KeyValueRow/KeyValueRow';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { Section } from './Section';

const meta = { title: '웹 부품/기반/Section', component: Section } satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

const body = (
  <Card padding={16}>
    <KeyValueRow label="이동 시간" value="38분" icon="clock" />
    <KeyValueRow label="거리" value="21.4km" icon="route" />
  </Card>
);

export const Default: Story = { args: { title: '기억 요약', children: body } };

export const LongText: Story = {
  name: '긴 제목 (일본어)',
  args: { title: LONG_JA, children: body },
};

export const Empty: Story = {
  name: '내용 없음',
  args: { title: '비어 있는 구역', children: null },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="제목만">
        <Section title="기억 요약">{body}</Section>
      </Case>
      <Case title="제목 + 동작">
        <Section
          title="요청 내역"
          action={
            <Button variant="ghost" icon="refresh">
              {'새로고침'}
            </Button>
          }
        >
          {body}
        </Section>
      </Case>
      <Case title="제목 없음">
        <Section>{body}</Section>
      </Case>
      <Case title="긴 제목 (일본어, 띄어쓰기 없음) + 동작">
        <Section
          title={LONG_JA}
          action={
            <Button variant="ghost">
              {'수정'}
            </Button>
          }
        >
          {body}
        </Section>
      </Case>
      <Case title="긴 한국어 제목, 블록 여러 개(간격 24)">
        <Section title={LONG_KO}>
          {body}
          <Text variant="body" tone="muted">
            {'두 번째 블록'}
          </Text>
          {body}
        </Section>
      </Case>
      <Case title="내용 없음">
        <Section title="비어 있는 구역">{null}</Section>
      </Case>
    </Cases>
  ),
};
