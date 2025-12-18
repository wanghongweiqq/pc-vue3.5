/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-04-16 10:02:05
 * @LastEditTime: 2021-11-26 11:15:33
 * @LastEditors: 王宏伟
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/babel.config.js
 */
// element-plus 按需引入.scss
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${ name }.scss`
        },
      },
    ],
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
