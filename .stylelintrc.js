/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-11-26 11:11:32
 * @LastEditTime: 2021-11-29 11:18:33
 * @LastEditors: 王宏伟
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/.stylelintrc.js
 */
module.exports = {
  'extends': ['stylelint-config-standard', 'stylelint-config-recess-order'],
  'rules': {
    'at-rule-no-unknown': [true, { 'ignoreAtRules': [
      'mixin', 'extend', 'content', 'include'
    ] }],
    'no-descending-specificity': null // 禁止特异性较低的选择器在特异性较高的选择器之后重写
  }
}
