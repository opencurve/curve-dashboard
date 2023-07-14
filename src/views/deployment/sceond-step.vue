<template>
  <div class="container">
    <n-card>
      <div class="content">
        <div ref="inputDiv" class="input-left">
          <n-input
            ref="nInput"
            v-model:value="inputContent"
            type="textarea"
            :rows="15"
          >
          </n-input>
        </div>
        <div class="buttons">
          <div v-if="!checking" class="btn-ok" @click="goToCheck">
            <n-button @click="goForCheck">确定</n-button>
          </div>
          <div v-if="checking" class="btn-submit">
            <n-button-group>
              <n-button @click="withdraw">撤回</n-button>
              <n-button @click="submit">提交</n-button>
            </n-button-group>
          </div>
        </div>
        <div class="input-right">
          <div
            style="margin-top: 7px; margin-left: 18px; white-space: pre"
            v-html="diffStrRef"
          ></div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import * as Diff from 'diff'
import { NButton, NCard, NCol, NInput, useMessage } from 'naive-ui'

import { useDeploymentStore } from '@/store/deployment/deployment'

const deploymentStore = useDeploymentStore()
const {
  deployDiskList,
  deployDiskCommit,
  atStepFlag,
  finishStepFlag,
  updateFinishStep,
} = deploymentStore
import { onMounted, ref } from 'vue'

const inputContent = ref('')
const initialContent = ref('')
const message = useMessage()
const checking = ref(false)
const diffStrRef = ref('等待对比...')

const goToCheck = () => {
  const diff = Diff.diffChars(inputContent.value, initialContent.value)
  let diffStr = ''
  const regex = /\n/g
  diff.forEach(part => {
    const color = part.added ? 'red' : part.removed ? 'green' : 'grey'
    diffStr += `<span style="color:${color}">${part.value.replace(
      regex,
      '<br/>',
    )}</span>`
  })
  diffStrRef.value = diffStr
  checking.value = true
}

const withdraw = () => {
  diffStrRef.value = '等待对比...'
  inputContent.value = initialContent.value
  checking.value = false
}

const submit = () => {
  deployDiskCommit({ disks: inputContent.value })
    .then(res => {
      if (res.status === 200) {
        updateFinishStep(2)
        message.success('提交成功，请进行下一步')
      }
    })
    .catch(err => {
      message.error('提交失败，请检查信息是否正确')
    })
}

const goForCheck = () => {
  const diff = Diff.diffChars(initialContent.value, inputContent.value)
}

const getDiskList = () => {
  deployDiskList().then(res => {
    inputContent.value = res.data.data
    initialContent.value = res.data.data
  })
}
getDiskList()
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-left,
.input-right {
  flex: 1;
  margin-right: 10px;
}
.input-right {
  height: 350px;
  width: 400;
  overflow: auto;
  border: 1px solid #ccc;
}
.buttons {
  width: 200px;
}
</style>
