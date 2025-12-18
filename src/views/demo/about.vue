<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-05-06 10:53:45
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/views/demo/about.vue
-->
<template>
  <div class="pg-about">
    <cp-crumbs />
    <h1>Welcome to Your Vue.js App V=3.8.4</h1>
    <!-- <p>你好{{ _getUserInfo.userName }}</p> -->
    <div ref="msgDiv">
      {{ msg }}
    </div>
    <div v-if="msg1">
      Message got outside $nextTick: {{ msg1 }}
    </div>
    <div v-if="msg2">
      Message got inside $nextTick: {{ msg2 }}
    </div>
    <div v-if="msg3">
      Message got outside $nextTick: {{ msg3 }}
    </div>
    <button @click="changeMsg">
      Change the Message
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs
  },
  data () {
    return{
      msg: 'Hello Vue.',
      msg1: '',
      msg2: '',
      msg3: ''
    }
  },
  computed: {
    ...mapGetters([
      '_getUserInfo'
    ])
  },
  methods: {
    changeMsg () {
      this.msg = 'Hello world.'
      this.msg1 = this.$refs.msgDiv.innerHTML
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML
      })
      this.msg3 = this.$refs.msgDiv.innerHTML
    }
  }
}
</script>
