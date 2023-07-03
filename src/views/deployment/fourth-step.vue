<template>
  <div class="container">
    <!-- 如果预先已经有集群配置 -->
    <div v-if="!status.createFromNone" class="input-container">
      <!-- <n-input v-model:value="clusterName" style="width: 25%; text-align: center;" disabled>  
        <template #prefix>
          <div style="background-color: gray; color:#fff;">
            集群名称：
          </div>
        </template>
      </n-input> -->
      <div class="cluster-name">
        <n-input-group>
          <n-button >
            集群名称:
          </n-button>
          <n-button :style="{ width: '25%' }" type="info">{{ clusterName }}</n-button>
        </n-input-group>
      </div>
      <n-input type="textarea" :rows="10" v-model:value="clusterConfig" placeholder="请输入集群配置..."
        :disabled="!status.editing">
      </n-input>
      <div class="button-group-container">
        <n-button-group>
          <n-button v-if="!status.editing" size="medium" @click="changeConfig">
            修改配置
          </n-button>
          <n-button v-if="status.editing" size="medium" @click="saveChangeConfig">
            保存修改
          </n-button>
          <n-button v-if="status.editing" size="medium" @click="cancelChangeConfig">
            取消修改
          </n-button>
        </n-button-group>
      </div>
    </div>
    <!-- 如果预先没有集群配置 -->
    <div v-if="status.createFromNone" class="create-from-none">
      <div class="form-container">
        <n-form :model="formData" :rules="rules">
          <n-space vertical>
            <n-form-item label-placement="left" label-width="auto" path=“clusterName” label="集群名称:">
              <n-input v-model:value="formData.clusterName" ref="clusterName" />
            </n-form-item>
            <n-form-item label-placement="left" label-width="auto" label="集群配置:" path=clusterConfig>
              <n-input v-model:value="formData.clusterConfig" type="textarea" ref="clusterConfig" style="height: 200px" />
            </n-form-item>
            <n-form-item label-placement="left" label-width="auto" label="集群描述:" path=clusterDescription>
              <n-input v-model:value="formData.clusterDescription" type="textarea" ref="clusterDescription"
                style="height: 200px" />
            </n-form-item>
          </n-space>
        </n-form>
      </div>
      <div class="add-cluster-button">
        <n-button @click="addCluster">
          添加集群
        </n-button>
      </div>
    </div>
    <!-- 有集群配置情况下的按钮群 -->
    <div>
    </div>

    <n-modal v-model:show="showModal" preset="dialog">
      <div>您还没有创建集群，请创建一个集群</div>
      <template #action>
        <div>
          <n-button @click="() => { showModal = false }">
            确认
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NInput, NInputGroup, NModal, NSpace, NButtonGroup, NForm, NFormItem, useMessage, type FormRules } from "naive-ui";
import { useDeploymentStore } from "@/store/deployment/deployment";
import * as Diff from 'diff'
import { ref, reactive, watch } from "vue";

const { deployConfigShow, deployConfigCommit, deployClusterAdd, updateFinishStep } = useDeploymentStore();
const message = useMessage();

//一些基础配置变量
const status = reactive({
  editing: false,
  createFromNone: false,
})
const loading = ref(false);
const showModal = ref(false);
const formData = reactive({
  clusterName: "",
  clusterConfig: "",
  clusterDescription: ""
})
const clusterName = ref("")
const originalClusterConfig = ref("");
const clusterConfig = ref("");
const rules: FormRules = {
  clusterName: [
    {
      required: true,
      message: '请输入集群名称'
    }
  ],
  clusterConfig: [
    {
      required: true,
      message: '请输入集群配置'
    }
  ],
  clusterDescription: [
    {
      required: true,
      message: '请输入集群描述'
    }
  ]
}


//涉及操作的函数
const changeConfig = () => {
  status.editing = true;
}
const cancelChangeConfig = () => {
  status.editing = false;
  clusterConfig.value = originalClusterConfig.value;
}
const saveChangeConfig = () => {
  const params = {
    name: clusterName.value,
    conf: clusterConfig.value
  }
  deployConfigCommit(params).then(res => {
    loading.value = true;
    if (res.status === 200) {
      message.success("修改配置成功");
      status.editing = false;
      updateFinishStep(4);
      loading.value = false
    }
  }).finally(() => {
    editing.value = false;
  })
}
const addCluster = () => {
  const params = {
    name: formData.clusterName,
    conf: formData.clusterConfig,
    desc: formData.clusterDescription
  }
  deployClusterAdd(params).then(res => {
    if (res.status === 200) {
      message.success('创建成功，请进行下一步');
      updateFinishStep(4);
    }
  })
}

deployConfigShow().then(res => {
  if (res.data.data.config === "" && res.data.data.name === "") {
    showModal.value = true;
    status.createFromNone = true;
    return
  }
  clusterName.value = res.data.data.name;
  originalClusterConfig.value = res.data.data.config
  clusterConfig.value = res.data.data.config

  if (originalClusterConfig.value !== '') {
    updateFinishStep(4);
  }
}); 
</script>

<style lang="scss" scoped>
.container {
  // .n-input {
  //   height: 300px;
  // }

  .create-from-none {
    display: flex;
    justify-content: space-between;
    width: 800px;
    /* 设置合适的宽度 */
  }

  .form-container {
    width: 60%;
    /* 左侧表格宽度 */
  }

  .n-form-item:nth-child(2) .n-input,
  .n-form-item:nth-child(3) .n-input {
    height: 200px;
    /* 设置高度为200px */
    width: 100%;
    /* 设置宽度为100% */
  }

  .add-cluster-button {
    width: 30%;
    /* 右侧按钮宽度 */
    display: flex;
    // align-items: flex-end;
    justify-content: center;
    align-items: center;
  }

  .input-container {
    flex-grow: 2;
  }

  .button-group-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cluster-name {
    margin-bottom: 3px
  }
}
</style>