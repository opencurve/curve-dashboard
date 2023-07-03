<template>
  <NSpace>
    <!-- 考虑限制时间跨度 -->
    <n-date-picker
      v-model:value="state.range"
      type="datetimerange"
      :is-date-disabled="checkIsDateDisabled"
    />
    <n-select
      v-model:value="state.interval"
      placeholder="采样时间间隔"
      :options="options"
      style="width: 100px"
    />
  </NSpace>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { NDatePicker, NSelect, NSpace } from 'naive-ui'
import { reactive, watch } from 'vue'

import type { onChange } from './types'
const props = withDefaults(
  defineProps<{
    onChange: onChange
    options?: { label: string; value: number }[]
    dateSubtractValue?: number
    intervalIndex?: number
  }>(),
  {
    onChange: () => {},
    dateSubtractValue: 1,
    intervalIndex: 2,
    options: () => [
      {
        label: '1分钟',
        value: 60,
      },
      {
        label: '30秒',
        value: 30,
      },
      {
        label: '15秒',
        value: 15,
      },
      {
        label: '5秒',
        value: 5,
      },
      {
        label: '1秒',
        value: 1,
      },
    ],
  },
)
const subtractKey = props.options[0].value < 3600 ? 'hour' : 'day'
const start = dayjs().subtract(props.dateSubtractValue, subtractKey).valueOf()
const end = dayjs().valueOf()

const state = reactive({
  range: [start, end] as [number, number],
  interval: props.options[props.intervalIndex].value,
})
const checkIsDateDisabled = (
  current: number,
  phase: 'start' | 'end',
  value: [number, number] | null,
) => {
  return current > Date.now() || (phase === 'end' && current < value![0])
}
watch(
  () => [state.range, state.interval],
  () => {
    props.onChange(state.range, state.interval)
  },
  { immediate: true },
)
</script>
