
import prototypeNumber from '@/assets/js/prototypeNumber'
import prototypeMath from '@/assets/js/prototypeMath'
const prototypeReset = () => {
  Math.add = prototypeMath.math().add
  Math.subtract = prototypeMath.math().subtract
  Math.multiply = prototypeMath.math().multiply
  Math.divide = prototypeMath.math().divide
  Number.prototype.toFixed = prototypeNumber.toFixed
}
export default prototypeReset
