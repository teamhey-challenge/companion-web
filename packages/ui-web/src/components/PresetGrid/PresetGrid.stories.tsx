import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PresetTile } from '../PresetTile/PresetTile';
import { Case, Cases } from '../../internal/showcase';
import { PresetGrid } from './PresetGrid';

const meta = { title: '웹 부품/행동/PresetGrid', component: PresetGrid } satisfies Meta<typeof PresetGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;
const tiles = (
  <>
    <PresetTile icon="car" label="천천히 가 주세요" kind="notice" onPress={noop} />
    <PresetTile icon="thermometer-cool" label="시원하게 해 주세요" kind="notice" onPress={noop} />
    <PresetTile icon="thermometer-warm" label="따뜻하게 해 주세요" kind="notice" onPress={noop} />
    <PresetTile icon="door" label="창문 열어도 될까요?" kind="question" questionLabel="기사님 답을 받아요" onPress={noop} />
    <PresetTile icon="card" label="카드 되나요?" kind="question" questionLabel="기사님 답을 받아요" onPress={noop} />
    <PresetTile icon="clock" label="얼마나 걸려요?" kind="question" questionLabel="기사님 답을 받아요" onPress={noop} />
    <PresetTile icon="flag" label="여기서 세워 주세요" kind="notice" onPress={noop} />
    <PresetTile icon="luggage" label="트렁크 열어 주세요" kind="notice" onPress={noop} />
  </>
);

export const Default: Story = { args: { children: tiles } };

export const Many: Story = {
  name: '많음 (16개)',
  args: {
    children: (
      <>
        {tiles}
        {tiles}
      </>
    ),
  },
};

export const AllStates: Story = {
  name: 'All states',
  args: { children: null },
  render: () => (
    <Cases>
      <Case title="8개">
        <PresetGrid>{tiles}</PresetGrid>
      </Case>
      <Case title="1개 (홀수)">
        <PresetGrid>
          <PresetTile icon="car" label="천천히 가 주세요" kind="notice" onPress={noop} />
        </PresetGrid>
      </Case>
      <Case title="전부 비활성 (보낸 직후)">
        <PresetGrid>
          <PresetTile icon="car" label="천천히 가 주세요" kind="notice" disabled onPress={noop} />
          <PresetTile icon="card" label="카드 되나요?" kind="question" questionLabel="기사님 답을 받아요" disabled onPress={noop} />
        </PresetGrid>
      </Case>
    </Cases>
  ),
};

const TH = [
  'กรุณาขับช้าลงหน่อยได้ไหมคะ เพราะฉันรู้สึกเมารถ',
  'เปิดแอร์ให้เย็นลงหน่อย',
  'ขอเปิดหน้าต่างได้ไหมคะ',
  'รับบัตรเครดิตไหมคะ',
];
const VI = [
  'Xin hãy chạy chậm lại một chút vì tôi bị say xe',
  'Làm mát hơn',
  'Tôi mở cửa sổ được không ạ?',
  'Có nhận thẻ không?',
];

/** 한 줄의 칸 높이가 같은지 잰다: 위쪽 좌표가 같은 칸끼리 묶어 높이 집합이 하나여야 한다. */
async function expectEqualRowHeights(canvasElement: HTMLElement) {
  for (const grid of canvasElement.querySelectorAll<HTMLElement>('[data-preset-grid-case]')) {
    const rows = new Map<number, number[]>();
    for (const tile of grid.querySelectorAll('button')) {
      const r = tile.getBoundingClientRect();
      rows.set(Math.round(r.top), [...(rows.get(Math.round(r.top)) ?? []), Math.round(r.height * 10) / 10]);
    }
    await expect(rows.size).toBeGreaterThan(1);
    for (const heights of rows.values()) await expect(new Set(heights).size).toBe(1);
  }
}

function LangGrid({ lang, labels }: { lang: string; labels: string[] }) {
  return (
    <div lang={lang} data-preset-grid-case={lang}>
      <PresetGrid>
        {labels.map((label, i) => (
          <PresetTile key={label} icon="car" label={label} kind={i % 2 ? 'question' : 'notice'} questionLabel="?" onPress={noop} />
        ))}
      </PresetGrid>
    </div>
  );
}

export const EqualHeightThVi: Story = {
  name: '한 줄 높이 같음 (th·vi)',
  args: { children: null },
  render: () => (
    <Cases>
      <Case title="th">
        <LangGrid lang="th" labels={TH} />
      </Case>
      <Case title="vi">
        <LangGrid lang="vi" labels={VI} />
      </Case>
    </Cases>
  ),
  play: async ({ canvasElement }) => {
    await expectEqualRowHeights(canvasElement);
  },
};
