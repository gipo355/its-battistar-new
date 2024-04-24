const { FlatCompat } = require('@eslint/eslintrc');
const pluginSecurity = require('eslint-plugin-security');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const baseConfig = require('../../eslint.config.js');
const nodePlugin = require('eslint-plugin-n');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,

  // https://www.reddit.com/r/learnjavascript/comments/xsiowg/i_need_some_help_configuring_my_eslint_correctly/
  {
    // default is ignore all
    ignores: ['!**/*'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
      // TODO: increase specificity between projects of globals available
      globals: { ...globals.node, ...globals.es2021 },
    },
  },

  // nodePlugin.configs['flat/recommended-script'],
  // nodePlugin.configs['flat/recommended-module'],
  nodePlugin.configs['flat/recommended'],

  pluginSecurity.configs.recommended,

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
];
