import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Case, CaseRow, Cases } from '../../internal/showcase';
import { Icon, ICON_NAMES } from './Icon';
import styles from './IconGallery.module.css';

const meta = {
  title: '웹 부품/글자·브랜드/Icon',
  component: Icon,
  args: { name: 'mic', size: 'md' },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Gallery({ size }: { size: 'md' | 'lg' }) {
  return (
    <div className={styles.grid}>
      {ICON_NAMES.map((name) => (
        <div key={name} className={styles.cell}>
          <Icon name={name} size={size} />
          <Text variant="caption" tone="muted" as="span">
            {name}
          </Text>
        </div>
      ))}
    </div>
  );
}

export const Many: Story = {
  name: '전체 아이콘 표',
  render: () => <Gallery size="md" />,
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="md (24)">
        <Gallery size="md" />
      </Case>
      <Case title="lg (32)">
        <CaseRow>
          {ICON_NAMES.slice(0, 12).map((n) => (
            <Icon key={n} name={n} size="lg" />
          ))}
        </CaseRow>
      </Case>
      <Case title="이름 있음(role=img) / 장식(숨김)">
        <Stack gap={8}>
          <Icon name="warning" label="경고" />
          <Icon name="warning" />
        </Stack>
      </Case>
    </Cases>
  ),
};
