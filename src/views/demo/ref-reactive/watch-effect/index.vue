<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 13:05:59
 * @Description: watchEffect
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch-effect/index.vue
-->
<template>
  <div class="content bcp-watch-effect">
    <h2>watchEffect</h2>
    <p>自动追踪回调内用到的所有响应式依赖，立即执行一次，依赖变化时重新执行。</p>
    <pre>{{ `import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 自动追踪 count 和 name，任意一个变化都重新执行
watchEffect(() => {
  console.log(count.value, name.value)  // 立即执行
})

// 清理副作用
watchEffect((onCleanup) => {
  const timer = setTimeout(() => { ... }, 1000)
  onCleanup(() => clearTimeout(timer))
})

// 停止监听
const stop = watchEffect(() => { ... })
stop()` }}</pre>

    <h3>清理副作用实例</h3>
    <p>下面实例中要求只保持一个按钮具有点击事件监听器，其他按钮没有。点击按钮依次切换绑定的按钮，每次切换时，会移除旧的监听器，绑定新的监听器。如果不移除旧的监听，会导致之前的按钮一直持有监听事件。</p>
    <p>特别说明第三个按钮是el-button组件，切换到它时会报错/无效。因为：</p>
    <p>如果是原生 DOM 元素：Vue 会把DOM 元素实例赋值给 targetRef.value，HTMLElement → 可以 addEventListener；</p>
    <p>如果是组件实例：Vue 会把组件实例赋值给 targetRef.value，组件实例上没有 addEventListener，直接el.addEventListener() 调用会导致报错，el.addEventListener && …… 这样会导致无效，但不会报错</p>
    
    <h4>实例</h4>
    <div class="box">
      <p>
        <el-button
          type="primary"
          @click="switchRef"
        >
          切换绑定的ref
        </el-button>
      </p>
      <p class="button-list">
        <button
          :ref="refNum % buttonNum === 1 ? 'targetRef' : null"
          :class="{'current':refNum % buttonNum === 1}"
        >
          按钮1
        </button>     
        <button
          :ref="refNum%buttonNum === 2 ? 'targetRef' : null"
          :class="{'current':refNum % buttonNum === 2}"
        >
          按钮2
        </button>
        <el-button
          :ref="refNum % buttonNum === 3 ? 'targetRef' : null"
          :class="{'current':refNum % buttonNum === 3}"
          type="primary"
        >
          按钮3
        </el-button>
        <el-button
          :ref="refNum % buttonNum === 0 ? 'targetRef' : null"
          :class="{'current':refNum % buttonNum === 0}"
          type="primary"
        >
          按钮4
        </el-button>
      </p>
    </div>
    
    <h4>不支持组件绑定的方案，会报错/无效</h4>
    <pre>
import { ref, watchEffect, useTemplateRef } from 'vue'

// const targetRef = ref(null)
const targetRef = useTemplateRef('targetRef')
const refNum = ref(1)
const buttonNum = 3

const switchRef = () => {
  refNum.value++
}

watchEffect( (onCleanup) => {
  const el = targetRef.value
  if (!el) return
  const handler = (e) => {
    console.log('点击按钮', e.target.innerHTML)
  }

  el.addEventListener && el.addEventListener('click', handler) // el-button组件没有addEventListener方法，直接调用会报错，el.addEventListener && …… 这样只会导致监听无效但不会报错

  onCleanup(() => {
    el.removeEventListener && el.removeEventListener('click', handler)
  })
})
</pre>

    <h4>支持组件绑定的方案</h4>
    <pre>
