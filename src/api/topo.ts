import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'

//用户登录api
  export const getTopoListApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=topo.list`,
    })
  }

  