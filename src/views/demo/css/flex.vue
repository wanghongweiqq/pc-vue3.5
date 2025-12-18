<template>
  <div class="bcp-flex content">
    <h2>CSS Flex 弹性布局</h2>
    <p>默认值：flex-grow:0 有剩余空间也不扩展；flex-shink:1 空间不足时被压缩； flex-basis:auto  初始大小为auto</p>
    <p>flex:1 为flex-grow:1; flex-shink:1; flex-basis:0%的缩写</p>
    <p>flex-basis/width 都可以设置初始宽度，但flex-basis的权重更高</p>

    <h3>flex-grow:1与flex:1的不同</h3>
    <p>它们最本质的区别在于 flex-basis 的默认值不同：</p>
    <p>1、flex: 1等价于 flex: 1 1 0%。这里的 flex-basis: 0%意味着元素的初始大小被设置为0。因此，容器的全部空间都被视为“剩余空间”，然后由 flex-grow按比例分配。这通常会使元素更容易地均分容器的宽度。</p>
    <p>2、单独设置flex-grow: 1时，flex-basis的默认值是auto。这意味着元素的初始大小由其内容或宽度属性决定。浏览器会先为所有元素分配其内容所需的空间，然后再将容器中真正的剩余空间按flex-grow指定的比例进行分配。</p>

    <h3>如何选择</h3>
    <p>当你希望多个子元素忽略自身内容，完全均分容器的总宽度时，使用 flex: 1。这是实现等分布局的常见写法。</p>
    <p>当你希望多个子元素在保持自身内容宽度的基础上，再按比例分配剩余的空白空间时，使用 flex-grow: 1（并确保其他收缩和基准属性符合你的需求）。</p>

    <h3>下面为相关示例</h3>
    <p>下面用来获取相关字符串宽度，总宽度400，中间被flex-grow:1撑开，量取：flex-grow-1=72； flex-1=35</p>
    <div class="flex-test-1">
      <div>
        flex-grow-1
      </div>
      <div class="flex-grow-1">
        我被撑开，方便取两边字段的宽度
      </div>
      <div>
        flex-1
      </div>
    </div>

    <h4>示例1、只有中间为单独的flex-grow，所以：</h4>
    <p>1、剩余空间 = 总宽度400 - 中间默认auto宽度72 = 328</p>
    <p>2、每份空间 = 剩余空间328 / 3 = 109</p>
    <p>3、flex1宽度 = 0 + 109= 109</p>
    <p>4、flex-grow-1宽度 = 72 + 109= 181</p>
    <div class="flex-test-1">
      <div class="flex1">
        flex1
      </div>
      <div class="flex-grow-1">
        flex-grow-1
      </div>
      <div class="flex1">
        flex1
      </div>
    </div>

    <h4>示例2、两边都为flex-grow，所以：</h4>
    <p>1、剩余空间 = 总宽度400 - 两边默认auto宽度72 *2 = 256</p>
    <p>2、每份空间 = 剩余空间256 / 3 = 85</p>
    <p>3、flex1宽度 = 0 + 85= 85</p>
    <p>4、flex-grow-1宽度 = 72 + 85= 157</p>
    <div class="flex-test-1">
      <span class="flex-grow-1">
        flex-grow-1
      </span>
      <span class="flex1">
        flex1
      </span>
      <span class="flex-grow-1">
        flex-grow-1
      </span>
    </div>

    <h3>align-items: stretch(默认值) | flex-start | flex-end | center | baseline ; 属性定义项目在交叉轴上如何对齐。</h3>
    <h4>align-items: stretch; 默认值。项目被拉伸以填满容器的高度。</h4>
    <div class="flex-test-2">
      <span>宽高全部100</span>
      <p>
        <b>这里是一个flex-direction: column;的布局</b>
        <i>justify-content: space-between;</i>
      </p>
      <span>宽100</span>
    </div>
    <h4>align-items: center; 会导致item的高度不是父级高度的100%，因为只有这样才能让其在从轴方向居中，设置其他值时也是这样(normal除外)</h4>
    <div class="flex-test-2 flex-center">
      <span>宽高全部100</span>
      <p>
        <b>这里是一个flex-direction: column;的布局</b>
        <i>justify-content: space-between;</i>
      </p>
      <span>宽100</span>
    </div>

    <h4>古诗词的从右到左，从上到下展示</h4>
    <ul class="flex-test-3">
      <li>床前明月光</li>
      <li>疑是地上霜</li>
      <li>举头望明月</li>
      <li>低头思故乡</li>
    </ul>

    <h3>导航标题的水平居中</h3>
    <p>
      还是需要获取左右的宽度，再来进行居中样式的设置，才能保证这里的内容在居中的同时还能最大限度的利用宽度并且在超出宽度时出现省略号
    </p>
    <p>
      标题居中可以结合css属性text-indent，左侧有宽度，右侧没有时，可以直接取值”-左侧的宽度“，px和em都可以，超长省略号时标题自身左边不是从头开始，差之前设置的text-indent的距离，这点有些不好。
    </p>
    <div class="flex-nav">
      <div class="dot-middle" />
      <div class="left">
        左边
      </div>
      <div class="center">
        还是需要获取左右的宽度，再来进行居中样式的设置，才能保证这里的内容在居中的同时还能最大限度的利用宽度并且在超出宽度时出现省略号
        小标题
      </div>
      <div class="right">
        <!-- 右边 -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bcp-flex {
  .flex1 {
    flex: 1;
  }

  .flex-grow-1 {
    flex-grow: 1;
  }

  .flex-test-1 {
    box-sizing: border-box;
    display: flex;
    width: 400px;
    color: #000;
    border: 1px solid #000;

    $colors-map:(
      1:red,
      2:blue,
      3:green,
    );
    $colors-key-list:map-keys($colors-map);

    @each $key in $colors-key-list {
      :nth-of-type(#{$key}) {
        background-color: rgba(map-get($colors-map, $key), 0.5);
      }
    }
  }

  .flex-test-2 {
    display: flex;
    align-items: stretch;
    color: #fff;
    border: 2px solid #000;

    &.flex-center {
      align-items: center;
    }

    >span {
      width: 100px;

      &:first-of-type {
        height: 100px;
        background: purple;
      }

      &:last-of-type {
        background: red;
      }
    }

    >p {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;
      background: blue;

      b {
        background: green;
      }

      i {
        background: orange;
      }
    }
  }

  .flex-test-3 {
    display: flex;
    flex-direction: row-reverse;
    height: 150px;
    background-image: linear-gradient(#eee, #ccc);

    li {
      width: 20px;
      text-align: center;
    }
  }

  .flex-nav {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    // justify-content: flex-start;
    width: 400px;
    height: 30px;
    border: 1px solid #999;

    .dot-middle {
      position: absolute;
      top: -10px;
      left: 50%;
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      transform: translateX(-50%);
    }

    .center {
      flex: 1;
      justify-self: flex-start;
      overflow: hidden;
      text-align: center;
      // text-indent: -2em;
      text-indent: -28px;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: rgba(red, 0.4);
    }

    .right {
      // flex: 1;
      justify-self: flex-end;
      background: rgba(green, 0.4);
    }
  }
}
</style>
