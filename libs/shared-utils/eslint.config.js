/* eslint-disable unicorn/prefer-module */
const globals = require('globals');
const baseConfig = require('../../eslint.config.js');
const tseslint = require('typescript-eslint');

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
        ...globals.node,
        ...globals.es2021,
        ...globals.browser,
      },
    },
  },
  // {
  //   files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  //   rules: {},
  //   languageSettings: { parserOptions: { project: ['tsconfig.*?.json'] } },
  // },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  }
);
