import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import styles from './InviteCard.module.css';
import type { Handler } from '../../handler';

/** 복사 단추의 상태. 누르기 전·후의 문구가 한 값에 묶여 있다. */
export type InviteCopyState =
  | { state: 'idle'; label: string }
  | { state: 'copied'; label: string };

export interface InviteCardProps {
  url: string;
  title: string;
  message: string;
  copy: InviteCopyState;
  onCopy: Handler;
}

/** 일행에게 보낼 초대 링크 카드. 링크는 한 줄로 줄이고 복사 단추가 따로 있다. */
export function InviteCard({ url, title, message, copy, onCopy }: InviteCardProps) {
  return (
    <Card tone="default" padding={16}>
      <Stack gap={4}>
        <Text variant="heading" as="h3">
          {title}
        </Text>
        <Text variant="label" tone="muted">
          {message}
        </Text>
      </Stack>
      <div className={styles.url} dir="ltr">
        <Text variant="label" as="span">
          {url}
        </Text>
      </div>
      <Button variant="secondary" icon={copy.state === 'copied' ? 'check' : 'link'} onClick={onCopy}>
        {copy.label}
      </Button>
    </Card>
  );
}
