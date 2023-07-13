import type { RouteRecordRaw } from 'vue-router'

import type { Fn, Recordable } from '#/index'

export const getIsLeaf = (data: Recordable[]) =>
  !data.some(
    (item = {} as Recordable) => item?.meta.title && !item?.meta.activeMenu,
  )

// -------------------------
// 过滤component字段 和 hidden为true的路由
const filterFn = (route: RouteRecordRaw): RouteRecordRaw => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { component, children = [], ...rest } = route
  return { ...rest, children: getRouteFilterCmp(children) }
}

export const getRouteFilterCmp = (routes: RouteRecordRaw[]) =>
  routes.map(item => filterFn(item))
