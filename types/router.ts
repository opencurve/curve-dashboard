import 'vue-router'

import type { VNodeChild } from 'vue'

declare module 'vue-router' {
  // RouteMeta只能确保这里已经写入的类型的正确性，同时，它支持写入其他未定义的类型，并且不会验证类型。
  interface RouteMeta {
    title?: string // 目前menu列表，页面title，面包屑名称 都用这个字段
    hidden?: boolean // 是否在menu中隐藏

    // 当前路由对应的激活menu，不配置，默认指向当前路由的name，有些路由不用展示在左侧，例如各种详情，但是左侧要匹配一个高亮。
    // 有该值，就不再使用title在menu中显示了。
    activeMenu?: string

    icon?: () => VNodeChild // menu图标
    keepAlive?: string // 缓存该路由
    permissions?: (string | number)[] // 路由需要验证的权限列表
  }
}
