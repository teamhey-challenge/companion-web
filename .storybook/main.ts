import { existsSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

// scripts/collect-gallery.ts 가 만든 차 앱 스냅샷·시안(커밋하지 않음). 수집 전이면 이 부분은 빈다.
const gallery = existsSync(new URL('../gallery/generated', import.meta.url).pathname);

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../packages/ui-web/src/**/*.stories.tsx',
    '../apps/passenger-web/src/**/*.stories.tsx',
    ...(gallery ? ['../gallery/generated/*.stories.tsx'] : []),
  ],
  staticDirs: gallery ? ['../gallery/public'] : [],
  addons: [
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    '@storybook/addon-a11y',
  ],
  core: { disableTelemetry: true },
  typescript: { reactDocgen: false },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    // .storybook/ 와 storybook/ 에는 tsconfig가 없어 esbuild가 classic JSX로 돌아간다. 자동 런타임을 고정한다.
    esbuild: { ...viteConfig.esbuild, jsx: 'automatic' },
  }),
};

export default config;
