module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true,
  },
  extends: ['plugin:vue/recommended', 'airbnb-base', 'plugin:jsdoc/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', 'import', 'jsdoc'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': 'off',
    'vue/no-v-model-argument': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'object-curly-newline': 'off',
    'no-new': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-use-before-define': ['error', { functions: false }],
    'no-param-reassign': ['error', { props: false }],
    'import/no-unresolved': ['error', { ignore: ['^~icons/', '^floating-vue', '\\.css$', '\\.scss$', '\\.sass$'] }],
    'import/extensions': ['error', { ignore: ['^~icons/', '^floating-vue', '\\.css$', '\\.scss$', '\\.sass$'] }],
    // JSDoc rules
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
  },
  overrides: [
    {
      files: ['vite.config.js'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
    {
      files: ['vite.config.js', 'tailwind.config.js'],
      rules: {
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/order': 'off',
        'import/no-duplicates': 'off',
        'import/no-self-import': 'off',
        'import/no-relative-packages': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/default': 'off',
        'import/namespace': 'off',
      },
    },
    {
      files: ['src/ext/browser/app.js'],
      rules: {
        // 'floating-vue/dist/style.css'; ???
        'import/extensions': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.tsx', '.json'],
      },
    },
    'import/ignore': [
    ],
  },
};
