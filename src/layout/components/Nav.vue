<template>
  <div class="m-side-bar" ref="side">
    <div class="topBox"
      style="display: flex; align-items: center; justify-content: flex-end; -webkit-margin-bottom-collapse: collapse;">
      <n-icon position="fixed" class="collapseIcon" :class="{ rotate: isRotated }" ref="icon" size="30px"
        @click="ToggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
          <path
            d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 0 0 0 13.8z"
            fill="currentColor"></path>
        </svg>
      </n-icon>
    </div>
    <div class="menu-wrap">
      <n-menu v-if="is_expanded" :options="menuOptions" />
      <n-menu v-else :options="menuOptionsUncollapsed" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { h, ref, watch } from 'vue'
import { NIcon, NMenu, NDropdown, tooltipDark } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { Component } from "vue";
import eventBus from "@/store/eventBus"
import {
  PieChart,
  Server,
  Options,
  HardwareChip,
  SparklesOutline,
  Link,
} from '@vicons/ionicons5'
import { useUserStore } from '../../store/user'
import { useAlertStore } from '../../store/alertPage/alertMessage'

const userStore = useUserStore()
const alertStore = useAlertStore()
const { getUserInfo } = userStore;
const { getUnreadAlertMessage } = alertStore;
const permissionStatus = ref(1);

getUserInfo().then(res => {
  permissionStatus.value = res.data.data.permission
});

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const side = ref(null);
const isRotated = ref(false);
const is_expanded = ref(true);
const unreadAlertMessage = ref(0);

const updateUnreadAlertMessage = () => {
  getUnreadAlertMessage().then(res => {
    unreadAlertMessage.value = res.data.data
  })
}

updateUnreadAlertMessage();

setInterval(updateUnreadAlertMessage, 30000);

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  // localStorage.setItem("is_expanded", is_expanded.value);
  if (!is_expanded.value) { side.value.style.width = "6vw"; }
  else {
    side.value.style.width = "16vw";
  }
  isRotated.value = !isRotated.value
}
const alertPageIcon = () => {
  return (
    <n-icon size='18'>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor"></path></svg>
    </n-icon>
  )
}

//展开时的菜单
const menuOptions: MenuOption[] = ref([
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Dashboard',
          },
        },
        { default: () => is_expanded.value ? '集群概览' : '' },
      ),
    key: 'Dashboard',
    icon: renderIcon(PieChart),
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: "集群管理",
    key: 'cluster',
    icon: renderIcon(Server),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'ClusterTopology',
              },
            },
            { default: () => '集群拓扑' },
          ),
        key: 'ClusterTopology',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'ServerManagement',
              },
            },
            { default: () => '服务器管理' },
          ),
        key: 'ServerManagement',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'DiskManagement',
              },
            },
            { default: () => '硬盘管理' },
          ),
        key: 'DiskManagement',
      },
    ],
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'StoragePool',
          },
        },
        { default: () => '存储池管理' },
      ),
    key: 'StoragePool',
    icon: renderIcon(Options),
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: '块存储管理',
    key: 'BlockStorage',
    icon: renderIcon(HardwareChip),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'VolumeManagement',
              },
            },
            { default: () => '卷管理' },
          ),
        key: 'volumeManagement',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'SnapshotManagement',
              },
            },
            { default: () => '快照管理' },
          ),
        key: 'SnapshotManagement',
      },
    ],
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Deployment',
          },
        },
        { default: () => '集群部署' },
      ),
    key: 'Deployment',
    icon: () => {
      return (
        <n-icon size='18' >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M704 446H320c-4.4 0-8 3.6-8 8v402c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8V454c0-4.4-3.6-8-8-8zm-328 64h272v117H376V510zm272 290H376V683h272v117z" fill="currentColor"></path><path d="M424 748a32 32 0 1 0 64 0a32 32 0 1 0-64 0zm0-178a32 32 0 1 0 64 0a32 32 0 1 0-64 0z" fill="currentColor"></path><path d="M811.4 368.9C765.6 248 648.9 162 512.2 162S258.8 247.9 213 368.8C126.9 391.5 63.5 470.2 64 563.6C64.6 668 145.6 752.9 247.6 762c4.7.4 8.7-3.3 8.7-8v-60.4c0-4-3-7.4-7-7.9c-27-3.4-52.5-15.2-72.1-34.5c-24-23.5-37.2-55.1-37.2-88.6c0-28 9.1-54.4 26.2-76.4c16.7-21.4 40.2-36.9 66.1-43.7l37.9-10l13.9-36.7c8.6-22.8 20.6-44.2 35.7-63.5c14.9-19.2 32.6-36 52.4-50c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.3c19.9 14 37.5 30.8 52.4 50c15.1 19.3 27.1 40.7 35.7 63.5l13.8 36.6l37.8 10c54.2 14.4 92.1 63.7 92.1 120c0 33.6-13.2 65.1-37.2 88.6c-19.5 19.2-44.9 31.1-71.9 34.5c-4 .5-6.9 3.9-6.9 7.9V754c0 4.7 4.1 8.4 8.8 8c101.7-9.2 182.5-94 183.2-198.2c.6-93.4-62.7-172.1-148.6-194.9z" fill="currentColor"></path></svg>
        </n-icon>
      )
    },
  },
  {
    label: () => {
      return (
        <div>
          <RouterLink to='/alert-page'>监控信息</RouterLink>
          {

            unreadAlertMessage.value === 0 ? null
              :
              <span style={{
                display: 'inline-block',
                width: '23px',
                height: '23px',
                borderRadius: '50%',
                backgroundColor: 'red',
                textAlign: 'center',
                lineHeight: '23px',
                color: 'white',
                fontSize: '9px',
              }}>{unreadAlertMessage.value <= 99 ? unreadAlertMessage.value: '99+'}</span>
          }
        </div>
      )
    },
    key: 'AlergPage',
    icon: alertPageIcon,
  },
])


