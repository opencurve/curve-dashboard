<template>
  <n-spin :show="loading">
    <div class="container">
     <n-input v-model:value="config" type="textarea" :rows="15" placeholder="等待获取配置..." disabled/>
    </div>
  </n-spin>
</template>

<script lang="ts" setup>
  import {ref} from 'vue'
  import {NInput, NSpin} from "naive-ui"
  import {useDeploymentStore} from "@/store/deployment/deployment"

  const deploymentStore = useDeploymentStore();
  const {deployConfigShow, deployClusterDeploy} = deploymentStore;
  const loading = ref(false);

  deployConfigShow().then(res => {
    config.value = res.data.data.config || "获取配置失败，请检查步骤";
  })

  const setLoading = (val: boolean) => {
    loading.value = val
  }

  defineExpose({setLoading})

  const config = ref("");
</script>

<style lang="scss" scoped>
</style>