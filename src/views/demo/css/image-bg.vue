<!--
 * @Author: 王宏伟
 * @Date: 2026-06-18
 * @Description: CSS 图片与背景图相关属性
 * @FilePath: /pc-vue3.5/src/views/demo/css/image-bg.vue
-->
<template>
  <div class="bcp-image-bg content">
    <h2>CSS 图片与背景图相关属性</h2>

    <p>css新特性：<a href="https://blog.csdn.net/lgno2/article/details/139910826">2024 年 10 个很实用的 CSS 新特性，你不一定知道！</a></p>
    <!-- object-fit -->
    <h3>一、object-fit — 控制 img 如何填充容器</h3>
    <p>需先给 <em>img</em> 设置固定宽高，再通过 <em>object-fit</em> 控制图片的填充方式。</p>
    <div class="demo-row">
      <div
        v-for="item in objectFitList"
        :key="item.value"
        class="demo-item"
      >
        <img
          :src="demoImg"
          :style="{ objectFit: item.value }"
          class="demo-img"
        >
        <p class="label">
          {{ item.value }}
        </p>
        <p class="desc">
          {{ item.desc }}
        </p>
      </div>
    </div>
    <pre>
img {
  width: 150px;
  height: 100px;

  object-fit: fill;        /* 拉伸填满（默认），会变形 */
  object-fit: contain;     /* 保持比例完整显示，可能留白 */
  object-fit: cover;       /* 保持比例填满容器，裁剪多余 ✅ 最常用 */
  object-fit: none;        /* 保持原始尺寸，不缩放 */
  object-fit: scale-down;  /* 取 none 和 contain 中更小的 */
}</pre>

    <!-- object-position -->
    <h3>二、object-position — 控制图片焦点位置</h3>
    <p>配合 <em>object-fit: cover</em> 使用，控制裁剪后保留哪个区域（如人脸、Logo）。</p>
    <div class="demo-row">
      <div
        v-for="item in objectPositionList"
        :key="item.value"
        class="demo-item"
      >
        <img
          :src="demoImg"
          class="demo-img"
          :style="{ objectFit: 'cover', objectPosition: item.value }"
        >
        <p class="label">
          {{ item.value }}
        </p>
      </div>
    </div>
    <pre>
img {
  object-fit: cover;
  object-position: center center; /* 默认，居中 */
  object-position: top left;      /* 左上角 */
  object-position: 20% 80%;       /* 人脸在左下时使用 */
  object-position: 50px 100px;    /* 精确偏移 */
}</pre>

    <!-- aspect-ratio -->
    <h3>三、aspect-ratio — 强制宽高比（现代推荐）</h3>
    <p>无需手动计算高度，浏览器自动按比例计算，配合 <em>object-fit</em> 使用效果极佳。</p>
    <div class="demo-row">
      <div class="demo-item">
        <img
          :src="demoImg"
          class="demo-img-ratio"
          style="aspect-ratio: 16/9;"
        >
        <p class="label">
          16 / 9
        </p>
      </div>
      <div class="demo-item">
        <img
          :src="demoImg"
          class="demo-img-ratio"
          style="aspect-ratio: 4/3;"
        >
        <p class="label">
          4 / 3
        </p>
      </div>
      <div class="demo-item">
        <img
          :src="demoImg"
          class="demo-img-ratio"
          style="aspect-ratio: 1/1;"
        >
        <p class="label">
          1 / 1
        </p>
      </div>
    </div>
    <pre>
img {
  width: 100%;
  aspect-ratio: 16 / 9; /* 自动计算高度 */
  object-fit: cover;
}</pre>

    <!-- background-image -->
    <h3>四、background-image — 背景图基础</h3>
    <p>背景图不具备语义，适合装饰性图片、Banner、遮罩等场景，文字叠加更灵活。</p>
    <pre>
.box {
  background-image:      url('img.jpg');
  background-size:       cover;
  background-position:   center center;
  background-repeat:     no-repeat;
  background-attachment: scroll;
  background-color:      #f0f0f0; /* 图片加载失败时的兜底色 */
}

/* 简写 */
background: url('img.jpg') center/cover no-repeat #f0f0f0;</pre>

    <!-- background-size -->
    <h3>五、background-size — 背景图尺寸</h3>
    <div class="demo-row">
      <div
        v-for="item in bgSizeList"
        :key="item.value"
        class="demo-item"
      >
        <div
          class="demo-bg"
          :style="{ backgroundSize: item.value, backgroundImage: `url(${demoImg})` }"
        />
        <p class="label">
          {{ item.value }}
        </p>
        <p class="desc">
          {{ item.desc }}
        </p>
      </div>
    </div>
    <pre>
background-size: cover;       /* 填满容器，裁剪多余 ✅ 最常用 */
background-size: contain;     /* 完整显示，可能留白 */
background-size: 100% 100%;   /* 拉伸填满，会变形 */
background-size: 200px 100px; /* 固定尺寸 */
background-size: 50%;         /* 相对容器宽度 */
background-size: auto;        /* 保持原始尺寸 */</pre>

    <!-- background-position -->
    <h3>六、background-position — 背景图位置</h3>
    <pre>
