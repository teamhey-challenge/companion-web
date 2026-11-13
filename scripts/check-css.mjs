// CSS 리터럴 검사(규칙 13). 값 검사는 hey-shared의 checkCss를 그대로 쓰고, 이 저장소의 경로로 돌린다.
//   1) packages/ui-web/src 의 모든 .css 에 색·길이 리터럴이 없다(var(--hey-*)만).
//   2) packages/ui-web 밖에는 .css 파일이 없다. 예외는 토큰 dist(shared/packages/tokens/dist/tokens.css) 하나뿐, 허용 목록 없음.
// 사용: node scripts/check-css.mjs   (bun run check:css)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checker = join(root, 'shared/packages/tokens/scripts/check-css.mjs');
if (!existsSync(checker)) {
  console.error('shared/ 서브모듈이 비어 있어요. `git submodule update --init` 을 먼저 실행하세요.');
  process.exit(1);
}
const { checkCss } = await import(checker);

const SKIP = new Set(['node_modules', '.git', 'storybook-static', 'dist', 'build', '.review']);
const TOKENS_DIST = join('shared', 'packages', 'tokens', 'dist', 'tokens.css');
const UI = join('packages', 'ui-web');

const inUi = [];
const stray = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e) && !(e === 'dist' && dir.startsWith(join(root, 'shared')))) continue;
    const p = join(dir, e);
    const rel = p.slice(root.length + 1);
    if (statSync(p).isDirectory()) {
      walk(p);
    } else if (e.endsWith('.css')) {
      if (rel.startsWith(UI + '/')) inUi.push(p);
      else if (rel !== TOKENS_DIST) stray.push(rel);
    }
  }
};
walk(root);

let bad = 0;
for (const rel of stray) {
  bad++;
  console.error(`${rel}: .css 파일은 packages/ui-web 안에만 둘 수 있어요 (docs/architecture.md §4 규칙 13)`);
}
for (const f of inUi) {
  for (const p of checkCss(readFileSync(f, 'utf8'))) {
    bad++;
    console.error(`${f}:${p.line}: ${p.reason}: ${p.text}`);
  }
}
if (bad) {
  console.error(`check:css failed — ${bad} violation(s) in ${inUi.length} file(s)`);
  process.exit(1);
}
console.log(`check:css ok — ${inUi.length} file(s)`);
