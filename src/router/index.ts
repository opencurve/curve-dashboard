import { CloudServerOutlined } from '@vicons/antd'
import {
  ChannelAlert28Regular,
  ErrorCircleSettings16Regular,
  TextGrammarSettings24Regular,
} from '@vicons/fluent'
import { HardwareChip, Options, PieChart, Server } from '@vicons/ionicons5'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { Permission } from '@/constants/permission'
import Layout from '@/layout/index.vue'
import { renderIcon } from '@/utils'
import NProgress from '@/utils/nProgress'
// 路由跳转请使用 name 字段.
import { getRouteFilterCmp } from '@/utils/router'
import AlertConfig from '@/views/alertPage/alert-config.vue'
import AlertPage from '@/views/alertPage/index.vue'
import SystemLog from '@/views/alertPage/system-log.vue'
import ClusterTopology from '@/views/clusterManagement/ClusterTopology.vue'
import DiskManagement from '@/views/clusterManagement/DiskManagement.vue'
import ServerDetail from '@/views/clusterManagement/ServerDetail.vue'
import ServerManagement from '@/views/clusterManagement/ServerManagement.vue'
import Dashboard from '@/views/dashboard/index.vue'
import Deployment from '@/views/deployment/index.vue'
import SnapshotManagement from '@/views/storageBlock/SnapshotManagement.vue'
import VolumeDetail from '@/views/storageBlock/VolumeDetail.vue'
import VolumeManagement from '@/views/storageBlock/VolumeManagement.vue'
import StoragePool from '@/views/storagePool/index.vue'
import StoragePoolDetail from '@/views/storagePool/StoragePoolDetail.vue'
import AdminEditUser from '@/views/users/admin/AdminEditUser.vue'
import AdminManageUser from '@/views/users/admin/AdminManageUser.vue'
// import ChangePassword from '@/views/users/ChangePassword.vue'
// //详情页
// import MessageDetail from '@/views/users/message/MessageDetail.vue'
// import MessagePage from '@/views/users/message/MessagePage.vue'
import PersonalInfo from '@/views/users/PersonalInfo.vue'
import Login from '@/views/users/UserLogin.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: Layout, // 布局组件作为一级路由
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '集群概览',
          icon: renderIcon(PieChart),
        },
      },
      {
        path: 'cluster-management',
        name: 'ClusterManagement',
        redirect: '/cluster-management/cluster-topology',
        meta: {
          title: '集群管理',
          icon: renderIcon(Server),
        },
        children: [
          {
            path: 'cluster-topology',
            name: 'ClusterTopology',
            component: ClusterTopology,
            meta: {
              title: '集群拓扑',
            },
          },
          {
            path: 'server-management',
            name: 'ServerManagement',
            component: ServerManagement,
            meta: {
              title: '服务器管理',
            },
          },
          {
            path: 'server-detail',
            name: 'ServerDetail',
            component: ServerDetail,
            meta: {
              activeMenu: 'ServerManagement',
              title: '服务器管理',
            },
          },
          {
            path: 'disk-management',
            name: 'DiskManagement',
            component: DiskManagement,
            meta: {
              title: '硬盘管理',
            },
          },
        ],
      },
      {
        path: 'storage-pool',
        name: 'StoragePool',
        component: StoragePool,
        meta: {
          icon: renderIcon(Options),
          title: '存储池管理',
        },
      },
      {
        path: 'storagepool-detail/:id',
        name: 'StoragePoolDetail',
        component: StoragePoolDetail,
        meta: {
          activeMenu: 'StoragePool',
          title: '存储池管理',
        },
      },
      {
        path: 'storage-block',
        name: 'StorageBlock',
        redirect: '/storage-block/volume-management/',
        meta: {
          title: '块存储管理',
          icon: renderIcon(HardwareChip),
        },
        children: [
          {
            path: 'volume-management/:path*',
            name: 'VolumeManagement',
            component: VolumeManagement,
            meta: {
              title: '卷管理',
            },
          },
          {
            path: 'volume-detail/:path*',
            name: 'VolumeDetail',
            component: VolumeDetail,
            meta: {
              title: 'VolumeDetail',
              activeMenu: 'VolumeManagement',
            },
          },
          {
            path: 'snapshot-management',
            name: 'SnapshotManagement',
            component: SnapshotManagement,
            meta: {
              title: '快照管理',
            },
          },
        ],
      },
      {
        path: 'deployment',
        name: 'Deployment',
        component: Deployment,
        meta: {
          title: '集群部署',
          icon: renderIcon(CloudServerOutlined),
          permissions: [Permission.ADMIN],
          // 这里需要权限
        },
      },
      {
        path: 'system-log/',
        name: 'SystemLog',
        component: SystemLog,
        meta: {
          title: '系统操作日志',
          icon: renderIcon(TextGrammarSettings24Regular),
        },
      },
      {
        path: 'alert-page/',
        name: 'AlertPage',
        component: AlertPage,
        meta: {
          title: '监控信息',
          icon: renderIcon(ChannelAlert28Regular),
        },
      },
      {
        path: 'alert-config/',
        name: 'AlertConfig',
        component: AlertConfig,
        meta: {
          title: '告警配置',
          // 这里也需要权限
          icon: renderIcon(ErrorCircleSettings16Regular),
          permissions: [Permission.ADMIN],
        },
      },
      {
        path: '/admin',
        name: 'Admin',
        redirect: '/admin/manage-user',
        meta: {
          hidden: true,
        },
        children: [
          {
            path: 'manage-user',
            name: 'AdminManageUser',
            component: AdminManageUser,
            meta: {
              hidden: true,
              title: 'AdminManageUser',
            },
          },
          {
            path: 'edit-user',
            name: 'AdminEditUser',
            component: AdminEditUser,
            meta: {
              hidden: true,
              title: 'AdminEditUser',
            },
          },
        ],
      },
      {
        path: '/personal-info',
        name: 'PersonalInfo',
        component: PersonalInfo,
        meta: {
          hidden: true,
          title: 'PersonalInfo',
        },
      },
    ],
  },
  // --------------------- 以下为不需要再nav展示的路由 ---------------------

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      hidden: true,
      title: 'Login',
    },
  },

  // {
  //   path: '/change-password',
  //   name: 'ChangePassword',
  //   component: ChangePassword,
  //   meta: {
  //     hidden: true,
  //     title: 'ChangePassword',
  //   },
  // },

  // {
  //   path: '/message-page',
  //   name: 'MessagePage',
  //   component: MessagePage,
  //   meta: {
  //     hidden: true,
  //     title: 'MessagePage',
  //   },
  // },
  // {
  //   path: '/message-detail/:id',
  //   name: 'MessageDetail',
  //   component: MessageDetail,
  //   meta: {
  //     hidden: true,
  //     title: 'MessageDetail',
  //   },
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to, from) => {
//   const userStore = useUserStore()
// })
router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})
export default router
export const filterRoutes = getRouteFilterCmp(routes)
