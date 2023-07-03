<template>
  <n-card>
    <div class="deploy">
      <h1>{{ title }}</h1>
      <n-steps :current="current" :status="currentStatus">
        <n-step title="第一步" description="左侧区域为已有host，您可以进行修改，之后进行提交，确认修改后，右侧区域会显示出改动对比（用颜色区分增删），此时您可以确认提交或撤回 ，成功提交后可进到下一步。
  "></n-step>
        <n-step title="第二步"
          description="左侧区域为已有磁盘，您可以进行修改，之后进行提交，确认修改后，右侧区域会显示出改动对比（用颜色区分增删），此时您可以确认提交或撤回 ，成功提交后可进到下一步"></n-step>
        <n-step title="第三步" description="左侧区域为磁盘格式化进度，您可以选择下一步直接跳过，或者选择“格式化”"></n-step>
        <n-step title="第四步" description="获取当前集群配置（如果没有则为空），如果不存在，您可以新建集群，填写集群名称，集群配置并且进行集群创建。但集群名称不可修改
  "></n-step>
        <n-step title="第五步" description="改步骤会显示集群的配置，用户确认无误后可进行部署"></n-step>
      </n-steps>
      <div class="deploy-content">
        <!-- 根据当前选中的步骤，展示不同的部署内容 -->
        <div v-if="current === 1">
          <FirstStep></FirstStep>
        </div>
        <div v-if="current === 2">
          <SecondStep></SecondStep>
        </div>
        <div v-if="current === 3">
          <ThirdStep></ThirdStep>
        </div>
        <div v-if="current === 4">
          <FourthStep></FourthStep>
        </div>
        <div v-if="current === 5">
          <FifthStep  ref="fifthStepRef"></FifthStep>
        </div>
        <div class="step_control_btn">
          <n-button-group>
            <n-button @click="pre" :disabled="current === 1">上一步</n-button>
            <n-button @click="next" v-if="current !== 5">下一步</n-button>
            <n-button @click="submit" v-if="current === 5">部署</n-button>
          </n-button-group>
        </div>
      </div>
    </div>
  </n-card>
</template>
  
<script lang="ts"  setup>
import { ref, watchEffect, toRefs, reactive } from 'vue'
import { NSteps, useMessage, NStep, NCard, NButton, NButtonGroup, NInput, type StepsProps } from 'naive-ui'
import FirstStep from "./first-step.vue"
import SecondStep from "./sceond-step.vue"
import ThirdStep from "./third-step.vue"
import FourthStep from "./fourth-step.vue"
import FifthStep from "./fifth-step.vue"
import { useDeploymentStore } from "@/store/deployment/deployment"
import { useDashboardStore } from '@/store/clusterOverview/dashboard'

const message = useMessage();

const title = '集群部署';
const deplyomentStore = useDeploymentStore();
const { changeStepFlag, updateFinishStep, deployClusterDeploy, atStepFlag, finishStepFlag } = deplyomentStore;
const fifthStepRef = ref(null);

const current = ref(atStepFlag) // 当前选中的步骤，默认为第一步
const currentStatus = ref<StepsProps['status']>('process') // 步骤条的状态，process表示该步骤正在进行中，wait表示等待中，finish表示已完成

const submit = () => { 
  fifthStepRef.value.setLoading(true);
  deployClusterDeploy().then(res => {
    if(res.status === 200) {
    fifthStepRef.value.setLoading(false);
    message.success('部署成功');
    }
  })
}

const next = () => {
  let flag = "";
  switch (current.value) {
    case 1: flag = 'stepOne'; break;
    case 2: flag = 'stepTwo'; break;
    case 3: flag = 'stepThree'; break;
    case 4: flag = 'stepFour'; break;
    case 5: flag = 'finish'; break;
  }
  if (finishStepFlag[flag] === false) {
    message.error('请完成当前步骤');
    return
  }
  else {
    updateFinishStep(current.value);
    current.value++;
    changeStepFlag(current.value);
  }
}

const pre = () => {
  current.value--
}


watchEffect(() => {
  current.value = atStepFlag
})
</script>
  
<style scoped lang="scss">
.deploy_btn {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

.deploy {
  margin: 20px;

  .step_control_btn {
    margin-top: 5px;
  }
}

/* .n-card {
  height: 100%;
} */

.deploy-content {
  margin-top: 20px;
}
</style>