import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Inline } from '../Inline/Inline';
import { Text } from '../Text/Text';
import { Case, Cases, LONG_KO } from '../../internal/showcase';
import { Stack, type Gap } from './Stack';

const meta = {
  title: '웹 부품/기반/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

const GAPS: Gap[] = [4, 8, 16, 24, 32];

function Blocks({ n = 3 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Card key={i} tone="sunken" padding={16}>
          <Text variant="label">{`블록 ${i + 1}`}</Text>
        </Card>
      ))}
    </>
  );
}

export const Default: Story = {
  args: { gap: 16, children: <Blocks /> },
};

export const LongText: Story = {
  name: '긴 글 (띄어쓰기 없음)',
  args: {
    gap: 8,
    children: (
      <Text variant="body">
        {LONG_KO}
      </Text>
    ),
  },
};

export const Empty: Story = {
  name: '자식 0개',
  args: { gap: 8, children: null },
};

export const Many: Story = {
  name: '자식 많음',
  args: { gap: 4, children: <Blocks n={20} /> },
};

export const AllStates: Story = {
  name: 'All states',
  args: { gap: 16 },
  render: () => (
    <Cases>
      {GAPS.map((gap) => (
        <Case key={gap} title={`gap ${gap}`}>
          <Stack gap={gap}>
            <Blocks />
          </Stack>
        </Case>
      ))}
      <Case title="align center">
        <Stack gap={8} align="center">
          <Blocks />
        </Stack>
      </Case>
      <Case title="align start">
        <Stack gap={8} align="start">
          <Blocks />
        </Stack>
      </Case>
      <Case title="ul (목록)">
        <Stack gap={8} as="ul">
          <Blocks />
        </Stack>
      </Case>
      <Case title="자식 0개">
        <Stack gap={8}>{null}</Stack>
      </Case>
      <Case title="자식 1개">
        <Stack gap={8}>
          <Blocks n={1} />
        </Stack>
      </Case>
      <Case title="자식 많음 (12)">
        <Stack gap={4}>
          <Blocks n={12} />
        </Stack>
      </Case>
      <Case title="긴 글 안">
        <Stack gap={8}>
          <Text variant="body">{LONG_KO}</Text>
          <Inline gap={8}>
            <Text variant="body">{LONG_KO}</Text>
          </Inline>
        </Stack>
      </Case>
    </Cases>
  ),
};
