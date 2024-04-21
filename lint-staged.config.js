module.exports = {
  '*.{css,scss,less,sass}':
    'stylelint --fix --allow-empty-input && prettier --write',
  '*.{yml,md,js,ts,tsx,svelte,astro,cjs,mjs,cts,mts,jsx,json,json5,.jsonc}':
    'prettier --write',
  '*.{ts,tsx,js,jsx,svelte,astro,cjs,mjs,cts,mts,vue}':
    'eslint --fix --ext .js,.ts,.tsx,.jsx,.svelte,.astro,.cjs,.mjs,.cts,.mts,.vue && prettier --write',
  // '*.{html}': 'html-validate && htmlhint',
};
