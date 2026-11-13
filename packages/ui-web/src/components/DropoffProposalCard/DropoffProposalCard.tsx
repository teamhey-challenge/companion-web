import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { StatusPill } from '../StatusPill/StatusPill';
import { Text } from '../Text/Text';
import type { Handler } from '../../handler';

export type ProposalResponse = 'ok' | 'elsewhere' | 'unsure';

/**
 * 제안의 상태. 답을 기다리는 동안에만 답 단추·나중에·잠금이 뜻이 있다.
 * 답한 뒤(ok/elsewhere/unsure)와 대체된 뒤에는 그 값들만 남는다.
 */
export type ProposalState =
  | { status: 'pending'; responding?: ProposalResponse; disabled?: boolean }
  | { status: ProposalResponse | 'superseded' };

export interface DropoffProposalLabels {
  badge: string;
  ok: string;
  elsewhere: string;
  unsure: string;
  later: string;
  noReason: string;
  states: { ok: string; elsewhere: string; unsure: string; superseded: string };
}

export interface DropoffProposalCardProps {
  label: string;
  state: ProposalState;
  reasonText?: string;
  distanceLabel?: string;
  labels: DropoffProposalLabels;
  onRespond: Handler<[response: ProposalResponse]>;
  onLater?: Handler;
}

const STATE_TONE = { ok: 'success', elsewhere: 'warning', unsure: 'neutral', superseded: 'neutral' } as const;

/** 기사님이 제안한 내릴 곳 카드. 대기 중이면 답 단추를, 답한 뒤에는 상태 표시를 보인다. */
export function DropoffProposalCard({ label, state, reasonText, distanceLabel, labels, onRespond, onLater }: DropoffProposalCardProps) {
  const pending = state.status === 'pending';
  const responding = pending ? state.responding : undefined;
  const lock = pending ? state.disabled === true || responding !== undefined : true;
  return (
    <Card tone="default" padding={16}>
      <Inline gap={8} justify="between" wrap>
        <StatusPill tone="info" icon="pin" label={labels.badge} />
        {distanceLabel ? (
          <Text variant="caption" tone="muted" as="span">
            {distanceLabel}
          </Text>
        ) : null}
      </Inline>
      <Stack gap={4}>
        <Text variant="heading" as="h3">
          {label}
        </Text>
        {reasonText ? (
          <Text variant="label" tone="muted">
            {reasonText}
          </Text>
        ) : (
          <Text variant="label" tone="subtle">
            {labels.noReason}
          </Text>
        )}
      </Stack>
      {state.status === 'pending' ? (
        <Stack gap={8}>
          <Button variant="primary" icon="check" loading={responding === 'ok'} disabled={lock} onClick={() => onRespond('ok')}>
            {labels.ok}
          </Button>
          <Button variant="secondary" loading={responding === 'elsewhere'} disabled={lock} onClick={() => onRespond('elsewhere')}>
            {labels.elsewhere}
          </Button>
          <Button variant="ghost" loading={responding === 'unsure'} disabled={lock} onClick={() => onRespond('unsure')}>
            {labels.unsure}
          </Button>
          {onLater ? (
            <Button variant="ghost" disabled={responding !== undefined} onClick={onLater}>
              {labels.later}
            </Button>
          ) : null}
        </Stack>
      ) : (
        <Inline gap={8}>
          <StatusPill tone={STATE_TONE[state.status]} icon={state.status === 'ok' ? 'check' : undefined} label={labels.states[state.status]} />
        </Inline>
      )}
    </Card>
  );
}