//缩回时的菜单
const menuOptionsUncollapsed: MenuOption[] = ref([
  {
    label: () => {
      return (
        <n-tooltip trigger="hover" placement="right">
          {{
            trigger: () => <router-link to={{ name: "Dashboard" }}></router-link>,
            default: () => '集群概览'
          }}
        </n-tooltip>
      )
    },
    key: 'dashboard',
    icon: renderIcon(PieChart),
  },
  {
    // label:"集群管理",
    label: () => {
      const options = [
        {
          label: () => {
            return (
              <router-link to={{ name: 'ClusterTopology' }}>
                集群拓扑
              </router-link>
            )
          }
        },
        {
          label: () => {
            return (
              <router-link to={{ name: 'ServerManagement' }}>
                服务器管理
              </router-link>
            )
          }
        },
        {
          label: () => {
            return (
              <router-link to={{ name: 'DiskManagement' }}>
                硬盘管理
              </router-link>
            )
          }
        }
      ]

      return (
        <n-dropdown trigger="hover" placement="right" options={options}>
          <n-icon size="19">
            <Server />
          </n-icon>
        </n-dropdown>
      )
    },
    key: 'cluster',
  },
  {
    label: () => {
      return (
        <n-tooltip trigger="hover" placement="right">
          {{
            trigger: () => <router-link to={{ name: "StoragePool" }}></router-link>,
            default: () => '存储池管理'
          }}
        </n-tooltip>
      )
    },
    key: 'storage-pool',
    icon: renderIcon(Options),
  },
  {
    label: () => {
      const options = [
        {
          label: () => {
            return (
              <router-link to={{ name: 'VolumeManagement' }}>
                卷管理
              </router-link>
            )
          }
        },
        {
          label: () => {
            return (
              <router-link to={{ name: 'SnapshotManagement' }}>
                快照管理
              </router-link>
            )
          }
        }
      ]
      return (
        <n-dropdown trigger="hover" placement="right" options={options}>
          <n-icon size="19">
            <HardwareChip />
          </n-icon>
        </n-dropdown>
      )
    },
    key: 'block-storage',
  },
  {
    key: 'Deployment',
    label: () => {
      return (
        <router-link to={{ name: "Deployment" }}>
          <n-icon size='19' >
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M704 446H320c-4.4 0-8 3.6-8 8v402c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8V454c0-4.4-3.6-8-8-8zm-328 64h272v117H376V510zm272 290H376V683h272v117z" fill="currentColor"></path><path d="M424 748a32 32 0 1 0 64 0a32 32 0 1 0-64 0zm0-178a32 32 0 1 0 64 0a32 32 0 1 0-64 0z" fill="currentColor"></path><path d="M811.4 368.9C765.6 248 648.9 162 512.2 162S258.8 247.9 213 368.8C126.9 391.5 63.5 470.2 64 563.6C64.6 668 145.6 752.9 247.6 762c4.7.4 8.7-3.3 8.7-8v-60.4c0-4-3-7.4-7-7.9c-27-3.4-52.5-15.2-72.1-34.5c-24-23.5-37.2-55.1-37.2-88.6c0-28 9.1-54.4 26.2-76.4c16.7-21.4 40.2-36.9 66.1-43.7l37.9-10l13.9-36.7c8.6-22.8 20.6-44.2 35.7-63.5c14.9-19.2 32.6-36 52.4-50c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.3c19.9 14 37.5 30.8 52.4 50c15.1 19.3 27.1 40.7 35.7 63.5l13.8 36.6l37.8 10c54.2 14.4 92.1 63.7 92.1 120c0 33.6-13.2 65.1-37.2 88.6c-19.5 19.2-44.9 31.1-71.9 34.5c-4 .5-6.9 3.9-6.9 7.9V754c0 4.7 4.1 8.4 8.8 8c101.7-9.2 182.5-94 183.2-198.2c.6-93.4-62.7-172.1-148.6-194.9z" fill="currentColor"></path></svg>
          </n-icon>
        </router-link>
      )
    },
  },
  {
    key: 'alert-message',
    label: () => {
      return (
        <n-tooltip trigger="hover" placement="right">
          {{
            trigger: () => <router-link to="/alert-page"></router-link>,
            default: () => '监控信息'
          }}
        </n-tooltip>
      )
    },
    icon: alertPageIcon,
  }
])

