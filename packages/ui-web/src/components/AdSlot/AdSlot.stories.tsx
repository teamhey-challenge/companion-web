import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Case, Cases, LONG_JA, LONG_ZH } from '../../internal/showcase';
import { AdSlot, type AdItem } from './AdSlot';

const LONG_TH =
  'ร้านอาหารเกาหลีดั้งเดิมใกล้โรงแรมล็อตเต้โซลที่เปิดให้บริการตลอดทั้งวันพร้อมเมนูภาษาไทยและบริการรับชำระเงินด้วยบัตรเครดิตทุกประเภทสำหรับนักท่องเที่ยวต่างชาติ';
const LONG_VI =
  'Nhà hàng Hàn Quốc truyền thống gần khách sạn Lotte Seoul, mở cửa cả ngày, có thực đơn tiếng Việt và nhận thanh toán bằng mọi loại thẻ tín dụng dành cho du khách nước ngoài.';

const ONE: AdItem = {
  id: 'a1',
  title: 'Myeongdong Kyoja',
  body: 'Hand-cut noodle soup, a short walk from your drop-off spot.',
  meta: '320 m · 예시 광고주 · Sample advertiser',
};

const meta = {
  title: '웹 부품/HEY/AdSlot',
  component: AdSlot,
  args: { label: 'Ad', lang: 'en', items: [ONE] },
} satisfies Meta<typeof AdSlot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText('Ad')).toBeInTheDocument();
    await expect(c.getByText('Myeongdong Kyoja', { selector: 'p' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('a, button')).toBeNull();
  },
};

export const Empty: Story = {
  name: '광고 없음 (아무것도 그리지 않음)',
  args: { items: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toBeNull();
    await expect(within(canvasElement).queryByText('Ad')).toBeNull();
  },
};

export const Many: Story = {
  name: '여러 개',
  args: {
    items: [
      ONE,
      { id: 'a2', title: 'Deoksugung Palace', body: 'Evening opening with the changing of the guard.', meta: '650 m · 예시 광고주 · Sample advertiser' },
      { id: 'a3', title: 'Duty free, 9th floor', body: 'Show your boarding pass at the counter.', meta: '예시 광고주 · Sample advertiser' },
    ],
  },
};

export const LongText: Story = {
  name: '긴 글',
  render: () => (
    <Cases>
      <Case title="ja">
        <AdSlot label="広告" lang="ja" items={[{ id: 'ja', title: LONG_JA, body: LONG_JA, meta: LONG_JA }]} />
      </Case>
      <Case title="zh-Hans">
        <AdSlot label="广告" lang="zh-Hans" items={[{ id: 'zh', title: LONG_ZH, body: LONG_ZH, meta: LONG_ZH }]} />
      </Case>
      <Case title="th">
        <AdSlot label="โฆษณา" lang="th" items={[{ id: 'th', title: LONG_TH, body: LONG_TH, meta: LONG_TH }]} />
      </Case>
      <Case title="vi">
        <AdSlot label="Quảng cáo" lang="vi" items={[{ id: 'vi', title: LONG_VI, body: LONG_VI, meta: LONG_VI }]} />
      </Case>
    </Cases>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="제목만">
        <AdSlot label="Ad (title only)" lang="en" items={[{ id: 't', title: 'Duty free, 9th floor' }]} />
      </Case>
      <Case title="제목 + 설명 + 부가 정보">
        <AdSlot label="Ad (full)" lang="en" items={[ONE]} />
      </Case>
      <Case title="일본어 표시 문구">
        <AdSlot label="広告" lang="ja" items={[{ id: 'j', title: 'ロッテ免税店', body: '同じ建物の9階です。', meta: '예시 광고주 · Sample advertiser' }]} />
      </Case>
      <Case title="비어 있음 → 아무것도 없음">
        <AdSlot label="Ad (empty)" lang="en" items={[]} />
      </Case>
    </Cases>
  ),
};
