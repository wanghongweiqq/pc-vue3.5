<template>
  <div class="cp-crumb">
    <a
      href="/"
      class="el-icon-s-home"
    />
    <el-link
      v-for="(item, index) in crumbsList"
      :key="index"
      :type="index===crumbsList.length-1?'primary':'info'"
      :class="item.href?'cursor-pointer':''"
      :underline="false"
      :icon="index===0?'':'el-icon-arrow-right'"
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
  mounted () {
    this.crumbsList = (this.titleList && this.titleList.length > 0) ? this.titleList : this.$route.meta.crumb
  },
  methods: {
    goPage (item) {
      if(item.href.indexOf('/') === 0) {
        window.location.href = item.href
      }else if(item.href) {
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
  .el-icon-s-home{
    font-size:18px;
    vertical-align: middle;
    margin:-3px 5px 0 0;
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
