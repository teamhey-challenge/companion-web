import { AppFrame, Card, EmptyState, KeyValueRow, Stack, Text } from '@hey/ui-web';
import { COPY } from '../../copy';

export interface P0Props {
  /** 주소 `/p/:pairCode`의 코드. 주소에 없거나 모양이 다르면 null. */
  pairCode: string | null;
}

/** P0 QR 입장(PRD W1). 코드가 있으면 확인 화면, 없으면 QR을 다시 찍어 달라는 안내. */
export function P0({ pairCode }: P0Props) {
  const header = (
    <Text variant="label" tone="muted">
      {COPY.brand}
    </Text>
  );
  if (pairCode === null) {
    return (
      <AppFrame header={header}>
        <EmptyState screen icon="qr" title={COPY.invalidTitle} message={COPY.invalidMessage} />
      </AppFrame>
    );
  }
  return (
    <AppFrame header={header} heading={COPY.pairTitle}>
      <Card padding={24}>
        <Stack gap={16}>
          <Text variant="heading" as="h2">
            {COPY.pairTitle}
          </Text>
          <Text variant="body" tone="muted">
            {COPY.pairIntro}
          </Text>
          <KeyValueRow icon="qr" label={COPY.pairCodeLabel} value={pairCode} />
        </Stack>
      </Card>
    </AppFrame>
  );
}
