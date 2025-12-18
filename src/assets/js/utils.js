
import Constant from './constant'

export default {
  /**
   * @description: 网址或者字符串获取参数-特殊字符拆分法
   * @param {*} url: 非必传，默认是网址
   * @return {*} 对象格式的参数
   */
  searchToParams1  (url) {
    const str = decodeURIComponent(url || location.href)
    const urlParams = str.split('?')
    const query = {}
    if (urlParams[1]) {
      const paramsItem = urlParams[1].split('&')
      for (const i in paramsItem) {
        const arr = paramsItem[i].split('=')
        query[arr[0]] = arr[1]
      }
    }
    return query
  },

  /**
   * @description: 网址或者字符串获取参数-正在表达式匹配法
   * @param {*} url: 非必传，默认是网址
   * @return {*} 对象格式的参数
   */
  searchToParams (url) {
    const str = decodeURIComponent(url || location.href)
    const pattern = new RegExp('(?<=[?&])([^=]+)=([^&#]*)','g')
    let result = {}
    let execRes
    while( (execRes = pattern.exec(str) ) !== null) {
      if(result[execRes[1]]) {
        console.log(`参数中已有属性：${ execRes[1] }：${ result[execRes[1]] }，最新值为：${ execRes[2] }`)
      }
      result[execRes[1]] = execRes[2]
    }
    return result
  },

  // 京东云图片处理:按尺寸调用和webp格式调用
  imgOssProcess (url,width,height,quality = 60) {
    url = url ? url : Constant.defaultGoodsImage
    if( url.indexOf('//') > -1) {
      if( width && height) {
        if(window.canWebp) {
          return `${ url }?x-oss-process=img/s/${ width }/${ height }/q/${ quality }/fmt/webp/`
        }else{
          return `${ url }?x-oss-process=img/s/${ width }/${ height }/`
        }
      }else{
        if(window.canWebp) {
          return `${ url }?x-oss-process=img/q/${ quality }/fmt/webp/`
        }else{
          return url
        }
      }
    } else{
      return url
    }
  },
  // 过滤查询参数
  filterParams (obj) {
    let params = {}
    const reg = /(^\s+)|(\s+$)/g
    for (let key in obj) {
      if (typeof (obj[key]) === 'string') {
        obj[key] = obj[key].replace(reg, '')
      }
      // null==undefined 0==''为true，所以要写全等于
      if (obj[key] !== null && obj[key] !== '' && typeof obj[key] !== 'undefined' && !(obj[key] instanceof Array && obj[key].length === 0) && !(obj[key] instanceof Object && Object.keys(obj[key]).length === 0)) {
        params[key] = obj[key]
      }
    }
    return params
  },
  // 过滤查询参数
  filterParamsToString (obj) {
    const params = this.filterParams(obj)
    const strArray = Object.keys(params).map((item,index) => {
      if(index === 0) {
        return `?${ item }=${ params[item] }`
      }else{
        return `&${ item }=${ params[item] }`
      }
    })
    return strArray.join('')
  },
  // 判断是否为整数
  isInteger (val) {
    const num = Number(val)
    return Math.floor(num) === num
  },
  // 数字展示为带n位小数
  formatFloat (val,n = 2) {
    if(isNaN(val)) { // 先尝试转为数值再判断, false:isNaN(false)、isNaN(null)、isNaN('')、isNaN(' ')、isNaN(new Date())
      return val
    }else{ // 1.335.toFixed(2)=1.33
      const num = Number(val)
      if (this.isInteger(num)) {
        return num.toFixed(n)
      }else{
        const times = Math.pow(10, n)
        const result = parseInt(num * times + 0.5) / times
        return result.toFixed(n)
      }
    }
  },
  toFixed (length) {
    var carry = 0 // 存放进位标志
    var num, multiple // num为原浮点数放大multiple倍后的数，multiple为10的length次方
    var str = this + '' // 将调用该方法的数字转为字符串
    var dot = str.indexOf('.') // 找到小数点的位置
    if (str.substr(dot + length + 1, 1) >= 5) carry = 1 // 找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
    multiple = Math.pow(10, length) // 设置浮点数要扩大的倍数
    num = Math.floor(this * multiple) + carry // 去掉舍入位后的所有数，然后加上我们的手动进位数
    console.log(num)
    var result = num / multiple + '' // 将进位后的整数再缩小为原浮点数
    /*
     * 处理进位后无小数
     */
    dot = result.indexOf('.')
    if (dot < 0) {
      result += '.'
      dot = result.indexOf('.')
    }
    /*
     * 处理多次进位
     */
    var len = result.length - (dot + 1)
    if (len < length) {
      for (var i = 0; i < length - len; i++) {
        result += 0
      }
    }
    return result
  },
  // 浮点数运算
  math () {
    const _this = this
    function toInteger (num1,num2) { // 扩大相同倍数
      let integerObj = { n1: num1, n2: num2, times: 1 } // times= 1 ：默认倍数为1
      if (_this.isInteger(num1) && _this.isInteger(num2)) { // num1、num2均为整数
        return integerObj
      }else{ // num1、num2为浮点数
        const num1Array = String(num1).split('.')
        const num2Array = String(num2).split('.')
        const num1Times = num1Array.length === 1 ? 0 : num1Array[1].length
        const num2Times = num2Array.length === 1 ? 0 : num2Array[1].length
        const maxTimes = Math.max(num1Times,num2Times)
        integerObj.n1 = String(num1).replace('.','') * Math.pow(10,maxTimes - num1Times)
        integerObj.n2 = String(num2).replace('.','') * Math.pow(10,maxTimes - num2Times)
        integerObj.times = Math.pow(10,maxTimes)
        return integerObj
      }
    }
    function operation (num1, num2, op) {
      const integerObj = toInteger(Number(num1),Number(num2))
      switch (op) {
        case 'add':// 0.1+0.2=0.30000000000000004
          return (integerObj.n1 + integerObj.n2) / integerObj.times
        case 'subtract':// 0.3-0.2=0.09999999999999998
          return (integerObj.n1 - integerObj.n2 ) / integerObj.times
        case 'multiply':// 0.3*9=2.6999999999999997  4.39*100=438.99999999999994
          return (integerObj.n1 * integerObj.n2 ) / Math.pow(integerObj.times,2)
        case 'divide':// 2.7/9=0.30000000000000004
          return integerObj.n1 / integerObj.n2
      }
    }
    // 加减乘除的四个接口
    function add (a, b) {
      return operation(a, b, 'add')
    }
    function subtract (a, b) {
      return operation(a, b, 'subtract')
    }
    function multiply (a, b) {
      return operation(a, b, 'multiply')
    }
    function divide (a, b) {
      return operation(a, b, 'divide')
    }
    return {
      add: add,
      subtract: subtract,
      multiply: multiply,
      divide: divide
    }
  },
  // number () {
  //   const _this = this
  //   function toInteger (val) {
  //     const num = Number(val)
  //     let integerObj = { times: 1, num: 0 }
  //     if (_this.isInteger(num)) {
  //       integerObj.num = num
  //       return integerObj
  //     }
  //     const floatStr = String(num)
  //     integerObj.times = Math.pow(10, floatStr.split('.')[1].length)
  //     integerObj.num = Number(floatStr.replace('.',''))
  //     return integerObj
  //   }
  //   function operation (a, b, op) {
  //     const o1 = toInteger(a)
  //     const o2 = toInteger(b)
  //     const n1 = o1.num
  //     const n2 = o2.num
  //     const t1 = o1.times
  //     const t2 = o2.times
  //     const max = t1 > t2 ? t1 : t2
  //     let result = null
  //     console.log(111111111)
  //     console.log(o1)
  //     console.log(o2)
  //     switch (op) {
  //       case 'add':// 0.1+0.2=0.30000000000000004
  //         if (t1 === t2) {
  //           result = n1 + n2
  //         } else if (t1 > t2) {
  //           result = n1 + n2 * (t1 / t2)
  //         } else {
  //           result = n1 * (t2 / t1) + n2
  //         }
  //         return result / max
  //       case 'subtract':// 0.3-0.2=0.09999999999999998
  //         if (t1 === t2) {
  //           result = n1 - n2
  //         } else if (t1 > t2) {
  //           result = n1 - n2 * (t1 / t2)
  //         } else {
  //           result = n1 * (t2 / t1) - n2
  //         }
  //         return result / max
  //       case 'multiply':// 0.3*9=2.6999999999999997  4.39*100=438.99999999999994
  //         result = (n1 * n2) / (t1 * t2)
  //         return result
  //       case 'divide':// 2.7/9=0.30000000000000004
  //         if(t2 - t1 > 0) {
  //           result = (n1 / n2) * ( t2 / t1)
  //         }else{
  //           result = (n1 / n2) / ( t2 / t1)
  //         }
  //         return result
  //     }
  //   }
  //   // 加减乘除的四个接口
  //   function add (a, b) {
  //     return operation(a, b, 'add')
  //   }
  //   function subtract (a, b) {
  //     return operation(a, b, 'subtract')
  //   }
  //   function multiply (a, b) {
  //     return operation(a, b, 'multiply')
  //   }
  //   function divide (a, b) {
  //     return operation(a, b, 'divide')
  //   }
  //   return {
  //     add: add,
  //     subtract: subtract,
  //     multiply: multiply,
  //     divide: divide
  //   }
  // },
  // 转化为日期格式
  formatDate (date) {
    if(Object.prototype.toString.call(date) === '[object Date]') {
      return date
    }else if(Object.prototype.toString.call(date) === '[object String]' && date !== '') {
      return new Date(date.replace(/-/g, '/'))
    }else if(Object.prototype.toString.call(date) === '[object Number]') {
      return new Date(date)
    }else{
      return null
    }
  },
  // 一天的开始时间
  dayStart (date) {
    const time = this.formatDate(date)
    if(time === null) {
      return '- -'
    }
    return time.setHours(0,0,0)
  },
  // 一天的结束时间
  dayEnd (date) {
    const time = this.formatDate(date)
    if(time === null) {
      return '- -'
    }
    return time.setHours(23,59,59)
  },
  /* 日期格式化
   * 1. date：
   * 字符串格式：'2020/01/01 12:00:00'、'2020-01-01'、'Jan 01 2020 12:00:00'、'Jan 01, 2020'
   * 数字格式（1970/01/01至今毫秒数）：1577808000000
   * 日期格式：new Date(2020,00,01,12,00,0)、new Date(字符串格式/数字格式)
   * 2. showFormat：
   * timeObj对象中key值的字符集合：[YMDhmsl]，可以使用任意组合形式，但要保证位数对应，注意大小写，因为有两个m
   * showFormat时间外的内容不要含这个字符集合中的字母
   * 正确：YYYY-MM-DD hh:mm:ss、YYYY年MM月DD日、YYYYMMDD，错误：hello，YYYY年MM月DD日、Dh:mm:ss
	*/
  formatTime (date, showFormat = 'YYYY-MM-DD') {
    const time = this.formatDate(date)
    let newFormat = showFormat
    if(time === null) {
      return '- -'
    }
    const timeObj = {
      Y: time.getFullYear(),
      M: time.getMonth() + 1,
      D: time.getDate(),
      h: time.getHours(),
      m: time.getMinutes(),
      s: time.getSeconds(),
      l: time.getMilliseconds(),
    }
    let timeObjKeys = Object.keys(timeObj).join('')
    const regDate = new RegExp(`([${ timeObjKeys }])\\1*`, 'g') // 字面量形式：/([YMDhmsl])\1*/g，因不支持使用变量，顾使用的够构造函数形式。最初使用正则为：/([YMDhms])+/g，当有时间节点无缝拼接时会出错，如YYYYMMDD
    const result = newFormat.replace(
      regDate,
      (match, key) => timeObj[key].toString().padStart(match.length, '0')
    )
    return result
  },
  // 获取本周时间,toNow默认false:从周一到周日，为true时：从周一到当前date
  getWeekDate (date = new Date(),toNow = false) {
    const time = this.formatDate(date)
    if(time === null) {
      return '- -'
    }
    const weekIndex = time.getDay()
    let monday = new Date(time)
    let minusDay = (weekIndex === 0 ? 7 : weekIndex) - 1
    monday.setDate(monday.getDate() - minusDay) // 定位到周一
    if(toNow) {
      return [this.dayStart(monday), this.dayEnd(time)]
    }else{
      let sunday = new Date(time)
      sunday.setDate(monday.getDate() + 6) // 定位到周日
      return [this.dayStart(monday), this.dayEnd(sunday)]
    }
  },
  // 获取本月时间,toNow默认false：从月初到月末，为true时：从月初到当前date
  getMonthDate (date = new Date(),toNow = false) {
    const time = this.formatDate(date)
    if(time === null) {
      return '- -'
    }
    let monthStart = new Date(time)
    monthStart.setDate(1)
    if(toNow) {
      return [this.dayStart(monthStart), this.dayEnd(time)]
    }else{
      let monthEnd = new Date(time)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      return [this.dayStart(monthStart), this.dayEnd(monthEnd)]
    }
  },
  // 数据类型判断，返回：element、string、number、boolean、object……
  dataType (data) {
    if (data instanceof Element) {
      return 'element'
    }
    if (typeof data === 'symbol') {
      return 'symbol'
    }
    const map = {
      '[object String]': 'string',
      '[object Number]': 'number',
      '[object Boolean]': 'boolean',
      '[object Object]': 'object',
      '[object Array]': 'array',
      '[object Function]': 'function',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
    }
    return map[Object.prototype.toString.call(data)]
  },
  // 数据深拷贝，支持Symbal
  deepCopy (data) {
    let newData = null
    const type = this.dataType(data)
    if(type === 'array' || type === 'object') {
      newData = type === 'array' ? [] : {}
      let proto = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)]
      proto.map((key) => {
        newData[key] = this.deepCopy(data[key])
      })
      return newData
    }else{
      return data
    }
  },
  /**
 * @description: 复制文本
 * @param {*} str 要被复制的文本
 * @param {*} isShow 是否展示复制成功信息
 * @return {*} 无
 */
  copyText (str, isShow = true) {
    try{
      let _textarea = document.createElement('textarea') // textarea相比input支持复制内容换行等
      _textarea.value = str // 设置内容
      document.body.appendChild(_textarea) // 添加临时实例
      _textarea.select() // 选择实例内容
      document.execCommand('Copy') // 执行复制
      document.body.removeChild(_textarea) // 删除临时实例
      if(isShow) {
        alert('复制成功')
      }
    }catch{
      alert('当前浏览器版本不支持，请升级或使用其他浏览器')
    }
  },
  copyText1 (str, isShow = true) {
    try{
      let _textarea = document.createElement('textarea') // textarea相比input支持复制内容换行等
      _textarea.setAttribute('id', 'textId')
      let _textareaText = document.createTextNode(str)
      _textarea.appendChild(_textareaText)
      document.body.appendChild(_textarea)
      let range = document.createRange()
      range.selectNodeContents(_textarea) // selectNodeContents:元素中的内容，不含元素自身 selectNode:含元素自身，复制功能两者都可以
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        selection.removeAllRanges()
      }
      selection.addRange(range)
      document.execCommand('Copy')
      // range.deleteContents()// range绑定dom时采用range.selectNode才可以使用该方法，否则不会删除临时dom，只会删除其子内容
      document.body.removeChild(_textarea) // 删除临时dom
      if(isShow) {
        alert('复制成功')
      }
    }catch{
      alert('当前浏览器版本不支持，请升级或使用其他浏览器')
    }
  },
  xxx: 1,
  // 防抖的核心方法：更简洁，功能也更强大
  debounce (fn,delay = 2000) {
    let timer
    const debounced = (...args) => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        fn(...args)
      }, delay)
    }
    debounced.clear = () => {
      timer && clearTimeout(timer)
    }
    return debounced
  },
  // 防抖的核心方法，适用于Options API，有点笨，需要第三个参数，这个参数要当前组件内唯一
  debounceOptions (fn,delay = 2000,id = 'timer') {
    let that = this
    const debounced = (...args) => { // return是箭头函数的情况下，this指的是该文件所对应的对象（是函数声明形式的匿名函数时，this为undefined）
      console.log('this',this)
      that[id] && clearTimeout(that[id])
      that[id] = setTimeout( () => {
        fn.apply(this,args)
        // fn(...args)
      }, delay)
    }
    debounced.clear = () => {
      that[id] && clearTimeout(that[id])
    }
    return debounced
  },

  throttle (fn,delay = 2000) {
    console.log('throttle')
    let timer
    let isPending = false
    const throttled = (...args) => {
      if(!isPending) {
        isPending = true
        fn(...args)
        timer = setTimeout(() => {
          isPending = false
        },delay )
      }
    }
    throttled.clear = () => {
      timer && clearTimeout(timer)
      timer = null
      isPending = false
    }
    return throttled
  },
  delay (duration) {
    let start = Date.now()
    while(Date.now() - start < duration) {}
  }
}
