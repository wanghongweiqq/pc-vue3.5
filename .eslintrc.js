module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  /**
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    'no-console': 0,
    'no-debugger': 0,
    quotes: [2, 'single'],
    semi: [2, 'never'],
    'object-curly-spacing': [2, 'always'],
    'no-await-in-loop': 2,
    'for-direction': 2,
    'no-template-curly-in-string': 2,
    'block-scoped-var': 2,
    'no-extra-bind': 2,
    // "prefer-promise-reject-errors": 2,
    'require-await': 2,
    'wrap-iife': [2, 'outside'],
    'no-catch-shadow': 2,
    'no-use-before-define': 2, // react:[2, { 'functions': true, 'classes': true, 'variables': false }],
    'array-bracket-spacing': [2, 'never'],
    'block-spacing': [2, 'always'],
    'brace-style': [2, '1tbs', { allowSingleLine: true }],
    'func-call-spacing': [2, 'never'],
    indent: [2, 2, { SwitchCase: 1 }],
    'jsx-quotes': [2, 'prefer-single'],
    'key-spacing': 2,
    'generator-star-spacing': [2, { before: false, after: true }],
    'no-duplicate-imports': 2,
    eqeqeq: 2, // 要求使用===全等于
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'spaced-comment': 2, // 注释风格要不要有空格什么的
    'semi-spacing': [2, { before: false, after: true }], // 分号前后空格
    'no-multi-spaces': 2, // 不能用多余的空格
    'no-multiple-empty-lines': [2, { max: 1 }], // 空行最多不能超过1行
    'space-before-function-paren': [2, 'always'], // 函数定义时括号前面要不要有空格
    'arrow-spacing': 2, // =>的前/后空格
    'space-before-blocks': [2, 'always'], // 不以新行开始的块{前面要不要有空格
    'no-const-assign': 2, // 禁止修改const声明的变量
    'space-infix-ops': 2, // 中缀操作符周围要不要有空格
    'template-curly-spacing': [2, 'always'],
    'vue/no-multiple-template-root': 0
  }
}
