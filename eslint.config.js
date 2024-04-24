const globals = require('globals');
const { FlatCompat } = require('@eslint/eslintrc');
const nodePlugin = require('eslint-plugin-n');
const nxEslintPlugin = require('@nx/eslint-plugin');
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const eslintPluginImport = require('eslint-plugin-import');
const eslint = require('@eslint/js');
// import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';
const tseslint = require('typescript-eslint');
const jsoncParser = require('jsonc-eslint-parser');

const tsParser = require('@typescript-eslint/parser');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
});

module.exports = tseslint.config(
  eslint.configs.recommended,

  {
    // root level config
    // root: true, // doesn't exist anymore
    // ignores: ['**/*'],
    languageOptions: {
      parser: tsParser,
      // globals: {
      //   ...globals.browser,
      //   ...globals.node,
      //   ...globals.worker,
      //   ...globals.es2021,
      //   ...globals.jest,
      // },
    },
    plugins: {
      // provide the rules at the root level, activate the recommended config in express only
      // or they won't be available globally
      // this won't activate them
      // you either need to extend or enable rules manually
      '@nx': nxEslintPlugin,

      'simple-import-sort': eslintPluginSimpleImportSort,

      import: eslintPluginImport,

      n: nodePlugin,
    },
    rules: {},
  },

  // filetype specific configs
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      // FIXME: could not find plugin nx
      // '@nx/dependency-checks': 'error',
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.eslintRecommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ['error'],

      'no-magic-numbers': 'error',
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unicorn/no-abusive-eslint-disable': 'off',
      'import/no-unresolved': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/prefer-top-level-await': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-module': 'warn',
      complexity: ['error', 20],
      'consistent-return': 'warn',
      'no-useless-return': 'warn',
      'prefer-const': 'warn',
      eqeqeq: 'error',
      'no-console': 'warn',
      'import/no-extraneous-dependencies': 'off',
      'import/first': 'error',
      // 'import/newline-after-import': 'error', // BUG: new config
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'import/export': 'warn',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'warn',
      'import/namespace': 'off',
    },
  }

  // FIXME: compatility mode after nx migration
  // ...compat
  //   .config({
  //     plugins: [
  //       // 'simple-import-sort',
  //       // '@typescript-eslint'
  //     ],
  //     extends: [
  //       'plugin:@nx/typescript',
  //       // 'eslint:recommended',
  //       'plugin:@typescript-eslint/eslint-recommended',
  //       'plugin:@typescript-eslint/strict-type-checked',
  //       'plugin:@typescript-eslint/stylistic-type-checked',
  //       'plugin:unicorn/recommended',
  //       'plugin:import/recommended',
  //     ],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.ts', '**/*.tsx'],
  //     rules: {
  //       'no-magic-numbers': 'error',
  //       'sort-imports': 'off',
  //       'simple-import-sort/imports': 'error',
  //       'simple-import-sort/exports': 'error',
  //       'unicorn/no-abusive-eslint-disable': 'off',
  //       'import/no-unresolved': 'off',
  //       'unicorn/no-null': 'off',
  //       'unicorn/no-array-for-each': 'warn',
  //       'unicorn/consistent-function-scoping': 'warn',
  //       'unicorn/prefer-top-level-await': 'warn',
  //       'unicorn/prevent-abbreviations': 'off',
  //       'unicorn/prefer-module': 'warn',
  //       complexity: ['error', 20],
  //       'consistent-return': 'warn',
  //       'no-useless-return': 'warn',
  //       'prefer-const': 'warn',
  //       eqeqeq: 'error',
  //       'no-console': 'warn',
  //       'import/no-extraneous-dependencies': 'off',
  //       'import/first': 'error',
  //       // 'import/newline-after-import': 'error', // BUG: new config
  //       'import/no-duplicates': 'error',
  //       'import/order': 'off',
  //       'import/export': 'warn',
  //       'import/prefer-default-export': 'off',
  //       'import/no-default-export': 'warn',
  //       'import/namespace': 'off',
  //     },
  //   })),
  // ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
  //   ...config,
  //   files: ['**/*.js', '**/*.jsx'],
  //   rules: {},
  // })),
  // ...compat.config({ env: { jest: true } }).map((config) => ({
  //   ...config,
  //   files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
  //   rules: {},
  // }))
);
