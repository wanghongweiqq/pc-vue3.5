<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-06-12 17:20:01
 * @Description: 五子棋
 * @FilePath: /vue3.0/src/views/alone/chess/index.vue
-->
<template>
  <div class="pg-chess">
    <!-- <div class="start-animation">
      <div class="left">
        <img src="@/assets/images/ziyi.jpeg">
      </div>
      <div class="right">
        <img src="@/assets/images/jiayi.jpeg">
      </div>
    </div> -->

    <div :class="['hander-bar',{'hander-bar-show':handleBarShow}]">
      <el-button
        size="small"
        type="primary"
        @click="setRole"
      >
        设&nbsp;&nbsp;置
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="goBack"
      >
        回&nbsp;&nbsp;退
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleTime()"
      >
        {{ isPause?'开&nbsp;&nbsp;始':'暂&nbsp;&nbsp;停' }}
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="nextGame"
      >
        下一局
      </el-button>
      <span class="margin-left">
        时长：
        <el-input-number
          v-model="reflexionTime"
          :min="10"
          :max="100"
          :step="10"
          size="small"
        />
      </span>
      <span class="margin-left">
        棋型：
        <el-input-number
          v-model="chessType"
          :min="4"
          :max="10"
          :step="1"
          size="small"
        />
      </span>
      <div
        class="timer"
        @click="handleBarSwitch(true)"
      >
        <span :class="['role-tips', 'el-icon-bottom-left',{'current-role':currentRole==='black'}]" />
        <span class="remaining-time">{{ remainingTime }}</span>
        <span :class="['role-tips', 'el-icon-bottom-right',{'current-role':currentRole==='white'}]" />
      </div>
    </div>
    <div
      class="chess"
      @click="handleBarSwitch(false)"
    >
      <div
        v-if="Object.keys(roleInfo.black).length"
        class="role-info chess-left"
      >
        <div class="role-content">
          <div class="avatar">
            <img :src="getImageUrl(roleInfo.black.avatar)">
            <span />
          </div>
          <ul>
            <li><label>姓名：</label>{{ roleInfo.black.name }}</li>
            <li><label>执棋：</label>黑子</li>
            <li><label>性别：</label>{{ roleInfo.black.sex }}</li>
            <li><label>年龄：</label>{{ roleInfo.black.age }}</li>
            <li><label>胜场：</label>{{ roleInfo.black.win }}</li>
            <li><label>步数：</label>{{ stepsNumBlack }}</li>
          </ul>
        </div>
      </div>

      <div
        class="chess-main"
        :style="{width:(gridWidth*(rowColNum+1))+'px','padding-top':gridWidth+'px','padding-left':gridWidth+'px'}"
      >
        <table>
          <tr
            v-for="(row, indexRow) in chess.dataGrid"
            :key="'row'+indexRow"
          >
            <td 
              v-for="(obj, indexCol) in row"
              :key="'col'+indexCol"
              :class="[
                obj.selected,
                obj.winningClass,
                {
                  'is-ready-black':obj.isReadyToSelect&&currentRole === 'black',
                  'is-ready-white':obj.isReadyToSelect&&currentRole === 'white'
                }
              ]"
              :style="{width:gridWidth+'px',height:gridWidth+'px'}"
            >
              <span 
                @click="handleGrid(obj)"
              />
            </td>
          </tr>
        </table>
      </div>
      <div
        v-if="Object.keys(roleInfo.black).length"
        class="role-info chess-right"
      >
        <div class="role-content">
          <div class="avatar">
            <img :src="getImageUrl(roleInfo.white.avatar)">
            <span />
          </div>
          <ul>
            <li><label>姓名：</label>{{ roleInfo.white.name }}</li>
            <li><label>执棋：</label>白子</li>
            <li><label>性别：</label>{{ roleInfo.white.sex }}</li>
            <li><label>年龄：</label>{{ roleInfo.white.age }}</li>
            <li><label>胜场：</label>{{ roleInfo.white.win }}</li>
            <li><label>步数：</label>{{ stepsNumWhite }}</li>
          </ul>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="roleDialogVisible"
      title="角色设置"
      width="1000px"
      custom-class="dialog-role-set"
    >
      <div class="role-select">
        <div class="select-tips black">
          <ins />
          <b class="el-icon-arrow-down" />
          <b class="el-icon-arrow-down" />
          <b class="el-icon-arrow-down" />
          <span :class="{'hide':settedBlackIndex!==null}">待 选</span>
        </div>
        <ul class="select-avatar">
          <li
            v-for="(item,index) of roleList.data"
            :key="item.id"
          >
            <img
              :src="getImageUrl(item.avatar)"
              :class="item.selected"
              @click="roleSet(item,index)"
            >
            <p>{{ item.name }}</p>
          </li>
        </ul>
        <div class="select-tips white">
          <ins />
          <b class="el-icon-arrow-down" />
          <b class="el-icon-arrow-down" />
          <b class="el-icon-arrow-down" />
          <span :class="{'hide':settedWhiteIndex!==null}">待 选</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogCancle">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="roleDialogSure"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->

