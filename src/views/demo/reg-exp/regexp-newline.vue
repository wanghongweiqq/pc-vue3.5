<template>
  <div class="content">
    <h2 id="dot">
      换行操作
    </h2>
    <h3>1、br换行</h3>
    <h4>1.1、直接html书写，特殊：\n不换行当做普通字符串处理</h4>
    <p>hello word!\n<br>love you!</p>
    <h4>1.2、v-html，特殊：\n会被自动清除掉</h4>
    <!-- eslint-disable-next-line vue/no-v-html --><!-- 内容已由 safeWhiteSpaceHtml 白名单过滤，仅允许 <br>，非用户输入 -->
    <p v-html="safeWhiteSpaceHtml" />
    <p>v-html容易导致XSS攻击，只有在可信内容上使用它，永远不要用在用户提交的内容上</p>

    <h3>2、\n换行</h3>
    <h4>2.1、设置样式：white-space: pre-wrap</h4>
    <p class="pre-wrap">
      {{ whiteSpaceString }}
    </p>
    <h4>2.2、使用标签：pre</h4>
    <pre class="no-style">{{ whiteSpaceString }}
` }}</pre>

    <h3>把br使用replace换成\n</h3>
    <p class="pre-wrap">
      {{ whiteSpaceString.replace(/<br>/g,'\n') }}
    </p>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const whiteSpaceString = 'hello word!\n<br>love you!'
const whiteSpaceString2 = 'hello word!<br />love you!'

// 仅放行 <br> 标签，防止 v-html XSS
const safeWhiteSpaceHtml = computed(() =>
  whiteSpaceString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br&gt;/gi, '<br>')
)
</script>
