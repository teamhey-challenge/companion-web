import { Button } from '../Button/Button';
import { RequestStatus, type RequestState, type RequestStatusLabels } from '../RequestStatus/RequestStatus';
import { Text } from '../Text/Text';
import type { Lang } from '../ThemeProvider/ThemeProvider';
import styles from './MessageBubble.module.css';
import type { Handler } from '../../handler';

/** 내 말의 전달 상태. 실패일 때만 다시 보내기가 붙는다. */
export type MyDelivery =
  | { state: Exclude<RequestState, 'failed'>; replyExpected?: boolean; labels: RequestStatusLabels }
  | { state: 'failed'; replyExpected?: boolean; labels: RequestStatusLabels; retry: { label: string; onRetry: Handler } };

interface Common {
  text: string;
  lang?: Lang;
  /** 번역문 등 보조 글. */
  subText?: string;
  subLang?: Lang;
  time: string;
}

/**
 * 대화 한 줄. 누가 말했는지에 따라 붙는 것이 다르다.
 * - me: 전달 상태가 반드시 있고, 다시 보내기는 실패일 때만 있다
 * - driver: 다시 듣기(선택)
 * - system: 아무 동작 없음
 */
export type MessageBubbleProps = Common &
  (
    | { from: 'system' }
    | { from: 'driver'; listen?: { label: string; onListen: Handler } }
    | { from: 'me'; delivery: MyDelivery }
  );

/** 대화 한 줄. 내 말은 오른쪽, 기사님 말은 왼쪽, 안내는 가운데에 놓는다. */
export function MessageBubble(props: MessageBubbleProps) {
  if (props.from === 'system') {
    return (
      <div className={styles.root} data-from="system">
        <div className={styles.system}>
          <Text variant="caption" tone="muted" lang={props.lang}>
            {props.text}
          </Text>
          <Text variant="caption" tone="subtle" as="span">
            {props.time}
          </Text>
        </div>
      </div>
    );
  }

  const failed = props.from === 'me' && props.delivery.state === 'failed';
  return (
    <div className={styles.root} data-from={props.from}>
      <div className={styles.bubble} data-failed={failed || undefined}>
        <Text variant="body" lang={props.lang}>
          {props.text}
        </Text>
        {props.subText ? (
          <Text variant="label" tone="muted" lang={props.subLang}>
            {props.subText}
          </Text>
        ) : null}
        {props.from === 'driver' && props.listen ? (
          <div className={styles.actions}>
            <Button variant="ghost" icon="speaker" onClick={props.listen.onListen}>
              {props.listen.label}
            </Button>
          </div>
        ) : null}
        {props.from === 'me' && props.delivery.state === 'failed' ? (
          <div className={styles.actions}>
            <Button variant="secondary" icon="refresh" onClick={props.delivery.retry.onRetry}>
              {props.delivery.retry.label}
            </Button>
          </div>
        ) : null}
      </div>
      <div className={styles.meta}>
        {props.from === 'me' ? (
          <RequestStatus state={props.delivery.state} replyExpected={props.delivery.replyExpected ?? false} labels={props.delivery.labels} />
        ) : null}
        <Text variant="caption" tone="subtle" as="span">
          {props.time}
        </Text>
      </div>
    </div>
  );
}
