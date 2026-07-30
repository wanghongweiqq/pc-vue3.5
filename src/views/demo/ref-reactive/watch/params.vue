<template>
  <div class="content">
    <h2>watch</h2>
    <p>Vue 的 watch 函数用来监听响应式数据的变化并执行副作用。</p>

    <h3>参数说明</h3>
    <p>watch ( source, callback, options? )，三个参数分别是：监听谁 → 变了干嘛 → 怎么监听。</p>
    <pre>{{ `
// composition API 中使用 watch

const stop = watch( // 如果不需要手动清理监听，可以不用设置stop
  // 1-source，监听源：响应式数据、getter函数、props 属性、以上类型的数组等
  count, 

  // 2-callback，回调函数：(newValue, oldValue, onCleanup?) => void
  (newVal,oldVal,onCleanup) => { 
    console.log('watch-count', newVal, oldVal)
    if( 满足需要清理监听的条件 ){ stop() } // 手动清理监听
    const timer = setTimeout(() => { ... }, 1000) // 定义一个定时器
    onCleanup(() => clearTimeout(timer)) // 副作用清理函数：下一次 watch 回调执行之前，或者 watch 停止监听时（包括组件卸载）
  },

  // 3-options，配置对象
  { 
    immediate: true, // immediate-是否立即执行一次，默认，false
    deep: true, // deep-是否深度监听，默认：对象=true，数组=false
    flush: 'post', // flush-是否在组件更新后执行，默认：pre。 可选值：'pre'（组件更新前执行）、'post'（组件更新后执行）、sync（同步执行）
  }
)

// options API 中使用 watch

export default {
  data() { // 省略了:function，es6的方法简写
    return {
      count: 0
    }
  },
  // 需要访问组件实例（this）的地方别用箭头函数，其他地方随意。
  // 原因：箭头函数没有自己的 this，它的 this继承自外层作用域，而 Vue 在初始化 data/methods 时需要把data/methods中的函数绑定到组件实例上，箭头函数绕过了这个机制。
  // ❌ 错误写法，使用了箭头函数
  data: () => ({
    count: 0
  }),

  watch: {
    // 简写模式，实际是把回调函数-handler直接赋值给了监听源-count
    count(newVal, oldVal) {  // 省略了:function，es6的方法简写
      console.log(newVal, oldVal)
    },
    
    // 完整的配置对象模式
    obj: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      },
      deep: true,
      immediate: true,
      flush: 'pre' // vue2中没有flush配置选项
    }
  }
}
` }}</pre>

    <h3>监听源</h3>
    <h4>✅ 监听源 合法类型总结</h4>
    <table class="table">
      <tbody>
        <tr>
          <th width="150">
            类型
          </th>
          <th>示例</th>
        </tr>
        <tr>
          <td>ref</td>
          <td>const count = ref(0)</td>
        </tr>
        <tr>
          <td>reactive 对象</td>
          <td>const state = reactive({ a: 1 })</td>
        </tr>
        <tr>
          <td>getter 函数</td>
          <td>( ) => state.a，必须是返回响应式数据中的一个属性，如果只返回一个普通值，不能作为监听源，虽然不会报警告，但监听触发不到</td>
        </tr>
        <tr>
          <td>props 属性</td>
          <td> const props = defineProps( { user: any } )，父组件传过来的属性-user一般也是赋值的响应式数据。最好不要用非响应式数据，因为这样父组件首先需要借助其他响应式数据触发render渲染，其次父组件需要改变user的引用才能触发在子组件的监听和渲染</td>
        </tr>
        <tr>
          <td>以上类型的数组</td>
          <td>[ foo, bar, ( ) => x ]</td>
        </tr>
      </tbody>
    </table>

    <h4>❌ 监听源 非法类型总结</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>类型</th>
          <th>示例</th>
        </tr>
        <tr>
          <td>普通变量</td>
          <td>let x = 1</td>
        </tr>
        <tr>
          <td>解构出来的响应式属性</td>
          <td>const { name } = user，name已变为普通值，失去响应性</td>
        </tr>
        <tr>
          <td>非响应式对象</td>
          <td>普通 const reactiveObject = { a: 1 }</td>
        </tr>
        <tr>
          <td>undefined / null</td>
          <td>单独的undefined / null不可以，但如果是getter函数，返回的某个属性，其值为undefined / null，是可以的</td>
        </tr>
        <tr>
          <td>getter 函数的返回值本身不是响应式数据</td>
          <td> ( ) => 1</td>
        </tr>
      </tbody>
    </table>

    <h4>watch 常用写法</h4>
    <pre>{{ `import { ref, watch } from 'vue'

const count = ref(0)

// 基础用法
watch(count, (newVal, oldVal) => {
  console.log('变化了', newVal, oldVal)
})

// immediate：组件挂载时立即执行一次
watch(count, (newVal) => {
  console.log('立即执行', newVal)
}, { immediate: true })

// deep：深度监听对象内部变化
const obj = ref({ a: { b: 1 } })
watch(obj, (newVal) => {
  console.log('深层变化', newVal)
}, { deep: true })

// 监听 getter（推荐：精准到具体属性，避免 deep 的性能开销）
watch(() => obj.value.a.b, (newVal, oldVal) => {
  console.log('精准监听', newVal, oldVal)
})

// 监听多个源
watch([count, () => obj.value.a.b], ([newCount, newB], [oldCount, oldB]) => {
  console.log('多源', newCount, newB)
})

// 停止监听
const stop = watch(count, () => { ... })
stop() // 调用返回值即可停止

// 清理副作用（如取消定时器）
watch(count, (newVal, oldVal, onCleanup) => {
  const timer = setTimeout(() => { ... }, 1000)
  onCleanup(() => clearTimeout(timer))
})` }}</pre>

    <h4>watch 监听源的使用场景</h4> 
    <table class="table">
      <thead>
        <tr>
          <th width="100">
            属性值类型
          </th>
          <th>直接监听</th>
          <th>getter函数</th>
        </tr>
      </thead>
        
      <tbody>
        <tr>
          <td>
            <el-tooltip
              placement="bottom-start"
              content="根属性的名称，也就是定义响应式数据的变量名，一般使用const定义。特别说明ref声明的数据不要带.value，"
            >
              <div class="vertical-center">
                <span>根属性</span>
                <el-icon size="18">
                  <InfoFilled />
                </el-icon>
              </div>
            </el-tooltip>
          </td>
          <td>✅ 正常 </td>
          <td>❌ 无法监听</td>
        </tr>
        <tr>
          <td>子属性</td>
          <td>
            ❌ 异常
            <p>子属性使用链式结构都不能正常监听，根据数据类型的不同又分为以下情况：</p>
            <p>1、基本类型，完全无法触发监听，报警告。父级数据的监听可以捕获到它的改变</p>
            <p>[Vue warn]: Invalid watch source: 'vue'  <br>A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.</p>

            <p>2、引用类型，<code>{{ `x:{y:……}` }}</code>，部分场景触发监听。</p>
            <p>不改变其引用的修改能触发监听，其内部属性通过链式被修改，如：<code>{{ `x.y=……` }}</code>）。</p>
            <p>改变其引用的修改，监听不到，如：<code>{{ `reactive.x={y:……}` }}</code>。</p>
          </td>
          <td>✅ 正常监听，默认感知引用替换，感知不到内部属性变化。设置为deep=true时，即可感知内部属性变化。</td>
        </tr>
        <tr>
          <td>deep默认值</td>
          <td colspan="2">
            <p>proxy代理的响应式数据（包括reactive声明的对象及其子属性、ref的子属性），直接监听默认都是<em>deep=true</em>，其他情况：getter函数（用来获取子属性）、refImpl类创建的ref对象（根数据）默认都是<em>deep=false</em>。</p>  
            <p><em>建议：能精准到具体属性（推荐用 getter 精准监听到具体属性）就不要开 deep: true</em>，deep=true 会递归遍历对象所有层级，数据复杂时有性能开销。</p>
          </td>
        </tr>
      </tbody>
    </table>
    <h3>ref 对象 vs reactive 对象的 deep 差异</h3>
    <p>用 ref 还是 reactive 定义对象，watch 的 deep 默认行为<em>完全不同</em>，是常见踩坑点。</p>

    <h4>ref 定义的对象 —— deep 默认 false</h4>
    <pre>{{ `const obj = ref({ a: { b: 1 } })

watch(obj, (newVal) => { console.log('watch-ref-obj') })

obj.value.a.b = 2          // ❌ 不触发，deep 默认 false
obj.value = { a: { b: 2 } } // ✅ 触发监听，整体替换

// 需要监听内部变化时手动加 deep: true
watch(obj, (newVal) => { console.log('watch-ref-obj') }, { deep: true })
obj.value.a.b = 2  // ✅ 触发监听` }}</pre>

    <h4>reactive 定义的对象 —— deep 默认 true</h4>
    <pre>{{ `const obj = reactive({ a: { b: 1 } })
watch(obj, (newVal) => { console.log('watch-reactive-obj') })
obj.a.b = 2   // ✅ 默认：deep=true，自动触发。设为 false 不触发，因为false时只有改变obj的子属性-a 的引用地址时才出发
obj.a = { b:2 }   // ✅ deep=false 时触发监听
` }}</pre>

    <h4>对比</h4>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>ref({})</th>
          <th>reactive({})</th>
        </tr>
        <tr>
          <td>watch deep 默认值</td>
          <td>false</td>
          <td>强制 true，可以关闭设置：deep:false</td>
        </tr>
        <tr>
          <td>不加 deep 的触发条件</td>
          <td>整体替换 .value</td>
          <td>任意层级属性变化</td>
        </tr>
        <tr>
          <td>推荐监听方式</td>
          <td>watch(() => obj.value.a.b, cb) 精准到属性</td>
          <td>watch(() => obj.a.b, cb) 精准到属性</td>
        </tr>
      </tbody>
    </table>

    <h3>flush 选项</h3>
    <p>flush 控制 watch 回调在 DOM 更新周期中的执行时机，有三个值：</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="80">
            值
          </th>
          <th>执行时机</th>
          <th>能否拿到更新后的 DOM</th>
          <th>适用场景</th>
        </tr>
        <tr>
          <td>pre</td>
          <td>默认值，DOM 更新<em>之前</em></td>
          <td>❌ 拿不到</td>
          <td>需要在渲染前修改状态、取消即将发出的请求</td>
        </tr>
        <tr>
          <td>post</td>
          <td>DOM 更新<em>之后</em></td>
          <td>✅ 能拿到</td>
          <td>需要操作更新后的 DOM（如获取尺寸、滚动位置）</td>
        </tr>
        <tr>
          <td>sync</td>
          <td>响应式数据变化时<em>立即同步</em>执。性能开销大，慎用</td>
          <td>❌ 拿不到（DOM 还没开始更新）</td>
          <td>极少使用，需严格保证在 DOM 变更前同步响应</td>
        </tr>
      </tbody>
    </table>
    <pre>{{ `const count = ref(0)

// 默认 flush: 'post'，DOM 更新后执行
watch(count, () => {
  console.log('DOM 已更新', document.querySelector('.count').textContent)
})

// flush: 'pre'，DOM 更新前执行
watch(count, () => {
  console.log('DOM 还没更新')
}, { flush: 'pre' })

// flush: 'sync'，立即同步执行
watch(count, () => {
  console.log('数据刚变，DOM 还没动')
}, { flush: 'sync' })` }}</pre>
    <p>执行顺序：sync → 组件渲染 → pre → DOM 更新 → post。</p>
    <p>在vue3中才有flush配置项（composition API和options API都有），vue2中没有flush选项。</p>

    <h3>实战建议</h3>
    <p>1、尽量监听具体字段（使用getter函数），别动不动 deep: true</p>
    <p>2、props 一定要用 getter 形式监听</p>
    <p>3、watch 里有异步请求时，记得做竞态处理-onCleanup（取消上一次请求）</p>
    <p>4、watch 异步定义时，组件卸载时不会自动清理副作用，需要手动调用 stop 函数清理</p>
    <p>5、能用 computed 就别用 watch（computed 是声明式的）</p>
  </div>
</template>
