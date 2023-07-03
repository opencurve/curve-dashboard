<template>
  <n-select
    v-model:value="intervalVal"
    placeholder="采样时间间隔"
    :options="options"
    @update:value="handleUpdateValue"
  />
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { isReactive, isRef, ref, toRefs, watch } from 'vue'

import { useTimeRangeStore } from '@/store/timeRange'

const options = ref([
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
])

const timeRangeStore = useTimeRangeStore()
const { timeRange, setTimeRange, setInterval } = timeRangeStore
const { interval } = toRefs(timeRangeStore)

const intervalVal = ref(interval.value)

const handleUpdateValue = (val: number) => {
  setInterval(val)
}

const range = ref<[number, number]>([0, 0])
range.value[0] = timeRange.start
range.value[1] = timeRange.end

watch(range, newVal => {
  setTimeRange(newVal)
})
</script>

<style lang="scss" scoped></style>