/* 关键词 */
background-position: center center; /* 居中（默认）*/
background-position: top right;     /* 右上角 */

/* 百分比：以自身尺寸为参照 */
background-position: 25% 75%;

/* 精确偏移 */
background-position: 20px 50px;

/* 现代写法：指定某边偏移 */
background-position: right 20px bottom 10px;</pre>

    <!-- background-repeat -->
    <h3>七、background-repeat — 背景图重复</h3>
    <pre>
background-repeat: repeat;    /* 默认，xy 都重复 */
background-repeat: no-repeat; /* 不重复 ✅ 最常用 */
background-repeat: repeat-x;  /* 仅水平重复 */
background-repeat: repeat-y;  /* 仅垂直重复 */
background-repeat: space;     /* 均匀分布，不裁剪 */
background-repeat: round;     /* 缩放后铺满，不裁剪 */</pre>

    <!-- background-attachment -->
    <h3>八、background-attachment — 视差效果</h3>
    <div class="demo-attachment">
      <p>↓ 滚动下方区域查看 fixed 视差效果</p>
      <div class="demo-attachment-scroll">
        <div class="attachment-fixed" />
        <div class="attachment-placeholder">
          fixed 背景不随内容滚动（视差）
        </div>
        <div class="attachment-fixed" />
      </div>
    </div>
    <pre>
background-attachment: scroll; /* 默认，随页面滚动 */
background-attachment: fixed;  /* 固定背景，视差效果 ✨ */
background-attachment: local;  /* 随元素内容滚动 */</pre>

    <!-- 多背景叠加 -->
    <h3>九、多背景图叠加（CSS3）</h3>
    <p>多个背景用逗号分隔，<em>先写的在上层</em>，常用于遮罩+底图组合。</p>
    <div class="demo-multi-bg" />
    <pre>
/* 小图叠在大图上（本示例效果） */
background:
  url('small.jpg') top right / 80px 80px no-repeat,  /* 上层：右上角小图 */
  url('bg.jpg')    center    / cover    no-repeat;    /* 下层：全覆盖底图 */

/* 常见：颜色蒙层 + 底图 */
background:
  linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
  url('bg.jpg') center/cover no-repeat;</pre>

    <!-- img vs background 对比 -->
    <h3>十、img 与 background-image 选型指南</h3>
    <table class="compare-table">
      <thead>
        <tr>
          <th>场景</th>
          <th>推荐</th>
          <th>原因</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in compareList"
          :key="row.scene"
        >
          <td>{{ row.scene }}</td>
          <td><em>{{ row.recommend }}</em></td>
          <td>{{ row.reason }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 实用代码片段 -->
    <h3>十一、实用代码片段</h3>
    <pre>
/* 圆形头像裁剪 */
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top; /* 保留人脸区域 */
}

/* 全屏 Hero Banner */
.hero {
  width: 100%;
  height: 100vh;
  background: url('hero.jpg') center/cover no-repeat fixed;
}

/* 响应式图片容器 */
.img-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}</pre>

    <!-- object vs background 属性对比 -->
    <h3>十二、object-* 与 background-* 相似属性对比</h3>
    <p><em>object-*</em> 作用于 <em>&lt;img&gt;/&lt;video&gt;</em> 等替换元素，<em>background-*</em> 作用于任意元素的 CSS 背景，两者有一组概念几乎相同的属性：</p>

    <table class="compare-table">
      <thead>
        <tr>
          <th>能力</th>
          <th>object-*（img/video）</th>
          <th>background-*（CSS 背景）</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>控制填充方式</td>
          <td><em>object-fit</em></td>
          <td><em>background-size</em></td>
        </tr>
        <tr>
          <td>填满并裁剪</td>
          <td>object-fit: <em>cover</em></td>
          <td>background-size: <em>cover</em></td>
        </tr>
        <tr>
          <td>完整显示留白</td>
          <td>object-fit: <em>contain</em></td>
          <td>background-size: <em>contain</em></td>
        </tr>
        <tr>
          <td>拉伸变形填满</td>
          <td>object-fit: <em>fill</em> <span class="tag-default">默认</span></td>
          <td>background-size: <em>100% 100%</em></td>
        </tr>
        <tr>
          <td>保持原始尺寸</td>
          <td>object-fit: <em>none</em></td>
          <td>background-size: <em>auto</em> <span class="tag-default">默认</span></td>
        </tr>
        <tr>
          <td>控制焦点/位置</td>
          <td><em>object-position</em> <span class="tag-default">默认 50% 50%</span></td>
          <td><em>background-position</em> <span class="tag-default">默认 0% 0%</span></td>
        </tr>
        <tr>
          <td>值语法</td>
          <td colspan="2">
            完全相同：关键词 / 百分比 / px，如 <em>center top</em>、<em>20% 80%</em>
          </td>
        </tr>
      </tbody>
    </table>

    <pre>
