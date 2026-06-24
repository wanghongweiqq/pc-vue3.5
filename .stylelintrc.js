/*
 * @Author: 王宏伟
 * @Description: Stylelint 配置
 *   stylelint 17.x + stylelint-config-standard 40.x
 *
 *   overrides 说明：
 *   - postcss-html：解析 .vue 文件中的 <style> 块
 *   - postcss-scss：解析独立 .scss 文件（支持 $变量、@mixin 等 SCSS 语法）
 *
 *   主动关闭的规则说明：
 *   - selector-class-pattern：Element Plus 使用 BEM（__/--）命名，与 kebab-case 规则冲突，整体关闭
 *   - declaration-property-value-no-unknown：Vue CSS v-bind() 和 SCSS $变量在属性值中大量误报，关闭
 *   - at-rule-prelude-no-invalid：SCSS 插值（#{$i}）用于 @keyframes 名称时被误报，关闭
 */
module.exports = {
  'extends': ['stylelint-config-standard', 'stylelint-config-recess-order'],
  'rules': {
    // ── At-rules ──────────────────────────────────────────────────────────────
    'at-rule-no-unknown': [true, {
      'ignoreAtRules': [
        // SCSS 控制指令
        'each', 'if', 'else', 'for', 'while',
        'function', 'return', 'warn', 'debug', 'error',
        // SCSS 模块指令
        'mixin', 'include', 'extend', 'content',
        'use', 'forward', 'at-root',
      ],
    }],
    'at-rule-prelude-no-invalid': null, // SCSS #{} 插值用于 @keyframes 名称合法

    // ── 选择器 ─────────────────────────────────────────────────────────────────
    'selector-class-pattern': null, // Element Plus BEM 类名不符合 kebab-case，整体关闭

    // ── 属性值 ─────────────────────────────────────────────────────────────────
    'declaration-property-value-no-unknown': null, // Vue v-bind() 和 SCSS $变量误报

    // ── 伪类/伪元素（vendor prefix 兼容写法） ─────────────────────────────────
    'selector-pseudo-element-no-unknown': [true, {
      'ignorePseudoElements': ['input-placeholder'],
    }],
    'selector-pseudo-class-no-unknown': [true, {
      'ignorePseudoClasses': ['placeholder', 'input-placeholder'],
    }],

    // ── Import ─────────────────────────────────────────────────────────────────
    'import-notation': null, // SCSS 使用 @import "string" 语法，关闭 url() 强制规则防止 --fix 破坏 ~ 别名

    // ── 其他 ───────────────────────────────────────────────────────────────────
    'no-descending-specificity': null, // 禁止特异性较低的选择器覆盖较高的选择器（误报多）
  },
  'overrides': [
    {
      'files': ['**/*.vue'],
      'customSyntax': 'postcss-html',
    },
    {
      'files': ['**/*.scss'],
      'customSyntax': 'postcss-scss',
    },
  ],
}
