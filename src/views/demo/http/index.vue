<template>
  <div class="pg-http">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="基础知识"
        name="base"
      >
        <HttpBase />
      </el-tab-pane>
      <el-tab-pane
        label="请求方法"
        name="method"
      >
        <HttpMethod />
      </el-tab-pane>
      <el-tab-pane
        label="请求体"
        name="body"
      >
        <HttpBody />
      </el-tab-pane>
      <el-tab-pane
        label="请求头"
        name="headers"
      >
        <HttpHeaders />
      </el-tab-pane>
      <el-tab-pane
        label="状态码"
        name="status"
      >
        <HttpStatus />
      </el-tab-pane>
      <el-tab-pane
        label="TCP / UDP / QUIC"
        name="tcp"
      >
        <HttpTcp />
      </el-tab-pane>
      <el-tab-pane
        label="HTTP 版本"
        name="versions"
      >
        <HttpVersions />
      </el-tab-pane>
      <el-tab-pane
        label="缓存"
        name="cache"
      >
        <HttpCache />
      </el-tab-pane>
      <el-tab-pane
        label="跨域"
        name="cors"
      >
        <HttpCors />
      </el-tab-pane>
      <el-tab-pane
        label="axios 封装总结"
        name="axiosSummary"
      >
        <AxiosSummary />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import HttpBase from './http-base'
import HttpMethod from './http-method'
import HttpBody from './http-body'
import HttpHeaders from './http-headers'
import HttpStatus from './http-status'
import HttpTcp from './http-tcp'
import HttpVersions from './http-versions'
import HttpCache from './http-cache'
import HttpCors from './http-cors'
import AxiosSummary from './axios-summary'

const activeTab = ref('base')
</script>
