import type {
  StoragePoolDetail,
  StoragePoolDetailParams,
  StoragePoolInfo,
} from '@/model/storagePool'
import type { Res } from '@/utils/_fetch'
import _fetch from '@/utils/_fetch'

export const getStoragePoolApi = () => {
  return _fetch<Res<StoragePoolInfo[]>>({
    method: 'GET',
    url: `/curvebs?method=topo.pool.list`,
  })
}

export const getStoragePoolDetailApi = (data: StoragePoolDetailParams) => {
  return _fetch<Res<StoragePoolDetail>>({
    method: 'POST',
    url: `/curvebs?method=topo.pool.get`,
    data,
  })
}
