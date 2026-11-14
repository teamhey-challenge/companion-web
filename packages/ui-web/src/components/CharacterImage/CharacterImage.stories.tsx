import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { CharacterImage } from './CharacterImage';

const meta = {
  title: '웹 부품/표시/CharacterImage',
  component: CharacterImage,
  args: { alt: '헤이파리' },
} satisfies Meta<typeof CharacterImage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { name: '긴 설명', args: { alt: LONG_JA } };

export const Loading: Story = { name: '로딩', args: { state: 'loading' } };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="준비됨 (라이트는 청록, 다크는 복숭아)">
        <CharacterImage alt="헤이파리" />
      </Case>
      <Case title="로딩">
        <CharacterImage alt="헤이파리" state="loading" />
      </Case>
      <Case title="긴 설명">
        <CharacterImage alt={LONG_JA} />
      </Case>
    </Cases>
  ),
};
