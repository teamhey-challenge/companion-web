import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_KO } from '../../internal/showcase';
import { ShowDriverCard } from './ShowDriverCard';

const meta = {
  title: '웹 부품/HEY/ShowDriverCard',
  component: ShowDriverCard,
  args: {
    textKo: '롯데호텔 서울 본관 정문으로 가 주세요. 서울 중구 을지로 30입니다.',
    caption: '기사님께 이 화면을 보여 주세요',
  },
} satisfies Meta<typeof ShowDriverCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  name: '긴 글 (띄어쓰기 없는 한국어)',
  args: { textKo: LONG_KO, caption: 'Please show this screen to the driver and keep the phone steady until they confirm.' },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="짧은 문장">
        <ShowDriverCard textKo="여기서 세워 주세요." caption="기사님께 이 화면을 보여 주세요" />
      </Case>
      <Case title="주소 한 줄">
        <ShowDriverCard
          textKo="롯데호텔 서울, 서울 중구 을지로 30으로 가 주세요."
          caption="기사님께 이 화면을 보여 주세요"
        />
      </Case>
      <Case title="긴 글 + 긴 안내">
        <ShowDriverCard
          textKo={LONG_KO}
          caption="羽田空港第三ターミナルの国際線到着口から東京駅八重洲口まで、大きなスーツケースが二つあるのでこの画面を運転手さんにお見せください。"
        />
      </Case>
    </Cases>
  ),
};
