import type { PerformanceItem, TrendChartParams } from './common'

export type GetHostDetailParams = TrendChartParams & { hostName: string }
export interface ClusterTrendDataItem {
  timestamp: number
  total: number
  alloc: number
}

export interface RangeItem {
  timestamp: number
  value: string
}

export interface HostDetail {
  cpuUtilization: {
    timestamp: number
    value: string
  }[]
  diskPerformance: {
    [key: string]: PerformanceItem[]
  }
  host: {
    diskNum: number
    hostName: string
    ip: string
    kernelRelease: string
    kernelVersion: string
    machine: string
    memory: number
    operatingSystem: string
    cpuCores: {
      totalNum: number
      cpuModles: {
        [key: string]: number
      }
    }
  }
  memUtilization: RangeItem[]
  networkTraffic: {
    receive: {
      [key: string]: RangeItem[]
    }
    transmit: {
      [key: string]: RangeItem[]
    }
  }
}
