<template>
  <div class="content">
    <h1>$nextTick 与 Vue DOM 异步更新</h1>
    <p>Vue 的 DOM 更新是<em>异步</em>的，修改响应式数据后，DOM 不会立即刷新，而是将更新加入队列，在当前同步任务结束后统一执行。</p>

    <h2>问题演示</h2>
    <p>点击按钮修改 msg 后，同步读取 DOM 拿到的仍是旧值：</p>
    <div ref="msgDiv">
      {{ msg }}
    </div>
    <p v-if="msg1">
      msg1（同步读 DOM）：{{ msg1 }}
    </p>
    <p v-if="msg2">
      msg2（$nextTick 回调内读 DOM）：{{ msg2 }}
    </p>
    <p v-if="msg3">
      msg3（await $nextTick 后读 DOM）：{{ msg3 }}
    </p>
    <p v-if="msg4">
      msg4（直接用数据，不读 DOM）：{{ msg4 }}
    </p>
    <el-button
      size="small"
      type="primary"
      @click="changeMsg"
    >
      Change the Message
    </el-button>

    <h2>三种同步获取最新值的方案</h2>

    <h3>方案一：await this.$nextTick()（推荐）</h3>

    <h4>写法 A：await $nextTick</h4>
    <p>将方法改为 async，await 等 DOM 刷新完再读，写法和同步一样：</p>
     <pre>{{ `async demo1Change () {
  this.demo1Msg = '2'
  await this.$nextTick()                           // 等 DOM 更新完成
  this.demo1Result = this.$refs.demo1Div.innerHTML // ✅ 拿到新值
}` }}</pre>
    <div ref="demo1Div">
      {{ demo1Msg }}
    </div>
    <p v-if="demo1Result !== null">
      读到的值：<strong>{{ demo1Result }}</strong>
    </p>
    <el-button
      size="small"
      type="primary"
      @click="demo1Change"
    >
      点击测试
    </el-button>

    <h4>写法 B：$nextTick 回调</h4>
    <p>在回调函数里执行，DOM 更新后自动触发：</p>
     <pre>{{ `demo1bChange () {
  this.demo1bMsg = '2'
  this.$nextTick(() => {
    this.demo1bResult = this.$refs.demo1bDiv.innerHTML // ✅ 拿到新值
  })
}` }}</pre>
    <div ref="demo1bDiv">
      {{ demo1bMsg }}
    </div>
    <p v-if="demo1bResult !== null">
      读到的值：<strong>{{ demo1bResult }}</strong>
    </p>
    <el-button
      size="small"
      type="primary"
      @click="demo1bChange"
    >
      点击测试
    </el-button>

    <h3>方案二：flushSync —— 这是 React 的 API，Vue 没有</h3>
    <p><code>flushSync</code> 是 <strong>React</strong> 的概念，用于强制同步刷新 React 的状态更新队列。Vue 从未将其作为公开 API 导出，任何版本均不支持 <code>import { flushSync } from 'vue'</code>。</p>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>React</th>
          <th>Vue</th>
        </tr>
        <tr>
          <td>强制同步刷新</td>
          <td><code>flushSync(() => { setState(...) })</code></td>
          <td>❌ 无等价公开 API</td>
        </tr>
        <tr>
          <td>等待 DOM 更新</td>
          <td>无（React 不直接操作 DOM）</td>
          <td><code>await nextTick()</code></td>
        </tr>
        <tr>
          <td>获取更新后 DOM 值</td>
          <td>通常用 ref + useEffect</td>
          <td><code>await this.$nextTick()</code> 后读 ref</td>
        </tr>
      </tbody>
    </table>
    <p>Vue 的设计理念是通过 <code>nextTick</code> 等待异步更新，而不是强制同步刷新。需要"同步"拿到新值时，直接读响应式数据即可，无需依赖 DOM。</p>

    <h3>方案三：直接用数据（最简单）</h3>
    <p>如果目的只是展示新值，完全不需要读 DOM：</p>
     <pre>{{ `demo3Change () {
  this.demo3Msg = '2'
  this.demo3Result = this.demo3Msg  // ✅ 直接拿数据，不依赖 DOM
}` }}</pre>
    <div>{{ demo3Msg }}</div>
    <p v-if="demo3Result !== null">
      读到的值：<strong>{{ demo3Result }}</strong>
    </p>
    <el-button
      size="small"
      type="primary"
      @click="demo3Change"
    >
      点击测试
    </el-button>

    <h2>方案对比</h2>
    <table class="table">
      <tbody>
        <tr>
          <th>方案</th>
          <th>是否依赖 DOM</th>
          <th>是否真同步</th>
          <th>适用场景</th>
        </tr>
        <tr>
          <td><code>await this.$nextTick()</code></td>
          <td>✅ 读 DOM</td>
          <td>否（async/await 写法）</td>
          <td>需要读 DOM 新值，<strong>推荐</strong></td>
        </tr>
        <tr>
          <td><code>this.$nextTick(callback)</code></td>
          <td>✅ 读 DOM</td>
          <td>否（回调写法）</td>
          <td>需要读 DOM 新值，不想用 async</td>
        </tr>
        <tr>
          <td>直接用响应式数据</td>
          <td>❌ 不读 DOM</td>
          <td>✅ 是</td>
          <td>只展示数据值，最简洁，<strong>优先考虑</strong></td>
        </tr>
        <tr>
          <td><code>flushSync</code>（React）</td>
          <td>✅ 读 DOM</td>
          <td>✅ 是</td>
          <td>Vue 无此 API，仅 React 可用</td>
        </tr>
      </tbody>
    </table>
    <p>大多数场景直接用响应式数据即可，只有真正需要读取 DOM 内容时才使用 <code>$nextTick</code>。</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: '1',
      msg1: '',
      msg2: '',
      msg3: '',
      msg4: '',
      demo1Msg: '1',
      demo1Result: null,
      demo1bMsg: '1',
      demo1bResult: null,
      demo3Msg: '1',
      demo3Result: null,
    }
  },
  methods: {
    async changeMsg () {
      this.msg = '2'
      this.msg1 = this.$refs.msgDiv.innerHTML         // 同步读 DOM → 旧值
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML       // $nextTick 回调 → 新值
      })
      await this.$nextTick()
      this.msg3 = this.$refs.msgDiv.innerHTML         // await $nextTick → 新值
      this.msg4 = this.msg                            // 直接用数据 → 新值
    },
    async demo1Change () {
      this.demo1Msg = '2'
      await this.$nextTick()
      this.demo1Result = this.$refs.demo1Div.innerHTML
    },
    demo1bChange () {
      this.demo1bMsg = '2'
      this.$nextTick(() => {
        this.demo1bResult = this.$refs.demo1bDiv.innerHTML
      })
    },
    demo3Change () {
      this.demo3Msg = '2'
      this.demo3Result = this.demo3Msg
    },
  },
}
</script>
