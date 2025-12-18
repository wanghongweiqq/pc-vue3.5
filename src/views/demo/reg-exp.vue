<template>
  <div class="pg-reg-exp">
    <div class="ly-box">
      <cp-crumbs />
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

      <div class="content">
        <h2>捕获组</h2>
        <table class="table">
          <tbody>
            <tr>
              <th width="100">
                名称
              </th>
              <th>描述</th>
            </tr>
            <tr>
              <td>捕获组 (xxxx) </td>
              <td>
                <p>一般使用小括号括起来就会成为捕获组。</p>
                <p>特殊情况：小括号中开头使用了量词中的断言，如：?=n、?!n等，以及小括号中开头使用了专门标识不是捕获组的?:</p>
                <p>这个分组有两个作用：一是将多个字符视为一个整体，二是“记住”它匹配到的具体内容，以便后续引用。</p>
                <p>捕获组可以各自独立也可互相嵌套，以先出现左小括号为顺序。示例看查看方法：characterRepeat</p>
                <p>匹配结果：$&(整个正则匹配到的完整文本)，严格上来说它和捕获组无关。</p>
                <p>数字引用：以小括号出现的先后顺序划分：$1(第一个捕获组)、……。</p>
                <p>示例：'Hello Word!'.replace(/(Hello).*(Word)/g,'$2 $1') // 引用互换$1 $2，结果为： Word Hello! </p>
                <p>具名引用：小括号前添加具体的名称，格式为?&lt;xxx&gt;，引用的地方$&lt;xxx&gt;。</p>
                <p>示例：'2025-11-26'.replace(/(?&lt;year&gt;\d{4})-(?&lt;month&gt;\d{2})-(?&lt;day&gt;\d{2})/g,'$&lt;day&gt;/$&lt;month&gt;/$&lt;year&gt;') </p>
              </td>
            </tr>
            <tr>
              <td>反向引用、模式内引用 \n</td>
              <td>
                <p>用在正则表达式中，匹配前面第n个捕获组捕获的字符.</p>
                <p>数字反向引用：\1是一种特殊的表示法，它代表第一个捕获组所匹配到的那个确切的字符。注意，\1必须与捕获组配合使用，它引用的是分组匹配到的具体内容，而不是分组本身的正则模式。\2代表第二个捕获组所匹配到的那个确切的字符。</p>
                <p>具名反向引用：\k&lt;xxx&gt;</p>
                <p>一般后面会结合量词使用：*（零个或多个）、+（一个或多个），匹配到的结果时连续的字符（*时有可能是单个字符）</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="content">
        <h2>replace</h2>
        <h3>replace第二个参数是方法时，参数如下：</h3>
        <table class="table">
          <tbody>
            <tr>
              <th width="100">
                名称
              </th>
              <th>描述</th>
            </tr>
            <tr>
              <td>match</td>
              <td>当前匹配到的完整字符串，能匹配到的最长的字符串（相当于$&）。</td>
            </tr>
            <tr>
              <td>p1,p2,……</td>
              <td>各个捕获组匹配到的字符串（相当于$1, $2等），一个小括号是一个捕获组，有几个小括号就会有几个捕获组，也就会有几个参数。 +在小括号里和在小括号外是不一样的</td>
            </tr>
            <tr>
              <td>offset</td>
              <td>当前匹配项（也就是match）在原始字符串中的起始索引/偏移量</td>
            </tr>
            <tr>
              <td>string</td>
              <td>原始字符串</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="content">
        <h2 id="dot">
          换行操作
        </h2>
        <h3>1、br换行</h3>
        <h4>1.1、直接html书写，特殊：\n不换行当做普通字符串处理</h4>
        <p>hello word!\n<br>love you!</p>
        <h4>1.2、v-html，特殊：\n会被自动清除掉</h4>
        <p v-html="whiteSpaceString" />
        <p>v-html容易导致XSS攻击，只有在可信内容上使用它，永远不要用在用户提交的内容上</p>

        <h3>2、\n换行</h3>
        <h4>2.1、设置样式：white-space: pre-wrap</h4>
        <p class="pre-wrap">
          {{ whiteSpaceString }}
        </p>
        <h4>2.2、使用标签：pre</h4>
        <pre class="no-style">{{ whiteSpaceString }}</pre>

        <h3>把br使用replace换成\n</h3>
        <p class="pre-wrap">
          {{ whiteSpaceString.replace(/<br>/g,'\n') }}
        </p>
      </div>

      <div class="content">
        <h2>反斜杠匹配</h2>
        <p>字符串中没有\字符，因为在字符串文字中使用它时会启动转义序列。数据中如果只有1个反斜杠将无法显示也无法用正则匹配到</p>
        <p>利用数据渲染dom（或console.log）时，反斜杠需要被转义，两个反斜杠输出/显示为一个，奇数个不被渲染，直接被忽略掉</p>
        <p>数据只有奇数个反斜杠（不含其他字符）会报错</p>
        <p>{{ slashString }}</p>
      </div>

      <div class="content">
        <h2>Unicode和正则表达式</h2>
        <p>统一码（Unicode），也叫万国码、单一码，由统一码联盟开发，是计算机科学领域里的一项业界标准，包括字符集、编码方案等。</p>
        <p>统一码是为了解决传统的字符编码方案的局限而产生的，它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。</p>
        <p>这么多符号，Unicode不是一次性定义的，而是分区定义。每个区可以存放16的4次方共65536个字符，称为一个<span class="text-danger">平面（plane）</span>。目前，一共有17个平面，共1114112个字符。</p>
        <table class="table">
          <tbody>
            <tr>
              <th width="300">
                名称
              </th>
              <th>描述</th>
            </tr>
            <tr>
              <td>基本平面</td>
              <td>最前面的16的4次方共65536个字符位，放在基本平面（缩写BMP），它的码点范围是从0一直到16的4次方-1，16进制就是从U+0000到U+FFFF。所有最常见的字符都放在这个平面，这是Unicode最先定义和公布的一个平面。</td>
            </tr>
            <tr>
              <td>辅助平面</td>
              <td>（缩写SMP）剩下的字符都放在辅助平面（缩写SMP），码点范围从U+010000一直到U+10FFFF。</td>
            </tr>
            <tr>
              <td>中文</td>
              <td>Unicode编码：[\u4e00-\u9fa5]，下标：19968-40869，共20902个</td>
            </tr>
            <tr>
              <td>全角数字</td>
              <td>Unicode编码：[\uff10-\uff19]，下标：65296-65305，共10个</td>
            </tr>
            <tr>
              <td>0-9</td>
              <td>Unicode编码：[\u0030-\u0039]，下标：48-57，共10个</td>
            </tr>
            <tr>
              <td>A-Z</td>
              <td>Unicode编码：[\u0041-\u005a]，下标：65-90，共26个</td>
            </tr>
            <tr>
              <td>[,\,],^,_,`</td>
              <td>Unicode编码：[\u005b-\u0060]，下标：91-96，共6个</td>
            </tr>
            <tr>
              <td>a-z</td>
              <td>Unicode编码：[\u0061-\u007a]，下标：97-122，共26个</td>
            </tr>
            <tr>
              <td>str.charCodeAt(index)</td>
              <td>获取字符串中索引值为index的Unicode编码的下标，index默认为0，可以不写。'abc'.charCodeAt() // 97</td>
            </tr>
            <tr>
              <td>String.fromCharCode(index1,index2,……)</td>
              <td>将Unicode编码的下标转为字符/字符串。String.fromCharCode(97,98,99) // 'abc'</td>
            </tr>
            <tr>
              <td>num.toString(radix)</td>
              <td>
                <p>将数字进行不同进制(radix)之间的转化，默认进制是10，返回字符串格式。</p>
                <p>num直接使用十进制数字时必须加小括号()，如(97).toString(16)，变量或者其他进制时可以不强制加小括号。</p>
                <p>0b : 二进制，0o :八进制，0x : 十六进制，十进制正常书写，第一位是数字0，第二位是字母(一般小写，大写也可以)</p>
              </td>
            </tr>
            <tr>
              <td>toString的其他对象用法</td>
              <td>
                <p>Array：arr.toString()=arr.join()，返回字符串，以英文逗号隔开</p>
                <p>Boolean：bool.toString()，返回'false'或'true'</p>
                <p>
                  Date：date.toString()，返回Date对象转换后的字符串，date.toLocaleString()，返回地方日期格式规范的字符串，如：2023/8/1 16:30:09
                </p>
                <p>Function：fun.toString()，返回Function关键字、参数列表、函数体部分</p>
                <p>RegExp：pattern.toString()，返回正则表达式的字符串值</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>zhe
<script>

import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs,
  },
  data () {
    return{
      whiteSpaceString: 'hello word!\n<br>love you!',// 含有换行符\n
      whiteSpaceString2: 'hello word!<br />love you!',// 不含换行符\n
      // eslint-disable-next-line no-useless-escape
      slashString: '数据中4个\\\\，显示为2个，数据中5个\\\\\，显示为2个，建议是偶数个，否则会有eslint的警告',
      stringReplace: 'Y1Y2Y3Y456-MM-DD',
      url: 'https://www.baidu.com?a=[1.1,2,"中"]&b={x:2.1}&c=3.1&a=1',
      url1: 'https://www.baidu.com?x=1&a#b=1'
    }
  },
  mounted () {
    this.searchToParams(this.url1)
    // this.searchParams('a')
    // this.searchParams('b')
    // this.searchParams('c')
    // this.thousandsFun()
    // alert('a\nb')
    // this.dotFun() // 单个字符
    // this.slashFun() // 反斜杠
    // this.wFun() // 单词字符
    // this.dFun()
    // this.containFun()
    // this.captureGroup01()
    // this.captureGroup02()
    // this.captureGroup03('YYYY年MM月DD日')
    // this.yinYong()
    // this.characterRepeat()
    // this.duanyanFun()
    // this.duanyanComplex()

  },
  methods: {
    // url中匹配某个单一key，返回该key对应的value
    searchParams (key) {
      const urlEn = encodeURI(this.url) // 一般获取的都是编译以后的网址， https://www.baidu.com?a=%5B1.1,2,%22%E4%B8%AD%22%5D&b=%7Bx:2.1%7D&c=3.1
      const urlDe = decodeURIComponent(urlEn) // 要先进行反编译，转化为最初的原格式：https://www.baidu.com?a=[1.1,2,"中"]&b={x:2.1}&c=3.1
      const pattern = new RegExp(`(?<=[?&]${ key }=)([^&#]*)`,'g') // new RegExp(`[?&]${ key }=([^&#]*)`, 'g')
      // 匹配不到时结果是null，正则中是g全局匹配时，可以继续执行const exec2 = pattern.exec(urlDe),返回下一个匹配到的结果
      // ['[1.1,2,"中"]', '[1.1,2,"中"]', index: 24, input: 'https://www.baidu.com?a=[1.1,2,"中"]&b={x:2.1}&c=3.1&a=1', groups: undefined]
      const exec = pattern.exec(urlDe)
      console.log('exec',exec)
      const result = exec ? exec[0] : undefined
      return result
    },

    // url中匹配所有key，返回一个对象
    searchToParams  (url) {
      const str = decodeURIComponent(url || location.href)
      const pattern = new RegExp('(?<=[?&])(?<key>[^=]+)=(?<value>[^&#]*)','g')
      // 左侧断言也可直接使用中括号[?&]，会导致pattern.exec(str)执行后的结果中第一项值不同：含有该字符集合中的字符
      // 第一个捕获组：([^=#]+)中#是否被排除待定（目前只排除=），如：&a#b=1 如果key集合中排除#，那这段字符串解析不出来参数，如果不排除#，解析结果为{ a#b: 1 },这个要根据实际情况来定了，其实很少会有key中含有#的情况，#号后再有=的情况就更少了
      // 第二个捕获组：([^&#]*)中不排除#的话，链接中最后含有锚点时会作为参数值，如：&b=1#2 解析后为{ b: 1#2 },显然这样是不对的
      // const res = str.match(pattern) // 也可使用match，然后循环遍历中用split('=')区分出key和value
      // console.log('res',res)
      let result = {}
      let execRes
      // pattern.exec(str) exec在正则是g模式下，会不断执行直到返回null
      while( (execRes = pattern.exec(str) ) !== null) {
      // execRes结果虽然看上去是数组，但也可以直接使用.key的形式访问index和groups，groups只有在具名捕获组时才有值，默认的数字捕获组返回undefined
      // execRes结果[object Array]：['x=1', 'x', '1', index: 21, input: 'https://www.baidu.com?x=1&a#b=1', groups: {key: 'x', value: '1'}, length: 3 ]
        if(result[execRes[1]]) {
          console.log(`参数中已有属性：${ execRes[1] }：${ result[execRes[1]] }，最新值为：${ execRes[2] }`)
        }
        result[execRes[1]] = execRes[2]
        console.log('execRes',execRes)
      }
      // console.log('result',result)
      return result
    },
    // 千分位分隔符
    thousandsFun () {
      const num1 = '1234567890'
      const num2 = '1234567890.1234567890'
      const num3 = 'abc123456789.1234567890abc1234'

      console.log('以下都是非单词边界法')
      const pattern1 = /\B(?=(\d{3})*$)/g //* 也可以，因为当*是0时，正好是整数的单词边界，$是必须的，否则基本每个数字后都会添加
      const pattern2 = /\B(?=(\d{3})+$)/g

      console.log('pattern1、pattern2能匹配整数')
      console.log(num1,pattern1,num1.replace(pattern1,','))
      console.log(num1,pattern2, num1.replace(pattern2,','))
      const pattern5 = /(?=(\B)(\d{3})+$)/g // 只能匹配整数，不好理解，建议少用
      console.log(num1,pattern5,num1.replace(pattern5,','))

      console.log('\npattern1、pattern2匹配不上带小数的')
      console.log(num2,pattern1, num2.replace(pattern1,','))
      console.log(num2,pattern2, num2.replace(pattern2,','))

      console.log('\n能匹配带小数的，但整数部分字母和数字之间有可能被误分')
      const pattern4 = /(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g
      console.log(num2,pattern4,num2.replace(pattern4,','))
      console.log(num3,pattern4,num3.replace(pattern4,',')) // 如果前面有字符就会出问题，结果为：abc,123,456,789.1,234,567,890

      console.log('完美千分位正则,非单词边界法')
      // \B:非单词边界，也就是在字符串(a-z、A-Z、0-9，_)的中间位置，
      // (?=(\d{3})+(?!\d)):右侧断言必须是三个数字一组，且其后面不能再接数字（相当于是上面的$结尾的意思，但为了适应更多的格式，如含有小数点不能使用$结尾）,(?=\D)与不同(?!\d)，前者对字符串最后的数字不会划分，xxx123456其实此时三个数字一组后后面已经没了字符，因为其认为三个数字后要存在非数字字符，不能被满足，而后者认为三个数字后不能存在数字字符，能被满足。不能写作(?=(\d{3})+)(?!\d)
      // (?<=\d)(?<!\.\d*):左侧断言必须是数字(防止a123被格式化为a,123），同时后面不能是.和一串数字（排除了小数点后的数字被误格式化）,也可写作：(?<=\d(?<!\.\d*))
      const pattern3 = /(?<=\d)(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g
      console.log(num2,pattern3,num2.replace(pattern3,','))
      console.log(num3,pattern3,num3.replace(pattern3,','))

      console.log('以上都是非单词边界法，\n下面是数字匹配法')
      // patternA/patternB都可以，只是捕获到的数字不同，
      const patternA = /\d{1,3}(?=(\d{3})+$)/g // 只能匹配整数
      console.log(num1,patternA,num1.replace(patternA,'$&,'),num1.match(patternA)) // ['1', '234', '567']
      // $&代表整个匹配到的子串，而 $1代表第一个捕获组匹配到的子串。
      const patternA2 = /(\d{1,3})(?=(\d{3})+$)/g // 带有捕获组
      console.log(num1,patternA2,num1.replace(patternA2,'$1,'),num1.match(patternA2)) // ['1', '234', '567']
      const patternB = /\d(?=(\d{3})+$)/g // 只能匹配整数
      console.log(num1,patternB,num1.replace(patternB,'$&,'),num1.match(patternB)) // ['1', '4', '7']
      console.log('完美千分位正则,数字匹配法')
      const patternC = /(?<!\.\d*)\d(?=(\d{3})+(?!\d))/g
      console.log(num2,patternC,num2.replace(patternC,'$&,'))

    },

    // 单个字符
    dotFun () {
      // 查找单个字符，除了换行符或行终止符
      console.log('字符串中的换行符\\n对match有拦截作用,后面重新匹配，一共匹配到2个')
      console.log(this.whiteSpaceString.match(/l.+o/g))// 换行符\n对match有拦截作用
      console.log('字符串中没有\\n，一共匹配到1个')
      console.log(this.whiteSpaceString2.match(/l.+o/g))
    },

    // 反斜杠
    slashFun () {
      // 两个反斜杠
      const pattern = /\\\\，/g // 字面量的写法
      // const pattern = new RegExp('\\\\\\\\，','g') // 构造函数的写法
      console.log(pattern.toString())
      let result = this.slashString.replace(pattern,'反斜杠')
      console.log('slashString:\n' + this.slashString)
      console.log('pattern:\n' + pattern.toString())
      console.log('result:\n' + result)
      console.log(pattern.test(this.slashString))
      pattern.lastIndex = 0
      console.log(pattern.test('\\\\，'))
    },

    // 单词字符
    wFun () {
      const pattern1 = /\w/g
      const pattern2 = /\W/g
      const text = '我很好，I’m fine 100%!1_2-@'
      console.log('\\w（小w）result:\n', text.match(pattern1))
      console.log('\\W（大W）result:\n', text.match(pattern2))
    },
    dFun () {
      // 在js环境中\d代表的数字0-9，二者相等，\d匹配不上有些文章说的其他国的数字，比如：罗马数字，全角数字等。可能在其他语言环境下能够匹配到，比如在许多现代引擎（如 .NET、Python 3 的默认模式）中，这个没有尝试过
      const text = '半角123，_全角４５６Ⅷ½ⅠⅡα零壹XxyzXVIILeごいち（i chi）[,\\,],^,_,`'
      const pattern1 = /\d/g
      console.log('\\d result:' , text.match(pattern1))
      // 包含：a-z、A-Z、0-9，全角数字\uff10-\uff19，不含_
      // /[\w\uff10-\uff19][^_]/g // 这样会查找两个字符，第一个满足前面的合集，第二个满足后面的合集
      // /[\w\uff10-\uff19^_]/g // ^_在合集的最后边：会作为第一个合集的一部分字符，会选中含有他们的字符
      // /[^_\w\uff10-\uff19]/g // ^_在合集的最前面：选中不含方括号之间的字符
      const pattern2_1 = /[^_\w\uff10-\uff19]/g
      const pattern2_2 = /[^_]/g
      console.log('\\w含全角数字不含下划线 result:\n', text.match(pattern2_1).join('').match(pattern2_2))
      const pattern3 = /[A-Z]/g
      console.log('\\字母 result:' , text.match(pattern3))
      console.log('1111')
      console.log('0'.charCodeAt())// 65
      console.log('9'.charCodeAt())// 90
      console.log('a'.charCodeAt())// 97
      console.log('z'.charCodeAt())// 122
      let str = '' // Unicode下标转字符
      let code = [] // Unicode下标10进制转16进制，添加前缀可组合成Unicode编码
      for(let i = 91; i < 97; i++) {
        str += String.fromCharCode(i) + ','
        code.push(i.toString(16))
      }
      console.log(str + '\n' + code)// Unicode编码， 下标：91-96，符号：[,\,],^,_,`, Unicode：5b,5c,5d,5e,5f,60
      const pattern4_1 = /[[-`]/g // 中间的-是连接符，到的意思，不是一个具体的符号
      const pattern4_2 = /[\u005b-\u0060]/g
      console.log('\\特殊符号91-96 result:\n' + text.match(pattern4_1))
      console.log('\\特殊符号91-96 result:\n' + text.match(pattern4_2))

      const today = new Date()
      console.log(today + '<br />')// Tue Aug 01 2023 17:57:32 GMT+0800 (中国标准时间)
      console.log(today.toString() + '<br />')// Tue Aug 01 2023 17:57:32 GMT+0800 (中国标准时间)
      console.log(today.toLocaleString())// 2023/8/1 17:57:45
    },

    containFun () {
      const pattern0 = /\(.*\)/g // .* 贪婪模式，最大匹配
      const pattern1 = /\(.*?\)/g // .*? 非贪婪模式，最小匹配
      const pattern2 = /(?<=\()(.*?)(?=\))/g // 左右断言，断言的部分不在结果内
      const text = '()[]{}((小括号))[中括号]{大括号}(小括号2)[中括号2]{大括号2}'
      console.log('贪婪匹配', text.match(pattern0)) // ['()[]{}((小括号))[中括号]{大括号}(小括号2)']
      console.log('非贪婪匹配', text.match(pattern1)) // ['()', '((小括号)', '(小括号2)']
      console.log('左右断言', text.match(pattern2)) // ['', '(小括号', '小括号2']
    },

    duanyanFun () {
      const cs = '123456789'
      const pattern3 = /((?<=\d)\d{3})+/g // 正向后行断言
      console.log(cs.match(pattern3)) // ['234567']

      const content = '帽子价格为1$，衬衫价格为1€，短裤价格1¥'
      const pattern4 = /(\d+)(?!¥)/g // 负向先行断言
      console.log(content.match(pattern4)) // ['1', '2'] 查找不是¥的金额
      const pattern5 = /(\d+)([$€])/g // 正则中直接使用( ) $等符号需要使用反斜杠\转译，在方括号中可以直接使用
      const result = content.replace(pattern5,(match,b1,b2) => { // 将非¥的数字转化为带¥的数字
        console.log(match,b1,b2) // 1$ 1 $
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
    },
    duanyanComplex () {
      const str = 'xy1cd'
      // 嵌套断言是以第一个断言后的位置来验证内层断言，右侧嵌套断断言是这样，但左侧嵌套断断言不是，可以理解为：左侧嵌套断言=打平后的平行断言，都是以非断言的位置开始，来依次验证两个断言，要同时成立则为true。
      // 左侧断言，不管是否嵌套，都可以理解为以原位置同时判断断言
      const pattern1 = /(?<=y(?<=xy))./g // 判断一个字符的左边是字母y，同时该字符左边是字母xy(虽然和第一个重复了)，1满足
      console.log(str, pattern1, str.replace(pattern1,',')) // xy,cd
      const pattern1_1 = /(?<=y)(?<=xy)./g // 同上
      console.log(str, pattern1_1, str.replace(pattern1_1,',')) // xy,cd
      // 整体判断完了然后统一replace修改，不是说判断到一个改这一个，然后再从改过的基础上再次判断，碰到替换后的字符串总是满足正则的话，那岂不是陷入了死循环
      const pattern2 = /(?<=\D(?<=.{2}))./g // 判断一个字符的左边是一个非数字，同时该字符左边要含有两个字符，1和d满足
      console.log(str, pattern2, str.replace(pattern2,',')) // xy,c,

      const pattern3 = /.(?<=c)/g // 奇葩写法，尽量将左侧断言写在左边，右侧断言写右边，否则不容易理解。此处可以理解为一个字符的右侧字符做了左侧断言，这就回到了当前字符，及当前字符为c会被匹配到
      console.log(str, pattern3, str.replace(pattern3,',')) // xy1,d

      // 右侧断言
      const pattern4 = /.(?=c(?=d))/g // 匹配到了1：右侧是c，c的右侧是d
      console.log(str, pattern4, str.replace(pattern4,',')) // xy,cd

      const pattern5 = /.(?=c)(?=d)/g // 匹配不到：右侧是c，同时右侧是d，前后矛盾，不可能匹配到
      console.log(str, pattern5, str.replace(pattern5,',')) // xy1cd

      const pattern6 = /.(?=c)(?=\w{2})/g // 匹配到了1：右侧是c，同时右侧有两个单词字符
      console.log(str, pattern6, str.replace(pattern6,',')) // xy,cd
      return

    },
    // +在小括号里，各个捕获组匹配到的字符串是：捕获组内组合成的能在原字符串中匹配到的字符串
    captureGroup01 () {
      this.stringReplace.replace(
        /([YMDhms\d]+)(\d+)/g, // 这里分了两个捕获组，如果只有一个捕获组的话，match, p1的值相等
        (match, p1, p2, offset, string) => {
          console.log('captureGroup01 +在小括号里：')
          console.log(match, p1, p2, offset, string) // Y1Y2Y3Y456 Y1Y2Y3Y45 6 0 Y1Y2Y3Y456-MM-DD
          return match
        }
      )
    },

    // +在小括号外，各个捕获组匹配到的字符串是一个单一字符，是该捕获组的最后一个满足条件的字符。
    captureGroup02 () {
      this.stringReplace.replace(
        /([YMDhms\d])+(\d)+/g,
        (match, p1, p2, offset, string) => {
          console.log('captureGroup01 +在小括号外：')
          console.log(match, p1, p2, offset, string) // Y1Y2Y3Y456 5 6 0 Y1Y2Y3Y456-MM-DD
          return match
        }
      )
    },

    // 如果正则表达式的内容需要其他方法转化而来，无法直接通过字面量实现，这时只能使用构造函数形式
    // 正则的字面量形式：/([YMDhmsl])\1*/g
    // 正则的构造函数形式：new RegExp(`([${ timeObjKeys }])\\1*`, 'g')
    captureGroup03  (showFormat) {
      const date = new Date()
      const timeObj = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        l: date.getMilliseconds(),
      }
      let timeObjKeys = Object.keys(timeObj).join('')
      const regDate = new RegExp(`([${ timeObjKeys }])\\1*`, 'g') // 字面量形式：/([YMDhmsl])\1*/g，因不支持使用变量，顾使用的够构造函数形式。最初使用正则为：/([YMDhms])+/g，当有时间节点无缝拼接时会出错，如showFormat=YYYYMMDD，就会导致三个节点只获取了日期的节点
      const result = showFormat.replace(
        regDate,
        (match, key) => timeObj[key].toString().padStart(match.length, '0')
      )
      console.log(showFormat,result)
      return result
    },

    yinYong () {
      // 数字引用：互换$1 $2
      const yinYONG = 'Hello Word!'.replace(/(Hello).*(Word)/g,'$2 $1')
      console.log('引用互换$1 $2，结果为：',yinYONG) // 引用互换$1 $2，结果为： Word Hello!

      // 具名引用
      const date = '2025-11-26'
      const pattern1 = /(\d{4})-(\d{2})-(\d{2})/g
      const result1 = date.replace(pattern1,'$3/$2/$1')
      console.log('数字引用：',date,pattern1,result1)
      const pattern2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g
      const result2 = date.replace(pattern2,'$<day>/$<month>/$<year>')
      console.log('具名引用：',date,pattern2,result2)

      // 多个捕获组结合反向引
      // 数字反向引用
      const strA = 'aaaabbbcc'
      const regGroups = /((.)\2+)\1+/g // 捕获组2捕获的是单个字符连续>=1次，捕获组1捕获的是（单个字符连续>=2次）的>=1次，加一起的意思是两个连续字符的>=2次的重复，即单个字符连续重复2*n(n>=2)次
      console.log(regGroups, strA.match(regGroups)) // ['aaaa']
      // 具名反向引用
      const regGroups2 = /(?<double>(?<letter>.)\k<letter>+)\k<double>+/g
      console.log(regGroups2,strA.match(regGroups2)) // ['aaaa']
    },

    characterRepeat  () {
      const txt = 'aaabbc'
      // .默认不匹配换行符。如果你的字符串可能包含换行符，且需要匹配，可以考虑使用[\s\S]等其他字符集
      const reg1 = /(.)\1*/g // 匹配同一个字符连续出现>=1次(前面的元字符.代表单个字符，后面捕获组\1捕获的是和前面的元字符同样的字符，允许出现>=0次，二者相加)
      const result1 = txt.match(reg1)
      console.log('result1:',result1) // ['aaa', 'bb', 'c']

      const reg2 = /(.)\1+/g // 匹配同一个字符连续出现>=2次，不允许单个字符出现(前面的元字符.代表单个字符，后面最少连续出现1次，加一起是最少两次)
      const result2 = txt.match(reg2)
      console.log('result2:',result2) // ['aaa', 'bb']

      const reg3 = /(.)\1{1,}/g // 连续出现两次的字符，效果等同于\1+
      const result3 = txt.match(reg3)
      console.log('result3:',result3) // ['aaa', 'bb']

      const reg4 = /(.)\1{1}/g // 连续出现两次的字符，同一个字符连续出现更多次的时候，后面可以继续重新算
      const result4 = txt.match(reg4)
      console.log('result4:',result4) // ['aa', 'bb'] 如果有四个连续的a，结果为:['aa', 'aa', 'bb']

      // 只是简单的统计，没啥实际意义，后面如果又出现了相同的(letter)，结果会被不断覆盖
      const obj = {}
      txt.replace(reg1,(match,letter) => {
        obj[letter] = match.length
      })
      console.log('txt字符连续次数为：',obj) // txt字符连续次数为： {a: 3, b: 2, c: 1}

      // 连续字符压缩，通过捕获组的
      const noRepeatTxt = txt.replace(reg1,'$1') // 可以使用$&、$1……
      console.log('txt压缩掉重复的字符后，结果为：',noRepeatTxt) // txt压缩掉重复的字符后，结果为：abc
    }
  }
}
</script>
<style lang="scss">
.pg-reg-exp {
  .pre-wrap {
    white-space: pre-wrap;
  }

  .no-style {
    padding: 5px 0;
    font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
    background-color: transparent;
  }
}
</style>
