// 로컬 점검 한 번에: lint → check:css → tsc(두 패키지) → bun test → Storybook 정적 빌드 → check:stories → (선택) check:layout, check:a11y.
// 사용: bun run check                        브라우저 검사 제외
//       bun run check -- --layout            마지막에 check:layout 까지(ds-browser 필요: DS_BROWSER_WS 가 없으면 `ds-browser` 로 얻는다)
//       bun run check -- --a11y              check:a11y(axe, 모든 이야기 위반 0) 까지. 둘을 함께 줄 수도 있다.
//       --langs=th,vi  --only='PresetGrid'   브라우저 검사를 언어/이야기로 좁힌다(둘 다 check:layout·check:a11y 로 그대로 넘긴다).
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const withA11y = process.argv.includes('--a11y');
const withLayout = process.argv.includes('--layout');
const passthrough = process.argv.slice(2).filter((a) => a.startsWith('--langs=') || a.startsWith('--only=') || a.startsWith('--themes='));
const started = Date.now();

if (!existsSync(join(root, 'shared/packages/tokens/package.json'))) {
  console.error('shared/ 서브모듈이 비어 있어요. `git submodule update --init` 을 먼저 실행하세요.');
  process.exit(1);
}

const freePort = () =>
  new Promise((res, rej) => {
    const s = createServer();
    s.once('error', rej);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

const run = (label, cmd, args, opts = {}) => {
  console.log(`\n=== ${label}: ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', ...opts });
  if (r.status !== 0) {
    console.error(`\ncheck 실패: ${label}`);
    process.exit(r.status ?? 1);
  }
};

run('lint', 'bun', ['run', 'lint']);
run('check:css', 'bun', ['run', 'check:css']);
run('tsc ui-web', 'bun', ['run', '--cwd', 'packages/ui-web', 'typecheck']);
run('test ui-web', 'bun', ['run', '--cwd', 'packages/ui-web', 'test']);
run('tsc passenger-web', 'bun', ['run', '--cwd', 'apps/passenger-web', 'typecheck']);
run('test passenger-web', 'bun', ['run', '--cwd', 'apps/passenger-web', 'test']);
run('check:bundle', 'bun', ['run', 'check:bundle']);
run('storybook build', 'nice', ['-n', '19', 'bun', 'run', 'sb:build']);
run('check:stories', 'bun', ['run', 'check:stories']);

if (withLayout || withA11y) {
  const port = process.env.LAYOUT_PORT ?? String(await freePort());
  let ws = process.env.DS_BROWSER_WS;
  if (!ws) {
    const r = spawnSync('ds-browser', [], { encoding: 'utf8' });
    ws = r.stdout?.trim();
    if (!ws) {
      console.error('check:layout: DS_BROWSER_WS 도 없고 ds-browser 도 실행되지 않아요.');
      process.exit(1);
    }
  }
  const server = spawn('bun', ['scripts/serve-static.ts', 'storybook-static', port, '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  try {
    await new Promise((r) => setTimeout(r, 1500));
    if (withLayout) {
      run('check:layout', 'bun', ['run', 'check:layout', '--', `http://127.0.0.1:${port}`, ...passthrough], {
        env: { ...process.env, DS_BROWSER_WS: ws },
      });
    }
    if (withA11y) {
      const env = { ...process.env, DS_BROWSER_WS: ws };
      // 부품 이야기는 언어와 무관하므로 en으로 한 번, 조립된 승객 화면은 나머지 언어(ja, zh-Hans, zh-Hant, vi, th)로 다시 잰다.
      const narrowed = passthrough.some((a) => a.startsWith('--langs=') || a.startsWith('--only='));
      if (narrowed) {
        run('check:a11y', 'bun', ['run', 'check:a11y', '--', `http://127.0.0.1:${port}`, ...passthrough], { env });
      } else {
        run('check:a11y', 'bun', ['run', 'check:a11y', '--', `http://127.0.0.1:${port}`], { env: { ...env, A11Y_LANGS: process.env.A11Y_LANGS ?? 'en' } });
        run('check:a11y 승객 화면', 'bun', ['run', 'check:a11y', '--', `http://127.0.0.1:${port}`, '--only=승객 화면'], {
          env: { ...env, A11Y_LANGS: process.env.A11Y_SCREEN_LANGS ?? 'ja,zh-Hans,zh-Hant,vi,th' },
        });
      }
    }
  } finally {
    server.kill();
  }
}
console.log(`\ncheck ok (전체 ${Math.round((Date.now() - started) / 1000)}초)`);
