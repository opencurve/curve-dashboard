import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'
// /curvebs?method=topo.pool.list
export const getStoragepoolApi = () => {
    return _fetch<Res<{ result: boolean }>>({
      method: 'GET',
      url: `/curvebs?method=topo.pool.list`,
    })
  }


  export const getStoragepoolDetailApi = (data: {id: number}) => {
    return _fetch<Res<{ result: Object }>>({
      method: 'POST',
      url: `/curvebs?method=topo.pool.get`,
      data
    })
  }
