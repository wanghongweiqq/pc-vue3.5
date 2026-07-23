<template>
  <div class="content">
    <h2>类数组和可迭代对象</h2>
    <p>类数组对象和可迭代对象是两种与数组相似但各有特点的数据结构。理解它们的区别和联系，对于处理 DOM、函数参数等场景非常有帮助。</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="120">
            特性
          </th>
          <th width="400">
            类数组对象 (Array-like)
          </th>
          <th width="400">
            可迭代对象 (Iterable)
          </th>
        </tr>
        <tr>
          <td>核心定义</td>
          <td>具有数字索引和 length属性的对象</td>
          <td>实现了 Symbol.iterator方法的对象</td>
        </tr>
        <tr>
          <td>能否用 for循环 / for...of遍历</td>
          <td>一般不能（除非同时是可迭代对象）</td>
          <td>可以</td>
        </tr>
        <tr>
          <td>能否用 map、forEach遍历</td>
          <td>不能（即使是可迭代对象也不能）</td>
          <td>一般不可以（除了数组可以，字符串等都不可以）</td>
        </tr>
        <tr>
          <td>常见例子</td>
          <td>arguments对象、NodeList、HTMLCollection</td>
          <td>数组、字符串、Map、Set</td>
        </tr>
        <tr>
          <td>转换为真正数组的方法</td>
          <td>
            Array.from(arrayLike)<br>
            Array.prototype.slice.call(arrayLike)
          </td>
          <td>
            Array.from(iterable)<br>
            [...iterable](扩展运算符)
          </td>
        </tr>
        <tr>
          <td>判断方法</td>
          <td>typeof arrayLike.length === 'number' && arrayLike[0] !== undefined</td>
          <td>typeof arr[Symbol.iterator] === 'function'</td>
        </tr>
      </tbody>
    </table>
    <h3>类数组 (Array-like)</h3>
    <p>以下是一些常见的类数组对象：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>常见类数组对象</th>
          <th>描述</th>
          <th>是否可迭代</th>
          <th>是否活的 (Live)</th>
        </tr>
        <tr>
          <td>arguments</td>
          <td>函数内部包含所有实参的对象</td>
          <td>视情况而定，一般可以</td>
          <td>否</td>
        </tr>
        <tr>
          <td>NodeList</td>
          <td>如 document.querySelectorAll的返回结果</td>
          <td>是</td>
          <td>部分是</td>
        </tr>
        <tr>
          <td>HTMLCollection</td>
          <td>如 document.getElementsByTagName的返回结果</td>
          <td>否</td>
          <td>是</td>
        </tr>
        <tr>
          <td>String</td>
          <td>字符串</td>
          <td>是</td>
          <td>否</td>
        </tr>
      </tbody>
    </table>
    <h3>可迭代对象 (Iterable)</h3>
    <p>当你想使用数组的丰富方法（如 map, filter等）时，转换为真正的数组是最佳实践。推荐使用 Array.from()或扩展运算符 ...，它们代码更简洁，意图更清晰。</p>
  </div>
</template>