<script setup>
import {
  ref, 
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  nextTick,
} from 'vue'
import {
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import {  
  defaultBlack,
  defaultWhite,
  allRoleList,
} from './role-info'
let rafTag = null
let separator = '--'

let roleList = reactive({ data: allRoleList })
const gridWidth = ref(50) // 单个落子区域的宽高，单位px
let rowColNum = ref(0) // 棋盘的行列数，二者是相等的
let chess = reactive({
  dataGrid: [], // 棋盘的坐标数据，二维数组格式;
  dataSelected: [], // 已落子的棋盘点位信息，一维数组格式，主要用于步骤的回退
  dataWinning: [], // 获胜的棋子信息
})
let roleInfo = reactive({
  black: defaultBlack,
  white: defaultWhite,
})  

let currentRole = ref('black') // 当前步是哪方执棋:black/white
let chessType = ref(4) // 棋盘类型：4子棋/5子棋/6子棋等，其实5子以下的棋没有可玩性，先手可直接获胜
let remainingTime = ref(100) // 每次执棋的剩余时间,用于顶部展示，单位:s（秒）
let isPause = ref(false) // 是否游戏暂停，默认不暂停，也就是开启
let isFinished = ref(false) // 是否游戏结束
let reflexionTime = ref(100) //  每次执棋的总时间，单位:s（秒）
let remainingTimeOfPause = reflexionTime.value // 暂停时的倒计时时间，单位:s（秒），全局变量，非响应式数据
let roleDialogVisible = ref(false)
// let roleSetted = reactive({ data: new Array(2).fill('') })
let settedBlackIndex = ref(null) // 使用的头像数组的索引值而不是id，更方便获取需要处理的数据项，id的话还需要遍历处理，默认：null
let settedWhiteIndex = ref(null)
let justNowSettedRole = ref('white')
let handleBarShow = ref(false)

// 动态加载本地图盘
const getImageUrl = (name) => {
  // 静态资源的动态引入
  // 1、使用require
  if(name) {
    return require(`@/assets/images/${ name }`)
  }
  // 当前node版本v14.16.0，不支持下面两种方法
  // 2、使用import
  // import (`@/assets/images/${ name }`).then((module)=>{
  //   console.log('module:',module)
  //   某个动态数据=module。default
  // })
  // 3、使用new URL
  // import.meta.url 指向当前模块的 URL，拼接后生成绝对路径
  // const url = new URL(`../../assets/images/${ name }`, import.meta.url)
  // console.log('url:',url) //生成的路径为电脑的根路径，不知道如何使用
  // href: "file:///Users/wanghongwei/study/react/react-18.2/src/assets/images/css-module.png"
  // pathname: "/Users/wanghongwei/study/react/react-18.2/src/assets/images/css-module.png"
  // return url.pathname
}

// 计算黑白棋的步数
const handleBarSwitch = (val) => {
  console.log('handleBarSwitch',val)
  if(val === null || val === undefined) {
    handleBarShow.value = !handleBarShow.value
  }else{
    handleBarShow.value = val
  }
  console.log('hander-bar-show',handleBarShow.value)
}

// 计算黑白棋的步数
const stepsNumBlack = computed(() => {
  return chess.dataSelected.filter(item => item.selected === 'black').length || 0
})
const stepsNumWhite = computed(() => {
  return chess.dataSelected.filter(item => item.selected === 'white').length || 0
})

// 获胜
const gameover = (obj = {}) => {
  const { overtime } = obj
  isFinished.value = true
  let message = ''
  let winnerInfo = {}
  let loserInfo = {}
  if(overtime) { // 因超时分出胜负
    const roleWinner = currentRole.value === 'black' ? 'white' : 'black'
    winnerInfo = roleInfo[roleWinner]
    loserInfo = roleInfo[currentRole.value]
    message = `${ roleInfo[currentRole.value].name }超时，${ roleInfo[roleWinner].name }获胜！`
  }else{ // 因落子分出胜负
    const roleLoser = currentRole.value === 'black' ? 'white' : 'black'
    winnerInfo = roleInfo[currentRole.value]
    loserInfo = roleInfo[roleLoser]
    message = `${ roleInfo[currentRole.value].name }获胜！`
  }
  
  ElMessageBox.alert(message, '恭喜')

  winnerInfo.win += 1
  if(winnerInfo.id > 0 && loserInfo.id > 0) { // 只有id大于0才是自定义角色，才去记录胜负关系
    let storageAttr = ''
    let storageResult = ''
    if(winnerInfo.id < loserInfo.id) {
      storageAttr = winnerInfo.id + separator + loserInfo.id 
      storageResult = winnerInfo.win + separator + loserInfo.win 
    }else{
      storageAttr = loserInfo.id + separator + winnerInfo.id 
      storageResult = loserInfo.win + separator + winnerInfo.win 
    }
    localStorage.setItem(storageAttr,storageResult)
  }

}
// 开始计时
const startTimer = () => {
  rafTag && cancelAnimationFrame(rafTag)// 防止不断落子导致重复执行动画渲染逻辑
  const timeStart = Date.now() // 每次倒计时开启时的时间戳
  function getRemainingTime () {
    const timeCurrent = Date.now() // 当前时间戳
    // remainingTimeOfPause为每次倒计时开启时的剩余时间，不要使用remainingTime.value去做减法，那样就做累减了
    remainingTime.value = remainingTimeOfPause - Math.floor((timeCurrent - timeStart ) / 1000)
    rafTag = requestAnimationFrame(getRemainingTime)
    if(remainingTime.value <= 0) {
      console.log('计时结束' )
      gameover({ overtime: true })
      // return cancelAnimationFrame(rafTag) // 最好使用return，防止后续逻辑继续执行
    }
  }
  getRemainingTime()
}

// 计时的开启和关闭
const handleTime = (val) => {
  console.log('val',val)
  if(val === null || val === undefined) {
    isPause.value = !isPause.value
  }else{
    isPause.value = val
  }
  console.log('isPause.value',isPause.value)
  if(isPause.value) { // 游戏暂停
    remainingTimeOfPause = remainingTime.value 
    rafTag && cancelAnimationFrame(rafTag)
  }else{
    startTimer()
  }
}

watch(isFinished,(newVal) => {
  console.log('isFinished:', newVal)
  if(newVal) {
    rafTag && cancelAnimationFrame(rafTag)
  }
})

// 初始化棋盘和坐标数据
const init = () => {
  const chessWidth = Math.min(window.innerWidth - 240,window.innerHeight) // - gridWidth.value
  rowColNum.value = Math.floor(chessWidth / gridWidth.value) - 2 // -2为了上下留边
  chess.dataGrid = Array.from({ length: rowColNum.value },(_,index) => {
    let row = []
    for(let i = 0; i < rowColNum.value; i++) {
      let obj = { x: index,y: i }
      row.push(obj)
    }
    return row
  })
  if(!isPause.value) { // 游戏不是暂停状态时执行动画倒计时
    startTimer()
  }
}
// 本地存储-角色胜负关系
const getStorageWinInfo = () => {
  let storageAttr = '' // 使用id存储的用户之间的胜负关系，小id在左，大id在右
  let small,big
  if(roleInfo.black.id < roleInfo.white.id) {
    small = roleInfo.black
    big = roleInfo.white
  }else{
    small = roleInfo.white
    big = roleInfo.black
  }
  storageAttr = small.id + separator + big.id 
  const storageResult = localStorage.getItem(storageAttr)
  if(storageResult) {
    const result = storageResult.split(separator).map(item => Number(item))
    small.win = result[0]
    big.win = result[1]
  }
}

// 角色选择时tips的位置计算
const roleSelectPosition = (role,index) => {
  let relative = 0
  if(index >= 0) { // 头像选中状态，未选中时值为-1
    const avatorDom = document.querySelectorAll('.select-avatar li')[index]
    if(avatorDom) {
      const avatorDomRect = avatorDom.getBoundingClientRect()
      // 这里不要获取.select-tips的位置信息，因为它一直是移动的，后面计算translateX(var(--arrow-black))会不准，正好可以使用固定不变的.role-select来获取
      const tipsDom = document.querySelector('.role-select')
      const tipsDomRect = tipsDom.getBoundingClientRect()
      // console.log('avatorDomRect',avatorDomRect,'tipsDomRect',tipsDomRect)
      if(role === 'black') {
        // 正好选择提示区域和头像区域都是100，相等，所以不用再计算差值，应该是每个left + 对应区域宽度的一半，才是该区域的中心点
        relative = avatorDomRect.left - tipsDomRect.left 
        // 以中心为坐标点来计算：选中图像的左边界 + 图像的中心点距离该图像的左边界的宽度 -（屏幕宽度-弹窗宽度）的一半 - 弹窗的内间距 - 选中图像的左边界+tips的中心点距离该区域的左边界的宽度
        // relative = left + 50 - ( window.innerWidth - 500) / 2 - 20 - 50
      }else{
        relative = avatorDomRect.right - tipsDomRect.right
        // relative = -( window.innerWidth - left - 50 - ( window.innerWidth / 2 - 500) - 20 - 50)
      }
    }
  }
  const element = document.querySelector(`.select-tips.${ role }`)
  element.style.setProperty(`--arrow-${ role }`, relative + 'px')
}

// 本地存储-角色信息
const getStorageRoleInfo = () => {
  const roleInfoBlack = localStorage.getItem('chess-black')
  const roleInfoWhite = localStorage.getItem('chess-white')
  if(roleInfoBlack && roleInfoWhite) {
    // 左右角色的相关信息
    roleInfo.black = JSON.parse(roleInfoBlack)
    roleInfo.white = JSON.parse(roleInfoWhite)
  }
  getStorageWinInfo()
}
let handleClickOutside = null
const clickOutside = () => {
  handleClickOutside = (event) => {
    const handerBar = document.querySelector('.hander-bar')
    const result = handerBar.contains(event.target)
    if(!result) {
      handleBarShow.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
}

onMounted(() => {
  init()
  getStorageRoleInfo()
  // clickOutside()
})
onUnmounted(() => {
  rafTag && cancelAnimationFrame(rafTag)
  // document.removeEventListener('click', handleClickOutside)
})
// 回退
const goBack = () => {
  let newest = chess.dataSelected.pop()
  console.log('newest')
  console.log(newest)
  if(!newest) {
    return ElMessageBox.alert('已清空棋盘', '提示',{
      confirmButtonText: '我知道了',
      // center: true,
      // roundButton: true,
      // showClose: false,
      closeOnClickModal: true,
    })
  }
  const { x,y } = newest
  chess.dataGrid[x][y] = { x,y }
  chess.dataWinning.forEach(item => item.winningClass = '') // 之前 取胜的棋子类名重置
  currentRole.value = currentRole.value === 'black' ? 'white' : 'black'
  remainingTimeOfPause = reflexionTime.value
  startTimer()
}

// 计算水平方向的个数
const getHorizontal = (obj) => {
  let num = 0,list = []
  const { x,y,selected } = obj
  // 左边
  for(let v = y - 1; v >= 0; v--) {
    if(chess.dataGrid[x][v].selected === selected) { 
      num++
      list.unshift(chess.dataGrid[x][v])
    }else{
      break
    }
  }
  list.push(chess.dataGrid[x][y])
  // 右边
  for(let v = y + 1; v < rowColNum.value; v++) {
    if(chess.dataGrid[x][v].selected === selected) { 
      num++
      list.push(chess.dataGrid[x][v])
    }else{
      break
    }
  }
  return { num,list }
}
// 计算垂直方向的个数
const getVertical = (obj) => {
  let num = 0,list = []
  const { x,y,selected } = obj
  // 上边
  for(let h = x - 1; h >= 0; h--) {
    if(chess.dataGrid[h][y].selected === selected) { 
      num++
      list.unshift(chess.dataGrid[h][y])
    }else{
      break
    }
  }
  list.push(chess.dataGrid[x][y])
  // 下边
  for(let h = x + 1; h < rowColNum.value; h++) {
    if(chess.dataGrid[h][y].selected === selected) { 
      num++
      list.push(chess.dataGrid[h][y])
    }else{
      break
    }
  }
  return { num,list }
}

// 计算左上到右下方向的个数
const getLeftTopToRightBottom = (obj) => {
  let num = 0,list = []
  const { x,y,selected } = obj
  // 左上
  for(let v = y - 1 , h = x - 1; v >= 0 && h >= 0; v--, h--) {
    if(chess.dataGrid[h][v].selected === selected) { 
      num++
      list.unshift(chess.dataGrid[h][v])
    }else{
      break
    }
  }
  list.push(chess.dataGrid[x][y])
  // 右下
  for(let v = y + 1 , h = x + 1; v < rowColNum.value && h < rowColNum.value; v++, h++) {
    if(chess.dataGrid[h][v].selected === selected) { 
      num++
      list.push(chess.dataGrid[h][v])
    }else{
      break
    }
  }
  return { num,list }
}

// 计算右上到左下方向的个数
const getRightTopToLeftBottom = (obj) => {
  let num = 0,list = []
  const { x,y,selected } = obj
  // 右上
  for(let h = x - 1 , v = y + 1; h >= 0 && v < rowColNum.value; h--, v++) {
    if(chess.dataGrid[h][v].selected === selected) { 
      num++
      list.unshift(chess.dataGrid[h][v])
    }else{
      break
    }
  }
  list.push(chess.dataGrid[x][y])
  // 左下
  for(let h = x + 1 , v = y - 1; h < rowColNum.value && v >= 0; h++, v--) {
    if(chess.dataGrid[h][v].selected === selected) { 
      num++
      list.push(chess.dataGrid[h][v])
    }else{
      break
    }
  }
  return { num,list }
}
// 方法队列，有结果后立马退出执行
const queueFunction = (...args) => {
  const [obj,rule,...arr] = args
  for(const item of arr) {
    let { num,list } = item(obj)
    const winResult = rule(num)
    console.log('winResult')
    console.log(winResult)
    if (winResult) {
      list.forEach((item,index) => item.winningClass = `winning-${ index }`)
      chess.dataWinning = list
      return true
    }
  }
  return false
}

// 判断胜负的规则
const rule = (num) => {
  return num >= chessType.value - 1
}

// 计算结果
const calculateResult = (obj) => {
  return queueFunction(
    obj
    ,rule // 判断胜负的规则，是一个方法
    ,getHorizontal // 判断水平方向
    ,getVertical // 判断垂直方向
    ,getLeftTopToRightBottom // 判断左上到右下方向
    ,getRightTopToLeftBottom // 判断右上到左下方向
  )
}

// 棋盘信息重置某个属性
const resetChessProperty = (str) => {
  chess.dataGrid.forEach(item => {
    item.forEach(grid => {
      delete grid[str]
    })
  })

}
// 操作棋子
const handleGrid = (obj) => {
  if(obj.selected || isPause.value || isFinished.value ) { return }
  // 是否为待选择区
  if(obj.isReadyToSelect) { // true/false
    obj.isReadyToSelect = false
    obj.selected = currentRole.value // white/black
    chess.dataSelected.push(obj)
    const isGetWinner = calculateResult(obj)
    console.log('isGetWinner',isGetWinner)
    if(isGetWinner) {
      setTimeout(() => {
        gameover()
        // isFinished.value = true
        // ElMessageBox.alert(`${ currentRole.value } 胜出了！`, '恭喜')
      },1500)
    }else{
      currentRole.value = currentRole.value === 'black' ? 'white' : 'black'
      remainingTimeOfPause = reflexionTime.value
      startTimer()
    }
  }else{
    resetChessProperty('isReadyToSelect')
    obj.isReadyToSelect = true
  }
}

// 下一局
const nextGame = () => {
  chess.dataSelected = []
  chess.dataWinning = []
  currentRole.value = 'black'
  remainingTime.value = null
  isPause.value = false
  isFinished.value = false
  remainingTimeOfPause = reflexionTime.value
  init()
}
// 设置角色的弹窗开启
const setRole = async () => {
  roleDialogVisible.value = true
  handleTime(true) 
  // 角色选择弹窗的相关信息
  for(const [index,item] of roleList.data.entries()) {
    if(item.id === roleInfo.black.id) {
      settedBlackIndex.value = index
      item.selected = 'black'
    }
    if(item.id === roleInfo.white.id) {
      settedWhiteIndex.value = index
      item.selected = 'white'
    }
  }
  await nextTick() // 当后面的操作涉及到操作dom的时候，要用nextTick，等待执行渲染后再执行后面的逻辑
  roleSelectPosition('black',settedBlackIndex.value)
  roleSelectPosition('white',settedWhiteIndex.value)
}

// 角色选择
const roleSet = (item,index) => {
  console.log('角色选择')
  console.log(item)
  console.log(settedBlackIndex.value)
  if(item.selected) {
    if(item.selected === 'black') {
      settedBlackIndex.value = null
      roleSelectPosition('black',-1)
    }else{
      settedWhiteIndex.value = null
      roleSelectPosition('white',-1)
    }
    item.selected = ''
    justNowSettedRole.value = null
  }else{
    if(settedBlackIndex.value !== null && settedWhiteIndex.value !== null) { // 黑白都已设置好，此时点击的第三个角色
      if(justNowSettedRole.value === 'black' ) {
        roleList.data[settedBlackIndex.value].selected = ''// 将已选中的黑子恢复为普通
        item.selected = 'black'
        settedBlackIndex.value = index
        // justNowSettedRole.value = 'black'
        roleSelectPosition('black',index)
      }else{
        roleList.data[settedWhiteIndex.value].selected = ''// 将已选中的白子恢复为普通
        item.selected = 'white'
        settedWhiteIndex.value = index
        // justNowSettedRole.value = 'white'
        roleSelectPosition('white',index)
      }
    }else if(settedBlackIndex.value !== null) {
      item.selected = 'white'
      settedWhiteIndex.value = index
      justNowSettedRole.value = 'white'
      roleSelectPosition('white',index)
    }else{
      item.selected = 'black'
      settedBlackIndex.value = index
      justNowSettedRole.value = 'black'
      roleSelectPosition('black',index)
    }
  }
}
// 角色选择弹窗关闭
const roleDialogSure = () => {
  if(settedBlackIndex.value !== null && settedWhiteIndex.value !== null) {
    roleInfo.black = roleList.data[settedBlackIndex.value]
    roleInfo.white = roleList.data[settedWhiteIndex.value]
    nextGame()
    localStorage.setItem('chess-black',JSON.stringify( roleInfo.black))
    localStorage.setItem('chess-white',JSON.stringify( roleInfo.white))
    getStorageWinInfo()
    roleDialogVisible.value = false
  }else{
    ElMessage.warning('请选择黑白双方角色')
  }
}
// 角色选择弹窗关闭
const roleDialogCancle = () => {
  console.log('角色选择弹窗关闭')
  roleDialogVisible.value = false

}

</script>
<style lang="scss">
@import "./index.scss";
</style>