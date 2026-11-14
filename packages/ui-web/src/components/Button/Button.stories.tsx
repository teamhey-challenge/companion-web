import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, CaseGrid, Cases, LONG_KO, LONG_KO_SPACED } from '../../internal/showcase';
import { Button, type ButtonProps } from './Button';

const meta = {
  title: '웹 부품/행동/Button',
  component: Button,
  args: { variant: 'primary', children: '연결하기', onClick: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: ButtonProps['variant'][] = ['primary', 'accent', 'glass', 'secondary', 'ghost', 'danger'];

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: '연결하기' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { loading: true, children: '보내는 중이에요' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LinkMode: Story = {
  name: '링크 모드 (href)',
  args: { href: 'https://example.com', variant: 'secondary', icon: 'link', children: '이용 안내 열기' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: '이용 안내 열기' });
    await expect(link).toHaveAttribute('href', 'https://example.com');
    await expect(within(canvasElement).queryByRole('button')).toBeNull();
  },
};

export const LongText: Story = {
  name: '긴 라벨 (띄어쓰기 없음·있음)',
  render: () => (
    <Cases>
      <Case title="ja">
        <Stack gap={8}>
          <Button variant="primary">{LONG_KO}</Button>
          <Button variant="secondary" icon="send">
            {LONG_KO}
          </Button>
        </Stack>
      </Case>
      <Case title="zh-Hans">
        <Button variant="accent" size="lg">
          {LONG_KO_SPACED}
        </Button>
      </Case>
      <Case title="ko (띄어쓰기 없음)">
        <Button variant="ghost" icon="check">
          {LONG_KO_SPACED}
        </Button>
      </Case>
      <Case title="좁은 칸 (Inline 안, 내용만큼)">
        <Inline gap={8} wrap>
          <Button variant="primary">{'네'}</Button>
          <Button variant="secondary">{'잠시만요'}</Button>
          <Button variant="secondary">{'5분 걸려요'}</Button>
          <Button variant="ghost">{'어려워요'}</Button>
        </Inline>
      </Case>
    </Cases>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {(['md', 'lg'] as const).map((size) => (
        <Case key={size} title={`size ${size} · 변형 × 상태`}>
          <CaseGrid>
            {VARIANTS.map((variant) => (
              <Stack key={variant} gap={8}>
                <Text variant="caption" tone="subtle" as="span">
                  {variant}
                </Text>
                <Button variant={variant} size={size}>
                  {'기본'}
                </Button>
                <Button variant={variant} size={size} icon="send">
                  {'아이콘'}
                </Button>
                <Button variant={variant} size={size} disabled>
                  {'비활성'}
                </Button>
                <Button variant={variant} size={size} loading>
                  {'로딩'}
                </Button>
                <Button variant={variant} size={size} href="#link">
                  {'링크'}
                </Button>
              </Stack>
            ))}
          </CaseGrid>
        </Case>
      ))}
    </Cases>
  ),
};
