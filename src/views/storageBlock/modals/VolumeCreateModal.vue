<template>
  <n-modal v-model:show="visible" preset="dialog" :title="volumeTitle">
    <n-form
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <!-- 卷类型 -->
      <n-form-item v-if="selectVisible" label="卷类型">
        <n-select
          v-model:value="volumeType"
          :options="voluemOptions"
          @update:value="onChangeVolumeType"
        />
      </n-form-item>
      <!-- 卷名称 -->
      <n-form-item v-if="volumeType === 1" path="volumeName" label="卷名称">
        <n-input-group>
          <n-input-group-label>当前路径:{{ currentPath }}</n-input-group-label>
          <n-input
            v-model:value="formData.volumeName"
            placeholder="请输入卷名称..."
          >
          </n-input>
        </n-input-group>
      </n-form-item>
      <!-- 卷名称（克隆卷目的名） -->
      <n-form-item v-if="volumeType === 2" path="dest" label="卷名称">
        <n-input
          v-model:value="formData.dest"
          placeholder="请输入卷名称..."
        ></n-input>
      </n-form-item>
      <!-- 用户名 -->
      <n-form-item path="userName" label="用户">
        <n-tooltip placement="bottom" trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm0 8.5A.75.75 0 1 0 8 12a.75.75 0 0 0 0-1.5zm0-6a2 2 0 0 0-2 2a.5.5 0 0 0 1 0a1 1 0 0 1 2 0c0 .37-.083.58-.366.898l-.116.125l-.264.27C7.712 8.36 7.5 8.768 7.5 9.5a.5.5 0 0 0 1 0c0-.37.083-.58.366-.898l.116-.125l.264-.27C9.788 7.64 10 7.232 10 6.5a2 2 0 0 0-2-2z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </n-icon>
          </template>
          <span> 如果在命名空间下创建，用户必须为该命名空间所有者 </span>
        </n-tooltip>
        <n-input
          v-model:value="formData.userName"
          placeholder="请输入用户名..."
        ></n-input>
      </n-form-item>
      <!-- 克隆卷来源 -->
      <n-form-item v-if="volumeType === 2" path="src" label="来源">
        <n-tooltip trigger="hover" placement="top" style="margin-right: 3px">
          <template #trigger>
            <n-icon size="11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </template>
          如果是从镜像克隆，则是源卷名称，全路径，例如/dir1/test1
          如果上是从快照克隆，则是快照uuid
        </n-tooltip>
        <n-input
          v-model:value="formData.src"
          v-model:disabled="srcDisabled"
          placeholder="请输入卷来源..."
        ></n-input>
      </n-form-item>
      <!-- 卷长度 -->
      <n-form-item v-if="volumeType === 1" path="volumeLength" label="卷长度">
        <n-input
          v-model:value="formData.volumeLength"
          placeholder="卷长度在10-20x1024 GiB..."
        ></n-input>
      </n-form-item>
      <n-form-item v-if="volumeType === 1" path="password" label="密码">
        <n-input
          v-model:value="formData.password"
          type="password"
          placeholder="请输入密码..."
          show-password-on="click"
        ></n-input>
      </n-form-item>
      <n-form-item v-if="volumeType === 1" path="stripUnit" label="条带长度">
        <n-tooltip placement="bottom" trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm0 8.5A.75.75 0 1 0 8 12a.75.75 0 0 0 0-1.5zm0-6a2 2 0 0 0-2 2a.5.5 0 0 0 1 0a1 1 0 0 1 2 0c0 .37-.083.58-.366.898l-.116.125l-.264.27C7.712 8.36 7.5 8.768 7.5 9.5a.5.5 0 0 0 1 0c0-.37.083-.58.366-.898l.116-.125l.264-.27C9.788 7.64 10 7.232 10 6.5a2 2 0 0 0-2-2z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </n-icon>
          </template>
          <span>
            参数限制：<br />
            1.segmentSize = 1 * 1024 *1024 *1024 <br />
            2.chunksize = 16*1024*1024 <br />
            3.不能一个为0,一个不为0 <br />
            4.stripUnit &lt; chunksize <br />
            5.chunksize%stripUnit == 0 && chunksize%stripCount == 0 <br />
            6.stripUnit % 4096 == 0 <br />
            7.stripCount &lt; segmentSize/chunkSize <br />
            8.当stripCount == 1 时，stripUnit == chunkSize
          </span>
        </n-tooltip>
        <n-input
          v-model:value="formData.stripUnit"
          placeholder="请输入条带长度..."
        ></n-input>
      </n-form-item>
      <n-form-item v-if="volumeType === 1" path="stripCount" label="条带数">
        <n-tooltip placement="bottom" trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm0 8.5A.75.75 0 1 0 8 12a.75.75 0 0 0 0-1.5zm0-6a2 2 0 0 0-2 2a.5.5 0 0 0 1 0a1 1 0 0 1 2 0c0 .37-.083.58-.366.898l-.116.125l-.264.27C7.712 8.36 7.5 8.768 7.5 9.5a.5.5 0 0 0 1 0c0-.37.083-.58.366-.898l.116-.125l.264-.27C9.788 7.64 10 7.232 10 6.5a2 2 0 0 0-2-2z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </n-icon>
          </template>
          <span>
            参数限制：<br />
            1.segmentSize = 1 * 1024 *1024 *1024 <br />
            2.chunksize = 16*1024*1024 <br />
            3.不能一个为0,一个不为0 <br />
            4.stripUnit &lt; chunksize <br />
            5.chunksize%stripUnit == 0 && chunksize%stripCount == 0 <br />
            6.stripUnit % 4096 == 0 <br />
            7.stripCount &lt; segmentSize/chunkSize <br />
            8.当stripCount == 1 时，stripUnit == chunkSize
          </span>
        </n-tooltip>
        <n-input
          v-model:value="formData.stripCount"
          placeholder="请输入条带数..."
        ></n-input>
      </n-form-item>
      <n-form-item v-if="volumeType === 2" path="stripCount" label="是否Lazy">
        <n-radio
          :checked="checkedValue === 'isLazy'"
          value="isLazy"
          @change="handelChange"
        >
          是
        </n-radio>
        <n-radio
          :checked="checkedValue === 'notLazy'"
          value="notLazy"
          @change="handelChange"
        >
          否
        </n-radio>
      </n-form-item>
    </n-form>
    <template #action>
      <div>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
        <n-button type="primary" @Click="confirmCreateVolume">创建</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import md5 from 'js-md5'
