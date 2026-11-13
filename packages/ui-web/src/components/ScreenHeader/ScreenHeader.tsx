import { ConnectionIndicator, type ConnectionStatus } from '../ConnectionIndicator/ConnectionIndicator';
import { IconButton } from '../IconButton/IconButton';
import { PlateBadge } from '../PlateBadge/PlateBadge';
import type { PartySize } from '../PartySizePicker/PartySizePicker';
import { Text } from '../Text/Text';
import { Wordmark } from '../Wordmark/Wordmark';
import styles from './ScreenHeader.module.css';
import type { Handler } from '../../handler';

/**
 * 연결 상태. 끊김 사유(`detail`)는 끊겼을 때만 뜻이 있으므로 그 갈래에만 있다.
 */
export type ScreenConnection =
  | { status: 'online' | 'reconnecting'; labels: Record<ConnectionStatus, string> }
  | { status: 'offline'; labels: Record<ConnectionStatus, string>; detail?: string };

export interface ScreenHeaderProps {
  partySize: PartySize;
  /** 차량 번호 뒤 4자리. 아직 차가 정해지지 않았으면 없다. */
  plateSuffix?: string;
  connection: ScreenConnection;
  back?: { label: string; onBack: Handler };
  menu?: { label: string; onOpen: Handler; disabled?: boolean };
  /** HEY 로고를 보일지(기본 보임). 같은 화면 본문에 로고가 이미 있으면 끈다. */
  brand?: boolean;
}

/** 화면 맨 위 한 줄: 뒤로, HEY 로고, 차량 번호, 연결 상태, 메뉴. 좁으면 연결 상태가 아래줄로 내려간다. banner 구역은 AppFrame 이 만든다(여기서 또 만들면 중첩된다). */
export function ScreenHeader({ partySize, plateSuffix, connection, back, menu, brand = true }: ScreenHeaderProps) {
  const detail = connection.status === 'offline' ? connection.detail : undefined;
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.start}>
          {back ? <IconButton icon="arrow-left" label={back.label} onClick={back.onBack} /> : null}
          {brand ? <Wordmark partySize={partySize} size="md" animate /> : null}
          {plateSuffix ? <PlateBadge plateSuffix={plateSuffix} /> : null}
        </div>
        <div className={styles.end}>
          <ConnectionIndicator status={connection.status} labels={connection.labels} />
          {menu ? <IconButton icon="menu" label={menu.label} disabled={menu.disabled} onClick={menu.onOpen} /> : null}
        </div>
      </div>
      {detail ? (
        <Text variant="caption" tone="danger">
          {detail}
        </Text>
      ) : null}
    </div>
  );
}
