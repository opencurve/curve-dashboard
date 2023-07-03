<template>
  <!-- <n-card class="login-wrap" bordered embedded > -->
    <!-- <title>Curve控制台系统</title> -->
    <div class="login">
      <!-- <div class="logo"> -->
        <!-- <h3>Curve</h3> -->
      <!-- </div> -->
      <n-form ref="formRef" :rules="rules" :model="model">
        <n-form-item path="oldPassword" label="旧密码">
          <n-input
            @keydown.enter.prevent
            v-model:value="model.oldPassword"
            show-password-on="click"
            placeholder="请输入旧密码"
            type="password"
            label="旧密码"
          />
          <!-- <template #password-visible-icon>
        <n-icon :size="16" :component="GlassesOutline" />
      </template> -->
        </n-form-item>
        <n-form-item path="newPassword" label="新密码">
          <n-input
            type="password"
            show-password-on="click"
            @keydown.enter.prevent
            placeholder="请输入新密码"
            v-model:value="model.newPassword"
          />
        </n-form-item>
        <n-form-item
          ref="reEnterPasswordFormItemRef"
          first
          path="reEnteredPassword"
          label="重复密码"
        >
          <n-input
            type="password"
            v-model:value="model.reEnteredPassword"
            show-password-on="click"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="confirmChangePassword">
                更改密码
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </div>
  <!-- </n-card> -->
</template>

<script setup lang="ts">
import {
  NCard,
  NRow,
  NCol,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
  type FormItemRule,
} from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import md5 from 'js-md5'
import router from '@/router'

const userStore = useUserStore()
const userName = userStore.state.name;

const checkPasswordFormat = (rule: FormItemRule, value: string) => {
  let checkFormat = /.*[A-Z@#$%^&+=!*()_?].*/;
    let checkLength = /^.{6,64}$/;
  return checkFormat.test(value) && checkLength.test(value)
}

interface ModelType {
  oldPassword: string | null
  newPassword: string | null
  reEnteredPassword: string | null
}
const model = ref<ModelType>({
  oldPassword: null,
  newPassword: null,
  reEnteredPassword: null,
})
const message = useMessage()

const validatePasswordSame = (rule: FormItemRule, value: string): boolean => {
  return value === model.value.newPassword
}

const rules: FormRules = {
  oldPassword: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: ['input', 'blur'],
    },
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: checkPasswordFormat,
      message: '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  reEnteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordSame,
      message: '两次输入的密码不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

const confirmChangePassword = () => {
  let checkPasswordFormat = /.*[A-Z@#$%^&+=!*()_?].*/;
  let checkPasswordLength = /^.{6,64}$/;
  const checkPasswordFormatResult = checkPasswordFormat.test(model.value.newPassword) && checkPasswordLength.test(model.value.newPassword);

  if (
    model.value.newPassword === null ||
    model.value.oldPassword === null ||
    model.value.reEnteredPassword === null
  ) {
    message.error('请填写必要的信息')
    return
  } else if (model.value.newPassword !== model.value.reEnteredPassword) {
    message.error('两次输入的密码不一致')
    return
  } 
  else if(!checkPasswordFormatResult) {
    message.error('请按照格式要求输入正确的密码')
      return
  }
  else {
    const params = {
      // userName: userName,
      oldPassword: md5(model.value.oldPassword),
      newPassword: md5(model.value.newPassword),
    }
    userStore.changePassword(params).then(res => {
      if (res?.data.errorCode === '0') {
        message.info('修改密码成功，请重新登录')
        userStore.handleLogout()
        router.push({ path: '/login' })
      } else {
        message.error('修改密码失败')
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
