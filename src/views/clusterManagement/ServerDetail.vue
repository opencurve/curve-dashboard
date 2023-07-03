<template>
  <div class="container">
    <div class="header">服务器详情</div>
    <div class="detailInfoContainer">
      <div v-for="(item, key) in hostDetail" :key="key" class="detailItem">
        <div>{{ infoMap[key] }}:</div>
        <div v-if="key === 'cpuCores'">{{ cpuModlesDisplay }}</div>
        <div v-else>
          {{ item }}
        </div>
      </div>
    </div>
    <n-divider />
    <div class="graph">
      <div class="utilization">
        <CPUutilizationChart />
        <MemoryUtilizationChart />
      </div>
      <n-divider />
      <div class="networkTraffic">
        <NetworkTrafficReceiveChart />
        <NetworkTrafficTransmitChart />
      </div>
      <n-divider />
      <div class="diskBPS">
        <DiskPerformanceBPSReadChart />
        <DiskPerformanceBPSWriteChart />
      </div>
      <n-divider />
      <div class="diskIOPS">
        <DiskPerformanceIOPSReadChart />
        <DiskPerformanceIOPSWriteChart />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NDivider } from 'naive-ui'
import { onMounted, ref, toRefs, watch } from 'vue'

import CPUutilizationChart from '@/charts/cluster-management/CPUutilizationChart.vue'
//磁盘性能的BPS相关图表
import DiskPerformanceBPSReadChart from '@/charts/cluster-management/DiskPerformanceBPSReadChart.vue'
import DiskPerformanceBPSWriteChart from '@/charts/cluster-management/DiskPerformanceBPSWriteChart.vue'
//磁盘性能的IOPS相关的表格
import DiskPerformanceIOPSReadChart from '@/charts/cluster-management/DiskPerformanceIOPSReadChart.vue'
import DiskPerformanceIOPSWriteChart from '@/charts/cluster-management/DiskPerformanceIOPSWriteChart.vue'
import MemoryUtilizationChart from '@/charts/cluster-management/MemoryUtilizationChart.vue'
import NetworkTrafficReceiveChart from '@/charts/cluster-management/NetworkTrafficReceiveChart.vue'
import NetworkTrafficTransmitChart from '@/charts/cluster-management/NetworkTrafficTransmitChart.vue'
import router from '@/router'
import { useServerStore } from '@/store/clusterManagement/server'
import { useTimeRangeStore } from '@/store/timeRange'
const timeRangeStore = useTimeRangeStore()

const { timeRange, interval } = toRefs(timeRangeStore)

const serverStore = useServerStore()
const { getServerDetail } = serverStore
const hostName = router.currentRoute.value.query.q
const params = {
  hostName,
  start: Math.floor(timeRange.value.start / 1000),
  end: Math.floor(timeRange.value.end / 1000),
  interval: interval.value,
}
const hostDetail = ref([])
let cpuModlesDisplay = ref(null)

const handleGetServerDetail = () => {
  getServerDetail(params).then(res => {
    hostDetail.value = res.data.data.host
    delete hostDetail.value.kernelVersion

    let cpuModles = res.data.data.host.cpuCores.cpuModles
    let firstKey = Object.keys(cpuModles)[0]
    let firstVal = (cpuModles = cpuModles[firstKey])
    cpuModlesDisplay.value = `${firstKey} * ${firstVal}`
  })
}

onMounted(() => {
  handleGetServerDetail()
})

const infoMap: { [key: string]: string } = {
  hostName: '主机名',
  ip: 'ip地址',
  memory: '内存(单位GiB)',
  diskNum: '硬盘数量',
  machine: '硬件架构',
  kernelRelease: '内核版本',
  // kernelVersion: '内核版本',
  operatingSystem: '操作系统',
  cpuCores: 'cpu信息',
}

watch([() => timeRange.value.start, () => timeRange.value.end], () => {
  handleGetServerDetail()
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
</style>
