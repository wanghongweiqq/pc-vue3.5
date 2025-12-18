
export default {
  // 判断是否为整数
  isInteger (val) {
    const num = Number(val)
    return Math.floor(num) === num
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
  }
}
