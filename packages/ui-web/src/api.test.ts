import { describe, expect, expectTypeOf, test } from 'bun:test';
import type { BoardingCardProps, BoardingDropoff } from './components/BoardingCard/BoardingCard';
import type { ConditionSummaryProps } from './components/ConditionSummary/ConditionSummary';
import type { MessageBubbleProps } from './components/MessageBubble/MessageBubble';
import type { InviteCardProps } from './components/InviteCard/InviteCard';
import type { DropoffProposalCardProps } from './components/DropoffProposalCard/DropoffProposalCard';
import type { TripProgressProps } from './components/TripProgress/TripProgress';
import type { TollNoticeProps } from './components/TollNotice/TollNotice';
import type { ScreenConnection } from './components/ScreenHeader/ScreenHeader';
import type { ArrivalSummaryProps } from './components/ArrivalSummary/ArrivalSummary';
import type { Handler } from './handler';

describe('이벤트 핸들러는 함수를 돌려줄 수 없다', () => {
  test('InviteCard: 핸들러가 함수를 돌려주면 컴파일되지 않는다(호출만 되고 실행되지 않는 버그)', () => {
    const base = { url: 'u', title: 't', message: 'm', copy: { state: 'idle', label: 'c' } } satisfies Omit<InviteCardProps, 'onCopy'>;
    const run = () => undefined;
    const ok: InviteCardProps = { ...base, onCopy: () => void run() };
    // @ts-expect-error 함수를 돌려주는 핸들러: 호출만 되고 실행되지 않는 버그가 타입에서 막힌다
    const wrong: InviteCardProps = { ...base, onCopy: () => (base.url ? undefined : () => run()) };
    // @ts-expect-error Promise를 돌려주는 핸들러도 거부한다(`void`로 버리고 넘긴다)
    const promise: Handler = async () => undefined;
    expect([ok, wrong, promise].length).toBe(3);
  });
});
/**
 * 타입 수준 시험. `expectTypeOf`는 tsc가 판단하고, 런타임에서는 아무 일도 하지 않는다.
 * 부품의 유니언을 바꾸면 이 파일이 tsc에서 먼저 깨져 호출부를 고치게 만든다.
 */