import {
  type FormItemRule,
  type FormRules,
  NFormItem,
  NRadio,
  NSelect,
  useMessage,
} from 'naive-ui'
import { reactive, ref, toRef, watch } from 'vue'

import router from '@/router'
import { useBlockStore } from '@/store/blockStorageManagement/block'

const { createVolume, cloneVolume } = useBlockStore()
const message = useMessage()
// const cloneFlag = ref(false);
//判断选择创建类型要不要显示，从row里直接点进去克隆就不显示
const selectVisible = ref(true)
//判断底部的来源是不是写死，如果从row直接点进来就写死
const srcDisabled = ref(false)
//标记是不是从选项里选择的克隆，因为如果只按照srcDisabled来判断，从‘创建卷’入口进入的时候选择克隆，来源输入框就被置灰了
const chosenCloneFromSelect = ref(false)
const volumeTitle = ref('创建卷')
const emit = defineEmits(['createVolume'])

const formData = reactive({
  volumeName: '',
  volumeLength: null,
  userName: '',
  password: '',
  stripUnit: null,
  stripCount: null,
  src: '',
  dest: '',
  isLazy: true,
})

const checkedValue = ref('isLazy')

const handelChange = (e: Event) => {
  checkedValue.value = e.target.value
  if (e.target.value === 'isLazy') {
    formData.isLazy = true
  }
  if (e.target.value === 'notLazy') {
    formData.isLazy = false
  }
}

const setFormData = (data: object) => {
  volumeType.value = data.volumeType
  formData.src = data.src
}

const clearFormData = () => {
  formData.volumeName = ''
  formData.volumeLength = null
  formData.userName = ''
  formData.password = ''
  formData.stripUnit = null
  formData.stripCount = null
  formData.src = ''
  formData.dest = ''
  formData.isLazy = true
}

