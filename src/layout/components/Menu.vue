<template>
  <NMenu
    v-model:value="state.selectedKey"
    :options="state.options"
    :collapsed-width="SiderEnum.MENU_COLLAPSED_WIDTH"
    :indent="SiderEnum.MENU_INDENT"
  />
</template>

<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { NBadge, NMenu, NSpace } from 'naive-ui'
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink, useRoute } from 'vue-router'

import type { Recordable } from '/#/index'
import { SiderEnum } from '@/layout/constants'
import { filterRoutes } from '@/router'
import { useAlertStore } from '@/store/alertPage/alertMessage'
import { useUserStore } from '@/store/user'
import { getIsLeaf } from '@/utils/router'

// menu组件内部通过provider和inject的模式，已经拿到了layoutSider内的collapsed值，所以如果不是想主动控制这个属性，就不用传这个props了
const { getUnreadAlertMessage, state: alertState } = useAlertStore()
const { hasPermission, state: userState } = useUserStore()
const state = reactive({
  selectedKey: '',
  options: [] as RouteRecordRaw[],
})

const currentRoute = useRoute()
let timer: NodeJS.Timer

const updateMenu = () => {
  const activeMenu: string = currentRoute.meta?.activeMenu || ''
  state.selectedKey = activeMenu || (currentRoute.name as string)
}

const renderTitle = (name: string, title: string) => {
  if (name !== 'AlertPage') return title
  return (
    <NSpace>
      {title}
      <NBadge value={alertState.count} max={99} />
    </NSpace>
  )
}

const mapEach = (route: RouteRecordRaw): any => {
  const {
    name,
    children = [],
    meta: { title, activeMenu, icon, permissions = [], hidden = false } = {},
  } = route
  if (hidden) return null // 过滤不用再menu中显示的路由
  if (permissions.length && !hasPermission(permissions)) return null // 过滤没有权限的路由
  if (title && !activeMenu) {
    const isLeaf = children && getIsLeaf(children)
    // 特殊处理告警配置
    const labelTitle = renderTitle(name as string, title)
    const to: RouteLocationRaw = {
      name,
    }
    // 特殊处理卷管理
    if (name === 'VolumeManagement') to.params = { path: '' }
    const item: Recordable = {
      key: name as string,
      label: () =>
        children?.length && !isLeaf ? (
          labelTitle
        ) : (
          <RouterLink to={to}>{labelTitle}</RouterLink>
        ),
      icon,
    }
    // menu的叶子节点在router上很可能不准确，要手动覆盖children处理下
    if (isLeaf) {
      item.children = undefined
      return item
    } else {
      return {
        ...item,
        children: gMenu(children),
      }
    }
  }
  return null as any as MenuOption
}

const gMenu = (routes: RouteRecordRaw[]) =>
  routes.map(item => mapEach(item)).filter(item => item)

watch(
  () => currentRoute.fullPath,
  updateMenu,
  { immediate: true }, // 第一次进入项目时要执行选中一下
)
watch(
  [() => userState.permission, () => alertState.count],
  () => {
    state.options = gMenu(filterRoutes[0].children!)
  },
  { immediate: true }, // 第一次进入项目时要执行选中一下
)
onMounted(() => {
  getUnreadAlertMessage()
  timer = setInterval(getUnreadAlertMessage, 30000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
