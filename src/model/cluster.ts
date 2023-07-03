export interface ClusterTrendDataItem {
  timestamp: number
  total: number
  alloc: number
}
export interface ClusterPerformanceDataItem {
  readBPS: string
  readIOPS: string
  timestamp: number
  writeBPS: string
  writeIOPS: string
}