describe('부품 API는 불가능한 조합을 표현할 수 없다', () => {
  test('BoardingCard: 상태 이름과 표시 문구가 한 값이다', () => {
    expectTypeOf<BoardingCardProps['status']>().toEqualTypeOf<{
      kind: 'draft' | 'sent' | 'confirmed' | 'inTrip';
      label: string;
    }>();
    expectTypeOf<BoardingCardProps['status']>().not.toBeString();
    expectTypeOf<BoardingDropoff['state']>().toEqualTypeOf<'undecided' | 'proposed' | 'agreed'>();
    // 합의한 내릴 곳은 지점 문구가 반드시 있다.
    expectTypeOf<Extract<BoardingDropoff, { state: 'agreed' }>>().toHaveProperty('spot');
    expectTypeOf<Extract<BoardingDropoff, { state: 'undecided' }>>().not.toHaveProperty('spot');
    // 답하기 단추는 제안 대기 상태에만 붙는다.
    expectTypeOf<Extract<BoardingDropoff, { state: 'undecided' }>>().not.toHaveProperty('action');
  });

  test('ConditionSummary: 빈 목록을 넘길 수 없다', () => {
    expectTypeOf<ConditionSummaryProps['items']>().toEqualTypeOf<readonly [ConditionSummaryProps['items'][number], ...ConditionSummaryProps['items'][number][]]>();
    expectTypeOf<readonly []>().not.toMatchTypeOf<ConditionSummaryProps['items']>();
  });

  test('TripProgress: 값이 없으면 none, 있으면 값이 필수다', () => {
    expectTypeOf<TripProgressProps>().toMatchTypeOf<{ state: 'none' | 'eta' | 'distance' }>();
    expectTypeOf<Extract<TripProgressProps, { state: 'none' }>>().not.toHaveProperty('etaMin');
    expectTypeOf<Extract<TripProgressProps, { state: 'eta' }>>().toHaveProperty('etaMin');
    expectTypeOf<Extract<TripProgressProps, { state: 'distance' }>>().toHaveProperty('distanceKm');
    expectTypeOf<Extract<TripProgressProps, { state: 'distance' }>>().not.toHaveProperty('etaMin');
  });

  test('TollNotice: 통행료 없음 상태가 없다(없으면 그리지 않는다)', () => {
    expectTypeOf<TollNoticeProps>().not.toHaveProperty('state');
    expectTypeOf<TollNoticeProps['labels']>().not.toHaveProperty('none');
  });

  test('MessageBubble: 누가 말했는지에 따라 붙는 값이 다르다', () => {
    expectTypeOf<Extract<MessageBubbleProps, { from: 'system' }>>().not.toHaveProperty('delivery');
    expectTypeOf<Extract<MessageBubbleProps, { from: 'driver' }>>().not.toHaveProperty('delivery');
    expectTypeOf<Extract<MessageBubbleProps, { from: 'me' }>>().toHaveProperty('delivery');
    expectTypeOf<Extract<MessageBubbleProps, { from: 'me' }>>().not.toHaveProperty('listen');
    // 실패일 때만 다시 보내기가 있다.
    expectTypeOf<Extract<Extract<MessageBubbleProps, { from: 'me' }>['delivery'], { state: 'failed' }>>().toHaveProperty('retry');
    expectTypeOf<Exclude<Extract<MessageBubbleProps, { from: 'me' }>['delivery'], { state: 'failed' }>>().not.toHaveProperty('retry');
  });

  test('InviteCard: 복사 문구가 상태와 함께 움직인다', () => {
    expectTypeOf<InviteCardProps['copy']>().toEqualTypeOf<{ state: 'idle'; label: string } | { state: 'copied'; label: string }>();
    expectTypeOf<InviteCardProps>().not.toHaveProperty('copied');
    expectTypeOf<InviteCardProps>().not.toHaveProperty('copyLabel');
  });

  test('DropoffProposalCard: 답 단추는 대기 상태에만 있다', () => {
    expectTypeOf<DropoffProposalCardProps['state']>().toMatchTypeOf<{ status: 'pending' } | { status: 'ok' | 'elsewhere' | 'unsure' | 'superseded' }>();
    expectTypeOf<Extract<DropoffProposalCardProps['state'], { status: 'pending' }>>().toHaveProperty('responding');
    expectTypeOf<Exclude<DropoffProposalCardProps['state'], { status: 'pending' }>>().not.toHaveProperty('responding');
    expectTypeOf<DropoffProposalCardProps>().not.toHaveProperty('proposal');
  });

  test('ArrivalSummary: 통계는 none/time/distance 중 하나다', () => {
    expectTypeOf<ArrivalSummaryProps['stats']['state']>().toEqualTypeOf<'none' | 'time' | 'distance'>();
    expectTypeOf<Extract<ArrivalSummaryProps['stats'], { state: 'time' }>>().toHaveProperty('duration');
    expectTypeOf<Extract<ArrivalSummaryProps['stats'], { state: 'none' }>>().not.toHaveProperty('duration');
    expectTypeOf<ArrivalSummaryProps>().not.toHaveProperty('duration');
  });

  test('ScreenHeader: 끊김 사유는 끊겼을 때만 있다', () => {
    expectTypeOf<Extract<ScreenConnection, { status: 'offline' }>>().toHaveProperty('detail');
    expectTypeOf<Exclude<ScreenConnection, { status: 'offline' }>>().not.toHaveProperty('detail');
    expectTypeOf<ScreenConnection['status']>().toEqualTypeOf<'online' | 'reconnecting' | 'offline'>();
  });

  test('유니언 표본이 실제로 컴파일된다', () => {
    const pending: DropoffProposalCardProps['state'] = { status: 'pending', responding: 'ok' };
    const agreed: BoardingDropoff = { state: 'agreed', heading: '내릴 곳', stateLabel: '합의함', spot: '정문 앞' };
    const stats: ArrivalSummaryProps['stats'] = { state: 'distance', distance: { label: '거리', value: '1.2km' } };
    expect(pending.status).toBe('pending');
    expect(agreed.state).toBe('agreed');
    expect(stats.state).toBe('distance');
  });
});
