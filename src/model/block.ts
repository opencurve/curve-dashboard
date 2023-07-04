import type { TrendChartParams } from './common'

export type getVolumeDetailParams = TrendChartParams & { volumeName: string }

export interface VolumeDetailInfo {
  alloc: number
  chunkSize: number
  cloneLength: number
  cloneSource: string
  ctime: string
  epoch: number
  fileName: string
  fileStatus:
    | 'kFileCreated'
    | 'kFileDeleting'
    | 'kFileCloning'
    | 'kFileCloneMetaInstalled'
    | 'kFileCloned'
    | 'kFileBeingCloned'

  fileType: string
  id: number
  length: number
  mountPoints: string[]
  originalFullPathName: string
  owner: string
  parentId: number
  segmentSize: number
  seqNum: number
  stripeCount: number
  stripeUnit: number
  throttleParams: {
    type: string
    limit: number
    burst: number
    burstLength: number
  }[]
}

export type VolumeDetailRenderInfo = Pick<
  VolumeDetailInfo,
  | 'alloc'
  | 'ctime'
  | 'id'
  | 'parentId'
  | 'stripeCount'
  | 'throttleParams'
  | 'fileName'
  | 'length'
  | 'fileStatus'
  | 'owner'
> &
  Partial<Pick<VolumeDetailInfo, 'mountPoints' | 'stripeUnit'>>
export interface BlockPerformanceItem {
  readBPS: string
  readQPS: string
  timestamp: number
  writeBPS: string
  writeQPS: string
}

export interface VolumeDetail {
  info: VolumeDetailInfo
  performance: BlockPerformanceItem[]
  pools: {
    alloc: number
    id: number
    name: string
    type: string
  } // 这个字段目前项目中没有用到
}
