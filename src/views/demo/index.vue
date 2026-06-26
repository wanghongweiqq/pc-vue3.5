<template>
  <div class="pg-demo">
    <div class="ly-box">
      <cp-crumbs />
      <div class="content">
        <el-form
          class="list-bar"
          label-width="75px"
          size="small"
        >
          <el-form-item label="求购时间:">
            <el-date-picker
              v-model="query.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="下拉文本:">
            <el-autocomplete
              v-model.trim="query.searchText"
              clearable
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入关键词"
              @select="handleSelect"
            >
              <!-- <template
                  v-if="item"
                  #default="{ item }"
                >
                  <span>{{ item.contactsMobileMain }} - {{ item.companyName }}</span>
                </template> -->
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="普通文本:">
            <el-input
              v-model.trim="query.text"
              clearable
              placeholder="请输入普通文本"
            />
          </el-form-item>
          <el-form-item label="普通文本:">
            <el-input
              v-model.number="query.textNum"
              clearable
              placeholder="请输入普通文本"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="下拉选项:">
            <el-select
              v-model="query.select"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in listStatus"
                :key="item.id"
                :label="item.status"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          class="list-bar colum-3"
          label-width="75px"
          size="small"
        >
          <el-form-item label="求购时间:">
            <el-date-picker
              v-model="query.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="下拉文本:">
            <el-autocomplete
              v-model.trim="query.searchText"
              clearable
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入关键词"
              @select="handleSelect"
            >
              <!-- <template slot-scope="{ item }">
                  <span>{{ item.contactsMobileMain }} - {{ item.companyName }}</span>
                </template> -->
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="普通文本:">
            <el-input
              v-model.trim="query.text"
              clearable
              placeholder="请输入普通文本"
            />
          </el-form-item>
          <el-form-item label="普通文本:">
            <el-input
              v-model.number="query.textNum"
              clearable
              placeholder="请输入普通文本"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="下拉选项:">
            <el-select
              v-model="query.select"
              clearable
            >
              <el-option
                v-for="item in listStatus"
                :key="item.id"
                :label="item.status"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="button-bar">
          <el-button
            size="small"
            type="primary"
            @click="handleSearch"
          >
            确定筛选
          </el-button>
          <el-button
            size="small"
            @click="clearSearch"
          >
            重置筛选
          </el-button>
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :total="count"
            background
            size="small"
            layout="total, prev, next, sizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div class="content">
        <el-table
          :data="queryList"
          :max-height="tableMaxHeight"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column
            prop="customerName"
            label="客户名称"
            show-overflow-tooltip
            min-width="166"
          />
          <el-table-column
            prop="cloudsGatherStatus"
            label="实名认证"
            min-width="90"
          >
            <template #default="scope">
              <span v-if="scope.row&&scope.row.cloudsGatherStatus===1">
                已认证
              </span>
              <span v-else>
                未认证
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountPeriodStatus"
            label="云采状态"
            min-width="90"
          >
            <template #default="scope">
              <span v-if="scope.row.accountPeriodStatus===0">
                开启
              </span>
              <span v-else>
                停止
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalAmount"
            label="总额度"
            align="right"
            min-width="110"
          />
          <el-table-column
            prop="usedAmount"
            label="已用额度"
            align="right"
            min-width="110"
          />
          <el-table-column
            prop="availableAmount"
            label="可用额度"
            align="right"
            min-width="110"
          />
          <el-table-column
            prop="status"
            label="是否逾期"
            align="right"
            min-width="90"
          >
            <template #default="scope">
              <span v-if="scope.row.status===0">
                未逾期
              </span>
              <span v-else-if="scope.row.status===1">
                逾期
              </span>
              <span v-else>
                状态不明
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sumUsedAmount"
            label="历史使用额度"
            align="right"
            min-width="110"
          />
          <el-table-column
            prop="lastOrderTime"
            label="最近下单时间"
            align="center"
            min-width="140"
          />
          <el-table-column
            label="操作"
            min-width="210"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                plain
                size="small"
                @click="imageOpen"
              >
                查看大图
              </el-button>
              <el-button
                v-if="scope.row.accountPeriodStatus===0"
                size="small"
                type="danger"
                plain
              >
                停止
              </el-button>
              <el-button
                v-else
                size="small"
                type="success"
                plain
              >
                开启
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="count"
          background
          size="small"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <cp-seeimages
        v-model:image-show="showImg"
        :image-data="imageData"
        :image-index="imageIndex"
      />
    </div>
    <div class="content">
      <el-button
        size="small"
        type="primary"
        @click="handleSearch"
      >
        确定筛选
      </el-button>
      <el-button
        size="small"
        @click="clearSearch"
      >
        重置筛选
      </el-button>
      <el-button
        size="small"
        type="warning"
        @click="triggerRequestInterceptorError"
      >
        触发请求拦截器报错
      </el-button>
      <el-button
        size="small"
        type="success"
        @click="getFetchDetail"
      >
        fetch adapter 请求
      </el-button>
      <pre
        v-if="fetchResult"
        class="fetch-result"
      >{{ fetchResult }}</pre>
    </div>
  </div>