watch(permissionStatus, (newVal) => {


  menuOptions.value.splice(-1, 0,
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'SystemLog',
            },
          },
          { default: () => '系统操作日志' },
        ),
      key: 'SystemLog',
      icon: () => {
        return (
          <n-icon size='18'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 3a9 9 0 1 1-8.963 8.183a1 1 0 1 1 1.992.18A6.962 6.962 0 0 0 7.05 16.95c.375.375.792.707 1.242.988A7 7 0 1 0 7.098 7.002l1.4.001a1 1 0 0 1 .116 1.994l-.116.006H4.496a1 1 0 0 1-.993-.883l-.007-.117v-4a1 1 0 0 1 1.994-.116l.006.117v1.774A8.983 8.983 0 0 1 12 3zm-.75 4a.75.75 0 0 1 .743.648L12 7.75V12h2.25a.75.75 0 0 1 .102 1.493l-.102.007h-3a.75.75 0 0 1-.743-.648l-.007-.102v-5a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>        </n-icon>
        )
      },
    }
  )

  menuOptionsUncollapsed.value.splice(-1, 0,
    {
      label: () =>
      {
      return (
        <n-tooltip trigger="hover" placement="right">
          {{
            trigger: () => <router-link to={{name: "SystemLog"}}></router-link>,
            default: () => '系统操作日志'
          }}
        </n-tooltip>
      )
    },
      key: 'SystemLog',
      icon: () => {
        return (
          <n-icon size='18'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 3a9 9 0 1 1-8.963 8.183a1 1 0 1 1 1.992.18A6.962 6.962 0 0 0 7.05 16.95c.375.375.792.707 1.242.988A7 7 0 1 0 7.098 7.002l1.4.001a1 1 0 0 1 .116 1.994l-.116.006H4.496a1 1 0 0 1-.993-.883l-.007-.117v-4a1 1 0 0 1 1.994-.116l.006.117v1.774A8.983 8.983 0 0 1 12 3zm-.75 4a.75.75 0 0 1 .743.648L12 7.75V12h2.25a.75.75 0 0 1 .102 1.493l-.102.007h-3a.75.75 0 0 1-.743-.648l-.007-.102v-5a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>        </n-icon>
        )
      },
    }
  )




  if (newVal === 7) {
    menuOptions.value.push({
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'AlertConfig',
            },
          },
          { default: () => '告警配置' },
        ),
      key: 'AlertConfig',
      icon: () => {
        return (
          <n-icon size='18'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M20 12V2h2v10z" fill="currentColor"></path><path d="M24 12V2h2v10z" fill="currentColor"></path><path d="M28 12V2h2v10z" fill="currentColor"></path><path d="M16 20a3.912 3.912 0 0 1-4-4a3.912 3.912 0 0 1 4-4v-2a6 6 0 1 0 6 6h-2a3.912 3.912 0 0 1-4 4z" fill="currentColor"></path><path d="M28.893 18.454L26.098 16l-1.318 1.504l2.792 2.452l-2.36 4.088l-3.427-1.16a9.031 9.031 0 0 1-2.714 1.565L18.36 28h-4.72l-.71-3.55a9.095 9.095 0 0 1-2.695-1.572l-3.447 1.166l-2.36-4.088l2.725-2.395a8.926 8.926 0 0 1-.007-3.128l-2.718-2.39l2.36-4.087l3.427 1.16A9.03 9.03 0 0 1 12.93 7.55L13.64 4H16V2h-2.36a2 2 0 0 0-1.961 1.608l-.504 2.518a10.967 10.967 0 0 0-1.327.754l-2.42-.819a1.998 1.998 0 0 0-2.372.895l-2.36 4.088a2 2 0 0 0 .411 2.502l1.931 1.697C5.021 15.495 5 15.745 5 16c0 .258.01.513.028.766l-1.92 1.688a2 2 0 0 0-.413 2.502l2.36 4.088a1.998 1.998 0 0 0 2.374.895l2.434-.824a10.974 10.974 0 0 0 1.312.759l.503 2.518A2 2 0 0 0 13.64 30h4.72a2 2 0 0 0 1.961-1.608l.504-2.519a10.967 10.967 0 0 0 1.327-.753l2.419.818a1.998 1.998 0 0 0 2.373-.894l2.36-4.088a2 2 0 0 0-.411-2.502z" fill="currentColor"></path></svg>
          </n-icon>
        )
      },
    })

    menuOptionsUncollapsed.value.push({
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'AlertConfig',
            },
          },
        ),
      key: 'AlertConfig',
      icon: () => {
        return (
          <n-icon size='18'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M20 12V2h2v10z" fill="currentColor"></path><path d="M24 12V2h2v10z" fill="currentColor"></path><path d="M28 12V2h2v10z" fill="currentColor"></path><path d="M16 20a3.912 3.912 0 0 1-4-4a3.912 3.912 0 0 1 4-4v-2a6 6 0 1 0 6 6h-2a3.912 3.912 0 0 1-4 4z" fill="currentColor"></path><path d="M28.893 18.454L26.098 16l-1.318 1.504l2.792 2.452l-2.36 4.088l-3.427-1.16a9.031 9.031 0 0 1-2.714 1.565L18.36 28h-4.72l-.71-3.55a9.095 9.095 0 0 1-2.695-1.572l-3.447 1.166l-2.36-4.088l2.725-2.395a8.926 8.926 0 0 1-.007-3.128l-2.718-2.39l2.36-4.087l3.427 1.16A9.03 9.03 0 0 1 12.93 7.55L13.64 4H16V2h-2.36a2 2 0 0 0-1.961 1.608l-.504 2.518a10.967 10.967 0 0 0-1.327.754l-2.42-.819a1.998 1.998 0 0 0-2.372.895l-2.36 4.088a2 2 0 0 0 .411 2.502l1.931 1.697C5.021 15.495 5 15.745 5 16c0 .258.01.513.028.766l-1.92 1.688a2 2 0 0 0-.413 2.502l2.36 4.088a1.998 1.998 0 0 0 2.374.895l2.434-.824a10.974 10.974 0 0 0 1.312.759l.503 2.518A2 2 0 0 0 13.64 30h4.72a2 2 0 0 0 1.961-1.608l.504-2.519a10.967 10.967 0 0 0 1.327-.753l2.419.818a1.998 1.998 0 0 0 2.373-.894l2.36-4.088a2 2 0 0 0-.411-2.502z" fill="currentColor"></path></svg>
          </n-icon>
        )
      },
    })


  }
})

