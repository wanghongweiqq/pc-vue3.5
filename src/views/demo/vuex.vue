<template>
  <div class="pg-vuex">
    <div class="ly-box">
      <cp-crumbs :title-list="titleList" />
      <div class="content">
        <p>名称user.name ：{{ user.name }}</p>
        <p>名称nameObj：{{ nameObj }}</p>
        <el-button
          size="small"
          type="primary"
          @click="switchNameA('李四')"
        >
          异步切换actions
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="switchNameM('王五')"
        >
          切换mutations
        </el-button>
      </div>
      <div class="content marginTop20">
        <p>数量：{{ $store.state.num.count }}</p>
        <p>判断是否大于{{ num }}：{{ countBoolean(num)?`大于${num}啦`:`没有大于${num}` }}</p>
        <el-button
          size="small"
          type="primary"
          @click="add"
        >
          +{{ num }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="subtract"
        >
          -{{ num }}
        </el-button>
      </div>
      <div class="content marginTop20">
        <p>命名空间space：{{ space.space }}</p>
        <p>命名空间spaceObj：{{ spaceObj }}</p>
        <p>命名空间spaceObjB：{{ spaceObjB }}</p>
        <el-button
          size="small"
          type="primary"
          @click="spaceNameM('命名空间')"
        >
          切换mutations
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState,mapGetters, mapMutations, mapActions, } from 'vuex'
import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs,
  },
  data () {
    return {
      num: 2,
      titleList: [
        {
          name: 'DEMO',
          href: 'demo'
        },
        {
          name: 'VUEX'
        }
      ],
    }
  },
  computed: {
    ...mapState(['user','space']),
    ...mapState({
      nameObj: state => state.user.name,
      spaceObj: state => state.space.space,
    }),
    ...mapState('space',{
      spaceObjB: state => state.space,
    }),
    ...mapGetters([
      'countBoolean',
    ]),
  },
  mounted () {
    // bus.$on('busEvent', val => {
    //   console.log('父组件')
    //   console.log(val)
    // })
  },
  methods: {
    ...mapMutations([// 数组写法
      'MUT_COUNT',
      // 'space/MUT_SPACE',// ->this['space/MUT_SPACE'](name)
    ]),
    ...mapMutations('space',[
      'MUT_SPACE'// -> this.MUT_SPACE()
    ]),
    ...mapMutations({ // 对象写法
      'MUT_NAME': 'MUT_NAME',
      // 'MUT_SPACE': 'space/MUT_NAME',// 这种写法错误
    }),
    ...mapActions([
      'ACT_Name',
    ]),

    switchNameA (name) {
      this.ACT_Name(name).then(() => {
        // this.$message.success('切换成功！')
        console.log(`异步已经执行完：${ this.$store.state.user.name }`)
      })
      console.log(`异步还没执行完：${ this.$store.state.user.name }`)
    },
    switchNameM (name) {
      this.MUT_NAME(name)
      // this.$message.success('切换成功！')
      console.log(`没有异步立即执行完：${ this.$store.state.user.name }`)
    },
    add () {
      // this.$store.commit('MUT_COUNT',this.num)
      this.MUT_COUNT(this.num)
    },
    subtract () {
      this.MUT_COUNT(-this.num)
    },
    spaceNameM (name) {
      // this['space/MUT_SPACE'](name)
      this.MUT_SPACE(name)
    },

  }
}
</script>
