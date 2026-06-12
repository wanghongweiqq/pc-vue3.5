
import prototypeNumber from '@/assets/js/prototypeNumber'
import prototypeMath from '@/assets/js/prototypeMath'
const prototypeReset = () => {
  // math() 只调用一次，解构取出所有方法，避免重复执行
  const { add, subtract, multiply, divide } = prototypeMath.math()
  Math.add = add
  Math.subtract = subtract
  Math.multiply = multiply
  Math.divide = divide
  Number.prototype.toFixed = prototypeNumber.toFixed
}
export default prototypeReset
