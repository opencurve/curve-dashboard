<template>
  <div class="m-nav">
    <div class="logo">
      <router-link to="/dashboard"
        ><img src="@/assets/pics/curve-logo1-nobg.png" alt=""
      /></router-link>
    </div>
    <!-- 选择刷新时间 -->
    <div v-if="logInStatusVal" class="time-settings">
      <!-- <n-icon size="25" class="clock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><g fill="none"><path d="M28.832 18.472c.248.18.433.436.528.728c.098.294.1.61.009.906a14.269 14.269 0 0 1-3.156 5.443a1.478 1.478 0 0 1-1.671.347l-1.955-.858a1.501 1.501 0 0 0-.68-.128a1.474 1.474 0 0 0-.66.2a1.472 1.472 0 0 0-.727 1.124l-.235 2.13a1.48 1.48 0 0 1-1.13 1.276c-2.076.495-4.24.495-6.316 0a1.484 1.484 0 0 1-1.125-1.27l-.235-2.126a1.483 1.483 0 0 0-.485-.94a1.5 1.5 0 0 0-1.58-.255l-1.955.859a1.477 1.477 0 0 1-1.668-.343a14.267 14.267 0 0 1-3.16-5.45a1.484 1.484 0 0 1 .536-1.632l1.725-1.275a1.488 1.488 0 0 0 0-2.4l-1.725-1.273a1.48 1.48 0 0 1-.536-1.623A14.249 14.249 0 0 1 5.79 6.467c.14-.151.31-.271.5-.351a1.5 1.5 0 0 1 1.17 0l1.947.858a1.493 1.493 0 0 0 2.073-1.206l.236-2.122a1.482 1.482 0 0 1 1.148-1.281a15.462 15.462 0 0 1 3.146-.362c1.052.012 2.1.133 3.127.362a1.476 1.476 0 0 1 1.147 1.284l.236 2.12a1.483 1.483 0 0 0 2.067 1.2l1.946-.857a1.483 1.483 0 0 1 1.674.346a14.231 14.231 0 0 1 3.157 5.44a1.476 1.476 0 0 1-.537 1.63l-1.72 1.273a1.48 1.48 0 0 0-.004 2.395l1.729 1.276zM16 20a4 4 0 1 0 0-8a4 4 0 0 0 0 8z" fill="currentColor"></path></g></svg>
      </n-icon> -->
      <!-- <n-tooltip trigger="hover" placement="bottom-end">
        <template #trigger>
        <n-icon size="25" class="refresh-icon">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
            <path
              d="M256 48C141.31 48 48 141.32 48 256c0 114.86 93.14 208 208 208c114.69 0 208-93.31 208-208c0-114.87-93.13-208-208-208zm0 313a94 94 0 0 1 0-188h4.21l-14.11-14.1a14 14 0 0 1 19.8-19.8l40 40a14 14 0 0 1 0 19.8l-40 40a14 14 0 0 1-19.8-19.8l18-18c-2.38-.1-5.1-.1-8.1-.1a66 66 0 1 0 66 66a14 14 0 0 1 28 0a94.11 94.11 0 0 1-94 94z"
              fill="currentColor"></path>
          </svg>
        </n-icon>
      </template>
      设置刷新时间:控制图表刷新的时间间隔
      </n-tooltip> -->
      <!-- <n-select size="small" placeholder="图表刷新间隔" :options="timeIntervalOption" v-model:value="timeIntervalVal"
        @update:value="setTimeIntervalVal" /> -->
    </div>
    <n-divider vertical />
    <!-- 帮助 -->
    <n-dropdown trigger="hover" :options="options" @select="handleSelect">
      <div class="title">
        <span>帮助</span
        ><n-icon class="arrow" size="15"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5l5-5z" fill="currentColor"></path>
          </svg>
        </n-icon>
      </div>
    </n-dropdown>
    <!-- 语言切换 -->
    <div class="title">
      <span>中文</span
      ><n-icon class="arrow" size="15"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5l5-5z" fill="currentColor"></path>
        </svg>
      </n-icon>
    </div>
    <!-- 消息 -->
    <div class="messages">
      <div
        @click="
          () => {
            router.push({ path: '/message-page' })
          }
        "
      >
        <n-icon class="bell" size="18">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 448 512"
          >
            <path
              d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29c0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29c-6 6.45-8.66 14.16-8.61 21.71c.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32c.05-7.55-2.61-15.27-8.61-21.71z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="m-info">
      <n-dropdown
        v-if="logInStatusVal"
        trigger="hover"
        :options="permission === 7 ? adminOptions : userOptions"
        @select="handleSelect"
      >
        <n-icon size="18" :component="Person" />
      </n-dropdown>
      <span v-else>
        <router-link to="/login">登录</router-link>
      </span>
    </div>
    <n-modal
      v-model:show="showModal"
      class="custom-card"
      :width="600"
      :height="300"
      title="公众号二维码"
    >
      <div class="qr-code-container">
        <img
          class="qr-code-image"
          src="@/assets/pics/curveWechat.jpeg"
          alt="qrCode"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { Person } from '@vicons/ionicons5/'
