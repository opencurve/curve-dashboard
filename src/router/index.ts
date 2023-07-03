import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'
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
import ChangePassword from '@/views/users/ChangePassword.vue'
//详情页
import MessageDetail from '@/views/users/message/MessageDetail.vue'
import MessagePage from '@/views/users/message/MessagePage.vue'
import PersonalInfo from '@/views/users/PersonalInfo.vue'
import Login from '@/views/users/UserLogin.vue'

const routes = [
  {
    path: '/',
    component: Layout, // 布局组件作为一级路由
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
        },
      },
      //集群管理下的页面
      {
        path: 'cluster-topology',
        name: 'ClusterTopology',
        component: ClusterTopology,
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
        },
      },
      {
        path: 'server-management',
        name: 'ServerManagement',
        component: ServerManagement,
      },
      {
        path: 'disk-management',
        name: 'DiskManagement',
        component: DiskManagement,
      },
      {
        path: 'storage-pool',
        name: 'StoragePool',
        component: StoragePool,
      },
      //存储块管理下的页面
      {
        path: 'volume-management',
        name: 'VolumeManagement',
        redirect: '/volume-management/',
        children: [
          {
            path: ':path*',
            name: 'pathVolumeManagement',
            component: VolumeManagement,
          },
        ],
      },
      {
        path: 'snapshot-management',
        name: 'SnapshotManagement',
        component: SnapshotManagement,
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePassword,
      },
      {
        path: 'personal-info',
        name: 'PersonalInfo',
        component: PersonalInfo,
      },
      {
        path: 'message-page',
        name: 'MessagePage',
        component: MessagePage,
      },
      //详情页
      {
        path: 'message-detail/:id',
        name: 'MessageDetail',
        component: MessageDetail,
      },
      {
        path: 'storagepool-detail/:id',
        name: 'StoragePoolDetail',
        component: StoragePoolDetail,
      },
      {
        path: 'volume-detail',
        name: 'VolumeDetail',
        children: [
          {
            path: '/:path*',
            name: 'pathVolumeDetail',
            component: VolumeDetail,
          },
        ],
      },
      {
        path: 'server-detail/',
        query: { q: 'keyword' },
        name: 'ServerDetail',
        component: ServerDetail,
      },
      {
        path: 'alert-page/',
        name: 'AlertPage',
        component: AlertPage,
      },
      {
        path: 'alert-config/',
        name: 'AlertConfig',
        component: AlertConfig,
      },
      {
        path: 'system-log/',
        name: 'SystemLog',
        component: SystemLog,
      },
      {
        path: 'deployment',
        name: 'Deployment',
        component: Deployment,
      },
    ],
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    children: [
      {
        path: 'manage-user',
        name: 'AdminManageUser',
        component: AdminManageUser,
      },
      {
        path: 'edit-user',
        name: 'AdminEditUser',
        component: AdminEditUser,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to, from) => {
//   const userStore = useUserStore()
// })

export default router
