<template>
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
          <td>Unicode编码：[一-龥]，下标：19968-40869，共20902个</td>
        </tr>
        <tr>
          <td>全角数字</td>
          <td>Unicode编码：[０-９]，下标：65296-65305，共10个</td>
        </tr>
        <tr>
          <td>0-9</td>
          <td>Unicode编码：[0-9]，下标：48-57，共10个</td>
        </tr>
        <tr>
          <td>A-Z</td>
          <td>Unicode编码：[A-Z]，下标：65-90，共26个</td>
        </tr>
        <tr>
          <td>[,\,],^,_,`</td>
          <td>Unicode编码：[[-`]，下标：91-96，共6个</td>
        </tr>
        <tr>
          <td>a-z</td>
          <td>Unicode编码：[a-z]，下标：97-122，共26个</td>
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
</template>
