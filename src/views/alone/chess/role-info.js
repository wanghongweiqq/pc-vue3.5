/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-03 18:58:14
 * @Description: 角色信息
 * @FilePath: /vue3.0/src/views/alone/chess/role-info.js
 */

// 根据出生日期计算年龄
const getAge = (birth) => {
  return birth ? Math.floor((Date.now() - Date.parse(birth)) / (365 * 24 * 60 * 60 * 1000)) : '未知'
}
  
const defaultBlack = {
  id: 1000,
  name: '小黑',
  avatar: 'avator-black.jpeg',
  birth: '',
  get age () { return getAge(this.birth) },
  sex: '未知',
  win: 0,
}
  
const defaultWhite = {
  id: 2000,
  name: '大白',
  avatar: 'avator-white.jpeg',
  birth: '',
  get age () { return getAge(this.birth) },
  sex: '未知',
  win: 0,
}
  
const allRoleList = [
  defaultBlack,
  {
    id: 1,
    name: '王子一',
    avatar: 'ziyi-2.jpeg',
    birth: '2019/01/06',
    get age () { return getAge(this.birth) },
    sex: '男',
    win: 0,
  },
  {
    id: 2,
    name: '王家一',
    // avatar: 'jiayi.jpeg',
    avatar: 'jiayi-4.jpeg',
    birth: '2020/10/23',
    get age () { return getAge(this.birth) },
    sex: '女',
    win: 0,
  },
  {
    id: 3,
    name: '王宏伟',
    avatar: 'hongwei-3.jpeg',
    birth: '1986/12/17',
    get age () { return getAge(this.birth) },
    sex: '男',
    win: 0,
  },
  {
    id: 4,
    name: '胡敏娜',
    avatar: 'minna-2.jpeg',
    birth: '1987/05/23',
    get age () { return getAge(this.birth) },
    sex: '女',
    win: 0,
  },
  defaultWhite,
]
  
export {
  defaultBlack,
  defaultWhite,
  allRoleList,
}