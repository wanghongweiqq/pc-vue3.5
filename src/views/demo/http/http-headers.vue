<template>
  <div class="content">
    <h2>请求头 / 响应头（Headers）</h2>
    <p>Headers 是 HTTP 请求和响应中携带的元信息，用于描述数据格式、认证身份、缓存策略等。分为<em>请求头</em>（客户端 → 服务端）和<em>响应头</em>（服务端 → 客户端）。</p>

    <h3>常用请求头</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>字段</th>
          <th>作用</th>
          <th>示例值</th>
        </tr>
        <tr>
          <td><code>Content-Type</code></td>
          <td>声明请求体的数据格式</td>
          <td><code>application/json</code></td>
        </tr>
        <tr>
          <td><code>Authorization</code></td>
          <td>携带身份认证凭证</td>
          <td><code>Bearer eyJhbGci...</code></td>
        </tr>
        <tr>
          <td><code>Accept</code></td>
          <td>告诉服务端客户端能接受的响应格式</td>
          <td><code>application/json</code></td>
        </tr>
        <tr>
          <td><code>Cookie</code></td>
          <td>携带 Cookie 信息</td>
          <td><code>sessionId=abc123</code></td>
        </tr>
        <tr>
          <td><code>Origin</code></td>
          <td>请求来源（跨域请求自动添加）</td>
          <td><code>https://example.com</code></td>
        </tr>
        <tr>
          <td><code>Referer</code></td>
          <td>请求来源页面的 URL</td>
          <td><code>https://example.com/page</code></td>
        </tr>
        <tr>
          <td><code>User-Agent</code></td>
          <td>客户端环境信息（浏览器/设备）</td>
          <td><code>Mozilla/5.0 ...</code></td>
        </tr>
        <tr>
          <td><code>X-Requested-With</code></td>
          <td>标识 Ajax 请求（非标准，约定俗成）</td>
          <td><code>XMLHttpRequest</code></td>
        </tr>
      </tbody>
    </table>

    <h3>常用响应头</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>字段</th>
          <th>作用</th>
          <th>示例值</th>
        </tr>
        <tr>
          <td><code>Content-Type</code></td>
          <td>声明响应体的数据格式</td>
          <td><code>application/json; charset=utf-8</code></td>
        </tr>
        <tr>
          <td><code>Set-Cookie</code></td>
          <td>向客户端写入 Cookie</td>
          <td><code>sessionId=abc; HttpOnly</code></td>
        </tr>
        <tr>
          <td><code>Access-Control-Allow-Origin</code></td>
          <td>声明允许跨域访问的来源</td>
          <td><code>*</code> 或 <code>https://example.com</code></td>
        </tr>
        <tr>
          <td><code>Cache-Control</code></td>
          <td>控制缓存策略</td>
          <td><code>no-cache</code> / <code>max-age=3600</code></td>
        </tr>
        <tr>
          <td><code>Location</code></td>
          <td>重定向目标地址（配合 3xx 使用）</td>
          <td><code>https://example.com/new</code></td>
        </tr>
        <tr>
          <td><code>Content-Length</code></td>
          <td>响应体字节长度</td>
          <td><code>1024</code></td>
        </tr>
      </tbody>
    </table>

    <h3>Content-Type 详解</h3>
    <p><code>Content-Type</code> 同时出现在请求头和响应头，格式为 <code>类型/子类型; 参数</code>：</p>
    <pre>{{ `
// 请求头 Content-Type —— 告诉服务端请求体的格式
Content-Type: application/json
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXX

// 响应头 Content-Type —— 告诉浏览器响应体的格式
Content-Type: application/json; charset=utf-8
Content-Type: text/html; charset=utf-8
Content-Type: image/png` }}</pre>

    <h3>Authorization 认证方式</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>类型</th>
          <th>格式</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>Bearer Token（JWT）</td>
          <td><code>Authorization: Bearer &lt;token&gt;</code></td>
          <td>现代项目最常用，token 由服务端签发</td>
        </tr>
        <tr>
          <td>Basic Auth</td>
          <td><code>Authorization: Basic &lt;base64(user:pass)&gt;</code></td>
          <td>用户名密码 base64 编码，安全性低，需配合 HTTPS</td>
        </tr>
        <tr>
          <td>Cookie（Session）</td>
          <td>自动携带，无需手动设置</td>
          <td>传统 Session 方案，依赖服务端存储</td>
        </tr>
      </tbody>
    </table>

    <h3>本项目自定义请求头</h3>
    <pre>{{ `
// src/service/axios.js 中的自定义头
headers: {
  'X-Requested-With': 'XMLHttpRequest',  // 标识 Ajax 请求
  'X-jd-ajax': '1.0',                    // 业务标识
}

// 拦截器中动态添加时间戳，防止缓存
config.headers['X-jd-ts'] = new Date().getTime()` }}</pre>

    <h3>CORS 跨域相关头</h3>
    <pre>{{ `
// 简单请求（GET/POST + 普通 Content-Type）
// 浏览器自动添加 Origin，服务端响应 Access-Control-Allow-Origin 即可

// 复杂请求（自定义头 / PUT / DELETE 等）
// 浏览器先发 OPTIONS 预检请求，服务端需响应：
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400   // 预检结果缓存时间（秒）` }}</pre>
  </div>
</template>
