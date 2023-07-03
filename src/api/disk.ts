import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'

//用户登录api
  export const getDiskListApi = (data: {size: number, page: number, hostName: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=disk.list`,
        data,
    })
  }