watchEffect( (onCleanup) => {
  let realEl = null
  const raw = targetRef.value

  // 判断：是组件实例 还是原生DOM
  if(raw?.$el) {
    realEl = raw.$el // 统一获取 组件（el-button等）的 真实 DOM 元素实例
  } else if(raw instanceof HTMLElement) {
    realEl = raw
  }
  
  if (!realEl) return

  const handler = (e) => {
    console.log('点击按钮', e.target.innerHTML)
  }

  realEl.addEventListener('click', handler)

  onCleanup(() => {
    realEl.removeEventListener('click', handler)
  })
})   
</pre>

    <h4>发生了什么：</h4>
    <div class="box">
      <p>targetRef变了 → effect 重新执行</p>  
      <p>上一次的 onCleanup先触发，旧 DOM 上的监听器被移除</p>
      <p>新的监听器绑到新 DOM 上</p>  
      <p>组件卸载时，watchEffect也会自动触发最后一次 cleanup，不会有内存泄漏。</p>
    </div>
      
    <h3>watch vs watchEffect</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>对比项</th>
          <th>watch</th>
          <th>watchEffect</th>
        </tr>
        <tr>
          <td>依赖声明</td>
          <td>显式，手动指定监听源</td>
          <td>自动追踪回调内的响应式引用</td>
        </tr>
        <tr>
          <td>立即执行</td>
          <td>否（需 immediate: true）</td>
          <td>✅ 始终立即执行</td>
        </tr>
        <tr>
          <td>获取旧值</td>
          <td>✅ (newVal, oldVal)</td>
          <td>❌ 无旧值</td>
        </tr>
        <tr>
          <td>精准控制</td>
          <td>✅ 只在指定源变化时触发</td>
          <td>❌ 依赖自动收集，可能意外追踪</td>
        </tr>
        <tr>
          <td>清理副作用</td>
          <td>✅ onCleanup</td>
          <td>✅ onCleanup</td>
        </tr>
        <tr>
          <td>停止监听</td>
          <td>✅ 返回 stop 函数</td>
          <td>✅ 返回 stop 函数</td>
        </tr>
        <tr>
          <td>适合场景</td>
          <td>需要旧值、精准控制触发时机</td>
          <td>副作用与多个响应式数据相关，不需要旧值</td>
        </tr>
      </tbody>
    </table>
    <pre>
Vue3 响应式侦听体系
├─ computed 计算属性
│  ├─ 本质：基于依赖的【缓存派生值】
│  ├─ 特点
│  │  ✅ 有返回值，可作为数据直接使用
│  │  ✅ 自动缓存，依赖不变不重新执行
│  │  ✅ 同步执行；禁止放入异步请求
│  │  ✅ 适合：数据转换、派生、过滤、拼接
│  │  ❌ 不能处理复杂副作用（请求、定时器、DOM操作）
│  └─ 使用场景
│     ├─ 根据现有数据算出新数据
│     └─ 模板中多次复用同一个计算结果
│
├─ watch 侦听器
│  ├─ 本质：手动指定依赖，依赖变化执行回调【副作用】
│  ├─ 特点
│  │  ✅ 可获取新值、旧值
│  │  ✅ 默认不立即执行，immediate:true开启初始化执行
│  │  ✅ 支持deep深度监听
│  │  ✅ 依赖手动声明，可控，不会意外收集依赖
│  │  ❌ 需要显式写明监听源，多个依赖书写繁琐
│  └─ 使用场景
│     ├─ 需要区分新旧值
│     ├─ 只想监听指定变量，避免多余触发
│     ├─ 复杂对象需要精细深度监听控制
│
└─ watchEffect 副作用侦听
   ├─ 本质：自动收集回调内所有响应式依赖，执行副作用
   ├─ 特点
   │  ✅ 初始化自动执行一次
   │  ✅ 无需手动声明依赖，多个依赖时代码简洁
   │  ✅ 内置 onCleanup 清理副作用（请求、定时器）
   │  ❌ 无法获取旧值
   │  ❌ 容易意外收集无关依赖，造成多余触发
   └─ 使用场景
      ├─ 多个响应式变量共同触发一段逻辑
      ├─ 异步接口请求、定时器、订阅事件
      ├─ 动态不确定数量的依赖
