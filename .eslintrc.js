module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  extends: 'eslint:recommended',
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    'space-before-function-paren': ['warn', 'always'],
  },
};
