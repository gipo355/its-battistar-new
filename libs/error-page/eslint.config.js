/* eslint-disable unicorn/prefer-module */
const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = tseslint.config(
  ...baseConfig,

  {
    ignores: ['!**/*', 'node_modules', 'dist'],
  },

  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },

  {
    rules: {},
  },

  // FIXME: old compatibility mode
  // do these even work?
  ...compat
    .config({
      extends: [
        'plugin:@nx/angular',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:angular/johnpapa',
      ],
      // why do i need to specify this in the overrides too?
      parserOptions: {
        // project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
        project: ['tsconfig.*?.json'],
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'lib',
            style: 'kebab-case',
          },
        ],
      },
    })),

  // FIXME: doesn't lint html files
  ...compat
    .config({
      parser: '@angular-eslint/template-parser',
      extends: ['plugin:@nx/angular-template'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.html'],
      rules: {},
    }))
);
