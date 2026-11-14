// 검사 스크립트가 쓰는 브라우저를 얻는다.
//   DS_BROWSER_WS(또는 인자로 받은 ws 주소)가 있으면 그 원격 브라우저에 붙고,
//   없으면 이 컴퓨터의 Chromium을 직접 띄운다(`bunx playwright-core install chromium` 으로 한 번 받아 두거나,
//   CHROMIUM_PATH 에 이미 설치된 Chrome/Chromium 실행 파일 경로를 준다).
import { chromium } from 'playwright-core';

export async function openBrowser(ws = process.env.DS_BROWSER_WS) {
  if (ws) return chromium.connect(ws, { timeout: 120_000 });
  try {
    return await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  } catch (e) {
    console.error(
      `로컬 Chromium을 띄우지 못했어요: ${e.message.split('\n')[0]}\n` +
        '`bunx playwright-core install chromium` 으로 받거나 CHROMIUM_PATH 를 지정하세요(또는 DS_BROWSER_WS 로 원격 브라우저 주소를 주세요).',
    );
    process.exit(2);
  }
}
