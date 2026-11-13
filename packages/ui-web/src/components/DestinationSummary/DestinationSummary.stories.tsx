import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Case, CaseGrid, Cases, LONG_JA, LONG_KO, LONG_ZH } from '../../internal/showcase';
import { DestinationSummary } from './DestinationSummary';

const meta = {
  title: '웹 부품/HEY/DestinationSummary',
  component: DestinationSummary,
  args: {
    nameLocal: 'Lotte Hotel Seoul',
    nameKo: '롯데호텔 서울',
    addressKo: '서울 중구 을지로 30',
    area: 'Jung-gu, Seoul',
    lang: 'en',
  },
} satisfies Meta<typeof DestinationSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  name: '긴 글 (일본어·중국어·한국어)',
  args: {
    nameLocal: LONG_JA,
    nameKo: LONG_KO,
    addressKo: '서울특별시 강남구 테헤란로 152 강남파이낸스센터 지하 2층 주차장 입구 옆 엘리베이터 홀 앞',
    area: LONG_ZH,
    lang: 'ja',
  },
};

/** 동네가 주소 안에 이미 있으면 한 번만 그린다(같은 사실을 두 줄로 쓰지 않는다). */
export const AreaInsideAddress: Story = {
  name: '동네가 주소에 들어 있음 (한 번만)',
  args: { area: '서울 중구' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.textContent ?? '';
    await expect(text.split('서울 중구').length - 1).toBe(1);
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <CaseGrid>
        <Case title="영어 · 이름 두 가지 · 동네">
          <DestinationSummary
            nameLocal="Lotte Hotel Seoul"
            nameKo="롯데호텔 서울"
            addressKo="서울 중구 을지로 30"
            area="Jung-gu, Seoul"
            lang="en"
          />
        </Case>
        <Case title="일본어">
          <DestinationSummary nameLocal="ロッテホテル ソウル" nameKo="롯데호텔 서울" addressKo="서울 중구 을지로 30" area="中区、ソウル" lang="ja" />
        </Case>
        <Case title="중국어 간체">
          <DestinationSummary nameLocal="首尔乐天酒店" nameKo="롯데호텔 서울" addressKo="서울 중구 을지로 30" area="首尔中区" lang="zh-Hans" />
        </Case>
        <Case title="한국어 이름 동일 (한 번만)">
          <DestinationSummary nameLocal="롯데호텔 서울" nameKo="롯데호텔 서울" addressKo="서울 중구 을지로 30" area="서울 중구" lang="ko" />
        </Case>
        <Case title="동네 없음">
          <DestinationSummary nameLocal="Lotte Hotel Seoul" nameKo="롯데호텔 서울" addressKo="서울 중구 을지로 30" lang="en" />
        </Case>
      </CaseGrid>
      <Case title="긴 글">
        <DestinationSummary nameLocal={LONG_JA} nameKo={LONG_KO} addressKo={LONG_KO} area={LONG_ZH} lang="ja" />
      </Case>
    </Cases>
  ),
};
