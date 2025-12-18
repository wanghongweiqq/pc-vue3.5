/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-05-06 10:53:45
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/store/modules/user.js
 */
import { MUT_NAME } from '@/assets/js/mutation-types'
const state = {
  name: '张三',
}

const mutations = {
  [MUT_NAME] (state,val) {
    // setTimeout(() => {
    //   state.name = val
    // },1000)

    state.name = val
  },
}

const actions = {
  ACT_Name ({ commit },val) { // { state,getters,commit,dispatch }
    // console.log(state.name)
    return new Promise(resove => {
      setTimeout(() => {
        commit('MUT_NAME',val)
        resove()
      },1000)
    })
  },
  // ACT_Name (context,val) {
  //   return new Promise(resove => {
  //     setTimeout(() => {
  //       context.commit('MUT_NAME',val)
  //       resove()
  //     },1000)
  //   })
  // },
}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}
