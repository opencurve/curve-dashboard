import dayjs from 'dayjs'
import { toRaw } from 'vue'

import type { RangeItem } from '@/model/cluster'
import type { PerformanceItem } from '@/model/common'
import type { chartData, ChartSeries } from '#/index'

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
  if (diffDays === 0) return '{HH}:{mm}:{ss}'
  return '{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}'
}

const divisorMap = {
  Mb: (1024 * 1024) / 8,
  MB: 1024 * 1024,
}
type FixType = undefined | 'Mb' | 'MB'
export const fixNum = (numString: string | number, fixType: FixType = 'MB') =>
  +(+numString / divisorMap[fixType!]).toFixed(2)

export const gEchartsSeriesData = (
  data: { [name: string]: RangeItem[] },
  fixType?: FixType,
  type = 'line',
) =>
  Object.entries(data).map(([key, value]) => ({
    type,
    name: key,
    data: value.map<[number, number]>(({ timestamp, value }) => [
      timestamp * 1000,
      fixType ? fixNum(value, fixType) : Number(Number(value).toFixed(2)),
    ]),
  }))

export const gEchartsSeriesDataByPerformance = (performanceList: {
  [key: string]: PerformanceItem[]
}) => {
  const res: [ChartSeries[], ChartSeries[], ChartSeries[], ChartSeries[]] = [
    [],
    [],
    [],
    [],
  ]
  Object.entries(performanceList).forEach(([name, list]) => {
    const data: [chartData, chartData, chartData, chartData] = [[], [], [], []]
    list.forEach(({ timestamp, readBPS, readIOPS, writeBPS, writeIOPS }) => {
      const time = timestamp * 1000
      void [readBPS, readIOPS, writeBPS, writeIOPS].forEach((item, index) => {
        data[index].push([
          time,
          index % 2 ? Number(Number(item).toFixed(2)) : fixNum(item, 'MB'),
        ])
      })
    })
    data.forEach((item, index) => {
      res[index].push({
        type: 'line',
        data: item,
        name,
      })
    })
  })
  return res
}
