import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageOption } from '../LanguageOption/LanguageOption';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import { Case, Cases } from '../../internal/showcase';
import { LanguageList } from './LanguageList';

const meta = { title: '웹 부품/행동/LanguageList', component: LanguageList } satisfies Meta<typeof LanguageList>;
export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: Array<{ lang: Lang; name: string }> = [
  { lang: 'en', name: 'English' },
  { lang: 'ja', name: '日本語' },
  { lang: 'zh-Hans', name: '简体中文' },
  { lang: 'ko', name: '한국어' },
];

function Demo({ items, initial }: { items: typeof ITEMS; initial: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);
  return (
    <LanguageList label="언어">
      {items.map((i) => (
        <LanguageOption key={i.lang} lang={i.lang} nativeName={i.name} selected={lang === i.lang} onSelect={() => setLang(i.lang)} />
      ))}
    </LanguageList>
  );
}

export const Default: Story = { args: { label: '언어', children: null }, render: () => <Demo items={ITEMS} initial="en" /> };

export const Many: Story = {
  name: '많음 (12개)',
  args: { label: '언어', children: null },
  render: () => <Demo items={[...ITEMS, ...ITEMS, ...ITEMS]} initial="ja" />,
};

export const AllStates: Story = {
  name: 'All states',
  args: { label: '언어', children: null },
  render: () => (
    <Cases>
      <Case title="4개">
        <Demo items={ITEMS} initial="ja" />
      </Case>
      <Case title="1개">
        <Demo items={ITEMS.slice(0, 1)} initial="en" />
      </Case>
    </Cases>
  ),
};
