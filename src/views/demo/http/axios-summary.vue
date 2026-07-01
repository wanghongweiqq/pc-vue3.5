<template>
  <div class="content">
    <h2>axios 封装知识点总结</h2>
    <p>基于 axios v1.x，记录本项目封装过程中涉及的核心知识点。</p>

    <h3>一、版本时间线</h3>

    <h4>宏观里程碑</h4>
    <table class="table">
      <tbody>
        <tr>
          <th width="110">版本</th>
          <th width="110">时间</th>
          <th>关键变更</th>
        </tr>
        <tr>
          <td>0.1.0</td>
          <td>2014</td>
          <td>mzabriskie 创建，灵感来自 Angular <code>$http</code>，基于 XHR / Node http</td>
        </tr>
        <tr>
          <td>0.15.0</td>
          <td>2016-10</td>
          <td>新增取消请求（CancelToken）</td>
        </tr>
        <tr>
          <td>0.19.0</td>
          <td>2019-05</td>
          <td>新增 <code>isAxiosError</code> 标志</td>
        </tr>
        <tr>
          <td>0.21.2</td>
          <td>2021-09</td>
          <td>拦截器 <code>synchronous</code> / <code>runWhen</code>；<code>toFormData</code></td>
        </tr>
        <tr>
          <td>0.27.0</td>
          <td>2022-04</td>
          <td><code>AxiosError</code> 重构为构造函数，1.0 前奏</td>
        </tr>
        <tr>
          <td><strong>1.0.0 🎯</strong></td>
          <td><strong>2022-10</strong></td>
          <td>
            <strong>重大里程碑</strong> · Breaking Changes：<br>
            · Webpack → <strong>Rollup</strong> 构建，产物更小<br>
            · <strong>拦截器必须显式 return</strong>，否则请求中断<br>
            · <code>AxiosError</code> 成为独立类，含完整堆栈<br>
            · 重构为 ES2017 语法；新增拦截器 <code>clear()</code>
          </td>
        </tr>
        <tr>
          <td>1.6.4</td>
          <td>2024-01</td>
          <td>🔒 原型污染安全修复（CVE-2023-45857）；新增 <code>withXSRFToken</code></td>
        </tr>
        <tr>
          <td><strong>1.7.0 🎯</strong></td>
          <td><strong>2024-05</strong></td>
          <td><strong>内置 fetch adapter</strong>，支持 <code>adapter: ['fetch', 'xhr']</code> 数组降级</td>
        </tr>
      </tbody>
    </table>

    <h4>近期版本（重点）</h4>
    <table class="table">
      <tbody>
        <tr>
          <th width="110">版本</th>
          <th width="110">时间</th>
          <th>关键变更</th>
        </tr>
        <tr>
          <td>1.8.0</td>
          <td>2025-02-26</td>
          <td>新增 <code>allowAbsoluteUrls</code>，限制绝对 URL 请求，收紧 SSRF 防护</td>
        </tr>
        <tr>
          <td>1.9.0</td>
          <td>2025-04-24</td>
          <td>新增 <code>getSetCookie</code> 方法；headers 及 fetch 多项修复</td>
        </tr>
        <tr>
          <td>1.10.0</td>
          <td>2025-06-14</td>
          <td>修复 FormData 布尔值序列化；React Native 模块入口点支持</td>
        </tr>
        <tr>
          <td>1.11.0</td>
          <td>2025-07-23</td>
          <td>修复大 Buffer 的 RangeError；form-data 包问题及 TypeScript 类型修复</td>
        </tr>
        <tr>
          <td>1.12.0</td>
          <td>2025-09-11</td>
          <td>fetch 环境变量配置；JSON reviver 支持</td>
        </tr>
        <tr>
          <td><strong>1.13.0 🎯</strong></td>
          <td>2025-10-27</td>
          <td>新增 <strong>HTTP/2 支持</strong></td>
        </tr>
        <tr>
          <td>1.13.5</td>
          <td>2026-02-08</td>
          <td>🔒 <code>mergeConfig</code> 中 <code>__proto__</code> 键导致原型污染 DoS 修复</td>
        </tr>
        <tr>
          <td>1.14.0</td>
          <td>2026-03-27</td>
          <td>修复 HTTP/2 超时会话泄漏、fetch adapter 资源泄漏、CJS 兼容性回归</td>
        </tr>
        <tr>
          <td>1.15.0</td>
          <td>2026-04-07</td>
          <td>🔒 SSRF：<code>no_proxy</code> 主机名规范化绕过修复；新增 Deno / Bun 支持</td>
        </tr>
        <tr>
          <td>1.15.1</td>
          <td>2026-04-19</td>
          <td>🔒 多项安全修复：请求头注入、Multipart CRLF 注入、原型污染/Auth 绕过、<code>maxBodyLength</code> 绕过</td>
        </tr>
        <tr>
          <td>1.15.2</td>
          <td>2026-04-21</td>
          <td>🔒 原型污染加固（<code>formDataToJSON</code> 仅遍历 own 属性）；<code>allowedSocketPaths</code> 白名单防 SSRF；供应链加固</td>
        </tr>
        <tr>
          <td>1.16.0</td>
          <td>2026-05-02</td>
          <td>新增 QUERY HTTP 方法；fetch adapter 开始强制 <code>maxBodyLength</code></td>
        </tr>
        <tr>
          <td>1.16.1</td>
          <td>2026-05-13</td>
          <td>🔒 <code>formDataToJSON</code> 原型污染防御；HTTPS 代理明文泄露修复</td>
        </tr>
        <tr>
          <td>1.17.0</td>
          <td>2026-06-01</td>
          <td>🔒 SSRF：配置项改用 own-property 检查；新增 zstd 解压支持</td>
        </tr>
        <tr>
          <td>1.18.0</td>
          <td>2026-06-13</td>
          <td>🔒 跨域重定向时自动剥离敏感请求头（防 API Key 泄露）；拒绝畸形 URL，收紧原型污染防护</td>
        </tr>
        <tr>
          <td>1.18.1</td>
          <td>2026-06-21</td>
          <td>修复 <code>AxiosError</code> 循环序列化、Node HTTP 适配器代理流等问题</td>
        </tr>
      </tbody>
    </table>

    <h4>⚠️ 高危漏洞：CVE-2026-40175（CVSS 10.0）</h4>
    <p>这是迄今影响 axios 最严重的漏洞，CVSS 满分 10.0。</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">项目</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>漏洞类型</td>
          <td>Gadget 攻击链 —— 将第三方依赖中的<em>原型污染漏洞</em>升级为<em>远程代码执行（RCE）</em></td>
        </tr>
        <tr>
          <td>攻击路径</td>
          <td>攻击者通过污染 <code>Object.prototype</code>，借助 axios 内部的配置合并逻辑作为 Gadget，触发 RCE</td>
        </tr>
        <tr>
          <td>云环境影响</td>
          <td>可绕过 <strong>AWS IMDSv2 防护</strong>，实现完整云环境攻击（读取实例元数据、获取临时凭证等）</td>
        </tr>
        <tr>
          <td>严重性</td>
          <td>即使本身不存在漏洞，axios 也可被用作攻击链中的放大器</td>
        </tr>
        <tr>
          <td>处置建议</td>
          <td>升级到修复版本；同时审查所有第三方依赖是否存在原型污染风险</td>
        </tr>
      </tbody>
    </table>

    <h4>附：CVSS 评分体系</h4>
    <p><strong>CVSS（Common Vulnerability Scoring System，通用漏洞评分系统）</strong>是业界标准的漏洞严重程度量化体系，由 FIRST 组织维护，分数范围 0.0 – 10.0。</p>
    <table class="table">
      <tbody>
        <tr>
          <th>分数</th>
          <th>等级</th>
          <th>含义</th>
        </tr>
        <tr>
          <td>0.0</td>
          <td>None</td>
          <td>无风险</td>
        </tr>
        <tr>
          <td>0.1 – 3.9</td>
          <td>Low</td>
          <td>低危</td>
        </tr>
        <tr>
          <td>4.0 – 6.9</td>
          <td>Medium</td>
          <td>中危</td>
        </tr>
        <tr>
          <td>7.0 – 8.9</td>
          <td>High</td>
          <td>高危</td>
        </tr>
        <tr>
          <td>9.0 – 10.0</td>
          <td><strong>Critical</strong></td>
          <td><strong>严重</strong></td>
        </tr>
      </tbody>
    </table>
    <p><strong>满分 10.0 意味着所有维度都打到最坏情况：</strong></p>
    <ul>
      <li>攻击向量：<em>网络</em>（远程可达，无需物理接触）</li>
      <li>攻击复杂度：<em>低</em>（无需特殊条件）</li>
      <li>所需权限：<em>无</em>（匿名攻击者即可）</li>
      <li>用户交互：<em>无</em>（受害者不需要做任何操作）</li>
      <li>影响：<em>CIA 全满</em>（数据泄露 + 篡改 + 服务中断）</li>
    </ul>
    <p>CVE-2026-40175 命中全部最坏项，远程无认证、无需交互、可拿到 RCE 并完整接管云环境，因此是满分。</p>

    <h4>0.x vs 1.x 核心差异</h4>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>0.x</th>
          <th>1.x</th>
        </tr>
        <tr>
          <td>构建产物</td>
          <td>Webpack，体积较大</td>
          <td>Rollup，更小更纯净</td>
        </tr>
        <tr>
          <td>错误对象</td>
          <td>普通 Error 扩展</td>
          <td><code>AxiosError</code> 独立类，含完整堆栈</td>
        </tr>
        <tr>
          <td>拦截器 return</td>
          <td>不 return 不影响（隐式通过）</td>
          <td><em>必须显式 return config / response</em>，否则请求中断</td>
        </tr>
        <tr>
          <td>fetch adapter</td>
          <td>不支持</td>
          <td>1.7.0 起内置，支持数组降级</td>
        </tr>
        <tr>
          <td>取消请求</td>
          <td>CancelToken（已废弃）</td>
          <td>推荐 <code>AbortController</code></td>
        </tr>
        <tr>
          <td>安全防护</td>
          <td>较少</td>
          <td>持续加固：SSRF、原型污染、头部注入、跨域重定向</td>
        </tr>
      </tbody>
    </table>

    <h3>二、axios.create — 创建实例</h3>
    <p>通过 <code>axios.create(config)</code> 创建一个独立实例，与全局 axios 互不干扰，适合统一管理项目请求配置。</p>
     <pre>{{ `const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  method: 'post',          // 默认请求方法
  withCredentials: true,   // 跨域携带 Cookie
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
})
` }}</pre>

    <h3>二、自定义字段挂载到 defaults</h3>
    <p>axios 在合并请求配置时，会将 <code>instance.defaults</code> 上的<em>所有字段</em>（包括自定义字段）合并进每次请求的 <code>config</code>，拦截器中可直接从 <code>config</code> 取用，无需手动兜底。</p>
     <pre>{{ `const instance = axios.create({
  // ...标准配置...
  isShowLoading: true,         // 是否开启 loading
  isKeepLoading: false,        // 保持 loading（接口嵌套时使用）
  isShowError: true,           // 是否弹出错误提示
  isFilterStringSpace: false,  // 过滤参数值首尾空格
  isFilterObjectParams: false, // 过滤 null/undefined/''/[]/{}
})

// 拦截器中直接解构，无需 ?? instance.defaults.xxx
const { isKeepLoading, isFilterStringSpace } = config
` }}</pre>

    <h3>三、拦截器链与执行顺序</h3>
    <p>axios 将拦截器和 <code>dispatchRequest</code> 拼接成一条 Promise 链：</p>
     <pre>{{ `Promise.resolve(config)
  .then(请求拦截器.success,  请求拦截器.error)
  .then(dispatchRequest,     undefined)       ← 无 error handler，拒绝直接穿透
  .then(响应拦截器.success,  响应拦截器.error)
` }}</pre>
    <p><strong>请求拦截器注册顺序：LIFO（后注册先执行）</strong>，适合做降级拦截 demo。</p>
    <p><strong>错误传递规则：</strong>请求拦截器抛出的错误会穿透 <code>dispatchRequest</code>，最终到达响应拦截器的 error 回调。因此错误处理统一放在响应拦截器，避免重复处理（弹两次 toast、loading 计算错误）。</p>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>请求拦截器 error</th>
          <th>响应拦截器 error</th>
        </tr>
        <tr>
          <td>触发时机</td>
          <td>拦截器链内部出错（极少）</td>
          <td>网络错误 / 4xx / 5xx / 请求拦截器错误穿透</td>
        </tr>
        <tr>
          <td>error.config</td>
          <td>可能为 undefined</td>
          <td>通常存在，但需 <code>|| {}</code> 兜底</td>
        </tr>
        <tr>
          <td>本项目处理策略</td>
          <td>只透传，不处理</td>
          <td>统一处理 loading、错误提示</td>
        </tr>
      </tbody>
    </table>

    <h3>四、loading 并发计数</h3>
    <p>多个请求同时发出时，用计数器管理 loading，避免提前关闭或重复创建：</p>
     <pre>{{ `let loadCount = 0
let loadRef = null

// 开启：每个请求 +1，只创建一个 loading 实例
loadCount++
if (!loadRef) loadRef = ElLoading.service({ lock: true, text: '加载中...' })

// 关闭：每个请求 -1，归零时才真正关闭
loadCount = Math.max(0, loadCount - 1)  // 防负数兜底
if (loadCount <= 0 && !isKeepLoading) {
  loadRef?.close()
  loadRef = null
}
` }}</pre>
    <p><code>isKeepLoading: true</code> 用于嵌套请求中的非最后一个，保持 loading 不提前关闭；<em>最后一个请求不设此项</em>，触发正常关闭。</p>

    <h3>五、adapter — 适配器</h3>
    <p>axios 底层通过 adapter 发送请求，支持三种内置类型：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>adapter</th>
          <th>适用环境</th>
          <th>说明</th>
        </tr>
        <tr>
          <td><code>xhr</code></td>
          <td>浏览器</td>
          <td>默认，基于 XMLHttpRequest</td>
        </tr>
        <tr>
          <td><code>fetch</code></td>
          <td>现代浏览器 / Node 18+</td>
          <td>基于 Fetch API，支持流式响应</td>
        </tr>
        <tr>
          <td><code>http</code></td>
          <td>Node.js</td>
          <td>基于 Node http/https 模块</td>
        </tr>
      </tbody>
    </table>
    <p>支持<em>数组格式</em>，按优先级依次尝试，取第一个可用的（降级兜底）：</p>
     <pre>{{ `adapter: ['fetch', 'xhr']   // 优先 fetch，不支持则降级 xhr
` }}</pre>
    <p>也可传入<em>自定义函数</em>，本项目 mock 就是通过注入自定义 adapter 实现的：</p>
     <pre>{{ `// development 环境命中 mockMap，注入自定义 adapter，不发真实请求
if (process.env.NODE_ENV === 'development' && mockMap[config.url] !== undefined) {
  config.adapter = () => Promise.resolve({
    data: mockMap[config.url],
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  })
}
` }}</pre>

    <h3>六、防缓存策略</h3>
    <p>两种方式可以二选一，也可同时使用：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>方式</th>
          <th>配置位置</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>请求头 Cache-Control</td>
          <td>axios 实例 headers</td>
          <td><code>Cache-Control: no-cache</code> + <code>Pragma: no-cache</code>，需服务端配合响应头</td>
        </tr>
        <tr>
          <td>时间戳参数 <code>_t</code></td>
          <td>请求拦截器</td>
          <td>给 params 附加 <code>_t: Date.now()</code>，每次 URL 不同，浏览器不走缓存</td>
        </tr>
      </tbody>
    </table>

    <h3>七、withCredentials</h3>
    <p>控制跨域请求是否携带凭证（Cookie、Authorization 等）。</p>
     <pre>{{ `withCredentials: true   // 跨域请求携带 Cookie
` }}</pre>
    <p>需要<em>前后端同时配置</em>，服务端必须返回：</p>
     <pre>{{ `Access-Control-Allow-Origin: http://具体域名   ← 不能用 *
Access-Control-Allow-Credentials: true
` }}</pre>

    <h3>八、FormData 上传注意事项</h3>
    <p><strong>不要手动设置 <code>Content-Type: multipart/form-data</code></strong>。</p>
    <p><code>multipart/form-data</code> 必须包含 <code>boundary</code> 分隔符，浏览器在检测到请求体为 FormData 时会<em>自动生成并附加</em>。手动设置会覆盖掉 boundary，服务端无法解析，上传必然失败。</p>
     <pre>{{ `// ❌ 错误写法
config.headers['Content-Type'] = 'multipart/form-data'

// ✅ 什么都不做，让浏览器自动处理即可
` }}</pre>
  </div>
</template>
<script setup>
</script>
