const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,
  ...compat.extends(
    'plugin:n/recommended',
    'plugin:security/recommended-legacy'
  ),
  {
    languageOptions: {
      parserOptions: { project: ['tsconfig.*?.json'] },
      globals: { ...globals.node, ...globals.es2024 },
    },
  },
  {
    rules: {
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
];