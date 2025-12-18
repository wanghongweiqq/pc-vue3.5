/**
 * @description: 自定义console.log
 * @param {*} 第一个参数为颜色样式的标识，如:'redM'，该参数字符不会输出，后面的其他参数正常书写即可
 * @return {*} 带颜色样式的console.log输出
 */

const originalLog = console.log

// 里面不要在执行console.log，会陷入死循环，可使用其他输出如console.info查看相关信息
const customlog = function (...args) {
  if (process.env.NODE_ENV === 'production') return // 生产环境直接返回
  if (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    /^[A-Za-z]+M$/g.test(args[0])
  ) {
    // 使用了颜色输出日志
    let res = ''
    const color = args[0].slice(0, -1)
    args.shift() // 删除标识颜色、样式的参数
    const timeStamp = new Date().toLocaleTimeString('zh-cn', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric', // 2-digit
      fractionalSecondDigits: 3
    }) + '->'
    args.unshift(timeStamp) // 添加时间参数为第一个输出参数
    res = args.reduce((cur, arg) => {
      const item = arg === Object(arg) ? JSON.stringify(arg) : arg
      cur += `${ item } `
      return cur
    }, '')
    originalLog.apply(console, [`%c${ res }`, `color: ${ color };`])
  } else {
    originalLog.apply(console, args)
  }
}

export default customlog
