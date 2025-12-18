/**
 * @author [wanghongwei]
 * @email [wanghongwei9@jd.com]
 * @create date 2020-08-07 19:01:50
 * @modify date 2020-08-07 19:01:50
 * @desc [混入mixin,在3.x中，filters过滤器被删除，不再受支持。相反，我们建议用方法调用或计算属性替换它们]
 */
import utils from '@/assets/js/utils'
import regExp from '@/assets/js/reg-exp'
export default {
  filters: {
    emptyChange (val) {
      if( val === null || val === '' || val === undefined ) {
        val = '- -'
      }
      return val
    },
    // 数字千分位分隔符展示(如何含小数最少展示两位)
    formatThousands (num) {
      let numArray = String(num).split('.')
      if(numArray[1]) {
        if(numArray[1].length === 1) {
          return numArray[0].replace(regExp.regExpThousands, '$&,') + '.' + numArray[1] + '0'
        }else {
          return numArray[0].replace(regExp.regExpThousands, '$&,') + '.' + numArray[1]
        }
      }else{
        return numArray[0].replace(regExp.regExpThousands, '$&,')
      }
    },
    // 数字取消千分位分隔符展示
    formatNoThousands (num) {
      const reg = /,/gi
      return num.replace(reg, '')
    },
    // 数字展示为带n位小数
    formatFloat (val,n) {
      return utils.formatFloat(val,n )
    },
    /* 日期格式化
     * 1. date：
		 * 字符串格式：'2020/01/01 12:00:00'、'2020-01-01'、'Jan 01 2020 12:00:00'、'Jan 01, 2020'
		 * 数字格式（1970/01/01至今毫秒数）：1577808000000
		 * 日期格式：new Date(2020,00,01,12,00,0)、new Date(字符串格式/数字格式)
		 * 2. reg：
     * [YMDhms]的任意组合形式，但要保证位数对应，注意大小写，因为有两个m
     * reg每个时间节点要有其他字符隔开，时间外的内容不要含这个字符集合中的字母
		 * 正确：YYYY-MM-DD hh:mm:ss、YYYY年MM月DD日、YYYYMMDD（做了特殊处理），错误：hhmmss
	  */
    formatTime (date, reg) {
      return utils.formatTime(date, reg )
    },
  },
}
