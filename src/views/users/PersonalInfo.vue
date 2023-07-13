<template>
  <n-list bordered>
    <template #header> 个人信息 </template>

    <n-list-item>
      <n-thing title="用户名">
        {{ state.name }}
      </n-thing>
    </n-list-item>

    <n-list-item>
      <template #suffix>
        <n-button @click="showEmailChangeModal">修改邮箱</n-button>
      </template>
      <n-thing title="我的邮箱">
        {{ state.email }}
      </n-thing>
    </n-list-item>

    <n-list-item>
      <n-thing title="我的密码"> ********** </n-thing>
      <template #suffix>
        <n-button @click="showPasswordChangeModal">修改密码</n-button>
      </template>
    </n-list-item>
  </n-list>
  <n-modal v-model:show="showChangeEmail" title="修改账号">
    <n-card present="card" title="修改账号">
      <ChangeEmail />
    </n-card>
  </n-modal>
  <n-modal v-model:show="showChangePassword" title="修改密码">
    <n-card present="card" title="重置密码">
      <ChangePassword />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { NCard, NList, NModal } from 'naive-ui'
import { ref } from 'vue'

import { useUserStore } from '../../store/user'
import ChangeEmail from './ChangeEmail.vue'
import ChangePassword from './ChangePassword.vue'

const { state } = useUserStore()
const showChangePassword = ref(false)
const showChangeEmail = ref(false)

const showEmailChangeModal = () => {
  showChangeEmail.value = true
}

const showPasswordChangeModal = () => {
  showChangePassword.value = true
}
</script>

<style lang="scss" scoped>
.n-card {
  max-width: 300px;
}
</style>
