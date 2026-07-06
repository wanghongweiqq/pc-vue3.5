<template>
  <div class="content">
    <h2>请求体（Request Body）</h2>
    <p>请求体是客户端发送给服务器的数据部分，只有 POST / PUT / PATCH / DELETE 才有请求体。请求体的格式由请求头 <code>Content-Type</code> 声明。</p>

    <h3>三种常见格式</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>Content-Type</th>
          <th>格式</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>application/json</code></td>
          <td>JSON 字符串</td>
          <td>REST API 接口，现代项目主流</td>
        </tr>
        <tr>
          <td><code>application/x-www-form-urlencoded</code></td>
          <td>key=value&amp;key2=value2</td>
          <td>传统表单提交、老接口</td>
        </tr>
        <tr>
          <td><code>multipart/form-data</code></td>
          <td>分块编码，每段有 boundary 分隔</td>
          <td>文件上传、图片上传</td>
        </tr>
      </tbody>
    </table>

    <h3>① application/json</h3>
    <p>最常用的格式，数据以 JSON 字符串形式放在请求体中。axios 默认使用此格式。</p>
    <pre>{{ `
// axios 默认就是 application/json，直接传对象即可
axios.post('/api/create', { title: '标题', count: 10, tags: ['a', 'b'] })

// 实际发出的请求
POST /api/create
Content-Type: application/json
Body: {"title":"标题","count":10,"tags":["a","b"]}

// 优点：支持嵌套对象/数组，结构清晰
// 缺点：不能直接传文件` }}</pre>

    <h3>② application/x-www-form-urlencoded</h3>
    <p>数据以 <code>key=value</code> 形式编码，多个字段用 <code>&amp;</code> 连接，特殊字符需 URL 编码。</p>
    <pre>{{ `
// axios 中需指定 Content-Type 或使用 URLSearchParams
import qs from 'qs'
axios.post('/api/login', qs.stringify({ username: 'admin', password: '123' }), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 实际发出的请求
POST /api/login
Content-Type: application/x-www-form-urlencoded
Body: username=admin&password=123

// 优点：兼容性好，老接口常见
// 缺点：不支持嵌套对象，数组传参格式不统一` }}</pre>

    <h3>③ multipart/form-data</h3>
    <p>将数据分成多块，每块有独立的 boundary 分隔符，是唯一能传二进制文件的格式。</p>
    <pre>{{ `
// 使用 FormData 对象，axios 会自动识别并设置 Content-Type
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('name', '头像')
axios.post('/api/upload', formData)

// 实际发出的请求（简化）
POST /api/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXX
Body:
------WebKitFormBoundaryXXX
Content-Disposition: form-data; name="file"; filename="avatar.png"
Content-Type: image/png
[二进制数据]
------WebKitFormBoundaryXXX
Content-Disposition: form-data; name="name"
头像
------WebKitFormBoundaryXXX--` }}</pre>

    <h3>三种格式对比</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>特性</th>
          <th>JSON</th>
          <th>URLEncoded</th>
          <th>FormData</th>
        </tr>
        <tr>
          <td>嵌套对象/数组</td>
          <td>✅</td>
          <td>⚠️ 有限支持</td>
          <td>⚠️ 有限支持</td>
        </tr>
        <tr>
          <td>文件上传</td>
          <td>❌</td>
          <td>❌</td>
          <td>✅</td>
        </tr>
        <tr>
          <td>可读性</td>
          <td>高</td>
          <td>中</td>
          <td>低</td>
        </tr>
        <tr>
          <td>axios 默认</td>
          <td>✅</td>
          <td>❌ 需手动设置</td>
          <td>自动识别 FormData</td>
        </tr>
        <tr>
          <td>传统表单兼容</td>
          <td>❌</td>
          <td>✅</td>
          <td>✅</td>
        </tr>
      </tbody>
    </table>

    <h3>本项目 axios 封装的处理</h3>
    <pre>{{ `
// 默认 JSON（isFormData 不传或为 false）
ajax({ url: '/api/create', method: 'post', data: { title: '标题' } })
// → Content-Type: application/json

// URLEncoded 模式（isFormData: true）
ajax({ url: '/api/login', method: 'post', data: { username: 'admin' }, isFormData: true })
// → Content-Type: application/x-www-form-urlencoded
// → Body: username=admin` }}</pre>
  </div>
</template>
