// const { FlatCompat } = require('@eslint/eslintrc');
const pluginSecurity = require('eslint-plugin-security');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const baseConfig = require('../../eslint.config.js');
const nodePlugin = require('eslint-plugin-n');
// const js = require('@eslint/js');

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

module.exports = tseslint.config([
  ...baseConfig,
  {
    // ignores: ['!**/*'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
      // TODO: increase specificity between projects of globals available
      globals: { ...globals.node, ...globals.es2021 },
    },
  },

  nodePlugin.configs['flat/recommended-script'],

  pluginSecurity.configs.recommended,
  // ...compat
  // .extends(
  // 'plugin:n/recommended',
  // 'plugin:security/recommended-legacy'
  // ),

  {
    rules: {
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-unpublished-require': 'off',
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
]);
