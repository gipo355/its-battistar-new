/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-magic-numbers */
const globals = require('globals');
// const { FlatCompat } = require('@eslint/eslintrc');
const nodePlugin = require('eslint-plugin-n');
const nxEslintPlugin = require('@nx/eslint-plugin');
const tsSortKeys = require('eslint-plugin-typescript-sort-keys');
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('typescript-eslint');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const jsoncParser = require('jsonc-eslint-parser');
const tsParser = require('@typescript-eslint/parser');
const eslint = require('@eslint/js');

// const eslintrc = require('@eslint/eslintrc');
const eslintPluginImport = require('eslint-plugin-import');

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: eslint.configs.recommended,
// });

// tseslint.config is an utility function provided by typescript-eslint
// to provide type safety and intellisense to the configuration
module.exports = tseslint.config(
  {
    // must be on its own for glob pattern to work
    ignores: ['!**/*', 'node_modules', 'dist', 'tmp', '.angular'],
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

      import: eslintPluginImport,

      'typescript-sort-keys': tsSortKeys,

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
      'prefer-const': 'warn',
      eqeqeq: 'error',
      'no-console': 'warn',

      // using tsconfig noImplicitReturns
      'consistent-return': 'off', // force explicit return, prevents bugs
      'no-useless-return': 'off',

      // ! ASYNCH RULES, FROM https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/
      // check also parallelism in loops at https://maximorlov.com/parallel-tasks-with-pure-javascript/
      'no-async-promise-executor': 'warn', // This rule disallows passing an async function to the new Promise constructor.
      'no-await-in-loop': 'error', // This rule disallows using await inside loops.
      'no-promise-executor-return': 'warn', // This rule disallows returning a value inside a Promise constructor.
      'require-atomic-updates': 'warn', // This rule disallows assignments in combination with await, which can lead to race conditions.
      'max-nested-callbacks': ['warn', 3], // This rule enforces a maximum nesting depth for callbacks. In other words, this rule prevents callback hell
      'no-return-await': 'error', // This rule disallows unnecessary return await.
      'prefer-promise-reject-errors': 'warn', // This rule enforces using an Error object when rejecting a Promise.

      'no-implicit-coercion': 'error', // This rule disallows shorthand type conversions for boolean, numbers and strings.

      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      // side effects and mutations (immutable and pure plugins)
      'no-var': 2,
      'no-void': [1, { allowAsStatement: true }],
      'no-undef': 'warn',
      'no-unused-vars': 2, // already have typescript rule - fixed by typescript-eslint/eslint-recommended
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'sort-imports': 'off',

      // https://github.com/import-js/eslint-plugin-import/issues/2948
      // ...eslintPluginImport.configs.errors.rules,
      // 'import/no-unresolved': 'off',
      // 'import/no-extraneous-dependencies': 'off',
      // 'import/first': 'error',
      // 'import/newline-after-import': 'error',
      // 'import/no-duplicates': 'error',
      // 'import/order': 'off',
      // 'import/export': 'warn',
      // 'import/prefer-default-export': 'off',
      // 'import/no-default-export': 'warn',
      // 'import/namespace': 'off',

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
  // ...[
  //   tseslint.configs.eslintRecommended, // disable eslint rules already covered by typescript-eslint
  //   ...tseslint.configs.strictTypeChecked,
  //   ...tseslint.configs.stylisticTypeChecked,
  // ].map((conf) => ({
  //   ...conf,
  //   files: ['**/*.ts', '**/*.tsx'],
  //   rules: {
  //     '@typescript-eslint/explicit-module-boundary-types': ['error'],
  //   },
  // })),

  // alternative way as the one above
  {
    // TODO: missing @nx/typescript
    files: ['**/*.ts', '**/*.tsx'],
    // extends is an utiliy function provided by typescript-eslint
    extends: [
      tseslint.configs.eslintRecommended, // disable eslint rules already covered by typescript-eslint
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      ...tsSortKeys.configs.recommended.rules,

      '@typescript-eslint/explicit-module-boundary-types': ['error'],
      // '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      // '@typescript-eslint/no-shadow': 'error',
      // '@typescript-eslint/naming-convention': 'error',
      'max-params': ['error', 4],
      'no-nested-ternary': 'error',
    },
  },

  // test files
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {},
  }

  // FIXME: compatility mode after nx migration

  // do they override previous rules?
  // do these even work?? they don't

  // COMPATIBILITY MODE for unsupported plugins
  // ...compat.extends('plugin:sonarjs/recommended')
  // ...compat.config({
  //   // plugins: [
  //   //   'import',
  //   //   // 'sonarjs',
  //   //   //   '@nx/javascript'
  //   // ],
  //   extends: [
  //     'plugin:import/recommended',
  //     'plugin:sonarjs/recommended',
  //     'plugin:@nx/javascript',
  //     'plugin:@nx/typescript', //TODO: how to specify files for compatibility mode
  //   ],
  //   rules: {
  //     'import/no-unresolved': 'off',
  //     'import/no-extraneous-dependencies': 'off',
  //     'import/first': 'error',
  //     'import/newline-after-import': 'error',
  //     'import/no-duplicates': 'error',
  //     'import/order': 'off',
  //     'import/export': 'warn',
  //     'import/prefer-default-export': 'off',
  //     'import/no-default-export': 'warn',
  //     'import/namespace': 'off',
  //   },
  // })

  // ...compat.extends('plugin:@nx/typescript'),
  // .map((config) => ({
  //   ...config,
  //   files: ['**/*.ts', '**/*.tsx'],
  //   rules: {},
  // })),

  // BUG: THE MAP DOESN'T WORK with compat mode for assigning files

  // all files
  // ...compat
  //   .config({
  //     plugins: ['sonarjs'],
  //     extends: [
  //       'plugin:@nx/javascript',
  //       'plugin:import/recommended', // TODO:
  //       'plugin:sonarjs/recommended',
  //     ],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     // files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  //     rules: {
  //       'import/no-unresolved': 'off',
  //       'import/no-extraneous-dependencies': 'off',
  //       // 'import/first': 'error',
  //       // 'import/newline-after-import': 'error', // BUG: new config
  //       'import/no-duplicates': 'error',
  //       'import/order': 'off',
  //       'import/export': 'warn',
  //       'import/prefer-default-export': 'off',
  //       'import/no-default-export': 'warn',
  //       'import/namespace': 'off',
  //     },
  //   })),

  // typescript files
  // ...compat
  //   .config({
  //     plugins: [
  //       // '@typescript-eslint'
  //       'typescript-sort-keys',
  //     ],
  //     extends: [
  //       'plugin:@nx/typescript', //TODO:
  //       'plugin:typescript-sort-keys/recommended',
  //     ],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.ts', '**/*.tsx'],
  //     rules: {},
  //   }))

  // javascript files only
  // ...compat
  //   .config({
  //     extends: [ ],
  //   })
  //   .map((config) => ({
  //     ...config,
  //     files: ['**/*.js', '**/*.jsx'],
  //     rules: {},
  //   }))

  // spec files
  // ...compat.config().map((config) => ({
  //   ...config,
  //   files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
  //   rules: {},
  // })),
);
