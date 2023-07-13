<template>
  <n-modal v-model:show="val" preset="dialog" title="编辑告警规则">
    <n-form :model="formData">
      <n-form-item label="告警规则开关">
        <n-switch v-model:value="formData.alertSwitch" />
      </n-form-item>
      <n-form-item path="length">
        <template #label>
          <span> 检测间隔: </span>
        </template>
        <n-input
          v-model:value="formData.alertInterval"
          placeholder="请输入检测间隔..."
        ></n-input>
      </n-form-item>
      <n-form-item path="length">
        <template #label>
          <span> 触发次数上限: </span>
        </template>
        <n-input
          v-model:value="formData.triggerLimit"
          placeholder="请输入出发次数..."
        ></n-input>
      </n-form-item>
      <n-form-item path="length">
        <template #label>
          <span> 告警规则: </span>
        </template>
        <n-input
          v-if="!nameIsSpace"
          v-model:value="formData.rule"
          disabled
          placeholder="请输入告警规则..."
        ></n-input>
        <n-input-number
          v-if="nameIsSpace"
          v-model:value="formData.rule"
          :min="1"
          :max="99"
          placeholder="请输入告警规则..."
        ></n-input-number>
      </n-form-item>
      <NFormItem label="接收人:">
        <NSelect
          v-model:value="formData.alertUsers"
          placeholder="请选择接收人"
          :options="userOptions"
          multiple
          filterable
        />
      </NFormItem>
    </n-form>
    <template #action>
      <div>
        <n-button type="primary" @Click="updateAlertRule">确定</n-button>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { NFormItem, NSelect, useMessage } from 'naive-ui'
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { getAlertCandidateApi, updateAlertRuleApi } from '@/api/alert'
import type { AlertItem, PostAlertConfig } from '@/model/alert'

const message = useMessage()
const currentLengthInModal = ref(null)
const nameIsSpace = ref(false)
const emit = defineEmits(['alert-config-updated'])

const setVolumeToExtend = (name: string, currentLength: number) => {
  formData.volumeName = name
  currentLengthInModal.value = currentLength
}

const props = defineProps<{ rowInfo: AlertItem }>()
const disableRule = ref(true)
const state = reactive({
  userList: [] as string[],
})
const formData = reactive({
  alertSwitch: false,
  alertInterval: 0,
  triggerLimit: 0,
  rule: '',
  alert: '',
  alertUsers: [] as string[],
})

const lengthValidator = () => {
  const checkIsNotNumber = isNaN(formData.length)
  if (
    formData.length < 10 ||
    formData.length === 0 ||
    formData.length > 20 * 1024
  ) {
    return false
  } else if (formData.length <= currentLengthInModal.value) {
    return false
  } else if (checkIsNotNumber) {
    return false
  } else return true
}

const rules = {
  length: [
    {
      required: true,
    },
    {
      validator: lengthValidator,
      message: '请输入正确长度，长度需要在10-20*1024之间，并且大于当前容量',
      trigger: ['input', 'blur'],
    },
  ],
}

const updateAlertRule = async () => {
  const { alertSwitch, alertInterval, triggerLimit, rule, alertUsers } =
    formData
  const params: PostAlertConfig = {
    name: props.rowInfo.name,
    enable: alertSwitch,
    interval: +alertInterval,
    times: +triggerLimit,
    rule: typeof rule === 'string' ? rule : rule.toString(),
    alertUsers,
  }
  const [err, res] = await updateAlertRuleApi(params)
  if (err) return message.error('更新失败')
  message.success('更新配置成功！')
  emit('alert-config-updated')
  cancel()
}

let val = ref(false)
//点击取消，关闭模态框
const cancel = () => {
  val.value = false
  formData.volumeName = ''
  formData.length = null
}

//展示模态框，供外部调用
const showModal = () => {
  val.value = true
}

const getAlertCandidate = async () => {
  const [err, res] = await getAlertCandidateApi()
  if (err) return console.log('请求报错啦', err)
  state.userList = res.data.data
}

watch(
  () => props.rowInfo,
  () => {
    formData.alertSwitch = props.rowInfo.enable
    formData.alertInterval = props.rowInfo.interval
    formData.triggerLimit = props.rowInfo.times
    formData.rule = props.rowInfo.rule
    formData.alertUsers = props.rowInfo.alertUsers
    formData.alert = props.rowInfo.name

    if (props.rowInfo.name === 'space') {
      nameIsSpace.value = true
    } else {
      nameIsSpace.value = false
    }
  },
)

const userOptions = computed(() => {
  return state.userList.map(item => ({
    label: item,
    value: item,
  }))
})

onMounted(() => {
  getAlertCandidate()
})

defineExpose({ showModal, setVolumeToExtend })
</script>
