/* eslint-disable unicorn/prefer-module */
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../../node_modules/flowbite/**/*.js"'),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};
