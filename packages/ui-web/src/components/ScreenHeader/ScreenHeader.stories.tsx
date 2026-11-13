import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Case, Cases } from '../../internal/showcase';
import { ScreenHeader } from './ScreenHeader';

const connectionLabels = { online: '연결됨', reconnecting: '다시 연결하는 중', offline: '연결이 끊겼어요' };

const meta = {
  title: '웹 부품/HEY/ScreenHeader',
  component: ScreenHeader,
  args: {
    partySize: 2,
    plateSuffix: '4821',
    connection: { status: 'online', labels: connectionLabels },
    menu: { label: '메뉴 열기', onOpen: fn() },
  },
} satisfies Meta<typeof ScreenHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '메뉴 열기' }));
    await expect(args.menu?.onOpen).toHaveBeenCalledTimes(1);
  },
};

export const Error: Story = {
  name: '오류 (연결 끊김 + 이유)',
  args: {
    connection: {
      status: 'offline',
      labels: connectionLabels,
      detail: '인터넷이 끊겨 기사님께 보낸 내용이 아직 전달되지 않았어요. 연결되면 자동으로 다시 보내요.',
    },
    back: { label: '뒤로', onBack: fn() },
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      {([1, 2, 3, 4] as const).map((n) => (
        <Case key={n} title={`일행 ${n}명 · 번호판 · 메뉴`}>
          <ScreenHeader
            partySize={n}
            plateSuffix="4821"
            connection={{ status: 'online', labels: connectionLabels }}
            menu={{ label: '메뉴 열기', onOpen: fn() }}
          />
        </Case>
      ))}
      <Case title="번호판 없음 · 메뉴 없음">
        <ScreenHeader partySize={1} connection={{ status: 'online', labels: connectionLabels }} />
      </Case>
      <Case title="뒤로 · 번호판 · 메뉴, 연결 중">
        <ScreenHeader
          partySize={3}
          plateSuffix="4821"
          connection={{ status: 'reconnecting', labels: connectionLabels }}
          back={{ label: '뒤로', onBack: fn() }}
          menu={{ label: '메뉴 열기', onOpen: fn() }}
        />
      </Case>
      <Case title="로고 없음 · 번호판 없음 (본문에 이미 있을 때)">
        <ScreenHeader partySize={2} brand={false} connection={{ status: 'online', labels: connectionLabels }} />
      </Case>
      <Case title="로고 있음 · 번호판 없음">
        <ScreenHeader partySize={1} connection={{ status: 'online', labels: connectionLabels }} />
      </Case>
      <Case title="뒤로 · 메뉴 비활성, 끊김 + 이유">
        <ScreenHeader
          partySize={4}
          plateSuffix="4821"
          connection={{
            status: 'offline',
            labels: connectionLabels,
            detail: '인터넷이 끊겨 기사님께 보낸 내용이 아직 전달되지 않았어요.',
          }}
          back={{ label: '뒤로', onBack: fn() }}
          menu={{ label: '메뉴 열기', onOpen: fn(), disabled: true }}
        />
      </Case>
      <Case title="긴 연결 라벨 (일본어)">
        <ScreenHeader
          partySize={4}
          plateSuffix="4821"
          connection={{
            status: 'reconnecting',
            labels: { ...connectionLabels, reconnecting: 'サーバーとの接続が一時的に不安定になっているため、自動的に再接続を試みています' },
          }}
          back={{ label: '뒤로', onBack: fn() }}
          menu={{ label: '메뉴 열기', onOpen: fn() }}
        />
      </Case>
    </Cases>
  ),
};
