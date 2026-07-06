<template>
  <div class="content">
    <h2>HTTP 版本演进</h2>
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

    <h3>HTTP/1.1 队头阻塞</h3>
    <pre>{{ `
同一 TCP 连接，请求必须排队：

请求1 ——→ 等待响应... ——→ 响应1
                               请求2 ——→ 等待响应... ——→ 响应2
                                                          请求3 ——→ 响应3

请求2 必须等请求1 完成，无法并发
` }}</pre>

    <h3>HTTP/2 多路复用</h3>
    <pre>{{ `
一个 TCP 连接，多个 Stream 并发：

Stream1: 请求1 ————————————→ 响应1
Stream2: 请求2 ————→ 响应2
Stream3: 请求3 ——→ 响应3

三个请求同时飞，互不阻塞
` }}</pre>

    <h3>HTTP/3 QUIC 解决 TCP 队头阻塞</h3>
    <pre>{{ `
HTTP/2（TCP）：
  Stream1 ───────────────────────────
  Stream2 ──── 丢包! 等待重传... → 所有 Stream 卡住

HTTP/3（QUIC/UDP）：
  Stream1 ───────────────────────────
  Stream2 ──── 丢包! 重传  → 仅 Stream2 等待，其他正常</code>
` }}</pre>

    <h3>使用哪个版本由什么决定</h3>
    <p>由<em>客户端和服务端协商</em>共同决定，双方都支持才能用，任何一方不支持则自动降级。</p>

    <h4>HTTP/1.1 → HTTP/2：ALPN 协商</h4>
    <p><strong>ALPN（Application-Layer Protocol Negotiation，应用层协议协商）</strong>是 TLS 握手的扩展字段，在加密握手时顺带完成协议协商，不需要额外往返：</p>
    <pre>{{ `
客户端 ClientHello → 携带支持的协议列表：["h2", "http/1.1"]
服务端 ServerHello ← 从列表中选一个回应：["h2"]

双方确认用 HTTP/2，TLS 握手完成后直接开始 HTTP/2 通信
服务端不支持 h2 → 回 http/1.1 → 自动降级
` }}</pre>

    <h4>HTTP/2 → HTTP/3：Alt-Svc 发现</h4>
    <p>HTTP/3 基于 UDP，无法在 TCP 握手里协商，采用<em>事后通知</em>机制：</p>
    <pre>{{ `
第一次请求（走 HTTP/2 / TCP）：
  服务端响应头携带：Alt-Svc: h3=":443"; ma=86400
  ↑ 意思：我在 443 端口支持 HTTP/3，有效期 86400 秒

浏览器缓存该信息，后续请求直接尝试 QUIC/UDP 连接
` }}</pre>

    <p>因此<strong>第一次访问</strong>支持 HTTP/3 的网站仍走 TCP，从第二次起才可能升级。</p>

    <h4>决定因素</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>因素</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>客户端支持</td>
          <td>浏览器版本决定支持哪些协议（Chrome 87+ 支持 HTTP/3）</td>
        </tr>
        <tr>
          <td>服务端配置</td>
          <td>Nginx / Caddy 等需要显式开启 HTTP/2、HTTP/3</td>
        </tr>
        <tr>
          <td>TLS</td>
          <td>HTTP/2 和 HTTP/3 实践中都需要 HTTPS，明文不可用</td>
        </tr>
        <tr>
          <td>ALPN 协商</td>
          <td>TLS 握手时协商 HTTP/1.1 vs HTTP/2</td>
        </tr>
        <tr>
          <td>Alt-Svc 通知</td>
          <td>服务端通过响应头告知客户端可升级到 HTTP/3</td>
        </tr>
        <tr>
          <td>网络环境</td>
          <td>防火墙 / 运营商封锁 UDP → HTTP/3 自动回退到 HTTP/2</td>
        </tr>
      </tbody>
    </table>

    <h4>完整决策流程</h4>
    <pre>{{ `
浏览器发起请求
    ↓
是否有该域名的 Alt-Svc 缓存？
    ├── 有 → 尝试 QUIC/UDP（HTTP/3）
    │         失败则回退 HTTP/2
    └── 没有 → TCP 连接 + TLS 握手
                ALPN 协商
                ├── 服务端支持 h2 → HTTP/2
                └── 不支持 → HTTP/1.1
                响应头有 Alt-Svc？
                └── 有 → 缓存，下次尝试 HTTP/3
` }}</pre>
  </div>
</template>
<script setup>
</script>
