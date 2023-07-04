<template>
  <div class="container">
    <div class="header">存储池详情</div>
    <div class="detailInfoContainer">
      <div v-for="(item, key) in info" :key="key" class="detailItem">
        <div>{{ infoMap[key] }}:</div>
        {{ renderSpace(item) }}
      </div>
    </div>
    <n-divider />
    <NCard title="存储池性能" :bordered="false">
      <template #header-extra>
        <TrendChartTimePicker @change="onChange" />
      </template>
      <BPSAndIOPSChart
        :read-list="state.readBPSList"
        :write-list="state.writeBPSList"
        :range="state.range"
        title="存储池带宽"
        read-title="读带宽"
        write-title="写带宽"
      />
      <BPSAndIOPSChart
        :read-list="state.readIOPSList"
        :write-list="state.writeIOPSList"
        :range="state.range"
        title="存储池IOPS"
        read-title="读IOPS"
        write-title="写IOPS"
        y-axis-formatter="{value} io/s"
      />
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { NCard, NDivider } from 'naive-ui'
import { computed, reactive } from 'vue'

import type { chartData } from '/#/index'
import { getStoragePoolDetailApi } from '@/api/storagePool'
import BPSAndIOPSChart from '@/components/BPSAndIOPSChart.vue'
import TrendChartTimePicker, {
  type onChange as onTimeChange,
} from '@/components/TrendChartTimePicker'
import type { StoragePoolInfo } from '@/model/storagePool'
import router from '@/router/index'
import { fixNum } from '@/utils/functions'

const infoMap = {
  id: 'ID',
  name: '名称',
  createTime: '创建时间',
  allocateStatus: '分配状态',
  serverNum: '存储池节点数量',
  chunkServerNum: 'chunkserver数量',
  copysetNum: 'copyset数量',
  space: '容量信息（可回收/已分配/总量）',
}

const state = reactive({
  readBPSList: [] as chartData,
  readIOPSList: [] as chartData,
  writeBPSList: [] as chartData,
  writeIOPSList: [] as chartData,
  info: {} as StoragePoolInfo,
  range: [0, 0] as [number, number],
  params: {
    id: +router.currentRoute.value.params.id,
    start: 0,
    end: 0,
    interval: 0,
  },
})

const getStoragePoolDetail = async () => {
  const [err, res] = await getStoragePoolDetailApi(state.params)
  if (err) return console.log('请求报错啦', err)
  const { performance, info } = res.data.data
  state.info = info
  state.readBPSList = []
  state.readIOPSList = []
  state.writeBPSList = []
  state.writeIOPSList = []

  performance.forEach(
    ({ timestamp, readBPS, readIOPS, writeBPS, writeIOPS }) => {
      const time = timestamp * 1000
      state.readBPSList.push([time, fixNum(readBPS)]) // 因为有批量更新逻辑，这里可以直接赋值
      state.readIOPSList.push([time, Number(readIOPS)])
      state.writeBPSList.push([time, fixNum(writeBPS)])
      state.writeIOPSList.push([time, Number(writeIOPS)])
    },
  )
}

const onChange: onTimeChange = async ([start, end], interval) => {
  state.params.start = Math.floor(start / 1000)
  state.params.end = Math.floor(end / 1000)
  state.params.interval = interval
  state.range = [start, end]
  getStoragePoolDetail()
}

const renderSpace = (data: string | number | StoragePoolInfo['space']) => {
  if (typeof data === 'string' || typeof data === 'number') return data
  return `${data.canRecycled}/${data.alloc}/${data.total}`
}

const info = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, scanEnable, physicalPoolId, ...rest } = state.info
  return rest
})
</script>

<style scoped lang="scss">
.container {
  padding: 24px;
  background-color: white;
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
</style>
