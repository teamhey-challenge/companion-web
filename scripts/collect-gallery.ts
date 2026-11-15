// 공개 Storybook 에 차 앱 화면·부품과 디자이너 시안을 함께 싣기 위한 수집 단계(빌드 시점, 결과는 커밋하지 않는다).
//   (a) companion-car main 의 Paparazzi 스냅샷(PNG) → gallery/public/car/*.webp
//   (b) hey-companion-ui main 의 artifacts/delivery-v05/*.png → gallery/public/ui/*.webp  (C1..C8, W1..W3)
// 두 저장소 모두 커밋 SHA 를 고정해 이야기에 적는다. 1600px 를 넘는 그림은 1600px 로 줄인다.
// 그리고 gallery/generated/ 에 이야기 파일(.stories.tsx)과 manifest.json 을 만든다(전부 .gitignore).
// 사용: bun scripts/collect-gallery.ts
//   CAR_SHA / UI_SHA   고정할 커밋(없으면 각 저장소의 main 머리)
//   GH_TOKEN | GH_TOKEN_FILE | `gh auth token`   GitHub 읽기 권한. 값은 어디에도 출력하지 않는다.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GALLERY = join(ROOT, 'gallery');
const PUBLIC = join(GALLERY, 'public');
const GENERATED = join(GALLERY, 'generated');
const CACHE = join(GALLERY, '.cache');
const ORG = 'teamhey-challenge';
const MAX_WIDTH = 1600;
const UI_DIR = 'artifacts/delivery-v05/';

function token(): string {
  const env = process.env['GH_TOKEN'] ?? process.env['GITHUB_TOKEN'];
  if (env) return env.trim();
  const file = process.env['GH_TOKEN_FILE'];
  if (file) return readFileSync(file, 'utf8').trim();
  const r = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  throw new Error('GitHub 토큰이 없어요: GH_TOKEN, GH_TOKEN_FILE 또는 gh 로그인이 필요해요.');
}
const TOKEN = token();

