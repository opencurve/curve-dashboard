import type { GetHostDetailParams, HostDetail } from '@/model/cluster'
import type { Res } from '@/utils/_fetch'
import _fetch from '@/utils/_fetch'
//用户登录api
export const getServerListApi = (data: { size: number; page: number }) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=host.list`,
    data,
  })
}

export const getServerDetailApi = (data: GetHostDetailParams) => {
  return _fetch<Res<HostDetail>>({
    method: 'POST',
    url: `/curvebs?method=host.get`,
    data,
  })
}
