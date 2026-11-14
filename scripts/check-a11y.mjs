// 정적 Storybook 의 모든 이야기를 axe-core 로 검사하고, 위반이 하나라도 있으면 실패한다. 허용 목록은 없다.
//
// 사용: bun run sb:build
//       bun scripts/serve-static.ts storybook-static 6107 127.0.0.1 &
//       bun run check:a11y -- http://127.0.0.1:6107
//   인자 1: 정적 Storybook 주소(기본 http://127.0.0.1:6107)   인자 2(선택): 원격 브라우저 ws 주소(없으면 DS_BROWSER_WS, 그것도 없으면 이 컴퓨터의 Chromium)
//   --themes=light      어떤 테마로 그릴지(기본 light,dark; 환경변수 A11Y_THEMES)
//   --only=폰 웹     "제목 / 이야기 이름" 에 이 문자열이 들어 있는 이야기만(기본 전체; 환경변수 A11Y_FILTER)
import { createRequire } from 'node:module';
import { openBrowser } from './browser.mjs';
import { openStory } from './lib/sb-nav.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const rawArgs = process.argv.slice(2).filter((a) => a !== '--');
const flag = (name) => rawArgs.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const args = rawArgs.filter((a) => !a.startsWith('--'));
const base = (args[0] ?? 'http://127.0.0.1:6107').replace(/\/$/, '');
const ws = args[1] ?? process.env.DS_BROWSER_WS;
const list = (v, d) => (v ?? d).split(',').map((s) => s.trim()).filter(Boolean);
const themes = list(flag('themes') ?? process.env.A11Y_THEMES, 'light,dark');
const only = flag('only') ?? process.env.A11Y_FILTER ?? '';
const PARALLEL = 2;
const SETTLE_MS = 800;
const RECYCLE_EVERY = 25;
const screenPrefix = '폰 웹';

const indexRes = await fetch(`${base}/index.json`).catch(() => null);
if (!indexRes?.ok) {
  console.error(`check:a11y: ${base}/index.json 을 못 읽었어요. 정적 Storybook 을 먼저 띄우세요.`);
  process.exit(1);
}
const entries = Object.values((await indexRes.json()).entries).filter((e) => e.type === 'story' && `${e.title} / ${e.name}`.includes(only));
if (entries.length === 0) {
  console.error('check:a11y: 검사할 이야기가 없어요.');
  process.exit(1);
}

const jobs = [];
for (const theme of themes) for (const e of entries) jobs.push({ id: e.id, title: `${e.title} / ${e.name}`, theme, groupKey: theme });

// 키보드 Tab 으로 이야기의 모든 초점 대상을 차례로 돌며, 초점을 받은 요소 자신이 고리를 그리는지 잰다.
//  - 자신의 outline(또는 box-shadow)이 있어야 한다. 부모 :focus-within 이 대신 그리면 안 된다.
//  - 조상 중 초점 때문에 고리를 그리는 것이 있으면(이중 고리) 실패.
//  - 고리가 닿는 사각형(outline-offset + 굵기만큼 번진 상자)이 화면과 잘라내는 조상 안에 온전히 들어와야 한다.
async function checkFocusRings(page) {
  const issues = [];
  const seen = new Set();
  await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return { done: true };
      const name = (e) => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''}`;
      const key = (() => { const p = []; for (let e = el; e && e !== document.body; e = e.parentElement) p.push(`${name(e)}#${[...(e.parentElement?.children ?? [])].indexOf(e)}`); return p.join('<'); })();
      const cs = getComputedStyle(el);
      const ringOf = (s) => (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow !== 'none' && s.boxShadow !== '');
      const own = ringOf(cs);
      const width = parseFloat(cs.outlineWidth) || 0;
      const reach = cs.outlineStyle !== 'none' ? width + (parseFloat(cs.outlineOffset) || 0) : 0;
      const b = el.getBoundingClientRect();
      const ring = { l: b.left - Math.max(reach, 0), t: b.top - Math.max(reach, 0), r: b.right + Math.max(reach, 0), b: b.bottom + Math.max(reach, 0) };
      const problems = [];
      if (!own) problems.push('초점 요소 자신에게 outline/box-shadow 가 없다');
      else if (cs.outlineStyle !== 'none' && width < 3) problems.push(`고리 굵기 ${width}px < 3px`);
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (p !== document.documentElement && p.matches(':focus-within') && ps.outlineStyle !== 'none' && parseFloat(ps.outlineWidth) > 0) problems.push(`조상 ${name(p)} 도 고리를 그린다(이중 고리)`);
      }
      const vw = document.documentElement.clientWidth;
      if (ring.l < -0.5 || ring.r > vw + 0.5) problems.push(`고리가 화면 가로 밖으로 나간다(${ring.l.toFixed(1)}..${ring.r.toFixed(1)} / ${vw})`);
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        const clips = (v) => v !== 'visible';
        if (!clips(ps.overflowX) && !clips(ps.overflowY) && ps.clipPath === 'none') continue;
        const pb = p.getBoundingClientRect();
        const bw = (v) => parseFloat(v) || 0;
        const box = { l: pb.left + bw(ps.borderLeftWidth), r: pb.right - bw(ps.borderRightWidth), t: pb.top + bw(ps.borderTopWidth), b: pb.bottom - bw(ps.borderBottomWidth) };
        const scrollsY = ps.overflowY === 'auto' || ps.overflowY === 'scroll';
        if (clips(ps.overflowX) && (ring.l < box.l - 0.5 || ring.r > box.r + 0.5)) problems.push(`고리가 ${name(p)} 에 가로로 잘린다`);
        if (clips(ps.overflowY) && !scrollsY && (ring.t < box.t - 0.5 || ring.b > box.b + 0.5)) problems.push(`고리가 ${name(p)} 에 세로로 잘린다`);
      }
      return { done: false, key, label: key.split('<')[0], problems };
    });
    if (r.done || seen.has(r.key)) break;
    seen.add(r.key);
    for (const p of r.problems) issues.push(`${r.label}: ${p}`);
  }
  return issues;
}

