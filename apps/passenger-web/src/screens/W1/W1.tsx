import { useEffect, useRef, useState } from 'react';
import type { PublicPairingResponse } from '@darren-pleos-challenge/hey-protocol';
import { AppFrame, Banner, Button, Card, CharacterImage, CheckboxRow, EmptyState, Spinner, Stack, Text, ToggleRow } from '@hey/ui-web';
import { COPY } from '../../copy';
import { PATHS } from '../../routes';
import type { PhoneApi } from '../../transport/api';
import type { Session } from '../../transport/session';

export interface W1Props {
  /** 주소 `/p/:pairCode`의 코드. 주소에 없거나 모양이 다르면 null. */
  pairCode: string | null;
  api: PhoneApi;
  session: Session;
  navigate: (path: string) => void;
}

type Load = { kind: 'loading' } | { kind: 'ready'; pairing: PublicPairingResponse } | { kind: 'invalid' } | { kind: 'failed' };

/** W1 QR 입장(PRD §4.9). 코드 확인 → 동의 체크 → 연결하기. */
export function W1({ pairCode, api, session, navigate }: W1Props) {
  const [load, setLoad] = useState<Load>(pairCode === null ? { kind: 'invalid' } : { kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [record, setRecord] = useState(false);
  const [memory, setMemory] = useState(false);
  const [recordError, setRecordError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    if (pairCode === null) return;
    // 이미 이 폰에 토큰이 있으면 새 연결 전에 /p/done으로 보낸다(PRD §4.9.7).
    if (session.getToken()) {
      navigate(PATHS.done);
      return;
    }
    let cancelled = false;
    setLoad({ kind: 'loading' });
    api.getPairing(pairCode).then(
      (pairing) => {
        if (cancelled) return;
        setLoad(pairing.status === 'pending' ? { kind: 'ready', pairing } : { kind: 'invalid' });
      },
      () => {
        if (!cancelled) setLoad({ kind: 'failed' });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api, session, navigate, pairCode, attempt]);

  const connect = () => {
    if (pairCode === null || inFlight.current) return;
    if (!record) {
      setRecordError(true);
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setFailed(false);
    api.claim(pairCode, { record: true, memory }).then(
      (res) => {
        session.save(res.phoneToken, res.character);
        navigate(PATHS.done);
      },
      () => {
        inFlight.current = false;
        setSubmitting(false);
        setFailed(true);
      },
    );
  };

  const header = (
    <Text variant="heading" as="span">
      {COPY.brand}
    </Text>
  );

  if (load.kind === 'invalid') {
    return (
      <AppFrame header={header}>
        <EmptyState screen icon="qr" title={COPY.invalidTitle} message={COPY.invalidMessage} />
      </AppFrame>
    );
  }
  if (load.kind === 'loading') {
    return (
      <AppFrame header={header} heading={COPY.pairTitle}>
        <Stack gap={24} align="center">
          <CharacterImage alt={COPY.characterName} state="loading" />
          <Spinner label={COPY.pairTitle} />
        </Stack>
      </AppFrame>
    );
  }
  if (load.kind === 'failed') {
    return (
      <AppFrame header={header} heading={COPY.pairTitle}>
        <EmptyState
          icon="error"
          title={COPY.pairLoadFailed}
          action={
            <Button variant="secondary" icon="refresh" onClick={() => setAttempt((n) => n + 1)}>
              {COPY.retry}
            </Button>
          }
        />
      </AppFrame>
    );
  }

  return (
    <AppFrame
      header={header}
      footer={
        <>
          {failed ? <Banner tone="danger" message={COPY.pairFailed} /> : null}
          <Button variant="ghost" size="lg" loading={submitting} disabled={!record} onClick={connect}>
            {COPY.connect}
          </Button>
          <Button variant="ghost" href={PATHS.privacy} external>
            {COPY.policy}
          </Button>
        </>
      }
    >
      <CharacterImage alt={load.pairing.character.name} />
      <Text variant="body" tone="muted" as="span">
        {COPY.pairCaption}
      </Text>
      <Stack gap={16}>
        <Text variant="display" as="h1">
          {COPY.pairTitle}
        </Text>
        <Text variant="body" tone="muted">
          {COPY.pairIntro}
        </Text>
      </Stack>
      <Card padding={16} tone="sunken">
        <Stack gap={8} as="ul">
          <Text variant="body">{COPY.noticeCollect}</Text>
          <Text variant="body">{COPY.noticePurpose}</Text>
          <Text variant="body">{COPY.noticeRetention}</Text>
          <Text variant="body">{COPY.noticeRefuse}</Text>
          <Text variant="body">{COPY.noticeLocation}</Text>
        </Stack>
        <Text variant="caption" tone="muted">
          {COPY.providerNotice}
        </Text>
      </Card>
      <Stack gap={8}>
        <CheckboxRow
          label={COPY.recordLabel}
          checked={record}
          error={recordError && !record ? COPY.recordRequired : undefined}
          onChange={(v) => {
            setRecord(v);
            if (v) setRecordError(false);
          }}
        />
        <ToggleRow label={COPY.memoryLabel} description={COPY.memoryDescription} checked={memory} onChange={setMemory} />
      </Stack>
    </AppFrame>
  );
}
