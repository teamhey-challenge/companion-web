/**
 * 운영 빌드는 중계 서버 주소가 https여야 한다. http면 토큰이 든 요청과 소켓이 평문으로 나간다.
 * localhost(시험·미리보기)만 예외다. vite.config.ts가 빌드 시작 때 부른다.
 */
export function assertSecureRelayUrl(url: string | undefined, mode: string): void {
  if (mode !== 'production') return;
  if (!url) throw new Error('VITE_RELAY_URL 이 없어요. 운영 빌드는 https 중계 서버 주소가 필요합니다.');
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('VITE_RELAY_URL 이 올바른 주소가 아니에요.');
  }
  const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '[::1]';
  if (parsed.protocol !== 'https:' && !local) {
    throw new Error(`VITE_RELAY_URL 은 https 여야 해요(localhost 제외): ${parsed.protocol}//${parsed.host}`);
  }
}
