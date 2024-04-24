const globals = require('globals');
const { FlatCompat } = require('@eslint/eslintrc');
const nodePlugin = require('eslint-plugin-n');

const nxEslintPlugin = require('@nx/eslint-plugin');

const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
// const eslintPluginImport = require('eslint-plugin-import');
const eslint = require('@eslint/js');

const tseslint = require('typescript-eslint');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const jsoncParser = require('jsonc-eslint-parser');

const tsParser = require('@typescript-eslint/parser');

// const eslintrc = require('@eslint/eslintrc');

// import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
});

// TODO: fix lint-staged
// TODO: fix husky
// TODO: fix nx lint

// tseslint.config is an utility function provided by typescript-eslint
// to provide type safety and intellisense to the configuration
module.exports = [
  {
    // must be on its own for glob pattern to work
    ignores: ['!**/*'],
  },

  {
    // root level config
    languageOptions: {
      parser: tsParser,
      globals: {
        // ...globals.browser,
        ...globals.node,
        // ...globals.worker,
        ...globals.es2021,
        // ...eslintrc.Legacy.environments.get('es2024'),
        // ...globals.jest,
      },
    },
    plugins: {
      // provide the rules at the root level, activate the recommended config in express only
      // or they won't be available globally
      // this won't activate them
      // you either need to extend or enable rules manually
      '@nx': nxEslintPlugin,

      'simple-import-sort': eslintPluginSimpleImportSort,

      // BUG: esling-plugin-import doesn't support flat config
      // import: eslintPluginImport,

      unicorn: eslintPluginUnicorn,

      n: nodePlugin,
    },
  },

  // global configs, any file type
  eslint.configs.recommended,

  // global rules, any file type
  {
    rules: {
      'no-magic-numbers': 'error',
      complexity: ['error', 20],
      'consistent-return': 'warn',
      'no-useless-return': 'warn',
      'prefer-const': 'warn',
      eqeqeq: 'error',
      'no-console': 'warn',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'sort-imports': 'off',

      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/prefer-top-level-await': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-module': 'warn',
    },
  },

  // filetype specific rules and configs
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      // FIXME: could not find plugin nx
      // '@nx/dependency-checks': 'error', // TODO:
    },
  },

  // all files
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

  // NOTE: this is how you map a config to a filetype
  // alternatively you can use the extend utility provided by typescript-eslint

  // typescript files
  ...[
    tseslint.configs.eslintRecommended, // disable eslint rules already covered by typescript-eslint
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ].map((conf) => ({
    ...conf,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
    },
  })),

  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   // extends is an utiliy function provided by typescript-eslint
  //   // extends: [
  //   //   tseslint.configs.eslintRecommended, // disable eslint rules already covered by typescript-eslint
  //   // ...tseslint.configs.strictTypeChecked,
  //   // ...tseslint.configs.stylisticTypeChecked,
  //   // ],
  //   rules: {
  //     '@typescript-eslint/explicit-module-boundary-types': ['error'],
  //   },
  // },

  // test files
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {},
  },

  // FIXME: compatility mode after nx migration

  // all files
  ...compat
    .config({
      extends: [
        'plugin:@nx/javascript',
        'plugin:import/recommended', // TODO:
      ],
    })
    .map((config) => ({
      ...config,
      // files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      rules: {
        'import/no-unresolved': 'off',
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
    })),

  // typescript files
  ...compat
    .config({
      //     plugins: [
      //       // '@typescript-eslint'
      //     ],
      extends: [
        'plugin:@nx/typescript', //TODO:
      ],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {},
    })),

  // javascript files
  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  })),

  // spec files
  // ...compat.config({ env: { jest: true } }).map((config) => ({
  //   ...config,
  //   files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
  //   rules: {},
  // })),
];
