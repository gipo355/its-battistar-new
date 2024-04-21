module.exports = {
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  jsxSingleQuote: true,
  semi: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 80,
  quoteProps: 'as-needed',
  bracketSameLine: false,
  proseWrap: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.css',
      options: {
        parser: 'css',
      },
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
  ],
  tailwindFunctions: ['tw'],
};
