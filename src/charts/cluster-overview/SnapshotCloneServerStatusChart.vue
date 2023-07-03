
<template>
  <!-- <n-card>
    <div ref="main" style="width: 100%; height: 400px"></div>
                </n-card> -->
  <div class="container">
    <div class="title">{{ props.title }}</div>
    <div v-if="offlineCount === 0" class="status">健康</div>
    <div v-else class="status">不健康</div>
    <div class="percenteageContainer">
      <n-progress type="line"
      :show-indicator="false"
      :percentage="onlinePercentage"
      :height="24"
      :border-radius="4"
      :fill-border-radius="0"
      :rail-color="themeVars.errorColor"
       />
    </div>
    <div class="percenteageTxt">
      <div class="txtContainer">
        <span>在线</span>
        <span>{{ onlineCount }}</span>
      </div>
      <div class="txtContainer">
        <span>不在线</span>
        <span>{{ offlineCount }}</span>
      </div>
    </div>
    <div class="divider"></div>
    <div v-if="version" class="txtContainer">
      <span>版本</span>
      <span>{{version}}</span>
    </div>
    <div v-if="leaderAddress.length" class="txtContainer">
      <span>服务地址</span>
      <span>{{leaderAddress}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch  } from 'vue'
import { useDashboardStore } from "@/store/clusterOverview/dashboard"
import { NProgress, useThemeVars } from "naive-ui"
 
const themeVars = useThemeVars()

const props = defineProps({
  title: String,
})

let leaderAddress = ref("");
  let version = ref("");
  let onlineCount = ref(0);
  let offlineCount = ref(0);
  let onlinePercentage = ref(0);
const snapshotCloneServerStatus= ref([]);

const dashBoardStore = useDashboardStore()
const {  getSnapshotCloneServerStatus} = dashBoardStore;
const state = dashBoardStore.state

const setupCard = () => {
  leaderAddress = ref("");
  version = ref("");
  onlineCount = ref(0);
  offlineCount = ref(0);
  onlinePercentage = ref(0);
  getSnapshotCloneServerStatus().then(res => { 
  snapshotCloneServerStatus.value = res.data.data; 
  for (let i = 0; i < snapshotCloneServerStatus.value.length; i++) {
      if (snapshotCloneServerStatus.value[i].leader) {
        leaderAddress.value = snapshotCloneServerStatus.value[i].address; 
      }
      if (snapshotCloneServerStatus.value[i].online) { 
        ++onlineCount.value
      }
      if(snapshotCloneServerStatus.value[i].version) {
        version.value = snapshotCloneServerStatus.value[i].version
      }
    }
    offlineCount.value = snapshotCloneServerStatus.value.length - onlineCount.value;
    onlinePercentage.value = (onlineCount.value/snapshotCloneServerStatus.value.length)*100
})
}
setupCard();
// let timer = setInterval(setupCard, 1800000);

// watch(() => state.timeInterval, (newVal) => {
//   if (newVal === 0) {
//     clearInterval(timer)
//   }
//   else {
//    clearInterval(timer);
//    timer = setInterval(setupCard, newVal * 1000)
//   }
// })

defineExpose({setupCard})
</script>
<style scoped lang="scss">
.container {
  flex: 1;
  padding: 20px 24px 8px;
  background-color: white;
}

.title {
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 4px;
}

.status {
  margin-top: 4px;
  margin-bottom: 0;
  overflow: hidden;
  color: rgba(0, 0, 0, .85);
  font-size: 30px;
  line-height: 38px;
}

.percenteageContainer {
  margin: 16px 0;
}

.percenteageTxt {
  display: flex;
  column-gap: 32px;
}

.divider {
  border-top: 1px solid #f0f0f0;
  margin: 8px 0;
}

.txtContainer {
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, .85);
  display: flex;

  &>span:first-child {
    margin-right: 8px;
  }
}
</style>


