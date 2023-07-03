<template>
  <div class="container">
    <div class="select-wrapper">
      <div class="text-prefix">集群</div>
      <div class="select">
        <n-select v-model:value="cluster" :options="options" />
      </div>
    </div>
    <div class="time-selector-wrapper">
      <div>
        <n-tooltip
          :style="{ maxWidth: '280px', fontSize: '10px' }"
          placement="top-end"
        >
          <template #trigger>
            <n-icon size="15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64zm-6 304a20 20 0 1 1 20-20a20 20 0 0 1-20 20zm33.44-102C267.23 276.88 265 286.85 265 296a14 14 0 0 1-28 0c0-21.91 10.08-39.33 30.82-53.26C287.1 229.8 298 221.6 298 203.57c0-12.26-7-21.57-21.49-28.46c-3.41-1.62-11-3.2-20.34-3.09c-11.72.15-20.82 2.95-27.83 8.59C215.12 191.25 214 202.83 214 203a14 14 0 1 1-28-1.35c.11-2.43 1.8-24.32 24.77-42.8c11.91-9.58 27.06-14.56 45-14.78c12.7-.15 24.63 2 32.72 5.82C312.7 161.34 326 180.43 326 203.57c0 33.83-22.61 49.02-42.56 62.43z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </template>
          <p>
            左侧选项为选择样本的采样范围，默认为最近1h内;
            右侧选项为选择样本的采样间隔，默认为15秒
          </p>
        </n-tooltip>
      </div>
      <div>
        <TimeSelector />
      </div>
      <div>
        <IntervalPicker class="interval-picker" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { ref, toRef, watch } from 'vue'

import { useClusterSelectorStore } from '@/store/clusterSelector'
import { useDeploymentStore } from '@/store/deployment/deployment'

import IntervalPicker from './IntervalPicker.vue'
import TimeSelector from './TimeSelector.vue'

//需要使用的store
const deploymentStore = useDeploymentStore()
const clusterSelectorStore = useClusterSelectorStore()
const { deployClusterList, deployClusterCheckout } = deploymentStore
const { pickCluster } = clusterSelectorStore
const currentCluster = toRef(clusterSelectorStore, 'currentCluster')

//需要使用的变量
const cluster = ref('')
const options = ref([])
cluster.value = currentCluster.value
//需要使用的方法
const getClusterList = () => {
  deployClusterList().then(res => {
    if (res.status === 200) {
      let arr = res.data.data
      arr.forEach((itm: Object, index: number) => {
        options.value.push({
          label: itm.Name,
          value: itm.Name,
        })
      })
      cluster.value = options.value[0].value
    }
  })
}

getClusterList()

watch(
  cluster,
  newVal => {
    pickCluster(newVal)
  },
  { immediate: true },
)
watch(currentCluster, newVal => {
  deployClusterCheckout({ name: newVal })
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 15px 10px;
  background-color: #f5f5f5;
}

.select-wrapper {
  display: flex;
  align-items: center;
}

.text-prefix {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  padding: 3px 8px;
  height: 24px;
  border-radius: 4px;
  background-color: #3366ff;
  color: #fff;
}

.select {
  width: 200px;
}

.time-selector-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;

  .interval-picker {
    width: 100px;
    flex-shrink: 1;
  }
}
</style>