</pre>

    <h3>与 React useEffect 横向对比</h3>
    <pre>{{ `// React useEffect
import { useEffect, useState } from 'react'

const [count, setCount] = useState(0)

useEffect(() => {
  console.log('执行副作用', count)
  return () => {
    console.log('清理副作用')   // 组件卸载 或 依赖变化时执行
  }
}, [count])   // 依赖数组：空数组=只在 mount 执行，不传=每次渲染都执行` }}</pre>

    <table class="table">
      <tbody>
        <tr>
          <th>对比项</th>
          <th>Vue watch</th>
          <th>Vue watchEffect</th>
          <th>React useEffect</th>
        </tr>
        <tr>
          <td>依赖声明</td>
          <td>显式（监听源）</td>
          <td>自动追踪</td>
          <td>显式（依赖数组）</td>
        </tr>
        <tr>
          <td>立即执行</td>
          <td>否（需 immediate）</td>
          <td>✅ 是</td>
          <td>✅ 渲染后执行</td>
        </tr>
        <tr>
          <td>不传依赖时</td>
          <td>—</td>
          <td>自动追踪所有用到的响应式数据</td>
          <td>每次渲染都重新执行（易踩坑）</td>
        </tr>
        <tr>
          <td>依赖为空时</td>
          <td>—</td>
          <td>—</td>
          <td>[] 只在 mount 执行一次</td>
        </tr>
        <tr>
          <td>获取旧值</td>
          <td>✅ (newVal, oldVal)</td>
          <td>❌</td>
          <td>❌（需 useRef 存上一次值）</td>
        </tr>
        <tr>
          <td>清理副作用</td>
          <td>onCleanup 回调</td>
          <td>onCleanup 回调</td>
          <td>return 一个清理函数</td>
        </tr>
        <tr>
          <td>执行时机</td>
          <td>DOM 更新后（默认 post）</td>
          <td>DOM 更新后（默认 post）</td>
          <td>渲染提交到 DOM 后</td>
        </tr>
        <tr>
          <td>停止/卸载</td>
          <td>调用返回的 stop()</td>
          <td>调用返回的 stop()</td>
          <td>组件卸载时自动调用 return fn</td>
        </tr>
      </tbody>
    </table>

    <h4>关键差异总结</h4>
    <ul>
      <li><strong>watchEffect ≈ useEffect（无依赖数组）</strong>：两者都自动追踪，都立即执行，但 watchEffect 通过 Proxy 精确收集，useEffect 不传依赖则每次渲染都跑（危险）</li>
      <li><strong>watch ≈ useEffect（有依赖数组）</strong>：都是显式指定依赖，但 watch 默认不立即执行，useEffect 始终在首次渲染后执行</li>
      <li><strong>watch 独有</strong>：可以获取 oldVal，React 需要额外用 useRef 保存上一次的值才能实现</li>
      <li><strong>React 的坑</strong>：useEffect 不传依赖数组 → 每次渲染都执行，容易造成无限循环；Vue 的 watchEffect 不会有这个问题</li>
    </ul>
  </div>
</template>
<script setup>
import { ref, watchEffect, useTemplateRef } from 'vue'

// const targetRef = ref(null)
const targetRef = useTemplateRef('targetRef')
const refNum = ref(1)
const buttonNum = 4

const switchRef = () => {
  refNum.value++
}

watchEffect( (onCleanup) => {
  let realEl = null
  const raw = targetRef.value

  // 判断：是组件实例 还是原生DOM
  if(raw?.$el) {
    realEl = raw.$el // 统一获取 组件（el-button等）的 真实 DOM 元素实例
  } else if(raw instanceof HTMLElement) {
    realEl = raw
  }
  
  if (!realEl) return

  const handler = (e) => {
    console.log('点击按钮', e.target.innerHTML)
  }

  realEl.addEventListener('click', handler) /

  onCleanup(() => {
    realEl.removeEventListener('click', handler)
  })
})

</script>
<style lang="scss">
.bcp-watch-effect {
  .button-list {
    > button{
      height: 32px;
      border: 2px solid $color-9;

      + button {
      margin-left:12px;
     }

      &.current{
        cursor: pointer;
        border-color: $color-success;
      }
    }
  }
}
</style>
