<template>
  <div class="content">
    <h2>HTTP 状态码</h2>
    <p>状态码是服务端响应请求时返回的三位数字，表示本次请求的处理结果。分为五大类：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>范围</th>
          <th>类别</th>
          <th>含义</th>
        </tr>
        <tr>
          <td><code>1xx</code></td>
          <td>信息</td>
          <td>请求已收到，继续处理中（较少见）</td>
        </tr>
        <tr>
          <td><code>2xx</code></td>
          <td>成功</td>
          <td>请求成功处理</td>
        </tr>
        <tr>
          <td><code>3xx</code></td>
          <td>重定向</td>
          <td>资源已移动，需进一步操作</td>
        </tr>
        <tr>
          <td><code>4xx</code></td>
          <td>客户端错误</td>
          <td>请求有误，客户端问题</td>
        </tr>
        <tr>
          <td><code>5xx</code></td>
          <td>服务端错误</td>
          <td>服务端处理失败</td>
        </tr>
      </tbody>
    </table>

    <h3>2xx — 成功</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>状态码</th>
          <th>含义</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>200 OK</code></td>
          <td>请求成功</td>
          <td>GET 查询、POST 提交成功</td>
        </tr>
        <tr>
          <td><code>201 Created</code></td>
          <td>资源创建成功</td>
          <td>POST 新增数据，返回新资源</td>
        </tr>
        <tr>
          <td><code>204 No Content</code></td>
          <td>成功但无响应体</td>
          <td>DELETE 删除成功，无需返回内容</td>
        </tr>
      </tbody>
    </table>

    <h3>3xx — 重定向</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>状态码</th>
          <th>含义</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>301 Moved Permanently</code></td>
          <td>永久重定向</td>
          <td>域名迁移、HTTP → HTTPS，浏览器会缓存</td>
        </tr>
        <tr>
          <td><code>302 Found</code></td>
          <td>临时重定向</td>
          <td>未登录跳转登录页，不缓存</td>
        </tr>
        <tr>
          <td><code>304 Not Modified</code></td>
          <td>资源未修改，使用缓存</td>
          <td>协商缓存命中，浏览器直接读本地缓存</td>
        </tr>
      </tbody>
    </table>

    <h3>4xx — 客户端错误</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>状态码</th>
          <th>含义</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>400 Bad Request</code></td>
          <td>请求格式/参数有误</td>
          <td>参数缺失、类型错误、JSON 格式非法</td>
        </tr>
        <tr>
          <td><code>401 Unauthorized</code></td>
          <td>未认证（未登录）</td>
          <td>token 缺失或失效，需重新登录</td>
        </tr>
        <tr>
          <td><code>403 Forbidden</code></td>
          <td>已认证但无权限</td>
          <td>登录了但没有该操作的权限</td>
        </tr>
        <tr>
          <td><code>404 Not Found</code></td>
          <td>资源不存在</td>
          <td>接口路径错误、数据已被删除</td>
        </tr>
        <tr>
          <td><code>405 Method Not Allowed</code></td>
          <td>请求方法不被允许</td>
          <td>接口只支持 POST，却用了 GET</td>
        </tr>
        <tr>
          <td><code>413 Payload Too Large</code></td>
          <td>请求体超出大小限制</td>
          <td>上传文件过大</td>
        </tr>
        <tr>
          <td><code>422 Unprocessable Entity</code></td>
          <td>参数格式正确但业务校验失败</td>
          <td>邮箱格式对但已被注册</td>
        </tr>
        <tr>
          <td><code>429 Too Many Requests</code></td>
          <td>请求频率超限</td>
          <td>接口限流，触发频率限制</td>
        </tr>
      </tbody>
    </table>

    <h3>5xx — 服务端错误</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>状态码</th>
          <th>含义</th>
          <th>典型场景</th>
        </tr>
        <tr>
          <td><code>500 Internal Server Error</code></td>
          <td>服务端内部错误</td>
          <td>代码抛出未捕获异常、数据库查询失败</td>
        </tr>
        <tr>
          <td><code>502 Bad Gateway</code></td>
          <td>网关收到上游无效响应</td>
          <td>后端服务崩溃，Nginx 收不到响应</td>
        </tr>
        <tr>
          <td><code>503 Service Unavailable</code></td>
          <td>服务暂时不可用</td>
          <td>服务器过载、正在维护</td>
        </tr>
        <tr>
          <td><code>504 Gateway Timeout</code></td>
          <td>网关等待上游超时</td>
          <td>后端处理时间过长，Nginx 超时</td>
        </tr>
      </tbody>
    </table>

    <h3>401 vs 403 的区别</h3>
    <pre>{{ `
401 Unauthorized  →  你是谁我不知道（未登录 / token 失效）
                     → 前端应跳转登录页

403 Forbidden     →  我知道你是谁，但你没有权限（已登录但无权操作）
                     → 前端应提示"无权限"，不需要重新登录
` }}</pre>

    <h3>前端常见处理策略</h3>
    <pre>{{ `
// axios 响应拦截器中统一处理
instance.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status
    if (status === 401) {
      // token 失效，跳登录页
      router.push('/login')
    } else if (status === 403) {
      Message.error('无操作权限')
    } else if (status === 500) {
      Message.error('服务器异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)
` }}</pre>
  </div>
</template>