/* object-* 写法 */
img {
  object-fit: cover;
  object-position: center top;
}

/* background-* 等价写法 */
.box {
  background-size: cover;
  background-position: center top;
}
    </pre>

    <table class="compare-table">
      <thead>
        <tr>
          <th>维度</th>
          <th>object-*</th>
          <th>background-*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>作用目标</td>
          <td>替换元素（<em>&lt;img&gt;</em>、<em>&lt;video&gt;</em>）</td>
          <td>任意元素的 CSS 背景层</td>
        </tr>
        <tr>
          <td>语义 / SEO</td>
          <td>✅ 有语义，可加 <em>alt</em></td>
          <td>❌ 无语义，搜索引擎忽略</td>
        </tr>
        <tr>
          <td>多图叠加</td>
          <td>❌ 不支持</td>
          <td>✅ 逗号分隔多层背景</td>
        </tr>
        <tr>
          <td>文字叠加</td>
          <td>需配合 position 布局</td>
          <td>✅ 天然支持，背景在内容下方</td>
        </tr>
        <tr>
          <td>视差效果</td>
          <td>❌ 不支持</td>
          <td>✅ background-attachment: fixed</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ImageBg',
  data () {
    return {
      demoImg: require('@/assets/images/ziyi-2.jpeg'),
      objectFitList: [
        { value: 'fill', desc: '拉伸填满，会变形' },
        { value: 'contain', desc: '完整显示，可能留白' },
        { value: 'cover', desc: '填满裁剪，不变形' },
        { value: 'none', desc: '保持原始尺寸' },
        { value: 'scale-down', desc: '取 none/contain 较小值' },
      ],
      objectPositionList: [
        { value: 'center center' },
        { value: 'top left' },
        { value: 'bottom right' },
        { value: '20% 20%' },
      ],
      bgSizeList: [
        { value: 'cover', desc: '填满裁剪' },
        { value: 'contain', desc: '完整显示' },
        { value: '100% 100%', desc: '拉伸变形' },
        { value: 'auto', desc: '原始尺寸' },
      ],
      compareList: [
        { scene: '头像、商品图、文章插图', recommend: '<img>', reason: '有语义、SEO 友好、可加 alt' },
        { scene: 'Banner / Hero 背景', recommend: 'background-image', reason: '方便文字叠加，CSS 控制灵活' },
        { scene: '装饰性纹理/背景', recommend: 'background-image', reason: '无语义，CSS 控制更灵活' },
        { scene: '需要懒加载', recommend: '<img loading="lazy">', reason: '原生懒加载支持' },
      ],
    }
  },
}
</script>

<style lang="scss">
.bcp-image-bg {
  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin: 12px 0;
  }

  .demo-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;

    .label {
      margin: 0;
      font-size: 12px;
      font-weight: bold;
      color: #333;
    }

    .desc {
      margin: 0;
      font-size: 11px;
      color: #888;
      text-align: center;
    }
  }

  .demo-img {
    display: block;
    width: 150px;
    height: 100px;
    background: #f5f5f5;
    border: 1px solid #ddd;
  }

  .demo-img-ratio {
    display: block;
    width: 200px;
    border: 1px solid #ddd;
    object-fit: cover;
  }

  .demo-bg {
    width: 150px;
    height: 100px;
    background-color: #f5f5f5;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid #ddd;
  }

  .demo-attachment {
    margin: 12px 0;

    > p {
      margin-bottom: 8px;
      font-size: 13px;
      color: #666;
    }

    .demo-attachment-scroll {
      height: 200px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .attachment-fixed {
      height: 120px;
      background: url('~@/assets/images/ziyi-2.jpeg') center/cover fixed;
    }

    .attachment-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      font-size: 14px;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .demo-multi-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120px;
    margin: 12px 0;
    font-size: 14px;
    color: #fff;
    background:
      url('~@/assets/images/minna-2.jpeg') top right / 80px 80px no-repeat,
      url('~@/assets/images/jiayi-4.jpeg') center / cover no-repeat;
    border-radius: 6px;

    &::after {
      padding: 4px 8px;
      content: '← minna-2 小图（右上）叠于 jiayi-4 底图之上';
      background: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
    }
  }

  .compare-table {
    width: 100%;
    margin: 12px 0;
    font-size: 13px;
    border-collapse: collapse;

    th,
    td {
      padding: 8px 12px;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      font-weight: bold;
      background: #f5f5f5;
    }

    tr:nth-child(even) td {
      background: #fafafa;
    }
  }

  .tag-default {
    display: inline-block;
    padding: 1px 5px;
    margin-left: 4px;
    font-size: 11px;
    color: #e6a23c;
    white-space: nowrap;
    vertical-align: middle;
    background: #fdf6ec;
    border: 1px solid #f5dab1;
    border-radius: 3px;
  }
}
</style>
