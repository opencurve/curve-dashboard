<template>
  <div class="container">
    <div class="header">服务器详情</div>
    <div class="detailInfoContainer">
      <div v-for="(item, key) in info" :key="key" class="detailItem">
        <div>{{ infoMap[key] }}:</div>
        <div>
          {{ renderValue(item) }}
        </div>
      </div>
    </div>
    <n-divider />
    <NCard title="服务器性能" :bordered="false">
      <template #header-extra>
        <TrendChartTimePicker @change="onChange" />
      </template>
      <div class="chartContainer">
        <DetailChart
          :range="state.range"
          title="cpu使用率"
          :data="state.cpuData"
          y-axis-formatter="{value} %"
        />
        <DetailChart
          :range="state.range"
          title="内存使用率"
          :data="state.memoryData"
          y-axis-formatter="{value}%"
          :color="['#2596be']"
        />
      </div>
      <n-divider />
      <div class="chartContainer">
        <DetailChart
          :range="state.range"
          title="网络下行带宽"
          :data="state.networkTrafficData"
          y-axis-formatter="{value} Mb/s"
        />
        <DetailChart
          :range="state.range"
          title="网络上行带宽"
          :data="state.networkTransmitData"
          y-axis-formatter="{value} Mb/s"
        />
      </div>
      <n-divider />
      <div class="chartContainer">
        <DetailChart
          :range="state.range"
          title="磁盘读带宽"
          :data="state.readBPSData"
        />
        <DetailChart
          :range="state.range"
          title="磁盘写带宽"
          :data="state.writeBPSData"
        />
      </div>
      <n-divider />
      <div class="chartContainer">
        <DetailChart
          :range="state.range"
          title="磁盘读IOPS"
          :data="state.readIOPSData"
          y-axis-formatter="{value} io/s"
        />
        <DetailChart
          :range="state.range"
          title="磁盘写IOPS"
          :data="state.writeIOPSData"
          y-axis-formatter="{value} io/s"
        />
      </div>
      <n-divider />
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { NCard, NDivider } from 'naive-ui'
import { computed, reactive } from 'vue'

import type { ChartSeries } from '/#/index'
import { getServerDetailApi } from '@/api/server'
import TrendChartTimePicker, {
  type onChange as onTimeChange,
} from '@/components/TrendChartTimePicker'
import type { HostDetail } from '@/model/cluster'
import router from '@/router'
import {
  gEchartsSeriesData,
  gEchartsSeriesDataByPerformance,
} from '@/utils/functions'

import DetailChart from './DetailChart.vue'

const infoMap = {
  hostName: '主机名',
  ip: 'ip地址',
  memory: '内存(单位GiB)',
  diskNum: '硬盘数量',
  machine: '硬件架构',
  kernelRelease: '内核版本',
  operatingSystem: '操作系统',
  cpuCores: 'cpu信息',
}

const state = reactive({
  range: [0, 0] as [number, number],
  info: {} as HostDetail['host'],
  params: {
    hostName: router.currentRoute.value.query.q as string,
    start: 0,
    end: 0,
    interval: 0,
  },
  cpuData: [] as ChartSeries[],
  memoryData: [] as ChartSeries[],
  networkTrafficData: [] as ChartSeries[],
  networkTransmitData: [] as ChartSeries[],
  readBPSData: [] as ChartSeries[],
  readIOPSData: [] as ChartSeries[],
  writeBPSData: [] as ChartSeries[],
  writeIOPSData: [] as ChartSeries[],
})

const getServerDetail = async () => {
  const [err, res] = await getServerDetailApi(state.params)
  if (err) return console.log('请求报错啦', err)
  const {
    host,
    cpuUtilization,
    memUtilization,
    networkTraffic: { receive, transmit },
    diskPerformance,
  } = res.data.data
  state.info = host

  state.cpuData = gEchartsSeriesData({ cpu使用率: cpuUtilization })
  state.memoryData = gEchartsSeriesData({ 内存使用率: memUtilization })
  state.networkTrafficData = gEchartsSeriesData(receive, 'Mb')
  state.networkTransmitData = gEchartsSeriesData(transmit, 'Mb')

  const [readBPS, readIOPS, writeBPS, writeIOPS] =
    gEchartsSeriesDataByPerformance(diskPerformance)
  state.readBPSData = readBPS
  state.readIOPSData = readIOPS
  state.writeBPSData = writeBPS
  state.writeIOPSData = writeIOPS
}

const onChange: onTimeChange = async ([start, end], interval) => {
  state.params.start = Math.floor(start / 1000)
  state.params.end = Math.floor(end / 1000)
  state.params.interval = interval
  state.range = [start, end]
  getServerDetail()
}

const info = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { kernelVersion, ...rest } = state.info
  return rest
})

const renderValue = (
  data: string | number | HostDetail['host']['cpuCores'],
) => {
  if (typeof data === 'string' || typeof data === 'number') return data
  const [k, v] = Object.entries(data.cpuModles)[0]
  return `${k} * ${v}`
}
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

.diskBPS,
.diskIOPS,
.networkTraffic,
.utilization {
  display: flex;
  flex: 1;
  margin-bottom: 15px;
}

//info copied
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
.chartContainer {
  display: flex;
  flex: 1;
}
</style>
