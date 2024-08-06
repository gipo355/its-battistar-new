// compatiblity port from:
// https://robert-isaac.medium.com/migrate-eslint-to-the-new-flat-configuration-c7dc7b51266a
//
/* eslint-disable unicorn/prefer-module */
const ng = require('@angular-eslint/eslint-plugin');
// const ngTeplate = require('@angular-eslint/eslint-plugin-template');
// const ngParser = require('@angular-eslint/template-parser');
const baseConfig = require('../../eslint.config.js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

// const { FlatCompat } = require('@eslint/eslintrc');
// const js = require('@eslint/js');

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

module.exports = tseslint.config(
    ...baseConfig,

    {
        ignores: ['!**/*', 'storybook-static', 'node_modules', 'dist'],
    },

    {
        languageOptions: {
            parserOptions: {
                project: ['tsconfig.*?.json'],
                tsconfigRootDir: __dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.serviceworker,
            },
        },
    },

    {
        files: ['**/*.ts'],
        plugins: {
            // TODO: missing: @nx/angular, process-inline-templates, johnpapa
            '@angular-eslint': ng,
        },
        rules: {
            ...ng.configs.recommended.rules,
            '@typescript-eslint/no-extraneous-class': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'app', style: 'kebab-case' },
            ],
        },
    },
    // },

    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: {
                ...globals.jasmine,
            },
        },
    }
);
