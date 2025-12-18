<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖和节流在options组件中的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-options.vue
-->

<template>
  <div class="content">
    <div class="debounce-options-api">
      <h3>下面使用的是options选项式api</h3>
      <pre>
// 防抖的核心方法，适用于Options API，不方便清除计时器，容易造成内存泄漏和性能问题，而且有点笨，需要第三个参数，这个参数要当前组件内唯一
// 参数id：每个事件防抖时这个参数要唯一且不可变，不唯一的话会导致快速（delay时间内的）切换输入框操作时，清除了前面本该触发的同名计时器，当然这个发生的概率小，同一个元素的防抖事件如果id变了，前面的就无法被清除，达不到防抖的效果，每次触发都会完整执行方法内的全部内容
debounceOptions (fn,delay = 1000,id = 'timer') {
  let that = this
  const debounced = (...args) => {
    console.log('this',this)
    that[id] && clearTimeout(that[id])
    that[id] = setTimeout( () => {
      // 这个this只定义在当前组件内有用（有用指的是debonce内的方法fn里使用的this能指向当前组件实例，如：this.searchValue3），如果该方法写在别的目录下如utils.js，return是箭头函数的情况下，this指的是该文件所对应的对象（是函数声明形式的匿名函数时，this为undefined），这样就获取不到当前组件实例的内容。
      // 如果组件内调用防抖的地方的fn使用的：箭头函数，不用绑定this都可以，这时debonce写在工具类utils.js里也可以。
      // 如果组件内调用防抖的地方的fn使用的：函数声明形式的匿名函数时，工具类utils.js里定义该方法最好还是绑定this，虽然在fn执行的时候和不绑定this一样都拿不到想要的当前组件的数据，但会返回一个undefined，因为this是有值的，当前文件生成的对象。而不是像不绑定this那样报错：Uncaught TypeError: Cannot read properties of undefined (reading 'searchValue3')，因为this这时没值，this.xxx就会报错
      // 总结：组件内调用防抖的地方的fn使用箭头函数，防抖的核心方法return也是用箭头函数，vue选项模式下最好还是绑定this，以防止组件内调用防抖的地方的fn使用的不是箭头函数而造成相关属性undefined的报错
      fn.apply(this,args) 
      // fn(...args)
    }, delay)
    debounced.clear = () => {
      that[id] && clearTimeout(that[id])
    }
    return debounced
  }
} </pre>

      <p>1、可防抖，参数为input的默认参数即value值</p>
      <pre>
// inputs事件调用
@input="debounceOptions(doSearch1)($event)"

// 回调方法
doSearch1 (...args) {
  console.log('输入框1参数为：',...args)
},
</pre>
      <p>
        <el-input
          v-model="searchValue1"
          placeholder="参数为input的默认参数即value值"
          clearable
          @input="$utils.debounceOptions(doSearch1)($event)"
        />
      </p>

      <p>2、可防抖，参数为input的默认参数value和自定义参数，单个默认参数可以使用，多个使用arguments，其是一个数组</p>
      <pre>
// inputs事件调用
@input="debounce2($event,'a','b')"
@clear="debounce2.clear"

// 防抖初始话，执行闭包，私有化变量
data () {
  return{
    debounce2: this.$utils.debounceOptions(this.doSearch2, undefined , 123),
  }
},

// 回调方法
doSearch2 (...args) {
  console.log('输入框2参数为：',...args)
},
</pre>
      <p>
        <el-input
          v-model="searchValue2"
          placeholder="参数为input的默认参数value和自定义参数，单个默认参数可以使用$event，多个使用arguments，其是一个数组"
          clearable
          @input="debounce2($event,'a','b')"
          @clear="debounce2.clear"
        />
      </p>
    
      <p>3、可防抖，函数声明的形式，在内部再调用debounce方法</p>
      <p>
        <el-input
          v-model="searchValue3"
          placeholder="函数声明的形式，在内部再掉能用debounce方法"
          clearable
          @input="doSearch3($event,'c','d')"
        />
      </p>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script>
export default {
  data () {
    return{
      name: 'wanghognwei',
      searchValue1: '',
      searchValue2: '',
      searchValue3: '',
      debounce2: this.$utils.debounceOptions(this.doSearch2, undefined , 123),
    }
  },

  methods: {
    // 防抖一般作为公共方法使用，尽量不要像下面这样写在组件的方法内，没用通用性。这里之所以这样写，只是做功能测试
    // id要唯一，不唯一的话会导致快速（delay时间内的）切换输入框操作时，清除了前面本该触发的同名计时器
    debounceOptions (fn,delay = 3000,id = 'timer') {
      let that = this
      console.log('that',that)
      const debounced = (...args) => {
        console.log('this',this)
        that[id] && clearTimeout(that[id])
        that[id] = setTimeout( () => {
          // 这个this只定义在当前组件内有用（有用指的是debonce内的方法fn里使用的this能指向当前组件实例，如：this.searchValue3），如果该方法写在别的目录下如utils.js，return是箭头函数的情况下，this指的是该文件所对应的对象（是函数声明形式的匿名函数时，this为undefined），这样就获取不到当前组件实例的内容。
          // 如果组件内调用防抖的地方的fn使用的：箭头函数，不用绑定this都可以，这时debonce写在工具类utils.js里也可以。
          // 如果组件内调用防抖的地方的fn使用的：函数声明形式的匿名函数时，工具类utils.js里定义该方法最好还是绑定this，虽然在fn执行的时候和不绑定this一样都拿不到想要的当前组件的数据，但会返回一个undefined，因为this是有值的，当前文件生成的对象。而不是像不绑定this那样报错：Uncaught TypeError: Cannot read properties of undefined (reading 'searchValue3')，因为this这时没值，this.xxx就会报错
          // 总结：组件内调用防抖的地方的fn使用箭头函数，防抖的核心方法return也是用箭头函数，vue选项模式下最好还是绑定this，以防止组件内调用防抖的地方的fn使用的不是箭头函数而造成相关属性undefined的报错
          fn.apply(this,args) 
          // fn(...args)
        }, delay)
      }
      debounced.clear = () => {
        that[id] && clearTimeout(that[id])
      }
      return debounced
    },
    doSearch1 (...args) {
      console.log('输入框1参数为：',...args)
    },
    doSearch2 (...args) {
      console.log('输入框2参数为：',...args)
    },
    // 方法里再使用debounce，相当于多套一层
    doSearch3 (...args) {
      // console.log('doSearch3',args)
      // console.log('this',this)
      // 其实debounce下面可以不用传参...args，省的在核心方法里绕一圈再出来，直接使用外层方法doSearch3的参数...args即可
      this.debounceOptions( (...argument) => { // OK，下面的this指的是当前组件实例
      // this.debounceOptions( function (...argument) { // NO，如果核心方法没有绑定this,而且这里第一个参数使用的不是箭头函数，就是导致报错： Cannot read properties of undefined (reading 'name')
      // this.$utils.debounceOptions( (...argument) => { // OK，下面的this指的是当前组件实例，此时核心方法里this绑定与否没有关系
      // this.$utils.debounceOptions( function (...argument) { // NO，工具类里的debounce如果绑定了this，那下面的this指的是工具类里的对象实例，尽量不这样用，除非你要获取工具类里的方法或属性值，如this.xxx的值为1。如果没绑定this，这里直接就会报错，因为this是undefined
        console.log('this应用内部：',this)
        console.log('输入框3参数为：',...argument,this.name,this.xxx)
      },undefined,'timer3')(...args)
    },

  }
}
</script>
