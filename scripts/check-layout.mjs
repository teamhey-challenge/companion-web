// 조립된 폰 웹 이야기를 390·360 폭에서 재고, 가로 넘침과 누름 면 겹침이 하나라도 있으면 실패한다. 허용 목록은 없다.
//
// 사용: bun run sb:build
//       bun scripts/serve-static.ts storybook-static 6107 127.0.0.1 &      (정적 Storybook 서버)
//       bun run check:layout -- http://127.0.0.1:6107
//   인자 1: 정적 Storybook 주소(기본 http://127.0.0.1:6107)   인자 2(선택): 원격 브라우저 ws 주소(없으면 DS_BROWSER_WS, 그것도 없으면 이 컴퓨터의 Chromium)
//   --only='폰 웹'   "제목 / 이야기 이름" 에 이 문자열이 들어 있는 이야기만(기본 제목이 폰 웹으로 시작; 환경변수 LAYOUT_TITLE)
//
// 가로 넘침: (1) html·body가 뷰포트보다 넓다. (2) 어떤 요소가 뷰포트 밖으로 나가 있는데 그것을 잘라 주는 조상이 없다.
//   (3) overflow가 visible인 요소의 내용이 자기 폭을 넘친다(scrollWidth > clientWidth).
//   스스로 잘라 보이는 요소(overflow hidden/clip/auto, 줄임표)는 (3)의 대상이 아니고, 그 안의 자식은 (2)에서 잘리는 조상을 인정한다.
// 겹침: 보이는 누를 수 있는 요소(button, a[href], input, textarea, select, role=button|radio|switch|checkbox|tab|menuitem)
//   둘의 상자가 1px² 넘게 겹친다. 조상-자손 관계(레이블 안의 입력)와 inert 영역 안의 요소는 제외한다.
import { openBrowser } from './browser.mjs';
import { openStory } from './lib/sb-nav.mjs';

const rawArgs = process.argv.slice(2).filter((a) => a !== '--');
const flag = (name) => rawArgs.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const args = rawArgs.filter((a) => !a.startsWith('--'));
const base = (args[0] ?? 'http://127.0.0.1:6107').replace(/\/$/, '');
const ws = args[1] ?? process.env.DS_BROWSER_WS;
const widths = [390, 360];
// 어두운 테마는 390에서 한 번 더 잰다(색만 바뀌므로 폭 하나면 충분하다).
const darkWidth = 390;
const onlyFlag = flag('only');
const titlePrefix = process.env.LAYOUT_TITLE ?? '폰 웹';
const PARALLEL = 2;
const SETTLE_MS = 1200;
const RECYCLE_EVERY = 25;

const indexRes = await fetch(`${base}/index.json`).catch(() => null);
if (!indexRes?.ok) {
  console.error(`${base}/index.json 을 읽지 못했어요. 정적 Storybook을 먼저 띄워 주세요.`);
  process.exit(2);
}
const entries = Object.values((await indexRes.json()).entries).filter(
  (e) => e.type === 'story' && (onlyFlag !== undefined ? `${e.title} / ${e.name}`.includes(onlyFlag) : e.title.startsWith(titlePrefix)),
);
if (entries.length === 0) {
  console.error(`'${titlePrefix}' 이야기가 없어요.`);
  process.exit(2);
}

/** 브라우저 안에서 도는 측정. 값만 돌려준다. */
function measure() {
  const vw = document.documentElement.clientWidth;
  const out = { overflow: [], overlap: [] };
  const name = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const role = el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : '';
    const label = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 28);
    return `${el.tagName.toLowerCase()}${id}${role} "${label}"`;
  };
  const root = document.documentElement;
  const body = document.body;
  if (root.scrollWidth > root.clientWidth) out.overflow.push(`html scrollWidth ${root.scrollWidth} > ${root.clientWidth}`);
  if (body.scrollWidth > body.clientWidth) out.overflow.push(`body scrollWidth ${body.scrollWidth} > ${body.clientWidth}`);

  const clips = (el) => {
    const s = getComputedStyle(el);
    return s.overflowX !== 'visible';
  };
  const clippedByAncestor = (el) => {
    for (let p = el.parentElement; p && p !== document.body && p !== root; p = p.parentElement) if (clips(p)) return true;
    return false;
  };

  for (const el of document.body.querySelectorAll('*')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if ((r.right > vw + 0.5 || r.left < -0.5) && !clippedByAncestor(el) && style.position !== 'fixed') {
      out.overflow.push(`${name(el)} box ${Math.round(r.left)}..${Math.round(r.right)} outside 0..${vw}`);
    }
    if (!clips(el) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      out.overflow.push(`${name(el)} scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}`);
    }
  }

  const sel = 'button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=radio], [role=switch], [role=checkbox], [role=tab], [role=menuitem]';
  const items = [];
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest('[inert]')) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 4) continue; // 시각적으로 숨긴 입력(스위치의 실제 체크박스 등)
    items.push({ el, r });
  }
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 1 && h > 1) out.overlap.push(`${name(a.el)}  x  ${name(b.el)}  (${Math.round(w)}x${Math.round(h)})`);
    }
  }
  return out;
}