const browser = await openBrowser(ws);
const failures = [];
let next = 0;
try {
  const worker = async () => {
    // 한 페이지로 이야기 수백 개를 넘기면 공유 브라우저(메모리 상한 6GB)가 OOM 으로 죽는다: 일정 횟수마다 컨텍스트를 새로 연다.
    let context;
    let page;
    let served = 0;
    const nav = { groupKey: null, id: null };
    const fresh = async () => {
      await context?.close();
      context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
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
          // 이야기가 아무것도 그리지 않는 경우(빈 목록 따위)도 있어, 뿌리 자식이 아니라 Storybook 의 렌더 끝 표시를 기다린다.
          // 같은 언어·테마 묶음 안에서는 페이지를 다시 불러오지 않고 이야기만 바꾼다(lib/sb-nav.mjs).
          await openStory(page, nav, { base, id: job.id, theme: job.theme, groupKey: job.groupKey });
          await page.waitForTimeout(SETTLE_MS);
          if (!(await page.evaluate(() => typeof window.axe !== 'undefined'))) await page.addScriptTag({ path: axePath });
          // 조립된 화면은 문서 전체를, 부품 이야기는 이야기 뿌리만 잰다. 부품 조각에는 페이지 수준 규칙 region 이 뜻이 없어 끈다.
          const wholePage = job.title.startsWith(screenPrefix);
          const runAxe = () =>
            page.evaluate(
              async ({ wholePage }) => {
                /* eslint-disable no-undef */
                // 이야기가 parameters.a11y.config 로 규칙을 끈 경우(예: 한 화면에 휴대폰 틀 둘을 나란히 놓는 모음 이야기)는 같은 설정을 따른다.
                const params = window.__STORYBOOK_PREVIEW__?.currentRender?.story?.parameters?.a11y ?? {};
                axe.reset();
                if (params.config) axe.configure(params.config);
                const r = await axe.run(wholePage ? document : '#storybook-root', {
                  resultTypes: ['violations'],
                  rules: wholePage ? {} : { region: { enabled: false } },
                });
                /* eslint-enable no-undef */
                return r.violations.map((v) => ({
                  id: v.id,
                  impact: v.impact,
                  help: v.help,
                  nodes: v.nodes.map((n) => ({
                    target: n.target.join(' '),
                    summary: [...n.any, ...n.all, ...n.none].map((c) => c.message).join(' | '),
                  })),
                }));
              },
              { wholePage },
            );
          // play 함수가 있는 이야기는 Storybook 의 a11y 애드온이 같은 axe 를 이미 돌리고 있을 수 있다. 끝날 때까지 기다렸다 다시 잰다.
          let violations;
          for (let attempt = 1; ; attempt++) {
            try {
              violations = await runAxe();
              break;
            } catch (error) {
              if (attempt >= 6 || !String(error).includes('Axe is already running')) throw error;
              await page.waitForTimeout(1000);
            }
          }
          if (violations.length) failures.push({ ...job, violations });
          const ringIssues = await checkFocusRings(page);
          if (ringIssues.length) failures.push({ ...job, violations: ringIssues.map((m) => ({ id: 'focus-ring', impact: 'serious', help: m, nodes: [] })) });
        } catch (error) {
          failures.push({ ...job, violations: [{ id: 'run-error', impact: 'n/a', help: error instanceof Error ? error.message.split('\n')[0] : String(error), nodes: [] }] });
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
  failures.sort((a, b) => a.title.localeCompare(b.title));
  for (const f of failures) {
    console.error(`FAIL ${f.title} theme=${f.theme}`);
    for (const v of f.violations) {
      console.error(`  ${v.id} (${v.impact}): ${v.help}`);
      for (const n of v.nodes.slice(0, 4)) console.error(`    ${n.target} — ${n.summary}`);
    }
  }
  const byRule = new Map();
  for (const f of failures) for (const v of f.violations) byRule.set(v.id, (byRule.get(v.id) ?? 0) + 1);
  console.error(`\ncheck:a11y 실패 — ${failures.length}/${jobs.length}회에서 위반. 규칙별: ${[...byRule].map(([k, c]) => `${k}×${c}`).join(', ')}`);
  process.exit(1);
}
console.log(`check:a11y ok — 이야기 ${entries.length}개 × 테마 ${themes.join('·')} = ${jobs.length}회, axe 위반 0`);