async function gh(path: string, raw = false): Promise<Response> {
  let last = '';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(`https://api.github.com/${path}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'companion-web-collect-gallery',
        },
      });
      if (res.ok) return res;
      last = `HTTP ${res.status}`;
      if (res.status === 404 || res.status === 401) break;
    } catch (e) {
      last = String(e);
    }
    await new Promise((r) => setTimeout(r, 500 * attempt));
  }
  throw new Error(`GitHub 요청 실패 ${path.split('?')[0]}: ${last}`);
}

async function headSha(repo: string, pinned: string | undefined): Promise<string> {
  if (pinned) return pinned;
  const res = await gh(`repos/${ORG}/${repo}/commits/main`);
  return ((await res.json()) as { sha: string }).sha;
}

type TreeEntry = { path: string; type: string; sha: string };
async function tree(repo: string, sha: string): Promise<TreeEntry[]> {
  const res = await gh(`repos/${ORG}/${repo}/git/trees/${sha}?recursive=1`);
  const j = (await res.json()) as { tree: TreeEntry[]; truncated: boolean };
  if (j.truncated) throw new Error(`${repo}: 파일 목록이 잘렸어요(truncated)`);
  return j.tree.filter((e) => e.type === 'blob');
}

async function blob(repo: string, sha: string): Promise<Buffer> {
  const cached = join(CACHE, sha);
  if (existsSync(cached)) return readFileSync(cached);
  const buf = Buffer.from(await (await gh(`repos/${ORG}/${repo}/git/blobs/${sha}`, true)).arrayBuffer());
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(cached, buf);
  return buf;
}

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      for (;;) {
        const i = next++;
        if (i >= items.length) return;
        out[i] = await fn(items[i] as T);
      }
    }),
  );
  return out;
}

async function emit(buf: Buffer, outPath: string): Promise<{ width: number; height: number; bytes: number }> {
  const img = sharp(buf).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const { data, info } = await img.webp({ quality: 90, effort: 4 }).toBuffer({ resolveWithObject: true });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, data);
  return { width: info.width, height: info.height, bytes: data.length };
}

// ---------- 차 앱 ----------
type Theme = 'light' | 'dark';
type Part = { name: string; theme: Theme; file: string; width: number; height: number };
type Screen = { screen: string; state: string; theme: Theme; px: 1280 | 1600; file: string; width: number; height: number };
type Mock = { file: string; screen: string; variant: string; label: string; width: number; height: number };

const PART_RE = /PartSnapshotTest_parts_(.+)-(light|dark)\.png$/;
const SCREEN_RE = /(1280|1600)SnapshotTest_screens_(c\d)-(.+)-(light|dark)\.png$/;

async function collectCar(sha: string): Promise<{ parts: Part[]; screens: Screen[]; bytes: number }> {
  const entries = (await tree('companion-car', sha)).filter((e) => /\/src\/test\/snapshots\/images\/[^/]+\.png$/.test(e.path));
  const parts: Part[] = [];
  const screens: Screen[] = [];
  let bytes = 0;
  await pool(entries, 8, async (e) => {
    const base = e.path.slice(e.path.lastIndexOf('/') + 1);
    const buf = await blob('companion-car', e.sha);
    const pm = PART_RE.exec(base);
    if (pm) {
      const name = pm[1]!;
      const theme = pm[2] as Theme;
      const file = `car/parts/${name}-${theme}.webp`;
      const r = await emit(buf, join(PUBLIC, file));
      bytes += r.bytes;
      parts.push({ name, theme, file, width: r.width, height: r.height });
      return;
    }
    const sm = SCREEN_RE.exec(base);
    if (sm) {
      const px = Number(sm[1]) as 1280 | 1600;
      const screen = sm[2]!.toUpperCase();
      // designsystem 의 화면 스냅샷은 상태 이름 끝에 폭이 붙어 있다(c3-home-1280).
      const state = sm[3]!.replace(/-(1280|1600)$/, '');
      const theme = sm[4] as Theme;
      const file = `car/screens/${screen}-${state}-${px}-${theme}.webp`;
      const r = await emit(buf, join(PUBLIC, file));
      bytes += r.bytes;
      screens.push({ screen, state, theme, px, file, width: r.width, height: r.height });
      return;
    }
    console.warn(`건너뜀(이름 규칙 밖): ${base}`);
  });
  const byKey = <T extends { file: string }>(a: T, b: T) => a.file.localeCompare(b.file);
  return { parts: parts.sort(byKey), screens: screens.sort(byKey), bytes };
}

// ---------- 시안 ----------
async function collectUi(sha: string): Promise<{ mocks: Mock[]; bytes: number }> {
  const entries = (await tree('hey-companion-ui', sha)).filter((e) => e.path.startsWith(UI_DIR) && /\/[CW]\d[^/]*\.png$/.test(e.path));
  const manifest = JSON.parse((await blob('hey-companion-ui', (await tree('hey-companion-ui', sha)).find((e) => e.path === `${UI_DIR}manifest.json`)!.sha)).toString('utf8')) as {
    files: { name: string; label: string }[];
  };
  const labels = new Map(manifest.files.map((f) => [f.name, f.label]));
  let bytes = 0;
  const mocks: Mock[] = await pool(entries, 6, async (e) => {
    const name = e.path.slice(UI_DIR.length);
    const stem = name.replace(/\.png$/, '');
    const m = /^([CW]\d)(?:-(.+))?$/.exec(stem)!;
    const file = `ui/${stem}.webp`;
    const r = await emit(await blob('hey-companion-ui', e.sha), join(PUBLIC, file));
    bytes += r.bytes;
    return { file, screen: m[1]!, variant: m[2] ?? '', label: labels.get(name) ?? stem, width: r.width, height: r.height };
  });
  return { mocks: mocks.sort((a, b) => a.file.localeCompare(b.file)), bytes };
}

// 차 앱 화면(화면/상태/테마)에 짝이 되는 시안. 라이트 시안은 기본, 다크 시안은 일부 화면에만 있다.
// 같은 상태가 시안에 없으면(예: 삭제 실패 알림) 짝을 짓지 않는다.
const PAIRS: Record<string, Partial<Record<Theme, string>>> = {
  'C1/default': { light: 'C1' },
  'C2/pending': { light: 'C2' },
  'C3/idle': { light: 'C3', dark: 'C3-dark' },
  'C3/home': { light: 'C3', dark: 'C3-dark' },
  'C4/speaking': { light: 'C4' },
  'C4/long': { light: 'C4-long' },
  'C5/idle': { light: 'C5', dark: 'C5-dark' },
  'C5/driving': { light: 'C5', dark: 'C5-dark' },
  'C5/listening': { light: 'C5-listening' },
  'C5/speaking': { light: 'C5-speaking' },
  'C5/thinking': { light: 'C5-thinking' },
  'C6/memory': { light: 'C6' },
  'C6/empty': { light: 'C6-empty' },
  'C6/error': { light: 'C6-error' },
  'C6/loading': { light: 'C6-loading' },
  'C7/settings': { light: 'C7', dark: 'C7-dark' },
  'C7/saving': { light: 'C7-saving' },
  'C8/offline': { light: 'C8' },
  'C8/audio': { light: 'C8-audio' },
  'C8/microphone': { light: 'C8-microphone' },
  'C8/recognition': { light: 'C8-recognition' },
  'C8/server': { light: 'C8-server' },
};

const SCREEN_TITLES: Record<string, string> = {
  C1: '첫 만남·동의',
  C2: '폰 연결',
  C3: '정차 홈',
  C4: '정차 대화',
  C5: '주행',
  C6: '기억',
  C7: '설정',
  C8: '연결·오류',
  W1: '폰 동의',
  W2: '폰 연결 완료',
  W3: '폰 기억',
};

// ---------- 이야기 생성 ----------
const exportName = (s: string): string => {
  const parts = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const id = parts.map((p) => p[0]!.toUpperCase() + p.slice(1)).join('');
  return /^[A-Za-z]/.test(id) ? id : `S${id}`;
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const q = (v: unknown) => JSON.stringify(v);
const HEADER = `// 자동 생성: scripts/collect-gallery.ts — 커밋하지 않는다.
import type { Meta } from '@storybook/react-vite';
import { CarPart, CarScreen, MockupShot, PhoneCompare } from '../Shot';
`;

function partStories(parts: Part[], shas: Shas): Map<string, string> {
  // 부품 이름의 마지막 낱말을 변형으로 보고, 앞부분이 다른 이름의 앞부분이거나 그 자체로 이름이면 한 부품으로 묶는다.
  const names = [...new Set(parts.map((p) => p.name))];
  const prefixCount = new Map<string, number>();
  for (const n of names) {
    const i = n.lastIndexOf('-');
    if (i > 0) prefixCount.set(n.slice(0, i), (prefixCount.get(n.slice(0, i)) ?? 0) + 1);
  }
  const groupOf = (n: string): { group: string; variant: string } => {
    const i = n.lastIndexOf('-');
    if (i > 0) {
      const pre = n.slice(0, i);
      if ((prefixCount.get(pre) ?? 0) >= 2 || names.includes(pre)) return { group: pre, variant: n.slice(i + 1) };
    }
    return { group: n, variant: 'default' };
  };
  const groups = new Map<string, Map<string, { light?: Part; dark?: Part }>>();
  for (const p of parts) {
    const { group, variant } = groupOf(p.name);
    const g = groups.get(group) ?? new Map();
    const v = g.get(variant) ?? {};
    v[p.theme] = p;
    g.set(variant, v);
    groups.set(group, g);
  }
  const out = new Map<string, string>();
  for (const [group, variants] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const title = `차 앱 부품/${cap(group.replace(/-/g, ' '))}`;
    let body = `${HEADER}const meta = { title: ${q(title)}, parameters: { layout: 'fullscreen' } } satisfies Meta;\nexport default meta;\n`;
    for (const [variant, v] of [...variants].sort(([a], [b]) => a.localeCompare(b))) {
      body += `export const ${exportName(variant)} = {\n  name: ${q(variant)},\n  render: () => <CarPart name=${q(`${group} ${variant}`.trim())} light={${q(v.light ?? null)}} dark={${q(v.dark ?? null)}} sha=${q(shas.car)} />,\n};\n`;
    }
    out.set(`car-part-${group}.stories.tsx`, body);
  }
  return out;
}

function screenStories(screens: Screen[], mocks: Mock[], shas: Shas): Map<string, string> {
  const mockFile = (name: string) => mocks.find((m) => m.file === `ui/${name}.webp`);
  const out = new Map<string, string>();
  const byScreen = new Map<string, Screen[]>();
  for (const s of screens) byScreen.set(s.screen, [...(byScreen.get(s.screen) ?? []), s]);
  for (const [screen, list] of [...byScreen].sort(([a], [b]) => a.localeCompare(b))) {
    let body = `${HEADER}const meta = { title: ${q(`차 앱 화면/${screen} ${SCREEN_TITLES[screen] ?? ''}`.trim())}, parameters: { layout: 'fullscreen' } } satisfies Meta;\nexport default meta;\n`;
    const seen = new Set<string>();
    for (const s of list.sort((a, b) => a.state.localeCompare(b.state) || a.px - b.px || a.theme.localeCompare(b.theme))) {
      const name = `${s.state} (${s.theme})${s.px === 1280 ? ' 1280' : ''}`;
      const exp = exportName(`${s.state} ${s.theme} ${s.px === 1280 ? '1280' : ''}`);
      if (seen.has(exp)) continue;
      seen.add(exp);
      const pair = mockFile(PAIRS[`${screen}/${s.state}`]?.[s.theme] ?? '');
      const mock = pair ? q({ file: pair.file, width: pair.width, height: pair.height, label: pair.label }) : 'null';
      body += `export const ${exp} = {\n  name: ${q(name)},\n  globals: { theme: ${q(s.theme)} },\n  render: () => <CarScreen name=${q(`${screen} ${s.state}`)} theme=${q(s.theme)} px={${s.px}} app={${q({ file: s.file, width: s.width, height: s.height })}} mock={${mock}} note=${q(pair ? '' : PAIRS[`${screen}/${s.state}`] ? '이 상태의 다크 시안이 없어요.' : '이 상태에 해당하는 시안이 없어요.')} sha=${q(shas.car)} uiSha=${q(shas.ui)} />,\n};\n`;
    }
    out.set(`car-screen-${screen}.stories.tsx`, body);
  }
  return out;
}

function mockStories(mocks: Mock[], shas: Shas): Map<string, string> {
  const out = new Map<string, string>();
  const bySc = new Map<string, Mock[]>();
  for (const m of mocks) bySc.set(m.screen, [...(bySc.get(m.screen) ?? []), m]);
  for (const [screen, list] of [...bySc].sort(([a], [b]) => a.localeCompare(b))) {
    let body = `${HEADER}const meta = { title: ${q(`시안/${screen} ${SCREEN_TITLES[screen] ?? ''}`.trim())}, parameters: { layout: 'fullscreen' } } satisfies Meta;\nexport default meta;\n`;
    for (const m of list.sort((a, b) => a.variant.localeCompare(b.variant))) {
      const v = m.variant || 'default';
      body += `export const ${exportName(v)} = {\n  name: ${q(v)},\n  globals: { theme: ${q(m.variant === 'dark' ? 'dark' : 'light')} },\n  render: () => <MockupShot label=${q(m.label)} file=${q(m.file)} width={${m.width}} height={${m.height}} sha=${q(shas.ui)} />,\n};\n`;
    }
    out.set(`mockup-${screen}.stories.tsx`, body);
  }
  return out;
}


// 폰 웹 화면 이야기(앱) ↔ 시안. 앱은 실제 이야기를 iframe 으로 불러와 시안 옆에 놓는다(기존 폰 웹 이야기는 건드리지 않는다).
const PHONE_PAIRS: { screen: string; title: string; story: string; name: string; mock: string; theme: Theme }[] = [
  { screen: 'W1', title: 'W1 QR 입장', story: '폰-웹-w1-qr-입장--default', name: 'Default (light)', mock: 'W1', theme: 'light' },
  { screen: 'W1', title: 'W1 QR 입장', story: '폰-웹-w1-qr-입장--default', name: 'Default (dark)', mock: 'W1-dark', theme: 'dark' },
  { screen: 'W2', title: 'W2 연결 완료', story: '폰-웹-w2-연결-완료--default', name: 'Default (light)', mock: 'W2', theme: 'light' },
  { screen: 'W3', title: 'W3 기억 보기', story: '폰-웹-w3-기억-보기--default', name: 'Default (light)', mock: 'W3', theme: 'light' },
  { screen: 'W3', title: 'W3 기억 보기', story: '폰-웹-w3-기억-보기--unpair', name: 'Unpair (light)', mock: 'W3-delete', theme: 'light' },
];

function phoneStories(mocks: Mock[], shas: Shas): Map<string, string> {
  const out = new Map<string, string>();
  for (const sc of ['W1', 'W2', 'W3']) {
    const list = PHONE_PAIRS.filter((p) => p.screen === sc);
    let body = `${HEADER}const meta = { title: ${q(`폰 웹/시안 대조 ${list[0]!.title}`)}, parameters: { layout: 'fullscreen' } } satisfies Meta;\nexport default meta;\n`;
    for (const p of list) {
      const m = mocks.find((x) => x.file === `ui/${p.mock}.webp`);
      if (!m) continue;
      body += `export const ${exportName(p.name)} = {\n  name: ${q(p.name)},\n  globals: { theme: ${q(p.theme)} },\n  render: () => <PhoneCompare name=${q(`${p.screen} ${p.name}`)} theme=${q(p.theme)} storyId=${q(p.story)} mock={${q({ file: m.file, width: m.width, height: m.height, label: m.label })}} uiSha=${q(shas.ui)} />,\n};\n`;
    }
    out.set(`phone-compare-${sc}.stories.tsx`, body);
  }
  return out;
}

type Shas = { car: string; ui: string };

async function main() {
  const shas: Shas = { car: await headSha('companion-car', process.env['CAR_SHA']), ui: await headSha('hey-companion-ui', process.env['UI_SHA']) };
  console.log(`companion-car ${shas.car.slice(0, 7)}, hey-companion-ui ${shas.ui.slice(0, 7)}`);
  rmSync(PUBLIC, { recursive: true, force: true });
  rmSync(GENERATED, { recursive: true, force: true });
  const [car, ui] = await Promise.all([collectCar(shas.car), collectUi(shas.ui)]);

  mkdirSync(GENERATED, { recursive: true });
  const files = new Map<string, string>([...partStories(car.parts, shas), ...screenStories(car.screens, ui.mocks, shas), ...mockStories(ui.mocks, shas), ...phoneStories(ui.mocks, shas)]);
  for (const [name, text] of files) writeFileSync(join(GENERATED, name), text);
  const pairs = car.screens.filter((s) => ui.mocks.some((m) => m.file === `ui/${PAIRS[`${s.screen}/${s.state}`]?.[s.theme] ?? ''}.webp`)).length;
  writeFileSync(
    join(GENERATED, 'manifest.json'),
    JSON.stringify({ car: shas.car, ui: shas.ui, parts: car.parts.length, screens: car.screens.length, mockups: ui.mocks.length, paired: pairs }, null, 2) + '\n',
  );
  const total = (car.bytes + ui.bytes) / 1e6;
  console.log(`차 앱 부품 ${car.parts.length}장, 차 앱 화면 ${car.screens.length}장(시안과 짝 ${pairs}), 시안 ${ui.mocks.length}장`);
  console.log(`이야기 파일 ${files.size}개, 그림 합계 ${total.toFixed(1)} MB (webp, 최대 ${MAX_WIDTH}px)`);
}

await main();
