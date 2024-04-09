// .commitlintrc.js
const fs = require('node:fs');
const path = require('node:path');

// const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));
const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
const libs = fs.readdirSync(path.resolve(__dirname, 'libs'));

const { execSync } = require('child_process');

// @tip: git branch name = feature/issue_33   =>    auto get defaultIssues = #33
const issue = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()
  .split('_')[1];

// .commitlintrc.js
/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'scope-enum': [
      2,
      'always',
      [
        // ...packages,
        'global', // used to denote global changes
        ...apps,
        ...libs,
      ],
    ],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    useEmoji: true,
    useAI: false,
    aiNumber: 1,
    customIssuePrefixAlign: !issue ? 'top' : 'bottom',
    defaultIssues: !issue ? '' : `#${issue}`,
  },
};
