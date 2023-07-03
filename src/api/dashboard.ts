import type {
  ClusterPerformanceDataItem,
  ClusterTrendDataItem,
} from '@/model/cluster'
import type { TrendChartParams } from '@/model/common'
import type { Res } from '@/utils/_fetch'
import _fetch from '@/utils/_fetch'

//获取集群状态
export const getClusterStatusApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=status.cluster`,
  })
}

export const getETCDStatusApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=status.etcd`,
  })
}

export const getMDSStatusApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=status.mds`,
  })
}

export const getSnapshotCloneServerStatusApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=status.snapshotcloneserver`,
  })
}

export const getChunkServerStatusApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=status.chunkserver`,
  })
}

export const getClusterSpaceApi = () => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'GET',
    url: `/curvebs?method=space.cluster`,
  })
}

export const getClusterPerformanceApi = (data: TrendChartParams) => {
  return _fetch<Res<ClusterPerformanceDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=performance.cluster`,
    data,
  })
}

//二期，集群容量趋势
export const getClusterTrendApi = (data: TrendChartParams) => {
  return _fetch<Res<ClusterTrendDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=space.trend.cluster`,
    data,
  })
}

//清理RecycleBin
export const clearRecyclebin = () => {
  return _fetch<Res<{ result: Array<object> }>>({
    method: 'GET',
    url: `/curvebs?method=recyclebin.clean`,
  })
}
