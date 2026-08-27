<template>
  <div class="content">
    <h2>TCP / UDP</h2>
    <p>TCP = Transmission Control Protocol，中文叫传输控制协议。</p>
    <p>它是 TCP/IP 协议族里传输层（OSI 第 4 层）的核心协议之一，和 IP（网际协议）配合工作：IP 负责把包送到对端机器，TCP 负责保证数据可靠、按序、不丢不重地送到应用进程。</p>
    
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
    <h4>控制标志位: SYN / ACK / FIN</h4>
    <p>这三个是 TCP 报文头部的控制标志位（Flag），只有 0 和 1，置 1 代表开启该信号。</p>
    <table class="table">
      <tbody>
        <tr><th>标志位</th><th>全称</th><th>描述</th></tr>
        <tr><td>SYN</td><td>Synchronize 同步</td><td>连接请求 报文</td></tr>
        <tr><td>ACK</td><td>Acknowledge 确认</td><td>用于确认 报文是否被成功接收</td></tr>
        <tr><td>FIN</td><td>Finish 结束</td><td>用于结束 连接，本方数据发送完毕，请求关闭单向通道</td></tr>
      </tbody>
    </table>

    <h4>一次完整的HTTPS 请求：TCP 三次握手 → TLS 握手 → HTTP 请求 / 响应(可以多次，直到超时) → TCP四次挥手</h4>

    <table class="table">
      <tbody>
        <tr>
          <th width="200">
            流程
          </th>
          <th>报文数</th>
          <th>RTT数</th>
          <th>说明</th>
        </tr>
        <tr>
          <td> TCP 三次握手</td>  
          <td>3	</td>
          <td>1 RTT	</td>
          <td>SYN → SYN+ACK 完成一次往返；最后的 ACK 无需应答</td>
        </tr>
        <tr>
          <td>TCP 四次挥手</td>  
          <td>4	</td>
          <td>2</td>
          <td>
            <p>FIN‑ACK 一轮 RTT；FIN‑ACK 第二轮 RTT；客户端发出最后这个 ACK 之后，会进入 TIME‑WAIT（2MSL）状态，等待2MSL后才能关闭连接</p>
            <p>2MSL = 两倍最大报文生存时间，是用来保证最后一个 ACK 能够到达对方，防止丢包；这是超时时间，不是网络往返 RTT。</p>
          </td>
        </tr>
        <tr>
          <td>TCP 四次挥手 (合并，三次挥手)</td>  
          <td>3</td>
          <td>2</td>
          <td>
            <p>当服务端没有剩余数据要发送，会把第 2 步ACK和第 3 步FIN合并成一个报文，于是变成三次挥手：</p>
            <p>三次<em>握手</em>的1个RTT：服务端发送SYN后，客户端这边所有接收工作全部完成，只需要往外甩一个无应答的 ACK。</p>
            <p>三次<em>挥手</em>的1个RTT：服务端发送FIN后，客户端必须针对这个【服务端的 FIN】再回复一个 ACK，之后进入TIME‑WAIT（2MSL）状态，最后关闭连接。</p>
          </td>
        </tr>
        <tr>
          <td>TLS1.2 完整握手</td>
          <td>多报文</td>
          <td>2</td>
          <td>HTTPS 新建连接合计 3 RTT</td>
        </tr>
        <tr>
          <td>TLS1.3 标准握手</td>
          <td>多报文</td>
          <td>1</td>
          <td>TCP (1RTT)+TLS1.3 (1RTT)，HTTPS 新建连接合计 2 RTT</td>
        </tr>
        <tr>
          <td>TLS1.3 0‑RTT 握手</td>
          <td>复用会话</td>
          <td>0 RTT</td>
          <td>会话复用，应用数据直接随 ClientHello 发出，有重放风险</td>
        </tr>
      </tbody>
    </table>

    <h4>关键易混点</h4>
    <p>1、RTT = 发出包，等到对方响应回来才算一次往返；只发出去、不需要对方回复的报文，不计 RTT。</p>
    <p>2、MSL ≠ 2RTT：MSL 是报文最大生存时间，Linux 默认 60 秒，协议常量，不是网络测得往返延迟。</p>
    <p>3、TLS 跑在 TCP 之上，HTTPS 总 RTT = TCP 握手 RTT + TLS 握手 RTT。</p>

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
          <th width="100">
            项目
          </th>
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
      ——— 发出请求 ———→ 
