import { MUT_SPACE } from '@/assets/js/mutation-types'
const state = {
  space: '张三',
}

const mutations = {
  [MUT_SPACE] (state,val) {
    state.space = val
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
