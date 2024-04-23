module.exports = {
  '*.{css,scss,less,sass}': 'stylelint --fix --allow-empty-input ',

  '*.{ts,tsx,js,jsx,svelte,astro,cjs,mjs,cts,mts,vue}': 'eslint --cache --fix',

  '*.{yml,md,js,ts,tsx,svelte,astro,cjs,mjs,cts,mts,jsx,json,json5,jsonc,css,scss,less,sass,html,htm,mdx,mdown,markdown}':
    'prettier --write',

  // '*.{html}': 'html-validate && htmlhint',
};
