import dayjs from 'dayjs'
import { toRaw } from 'vue'

import router from '../router'

export const notUserCheck = () => {
  const path = toRaw(router).currentRoute.value.fullPath
  if (
    path.includes('login') ||
    path.includes('signup') ||
    path.includes('change-password')
  ) {
    return false
  }
  return true
}

export const getEChartsFormatter = (start: number, end: number) => {
  const diffDays = dayjs(end).diff(dayjs(start), 'days')
  if (diffDays === 0) return '{hh}:{mm}:{ss}'
  return '{yyyy}-{MM}-{dd}\n{hh}:{mm}:{ss}'
}
