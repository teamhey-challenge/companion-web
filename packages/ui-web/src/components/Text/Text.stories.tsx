import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Case, Cases, LONG_EN, LONG_JA, LONG_KO, LONG_ZH } from '../../internal/showcase';
import { Text, type TextTone, type TextVariant } from './Text';

const meta = {
  title: '웹 부품/글자·브랜드/Text',
  component: Text,
  args: { variant: 'body', children: '내릴 곳까지, 같은 뜻으로.' },
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
          <Text variant={v}>{'공항에서 호텔까지 가 주세요'}</Text>
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
          {`tone ${t} — 헤이파리가 확인했어요`}
        </Text>
      ))}
    </Stack>
  ),
};

export const LongText: Story = {
  name: '긴 글 (일본어·중국어 띄어쓰기 없음 120자+)',
  render: () => (
    <Cases>
      <Case title="ja body">
        <Text variant="body" lang="ja">
          {LONG_JA}
        </Text>
      </Case>
      <Case title="zh-Hans body">
        <Text variant="body" lang="zh-Hans">
          {LONG_ZH}
        </Text>
      </Case>
      <Case title="ko 띄어쓰기 없음 body">
        <Text variant="body" lang="ko">
          {LONG_KO}
        </Text>
      </Case>
      <Case title="en body">
        <Text variant="body" lang="en">
          {LONG_EN}
        </Text>
      </Case>
      <Case title="ja display">
        <Text variant="display" lang="ja">
          {LONG_JA}
        </Text>
      </Case>
      <Case title="한 단어 긴 URL">
        <Text variant="body">{'https://hey.example.com/t/ABCDEFGHJKMNPQRSTUVWXYZ23456789ABCDEFGHJKMNPQRSTUVWXYZ23456789'}</Text>
      </Case>
    </Cases>
  ),
};

export const Truncate: Story = {
  name: '줄임 (1줄 · 2줄)',
  render: () => (
    <Cases>
      <Case title="truncate 1 · ja">
        <Text variant="body" truncate={1} lang="ja">
          {LONG_JA}
        </Text>
      </Case>
      <Case title="truncate 2 · zh">
        <Text variant="body" truncate={2} lang="zh-Hans">
          {LONG_ZH}
        </Text>
      </Case>
      <Case title="truncate 2 · ko">
        <Text variant="body" truncate={2}>
          {LONG_KO}
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
