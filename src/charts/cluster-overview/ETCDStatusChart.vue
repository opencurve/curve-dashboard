<template>
  <div class="container">
    <div class="title">{{ props.title }}</div>
    <div v-if="offlineCount === 0" class="status">健康</div>
    <div v-else class="status">不健康</div>
    <div class="percenteageContainer">
      <n-progress
        type="line"
        :percentage="onlinePercentage"
        :show-indicator="false"
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
    <div class="txtContainer">
      <span>版本</span>
      <span>{{ version }}</span>
    </div>
    <div v-if="leaderAddress.length" class="txtContainer">
      <span>leader地址</span>
      <span>{{ leaderAddress }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NProgress, useThemeVars } from 'naive-ui'
import { ref, watch } from 'vue'

import { useDashboardStore } from '@/store/clusterOverview/dashboard'

const props = defineProps({
  title: String,
})

const themeVars = useThemeVars()
let leaderAddress = ref('')
let version = ref('')
let onlineCount = ref(0)
let offlineCount = ref(0)
let onlinePercentage = ref(0)
const ETCDstatus = ref([])

const dashBoardStore = useDashboardStore()
const { getETCDStatus } = dashBoardStore

const setupCard = () => {
  leaderAddress = ref('')
  version = ref('')
  onlineCount = ref(0)
  offlineCount = ref(0)
  onlinePercentage = ref(0)
  getETCDStatus().then(res => {
    ETCDstatus.value = res.data.data
    for (let i = 0; i < ETCDstatus.value.length; i++) {
      if (ETCDstatus.value[i].leader) {
        leaderAddress.value = ETCDstatus.value[i].address
      }
      if (ETCDstatus.value[i].online) {
        ++onlineCount.value
      }
      if (ETCDstatus.value[i].version) {
        if (version.value === '') {
          version.value = ETCDstatus.value[i].version
        }
      }
    }
    offlineCount.value = ETCDstatus.value.length - onlineCount.value
    onlinePercentage.value = (onlineCount.value / ETCDstatus.value.length) * 100
  })
}
setupCard()

defineExpose({ setupCard })
</script>
<style scoped lang="scss">
.container {
  flex: 1;
  padding: 20px 24px 8px;
  background-color: white;
}

.title {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 4px;
}

.status {
  margin-top: 4px;
  margin-bottom: 0;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
  font-size: 30px;
  line-height: 38px;
}

.percenteageContainer {
  margin: 16px 0px;
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
  color: rgba(0, 0, 0, 0.85);
  display: flex;

  & > span:first-child {
    margin-right: 8px;
  }
}
</style>