// const formValidator = reactive({
const volumeLengthValidator = () => {
  if (
    formData.volumeLength === 'number' &&
    formData.volumeLength > 10 &&
    formData.volumeLength < 20 * 1024
  ) {
    return true
  } else {
    return false
  }
}
const volulmeNameValidator = () => {
  return true
}

const rules: FormRules = {
  volumeName: [
    {
      required: true,
      message: '请输入卷名称',
      trigger: ['input', 'blur'],
    },
    {
      validator: volulmeNameValidator,
      message: '请输入正确卷名，默认在当前路径创建新卷',
      trigger: ['input', 'blur'],
    },
  ],
  userName: [
    {
      required: true,
      message: '请输入用户',
      trigger: ['input', 'blur'],
    },
    {
      message: '用户名应为字母或大小写数字，长度为5-64位',
      trigger: ['input', 'blur'],
    },
  ],
  volumeLength: [
    {
      required: true,
      message: '请输入卷长度',
      trigger: ['input', 'blur'],
    },
    {
      validator: volumeLengthValidator,
      message: '请输入一个10GiB到20TB(20x1024)之间的数字',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      message:
        '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  stripUnit: [
    {
      message:
        '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  stripCount: [
    {
      message:
        '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  dest: [
    {
      message:
        '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  src: [
    {
      message:
        '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
}

const setVisibleAndDisabled = (val1: boolean, val2: boolean) => {
  selectVisible.value = val1
  srcDisabled.value = val2
}

let routePath = router.currentRoute.value.params.path
let currentPath = ref(!routePath ? '/' : '/' + routePath.join('/') + '/')

const voluemOptions = ref([
  { label: '普通卷', value: 1 },
  { label: '克隆卷', value: 2 },
])
const volumeType = ref(1)

let visible = ref(false)
//点击取消，关闭模态框
const cancel = () => {
  visible.value = false
  selectVisible.value = true
  srcDisabled.value = false
  clearFormData()
}

const confirmCreateVolume = () => {
  let params = null
  if (srcDisabled.value || chosenCloneFromSelect.value) {
    params = {
      dest: formData.dest,
      user: formData.userName,
      // length: +formData.volumeLength,
      lazy: formData.isLazy,
      src: formData.src,
      // password: formData.password,
      // stripUnit: +formData.stripUnit || 0,
      // stripCount: +formData.stripCount || 0
    }
    cloneVolume(params).then(res => {
      if (res.status === 200) {
        cancel()
        message.success('克隆卷成功')
        emit('createVolume')
        clearFormData()
        return
      } else {
        message.error('克隆失败，请检查信息是否填写正确')
      }
    })
  } else {
    params = {
      volumeName: currentPath.value + formData.volumeName,
      user: formData.userName,
      length: +formData.volumeLength,
      password: formData.password,
      // lazy: formData.isLazy,
      stripUnit: +formData.stripUnit || 0,
      stripCount: +formData.stripCount || 0,
    }

    createVolume(params).then(res => {
      if (res.status === 200) {
        cancel()
        clearFormData()
        message.success('创建卷成功')
        emit('createVolume')
        clearFormData()
      } else {
        message.error('创建失败，请检查信息是否填写正确')
      }
    })
  }
  // }
}

//展示模态框，供外部调用
const showModal = () => {
  visible.value = true
}

const onChangeVolumeType = (val: number) => {
  if (val === 2) {
    volumeTitle.value = '克隆卷'
    chosenCloneFromSelect.value = true
  } else {
    volumeTitle.value = '创建卷'
  }
}

watch(
  () => router.currentRoute.value.params.path,
  () => {
    if (window.location.pathname.includes('volume-management')) {
      routePath = router.currentRoute.value.params.path
      currentPath.value = !routePath ? '/' : '/' + routePath.join('/') + '/'
    }
  },
)

// watch(cloneFlag, () => {
//     if (cloneFlag.value) {
//         volumeTitle.value = "克隆卷"
//     }
//     else {
//         volumeTitle.value = "创建卷"
//     }
// })

defineExpose({
  showModal,
  setFormData,
  setVisibleAndDisabled,
})
</script>

<style lang="scss">
.n-form-item__label-extra {
  position: absolute;
  bottom: -15px;
  left: 100%;
  transform: translateX(5px);
}
</style>
