/**
 * @description: 自定义console.log
 * @param {*} 第一个参数为颜色样式的标识，如:'redM'，该参数字符不会输出，后面的其他参数正常书写即可
 * @return {*} 带颜色样式的console.log输出
 */
import utils from '@/assets/js/utils'

const IS_HARMONY = true
// 简化版-常用颜色、样式和ANSI转义序列的对应关系
const colorsList = {
  black: '30', // 文本为黑色
  red: '31', // 文本为红色
  green: '32', // 文本为绿色
  yellow: '33', // 文本为黄色
  blue: '34', // 文本为蓝色
  purple: '35', // 文本为紫红
  cyan: '36', // 文本为青色
  white: '37', // 文本为白色
  blackBG: '40', // 背景色为黑色
  redBG: '41', // 背景色为红色
  greenBG: '42', // 背景色为绿色
  yellowBG: '43', // 背景色为黄色
  blueBG: '44', // 背景色为蓝色
  purpleBG: '45', // 背景色为洋红色
  cyanBG: '46', // 背景色为青色
  whiteBG: '47', // 背景色为白色
  bold: '1', // 文本加粗
  italic: '3', // 文本为斜体
  underline: '4', // 文本加下划线
  reset: '0', // 重置
}

// 完整版-常用颜色、样式和ANSI转义序列的对应关系
const colorsMap = {}
for (const key in colorsList) {
  const keyNew = `${ key }M`
  const val = colorsList[key]
  const valueNew = `\x1b[${ val }m`
  colorsMap[keyNew] = valueNew
}

const { resetM } = colorsMap
const originalLog = console.log

const log = function () {
  if (process.env.NODE_ENV === 'production') return // 生产环境直接返回
  let args = [...arguments]
  if (args.length > 0 && colorsMap[args[0]]) {
    // 使用了颜色输出日志
    const colorKey = args[0]
    const colorValue = colorsMap[colorKey]
    args.shift() // 删除标识颜色、样式的参数
    // node环境下鸿蒙端默认没有时间输出，而且toLocaleTimeString不兼容，顾使用formatTime
    if(IS_HARMONY) {
      const timeStamp = `${ utils.formatTime(Date.now(),'hh:mm:ss:lll') }->`
      // const timeStamp = new Date().toLocaleTimeString('zh-cn', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) + '->'
      args.unshift(timeStamp) // 添加时间参数为第一个输出参数

    }
    args = args.map((arg) => {
      const item = arg === Object(arg) ? JSON.stringify(arg) : arg
      const result = `${ colorValue }${ item }${ resetM }`
      return result
    })
  }
  originalLog.apply(console, args)
}

export default log
