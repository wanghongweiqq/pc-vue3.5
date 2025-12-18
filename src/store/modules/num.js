import { MUT_COUNT } from '@/assets/js/mutation-types'
const state = {
  count: 0,
}

const getters = {
  // countBoolean: state => state.count > 10,
  countBoolean: state => {
    return (n) => state.count > n
  },
}

const mutations = {
  [MUT_COUNT] (state,n = 1) {
    state.count += n
  },
}
export default {
  // namespaced: true,
  state,
  getters,
  mutations,
}
