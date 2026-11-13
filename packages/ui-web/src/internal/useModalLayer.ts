import { useEffect, useRef, type RefObject } from 'react';

/**
 * 내부 전용: 겹침(시트·대화상자) 하나가 지켜야 할 접근성 계약을 한 곳에서 처리한다.
 * - 뒤 페이지 inert (portal 호스트를 뺀 body 직속 자식 전부)
 * - 초점 가둠(Tab 순환), 열릴 때 안으로 초점 이동
 * - Esc는 가장 위 겹 하나만 닫는다
 * - 닫히면 연 요소로 초점 복귀
 */

interface Layer {
  id: number;
  host: HTMLElement;
  panel: HTMLElement;
  onEscape: () => void;
}

const stack: Layer[] = [];

/**
 * 뒤로 가기(§4.11): 겹마다 기록 항목 하나를 쌓고, popstate가 오면 가장 위 겹 하나만 닫는다.
 * pushed는 우리가 쌓은 항목 수다. 겹 수와 맞추는 일은 syncHistory 하나가 한다.
 */
let pushed = 0;
let ignorePops = 0;
let syncTimer: number | undefined;
let listening = false;

function listenPop() {
  if (listening) return;
  listening = true;
  window.addEventListener('popstate', onPopState);
}

function syncHistory() {
  while (pushed < stack.length) {
    window.history.pushState(window.history.state, '');
    pushed += 1;
  }
  if (pushed > stack.length) {
    const extra = pushed - stack.length;
    pushed = stack.length;
    ignorePops += 1;
    window.history.go(-extra);
  }
}

/** 다시 열리는 겹(StrictMode, 시트 교체)이 같은 항목을 이어 쓰도록 한 박자 늦춘다. */
function scheduleSync() {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(syncHistory, 30);
}

function onPopState() {
  if (ignorePops > 0) {
    ignorePops -= 1;
    return;
  }
  const top = stack[stack.length - 1];
  if (!top) return;
  pushed = Math.max(0, pushed - 1);
  top.onEscape();
  // 닫히지 않는 겹(응답이 필요한 시트)은 항목을 되돌려 놓는다.
  scheduleSync();
}

/** 연 요소가 사라졌으면(화면이 바뀜) 새 화면의 본문으로 초점을 보낸다. */
function focusFallback() {
  const target = document.querySelector<HTMLElement>('main, [role="main"], h1, h2');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
let nextId = 1;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true',
  );
}

function onDocumentKeyDown(event: KeyboardEvent) {
  const top = stack[stack.length - 1];
  if (!top) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    top.onEscape();
    return;
  }
  if (event.key === 'Tab') {
    const items = focusables(top.host);
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = document.activeElement;
    if (!top.host.contains(active)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || active === top.panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

export function useModalLayer(
  open: boolean,
  hostRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!open) return;
    const host = hostRef.current;
    const panel = panelRef.current;
    if (!host || !panel) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // 뒤 페이지를 누를 수 없게 한다. 이미 inert인 것은 건드리지 않는다.
    const made: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (child === host || !(child instanceof HTMLElement)) continue;
      if (child.tagName === 'SCRIPT' || child.hasAttribute('inert')) continue;
      child.setAttribute('inert', '');
      made.push(child);
    }

    const layer: Layer = { id: nextId++, host, panel, onEscape: () => escapeRef.current() };
    if (stack.length === 0) document.addEventListener('keydown', onDocumentKeyDown, true);
    stack.push(layer);
    listenPop();
    syncHistory();

    // 첫 초점: 시트·대화상자 이름 자체(스크린리더가 제목을 읽는다). 입력이 있으면 그쪽이 autofocus로 가져간다.
    if (!panel.contains(document.activeElement)) panel.focus({ preventScroll: true });

    return () => {
      const index = stack.findIndex((l) => l.id === layer.id);
      if (index >= 0) stack.splice(index, 1);
      if (stack.length === 0) document.removeEventListener('keydown', onDocumentKeyDown, true);
      for (const el of made) el.removeAttribute('inert');
      scheduleSync();
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      else focusFallback();
    };
  }, [open, hostRef, panelRef]);
}
