<template>
  <div class="cp-crumb">
    <a href="/">
      <el-icon class="icon-home"><House /></el-icon>
    </a>
    <el-link
      v-for="(item, index) in crumbsList"
      :key="index"
      :type="index===crumbsList.length-1?'primary':'info'"
      :class="item.href?'cursor-pointer':''"
      underline="never"
      :icon="index===0?'':'ArrowRight'"
      @click="goPage(item)"
    >
      {{ item.name }}
    </el-link>
  </div>
</template>
<script>
export default {
  props: {
    titleList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      crumbsList: [],
    }
  },
  watch: {
    // 改用 watch + immediate:true，mounted 赋值一次不响应后续 prop 变化
    titleList: {
      immediate: true,
      handler (val) {
        this.crumbsList = (val && val.length > 0) ? val : this.$route.meta.crumb
      }
    }
  },
  methods: {
    goPage (item) {
      // 判空前置：item.href 为空时直接返回，避免 .indexOf() 空指针崩溃
      if(!item.href) return
      if(item.href.indexOf('/') === 0) {
        window.location.href = item.href
      } else {
        this.$router.push({
          name: item.href
        })
      }
    }
  }
}
</script>

<style lang="scss">
.cp-crumb{
  padding:10px 0;

  .icon-home{
    margin:-3px 5px 0 0;
    font-size:18px;
    vertical-align: middle;
  }

  .el-link{
    font-size:13px;
    cursor:default;

    i{
      margin:0 5px;
      color:#9b9b9b;
    }

    span{
      margin:0;
    }

    &.el-link--primary{
      cursor: default;
    }
  }
}
</style>