客户端                  服务端
      ←—— 发出响应 ———  
 └──────── 1 RTT ────────┘

ping 显示 50ms，即 1 RTT ≈ 50ms
每多一次 RTT，用户就多等 50ms` }}</pre>
    <p>握手、TLS 协商等都需要若干 RTT，RTT 越多连接越慢，这也是 QUIC 优化的核心目标。</p>

    <h3>TLS 握手</h3>
    <p><strong>TLS（Transport Layer Security，传输层安全协议）</strong>是 HTTPS 的加密基础，前身是 SSL（Secure Sockets Layer，安全套接层协议）。TLS 握手的目的是在正式传输数据前完成三件事：</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="200">
            内容
          </th>
          <th>说明</th>
        </tr>
        <tr>
          <td>身份认证</td>
          <td>验证服务端证书，确认对方不是假冒的</td>
        </tr>
        <tr>
          <td>协商算法</td> 
          <td>双方协商使用哪种加密套件</td>
        </tr>
        <tr>
          <td>交换密钥</td>
          <td>安全地生成后续通信用的对称加密密钥</td>
        </tr> 
      </tbody>
    </table>

    <h4>密钥类型</h4>
    <p>非对称只用来 “协商出一把对称钥匙”，业务流量全部用对称加密。</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="200">
            类型
          </th>
          <th>说明</th>
        </tr>
        <tr>
          <td>非对称密钥（公钥 / 私钥）</td>
          <td>开销大，只用于握手、身份认证、密钥协商，不加密业务数据。非对称加密​ = 我给你一把"只能锁不能开"的锁（公钥），你把信锁进去寄给我，只有我的私钥能打开。钥匙不用传递，安全，但锁起来比较费劲。</td>
        </tr>
        <tr>
          <td>对称密钥（会话密钥）</td> 
          <td>加解密速度快，握手协商出来，真正加密 HTTP 报文，每次会话重新生成。对称加密​ = 你和我共用同一把钥匙开同一把锁。安全，但钥匙怎么递给对方是个问题（派人送？容易被截）。</td>
        </tr>
      </tbody>
    </table>

    <h4>TLS 握手用什么加密？</h4>
    <p>TLS1.3 干掉了 RSA 密钥交换，强制 ECDHE，强制 AEAD 对称加密（RSA、ECDHE、AEAD 是三种不同的算法模式/标准）。</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="200">
            阶段
          </th>
          <th>说明</th>
        </tr>
        <tr>
          <td>握手协商阶段：非对称加</td>
          <td>
            <p>RSA 模式：使用 RSA 非对称加密加密预主密钥。</p>
            <p>ECDHE 模式：使用 ECDHE 密钥协商算法交换公钥，生成预主密钥；使用 RSA/ECDSA 数字签名做服务器身份认证。</p>
          </td>
        </tr>
        <tr>
          <td>握手协商完成之后（传输 HTTP 数据）：对称加密</td> 
          <td>使用 AES‑GCM 这类对称加密。</td>
        </tr>
      </tbody>
    </table>

    <h4>握手协商阶段非对称加密计算开销大，为什么不换掉它？</h4>
    <p>不是不想换掉它，是没有别的算法，能安全解决「公网陌生双方如何安全交换密钥」这个问题；对称加密速度快，但解决不了身份认证和密钥分发难题。</p>

    <h4>TLS 1.2/1.3 握手对比</h4>
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
