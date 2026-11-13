// 작은 정적 파일 서버. 사용: bun scripts/serve-static.ts [폴더=storybook-static] [포트=6106] [호스트=0.0.0.0]
import { resolve, join, normalize, sep } from 'node:path';

const dir = resolve(process.argv[2] ?? 'storybook-static');
const port = Number(process.argv[3] ?? 6106);
const hostname = process.argv[4] ?? '0.0.0.0';

Bun.serve({
  port,
  hostname,
  async fetch(req) {
    let pathname = decodeURIComponent(new URL(req.url).pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const path = normalize(join(dir, pathname));
    if (path !== dir && !path.startsWith(dir + sep)) return new Response('forbidden', { status: 403 });
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response('not found', { status: 404 });
    return new Response(file, { headers: { 'cache-control': 'no-cache' } });
  },
});
console.log(`serving ${dir} on http://${hostname}:${port}`);
