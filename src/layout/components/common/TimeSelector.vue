<template>
  <n-date-picker v-model:value="range" type="datetimerange" clearable />
</template>

<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import { ref, watch } from 'vue'

import { useTimeRangeStore } from '@/store/timeRange'

const timeRangeStore = useTimeRangeStore()
const { timeRange, setTimeRange } = timeRangeStore

const range = ref<[number, number]>([0, 0])
range.value[0] = timeRange.start
range.value[1] = timeRange.end

watch(range, newVal => {
  setTimeRange(newVal)
})
</script>

<style lang="scss" scoped></style>
