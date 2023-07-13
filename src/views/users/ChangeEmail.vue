<template>
  <div class="login">
    <n-form ref="formRef" :rules="rules" :model="model">
      <n-form-item path="oldAccount" label="当前邮箱">
        <!-- <n-input
          v-model:value="model.oldAccount"
          placeholder="请输入当前使用的邮箱"
          type="text"
          label="当前邮箱"
          @keydown.enter.prevent
        /> -->
        {{ userStore.state.email }}
      </n-form-item>
      <n-form-item path="newAccount" label="新邮箱">
        <n-input
          v-model:value="model.newAccount"
          type="text"
          placeholder="请输入新邮箱"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        ref="reEnterPasswordFormItemRef"
        first
        path="reEnteredAccount"
        label="确认新邮箱"
      >
        <n-input
          v-model:value="model.reEnteredAccount"
          type="password"
          placeholder="请再次输入新邮箱"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="confirmChangeAccount">
              确认更改
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </div>
  <!-- </n-card> -->
</template>

<script setup lang="ts">
import md5 from 'js-md5'
import type { FormRules } from 'naive-ui'
import {
  type FormItemRule,
  NButton,
  NCard,
  NCol,
  NForm,
  NFormItem,
  NInput,
  NRow,
  useMessage,
} from 'naive-ui'
import { ref } from 'vue'

import router from '@/router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userName = userStore.state.name

const checkPasswordFormat = (rule: FormItemRule, value: string) => {
  let checkFormat = /.*[A-Z@#$%^&+=!*()_?].*/
  let checkLength = /^.{6,64}$/
  return checkFormat.test(value) && checkLength.test(value)
}

interface ModelType {
  oldAccount: string | null
  newAccount: string | null
  reEnteredAccount: string | null
}
const model = ref<ModelType>({
  oldAccount: userStore.state.email,
  newAccount: '',
  reEnteredAccount: '',
})
const message = useMessage()

const validateAccountSame = (rule: FormItemRule, value: string): boolean => {
  return value === model.value.newAccount
}
//校验规则函数
const checkEmailFormat = (rule: FormItemRule, value: string): boolean => {
  let check = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  return check.test(value)
}
const rules: FormRules = {
  oldAccount: [
    {
      validator: checkEmailFormat,
      message: '请输入正确邮箱格式',
      trigger: ['input', 'blur'],
    },
  ],
  newAccount: [
    {
      validator: checkEmailFormat,
      message: '请输入正确邮箱格式',
      trigger: ['input', 'blur'],
    },
  ],
  reEnteredAccount: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validateAccountSame,
      message: '两次输入的密码不一致',
      trigger: ['blur'],
    },
  ],
}

const confirmChangeAccount = () => {
  if (
    model.value.newAccount === null ||
    model.value.oldAccount === null ||
    model.value.reEnteredAccount === null
  ) {
    message.error('请填写必要的信息')
    return
  } else if (model.value.newAccount !== model.value.reEnteredAccount) {
    message.error('两次输入的邮箱不一致')
    return
  }
  // else if(!checkPasswordFormatResult) {
  //   message.error('请按照格式要求输入正确的密码')
  //     return
  // }
  else {
    const params = {
      email: model.value.newAccount,
    }
    userStore.changeAccount(params).then(res => {
      if (res?.data.errorCode === '0') {
        message.info('修改邮箱成功，请重新登录')
        userStore.handleLogout()
        router.push({ path: '/login' })
      } else {
        message.error('修改邮箱失败')
      }
    })
  }
}
</script>

<style scoped lang="scss">
.login-wrap {
  margin: 25px;
  .login {
    width: 450px;
    margin: 180px auto;
    border: 1px solid #efefef;
    padding: 20px;
    border-radius: 10px;

    .logo {
      flex: 1 1 auto;
      margin-top: 10px;
      margin-bottom: 15px;
      margin-left: 5px;
      color: rgb(52, 52, 200);

      h3 {
        text-align: center;
      }
    }
  }
}
</style>
