import { createPortal } from 'react-dom';
import type { ReactNode, Ref } from 'react';

/** 내부 전용: body 직속에 겹침 호스트를 하나 만든다(뒤 페이지를 inert로 만들 때 호스트만 뺀다). */
export function Portal({ hostRef, children }: { hostRef: Ref<HTMLDivElement>; children: ReactNode }) {
  if (typeof document === 'undefined') return null;
  return createPortal(<div ref={hostRef}>{children}</div>, document.body);
}
