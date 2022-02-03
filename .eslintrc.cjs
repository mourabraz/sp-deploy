module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  root: true,
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-await-in-loop': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'import/extensions': [2, 'always'],
  },
};
