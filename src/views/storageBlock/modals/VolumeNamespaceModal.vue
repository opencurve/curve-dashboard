<template>
  <n-modal v-model:show="val" preset="dialog" title="创建卷命名空间">
    <n-form ref="formRef" :rules="rules" :model="formData">
      <n-form-item label="卷命名空间名称" path="name">
        <n-input-group>
          <n-input-group-label>当前位置:{{ currentPath }}</n-input-group-label>
          <n-input
            v-model:value="formData.name"
            placeholder="请输入卷名称"
          ></n-input>
        </n-input-group>
      </n-form-item>
      <n-form-item label="用户" path="user">
        <n-input
          v-model:value="formData.user"
          placeholder="请输入用户名"
        ></n-input>
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input
          v-model:value="formData.password"
          type="password"
          show-password-on="click"
          placeholder="请输入密码"
        ></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <div>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
        <n-button type="primary" @Click="confirmCreateNamespace">创建</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  type FormInst,
  type FormItemRule,
  type FormRules,
  messageDark,
  NSelect,
  useMessage,
} from 'naive-ui'
import { reactive, ref, watch } from 'vue'

import router from '@/router'
import { useBlockStore } from '@/store/blockStorageManagement/block'

const blockStore = useBlockStore()
const { createVolumeNamespace } = blockStore
let routePath = router.currentRoute.value.params.path
let currentPath = ref(!routePath ? '/' : '/' + routePath.join('/') + '/')
const message = useMessage()
const emit = defineEmits(['createNamespace'])
const formRef = ref<FormInst>()

const formData = reactive({
  name: '',
  user: '',
  password: '',
})

const rules: FormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入卷名称',
  },

  user: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名',
  },
}

const clearFormData = () => {
  formData.name = ''
  formData.user = ''
  formData.password = ''
}

const confirmCreateNamespace = () => {
  formRef.value?.validate(err => {
    if (err) return message.error('请正确填写必填项内容')
    const params = {
      name: currentPath.value + formData.name,
      user: formData.user,
      password: formData.password,
    }
    createVolumeNamespace(params).then(res => {
      if (res.status === 200) {
        message.success('创建卷名称成功')
        cancel()
        emit('createNamespace')
        clearFormData()
      } else {
        message.error('创建命名空间失败，请检查填入的信息')
      }
    })
  })
}

let val = ref(false)
//点击取消，关闭模态框
const cancel = () => {
  val.value = false
}

//展示模态框，供外部调用
const showModal = () => {
  val.value = true
}

watch(
  () => router.currentRoute.value,
  () => {
    if (window.location.pathname.includes('volume-management')) {
      routePath = router.currentRoute.value.params.path
      currentPath.value = !routePath ? '/' : '/' + routePath.join('/') + '/'
    }
  },
)

defineExpose({ showModal })
</script>
