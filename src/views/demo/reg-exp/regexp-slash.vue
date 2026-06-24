<template>
  <div class="content">
    <h2>反斜杠匹配</h2>
    <p>字符串中没有\字符，因为在字符串文字中使用它时会启动转义序列。数据中如果只有1个反斜杠将无法显示也无法用正则匹配到</p>
    <p>利用数据渲染dom（或console.log）时，反斜杠需要被转义，两个反斜杠输出/显示为一个，奇数个不被渲染，直接被忽略掉</p>
    <p>数据只有奇数个反斜杠（不含其他字符）会报错</p>
    <p>{{ slashString }}</p>
  </div>
</template>
<script setup>
 
const slashString = '数据中4个\\\\，显示为2个，数据中5个\\\\\，显示为2个，建议是偶数个，否则会有eslint的警告'
</script>
