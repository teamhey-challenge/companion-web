import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { assertSecureRelayUrl } from './src/transport/relayUrlGuard';

/**
 * 토큰 패키지의 tokens.css 는 2 MB 짜리 Pretendard 전체 글꼴을 가리키는 @font-face 를 담고 있다.
 * 앱은 src/fonts/fonts.css 의 부분 글꼴(라틴 + 자주 쓰는 한글)만 쓰므로 이 규칙을 빼서 전체 글꼴이 번들에 들어가지 않게 한다.
 */
function dropFullPretendard(): Plugin {
  return {
    name: 'hey-drop-full-pretendard',
    enforce: 'pre',
    transform(code, id) {
      if (!/tokens\.css(\?|$)/.test(id)) return null;
      const out = code.replace(/@font-face\s*\{[^}]*PretendardVariable\.woff2[^}]*\}/, '');
      if (out === code) this.error('tokens.css 에서 전체 Pretendard @font-face 를 찾지 못했어요. 토큰 패키지가 바뀌었는지 확인하세요.');
      return { code: out, map: null };
    },
  };
}


export default defineConfig(({ mode }) => {
  assertSecureRelayUrl(process.env['VITE_RELAY_URL'] ?? loadEnv(mode, process.cwd(), 'VITE_')['VITE_RELAY_URL'], mode);
  return {
    plugins: [dropFullPretendard(), react()],
    server: { port: 5187, strictPort: true, host: true },
    build: {
      // 글꼴 조각과 지도 묶음은 예산 검사(check:bundle)가 따로 본다.
      chunkSizeWarningLimit: 600,
    },
  };
});
