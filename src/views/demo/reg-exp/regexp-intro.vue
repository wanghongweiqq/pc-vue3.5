<template>
  <div class="content">
    <h2>正则表达式</h2>
    <h3>构建</h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="150">
            方法
          </th>
          <th>描述</th>
        </tr>
        <tr>
          <td>正则表达式字面量</td>
          <td>const pattern = /\d/g&nbsp;&nbsp;&nbsp;&nbsp;/pattern/modifier(s);</td>
        </tr>
        <tr>
          <td>RegExp对象的构造函数</td>
          <td>const pattern = new RegExp("\\d","g")&nbsp;&nbsp;&nbsp;&nbsp;注意使用元字符等特殊字符时，前面需添加转义字符\</td>
        </tr>
      </tbody>
    </table>

    <h3>修饰符 <small>修饰符用于执行不区分大小写和全局的搜索</small></h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">
            修饰符
          </th>
          <th>描述</th>
        </tr>
        <tr>
          <td>g</td>
          <td>执行全局匹配（查找所有匹配而不是在第一个匹配后停止）。</td>
        </tr>
        <tr>
          <td>i</td>
          <td>执行不区分大小写的匹配，不写i时是区分大小写的匹配规则。</td>
        </tr>
        <tr>
          <td>d</td>
          <td>执行子字符串匹配。</td>
        </tr>
        <tr>
          <td>m</td>
          <td>执行多行匹配。</td>
        </tr>
      </tbody>
    </table>

    <h3>括号 <small>括号用于查找某个范围内的字符</small></h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">
            表达式
          </th>
          <th>描述</th>
        </tr>
        <tr>
          <td>[abc]</td>
          <td>查找括号之间的任何字符</td>
        </tr>
        <tr>
          <td>[^abc]</td>
          <td>查找任何不在方括号之间的字符。</td>
        </tr>
        <tr>
          <td>[0-9]</td>
          <td>查找任何从 0 至 9 的数字。</td>
        </tr>
        <tr>
          <td>[^0-9]</td>
          <td>查找任何不在括号内的字符（任何非数字）。</td>
        </tr>
        <tr>
          <td>(x|y)</td>
          <td>查找任何指定的选项。</td>
        </tr>
      </tbody>
    </table>

    <h3>元字符 <small>元字符是具有特殊含义的字符</small></h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">
            元字符
          </th>
          <th>描述</th>
        </tr>
        <tr>
          <td>.</td>
          <td>查找单个字符，除了换行符或行终止符。转义字符：\n表示换行（LF），\r表示回车（CR）。</td>
        </tr>
        <tr>
          <td>\w</td>
          <td>查找单词字符。包含：a-z、A-Z、0-9，_（下划线）</td>
        </tr>
        <tr>
          <td>\W</td>
          <td>查找非单词字符。包含：汉字和特殊符号等</td>
        </tr>
        <tr>
          <td>\d</td>
          <td>查找数字。</td>
        </tr>
        <tr>
          <td>\D</td>
          <td>查找非数字字符。</td>
        </tr>
        <tr>
          <td>\s</td>
          <td>查找空白字符。</td>
        </tr>
        <tr>
          <td>\S</td>
          <td>查找非空白字符。</td>
        </tr>
        <tr>
          <td>\b</td>
          <td>在单词的开头/结尾查找匹配项，这里的单词指\w，XX开头如下：\bXX，XX结尾如下：XX\b。</td>
        </tr>
        <tr>
          <td>\B</td>
          <td>查找单词的中间，不在单词的开头/结尾处。12.34符合\B的位置是1和2中间，3和4中间，小数点的前后不属于单词中间</td>
        </tr>
        <tr>
          <td>\0</td>
          <td>查找 NULL 字符。</td>
        </tr>
        <tr>
          <td>\n</td>
          <td>查找换行符。</td>
        </tr>
        <tr>
          <td>\f</td>
          <td>查找换页符。</td>
        </tr>
        <tr>
          <td>\r</td>
          <td>查找回车符。</td>
        </tr>
        <tr>
          <td>\t</td>
          <td>查找制表符。</td>
        </tr>
        <tr>
          <td>\v</td>
          <td>查找垂直制表符。</td>
        </tr>
        <tr>
          <td>\xxx</td>
          <td>查找以八进制数 xxx 规定的字符。</td>
        </tr>
        <tr>
          <td>\xdd</td>
          <td>查找以十六进制数 dd 规定的字符。</td>
        </tr>
        <tr>
          <td>\uxxxx</td>
          <td>查找以十六进制数 xxxx 规定的 Unicode 字符。</td>
        </tr>
      </tbody>
    </table>

    <h3>量词 <small>能够实现更精准的匹配</small></h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="100">
            量词
          </th>
          <th>描述</th>
        </tr>
        <tr>
          <td>n*</td>
          <td>匹配任何包含零个或多个 n 的字符串。n{0,}</td>
        </tr>
        <tr>
          <td>n+</td>
          <td>匹配任何包含至少一个 n 的字符串。n{1,}</td>
        </tr>
        <tr>
          <td>n?</td>
          <td>匹配任何包含零个或一个 n 的字符串。n{0,1}</td>
        </tr>
        <tr>
          <td>n{X}</td>
          <td>匹配包含 X 个 n 的序列的字符串。</td>
        </tr>
        <tr>
          <td>n{X,Y}</td>
          <td>匹配包含 X 至 Y 个 n 的序列的字符串。</td>
        </tr>
        <tr>
          <td>n{X,}</td>
          <td>匹配包含至少 X 个 n 的序列的字符串。</td>
        </tr>
        <tr>
          <td>^n</td>
          <td>匹配任何以 n 开头的字符串。</td>
        </tr>
        <tr>
          <td>n$</td>
          <td>匹配任何以 n 结尾的字符串。</td>
        </tr>
        <tr>
          <td colspan="2">
            <p>断言根据位置分为先行断言( ?，字符串的右边/其后 )和后行断言( ?&lt;，字符串的左边/其前 )，根据是否等于又分为正向断言( = )和负向断言( ! )。感觉用右侧肯定（右侧以什么开始）/左侧否定（左侧不是以什么开始）断言这样区分更容易</p>
            <p>匹配的结果都不会包含这部分，只是为了更精准的匹配想要的部分，比如：/(?&lt;=\()(.*?)(?=\))/g 匹配左边是小括号开始，右边是小括号结束的字符串，不含小括号自身。</p>
            <p>一般会使用小括号()包起来，这时候小括号不会有捕获组的效果，在使用replace等方法涉及到捕获组的时候要特别注意。</p>
            <p>嵌套断言是以第一个断言后的位置来验证内层断言，右侧嵌套断断言是这样，但左侧嵌套断断言不是，可以理解为：左侧嵌套断言=打平后的平行断言，都是以非断言的位置开始，来依次验证两个断言，要同时成立则为true。</p>
            <p>
              <el-button
                type="primary"
                @click="duanyanFun"
              >
                断言示例
              </el-button>
            </p>
          </td>
        </tr>
        <tr>
          <td>?=n</td>
          <td>匹配任何其后紧接指定字符串 n 的字符串。也叫正向先行断言。可以简单理解为：右侧是n</td>
        </tr>
        <tr>
          <td>?!n</td>
          <td>匹配任何其后没有紧接指定字符串 n 的字符串。也叫负向先行断言。可以简单理解为：右侧不是n</td>
        </tr>
        <tr>
          <td>?&lt;=n</td>
          <td>匹配前面有指定字符串 n 的字符串。也叫正向后行断言。可以简单理解为：左侧是n</td>
        </tr>
        <tr>
          <td>?&lt;!n</td>
          <td>匹配前面没指定字符串 n 的字符串。也叫负向后行断言。可以简单理解为：左侧不是n</td>
        </tr>
      </tbody>
    </table>

    <h3>匹配策略</h3>
    <p>正则表达式默认是贪婪匹配的，会尽可能多地匹配字符。量词*、+会尽可能匹配更长的重复序列。这通常符合我们查找连续字符的需求。</p>
    <p>当有多个匹配条件时，前面的匹配尽可能长的字符串，同时尽量满足后面的条件（不会不留活路，前面匹配的都让后面匹配不上了，导致整体匹配失败）。'abc123$44d'.match(/(\w+)(\d)/)，发现前面捕获组匹配的'abc12',后面捕获组匹配的'3'</p>
    <h4>.*和 .*?</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>符号</th>
          <th>别名</th>
          <th>匹配倾向</th>
        </tr>
        <tr>
          <td>.*</td>
          <td>贪婪匹配、最大匹配、贪婪模式</td>
          <td>
            <p>尽可能多地匹配字符，直到无法匹配为止</p>
            <p>在匹配到内容后，如果导致后续模式匹配失败，会回溯以尝试满足整体匹配</p>
          </td>
        </tr>
        <tr>
          <td>.*?</td>
          <td>非贪婪匹配、最小匹配、懒惰模式</td>
          <td>
            <p>尽可能少地匹配字符，一旦满足条件就停止</p>
            <p>在满足后续模式的最小要求后立即停止，避免过度匹配</p>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <p>最大匹配小括号内的内容，以第一个左小括号开始，最后一个右小括号结束的内容，结果最多匹配到一个：/(?&lt;=\()(.*)(?=\))/g</p>
            <p>最小匹配小括号内的内容，以每一个左小括号开始，最近的一个右小括号结束的内容，结果可能匹配到多个：/(?&lt;=\()(.*?)(?=\))/g</p>
            <p>可以点击下面按钮查看具体示例：方法containFun</p>
            <p>
              <el-button
                type="primary"
                @click="containFun"
              >
                贪婪匹配
              </el-button>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const duanyanFun = () => {
  const cs = '123456789'
  const pattern3 = /((?<=\d)\d{3})+/g
  console.log(cs.match(pattern3))

  const content = '帽子价格为1$，衬衫价格为1€，短裤价格1¥'
  const pattern4 = /(\d+)(?!¥)/g
  console.log(content.match(pattern4))
  const pattern5 = /(\d+)([$€])/g
  const result = content.replace(pattern5,(match,b1,b2) => {
    console.log(match,b1,b2)
    let rate
    switch(b2) {
      case '$':
        rate = 7
        break
      case '€':
        rate = 8
        break
      default:
        rate = 1
    }
    return `${ b1 * rate }¥`
  })
  console.log(result)
}

const containFun = () => {
  const pattern0 = /\(.*\)/g
  const pattern1 = /\(.*?\)/g
  const pattern2 = /(?<=\()(.*?)(?=\))/g
  const text = '()[]{}((小括号))[中括号]{大括号}(小括号2)[中括号2]{大括号2}'
  console.log('贪婪匹配', text.match(pattern0))
  console.log('非贪婪匹配', text.match(pattern1))
  console.log('左右断言', text.match(pattern2))
}
</script>
