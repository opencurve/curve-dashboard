import type { PerformanceItem, TrendChartParams } from './common'

export interface StoragePoolInfo {
  allocateStatus: string
  chunkServerNum: number
  copysetNum: number
  createTime: string
  id: number
  name: string
  physicalPoolId: number
  scanEnable: boolean
  serverNum: number
  space: { total: number; alloc: number; canRecycled: number }
  type: string
}

export interface StoragePoolDetail {
  info: StoragePoolInfo
  performance: PerformanceItem[]
}

export type StoragePoolDetailParams = TrendChartParams & { id: number }
