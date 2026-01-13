/**
 * @description: 自定义console.log
 * @param {*} 第一个参数为颜色样式的标识:颜色+M(model-模式)+缩进的空格数（默认0），如:'redM'、'greenM2'，该参数字符不会输出，后面的其他参数正常书写即可
 * @return {*} 带颜色样式的console.log输出
 */

const originalLog = console.log

// 里面不要在执行console.log，会陷入死循环，可使用其他输出如console.info查看相关信息
const customlog = function (...args) {
  if (process.env.NODE_ENV === 'production') return // 生产环境直接返回
  if (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    /^[A-Za-z]+M\d*$/g.test(args[0])
  ) {
    // 使用了颜色输出日志
    let res = ''
    let [color,indent] = args[0].split('M') // 解构赋值时，默认值仅在 undefined时生效：解构默认值只在对应的属性值为 undefined时才会使用。如果属性值为 null、false或 0等其他假值，默认值不会被启用
    indent = Number(indent) // 转为数字格式，同时将''转化为默认值数字0
    // const color = args[0].match(/^[A-Za-z]+(?=M\d*$)/g)[0]
    // const indent = Number(args[0].match(/(?<=^[A-Za-z]+M)\d*$/g)[0])

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
      const item = arg === Object(arg) ? JSON.stringify(arg,
        // 第二个参数replacer函数控制序列化过程中可以对每个属性值(value值)进行转换
        // JSON.stringify在碰到值为undefined会进行特殊处理，具体如下：
        // 数组中某项为undefined，会被转化为null；对象中某项key对应的值为undefined，这一项会被直接删掉
        (_,value) => {
          return value === undefined ? 'undefined' : value
        },
        indent, // 第三个参数可以美化输出（控制缩进与换行），取值可以为：2、4、'\t'。制表符'\t'标识换行，带来的缩进效果相当于4个缩进空格，貌似最大支持到10个空格缩进
      ) : arg
      cur += `${ item } `
      return cur
    }, '')
    originalLog.apply(console, [`%c${ res }`, `color: ${ color };`])
  } else {
    originalLog.apply(console, args)
  }
}

export default customlog
