<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/http/http-base.vue
-->
<template>
  <div class="content">
    <h2>HTTP 基础</h2>
    <p>HTTP（HyperText Transfer Protocol，超文本传输协议）是 Web 的基础通信协议，定义了客户端与服务端之间<em>如何请求和传输数据</em>。基于 TCP/IP，属于应用层协议。</p>

    <h3>一、HTTP vs HTTPS</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>比较点</th>
          <th>HTTP</th>
          <th>HTTPS</th>
        </tr>
        <tr>
          <td>传输方式</td>
          <td>明文</td>
          <td>TLS/SSL 加密</td>
        </tr>
        <tr>
          <td>默认端口</td>
          <td>80</td>
          <td>443</td>
        </tr>
        <tr>
          <td>安全性</td>
          <td>❌ 可被中间人窃听/篡改</td>
          <td>✅ 加密 + 身份验证</td>
        </tr>
        <tr>
          <td>SEO</td>
          <td>权重低</td>
          <td>Google 优先收录</td>
        </tr>
        <tr>
          <td>性能</td>
          <td>略快（无握手开销）</td>
          <td>TLS 握手有额外开销，HTTP/2 下差距可忽略</td>
        </tr>
      </tbody>
    </table>

    <h3>二、URL 结构</h3>
    <pre>{{ `
https://api.example.com:8080/user/list?page=1&size=10#section

  URL 组成
  ─────────────────────────────────────────────────────────
  https            ← 协议（scheme）
  api              ← 子域名
  example.com      ← 域名
  :8080            ← 端口（默认 80/443 可省略）
  /user/list       ← 路径（path）
  ?page=1&size=10  ← 查询参数（query string）
  #section         ← 锚点（fragment，不会发送到服务端）

  location 字段映射
  ─────────────────────────────────────────────────────────────────────────────────────
  location.href      →  "https://api.example.com:8080/user/list?page=1&size=10#section"
  location.protocol  →  "https:"
  location.hostname  →  "api.example.com"
  location.host      →  "api.example.com:8080"
  location.origin    →  "https://api.example.com:8080"
  location.port      →  "8080"
  location.pathname  →  "/user/list"
  location.search    →  "?page=1&size=10"
  location.hash      →  "#section"

` }}</pre>

    <h3>三、请求报文结构</h3>
    <pre>{{ `
POST /api/login HTTP/1.1          ← 请求行（method + path + 协议版本）
Host: api.example.com             ← 请求头（Headers）
Content-Type: application/json
Authorization: Bearer eyJhbGci...
                                  ← 空行（分隔头和体）
{"username":"admin","password":"123"}  ← 请求体（Body）

` }}</pre>

    <h3>四、响应报文结构</h3>
    <pre>{{ `
HTTP/1.1 200 OK                   ← 状态行（协议版本 + 状态码 + 描述）
Content-Type: application/json    ← 响应头（Headers）
Cache-Control: no-cache
Set-Cookie: sessionId=abc; HttpOnly
                                  ← 空行
\{"success":true,"data":{...}\}     ← 响应体（Body）

` }}</pre>
  </div>
</template>
<script setup>
</script>
