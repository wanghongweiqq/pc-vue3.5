<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖和节流在options组件中的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-composition.vue
-->

<template>
  <div class="content">
    <div class="debounce-composition-api">
      <h3>下面使用的是vue3.0中的composition组合式api</h3>
      <p>1、let timer：当触发的地方使用函数表达式，也就是变量声明（而非函数声明），初始话时就被执行，值为undefined，利用了闭包特性，保证每一个计时器（timer）都是独立的，此时要求模板中不要有重复的触发方法名，如doSearch1，重复的话会使用同一个timer，导致互相干扰。当触发需要防抖的方法时，会直接调用下面return的方法，而不会重新声明let timer。</p>
      <p>2、setTimeout：第一个参数是一个回调函数，可以是匿名函数（箭头函数是一种更简洁的书写匿名函数的方式）、或者定义的其他函数如fn（可以是具名函数也可以是匿名函数），但不能是一个执行的函数fn()。这里如果不涉及到传参，可以直接将回调函数写为fn，但我们有使用传参的情况，所以要用匿名函数包一层</p>
      <p>3、事件调佣debounce方法的第一个参数最好写成箭头函数，箭头函数（匿名函数的一种更简介的形式）通常是通过函数表达式实现的，而不是通过函数声明。通常用在需要传递一个函数作为参数的场景，比如作为回调函数或者在高阶函数中。此处用具名函数声明的形式（function xxx(){}）也是可以的，debounce核心方法中可以用fn.name获取其名字（为xxx）。但在options-api组件中函数声明的形式（匿名和具名一样）要慎重，因为this的指向问题，核心方法的位置和里面有没有绑定this都会有不同的结果。</p>
      <p>3、事件调佣debounce方法的第一个参数最好写成箭头函数，箭头函数（匿名函数的一种更简介的形式）通常是通过函数表达式实现的，而不是通过函数声明。通常用在需要传递一个函数作为参数的场景，比如作为回调函数或者在高阶函数中。此处用具名函数声明的形式（function xxx(){}）也是可以的，debounce核心方法中可以用fn.name获取其名字（为xxx）。但在options-api组件中函数声明的形式（匿名和具名一样）要慎重，因为this的指向问题，核心方法的位置和里面有没有绑定this都会有不同的结果。</p>
      <pre>
// 防抖的核心方法
function debounce (fn,delay = 2000) {
  let timer
  return (...args) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => { 
      fn(...args)
    }, delay)
  }
}
</pre>
      <p>1、可防抖：参数为input的默认参数即value值</p>
      <pre>
// inputs事件调用
@input="doSearch1"

// 函数表达式的形式是ok的
const doSearch1 = debounce( (...args) => {
  console.log('输入框1参数为：',...args)
})
</pre>
      <p>
        <el-input
          v-model="searchValue1"
          placeholder="可防抖，参数为input的默认参数即value值"
          clearable
          @input="doSearch1"
        />
      </p>
      <p>和第一个输入框用了同一个方法名称：doSearch1，造成互相干扰，快速（delay时间内的）切换输入框输入和按钮点击操作时，清除了前面本该触发的同名计时器。不同的元素要使用不同的方法</p>
      <p>
        <el-button 
          type="primary"
          size="small"
          @click="doSearch1"
        >
          点击时执行上面的方法：doSearch1
        </el-button>
      </p>
        
      <p>2、可防抖：参数为input的默认参数value和自定义参数，单个默认参数可以使用$event，多个使用arguments，其是一个数组</p>
      <pre>
// inputs事件调用
@input="doSearch2($event,'a','b')"

// 函数表达式的形式是ok的
const doSearch2 = debounce( (...args) => {
  console.log('输入框2参数为：',...args)
})
</pre>
      <p>
        <el-input
          v-model="searchValue2"
          placeholder="可防抖，参数为input的默认参数value和自定义参数，单个默认参数可以使用$event，多个使用arguments，其是一个数组"
          clearable
          @input="doSearch2($event,'a','b')"
        />
      </p>
      <p>3、不可防抖：函数声明的形式：达不到防抖的效果，会全部依次执行。值每次改变都会重新声明let timer，这样就不会清除之前的计时器，可以声明全局的计时器，但这样就没有封装效果了。上面两种方法可以是因为定义的事件方法使用了函数表达式，在代码执行到定义的地方就触发了核心debonce方法，将变量timer私有化，input事件触发时相当于执行了return的方法，有函数柯里化的意思。</p>
      <pre>
// inputs事件调用
@input="doSearch3($event,'c','d')"

function doSearch3 (...args) {
  debounce(() => {
    console.log('输入框3参数为：',...args) // 可以直接从父方法中获得参数，当然也可以从debounce方法里绕一圈再传出来，两种方法都可以获取参数
  })()
}
</pre>
      <p>
        <el-input
          v-model="searchValue3"
          placeholder="函数声明的形式：达不到防抖的效果，会全部依次执行"
          clearable
          @input="doSearch3($event,'c','d')"
        />
      </p>
      <p>4、不可防抖：像下面options选项式api使用的形式，直接使用debounce方法，也不能防抖，每次输入更改都会重新定义timer计时器。options选项式api能行是因为当前组件实例下计时器是唯一且不同的，使用了this.一个不同的id，相当于在this下绑定了一个唯一的全局变量</p>
      <pre>
@input="debounce( (...args) => {
  console.log('输入框4参数为：',...args)
})($event,'e')"
</pre>
      <el-input
        v-model="searchValue4"
        placeholder="直接使用debounce方法，：达不到防抖的效果，会全部依次执行"
        clearable
        @input="debounce( (...args) => {
          console.log('输入框4参数为：',...args)
        })($event,'e')"
      />
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref, 
} from 'vue'

const searchValue1 = ref('')
const searchValue2 = ref('')
const searchValue3 = ref('')
const searchValue4 = ref('')

// 防抖的核心方法
function debounce (fn,delay = 2000) {
  let timer 
  console.log('timer-组合API',timer)
  return (...args) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => { 
      fn(...args)
    }, delay)
  }
}

// 以下两种函数表达式的形式都是ok的
const doSearch1 = debounce( function (...args) { 
  console.log('输入框1参数为：',...args)
})

const doSearch2 = debounce( (...args) => {
  console.log('输入框2参数为：',...args)
})

// 函数声明的形式：达不到防抖的效果，会全部依次执行
function doSearch3 (...args) {
  debounce(() => {
    console.log('输入框3参数为：',...args) // 可以直接从父方法中获得参数，当然也可以从debounce方法里绕一圈再传出来，两种方法都可以获取参数
  })()
}
</script>
