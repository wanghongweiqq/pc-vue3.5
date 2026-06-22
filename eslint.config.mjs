// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue'

export default [
  // 忽略目录（替代 .eslintignore）
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Vue 文件解析 + 推荐规则（内置 vue-eslint-parser）
  ...pluginVue.configs['flat/recommended'],

  // 自定义规则
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // 替代原来的 env: { node: true }
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },

    rules: {
      'no-console': 0,
      'no-debugger': 0,
      'quotes': [2, 'single'],
      'semi': [2, 'never'],
      'object-curly-spacing': [2, 'always'],
      'no-await-in-loop': 2,
      'for-direction': 2,
      'no-template-curly-in-string': 2,
      'block-scoped-var': 2,
      'no-extra-bind': 2,
      'require-await': 2,
      'wrap-iife': [2, 'outside'],
      'no-catch-shadow': 2,
      'no-use-before-define': 2,
      'array-bracket-spacing': [2, 'never'],
      'block-spacing': [2, 'always'],
      'brace-style': [2, '1tbs', { allowSingleLine: true }],
      'func-call-spacing': [2, 'never'],
      'indent': [2, 2, { SwitchCase: 1 }],
      'jsx-quotes': [2, 'prefer-single'],
      'key-spacing': 2,
      'generator-star-spacing': [2, { before: false, after: true }],
      'no-duplicate-imports': 2,
      'eqeqeq': 2,
      'no-spaced-func': 2,
      'spaced-comment': 2,
      'semi-spacing': [2, { before: false, after: true }],
      'no-multi-spaces': 2,
      'no-multiple-empty-lines': [2, { max: 1 }],
      'space-before-function-paren': [2, 'always'],
      'arrow-spacing': 2,
      'space-before-blocks': [2, 'always'],
      'no-const-assign': 2,
      'space-infix-ops': 2,
      'template-curly-spacing': [2, 'always'],
      'vue/no-multiple-template-root': 0,
      // flat/recommended 比旧版更严格，以下为维持原有行为关闭的规则
      'vue/multi-word-component-names': 0,
      'vue/require-explicit-emits': 0,
      'vue/no-reserved-component-names': 0,
    },
  },
]
