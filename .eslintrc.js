module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'operator-linebreak': ['error', 'before'],
    'prefer-promise-reject-errors': 'off',
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    quotes: ['warn', 'single', { avoidEscape: true }],
    'no-unused-vars': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
