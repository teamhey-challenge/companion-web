import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

const PASSENGER = 'apps/passenger-web/src/**/*.{ts,tsx}';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'storybook-static/**',
      '.review/**',
      'shared/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: { react: { version: '19' } },
  },

  // 폰 웹: 화면은 DS 부품만으로 조립한다 (docs/architecture.md §4 규칙 6, 8).
  // 구조로 막을 수 없는 자리라 린트로 막는다: 소문자 태그·style·className은 JSX 문법이라 타입으로 거부할 수 없다.
  {
    files: [PASSENGER],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXOpeningElement[name.type="JSXIdentifier"][name.name=/^[a-z]/]',
          message: '폰 웹 코드에서는 HTML 태그를 쓰지 않아요. @hey/ui-web 부품을 쓰세요.',
        },
        {
          selector: 'JSXAttribute[name.name="style"]',
          message: 'style 속성은 금지예요. 부품의 이름 있는 prop으로 고르세요.',
        },
        {
          selector: 'JSXAttribute[name.name="className"]',
          message: 'className 속성은 금지예요. 부품의 이름 있는 prop으로 고르세요.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/*.css', '*.css'], message: '폰 웹 코드에는 CSS 가져오기가 없어요. 스타일은 @hey/ui-web 안에만 있어요.' },
            { group: ['react-dom', 'react-dom/*'], message: 'react-dom은 src/main.tsx에서만 가져와요.' },
          ],
        },
      ],
    },
  },
  // main.tsx와 화면 렌더 테스트만 react-dom을 가져온다. CSS 금지는 그대로 적용한다.
  {
    files: ['apps/passenger-web/src/main.tsx', 'apps/passenger-web/src/**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['**/*.css', '*.css'], message: '폰 웹 코드에는 CSS 가져오기가 없어요.' }] },
      ],
    },
  },

  // 화면 폴더: JSX 안 글자 리터럴 금지. 모든 문구는 t(key) 카탈로그에서 온다.
  {
    files: ['apps/passenger-web/src/screens/**/*.{ts,tsx}'],
    plugins: { react },
    rules: {
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true, allowedStrings: [] }],
      // 이 블록의 no-restricted-syntax는 위 블록의 규칙을 덮어쓰므로 같은 규칙을 다시 적는다.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name=/^(label|title|message|placeholder|text|caption|description|subText|fallbackText|connectionDetail|reasonText|alt|aria-label|aria-description)$/] > Literal',
          message: 'UI 문구는 t()로',
        },
        {
          selector:
            'JSXAttribute[name.name=/^(label|title|message|placeholder|text|caption|description|subText|fallbackText|connectionDetail|reasonText|alt|aria-label|aria-description)$/] > JSXExpressionContainer > :matches(Literal, TemplateLiteral)',
          message: 'UI 문구는 t()로',
        },
        {
          selector: 'JSXOpeningElement[name.type="JSXIdentifier"][name.name=/^[a-z]/]',
          message: '폰 웹 코드에서는 HTML 태그를 쓰지 않아요. @hey/ui-web 부품을 쓰세요.',
        },
        {
          selector: 'JSXAttribute[name.name="style"]',
          message: 'style 속성은 금지예요. 부품의 이름 있는 prop으로 고르세요.',
        },
        {
          selector: 'JSXAttribute[name.name="className"]',
          message: 'className 속성은 금지예요. 부품의 이름 있는 prop으로 고르세요.',
        },
      ],
    },
  },

  // Storybook 검수 도구와 DS 이야기는 위 규칙의 대상이 아니다(폰 웹 src 밖).
  // DS 부품 Props에서 className·style을 빼는 것은 린트가 아니라 TypeScript 인터페이스로 막는다(packages/ui-web/README.md).
  {
    files: ['**/*.stories.tsx', 'storybook/**', '.storybook/**'],
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
);