import { NDivider, NDropdown, NIcon, NModal } from 'naive-ui'
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

//为存在图表数据的store里的state设置时间间隔
import { useDashboardStore } from '@/store/clusterOverview/dashboard'

import { useUserStore } from '../../store/user'

//需要使用的参数
const userStore = useUserStore()
const state = userStore.state
const router = useRouter()
const { permission, loggedIn } = toRefs(state)
let logInStatusVal = loggedIn

const dashboardStore = useDashboardStore()
const { setTimeIntervalValInStore } = dashboardStore

//用户退出登录
const handleLogout = () => {
  userStore.handleLogout()
}

//用户下拉框的选择
const handleSelect = (key: string | number) => {
  if (key === 'log-out') {
    handleLogout()
  }
  if (key === 'user-list') {
    router.push('/admin/manage-user')
  }
  if (key === 'personal-info') {
    router.push('/personal-info')
  }
  if (key === 'code-repo') {
    window.open('https://github.com/opencurve/curve')
  }
  if (key === 'official-website') {
    window.open('https://opencurve.io/Curve/HOME')
  }
  if (key === 'forum') {
    window.open('https://ask.opencurve.io/')
  }
  if (key === 'media-platform') {
    showQRcode()
  }
}

const timeIntervalOption = ref([
  {
    label: '关闭',
    value: 0,
  },
  {
    label: '10s',
    value: 10,
  },
  {
    label: '20s',
    value: 20,
  },
  {
    label: '40s',
    value: 50,
  },
  {
    label: '1分钟',
    value: 60,
  },
  {
    label: '3分钟',
    value: 180,
  },
  {
    label: '10分钟',
    value: 600,
  },
])
const timeIntervalVal = ref(0)

const setTimeIntervalVal = () => {
  setTimeIntervalValInStore(timeIntervalVal.value)
}

const showModal = ref(false)

//展示公众号二维码
const showQRcode = () => {
  showModal.value = true
}

//用户可见的选项
const userOptions = [
  {
    label: '个人设置',
    key: 'personal-info',
  },
  {
    label: '退出登录',
    key: 'log-out',
    props: {
      color: 'red',
    },
  },
]

//管理员可见的选项
const adminOptions = [
  {
    label: '用户列表',
    key: 'user-list',
  },
  {
    label: '退出登录',
    key: 'log-out',
    props: {
      style: "color='red'",
    },
  },
]

//帮助中心的选项
const options = ref([
  {
    label: '代码仓库',
    key: 'code-repo',
  },
  {
    label: '前往官网',
    key: 'official-website',
  },
  {
    label: '前往论坛',
    key: 'forum',
  },
  {
    label: '公众号',
    key: 'media-platform',
  },
])
</script>

<style scoped lang="scss">
h1 {
  font-size: 25px;
}

.m-nav {
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e5e6eb;
  align-items: center;
  column-gap: 16px;
  padding: 0 32px;

  .logo {
    flex-grow: 1;
    display: flex;

    img {
      height: 36px;
      display: block;
    }
  }

  a {
    text-decoration: none;
  }

  .router-link-active {
    text-decoration: none;
  }

  .time-settings {
    display: flex;
    justify-content: space-between;
    flex: -1;
  }

  .refresh-icon {
    align-self: center;
    padding-right: 2px;
  }

  .clock-icon {
    align-self: center;
    margin-right: 45px;
  }

  /*帮助*/
  .help {
    cursor: pointer;
  }

  .messages > div {
    padding: 6px;
    display: flex;
    border-radius: 6px;

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }

  /*后台管理*/
  .admin {
    cursor: pointer;
  }

  .help {
    .title {
      font-size: 12px;
      line-height: 1;
      color: #757575;
      height: 64px;
      padding: 26px 0;
    }

    .bell {
      color: #234e63;
    }

    .arrow {
      color: #90a4ae;
    }
  }

  /*用户头像*/
  .m-info {
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 100%;
    // border-left: 1px solid #e5e6eb;
    // padding: 0px 25px;
    // line-height: 64px;
    padding: 6px;
    border-radius: 6px;

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }

  /* 用户名 */
  .u-nav_user_name {
    width: 53px;
    height: 64px;
    margin-left: 15px;

    .avatar {
      position: relative;
      top: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .arrow {
      color: #90a4ae;
      margin-left: 5px;
    }
  }

  .qr-code-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
  }

  .qr-code-image {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
