<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/http/http-cors.vue
-->
<template>
  <div class="content">
    <h2>跨域（CORS）</h2>
    <p>浏览器同源策略：协议 + 域名 + 端口三者一致才算同源，跨域请求会被浏览器拦截。</p>
    <pre>{{ `
同源：https://a.com → https://a.com/api       ✅
跨域：https://a.com → https://b.com/api       ❌ 域名不同
跨域：https://a.com → http://a.com/api        ❌ 协议不同
跨域：https://a.com → https://a.com:8080/api  ❌ 端口不同

` }}</pre>

    <table class="table">
      <tbody>
        <tr>
          <th>类型</th>
          <th>触发条件</th>
          <th>流程</th>
        </tr>
        <tr>
          <td>简单请求</td>
          <td>GET/POST + 普通 Content-Type</td>
          <td>直接发请求，服务端响应 Access-Control-Allow-Origin 即可</td>
        </tr>
        <tr>
          <td>预检请求</td>
          <td>PUT/DELETE / 自定义请求头 / JSON body</td>
          <td>先发 OPTIONS 预检，服务端确认后再发真实请求</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
</script>
