<template>
  <div class="container">
    <n-button text class="go-back-icon">
      <n-icon size="25" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
        >
          <path
            d="M48 256c0 114.87 93.13 208 208 208s208-93.13 208-208S370.87 48 256 48S48 141.13 48 256zm212.65-91.36a16 16 0 0 1 .09 22.63L208.42 240H342a16 16 0 0 1 0 32H208.42l52.32 52.73A16 16 0 1 1 238 347.27l-79.39-80a16 16 0 0 1 0-22.54l79.39-80a16 16 0 0 1 22.65-.09z"
            fill="currentColor"
          ></path>
        </svg>
      </n-icon>
    </n-button>
    <div class="header">卷名详情</div>
    <div class="detailInfoContainer">
      <div v-for="(item, key) in info" :key="key" class="detailItem">
        <div>{{ infoMap[key] }}:</div>
        <div v-if="key === 'throttleParams'">
          <span class="blue-underline" @click="checkThrottleParams"
            >查看详情</span
          >
        </div>
        <div v-else-if="key === 'fileStatus'">
          {{ statusMap[item as VolumeDetailRenderInfo['fileStatus']] }}
        </div>
        <div v-else-if="key === 'parentId'">
          {{ parentPath === '' ? '/' : parentPath }}
        </div>
        <div v-else-if="key === 'stripeCount' && item === 0">未配置条带</div>
        <div v-else-if="key === 'stripeUnit' && item === 0">未配置条带</div>
        <div
          v-else-if="key === 'mountPoints' && (item as string[]).length === 1"
        >
          {{ (item as string[])[0] }}
        </div>
        <div v-else-if="key === 'mountPoints' && (item as string[]).length > 1">
          <n-popover trigger="hover" raw :show-arrow="false">
            <template #trigger>
              <span class="check-mountpoints">查看所有挂载点</span>
            </template>
            <div v-for="itm in item" :key="itm">{{ itm }}</div>
          </n-popover>
        </div>
        <div v-else>{{ item }}</div>
      </div>
    </div>
    <n-divider />
    <NCard title="卷性能" :bordered="false">
      <template #header-extra>
        <TrendChartTimePicker @change="onChange" />
      </template>
      <BPSAndIOPSChart
        :read-list="state.readBPSList"
        :write-list="state.writeBPSList"
        :range="state.range"
        title="卷带宽"
        read-title="读带宽"
        write-title="写带宽"
      />
      <BPSAndIOPSChart
        :read-list="state.readQPSList"
        :write-list="state.writeQPSList"
        :range="state.range"
        title="IOPS"
        y-axis-formatter="{value} io/s"
      />
    </NCard>
  </div>
  <n-modal v-model:show="showThrottleDetail" title="限流详情">
    <n-card
      style="width: 600px"
      title="限流参数"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-data-table
        :columns="throttleParamsColumns"
        :data="info.throttleParams"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NButton,
  NCard,
  NDataTable,
  NDivider,
  NIcon,
  NModal,
  NPopover,
} from 'naive-ui'
import { computed, onMounted, reactive, ref } from 'vue'

import type { chartData } from '/#/index'
import { getVolumeDetailApi } from '@/api/block'
import VolumePerformanceChartBPS from '@/charts/block-management/VolumePerformanceChartBPS.vue'
import VolumePerformanceChartIOPS from '@/charts/block-management/VolumePerformanceChartIOPS.vue'
import BPSAndIOPSChart from '@/components/BPSAndIOPSChart.vue'
import TrendChartTimePicker, {
  type onChange as onTimeChange,
} from '@/components/TrendChartTimePicker'
import type { VolumeDetailInfo, VolumeDetailRenderInfo } from '@/model/block'
import router from '@/router/index'
import { fixNum } from '@/utils/functions'

const cloneFilterList = [
  'kFileCloning',
  'kFileCloneMetaInstalled',
  'kFileCloned',
  'kFileBeingCloned',
]

const { path } = router.currentRoute.value.params
const parentPath = ref('/')

const state = reactive({
  readBPSList: [] as chartData,
  readQPSList: [] as chartData,
  writeBPSList: [] as chartData,
  writeQPSList: [] as chartData,
  info: {} as VolumeDetailInfo,
  range: [0, 0] as [number, number],
  params: {
    volumeName: '/' + (Array.isArray(path) ? path.join('/') : path),
    start: 0,
    end: 0,
    interval: 0,
  },
})

