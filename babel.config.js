/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-04-16 10:02:05
 * @LastEditTime: 2021-11-26 11:15:33
 * @LastEditors: 王宏伟
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/babel.config.js
 */
// Vue CLI 5.x 的 @vue/babel-preset-app 内置 @babel/preset-env，
// 已自动支持 ?.、??、||=、&&= 等现代语法，无需手动添加 proposal 插件。
module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset'],
  ],
}

// element-plus 按需引入.css
// module.exports = {
//   plugins: [
//     [
//       'import',
//       {
//         libraryName: 'element-plus',
//         customStyleName: (name) => {
//           console.log(222222)
//           console.log(name)
//           return `element-plus/lib/theme-chalk/${ name }.css`
//         },
//       },
//     ],
//   ],
// }
