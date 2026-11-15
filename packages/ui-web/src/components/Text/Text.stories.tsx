import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Case, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { Text, type TextTone, type TextVariant } from './Text';

const meta = {
  title: '웹 부품/글자·브랜드/Text',
  component: Text,
  args: { variant: 'body', children: '오늘도 같이 가요.' },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: TextVariant[] = ['display', 'title', 'heading', 'body', 'bodyStrong', 'label', 'caption'];
const TONES: TextTone[] = ['default', 'muted', 'subtle', 'accent', 'danger', 'success'];

export const Default: Story = {};

export const Variants: Story = {
  name: '모든 변형',
  render: () => (
    <Stack gap={16}>
      {VARIANTS.map((v) => (
        <Case key={v} title={v}>
          <Text variant={v}>{'강아지 이름은 별이야'}</Text>
        </Case>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  name: '모든 톤',
  render: () => (
    <Stack gap={8}>
      {TONES.map((t) => (
        <Text key={t} variant="bodyStrong" tone={t}>
          {`tone ${t} — 헤이리가 확인했어요`}
        </Text>
      ))}
    </Stack>
  ),
};

export const LongText: Story = {
  name: '긴 글 (띄어쓰기 없음 120자+)',
  render: () => (
    <Cases>
      <Case title="띄어쓰기 없음 body">
        <Text variant="body">{LONG_KO}</Text>
      </Case>
      <Case title="띄어쓰기 있음 body">
        <Text variant="body">{LONG_KO_SPACED}</Text>
      </Case>
      <Case title="띄어쓰기 없음 display">
        <Text variant="display">
          {LONG_KO}
        </Text>
      </Case>
      <Case title="한 단어 긴 URL">
        <Text variant="body">{'https://example.com/p/ABCDEFGHJKMNPQRSTUVWXYZ23456789ABCDEFGHJKMNPQRSTUVWXYZ23456789'}</Text>
      </Case>
    </Cases>
  ),
};

export const Truncate: Story = {
  name: '줄임 (1줄 · 2줄)',
  render: () => (
    <Cases>
      <Case title="1줄 · 띄어쓰기 없음">
        <Text variant="body" truncate={1}>
          {LONG_KO}
        </Text>
      </Case>
      <Case title="2줄 · 띄어쓰기 있음">
        <Text variant="body" truncate={2}>
          {LONG_KO_SPACED}
        </Text>
      </Case>
      <Case title="짧은 글은 그대로">
        <Text variant="body" truncate={1}>
          {'짧아요'}
        </Text>
      </Case>
    </Cases>
  ),
};

export const Empty: Story = {
  name: '빈 값',
  args: { children: '' },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {VARIANTS.map((v) => (
        <Case key={v} title={`${v} × tone`}>
          <Stack gap={4}>
            {TONES.map((t) => (
              <Text key={t} variant={v} tone={t}>
                {`${t}`}
              </Text>
            ))}
          </Stack>
        </Case>
      ))}
    </Cases>
  ),
};
