// check:a11y / check:layout 가 함께 쓰는 Storybook 이동 도우미.
// 이야기마다 iframe.html 을 새로 불러오면 느리고 공유 브라우저에 부담이므로, 전역값(테마)과 폭이 같은 묶음은
// 한 페이지에서 Storybook 채널의 setCurrentStory 로 이야기만 바꾼다. 묶음의 첫 이야기와 이동 실패 뒤 재시도만 전체 로드다.

const FAIL_EVENTS = ['storyErrored', 'storyThrewException', 'playFunctionThrewException', 'storyMissing'];

export const storyUrl = (base, id, theme) =>
  `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`;

/** 전체 로드로 이야기를 연다. 렌더 끝(또는 오류 표시)까지 기다린다. */
export async function loadStory(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('body.sb-show-main, body.sb-show-errordisplay', { timeout: 30_000 });
  if (await page.$('body.sb-show-errordisplay')) throw new Error('이야기 렌더 오류');
}

/** 이미 열린 Storybook 페이지에서 이야기만 바꾼다. play 함수가 끝나 storyRendered 가 올 때까지 기다린다. */
export async function switchStory(page, id) {
  await page.evaluate(
    ({ storyId, failEvents }) =>
      new Promise((resolve, reject) => {
        /* eslint-disable no-undef */
        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if (!channel) return reject(new Error('Storybook 채널 없음'));
        const handlers = [];
        let timer;
        const finish = (error) => {
          clearTimeout(timer);
          for (const [name, fn] of handlers) channel.off(name, fn);
          if (error) reject(new Error(error));
          else resolve();
        };
        const on = (name, fn) => {
          handlers.push([name, fn]);
          channel.on(name, fn);
        };
        on('storyRendered', () => finish());
        for (const name of failEvents) on(name, (e) => finish(`이야기 렌더 오류(${name}): ${String(e?.message ?? e ?? '')}`));
        timer = setTimeout(() => finish('storyRendered 시간 초과'), 30_000);
        channel.emit('setCurrentStory', { storyId, viewMode: 'story' });
        /* eslint-enable no-undef */
      }),
    { storyId: id, failEvents: FAIL_EVENTS },
  );
}

/**
 * 한 작업자가 가진 페이지. 같은 묶음 키(테마·폭)에서 이어지는 이야기는 switchStory, 그 밖에는 loadStory.
 * state 는 { groupKey, id } 를 담은 작업자별 객체다.
 */
export async function openStory(page, state, { base, id, theme, groupKey }) {
  if (state.groupKey === groupKey && state.id !== id) {
    try {
      await switchStory(page, id);
      state.id = id;
      return;
    } catch {
      // 이동이 막히면 아래 전체 로드로 넘어간다.
    }
  }
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // 앞 이야기의 Storybook 이 URL 을 스스로 바꾸는 중이면 goto 가 "다른 이동에 끊겼다"고 실패한다: 빈 페이지를 거쳐 가라앉힌다.
      await page.goto('about:blank').catch(() => page.waitForTimeout(500));
      await loadStory(page, storyUrl(base, id, theme));
      state.groupKey = groupKey;
      state.id = id;
      return;
    } catch (error) {
      lastError = error;
    }
  }
  state.groupKey = null;
  state.id = null;
  throw lastError;
}
