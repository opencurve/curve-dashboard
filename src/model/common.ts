export interface TrendChartParams {
  start: number
  end: number
  interval: number
}
export interface PerformanceItem {
  readBPS: string
  readIOPS: string
  timestamp: number
  writeBPS: string
  writeIOPS: string
}
