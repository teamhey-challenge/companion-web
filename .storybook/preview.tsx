import { useEffect, type ReactNode } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../shared/packages/tokens/dist/tokens.css';

const LANGS = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'vi', 'th', 'ko'] as const;

function Environment({ theme, lang, children }: { theme: string; lang: string; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('lang', lang);
  }, [theme, lang]);
  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '색 세트',
      toolbar: {
        title: '테마',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: '라이트' },
          { value: 'dark', title: '다크' },
        ],
        dynamicTitle: true,
      },
    },
    lang: {
      description: '문서 언어',
      toolbar: {
        title: '언어',
        icon: 'globe',
        items: LANGS.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', lang: 'ko', viewport: { value: 'phone', isRotated: false } },
  decorators: [
    (Story, context) => (
      <Environment theme={String(context.globals['theme'] ?? 'light')} lang={String(context.globals['lang'] ?? 'ko')}>
        <Story />
      </Environment>
    ),
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true },
    viewport: {
      options: {
        phone: { name: '휴대폰 390×844', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        phoneSmall: { name: '휴대폰 360×740', styles: { width: '360px', height: '740px' }, type: 'mobile' },
        desktop: { name: '데스크톱 1280×800', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
    options: {
      storySort: {
        order: [
          '소개',
          ['읽는 법', '검수판'],
          '토큰',
          ['색', '간격', '모서리', '글자', '누름 크기'],
          '웹 부품',
          ['기반', '글자·브랜드', '행동', '입력', '표시', 'HEY', '겹침'],
          '승객 화면',
          '차량 부품',
          '차량 화면',
        ],
      },
    },
    a11y: { test: 'error' },
  },
};

export default preview;