const statusMap = {
  kFileCreated: '已完成',
  kFileDeleting: '删除中',
  kFileCloning: '克隆中',
  kFileCloneMetaInstalled: '克隆数据待安装',
  kFileCloned: '克隆完成',
  kFileBeingCloned: '克隆中',
}

const goBack = () => {
  router.back()
}

const getVolumeDetail = async () => {
  const [err, res] = await getVolumeDetailApi(state.params)
  if (err) return console.log('请求报错喽', err)
  const { performance, info } = res.data.data
  state.info = info
  state.readBPSList = []
  state.readQPSList = []
  state.writeBPSList = []
  state.writeQPSList = []

  performance.forEach(({ timestamp, readBPS, readQPS, writeBPS, writeQPS }) => {
    const time = timestamp * 1000
    state.readBPSList.push([time, fixNum(readBPS)]) // 因为有批量更新逻辑，这里可以直接赋值
    state.writeBPSList.push([time, fixNum(writeBPS)])
    state.readQPSList.push([time, Number(readQPS)])
    state.writeQPSList.push([time, Number(writeQPS)])
  })
}

const infoMap: { [key: string]: string } = {
  parentId: '父目录',
  id: '卷ID',
  fileName: '名称',
  owner: '所属者',
  length: '卷长度(单位GiB)',
  alloc: '分配长度(单位GiB)',
  ctime: '创建时间',
  fileStatus: '状态',
  stripeUnit: '条带长度(单位MB)',
  stripeCount: '条带数',
  throttleParams: '限流参数',
  mountPoints: '挂载点',
}

if (path.includes('RecycleBin')) {
  infoMap.originalFullPathName = '原始路径'
}

for (let index = 0; index < cloneFilterList.length; index++) {
  if (path.includes(cloneFilterList[index])) {
    infoMap.cloneSource = '克隆源'
    infoMap.cloneLength = '克隆长度'
    break
  }
}

const throttleParamsColumns = [
  {
    title: 'type',
    key: 'type',
  },
  {
    title: 'limit',
    key: 'limit',
  },
  {
    title: 'burst',
    key: 'burst',
  },
  {
    title: 'burstLength',
    key: 'burstLength',
  },
]
const showThrottleDetail = ref(false)
const checkThrottleParams = () => {
  showThrottleDetail.value = true
}
const onChange: onTimeChange = async ([start, end], interval) => {
  state.params.start = Math.floor(start / 1000)
  state.params.end = Math.floor(end / 1000)
  state.params.interval = interval
  state.range = [start, end]
  getVolumeDetail()
}

onMounted(() => {
  let path = router.currentRoute.value.params.path
  let parentPathVal = ''
  for (let i = 0; i < path.length - 1; i++) {
    parentPathVal = parentPathVal + '/' + path[i]
  }
  parentPath.value = parentPathVal
  // handleGetVolumeDetail()
})

const info = computed<VolumeDetailRenderInfo>(() => {
  const {
    mountPoints = [],
    stripeUnit,
    alloc,
    ctime,
    id,
    length,
    parentId,
    stripeCount,
    throttleParams = [],
    fileName,
    fileStatus,
    owner,
  } = state.info

  const extraInfo: { mountPoints?: string[]; stripeUnit?: number } = {}
  if (mountPoints.length) extraInfo.mountPoints = mountPoints
  if (stripeUnit) extraInfo.stripeUnit = fixNum(stripeUnit)
  return {
    alloc,
    ctime,
    id,
    parentId,
    stripeCount,
    throttleParams,
    fileName,
    length,
    fileStatus,
    owner,
    ...extraInfo,
  }
})
</script>
<style scoped lang="scss">
.container {
  padding: 24px;
  background-color: white;

  .go-back-icon {
    float: right;
    margin-right: 10px;
  }

  .header {
    font-weight: 700;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 20px;
  }

  .detailInfoContainer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding-left: 16px;
    // grid-gap: 16px;
    column-gap: 16px;
    row-gap: 16px;

    .detailItem > div {
      color: rgb(29, 39, 59);
    }

    .detailItem > div:first-child {
      margin-bottom: 4px;
      font-weight: 500;
      color: #616876;
    }
  }
}

.blue-underline {
  color: blue;
  text-decoration: underline;
}

.blue-underline:hover {
  cursor: pointer;
}
</style>
