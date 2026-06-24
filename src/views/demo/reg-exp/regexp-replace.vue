<template>
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
          <td>当前匹配到的完整字符串，能匹配到的最长的字符串（相当于$&amp;）。</td>
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
</template>
