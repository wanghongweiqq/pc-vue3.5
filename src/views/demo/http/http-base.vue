<template>
  <div class="content">
    <h2>HTTP 基础</h2>
    <p>HTTP（HyperText Transfer Protocol，超文本传输协议）是 Web 的基础通信协议，定义了客户端与服务端之间<em>如何请求和传输数据</em>。基于 TCP/IP，属于应用层协议。</p>

    <h3>一、HTTP vs HTTPS</h3>
    <table class="table">
      <tbody>
        <tr>
          <th />
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
    <pre class="code-block">
https://api.example.com:8080/user/list?page=1&size=10#section

  https       ← 协议（scheme）
  api         ← 子域名
  example.com ← 域名
  :8080       ← 端口（默认 80/443 可省略）
  /user/list  ← 路径（path）
  ?page=1&size=10 ← 查询参数（query string）
  #section    ← 锚点（fragment，不会发送到服务端）</pre>

    <h3>三、请求报文结构</h3>
    <pre class="code-block">
POST /api/login HTTP/1.1          ← 请求行（method + path + 协议版本）
Host: api.example.com             ← 请求头（Headers）
Content-Type: application/json
Authorization: Bearer eyJhbGci...
                                  ← 空行（分隔头和体）
{"username":"admin","password":"123"}  ← 请求体（Body）</pre>

    <h3>四、响应报文结构</h3>
    <pre class="code-block">
HTTP/1.1 200 OK                   ← 状态行（协议版本 + 状态码 + 描述）
Content-Type: application/json    ← 响应头（Headers）
Cache-Control: no-cache
Set-Cookie: sessionId=abc; HttpOnly
                                  ← 空行
{"success":true,"data":{...}}     ← 响应体（Body）</pre>

    <h3>五、TCP 三次握手 / 四次挥手</h3>
    <p>HTTP 基于 TCP，每次通信前先建立 TCP 连接。</p>
    <pre class="code-block">
三次握手（建立连接）：
  客户端 ——SYN——→ 服务端          第1次：我要连你
  客户端 ←—SYN+ACK—— 服务端      第2次：可以，我也要连你
  客户端 ——ACK——→ 服务端          第3次：好的，连接建立

四次挥手（断开连接）：
  客户端 ——FIN——→ 服务端          第1次：我发完了，要断了
  客户端 ←——ACK—— 服务端          第2次：收到，但我还没发完
  客户端 ←——FIN—— 服务端          第3次：我也发完了
  客户端 ——ACK——→ 服务端          第4次：好的，连接关闭</pre>
    <p>为什么挥手比握手多一次？建立连接时 SYN+ACK 可以合并，断开时服务端的 ACK 和 FIN 需要分开发（中间可能还有数据要传）。</p>

    <h3>六、HTTP 版本演进</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>版本</th>
          <th>年份</th>
          <th>核心改进</th>
          <th>遗留问题</th>
        </tr>
        <tr>
          <td>HTTP/1.0</td>
          <td>1996</td>
          <td>定义了基本的请求/响应模型</td>
          <td>每次请求新建 TCP 连接，开销大</td>
        </tr>
        <tr>
          <td>HTTP/1.1</td>
          <td>1997</td>
          <td>持久连接（Keep-Alive）、Cache-Control、Host 头、分块传输</td>
          <td>队头阻塞：同一连接请求必须排队</td>
        </tr>
        <tr>
          <td>HTTP/2</td>
          <td>2015</td>
          <td>多路复用（一个连接并发多请求）、头部压缩（HPACK）、二进制帧、Server Push</td>
          <td>TCP 层队头阻塞（丢包时所有 Stream 等待）</td>
        </tr>
        <tr>
          <td>HTTP/3</td>
          <td>2022</td>
          <td>底层换用 QUIC（基于 UDP），彻底解决队头阻塞、0-RTT 连接、连接迁移</td>
          <td>部分网络设备限制 UDP</td>
        </tr>
      </tbody>
    </table>

    <h4>HTTP/1.1 队头阻塞示意</h4>
    <pre class="code-block">
同一 TCP 连接，请求必须排队：

请求1 ——→ 等待响应... ——→ 响应1
                               请求2 ——→ 等待响应... ——→ 响应2
                                                          请求3 ——→ 响应3

请求2 必须等请求1 完成，无法并发</pre>

    <h4>HTTP/2 多路复用</h4>
    <pre class="code-block">
一个 TCP 连接，多个 Stream 并发：

Stream1: 请求1 ————————————→ 响应1
Stream2: 请求2 ————→ 响应2
Stream3: 请求3 ——→ 响应3

三个请求同时飞，互不阻塞</pre>

    <h4>HTTP/3 QUIC 解决 TCP 队头阻塞</h4>
    <pre class="code-block">
HTTP/2（TCP）：
  Stream1 ───────────────────────────
  Stream2 ──── 丢包! 等待重传... → 所有 Stream 卡住

HTTP/3（QUIC/UDP）：
  Stream1 ───────────────────────────
  Stream2 ──── 丢包! 重传  → 仅 Stream2 等待，其他正常</pre>

    <h3>七、缓存控制</h3>
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
    <pre class="code-block">
强缓存（不请求服务端）：
  Cache-Control: max-age=3600
  → 3600 秒内直接读本地，状态码显示 200（from cache）

协商缓存（请求服务端验证）：
  请求头：If-None-Match: "abc123"
  服务端：资源未变 → 304 Not Modified（不返回 body）
          资源已变 → 200 OK + 新资源</pre>

    <h3>八、跨域（CORS）</h3>
    <p>浏览器同源策略：协议 + 域名 + 端口三者一致才算同源，跨域请求会被浏览器拦截。</p>
    <pre class="code-block">
同源：https://a.com → https://a.com/api       ✅
跨域：https://a.com → https://b.com/api       ❌ 域名不同
跨域：https://a.com → http://a.com/api        ❌ 协议不同
跨域：https://a.com → https://a.com:8080/api  ❌ 端口不同</pre>
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
