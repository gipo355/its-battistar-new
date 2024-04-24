const globals = require('globals');
const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config([
  ...baseConfig,
  {
    // ignores: ['!**/*'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
      globals: { ...globals.node, ...globals.es2021 },
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
  },
]);
