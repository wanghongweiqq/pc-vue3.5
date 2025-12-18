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
          <el-button
            size="small"
            @click="goDetail"
          >
            跳转详情
          </el-button>
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :total="count"
            background
            layout="total, prev, next, sizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <el-table
        :data="queryList"
        height="540"
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="40"
        />
        <el-table-column
          prop="customerName"
          label="客户名称"
          show-overflow-tooltip
          min-width="166"
        >
          <template #default="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="toPopDetail(scope.row)"
            >
              <!-- {{ scope.row.customerName }} -->
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="cloudsGatherStatus"
          label="实名认证"
          min-width="80"
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
          min-width="80"
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
        >
          <template #default="scope">
            {{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="usedAmount"
          label="已用额度"
          align="right"
          min-width="110"
        >
          <template #default="scope">
            {{ scope.row.usedAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="availableAmount"
          label="可用额度"
          align="right"
          min-width="110"
        >
          <template #default="scope">
            {{ scope.row.availableAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否逾期"
          align="right"
          min-width="80"
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
        >
          <template #default="scope">
            {{ scope.row.sumUsedAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOrderTime"
          label="最近下单时间"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            {{ scope.row.lastOrderTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="210"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              plain
            >
              设置额度
            </el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="imageOpen"
            >
              查看大图
            </el-button>
            <el-button
              v-if="scope.row.accountPeriodStatus===0"
              size="mini"
              type="danger"
              plain
            >
              停止
            </el-button>
            <el-button
              v-else
              size="mini"
              type="success"
              plain
            >
              开启
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="count"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <cp-seeimages
        v-model:image-show="showImg"
        :image-data="imageData"
        :image-index="imageIndex"
      />
    </div>
    <div class="bottom-bar">
      <el-button
        size="mini"
        type="primary"
        @click="handleSearch"
      >
        确定筛选
      </el-button>
      <el-button
        size="mini"
        @click="clearSearch"
      >
        重置筛选
      </el-button>
    </div>
  </div>
</template>
<script>
import utils from '@/assets/js/utils'
import CpCrumbs from '@/components/crumbs/'
import CpSeeimages from '@/components/seeimages/'
import ajax from '@/service/apis/demo'

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
      showImg: true,
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
        {
          id: 0,
          status: '开启'
        },
        {
          id: 1,
          status: '停止'
        }
      ],
      queryList: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      count: 0,
    }
  },
  created () {
    // this.getList()
  },
  methods: {
    // 大图展示
    imageOpen () {
      this.showImg = true
    },
    // 搜索客户
    querySearchAsync (queryString, cb) {
      ajax.searchtList({
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
    goDetail () {
      this.$router.push({ name: 'test01Detail' })
    },
    getList () {
      ajax.getList({
        ...utils.filterParams(this.query),
        pageSize: this.pageSize,
        page: this.currentPage
      }).then((res) => {
        if (res.success) {
          this.count = res.data.totalElements
          if (res.data.content && res.data.content.length > 0) {
            this.queryList = res.data.content
          } else {
            this.queryList = []
          }
        } else {
          this.queryList = []
        }
      })
    },
  }
}
</script>

<style lang="scss">
.pg-demo {
  .bottom-bar {
    padding: 10px 0 10px 30px;
    background: #fff;
    border-top: 1px solid #d9d9d9;
    border-left: 1px solid #d9d9d9;
  }
}
</style>
