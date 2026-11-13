// 번들 예산 검사: 폰 웹을 vite 로 빌드하고, 처음 화면(/p/:pairCode)이 내려받는 크기와 지도 분리를 확인한다. 예산을 넘으면 실패한다.
// 사용: bun run check:bundle            (빌드 포함)
//       bun run check:bundle -- --no-build   (이미 있는 apps/passenger-web/dist 만 잰다)
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'apps/passenger-web');
const dist = join(app, 'dist');
const KB = 1024;

/** 바이트 단위 예산. 처음 화면이 내려받는 것만 센다(지도·드문 글꼴은 따로). */
const BUDGET = {
  initialJsGzip: 170 * KB, // index.html 이 곧바로 싣는 JS(모듈 + modulepreload), gzip
  initialCssGzip: 20 * KB, // index.html 이 싣는 CSS, gzip
  latinFont: 66 * KB, // 라틴 글꼴 조각(woff2 = 이미 압축). 베트남어 범위(U+0100-024F, U+1EA0-1EF9)를 더해 40.7 KB → 64.3 KB, 여유 약 2 KB
  hangulFont: 320 * KB, // 한글 글꼴 조각(Hangul 글자가 나올 때만 내려받는다)

};

if (!process.argv.includes('--no-build')) {
  // 운영 빌드는 https 중계 주소를 요구한다(relayUrlGuard). 크기만 재므로 자리표시 주소를 준다.
  const env = { ...process.env, VITE_RELAY_URL: process.env.VITE_RELAY_URL ?? 'https://relay.example.invalid' };
  const r = spawnSync('nice', ['-n', '19', 'bunx', 'vite', 'build'], { cwd: app, env, stdio: ['ignore', 'ignore', 'inherit'] });
  if (r.status !== 0) {
    console.error('check:bundle 실패: vite build');
    process.exit(r.status ?? 1);
  }
}
if (!existsSync(join(dist, 'index.html'))) {
  console.error('check:bundle: apps/passenger-web/dist 가 없어요. --no-build 없이 실행하세요.');
  process.exit(1);
}

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const refs = (re) => [...html.matchAll(re)].map((m) => m[1].replace(/^\//, ''));
const initialJs = [...new Set([...refs(/<script[^>]*\ssrc="([^"]+\.js)"/g), ...refs(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+\.js)"/g)])];
const initialCss = refs(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"/g);
const gz = (rel) => gzipSync(readFileSync(join(dist, rel)), { level: 9 }).length;
const size = (rel) => readFileSync(join(dist, rel)).length;
const sum = (files, f) => files.reduce((n, rel) => n + f(rel), 0);

const assets = readdirSync(join(dist, 'assets'));
const find = (re) => assets.filter((f) => re.test(f)).map((f) => `assets/${f}`);
const latin = find(/^pretendard-latin-.*\.woff2$/);
const hangul = find(/^pretendard-hangul-.*\.woff2$/);

const fullFont = find(/^PretendardVariable-.*\.woff2$/);

const failures = [];
const row = (name, value, budget) => {
  const over = budget !== undefined && value > budget;
  console.log(`${over ? 'FAIL' : ' ok '}  ${name.padEnd(34)} ${(value / KB).toFixed(1).padStart(8)} KB${budget === undefined ? '' : `  (예산 ${(budget / KB).toFixed(0)} KB)`}`);
  if (over) failures.push(name);
};

row('처음 JS (gzip)', sum(initialJs, gz), BUDGET.initialJsGzip);
row('처음 CSS (gzip)', sum(initialCss, gz), BUDGET.initialCssGzip);
row('라틴 글꼴 조각', sum(latin, size), BUDGET.latinFont);
row('한글 글꼴 조각', sum(hangul, size), BUDGET.hangulFont);


const check = (ok, msg) => {
  console.log(`${ok ? ' ok ' : 'FAIL'}  ${msg}`);
  if (!ok) failures.push(msg);
};
check(latin.length === 1 && hangul.length === 1, '글꼴 조각이 라틴 1개 + 한글 1개');
check(fullFont.length === 0, '2 MB 전체 Pretendard 가 번들에 없음');
const allText = readdirSync(join(dist, 'assets')).filter((f) => /\.(js|css)$/.test(f)).map((f) => readFileSync(join(dist, 'assets', f), 'utf8')).join('\n');
check(!/leaflet-container|_leaflet_id/.test(allText), '지도 라이브러리(Leaflet)가 번들 어디에도 없음 (승객 웹에 지도 없음, Q14)');

if (failures.length > 0) {
  console.error(`\ncheck:bundle 실패 (${failures.length}): ${failures.join(' / ')}`);
  process.exit(1);
}
console.log('\ncheck:bundle ok');