watch(() => eventBus.message, (newVal) => {
  if (newVal === 'alertReadUpdated') {
    updateUnreadAlertMessage();
  }
})

</script>

<style scoped lang="scss">
.nav {
  width: 200px;
  background-color: white;
  border-right: 2px solid whitesmoke;
  border-top: 2px solid whitesmoke;
}

// .collapseIcon {
//   margin-right: 15px;
//   margin-top: 10px;
//   transition: transform 0.5s ease-in-out;
// }

.side-bar-bottom {
  flex: 0 0 100px;
  display: flex;
  flex-direction: column-reverse;
}

.m-side-bar {
  background: #fefefe;
  border-right: 1px solid #e5e6eb;
  display: flex;
  flex-direction: column;
  border-right: 2px solid whitesmoke;
  border-top: 2px solid whitesmoke;
  border-radius: 2%;
  width: 200px;

  position: relative;
  width: 16vw;
  height: 100%;
  font-family: "Poppins", sans-serif;
  transition: all 0.5s ease;

  .topBox {
    width: 100%;
    height: 10%;
    background: #fefefe;
    display: flex;
    align-items: center;
    justify-content: space-around;

    span {
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      transition: all 0.5s ease;
      white-space: nowrap;
      overflow: hidden;
    }

    .collapseIcon {
      cursor: pointer;
      color: #000;
      font-size: 28px;
      min-width: 50px;
      transition: transform 0.2s ease-in-out;

      &.rotate {
        transform: rotateY(180deg);
        /* 旋转180度 */
      }
    }
  }

  .menu-wrap {
    margin-top: 35px;
    flex: 1 1 auto;
    width: 100%;
    transition: all 0.5s ease;
  }
}

.menu-addition {
  height: 50px;
  line-height: 50px;
  width: 100%;
  padding: 0 30px;
  position: relative;
  color: rgba(0, 0, 0, 0.54);

  &:after {
    content: '';
    display: block;
    width: 160px;
    height: 1px;
    background: #dddee1;
    position: absolute;
    top: 0;
    left: 20px;
  }

  .menu-item_icon {
    font-size: 14px;
    display: inline-block;
    margin-right: 10px;
  }

  .menu-item_txt {
    display: inline-block;
    font-size: 14px;
  }

  .circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: red;
    text-align: center;
    line-height: 30px;
    color: white;
    font-size: 16px;
  }
}
</style>
