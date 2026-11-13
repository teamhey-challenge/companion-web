import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Case, Cases, LONG_JA, LONG_KO, LONG_ZH } from '../../internal/showcase';
import { PlaceResultRow } from '../PlaceResultRow/PlaceResultRow';
import { PlaceResultList } from './PlaceResultList';

const PLACES = [
  { nameLocal: 'Lotte Hotel Seoul', nameKo: '롯데호텔 서울', area: '서울 중구 을지로 30' },
  { nameLocal: 'Lotte Hotel Seoul Executive Tower', nameKo: '롯데호텔 서울 이그제큐티브 타워', area: '서울 중구 을지로 30' },
  { nameLocal: 'Myeongdong Cathedral', nameKo: '명동성당', area: '서울 중구 명동길 74' },
  { nameLocal: 'Namdaemun Market', nameKo: '남대문시장', area: '서울 중구 남대문시장4길 21' },
  { nameLocal: 'Seoul Station', nameKo: '서울역', area: '서울 용산구 한강대로 405' },
  { nameLocal: 'Gwangjang Market', nameKo: '광장시장', area: '서울 종로구 창경궁로 88' },
  { nameLocal: 'Dongdaemun Design Plaza', nameKo: '동대문디자인플라자', area: '서울 중구 을지로 281' },
  { nameLocal: 'N Seoul Tower', nameKo: 'N서울타워', area: '서울 용산구 남산공원길 105' },
];

function Rows({ count, selected = 0 }: { count: number; selected?: number }) {
  return PLACES.slice(0, count).map((p, i) => (
    <PlaceResultRow key={p.nameKo} {...p} lang="en" selected={i === selected - 1} onSelect={fn()} />
  ));
}

const meta = {
  title: '웹 부품/HEY/PlaceResultList',
  component: PlaceResultList,
  args: { label: '검색 결과' },
} satisfies Meta<typeof PlaceResultList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <PlaceResultList {...args}><Rows count={3} /></PlaceResultList> };

export const Empty: Story = {
  name: '결과 없음 (그리지 않음)',
  render: (args) => <PlaceResultList {...args} />,
};

export const Many: Story = {
  name: '결과 8개',
  render: (args) => <PlaceResultList {...args}><Rows count={8} selected={2} /></PlaceResultList>,
};

export const LongText: Story = {
  name: '긴 글 (일본어·중국어·한국어)',
  render: (args) => (
    <PlaceResultList {...args}>
      <PlaceResultRow nameLocal={LONG_JA} nameKo={LONG_KO} area="서울 강남구 테헤란로 152" lang="ja" onSelect={fn()} />
      <PlaceResultRow nameLocal={LONG_ZH} nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="zh-Hans" selected onSelect={fn()} />
      <PlaceResultRow nameLocal="ロッテホテル ソウル" nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="ja" onSelect={fn()} />
    </PlaceResultList>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  args: { children: null },
  render: (args) => (
    <Cases>
      <Case title="결과 1개">
        <PlaceResultList {...args}><Rows count={1} /></PlaceResultList>
      </Case>
      <Case title="결과 3개 · 두 번째 선택">
        <PlaceResultList {...args}><Rows count={3} selected={2} /></PlaceResultList>
      </Case>
      <Case title="결과 8개">
        <PlaceResultList {...args}><Rows count={8} /></PlaceResultList>
      </Case>
      <Case title="긴 글">
        <PlaceResultList {...args}>
          <PlaceResultRow nameLocal={LONG_JA} nameKo={LONG_KO} area="서울 강남구 테헤란로 152" lang="ja" onSelect={fn()} />
          <PlaceResultRow nameLocal={LONG_ZH} nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="zh-Hans" onSelect={fn()} />
        </PlaceResultList>
      </Case>
      <Case title="결과 없음 (아무것도 그리지 않음)">
        <PlaceResultList {...args} />
      </Case>
    </Cases>
  ),
};
