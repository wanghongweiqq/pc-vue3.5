<template>
  <div class="content">
    <h2>缓存控制</h2>
    <table class="table">
      <tbody>
        <tr>
          <th>响应头</th>
          <th>值</th>
          <th>含义</th>
        </tr>
        <tr>
          <td><code>Cache-Control</code></td>
          <td><code>no-store</code></td>
          <td>完全不缓存，每次重新请求（最彻底）</td>
        </tr>
        <tr>
          <td><code>Cache-Control</code></td>
          <td><code>no-cache</code></td>
          <td>可存储但每次必须向服务端验证是否过期</td>
        </tr>
        <tr>
          <td><code>Cache-Control</code></td>
          <td><code>max-age=3600</code></td>
          <td>缓存 3600 秒内直接使用，不请求服务端</td>
        </tr>
        <tr>
          <td><code>ETag</code></td>
          <td><code>"abc123"</code></td>
          <td>资源指纹，配合 If-None-Match 做协商缓存</td>
        </tr>
        <tr>
          <td><code>Last-Modified</code></td>
          <td>时间戳</td>
          <td>最后修改时间，配合 If-Modified-Since 做协商缓存</td>
        </tr>
      </tbody>
    </table>
    <pre>{{ `
强缓存（不请求服务端）：
  Cache-Control: max-age=3600
  → 3600 秒内直接读本地，状态码显示 200（from cache）

协商缓存（请求服务端验证）：
  请求头：If-None-Match: "abc123"
  服务端：资源未变 → 304 Not Modified（不返回 body）
          资源已变 → 200 OK + 新资源
` }}</pre>
  </div>
</template>
<script setup>
</script>
