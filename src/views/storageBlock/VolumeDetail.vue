<template>
  <div class="container">
    <n-button text class="go-back-icon">
      <n-icon size="25" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
          <path
            d="M48 256c0 114.87 93.13 208 208 208s208-93.13 208-208S370.87 48 256 48S48 141.13 48 256zm212.65-91.36a16 16 0 0 1 .09 22.63L208.42 240H342a16 16 0 0 1 0 32H208.42l52.32 52.73A16 16 0 1 1 238 347.27l-79.39-80a16 16 0 0 1 0-22.54l79.39-80a16 16 0 0 1 22.65-.09z"
            fill="currentColor"></path>
        </svg>
      </n-icon>
    </n-button>
    <div class="header">卷名详情</div>
    <div class="detailInfoContainer">
      <div class="detailItem" v-for="(item, key) in volumeDetail">
        <div>{{ infoMap[key] }}:</div>
        <div v-if="key === 'throttleParams'"><span class="blue-underline" @click="checkThrottleParams">查看详情</span></div>
        <div v-else-if="key === 'fileStatus'">{{ statusMap[item] }}</div>
        <div v-else-if="key === 'parentId'">{{ parentPath === '' ? '/' : parentPath }}</div>
        <div v-else-if="key === 'stripeCount' && item === 0">未配置条带</div>
        <div v-else-if="key === 'stripeUnit' && item === 0">未配置条带</div>
        <div v-else-if="(key === 'mountPoints') && (item.length === 1)">{{ item[0] }}</div>
        <div v-else-if="(key === 'mountPoints') && (item.length > 1)">
          <n-popover trigger="hover" raw :show-arrow="false">
            <template #trigger>
              <span class="check-mountpoints">查看所有挂载点</span>
            </template>
            <div v-for="itm in item">{{ itm }}</div>
          </n-popover>
        </div>
        <div v-else>{{ item }}</div>
      </div>
    </div>
    <n-divider />
    <div class="graph">
      <VolumePerformanceChartBPS style="margin-bottom: 16px" />
      <VolumePerformanceChartIOPS />
    </div>
  </div>
  <n-modal title="限流详情" v-model:show="showThrottleDetail">
    <n-card style="width: 600px" title="限流参数" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-data-table :columns="throttleParamsColumns" :data="volumeDetail.throttleParams" />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { NCard, NDivider, NModal, NDataTable, NIcon, NButton, NPopover } from "naive-ui"
import { ref, watch, onMounted, toRefs } from 'vue'
import router from "@/router/index"
import VolumePerformanceChartBPS from "@/charts/block-management/VolumePerformanceChartBPS.vue"
import VolumePerformanceChartIOPS from "@/charts/block-management/VolumePerformanceChartIOPS.vue"
import { useBlockStore } from '@/store/blockStorageManagement/block'
import { useTimeRangeStore } from "@/store/timeRange";

const timeRangeStore = useTimeRangeStore();
const{timeRange, interval} = toRefs(timeRangeStore);
const blockStore = useBlockStore()
const { getVolumeDetail } = blockStore;
const cloneFilterList = ['kFileCloning', 'kFileCloneMetaInstalled', 'kFileCloned', 'kFileBeingCloned']
const volumeDetail = ref(null)

const { path } = router.currentRoute.value.params;
const parentPath = ref('/')

let handledPath = Array.isArray(path) ? path.join('/') : path;
handledPath = '/' + handledPath;
const params = {
  volumeName: handledPath,
  start:Math.floor(timeRange.value.start/1000),
  end:Math.floor(timeRange.value.end/1000),
  interval:interval.value
}

const statusMap = {
  kFileCreated: '已完成',
  kFileDeleting: '删除中',
  kFileCloning: '克隆中',
  kFileCloneMetaInstalled: "克隆数据待安装",
  kFileCloned: "克隆完成",
  kFileBeingCloned: "克隆中"
}

const goBack = () => {
  router.back();
}

const handleGetVolumeDetail = () => {
  getVolumeDetail(params).then(res => {
  volumeDetail.value = res.data.data.info;

  if (volumeDetail.value.mountPoints.length === 0) {
    delete volumeDetail.value.mountPoints
  }
  if(volumeDetail.value.stripeUnit !== 0) {
    let originalData = volumeDetail.value.stripeUnit/(1024*1024);
    volumeDetail.value.stripeUnit = originalData.toFixed(2);
  }
  delete volumeDetail.value.fileType;
  delete volumeDetail.value.chunkSize;
  delete volumeDetail.value.segmentSize;
  delete volumeDetail.value.seqNum;
  delete volumeDetail.value.originalFullPathName;
  delete volumeDetail.value.cloneSource;
  delete volumeDetail.value.cloneLength;
  delete volumeDetail.value.epoch;
})
}

const infoMap: { [key: string]: string } = {
  parentId: '父目录',
  id: '卷ID',
  fileName: '名称',
  // fileType: '类型',
  owner: '所属者',
  // chunkSize: 'ChunkSize(byte)',
  // segmentSize: "SegmentSize(byte)",
  length: "卷长度(单位GiB)",
  alloc: "分配长度(单位GiB)",
  ctime: "创建时间",
  // seqNum: "序列号",
  fileStatus: "状态",
  // originalFullPathName: "原始路径",
  // cloneSource: "克隆源",
  // cloneLength: "克隆长度",
  stripeUnit: "条带长度(单位MB)",
  stripeCount: "条带数",
  // epoch: "版本号",
  throttleParams: "限流参数",
  mountPoints: '挂载点'
}

if (path.includes('RecycleBin')) {
  infoMap.originalFullPathName = "原始路径"
}

for (let index = 0; index < cloneFilterList.length; index++) {
  if (path.includes(cloneFilterList[index])) {
    infoMap.cloneSource = "克隆源"
    infoMap.cloneLength = "克隆长度"
    break;
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
const showThrottleDetail = ref(false);
const checkThrottleParams = () => {
  showThrottleDetail.value = true
}

onMounted(() => {
  let path = router.currentRoute.value.params.path;
  let parentPathVal = "";
  for (let i = 0; i < path.length - 1; i++) {
    parentPathVal = parentPathVal + '/' + path[i]
  }
  parentPath.value = parentPathVal;
  handleGetVolumeDetail();
})

watch([() => timeRange.value.start, () => timeRange.value.end], () => {
  handleGetVolumeDetail();
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
}

.blue-underline {
  color: blue;
  text-decoration: underline;
}

.blue-underline:hover {
  cursor: pointer;
}
</style>