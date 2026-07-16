<template>
  <div class="pg-width">
    <CpCrumbs />
    <div class="content">
      <h2>DOM 宽度获取方式对比</h2>
      <p>
        <strong>记忆口诀：</strong>client 看可见内容，offset 看占地，scroll 看全部，rect 管变形
      </p>

      <h3>一、示例&区分</h3>
      <p>默认盒模型：box-sizing:content-box，宽度都不包含外边距（margin）</p>
      <div
        ref="demoBox"
        class="demo-box"
        style="color:red"
        :class="{'transformed': hasTransform}"
      >
        父元素：width=500; padding-right=10; border=10; margin-right=10
        <p>子元素1：width未设置</p>
        <p>子元素2：width=800</p>
      </div>
      <p>
        <el-button
          type="primary"
          @click="toggleTransform"
        >
          {{ hasTransform ? '移除' : '添加' }} transform: scale(0.8)
        </el-button>
      </p>
      <table class="table">
        <tbody>
          <tr>
            <th>属性</th>
            <th>释义</th>
            <th>详细说明</th>
            <th>典型用途</th>
          </tr>
          <tr>
            <th width="150">
              clientWidth
            </th>
            <td>可视区大小</td>
            <td>
              <p><em>{{ measurements.clientWidth }}px</em></p>
              <p>width + padding - 滚动条宽度(如果有的话) = 可见内容区的宽度(width - 滚动条宽度) + padding</p>
            </td>
            <td>可视区域大小<br>响应式计算</td>
          </tr>
          <tr>
            <th>offsetWidth</th>
            <td>占位区大小</td>
            <td>
              <p><em>{{ measurements.offsetWidth }}px</em></p>
              <p>width + padding + border = 内容区的宽度 + padding + 滚动条宽度(如果有的话) + border</p>
            </td>
            <td>布局计算<br>获取元素“真实占地”</td>
          </tr>
          <tr>
            <th>scrollWidth</th>
            <td>
              <p>真实区/实际内容区大小</p>
              <p>包括当前不可见、被滚动隐藏的部分</p>
            </td>
            <td>
              <p><em>{{ measurements.scrollWidth }}px</em></p>
              <p><strong>1、有子元素宽度超出父元素</strong></p>
              <p>1.1、overflow : hidden(溢出内容被裁剪，不可见) / auto  = 最长子元素的宽度 + padding</p>
              <p>1.2、overflow : visible(默认值-default) = 最长子元素的宽度</p>
              <p><strong>2、无子元素宽度超出父元素</strong></p>
              <p>=clientWidth</p>
            </td>
            <td>
              <p>判断是否溢出：scrollWidth > clientWidth</p>
              <p>判断是否滚动到底部：scrollHeight - scrollTop &lt;= clientHeight</p>
            </td>
          </tr>
          <tr>
            <th>getBoundingClientRect().width</th>
            <td>
              <p>含 transform 缩放的精确宽度</p>
            </td>
            <td>
              <p><em>{{ measurements.rectWidth }}px</em></p>       
            </td>
            <td>精准布局、动画</td>
          </tr>
        </tbody>
      </table>
      <h3>二、flush(watch、watchEffect)、useEffect、uesLseLayoutEffect 时序图</h3>
      <pre>// Vue -> wacth / watchEffect -> flush - 可选配置项:执行时机。执行顺序：sync → 组件渲染 → pre → DOM 更新 → post
// flush:'sync'会绕过 Vue 的异步批处理机制，导致每次状态变更都立即执行回调，可能引发重复渲染、级联更新和主线程阻塞，因此在业务代码中应慎用。
// React -> useLayoutEffect / useEffect
① 响应式数据变化：(Vue:ref/reactive) (React:setState/useState)
   ↓
② Vue/React 调度器介入
   ↓
  <em>flush: 'sync'</em> ← 同步立即执行，破坏批处理机制，慎用
   ↓
③ 组件 Render ← 虚拟 DOM Diff
   ↓
  <em>flush: 'pre'（默认）</em> ← DOM 更新前执行
   ↓
④ 真实 DOM 更新 ← 渲染Layout（此时已可以确定DOM相关样式，如width、height等）
   ↓
  <em>flush: 'post' / useLayoutEffect</em> ← DOM 更新后、Paint 执行前
   ↓
  <em>nextTick 回调</em>
   ↓
⑤ 浏览器 Paint ← 只是画出来
   ↓
  <em>useEffect</em> ← Paint 执行后
   ↓
⑥ 用户可见</pre>
      <h4>注意事项</h4>
      <p>在组件内watch等监听不需要手动清除，如果回调内有副作用，需要手动设置 onCleanup 回调（vue自己自动触发），用于在组件销毁时清除监听、重复触发时只执行一次监听，避免内存泄漏问题。onCleanup的执行时机（vue已经封装好了，不用手动触发）：1、在watch监听的数据变化时调用，先执行清理onCleanup再执行watch回调，2、在组件销毁时调用</p>
      <p>尽量使用 ref 来获取元素，而不是 document.querySelector 等方法，因为 document.querySelector 会每次调用时都重新查询 DOM，导致性能问题，而且不存在时（如组件被销毁了，或元素被移除了）会报错，而 ref 则不会报错，只是返回 null</p>
   
      <h3>Vue nextTick 调用形式：</h3>
      <pre>1、回调的形式: 
