import { AppFrame, Button, CharacterImage, EmptyState, Stack, Text } from '@hey/ui-web';
import { COPY } from '../../copy';
import { PATHS } from '../../routes';
import type { Session } from '../../transport/session';

export interface W2Props {
  session: Session;
}

/** W2 연결 완료·캐릭터 소개(PRD §4.10). 연결 정보가 없으면 QR을 다시 찍어 달라는 안내만 보인다. */
export function W2({ session }: W2Props) {
  const header = (
    <Text variant="label" tone="muted">
      {COPY.brand}
    </Text>
  );
  if (!session.getToken()) {
    return (
      <AppFrame header={header}>
        <EmptyState screen icon="qr" title={COPY.notPairedTitle} message={COPY.notPairedMessage} />
      </AppFrame>
    );
  }
  const name = session.getCharacter()?.name ?? COPY.characterName;
  return (
    <AppFrame header={header}>
      <CharacterImage alt={name} />
      <Stack gap={16} align="center">
        <Text variant="display" as="h1">
          {COPY.doneTitle}
        </Text>
        <Text variant="body" tone="muted">
          {COPY.doneIntro}
        </Text>
        <Text variant="body">{COPY.doneNext}</Text>
      </Stack>
      <Button variant="primary" size="lg" href={PATHS.memory}>
        {COPY.doneMemory}
      </Button>
    </AppFrame>
  );
}
