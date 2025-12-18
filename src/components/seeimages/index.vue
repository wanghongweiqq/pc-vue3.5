<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-05-06 10:53:45
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/components/seeimages/index.vue
-->
<template>
  <div
    v-if="showpImg"
    class="cp-seeimages"
  >
    <ul class="image-list">
      <li
        v-for="(item, index) in imageData"
        :key="index"
        :class="{'image-active':index == curIndex}"
      >
        <template
          v-if="typeof(item)==='object'"
        >
          <img :src="item.src">
          <span v-if="item.name">{{ item.name }}</span>
        </template>
        <template v-else>
          <img :src="item">
        </template>
      </li>
    </ul>
    <span
      class="el-icon-close"
      @click="popClose"
    />
    <span
      class="el-icon-arrow-left"
      @click="imageSwitch(-1)"
    />
    <span
      class="el-icon-arrow-right"
      @click="imageSwitch(+1)"
    />
    <div class="image-handle">
      <i
        class="el-icon-zoom-out"
        @click="imageAdjust(0.8)"
      />
      <i
        class="el-icon-refresh-right"
        @click="imageRotate"
      />
      <i
        class="el-icon-zoom-in"
        @click="imageAdjust(1.2)"
      />
    </div>
  </div>
</template>
<script>

export default {
  props: {
    imageIndex: {
      default: 0,
      type: Number
    },
    imageData: {
      default: () => [],
      type: Array
    },
    imageClose: {
      type: Object,
      default: () => {}
    },
    imageShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curIndex: this.imageIndex,
      curRotate: 0,
      showpImg: this.imageShow
    }
  },

  watch: {
    imageShow: {
      handler (val) {
        this.showpImg = val
      },
      immediate: true
    } 
  },

  methods: {
    // 关闭
    popClose () {
      if(this.imageClose) {
        this.$emit('imageClose')
      }else{
        this.$emit('update:imageShow', false)
      }
    },
    // 旋转
    imageRotate () {
      let $curImg = document.getElementsByClassName('image-active')[0].children
      this.curRotate += 90
      $curImg[0].style.transform = 'rotate(' + this.curRotate + 'deg)'
    },
    // 缩小/放大
    imageAdjust (multiple) {
      let $curImg = document.getElementsByClassName('image-active')[0].children[0],
        $height = $curImg.height,
        $width = $curImg.width
      // 控制不让其太小
      if ($height * multiple > 50 && $width * multiple > 50) {
        $curImg.style.height = $height * multiple + 'px'
        $curImg.style.width = $width * multiple + 'px'
      }
    },
    // 左右切换
    imageSwitch (sym) {
      let len = this.imageData.length - 1,
        index = this.curIndex + sym
      if (index < 0) {
        this.curIndex = len
      } else if (index > len) {
        this.curIndex = 0
      } else {
        this.curIndex = index
      }
    }
  }
}
</script>

<style lang="scss">
.cp-seeimages {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);

  .image-list {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    li {
      display: none;
      max-width: 80%;
      max-height: 80%;
      overflow: auto;

      img {
        display: block;
        margin: auto;
      }

      span {
        position: absolute;
        top: 5%;
        left: 50%;
        font-size: 18px;
        color: #fff;
        transform: translate(-50%, -50%);
      }

      &.image-active {
        display: block;
      }
    }
  }

  .el-icon-close {
    position: absolute;
    top: 25px;
    right: 25px;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
  }

  .el-icon-arrow-left,
  .el-icon-arrow-right {
    position: absolute;
    top: 50%;
    font-size: 50px;
    color: #fff;
    cursor: pointer;

    &.el-icon-arrow-left {
      left: 5%;
      transform: translate(-50%, -50%);
    }

    &.el-icon-arrow-right {
      right: 5%;
      transform: translate(50%, -50%);
    }
  }

  .image-handle {
    position: absolute;
    bottom: 5%;
    left: 50%;
    font-size: 30px;
    color: #fff;
    transform: translate(-50%, 50%);

    i {
      margin: 0 20px;
    }
  }
}
</style>

