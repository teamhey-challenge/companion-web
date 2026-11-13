import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, CaseGrid, Cases, LONG_JA, LONG_KO } from '../../internal/showcase';
import { PlaceResultRow } from './PlaceResultRow';

const meta = {
  title: '웹 부품/HEY/PlaceResultRow',
  component: PlaceResultRow,
  args: {
    nameLocal: 'Lotte Hotel Seoul',
    nameKo: '롯데호텔 서울',
    area: 'Jung-gu, 서울 중구 을지로 30',
    lang: 'en',
    onSelect: fn(),
  },
} satisfies Meta<typeof PlaceResultRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.click(button);
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
  },
};

export const LongText: Story = {
  name: '긴 글 (일본어, 2줄에서 줄임)',
  args: { nameLocal: LONG_JA, nameKo: LONG_KO, area: '서울특별시 강남구 테헤란로 152 강남파이낸스센터', lang: 'ja' },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <CaseGrid>
        <Case title="기본">
          <PlaceResultRow nameLocal="Lotte Hotel Seoul" nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="en" onSelect={fn()} />
        </Case>
        <Case title="선택됨">
          <PlaceResultRow nameLocal="Lotte Hotel Seoul" nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="en" selected onSelect={fn()} />
        </Case>
        <Case title="한국어 이름 동일 (두 번째 줄에 동네만)">
          <PlaceResultRow nameLocal="롯데호텔 서울" nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="ko" onSelect={fn()} />
        </Case>
        <Case title="일본어">
          <PlaceResultRow nameLocal="ロッテホテル ソウル" nameKo="롯데호텔 서울" area="서울 중구 을지로 30" lang="ja" onSelect={fn()} />
        </Case>
        <Case title="긴 글 · 선택됨">
          <PlaceResultRow nameLocal={LONG_JA} nameKo={LONG_KO} area="서울 강남구 테헤란로 152" lang="ja" selected onSelect={fn()} />
        </Case>
      </CaseGrid>
    </Cases>
  ),
};
