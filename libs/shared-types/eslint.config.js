const globals = require('globals');
const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: { project: ['tsconfig.*?.json'] },
      globals: { ...globals.node, ...globals.es2024 },
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
];
