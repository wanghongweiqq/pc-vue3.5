<template>
  <div class="content">
    <h2>TCP / UDP</h2>

    <h3>一、TCP 三次握手 / 四次挥手</h3>
    <p>HTTP 基于 TCP，每次通信前先建立 TCP 连接。</p>
    <pre>{{ `
三次握手（建立连接）：
  客户端 ——SYN——→ 服务端          第1次：我要连你
  客户端 ←—SYN+ACK—— 服务端      第2次：可以，我也要连你
  客户端 ——ACK——→ 服务端          第3次：好的，连接建立

四次挥手（断开连接）：
  客户端 ——FIN——→ 服务端          第1次：我发完了，要断了
  客户端 ←——ACK—— 服务端          第2次：收到，但我还没发完
  客户端 ←——FIN—— 服务端          第3次：我也发完了
  客户端 ——ACK——→ 服务端          第4次：好的，连接关闭` }}</pre>
    <p>为什么挥手比握手多一次？建立连接时 SYN+ACK 可以合并，断开时服务端的 ACK 和 FIN 需要分开发（中间可能还有数据要传）。</p>

    <h3>二、TCP vs UDP</h3>
    <p>两者都是<em>传输层协议</em>，负责在两台设备间传输数据，但设计哲学完全不同。</p>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>TCP</th>
          <th>UDP</th>
        </tr>
        <tr>
          <td>全称</td>
          <td>Transmission Control Protocol（传输控制协议）</td>
          <td>User Datagram Protocol（用户数据报协议）</td>
        </tr>
        <tr>
          <td>连接方式</td>
          <td>需要三次握手建立连接</td>
          <td>无连接，直接发送</td>
        </tr>
        <tr>
          <td>可靠性</td>
          <td>✅ 保证到达、有序、不重复</td>
          <td>❌ 不保证，发出去不管</td>
        </tr>
        <tr>
          <td>速度</td>
          <td>较慢（确认/重传有开销）</td>
          <td>快（无额外机制）</td>
        </tr>
        <tr>
          <td>包头大小</td>
          <td>最少 20 字节</td>
          <td>8 字节</td>
        </tr>
        <tr>
          <td>拥塞控制</td>
          <td>✅ 有</td>
          <td>❌ 没有</td>
        </tr>
        <tr>
          <td>类比</td>
          <td>寄快递（有单号、有签收、丢件补寄）</td>
          <td>发广播（发出去就不管了）</td>
        </tr>
        <tr>
          <td>典型应用</td>
          <td>HTTP/1.1、HTTP/2、FTP、SSH、WebSocket</td>
          <td>视频直播、游戏、DNS、HTTP/3（QUIC）</td>
        </tr>
      </tbody>
    </table>
    <p>视频卡一帧没关系，但卡住等重传就影响体验；游戏丢一个位置包无所谓，但延迟高就变"打飞机"了 —— 所以这类场景选 UDP。</p>

    <h4>浏览器中如何判断接口走 TCP 还是 UDP</h4>
    <p>DevTools → Network → 右键列头 → 勾选 <strong>Protocol</strong> 列：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>Protocol 值</th>
          <th>传输层</th>
          <th>说明</th>
        </tr>
        <tr>
          <td><code>http/1.1</code></td>
          <td>TCP</td>
          <td />
        </tr>
        <tr>
          <td><code>h2</code></td>
          <td>TCP</td>
          <td>HTTP/2</td>
        </tr>
        <tr>
          <td><code>h3</code></td>
          <td>UDP</td>
          <td>HTTP/3，底层走 QUIC</td>
        </tr>
        <tr>
          <td><code>websocket</code></td>
          <td>TCP</td>
          <td />
        </tr>
      </tbody>
    </table>
    <p>口诀：<strong>h3 → UDP，其余全是 TCP</strong>。浏览器中绝大多数请求都走 TCP，只有服务端明确支持 HTTP/3 时才会协商升级到 UDP。</p>

    <h4>UDP 不是「广播」</h4>
    <p>UDP 只是<em>不保证可靠送达</em>，不代表它是广播。UDP 同样支持点对点通信（一对一），「广播」只是 UDP 的一种使用方式，不是它的本质。</p>

    <h4>WebSocket 为什么不用 UDP</h4>
    <p>WebSocket 的核心场景是聊天、推送、实时协作，这些场景要求消息<em>不能丢、有顺序、可靠送达</em>，而原始 UDP 这三点都不保证，用裸 UDP 做 WebSocket 等于要自己手动实现 TCP 的那套机制，得不偿失。</p>

    <h4>HTTP/3 的 UDP 不是裸 UDP</h4>
    <p>HTTP/3 底层是 <strong>QUIC</strong>，QUIC 在 UDP 之上自己实现了可靠传输、有序到达、加密，并非放弃可靠性，而是把可靠性机制从操作系统层搬到应用层，顺便解决了 TCP 的队头阻塞：</p>
    <pre>{{ `
HTTP/3  →  QUIC（可靠 + 有序 + 加密）  →  UDP
                 ↑
           自己实现了丢包重传、有序传输，不是裸 UDP` }}</pre>

    <h4>WebTransport —— 下一代 WebSocket</h4>
    <p>基于 QUIC 的双向实时通信标准，可理解为「WebSocket over QUIC」，2023 年 Chrome 已正式支持：</p>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>WebSocket</th>
          <th>WebTransport</th>
        </tr>
        <tr>
          <td>传输层</td>
          <td>TCP</td>
          <td>QUIC（UDP）</td>
        </tr>
        <tr>
          <td>可靠性</td>
          <td>✅ 可靠有序</td>
          <td>✅ 可靠流 + 可选不可靠数据报</td>
        </tr>
        <tr>
          <td>队头阻塞</td>
          <td>有</td>
          <td>无</td>
        </tr>
        <tr>
          <td>成熟度</td>
          <td>成熟稳定</td>
          <td>2023 年正式支持，仍在普及</td>
        </tr>
      </tbody>
    </table>

    <h3>三、QUIC 详解</h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">项目</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>英文全称</td>
          <td>Quick UDP Internet Connections</td>
        </tr>
        <tr>
          <td>中文名</td>
          <td>快速 UDP 互联网连接</td>
        </tr>
        <tr>
          <td>起源</td>
          <td>Google 于 2012 年研发，最初用于 Chrome 和 Google 服务器之间的通信</td>
        </tr>
        <tr>
          <td>标准化</td>
          <td>2021 年由 IETF 正式发布 RFC 9000，成为 HTTP/3 的底层传输协议</td>
        </tr>
        <tr>
          <td>底层协议</td>
          <td>运行在 UDP 之上，自己实现了可靠传输、有序交付、流量控制</td>
        </tr>
      </tbody>
    </table>

    <h4>核心特性</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>特性</th>
          <th>说明</th>
          <th>对比 TCP</th>
        </tr>
        <tr>
          <td>0-RTT 连接</td>
          <td>再次访问已知服务器时，握手与数据可以同时发出，延迟接近零</td>
          <td>TCP + TLS 需要 1~2 个 RTT 才能开始传数据</td>
        </tr>
        <tr>
          <td>内置 TLS 1.3</td>
          <td>传输握手与加密握手合并为一次，连接建立即加密</td>
          <td>TCP 需要先握手再单独做 TLS 握手</td>
        </tr>
        <tr>
          <td>多路复用无队头阻塞</td>
          <td>每个 Stream 独立传输，一个 Stream 丢包不影响其他 Stream</td>
          <td>HTTP/2 的多路复用在 TCP 层仍存在队头阻塞</td>
        </tr>
        <tr>
          <td>连接迁移</td>
          <td>使用 Connection ID 标识连接，换 IP / 网络（WiFi → 4G）不断连</td>
          <td>TCP 以四元组（源IP+端口+目标IP+端口）标识，换网必断</td>
        </tr>
        <tr>
          <td>用户态实现</td>
          <td>运行在应用层，无需等操作系统内核更新，迭代速度快</td>
          <td>TCP 内置于操作系统内核，改动极慢</td>
        </tr>
      </tbody>
    </table>

    <h4>什么是 RTT</h4>
    <p><strong>RTT（Round Trip Time，往返时延）</strong>指数据从发送方出发、到达接收方、再返回发送方所经历的总时间，是衡量网络延迟的核心指标。</p>
    <pre>{{ `
客户端 ——— 发出请求 ———→ 服务端
客户端 ←—— 收到响应 ———  服务端

      └──────── 1 RTT ────────┘

ping 显示 50ms，即 1 RTT ≈ 50ms
每多一次 RTT，用户就多等 50ms` }}</pre>
    <p>握手、TLS 协商等都需要若干 RTT，RTT 越多连接越慢，这也是 QUIC 优化的核心目标。</p>

    <h4>TLS 握手</h4>
    <p><strong>TLS（Transport Layer Security，传输层安全协议）</strong>是 HTTPS 的加密基础，前身是 SSL（Secure Sockets Layer）。TLS 握手的目的是在正式传输数据前完成三件事：</p>
    <ul>
      <li><em>身份认证</em> —— 验证服务端证书，确认对方不是假冒的</li>
      <li><em>协商算法</em> —— 双方协商使用哪种加密套件</li>
      <li><em>交换密钥</em> —— 安全地生成后续通信用的对称加密密钥</li>
    </ul>
    <pre>{{ `
TLS 1.2 握手（2 RTT）：
  RTT1  客户端 → ClientHello（支持的加密套件、随机数）
        服务端 ← ServerHello（选定套件）+ Certificate + ServerHelloDone
  RTT1  客户端 → ClientKeyExchange + ChangeCipherSpec + Finished
  RTT2  服务端 ← ChangeCipherSpec + Finished
  ───────────────────────────────────── 开始加密通信

TLS 1.3 握手（1 RTT）：
  RTT1  客户端 → ClientHello（支持套件 + 密钥共享参数）
        服务端 ← ServerHello + Certificate + Finished（合并发送）
        客户端 → Finished
  ───────────────────────────────────── 开始加密通信（比 1.2 少一个 RTT）` }}</pre>
    <p>TLS 1.3 将证书验证和密钥交换合并，减少了一次往返，QUIC 则在此基础上将 TLS 握手与传输握手进一步合并，做到了首次连接 1 RTT、再次连接 0 RTT。</p>

    <h4>连接建立对比</h4>
    <pre>{{ `
TCP + TLS 1.3（首次连接，共 2 RTT）：
  RTT1: TCP 握手（SYN / SYN+ACK / ACK）
  RTT2: TLS 握手（ClientHello / ServerHello / Finished）
  ─────────────────────────────────────────────── 开始传数据

QUIC（首次连接，1 RTT）：
  RTT1: QUIC 握手（含 TLS 1.3，合并为一次）
  ─────────────────────────────────────────── 开始传数据

QUIC（再次连接，0 RTT）：
  直接发数据（携带上次缓存的会话信息）
  ─── 立即传数据` }}</pre>
  </div>
</template>
<script setup>
</script>
