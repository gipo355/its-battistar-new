// compatiblity port from:
// https://robert-isaac.medium.com/migrate-eslint-to-the-new-flat-configuration-c7dc7b51266a
//
/* eslint-disable unicorn/prefer-module */
const ng = require('@angular-eslint/eslint-plugin');
// const ngTeplate = require('@angular-eslint/eslint-plugin-template');
// const ngParser = require('@angular-eslint/template-parser');
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
    files: ['**/*.ts'],
    plugins: {
      // TODO: missing: @nx/angular, process-inline-templates, johnpapa
      '@angular-eslint': ng,
    },
    rules: {
      ...ng.configs.recommended.rules,
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },

  // {
  //   files: ['**/*.html'],
  //   plugins: {
  //     '@angular-eslint/template': ngTeplate,
  //   },
  //   languageOptions: {
  //     // BUG: not using the parser
  //     parser: ngParser,
  //   },
  //   rules: {
  //     ...ngTeplate.configs.recommended.rules,
  //     ...ngTeplate.configs.accessibility.rules,
  //   },
  // },

  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jasmine,
      },
    },
  }

  // FIXME: old compatibility mode
  // do these even work?
  // ...compat
  //   .config({
  //     extends: [
  //       'plugin:@nx/angular',
  //       'plugin:@angular-eslint/recommended',
  //       'plugin:@angular-eslint/template/process-inline-templates',
  //       'plugin:angular/johnpapa',
  //     ],
  //     // why do i need to specify this in the overrides too?
  //     parserOptions: {
  //       // project: ['./tsconfig.*?.json'],
  //       tsconfigRootDir: __dirname,
  //       project: ['tsconfig.*?.json', '.storybook/tsconfig.json'],
  //     },
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

  // FIXME: doesn't lint html files
  // ...compat
  //   .config({
  //     parser: '@angular-eslint/template-parser',
  //     extends: ['plugin:@nx/angular-template'],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.html'],
  //     rules: {},
  //   })),
);
