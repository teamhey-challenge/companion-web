// 모바일 느린 회선 타이밍: 빌드된 승객 웹(/c/:carCode)을 390px 폭, CPU 4배 느리게, 느린 4G 회선으로 열어
// 탐색 타이밍 + FCP + LCP(PerformanceObserver)와 받은 바이트를 잰다. 중계 서버는 쓰지 않는다(요청을 가로채 고정 응답).
// 사용: DS_BROWSER_WS=$(ds-browser) node scripts/perf-timing.mjs [--dist apps/passenger-web/dist] [--runs 3] [--lang ko-KR] [--shot out.png]
//   ds-browser 연결은 최대 2개를 나눠 쓰므로 측정이 끝나면 곧바로 닫는다.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const dist = resolve(arg('dist', 'apps/passenger-web/dist'));
const runs = Number(arg('runs', '3'));
const locale = arg('lang', 'ko-KR');
const shot = arg('shot', undefined);
const ws = process.env.DS_BROWSER_WS;
if (!ws) {
  console.error('DS_BROWSER_WS=$(ds-browser) 로 ds-browser ws 주소를 넘겨 주세요.');
  process.exit(2);
}
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`${dist}/index.html 이 없어요. 먼저 빌드하세요.`);
  process.exit(2);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const path = normalize(join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  const file = path.startsWith(dist + sep) && existsSync(path) && statSync(path).isFile() ? path : join(dist, 'index.html');
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

// 느린 4G(Lighthouse 모바일 기본에 가깝다): 1.6 Mbps 내려받기, 150 ms 왕복.
const NETWORK = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };

const OBSERVE = () => {
  window.__lcp = 0;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
};

const browser = await chromium.connect(ws, { timeout: 120_000 });
const results = [];
try {
  for (let i = 0; i < runs; i++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale, isMobile: true, hasTouch: true });
    try {
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', NETWORK);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.addInitScript(OBSERVE);
      await page.route('**/v1/c/**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ plateSuffix: '1234', online: true, busy: false }) }),
      );
      await page.route('**/*', (route) => route.fallback());
      let bytes = 0;
      const files = [];
      cdp.on('Network.loadingFinished', (e) => {
        bytes += e.encodedDataLength;
      });
      cdp.on('Network.responseReceived', (e) => files.push(e.response.url.replace(origin, '')));
      await page.goto(`${origin}/c/AB12`, { waitUntil: 'load', timeout: 120_000 });
      await page.waitForSelector('#root > *', { timeout: 60_000 });
      await page.waitForTimeout(1500);
      const m = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return {
          ttfb: nav.responseStart,
          dcl: nav.domContentLoadedEventEnd,
          load: nav.loadEventEnd,
          fcp: fcp ? fcp.startTime : 0,
          lcp: window.__lcp,
        };
      });
      if (shot && i === runs - 1) await page.screenshot({ path: shot });
      results.push({ ...m, kb: bytes / 1024, requests: files.length, files });
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

const median = (key) => {
  const v = results.map((r) => r[key]).sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)];
};
const fmt = (n, d = 0) => n.toFixed(d);
console.log(`dist=${dist} runs=${runs} locale=${locale} viewport=390 cpu=4x net=1.6Mbps/150ms (median)`);
console.log(`TTFB ${fmt(median('ttfb'))} ms | DCL ${fmt(median('dcl'))} ms | load ${fmt(median('load'))} ms | FCP ${fmt(median('fcp'))} ms | LCP ${fmt(median('lcp'))} ms | transferred ${fmt(median('kb'), 1)} KB in ${median('requests')} requests`);
console.log(`files: ${results[0].files.join(', ')}`);
