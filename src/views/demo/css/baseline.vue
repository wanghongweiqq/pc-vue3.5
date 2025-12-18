<template>
  <div class="bcp-baseline content">
    <h2>align-items: baseline;的说明</h2>
    <p>padding / margin / font-size / line-height，不会影响文字之间的基线对齐(文字的下边沿对齐)，但有可能是文字整体上下移动（比如整体行高太高导致顶部空间不够时）。</p>
    <p>父元素即使设置了字体大小，但如果html中没有直接的文字，子元素不会按该字体大小对齐，这和vertical-align不同</p>
    <div class="flex-baseline">
      字80px
      <span class="text-1">11第一块文字</span>
      <span class="text-2">22第二块文字</span>
      <span class="text-3">33第三块文字</span>
    </div>
    <div class="flex-baseline">
      <!-- 字80px -->
      <span class="text-1">11第一块文字</span>
      <span class="text-2">22第二块文字</span>
      <span class="text-3">33第三块文字</span>
    </div>

    <h2>容器的属性</h2>
    <p>flex-direction: row | row-reverse | column | column-reverse; 属性决定主轴的方向（即项目的排列方向）</p>
    <p>flex-wrap: nowrap | wrap | wrap-reverse;一行排不下后如何换行</p>
    <p>flex-flow: flex-direction属性和flex-wrap属性的简写形式</p>
    <p>justify-content: flex-start | flex-end | center | space-between | space-around 属性定义了项目在主轴上的对齐方式</p>
    <p>align-items: flex-start | flex-end | center | baseline | stretch; 属性定义项目在交叉轴上如何对齐。</p>
    <p>align-content: flex-start | flex-end | center | space-between | space-around | stretch; 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。</p>

    <h2>vertical-align</h2>
    <p>首先，看官方文档给的定义：vertical-align这个是设置元素的垂直排列的.用来定义行内元素的基线相对于该元素所在行的基线的垂直对齐。</p>
    <p>它的值比较多：baseline(默认值) | text-top | text-bottom | sub | super | top |  middle | bottom | inherit</p>
    <p>1、middle：并非让元素在父容器中垂直居中，而是让元素的中点对齐父元素的基线（baseline）加上 x-height 的一半（x-height 是小写字母 x 的高度）。这种对齐方式非常依赖于父元素的字体和行高设置，并且容易受到父元素内其他行内元素（尤其是文本）的影响，因此常常会出现“看似略微向下偏移”的现象</p>
    <p>2、top：使元素的顶部(可以理解为行内块的顶部，并不是文字的顶部，line-height/padding-top会让顶部更偏上)与其所在行的顶部对齐</p>
    <p>3、bottom：使元素底部与所在行的底部对齐</p>

    <h3>以下是父元素设置font-size的情况，即使html中没有直接的文字内容或者子元素中有更大的字体（更高的行内元素），也会按父元素的这个字体大小去对齐</h3>
    <p>1、padding四个内间距全部生效，margin的左右外边距生效，上线外边距不生效，inline-block时全部生效</p>
    <p>2、padding / margin / font-size不会影响文字的对齐基线，但有可能是文字整体上下移动。</p>
    <p>3、line-height会影响部分属性的对齐，比如：text-top / text-bottom / top / bottom / ，不影响：middle / super / sub / baseline</p>
    <p>vertical-align: text-top;会将父文字挤下来，所以注释掉该示例。</p>
    <p>父：font-size:80px，height:120px，子元素b：font-size:80px；vertical-align: top;</p>
    <div class="vertical-align">
      <p class="line-40" />
      字80x
      <!-- <span class="vertical-text-top">形式: text-top</span> -->
      <b>字90</b>
      <span class="vertical-text-bottom">形式: text-bottom</span>
      <span class="vertical-top">形式: top</span>
      <span class="vertical-middle">形式: middle</span>
      <span class="vertical-bottom">形式: bottom</span>
      <span class="vertical-super">形式: super</span>
      <span class="vertical-sub">形式: sub</span>
      <span class="vertical-baseline">形式: baseline</span>
    </div>

    <h3>以下是父元素不设置font-size的情况，那就要先找“带头大哥”，再向他看齐</h3>
    <p>该声明(vertical-align:middle)不会让子元素在父框内垂直居中，即使子元素使用了display:inline-block，如果有多个子元素，会让多个子元素以最高的元素垂直居中</p>

    <p>baseline对齐，1倍字体为14px，字体逐渐翻倍</p>
    <p>以高度最大的行内元素为基准，然后对齐，也就是说先找带头大哥，然后再向他看齐</p>
    <div class="vertical-align-2 baseline">
      <span class="font-1">1倍字体</span>
      <span class="font-2">2倍字体</span>
      <span class="font-3">3倍字体</span>
    </div>

    <p>top对齐，1倍字体为14px，字体逐渐翻倍，对齐的是行内块的顶部，并不是文字的顶部，line-height/padding-top会让顶部更偏上</p>
    <div class="vertical-align-2 top">
      <span class="font-1">1倍字体</span>
      <span class="font-2">2倍字体</span>
      <span class="font-3">3倍字体</span>
    </div>

    <p>middle对齐，1倍字体为14px，字体逐渐翻倍</p>
    <div class="vertical-align-2 middle">
      <span class="font-1">1倍字体</span>
      <span class="font-2">2倍字体</span>
      <span class="font-3">3倍字体</span>
    </div>

    <p>middle对齐，字体统一为14px，行高逐渐翻倍</p>
    <div class="vertical-align-2 middle">
      <span class="line-1">1倍行高</span>
      <span class="line-2">2倍行高</span>
      <span class="line-3">3倍行高</span>
    </div>
  </div>
