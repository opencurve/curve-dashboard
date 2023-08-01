<template>
  <div class="nameContainer">
    <div class="overview">
      <div class="online-offline">
        <ETCDStatusChart title="ETCD状态" />
        <MDSStatusChart title="MDS状态" />
        <SnapshotCloneServerStatusChart title="快照克隆服务器状态" />
        <ChunkServerStatusChart title="ChunkServer状态" />
      </div>
      <div class="cluster-capacity">
        <n-card title="copyset状态" bordered>
          <ClusterStatusChart />
        </n-card>
        <n-card>
          <div class="title-slot">
            <span class="cluster-card-title">{{ clusterChartTitle }}</span>
            <div v-if="clusterChart === 'trend'" class="datePickerContainer">
              <TrendChartTimePicker
                :date-subtract-value="7"
                :options="trendChartTimePickerOptions"
                :interval-index="2"
                @change="handleTrendPickerChange"
              />
            </div>
            <span class="cluster-icons">
              <NTooltip trigger="hover">
                <template #trigger>
                  <NButton quaternary
                    @click="changeClusterChart">
                    <NIcon
                      size="22"
                      class="refresn-icon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M16 3l4 4l-4 4"></path>
                          <path d="M10 7h10"></path>
                          <path d="M8 13l-4 4l4 4"></path>
                          <path d="M4 17h9"></path>
                        </g>
                      </svg>
                    </NIcon>
                  </NButton>
                </template>
                <template #default> 切换图表 </template>
              </NTooltip>
            </span>
          </div>
          <ClusterSpaceChart v-if="clusterChart === 'space'" />
          <ClusterTrendChart
            v-if="clusterChart === 'trend'"
            :range="state.range"
            :interval="state.interval"
          />
        </n-card>
      </div>
      <Performance />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { reactive, ref } from 'vue'

import ChunkServerStatusChart from '@/charts/cluster-overview/ChunkServerStatusChart.vue'
//集群容量
import ClusterSpaceChart from '@/charts/cluster-overview/ClusterSpaceChart.vue'
//集群状态
import ClusterStatusChart from '@/charts/cluster-overview/ClusterStatusChart.vue'
import ETCDStatusChart from '@/charts/cluster-overview/ETCDStatusChart.vue'
import MDSStatusChart from '@/charts/cluster-overview/MDSStatusChart.vue'
import SnapshotCloneServerStatusChart from '@/charts/cluster-overview/SnapshotCloneServerStatusChart.vue'
import TrendChartTimePicker, {
  type onChange as onTimeChange,
} from '@/components/TrendChartTimePicker'

import ClusterTrendChart from './components/ClusterTrendChart.vue'
import Performance from './components/Performance.vue'

const clusterChart = ref('space')

const clusterChartTitle = ref('集群容量')

const state = reactive({
  range: [0, 0] as [number, number],
  interval: 3600,
})
const trendChartTimePickerOptions = [
  {
    label: '1小时',
    value: 3600,
  },
  {
    label: '6小时',
    value: 21600,
  },
  {
    label: '12小时',
    value: 43200,
  },
  {
    label: '24小时',
    value: 86400,
  },
]
const changeClusterChart = () => {
  clusterChart.value = clusterChart.value === 'space' ? 'trend' : 'space'
  clusterChartTitle.value =
    clusterChart.value === 'space' ? '集群容量' : '集群趋势'
}

const handleTrendPickerChange: onTimeChange = (range, interval) => {
  state.range = range
  state.interval = interval
}
</script>
<style scoped lang="scss">
.nameContainer {
  /* height: inherit; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.online-offline,
.cluster-capacity {
  display: flex;
  justify-content: space-between;
  column-gap: 24px;
  margin-bottom: 24px;
}

.overview {
  flex: 1;
}

.cluster-status {
  display: flex;
}

.title-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cluster-card-title {
    font-weight: var(--n-title-font-weight);
    transition: color 0.3s var(--n-bezier);
    min-width: 0;
    color: var(--n-title-text-color);
  }

  .cluster-icons {
    display: flex;
    align-items: center;
    column-gap: 3px;

    .refresn-icon:hover {
      cursor: pointer;
      color: var(--n-primary-color);
    }
  }
}
</style>
