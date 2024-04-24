const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = tseslint.config([
  ...baseConfig,
  {
    // ignores: ['!**/*'],
    ignores: ['storybook-static'],
    languageOptions: {
      parserOptions: {
        project: [
          'tsconfig.*?.json',
          // '.storybook/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
      },
    },
  },
  ...compat
    .config({
      extends: [
        'plugin:@nx/angular',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
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
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
      },
    })),
  ...compat
    .config({ extends: ['plugin:@nx/angular-template'] })
    .map((config) => ({
      ...config,
      files: ['**/*.html'],
      rules: {},
    })),
]);
