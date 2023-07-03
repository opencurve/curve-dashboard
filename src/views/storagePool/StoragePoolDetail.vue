<template>
  <div class="container">
    <div class="header">存储池详情</div>
    <div class="detailInfoContainer">
      <div class="detailItem" v-for="(item, key) in poolDetail">    
          <div>{{ infoMap[key] }}:</div>
          <div v-if="key === 'space'">{{ `${item.canRecycled}/${item.alloc}/${item.total}` }}</div>
          <div v-else>{{ item }}</div>    
      </div>
    </div>
    <n-divider />
    <div class="graph">
      <PoolPerformanceChartBPS />
      <PoolPerformanceChartIOPS />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NCard, NDivider } from "naive-ui"
import { toRefs, onMounted, ref, watch } from 'vue'
import router from "@/router/index"
import { usePoolStore } from '@/store/storagePoolManagement/storagePool'
import PoolPerformanceChartBPS from "@/charts/storage-pool/PoolPerformanceChartBPS.vue"
import PoolPerformanceChartIOPS from "@/charts/storage-pool/PoolPerformanceChartIOPS.vue"

import { useTimeRangeStore } from "@/store/timeRange";
const timeRangeStore = useTimeRangeStore();
const { timeRange, interval  } = toRefs(timeRangeStore);


const poolStore = usePoolStore()
const { getStoragepoolDetail } = poolStore;
const params = { id: +router.currentRoute.value.params.id, start: Math.floor(timeRange.value.start/1000), end:Math.floor(timeRange.value.end/1000), interval:interval.value };

const poolDetail = ref(null);

const handleGetStoragepoolDetail = () => {
  getStoragepoolDetail(params).then(
  res => {poolDetail.value = res.info;
  delete poolDetail.value.type;
  delete poolDetail.value.scanEnable;
  delete poolDetail.value.physicalPoolId;

  poolDetail.value = {
  id: poolDetail.value.id,
  name: poolDetail.value.name,
  createTime: poolDetail.value.createTime,
  serverNum: poolDetail.value.serverNum,
  chunkServerNum: poolDetail.value.chunkServerNum,
  copysetNum: poolDetail.value.copysetNum,
  allocateStatus: poolDetail.value.allocateStatus,
  space: poolDetail.value.space
}
}
)
}

onMounted(() => {
  handleGetStoragepoolDetail();
})

const infoMap: { [key: string]: string } = {
  id: 'ID',
  name: '名称',
  // physicalPoolId: '所属物理池 id',
  // type: '类型',
  createTime: '创建时间',
  allocateStatus: '分配状态',
  // scanEnable: "静默检查",
  serverNum: "存储池节点数量",
  chunkServerNum: "chunkserver数量",
  copysetNum: "copyset数量",
  space: "容量信息（可回收/已分配/总量）",
}

watch([() => timeRange.value.start, () => timeRange.value.end], () => {
  handleGetStoragepoolDetail();
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
  color: rgba(0, 0, 0, .85);
  margin-bottom: 20px;
}

.detailInfoContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-left: 16px;
  // grid-gap: 16px;
  column-gap: 16px;
  row-gap: 16px;

  .detailItem>div {
    color: rgb(29, 39, 59);
  }

  .detailItem>div:first-child {
    margin-bottom: 4px;
    font-weight: 500;
    color: #616876;
  }
}
</style>