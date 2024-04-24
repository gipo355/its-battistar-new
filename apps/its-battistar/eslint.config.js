const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

// const { FlatCompat } = require('@eslint/eslintrc');
// const js = require('@eslint/js');

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

module.exports = tseslint.config(
  ...baseConfig,

  {
    ignores: ['!**/*', 'storybook-static', 'node_modules', 'dist'],
  },

  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.*?.json', '.storybook/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },

  {
    rules: {
      // BUG: for some reason, those rules are not working here while it works in express
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  }

  // FIXME: old compatibility mode
  // ...compat
  //   .config({
  //     extends: [
  //       'plugin:@nx/angular',
  //       'plugin:@angular-eslint/template/process-inline-templates',
  //     ],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.ts'],
  //     rules: {
  //       '@angular-eslint/directive-selector': [
  //         'error',
  //         {
  //           type: 'attribute',
  //           prefix: 'app',
  //           style: 'camelCase',
  //         },
  //       ],
  //       '@angular-eslint/component-selector': [
  //         'error',
  //         {
  //           type: 'element',
  //           prefix: 'app',
  //           style: 'kebab-case',
  //         },
  //       ],
  //     },
  //   })),
  // ...compat
  //   .config({ extends: ['plugin:@nx/angular-template'] })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.html'],
  //     rules: {},
  //   }))
);
