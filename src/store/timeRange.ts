import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useTimeRangeStore = defineStore('timeRanger', () => {
  const currentDate = new Date()
  const currentTime = Math.floor(currentDate.getTime())
  const start = currentTime - 60 * 60 * 1000
  const end = currentTime

  const timeRange = reactive<{ start: number; end: number }>({ start, end })

  const interval = ref(15)
  const setInterval = (val: number) => {
    interval.value = val
  }

  const setTimeRange = (timeValue: [number, number]) => {
    timeRange.start = timeValue[0]
    timeRange.end = timeValue[1]
  }

  return {
    interval,
    timeRange,
    setTimeRange,
    setInterval,
  }
})
