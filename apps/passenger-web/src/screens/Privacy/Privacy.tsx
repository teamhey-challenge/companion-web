import { AppFrame, Card, Stack, Text } from '@hey/ui-web';
import { COPY } from '../../copy';

/** 처리방침 본문 URL이 정해지기 전까지 W1에서 연결되는 안내 화면(Q-10.4-04 잠정 문구). */
export function Privacy() {
  return (
    <AppFrame
      header={
        <Text variant="label" tone="muted">
          {COPY.brand}
        </Text>
      }
    >
      <Text variant="title" as="h1">
        {COPY.privacyTitle}
      </Text>
      <Card padding={16} tone="sunken">
        <Stack gap={8} as="ul">
          <Text variant="body">{COPY.noticeCollect}</Text>
          <Text variant="body">{COPY.noticePurpose}</Text>
          <Text variant="body">{COPY.noticeRetention}</Text>
          <Text variant="body">{COPY.noticeRefuse}</Text>
          <Text variant="body">{COPY.noticeLocation}</Text>
        </Stack>
        <Text variant="body" tone="muted">
          {COPY.providerNotice}
        </Text>
      </Card>
    </AppFrame>
  );
}
