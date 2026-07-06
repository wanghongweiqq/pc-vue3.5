<template>
  <div class="content">
    <h2>DOM ref</h2>
    <p>
      DOM ref：
      <span
        id="dom-ref-count"
        ref="counterDisplay"
      >
        <em style="visibility: hidden;">visibility-hidden文本</em>
        <span>{{ count }}</span>
        <em style="display: none;">display-none文本</em>
      </span>
    </p>
    <el-button
      size="small"
      type="primary"
      @click="domRefFunc"
    >
      通过dom的ref改变dom的内容
    </el-button>
    <h3><code>innerHTML</code> / <code>textContent</code> / <code>innerText</code> 的区别</h3>
    <p>
      点击上方按钮后打开控制台，观察三者对 <em>id="dom-ref-count"</em> 元素的输出差异。<br>
      ⚠️ <em>task1 必须在当前 Tab 激活后才能调用</em>，否则 <code>innerText</code> 会退化为 <code>textContent</code> 的行为。<br>
      原因：<code>innerText</code> 依赖浏览器 reflow（重排）来感知 CSS 可见性，
      而非激活的 <code>el-tab-pane</code> 被 Element Plus 以 <code>display: none</code> 隐藏，
      浏览器不对其进行布局计算，导致 <code>innerText</code> 无法区分隐藏文本，退化成与 <code>textContent</code> 相同的输出。<br>
      解决方案：父组件监听 <code>el-tabs</code> 的 <code>@tab-change</code> 事件，
      切换到本 Tab 时通过 <code>ref</code> 调用子组件暴露的 <code>runTask1</code> 方法，
      此时面板已可见，<code>innerText</code> 可正确感知样式。
    </p>

    <table class="table">
      <tbody>
        <tr>
          <th width="140" />
          <th>innerHTML</th>
          <th>textContent</th>
          <th>innerText</th>
        </tr>
        <tr>
          <td>返回内容</td>
          <td>含 HTML 标签的字符串</td>
          <td>纯文本，去掉所有标签</td>
          <td>可见纯文本，去掉所有标签</td>
        </tr>
        <tr>
          <td>visibility: hidden</td>
          <td>✅ 包含</td>
          <td>✅ 包含</td>
          <td>❌ 不包含</td>
        </tr>
        <tr>
          <td>display: none</td>
          <td>✅ 包含</td>
          <td>✅ 包含</td>
          <td>❌ 不包含</td>
        </tr>
        <tr>
          <td>感知 CSS 样式</td>
          <td>❌ 不感知</td>
          <td>❌ 不感知</td>
          <td>✅ 感知，只返回渲染可见文本</td>
        </tr>
        <tr>
          <td>性能</td>
          <td>较慢（解析 HTML）</td>
          <td>⚡ 最快</td>
          <td>较慢（触发 reflow 计算布局）</td>
        </tr>
        <tr>
          <td>写入安全性</td>
          <td>⚠️ 有 XSS 风险</td>
          <td>✅ 安全，内容作纯文本处理</td>
          <td>✅ 安全，内容作纯文本处理</td>
        </tr>
        <tr>
          <td>典型场景</td>
          <td>读取/写入带标签的 HTML 片段</td>
          <td>只关心文本内容，不需要感知样式</td>
          <td>模拟用户视角的可见文本（如复制内容）</td>
        </tr>
      </tbody>
    </table>

     <pre>{{ `const el = document.getElementById('dom-ref-count')

el.innerHTML    // → 'count：&lt;em style="visibility: hidden;"&gt;visibility-hidden文本&lt;/em&gt;&lt;span&gt;0&lt;/span&gt;&lt;em style="display: none;"&gt;display-none文本&lt;/em&gt;'
el.textContent  // → 'count：visibility-hidden文本0display-none文本'
el.innerText    // → 'count：0'` }}</pre>
  </div>
</template>

<script setup>
/* global defineExpose */
import { ref, nextTick, onMounted, onBeforeMount } from 'vue'

const count = ref(0)
const counterDisplay = ref(null) // ref(null) 创建一个响应式引用变量；选项式/Options API 示例: this.$refs.counterDisplay

const domRefFunc = async () => {
  count.value++
  console.log('domRefFunc-count.value', count.value)
  if (counterDisplay.value) {
    console.log('count改变后，立即获取dom结构中的数据，此时数据还未更新')
    console.log(counterDisplay.value)
    console.log(counterDisplay.value.innerHTML)
  }
  await nextTick()
  console.log('count改变后，nextTick后获取dom结构中的数据，此时数据已更新')
  console.log('ref实例:',counterDisplay)
  console.log('ref实例value:',counterDisplay.value)
  console.log('ref实例innerHTML:',counterDisplay.value.innerHTML)
  console.log('ref实例textContent:',counterDisplay.value.textContent)
  console.log('ref实例innerText:',counterDisplay.value.innerText)
  console.log('ref实例id:',counterDisplay.value.id)
  console.log('ref实例ref:',counterDisplay.value.ref)
}

const task1 = () => {
  console.log('Tab(DOM ref)初始化时获取dom中某id的innerHTML、textContent、innerText ')
  // innerHTML、textContent、innerText 对隐藏元素的行为对比
  console.log(document.getElementById('dom-ref-count').innerHTML) // 包含标签和隐藏文本
  console.log(document.getElementById('dom-ref-count').textContent) // 包含隐藏文本，无标签
  console.log(document.getElementById('dom-ref-count').innerText) // 不含 CSS 隐藏文本
}

// ❌ 不在 onMounted 中调用 task1：
// 此时组件所在的 el-tab-pane 尚未激活，被 Element Plus 以 display:none 隐藏，
// 浏览器不对其进行 reflow 布局，innerText 无法感知 CSS 可见性，
// 会退化为和 textContent 完全相同的输出，无法体现两者差异。
onMounted(() => {
  // task1() // ← 故意不在此调用，原因见上方注释
})

// ✅ 通过 defineExpose 将 task1 以 runTask1 的名称暴露给父组件。
// 父组件在 el-tabs 的 @tab-change 事件中，检测到切换至 'dom-ref' Tab 时，
// 通过 ref 拿到本组件实例并调用 runTask1()。
// 此时 el-tab-pane 已切换为可见（display 恢复正常），
// innerText 能正确触发 reflow，只返回视觉可见的文本，与 textContent 产生明显差异。
defineExpose({
  runTask1: task1,
})
</script>
