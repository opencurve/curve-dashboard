<template>
  <n-card title="集群性能">
    <template #header-extra>
      <TrendChartTimePicker @change="onChange" />
    </template>
    <BPSAndIOPSChart
      :read-list="state.readBPSList"
      :write-list="state.writeBPSList"
      :range="state.range"
      title="带宽"
    />
    <BPSAndIOPSChart
      :read-list="state.readIOPSList"
      :write-list="state.writeBPSList"
      :range="state.range"
      title="IOPS"
    />
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { reactive } from 'vue'

import type { chartData } from '/#/index'
import { getClusterPerformanceApi } from '@/api/dashboard'
import BPSAndIOPSChart from '@/components/BPSAndIOPSChart.vue'
import TrendChartTimePicker, {
  type onChange as onTimeChange,
} from '@/components/TrendChartTimePicker'
import { fixNum } from '@/utils/functions'

const state = reactive({
  readBPSList: [] as chartData,
  readIOPSList: [] as chartData,
  writeBPSList: [] as chartData,
  writeIOPSList: [] as chartData,
  range: [0, 0] as [number, number],
  params: {
    start: 0,
    end: 0,
    interval: 0,
  },
})

const getClusterPerformance = async () => {
  const [err, res] = await getClusterPerformanceApi(state.params)
  if (err) return console.log('请求报错啦', err)

  state.readBPSList = []
  state.readIOPSList = []
  state.writeBPSList = []
  state.writeIOPSList = []

  res.data.data.forEach(
    ({ timestamp, readBPS, readIOPS, writeBPS, writeIOPS }) => {
      const time = timestamp * 1000
      state.readBPSList.push([time, fixNum(readBPS)]) // 因为有批量更新逻辑，这里可以直接赋值
      state.readIOPSList.push([time, fixNum(readIOPS)])
      state.writeBPSList.push([time, fixNum(writeBPS)])
      state.writeIOPSList.push([time, fixNum(writeIOPS)])
    },
  )
}

const onChange: onTimeChange = async ([start, end], interval) => {
  const params = {
    start: Math.floor(start / 1000),
    end: Math.floor(end / 1000),
    interval: interval,
  }
  state.params = params
  state.range = [start, end]
  getClusterPerformance()
}
</script>
