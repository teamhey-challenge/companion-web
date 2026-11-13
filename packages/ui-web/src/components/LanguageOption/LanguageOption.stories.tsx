import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases } from '../../internal/showcase';
import { LanguageOption } from './LanguageOption';

const meta = {
  title: '웹 부품/행동/LanguageOption',
  component: LanguageOption,
  args: { lang: 'ja', nativeName: '日本語', selected: false, onSelect: () => undefined },
} satisfies Meta<typeof LanguageOption>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  name: '긴 이름',
  args: {
    nativeName: '日本語（ひらがなとカタカナと漢字がまざった、とても長い言語の名前のテストです、折り返しを確認します）',
    selected: true,
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="선택 안 됨 · 선택됨">
        <LanguageOption lang="en" nativeName="English" selected={false} onSelect={() => undefined} />
        <LanguageOption lang="en" nativeName="English" selected onSelect={() => undefined} />
      </Case>
      <Case title="네 언어">
        <LanguageOption lang="ja" nativeName="日本語" selected={false} onSelect={() => undefined} />
        <LanguageOption lang="zh-Hans" nativeName="简体中文" selected={false} onSelect={() => undefined} />
        <LanguageOption lang="ko" nativeName="한국어" selected={false} onSelect={() => undefined} />
      </Case>
      <Case title="긴 이름">
        <LanguageOption
          lang="ja"
          nativeName="日本語（ひらがなとカタカナと漢字がまざった、とても長い言語の名前のテストです、折り返しを確認します）"
          selected
          onSelect={() => undefined}
        />
      </Case>
    </Cases>
  ),
};
