import { Icon } from '../Icon/Icon';
import { SpinnerRing } from '../../internal/SpinnerRing';
import styles from './RequestStatus.module.css';

export type RequestState = 'sending' | 'received' | 'spoken' | 'answered' | 'failed';

export interface RequestStatusLabels {
  sending: string;
  received: string;
  spoken: string;
  answered: string;
  failed: string;
}

export interface RequestStatusProps {
  state: RequestState;
  /** true면 기사님 답까지 가는 질문형(세 단계), false면 알림형(두 단계, 음성 전달에서 끝). */
  replyExpected: boolean;
  labels: RequestStatusLabels;
}

const STEPS_NOTICE = ['received', 'spoken'] as const;
const STEPS_QUESTION = ['received', 'spoken', 'answered'] as const;

/** 요청 진행 줄: 차량 수신 → 음성 전달 → 기사 응답. 음성 전달을 기사 수락으로 보이지 않는다. */
export function RequestStatus({ state, replyExpected, labels }: RequestStatusProps) {
  if (state === 'sending' || state === 'failed') {
    return (
      <span className={styles.single} data-state={state} role="status">
        {state === 'sending' ? <SpinnerRing size="sm" /> : <Icon name="error" />}
        <span>{labels[state]}</span>
      </span>
    );
  }
  const steps: ReadonlyArray<RequestState> = replyExpected ? STEPS_QUESTION : STEPS_NOTICE;
  const reached = steps.indexOf(state);
  return (
    <div className={styles.steps} role="status" aria-label={labels[state]}>
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const done = index <= reached;
          const current = index === reached;
          return (
            <li key={step} className={styles.step} data-done={done || undefined} data-current={current || undefined}>
              <span className={styles.dot} aria-hidden="true">
                {done ? <Icon name="check" /> : null}
              </span>
              <span className={styles.text}>{labels[step]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
