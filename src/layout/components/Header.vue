<template>
  <div class="m-nav">
    <div class="logo">
      <router-link to="/"
        ><img src="@/assets/pics/curve-logo1-nobg.png" alt=""
      /></router-link>
    </div>

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
    <!-- <div class="messages">
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
    </div> -->
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
import { NDropdown, NIcon, NModal } from 'naive-ui'
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '../../store/user'

//需要使用的参数
const userStore = useUserStore()
const state = userStore.state
const router = useRouter()
const { permission, loggedIn } = toRefs(state)
let logInStatusVal = loggedIn

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
    label: '个人设置',
    key: 'personal-info',
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
  align-items: center;
  column-gap: 16px;
  padding: 0 32px;
  height: 64px;

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