// 작업은 (폭·언어·테마) 묶음 순으로 늘어놓는다: 같은 묶음 안에서는 페이지를 다시 불러오지 않고 이야기만 바꾼다.
const jobs = [];
const addGroup = (width, theme) => {
  for (const e of entries) jobs.push({ id: e.id, title: `${e.title} / ${e.name}`, width, theme, groupKey: `${width}|${theme}` });
};
for (const width of widths) addGroup(width, 'light');
addGroup(darkWidth, 'dark');

const browser = await openBrowser(ws);
const failures = [];
let next = 0;
try {
  const worker = async () => {
    let context;
    let page;
    let served = 0;
    const nav = { groupKey: null, id: null };
    const fresh = async () => {
      // 이야기 수백 개를 한 페이지로 넘기면 공유 브라우저(메모리 상한 6GB)가 OOM 으로 죽는다: 일정 횟수마다 컨텍스트를 새로 연다.
      await context?.close();
      context = await browser.newContext({ viewport: { width: widths[0], height: 844 }, deviceScaleFactor: 1 });
      page = await context.newPage();
      served = 0;
      nav.groupKey = null;
      nav.id = null;
    };
    await fresh();
    try {
      for (;;) {
        const job = jobs[next++];
        if (!job) return;
        if (served++ >= RECYCLE_EVERY) await fresh();
        try {
          // 이전 이야기를 위해 늘려 둔 뷰포트 높이를 되돌리고, 같은 (폭·언어·테마) 묶음이면 이야기만 바꾼다(lib/sb-nav.mjs).
          await page.setViewportSize({ width: job.width, height: 844 });
          await openStory(page, nav, { base, id: job.id, theme: job.theme, groupKey: job.groupKey });
          await page.waitForTimeout(SETTLE_MS);
          // 스크롤로 고정 막대 아래에 들어간 내용이 겹침으로 잡히지 않도록, 폭은 그대로 두고 뷰포트 높이를 내용 높이까지 늘려 잰다.
          const height = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, 844));
          await page.setViewportSize({ width: job.width, height: Math.min(height, 6000) });
          await page.waitForTimeout(400);
          const result = await page.evaluate(measure);
          if (result.overflow.length || result.overlap.length) failures.push({ ...job, ...result });
        } catch (error) {
          failures.push({ ...job, overflow: [`측정 실패: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`], overlap: [] });
        }
      }
    } finally {
      await context.close();
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));
} finally {
  await browser.close();
}

if (failures.length) {
  failures.sort((a, b) => a.title.localeCompare(b.title) || b.width - a.width);
  for (const f of failures) {
    console.error(`FAIL ${f.title} @${f.width} theme=${f.theme}`);
    for (const line of [...new Set(f.overflow)].slice(0, 6)) console.error(`  넘침: ${line}`);
    for (const line of [...new Set(f.overlap)].slice(0, 6)) console.error(`  겹침: ${line}`);
  }
  console.error(`check:layout failed — ${failures.length}/${jobs.length}건 (이야기 ${entries.length}개 × 폭 ${widths.join('·')} 라이트 + ${darkWidth} 다크)`);
  process.exit(1);
}
console.log(`check:layout ok — 이야기 ${entries.length}개 × 폭 ${widths.join('·')} 라이트 + ${darkWidth} 다크 = ${jobs.length}회, 넘침·겹침 0`);
