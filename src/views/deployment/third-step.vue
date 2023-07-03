<template>
  <div class="container">
    <div class="input-container">
      <n-input v-model:value="diskFormatStatus" type="textarea"> </n-input>
    </div>
    <div class="button-container">
      <n-button @click="formatDisk">格式化</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Diff from 'diff'
import {
  messageDark,
  NButton,
  NInput,
  NProgress,
  NSpace,
  useMessage,
} from 'naive-ui'
import { ref, watch } from 'vue'

import { useDeploymentStore } from '@/store/deployment/deployment'

const message = useMessage()
const deploymentStore = useDeploymentStore()
const { deployFormatStatus, deployFormat } = deploymentStore

const diskFormatStatus = ref('')

const formatDisk = () => {
  deployFormat().then(res => {
    if (res.status === 200) {
      message.success('格式化成功')
      formDiskStatus()
    }
  })
}
const formDiskStatus = () => {
  deployFormatStatus().then(res => {
    diskFormatStatus.value = res.data.data
  })
}
formDiskStatus()
</script>

<style lang="scss" scoped>
.container {
  .n-input {
    height: 300px;
  }
  .input-container {
    flex-grow: 2;
  }
  .button-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  display: flex;
  justify-content: space-between;
}
</style>
