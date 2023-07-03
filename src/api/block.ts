import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'
// /curvebs?method=topo.pool.list
export type getVolumeApiDataItem = {
  [key: string]: string | number
}

//获取卷列表
export const getVolumeListApi = (data: {
  size: number
  page: number
  path: string
  sortKey: string
  sirtDirection: number
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.list`,
    data,
  })
}

//创建普通卷
export const createVolumeApi = (data: {
  volumeNames: string,
  user: string,
  length: number,
  password: string,
  stripUnit: number,
  stripCount: number
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.create`,
    data,
  })
}
//克隆卷
export const cloneVolumeApi = (data: {
  src: string,
  user: string,
  dest: number,
  lazy: boolean,
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.clone`,
    data,
  })
}
//lazy克隆卷安装数据
export const lazyCloneVolumeApi = (data: {
  volumeName: string,
  user: string,
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.flatten`,
    data,
  })
}
//打快照
export const createSnapshotApi = (data: {
  volumeName: string,
  user: string,
  snapshotName: string

}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=snapshot.create`,
    data,
  })
}
//删除snapShot
export const deleteSnapshotApi = (data: {
  volumeName: string,
  user: string,
  uuids: Array<String>,
  failed: boolean
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=snapshot.delete`,
    data,
  })
}
//取消打快照
export const cancelSnapshotApi = (data: {
  snapshots: object,
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=snapshot.cancel`,
    data,
  })
}
//卷扩容
export const expandVolumeApi = (data: {
  volumeName: string,
  length: string,
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.extend`,
    data,
  })
}
//设置卷限流
export const throttleVolumeApi = (data: {
  volumeName: string,
  throttleType: string,
  limit: number,
  burst: number,
  burstLength: number
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.throttle`,
    data,
  })
}
//删除卷
export const deleteVolumeApi = (data: {
  volumeNames: Object
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.delete`,
    data,
  })
}
//恢复卷
export const recoverVolumeApi = (data: {
  volumeIds: Object
}) => {
  return _fetch<Res<getVolumeApiDataItem[]>>({
    method: 'POST',
    url: `/curvebs?method=volume.recover`,
    data,
  })
}
//创建卷命名空间
export const createVolumeNamespaceApi = (data: { name: string, user: string, password: string }) => {
  return _fetch<Res< any >>({
    method: 'POST',
    url: `/curvebs?method=namespace.create`,
    data
  })
}
//
//获取卷详情页的信息
export const getVolumeDetailApi = (data: { volumeName: string }) => {
  return _fetch<Res< any >>({
    method: 'POST',
    url: `/curvebs?method=volume.get`,
    data
  })
}

//获取快照列表
export const snapshotManagementApi = (data: { size: number; page: number }) => {
  return _fetch<Res<{ result: boolean }>>({
    method: 'POST',
    url: `/curvebs?method=snapshot.list`,
    data,
  })
}

