<template>
  <div class="content">
    <h2>react中父子组件使用</h2>
    <p>1、创建 Ref：在父组件中使用 useRef 创建一个 ref 对象。其实在父组件中像普通组件中那样使用ref即可，只是注意父组件要使用子组件暴露给他的方法名字，一般这个名字和操作dom的名字相同。</p>
    <p>2、转发 Ref：子组件使用 forwardRef 方法包裹，将父组件传入的 ref 作为子组件的第二个参数转发给子组件。这是因为函数式子组件默认不会接收ref属性，第一个参数props中不含有父组件的ref。</p>
    <p>3、暴露方法：在子组件中使用 useImperativeHandle Hook，将操作子组件dom的方法（如 focus）暴露给父组件。这样可以限制父组件只能调用特定的方法，而不是直接访问子组件的全部实例，从而提供更精确和安全的组件间通信方式。</p>
    <p>4、触发焦点：在父组件中，通过 ref.current.focus()来触发焦点。</p>
    <pre>
// 父组件
const refParent = useRef(null)
const inputParentFocus = () => {
  refParent.current.focus()
}
&lt;Child ref={refParent} /&gt;

// 子组件
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
const Child = (props, ref) => {
  const inputChildRef = useRef(null)
  // 使用命令的/必要的/规则的操作，它允许你自定义由ref暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputChildRef.current.focus()
    },
    blur: inputChildBlur,
  }), [])
}
// forwardRef 使父组件的ref能够以第二个参数的形式传递过来
export default forwardRef(Child)
</pre>
  </div>
</template>
