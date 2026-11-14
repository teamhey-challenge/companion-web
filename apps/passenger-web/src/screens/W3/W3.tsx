import { useCallback, useEffect, useRef, useState } from 'react';
import type { MemoryItem, Settings, SpeechStyle } from '@darren-pleos-challenge/hey-protocol';
import {
  AppFrame,
  Banner,
  Button,
  Dialog,
  EmptyState,
  IconButton,
  Inline,
  MemoryRow,
  Section,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
} from '@hey/ui-web';
import { COPY } from '../../copy';
import { ApiError, type PhoneApi } from '../../transport/api';
import type { Session } from '../../transport/session';

export interface W3Props {
  api: PhoneApi;
  session: Session;
  /** 폰 브라우저 뒤로. */
  onBack: () => void;
}

type List = { kind: 'loading' } | { kind: 'ready'; items: MemoryItem[] } | { kind: 'failed' } | { kind: 'unpaired' };
type Confirm = { kind: 'none' } | { kind: 'one'; id: string } | { kind: 'all' } | { kind: 'unpair' };

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(d);
};

const isUnauthorized = (e: unknown): boolean => e instanceof ApiError && (e.status === 401 || e.status === 403);

/** W3 기억 보기·삭제와 폰 설정(PRD §4.11, 기획 B F18: 말투·연결 해제). 개인 API 키는 MVP 밖(D-26). */
export function W3({ api, session, onBack }: W3Props) {
  const token = session.getToken();
  const [list, setList] = useState<List>(token ? { kind: 'loading' } : { kind: 'unpaired' });
  const [attempt, setAttempt] = useState(0);
  const [confirm, setConfirm] = useState<Confirm>({ kind: 'none' });
  const [busy, setBusy] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [speechFailed, setSpeechFailed] = useState(false);
  const speechSeq = useRef(0);

  const lostConnection = useCallback(() => {
    session.clear();
    setList({ kind: 'unpaired' });
  }, [session]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setList({ kind: 'loading' });
    api.listMemory(token).then(
      (items) => {
        if (!cancelled) setList({ kind: 'ready', items });
      },
      (e: unknown) => {
        if (cancelled) return;
        if (isUnauthorized(e)) lostConnection();
        else setList({ kind: 'failed' });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api, token, attempt, lostConnection]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.getSettings(token).then(
      (s) => {
        if (!cancelled) setSettings(s);
      },
      (e: unknown) => {
        if (!cancelled && isUnauthorized(e)) lostConnection();
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api, token, lostConnection]);

  const runDelete = (action: () => Promise<void>, apply: (items: MemoryItem[]) => MemoryItem[]) => {
    if (!token || busy) return;
    setBusy(true);
    setDeleteFailed(false);
    action().then(
      () => {
        setBusy(false);
        setConfirm({ kind: 'none' });
        setList((cur) => (cur.kind === 'ready' ? { kind: 'ready', items: apply(cur.items) } : cur));
      },
      (e: unknown) => {
        setBusy(false);
        setConfirm({ kind: 'none' });
        if (isUnauthorized(e)) lostConnection();
        else setDeleteFailed(true);
      },
    );
  };

  const confirmDelete = () => {
    if (!token) return;
    if (confirm.kind === 'one') {
      const id = confirm.id;
      runDelete(() => api.deleteMemory(token, id), (items) => items.filter((m) => m.id !== id));
    } else if (confirm.kind === 'all') {
      runDelete(() => api.deleteAllMemory(token), () => []);
    }
  };

  const changeSpeech = (speech: SpeechStyle) => {
    if (!token || !settings) return;
    const previous = settings;
    const seq = ++speechSeq.current;
    setSettings({ ...settings, speech });
    setSpeechFailed(false);
    api.patchSettings(token, { speech }).then(
      (next) => {
        if (seq === speechSeq.current) setSettings(next);
      },
      (e: unknown) => {
        if (seq !== speechSeq.current) return;
        if (isUnauthorized(e)) {
          lostConnection();
          return;
        }
        setSettings(previous);
        setSpeechFailed(true);
      },
    );
  };

  const unpair = () => {
    session.clear();
    setConfirm({ kind: 'none' });
    setList({ kind: 'unpaired' });
  };

  const header = (
    <Inline gap={8}>
      <IconButton icon="arrow-left" label={COPY.back} variant="secondary" onClick={onBack} />
      <Text variant="heading" as="span">
        {COPY.brand}
      </Text>
    </Inline>
  );

  if (list.kind === 'unpaired') {
    return (
      <AppFrame header={header}>
        <EmptyState screen icon="link" title={COPY.memoryUnpaired} />
      </AppFrame>
    );
  }

  const items = list.kind === 'ready' ? list.items : [];

  return (
    <AppFrame header={header}>
      <Stack gap={8}>
        <Text variant="display" as="h1">
          {COPY.memoryTitle}
        </Text>
        <Text variant="body" tone="muted">
          {COPY.memoryGuide}
        </Text>
      </Stack>

      {deleteFailed ? <Banner tone="danger" message={COPY.memoryDeleteFailed} /> : null}

      {list.kind === 'loading' ? (
        <Skeleton lines={4} />
      ) : list.kind === 'failed' ? (
        <EmptyState
          icon="error"
          title={COPY.memoryLoadFailed}
          action={
            <Button variant="secondary" icon="refresh" onClick={() => setAttempt((n) => n + 1)}>
              {COPY.retry}
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState icon="message" title={COPY.memoryEmpty} message={COPY.memoryEmptyMessage} />
      ) : (
        <Stack gap={8} as="ul">
          {items.map((m) => (
            <MemoryRow
              key={m.id}
              kind={m.kind === 'summary' ? COPY.memoryKindSummary : COPY.memoryKindFact}
              text={m.text}
              date={formatDate(m.createdAt)}
              deleteLabel={COPY.memoryDeleteOne}
              disabled={busy}
              onDelete={() => setConfirm({ kind: 'one', id: m.id })}
            />
          ))}
        </Stack>
      )}

      {items.length > 0 ? (
        <Button variant="ghost" icon="trash" disabled={busy} onClick={() => setConfirm({ kind: 'all' })}>
          {COPY.memoryDeleteAll}
        </Button>
      ) : null}

      <Section title={COPY.settingsTitle}>
        {settings ? (
          <SegmentedControl
            label={COPY.speechLabel}
            value={settings.speech}
            options={[
              { value: 'banmal', label: COPY.speechBanmal },
              { value: 'jondaetmal', label: COPY.speechJondaetmal },
            ]}
            onChange={changeSpeech}
          />
        ) : (
          <Skeleton lines={1} />
        )}
        {speechFailed ? <Banner tone="danger" message={COPY.speechFailed} /> : null}
        <Stack gap={8}>
          <Button variant="secondary" icon="logout" onClick={() => setConfirm({ kind: 'unpair' })}>
            {COPY.unpair}
          </Button>
          <Text variant="caption" tone="muted">
            {COPY.unpairHelp}
          </Text>
        </Stack>
      </Section>

      <Dialog
        open={confirm.kind === 'one'}
        title={COPY.confirmOneTitle}
        message={COPY.confirmOneMessage}
        confirm={COPY.confirmOneAction}
        cancel={COPY.cancel}
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ kind: 'none' })}
      />
      <Dialog
        open={confirm.kind === 'all'}
        title={COPY.confirmAllTitle}
        message={COPY.confirmAllMessage}
        confirm={COPY.confirmAllAction}
        cancel={COPY.cancel}
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ kind: 'none' })}
      />
      <Dialog
        open={confirm.kind === 'unpair'}
        title={COPY.unpairTitle}
        message={COPY.unpairMessage}
        confirm={COPY.unpairAction}
        cancel={COPY.cancel}
        tone="danger"
        onConfirm={unpair}
        onCancel={() => setConfirm({ kind: 'none' })}
      />
    </AppFrame>
  );
}
