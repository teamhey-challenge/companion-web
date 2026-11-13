import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Case, Cases, LONG_JA } from '../../internal/showcase';
import { SearchField } from './SearchField';

const meta = {
  title: '웹 부품/입력/SearchField',
  component: SearchField,
  args: {
    label: '목적지 검색',
    value: '',
    onChange: () => undefined,
    placeholder: '어디로 갈까요?',
    clearLabel: '지우기',
    onClear: () => undefined,
  },
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, loading }: { initial: string; loading?: boolean }) {
  const [value, setValue] = useState(initial);
  return (
    <SearchField
      label="목적지 검색"
      value={value}
      onChange={setValue}
      placeholder="어디로 갈까요?"
      loading={loading}
      clearLabel="지우기"
      onClear={() => setValue('')}
    />
  );
}

export const Default: Story = { render: () => <Demo initial="" /> };

export const Empty: Story = { name: '빈 값', render: () => <Demo initial="" /> };

export const Loading: Story = { name: '로딩', render: () => <Demo initial="롯데호텔" loading /> };

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Cases>
      <Case title="빈 값">
        <Demo initial="" />
      </Case>
      <Case title="입력 중 (지우기 단추)">
        <Demo initial="롯데호텔" />
      </Case>
      <Case title="로딩">
        <Demo initial="롯데호텔" loading />
      </Case>
      <Case title="긴 입력 (일본어)">
        <Demo initial={LONG_JA} />
      </Case>
    </Cases>
  ),
};