</template>
<script>
import utils from '@/assets/js/utils'
import CpCrumbs from '@/components/crumbs/'
import CpSeeimages from '@/components/seeimages/'
import ajax from '@/service/apis/demo'
import axiosInstance from '@/service/axios'

export default {
  components: {
    CpCrumbs,
    CpSeeimages
  },
  // mixins: [utils],
  data () {
    return {
      query: {
        time: [],
        text: null,
        searchText: null,
        textNum: null,
        select: null,
      },
      showImg: false,
      imageIndex: 0,
      // imageData: [
      //   'http://img.yunpei.com/images/operation/156163104408985156.jpg',
      //   'http://img.yunpei.com/images/operation/155591941925425462.jpg',
      //   'http://img.yunpei.com/images/operation/156163104408985156.jpg'
      // ],
      imageData: [
        {
          src: 'http://img.yunpei.com/images/operation/156163104408985156.jpg',
          name: '大幅度大幅度'
        },
        {
          src: 'http://img.yunpei.com/images/operation/155591941925425462.jpg',
          name: '22大幅度大幅度'
        },
        {
          src: '//tqmall-image.s3.cn-north-1.jcloudcs.com/web/vulnerable-stock.jpg',
          name: 'dfdskdksfa'
        }
      ],
      // 云采状态列表
      listStatus: [
        { id: 0, status: '开启' },
        { id: 1, status: '停止' },
      ],
      queryList: [],
      fetchResult: null, // fetch adapter 请求结果
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      count: 0,
    }
  },
  computed: {
    // 行高 41px + 1px 边框 = 41px，表头同高，精确匹配当前行数
    // 空数组时返回 null 不限制高度，让表格自然展示默认空状态
    tableMaxHeight () {
      if (!this.queryList.length) return null
      return this.queryList.length * 42 + 40
    },
  },
  created () {
    this.getList()
    let a = [1,2,3,4]
    a = a.sort(() => Math.random() - 0.5)
    console.log('created',a)
  },
  methods: {
    // 大图展示
    imageOpen () {
      this.showImg = true
    },
    // 搜索客户
    querySearchAsync (queryString, cb) {
      console.log(1)
      ajax.searchList({
        content: queryString,
        page: 1,
        pageSize: 10
      }).then((res) => {
        if(res.success) {
          if(res.data && res.data.length > 0) {
            cb(res.data)
          }else {
            cb([{ companyName: `未找到与 “${ queryString }” 相关的信息` }])
          }
        }
      })
    },
    // 搜索客户点选
    handleSelect (item) {
      if(item.companyName && item.id) {
        this.query.searchText = item.companyName
      }
    },
    // 分页
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    handleSearch () {
      this.currentPage = 1
      this.getList()
    },
    clearSearch () {
      this.query = {}
      this.currentPage = 1
    },
    // fetch adapter 请求示例
    getFetchDetail () {
      ajax.getDetail({ id: 1 }).then(res => {
        if (res.success) {
          this.fetchResult = JSON.stringify(res.data, null, 2)
        }
      })
    },
    // 触发请求拦截器报错示例
    // 原理：axios 请求拦截器按 LIFO 顺序执行，注册一个主动抛错的临时拦截器，
    //       它先于主拦截器执行并抛出异常，异常会传递给主拦截器的 error 回调
    triggerRequestInterceptorError () {
      const id = axiosInstance.interceptors.request.use(config => {
        throw new Error('手动触发：请求拦截器异常（demo）')
      })
      axiosInstance({ url: '/api/demo/list' }).finally(() => {
        axiosInstance.interceptors.request.eject(id) // 用完立即卸载，不影响后续请求
      })
    },
    getList () {
      ajax.getList(this.query).then((res) => {
        if (res.success) {
          let list = res.data.list || []
          // mock 返回全量数据，随机打乱模拟每次请求数据变化（实际由后端处理）
          // list = list.sort(() => Math.random() - 0.5) // 不更新， 原地排序，引用没变
          // list = [...list].sort(() => Math.random() - 0.5)
          // list = list.toSorted(() => Math.random() - 0.5)
          console.log('list',list)
          this.count = list.length
          this.queryList = list
          this.queryList.sort(() => Math.random() - 0.5) // 直接操作响应式数组
        } else {
          this.queryList = []
        }
      })
    },
  }
}
</script>
