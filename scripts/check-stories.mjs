// 규칙 14: 이야기는 "있다"가 아니라 "그 부품을 그렸다"로 센다.
// storybook-static/index.json 에서 부품마다 (1) 이야기 파일이 있고 (2) 그 파일의 meta component 가 그 부품이며
// (3) 해당 상황 이름의 이야기가 빠지지 않았는지 확인한다. 허용 목록은 두지 않는다.
// 사용: bun run sb:build && bun run check:stories
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'storybook-static/index.json');
if (!existsSync(indexPath)) {
  console.error('storybook-static/index.json 이 없어요. 먼저 `bun run sb:build`를 실행하세요.');
  process.exit(1);
}

/**
 * 부품마다 필요한 상황 이야기(내보내기 이름). docs/components.md 2절의 "상황" 열에서 해당하는 것.
 * Default·AllStates는 모든 부품에 필수다.
 *  LongText: 긴 글(띄어쓰기 없는 일본어·중국어 120자 이상) · Empty: 빈 값/0개 · Many: 항목 많음 ·
 *  Disabled: 비활성 · Error: 오류·실패 · Loading: 로딩·보내는 중
 */
const SITUATIONS = {
  ThemeProvider: [],
  AppFrame: ['LongText'],
  Stack: ['LongText', 'Empty', 'Many'],
  Inline: ['LongText', 'Many'],
  Section: ['LongText', 'Empty'],
  Divider: [],
  VisuallyHidden: ['Empty'],
  Text: ['LongText', 'Empty'],
  Wordmark: [],
  Icon: ['Many'],
  Button: ['LongText', 'Disabled', 'Loading'],
  IconButton: ['Disabled'],
  SegmentedControl: ['LongText'],
  PartySizePicker: [],
  ChoiceChip: ['LongText', 'Disabled'],
  ChipGroup: ['Empty', 'Many'],
  PresetTile: ['LongText', 'Disabled', 'TwoLineLabel'],
  PresetGrid: ['Many'],
  LanguageOption: ['LongText'],
  LanguageList: ['Many'],
  SearchField: ['Empty', 'Loading'],
  TextComposer: ['LongText', 'Empty', 'Error', 'Loading'],
  ToggleRow: ['LongText', 'Disabled'],
  Card: ['LongText', 'Empty'],
  StatusPill: ['LongText'],
  RequestStatus: ['Error', 'Loading'],
  Banner: ['LongText'],
  EmptyState: ['LongText'],
  Spinner: [],
  Skeleton: [],
  KeyValueRow: ['LongText', 'Empty'],
  ConnectionIndicator: [],
  Countdown: [],
  PlateBadge: ['Empty'],
  BottomSheet: ['LongText'],
  Dialog: ['LongText'],
  Toast: ['LongText'],
  Menu: ['LongText', 'Empty', 'Many'],
  ScreenHeader: ['Error'],
  PlaceResultRow: ['LongText'],
  PlaceResultList: ['LongText', 'Empty', 'Many'],
  DestinationSummary: ['LongText', 'AreaInsideAddress'],
  ConditionSummary: ['Empty', 'Many'],
  BoardingCard: ['LongText', 'Empty'],
  ShowDriverCard: ['LongText'],
  TripProgress: ['Empty'],
  TollNotice: [],
  MessageBubble: ['LongText', 'Error', 'Loading'],
  MessageList: ['Empty', 'Many', 'CutTopFade'],
  AdSlot: ['LongText', 'Empty', 'Many'],
  TextField: ['LongText', 'Empty', 'Disabled'],
  DropoffProposalCard: ['LongText', 'Disabled', 'Loading'],
  ArrivalSummary: ['LongText', 'Empty'],
  InviteCard: ['LongText'],
};

/**
 * 폰 웹 화면마다 상태 이야기와 주요 상호작용(play)이 있는지 본다. 화면이 늘면 여기에 적는다.
 */