const xxxFunc = () => { 
  修改响应式数据;
  nextTick(() => {
    // 同步代码 
  }) 
  // nextTick也返回 Promise，所以也可以用 .then()链式调用，效果和传回调一样
  nextTick().then(() => {
    // 同步代码
  }); 
}
2、async / await 形式
async function xxx() { 
 修改响应式数据; 
 await nextTick(); 
 //同步代码 
}</pre>

      <h3>React flushSync 使用示例</h3>
      <p>flushSync（强制同步刷新）来自 react-dom，作用是强制同步刷新，确保在方法执行完之前，组件的DOM已经更新。</p>
      <pre>import { flushSync } from 'react-dom'

const xxxFunc = () => {
  flushSync(() => {
    setCount(prev => prev + 1)
    // setCount(cont + 1)
    // flushSync方法内也是不能获取到最新的值的，需要在方法执行完之后才能获取到最新值，类似于vue的await nextTick()，nextTick是把异步操作放到其上方，带渲染完后再执行下面的逻辑
  })
  //同步代码 
}</pre>
    </div>
  </div>
</template>

<script setup>
import CpCrumbs from '@/components/crumbs/'
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const demoBox = ref(null)
const hasTransform = ref(false)

const measurements = ref({
  clientWidth: 0,
  offsetWidth: 0,
  scrollWidth: 0,
  rectWidth: 0,
})

const measureWidth = () => {
  // 尽量使用 ref 来获取元素，而不是 document.querySelector 等方法，
  // const domEl=document.querySelector('.demo-box')
  // domEl.style.backgroundColor = '#fff'
  console.log('measureWidth-begin',demoBox, demoBox.value)
  if (!demoBox.value) return

  const el = demoBox.value
  measurements.value = {
    clientWidth: el.clientWidth,
    offsetWidth: el.offsetWidth,
    scrollWidth: el.scrollWidth,
    rectWidth: el.getBoundingClientRect().width,
  }
  console.log('measureWidth-end', measurements.value)
}

const toggleTransform = () => {
  hasTransform.value = !hasTransform.value
}

watch(
  [hasTransform], 
  // 更常用
  (_,__,onCleanup) => { // _ 被各种校验规则如eslint设置为了忽略，所以不会发出仅定义未使用的警告
  // 更优雅
  // (...args) => {
  // const onCleanup = args[2] 
  
    demoBox.value.style.transition = 'transform 0.4s ease-in-out 0s'
    // demoBox.value.style.cssText = 'transition: transform 0.4s ease-in-out 0s' // 会覆盖原来声明的内联样式表-style
    // demoBox.value.style.cssText += 'transition: transform 0.4s ease-in-out 0s' // 更合理，style原有样式会保留
    const timer = setTimeout(measureWidth, 500) // 因为设置了0.4秒的transition，所以需要等0.4秒后再测量，nextTick和flush=post等都不可以，因为他们只是将执行时机放到了渲染后，而不是等待transition完成
    // measureWidth()
    // nextTick(() => {
    //   measureWidth()
    // })
    // 清理副作用，不清理的话，在定时任务的时间内，当前组件如果被销毁了(如跳转到其他页面)，定时任务会继续执行，导致内存泄漏，定时任务内的某些逻辑还可能导致页面直接报错，如：document.querySelector('.demo-box').style 就会报错：Uncaught TypeError: Cannot read properties of null (reading 'style')
    // onCleanup的执行时机（vue已经封装好了，不用手动触发）：1、在watch回调中调用时，先执行清理再执行watch回调，2、在组件销毁时调用
    onCleanup(() => {
      clearTimeout(timer)
    })
  },
  { flush: 'pre' } // flush-执行时机。选项：pre/post/sync,DOM 更新前、更新后，还是同步执行。默认：pre
)

// 如果没有设置动画过度时间transition，那么在transform变化后，立即测量宽度，不会等待transition完成
// watch(
//   hasTransform, 
//   () => { measureWidth() },// 设置可以精简为 measureWidth,注意其参数的影响，默认会带：新、旧、清三个参数
//   { flush: 'post' } // DOM 更新后执行，能拿到最新的后的宽度
// )

onMounted(() => {
  measureWidth()
  window.addEventListener('resize', measureWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureWidth)
})
</script>

<style scoped lang="scss">
.demo-box {
	width:500px;
  height:200px;
  padding-right:10px; 
  margin:5px 10px 5px 0; 
  overflow: auto; 
  // overflow: hidden; 
  // overflow: visible; 
  border:10px solid #666;
  transform-origin: left top;
  // transition: transform 0.4s ease-in-out 0s;

	p{
		height:100px; 
    padding:0;

		&:first-child{
      background-color: orange;
		}

		&:last-child{
		 width:800px; 
     height:100px; 
     background-color: pink;
		}
	}

  &.transformed {
    transform: scale(0.8);
  }
}

</style>
