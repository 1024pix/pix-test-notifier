const fs = require('fs');

module.exports = {
  globals: {
    server: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2018,
    sourceType: 'module',
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
    },
  },
  plugins: ['ember', 'qunit'],
  extends: [
    ...(fs.existsSync('../.eslintrc.yaml') ? ['../.eslintrc.yaml'] : []),
    'plugin:ember/recommended',
    'plugin:qunit/recommended',
    'plugin:prettier/recommended',
    'plugin:i18n-json/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'no-restricted-imports': ['error', { paths: ['lodash'] }],
    'no-console': 'error',
    'ember/no-array-prototype-extensions': 0,
    'i18n-json/valid-message-syntax': 0,
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
    },
    {
      // Test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
