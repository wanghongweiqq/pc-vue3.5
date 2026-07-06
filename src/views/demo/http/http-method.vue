<template>
  <div class="content">
    <h2>请求方法</h2>
    <p>HTTP 定义了一组请求方法，用于表达对资源执行的操作语义。常用方法有 GET / POST / PUT / PATCH / DELETE。</p>

    <h3>方法总览</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>方法</th>
          <th>语义</th>
          <th>幂等</th>
          <th>请求体</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td>查询资源</td>
          <td>✅</td>
          <td>❌</td>
          <td>获取列表、详情</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td>新增资源</td>
          <td>❌</td>
          <td>✅</td>
          <td>提交表单、创建数据</td>
        </tr>
        <tr>
          <td><code>PUT</code></td>
          <td>全量替换资源</td>
          <td>✅</td>
          <td>✅</td>
          <td>整条记录更新</td>
        </tr>
        <tr>
          <td><code>PATCH</code></td>
          <td>部分更新资源</td>
          <td>✅</td>
          <td>✅</td>
          <td>只改某几个字段</td>
        </tr>
        <tr>
          <td><code>DELETE</code></td>
          <td>删除资源</td>
          <td>✅</td>
          <td>可选</td>
          <td>删除某条记录</td>
        </tr>
      </tbody>
    </table>

    <h3>幂等性</h3>
    <p>同一请求发送 N 次，结果与发送 1 次相同，则称为<em>幂等</em>。</p>
    <pre>{{ `
// ✅ 幂等：多次执行结果一致
PUT /articles/1  { title: 'A' }  →  title 始终是 A

// ❌ 非幂等：每次执行都新增一条
POST /articles   { title: 'A' }  →  执行 3 次 = 3 条数据
` }}</pre>

    <p>实际意义：网络超时需要重试时，幂等接口可以放心重发；非幂等接口重发可能产生重复数据。</p>

    <h3>PUT vs PATCH</h3>
    <pre>{{ `
// 原始数据
{ id: 1, title: '标题', content: '内容', author: '张三' }

// 只想修改 title

// PUT —— 必须传全部字段，未传字段会被覆盖/清空
PUT /articles/1
body: { title: '新标题', content: '内容', author: '张三' }

// PATCH —— 只传要修改的字段，其他字段不动
PATCH /articles/1
body: { title: '新标题' }
` }}</pre>

    <h3>params vs data（axios 视角）</h3>
    <p>axios 中，入参通过哪个属性传递，取决于 method：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>属性</th>
          <th>传输位置</th>
          <th>适用 method</th>
        </tr>
        <tr>
          <td><code>params</code></td>
          <td>拼接到 URL 查询字符串 <code>?key=value</code></td>
          <td>GET（及其他读操作）</td>
        </tr>
        <tr>
          <td><code>data</code></td>
          <td>放入请求体（Request Body）</td>
          <td>POST / PUT / PATCH / DELETE</td>
        </tr>
      </tbody>
    </table>
    <pre>{{ `
// GET：参数拼在 URL 后
axios.get('/api/list', { params: { page: 1, size: 10 } })
// → GET /api/list?page=1&size=10

// POST：参数放请求体
axios.post('/api/create', { title: '标题', content: '内容' })
// → POST /api/create  Body: {"title":"标题","content":"内容"}
` }}</pre>

    <h3>实际项目中的现实</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>常见做法</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>只用 GET + POST</td>
          <td>最常见，POST 同时承担增删改操作</td>
        </tr>
        <tr>
          <td>DELETE 用 POST 代替</td>
          <td>部分老网关或防火墙不支持 DELETE</td>
        </tr>
        <tr>
          <td>PUT 和 PATCH 混用</td>
          <td>后端不严格区分全量/部分更新，以接口文档为准</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
