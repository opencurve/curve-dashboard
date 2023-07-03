<template>
  <n-modal v-model:show="val" preset="dialog" title="Dialog">
    <template #header>
      <div>忘记密码</div>
    </template>
    <div>
      请输入您的用户名，稍后您将收到一封重置密码的邮件，按邮件提示操作即可重置密码
    </div>
    <div>
      <n-input placeholder="请输入账号" v-model:value="accountName"></n-input>
    </div>
    <template #action>
      <div>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
        <n-button @Click="handleResetPassword" type="primary"
          >重置密码</n-button
        >
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { useMessage } from 'naive-ui';
import { ref } from 'vue'

const userStore = useUserStore()
const { resetPassword } = userStore
const accountName = ref('')
const message = useMessage()

let val = ref(false)

const cancel = () => {
  val.value = false
}

const handleResetPassword = () => {
  if(accountName.value.trim() === "") {
    message.error('请输入用户名进行重置密码')
    return
  }
  const params = { userName: accountName.value }
  resetPassword(params).then(res => {
    if (res.status === 200) {
      val.value = false;
      message.success('重置密码成功，请查收邮件')
    } else {
      message.error('用户名不存在！')
    }
  })
}

const showModal = () => {
  val.value = true
}

defineExpose({ showModal })
</script>