const SCREEN_STORIES = {
  'P0 QR 입장': ['Default', 'Invalid'],
};
/** 이 화면들의 이야기는 play 함수가 있어야 한다(주요 상호작용). */
const SCREEN_PLAY = {
  'P0 QR 입장': ['Default'],
};

const toId = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

// 내보낸 부품 이름: src/index.ts 의 값 내보내기 중 대문자로 시작하고 전부 대문자는 아닌 것.
const indexSrc = readFileSync(join(root, 'packages/ui-web/src/index.ts'), 'utf8');
const exported = new Set();
for (const m of indexSrc.matchAll(/export\s*\{([^}]*)\}\s*from/g)) {
  for (const part of m[1].split(',')) {
    const name = part.trim();
    if (!name || name.startsWith('type ')) continue;
    if (/^[A-Z][A-Za-z0-9]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name)) exported.add(name);
  }
}

const problems = [];
for (const name of exported) if (!(name in SITUATIONS)) problems.push(`${name}: check-stories 의 SITUATIONS 표에 없어요. 부품을 추가했다면 표에도 적어요.`);
for (const name of Object.keys(SITUATIONS)) if (!exported.has(name)) problems.push(`${name}: SITUATIONS 표에는 있지만 index.ts 에서 내보내지 않아요.`);

const entries = Object.values(JSON.parse(readFileSync(indexPath, 'utf8')).entries).filter((e) => e.type === 'story');
const byFile = new Map();
for (const e of entries) {
  if (!byFile.has(e.importPath)) byFile.set(e.importPath, []);
  byFile.get(e.importPath).push(e);
}

for (const name of exported) {
  const file = `./packages/ui-web/src/components/${name}/${name}.stories.tsx`;
  const stories = byFile.get(file);
  if (!stories) {
    problems.push(`${name}: 이야기 파일(${file})이 빌드 index.json 에 없어요.`);
    continue;
  }
  const src = readFileSync(join(root, file), 'utf8');
  if (!new RegExp(`component:\\s*${name}\\b`).test(src)) problems.push(`${name}: 이야기 파일의 meta component 가 ${name} 이 아니에요.`);
  const have = new Set(stories.map((s) => s.name));
  const required = ['Default', 'AllStates', ...(SITUATIONS[name] ?? [])];
  for (const story of required) {
    // 내보내기 이름이 이야기 id 끝에 들어 있다(Storybook 이 내보내기 이름을 kebab 으로 바꾼 id 를 쓴다).
    const suffix = `--${toId(story).toLowerCase().replace(/ /g, '-')}`;
    if (!stories.some((s) => s.id.endsWith(suffix))) problems.push(`${name}: 상황 이야기 ${story} 가 없어요 (현재: ${[...have].join(', ')}).`);
  }
}

const screenIdOf = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
for (const [screen, names] of Object.entries(SCREEN_STORIES)) {
  const title = `승객 화면/${screen}`;
  const have = entries.filter((e) => e.title === title);
  if (have.length === 0) {
    problems.push(`${screen}: 승객 화면 이야기가 index.json 에 없어요.`);
    continue;
  }
  for (const name of names) {
    const story = have.find((e) => e.id.endsWith(`--${screenIdOf(name)}`));
    if (!story) problems.push(`${screen}: 상태 이야기 ${name} 가 없어요.`);
    else if ((SCREEN_PLAY[screen] ?? []).includes(name) && !(story.tags ?? []).includes('play-fn')) problems.push(`${screen}: ${name} 에 play 함수가 없어요.`);
  }
  for (const e of have) if (!names.some((n) => e.id.endsWith(`--${screenIdOf(n)}`))) problems.push(`${screen}: 이야기 ${e.name} 가 SCREEN_STORIES 에 없어요(표에 적어요).`);
}

if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`check:stories failed — ${problems.length}건`);
  process.exit(1);
}
console.log(`check:stories ok — 부품 ${exported.size}개, 이야기 ${entries.length}개`);