</template>

<style lang="scss">
.bcp-baseline {
  .flex-baseline {
    display: flex;
    // align-items: center;
    align-items: baseline;
    height: 120px;
    font-size: 80px;
    border: 1px solid red;

    >span {
      color: #fff;
    }

    .text-1 {
      padding-top: 20px;
      // margin-top: 20px;
      font-size: 14px;
      // line-height: 42px;
      background: rgba(green, 1);
    }

    .text-2 {
      padding-bottom: 20px;
      font-size: 20px;
      background: rgba(red, 1);
    }

    .text-3 {
      margin-top: 20px;
      font-size: 30px;
      background: rgba(blue, 1);
    }
  }

  .vertical-align {
    position: relative;
    height: 120px;
    font-size: 80px;
    line-height: 1;
    border: 2px solid red;

    >span {
      // line-height: 2;
      padding: 10px;
      margin: 10px;
      font-size: 14px;
      border: 1px solid green;
    }

    >b {
      // display: none;
      font-size: 90px;
      vertical-align: top;
    }

    $types:'text-top','text-bottom','top',middle,bottom,super,sub,baseline;

    @each $type in $types {
      .vertical-#{$type} {
        vertical-align: #{$type};
      }
    }
  }

  .line-40 {
    position: absolute;
    top: 40px;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0;
    border: 2px dashed purple;
  }

  .vertical-align-2 {
    position: relative;
    height: 120px;
    border: 2px solid red;

    &.middle {
      span {
        display: inline-block;
        vertical-align: middle;
        border: 1px solid green;
      }
    }

    &.baseline {
      >span {
        vertical-align: baseline;//也可以不声明，默认就是该值
        // vertical-align: text-top;
        // vertical-align: text-bottom;
        // vertical-align: top;
        // vertical-align: bottom;
      }
    }

    &.top {
      >span {
        display: inline-block;
        vertical-align: top;
        border: 1px solid green;
      }
    }

    $list:1,2,3;

    @each $i in $list {
      .font-#{$i} {
        font-size: #{$i*14}px;
      }
    }

    @each $i in $list {
      .line-#{$i} {
        line-height: #{$i};
      }
    }
  }
}
</style>
