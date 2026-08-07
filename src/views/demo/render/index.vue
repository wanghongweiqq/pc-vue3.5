<template>
  <div class="pg-width">
    <CpCrumbs />
    <div class="content">
      <h2>渲染流程</h2>
      <p>Render阶段最好不要称呼为渲染阶段（虽然有时候口语这样称呼），因为该阶段主要操作的是虚拟Dom，是在算UI，不是真正的浏览器渲染（Paint）。</p>
      <h3>React主要阶段</h3>
      <h4>Render：（render方法：生成React Element树 + Diff：生成 Fiber 树，可中断 ） → Commit ：DOM更新 → Paint：画到屏幕</h4>
      <p>说明</p>
      <p>1、React Element树：描述 UI 的普通 JS 对象，很轻。</p>
      <p>2、Fiber树：协调（reconciliation）阶段使用Fiber协调器根据 Element 生成的链表数据结构，可中断、可恢复、带优先级。</p>
      <table class="table">
        <tr>
          <th>✅ 属于 Render 阶段</th>
          <th>❌ 不属于 Render 阶段</th>
        </tr>
        <tr>
          <td>
            <p>函数组件本体</p>
            <p>useState（读取值）</p>
            <p>useMemo</p>
            <p>useCallback</p>
            <p>创建 JSX</p>
            <p>计算派生状态</p>
          </td>
          <td>
            <p>useEffect</p>
            <p>useLayoutEffect</p>
            <p>DOM 操作</p>
            <p>请求数据（虽然能写，但不推荐）</p>
            <p>setState（会触发新一轮 render）</p>
          </td>
        </tr>
      </table>

      <h3>Vue主要阶段</h3>
      <h4>Render：得到VNode → Patch：（Diff：找差异 + DOM更新） → Paint：画到屏幕</h4>
      <table class="table">
        <tr>
          <th>✅ 属于 Render 阶段</th>
          <th>❌ 不属于 Render 阶段</th>
        </tr>
        <tr>
          <td>
            <p>setup()</p>
            <p>render()</p>
            <p>computed</p>
            <p>template 编译结果</p>
            <p>创建 VNode</p>
            <p>Diff（部分）</p>
          </td>
          <td>
            <p>mounted</p>
            <p>updated</p>
            <p>DOM 操作</p>
            <p>watch 回调（本质是副作用）</p>
          </td>
        </tr>
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
③ 组件 Render ← 得到相应的虚拟Dom产物，俗称“算UI”
   ↓
  <em>flush: 'pre'（默认）</em> ← Diff: diff VDom, 得出“更新计划”。React项目和render合为一体称为Render，Vue和Dom更新何为一体称为Patch
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
